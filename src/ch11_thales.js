// Chantier 11e · 8. Thalès (18.11, lot suivant du plan de cheminement) : une seule source pour thales, thalesrec, simil.
// Même standard que ch11_gm.js : au moins 3 formes par niveau, pas à pas, erreurs typiques, ctx, figures ; défis.
// Pas de leçon active nouvelle (règle du 18.11 : stabiliser la manipulation d'abord).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  const N = (v) => String(r6(v)).replace(".", "{,}");
  const T = (v) => M(N(v));
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}), sol, guide: o.guide, traps: keep(value, o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value, round]) => ({ label, spec: Object.assign({ kind: "value", value }, round ? { round } : {}) })), hints, sol });
  const cfg = M("D \\in [AB]") + ", " + M("E \\in [AC]") + " et " + M("(DE) \\parallel (BC)");
  const L = (v) => N(v).replace("{,}", ",");

  // ===================== thales =====================
  const TH = {
    1: [
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 6), de = R.int(2, 7), ab = ad * k, bc = de * k;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". On sait que " + M("AD = " + ad) + ", " + M("AB = " + ab) + " et " + M("BC = " + bc) + " (en cm). Calcule " + M("DE") + ".", de,
          M("\\frac{AD}{AB} = \\frac{DE}{BC}") + ", donc " + M("DE = " + bc + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + de) + " cm.",
          { ctx: "DE", fig: GF.thales(1 / k, { AD: ad + "", DE: "?", BC: bc + ""}), guide: [GS("Rapport d'agrandissement du petit triangle " + M("ADE") + " au grand " + M("ABC") + " : " + M("AB : AD") + " = ?", k, M(ab + " : " + ad + " = " + k) + "."), GS(M("DE = BC : " + k) + " = ?", de, M(bc + " : " + k + " = " + de) + " cm.")],
            traps: [TR(bc * k, "Le petit côté DE est plus court que BC : on divise par " + k + "."), TR(bc - (ab - ad), "Thalès conserve les rapports, pas les différences.")] }); },
      () => { const k = pk([2, 3, 4, 5]), ad = R.int(2, 6), ae = R.int(2, 7), ab = ad * k, ac = ae * k; if (ad === ae) return null;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("AB = " + ab) + " et " + M("AC = " + ac) + " (en cm). Calcule " + M("AE") + ".", ae,
          M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AE = " + ac + " \\cdot \\frac{" + ad + "}{" + ab + "} = " + ae) + " cm.",
          { ctx: "AE", fig: GF.thales(1 / k, { AD: ad + "", AE: "?"}), guide: [GS("Rapport " + M("\\frac{AD}{AB}") + " (fraction ou décimal) ?", ad / ab, M("\\frac{" + ad + "}{" + ab + "} = \\frac{1}{" + k + "}") + "."), GS(M("AE = AC \\cdot \\frac{1}{" + k + "}") + " = ?", ae, M(ae) + " cm.")],
            traps: [TR(ac * k, "AE est une partie de AC : il est plus court."), TR(ac - (ab - ad), "Les longueurs ne diminuent pas de la même quantité, mais dans le même rapport.")] }); },
      () => { const b = pk([1, 1.2, 1.5, 2]), o = pk([1.5, 2, 2.5]), m = R.int(4, 12), O = m * o, H = r6(b * m), x = pk([["un arbre", "arbre"], ["un immeuble", "immeuble"], ["un mât", "mat"]]);
        return Qv("Un bâton vertical de " + T(b) + " m a une ombre de " + T(o) + " m. Au même moment, l'ombre d'" + x[0] + " mesure " + T(O) + " m. Quelle est la hauteur d'" + x[0] + " (en m) ?", H,
          "Les rayons du soleil sont parallèles : " + M("\\frac{H}{" + N(b) + "} = \\frac{" + N(O) + "}{" + N(o) + "} = " + m) + ", donc " + M("H = " + N(H)) + " m.",
          { ctx: x[1], fig: GF.shadows(b, o, O, { h: L(b) + " m", s: L(o) + " m", S: L(O) + " m", H: "?" }), guide: [GS("Combien de fois l'ombre de l'objet est-elle plus longue que celle du bâton ?", m, M(N(O) + " : " + N(o) + " = " + m) + "."), GS("Hauteur ?", H, M(m + " \\cdot " + N(b) + " = " + N(H)) + " m.")],
            traps: [TR(r6(O * o / b), "Le rapport se calcule sur les ombres (" + L(O) + " ÷ " + L(o) + "), puis s'applique au bâton."), TR(r6(b + O - o), "Thalès conserve les rapports, pas les différences.")] }); },
    ],
    2: [
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 6), db = ad * (k - 1), ae = R.int(2, 8), ac = ae * k; if (ad === ae) return null;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("DB = " + db) + " et " + M("AE = " + ae) + " (en cm). Calcule " + M("AC") + ".", ac,
          M("AB = " + ad + " + " + db + " = " + ad * k) + " ; " + M("\\frac{AC}{AE} = \\frac{AB}{AD} = " + k) + ", donc " + M("AC = " + ac) + " cm.",
          { ctx: "DB", fig: GF.thales(1 / k, { AD: ad + "", DB: db + "", AE: ae + ""}), guide: [GS("D'abord " + M("AB = AD + DB") + " = ?", ad * k, M(ad * k) + " cm."), GS("Rapport " + M("AB : AD") + " ?", k, M(k) + "."), GS(M("AC = AE \\cdot " + k) + " = ?", ac, M(ac) + " cm.")],
            traps: [TR(ae * (k - 1), "Ça, c'est EC ; on demande AC = AE + EC.")] }); },
      () => { const k = pk([1.5, 2.5]), ad = 2 * R.int(1, 5), de = 2 * R.int(1, 6), ab = r6(ad * k), bc = r6(de * k);
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("AB = " + N(ab)) + " et " + M("DE = " + de) + " (en cm). Calcule " + M("BC") + ".", bc,
          M("\\frac{BC}{DE} = \\frac{AB}{AD} = \\frac{" + N(ab) + "}{" + ad + "} = " + N(k)) + ", donc " + M("BC = " + de + " \\cdot " + N(k) + " = " + N(bc)) + " cm.",
          { ctx: "decimal", fig: GF.thales(1 / k, { AD: ad + "", DE: de + "", BC: "?" }), guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(N(ab) + " : " + ad + " = " + N(k)) + "."), GS(M("BC") + " = ?", bc, M(N(bc)) + " cm.")],
            traps: [TR(r6(de / k), "BC est le grand côté : on multiplie par le rapport."), TR(r6(de + ab - ad), "Rapports, pas différences.")] }); },
      () => { const k = pk([2, 3]), ad = R.int(2, 5), ae = R.int(2, 6), de = R.int(2, 6); if (ad === ae) return null;
        return Qv("Les droites " + M("(BD)") + " et " + M("(CE)") + " se coupent en " + M("A") + " (configuration « papillon »), avec " + M("(DE) \\parallel (BC)") + ". " + M("AD = " + ad) + ", " + M("AB = " + ad * k) + " et " + M("DE = " + de) + ". Calcule " + M("BC") + ".", de * k,
          "Même propriété que dans le triangle : " + M("\\frac{BC}{DE} = \\frac{AB}{AD} = " + k) + ", donc " + M("BC = " + de * k) + ".",
          { ctx: "papillon", guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(k) + "."), GS(M("BC") + " = ?", de * k, M(de * k) + ".")], traps: [TR(de / k, "AB est plus long que AD : BC est plus long que DE.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3]), ad = R.int(2, 5), ae = R.int(2, 6), de = R.int(2, 6), ab = ad * k, ac = ae * k, bc = de * k; if (ad === ae || ae === de) return null;
        const per = (ab - ad) + bc + (ac - ae) + de;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = " + ad) + ", " + M("AB = " + ab) + ", " + M("AE = " + ae) + " et " + M("DE = " + de) + " (en cm). Calcule le périmètre du trapèze " + M("DECB") + ".", per,
          M("BC = " + de + " \\cdot " + k + " = " + bc) + ", " + M("AC = " + ac) + " ; " + M("DB = " + (ab - ad)) + ", " + M("EC = " + (ac - ae)) + " ; périmètre " + M((ab - ad) + " + " + bc + " + " + (ac - ae) + " + " + de + " = " + per) + " cm.",
          { ctx: "trapeze", fig: GF.thales(1 / k, { AD: ad + "", AE: ae + "", DE: de + ""}), guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(k) + "."), GS(M("BC") + " = ?", bc, M(bc) + " cm."), GS(M("EC = AC - AE") + " = ?", ac - ae, M(ac - ae) + " cm."), GS("Périmètre " + M("DB + BC + CE + ED") + " ?", per, M(per) + " cm.")],
            traps: [TR(ab + bc + ac, "C'est le périmètre du grand triangle ; le trapèze a pour côtés DB, BC, CE et ED."), TR(per - de, "N'oublie pas le côté DE.")] }); },
      () => { const x = pk([["Pour mesurer la largeur d'une rivière, on plante des piquets", "riviere"], ["Pour estimer la largeur d'un étang, on construit une figure au sol", "etang"]]), ad = pk([4, 5, 6]), db = pk([10, 12, 15, 20]), de = pk([3, 4, 5]), bc = r6(de * (ad + db) / ad);
        return Qv(x[0] + " : " + M("A") + ", " + M("D") + ", " + M("B") + " alignés, " + M("(DE) \\parallel (BC)") + ", avec " + M("AD = " + ad) + " m, " + M("DB = " + db) + " m (la largeur cherchée est " + M("BC") + ") et " + M("DE = " + de) + " m. Calcule " + M("BC") + " (au dixième).", bc,
          M("AB = " + (ad + db)) + " ; " + M("BC = " + de + " \\cdot \\frac{" + (ad + db) + "}{" + ad + "} \\approx " + N(Math.round(bc * 10) / 10)) + " m.",
          { ctx: x[1], round: 0.1, guide: [GS(M("AB") + " = ?", ad + db, M(ad + db) + " m."), GS(M("BC = DE \\cdot \\frac{AB}{AD}") + " (au dixième) ?", bc, M(N(Math.round(bc * 10) / 10)) + " m.")], traps: [TR(r6(de * db / ad), "Le rapport est AB / AD (AB = AD + DB), pas DB / AD.")] }); },
      () => { const ad = R.int(2, 9), k = pk([2, 3, 4]), db = ad * (k - 1), ae = R.int(2, 9), ec = ae * (k - 1); if (ad === ae) return null;
        return Qv("Dans un triangle " + M("ABC") + ", " + cfg + ". " + M("AD = x") + ", " + M("DB = " + db) + ", " + M("AE = " + ae) + " et " + M("EC = " + ec) + ". Que vaut " + M("x") + " ?", ad,
          M("\\frac{AD}{DB} = \\frac{AE}{EC}") + " : " + M("\\frac{x}{" + db + "} = \\frac{" + ae + "}{" + ec + "}") + ", donc " + M("x = " + db + " \\cdot \\frac{" + ae + "}{" + ec + "} = " + ad) + ".",
          { ctx: "equation", guide: [GS("Rapport " + M("\\frac{AE}{EC}") + " (fraction ou décimal) ?", ae / ec, M("\\frac{" + ae + "}{" + ec + "}") + "."), GS(M("x = " + db + " \\cdot \\frac{AE}{EC}") + " = ?", ad, M("x = " + ad) + ".")], traps: [TR(r6(db * ec / ae), "Même ordre dans les deux rapports : AD/DB = AE/EC.")] }); },
    ],
  };

  // ===================== thalesrec =====================
  const REC = {
    1: [
      () => { const k = pk([2, 3, 4, 1.5, 2.5]), ad = 2 * R.int(1, 5), ae = 2 * R.int(1, 5), ab = r6(ad * k); if (ad === ae) return null;
        return Qv(M("A") + ", " + M("D") + ", " + M("B") + " et " + M("A") + ", " + M("E") + ", " + M("C") + " sont alignés dans cet ordre. " + M("AD = " + ad) + ", " + M("AB = " + N(ab)) + " et " + M("AE = " + ae) + ". Quelle longueur " + M("AC") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ?", r6(ae * k),
          "Il faut " + M("\\frac{AE}{AC} = \\frac{AD}{AB}") + ", donc " + M("AC = " + ae + " \\cdot \\frac{" + N(ab) + "}{" + ad + "} = " + N(ae * k)) + " (réciproque de Thalès).",
          { ctx: "AC", guide: [GS("Rapport " + M("AB : AD") + " ?", k, M(N(k)) + "."), GS(M("AC = AE \\cdot") + " ce rapport = ?", r6(ae * k), M(N(ae * k)) + ".")], traps: [TR(r6(ae / k), "AC est plus long que AE : on multiplie.")] }); },
      () => { const cs = [0, 1, 2, 3].map(() => { const k = pk([2, 3, 1.5, 2.5]), a = 2 * R.int(1, 5), b = 2 * R.int(1, 5), ok = R.rand() < 0.5; return [a, r6(a * k), b, r6(b * k) + (ok ? 0 : pk([-1, 1])), ok]; }), n = cs.filter((c) => c[4]).length;
        return Qv("Dans chaque cas, " + M("D \\in [AB]") + " et " + M("E \\in [AC]") + ". Combien de cas donnent " + M("(DE) \\parallel (BC)") + " ? " + cs.map((c, i) => "(" + (i + 1) + ") " + M("AD = " + c[0] + ", AB = " + N(c[1]) + ", AE = " + c[2] + ", AC = " + N(c[3]))).join(" ; "), n,
          cs.map((c, i) => "(" + (i + 1) + ") " + M("\\frac{" + c[0] + "}{" + N(c[1]) + "}" + (c[4] ? " = " : " \\neq ") + "\\frac{" + c[2] + "}{" + N(c[3]) + "}")).join(" ; ") + " : " + n + " cas.",
          { ctx: "compter", guide: [GS("Cas (1) : " + M("\\frac{AD}{AB}") + " en décimal ?", r6(cs[0][0] / cs[0][1]), M(N(Math.round(cs[0][0] / cs[0][1] * 1e4) / 1e4)) + ".", 0.001), GS("Compare avec " + M("\\frac{AE}{AC}") + " dans chaque cas. Nombre de cas parallèles ?", n, n + ".")],
            traps: [TR(4, "Un écart, même petit, entre les rapports suffit : les droites ne sont pas parallèles."), TR(n === 0 ? 1 : n - 1, "Vérifie chaque égalité de rapports.")] }); },
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 6), ae = R.int(2, 6), ac = ae * k; if (ad === ae) return null;
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + ad) + ", " + M("AE = " + ae) + " et " + M("AC = " + ac) + ". Quelle longueur " + M("AB") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ?", ad * k,
          M("\\frac{AB}{AD} = \\frac{AC}{AE} = " + k) + " : " + M("AB = " + ad * k) + ".", { ctx: "AB", guide: [GS("Rapport " + M("AC : AE") + " ?", k, M(k) + "."), GS(M("AB") + " = ?", ad * k, M(ad * k) + ".")], traps: [TR(ad + ac - ae, "Rapports égaux, pas différences égales.")] }); },
    ],
    2: [
      () => { const [ad, ab, ae] = pk([[2.4, 6, 3], [1.8, 4.5, 2], [3.2, 8, 2.5], [1.5, 6, 2.2]]), ac = r6(ae * ab / ad);
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + N(ad)) + ", " + M("AB = " + N(ab)) + " et " + M("AE = " + N(ae)) + " (en cm). Quelle doit être " + M("AC") + " pour que " + M("(DE) \\parallel (BC)") + " ?", ac,
          M("\\frac{AD}{AB} = \\frac{" + N(ad) + "}{" + N(ab) + "} = " + N(ad / ab)) + " ; " + M("AC = " + N(ae) + " : " + N(ad / ab) + " = " + N(ac)) + " cm.",
          { ctx: "decimaux", guide: [GS("Rapport " + M("\\frac{AD}{AB}") + " en décimal ?", r6(ad / ab), M(N(ad / ab)) + "."), GS(M("AC = AE :") + " ce rapport = ?", ac, M(N(ac)) + " cm.")], traps: [TR(r6(ae * ad / ab), "AC est plus long que AE : on divise par le rapport (plus petit que 1).")] }); },
      () => { const [a, b, c, d] = pk([[3, 7, 4, 9], [4, 9, 5, 11], [2, 5, 3, 8], [5, 12, 3, 7]]);
        return Qv(M("D \\in [AB]") + " et " + M("E \\in [AC]") + " avec " + M("AD = " + a) + ", " + M("AB = " + b) + ", " + M("AE = " + c) + ", " + M("AC = " + d) + ". Calcule " + M("AD \\cdot AC - AE \\cdot AB") + ". (Si ce n'est pas 0, les droites " + M("(DE)") + " et " + M("(BC)") + " ne sont pas parallèles.)", a * d - c * b,
          M(a + " \\cdot " + d + " - " + c + " \\cdot " + b + " = " + (a * d - c * b)) + " ≠ 0 : les rapports sont différents, " + M("(DE)") + " et " + M("(BC)") + " ne sont pas parallèles (contraposée de Thalès).",
          { ctx: "contraposee", guide: [GS(M("AD \\cdot AC") + " = ?", a * d, M(a * d) + "."), GS(M("AE \\cdot AB") + " = ?", c * b, M(c * b) + "."), GS("Différence ?", a * d - c * b, M(a * d - c * b) + ".")], traps: [TR(c * b - a * d, "Dans l'ordre demandé : AD · AC − AE · AB.")] }); },
      () => { const k = pk([2, 3]), ad = R.int(2, 6), ae = R.int(2, 6); if (ad === ae) return null;
        return Qv("Configuration « papillon » : " + M("(BD)") + " et " + M("(CE)") + " se coupent en " + M("A") + ", avec " + M("AD = " + ad) + ", " + M("AB = " + ad * k) + " et " + M("AE = " + ae) + ". Quelle longueur " + M("AC") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ?", ae * k,
          M("\\frac{AC}{AE} = \\frac{AB}{AD} = " + k) + " : " + M("AC = " + ae * k) + ".", { ctx: "papillon", guide: [GS("Rapport ?", k, M(k) + "."), GS(M("AC") + " = ?", ae * k, M(ae * k) + ".")], traps: [TR(ae / k, "AB est plus long que AD, donc AC plus long que AE.")] }); },
    ],
    3: [
      () => { const k = pk([2, 3, 4]), ad = R.int(2, 5), ae = R.int(2, 6), bc = 2 * R.int(3, 9); if (ad === ae) return null;
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + ad) + ", " + M("AB = " + ad * k) + ", " + M("AE = " + ae) + ", " + M("AC = " + ae * k) + " et " + M("BC = " + bc) + ". Montre que " + M("(DE) \\parallel (BC)") + ", puis calcule " + M("DE") + ".", r6(bc / k),
          M("\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{" + k + "}") + " : parallèles (réciproque). Puis " + M("DE = " + bc + " : " + k + " = " + N(bc / k)) + ".",
          { ctx: "prouver-calculer", guide: [GS(M("\\frac{AD}{AB}") + " = ? (fraction)", 1 / k, M("\\frac{1}{" + k + "}") + "."), GS(M("\\frac{AE}{AC}") + " = ? (même valeur : parallèles)", 1 / k, M("\\frac{1}{" + k + "}") + "."), GS(M("DE") + " = ?", r6(bc / k), M(N(bc / k)) + ".")], traps: [TR(bc * k, "DE est le petit côté : on divise.")] }); },
      () => { const ad = R.int(2, 6), db = R.int(3, 9), ae = R.int(2, 6); if (ad === ae) return null; const ec = r6(ae * db / ad);
        return Qv(M("D \\in [AB]") + ", " + M("E \\in [AC]") + ", " + M("AD = " + ad) + ", " + M("DB = " + db) + ", " + M("AE = " + ae) + ". Quelle longueur " + M("EC") + " faut-il pour que " + M("(DE) \\parallel (BC)") + " ? (fraction ou décimal)", ec,
          M("\\frac{EC}{AE} = \\frac{DB}{AD}") + " : " + M("EC = " + ae + " \\cdot \\frac{" + db + "}{" + ad + "} = " + N(ec)) + ".", { ctx: "EC", guide: [GS("Rapport " + M("\\frac{DB}{AD}") + " ?", db / ad, M("\\frac{" + db + "}{" + ad + "}") + "."), GS(M("EC") + " = ?", ec, M(N(ec)) + ".")], traps: [TR(r6(ae * ad / db), "Même ordre : DB/AD = EC/AE.")] }); },
      () => { const cs = [0, 1, 2, 3].map(() => { const k = pk([1.25, 1.5, 2.5, 0.8].filter((x) => x > 1)), a = R.int(2, 9), b = R.int(2, 9), ok = R.rand() < 0.5; return [a, r6(a * k), b, r6(b * k + (ok ? 0 : pk([-0.1, 0.1, 0.2]))), ok]; }), n = cs.filter((c) => c[4]).length;
        return Qv("Combien de ces configurations donnent " + M("(DE) \\parallel (BC)") + " ? " + cs.map((c, i) => "(" + (i + 1) + ") " + M("AD = " + c[0] + ", AB = " + N(c[1]) + ", AE = " + c[2] + ", AC = " + N(c[3]))).join(" ; "), n,
          cs.map((c, i) => "(" + (i + 1) + ") " + M(c[0] + " \\cdot " + N(c[3]) + (c[4] ? " = " : " \\neq ") + c[2] + " \\cdot " + N(c[1]))).join(" ; ") + " (produits en croix) : " + n + ".",
          { ctx: "compter-decimaux", guide: [GS("Astuce : compare les produits en croix " + M("AD \\cdot AC") + " et " + M("AE \\cdot AB") + ". Cas (1) : " + M("AD \\cdot AC") + " = ?", r6(cs[0][0] * cs[0][3]), M(N(cs[0][0] * cs[0][3])) + "."), GS("Nombre de cas parallèles ?", n, n + ".")], traps: [TR(4, "Un petit écart suffit : pas parallèles."), TR(n === 0 ? 1 : n - 1, "Vérifie chaque cas.")] }); },
    ],
  };

  // ===================== simil =====================
  const SIM = {
    1: [
      () => { const k = pk([1.5, 2, 2.5, 3]), a = R.int(2, 8), b = R.int(3, 9), c = R.int(3, 9);
        return Qv("Deux triangles sont semblables. Les côtés du petit mesurent " + M(a) + ", " + M(b) + " et " + M(c) + " cm. Le côté du grand qui correspond à " + M(a) + " cm mesure " + T(a * k) + " cm. Combien mesure le côté du grand qui correspond à " + M(b) + " cm ?", r6(b * k),
          "Rapport " + M(N(a * k) + " : " + a + " = " + N(k)) + " ; " + M(b + " \\cdot " + N(k) + " = " + N(b * k)) + " cm.",
          { ctx: "cote", fig: FIG.simTri([a, b, c].map((v) => v + ""), [L(a * k), "?", ""]), guide: [GS("Rapport d'agrandissement ?", k, M(N(k)) + "."), GS("Côté cherché ?", r6(b * k), M(N(b * k)) + " cm.")], traps: [TR(b + a * k - a, "On multiplie par le rapport, on n'ajoute pas la différence.")] }); },
      () => { const a = R.int(2, 9), k = pk([2, 3, 1.5, 2.5, 4]);
        return Qv("Un triangle est agrandi : un côté de " + M(a) + " cm devient " + T(a * k) + " cm. Quel est le rapport d'agrandissement ?", k, M(N(a * k) + " : " + a + " = " + N(k)) + ".",
          { ctx: "rapport", guide: [GS("Le rapport, c'est nouvelle longueur ÷ ancienne : " + M(N(a * k) + " : " + a) + " = ?", k, M(N(k)) + ".")], traps: [TR(r6(1 / k), "Grande ÷ petite pour un agrandissement."), TR(r6(a * k - a), "C'est l'augmentation de longueur, pas le rapport.")] }); },
      () => { const e = pk([25000, 50000, 10000, 20000]), c = pk([3, 4, 6, 8, 2.5]), m = r6(c * e / 100);
        return Qv("Sur une carte à l'échelle " + M("1\\,:\\," + String(e).replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}")) + ", deux villages sont à " + T(c) + " cm. Quelle est la distance réelle, en m ?", m,
          M(N(c) + " \\cdot " + e + " = " + N(c * e)) + " cm, soit " + M(N(m)) + " m.", { ctx: "carte", guide: [GS("Distance réelle en cm ?", r6(c * e), M(N(c * e)) + " cm."), GS("En m (÷ 100) ?", m, M(N(m)) + " m.")], traps: [TR(r6(c * e), "Convertis les cm en m."), TR(r6(c * e / 100000), "Ça, ce sont des km ; on demande des m.")] }); },
    ],
    2: [
      () => { const k = pk([1.5, 2, 2.5, 3, 4]), A = R.int(3, 20);
        return Qv("On agrandit une figure de rapport " + T(k) + ". Son aire était de " + M(A) + " cm². Quelle est la nouvelle aire (en cm²) ?", r6(A * k * k), "Les aires sont multipliées par " + M(N(k) + "^2 = " + N(k * k)) + " : " + M(A + " \\cdot " + N(k * k) + " = " + N(A * k * k)) + " cm².",
          { ctx: "aire", fig: FIG.scaling(k, ""), guide: [GS("Les aires sont multipliées par " + M("k^2") + ". " + M(N(k) + "^2") + " = ?", r6(k * k), M(N(k * k)) + "."), GS("Nouvelle aire ?", r6(A * k * k), M(N(A * k * k)) + " cm².")], traps: [TR(r6(A * k), "Les aires ne sont pas multipliées par k, mais par k²."), TR(r6(A * k * k * k), "k³, c'est pour les volumes.")] }); },
      () => { const k = pk([2, 3, 4, 5]), A = R.int(2, 12);
        return Qv("Deux figures semblables ont pour aires " + M(A) + " cm² et " + M(A * k * k) + " cm². Quel est le rapport d'agrandissement des longueurs ?", k, "Rapport des aires " + M(A * k * k + " : " + A + " = " + k * k) + " = " + M("k^2") + ", donc " + M("k = " + k) + ".",
          { ctx: "kdepuisaire", guide: [GS("Rapport des aires ?", k * k, M(k * k) + "."), GS("Les longueurs : racine carrée. " + M("k") + " = ?", k, M("\\sqrt{" + k * k + "} = " + k) + ".")], traps: [TR(k * k, "C'est le rapport des aires ; celui des longueurs est sa racine carrée.")] }); },
      () => { const k = pk([1.5, 2, 2.5, 3]), p = R.int(12, 40);
        return Qv("Un polygone de périmètre " + M(p) + " cm est agrandi de rapport " + T(k) + ". Quel est le nouveau périmètre (en cm) ?", r6(p * k), "Les longueurs (et donc le périmètre) sont multipliées par " + M(N(k)) + " : " + M(N(p * k)) + " cm.",
          { ctx: "perimetre", guide: [GS("Le périmètre est une longueur : multiplié par " + M("k") + " ou " + M("k^2") + " ? Tape le facteur.", k, M(N(k)) + "."), GS("Nouveau périmètre ?", r6(p * k), M(N(p * k)) + " cm.")], traps: [TR(r6(p * k * k), "k², c'est pour les aires ; le périmètre est une longueur.")] }); },
    ],
    3: [
      () => { const e = pk([10, 20, 50]), V = R.int(2, 12);
        return Qv("Une maquette est à l'échelle " + M("1\\,:\\," + e) + ". Son volume est de " + M(V) + " cm³. Quel est le volume réel, en litres ?", (V * e ** 3) / 1000, "Les volumes sont multipliés par " + M(e + "^3 = " + N(e ** 3)) + " : " + M(V + " \\cdot " + N(e ** 3) + " = " + N(V * e ** 3)) + " cm³ " + M("= " + N((V * e ** 3) / 1000)) + " L.",
          { ctx: "maquette", guide: [GS("Facteur des volumes " + M(e + "^3") + " ?", e ** 3, M(N(e ** 3)) + "."), GS("Volume réel en cm³ ?", V * e ** 3, M(N(V * e ** 3)) + " cm³."), GS("En litres (÷ 1000) ?", (V * e ** 3) / 1000, M(N((V * e ** 3) / 1000)) + " L.")], traps: [TR((V * e * e) / 1000, "Les volumes sont multipliés par k³."), TR(V * e ** 3, "Convertis en litres (1 L = 1000 cm³).")] }); },
      () => { const k = pk([2, 3, 4]), A = R.int(2, 12), p = A + R.int(5, 9);
        return Qv("Deux figures semblables ont pour aires " + M(A) + " cm² et " + M(A * k * k) + " cm². Le périmètre de la petite est " + M(p) + " cm. Quel est le périmètre de la grande (en cm) ?", p * k,
          M("k^2 = " + k * k) + ", donc " + M("k = " + k) + " ; périmètre " + M(p + " \\cdot " + k + " = " + p * k) + " cm.", { ctx: "aire-perimetre", guide: [GS("Rapport des aires ?", k * k, M(k * k) + "."), GS(M("k") + " ?", k, M(k) + "."), GS("Périmètre de la grande ?", p * k, M(p * k) + " cm.")], traps: [TR(p * k * k, "Le périmètre est une longueur : × k, pas × k².")] }); },
      () => { const oa = R.int(2, 6), k = pk([2, 2.5, 3, 1.5]), ab = R.int(3, 8);
        return Qv("L'homothétie de centre " + M("O") + " et de rapport " + T(k) + " envoie " + M("A") + " sur " + M("A'") + " et " + M("B") + " sur " + M("B'") + ". " + M("OA = " + oa) + " cm et " + M("AB = " + ab) + " cm. Calcule " + M("AA'") + " (en cm).", r6(oa * (k - 1)),
          M("OA' = " + N(k) + " \\cdot " + oa + " = " + N(oa * k)) + ", donc " + M("AA' = OA' - OA = " + N(oa * (k - 1))) + " cm (" + M("A") + " et " + M("A'") + " sont du même côté de " + M("O") + ").",
          { ctx: "homothetie", guide: [GS(M("OA'") + " = ?", r6(oa * k), M(N(oa * k)) + " cm."), GS(M("AA' = OA' - OA") + " = ?", r6(oa * (k - 1)), M(N(oa * (k - 1))) + " cm.")], traps: [TR(r6(oa * k), "C'est OA' ; on demande la distance AA'."), TR(r6(ab * k), "AB n'intervient pas ici.")] }); },
    ],
  };

  const PROBS = {
    thales: [
      () => P("Un panneau de 2 m de haut a une ombre de 1,5 m. Au même moment, l'ombre d'une tour mesure 45 m.", [["a) Rapport entre les ombres", 30], ["b) Hauteur de la tour (m)", 60], ["c) Longueur de l'ombre d'un arbre de 9 m (m)", 6.75]], ["Les rayons du soleil sont parallèles.", "Hauteur ÷ ombre est le même pour tous : 2 ÷ 1,5."], "a) 30 ; b) 60 m ; c) " + M("9 \\cdot \\frac{1{,}5}{2} = 6{,}75") + " m."),
      () => P("Dans un triangle ABC, D ∈ [AB], E ∈ [AC], (DE) ∥ (BC) ; AD = 4, DB = 6, AE = 5, DE = 3.", [["a) AB", 10], ["b) AC", 12.5], ["c) BC", 7.5], ["d) Périmètre du trapèze DECB", 24]], ["AB = AD + DB ; rapport AB/AD.", "Trapèze : DB + BC + CE + ED."], "a) 10 ; b) 12,5 ; c) 7,5 ; d) " + M("6 + 7{,}5 + 7{,}5 + 3 = 24") + "."),
    ],
    thalesrec: [
      () => P("D ∈ [AB], E ∈ [AC] avec AD = 3, AB = 7,5, AE = 4, AC = 10.", [["a) AD/AB (décimal)", 0.4], ["b) AE/AC (décimal)", 0.4], ["c) Si BC = 12, que vaut DE ?", 4.8]], ["Rapports égaux : parallèles.", "DE = BC · 0,4."], "a) et b) 0,4, donc (DE) ∥ (BC) ; c) " + M("4{,}8") + "."),
      () => P("Pour vérifier qu'une étagère est parallèle au sol, on mesure : AD = 30 cm, AB = 75 cm sur un montant, AE = 32 cm, AC = 80 cm sur l'autre.", [["a) AD · AC", 2400], ["b) AE · AB", 2400], ["c) Différence (0 si parallèle)", 0]], ["Produits en croix.", "Égaux : réciproque de Thalès."], "Produits égaux (2400) : l'étagère est parallèle."),
    ],
    simil: [
      () => P("Une photo de 10 cm × 15 cm est agrandie en 25 cm de large.", [["a) Rapport d'agrandissement", 2.5], ["b) Nouvelle longueur (cm)", 37.5], ["c) Par combien l'aire est-elle multipliée ?", 6.25]], ["25 ÷ 10.", "Aire : k²."], "a) 2,5 ; b) 37,5 cm ; c) 6,25."),
      () => P("Une maquette de voiture est à l'échelle " + M("1\\,:\\,20") + ".", [["a) Longueur réelle si la maquette mesure 22 cm (m)", 4.4], ["b) Une vitre de 30 cm² sur la maquette : aire réelle (m²)", 1.2], ["c) Un réservoir de 6 cm³ sur la maquette : volume réel (L)", 48]], ["Longueurs × 20, aires × 400, volumes × 8000.", "1 m² = 10'000 cm² ; 1 L = 1000 cm³."], "a) 4,4 m ; b) 12'000 cm² = 1,2 m² ; c) 48'000 cm³ = 48 L."),
    ],
  };

  const ALL = { thales: TH, thalesrec: REC, simil: SIM };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => { const L0 = lv[Math.min(Math.max(d, 1), 3)]; let q = null; for (let k = 0; k < 40 && !(q && q.traps && q.traps.length); k++) q = pk(L0)(); return q; };
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    thales: "Avec (DE) ∥ (BC) : AD/AB = AE/AC = DE/BC. Repère le petit et le grand triangle, puis applique le même rapport.",
    thalesrec: "Compare AD/AB et AE/AC (ou les produits en croix) : égaux → parallèles ; différents → pas parallèles.",
    simil: "Agrandissement de rapport k : longueurs × k, aires × k², volumes × k³.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    thales: ["Calculer une longueur, ombres", "Avec DB donné, décimaux, papillon", "Trapèze, rivière, équation"],
    thalesrec: ["Longueur pour avoir des parallèles", "Décimaux, contraposée, papillon", "Prouver puis calculer, produits en croix"],
    simil: ["Côté, rapport, échelle", "Aires et périmètres", "Volumes, homothétie"],
  });
})();
