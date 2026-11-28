


(function () {
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
const T = (v) => M(N(v));
const A = (v, k) => N(+(+v).toFixed(k));
const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
const Q = (v, s) => M(N(v) + u(s));
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);


const EXN = [

() => { const [a, b, c, e] = pk([[2, 5, 1, 4], [1, 3, 1, 4], [3, 8, 1, 6], [2, 5, 1, 3]]), tot = pk([2400, 3600, 4800]), used = a / b + c / e, rn = (1 - used);
const L = (b * e) / g2(b, e), num = L - (a * L) / b - (c * L) / e;
return X({ id: "fracadd", lv: 1, titre: "Le budget de la course d'école",
q: "Pour la course d'école, la classe dispose de " + Q(tot, "CHF") + ". Le transport coûte les " + M(F(a, b)) + " du budget, l'hébergement les " + M(F(c, e)) + ", et le reste sert aux activités.",
parts: [{ label: "Quelle fraction du budget reste-t-il pour les activités ? (fraction irréductible)", pts: 2 }, { label: "Combien de francs cela représente-t-il ?", pts: 1 }, { label: "Une activité coûte " + Q(Math.round(tot * rn * 0.6), "CHF") + ". Quelle fraction du budget total est-ce ? Le reste suffit-il ?", pts: 1 }],
sol: ul([M("1 - \\frac{" + a + "}{" + b + "} - \\frac{" + c + "}{" + e + "} = \\frac{" + num + "}{" + L + "}" + (g2(num, L) > 1 ? " = " + F(num, L) : "")) + ".", M(F(num, L) + " \\cdot " + N(tot) + " = " + N(tot * rn)) + " CHF.", M(F(Math.round(tot * rn * 0.6), tot)) + " du budget ; oui, c'est moins que les " + M(N(tot * rn)) + " CHF disponibles."]) }); },

() => { const [n0, n1] = pk([[4, 6], [6, 9], [4, 10], [6, 8]]), [lait, beurre] = pk([[[3, 4], [1, 5]], [[2, 3], [1, 4]], [[1, 2], [3, 10]]]);
const kL = [lait[0] * n1, lait[1] * n0], kB = [beurre[0] * n1, beurre[1] * n0];
return X({ id: "fracmul", lv: 1, titre: "La recette de crêpes",
q: "Une recette pour " + n0 + " personnes demande " + M(F(...lait)) + " L de lait et " + M(F(...beurre)) + " kg de farine. "  + who() + " cuisine pour " + n1 + " personnes.",
parts: [{ label: "Par quelle fraction faut-il multiplier les quantités ?", pts: 1 }, { label: "Quelle quantité de lait faut-il (fraction irréductible, en L) ?", pts: 1 }, { label: "Il reste les " + M(F(2, 3)) + " d'un paquet de farine de " + M(F(1, 2)) + " kg. Cela suffit-il ?", pts: 2 }],
sol: ul([M(F(n1, n0)) + ".", M(F(...lait) + " \\cdot " + F(n1, n0) + " = " + F(...kL)) + " L.", "Il reste " + M(F(2, 3) + " \\cdot " + F(1, 2) + " = " + F(1, 3)) + " kg ; il faut " + M(F(...kB)) + " kg : " + (kB[0] / kB[1] <= 1 / 3 ? "oui, cela suffit." : "non, cela ne suffit pas (" + M(F(...kB) + " > " + F(1, 3)) + ").")]) }); },

() => { const P = pk([80, 120, 150, 200]), p1 = pk([20, 30, 25]), p2 = pk([10, 15, 20]), f = (1 - p1 / 100) * (1 - p2 / 100), fin = P * f;
return X({ id: "fracconv", lv: 2, titre: "Soldes successifs",
q: "Un manteau coûte " + Q(P, "CHF") + ". En janvier, son prix baisse de " + p1 + " %. En février, le nouveau prix baisse encore de " + p2 + " %. Une affiche annonce : « −" + (p1 + p2) + " % au total ! »",
parts: [{ label: "Calcule le prix en janvier, puis en février.", pts: 2 }, { label: "De quel pourcentage le prix a-t-il baissé en tout ?", pts: 1 }, { label: "L'affiche a-t-elle raison ? Explique.", pts: 1 }],
sol: ul([M(N(P) + " \\cdot " + N(1 - p1 / 100) + " = " + N(P * (1 - p1 / 100))) + " CHF, puis " + M(N(P * (1 - p1 / 100)) + " \\cdot " + N(1 - p2 / 100) + " = " + N(fin)) + " CHF.", M("1 - " + N(r6(f)) + " = " + N(r6(1 - f))) + ", soit " + M(N(r6(100 * (1 - f))) + "\\,\\%") + ".", "Non : la deuxième baisse porte sur le prix déjà baissé, elle « rapporte » moins. La baisse totale (" + N(r6(100 * (1 - f))).replace("{,}", ",") + " %) est plus petite que " + (p1 + p2) + " %."]) }); },

() => { const a = pk([4, 5, 7, 2]), bc = pk([36, 18, 27, 45]);
return X({ id: "fracconv", lv: 2, titre: "Nombres périodiques",
q: "On note " + M("x = 0{,}\\overline{" + a + "}") + " (soit " + M("0{,}" + String(a).repeat(4) + "\\ldots") + ") et " + M("y = 0{,}\\overline{" + bc + "}") + ".",
parts: [{ label: "Calcule " + M("10x - x") + " et déduis-en " + M("x") + " sous forme de fraction.", pts: 2 }, { label: "Même méthode pour " + M("y") + " (choisis bien la puissance de 10).", pts: 2 }, { label: "Calcule " + M("x + y") + " en fraction irréductible.", pts: 1 }],
sol: ul([M("10x - x = " + a) + ", donc " + M("9x = " + a) + " et " + M("x = " + F(a, 9)) + ".", "Période de 2 chiffres : " + M("100y - y = " + bc) + ", " + M("y = \\frac{" + bc + "}{99} = " + F(bc, 99)) + ".", M(F(a, 9) + " + " + F(bc, 99) + " = \\frac{" + (11 * a + bc) + "}{99}" + (g2(11 * a + bc, 99) > 1 ? " = " + F(11 * a + bc, 99) : "")) + "."]) }); },

() => { const t = pk([30, 60]), n0 = pk([4, 8]);
return X({ id: "puiss", lv: 1, titre: "Les bactéries",
q: "Une population de bactéries double toutes les " + t + " minutes. Au départ, il y a " + n0 + " bactérie" + (n0 > 1 ? "s" : "") + ".",
parts: [{ label: "Combien y en a-t-il après 4 doublements ? Écris-le avec une puissance de 2.", pts: 1 }, { label: "Combien y en a-t-il après " + (10 * t) / 60 + " h ?", pts: 1 }, { label: "Après combien de doublements dépasse-t-on un million ?", pts: 2 }, { label: "Que représente " + M(n0 + " \\cdot 2^{-1}") + " dans cette situation ?", pts: 1 }],
sol: ul([M(n0 + " \\cdot 2^4 = " + n0 * 16) + ".", (10 * t) / 60 + " h = 10 doublements : " + M(n0 + " \\cdot 2^{10} = " + N(n0 * 1024)) + ".", M(n0 + " \\cdot 2^{" + Math.ceil(Math.log2(1e6 / n0)) + "} = " + N(n0 * 2 ** Math.ceil(Math.log2(1e6 / n0)))) + " : " + Math.ceil(Math.log2(1e6 / n0)) + " doublements (" + M(n0 + " \\cdot 2^{" + (Math.ceil(Math.log2(1e6 / n0)) - 1) + "}") + " est encore trop petit).", "Le nombre de bactéries " + t + " minutes <b>avant</b> le départ : " + M(N(n0 / 2)) + "."]) }); },

() => { const [star, al] = pk([["Proxima du Centaure", 4.2], ["Sirius", 8.6], ["Véga", 25]]);
return X({ id: "scicalc", lv: 2, titre: "Distances dans l'Univers",
q: "La lumière parcourt " + M("3 \\cdot 10^5") + " km par seconde. Une année compte environ " + M("3{,}15 \\cdot 10^7") + " s. L'étoile " + star + " est à " + T(al) + " années-lumière.",
parts: [{ label: "Calcule la distance parcourue par la lumière en un an (une année-lumière), en km, en notation scientifique.", pts: 2 }, { label: "Calcule la distance de " + star + " en km.", pts: 1 }, { label: "Une sonde voyage à " + M("6 \\cdot 10^4") + " km/h. Combien d'années lui faudrait-il ? (ordre de grandeur)", pts: 2 }],
sol: ul([M("3 \\cdot 10^5 \\cdot 3{,}15 \\cdot 10^7 = 9{,}45 \\cdot 10^{12}") + " km.", M(N(al) + " \\cdot 9{,}45 \\cdot 10^{12} \\approx " + A((al * 9.45) / (al * 9.45 >= 10 ? 10 : 1), 2) + " \\cdot 10^{" + (al * 9.45 >= 10 ? 13 : 12) + "}") + " km.", "Durée : " + M(A(al * 9.45, 2) + " \\cdot 10^{12} : (6 \\cdot 10^4) \\approx " + A((al * 9.45) / 6, 2) + " \\cdot 10^8") + " h, soit environ " + M(N(Math.round((al * 9.45e12) / 6e4 / 24 / 365 / 1000) * 1000)) + " ans."]) }); },

() => X({ id: "scicalc", lv: 2, titre: "Fourmis contre humains",
q: "On estime qu'il y a environ " + M("2 \\cdot 10^{16}") + " fourmis sur Terre, d'une masse moyenne de " + M("3 \\cdot 10^{-6}") + " kg. Il y a environ " + M("8 \\cdot 10^9") + " humains, d'une masse moyenne de " + M("60") + " kg.",
parts: [{ label: "Calcule la masse totale des fourmis (en kg, notation scientifique).", pts: 1 }, { label: "Calcule la masse totale des humains.", pts: 1 }, { label: "Qui pèse le plus en tout, et combien de fois plus ? (au dixième)", pts: 2 }],
sol: ul([M("2 \\cdot 10^{16} \\cdot 3 \\cdot 10^{-6} = 6 \\cdot 10^{10}") + " kg.", M("8 \\cdot 10^9 \\cdot 60 = 480 \\cdot 10^9 = 4{,}8 \\cdot 10^{11}") + " kg.", "Les humains : " + M("4{,}8 \\cdot 10^{11} : (6 \\cdot 10^{10}) = 8") + " fois plus."]) }),

() => { const k = pk([2, 3]);
return X({ id: "prio", lv: 3, titre: "Calculs en chaîne",
q: "Calcule sans calculatrice, en détaillant chaque étape.",
parts: [{ label: M("A = 5 - 2 \\cdot (3 - " + (k + 4) + ")^2"), pts: 1 }, { label: M("B = \\frac{2}{3} + \\frac{1}{4} \\cdot \\frac{8}{9}"), pts: 1 }, { label: M("C = \\frac{(-2)^3 + 4^2}{10^{-1} \\cdot 20}"), pts: 2 }, { label: "Place des parenthèses dans " + M("2 + 3 \\cdot 4 - 1") + " pour obtenir 15.", pts: 1 }],
sol: ul([M("5 - 2 \\cdot (-" + (k + 1) + ")^2 = 5 - 2 \\cdot " + (k + 1) ** 2 + " = " + (5 - 2 * (k + 1) ** 2)) + ".", M("\\frac{2}{3} + \\frac{2}{9} = \\frac{6}{9} + \\frac{2}{9} = \\frac{8}{9}") + " (la multiplication d'abord).", M("\\frac{-8 + 16}{0{,}1 \\cdot 20} = \\frac{8}{2} = 4") + ".", M("(2 + 3) \\cdot (4 - 1) = 15") + "."]) }); },

() => X({ id: "puiss", lv: 3, titre: "Calcul astucieux",
q: "Calcule astucieusement, sans calculatrice, en utilisant les propriétés des puissances.",
parts: [{ label: M("2^{10} \\cdot 5^{8}"), pts: 1 }, { label: M("\\frac{6^5}{2^4 \\cdot 3^3}"), pts: 1 }, { label: M("0{,}25^{5} \\cdot 4^{6}"), pts: 1 }, { label: "Range dans l'ordre croissant : " + M("2^{30}") + ", " + M("3^{20}") + ", " + M("10^{9}") + " (indice : " + M("2^{10} \\approx 10^3") + ").", pts: 2 }],
sol: ul([M("2^2 \\cdot (2 \\cdot 5)^8 = 4 \\cdot 10^8") + ".", M("2^{5-4} \\cdot 3^{5-3} = 2 \\cdot 9 = 18") + ".", M("(0{,}25 \\cdot 4)^5 \\cdot 4 = 1 \\cdot 4 = 4") + ".", M("2^{30} = (2^{10})^3 \\approx 1{,}07 \\cdot 10^9") + ", " + M("3^{20} = (3^{10})^2 \\approx 3{,}5 \\cdot 10^9") + " : " + M("10^9 < 2^{30} < 3^{20}") + "."]) }),
];
const RAISONN = [
() => { const [a, b, c, d] = pk([[2, 3, 1, 4], [1, 2, 1, 3], [3, 5, 1, 2]]), w = who();
return X({ id: "fracadd", lv: 1, titre: "Trouve l'erreur",
q: w + " écrit : " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "} = \\frac{" + (a + c) + "}{" + (b + d) + "}") + ".",
parts: [{ label: "Sans calculer la bonne réponse, explique pourquoi c'est forcément faux (compare avec " + M("\\frac{" + a + "}{" + b + "}") + ").", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
sol: ul([M("\\frac{" + (a + c) + "}{" + (b + d) + "} \\approx " + A((a + c) / (b + d), 2)) + " est plus petit que " + M("\\frac{" + a + "}{" + b + "} \\approx " + A(a / b, 2)) + " : en ajoutant un nombre positif, on ne peut pas obtenir moins.", M("\\frac{" + a * d + "}{" + b * d + "} + \\frac{" + c * b + "}{" + b * d + "} = " + F(a * d + c * b, b * d)) + "."]) }); },
() => { const S = [["« " + M("(-2)^4 = -16") + " »", false, M("(-2)^4 = 16") + " : quatre facteurs négatifs, résultat positif."], ["« " + M("2^3 \\cdot 2^4 = 2^{12}") + " »", false, "On additionne les exposants : " + M("2^7") + "."], ["« " + M("10^{-2} = 0{,}01") + " »", true, M("10^{-2} = \\frac{1}{100}") + "."], ["« " + M("5^0 = 0") + " »", false, M("5^0 = 1") + " (" + M("5^1 : 5") + ")."]];
return X({ id: "puiss", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
() => { const w = who();
return X({ id: "scicalc", lv: 2, titre: "Trouve l'erreur",
q: w + " calcule " + M("(3 \\cdot 10^4) \\cdot (4 \\cdot 10^{-7})") + " et écrit : « " + M("= 12 \\cdot 10^{-28}") + ", c'est en notation scientifique ».",
parts: [{ label: "Trouve les deux erreurs de " + w + ".", pts: 2 }, { label: "Donne le bon résultat en notation scientifique.", pts: 1 }],
sol: ul(["Les exposants s'<b>additionnent</b> (" + M("4 + (-7) = -3") + "), ils ne se multiplient pas ; et 12 n'est pas entre 1 et 10.", M("12 \\cdot 10^{-3} = 1{,}2 \\cdot 10^{-2}") + "."]) }); },
() => { const p = pk([10, 20, 50]);
return X({ id: "fracconv", lv: 2, titre: "Retour au prix de départ ?",
q: "Un prix augmente de " + p + " %, puis le nouveau prix baisse de " + p + " %. " + who() + " affirme : « on revient au prix de départ ».",
parts: [{ label: "Teste avec un prix de 100 CHF.", pts: 1 }, { label: "L'affirmation est-elle vraie ? Explique avec les coefficients multiplicateurs.", pts: 2 }],
sol: ul([M("100 \\cdot " + N(1 + p / 100) + " = " + (100 + p)) + ", puis " + M((100 + p) + " \\cdot " + N(1 - p / 100) + " = " + N((100 + p) * (1 - p / 100))) + " CHF.", "Faux : " + M(N(1 + p / 100) + " \\cdot " + N(1 - p / 100) + " = " + N((1 + p / 100) * (1 - p / 100))) + ", le prix baisse de " + M(N((p * p) / 100) + "\\,\\%") + " au total. La baisse porte sur un prix plus grand."]) }); },
];


const EXP = [
() => { const [a, h, c] = pk([[6, 8, 10], [9, 12, 15], [7, 24, 25], [5, 12, 13]]), d2 = a + pk([1, 2]);
return X({ id: "pyth", lv: 1, titre: "L'échelle des pompiers",
q: "Une échelle de " + Q(c, "m") + " est appuyée contre une façade verticale. Son pied est à " + Q(a, "m") + " du mur.",
parts: [{ label: "Fais un croquis et calcule la hauteur atteinte par le haut de l'échelle.", pts: 2 }, { label: "On recule le pied de l'échelle jusqu'à " + Q(d2, "m") + " du mur. De combien le haut descend-il ? (au cm)", pts: 2 }],
sol: ul([M("h = \\sqrt{" + c + "^2 - " + a + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.", "Nouvelle hauteur " + M("\\sqrt{" + c * c + " - " + d2 * d2 + "} \\approx " + A(Math.sqrt(c * c - d2 * d2), 2)) + " m : il descend d'environ " + M(A(h - Math.sqrt(c * c - d2 * d2), 2)) + " m."]) }); },
() => { const a = pk([60, 80, 90]), b = pk([45, 60, 120]), d = Math.sqrt(a * a + b * b), v = pk([1.2, 1.5]);
return X({ id: "pyth", lv: 1, titre: "Le raccourci",
q: "Pour traverser un parc rectangulaire de " + Q(a, "m") + " sur " + Q(b, "m") + ", " + who() + " coupe en diagonale au lieu de longer deux côtés. On marche à " + Q(v, "m/s") + ".",
parts: [{ label: "Calcule la longueur de la diagonale (au dixième).", pts: 2 }, { label: "Combien de mètres économise-t-on ?", pts: 1 }, { label: "Combien de secondes gagne-t-on ?", pts: 1 }],
sol: ul([M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + A(d, 1)) + " m.", M((a + b) + " - " + A(d, 1) + " \\approx " + A(a + b - d, 1)) + " m.", M(A(a + b - d, 1) + " : " + N(v) + " \\approx " + A((a + b - d) / v, 0)) + " s."]) }); },
() => { const x0 = R.int(-3, 1), y0 = R.int(-3, 1), [p, q] = pk([[4, 2], [3, 1], [2, 4], [6, 3]]);
const A0 = [x0, y0], B0 = [x0 + p, y0 + q], C0 = [x0 + p - q, y0 + q + p];
const ab = p * p + q * q, bc = q * q + p * p, ac = (p - q) ** 2 + (q + p) ** 2;
return X({ id: "pythrec", lv: 2, titre: "Un triangle dans un repère",
q: "Dans un repère orthonormé (unité : 1 cm), on place " + M("A(" + A0.join(" \\,;\\, ") + ")") + ", " + M("B(" + B0.join(" \\,;\\, ") + ")") + " et " + M("C(" + C0.join(" \\,;\\, ") + ")") + ".",
parts: [{ label: "Calcule " + M("AB^2") + ", " + M("BC^2") + " et " + M("AC^2") + ".", pts: 2 }, { label: "Le triangle " + M("ABC") + " est-il rectangle ? Justifie.", pts: 1 }, { label: "Calcule son aire.", pts: 1 }],
sol: ul([M("AB^2 = " + p + "^2 + " + q + "^2 = " + ab) + ", " + M("BC^2 = " + q + "^2 + " + p + "^2 = " + bc) + ", " + M("AC^2 = " + Math.abs(p - q) + "^2 + " + (p + q) + "^2 = " + ac) + ".", M(ab + " + " + bc + " = " + (ab + bc) + " = AC^2") + " : rectangle en " + M("B") + " (réciproque de Pythagore), et isocèle.", M("\\frac{AB \\cdot BC}{2} = \\frac{" + ab + "}{2} = " + N(ab / 2)) + " cm² (car " + M("AB = BC") + ")."]) }); },
() => { const [a, b, c, d] = pk([[30, 40, 120, 130], [20, 40, 40, 60], [10, 20, 20, 30], [40, 40, 70, 90]]), stick = pk([d - 5, d + 5]);
return X({ id: "pythfig", lv: 2, titre: "Le bâton dans la boîte",
q: "Une boîte en forme de pavé droit mesure " + a + " cm × " + b + " cm × " + c + " cm. On veut y ranger un bâton rigide de " + stick + " cm.",
parts: [{ label: "Calcule la diagonale du fond " + a + " × " + b + ".", pts: 1 }, { label: "Calcule la grande diagonale de la boîte.", pts: 2 }, { label: "Le bâton entre-t-il dans la boîte ? Justifie.", pts: 1 }],
sol: ul([M("\\sqrt{" + a + "^2 + " + b + "^2} \\approx " + A(Math.hypot(a, b), 2)) + " cm.", M("\\sqrt{" + a + "^2 + " + b + "^2 + " + c + "^2} = \\sqrt{" + d * d + "} = " + d) + " cm.", stick <= d ? "Oui : " + stick + " cm ≤ " + d + " cm, en le plaçant le long de la grande diagonale." : "Non : " + stick + " cm > " + d + " cm, la plus grande longueur possible dans la boîte."]) }); },
() => { const r = pk([4, 5, 6]);
return X({ id: "pythfig", lv: 3, titre: "Le carré dans le cercle",
q: "Un carré " + M("ABCD") + " est inscrit dans un cercle de centre " + M("O") + " et de rayon " + Q(r, "cm") + ".",
parts: [{ label: "Que représente la diagonale " + M("[AC]") + " pour le cercle ? Quelle est sa longueur ?", pts: 1 }, { label: "Calcule la valeur exacte du côté du carré.", pts: 2 }, { label: "Calcule l'aire du carré, puis le pourcentage du disque qu'il occupe (au %).", pts: 2 }],
sol: ul(["Un diamètre : " + M(2 * r) + " cm.", M("c^2 + c^2 = " + 4 * r * r) + ", " + M("c^2 = " + 2 * r * r) + ", " + M("c = \\sqrt{" + 2 * r * r + "} = " + r + "\\sqrt{2}") + " cm.", "Aire " + M(2 * r * r) + " cm² ; disque " + M(r * r + "\\pi") + " ; " + M("\\frac{" + 2 * r * r + "}{" + r * r + "\\pi} = \\frac{2}{\\pi} \\approx 64\\,\\%") + "."]) }); },
() => { const p = pk([32, 43, 55, 65]);
return X({ id: "pyth", lv: 3, titre: "L'écran 16:9",
q: "La taille d'un écran est la longueur de sa diagonale, en pouces (1 pouce = " + Q(2.54, "cm") + "). Un écran 16:9 a une largeur " + M("16k") + " et une hauteur " + M("9k") + ". On considère un écran de " + p + " pouces.",
parts: [{ label: "Diagonale en cm (au dixième).", pts: 1 }, { label: "Montre que " + M("(16k)^2 + (9k)^2 = 337k^2") + " et calcule " + M("k") + " (au centième).", pts: 2 }, { label: "Calcule la largeur et la hauteur de l'écran (au cm).", pts: 2 }],
sol: ul([M(p + " \\cdot 2{,}54 = " + A(p * 2.54, 1)) + " cm.", M("256k^2 + 81k^2 = 337k^2") + " ; " + M("k = \\frac{" + A(p * 2.54, 1) + "}{\\sqrt{337}} \\approx " + A((p * 2.54) / Math.sqrt(337), 2)) + ".", "Largeur " + M("\\approx " + A((16 * p * 2.54) / Math.sqrt(337), 0)) + " cm, hauteur " + M("\\approx " + A((9 * p * 2.54) / Math.sqrt(337), 0)) + " cm."]) }); },
];
const RAISONP = [
() => { const [a, b, c] = pk([[5, 12, 13], [6, 8, 10], [9, 12, 15]]), w = who();
return X({ id: "pyth", lv: 1, titre: "Trouve l'erreur",
q: "Dans un triangle rectangle de cathètes " + a + " cm et " + b + " cm, " + w + " écrit : « l'hypoténuse mesure " + (a + b) + " cm ».",
parts: [{ label: "Explique pourquoi c'est impossible (pense aux côtés d'un triangle).", pts: 1 }, { label: "Calcule l'hypoténuse correctement.", pts: 1 }],
sol: ul(["Dans un triangle, un côté est toujours plus court que la somme des deux autres (inégalité triangulaire) : " + (a + b) + " cm donnerait un triangle « aplati ».", M("\\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm."]) }); },
() => { const S = [["« Le triangle de côtés 5, 7 et 9 est rectangle. »", false, M("25 + 49 = 74 \\ne 81") + "."], ["« Le triangle de côtés 1,5 ; 2 et 2,5 est rectangle. »", true, M("2{,}25 + 4 = 6{,}25 = 2{,}5^2") + "."], ["« Dans un triangle rectangle, l'hypoténuse est le plus grand côté. »", true, M("c^2 = a^2 + b^2 > a^2") + ", donc " + M("c > a") + " (et de même " + M("c > b") + ")."], ["« Un triangle de côtés 3, 4 et 6 est rectangle, car 3 + 4 > 6. »", false, "Il faut comparer les carrés : " + M("9 + 16 = 25 \\ne 36") + "."]];
return X({ id: "pythrec", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
() => { const [a, b, c] = pk([[60, 80, 100], [30, 40, 50], [90, 120, 150]]);
return X({ id: "pythrec", lv: 2, titre: "L'équerre du maçon",
q: "Pour tracer un angle droit sans équerre, un maçon marque " + a + " cm sur un mur et " + b + " cm sur l'autre, à partir du coin. Il mesure ensuite la distance entre les deux marques.",
parts: [{ label: "Quelle distance doit-il trouver si l'angle est droit ? Justifie.", pts: 1 }, { label: "Il mesure " + (c + 3) + " cm. L'angle est-il droit ? Plus grand ou plus petit qu'un angle droit ?", pts: 2 }],
sol: ul([M(c) + " cm, car " + M(a + "^2 + " + b + "^2 = " + c * c + " = " + c + "^2") + " (réciproque de Pythagore).", "Non : " + M((c + 3) + "^2 = " + (c + 3) ** 2 + " \\ne " + c * c) + ". La distance est trop grande : les murs sont plus écartés, l'angle est plus grand qu'un angle droit."]) }); },
() => { const w = who();
return X({ id: "pythfig", lv: 2, titre: "Trouve l'erreur",
q: "Pour la hauteur d'un triangle isocèle de côtés 13 cm, 13 cm et de base 10 cm, " + w + " écrit : « " + M("h^2 = 13^2 - 10^2 = 69") + ", donc " + M("h \\approx 8{,}3") + " cm ».",
parts: [{ label: "Quelle est l'erreur ? Fais un croquis.", pts: 1 }, { label: "Calcule la hauteur correctement.", pts: 1 }],
sol: ul(["La hauteur coupe la base en son milieu : le triangle rectangle a pour côté la <b>demi</b>-base, 5 cm.", M("h = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12") + " cm."]) }); },
];


const EX3 = [
() => { const a = pk([60, 80, 100]), b = pk([30, 40]), c = pk([40, 50]), L = pk([30, 40, 60]);
return X({ id: "vol", lv: 1, titre: "L'aquarium",
q: "Un aquarium en forme de pavé mesure " + a + " cm de long, " + b + " cm de large et " + c + " cm de haut.",
parts: [{ label: "Calcule son volume en cm³, puis sa contenance en litres.", pts: 2 }, { label: "On y verse " + L + " L d'eau. À quelle hauteur monte l'eau (au mm) ?", pts: 2 }],
sol: ul([M(a + " \\cdot " + b + " \\cdot " + c + " = " + N(a * b * c)) + " cm³ = " + M(N((a * b * c) / 1000)) + " L.", M(L + "\\ \\text{L} = " + N(L * 1000)) + " cm³ ; " + M("h = " + N(L * 1000) + " : " + a * b + " \\approx " + A((L * 1000) / (a * b), 1)) + " cm."]) }); },
() => { const r = pk([3.3, 3.2, 3]), V = 33;
return X({ id: "vol", lv: 2, titre: "La canette",
q: "Une canette cylindrique contient 33 cL. Son rayon intérieur est " + Q(r, "cm") + ".",
parts: [{ label: "Exprime 33 cL en cm³.", pts: 1 }, { label: "Calcule la hauteur minimale de la canette (au mm supérieur : elle doit contenir les 33 cL).", pts: 2 }, { label: "Calcule l'aire totale de métal (disques et paroi), en cm², pour cette hauteur.", pts: 2 }],
sol: (() => {
const hx = 330 / (Math.PI * r * r), hm = Math.ceil(hx * 10 - 1e-9) / 10;
return ul(["330 cm³.", M("h = \\frac{330}{\\pi \\cdot " + N(r) + "^2} \\approx " + A(hx, 3)) + " cm, donc au mm supérieur " + M(A(hm, 1)) + " cm (une hauteur plus petite ne contiendrait pas les 33 cL).", M("2\\pi \\cdot " + N(r) + "^2 + 2\\pi \\cdot " + N(r) + " \\cdot " + A(hm, 1) + " \\approx " + A(2 * Math.PI * r * r + 2 * Math.PI * r * hm, 1)) + " cm²."]); })() }); },
() => X({ id: "airepyr", lv: 2, titre: "La pyramide du Louvre",
q: "La pyramide du Louvre est une pyramide régulière à base carrée de côté " + Q(35.4, "m") + " et de hauteur " + Q(21.6, "m") + ". Ses quatre faces sont en verre.",
parts: [{ label: "Calcule son volume (au m³).", pts: 1 }, { label: "Calcule son apothème (au cm).", pts: 2 }, { label: "Calcule la surface de verre (au m²).", pts: 2 }],
sol: ul([M("\\frac{35{,}4^2 \\cdot 21{,}6}{3} \\approx 9\\text{'}023") + " m³.", M("\\sqrt{21{,}6^2 + 17{,}7^2} \\approx 27{,}93") + " m.", M("4 \\cdot \\frac{35{,}4 \\cdot 27{,}93}{2} \\approx 1\\text{'}977") + " m²."]) }),
() => { const r = pk([2, 3]), h = pk([6, 8, 10]), rho = 0.8;
return X({ id: "volcomp", lv: 2, titre: "Le silo à grains",
q: "Un silo est formé d'un cylindre de rayon " + Q(r, "m") + " et de hauteur " + Q(h, "m") + ", surmonté d'une demi-boule de même rayon. Un mètre cube de blé pèse environ " + M("0{,}8") + " tonne.",
parts: [{ label: "Calcule le volume exact du silo (avec " + M("\\pi") + ").", pts: 2 }, { label: "Donne une valeur arrondie au m³.", pts: 1 }, { label: "Quelle masse de blé contient-il quand il est plein ? (à la tonne)", pts: 1 }],
sol: ul(["Cylindre " + M(r * r * h + "\\pi") + ", demi-boule " + M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + F(2 * r ** 3, 3) + "\\pi") + " ; total " + M(F(3 * r * r * h + 2 * r ** 3, 3) + "\\pi") + " m³.", M("\\approx " + A(((3 * r * r * h + 2 * r ** 3) / 3) * Math.PI, 0)) + " m³.", M("\\approx " + A((((3 * r * r * h + 2 * r ** 3) / 3) * Math.PI * rho), 0)) + " t."]) }); },
() => { const r = 3, L = pk([14, 16, 18]);
return X({ id: "volcomp", lv: 3, titre: "La gélule",
q: "Une gélule a la forme d'un cylindre terminé par deux demi-boules. Son diamètre est " + Q(2 * r, "mm") + " et sa longueur totale " + Q(L, "mm") + ".",
parts: [{ label: "Quelle est la longueur de la partie cylindrique ?", pts: 1 }, { label: "Calcule le volume exact de la gélule (en mm³, avec " + M("\\pi") + ").", pts: 2 }, { label: "Combien de gélules peut-on remplir avec 1 cm³ de poudre ? (1 cm³ = 1000 mm³)", pts: 1 }],
sol: ul([M(L + " - 2 \\cdot " + r + " = " + (L - 2 * r)) + " mm.", "Boule " + M("36\\pi") + " + cylindre " + M(9 * (L - 2 * r) + "\\pi") + " = " + M((36 + 9 * (L - 2 * r)) + "\\pi \\approx " + A((36 + 9 * (L - 2 * r)) * Math.PI, 1)) + " mm³.", M("1000 : " + A((36 + 9 * (L - 2 * r)) * Math.PI, 1) + " \\approx " + A(1000 / ((36 + 9 * (L - 2 * r)) * Math.PI), 1)) + " : " + Math.floor(1000 / ((36 + 9 * (L - 2 * r)) * Math.PI)) + " gélules complètes."]) }); },
() => { const r = pk([3, 4]), h = pk([9, 12]);
return X({ id: "volcone", lv: 1, titre: "Le cornet de glace",
q: "Un cornet a la forme d'un cône de rayon " + Q(r, "cm") + " et de hauteur " + Q(h, "cm") + ". On le remplit de glace, puis on pose dessus une demi-boule de glace de même rayon.",
parts: [{ label: "Calcule le volume du cône (valeur exacte).", pts: 1 }, { label: "Calcule le volume de la demi-boule (valeur exacte).", pts: 1 }, { label: "Quel volume de glace en tout ? Quelle part (en %) est dans le cône ?", pts: 2 }],
sol: ul([M("\\frac{1}{3}\\pi \\cdot " + r + "^2 \\cdot " + h + " = " + (r * r * h) / 3 + "\\pi") + " cm³.", M("\\frac{2}{3}\\pi \\cdot " + r + "^3 = " + F(2 * r ** 3, 3) + "\\pi") + " cm³.", M(F(r * r * h + 2 * r ** 3, 3) + "\\pi \\approx " + A(((r * r * h + 2 * r ** 3) / 3) * Math.PI, 1)) + " cm³ ; dans le cône : " + M("\\approx " + A((100 * r * r * h) / (r * r * h + 2 * r ** 3), 0) + "\\,\\%") + "."]) }); },
() => X({ id: "volcone", lv: 3, titre: "Variations",
q: "On s'intéresse à l'effet d'un agrandissement sur les volumes.",
parts: [{ label: "Une boule a un rayon de 3 cm. Calcule son volume (exact). Même question pour un rayon de 6 cm.", pts: 1 }, { label: "Par combien le volume est-il multiplié quand le rayon double ? Explique avec la formule.", pts: 1 }, { label: "Un cône a une hauteur de 6 cm et un rayon de 2 cm. Que devient son volume si on double le rayon seulement ? la hauteur seulement ?", pts: 2 }],
sol: ul([M("36\\pi") + " et " + M("288\\pi") + " cm³.", "Par " + M("2^3 = 8") + " : " + M("\\frac{4}{3}\\pi (2r)^3 = 8 \\cdot \\frac{4}{3}\\pi r^3") + ".", "Rayon doublé : volume × 4 (" + M("r^2") + ") ; hauteur doublée : volume × 2."]) }),
() => { const r = pk([4, 5, 6]), V = pk([20, 25, 30]);
return X({ id: "volmanq", lv: 2, titre: "Le verre conique",
q: "On veut fabriquer un verre en forme de cône de rayon " + Q(r, "cm") + " qui contienne exactement " + V + " cL.",
parts: [{ label: "Exprime le volume en cm³.", pts: 1 }, { label: "Calcule la profondeur (hauteur) du verre, au mm.", pts: 2 }, { label: "On remplit le verre jusqu'à mi-hauteur : le liquide forme un cône deux fois plus petit. Quelle fraction du verre est remplie ?", pts: 1 }],
sol: ul([M(V * 10) + " cm³.", M("h = \\frac{3 \\cdot " + V * 10 + "}{\\pi \\cdot " + r + "^2} \\approx " + A((3 * V * 10) / (Math.PI * r * r), 1)) + " cm.", "Toutes les longueurs divisées par 2, le volume par " + M("2^3 = 8") + " : " + M("\\frac{1}{8}") + " du verre seulement !"]) }); },
];
const RAISON3 = [
() => { const r = pk([3, 6]), h = pk([4, 5]), w = who();
return X({ id: "volcone", lv: 1, titre: "Trouve l'erreur",
q: w + " calcule le volume d'un cône de rayon " + r + " cm et de hauteur " + h + " cm : « " + M("V = \\pi \\cdot " + r + "^2 \\cdot " + h + " = " + r * r * h + "\\pi") + " cm³ ».",
parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule le bon volume.", pts: 1 }],
sol: ul(["C'est le volume du cylindre ; le cône en vaut le tiers.", M("\\frac{" + r * r * h + "\\pi}{3} = " + (r * r * h) / 3 + "\\pi") + " cm³."]) }); },
() => { const S = [["« Si on double le rayon d'une boule, son volume double. »", false, "Il est multiplié par " + M("2^3 = 8") + "."], ["« Une pyramide vaut le tiers du prisme de même base et même hauteur. »", true, M("V = \\frac{1}{3} A_{\\text{base}} \\cdot h") + "."], ["« 1 L = 100 cm³. »", false, M("1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3") + "."], ["« L'aire d'une sphère de rayon " + M("r") + " vaut " + M("4\\pi r^2") + ". »", true, "C'est la formule (4 fois l'aire d'un grand disque)."]];
return X({ id: "volcone", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
() => { const d = pk([8, 10, 12]), h = pk([5, 7]), w = who();
return X({ id: "vol", lv: 2, titre: "Trouve l'erreur",
q: "Un cylindre a un diamètre de " + d + " cm et une hauteur de " + h + " cm. " + w + " écrit : « " + M("V = \\pi \\cdot " + d + "^2 \\cdot " + h + " = " + d * d * h + "\\pi") + " cm³ ».",
parts: [{ label: "Quelle est l'erreur ? Par combien le résultat de " + w + " est-il trop grand ?", pts: 2 }, { label: "Calcule le bon volume.", pts: 1 }],
sol: ul(["Il a pris le diamètre au lieu du rayon : le rayon est doublé, donc le volume est 4 fois trop grand.", M("\\pi \\cdot " + d / 2 + "^2 \\cdot " + h + " = " + (d * d * h) / 4 + "\\pi") + " cm³."]) }); },
() => X({ id: "airepyr", lv: 2, titre: "Hauteur ou apothème ?",
q: "Une pyramide régulière à base carrée a un côté de base de 12 cm et une hauteur de 8 cm. " + who() + " calcule son aire latérale : « " + M("4 \\cdot \\frac{12 \\cdot 8}{2} = 192") + " cm² ».",
parts: [{ label: "Quelle longueur aurait-il fallu utiliser à la place de 8 cm ? Pourquoi ?", pts: 1 }, { label: "Calcule-la, puis calcule l'aire latérale correcte.", pts: 2 }],
sol: ul(["L'apothème : c'est la hauteur des faces triangulaires, pas celle de la pyramide.", M("a = \\sqrt{8^2 + 6^2} = 10") + " cm ; aire latérale " + M("4 \\cdot \\frac{12 \\cdot 10}{2} = 240") + " cm²."]) }),
];

RICH.no11 = { ids: ["prio", "fracadd", "fracmul", "fracconv", "puiss", "sci", "scicalc"], label: "Nombres et opérations", ex: EXN, raison: RAISONN, minutes: 45, minA: 2 };
RICH.pyth11 = { ids: ["pyth", "pythfig", "pythrec"], label: "Théorème de Pythagore", ex: EXP, raison: RAISONP, minutes: 45, minA: 2 };
RICH.gm3d11 = { ids: ["vol", "volcone", "airepyr", "volcomp", "volmanq"], label: "Volumes et aires (3D)", ex: EX3, raison: RAISON3, minutes: 45, minA: 2 };
})();




(function () {
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
const Q = (v, s) => M(N(v) + u(s));
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);
const P1 = (n) => (n === 1 ? "" : "s");


const EXA = [
() => { const a = pk([35, 42, 48, 55, 62]);
return X({ id: "angles", lv: 1, titre: "Le passage piéton",
q: "Deux bords de route parallèles sont coupés par un passage piéton en biais. Le passage fait un angle de " + M(a + "°") + " avec le premier bord.",
parts: [{ label: "Quel angle fait-il avec le second bord, du côté opposé (alterne-interne) ? Justifie.", pts: 1 }, { label: "Quel angle fait-il avec le second bord, du même côté (entre les deux bords) ?", pts: 1 }],
sol: ul([M(a + "°") + " : avec des droites parallèles, les angles alternes-internes sont égaux.", M("180° - " + a + "° = " + (180 - a) + "°") + " : angles co-intérieurs supplémentaires."]) }); },
() => { const a = pk([38, 46, 52, 64]), b = pk([71, 77, 83]);
return X({ id: "angles", lv: 1, titre: "Le cerf-volant",
q: "Les deux baguettes d'un cerf-volant forment, avec la toile, un triangle dont deux angles mesurent " + M(a + "°") + " et " + M(b + "°") + ".",
parts: [{ label: "Calcule le troisième angle.", pts: 1 }, { label: "Le triangle est-il rectangle ? isocèle ? Justifie.", pts: 1 }],
sol: ul([M("180° - " + a + "° - " + b + "° = " + (180 - a - b) + "°") + ".", (180 - a - b === 90 ? "Il est rectangle. " : "Il n'est pas rectangle (aucun angle de 90°). ") + ([a, b, 180 - a - b].some((x, i, t) => t.indexOf(x) !== i) ? "Il est isocèle (deux angles égaux)." : "Il n'est pas isocèle (trois angles différents).")]) }); },
() => { const [d, c] = pk([[10, 6], [13, 5], [17, 8], [25, 7]]), b = Math.sqrt(d * d - c * c);
return X({ id: "cercthales", lv: 2, titre: "La table ronde",
q: "Une table ronde a un diamètre " + M("[AB]") + " de " + Q(d, "dm") + ". " + who() + " tend une ficelle de " + M("A") + " à un point " + M("C") + " du bord (" + Q(c, "dm") + "), puis de " + M("C") + " à " + M("B") + ".",
parts: [{ label: "Que vaut l'angle " + M("\\widehat{ACB}") + " ? Quelle propriété utilises-tu ?", pts: 1 }, { label: "Calcule la longueur " + M("CB") + ".", pts: 2 }, { label: "Calcule la longueur totale de ficelle.", pts: 1 }],
sol: ul([M("90°") + " : un triangle inscrit dans un demi-cercle est rectangle (cercle de Thalès).", "Pythagore : " + M("CB = \\sqrt{" + d + "^2 - " + c + "^2} = " + b) + " dm.", M(c + " + " + b + " = " + (c + b)) + " dm."]) }); },
() => { const r = pk([3, 4, 5, 6]), d = pk([5, 5, 10, 10]) * (r === 3 || r === 6 ? 1 : 1), t = r === 3 ? [3, 5, 4] : r === 4 ? [4, 5, 3] : r === 5 ? [5, 13, 12] : [6, 10, 8];
return X({ id: "cercthales", lv: 2, titre: "La tangente au rond-point",
q: "Un rond-point circulaire a un rayon de " + Q(t[0], "dam") + ". Une route droite touche le rond-point en un seul point " + M("T") + " (elle est tangente). Une voiture sur cette route est en " + M("V") + ", à " + Q(t[1], "dam") + " du centre " + M("O") + ".",
parts: [{ label: "Quel angle font la route et le rayon " + M("[OT]") + " ?", pts: 1 }, { label: "Calcule la distance " + M("VT") + " entre la voiture et le point de contact.", pts: 2 }],
sol: ul([M("90°") + " : la tangente est perpendiculaire au rayon au point de contact.", M("VT = \\sqrt{" + t[1] + "^2 - " + t[0] + "^2} = " + t[2]) + " dam (Pythagore dans " + M("OTV") + ", rectangle en " + M("T") + ")."]) }); },
() => { const a = pk([24, 32, 36, 42]);
return X({ id: "cercthales", lv: 3, titre: "Angles au centre et inscrits",
q: "Sur un cercle de centre " + M("O") + ", les points " + M("A") + ", " + M("B") + " et " + M("C") + " sont tels que l'angle inscrit " + M("\\widehat{ACB}") + " mesure " + M(a + "°") + ".",
parts: [{ label: "Calcule l'angle au centre " + M("\\widehat{AOB}") + ".", pts: 1 }, { label: "Le triangle " + M("AOB") + " est isocèle : pourquoi ? Calcule " + M("\\widehat{OAB}") + ".", pts: 2 }, { label: "Un point " + M("D") + " du cercle est du même côté que " + M("C") + ". Que vaut " + M("\\widehat{ADB}") + " ?", pts: 1 }],
sol: ul([M("2 \\cdot " + a + "° = " + 2 * a + "°") + ".", M("OA = OB") + " (rayons) ; " + M("\\frac{180° - " + 2 * a + "°}{2} = " + (90 - a) + "°") + ".", M(a + "°") + " : deux angles inscrits qui interceptent le même arc sont égaux."]) }); },
];
const RAISONA = [
() => X({ id: "angles", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« Un triangle peut avoir deux angles obtus. »", pts: 1 }, { label: "« Si deux angles alternes-internes sont égaux, les droites sont parallèles. »", pts: 1 }, { label: "« Un triangle inscrit dans un cercle est toujours rectangle. »", pts: 1 }],
sol: ul(["<b>Faux</b> : deux angles de plus de 90° dépassent déjà 180°.", "<b>Vrai</b> : c'est la réciproque de la propriété des alternes-internes.", "<b>Faux</b> : seulement si l'un de ses côtés est un diamètre (cercle de Thalès)."]) }),
() => { const a = pk([40, 50, 70]), w = who();
return X({ id: "cercthales", lv: 2, titre: "Trouve l'erreur", q: "Dans un cercle, un angle au centre mesure " + M(a + "°") + ". " + w + " affirme : « l'angle inscrit qui intercepte le même arc mesure " + M(2 * a + "°") + " ».",
parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Donne la bonne mesure.", pts: 1 }],
sol: ul([w + " a doublé au lieu de diviser : c'est l'angle au centre qui vaut le double de l'angle inscrit.", M(a + "° : 2 = " + a / 2 + "°") + "."]) }); },
];


const EXT = [
() => { const b = pk([1.5, 2]), o = pk([1.2, 2.5, 3]), k = pk([8, 10, 12]);
return X({ id: "thales", lv: 1, titre: "La hauteur du clocher",
q: "À la même heure, un bâton vertical de " + Q(b, "m") + " a une ombre de " + Q(o, "m") + ", et l'ombre du clocher mesure " + Q(o * k, "m") + ".",
parts: [{ label: "Fais un schéma : quelles droites sont parallèles ?", pts: 1 }, { label: "Calcule la hauteur du clocher.", pts: 2 }],
sol: ul(["Les rayons du soleil sont parallèles (et le bâton et le clocher sont verticaux).", "Rapport " + M(N(o * k) + " : " + N(o) + " = " + k) + " ; hauteur " + M(N(b) + " \\cdot " + k + " = " + N(b * k)) + " m."]) }); },
() => { const [ad, db, ae, de] = pk([[3, 6, 4, 5], [2, 4, 3, 2.5], [4, 6, 6, 3], [5, 10, 4, 6]]), k = (ad + db) / ad;
return X({ id: "thales", lv: 1, titre: "Le chevalet du peintre",
q: "Sur un chevalet en forme de triangle " + M("ABC") + ", une traverse " + M("[DE]") + " est parallèle au sol " + M("[BC]") + ", avec " + M("D \\in [AB]") + " et " + M("E \\in [AC]") + ". On mesure " + M("AD = " + N(ad)) + " dm, " + M("DB = " + N(db)) + " dm, " + M("AE = " + N(ae)) + " dm et " + M("DE = " + N(de)) + " dm.",
parts: [{ label: "Calcule " + M("AB") + ", puis le rapport " + M("\\frac{AB}{AD}") + ".", pts: 1 }, { label: "Calcule l'écartement au sol " + M("BC") + ".", pts: 1 }, { label: "Calcule la longueur " + M("AC") + ".", pts: 1 }],
sol: ul([M("AB = " + N(ad + db)) + " dm ; rapport " + M(N(k)) + ".", M("BC = " + N(de) + " \\cdot " + N(k) + " = " + N(de * k)) + " dm.", M("AC = " + N(ae) + " \\cdot " + N(k) + " = " + N(ae * k)) + " dm."]) }); },
() => { const [ad, ab, ae, ac] = pk([[3, 7.5, 4, 10], [2.4, 6, 3, 7.5], [4, 10, 5, 12], [3, 8, 4.5, 12]]), ok = Math.abs(ad / ab - ae / ac) < 1e-9;
return X({ id: "thalesrec", lv: 2, titre: "L'étagère est-elle horizontale ?",
q: "Un menuisier vérifie une étagère " + M("[DE]") + " fixée entre deux montants " + M("[AB]") + " et " + M("[AC]") + " qui se rejoignent en " + M("A") + ". Le sol " + M("[BC]") + " est horizontal. Il mesure " + M("AD = " + N(ad)) + " dm, " + M("AB = " + N(ab)) + " dm, " + M("AE = " + N(ae)) + " dm et " + M("AC = " + N(ac)) + " dm.",
parts: [{ label: "Calcule " + M("\\frac{AD}{AB}") + " et " + M("\\frac{AE}{AC}") + " (en décimal).", pts: 2 }, { label: "L'étagère est-elle parallèle au sol ? Quelle propriété utilises-tu ?", pts: 1 }],
sol: ul([M("\\frac{" + N(ad) + "}{" + N(ab) + "} = " + N(ad / ab)) + " et " + M("\\frac{" + N(ae) + "}{" + N(ac) + "} = " + N(r6(ae / ac))) + ".", ok ? "Oui : les rapports sont égaux (réciproque du théorème de Thalès)." : "Non : les rapports sont différents (si elle était parallèle, ils seraient égaux, d'après le théorème de Thalès)."]) }); },
() => { const [ae, ec, de] = pk([[12, 30, 9], [15, 45, 10], [20, 60, 14]]), bc = de * (ae + ec) / ae;
return X({ id: "thales", lv: 2, titre: "La largeur de la rivière",
q: "Pour mesurer la largeur " + M("BC") + " d'une rivière, on plante des piquets : " + M("A") + ", " + M("E") + ", " + M("C") + " alignés et " + M("A") + ", " + M("D") + ", " + M("B") + " alignés, avec " + M("(DE) \\parallel (BC)") + ". On mesure " + M("AE = " + ae) + " m, " + M("EC = " + ec) + " m et " + M("DE = " + de) + " m.",
parts: [{ label: "Calcule " + M("AC") + ".", pts: 1 }, { label: "Calcule la largeur " + M("BC") + " (au dixième).", pts: 2 }],
sol: ul([M("AC = " + ae + " + " + ec + " = " + (ae + ec)) + " m.", M("BC = " + de + " \\cdot \\frac{" + (ae + ec) + "}{" + ae + "} = " + N(r6(bc))) + " m."]) }); },
() => { const k = pk([2, 3]), ao = pk([2, 3, 4]), ab = pk([3, 4, 5].filter((v) => v < 2 * ao + 1)) ;
return X({ id: "thalesrec", lv: 3, titre: "Le papillon",
q: "Les droites " + M("(AC)") + " et " + M("(BD)") + " se coupent en " + M("O") + ". On a " + M("OA = " + ao) + " cm, " + M("OC = " + ao * k) + " cm, " + M("OB = " + (ao + 1)) + " cm, " + M("OD = " + (ao + 1) * k) + " cm et " + M("AB = " + ab) + " cm.",
parts: [{ label: "Montre que " + M("(AB) \\parallel (CD)") + ".", pts: 2 }, { label: "Calcule " + M("CD") + ".", pts: 1 }, { label: "Par combien l'aire du triangle " + M("OAB") + " est-elle multipliée pour obtenir celle de " + M("OCD") + " ?", pts: 1 }],
sol: ul([M("\\frac{OC}{OA} = \\frac{OD}{OB} = " + k) + " et les points sont alignés dans le même ordre : réciproque de Thalès.", M("CD = " + ab + " \\cdot " + k + " = " + ab * k) + " cm.", "Par " + M(k + "^2 = " + k * k) + " (agrandissement de rapport " + k + ")."]) }); },
];
const RAISONT = [
() => { const w = who();
return X({ id: "thales", lv: 1, titre: "Trouve l'erreur", q: "Avec " + M("(DE) \\parallel (BC)") + ", " + M("AD = 4") + ", " + M("DB = 6") + " et " + M("DE = 3") + ", " + w + " écrit : « " + M("\\frac{AD}{DB} = \\frac{DE}{BC}") + ", donc " + M("BC = 4{,}5") + " ».",
parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule " + M("BC") + " correctement.", pts: 1 }],
sol: ul(["Le rapport doit comparer les côtés des deux triangles " + M("ADE") + " et " + M("ABC") + " : " + M("\\frac{AD}{AB}") + ", pas " + M("\\frac{AD}{DB}") + ".", M("AB = 10") + ", " + M("BC = 3 \\cdot \\frac{10}{4} = 7{,}5") + "."]) }); },
() => X({ id: "thalesrec", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« Si AD = 2, AB = 5, AE = 3 et AC = 7, alors (DE) ∥ (BC). »", pts: 1 }, { label: "« Thalès permet de calculer des longueurs ; sa réciproque sert à prouver un parallélisme. »", pts: 1 }],
sol: ul(["<b>Faux</b> : " + M("\\frac{2}{5} = 0{,}4") + " et " + M("\\frac{3}{7} \\approx 0{,}43") + " ; rapports différents.", "<b>Vrai</b>."]) }),
];


const EXF = [
() => { const F0 = pk([3, 4, 5]), p = pk([2, 2.5, 3]), xs = [2, 5, 10];
return X({ id: "tabval", lv: 1, titre: "Le parking",
q: "Un parking coûte " + Q(F0, "CHF") + " à l'entrée, puis " + Q(p, "CHF") + " par heure. On note " + M("f(x)") + " le prix pour " + M("x") + " heures.",
parts: [{ label: "Complète le tableau de valeurs pour " + M("x = 2") + ", " + M("5") + " et " + M("10") + ".", pts: 2 }, { label: "Écris l'expression de " + M("f(x)") + ".", pts: 1 }, { label: "Avec " + Q(F0 + p * 8, "CHF") + ", combien d'heures peut-on rester ?", pts: 1 }],
sol: ul([xs.map((x) => M("f(" + x + ") = " + N(F0 + p * x))).join(" ; ") + " (CHF).", M("f(x) = " + F0 + " + " + N(p) + "x") + ".", M(N(F0 + p * 8) + " - " + F0 + " = " + N(p * 8)) + " ; " + M(N(p * 8) + " : " + N(p) + " = 8") + " heures."]) }); },
() => { const [a, b] = pk([[-1, 3], [2, -1], [1, -2], [-2, 4]]);
return X({ id: "repere", lv: 1, titre: "Le plan de la ville",
q: "Sur le plan d'une ville (repère, unité 100 m), l'école est en " + M("E(" + a + " ; " + b + ")") + ", la gare en " + M("G(" + (a + 6) + " ; " + b + ")") + " et la piscine en " + M("P(" + (a + 6) + " ; " + (b - 8) + ")") + ".",
parts: [{ label: "Dans quel quadrant est l'école ?", pts: 1 }, { label: "Donne les coordonnées du milieu de " + M("[EG]") + ".", pts: 1 }, { label: "Calcule la distance réelle entre l'école et la piscine (Pythagore).", pts: 2 }],
sol: ul([(a < 0 ? (b > 0 ? "En haut à gauche." : "En bas à gauche.") : b > 0 ? "En haut à droite." : "En bas à droite.") + "", M("(" + (a + 3) + " ; " + b + ")") + ".", M("EG = 6") + ", " + M("GP = 8") + " (angle droit en " + M("G") + ") : " + M("EP = \\sqrt{36 + 64} = 10") + ", soit 1000 m."]) }); },
() => { const [x1, y1, x2, y2] = pk([[0, 1, 2, 5], [1, -1, 3, 3], [0, 4, 2, 0], [-1, 2, 1, 6]]), a = (y2 - y1) / (x2 - x1), b = y1 - a * x1;
return X({ id: "affine", lv: 2, titre: "La droite par deux points",
q: "Une fonction affine " + M("f") + " vérifie " + M("f(" + x1 + ") = " + y1) + " et " + M("f(" + x2 + ") = " + y2) + ".",
parts: [{ label: "Calcule la pente " + M("a") + ".", pts: 1 }, { label: "Calcule l'ordonnée à l'origine " + M("b") + " et écris " + M("f(x)") + ".", pts: 1 }, { label: "Calcule " + M("f(10)") + " et le nombre dont l'image est " + M(N(a * 4 + b)) + ".", pts: 2 }],
sol: ul([M("a = \\frac{" + y2 + " - " + (y1 < 0 ? "(" + y1 + ")" : y1) + "}{" + x2 + " - " + (x1 < 0 ? "(" + x1 + ")" : x1) + "} = " + N(a)) + ".", M("b = " + N(b)) + " ; " + M("f(x) = " + N(a) + "x " + (b < 0 ? "- " + N(-b) : "+ " + N(b))) + ".", M("f(10) = " + N(10 * a + b)) + " ; le nombre est " + M("4") + "."]) }); },
() => { const t0 = pk([15, 18, 21]), d = 3;
return X({ id: "affine", lv: 2, titre: "La température en altitude",
q: "Au bord du lac (altitude " + Q(400, "m") + "), il fait " + M(t0 + "\\,°\\text{C}") + ". La température baisse de " + M(d) + " °C chaque fois qu'on monte de " + Q(500, "m") + ".",
parts: [{ label: "Quelle température fait-il à " + Q(1900, "m") + " ?", pts: 1 }, { label: "Écris la température " + M("T(h)") + " en fonction du nombre " + M("h") + " de tranches de 500 m au-dessus du lac.", pts: 1 }, { label: "À partir de quelle altitude gèle-t-il (" + M("T < 0") + ") ? Arrondis à la tranche de 500 m.", pts: 2 }],
sol: ul(["3 tranches : " + M(t0 + " - 3 \\cdot " + d + " = " + (t0 - 3 * d)) + " °C.", M("T(h) = " + t0 + " - " + d + "h") + ".", M(t0 + " - " + d + "h < 0 \\iff h > " + N(r6(t0 / d))) + " : " + Math.floor(t0 / d + 1) + " tranches, soit vers " + Q(400 + 500 * Math.floor(t0 / d + 1), "m") + "."]) }); },
() => { const pA = pk([12, 15]), F = pk([60, 90]), pB = pA - pk([3, 5]), n = F / (pA - pB);
return X({ id: "affine", lv: 3, titre: "Deux tarifs de fitness",
q: "Tarif A : " + Q(pA, "CHF") + " par séance. Tarif B : abonnement de " + Q(F, "CHF") + " plus " + Q(pB, "CHF") + " par séance.",
parts: [{ label: "Écris le prix " + M("A(x)") + " et " + M("B(x)") + " pour " + M("x") + " séances.", pts: 1 }, { label: "Pour combien de séances les deux tarifs coûtent-ils le même prix ?", pts: 2 }, { label: "Représente les deux droites et explique quel tarif choisir selon le nombre de séances.", pts: 1 }],
sol: ul([M("A(x) = " + pA + "x") + " ; " + M("B(x) = " + F + " + " + pB + "x") + ".", M(pA + "x = " + F + " + " + pB + "x \\iff " + (pA - pB) + "x = " + F + " \\iff x = " + N(n)) + ".", "Moins de " + N(n) + " séances : A ; plus : B (la droite de B est en dessous)."]) }); },
];
const RAISONF = [
() => X({ id: "tabval", lv: 1, titre: "Trouve l'erreur", q: "Pour " + M("f(x) = x^2 - 3x") + ", " + who() + " calcule " + M("f(-2) = -4 + 6 = 2") + ".",
parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Calcule " + M("f(-2)") + " correctement.", pts: 1 }],
sol: ul([M("(-2)^2 = 4") + ", pas " + M("-4") + " : il faut des parenthèses.", M("4 + 6 = 10") + "."]) }),
() => X({ id: "affine", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« f(x) = 3x est une fonction linéaire : son graphe passe par l'origine. »", pts: 1 }, { label: "« Le tableau x : 1, 2, 3 ; f(x) : 4, 6, 9 est celui d'une fonction affine. »", pts: 1 }],
sol: ul(["<b>Vrai</b> : " + M("f(0) = 0") + ".", "<b>Faux</b> : les accroissements (2, puis 3) ne sont pas constants."]) }),
];


const EXS = [
() => { const e = pk([20, 25, 50]), l = pk([12, 16, 18]);
return X({ id: "simil", lv: 1, titre: "La maquette",
q: "Une maquette de bateau est à l'échelle " + M("1\\,:\\," + e) + ". Elle mesure " + Q(l, "cm") + " de long.",
parts: [{ label: "Quelle est la longueur réelle du bateau (en m) ?", pts: 1 }, { label: "La voile de la maquette a une aire de " + Q(30, "cm^2") + ". Quelle est l'aire réelle (en m²) ?", pts: 2 }],
sol: ul([M(l + " \\cdot " + e + " = " + l * e) + " cm, soit " + M(N(l * e / 100)) + " m.", "Aires × " + M(e + "^2 = " + e * e) + " : " + M("30 \\cdot " + e * e + " = " + N(30 * e * e)) + " cm² = " + M(N(30 * e * e / 10000)) + " m²."]) }); },
() => { const k = pk([1.5, 2, 2.5]), a = pk([4, 6, 8]), b = pk([3, 5]);
return X({ id: "simil", lv: 1, titre: "Agrandir une photo",
q: "Une photo de " + Q(a, "cm") + " sur " + Q(b, "cm") + " est agrandie dans le rapport " + M(N(k)) + ".",
parts: [{ label: "Calcule les nouvelles dimensions.", pts: 1 }, { label: "Par combien son périmètre est-il multiplié ? Et son aire ?", pts: 2 }],
sol: ul([M(N(a * k)) + " cm sur " + M(N(b * k)) + " cm.", "Périmètre × " + M(N(k)) + " ; aire × " + M(N(k) + "^2 = " + N(k * k)) + "."]) }); },
() => { const k = pk([2, 3]), V = pk([250, 330, 500]);
return X({ id: "simil", lv: 2, titre: "Le grand modèle de bouteille",
q: "Une publicité montre une bouteille géante, agrandissement de rapport " + M(k) + " d'une bouteille de " + Q(V, "mL") + ".",
parts: [{ label: "Par combien les longueurs sont-elles multipliées ? Les volumes ?", pts: 1 }, { label: "Quel serait le volume de la bouteille géante (en L) ?", pts: 2 }, { label: who() + " pense que la géante contient " + k + " fois plus. Explique son erreur.", pts: 1 }],
sol: ul(["Longueurs × " + M(k) + " ; volumes × " + M(k + "^3 = " + k ** 3) + ".", M(V + " \\cdot " + k ** 3 + " = " + V * k ** 3) + " mL = " + M(N(V * k ** 3 / 1000)) + " L.", "Les trois dimensions sont multipliées par " + k + " : le volume l'est par " + k ** 3 + "."]) }); },
() => { const oa = pk([2, 3, 4]), k = pk([2, 3]), ab = pk([3, 5]);
return X({ id: "simil", lv: 2, titre: "L'homothétie",
q: "L'homothétie de centre " + M("O") + " et de rapport " + M(k) + " transforme " + M("A") + " en " + M("A'") + " et " + M("B") + " en " + M("B'") + ". On a " + M("OA = " + oa) + " cm et " + M("AB = " + ab) + " cm.",
parts: [{ label: "Calcule " + M("OA'") + " et " + M("AA'") + ".", pts: 2 }, { label: "Calcule " + M("A'B'") + ". Que peut-on dire des droites " + M("(AB)") + " et " + M("(A'B')") + " ?", pts: 2 }],
sol: ul([M("OA' = " + k * oa) + " cm ; " + M("AA' = " + (k - 1) * oa) + " cm.", M("A'B' = " + k * ab) + " cm ; elles sont parallèles (une homothétie conserve les directions)."]) }); },
() => { const k = pk([3, 4]), A = pk([6, 8]);
return X({ id: "simil", lv: 3, titre: "Retrouver le rapport",
q: "Deux triangles semblables ont des aires de " + Q(A, "cm^2") + " et " + Q(A * k * k, "cm^2") + ". Le petit a un périmètre de " + Q(12, "cm") + ".",
parts: [{ label: "Quel est le rapport des aires ? Déduis-en le rapport des longueurs.", pts: 2 }, { label: "Calcule le périmètre du grand triangle.", pts: 1 }],
sol: ul(["Aires × " + M(k * k) + ", donc longueurs × " + M("\\sqrt{" + k * k + "} = " + k) + ".", M("12 \\cdot " + k + " = " + 12 * k) + " cm."]) }); },
];
const RAISONS = [
() => X({ id: "simil", lv: 1, titre: "Trouve l'erreur", q: who() + " double le côté d'un carré de 5 cm et dit : « l'aire double aussi, elle passe de 25 à 50 cm² ».",
parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Donne la nouvelle aire.", pts: 1 }],
sol: ul(["Longueurs × 2, donc aire × 2² = 4.", M("10^2 = 100") + " cm²."]) }),
() => X({ id: "simil", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« Une homothétie de rapport 0,5 réduit les longueurs de moitié. »", pts: 1 }, { label: "« Deux rectangles sont toujours semblables. »", pts: 1 }],
sol: ul(["<b>Vrai</b>.", "<b>Faux</b> : 2 × 1 et 3 × 1 n'ont pas les mêmes proportions."]) }),
];


const EXP = [
() => { const r = pk([3, 4, 5]), b = pk([2, 3]), v = pk([1, 2]), n = r + b + v;
return X({ id: "proba", lv: 1, titre: "Le sac de bonbons",
q: "Un sac contient " + r + " bonbons à la fraise, " + b + " à la menthe et " + v + " au citron. " + who() + " en prend un au hasard.",
parts: [{ label: "Quelle est la probabilité qu'il soit à la fraise ?", pts: 1 }, { label: "Quelle est la probabilité qu'il ne soit pas à la menthe ?", pts: 1 }, { label: "Combien de bonbons à la menthe faut-il ajouter pour que la menthe ait autant de chances que la fraise ?", pts: 1 }],
sol: ul([M(F(r, n)) + ".", M("1 - " + F(b, n) + " = " + F(n - b, n)) + ".", M(r - b) + " bonbon" + P1(r - b) + " (pour en avoir " + r + " de chaque)."]) }); },
() => { const [e, p, d] = pk([[3, 4, 2], [2, 5, 3], [4, 3, 2]]);
return X({ id: "denombr", lv: 1, titre: "Le menu de la cantine",
q: "La cantine propose " + e + " entrées, " + p + " plats et " + d + " desserts. Un menu comprend une entrée, un plat et un dessert.",
parts: [{ label: "Combien de menus différents existe-t-il ? (arbre)", pts: 2 }, { label: "Un élève choisit au hasard. Probabilité qu'il ait un menu donné ?", pts: 1 }],
sol: ul([M(e + " \\cdot " + p + " \\cdot " + d + " = " + e * p * d) + " menus.", M(F(1, e * p * d))]) }); },
() => { const s = pk([5, 6, 8, 9]), c = 6 - Math.abs(7 - s);
return X({ id: "proba", lv: 2, titre: "Le jeu de dés",
q: "On lance deux dés équilibrés et on additionne les points. On gagne si la somme vaut " + s + " ou 7.",
parts: [{ label: "Construis le tableau des 36 sommes.", pts: 1 }, { label: "Quelle est la probabilité d'obtenir " + s + " ? D'obtenir 7 ?", pts: 2 }, { label: "Quelle est la probabilité de gagner ?", pts: 1 }],
sol: ul(["Tableau 6 × 6 (sommes de 2 à 12).", M(F(c, 36)) + " et " + M(F(6, 36)) + ".", M(F(c + 6, 36)) + " (événements incompatibles : on additionne)."]) }); },
() => { const n = pk([6, 7, 8]);
return X({ id: "denombr", lv: 2, titre: "Le tournoi de ping-pong",
q: n + " amis organisent un tournoi : chacun joue une fois contre chacun des autres.",
parts: [{ label: "Combien de matchs chaque joueur joue-t-il ?", pts: 1 }, { label: "Combien de matchs y a-t-il en tout ? Explique pourquoi on divise par 2.", pts: 2 }, { label: "Ils veulent aussi un podium (or, argent, bronze). Combien de podiums possibles ?", pts: 1 }],
sol: ul([M(n - 1) + ".", M("\\frac{" + n + " \\cdot " + (n - 1) + "}{2} = " + n * (n - 1) / 2) + " : le match A–B est le même que B–A.", M(n + " \\cdot " + (n - 1) + " \\cdot " + (n - 2) + " = " + n * (n - 1) * (n - 2)) + "."]) }); },
() => { const r = pk([4, 5, 6]), v = pk([2, 3]), n = r + v;
return X({ id: "proba", lv: 3, titre: "Deux tirages sans remise",
q: "Une urne contient " + r + " boules rouges et " + v + " vertes. On tire une boule, on ne la remet pas, puis on en tire une deuxième.",
parts: [{ label: "Dessine l'arbre avec les probabilités sur chaque branche.", pts: 1 }, { label: "Probabilité de tirer deux boules rouges ?", pts: 1 }, { label: "Probabilité de tirer deux boules de couleurs différentes ?", pts: 2 }],
sol: ul(["1er tirage : " + M(F(r, n)) + " / " + M(F(v, n)) + " ; 2e tirage avec " + (n - 1) + " boules.", M(F(r, n) + " \\cdot " + F(r - 1, n - 1) + " = " + F(r * (r - 1), n * (n - 1))) + ".", M("2 \\cdot " + F(r, n) + " \\cdot " + F(v, n - 1) + " = " + F(2 * r * v, n * (n - 1))) + "."]) }); },
];
const RAISONP2 = [
() => X({ id: "proba", lv: 1, titre: "Trouve l'erreur", q: who() + " dit : « Avec deux dés, la somme peut valoir 2, 3, …, 12 : 11 résultats, donc la probabilité d'avoir 7 est " + M("\\frac{1}{11}") + " ».",
parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Donne la bonne probabilité.", pts: 1 }],
sol: ul(["Les 11 sommes ne sont pas équiprobables : il faut compter les 36 couples.", M("\\frac{6}{36} = \\frac{1}{6}") + "."]) }),
() => X({ id: "denombr", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« Avec 3 chiffres différents parmi 1 à 5, on forme 5 · 4 · 3 = 60 codes. »", pts: 1 }, { label: "« Une probabilité peut valoir 1,2. »", pts: 1 }],
sol: ul(["<b>Vrai</b> : le nombre de choix diminue à chaque position.", "<b>Faux</b> : une probabilité est toujours entre 0 et 1."]) }),
];


const EXC = [
() => { const s = pk([12, 15, 18, 25]);
return X({ id: "carres", lv: 1, titre: "Le carrelage",
q: "Une terrasse carrée a une aire de " + Q(s * s, "m^2") + ". On la borde d'une bande de fleurs sur tout son tour.",
parts: [{ label: "Calcule la longueur du côté de la terrasse.", pts: 1 }, { label: "Calcule la longueur de la bande de fleurs (périmètre).", pts: 1 }, { label: "Une deuxième terrasse a une aire de " + Q(2 * s * s, "m^2") + ". Son côté est-il le double ? Calcule-le au cm près.", pts: 2 }],
sol: ul([M("\\sqrt{" + s * s + "} = " + s) + " m.", M("4 \\cdot " + s + " = " + 4 * s) + " m.", "Non : " + M("\\sqrt{" + 2 * s * s + "} = " + s + "\\sqrt{2} \\approx " + N(Math.round(s * Math.SQRT2 * 100) / 100)) + " m (côté × √2, aire × 2)."]) }); },
() => { const k = pk([7, 8, 9, 11]);
return X({ id: "carres", lv: 2, titre: "Encadrer sans calculatrice",
q: "Sans calculatrice, on veut situer " + M("\\sqrt{" + (k * k + k) + "}") + ".",
parts: [{ label: "Entre quels carrés parfaits consécutifs se trouve " + M(k * k + k) + " ?", pts: 1 }, { label: "Encadre " + M("\\sqrt{" + (k * k + k) + "}") + " entre deux entiers consécutifs.", pts: 1 }, { label: "Est-il plus proche de " + k + " ou de " + (k + 1) + " ? Justifie avec " + M(N(k + 0.5) + "^2") + ".", pts: 2 }],
sol: ul([M(k * k + " < " + (k * k + k) + " < " + (k + 1) * (k + 1)) + ".", M(k + " < \\sqrt{" + (k * k + k) + "} < " + (k + 1)) + ".", M(N(k + 0.5) + "^2 = " + N((k + 0.5) ** 2)) + " > " + M(k * k + k) + " : il est plus proche de " + k + "."]) }); },
() => { const e = pk([3, 4, 5]);
return X({ id: "puiss", lv: 2, titre: "La feuille pliée",
q: "On plie une feuille en deux, puis encore en deux, et ainsi de suite. Une feuille mesure " + Q(0.1, "mm") + " d'épaisseur.",
parts: [{ label: "Combien de couches y a-t-il après " + e + " pliages ? Écris-le comme une puissance.", pts: 1 }, { label: "Quelle est alors l'épaisseur (en mm) ?", pts: 1 }, { label: "Après combien de pliages dépasse-t-on 1 cm ?", pts: 2 }],
sol: ul([M("2^" + e + " = " + 2 ** e) + " couches.", M(2 ** e + " \\cdot 0{,}1 = " + N(2 ** e * 0.1)) + " mm.", "Il faut " + M("2^n \\cdot 0{,}1 > 10") + ", soit " + M("2^n > 100") + " : " + M("2^7 = 128") + ", donc 7 pliages."]) }); },
() => X({ id: "rac", lv: 3, titre: "Valeurs exactes",
q: "Un carré a un côté de " + Q(6, "cm") + ".",
parts: [{ label: "Calcule la valeur exacte de sa diagonale, sous la forme " + M("a\\sqrt{b}") + ".", pts: 2 }, { label: "Un carré a une aire de " + Q(72, "cm^2") + ". Écris son côté sous la forme " + M("a\\sqrt{b}") + ".", pts: 1 }, { label: "Compare les deux résultats. Que remarques-tu ?", pts: 1 }],
sol: ul([M("\\sqrt{36 + 36} = \\sqrt{72} = 6\\sqrt{2}") + " cm.", M("\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}") + " cm.", "Égaux : le carré construit sur la diagonale a une aire double (72 = 2 · 36)."]) }),


() => { const k = pk([4, 5, 6, 7, 8]);
return X({ id: "carres", lv: 2, titre: "L'aquarium cubique",
q: "Un aquarium cubique a une contenance de " + Q(k ** 3, "dm^3") + ".",
parts: [{ label: "Calcule la longueur d'une arête (en dm).", pts: 1 }, { label: "Calcule l'aire d'une face, puis l'aire totale des vitres si l'aquarium n'a pas de couvercle (en dm²).", pts: 2 }, { label: "Combien de litres contient-il ? Et combien de litres contiendrait un aquarium d'arête double ?", pts: 1 }],
sol: ul([M("\\sqrt[3]{" + k ** 3 + "} = " + k) + " dm.", "Une face : " + M(k + "^2 = " + k * k) + " dm² ; sans couvercle, 5 faces : " + M("5 \\cdot " + k * k + " = " + 5 * k * k) + " dm².", M(N(k ** 3)) + " L (1 dm³ = 1 L) ; arête double : volume × 8, soit " + M(N(8 * k ** 3)) + " L."]) }); },
() => { const [a, b, c] = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), m = pk([2, 3, 4]), n = pk([2, 3]), v1 = c * m, v2 = -(n ** 3) + Math.sqrt(49), e = pk([2, 3]);
return X({ id: "rac", lv: 3, titre: "Calculs enchaînés",
q: "Calcule sans calculatrice, en détaillant les étapes.",
parts: [{ label: M("\\sqrt{" + a + "^2 + " + b + "^2} \\cdot \\sqrt[3]{" + m ** 3 + "}"), pts: 1 }, { label: M("\\sqrt[3]{-" + n ** 3 + "} + \\sqrt{0{,}49} \\cdot 10"), pts: 1 }, { label: M("(-2)^" + (e * 2 + 1) + " + \\sqrt{" + (e * 6) ** 2 + "} \\div " + e), pts: 1 }, { label: M("\\left(\\sqrt{5}\\right)^2 + \\sqrt[3]{" + 1000 + "} - 2^4"), pts: 1 }],
sol: ul([M("\\sqrt{" + c * c + "} \\cdot " + m + " = " + c + " \\cdot " + m + " = " + v1) + ".", M("-" + n + " + 0{,}7 \\cdot 10 = -" + n + " + 7 = " + (7 - n)) + ".", M((-(2 ** (e * 2 + 1))) + " + " + e * 6 + " \\div " + e + " = " + (-(2 ** (e * 2 + 1))) + " + 6 = " + (-(2 ** (e * 2 + 1)) + 6)) + " (division avant addition).", M("5 + 10 - 16 = -1") + "."]) }); },
() => { const L = pk([2, 3, 4, 5]), c = 10 * L;
return X({ id: "carres", lv: 3, titre: "Le cube de sucres",
q: "Avec des morceaux de sucre cubiques de " + Q(1, "cm") + " d'arête, on construit un grand cube plein.",
parts: [{ label: "Le grand cube contient " + M(N(c ** 3)) + " morceaux. Combien de morceaux y a-t-il sur une arête ?", pts: 1 }, { label: "Combien de morceaux sont visibles sur une seule face ?", pts: 1 }, { label: "On ajoute une couche pour obtenir un cube d'arête " + (c + 1) + ". Combien de morceaux faut-il ajouter ?", pts: 2 }],
sol: ul([M("\\sqrt[3]{" + N(c ** 3) + "} = " + c) + " (car " + M(c + "^3 = " + N(c ** 3)) + ").", M(c + "^2 = " + N(c * c)) + ".", M((c + 1) + "^3 - " + c + "^3 = " + N((c + 1) ** 3) + " - " + N(c ** 3) + " = " + N((c + 1) ** 3 - c ** 3)) + "."]) }); },
() => { const e = pk([3, 4, 5, 6]), x = pk([2, 3, 4]);
return X({ id: "puiss", lv: 3, titre: "Puissances et racines mêlées",
q: "Simplifie, puis calcule.",
parts: [{ label: M("\\frac{" + x + "^{" + (e + 2) + "}}{" + x + "^{" + e + "}}"), pts: 1 }, { label: M("\\sqrt{" + x + "^{" + 2 * e + "}}") + " (écris-le comme une puissance de " + x + ")", pts: 1 }, { label: M("\\sqrt[3]{" + x + "^6} + \\sqrt{" + x + "^4}"), pts: 1 }, { label: M("10^3 \\cdot \\sqrt{0{,}01}"), pts: 1 }],
sol: ul([M(x + "^2 = " + x * x) + ".", M(x + "^{" + e + "} = " + N(x ** e)) + " (car " + M("(" + x + "^{" + e + "})^2 = " + x + "^{" + 2 * e + "}") + ").", M(x + "^2 + " + x + "^2 = " + 2 * x * x) + ".", M("1000 \\cdot 0{,}1 = 100") + "."]) }); },
];
const RAISONC = [
() => X({ id: "carres", lv: 1, titre: "Trouve l'erreur", q: who() + " écrit : « " + M("\\sqrt{16 + 9} = \\sqrt{16} + \\sqrt{9} = 7") + " ».",
parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
sol: ul(["La racine d'une somme n'est pas la somme des racines.", M("\\sqrt{25} = 5") + "."]) }),
() => X({ id: "puiss", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« " + M("(-3)^2 = -9") + " »", pts: 1 }, { label: "« " + M("2^3 \\cdot 2^4 = 2^7") + " »", pts: 1 }, { label: "« " + M("0{,}2^2 = 0{,}4") + " »", pts: 1 }],
sol: ul(["<b>Faux</b> : " + M("(-3) \\cdot (-3) = 9") + ".", "<b>Vrai</b> : on additionne les exposants.", "<b>Faux</b> : " + M("0{,}2 \\cdot 0{,}2 = 0{,}04") + "."]) }),
() => X({ id: "carres", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« " + M("\\sqrt[3]{-8} = -2") + " »", pts: 1 }, { label: "« " + M("\\sqrt[3]{8 + 27} = \\sqrt[3]{8} + \\sqrt[3]{27} = 5") + " »", pts: 1 }, { label: "« Le cube d'un nombre est toujours plus grand que ce nombre. »", pts: 1 }],
sol: ul(["<b>Vrai</b> : " + M("(-2)^3 = -8") + ".", "<b>Faux</b> : " + M("\\sqrt[3]{35}") + " n'est pas entier (" + M("3^3 = 27 < 35 < 64 = 4^3") + ") ; la racine d'une somme n'est pas la somme des racines.", "<b>Faux</b> : " + M("0{,}5^3 = 0{,}125 < 0{,}5") + " (et pour les négatifs, " + M("(-2)^3 = -8 < -2") + ")."]) }),
];
const EXV = [
() => { const P0 = pk([60, 80, 120]), p = pk([15, 20, 25]);
return X({ id: "pctvar", lv: 1, titre: "Les soldes",
q: "Un sweat coûte " + Q(P0, "CHF") + ". Pendant les soldes, son prix baisse de " + p + " %.",
parts: [{ label: "Calcule le montant de la réduction.", pts: 1 }, { label: "Calcule le prix soldé, puis le coefficient multiplicateur utilisé.", pts: 2 }],
sol: ul([M(N(P0) + " \\cdot " + N(p / 100) + " = " + N(P0 * p / 100)) + " CHF.", M(N(P0 * (1 - p / 100))) + " CHF ; coefficient " + M(N(1 - p / 100)) + "."]) }); },
() => { const a = pk([40, 50, 80]), b = a * pk([1.2, 1.25, 1.5]);
return X({ id: "pctvar", lv: 2, titre: "L'abonnement augmente",
q: "L'abonnement de bus passe de " + Q(a, "CHF") + " à " + Q(b, "CHF") + " par mois.",
parts: [{ label: "Calcule le coefficient multiplicateur.", pts: 1 }, { label: "De quel pourcentage a-t-il augmenté ?", pts: 1 }, { label: "L'an prochain, il baisse du même pourcentage. Revient-il à " + Q(a, "CHF") + " ? Calcule.", pts: 2 }],
sol: ul([M(N(b) + " : " + a + " = " + N(b / a)) + ".", M(N(r6((b / a - 1) * 100))) + " %.", "Non : " + M(N(b) + " \\cdot " + N(r6(2 - b / a)) + " = " + N(r6(b * (2 - b / a)))) + " CHF : la baisse porte sur un montant plus grand."]) }); },
() => { const r = pk([3, 4, 5]), P0 = pk([200, 400, 500]);
return X({ id: "pctvar", lv: 2, titre: "Retrouver le prix de départ",
q: "Après une hausse de " + (r * 5) + " %, un vélo coûte " + Q(P0 * (1 + r * 5 / 100), "CHF") + ".",
parts: [{ label: "Quel coefficient correspond à une hausse de " + r * 5 + " % ?", pts: 1 }, { label: "Calcule le prix avant la hausse.", pts: 2 }, { label: who() + " a calculé " + M(N(P0 * (1 + r * 5 / 100)) + " \\cdot " + N(1 - r * 5 / 100)) + ". Pourquoi est-ce faux ?", pts: 1 }],
sol: ul([M(N(1 + r * 5 / 100)) + ".", M(N(P0 * (1 + r * 5 / 100)) + " : " + N(1 + r * 5 / 100) + " = " + P0) + " CHF.", "Le pourcentage portait sur le prix de départ : il faut diviser par le coefficient, pas enlever " + r * 5 + " % du nouveau prix."]) }); },
() => { const t = pk([2, 3]), p = pk([4, 5, 10]);
return X({ id: "pctvar", lv: 3, titre: "Hausses successives",
q: "Une population augmente de " + p + " % par an pendant " + t + " ans. Elle compte " + Q(10000, "habitants") + " au départ.",
parts: [{ label: "Quel est le coefficient multiplicateur sur " + t + " ans ?", pts: 2 }, { label: "Combien d'habitants y a-t-il à la fin (à l'unité) ?", pts: 1 }, { label: "Le pourcentage total d'augmentation vaut-il " + p * t + " % ? Explique.", pts: 1 }],
sol: ul([M(N(1 + p / 100) + "^" + t + " = " + N(r6((1 + p / 100) ** t))) + ".", M(N(Math.round(10000 * (1 + p / 100) ** t))) + " habitants.", "Non : " + M(N(r6(((1 + p / 100) ** t - 1) * 100))) + " %, un peu plus, car chaque hausse porte sur une population déjà augmentée."]) }); },
];
const RAISONV = [
() => X({ id: "pctvar", lv: 1, titre: "Trouve l'erreur", q: who() + " dit : « une hausse de 50 % puis une baisse de 50 %, ça revient au prix de départ ».",
parts: [{ label: "Teste avec un prix de 100 CHF.", pts: 1 }, { label: "Quel est le coefficient global ?", pts: 1 }],
sol: ul(["100 → 150 → 75 CHF.", M("1{,}5 \\cdot 0{,}5 = 0{,}75") + " : baisse de 25 %."]) }),
() => X({ id: "pctvar", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
parts: [{ label: "« Baisser de 20 %, c'est multiplier par 0,8. »", pts: 1 }, { label: "« Augmenter de 100 %, c'est doubler. »", pts: 1 }],
sol: ul(["<b>Vrai</b> : 1 − 0,2 = 0,8.", "<b>Vrai</b> : coefficient 2."]) }),
];

RICH.pr10 = { ids: ["carres", "puiss", "rac"], label: "Puissances et racines (révision de 10e)", ex: EXC, raison: RAISONC, minutes: 45 };
RICH.pct10 = { ids: ["pctvar"], label: "Pourcentages (révision de 10e)", ex: EXV, raison: RAISONV, minutes: 45 };
RICH.ang11 = { ids: ["angles", "cercthales"], label: "Angles", ex: EXA, raison: RAISONA, minutes: 45 };
RICH.thal11 = { ids: ["thales", "thalesrec"], label: "Théorème de Thalès", ex: EXT, raison: RAISONT, minutes: 45 };
RICH.fct11 = { ids: ["repere", "tabval", "affine"], label: "Fonctions", ex: EXF, raison: RAISONF, minutes: 45, minA: 2 };
RICH.simil11 = { ids: ["simil"], label: "Homothéties et similitudes", ex: EXS, raison: RAISONS, minutes: 45 };
RICH.proba11 = { ids: ["denombr", "proba"], label: "Probabilités", ex: EXP, raison: RAISONP2, minutes: 45 };
})();









const EVACOM = (function () {
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { const s = r6(v) < 0 ? "-" : ""; let [i, f] = String(Math.abs(r6(v))).split("."); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return s + i + (f ? "{,}" + f : ""); };
const A = (v, k) => N(+(+v).toFixed(k));
const un = (s) => "\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}";
const Q = (v, s) => M(N(v) + un(s).replace(/\\text\{\}$/, ""));
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const mix = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const who = () => pk(["Léa", "Noé", "Lina", "Sam", "Yanis", "Inès", "Maël", "Zoé"]);

const qr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
const qa = (a, b) => qr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), qs = (a, b) => qa(a, [-b[0], b[1]]);
const qm = (a, b) => qr(a[0] * b[0], a[1] * b[1]), qd = (a, b) => qr(a[0] * b[1], a[1] * b[0]);
const qt = (a) => frac(a[0], a[1]);
const qp = (a) => (a[0] < 0 ? "\\left(" + qt(a) + "\\right)" : qt(a));
const rf = (neg) => { for (;;) { const d = pk([2, 3, 4, 5, 6, 8, 9, 10]), n = R.int(1, 2 * d - 1); if (gcd(n, d) === 1) return qr(neg && R.rand() < 0.4 ? -n : n, d); } };
const nice = (x) => x[1] <= 24 && Math.abs(x[0]) <= 60 && !(x[1] === 1 && Math.abs(x[0]) <= 1);

const pm = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => (r[i + j] += x * y))); return r; };
const pa = (a, b, s = 1) => { const r = []; for (let i = 0; i < Math.max(a.length, b.length); i++) r.push((a[i] || 0) + s * (b[i] || 0)); return r; };
const P = (a, v = "x") => poly(a.slice().reverse(), v);
const L = (a, b, v = "x") => P([b, a], v);
const S = (vals) => "S = \\{" + vals.map((x) => (Array.isArray(x) ? qt(x) : N(x))).join(" ; ") + "\\}";
const opts = (list) => "<div class=\"evc-opts\">" + list.map((o) => "<span class=\"evc-opt\">☐ " + o + "</span>").join("") + "</div>";
const qcm = (good, bad) => { const all = [good].concat(bad.filter((b, i) => b !== good && bad.indexOf(b) === i)).slice(0, 4), r = mix(all); r.good = good; return r; };
const sg = (n) => (n < 0 ? "- " + -n : "+ " + n);



const FR = {
a: () => { const p1 = rf(), p2 = rf(true), p3 = rf(), pr = qm(p2, p3), r = qs(p1, pr); if (!nice(r) || pr[1] > 30 || p2[1] * p3[1] === pr[1]) return null;
return { e: qt(p1) + " - " + qp(p2) + " \\cdot " + qt(p3), s: qt(p1) + " - " + qp(pr) + " = " + qt(r), w: "la multiplication d'abord" }; },
b: () => { const p1 = rf(), p2 = rf(true), p3 = rf(), sm = qa(p1, p2), r = qd(sm, p3); if (!nice(r) || sm[0] === 0) return null;
return { e: "\\left(" + qt(p1) + " + " + qp(p2) + "\\right) : " + qt(p3), s: qt(sm) + " \\cdot " + qt(qr(p3[1], p3[0])) + " = " + qt(r), w: "la parenthèse d'abord ; diviser, c'est multiplier par l'inverse" }; },
c: () => { const k = R.int(2, 5), m = R.int(2, 3), r0 = R.int(2, 4), t = qr(m ** 3, r0 * r0), r = qs([k * k, 1], t); if (!nice(r)) return null;
return { e: "(-" + k + ")^2 - " + m + "^3 \\cdot \\left(\\frac{1}{" + r0 + "}\\right)^2", s: k * k + " - " + m ** 3 + " \\cdot \\frac{1}{" + r0 * r0 + "} = " + k * k + " - " + qt(t) + " = " + qt(r), w: "les puissances d'abord ; " + M("(-" + k + ")^2 = " + k * k) };
},
d: () => { const a = R.int(2, 6), b = R.int(2, 4), c = R.int(2, 3), r = -a * a + a * a + b * c ** 3; return { e: "-" + a + "^2 + (-" + a + ")^2 - " + b + " \\cdot (-" + c + ")^3", s: "-" + a * a + " + " + a * a + " - " + b + " \\cdot (-" + c ** 3 + ") = " + r, w: M("-" + a + "^2 = -" + a * a) + " mais " + M("(-" + a + ")^2 = " + a * a) }; },
e: () => { const p1 = rf(), p2 = rf(), p3 = rf(true), dv = qd(p1, [-p2[0], p2[1]]), r = qa(dv, p3); if (!nice(r)) return null;
return { e: qt(p1) + " : \\left(-" + qt(p2) + "\\right) + " + qp(p3), s: qt(p1) + " \\cdot \\left(-" + qt(qr(p2[1], p2[0])) + "\\right) + " + qp(p3) + " = " + qt(dv) + " + " + qp(p3) + " = " + qt(r), w: "la division d'abord" }; },
f: () => { const p1 = rf(), p2 = rf(), d0 = qs([1, 1], p1), sq = qm(d0, d0), r = qd(sq, p2); if (!nice(r) || d0[0] === 0) return null;
return { e: "\\left(1 - " + qt(p1) + "\\right)^2 : " + qt(p2), s: qp(d0) + "^2 : " + qt(p2) + " = " + qt(sq) + " \\cdot " + qt(qr(p2[1], p2[0])) + " = " + qt(r), w: "la parenthèse, puis le carré" }; },
};
const make = (f) => { for (let t = 0; t < 300; t++) { const x = f(); if (x) return x; } return null; };
const fracQ = (keys) => { const xs = keys.map((k) => make(FR[k])); return { id: "fracops", also: ["fracmul"], d: 2, titre: "Fractions",
q: "Calcule et donne la réponse sous la forme d'une fraction irréductible ou d'un nombre entier.",
parts: xs.map((x) => M(x.e)), sol: xs.map((x) => M(x.e + " = " + x.s) + " (" + x.w + ").") }; };


const RB = [2, 3, 5, 6, 7, 10, 11];
const racA = () => { const a = R.int(2, 7), b = pk(RB), c = R.int(2, 4), dd = pk([2, 3, 4, 5]), p = R.int(1, 4), q = R.int(2, 5), b2 = pk([2, 3, 5]);
return { id: "racprop", also: ["rac"], d: 2, titre: "Racines",
q: "Écris sous la forme " + M("a\\sqrt{b}") + " ou " + M("a\\sqrt[3]{b}") + ", avec " + M("a") + " le plus grand nombre entier possible.",
parts: [M("\\sqrt{" + a * a * b + "}"), M("\\sqrt[3]{" + c ** 3 * dd + "}"), M("\\sqrt{" + p * p * b2 + "} + \\sqrt{" + q * q * b2 + "}")],
sol: [M("\\sqrt{" + a * a * b + "} = \\sqrt{" + a * a + " \\cdot " + b + "} = " + a + "\\sqrt{" + b + "}"), M("\\sqrt[3]{" + c ** 3 * dd + "} = \\sqrt[3]{" + c ** 3 + " \\cdot " + dd + "} = " + c + "\\sqrt[3]{" + dd + "}"),
M((p === 1 ? "" : p) + "\\sqrt{" + b2 + "} + " + q + "\\sqrt{" + b2 + "} = " + (p + q) + "\\sqrt{" + b2 + "}") + (p === 1 ? " (" + M("\\sqrt{" + b2 + "}") + " ne se simplifie pas)" : "") + "."] }; };
const racB = () => { let n; do n = R.int(20, 150); while (Number.isInteger(Math.sqrt(n))); let m; do m = R.int(10, 200); while (Math.round(Math.cbrt(m)) ** 3 === m); const s = Math.floor(Math.sqrt(n)), c = Math.floor(Math.cbrt(m) + 1e-9);
const u = pk([[2, 6], [3, 6], [2, 10], [3, 15], [6, 8], [2, 14], [5, 10]]), pr = u[0] * u[1]; let a = 1, b = pr; for (let k = Math.floor(Math.sqrt(pr)); k >= 2; k--) if (pr % (k * k) === 0) { a = k; b = pr / (k * k); break; }
return { id: "rac", also: ["racprop"], d: 2, titre: "Racines",
parts: ["Encadre " + M("\\sqrt{" + n + "}") + " entre deux nombres entiers consécutifs. Justifie.", "Encadre " + M("\\sqrt[3]{" + m + "}") + " entre deux nombres entiers consécutifs. Justifie.", "Calcule " + M("\\sqrt{" + u[0] + "} \\cdot \\sqrt{" + u[1] + "}") + " et écris le résultat sous la forme " + M("a\\sqrt{b}") + "."],
q: "", sol: [M(s * s + " < " + n + " < " + (s + 1) ** 2) + ", donc " + M(s + " < \\sqrt{" + n + "} < " + (s + 1)) + ".", M(c ** 3 + " < " + m + " < " + (c + 1) ** 3) + ", donc " + M(c + " < \\sqrt[3]{" + m + "} < " + (c + 1)) + ".", M("\\sqrt{" + u[0] + " \\cdot " + u[1] + "} = \\sqrt{" + pr + "} = \\sqrt{" + a * a + " \\cdot " + b + "} = " + a + "\\sqrt{" + b + "}") + "."] }; };
const racC = () => { for (let t = 0; t < 400; t++) {
const k = R.int(2, 4), dv = k + R.int(1, 9) / 10, nS = R.int(k * k + 1, (k + 1) ** 2 - 1), nC = R.int(k ** 3 + 1, (k + 1) ** 3 - 1), qd0 = pk([3, 6, 7, 8, 9]), pn = R.int(k * qd0 + 1, (k + 1) * qd0 - 1);
if (gcd(pn, qd0) !== 1) continue;
const items = [{ t: N(dv), v: dv }, { t: "\\sqrt{" + nS + "}", v: Math.sqrt(nS), j: "s", n: nS }, { t: "\\frac{" + pn + "}{" + qd0 + "}", v: pn / qd0 }, { t: "\\sqrt[3]{" + nC + "}", v: Math.cbrt(nC), j: "c", n: nC }];
const vs = items.map((x) => x.v).sort((a, b) => a - b); if (vs.some((v, i) => i && v - vs[i - 1] < 0.04)) continue;
const just = (x) => { if (!x.j) return x.t === N(x.v) ? M(x.t) + " est déjà un nombre décimal" : M(x.t + " \\approx " + A(x.v, 2));  const lo = Math.floor(x.v * 10) / 10, e = x.j === "s" ? 2 : 3;
return M(N(lo) + "^" + e + " = " + N(r6(lo ** e)) + " < " + x.n + " < " + N(r6((lo + 0.1) ** e)) + " = " + N(r6(lo + 0.1)) + "^" + e) + " : " + M(x.t) + " est entre " + M(N(lo)) + " et " + M(N(r6(lo + 0.1)));
};
const ord = items.slice().sort((a, b) => a.v - b.v);
return { id: "rac", also: ["racprop", "fracconv"], d: 3, titre: "Comparer des nombres",
q: "Range ces nombres dans l'ordre croissant, sans calculatrice. Justifie.", parts: [M(mix(items).map((x) => x.t).join(" \\; ; \\; "))],
sol: [items.map(just).join(" ; ") + ".<br>" + M(ord.map((x) => x.t).join(" < "))] }; } return null; };


const QC = [
() => { const v = pk(["x", "a", "y"]), k = R.int(2, 9); return { s: M("(" + v + " + " + k + ")^2") + " est égal à :", o: qcm(M(v + "^2 + " + 2 * k + v + " + " + k * k), [M(v + "^2 + " + k * k), M(v + "^2 + " + k + v + " + " + k * k), M("2" + v + " + " + 2 * k)]), w: "identité " + M("(a + b)^2 = a^2 + 2ab + b^2") }; },
() => { const k = R.int(2, 9); return { s: M("(x - " + k + ")(x + " + k + ")") + " est égal à :", o: qcm(M("x^2 - " + k * k), [M("x^2 + " + k * k), M("x^2 - " + 2 * k + "x + " + k * k), M("x^2 - " + 2 * k + "x - " + k * k)]), w: "identité " + M("(a - b)(a + b) = a^2 - b^2") }; },
() => { const a = R.int(1, 9), b = R.int(1, 9), n = R.int(3, 5), v = "0{,}" + "0".repeat(n - 1) + a + b; return { s: "La notation scientifique de " + M(v) + " est :", o: qcm(M(a + "{,}" + b + " \\cdot 10^{-" + n + "}"), [M(a + "{,}" + b + " \\cdot 10^{" + n + "}"), M(a + "{,}" + b + " \\cdot 10^{-" + (n + 1) + "}"), M(a + "" + b + " \\cdot 10^{-" + n + "}")]), w: "un seul chiffre non nul avant la virgule ; la virgule recule de " + n + " rangs" }; },
() => { const F = { "d'un cône": "\\frac{\\pi r^2 h}{3}", "d'une boule": "\\frac{4}{3}\\pi r^3", "d'un cylindre": "\\pi r^2 h", "d'une pyramide": "\\frac{A_{\\text{base}} \\cdot h}{3}" }, k = pk(Object.keys(F)), W = ["\\pi r^2 h", "\\frac{\\pi r^2 h}{3}", "\\frac{4}{3}\\pi r^3", "2\\pi r h", "4\\pi r^2", "A_{\\text{base}} \\cdot h", "\\frac{A_{\\text{base}} \\cdot h}{3}"].filter((x) => x !== F[k]);
const bad = k === "d'une pyramide" ? ["A_{\\text{base}} \\cdot h", "\\frac{\\pi r^2 h}{3}", "\\frac{A_{\\text{base}} \\cdot h}{2}"] : mix(W.filter((x) => !/A_/.test(x))).slice(0, 3);
return { s: "Le volume " + k + " vaut :", o: qcm(M(F[k]), bad.map(M)), w: "formule à savoir (pas d'aide-mémoire)" }; },
() => { const t = pk([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]); return { s: M("\\sqrt{" + t[0] ** 2 + " + " + t[1] ** 2 + "}") + " est égal à :", o: qcm(M(t[2]), [M(t[0] + t[1]), M(t[2] * t[2]), M("\\sqrt{" + (t[0] + t[1]) + "}")]), w: M("\\sqrt{" + t[2] * t[2] + "} = " + t[2]) + " : on calcule d'abord sous la racine" }; },
() => { const a = R.int(2, 5); let m, n; do { m = R.int(2, 5); n = R.int(2, 4); } while (m * n === m + n); return { s: M(a + "^" + m + " \\cdot " + a + "^" + n) + " est égal à :", o: qcm(M(a + "^{" + (m + n) + "}"), [M(a + "^{" + m * n + "}"), M(a * a + "^{" + (m + n) + "}"), M(a * a + "^{" + m * n + "}")]), w: "on additionne les exposants" }; },
() => { const a = R.int(2, 4), n = R.int(2, 3), p = a ** n; return { s: M(a + "^{-" + n + "}") + " est égal à :", o: qcm(M("\\frac{1}{" + p + "}"), [M("-" + p), M("-\\frac{1}{" + p + "}"), M(p)]), w: M(a + "^{-" + n + "} = \\frac{1}{" + a + "^" + n + "}") }; },
() => { let a, b, c, d; do { b = pk([3, 4, 5, 6]); d = pk([2, 3, 4, 5, 7]); a = R.int(1, b - 1); c = R.int(1, d - 1); } while (b === d || gcd(a, b) > 1 || gcd(c, d) > 1); const s = qa([a, b], [c, d]);
return { s: M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "}") + " est égal à :", o: qcm(M(qt(s)), [M("\\frac{" + (a + c) + "}{" + (b + d) + "}"), M(qt(qr(a * c, b * d))), M("\\frac{" + (a + c) + "}{" + b * d + "}")]), w: "même dénominateur avant d'additionner" }; },
];
const qcmQ = (pool, titre, id, also) => { const L0 = mix(pool.map((f, i) => i)).slice(0, 4).map((i) => pool[i]()); return { id, also, d: 2, titre,
q: "Pour chaque énoncé, mets une croix devant la proposition correcte.", parts: L0.map((x) => x.s + opts(x.o)), sol: L0.map((x) => "<b>" + x.o.good + "</b> (" + x.w + ").") }; };


const DV = [
() => { const a = R.int(2, 4), b = R.int(1, 7), c = R.int(2, 4), d = R.int(1, 6), t1 = pm([-b, a], [-b, a]), t2 = pm([0, c], [-d, 1]); return { e: "(" + L(a, -b) + ")^2 - " + c + "x(" + L(1, -d) + ")", t: [t1, t2], r: pa(t1, t2, -1) }; },
() => { const a = R.int(1, 8), b = R.int(1, 8), c = R.int(2, 6), t1 = pm([a, 1], [-b, 1]), t2 = pm([-c, 1], [c, 1]); return { e: "(" + L(1, a) + ")(" + L(1, -b) + ") - (" + L(1, -c) + ")(" + L(1, c) + ")", t: [t1, t2], r: pa(t1, t2, -1) }; },
() => { const a = R.int(2, 4), b = R.int(1, 5), c = R.int(1, 3), d = R.int(1, 6), e = R.int(1, 5), t1 = pm([b, a], [-d, c]), t2 = pm([-e, 1], [-e, 1]); return { e: "(" + L(a, b) + ")(" + L(c, -d) + ") - (" + L(1, -e) + ")^2", t: [t1, t2], r: pa(t1, t2, -1) }; },
() => { const k = R.int(2, 3), a = R.int(1, 5), b = R.int(2, 7), t1b = pm(pm([k], [a, 1]), [a, 1]), t2 = pm([-b, 1], [b, 1]); return { e: k + "(" + L(1, a) + ")^2 - (" + L(1, -b) + ")(" + L(1, b) + ")", t: [t1b, t2], r: pa(t1b, t2, -1) }; },
];
const devQ = () => { const ks = mix([0, 1, 2, 3]).slice(0, 2), xs = ks.map((k) => { for (;;) { const x = DV[k](); if (x.r.some((c, i) => i > 0 && c)) return x; } });
return { id: "idrem", also: ["distrib", "reduire"], d: 2, titre: "Développer et réduire", q: "Développe et réduis.", parts: xs.map((x) => M(x.e)),
sol: xs.map((x) => M(x.e + " = " + P(x.t[0]) + " - \\left(" + P(x.t[1]) + "\\right) = " + P(x.r)) + ".") }; };


const FC = [
() => { let a, b; do { a = R.int(1, 5); b = R.int(1, 7); } while (gcd(a, b) > 1 || a === b); const k = R.int(2, 6); return { e: P([0, -k * b, k * a]), f: k + "x(" + L(a, -b) + ")", w: "mise en évidence de " + M(k + "x") }; },
() => { let a, b; do { a = R.int(1, 5); b = R.int(2, 9); } while (gcd(a, b) > 1); return { e: P([-b * b, 0, a * a]), f: "(" + L(a, -b) + ")(" + L(a, b) + ")", w: M("a^2 - b^2 = (a - b)(a + b)") }; },
() => { let a, b; do { a = R.int(1, 4); b = R.int(1, 7); } while (gcd(a, b) > 1); const sg = R.sign(); return { e: P([b * b, 2 * a * b * sg, a * a]), f: "(" + L(a, sg * b) + ")^2", w: "carré parfait " + M("a^2 " + (sg > 0 ? "+" : "-") + " 2ab + b^2") }; },
() => { let r1, r2; do { r1 = R.nz(-9, 9); r2 = R.nz(-9, 9); } while (r1 === r2 || r1 === -r2); return { e: P([r1 * r2, -(r1 + r2), 1]), f: "(" + L(1, -r1) + ")(" + L(1, -r2) + ")", w: "deux nombres de produit " + M(r1 * r2) + " et de somme " + M(-(r1 + r2)) }; },
() => { const a = R.int(1, 6), b = R.int(1, 8), c = R.nz(1, 8); if (b - c === 0 || b - c === -a) return null; return { e: "(" + L(1, -a) + ")(" + L(1, b) + ") - " + c + "(" + L(1, -a) + ")", f: "(" + L(1, -a) + ")(" + L(1, b - c) + ")", w: "mise en évidence de " + M("(" + L(1, -a) + ")") }; },
() => { const k = R.int(2, 5), m = R.int(2, 6); return { e: P([0, -k * m * m, 0, k]), f: k + "x(" + L(1, -m) + ")(" + L(1, m) + ")", w: "mise en évidence de " + M(k + "x") + ", puis " + M("a^2 - b^2") }; },
];
const factQ = () => { const ks = mix([0, 1, 2, 3, 4, 5]).slice(0, 4); if (!ks.includes(1) && !ks.includes(2)) ks[0] = pk([1, 2]); const xs = ks.map((k) => make(FC[k]));
return { id: "factor", also: ["idrem"], d: 2, titre: "Factoriser", q: "Factorise au maximum.", parts: xs.map((x) => M(x.e)), sol: xs.map((x) => M(x.e + " = " + x.f) + " (" + x.w + ").") }; };


const solQ = () => { const t = -R.int(1, 4), a = R.int(1, 3), b = R.int(-6, 6), c = R.int(-9, 9), d = R.nz(-5, 5), lhs = a * t * t + b * t + c, yes = R.rand() < 0.5, e = lhs - d * t + (yes ? 0 : R.nz(-3, 3)), rhs = d * t + e;
const eq = P([c, b, a]) + " = " + P([e, d]);
return { id: "eqverif", also: ["valnum", "eq1"], d: 2, titre: "Est-ce une solution ?", q: "Est-ce que " + M("(" + t + ")") + " est une solution de l'équation " + M(eq) + " ? Justifie (une réponse sans justification ne vaut rien).", parts: [],
sol: ["Membre de gauche : " + M((a === 1 ? "" : a + " \\cdot ") + "(" + t + ")^2 " + (b ? (b < 0 ? "- " + -b : "+ " + b) + " \\cdot (" + t + ") " : "") + (c ? (c < 0 ? "- " + -c : "+ " + c) : "") + " = " + lhs) + " ; membre de droite : " + M(d + " \\cdot (" + t + ")" + (e ? (e < 0 ? " - " + -e : " + " + e) : "") + " = " + rhs) + ". " + (yes ? "<b>Oui</b>, les deux membres sont égaux : " + M(t) + " est solution." : "<b>Non</b> : " + M(lhs + " \\neq " + rhs) + ", " + M(t) + " n'est pas solution.")] }; };
const eq2Q = () => { const k = R.nz(-9, 9), a = R.int(2, 7), b = R.int(1, 9), g = gcd(a, b), aa = a / g, bb = b / g, p = R.nz(-6, 6), c1 = R.int(2, 5); let c2; do c2 = R.nz(-7, 7); while (c2 === -p * c1);
return { id: "eq2fact", also: ["eq2", "factor"], d: 2, titre: "Équations du 2e degré", q: "Résous par factorisation.", parts: [M(P([0, -k, 1]) + " = 0"), M(P([-bb * bb, 0, aa * aa]) + " = 0"), M("(" + L(1, -p) + ")(" + L(c1, c2) + ") = 0")],
sol: [M("x(" + L(1, -k) + ") = 0") + " : " + M("x = 0") + " ou " + M("x = " + k) + " ; " + M(S([0, k].sort((u, v) => u - v))) + ".", M("(" + L(aa, -bb) + ")(" + L(aa, bb) + ") = 0") + " ; " + M(S([qr(-bb, aa), qr(bb, aa)])) + ".", "Un produit est nul si un facteur est nul : " + M("x = " + p) + " ou " + M(c1 + "x = " + -c2) + " ; " + M(S([[p, 1], qr(-c2, c1)].sort((u, v) => u[0] / u[1] - v[0] / v[1]))) + "."] }; };
const showQ = () => { let p, q; do { p = R.nz(-6, 7); q = R.nz(-6, 7); } while (p === q || p + q === 0); const eq = P([p * q, -(p + q), 1]) + " = 0";
const chk = (v) => M(par(v) + "^2 " + sg(-(p + q)) + " \\cdot " + par(v) + " " + sg(p * q) + " = " + v * v + " " + sg(-(p + q) * v) + " " + sg(p * q) + " = 0");
return { id: "eq2", also: ["valnum"], d: 2, titre: "Vérifier des solutions", q: "Montre que " + M(p) + " et " + M(q) + " sont des solutions de l'équation " + M(eq) + ".", parts: [], sol: ["Pour " + M("x = " + p) + " : " + chk(p) + ". Pour " + M("x = " + q) + " : " + chk(q) + ". (Autre méthode : " + M(P([p * q, -(p + q), 1]) + " = (" + L(1, -p) + ")(" + L(1, -q) + ")") + ".)"] }; };
const FOR = [["A = \\pi r^2", "r", "r = \\sqrt{\\frac{A}{\\pi}}"], ["P = 2(L + l)", "l", "l = \\frac{P}{2} - L"], ["d = v \\cdot t", "v", "v = \\frac{d}{t}"], ["V = \\frac{A_b \\cdot h}{3}", "h", "h = \\frac{3V}{A_b}"], ["\\rho = \\frac{m}{V}", "V", "V = \\frac{m}{\\rho}"], ["A = \\frac{b \\cdot h}{2}", "b", "b = \\frac{2A}{h}"], ["V = \\pi r^2 h", "h", "h = \\frac{V}{\\pi r^2}"], ["Q = \\frac{V}{t}", "t", "t = \\frac{V}{Q}"], ["c^2 = a^2 + b^2", "a", "a = \\sqrt{c^2 - b^2}"]];
const formQ = () => { const L0 = mix(FOR).slice(0, 3); return { id: "formule", d: 2, titre: "Transformer une formule", q: "Isole la lettre demandée (toutes les grandeurs sont positives).", parts: L0.map((f) => M(f[1]) + " dans " + M(f[0])), sol: L0.map((f) => M(f[2]) + ".") }; };


const SOL = [["Polyèdre à 5 faces : 3 rectangles et 2 triangles.", "prisme droit à base triangulaire"], ["Polyèdre à 6 faces rectangulaires.", "parallélépipède rectangle (pavé droit)"], ["Polyèdre à 6 faces : 1 pentagone et 5 triangles qui ont un sommet commun.", "pyramide à base pentagonale"], ["Polyèdre à 4 faces, toutes triangulaires.", "pyramide à base triangulaire (tétraèdre)"], ["Polyèdre à 8 faces : 2 hexagones et 6 rectangles.", "prisme droit à base hexagonale"], ["Développement : deux disques et un rectangle.", "cylindre"], ["Développement : un disque et un secteur de disque.", "cône"], ["Solide dont tous les points de la surface sont à la même distance du centre.", "sphère (boule)"], ["Polyèdre à 5 faces : 1 carré et 4 triangles isocèles identiques.", "pyramide à base carrée"], ["Polyèdre à 7 faces : 2 pentagones et 5 rectangles.", "prisme droit à base pentagonale"]];
const solidQ = () => { const L0 = mix(SOL).slice(0, 4); return { id: "solides", d: 2, titre: "Nommer des solides", q: "Nomme le plus précisément possible chaque solide (pour un prisme ou une pyramide, précise la base).", parts: L0.map((x) => x[0]), sol: L0.map((x) => x[1] + ".") }; };
const conePyrQ = () => { for (;;) { const r = pk([2, 3, 4, 5, 6]), h = R.int(2, 9), c = pk([2, 3, 4, 6]), V = r * r * h, H = (3 * V) / (c * c); if (!Number.isInteger(H) || H > 60 || c === r) continue;
return { id: "volmanq", also: ["volcone"], d: 3, titre: "Même volume", q: "Un cône a un rayon de " + Q(r, "cm") + " et une hauteur de " + Q(h, "cm") + ". Une pyramide à base carrée de " + Q(c, "cm") + " de côté a le même volume. Calcule la hauteur de la pyramide. Utilise " + M("\\pi \\approx 3") + ".", parts: [],
sol: ["Volume du cône : " + M("V = \\frac{\\pi r^2 h}{3} \\approx \\frac{3 \\cdot " + r * r + " \\cdot " + h + "}{3} = " + V) + " cm³. Pyramide : " + M("\\frac{" + c * c + " \\cdot H}{3} = " + V) + ", donc " + M("H = \\frac{3 \\cdot " + V + "}{" + c * c + "} = " + H) + " cm."] }; } };
const aireLitQ = () => { const f = R.int(0, 2), a = R.int(2, 4), b = R.int(1, 6);
if (f === 0) return { id: "litelab", also: ["reduire"], d: 2, titre: "Expression d'une aire", q: "Un rectangle a pour longueur " + M(L(a, b)) + " et pour largeur " + M("x") + " (en cm). On y découpe un carré de côté " + M("x") + ". Donne l'expression réduite de l'aire restante, en fonction de " + M("x") + ".", parts: [], sol: [M("x(" + L(a, b) + ") - x^2 = " + P([0, b, a]) + " - x^2 = " + P([0, b, a - 1])) + " (cm²)."] };
if (f === 1) return { id: "litelab", also: ["idrem"], d: 2, titre: "Expression d'une aire", q: "Un carré a pour côté " + M(L(1, a)) + " (en m). On y découpe un rectangle de " + M("x") + " sur " + M(b) + ". Donne l'expression réduite de l'aire restante, en fonction de " + M("x") + ".", parts: [], sol: [M("(" + L(1, a) + ")^2 - " + b + "x = " + P([a * a, 2 * a, 1]) + " - " + b + "x = " + P([a * a, 2 * a - b, 1])) + " (m²)."] };
return { id: "litelab", also: ["reduire"], d: 2, titre: "Expression d'un périmètre et d'une aire", q: "Un rectangle a pour longueur " + M(L(a, b)) + " et pour largeur " + M(L(1, -1)) + " (en cm, avec " + M("x > 1") + ").", parts: ["Donne l'expression réduite de son périmètre.", "Donne l'expression réduite de son aire."], sol: [M("2(" + L(a, b) + " + " + L(1, -1) + ") = 2(" + L(a + 1, b - 1) + ") = " + L(2 * (a + 1), 2 * (b - 1))) + " (cm).", M("(" + L(a, b) + ")(" + L(1, -1) + ") = " + P(pm([b, a], [-1, 1]))) + " (cm²)."] }; };
const preuveQ = () => { const f = R.int(0, 2), k = R.int(2, 6);
if (f === 0) return { id: "idrem", also: ["litelab"], d: 3, titre: "Prouver avec le calcul littéral", q: "Montre que, pour tout nombre entier " + M("n") + ", " + M("(n + " + k + ")^2 - (n - " + k + ")^2") + " est un multiple de " + M(4 * k) + ".", parts: [], sol: [M("n^2 + " + 2 * k + "n + " + k * k + " - (n^2 - " + 2 * k + "n + " + k * k + ") = " + 4 * k + "n") + " : c'est " + M(4 * k) + " fois un entier."] };
if (f === 1) return { id: "litelab", also: ["reduire"], d: 3, titre: "Prouver avec le calcul littéral", q: "Montre que la somme de " + (k % 2 ? 3 : 5) + " nombres entiers consécutifs est toujours un multiple de " + (k % 2 ? 3 : 5) + ".", parts: [], sol: [k % 2 ? "Avec " + M("n") + ", " + M("n + 1") + ", " + M("n + 2") + " : " + M("n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)") + ", un multiple de 3." : "Avec " + M("n") + " à " + M("n + 4") + " : " + M("5n + 10 = 5(n + 2)") + ", un multiple de 5."] };
return { id: "idrem", also: ["litelab"], d: 3, titre: "Prouver avec le calcul littéral", q: "Montre que la différence des carrés de deux nombres entiers consécutifs est toujours un nombre impair.", parts: [], sol: [M("(n + 1)^2 - n^2 = n^2 + 2n + 1 - n^2 = 2n + 1") + " : un nombre pair plus 1, donc impair."] }; };


const pythQcm = () => { const lt = mix(["R", "K", "E", "T", "M", "S", "U"]).slice(0, 3), [P1, Rr, P3] = lt, a = R.int(8, 30) / 10, b = R.int(15, 45) / 10, c2 = r6(a * a + b * b);
return { id: "pyth", also: ["pythrec"], d: 2, titre: "Pythagore", q: "Pour chaque énoncé, mets une croix devant la proposition correcte.",
parts: ["Dans un triangle rectangle, le carré de l'hypoténuse est égal :" + opts(mix(["au carré de la somme des deux autres côtés", "à la somme des carrés des deux autres côtés", "au produit des deux autres côtés", "à la somme des deux autres côtés"])),
"Si le triangle " + M(P1 + Rr + P3) + " est rectangle en " + M(Rr) + ", alors :" + opts(mix([M(P1 + P3 + "^2 = " + P1 + Rr + "^2 + " + Rr + P3 + "^2"), M(P1 + Rr + "^2 = " + P1 + P3 + "^2 + " + Rr + P3 + "^2"), M(Rr + P3 + "^2 = " + P1 + P3 + "^2 + " + P1 + Rr + "^2"), M(P1 + P3 + "^2 = " + P1 + Rr + "^2 - " + Rr + P3 + "^2")])),
"Dans le triangle " + M("XYZ") + ", " + M("XY = " + N(a)) + " m, " + M("YZ = " + N(b)) + " m et " + M("XZ = \\sqrt{" + N(c2) + "}") + " m. Alors :" + opts(mix(["les segments " + M("[XY]") + " et " + M("[YZ]") + " sont perpendiculaires", "les segments " + M("[XZ]") + " et " + M("[YZ]") + " sont perpendiculaires", "le triangle n'est pas rectangle", "le triangle est rectangle en " + M("Z")]))],
sol: ["<b>À la somme des carrés des deux autres côtés.</b>", "<b>" + M(P1 + P3 + "^2 = " + P1 + Rr + "^2 + " + Rr + P3 + "^2") + "</b> : l'hypoténuse " + M("[" + P1 + P3 + "]") + " est en face de l'angle droit.", "<b>" + M("[XY]") + " et " + M("[YZ]") + " sont perpendiculaires</b> : " + M(N(a) + "^2 + " + N(b) + "^2 = " + N(c2) + " = XZ^2") + ", donc (réciproque de Pythagore) le triangle est rectangle en " + M("Y") + "."] }; };
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
const echelleQ = () => { const Lh = pk([4, 4.5, 5, 6, 7]), d = R.int(10, 18) / 10, h = Math.sqrt(Lh * Lh - d * d), right = R.rand() < 0.5, t = pk(TRI), m = pk([1, 2, 3]) / (t[2] > 20 ? 2 : 1), s = [t[0] * m, t[1] * m, right ? t[2] * m : t[2] * m + pk([-1, 1])];
return { id: "pyth", also: ["pythrec"], d: 3, titre: "Échelle et triangle", q: "",
parts: ["Une échelle de " + Q(Lh, "m") + " est appuyée contre un mur vertical ; son pied est à " + Q(d, "m") + " du mur. À quelle hauteur touche-t-elle le mur ? (au centimètre près)", "Un triangle a des côtés de " + M(N(s[0])) + " cm, " + M(N(s[1])) + " cm et " + M(N(s[2])) + " cm. Est-il rectangle ? Justifie."],
sol: [M("h = \\sqrt{" + N(Lh) + "^2 - " + N(d) + "^2} = \\sqrt{" + N(r6(Lh * Lh - d * d)) + "} \\approx " + A(h, 2)) + " m.", M(N(s[0]) + "^2 + " + N(s[1]) + "^2 = " + N(r6(s[0] ** 2 + s[1] ** 2))) + " et " + M(N(s[2]) + "^2 = " + N(r6(s[2] ** 2))) + (right ? " : égalité, donc le triangle est rectangle (réciproque de Pythagore)." : " : pas d'égalité, donc le triangle n'est pas rectangle (contraposée de Pythagore).")] }; };
const paveQ = () => { const a = R.int(30, 80), b = R.int(20, 50), c = R.int(20, 60), d1 = Math.sqrt(a * a + b * b), d2 = Math.sqrt(a * a + b * b + c * c), tige = Math.round(d2 + pk([-6, -4, 3, 5]));
return { id: "pythfig", also: ["pyth"], d: 3, titre: "Pythagore dans l'espace", q: "Une boîte en forme de pavé droit mesure " + Q(a, "cm") + " sur " + Q(b, "cm") + " et " + Q(c, "cm") + " de haut.", fig: FIG.box(a + " cm", b + " cm", c + " cm"),
parts: ["Calcule la longueur de la diagonale du fond (au millimètre près).", "Calcule la longueur de la diagonale de la boîte (au millimètre près). Garde la valeur exacte pour ce calcul.", "Peut-on y ranger une tige rigide de " + Q(tige, "cm") + " ? Justifie."],
sol: [M("d = \\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + (a * a + b * b) + "} \\approx " + A(d1, 1)) + " cm.", M("D = \\sqrt{" + (a * a + b * b) + " + " + c + "^2} = \\sqrt{" + (a * a + b * b + c * c) + "} \\approx " + A(d2, 1)) + " cm (sans arrondir " + M("d") + " avant).", (tige <= d2 ? "Oui" : "Non") + " : la plus grande longueur possible est la diagonale, " + M(A(d2, 1)) + " cm, " + (tige <= d2 ? "plus" : "moins") + " que " + tige + " cm."] }; };
const terrainQ = () => { const t = pk(TRI.slice(0, 4)), m = pk([5, 6, 8, 10, 12]) / (t[2] > 20 ? 2 : 1), a = t[0] * m, b = t[1] * m, c = t[2] * m, mes = R.rand() < 0.5 ? c : c + pk([-0.6, 0.4]), l = R.int(40, 90), w = R.int(20, 60), dg = Math.sqrt(l * l + w * w);
return { id: "pythrec", also: ["pyth"], d: 3, titre: "Sur le terrain",
q: "", parts: ["Un maçon vérifie le coin d'une dalle : il mesure " + Q(a, "m") + " sur un bord, " + Q(b, "m") + " sur l'autre, et " + Q(mes, "m") + " entre les deux marques. Le coin est-il droit ? Justifie.", "Un terrain rectangulaire mesure " + Q(l, "m") + " sur " + Q(w, "m") + ". Combien de mètres gagne-t-on en le traversant en diagonale plutôt qu'en longeant deux côtés ? (au décimètre)"],
sol: [M(N(a) + "^2 + " + N(b) + "^2 = " + N(r6(a * a + b * b))) + " et " + M(N(mes) + "^2 = " + N(r6(mes * mes))) + (mes === c ? " : égalité, le coin est droit (réciproque de Pythagore)." : " : pas d'égalité, le coin n'est pas droit (contraposée)."), "Diagonale : " + M("\\sqrt{" + l + "^2 + " + w + "^2} = \\sqrt{" + (l * l + w * w) + "} \\approx " + A(dg, 1)) + " m ; gain : " + M(l + w + " - " + A(dg, 1) + " \\approx " + A(l + w - dg, 1)) + " m."] }; };


const PB = [
() => { const d = R.int(2, 9), n1 = R.int(3, 5), n2 = n1 + R.int(1, 3); let p, r; for (;;) { p = R.int(d + 3, n2 * d + 25); r = n2 * (p - d) - n1 * p; if (r > 0 && r < p) break; } const nm = who(), obj = pk(["mangas", "bandes dessinées", "places de cinéma", "livres de poche"]);
return { x: "le prix d'un des " + obj + " (en CHF)", t: nm + " veut acheter des " + obj + " qui ont tous le même prix. Avec son argent, " + nm + " peut en acheter exactement " + n1 + " et il lui reste " + r + " CHF. Si chacun coûtait " + d + " CHF de moins, il pourrait en acheter exactement " + n2 + ". Quel est le prix d'un des " + obj + " ?", eq: n1 + "x + " + r + " = " + n2 + "(x - " + d + ")", v: p }; },
() => { const f = R.int(8, 14), dif = R.int(22, 32), k = pk([2, 3]); const yrs = (k * f - f - dif) / (1 - k); if (!Number.isInteger(yrs) || yrs <= 0 || yrs > 30) return null;
return { x: "l'âge actuel de la fille (en années)", t: "Une mère a " + dif + " ans de plus que sa fille. Dans " + yrs + " ans, elle aura " + (k === 2 ? "le double" : "le triple") + " de l'âge de sa fille. Quel âge a la fille aujourd'hui ?", eq: "x + " + dif + " + " + yrs + " = " + k + "(x + " + yrs + ")", v: f }; },
() => { const l = R.int(4, 15), k = R.int(2, 4), m = R.int(1, 5), Lg = k * l - m, Pr = 2 * (l + Lg); if (Lg <= l) return null;
return { x: "la largeur du rectangle (en m)", t: "La longueur d'un rectangle mesure " + m + " m de moins que " + (k === 2 ? "le double" : k === 3 ? "le triple" : "le quadruple") + " de sa largeur. Son périmètre vaut " + Pr + " m. Quelles sont ses dimensions ?", eq: "2(x + " + k + "x - " + m + ") = " + Pr, v: l }; },
() => { const n = R.int(12, 80), k = pk([3, 4, 5]), s = k * n + (k * (k - 1)) / 2;
return { x: "le plus petit des " + k + " nombres", t: "La somme de " + k + " nombres entiers consécutifs vaut " + s + ". Quels sont ces nombres ?", eq: Array.from({ length: k }, (_, i) => (i ? "(x + " + i + ")" : "x")).join(" + ") + " = " + s, v: n }; },
];
const poserQ = () => { const k = R.int(0, PB.length - 1), x = make(PB[k]); return { id: "probeq", d: 3, titre: "Mettre en équation", q: "Identifie l'inconnue, puis pose l'équation qui permet de résoudre le problème (<b>sans la résoudre</b>).<br>« " + x.t + " »", parts: ["L'inconnue " + M("x") + " représente :", "L'équation est :"], sol: [M("x") + " : " + x.x + ".", M(x.eq) + ". (Pour vérifier : la solution est " + M(x.v) + ".)"] }; };
const billetsQ = () => { for (;;) { const N0 = pk([120, 150, 180, 200, 240, 300]), pa0 = pk([14, 15, 16, 18, 20]), pe = pa0 - pk([4, 5, 6, 8]), e = R.int(30, N0 - 30), T = pa0 * (N0 - e) + pe * e; if (e % 5) continue;
return { id: "probeq", also: ["eq1"], d: 3, titre: "Mettre en équation et résoudre", q: "Un " + pk(["cinéma", "musée", "zoo", "théâtre"]) + " a vendu " + N0 + " billets : " + M(pa0) + " CHF pour un adulte, " + M(pe) + " CHF pour un enfant. La recette est de " + M(N(T)) + " CHF.", parts: ["Identifie l'inconnue et pose l'équation.", "Résous-la : combien d'enfants y avait-il ?"],
sol: [M("e") + " = nombre d'enfants ; adultes : " + M(N0 + " - e") + " ; " + M(pa0 + "(" + N0 + " - e) + " + pe + "e = " + N(T)) + ".", M(N(pa0 * N0) + " - " + (pa0 - pe) + "e = " + N(T)) + ", " + M((pa0 - pe) + "e = " + N(pa0 * N0 - T)) + ", " + M("e = " + e) + " : " + e + " enfants (et " + (N0 - e) + " adultes)."] }; } };
const deg2Q = () => { if (R.rand() < 0.6) { const w = R.int(3, 12), k = R.int(2, 7), Ar = w * (w + k);
return { id: "probeq2", also: ["eq2fact"], d: 3, titre: "Problème du 2e degré", q: "Un jardin rectangulaire a une longueur de " + Q(k, "m") + " de plus que sa largeur et une aire de " + Q(Ar, "m^2") + ".", parts: ["Pose l'équation (inconnue : la largeur " + M("x") + ").", "Résous-la par factorisation et donne les dimensions du jardin."],
sol: [M("x(x + " + k + ") = " + Ar) + ", soit " + M(P([-Ar, k, 1]) + " = 0") + ".", M("(" + L(1, w + k) + ")(" + L(1, -w) + ") = 0") + " : " + M("x = " + w) + " ou " + M("x = " + -(w + k)) + " (impossible, une longueur est positive). Le jardin mesure " + w + " m sur " + (w + k) + " m."] }; }
const k = R.int(3, 12); return { id: "probeq2", also: ["eq2"], d: 3, titre: "Problème du 2e degré", q: "Le carré d'un nombre est égal à " + k + " fois ce nombre.", parts: ["Pose l'équation.", "Résous-la par factorisation : quels nombres conviennent ?"], sol: [M("x^2 = " + k + "x") + ", soit " + M("x^2 - " + k + "x = 0") + ".", M("x(x - " + k + ") = 0") + " : " + M(S([0, k])) + ". Les deux nombres conviennent (ne pas diviser par " + M("x") + " : on perdrait 0)."] }; };


const resQ = () => { for (;;) { const b = pk([2, 3, 4, 5, 6]), e = pk([2, 3, 4, 5, 6]), x0 = R.int(-5, 9), a = R.int(-6, 8), c = R.int(1, 4), d = R.int(-7, 7); if (b === e) continue;
const f = qs(qr(x0 + a, b), qr(c * x0 - d, e)); if (f[1] !== 1) continue; const Lc = (b * e) / gcd(b, e), ca = Lc / b, ce = Lc / e; if (ca - ce * c === 0) continue;
const k = R.int(2, 5), u = R.int(2, 5), v = R.int(1, 7), none = R.rand() < 0.5, w = none ? pk([-1, 1]) * R.int(1, 9) : -k * v; if (none && w === -k * v) continue;
return { id: "eqfrac", also: ["eq1"], d: 3, titre: "Résoudre des équations", q: "Résous les équations suivantes.", parts: [M("\\frac{" + L(1, a) + "}{" + b + "} - \\frac{" + L(c, -d) + "}{" + e + "} = " + f[0]), M(k + "(" + L(u, -v) + ") = " + P([w, k * u]))],
sol: [M("\\cdot " + Lc) + " : " + M(ca + "(" + L(1, a) + ") - " + ce + "(" + L(c, -d) + ") = " + Lc * f[0]) + ", " + M(P([ca * a + ce * d, ca - ce * c]) + " = " + Lc * f[0]) + ", " + M(S([x0])) + ".", M(P([-k * v, k * u]) + " = " + P([w, k * u]) + "\\ \\Rightarrow\\ " + -k * v + " = " + w) + (none ? " : égalité fausse, " + M("S = \\emptyset") + " (aucune solution)." : " : toujours vrai, tous les nombres sont solutions.")] }; } };
const res2Q = () => { for (;;) { const a = pk([2, 3, 4]), c = pk([3, 5, 6]), e = pk([4, 6, 12]), b = R.int(1, 6), d = R.int(1, 8); if (a === c || c === e || a === e) continue;
const Lc = [a, c, e].reduce((m, x) => (m * x) / gcd(m, x)), co = Lc / a + Lc / c - Lc / e, cst = (Lc / e) * d + (Lc / c) * b; if (!co) continue; const sol = qr(cst, co); if (sol[1] === 1 && Math.abs(sol[0]) < 2) continue;
const p = R.int(2, 5), q = R.int(2, 4), r = R.int(1, 6), s = R.int(2, 4), t = R.int(1, 5), x1 = R.int(-4, 6); if (p * q - s === 0) continue; const u = p * q * x1 - p * r - s * x1 - s * t;
return { id: "eqfrac", also: ["eq1"], d: 3, titre: "Résoudre des équations", q: "Résous les équations suivantes.", parts: [M("\\frac{x}{" + a + "} + \\frac{" + L(1, -b) + "}{" + c + "} = \\frac{" + L(1, d) + "}{" + e + "}"), M(p + "(" + L(q, -r) + ") - " + s + "(" + L(1, t) + ") = " + u)],
sol: [M("\\cdot " + Lc) + " : " + M((Lc / a) + "x + " + Lc / c + "(" + L(1, -b) + ") = " + Lc / e + "(" + L(1, d) + ")") + ", " + M(co + "x = " + cst) + ", " + M(S([sol])) + ".", M(P([-p * r, p * q]) + " - " + (s === 1 ? "" : s) + "x - " + s * t + " = " + u) + ", " + M(P([-p * r - s * t, p * q - s]) + " = " + u) + ", " + M(S([x1])) + "."] }; } };


const bagueQ = () => { const D = pk([18, 20, 22]), dd = D - pk([2, 4]), h = pk([3, 4, 5]), pr = pk([0.5, 0.4, 0.8]), R1 = D / 2, R2 = dd / 2, Ab = 2 * Math.PI * (R1 * R1 - R2 * R2), Ae = 2 * Math.PI * R1 * h, Ai = 2 * Math.PI * R2 * h, At = Ab + Ae + Ai, cost = Math.ceil(At * pr);
return { id: "airelat", also: ["volcomp"], d: 3, titre: "La bague", q: "Une bague est un cylindre creux : diamètre extérieur " + Q(D, "mm") + ", diamètre intérieur " + Q(dd, "mm") + ", hauteur " + Q(h, "mm") + ". On la recouvre d'or sur toutes ses faces ; recouvrir " + M("1" + un("mm^2")) + " coûte " + M(N(pr)) + " CHF.", parts: ["Fais un croquis et calcule l'aire totale à recouvrir (valeur exacte avec " + M("\\pi") + ", puis au centième).", "Combien coûte la dorure ? (au franc supérieur)"],
sol: ["Deux couronnes : " + M("2\\pi(" + N(R1) + "^2 - " + N(R2) + "^2) = " + N(r6(2 * (R1 * R1 - R2 * R2))) + "\\pi") + " ; face extérieure : " + M("2\\pi \\cdot " + N(R1) + " \\cdot " + h + " = " + N(2 * R1 * h) + "\\pi") + " ; face intérieure : " + M("2\\pi \\cdot " + N(R2) + " \\cdot " + h + " = " + N(2 * R2 * h) + "\\pi") + ". Total : " + M(N(r6(At / Math.PI)) + "\\pi \\approx " + A(At, 2)) + " mm².", M(N(r6(At / Math.PI)) + "\\pi \\cdot " + N(pr) + " \\approx " + A(At * pr, 2)) + " : " + cost + " CHF (au franc supérieur ; calcul fait avec la valeur exacte)."] }; };
const crayonQ = () => { const r = pk([0.35, 0.4, 0.45]), Lc = R.int(12, 17), hc = pk([1.5, 2, 2.5]), V = Math.PI * r * r * Lc + (Math.PI * r * r * hc) / 3;
return { id: "volcomp", also: ["volcone", "vol"], d: 3, titre: "Le crayon", q: "Un crayon est formé d'un cylindre de rayon " + Q(r, "cm") + " et de longueur " + Q(Lc, "cm") + ", terminé par un cône de même rayon et de hauteur " + Q(hc, "cm") + ".", parts: ["Fais un croquis à main levée avec les mesures.", "Calcule le volume du crayon (au centième)."],
sol: ["Un cylindre couché, prolongé par un cône (pointe), mesures reportées.", M("V = \\pi \\cdot " + N(r) + "^2 \\cdot " + Lc + " + \\frac{\\pi \\cdot " + N(r) + "^2 \\cdot " + N(hc) + "}{3} \\approx " + A(V, 2)) + " cm³ (calcul en une fois, sans arrondi intermédiaire)."] }; };
const cornetQ = () => { const r = R.int(2, 4), h = R.int(8, 12), kc = (r * r * h) / 3, kb = (2 * r ** 3) / 3, k = kc + kb, Ad = 2 * r * r;
return { id: "volcone", also: ["volcomp"], d: 3, titre: "Le cornet de glace", q: "Un cornet de glace est un cône de rayon " + Q(r, "cm") + " et de hauteur " + Q(h, "cm") + ", surmonté d'une demi-boule de glace de même rayon.", parts: ["Calcule le volume total : valeur exacte (avec " + M("\\pi") + "), puis au centième.", "Calcule l'aire de la surface de la demi-boule (sans le disque), au centième."],
sol: ["Cône : " + M("\\frac{\\pi \\cdot " + r * r + " \\cdot " + h + "}{3} = " + qt(qr(3 * kc, 3)) + "\\pi") + " ; demi-boule : " + M("\\frac{1}{2} \\cdot \\frac{4}{3}\\pi \\cdot " + r ** 3 + " = " + qt(qr(3 * kb, 3)) + "\\pi") + ". Total : " + M(qt(qr(Math.round(3 * k), 3)) + "\\pi \\approx " + A(k * Math.PI, 2)) + " cm³.", M("\\frac{4\\pi r^2}{2} = 2\\pi \\cdot " + r * r + " = " + Ad + "\\pi \\approx " + A(Ad * Math.PI, 2)) + " cm²."] }; };
const pyrQ = () => { const t = pk([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), m = pk([1, 2]), hb = t[0] * m, h = t[1] * m, ap = t[2] * m, c = 2 * hb;
return { id: "airepyr", also: ["pythfig", "volcone"], d: 3, titre: "La pyramide", q: "Une pyramide régulière a une base carrée de " + Q(c, "m") + " de côté ; la hauteur de chaque face triangulaire (apothème) mesure " + Q(ap, "m") + ".", fig: FIG.pyramid(c + " m", "h = ?"), parts: ["Calcule la hauteur de la pyramide.", "Calcule son volume.", "Calcule l'aire latérale (les 4 faces triangulaires)."],
sol: ["Triangle rectangle (hauteur, demi-côté, apothème) : " + M("h = \\sqrt{" + ap + "^2 - " + hb + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.", M("V = \\frac{" + c + "^2 \\cdot " + h + "}{3} = " + N((c * c * h) / 3)) + " m³.", M("4 \\cdot \\frac{" + c + " \\cdot " + ap + "}{2} = " + String(2 * c * ap).replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}")) + " m²."] } ; };
const manqQ = () => { if (R.rand() < 0.5) { const r = pk([3.5, 4, 4.5, 5, 6]), Vl = pk([0.33, 0.5, 0.75, 1, 1.5]), hh = (Vl * 1000) / (Math.PI * r * r);
return { id: "volmanq", also: ["uvol", "vol"], d: 3, titre: "Grandeur manquante", q: "Une boîte cylindrique a un rayon intérieur de " + Q(r, "cm") + " et contient exactement " + Q(Vl, "L") + ".", fig: FIG.cylinder("r = " + N(r).replace("{,}", ",") + " cm", "h = ?"), parts: ["Convertis le volume en cm³.", "Calcule la hauteur de la boîte (au millimètre près)."],
sol: [M(N(Vl) + un("L") + " = " + N(Vl) + un("dm^3") + " = " + N(Vl * 1000) + un("cm^3")) + ".", M("h = \\frac{V}{\\pi r^2} = \\frac{" + N(Vl * 1000) + "}{\\pi \\cdot " + N(r) + "^2} \\approx " + A(hh, 1)) + " cm."] }; }
const V = pk([500, 1000, 2000, 4000, 5000]), rr = Math.cbrt((3 * V) / (4 * Math.PI));
return { id: "volmanq", also: ["volcone"], d: 3, titre: "Grandeur manquante", q: "Une boule a un volume de " + Q(V, "cm^3") + ".", parts: ["Calcule son rayon (au millimètre près).", "Calcule l'aire de sa sphère (au cm² près), avec la valeur non arrondie du rayon."],
sol: [M("\\frac{4}{3}\\pi r^3 = " + N(V)) + " donne " + M("r = \\sqrt[3]{\\frac{3 \\cdot " + N(V) + "}{4\\pi}} \\approx " + A(rr, 1)) + " cm.", M("4\\pi r^2 \\approx " + A(4 * Math.PI * rr * rr, 0)) + " cm² (avec r en mémoire ; avec " + M(A(rr, 1)) + " on trouverait " + A(4 * Math.PI * (+rr.toFixed(1)) ** 2, 0) + " : arrondi intermédiaire sanctionné)."] }; };


const citerneQ = () => { let V, q; do { V = pk([4000, 5000, 6000, 7500, 9000]); q = pk([20, 25, 30, 40, 50]); } while (V % q); const rho = pk([0.84, 0.85, 0.86]), d = R.int(90, 180), tm = pk([75, 90, 105, 120]), t = V / q;
return { id: "gquot", also: ["vitesse", "utemps"], d: 3, titre: "La livraison de mazout", q: "", parts: ["Une citerne de " + Q(V, "L") + " se remplit avec un débit de " + Q(q, "L/min") + ". Combien de temps faut-il ? (en h et min)", "Le mazout a une masse volumique de " + Q(rho, "kg/L") + ". Quelle est la masse du mazout dans la citerne pleine ?", "Le camion a parcouru " + Q(d, "km") + " en " + Math.floor(tm / 60) + " h " + String(tm % 60).padStart(2, "0") + " min. Quelle est sa vitesse moyenne ? (au dixième)"],
sol: [M(N(V) + " : " + q + " = " + N(t)) + " min = " + Math.floor(t / 60) + " h " + Math.round(t % 60) + " min.", M(N(V) + " \\cdot " + N(rho) + " = " + N(r6(V * rho))) + " kg.", M(Math.floor(tm / 60) + "\\text{ h }" + (tm % 60) + "\\text{ min} = " + N(tm / 60) + "\\text{ h}") + " ; " + M("v = " + d + " : " + N(tm / 60) + " \\approx " + A(d / (tm / 60), 1)) + " km/h."] }; };
const tgvQ = () => { let v, d; do { v = pk([240, 280, 300, 320]); d = pk([420, 450, 560, 600, 640, 700, 800]); } while ((d * 60) % v); const g = pk([2, 3, 4]), t = d / v;
return { id: "vitesse", also: ["ucomp", "gquot"], d: 3, titre: "Vitesses et débits", q: "", parts: ["Un TGV roule à " + Q(v, "km/h") + " de moyenne. Combien de temps lui faut-il pour " + Q(d, "km") + " ? (en h et min)", "Exprime sa vitesse en m/s (au centième).", "Un robinet qui fuit perd " + g + " gouttes par seconde ; 20 gouttes font " + M("1" + un("mL")) + ". Combien de litres perd-il en un jour ? (au centième)"],
sol: [M("t = " + d + " : " + v + " = " + N(r6(t))) + " h = " + Math.floor(t) + " h " + Math.round((t - Math.floor(t)) * 60) + " min.", M(v + " : 3{,}6 \\approx " + A(v / 3.6, 2)) + " m/s.", "En un jour : " + M(g + " \\cdot 86\\text{'}400 = " + N(g * 86400)) + " gouttes ; " + M(N(g * 86400) + " : 20 = " + N(g * 4320)) + " mL " + M("\\approx " + A(g * 4.32, 2)) + " L."] }; };
const MET = [["aluminium", 2.7], ["fer", 7.9], ["cuivre", 8.9], ["argent", 10.5], ["plomb", 11.3], ["or", 19.3]];
const lingotQ = () => { const mt = pk(MET), a = R.int(4, 10), b = R.int(2, 5), c = R.int(1, 3), V = a * b * c, m = r6(+(mt[1] * V).toFixed(1)), Vq = pk([60, 80, 120, 150]), q = pk([4, 5, 6, 8]);
return { id: "gquot", also: ["vol", "ucomp"], d: 3, titre: "Masse volumique et débit", q: "", parts: ["Un lingot en forme de pavé mesure " + Q(a, "cm") + " sur " + Q(b, "cm") + " sur " + Q(c, "cm") + " et pèse " + Q(m, "g") + ". Calcule sa masse volumique et trouve le métal (" + MET.map((x) => x[0] + " " + String(x[1]).replace(".", ",")).join(", ") + " g/cm³).", "Exprime cette masse volumique en kg/m³.", "Un aquarium de " + Q(Vq, "L") + " est rempli par un tuyau de débit " + Q(q, "L/min") + ". Combien de temps faut-il ? (en min et s)"],
sol: [M("V = " + a + " \\cdot " + b + " \\cdot " + c + " = " + V) + " cm³ ; " + M("\\rho = " + N(m) + " : " + V + " = " + N(r6(m / V))) + " g/cm³ : " + mt[0] + ".", M("1" + un("g/cm^3") + " = 1000" + un("kg/m^3")) + " : " + M(N(r6(m / V * 1000))) + " kg/m³.", M(Vq + " : " + q + " = " + N(r6(Vq / q))) + " min = " + Math.floor(Vq / q) + " min " + Math.round((Vq / q - Math.floor(Vq / q)) * 60) + " s."] }; };


const etangQ = () => { for (;;) { const ad = R.int(6, 15), db = R.int(10, 30), de = R.int(5, 14), ab = ad + db, bc = r6((de * ab) / ad), ac = R.int(20, 45), ae = r6((ac * ad) / ab); if (Math.abs(bc * 10 - Math.round(bc * 10)) > 1e-9 || Math.abs(ae * 100 - Math.round(ae * 100)) > 1e-9) continue;
return { id: "thales", d: 3, titre: "La largeur de l'étang", q: "Pour mesurer la largeur " + M("BC") + " d'un étang, on plante des piquets : " + M("D \\in [AB]") + ", " + M("E \\in [AC]") + " et " + M("(DE) \\parallel (BC)") + ". On mesure " + M("AD = " + ad) + " m, " + M("DB = " + db) + " m, " + M("DE = " + N(de)) + " m et " + M("AC = " + ac) + " m.", fig: FIG.thales([[110, 52, ad + " m"], [80, 124, db + " m"], [150, 70, de + " m"]]), parts: ["Calcule " + M("BC") + ".", "Calcule " + M("AE") + "."],
sol: [M("AB = " + ad + " + " + db + " = " + ab) + " ; Thalès : " + M("\\frac{BC}{DE} = \\frac{AB}{AD}") + ", donc " + M("BC = " + de + " \\cdot \\frac{" + ab + "}{" + ad + "} = " + N(bc)) + " m.", M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AE = " + ac + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + N(ae)) + " m."] }; } };
const ombreQ = () => { const b = pk([1, 1.2, 1.5, 2]), s = R.int(8, 25) / 10, S0 = R.int(60, 200) / 10, H = (b * S0) / s, p = pk([1.6, 1.7, 1.8]), sp = (p * s) / b;
return { id: "thales", d: 3, titre: "L'arbre et son ombre", q: "Au même moment (rayons du soleil parallèles), un bâton vertical de " + Q(b, "m") + " a une ombre de " + Q(s, "m") + ", et un arbre a une ombre de " + Q(S0, "m") + ".", parts: ["Fais un croquis (configuration de Thalès) et calcule la hauteur de l'arbre (au centimètre près).", "Quelle est, au même moment, la longueur de l'ombre d'une personne de " + Q(p, "m") + " ? (au centimètre)"],
sol: [M("\\frac{H}{" + N(b) + "} = \\frac{" + N(S0) + "}{" + N(s) + "}") + ", donc " + M("H = " + N(b) + " \\cdot \\frac{" + N(S0) + "}{" + N(s) + "} \\approx " + A(H, 2)) + " m.", M(N(p) + " \\cdot \\frac{" + N(s) + "}{" + N(b) + "} \\approx " + A(sp, 2)) + " m."] }; };
const papillonQ = () => { for (;;) { const ca = R.int(3, 9), k = pk([1.5, 2, 2.5, 3]), ce = r6(ca * k), ab = R.int(4, 12), de = r6(ab * k), cb = R.int(3, 10), cd = r6(cb * k); if (ce === ca) continue;
return { id: "thales", d: 3, titre: "Configuration papillon", q: "Les droites " + M("(AE)") + " et " + M("(BD)") + " se coupent en " + M("C") + ", et " + M("(AB) \\parallel (DE)") + ". On sait que " + M("CA = " + ca) + " cm, " + M("CE = " + N(ce)) + " cm, " + M("AB = " + ab) + " cm et " + M("CB = " + cb) + " cm.", parts: ["Calcule " + M("DE") + ".", "Calcule " + M("CD") + "."],
sol: [M("\\frac{DE}{AB} = \\frac{CE}{CA} = \\frac{" + N(ce) + "}{" + ca + "}") + ", donc " + M("DE = " + ab + " \\cdot \\frac{" + N(ce) + "}{" + ca + "} = " + N(de)) + " cm.", M("CD = " + cb + " \\cdot \\frac{" + N(ce) + "}{" + ca + "} = " + N(cd)) + " cm."] }; } };


const maquetteQ = () => { const k = pk([20, 25, 40, 50]), H = R.int(3, 12), v = pk([0.8, 1.2, 1.5, 2.4]), Vr = r6((v * k ** 3) / 1000);
return { id: "agrand", also: ["echelle"], d: 3, titre: "La maquette", q: "La maquette d'un monument est à l'échelle " + M("1\\,:\\," + k) + ".", parts: ["Le monument mesure " + Q(H, "m") + " de haut. Quelle est la hauteur de la maquette, en cm ?", "La maquette a un volume de " + Q(v, "dm^3") + ". Quel est le volume du monument, en m³ ?"],
sol: [M(H + un("m") + " = " + H * 100 + un("cm")) + " ; " + M(H * 100 + " : " + k + " = " + N(r6((H * 100) / k))) + " cm.", "Les volumes sont multipliés par " + M(k + "^3 = " + N(k ** 3)) + " : " + M(N(v) + " \\cdot " + N(k ** 3) + " = " + N(r6(v * k ** 3))) + " dm³ " + M("= " + N(Vr)) + " m³."] }; };
const agrandQ = () => { const c = R.int(2, 6), k = pk([1.5, 2.5, 3, 0.5]), V = pk([240, 360, 480]), kr = pk([0.5, 2, 3]);
return { id: "agrand", d: 3, titre: "Agrandir, réduire", q: "", parts: ["Un carré de " + Q(c * c, "cm^2") + " est " + (k < 1 ? "réduit" : "agrandi") + " avec le rapport " + M(N(k)) + ". Calcule le côté et l'aire du nouveau carré.", "Une boîte de " + Q(V, "cm^3") + " est " + (kr < 1 ? "réduite" : "agrandie") + " avec le rapport " + M(N(kr)) + ". Calcule le volume de la nouvelle boîte."],
sol: ["Côté : " + M(c + " \\cdot " + N(k) + " = " + N(c * k)) + " cm ; aire : " + M(c * c + " \\cdot " + N(k) + "^2 = " + N(r6(c * c * k * k))) + " cm² (les aires sont multipliées par " + M("k^2") + ").", M(V + " \\cdot " + N(kr) + "^3 = " + N(r6(V * kr ** 3))) + " cm³ (les volumes sont multipliés par " + M("k^3") + ")."] }; };
const deviseQ = () => { const t = pk([0.93, 0.94, 0.96, 0.97]), e = R.int(40, 250), m1 = pk([2.5, 3, 3.5]), p1 = r6(+(m1 * pk([4.2, 5.6, 6.8])).toFixed(2)), m2 = pk([1.2, 4.5, 5.2, 7]);
return { id: "prop", also: ["change"], d: 3, titre: "Proportionnalité", q: "", parts: ["Le jour du départ, " + M("1" + un("EUR") + " = " + N(t) + un("CHF")) + ". Combien coûte en CHF un article à " + Q(e, "EUR") + " ? (au centime)", "Avec " + Q(100, "CHF") + ", combien d'euros obtient-on ? (au centime)", Q(m1, "kg") + " de cerises coûtent " + Q(p1, "CHF") + ". Combien coûtent " + Q(m2, "kg") + " ? (au centime)"],
sol: [M(e + " \\cdot " + N(t) + " = " + N(r6(e * t))) + " CHF.", M("100 : " + N(t) + " \\approx " + A(100 / t, 2)) + " EUR.", "Prix au kilo : " + M(N(p1) + " : " + N(m1) + " = " + N(r6(p1 / m1))) + " CHF ; " + M(N(r6(p1 / m1)) + " \\cdot " + N(m2) + " \\approx " + A((p1 / m1) * m2, 2)) + " CHF."] }; };
const calcQ = () => { const a = R.int(21, 59) / 10, b = R.int(11, 29), c = R.int(11, 19) / 10, d = R.int(1, 5), v = (a * a - Math.sqrt(b)) / (c ** 3 + d), x = R.int(11, 95) / 10, m = R.int(3, 8), y = R.int(11, 95) / 10, n = R.int(2, 6), z = R.int(2, 9), w = (x * 10 ** m * y * 10 ** -n) / z, ex0 = Math.floor(Math.log10(w)), m0 = +(w / 10 ** ex0).toFixed(2), ex = m0 >= 10 ? ex0 + 1 : ex0, mt = m0 >= 10 ? +(m0 / 10).toFixed(2) : m0;
return { id: "scicalc", also: ["prio"], d: 3, titre: "À la calculatrice", q: "", parts: ["Calcule et arrondis au centième : " + M("\\frac{" + N(a) + "^2 - \\sqrt{" + b + "}}{" + N(c) + "^3 + " + d + "}"), "Calcule et donne le résultat en notation scientifique (mantisse au centième) : " + M("\\frac{" + N(x) + " \\cdot 10^{" + m + "} \\cdot " + N(y) + " \\cdot 10^{-" + n + "}}{" + z + "}")],
sol: ["Parenthèses autour du numérateur et du dénominateur : " + M("(" + N(a) + "^2 - \\sqrt{" + b + "}) : (" + N(c) + "^3 + " + d + ") \\approx " + A(v, 2)) + ".", M("\\approx " + N(mt) + " \\cdot 10^{" + ex + "}") + "."] }; };


const SLOTS = [
{ p: 1, forms: [() => fracQ(["a", "b", "c"]), () => fracQ(["e", "f", "d"]), () => fracQ(["b", "e", "c"]), () => fracQ(["a", "f", "d"])] },
{ p: 1, forms: [racA, racB, racC] },
{ p: 1, forms: [() => qcmQ(QC, "Mets une croix", "puiss", ["sci", "idrem", "volcone"])] },
{ p: 1, forms: [devQ] },
{ p: 1, forms: [factQ] },
{ p: 1, forms: [solQ, eq2Q, showQ, formQ] },
{ p: 1, forms: [solidQ, conePyrQ, aireLitQ, preuveQ] },
{ p: 2, forms: [pythQcm, echelleQ, paveQ, terrainQ] },
{ p: 2, forms: [poserQ, billetsQ, deg2Q] },
{ p: 2, forms: [resQ, res2Q] },
{ p: 2, forms: [bagueQ, crayonQ, cornetQ, pyrQ, manqQ] },
{ p: 2, forms: [citerneQ, tgvQ, lingotQ] },
{ p: 2, forms: [etangQ, ombreQ, papillonQ] },
{ p: 2, forms: [maquetteQ, agrandQ, deviseQ, calcQ] },
];
const seed = () => Math.floor(Math.random() * 46655) + 1;

function plan(prev) {
return SLOTS.map((s, i) => { let f = Math.floor(Math.random() * s.forms.length); if (prev && s.forms.length > 1 && prev[i] && prev[i].f === f) f = (f + 1 + Math.floor(Math.random() * (s.forms.length - 1))) % s.forms.length; return { s: i, f, seed: seed() }; });
}
function build(it) { R.seed(it.seed); const q = SLOTS[it.s].forms[it.f](); return Object.assign({ p: SLOTS[it.s].p, slot: it.s }, q); }
return { SLOTS, plan, build, QC };
})();


let evcBack = "test";
function evacomOk() { return !!(typeof state !== "undefined" && state && state.profile && state.profile.system === "CH" && +state.profile.grade === 11); }
function evacomNew() {
const E = state.evacom || {};
state.evacom = { items: EVACOM.plan(E.items), date: day(), done: null, runs: (E.runs || []).slice(-20) };
save();
}
function evacomQs() { return state.evacom.items.map((it) => EVACOM.build(it)); }


const EVACOM_OUVERT = false;
function evacomCard() {
if (!evacomOk()) return "";
if (!EVACOM_OUVERT && location.protocol === "https:" && !(typeof isAuthor === "function" && isAuthor())) return "";
const E = state.evacom, last = E && E.runs && E.runs.length ? E.runs[E.runs.length - 1] : null, open = E && E.items && !E.done;
return `<div class="card flat stack evc-card"><div class="eyebrow">🎓 Évaluation bilan de 11e · fin d'année</div><h3>Sujet blanc d'évaluation bilan</h3>
    <p class="small muted">95 minutes au format de l'épreuve cantonale : partie 1 sans calculatrice, partie 2 avec. Un nouveau sujet à chaque fois, un corrigé détaillé, puis ce qu'il te reste à retravailler.</p>
    <button class="btn-sec" id="evacom">📝 ${open ? "Reprendre mon sujet blanc" : "Faire un sujet blanc"}</button>
    ${last ? `<p class="small muted">Dernier sujet blanc : ${last.juste} question${last.juste > 1 ? "s" : ""} juste${last.juste > 1 ? "s" : ""} sur ${last.n}${E.done ? ` · <button type="button" class="btn-ghost small" id="evcbilan">voir le bilan</button>` : ""}</p>` : ""}</div>`;
}
function screenEvacom(fresh) {
if (!evacomOk()) return screenHome();
if (typeof homeTab !== "undefined" && (homeTab === "test" || homeTab === "prog")) evcBack = homeTab;
if (fresh || !state.evacom || !state.evacom.items || state.evacom.done) evacomNew();
const qs = evacomQs();
const qHtml = (x, k) => `<div class="mock-q"><b>Question ${k + 1} · ${x.titre}</b>${x.q ? `<div>${x.q}</div>` : ""}${x.fig ? `<div class="figwrap">${x.fig}</div>` : ""}
    ${x.parts && x.parts.length ? `<ol type="a" class="mock-parts">${x.parts.map((p) => `<li>${p}<div class="mock-space"></div></li>`).join("")}</ol>` : '<div class="mock-space"></div>'}</div>`;
const part = (p) => qs.map((x, k) => (x.p === p ? qHtml(x, k) : "")).join("");
h(`<div class="mock-head">${brand}<div class="eyebrow">Sujet blanc · évaluation bilan de 11e · 95 minutes</div><h2>Évaluation bilan blanche</h2>
  <p class="small muted">Partie 1 : 50 min, sans calculatrice · Partie 2 : 45 min, calculatrice autorisée</p></div>
  <div class="card flat"><ul class="small evc-rules"><li>Fais-le sur une feuille, en temps réel, sans regarder tes cours : à l'épreuve, <b>pas d'aide-mémoire</b>, les formules doivent être sues. Matériel : une règle graduée.</li>
    <li>Les raisonnements et les calculs doivent figurer sur la feuille ; les fausses égalités et les erreurs d'écriture sont sanctionnées.</li>
    <li>Partie 2 : utilise la touche π de ta calculatrice et garde les valeurs exactes jusqu'au bout (pas d'arrondi intermédiaire).</li>
    <li><b>Ce n'est pas une évaluation</b> : pas de note, personne d'autre que toi ne voit le résultat. Sujet préparé pour la section LS.</li></ul></div>
  <section class="mock-part"><h3>Partie 1 · 50 minutes · sans calculatrice</h3>${part(1)}<p class="small muted evc-end">Fin de la partie 1 : range ta feuille, prends ta calculatrice.</p></section>
  <section class="mock-part"><h3>Partie 2 · 45 minutes · calculatrice autorisée</h3>${part(2)}<p class="small muted evc-end">Fin de l'épreuve.</p></section>
  <div class="stack no-print">
    <button class="btn-primary btn-big" id="corr">J'ai fini : voir le corrigé</button>
    <div class="row"><button class="btn-primary" id="print">🖨 Imprimer / PDF</button><button class="btn-ghost" id="again">Un autre sujet</button><button class="btn-ghost" id="back">Retour</button></div>
  </div>`);
document.getElementById("corr").onclick = screenEvacomCorr;
document.getElementById("print").onclick = () => window.print();
document.getElementById("again").onclick = () => screenEvacom(true);
document.getElementById("back").onclick = () => { homeTab = evcBack; screenHome(); };
}
function screenEvacomCorr() {
const qs = evacomQs(), marks = qs.map(() => null);
h(`${brand}<div class="eyebrow">Évaluation bilan blanche · corrigé</div><h2>Corrige-toi</h2>
  <p class="small muted">Compare avec ta feuille, question par question. <b>À moitié</b> : la démarche est juste mais il y a une erreur de calcul, ou il manque une justification, une unité, l'arrondi demandé.</p>
  <div class="mock-list">${qs.map((x, i) => `${i === 0 || qs[i - 1].p !== x.p ? `<h3>${x.p === 1 ? "Partie 1 · sans calculatrice" : "Partie 2 · calculatrice"}</h3>` : ""}<div class="mock-q card flat"><b>Question ${i + 1} · ${x.titre}</b>
    ${x.q ? `<div class="small">${x.q}</div>` : ""}
    <div class="rule"><b>Corrigé</b>${x.parts && x.parts.length ? `<ol type="a" class="mock-parts">${x.sol.map((s) => `<li>${s}</li>`).join("")}</ol>` : " · " + x.sol.join(" ")}</div>
    <div class="seg mock-mark" data-i="${i}"><button type="button" data-v="1">✓ Juste</button><button type="button" data-v="0.5">½ À moitié</button><button type="button" data-v="0">✗ Faux</button></div></div>`).join("")}</div>
  <p class="small muted" id="merr"></p>
  <button class="btn-primary btn-big" id="valid">Valider ma correction</button>
  <button class="btn-ghost" id="back">Revenir au sujet</button>`);
app.querySelectorAll(".mock-mark").forEach((g) => g.querySelectorAll("button").forEach((b) => (b.onclick = () => {
marks[+g.dataset.i] = +b.dataset.v; g.querySelectorAll("button").forEach((y) => y.setAttribute("aria-pressed", y === b));
})));
document.getElementById("back").onclick = () => screenEvacom();
document.getElementById("valid").onclick = () => {
const miss = marks.findIndex((m) => m === null);
if (miss >= 0) { document.getElementById("merr").textContent = "Il te reste " + marks.filter((m) => m === null).length + " question(s) à cocher."; app.querySelectorAll(".mock-mark")[miss].scrollIntoView({ behavior: "smooth", block: "center" }); return; }
qs.forEach((x, i) => { Engine.recordComp(state, x.id, x.d || 2, marks[i]); (x.also || []).forEach((a) => Engine.recordComp(state, a, Math.min(x.d || 2, 2), marks[i])); });
const cnt = { juste: marks.filter((m) => m === 1).length, partie: marks.filter((m) => m === 0.5).length, faux: marks.filter((m) => m === 0).length };
state.evacom.done = Object.assign({ date: day(), marks, n: marks.length }, cnt);
state.evacom.runs = (state.evacom.runs || []).concat([Object.assign({ date: day(), n: marks.length }, cnt)]).slice(-20);
Badges.check(state); save();
screenEvacomResult();
};
}

function screenEvacomResult() {
const E = state.evacom; if (!E || !E.done) return screenEvacom();
const qs = evacomQs(), mk = E.done.marks, n = mk.length, by = {};
qs.forEach((x, i) => { (by[x.id] = by[x.id] || []).push(mk[i]); });
const ids = Object.keys(by).filter((id) => NOTIONS.find((m) => m.id === id));
const ok = ids.filter((id) => by[id].every((m) => m === 1)), weak = ids.filter((id) => by[id].some((m) => m < 1)).sort((a, b) => Math.min(...by[a]) - Math.min(...by[b]));
const pp = (p) => { const L0 = qs.map((x, i) => (x.p === p ? mk[i] : null)).filter((m) => m !== null); return `<b>${L0.filter((m) => m === 1).length}</b> sur ${L0.length}`; };
h(`${brand}<div class="eyebrow">Évaluation bilan blanche · résultats</div><h2>Où tu en es</h2>
  <div class="card stack"><p><b>${E.done.juste}</b> question${E.done.juste > 1 ? "s" : ""} juste${E.done.juste > 1 ? "s" : ""} sur ${n}${E.done.partie ? ` · <b>${E.done.partie}</b> à moitié` : ""}${E.done.faux ? ` · <b>${E.done.faux}</b> à revoir` : ""}</p>
    <p class="small">Partie 1 (sans calculatrice) : ${pp(1)} · Partie 2 (calculatrice) : ${pp(2)}</p>
    <p class="small muted">Ce n'est pas une note : c'est pour savoir quoi travailler d'ici l'évaluation bilan.</p></div>
  ${weak.length ? `<div class="card flat stack"><h3>À retravailler</h3><ul class="evc-weak">${weak.map((id) => `<li><span>${esc(nLabel(id))}</span>${typeof LESSONS !== "undefined" && LESSONS[id] ? `<button type="button" class="btn-ghost small evc-les" data-id="${id}">📖 Rappel</button>` : ""}</li>`).join("")}</ul>
    <button class="btn-primary" id="rev">Réviser ces notions maintenant</button></div>` : '<div class="card flat"><p>Tout est juste : bravo ! Refais un sujet blanc dans quelques jours pour le garder.</p></div>'}
  ${ok.length ? `<div class="card flat"><h3>✓ Acquis</h3><ul>${ok.map((id) => `<li>${esc(nLabel(id))}</li>`).join("")}</ul></div>` : ""}
  <div class="card flat"><p class="small muted">À l'épreuve, l'écriture mathématique (pas de fausse égalité) et l'absence d'arrondi intermédiaire comptent aussi : relis-toi avec ces deux points en tête.</p></div>
  <div class="row"><button class="btn-primary" id="again">Un autre sujet blanc</button><button class="btn-ghost" id="home">Retour</button></div>`);
if (E.done.juste >= 0.8 * n && typeof burst === "function") burst();
app.querySelectorAll(".evc-les").forEach((b) => (b.onclick = () => screenLesson(b.dataset.id, screenEvacomResult, true)));
if (document.getElementById("rev")) document.getElementById("rev").onclick = () => {
const plan = weak.filter((id) => typeof GEN === "undefined" || GEN[id]).slice(0, 6).flatMap((id) => [id + "|2", id + "|3"]);
if (!plan.length) return;
session = { plan, i: 0, score: 0, answered: 0, start: Date.now(), elo0: state.elo.r, ids: new Set(), prep: true };
nextQuestion();
};
document.getElementById("again").onclick = () => screenEvacom(true);
document.getElementById("home").onclick = () => { homeTab = evcBack; screenHome(); };
}




(function () {
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
const Q = (v, s) => M(N(v) + u(s));
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
const F = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);
const P1 = (n) => (n === 1 ? "" : "s");
const D = Math.PI / 180;

const EX2 = [
() => { const v = pk([15, 20, 25]), h0 = pk([1, 2]);
return X({ id: "f2", lv: 1, titre: "Le lancer franc", q: "La hauteur (en m) d'un ballon est " + M("h(t) = -5t^2 + " + v + "t + " + h0) + ", où " + M("t") + " est le temps en secondes.",
parts: [{ label: "À quel instant le ballon est-il au plus haut ?", pts: 1 }, { label: "Quelle est la hauteur maximale ?", pts: 1 }, { label: "Le ballon touche-t-il un plafond situé à " + Q(v * v / 20 + h0 - 1, "m") + " ? Justifie.", pts: 1 }],
sol: ul([M("t = -\\frac{" + v + "}{2 \\cdot (-5)} = " + N(v / 10)) + " s.", M("h(" + N(v / 10) + ") = " + N(v * v / 20 + h0)) + " m.", "Oui : la hauteur maximale dépasse le plafond de 1 m."]) }); },
() => { const p = pk([-3, -2, -1]), q = pk([2, 3, 4, 5]);
return X({ id: "f2formes", lv: 2, titre: "Trois écritures d'une même parabole", q: "Soit " + M("f(x) = (x " + (p < 0 ? "+ " + -p : "- " + p) + ")(x - " + q + ")") + ".",
parts: [{ label: "Donne les zéros et l'ordonnée à l'origine.", pts: 1 }, { label: "Écris la forme développée.", pts: 1 }, { label: "Écris la forme canonique et donne le sommet.", pts: 2 }],
sol: ul([M(p) + " et " + M(q) + " ; " + M("f(0) = " + p * q) + ".", M("x^2 " + (-(p + q) < 0 ? "- " + (p + q) : "+ " + -(p + q)) + "x " + (p * q < 0 ? "- " + -p * q : "+ " + p * q)) + ".", "Sommet au milieu des zéros : " + M("x_S = " + N((p + q) / 2)) + ", " + M("f(x_S) = " + N(-(((q - p) / 2) ** 2))) + " ; " + M("f(x) = (x - " + N((p + q) / 2) + ")^2 - " + N(((q - p) / 2) ** 2)) + "."]) }); },
() => { const L = pk([20, 24, 40]);
return X({ id: "optim", lv: 2, titre: "L'enclos le long du mur", q: "Avec " + Q(L, "m") + " de grillage, on fabrique un enclos rectangulaire adossé à un mur (le mur remplace un côté). On note " + M("x") + " la largeur (côtés perpendiculaires au mur).",
parts: [{ label: "Exprime la longueur, puis l'aire " + M("A(x)") + ".", pts: 2 }, { label: "Quelle largeur donne l'aire maximale ? Quelle est cette aire ?", pts: 2 }],
sol: ul(["Longueur " + M(L + " - 2x") + " ; " + M("A(x) = x(" + L + " - 2x) = -2x^2 + " + L + "x") + ".", M("x = \\frac{" + L + "}{4} = " + N(L / 4)) + " m ; " + M("A = " + N(L * L / 8)) + " m²."]) }); },
() => { const a = pk([1, 2]), p = pk([-1, 1, 2]), q = p + pk([3, 4]);
return X({ id: "ineq2", lv: 3, titre: "Quand la fonction est-elle positive ?", q: "Soit " + M("f(x) = " + (a === 1 ? "" : a) + "x^2 " + (-(p + q) * a < 0 ? "- " + (p + q) * a : "+ " + -(p + q) * a) + "x " + (a * p * q < 0 ? "- " + -a * p * q : "+ " + a * p * q)) + " et " + M("g(x) = " + (a === 1 ? "" : a) + "x " + (a * p > 0 ? "- " + a * p : "+ " + -a * p)) + ".",
parts: [{ label: "Résous " + M("f(x) = 0") + ".", pts: 1 }, { label: "Résous " + M("f(x) > 0") + " (tableau de signes ou parabole).", pts: 1 }, { label: "Résous " + M("f(x) \\le g(x)") + ".", pts: 2 }],
sol: ul([M(p) + " et " + M(q) + ".", M("x < " + p) + " ou " + M("x > " + q) + ".", M("f(x) - g(x) = " + a + "(" + "x - " + p + ")(x - " + (q + 1) + ")").replace(/- -/g, "+ ") + " ≤ 0 : " + M("[" + p + " \\,;\\, " + (q + 1) + "]") + "."]) }); },
];
const RAISON2 = [
() => X({ id: "eq2", lv: 1, titre: "Trouve l'erreur", q: who() + " résout " + M("x^2 = 5x") + " en divisant par " + M("x") + " : « " + M("x = 5") + " ».", parts: [{ label: "Quelle solution a été perdue ? Pourquoi ?", pts: 1 }, { label: "Résous correctement.", pts: 1 }], sol: ul(["x = 0 : on ne peut pas diviser par x s'il peut être nul.", M("x(x - 5) = 0") + " : " + M("x = 0") + " ou " + M("x = 5") + "."]) }),
() => X({ id: "eq2disc", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« x² + 4 = 0 n'a pas de solution réelle. »", pts: 1 }, { label: "« Si a et c sont de signes contraires, ax² + bx + c = 0 a deux solutions. »", pts: 1 }], sol: ul(["<b>Vrai</b> : un carré n'est jamais égal à −4.", "<b>Vrai</b> : " + M("\\Delta = b^2 - 4ac > 0") + " car " + M("-4ac > 0") + "."]) }),
];

const EXF = [
() => { const F = pk([8, 10, 12]), p = pk([0.5, 0.8]);
return X({ id: "modaff", lv: 1, titre: "La location de trottinette", q: "Une trottinette coûte " + Q(F, "CHF") + " de déblocage, puis " + Q(p, "CHF") + " par minute. Un vélo électrique se loue sans frais de déblocage, à " + Q(p + 0.5, "CHF") + " par minute.",
parts: [{ label: "Écris les prix " + M("T(x)") + " et " + M("V(x)") + " pour " + M("x") + " minutes.", pts: 1 }, { label: "À partir de combien de minutes la trottinette est-elle moins chère ?", pts: 2 }],
sol: ul([M("T(x) = " + F + " + " + N(p) + "x") + " ; " + M("V(x) = " + N(p + 0.5) + "x") + ".", M(F + " + " + N(p) + "x < " + N(p + 0.5) + "x \\iff x > " + 2 * F) + " : dès " + (2 * F + 1) + " minutes."]) }); },
() => { const a = pk([2, 3]), b = pk([-1, 1, 4]);
return X({ id: "transf", lv: 2, titre: "Déplacer une parabole", q: "On part de " + M("f(x) = x^2") + " et on construit " + M("g(x) = (x - " + a + ")^2 " + (b < 0 ? "- " + -b : "+ " + b)) + ".",
parts: [{ label: "Décris les déplacements qui envoient le graphe de f sur celui de g.", pts: 1 }, { label: "Donne le sommet de g et l'image du point " + M("(1 \\,;\\, 1)") + " de f.", pts: 2 }],
sol: ul([a + " vers la droite et " + Math.abs(b) + " vers le " + (b > 0 ? "haut" : "bas") + ".", "Sommet " + M("(" + a + " \\,;\\, " + b + ")") + " ; point " + M("(" + (1 + a) + " \\,;\\, " + (1 + b) + ")") + "."]) }); },
() => { const r = pk([2, 3, 4]);
return X({ id: "domaine", lv: 2, titre: "Où la fonction existe-t-elle ?", q: "Soit " + M("f(x) = \\frac{\\sqrt{x + " + r + "}}{x - 1}") + ".",
parts: [{ label: "Quelle condition impose la racine ?", pts: 1 }, { label: "Quelle valeur est interdite par le dénominateur ?", pts: 1 }, { label: "Écris le domaine de définition et calcule " + M("f(" + (r * r - r) + ")") + ".", pts: 2 }],
sol: ul([M("x \\ge -" + r) + ".", M("x \\ne 1") + ".", M("D = [-" + r + " \\,;\\, 1[ \\cup ]1 \\,;\\, +\\infty[") + " ; " + M("f(" + (r * r - r) + ") = \\frac{" + r + "}{" + (r * r - r - 1) + "}") + "."]) }); },
() => { const k = pk([12, 18, 24]);
return X({ id: "racinv", lv: 3, titre: "Partager un gâteau", q: "Un gâteau de " + Q(k, "parts") + " est partagé équitablement entre " + M("x") + " personnes : chacune reçoit " + M("f(x) = \\frac{" + k + "}{x}") + " parts.",
parts: [{ label: "Calcule f(2), f(3) et f(6). Comment évolue f(x) quand x augmente ?", pts: 2 }, { label: "Combien de personnes pour que chacune ait 1,5 part ?", pts: 1 }, { label: "Pourquoi " + M("x = 0") + " est-il interdit ?", pts: 1 }],
sol: ul([N(k / 2) + ", " + N(k / 3) + ", " + N(k / 6) + " : f diminue (fonction inverse).", M("\\frac{" + k + "}{x} = 1{,}5 \\iff x = " + N(k / 1.5)) + ".", "On ne peut pas diviser par 0 (et partager entre 0 personne n'a pas de sens)."]) }); },
];
const RAISONF = [
() => X({ id: "fimg", lv: 1, titre: "Image ou antécédent ?", q: who() + " lit sur un graphique : « f(2) = 5, donc l'image de 5 est 2 ».", parts: [{ label: "Corrige la phrase.", pts: 1 }, { label: "Combien d'antécédents un nombre peut-il avoir ? Et d'images ?", pts: 1 }], sol: ul(["L'image de 2 est 5 ; 2 est un antécédent de 5.", "Un nombre a au plus une image, mais peut avoir plusieurs antécédents."]) }),
() => X({ id: "transf", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Le graphe de f(x − 3) est celui de f décalé de 3 vers la gauche. »", pts: 1 }, { label: "« Le graphe de −f(x) est le symétrique de celui de f par rapport à l'axe des x. »", pts: 1 }], sol: ul(["<b>Faux</b> : vers la DROITE.", "<b>Vrai</b> : les ordonnées changent de signe."]) }),
];

const EXG = [
() => { const [p, q] = pk([[9, 16], [4, 9], [3.6, 6.4]]), h = Math.sqrt(p * q);
return X({ id: "euclide", lv: 1, titre: "Le pont suspendu", q: "Un câble vertical relie le sommet de l'angle droit d'un triangle rectangle à son hypoténuse ; il la découpe en " + Q(p, "m") + " et " + Q(q, "m") + ".",
parts: [{ label: "Calcule la longueur du câble.", pts: 1 }, { label: "Calcule les deux autres côtés du triangle.", pts: 2 }],
sol: ul([M("h = \\sqrt{" + N(p) + " \\cdot " + N(q) + "} = " + N(h)) + " m.", M("\\sqrt{" + N(p) + " \\cdot " + N(p + q) + "} = " + N(Math.sqrt(p * (p + q)))) + " m et " + M(N(Math.sqrt(q * (p + q)))) + " m."]) }); },
() => { const k = pk([2, 3, 4]);
return X({ id: "exactes", lv: 2, titre: "Le carré et son cercle", q: "Un carré a un côté de " + Q(2 * k, "cm") + ".",
parts: [{ label: "Calcule la valeur exacte de sa diagonale.", pts: 1 }, { label: "Calcule le rayon et l'aire (valeur exacte) du cercle circonscrit.", pts: 2 }],
sol: ul([M(2 * k + "\\sqrt{2}") + " cm.", "Rayon " + M(k + "\\sqrt{2}") + " ; aire " + M("\\pi (" + k + "\\sqrt{2})^2 = " + 2 * k * k + "\\pi") + " cm²."]) }); },
() => { const [B, b, l, h] = pk([[14, 8, 5, 4], [20, 10, 13, 12]]);
return X({ id: "geocomb", lv: 2, titre: "Le bac à fleurs", q: "La section d'un bac à fleurs est un trapèze isocèle : bases " + Q(B, "dm") + " et " + Q(b, "dm") + ", côtés obliques " + Q(l, "dm") + ". Le bac est long de " + Q(10, "dm") + ".",
parts: [{ label: "Calcule la hauteur du trapèze.", pts: 2 }, { label: "Calcule le volume de terre (en L).", pts: 2 }],
sol: ul([M("\\sqrt{" + l + "^2 - " + (B - b) / 2 + "^2} = " + h) + " dm.", "Aire " + M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + ((B + b) * h) / 2) + " dm² ; volume " + M(((B + b) * h) / 2 * 10) + " L."]) }); },
() => { const m = pk([9, 12, 15]);
return X({ id: "droitesrem", lv: 3, titre: "Le centre de gravité", q: "Une plaque triangulaire ABC est rectangle en C, avec " + M("AC = " + (m === 9 ? 6 : m === 12 ? 9 : 12)) + " cm et " + M("BC = " + (m === 9 ? 8 : m === 12 ? 12 : 16)) + " cm.",
parts: [{ label: "Calcule AB et la médiane issue de C.", pts: 2 }, { label: "À quelle distance de C se trouve le centre de gravité ?", pts: 1 }],
sol: ul(["AB = " + M(m === 9 ? 10 : m === 12 ? 15 : 20) + " cm ; médiane = AB/2 = " + M(N((m === 9 ? 10 : m === 12 ? 15 : 20) / 2)) + " cm (milieu de l'hypoténuse).", M("\\frac{2}{3}") + " de la médiane : " + M(N(((m === 9 ? 10 : m === 12 ? 15 : 20) / 2) * 2 / 3)) + " cm."]) }); },
];
const RAISONG = [
() => X({ id: "pythrec", lv: 1, titre: "Trouve l'erreur", q: who() + " affirme : « 4² + 5² = 41 et 6² = 36, donc le triangle 4-5-6 est presque rectangle, on peut appliquer Pythagore ».", parts: [{ label: "Pourquoi est-ce faux ?", pts: 1 }, { label: "Le triangle a-t-il un angle aigu ou obtus face au côté 6 ?", pts: 1 }], sol: ul(["Pythagore exige l'égalité exacte : 41 ≠ 36, le triangle n'est pas rectangle.", "36 < 41 : l'angle face au côté 6 est aigu."]) }),
() => X({ id: "euclide", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Dans un triangle rectangle, h² = p · q. »", pts: 1 }, { label: "« La médiane issue de l'angle droit vaut la moitié de l'hypoténuse. »", pts: 1 }], sol: ul(["<b>Vrai</b> (théorème de la hauteur).", "<b>Vrai</b> : le milieu de l'hypoténuse est le centre du cercle circonscrit."]) }),
];

const EXT = [
() => { const a = pk([30, 35, 40]), d = pk([20, 30, 40]);
return X({ id: "trigo", lv: 1, titre: "La hauteur de l'arbre", q: "À " + Q(d, "m") + " d'un arbre, on voit son sommet sous un angle de " + M(a + "°") + " (yeux à " + Q(1.6, "m") + ").",
parts: [{ label: "Fais un croquis et nomme les côtés (opposé, adjacent).", pts: 1 }, { label: "Calcule la hauteur de l'arbre (au cm).", pts: 2 }],
sol: ul(["La distance est adjacente à l'angle, la hauteur cherchée opposée.", M(d + " \\cdot \\tan " + a + "° + 1{,}6 \\approx " + N(Math.round((d * Math.tan(a * D) + 1.6) * 100) / 100)) + " m."]) }); },
() => { const [L, h] = pk([[4, 3.7], [5, 4.6], [6, 5.5], [5, 4.2], [4, 3.5]]);
return X({ id: "trigo", lv: 2, titre: "L'échelle de sécurité", q: "Une échelle de " + Q(L, "m") + " doit faire un angle entre 65° et 75° avec le sol. On l'appuie pour atteindre " + Q(h, "m") + " de haut.",
parts: [{ label: "Calcule l'angle avec le sol (au dixième).", pts: 2 }, { label: "Est-ce sûr ? Justifie.", pts: 1 }],
sol: ul([M("\\sin \\alpha = \\frac{" + N(h) + "}{" + L + "}") + ", " + M("\\alpha \\approx " + N(Math.round((Math.asin(h / L) / D) * 10) / 10) + "°") + ".", (Math.asin(h / L) / D >= 65 && Math.asin(h / L) / D <= 75 ? "Oui, l'angle est dans l'intervalle." : "Non, l'angle est hors de l'intervalle 65°–75°.")]) }); },
() => { const p = pk([8, 10, 12]);
return X({ id: "trigexact", lv: 2, titre: "La route de col", q: "Un panneau annonce une pente de " + M(p + "\\,\\%") + " sur " + Q(3, "km") + " (distance horizontale).",
parts: [{ label: "Quel dénivelé (en m) ?", pts: 1 }, { label: "Quel angle avec l'horizontale (au dixième) ?", pts: 1 }, { label: "Une pente de 100 % correspond à quel angle ?", pts: 1 }],
sol: ul([M("3000 \\cdot " + N(p / 100) + " = " + 30 * p) + " m.", M("\\tan^{-1}(" + N(p / 100) + ") \\approx " + N(Math.round((Math.atan(p / 100) / D) * 10) / 10) + "°") + ".", M("45°") + " (tan 45° = 1)."]) }); },
() => { const [o, h] = pk([[3, 5], [5, 13], [8, 17]]);
return X({ id: "trigrel", lv: 3, titre: "Sans calculatrice", q: "Un angle aigu " + M("\\alpha") + " vérifie " + M("\\sin \\alpha = \\frac{" + o + "}{" + h + "}") + ".",
parts: [{ label: "Calcule " + M("\\cos \\alpha") + " (valeur exacte).", pts: 2 }, { label: "Calcule " + M("\\tan \\alpha") + ".", pts: 1 }],
sol: ul([M("\\cos \\alpha = \\sqrt{1 - \\frac{" + o * o + "}{" + h * h + "}} = \\frac{" + Math.sqrt(h * h - o * o) + "}{" + h + "}") + ".", M("\\tan \\alpha = \\frac{" + o + "}{" + Math.sqrt(h * h - o * o) + "}") + "."]) }); },
];
const RAISONT = [
() => X({ id: "trigo", lv: 1, titre: "Trouve l'erreur", q: who() + " calcule le côté opposé à 40° avec une hypoténuse de 10 cm : « " + M("10 \\cdot \\cos 40° \\approx 7{,}66") + " cm ».", parts: [{ label: "Quelle est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }], sol: ul(["Le côté opposé va avec le sinus.", M("10 \\sin 40° \\approx 6{,}43") + " cm."]) }),
() => X({ id: "trigexact", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« sin 30° = cos 60°. »", pts: 1 }, { label: "« Une pente de 50 % correspond à un angle de 45°. »", pts: 1 }], sol: ul(["<b>Vrai</b> : les deux valent 1/2 (angles complémentaires).", "<b>Faux</b> : 45° donne 100 % ; 50 % donne environ 26,6°."]) }),
];

RICH.deg2c = { ids: ["bicarre", "eq2", "eq2disc", "eq2fact", "eq3", "eqirr", "f2", "f2expr", "f2formes", "f2trois", "ineq2", "ineqfrac", "inter", "interpar", "optim", "probeq2", "trinfact"], label: "Degré 2", ex: EX2, raison: RAISON2, minutes: 45 };
RICH.fct1c = { ids: ["absval", "domaine", "fimg", "lectgraph", "modaff", "morceaux", "racinv", "tabval", "transf"], label: "Fonctions", ex: EXF, raison: RAISONF, minutes: 45 };
RICH.geo1c = { ids: ["droitesrem", "euclide", "exactes", "geocomb", "pyth", "pythfig", "pythrec", "simil", "thales"], label: "De Thalès à Pythagore", ex: EXG, raison: RAISONG, minutes: 45 };
RICH.trig1c = { ids: ["trigexact", "trigo", "trigrel"], label: "Trigonométrie du triangle rectangle", ex: EXT, raison: RAISONT, minutes: 45 };

const EXN = [
() => { const P0 = pk([80, 120, 200]), a = pk([20, 25]), b = pk([10, 20]);
return X({ id: "pct", lv: 1, titre: "Hausse puis baisse", q: "Un article coûte " + Q(P0, "CHF") + ". Son prix augmente de " + a + " %, puis baisse de " + b + " %.",
parts: [{ label: "Calcule le prix final.", pts: 2 }, { label: "Quel est le pourcentage de variation global ?", pts: 1 }],
sol: ul([M(N(P0) + " \\cdot " + N(1 + a / 100) + " \\cdot " + N(1 - b / 100) + " = " + N(P0 * (1 + a / 100) * (1 - b / 100))) + " CHF.", M(N(r6(((1 + a / 100) * (1 - b / 100) - 1) * 100))) + " %."]) }); },
() => { const e = pk([8, 9]), n = pk([3, 4, 6]);
return X({ id: "scicalc", lv: 2, titre: "Les étoiles de la galaxie", q: "Notre galaxie compte environ " + M(n + " \\cdot 10^{11}") + " étoiles. Un ordinateur en recense " + M("2 \\cdot 10^{" + e + "}") + " par jour.",
parts: [{ label: "Combien de jours faut-il ? (notation scientifique)", pts: 2 }, { label: "Combien d'années environ (365 jours) ?", pts: 1 }],
sol: ul([M("\\frac{" + n + " \\cdot 10^{11}}{2 \\cdot 10^{" + e + "}} = " + N(n / 2) + " \\cdot 10^{" + (11 - e) + "}") + " jours.", "Environ " + M(N(Math.round((n / 2) * 10 ** (11 - e) / 365 * 10) / 10)) + " ans."]) }); },
() => { const k = pk([2, 3, 5]);
return X({ id: "rac", lv: 2, titre: "Simplifier pour comparer", q: "On compare " + M("A = \\sqrt{" + 12 * k * k + "}") + " et " + M("B = " + k + "\\sqrt{3} + \\sqrt{" + 3 * k * k + "}") + ".",
parts: [{ label: "Écris A sous la forme " + M("a\\sqrt{3}") + ".", pts: 1 }, { label: "Écris B sous la même forme.", pts: 1 }, { label: "Conclus.", pts: 1 }],
sol: ul([M("A = " + 2 * k + "\\sqrt{3}") + ".", M("B = " + k + "\\sqrt{3} + " + k + "\\sqrt{3} = " + 2 * k + "\\sqrt{3}") + ".", "A = B."]) }); },

() => { const k = pk([2, 3, 4]), n = pk([2, 3, 5]), V = k ** 3 * n, lo = Math.floor(k * Math.cbrt(n)), k2 = pk([3, 4, 5]), m = pk([3, 5, 7]), a = k2 * k2 * m;
return X({ id: "racprop", lv: 2, titre: "La boîte cubique", q: "Une boîte en forme de cube a un volume de " + Q(V, "cm^3") + ". Calculatrice non autorisée.",
parts: [{ label: "Écris la longueur exacte de l'arête sous la forme " + M("a\\sqrt[3]{b}") + ", " + M("b") + " le plus petit possible.", pts: 1 }, { label: "Encadre l'arête entre deux entiers consécutifs.", pts: 1 }, { label: "On double l'arête. Par combien le volume est-il multiplié ? Vérifie avec la racine cubique.", pts: 1 }, { label: "Le couvercle d'une autre boîte est un carré d'aire " + Q(a, "cm^2") + ". Écris son côté et sa diagonale sous forme exacte simplifiée.", pts: 2 }],
sol: ul([M("\\sqrt[3]{" + V + "} = \\sqrt[3]{" + k ** 3 + " \\cdot " + n + "} = " + k + "\\sqrt[3]{" + n + "}") + " cm.", M(lo + "^3 = " + lo ** 3 + " \\lt " + V + " \\lt " + (lo + 1) ** 3 + " = " + (lo + 1) + "^3") + " : l'arête est entre " + lo + " et " + (lo + 1) + " cm.", "Par " + M("2^3 = 8") + " : " + M("\\sqrt[3]{8 \\cdot " + V + "} = 2 \\cdot " + k + "\\sqrt[3]{" + n + "} = " + 2 * k + "\\sqrt[3]{" + n + "}") + ".", "Côté " + M("\\sqrt{" + a + "} = \\sqrt{" + k2 * k2 + " \\cdot " + m + "} = " + k2 + "\\sqrt{" + m + "}") + " cm ; diagonale " + M(k2 + "\\sqrt{" + m + "} \\cdot \\sqrt{2} = " + k2 + "\\sqrt{" + 2 * m + "}") + " cm."]),
chk: [[Math.cbrt(V), k + "*" + n + "^(1/3)"], [Math.sqrt(a), k2 + "√" + m], [Math.sqrt(a) * Math.SQRT2, k2 + "√" + 2 * m]] }); },
() => { const [a, b, c, d] = pk([[1, 2, 1, 3], [2, 3, 1, 4], [3, 4, 1, 6]]);
return X({ id: "fracops", lv: 3, titre: "Le dosage du sirop", q: "Un sirop se dilue : " + M("\\frac{" + a + "}{" + b + "}") + " de la bouteille pour un jus, et on en a déjà utilisé " + M("\\frac{" + c + "}{" + d + "}") + ". Il reste " + M("\\frac{" + (b * d - b * c - a * d) + "}{" + b * d + "}").replace(/\\frac\{-/, "-\\frac{") + " de la bouteille après le jus.",
parts: [{ label: "Vérifie ce reste par un calcul.", pts: 2 }, { label: "Combien de jus identiques peut-on encore faire avec ce reste ?", pts: 1 }],
sol: ul([M("1 - \\frac{" + c + "}{" + d + "} - \\frac{" + a + "}{" + b + "} = \\frac{" + (b * d - b * c - a * d) + "}{" + b * d + "}") + ".", (b * d - b * c - a * d) >= 0 ? M(Math.floor((b * d - b * c - a * d) / (a * d))) + " jus." : "Le reste est négatif : il n'y avait pas assez de sirop pour ce jus."]) }); },
];
const RAISONN = [
() => { const [c, r] = pk([[-8, -2], [-27, -3], [-125, -5], [-64, -4]]), w = who();
return X({ id: "racprop", lv: 1, titre: "Trouve l'erreur", q: w + " affirme : « " + M("\\sqrt[3]{" + c + "}") + " n'existe pas, car on ne peut pas prendre la racine d'un nombre négatif ».",
parts: [{ label: "Calcule " + M("(" + r + ")^3") + ". Que peux-tu conclure ?", pts: 1 }, { label: "Pour quelle sorte de racine la remarque de " + w + " est-elle juste ? Donne un exemple.", pts: 1 }],
sol: ul([M("(" + r + ")^3 = " + c) + " : donc " + M("\\sqrt[3]{" + c + "} = " + r) + ". La racine cubique d'un nombre négatif existe.", "Pour la racine carrée : " + M("\\sqrt{" + -c + "}") + " existe, mais pas " + M("\\sqrt{" + c + "}") + " (un carré n'est jamais négatif)."]),
chk: [[Math.cbrt(c), String(r)]] }); },
() => X({ id: "puiss", lv: 1, titre: "Trouve l'erreur", q: who() + " écrit : « " + M("2^3 \\cdot 2^4 = 4^7") + " ».", parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }], sol: ul(["On garde la base 2 et on additionne les exposants.", M("2^7 = 128") + "."]) }),
() => X({ id: "pct", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« Deux hausses de 10 % font une hausse de 21 %. »", pts: 1 }, { label: "« √(a + b) = √a + √b. »", pts: 1 }], sol: ul(["<b>Vrai</b> : " + M("1{,}1^2 = 1{,}21") + ".", "<b>Faux</b> : " + M("\\sqrt{9 + 16} = 5 \\ne 7") + "."]) }),
];

const EXE = [
() => { const a = pk([-3, -2]), b = pk([4, 5]), c = pk([1, 2]), d = pk([7, 8]);
return X({ id: "ensembles", lv: 1, titre: "Horaires d'ouverture", q: "Une piscine est ouverte de " + (a + 10) + " h à " + (b + 10) + " h (intervalle " + M("A = [" + (a + 10) + " \\,;\\, " + (b + 10) + "]") + ") ; le sauna de " + (c + 10) + " h à " + (d + 10) + " h (" + M("B = [" + (c + 10) + " \\,;\\, " + (d + 10) + "]") + ").",
parts: [{ label: "Écris " + M("A \\cap B") + ". Que représente-t-il ?", pts: 2 }, { label: "Écris " + M("A \\cup B") + ".", pts: 1 }],
sol: ul([M("[" + (c + 10) + " \\,;\\, " + (b + 10) + "]") + " : les heures où les deux sont ouverts.", M("[" + (a + 10) + " \\,;\\, " + (d + 10) + "]") + "."]) }); },
() => X({ id: "ensembles", lv: 2, titre: "La bonne température", q: "Un aquarium doit rester entre 24 °C et 28 °C (bornes comprises). Le thermomètre affiche " + M("T") + ".",
parts: [{ label: "Écris la condition avec une double inégalité, puis un intervalle.", pts: 1 }, { label: "Écris la condition avec une valeur absolue " + M("|T - c| \\le r") + ".", pts: 2 }],
sol: ul([M("24 \\le T \\le 28") + " ; " + M("T \\in [24 \\,;\\, 28]") + ".", M("|T - 26| \\le 2") + "."]) }),
() => { const n = pk([20, 30]);
return X({ id: "ensembles", lv: 2, titre: "Les sports de la classe", q: "Dans une classe de " + n + " élèves, " + (n / 2) + " font du foot, " + (n / 2 - 4) + " du basket, et 3 les deux.",
parts: [{ label: "Combien font au moins un des deux sports ?", pts: 1 }, { label: "Combien ne font ni l'un ni l'autre ?", pts: 1 }, { label: "Représente la situation par un diagramme de Venn.", pts: 1 }],
sol: ul([M(n / 2 + " + " + (n / 2 - 4) + " - 3 = " + (n - 7)) + ".", M(n + " - " + (n - 7) + " = 7") + ".", "Deux ensembles qui se chevauchent : 3 dans l'intersection."]) }); },
() => X({ id: "ensembles", lv: 3, titre: "Nombres et ensembles", q: "On considère les nombres " + M("-3") + ", " + M("0{,}5") + ", " + M("\\sqrt{16}") + ", " + M("\\frac{2}{3}") + ", " + M("\\sqrt{2}") + ", " + M("\\pi") + ".",
parts: [{ label: "Lesquels sont des entiers (ℤ) ?", pts: 1 }, { label: "Lesquels sont rationnels (ℚ) ?", pts: 1 }, { label: "Lesquels sont irrationnels ?", pts: 1 }],
sol: ul([M("-3") + " et " + M("\\sqrt{16} = 4") + ".", M("-3") + ", " + M("0{,}5") + ", " + M("4") + ", " + M("\\frac{2}{3}") + ".", M("\\sqrt{2}") + " et " + M("\\pi") + "."]) }),
];
const RAISONE = [
() => X({ id: "ensembles", lv: 1, titre: "Trouve l'erreur", q: who() + " écrit : « " + M("]2 \\,;\\, 5]") + " contient 2, 3, 4 et 5 ».", parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Combien d'entiers contient-il ?", pts: 1 }], sol: ul(["Le crochet est tourné vers l'extérieur en 2 : 2 est exclu.", "3 entiers : 3, 4, 5."]) }),
() => X({ id: "ensembles", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.", parts: [{ label: "« ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. »", pts: 1 }, { label: "« [1 ; 3] ∩ [3 ; 5] est vide. »", pts: 1 }], sol: ul(["<b>Vrai</b>.", "<b>Faux</b> : il contient 3."]) }),
];



const EXR = [
() => { const [a, b] = pk([[12, 4], [18, 6], [15, 5], [20, 4]]);
return X({ id: "implication", lv: 1, titre: "Réciproque et contraposée", q: "On considère l'implication « si " + M("n") + " est un multiple de " + M(a) + ", alors " + M("n") + " est un multiple de " + M(b) + " » (" + M("n") + " entier).",
parts: [{ label: "Est-elle vraie ? Justifie.", pts: 1 }, { label: "Énonce sa réciproque. Est-elle vraie ?", pts: 2 }, { label: "Énonce sa contraposée. Est-elle vraie ?", pts: 2 }],
sol: ul(["Vraie : " + M("n = " + a + "k = " + b + " \\cdot " + a / b + "k") + ".", "« Si " + M("n") + " est un multiple de " + M(b) + ", alors c'est un multiple de " + M(a) + " » : fausse, contre-exemple " + M(b) + ".", "« Si " + M("n") + " n'est pas un multiple de " + M(b) + ", alors ce n'est pas un multiple de " + M(a) + " » : vraie, comme l'implication."]) }); },
() => { const n = pk([3, 4, 5]);
return X({ id: "tradalg", lv: 2, titre: "Le tour de magie", q: "Pense à un nombre. Ajoute " + n + ", multiplie par 2, soustrais " + 2 * n + ", puis divise par 2.",
parts: [{ label: "Essaie avec deux nombres. Que remarques-tu ?", pts: 1 }, { label: "Prouve-le en appelant " + M("x") + " le nombre de départ.", pts: 2 }],
sol: ul(["On retrouve le nombre de départ.", M("\\frac{2(x + " + n + ") - " + 2 * n + "}{2} = \\frac{2x}{2} = x") + "."]) }); },
() => X({ id: "demoalg", lv: 2, titre: "Cinq entiers consécutifs", q: "On additionne cinq nombres entiers consécutifs.",
parts: [{ label: "Essaie avec deux exemples. Que remarques-tu ?", pts: 1 }, { label: "Démontre que la somme est toujours un multiple de 5.", pts: 2 }, { label: "Et pour quatre entiers consécutifs ? Justifie.", pts: 2 }],
sol: ul(["1 + 2 + 3 + 4 + 5 = 15, 10 + … + 14 = 60 : des multiples de 5.", M("n + (n + 1) + (n + 2) + (n + 3) + (n + 4) = 5n + 10 = 5(n + 2)") + ".", "Faux : " + M("1 + 2 + 3 + 4 = 10") + " n'est pas un multiple de 4 (" + M("4n + 6") + ")."]) }),
() => X({ id: "demoalg", lv: 3, titre: "Pair ou impair ?", q: "On s'intéresse aux nombres impairs.",
parts: [{ label: "Écris un nombre impair à l'aide d'un entier " + M("k") + ".", pts: 1 }, { label: "Démontre que le carré d'un impair est impair.", pts: 2 }, { label: "Démontre que la différence des carrés de deux impairs consécutifs est un multiple de 8.", pts: 2 }],
sol: ul([M("2k + 1") + ".", M("(2k + 1)^2 = 2(2k^2 + 2k) + 1") + " : impair.", M("(2k + 3)^2 - (2k + 1)^2 = 8k + 8 = 8(k + 1)") + "."]) }),
];
const RAISONR = [
() => X({ id: "implication", lv: 1, titre: "Trouve l'erreur", q: who() + " dit : « tout multiple de 6 est un multiple de 3, donc tout multiple de 3 est un multiple de 6 ».", parts: [{ label: "Quelle erreur de logique commet-on ?", pts: 1 }, { label: "Donne un contre-exemple.", pts: 1 }], sol: ul(["On confond une implication et sa réciproque.", "9 est un multiple de 3 mais pas de 6."]) }),
() => X({ id: "contrex", lv: 2, titre: "Un exemple suffit-il ?", q: who() + " vérifie que " + M("n^2 + n + 41") + " est premier pour n = 1, 2, 3, 4 et conclut : « c'est toujours un nombre premier ».", parts: [{ label: "Des exemples peuvent-ils prouver une propriété générale ?", pts: 1 }, { label: "Teste n = 40.", pts: 1 }], sol: ul(["Non : il faut une démonstration ; un seul contre-exemple suffit à réfuter.", M("40^2 + 40 + 41 = 1681 = 41^2") + " : pas premier."]) }),
];

RICH.no1c = { ids: ["arith", "fracops", "pct", "puiss", "rac", "racenc", "racprop", "ratden", "fracper", "rel", "sci", "scicalc"], label: "Nombres", ex: EXN, raison: RAISONN, minutes: 45 };
RICH.ens1c = { ids: ["ensembles"], label: "Ensembles", ex: EXE, raison: RAISONE, minutes: 45 };
RICH.arg1c = { ids: ["tradalg", "contrex", "demoalg", "implication"], label: "Argumenter", ex: EXR, raison: RAISONR, minutes: 45 };
})();



(function () {
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
const T = (v) => M(N(v));
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)) }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
const sys = (...r) => M("\\begin{cases} " + r.join(" \\\\ ") + " \\end{cases}");
const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam"]);

const EX = [

() => { const fa = pk([10, 15, 20]), pa = pk([0.1, 0.2]), pb = pk([0.4, 0.5]), x0 = r6(fa / (pb - pa));
return X({ id: "affine", lv: 1, titre: "Deux forfaits",
q: "Forfait A : " + fa + " CHF par mois plus " + N(pa).replace("{,}", ",") + " CHF la minute. Forfait B : " + N(pb).replace("{,}", ",") + " CHF la minute, sans abonnement. On note " + M("x") + " le nombre de minutes par mois.",
parts: [{ label: "Écris le coût " + M("A(x)") + " et le coût " + M("B(x)") + ".", pts: 1 }, { label: "Pour combien de minutes les deux forfaits coûtent-ils la même chose ?", pts: 2 }, { label: who() + " téléphone environ 2 h par mois. Quel forfait lui conseilles-tu ? Justifie.", pts: 1 }],
sol: ul([M("A(x) = " + N(pa) + "x + " + fa) + ", " + M("B(x) = " + N(pb) + "x") + ".", M(N(pa) + "x + " + fa + " = " + N(pb) + "x") + ", " + M("x = " + N(x0)) + " minutes.", "120 min : A coûte " + M(N(r6(pa * 120 + fa))) + " CHF, B " + M(N(r6(pb * 120))) + " CHF : " + (pa * 120 + fa < pb * 120 ? "le forfait A." : "le forfait B.")]) }); },

() => { const l = R.int(8, 20), p = R.int(10, 30), t = l + p, pa = 4 * l + 2 * p;
return X({ id: "sysprob", lv: 1, titre: "La ferme",
q: "Dans une ferme, on compte " + t + " têtes et " + pa + " pattes. Il n'y a que des poules et des lapins.",
parts: [{ label: "Choisis deux inconnues et écris un système.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "Vérifie ta réponse dans l'énoncé.", pts: 1 }],
sol: ul([sys("p + \\ell = " + t, "2p + 4\\ell = " + pa) + " (" + M("p") + " poules, " + M("\\ell") + " lapins).", M("2p + 2\\ell = " + 2 * t) + " ; on soustrait : " + M("2\\ell = " + (pa - 2 * t)) + ", " + M("\\ell = " + l) + ", " + M("p = " + p) + ".", M(p + " + " + l + " = " + t) + " têtes et " + M(2 * p + " + " + 4 * l + " = " + pa) + " pattes ✓."]) }); },

() => { const [v, c] = pk([[12, 2], [15, 3], [18, 2], [18, 3]]);
const D = (v + c) * 2, t2 = D / (v - c);
return X({ id: "sysprob", lv: 2, titre: "Le bateau et le courant",
q: "Un bateau descend une rivière : il parcourt " + D + " km en 2 h. Il remonte ensuite la même distance en " + T(r6(t2)) + " h.",
parts: [{ label: "Calcule sa vitesse en descendant et en remontant.", pts: 1 }, { label: "En notant " + M("v") + " la vitesse du bateau en eau calme et " + M("c") + " celle du courant, écris un système et résous-le.", pts: 2 }, { label: "Combien de temps lui faudrait-il pour parcourir " + D + " km sur un lac (sans courant) ?", pts: 1 }],
sol: ul([M(D + " : 2 = " + (v + c)) + " km/h et " + M(D + " : " + N(r6(t2)) + " = " + (v - c)) + " km/h.", sys("v + c = " + (v + c), "v - c = " + (v - c)) + " : " + M("v = " + v) + ", " + M("c = " + c) + ".", M(D + " : " + v + " \\approx " + N(Math.round((D / v) * 100) / 100)) + " h."]) }); },

() => { const a = pk([1, 2]), b = pk([-1, 1, 2]), c = pk([-1, -2]), e = pk([5, 4, 7]), x0 = (e - b) / (a - c), y0 = a * x0 + b;
return X({ id: "sysgraph", lv: 2, titre: "Deux droites",
q: "On considère les droites " + M("d_1 : y = " + (a === 1 ? "" : a) + "x" + (b < 0 ? " - " + -b : " + " + b)) + " et " + M("d_2 : y = " + (c === -1 ? "-" : c) + "x + " + e) + ".",
parts: [{ label: "Calcule les coordonnées de leur point d'intersection.", pts: 2 }, { label: "Écris l'équation d'une droite " + M("d_3") + " qui n'a aucun point commun avec " + M("d_1") + ".", pts: 1 }, { label: "Le système formé par " + M("d_1") + " et " + M("2y = " + 2 * a + "x" + (2 * b < 0 ? " - " + -2 * b : " + " + 2 * b)) + " a-t-il une, aucune ou une infinité de solutions ? Explique.", pts: 1 }],
sol: ul([M(a + "x" + (b < 0 ? " - " + -b : " + " + b) + " = " + c + "x + " + e) + ", " + M("x = " + N(r6(x0))) + ", " + M("y = " + N(r6(y0))) + ".", "Une droite parallèle : même pente " + M(a) + ", autre ordonnée à l'origine, par exemple " + M("y = " + (a === 1 ? "" : a) + "x + " + (b + 5)) + ".", "Une infinité : en divisant par 2, c'est la même équation (droites confondues)."]) }); },

() => { const a = pk([1, -1, 2]), b = pk([-2, 0, 3]), c = pk([1, -3, 4]), ys = [-1, 0, 1].map((x) => a * x * x + b * x + c);
return X({ id: "sys3", lv: 3, titre: "La parabole cachée",
q: "Une parabole " + M("y = ax^2 + bx + c") + " passe par " + M("A(-1 \\,;\\, " + ys[0] + ")") + ", " + M("B(0 \\,;\\, " + ys[1] + ")") + " et " + M("C(1 \\,;\\, " + ys[2] + ")") + ".",
parts: [{ label: "Écris le système de trois équations.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "La parabole passe-t-elle par " + M("D(2 \\,;\\, " + (4 * a + 2 * b + c + 1) + ")") + " ? Justifie.", pts: 1 }],
sol: ul([sys("a - b + c = " + ys[0], "c = " + ys[1], "a + b + c = " + ys[2]), M("c = " + c) + " ; en additionnant la 1re et la 3e : " + M("2a + 2c = " + (ys[0] + ys[2])) + ", " + M("a = " + a) + " ; puis " + M("b = " + b) + ".", "Non : pour " + M("x = 2") + ", " + M("y = " + (4 * a + 2 * b + c)) + ", pas " + (4 * a + 2 * b + c + 1) + "."]) }); },

() => { const B = pk([600, 750, 900]), car = pk([240, 300]), p = pk([12, 15]), mn = pk([10, 12, 15]), mx = Math.floor((B - car) / p);
return X({ id: "sysineq", lv: 2, titre: "La sortie de classe",
q: "Pour une sortie, la classe dispose de " + B + " CHF. Le car coûte " + car + " CHF et l'entrée " + p + " CHF par élève. Il faut au moins " + mn + " élèves pour que le car soit réservé. On note " + M("x") + " le nombre d'élèves.",
parts: [{ label: "Écris un système de deux inéquations.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "Combien de nombres d'élèves sont possibles ?", pts: 1 }],
sol: ul([sys(car + " + " + p + "x \\le " + B, "x \\ge " + mn), M(p + "x \\le " + (B - car)) + ", " + M("x \\le " + N(r6((B - car) / p))) + " ; avec " + M("x \\ge " + mn) + " : " + M("S = [" + mn + " \\,;\\, " + N(r6((B - car) / p)) + "]") + ".", "Les entiers de " + mn + " à " + mx + " : " + (mx - mn + 1) + " possibilités."]) }); },

() => { let z, a, k, b; do { z = pk([2, 3, 4]); a = pk([-3, -2, 2, 3]); k = R.int(-6, 6); b = (a * z + k) / (a - 1); } while (!Number.isInteger(b) || k === 0);
const gk = k < 0 ? " - " + -k : " + " + k, op = a - 1 < 0 ? "\\le" : "\\ge";
return X({ id: "affzero", lv: 2, titre: "Étude de signe",
q: "Soit " + M("f(x) = " + a + "x " + (-a * z < 0 ? "- " + a * z : "+ " + -a * z)) + " et " + M("g(x) = x" + gk) + ".",
parts: [{ label: "Calcule le zéro de " + M("f") + " et dresse le tableau de signes de " + M("f") + ".", pts: 2 }, { label: "Résous " + M("f(x) \\ge g(x)") + ".", pts: 2 }],
sol: ul(["Zéro : " + M("x = " + z) + ". " + (a > 0 ? "Pente positive : " + M("f") + " négative avant " + z + ", positive après." : "Pente négative : " + M("f") + " positive avant " + z + ", négative après."), M((a - 1) + "x \\ge " + (a * z + k)) + (a - 1 < 0 ? " ; on divise par un négatif, le sens change" : "") + " : " + M("x " + op + " " + b) + "."]) }); },

() => { const h1 = pk([2, 3]), h2 = h1 + pk([2, 3]), t = pk([75, 80, 90]), dpl = pk([50, 60, 70]);
return X({ id: "affine", lv: 2, titre: "La facture du plombier",
q: "Un plombier facture un déplacement fixe et un tarif horaire. Pour " + h1 + " h de travail, il demande " + (dpl + t * h1) + " CHF ; pour " + h2 + " h, " + (dpl + t * h2) + " CHF.",
parts: [{ label: "Calcule le tarif horaire.", pts: 1 }, { label: "Calcule le prix du déplacement et écris la fonction " + M("P(h)") + ".", pts: 2 }, { label: "Un client a payé " + N(dpl + t * 4.5) + " CHF. Combien de temps le plombier a-t-il travaillé ?", pts: 1 }],
sol: ul([M("\\frac{" + (dpl + t * h2) + " - " + (dpl + t * h1) + "}{" + (h2 - h1) + "} = " + t) + " CHF/h.", M((dpl + t * h1) + " - " + t + " \\cdot " + h1 + " = " + dpl) + " ; " + M("P(h) = " + t + "h + " + dpl) + ".", M(t + "h + " + dpl + " = " + N(dpl + t * 4.5)) + ", " + M("h = 4{,}5") + " : 4 h 30."]) }); },
];
const RAISON = [
() => { const w = who();
return X({ id: "sys2", lv: 1, titre: "Trouve l'erreur",
q: w + " résout " + sys("x + y = 10", "x - y = 4") + " et répond « " + M("x = 7") + " ».",
parts: [{ label: "Vérifie la valeur de " + w + ". Que manque-t-il à sa réponse ?", pts: 1 }, { label: "Donne la solution complète.", pts: 1 }],
sol: ul([M("x = 7") + " est juste, mais la solution d'un système est un <b>couple</b> : il manque " + M("y") + ".", M("y = 10 - 7 = 3") + " ; " + M("S = \\{(7 \\,;\\, 3)\\}") + ", vérifié : " + M("7 - 3 = 4") + "."]) }); },
() => { const S = [["« Deux droites de même pente n'ont jamais de point commun. »", false, "Si elles ont aussi la même ordonnée à l'origine, elles sont confondues (une infinité de points communs)."], ["« Un système de deux équations du 1er degré peut avoir exactement deux solutions. »", false, "Deux droites distinctes se coupent en un point au plus ; sinon aucune ou une infinité."], ["« Si a < 0, la fonction f(x) = ax + b est positive avant son zéro. »", true, "Elle est décroissante : positive avant le zéro, négative après."], ["« Le système x > 3 et x < 1 n'a aucune solution. »", true, "Aucun nombre n'est à la fois plus grand que 3 et plus petit que 1."]];
return X({ id: "sysgraph", lv: 1, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie (exemple, contre-exemple ou propriété).",
parts: S.map((s) => ({ label: s[0], pts: 1 })), sol: ul(S.map((s) => "<b>" + (s[1] ? "Vrai" : "Faux") + "</b>. " + s[2])) }); },
() => { const w = who();
return X({ id: "sysineq", lv: 2, titre: "Trouve l'erreur",
q: w + " résout " + sys("-2x + 1 > 7", "x + 5 \\ge 0") + " : « " + M("-2x > 6") + ", donc " + M("x > -3") + " ; et " + M("x \\ge -5") + ". Donc " + M("S = \\,]-3 \\,;\\, +\\infty[") + " ».",
parts: [{ label: "Teste " + M("x = 0") + " dans la première inéquation. Que constates-tu ?", pts: 1 }, { label: "Corrige l'erreur et donne l'ensemble des solutions.", pts: 2 }],
sol: ul([M("-2 \\cdot 0 + 1 = 1") + ", et " + M("1 > 7") + " est faux : 0 n'est pas solution, alors que " + w + " l'incluait.", "En divisant par " + M("-2") + ", on retourne le sens : " + M("x < -3") + ". Avec " + M("x \\ge -5") + " : " + M("S = [-5 \\,;\\, -3[") + "."]) }); },
() => X({ id: "affine", lv: 2, titre: "Construis un exemple",
q: "Réponds à chaque demande par un exemple, et justifie.",
parts: [{ label: "Une fonction affine dont le zéro est 4 et qui est croissante.", pts: 1 }, { label: "Un système de deux équations qui a pour unique solution " + M("(2 \\,;\\, -1)") + ".", pts: 1 }, { label: "Un système de deux équations sans solution.", pts: 1 }],
sol: ul(["Par exemple " + M("f(x) = x - 4") + " (pente 1 > 0, " + M("f(4) = 0") + ").", "Par exemple " + sys("x + y = 1", "x - y = 3") + " (vérifié : " + M("2 - 1 = 1") + ", " + M("2 + 1 = 3") + ").", "Par exemple " + sys("x + y = 1", "x + y = 2") + " : droites parallèles."]) }),
];
RICH.sys1c = { ids: ["sys2", "sysprob", "sysgraph", "sys3", "affine", "affzero", "sysineq"], label: "Systèmes et fonctions affines", ex: EX, raison: RAISON, minutes: 45 };
})();








const RICHU = (() => {
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const grp = (i) => (i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}") : i);
const N = (v) => { v = r6(v); const s = v < 0 ? "-" : ""; const [i, f] = String(Math.abs(v)).split("."); return s + grp(i) + (f ? "{,}" + f : ""); };
const Nk = (v, k) => { const s = v < 0 ? "-" : ""; const [i, f] = Math.abs(v).toFixed(k).split("."); return s + grp(i) + (f ? "{,}" + f : ""); };
const A = (v, k) => N(+(+v).toFixed(k));
const T = (v) => M(N(v));
const u = (s) => ("\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}").replace(/\\text\{\}$/, "");
const Q = (v, s) => M(N(v) + u(s));
const chf = (v) => M(Nk(v, 2) + u("CHF"));
const pk = (a) => a[Math.floor(R.rand() * a.length)];
const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a / g2(a, b)) * b;

const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = g2(n, d) || 1; return [n / g, d / g]; };
const fadd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
const fv = (a) => a[0] / a[1];
const ft = (a) => frac(a[0], a[1]);
const pd = (t) => colonBreak(String(t).split(/(\\\(.*?\\\))/).map((seg, i) => (i % 2 ? seg : seg.replace(/\{,\}/g, ",").replace(/\\text\{'\}/g, "'"))).join(""));
const X = (o) => Object.assign({ pts: Math.max(1, o.parts.reduce((s, p) => s + p.pts, 0)), chk: [], vals: [] }, o, { q: pd(o.q), sol: pd(o.sol), parts: o.parts.map((p) => ({ label: pd(p.label), pts: p.pts })) });
const ul = (rows) => "<ol type=\"a\" class=\"mock-parts\">" + rows.map((r) => "<li>" + r + "</li>").join("") + "</ol>";
const W = [["Lina", 0], ["Noé", 1], ["Inès", 0], ["Yanis", 1], ["Mia", 0], ["Sam", 1], ["Léo", 1], ["Zoé", 0], ["Malik", 1], ["Elsa", 0], ["Nora", 0], ["Tim", 1]];
const who = (not) => { let w; do w = pk(W); while (not && w[0] === not); const m = w[1]; return { n: w[0], il: m ? "il" : "elle", Il: m ? "Il" : "Elle", le: m ? "le" : "la", lui: m ? "lui" : "elle", e: m ? "" : "e" }; };
const tab = (head, rows) => "<table class=\"mtab\"><tr>" + head.map((h) => "<th>" + h + "</th>").join("") + "</tr>" + rows.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table>";

const VF = (o, pool, k = 3) => { const L = sh(pool).slice(0, k).map((f) => f());
return X({ id: o.id, lv: o.lv || 2, titre: o.titre || "Vrai ou faux ?", q: o.q || "Pour chaque affirmation, dis si elle est vraie ou fausse, puis justifie (un calcul, un exemple ou un contre-exemple).",
parts: L.map((x) => ({ label: "« " + x[0] + " »", pts: 1 })), sol: ul(L.map((x) => "<b>" + (x[1] ? "Vrai" : "Faux") + ".</b> " + x[2])), chk: L.map((x) => [typeof x[1] === "boolean", "VF booléen"]), vals: [] }); };
const two = (n) => (n < 10 ? "0" : "") + n;
const hm = (m) => Math.floor(m / 60) + " h " + two(m % 60);
const dur = (m) => (m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + two(m % 60) + " min" : "") : m + " min");
const fmt = (v) => String(r6(v)).replace(".", ",");

const svg = (w, h, body, label) => "<svg class=\"fig\" viewBox=\"0 0 " + w + " " + h + "\" role=\"img\" aria-label=\"" + (label || "figure") + "\" xmlns=\"http://www.w3.org/2000/svg\">" + body + "</svg>";
const tx = (x, y, s, cls = "f-txt", anchor = "middle", size = 13) => "<text x=\"" + r6(x) + "\" y=\"" + r6(y) + "\" class=\"" + cls + "\" text-anchor=\"" + anchor + "\" font-size=\"" + size + "\">" + s + "</text>";
const ln = (x1, y1, x2, y2, cls = "f-line", extra = "") => "<line x1=\"" + r6(x1) + "\" y1=\"" + r6(y1) + "\" x2=\"" + r6(x2) + "\" y2=\"" + r6(y2) + "\" class=\"" + cls + "\" " + extra + "/>";
const pg = (pts, cls = "f-shape") => "<polygon points=\"" + pts.map((p) => r6(p[0]) + "," + r6(p[1])).join(" ") + "\" class=\"" + cls + "\"/>";

function grid(x0, x1, y0, y1, pts = [], polys = []) {
const s = Math.min(26, 290 / (x1 - x0), 240 / (y1 - y0)), W2 = (x1 - x0) * s + 30, H2 = (y1 - y0) * s + 30, X0 = 15 - x0 * s, Y0 = 15 + y1 * s;
const px = (x) => X0 + x * s, py = (y) => Y0 - y * s;
let g = "";
for (let x = x0; x <= x1; x++) g += ln(px(x), py(y0), px(x), py(y1), "", "stroke=\"var(--line)\" stroke-width=\"0.8\"");
for (let y = y0; y <= y1; y++) g += ln(px(x0), py(y), px(x1), py(y), "", "stroke=\"var(--line)\" stroke-width=\"0.8\"");
g += ln(px(x0), py(0), px(x1), py(0), "f-line") + ln(px(0), py(y0), px(0), py(y1), "f-line");
for (let x = x0; x <= x1; x++) if (x && x % 2 === 0) g += tx(px(x), py(0) + 12, x, "f-txt", "middle", 9);
for (let y = y0; y <= y1; y++) if (y && y % 2 === 0) g += tx(px(0) - 4, py(y) + 3, y, "f-txt", "end", 9);
g += tx(px(0) - 4, py(0) + 12, "0", "f-txt", "end", 9);
polys.forEach(([P, cls]) => (g += pg(P.map(([x, y]) => [px(x), py(y)]), cls || "f-shape")));
pts.forEach(([x, y, l]) => (g += "<circle cx=\"" + px(x) + "\" cy=\"" + py(y) + "\" r=\"3.5\" class=\"f-dot\"/>" + (l ? tx(px(x) + 6, py(y) - 6, l, "f-accent f-txt", "start", 13) : "")));
return svg(W2, H2, g, "repère");
}

function bars(labels, values, ylab) {
const max = Math.max(...values), n = values.length, w = 280 / n, top = Math.ceil(max / 5) * 5, H = 130;
let g = ln(30, 150, 315, 150) + ln(30, 150, 30, 12);
for (let v = 0; v <= top; v += top > 20 ? 5 : 2) { const y = 150 - (v / top) * H; g += ln(26, y, 315, y, "", "stroke=\"var(--line)\" stroke-width=\"0.6\"") + tx(23, y + 4, v, "f-txt", "end", 10); }
values.forEach((v, i) => { const hh = (v / top) * H; g += "<rect x=\"" + r6(34 + i * w + 4) + "\" y=\"" + r6(150 - hh) + "\" width=\"" + r6(w - 10) + "\" height=\"" + r6(hh) + "\" class=\"f-fill2\"/>" + tx(34 + i * w + w / 2 - 1, 166, labels[i], "f-txt", "middle", 11); });
return svg(320, 176, g + (ylab ? tx(34, 10, ylab, "f-txt", "start", 10) : ""), "diagramme en bâtons");
}

function pie(parts) {
let a0 = -90, g = "";
const cx = 160, cy = 95, r = 75, P = (a, rr = r) => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)];
parts.forEach(([lab, ang], i) => { const a1 = a0 + ang, [x0, y0] = P(a0), [x1, y1] = P(a1), [lx, ly] = P(a0 + ang / 2, r * 0.62);
g += "<path d=\"M" + cx + " " + cy + " L" + r6(x0) + " " + r6(y0) + " A" + r + " " + r + " 0 " + (ang > 180 ? 1 : 0) + " 1 " + r6(x1) + " " + r6(y1) + " Z\" class=\"" + (i % 2 ? "f-fill2" : "f-shape2") + "\"/>" + tx(lx, ly + 4, lab, "f-txt", "middle", 11); a0 = a1; });
return svg(320, 190, g, "diagramme circulaire");
}
return { r6, N, Nk, A, T, u, Q, chf, pk, sh, g2, lcm, fr, fadd, fsub, fmul, fdiv, fv, ft, pd, X, ul, who, tab, VF, two, hm, dur, fmt, svg, tx, ln, pg, grid, bars, pie };
})();

(function () {
const { r6, N, Nk, A, T, u, Q, chf, pk, sh, g2, lcm, fr, fadd, fsub, fmul, fdiv, fv, ft, X, ul, who, tab, VF, hm, dur, fmt, svg, tx, ln, pg, grid, bars } = RICHU;


const EXD = [

() => { const L = sh([["pommes", 3.4], ["tomates", 4.8], ["carottes", 2.6], ["cerises", 9.8], ["abricots", 6.4], ["poires", 4.2], ["courgettes", 3.8]]), P = L.slice(0, 3), E = L[3], q = sh([0.5, 1.5, 2, 2.5, 3]).slice(0, 3), w = who(), h = pk(["7 h 30", "8 h 15", "6 h 45"]);
const c = P.map((p, i) => r6(p[1] * q[i])), tot = r6(c[0] + c[1] + c[2]), bill = tot < 50 ? 50 : 100, rend = r6(bill - tot), est = c.reduce((s, x) => s + Math.round(x), 0), ex = r6(E[1] * 1.5), ok = ex <= rend;
return X({ id: "decprob", lv: 1, titre: "Au marché",
q: w.n + " fait les courses au marché, qui ouvre à " + h + ". Voici ses achats." + tab(["produit", "prix au kg", "quantité"], P.map((p, i) => [p[0], chf(p[1]), Q(q[i], "kg")])),
parts: [{ label: "Calcule le prix payé pour chaque produit.", pts: 3 }, { label: "Estime d'abord le total en arrondissant chaque prix au franc, puis calcule-le exactement.", pts: 2 }, { label: "Combien lui rend-on sur un billet de " + bill + " CHF ?", pts: 1 }, { label: "Avec cette monnaie, peut-" + w.il + " encore acheter " + Q(1.5, "kg") + " de " + E[0] + " à " + chf(E[1]) + " le kilo ? Justifie.", pts: 1 }],
sol: ul([P.map((p, i) => p[0] + " : " + M(N(p[1]) + " \\cdot " + N(q[i]) + " = " + Nk(c[i], 2)) + " CHF").join(" ; ") + ".", "Estimation : environ " + est + " CHF. Total exact : " + M(c.map((x) => Nk(x, 2)).join(" + ") + " = " + Nk(tot, 2)) + " CHF (proche de l'estimation). L'heure d'ouverture ne sert à rien.", M(bill + " - " + Nk(tot, 2) + " = " + Nk(rend, 2)) + " CHF.", M(N(E[1]) + " \\cdot 1{,}5 = " + Nk(ex, 2)) + " CHF : " + (ok ? "oui, car " + Nk(ex, 2) + " ≤ " + Nk(rend, 2) + "." : "non, car " + Nk(ex, 2) + " > " + Nk(rend, 2) + ".")]),
chk: [[Math.abs(tot - P.reduce((s, p, i) => s + p[1] * q[i], 0)) < 1e-9, "total"], [rend > 0, "monnaie positive"], [Math.abs(est - tot) < 3, "estimation proche"]], vals: [...c, tot, rend, ex] }); },

() => { const a = pk([4, 5]), V = pk([[0.9, 0.86, 0.09, 0.74, 0.7], [0.8, 0.75, 0.08, 0.68, 0.6], [0.6, 0.58, 0.06, 0.5, 0.47]]), names = sh(["Aya", "Ben", "Chloé", "David", "Emma", "Félix", "Gaïa"]).slice(0, 5);
const S = sh(V).map((d, i) => ({ n: names[i], v: r6(a + d) })), srt = S.slice().sort((x, y) => y.v - x.v), rd = (v) => Math.round(v * 10) / 10;
const groups = {}; S.forEach((s) => (groups[rd(s.v)] = (groups[rd(s.v)] || []).concat(s.n))); const same = Object.entries(groups).filter(([, l]) => l.length > 1);
const gap = Math.round((srt[0].v - srt[1].v) * 100), mid = Math.round(((srt[1].v + srt[2].v) / 2) * 100) / 100;
return X({ id: "deccomp", lv: 2, titre: "Le concours de saut en longueur",
q: "Voici les meilleurs sauts de cinq élèves (le vent soufflait à " + Q(1.2, "m/s") + ")." + tab(["élève", "saut (m)"], S.map((s) => [s.n, T(s.v)])),
parts: [{ label: "Range les sauts du plus long au plus court.", pts: 2 }, { label: "Arrondis chaque saut au dixième de mètre. Quels élèves ont le même arrondi ?", pts: 2 }, { label: "Combien de centimètres séparent le premier du deuxième ?", pts: 1 }, { label: "Un sixième élève saute plus loin que le 3e du classement, mais moins loin que le 2e. Donne une longueur possible, au centimètre.", pts: 1 }],
sol: ul([srt.map((s) => s.n + " (" + N(s.v) + ")").join(" > ") + ". Attention : " + N(a + V[0]) + " = " + Nk(a + V[0], 2) + " > " + Nk(a + V[1], 2) + " : on écrit le même nombre de décimales, puis on compare chiffre par chiffre.", S.map((s) => s.n + " : " + N(rd(s.v))).join(" ; ") + ". Même arrondi : " + same.map(([v, l]) => l.join(" et ") + " (" + N(+v) + " m)").join(" ; ") + ".", M(Nk(srt[0].v, 2) + " - " + Nk(srt[1].v, 2) + " = " + Nk(gap / 100, 2)) + " m, soit " + gap + " cm.", "Par exemple " + Q(mid, "m") + " (toute longueur strictement entre " + N(srt[2].v) + " m et " + N(srt[1].v) + " m convient)."]),
chk: [[same.length >= 1, "au moins un même arrondi"], [mid > srt[2].v && mid < srt[1].v, "encadrement"], [gap >= 2, "écart"]], vals: [gap, mid] }); },

() => { const m = pk([2.4, 2.8, 1.9, 3.1, 2.2, 2.6]), g1 = r6(m / 100), n1kg = 100000 / m, est = Math.round(n1kg / 1000) * 1000, sac = 25 * n1kg;
return X({ id: "dec10", lv: 2, titre: "Combien de grains de riz ?",
q: "Une balance de laboratoire indique que 100 grains de riz pèsent " + Q(m, "g") + ". Le paquet de riz coûte " + chf(pk([2.95, 3.4, 4.2])) + ".",
parts: [{ label: "Combien pèse un grain de riz, en grammes ? Et en milligrammes ?", pts: 2 }, { label: "Combien pèsent 1000 grains ? 10'000 grains ?", pts: 2 }, { label: "Environ combien de grains y a-t-il dans un paquet de 1 kg ? Arrondis au millier.", pts: 2 }, { label: "Un restaurant achète un sac de 25 kg. Donne l'ordre de grandeur du nombre de grains (dizaine de milliers, centaine de milliers, million… ?).", pts: 1 }],
sol: ul([M(N(m) + " : 100 = " + N(g1)) + " g, soit " + M(N(g1) + " \\cdot 1000 = " + N(r6(g1 * 1000))) + " mg.", M(N(m) + " \\cdot 10 = " + N(r6(m * 10))) + " g et " + M(N(m) + " \\cdot 100 = " + N(r6(m * 100))) + " g.", M("1000 : " + N(g1) + " \\approx " + N(est)) + " grains (1 kg = 1000 g). Le prix ne sert à rien.", M("25 \\cdot " + N(est) + " \\approx " + N(Math.round(sac / 1000) * 1000)) + " : environ <b>un million</b> de grains."]),
chk: [[Math.abs(g1 * 100 - m) < 1e-9, "÷100"], [sac > 600000 && sac < 1500000, "ordre du million"], [Math.abs(est - n1kg) <= 500, "arrondi au millier"]], vals: [g1, g1 * 1000, m * 10, m * 100, est] }); },

() => { const Ad = pk([16, 17, 18, 19]), E = pk([11, 12, 13]), P = pk([6.5, 7, 7.5]), n = pk([2, 3, 4]), r = pk([2, 3, 4]), w = who();
const tot = r6(2 * Ad + n * (E + P)), noe = r6(2 * Ad + n * E + P), moy = Math.round((tot / (n + 2)) * 100) / 100, mer = r6(tot - r * (n + 2));
return X({ id: "tradexpr", lv: 3, titre: "Sortie au cinéma",
q: "La famille de " + w.n + " (2 adultes et " + n + " enfants) va au cinéma. Un billet adulte coûte " + chf(Ad) + ", un billet enfant " + chf(E) + ". Chaque enfant reçoit un pop-corn à " + chf(P) + " ; les adultes n'en prennent pas.",
parts: [{ label: "Écris <b>un seul calcul</b> (avec des parenthèses si nécessaire) qui donne la dépense totale, puis effectue-le.", pts: 2 }, { label: w.n + " écrit " + M("2 \\cdot " + Ad + " + " + n + " \\cdot " + E + " + " + N(P)) + ". Que calcule ce calcul ? Pourquoi n'est-il pas correct ?", pts: 2 }, { label: "Quel est le prix moyen par personne, au centime ?", pts: 1 }, { label: "Le mercredi, chaque billet coûte " + r + " CHF de moins. Écris le nouveau calcul et effectue-le.", pts: 2 }],
sol: ul([M("2 \\cdot " + Ad + " + " + n + " \\cdot (" + E + " + " + N(P) + ") = " + N(2 * Ad) + " + " + n + " \\cdot " + N(E + P) + " = " + N(tot)) + " CHF.", "Il ne compte qu'<b>un seul</b> pop-corn : la multiplication passe avant l'addition, donc " + M(n) + " ne multiplie que le billet enfant. Résultat " + N(noe) + " CHF, il manque " + M(n - 1 + " \\cdot " + N(P)) + " CHF.", M(N(tot) + " : " + (n + 2) + " \\approx " + Nk(moy, 2)) + " CHF.", M("2 \\cdot (" + Ad + " - " + r + ") + " + n + " \\cdot (" + E + " - " + r + " + " + N(P) + ") = " + N(mer)) + " CHF (ou " + M(N(tot) + " - " + r + " \\cdot " + (n + 2)) + ")."]),
chk: [[Math.abs(tot - noe - (n - 1) * P) < 1e-9, "écart Noé"], [Math.abs(mer - (2 * (Ad - r) + n * (E - r + P))) < 1e-9, "mercredi"]], vals: [tot, noe, moy, mer] }); },
];
const RAISOND = [
() => { const a = R.int(30, 50), b = R.int(3, 6), c = R.int(3, 5), d = R.int(2, 9), right = a - b * c + d, wrong = (a - b) * c + d, w = who();
return X({ id: "prio", lv: 2, titre: "Trouve l'erreur",
q: w.n + " calcule " + M(a + " - " + b + " \\cdot " + c + " + " + d) + " ainsi : " + M(a + " - " + b + " = " + (a - b)) + ", puis " + M((a - b) + " \\cdot " + c + " = " + (a - b) * c) + ", puis " + M((a - b) * c + " + " + d + " = " + wrong) + ".",
parts: [{ label: "Explique l'erreur de " + w.n + ".", pts: 1 }, { label: "Calcule correctement, en écrivant les étapes.", pts: 1 }, { label: "Place des parenthèses dans le calcul de départ pour obtenir le résultat de " + w.n + ".", pts: 1 }],
sol: ul([w.Il + " a calculé de gauche à droite : la multiplication est prioritaire sur l'addition et la soustraction.", M(a + " - " + b * c + " + " + d + " = " + right) + ".", M("(" + a + " - " + b + ") \\cdot " + c + " + " + d + " = " + wrong) + "."]),
chk: [[right !== wrong && right > 0, "résultats distincts"]], vals: [right, wrong] }); },
() => VF({ id: "decmul" }, [
() => { const a = pk([0.5, 0.4, 0.8]), b = R.int(12, 40); return ["Quand on multiplie " + b + " par un nombre, on obtient toujours un résultat plus grand que " + b + ".", false, M(b + " \\cdot " + N(a) + " = " + N(r6(b * a))) + ", plus petit que " + b + " : multiplier par un nombre plus petit que 1 diminue."]; },
() => { const x = R.int(2, 8), y = pk([12, 15, 18, 24]), z = pk([3, 4, 5, 6, 9]); return ["On a " + M(x + "{,}" + y + " > " + x + "{,}" + z) + " car " + y + " > " + z + ".", false, M(x + "{,}" + z + " = " + x + "{,}" + z + "0") + " et " + z + "0 > " + y + " : c'est " + M(x + "{,}" + y + " < " + x + "{,}" + z) + "."]; },
() => { const b = R.int(7, 23); return ["Diviser par 0,5 revient à multiplier par 2.", true, "Dans " + b + ", il y a " + 2 * b + " demis : " + M(b + " : 0{,}5 = " + 2 * b + " = " + b + " \\cdot 2") + "."]; },
() => { const a = pk([2, 3, 4]), b = pk([2, 3]); return [M("0{,}" + a + " \\cdot 0{,}" + b + " = 0{,}" + a * b) + ".", false, M("0{,}" + a + " \\cdot 0{,}" + b + " = \\frac{" + a + "}{10} \\cdot \\frac{" + b + "}{10} = \\frac{" + a * b + "}{100} = 0{,}0" + a * b) + "."]; },
() => { const x = R.int(2, 9); return ["Entre " + x + ",4 et " + x + ",5, il n'y a aucun nombre décimal.", false, "Par exemple " + x + ",45 ou " + x + ",41 sont entre les deux (il y en a une infinité)."]; },
() => { const x = R.int(3, 9); return [M(x + "{,}5 \\cdot 10 = " + x + "{,}50") + ".", false, "Multiplier par 10 décale les chiffres d'un rang : " + M(x + "{,}5 \\cdot 10 = " + (x * 10 + 5)) + " (" + x + ",50 = " + x + ",5, rien n'a changé)."]; },
]),
() => { const a = pk([3, 4, 5, 6]), b = pk([3, 4]), [p, q] = pk([[2, 5], [3, 4], [2, 6]]), w = who();
return X({ id: "pow9", lv: 2, titre: "Puissances : trouve l'erreur",
q: w.n + " écrit : " + M(a + "^" + b + " = " + a + " \\cdot " + b + " = " + a * b) + " et " + M(p + "^" + q + " = " + p * q) + ".",
parts: [{ label: "Explique l'erreur.", pts: 1 }, { label: "Calcule correctement " + M(a + "^" + b) + " et " + M(p + "^" + q) + ".", pts: 1 }, { label: "Compare " + M(p + "^" + q) + " et " + M(q + "^" + p) + ". Lequel est le plus grand ?", pts: 1 }],
sol: ul([M(a + "^" + b) + " veut dire " + a + " multiplié par lui-même " + b + " fois, pas " + a + " fois " + b + ".", M(a + "^" + b + " = " + Array(b).fill(a).join(" \\cdot ") + " = " + N(a ** b)) + " et " + M(p + "^" + q + " = " + p ** q) + ".", M(q + "^" + p + " = " + q ** p) + " : " + M(p + "^" + q + (p ** q > q ** p ? " > " : " < ") + q + "^" + p) + "."]),
chk: [[a ** b !== a * b && p ** q !== p * q, "erreur visible"]], vals: [a ** b, p ** q, q ** p] }); },
];
RICH.dec9 = { ids: ["decread", "deccomp", "decarr", "ordgr", "decadd", "dec10", "decmul", "decdiv", "decprob", "pow9", "prio", "tradexpr"], label: "Nombres décimaux (9e)", ex: EXD, raison: RAISOND, minutes: 45 };


const EXU = [

() => { const dep0 = 6 * 60 + R.int(0, 5) * 5 + 20, gaps = [R.int(15, 25), R.int(20, 35), R.int(15, 30)], durs = sh([36, 42, 48, 53, 67]).slice(0, 4), w = who(), city = pk([["Genève", "Lausanne"], ["Genève", "Yverdon"], ["Lausanne", "Fribourg"], ["Neuchâtel", "Berne"]]);
const D = [dep0]; gaps.forEach((g) => D.push(D[D.length - 1] + g)); const Ar = D.map((d, i) => d + durs[i]);
const fast = durs.indexOf(Math.min(...durs)), k = R.int(1, 3), limit = Ar[k] + R.int(2, 6);
const okIdx = D.map((d, i) => i).filter((i) => Ar[i] <= limit), last = okIdx.reduce((b, i) => (D[i] > D[b] ? i : b), okIdx[0]), week = 5 * 2 * durs[fast];
return X({ id: "utemps", lv: 1, titre: "L'horaire du train",
q: w.n + " consulte l'horaire " + city[0] + " → " + city[1] + " (le billet coûte " + pk([18, 22, 25]) + " CHF)." + tab(["train", "départ", "arrivée"], D.map((d, i) => ["n° " + (i + 1), hm(d), hm(Ar[i])])),
parts: [{ label: "Calcule la durée de chaque trajet.", pts: 2 }, { label: "Quel train est le plus rapide ?", pts: 1 }, { label: w.n + " doit arriver au plus tard à " + hm(limit) + ". Quel est le dernier train qu'" + w.il + " peut prendre ?", pts: 1 }, { label: w.Il + " fait l'aller et le retour 5 jours par semaine, avec un trajet aussi long que le train le plus rapide. Combien de temps passe-t-" + w.il + " dans le train par semaine ? Donne la réponse en h et min.", pts: 2 }],
sol: ul([durs.map((d, i) => "n° " + (i + 1) + " : " + dur(d)).join(" ; ") + ".", "Le n° " + (fast + 1) + " (" + dur(durs[fast]) + ").", "Le n° " + (last + 1) + " (départ " + hm(D[last]) + ", arrivée " + hm(Ar[last]) + "). Le prix du billet ne sert à rien.", M("5 \\cdot 2 \\cdot " + durs[fast] + " = " + week) + " min " + M("= " + Math.floor(week / 60) + " \\cdot 60 + " + (week % 60)) + " min, soit " + dur(week) + "."]),
chk: [[Ar[last] <= limit && D.every((d, i) => Ar[i] > limit || D[i] <= D[last]), "dernier train"], [new Set(durs).size === 4, "durées distinctes"]], vals: [...durs, week] }); },

() => { const t = pk([1.8, 2.1, 1.65]), sc = pk([950, 1150, 870]), re = pk([340, 285, 410]), eau = pk([1.5, 2]), food = [pk([1, 2]), pk([300, 450, 750])], vide = pk([1.2, 1.35, 0.95]), lim = pk([8, 9, 10]);
const tot = r6(t + sc / 1000 + re / 1000 + eau + food[0] + food[1] / 1000 + vide), et = [pk([4.6, 5.3, 3.8]), pk([2800, 3450, 1950]), [pk([4, 5, 6]), pk([350, 75, 620])]], km = r6(et[0] + et[1] / 1000 + et[2][0] + et[2][1] / 1000), w = who();
return X({ id: "ulong", lv: 2, titre: "Le sac de randonnée",
q: w.n + " prépare son sac pour deux jours de marche : une tente de " + Q(t, "kg") + ", un sac de couchage de " + Q(sc, "g") + ", un réchaud de " + Q(re, "g") + ", " + Q(eau, "L") + " d'eau (" + M("1" + u("L")) + " d'eau pèse " + M("1" + u("kg")) + "), " + food[0] + " kg " + food[1] + " g de nourriture. Le sac vide pèse " + Q(vide, "kg") + ".",
parts: [{ label: "Exprime toutes les masses en kilogrammes.", pts: 2 }, { label: "Quelle est la masse du sac rempli ?", pts: 1 }, { label: "On conseille de ne pas porter plus de " + lim + " kg. " + w.Il + " respecte-t-" + w.il + " ce conseil ? Sinon, de combien dépasse-t-" + w.il + " ?", pts: 1 }, { label: "Les étapes mesurent " + Q(et[0], "km") + ", " + Q(et[1], "m") + " et " + et[2][0] + " km " + et[2][1] + " m. Quelle distance parcourt-" + w.il + " en tout, en km ?", pts: 2 }],
sol: ul(["Tente " + N(t) + " ; couchage " + N(sc / 1000) + " ; réchaud " + N(re / 1000) + " ; eau " + N(eau) + " ; nourriture " + N(r6(food[0] + food[1] / 1000)) + " ; sac vide " + N(vide) + " (en kg).", "Total : " + Q(tot, "kg") + ".", tot <= lim ? "Oui : " + N(tot) + " ≤ " + lim + "." : "Non : il dépasse de " + M(N(tot) + " - " + lim + " = " + N(r6(tot - lim))) + " kg.", M(N(et[0]) + " + " + N(et[1] / 1000) + " + " + N(r6(et[2][0] + et[2][1] / 1000)) + " = " + N(km)) + " km (attention : " + et[2][1] + " m = " + N(et[2][1] / 1000) + " km)."]),
chk: [[Math.abs(tot * 1000 - (t * 1000 + sc + re + eau * 1000 + food[0] * 1000 + food[1] + vide * 1000)) < 1e-6, "total g"], [tot !== lim, "pas égal"]], vals: [tot, km] }); },

() => { const L = pk([4.5, 5.2, 3.8, 6]), l = pk([3.2, 3.6, 4]), lw = pk([[120, 15], [90, 12], [140, 20]]), pack = pk([8, 10, 12]), w = who();
const Am = r6(L * l), Adm = r6(Am * 100), al = r6((lw[0] * lw[1]) / 100), n = Math.ceil(Adm / al - 1e-9), np = Math.ceil(n / pack);
return X({ id: "uaire", lv: 2, titre: "Le nouveau parquet",
q: "La chambre de " + w.n + " est un rectangle de " + Q(L, "m") + " sur " + Q(l, "m") + ", avec une fenêtre de " + Q(1.4, "m") + " de large. On la recouvre de lames de parquet de " + Q(lw[0], "cm") + " sur " + Q(lw[1], "cm") + ", vendues par paquets de " + pack + ".",
parts: [{ label: "Calcule l'aire de la chambre en m², puis en dm².", pts: 2 }, { label: "Calcule l'aire d'une lame en cm², puis en dm².", pts: 2 }, { label: "Combien de lames faut-il au minimum (sans tenir compte des chutes) ?", pts: 1 }, { label: "Combien de paquets faut-il acheter ?", pts: 1 }],
sol: ul([M(N(L) + " \\cdot " + N(l) + " = " + N(Am)) + " m² = " + Q(Adm, "dm^2") + " (1 m² = 100 dm²).", M(lw[0] + " \\cdot " + lw[1] + " = " + N(lw[0] * lw[1])) + " cm² = " + Q(al, "dm^2") + " (1 dm² = 100 cm²).", M(N(Adm) + " : " + N(al) + " \\approx " + N(Math.round((Adm / al) * 100) / 100)) + " : il faut " + n + " lames (on arrondit vers le haut). La largeur de la fenêtre ne sert à rien.", M(n + " : " + pack + " \\approx " + N(Math.round((n / pack) * 100) / 100)) + " : " + np + " paquets."]),
chk: [[n * al >= Adm && (n - 1) * al < Adm, "nb lames"]], vals: [Am, Adm, al, n, np] }); },

() => { const [L, l, h] = pk([[60, 30, 40], [80, 35, 45], [100, 40, 50], [70, 30, 40]]), vide = pk([4, 5, 8]), jug = pk([1.5, 2.5, 2]), mas = pk([15, 18, 22]), lim = pk([100, 120, 150]);
const V = L * l * h, Vl = V / 1000, We = (L * l * (h - vide)) / 1000, trips = Math.ceil(We / jug - 1e-9), tot = r6(We + mas);
return X({ id: "uvol", lv: 3, titre: "L'aquarium",
q: "Un aquarium a la forme d'un pavé de " + Q(L, "cm") + " de long, " + Q(l, "cm") + " de large et " + Q(h, "cm") + " de haut. On le remplit d'eau jusqu'à " + Q(vide, "cm") + " du bord. Vide, il pèse " + Q(mas, "kg") + ". (" + M("1" + u("L")) + " d'eau pèse " + M("1" + u("kg")) + ".)",
parts: [{ label: "Calcule le volume de l'aquarium en cm³, puis sa contenance en litres.", pts: 2 }, { label: "Combien de litres d'eau contient-il ?", pts: 1 }, { label: "On le remplit avec un broc de " + Q(jug, "L") + ". Combien de fois faut-il remplir le broc ?", pts: 1 }, { label: "Le meuble supporte au plus " + lim + " kg. Peut-on y poser l'aquarium plein ? Justifie.", pts: 1 }],
sol: ul([M(L + " \\cdot " + l + " \\cdot " + h + " = " + N(V)) + " cm³ = " + N(Vl) + " dm³ = " + Q(Vl, "L") + ".", "Hauteur d'eau : " + (h - vide) + " cm, donc " + M(L + " \\cdot " + l + " \\cdot " + (h - vide) + " = " + N(We * 1000)) + " cm³ = " + Q(We, "L") + ".", M(N(We) + " : " + N(jug) + " \\approx " + N(Math.round((We / jug) * 100) / 100)) + " : " + trips + " fois.", "Masse : " + M(N(We) + " + " + mas + " = " + N(tot)) + " kg : " + (tot <= lim ? "oui (" + N(tot) + " ≤ " + lim + ")." : "non (" + N(tot) + " > " + lim + ").")]),
chk: [[Math.abs(Vl * 1000 - V) < 1e-9, "conversion"], [trips * jug >= We && (trips - 1) * jug < We, "broc"]], vals: [V, Vl, We, trips, tot] }); },
];
const RAISONU = [
() => { const pool = [
() => { const a = pk([2.5, 3.2, 1.8]); return [N(a) + " m² = " + N(a * 10) + " dm²", false, N(a) + " m² = " + N(r6(a * 100)) + " dm² (1 m² = 100 dm²)"]; },
() => { const a = pk([3.5, 4.2, 1.6]); return [N(a) + " m² = " + N(r6(a * 100)) + " dm²", true, "1 m² = 10 dm · 10 dm = 100 dm²"]; },
() => { const h = pk([1, 2, 3]); return [h + ",5 h = " + h + " h 50 min", false, h + ",5 h = " + h + " h 30 min (0,5 h = la moitié de 60 min)"]; },
() => { const h = pk([0.25, 0.75]); return [N(h) + " h = " + h * 60 + " min", true, M(N(h) + " \\cdot 60 = " + h * 60)]; },
() => { const v = pk([750, 250, 330]); return [v + " cm³ = " + N(v / 100) + " L", false, v + " cm³ = " + N(v / 1000) + " L (1 L = 1 dm³ = 1000 cm³)"]; },
() => { const v = pk([4, 6, 12]); return [v + " L = " + v + " dm³", true, "1 L = 1 dm³"]; },
() => { const k = pk([1, 2, 3]), m = pk([20, 40, 60]); return [k + " km " + m + " m = " + k + "," + m / 10 + " km", false, k + " km " + m + " m = " + N(k + m / 1000) + " km (" + m + " m = " + N(m / 1000) + " km)"]; },
() => { const k = pk([2, 3, 4]), g = pk([50, 75, 5]); return [k + " kg " + g + " g = " + N(k + g / 1000) + " kg", true, g + " g = " + N(g / 1000) + " kg"]; },
];
const L = sh(pool).slice(0, 4).map((f) => f()), wr = L.filter((x) => !x[1]).length, w = who();
return X({ id: "uaire", lv: 2, titre: "Trouve les erreurs",
q: w.n + " a fait ces conversions. Contrôle-les." + tab(["", "conversion"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
parts: [{ label: "Lesquelles sont fausses ?", pts: 2 }, { label: "Corrige-les en expliquant.", pts: 2 }],
sol: ul([wr ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + " (" + wr + " fausse" + (wr > 1 ? "s" : "") + ")." : "Aucune n'est fausse.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste, " : "faux, ") + x[2]).join(" ; ") + "."]),
chk: [[L.length === 4, "4 conversions"]], vals: [] }); },
() => { const h1 = R.int(8, 10), m1 = R.int(35, 55), h2 = h1 + pk([1, 2]), m2 = R.int(5, m1 - 15), d = h2 * 60 + m2 - (h1 * 60 + m1), wr = r6(h2 + m2 / 100 - (h1 + m1 / 100)), w1 = who(), w2 = who(w1.n);
return X({ id: "utemps", lv: 2, titre: "Deux méthodes",
q: "Un film commence à " + h1 + " h " + m1 + " et finit à " + h2 + " h " + (m2 < 10 ? "0" : "") + m2 + ". " + w1.n + " compte : « de " + h1 + " h " + m1 + " à " + (h1 + 1) + " h, puis jusqu'à " + h2 + " h " + (m2 < 10 ? "0" : "") + m2 + " ». " + w2.n + " pose : " + M(N(h2 + m2 / 100) + " - " + N(h1 + m1 / 100) + " = " + N(wr)) + ", donc « " + Math.floor(wr) + " h " + Math.round((wr % 1) * 100) + " min ».",
parts: [{ label: "Termine la méthode de " + w1.n + " et donne la durée du film.", pts: 2 }, { label: "Pourquoi la méthode de " + w2.n + " est-elle fausse ?", pts: 1 }],
sol: ul([(60 - m1) + " min + " + (h2 - h1 - 1) * 60 + " min + " + m2 + " min = " + d + " min = " + dur(d) + ".", "Une heure compte 60 minutes et non 100 : on ne peut pas soustraire des heures et des minutes comme des nombres décimaux."]),
chk: [[d > 0 && Math.round((wr % 1) * 100) !== d % 60, "méthodes différentes"]], vals: [d] }); },
];
RICH.unit9 = { ids: ["ulong", "uaire", "uvol", "utemps"], label: "Unités et mesures (9e)", ex: EXU, raison: RAISONU, minutes: 45 };


const kind = (a) => (a < 90 ? "aigu" : a === 90 ? "droit" : a < 180 ? "obtus" : "plat");
const EXG = [
() => { const a = pk([96, 104, 110, 116, 124, 130]), b = (180 - a) / 2;
const fig = svg(300, 140, pg([[30, 120], [270, 120], [150, 120 - 120 * Math.tan(((b) * Math.PI) / 180)]], "f-shape") + ln(150, 120 - 120 * Math.tan((b * Math.PI) / 180), 150, 120, "f-accent", "stroke-dasharray=\"5 4\"") + tx(150, 120 - 120 * Math.tan((b * Math.PI) / 180) - 6, a + "°", "f-accent f-txt") + tx(56, 114, "?", "f-txt", "middle", 13) + tx(244, 114, "?", "f-txt", "middle", 13), "toit");
return X({ id: "angtri", lv: 1, titre: "Le toit du chalet",
q: "La façade d'un chalet est surmontée d'un toit en forme de triangle isocèle. L'angle au sommet mesure " + M(a + "°") + ". Le chalet a été construit en " + pk([1932, 1956, 1978]) + ".", fig,
parts: [{ label: "Calcule les deux angles à la base du toit. Justifie.", pts: 2 }, { label: "Ce triangle est-il acutangle, rectangle ou obtusangle ?", pts: 1 }, { label: "Une poutre verticale relie le sommet au milieu de la base. Quels angles forme-t-elle avec chaque pan du toit ? Et avec la base ?", pts: 2 }],
sol: ul(["Les angles à la base d'un triangle isocèle sont égaux : " + M("(180° - " + a + "°) : 2 = " + N(b) + "°") + ".", "Obtusangle : l'angle de " + a + "° est obtus. L'année de construction ne sert à rien.", M(a + "° : 2 = " + N(a / 2) + "°") + " avec chaque pan (la poutre est un axe de symétrie) ; " + M("90°") + " avec la base."]),
chk: [[Math.abs(2 * b + a - 180) < 1e-9, "somme"], [b < 45, "base aigu"]], vals: [b, a / 2] }); },
() => { const S = ["carré", "rectangle", "losange", "parallélogramme"], props = ["4 côtés de même longueur", "4 angles droits", "diagonales de même longueur", "diagonales perpendiculaires", "côtés opposés parallèles"], Tb = { carré: [1, 1, 1, 1, 1], rectangle: [0, 1, 1, 0, 1], losange: [1, 0, 0, 1, 1], parallélogramme: [0, 0, 0, 0, 1] };
const RID = [["losange", "Mes diagonales sont perpendiculaires, mais pas de même longueur.", [[3, 1], [2, 0]]], ["rectangle", "Mes diagonales ont la même longueur, mais ne sont pas perpendiculaires.", [[2, 1], [3, 0]]], ["carré", "Mes diagonales sont perpendiculaires et de même longueur.", [[2, 1], [3, 1]]], ["parallélogramme", "Mes côtés opposés sont parallèles, mais mes diagonales ne sont ni de même longueur, ni perpendiculaires.", [[4, 1], [2, 0], [3, 0]]]];
const rr = sh(RID).slice(0, 2), uniq = rr.every(([s, , c]) => S.filter((x) => c.every(([p, v]) => Tb[x][p] === v)).join() === s), P2 = sh([0, 1, 2, 3]).slice(0, 3).sort();
return X({ id: "quadri", lv: 2, titre: "Quel quadrilatère ?",
q: "On compare quatre quadrilatères particuliers : carré, rectangle, losange, parallélogramme.",
parts: [{ label: "Pour chacune de ces propriétés, cite tous les quadrilatères qui l'ont toujours : " + P2.map((p) => "« " + props[p] + " »").join(", ") + ".", pts: 3 }, ...rr.map(([, t]) => ({ label: "Devinette : « " + t + " » Qui suis-je ?", pts: 1 }))],
sol: ul([P2.map((p) => props[p] + " : " + S.filter((x) => Tb[x][p]).join(", ")).join(" ; ") + ".", ...rr.map(([s]) => "Le " + s + ".")]),
chk: [[uniq, "devinettes uniques"]], vals: [] }); },
() => { const a = R.int(68, 95), b = R.int(100, 125), c = R.int(70, 88), d = 360 - a - b - c, p = pk([62, 68, 72, 76]);
return X({ id: "angtri", lv: 2, titre: "Le champ et l'étagère",
q: "Un géomètre mesure trois angles d'un champ en forme de quadrilatère " + M("ABCD") + " : " + M("\\hat{A} = " + a + "°") + ", " + M("\\hat{B} = " + b + "°") + ", " + M("\\hat{C} = " + c + "°") + ". Une étagère déformée a la forme d'un parallélogramme dont un angle mesure " + M(p + "°") + ".",
parts: [{ label: "Calcule l'angle " + M("\\hat{D}") + " du champ.", pts: 1 }, { label: "Quel est le type de chaque angle du champ (aigu, droit, obtus) ?", pts: 1 }, { label: "Calcule les trois autres angles de l'étagère. Justifie.", pts: 2 }],
sol: ul([M("360° - " + a + "° - " + b + "° - " + c + "° = " + d + "°") + " (somme des angles d'un quadrilatère : 360°).", ["A", "B", "C", "D"].map((L, i) => L + " " + kind([a, b, c, d][i])).join(", ") + ".", M(p + "°") + " (angle opposé), " + M(180 - p + "°") + " et " + M(180 - p + "°") + " (deux angles consécutifs d'un parallélogramme sont supplémentaires)."]),
chk: [[d > 0 && d < 180, "angle D"], [a + b + c + d === 360, "somme"]], vals: [d, 180 - p] }); },
() => { const ang = (h, m) => { let x = Math.abs(30 * h + m / 2 - 6 * m); return x > 180 ? 360 - x : x; };
const t1 = pk([2, 4, 5, 7]), t2 = pk([1, 2, 4, 8]), t3 = pk([20, 40]), a1 = ang(t1, 0), a2 = ang(t2, 30), mn = 6 * t3;
return X({ id: "angtype", lv: 3, titre: "Les aiguilles de l'horloge",
q: "La grande aiguille fait un tour (360°) en 60 minutes ; la petite aiguille fait un tour en 12 heures.",
parts: [{ label: "De combien de degrés tourne la grande aiguille en 1 minute ? en " + t3 + " minutes ?", pts: 2 }, { label: "De combien de degrés tourne la petite aiguille en 1 heure ? en 30 minutes ?", pts: 1 }, { label: "Calcule l'angle (le plus petit) entre les aiguilles à " + t1 + " h 00, puis à " + t2 + " h 30. Donne le type de chaque angle.", pts: 3 }, { label: "À quelles heures « pile » les aiguilles forment-elles un angle droit ?", pts: 1 }],
sol: ul([M("360° : 60 = 6°") + " par minute ; " + M(t3 + " \\cdot 6° = " + mn + "°") + ".", M("360° : 12 = 30°") + " par heure ; " + M("15°") + " en 30 minutes.", t1 + " h : " + M(t1 + " \\cdot 30° = " + 30 * t1 + "°") + (30 * t1 > 180 ? ", soit " + M(a1 + "°") + " en tournant de l'autre côté" : "") + " (angle " + kind(a1) + "). " + t2 + " h 30 : la grande aiguille est sur le 6 (180°), la petite à mi-chemin entre " + t2 + " et " + (t2 + 1) + " (" + (30 * t2 + 15) + "°) : " + M(a2 + "°") + " (angle " + kind(a2) + ").", "À 3 h et à 9 h."]),
chk: [[a1 > 0 && a1 < 180 && a2 > 0 && a2 <= 180, "angles"], [ang(3, 0) === 90 && ang(9, 0) === 90, "droit"]], vals: [mn, a1, a2] }); },
];
const RAISONG = [
() => VF({ id: "angtri" }, [
() => ["Un triangle peut avoir deux angles droits.", false, "Deux angles droits font déjà 180° : il ne reste rien pour le troisième angle."],
() => ["Dans un triangle rectangle, les deux autres angles sont aigus.", true, "Ils font ensemble " + M("180° - 90° = 90°") + ", donc chacun est plus petit que 90°."],
() => ["Chaque angle d'un triangle équilatéral mesure 60°.", true, "Les trois angles sont égaux : " + M("180° : 3 = 60°") + "."],
() => { const a = R.int(40, 70), b = R.int(50, 80), c = 180 - a - b + pk([10, -10, 15]); return ["Un triangle peut avoir des angles de " + a + "°, " + b + "° et " + c + "°.", false, M(a + " + " + b + " + " + c + " = " + (a + b + c)) + " ≠ 180."]; },
() => ["Un triangle obtusangle peut aussi être isocèle.", true, "Par exemple avec des angles de 120°, 30° et 30°."],
() => ["Un angle de 180° est un angle obtus.", false, "C'est un angle plat ; un angle obtus est entre 90° et 180°."],
]),
() => { let a, b, c, d, s; do { a = R.int(80, 95); b = R.int(95, 110); c = R.int(85, 100); d = R.int(90, 100); s = a + b + c + d; } while (s === 360 || 360 - a - b - c < 50); const w = who();
return X({ id: "angtri", lv: 2, titre: "Trouve l'erreur",
q: w.n + " a mesuré les quatre angles d'un quadrilatère : " + [a, b, c, d].map((x) => x + "°").join(", ") + ".",
parts: [{ label: "Explique pourquoi ses mesures ne peuvent pas être toutes justes.", pts: 1 }, { label: "Si les trois premières sont justes, que vaut le quatrième angle ?", pts: 1 }],
sol: ul([M(a + " + " + b + " + " + c + " + " + d + " = " + s) + " ≠ 360 : la somme des angles d'un quadrilatère vaut 360°.", M("360° - " + a + "° - " + b + "° - " + c + "° = " + (360 - a - b - c) + "°") + "."]),
chk: [[s !== 360 && 360 - a - b - c > 0, "erreur réelle"]], vals: [s, 360 - a - b - c] }); },
];
RICH.geo9 = { ids: ["angtype", "quadri", "angtri"], label: "Géométrie du plan (9e)", ex: EXG, raison: RAISONG, minutes: 45 };


const EXA = [
() => { let n; do n = R.int(152, 988); while (n % 9 < 2 || n % 9 > 7 || n % 6 < 2 || !(n % 2 === 0 || n % 3 === 0 || n % 5 === 0)); const ds = String(n).split("").map(Number), s = ds.reduce((a, b) => a + b, 0), add9 = 9 - (n % 9);
const yes = [2, 3, 5, 9, 10].filter((k) => n % k === 0);
return X({ id: "divcrit", lv: 1, titre: "Les boîtes d'œufs",
q: "Une ferme a ramassé " + n + " œufs aujourd'hui. Elle a des boîtes de 2, 3, 5, 6, 9 et 10 œufs.",
parts: [{ label: "Sans poser de division, dis si on peut remplir exactement des boîtes de 2, de 3, de 5, de 9, de 10. Justifie avec les critères de divisibilité.", pts: 3 }, { label: "Et avec des boîtes de 6 ? Combien d'œufs reste-t-il ?", pts: 2 }, { label: "Combien d'œufs faudrait-il ajouter, au minimum, pour remplir exactement des boîtes de 9 ?", pts: 1 }],
sol: ul(["Somme des chiffres : " + M(ds.join(" + ") + " = " + s) + ". " + [2, 3, 5, 9, 10].map((k) => k + " : " + (n % k === 0 ? "oui" : "non")).join(" ; ") + " (2 : chiffre des unités pair ; 3 et 9 : somme des chiffres divisible par 3, par 9 ; 5 : se termine par 0 ou 5 ; 10 : se termine par 0).", "Divisible par 6 = divisible par 2 <b>et</b> par 3 : non. " + M(n + " = 6 \\cdot " + Math.floor(n / 6) + " + " + (n % 6)) + " : il reste " + (n % 6) + " œuf" + (n % 6 > 1 ? "s" : "") + ".", M(n + " + " + add9 + " = " + (n + add9) + " = 9 \\cdot " + (n + add9) / 9) + " : il faut ajouter " + add9 + " œuf" + (add9 > 1 ? "s" : "") + "."]),
chk: [[yes.length >= 1, "au moins un oui"], [(n + add9) % 9 === 0, "ajout"]], vals: [s, n % 6, add9, n + add9] }); },
() => { let p, q, g; do { p = R.int(2, 7); q = R.int(2, 7); } while (p === q || g2(p, q) !== 1); g = pk([6, 8, 12, 14, 15, 18]); const a = g * p, b = g * q, divs = []; for (let k = 2; k <= g; k++) if (g % k === 0) divs.push(k);
return X({ id: "arith", lv: 2, titre: "Les bouquets",
q: "Une fleuriste a " + a + " roses et " + b + " tulipes. Elle veut faire des bouquets <b>identiques</b> en utilisant toutes les fleurs.",
parts: [{ label: "Quel est le plus grand nombre de bouquets possible ? Justifie.", pts: 2 }, { label: "Combien de roses et de tulipes contient alors chaque bouquet ?", pts: 1 }, { label: "Donne tous les autres nombres de bouquets possibles (au moins 2 bouquets).", pts: 2 }],
sol: ul(["C'est le PGDC de " + a + " et " + b + " : " + M("\\text{PGDC}(" + a + " ; " + b + ") = " + g) + " bouquets.", M(a + " : " + g + " = " + p) + " roses et " + M(b + " : " + g + " = " + q) + " tulipes.", "Les diviseurs communs : " + divs.join(", ") + " (ce sont les diviseurs de " + g + ")."]),
chk: [[g2(a, b) === g, "pgdc"], [divs.every((d) => a % d === 0 && b % d === 0), "diviseurs"]], vals: [g, p, q] }); },
() => { const C = []; for (const x of [6, 8, 9, 10, 12, 15, 18, 20, 24]) for (const y of [6, 8, 9, 10, 12, 15, 18, 20, 24]) if (x < y && y % x && lcm(x, y) <= 120 && 3600 % lcm(x, y) === 0 && lcm(x, y) !== x * y) C.push([x, y]); const [x, y] = pk(C), m = lcm(x, y), H = R.int(19, 22);
return X({ id: "arith", lv: 2, titre: "Les deux phares",
q: "Le phare A s'allume toutes les " + x + " secondes, le phare B toutes les " + y + " secondes. À " + H + " h 00 min 00 s, ils s'allument ensemble.",
parts: [{ label: "Écris les premiers multiples de " + x + " et de " + y + ". Après combien de secondes s'allumeront-ils de nouveau ensemble ?", pts: 2 }, { label: "Lina dit : « il suffit de multiplier " + x + " par " + y + " ». A-t-elle raison ?", pts: 1 }, { label: "Combien de fois s'allument-ils ensemble entre " + H + " h 00 (exclu) et " + (H + 1) + " h 00 (inclus) ?", pts: 1 }],
sol: ul(["Multiples de " + x + " : " + [1, 2, 3, 4, 5, 6].map((k) => k * x).join(", ") + "… ; de " + y + " : " + [1, 2, 3, 4].map((k) => k * y).join(", ") + "… Le premier commun : " + M("\\text{PPMC}(" + x + " ; " + y + ") = " + m) + " s.", "Non : " + M(x + " \\cdot " + y + " = " + x * y) + " est un multiple commun, mais pas le plus petit (" + m + ").", M("3600 : " + m + " = " + 3600 / m) + " fois."]),
chk: [[m % x === 0 && m % y === 0 && m < x * y, "ppmc"]], vals: [m, 3600 / m] }); },
() => { let p, q; do { p = R.int(5, 13); q = R.int(3, 11); } while (p <= q || g2(p, q) !== 1); const g = pk([12, 18, 20, 24, 30]), L = g * p, l = g * q;
const fac = (n) => { const o = []; let k = 2; while (n > 1) { let e = 0; while (n % k === 0) { n /= k; e++; } if (e) o.push(e > 1 ? k + "^" + e : String(k)); k++; } return o.join(" \\cdot "); };
return X({ id: "premiers", lv: 3, titre: "Le carrelage",
q: "Une salle de bain rectangulaire mesure " + Q(L, "cm") + " sur " + Q(l, "cm") + ". On veut la carreler avec des carreaux carrés tous identiques, les plus grands possible, sans les couper (côté : un nombre entier de cm).",
parts: [{ label: "Décompose " + L + " et " + l + " en produits de facteurs premiers.", pts: 2 }, { label: "Quel est le côté des carreaux ? Justifie.", pts: 1 }, { label: "Combien de carreaux faut-il ?", pts: 2 }],
sol: ul([M(L + " = " + fac(L)) + " et " + M(l + " = " + fac(l)) + ".", "Le côté doit diviser " + L + " et " + l + ", et être le plus grand : " + M("\\text{PGDC} = " + fac(g) + " = " + g) + " cm.", M((L / g) + " \\cdot " + (l / g) + " = " + p * q) + " carreaux (" + p + " dans la longueur, " + q + " dans la largeur)."]),
chk: [[g2(L, l) === g, "pgdc"]], vals: [g, p * q] }); },
];
const RAISONA = [
() => VF({ id: "premiers" }, [
() => ["51 est un nombre premier.", false, M("51 = 3 \\cdot 17") + " (somme des chiffres 6, divisible par 3)."],
() => ["91 est un nombre premier.", false, M("91 = 7 \\cdot 13") + "."],
() => ["Un nombre divisible par 4 et par 6 est toujours divisible par 24.", false, "Contre-exemple : 12 est divisible par 4 et par 6, mais pas par 24."],
() => { const n = 9 * R.int(13, 60); return ["Un nombre divisible par 9 est aussi divisible par 3.", true, "Car 9 = 3 · 3. Exemple : " + M(n + " = 9 \\cdot " + n / 9 + " = 3 \\cdot " + n / 3) + "."]; },
() => ["La somme de deux nombres premiers est toujours paire.", false, "Contre-exemple : " + M("2 + 3 = 5") + "."],
() => ["2 est le seul nombre premier pair.", true, "Tout autre nombre pair est divisible par 2, donc a au moins trois diviseurs (1, 2 et lui-même)."],
]),
() => { const p = pk([5, 7, 11]), n = 12 * p, w = who();
return X({ id: "premiers", lv: 2, titre: "Trouve l'erreur",
q: w.n + " décompose " + n + " : " + M(n + " = 4 \\cdot " + 3 * p + " = 2 \\cdot 2 \\cdot " + 3 * p) + ", donc " + M(n + " = 2^2 \\cdot " + 3 * p) + ".",
parts: [{ label: "Le calcul est-il juste ? La décomposition est-elle terminée ? Explique.", pts: 1 }, { label: "Écris la bonne décomposition en facteurs premiers.", pts: 1 }],
sol: ul(["Le calcul est juste, mais " + 3 * p + " n'est pas premier (" + M(3 * p + " = 3 \\cdot " + p) + ") : la décomposition n'est pas finie.", M(n + " = 2^2 \\cdot 3 \\cdot " + p) + "."]),
chk: [[4 * 3 * p === n, "calcul"]], vals: [n] }); },
];
RICH.arith9 = { ids: ["multdiv", "divcrit", "premiers", "arith"], label: "Arithmétique (9e)", ex: EXA, raison: RAISONA, minutes: 45 };


const EXP = [
() => { const L = pk([18, 22, 25, 16.5]), l = pk([9, 12, 14.5]), por = pk([1.2, 1.5]), px = pk([8.5, 12, 14.5]), gr = pk([30, 35, 40]), w = who();
const P = r6(2 * (L + l)), cl = r6(P - por), cost = r6(cl * px), Ar = r6(L * l), g = r6(Ar * gr);
return X({ id: "perim", lv: 1, titre: "Le jardin",
q: "Le jardin de " + w.n + " est un rectangle de " + Q(L, "m") + " sur " + Q(l, "m") + ", à " + Q(5, "m") + " de la maison. On veut le clôturer avec du grillage, en laissant un portail de " + Q(por, "m") + ", puis y semer du gazon.",
parts: [{ label: "Calcule le périmètre du jardin.", pts: 1 }, { label: "Quelle longueur de grillage faut-il ? Combien coûte-t-il à " + chf(px) + " le mètre ?", pts: 2 }, { label: "Calcule l'aire du jardin.", pts: 1 }, { label: "Il faut " + gr + " g de graines par m². Quelle masse de graines faut-il, en kg ?", pts: 1 }],
sol: ul([M("2 \\cdot (" + N(L) + " + " + N(l) + ") = " + N(P)) + " m.", M(N(P) + " - " + N(por) + " = " + N(cl)) + " m ; " + M(N(cl) + " \\cdot " + N(px) + " = " + Nk(cost, 2)) + " CHF. La distance à la maison ne sert à rien.", M(N(L) + " \\cdot " + N(l) + " = " + N(Ar)) + " m².", M(N(Ar) + " \\cdot " + gr + " = " + N(g)) + " g = " + Q(g / 1000, "kg") + "."]),
chk: [[P > cl, "portail"], [Math.abs(g - L * l * gr) < 1e-6, "graines"]], vals: [P, cl, cost, Ar, g / 1000] }); },
() => { let D, d, b, h; do { D = pk([60, 72, 80, 90]); d = pk([40, 48, 50, 54]); b = pk([45, 50, 55]); h = pk([28, 32, 36]); } while (Math.abs((D * d) / 2 - b * h) < 20); const s = Math.round(Math.sqrt((D / 2) ** 2 + (d / 2) ** 2) * 10) / 10, AL = (D * d) / 2, AP = b * h;
return X({ id: "aire2", lv: 2, titre: "Cerf-volant et fanion",
q: "Un cerf-volant a la forme d'un losange dont les diagonales mesurent " + Q(D, "cm") + " et " + Q(d, "cm") + " ; chaque côté mesure environ " + Q(s, "cm") + ". Un fanion a la forme d'un parallélogramme de base " + Q(b, "cm") + " et de hauteur " + Q(h, "cm") + ".",
parts: [{ label: "Calcule l'aire du cerf-volant. Explique la formule (pense au rectangle qui l'entoure).", pts: 2 }, { label: "On coud un ruban tout autour du cerf-volant. Quelle longueur de ruban faut-il ?", pts: 1 }, { label: "Calcule l'aire du fanion.", pts: 1 }, { label: "Lequel demande le plus de tissu ? Combien de cm² de plus ?", pts: 1 }],
sol: ul([M("A = \\frac{D \\cdot d}{2} = \\frac{" + D + " \\cdot " + d + "}{2} = " + N(AL)) + " cm² : le losange occupe la moitié du rectangle de " + D + " cm sur " + d + " cm.", M("4 \\cdot " + N(s) + " = " + N(r6(4 * s))) + " cm.", M(b + " \\cdot " + h + " = " + AP) + " cm² (base · hauteur, pas base · côté).", (AL > AP ? "Le cerf-volant" : "Le fanion") + ", de " + M(Math.abs(AL - AP)) + " cm²."]),
chk: [[AL !== AP, "différents"]], vals: [AL, 4 * s, AP, Math.abs(AL - AP)] }); },
() => { const Wd = pk([10, 12, 11]), H = pk([8, 9, 7]), w = pk([4, 5, 3.5]), h = pk([3, 2.5, 4]), px = pk([45, 52, 60]);
const A = r6(Wd * H - w * h), P = r6(2 * (Wd + H)), sc = Math.min(230 / Wd, 170 / H), x0 = 45, y0 = 22, Pp = (x, y) => [x0 + x * sc, y0 + y * sc];
const fig = svg(320, 230, pg([[0, 0], [Wd - w, 0], [Wd - w, h], [Wd, h], [Wd, H], [0, H]].map(([x, y]) => Pp(x, y))) + tx(x0 + (Wd * sc) / 2, y0 + H * sc + 18, Wd + " m") + tx(x0 - 6, y0 + (H * sc) / 2, H + " m", "f-txt", "end") + tx(x0 + ((Wd - w) * sc) / 2, y0 - 6, fmt(Wd - w) + " m") + tx(x0 + (Wd - w) * sc + 6, y0 + (h * sc) / 2 + 4, fmt(h) + " m", "f-txt", "start") + tx(x0 + (Wd - w / 2) * sc, y0 + h * sc - 6, "?", "f-accent f-txt") + tx(x0 + Wd * sc + 6, y0 + ((h + H) / 2) * sc, "?", "f-accent f-txt", "start"), "plan");
return X({ id: "aire3", lv: 2, titre: "Le plan de l'appartement",
q: "Voici le plan (en forme de L) d'un appartement. Toutes les cotes ne sont pas indiquées.", fig,
parts: [{ label: "Trouve les deux longueurs qui manquent sur le plan.", pts: 2 }, { label: "Calcule le périmètre de l'appartement (longueur de plinthes, sans tenir compte des portes).", pts: 1 }, { label: "Calcule l'aire de deux façons différentes (découpage ou rectangle moins le coin manquant).", pts: 2 }, { label: "Le sol coûte " + chf(px) + " le m². Quel est le prix total ?", pts: 1 }],
sol: ul(["Côté droit du haut vers le bas : " + M(H + " - " + N(h) + " = " + N(r6(H - h))) + " m ; marche horizontale : " + M(Wd + " - " + N(Wd - w) + " = " + N(w)) + " m.", "Comme pour le grand rectangle : " + M("2 \\cdot (" + Wd + " + " + H + ") = " + N(P)) + " m (les deux décrochements se compensent).", M(Wd + " \\cdot " + H + " - " + N(w) + " \\cdot " + N(h) + " = " + N(A)) + " m², ou " + M(N(Wd - w) + " \\cdot " + N(h) + " + " + Wd + " \\cdot " + N(r6(H - h)) + " = " + N(A)) + " m².", M(N(A) + " \\cdot " + px + " = " + Nk(A * px, 2)) + " CHF."]),
chk: [[Math.abs((Wd - w) * h + Wd * (H - h) - A) < 1e-9, "deux découpages"]], vals: [r6(H - h), w, P, A, A * px] }); },
() => { const P = pk([36, 40, 44, 48]), half = P / 2, Ls = [half - 2, half - 5, half - 8].map((x) => x), sq = half / 2, Ar = pk([96, 120, 84]), x = pk([8, 12, 6].filter((v) => Ar % v === 0 && v * v !== Ar)), y = Ar / x;
return X({ id: "aire1", lv: 3, titre: "Même clôture, aires différentes",
q: "On dispose de " + Q(P, "m") + " de clôture pour faire un enclos rectangulaire pour des moutons.",
parts: [{ label: "Calcule l'aire de l'enclos si sa longueur mesure " + Ls.map((L) => L + " m").join(", puis ") + ".", pts: 3 }, { label: "Quelle forme donne la plus grande aire ? Calcule cette aire.", pts: 1 }, { label: "Un autre enclos rectangulaire a une aire de " + Ar + " m² et une largeur de " + x + " m. Calcule sa longueur et son périmètre.", pts: 2 }],
sol: ul([Ls.map((L) => "longueur " + L + ", largeur " + M(half + " - " + L + " = " + (half - L)) + " : " + M(L + " \\cdot " + (half - L) + " = " + L * (half - L)) + " m²").join(" ; ") + " (longueur + largeur = " + half + " m).", "Le carré de côté " + M(P + " : 4 = " + N(sq)) + " m : " + M(N(sq) + "^2 = " + N(sq * sq)) + " m², plus que toutes les autres.", "Longueur : " + M(Ar + " : " + x + " = " + y) + " m ; périmètre : " + M("2 \\cdot (" + x + " + " + y + ") = " + 2 * (x + y)) + " m."]),
chk: [[Ls.every((L) => L * (half - L) < sq * sq), "carré max"], [x * y === Ar, "inverse"]], vals: [...Ls.map((L) => L * (half - L)), sq * sq, y, 2 * (x + y)] }); },
];
const RAISONP = [
() => VF({ id: "aire1" }, [
() => { const a = R.int(3, 8), b = R.int(9, 14); return ["Si on double la longueur et la largeur d'un rectangle, son aire double.", false, "Elle est multipliée par 4 : " + M(a + " \\cdot " + b + " = " + a * b) + " et " + M(2 * a + " \\cdot " + 2 * b + " = " + 4 * a * b) + "."]; },
() => { const a = R.int(3, 8), b = R.int(9, 14); return ["Si on double la longueur et la largeur d'un rectangle, son périmètre double.", true, M("2 \\cdot (" + 2 * a + " + " + 2 * b + ") = " + 4 * (a + b) + " = 2 \\cdot " + 2 * (a + b)) + "."]; },
() => ["Deux rectangles de même aire ont le même périmètre.", false, "4 × 9 et 6 × 6 ont une aire de 36, mais des périmètres de 26 et 24."],
() => ["Un carré de 4 cm de côté a un périmètre égal à son aire.", false, "16 cm et 16 cm² ne se comparent pas : une longueur et une aire ne sont pas des grandeurs de même nature."],
() => ["L'aire d'un triangle est la moitié de celle du rectangle qui a la même base et la même hauteur.", true, M("A = \\frac{b \\cdot h}{2}") + " ; on le voit en découpant le rectangle."],
]),
() => { const b = pk([8, 10, 12]), s = pk([7, 9, 11]), h = s - pk([1, 2]), w = who(), wrong = (b * s) / 2, right = (b * h) / 2;
const fig = svg(300, 150, pg([[40, 130], [260, 130], [100, 30]], "f-shape") + ln(100, 30, 100, 130, "f-accent", "stroke-dasharray=\"5 4\"") + tx(150, 146, b + " cm") + tx(62, 74, s + " cm", "f-txt", "end") + tx(106, 90, h + " cm", "f-accent f-txt", "start"), "triangle");
return X({ id: "aire1", lv: 2, titre: "Trouve l'erreur",
q: w.n + " calcule l'aire de ce triangle : " + M("A = \\frac{" + b + " \\cdot " + s + "}{2} = " + N(wrong)) + " cm².", fig,
parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "Calcule l'aire correcte.", pts: 1 }],
sol: ul([w.Il + " a utilisé le côté oblique (" + s + " cm) au lieu de la hauteur, perpendiculaire à la base (" + h + " cm).", M("A = \\frac{" + b + " \\cdot " + h + "}{2} = " + N(right)) + " cm²."]),
chk: [[wrong !== right, "différent"]], vals: [right] }); },
];
RICH.aire9 = { ids: ["perim", "aire1", "aire2", "aire3"], label: "Aires et périmètres (9e)", ex: EXP, raison: RAISONP, minutes: 45 };


const sg = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
const EXR = [
() => { const C = sh(["Genève", "Oslo", "Moscou", "Montréal", "Rome", "Reykjavik"]).slice(0, 5), t = sh([-12, -7, -3, 2, 5, -9, 8, -1.5, 4.5]).slice(0, 5), up = pk([6, 7, 9]);
while (!t.some((v) => v < 0) || !t.some((v) => v > 0)) t[0] = -t[0];
let up2 = up; while (t.some((v) => r6(v + up2) === 0)) up2++;
const srt = t.slice().sort((a, b) => a - b), ec = r6(srt[4] - srt[0]), nt = t.map((v) => r6(v + up2)), neg = nt.filter((v) => v < 0).length;
return X({ id: "relrep", lv: 1, titre: "Les températures du matin",
q: "Températures relevées à 6 h dans cinq villes :" + tab(["ville", "température (°C)"], C.map((c, i) => [c, T(t[i])])),
parts: [{ label: "Range ces températures dans l'ordre croissant.", pts: 1 }, { label: "Quel est l'écart entre la ville la plus chaude et la plus froide ?", pts: 1 }, { label: "À 14 h, la température a augmenté de " + up2 + " °C partout. Donne les nouvelles températures.", pts: 2 }, { label: "Dans combien de villes fait-il encore moins de 0 °C ?", pts: 1 }],
sol: ul([M(srt.map(N).join(" < ")) + ".", M(N(srt[4]) + " - " + sg(srt[0]) + " = " + N(ec)) + " °C.", C.map((c, i) => c + " : " + M(N(t[i]) + " + " + up2 + " = " + N(nt[i]))).join(" ; ") + ".", neg ? neg + " ville" + (neg > 1 ? "s" : "") + "." : "Aucune."]),
chk: [[ec > 0, "écart"], [t.some((v) => v < 0), "négatifs"]], vals: [ec] }); },
() => { let s, m, f; do { s = pk([2, 3, -2, 4]); m = [pk([3, 4, 5]), -pk([6, 7, 8]), pk([2, 3]), -pk([2, 4])]; f = s + m.reduce((a, b) => a + b, 0); } while (f < -4 || f > 8 || Math.abs(f) < 2); const g = pk([-3, -2]), k = pk([5, 6, 7]);
return X({ id: "reladd", lv: 2, titre: "L'ascenseur",
q: "Un immeuble a des étages de −4 (parking) à +8. Le rez-de-chaussée est l'étage 0. Le concierge part de l'étage " + N(s) + " et fait ces déplacements : " + m.map((x) => (x > 0 ? "monter de " + x : "descendre de " + -x)).join(", ") + " étages.",
parts: [{ label: "Écris un calcul avec des nombres relatifs et trouve l'étage d'arrivée.", pts: 2 }, { label: "Combien d'étages y a-t-il entre l'étage " + N(g) + " et l'étage +" + k + " ?", pts: 1 }, { label: "Une habitante descend de " + k + " étages et arrive à l'étage " + N(g) + ". De quel étage est-elle partie ?", pts: 2 }],
sol: ul([M(sg(s) + " + " + m.map(sg).join(" + ") + " = " + N(f)) + " : étage " + N(f) + ".", M(k + " - (" + N(g) + ") = " + (k - g)) + " étages.", M(N(g) + " + " + k + " = " + (g + k)) + " : étage " + N(g + k) + " (on remonte de " + k + ")."]),
chk: [[f >= -4 && f <= 8 && f !== 0, "étage valide"], [g + k - k === g, "inverse"]], vals: [f, k - g, g + k] }); },
() => { const s0 = pk([240, 185, 320]), ops = [["argent de poche", pk([60, 80])], ["sortie cinéma", -pk([25, 32])], ["jeu vidéo", -pk([59, 79, 69])], ["baby-sitting", pk([45, 60])], ["cadeau d'anniversaire", -pk([35, 48])]], miss = R.int(1, 4), fin = s0 + ops.reduce((a, o) => a + o[1], 0), w = who();
const rows = ops.map((o, i) => [o[0], i === miss ? "?" : (o[1] > 0 ? "+" : "") + o[1]]);
return X({ id: "reladd", lv: 2, titre: "Le compte de " + w.n,
q: w.n + " note ses opérations du mois (en CHF). Au début du mois, " + w.il + " avait " + s0 + " CHF ; à la fin, " + fin + " CHF." + tab(["opération", "montant (CHF)"], rows),
parts: [{ label: "Calcule la somme des montants connus.", pts: 1 }, { label: "Trouve le montant qui manque (avec son signe). Explique.", pts: 2 }, { label: "Si " + w.n + " avait acheté le jeu vidéo deux fois (erreur de la banque), combien aurait-" + w.il + " à la fin du mois ?", pts: 1 }],
sol: ul([M(ops.filter((o, i) => i !== miss).map((o) => sg(o[1])).join(" + ") + " = " + (fin - s0 - ops[miss][1])) + ".", "Variation totale : " + M(fin + " - " + s0 + " = " + (fin - s0)) + ". Montant manquant : " + M((fin - s0) + " - " + sg(fin - s0 - ops[miss][1]) + " = " + (ops[miss][1] > 0 ? "+" : "") + ops[miss][1]) + " (" + ops[miss][0] + ").", M(fin + " + " + sg(ops[2][1]) + " = " + (fin + ops[2][1])) + " CHF."]),
chk: [[s0 + ops.reduce((a, o) => a + o[1], 0) === fin, "solde"], [fin > 0, "positif"]], vals: [ops[miss][1], fin + ops[2][1]] }); },
() => { let b, l2, l3, top; do { b = [pk([-5, -3, 4, 6]), pk([-7, -2, 3, 5]), pk([-6, 2, -4, 8]), pk([3, -8, -5, 7])]; l2 = [b[0] + b[1], b[1] + b[2], b[2] + b[3]]; l3 = [l2[0] + l2[1], l2[1] + l2[2]]; top = l3[0] + l3[1]; } while ([...l2, ...l3, top].some((v) => Math.abs(v) < 2));
const box = (x, y, s, hi) => "<rect x=\"" + x + "\" y=\"" + y + "\" width=\"60\" height=\"30\" class=\"" + (hi ? "f-fill2" : "f-shape2") + "\"/>" + tx(x + 30, y + 20, s, hi ? "f-accent f-txt" : "f-txt", "middle", 14);
const fig = svg(300, 140, box(30, 100, b[0]) + box(90, 100, "?", 1) + box(150, 100, b[2]) + box(210, 100, b[3]) + box(60, 68, "") + box(120, 68, l2[1]) + box(180, 68, "") + box(90, 36, "") + box(150, 36, "") + box(120, 4, ""), "pyramide");
return X({ id: "reladd", lv: 3, titre: "La pyramide de nombres",
q: "Dans cette pyramide, chaque brique contient la somme des deux briques sur lesquelles elle repose. Une brique du bas est cachée.", fig,
parts: [{ label: "Trouve le nombre caché. Explique.", pts: 1 }, { label: "Complète toute la pyramide.", pts: 2 }, { label: "Si on augmente de 2 la brique en bas à gauche, de combien augmente le sommet ? Et si on augmente de 2 la brique cachée ?", pts: 2 }],
sol: ul([M("? + " + sg(b[2]) + " = " + N(l2[1])) + ", donc " + M("? = " + N(l2[1]) + " - " + sg(b[2]) + " = " + N(b[1])) + ".", "Deuxième rangée : " + l2.map(N).join(" ; ") + ". Troisième : " + l3.map(N).join(" ; ") + ". Sommet : " + M(N(l3[0]) + " + " + sg(l3[1]) + " = " + N(top)) + ".", "La brique de gauche ne compte qu'une fois dans le sommet : +2. La brique cachée compte 3 fois (elle « monte » par trois chemins) : +6."]),
chk: [[top === b[0] + 3 * b[1] + 3 * b[2] + b[3], "sommet"], [b[1] !== 0, "caché"]], vals: [b[1], top] }); },
];
const RAISONR = [
() => { const a = R.int(5, 9), c = R.int(2, a - 2), w = who();
return X({ id: "reladd", lv: 2, titre: "Trouve l'erreur",
q: w.n + " écrit : " + M("(-" + a + ") - (-" + c + ") = -" + (a + c)) + " et " + M("(-" + c + ") - " + a + " = " + (a - c)) + ".",
parts: [{ label: "Explique les erreurs (tu peux t'aider d'une droite graduée ou d'un thermomètre).", pts: 2 }, { label: "Écris les bons résultats.", pts: 1 }],
sol: ul(["Soustraire un nombre, c'est additionner son opposé : " + M("(-" + a + ") - (-" + c + ") = (-" + a + ") + " + c) + ". Et " + M("(-" + c + ") - " + a) + " : on part de " + -c + " et on descend encore de " + a + ".", M("(-" + a + ") - (-" + c + ") = " + (c - a)) + " et " + M("(-" + c + ") - " + a + " = " + (-c - a)) + "."]),
chk: [[c - a !== -(a + c), "erreur"]], vals: [c - a, -c - a] }); },
() => VF({ id: "relrep" }, [
() => { const a = R.int(2, 9), b = R.int(2, 9); return ["La somme de deux nombres négatifs est négative.", true, "Exemple : " + M("(-" + a + ") + (-" + b + ") = -" + (a + b)) + " : on descend deux fois."]; },
() => { const a = R.int(2, 4), b = R.int(5, 9); return ["La différence de deux nombres négatifs est toujours négative.", false, "Contre-exemple : " + M("(-" + a + ") - (-" + b + ") = " + (b - a)) + "."]; },
() => { const a = R.int(6, 12), b = R.int(2, 5); return [M("-" + a + " > -" + b) + " car " + a + " > " + b + ".", false, M("-" + a) + " est plus loin à gauche de 0 : " + M("-" + a + " < -" + b) + "."]; },
() => ["L'opposé d'un nombre est toujours négatif.", false, "L'opposé de −5 est 5, qui est positif."],
() => { const a = R.int(3, 9); return ["Entre −" + a + " et " + a + ", il y a " + (2 * a - 1) + " nombres entiers.", true, "De −" + (a - 1) + " à " + (a - 1) + " : " + (a - 1) + " négatifs, 0 et " + (a - 1) + " positifs, soit " + (2 * a - 1) + "."]; },
]),
];
RICH.rel9 = { ids: ["relrep", "reladd"], label: "Nombres relatifs (9e)", ex: EXR, raison: RAISONR, minutes: 45 };


const PNAME = { 3: "triangle", 4: "quadrilatère", 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone", 10: "décagone" };
const EXS = [
() => { const n = pk([5, 6, 7, 8]), m = pk([5, 6, 7, 9, 10].filter((x) => x !== n)), Fp = n + 2, Ap = 3 * n, Sp = 2 * n, Fy = n + 1, Ay = 2 * n, Sy = n + 1;
return X({ id: "solides", lv: 1, titre: "Prisme et pyramide",
q: "On considère un prisme droit et une pyramide qui ont tous deux pour base un " + PNAME[n] + " (" + n + " côtés).",
parts: [{ label: "Combien de faces, d'arêtes et de sommets a le prisme ? Explique ton comptage.", pts: 2 }, { label: "Même question pour la pyramide.", pts: 2 }, { label: "Vérifie pour les deux solides : faces + sommets − arêtes = 2.", pts: 1 }, { label: "Un prisme a " + 3 * m + " arêtes. Quelle est la forme de sa base ?", pts: 1 }],
sol: ul(["Faces : 2 bases + " + n + " rectangles = " + Fp + " ; arêtes : " + n + " en haut, " + n + " en bas, " + n + " verticales = " + Ap + " ; sommets : " + Sp + ".", "Faces : 1 base + " + n + " triangles = " + Fy + " ; arêtes : " + n + " + " + n + " = " + Ay + " ; sommets : " + n + " + 1 = " + Sy + ".", M(Fp + " + " + Sp + " - " + Ap + " = 2") + " et " + M(Fy + " + " + Sy + " - " + Ay + " = 2") + " (relation d'Euler).", M(3 * m + " : 3 = " + m) + " côtés : un " + PNAME[m] + "."]),
chk: [[Fp + Sp - Ap === 2 && Fy + Sy - Ay === 2, "Euler"]], vals: [Fp, Ap, Sp, Fy, Ay, Sy, m] }); },
() => { const L = pk([32, 30, 34]), l = pk([18, 20, 19]), h = pk([11, 12, 13]), V = L * l * h, Ac = L * l + 2 * (L * h + l * h), w = who();
return X({ id: "volpave", lv: 2, titre: "La boîte à chaussures",
q: "Une boîte à chaussures (sans couvercle) est un pavé de " + Q(L, "cm") + " de long, " + Q(l, "cm") + " de large et " + Q(h, "cm") + " de haut. Les chaussures de " + w.n + " sont en pointure " + pk([38, 41, 43]) + ".",
parts: [{ label: "Calcule le volume de la boîte en cm³, puis en dm³.", pts: 2 }, { label: "Calcule l'aire du carton nécessaire (5 faces, sans couvercle).", pts: 2 }, { label: "Le couvercle déborde de 1 cm de chaque côté (sans les bords). Quelle est son aire ?", pts: 1 }],
sol: ul([M(L + " \\cdot " + l + " \\cdot " + h + " = " + N(V)) + " cm³ = " + Q(V / 1000, "dm^3") + ".", "Fond " + M(L + " \\cdot " + l + " = " + L * l) + ", deux grands côtés " + M("2 \\cdot " + L + " \\cdot " + h + " = " + 2 * L * h) + ", deux petits " + M("2 \\cdot " + l + " \\cdot " + h + " = " + 2 * l * h) + " : " + Q(Ac, "cm^2") + ". La pointure ne sert à rien.", M((L + 2) + " \\cdot " + (l + 2) + " = " + (L + 2) * (l + 2)) + " cm²."]),
chk: [[Ac === L * l + 2 * L * h + 2 * l * h, "aire"]], vals: [V, V / 1000, Ac, (L + 2) * (l + 2)] }); },
() => { let L, l, d, deb, V, Vl, min; do { L = pk([4, 5, 6]); l = pk([2.5, 3]); d = pk([0.4, 0.5, 0.6, 0.75]); deb = pk([20, 25, 40, 50]); V = r6(L * l * d); Vl = r6(V * 1000); min = Vl / deb; } while (!Number.isInteger(min) || min < 90);
return X({ id: "volpave", lv: 2, titre: "Le bassin du jardin",
q: "Un bassin a la forme d'un pavé : le fond est un rectangle de " + Q(L, "m") + " sur " + Q(l, "m") + ". Il contient " + Q(V, "m^3") + " d'eau.",
parts: [{ label: "Quelle est la hauteur de l'eau ? Donne-la en m et en cm.", pts: 2 }, { label: "Combien de litres d'eau y a-t-il ?", pts: 1 }, { label: "On le remplit avec un tuyau qui débite " + deb + " L par minute. Combien de temps faut-il (en h et min) ?", pts: 2 }],
sol: ul([M("V = L \\cdot l \\cdot h") + ", donc " + M("h = " + N(V) + " : (" + L + " \\cdot " + N(l) + ") = " + N(V) + " : " + N(L * l) + " = " + N(d)) + " m = " + Q(d * 100, "cm") + ".", M("1" + u("m^3") + " = 1000" + u("L")) + " : " + Q(Vl, "L") + ".", M(N(Vl) + " : " + deb + " = " + N(min)) + " min = " + dur(min) + "."]),
chk: [[Math.abs(L * l * d - V) < 1e-9, "hauteur"], [Number.isInteger(min), "minutes entières"]], vals: [d, d * 100, Vl, min] }); },
() => { const [a, b, c] = sh([3, 4, 5, 6, 7]).slice(0, 3), n = a * b * c, in0 = (a - 2) * (b - 2) * (c - 2), Ap = 2 * (a * b + b * c + a * c), two = 4 * ((a - 2) + (b - 2) + (c - 2));
return X({ id: "volpave", lv: 3, titre: "Les petits cubes peints",
q: "On assemble des petits cubes de 1 cm d'arête pour former un pavé de " + a + " cm × " + b + " cm × " + c + " cm. Puis on peint tout l'extérieur du pavé en rouge.",
parts: [{ label: "Combien de petits cubes faut-il ? Quel est le volume du pavé ?", pts: 1 }, { label: "Quelle est l'aire de la surface peinte ?", pts: 1 }, { label: "Combien de petits cubes ont 3 faces peintes ? (Pense aux coins.)", pts: 1 }, { label: "Combien de petits cubes n'ont <b>aucune</b> face peinte ? Explique.", pts: 2 }],
sol: ul([M(a + " \\cdot " + b + " \\cdot " + c + " = " + n) + " cubes ; volume " + Q(n, "cm^3") + ".", M("2 \\cdot (" + a + " \\cdot " + b + " + " + b + " \\cdot " + c + " + " + a + " \\cdot " + c + ") = " + Ap) + " cm².", "Les 8 cubes des sommets.", "Ce sont ceux de l'intérieur : un pavé de " + M((a - 2) + " \\cdot " + (b - 2) + " \\cdot " + (c - 2) + " = " + in0) + " cubes (on enlève une couche de chaque côté). Les cubes à 2 faces peintes, sur les arêtes, sont " + two + "."]),
chk: [[n === in0 + 8 + two + 2 * ((a - 2) * (b - 2) + (b - 2) * (c - 2) + (a - 2) * (c - 2)), "dénombrement"]], vals: [n, Ap, in0] }); },
];
const RAISONS = [
() => VF({ id: "volpave" }, [
() => { const a = pk([2, 3]); return ["Si on double l'arête d'un cube, son volume double.", false, "Il est multiplié par 8 : " + M(a + "^3 = " + a ** 3) + " et " + M(2 * a + "^3 = " + 8 * a ** 3) + "."]; },
() => ["Deux pavés de même volume ont la même aire.", false, "1 × 1 × 8 et 2 × 2 × 2 ont un volume de 8 cm³, mais des aires de 34 cm² et 24 cm²."],
() => ["Un cube est un pavé particulier.", true, "C'est un pavé dont les trois dimensions sont égales."],
() => ["Un pavé a 6 faces, 12 arêtes et 8 sommets.", true, "6 + 8 − 12 = 2 (relation d'Euler)."],
() => { const n = pk([5, 6, 8]); return ["Une pyramide à base " + PNAME[n] + " a " + 2 * n + " faces.", false, "Elle a " + n + " faces triangulaires + 1 base = " + (n + 1) + " faces (" + 2 * n + ", ce sont ses arêtes)."]; },
]),
() => { const a = pk([4, 5, 6, 7]), w = who();
return X({ id: "volpave", lv: 2, titre: "Trouve l'erreur",
q: w.n + " calcule le volume d'un cube de " + Q(a, "cm") + " d'arête : " + M(a + " \\cdot 3 = " + 3 * a) + " cm³. Puis son aire : " + M(a + " \\cdot " + a + " = " + a * a) + " cm².",
parts: [{ label: "Quelles sont ses deux erreurs ?", pts: 2 }, { label: "Calcule le volume et l'aire du cube.", pts: 1 }],
sol: ul(["Le volume est " + M(a + "^3 = " + a + " \\cdot " + a + " \\cdot " + a) + " (pas " + a + " · 3) ; l'aire du cube compte ses 6 faces (" + a * a + " cm², c'est l'aire d'une seule face).", "Volume " + M(a + "^3 = " + a ** 3) + " cm³ ; aire " + M("6 \\cdot " + a * a + " = " + 6 * a * a) + " cm²."]),
chk: [[a ** 3 !== 3 * a, "erreur"]], vals: [a ** 3, 6 * a * a] }); },
];
RICH.sol9 = { ids: ["solides", "volpave"], label: "Solides et volumes (9e)", ex: EXS, raison: RAISONS, minutes: 45 };



const perDec = (n, d) => { const ip = Math.floor(n / d); let r = n % d, s = "", seen = {}; while (r && seen[r] === undefined) { seen[r] = s.length; r *= 10; s += Math.floor(r / d); r %= d; } return r ? ip + "{,}" + s.slice(0, seen[r]) + "\\overline{" + s.slice(seen[r]) + "}" : ip + (s ? "{,}" + s : ""); };
const EXF = [
() => { const [n, f1, f2] = pk([[24, [1, 3], [3, 8]], [20, [2, 5], [1, 4]], [30, [2, 5], [1, 3]], [28, [3, 7], [1, 4]], [18, [4, 9], [1, 3]]] ), b = (n * f1[0]) / f1[1], p = (n * f2[0]) / f2[1], v = n - b - p, fv2 = fr(v, n);
return X({ id: "fractout", lv: 1, titre: "Comment viens-tu à l'école ?",
q: "Dans une classe de " + n + " élèves, " + M(ft(f1)) + " des élèves viennent en bus, " + M(ft(f2)) + " à pied et les autres à vélo.",
parts: [{ label: "Combien d'élèves viennent en bus ? à pied ?", pts: 2 }, { label: "Combien viennent à vélo ?", pts: 1 }, { label: "Quelle fraction de la classe vient à vélo ? Simplifie-la.", pts: 1 }, { label: "Est-ce plus ou moins que le quart de la classe ? Justifie.", pts: 1 }],
sol: ul([M(ft(f1) + " \\text{ de } " + n + " = " + n + " : " + f1[1] + " \\cdot " + f1[0] + " = " + b) + " ; " + M(ft(f2) + " \\text{ de } " + n + " = " + p) + ".", M(n + " - " + b + " - " + p + " = " + v) + " élèves.", M("\\frac{" + v + "}{" + n + "}" + (fv2[1] !== n ? " = " + ft(fv2) : "")) + ".", "Le quart, c'est " + M(n + " : 4 = " + N(n / 4)) + " élèves : " + (v > n / 4 ? "plus" : v < n / 4 ? "moins" : "autant") + " (" + v + " élèves)."]),
chk: [[Number.isInteger(b) && Number.isInteger(p) && v > 1 && v * 4 !== n, "entiers"]], vals: [b, p, v] }); },
() => { let F3; do F3 = sh([[1, 2], [2, 3], [3, 4], [5, 6], [3, 8], [5, 8], [5, 12], [7, 12], [1, 3], [1, 4], [1, 6], [7, 8]]).slice(0, 3); while (new Set(F3.map((f) => f[1])).size < 3 || Math.abs(F3.reduce((t, f) => t + f[0] / f[1], 0) - 1) < 1e-9);
const names = sh(["Aya", "Ben", "Chloé", "Dario", "Eva", "Fanny"]).slice(0, 3), k = pk([2, 3]), shown = [[F3[0][0] * k, F3[0][1] * k], F3[1], F3[2]], D = F3.reduce((m, f) => lcm(m, f[1]), 1), srt = F3.map((f, i) => [f, names[i]]).sort((x, y) => fv(y[0]) - fv(x[0])), S = F3.reduce((s, f) => fadd(s, f), [0, 1]);
return X({ id: "fracrep", lv: 2, titre: "Les tartes",
q: "Trois amis ont chacun une tarte de même taille. " + names.map((n, i) => n + " en a mangé " + M("\\frac{" + shown[i][0] + "}{" + shown[i][1] + "}")).join(", ") + ".",
parts: [{ label: "Simplifie la fraction de " + names[0] + ".", pts: 1 }, { label: "Écris les trois fractions avec le même dénominateur, puis range-les de la plus grande à la plus petite.", pts: 2 }, { label: "Qui a mangé le plus ?", pts: 1 }, { label: "Ensemble, ont-ils mangé plus d'une tarte entière ? Justifie par un calcul.", pts: 2 }],
sol: ul([M("\\frac{" + shown[0][0] + "}{" + shown[0][1] + "} = " + ft(F3[0])) + " (on divise par " + k + ").", "Dénominateur commun " + D + " : " + F3.map((f, i) => names[i] + " " + M("\\frac{" + f[0] * (D / f[1]) + "}{" + D + "}")).join(", ") + ". Ordre : " + srt.map((x) => x[1]).join(" > ") + ".", srt[0][1] + ".", "Somme : " + M("\\frac{" + F3.map((f) => f[0] * (D / f[1])).join(" + ") + "}{" + D + "} = " + ft(S)) + " : " + (fv(S) > 1 ? "oui, plus d'une tarte." : "non, moins d'une tarte.")]),
chk: [[new Set(F3.map(fv)).size === 3, "distinctes"], [Math.abs(fv(S) - 1) > 1e-9, "pas égal à 1"]], vals: [fv(S)] }); },
() => { let c; do { c = [R.int(9, 18), R.int(7, 14)]; c.push(40 - c[0] - c[1]); } while (c[2] < 5 || new Set(c).size < 3); const sp = ["football", "natation", "basket"], k = pk([5, 7, 11]), n2 = 24;
return X({ id: "fracconv", lv: 2, titre: "Le sondage",
q: "On a demandé à 40 élèves leur sport préféré : " + sp.map((s, i) => c[i] + " ont choisi " + (s === "natation" ? "la " : "le ") + s).join(", ") + ". Dans une autre classe de " + n2 + " élèves, " + k + " ont choisi le football.",
parts: [{ label: "Pour chaque sport, écris la fraction des 40 élèves (simplifiée), puis son écriture décimale et le pourcentage.", pts: 3 }, { label: "Écris " + M("\\frac{" + k + "}{" + n2 + "}") + " sous forme décimale (indique la période).", pts: 1 }, { label: "Dans quel groupe la part d'élèves qui préfèrent le football est-elle la plus grande ?", pts: 1 }],
sol: ul([sp.map((s, i) => s + " : " + M("\\frac{" + c[i] + "}{40} = " + ft(fr(c[i], 40)) + " = " + N(c[i] / 40) + " = " + N(r6(c[i] * 2.5)) + "\\,\\%")).join(" ; ") + ".", M("\\frac{" + k + "}{" + n2 + "} = " + perDec(k, n2)) + "… (les chiffres sous la barre se répètent), soit environ " + N(Math.round((k / n2) * 1000) / 10) + " %.", (c[0] / 40 > k / n2 ? "Dans le premier groupe" : "Dans la deuxième classe") + " : " + N(c[0] / 40) + " " + (c[0] / 40 > k / n2 ? ">" : "<") + " " + N(Math.round((k / n2) * 1000) / 1000) + "…"]),
chk: [[c[0] + c[1] + c[2] === 40, "total"], [Math.abs(c[0] / 40 - k / n2) > 1e-9, "comparaison"], [/overline/.test(perDec(k, n2)), "période"]], vals: c.map((x) => x / 40) }); },
() => { let f0, us, ad, T0, a1, fin; do { f0 = pk([[3, 4], [2, 3], [5, 6], [4, 5]]); us = pk([[2, 5], [1, 3], [1, 4], [3, 10], [5, 12]]); ad = pk([[1, 6], [1, 5], [1, 4], [1, 12]]); T0 = pk([60, 120]); a1 = fsub(f0, us); fin = fadd(a1, ad); } while (a1[0] <= 0 || fv(fin) >= 1 || !Number.isInteger((T0 * fin[0]) / fin[1]));
const Lf = (T0 * fin[0]) / fin[1], w = who();
return X({ id: "fracadd", lv: 3, titre: "Le réservoir",
q: "Le réservoir de la voiture de la famille de " + w.n + " contient " + T0 + " L quand il est plein. Au départ, il est rempli aux " + M(ft(f0)) + ". Le trajet consomme " + M(ft(us)) + " du réservoir plein. À l'arrivée, on ajoute " + M(ft(ad)) + " d'un réservoir plein.",
parts: [{ label: "Quelle fraction du réservoir reste-t-il après le trajet ?", pts: 2 }, { label: "Quelle fraction après le complément ?", pts: 1 }, { label: "Combien de litres cela représente-t-il ?", pts: 1 }, { label: "Combien de litres faudrait-il encore pour faire le plein ?", pts: 1 }],
sol: ul([M(ft(f0) + " - " + ft(us) + " = " + ft(a1)) + " (même dénominateur d'abord).", M(ft(a1) + " + " + ft(ad) + " = " + ft(fin)) + ".", M(ft(fin) + " \\text{ de } " + T0 + " = " + Lf) + " L.", M(T0 + " - " + Lf + " = " + (T0 - Lf)) + " L."]),
chk: [[Math.abs(fv(fin) - (fv(f0) - fv(us) + fv(ad))) < 1e-9, "fractions"]], vals: [fv(a1), fv(fin), Lf, T0 - Lf] }); },
];
const RAISONF = [
() => { let a, b, c, d; do { [a, b] = pk([[1, 3], [2, 5], [1, 4], [3, 7]]); [c, d] = pk([[1, 2], [1, 6], [2, 3]]); } while (Math.abs(a / b + c / d - 1) < 1e-9); const w = who(), S = fadd([a, b], [c, d]);
return X({ id: "fracadd", lv: 2, titre: "Trouve l'erreur",
q: w.n + " écrit : " + M("\\frac{" + a + "}{" + b + "} + \\frac{" + c + "}{" + d + "} = \\frac{" + (a + c) + "}{" + (b + d) + "}") + ".",
parts: [{ label: "Explique son erreur. Montre avec " + M("\\frac{1}{2} + \\frac{1}{2}") + " que sa méthode ne peut pas marcher.", pts: 2 }, { label: "Calcule correctement.", pts: 1 }],
sol: ul(["On n'additionne pas les dénominateurs : on met d'abord les fractions au même dénominateur. Avec sa méthode, " + M("\\frac{1}{2} + \\frac{1}{2} = \\frac{2}{4} = \\frac{1}{2}") + ", alors que deux demis font 1.", M("\\frac{" + a * (lcm(b, d) / b) + "}{" + lcm(b, d) + "} + \\frac{" + c * (lcm(b, d) / d) + "}{" + lcm(b, d) + "} = " + ft(S)) + "."]),
chk: [[Math.abs(fv(S) - (a + c) / (b + d)) > 1e-9, "erreur"]], vals: [fv(S)] }); },
() => VF({ id: "fracper" }, [
() => ["On a " + M("\\frac{2}{3} = 0{,}66") + ".", false, M("\\frac{2}{3} = 0{,}666\\ldots = 0{,}\\overline{6}") + " : 0,66 n'en est qu'un arrondi."],
() => { const p = pk([[3, 4, 75], [2, 5, 40], [7, 20, 35]]); return [M("\\frac{" + p[0] + "}{" + p[1] + "} = " + p[2] + "\\,\\%") + ".", true, M("\\frac{" + p[0] + "}{" + p[1] + "} = \\frac{" + p[2] + "}{100}") + "."]; },
() => ["Si on ajoute 1 au numérateur et au dénominateur, la fraction ne change pas.", false, M("\\frac{1}{2} \\ne \\frac{2}{3}") + " (0,5 et 0,666…)."],
() => [M("\\frac{1}{7} > \\frac{1}{6}") + " car 7 > 6.", false, "Partager en 7 donne des parts plus petites qu'en 6 : " + M("\\frac{1}{7} < \\frac{1}{6}") + "."],
() => [M("\\frac{5}{8} > \\frac{3}{5}") + ".", true, M("\\frac{25}{40} > \\frac{24}{40}") + "."],
() => [M("\\frac{1}{3} = 0{,}\\overline{3}") + ", donc " + M("3 \\cdot 0{,}\\overline{3} = 1") + ".", true, M("3 \\cdot \\frac{1}{3} = 1") + " (et " + M("0{,}\\overline{9} = 1") + ")."],
]),
];
RICH.frac9 = { ids: ["fracrep", "fracsimp", "fracconv", "fracper", "fractout", "fracadd"], label: "Écriture fractionnaire (9e)", ex: EXF, raison: RAISONF, minutes: 45 };


const EXPR = [
() => { const p = pk([1.8, 2.4, 3.2, 2.6]), V = [2, 5, pk([7, 8]), 12], bud = pk([30, 40]), maxL = Math.floor(bud / p + 1e-9), bot = pk([[1.5, 3.3], [1.5, 4.2], [1.5, 3.6], [1.5, 4.5]].filter((x) => Math.abs(x[1] / x[0] - p) > 0.01)), pb = r6(bot[1] / bot[0]);
const show = V.map((v, i) => (i === 1 || i === 3 ? "?" : chf(r6(v * p))));
return X({ id: "proptab", lv: 1, titre: "Le jus de pommes",
q: "À la ferme, le jus de pommes se vend au litre. Le prix est proportionnel à la quantité." + tab(["volume (L)", ...V.map(String)], [["prix (CHF)", ...show]]),
parts: [{ label: "Quel est le prix d'un litre ? Explique comment tu le trouves.", pts: 1 }, { label: "Complète le tableau.", pts: 2 }, { label: "Avec " + bud + " CHF, combien de litres entiers peut-on acheter au maximum ?", pts: 1 }, { label: "Au magasin, la bouteille de " + N(bot[0]) + " L coûte " + chf(bot[1]) + ". Où le jus est-il le moins cher ?", pts: 1 }],
sol: ul([M(Nk(2 * p, 2) + " : 2 = " + Nk(p, 2)) + " CHF.", M("5 \\cdot " + N(p) + " = " + Nk(5 * p, 2)) + " ; " + M("12 \\cdot " + N(p) + " = " + Nk(12 * p, 2)) + " CHF.", M(bud + " : " + N(p) + " \\approx " + N(Math.round((bud / p) * 100) / 100)) + " : " + maxL + " litres.", "Au magasin : " + M(N(bot[1]) + " : " + N(bot[0]) + " = " + Nk(pb, 2)) + " CHF/L ; " + (pb < p ? "le magasin est moins cher." : pb > p ? "la ferme est moins chère." : "même prix.")]),
chk: [[maxL * p <= bud && (maxL + 1) * p > bud, "max"], [Math.abs(pb - p) > 1e-9, "comparaison"]], vals: [p, 5 * p, 12 * p, maxL, pb] }); },
() => { const r = pk([0.93, 0.94, 0.96, 0.97]), ch = pk([200, 250, 300]), gl = pk([3.5, 4, 4.5]), ve = pk([89, 79, 99]), vg = pk([85, 79, 92]), eur = Math.round((ch / r) * 100) / 100, glc = Math.round(gl * r * 100) / 100, vec = Math.round(ve * r * 100) / 100;
return X({ id: "change", lv: 2, titre: "Vacances en Italie",
q: "Avant de partir en Italie, une famille change de l'argent au taux de " + M("1" + u("EUR") + " = " + N(r) + u("CHF")) + ".",
parts: [{ label: "Combien d'euros reçoit-elle pour " + ch + " CHF ? (au centime)", pts: 1 }, { label: "Une glace coûte " + M(N(gl) + u("EUR")) + ". Combien est-ce en francs ?", pts: 1 }, { label: "Une veste coûte " + ve + " EUR en Italie et " + vg + " CHF à Genève. Où est-elle la moins chère ?", pts: 2 }, { label: "La banque prend en plus 5 CHF de frais à chaque change. Le montant reçu est-il encore proportionnel au montant changé ? Explique.", pts: 1 }],
sol: ul([M(ch + " : " + N(r) + " \\approx " + Nk(eur, 2)) + " EUR.", M(N(gl) + " \\cdot " + N(r) + " \\approx " + Nk(glc, 2)) + " CHF.", M(ve + " \\cdot " + N(r) + " \\approx " + Nk(vec, 2)) + " CHF : " + (vec < vg ? "moins chère en Italie." : vec > vg ? "moins chère à Genève." : "même prix."), "Non : pour 0 CHF on ne reçoit rien, mais pour 10 CHF on ne reçoit que l'équivalent de 5 CHF ; doubler la somme ne double pas le montant reçu."]),
chk: [[Math.abs(vec - vg) > 0.005, "pas d'égalité"]], vals: [eur, glc, vec] }); },
() => { const base = 4, Fa = pk([250, 300, 200]), Oe = pk([2, 3]), La = pk([5, 4, 6]), Su = pk([60, 80, 90]), p = pk([6, 10, 3]), k = p / base, oe = Oe * k, maxP = Math.floor((1000 / Fa) * base + 1e-9);
return X({ id: "prop", lv: 2, titre: "La recette du gâteau",
q: "Recette pour 4 personnes : " + Fa + " g de farine, " + Oe + " œufs, " + La + " dL de lait, " + Su + " g de sucre. Cuire " + pk([35, 40]) + " min au four à 180 °C.",
parts: [{ label: "Calcule les quantités pour " + p + " personnes.", pts: 2 }, { label: "Combien d'œufs faut-il en pratique ? Explique.", pts: 1 }, { label: "Quelles données ne changent pas ? Pourquoi ?", pts: 1 }, { label: "Avec un paquet de 1 kg de farine, pour combien de personnes au maximum peut-on faire ce gâteau ?", pts: 1 }],
sol: ul(["Coefficient " + M(p + " : 4 = " + N(k)) + " : farine " + N(Fa * k) + " g, œufs " + N(oe) + ", lait " + N(La * k) + " dL, sucre " + N(Su * k) + " g.", Number.isInteger(oe) ? oe + " œufs, tout juste." : N(oe) + " œufs : on prend " + Math.round(oe) + " (ou " + Math.ceil(oe) + " petits) ; on ne coupe pas un œuf.", "La température et la durée de cuisson ne sont pas proportionnelles au nombre de personnes (elles dépendent du four et de l'épaisseur du gâteau).", M("1000 : " + Fa + " \\cdot 4 = " + N((1000 / Fa) * 4)) + " : " + maxP + " personnes."]),
chk: [[k !== 1, "coef"], [maxP * Fa / base <= 1000, "farine"]], vals: [Fa * k, oe, La * k, Su * k, maxP] }); },
() => { const [w, h, W] = pk([[10, 15, 24], [10, 15, 30], [9, 13, 22.5], [13, 18, 32.5], [12, 18, 30]]), k = W / w, H = r6(h * k), fr2 = pk([[30, 40], [24, 36], [40, 50]]), fits = W <= fr2[0] && H <= fr2[1];
return X({ id: "agrand", lv: 3, titre: "Agrandir une photo",
q: "Une photo mesure " + Q(w, "cm") + " de large et " + Q(h, "cm") + " de haut. On l'agrandit pour qu'elle mesure " + Q(W, "cm") + " de large, sans la déformer.",
parts: [{ label: "Par quel nombre a-t-on multiplié les longueurs ?", pts: 1 }, { label: "Calcule la nouvelle hauteur.", pts: 1 }, { label: "Peut-on la mettre dans un cadre de " + fr2[0] + " cm × " + fr2[1] + " cm ? Justifie.", pts: 1 }, { label: "Combien de fois plus de papier faut-il pour l'agrandissement ? (Compare les aires.)", pts: 2 }],
sol: ul([M(N(W) + " : " + w + " = " + N(k)) + ".", M(h + " \\cdot " + N(k) + " = " + N(H)) + " cm.", fits ? "Oui : " + N(W) + " ≤ " + fr2[0] + " et " + N(H) + " ≤ " + fr2[1] + "." : "Non : " + (W > fr2[0] ? N(W) + " > " + fr2[0] : N(H) + " > " + fr2[1]) + ".", "Aires : " + M(w + " \\cdot " + h + " = " + w * h) + " cm² et " + M(N(W) + " \\cdot " + N(H) + " = " + N(r6(W * H))) + " cm² : " + M(N(r6(W * H)) + " : " + w * h + " = " + N(r6(k * k))) + " fois (c'est " + M(N(k) + "^2") + ", pas " + N(k) + " !)."]),
chk: [[Math.abs((W * H) / (w * h) - k * k) < 1e-9, "aire k²"]], vals: [k, H, k * k] }); },
];
const RAISONPR = [
() => VF({ id: "prop", titre: "Proportionnel ou pas ?", q: "Pour chaque situation, dis si les deux grandeurs sont proportionnelles (vrai) ou non (faux), et justifie." }, [
() => { const pc = pk([6, 7]), km = pk([3, 3.5]); return ["Taxi : " + pc + " CHF de prise en charge, puis " + N(km) + " CHF par km. Le prix est proportionnel à la distance.", false, "Pour 2 km : " + N(pc + 2 * km) + " CHF ; pour 4 km : " + N(pc + 4 * km) + " CHF, ce n'est pas le double."]; },
() => ["La taille d'un enfant est proportionnelle à son âge.", false, "À 1 an : environ 75 cm ; à 10 ans, pas 750 cm !"],
() => ["Le périmètre d'un carré est proportionnel à la longueur de son côté.", true, "P = 4 · c : on multiplie toujours par 4."],
() => ["L'aire d'un carré est proportionnelle à la longueur de son côté.", false, "Côté 2 : aire 4 ; côté 4 : aire 16, quatre fois plus et non deux fois plus."],
() => { const p = pk([1.89, 1.95, 2.04]); return ["À la station, le prix payé est proportionnel au nombre de litres d'essence.", true, "On paie " + N(p) + " CHF par litre : prix = " + N(p) + " · litres."]; },
]),
() => { const Fa = pk([250, 300]), La = pk([4, 5]), w = who();
return X({ id: "prop", lv: 2, titre: "Trouve l'erreur",
q: "Une recette pour 4 personnes demande " + Fa + " g de farine et " + La + " dL de lait. Pour 6 personnes, " + w.n + " ajoute 2 à chaque quantité : " + (Fa + 2) + " g de farine et " + (La + 2) + " dL de lait.",
parts: [{ label: "Explique pourquoi son raisonnement est faux.", pts: 1 }, { label: "Donne les bonnes quantités.", pts: 1 }],
sol: ul(["Il y a 2 personnes de plus, mais chaque quantité doit être multipliée par " + M("6 : 4 = 1{,}5") + ", pas augmentée de 2 (2 g de farine pour 2 personnes, c'est presque rien !).", M(Fa + " \\cdot 1{,}5 = " + N(Fa * 1.5)) + " g ; " + M(La + " \\cdot 1{,}5 = " + N(La * 1.5)) + " dL."]),
chk: [[Fa * 1.5 !== Fa + 2, "différent"]], vals: [Fa * 1.5, La * 1.5] }); },
];
RICH.prop9 = { ids: ["proptab", "prop", "change", "agrand"], label: "Proportionnalité (9e)", ex: EXPR, raison: RAISONPR, minutes: 45 };


const pt = (L, x, y) => M(L + "(" + N(x) + " \\,;\\, " + N(y) + ")");
const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0 || v === 1 || v === -1); return v; };
const EXT = [
() => { let a, b, c, d, e, f; do { a = nz(-5, 5); b = nz(-5, 5); c = nz(-5, 5); d = nz(-5, 5); e = nz(-5, 5); f = nz(-5, 5); } while (Math.abs(a) === Math.abs(b) || Math.abs(c) === Math.abs(d) || Math.abs(e) === Math.abs(f));
return X({ id: "symetries", lv: 1, titre: "Symétries dans le repère",
q: "On donne les points " + pt("A", a, b) + ", " + pt("B", c, d) + " et " + pt("C", e, f) + ".", fig: grid(-6, 6, -6, 6, [[a, b, "A"], [c, d, "B"], [e, f, "C"]]),
parts: [{ label: "Donne les coordonnées de " + M("A'") + ", symétrique de " + M("A") + " par rapport à l'axe des ordonnées (vertical).", pts: 1 }, { label: "Donne les coordonnées de " + M("B'") + ", symétrique de " + M("B") + " par rapport à l'axe des abscisses (horizontal).", pts: 1 }, { label: "Donne les coordonnées de " + M("C'") + ", symétrique de " + M("C") + " par rapport à l'axe des abscisses, puis de " + M("C''") + ", symétrique de " + M("C'") + " par rapport à l'axe des ordonnées.", pts: 2 }, { label: "Énonce la règle : que deviennent les coordonnées par chacune de ces deux symétries ?", pts: 1 }],
sol: ul([pt("A'", -a, b) + " : l'abscisse change de signe.", pt("B'", c, -d) + " : l'ordonnée change de signe.", pt("C'", e, -f) + " puis " + pt("C''", -e, -f) + " (les deux coordonnées ont changé de signe : c'est la symétrie de centre O).", "Axe des ordonnées : " + M("(x \\,;\\, y) \\to (-x \\,;\\, y)") + ". Axe des abscisses : " + M("(x \\,;\\, y) \\to (x \\,;\\, -y)") + "."]),
chk: [[a !== 0 && d !== 0, "non nul"]], vals: [-a, -d, -e, -f] }); },
() => { let dx, dy, P, I; do { dx = nz(-5, 5); dy = nz(-4, 4); P = [[-3, -2], [0, -2], [-2, 1]].map(([x, y]) => [x + R.int(-1, 1), y + R.int(-1, 1)]); I = P.map(([x, y]) => [x + dx, y + dy]); } while (Math.abs(dx) + Math.abs(dy) < 4 || I.some(([x, y]) => Math.abs(x) > 6 || Math.abs(y) > 5)); const Q2 = [nz(-5, 5), nz(-5, 5)];
const dir = (v, p, n) => (v > 0 ? v + " " + p : -v + " " + n);
return X({ id: "symetries", lv: 2, titre: "La translation",
q: "Le triangle " + M("ABC") + " a pour sommets " + pt("A", ...P[0]) + ", " + pt("B", ...P[1]) + ", " + pt("C", ...P[2]) + ". Une translation envoie " + M("A") + " sur " + pt("A'", ...I[0]) + ".", fig: grid(-7, 7, -6, 6, [[...P[0], "A"], [...P[1], "B"], [...P[2], "C"], [...I[0], "A'"]], [[P]]),
parts: [{ label: "Décris cette translation (de combien d'unités vers la droite ou la gauche, vers le haut ou le bas ?).", pts: 1 }, { label: "Donne les coordonnées de " + M("B'") + " et " + M("C'") + ".", pts: 2 }, { label: "Par la même translation, un point " + M("D") + " a pour image " + pt("D'", ...Q2) + ". Trouve " + M("D") + ".", pts: 1 }],
sol: ul([dir(dx, "vers la droite", "vers la gauche") + " et " + dir(dy, "vers le haut", "vers le bas") + " : on ajoute " + N(dx) + " aux abscisses et " + N(dy) + " aux ordonnées.", pt("B'", ...I[1]) + " et " + pt("C'", ...I[2]) + ".", "On fait le chemin inverse : " + pt("D", Q2[0] - dx, Q2[1] - dy) + "."]),
chk: [[I[0][0] - P[0][0] === dx, "translation"]], vals: [dx, dy] }); },
() => { let A2; do A2 = [[nz(1, 4), nz(1, 4)], [nz(1, 5), nz(-3, 3)], [nz(2, 5), nz(1, 5)]]; while (A2[0][1] === A2[1][1] || A2[0][0] === A2[2][0]);
const t = [nz(-4, -2), nz(-5, -2)], Tr = { y: (p) => [-p[0], p[1]], x: (p) => [p[0], -p[1]], t: (p) => [p[0] + t[0], p[1] + t[1]] }, ord = sh(["y", "x", "t"]), nm = { y: "symétrie d'axe des ordonnées", x: "symétrie d'axe des abscisses", t: "translation" };
const Fs = ord.map((k) => A2.map(Tr[k]));
return X({ id: "symetries", lv: 2, titre: "Quelle transformation ?",
q: "Le triangle " + M("T") + " a pour sommets " + A2.map((p) => M("(" + p.join(" \\,;\\, ") + ")")).join(", ") + ". On a construit trois images de " + M("T") + " :<br>" + Fs.map((F, i) => M("T_" + (i + 1)) + " : " + F.map((p) => M("(" + p.join(" \\,;\\, ") + ")")).join(", ")).join("<br>"),
parts: [{ label: "Pour chaque image, dis par quelle transformation on l'a obtenue (symétrie d'axe des abscisses, symétrie d'axe des ordonnées ou translation). Justifie avec les coordonnées.", pts: 3 }, { label: "Pour la translation, décris le déplacement.", pts: 1 }],
sol: ul([ord.map((k, i) => M("T_" + (i + 1)) + " : " + nm[k] + (k === "y" ? " (abscisses opposées)" : k === "x" ? " (ordonnées opposées)" : " (on ajoute la même chose à chaque point)")).join(" ; ") + ".", (t[0] < 0 ? -t[0] + " vers la gauche" : t[0] + " vers la droite") + " et " + (-t[1]) + " vers le bas."]),
chk: [[Fs.every((F) => F.some((p, i) => p[0] !== A2[i][0] || p[1] !== A2[i][1])), "images distinctes"]], vals: [] }); },
() => { const a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5), d = nz(-5, 5), dx = nz(-4, 4), dy = nz(-4, 4);
return X({ id: "symetries", lv: 3, titre: "Enchaîner les transformations",
q: "On part du point " + pt("P", a, b) + ".",
parts: [{ label: "On applique la symétrie d'axe des abscisses, puis la symétrie d'axe des ordonnées. Où arrive " + M("P") + " ?", pts: 1 }, { label: "Et si on fait les deux symétries dans l'autre ordre ?", pts: 1 }, { label: "On applique à " + M("P") + " la translation « " + (dx > 0 ? dx + " à droite" : -dx + " à gauche") + ", " + (dy > 0 ? dy + " en haut" : -dy + " en bas") + " », puis la translation inverse. Où arrive-t-on ?", pts: 1 }, { label: "Trouve le point " + M("Q") + " dont le symétrique par rapport à l'axe des ordonnées est " + pt("Q'", c, d) + ".", pts: 1 }],
sol: ul([pt("", a, -b) + " puis " + pt("", -a, -b) + ".", "Même point " + pt("", -a, -b) + " : l'ordre ne change rien ici. Ces deux symétries font une symétrie de centre O (demi-tour).", "On revient au point de départ " + pt("P", a, b) + ".", pt("Q", -c, d) + " : on refait la même symétrie (elle se « défait » elle-même)."]),
chk: [[true, "ok"]], vals: [a, b, c, d] }); },
];
const RAISONT = [
() => { const a = nz(2, 6), b = -nz(2, 6), w = who();
return X({ id: "symetries", lv: 2, titre: "Trouve l'erreur",
q: w.n + " affirme : « Le symétrique de " + pt("M", a, b) + " par rapport à l'axe des abscisses est " + pt("M'", -a, b) + ". »",
parts: [{ label: "A-t-" + w.il + " raison ? Explique (un dessin peut aider).", pts: 1 }, { label: "À quelle symétrie correspond le point de " + w.n + " ?", pts: 1 }],
sol: ul(["Non : l'axe des abscisses est horizontal ; le point se retourne de haut en bas, l'abscisse reste " + a + " et l'ordonnée devient " + -b + " : " + pt("M'", a, -b) + ".", "À la symétrie d'axe des ordonnées."]),
chk: [[a !== -a, "ok"]], vals: [a, -b] }); },
() => VF({ id: "symetries" }, [
() => ["Une symétrie axiale conserve les longueurs et les angles.", true, "La figure image est superposable à la figure de départ (on la retourne)."],
() => ["Une translation peut changer la taille d'une figure.", false, "Une translation fait glisser la figure sans la tourner ni la déformer."],
() => ["Un point situé sur l'axe de symétrie est sa propre image.", true, "Sa distance à l'axe est nulle."],
() => { const a = nz(2, 6), b = nz(2, 6); return ["Par la symétrie d'axe des ordonnées, " + pt("", a, b) + " devient " + pt("", a, -b) + ".", false, "C'est " + pt("", -a, b) + " : c'est l'abscisse qui change de signe."]; },
() => ["Après une translation, une figure et son image sont orientées de la même façon.", true, "La translation ne retourne pas la figure (contrairement à la symétrie axiale)."],
]),
];
RICH.transf9 = { ids: ["symetries"], label: "Transformations du plan (9e)", ex: EXT, raison: RAISONT, minutes: 45 };


const EXDI = [
() => { const mo = ["sept.", "oct.", "nov.", "déc.", "janv.", "févr."], v = mo.map(() => R.int(3, 16)); while (new Set(v).size < 5) v[R.int(0, 5)] = R.int(3, 16); const tot = v.reduce((a, b) => a + b, 0), m = tot / 6, mx = Math.max(...v), mn = Math.min(...v);
return X({ id: "diagr", lv: 1, titre: "Les livres empruntés",
q: "Ce diagramme indique le nombre de livres empruntés chaque mois à la bibliothèque par une classe.", fig: bars(mo, v, "livres"),
parts: [{ label: "Lis le diagramme et recopie les valeurs dans un tableau.", pts: 1 }, { label: "Combien de livres ont été empruntés en tout ?", pts: 1 }, { label: "Calcule la moyenne par mois (au dixième).", pts: 1 }, { label: "Quelle est l'étendue de la série ? Pendant combien de mois a-t-on dépassé la moyenne ?", pts: 2 }],
sol: ul([mo.map((x, i) => x + " " + v[i]).join(" ; ") + ".", M(v.join(" + ") + " = " + tot) + ".", M(tot + " : 6 \\approx " + A(m, 1)) + " livres par mois.", "Étendue : " + M(mx + " - " + mn + " = " + (mx - mn)) + " ; au-dessus de la moyenne : " + v.filter((x) => x > m).length + " mois."]),
chk: [[mx > mn, "étendue"]], vals: [tot, m, mx - mn] }); },
() => { const notes = [3, 3.5, 4, 4.5, 5, 5.5, 6]; let e; do e = notes.map(() => R.int(0, 6)); while (e.reduce((a, b) => a + b, 0) < 16 || e.reduce((a, b) => a + b, 0) > 26 || e[0] + e[1] === 0 || e[2] + e[3] + e[4] + e[5] + e[6] === 0);
const n = e.reduce((a, b) => a + b, 0), S = notes.reduce((s, x, i) => s + x * e[i], 0), m = S / n, ok = e.reduce((s, x, i) => s + (notes[i] >= 4 ? x : 0), 0), list = []; notes.forEach((x, i) => { for (let k = 0; k < e[i]; k++) list.push(x); }); const med = n % 2 ? list[(n - 1) / 2] : (list[n / 2 - 1] + list[n / 2]) / 2;
return X({ id: "diagr", lv: 2, titre: "Les notes du test",
q: "Voici les résultats d'une classe à un test." + tab(["note", ...notes.map((x) => N(x))], [["effectif", ...e.map(String)]]),
parts: [{ label: "Combien d'élèves ont passé le test ?", pts: 1 }, { label: "Calcule la moyenne de la classe (au centième).", pts: 2 }, { label: "Quel pourcentage des élèves a obtenu au moins 4 ? (au dixième)", pts: 1 }, { label: "Quelle est la médiane ? Explique comment tu la trouves.", pts: 2 }],
sol: ul([M(e.join(" + ") + " = " + n) + " élèves.", M("\\frac{" + notes.map((x, i) => (e[i] ? e[i] + " \\cdot " + N(x) : "")).filter(Boolean).join(" + ") + "}{" + n + "} = \\frac{" + N(S) + "}{" + n + "} \\approx " + A(m, 2)) + ".", M(ok + " : " + n + " \\approx " + A((ok / n) * 100, 1) + "\\,\\%") + ".", "On range les " + n + " notes : " + (n % 2 ? "la " + (n + 1) / 2 + "e" : "la moyenne de la " + n / 2 + "e et de la " + (n / 2 + 1) + "e") + " est " + M(N(med)) + " (autant d'élèves au-dessus qu'en dessous)."]),
chk: [[Math.abs(S - list.reduce((a, b) => a + b, 0)) < 1e-9, "somme"], [ok > 0 && ok < n, "pourcentage"]], vals: [n, m, (ok / n) * 100, med] }); },
() => { const [n, eff] = pk([[24, [9, 6, 5, 4]], [36, [15, 9, 8, 4]], [40, [14, 12, 10, 4]], [30, [12, 10, 5, 3]], [20, [8, 6, 4, 2]]]), labs = sh(["bus", "à pied", "vélo", "voiture", "trottinette"]).slice(0, 4), ang = eff.map((x) => (x / n) * 360), a2 = pk([45, 90, 60]), x2 = (a2 / 360) * 120;
return X({ id: "diagr", lv: 3, titre: "Le diagramme circulaire",
q: "On a demandé à " + n + " élèves comment ils viennent à l'école." + tab(["moyen", "effectif"], labs.map((l, i) => [l, eff[i]])),
parts: [{ label: "Calcule le pourcentage de chaque réponse (au dixième).", pts: 2 }, { label: "Calcule l'angle de chaque secteur pour un diagramme circulaire.", pts: 2 }, { label: "Dans une autre école, de 120 élèves, le secteur « vélo » mesure " + a2 + "°. Combien d'élèves viennent à vélo ?", pts: 1 }],
sol: ul([labs.map((l, i) => l + " " + M(eff[i] + " : " + n + " \\approx " + A((eff[i] / n) * 100, 1) + "\\,\\%")).join(" ; ") + ".", labs.map((l, i) => l + " " + M("\\frac{" + eff[i] + "}{" + n + "} \\cdot 360° = " + N(ang[i]) + "°")).join(" ; ") + " (total 360°).", M("\\frac{" + a2 + "}{360} \\cdot 120 = " + N(x2)) + " élèves."]),
chk: [[Math.abs(ang.reduce((a, b) => a + b, 0) - 360) < 1e-9 && eff.reduce((a, b) => a + b, 0) === n, "360"], [Number.isInteger(x2), "entier"]], vals: [...ang, x2] }); },
() => { let t, goal; do { t = [R.int(7, 11) / 2, R.int(7, 12) / 2, R.int(7, 12) / 2, R.int(6, 11) / 2]; goal = pk([4.5, 5]); } while (new Set(t).size < 3 || 5 * goal - t.reduce((a, b) => a + b, 0) < 2 || 5 * goal - t.reduce((a, b) => a + b, 0) > 6.5); const need = 5 * goal - t.reduce((a, b) => a + b, 0), m6 = (t.reduce((a, b) => a + b, 0) + 6) / 5, m4 = t.reduce((a, b) => a + b, 0) / 4, w = who();
return X({ id: "diagr", lv: 2, titre: "La moyenne à atteindre",
q: w.n + " a obtenu ces notes aux quatre premiers tests du semestre : " + t.map((x) => N(x)).join(" ; ") + ". Il y aura un cinquième test, et la moyenne se calcule sur les cinq notes.",
parts: [{ label: "Calcule sa moyenne actuelle (au centième).", pts: 1 }, { label: "Quelle note doit-" + w.il + " obtenir au 5e test pour avoir exactement " + N(goal) + " de moyenne ?" + " Est-ce possible (notes de 1 à 6) ?", pts: 2 }, { label: "Quelle moyenne aurait-" + w.il + " avec un 6 au 5e test ?", pts: 1 }],
sol: ul([M("(" + t.map(N).join(" + ") + ") : 4 = " + N(t.reduce((a, b) => a + b, 0)) + " : 4 \\approx " + A(m4, 2)) + ".", "Il faut une somme de " + M("5 \\cdot " + N(goal) + " = " + N(5 * goal)) + " : " + M(N(5 * goal) + " - " + N(t.reduce((a, b) => a + b, 0)) + " = " + N(need)) + ". " + (need <= 6 && need >= 1 ? "C'est possible." : need > 6 ? "Impossible : il faudrait plus de 6." : "Facile : même 1 suffit."), M("(" + N(t.reduce((a, b) => a + b, 0)) + " + 6) : 5 = " + A(m6, 2)) + "."]),
chk: [[Math.abs((t.reduce((a, b) => a + b, 0) + need) / 5 - goal) < 1e-9, "inverse"]], vals: [m4, need, m6] }); },
];
const RAISONDI = [
() => VF({ id: "diagr" }, [
() => ["La moyenne d'une série est toujours l'une des valeurs de la série.", false, "La moyenne de 4 et 5 est 4,5, qui n'est pas dans la série."],
() => ["Si on ajoute 1 point à chaque note, la moyenne augmente de 1.", true, "La somme augmente de « 1 × effectif », qu'on divise par l'effectif."],
() => { const a = pk([3, 4]); return ["Si une note de " + a + " est remplacée par un 6, la moyenne peut baisser.", false, "La somme augmente, donc la moyenne augmente."]; },
() => ["La médiane et la moyenne sont toujours égales.", false, "Série 2 ; 3 ; 10 : médiane 3, moyenne 5."],
() => ["Une seule valeur très grande peut beaucoup changer la moyenne, mais peu la médiane.", true, "Série 4 ; 5 ; 6 : moyenne 5, médiane 5. Avec 4 ; 5 ; 60 : moyenne 23, médiane toujours 5."],
]),
() => { const v = [4, 4.5, 5, 5.5]; let e; do e = [pk([2, 3]), pk([5, 6]), pk([7, 8]), pk([2, 4])]; while (Math.abs(v.reduce((s, x, i) => s + x * e[i], 0) / e.reduce((a, b) => a + b, 0) - 4.75) < 0.005); const n = e.reduce((a, b) => a + b, 0), S = v.reduce((s, x, i) => s + x * e[i], 0), w = who();
return X({ id: "diagr", lv: 2, titre: "Trouve l'erreur",
q: "Notes d'un groupe :" + tab(["note", ...v.map(N)], [["effectif", ...e.map(String)]]) + w.n + " calcule la moyenne : " + M("(4 + 4{,}5 + 5 + 5{,}5) : 4 = 4{,}75") + ".",
parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "Calcule la vraie moyenne (au centième).", pts: 1 }],
sol: ul([w.Il + " n'a pas tenu compte des effectifs : chaque note compte autant de fois qu'elle a été obtenue.", M("\\frac{" + v.map((x, i) => e[i] + " \\cdot " + N(x)).join(" + ") + "}{" + n + "} = \\frac{" + N(S) + "}{" + n + "} \\approx " + A(S / n, 2)) + "."]),
chk: [[Math.abs(S / n - 4.75) > 0.004, "différent"]], vals: [S / n] }); },
];
RICH.diagr = { ids: ["diagr"], label: "Diagrammes (9e–10e)", ex: EXDI, raison: RAISONDI, minutes: 45 };






const EXL9 = [

() => { const k = pk([3, 4, 6]), c = pk([4, 7, 9]), I = sh([3, 5, 7, 10, 12]).slice(0, 4).sort((x, y) => x - y), x1 = pk([2.5, 1.5, 3.5]), m = pk([2, 5]), n4 = pk([4, 6, 8]);
const T = (f) => tab(["nombre choisi", "résultat affiché"], I.map((v) => [String(v), N(f(v))]));
return X({ id: "litelab", lv: 1, titre: "Les machines à calculer",
q: "Trois machines transforment le nombre qu'on leur donne. Voici des essais.<br><b>Machine A</b>" + T((v) => k * v) + "<b>Machine B</b>" + T((v) => v + c) + "<b>Machine C</b>" + T((v) => v * v),
parts: [{ label: "Avec " + M("n") + " le nombre choisi, écris la formule de chaque machine.", pts: 3 }, { label: "Que donne chaque machine pour " + M("n = " + N(x1)) + " ?", pts: 2 },
{ label: "Une machine D multiplie le nombre par " + m + ", puis ajoute " + c + ". Écris sa formule et calcule son résultat pour " + M("n = " + n4) + ".", pts: 2 }],
sol: ul(["A : " + M(k + " \\cdot n = " + k + "n") + " ; B : " + M("n + " + c) + " ; C : " + M("n \\cdot n = n^2") + ".", "A : " + M(k + " \\cdot " + N(x1) + " = " + N(k * x1)) + " ; B : " + M(N(x1) + " + " + c + " = " + N(x1 + c)) + " ; C : " + M(N(x1) + "^2 = " + N(r6(x1 * x1))) + ".", M(m + "n + " + c) + " ; pour " + M("n = " + n4) + " : " + M(m + " \\cdot " + n4 + " + " + c + " = " + (m * n4 + c)) + "."]),
chk: [[I.length === 4, "4 essais"]], vals: [k * x1, x1 + c, r6(x1 * x1), m * n4 + c] }); },

() => { let p, q; do { p = R.int(2, 5); q = R.int(3, 9); } while (p === q);
const a0 = r6(q + pk([1.5, 2, 4, 2.5])), E = [["je le multiplie par " + p + ", puis j'ajoute " + q + " au résultat", p + " \\cdot a + " + q, p * a0 + q], ["je lui ajoute " + q + ", puis je multiplie le résultat par " + p, p + " \\cdot (a + " + q + ")", p * (a0 + q)], ["je lui ajoute le produit de " + p + " par " + q, "a + " + p + " \\cdot " + q, a0 + p * q], ["je lui enlève " + q + ", puis je multiplie le résultat par " + p, p + " \\cdot (a - " + q + ")", p * (a0 - q)], ["je l'élève au carré, puis j'ajoute " + q + " au résultat", "a^2 + " + q, a0 * a0 + q]];
const ex = sh(E.map((e, i) => [e[1], i]).concat([["(a + " + q + ")^2", -1]])), lab = (i) => String.fromCharCode(97 + ex.findIndex((e) => e[1] === i)), w = who();
return X({ id: "litelab", lv: 1, titre: "Phrases et expressions",
q: "Je choisis un nombre " + M("a") + ", puis : " + E.map((e, i) => "(" + (i + 1) + ") " + e[0]).join(" ; ") + ".<br>Expressions : " + ex.map((e, j) => String.fromCharCode(97 + j) + ") " + M(e[0])).join(" ; ") + ".",
parts: [{ label: "Associe chaque phrase à son expression (une expression est en trop).", pts: 2 }, { label: "Calcule les cinq résultats pour " + M("a = " + N(a0)) + ".", pts: 3 },
{ label: w.n + " affirme que les phrases (1) et (2) donnent toujours le même résultat. Montre par un exemple qu'" + w.il + " a tort.", pts: 1 }],
sol: ul([E.map((e, i) => "(" + (i + 1) + ") → " + lab(i)).join(", ") + ".", E.map((e, i) => "(" + (i + 1) + ") " + M(e[1].replace(/a/g, N(a0)) + " = " + N(r6(e[2])))).join(" ; ") + ".", "Pour " + M("a = " + N(a0)) + " : " + M(N(r6(E[0][2]))) + " et " + M(N(r6(E[1][2]))) + ". Dans (2), on multiplie aussi le " + q + " par " + p + "."]),
chk: [[a0 > q, "positif"], [E[0][2] !== E[1][2], "différents"]], vals: E.map((e) => r6(e[2])) }); },

() => { const k = pk([2, 3, 4]), x1 = pk([1.5, 2.5, 3.5]), x2 = pk([4, 5, 6]), w = who();
const fig = svg(250, 110, pg([[30, 15], [30 + 50 * k, 15], [30 + 50 * k, 65], [30, 65]], "f-shape2") + tx(30 + 25 * k, 85, k + "x", "f-txt", "middle", 13) + tx(18, 45, "x", "f-txt", "middle", 13), "rectangle de largeur x et de longueur " + k + "x");
return X({ id: "litelab", lv: 2, titre: "Le rectangle",
q: "La longueur d'un rectangle vaut " + (k === 2 ? "le double" : k === 3 ? "le triple" : "le quadruple") + " de sa largeur " + M("x") + " (en cm)." + fig,
parts: [{ label: "Écris le périmètre du rectangle en fonction de " + M("x") + ".", pts: 1 }, { label: "Écris son aire en fonction de " + M("x") + ".", pts: 1 },
{ label: "Calcule le périmètre et l'aire pour " + M("x = " + N(x1)) + " cm, puis pour " + M("x = " + x2) + " cm.", pts: 2 },
{ label: w.n + " affirme : « Si la largeur double, l'aire double aussi. » Vérifie avec " + M("x = 2") + " et " + M("x = 4") + ".", pts: 1 }],
sol: ul([M("x + " + k + "x + x + " + k + "x") + ", qu'on peut écrire " + M(2 * (k + 1) + "x") + " (cm).", M(k + "x \\cdot x = " + k + "x^2") + " (cm²).",
M("x = " + N(x1)) + " : périmètre " + Q(2 * (k + 1) * x1, "cm") + ", aire " + M(k + " \\cdot " + N(x1) + "^2 = " + N(r6(k * x1 * x1))) + " cm² ; " + M("x = " + x2) + " : " + Q(2 * (k + 1) * x2, "cm") + " et " + Q(k * x2 * x2, "cm^2") + ".",
"Pour " + M("x = 2") + " : aire " + Q(4 * k, "cm^2") + " ; pour " + M("x = 4") + " : " + Q(16 * k, "cm^2") + ", 4 fois plus. " + w.n + " a tort (c'est le périmètre qui double)."]),
chk: [[k * 16 === 4 * (4 * k), "×4"]], vals: [2 * (k + 1) * x1, r6(k * x1 * x1), 2 * (k + 1) * x2, k * x2 * x2] }); },

() => { const a = pk([2.5, 1.5, 3.5, 4.5]), b = R.int(3, 8), c = pk([1.2, 0.8, 2, 0.5]), k = pk([2, 3, 5]), m = pk([3, 4]), x1 = pk([2.5, 1.5, 4]);
const V = r6(a * b * c), A2 = r6(2 * (a * b + b * c + a * c)), Vx = r6(m * x1 * (x1 + k));
return X({ id: "valnum", lv: 2, titre: "Le pavé droit",
q: "Pour un pavé droit de dimensions " + M("a") + ", " + M("b") + " et " + M("c") + ", le volume vaut " + M("V = a \\cdot b \\cdot c") + " et l'aire totale " + M("A = 2(ab + bc + ac)") + ".",
parts: [{ label: "Calcule le volume d'un pavé de " + Q(a, "cm") + " sur " + Q(b, "cm") + " sur " + Q(c, "cm") + ".", pts: 1 }, { label: "Calcule son aire totale.", pts: 2 },
{ label: "Un autre pavé mesure " + M("x") + ", " + M("x + " + k) + " et " + M(m) + " (en cm). Écris son volume en fonction de " + M("x") + ".", pts: 1 },
{ label: "Calcule ce volume pour " + M("x = " + N(x1)) + ".", pts: 1 }],
sol: ul([M(N(a) + " \\cdot " + b + " \\cdot " + N(c) + " = " + N(V)) + " cm³.", M("A = 2(" + N(r6(a * b)) + " + " + N(r6(b * c)) + " + " + N(r6(a * c)) + ") = 2 \\cdot " + N(r6(a * b + b * c + a * c)) + " = " + N(A2)) + " cm² (on calcule d'abord la parenthèse).",
M("V = x \\cdot (x + " + k + ") \\cdot " + m) + ", qu'on écrit " + M(m + "x(x + " + k + ")") + " (cm³) : la parenthèse est indispensable.",
M(m + " \\cdot " + N(x1) + " \\cdot (" + N(x1) + " + " + k + ") = " + m + " \\cdot " + N(x1) + " \\cdot " + N(x1 + k) + " = " + N(Vx)) + " cm³."]),
chk: [[V > 0 && A2 > 0, "positifs"]], vals: [V, A2, Vx] }); },

() => { const C1 = sh([15, 25, 35, 10]).slice(0, 2), Cs = pk([30, 40, 45]), ok = R.rand() < 0.5, Fs = (9 * Cs) / 5 + 32, claim = ok ? Cs : Cs + 5, w = who(), F = (t) => (9 * t) / 5 + 32;
return X({ id: "valnum", lv: 3, titre: "Degrés Fahrenheit",
q: "Aux États-Unis, on mesure la température en degrés Fahrenheit (°F). Pour passer des degrés Celsius aux degrés Fahrenheit, on utilise la formule " + M("F = \\frac{9 \\cdot C}{5} + 32") + ". Daniel Gabriel Fahrenheit a créé son échelle en 1724.",
parts: [{ label: "Calcule " + M("F") + " pour " + M("C = " + C1[0]) + ", " + M("C = " + C1[1]) + " et " + M("C = 37") + " (température du corps).", pts: 3 },
{ label: "Il fait " + Fs + " °F à Phoenix. " + w.n + " dit qu'il fait " + claim + " °C. Vérifie avec la formule.", pts: 1 },
{ label: "Pour " + M("C = 20") + ", Noé calcule d'abord " + M("20 : 5 = 4") + ", puis " + M("9 \\cdot 4 + 32") + ". Trouve-t-il le bon résultat ? Et Léa, qui calcule " + M("9 \\cdot (20 + 32) : 5") + " ?", pts: 2 },
{ label: "Quelle donnée de l'énoncé ne sert à rien ?", pts: 1 }],
sol: ul([C1.map((t) => M("\\frac{9 \\cdot " + t + "}{5} + 32 = " + N(F(t)))).join(" ; ") + " ; " + M("\\frac{9 \\cdot 37}{5} + 32 = " + N(F(37))) + " °F.",
M("\\frac{9 \\cdot " + claim + "}{5} + 32 = " + N(F(claim))) + (ok ? " : " + w.n + " a raison." : " et non " + Fs + " : " + w.n + " se trompe (il fait " + Cs + " °C)."),
"Noé : " + M("9 \\cdot 4 + 32 = 68") + ", juste (" + M("\\frac{9 \\cdot 20}{5} = 9 \\cdot \\frac{20}{5}") + "). Léa : " + M("9 \\cdot 52 : 5 = " + N((9 * 52) / 5)) + ", faux : elle ajoute 32 avant de diviser.",
"L'année 1724."]),
chk: [[F(Cs) === Fs && Number.isInteger(Fs), "Phoenix"], [F(20) === 68, "Noé"]], vals: [F(C1[0]), F(C1[1]), F(37), Fs] }); },

() => { const k = pk([6, 10, 12, 15]), n0 = pk([8, 9, 14, 25]), w = who();
return X({ id: "litelab", lv: 2, titre: "Les boîtes",
q: "Denis range des objets dans trois boîtes. La première contient " + M("n") + " objets, la deuxième en contient " + k + " de plus que la première, et la troisième contient le double de la première.",
parts: [{ label: "Écris, en fonction de " + M("n") + ", le nombre d'objets de chaque boîte.", pts: 2 }, { label: "Écris le nombre total d'objets en fonction de " + M("n") + ".", pts: 1 },
{ label: "La première boîte contient " + n0 + " objets. Combien y a-t-il d'objets en tout ?", pts: 1 },
{ label: w.n + " a écrit le total ainsi : " + M("n + " + k + " \\cdot 2n") + ". Explique son erreur.", pts: 1 }],
sol: ul([M("n") + " ; " + M("n + " + k) + " ; " + M("2 \\cdot n = 2n") + ".", M("n + (n + " + k + ") + 2n") + ", qu'on peut écrire " + M("4n + " + k) + ".", M(n0 + " + " + (n0 + k) + " + " + 2 * n0 + " = " + (4 * n0 + k)) + " objets.",
w.n + " a oublié la deuxième boîte (" + M("n + " + k) + ") et a multiplié " + k + " par " + M("2n") + " : il faut additionner les trois boîtes."]),
chk: [[4 * n0 + k === n0 + n0 + k + 2 * n0, "total"]], vals: [4 * n0 + k, n0 + k, 2 * n0] }); },
];
const RAISONL9 = [

() => { const pool = [
() => { const k = pk([3, 5, 7]), v = pk([2.5, 1.5]); return [M(k + "x") + " pour " + M("x = " + N(v)), M(k + N(v)), "On a collé " + k + " et " + N(v) + " : " + M(k + "x") + " veut dire " + M(k + " \\cdot x") + ".", M(k + " \\cdot " + N(v) + " = " + N(k * v))]; },
() => { const k = pk([2, 3, 5]), v = pk([3, 4, 6]); return [M(k + "x^2") + " pour " + M("x = " + v), M("(" + k + " \\cdot " + v + ")^2 = " + (k * v) ** 2), "Le carré ne porte que sur " + M("x") + ".", M(k + " \\cdot " + v + "^2 = " + k + " \\cdot " + v * v + " = " + k * v * v)]; },
() => { const a = pk([2, 4, 6]), k = pk([3, 5]), v = pk([3, 7]); return [M(a + " + " + k + "x") + " pour " + M("x = " + v), M("(" + a + " + " + k + ") \\cdot " + v + " = " + (a + k) * v), "La multiplication passe avant l'addition.", M(a + " + " + k + " \\cdot " + v + " = " + (a + k * v))]; },
() => { const v = pk([28, 35, 56]); return [M("x : 7 + 3") + " pour " + M("x = " + v), M(v + " : (7 + 3) = " + N(v / 10)), "La division passe avant l'addition.", M(v + " : 7 + 3 = " + (v / 7 + 3))]; },
() => { const a = pk([3, 4, 6]), b = pk([5, 7, 8]); return [M("ab") + " pour " + M("a = " + a) + " et " + M("b = " + b), M(String(a) + String(b)), M("ab") + " est un produit, pas un nombre à deux chiffres.", M(a + " \\cdot " + b + " = " + a * b)]; },
]; const L = sh(pool).slice(0, 3).map((f) => f()), w = who();
return X({ id: "valnum", lv: 1, titre: "Trouve l'erreur",
q: w.n + " a calculé la valeur de trois expressions. Chaque calcul est faux." + tab(["", "expression", "calcul de " + w.n], L.map((l, i) => [String.fromCharCode(65 + i), l[0], l[1]])),
parts: [{ label: "Explique l'erreur de chaque calcul.", pts: 2 }, { label: "Fais les trois calculs correctement.", pts: 2 }],
sol: ul([L.map((l, i) => String.fromCharCode(65 + i) + " : " + l[2]).join(" "), L.map((l, i) => String.fromCharCode(65 + i) + " : " + l[3]).join(" ; ") + "."]),
chk: [[L.length === 3, "3"]], vals: [] }); },

() => VF({ id: "litelab", titre: "Vrai ou faux ? Justifie" }, [
() => [M("a + a + a = a^3") + "", false, M("a + a + a = 3 \\cdot a = 3a") + " ; " + M("a^3 = a \\cdot a \\cdot a") + ". Pour " + M("a = 2") + " : 6 et 8."],
() => [M("3 + x \\cdot 2") + " peut s'écrire " + M("3 + 2x") + "", true, "On peut changer l'ordre d'un produit et supprimer le signe « · » devant une lettre."],
() => [M("x \\cdot x = 2x") + "", false, M("x \\cdot x = x^2") + " ; pour " + M("x = 3") + " : 9 et 6."],
() => { const q = pk([3, 4, 5]); return [M("(n + " + q + ") \\cdot 2") + " et " + M("n + " + q + " \\cdot 2") + " donnent toujours le même résultat »", false, "Pour " + M("n = 1") + " : " + M(2 * (1 + q)) + " et " + M(1 + 2 * q) + ". Dans la première, on ajoute d'abord " + q + "."]; },
() => ["Le nombre entier qui suit " + M("n") + " s'écrit " + M("n + 1"), true, "On ajoute 1 : après 7 vient 8."],
() => [M("x^2") + " est toujours plus grand que " + M("x") + "", false, "Pour " + M("x = 0{,}5") + " : " + M("0{,}5^2 = 0{,}25") + ", plus petit que " + M("0{,}5") + "."],
() => [M("5 \\cdot a \\cdot 2") + " peut s'écrire " + M("10a") + "", true, M("5 \\cdot 2 = 10") + " : on peut changer l'ordre des facteurs."],
]),

() => { const xs = [pk([1.5, 2.5]), 2, pk([3, 5])], E = [["2x", (v) => 2 * v], ["x^2", (v) => v * v], ["x + x", (v) => v + v], ["x \\cdot x", (v) => v * v]];
return X({ id: "valnum", lv: 2, titre: "Égales ?",
q: "On remplace " + M("x") + " par " + xs.map((v) => M(N(v))).join(", ") + " dans les expressions " + E.map((e) => M(e[0])).join(", ") + ".",
parts: [{ label: "Complète un tableau avec les douze résultats.", pts: 2 }, { label: "Quelles expressions donnent toujours le même résultat ? Explique.", pts: 2 },
{ label: "Pour " + M("x = 2") + ", " + M("2x") + " et " + M("x^2") + " valent tous deux 4. Sont-elles pour autant égales pour tous les nombres ?", pts: 1 }],
sol: ul([E.map((e) => M(e[0]) + " : " + xs.map((v) => M(N(r6(e[1](v))))).join(" ; ")).join(". ") + ".", M("2x") + " et " + M("x + x") + " (deux fois le même nombre) ; " + M("x^2") + " et " + M("x \\cdot x") + " (le nombre multiplié par lui-même).", "Non : pour " + M("x = " + xs[2]) + ", " + M("2x = " + 2 * xs[2]) + " mais " + M("x^2 = " + xs[2] * xs[2]) + ". Un seul contre-exemple suffit."]),
chk: [[xs[2] * xs[2] !== 2 * xs[2], "contre-exemple"]], vals: [2 * xs[0], 4, 2 * xs[2], xs[2] * xs[2]] }); },

() => { const a = pk([2.5, 1.5, 0.5]), b = pk([4, 6, 8]), E = [["a \\cdot (b + 3)", "produit", a * (b + 3)], ["a \\cdot b + 3", "somme", a * b + 3], ["(a + b) \\cdot (a + 3)", "produit", (a + b) * (a + 3)], ["a + b \\cdot 3", "somme", a + b * 3]], L = sh(E);
return X({ id: "valnum", lv: 1, titre: "Somme ou produit ?",
q: "On considère les expressions " + L.map((e, i) => "(" + (i + 1) + ") " + M(e[0])).join(" ; ") + ".",
parts: [{ label: "Pour chacune, dis si c'est une somme ou un produit (la dernière opération effectuée).", pts: 2 }, { label: "Calcule chacune pour " + M("a = " + N(a)) + " et " + M("b = " + b) + ".", pts: 2 }],
sol: ul([L.map((e, i) => "(" + (i + 1) + ") " + e[1]).join(", ") + ".", L.map((e, i) => "(" + (i + 1) + ") " + M(N(r6(e[2])))).join(" ; ") + "."]),
chk: [[L.length === 4, "4"]], vals: E.map((e) => r6(e[2])) }); },
];

RICH.litt9 = { ids: ["litelab", "valnum"], label: "Calcul littéral (9e)", ex: EXL9, raison: RAISONL9, minutes: 45, grades: [9] };

})();





(function () {
const { r6, N, Nk, A, T, u, Q, chf, pk, sh, g2, lcm, fr, fadd, fsub, fmul, fdiv, fv, ft, X, ul, who, tab, VF, hm, dur, fmt, svg, tx, ln, pg, grid } = RICHU;
const sg = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
const PI = Math.PI;


const EXR = [
() => { const T0 = pk([6, 9, 12]), a1 = pk([1100, 1600, 2100]), [mt, S] = pk([["le Cervin", 4478], ["la Dent Blanche", 4357], ["le Grand Combin", 4314], ["la Pointe Dufour", 4634]]), t1 = r6(T0 - (0.6 * (a1 - 400)) / 100), tS = r6(T0 - (0.6 * (S - 400)) / 100), z = 400 + (T0 / 0.6) * 100;
return X({ id: "rel", lv: 1, titre: "Il fait plus froid en altitude",
q: "À Genève (altitude 400 m), il fait " + Q(T0, "°C") + ". En montagne, la température baisse d'environ " + Q(0.6, "°C") + " chaque fois qu'on monte de 100 m. Le téléphérique le plus proche a coûté " + pk([12, 25, 40]) + " millions de francs.",
parts: [{ label: "Quelle température fait-il à " + N(a1) + " m d'altitude ?", pts: 2 }, { label: "Quelle température fait-il au sommet " + (mt.startsWith("le ") ? "du " + mt.slice(3) : "de " + mt) + " (" + N(S) + " m) ? Arrondis au dixième.", pts: 2 }, { label: "À quelle altitude fait-il 0 °C ?", pts: 1 }, { label: "Quel est l'écart de température entre Genève et le sommet ?", pts: 1 }],
sol: ul(["On monte de " + N(a1 - 400) + " m : " + M(T0 + " - " + N((a1 - 400) / 100) + " \\cdot 0{,}6 = " + N(t1)) + " °C.", M(T0 + " - " + N((S - 400) / 100) + " \\cdot 0{,}6 \\approx " + A(tS, 1)) + " °C.", "Il faut perdre " + T0 + " °C : " + M(T0 + " : 0{,}6 = " + N(T0 / 0.6)) + " fois 100 m, donc " + M("400 + " + N(z - 400) + " = " + N(z)) + " m. Le prix du téléphérique ne sert à rien.", M(T0 + " - (" + A(tS, 1) + ") = " + A(T0 - tS, 1)) + " °C."]),
chk: [[tS < 0 && t1 !== 0, "signes"], [Math.abs(T0 - (0.6 * (z - 400)) / 100) < 1e-9, "0 °C"]], vals: [t1, tS, z, T0 - tS] }); },
() => { let P; do P = [0, 1, 2].map(() => { const j = R.int(3, 15), f = R.int(2, 20 - j - 1); return [j, f, 20 - j - f]; }); while (!P.some((p) => 3 * p[0] - 2 * p[1] - p[2] < -1) || new Set(P.map((p) => 3 * p[0] - 2 * p[1] - p[2])).size < 3 || P.some((p) => Math.abs(3 * p[0] - 2 * p[1] - p[2]) < 2));
const sc = P.map((p) => 3 * p[0] - 2 * p[1] - p[2]), nm = sh(["Aya", "Ben", "Chloé", "Dario", "Eva"]).slice(0, 3), win = sc.indexOf(Math.max(...sc)), j4 = pk([4, 6, 8]);
return X({ id: "prio", lv: 2, titre: "Le quiz",
q: "Un quiz compte 20 questions. Une réponse juste rapporte 3 points, une réponse fausse en enlève 2, une question sans réponse en enlève 1." + tab(["joueur", "justes", "fausses", "sans réponse"], P.map((p, i) => [nm[i], ...p])),
parts: [{ label: "Pour chaque joueur, écris le calcul de son score avec des nombres relatifs, puis effectue-le.", pts: 3 }, { label: "Qui gagne ? Quel est l'écart entre le premier et le dernier ?", pts: 1 }, { label: "Combien de réponses fausses annulent " + j4 + " réponses justes ?", pts: 1 }],
sol: ul([P.map((p, i) => nm[i] + " : " + M(p[0] + " \\cdot 3 + " + p[1] + " \\cdot (-2) + " + p[2] + " \\cdot (-1) = " + sc[i])).join(" ; ") + ".", nm[win] + " gagne ; écart " + M(Math.max(...sc) + " - " + sg(Math.min(...sc)) + " = " + (Math.max(...sc) - Math.min(...sc))) + " points.", M(j4 + " \\cdot 3 = " + 3 * j4) + " points ; " + M(3 * j4 + " : 2 = " + 1.5 * j4) + " réponses fausses."]),
chk: [[P.every((p) => p[0] + p[1] + p[2] === 20 && p[2] >= 1), "20 questions"]], vals: [...sc, 1.5 * j4] }); },
() => { const c = pk([5.8, 6.4, 7.2]), d = pk([235, 418, 362, 286]), p = pk([1.89, 1.95, 2.04]), est = Math.round(c) * Math.round(d / 100) * Math.round(p), L = r6((c * d) / 100), cost = Math.round(L * p * 100) / 100, ck = Math.round((cost / d) * 1000) / 10;
return X({ id: "decmul", lv: 2, titre: "Le plein d'essence",
q: "Une voiture consomme " + Q(c, "L") + " d'essence aux 100 km. Pour partir en vacances, la famille fait un trajet de " + Q(d, "km") + ". L'essence coûte " + chf(p) + " le litre.",
parts: [{ label: "<b>Sans calculatrice</b> : estime le coût de l'essence pour ce trajet (arrondis chaque nombre).", pts: 1 }, { label: "Calcule la quantité d'essence utilisée.", pts: 1 }, { label: "Calcule le coût exact, au centime.", pts: 1 }, { label: "Combien coûte un kilomètre, en centimes (au dixième) ?", pts: 1 }],
sol: ul([M(Math.round(c) + " \\cdot " + Math.round(d / 100) + " \\cdot " + Math.round(p) + " = " + est) + " : environ " + est + " CHF.", M(N(c) + " \\cdot " + N(d / 100) + " = " + N(L)) + " L.", M(N(L) + " \\cdot " + N(p) + " \\approx " + Nk(cost, 2)) + " CHF (proche de l'estimation).", M(Nk(cost, 2) + " : " + d + " \\approx " + N(ck / 100)) + " CHF, soit environ " + N(ck) + " centimes."]),
chk: [[Math.abs(est - cost) < 0.4 * cost, "estimation"]], vals: [L, cost, ck] }); },
() => { let a, b, U; do { a = pk([2, 3, -2, -3, 4]); b = pk([3, 5, -3, -5]); U = [a]; for (let k = 0; k < 4; k++) U.push(-2 * U[k] + b); } while (U.some((v) => Math.abs(v) < 2));
let z; do z = R.int(-9, 9); while (Math.abs(z) < 2); const y = -2 * z + b;
return X({ id: "rel", lv: 3, titre: "La machine à nombres",
q: "Une machine multiplie le nombre qu'on lui donne par " + M("-2") + ", puis ajoute " + M(N(b)) + ". On lui donne " + M(N(a)) + ", puis on redonne chaque résultat à la machine.",
parts: [{ label: "Calcule les quatre résultats suivants.", pts: 2 }, { label: "Quel nombre faut-il donner à la machine pour obtenir " + M(N(y)) + " ?", pts: 2 }, { label: "La machine peut-elle donner un nombre pair ? Explique.", pts: 1 }],
sol: ul([U.slice(1).map((v, k) => M(sg(U[k]) + " \\cdot (-2) + " + sg(b) + " = " + N(v))).join(" ; ") + ".", "On défait les opérations dans l'ordre inverse : " + M(N(y) + " - " + sg(b) + " = " + N(y - b)) + ", puis " + M(N(y - b) + " : (-2) = " + N(z)) + ".", "Non : " + M("(-2) \\cdot x") + " est toujours pair, et on ajoute " + N(b) + ", qui est impair : le résultat est toujours impair."]),
chk: [[(y - b) / -2 === z, "inverse"], [U.every((v) => Math.abs(v) % 2 === 1) || U.slice(1).every((v) => Math.abs(v) % 2 === 1), "impairs"]], vals: [...U.slice(1), z] }); },
];
const RAISONR = [
() => { const pool = [
() => { const a = pk([3, 4, 5]); return [M("-" + a + "^2 = " + a * a), false, M("-" + a + "^2 = -(" + a + " \\cdot " + a + ") = -" + a * a) + " (seul " + a + " est au carré) ; c'est " + M("(-" + a + ")^2 = " + a * a) + "."]; },
() => { const a = pk([2, 3]), b = pk([4, 5]), c = pk([2, 3]); return [M("(-" + a + ") \\cdot (-" + b + ") \\cdot (-" + c + ") = " + a * b * c), false, "Trois facteurs négatifs : le produit est négatif, " + M("-" + a * b * c) + "."]; },
() => { const a = pk([5, 7]), b = pk([3, 4]); return [M("-" + a + " - " + b + " = -" + (a - b)), false, "On descend encore : " + M("-" + a + " - " + b + " = -" + (a + b)) + "."]; },
() => { const a = pk([12, 18, 24]), b = pk([3, 6]); return [M("(-" + a + ") : (-" + b + ") = " + a / b), true, "Deux nombres de même signe : quotient positif."]; },
() => { const a = pk([2, 3]), b = pk([4, 5]); return [M("(-" + a + ")^3 = -" + a ** 3), true, M("(-" + a + ") \\cdot (-" + a + ") \\cdot (-" + a + ")") + " : trois facteurs négatifs."]; },
() => { const a = pk([4, 6, 8]), b = pk([2, 3]); return [M(a + " - " + b + " \\cdot (-3) = " + (a - b) * -3), false, "La multiplication d'abord : " + M(a + " - (" + -3 * b + ") = " + (a + 3 * b)) + "."]; },
];
const L = sh(pool).slice(0, 4).map((f) => f()), w = who();
return X({ id: "rel", lv: 2, titre: "Contrôle les calculs",
q: w.n + " a fait ces calculs." + tab(["", "calcul"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
parts: [{ label: "Lesquels sont faux ?", pts: 2 }, { label: "Corrige-les en expliquant la règle utilisée.", pts: 2 }],
sol: ul([L.some((x) => !x[1]) ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + "." : "Aucun.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste. " : "faux. ") + x[2]).join(" ") ]),
chk: [[L.length === 4, "4"]], vals: [] }); },
() => VF({ id: "rel" }, [
() => ["Le produit de cinq nombres négatifs est négatif.", true, "Les signes « − » se compensent deux à deux ; il en reste un."],
() => ["Le carré d'un nombre n'est jamais négatif.", true, "Un nombre multiplié par lui-même : deux facteurs de même signe."],
() => { const a = R.int(3, 9), b = R.int(2, 6); return ["Le résultat de " + M("a - b") + " est toujours plus petit que " + M("a") + ".", false, "Si " + M("b") + " est négatif : " + M(a + " - (-" + b + ") = " + (a + b)) + " > " + a + "."]; },
() => ["Le quotient de deux nombres négatifs est négatif.", false, M("(-12) : (-4) = 3") + " : même signe, quotient positif."],
() => ["L'opposé de " + M("-x") + " est toujours positif.", false, "L'opposé de " + M("-x") + " est " + M("x") + ", qui peut être négatif (si " + M("x = -3") + ")."],
]),
];
RICH.rel10 = { ids: ["ordgr", "decadd", "decmul", "decdiv", "prio", "reladd", "rel"], label: "Relatifs et décimaux (10e)", ex: EXR, raison: RAISONR, minutes: 45 };


const EXA = [
() => { let D1, D2, P1, P2, q1, q2; do { D1 = pk([26, 30, 32]); D2 = pk([36, 40, 45]); P1 = pk([14, 15, 16]); P2 = pk([22, 24, 26, 28]); q1 = (P1 / (PI * (D1 / 2) ** 2)) * 100; q2 = (P2 / (PI * (D2 / 2) ** 2)) * 100; } while (Math.abs(q1 - q2) < 0.08);
const A1 = PI * (D1 / 2) ** 2, A2 = PI * (D2 / 2) ** 2, best = q1 < q2 ? 1 : 2;
return X({ id: "disque", lv: 1, titre: "Quelle pizza choisir ?",
q: "Une pizzeria propose une pizza de " + Q(D1, "cm") + " de diamètre à " + chf(P1) + " et une pizza de " + Q(D2, "cm") + " de diamètre à " + chf(P2) + ". Elles ont la même épaisseur et sont livrées en " + pk([20, 30]) + " minutes.",
parts: [{ label: "Calcule l'aire de chaque pizza (au cm²).", pts: 2 }, { label: "Calcule le prix de 100 cm² pour chaque pizza (au centime).", pts: 2 }, { label: "Quelle pizza est la plus avantageuse ?", pts: 1 }, { label: "Quelle est la longueur du bord de la grande pizza (au cm) ?", pts: 1 }],
sol: ul([M("\\pi \\cdot " + N(D1 / 2) + "^2 \\approx " + Math.round(A1)) + " cm² et " + M("\\pi \\cdot " + N(D2 / 2) + "^2 \\approx " + Math.round(A2)) + " cm² (rayon = diamètre : 2).", M(P1 + " : " + Math.round(A1) + " \\cdot 100 \\approx " + A(q1, 2)) + " CHF et " + M(P2 + " : " + Math.round(A2) + " \\cdot 100 \\approx " + A(q2, 2)) + " CHF.", "La " + (best === 1 ? "petite" : "grande") + " : 100 cm² y coûtent moins cher. La durée de livraison ne sert à rien.", M("\\pi \\cdot " + D2 + " \\approx " + Math.round(PI * D2)) + " cm."]),
chk: [[Math.abs(q1 - q2) >= 0.08, "écart"]], vals: [A1, A2, q1, q2, PI * D2] }); },
() => { const L = pk([80, 85, 90]), r = pk([30, 32, 36]), Pm = 2 * L + 2 * PI * r, Ar = 2 * r * L + PI * r * r, laps = Math.ceil(2000 / Pm);
const fig = svg(320, 130, "<path d=\"M90 15 L230 15 A50 50 0 0 1 230 115 L90 115 A50 50 0 0 1 90 15 Z\" class=\"f-shape\"/>" + ln(90, 15, 90, 115, "f-line", "stroke-dasharray=\"4 4\"") + ln(230, 15, 230, 115, "f-line", "stroke-dasharray=\"4 4\"") + tx(160, 70, L + " m") + ln(230, 65, 280, 65, "f-accent") + tx(255, 60, r + " m", "f-accent f-txt"), "piste");
return X({ id: "aire3", lv: 2, titre: "Le stade",
q: "Le terrain d'un stade est formé d'un rectangle de " + Q(L, "m") + " de long et de deux demi-disques de rayon " + Q(r, "m") + ". La piste qui l'entoure a 8 couloirs.", fig,
parts: [{ label: "Calcule la longueur du bord du terrain (un tour, au mètre).", pts: 2 }, { label: "Combien de tours complets faut-il faire pour courir au moins 2 km ?", pts: 1 }, { label: "Calcule l'aire du terrain (au m²).", pts: 2 }],
sol: ul(["Deux longueurs droites et un cercle complet (deux demi-cercles) : " + M("2 \\cdot " + L + " + 2 \\cdot \\pi \\cdot " + r + " \\approx " + Math.round(Pm)) + " m. Le nombre de couloirs ne sert à rien.", M("2000 : " + Math.round(Pm) + " \\approx " + A(2000 / Pm, 2)) + " : " + laps + " tours.", "Rectangle " + M(L + " \\cdot " + 2 * r + " = " + 2 * r * L) + " m² et disque " + M("\\pi \\cdot " + r + "^2 \\approx " + Math.round(PI * r * r)) + " m² : environ " + Math.round(Ar) + " m²."]),
chk: [[laps * Pm >= 2000 && (laps - 1) * Pm < 2000, "tours"]], vals: [Pm, laps, Ar] }); },
() => { const b = pk([4, 5, 6]), h = pk([6.5, 7, 8.4]), At = r6((b * h) / 2), B = pk([12, 14, 16]), b2 = pk([7, 8, 9]), h2 = pk([5, 6, 4.5]), Atr = r6(((B + b2) * h2) / 2), [L, Ar] = pk([[12.5, 200], [15, 180], [16, 240], [12.5, 150], [16, 200]]), l = r6(Ar / L);
return X({ id: "grandmanq", lv: 2, titre: "Retrouver la dimension qui manque",
q: "Dans chaque situation, on connaît l'aire et on cherche une longueur.",
parts: [{ label: "La voile triangulaire d'un dériveur a une aire de " + Q(At, "m^2") + " et une base de " + Q(b, "m") + ". Quelle est sa hauteur ?", pts: 2 }, { label: "Une plate-bande en forme de trapèze a une aire de " + Q(Atr, "m^2") + " ; ses bases mesurent " + Q(B, "m") + " et " + Q(b2, "m") + ". Quelle est sa hauteur ?", pts: 2 }, { label: "Un terrain rectangulaire de " + Q(Ar, "m^2") + " a une longueur de " + Q(L, "m") + ". Quelle est sa largeur ? Et son périmètre ?", pts: 2 }],
sol: ul([M("A = \\frac{b \\cdot h}{2}") + ", donc " + M("h = \\frac{2A}{b} = \\frac{2 \\cdot " + N(At) + "}{" + b + "} = " + N(h)) + " m.", M("A = \\frac{(B + b) \\cdot h}{2}") + ", donc " + M("h = \\frac{2 \\cdot " + N(Atr) + "}{" + B + " + " + b2 + "} = " + N(h2)) + " m.", M("l = " + Ar + " : " + N(L) + " = " + N(l)) + " m ; " + M("P = 2 \\cdot (" + N(L) + " + " + N(l) + ") = " + N(r6(2 * (L + l)))) + " m."]),
chk: [[Math.abs((2 * At) / b - h) < 1e-9 && Math.abs((2 * Atr) / (B + b2) - h2) < 1e-9, "inverses"], [Math.abs(l * 100 - Math.round(l * 100)) < 1e-6, "largeur au cm"]], vals: [h, h2, l, 2 * (L + l)] }); },
() => { const r = pk([4, 5, 6]), Lc = pk([40, 50, 60]), A1 = PI * r * r, rc = Lc / (2 * PI), Ac = PI * rc * rc;
const fig = svg(320, 170, "<path d=\"M160 85 L160 25 A60 60 0 1 0 220 85 Z\" class=\"f-fill2\"/>" + "<rect x=\"160\" y=\"25\" width=\"110\" height=\"60\" class=\"f-shape2\"/>" + tx(215, 60, "grange") + "<circle cx=\"160\" cy=\"85\" r=\"3.5\" class=\"f-dot\"/>" + ln(160, 85, 118, 127, "f-accent") + tx(128, 98, r + " m", "f-accent f-txt", "end"), "chien attaché");
return X({ id: "disque", lv: 3, titre: "Le chien attaché",
q: "Un chien est attaché par une laisse de " + Q(r, "m") + ".", fig,
parts: [{ label: "Il est attaché à un piquet au milieu d'un pré. Quelle aire peut-il atteindre (au m²) ?", pts: 1 }, { label: "Il est attaché au pied d'un long mur droit. Quelle aire peut-il atteindre ?", pts: 1 }, { label: "Il est attaché à l'angle extérieur d'une grange (voir figure ; les côtés de la grange sont plus longs que la laisse). Quelle aire peut-il atteindre ?", pts: 2 }, { label: "Avec " + Q(Lc, "m") + " de grillage, on fait un enclos circulaire. Quel est son rayon (au cm) ? Son aire (au m²) ?", pts: 2 }],
sol: ul(["Un disque : " + M("\\pi \\cdot " + r + "^2 \\approx " + A(A1, 1)) + " m², soit environ " + Math.round(A1) + " m².", "Un demi-disque : " + M("\\frac{\\pi \\cdot " + r + "^2}{2} \\approx " + Math.round(A1 / 2)) + " m².", "Trois quarts de disque (la grange occupe un quart) : " + M("\\frac{3}{4} \\cdot \\pi \\cdot " + r + "^2 \\approx " + Math.round((3 * A1) / 4)) + " m².", M("2 \\pi r = " + Lc) + ", donc " + M("r = " + Lc + " : (2\\pi) \\approx " + A(rc, 2)) + " m ; aire " + M("\\approx " + Math.round(Ac)) + " m²."]),
chk: [[Math.abs(2 * PI * rc - Lc) < 1e-9, "rayon"]], vals: [A1, A1 / 2, (3 * A1) / 4, rc, Ac] }); },
];
const RAISONA = [
() => VF({ id: "disque" }, [
() => { const r = pk([2, 3, 5]); return ["Si on double le rayon d'un disque, son aire double.", false, "Elle est multipliée par 4 : " + M("\\pi \\cdot " + 2 * r + "^2 = 4 \\cdot \\pi \\cdot " + r + "^2") + "."]; },
() => ["Si on double le rayon d'un cercle, sa longueur double.", true, M("2\\pi \\cdot (2r) = 2 \\cdot (2\\pi r)") + "."],
() => { const r = pk([3, 4, 5]); return ["Le périmètre d'un demi-disque de rayon " + r + " cm est " + M("\\pi \\cdot " + r) + " cm.", false, "Il faut ajouter le diamètre : " + M("\\pi \\cdot " + r + " + " + 2 * r + " \\approx " + A(PI * r + 2 * r, 2)) + " cm."]; },
() => ["Un carré de côté 2 cm a une aire plus grande que le disque de rayon 1 cm qu'il contient.", true, "4 cm² contre " + M("\\pi \\approx 3{,}14") + " cm²."],
() => ["La longueur d'un cercle est un peu plus de 3 fois son diamètre.", true, M("L = \\pi \\cdot d") + " et " + M("\\pi \\approx 3{,}14") + "."],
]),
() => { const d = pk([10, 12, 14, 20]), w = who(), wr = PI * d * d, rt = PI * (d / 2) ** 2;
return X({ id: "disque", lv: 2, titre: "Trouve l'erreur",
q: "Une table ronde a un diamètre de " + Q(d, "dm") + ". " + w.n + " calcule son aire : " + M("\\pi \\cdot " + d + "^2 \\approx " + A(wr, 1)) + " dm².",
parts: [{ label: "Quelle est son erreur ? Comment pouvait-" + w.il + " voir que le résultat est trop grand ?", pts: 2 }, { label: "Calcule l'aire correcte.", pts: 1 }],
sol: ul([w.Il + " a utilisé le diamètre au lieu du rayon. Contrôle : la table tient dans un carré de " + d + " dm de côté, d'aire " + d * d + " dm² ; son aire ne peut pas dépasser " + d * d + " dm².", M("r = " + d / 2) + " dm et " + M("\\pi \\cdot " + d / 2 + "^2 \\approx " + A(rt, 1)) + " dm² (4 fois moins)."]),
chk: [[Math.abs(wr / rt - 4) < 1e-9, "facteur 4"]], vals: [rt] }); },
];
RICH.aire10 = { ids: ["aire3", "disque", "grandmanq"], label: "Aires et périmètres (10e)", ex: EXA, raison: RAISONA, minutes: 45 };


const EXF = [
() => { const [f1, f2] = pk([[[3, 5], [2, 3]], [[3, 4], [2, 5]], [[2, 3], [3, 8]], [[5, 6], [3, 5]], [[4, 7], [3, 4]]]), base = f1[1] * f2[1], k = Math.ceil(240 / base) + R.int(0, 2), Nn = base * k;
const ff = fmul(f1, f2), nf = (Nn * ff[0]) / ff[1], fn = fmul(f1, fsub([1, 1], f2)), nn = (Nn * fn[0]) / fn[1];
return X({ id: "fracmul", lv: 1, titre: "Le sport au collège",
q: "Un collège compte " + N(Nn) + " élèves. " + M(ft(f1)) + " des élèves pratiquent un sport en club, et parmi eux, " + M(ft(f2)) + " jouent au football. Les autres sportifs font de la natation.",
parts: [{ label: "Quelle fraction des élèves du collège joue au football ?", pts: 2 }, { label: "Combien d'élèves cela représente-t-il ?", pts: 1 }, { label: "Quelle fraction des élèves du collège fait de la natation ? Combien d'élèves ?", pts: 2 }],
sol: ul([M(ft(f2) + " \\text{ de } " + ft(f1) + " = " + ft(f2) + " \\cdot " + ft(f1) + " = " + ft(ff)) + ".", M(ft(ff) + " \\cdot " + N(Nn) + " = " + N(nf)) + " élèves.", M(ft(fsub([1, 1], f2)) + " \\cdot " + ft(f1) + " = " + ft(fn)) + ", soit " + M(ft(fn) + " \\cdot " + N(Nn) + " = " + N(nn)) + " élèves."]),
chk: [[Number.isInteger(nf) && Number.isInteger(nn), "entiers"], [Math.abs(nf + nn - (Nn * f1[0]) / f1[1]) < 1e-9, "somme"]], vals: [fv(ff), nf, fv(fn), nn] }); },
() => { const [F3, Ar0] = pk([[[[1, 4], [1, 3], [1, 8]], 24], [[[2, 5], [1, 4], [1, 10]], 20], [[[1, 6], [3, 8], [1, 4]], 24], [[[2, 9], [1, 3], [1, 12]], 36], [[[3, 10], [1, 4], [1, 6]], 60]]), k = Math.ceil(300 / Ar0) + R.int(0, 6), Ar = Ar0 * k, S = F3.reduce((s, f) => fadd(s, f), [0, 1]), po = fsub([1, 1], S), D = F3.reduce((m, f) => lcm(m, f[1]), 1);
const parts = ["potager", "fleurs", "gazon"], ar = F3.map((f) => (Ar * f[0]) / f[1]), ap = (Ar * po[0]) / po[1];
return X({ id: "fracadd", lv: 2, titre: "Le jardin partagé",
q: "Un jardin partagé de " + Q(Ar, "m^2") + " est divisé ainsi : " + parts.map((p, i) => M(ft(F3[i])) + (p === "fleurs" ? " pour les " : " pour le ") + p).join(", ") + " ; le reste est une mare.",
parts: [{ label: "Quel dénominateur commun (le plus petit) peut-on utiliser ? Justifie (PPMC).", pts: 1 }, { label: "Quelle fraction du jardin occupe la mare ?", pts: 2 }, { label: "Calcule l'aire de chaque partie.", pts: 2 }, { label: "Les fleurs et le gazon ensemble occupent-ils plus que le potager et la mare ensemble ?", pts: 1 }],
sol: ul([M("\\text{PPMC}(" + F3.map((f) => f[1]).join(" ; ") + ") = " + D) + ".", M("1 - \\left(" + F3.map((f) => "\\frac{" + f[0] * (D / f[1]) + "}{" + D + "}").join(" + ") + "\\right) = " + ft(po)) + ".", parts.map((p, i) => p + " " + N(ar[i])).join(" m², ") + " m², mare " + N(ap) + " m² (total " + N(Ar) + " m²).", M(N(ar[1] + ar[2]) + (ar[1] + ar[2] > ar[0] + ap ? " > " : " < ") + N(ar[0] + ap)) + " : " + (ar[1] + ar[2] > ar[0] + ap ? "oui." : "non.")]),
chk: [[ar.every(Number.isInteger) && Number.isInteger(ap) && ar.reduce((a, b) => a + b, 0) + ap === Ar, "aires"], [ar[1] + ar[2] !== ar[0] + ap, "comparaison"]], vals: [D, fv(po), ...ar, ap] }); },
() => { const items = sh([["veste", pk([120, 150, 90])], ["baskets", pk([80, 110, 140])], ["sac", pk([60, 45, 75])], ["montre", pk([200, 160, 180])]]), pc = sh([10, 15, 20, 25, 30, 40]).slice(0, 4), so = items.map((x, i) => r6(x[1] * (1 - pc[i] / 100))), eco = r6(items.reduce((s, x, i) => s + x[1] - so[i], 0));
const rows = items.map((x, i) => [x[0], i === 3 ? "?" : chf(x[1]), i === 2 ? "?" : pc[i] + " %", i < 2 ? "?" : chf(so[i])]);
return X({ id: "pct", lv: 2, titre: "Les soldes",
q: "Un magasin affiche ses soldes. Complète le tableau." + tab(["article", "prix initial", "rabais", "prix soldé"], rows),
parts: [{ label: "Calcule le prix soldé de la " + items[0][0] + " et des " + items[1][0] + ".", pts: 2 }, { label: "Calcule le rabais (en %) sur le " + items[2][0] + ".", pts: 1 }, { label: "Retrouve le prix initial de la " + items[3][0] + ".", pts: 2 }, { label: "Combien économise-t-on en achetant les quatre articles ?", pts: 1 }],
sol: ul([M(items[0][1] + " \\cdot " + N(1 - pc[0] / 100) + " = " + N(so[0])) + " CHF ; " + M(items[1][1] + " \\cdot " + N(1 - pc[1] / 100) + " = " + N(so[1])) + " CHF.", "Rabais : " + M(items[2][1] + " - " + N(so[2]) + " = " + N(r6(items[2][1] - so[2]))) + " CHF ; " + M(N(r6(items[2][1] - so[2])) + " : " + items[2][1] + " = " + N(pc[2] / 100) + " = " + pc[2] + "\\,\\%") + ".", "Le prix soldé vaut " + M(N(1 - pc[3] / 100)) + " du prix initial : " + M(N(so[3]) + " : " + N(1 - pc[3] / 100) + " = " + items[3][1]) + " CHF (et non " + N(so[3]) + " + " + pc[3] + " %).", "Économie : " + M(N(eco)) + " CHF."]),
chk: [[Math.abs(so[3] / (1 - pc[3] / 100) - items[3][1]) < 1e-9, "inverse"]], vals: [...so, pc[2], items[3][1], eco] }); },
() => { let v, g, q; do { v = pk([[3, 2], [9, 4], [5, 2], [7, 4], [4, 3]]); g = pk([[1, 5], [3, 10], [1, 4], [3, 8], [2, 5], [1, 6]]); q = fdiv(v, g); } while (q[1] === 1 || fv(q) < 3 || fv(q) > 12);
const n = Math.floor(fv(q)), rem = fsub(v, fmul([n, 1], g)), part = fsub(q, [n, 1]), nb = Math.ceil((25 * fv(g)) / fv(v) - 1e-9), w = who();
return X({ id: "fracops", lv: 3, titre: "Le sirop",
q: "Pour la fête de la classe, " + w.n + " prépare des bouteilles de " + M(ft(v)) + " L de sirop dilué. Un verre contient " + M(ft(g)) + " L.",
parts: [{ label: "Combien de verres peut-on remplir avec une bouteille ? Écris le calcul avec des fractions.", pts: 2 }, { label: "Combien de verres <b>pleins</b> ? Quelle quantité reste-t-il dans la bouteille (fraction de litre) ?", pts: 2 }, { label: "Combien de bouteilles faut-il pour servir 25 verres ?", pts: 1 }],
sol: ul([M(ft(v) + " : " + ft(g) + " = " + ft(v) + " \\cdot \\frac{" + g[1] + "}{" + g[0] + "} = " + ft(q)) + " " + M("\\approx " + A(fv(q), 2)) + " verres.", n + " verres pleins ; il reste " + M(ft(v) + " - " + n + " \\cdot " + ft(g) + " = " + ft(rem)) + " L (soit " + M(ft(part)) + " de verre).", M("25 \\cdot " + ft(g) + " = " + ft(fmul([25, 1], g))) + " L ; " + M(ft(fmul([25, 1], g)) + " : " + ft(v) + " \\approx " + A((25 * fv(g)) / fv(v), 2)) + " : " + nb + " bouteilles."]),
chk: [[Math.abs(fv(rem) - fv(part) * fv(g)) < 1e-9 && fv(rem) > 0, "reste"], [nb * fv(v) >= 25 * fv(g), "bouteilles"]], vals: [fv(q), n, fv(rem), nb] }); },
];
const RAISONF = [
() => { const [a, b] = pk([[2, 3], [3, 4], [5, 6], [3, 5]]), [c, d] = pk([[4, 5], [2, 7], [3, 8]]), w = who(), wr = fr(a * c, b * d), rt = fdiv([a, b], [c, d]);
return X({ id: "fracmul", lv: 2, titre: "Trouve l'erreur",
q: w.n + " écrit : " + M("\\frac{" + a + "}{" + b + "} : \\frac{" + c + "}{" + d + "} = \\frac{" + a * c + "}{" + b * d + "}") + ".",
parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "Calcule correctement et simplifie.", pts: 1 }, { label: "Contrôle : le résultat doit-il être plus grand ou plus petit que " + M("\\frac{" + a + "}{" + b + "}") + " ? Pourquoi ?", pts: 1 }],
sol: ul([w.Il + " a multiplié au lieu de diviser. Diviser par une fraction, c'est multiplier par son inverse.", M("\\frac{" + a + "}{" + b + "} \\cdot \\frac{" + d + "}{" + c + "} = \\frac{" + a * d + "}{" + b * c + "} = " + ft(rt)) + ".", "Plus grand : on divise par un nombre plus petit que 1 (dans " + M("\\frac{" + a + "}{" + b + "}") + ", il y a plus d'une fois " + M("\\frac{" + c + "}{" + d + "}") + ")."]),
chk: [[fv(rt) > a / b && fv(wr) !== fv(rt), "contrôle"]], vals: [fv(rt)] }); },
() => VF({ id: "pct" }, [
() => { const p = pk([100, 200, 80]); return ["Une hausse de 10 % suivie d'une baisse de 10 % ramène au prix de départ.", false, p + " → " + N(p * 1.1) + " → " + N(r6(p * 1.1 * 0.9)) + " : on obtient 99 % du prix de départ."]; },
() => { const [a, b] = pk([[25, 80], [20, 50], [40, 75]]); return [a + " % de " + b + " est égal à " + b + " % de " + a + ".", true, M("\\frac{" + a + "}{100} \\cdot " + b + " = \\frac{" + b + "}{100} \\cdot " + a + " = " + N((a * b) / 100)) + "."]; },
() => ["Diviser par " + M("\\frac{1}{2}") + " revient à multiplier par 2.", true, "L'inverse de " + M("\\frac{1}{2}") + " est 2."],
() => [M("\\frac{3}{4}") + " de " + M("\\frac{2}{3}") + " vaut " + M("\\frac{1}{2}") + ".", true, M("\\frac{3}{4} \\cdot \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}") + "."],
() => [M("\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}") + ".", false, M("\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}") + "."],
() => { const n = pk([84, 90, 126]); return ["Le PGDC de deux nombres divise toujours leur PPMC.", true, "Ex. : " + M("\\text{PGDC}(12 ; " + n + ") = " + g2(12, n)) + " et " + M("\\text{PPMC} = " + lcm(12, n) + " = " + g2(12, n) + " \\cdot " + lcm(12, n) / g2(12, n)) + "."]; },
]),
];
RICH.frac10 = { ids: ["premiers", "arith", "fracrep", "fracsimp", "fracconv", "fracper", "fractout", "fracadd", "fracmul", "fracops", "pct"], label: "Écriture fractionnaire (10e)", ex: EXF, raison: RAISONF, minutes: 45 };


const EXS = [
() => { const r = pk([3.5, 4, 3.8]), h = pk([11, 12, 10.5]), V = PI * r * r * h, Al = 2 * PI * r * h, nb = Math.ceil(2000 / V - 1e-9);
return X({ id: "vol", lv: 1, titre: "La boîte de conserve",
q: "Une boîte de conserve est un cylindre de " + Q(r, "cm") + " de rayon et " + Q(h, "cm") + " de haut. Elle coûte " + chf(pk([2.4, 3.1, 1.95])) + ".", fig: FIG.cylinder(fmt(r) + " cm", fmt(h) + " cm"),
parts: [{ label: "Calcule son volume en cm³ (au cm³).", pts: 1 }, { label: "Combien de centilitres contient-elle ?", pts: 1 }, { label: "Calcule l'aire de l'étiquette qui fait tout le tour (aire latérale).", pts: 2 }, { label: "Combien de boîtes faut-il pour avoir au moins 2 L de soupe ?", pts: 1 }],
sol: ul([M("V = \\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + " \\approx " + Math.round(V)) + " cm³. Le prix ne sert à rien.", M(Math.round(V) + u("cm^3") + " = " + Math.round(V) + u("mL") + " \\approx " + A(V / 10, 1) + u("cL")) + ".", "L'étiquette déroulée est un rectangle de " + M("2\\pi \\cdot " + N(r)) + " cm sur " + N(h) + " cm : " + M("\\approx " + A(Al, 1)) + " cm².", M("2000 : " + Math.round(V) + " \\approx " + A(2000 / V, 2)) + " : " + nb + " boîtes."]),
chk: [[nb * V >= 2000, "boîtes"]], vals: [V, V / 10, Al, nb] }); },
() => { const b = pk([1.6, 1.8, 2]), ht = pk([1.2, 1.5]), L = pk([2.2, 2.4]), s = Math.round(Math.sqrt((b / 2) ** 2 + ht * ht) * 100) / 100, V = r6(((b * ht) / 2) * L), toile = r6(b * ht + 2 * s * L), sol = r6(b * L);
const fig = svg(300, 160, pg([[40, 140], [140, 140], [90, 40]], "f-shape") + pg([[140, 140], [250, 110], [200, 10], [90, 40]], "f-shape2") + ln(90, 40, 90, 140, "f-accent", "stroke-dasharray=\"5 4\"") + tx(90, 156, fmt(b) + " m") + tx(84, 95, fmt(ht) + " m", "f-accent f-txt", "end") + tx(205, 138, fmt(L) + " m") + tx(160, 70, fmt(s) + " m", "f-txt", "middle", 12), "tente");
return X({ id: "airelat", lv: 2, titre: "La tente",
q: "Une tente a la forme d'un prisme droit couché. Sa face avant est un triangle isocèle de base " + Q(b, "m") + " et de hauteur " + Q(ht, "m") + " ; chaque pan du toit mesure " + Q(s, "m") + " de large ; la tente a " + Q(L, "m") + " de long.", fig,
parts: [{ label: "Calcule le volume d'air dans la tente.", pts: 2 }, { label: "Calcule l'aire de toile (deux triangles et deux pans, sans le sol).", pts: 2 }, { label: "Le tapis de sol est un rectangle. Quelle est son aire ?", pts: 1 }],
sol: ul(["Base du prisme : " + M("\\frac{" + N(b) + " \\cdot " + N(ht) + "}{2} = " + N((b * ht) / 2)) + " m² ; " + M("V = " + N((b * ht) / 2) + " \\cdot " + N(L) + " = " + N(V)) + " m³.", "Triangles : " + M("2 \\cdot " + N((b * ht) / 2) + " = " + N(b * ht)) + " m² ; pans : " + M("2 \\cdot " + N(s) + " \\cdot " + N(L) + " = " + N(r6(2 * s * L))) + " m² ; total " + Q(toile, "m^2") + ".", M(N(b) + " \\cdot " + N(L) + " = " + N(sol)) + " m²."]),
chk: [[s > ht && s > b / 2, "pan"]], vals: [V, toile, sol] }); },
() => { const w = pk([8, 10, 12]), L1 = pk([10, 12, 15]), h1 = pk([0.8, 1, 1.2]), L2 = pk([10, 13, 15]), h2 = pk([1.8, 2, 2.2]), q = pk([300, 400, 500]), V = r6(w * (L1 * h1 + L2 * h2)), Lt = V * 1000, min = Lt / q;
const s = 220 / (L1 + L2), y0 = 25, fig = svg(320, 120, pg([[30, y0], [30 + (L1 + L2) * s, y0], [30 + (L1 + L2) * s, y0 + h2 * 35], [30 + L1 * s, y0 + h2 * 35], [30 + L1 * s, y0 + h1 * 35], [30, y0 + h1 * 35]]) + tx(30 + (L1 * s) / 2, y0 - 6, L1 + " m") + tx(30 + L1 * s + (L2 * s) / 2, y0 - 6, L2 + " m") + tx(26, y0 + (h1 * 35) / 2 + 4, fmt(h1) + " m", "f-txt", "end") + tx(34 + (L1 + L2) * s, y0 + (h2 * 35) / 2 + 4, fmt(h2) + " m", "f-txt", "start"), "piscine vue de côté");
return X({ id: "voldecomp", lv: 2, titre: "La piscine à deux profondeurs",
q: "Voici une piscine vue de côté : une partie peu profonde et une partie profonde. Elle mesure " + Q(w, "m") + " de large.", fig,
parts: [{ label: "Calcule le volume de la piscine en m³ (décompose-la en deux pavés).", pts: 2 }, { label: "Combien de litres d'eau faut-il pour la remplir ?", pts: 1 }, { label: "Une pompe débite " + q + " L par minute. Combien de temps faut-il pour la remplir (en h et min) ?", pts: 2 }],
sol: ul([M(L1 + " \\cdot " + w + " \\cdot " + N(h1) + " + " + L2 + " \\cdot " + w + " \\cdot " + N(h2) + " = " + N(r6(L1 * w * h1)) + " + " + N(r6(L2 * w * h2)) + " = " + N(V)) + " m³.", M(N(V) + u("m^3") + " = " + N(Lt) + u("L")) + " (1 m³ = 1000 L).", M(N(Lt) + " : " + q + " = " + N(min)) + " min, soit environ " + dur(Math.round(min)) + "."]),
chk: [[Math.abs(V - w * L1 * h1 - w * L2 * h2) < 1e-9, "volume"]], vals: [V, Lt, min] }); },
() => { const C = pk([3000, 5000, 8000]), d = pk([1.6, 2, 2.4]), Ab = PI * (d / 2) ** 2, h = C / 1000 / Ab, x = Math.round(h * pk([0.4, 0.6, 0.75]) * 10) / 10, Vx = Ab * x * 1000, gl = (C * 10) / 2.5;
return X({ id: "vol", lv: 3, titre: "La citerne",
q: "Une citerne d'eau de pluie est un cylindre de " + Q(d, "m") + " de diamètre. Elle peut contenir " + Q(C, "L") + ".",
parts: [{ label: "Calcule l'aire de la base de la citerne (au centième de m²).", pts: 1 }, { label: "Calcule sa hauteur (au cm).", pts: 2 }, { label: "L'eau atteint " + Q(x, "m") + " de haut. Combien de litres contient-elle (au litre) ?", pts: 1 }, { label: "Combien de verres de " + Q(2.5, "dL") + " pourrait-on remplir avec la citerne pleine ?", pts: 1 }],
sol: ul([M("\\pi \\cdot " + N(d / 2) + "^2 \\approx " + A(Ab, 2)) + " m².", M(C + u("L") + " = " + N(C / 1000) + u("m^3")) + " ; " + M("h = V : A_{\\text{base}} = " + N(C / 1000) + " : " + A(Ab, 4) + " \\approx " + A(h, 2)) + " m.", M(A(Ab, 4) + " \\cdot " + N(x) + " \\approx " + A(Ab * x, 4)) + " m³, soit environ " + N(Math.round(Vx)) + " L.", M(N(C) + u("L") + " = " + N(C * 10) + u("dL")) + " ; " + M(N(C * 10) + " : 2{,}5 = " + N(gl)) + " verres."]),
chk: [[Math.abs(Ab * h * 1000 - C) < 1e-6, "hauteur"], [x < h, "niveau"]], vals: [Ab, h, Vx, gl] }); },
];
const RAISONS = [
() => { const pool = [
() => { const a = pk([2, 3, 0.5]); return [N(a) + " m³ = " + N(a * 100) + " L", false, N(a) + " m³ = " + N(a * 1000) + " L (1 m³ = 1000 dm³ = 1000 L)"]; },
() => { const a = pk([4, 7, 12]); return [a + " dm³ = " + a + " L", true, "1 L = 1 dm³"]; },
() => { const a = pk([250, 330, 750]); return [a + " cm³ = " + N(a / 100) + " L", false, a + " cm³ = " + N(a / 1000) + " L (1 L = 1000 cm³)"]; },
() => { const a = pk([1.5, 2.4, 3]); return [N(a) + " m³ = " + N(a * 1000) + " dm³", true, "1 m³ = 10 dm · 10 dm · 10 dm = 1000 dm³"]; },
() => { const a = pk([3.5, 2.2]); return [N(a) + " dL = " + N(a * 100) + " cm³", true, "1 dL = 0,1 L = 100 cm³"]; },
() => { const a = pk([2, 5]); return [a + " m³ = " + a * 100 + " dm³", false, a + " m³ = " + a * 1000 + " dm³ (trois dimensions : 10 · 10 · 10)"]; },
];
const L = sh(pool).slice(0, 4).map((f) => f()), w = who();
return X({ id: "uvol", lv: 2, titre: "Trouve les erreurs",
q: w.n + " a fait ces conversions." + tab(["", "conversion"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
parts: [{ label: "Lesquelles sont fausses ?", pts: 2 }, { label: "Corrige-les en expliquant.", pts: 2 }],
sol: ul([L.some((x) => !x[1]) ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + "." : "Aucune.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste, " : "faux, ") + x[2]).join(" ; ") + "."]),
chk: [[L.length === 4, "4"]], vals: [] }); },
() => VF({ id: "solides" }, [
() => { const n = pk([5, 6, 8]); return ["Un prisme dont la base a " + n + " côtés a " + (n + 2) + " faces.", true, n + " faces latérales + 2 bases."]; },
() => ["Si on double le rayon d'un cylindre, son volume double.", false, "Il est multiplié par 4 (le rayon est au carré dans " + M("\\pi r^2 h") + ")."],
() => ["Si on double la hauteur d'un cylindre, son volume double.", true, M("\\pi r^2 \\cdot (2h) = 2 \\cdot \\pi r^2 h") + "."],
() => ["Un cylindre est un prisme.", false, "Sa base est un disque, pas un polygone (mais on calcule son volume de la même façon : aire de la base · hauteur)."],
() => ["Deux solides de même volume ont la même aire totale.", false, "Un cube de 2 cm (24 cm²) et un pavé 1 × 1 × 8 (34 cm²) ont tous deux 8 cm³."],
]),
];
RICH.sol10 = { ids: ["uvol", "solides", "vol", "airelat", "voldecomp"], label: "Solides et volumes (10e)", ex: EXS, raison: RAISONS, minutes: 45 };


const sc = (n) => "1\\,:\\," + N(n);
const EXP = [
() => { const E = pk([25000, 50000]), dm = pk([8.4, 6.2, 11.6]), real = r6((dm * E) / 100000), rk = pk([3.5, 4.5, 2.8]), mc = r6((rk * 100000) / E), [c2, k2] = pk([[4, 1], [2, 1], [3, 1.5]]), E2 = (k2 * 100000) / c2, t = Math.round((real / 4) * 60);
return X({ id: "echelle", lv: 1, titre: "La carte de randonnée",
q: "Sur une carte à l'échelle " + M(sc(E)) + ", on prépare une randonnée. On marche à environ " + Q(4, "km/h") + ".",
parts: [{ label: "Que signifie cette échelle ?", pts: 1 }, { label: "Sur la carte, le chemin jusqu'au lac mesure " + Q(dm, "cm") + ". Quelle est la distance réelle en km ? Combien de temps faut-il pour la parcourir ?", pts: 2 }, { label: "Le refuge est à " + Q(rk, "km") + " à vol d'oiseau. À quelle distance est-il sur la carte ?", pts: 1 }, { label: "Sur une autre carte, " + Q(c2, "cm") + " représentent " + Q(k2, "km") + ". Quelle est son échelle ?", pts: 1 }],
sol: ul(["1 cm sur la carte représente " + N(E) + " cm = " + N(E / 100000) + " km en réalité.", M(N(dm) + " \\cdot " + N(E) + " = " + N(dm * E)) + " cm = " + Q(real, "km") + " ; " + M(N(real) + " : 4 = " + N(real / 4)) + " h, environ " + dur(t) + ".", M(N(rk * 100000) + " : " + N(E) + " = " + N(mc)) + " cm.", M(N(k2) + u("km") + " = " + N(k2 * 100000) + u("cm")) + " ; " + M(N(k2 * 100000) + " : " + c2 + " = " + N(E2)) + " : échelle " + M(sc(E2)) + "."]),
chk: [[Math.abs((mc * E) / 100000 - rk) < 1e-9, "inverse"]], vals: [real, mc, E2, t] }); },
() => { const P = pk([240, 380, 520]), tva = 8.1, ttc = Math.round(P * 1.081 * 100) / 100, s = pk([15, 20, 30]), sold = r6(P * (1 - s / 100)), Qn = pk([150, 200, 250]), orig = Qn / 1.25, dbl = r6(P * 1.2 * 0.8);
return X({ id: "pctvar", lv: 2, titre: "Prix et pourcentages",
q: "Un vélo coûte " + chf(P) + " hors taxes. La TVA est de " + M("8{,}1\\,\\%") + ".",
parts: [{ label: "Quel est son prix TVA comprise ? Par quel nombre multiplie-t-on ?", pts: 2 }, { label: "En solde, le prix hors taxes baisse de " + s + " %. Quel est le nouveau prix hors taxes ?", pts: 1 }, { label: "Après une hausse de 25 %, un casque coûte " + Qn + " CHF. Quel était son prix avant la hausse ?", pts: 2 }, { label: "Le prix hors taxes du vélo augmente de 20 %, puis baisse de 20 %. Revient-il à " + P + " CHF ? Calcule.", pts: 1 }],
sol: ul([M(P + " \\cdot 1{,}081 \\approx " + Nk(ttc, 2)) + " CHF (100 % + 8,1 % = 108,1 %).", M(P + " \\cdot " + N(1 - s / 100) + " = " + N(sold)) + " CHF.", M(Qn + " : 1{,}25 = " + N(orig)) + " CHF (et non " + Qn + " − 25 %, car les 25 % portaient sur l'ancien prix).", M(P + " \\cdot 1{,}2 \\cdot 0{,}8 = " + P + " \\cdot 0{,}96 = " + N(dbl)) + " CHF : non, il a baissé de 4 %."]),
chk: [[Math.abs(orig * 1.25 - Qn) < 1e-9, "inverse"], [dbl < P, "baisse"]], vals: [ttc, sold, orig, dbl] }); },
() => { const p = pk([8, 10, 12, 15]), hz = pk([600, 800, 1200]), up = (p * hz) / 100, rp = 6, cm = pk([36, 45, 54]), lr = cm / rp; let A, B, pa, pb; do { A = [pk([84, 96, 105]), pk([1200, 1400, 1500])]; B = [pk([60, 72, 64]), pk([750, 800, 900])]; pa = (A[0] / A[1]) * 100; pb = (B[0] / B[1]) * 100; } while (Math.abs(pa - pb) < 0.5);
return X({ id: "pente", lv: 2, titre: "Routes et rampes",
q: "Une pente de " + M("p\\,\\%") + " signifie qu'on monte de " + M("p") + " m pour 100 m parcourus à l'horizontale.",
parts: [{ label: "Un panneau indique une pente de " + p + " %. De combien de mètres monte-t-on sur " + hz + " m à l'horizontale ?", pts: 1 }, { label: "Une rampe pour fauteuil roulant ne doit pas dépasser 6 %. Quelle longueur horizontale faut-il pour monter une marche de " + cm + " cm ?", pts: 2 }, { label: "La route A monte de " + A[0] + " m sur " + N(A[1]) + " m à l'horizontale ; la route B monte de " + B[0] + " m sur " + B[1] + " m. Laquelle est la plus raide ?", pts: 2 }],
sol: ul([M(p + "\\,\\% \\cdot " + hz + " = " + N(up)) + " m.", "6 cm pour 100 cm : " + M(cm + " : 6 \\cdot 100 = " + N((cm / 6) * 100)) + " cm = " + Q((cm / 6), "m") + ".", "A : " + M(A[0] + " : " + N(A[1]) + " = " + N(r6(A[0] / A[1]))) + " = " + N(r6(pa)) + " % ; B : " + M(B[0] + " : " + B[1] + " = " + N(r6(B[0] / B[1]))) + " = " + N(r6(pb)) + " %. La route " + (pa > pb ? "A" : "B") + " est la plus raide."]),
chk: [[Math.abs(pa - pb) > 0.1, "comparaison"], [lr > 0, "rampe"]], vals: [up, cm / 6, pa, pb] }); },
() => { const E = pk([50, 100]), a = pk([9, 8, 7.5]), b = pk([7, 6, 5.5]), ra = r6((a * E) / 100), rb = r6((b * E) / 100), Ar = r6(ra * rb), Ap = r6(a * b), k2 = E * E, A2 = pk([20, 24, 18]), ap2 = (A2 * 10000) / k2;
return X({ id: "echelle", lv: 3, titre: "Le plan de l'appartement",
q: "Sur un plan à l'échelle " + M(sc(E)) + ", une chambre est un rectangle de " + Q(a, "cm") + " sur " + Q(b, "cm") + ".",
parts: [{ label: "Quelles sont les dimensions réelles de la chambre, en m ?", pts: 2 }, { label: "Calcule l'aire de la chambre sur le plan (en cm²) et en réalité (en m², puis en cm²).", pts: 2 }, { label: "Par combien les aires sont-elles multipliées ? Compare avec l'échelle.", pts: 1 }, { label: "Le salon mesure " + A2 + " m² en réalité. Quelle aire occupe-t-il sur le plan ?", pts: 1 }],
sol: ul([M(N(a) + " \\cdot " + E + " = " + N(a * E)) + " cm = " + N(ra) + " m et " + M(N(b) + " \\cdot " + E + " = " + N(b * E)) + " cm = " + N(rb) + " m.", "Plan : " + M(N(a) + " \\cdot " + N(b) + " = " + N(Ap)) + " cm² ; réalité : " + M(N(ra) + " \\cdot " + N(rb) + " = " + N(Ar)) + " m² = " + N(Ar * 10000) + " cm².", M(N(Ar * 10000) + " : " + N(Ap) + " = " + N(k2) + " = " + E + "^2") + " : les longueurs sont multipliées par " + E + ", les aires par " + M(E + "^2") + ".", M(A2 + u("m^2") + " = " + N(A2 * 10000) + u("cm^2")) + " ; " + M(N(A2 * 10000) + " : " + N(k2) + " = " + N(ap2)) + " cm²."]),
chk: [[Math.abs((Ar * 10000) / Ap - k2) < 1e-6, "rapport des aires"]], vals: [ra, rb, Ap, Ar, k2, ap2] }); },
];
const RAISONP = [
() => { const p = pk([8, 10, 12]), w = who();
return X({ id: "pente", lv: 2, titre: "Trouve l'erreur",
q: w.n + " lit un panneau « " + p + " % » et dit : « sur 1 km à l'horizontale, la route monte de " + p + " m ».",
parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "De combien la route monte-t-elle vraiment sur 1 km à l'horizontale ?", pts: 1 }, { label: "Quelle serait la pente d'une route qui monte de 1 m pour 1 m à l'horizontale ? Est-elle verticale ?", pts: 1 }],
sol: ul([p + " % veut dire " + p + " m pour <b>100</b> m, pas pour 1000 m.", M(p + "\\,\\% \\cdot 1000 = " + p * 10) + " m.", "100 % ; elle n'est pas verticale : elle fait un angle de 45° avec l'horizontale."]),
chk: [[p * 10 !== p, "x10"]], vals: [p * 10] }); },
() => VF({ id: "pctvar" }, [
() => { const P = pk([50, 80, 120]); return ["Une hausse de 20 % suivie d'une baisse de 20 % ramène au prix de départ.", false, P + " → " + N(P * 1.2) + " → " + N(r6(P * 0.96)) + " : on perd 4 %."]; },
() => ["Une baisse de 50 % suivie d'une hausse de 100 % ramène au prix de départ.", true, M("0{,}5 \\cdot 2 = 1") + "."],
() => ["Sur une carte au " + M(sc(25000)) + ", 4 cm représentent 1 km.", true, M("4 \\cdot 25\\text{'}000 = 100\\text{'}000") + " cm = 1 km."],
() => ["Une pente de 100 % est verticale.", false, "100 % : on monte de 100 m pour 100 m à l'horizontale, soit un angle de 45°."],
() => { const p = pk([15, 25, 40]); return ["Augmenter de " + p + " %, c'est multiplier par " + N(1 + p / 100) + ".", true, "100 % + " + p + " % = " + (100 + p) + " % = " + N(1 + p / 100) + "."]; },
]),
];
RICH.prop10 = { ids: ["prop", "echelle", "pctvar", "pente"], label: "Proportionnalité (10e)", ex: EXP, raison: RAISONP, minutes: 45 };


const NAME = { 5: "pentagone", 6: "hexagone", 8: "octogone", 9: "ennéagone", 10: "décagone", 12: "dodécagone", 15: "pentadécagone", 18: "polygone à 18 côtés" };
const polyFig = (n, lab) => { const cx = 150, cy = 85, r = 70, P = []; for (let k = 0; k < n; k++) { const a = -PI / 2 + (2 * PI * k) / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
return svg(300, 175, pg(P, "f-shape") + ln(cx, cy, P[0][0], P[0][1], "f-accent", "stroke-dasharray=\"4 3\"") + ln(cx, cy, P[1][0], P[1][1], "f-accent", "stroke-dasharray=\"4 3\"") + "<circle cx=\"" + cx + "\" cy=\"" + cy + "\" r=\"3\" class=\"f-dot\"/>" + tx((P[0][0] + P[1][0]) / 2 + 8, (P[0][1] + P[1][1]) / 2 - 4, lab, "f-txt", "start"), NAME[n] || "polygone"); };
const EXPO = [
() => { const n = pk([5, 8, 10, 12]), c = pk([4, 4.5, 6, 2.5]), ac = 360 / n, ai = 180 - ac;
return X({ id: "polyreg", lv: 1, titre: "Le " + NAME[n] + " régulier",
q: "Un " + NAME[n] + " régulier a " + n + " côtés de " + Q(c, "cm") + ". Son centre est relié à deux sommets voisins.", fig: polyFig(n, fmt(c) + " cm"),
parts: [{ label: "Calcule l'angle au centre.", pts: 1 }, { label: "Calcule un angle intérieur du " + NAME[n] + ". Explique.", pts: 2 }, { label: "Calcule son périmètre.", pts: 1 }, { label: "Calcule la somme de ses angles intérieurs de deux façons.", pts: 1 }],
sol: ul([M("360° : " + n + " = " + N(ac) + "°") + ".", "Le triangle centre-côté est isocèle ; ses angles à la base valent " + M("(180° - " + N(ac) + "°) : 2 = " + N(ai / 2) + "°") + " ; l'angle intérieur en vaut deux : " + M(N(ai) + "°") + ".", M(n + " \\cdot " + N(c) + " = " + N(r6(n * c))) + " cm.", M(n + " \\cdot " + N(ai) + "° = " + N(n * ai) + "°") + ", et aussi " + M("(" + n + " - 2) \\cdot 180° = " + (n - 2) * 180 + "°") + "."]),
chk: [[Math.abs(n * ai - (n - 2) * 180) < 1e-9, "somme"]], vals: [ac, ai, n * c, n * ai] }); },
() => { const [ac, n1] = pk([[40, 9], [30, 12], [24, 15], [36, 10], [20, 18]]), [ai, n2] = pk([[140, 9], [150, 12], [144, 10], [156, 15], [160, 18]].filter((x) => x[1] !== n1)), [P, c, n3] = pk([[42, 3.5, 12], [63, 7, 9], [37.5, 2.5, 15], [72, 9, 8]]);
return X({ id: "polyreg", lv: 2, titre: "Retrouve le polygone",
q: "Dans chaque cas, on cherche le nombre de côtés d'un polygone régulier.",
parts: [{ label: "Son angle au centre mesure " + M(ac + "°") + ".", pts: 1 }, { label: "Son angle intérieur mesure " + M(ai + "°") + ".", pts: 2 }, { label: "Son périmètre vaut " + Q(P, "cm") + " et un côté mesure " + Q(c, "cm") + ".", pts: 1 }, { label: "Un polygone régulier peut-il avoir un angle au centre de " + M("25°") + " ? Explique.", pts: 1 }],
sol: ul([M("360 : " + ac + " = " + n1) + " côtés.", "Angle au centre : " + M("180° - " + ai + "° = " + (180 - ai) + "°") + ", puis " + M("360 : " + (180 - ai) + " = " + n2) + " côtés.", M(N(P) + " : " + N(c) + " = " + n3) + " côtés.", "Non : " + M("360 : 25 = 14{,}4") + " n'est pas un nombre entier de côtés."]),
chk: [[360 / ac === n1 && 360 / (180 - ai) === n2 && Math.abs(P / c - n3) < 1e-9, "inverses"]], vals: [n1, n2, n3] }); },
() => { const n = pk([6, 8, 10]), c = pk([2.4, 3, 3.6]), ap = Math.round((c / (2 * Math.tan(PI / n))) * 100) / 100, Ar = r6((n * c * ap) / 2), px = pk([85, 110, 95]);
return X({ id: "polyreg", lv: 2, titre: "Le kiosque",
q: "Le sol d'un kiosque à musique est un " + NAME[n] + " régulier de côté " + Q(c, "m") + ". La distance du centre au milieu d'un côté (l'apothème) mesure " + Q(ap, "m") + ".", fig: polyFig(n, fmt(c) + " m"),
parts: [{ label: "En combien de triangles isocèles identiques peut-on découper le sol depuis le centre ? Quelle est l'aire d'un triangle ?", pts: 2 }, { label: "Calcule l'aire du sol.", pts: 1 }, { label: "Le revêtement coûte " + chf(px) + " le m². Quel est le prix (au franc) ?", pts: 1 }, { label: "On pose une guirlande tout autour. Quelle longueur faut-il ?", pts: 1 }],
sol: ul([n + " triangles de base " + N(c) + " m et de hauteur " + N(ap) + " m : " + M("\\frac{" + N(c) + " \\cdot " + N(ap) + "}{2} = " + N(r6((c * ap) / 2))) + " m².", M(n + " \\cdot " + N(r6((c * ap) / 2)) + " = " + N(Ar)) + " m².", M(N(Ar) + " \\cdot " + px + " \\approx " + N(Math.round(Ar * px))) + " CHF.", M(n + " \\cdot " + N(c) + " = " + N(r6(n * c))) + " m."]),
chk: [[ap > c / 2, "apothème"]], vals: [(c * ap) / 2, Ar, Ar * px, n * c] }); },
() => { const L = sh([5, 7, 8, 9, 10, 12]).slice(0, 3).sort((a, b) => a - b), ai = (n) => 180 - 360 / n, tiles = (n) => Number.isInteger(360 / ai(n));
return X({ id: "polyreg", lv: 3, titre: "Paver le sol",
q: "Un carreleur veut couvrir un sol avec des carreaux en forme de polygones réguliers, sans trou ni chevauchement. Autour de chaque sommet, les angles des carreaux doivent faire exactement 360°.",
parts: [{ label: "Calcule l'angle intérieur d'un triangle équilatéral, d'un carré et d'un hexagone régulier. Ces polygones peuvent-ils paver le sol seuls ? Explique.", pts: 2 }, { label: "Même question pour des polygones réguliers à " + L.join(", ") + " côtés.", pts: 2 }, { label: "Montre qu'on peut paver avec deux octogones réguliers et un carré autour de chaque sommet.", pts: 1 }, { label: "Deux pentagones réguliers et un troisième polygone régulier se rencontrent en un sommet. Combien de côtés a ce troisième polygone ?", pts: 1 }],
sol: ul(["60°, 90°, 120° : " + M("6 \\cdot 60° = 4 \\cdot 90° = 3 \\cdot 120° = 360°") + " : oui pour les trois.", L.map((n) => n + " côtés : " + A(ai(n), 2) + "° ; " + M("360 : " + A(ai(n), 2) + (tiles(n) ? " = " + 360 / ai(n) : " \\approx " + A(360 / ai(n), 2))) + (tiles(n) ? " : oui" : " : non, ce n'est pas un nombre entier")).join(" ; ") + ".", M("2 \\cdot 135° + 90° = 360°") + ".", M("360° - 2 \\cdot 108° = 144°") + " ; " + M("180° - 144° = 36°") + " au centre, donc " + M("360 : 36 = 10") + " côtés : un décagone."]),
chk: [[L.every((n) => !tiles(n)), "aucun ne pave seul"], [2 * ai(5) + ai(10) === 360, "décagone"]], vals: L.map(ai) }); },
];
const RAISONPO = [
() => VF({ id: "polyreg" }, [
() => ["Un polygone dont tous les côtés ont la même longueur est régulier.", false, "Un losange (non carré) a quatre côtés égaux mais des angles différents."],
() => ["Un carré est un polygone régulier.", true, "Côtés égaux et angles égaux (90°)."],
() => ["Plus un polygone régulier a de côtés, plus ses angles intérieurs sont grands.", true, "L'angle au centre " + M("360° : n") + " diminue, donc " + M("180° - \\frac{360°}{n}") + " augmente."],
() => ["Un polygone régulier peut avoir un angle intérieur de 100°.", false, "Il faudrait un angle au centre de 80° et " + M("360 : 80 = 4{,}5") + " côtés : impossible."],
() => ["Tous les sommets d'un polygone régulier sont sur un même cercle.", true, "Ils sont tous à la même distance du centre."],
]),
() => { const n = pk([5, 8, 9, 10, 12]), w = who();
return X({ id: "polyreg", lv: 2, titre: "Trouve l'erreur",
q: w.n + " affirme : « l'angle intérieur d'un " + NAME[n] + " régulier vaut " + M("360° : " + n + " = " + N(360 / n) + "°") + " ».",
parts: [{ label: "Quel angle " + w.n + " a-t-" + w.il + " calculé ?", pts: 1 }, { label: "Calcule l'angle intérieur. Contrôle avec la somme des angles.", pts: 2 }],
sol: ul(["L'angle au centre.", M("180° - " + N(360 / n) + "° = " + N(180 - 360 / n) + "°") + " ; contrôle : " + M(n + " \\cdot " + N(180 - 360 / n) + "° = " + N(n * (180 - 360 / n)) + "° = (" + n + " - 2) \\cdot 180°") + "."]),
chk: [[Math.abs(n * (180 - 360 / n) - (n - 2) * 180) < 1e-9, "somme"]], vals: [180 - 360 / n] }); },
];
RICH.poly10 = { ids: ["polyreg"], label: "Figures planes (10e)", ex: EXPO, raison: RAISONPO, minutes: 45 };


const pt = (L, x, y) => M(L + "(" + N(x) + " \\,;\\, " + N(y) + ")");
const nz = (a, b) => { let v; do v = R.int(a, b); while (Math.abs(v) < 2); return v; };
const EXT = [
() => { const n = pk([12, 16, 18, 20, 24]), a = 360 / n, k = R.int(3, n / 2 - 1), Tm = pk([12, 16, 20]), m = R.int(n / 2 + 1, n - 2);
return X({ id: "rotation", lv: 1, titre: "La grande roue",
q: "Une grande roue porte " + n + " cabines régulièrement espacées, numérotées de 1 à " + n + " dans le sens de rotation. Elle fait un tour complet en " + Tm + " minutes. Un billet coûte " + pk([8, 10, 12]) + " CHF.",
parts: [{ label: "Quel est l'angle de la rotation qui amène chaque cabine à la place de la suivante ?", pts: 1 }, { label: "La roue tourne de " + M(N(k * a) + "°") + ". À la place de quelle cabine se trouve maintenant la cabine 1 ?", pts: 1 }, { label: "La cabine 1 est en bas. Combien de temps lui faut-il pour arriver tout en haut ? Pour faire un quart de tour ?", pts: 2 }, { label: "De quel angle la roue a-t-elle tourné quand la cabine 1 est à la place de la cabine " + m + " ?", pts: 1 }],
sol: ul([M("360° : " + n + " = " + N(a) + "°") + ".", M(N(k * a) + " : " + N(a) + " = " + k) + " places : la cabine 1 est à la place de la cabine " + (1 + k) + ".", "Un demi-tour : " + M(Tm + " : 2 = " + Tm / 2) + " min ; un quart de tour : " + M(Tm + " : 4 = " + N(Tm / 4)) + " min. Le prix du billet ne sert à rien.", M((m - 1) + " \\cdot " + N(a) + "° = " + N((m - 1) * a) + "°") + "."]),
chk: [[k * a < 360 && (m - 1) * a < 360, "angles"]], vals: [a, k * a, 1 + k, Tm / 2, Tm / 4, (m - 1) * a] }); },
() => { const [Lr, k1, k2] = pk([[450, 18, 50], [450, 25, 90], [360, 24, 45], [360, 18, 90], [432, 18, 48]]), lm = Lr / k1, wm = pk([9, 10, 10.5]), wr = r6((wm * k1) / 100), l2 = Lr / k2;
return X({ id: "agrand", lv: 2, titre: "La maquette",
q: "Une voiture réelle mesure " + Q(Lr / 100, "m") + " de long. Un collectionneur en a une maquette à l'échelle " + M("1\\,:\\," + k1) + ".",
parts: [{ label: "Quelle est la longueur de la maquette, en cm ?", pts: 1 }, { label: "La maquette a " + Q(wm, "cm") + " de large. Quelle est la largeur réelle de la voiture ?", pts: 1 }, { label: "Combien de fois plus de peinture faut-il pour la vraie voiture que pour la maquette ?", pts: 2 }, { label: "Une autre maquette de la même voiture mesure " + Q(l2, "cm") + ". Quelle est son échelle ?", pts: 1 }],
sol: ul([M(Lr + " : " + k1 + " = " + N(lm)) + " cm.", M(N(wm) + " \\cdot " + k1 + " = " + N(wm * k1)) + " cm = " + Q(wr, "m") + ".", "Les longueurs sont multipliées par " + k1 + ", les aires par " + M(k1 + "^2 = " + k1 * k1) + " : " + k1 * k1 + " fois plus.", M(Lr + " : " + N(l2) + " = " + k2) + " : échelle " + M("1\\,:\\," + k2) + "."]),
chk: [[Number.isInteger(lm * 2) && Math.abs(Lr / l2 - k2) < 1e-9, "échelles"]], vals: [lm, wr, k1 * k1, k2] }); },
() => { let P; do P = [[nz(1, 5), nz(1, 4)], [nz(2, 5), nz(-3, 3)], [nz(-3, 3), nz(2, 5)]]; while (new Set(P.map((p) => p.join())).size < 3);
const r90 = ([x, y]) => [-y, x], r180 = ([x, y]) => [-x, -y], I = P.map(r90), J = P.map(r180);
return X({ id: "rotation", lv: 2, titre: "Quart de tour dans le repère",
q: "Le triangle " + M("ABC") + " a pour sommets " + pt("A", ...P[0]) + ", " + pt("B", ...P[1]) + ", " + pt("C", ...P[2]) + ". On le fait tourner autour de l'origine " + M("O") + ".", fig: grid(-6, 6, -6, 6, [[...P[0], "A"], [...P[1], "B"], [...P[2], "C"]], [[P]]),
parts: [{ label: "Construis l'image de " + M("A") + " par la rotation de centre " + M("O") + " de 90° dans le sens inverse des aiguilles d'une montre, et donne ses coordonnées.", pts: 1 }, { label: "Donne les coordonnées des images de " + M("B") + " et " + M("C") + ". Quelle règle observes-tu ?", pts: 2 }, { label: "Donne les coordonnées des images de " + M("A") + ", " + M("B") + ", " + M("C") + " par la rotation de 180°. À quelle autre transformation correspond-elle ?", pts: 2 }],
sol: ul([pt("A'", ...I[0]) + ".", pt("B'", ...I[1]) + ", " + pt("C'", ...I[2]) + " : " + M("(x \\,;\\, y) \\to (-y \\,;\\, x)") + ".", pt("A''", ...J[0]) + ", " + pt("B''", ...J[1]) + ", " + pt("C''", ...J[2]) + " : c'est la symétrie de centre " + M("O") + " " + M("(x \\,;\\, y) \\to (-x \\,;\\, -y)") + "."]),
chk: [[P.every((p, i) => r90(r90(p)).join() === J[i].join()), "deux quarts de tour"]], vals: [] }); },
() => { const P = pk([24, 30, 36]), Ar = pk([32, 40, 45]), k = pk([1.5, 2.5, 3]), kr = pk([0.4, 0.6, 0.8]), m = pk([[6.25, 2.5], [2.25, 1.5], [9, 3], [1.44, 1.2]]);
return X({ id: "agrand", lv: 3, titre: "Le logo",
q: "Un logo a un périmètre de " + Q(P, "cm") + " et une aire de " + Q(Ar, "cm^2") + ".",
parts: [{ label: "On l'agrandit avec le rapport " + N(k) + ". Calcule le nouveau périmètre et la nouvelle aire.", pts: 2 }, { label: "On le réduit avec le rapport " + N(kr) + ". Calcule le nouveau périmètre et la nouvelle aire.", pts: 2 }, { label: "Sur une affiche, l'aire du logo est multipliée par " + N(m[0]) + ". Par combien ses longueurs ont-elles été multipliées ?", pts: 1 }],
sol: ul(["Périmètre " + M(P + " \\cdot " + N(k) + " = " + N(P * k)) + " cm ; aire " + M(Ar + " \\cdot " + N(k) + "^2 = " + Ar + " \\cdot " + N(k * k) + " = " + N(r6(Ar * k * k))) + " cm².", "Périmètre " + M(P + " \\cdot " + N(kr) + " = " + N(r6(P * kr))) + " cm ; aire " + M(Ar + " \\cdot " + N(r6(kr * kr)) + " = " + N(r6(Ar * kr * kr))) + " cm² (une réduction : rapport plus petit que 1).", "Par " + M(N(m[1])) + ", car " + M(N(m[1]) + "^2 = " + N(m[0])) + "."]),
chk: [[Math.abs(m[1] * m[1] - m[0]) < 1e-9, "racine"]], vals: [P * k, Ar * k * k, P * kr, Ar * kr * kr, m[1]] }); },
];
const RAISONT = [
() => VF({ id: "agrand" }, [
() => ["Une rotation de 180° est une symétrie centrale.", true, "Chaque point va de l'autre côté du centre, à la même distance."],
() => { const k = pk([3, 4]); return ["Un agrandissement de rapport " + k + " multiplie l'aire par " + k + ".", false, "Il la multiplie par " + M(k + "^2 = " + k * k) + "."]; },
() => ["Une rotation conserve les longueurs et les angles.", true, "La figure tourne sans se déformer."],
() => ["Un agrandissement conserve les angles.", true, "La forme reste la même, seules les longueurs changent."],
() => ["Une réduction a un rapport plus grand que 1.", false, "Son rapport est entre 0 et 1 (ex. 0,5)."],
() => ["Quatre quarts de tour de suite ramènent la figure à sa place.", true, M("4 \\cdot 90° = 360°") + "."],
]),
() => { const a = nz(2, 6), b = nz(2, 6), w = who();
return X({ id: "rotation", lv: 2, titre: "Trouve l'erreur",
q: w.n + " fait tourner " + pt("A", a, b) + " d'un quart de tour (90°) autour de " + M("O") + ", dans le sens inverse des aiguilles d'une montre, et obtient " + pt("A'", b, -a) + ".",
parts: [{ label: "Dans quel sens " + w.n + " a-t-" + w.il + " tourné ?", pts: 1 }, { label: "Donne la bonne image.", pts: 1 }],
sol: ul(["Dans le sens des aiguilles d'une montre : " + M("(x \\,;\\, y) \\to (y \\,;\\, -x)") + ".", pt("A'", -b, a) + " (règle " + M("(x \\,;\\, y) \\to (-y \\,;\\, x)") + ")."]),
chk: [[!(b === -b && -a === a), "différent"]], vals: [-b, a] }); },
];
RICH.transf10 = { ids: ["agrand", "rotation"], label: "Transformations du plan (10e)", ex: EXT, raison: RAISONT, minutes: 45 };






const cxT = (a, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : N(a) + v);
const lin = (a, b, v = "x") => cxT(a, v) + (b < 0 ? " - " + N(-b) : b > 0 ? " + " + N(b) : "");
const linP = (a, b, v = "x") => lin(a, b, v).replace(/\{,\}/g, ",").replace(/-/g, "−");
const rect = (x, y, w, h, cls) => pg([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], cls);
const EXL10 = [

() => { let B, Nw, T2; do { B = [0, 1, 2].map(() => [pk([2, 3, 4, 5, -2, -3]), pk([-7, -5, -4, -2, 3, 5, 6, 8])]); Nw = [pk([2, 3, 4, -1, 5]), pk([-6, -3, 2, 4, 7])]; } while (B[0][0] + 2 * B[1][0] + B[2][0] === 0 || B[0][1] + 2 * B[1][1] + B[2][1] === 0 || (Nw[0] === B[1][0] && Nw[1] === B[1][1]));
const M1 = [B[0][0] + B[1][0], B[0][1] + B[1][1]], M2 = [B[1][0] + B[2][0], B[1][1] + B[2][1]], T = [M1[0] + M2[0], M1[1] + M2[1]], x0 = pk([-2, -3, -4]), vT = T[0] * x0 + T[1];
T2 = [B[0][0] + 2 * Nw[0] + B[2][0], B[0][1] + 2 * Nw[1] + B[2][1]];
const W = 300, H = 112, b = (i, j, s, cls) => rect(10 + j * 93 + i * 46.5, 10 + (2 - i) * 32, 93, 32, cls) + tx(10 + j * 93 + i * 46.5 + 46.5, 10 + (2 - i) * 32 + 21, s, "f-txt", "middle", 13);
const fig = svg(W, H, b(0, 0, linP(...B[0]), "f-shape2") + b(0, 1, linP(...B[1]), "f-shape2") + b(0, 2, linP(...B[2]), "f-shape2") + b(1, 0, "?", "f-soft") + b(1, 1, "?", "f-soft") + b(2, 0, "?", "f-soft"), "mur de six briques : trois en bas, deux au milieu, une au sommet");
return X({ id: "reduire", lv: 1, titre: "Le mur de briques",
q: "Dans ce mur, chaque brique contient la <b>somme</b> des deux briques sur lesquelles elle repose. Écris chaque résultat sous forme réduite." + fig,
parts: [{ label: "Écris les deux briques du milieu.", pts: 2 }, { label: "Écris la brique du sommet.", pts: 1 }, { label: "Calcule la brique du sommet pour " + M("x = " + x0) + ". Vérifie en remplaçant " + M("x") + " par " + M(x0) + " dans les trois briques du bas.", pts: 2 },
{ label: "On change seulement la brique du milieu, en bas. Le sommet devient " + M(lin(...T2)) + ". Quelle expression a-t-on mise dans cette brique ?", pts: 2 }],
sol: ul([M("(" + lin(...B[0]) + ") + (" + lin(...B[1]) + ") = " + lin(...M1)) + " et " + M("(" + lin(...B[1]) + ") + (" + lin(...B[2]) + ") = " + lin(...M2)) + ".",
M("(" + lin(...M1) + ") + (" + lin(...M2) + ") = " + lin(...T)) + " (la brique du milieu, en bas, compte deux fois).",
M(N(T[0]) + " \\cdot (" + x0 + ")" + (T[1] < 0 ? " - " + -T[1] : " + " + T[1]) + " = " + vT) + ". En bas, pour " + M("x = " + x0) + " : " + B.map((v) => M(N(v[0] * x0 + v[1]))).join(", ") + ", et " + M(N(B[0][0] * x0 + B[0][1]) + " + 2 \\cdot (" + N(B[1][0] * x0 + B[1][1]) + ") + (" + N(B[2][0] * x0 + B[2][1]) + ") = " + vT) + " ✓.",
"Sommet = brique de gauche + 2 · brique du milieu + brique de droite. Donc 2 · brique du milieu " + M("= (" + lin(...T2) + ") - (" + lin(...B[0]) + ") - (" + lin(...B[2]) + ") = " + lin(2 * Nw[0], 2 * Nw[1])) + ", et la brique vaut " + M(lin(...Nw)) + "."]),
chk: [[vT === B[0][0] * x0 + B[0][1] + 2 * (B[1][0] * x0 + B[1][1]) + B[2][0] * x0 + B[2][1], "deux calculs"], [T2[0] - B[0][0] - B[2][0] === 2 * Nw[0] && T2[1] - B[0][1] - B[2][1] === 2 * Nw[1], "inverse"]],
vals: [T[0], T[1], vT].filter((v) => Math.abs(v) > 1) }); },

() => { const n = pk([5, 6]), big = pk([20, 25, 40]), n0 = pk([12, 15, 18]), C0 = 4 * n0 - 4, no = pk([50, 70, 90]);
const s = 22, fig = svg(n * s + 20, n * s + 20, Array.from({ length: n * n }, (_, k) => { const i = k % n, j = Math.floor(k / n), edge = i === 0 || j === 0 || i === n - 1 || j === n - 1; return rect(10 + i * s, 10 + j * s, s, s, edge ? "f-fill2" : "f-soft"); }).join(""), "carré de " + n + " sur " + n + " carreaux, les carreaux du bord colorés");
return X({ id: "litelab", lv: 2, titre: "Les carreaux du bord",
q: "On pave un carré de " + M("n") + " carreaux sur " + M("n") + " carreaux, et on colore les carreaux du bord (ici " + M("n = " + n) + ")." + fig,
parts: [{ label: "Combien de carreaux sont colorés pour " + M("n = " + n) + " ? Et pour " + M("n = 10") + " ?", pts: 2 },
{ label: "Pour le nombre de carreaux colorés, Léa propose " + M("4n - 4") + ", Noé " + M("4(n - 1)") + ", Sam " + M("2n + 2(n - 2)") + " et Yanis " + M("4n") + ". Lesquelles de ces expressions sont justes ? Justifie en réduisant, et donne un contre-exemple pour celle qui est fausse.", pts: 3 },
{ label: "Combien de carreaux sont colorés pour un carré de " + M(big) + " sur " + M(big) + " ?", pts: 1 },
{ label: "Un carré a " + M(C0) + " carreaux colorés. Combien de carreaux a-t-il de côté ? Peut-on en avoir exactement " + M(no) + " ? Explique.", pts: 2 }],
sol: ul([M("n = " + n) + " : " + M(4 * n - 4) + " carreaux ; " + M("n = 10") + " : 36 carreaux (les 4 coins ne se comptent qu'une fois).",
"Léa, Noé et Sam ont raison : " + M("4(n - 1) = 4n - 4") + " et " + M("2n + 2(n - 2) = 2n + 2n - 4 = 4n - 4") + " (deux côtés entiers, plus deux côtés sans leurs coins). Yanis a tort : il compte les coins deux fois ; contre-exemple " + M("n = " + n) + " : " + M(4 * n) + " au lieu de " + M(4 * n - 4) + ".",
M("4 \\cdot " + big + " - 4 = " + (4 * big - 4)) + " carreaux.",
M("4n - 4 = " + C0) + " : " + M("4n = " + (C0 + 4)) + ", " + M("n = " + n0) + " carreaux de côté. " + M(no + 4 + " : 4 = " + N((no + 4) / 4)) + " n'est pas un nombre entier : impossible d'avoir exactement " + no + " carreaux colorés."]),
chk: [[(no + 4) % 4 !== 0, "impossible"], [4 * n0 - 4 === C0, "inverse"]], vals: [4 * n - 4, 36, 4 * big - 4, n0] }); },

() => { let m, a, t; do { m = pk([3, 4, 5]); a = R.int(2, 9); t = pk([4, -3, 7]); } while (Math.abs(t + a) < 2);
return X({ id: "distrib", lv: 2, titre: "Le programme de calcul",
q: "Programme : « Choisis un nombre. Ajoute " + a + ". Multiplie le résultat par " + m + ". Retranche le nombre choisi. Retranche " + m * a + ". Divise par " + (m - 1) + ". »",
parts: [{ label: "Applique le programme à " + M(t) + ", puis à " + M("2{,}5") + ". Que constates-tu ?", pts: 2 },
{ label: "On appelle " + M("x") + " le nombre choisi. Écris le résultat de chaque étape à l'aide de " + M("x") + ".", pts: 2 },
{ label: "Prouve que ta constatation est vraie pour tous les nombres (développe, puis réduis).", pts: 2 },
{ label: "Change la dernière étape pour que le programme donne toujours le double du nombre choisi.", pts: 1 }],
sol: ul([M(t) + " → " + M(N(t + a)) + " → " + M(N(m * (t + a))) + " → " + M(N(m * (t + a) - t)) + " → " + M(N(m * (t + a) - t - m * a)) + " → " + M(N(t)) + " ; " + M("2{,}5") + " donne " + M("2{,}5") + " : on retrouve le nombre choisi.",
M("x \\to x + " + a + " \\to " + m + "(x + " + a + ") \\to " + m + "(x + " + a + ") - x \\to " + m + "(x + " + a + ") - x - " + m * a + " \\to \\frac{" + m + "(x + " + a + ") - x - " + m * a + "}{" + (m - 1) + "}") + ".",
M(m + "(x + " + a + ") - x - " + m * a + " = " + m + "x + " + m * a + " - x - " + m * a + " = " + (m - 1) + "x") + ", et " + M((m - 1) + "x : " + (m - 1) + " = x") + " : c'est vrai pour tout " + M("x") + " (une preuve, pas seulement des exemples).",
"Par exemple « Divise par " + (m - 1) + ", puis multiplie par 2 »" + (m === 3 ? " (ou simplement : « Ne divise pas » : " + M("2x") + ")" : "") + "."]),
chk: [[m * (t + a) - t - m * a === (m - 1) * t, "preuve"]], vals: [t + a, m * (t + a), m * a, m - 1] }); },

() => { let d, k0, k2; do { d = pk([0.2, 0.25, 0.4, 0.5]); k0 = pk([4, 5, 6, 8, 10]); k2 = pk([15, 20, 25]); } while (Math.abs(Math.abs(d * (k2 - k0)) - 1) < 1e-9);
const q = pk([2.6, 2.8, 3]), a0 = pk([3.5, 4, 5, 6.5]), p = r6(q + d), b0 = r6(a0 + d * k0), k1 = pk([2, 3]);
const A1 = r6(a0 + p * k1), B1 = r6(b0 + q * k1), D = (k) => r6(a0 - b0 + d * k);
return X({ id: "valnum", lv: 2, titre: "Deux taxis",
q: "Dans une ville, deux compagnies de taxis calculent le prix d'une course de " + M("k") + " km avec les formules " + M("A = " + N(a0) + " + " + N(p) + "k") + " et " + M("B = " + N(b0) + " + " + N(q) + "k") + " (en CHF).",
parts: [{ label: "Calcule le prix d'une course de " + Q(k1, "km") + " avec chaque compagnie.", pts: 2 },
{ label: "Écris la différence " + M("A - B") + " sous forme réduite.", pts: 2 },
{ label: "Pour quelle distance les deux prix sont-ils égaux ?", pts: 1 },
{ label: "Inès affirme : « Pour une course de " + k2 + " km, la compagnie A est la moins chère. » A-t-elle raison ? Justifie avec " + M("A - B") + ".", pts: 1 }],
sol: ul(["A : " + M(N(a0) + " + " + N(p) + " \\cdot " + k1 + " = " + Nk(A1, 2)) + " CHF ; B : " + M(N(b0) + " + " + N(q) + " \\cdot " + k1 + " = " + Nk(B1, 2)) + " CHF.",
M("A - B = " + N(a0) + " + " + N(p) + "k - " + N(b0) + " - " + N(q) + "k = " + N(d) + "k - " + N(r6(b0 - a0))) + " (attention : le « − » porte sur les deux termes de B).",
M(N(d) + "k - " + N(r6(b0 - a0)) + " = 0") + " pour " + M("k = " + N(r6(b0 - a0)) + " : " + N(d) + " = " + k0) + " km.",
"Pour " + M("k = " + k2) + " : " + M("A - B = " + N(d) + " \\cdot " + k2 + " - " + N(r6(b0 - a0)) + " = " + N(D(k2))) + " CHF > 0 : A est plus chère. Inès a tort (A n'est moins chère que pour les courses de moins de " + k0 + " km)."]),
chk: [[Math.abs(D(k0)) < 1e-9, "égalité"], [D(k2) > 0 && D(k1) < 0, "signes"], [k2 > k0 && k1 < k0, "ordre"]], vals: [A1, B1, d, k0, D(k2)] }); },

() => { const [a, b, c] = sh(pk([[2, 3, 4], [2, 3, 5], [3, 4, 5], [2, 4, 5]])), V = a * b * c, S = a * b + 2 * a * c + 2 * b * c, x1 = pk([1.5, 2.5, 0.5]), w = who();
return X({ id: "monomes", lv: 3, titre: "La boîte sans couvercle",
q: "Une boîte en carton, sans couvercle, a la forme d'un pavé droit. Son fond mesure " + M(a + "x") + " cm sur " + M(b + "x") + " cm et sa hauteur est de " + M(c + "x") + " cm.",
parts: [{ label: "Écris son volume sous la forme d'un monôme.", pts: 1 },
{ label: "Écris l'aire de carton utilisée (le fond et les quatre côtés) sous la forme d'un monôme.", pts: 2 },
{ label: w.n + " écrit : « l'aire de carton vaut " + M(a * b * c + "x^3") + " ». Explique son erreur.", pts: 1 },
{ label: "Calcule le volume et l'aire de carton pour " + M("x = " + N(x1)) + ". Si " + M("x") + " double, par combien le volume est-il multiplié ? Et l'aire ?", pts: 2 }],
sol: ul([M(a + "x \\cdot " + b + "x \\cdot " + c + "x = " + V + "x^3") + " cm³.",
"Fond " + M(a + "x \\cdot " + b + "x = " + a * b + "x^2") + ", deux côtés " + M("2 \\cdot " + a + "x \\cdot " + c + "x = " + 2 * a * c + "x^2") + ", deux côtés " + M("2 \\cdot " + b + "x \\cdot " + c + "x = " + 2 * b * c + "x^2") + " : en tout " + M(S + "x^2") + " cm² (monômes semblables : on additionne les coefficients).",
w.n + " a multiplié les trois dimensions : c'est le volume. Une aire s'exprime en cm², avec " + M("x^2") + " : on additionne les aires des faces.",
"Volume : " + M(V + " \\cdot " + N(x1) + "^3 = " + V + " \\cdot " + N(r6(x1 ** 3)) + " = " + N(r6(V * x1 ** 3))) + " cm³ ; aire : " + M(S + " \\cdot " + N(r6(x1 * x1)) + " = " + N(r6(S * x1 * x1))) + " cm². Si " + M("x") + " double : " + M("(2x)^3 = 8x^3") + ", volume × 8 ; " + M("(2x)^2 = 4x^2") + ", aire × 4."]),
chk: [[S !== V, "aire ≠ volume"]], vals: [V, S, r6(V * x1 ** 3), r6(S * x1 * x1), 8] }); },
];
const RAISONL10 = [

() => { const a = R.int(2, 6), b = R.int(2, 7), c = R.int(2, 9), d = R.int(5, 9), e = R.int(2, d - 2), f = R.int(2, 9), w = who();
return X({ id: "distrib", lv: 1, titre: "Trouve l'erreur",
q: w.n + " a développé et réduit deux expressions : " + ul([M("-" + a + "(" + b + "x - " + c + ") = -" + a * b + "x - " + a * c), M(d + "x - (" + e + "x - " + f + ") = " + (d - e) + "x - " + f)]).replace(/<ol type="a" class="mock-parts">/, "<ol class=\"mock-parts\">"),
parts: [{ label: "Explique l'erreur de " + w.n + " dans chaque calcul.", pts: 2 }, { label: "Corrige les deux calculs.", pts: 2 }, { label: "Vérifie ta correction du premier calcul en remplaçant " + M("x") + " par 2 des deux côtés.", pts: 1 }],
sol: ul(["Premier : " + M("-" + a + " \\cdot (-" + c + ") = +" + a * c) + " (moins par moins donne plus). Second : le « − » devant la parenthèse change le signe de <b>tous</b> les termes : " + M("-(-" + f + ") = +" + f) + ".",
M("-" + a + "(" + b + "x - " + c + ") = -" + a * b + "x + " + a * c) + " ; " + M(d + "x - " + e + "x + " + f + " = " + (d - e) + "x + " + f) + ".",
"Gauche : " + M("-" + a + " \\cdot (" + 2 * b + " - " + c + ") = " + -a * (2 * b - c)) + " ; droite : " + M("-" + 2 * a * b + " + " + a * c + " = " + (-2 * a * b + a * c)) + " ✓."]),
chk: [[-a * (2 * b - c) === -2 * a * b + a * c, "vérification"], [d - e >= 2, "réduit"]], vals: [a * c, d - e, f].filter((v) => v > 1) }); },

() => VF({ id: "litconv", titre: "Vrai ou faux ? Justifie" }, [
() => { const v = pk([2, 3, 4]), k = pk([3, 5]); return ["Pour " + M("x = -" + v) + ", " + M(k + "x^2") + " vaut " + M(N(k * k * v * v)) + ".", false, M(k + " \\cdot (-" + v + ")^2 = " + k + " \\cdot " + v * v + " = " + k * v * v) + " : le carré ne porte que sur " + M("x") + " ; " + M(N(k * k * v * v)) + " serait " + M("(" + k + "x)^2") + "."]; },
() => ["« " + M("a \\cdot a = 2a") + " »", false, M("a \\cdot a = a^2") + " ; contre-exemple " + M("a = 3") + " : 9 et 6."],
() => { const p = pk([2, 3, 4]), q = pk([5, 6, 7]); return [M(p + "x + " + q + "x^2 = " + (p + q) + "x^3"), false, "Les termes " + M(p + "x") + " et " + M(q + "x^2") + " ne sont pas semblables : on ne peut pas les additionner. Contre-exemple " + M("x = 2") + " : " + M(p + " \\cdot 2 + " + q + " \\cdot 4 = " + (2 * p + 4 * q)) + ", mais " + M((p + q) + " \\cdot 8 = " + 8 * (p + q)) + "."]; },
() => [M("-x^2") + " est négatif ou nul pour tous les nombres " + M("x") + ".", true, M("x^2 \\ge 0") + ", donc " + M("-x^2 = -(x^2) \\le 0") + " ; par exemple " + M("x = -3") + " : " + M("-9") + "."],
() => { const k = pk([2, 3]); return [M("(" + k + "x)^3 = " + k + "x^3"), false, M("(" + k + "x)^3 = " + k + "x \\cdot " + k + "x \\cdot " + k + "x = " + k ** 3 + "x^3") + " : le coefficient aussi est au cube."]; },
() => { let p, q, r, s; do { p = R.int(2, 6); q = R.int(2, 6); r = R.int(2, 5); s = R.int(1, 6); } while (p === r); return [M(p + "(x - " + q + ") - " + r + "(x + " + s + ") = " + lin(p - r, -(p * q + r * s))), true, M(p + "x - " + p * q + " - " + r + "x - " + r * s + " = " + lin(p - r, -(p * q + r * s))) + " : les deux côtés ont la même forme réduite."]; },
() => ["« " + M("(a + b)^2 = a^2 + b^2") + " pour tous les nombres " + M("a") + " et " + M("b") + " »", false, "Contre-exemple " + M("a = 2") + ", " + M("b = 3") + " : " + M("(2 + 3)^2 = 25") + " mais " + M("2^2 + 3^2 = 13") + ". Un seul contre-exemple suffit."],
]),

() => { let p, q, r, s; do { p = R.int(3, 6); q = R.int(2, 5); r = R.int(2, 7); s = R.int(2, 6); } while (p === r || Math.abs(p - r) === 1);
const A = p - r, B = -p * q - r * s, ok1 = lin(A, B), wrong1 = lin(A, -p * q + r * s), wrong2 = lin(A, -q - s), ok2 = p + "x - " + p * q + " - " + r + "x - " + r * s, L = sh([[ok1, true], [wrong1, false], [wrong2, false], [ok2, true]]).map((l, i) => [String(i + 1)].concat(l)), xv = 1;
const bad = L.find((l) => !l[2]), vBad = bad[1] === wrong1 ? A * xv - p * q + r * s : A * xv - q - s, vE = A * xv + B;
return X({ id: "litconv", lv: 2, titre: "Sont-elles équivalentes ?",
q: "On considère " + M("E = " + p + "(x - " + q + ") - " + r + "(x + " + s + ")") + " et quatre expressions : " + L.map((l) => "(" + l[0] + ") " + M(l[1])).join(" ; ") + ".",
parts: [{ label: "Développe et réduis " + M("E") + ".", pts: 2 }, { label: "Lesquelles des quatre expressions sont égales à " + M("E") + " pour toutes les valeurs de " + M("x") + " ?", pts: 1 }, { label: "Pour l'expression (" + bad[0] + "), montre par un contre-exemple qu'elle n'est pas équivalente à " + M("E") + ".", pts: 1 }],
sol: ul([M("E = " + p + "x - " + p * q + " - " + r + "x - " + r * s + " = " + ok1) + ".", "(" + L.filter((l) => l[2]).map((l) => l[0]).sort().join(") et (") + ") : la forme réduite et la forme développée non réduite.", "Pour " + M("x = 1") + " : " + M("E = " + vE) + ", mais l'expression (" + bad[0] + ") vaut " + M(vBad) + " (une valeur suffit)."]),
chk: [[vBad !== vE, "contre-exemple"], [wrong1 !== ok1 && wrong2 !== ok1, "distinctes"]], vals: [A, B].filter((v) => Math.abs(v) > 1) }); },

() => { let a, b, c, d, K; do { a = R.int(2, 5); b = R.int(2, 5); c = R.int(1, 9); d = R.int(1, 9); K = -a * c + b * d; } while (a === b || Math.abs(K) < 2);
const xs = pk(["17{,}3", "-2{,}75", "125"]);
return X({ id: "valnum", lv: 2, titre: "Deux méthodes",
q: "On veut calculer " + M("E = " + a + "(" + b + "x - " + c + ") - " + b + "(" + a + "x - " + d + ")") + " pour " + M("x = " + xs) + ". Léa remplace tout de suite " + M("x") + " par " + M(xs) + ". Noé développe et réduit d'abord.",
parts: [{ label: "Fais le calcul de Noé : développe et réduis " + M("E") + ".", pts: 2 }, { label: "Que vaut " + M("E") + " pour " + M("x = " + xs) + " ? Et pour " + M("x = -40") + " ?", pts: 1 }, { label: "Quelle méthode est la plus rapide ici ? Explique pourquoi la valeur ne dépend pas de " + M("x") + ".", pts: 1 }],
sol: ul([M(a * b + "x - " + a * c + " - " + a * b + "x + " + b * d + " = " + K) + ".", M("E = " + K) + " dans les deux cas.", "La méthode de Noé : les termes en " + M("x") + " s'annulent (" + M(a * b + "x - " + a * b + "x = 0") + "), il reste le nombre " + M(K) + " pour toute valeur de " + M("x") + "."]),
chk: [[a * (b * 3 - c) - b * (a * 3 - d) === K, "constante"]], vals: [a * b, K] }); },

() => { const p = R.int(2, 6), q = R.int(3, 7), m = R.int(2, 4), n = R.int(3, 5), k = R.int(2, 4), w = who();
return X({ id: "monomes", lv: 1, titre: "Trouve l'erreur",
q: w.n + " a écrit : " + M(p + "x \\cdot " + q + "x = " + p * q + "x") + " ; " + M("x^{" + m + "} \\cdot x^{" + n + "} = x^{" + m * n + "}") + " ; " + M("(-" + k + "x)^2 = -" + k * k + "x^2") + ".",
parts: [{ label: "Explique chaque erreur.", pts: 2 }, { label: "Écris les trois bons résultats.", pts: 2 }],
sol: ul([M("x \\cdot x = x^2") + ", pas " + M("x") + " ; on additionne les exposants (" + m + " + " + n + "), on ne les multiplie pas ; " + M("(-" + k + "x)^2 = (-" + k + "x) \\cdot (-" + k + "x)") + " : moins par moins donne plus.", M(p * q + "x^2") + " ; " + M("x^{" + (m + n) + "}") + " ; " + M(k * k + "x^2") + "."]),
chk: [[m + n !== m * n, "exposants"]], vals: [p * q, m + n, k * k] }); },
];

RICH.litt10 = { ids: ["litelab", "valnum", "reduire", "monomes", "distrib", "litconv"], label: "Calcul littéral (10e)", ex: EXL10, raison: RAISONL10, minutes: 45, grades: [10] };








const EXE10 = [

() => { let a, b, p, r2; do { a = pk([2, 3, 4]); b = a + pk([2, 3]); p = pk([12.5, 14.5, 15.5, 17.5, 18.5, 21.5]); r2 = pk([6, 8, 9.5, 11, 12.5]); } while (r2 >= p);
const r1 = r6(r2 + (b - a) * p), S = r6(a * p + r1), w1 = who(), w2 = who(w1.n), ev = pk(["billets pour le match de hockey", "places pour le concert", "billets pour le spectacle de cirque"]);
return X({ id: "probeq", lv: 1, titre: "Le prix du billet",
q: w1.n + " et " + w2.n + " ont la même somme d'argent. " + w1.n + " achète " + a + " " + ev + " et il lui reste " + chf(r1) + ". " + w2.n + " en achète " + b + ", au même prix, et il lui reste " + chf(r2) + ".",
parts: [{ label: "On appelle " + M("x") + " le prix d'un billet, en CHF. Écris, en fonction de " + M("x") + ", la somme que chacun avait au départ.", pts: 2 },
{ label: "Écris une équation, puis résous-la.", pts: 2 }, { label: "Quelle somme chacun avait-il au départ ? Vérifie avec les deux achats.", pts: 1 },
{ label: w2.n + " peut-" + w2.il + " encore acheter un billet ? Explique.", pts: 1 }],
sol: ul([w1.n + " : " + M(a + "x + " + N(r1)) + " ; " + w2.n + " : " + M(b + "x + " + N(r2)) + ".",
M(a + "x + " + N(r1) + " = " + b + "x + " + N(r2)) + " ; on soustrait " + M(a + "x") + " et " + M(N(r2)) + " des deux membres : " + M(N(r6(r1 - r2)) + " = " + (b - a) + "x") + ", donc " + M("x = " + N(r6(r1 - r2)) + " : " + (b - a) + " = " + N(p)) + ". Un billet coûte " + chf(p) + ".",
M(a + " \\cdot " + N(p) + " + " + N(r1) + " = " + N(S)) + " CHF et " + M(b + " \\cdot " + N(p) + " + " + N(r2) + " = " + N(S)) + " CHF ✓.",
"Non : il lui reste " + chf(r2) + ", moins que le prix d'un billet (" + chf(p) + ")."]),
chk: [[Math.abs(b * p + r2 - S) < 1e-9, "même somme"], [r2 < p, "reste"]], vals: [p, S, r1] }); },

() => { const C = pk([
{ q: (n, T) => "Dans une ferme, on compte " + n + " têtes et " + T + " pattes : il n'y a que des poules et des lapins.", A: "poules", B: "lapins", a: 2, b: 4, n: [14, 30] },
{ q: (n, T) => "Une tirelire contient " + n + " pièces : des pièces de 2 CHF et des pièces de 5 CHF, pour un total de " + T + " CHF.", A: "pièces de 2 CHF", B: "pièces de 5 CHF", a: 2, b: 5, n: [18, 36] },
{ q: (n, T) => "Une caisse contient " + n + " billets de 10 CHF et de 50 CHF, pour un total de " + N(T) + " CHF.", A: "billets de 10 CHF", B: "billets de 50 CHF", a: 10, b: 50, n: [16, 40] }]);
const n = R.int(C.n[0], C.n[1]), x = R.int(3, n - 3), T = C.a * x + C.b * (n - x), w = who(), D = C.b - C.a;
return X({ id: "probeq", lv: 2, titre: pk(["Combien de chaque sorte ?", "Deux sortes"]),
q: C.q(n, T),
parts: [{ label: "On appelle " + M("x") + " le nombre de " + C.A + ". Écris le nombre de " + C.B + " en fonction de " + M("x") + ".", pts: 1 },
{ label: "Écris une équation qui traduit l'énoncé.", pts: 2 }, { label: "Résous-la. Combien y a-t-il de " + C.A + " et de " + C.B + " ? Vérifie.", pts: 2 },
{ label: w.n + " a écrit " + M(C.a + "x + " + C.b + " \\cdot " + n + " - x = " + N(T)) + ". Explique son erreur.", pts: 1 }],
sol: ul([M(n + " - x") + ".", M(C.a + "x + " + C.b + "(" + n + " - x) = " + N(T)) + ".",
M(C.a + "x + " + N(C.b * n) + " - " + C.b + "x = " + N(T)) + ", " + M("-" + D + "x = " + N(T) + " - " + N(C.b * n) + " = " + N(T - C.b * n)) + ", " + M("x = " + x) + " : " + x + " " + C.A + " et " + (n - x) + " " + C.B + ". Vérification : " + M(C.a + " \\cdot " + x + " + " + C.b + " \\cdot " + (n - x) + " = " + N(T)) + " ✓.",
"Il manque les parenthèses : c'est le nombre de " + C.B + ", " + M(n + " - x") + ", qui est multiplié par " + C.b + " : " + M(C.b + "(" + n + " - x) = " + N(C.b * n) + " - " + C.b + "x") + ", et non " + M(N(C.b * n) + " - x") + "."]),
chk: [[(T - C.b * n) / -D === x, "solution"], [n - x >= 3, "positif"]], vals: [x, n - x, T] }); },

() => { const k = pk([16, 20, 24, 28, 32, 36, 40]), x = (180 - k) / 4; let y, d; do { y = R.int(4, 9); d = R.int(1, 3); } while (y <= d + 1);
const P = r6(2.5 * y + 1.5 * d), g = y + d, p = r6(g / 2);
return X({ id: "probeq", lv: 2, titre: "Angles et côtés",
q: "<b>Triangle ABC.</b> L'angle " + M("\\widehat{B}") + " mesure " + k + "° de plus que l'angle " + M("\\widehat{A}") + ", et l'angle " + M("\\widehat{C}") + " mesure le double de l'angle " + M("\\widehat{A}") + ".<br><b>Triangle DEF.</b> Son périmètre est de " + Q(P, "cm") + ". Le plus grand côté mesure " + Q(d, "cm") + " de plus que le côté moyen, et le plus petit côté mesure la moitié du plus grand.",
parts: [{ label: "Triangle ABC : avec " + M("x") + " la mesure de " + M("\\widehat{A}") + ", écris les trois angles en fonction de " + M("x") + ", puis une équation.", pts: 2 },
{ label: "Calcule les trois angles. Le triangle ABC est-il rectangle ?", pts: 2 },
{ label: "Triangle DEF : choisis une inconnue (dis ce qu'elle représente) et écris une équation.", pts: 2 },
{ label: "Calcule les trois côtés de DEF et vérifie avec le périmètre.", pts: 2 }],
sol: ul([M("\\widehat{A} = x") + ", " + M("\\widehat{B} = x + " + k) + ", " + M("\\widehat{C} = 2x") + " ; somme des angles : " + M("x + x + " + k + " + 2x = 180") + ".",
M("4x + " + k + " = 180") + ", " + M("4x = " + (180 - k)) + ", " + M("x = " + x) + " : " + M("\\widehat{A} = " + x + "°") + ", " + M("\\widehat{B} = " + (x + k) + "°") + ", " + M("\\widehat{C} = " + 2 * x + "°") + ". Non, aucun angle ne mesure 90°.",
"Avec " + M("y") + " le côté moyen (en cm) : grand côté " + M("y + " + d) + ", petit côté " + M("\\frac{y + " + d + "}{2}") + " ; " + M("y + (y + " + d + ") + \\frac{y + " + d + "}{2} = " + N(P)) + ".",
"On multiplie chaque terme par 2 : " + M("2y + 2y + " + 2 * d + " + y + " + d + " = " + N(2 * P)) + ", " + M("5y = " + N(2 * P - 3 * d)) + ", " + M("y = " + y) + ". Côtés : " + Q(p, "cm") + ", " + Q(y, "cm") + " et " + Q(g, "cm") + " ; " + M(N(p) + " + " + y + " + " + g + " = " + N(P)) + " ✓."]),
chk: [[x + x + k + 2 * x === 180 && Number.isInteger(x), "angles"], [p + y > g, "triangle"], [Math.abs(5 * y + 3 * d - 2 * P) < 1e-9, "périmètre"]], vals: [x, x + k, 2 * x, y, g, p] }); },

() => { let a, b, c, d, g, A, s1, h; do { a = R.int(3, 6); b = R.int(1, 5); c = R.int(1, 4); d = R.int(1, 9); g = pk([-3, -2, 2, 3, 4]); A = a - c - g; s1 = pk([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]); h = A * s1 - a * b + d; } while (Math.abs(A) < 2 || h === 0 || Math.abs(h) > 40);
let p, q, t, s2, r; do { p = pk([1.2, 1.5, 2.5, 0.8]); t = R.int(2, 5); q = R.int(1, 7); s2 = pk([-6, -4, -3, -2, 2, 3, 4, 5, 6, 8]); r = r6(p * (s2 + q) - t * s2); } while (Math.abs(r) < 0.5 || Math.abs(r6(p - t)) < 0.15);
const k = R.int(2, 5), m = R.int(1, 6), n = k * m + pk([-3, -2, 2, 3, 5]), e = R.int(2, 5), f = R.int(2, 6), w = who();
return X({ id: "eq1", lv: 2, titre: "Résous et vérifie",
q: "On considère les équations " + ul([M(a + "(x - " + b + ") - (" + lin(c, -d) + ") = " + lin(g, h)), M(N(p) + "(x + " + q + ") = " + N(r) + " + " + t + "x"), M(k + "(x + " + m + ") - x = " + lin(k - 1, n)), M(e + "(x - " + f + ") + 2x = x - " + e * f + " + " + (e + 1) + "x")]).replace(/<ol type="a" class="mock-parts">/, "<ol type=\"1\" class=\"mock-parts\">"),
parts: [{ label: "Résous l'équation 1, puis vérifie ta solution.", pts: 2 }, { label: "Résous l'équation 2.", pts: 2 },
{ label: "Résous les équations 3 et 4. Que se passe-t-il ?", pts: 2 }, { label: "Pour l'équation 3, " + w.n + " écrit « " + M("x = 0") + " ». A-t-" + w.il + " raison ? Explique.", pts: 1 }],
sol: ul([M(a + "x - " + a * b + " - " + cxT(c) + " + " + d + " = " + lin(g, h)) + " (le « − » change les deux signes), " + M(lin(A, 0) + " = " + N(h) + " + " + a * b + " - " + d + " = " + (A * s1)) + ", " + M("x = " + s1) + ". Vérification : " + M(a + " \\cdot " + sg(s1 - b) + " - " + sg(c * s1 - d) + " = " + (g * s1 + h)) + " et " + M(g + " \\cdot " + sg(s1) + " + " + sg(h) + " = " + (g * s1 + h)) + " ✓.",
M(cxT(p) + " + " + N(r6(p * q)) + " = " + N(r) + " + " + t + "x") + ", " + M(N(r6(p - t)) + "x = " + N(r6(r - p * q))) + ", " + M("x = " + s2) + ".",
"Équation 3 : " + M(k + "x + " + k * m + " - x = " + lin(k - 1, n)) + ", soit " + M(lin(k - 1, k * m) + " = " + lin(k - 1, n)) + " : les " + M("x") + " disparaissent et il reste " + M(k * m + " = " + n) + ", faux : <b>aucune solution</b>. Équation 4 : " + M(lin(e + 2, -e * f) + " = " + lin(e + 2, -e * f)) + " : il reste " + M("0 = 0") + ", vrai : <b>tous les nombres</b> sont solutions.",
"Non : pour " + M("x = 0") + ", le membre de gauche vaut " + M(k * m) + " et celui de droite " + M(n) + ". « Aucune solution » n'est pas « la solution 0 »."]),
chk: [[a * (s1 - b) - (c * s1 - d) === g * s1 + h, "vérif 1"], [Math.abs(p * (s2 + q) - (r + t * s2)) < 1e-9, "vérif 2"], [n !== k * m, "impossible"]], vals: [s1, s2, A] }); },

() => { const [pa, pb, ta, tb, au] = pk([[3, 2, "le tiers", "la moitié", "au tiers"], [4, 3, "le quart", "le tiers", "au quart"], [6, 3, "le sixième", "le tiers", "au sixième"], [4, 2, "le quart", "la moitié", "au quart"]]), k = pk([6, 7, 8, 9, 12, 15]), L = lcm(pa, pb), D = L / pb - L / pa, x = (L * k) / D, w = who();
const C = pk([["Un berger", "moutons", "son troupeau", "Ajoutez " + k + " moutons " + au + " de mon troupeau, et vous aurez " + tb + " de mon troupeau."], ["Une bibliothécaire", "livres", "son rayon de BD", "Si j'ajoute " + k + " livres " + au + " de mes BD, j'obtiens " + tb + " de mes BD."], ["Un collectionneur", "cartes", "sa collection", "Si j'ajoute " + k + " cartes " + au + " de ma collection, j'en ai " + tb + "."]]);
const wrong = k / D;
return X({ id: "eqfrac", lv: 3, titre: "Le tiers et la moitié",
q: C[0] + " répond à qui lui demande combien de " + C[1] + " compte " + C[2] + " : « " + C[3] + " »",
parts: [{ label: "On appelle " + M("x") + " le nombre total de " + C[1] + ". Écris une équation.", pts: 1 }, { label: "Résous-la.", pts: 2 },
{ label: "Vérifie ta réponse dans l'énoncé (pas seulement dans l'équation).", pts: 1 },
{ label: w.n + " a multiplié les deux membres par " + L + " et a écrit " + M((L / pa === 1 ? "" : L / pa) + "x + " + k + " = " + (L / pb) + "x") + ". Explique son erreur.", pts: 1 }],
sol: ul([M("\\frac{x}{" + pa + "} + " + k + " = \\frac{x}{" + pb + "}") + ".",
"On multiplie chaque terme par " + L + " : " + M((L / pa === 1 ? "" : L / pa) + "x + " + L * k + " = " + L / pb + "x") + ", " + M(L * k + " = " + (D === 1 ? "x" : D + "x")) + ", " + M("x = " + x) + ".",
ta.charAt(0).toUpperCase() + ta.slice(1) + " de " + x + " : " + M(x / pa) + " ; " + M(x / pa + " + " + k + " = " + (x / pa + k)) + ", et " + tb + " de " + x + " vaut bien " + M(x / pb) + " ✓.",
w.n + " n'a pas multiplié le nombre " + k + " par " + L + " : on multiplie <b>chaque terme</b> des deux membres. Avec son équation, il trouverait " + M("x = " + (Number.isInteger(wrong) ? wrong : frac(k, D))) + ", qui ne vérifie pas l'énoncé."]),
chk: [[Number.isInteger(x) && x / pa + k === x / pb, "énoncé"], [wrong !== x, "erreur visible"]], vals: [x, x / pa, x / pb] }); },

() => { let r1, r2, c0; do { r1 = R.int(2, 7); r2 = R.int(2, 9); c0 = pk([-4, -3, 1, 4, 5, 6, 8]); } while (r1 === r2 || r2 === -c0 || c0 === r1 || c0 === r2 || r1 * r2 > 45);
const S = r1 + r2, P = r1 * r2, L = sh([r1, r2, -r2, c0]), w = who();
let t, kk, e, f; do { t = pk([-4, -3, -2, 2, 3, 5]); kk = R.int(3, 6); e = R.int(1, 9); f = kk * t - e - t; } while (f === 0 || Math.abs(f) === 1);
const mm = R.int(2, 5), nn = R.int(2, 6), val = (v) => v * v + P, rv = (v) => S * v;
return X({ id: "eqverif", lv: 1, titre: "Est-ce une solution ?",
q: "On considère l'équation " + M("x^2 + " + P + " = " + S + "x") + " et les nombres " + L.map((v) => M(v)).join(" ; ") + ".",
parts: [{ label: "Teste chacun des quatre nombres. Lesquels sont solutions de l'équation ?", pts: 2 },
{ label: w.n + " affirme : « " + M(-r2) + " est aussi solution, puisque " + M("(" + -r2 + ")^2 = " + r2 + "^2") + " ». Explique pourquoi c'est faux.", pts: 1 },
{ label: "Teste les nombres " + M("0") + ", " + M("4") + " et " + M("-2") + " dans l'équation " + M(mm + "(x - " + nn + ") = " + mm + "x - " + mm * nn) + ". Que remarques-tu ? Explique.", pts: 2 },
{ label: "Pour quelle valeur de " + M("k") + " le nombre " + M(t) + " est-il solution de l'équation " + M("kx - " + e + " = " + lin(1, f)) + " ?", pts: 1 }],
sol: ul([L.map((v) => "Pour " + M(v) + " : " + M(val(v)) + " et " + M(rv(v)) + (val(v) === rv(v) ? " : solution" : " : non")).join(" ; ") + ". Les solutions sont " + M(Math.min(r1, r2)) + " et " + M(Math.max(r1, r2)) + ".",
"Le membre de gauche est bien le même (" + M(val(r2)) + "), mais celui de droite change de signe : " + M(S + " \\cdot (" + -r2 + ") = " + -S * r2) + ". Il faut tester les <b>deux</b> membres.",
"Pour les trois nombres, les deux membres sont égaux (" + M(mm * (0 - nn)) + ", " + M(mm * (4 - nn)) + ", " + M(mm * (-2 - nn)) + ") : en développant, " + M(mm + "(x - " + nn + ") = " + mm + "x - " + mm * nn) + " pour tout " + M("x") + ". Tous les nombres sont solutions.",
"On remplace " + M("x") + " par " + M(t) + " : " + M(sg(t) + "k - " + e + " = " + sg(t) + " + " + sg(f) + " = " + (t + f)) + ", " + M(sg(t) + "k = " + (t + f + e)) + ", " + M("k = " + kk) + "."]),
chk: [[val(r1) === rv(r1) && val(r2) === rv(r2) && val(-r2) !== rv(-r2) && val(c0) !== rv(c0), "solutions"], [kk * t - e === t + f, "k"]], vals: [r1, r2, kk] }); },
];
const RAISONE10 = [

() => { const a = R.int(2, 5), m = R.int(1, 4), s = R.int(2, 7), b = a * m, c = a * s + b;
let p, q, u, v, s2; do { p = R.int(3, 8); u = R.int(1, p - 2); q = R.int(1, 9); s2 = pk([2, 3, 4, 5, 6]); v = (p - u) * s2 - q; } while (v <= 0 || v === q);
const k = R.int(2, 5), mm = R.int(2, 6), s3 = pk([-3, -2, 2, 3, 4, 5, 7, 8]), nn = k * (s3 - mm), w = who();
return X({ id: "eq1", lv: 1, titre: "Cherche l'erreur",
q: w.n + " a résolu trois équations. Chaque résolution contient <b>une</b> erreur." + tab(["", "résolution"], [["A", M(a + "x + " + b + " = " + c) + " ; " + M("x + " + b + " = " + c / a) + " ; " + M("x = " + (c / a - b))], ["B", M(p + "x - " + q + " = " + u + "x + " + v) + " ; " + M(p + "x - " + u + "x = " + v + " - " + q) + " ; " + M(lin(p - u, 0) + " = " + (v - q)) + " ; " + M("x = " + (Number.isInteger((v - q) / (p - u)) ? (v - q) / (p - u) : frac(v - q, p - u)))], ["C", M(k + "(x - " + mm + ") = " + nn) + " ; " + M(k + "x - " + mm + " = " + nn) + " ; " + M(k + "x = " + (nn + mm))]]),
parts: [{ label: "Pour chaque résolution, trouve la ligne fausse et explique l'erreur.", pts: 3 }, { label: "Corrige les trois résolutions.", pts: 3 }, { label: "Vérifie ta solution de B dans l'équation de départ.", pts: 1 }],
sol: ul(["A : on a divisé seulement " + M(a + "x") + " par " + a + " ; il faut diviser <b>chaque terme</b> (ou soustraire " + b + " d'abord). B : " + M(q) + " change de membre sans changer de signe ; il faut ajouter " + q + " des deux côtés. C : le " + k + " ne multiplie pas le " + mm + " ; il faut distribuer.",
"A : " + M(a + "x = " + (c - b)) + ", " + M("x = " + s) + ". B : " + M(lin(p - u, 0) + " = " + v + " + " + q + " = " + (v + q)) + ", " + M("x = " + s2) + ". C : " + M(k + "x - " + k * mm + " = " + nn) + ", " + M(k + "x = " + (nn + k * mm)) + ", " + M("x = " + s3) + ".",
M(p + " \\cdot " + s2 + " - " + q + " = " + (p * s2 - q)) + " et " + M(u + " \\cdot " + s2 + " + " + v + " = " + (u * s2 + v)) + " ✓."]),
chk: [[p * s2 - q === u * s2 + v, "B"], [a * s + b === c && c / a - b !== s, "A"], [k * (s3 - mm) === nn, "C"]], vals: [s, s2, s3] }); },

() => VF({ id: "eq1", titre: "Vrai ou faux ? Justifie" }, [
() => { const a = R.int(2, 6), b = R.int(1, 5), c = b + R.int(1, 4); return ["L'équation " + M(a + "x + " + b + " = " + a + "x + " + c) + " n'a aucune solution.", true, "Pour tout " + M("x") + ", le membre de droite vaut " + (c - b) + " de plus : en soustrayant " + M(a + "x") + ", il reste " + M(b + " = " + c) + ", faux."]; },
() => { const a = R.int(5, 9), b = R.int(2, 4); return ["L'équation " + M(a + "x = " + b + "x") + " n'a pas de solution.", false, M("x = 0") + " est solution : " + M(a + " \\cdot 0 = " + b + " \\cdot 0") + ". En effet " + M((a - b) + "x = 0") + " donne " + M("x = 0") + "."]; },
() => { const a = pk([3, 4, 5]), b = R.int(2, 9); return ["Si " + M("\\frac{x}{" + a + "} = " + b) + ", alors " + M("x = \\frac{" + b + "}{" + a + "}") + ".", false, "On multiplie les deux membres par " + a + " : " + M("x = " + a * b) + "."]; },
() => { const a = R.int(2, 6), b = R.int(2, 6); return ["Tous les nombres sont solutions de " + M(a + "(x + " + b + ") = " + a + "x + " + a * b) + ".", true, "En développant, les deux membres sont égaux pour tout " + M("x") + "."]; },
() => ["Multiplier les deux membres d'une équation par 0 donne une équation équivalente.", false, "On obtient " + M("0 = 0") + ", vrai pour tout nombre : on a perdu l'information. On multiplie ou on divise seulement par un nombre <b>non nul</b>."],
() => { const b = R.int(3, 9); return [M("-x = " + b) + " donne " + M("x = " + b) + ".", false, "On multiplie par " + M("-1") + " : " + M("x = -" + b) + "."]; },
() => { const b = pk([4, 9, 16, 25]); return ["L'équation " + M("x^2 = " + b) + " a une seule solution, " + M(Math.sqrt(b)) + ".", false, M("(-" + Math.sqrt(b) + ")^2 = " + b) + " aussi : il y a deux solutions, " + M(Math.sqrt(b)) + " et " + M(-Math.sqrt(b)) + "."]; },
]),

() => { let k, m, n, p, x0, A, c0; do { k = R.int(2, 5); m = R.int(2, 3); n = R.int(1, 6); p = R.int(1, 7); x0 = pk([-5, -4, -3, -2, 2, 3, 4, 5, 6]); A = k * m - p; c0 = A * x0 - k * n; } while (A < 2 || c0 === 0 || c0 + k * n === 0 || p === k * m);
const lines = [M(k + "(" + m + "x - " + n + ") = " + lin(p, c0)), M(k * m + "x - " + k * n + " = " + lin(p, c0)), M(lin(A, -k * n) + " = " + N(c0)), M(lin(A, 0) + " = " + N(c0 + k * n)), M("x = " + x0)];
return X({ id: "eq1", lv: 2, titre: "Équivalentes, mais comment ?",
q: "Voici une suite d'équations équivalentes :" + tab(["ligne", "équation"], lines.map((l, i) => [String(i + 1), l])),
parts: [{ label: "Explique comment on passe de chaque ligne à la suivante.", pts: 3 }, { label: "Vérifie la solution dans l'équation de la ligne 1.", pts: 1 }, { label: "Pourquoi dit-on que ces cinq équations sont « équivalentes » ?", pts: 1 }],
sol: ul(["1 → 2 : on développe (le " + k + " multiplie les deux termes). 2 → 3 : on soustrait " + M(p + "x") + " des deux membres. 3 → 4 : on ajoute " + k * n + " aux deux membres. 4 → 5 : on divise les deux membres par " + A + ".",
M(k + " \\cdot (" + m + " \\cdot " + sg(x0) + " - " + n + ") = " + k * (m * x0 - n)) + " et " + M(p + " \\cdot " + sg(x0) + " + " + sg(c0) + " = " + (p * x0 + c0)) + " ✓.",
"Elles ont les mêmes solutions (ici " + M("x = " + x0) + ") : chaque passage est une opération faite des deux côtés, qu'on peut défaire."]),
chk: [[k * (m * x0 - n) === p * x0 + c0, "solution"]], vals: [x0, A] }); },

() => { const K = pk([24, 30, 36, 42, 48]), E = [["La somme d'un nombre et de sa moitié vaut " + K + ".", "x + \\frac{x}{2} = " + K, (2 * K) / 3], ["Le double d'un nombre, diminué de " + K + ", est égal à ce nombre.", "2x - " + K + " = x", K], ["Le double de la différence entre un nombre et " + K + " est égal à ce nombre.", "2(x - " + K + ") = x", 2 * K], ["La différence entre un nombre et sa moitié vaut " + K + ".", "x - \\frac{x}{2} = " + K, 2 * K]];
const eqs = sh(E.map((e, i) => [e[1], i]).concat([["\\frac{x}{2} - " + K + " = x", -1]])), lab = (i) => String.fromCharCode(97 + eqs.findIndex((e) => e[1] === i));
return X({ id: "probeq", lv: 1, titre: "Trouve la bonne traduction",
q: "Phrases : " + E.map((e, i) => "(" + (i + 1) + ") " + e[0]).join(" ") + "<br>Équations : " + eqs.map((e, j) => String.fromCharCode(97 + j) + ") " + M(e[0])).join(" ; ") + ".",
parts: [{ label: "Associe chaque phrase à son équation (une équation est en trop).", pts: 2 }, { label: "Résous les équations des phrases 1 et 2.", pts: 2 }, { label: "Les phrases 3 et 4 ont-elles la même solution ? Leurs équations sont-elles équivalentes ?", pts: 1 }],
sol: ul(["(1) → " + lab(0) + ", (2) → " + lab(1) + ", (3) → " + lab(2) + ", (4) → " + lab(3) + ".", "(1) " + M("\\frac{3x}{2} = " + K) + ", " + M("x = " + (2 * K) / 3) + ". (2) " + M("x = " + K) + ".", "(3) " + M("2x - " + 2 * K + " = x") + ", " + M("x = " + 2 * K) + " ; (4) " + M("\\frac{x}{2} = " + K) + ", " + M("x = " + 2 * K) + ". Même solution : les deux équations sont équivalentes, même si elles ne se ressemblent pas."]),
chk: [[(2 * K) % 3 === 0, "entier"]], vals: [(2 * K) / 3, K, 2 * K] }); },

() => { const t = pk([-7, -5, -4, -3, 3, 4, 6, 8, 9]), a = R.int(1, 5), w = who();
return X({ id: "eq1", lv: 2, titre: "Construis une équation",
q: "Il ne s'agit plus de résoudre, mais d'inventer des équations.",
parts: [{ label: "Écris une équation avec des " + M("x") + " dans les deux membres et une parenthèse, dont la solution est " + M(t) + ". Vérifie-la.", pts: 2 }, { label: "Écris une équation qui n'a aucune solution.", pts: 1 }, { label: "Écris une équation dont tous les nombres sont solutions.", pts: 1 },
{ label: w.n + " affirme : « Une équation du 1er degré a toujours exactement une solution. » Qu'en penses-tu ?", pts: 1 }],
sol: ul(["Par exemple " + M("2(x + " + a + ") = " + lin(1, 2 * a + t)) + " : pour " + M("x = " + t) + ", " + M("2 \\cdot " + sg(t + a) + " = " + 2 * (t + a)) + " et " + M(sg(t) + " + " + sg(2 * a + t) + " = " + 2 * (t + a)) + " ✓ (autres réponses possibles).", "Par exemple " + M("x + 1 = x + 2") + " : on obtient " + M("1 = 2") + ", faux.", "Par exemple " + M("3(x + 1) = 3x + 3") + " : on obtient " + M("0 = 0") + ", vrai.", "Faux : les parties b) et c) donnent des contre-exemples (aucune solution, tous les nombres)."]),
chk: [[2 * (t + a) === t + 2 * a + t, "exemple"]], vals: [t, 2 * (t + a)].filter((v) => Math.abs(v) > 1) }); },
];

RICH.eq10 = { ids: ["eqverif", "eq1", "eqfrac", "probeq"], label: "Équations (10e)", ex: EXE10, raison: RAISONE10, minutes: 45, grades: [10] };

})();







(function () {
const { r6, N, Nk, A, Q, pk, sh, X, ul, who, VF } = RICHU;
const rd = (v, s) => Math.round(v / s) * s;
const Ad = (v, k) => Nk(v, k);
const EXPY10 = [

() => { const h = pk([5, 5.5, 6, 6.5]), d = pk([1.5, 2, 2.5]), L = Math.sqrt(h * h + d * d), L2 = pk([5, 6, 7].filter((v) => v < L && v > h - 1.2)), h2 = r6(Math.min(h - pk([0.5, 0.8, 1]), rd(L2 * 0.92, 0.1))), d2 = Math.sqrt(L2 * L2 - h2 * h2), q4 = L2 / 4, h4 = Math.sqrt(L2 * L2 - q4 * q4);
return X({ id: "pyth", lv: 1, titre: "L'échelle sous la fenêtre",
q: "Une fenêtre se trouve à " + Q(h, "m") + " au-dessus du sol. On appuie une échelle contre le mur vertical : son sommet doit arriver juste sous la fenêtre.",
parts: [{ label: "Le pied de l'échelle est à " + Q(d, "m") + " du mur. Quelle doit être la longueur de l'échelle (au centième) ?", pts: 2 },
{ label: "On n'a qu'une échelle de " + Q(L2, "m") + ". On veut atteindre " + Q(h2, "m") + " de haut. À quelle distance du mur faut-il placer le pied (au centième) ?", pts: 2 },
{ label: "Par sécurité, le pied doit être à environ un quart de la longueur de l'échelle. Avec l'échelle de " + Q(L2, "m") + " placée ainsi, quelle hauteur atteint-on (au centième) ? Est-ce assez pour la fenêtre ?", pts: 2 },
{ label: "Fais un croquis de la situation de la question a) et colorie l'hypoténuse.", pts: 1 }],
sol: ul([M("L^2 = " + N(h) + "^2 + " + N(d) + "^2 = " + N(h * h + d * d)) + ", " + M("L = \\sqrt{" + N(h * h + d * d) + "} \\approx " + Ad(L, 2)) + " m.",
"L'échelle est l'hypoténuse : on soustrait. " + M("x^2 = " + N(L2) + "^2 - " + N(h2) + "^2 = " + N(L2 * L2 - h2 * h2)) + ", " + M("x \\approx " + Ad(d2, 2)) + " m.",
"Pied à " + M(N(L2) + " : 4 = " + N(q4)) + " m : " + M("\\sqrt{" + N(L2) + "^2 - " + N(q4) + "^2} \\approx " + Ad(h4, 2)) + " m. " + (h4 >= h ? "C'est assez : " + M(Ad(h4, 2) + " \\geq " + N(h)) + "." : "Ce n'est pas assez : " + M(Ad(h4, 2) + " < " + N(h)) + " m."),
"Triangle rectangle formé par le mur (" + N(h) + " m), le sol (" + N(d) + " m) et l'échelle : l'échelle, en face de l'angle droit, est l'hypoténuse."]),
chk: [[L2 < L && L2 > h2, "échelle possible"], [d2 > 0.3, "pied"]], vals: [L, d2, h4] }); },

() => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), s = pk([7.5, 6, 6.5]), dd = Math.sqrt(s * s - (s * 0.6) ** 2), w = who();
return X({ id: "pythfig", lv: 1, titre: "Le losange",
q: "Un carreau de vitrail a la forme d'un losange dont les diagonales mesurent " + Q(2 * a, "cm") + " et " + Q(2 * b, "cm") + ".",
parts: [{ label: "Calcule la longueur d'un côté du losange.", pts: 2 }, { label: "Calcule son périmètre et son aire.", pts: 2 },
{ label: w.n + " écrit : « le côté vaut " + M("\\sqrt{" + 2 * a + "^2 + " + 2 * b + "^2}") + " ». Explique son erreur.", pts: 1 },
{ label: "Un autre losange a des côtés de " + Q(s, "cm") + " et une diagonale de " + Q(r6(2 * s * 0.6), "cm") + ". Calcule l'autre diagonale.", pts: 2 }],
sol: ul(["Les diagonales se coupent en leur milieu à angle droit : " + M("c = \\sqrt{" + a + "^2 + " + b + "^2} = \\sqrt{" + c * c + "} = " + c) + " cm.",
"Périmètre " + M("4 \\cdot " + c + " = " + 4 * c) + " cm ; aire " + M("\\frac{" + 2 * a + " \\cdot " + 2 * b + "}{2} = " + 2 * a * b) + " cm².",
w.n + " a pris les diagonales entières : les cathètes du triangle rectangle sont les <b>demi</b>-diagonales, " + M(a) + " et " + M(b) + " cm.",
"Demi-diagonale connue " + M(N(s * 0.6)) + " cm : " + M("\\sqrt{" + N(s) + "^2 - " + N(s * 0.6) + "^2} = \\sqrt{" + N(s * s - (s * 0.6) ** 2) + "} = " + N(dd)) + " cm, donc l'autre diagonale vaut " + M(N(2 * dd)) + " cm."]),
chk: [[Math.abs(dd - s * 0.8) < 1e-9, "3-4-5"]], vals: [c, 4 * c, 2 * a * b, 2 * dd] }); },

() => { const [p, h, s] = pk([[9, 12, 15], [12, 16, 20], [15, 20, 25], [10, 24, 26], [18, 24, 30]]), b = pk([20, 25, 30, 35]), B = b + p, Ar = ((B + b) * h) / 2, P = B + b + h + s, px = pk([4.5, 6, 7.5]);
const fig = GEO().pt("A", 0, 0, false).pt("B", B, 0, false).pt("C", b, h, false).pt("E", 0, h, false).poly(["A", "B", "C", "E"]).right("A", "B", "E").right("E", "A", "C").side("A", "B", B + " m").side("E", "C", b + " m").side("B", "C", s + " m").svg("parcelle en trapèze rectangle");
return X({ id: "pythfig", lv: 2, titre: "La parcelle",
q: "Une parcelle a la forme d'un trapèze rectangle (deux angles droits) : ses côtés parallèles mesurent " + Q(B, "m") + " et " + Q(b, "m") + ", et le côté oblique " + Q(s, "m") + "." + fig,
parts: [{ label: "Calcule la largeur de la parcelle (la distance entre les deux côtés parallèles).", pts: 2 }, { label: "Calcule son aire.", pts: 1 },
{ label: "On pose une clôture tout autour. Quelle longueur faut-il ?", pts: 1 }, { label: "Le gazon coûte " + M(Nk(px, 2) + "\\ \\text{CHF}") + " le m². Combien coûte le gazon pour toute la parcelle ?", pts: 1 }],
sol: ul(["On abaisse la hauteur depuis l'extrémité du petit côté : triangle rectangle de cathètes " + M(B + " - " + b + " = " + p) + " m et " + M("h") + ", d'hypoténuse " + M(s) + " m. " + M("h = \\sqrt{" + s + "^2 - " + p + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.",
M("\\frac{(" + B + " + " + b + ") \\cdot " + h + "}{2} = " + N(Ar)) + " m².", M(B + " + " + b + " + " + h + " + " + s + " = " + P) + " m (le côté perpendiculaire mesure la largeur, " + h + " m).", M(N(Ar) + " \\cdot " + Nk(px, 2) + " = " + Nk(Ar * px, 2)) + " CHF."]),
chk: [[p * p + h * h === s * s, "triplet"]], vals: [h, Ar, P, Ar * px] }); },

() => { const [a, b, c] = pk([[6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20]]), h = (a * b) / c, [L, l] = pk([[15, 8], [24, 7], [12, 5], [21, 20]]), dg = Math.sqrt(L * L + l * l), x = (L * l) / dg;
return X({ id: "pyth", lv: 2, titre: "La hauteur sur l'hypoténuse",
q: "Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AC = " + a) + " cm et " + M("AB = " + c) + " cm.",
parts: [{ label: "Quel côté est l'hypoténuse ? Calcule " + M("BC") + ".", pts: 2 }, { label: "Calcule l'aire du triangle.", pts: 1 },
{ label: "Calcule la hauteur issue de " + M("C") + " (perpendiculaire à " + M("[AB]") + ") en écrivant l'aire d'une autre façon.", pts: 2 },
{ label: "Un rectangle mesure " + Q(L, "cm") + " sur " + Q(l, "cm") + ". Quelle est la distance d'un sommet à la diagonale qui ne passe pas par ce sommet (au centième) ?", pts: 2 }],
sol: ul([M("[AB]") + ", en face de l'angle droit. " + M("BC = \\sqrt{" + c + "^2 - " + a + "^2} = \\sqrt{" + b * b + "} = " + b) + " cm.",
M("\\frac{" + a + " \\cdot " + b + "}{2} = " + (a * b) / 2) + " cm² (les cathètes sont perpendiculaires : l'une est la hauteur de l'autre).",
M("\\frac{" + c + " \\cdot h}{2} = " + (a * b) / 2) + ", donc " + M("h = \\frac{" + a * b + "}{" + c + "} = " + N(h)) + " cm.",
"Diagonale " + M("\\sqrt{" + L + "^2 + " + l + "^2} = " + N(dg)) + " cm ; le demi-rectangle est un triangle rectangle d'aire " + M("\\frac{" + L + " \\cdot " + l + "}{2} = " + (L * l) / 2) + " cm², donc " + M("x = \\frac{" + L * l + "}{" + N(dg) + "} \\approx " + Ad(x, 2)) + " cm."]),
chk: [[Number.isInteger(dg), "diagonale entière"]], vals: [b, (a * b) / 2, h, x] }); },

() => { const [w, H, p] = pk([[80, 150, 60], [60, 120, 45], [50, 160, 40], [70, 140, 55]]), df0 = Math.sqrt(w * w + H * H + p * p), S = Math.round(df0) + pk([-7, -4, 4, 7]), df = Math.sqrt(w * w + H * H), D = Math.sqrt(w * w + H * H + p * p), b = Math.sqrt(w * w + p * p), ok = S < D;
return X({ id: "pythfig", lv: 3, titre: "Le casier de consigne",
q: "Dans une gare, les casiers de consigne sont des pavés de " + Q(w, "cm") + " de large, " + Q(H, "cm") + " de haut et " + Q(p, "cm") + " de profondeur." + FIG.box(w + " cm", p + " cm", H + " cm"),
parts: [{ label: "Calcule la diagonale de la face avant (largeur × hauteur), au dixième.", pts: 1 }, { label: "Calcule la grande diagonale du casier (d'un coin du bas au coin opposé du haut), au dixième.", pts: 2 },
{ label: "Peut-on y ranger une paire de skis de " + Q(S, "cm") + " ? Justifie.", pts: 1 }, { label: "Quelle est la plus longue canne qu'on peut poser à plat sur le fond du casier (au dixième) ?", pts: 1 }],
sol: ul([M("\\sqrt{" + w + "^2 + " + H + "^2} = \\sqrt{" + (w * w + H * H) + "} \\approx " + Ad(df, 1)) + " cm.",
"Triangle rectangle (diagonale de la face avant, profondeur) : " + M("\\sqrt{" + (w * w + H * H) + " + " + p + "^2} = \\sqrt{" + (w * w + H * H + p * p) + "} \\approx " + Ad(D, 1)) + " cm.",
ok ? "Oui : " + M(S + " < " + Ad(D, 1)) + ", en les plaçant selon la grande diagonale." : "Non : " + M(S + " > " + Ad(D, 1)) + " ; même en diagonale, les skis sont trop longs.",
"Diagonale du fond : " + M("\\sqrt{" + w + "^2 + " + p + "^2} = \\sqrt{" + (w * w + p * p) + "} \\approx " + Ad(b, 1)) + " cm."]),
chk: [[Math.abs(S - D) > 3, "écart net"]], vals: [df, D, b] }); },

() => { const [c, s, h] = pk([[8, 9, 7], [12, 11, 7], [16, 12, 4], [12, 9, 3]]), ap = Math.sqrt(s * s - (c / 2) ** 2);
return X({ id: "pythfig", lv: 3, titre: "La pyramide",
q: "Une pyramide régulière a une base carrée de " + Q(c, "cm") + " de côté ; ses quatre arêtes latérales mesurent " + Q(s, "cm") + ". Son sommet est à la verticale du centre de la base." + FIG.pyramid(c + " cm", "h"),
parts: [{ label: "Calcule la diagonale de la base (valeur exacte et valeur au dixième).", pts: 1 }, { label: "Calcule la hauteur de la pyramide.", pts: 2 },
{ label: "Calcule l'apothème (hauteur d'une face triangulaire), au dixième.", pts: 2 }, { label: "Pourquoi utilise-t-on la demi-diagonale pour la hauteur, mais le demi-côté pour l'apothème ?", pts: 1 }],
sol: ul([M("d = \\sqrt{" + c + "^2 + " + c + "^2} = \\sqrt{" + 2 * c * c + "} \\approx " + Ad(Math.sqrt(2 * c * c), 1)) + " cm.",
"Triangle rectangle (hauteur, demi-diagonale, arête) : " + M("\\left(\\frac{d}{2}\\right)^2 = \\frac{" + 2 * c * c + "}{4} = " + c * c / 2) + ", " + M("h = \\sqrt{" + s + "^2 - " + c * c / 2 + "} = \\sqrt{" + h * h + "} = " + h) + " cm.",
"Triangle rectangle (apothème, demi-côté, arête) : " + M("\\sqrt{" + s + "^2 - " + c / 2 + "^2} = \\sqrt{" + (s * s - c * c / 4) + "} \\approx " + Ad(ap, 1)) + " cm.",
"Sous l'arête, le pied de la hauteur est le centre, au bout d'une demi-diagonale ; l'apothème tombe au milieu d'un côté de la base, à un demi-côté du coin."]),
chk: [[s * s - c * c / 2 === h * h, "hauteur entière"]], vals: [h, ap] }); },
];
const RAISONPY10 = [

() => { const [a, b, c] = pk([[6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17]]), w = who(), w2 = who(w.n);
return X({ id: "pyth", lv: 1, titre: "Trouve l'erreur",
q: "Dans un triangle rectangle, les cathètes mesurent " + Q(a, "cm") + " et " + Q(b, "cm") + ". " + w.n + " répond « l'hypoténuse mesure " + M(a + b) + " cm », " + w2.n + " répond « elle mesure " + M(c * c) + " cm ». Puis, pour un triangle d'hypoténuse " + Q(c, "cm") + " et de cathète " + Q(a, "cm") + ", ils calculent l'autre cathète : " + M("\\sqrt{" + c + "^2 + " + a + "^2} \\approx " + Ad(Math.sqrt(c * c + a * a), 2)) + " cm.",
parts: [{ label: "Explique l'erreur de " + w.n + ", puis celle de " + w2.n + ".", pts: 2 }, { label: "Quelle est l'erreur dans le calcul de l'autre cathète ? Comment pouvait-on voir, sans calculer, que le résultat est faux ?", pts: 2 }, { label: "Donne les bonnes réponses.", pts: 1 }],
sol: ul([w.n + " a additionné les côtés : on additionne leurs <b>carrés</b>. " + w2.n + " a trouvé " + M("c^2 = " + c * c) + " mais a oublié la racine carrée.",
"On a additionné les carrés alors qu'on cherche une cathète : il faut soustraire. Une cathète est toujours plus courte que l'hypoténuse : " + M(Ad(Math.sqrt(c * c + a * a), 2) + " > " + c) + ", c'est impossible.",
"Hypoténuse " + M("\\sqrt{" + a * a + " + " + b * b + "} = " + c) + " cm ; autre cathète " + M("\\sqrt{" + c * c + " - " + a * a + "} = " + b) + " cm."]),
vals: [a + b, c * c, c, b] }); },

() => VF({ id: "pyth", titre: "Vrai ou faux ? Justifie" }, [
() => ["Dans n'importe quel triangle, le carré du plus grand côté est égal à la somme des carrés des deux autres.", false, "Seulement dans un triangle <b>rectangle</b>. Contre-exemple : le triangle équilatéral de côté 2 : " + M("2^2 = 4") + " mais " + M("2^2 + 2^2 = 8") + "."],
() => { const [a, b] = pk([[9, 16], [36, 64], [25, 144]]); return [M("\\sqrt{" + a + " + " + b + "} = \\sqrt{" + a + "} + \\sqrt{" + b + "}"), false, M("\\sqrt{" + (a + b) + "} = " + N(Math.sqrt(a + b))) + " mais " + M("\\sqrt{" + a + "} + \\sqrt{" + b + "} = " + (Math.sqrt(a) + Math.sqrt(b))) + " : la racine d'une somme n'est pas la somme des racines."]; },
() => ["Dans un triangle rectangle, une cathète peut être plus longue que l'hypoténuse.", false, "Non : " + M("c^2 = a^2 + b^2 > a^2") + ", donc " + M("c > a") + " ; l'hypoténuse est toujours le plus long côté."],
() => { const s = pk([5, 10, 20]); return ["La diagonale d'un carré de côté " + s + " cm mesure " + 2 * s + " cm.", false, M("\\sqrt{" + s + "^2 + " + s + "^2} = \\sqrt{" + 2 * s * s + "} \\approx " + Nk(Math.sqrt(2 * s * s), 1)) + " cm, moins que " + 2 * s + " cm (le chemin par deux côtés est plus long)."]; },
() => ["Si on double les deux cathètes d'un triangle rectangle, l'hypoténuse double aussi.", true, "Exemple : cathètes 3 et 4 → hypoténuse 5 ; cathètes 6 et 8 → " + M("\\sqrt{36 + 64} = 10") + ". En général " + M("(2a)^2 + (2b)^2 = 4(a^2 + b^2) = (2c)^2") + "."],
() => ["L'hypoténuse d'un triangle rectangle de cathètes 5 cm et 7 cm mesure entre 8 cm et 9 cm.", true, M("5^2 + 7^2 = 74") + ", et " + M("64 < 74 < 81") + " : " + M("8 < \\sqrt{74} < 9") + "."],
]),

() => { const [a, b] = pk([[4, 7], [5, 9], [3, 8], [6, 7]]), n = a * a + b * b, lo = Math.floor(Math.sqrt(n)), w = who();
return X({ id: "pyth", lv: 2, titre: "Estime avant de calculer",
q: "Un triangle rectangle a des cathètes de " + Q(a, "cm") + " et " + Q(b, "cm") + ".",
parts: [{ label: "Sans calculatrice, entre quels nombres entiers consécutifs se trouve l'hypoténuse ? Explique.", pts: 2 },
{ label: "Explique pourquoi l'hypoténuse est forcément plus longue que " + Q(b, "cm") + " et plus courte que " + Q(a + b, "cm") + ".", pts: 2 },
{ label: w.n + " trouve " + M(N(rd(Math.sqrt(n) * 1.4, 0.1))) + " cm. Sans refaire le calcul, comment sais-tu que c'est faux ? Donne la valeur exacte et la valeur au dixième.", pts: 1 }],
sol: ul([M(a + "^2 + " + b + "^2 = " + n) + " ; " + M(lo * lo + " < " + n + " < " + (lo + 1) ** 2) + ", donc l'hypoténuse est entre " + lo + " et " + (lo + 1) + " cm.",
"L'hypoténuse est le plus long côté (" + M("c^2 = " + b + "^2 + " + a + "^2 > " + b + "^2") + ") ; et le chemin direct est plus court que le chemin par les deux cathètes (" + M(n + " < (" + a + " + " + b + ")^2 = " + (a + b) ** 2) + ").",
M(N(rd(Math.sqrt(n) * 1.4, 0.1))) + " n'est pas entre " + lo + " et " + (lo + 1) + ". Valeur exacte " + M("\\sqrt{" + n + "}") + ", soit " + M("\\approx " + Nk(Math.sqrt(n), 1)) + " cm."]),
chk: [[!Number.isInteger(Math.sqrt(n)), "non entier"], [rd(Math.sqrt(n) * 1.4, 0.1) > lo + 1, "réponse fausse hors encadrement"]], vals: [n, lo, lo + 1] }); },

() => { const [P, Qn, Rn] = sh(["P", "Q", "R"]), [a, b, c] = pk([[20, 21, 29], [9, 40, 41], [12, 35, 37], [7, 24, 25]]);
return X({ id: "pyth", lv: 2, titre: "Où est l'hypoténuse ?",
q: "Le triangle " + M(P + Qn + Rn) + " est rectangle en " + M(Qn) + ". On connaît " + M(P + Qn + " = " + a) + " cm et " + M(P + Rn + " = " + c) + " cm.",
parts: [{ label: "Quel côté est l'hypoténuse ? Écris l'égalité de Pythagore pour ce triangle.", pts: 2 }, { label: "Calcule " + M(Qn + Rn) + ".", pts: 2 }, { label: "Calcule le périmètre et l'aire du triangle.", pts: 1 }],
sol: ul(["L'hypoténuse est le côté opposé à l'angle droit en " + M(Qn) + " : " + M("[" + P + Rn + "]") + ". " + M(P + Rn + "^2 = " + P + Qn + "^2 + " + Qn + Rn + "^2") + ".",
M(Qn + Rn + "^2 = " + c + "^2 - " + a + "^2 = " + (c * c - a * a)) + ", donc " + M(Qn + Rn + " = " + b) + " cm.",
"Périmètre " + M(a + " + " + b + " + " + c + " = " + (a + b + c)) + " cm ; aire " + M("\\frac{" + a + " \\cdot " + b + "}{2} = " + (a * b) / 2) + " cm²."]),
vals: [b, a + b + c, (a * b) / 2] }); },
];

RICH.pyth10 = { ids: ["pyth", "pythfig"], label: "Théorème de Pythagore (10e)", ex: EXPY10, raison: RAISONPY10, minutes: 45, grades: [10] };
})();

