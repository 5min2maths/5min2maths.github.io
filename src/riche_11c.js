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
    () => { const k = pk([2, 3]), ao = pk([2, 3, 4]), ab = pk([3, 4, 5].filter((v) => v < 2 * ao + 1)) /* 26.11 : OA = 2, OB = 3, AB = 5 : triangle OAB aplati */;
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
    () => { const t0 = pk([15, 18, 21]), d = 3; /* 26.11 (vraisemblance, décision de l'enseignant) : ≈ −0,65 °C par 100 m, soit −3 °C par 500 m (et non 4 ou 5) */
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
    // 20.11 (commentaires testeurs : « questions identiques », « manque les racines cubiques et des calculs plus complexes ») :
    // banque élargie de 4 à 8 exercices, dont racines cubiques et calculs enchaînés.
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
  RICH.fct11 = { ids: ["repere", "tabval", "affine"], label: "Fonctions", ex: EXF, raison: RAISONF, minutes: 45, minA: 2 }; /* 25.11 : automatismes au niveau 2 (audit de niveau 11e) */
  RICH.simil11 = { ids: ["simil"], label: "Homothéties et similitudes", ex: EXS, raison: RAISONS, minutes: 45 };
  RICH.proba11 = { ids: ["denombr", "proba"], label: "Probabilités", ex: EXP, raison: RAISONP2, minutes: 45 };
})();

