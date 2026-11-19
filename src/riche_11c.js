// Chantier 11e (19.11) : exercices riches et raisonnements du test de préparation pour 7. Angles, 8. Thalès,
// 10. Fonctions, 11. Transformations (homothéties), 12. Probabilités — au niveau d'un vrai test de 11e (contexte,
// plusieurs étapes, interprétation), pas du drill. Même format que riche_11b.js. Chargé après riche.js.
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

  // ===================== 7. Angles =====================
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

  // ===================== 8. Thalès =====================
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
    () => { const k = pk([2, 3]), ao = pk([2, 3, 4]), ab = pk([3, 4, 5]);
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

  // ===================== 10. Fonctions =====================
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
    () => { const t0 = pk([18, 20, 22]), d = pk([3, 4, 5]);
      return X({ id: "affine", lv: 2, titre: "La température en altitude",
        q: "Au bord du lac (altitude " + Q(400, "m") + "), il fait " + M(t0 + "\\,°\\text{C}") + ". La température baisse de " + M(d / 5 * 5 === d ? d : d) + " °C chaque fois qu'on monte de " + Q(500, "m") + ".",
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

  // ===================== 11. Transformations (homothéties, similitudes) =====================
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

  // ===================== 12. Probabilités =====================
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

  // ===================== Révisions de 10e : 6. Puissances et racines, 10. Proportionnalité =====================
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
  ];
  const RAISONC = [
    () => X({ id: "carres", lv: 1, titre: "Trouve l'erreur", q: who() + " écrit : « " + M("\\sqrt{16 + 9} = \\sqrt{16} + \\sqrt{9} = 7") + " ».",
      parts: [{ label: "Où est l'erreur ?", pts: 1 }, { label: "Calcule correctement.", pts: 1 }],
      sol: ul(["La racine d'une somme n'est pas la somme des racines.", M("\\sqrt{25} = 5") + "."]) }),
    () => X({ id: "puiss", lv: 2, titre: "Vrai ou faux ? Justifie", q: "Pour chaque affirmation, dis si elle est vraie ou fausse, et justifie.",
      parts: [{ label: "« " + M("(-3)^2 = -9") + " »", pts: 1 }, { label: "« " + M("2^3 \\cdot 2^4 = 2^7") + " »", pts: 1 }, { label: "« " + M("0{,}2^2 = 0{,}4") + " »", pts: 1 }],
      sol: ul(["<b>Faux</b> : " + M("(-3) \\cdot (-3) = 9") + ".", "<b>Vrai</b> : on additionne les exposants.", "<b>Faux</b> : " + M("0{,}2 \\cdot 0{,}2 = 0{,}04") + "."]) }),
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
  RICH.fct11 = { ids: ["repere", "tabval", "affine"], label: "Fonctions", ex: EXF, raison: RAISONF, minutes: 45 };
  RICH.simil11 = { ids: ["simil"], label: "Homothéties et similitudes", ex: EXS, raison: RAISONS, minutes: 45 };
  RICH.proba11 = { ids: ["denombr", "proba"], label: "Probabilités", ex: EXP, raison: RAISONP2, minutes: 45 };
})();
