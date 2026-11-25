// Chantier 1re Collège (bêta-testeurs) · lot 4 du plan pas à pas (19.11) : une seule source pour polyop, factor2,
// trinfact, f2, f2formes. Même standard que ch1c_sys.js : au moins 3 formes par niveau, pas à pas, erreurs typiques
// (expressions fausses mais plausibles), étiquette ctx ; défis en plusieurs étapes. Coefficients entiers : poly() sert
// à la fois d'écriture TeX et de réponse attendue (le lecteur d'expressions accepte « 3x »).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const den = (v) => { for (let d = 1; d <= 120; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fS = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); if (!d) return String(+v.toFixed(6)); return Math.round(v * d) + "/" + d; };
  const fT = (v) => { const d = den(v); if (d === 1) return String(Math.round(v)); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const par = (v) => (v < 0 ? "(" + v + ")" : String(v));
  const sg = (v) => (v < 0 ? " - " + -v : " + " + v);
  const xm = (r) => (r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + -r);
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b ? sg(b) : "");
  const co = (a) => (a === 1 ? "" : a === -1 ? "-" : String(a));
  const P2 = (cs) => poly(ptrim(cs));
  // ---------- constructeurs ----------
  const show = (spec) => (spec.kind === "pair" || spec.kind === "set" ? spec.values.map(fS).join(" ; ") : "");
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > 1e-9; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.hint) x.hint = o.hint; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(fS).join(" ; ") }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QX = (q, expr, form, sol, o) => mk(q, Object.assign({ kind: "expr", expr }, form ? { form } : {}), sol, Object.assign({ canon: expr }, o, { traps: (o.traps || []).filter((tr) => { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(expr)); } catch (e) { return false; } }) }));
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TSet = (vals, m) => ({ spec: { kind: "set", values: [...new Set(vals)] }, m });
  const TX = (e, m) => ({ e, m });
  const TR = TRAP;
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const DEV = "Développe et réduis : ", FAC = "Factorise au maximum dans \\(\\mathbb{R}\\) : "; // 22.11 : dans R (retour de l auteur)
  const fx = (a, p, q) => co(a) + "(" + xm(p) + ")(" + xm(q) + ")";

  // ===================== polyop =====================
  const PO = {
    1: [
      () => { const a = nz(-4, 4), b = nz(-7, 7), c = nz(-4, 4), e = nz(-7, 7), cs = pmul([a, b], [c, e]); if (Math.abs(a) === 1 && Math.abs(c) === 1) return null;
        return QX(DEV + M("(" + lin(a, b) + ")(" + lin(c, e) + ")") + ".", P2(cs), "expanded", "Double distributivité : " + M(a * c + "x^2" + sg(a * e) + "x" + sg(b * c) + "x" + sg(b * e) + " = " + P2(cs)) + ".",
          { ctx: "double-distrib", guide: [GS("Coefficient de " + M("x^2") + " ?", a * c, M(a + " \\cdot " + par(c) + " = " + a * c) + "."), GS("Coefficient de " + M("x") + " (" + M(a + " \\cdot " + par(e) + " + " + b + " \\cdot " + par(c)) + ") ?", a * e + b * c, M(a * e + b * c) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([a * c, 0, b * e]), "Il manque les produits croisés : chaque terme multiplie chaque terme."), TX(P2([a * c, a * e - b * c, b * e]), "Attention aux signes des produits croisés.")] }); },
      () => { const a = R.int(2, 6), b = nz(-6, 6), c = R.int(2, 6), e = nz(-6, 6), cs = [a - c, a * b + c * e]; if (a === c) return null;
        return QX(DEV + M(a + "(" + lin(1, b) + ") - " + c + "(" + lin(1, -e) + ")") + ".", P2(cs), "expanded", M(a + "x" + sg(a * b) + " - " + c + "x" + sg(c * e) + " = " + P2(cs)) + " : le « − » devant la parenthèse change tous les signes.",
          { ctx: "moins-parenthese", guide: [GX("Développe " + M("-" + c + "(" + lin(1, -e) + ")"), P2([-c, c * e]), M(P2([-c, c * e])) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([a - c, a * b - c * e]), "−" + c + " · (" + -e + ") = " + c * e + " : le moins change le signe du 2e terme aussi.")] }); },
      () => { const a = nz(-8, 8), k = pk([1, 2, 3]), sq = R.rand() < 0.5, cs = sq ? [k * k, 2 * k * a, a * a] : [k * k, 0, -a * a];
        return QX(DEV + M(sq ? "(" + lin(k, a) + ")^2" : "(" + lin(k, a) + ")(" + lin(k, -a) + ")") + ".", P2(cs), "expanded", (sq ? "Identité " + M("(A + B)^2 = A^2 + 2AB + B^2") : "Identité " + M("(A + B)(A - B) = A^2 - B^2")) + " : " + M(P2(cs)) + ".",
          { ctx: sq ? "identite-carre" : "identite-diff", guide: [GS(sq ? "Double produit " + M("2AB") + " (coefficient de x) ?" : "Coefficient de " + M("x^2") + " ?", sq ? 2 * k * a : k * k, M(sq ? 2 * k * a : k * k) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: sq ? [TX(P2([k * k, 0, a * a]), "(A + B)² n'est pas A² + B² : il manque le double produit 2AB."), TX(P2([k * k, k * a, a * a]), "Le double produit vaut 2AB.")] : [TX(P2([k * k, 0, a * a]), "(A + B)(A − B) = A² − B² : le dernier terme est négatif.")] }); },
    ],
    2: [
      () => { const a = R.int(2, 5), b = nz(-6, 6), c = R.int(1, 4), e = R.int(1, 7), cs = padd(pmul([a, b], [a, b]), pscale([c * c, 0, -e * e], -1));
        return QX(DEV + M("(" + lin(a, b) + ")^2 - (" + lin(c, e) + ")(" + lin(c, -e) + ")") + ".", P2(cs), "expanded", M("(" + lin(a, b) + ")^2 = " + P2(pmul([a, b], [a, b]))) + " et " + M("(" + lin(c, e) + ")(" + lin(c, -e) + ") = " + P2([c * c, 0, -e * e])) + " ; on soustrait : " + M(P2(cs)) + ".",
          { ctx: "carre-moins-produit", guide: [GX("Développe " + M("(" + lin(a, b) + ")^2"), P2(pmul([a, b], [a, b])), M(P2(pmul([a, b], [a, b]))) + "."), GX("Développe " + M("(" + lin(c, e) + ")(" + lin(c, -e) + ")"), P2([c * c, 0, -e * e]), M(P2([c * c, 0, -e * e])) + "."), GX("Différence", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2(padd(pmul([a, b], [a, b]), [-c * c, 0, -e * e])), "On soustrait TOUT le 2e produit : −(" + c * c + "x² − " + e * e + ") = −" + c * c + "x² + " + e * e + "."), TX(P2(padd([a * a, 0, b * b], [-c * c, 0, e * e])), "(A + B)² = A² + 2AB + B².")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), c = nz(-6, 6), cs = pmul([1, a], [1, b, c]);
        return QX(DEV + M("(" + lin(1, a) + ")(" + P2([1, b, c]) + ")") + ".", P2(cs), "expanded", M("x(" + P2([1, b, c]) + ")" + sg(a) + "(" + P2([1, b, c]) + ") = " + P2(cs)) + ".",
          { ctx: "cubique", guide: [GX("Développe " + M("x(" + P2([1, b, c]) + ")"), P2([1, b, c, 0]), M(P2([1, b, c, 0])) + "."), GX("Développe " + M(a + "(" + P2([1, b, c]) + ")"), P2([a, a * b, a * c]), M(P2([a, a * b, a * c])) + "."), GX("Somme réduite", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([1, b, c + a]), "Chaque terme de la 1re parenthèse multiplie chaque terme de la 2e."), TX(P2([1, b + a, c + a * b, a * c + 1]), "Regroupe bien les termes de même degré.")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6); if (a === b || a === -b) return null; const cs = [2 * (a - b), a * a - b * b];
        return QX(DEV + M("(" + lin(1, a) + ")^2 - (" + lin(1, b) + ")^2") + ".", P2(cs), "expanded", M(P2([1, 2 * a, a * a]) + " - (" + P2([1, 2 * b, b * b]) + ") = " + P2(cs)) + " : les " + M("x^2") + " s'annulent.",
          { ctx: "difference-carres", guide: [GS("Que devient " + M("x^2 - x^2") + " ?", 0, "0 : il ne reste qu'un 1er degré."), GS("Coefficient de " + M("x") + " ?", 2 * (a - b), M(2 * a + " - " + par(2 * b) + " = " + 2 * (a - b)) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([2 * (a + b), a * a + b * b]), "On soustrait tout le 2e carré : les signes changent."), TX(String(a * a - b * b), "N'oublie pas les doubles produits.")] }); },
    ],
    3: [
      () => { const a = pk([1, 2]), b = nz(-3, 3), p = nz(-4, 4), r = nz(-5, 5), cube = pmul(pmul([a, b], [a, b]), [a, b]), cs = padd(cube, pscale(pmul([1, p], [1, 0, r]), -1));
        return QX(DEV + M("(" + lin(a, b) + ")^3 - (" + lin(1, p) + ")(" + P2([1, 0, r]) + ")") + ".", P2(cs), "expanded", M("(" + lin(a, b) + ")^3 = " + P2(cube)) + " ; " + M("(" + lin(1, p) + ")(" + P2([1, 0, r]) + ") = " + P2(pmul([1, p], [1, 0, r]))) + " ; différence : " + M(P2(cs)) + ".",
          { ctx: "cube", guide: [GX("Développe " + M("(" + lin(a, b) + ")^3"), P2(cube), M(P2(cube)) + "."), GX("Développe le produit", P2(pmul([1, p], [1, 0, r])), M(P2(pmul([1, p], [1, 0, r]))) + "."), GX("Différence", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2(padd([a ** 3, 0, 0, b ** 3], pscale(pmul([1, p], [1, 0, r]), -1))), "(A + B)³ n'est pas A³ + B³ : (A + B)³ = A³ + 3A²B + 3AB² + B³.")] }); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), c = nz(-4, 4); if (new Set([a, b, c]).size < 3) return null; const cs = pmul(pmul([1, a], [1, b]), [1, c]);
        return QX(DEV + M("(" + lin(1, a) + ")(" + lin(1, b) + ")(" + lin(1, c) + ")") + ".", P2(cs), "expanded", M("(" + lin(1, a) + ")(" + lin(1, b) + ") = " + P2(pmul([1, a], [1, b]))) + ", puis fois " + M("(" + lin(1, c) + ")") + " : " + M(P2(cs)) + ".",
          { ctx: "trois-facteurs", guide: [GX("D'abord " + M("(" + lin(1, a) + ")(" + lin(1, b) + ")"), P2(pmul([1, a], [1, b])), M(P2(pmul([1, a], [1, b]))) + "."), GS("Terme constant (" + M(a + " \\cdot " + par(b) + " \\cdot " + par(c)) + ") ?", a * b * c, M(a * b * c) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([1, a + b + c, a * b * c]), "Le produit de trois facteurs du 1er degré est de degré 3.")] }); },
      () => { const a = pk([1, 2, 3]), k = R.int(1, 5), cs = [a * a, 0, 0, 0, -(k ** 4)];
        return QX(DEV + M("(" + co(a) + "x^2 - " + k * k + ")(" + co(a) + "x^2 + " + k * k + ")") + ".", P2(cs), "expanded", "Identité " + M("(A - B)(A + B) = A^2 - B^2") + " avec " + M("A = " + co(a) + "x^2") + " : " + M(P2(cs)) + ".",
          { ctx: "identite-x2", guide: [GX(M("A^2 = (" + co(a) + "x^2)^2"), P2([a * a, 0, 0, 0, 0]), M(P2([a * a, 0, 0, 0, 0])) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")],
            traps: [TX(P2([a * a, 0, -(k ** 4)]), "(x²)² = x⁴ : on multiplie les exposants."), TX(P2([a * a, 0, 0, 0, -k * k]), "B² = (" + k * k + ")² = " + k ** 4 + ".")] }); },
    ],
  };

  // ===================== factor2 =====================
  const FC = {
    1: [
      () => { const a = R.int(2, 6), m = nz(-9, 9), e = a + "x(" + lin(1, m) + ")";
        return QX(FAC + M(P2([a, a * m, 0])) + ".", e, "product", "Mise en évidence de " + M(a + "x") + " : " + M(e) + ".",
          { ctx: "mise-en-evidence", guide: [GX("Facteur commun", a + "x", M(a + "x") + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX("x(" + a + "x" + (a * m < 0 ? "-" + -a * m : "+" + a * m) + ")", "On peut encore sortir " + a + " : factorise au maximum."), TX(a + "(x^2" + (m < 0 ? "-" + -m : "+" + m) + ")", "x aussi est commun aux deux termes.")] }); },
      () => { const a = R.int(1, 6), k = R.int(1, 9), e = co(a) + "(x-" + k + ")(x+" + k + ")";
        return QX(FAC + M(P2([a, 0, -a * k * k])) + ".", e, "product", (a > 1 ? "Mise en évidence de " + M(a) + ", puis " : "") + "différence de carrés " + M("x^2 - " + k * k + " = (x - " + k + ")(x + " + k + ")") + ".",
          { ctx: "diff-carres", guide: [GS("Quel nombre au carré donne " + M(k * k) + " ?", k, M(k) + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX(co(a) + "(x-" + k + ")^2", "x² − " + k * k + " = (x − " + k + ")(x + " + k + ") : différence de carrés, pas un carré."), ...(a > 1 ? [TX("(" + a + "x-" + a * k + ")(x+" + k + ")", "Mets d'abord " + a + " en évidence pour factoriser au maximum.")] : [])] }); },
      () => { const k = nz(-8, 8), a = pk([1, 1, 2, 3]), e = co(a) + "(x" + (k < 0 ? "-" + -k : "+" + k) + ")^2";
        return QX(FAC + M(P2([a, 2 * a * k, a * k * k])) + ".", e, "product", (a > 1 ? "Mise en évidence de " + M(a) + ", puis " : "") + "identité " + M("A^2 + 2AB + B^2 = (A + B)^2") + " : " + M(co(a) + "(" + xm(-k) + ")^2") + ".",
          { ctx: "carre-parfait", guide: [GS("Le terme constant (" + M(k * k) + ") est le carré de… (avec le signe du terme en x) ?", k, M(k) + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX(co(a) + "(x" + (k < 0 ? "+" + -k : "-" + k) + ")^2", "Le signe dans la parenthèse est celui du terme en x."), TX(co(a) + "(x-" + Math.abs(k) + ")(x+" + Math.abs(k) + ")", "Ce n'est pas une différence de carrés : il y a un terme en x.")] }); },
    ],
    2: [
      () => { const p = nz(-7, 7), q = nz(-7, 7), a = pk([1, 1, 2, 3, -1]); if (p === q || p === -q) return null; const cs = pscale(pmul([1, -p], [1, -q]), a), e = co(a) + "(" + xm(p) + ")(" + xm(q) + ")";
        return QX(FAC + M(P2(cs)) + ".", e.replace(/ /g, ""), "product", (a !== 1 ? "Mise en évidence de " + M(a) + ", puis " : "") + "deux nombres de somme " + M(-(p + q)) + " et de produit " + M(p * q) + " : " + M(-p) + " et " + M(-q) + ". " + M(e) + ".",
          { ctx: "somme-produit", guide: [GSet("Zéros du trinôme ?", [p, q], M(p) + " et " + M(q) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX(co(a) + "(" + xm(-p) + ")(" + xm(-q) + ")".replace(/ /g, ""), "Zéro p ↔ facteur (x − p) : le signe s'inverse.")] }); },
      () => { const a = pk([2, 3, 4]), b = nz(-5, 5), c = R.int(1, 7), e = "(" + lin(a, b - c) + ")(" + lin(a, b + c) + ")";
        return QX(FAC + M("(" + lin(a, b) + ")^2 - " + c * c) + ".", e.replace(/ /g, ""), "product", "Différence de carrés " + M("A^2 - B^2 = (A - B)(A + B)") + " avec " + M("A = " + lin(a, b)) + " et " + M("B = " + c) + " : " + M(e) + ".",
          { ctx: "diff-carres-bloc", guide: [GS(M("B") + " (" + M("B^2 = " + c * c) + ") ?", c, M(c) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX("(" + lin(a, b) + "-" + c + ")^2", "A² − B² = (A − B)(A + B), pas (A − B)².")] }); },
      () => { const a = R.int(2, 5), p = nz(-6, 6), r = pk([1, 2, 3]) * pk([1, -1]), e = a + "x(x-" + Math.abs(r) + ")(x+" + Math.abs(r) + ")";
        return QX(FAC + M(P2([a, 0, -a * r * r, 0])) + ".", e, "product", "Mise en évidence de " + M(a + "x") + " : " + M(a + "x(x^2 - " + r * r + ")") + ", puis différence de carrés : " + M(e) + ".",
          { ctx: "evidence-puis-diff", guide: [GX("Après la mise en évidence de " + M(a + "x"), a + "x(x^2-" + r * r + ")", M(a + "x(x^2 - " + r * r + ")") + "."), GX("Factorisation complète", e, M(e) + ".")], traps: [TX(a + "x(x^2-" + r * r + ")", "On peut encore factoriser x² − " + r * r + " (différence de carrés).")] }); },
    ],
    3: [
      () => { const p = nz(-5, 5), q = R.int(1, 5); if (Math.abs(p) === q) return null; const e = "(" + lin(1, p) + ")(x-" + q + ")(x+" + q + ")";
        return QX(FAC + M(P2([1, p, -q * q, -p * q * q])) + ".", e.replace(/ /g, ""), "product", "Groupements : " + M("x^2(" + lin(1, p) + ") - " + q * q + "(" + lin(1, p) + ") = (" + lin(1, p) + ")(x^2 - " + q * q + ")") + ", puis différence de carrés.",
          { ctx: "groupement", guide: [GX("Après groupement", "(" + lin(1, p).replace(/ /g, "") + ")(x^2-" + q * q + ")", M("(" + lin(1, p) + ")(x^2 - " + q * q + ")") + "."), GX("Factorisation complète", e.replace(/ /g, ""), M(e) + ".")], traps: [TX("(" + lin(1, p).replace(/ /g, "") + ")(x^2-" + q * q + ")", "x² − " + q * q + " se factorise encore.")] }); },
      () => { let a, b, c, e; do { a = R.int(2, 4); b = nz(-5, 5); c = R.int(1, 3); e = nz(-5, 5); } while (gcd(a, Math.abs(b)) !== 1 || gcd(c, Math.abs(e)) !== 1 || a * e === b * c); const f = "(" + lin(a, b) + ")(" + lin(c, e) + ")";
        return QX(FAC + M(P2(pmul([a, b], [c, e]))) + ".", f.replace(/ /g, ""), "product", "Zéros " + M(fT(-b / a)) + " et " + M(fT(-e / c)) + " (discriminant) : " + M(f) + ".",
          { ctx: "non-unitaire", guide: [GSet("Zéros (fractions acceptées) ?", [-b / a, -e / c], M(fT(-b / a)) + " et " + M(fT(-e / c)) + "."), GX("Factorisation", f.replace(/ /g, ""), M(f) + ".")], traps: [TX("(x" + (b < 0 ? "-" + -b : "+" + b) + ")(x" + (e < 0 ? "-" + -e : "+" + e) + ")", "Le coefficient de x² n'est pas 1 : vérifie en développant.")] }); },
      () => { const k = pk([1, 2, 3]), e = "(x-" + k + ")(x+" + k + ")(x^2+" + k * k + ")";
        return QX(FAC + M("x^4 - " + k ** 4) + ".", e, "product", M("x^4 - " + k ** 4 + " = (x^2 - " + k * k + ")(x^2 + " + k * k + ")") + ", et " + M("x^2 - " + k * k + " = (x - " + k + ")(x + " + k + ")") + " ; " + M("x^2 + " + k * k) + " ne se factorise pas.",
          { ctx: "x4", guide: [GX("Première différence de carrés", "(x^2-" + k * k + ")(x^2+" + k * k + ")", M("(x^2 - " + k * k + ")(x^2 + " + k * k + ")") + "."), GX("Factorisation complète", e, M(e) + ".")], traps: [TX("(x^2-" + k * k + ")(x^2+" + k * k + ")", "x² − " + k * k + " se factorise encore.")] }); },
    ],
  };

  // ===================== trinfact =====================
  const TF = {
    1: [
      () => { const p = nz(-7, 7), q = nz(-7, 7); if (p === q || p === -q) return null; const e = "(" + xm(p) + ")(" + xm(q) + ")";
        return QX("Factorise : " + M(P2([1, -(p + q), p * q])) + ".", e.replace(/ /g, ""), "product", "Deux nombres de somme " + M(p + q) + " et de produit " + M(p * q) + " : les zéros " + M(p) + " et " + M(q) + ". " + M(e) + ".",
          { ctx: "unitaire", guide: [GS("Plus petit zéro ?", Math.min(p, q), M(Math.min(p, q)) + "."), GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX(("(" + xm(-p) + ")(" + xm(-q) + ")").replace(/ /g, ""), "Zéro p ↔ facteur (x − p).")] }); },
      () => { const p = nz(-6, 6), e = "(" + xm(p) + ")^2";
        return QX("Factorise : " + M(P2([1, -2 * p, p * p])) + ".", e.replace(/ /g, ""), "product", "Un seul zéro (double) : " + M(p) + ". " + M(e) + ".",
          { ctx: "double", guide: [GS("Zéro double ?", p, M(p) + "."), GX("Factorisation", e.replace(/ /g, ""), M(e) + ".")], traps: [TX(("(" + xm(p) + ")(" + xm(-p) + ")").replace(/ /g, ""), "Développe pour vérifier : ce serait x² − " + p * p + ".")] }); },
      () => { const p = nz(-7, 7), q = nz(-7, 7); if (p === q || p === -q) return null;
        return QSet("Quels sont les zéros de " + M(P2([1, -(p + q), p * q])) + " ?", [p, q], M(P2([1, -(p + q), p * q]) + " = (" + xm(p) + ")(" + xm(q) + ")") + " : zéros " + M(p) + " et " + M(q) + ".",
          { ctx: "zeros", guide: [GS("Produit des zéros ?", p * q, M(p * q) + "."), GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Les zéros sont p et q quand le trinôme vaut (x − p)(x − q).")] }); },
    ],
    2: [
      () => { const a = pk([2, 3, -1, -2]), p = nz(-6, 6), q = nz(-6, 6); if (p === q) return null; const e = (a === -1 ? "-" : a + "*") + "(" + xm(p) + ")*(" + xm(q) + ")";
        return QX("Factorise : " + M(P2([a, -a * (p + q), a * p * q])) + ".", e.replace(/ /g, ""), "product", "Zéros " + M(p) + " et " + M(q) + " : " + M(fx(a, p, q)) + ".",
          { ctx: "coef-a", guide: [GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + "."), GX("Factorisation (n'oublie pas " + M("a") + ")", e.replace(/ /g, ""), M(fx(a, p, q)) + ".")], traps: [TX(("(" + xm(p) + ")(" + xm(q) + ")").replace(/ /g, ""), "N'oublie pas le coefficient " + a + " devant les parenthèses.")] }); },
      () => { const a = pk([2, 3]), n = pk([1, -1, a === 2 ? 3 : 2, a === 2 ? -3 : -2]), q = nz(-6, 6), e = "(" + a + "x" + (n > 0 ? "-" + n : "+" + -n) + ")(" + xm(q).replace(/ /g, "") + ")";
        return QX("Factorise : " + M(P2([a, -n - a * q, n * q])) + ".", e, "product", "Zéros " + M(fT(n / a)) + " et " + M(q) + " : " + M(a + "(x - " + (n < 0 ? "(" + fT(n / a) + ")" : fT(n / a)) + ")(" + xm(q) + ") = " + e) + ".",
          { ctx: "zero-fraction", guide: [GSet("Zéros (fraction acceptée) ?", [n / a, q], M(fT(n / a)) + " et " + M(q) + "."), GX("Factorisation", e, M(e) + ".")], traps: [TX("(x" + (n > 0 ? "-" + n : "+" + -n) + ")(" + xm(q).replace(/ /g, "") + ")", "Développe pour vérifier : le coefficient de x² doit être " + a + ".")] }); },
      () => { const a = pk([2, 3, -1, 4]), p = nz(-5, 5), q = nz(-5, 5); if (p === q) return null;
        return QX("Un trinôme a pour coefficient dominant " + M(a) + " et pour zéros " + M(p) + " et " + M(q) + ". Écris-le sous forme développée.", P2([a, -a * (p + q), a * p * q]), "expanded", M(fx(a, p, q) + " = " + P2([a, -a * (p + q), a * p * q])) + ".",
          { ctx: "reconstruire", guide: [GX("Forme factorisée", (a === -1 ? "-" : a + "*") + "(" + xm(p).replace(/ /g, "") + ")*(" + xm(q).replace(/ /g, "") + ")", M(fx(a, p, q)) + "."), GX("Forme développée", P2([a, -a * (p + q), a * p * q]), M(P2([a, -a * (p + q), a * p * q])) + ".")], traps: [TX(P2([1, -(p + q), p * q]), "N'oublie pas le coefficient " + a + "."), TX(P2([a, a * (p + q), a * p * q]), "Zéro p ↔ facteur (x − p).")] }); },
    ],
    3: [
      () => { let a, b, c, d; do { a = pk([2, 3]); b = nz(-3, 3); c = pk([2, 3, 5]); d = nz(-4, 4); } while (gcd(a, Math.abs(b)) !== 1 || gcd(c, Math.abs(d)) !== 1 || a * d === b * c); const e = "(" + lin(a, b) + ")(" + lin(c, d) + ")";
        return QX("Factorise : " + M(P2(pmul([a, b], [c, d]))) + ".", e.replace(/ /g, ""), "product", "Zéros " + M(fT(-b / a)) + " et " + M(fT(-d / c)) + " (discriminant) : " + M(e) + ".",
          { ctx: "deux-fractions", guide: [GSet("Zéros (fractions acceptées) ?", [-b / a, -d / c], M(fT(-b / a)) + " et " + M(fT(-d / c)) + "."), GX("Factorisation à coefficients entiers", e.replace(/ /g, ""), M(e) + ".")], traps: [TX("(x" + (b < 0 ? "-" + -b : "+" + b) + ")(x" + (d < 0 ? "-" + -d : "+" + d) + ")", "Le coefficient de x² vaut " + a * c + " : vérifie en développant.")] }); },
      () => { const a = pk([2, 3, 4]), p = nz(-5, 5), e = a + "*(" + xm(p).replace(/ /g, "") + ")^2";
        return QX("Factorise : " + M(P2([a, -2 * a * p, a * p * p])) + ".", e, "product", "Mise en évidence de " + M(a) + ", puis carré parfait : " + M(a + "(" + xm(p) + ")^2") + ".",
          { ctx: "double-coef", guide: [GX("Après la mise en évidence de " + M(a), "x^2" + (p > 0 ? "-" + 2 * p : "+" + -2 * p) + "*x+" + p * p, M(P2([1, -2 * p, p * p])) + "."), GX("Factorisation", e, M(a + "(" + xm(p) + ")^2") + ".")], traps: [TX("(" + a + "x" + (p > 0 ? "-" + p : "+" + -p) + ")^2", "(" + a + "x − …)² donnerait " + a * a + "x² : sors " + a + " en facteur.")] }); },
      () => { const p = nz(-6, 6), q = nz(-6, 6), b = -(p + q), c = p * q; if (p === q) return null; const nb = R.int(0, 2), cc = nb === 0 ? Math.floor(b * b / 4) + R.int(1, 5) : nb === 1 ? b * b / 4 : c; if (nb === 1 && b % 2) return null;
        return QN("Combien de zéros a le trinôme " + M(P2([1, b, cc])) + " ?", nb === 0 ? 0 : nb === 1 ? 1 : 2, M("\\Delta = " + par(b) + "^2 - 4 \\cdot " + par(cc) + " = " + (b * b - 4 * cc)) + " : " + (nb === 0 ? "négatif, aucun zéro (il ne se factorise pas)." : nb === 1 ? "nul, un zéro double." : "positif, deux zéros."),
          { ctx: "discriminant", guide: [GS(M("\\Delta = b^2 - 4ac") + " = ?", b * b - 4 * cc, M(b * b - 4 * cc) + "."), GS("Nombre de zéros ?", nb === 0 ? 0 : nb === 1 ? 1 : 2, "Selon le signe de Δ.")], traps: [TR(nb === 2 ? 0 : 2, "Δ > 0 : deux zéros ; Δ = 0 : un ; Δ < 0 : aucun."), TR(nb === 1 ? 2 : 1, "Regarde le signe de Δ.")] }); },
    ],
  };

  // ===================== f2 =====================
  const F2 = {
    1: [
      () => { const p = nz(-6, 6), q = nz(-6, 6), a0 = pk([1, -1, 2, -2, 3]); if (p === q) return null;
        return QSet("Détermine les zéros de " + M("f(x) = " + P2([a0, -a0 * (p + q), a0 * p * q])) + ".", [p, q], M("f(x) = " + fx(a0, p, q)) + " : zéros " + M(p) + " et " + M(q) + ".",
          { ctx: "zeros", fig: FIG.parabola((x) => a0 * (x - p) * (x - q) / 3, [], null, false), guide: [GS("Somme des zéros (" + M("-\\frac{b}{a}") + ") ?", p + q, M(p + q) + "."), GSet("Zéros ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes : (x − p) s'annule en p.")] }); },
      () => { const h = nz(-5, 5), k = nz(-6, 6), a = pk([1, -1, 2, -3]);
        return QP("Quel est le sommet de la parabole " + M("f(x) = " + co(a) + "(" + xm(h) + ")^2" + sg(k)) + " ? Réponds « x ; y ».", [h, k], "Forme canonique " + M("a(x - h)^2 + k") + " : sommet " + M("(" + h + " ; " + k + ")") + ".",
          /* 26.11 (revue élèves, f2-1-b9d : après « −3 ; 5 », l'indice général parlait des zéros et du discriminant) : indice
             propre à la forme canonique, et l'erreur des deux signes à la fois. */
          { ctx: "sommet-canon", hint: "Forme canonique a(x − h)² + k : le sommet est (h ; k). Dans (" + xm(h) + ")², h = " + h + " (signe contraire de celui écrit) ; k = " + k + " se lit tel quel.",
            guide: [GS("Abscisse du sommet (" + M("h") + ") ?", h, M(h) + "."), GP("Sommet ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "Dans (x − h)², le sommet a pour abscisse h : (" + xm(h) + ") → " + h + "."), TP([h, -k], "Le + k ou − k se lit tel quel."), TP([-h, -k], "Les deux signes sont inversés : h a le signe contraire de celui écrit dans (" + xm(h) + ")², k garde le sien.")] }); },
      () => { const p = nz(-5, 5), q = nz(-5, 5), a = pk([1, -1, 2, -2]); if (p === q || p * q === 0) return null;
        return QN("Quelle est l'ordonnée à l'origine de la parabole " + M("f(x) = " + fx(a, p, q)) + " ?", a * p * q, M("f(0) = " + co(a) + "(" + -p + ")(" + -q + ") = " + a * p * q) + ".",
          { ctx: "ordonnee", guide: [GS(M("f(0)") + " = ?", a * p * q, M(a * p * q) + ".")], traps: [TR(p * q, "N'oublie pas le coefficient " + a + "."), TR(-a * p * q, "(0 − " + p + ")(0 − " + q + ") = " + p * q + ".")] }); },
    ],
    2: [
      () => { const h = nz(-4, 4), k = R.int(-6, 6), a = pk([1, -1, 2, -2, 3]);
        return QP("Détermine le sommet de la parabole " + M("f(x) = " + P2([a, -2 * a * h, a * h * h + k])) + ". Réponds « x ; y ».", [h, k], M("x_S = -\\frac{b}{2a} = -\\frac{" + -2 * a * h + "}{" + 2 * a + "} = " + h) + " ; " + M("y_S = f(" + h + ") = " + k) + ".",
          { ctx: "sommet-dev", fig: FIG.parabola((x) => (a * (x - h) ** 2 + k) / 3, [], null, false), guide: [GS(M("x_S = -\\frac{b}{2a}") + " ?", h, M(h) + "."), GS(M("y_S = f(x_S)") + " ?", k, M(k) + "."), GP("Sommet ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "x_S = −b ÷ (2a) : attention au signe."), TP([h, a * h * h + k], "y_S = f(" + h + "), pas le terme constant.")] }); },
      () => { let p, q, a; do { a = pk([2, 3, -2]); p = nz(-5, 5); q = nz(-5, 5); } while (p === q);
        return QSet("Résous " + M(P2([a, -a * (p + q), a * p * q]) + " = 0") + ".", [p, q], "On divise par " + M(a) + " : " + M(P2([1, -(p + q), p * q]) + " = 0") + ", soit " + M("(" + xm(p) + ")(" + xm(q) + ") = 0") + " : " + M(p) + " et " + M(q) + ".",
          { ctx: "equation-a", guide: [GX("Après division par " + M(a), P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q])) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")], traps: [TSet([-p, -q], "Attention aux signes.")] }); },
      () => { const h = nz(-4, 4), k = nz(-8, 8), a = pk([1, -1, 2, -2]), up = a > 0;
        return QN("Quelle est la valeur " + (up ? "minimale" : "maximale") + " de " + M("f(x) = " + P2([a, -2 * a * h, a * h * h + k])) + " ?", k, "Sommet en " + M("x = " + h) + " ; " + M("f(" + h + ") = " + k) + " ; la parabole est tournée vers le " + (up ? "haut : c'est un minimum" : "bas : c'est un maximum") + ".",
          { ctx: up ? "min" : "max", guide: [GS("Abscisse du sommet ?", h, M(h) + "."), GS("Valeur " + (up ? "minimale" : "maximale") + " ?", k, M(k) + ".")], traps: [TR(h, "La valeur est une ordonnée : calcule f(" + h + ")."), TR(a * h * h + k, "Ça, c'est f(0) ; le " + (up ? "minimum" : "maximum") + " est au sommet.")] }); },
    ],
    3: [
      () => { const a = pk([-2, 2, 3, -3, -1]), b = nz(-7, 7), c = R.int(-5, 5), xs = -b / (2 * a), ys = a * xs * xs + b * xs + c; if (Number.isInteger(xs)) return null;
        return QP("Détermine le sommet de " + M("f(x) = " + P2([a, b, c])) + ". Réponds « x ; y » (fractions acceptées).", [xs, ys], M("x_S = -\\frac{" + b + "}{" + 2 * a + "} = " + fT(xs)) + " ; " + M("y_S = f(x_S) = " + fT(ys)) + ".",
          { ctx: "sommet-frac", guide: [GS(M("x_S") + " (fraction) ?", xs, M(fT(xs)) + "."), GS(M("y_S") + " (fraction) ?", ys, M(fT(ys)) + "."), GP("Sommet ?", [xs, ys], M("(" + fT(xs) + " ; " + fT(ys) + ")") + ".")], traps: [TP([-xs, ys], "x_S = −b ÷ (2a)."), TP([xs, c], "y_S = f(x_S), pas c.")] }); },
      () => { const b = 2 * nz(-6, 6), c = b * b / 4;
        return QN("Pour quelle valeur de " + M("c") + " la parabole " + M("y = " + P2([1, b, 0]) + " + c") + " touche-t-elle l'axe des " + M("x") + " en un seul point ?", c, "Un seul zéro : " + M("\\Delta = " + b * b + " - 4c = 0") + ", donc " + M("c = " + c) + ".",
          { ctx: "tangent-axe", guide: [GS(M("\\Delta = b^2 - 4c") + " doit valoir… ?", 0, "0 (un seul zéro)."), GS(M("c") + " ?", c, M(b * b + " : 4 = " + c) + ".")], traps: [TR(b * b, "Δ = b² − 4c = 0 donne c = b² ÷ 4."), TR(b / 2, "Ça, c'est le zéro double (au signe près) ; on demande c.")] }); },
      () => { const a = pk([1, 2, -1]), h = nz(-4, 4), d = R.int(1, 4), k = -a * d * d;
        return QSet("Une parabole a pour sommet " + M("S(" + h + " ; " + k + ")") + " et coefficient " + M("a = " + a) + ". Quels sont ses zéros ?", [h - d, h + d], M("f(x) = " + co(a) + "(" + xm(h) + ")^2" + sg(k) + " = 0 \\iff (" + xm(h) + ")^2 = " + d * d) + " : " + M("x = " + h + " \\pm " + d) + ".",
          { ctx: "zeros-sommet", guide: [GS(M("(" + xm(h) + ")^2") + " = ?", d * d, M(d * d) + "."), GSet("Zéros ?", [h - d, h + d], M(h - d) + " et " + M(h + d) + ".")], traps: [TSet([-d, d], "Les zéros sont symétriques autour de " + h + ", pas de 0."), TSet([h + d], "Il y a deux zéros, symétriques par rapport au sommet.")] }); },
    ],
  };

  // ===================== f2formes =====================
  const FF = {
    1: [
      () => { const a = pk([1, 2, -1, -2, 3]), h = nz(-4, 4), k = nz(-6, 6), cs = [a, -2 * a * h, a * h * h + k];
        return QX(DEV + M(co(a) + "(" + xm(h) + ")^2" + sg(k)) + ".", P2(cs), "expanded", M("(" + xm(h) + ")^2 = " + P2([1, -2 * h, h * h])) + ", fois " + M(a) + ", plus " + M(k) + " : " + M(P2(cs)) + ".",
          { ctx: "canon-dev", guide: [GX("Développe " + M("(" + xm(h) + ")^2"), P2([1, -2 * h, h * h]), M(P2([1, -2 * h, h * h])) + "."), GX("Résultat", P2(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -2 * a * h, a * h * h + a * k]), "Le " + k + " est hors de la parenthèse : il n'est pas multiplié par " + a + "."), TX(P2([a, 0, a * h * h + k]), "(x − h)² contient le double produit −2hx.")] }); },
      () => { const h = R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), k = nz(-6, 6); // 24.11 : h ≠ ±1 (robot)
        return QN("Pour " + M("f(x) = (" + xm(h) + ")^2" + sg(k)) + ", que vaut " + M("h") + " dans la forme " + M("(x - h)^2 + k") + " ?", h, M(xm(h) + " = x - " + par(h)) + " : " + M("h = " + h) + ".",
          { ctx: "lire-h", guide: [GS(M("h") + " ?", h, M(h) + ".")], traps: [TR(-h, M(xm(h)) + " = x − (" + h + ")."), TR(k, "Ça, c'est k.")] }); },
      () => { const h = nz(-5, 5), k = nz(-8, 8);
        return QN("On écrit " + M(P2([1, -2 * h, h * h + k])) + " sous la forme " + M("(x - h)^2 + k") + ". Que vaut " + M("k") + " ?", k, M("h = " + h) + " et " + M("(" + xm(h) + ")^2 = " + P2([1, -2 * h, h * h])) + ", donc " + M("k = " + (h * h + k) + " - " + h * h + " = " + k) + ".",
          { ctx: "lire-k", guide: [GS(M("h") + " (moitié du coefficient de x, au signe près) ?", h, M(h) + "."), GS(M("k") + " ?", k, M(k) + ".")], traps: [TR(h * h + k, "Il faut retirer " + h * h + " (le carré de h)."), TR(h * h + k + h * h, "(x − h)² apporte +" + h * h + " : on le soustrait.")] }); },
    ],
    2: [
      () => { const a = pk([1, 2, -1, -2, 3]), p = R.int(-5, 3), q = p + 2 * R.int(1, 3), h = (p + q) / 2, k = -a * ((q - p) / 2) ** 2; if (p === 0 || q === 0) return null;
        return QN("Soit " + M("f(x) = " + fx(a, p, q)) + ". Dans la forme canonique " + M("a(x - h)^2 + k") + ", que vaut " + M("k") + " ?", k, "Le sommet est au milieu des zéros : " + M("h = " + h) + ". " + M("k = f(" + h + ") = " + k) + ".",
          { ctx: "fact-k", guide: [GS(M("h") + " (milieu des zéros) ?", h, M("\\frac{" + p + " + " + par(q) + "}{2} = " + h) + "."), GS(M("k = f(h)") + " ?", k, M(k) + ".")], traps: [TR(a * p * q, "Ça, c'est f(0)."), TR(-k, "Attention aux signes dans f(" + h + ").")] }); },
      () => { const a = pk([1, -1, 2]), p = R.int(-5, 2), q = p + 2 * R.int(1, 3), h = (p + q) / 2, k = -a * ((q - p) / 2) ** 2;
        return QP("Quel est le sommet de " + M("f(x) = " + fx(a, p, q)) + " ? Réponds « x ; y ».", [h, k], "Milieu des zéros : " + M("h = " + h) + " ; " + M("f(" + h + ") = " + k) + ".",
          { ctx: "fact-sommet", guide: [GS(M("h") + " ?", h, M(h) + "."), GP("Sommet ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "Les zéros sont " + p + " et " + q + " (signes inversés dans les parenthèses)."), TP([h, -k], "Calcule f(" + h + ") avec les signes.")] }); },
      () => { const a = pk([2, 3, -2]), h = nz(-4, 4), k = nz(-8, 8), cs = [a, -2 * a * h, a * h * h + k];
        return QN("On écrit " + M(P2(cs)) + " sous la forme " + M(a + "(x - h)^2 + k") + ". Que vaut " + M("k") + " ?", k, M("h = -\\frac{" + cs[1] + "}{" + 2 * a + "} = " + h) + " ; " + M("k = f(" + h + ") = " + k) + ".",
          { ctx: "dev-k-a", guide: [GS(M("h = -\\frac{b}{2a}") + " ?", h, M(h) + "."), GS(M("k = f(h)") + " ?", k, M(k) + ".")], traps: [TR(cs[2] - h * h, "Avec a = " + a + " : k = c − a·h² = " + cs[2] + " − " + a * h * h + "."), TR(cs[2], "Ça, c'est f(0).")] }); },
    ],
    3: [
      () => { const a = pk([2, -1, 3]), p = nz(-5, 5), q = nz(-5, 5), cs = [a, -a * (p + q), a * p * q];
        return QX(DEV + M(fx(a, p, q)) + ".", P2(cs), "expanded", M("(" + xm(p) + ")(" + xm(q) + ") = " + P2([1, -(p + q), p * q])) + ", fois " + M(a) + " : " + M(P2(cs)) + ".",
          { ctx: "fact-dev", guide: [GX("D'abord " + M("(" + xm(p) + ")(" + xm(q) + ")"), P2([1, -(p + q), p * q]), M(P2([1, -(p + q), p * q])) + "."), GX("Fois " + M(a), P2(cs), M(P2(cs)) + ".")], traps: [TX(P2([a, -(p + q), p * q]), "Le coefficient " + a + " multiplie tous les termes."), TX(P2([a, -a * (p + q), -a * p * q]), "(−" + p + ") · (−" + q + ") = " + p * q + ".")] }); },
      () => { const a = pk([1, 2, -1, -2]), h = nz(-4, 4), d = R.int(1, 4), k = -a * d * d;
        return QSet("Quels sont les zéros de " + M("f(x) = " + co(a) + "(" + xm(h) + ")^2" + sg(k)) + " ?", [h - d, h + d], M("(" + xm(h) + ")^2 = " + d * d) + " : " + M(xm(h) + " = \\pm " + d) + ", donc " + M(h - d) + " et " + M(h + d) + ".",
          { ctx: "canon-zeros", guide: [GS(M("(" + xm(h) + ")^2") + " = ?", d * d, M(-k + " : " + par(a) + " = " + d * d) + "."), GSet("Zéros ?", [h - d, h + d], M(h - d) + " et " + M(h + d) + ".")], traps: [TSet([h + d], "Deux solutions : " + xm(h) + " = " + d + " ou −" + d + "."), TSet([-h - d, -h + d], "Attention au signe de h.")] }); },
      () => { const a = pk([2, -2, 3]), h = nz(-4, 4), k = nz(-9, 9), cs = [a, -2 * a * h, a * h * h + k];
        return QP("Écris " + M(P2(cs)) + " sous forme canonique " + M("a(x - h)^2 + k") + " et donne le couple « h ; k ».", [h, k], M(P2(cs) + " = " + a + "(" + xm(h) + ")^2" + sg(k)) + ".",
          { ctx: "canon-couple", guide: [GS(M("h") + " ?", h, M(h) + "."), GS(M("k") + " ?", k, M(k) + "."), GP("Couple ?", [h, k], M("(" + h + " ; " + k + ")") + ".")], traps: [TP([-h, k], "h = −b ÷ (2a)."), TP([h, cs[2] - h * h], "k = f(h) = c − a·h².")] }); },
    ],
  };

  const PROBS = {
    polyop: [() => P("A(x) = (x + 3)² et B(x) = (x − 1)(x + 1).", [["a) Coefficient de x dans A", 6], ["b) Terme constant de A − B", 10], ["c) A(2) − B(2)", 22]], ["(x + 3)² = x² + 6x + 9.", "A − B = 6x + 10."], "a) 6 ; b) " + M("9 - (-1) = 10") + " ; c) " + M("25 - 3 = 22") + ".")],
    factor2: [() => P("f(x) = 2x³ − 18x.", [["a) Coefficient mis en évidence (avec x) : quel nombre ?", 2], ["b) Nombre de facteurs du 1er degré après factorisation complète", 3], ["c) Plus grand zéro", 3]], ["2x(x² − 9).", "x² − 9 = (x − 3)(x + 3)."], "a) 2 (2x en évidence) ; b) " + M("2x(x - 3)(x + 3)") + " : 3 facteurs ; c) 3.")],
    trinfact: [() => P("f(x) = 2x² − 2x − 12.", [["a) Discriminant", 100], ["b) Plus grand zéro", 3], ["c) Plus petit zéro", -2]], ["Δ = 4 + 96.", "x = (2 ± 10) ÷ 4."], "a) 100 ; b) 3 ; c) −2 : " + M("f(x) = 2(x - 3)(x + 2)") + ".")],
    f2: [() => P("f(x) = −x² + 4x + 5.", [["a) Abscisse du sommet", 2], ["b) Valeur maximale", 9], ["c) Plus grand zéro", 5]], ["x_S = −4 ÷ (−2).", "f(x) = −(x − 5)(x + 1)."], "a) 2 ; b) " + M("f(2) = 9") + " ; c) 5.")],
    f2formes: [() => P("f(x) = x² − 8x + 12.", [["a) h de la forme canonique", 4], ["b) k de la forme canonique", -4], ["c) Plus petit zéro", 2]], ["(x − 4)² = x² − 8x + 16.", "(x − 4)² = 4 ⇔ x − 4 = ±2."], "a) 4 ; b) " + M("12 - 16 = -4") + " ; c) 2 (et 6).")],
  };

  // « Trouve l'erreur » (24.11, chantier I) : abscisse du sommet sans le signe moins.
  F2[2].push(() => { const a = R.pick([1, 2, -1, -2]), xs = R.pick([-3, -2, 2, 3, 4]), b = -2 * a * xs, c = R.int(-6, 6), w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    return QN("Pour " + M("f(x) = " + P2([a, b, c])) + ", " + w + " calcule l'abscisse du sommet : « " + M("x_S = \\frac{b}{2a} = \\frac{" + b + "}{" + 2 * a + "} = " + -xs) + " ». Trouve l'erreur, puis donne " + M("x_S") + ".", xs,
      "Erreur : la formule est " + M("x_S = -\\frac{b}{2a}") + ". Ici " + M("x_S = -\\frac{" + b + "}{" + 2 * a + "} = " + xs) + ".",
      { ctx: "erreur", guide: [GS("Formule " + M("x_S = -\\frac{b}{2a}") + " : combien vaut " + M("\\frac{b}{2a}") + " ?", -xs, M(-xs) + "."), GS("Avec le signe moins, " + M("x_S") + " = ?", xs, M(xs) + ".")],
        traps: [TRAP(-xs, "C'est le calcul de " + w + " : il manque le signe moins de la formule.")] }); });
  // ===================== Chantier X (24.11) : f2, lecture sur figure (zéros, sommet, axe de symétrie, forme
  // canonique, coefficient a lus sur la parabole tracée) ; valeurs sur des nœuds du quadrillage.
  const PLf = (fns, pts = [], o = {}) => FIG.plot(fns, pts, Object.assign({ numbers: true, xr: [-6, 6], yr: [-6, 6] }, o));
  const dC = (v) => String(v).replace(".", "{,}");
  const sqE = (s, h, k) => (s === -1 ? "-" : s === 1 ? "" : s + "*") + "(x" + (h < 0 ? "+" + -h : "-" + h) + ")^2" + (k < 0 ? "-" + -k : "+" + k);
  F2[1].push(
    () => { const s = pk([1, -1, 0.5, -0.5]), p = R.int(-5, 3), q = p + R.int(2, 6), vy = -s * (q - p) ** 2 / 4; if (q > 5 || Math.abs(vy) > 6 || !p || !q || p === -q) return null;
      return QSet("La parabole représente une fonction " + M("f") + ". Lis ses zéros sur le graphique.", [p, q], "La parabole coupe l'axe horizontal en " + M("x = " + p) + " et " + M("x = " + q) + " : ce sont les zéros de " + M("f") + ".",
        { ctx: "zeros-lus", fig: PLf([{ f: (x) => s * (x - p) * (x - q) }], [], { yr: [-7, 7] }), guide: [GS("Les zéros sont les abscisses des points où la courbe coupe l'axe HORIZONTAL. Le plus petit ?", p, M(p) + "."), GSet("Les deux zéros ?", [p, q], M(p) + " et " + M(q) + ".")],
          traps: [TSet([-p, -q], "Lis les abscisses avec leur signe : à gauche de l'axe vertical, elles sont négatives."), TSet([s * p * q], "Ça, c'est l'ordonnée à l'origine f(0) (axe vertical). Les zéros se lisent sur l'axe horizontal."), TSet([q], "Il y a deux zéros.")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5, 2, -2]), h = nz(-4, 4), k = nz(-5, 5); if (Math.abs(h) === Math.abs(k) || (s > 0 && k > 3) || (s < 0 && k < -3)) return null;
      return QP("La parabole représente une fonction " + M("f") + ". Lis les coordonnées de son sommet. Réponds « x ; y ».", [h, k], "Le sommet est le point " + (s > 0 ? "le plus bas" : "le plus haut") + " de la parabole : " + M("S(" + h + " ; " + k + ")") + ".",
        { ctx: "sommet-lu", fig: PLf([{ f: (x) => s * (x - h) ** 2 + k }]), guide: [GS("Sommet = point " + (s > 0 ? "le plus bas" : "le plus haut") + ". Son abscisse (axe horizontal) ?", h, M(h) + "."), GP("Son ordonnée, puis le sommet « x ; y » ?", [h, k], M("(" + h + " ; " + k + ")") + ".")],
          traps: [TP([k, h], "Abscisse d'abord (axe horizontal), puis ordonnée."), TP([-h, k], "Le sommet est " + (h < 0 ? "à gauche" : "à droite") + " de l'axe vertical : vérifie le signe de l'abscisse."), TP([h, -k], "Le sommet est " + (k < 0 ? "sous" : "au-dessus de") + " l'axe horizontal.")] }); },
  );
  F2[2].push(
    () => { const s = pk([1, -1]), h = nz(-3, 3), k = s > 0 ? R.int(-5, -1) : R.int(1, 5), e = sqE(s, h, k);
      return QX("La parabole a pour expression " + M("f(x) = (x - h)^2 + k") + " ou " + M("f(x) = -(x - h)^2 + k") + ". Lis son sommet et son orientation, puis écris " + M("f(x)") + ".", e, null, "Sommet lu " + M("S(" + h + " ; " + k + ")") + ", parabole tournée vers le " + (s > 0 ? "haut (signe +)" : "bas (signe −)") + " : " + M("f(x) = " + (s < 0 ? "-" : "") + "(" + xm(h) + ")^2" + sg(k)) + ".",
        { ctx: "canonique-lue", fig: PLf([{ f: (x) => s * (x - h) ** 2 + k }]), guide: [GS("Abscisse du sommet ?", h, M(h) + "."), GS("Ordonnée du sommet ?", k, M(k) + "."), GX("Tournée vers le " + (s > 0 ? "haut" : "bas") + " : " + M("f(x)") + " = ?", e, M("f(x) = " + (s < 0 ? "-" : "") + "(" + xm(h) + ")^2" + sg(k)) + ".")],
          traps: [TX(sqE(s, -h, k), "Dans (x − h)², h est l'abscisse du sommet : sommet en " + h + " donne (" + xm(h) + ")²."), TX(sqE(-s, h, k), "La parabole est tournée vers le " + (s > 0 ? "haut : coefficient positif." : "bas : signe − devant la parenthèse.")), TX(sqE(s, h, -k), "k est l'ordonnée du sommet, avec son signe.")] }); },
    () => { const s = pk([1, -1, 0.5, -0.5]); let p, q; do { p = R.int(-5, 2); q = p + pk([1, 3, 5]); } while (q > 5); const ax = (p + q) / 2, vy = -s * ((q - p) / 2) ** 2; if (Math.abs(vy) > 6.5) return null;
      return QN("Lis les deux zéros de la parabole, puis donne l'abscisse de son axe de symétrie (nombre décimal).", ax, "Zéros lus : " + M(p) + " et " + M(q) + ". L'axe de symétrie passe au milieu : " + M("x = \\frac{" + p + " + " + (q < 0 ? "(" + q + ")" : q) + "}{2} = " + dC(ax)) + ".",
        { ctx: "axe-sym", fig: PLf([{ f: (x) => s * (x - p) * (x - q) }], [], { yr: [-7, 7] }), guide: [GS("Plus petit zéro ?", p, M(p) + "."), GS("Plus grand zéro ?", q, M(q) + "."), GS("Milieu des deux (moyenne) ?", ax, M(dC(ax)) + ".")],
          traps: [TR(p + q, "Divise la somme des zéros par 2 (milieu)."), TR(vy, "Ça, c'est l'ordonnée du sommet ; l'axe de symétrie est vertical, on donne son abscisse."), TR((q - p) / 2, "Le milieu, c'est la moyenne (somme ÷ 2), pas la demi-différence.")] }); },
  );
  F2[3].push(
    () => { const a = pk([2, -2, 3, -3, 0.5, -0.5]), d = Math.abs(a) === 0.5 ? 2 : Math.abs(a) === 3 ? 1 : pk([1, 2]), h = R.int(-3, 2), k = a > 0 ? R.int(-5, -1) : R.int(1, 5), P = [h + d, k + a * d * d]; if (Math.abs(P[1]) > 6 || P[0] > 5) return null;
      return QN("La parabole a pour sommet " + M("S") + " et passe par le point " + M("P") + " (marqués). Elle a pour expression " + M("f(x) = a(x - h)^2 + k") + ". Lis les coordonnées de " + M("S") + " et " + M("P") + ", puis trouve " + M("a") + (Number.isInteger(a) ? "." : " (fraction ou décimal accepté)."), a,
        "Sommet lu " + M("S(" + h + " ; " + k + ")") + ", point " + M("P(" + P[0] + " ; " + P[1] + ")") + ". " + M(P[1] + " = a(" + P[0] + " - " + par(h) + ")^2 + " + par(k)) + ", soit " + M((P[1] - k) + " = " + d * d + "a") + " et " + M("a = " + fT(a)) + ".",
        { ctx: "a-sommet-point", fig: PLf([{ f: (x) => a * (x - h) ** 2 + k }], [[h, k, "S"], [P[0], P[1], "P"]]), guide: [GS("Écart horizontal entre " + M("S") + " et " + M("P") + " ?", d, M(d) + "."), GS("Écart vertical (de " + M("S") + " à " + M("P") + ", négatif si on descend) ?", a * d * d, M(a * d * d) + "."), GS(M("a") + " = écart vertical ÷ (écart horizontal)² ?", a, M(fT(a)) + ".")],
          traps: d > 1 ? [TR(a * d * d, "Il faut diviser par (écart horizontal)² = " + d * d + "."), TR(a * d, "On divise par le CARRÉ de l'écart horizontal : " + d * d + "."), TR(-a, "La parabole est tournée vers le " + (a > 0 ? "haut : a > 0." : "bas : a < 0."))] : [TR(-a, "La parabole est tournée vers le " + (a > 0 ? "haut : a > 0." : "bas : a < 0.")), TR(P[1], "Ça, c'est l'ordonnée de P ; a se calcule avec l'écart à partir du sommet."), TR(1 / a, "a = écart vertical ÷ (écart horizontal)², pas l'inverse.")] }); },
    () => { const a = pk([2, -2, 0.5, -0.5, 1.5, -1.5]); let p, q; do { p = nz(-4, 3); q = nz(-3, 4); } while (p >= q); const f0 = a * p * q, vy = -a * ((q - p) / 2) ** 2; if (!Number.isInteger(f0) || Math.abs(f0) < 2 || Math.abs(f0) > 6 || Math.abs(vy) > 8) return null;
      return QN("La parabole a pour expression " + M("f(x) = a(x - x_1)(x - x_2)") + ". Lis ses zéros " + M("x_1") + ", " + M("x_2") + " et son ordonnée à l'origine (point marqué), puis trouve " + M("a") + (Number.isInteger(a) ? "." : " (fraction ou décimal accepté)."), a,
        "Zéros lus : " + M(p) + " et " + M(q) + " ; " + M("f(0) = " + f0) + ". Or " + M("f(0) = a \\cdot " + par(-p) + " \\cdot " + par(-q) + " = " + p * q + "a") + ", donc " + M("a = \\frac{" + f0 + "}{" + p * q + "} = " + fT(a)) + ".",
        { ctx: "a-zeros-f0", fig: PLf([{ f: (x) => a * (x - p) * (x - q) }], [[0, f0, ""]], { yr: [-8, 8], squash: 0.8 }), guide: [GSet("Zéros lus ?", [p, q], M(p) + " et " + M(q) + "."), GS("Ordonnée à l'origine " + M("f(0)") + " (point marqué) ?", f0, M(f0) + "."), GS(M("f(0) = a \\cdot (0 - x_1)(0 - x_2) = " + p * q + "a") + ". Donc " + M("a") + " = ?", a, M(fT(a)) + ".")],
          traps: [TR(f0, "f(0) n'est pas a : f(0) = a · x₁ · x₂."), TR(-a, "La parabole est tournée vers le " + (a > 0 ? "haut : a > 0." : "bas : a < 0.")), TR(f0 / (p + q), "f(0) = a · x₁ · x₂ : on divise par le PRODUIT des zéros.")] }); },
  );
  // « Trouve l'erreur » (24.11, chantier I, suite) : le signe moins devant un carré ne change que le premier terme.
  PO[2].push(() => { let a, b; do { a = R.int(2, 7); b = R.int(2, 7); } while (a === b); const w = R.pick(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
    const sq = P2([1, -2 * b, b * b]), op = P2([-1, 2 * b, -b * b]), ans = P2([2 * (a + b), a * a - b * b]), faux = P2([2 * (a - b), a * a + b * b]);
    return QX(w + " écrit : « " + M("(x + " + a + ")^2 - (x - " + b + ")^2 = x^2 + " + 2 * a + "x + " + a * a + " - x^2 - " + 2 * b + "x + " + b * b + " = " + faux) + " ». Trouve l'erreur, puis développe et réduis correctement.", ans, "expanded",
      "Erreur : le signe moins s'applique à <b>tout</b> le carré. On développe d'abord " + M("(x - " + b + ")^2 = " + sq) + " entre parenthèses, puis on change tous les signes : " + M("-(" + sq + ") = " + op) + ". Donc " + M("x^2 + " + 2 * a + "x + " + a * a + " - x^2 + " + 2 * b + "x - " + b * b + " = " + ans) + ".",
      { ctx: "erreur", guide: [GX("Développe " + M("(x - " + b + ")^2") + " :", sq, M(sq) + "."), GX("Change tous les signes : " + M("-(x - " + b + ")^2") + " = ?", op, M(op) + "."), GX("Ajoute " + M("(x + " + a + ")^2 = x^2 + " + 2 * a + "x + " + a * a) + " et réduis :", ans, M(ans) + ".")],
        traps: [TX(faux, "C'est le résultat de " + w + " : le moins change le signe des trois termes du carré.")] }); });
  const ALL = { polyop: PO, factor2: FC, trinfact: TF, f2: F2, f2formes: FF };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    polyop: "Chaque terme multiplie chaque terme ; identités (A ± B)² = A² ± 2AB + B², (A + B)(A − B) = A² − B². Un « − » devant une parenthèse change tous les signes.",
    factor2: "Dans l'ordre : mise en évidence, identités (différence de carrés, carré parfait), trinôme (somme-produit), groupements. Recommence tant que c'est possible.",
    trinfact: "Zéros x₁ et x₂ (somme-produit ou discriminant) : ax² + bx + c = a(x − x₁)(x − x₂). Δ < 0 : pas de factorisation.",
    f2: "Zéros : factorise ou discriminant. Sommet : x_S = −b/(2a), y_S = f(x_S). a > 0 : minimum ; a < 0 : maximum.",
    f2formes: "Développée ax² + bx + c ; factorisée a(x − x₁)(x − x₂) ; canonique a(x − h)² + k, sommet (h ; k), h = −b/(2a), k = f(h).",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    polyop: ["Distributivité, identités", "Carrés et produits, degré 3", "Cubes, trois facteurs, x⁴"],
    factor2: ["Mise en évidence, identités", "Trinôme, différence de carrés", "Groupements, coefficients, x⁴"],
    trinfact: ["Somme-produit, zéro double", "Coefficient a, zéros fractionnaires", "Deux fractions, discriminant"],
    f2: ["Zéros, sommet canonique, f(0)", "Sommet par la formule, extremum", "Sommet fractionnaire, paramètre"],
    f2formes: ["Développer, lire h et k", "Factorisée → canonique", "Toutes les conversions"],
  });
})();