// ===================== Parcours EVACOM 11e (chantier L, 24.11) =====================
// Sujets blancs complets au format de l'EVACOM de 11e (épreuve cantonale de fin mai ; analyse et sources : tools/evacom.md).
// 95 min : partie 1 (50 min, sans calculatrice) puis partie 2 (45 min, calculatrice). 14 questions modelées sur les
// épreuves 2017, 2022, 2023 et le champ 2026-27 (proportionnalité, 2e degré, Thalès en plus) : formes écrites à neuf,
// valeurs et contextes tirés, jamais recopiés. Pas de barème (décision de l'enseignant) : on compte les questions.
// Chaque emplacement (SLOTS) a plusieurs formes ; un sujet évite les formes du sujet précédent.
// Une forme rend { id, also?, d, titre, q, parts: [énoncé de chaque sous-question], sol: [corrigé de chaque sous-question], fig? }.
// Ici dans le paquet 11 (riche_11c.js) : le parcours n'est proposé qu'aux élèves de 11e.
const EVACOM = (function () {
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const N = (v) => { const s = r6(v) < 0 ? "-" : ""; let [i, f] = String(Math.abs(r6(v))).split("."); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return s + i + (f ? "{,}" + f : ""); };
  const A = (v, k) => N(+(+v).toFixed(k));
  const un = (s) => "\\ \\text{" + s.replace(/\^([23])/, "}^$1\\text{") + "}";
  const Q = (v, s) => M(N(v) + un(s).replace(/\\text\{\}$/, ""));
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const mix = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const who = () => pk(["Léa", "Noé", "Lina", "Sam", "Yanis", "Inès", "Maël", "Zoé"]);
  // Rationnels [n, d] irréductibles.
  const qr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const qa = (a, b) => qr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), qs = (a, b) => qa(a, [-b[0], b[1]]);
  const qm = (a, b) => qr(a[0] * b[0], a[1] * b[1]), qd = (a, b) => qr(a[0] * b[1], a[1] * b[0]);
  const qt = (a) => frac(a[0], a[1]);
  const qp = (a) => (a[0] < 0 ? "\\left(" + qt(a) + "\\right)" : qt(a));
  const rf = (neg) => { for (;;) { const d = pk([2, 3, 4, 5, 6, 8, 9, 10]), n = R.int(1, 2 * d - 1); if (gcd(n, d) === 1) return qr(neg && R.rand() < 0.4 ? -n : n, d); } };
  const nice = (x) => x[1] <= 24 && Math.abs(x[0]) <= 60 && !(x[1] === 1 && Math.abs(x[0]) <= 1);
  // Polynômes en x, coefficients croissants [a0, a1, a2…].
  const pm = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => (r[i + j] += x * y))); return r; };
  const pa = (a, b, s = 1) => { const r = []; for (let i = 0; i < Math.max(a.length, b.length); i++) r.push((a[i] || 0) + s * (b[i] || 0)); return r; };
  const P = (a, v = "x") => poly(a.slice().reverse(), v);
  const L = (a, b, v = "x") => P([b, a], v); /* ax + b */
  const S = (vals) => "S = \\{" + vals.map((x) => (Array.isArray(x) ? qt(x) : N(x))).join(" ; ") + "\\}";
  const opts = (list) => "<div class=\"evc-opts\">" + list.map((o) => "<span class=\"evc-opt\">☐ " + o + "</span>").join("") + "</div>";
  const qcm = (good, bad) => { const all = [good].concat(bad.filter((b, i) => b !== good && bad.indexOf(b) === i)).slice(0, 4), r = mix(all); r.good = good; return r; };
  const sg = (n) => (n < 0 ? "- " + -n : "+ " + n);

  // ---------- Partie 1 · sans calculatrice ----------
  // 1. Fractions : trois calculs, fraction irréductible ou entier.
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

  // 2. Racines.
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
      const just = (x) => { if (!x.j) return x.t === N(x.v) ? M(x.t) + " est déjà un nombre décimal" : M(x.t + " \\approx " + A(x.v, 2)); /* 24.11 : plus de « 2,4 ≈ 2,4 » */ const lo = Math.floor(x.v * 10) / 10, e = x.j === "s" ? 2 : 3;
        return M(N(lo) + "^" + e + " = " + N(r6(lo ** e)) + " < " + x.n + " < " + N(r6((lo + 0.1) ** e)) + " = " + N(r6(lo + 0.1)) + "^" + e) + " : " + M(x.t) + " est entre " + M(N(lo)) + " et " + M(N(r6(lo + 0.1)));
      };
      const ord = items.slice().sort((a, b) => a.v - b.v);
      return { id: "rac", also: ["racprop", "fracconv"], d: 3, titre: "Comparer des nombres",
        q: "Range ces nombres dans l'ordre croissant, sans calculatrice. Justifie.", parts: [M(mix(items).map((x) => x.t).join(" \\; ; \\; "))],
        sol: [items.map(just).join(" ; ") + ".<br>" + M(ord.map((x) => x.t).join(" < "))] }; } return null; };

  // 3. « Mets une croix devant la proposition correcte. »
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

  // 4. Développer et réduire.
  const DV = [
    () => { const a = R.int(2, 4), b = R.int(1, 7), c = R.int(2, 4), d = R.int(1, 6), t1 = pm([-b, a], [-b, a]), t2 = pm([0, c], [-d, 1]); return { e: "(" + L(a, -b) + ")^2 - " + c + "x(" + L(1, -d) + ")", t: [t1, t2], r: pa(t1, t2, -1) }; },
    () => { const a = R.int(1, 8), b = R.int(1, 8), c = R.int(2, 6), t1 = pm([a, 1], [-b, 1]), t2 = pm([-c, 1], [c, 1]); return { e: "(" + L(1, a) + ")(" + L(1, -b) + ") - (" + L(1, -c) + ")(" + L(1, c) + ")", t: [t1, t2], r: pa(t1, t2, -1) }; },
    () => { const a = R.int(2, 4), b = R.int(1, 5), c = R.int(1, 3), d = R.int(1, 6), e = R.int(1, 5), t1 = pm([b, a], [-d, c]), t2 = pm([-e, 1], [-e, 1]); return { e: "(" + L(a, b) + ")(" + L(c, -d) + ") - (" + L(1, -e) + ")^2", t: [t1, t2], r: pa(t1, t2, -1) }; },
    () => { const k = R.int(2, 3), a = R.int(1, 5), b = R.int(2, 7), t1b = pm(pm([k], [a, 1]), [a, 1]), t2 = pm([-b, 1], [b, 1]); return { e: k + "(" + L(1, a) + ")^2 - (" + L(1, -b) + ")(" + L(1, b) + ")", t: [t1b, t2], r: pa(t1b, t2, -1) }; },
  ];
  const devQ = () => { const ks = mix([0, 1, 2, 3]).slice(0, 2), xs = ks.map((k) => { for (;;) { const x = DV[k](); if (x.r.some((c, i) => i > 0 && c)) return x; } });
    return { id: "idrem", also: ["distrib", "reduire"], d: 2, titre: "Développer et réduire", q: "Développe et réduis.", parts: xs.map((x) => M(x.e)),
      sol: xs.map((x) => M(x.e + " = " + P(x.t[0]) + " - \\left(" + P(x.t[1]) + "\\right) = " + P(x.r)) + ".") }; };

  // 5. Factoriser au maximum.
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

  // 6. Équations sans calculatrice.
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

  // 7. Espace et calcul littéral sans calculatrice.
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

  // ---------- Partie 2 · calculatrice ----------
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

  // 9. Mise en équation.
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

  // 10. Résoudre une équation.
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

  // 11. Solides avec calculatrice.
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
      sol: ["Triangle rectangle (hauteur, demi-côté, apothème) : " + M("h = \\sqrt{" + ap + "^2 - " + hb + "^2} = \\sqrt{" + h * h + "} = " + h) + " m.", M("V = \\frac{" + c + "^2 \\cdot " + h + "}{3} = " + N((c * c * h) / 3)) + " m³.", M("4 \\cdot \\frac{" + c + " \\cdot " + ap + "}{2} = " + String(2 * c * ap).replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}")) + " m²."] } /* 24.11 : séparateur des milliers */; };
  const manqQ = () => { if (R.rand() < 0.5) { const r = pk([3.5, 4, 4.5, 5, 6]), Vl = pk([0.33, 0.5, 0.75, 1, 1.5]), hh = (Vl * 1000) / (Math.PI * r * r);
      return { id: "volmanq", also: ["uvol", "vol"], d: 3, titre: "Grandeur manquante", q: "Une boîte cylindrique a un rayon intérieur de " + Q(r, "cm") + " et contient exactement " + Q(Vl, "L") + ".", fig: FIG.cylinder("r = " + N(r).replace("{,}", ",") + " cm", "h = ?"), parts: ["Convertis le volume en cm³.", "Calcule la hauteur de la boîte (au millimètre près)."],
        sol: [M(N(Vl) + un("L") + " = " + N(Vl) + un("dm^3") + " = " + N(Vl * 1000) + un("cm^3")) + ".", M("h = \\frac{V}{\\pi r^2} = \\frac{" + N(Vl * 1000) + "}{\\pi \\cdot " + N(r) + "^2} \\approx " + A(hh, 1)) + " cm."] }; }
    const V = pk([500, 1000, 2000, 4000, 5000]), rr = Math.cbrt((3 * V) / (4 * Math.PI));
    return { id: "volmanq", also: ["volcone"], d: 3, titre: "Grandeur manquante", q: "Une boule a un volume de " + Q(V, "cm^3") + ".", parts: ["Calcule son rayon (au millimètre près).", "Calcule l'aire de sa sphère (au cm² près), avec la valeur non arrondie du rayon."],
      sol: [M("\\frac{4}{3}\\pi r^3 = " + N(V)) + " donne " + M("r = \\sqrt[3]{\\frac{3 \\cdot " + N(V) + "}{4\\pi}} \\approx " + A(rr, 1)) + " cm.", M("4\\pi r^2 \\approx " + A(4 * Math.PI * rr * rr, 0)) + " cm² (avec r en mémoire ; avec " + M(A(rr, 1)) + " on trouverait " + A(4 * Math.PI * (+rr.toFixed(1)) ** 2, 0) + " : arrondi intermédiaire sanctionné)."] }; };

  // 12. Grandeurs quotients.
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

  // 13. Thalès.
  const etangQ = () => { for (;;) { const ad = R.int(6, 15), db = R.int(10, 30), de = R.int(5, 14), ab = ad + db, bc = r6((de * ab) / ad), ac = R.int(20, 45), ae = r6((ac * ad) / ab); if (Math.abs(bc * 10 - Math.round(bc * 10)) > 1e-9 || Math.abs(ae * 100 - Math.round(ae * 100)) > 1e-9) continue;
      return { id: "thales", d: 3, titre: "La largeur de l'étang", q: "Pour mesurer la largeur " + M("BC") + " d'un étang, on plante des piquets : " + M("D \\in [AB]") + ", " + M("E \\in [AC]") + " et " + M("(DE) \\parallel (BC)") + ". On mesure " + M("AD = " + ad) + " m, " + M("DB = " + db) + " m, " + M("DE = " + N(de)) + " m et " + M("AC = " + ac) + " m.", fig: FIG.thales([[110, 52, ad + " m"], [80, 124, db + " m"], [150, 70, de + " m"]]), parts: ["Calcule " + M("BC") + ".", "Calcule " + M("AE") + "."],
        sol: [M("AB = " + ad + " + " + db + " = " + ab) + " ; Thalès : " + M("\\frac{BC}{DE} = \\frac{AB}{AD}") + ", donc " + M("BC = " + de + " \\cdot \\frac{" + ab + "}{" + ad + "} = " + N(bc)) + " m.", M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AE = " + ac + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + N(ae)) + " m."] }; } };
  const ombreQ = () => { const b = pk([1, 1.2, 1.5, 2]), s = R.int(8, 25) / 10, S0 = R.int(60, 200) / 10, H = (b * S0) / s, p = pk([1.6, 1.7, 1.8]), sp = (p * s) / b;
    return { id: "thales", d: 3, titre: "L'arbre et son ombre", q: "Au même moment (rayons du soleil parallèles), un bâton vertical de " + Q(b, "m") + " a une ombre de " + Q(s, "m") + ", et un arbre a une ombre de " + Q(S0, "m") + ".", parts: ["Fais un croquis (configuration de Thalès) et calcule la hauteur de l'arbre (au centimètre près).", "Quelle est, au même moment, la longueur de l'ombre d'une personne de " + Q(p, "m") + " ? (au centimètre)"],
      sol: [M("\\frac{H}{" + N(b) + "} = \\frac{" + N(S0) + "}{" + N(s) + "}") + ", donc " + M("H = " + N(b) + " \\cdot \\frac{" + N(S0) + "}{" + N(s) + "} \\approx " + A(H, 2)) + " m.", M(N(p) + " \\cdot \\frac{" + N(s) + "}{" + N(b) + "} \\approx " + A(sp, 2)) + " m."] }; };
  const papillonQ = () => { for (;;) { const ca = R.int(3, 9), k = pk([1.5, 2, 2.5, 3]), ce = r6(ca * k), ab = R.int(4, 12), de = r6(ab * k), cb = R.int(3, 10), cd = r6(cb * k); if (ce === ca) continue;
      return { id: "thales", d: 3, titre: "Configuration papillon", q: "Les droites " + M("(AE)") + " et " + M("(BD)") + " se coupent en " + M("C") + ", et " + M("(AB) \\parallel (DE)") + ". On sait que " + M("CA = " + ca) + " cm, " + M("CE = " + N(ce)) + " cm, " + M("AB = " + ab) + " cm et " + M("CB = " + cb) + " cm.", parts: ["Calcule " + M("DE") + ".", "Calcule " + M("CD") + "."],
        sol: [M("\\frac{DE}{AB} = \\frac{CE}{CA} = \\frac{" + N(ce) + "}{" + ca + "}") + ", donc " + M("DE = " + ab + " \\cdot \\frac{" + N(ce) + "}{" + ca + "} = " + N(de)) + " cm.", M("CD = " + cb + " \\cdot \\frac{" + N(ce) + "}{" + ca + "} = " + N(cd)) + " cm."] }; } };

  // 14. Proportionnalité.
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

  // Emplacements du sujet : 7 en partie 1 (sans calculatrice), 7 en partie 2.
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
  // Nouveau sujet : une forme par emplacement, différente de celle du sujet précédent quand c'est possible.
  function plan(prev) {
    return SLOTS.map((s, i) => { let f = Math.floor(Math.random() * s.forms.length); if (prev && s.forms.length > 1 && prev[i] && prev[i].f === f) f = (f + 1 + Math.floor(Math.random() * (s.forms.length - 1))) % s.forms.length; return { s: i, f, seed: seed() }; });
  }
  function build(it) { R.seed(it.seed); const q = SLOTS[it.s].forms[it.f](); return Object.assign({ p: SLOTS[it.s].p, slot: it.s }, q); }
  return { SLOTS, plan, build, QC };
})();
// Écrans du parcours EVACOM. Entrée : case « Évaluation » (22.11 ; plus dans Progrès depuis le 25.11) (pas de case sur l'accueil : règle des 6 cases).
// state.evacom = { items: [{ s, f, seed }], date, done: { date, marks, n, juste, partie, faux } | null, runs: [{ date, n, juste, partie, faux }] }.
let evcBack = "test";
function evacomOk() { return !!(typeof state !== "undefined" && state && state.profile && state.profile.system === "CH" && +state.profile.grade === 11); }
function evacomNew() {
  const E = state.evacom || {};
  state.evacom = { items: EVACOM.plan(E.items), date: day(), done: null, runs: (E.runs || []).slice(-20) };
  save();
}
function evacomQs() { return state.evacom.items.map((it) => EVACOM.build(it)); }
// 24.11 : en attente de relecture par l'enseignant (corrigés d'un contenu d'examen) : visible sur le site publié seulement
// en mode auteur (…/#auteur) ; partout ailleurs (pages de test, copie locale) comme prévu. Passer à true après relecture.
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
// Bilan : questions justes par partie, notions acquises, notions à retravailler (rappel de cours, révision ciblée).
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
