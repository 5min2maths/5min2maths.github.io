// Chantier 1re Collège (bêta-testeurs) · dernier lot (19.11) : trigo, trigexact. Même standard : au moins 3 formes
// par niveau, pas à pas, erreurs typiques (sin/cos/tan confondus, degré/pente), ctx, figures ; défis.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const D = Math.PI / 180, sin = (a) => Math.sin(a * D), cos = (a) => Math.cos(a * D), tan = (a) => Math.tan(a * D), deg = (x) => x / D;
  const N = (v, k) => String(k === undefined ? r6(v) : +(+v).toFixed(k)).replace(".", "{,}");
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 0.02 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}, o.radical ? { radical: true } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const F = (lab, ang) => FIG.trigTriangle(lab, ang);
  const GSr = (ask, value, sol, round) => ({ ask, spec: { kind: "value", value, round }, sol });

  // ===================== trigo =====================
  const TG = {
    1: [
      () => { const a = R.int(20, 70), h = R.int(4, 15), v = h * sin(a);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et un angle aigu " + M(a + "°") + ". Calcule le côté opposé à cet angle (au centième, en cm).", v, M("\\sin " + a + "° = \\frac{\\text{opp}}{" + h + "}") + ", donc " + M("\\text{opp} = " + h + " \\cdot \\sin " + a + "° \\approx " + N(v, 2)) + " cm.",
          { ctx: "sin-opp", round: 0.01, fig: F(["", "?", h + " cm"], a + "°"), guide: [GSr("Opposé et hypoténuse : sinus. " + M("\\sin " + a + "°") + " (au millième) ?", sin(a), M(N(sin(a), 3)) + ".", 0.001), GSr("Opposé ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(h * cos(a), "Le côté OPPOSÉ va avec le sinus (le cosinus donne l'adjacent)."), TR(h / sin(a), "On multiplie l'hypoténuse par sin, on ne divise pas.")] }); },
      () => { const a = R.int(20, 70), h = R.int(4, 15), v = h * cos(a);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et un angle aigu " + M(a + "°") + ". Calcule le côté adjacent à cet angle (au centième, en cm).", v, M("\\cos " + a + "° = \\frac{\\text{adj}}{" + h + "}") + ", donc " + M("\\text{adj} = " + h + " \\cdot \\cos " + a + "° \\approx " + N(v, 2)) + " cm.",
          { ctx: "cos-adj", round: 0.01, fig: F(["?", "", h + " cm"], a + "°"), guide: [GSr("Adjacent et hypoténuse : cosinus. " + M("\\cos " + a + "°") + " (au millième) ?", cos(a), M(N(cos(a), 3)) + ".", 0.001), GSr("Adjacent ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(h * sin(a), "Le côté ADJACENT va avec le cosinus."), TR(h * tan(a), "Avec l'hypoténuse : sinus ou cosinus, pas tangente.")] }); },
      () => { const a = R.int(20, 65), d = R.int(3, 12), v = d * tan(a);
        return Qv("Dans un triangle rectangle, le côté adjacent à un angle de " + M(a + "°") + " mesure " + M(d) + " cm. Calcule le côté opposé (au centième, en cm).", v, M("\\tan " + a + "° = \\frac{\\text{opp}}{" + d + "}") + ", " + M("\\text{opp} = " + d + " \\cdot \\tan " + a + "° \\approx " + N(v, 2)) + " cm.",
          { ctx: "tan-opp", round: 0.01, fig: F([d + " cm", "?", ""], a + "°"), guide: [GSr("Opposé et adjacent : tangente. " + M("\\tan " + a + "°") + " (au millième) ?", tan(a), M(N(tan(a), 3)) + ".", 0.001), GSr("Opposé ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(d * sin(a), "Sans l'hypoténuse : c'est la tangente (opposé ÷ adjacent)."), TR(d / tan(a), "opp = adj · tan, on multiplie.")] }); },
    ],
    2: [
      () => { const o = R.int(3, 12), d = R.int(3, 12); if (o === d) return null; const v = deg(Math.atan(o / d));
        return Qv("Les cathètes d'un triangle rectangle mesurent " + M(o) + " cm (opposée à " + M("\\alpha") + ") et " + M(d) + " cm (adjacente). Calcule " + M("\\alpha") + " (au dixième de degré).", v, M("\\tan \\alpha = \\frac{" + o + "}{" + d + "}") + ", " + M("\\alpha = \\tan^{-1}\\left(\\frac{" + o + "}{" + d + "}\\right) \\approx " + N(v, 1) + "°") + ".",
          { ctx: "atan", round: 0.1, fig: F([d + " cm", o + " cm", ""], "α ?"), guide: [GSr(M("\\tan \\alpha = \\frac{opp}{adj}") + " (au millième) ?", o / d, M(N(o / d, 3)) + ".", 0.001), GSr(M("\\alpha = \\tan^{-1}(\\ldots)") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR(deg(Math.atan(d / o)), "tan α = OPPOSÉ ÷ adjacent : " + o + " ÷ " + d + "."), TR(90 - v + (o > d ? 0 : 0) + 0.0001 === v ? 0 : 90 - v, "Ça, c'est l'autre angle aigu.")] }); },
      () => { const o = R.int(2, 9), h = o + R.int(1, 8), v = deg(Math.asin(o / h));
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et le côté opposé à " + M("\\alpha") + " mesure " + M(o) + " cm. Calcule " + M("\\alpha") + " (au dixième de degré).", v, M("\\sin \\alpha = \\frac{" + o + "}{" + h + "}") + ", " + M("\\alpha = \\sin^{-1}\\left(\\frac{" + o + "}{" + h + "}\\right) \\approx " + N(v, 1) + "°") + ".",
          { ctx: "asin", round: 0.1, fig: F(["", o + " cm", h + " cm"], "α ?"), guide: [GSr(M("\\sin \\alpha") + " (au millième) ?", o / h, M(N(o / h, 3)) + ".", 0.001), GSr(M("\\alpha") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR(deg(Math.acos(o / h)), "Opposé et hypoténuse : sinus, donc sin⁻¹."), TR(deg(Math.atan(o / h)), "Avec l'hypoténuse, ce n'est pas la tangente.")] }); },
      () => { const a = R.int(25, 65), o = R.int(3, 12), v = o / sin(a);
        return Qv("Le côté opposé à un angle de " + M(a + "°") + " d'un triangle rectangle mesure " + M(o) + " cm. Calcule l'hypoténuse (au centième, en cm).", v, M("\\sin " + a + "° = \\frac{" + o + "}{h}") + ", donc " + M("h = \\frac{" + o + "}{\\sin " + a + "°} \\approx " + N(v, 2)) + " cm.",
          { ctx: "hyp", round: 0.01, fig: F(["", o + " cm", "?"], a + "°"), guide: [GSr(M("\\sin " + a + "°") + " (au millième) ?", sin(a), M(N(sin(a), 3)) + ".", 0.001), GSr("Hypoténuse (" + M(o + " : \\sin " + a + "°") + ") ?", v, M(N(v, 2)) + " cm.", 0.01)], traps: [TR(o * sin(a), "L'hypoténuse est le plus long côté : on DIVISE par sin."), TR(o / cos(a), "Le côté donné est opposé : sinus.")] }); },
    ],
    3: [
      () => { const a = R.int(20, 60), dist = R.int(15, 60), eye = 1.6, v = dist * tan(a) + eye;
        return Qv("Une personne dont les yeux sont à " + M("1{,}6") + " m du sol se tient à " + M(dist) + " m d'un immeuble. Elle voit son sommet sous un angle de " + M(a + "°") + " avec l'horizontale. Quelle est la hauteur de l'immeuble (au centième, en m) ?", v, M(dist + " \\cdot \\tan " + a + "° \\approx " + N(dist * tan(a), 2)) + " m au-dessus des yeux, plus " + M("1{,}6") + " m : " + M(N(v, 2)) + " m.",
          { ctx: "immeuble", round: 0.01, fig: F([dist + " m", "?", ""], a + "°"), guide: [GSr("Hauteur au-dessus des yeux ?", dist * tan(a), M(N(dist * tan(a), 2)) + " m.", 0.01), GSr("Hauteur totale ?", v, M(N(v, 2)) + " m.", 0.01)], traps: [TR(dist * tan(a), "N'oublie pas d'ajouter la hauteur des yeux."), TR(dist * sin(a) + eye, "La distance est horizontale (adjacent) : tangente.")] }); },
      () => { const L = pk([5, 6, 8, 10]), a = R.int(60, 78), h = L * sin(a), dd = L * cos(a);
        return Qv("Une échelle de " + M(L) + " m est appuyée contre un mur ; elle fait un angle de " + M(a + "°") + " avec le sol. À quelle distance du mur se trouve son pied (au centième, en m) ?", dd, M(L + " \\cdot \\cos " + a + "° \\approx " + N(dd, 2)) + " m (et elle atteint " + M(N(h, 2)) + " m de haut).",
          { ctx: "echelle", round: 0.01, fig: F(["?", "", L + " m"], a + "°"), guide: [GSr(M("\\cos " + a + "°") + " (au millième) ?", cos(a), M(N(cos(a), 3)) + ".", 0.001), GSr("Distance au mur ?", dd, M(N(dd, 2)) + " m.", 0.01)], traps: [TR(h, "Ça, c'est la hauteur atteinte (côté opposé à l'angle au sol)."), TR(L * tan(a), "L'échelle est l'hypoténuse : cosinus.")] }); },
      () => { const h = pk([120, 150, 200, 250]), dd = pk([1500, 2000, 2500]), v = deg(Math.atan(h / dd));
        return Qv("Une route monte de " + M(h) + " m sur une distance horizontale de " + M(N(dd / 1000) + "\\ \\text{km}") + ". Quel angle fait-elle avec l'horizontale (au dixième de degré) ?", v, M("\\tan \\alpha = \\frac{" + h + "}{" + dd + "}") + " ; " + M("\\alpha \\approx " + N(v, 1) + "°") + " (pente " + M(N((100 * h) / dd, 1) + "\\,\\%") + ").",
          { ctx: "route", round: 0.1, guide: [GSr("Même unité : " + M("\\tan \\alpha = \\frac{" + h + "}{" + dd + "}") + " (au millième) ?", h / dd, M(N(h / dd, 3)) + ".", 0.001), GSr(M("\\alpha") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR((100 * h) / dd, "Ça, c'est la pente en % ; on demande l'angle en degrés."), TR(deg(Math.atan(h / (dd / 1000))), "Convertis les km en m avant de diviser.")] }); },
    ],
  };

  // ===================== trigexact =====================
  const TE = {
    1: [
      () => { const h = 2 * R.int(2, 9);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(h) + " cm et un angle aigu " + M("30°") + ". Calcule, sans calculatrice, le côté opposé à cet angle (en cm).", h / 2, M("\\sin 30° = \\frac{1}{2}") + " : " + M("\\frac{" + h + "}{2} = " + h / 2) + " cm.",
          { ctx: "sin30", fig: F(["", "?", h + " cm"], "30°"), guide: [GS(M("\\sin 30°") + " (fraction) ?", 0.5, M("\\frac{1}{2}") + "."), GS("Côté opposé ?", h / 2, M(h / 2) + " cm.")], traps: [TR((h * Math.sqrt(3)) / 2, "Ça, c'est le côté adjacent (cos 30°)."), TR(h * 30 / 90, "On utilise sin 30° = 1/2.")] }); },
      () => { const a = pk([45, 45, 30, 60]), v = a === 45 ? 100 : r6(100 * tan(a));
        if (a !== 45) return Qv("Une route est inclinée de " + M(a + "°") + ". Quelle est sa pente en % (au dixième) ?", v, "Pente " + M("= \\tan " + a + "° \\cdot 100\\,\\% \\approx " + N(v, 1) + "\\,\\%") + ".", { ctx: "pente-" + a, round: 0.1, guide: [GSr(M("\\tan " + a + "°") + " (au millième) ?", tan(a), M(N(tan(a), 3)) + ".", 0.001), GSr("Pente en % ?", v, M(N(v, 1) + "\\,\\%") + ".", 0.1)], traps: [TR(a, "Un angle n'est pas une pente : pente = tan(angle) · 100 %."), TR((a / 90) * 100, "Pas une règle de trois : utilise la tangente.")] });
        return Qv("Une rampe est inclinée de " + M("45°") + ". Quelle est sa pente en % ?", 100, M("\\tan 45° = 1") + " : on monte d'autant qu'on avance, soit " + M("100\\,\\%") + ".", { ctx: "pente-45", guide: [GS(M("\\tan 45°") + " ?", 1, M(1) + "."), GS("Pente en % ?", 100, M("100\\,\\%") + ".")], traps: [TR(45, "Un angle n'est pas une pente."), TR(50, "45° est la moitié de 90°, mais la pente n'est pas proportionnelle à l'angle.")] }); },
      () => { const k = R.int(2, 9);
        return Qv("Un triangle rectangle isocèle a une hypoténuse de " + M(2 * k) + " cm. Calcule la longueur d'une cathète (valeur exacte, touche √).", k * Math.SQRT2, M("\\cos 45° = \\frac{\\sqrt{2}}{2}") + " : " + M(2 * k + " \\cdot \\frac{\\sqrt{2}}{2} = " + k + "\\sqrt{2}") + " cm.",
          { ctx: "cos45", radical: true, canon: k + "√2", fig: F(["?", "", 2 * k + " cm"], "45°"), guide: [GSR(M("\\cos 45°") + " ?", Math.SQRT2 / 2, M("\\frac{\\sqrt{2}}{2}") + "."), GSR("Cathète ?", k * Math.SQRT2, M(k + "\\sqrt{2}") + " cm.")], traps: [TR(k, "Les cathètes ne valent pas la moitié de l'hypoténuse."), TR(2 * k * Math.SQRT2, "On multiplie par √2/2, pas par √2.")] }); },
    ],
    2: [
      () => { const k = R.int(2, 9);
        return Qv("Dans un triangle rectangle, l'hypoténuse mesure " + M(2 * k) + " cm et un angle aigu " + M("60°") + ". Calcule le côté opposé à cet angle (valeur exacte, touche √).", k * Math.sqrt(3), M("\\sin 60° = \\frac{\\sqrt{3}}{2}") + " : " + M(2 * k + " \\cdot \\frac{\\sqrt{3}}{2} = " + k + "\\sqrt{3}") + " cm.",
          { ctx: "sin60", radical: true, canon: k + "√3", fig: F(["", "?", 2 * k + " cm"], "60°"), guide: [GSR(M("\\sin 60°") + " ?", Math.sqrt(3) / 2, M("\\frac{\\sqrt{3}}{2}") + "."), GSR("Côté opposé ?", k * Math.sqrt(3), M(k + "\\sqrt{3}") + " cm.")], traps: [TR(k, "Ça, c'est le côté adjacent (cos 60° = 1/2)."), TR(k * Math.SQRT2, "C'est √3/2 pour 60°.")] }); },
      () => { const p = pk([5, 8, 10, 12, 15]), v = deg(Math.atan(p / 100));
        return Qv("Un panneau indique une pente de " + M(p + "\\,\\%") + ". Quel angle la route fait-elle avec l'horizontale (au dixième de degré) ?", v, M("\\tan \\alpha = " + N(p / 100)) + ", " + M("\\alpha = \\tan^{-1}(" + N(p / 100) + ") \\approx " + N(v, 1) + "°") + ".",
          { ctx: "angle-pente", round: 0.1, guide: [GS(M("\\tan \\alpha") + " (décimal) ?", p / 100, M(N(p / 100)) + " : on monte de " + p + " m pour 100 m."), GSr(M("\\alpha") + " ?", v, M(N(v, 1) + "°") + ".", 0.1)], traps: [TR(p, "Une pente de " + p + " % n'est pas un angle de " + p + "°."), TR((p * 90) / 100, "Utilise tan⁻¹, pas une règle de trois.")] }); },
      () => { const [o, h] = pk([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17]]), c = Math.sqrt(h * h - o * o) / h;
        return Qv("L'angle " + M("\\alpha") + " est aigu et " + M("\\sin \\alpha = \\frac{" + o + "}{" + h + "}") + ". Calcule " + M("\\cos \\alpha") + " (fraction).", c, M("\\cos^2 \\alpha = 1 - \\frac{" + o * o + "}{" + h * h + "} = \\frac{" + (h * h - o * o) + "}{" + h * h + "}") + ", " + M("\\cos \\alpha = \\frac{" + Math.sqrt(h * h - o * o) + "}{" + h + "}") + ".",
          { ctx: "pythagore-trig", guide: [GS(M("\\cos^2 \\alpha") + " (fraction) ?", c * c, M("\\frac{" + (h * h - o * o) + "}{" + h * h + "}") + "."), GS(M("\\cos \\alpha") + " ?", c, M("\\frac{" + Math.sqrt(h * h - o * o) + "}{" + h + "}") + ".")], traps: [TR(1 - o / h, "sin² + cos² = 1 : ce sont les CARRÉS."), TR(c * c, "N'oublie pas la racine.")] }); },
    ],
    3: [
      () => { const k = R.int(1, 6);
        return Qv("Dans un triangle rectangle, le côté adjacent à un angle de " + M("30°") + " mesure " + M(3 * k) + " cm. Calcule le côté opposé (valeur exacte, touche √).", k * Math.sqrt(3), M("\\tan 30° = \\frac{\\sqrt{3}}{3}") + " : " + M(3 * k + " \\cdot \\frac{\\sqrt{3}}{3} = " + (k === 1 ? "" : k) + "\\sqrt{3}") + " cm.",
          { ctx: "tan30", radical: true, canon: (k === 1 ? "" : k) + "√3", fig: F([3 * k + " cm", "?", ""], "30°"), guide: [GSR(M("\\tan 30°") + " ?", Math.sqrt(3) / 3, M("\\frac{\\sqrt{3}}{3}") + "."), GSR("Côté opposé ?", k * Math.sqrt(3), M((k === 1 ? "" : k) + "\\sqrt{3}") + " cm.")], traps: [TR(3 * k * Math.sqrt(3), "tan 30° = √3/3 (moins que 1), pas √3."), TR(1.5 * k, "Ça serait sin 30° avec l'hypoténuse.")] }); },
      () => { const p = pk([6, 8, 10, 12]), dkm = pk([1.5, 2, 2.5, 3]), v = p * dkm * 10;
        return Qv("Une route de montagne a une pente de " + M(p + "\\,\\%") + ". De combien de mètres monte-t-on pour " + M(N(dkm) + "\\ \\text{km}") + " parcourus à l'horizontale ?", v, M(p + "\\,\\%") + " : " + M(p) + " m pour 100 m ; " + M(N(dkm * 1000) + " \\cdot " + N(p / 100) + " = " + N(v)) + " m.",
          { ctx: "denivele", guide: [GS("Distance horizontale en m ?", dkm * 1000, M(N(dkm * 1000)) + " m."), GS("Montée ?", v, M(N(v)) + " m.")], traps: [TR(p * dkm, "Convertis les km en m."), TR(r6(dkm * 1000 * sin(p)), "Une pente en % n'est pas un angle.")] }); },
      () => { const k = R.int(2, 6);
        return Qv("Un triangle équilatéral a des côtés de " + M(2 * k) + " cm. Calcule son aire avec " + M("\\sin 60°") + " (valeur exacte, touche √, en cm²).", k * k * Math.sqrt(3), "Hauteur " + M(2 * k + " \\cdot \\sin 60° = " + k + "\\sqrt{3}") + " ; aire " + M("\\frac{" + 2 * k + " \\cdot " + k + "\\sqrt{3}}{2} = " + k * k + "\\sqrt{3}") + " cm².",
          { ctx: "aire-equi", radical: true, canon: k * k + "√3", guide: [GSR("Hauteur ?", k * Math.sqrt(3), M(k + "\\sqrt{3}") + "."), GSR("Aire ?", k * k * Math.sqrt(3), M(k * k + "\\sqrt{3}") + " cm².")], traps: [TR(2 * k * k * Math.sqrt(3), "Aire d'un triangle : ÷ 2."), TR(k * k, "N'oublie pas le facteur √3.")] }); },
    ],
  };

  const PROBS = {
    trigo: [() => P("Un cerf-volant est retenu par un fil tendu de 40 m qui fait un angle de 35° avec le sol (fil tenu à 1 m du sol).", [["a) Hauteur au-dessus de la main (m, au centième)", 22.94, 0.01], ["b) Hauteur au-dessus du sol (m, au centième)", 23.94, 0.01], ["c) Distance horizontale main–cerf-volant (m, au centième)", 32.77, 0.01]], ["Le fil est l'hypoténuse.", "sin pour la hauteur, cos pour l'horizontale."], "a) " + M("40 \\sin 35° \\approx 22{,}94") + " ; b) " + M("23{,}94") + " ; c) " + M("40 \\cos 35° \\approx 32{,}77") + ".")],
    trigexact: [() => P("Un triangle rectangle a une hypoténuse de 12 cm et un angle de 30°.", [["a) Côté opposé à 30° (cm)", 6], ["b) Côté adjacent (cm, valeur exacte : tape 6√3)", 6 * Math.sqrt(3)], ["c) Aire (cm², valeur exacte : tape 18√3)", 18 * Math.sqrt(3)]], ["sin 30° = 1/2.", "cos 30° = √3/2."], "a) 6 ; b) " + M("6\\sqrt{3}") + " ; c) " + M("\\frac{6 \\cdot 6\\sqrt{3}}{2} = 18\\sqrt{3}") + ".")],
  };

  const ALL = { trigo: TG, trigexact: TE };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => { const L0 = lv[Math.min(Math.max(d, 1), 3)]; let q = null; for (let k = 0; k < 40 && !(q && q.traps && q.traps.length); k++) q = pk(L0)(); return q; };
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    trigo: "SOH-CAH-TOA : sin = opposé/hypoténuse, cos = adjacent/hypoténuse, tan = opposé/adjacent. Pour un angle : sin⁻¹, cos⁻¹, tan⁻¹ (calculatrice en degrés).",
    trigexact: "sin 30° = cos 60° = 1/2 ; sin 60° = cos 30° = √3/2 ; sin 45° = cos 45° = √2/2 ; tan 45° = 1. Pente (%) = tan(angle) · 100.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    trigo: ["Sinus, cosinus, tangente : un côté", "Calculer un angle, l'hypoténuse", "Immeuble, échelle, route"],
    trigexact: ["30°, 45°, pente de 100 %", "60°, angle d'une pente, sin² + cos²", "tan 30°, dénivelé, aire de l'équilatéral"],
  });
})();
