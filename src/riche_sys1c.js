// Chantier 1re Collège · systèmes et fonctions affines (18.11) : exercices riches et raisonnements du test de préparation
// (contexte, plusieurs étapes, interprétation), même format que riche.js. Chargé après riche.js.
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
    // Forfaits de téléphone (fonctions affines, intersection, interprétation)
    () => { const fa = pk([10, 15, 20]), pa = pk([0.1, 0.2]), pb = pk([0.4, 0.5]), x0 = r6(fa / (pb - pa));
      return X({ id: "affine", lv: 1, titre: "Deux forfaits",
        q: "Forfait A : " + fa + " CHF par mois plus " + N(pa).replace("{,}", ",") + " CHF la minute. Forfait B : " + N(pb).replace("{,}", ",") + " CHF la minute, sans abonnement. On note " + M("x") + " le nombre de minutes par mois.",
        parts: [{ label: "Écris le coût " + M("A(x)") + " et le coût " + M("B(x)") + ".", pts: 1 }, { label: "Pour combien de minutes les deux forfaits coûtent-ils la même chose ?", pts: 2 }, { label: who() + " téléphone environ 2 h par mois. Quel forfait lui conseilles-tu ? Justifie.", pts: 1 }],
        sol: ul([M("A(x) = " + N(pa) + "x + " + fa) + ", " + M("B(x) = " + N(pb) + "x") + ".", M(N(pa) + "x + " + fa + " = " + N(pb) + "x") + ", " + M("x = " + N(x0)) + " minutes.", "120 min : A coûte " + M(N(r6(pa * 120 + fa))) + " CHF, B " + M(N(r6(pb * 120))) + " CHF : " + (pa * 120 + fa < pb * 120 ? "le forfait A." : "le forfait B.")]) }); },
    // Poules et lapins (système)
    () => { const l = R.int(8, 20), p = R.int(10, 30), t = l + p, pa = 4 * l + 2 * p;
      return X({ id: "sysprob", lv: 1, titre: "La ferme",
        q: "Dans une ferme, on compte " + t + " têtes et " + pa + " pattes. Il n'y a que des poules et des lapins.",
        parts: [{ label: "Choisis deux inconnues et écris un système.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "Vérifie ta réponse dans l'énoncé.", pts: 1 }],
        sol: ul([sys("p + \\ell = " + t, "2p + 4\\ell = " + pa) + " (" + M("p") + " poules, " + M("\\ell") + " lapins).", M("2p + 2\\ell = " + 2 * t) + " ; on soustrait : " + M("2\\ell = " + (pa - 2 * t)) + ", " + M("\\ell = " + l) + ", " + M("p = " + p) + ".", M(p + " + " + l + " = " + t) + " têtes et " + M(2 * p + " + " + 4 * l + " = " + pa) + " pattes ✓."]) }); },
    // Le bateau et le courant
    () => { const [v, c] = pk([[12, 2], [15, 3], [18, 2], [18, 3]]);
      const D = (v + c) * 2, t2 = D / (v - c);
      return X({ id: "sysprob", lv: 2, titre: "Le bateau et le courant",
        q: "Un bateau descend une rivière : il parcourt " + D + " km en 2 h. Il remonte ensuite la même distance en " + T(r6(t2)) + " h.",
        parts: [{ label: "Calcule sa vitesse en descendant et en remontant.", pts: 1 }, { label: "En notant " + M("v") + " la vitesse du bateau en eau calme et " + M("c") + " celle du courant, écris un système et résous-le.", pts: 2 }, { label: "Combien de temps lui faudrait-il pour parcourir " + D + " km sur un lac (sans courant) ?", pts: 1 }],
        sol: ul([M(D + " : 2 = " + (v + c)) + " km/h et " + M(D + " : " + N(r6(t2)) + " = " + (v - c)) + " km/h.", sys("v + c = " + (v + c), "v - c = " + (v - c)) + " : " + M("v = " + v) + ", " + M("c = " + c) + ".", M(D + " : " + v + " \\approx " + N(Math.round((D / v) * 100) / 100)) + " h."]) }); },
    // Droites et système (lecture graphique, calcul)
    () => { const a = pk([1, 2]), b = pk([-1, 1, 2]), c = pk([-1, -2]), e = pk([5, 4, 7]), x0 = (e - b) / (a - c), y0 = a * x0 + b;
      return X({ id: "sysgraph", lv: 2, titre: "Deux droites",
        q: "On considère les droites " + M("d_1 : y = " + (a === 1 ? "" : a) + "x" + (b < 0 ? " - " + -b : " + " + b)) + " et " + M("d_2 : y = " + (c === -1 ? "-" : c) + "x + " + e) + ".",
        parts: [{ label: "Calcule les coordonnées de leur point d'intersection.", pts: 2 }, { label: "Écris l'équation d'une droite " + M("d_3") + " qui n'a aucun point commun avec " + M("d_1") + ".", pts: 1 }, { label: "Le système formé par " + M("d_1") + " et " + M("2y = " + 2 * a + "x" + (2 * b < 0 ? " - " + -2 * b : " + " + 2 * b)) + " a-t-il une, aucune ou une infinité de solutions ? Explique.", pts: 1 }],
        sol: ul([M(a + "x" + (b < 0 ? " - " + -b : " + " + b) + " = " + c + "x + " + e) + ", " + M("x = " + N(r6(x0))) + ", " + M("y = " + N(r6(y0))) + ".", "Une droite parallèle : même pente " + M(a) + ", autre ordonnée à l'origine, par exemple " + M("y = " + (a === 1 ? "" : a) + "x + " + (b + 5)) + ".", "Une infinité : en divisant par 2, c'est la même équation (droites confondues)."]) }); },
    // Parabole par trois points (système 3x3)
    () => { const a = pk([1, -1, 2]), b = pk([-2, 0, 3]), c = pk([1, -3, 4]), ys = [-1, 0, 1].map((x) => a * x * x + b * x + c);
      return X({ id: "sys3", lv: 3, titre: "La parabole cachée",
        q: "Une parabole " + M("y = ax^2 + bx + c") + " passe par " + M("A(-1 \\,;\\, " + ys[0] + ")") + ", " + M("B(0 \\,;\\, " + ys[1] + ")") + " et " + M("C(1 \\,;\\, " + ys[2] + ")") + ".",
        parts: [{ label: "Écris le système de trois équations.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "La parabole passe-t-elle par " + M("D(2 \\,;\\, " + (4 * a + 2 * b + c + 1) + ")") + " ? Justifie.", pts: 1 }],
        sol: ul([sys("a - b + c = " + ys[0], "c = " + ys[1], "a + b + c = " + ys[2]), M("c = " + c) + " ; en additionnant la 1re et la 3e : " + M("2a + 2c = " + (ys[0] + ys[2])) + ", " + M("a = " + a) + " ; puis " + M("b = " + b) + ".", "Non : pour " + M("x = 2") + ", " + M("y = " + (4 * a + 2 * b + c)) + ", pas " + (4 * a + 2 * b + c + 1) + "."]) }); },
    // Budget d'une sortie (système d'inéquations)
    () => { const B = pk([600, 750, 900]), car = pk([240, 300]), p = pk([12, 15]), mn = pk([10, 12, 15]), mx = Math.floor((B - car) / p);
      return X({ id: "sysineq", lv: 2, titre: "La sortie de classe",
        q: "Pour une sortie, la classe dispose de " + B + " CHF. Le car coûte " + car + " CHF et l'entrée " + p + " CHF par élève. Il faut au moins " + mn + " élèves pour que le car soit réservé. On note " + M("x") + " le nombre d'élèves.",
        parts: [{ label: "Écris un système de deux inéquations.", pts: 1 }, { label: "Résous-le.", pts: 2 }, { label: "Combien de nombres d'élèves sont possibles ?", pts: 1 }],
        sol: ul([sys(car + " + " + p + "x \\le " + B, "x \\ge " + mn), M(p + "x \\le " + (B - car)) + ", " + M("x \\le " + N(r6((B - car) / p))) + " ; avec " + M("x \\ge " + mn) + " : " + M("S = [" + mn + " \\,;\\, " + N(r6((B - car) / p)) + "]") + ".", "Les entiers de " + mn + " à " + mx + " : " + (mx - mn + 1) + " possibilités."]) }); },
    // Signe et zéro (affzero)
    () => { let z, a, k, b; do { z = pk([2, 3, 4]); a = pk([-3, -2, 2, 3]); k = R.int(-6, 6); b = (a * z + k) / (a - 1); } while (!Number.isInteger(b) || k === 0);
      const gk = k < 0 ? " - " + -k : " + " + k, op = a - 1 < 0 ? "\\le" : "\\ge";
      return X({ id: "affzero", lv: 2, titre: "Étude de signe",
        q: "Soit " + M("f(x) = " + a + "x " + (-a * z < 0 ? "- " + a * z : "+ " + -a * z)) + " et " + M("g(x) = x" + gk) + ".",
        parts: [{ label: "Calcule le zéro de " + M("f") + " et dresse le tableau de signes de " + M("f") + ".", pts: 2 }, { label: "Résous " + M("f(x) \\ge g(x)") + ".", pts: 2 }],
        sol: ul(["Zéro : " + M("x = " + z) + ". " + (a > 0 ? "Pente positive : " + M("f") + " négative avant " + z + ", positive après." : "Pente négative : " + M("f") + " positive avant " + z + ", négative après."), M((a - 1) + "x \\ge " + (a * z + k)) + (a - 1 < 0 ? " ; on divise par un négatif, le sens change" : "") + " : " + M("x " + op + " " + b) + "."]) }); },
    // Le plombier (affine, deux points)
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
