// 22.11 · France, lycée général : notions de 1re et de Tle spécialité (analyse : tools/premiere_terminale_fr.md).
// Notions propres au système FR (CH: null, MP: null : invisibles pour les élèves suisses). Même standard que ch1c_f2b.js :
// 3 niveaux, au moins 3 formes par niveau, pas à pas, erreurs typiques, étiquette ctx, leçon, 3 compétences.
// Usages français appliqués ici : notation u_n, « raison », « évènement », P_A(B), produit noté ×, milliers « 1 200 »,
// euros, angles en radians, intervalles [a ; b[. Pas de dérivation : elle vient du chantier 3e Collège (agent/college34).
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const rnd = (v, k = 10) => +(+v).toFixed(k);
  // Nombre en TeX à la française : virgule décimale, espace fine pour les milliers (1\,200).
  const N = (v) => { v = rnd(v); const s = String(Math.abs(v)).split("."); let i = s[0]; if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return (v < 0 ? "-" : "") + i + (s[1] ? "{,}" + s[1] : ""); };
  const NP = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  // Fraction en TeX si le dénominateur est petit, sinon décimal.
  const F = (v) => { const d = den(v); if (d === 1 || !d || [2, 4, 5, 8, 10, 20, 25, 50, 100].includes(d) && d > 1 && String(rnd(v)).length < 7) return N(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const sg = (v) => (v < 0 ? " - " + N(-v) : " + " + N(v));
  const u = (k) => "u_{" + k + "}";
  const X = " \\times ";
  // polynôme en n (ou x) : a n² + b n + c
  const pol = (cs, v = "n") => { let s = ""; const deg = cs.length - 1; cs.forEach((c, i) => { const p = deg - i; if (!c) return; const a = Math.abs(c), m = p === 0 ? N(a) : (a === 1 ? "" : N(a)) + v + (p > 1 ? "^" + p : ""); s += s ? (c < 0 ? " - " : " + ") + m : (c < 0 ? "-" : "") + m; }); return s || "0"; };
  const polE = (cs, v = "n") => pol(cs, v).replace(/\{,\}/g, ".").replace(/\\,/g, "").replace(/ /g, ""); // saisissable
  // ---------- constructeurs ----------
  const keepT = (spec, traps) => (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr)); } catch (e) { return false; } }
    if (tr.spec && tr.spec.kind === "pair") return tr.spec.values.every(isFinite) && tr.spec.values.some((x, i) => Math.abs(x - spec.values[i]) > 1e-9);
    if (tr.spec) { try { return checkAnswer(spec, SolSet.show(tr.spec.ivs, false)).status !== "correct"; } catch (e) { return false; } }
    if (tr.s) return tr.s.every(isFinite) && !(tr.s.length === spec.values.length && tr.s.every((x) => spec.values.some((y) => Math.abs(x - y) < 1e-9)));
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > Math.max(1e-9, spec.round ? spec.round : 0);
  });
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map((v) => String(rnd(v, 6))).join(" ; ") }, o));
  const GR = (ask, value, sol, round) => ({ ask, spec: { kind: "value", value, round }, sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const TR = TRAP;
  const TX = (e, m) => ({ e, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const ivOf = (op, v) => ({ ">": [v, false, Infinity, false], ">=": [v, true, Infinity, false], "<": [-Infinity, false, v, false], "<=": [-Infinity, false, v, true] }[op]);
  const OPT = { "<": "<", "<=": "\\leqslant", ">": ">", ">=": "\\geqslant" };
  const FLIP = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };

  // ---------- figures ----------
  const svg = (w, h, g, label) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
  const T = (x, y, s, o = {}) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" class="' + (o.cls || "f-txt") + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.fs || 14) + '">' + s + "</text>";
  const Ln = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" class="' + cls + '" stroke-width="' + w + '"/>';
  const dTxt = (v) => String(rnd(v, 6)).replace(".", ",");
  // Nuage des premiers termes d'une suite (registre graphique) : n en abscisse, u_n en ordonnée.
  const figSuite = (terms) => {
    const W = 320, H = 210, x0 = 40, y0 = 180, lo = Math.min(0, ...terms), hi = Math.max(0, ...terms), span = hi - lo || 1;
    const raw = span / 12, mag = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 5, 10].map((k) => k * mag).find((s) => s >= raw), lab = span / step > 8 ? 2 : 1;
    const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step, Y = (v) => y0 - ((v - a) / (b - a)) * 160, Xn = (n) => x0 + 16 + n * ((W - x0 - 30) / Math.max(terms.length - 1, 1));
    let g = "";
    for (let v = a, i = 0; v <= b + 1e-9; v += step, i++) g += Ln(x0, Y(v), W - 8, Y(v), "f-grid", 1) + (Math.round(v / step) % lab === 0 ? T(x0 - 6, Y(v) + 4, dTxt(rnd(v, 6)), { cls: "f-txt f-tick", a: "end", fs: 12 }) : "");
    g += Ln(x0, Y(0), W - 8, Y(0), "f-line", 1.6) + Ln(x0, 12, x0, y0 + 4, "f-line", 1.6);
    terms.forEach((t, n) => (g += T(Xn(n), Math.min(H - 4, Y(a) + 18), n, { cls: "f-txt f-tick", fs: 12 }) + '<circle cx="' + Xn(n).toFixed(1) + '" cy="' + Y(t).toFixed(1) + '" r="4.5" class="f-dot"/>'));
    g += T(W - 10, Math.min(H - 4, Y(a) + 18), "n", { a: "end", fs: 13 }) + T(x0 + 6, 16, "uₙ", { a: "start", fs: 13 });
    return svg(W, H, g, "premiers termes d'une suite");
  };
  // Arbre pondéré à deux niveaux. p = [P(A), P_A(B), P_Ā(B)] ; hide = indices des probabilités à remplacer par « ? ».
  const figTree = (p, A, B, hide = []) => {
    const lab = (i, v) => (hide.includes(i) ? "?" : dTxt(v));
    const R0 = [20, 110], A1 = [130, 55], A2 = [130, 165], L = [[290, 25], [290, 85], [290, 135], [290, 195]];
    let g = Ln(R0[0], R0[1], A1[0] - 14, A1[1]) + Ln(R0[0], R0[1], A2[0] - 14, A2[1]);
    g += T(A1[0], A1[1] + 5, A, { fs: 16 }) + T(A2[0], A2[1] + 5, A + "̅", { fs: 16 });
    g += T(70, 70, lab(0, p[0]), { cls: "f-accent f-txt", fs: 13 }) + T(70, 160, lab(3, 1 - p[0]), { cls: "f-accent f-txt", fs: 13 });
    const kids = [[A1, L[0], B, lab(1, p[1])], [A1, L[1], B + "̅", lab(4, 1 - p[1])], [A2, L[2], B, lab(2, p[2])], [A2, L[3], B + "̅", lab(5, 1 - p[2])]];
    kids.forEach(([s, e, nm, l], i) => { g += Ln(s[0] + 14, s[1], e[0] - 14, e[1]) + T(e[0], e[1] + 5, nm, { fs: 16 }) + T((s[0] + e[0]) / 2, (s[1] + e[1]) / 2 + (i % 2 ? 16 : -6), l, { cls: "f-accent f-txt", fs: 13 }); });
    return svg(320, 215, g, "arbre pondéré");
  };
  // Projeté orthogonal : A, B sur une droite horizontale, C au-dessus, H pied de la hauteur issue de C.
  const figProj = (ab, ah, sameSide) => {
    const s = 220 / Math.max(ab, Math.abs(ah) + (sameSide ? 0 : ab)), Ax = sameSide ? 40 : 40 + Math.abs(ah) * s, A = [Ax, 160], B = [Ax + ab * s, 160], H = [Ax + (sameSide ? 1 : -1) * Math.abs(ah) * s, 160], Cc = [H[0], 50];
    let g = Ln(Math.min(H[0], A[0]) - 10, 160, B[0] + 10, 160, "f-grid", 1.4) + '<polygon points="' + [A, B, Cc].map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ") + '" class="f-shape"/>';
    g += Ln(Cc[0], Cc[1], H[0], H[1], "f-line", 1.4).replace("/>", ' stroke-dasharray="5 4"/>') + '<path d="M' + (H[0] + 9) + ",160 L" + (H[0] + 9) + ",151 L" + H[0] + ',151" fill="none" class="f-line" stroke-width="1.2"/>';
    g += T(A[0] - 4, 180, "A") + T(B[0] + 4, 180, "B") + T(Cc[0], Cc[1] - 8, "C") + T(H[0], 180, "H");
    return svg(320, 190, g, "projeté orthogonal");
  };
  const tab = (xs, ps, hx = "x_i", hp = "P(X = x_i)") => M("\\begin{array}{|c|" + "c|".repeat(xs.length) + "} \\hline " + hx + " & " + xs.map((x) => (typeof x === "string" ? x : N(x))).join(" & ") + " \\\\ \\hline " + hp + " & " + ps.map((x) => (typeof x === "string" ? x : N(x))).join(" & ") + " \\\\ \\hline \\end{array}");
  const code = (lines) => '<code style="display:block;white-space:pre;font-size:15px;margin:6px 0;line-height:1.5">' + lines.join("\n") + "</code>";

  // ===================== suitedef =====================
  const SD = {
    1: [
      () => { const a = pk([1, 2, 3, -1, -2]), b = nz(-6, 6), c = nz(-9, 9), k = R.int(3, 9), v = a * k * k + b * k + c;
        return QN("La suite " + M("(u_n)") + " est définie pour tout entier naturel " + M("n") + " par " + M("u_n = " + pol([a, b, c])) + ". Calcule " + M(u(k)) + ".", v,
          "On remplace " + M("n") + " par " + M(k) + " : " + M(u(k) + " = " + (a === 1 ? "" : a === -1 ? "-" : N(a) + X) + k + "^2" + (b < 0 ? " - " + N(-b) + X : " + " + N(b) + X) + k + sg(c) + " = " + N(v)) + ".",
          { ctx: "explicite", guide: [GS(M(k + "^2") + " = ?", k * k, M(k * k) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a * 2 * k + b * k + c, M(k + "^2") + " vaut " + M(k + X + k) + ", pas " + M("2" + X + k) + "."), TR(a * (k + 1) ** 2 + b * (k + 1) + c, "On remplace n par " + k + " (pas par " + (k + 1) + ")."), TR(a * k * k - b * k + c, "Attention au signe du terme en n.")] }); },
      () => { const p = pk([2, 3, -2]), q = nz(-5, 5), a = nz(-3, 5), u1 = p * a + q, u2 = p * u1 + q, u3 = p * u2 + q; if (Math.abs(u3) > 300) return null;
        return QN("On définit " + M("u_0 = " + N(a)) + " et, pour tout entier naturel " + M("n") + ", " + M("u_{n+1} = " + N(p) + "u_n" + sg(q)) + ". Calcule " + M("u_3") + ".", u3,
          M("u_1 = " + N(p) + X + NP(a) + sg(q) + " = " + N(u1)) + ", " + M("u_2 = " + N(p) + X + NP(u1) + sg(q) + " = " + N(u2)) + ", " + M("u_3 = " + N(p) + X + NP(u2) + sg(q) + " = " + N(u3)) + ".",
          { ctx: "recurrence", guide: [GS(M("u_1") + " = ?", u1, M(N(u1)) + "."), GS(M("u_2") + " = ?", u2, M(N(u2)) + "."), GS(M("u_3") + " = ?", u3, M(N(u3)) + ".")],
            traps: [TR(u2, "C'est " + M("u_2") + " : de " + M("u_0") + " à " + M("u_3") + ", il faut trois étapes."), TR(p ** 3 * a + q, "On ajoute " + q + " à chaque étape, pas seulement à la fin."), TR(p * u1 + q * 2, "Applique la relation exactement : " + M(N(p) + "u_n" + sg(q)) + ".")] }); },
      () => { const a = nz(-5, 6), b = nz(-7, 7), c = R.int(1, 4), k = R.int(2, 8), v = (a * k + b) / (k + c); if (Number.isInteger(v) || a * k + b === 0) return null;
        return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = \\frac{" + pol([a, b]) + "}{n + " + c + "}") + ". Calcule " + M(u(k)) + " (fraction acceptée).", v,
          M(u(k) + " = \\frac{" + N(a) + X + k + sg(b) + "}{" + k + " + " + c + "} = \\frac{" + N(a * k + b) + "}{" + (k + c) + "}" + (den(v) !== k + c ? " = " + F(v) : "")) + ".",
          { ctx: "explicite-quotient", guide: [GS("Numérateur ?", a * k + b, M(N(a * k + b)) + "."), GS("Dénominateur ?", k + c, M(k + c) + "."), GS(M(u(k)) + " = ?", v, M(F(v)) + ".")],
            traps: [TR(a * k + b / (k + c), "Tout le numérateur est divisé par " + (k + c) + "."), TR((a * k + b) / k + c, "Le dénominateur est " + M("n + " + c) + " en entier."), TR((a * (k + 1) + b) / (k + 1 + c), "On remplace n par " + k + ".")] }); },
      () => { const c = nz(-20, 20), k = R.int(5, 9), v = 2 ** k + c;
        return QN("On pose " + M("u_n = 2^n" + sg(c)) + " pour tout entier naturel " + M("n") + ". Calcule " + M(u(k)) + ".", v, M(u(k) + " = 2^{" + k + "}" + sg(c) + " = " + 2 ** k + sg(c) + " = " + N(v)) + ".",
          { ctx: "puissance", guide: [GS(M("2^{" + k + "}") + " = ?", 2 ** k, M(2 ** k) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(2 * k + c, M("2^{" + k + "}") + " est un produit de " + k + " facteurs 2, pas " + M("2" + X + k) + "."), TR(2 ** (k - 1) + c, M("2^{" + k + "}") + " : " + k + " facteurs.")] }); },
    ],
    2: [
      () => { const a = nz(-4, 8), b = nz(-3, 4); let t = a; const us = [a]; for (let n = 0; n < 4; n++) { t = t + 2 * n + b; us.push(t); }
        return QN("On définit " + M("u_0 = " + N(a)) + " et " + M("u_{n+1} = u_n + 2n" + sg(b)) + " pour tout entier naturel " + M("n") + ". Calcule " + M("u_4") + ".", us[4],
          "Le terme ajouté change à chaque étape : " + M("u_1 = " + N(a) + " + 0" + sg(b) + " = " + N(us[1])) + ", " + M("u_2 = " + N(us[1]) + " + 2" + sg(b) + " = " + N(us[2])) + ", " + M("u_3 = " + N(us[3])) + ", " + M("u_4 = " + N(us[3]) + " + 6" + sg(b) + " = " + N(us[4])) + ".",
          { ctx: "recurrence-n", guide: [GS(M("u_1") + " (avec " + M("n = 0") + ") ?", us[1], M(N(us[1])) + "."), GS(M("u_2") + " (avec " + M("n = 1") + ") ?", us[2], M(N(us[2])) + "."), GS(M("u_3") + " ?", us[3], M(N(us[3])) + "."), GS(M("u_4") + " ?", us[4], M(N(us[4])) + ".")],
            traps: [TR(a + 4 * b, "Le terme " + M("2n") + " change à chaque étape (n = 0, 1, 2, 3)."), TR(us[3], "C'est " + M("u_3") + " : encore une étape."), TR(a + 4 * (8 + b), "Avec n = 4 à chaque fois ? Non : n vaut 0, puis 1, 2, 3.")] }); },
      () => { const b = nz(-9, 9), c = nz(-9, 9), e = "2n" + (1 + b === 0 ? "" : (1 + b > 0 ? "+" : "") + (1 + b));
        return QX("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + pol([1, b, c])) + ". Exprime " + M("u_{n+1} - u_n") + " en fonction de " + M("n") + ".", e,
          M("u_{n+1} = (n + 1)^2" + (b < 0 ? " - " + -b : " + " + b) + "(n + 1)" + sg(c) + " = " + pol([1, 2 + b, 1 + b + c])) + " ; " + M("u_{n+1} - u_n = " + pol([2, 1 + b])) + ".",
          { ctx: "difference", guide: [GX(M("u_{n+1}") + " développé et réduit ?", polE([1, 2 + b, 1 + b + c]), M(pol([1, 2 + b, 1 + b + c])) + "."), GX(M("u_{n+1} - u_n") + " = ?", e, M(pol([2, 1 + b])) + ".")],
            traps: [TX("2n+" + b, M("(n + 1)^2 = n^2 + 2n + 1") + " : n'oublie pas le 1."), TX("1+" + b, M("(n + 1)^2 \\ne n^2 + 1") + "."), TX("2n+1", "Le terme " + M(N(b) + "n") + " donne aussi " + M(N(b)) + " dans la différence.")] }); },
      () => { const ctxs = [["Une association compte", "adhérents", "ne renouvellent pas leur adhésion", "nouveaux adhérents s'inscrivent", "asso", "d'adhérents"], ["Un parc naturel abrite", "cerfs", "quittent le parc ou meurent", "cerfs y sont réintroduits", "cerfs", "de cerfs"], ["Une médiathèque compte", "abonnés", "résilient leur abonnement", "nouveaux abonnés s'inscrivent", "mediatheque", "d'abonnés"]], c = pk(ctxs);
        const u0 = pk([400, 600, 800, 1000, 1200, 2000]), p = pk([10, 15, 20, 25, 30]), add = pk([60, 90, 120, 150, 200]), q = 1 - p / 100, u1 = rnd(q * u0 + add), u2 = rnd(q * u1 + add); if (!Number.isInteger(u2)) return null;
        return QN(c[0] + " " + M(N(u0)) + " " + c[1] + " cette année. Chaque année, " + M(p + "\\,\\%") + " d'entre eux " + c[2] + " et " + M(add) + " " + c[3] + ". On note " + M("u_n") + " le nombre " + c[5] + " dans " + M("n") + " ans, donc " + M("u_{n+1} = " + N(q) + "u_n + " + add) + ". Calcule " + M("u_2") + ".", u2,
          M("u_1 = " + N(q) + X + N(u0) + " + " + add + " = " + N(u1)) + " puis " + M("u_2 = " + N(q) + X + N(u1) + " + " + add + " = " + N(u2)) + ".",
          { ctx: c[4], guide: [GS("Coefficient multiplicateur pour une baisse de " + M(p + "\\,\\%") + " ?", q, M("1 - " + N(p / 100) + " = " + N(q)) + "."), GS(M("u_1") + " = ?", u1, M(N(u1)) + "."), GS(M("u_2") + " = ?", u2, M(N(u2)) + ".")],
            traps: [TR(u1, "C'est " + M("u_1") + " : il faut deux années."), TR(rnd((p / 100) * u1 + add), "On garde " + (100 - p) + " % des " + c[1] + " : on multiplie par " + N(q).replace("{,}", ",") + "."), TR(rnd(q * q * u0 + add), "Les " + add + " " + c[1] + " arrivent chaque année.")] }); },
      () => { const c = pk([["allumettes", "carrés alignés", "d'allumettes"], ["jetons", "motifs en L", "de jetons"], ["cubes", "escaliers en tranche", "de cubes"]]), a = R.int(3, 9), r = R.int(2, 7), k = R.int(15, 45), v = a + (k - 1) * r;
        return QN("On construit des " + c[1] + ". Le motif n° 1 utilise " + M(a) + " " + c[0] + ", le n° 2 en utilise " + M(a + r) + ", le n° 3 en utilise " + M(a + 2 * r) + ", et l'on continue de la même façon. Combien " + c[2] + " pour le motif n° " + M(k) + " ?", v,
          "On ajoute " + M(r) + " à chaque motif. Du n° 1 au n° " + k + ", on l'ajoute " + M(k - 1) + " fois : " + M(N(a) + " + " + (k - 1) + X + r + " = " + N(v)) + ".",
          { ctx: "motif", guide: [GS("Combien en ajoute-t-on d'un motif au suivant ?", r, M(r) + "."), GS("Combien de fois l'ajoute-t-on du motif n° 1 au motif n° " + k + " ?", k - 1, M(k - 1) + "."), GS("Nombre " + c[2] + " ?", v, M(N(v)) + ".")],
            traps: [TR(a + k * r, "Du motif n° 1 au n° " + k + ", il y a " + (k - 1) + " ajouts, pas " + k + "."), TR(a * k, "On ne multiplie pas le premier motif : on ajoute " + r + " à chaque fois."), TR(r * k, "Le premier motif n'a pas " + r + " " + c[0] + " mais " + a + ".")] }); },
    ],
    3: [
      () => { const a = pk([20, 30, 40, 50, 60]), cc = pk([5, 10, 15]), S = pk([500, 800, 1000, 2000]); let t = a, n = 0; while (t < S) { t = 2 * t - cc; n++; }
        if (n < 3 || n > 10) return null;
        return QN("Que vaut " + M("n") + " à la fin de ce programme Python ?" + code(["u = " + a, "n = 0", "while u < " + S + ":", "    u = 2*u - " + cc, "    n = n + 1"]), n,
          "Valeurs successives de u : " + M([a].concat(Array.from({ length: n }, (_, i) => { let w = a; for (let j = 0; j <= i; j++) w = 2 * w - cc; return w; })).map(N).join(" ; ")) + ". La boucle s'arrête dès que " + M("u \\geqslant " + N(S)) + " : " + M("n = " + n) + ".",
          { ctx: "algo-seuil", guide: [GS("Valeur de u après le premier passage dans la boucle ?", 2 * a - cc, M("2" + X + a + " - " + cc + " = " + (2 * a - cc)) + "."), GS("Valeur finale de n ?", n, M(n) + ".")],
            traps: [TR(n - 1, "La boucle tourne encore une fois tant que " + M("u < " + N(S)) + "."), TR(n + 1, "On s'arrête dès que u dépasse " + S + " : compte les passages.")] }); },
      () => { const b = R.int(5, 16), c = nz(-9, 9), n0 = Math.floor((b - 1) / 2) + 1, e = "2n" + (1 - b < 0 ? "-" + (b - 1) : "+" + (1 - b));
        return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = n^2 - " + b + "n" + sg(c)) + ". À partir de quel rang " + M("n") + " a-t-on " + M("u_{n+1} > u_n") + " ? (donne le plus petit entier)", n0,
          M("u_{n+1} - u_n = (n + 1)^2 - " + b + "(n + 1) - n^2 + " + b + "n = " + pol([2, 1 - b])) + ". Il est strictement positif dès que " + M("n > " + F((b - 1) / 2)) + ", soit à partir de " + M("n = " + n0) + " : la suite est croissante à partir de ce rang.",
          { ctx: "sens-variation", guide: [GS(M("u_{n+1} - u_n = 2n + c") + ". Que vaut la constante " + M("c") + " ?", 1 - b, M("u_{n+1} - u_n = " + pol([2, 1 - b])) + "."), GS("Plus petit entier " + M("n") + " qui rend cette différence strictement positive ?", n0, M(n0) + ".")],
            traps: [TR(n0 - 1, "Pour n = " + (n0 - 1) + ", la différence vaut " + (2 * (n0 - 1) + 1 - b) + " : pas strictement positive."), TR(Math.ceil(b / 2), "Calcule bien u_{n+1} − u_n = 2n + 1 − " + b + "."), TR(b, "Ce n'est pas le coefficient : résous 2n + 1 − " + b + " > 0.")] }); },
      () => { let a, c, b, d; do { a = nz(-6, 9); c = R.int(2, 5); b = nz(-9, 9); d = R.int(1, 9); } while (Math.abs(a) < 2 || a % c === 0 && Math.abs(a / c) < 2); const lim = a / c, v1000 = (1000 * a + b) / (1000 * c + d);
        return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = \\frac{" + pol([a, b]) + "}{" + pol([c, d]) + "}") + ". Calcule " + M("u_{1\\,000}") + " à la calculatrice, puis conjecture la limite de " + M("(u_n)") + " (valeur exacte).", lim,
          M("u_{1\\,000} \\approx " + N(rnd(v1000, 4))) + ". Pour " + M("n") + " très grand, " + M(N(b)) + " et " + M(N(d)) + " deviennent négligeables : " + M("u_n \\approx \\frac{" + N(a) + "n}{" + c + "n} = " + F(lim)) + ". On conjecture que " + M("(u_n)") + " tend vers " + M(F(lim)) + ".",
          { ctx: "conjecture-limite", shownOk: true, guide: [GR(M("u_{1\\,000}") + " arrondi au millième ?", rnd(v1000, 6), M("\\approx " + N(rnd(v1000, 3))) + ".", 0.001), GS("Limite conjecturée (valeur exacte) ?", lim, M(F(lim)) + ".")],
            traps: [TR(b / d, "Pour n très grand, ce sont les termes en n qui l'emportent."), TR(a, "Le dénominateur aussi grandit : " + c + "n."), TR(rnd(v1000, 3), "On demande la limite exacte : " + F(lim).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2") + ".")] }); },
      () => { const cc = nz(-8, 12), a = nz(-6, 6), lim = 2 * cc; if (a === lim) return null; const us = [a]; for (let i = 0; i < 3; i++) us.push(rnd(0.5 * us[i] + cc));
        return QN("On définit " + M("u_0 = " + N(a)) + " et " + M("u_{n+1} = 0{,}5\\,u_n" + sg(cc)) + ". Calcule quelques termes (tableur, calculatrice) et conjecture la limite de la suite.", lim,
          M("u_1 = " + N(us[1]) + ", \\; u_2 = " + N(us[2]) + ", \\; u_3 = " + N(us[3])) + "… Les termes se rapprochent du nombre " + M("\\ell") + " tel que " + M("\\ell = 0{,}5\\,\\ell" + sg(cc)) + ", soit " + M("\\ell = " + N(lim)) + ".",
          { ctx: "point-fixe", guide: [GS(M("u_1") + " = ?", us[1], M(N(us[1])) + "."), GS("Si la suite se stabilise vers " + M("\\ell") + ", alors " + M("\\ell = 0{,}5\\,\\ell" + sg(cc)) + ". " + M("\\ell") + " = ?", lim, M(N(lim)) + ".")],
            traps: [TR(cc, "Résous ℓ = 0,5 ℓ " + (cc < 0 ? "− " + -cc : "+ " + cc) + " : 0,5 ℓ = " + cc + "."), TR(0, "Les termes ne tendent pas vers 0 : on ajoute " + cc + " à chaque étape."), TR(a, "Le premier terme ne compte pas pour la limite.")] }); },
    ],
  };

  // ===================== suitearith =====================
  const SA = {
    1: [
      () => { const a = nz(-20, 30), r = nz(-7, 9), n = R.int(10, 40), v = a + n * r;
        return QN(M("(u_n)") + " est la suite arithmétique de premier terme " + M("u_0 = " + N(a)) + " et de raison " + M("r = " + N(r)) + ". Calcule " + M(u(n)) + ".", v, M(u(n) + " = u_0 + " + n + "r = " + N(a) + " + " + n + X + NP(r) + " = " + N(v)) + ".",
          { ctx: "u0-r", guide: [GS(M(n + X + NP(r)) + " = ?", n * r, M(N(n * r)) + "."), GS(M(u(n)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a + (n - 1) * r, "En partant de " + M("u_0") + ", on ajoute la raison " + n + " fois."), TR(a * r ** 1 * n, "On ajoute la raison, on ne multiplie pas le premier terme."), TR(a + r, "Il faut ajouter la raison " + n + " fois.")] }); },
      () => { const a = nz(-15, 30), r = nz(-6, 8), k = R.int(12, 50), v = a + (k - 1) * r;
        return QN("Une suite arithmétique " + M("(u_n)") + " a pour premier terme " + M("u_1 = " + N(a)) + " et pour raison " + M(N(r)) + ". Calcule " + M(u(k)) + ".", v, M(u(k) + " = u_1 + (" + k + " - 1)r = " + N(a) + " + " + (k - 1) + X + NP(r) + " = " + N(v)) + ".",
          { ctx: "u1-r", guide: [GS("Combien de fois ajoute-t-on la raison de " + M("u_1") + " à " + M(u(k)) + " ?", k - 1, M(k - 1) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a + k * r, "La suite commence à " + M("u_1") + " : de " + M("u_1") + " à " + M(u(k)) + ", " + (k - 1) + " ajouts."), TR(a + (k + 1) * r, "Compte les ajouts : " + (k - 1) + ".")] }); },
      () => { const p = R.int(2, 9), q = p + R.int(3, 9), r = nz(-8, 9), up = nz(-30, 40), uq = up + (q - p) * r;
        return QN("Une suite arithmétique vérifie " + M(u(p) + " = " + N(up)) + " et " + M(u(q) + " = " + N(uq)) + ". Quelle est sa raison ?", r,
          "De " + M(u(p)) + " à " + M(u(q)) + ", on ajoute " + M(q - p) + " fois la raison : " + M("r = \\frac{" + N(uq) + " - " + NP(up) + "}{" + (q - p) + "} = " + N(r)) + ".",
          { ctx: "deux-termes", guide: [GS(M(u(q) + " - " + u(p)) + " = ?", uq - up, M(N(uq - up)) + "."), GS("Raison " + M("r") + " ?", r, M("\\frac{" + N(uq - up) + "}{" + (q - p) + "} = " + N(r)) + ".")],
            traps: [TR(uq - up, "Cet écart contient " + (q - p) + " fois la raison : divise par " + (q - p) + "."), TR((uq - up) / (q - p + 1), "Entre les rangs " + p + " et " + q + ", il y a " + (q - p) + " pas."), TR((uq + up) / (q - p), "C'est la différence des termes, pas leur somme.")] }); },
    ],
    2: [
      () => { const p = R.int(3, 8), q = p + R.int(3, 7), r = nz(-7, 8), a = nz(-25, 25), up = a + p * r, uq = a + q * r;
        return QN("Une suite arithmétique vérifie " + M(u(p) + " = " + N(up)) + " et " + M(u(q) + " = " + N(uq)) + ". Calcule " + M("u_0") + ".", a,
          M("r = \\frac{" + N(uq) + " - " + NP(up) + "}{" + (q - p) + "} = " + N(r)) + ", puis " + M("u_0 = " + u(p) + " - " + p + "r = " + N(up) + " - " + p + X + NP(r) + " = " + N(a)) + ".",
          { ctx: "u0-deux-termes", guide: [GS("Raison " + M("r") + " ?", r, M(N(r)) + "."), GS(M("u_0") + " = ?", a, M(N(up) + " - " + p + X + NP(r) + " = " + N(a)) + ".")],
            traps: [TR(up + p * r, "Pour revenir en arrière, on retire la raison."), TR(up - (p - 1) * r, "De " + M("u_0") + " à " + M(u(p)) + " : " + p + " pas."), TR(up - r, "Il faut reculer de " + p + " rangs.")] }); },
      () => { const a = nz(-20, 30), r = nz(-6, 9), n = R.int(12, 60), t = a + n * r;
        return QN("La suite arithmétique " + M("(u_n)") + " a pour premier terme " + M("u_0 = " + N(a)) + " et pour raison " + M(N(r)) + ". Pour quel entier " + M("n") + " a-t-on " + M("u_n = " + N(t)) + " ?", n,
          M(pol([r, a]) + " = " + N(t)) + " donne " + M(pol([r, 0]) + " = " + N(t - a)) + ", donc " + M("n = " + n) + ".",
          { ctx: "rang", guide: [GS(M("u_n - u_0") + " = ?", t - a, M(N(t - a)) + "."), GS(M("n") + " = ?", n, M("\\frac{" + N(t - a) + "}{" + N(r) + "} = " + n) + ".")],
            traps: [TR(n + 1, "Le premier terme est " + M("u_0") + " : le rang est " + n + "."), TR(t / r, "Retire d'abord " + M("u_0") + " avant de diviser par la raison."), TR(n - 1, "Vérifie : " + M("u_0 + nr") + ".")] }); },
      () => { const a = nz(-12, 20), r = nz(-7, 9), base = pk(["u0", "u1"]), e = base === "u0" ? r + "n" + (a < 0 ? a : "+" + a) : r + "n" + (a - r < 0 ? a - r : "+" + (a - r)), cs = base === "u0" ? [r, a] : [r, a - r];
        if (a - r === 0 && base === "u1") return null;
        return QX("Une suite arithmétique a pour " + (base === "u0" ? "premier terme " + M("u_0 = " + N(a)) : "premier terme " + M("u_1 = " + N(a))) + " et pour raison " + M(N(r)) + ". Exprime " + M("u_n") + " en fonction de " + M("n") + ".", e,
          (base === "u0" ? M("u_n = u_0 + nr = " + pol(cs)) : M("u_n = u_1 + (n - 1)r = " + N(a) + " + " + NP(r) + "(n - 1) = " + pol(cs))) + ". C'est une fonction affine de " + M("n") + " : les points " + M("(n \\,;\\, u_n)") + " sont alignés.",
          { ctx: "formule-" + base, guide: [GX("Expression de " + M("u_n") + " ?", e, M(pol(cs)) + ".")],
            traps: [TX(r + "n" + (a < 0 ? a : "+" + a), "La suite commence à " + M("u_1") + " : " + M("u_n = u_1 + (n - 1)r") + "."), TX(a + "n+" + r, "La raison multiplie n ; le premier terme est la constante."), TX(r + "(n+1)" + (a < 0 ? a : "+" + a), "De " + M("u_0") + " à " + M("u_n") + ", n pas.")] }); },
      () => { const c = pk([["Léo a", "€ sur son livret et y ajoute", "€ chaque mois", "mois", "livret"], ["Une plante mesure", "cm et grandit de", "cm chaque semaine", "semaines", "plante"], ["Un club compte", "membres et en gagne", "de plus chaque année", "ans", "club"]]);
        const a = pk([120, 180, 240, 75, 300]), r = pk([12, 15, 25, 35, 40]), n = R.int(9, 30), v = a + n * r;
        return QN(c[0] + " " + M(a) + " " + c[1] + " " + M(r) + " " + c[2] + ". On note " + M("u_n") + " la valeur après " + M("n") + " " + c[3] + " (" + M("u_0 = " + a) + "). Calcule " + M(u(n)) + ".", v,
          "Accroissement constant : suite arithmétique de raison " + M(r) + ". " + M(u(n) + " = " + a + " + " + n + X + r + " = " + N(v)) + ".",
          { ctx: c[4], guide: [GS("Raison de la suite ?", r, M(r) + "."), GS(M(u(n)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a + (n - 1) * r, "Après " + n + " " + c[3] + ", on a ajouté " + n + " fois " + r + "."), TR(a * n, "C'est la raison qui est ajoutée " + n + " fois."), TR(n * r, "N'oublie pas la valeur de départ " + a + ".")] }); },
    ],
    3: [
      () => { const c = pk([["Le stock d'un entrepôt est de", "cartons ; on en expédie", "chaque jour", "jours", "stock", "cartons"], ["Une citerne contient", "litres ; on en prélève", "chaque semaine", "semaines", "citerne", "litres"], ["Un forfait de", "minutes diminue de", "minutes par jour", "jours", "forfait", "minutes"]]);
        const S = pk([1500, 2400, 3000, 4500, 1800]), d = pk([45, 65, 70, 85, 110, 130]), T = pk([200, 300, 500, 250]), n = Math.floor((S - T) / d) + 1;
        return QN(c[0] + " " + M(N(S)) + " " + c[1] + " " + M(d) + " " + c[2] + ". Au bout de combien de " + c[3] + " restera-t-il pour la première fois moins de " + M(T) + " " + c[5] + " ?", n,
          M("u_n = " + N(S) + " - " + d + "n") + ". " + M(N(S) + " - " + d + "n < " + T + " \\iff n > \\frac{" + N(S - T) + "}{" + d + "} \\approx " + N(rnd((S - T) / d, 2))) + " : la première fois pour " + M("n = " + n) + ".",
          { ctx: c[4], guide: [GS("Inéquation " + M(N(S) + " - " + d + "n < " + T) + " : " + M("n >") + " ? (fraction ou valeur approchée)", (S - T) / d, M("\\frac{" + N(S - T) + "}{" + d + "}") + "."), GS("Plus petit entier " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(Math.floor((S - T) / d), "Il faut le premier entier strictement supérieur à " + N(rnd((S - T) / d, 2)).replace("{,}", ",") + "."), TR(Math.ceil(S / d), "On s'arrête quand il reste moins de " + T + ", pas quand tout est parti.")] }); },
      () => { const a = pk([30, 40, 45, 50]), p = pk([1.5, 2, 2.5, 3]), b = a - pk([10, 15, 20, 25]), q = p + pk([0.5, 1, 1.5]), t = (a - b) / (q - p), n = Number.isInteger(t) ? t + 1 : Math.ceil(t); if (n < 4) return null;
        return QN("Pour louer un local, le forfait A coûte " + M(a + " \\text{ €}") + " plus " + M(N(p) + " \\text{ €}") + " par heure ; le forfait B coûte " + M(b + " \\text{ €}") + " plus " + M(N(q) + " \\text{ €}") + " par heure. À partir de combien d'heures (nombre entier) le forfait A est-il strictement moins cher ?", n,
          M(a + " + " + N(p) + "n < " + b + " + " + N(q) + "n \\iff " + N(q - p) + "n > " + (a - b) + " \\iff n > " + N(rnd(t, 3))) + " : à partir de " + M(n) + " heures.",
          { ctx: "forfaits", guide: [GS("Écart des parts fixes " + M(a + " - " + b) + " ?", a - b, M(a - b) + "."), GS("Écart des prix horaires ?", q - p, M(N(q - p)) + "."), GS("Plus petit entier " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, Number.isInteger(t) ? "Pour " + t + " heures, les deux forfaits coûtent autant : il faut strictement moins cher." : "Prends l'entier juste au-dessus de " + N(rnd(t, 2)).replace("{,}", ",") + "."), TR(Math.round((a - b) / q), "Divise par la différence des prix horaires.")] }); },
      () => { const a = nz(-15, 20), r = nz(-6, 7), s = 2 * a + 9 * r, t = a + 3 * r;
        return QN("Une suite arithmétique " + M("(u_n)") + " vérifie " + M("u_3 = " + N(t)) + " et " + M("u_2 + u_7 = " + N(s)) + ". Calcule " + M("u_0") + ".", a,
          M("u_2 + u_7 = 2u_0 + 9r") + " et " + M("u_3 = u_0 + 3r") + ", donc " + M("u_2 + u_7 - 2u_3 = 3r = " + N(s - 2 * t)) + ", " + M("r = " + N(r)) + " et " + M("u_0 = " + N(t) + " - 3" + X + NP(r) + " = " + N(a)) + ".",
          { ctx: "systeme", guide: [GS("En écrivant tout avec " + M("u_0") + " et " + M("r") + " : " + M("u_2 + u_7 - 2u_3 = 3r") + ". " + M("r") + " = ?", r, M("\\frac{" + N(s) + " - 2" + X + NP(t) + "}{3} = " + N(r)) + "."), GS(M("u_0") + " = ?", a, M(N(a)) + ".")],
            traps: [TR(t - 3 * r + r, "De " + M("u_0") + " à " + M("u_3") + ", 3 pas : " + M("u_0 = u_3 - 3r") + "."), TR(s / 2 - 9 * r, "u_2 + u_7 = 2u_0 + 9r : divise aussi 9r par 2."), TR(r, "C'est la raison ; on demande " + M("u_0") + ".")] }); },
    ],
  };

  SA[1].push(() => { const a = R.int(-4, 8), r = nz(-3, 3), k = R.int(9, 25), v = a + k * r, ts = [0, 1, 2, 3, 4, 5].map((n) => a + n * r); if (Math.abs(r) === 1 && R.rand() < 0.5) return null;
    return QN("Le graphique représente les premiers termes d'une suite arithmétique " + M("(u_n)") + ". Lis " + M("u_0") + " et la raison, puis calcule " + M(u(k)) + ".", v,
      "On lit " + M("u_0 = " + N(a)) + " et, d'un point au suivant, " + M(r > 0 ? "+" + r : N(r)) + " : " + M("r = " + N(r)) + ". " + M(u(k) + " = " + N(a) + " + " + k + X + NP(r) + " = " + N(v)) + ".",
      { ctx: "graphique", fig: figSuite(ts), guide: [GS("Premier terme " + M("u_0") + " ?", a, M(N(a)) + "."), GS("Raison " + M("r") + " (écart vertical entre deux points voisins) ?", r, M(N(r)) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
        traps: [TR(a + (k - 1) * r, "Depuis " + M("u_0") + ", on ajoute la raison " + k + " fois."), TR(ts[5] + k * r, "On part de u_0, le premier point (n = 0)."), TR(a - k * r, "Regarde si les points montent ou descendent : signe de la raison.")] }); });

  // ===================== suitegeo =====================
  const SG = {
    1: [
      () => { const a = pk([2, 3, 5, -3, 4, 7]), q = pk([2, 3, -2]), n = R.int(4, 6), v = a * q ** n; if (Math.abs(v) > 5000) return null;
        return QN(M("(u_n)") + " est la suite géométrique de premier terme " + M("u_0 = " + N(a)) + " et de raison " + M("q = " + N(q)) + ". Calcule " + M(u(n)) + ".", v, M(u(n) + " = u_0" + X + "q^{" + n + "} = " + N(a) + X + NP(q) + "^{" + n + "} = " + N(a) + X + NP(q ** n) + " = " + N(v)) + ".",
          { ctx: "u0-q", guide: [GS(M(NP(q) + "^{" + n + "}") + " = ?", q ** n, M(N(q ** n)) + (q < 0 ? " (exposant " + (n % 2 ? "impair : négatif" : "pair : positif") + ")." : ".")), GS(M(u(n)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a * q * n, "On multiplie " + n + " fois par la raison : c'est une puissance."), TR(a * q ** (n - 1), "Depuis " + M("u_0") + ", il y a " + n + " multiplications."), TR(a + n * q, "Suite géométrique : on multiplie, on n'ajoute pas."), TR((a * q) ** n, "Seule la raison est à la puissance " + n + ".")] }); },
      () => { const t = pk([2, 3, 4, 5, 8, 12, 15, 1.5, 2.5, 0.5]), up = R.rand() < 0.5, q = rnd(1 + (up ? t : -t) / 100), what = pk([["un loyer", "augmente", "diminue"], ["une population de pandas roux", "augmente", "diminue"], ["le prix d'un abonnement", "augmente", "baisse"], ["la production d'une ferme solaire", "augmente", "diminue"]]);
        return QN("Chaque année, " + what[0] + " " + (up ? what[1] : what[2]) + " de " + M(N(t) + "\\,\\%") + ". On note " + M("u_n") + " sa valeur l'année " + M("n") + ". " + M("(u_n)") + " est géométrique : quelle est sa raison ?", q,
          (up ? "Augmenter" : "Diminuer") + " de " + M(N(t) + "\\,\\%") + ", c'est multiplier par " + M("1 " + (up ? "+" : "-") + " \\frac{" + N(t) + "}{100} = " + N(q)) + ".",
          { ctx: "taux-raison", guide: [GS(M(N(t) + "\\,\\%") + " en écriture décimale ?", t / 100, M(N(t / 100)) + "."), GS("Raison " + M("q") + " ?", q, M(N(q)) + ".")],
            traps: [TR(t / 100, "On garde aussi la valeur de départ : q = 1 " + (up ? "+" : "−") + " " + N(t / 100).replace("{,}", ",") + "."), TR(rnd(1 + (up ? -t : t) / 100), up ? "Une hausse donne q > 1." : "Une baisse donne q < 1."), TR(1 + t, "Le taux en % se divise par 100.")] }); },
      () => { const a = pk([3, 5, 6, -2, 10, 7]), q = pk([2, 3, -2, -3]), k = R.int(4, 6), v = a * q ** (k - 1); if (Math.abs(v) > 6000) return null;
        return QN("Une suite géométrique " + M("(u_n)") + " a pour premier terme " + M("u_1 = " + N(a)) + " et pour raison " + M(N(q)) + ". Calcule " + M(u(k)) + ".", v, M(u(k) + " = u_1" + X + "q^{" + (k - 1) + "} = " + N(a) + X + NP(q) + "^{" + (k - 1) + "} = " + N(v)) + ".",
          { ctx: "u1-q", guide: [GS("Exposant de " + M("q") + " de " + M("u_1") + " à " + M(u(k)) + " ?", k - 1, M(k - 1) + "."), GS(M(u(k)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a * q ** k, "De " + M("u_1") + " à " + M(u(k)) + ", " + (k - 1) + " multiplications."), TR(a * q * (k - 1), "On multiplie plusieurs fois : puissance.")] }); },
      () => { const q = pk([2, 3, 4]), n = R.int(3, 5), a = pk([3, 5, 7, 2, 6]), un = a * q ** n; if (un > 5000) return null;
        return QN("Une suite géométrique de raison " + M(q) + " vérifie " + M(u(n) + " = " + N(un)) + ". Calcule " + M("u_0") + ".", a,
          M(u(n) + " = u_0" + X + q + "^{" + n + "}") + " donc " + M("u_0 = \\frac{" + N(un) + "}{" + N(q ** n) + "} = " + N(a)) + ".",
          { ctx: "retour-u0", guide: [GS(M(q + "^{" + n + "}") + " = ?", q ** n, M(N(q ** n)) + "."), GS(M("u_0") + " = ?", a, M(N(a)) + ".")],
            traps: [TR(un / q ** (n - 1), "De " + M("u_0") + " à " + M(u(n)) + " : " + n + " multiplications par " + q + "."), TR(un - n * q, "Suite géométrique : on divise par la raison, on ne retire pas."), TR(un / (q * n), "Divise par " + M(q + "^{" + n + "}") + ".")] }); },
    ],
    2: [
      () => { const C0 = pk([1500, 2000, 2500, 3000, 4000, 5000, 8000]), t = pk([1.5, 2, 2.5, 3, 3.5, 4]), n = R.int(5, 12), q = rnd(1 + t / 100), v = C0 * q ** n;
        return QR("On place " + M(N(C0) + " \\text{ €}") + " à intérêts composés au taux annuel de " + M(N(t) + "\\,\\%") + ". Quel est le capital au bout de " + M(n) + " ans ? (arrondi au centime)", v, 0.01,
          "Chaque année, le capital est multiplié par " + M(N(q)) + " : " + M("C_{" + n + "} = " + N(C0) + X + N(q) + "^{" + n + "} \\approx " + N(rnd(v, 2)) + " \\text{ €}") + ".",
          { ctx: "capital", guide: [GS("Raison de la suite géométrique ?", q, M(N(q)) + "."), GR("Capital au bout de " + n + " ans (au centime) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(C0 * (1 + n * t / 100), 2), "Ce serait des intérêts simples : à intérêts composés, les intérêts rapportent aussi."), TR(rnd(C0 * q ** (n - 1), 2), "Au bout de " + n + " ans : " + n + " multiplications."), TR(rnd(C0 * q * n, 2), "On multiplie " + n + " fois par " + N(q).replace("{,}", ",") + " : puissance.")] }); },
      () => { const q = pk([2, 3, -2, 0.5, -3]), a = pk([2, 3, 4, 5, -4, 8, 16, 32]), u2 = a * q ** 2, u5 = a * q ** 5; if (!Number.isInteger(u2) || !Number.isInteger(u5) || Math.abs(u5) > 3000) return null;
        return QN("Une suite géométrique vérifie " + M("u_2 = " + N(u2)) + " et " + M("u_5 = " + N(u5)) + ". Quelle est sa raison ?", q,
          M("u_5 = u_2" + X + "q^3") + ", donc " + M("q^3 = \\frac{" + N(u5) + "}{" + N(u2) + "} = " + F(q ** 3)) + " et " + M("q = " + F(q)) + ".",
          { ctx: "q-deux-termes", guide: [GS(M("q^3 = \\frac{u_5}{u_2}") + " = ?", q ** 3, M(F(q ** 3)) + "."), GS(M("q") + " = ?", q, M(F(q)) + " (racine cubique).")],
            traps: [TR(q ** 3, "C'est " + M("q^3") + " : de " + M("u_2") + " à " + M("u_5") + ", trois multiplications."), TR((u5 - u2) / 3, "Suite géométrique : on compare par quotient, pas par différence."), TR(q ** 3 / 3, "Prends la racine cubique, pas le tiers.")] }); },
      () => { const a = pk([2, 3, 4, 5, 6, 7, 8, 9]), q = pk([2, 3, 5, "0.5"]), qv = +q, e = a + "*" + q + "^n";
        return QX(M("(u_n)") + " est géométrique, de premier terme " + M("u_0 = " + a) + " et de raison " + M(N(qv)) + ". Exprime " + M("u_n") + " en fonction de " + M("n") + ".", e,
          M("u_n = u_0" + X + "q^n = " + a + X + N(qv) + "^n") + ".",
          { ctx: "formule-geo", guide: [GX("Expression de " + M("u_n") + " ?", e, M(a + X + N(qv) + "^n") + ".")],
            traps: [TX("(" + a + "*" + q + ")^n", "Seule la raison est élevée à la puissance n."), TX(a + "*" + q + "^(n-1)", "Avec " + M("u_0") + ", l'exposant est n."), TX(a + "+" + q + "*n", "Géométrique : on multiplie par la raison à chaque rang.")] }); },
      () => { const t = pk([5, 8, 10, 12, 15, 20]), n = R.int(4, 12), q = rnd(1 - t / 100), c = pk([["Un échantillon radioactif a une masse de", "g ; elle diminue de", "par an", "radio"], ["Un médicament : la quantité dans le sang est de", "mg ; elle diminue de", "par heure", "medicament"], ["Un vélo électrique vaut", "€ ; sa valeur baisse de", "par an", "decote"]]), m0 = c[3] === "decote" ? pk([1200, 1800, 2400, 3000]) : pk([50, 80, 120, 200, 250]), v = m0 * q ** n;
        return QR(c[0] + " " + M(N(m0)) + " " + c[1] + " " + M(t + "\\,\\%") + " " + c[2] + ". Que vaut-elle au bout de " + M(n) + " " + (c[3] === "medicament" ? "heures" : "ans") + " ? (arrondi au centième)", v, 0.01,
          "Coefficient multiplicateur " + M(N(q)) + " : " + M(N(m0) + X + N(q) + "^{" + n + "} \\approx " + N(rnd(v, 2))) + ".",
          { ctx: c[3], guide: [GS("Raison ?", q, M("1 - " + N(t / 100) + " = " + N(q)) + "."), GR("Valeur au bout de " + n + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(m0 * (1 - n * t / 100), 2), "Les baisses en % se composent : on multiplie " + n + " fois par " + N(q).replace("{,}", ",") + "."), TR(rnd(m0 * (t / 100) ** n, 2), "On garde " + (100 - t) + " %, on multiplie par " + N(q).replace("{,}", ",") + "."), TR(rnd(m0 * q ** (n - 1), 2), n + " périodes : exposant " + n + ".")] }); },
    ],
    3: [
      () => { const P0 = pk([12000, 15000, 8000, 20000, 25000]), t = pk([2, 3, 4, 5, 6]), T = rnd(P0 * pk([0.75, 0.7, 0.8, 0.6])), q = rnd(1 - t / 100); let n = 0, p = P0; while (p >= T) { p *= q; n++; }
        const c = pk([["Une commune compte", "habitants ; sa population baisse de", "habitants", "commune"], ["Un glacier a une surface de", "m² ; elle diminue de", "m²", "glacier"], ["Un lac contient", "poissons ; leur nombre baisse de", "poissons", "lac"]]);
        return QN(c[0] + " " + M(N(P0)) + " " + c[1] + " " + M(t + "\\,\\%") + " par an. Au bout de combien d'années passera-t-elle pour la première fois sous " + M(N(T)) + " " + c[2] + " ?", n,
          M("u_n = " + N(P0) + X + N(q) + "^n") + ". À la calculatrice (ou avec une boucle) : " + M("u_{" + (n - 1) + "} \\approx " + N(rnd(P0 * q ** (n - 1), 0))) + " et " + M("u_{" + n + "} \\approx " + N(rnd(P0 * q ** n, 0))) + " : au bout de " + M(n) + " ans.",
          { ctx: c[3], guide: [GS("Raison ?", q, M(N(q)) + "."), GS("Plus petit " + M("n") + " tel que " + M("u_n < " + N(T)) + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Au bout de " + (n - 1) + " ans, on est encore au-dessus de " + N(T).replace(/\\,/g, " ") + "."), TR(Math.ceil((1 - T / P0) / (t / 100)), "Les baisses se composent : il en faut un peu plus que si on retirait toujours " + t + " % de la valeur de départ.")] }); },
      () => { const C0 = pk([1000, 2000, 1500, 3000]), add = pk([40, 60, 80, 100]), t = pk([3, 4, 5]), q = 1 + t / 100; let n = 0; while (C0 * q ** n <= C0 + add * n || n === 0) n++; if (n < 4 || n > 40) return null;
        return QN("Deux placements partent de " + M(N(C0) + " \\text{ €}") + ". Le placement A rapporte " + M(add + " \\text{ €}") + " par an ; le placement B augmente de " + M(t + "\\,\\%") + " par an. Au bout de combien d'années B dépasse-t-il A pour la première fois ?", n,
          "A : " + M("a_n = " + N(C0) + " + " + add + "n") + " (arithmétique) ; B : " + M("b_n = " + N(C0) + X + N(q) + "^n") + " (géométrique). Au tableur : " + M("b_{" + n + "} \\approx " + N(rnd(C0 * q ** n, 2)) + " > a_{" + n + "} = " + N(C0 + add * n)) + ", et c'était l'inverse l'année d'avant.",
          { ctx: "placements", guide: [GS("Placement A au bout de " + n + " ans ?", C0 + add * n, M(N(C0 + add * n)) + "."), GS("Première année où B dépasse A ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Cette année-là, A est encore devant."), TR(Math.round(add / (C0 * t / 100)), "La première année, B rapporte " + C0 * t / 100 + " € ; mais ses intérêts augmentent chaque année.")] }); },
      () => { const q = pk([2, 3, 0.5, -2]), a = pk([1, 2, 3, 4, 5]) * (q === 0.5 ? 32 : 1), u3 = a * q ** 3, u5 = a * q ** 5; if (!Number.isInteger(u5) || !Number.isInteger(u3) || Math.abs(u5) > 4000) return null; const qq = Math.abs(q);
        return QN("Une suite géométrique de raison positive vérifie " + M("u_3 = " + N(Math.abs(u3))) + " et " + M("u_5 = " + N(Math.abs(u5))) + ". Calcule " + M("u_0") + ".", Math.abs(a),
          M("q^2 = \\frac{u_5}{u_3} = " + F(qq * qq)) + ", " + M("q > 0") + " donc " + M("q = " + F(qq)) + ". Puis " + M("u_0 = \\frac{u_3}{q^3} = \\frac{" + N(Math.abs(u3)) + "}{" + F(qq ** 3) + "} = " + N(Math.abs(a))) + ".",
          { ctx: "u0-q-positive", guide: [GS(M("q^2") + " = ?", qq * qq, M(F(qq * qq)) + "."), GS(M("q") + " = ?", qq, M(F(qq)) + "."), GS(M("u_0") + " = ?", Math.abs(a), M(N(Math.abs(a))) + ".")],
            traps: [TR(Math.abs(u3) / qq ** 2, "De " + M("u_0") + " à " + M("u_3") + " : trois multiplications."), TR(Math.abs(u3) - 3 * qq, "Géométrique : on divise par la raison."), TR(Math.abs(u3) / (qq * qq) ** 3, "Calcule d'abord q (racine de q²).")] }); },
    ],
  };

  // ===================== suitesomme =====================
  const SS = {
    1: [
      () => { const n = pk([R.int(20, 60), 100, R.int(70, 150), 200, 1000]), v = (n * (n + 1)) / 2;
        return QN("Calcule " + M("S = 1 + 2 + 3 + \\dots + " + N(n)) + ".", v, M("1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}") + " avec " + M("n = " + N(n)) + " : " + M("S = \\frac{" + N(n) + X + N(n + 1) + "}{2} = " + N(v)) + ".",
          { ctx: "gauss", guide: [GS("Nombre de termes ?", n, M(N(n)) + "."), GS(M("S") + " = ?", v, M(N(v)) + ".")],
            traps: [TR((n * (n - 1)) / 2, "La formule est " + M("\\frac{n(n + 1)}{2}") + "."), TR(n * (n + 1), "N'oublie pas de diviser par 2."), TR((n * n) / 2, "Formule : " + M("\\frac{n(n + 1)}{2}") + ".")] }); },
      () => { const a = nz(-10, 20), r = nz(-4, 7), n = R.int(9, 30), un = a + n * r, v = ((n + 1) * (a + un)) / 2;
        return QN("La suite arithmétique " + M("(u_n)") + " a pour premier terme " + M("u_0 = " + N(a)) + " et pour raison " + M(N(r)) + ". Calcule " + M("S = u_0 + u_1 + \\dots + " + u(n)) + ".", v,
          M(u(n) + " = " + N(un)) + " ; il y a " + M(n + 1) + " termes : " + M("S = " + (n + 1) + X + "\\frac{" + N(a) + " + " + NP(un) + "}{2} = " + N(v)) + ".",
          { ctx: "somme-arith", guide: [GS(M(u(n)) + " = ?", un, M(N(un)) + "."), GS("Nombre de termes de " + M("u_0") + " à " + M(u(n)) + " ?", n + 1, M(n + 1) + "."), GS(M("S") + " = ?", v, M("\\text{nombre de termes}" + X + "\\frac{\\text{premier} + \\text{dernier}}{2} = " + N(v)) + ".")],
            traps: [TR((n * (a + un)) / 2, "De " + M("u_0") + " à " + M(u(n)) + ", il y a " + (n + 1) + " termes."), TR((n + 1) * (a + un), "On multiplie par la moyenne du premier et du dernier : divise par 2."), TR(un, "C'est le dernier terme ; on demande la somme.")] }); },
      () => { const q = pk([2, 3]), n = R.int(5, q === 2 ? 11 : 7), v = (q ** (n + 1) - 1) / (q - 1);
        return QN("Calcule " + M("S = 1 + " + q + " + " + q + "^2 + \\dots + " + q + "^{" + n + "}") + ".", v, M("1 + q + \\dots + q^n = \\frac{q^{n+1} - 1}{q - 1}") + " : " + M("S = \\frac{" + q + "^{" + (n + 1) + "} - 1}{" + (q - 1) + "} = " + N(v)) + ".",
          { ctx: "somme-puissances", guide: [GS(M(q + "^{" + (n + 1) + "}") + " = ?", q ** (n + 1), M(N(q ** (n + 1))) + "."), GS(M("S") + " = ?", v, M(N(v)) + ".")],
            traps: [TR((q ** n - 1) / (q - 1), "Il y a " + (n + 1) + " termes (de q⁰ à qⁿ) : l'exposant est " + (n + 1) + "."), TR(q ** (n + 1) - 1, "Divise par " + M("q - 1 = " + (q - 1)) + "."), TR(q ** n, "C'est le dernier terme, pas la somme.")] }); },
    ],
    2: [
      () => { const n = R.int(15, 120), odd = R.rand() < 0.5, last = odd ? 2 * n - 1 : 2 * n, v = odd ? n * n : n * (n + 1);
        return QN("Calcule " + M("S = " + (odd ? "1 + 3 + 5" : "2 + 4 + 6") + " + \\dots + " + N(last)) + ".", v,
          "Suite arithmétique de raison 2 ; nombre de termes : " + M(n) + ". " + M("S = " + n + X + "\\frac{" + (odd ? 1 : 2) + " + " + N(last) + "}{2} = " + N(v)) + ".",
          { ctx: odd ? "impairs" : "pairs", guide: [GS("Nombre de termes ?", n, M(n) + (odd ? " (le k-ième impair est 2k − 1)." : " (on compte de 2 en 2).")), GS(M("S") + " = ?", v, M(N(v)) + ".")],
            traps: [TR((last * (last + 1)) / 2, "On n'additionne qu'un nombre sur deux."), TR(((n - 1) * ((odd ? 1 : 2) + last)) / 2, "Il y a " + n + " termes.")] }); },
      () => { const c = pk([["Un message est envoyé à", "personnes le premier jour ; chaque jour, chaque nouveau destinataire le transfère à", "personnes", "message"], ["Une ferme plante", "arbres la première année puis, chaque année,", "fois plus que l'année précédente", "arbres"], ["Un club organise une chaîne : le premier jour,", "personnes jouent, puis chaque jour il y en a", "fois plus", "chaine"]]);
        const a = pk([2, 3, 4, 5]), q = pk([2, 3]), N0 = R.int(5, q === 2 ? 9 : 6), v = (a * (q ** N0 - 1)) / (q - 1);
        return QN(c[0] + " " + M(a) + " " + c[1] + " " + M(q) + (c[3] === "message" ? " " + c[2] : " " + c[2]) + ". Combien au total en " + M(N0) + " jours" + (c[3] === "arbres" ? " (années)" : "") + " ?", v,
          "Termes " + M(a + ", " + a * q + ", " + a * q * q + ", \\dots") + " : suite géométrique de raison " + M(q) + ". " + M("S = " + a + X + "\\frac{" + q + "^{" + N0 + "} - 1}{" + q + " - 1} = " + N(v)) + ".",
          { ctx: c[3], guide: [GS("Terme du jour " + N0 + " ?", a * q ** (N0 - 1), M(a + X + q + "^{" + (N0 - 1) + "} = " + N(a * q ** (N0 - 1))) + "."), GS("Total ?", v, M(N(v)) + ".")],
            traps: [TR(a * q ** (N0 - 1), "C'est le nombre du dernier jour ; on demande le total."), TR((a * (q ** (N0 + 1) - 1)) / (q - 1), N0 + " jours = " + N0 + " termes : exposant " + N0 + "."), TR(a * q * N0, "Les termes sont multipliés par " + q + " chaque jour.")] }); },
      () => { const r1 = pk([12, 15, 18, 20, 24]), d = pk([2, 3, 4]), k = R.int(10, 25), last = r1 + (k - 1) * d, v = (k * (r1 + last)) / 2, c = pk([["Dans un amphithéâtre, le 1er rang compte", "places et chaque rang a", "places de plus que le précédent", "rangs", "amphi"], ["Dans une pyramide de canettes, la rangée du haut compte", "canettes et chaque rangée en a", "de plus que celle du dessus", "rangées", "canettes"]]);
        return QN(c[0] + " " + M(r1) + " " + c[1] + " " + M(d) + " " + c[2] + ". Il y a " + M(k) + " " + c[3] + ". Combien en tout ?", v,
          "Dernier : " + M(r1 + " + " + (k - 1) + X + d + " = " + last) + ". Total : " + M(k + X + "\\frac{" + r1 + " + " + last + "}{2} = " + N(v)) + ".",
          { ctx: c[4], guide: [GS("Nombre au dernier rang ?", last, M(last) + "."), GS("Total ?", v, M(N(v)) + ".")],
            traps: [TR(k * r1, "Les rangs ne sont pas tous pareils : ils augmentent de " + d + "."), TR((k * (r1 + r1 + k * d)) / 2, "Le dernier rang : " + r1 + " + (" + k + " − 1) × " + d + "."), TR(last, "C'est le dernier rang ; on demande le total.")] }); },
      () => { const a = nz(-5, 12), r = nz(2, 6), p = R.int(3, 9), q = p + R.int(8, 20), up = a + p * r, uq = a + q * r, cnt = q - p + 1, v = (cnt * (up + uq)) / 2;
        return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + pol([r, a])) + ". Calcule " + M("S = " + u(p) + " + " + u(p + 1) + " + \\dots + " + u(q)) + ".", v,
          M(u(p) + " = " + N(up)) + ", " + M(u(q) + " = " + N(uq)) + ", " + M(cnt) + " termes : " + M("S = " + cnt + X + "\\frac{" + N(up) + " + " + N(uq) + "}{2} = " + N(v)) + ".",
          { ctx: "somme-partielle", guide: [GS("Nombre de termes de " + M(u(p)) + " à " + M(u(q)) + " ?", cnt, M(q + " - " + p + " + 1 = " + cnt) + "."), GS(M(u(p) + " + " + u(q)) + " = ?", up + uq, M(N(up + uq)) + "."), GS(M("S") + " = ?", v, M(N(v)) + ".")],
            traps: [TR(((q - p) * (up + uq)) / 2, "De " + M(u(p)) + " à " + M(u(q)) + " : " + cnt + " termes (on compte les deux bouts)."), TR(((q + 1) * (a + uq)) / 2, "La somme commence à " + M(u(p)) + ", pas à " + M("u_0") + ".")] }); },
    ],
    3: [
      () => { const n = R.int(15, 70), S = (n * (n + 1)) / 2;
        return QN("Pour quel entier " + M("n") + " a-t-on " + M("1 + 2 + \\dots + n = " + N(S)) + " ?", n,
          M("\\frac{n(n + 1)}{2} = " + N(S) + " \\iff n(n + 1) = " + N(2 * S)) + ". Deux entiers consécutifs de produit " + M(N(2 * S)) + " : " + M(n + X + (n + 1)) + ", donc " + M("n = " + n) + ".",
          { ctx: "gauss-inverse", guide: [GS(M("n(n + 1)") + " = ?", 2 * S, M(N(2 * S)) + "."), GS(M("n") + " = ? (proche de " + M("\\sqrt{" + N(2 * S) + "}") + ")", n, M(n) + ".")],
            traps: [TR(n + 1, "Vérifie : " + M("\\frac{" + (n + 1) + X + (n + 2) + "}{2} \\ne " + N(S)) + "."), TR(Math.round(Math.sqrt(S)), "Résous " + M("n(n + 1) = " + N(2 * S)) + ".")] }); },
      () => { const a = pk([50, 80, 100, 120, 150]), t = pk([2, 3, 4, 5]), n = pk([10, 12, 15, 18, 24]), q = rnd(1 + t / 100), v = (a * (q ** n - 1)) / (q - 1);
        return QR("Chaque mois, Sarah verse sur un compte une somme qui augmente de " + M(t + "\\,\\%") + " : " + M(a + " \\text{ €}") + " le premier mois, puis " + M(N(rnd(a * q, 2)) + " \\text{ €}") + ", etc. Combien a-t-elle versé en tout au bout de " + M(n) + " mois ? (arrondi au centime)", v, 0.01,
          "Versements géométriques de raison " + M(N(q)) + " : " + M("S = " + a + X + "\\frac{" + N(q) + "^{" + n + "} - 1}{" + N(q) + " - 1} \\approx " + N(rnd(v, 2)) + " \\text{ €}") + ".",
          { ctx: "versements", guide: [GS("Raison ?", q, M(N(q)) + "."), GR("Total (au centime) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(a * q ** (n - 1), 2), "C'est le dernier versement ; on demande le total."), TR(a * n, "Les versements augmentent chaque mois."), TR(rnd((a * (q ** (n + 1) - 1)) / (q - 1), 2), n + " versements : exposant " + n + ".")] }); },
      () => { const S = pk([1000, 5000, 10000, 50000, 100000, 1000000]); let n = 1; while (2 ** n - 1 < S) n++;
        return QN("Sur un échiquier, on pose 1 grain de riz sur la 1re case, 2 sur la 2e, 4 sur la 3e, et ainsi de suite en doublant. À partir de combien de cases le total dépasse-t-il " + M(N(S)) + " grains ?", n,
          "Avec " + M("n") + " cases : " + M("1 + 2 + \\dots + 2^{n-1} = 2^n - 1") + ". " + M("2^{" + (n - 1) + "} - 1 = " + N(2 ** (n - 1) - 1)) + " et " + M("2^{" + n + "} - 1 = " + N(2 ** n - 1)) + " : il faut " + M(n) + " cases.",
          { ctx: "echiquier", guide: [GS("Total pour " + M("10") + " cases (" + M("1 + 2 + \\dots + 2^9") + ") ?", 1023, M("2^{10} - 1 = 1\\,023") + " : avec " + M("n") + " cases, " + M("2^n - 1") + "."), GS("Plus petit " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Avec " + (n - 1) + " cases, on n'a que " + N(2 ** (n - 1) - 1).replace(/\\,/g, " ") + " grains."), TR(n + 1, "Avec " + n + " cases, on a déjà " + N(2 ** n - 1).replace(/\\,/g, " ") + " grains.")] }); },
    ],
  };

  // ===================== expfn =====================
  const ex = (k) => "e^{" + N(k) + "}";
  const EF = {
    1: [
      () => { const a = nz(-6, 9), b = nz(-7, 8), c = R.rand() < 0.5 ? 0 : nz(-5, 6), k = a + b - c; if (k === 0 || Math.abs(k) === 1) return null;
        return QN("Écris " + M(ex(a) + X + ex(b) + (c ? " \\div " + ex(c) : "")) + " sous la forme " + M("e^k") + ". Que vaut " + M("k") + " ?", k,
          M("e^a" + X + "e^b = e^{a + b}") + (c ? " et " + M("\\frac{e^a}{e^b} = e^{a - b}") : "") + " : " + M("k = " + N(a) + " + " + NP(b) + (c ? " - " + NP(c) : "") + " = " + N(k)) + ".",
          { ctx: "produit", guide: [GS("Exposant de " + M(ex(a) + X + ex(b)) + " ?", a + b, M(N(a + b)) + "."), GS(M("k") + " = ?", k, M(N(k)) + ".")],
            traps: [TR(a * b - c, "On ajoute les exposants (on ne les multiplie pas)."), TR(a + b + c, "Diviser par " + M(ex(c)) + " retire l'exposant " + c + ".")] }); },
      () => { const a = nz(-5, 6), b = nz(-4, 5), k = a * b; if (Math.abs(a) === 1 || Math.abs(b) === 1) return null;
        return QN("Écris " + M("\\left(" + ex(a) + "\\right)^{" + N(b) + "}") + " sous la forme " + M("e^k") + ". Que vaut " + M("k") + " ?", k, M("(e^a)^b = e^{ab}") + " : " + M("k = " + N(a) + X + NP(b) + " = " + N(k)) + ".",
          { ctx: "puissance", guide: [GS(M("k = " + N(a) + X + NP(b)) + " = ?", k, M(N(k)) + ".")], traps: [TR(a + b, "Puissance d'une puissance : on multiplie les exposants."), TR(a ** b, "L'exposant devient " + M(N(a) + X + NP(b)) + ".")] }); },
      () => { const a = nz(-5, 5), b = nz(-8, 8), c = nz(-9, 9); if (Math.abs(a) === 1 || c === b) return null; const x = (c - b) / a;
        return QN("Résous " + M("e^{" + pol([a, b], "x") + "} = " + ex(c)) + " (fraction acceptée).", x,
          "La fonction exponentielle est strictement croissante : " + M("e^a = e^b \\iff a = b") + ". Donc " + M(pol([a, b], "x") + " = " + N(c)) + " et " + M("x = " + F(x)) + ".",
          { ctx: "equation", guide: [GS("Équation sur les exposants : " + M(N(a) + "x = ") + " ?", c - b, M(N(c) + " - " + NP(b) + " = " + N(c - b)) + "."), GS(M("x") + " = ?", x, M(F(x)) + ".")],
            traps: [TR((c + b) / a, "Pour isoler " + M(N(a) + "x") + ", on retire " + N(b).replace("{,}", ",") + "."), TR(c / a - b, "Retire d'abord " + N(b) + ", puis divise par " + N(a) + "."), TR((c - b) * a, "On divise par " + N(a) + ".")] }); },
      () => { const a = nz(-6, 8); if (Math.abs(a) < 2) return null; const b = nz(-6, 6), k = b - a; if (k === 0 || Math.abs(k) === 1) return null;
        return QN("Écris " + M("\\frac{" + ex(b) + "}{" + ex(a) + "}") + " sous la forme " + M("e^k") + ". Que vaut " + M("k") + " ?", k, M("\\frac{e^b}{e^a} = e^{b - a}") + " : " + M("k = " + N(b) + " - " + NP(a) + " = " + N(k)) + ".",
          { ctx: "quotient", guide: [GS(M("k = " + N(b) + " - " + NP(a)) + " = ?", k, M(N(k)) + ".")], traps: [TR(b / a, "Quotient de deux exponentielles : on soustrait les exposants."), TR(a - b, "C'est exposant du haut moins exposant du bas."), TR(a + b, "On divise : on soustrait.")] }); },
    ],
    2: [
      () => { const a = nz(-5, 6), c = nz(-5, 6), b = nz(-9, 9), d = nz(-9, 9); if (a === c || b === d) return null; const x = (d - b) / (a - c);
        return QN("Résous " + M("e^{" + pol([a, b], "x") + "} = e^{" + pol([c, d], "x") + "}") + " (fraction acceptée).", x,
          "Exponentielle strictement croissante : " + M(pol([a, b], "x") + " = " + pol([c, d], "x")) + ", soit " + M(N(a - c) + "x = " + N(d - b)) + " et " + M("x = " + F(x)) + ".",
          { ctx: "equation-2", guide: [GS("On égale les exposants et on regroupe : coefficient de " + M("x") + " ?", a - c, M(N(a) + " - " + NP(c) + " = " + N(a - c)) + "."), GS(M("x") + " = ?", x, M(F(x)) + ".")],
            traps: [TR((d - b) / (a + c), "En passant " + M(N(c) + "x") + " à gauche, on le soustrait."), TR((d + b) / (a - c), "En passant " + N(b) + " à droite, on le soustrait.")] }); },
      () => { const a = nz(-5, 5), b = nz(-8, 8), c = nz(-8, 8), op = pk(["<", "<=", ">", ">="]); if (Math.abs(a) === 1 || c === b) return null; const v = (c - b) / a, op2 = a > 0 ? op : FLIP[op], ivs = [ivOf(op2, v)];
        return QS("Résous " + M("e^{" + pol([a, b], "x") + "} " + OPT[op] + " " + ex(c)) + ". Donne l'ensemble des solutions (intervalle).", ivs,
          "L'exponentielle est strictement croissante : elle conserve l'ordre. " + M(pol([a, b], "x") + " " + OPT[op] + " " + N(c)) + (a < 0 ? " ; on divise par " + M(N(a)) + " (négatif) : le sens change" : "") + ". " + M("S = " + SolSet.show(ivs)) + ".",
          { ctx: "inequation", guide: [GS("Borne : " + M("x = ") + " ?", v, M(F(v)) + "."), GSS("Ensemble des solutions ?", ivs, M("S = " + SolSet.show(ivs)) + ".")],
            traps: [TS([ivOf(FLIP[op2], v)], a < 0 ? "Diviser par un négatif change le sens de l'inégalité." : "L'exponentielle est croissante : le sens ne change pas."), TS([ivOf({ "<": "<=", "<=": "<", ">": ">=", ">=": ">" }[op2], v)], op2.length === 2 ? "Inégalité large : la borne est comprise (crochet fermé)." : "Inégalité stricte : la borne est exclue (crochet ouvert).")] }); },
      () => { const a = nz(-4, 5), b = nz(-6, 6), c = nz(-4, 5), d = nz(-6, 6), k = a + b - c, m = 0; if (k === 0) return null; const e = "e^(" + k + "x)";
        return QX("Simplifie " + M("A = \\frac{e^{" + pol([a, 0], "x") + "}" + X + "e^{" + pol([b, 0], "x") + "}}{e^{" + pol([c, 0], "x") + "}}") + " (écris le résultat sous la forme " + M("e^{\\dots}") + ").", e,
          M("A = e^{" + N(a) + "x + " + NP(b) + "x - " + NP(c) + "x} = e^{" + pol([k, 0], "x") + "}") + ".",
          { ctx: "simplifier", guide: [GX("Exposant de " + M("A") + " ?", k + "x", M(pol([k, 0], "x")) + "."), GX(M("A") + " = ?", e, M("e^{" + pol([k, 0], "x") + "}") + ".")],
            traps: [TX("e^(" + (a * b - c) + "x)", "Produit : on ajoute les exposants."), TX("e^(" + (a + b + c) + "x)", "Quotient : on soustrait l'exposant du bas.")] }); },
      () => { const a = pk([2, 3, 4]), b = nz(-5, 5), k = a + b; if (k === 0) return null; const e = "e^(" + k + "x)";
        return QX("Simplifie " + M("B = \\left(e^{x}\\right)^{" + a + "}" + X + "e^{" + pol([b, 0], "x") + "}") + ".", e, M("(e^x)^{" + a + "} = e^{" + a + "x}") + ", puis " + M("B = e^{" + a + "x + " + NP(b) + "x} = e^{" + pol([k, 0], "x") + "}") + ".",
          { ctx: "puissance-x", guide: [GX(M("(e^x)^{" + a + "}") + " = ?", "e^(" + a + "x)", M("e^{" + a + "x}") + "."), GX(M("B") + " = ?", e, M("e^{" + pol([k, 0], "x") + "}") + ".")],
            traps: [TX("e^(" + a * b + "x^2)", "On ajoute les exposants : " + a + "x + " + b + "x."), TX("e^(" + (a + 1 + b) + "x)", "(e^x)^" + a + " = e^(" + a + "x).")] }); },
    ],
    3: [
      () => { const p = nz(-5, 5), q = nz(-5, 6); if (p === q) return null; const s = p + q, pr = p * q;
        return QSet("Résous " + M("e^{x^2} = e^{" + pol([s, -pr], "x") + "}") + ". Donne les solutions séparées par « ; ».", [p, q],
          M("x^2 = " + pol([s, -pr], "x") + " \\iff " + pol([1, -s, pr], "x") + " = 0 \\iff (x " + (p < 0 ? "+ " + -p : "- " + p) + ")(x " + (q < 0 ? "+ " + -q : "- " + q) + ") = 0") + " : " + M("x = " + p) + " ou " + M("x = " + q) + ".",
          { ctx: "equation-carre", guide: [GX("Équation du second degré obtenue (" + M("\\dots = 0") + ") : membre de gauche ?", polE([1, -s, pr], "x"), M(pol([1, -s, pr], "x")) + "."), GSet("Solutions ?", [p, q], M(p) + " et " + M(q) + ".")],
            traps: [{ s: [-p, -q], m: "Vérifie les signes : (x − a) s'annule en a." }, { s: [s], m: "C'est une équation du second degré : deux solutions." }] }); },
      () => { const a = nz(-6, 6), up = R.rand() < 0.5, k = pk([1, 2, 3]), op = pk([">", ">=", "<", "<="]), ivs = [ivOf(up ? op : FLIP[op], a)];
        const fx = (up ? "(x " + (a < 0 ? "+ " + -a : "- " + a) + ")" : "(" + N(a) + " - x)") + "e^{" + (k === 1 ? "" : k) + "x}";
        return QS("Résous " + M(fx + " " + OPT[op] + " 0") + ". Donne l'ensemble des solutions.", ivs,
          "Pour tout réel " + M("x") + ", " + M("e^{" + (k === 1 ? "" : k) + "x} > 0") + " : le signe est celui de " + M(up ? "x - " + NP(a) : N(a) + " - x") + ". " + M("S = " + SolSet.show(ivs)) + ".",
          { ctx: "signe-produit", guide: [GS("Valeur qui annule le facteur affine ?", a, M(N(a)) + "."), GSS("Ensemble des solutions ?", ivs, M("S = " + SolSet.show(ivs)) + ".")],
            traps: [TS([ivOf(up ? FLIP[op] : op, a)], up ? "x − a est positif pour x > a." : "a − x est positif pour x < a : attention au signe de x."), TS([[-Infinity, false, Infinity, false]], "L'exponentielle est positive, mais l'autre facteur change de signe.")] }); },
      () => { const T0 = pk([60, 70, 75, 80]), amb = pk([18, 20, 22]), k = pk([0.04, 0.05, 0.06, 0.08, 0.1]), t = pk([5, 8, 10, 12, 15, 20]), v = amb + T0 * Math.exp(-k * t);
        return QR("La température d'un café (en °C) au bout de " + M("t") + " minutes est " + M("T(t) = " + amb + " + " + T0 + "e^{-" + N(k) + "t}") + ". Calcule " + M("T(" + t + ")") + " (arrondi au dixième).", v, 0.1,
          M("e^{-" + N(k) + X + t + "} = e^{" + N(rnd(-k * t)) + "} \\approx " + N(rnd(Math.exp(-k * t), 4))) + ", donc " + M("T(" + t + ") \\approx " + amb + " + " + T0 + X + N(rnd(Math.exp(-k * t), 4)) + " \\approx " + N(rnd(v, 1))) + " °C.",
          { ctx: "refroidissement", guide: [GR(M("e^{-" + N(k) + X + t + "}") + " (à 0,001 près) ?", Math.exp(-k * t), M("\\approx " + N(rnd(Math.exp(-k * t), 3))) + ".", 0.001), GR(M("T(" + t + ")") + " au dixième ?", v, M("\\approx " + N(rnd(v, 1))) + ".", 0.1)],
            traps: [TR(rnd((amb + T0) * Math.exp(-k * t), 1), "Seul " + T0 + " est multiplié par l'exponentielle."), TR(rnd(amb + T0 * Math.exp(k * t), 1), "L'exposant est négatif : la température baisse."), TR(rnd(amb + T0 * (1 - k * t), 1), "Utilise la touche exp de la calculatrice.")] }); },
    ],
  };

  // ===================== pscal =====================
  const vc = (a, b, nm = "u") => "\\vec{" + nm + "}\\begin{pmatrix} " + N(a) + " \\\\ " + N(b) + " \\end{pmatrix}";
  const ANG = [["\\frac{\\pi}{3}", 0.5, "\\frac{1}{2}"], ["\\frac{2\\pi}{3}", -0.5, "-\\frac{1}{2}"], ["\\frac{\\pi}{4}", Math.SQRT1_2, "\\frac{\\sqrt{2}}{2}"], ["\\frac{3\\pi}{4}", -Math.SQRT1_2, "-\\frac{\\sqrt{2}}{2}"], ["\\frac{\\pi}{6}", Math.sqrt(3) / 2, "\\frac{\\sqrt{3}}{2}"], ["\\frac{5\\pi}{6}", -Math.sqrt(3) / 2, "-\\frac{\\sqrt{3}}{2}"]];
  const TRIP = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]];
  const PS = {
    1: [
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6), v = a * c + b * d; if (v === 0) return null;
        return QN("Dans un repère orthonormé, " + M(vc(a, b, "u")) + " et " + M(vc(c, d, "v")) + ". Calcule " + M("\\vec{u} \\cdot \\vec{v}") + ".", v,
          M("\\vec{u} \\cdot \\vec{v} = xx' + yy' = " + N(a) + X + NP(c) + " + " + NP(b) + X + NP(d) + " = " + N(v)) + ".",
          { ctx: "coordonnees", guide: [GS(M("xx'") + " = ?", a * c, M(N(a * c)) + "."), GS(M("yy'") + " = ?", b * d, M(N(b * d)) + "."), GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a * d + b * c, "On multiplie les abscisses entre elles, puis les ordonnées entre elles."), TR(a * c - b * d, "Les deux produits s'additionnent."), TR(a * b + c * d, "On combine " + M("\\vec{u}") + " avec " + M("\\vec{v}") + " : abscisse avec abscisse.")] }); },
      () => { const p = R.int(2, 8), q = R.int(2, 9), A = pk(ANG), v = p * q * A[1];
        return QN("On a " + M("\\lVert \\vec{u} \\rVert = " + p) + ", " + M("\\lVert \\vec{v} \\rVert = " + q) + " et l'angle " + M("(\\vec{u}, \\vec{v})") + " mesure " + M(A[0]) + " rad. Calcule " + M("\\vec{u} \\cdot \\vec{v}") + " (valeur exacte).", v,
          M("\\vec{u} \\cdot \\vec{v} = \\lVert \\vec{u} \\rVert" + X + "\\lVert \\vec{v} \\rVert" + X + "\\cos\\theta = " + p + X + q + X + "\\left(" + A[2] + "\\right)") + ".",
          { ctx: "norme-angle", guide: [GS(M("\\cos " + A[0]) + " = ?", A[1], M(A[2]) + "."), GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", v, M(p * q + X + "\\left(" + A[2] + "\\right)") + ".")],
            traps: [TR(p * q, "Il faut multiplier par le cosinus de l'angle."), TR(p * q * Math.sqrt(1 - A[1] ** 2), "C'est le cosinus, pas le sinus."), TR(-v, "Vérifie le signe du cosinus de cet angle.")] }); },
      () => { const b = pk([2, -2, 3, -3, 4, 6, -4]), cc = nz(-6, 6), a = nz(-6, 6), m = (-a * cc) / b; if (!Number.isInteger(m) || m === 0 || Math.abs(m) === 1) return null;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec{u}\\begin{pmatrix} m \\\\ " + N(a) + " \\end{pmatrix}") + " et " + M(vc(b, cc, "v")) + " sont-ils orthogonaux ?", m,
          "Orthogonaux " + M("\\iff \\vec{u} \\cdot \\vec{v} = 0") + " : " + M(N(b) + "m + " + NP(a) + X + NP(cc) + " = 0") + ", " + M(N(b) + "m = " + N(-a * cc)) + ", " + M("m = " + N(m)) + ".",
          { ctx: "orthogonal", guide: [GS("Produit des ordonnées " + M(NP(a) + X + NP(cc)) + " ?", a * cc, M(N(a * cc)) + "."), GS(M("m") + " = ?", m, M(N(m)) + ".")],
            traps: [TR(-m, "Passe " + N(a * cc) + " de l'autre côté : il change de signe."), TR((-a * b) / cc, "Abscisse avec abscisse, ordonnée avec ordonnée.")] }); },
    ],
    2: [
      () => { const t1 = pk(TRIP), t2 = pk(TRIP), s1 = [pk([1, -1]), pk([1, -1])], s2 = [pk([1, -1]), pk([1, -1])], u1 = [s1[0] * t1[0], s1[1] * t1[1]], v1 = [s2[0] * t2[0], s2[1] * t2[1]], dot = u1[0] * v1[0] + u1[1] * v1[1], v = dot / (t1[2] * t2[2]); if (dot === 0) return null;
        return QN("Avec " + M(vc(u1[0], u1[1], "u")) + " et " + M(vc(v1[0], v1[1], "v")) + ", calcule " + M("\\cos(\\vec{u}, \\vec{v})") + " (fraction acceptée).", v,
          M("\\vec{u} \\cdot \\vec{v} = " + N(dot)) + ", " + M("\\lVert \\vec{u} \\rVert = " + t1[2]) + ", " + M("\\lVert \\vec{v} \\rVert = " + t2[2]) + " : " + M("\\cos\\theta = \\frac{" + N(dot) + "}{" + t1[2] + X + t2[2] + "} = " + F(v)) + ".",
          { ctx: "cosinus", guide: [GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", dot, M(N(dot)) + "."), GS(M("\\lVert \\vec{u} \\rVert" + X + "\\lVert \\vec{v} \\rVert") + " = ?", t1[2] * t2[2], M(t1[2] + X + t2[2] + " = " + t1[2] * t2[2]) + "."), GS(M("\\cos\\theta") + " = ?", v, M(F(v)) + ".")],
            traps: [TR(dot, "Divise par le produit des normes."), TR(dot / (t1[2] + t2[2]), "On divise par le produit des normes, pas leur somme."), TR(dot / (t1[2] ** 2 * t2[2] ** 2), "La norme est la racine de x² + y².")] }); },
      () => { const b = R.int(3, 9), c = R.int(3, 9), A = pk([[60, 0.5, "\\frac{\\pi}{3}"], [120, -0.5, "\\frac{2\\pi}{3}"]]), bc2 = b * b + c * c - 2 * b * c * A[1], v = Math.sqrt(bc2); if (b === c && A[0] === 60) return null;
        return QN("Dans le triangle " + M("ABC") + ", " + M("AB = " + c) + ", " + M("AC = " + b) + " et " + M("\\widehat{BAC} = " + A[2]) + " rad. Calcule " + M("BC") + " (valeur exacte).", v,
          "Al-Kashi : " + M("BC^2 = AB^2 + AC^2 - 2" + X + "AB" + X + "AC" + X + "\\cos\\widehat{A} = " + c * c + " + " + b * b + " - 2" + X + c + X + b + X + "\\left(" + (A[1] > 0 ? "\\frac{1}{2}" : "-\\frac{1}{2}") + "\\right) = " + bc2) + ", donc " + M("BC = \\sqrt{" + bc2 + "}") + ".",
          { ctx: "al-kashi", fig: FIG.triAngles(["", "", A[0] === 60 ? "π/3" : "2π/3"], ["", String(b), String(c)], ["B", "C", "A"]), guide: [GS(M("BC^2") + " = ?", bc2, M(bc2) + "."), GS(M("BC") + " = ?", v, M("\\sqrt{" + bc2 + "}") + ".")],
            traps: [TR(Math.sqrt(b * b + c * c), "Pythagore ne vaut que pour un angle droit : il manque le terme en cosinus."), TR(bc2, "C'est BC² : prends la racine."), TR(Math.sqrt(b * b + c * c + 2 * b * c * A[1]), "Al-Kashi : on soustrait 2 × AB × AC × cos A.")] }); },
      () => { const a = R.int(2, 7), b = R.int(2, 8), s = R.int(Math.abs(a - b) + 1, a + b - 1), v = (s * s - a * a - b * b) / 2; if (v === 0) return null;
        return QN("On sait que " + M("\\lVert \\vec{u} \\rVert = " + a) + ", " + M("\\lVert \\vec{v} \\rVert = " + b) + " et " + M("\\lVert \\vec{u} + \\vec{v} \\rVert = " + s) + ". Calcule " + M("\\vec{u} \\cdot \\vec{v}") + ".", v,
          M("\\lVert \\vec{u} + \\vec{v} \\rVert^2 = \\lVert \\vec{u} \\rVert^2 + 2\\,\\vec{u} \\cdot \\vec{v} + \\lVert \\vec{v} \\rVert^2") + " : " + M(s * s + " = " + a * a + " + 2\\,\\vec{u} \\cdot \\vec{v} + " + b * b) + ", donc " + M("\\vec{u} \\cdot \\vec{v} = " + F(v)) + ".",
          { ctx: "polarisation", guide: [GS(M(s * s + " - " + a * a + " - " + b * b) + " = ?", s * s - a * a - b * b, M(N(s * s - a * a - b * b)) + "."), GS(M("\\vec{u} \\cdot \\vec{v}") + " = ?", v, M(F(v)) + " (on divise par 2).")],
            traps: [TR(s * s - a * a - b * b, "Le double produit vaut 2 u·v : divise par 2."), TR((s - a - b) / 2, "Il faut les carrés des normes."), TR((a * a + b * b - s * s) / 2, "Isole bien u·v : " + s * s + " − " + a * a + " − " + b * b + ".")] }); },
      () => { const ab = R.int(4, 10), ah = R.int(2, 7), same = R.rand() < 0.6, v = same ? ab * ah : -ab * ah;
        return QN("Dans le triangle " + M("ABC") + ", " + M("H") + " est le projeté orthogonal de " + M("C") + " sur la droite " + M("(AB)") + ". On a " + M("AB = " + ab) + " et " + M("AH = " + ah) + ", " + (same ? M("H") + " étant sur la demi-droite " + M("[AB)") : M("H") + " et " + M("B") + " étant de part et d'autre de " + M("A")) + ". Calcule " + M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC}") + ".", v,
          M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = \\overrightarrow{AB} \\cdot \\overrightarrow{AH}") + " (projection) " + M("= " + (same ? "" : "-") + "AB" + X + "AH = " + N(v)) + (same ? " (même sens)." : " (sens contraires)."),
          { ctx: "projection", fig: figProj(ab, ah, same), guide: [GS(M("AB" + X + "AH") + " = ?", ab * ah, M(ab * ah) + "."), GS(M("\\overrightarrow{AB} \\cdot \\overrightarrow{AC}") + " = ?", v, M(N(v)) + (same ? " : même sens." : " : sens contraires, produit négatif."))],
            traps: [TR(-v, same ? "AB et AH sont de même sens : produit positif." : "AB et AH sont de sens contraires : produit négatif."), TR(ab * ab, "On projette C sur (AB) : c'est AH qui compte, pas AB²."), TR(ab + ah, "C'est un produit.")] }); },
    ],
    3: [
      () => { const A = [nz(-4, 4), nz(-4, 4)], uu = pk([[1, 2], [2, 1], [1, -1], [2, -1], [1, 3], [3, -1], [1, 1]]), t = nz(-3, 3), s = nz(-2, 2), H = [A[0] + t * uu[0], A[1] + t * uu[1]], Mp = [H[0] - s * uu[1], H[1] + s * uu[0]], AM = [Mp[0] - A[0], Mp[1] - A[1]], dot = AM[0] * uu[0] + AM[1] * uu[1], n2 = uu[0] ** 2 + uu[1] ** 2;
        return QP("La droite " + M("d") + " passe par " + M("A(" + A[0] + " \\,;\\, " + A[1] + ")") + " et a pour vecteur directeur " + M(vc(uu[0], uu[1])) + ". Donne les coordonnées du projeté orthogonal " + M("H") + " de " + M("M(" + Mp[0] + " \\,;\\, " + Mp[1] + ")") + " sur " + M("d") + " (sous la forme « x ; y »).", H,
          M("H = A + t\\vec{u}") + " avec " + M("t = \\frac{\\overrightarrow{AM} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert^2} = \\frac{" + dot + "}{" + n2 + "} = " + t) + " : " + M("H(" + H[0] + " \\,;\\, " + H[1] + ")") + ".",
          { ctx: "projete", guide: [GS(M("\\overrightarrow{AM} \\cdot \\vec{u}") + " = ?", dot, M(dot) + "."), GS(M("t") + " = ?", t, M("\\frac{" + dot + "}{" + n2 + "} = " + t) + "."), GP("Coordonnées de " + M("H") + " ?", H, M("(" + H[0] + " \\,;\\, " + H[1] + ")") + ".")],
            traps: [{ spec: { kind: "pair", values: [A[0] + dot * uu[0], A[1] + dot * uu[1]] }, m: "Il faut diviser AM · u par ‖u‖² = " + n2 + " pour obtenir t." }, { spec: { kind: "pair", values: [H[1], H[0]] }, m: "Abscisse d'abord, ordonnée ensuite." }, { spec: { kind: "pair", values: Mp }, m: "C'est le point M ; on cherche son projeté sur la droite." }] }); },
      () => { const a = R.int(2, 7), b = R.int(2, 7), p = nz(-12, 15), v = a * a + 2 * p + b * b; if (v <= 0) return null;
        return QN("On sait que " + M("\\lVert \\vec{u} \\rVert = " + a) + ", " + M("\\lVert \\vec{v} \\rVert = " + b) + " et " + M("\\vec{u} \\cdot \\vec{v} = " + N(p)) + ". Calcule " + M("\\lVert \\vec{u} + \\vec{v} \\rVert^2") + ".", v,
          M("\\lVert \\vec{u} + \\vec{v} \\rVert^2 = \\lVert \\vec{u} \\rVert^2 + 2\\,\\vec{u} \\cdot \\vec{v} + \\lVert \\vec{v} \\rVert^2 = " + a * a + " + " + NP(2 * p) + " + " + b * b + " = " + v) + ".",
          { ctx: "norme-somme", guide: [GS(M("2\\,\\vec{u} \\cdot \\vec{v}") + " = ?", 2 * p, M(N(2 * p)) + "."), GS(M("\\lVert \\vec{u} + \\vec{v} \\rVert^2") + " = ?", v, M(v) + ".")],
            traps: [TR(a * a + b * b + p, "Comme (a + b)² : le double produit est 2 u·v."), TR(a * a + b * b, "Les vecteurs ne sont pas orthogonaux : il reste 2 u·v."), TR((a + b) ** 2, "Il faut le produit scalaire, pas le produit des normes.")] }); },
      () => { const a = R.int(2, 6), b = R.int(2, 6), p = nz(-10, 10), k = pk([2, 3]), v = a * a + (k - 1) * p - k * b * b;
        return QN("On sait que " + M("\\lVert \\vec{u} \\rVert = " + a) + ", " + M("\\lVert \\vec{v} \\rVert = " + b) + " et " + M("\\vec{u} \\cdot \\vec{v} = " + N(p)) + ". Calcule " + M("(\\vec{u} + " + k + "\\vec{v}) \\cdot (\\vec{u} - \\vec{v})") + ".", v,
          "On développe : " + M("\\vec{u} \\cdot \\vec{u} - \\vec{u} \\cdot \\vec{v} + " + k + "\\,\\vec{v} \\cdot \\vec{u} - " + k + "\\,\\vec{v} \\cdot \\vec{v} = " + a * a + " + " + (k - 1) + X + NP(p) + " - " + k + X + b * b + " = " + N(v)) + ".",
          { ctx: "developper", guide: [GS("Coefficient de " + M("\\vec{u} \\cdot \\vec{v}") + " après développement ?", k - 1, M("-1 + " + k + " = " + (k - 1)) + "."), GS("Résultat ?", v, M(N(v)) + ".")],
            traps: [TR(a * a - k * b * b, "Les termes croisés ne s'annulent pas : " + (k - 1) + " u·v."), TR(a * a + (k - 1) * p - k * b, "v·v = ‖v‖² = " + b * b + "."), TR(a * a + (k + 1) * p - k * b * b, "−u·v + " + k + " v·u = " + (k - 1) + " u·v.")] }); },
    ],
  };

  // ===================== probtot =====================
  const PCTX = [
    ["M", "la personne est atteinte de la maladie", "T", "le test est positif", "On fait un test de dépistage sur une personne choisie au hasard.", "depistage", [[0.02, 0.05, 0.1, 0.15], [0.9, 0.95, 0.98, 0.99], [0.02, 0.03, 0.05, 0.1]]],
    ["W", "il pleut", "R", "Inès arrive en retard", "Inès va au lycée à vélo ou en bus selon la météo. On choisit un jour au hasard.", "retard", [[0.2, 0.25, 0.3, 0.35, 0.4], [0.2, 0.25, 0.3, 0.4], [0.05, 0.1, 0.15]]],
    ["A", "la pièce sort de l'atelier A (sinon de l'atelier B)", "D", "la pièce est défectueuse", "Une usine fabrique des pièces dans deux ateliers. On prend une pièce au hasard.", "usine", [[0.4, 0.45, 0.55, 0.6, 0.7], [0.02, 0.03, 0.04, 0.05], [0.01, 0.06, 0.08, 0.1]]],
    ["F", "le client a la carte de fidélité", "C", "le client paie sans contact", "On choisit au hasard un client d'une boulangerie.", "boulangerie", [[0.3, 0.35, 0.4, 0.45, 0.6], [0.6, 0.7, 0.75, 0.8], [0.4, 0.45, 0.5, 0.55]]],
    ["D", "le skieur est débutant", "C", "il chute dans la journée", "On interroge au hasard un skieur d'une station des Alpes.", "ski", [[0.15, 0.2, 0.25, 0.3], [0.6, 0.7, 0.75, 0.8], [0.1, 0.15, 0.2, 0.3]]],
    ["L", "l'élève est en option latin", "S", "l'élève fait partie de l'association sportive", "On choisit au hasard un élève d'un lycée de Lyon.", "lycee", [[0.1, 0.15, 0.2, 0.25], [0.3, 0.35, 0.4, 0.45], [0.2, 0.25, 0.3]]],
  ];
  
  const dP = (v) => N(rnd(v, 6));
  const ev = (c) => "Évènements : " + M(c[0]) + " « " + c[1] + " » et " + M(c[2]) + " « " + c[3] + " ». ";
  // 23.11 : la réponse ne doit pas figurer parmi les probabilités des branches de l'arbre (sinon on retire).
  const revele = (p, q, r, v) => [p, 1 - p, q, 1 - q, r, 1 - r].some((x) => Math.abs(x - v) < 1e-9);
  const PT = {
    1: [
      () => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), v = rnd(pA * pBA); if (revele(pA, pBA, pBn, v)) return null;
        return QN(c[4] + " " + ev(c) + "On a " + M("P(" + c[0] + ") = " + dP(pA)) + " et " + M("P_{" + c[0] + "}(" + c[2] + ") = " + dP(pBA)) + ". Calcule " + M("P(" + c[0] + " \\cap " + c[2] + ")") + ".", v,
          "On suit la branche " + M(c[0]) + " puis " + M(c[2]) + " : " + M("P(" + c[0] + " \\cap " + c[2] + ") = P(" + c[0] + ")" + X + "P_{" + c[0] + "}(" + c[2] + ") = " + dP(pA) + X + dP(pBA) + " = " + dP(v)) + ".",
          { ctx: c[5], fig: figTree([pA, pBA, pBn], c[0], c[2], [2, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", v, M(dP(pA) + X + dP(pBA) + " = " + dP(v)) + ".")],
            traps: [TR(rnd(pA + pBA), "Le long d'une branche, on multiplie."), TR(pBA, "P_" + c[0] + "(" + c[2] + ") est une probabilité sachant " + c[0] + " : il faut encore multiplier par P(" + c[0] + ")."), TR(rnd(pA * pBn), "Prends la branche " + c[2] + " issue de " + c[0] + ".")] }); },
      () => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), v = rnd((1 - pA) * pBn); if (revele(pA, pBA, pBn, v)) return null;
        return QN(c[4] + " " + ev(c) + "Calcule " + M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " à l'aide de l'arbre.", v,
          M("P(\\overline{" + c[0] + "}) = 1 - " + dP(pA) + " = " + dP(1 - pA)) + ", puis " + M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ") = " + dP(1 - pA) + X + dP(pBn) + " = " + dP(v)) + ".",
          { ctx: c[5], fig: figTree([pA, pBA, pBn], c[0], c[2], [3]), guide: [GS(M("P(\\overline{" + c[0] + "})") + " = ?", rnd(1 - pA), M(dP(1 - pA)) + "."), GS(M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " = ?", v, M(dP(v)) + ".")],
            traps: [TR(rnd(pA * pBn), "La branche " + c[0] + "̄ a pour probabilité 1 − " + dTxt(pA) + "."), TR(rnd((1 - pA) * pBA), "Sur la branche " + c[0] + "̄, la probabilité de " + c[2] + " est " + dTxt(pBn) + "."), TR(rnd(1 - pA + pBn), "On multiplie le long de la branche.")] }); },
      () => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), inter = rnd(pA * pBA);
        return QN(c[4] + " " + ev(c) + "On sait que " + M("P(" + c[0] + ") = " + dP(pA)) + " et " + M("P(" + c[0] + " \\cap " + c[2] + ") = " + dP(inter)) + ". Calcule " + M("P_{" + c[0] + "}(" + c[2] + ")") + ".", pBA,
          M("P_{" + c[0] + "}(" + c[2] + ") = \\frac{P(" + c[0] + " \\cap " + c[2] + ")}{P(" + c[0] + ")} = \\frac{" + dP(inter) + "}{" + dP(pA) + "} = " + dP(pBA)) + ".",
          { ctx: c[5] + "-cond", guide: [GS(M("P_{" + c[0] + "}(" + c[2] + ")") + " = ?", pBA, M("\\frac{" + dP(inter) + "}{" + dP(pA) + "} = " + dP(pBA)) + ".")],
            traps: [TR(rnd(inter * pA), "On divise par P(" + c[0] + "), on ne multiplie pas."), TR(rnd(pA / inter), "C'est P(" + c[0] + " ∩ " + c[2] + ") divisé par P(" + c[0] + ")."), TR(inter, "P(" + c[0] + " ∩ " + c[2] + ") n'est pas P_" + c[0] + "(" + c[2] + ").")] }); },
    ],
    2: [
      () => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), i1 = rnd(pA * pBA), i2 = rnd((1 - pA) * pBn), v = rnd(i1 + i2); if (revele(pA, pBA, pBn, v)) return null; if (pBA === pBn) return null;
        return QN(c[4] + " " + ev(c) + "Calcule " + M("P(" + c[2] + ")") + " (formule des probabilités totales).", v,
          M("P(" + c[2] + ") = P(" + c[0] + " \\cap " + c[2] + ") + P(\\overline{" + c[0] + "} \\cap " + c[2] + ") = " + dP(pA) + X + dP(pBA) + " + " + dP(1 - pA) + X + dP(pBn) + " = " + dP(v)) + ".",
          { ctx: c[5] + "-totales", fig: figTree([pA, pBA, pBn], c[0], c[2], [3, 4, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", i1, M(dP(i1)) + "."), GS(M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " = ?", i2, M(dP(i2)) + "."), GS(M("P(" + c[2] + ")") + " = ?", v, M(dP(v)) + ".")],
            traps: [TR(i1, "Il y a deux chemins qui mènent à " + c[2] + " : on additionne."), TR(rnd(pBA + pBn), "Chaque chemin se pondère par la première branche."), TR(rnd(pA * pBA + pA * pBn), "La deuxième branche part de " + c[0] + "̄, de probabilité " + dTxt(1 - pA) + ".")] }); },
      () => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), i1 = pA * pBA, pB = i1 + (1 - pA) * pBn, v = i1 / pB; if (revele(pA, pBA, pBn, v)) return null; if (pBA === pBn) return null;
        return QR(c[4] + " " + ev(c) + "Sachant que " + M(c[2]) + " est réalisé, quelle est la probabilité de " + M(c[0]) + " ? Calcule " + M("P_{" + c[2] + "}(" + c[0] + ")") + " (arrondi au millième).", v, 0.001,
          M("P(" + c[2] + ") = " + dP(rnd(pB))) + " (probabilités totales) puis " + M("P_{" + c[2] + "}(" + c[0] + ") = \\frac{P(" + c[0] + " \\cap " + c[2] + ")}{P(" + c[2] + ")} = \\frac{" + dP(rnd(i1)) + "}{" + dP(rnd(pB)) + "} \\approx " + N(rnd(v, 3))) + ".",
          { ctx: c[5] + "-inverse", fig: figTree([pA, pBA, pBn], c[0], c[2], [3, 4, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", rnd(i1), M(dP(rnd(i1))) + "."), GS(M("P(" + c[2] + ")") + " = ?", rnd(pB), M(dP(rnd(pB))) + "."), GR(M("P_{" + c[2] + "}(" + c[0] + ")") + " au millième ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
            traps: [TR(pBA, "C'est P_" + c[0] + "(" + c[2] + ") ; on demande l'inverse : P_" + c[2] + "(" + c[0] + ")."), TR(rnd(i1, 3), "Divise par P(" + c[2] + ")."), TR(rnd(i1 / pA, 3), "On divise par P(" + c[2] + "), l'évènement connu.")] }); },
      () => { const c = pk([["A", "Lina réussit son premier lancer franc", "B", "Lina réussit son second lancer franc", "basket"], ["A", "le bus de 7 h 40 est à l'heure", "B", "le TER de 8 h 05 est à l'heure", "transports"], ["A", "le dé rouge donne 6", "B", "la pièce donne pile", "jeu"]]), pA = pk([0.3, 0.4, 0.6, 0.7, 0.8, 0.75]), pB = pk([0.5, 0.6, 0.65, 0.85, 0.9, 0.2]), inter = rnd(pA * pB), v = rnd(pA + pB - inter);
        return QN("Les évènements " + M("A") + " « " + c[1] + " » et " + M("B") + " « " + c[3] + " » sont indépendants, avec " + M("P(A) = " + dP(pA)) + " et " + M("P(B) = " + dP(pB)) + ". Calcule " + M("P(A \\cup B)") + ".", v,
          "Indépendants : " + M("P(A \\cap B) = P(A)" + X + "P(B) = " + dP(inter)) + ". Puis " + M("P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = " + dP(v)) + ".",
          { ctx: c[4], guide: [GS(M("P(A \\cap B)") + " = ?", inter, M(dP(inter)) + "."), GS(M("P(A \\cup B)") + " = ?", v, M(dP(v)) + ".")],
            traps: [TR(rnd(pA + pB), "On a compté deux fois A ∩ B : retire-le."), TR(inter, "C'est P(A ∩ B) ; on demande la réunion."), TR(rnd(1 - inter), "P(A ∪ B) = P(A) + P(B) − P(A ∩ B).")] }); },
    ],
    3: [
      () => { const c = pk(PCTX), pA = pk(c[6][0]), pBA = pk(c[6][1]), pBn = pk(c[6][2]), pB = rnd(pA * pBA + (1 - pA) * pBn); if (pBA === pBn) return null;
        return QN(c[4] + " " + ev(c) + "On sait que " + M("P(" + c[0] + ") = " + dP(pA)) + ", " + M("P_{" + c[0] + "}(" + c[2] + ") = " + dP(pBA)) + " et " + M("P(" + c[2] + ") = " + dP(pB)) + ". Calcule " + M("P_{\\overline{" + c[0] + "}}(" + c[2] + ")") + ".", pBn,
          M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ") = P(" + c[2] + ") - P(" + c[0] + " \\cap " + c[2] + ") = " + dP(pB) + " - " + dP(rnd(pA * pBA)) + " = " + dP(rnd(pB - pA * pBA))) + ", puis on divise par " + M("P(\\overline{" + c[0] + "}) = " + dP(1 - pA)) + " : " + M(dP(pBn)) + ".",
          { ctx: c[5] + "-retrouver", fig: figTree([pA, pBA, pBn], c[0], c[2], [2, 3, 4, 5]), guide: [GS(M("P(" + c[0] + " \\cap " + c[2] + ")") + " = ?", rnd(pA * pBA), M(dP(rnd(pA * pBA))) + "."), GS(M("P(\\overline{" + c[0] + "} \\cap " + c[2] + ")") + " = ?", rnd(pB - pA * pBA), M(dP(rnd(pB - pA * pBA))) + "."), GS(M("P_{\\overline{" + c[0] + "}}(" + c[2] + ")") + " = ?", pBn, M(dP(pBn)) + ".")],
            traps: [TR(rnd(pB - pA * pBA), "C'est P(" + c[0] + "̄ ∩ " + c[2] + ") : divise par P(" + c[0] + "̄)."), TR(rnd(pB - pBA), "Utilise la formule des probabilités totales.")] }); },
      () => { const sh = pk([[0.5, 0.3, 0.2], [0.4, 0.35, 0.25], [0.6, 0.25, 0.15], [0.45, 0.35, 0.2]]), df = [pk([0.01, 0.02, 0.03]), pk([0.02, 0.04, 0.05]), pk([0.01, 0.03, 0.06])], parts = sh.map((s, i) => rnd(s * df[i])), v = rnd(parts[0] + parts[1] + parts[2]);
        return QN("Trois machines A, B, C produisent respectivement " + M(N(sh[0] * 100) + "\\,\\%") + ", " + M(N(sh[1] * 100) + "\\,\\%") + " et " + M(N(sh[2] * 100) + "\\,\\%") + " des stylos d'une usine. Leurs taux de stylos défectueux sont " + M(N(df[0] * 100) + "\\,\\%") + ", " + M(N(df[1] * 100) + "\\,\\%") + " et " + M(N(df[2] * 100) + "\\,\\%") + ". On prend un stylo au hasard : probabilité qu'il soit défectueux ?", v,
          "Probabilités totales (trois branches) : " + M(sh.map((s, i) => dP(s) + X + dP(df[i])).join(" + ") + " = " + dP(v)) + ".",
          { ctx: "trois-machines", guide: [GS("Branche A : " + M(dP(sh[0]) + X + dP(df[0])) + " = ?", parts[0], M(dP(parts[0])) + "."), GS("Branches B et C ensemble ?", rnd(parts[1] + parts[2]), M(dP(parts[1]) + " + " + dP(parts[2]) + " = " + dP(rnd(parts[1] + parts[2]))) + "."), GS("Probabilité totale ?", v, M(dP(v)) + ".")],
            traps: [TR(rnd(df[0] + df[1] + df[2]), "Chaque taux est pondéré par la part de la machine."), TR(rnd((df[0] + df[1] + df[2]) / 3), "Les machines ne produisent pas autant : pondère par leurs parts."), TR(parts[0], "Il y a trois branches à additionner.")] }); },
      () => { const p = pk([0.1, 0.2, 0.3, 0.15, 0.25, 0.4]), n = R.int(2, 4), c = pk([["Un archer touche le centre de la cible avec la probabilité", "tirs", "il touche le centre au moins une fois", "archer"], ["Un code promo est gagnant avec la probabilité", "achats", "elle gagne au moins une fois", "promo"], ["Un panneau solaire tombe en panne dans l'année avec la probabilité", "panneaux indépendants", "au moins un panneau tombe en panne", "panneaux"]]), q = rnd(1 - p), v = 1 - q ** n;
        return QR(c[0] + " " + M(dP(p)) + ". On considère " + M(n) + " " + c[1] + " (épreuves indépendantes). Probabilité que " + c[2] + " ? (au millième)", v, 0.001,
          "L'évènement contraire est « jamais » : " + M(dP(q) + "^{" + n + "}") + ". Donc " + M("P = 1 - " + dP(q) + "^{" + n + "} \\approx " + N(rnd(v, 3))) + ".",
          { ctx: c[3], guide: [GR("Probabilité de « jamais » (au millième) ?", q ** n, M(dP(q) + "^{" + n + "} \\approx " + N(rnd(q ** n, 3))) + ".", 0.001), GR("Probabilité cherchée ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
            traps: [TR(rnd(n * p, 3), "On ne peut pas additionner : passe par l'évènement contraire."), TR(rnd(p ** n, 3), "p^" + n + " : succès à chaque fois. On veut au moins un succès."), TR(rnd(1 - p ** n, 3), "Le contraire de « au moins un succès » est « aucun succès » : " + dTxt(q) + "^" + n + ".")] }); },
    ],
  };

  // ===================== vaesp =====================
  const law = (k) => { for (let t = 0; t < 200; t++) { const ps = Array.from({ length: k - 1 }, () => R.int(1, 7) * 0.05), s = rnd(ps.reduce((a, b) => a + b)); if (s < 0.95 && s > 0.3) return ps.concat(rnd(1 - s)).map((x) => rnd(x)); } return [0.2, 0.3, 0.5].slice(0, k); };
  const vals = (k) => { const s = new Set(); while (s.size < k) s.add(R.int(-5, 12)); return [...s].sort((a, b) => a - b); };
  const EXX = (xs, ps) => rnd(xs.reduce((a, x, i) => a + x * ps[i], 0));
  const VA = {
    1: [
      () => { const k = pk([3, 4]), xs = vals(k), ps = law(k), j = R.int(0, k - 1), sh = ps.map((p, i) => (i === j ? "p" : p)), s = rnd(1 - ps[j]);
        return QN("Une variable aléatoire " + M("X") + " a la loi suivante. Que vaut " + M("p") + " ?<br>" + tab(xs, sh), ps[j],
          "La somme des probabilités vaut 1 : " + M("p = 1 - " + dP(s) + " = " + dP(ps[j])) + ".",
          { ctx: "loi-manquante", guide: [GS("Somme des probabilités connues ?", s, M(dP(s)) + "."), GS(M("p") + " = ?", ps[j], M(dP(ps[j])) + ".")],
            traps: [TR(s, "La somme de toutes les probabilités vaut 1 : p = 1 − " + dTxt(s) + "."), TR(rnd(1 / k), "Les issues ne sont pas équiprobables.")] }); },
      () => { const k = pk([3, 4]), xs = vals(k), ps = law(k), E = EXX(xs, ps); if (E === 0) return null;
        return QN("Calcule l'espérance " + M("E(X)") + " de la variable aléatoire " + M("X") + " de loi :<br>" + tab(xs, ps), E,
          M("E(X) = " + xs.map((x, i) => NP(x) + X + dP(ps[i])).join(" + ") + " = " + dP(E)) + ".",
          { ctx: "esperance", guide: [GS("Produit " + M(NP(xs[0]) + X + dP(ps[0])) + " ?", rnd(xs[0] * ps[0]), M(dP(rnd(xs[0] * ps[0]))) + "."), GS(M("E(X)") + " = ?", E, M(dP(E)) + ".")],
            traps: [TR(rnd(xs.reduce((a, b) => a + b) / k), "C'est une moyenne pondérée par les probabilités."), TR(rnd(xs.reduce((a, b) => a + b)), "Multiplie chaque valeur par sa probabilité.")] }); },
      () => { const k = 4, xs = vals(k), ps = law(k), j = R.int(1, 2), op = pk(["\\leqslant", "<", ">", "\\geqslant"]), sel = xs.map((x, i) => (op === "\\leqslant" ? i <= j : op === "<" ? i < j : op === ">" ? i > j : i >= j)), v = rnd(ps.reduce((a, p, i) => a + (sel[i] ? p : 0), 0)), alt = rnd(ps.reduce((a, p, i) => a + ((op === "\\leqslant" ? i < j : op === "<" ? i <= j : op === ">" ? i >= j : i > j) ? p : 0), 0));
        return QN("Avec la loi ci-dessous, calcule " + M("P(X " + op + " " + N(xs[j]) + ")") + ".<br>" + tab(xs, ps), v,
          "On additionne les probabilités des valeurs " + M(xs.filter((x, i) => sel[i]).map(N).join(", ")) + " : " + M(dP(v)) + ".",
          { ctx: "p-x-inf", guide: [GS("Probabilité cherchée ?", v, M(ps.filter((p, i) => sel[i]).map(dP).join(" + ") + " = " + dP(v)) + ".")],
            traps: [TR(alt, op === "\\leqslant" || op === "\\geqslant" ? "Avec ⩽ ou ⩾, la valeur " + xs[j] + " est comprise." : "Inégalité stricte : la valeur " + xs[j] + " est exclue."), TR(ps[j], "On cumule plusieurs valeurs.")] }); },
    ],
    2: [
      () => { const xs = vals(3), ps = law(3), E = EXX(xs, ps), E2 = EXX(xs.map((x) => x * x), ps), V = rnd(E2 - E * E); if (V <= 0) return null;
        return QN("Calcule la variance " + M("V(X)") + " de la variable aléatoire " + M("X") + " de loi :<br>" + tab(xs, ps), V,
          M("E(X) = " + dP(E)) + ", " + M("E(X^2) = " + dP(E2)) + ", donc " + M("V(X) = E(X^2) - E(X)^2 = " + dP(E2) + " - " + NP(E) + "^2 = " + dP(V)) + ".",
          { ctx: "variance", guide: [GS(M("E(X)") + " = ?", E, M(dP(E)) + "."), GS(M("E(X^2)") + " = ?", E2, M(dP(E2)) + "."), GS(M("V(X)") + " = ?", V, M(dP(V)) + ".")],
            traps: [TR(E2, "C'est E(X²) : retire E(X)²."), TR(rnd(E2 - E), "On retire le carré de l'espérance."), TR(rnd(Math.sqrt(V), 4), "C'est l'écart type ; on demande la variance.")] }); },
      () => { const m = pk([1, 2, 3, 4, 5]), W = pk([10, 12, 15, 20]), w = pk([2, 3, 4, 5]), G = (W + 2 * w) / 6, E = G - m; if (Math.abs(E) < 1e-9) return null;
        return QN("À une kermesse, on paie " + M(m + " \\text{ €}") + " pour lancer un dé équilibré. On gagne " + M(W + " \\text{ €}") + " si le dé donne 6, " + M(w + " \\text{ €}") + " s'il donne 4 ou 5, rien sinon. " + M("G") + " est le gain algébrique (gain moins mise). Calcule " + M("E(G)") + " (fraction acceptée).", E,
          "Gains nets : " + M(N(W - m)) + " (probabilité " + M("\\frac{1}{6}") + "), " + M(N(w - m)) + " (probabilité " + M("\\frac{2}{6}") + "), " + M(N(-m)) + " (probabilité " + M("\\frac{3}{6}") + "). " + M("E(G) = \\frac{" + (W - m) + " + 2" + X + NP(w - m) + " + 3" + X + NP(-m) + "}{6} = " + F(E)) + ".",
          { ctx: "kermesse", guide: [GS("Gain net si on obtient 6 ?", W - m, M(W + " - " + m + " = " + (W - m)) + "."), GS("Gain net si on n'obtient ni 4, ni 5, ni 6 ?", -m, M(N(-m)) + "."), GS(M("E(G)") + " = ?", E, M(F(E)) + ".")],
            traps: [TR(G, "Il faut retirer la mise de " + m + " € à chaque partie."), TR((W + w) / 6 - m, "4 ou 5 : deux faces sur six."), TR((W + 2 * w - m) / 6, "La mise est payée à chaque partie, même gagnante.")] }); },
      () => { const xs = vals(3), ps = law(3), E = EXX(xs, ps), V = rnd(EXX(xs.map((x) => x * x), ps) - E * E), s = Math.sqrt(V); if (V <= 0) return null;
        return QR("Calcule l'écart type " + M("\\sigma(X)") + " (arrondi au centième) pour la loi :<br>" + tab(xs, ps), s, 0.01,
          M("V(X) = " + dP(V)) + " donc " + M("\\sigma(X) = \\sqrt{" + dP(V) + "} \\approx " + N(rnd(s, 2))) + ".",
          { ctx: "ecart-type", guide: [GS(M("E(X)") + " = ?", E, M(dP(E)) + "."), GS(M("V(X)") + " = ?", V, M(dP(V)) + "."), GR(M("\\sigma(X)") + " (au centième) ?", s, M("\\approx " + N(rnd(s, 2))) + ".", 0.01)],
            traps: [TR(rnd(V, 2), "L'écart type est la racine carrée de la variance."), TR(rnd(Math.sqrt(EXX(xs.map((x) => x * x), ps)), 2), "Retire E(X)² avant de prendre la racine.")] }); },
    ],
    3: [
      () => { const r = R.int(2, 6), b = R.int(2, 6), g = R.int(1, 4), n = r + b + g, Wr = pk([2, 3, 4, 5]), Wg = pk([10, 12, 15, 20]), m = (r * Wr + g * Wg) / n;
        return QN("Une urne contient " + M(r) + " boules rouges, " + M(b) + " bleues et " + M(g) + " vertes. On tire une boule : une rouge rapporte " + M(Wr + " \\text{ €}") + ", une verte " + M(Wg + " \\text{ €}") + ", une bleue rien. Quelle mise rend le jeu équitable (espérance du gain net nulle) ? (fraction acceptée)", m,
          "Espérance des gains : " + M("\\frac{" + r + X + Wr + " + " + g + X + Wg + "}{" + n + "} = " + F(m)) + ". Le jeu est équitable si la mise vaut " + M(F(m) + " \\text{ €}") + ".",
          { ctx: "urne-equitable", guide: [GS("Nombre total de boules ?", n, M(n) + "."), GS("Espérance du gain (sans la mise) ?", m, M(F(m)) + "."), GS("Mise équitable ?", m, M(F(m)) + " €.")],
            traps: [TR((Wr + Wg) / 3, "Pondère chaque gain par la probabilité de la couleur."), TR((Wr + Wg) / 2, "Les couleurs n'ont pas la même probabilité."), TR((r * Wr + g * Wg) / (r + g), "Il y a aussi les " + b + " boules bleues dans l'urne.")] }); },
      () => { const ps = law(3), x1 = nz(-6, 2), x2 = R.int(1, 5), a = R.int(6, 15), E = rnd(x1 * ps[0] + x2 * ps[1] + a * ps[2]); if (x2 === x1) return null;
        return QN("Une variable aléatoire " + M("X") + " a la loi ci-dessous et " + M("E(X) = " + dP(E)) + ". Calcule " + M("a") + ".<br>" + tab([x1, x2, "a"], ps), a,
          M(NP(x1) + X + dP(ps[0]) + " + " + NP(x2) + X + dP(ps[1]) + " + " + dP(ps[2]) + "a = " + dP(E)) + " donc " + M(dP(ps[2]) + "a = " + dP(rnd(E - x1 * ps[0] - x2 * ps[1]))) + " et " + M("a = " + a) + ".",
          { ctx: "valeur-inconnue", guide: [GS("Somme des deux premiers produits ?", rnd(x1 * ps[0] + x2 * ps[1]), M(dP(rnd(x1 * ps[0] + x2 * ps[1]))) + "."), GS(M(dP(ps[2]) + "a") + " = ?", rnd(E - x1 * ps[0] - x2 * ps[1]), M(dP(rnd(E - x1 * ps[0] - x2 * ps[1]))) + "."), GS(M("a") + " = ?", a, M(a) + ".")],
            traps: [TR(rnd(E - x1 * ps[0] - x2 * ps[1]), "Divise encore par " + dTxt(ps[2]) + "."), TR(rnd(E / ps[2]), "Retire d'abord les deux autres produits.")] }); },
      () => { const E = pk([4, 5, 6, 8, 12, 15]), V = pk([2, 3, 4, 5, 6]), a = pk([8, 10, 12, 15, 20]), b = pk([20, 30, 40, 50]), what = pk(["E", "V"]), v = what === "E" ? a * E - b : a * a * V;
        return QN("Le nombre " + M("X") + " de clients servis par heure dans un food-truck vérifie " + M("E(X) = " + E) + " et " + M("V(X) = " + V) + ". La recette horaire, en euros, est " + M("R = " + a + "X - " + b) + " (frais fixes déduits). Calcule " + M(what === "E" ? "E(R)" : "V(R)") + ".", v,
          what === "E" ? "Linéarité : " + M("E(aX + b) = aE(X) + b") + " : " + M("E(R) = " + a + X + E + " - " + b + " = " + v) + "." : M("V(aX + b) = a^2 V(X)") + " (une constante ne fait pas varier) : " + M("V(R) = " + a + "^2" + X + V + " = " + N(v)) + ".",
          { ctx: "lineaire-" + what, guide: what === "E" ? [GS(M(a + X + "E(X)") + " = ?", a * E, M(a * E) + "."), GS(M("E(R)") + " = ?", v, M(v) + ".")] : [GS(M(a + "^2") + " = ?", a * a, M(a * a) + "."), GS(M("V(R)") + " = ?", v, M(N(v)) + ".")],
            traps: what === "E" ? [TR(a * E, "N'oublie pas de retirer les frais fixes " + b + " €."), TR(E - b, "E(aX) = a E(X) : multiplie par " + a + ".")] : [TR(a * V, "Le coefficient s'élève au carré : a² V(X)."), TR(a * a * V - b, "Une constante ne change pas la variance."), TR(a * V - b, "V(aX + b) = a² V(X).")] }); },
    ],
  };

  // ===================== suitelim (Tle) =====================
  const QS0 = [[0.5, "\\frac{1}{2}"], [1 / 3, "\\frac{1}{3}"], [0.8, "0{,}8"], [-0.5, "-0{,}5"], [2 / 3, "\\frac{2}{3}"], [0.9, "0{,}9"]];
  const SL = {
    1: [
      () => { const a = nz(-9, 9), b = nz(-8, 8), q = pk(QS0); if (Math.abs(a) < 2) return null;
        return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + N(a) + (b < 0 ? " - " + N(-b) : " + " + N(b)) + X + "\\left(" + q[1] + "\\right)^n") + ". Quelle est la limite de " + M("(u_n)") + " ?", a,
          "Comme " + M("-1 < " + q[1] + " < 1") + ", " + M("\\lim \\left(" + q[1] + "\\right)^n = 0") + ". Donc " + M("\\lim u_n = " + N(a)) + ".",
          { ctx: "geo-limite", shownOk: true, guide: [GS(M("\\lim\\limits_{n \\to +\\infty} \\left(" + q[1] + "\\right)^n") + " = ?", 0, M(0) + " (raison entre −1 et 1)."), GS(M("\\lim u_n") + " = ?", a, M(N(a)) + ".")],
            traps: [TR(a + b, M("q^n") + " tend vers 0, pas vers 1."), TR(b, "Le terme constant " + a + " reste.")] }); },
      () => { const a = nz(-8, 9), c = R.int(2, 6), b = nz(-9, 9), d = nz(-9, 9), v = a / c; if (Math.abs(v) === 1 || Math.abs(a) < 2) return null;
        return QN("Détermine " + M("\\lim\\limits_{n \\to +\\infty} \\frac{" + pol([a, b]) + "}{" + pol([c, d]) + "}") + " (fraction acceptée).", v,
          "On factorise par " + M("n") + " : " + M("\\frac{n\\left(" + N(a) + (b < 0 ? " - " : " + ") + "\\frac{" + Math.abs(b) + "}{n}\\right)}{n\\left(" + c + (d < 0 ? " - " : " + ") + "\\frac{" + Math.abs(d) + "}{n}\\right)}") + " et " + M("\\frac{k}{n} \\to 0") + " : la limite est " + M(F(v)) + ".",
          { ctx: "quotient-affine", shownOk: true, guide: [GS("Limite de " + M("\\frac{" + N(b) + "}{n}") + " ?", 0, M(0) + "."), GS("Limite cherchée ?", v, M("\\frac{" + N(a) + "}{" + c + "} = " + F(v)) + ".")],
            traps: [TR(b / d, "Pour n grand, ce sont les termes en n qui l'emportent."), TR(a, "Le dénominateur grandit aussi."), TR(c / a, "Numérateur sur dénominateur : " + a + "/" + c + ".")] }); },
      () => { const a = nz(-7, 9), k = pk([2, 3, 4, 5]), b = nz(-20, 20); if (Math.abs(a) < 2) return null;
        return QN("Détermine la limite de " + M("u_n = \\frac{" + N(a) + X + k + "^n" + sg(b) + "}{" + k + "^n}") + ".", a,
          M("u_n = " + N(a) + (b < 0 ? " - " : " + ") + "\\frac{" + N(Math.abs(b)) + "}{" + k + "^n}") + " et " + M(k + "^n \\to +\\infty") + ", donc " + M("\\frac{" + N(Math.abs(b)) + "}{" + k + "^n} \\to 0") + " : " + M("\\lim u_n = " + N(a)) + ".",
          { ctx: "quotient-puissance", shownOk: true, guide: [GS("Limite de " + M("\\frac{" + N(b) + "}{" + k + "^n}") + " ?", 0, M(0) + "."), GS(M("\\lim u_n") + " = ?", a, M(N(a)) + ".")],
            traps: [TR(a + b, "Le terme " + b + " est divisé par " + k + "ⁿ, qui devient immense."), TR(a * k, "On simplifie par " + k + "ⁿ.")] }); },
    ],
    2: [
      () => { const q = pk([0.5, 0.2, 0.25, 0.8, 0.6, 0.75, 0.9]), l = nz(-12, 30), b = rnd(l * (1 - q)), u0 = nz(-5, 15); if (!Number.isInteger(b * 100) || u0 === l) return null;
        return QN("La suite définie par " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(q) + "u_n" + sg(b)) + " converge. Quelle est sa limite " + M("\\ell") + " ?", l,
          "La limite vérifie " + M("\\ell = " + N(q) + "\\ell" + sg(b)) + ", soit " + M(N(rnd(1 - q)) + "\\ell = " + N(b)) + " et " + M("\\ell = " + N(l)) + ".",
          { ctx: "arith-geo", guide: [GS("Coefficient de " + M("\\ell") + " après regroupement (" + M("\\ell - " + N(q) + "\\ell") + ") ?", rnd(1 - q), M(N(rnd(1 - q))) + "."), GS(M("\\ell") + " = ?", l, M(N(l)) + ".")],
            traps: [TR(b, "Résous ℓ = " + dTxt(q) + " ℓ + " + dTxt(b) + "."), TR(rnd(b / q), "On regroupe : (1 − " + dTxt(q) + ") ℓ = " + dTxt(b) + "."), TR(u0, "Le premier terme ne change pas la limite.")] }); },
      () => { const c = pk([["Une balle lâchée de", "m rebondit à chaque fois aux", "de la hauteur précédente. Quelle distance totale parcourt-elle en descente (limite de la somme des hauteurs de chute) ?", "balle"], ["Un médicament : on injecte", "mg, puis chaque jour une dose égale aux", "de la dose de la veille. Quelle quantité totale injectée à long terme (limite de la somme) ?", "doses"]]);
        const q = pk([[0.5, "\\frac{1}{2}"], [2 / 3, "\\frac{2}{3}"], [0.75, "\\frac{3}{4}"], [0.4, "\\frac{2}{5}"], [0.8, "\\frac{4}{5}"]]), h = pk([2, 3, 4, 5, 6, 10, 12]), v = h / (1 - q[0]);
        return QN(c[0] + " " + M(h) + " " + c[1] + " " + M(q[1]) + " " + c[2] + " (fraction acceptée)", v,
          "Somme géométrique : " + M(h + " + " + h + X + q[1] + " + \\dots = " + h + X + "\\frac{1 - (" + q[1] + ")^{n+1}}{1 - " + q[1] + "}") + " ; comme " + M("(" + q[1] + ")^{n+1} \\to 0") + ", la limite est " + M("\\frac{" + h + "}{1 - " + q[1] + "} = " + F(v)) + ".",
          { ctx: c[3], guide: [GS(M("1 - " + q[1]) + " = ?", rnd(1 - q[0]), M(F(1 - q[0])) + "."), GS("Limite de la somme ?", v, M(F(v)) + ".")],
            traps: [TR(h / q[0], "La limite de la somme est (premier terme)/(1 − q)."), TR(h * (1 + q[0]), "Il y a une infinité de termes qui s'ajoutent."), TR(rnd(h / (1 + q[0])), "C'est 1 − q au dénominateur.")] }); },
      () => { const a = nz(-6, 8), d = R.int(2, 5), b = nz(-9, 9), c = nz(-9, 9), e = nz(-9, 9), v = a / d; if (Math.abs(v) === 1 || Math.abs(a) < 2) return null;
        return QN("Détermine " + M("\\lim\\limits_{n \\to +\\infty} \\frac{" + pol([a, b, c]) + "}{" + pol([d, 0, e]) + "}") + " (fraction acceptée).", v,
          "On factorise par " + M("n^2") + " en haut et en bas : les termes " + M("\\frac{k}{n}") + " et " + M("\\frac{k}{n^2}") + " tendent vers 0. Limite : " + M("\\frac{" + N(a) + "}{" + d + "} = " + F(v)) + ".",
          { ctx: "quotient-carre", shownOk: true, guide: [GS("Coefficient de " + M("n^2") + " en haut ?", a, M(N(a)) + "."), GS("Limite ?", v, M(F(v)) + ".")],
            traps: [TR(b / d, "Ce sont les termes de plus haut degré (n²) qui comptent."), TR(c / e, "Termes de plus haut degré : " + a + "n² et " + d + "n²."), TR(a, "Divise par " + d + ".")] }); },
    ],
    3: [
      () => { const q = pk([0.5, 0.5, 0.25]), qT = q === 0.5 ? "\\frac{1}{2}" : "\\frac{1}{4}", l = nz(-8, 12), b = rnd(l * (1 - q)), v0 = nz(-8, 8) * (q === 0.5 ? 2 : 4), u0 = l + v0, k = R.int(3, 5), uk = l + v0 * q ** k;
        return QN("On pose " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + qT + "u_n" + sg(b)) + ". La suite " + M("v_n = u_n - " + NP(l)) + " est géométrique de raison " + M(qT) + ". Calcule " + M(u(k)) + " (valeur exacte).", uk,
          M("v_0 = " + N(u0) + " - " + NP(l) + " = " + N(v0)) + ", " + M(u(k) + " = " + N(l) + " + " + NP(v0) + X + "\\left(" + qT + "\\right)^{" + k + "} = " + F(uk)) + ".",
          { ctx: "suite-auxiliaire", guide: [GS(M("v_0") + " = ?", v0, M(N(v0)) + "."), GS(M("v_{" + k + "}") + " = ?", v0 * q ** k, M(F(v0 * q ** k)) + "."), GS(M(u(k)) + " = ?", uk, M(F(uk)) + ".")],
            traps: [TR(v0 * q ** k, "C'est v_" + k + " : u_" + k + " = v_" + k + " + " + l + "."), TR(u0 * q ** k, "C'est v_n qui est géométrique, pas u_n."), TR(l + v0 * q ** (k - 1), "Exposant " + k + " depuis v_0.")] }); },
      () => { const l = nz(-5, 10), cc = pk([2, 3, 5, 8, 10]), q = pk([0.5, 0.8, 0.9, 0.7]), eps = pk([0.01, 0.001]); let n = 0; while (cc * q ** n >= eps) n++;
        return QN("Pour tout entier naturel " + M("n") + ", " + M("u_n = " + N(l) + " + " + cc + X + N(q) + "^n") + ". La suite tend vers " + M(N(l)) + ". À partir de quel rang " + M("n") + " a-t-on " + M("u_n - " + NP(l) + " < " + N(eps)) + " ?", n,
          "On cherche le plus petit " + M("n") + " tel que " + M(cc + X + N(q) + "^n < " + N(eps)) + " (calculatrice, tableur ou boucle) : " + M(cc + X + N(q) + "^{" + (n - 1) + "} \\approx " + N(rnd(cc * q ** (n - 1), 5))) + " et " + M(cc + X + N(q) + "^{" + n + "} \\approx " + N(rnd(cc * q ** n, 5))) + " : " + M("n = " + n) + ".",
          { ctx: "seuil-limite", guide: [GR("L'écart " + M("u_n - " + NP(l)) + " vaut " + M(cc + X + N(q) + "^n") + ". Que vaut-il pour " + M("n = 10") + " (au millième) ?", cc * q ** 10, M("\\approx " + N(rnd(cc * q ** 10, 3))) + ".", 0.001), GS("Plus petit " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Pour n = " + (n - 1) + ", l'écart vaut encore environ " + dTxt(rnd(cc * q ** (n - 1), 5)) + "."), TR(n + 1, "Pour n = " + n + ", c'est déjà vrai.")] }); },
      () => { const c = pk([3, 4, 5]), a = R.int(2, c - 1), b = nz(-5, 6), v = b * c; if (Math.abs(b) === 1 && false) return null;
        return QN("Détermine la limite de " + M("u_n = \\frac{" + a + "^n" + (b < 0 ? " - " + N(-b) : " + " + N(b)) + X + c + "^{n+1}}{" + c + "^n}") + ".", v,
          M("u_n = \\left(\\frac{" + a + "}{" + c + "}\\right)^n" + sg(b) + X + c) + " ; comme " + M("0 < \\frac{" + a + "}{" + c + "} < 1") + ", le premier terme tend vers 0 : " + M("\\lim u_n = " + N(v)) + ".",
          { ctx: "croissance-comparee", guide: [GS("Limite de " + M("\\left(\\frac{" + a + "}{" + c + "}\\right)^n") + " ?", 0, M(0) + "."), GS(M(c + "^{n+1}") + " divisé par " + M(c + "^n") + " ?", c, M(c) + "."), GS(M("\\lim u_n") + " = ?", v, M(N(v)) + ".")],
            traps: [TR(b, c + "^(n+1) / " + c + "^n = " + c + " : il reste un facteur " + c + "."), TR(v + 1, "(" + a + "/" + c + ")ⁿ tend vers 0, pas vers 1.")] }); },
    ],
  };

  // ===================== binom (Tle) =====================

  const BCTX = [["Un QCM a", "questions à 4 choix ; un élève répond au hasard et a la probabilité", "de bien répondre à chacune", "bonnes réponses", "qcm", [0.25]],
    ["Un test « vrai ou faux » a", "questions ; un élève répond au hasard et a la probabilité", "de bien répondre à chacune", "bonnes réponses", "vraifaux", [0.5]],
    ["Une joueuse tire", "penalties ; elle marque avec la probabilité", "à chaque tir, indépendamment", "buts", "penalties", [0.6, 0.7, 0.75, 0.8, 0.85]],
    ["On contrôle", "smartphones d'une grande production ; chacun est défectueux avec la probabilité", "", "smartphones défectueux", "controle", [0.02, 0.05, 0.1, 0.15]],
    ["On plante", "graines ; chacune germe avec la probabilité", "", "graines qui germent", "graines", [0.6, 0.7, 0.8, 0.9]]];
  const bc = (c, n, p) => c[0] + " " + M(n) + " " + c[1] + " " + M(dP(p)) + (c[2] ? " " + c[2] : "") + ". " + M("X") + " compte le nombre de " + c[3] + " : " + M("X") + " suit la loi binomiale " + M("\\mathcal{B}(" + n + " \\,;\\, " + dP(p) + ")") + ". ";
  const BI = {
    1: [
      () => { const c = pk(BCTX), n = R.int(2, 4), p = pk(c[5]); let all = R.rand() < 0.5; if ((all ? p ** n : (1 - p) ** n) < 0.001) all = !all; /* 24.11 : jamais de probabilité minuscule (0,02⁴ = 1,6·10⁻⁷, test) */ const v = rnd(all ? p ** n : (1 - p) ** n);
        return QN(bc(c, n, p) + "Calcule " + M("P(X = " + (all ? n : 0) + ")") + ".", v,
          (all ? "Tous les essais réussis : " + M(dP(p) + "^{" + n + "} = " + dP(v)) : "Aucun succès : " + M("(1 - " + dP(p) + ")^{" + n + "} = " + dP(1 - p) + "^{" + n + "} = " + dP(v))) + ".",
          { ctx: c[4] + "-extreme", guide: [GS("Probabilité d'" + (all ? "un succès" : "un échec") + " à un essai ?", all ? p : rnd(1 - p), M(dP(all ? p : 1 - p)) + "."), GS("Probabilité cherchée ?", v, M(dP(v)) + ".")],
            traps: [TR(rnd(n * (all ? p : 1 - p)), "Les essais sont indépendants : on multiplie, on n'additionne pas."), TR(rnd(all ? (1 - p) ** n : p ** n), all ? "« X = " + n + " » : que des succès." : "« X = 0 » : aucun succès, donc que des échecs.")] }); },
      () => { const n = R.int(5, 10), k = R.int(2, Math.min(4, n - 2)), v = C(n, k), c = pk([["Combien de chemins de l'arbre d'un schéma de Bernoulli à", "épreuves comportent exactement", "succès ?", "chemins"], ["De combien de façons peut-on choisir", "élèves pour une délégation parmi", "", "delegation"], ["Combien de mains de", "cartes peut-on former avec", "cartes différentes ?", "mains"]]);
        const q = c[3] === "chemins" ? c[0] + " " + M(n) + " " + c[1] + " " + M(k) + " " + c[2] : c[3] === "delegation" ? c[0] + " " + M(k) + " " + c[1] + " " + M(n) + " ?" : c[0] + " " + M(k) + " " + c[1] + " " + M(n) + " " + c[2];
        return QN(q + " (coefficient binomial " + M("\\binom{" + n + "}{" + k + "}") + ")", v,
          M("\\binom{" + n + "}{" + k + "} = \\frac{" + Array.from({ length: k }, (_, i) => n - i).join(X) + "}{" + Array.from({ length: k }, (_, i) => k - i).join(X) + "} = " + v) + ".",
          { ctx: "binomial-" + c[3], guide: [GS("Produit " + M(Array.from({ length: k }, (_, i) => n - i).join(X)) + " ?", Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b), M(Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b)) + "."), GS("On divise par " + M(k + "!") + " : résultat ?", v, M(v) + ".")],
            traps: [TR(Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b), "L'ordre ne compte pas : divise par " + k + "!."), TR(n * k, "C'est un coefficient binomial, pas un produit n × k."), TR(C(n, k - 1), "On choisit " + k + " éléments.")] }); },
      () => { const c = pk(BCTX), n = pk([10, 20, 25, 40, 50, 100, 200]), p = pk(c[5]), v = rnd(n * p); if (!Number.isInteger(v * 10)) return null;
        return QN(bc(c, n, p) + "Calcule l'espérance " + M("E(X)") + ".", v, M("E(X) = np = " + n + X + dP(p) + " = " + N(v)) + " : en moyenne " + N(v).replace("{,}", ",") + " " + c[3] + ".",
          { ctx: c[4] + "-esperance", guide: [GS(M("E(X) = np") + " = ?", v, M(N(v)) + ".")], traps: [TR(rnd(n * (1 - p)), "C'est n × p, avec p la probabilité de succès."), TR(rnd(n * p * (1 - p)), "C'est la variance ; l'espérance vaut np.")] }); },
    ],
    2: [
      () => { const c = pk(BCTX), n = R.int(5, 10), p = pk(c[5]), k = R.int(2, n - 2), v = C(n, k) * p ** k * (1 - p) ** (n - k);
        return QR(bc(c, n, p) + "Calcule " + M("P(X = " + k + ")") + " (arrondi au millième).", v, 0.001,
          M("P(X = " + k + ") = \\binom{" + n + "}{" + k + "}" + X + dP(p) + "^{" + k + "}" + X + dP(1 - p) + "^{" + (n - k) + "} = " + C(n, k) + X + dP(p) + "^{" + k + "}" + X + dP(1 - p) + "^{" + (n - k) + "} \\approx " + N(rnd(v, 3))) + ".",
          { ctx: c[4] + "-pk", guide: [GS(M("\\binom{" + n + "}{" + k + "}") + " = ?", C(n, k), M(C(n, k)) + "."), GR(M("P(X = " + k + ")") + " au millième ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
            traps: [TR(rnd(p ** k * (1 - p) ** (n - k), 3), "Il y a " + C(n, k) + " chemins avec " + k + " succès : multiplie par le coefficient binomial."), TR(rnd(C(n, k) * p ** k, 3), "N'oublie pas les " + (n - k) + " échecs."), TR(rnd(C(n, k) * p ** (n - k) * (1 - p) ** k, 3), "p est à la puissance du nombre de succès (" + k + ").")] }); },
      () => { const c = pk(BCTX), n = R.int(3, 12), p = pk(c[5]), v = 1 - (1 - p) ** n;
        return QR(bc(c, n, p) + "Calcule " + M("P(X \\geqslant 1)") + " (arrondi au millième).", v, 0.001,
          M("P(X \\geqslant 1) = 1 - P(X = 0) = 1 - " + dP(1 - p) + "^{" + n + "} \\approx " + N(rnd(v, 3))) + ".",
          { ctx: c[4] + "-aumoins", guide: [GR(M("P(X = 0)") + " au millième ?", (1 - p) ** n, M(dP(1 - p) + "^{" + n + "} \\approx " + N(rnd((1 - p) ** n, 3))) + ".", 0.001), GR(M("P(X \\geqslant 1)") + " ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
            traps: [TR(rnd(1 - p ** n, 3), "Le contraire de « au moins un succès » est « aucun succès » : (1 − p)ⁿ."), TR(rnd((1 - p) ** n, 3), "C'est P(X = 0) ; on demande le contraire."), TR(Math.min(0.999, rnd(n * p, 3)), "On passe par l'évènement contraire.")] }); },
      () => { const c = pk(BCTX), n = pk([20, 25, 50, 80, 100, 150]), p = pk(c[5]), V = rnd(n * p * (1 - p)), s = Math.sqrt(V);
        return QR(bc(c, n, p) + "Calcule l'écart type " + M("\\sigma(X)") + " (arrondi au centième).", s, 0.01,
          M("V(X) = np(1 - p) = " + n + X + dP(p) + X + dP(1 - p) + " = " + N(V)) + " et " + M("\\sigma(X) = \\sqrt{" + N(V) + "} \\approx " + N(rnd(s, 2))) + ".",
          { ctx: c[4] + "-sigma", guide: [GS(M("V(X)") + " = ?", V, M(N(V)) + "."), GR(M("\\sigma(X)") + " au centième ?", s, M("\\approx " + N(rnd(s, 2))) + ".", 0.01)],
            traps: [TR(rnd(V, 2), "L'écart type est la racine de la variance."), TR(rnd(Math.sqrt(n * p), 2), "V(X) = np(1 − p).")] }); },
    ],
    3: [
      () => { const p = pk([0.05, 0.1, 0.15, 0.2, 0.3]), s = pk([0.9, 0.95, 0.99]); let n = 1; while (1 - (1 - p) ** n < s) n++; const c = pk([["Un jeu à gratter est gagnant avec la probabilité", "tickets", "un ticket gagnant", "grattage"], ["Une plante rare pousse dans une parcelle avec la probabilité", "parcelles", "une parcelle avec la plante", "botanique"], ["Un lancer de fléchette atteint le centre avec la probabilité", "lancers", "un lancer au centre", "flechettes"]]);
        return QN(c[0] + " " + M(dP(p)) + ", indépendamment. Combien de " + c[1] + " faut-il au minimum pour que la probabilité d'avoir au moins " + c[2] + " dépasse " + M(dP(s)) + " ?", n,
          "On cherche le plus petit " + M("n") + " tel que " + M("1 - " + dP(1 - p) + "^n \\geqslant " + dP(s)) + ", soit " + M(dP(1 - p) + "^n \\leqslant " + dP(rnd(1 - s))) + ". À la calculatrice : " + M(dP(1 - p) + "^{" + (n - 1) + "} \\approx " + N(rnd((1 - p) ** (n - 1), 4))) + ", " + M(dP(1 - p) + "^{" + n + "} \\approx " + N(rnd((1 - p) ** n, 4))) + " : " + M("n = " + n) + ".",
          { ctx: c[3], guide: [GR("Avec " + M("n") + " essais, " + M("P = 1 - " + dP(1 - p) + "^n") + ". Que vaut-elle pour " + M("n = 10") + " (au millième) ?", 1 - (1 - p) ** 10, M("\\approx " + N(rnd(1 - (1 - p) ** 10, 3))) + ".", 0.001), GS("Plus petit " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Avec " + (n - 1) + " essais, la probabilité est encore inférieure à " + dTxt(s) + "."), TR(Math.ceil(s / p), "Ce n'est pas proportionnel : passe par (1 − p)ⁿ.")] }); },
      () => { const c = pk(BCTX), n = R.int(4, 10), p = pk(c[5]), p0 = (1 - p) ** n, p1 = n * p * (1 - p) ** (n - 1), v = p0 + p1;
        return QR(bc(c, n, p) + "Calcule " + M("P(X \\leqslant 1)") + " (arrondi au millième).", v, 0.001,
          M("P(X \\leqslant 1) = P(X = 0) + P(X = 1) = " + dP(1 - p) + "^{" + n + "} + " + n + X + dP(p) + X + dP(1 - p) + "^{" + (n - 1) + "} \\approx " + N(rnd(v, 3))) + ".",
          { ctx: c[4] + "-auplus", guide: [GR(M("P(X = 0)") + " ?", p0, M("\\approx " + N(rnd(p0, 3))) + ".", 0.001), GR(M("P(X = 1)") + " ?", p1, M("\\approx " + N(rnd(p1, 3))) + ".", 0.001), GR(M("P(X \\leqslant 1)") + " ?", v, M("\\approx " + N(rnd(v, 3))) + ".", 0.001)],
            traps: [TR(rnd(p1, 3), "X ⩽ 1 comprend aussi X = 0."), TR(rnd(p0 + p * (1 - p) ** (n - 1), 3), "Il y a " + n + " façons d'avoir exactement un succès."), TR(rnd(1 - v, 3), "C'est P(X ⩾ 2), le contraire.")] }); },
      () => { const p = pk([0.6, 0.7, 0.75, 0.8, 0.4]), k = pk([2, 1]), v = rnd(3 * p ** k * (1 - p) ** (3 - k)), c = pk([["Un tireur à l'arc", "tire 3 flèches et atteint la cible avec la probabilité", "touches", "archer3"], ["Un serveur de jeux en ligne", "reçoit 3 connexions ; chacune réussit avec la probabilité", "connexions réussies", "serveur"], ["Une joueuse de tennis", "joue 3 premiers services ; chacun passe avec la probabilité", "services réussis", "tennis"]]);
        return QN(c[0] + " " + c[1] + " " + M(dP(p)) + ", indépendamment. À l'aide d'un arbre, calcule la probabilité d'obtenir exactement " + M(k) + " " + c[2] + " sur 3.", v,
          "Il y a " + M("\\binom{3}{" + k + "} = 3") + " chemins avec " + k + " succès, chacun de probabilité " + M(dP(p) + (k > 1 ? "^{" + k + "}" : "") + X + dP(1 - p) + (3 - k > 1 ? "^{" + (3 - k) + "}" : "")) + " : " + M("3" + X + dP(rnd(p ** k * (1 - p) ** (3 - k))) + " = " + dP(v)) + ".",
          { ctx: c[3], guide: [GS("Nombre de chemins avec " + k + " succès ?", 3, M(3) + "."), GS("Probabilité d'un de ces chemins ?", rnd(p ** k * (1 - p) ** (3 - k)), M(dP(rnd(p ** k * (1 - p) ** (3 - k)))) + "."), GS("Probabilité cherchée ?", v, M(dP(v)) + ".")],
            traps: [TR(rnd(p ** k * (1 - p) ** (3 - k)), "Plusieurs chemins donnent " + k + " succès : additionne-les (il y en a 3)."), TR(rnd(p ** k), "Les autres tirs sont des échecs : multiplie aussi par (1 − p)."), TR(rnd(3 * p ** (3 - k) * (1 - p) ** k), "p est à la puissance du nombre de succès.")] }); },
    ],
  };

  // ======================= Enregistrement =======================
  const DEFS = [
    { id: "suitedef", theme: "fa", label: "Suites : termes, récurrence, sens de variation", ex: "u_{n+1} = 2u_n - 3", FR: [11, 1], g: SD,
      hint: "Suite explicite : on remplace n par le rang. Récurrence : on calcule les termes un par un, en partant du premier. Sens de variation : signe de u(n+1) − u(n).",
      comps: ["Calculer des termes (explicite, récurrence)", "Modéliser, motifs, différence u(n+1) − u(n)", "Algorithme, sens de variation, conjecturer une limite"],
      lesson: ["Suites numériques", "Une suite associe un nombre \\(u_n\\) à chaque entier naturel \\(n\\) (le rang).",
        "Formule explicite \\(u_n = f(n)\\) : on calcule directement \\(u_{10}\\). Relation de récurrence \\(u_{n+1} = f(u_n)\\) et premier terme : on calcule les termes de proche en proche. La suite est croissante si \\(u_{n+1} - u_n \\geqslant 0\\) pour tout \\(n\\), décroissante si \\(u_{n+1} - u_n \\leqslant 0\\).",
        ["\\(u_n = n^2 - 3\\) : \\(u_4 = 16 - 3 = 13\\).", "\\(u_0 = 2\\), \\(u_{n+1} = 3u_n - 1\\) : \\(u_1 = 5\\), \\(u_2 = 14\\), \\(u_3 = 41\\).", "\\(u_n = n^2\\) : \\(u_{n+1} - u_n = 2n + 1 > 0\\), la suite est croissante."],
        "\\(u_{n+1}\\) n'est pas \\(u_n + 1\\) : c'est le terme suivant. Et \\(u_3\\) se calcule à partir de \\(u_2\\), pas directement depuis \\(u_0\\)."] },
    { id: "suitearith", theme: "fa", label: "Suites arithmétiques", ex: "u_n = u_0 + nr", FR: [11, 1], g: SA,
      hint: "On ajoute la raison r à chaque rang : u(n) = u(0) + n r, ou u(n) = u(1) + (n − 1) r. Deux termes connus : r = écart ÷ nombre de pas.",
      comps: ["Terme général, raison", "Retrouver u(0), le rang, la formule ; modéliser", "Seuil, comparer deux évolutions, système"],
      lesson: ["Suites arithmétiques", "Une suite arithmétique augmente (ou diminue) toujours de la même quantité : la raison \\(r\\).",
        "\\(u_{n+1} = u_n + r\\). Terme général : \\(u_n = u_0 + nr\\), et plus généralement \\(u_n = u_p + (n - p)r\\). Si \\(r > 0\\) la suite est croissante, si \\(r < 0\\) décroissante. Les points \\((n \\,;\\, u_n)\\) sont alignés : c'est le pendant discret d'une fonction affine.",
        ["\\(u_0 = 7\\), \\(r = 3\\) : \\(u_{20} = 7 + 20 \\times 3 = 67\\).", "\\(u_4 = 11\\) et \\(u_9 = 26\\) : \\(r = \\frac{26 - 11}{5} = 3\\)."],
        "Si la suite commence à \\(u_1\\), le terme de rang \\(n\\) est \\(u_1 + (n - 1)r\\) : il y a \\(n - 1\\) pas, pas \\(n\\)."] },
    { id: "suitegeo", theme: "fa", label: "Suites géométriques", ex: "u_n = u_0 \\times q^n", FR: [11, 2], g: SG,
      hint: "On multiplie par la raison q à chaque rang : u(n) = u(0) × qⁿ. Une hausse de t % donne q = 1 + t/100, une baisse q = 1 − t/100.",
      comps: ["Terme général, raison d'un taux", "Capital, décroissance, raison à partir de deux termes", "Seuil, comparer deux placements"],
      lesson: ["Suites géométriques", "Une suite géométrique est multipliée à chaque rang par le même nombre : la raison \\(q\\).",
        "\\(u_{n+1} = q \\times u_n\\). Terme général : \\(u_n = u_0 \\times q^n\\). Une évolution à taux fixe est géométrique : hausse de \\(t\\,\\%\\) → \\(q = 1 + \\frac{t}{100}\\), baisse → \\(q = 1 - \\frac{t}{100}\\). Pour \\(u_0 > 0\\) : croissante si \\(q > 1\\), décroissante si \\(0 < q < 1\\).",
        ["\\(u_0 = 3\\), \\(q = 2\\) : \\(u_5 = 3 \\times 2^5 = 96\\).", "\\(1\\,000\\) € à \\(3\\,\\%\\) par an : \\(u_{10} = 1\\,000 \\times 1{,}03^{10} \\approx 1\\,343{,}92\\) €."],
        "Augmenter de \\(3\\,\\%\\) chaque année pendant 10 ans n'est pas augmenter de \\(30\\,\\%\\) : les hausses se composent."] },
    { id: "suitesomme", theme: "fa", label: "Sommes de termes d'une suite", ex: "1 + 2 + \\dots + n = \\frac{n(n+1)}{2}", FR: [11, 2], g: SS,
      hint: "Arithmétique : nombre de termes × (premier + dernier) ÷ 2. Géométrique : 1 + q + … + qⁿ = (qⁿ⁺¹ − 1) ÷ (q − 1). Compte bien les termes.",
      comps: ["1 + 2 + … + n, somme arithmétique, 1 + q + … + qⁿ", "Pairs, impairs, gradins, somme géométrique", "Retrouver n, versements, seuil"],
      lesson: ["Sommes de termes", "Deux formules à connaître, démontrées en classe.",
        "\\(1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}\\). Pour \\(q \\ne 1\\) : \\(1 + q + q^2 + \\dots + q^n = \\frac{q^{n+1} - 1}{q - 1}\\). Somme de termes consécutifs d'une suite arithmétique : \\(\\text{nombre de termes} \\times \\frac{\\text{premier} + \\text{dernier}}{2}\\) ; d'une suite géométrique : \\(\\text{premier} \\times \\frac{1 - q^{\\text{nombre de termes}}}{1 - q}\\).",
        ["\\(1 + 2 + \\dots + 100 = \\frac{100 \\times 101}{2} = 5\\,050\\).", "\\(1 + 2 + 4 + \\dots + 2^9 = 2^{10} - 1 = 1\\,023\\)."],
        "De \\(u_0\\) à \\(u_n\\), il y a \\(n + 1\\) termes ; de \\(u_5\\) à \\(u_{20}\\), il y en a \\(16\\)."] },
    { id: "expfn", theme: "fa", label: "Fonction exponentielle : propriétés, équations", ex: "e^a \\times e^b = e^{a+b}", FR: [11, 4], g: EF,
      hint: "Produit : on ajoute les exposants ; quotient : on les soustrait ; puissance : on les multiplie. e^a = e^b ⇔ a = b ; e^a < e^b ⇔ a < b. Et e^x > 0 toujours.",
      comps: ["Propriétés algébriques, e^a = e^b", "Équations, inéquations, simplifier", "Équations du 2nd degré, signe d'un produit, modèle"],
      lesson: ["La fonction exponentielle", "\\(\\exp\\) est l'unique fonction dérivable égale à sa dérivée et qui vaut 1 en 0. On note \\(e^x\\).",
        "Pour tous réels \\(a\\), \\(b\\) : \\(e^a \\times e^b = e^{a + b}\\), \\(\\frac{e^a}{e^b} = e^{a - b}\\), \\((e^a)^n = e^{na}\\), \\(e^{-a} = \\frac{1}{e^a}\\). L'exponentielle est strictement positive et strictement croissante : \\(e^a = e^b \\iff a = b\\) et \\(e^a < e^b \\iff a < b\\).",
        ["\\(e^{3} \\times e^{-5} = e^{-2}\\).", "\\(e^{2x - 1} = e^{5} \\iff 2x - 1 = 5 \\iff x = 3\\).", "\\((x - 2)e^x > 0 \\iff x > 2\\) car \\(e^x > 0\\)."],
        "\\(e^a \\times e^b\\) n'est pas \\(e^{ab}\\) : on ajoute les exposants."] },
    { id: "pscal", theme: "es", label: "Produit scalaire", ex: "\\vec{u} \\cdot \\vec{v} = xx' + yy'", FR: [11, 3], g: PS,
      hint: "Coordonnées : xx' + yy'. Normes et angle : ‖u‖ × ‖v‖ × cos θ. Projection : AB · AC = AB · AH. Orthogonaux ⇔ produit scalaire nul.",
      comps: ["Coordonnées, normes et angle, orthogonalité", "Cosinus d'un angle, Al-Kashi, projection", "Projeté orthogonal, développer, normes"],
      lesson: ["Produit scalaire", "Le produit scalaire de deux vecteurs est un nombre.",
        "Dans un repère orthonormé : \\(\\vec{u} \\cdot \\vec{v} = xx' + yy'\\). Avec les normes : \\(\\vec{u} \\cdot \\vec{v} = \\lVert \\vec{u} \\rVert \\times \\lVert \\vec{v} \\rVert \\times \\cos(\\vec{u}, \\vec{v})\\). Si \\(H\\) est le projeté orthogonal de \\(C\\) sur \\((AB)\\) : \\(\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = \\overrightarrow{AB} \\cdot \\overrightarrow{AH}\\). \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\). Al-Kashi : \\(BC^2 = AB^2 + AC^2 - 2\\,AB \\times AC \\times \\cos\\widehat{A}\\).",
        ["\\(\\vec{u}(2 ; -1)\\), \\(\\vec{v}(3 ; 4)\\) : \\(\\vec{u} \\cdot \\vec{v} = 6 - 4 = 2\\).", "\\(\\lVert \\vec{u} \\rVert = 3\\), \\(\\lVert \\vec{v} \\rVert = 4\\), angle \\(\\frac{\\pi}{3}\\) : \\(3 \\times 4 \\times \\frac{1}{2} = 6\\)."],
        "Le produit scalaire peut être négatif (angle obtus, ou projeté de sens contraire)."] },
    { id: "probtot", theme: "no", label: "Arbres pondérés, probabilités totales", ex: "P(B) = P(A)P_A(B) + P(\\overline{A})P_{\\overline{A}}(B)", FR: [11, 6], g: PT,
      hint: "Le long d'une branche, on multiplie ; pour un évènement atteint par plusieurs chemins, on additionne. P_A(B) = P(A ∩ B) ÷ P(A).",
      comps: ["Lire un arbre pondéré, P(A ∩ B), P_A(B)", "Probabilités totales, inverser le conditionnement, indépendance", "Retrouver une branche, trois branches, au moins une fois"],
      lesson: ["Probabilités conditionnelles", "\\(P_A(B)\\) est la probabilité de \\(B\\) sachant que \\(A\\) est réalisé.",
        "\\(P_A(B) = \\frac{P(A \\cap B)}{P(A)}\\), donc \\(P(A \\cap B) = P(A) \\times P_A(B)\\) : on multiplie le long d'une branche. Formule des probabilités totales : \\(P(B) = P(A \\cap B) + P(\\overline{A} \\cap B)\\). \\(A\\) et \\(B\\) sont indépendants si \\(P(A \\cap B) = P(A) \\times P(B)\\).",
        ["\\(P(A) = 0{,}3\\), \\(P_A(B) = 0{,}8\\), \\(P_{\\overline{A}}(B) = 0{,}1\\) : \\(P(B) = 0{,}24 + 0{,}07 = 0{,}31\\).", "Puis \\(P_B(A) = \\frac{0{,}24}{0{,}31} \\approx 0{,}774\\)."],
        "\\(P_A(B)\\) et \\(P_B(A)\\) sont différentes : « malade sachant test positif » n'est pas « test positif sachant malade »."] },
    { id: "vaesp", theme: "no", label: "Variable aléatoire : loi, espérance, variance", ex: "E(X) = \\sum x_i\\,p_i", FR: [11, 7], g: VA,
      hint: "La somme des probabilités vaut 1. E(X) = somme des xᵢ pᵢ ; V(X) = E(X²) − E(X)² ; σ = √V. E(aX + b) = aE(X) + b et V(aX + b) = a²V(X).",
      comps: ["Loi, espérance, P(X ⩽ a)", "Variance, écart type, gain moyen d'un jeu", "Jeu équitable, valeur inconnue, linéarité"],
      lesson: ["Variables aléatoires", "Une variable aléatoire associe un nombre à chaque issue ; sa loi donne la probabilité de chaque valeur.",
        "Espérance : \\(E(X) = x_1 p_1 + x_2 p_2 + \\dots + x_k p_k\\) (moyenne à long terme). Variance : \\(V(X) = E(X^2) - E(X)^2\\), écart type \\(\\sigma(X) = \\sqrt{V(X)}\\). \\(E(aX + b) = aE(X) + b\\) et \\(V(aX + b) = a^2V(X)\\). Un jeu est équitable si l'espérance du gain net est nulle.",
        ["Loi \\(-2 ; 1 ; 5\\) avec \\(0{,}5 ; 0{,}3 ; 0{,}2\\) : \\(E(X) = -1 + 0{,}3 + 1 = 0{,}3\\)."],
        "Dans un jeu, le gain net retire la mise de chaque gain, même quand on gagne."] },
    { id: "suitelim", theme: "fa", label: "Limites de suites", ex: "\\lim q^n = 0 \\text{ si } -1 < q < 1", FR: [12, 0], g: SL,
      hint: "qⁿ → 0 si −1 < q < 1 ; k/n → 0. Quotient de polynômes en n : termes de plus haut degré. Suite u(n+1) = a u(n) + b qui converge : ℓ = a ℓ + b.",
      comps: ["Suites géométriques, quotients en n", "Point fixe, somme géométrique, quotients de degré 2", "Suite auxiliaire, seuil, croissances comparées"],
      lesson: ["Limites de suites", "Une suite converge vers \\(\\ell\\) si ses termes finissent par être aussi proches de \\(\\ell\\) qu'on veut.",
        "Si \\(-1 < q < 1\\), \\(q^n \\to 0\\) ; si \\(q > 1\\), \\(q^n \\to +\\infty\\). \\(\\frac{k}{n} \\to 0\\). Pour un quotient de polynômes en \\(n\\), on factorise par la plus haute puissance de \\(n\\). Si \\(u_{n+1} = au_n + b\\) converge, sa limite vérifie \\(\\ell = a\\ell + b\\). Somme géométrique (\\(|q| < 1\\)) : \\(u_0 + u_0q + u_0q^2 + \\dots \\to \\frac{u_0}{1 - q}\\).",
        ["\\(\\lim \\frac{3n + 1}{2n - 5} = \\frac{3}{2}\\).", "\\(u_{n+1} = 0{,}5u_n + 4\\) : \\(\\ell = 0{,}5\\ell + 4\\), \\(\\ell = 8\\)."],
        "\\(\\ell = a\\ell + b\\) ne prouve pas que la suite converge : il faut le savoir d'abord (monotone et bornée, ou suite auxiliaire)."] },
    { id: "binom", theme: "no", label: "Loi binomiale", ex: "P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}", FR: [12, 6], g: BI,
      hint: "X ~ B(n ; p) compte les succès de n épreuves de Bernoulli indépendantes. P(X = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ ; E(X) = np ; V(X) = np(1 − p). « Au moins un » : 1 − (1 − p)ⁿ.",
      comps: ["P(X = 0), P(X = n), coefficient binomial, espérance", "P(X = k), au moins un succès, écart type", "Seuil, P(X ⩽ 1), arbre à trois épreuves"],
      lesson: ["Loi binomiale", "On répète \\(n\\) fois, de façon indépendante, une épreuve à deux issues (succès de probabilité \\(p\\)).",
        "Le nombre \\(X\\) de succès suit la loi binomiale \\(\\mathcal{B}(n ; p)\\) : \\(P(X = k) = \\binom{n}{k}p^k(1 - p)^{n - k}\\), où \\(\\binom{n}{k}\\) compte les chemins de l'arbre à \\(k\\) succès. \\(E(X) = np\\), \\(V(X) = np(1 - p)\\). \\(P(X \\geqslant 1) = 1 - (1 - p)^n\\).",
        ["\\(\\mathcal{B}(4 ; 0{,}5)\\) : \\(P(X = 2) = 6 \\times 0{,}5^4 = 0{,}375\\).", "\\(\\mathcal{B}(50 ; 0{,}2)\\) : \\(E(X) = 10\\)."],
        "Sans le coefficient \\(\\binom{n}{k}\\), on ne compte qu'un seul chemin de l'arbre."] },
  ];
  // Rattachements FR des notions fines de gen3.js (registerFine y écrit FR: null) : tools/premiere_terminale_fr.md § 3.
  const FR_LYCEE = { f2formes: [11, 0], trinfact: [11, 0], modexp: [11, 2], trigassoc: [11, 5], compo: [12, 1], denombr: [12, 0] };
  for (const [id, fr] of Object.entries(FR_LYCEE)) { const n = NOTIONS.find((x) => x.id === id); if (n) n.FR = fr; }
  for (const d of DEFS) {
    if (NOTIONS.some((n) => n.id === d.id)) continue; // déjà créée ailleurs : on ne double pas
    NOTIONS.push({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: null, MP: null, FR: d.FR });
    GEN[d.id] = (lv) => pickForm(d.g[Math.min(Math.max(lv, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[d.id] = {};
    HINTS_EXTRA[d.id] = d.hint;
    LESSONS_EXTRA[d.id] = d.lesson;
    if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
  }
})();

// Seconde générale et technologique (France, programme 2026 : BO n° 14 du 02.04.2026), chantier du 22–23.11.
// Correspondance et choix : tools/seconde_fr.md. Ce fichier :
//  1. crée 8 notions absentes de l'app (au standard : 3 niveaux, ≥ 3 formes par niveau, pas à pas, erreurs typiques,
//     étiquette ctx ; contextes français, euros, virgule décimale, espace fine pour les milliers, × pour le produit) :
//     probcond, tabsignes, tauxevol, vect3e, fref, ineq1, proba2, algopy ;
//  2. place en seconde (FR: [10, rang]) les notions existantes qui y apparaissent, marque les reprises (againFR) et
//     masque ce que le programme 2026 a retiré (systèmes) — sans toucher aux lignes de curriculum.js ;
//  3. ajoute l'ordre et les chapitres de seconde (ORDRE.FR, ORDRE_THEME.FR, THEME_LABEL.FR), lus par Engine.refOf.
// Les notions créées ici n'existent pas en Suisse (CH: null) : rien ne change pour les élèves genevois.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const r9 = (v) => +(+v).toFixed(9);
  // Nombres à la française (22.11) : virgule, espace fine pour les milliers (1 200), jamais d'apostrophe.
  const grp = (i) => (i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : i);
  const nf = (v) => { v = r9(v); const [i, f] = String(Math.abs(v)).split("."); return (v < 0 ? "-" : "") + grp(i) + (f ? "{,}" + f : ""); };
  const nt = (v) => nf(v).replace(/\\,/g, "\u202f").replace("{,}", ",").replace(/^-/, "−");
  // Montant en euros : deux décimales si besoin (2,50 €).
  const eu = (v) => { const c = Math.round(v * 100) / 100, s = Number.isInteger(c) ? String(Math.abs(c)) : Math.abs(c).toFixed(2), [i, f] = s.split("."); return (c < 0 ? "-" : "") + grp(i) + (f ? "{,}" + f : ""); };
  const EUR = (v) => M(eu(v) + "\\ \\text{€}");
  const PC = (v) => M(nf(v) + "\\,\\%");
  const par = (v) => (v < 0 ? "(" + nf(v) + ")" : nf(v));
  // Fraction irréductible (TeX) et texte simple.
  const FT = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  const fT = (v) => { const d = den(v); if (d === 1) return nf(Math.round(v)); if (!d || d > 40) return nf(+v.toFixed(4)); return FT(Math.round(v * d), d); };
  const sg = (v) => (v < 0 ? " - " + nf(-v) : " + " + nf(v));
  const lin = (a, b) => (a === 1 ? "" : a === -1 ? "-" : nf(a)) + "x" + (b ? sg(b) : "");
  const linE = (a, b) => a + "*x" + (b < 0 ? "-" + -b : b ? "+" + b : ""); // pour Expr
  const OPT = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" };
  const IV = (ivs) => (ivs.length ? ivs.map(([a, ai, b, bi]) => (ai ? "[" : "]") + (a === -Infinity ? "-\\infty" : fT(a)) + " \\,;\\, " + (b === Infinity ? "+\\infty" : fT(b)) + (bi ? "]" : "[")).join(" \\cup ") : "\\varnothing");
  // ---------- constructeurs (même contrat que ch1c_fct.js) ----------
  const show = (spec) => (spec.kind === "pair" || spec.kind === "set" ? spec.values.map((v) => { const d = den(v); return d > 1 && d <= 40 ? Math.round(v * d) + "/" + d : String(r9(v)); }).join(" ; ") : SolSet.show(spec.ivs, false));
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => { if (!tr) return false; if (tr.e) return true;
    if (tr.spec) { let c; try { c = show(tr.spec); if (seen.has(c) || tr.spec.kind !== spec.kind || checkAnswer(tr.spec, c).status !== "correct" || checkAnswer(spec, c).status === "correct") return false; } catch (e) { return false; }
      seen.add(c); return true; }
    if (!isFinite(tr.v) || seen.has(r9(tr.v))) return false; seen.add(r9(tr.v)); return Math.abs(tr.v - spec.value) > Math.max(spec.round || 0, 1e-9); }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.fig) x.fig = o.fig; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
  const QN = (q, value, sol, o) => mk(q, Object.assign({ kind: "value", value }, o.round ? { round: o.round } : {}), sol, o);
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map((v) => String(v)).join(" ; ") }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, o);
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const TP = (vals, m) => ({ spec: { kind: "pair", values: vals }, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const TSet = (vals, m) => ({ spec: { kind: "set", values: [...new Set(vals)] }, m });
  const TR = TRAP;
  const FA = " (fraction acceptée)";
  const SETQ = " Donne l'ensemble des solutions (intervalle ou réunion d'intervalles).";
  const P = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });

  // ---------- figures (SVG dessiné en code, lisible à 360 px) ----------
  let uid = 0;
  const svg = (w, h, g, label) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
  const tx = (x, y, s, o = {}) => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + (o.cls || "f-txt") + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.size || 13) + '">' + s + "</text>";
  const ln = (x1, y1, x2, y2, cls = "f-line", extra = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '" ' + extra + "/>";
  // Quadrillage avec vecteurs : vecs = [[x0, y0, u1, u2, nom]], pts = [[x, y, nom]].
  function vecGrid(vecs, pts = [], xr = [0, 9], yr = [0, 7]) {
    const id = "fv" + ++uid, U = 30, W = (xr[1] - xr[0]) * U + 24, H = (yr[1] - yr[0]) * U + 24, X = (x) => 12 + (x - xr[0]) * U, Y = (y) => H - 12 - (y - yr[0]) * U;
    let g = '<defs><marker id="' + id + '" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" class="f-headacc"/></marker></defs>';
    for (let x = xr[0]; x <= xr[1]; x++) g += ln(X(x), Y(yr[0]), X(x), Y(yr[1]), "f-grid");
    for (let y = yr[0]; y <= yr[1]; y++) g += ln(X(xr[0]), Y(y), X(xr[1]), Y(y), "f-grid");
    vecs.forEach(([x0, y0, u1, u2, nm]) => {
      g += ln(X(x0), Y(y0), X(x0 + u1), Y(y0 + u2), "f-accent", 'stroke-width="2.6" marker-end="url(#' + id + ')"');
      const mx = (X(x0) + X(x0 + u1)) / 2, my = (Y(y0) + Y(y0 + u2)) / 2, nx = -u2, ny = u1, nn = Math.hypot(nx, ny) || 1;
      if (nm) g += tx(mx + (14 * nx) / nn, my - (14 * ny) / nn + 5, nm, { cls: "f-accent f-txt", size: 15 });
    });
    pts.forEach(([x, y, nm]) => (g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="3.5" class="f-dot"/>' + tx(X(x) + 9, Y(y) - 7, nm, { a: "start", size: 13 })));
    return svg(W, H, g, "quadrillage avec vecteurs");
  }
  // Arbre pondéré à deux niveaux : A / Ā puis B / B̄. lab = [A, B] ; p = [P(A), P_A(B), P_Ā(B)] (null = « ? »).
  function treeFig(lab, p) {
    const f = (v) => (v === null ? "?" : nt(v)), [A, B] = lab;
    const R0 = [18, 110], N1 = [[130, 55], [130, 165]], N2 = [[262, 28], [262, 82], [262, 138], [262, 192]];
    let g = '<circle cx="' + R0[0] + '" cy="' + R0[1] + '" r="4" class="f-dot"/>';
    const lb = [[A, f(p[0])], [A + "\u0305", p[0] === null ? "?" : nt(r9(1 - p[0]))]];
    N1.forEach((n, i) => { g += ln(R0[0], R0[1], n[0] - 12, n[1]) + tx(n[0], n[1] + 5, lb[i][0], { size: 15 }) + tx((R0[0] + n[0]) / 2 - 4, (R0[1] + n[1]) / 2 + (i ? 18 : -8), lb[i][1], { cls: "f-accent f-txt", size: 13 }); });
    const q = [p[1], p[2]];
    N2.forEach((n, j) => { const i = j >> 1, top = !(j & 1), v = q[i] === null ? null : top ? q[i] : r9(1 - q[i]);
      g += ln(N1[i][0] + 12, N1[i][1], n[0] - 14, n[1]) + tx(n[0], n[1] + 5, top ? B : B + "\u0305", { size: 15 }) + tx((N1[i][0] + n[0]) / 2 + 4, (N1[i][1] + n[1]) / 2 + (top ? -6 : 16), q[i] === null ? "?" : nt(v), { cls: "f-accent f-txt", size: 13 }); });
    return svg(300, 214, g, "arbre pondéré");
  }
  // Squelette de tableau de signes : facteurs [[texte, zéro, estDénominateur]] ; les signes sont à trouver.
  // signs (facultatif, figure de leçon) : une liste de signes par ligne, un par intervalle.
  function signTable(factors, last, signs) {
    const zs = [...new Set(factors.map((f) => r9(f[1])))].sort((a, b) => a - b), W = 330, c0 = 96, rh = 30, H = rh * (factors.length + 2) + 4;
    const X = (k) => c0 + 26 + ((W - c0 - 52) * (k + 1)) / (zs.length + 1);
    let g = '<rect x="2" y="2" width="' + (W - 4) + '" height="' + (H - 4) + '" class="f-line" fill="none"/>' + ln(c0, 2, c0, H - 2);
    g += tx(c0 / 2, 22, "x", { size: 14 }) + tx(c0 + 14, 22, "−∞", { size: 13 }) + tx(W - 16, 22, "+∞", { size: 13 });
    zs.forEach((z, k) => (g += tx(X(k), 22, nt(z), { size: 13 })));
    const rows = factors.map((f) => [f[0], f]).concat([[last, null]]);
    rows.forEach(([name, f], r) => {
      const y = rh * (r + 1) + 2;
      g += ln(2, y, W - 2, y) + tx(c0 / 2, y + 20, name, { size: name.length > 11 ? 11 : 13 });
      zs.forEach((z, k) => {
        if (f && Math.abs(f[1] - z) > 1e-9) return;
        const isDen = f ? f[2] : factors.some((ff) => ff[2] && Math.abs(ff[1] - z) < 1e-9);
        g += isDen ? ln(X(k) - 2, y, X(k) - 2, y + rh) + ln(X(k) + 2, y, X(k) + 2, y + rh) : tx(X(k), y + 20, "0", { size: 13 }) + ln(X(k), y, X(k), y + rh, "f-grid");
      });
      if (signs && signs[r]) signs[r].forEach((sgn, k) => (g += tx(k === 0 ? (c0 + X(0)) / 2 + 6 : k === zs.length ? (X(k - 1) + W) / 2 - 4 : (X(k - 1) + X(k)) / 2, y + 21, sgn, { cls: "f-accent f-txt", size: 16 })));
    });
    return svg(W, H, g, "tableau de signes à compléter");
  }
  // Droite graduée avec un intervalle [a ; +∞[ ou ]−∞ ; a] (crochet tourné selon l'inclusion).
  function rayFig(a, right, incl) {
    const W = 320, H = 64, x0 = a - 5, X = (x) => 20 + ((x - x0) * (W - 40)) / 10, y = 34;
    let g = ln(10, y, W - 10, y);
    for (let x = x0; x <= x0 + 10; x++) g += ln(X(x), y - 4, X(x), y + 4) + (x === a || x === x0 + 1 || x === x0 + 9 || x === 0 ? tx(X(x), y + 20, nt(x), { size: 12 }) : "");
    g += ln(X(a), y, right ? W - 12 : 12, y, "f-accent", 'stroke-width="4"');
    const open = right ? !incl : incl, d = open ? -7 : 7; // [ ou ]
    g += '<path d="M' + (X(a) + d) + "," + (y - 10) + " L" + X(a) + "," + (y - 10) + " L" + X(a) + "," + (y + 10) + " L" + (X(a) + d) + "," + (y + 10) + '" class="f-accent" stroke-width="2.6" fill="none"/>';
    return svg(W, H, g, "droite graduée");
  }

  window.FR2NDE_FIG = { vecGrid, treeFig, signTable }; // figures des rappels de cours (lessons2.js)

  // ===================== probcond : tableau croisé, probabilités conditionnelles =====================
  // Contextes : population, lieu, lettres et phrases des évènements, libellés courts (≤ 10 caractères) du tableau.
  const CROIS = [
    { pop: "élèves", lieu: "un lycée de Nantes", un: "un élève", A: "F", tA: "l'élève est une fille", rA: ["Filles", "Garçons"], B: "D", tB: "l'élève est demi-pensionnaire", cB: ["Demi-pens.", "Externes"] },
    { pop: "habitants", lieu: "une enquête menée à Lyon", un: "un habitant", A: "J", tA: "la personne a moins de 30 ans", rA: ["− de 30 ans", "30 ans et +"], B: "V", tB: "la personne se déplace à vélo", cB: ["Vélo", "Autre"] },
    { pop: "spectateurs", lieu: "un cinéma de Lille", un: "un spectateur", A: "T", tA: "le spectateur a vu le film en 3D", rA: ["3D", "2D"], B: "C", tB: "le spectateur a acheté du pop-corn", cB: ["Pop-corn", "Sans"] },
    { pop: "salariés", lieu: "une entreprise de Bordeaux", un: "un salarié", A: "C", tA: "le salarié est cadre", rA: ["Cadres", "Autres"], B: "W", tB: "le salarié télétravaille", cB: ["Télétravail", "Sur site"] },
    { pop: "clients", lieu: "une librairie de Strasbourg", un: "un client", A: "E", tA: "le client est étudiant", rA: ["Étudiants", "Autres"], B: "N", tB: "le client a acheté une BD", cB: ["BD", "Pas de BD"] },
  ];
  const crois = () => { const c = pk(CROIS), k = pk([1, 2, 5]), a = R.int(6, 30) * k, b = R.int(6, 30) * k, cc = R.int(6, 30) * k, d = R.int(6, 30) * k; return { c, a, b, cc, d, N: a + b + cc + d }; };
  const tab = (T, hide) => { const { c, a, b, cc, d, N } = T, v = { a, b, cc, d }, cell = (k) => (hide === k ? "\\boldsymbol{?}" : nf(v[k]));
    return M("\\small\\begin{array}{l|c|c|c} & \\text{" + c.cB[0] + "} & \\text{" + c.cB[1] + "} & \\text{Total} \\\\ \\hline \\text{" + c.rA[0] + "} & " + cell("a") + " & " + cell("b") + " & " + nf(a + b) + " \\\\ \\text{" + c.rA[1] + "} & " + cell("cc") + " & " + cell("d") + " & " + nf(cc + d) + " \\\\ \\hline \\text{Total} & " + nf(a + cc) + " & " + nf(b + d) + " & " + nf(N) + " \\end{array}"); };
  const evts = (c) => "On note " + M(c.A) + " l'évènement « " + c.tA + " » et " + M(c.B) + " l'évènement « " + c.tB + " ».";
  const pr = (v) => [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9].filter((x) => x !== v);
  const DEPIST = [
    ["Une maladie touche", "des personnes d'une région. Un test de dépistage est positif chez", "des malades et chez", "des personnes saines (faux positifs). Le test d'une personne prise au hasard est positif. Quelle est la probabilité qu'elle soit réellement malade ?", "malade", "test positif"],
    ["Dans un magasin de Marseille,", "des clients ont un article non payé dans leur sac. Le portique sonne pour", "de ces clients et, par erreur, pour", "des clients honnêtes. Le portique sonne. Quelle est la probabilité que le client ait vraiment un article non payé ?", "fraude", "portique sonne"],
    ["Parmi les courriels reçus par une mairie,", "sont des courriels frauduleux. Le filtre bloque", "des courriels frauduleux et, par erreur,", "des courriels normaux. Un courriel est bloqué. Quelle est la probabilité qu'il soit frauduleux ?", "frauduleux", "bloqué"],
  ];
  // 23.11 : la réponse ne doit pas figurer parmi les probabilités des branches de l'arbre (sinon on retire).
  const revele = (p, q, r, v) => [p, 1 - p, q, 1 - q, r, 1 - r].some((x) => Math.abs(x - v) < 1e-9);
  const PCOND = {
    1: [
      () => { const T = crois(), { c, a, b, N } = T, v = (a + b) / N;
        return QN("Dans " + c.lieu + ", on a interrogé " + M(nf(N)) + " " + c.pop + ". " + tab(T) + " Quelle est la fréquence des « " + c.rA[0] + " » parmi l'ensemble des " + c.pop + " ?" + FA, v, "Fréquence marginale : effectif de la ligne sur l'effectif total, " + M("\\frac{" + nf(a + b) + "}{" + nf(N) + "} = " + fT(v)) + ".",
          { ctx: "marginale", guide: [GS("Effectif total de la ligne « " + c.rA[0] + " » ?", a + b, M(nf(a) + " + " + nf(b) + " = " + nf(a + b)) + "."), GS("Fréquence : " + M("\\frac{" + nf(a + b) + "}{" + nf(N) + "}") + " = ?", v, M(fT(v)) + ".")],
            traps: [TR(a / N, "Ça, c'est la fréquence d'une seule case ; on veut toute la ligne « " + c.rA[0] + " »."), TR((a + b) / (a + T.cc), "On divise par l'effectif total " + nt(N) + ".")] }); },
      () => { const T = crois(), { c, a, b, cc, N } = T, v = a / (a + b);
        return QN("Dans " + c.lieu + ", on a interrogé " + M(nf(N)) + " " + c.pop + ". " + tab(T) + " Parmi les « " + c.rA[0] + " », quelle est la fréquence des « " + c.cB[0] + " » ?" + FA, v, "Fréquence conditionnelle : on se place dans la ligne « " + c.rA[0] + " » (" + nt(a + b) + " " + c.pop + "), " + M("\\frac{" + nf(a) + "}{" + nf(a + b) + "} = " + fT(v)) + ".",
          { ctx: "conditionnelle", guide: [GS("Combien de « " + c.rA[0] + " » en tout ?", a + b, M(nf(a + b)) + " : c'est le nouveau total."), GS("Fréquence " + M("\\frac{" + nf(a) + "}{" + nf(a + b) + "}") + " = ?", v, M(fT(v)) + ".")],
            traps: [TR(a / N, "« Parmi les " + c.rA[0] + " » : on divise par " + nt(a + b) + ", pas par l'effectif total."), TR(a / (a + cc), "Ça, c'est la fréquence des « " + c.rA[0] + " » parmi les « " + c.cB[0] + " » : l'ordre compte.")] }); },
      () => { const T = crois(), { c, a, b, cc, d } = T, k = pk(["a", "b", "cc", "d"]), v = T[k], row = k === "a" || k === "b" ? a + b : cc + d, oth = { a: b, b: a, cc: d, d: cc }[k];
        return QN("Dans " + c.lieu + ", on a interrogé " + T.N + " " + c.pop + ". Complète la case manquante du tableau croisé. " + tab(T, k), v, "Sur sa ligne, le total vaut " + M(nf(row)) + " : " + M(nf(row) + " - " + nf(oth) + " = " + nf(v)) + ".",
          { ctx: "case-manquante", guide: [GS("Total de la ligne de la case manquante ?", row, M(nf(row)) + "."), GS("Case manquante : " + M(nf(row) + " - " + nf(oth)) + " = ?", v, M(nf(v)) + ".")],
            traps: [TR(row + oth, "La case et sa voisine font le total de la ligne : on soustrait."), TR(T.N - row - oth, "Utilise le total de la ligne (ou de la colonne) de la case.")] }); },
    ],
    2: [
      () => { const T = crois(), { c, a, b, cc, N } = T, v = a / (a + b);
        return QN("Dans " + c.lieu + ", on choisit au hasard " + c.un + ". " + tab(T) + " " + evts(c) + " Calcule " + M("P_{" + c.A + "}(" + c.B + ")") + "." + FA, v, M("P_{" + c.A + "}(" + c.B + ")") + " : probabilité de " + M(c.B) + " sachant " + M(c.A) + ". On se place dans la ligne « " + c.rA[0] + " » : " + M("\\frac{" + nf(a) + "}{" + nf(a + b) + "} = " + fT(v)) + ".",
          { ctx: "pab-tableau", guide: [GS("On sait que " + M(c.A) + " est réalisé : combien de " + c.pop + " restent possibles ?", a + b, M(nf(a + b)) + " (ligne « " + c.rA[0] + " »)."), GS(M("P_{" + c.A + "}(" + c.B + ")") + " = ?", v, M("\\frac{" + nf(a) + "}{" + nf(a + b) + "} = " + fT(v)) + ".")],
            traps: [TR(a / (a + cc), "Ça, c'est " + "P_" + c.B + "(" + c.A + ") : sachant " + c.A + ", on divise par l'effectif de " + c.A + "."), TR(a / N, "Ça, c'est P(" + c.A + " ∩ " + c.B + ") : « sachant " + c.A + " » réduit l'univers à " + c.A + ".")] }); },
      () => { const c = pk(CROIS), p = pk(pr()), q = pk(pr()), r = pk(pr(q)), v = r9(p * q); if (revele(p, q, r, v)) return null;
        return QN("On choisit au hasard " + c.un + " (" + c.lieu + "). " + evts(c) + " L'arbre pondéré décrit la situation. Calcule " + M("P(" + c.A + " \\cap " + c.B + ")") + ".", v, "Produit des probabilités le long du chemin " + M(c.A) + " puis " + M(c.B) + " : " + M(nf(p) + " \\times " + nf(q) + " = " + nf(v)) + ".",
          { ctx: "arbre-inter", fig: treeFig([c.A, c.B], [p, q, r]), guide: [GS("Probabilité de la première branche, " + M("P(" + c.A + ")") + " ?", p, M(nf(p)) + "."), GS("Puis " + M("P_{" + c.A + "}(" + c.B + ")") + " ?", q, M(nf(q)) + " (branche de " + c.A + " vers " + c.B + ")."), GS("On multiplie : " + M("P(" + c.A + " \\cap " + c.B + ")") + " = ?", v, M(nf(v)) + ".")],
            traps: [TR(r9(p + q), "Le long d'un chemin, on multiplie les probabilités (on n'additionne pas)."), TR(q, "Ça, c'est P_" + c.A + "(" + c.B + ") ; il faut encore multiplier par P(" + c.A + ").")] }); },
      () => { const c = pk(CROIS), p = pk(pr()), q = pk(pr()), r = pk(pr(q)), v = r9(p * q + (1 - p) * r); if (revele(p, q, r, v)) return null;
        return QN("On choisit au hasard " + c.un + " (" + c.lieu + "). " + evts(c) + " L'arbre pondéré décrit la situation. Calcule " + M("P(" + c.B + ")") + ".", v, "Deux chemins mènent à " + M(c.B) + " (formule des probabilités totales) : " + M(nf(p) + " \\times " + nf(q) + " + " + nf(r9(1 - p)) + " \\times " + nf(r) + " = " + nf(v)) + ".",
          { ctx: "arbre-totale", fig: treeFig([c.A, c.B], [p, q, r]), guide: [GS("Chemin " + M(c.A) + " puis " + M(c.B) + " : probabilité ?", r9(p * q), M(nf(p) + " \\times " + nf(q) + " = " + nf(r9(p * q))) + "."), GS("Chemin " + M("\\bar{" + c.A + "}") + " puis " + M(c.B) + " : probabilité ?", r9((1 - p) * r), M(nf(r9(1 - p)) + " \\times " + nf(r) + " = " + nf(r9((1 - p) * r))) + "."), GS(M("P(" + c.B + ")") + " = ?", v, "On additionne les deux chemins : " + M(nf(v)) + ".")],
            traps: [TR(r9(p * q), "Il y a un second chemin qui mène à " + c.B + " : en passant par " + c.A + "̅."), TR(r9(q + r), "On multiplie le long de chaque chemin avant d'additionner."), TR(r9(q * r), "On additionne les probabilités des deux chemins.")] }); },
    ],
    3: [
      () => { const D = pk(DEPIST), p = pk([0.01, 0.02, 0.05, 0.1]), s = pk([0.9, 0.95, 0.99]), f = pk([0.02, 0.05, 0.1]), num = r9(p * s), tot = r9(p * s + (1 - p) * f), v = num / tot; if (revele(p, s, f, v)) return null;
        return QN(D[0] + " " + PC(p * 100) + " " + D[1] + " " + PC(s * 100) + " " + D[2] + " " + PC(f * 100) + " " + D[3] + " (arrondie au centième)", v, "On note M : « " + D[4] + " » et T : « " + D[5] + " ». " + M("P(M \\cap T) = " + nf(p) + " \\times " + nf(s) + " = " + nf(num)) + " ; " + M("P(T) = " + nf(num) + " + " + nf(r9(1 - p)) + " \\times " + nf(f) + " = " + nf(tot)) + " ; " + M("P_T(M) = \\frac{" + nf(num) + "}{" + nf(tot) + "} \\approx " + nf(+v.toFixed(2))) + ".",
          { ctx: "faux-positifs", round: 0.01, fig: treeFig(["M", "T"], [p, s, f]), guide: [GS(M("P(M \\cap T)") + " = ?", num, M(nf(p) + " \\times " + nf(s) + " = " + nf(num)) + "."), GS(M("P(T)") + " (deux chemins) = ?", tot, M(nf(num) + " + " + nf(r9(1 - p)) + " \\times " + nf(f) + " = " + nf(tot)) + "."), GS(M("P_T(M) = \\frac{P(M \\cap T)}{P(T)}") + " ≈ ? (au centième)", v, M("\\approx " + nf(+v.toFixed(2))) + ".", 0.01)],
            traps: [TR(s, "Ça, c'est P_M(T) (le test chez les malades). On demande l'inverse : P_T(M), malade sachant le test positif."), TR(num, "Ça, c'est P(M ∩ T) ; il faut diviser par P(T)."), TR(1 - f, "Les faux positifs comptent, mais il faut passer par P(T).")] }); },
      () => { const T = crois(), { c, a, b, cc } = T, v = a / (a + cc);
        return QN("Dans " + c.lieu + ", on choisit au hasard " + c.un + ". " + tab(T) + " " + evts(c) + " Calcule " + M("P_{" + c.B + "}(" + c.A + ")") + "." + FA, v, "Sachant " + M(c.B) + " : on se place dans la colonne « " + c.cB[0] + " » (" + nt(a + cc) + "), " + M("P_{" + c.B + "}(" + c.A + ") = \\frac{" + nf(a) + "}{" + nf(a + cc) + "} = " + fT(v)) + ".",
          { ctx: "pba-tableau", guide: [GS("« Sachant " + c.B + " » : quel est l'effectif de " + M(c.B) + " (colonne « " + c.cB[0] + " ») ?", a + cc, M(nf(a + cc)) + "."), GS(M("P_{" + c.B + "}(" + c.A + ")") + " = ?", v, M(fT(v)) + ".")],
            traps: [TR(a / (a + b), "Ça, c'est P_" + c.A + "(" + c.B + ") : ici on sait que " + c.B + " est réalisé, on divise par l'effectif de " + c.B + "."), TR(a / T.N, "Ça, c'est P(" + c.A + " ∩ " + c.B + ").")] }); },
      () => { const c = pk(CROIS), pa = pk([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]), q = pk([0.15, 0.2, 0.3, 0.35, 0.45, 0.6, 0.7]), inter = r9(pa * q), swap = R.rand() < 0.5;
        const X = swap ? c.B : c.A, Y = swap ? c.A : c.B;
        return QN("On choisit au hasard " + c.un + " (" + c.lieu + "). " + evts(c) + " On sait que " + M("P(" + X + ") = " + nf(pa)) + " et " + M("P(" + c.A + " \\cap " + c.B + ") = " + nf(inter)) + ". Calcule " + M("P_{" + X + "}(" + Y + ")") + ".", q, M("P_{" + X + "}(" + Y + ") = \\frac{P(" + c.A + " \\cap " + c.B + ")}{P(" + X + ")} = \\frac{" + nf(inter) + "}{" + nf(pa) + "} = " + nf(q)) + ".",
          { ctx: "definition", guide: [GS("Formule : " + M("P_{" + X + "}(" + Y + ") = \\frac{P(" + c.A + " \\cap " + c.B + ")}{P(" + X + ")}") + ". Calcule " + M("\\frac{" + nf(inter) + "}{" + nf(pa) + "}") + ".", q, M(nf(q)) + ".")],
            traps: [TR(r9(inter * pa), "On divise par P(" + X + ") : P(" + c.A + " ∩ " + c.B + ") = P(" + X + ") × P_" + X + "(" + Y + ")."), TR(r9(inter / (1 - pa)), "On divise par P(" + X + "), pas par P(" + X + "̅).")] }); },
    ],
  };

  // ===================== tabsignes : tableau de signes d'un produit, d'un quotient =====================
  const fval = (fs, x) => fs.reduce((p, [a, b]) => p * (a * x + b), 1);
  function signSet(nums, dens, op) {
    const zd = dens.map(([a, b]) => -b / a), cr = [...new Set(nums.concat(dens).map(([a, b]) => r9(-b / a)))].sort((u, v) => u - v), pts = [-Infinity, ...cr, Infinity];
    const isD = (x) => zd.some((z) => Math.abs(z - x) < 1e-9);
    const ok = (x) => { if (isD(x)) return false; const v = fval(nums, x) / fval(dens, x), e = Math.abs(v) < 1e-12 ? 0 : v; return op === ">" ? e > 0 : op === "<" ? e < 0 : op === ">=" ? e >= 0 : e <= 0; };
    const ivs = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const lo = pts[i], hi = pts[i + 1], mid = lo === -Infinity ? (hi === Infinity ? 0 : hi - 1) : hi === Infinity ? lo + 1 : (lo + hi) / 2;
      if (!ok(mid)) continue;
      const loIn = isFinite(lo) && ok(lo), hiIn = isFinite(hi) && ok(hi), last = ivs[ivs.length - 1];
      if (last && last[2] === lo && last[3]) { last[2] = hi; last[3] = hiIn; } else ivs.push([lo, loIn, hi, hiIn]);
    }
    return ivs;
  }
  const facT = ([a, b]) => (b === 0 ? lin(a, 0) : "(" + lin(a, b) + ")");
  const facS = ([a, b]) => lin(a, b).replace(/\{,\}/g, ",").replace(/ - /g, " − ").replace(/^-/, "−");
  const facZ = () => { const a = pk([1, 1, 1, 2, 3, -1, -2]), z = R.int(-6, 6); return [a, -a * z]; };
  const zero = ([a, b]) => r9(-b / a);
  const complement = (ivs) => { const out = []; let lo = -Infinity, li = false; for (const [a, ai, b, bi] of ivs) { if (a > lo || (a === lo && !ai && !li && isFinite(a))) out.push([lo, li, a, !ai]); lo = b; li = !bi; } if (lo < Infinity) out.push([lo, li, Infinity, false]); return out.filter(([a, , b]) => a < b); };
  const twoFac = (allowNeg) => { let f1, f2; do { f1 = facZ(); f2 = facZ(); } while (zero(f1) === zero(f2) || (!allowNeg && (f1[0] < 0 || f2[0] < 0)) || (f1[1] === 0 && f2[1] === 0)); return zero(f1) < zero(f2) ? [f1, f2] : [f2, f1]; };
  const TSIG = {
    1: [
      () => { const a = pk([2, 3, 4, 5, -2, -3, -4]), z = R.int(-7, 7) || 3, b = -a * z;
        return QN("Dans le tableau de signes de " + M("f(x) = " + lin(a, b)) + ", pour quelle valeur de " + M("x") + " le signe change-t-il ?", z, "Le signe change là où " + M("f(x) = 0") + " : " + M(lin(a, b) + " = 0 \\iff x = " + nf(z)) + ".",
          { ctx: "zero-affine", guide: [GS("On résout " + M(lin(a, b) + " = 0") + " : " + M(nf(a) + "x") + " = ?", -b, M(nf(-b)) + "."), GS(M("x") + " = ?", z, M(nf(z)) + ".")], traps: [TR(-z, "Attention au signe : " + nt(a) + "x = " + nt(-b) + "."), TR(b, "Le changement de signe a lieu en x = −b/a, pas en b.")] }); },
      () => { const a = pk([2, 3, 4, -2, -3, -1]), z = nz(-6, 6), b = -a * z, op = pk([">", "<"]), ivs = signSet([[a, b]], [], op);
        return QS("Pour quelles valeurs de " + M("x") + " a-t-on " + M(lin(a, b) + " " + OPT[op] + " 0") + " ?" + SETQ, ivs, "Zéro en " + M("x = " + nf(z)) + " ; le coefficient de " + M("x") + " est " + (a > 0 ? "positif : " + M("-") + " puis " + M("+") : "négatif : " + M("+") + " puis " + M("-")) + ". Donc " + M(IV(ivs)) + ".",
          { ctx: "signe-affine", guide: [GS("Valeur qui annule " + M(lin(a, b)) + " ?", z, M(nf(z)) + "."), GS("Signe de " + M(lin(a, b)) + " pour " + M("x") + " très grand : 1 pour « + », −1 pour « − » ?", a > 0 ? 1 : -1, "Même signe que " + M("a = " + nf(a)) + " (à droite du zéro)."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(complement(ivs), "C'est l'autre côté : regarde le signe du coefficient de x (" + nt(a) + ")."), TS(signSet([[Math.abs(a), -Math.abs(a) * z]], [], op), "Avec un coefficient négatif, les signes sont « + » puis « − ».")] }); },
      () => { const [f1, f2] = twoFac(true), z1 = zero(f1), z2 = zero(f2);
        return QSet("On veut dresser le tableau de signes de " + M("P(x) = " + facT(f1) + facT(f2)) + ". Quelles valeurs de " + M("x") + " faut-il placer dans la première ligne ? (Sépare-les par « ; ».)", [z1, z2], "Ce sont les valeurs qui annulent un facteur : " + M(facS(f1).replace(/−/g, "-") + " = 0 \\iff x = " + nf(z1)) + " et " + M(facS(f2).replace(/−/g, "-") + " = 0 \\iff x = " + nf(z2)) + ".",
          { ctx: "valeurs-ligne", guide: [GS("Zéro de " + M(lin(...f1)) + " ?", z1, M(nf(z1)) + "."), GS("Zéro de " + M(lin(...f2)) + " ?", z2, M(nf(z2)) + ".")], traps: [TSet([-z1, -z2], "Le zéro de x − a est a (et non −a)."), TSet([f1[1], f2[1]], "On cherche x tel que chaque facteur s'annule, pas les nombres de l'expression.")] }); },
    ],
    2: [
      () => { const [f1, f2] = twoFac(false), op = pk([">", "<", ">=", "<="]), ivs = signSet([f1, f2], [], op), z1 = zero(f1), z2 = zero(f2);
        return QS("Résous " + M(facT(f1) + facT(f2) + " " + OPT[op] + " 0") + " à l'aide d'un tableau de signes." + SETQ, ivs, "Zéros : " + M(nf(z1)) + " et " + M(nf(z2)) + ". Le produit est positif à l'extérieur des zéros et négatif entre eux. " + M("S = " + IV(ivs)) + ".",
          { ctx: "produit", fig: signTable([[facS(f1), z1], [facS(f2), z2]], "produit"), guide: [GS("Plus petit zéro ?", z1, M(nf(z1)) + "."), GS("Plus grand zéro ?", z2, M(nf(z2)) + "."), GS("Signe du produit entre les deux zéros : 1 pour « + », −1 pour « − » ?", -1, "Un facteur positif et un négatif : « − »."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(complement(ivs), "C'est l'ensemble contraire : le produit est négatif entre les zéros, positif à l'extérieur.")] }); },
      () => { let f1, f2; do { [f1, f2] = twoFac(true); } while (f1[0] * f2[0] > 0); const op = pk([">", "<", ">=", "<="]), ivs = signSet([f1, f2], [], op), z1 = zero(f1), z2 = zero(f2);
        return QS("Résous " + M(facT(f1) + facT(f2) + " " + OPT[op] + " 0") + "." + SETQ, ivs, "Zéros " + M(nf(z1)) + " et " + M(nf(z2)) + ". Un des coefficients de " + M("x") + " est négatif : le produit est négatif à l'extérieur des zéros, positif entre eux. " + M("S = " + IV(ivs)) + ".",
          { ctx: "produit-negatif", fig: signTable([[facS(f1), z1], [facS(f2), z2]], "produit"), guide: [GS("Le facteur de coefficient négatif est positif à gauche de son zéro. Signe du produit pour x très grand : 1 ou −1 ?", -1, "Un facteur « + », l'autre « − » : « − »."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(complement(ivs), "Attention au facteur dont le coefficient de x est négatif : son signe est « + » puis « − »."), TS(signSet([[Math.abs(f1[0]), Math.abs(f1[0]) * -z1], [Math.abs(f2[0]), Math.abs(f2[0]) * -z2]], [], op), "Avec un coefficient négatif, les signes du facteur sont inversés.")] }); },
      () => { const k = pk([1, 2, 3, -1, -2]), z = nz(-7, 7), op = pk([">", "<", ">=", "<="]), f1 = [k, 0], f2 = [1, -z], ivs = signSet([f1, f2], [], op), A = k, B = -k * z;
        return QS("Résous " + M((A === 1 ? "" : A === -1 ? "-" : A) + "x^2" + sg(B).replace(/(\d)$/, "$1x") + " " + OPT[op] + " 0") + " (factorise d'abord)." + SETQ, ivs, M((A === 1 ? "" : A === -1 ? "-" : A) + "x^2" + sg(B) + "x = " + nf(k) + "x(x" + sg(-z) + ")").replace("1x(", "x(").replace("-1x(", "-x(") + " ; zéros " + M("0") + " et " + M(nf(z)) + ". " + M("S = " + IV(ivs)) + ".",
          { ctx: "factoriser", guide: [GSet("Valeurs qui annulent l'expression (factorise par x) ?", [0, z], M("0") + " et " + M(nf(z)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(complement(ivs), "Vérifie le signe du coefficient de x² : il donne le signe à l'extérieur des zéros."), TS(signSet([[1, -z]], [], op), "On ne divise pas par x (son signe change) : on factorise et on fait un tableau de signes.")] }); },
    ],
    3: [
      () => { const [f1, f2] = twoFac(false), swap = R.rand() < 0.5, nu = swap ? f2 : f1, de = swap ? f1 : f2, op = pk([">=", "<=", ">", "<"]), ivs = signSet([nu], [de], op), zn = zero(nu), zd = zero(de);
        return QS("Résous " + M("\\frac{" + lin(...nu) + "}{" + lin(...de) + "} " + OPT[op] + " 0") + "." + SETQ, ivs, "Zéro du numérateur " + M(nf(zn)) + ", valeur interdite " + M(nf(zd)) + " (double barre, toujours exclue). Le quotient a le signe du produit. " + M("S = " + IV(ivs)) + ".",
          { ctx: "quotient", fig: signTable([[facS(nu), zn], [facS(de), zd, true]], "quotient"), guide: [GS("Valeur interdite (dénominateur nul) ?", zd, M(nf(zd)) + " : elle est toujours exclue (crochet ouvert)."), GS("Zéro du numérateur ?", zn, M(nf(zn)) + (op.length === 2 ? " : inclus, car l'inégalité est large." : " : exclu, l'inégalité est stricte.")), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(complement(ivs).map(([a, ai, b, bi]) => [a, ai && Math.abs(a - zd) > 1e-9, b, bi && Math.abs(b - zd) > 1e-9]), "C'est l'ensemble contraire : refais les signes colonne par colonne.")] }); },
      () => { let f1, f2; do { [f1, f2] = twoFac(true); } while (f1[0] * f2[0] > 0); const swap = R.rand() < 0.5, nu = swap ? f2 : f1, de = swap ? f1 : f2, op = pk([">=", "<=", ">", "<"]), ivs = signSet([nu], [de], op), zn = zero(nu), zd = zero(de);
        return QS("Résous " + M("\\frac{" + lin(...nu) + "}{" + lin(...de) + "} " + OPT[op] + " 0") + "." + SETQ, ivs, "Zéro du numérateur " + M(nf(zn)) + ", valeur interdite " + M(nf(zd)) + ". Un des coefficients de " + M("x") + " est négatif : les signes de ce facteur sont « + » puis « − ». " + M("S = " + IV(ivs)) + ".",
          { ctx: "quotient-negatif", guide: [GS("Valeur interdite ?", zd, M(nf(zd)) + "."), GS("Signe du quotient pour x très grand : 1 ou −1 ?", -1, "Un facteur « + », l'autre « − » : « − »."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(signSet([[Math.abs(nu[0]), -Math.abs(nu[0]) * zn]], [[Math.abs(de[0]), -Math.abs(de[0]) * zd]], op), "Un coefficient de x est négatif : ce facteur est positif à gauche de son zéro.")] }); },
      () => { const z = nz(-5, 5), k = pk([2, 3, 4, 5, 6]), c = pk([1, 2, -1, -2]), op = pk([">=", "<=", ">", "<"]), nu = [-c, k + c * z], de = [1, -z];
        if (nu[0] === 0 || Math.abs(zero(nu) - z) < 1e-9) return null; const ivs = signSet([nu], [de], op);
        return QS("Résous " + M("\\frac{" + k + "}{x" + sg(-z) + "} " + OPT[op] + " " + c) + " (ramène à « … " + OPT[op].replace("\\ge", "≥").replace("\\le", "≤") + " 0 »)." + SETQ, ivs, M("\\frac{" + k + "}{x" + sg(-z) + "} - " + par(c) + " = \\frac{" + lin(...nu) + "}{x" + sg(-z) + "}") + " ; zéro " + M(fT(zero(nu))) + ", valeur interdite " + M(nf(z)) + ". " + M("S = " + IV(ivs)) + ".",
          { ctx: "ramener", guide: [GS("Une seule fraction : numérateur de " + M("\\frac{" + k + "}{x" + sg(-z) + "} - " + par(c)) + ", zéro du numérateur ?" + FA, zero(nu), M(k + " - " + par(c) + "(x" + sg(-z) + ") = " + lin(...nu)) + ", nul pour " + M("x = " + fT(zero(nu))) + "."), GS("Valeur interdite ?", z, M(nf(z)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(signSet([[c, k - c * z].map((v, i) => (i ? v : v))], [], op === ">=" ? "<=" : op === "<=" ? ">=" : op === ">" ? "<" : ">"), "On ne multiplie pas par (x − " + nt(z) + ") : son signe change. On ramène tout d'un côté."), TS(signSet([[c, -k - c * z].map((v) => v)], [], op), "On ne « fait pas passer » le dénominateur : on écrit une seule fraction comparée à 0.")] }); },
    ],
  };

  // ===================== tauxevol : comparer, coefficient multiplicateur, évolutions =====================
  const TX = [3, 4, 6, 8, 12, 15, 18, 22, 35, 40, -3, -4, -6, -8, -12, -15, -18, -22, -35, -40];
  const VILLES = ["Montpellier", "Rennes", "Angers", "Dijon", "Grenoble", "Tours", "Reims", "Le Havre", "Brest", "Limoges"];
  const TAUX = {
    1: [
      () => { const t = pk(TX), cm = r9(1 + t / 100), inv = R.rand() < 0.5;
        if (inv) return QN("Multiplier une quantité par " + M(nf(cm)) + " revient à l'" + (t > 0 ? "augmenter" : "diminuer") + " de combien de pour cent ? Donne le taux d'évolution (en %, négatif pour une baisse).", t, M(nf(cm) + " = 1 " + sg(t / 100).replace(" ", "")) + " : taux " + M(nf(t) + "\\,\\%") + ".",
          { ctx: "cm-vers-taux", guide: [GS("Écart entre le coefficient et 1 : " + M(nf(cm) + " - 1") + " = ?", r9(t / 100), M(nf(r9(t / 100))) + "."), GS("En pour cent ?", t, M(nf(t) + "\\,\\%") + ".")], traps: [TR(r9(cm * 100), "Le coefficient " + nt(cm) + " correspond à " + nt(cm * 100) + " % de la valeur de départ : l'évolution, c'est l'écart avec 100 %."), TR(-t, "Coefficient " + (cm > 1 ? "plus grand" : "plus petit") + " que 1 : c'est une " + (t > 0 ? "hausse" : "baisse") + ".")] });
        return QN((t > 0 ? "Augmenter" : "Diminuer") + " une quantité de " + PC(Math.abs(t)) + " revient à la multiplier par quel nombre (coefficient multiplicateur) ?", cm, M("1 " + (t > 0 ? "+" : "-") + " \\frac{" + Math.abs(t) + "}{100} = " + nf(cm)) + ".",
          { ctx: "taux-vers-cm", guide: [GS(M(Math.abs(t) + "\\,\\%") + " en écriture décimale ?", Math.abs(t) / 100, M(nf(Math.abs(t) / 100)) + "."), GS("Coefficient multiplicateur ?", cm, M("1 " + (t > 0 ? "+" : "-") + " " + nf(Math.abs(t) / 100) + " = " + nf(cm)) + ".")], traps: [TR(Math.abs(t) / 100, "Multiplier par " + nt(Math.abs(t) / 100) + " donne " + Math.abs(t) + " % de la quantité, pas la quantité " + (t > 0 ? "augmentée" : "diminuée") + "."), TR(r9(1 - t / 100), (t > 0 ? "Hausse" : "Baisse") + " : on " + (t > 0 ? "ajoute" : "retire") + " " + nt(Math.abs(t) / 100) + " à 1.")] }); },
      () => { const S = pk([["le prix d'un ticket de tram à Strasbourg", [1.6, 2, 2.5]], ["le loyer mensuel d'un studio à Bordeaux", [400, 480, 560, 640]], ["le prix d'une baguette dans une boulangerie de Lille", [1, 1.2]], ["le prix d'un abonnement de vélo en libre-service à Paris", [20, 40, 80]]]), vd = pk(S[1]), cm = pk([1.25, 1.2, 1.5, 0.8, 0.75, 1.1, 0.9, 1.05]), va = r9(vd * cm), diff = R.rand() < 0.5;
        if (Math.abs(va * 100 - Math.round(va * 100)) > 1e-6) return null;
        return diff ? QN("En un an, " + S[0] + " passe de " + EUR(vd) + " à " + EUR(va) + ". Compare par une différence : de combien d'euros a-t-il varié ? (négatif pour une baisse)", r9(va - vd), "Variation absolue : " + M(eu(va) + " - " + eu(vd) + " = " + eu(r9(va - vd))) + " €.",
          { ctx: "difference", guide: [GS("Valeur d'arrivée moins valeur de départ ?", r9(va - vd), M(eu(r9(va - vd))) + " €.")], traps: [TR(r9(vd - va), "Variation = valeur d'arrivée − valeur de départ (négative pour une baisse)."), TR(cm, "Ça, c'est le quotient (comparaison multiplicative) ; on demande la différence.")] })
          : QN("En un an, " + S[0] + " passe de " + EUR(vd) + " à " + EUR(va) + ". Compare par un quotient : par quel nombre a-t-il été multiplié ?", cm, "Coefficient multiplicateur : " + M("\\frac{" + eu(va) + "}{" + eu(vd) + "} = " + nf(cm)) + ".",
          { ctx: "quotient", guide: [GS("Quotient " + M("\\frac{\\text{arrivée}}{\\text{départ}}") + " = ?", cm, M(nf(cm)) + (cm > 1 ? " : plus grand que 1, c'est une hausse." : " : plus petit que 1, c'est une baisse."))], traps: [TR(r9(vd / va), "On divise la valeur d'arrivée par celle de départ."), TR(r9(va - vd), "Ça, c'est la différence ; on demande le quotient.")] }); },
      () => { const v = pk(VILLES), vd = pk([12000, 25000, 40000, 48000, 64000, 75000, 150000]), t = pk([-8, -5, -4, 2, 4, 5, 6, 12, 15]), va = r9(vd * (1 + t / 100));
        return QN("La population de " + v + " (ou de son agglomération) passe de " + M(nf(vd)) + " à " + M(nf(va)) + " habitants en dix ans. Quel est le taux d'évolution, en % ? (négatif pour une baisse)", t, M("\\frac{" + nf(va) + " - " + nf(vd) + "}{" + nf(vd) + "} = \\frac{" + nf(r9(va - vd)) + "}{" + nf(vd) + "} = " + nf(t / 100)) + ", soit " + M(nf(t) + "\\,\\%") + ".",
          { ctx: "taux-deux-valeurs", guide: [GS("Variation absolue ?", r9(va - vd), M(nf(r9(va - vd)))+ " habitants."), GS("Taux en % : " + M("\\frac{" + nf(r9(va - vd)) + "}{" + nf(vd) + "} \\times 100") + " = ?", t, M(nf(t) + "\\,\\%") + ".")], traps: [TR(r9(va - vd), "Ça, c'est la variation absolue ; le taux la divise par la valeur de départ."), TR(r9(((va - vd) / va) * 100), "On divise par la valeur de DÉPART " + nt(vd) + ".")] }); },
    ],
    2: [
      () => { const t1 = pk([10, 20, 25, 30, 50]), t2 = pk([-10, -20, -40, -50, 10, 20]), g = r9(((1 + t1 / 100) * (1 + t2 / 100) - 1) * 100), S = pk(["Le prix d'un vélo électrique", "Le nombre d'abonnés d'une médiathèque de Caen", "Le prix d'un billet de TER", "Le chiffre d'affaires d'une crêperie de Quimper"]);
        if (g === 0) return null;
        return QN(S + " " + (t1 > 0 ? "augmente" : "baisse") + " de " + PC(t1) + ", puis " + (t2 > 0 ? "augmente" : "baisse") + " de " + PC(Math.abs(t2)) + ". Quel est le taux d'évolution global, en % ? (négatif pour une baisse)", g, "On multiplie les coefficients : " + M(nf(1 + t1 / 100) + " \\times " + nf(r9(1 + t2 / 100)) + " = " + nf(r9(1 + g / 100))) + ", soit " + M(nf(g) + "\\,\\%") + ".",
          { ctx: "successives", guide: [GS("Coefficient de la 1re évolution ?", r9(1 + t1 / 100), M(nf(r9(1 + t1 / 100))) + "."), GS("Coefficient de la 2e ?", r9(1 + t2 / 100), M(nf(r9(1 + t2 / 100))) + "."), GS("Coefficient global (produit) ?", r9(1 + g / 100), M(nf(r9(1 + g / 100))) + "."), GS("Taux global en % ?", g, M(nf(g) + "\\,\\%") + ".")], traps: [TR(t1 + t2, "Les pourcentages successifs ne s'additionnent pas : on multiplie les coefficients."), TR(r9((1 + t1 / 100) * (1 + t2 / 100) * 100), "Le coefficient global " + nt(r9(1 + g / 100)) + " correspond à une évolution de " + nt(g) + " %.")] }); },
      () => { const p1 = pk([40, 45, 50, 60, 70, 80]), p2 = pk([15, 20, 25, 30, 35, 40]), v = r9((p1 * p2) / 100), S = pk([["des élèves d'un lycée de Rennes sont des filles", "d'entre elles font partie de l'association sportive", "des élèves sont des filles inscrites à l'association sportive"], ["des clients d'un supermarché de Nancy paient par carte", "d'entre eux paient sans contact", "des clients paient par carte sans contact"], ["des habitants d'un village du Jura ont un vélo", "d'entre eux ont un vélo électrique", "des habitants ont un vélo électrique"]]);
        return QN(M(p1 + "\\,\\%") + " " + S[0] + " et " + M(p2 + "\\,\\%") + " " + S[1] + ". Quel pourcentage " + S[2] + " ?", v, "Proportion d'une proportion : " + M("\\frac{" + p1 + "}{100} \\times \\frac{" + p2 + "}{100} = " + nf(v / 100)) + ", soit " + M(nf(v) + "\\,\\%") + ".",
          { ctx: "pourcentage-de-pourcentage", guide: [GS("En décimal : " + M(nf(p1 / 100) + " \\times " + nf(p2 / 100)) + " = ?", r9(v / 100), M(nf(r9(v / 100)))+ "."), GS("En pour cent ?", v, M(nf(v) + "\\,\\%") + ".")], traps: [TR(p2, "Les " + p2 + " % sont pris « parmi » un groupe, pas parmi tout le monde."), TR(p1 + p2, "Un pourcentage de pourcentage se multiplie.")] }); },
      () => { const t = pk([20, 25, -20, -25, 5, -10, 50, -40]), cm = r9(1 + t / 100), vd = pk([80, 120, 160, 240, 360, 400, 640]), va = r9(vd * cm), S = pk(["une trottinette", "un forfait de ski à Chamonix", "une console de jeux", "une nuit d'hôtel à Annecy"]);
        if (Math.abs(va * 100 - Math.round(va * 100)) > 1e-6) return null;
        return QN("Après " + (t > 0 ? "une hausse" : "une baisse") + " de " + PC(Math.abs(t)) + ", le prix d'" + S + " est de " + EUR(va) + ". Quel était le prix avant " + (t > 0 ? "la hausse" : "la baisse") + " (en €) ?", vd, "Prix initial × " + M(nf(cm)) + " = " + M(eu(va)) + ", donc prix initial " + M("= \\frac{" + eu(va) + "}{" + nf(cm) + "} = " + eu(vd)) + " €.",
          { ctx: "valeur-initiale", guide: [GS("Coefficient multiplicateur ?", cm, M(nf(cm)) + "."), GS("On divise : " + M("\\frac{" + eu(va) + "}{" + nf(cm) + "}") + " = ?", vd, M(eu(vd)) + " €.")], traps: [TR(r9(va * (1 - t / 100)), "On ne retire pas " + Math.abs(t) + " % du nouveau prix : le pourcentage porte sur l'ancien. On divise par le coefficient."), TR(r9(va * cm), "On divise par le coefficient (on remonte l'évolution).")] }); },
    ],
    3: [
      () => { const [t, r] = pk([[25, -20], [100, -50], [-20, 25], [-50, 100], [60, -37.5], [150, -60], [-75, 300], [300, -75], [-60, 150], [-37.5, 60]]);
        return QN("Le prix d'une action a " + (t > 0 ? "augmenté" : "baissé") + " de " + PC(Math.abs(t)) + ". Quel taux d'évolution le ramènerait à sa valeur de départ ? (taux réciproque, en %, négatif pour une baisse)", r, "Coefficient " + M(nf(r9(1 + t / 100))) + " ; coefficient réciproque " + M("\\frac{1}{" + nf(r9(1 + t / 100)) + "} = " + nf(r9(1 + r / 100))) + " : taux " + M(nf(r) + "\\,\\%") + ".",
          { ctx: "reciproque", guide: [GS("Coefficient de l'évolution ?", r9(1 + t / 100), M(nf(r9(1 + t / 100))) + "."), GS("Coefficient réciproque (l'inverse) ?", r9(1 + r / 100), M(nf(r9(1 + r / 100))) + "."), GS("Taux réciproque en % ?", r, M(nf(r) + "\\,\\%") + ".")], traps: [TR(-t, "Une baisse de " + Math.abs(t) + " % ne compense pas une hausse de " + Math.abs(t) + " % : le pourcentage ne porte pas sur la même valeur.")] }); },
      () => { const t = pk([2, 3, 4, 5, -2, -3, -5]), n = R.int(3, 6), g = (Math.pow(1 + t / 100, n) - 1) * 100;
        return QN("Le nombre d'élèves d'un collège de Toulouse " + (t > 0 ? "augmente" : "baisse") + " de " + PC(Math.abs(t)) + " par an pendant " + n + " ans. Quel est le taux d'évolution global, en % (arrondi au dixième, négatif pour une baisse) ?", g, "Coefficient global " + M(nf(r9(1 + t / 100)) + "^{" + n + "} \\approx " + nf(+(1 + g / 100).toFixed(4))) + ", soit environ " + M(nf(+g.toFixed(1)) + "\\,\\%") + ".",
          { ctx: "repetees", round: 0.1, guide: [GS("Coefficient annuel ?", r9(1 + t / 100), M(nf(r9(1 + t / 100))) + "."), GS("Coefficient global " + M(nf(r9(1 + t / 100)) + "^{" + n + "}") + " (au dix-millième) ?", +(1 + g / 100).toFixed(4), M("\\approx " + nf(+(1 + g / 100).toFixed(4))) + ".", 0.0001), GS("Taux global en % (au dixième) ?", g, M("\\approx " + nf(+g.toFixed(1)) + "\\,\\%") + ".", 0.1)],
            traps: [TR(n * t, "On n'additionne pas " + n + " fois " + t + " % : on multiplie " + n + " fois par " + nt(r9(1 + t / 100)) + "."), TR(+((Math.pow(1 + t / 100, n - 1) - 1) * 100).toFixed(1), "Il y a " + n + " évolutions, donc la puissance " + n + ".")] }); },
      () => { const t1 = pk([25, 20, -20, 60, 50]), cm2 = pk([0.72, 0.8, 0.9, 1.2, 1.25, 0.75]), g = r9(((1 + t1 / 100) * cm2 - 1) * 100), t2 = r9((cm2 - 1) * 100);
        if (Math.abs(g * 10 - Math.round(g * 10)) > 1e-6 || g === 0 || t2 === -t1) return null;
        return QN("Le prix d'un panier de fruits au marché de Nice " + (t1 > 0 ? "augmente" : "baisse") + " de " + PC(Math.abs(t1)) + " en juin, puis évolue encore en juillet. Sur les deux mois, l'évolution globale est de " + PC(g) + ". Quel est le taux d'évolution de juillet, en % ? (négatif pour une baisse)", t2, "Coefficient global " + M(nf(r9(1 + g / 100))) + " ; coefficient de juillet " + M("\\frac{" + nf(r9(1 + g / 100)) + "}{" + nf(r9(1 + t1 / 100)) + "} = " + nf(cm2)) + ", soit " + M(nf(t2) + "\\,\\%") + ".",
          { ctx: "taux-inconnu", guide: [GS("Coefficient global ?", r9(1 + g / 100), M(nf(r9(1 + g / 100))) + "."), GS("Coefficient de juillet " + M("\\frac{" + nf(r9(1 + g / 100)) + "}{" + nf(r9(1 + t1 / 100)) + "}") + " = ?", cm2, M(nf(cm2)) + "."), GS("Taux de juillet en % ?", t2, M(nf(t2) + "\\,\\%") + ".")], traps: [TR(r9(g - t1), "On ne soustrait pas les pourcentages : on divise les coefficients.")] }); },
    ],
  };

  // ===================== vect3e : vecteurs et coordonnées (seconde) =====================
  const PN = (x, y, n) => M(n + "(" + nf(x) + " \\,;\\, " + nf(y) + ")");
  const VC = (n, u) => M("\\vec{" + n + "}\\begin{pmatrix} " + nf(u[0]) + " \\\\ " + nf(u[1]) + " \\end{pmatrix}");
  const VB = (n) => "\\overrightarrow{" + n + "}";
  const PAIRQ = " Réponds « x ; y ».";
  const VECT = {
    1: [
      () => { let u1, u2, x0, y0; do { u1 = nz(-5, 5); u2 = nz(-4, 4); x0 = R.int(0, 8); y0 = R.int(0, 6); } while (x0 + u1 < 0 || x0 + u1 > 8 || y0 + u2 < 0 || y0 + u2 > 6 || Math.abs(u1) === Math.abs(u2));
        return QP("Lis les coordonnées du vecteur " + M("\\vec{u}") + " dessiné sur le quadrillage (une case = une unité)." + PAIRQ, [u1, u2], "De l'origine à l'extrémité de la flèche : " + M(nf(u1)) + " horizontalement, " + M(nf(u2)) + " verticalement : " + M("\\vec{u}\\begin{pmatrix} " + u1 + " \\\\ " + u2 + " \\end{pmatrix}") + ".",
          { ctx: "lire", fig: vecGrid([[x0, y0, u1, u2, "u"]], [], [0, 8], [0, 6]), guide: [GS("Déplacement horizontal (vers la droite : positif) ?", u1, M(nf(u1)) + "."), GS("Déplacement vertical (vers le haut : positif) ?", u2, M(nf(u2)) + ".")], traps: [TP([u2, u1], "D'abord l'abscisse (horizontal), puis l'ordonnée (vertical)."), TP([-u1, -u2], "On part de l'origine de la flèche vers sa pointe."), TP([x0 + u1, y0 + u2], "Ce sont les coordonnées de la pointe ; un vecteur, c'est un déplacement.")] }); },
      () => { const A = [R.int(-6, 6), R.int(-6, 6)], B = [R.int(-6, 6), R.int(-6, 6)], u = [B[0] - A[0], B[1] - A[1]]; if (!u[0] || !u[1]) return null;
        return QP("On donne " + PN(A[0], A[1], "A") + " et " + PN(B[0], B[1], "B") + ". Calcule les coordonnées du vecteur " + M(VB("AB")) + "." + PAIRQ, u, M(VB("AB") + "\\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix} = \\begin{pmatrix} " + nf(B[0]) + " - " + par(A[0]) + " \\\\ " + nf(B[1]) + " - " + par(A[1]) + " \\end{pmatrix} = \\begin{pmatrix} " + u[0] + " \\\\ " + u[1] + " \\end{pmatrix}") + ".",
          { ctx: "ab", guide: [GS(M("x_B - x_A") + " = ?", u[0], M(nf(B[0]) + " - " + par(A[0]) + " = " + u[0]) + "."), GS(M("y_B - y_A") + " = ?", u[1], M(u[1]) + ".")], traps: [TP([-u[0], -u[1]], "C'est " + "BA" + " : pour AB, on fait « arrivée − départ », B − A."), TP([A[0] + B[0], A[1] + B[1]], "On soustrait les coordonnées (B − A), on ne les additionne pas.")] }); },
      () => { const u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], w = [u[0] + v[0], u[1] + v[1]]; if (!w[0] || !w[1]) return null; const [P, Q, S] = pk([["A", "B", "C"], ["E", "F", "G"], ["R", "S", "T"]]);
        return QP("On sait que " + M(VB(P + Q) + "\\begin{pmatrix} " + u[0] + " \\\\ " + u[1] + " \\end{pmatrix}") + " et " + M(VB(Q + S) + "\\begin{pmatrix} " + v[0] + " \\\\ " + v[1] + " \\end{pmatrix}") + ". Calcule les coordonnées de " + M(VB(P + S)) + "." + PAIRQ, w, "Relation de Chasles : " + M(VB(P + S) + " = " + VB(P + Q) + " + " + VB(Q + S)) + ", donc " + M("\\begin{pmatrix} " + u[0] + " + " + par(v[0]) + " \\\\ " + u[1] + " + " + par(v[1]) + " \\end{pmatrix} = \\begin{pmatrix} " + w[0] + " \\\\ " + w[1] + " \\end{pmatrix}") + ".",
          { ctx: "chasles", guide: [GS("Chasles : " + M(VB(P + S) + " = " + VB(P + Q) + " + " + VB(Q + S)) + ". Abscisse ?", w[0], M(u[0] + " + " + par(v[0]) + " = " + w[0]) + "."), GS("Ordonnée ?", w[1], M(w[1]) + ".")], traps: [TP([u[0] - v[0], u[1] - v[1]], "Chasles : on additionne " + P + Q + " et " + Q + S + "."), TP([v[0] - u[0], v[1] - u[1]], "On additionne les deux vecteurs (pas de soustraction).")] }); },
    ],
    2: [
      () => { const u = [nz(-5, 5), nz(-5, 5)], v = [nz(-5, 5), nz(-5, 5)], k = pk([2, 3, -2, -3]), m = pk([1, -1, 2, -2, 3]), w = [k * u[0] + m * v[0], k * u[1] + m * v[1]];
        const cm = (c) => (c === 1 ? " + " : c === -1 ? " - " : c < 0 ? " - " + -c : " + " + c);
        return QP("On donne " + VC("u", u) + " et " + VC("v", v) + ". Calcule les coordonnées de " + M(k + "\\vec{u}" + cm(m) + "\\vec{v}") + "." + PAIRQ, w, "Coordonnée par coordonnée : " + M(k + " \\times " + par(u[0]) + cm(m) + (Math.abs(m) === 1 ? "" : "\\times ") + par(v[0]) + " = " + w[0]) + " et " + M(k + " \\times " + par(u[1]) + cm(m) + (Math.abs(m) === 1 ? "" : "\\times ") + par(v[1]) + " = " + w[1]) + ".",
          { ctx: "combinaison", guide: [GP("Coordonnées de " + M(k + "\\vec{u}") + " ?", [k * u[0], k * u[1]], M("(" + k * u[0] + " \\,;\\, " + k * u[1] + ")") + "."), GP("Coordonnées de " + M(k + "\\vec{u}" + cm(m) + "\\vec{v}") + " ?", w, M("(" + w[0] + " \\,;\\, " + w[1] + ")") + ".")], traps: [TP([k * u[0] + m * v[0], u[1] + m * v[1]], "Le nombre " + k + " multiplie les deux coordonnées de u."), TP([k * u[0] - m * v[0], k * u[1] - m * v[1]], "Attention au signe devant v.")] }); },
      () => { const A = [R.int(-5, 3), R.int(-5, 3)], B = [A[0] + R.int(2, 6), A[1] + nz(-3, 3)], C = [B[0] + nz(-3, 3), B[1] + R.int(2, 5)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
        return QP("On donne " + PN(A[0], A[1], "A") + ", " + PN(B[0], B[1], "B") + " et " + PN(C[0], C[1], "C") + ". Calcule les coordonnées du point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme." + PAIRQ, D, M("ABCD") + " est un parallélogramme si " + M(VB("AD") + " = " + VB("BC")) + ". " + M(VB("BC") + "\\begin{pmatrix} " + (C[0] - B[0]) + " \\\\ " + (C[1] - B[1]) + " \\end{pmatrix}") + ", donc " + M("D(" + nf(A[0]) + " + " + par(C[0] - B[0]) + " \\,;\\, " + nf(A[1]) + " + " + par(C[1] - B[1]) + ") = (" + D[0] + " \\,;\\, " + D[1] + ")") + ".",
          { ctx: "parallelogramme",
            guide: [GP("Coordonnées de " + M(VB("BC")) + " ?", [C[0] - B[0], C[1] - B[1]], M("(" + (C[0] - B[0]) + " \\,;\\, " + (C[1] - B[1]) + ")") + "."), GP("On reporte depuis A : " + M("D = A + " + VB("BC")) + " ?", D, M("D(" + D[0] + " \\,;\\, " + D[1] + ")") + ".")],
            traps: [TP([B[0] + C[0] - A[0], B[1] + C[1] - A[1]], "L'ordre des sommets compte : ABCD, donc AD = BC (D est l'image de A)."), TP([(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], "Ça, c'est le centre du parallélogramme (milieu de [AC]).")] }); },
      () => { const A = [R.int(-5, 5), R.int(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], k = pk([2, 3, -1, -2]), Mx = [A[0] + k * u[0], A[1] + k * u[1]], B = [A[0] + u[0], A[1] + u[1]];
        return QP("On donne " + PN(A[0], A[1], "A") + " et " + PN(B[0], B[1], "B") + ". Calcule les coordonnées du point " + M("M") + " tel que " + M(VB("AM") + " = " + (k === -1 ? "-" : k) + VB("AB")) + "." + PAIRQ, Mx, M(VB("AB") + "\\begin{pmatrix} " + u[0] + " \\\\ " + u[1] + " \\end{pmatrix}") + ", " + M(VB("AM") + "\\begin{pmatrix} " + k * u[0] + " \\\\ " + k * u[1] + " \\end{pmatrix}") + ", donc " + M("M(" + nf(A[0]) + " + " + par(k * u[0]) + " \\,;\\, " + nf(A[1]) + " + " + par(k * u[1]) + ") = (" + Mx[0] + " \\,;\\, " + Mx[1] + ")") + ".",
          { ctx: "point-image", guide: [GP("Coordonnées de " + M(VB("AB")) + " ?", u, M("(" + u[0] + " \\,;\\, " + u[1] + ")") + "."), GP("Coordonnées de " + M(VB("AM")) + " ?", [k * u[0], k * u[1]], M("(" + k * u[0] + " \\,;\\, " + k * u[1] + ")") + "."), GP(M("M = A + " + VB("AM")) + " ?", Mx, M("M(" + Mx[0] + " \\,;\\, " + Mx[1] + ")") + ".")],
            traps: [TP([k * u[0], k * u[1]], "Ce sont les coordonnées du vecteur AM ; le point M s'obtient en partant de A."), TP([B[0] + k * u[0], B[1] + k * u[1]], "Le vecteur AM part de A, pas de B.")] }); },
    ],
    3: [
      () => { const u = [nz(-6, 6), nz(-6, 6)], v = [nz(-6, 6), nz(-6, 6)], d = u[0] * v[1] - u[1] * v[0]; if (d === 0 || Math.abs(d) === 1) return null;
        return QN("On donne " + VC("u", u) + " et " + VC("v", v) + ". Calcule le déterminant " + M("\\det(\\vec{u}, \\vec{v})") + ". Les vecteurs sont-ils colinéaires ?", d, M("\\det(\\vec{u}, \\vec{v}) = x_u y_v - y_u x_v = " + par(u[0]) + " \\times " + par(v[1]) + " - " + par(u[1]) + " \\times " + par(v[0]) + " = " + d) + " : non nul, donc les vecteurs ne sont pas colinéaires.",
          { ctx: "determinant", guide: [GS(M("x_u \\times y_v") + " = ?", u[0] * v[1], M(u[0] * v[1]) + "."), GS(M("y_u \\times x_v") + " = ?", u[1] * v[0], M(u[1] * v[0]) + "."), GS("Déterminant (différence) ?", d, M(d) + ".")], traps: [TR(u[0] * v[0] + u[1] * v[1], "Le déterminant croise : x_u × y_v − y_u × x_v."), TR(u[0] * v[1] + u[1] * v[0], "C'est une différence des produits croisés."), TR(-d, "L'ordre compte : x_u × y_v − y_u × x_v.")] }); },
      () => { const a = nz(-5, 5), b = nz(-6, 6), c = pk([2, 3, -2, -3, 4]), m = (a * b) / c; if (!Number.isInteger(m) || m === 0 || Math.abs(m) === 1 || m === a) return null;
        return QN("Pour quelle valeur de " + M("m") + " les vecteurs " + M("\\vec{u}\\begin{pmatrix} m \\\\ " + a + " \\end{pmatrix}") + " et " + M("\\vec{v}\\begin{pmatrix} " + b + " \\\\ " + c + " \\end{pmatrix}") + " sont-ils colinéaires ?", m, "Colinéaires si le déterminant est nul : " + M("m \\times " + par(c) + " - " + par(a) + " \\times " + par(b) + " = 0") + ", donc " + M(c + "m = " + a * b) + " et " + M("m = " + m) + ".",
          { ctx: "parametre", guide: [GS("Déterminant : " + M("m \\times " + par(c) + " - " + par(a) + " \\times " + par(b)) + ". Calcule " + M(par(a) + " \\times " + par(b)) + ".", a * b, M(a * b) + " : on résout " + M(c + "m - " + par(a * b) + " = 0") + "."), GS(M("m") + " = ?", m, M(m) + ".")], traps: [TR((a * c) / b, "Le déterminant croise : m × " + c + " − " + a + " × " + b + " = 0."), TR(-m, "Vérifie le signe : " + c + "m = " + a * b + ".")] }); },
      () => { const A = [R.int(-4, 2), R.int(-4, 4)], s = [pk([1, 2, 3]), nz(-3, 3)], k = pk([2, 3, -1, -2]), xC = A[0] + k * s[0], y = A[1] + k * s[1], B = [A[0] + s[0], A[1] + s[1]];
        return QN("On donne " + PN(A[0], A[1], "A") + ", " + PN(B[0], B[1], "B") + " et " + M("C(" + nf(xC) + " \\,;\\, y)") + ". Pour quelle valeur de " + M("y") + " les points " + M("A") + ", " + M("B") + ", " + M("C") + " sont-ils alignés ?", y, M(VB("AB") + "\\begin{pmatrix} " + s[0] + " \\\\ " + s[1] + " \\end{pmatrix}") + " et " + M(VB("AC") + "\\begin{pmatrix} " + (xC - A[0]) + " \\\\ y - " + par(A[1]) + " \\end{pmatrix}") + " colinéaires : " + M((s[0] === 1 ? "" : s[0]) + "(y - " + par(A[1]) + ") - " + par(s[1]) + " \\times " + par(xC - A[0]) + " = 0") + ", donc " + M("y = " + y) + ".",
          { ctx: "alignement", guide: [GP("Coordonnées de " + M(VB("AB")) + " ?", s, M("(" + s[0] + " \\,;\\, " + s[1] + ")") + "."), GS("Abscisse de " + M(VB("AC")) + " ?", xC - A[0], M(nf(xC) + " - " + par(A[0]) + " = " + (xC - A[0])) + " : c'est " + k + " fois " + s[0] + ", donc " + M(VB("AC") + " = " + k + VB("AB")) + "."), GS(M("y") + " = ?", y, M(nf(A[1]) + " + " + k + " \\times " + par(s[1]) + " = " + y) + ".")],
            traps: [TR(k * s[1], "Ça, c'est l'ordonnée du vecteur AC ; celle du point C vaut y_A + " + k * s[1] + "."), TR(A[1] + s[1], "C est plus loin que B : AC = " + k + " AB.")] }); },
    ],
  };

  // ===================== fref : fonctions de référence =====================
  const d1 = (lo, hi) => R.int(lo * 10, hi * 10) / 10;
  const FREF = {
    1: [
      () => { let a, b; do { a = -d1(1, 9); b = -d1(1, 9); } while (Math.abs(a - b) < 0.3 || Number.isInteger(a) || Number.isInteger(b)); const big = Math.min(a, b);
        return QN("Sans calculer les carrés : lequel des deux nombres " + M(nf(a)) + " et " + M(nf(b)) + " a le plus grand carré ? Donne ce nombre.", big, "La fonction carré est décroissante sur " + M("]-\\infty \\,;\\, 0]") + " : le plus petit des deux, " + M(nf(big)) + ", a le plus grand carré (" + M(nf(big) + "^2 = " + nf(r9(big * big))) + ").",
          { ctx: "comparer-carres", shownOk: true, guide: [GS("Le plus petit des deux nombres ?", big, M(nf(big)) + "."), GS("Sur les négatifs, le carré est décroissant : le plus grand carré est celui de quel nombre ?", big, M(nf(big)) + " : plus loin de 0, plus grand carré.")], traps: [TR(a === big ? b : a, "Pour des nombres négatifs, le plus grand (le plus proche de 0) a le plus PETIT carré : la fonction carré est décroissante sur ]−∞ ; 0].")] }); },
      () => { const r = pk([4, 5, 6, 7, 8, 9, 11, 12, 13]), neg = R.rand() < 0.2, k = r * r;
        return QSet("Résous " + M("x^2 = " + (neg ? "-" : "") + nf(k)) + ". (Sépare les solutions par « ; », ou « aucune ».)", neg ? [] : [-r, r], neg ? "Un carré est toujours positif ou nul : aucune solution." : "La parabole " + M("y = x^2") + " coupe la droite " + M("y = " + nf(k)) + " en deux points : " + M("x = -" + r) + " ou " + M("x = " + r) + ".",
          { ctx: neg ? "carre-negatif" : "carre-egal", guide: neg ? [GSet("Un carré peut-il être négatif ? Solutions ?", [], "Non : aucune solution.")] : [GS("Nombre positif dont le carré vaut " + M(nf(k)) + " ?", r, M(r) + "."), GSet("Solutions ?", [-r, r], M("-" + r) + " et " + M(r) + ".")],
            traps: neg ? [TSet([r], "Le carré d'un nombre n'est jamais négatif."), TSet([-r, r], "(−" + r + ")² = " + k + ", pas −" + k + ".")] : [TSet([r], "Il y a deux solutions : " + r + " et −" + r + "."), TSet([k / 2], "Le carré n'est pas le double.")] }); },
      () => { const neg = R.rand() < 0.5, [a, b] = pk([[0.2, 0.5], [0.4, 2.5], [1.6, 2.5], [0.8, 1.25], [4, 5], [2, 8], [0.25, 4], [1.5, 3]]), A = neg ? -b : a, B = neg ? -a : b, big = neg ? A : A;
        return QN("Sans calculer : lequel des deux nombres " + M(nf(A)) + " et " + M(nf(B)) + " a le plus grand inverse ? Donne ce nombre.", big, "La fonction inverse est décroissante sur " + (neg ? M("]-\\infty \\,;\\, 0[") : M("]0 \\,;\\, +\\infty[")) + " : le plus petit nombre, " + M(nf(A)) + ", a le plus grand inverse (" + M("\\frac{1}{" + nf(A) + "} = " + fT(1 / A)) + ").",
          { ctx: neg ? "comparer-inverses-neg" : "comparer-inverses", shownOk: true, guide: [GS("La fonction inverse est décroissante sur cet intervalle. Plus petit des deux nombres ?", A, M(nf(A)) + "."), GS("Nombre qui a le plus grand inverse ?", A, M(nf(A)) + ".")], traps: [TR(B, "La fonction inverse est décroissante : le plus grand nombre a le plus petit inverse.")] }); },
    ],
    2: [
      () => { const r = pk([2, 3, 4, 5, 6, 7, 9, 10]), op = pk(["<=", "<"]), k = r * r, ivs = [[-r, op === "<=", r, op === "<="]];
        return QS("Résous " + M("x^2 " + OPT[op] + " " + nf(k)) + "." + SETQ, ivs, "La parabole " + M("y = x^2") + " est sous la droite " + M("y = " + nf(k)) + " entre ses points d'intersection " + M("x = -" + r) + " et " + M("x = " + r) + " : " + M("S = " + IV(ivs)) + ".",
          { ctx: "carre-inf", fig: FIG.plot([{ f: (x) => (x * x) / (k / 6) }], [], { xr: [-r * 1.6, r * 1.6].map((v) => Math.round(v)), yr: [-1, 8], hlines: [6], label: "parabole et droite horizontale", ticks: false }), guide: [GSet("Solutions de " + M("x^2 = " + nf(k)) + " ?", [-r, r], M("-" + r) + " et " + M(r) + "."), GSS("Ensemble des solutions de l'inéquation ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS([[-Infinity, false, r, op === "<="]], "Les nombres très négatifs ont un grand carré : (−" + (r + 10) + ")² > " + k + ". Il y a une borne de chaque côté."), TS([[-Infinity, false, -r, op === "<="], [r, op === "<=", Infinity, false]], "C'est l'ensemble des x dont le carré est PLUS GRAND.")] }); },
      () => { const r = pk([2, 3, 4, 5, 6, 8, 10]), op = pk([">", ">="]), k = r * r, I = op === ">=", ivs = [[-Infinity, false, -r, I], [r, I, Infinity, false]];
        return QS("Résous " + M("x^2 " + OPT[op] + " " + nf(k)) + "." + SETQ, ivs, "Le carré dépasse " + M(nf(k)) + " quand " + M("x") + " est loin de 0 : à gauche de " + M("-" + r) + " ou à droite de " + M(r) + ". " + M("S = " + IV(ivs)) + ".",
          { ctx: "carre-sup", guide: [GSet("Solutions de " + M("x^2 = " + nf(k)) + " ?", [-r, r], M("-" + r) + " et " + M(r) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS([[r, I, Infinity, false]], "Il manque les nombres négatifs : (−" + (r + 1) + ")² = " + (r + 1) * (r + 1) + " convient aussi."), TS([[-r, I, r, I]], "C'est l'ensemble des x dont le carré est plus PETIT.")] }); },
      () => { const k = pk([2, 3, 4, 5, 6, 7, 8, 9]), op = pk(["<=", "<", ">", ">="]), sm = op[0] === "<", I = op.length === 2, ivs = sm ? [[0, true, k * k, I]] : [[k * k, I, Infinity, false]];
        return QS("Résous " + M("\\sqrt{x} " + OPT[op] + " " + k) + "." + SETQ, ivs, "La racine carrée n'est définie que pour " + M("x \\ge 0") + " et elle est croissante : " + M("\\sqrt{x} " + OPT[op] + " " + k + " \\iff " + (sm ? "0 \\le x " : "x ") + OPT[op] + " " + k * k) + ". " + M("S = " + IV(ivs)) + ".",
          { ctx: sm ? "racine-inf" : "racine-sup", guide: [GS("Pour quel " + M("x") + " a-t-on " + M("\\sqrt{x} = " + k) + " ?", k * k, M(k + "^2 = " + k * k) + "."), GSS("Ensemble des solutions (n'oublie pas " + M("x \\ge 0") + ") ?", ivs, M(IV(ivs)) + ".")],
            traps: sm ? [TS([[-Infinity, false, k * k, I]], "√x n'existe pas pour x < 0 : l'intervalle commence à 0."), TS([[0, true, k, I]], "On élève au carré : √x ≤ " + k + " donne x ≤ " + k * k + ".")] : [TS([[k, I, Infinity, false]], "On élève au carré : x " + (I ? "≥ " : "> ") + k * k + ".")] }); },
    ],
    3: [
      () => { const [k, inv] = pk([[2, 0.5], [4, 0.25], [5, 0.2], [10, 0.1], [0.5, 2], [0.25, 4], [0.2, 5]]), op = pk([">", "<"]), ivs = op === ">" ? [[0, false, inv, false]] : [[-Infinity, false, 0, false], [inv, false, Infinity, false]];
        return QS("Résous " + M("\\frac{1}{x} " + OPT[op] + " " + nf(k)) + " (avec " + M("x \\ne 0") + ")." + SETQ, ivs, "La courbe de " + M("x \\mapsto \\frac{1}{x}") + " coupe la droite " + M("y = " + nf(k)) + " en " + M("x = " + fT(inv)) + ". " + (op === ">" ? "Elle est au-dessus pour " + M("0 < x < " + fT(inv)) : "Elle est en dessous pour " + M("x < 0") + " (valeurs négatives) et pour " + M("x > " + fT(inv))) + ". " + M("S = " + IV(ivs)) + ".",
          { ctx: op === ">" ? "inverse-sup" : "inverse-inf", fig: FIG.plot([{ f: (x) => (Math.abs(x) > 0.05 ? 1 / x : NaN) }], [], { xr: k >= 4 ? [-2, 2] : [-Math.max(4, Math.ceil(inv) + 1), Math.max(4, Math.ceil(inv) + 1)], yr: k < 1 ? [-2, 2] : [-Math.max(4, k + 2), Math.max(4, k + 2)], hlines: [k], numbers: false, minH: 170, maxH: 280, label: "hyperbole y = 1/x" }),
            guide: [GS("Pour quel " + M("x") + " a-t-on " + M("\\frac{1}{x} = " + nf(k)) + " ?" + FA, inv, M("x = \\frac{1}{" + nf(k) + "} = " + fT(inv)) + "."), GSS("Ensemble des solutions (pense aux x négatifs) ?", ivs, M(IV(ivs)) + ".")],
            traps: op === ">" ? [TS([[-Infinity, false, inv, false]], "Pour x < 0, 1/x est négatif : il ne peut pas dépasser " + nt(k) + ".")] : [TS([[inv, false, Infinity, false]], "Les x négatifs conviennent aussi : 1/x y est négatif, donc plus petit que " + nt(k) + ".")] }); },
      () => { let a, b; do { a = R.int(-6, 5); b = R.int(a + 2, 7); } while (a === 0 || b === 0); const lo = a >= 0 ? a * a : b <= 0 ? b * b : 0, hi = Math.max(a * a, b * b), ivs = [[lo, true, hi, true]];
        return QS("On sait que " + M(a + " \\le x \\le " + b) + ". Dans quel intervalle se trouve " + M("x^2") + " ? Donne le plus petit intervalle possible.", ivs, (a < 0 && b > 0 ? "L'intervalle contient 0 : le carré y vaut 0 (minimum). Le plus grand carré est celui de l'extrémité la plus loin de 0, " + M(Math.abs(a) > b ? a : b) + "." : a >= 0 ? "Sur les positifs, le carré est croissant : l'ordre est conservé." : "Sur les négatifs, le carré est décroissant : l'ordre est inversé.") + " " + M("x^2 \\in " + IV(ivs)) + ".",
          { ctx: a < 0 && b > 0 ? "encadrer-0" : "encadrer", guide: [GS("Plus petite valeur de " + M("x^2") + " sur l'intervalle ?", lo, M(nf(lo)) + (a < 0 && b > 0 ? " (en x = 0, qui est dans l'intervalle)." : ".")), GS("Plus grande valeur ?", hi, M(nf(hi)) + "."), GSS("Intervalle de " + M("x^2") + " ?", ivs, M(IV(ivs)) + ".")],
            traps: a < 0 ? [TS([[Math.min(a * a, b * b), true, Math.max(a * a, b * b), true]], b > 0 ? "0 est entre " + a + " et " + b + " : x² peut valoir 0." : "Les deux bornes sont négatives : le carré inverse l'ordre.")].filter(() => !(a >= 0)) : [] }); },
      () => { const [a, b] = pk([[2, 5], [4, 10], [0.5, 4], [2, 8], [-5, -2], [-4, -0.5], [1, 4], [0.25, 2]]), lo = 1 / b, hi = 1 / a, ivs = [[lo, true, hi, true]];
        return QS("On sait que " + M(nf(a) + " \\le x \\le " + nf(b)) + ". Dans quel intervalle se trouve " + M("\\frac{1}{x}") + " ?" + FA, ivs, "La fonction inverse est décroissante sur " + (a > 0 ? M("]0 \\,;\\, +\\infty[") : M("]-\\infty \\,;\\, 0[")) + " : l'ordre s'inverse, " + M(fT(1 / b) + " \\le \\frac{1}{x} \\le " + fT(1 / a)) + ".",
          { ctx: "encadrer-inverse", guide: [GS("Inverse de " + M(nf(a)) + " ?" + FA, 1 / a, M(fT(1 / a)) + "."), GS("Inverse de " + M(nf(b)) + " ?" + FA, 1 / b, M(fT(1 / b)) + "."), GSS("Intervalle (l'ordre s'inverse) ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS([[a, true, b, true]], "Il faut prendre les inverses des bornes."), TS([[-hi, true, -lo, true]], "L'inverse de " + nt(a) + " est 1/" + nt(a) + ", pas son opposé.")] }); },
    ],
  };

  // ===================== ineq1 : inéquations du premier degré (marche collège → seconde) =====================
  const INEQ1 = {
    1: [
      () => { const a = pk([2, 3, 4, 5]), b = nz(-6, 6), op = pk([">", ">=", "<", "<="]), c = R.int(-5, 15), L = pickN([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], 5).sort((u, v) => u - v), okv = (x) => { const v = a * x + b; return op === ">" ? v > c : op === ">=" ? v >= c : op === "<" ? v < c : v <= c; }, n = L.filter(okv).length;
        if (n < 2 || n > 4) return null;
        return QN("Parmi les nombres " + L.map((x) => M(x)).join(" ; ") + ", combien sont solutions de l'inéquation " + M(lin(a, b) + " " + OPT[op] + " " + c) + " ?", n, "On teste chaque nombre : " + L.map((x) => M(lin(a, b).replace("x", "\\times " + par(x)).replace(/^(\d)/, "$1") + " = " + (a * x + b)) + (okv(x) ? " ✓" : " ✗")).join(" ; ") + ". Il y en a " + M(n) + ".",
          { ctx: "tester", guide: [GS("Valeur de " + M(lin(a, b)) + " pour " + M("x = " + L[0]) + " ?", a * L[0] + b, M(a * L[0] + b) + (okv(L[0]) ? " : solution." : " : pas solution.")), GS("Nombre de solutions dans la liste ?", n, M(n) + ".")],
            traps: [TR(5 - n, "Tu as compté les nombres qui ne sont PAS solutions."), TR(L.filter((x) => { const v = a * x + b; return op.length === 2 ? v > c || v < c ? (op[0] === ">" ? v > c : v < c) : false : (op[0] === ">" ? v >= c : v <= c); }).length, "Attention au cas d'égalité : « " + (op.length === 2 ? "≥ / ≤ » inclut" : "> / < » exclut") + " l'égalité.")] }); },
      () => { const a = pk([2, 3, 4, 5, 6, 8]), s = nz(-9, 9), op = pk([">", ">=", "<", "<="]), b = a * s + (R.rand() < 0.3 ? pk([1, 2, -1]) : 0), sol = b / a, ivs = op[0] === ">" ? [[sol, op === ">=", Infinity, false]] : [[-Infinity, false, sol, op === "<="]];
        return QS("Résous " + M(a + "x " + OPT[op] + " " + nf(b)) + "." + SETQ, ivs, "On divise par " + M(a) + ", positif : le sens ne change pas. " + M("x " + OPT[op] + " " + fT(sol)) + ", " + M("S = " + IV(ivs)) + ".",
          { ctx: "ax-b", guide: [GS("Borne : " + M("\\frac{" + nf(b) + "}{" + a + "}") + " = ?" + FA, sol, M(fT(sol)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(op[0] === ">" ? [[-Infinity, false, sol, op === ">="]] : [[sol, op === "<=", Infinity, false]], "On divise par " + a + ", qui est positif : le sens de l'inégalité ne change pas."), TS(op[0] === ">" ? [[b - a, op === ">=", Infinity, false]] : [[-Infinity, false, b - a, op === "<="]], a + "x, c'est " + a + " × x : on divise par " + a + " (on ne soustrait pas).")] }); },
      () => { const a = pk([2, 3, 4, 5]), b = nz(-9, 9), c = R.int(-10, 20), big = R.rand() < 0.5, op = big ? pk([">", ">="]) : pk(["<", "<="]), t = (c - b) / a;
        if (Number.isInteger(t) && op.length === 1 && R.rand() < 0.5) return null;
        const v = big ? (op === ">=" ? Math.ceil(t - 1e-9) : Math.floor(t + 1e-9) + 1) : op === "<=" ? Math.floor(t + 1e-9) : Math.ceil(t - 1e-9) - 1;
        return QN("Quel est le " + (big ? "plus petit" : "plus grand") + " nombre entier solution de " + M(lin(a, b) + " " + OPT[op] + " " + c) + " ?", v, M(lin(a, b) + " " + OPT[op] + " " + c + " \\iff " + a + "x " + OPT[op] + " " + (c - b) + " \\iff x " + OPT[op] + " " + fT(t)) + ". " + (big ? "Le plus petit" : "Le plus grand") + " entier qui convient est " + M(v) + ".",
          { ctx: "entier", guide: [GS("Borne : " + M("x " + OPT[op] + " ?") + FA, t, M(fT(t)) + (Number.isInteger(t) ? (op.length === 2 ? " (incluse)." : " (exclue).") : ".")), GS((big ? "Plus petit" : "Plus grand") + " entier ?", v, M(v) + ".")],
            traps: [TR(big ? v - 1 : v + 1, Number.isInteger(t) ? "L'inégalité est " + (op.length === 2 ? "large : " + t + " est solution." : "stricte : " + t + " n'est pas solution.") : "Vérifie avec x = " + (big ? v - 1 : v + 1) + " : ça ne marche pas.")] }); },
    ],
    2: [
      () => { const a = pk([2, 3, 4, 5]), s = nz(-8, 8), b = nz(-9, 9), c = -a * s + b, op = pk([">", ">=", "<", "<="]), ivs = signSet([[-a, b - c]], [], op);
        return QS("Résous " + M(lin(-a, b) + " " + OPT[op] + " " + c) + "." + SETQ, ivs, M("-" + a + "x " + OPT[op] + " " + (c - b)) + ". On divise par " + M("-" + a) + ", négatif : on change le sens. " + M("x " + OPT[{ ">": "<", "<": ">", ">=": "<=", "<=": ">=" }[op]] + " " + s) + ", " + M("S = " + IV(ivs)) + ".",
          { ctx: "coef-negatif", guide: [GS("Après avoir retiré " + M(nf(b)) + " : " + M("-" + a + "x " + OPT[op] + " ?"), c - b, M(c - b) + "."), GS("On divise par " + M("-" + a) + " : borne ?", s, M(s) + " — et le sens de l'inégalité change."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(complement(ivs).map(([lo, li, hi, hi2]) => [lo, isFinite(lo) ? op.length === 2 : li, hi, isFinite(hi) ? op.length === 2 : hi2]), "On divise par un nombre négatif (−" + a + ") : le sens de l'inégalité change.")] }); },
      () => { let a, c; do { a = nz(-6, 7); c = nz(-6, 7); } while (a === c); const s = nz(-7, 7), b = nz(-9, 9), d = (a - c) * s + b, op = pk([">", ">=", "<", "<="]), ivs = signSet([[a - c, b - d]], [], op);
        return QS("Résous " + M(lin(a, b) + " " + OPT[op] + " " + lin(c, d)) + "." + SETQ, ivs, "On regroupe les " + M("x") + " à gauche : " + M(lin(a - c, 0) + " " + OPT[op] + " " + (d - b)) + (a - c < 0 ? " ; on divise par " + M(a - c) + ", négatif : le sens change" : "") + ". " + M("S = " + IV(ivs)) + ".",
          { ctx: "deux-membres", guide: [GS("Coefficient de " + M("x") + " après regroupement à gauche ?", a - c, M(nf(a) + " - " + par(c) + " = " + (a - c)) + "."), GS("Nombre à droite ?", d - b, M(nf(d) + " - " + par(b) + " = " + (d - b)) + "."), GSS("Ensemble des solutions ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(signSet([[Math.abs(a - c), (a - c > 0 ? 1 : -1) * (b - d)]], [], op), a - c < 0 ? "Le coefficient " + (a - c) + " est négatif : on change le sens en divisant." : "Vérifie le sens."), TS(complement(ivs).map(([lo, li, hi, hi2]) => [lo, isFinite(lo) ? op.length === 2 : li, hi, isFinite(hi) ? op.length === 2 : hi2]), "C'est l'ensemble contraire.")] }); },
      () => { const a = nz(-4, 4), right = R.rand() < 0.5, incl = R.rand() < 0.5, ivs = right ? [[a, incl, Infinity, false]] : [[-Infinity, false, a, incl]];
        return QS("La droite graduée représente l'ensemble des solutions d'une inéquation (le crochet indique si " + M(a) + " est compris). Écris cet ensemble sous forme d'intervalle.", ivs, "Le trait part de " + M(a) + " vers la " + (right ? "droite" : "gauche") + " ; le crochet est tourné " + (incl ? "vers le trait : " + M(a) + " est compris" : "vers l'extérieur : " + M(a) + " est exclu") + ". " + M(IV(ivs)) + ".",
          { ctx: "droite-graduee", fig: rayFig(a, right, incl), guide: [GS("Le trait va-t-il vers la droite (1) ou vers la gauche (−1) ?", right ? 1 : -1, right ? "Vers la droite : jusqu'à " + M("+\\infty") + "." : "Vers la gauche : depuis " + M("-\\infty") + "."), GSS("Intervalle ?", ivs, M(IV(ivs)) + ".")],
            traps: [TS(right ? [[-Infinity, false, a, incl]] : [[a, incl, Infinity, false]], "Regarde de quel côté de " + a + " va le trait.")], shownOk: true }); },
    ],
    3: [
      () => { const S = pk([["Un cinéma de Lille", "la séance", "la carte d'abonnement", "séances", "elle"], ["Une piscine de Grenoble", "l'entrée", "la carte annuelle", "entrées", "elle"], ["Un musée de Lyon", "la visite", "le pass", "visites", "il"]]), p = pk([8, 9, 10, 12]), r = pk([4, 5, 6, 7].filter((v) => v < p)), F = R.int(3, 12) * 5, t = F / (p - r), n = Math.floor(t + 1e-9) + 1;
        return QN(S[0] + " propose deux tarifs : " + EUR(p) + " " + S[1] + ", ou " + S[2] + " à " + EUR(F) + " puis " + EUR(r) + " " + S[1] + ". À partir de combien de " + S[3] + " " + S[2] + " est-" + S[4] + " strictement plus avantageu" + (S[4] === "il" ? "x" : "se") + " ?", n, "Avec " + M("n") + " " + S[3] + " : " + M(F + " + " + r + "n < " + p + "n \\iff " + F + " < " + (p - r) + "n \\iff n > " + fT(t)) + ". Le plus petit entier est " + M(n) + ".",
          { ctx: "tarifs", guide: [GS("Inéquation : " + M(F + " + " + r + "n < " + p + "n") + ". Après regroupement, " + M((p - r) + "n > ?"), F, M(F) + "."), GS("Borne " + M("n > ?") + FA, t, M(fT(t)) + "."), GS("Plus petit nombre entier ?", n, M(n) + (Number.isInteger(t) ? " (à " + t + ", les deux tarifs sont égaux : pas strictement plus avantageux)." : "."))],
            traps: [TR(Math.floor(t + 1e-9), Number.isInteger(t) ? "Pour " + t + ", les deux tarifs sont égaux : il faut un de plus." : "Pour " + Math.floor(t) + ", la carte coûte encore plus cher : vérifie."), TR(Math.ceil(F / p), "Il faut comparer les deux tarifs, pas seulement le prix de la carte.")] }); },
      () => { const n1 = R.int(6, 16), n2 = R.int(5, 16), goal = pk([10, 11, 12, 13, 14]), need = 3 * goal - n1 - n2; if (need <= 8 || need > 20) return null;
        return QN("Inès a eu " + M(n1) + " et " + M(n2) + " sur 20 à ses deux premiers devoirs de mathématiques. Quelle note minimale doit-elle avoir au troisième pour que sa moyenne soit au moins de " + M(goal) + " ?", need, "Avec la note " + M("x") + " : " + M("\\frac{" + n1 + " + " + n2 + " + x}{3} \\ge " + goal + " \\iff " + (n1 + n2) + " + x \\ge " + 3 * goal + " \\iff x \\ge " + need) + ".",
          { ctx: "moyenne", guide: [GS("Total de points nécessaire sur les trois devoirs ?", 3 * goal, M("3 \\times " + goal + " = " + 3 * goal) + "."), GS("Note minimale ?", need, M(3 * goal + " - " + (n1 + n2) + " = " + need) + ".")],
            traps: [TR(goal, "Avec " + goal + ", la moyenne n'atteint pas " + goal + " : les deux premières notes la tirent vers le bas (ou le haut)."), TR(2 * goal - n1 - n2 + goal - goal, "Il y a trois notes : on multiplie " + goal + " par 3.")] }); },
      () => { const pc = pk([4, 5, 6]), km = pk([1.5, 2, 2.5]), B = R.int(20, 60), t = (B - pc) / km, n = Math.floor(t + 1e-9), C = pk(["Toulouse", "Marseille", "Nice", "Lyon"]);
        if (Number.isInteger(t) && R.rand() < 0.5) return null;
        return QN("À " + C + ", un taxi facture " + EUR(pc) + " de prise en charge puis " + EUR(km) + " par kilomètre. Avec " + EUR(B) + " au plus, quelle distance entière maximale (en km) peut-on parcourir ?", n, M(nf(pc) + " + " + nf(km) + "d \\le " + B + " \\iff d \\le " + fT(t)) + (Number.isInteger(t) ? "" : " \\approx " + nf(+t.toFixed(2))) + " : au plus " + M(n) + " km.",
          { ctx: "budget", guide: [GS("Budget restant après la prise en charge (€) ?", B - pc, M(B + " - " + pc + " = " + (B - pc)) + "."), GS("Nombre entier maximal de km ?", n, M(nf(B - pc) + " \\div " + nf(km) + (Number.isInteger(t) ? " = " : " \\approx ") + nf(+t.toFixed(2))) + " : " + M(n) + ".")],
            traps: [TR(n + 1, "Avec " + (n + 1) + " km, on dépasse " + B + " € : on arrondit vers le bas."), TR(Math.floor(B / km), "N'oublie pas la prise en charge de " + pc + " €.")] }); },
    ],
  };

  // ===================== proba2 : contraire, deux épreuves, réunion et intersection =====================
  const PROBA2 = {
    1: [
      () => { const S = pk([["qu'il pleuve demain à Brest", "qu'il ne pleuve pas"], ["que le TER Rouen–Paris soit en retard", "qu'il soit à l'heure"], ["qu'un graine de tournesol germe", "qu'elle ne germe pas"], ["qu'un client d'une boulangerie de Tours prenne un croissant", "qu'il n'en prenne pas"]]), p = pk([0.12, 0.15, 0.27, 0.35, 0.38, 0.42, 0.58, 0.63, 0.7, 0.85]);
        return QN("La probabilité " + S[0] + " est " + M(nf(p)) + ". Quelle est la probabilité " + S[1] + " ?", r9(1 - p), "Évènement contraire : " + M("P(\\bar{A}) = 1 - P(A) = 1 - " + nf(p) + " = " + nf(r9(1 - p))) + ".",
          { ctx: "contraire", guide: [GS(M("1 - " + nf(p)) + " = ?", r9(1 - p), M(nf(r9(1 - p))) + ".")], traps: [TR(p, "C'est la probabilité de l'évènement lui-même ; on demande le contraire."), TR(r9(100 - p), "Une probabilité est entre 0 et 1 : on calcule 1 − " + nt(p) + ".")] }); },
      () => { const r = R.int(3, 9), b = R.int(2, 8), v = R.int(1, 6), N = r + b + v, c = pk([["rouge", r], ["bleue", b], ["verte", v]]);
        return QN("Un sac contient " + M(r) + " billes rouges, " + M(b) + " bleues et " + M(v) + " vertes. On tire une bille au hasard. Quelle est la probabilité qu'elle ne soit pas " + c[0] + " ?" + FA, (N - c[1]) / N, M("P(\\text{" + c[0] + "}) = " + FT(c[1], N)) + ", donc " + M("P(\\text{pas " + c[0] + "}) = 1 - " + FT(c[1], N) + " = " + FT(N - c[1], N)) + ".",
          { ctx: "contraire-sac", guide: [GS("Nombre total de billes ?", N, M(N) + "."), GS("Probabilité de tirer une bille " + c[0] + " ?" + FA, c[1] / N, M(FT(c[1], N)) + "."), GS("Probabilité de l'évènement contraire ?" + FA, (N - c[1]) / N, M(FT(N - c[1], N)) + ".")], traps: [TR(c[1] / N, "C'est la probabilité de tirer une bille " + c[0] + " ; on veut l'évènement contraire."), TR((N - c[1]) / c[1], "On divise par le nombre total de billes, " + N + ".")] }); },
      () => { const ps = pk([[0.15, 0.4, 0.25], [0.1, 0.35, 0.3], [0.05, 0.45, 0.2], [0.22, 0.18, 0.4], [0.3, 0.12, 0.33]]), miss = r9(1 - ps[0] - ps[1] - ps[2]), k = R.int(0, 3), L = ps.slice(); L.splice(k, 0, null);
        return QN("Une roue de loterie a quatre secteurs, notés 1 à 4. On connaît les probabilités : " + L.map((p, i) => M("P(" + (i + 1) + ") = " + (p === null ? "?" : nf(p)))).join(" ; ") + ". Calcule la probabilité manquante.", miss, "La somme des probabilités de toutes les issues vaut 1 : " + M("1 - " + ps.map(nf).join(" - ") + " = " + nf(miss)) + ".",
          { ctx: "loi", guide: [GS("Somme des trois probabilités connues ?", r9(1 - miss), M(nf(r9(1 - miss)))+ "."), GS("Probabilité manquante ?", miss, M("1 - " + nf(r9(1 - miss)) + " = " + nf(miss)) + ".")], traps: [TR(r9(1 - miss), "Ça, c'est la somme des probabilités connues ; il manque ce qu'il faut pour arriver à 1.")] }); },
    ],
    2: [
      () => { const E = pk([[["un dé équilibré à 6 faces", 6], [["obtenir un 6", 1], ["obtenir un nombre pair", 3], ["obtenir un multiple de 3", 2]]], [["une roue à 8 secteurs égaux numérotés de 1 à 8", 8], [["obtenir 8", 1], ["obtenir un nombre impair", 4], ["obtenir plus que 5", 3]]], [["une pièce équilibrée", 2], [["obtenir pile", 1]]]]), F = pk([[["un dé équilibré à 6 faces", 6], [["obtenir un 6", 1], ["obtenir un nombre premier", 3], ["obtenir moins que 3", 2]]], [["une pièce équilibrée", 2], [["obtenir face", 1]]], [["un dé équilibré à 4 faces", 4], [["obtenir 4", 1], ["obtenir 1 ou 2", 2]]]]);
        if (E[0][0] === F[0][0]) return null;
        const a = pk(E[1]), b = pk(F[1]), v = (a[1] * b[1]) / (E[0][1] * F[0][1]);
        return QN("On lance " + E[0][0] + ", puis " + F[0][0] + ". Quelle est la probabilité d'" + a[0] + " avec le premier, puis d'" + b[0] + " avec le second ?" + FA, v, "Les deux épreuves sont indépendantes : on multiplie le long de la branche, " + M(FT(a[1], E[0][1]) + " \\times " + FT(b[1], F[0][1]) + " = " + FT(a[1] * b[1], E[0][1] * F[0][1])) + ".",
          { ctx: "independantes", guide: [GS("Probabilité de " + a[0] + " ?" + FA, a[1] / E[0][1], M(FT(a[1], E[0][1])) + "."), GS("Probabilité de " + b[0] + " avec " + F[0][0] + " ?" + FA, b[1] / F[0][1], M(FT(b[1], F[0][1])) + "."), GS("Produit ?" + FA, v, M(FT(a[1] * b[1], E[0][1] * F[0][1])) + ".")], traps: [TR(a[1] / E[0][1] + b[1] / F[0][1], "Pour « … puis … », on multiplie (on n'additionne pas).")] }); },
      () => { const r = R.int(3, 7), b = R.int(2, 6), N = r + b, v = (r * (r - 1)) / (N * (N - 1)), C = pk(["rouges", "noires", "jaunes"]);
        return QN("Une urne contient " + M(r) + " boules " + C + " et " + M(b) + " blanches. On tire deux boules successivement, sans remise. Quelle est la probabilité d'obtenir deux boules " + C + " ?" + FA, v, M(FT(r, N) + " \\times " + FT(r - 1, N - 1) + " = " + FT(r * (r - 1), N * (N - 1))) + " : au second tirage, il reste " + M(N - 1) + " boules dont " + M(r - 1) + " " + C + ".",
          { ctx: "sans-remise", guide: [GS("Probabilité au 1er tirage ?" + FA, r / N, M(FT(r, N)) + "."), GS("Au 2e tirage (une boule " + C.replace(/s$/, "") + " en moins) ?" + FA, (r - 1) / (N - 1), M(FT(r - 1, N - 1)) + "."), GS("Produit ?" + FA, v, M(FT(r * (r - 1), N * (N - 1))) + ".")], traps: [TR((r * r) / (N * N), "Sans remise, il reste " + (N - 1) + " boules au second tirage, dont " + (r - 1) + " " + C + "."), TR(r / N + (r - 1) / (N - 1), "Le long d'une branche, on multiplie.")] }); },
      () => { const r = R.int(2, 7), b = R.int(2, 7), N = r + b, v = (2 * r * b) / (N * N);
        if (r === b) return null;
        return QN("Une urne contient " + M(r) + " jetons verts et " + M(b) + " jetons orange. On tire un jeton, on le remet, puis on en tire un second. Quelle est la probabilité d'obtenir deux jetons de couleurs différentes ?" + FA, v, "Deux chemins : vert puis orange, et orange puis vert. " + M(FT(r, N) + " \\times " + FT(b, N) + " + " + FT(b, N) + " \\times " + FT(r, N) + " = " + FT(2 * r * b, N * N)) + ".",
          { ctx: "deux-chemins", guide: [GS("Probabilité de « vert puis orange » ?" + FA, (r * b) / (N * N), M(FT(r * b, N * N)) + "."), GS("Combien de chemins donnent deux couleurs différentes ?", 2, "Deux : VO et OV."), GS("Probabilité totale ?" + FA, v, M(FT(2 * r * b, N * N)) + ".")], traps: [TR((r * b) / (N * N), "Il y a deux chemins : vert puis orange ET orange puis vert."), TR((2 * r * b) / (N * (N - 1)), "Avec remise, il y a toujours " + N + " jetons au second tirage.")] }); },
    ],
    3: [
      () => { const pa = pk([0.3, 0.35, 0.4, 0.45, 0.5, 0.6]), pb = pk([0.2, 0.25, 0.3, 0.4, 0.5]), pi = pk([0.05, 0.1, 0.15].filter((x) => x < Math.min(pa, pb))), v = r9(pa + pb - pi), S = pk(["Dans un lycée de Poitiers, on choisit un élève au hasard. A : « il pratique un sport en club » ; B : « il joue d'un instrument ».", "On choisit au hasard un abonné d'une médiathèque d'Amiens. A : « il emprunte des romans » ; B : « il emprunte des BD ».", "On choisit au hasard un client d'un camping des Landes. A : « il loue un vélo » ; B : « il loue un kayak »."]);
        return QN(S + " On sait que " + M("P(A) = " + nf(pa)) + ", " + M("P(B) = " + nf(pb)) + " et " + M("P(A \\cap B) = " + nf(pi)) + ". Calcule " + M("P(A \\cup B)") + ".", v, M("P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = " + nf(pa) + " + " + nf(pb) + " - " + nf(pi) + " = " + nf(v)) + ".",
          { ctx: "reunion", guide: [GS(M("P(A) + P(B)") + " = ?", r9(pa + pb), M(nf(r9(pa + pb)))+ "."), GS("On retire l'intersection, comptée deux fois : " + M("P(A \\cup B)") + " = ?", v, M(nf(v)) + ".")], traps: [TR(r9(pa + pb), "Les éléments de A ∩ B sont comptés deux fois : on retire P(A ∩ B)."), TR(r9(pa + pb + pi), "On retire P(A ∩ B), on ne l'ajoute pas.")] }); },
      () => { const [deck, A, nA, B, nB, nI] = pk([[32, "un cœur", 8, "un roi", 4, 1], [32, "une carte rouge", 16, "un as", 4, 2], [32, "une figure (valet, dame ou roi)", 12, "un pique", 8, 3], [52, "un cœur", 13, "un roi", 4, 1], [52, "une figure (valet, dame ou roi)", 12, "un trèfle", 13, 3]]), v = (nA + nB - nI) / deck;
        return QN("On tire une carte au hasard dans un jeu de " + deck + " cartes. Quelle est la probabilité de tirer " + A + " ou " + B + " ?" + FA, v, M("P = \\frac{" + nA + "}{" + deck + "} + \\frac{" + nB + "}{" + deck + "} - \\frac{" + nI + "}{" + deck + "} = " + FT(nA + nB - nI, deck)) + " (" + (nI === 1 ? "la carte qui est les deux à la fois est comptée une seule fois" : "les " + nI + " cartes qui sont les deux à la fois sont comptées une seule fois") + ").",
          { ctx: "cartes", guide: [GS("Nombre de cartes qui sont " + A + " ?", nA, M(nA) + "."), GS("Nombre de cartes qui sont à la fois " + A + " et " + B + " ?", nI, M(nI) + "."), GS("Nombre de cartes favorables (sans compter deux fois) ?", nA + nB - nI, M(nA + " + " + nB + " - " + nI + " = " + (nA + nB - nI)) + "."), GS("Probabilité ?" + FA, v, M(FT(nA + nB - nI, deck)) + ".")],
            traps: [TR((nA + nB) / deck, "Les cartes qui sont à la fois " + A + " et " + B + " sont comptées deux fois."), TR(nI / deck, "« ou » : l'une, l'autre ou les deux (c'est la réunion, pas l'intersection).")] }); },
      () => { const pa = pk([0.4, 0.45, 0.5, 0.55, 0.6]), pb = pk([0.3, 0.35, 0.45, 0.5]), pi = pk([0.1, 0.15, 0.2, 0.25].filter((x) => x < Math.min(pa, pb))), pu = r9(pa + pb - pi);
        return QN("Pour deux évènements " + M("A") + " et " + M("B") + ", on sait que " + M("P(A) = " + nf(pa)) + ", " + M("P(B) = " + nf(pb)) + " et " + M("P(A \\cup B) = " + nf(pu)) + ". Calcule " + M("P(A \\cap B)") + ".", pi, M("P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = " + nf(pa) + " + " + nf(pb) + " - " + nf(pu) + " = " + nf(pi)) + ".",
          { ctx: "intersection", guide: [GS(M("P(A) + P(B)") + " = ?", r9(pa + pb), M(nf(r9(pa + pb)))+ "."), GS(M("P(A \\cap B)") + " = ?", pi, M(nf(r9(pa + pb)) + " - " + nf(pu) + " = " + nf(pi)) + ".")], traps: [TR(r9(pa * pb), "On ne sait pas si A et B sont indépendants : on utilise P(A ∪ B) = P(A) + P(B) − P(A ∩ B)."), TR(r9(pa + pb + pu), "On isole P(A ∩ B) : P(A) + P(B) − P(A ∪ B).")] }); },
    ],
  };

  // ===================== algopy : lire un programme Python =====================
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const PY = (lines) => '<pre class="py">' + esc(lines.join("\n")) + "</pre>";
  const ALGO = {
    1: [
      () => { const x = R.int(3, 12), k = nz(-6, 9), a1 = x, b = 2 * a1 + k, a2 = b - a1;
        return QN("Qu'affiche ce programme Python ?" + PY(["a = " + x, "b = 2 * a + " + k, "a = b - a", "print(a)"]).replace("+ -", "- ").replace(/\+ -(\d)/, "- $1"), a2, "Ligne par ligne : " + M("a = " + x) + " ; " + M("b = 2 \\times " + x + sg(k) + " = " + b) + " ; " + M("a = " + b + " - " + x + " = " + a2) + ". Le programme affiche " + M(a2) + ".",
          { ctx: "affectations", guide: [GS("Valeur de " + M("b") + " après la 2e ligne ?", b, M(b) + "."), GS("Nouvelle valeur de " + M("a") + " (on utilise l'ancienne valeur de " + M("a") + ", " + x + ") ?", a2, M(b + " - " + x + " = " + a2) + ".")], traps: [TR(b, "print(a) affiche a, pas b."), TR(x, "La 3e ligne modifie a : a prend la valeur b − a.")] }); },
      () => { const a = pk([2, 3, 4, 5, -2]), b = R.int(1, 9), c = pk([-4, -3, -2, 2, 3, 5]), v = a * c * c - b;
        return QN("On a défini la fonction Python ci-dessous. Que renvoie " + M("\\texttt{f(" + c + ")}") + " ?" + PY(["def f(x):", "    return " + a + " * x**2 - " + b]), v, M("f(" + c + ") = " + a + " \\times " + par(c) + "^2 - " + b + " = " + a + " \\times " + c * c + " - " + b + " = " + v) + ". (En Python, ** est la puissance.)",
          { ctx: "fonction", guide: [GS(M(par(c) + "^2") + " (x**2 avec x = " + c + ") ?", c * c, M(c * c) + "."), GS("Valeur renvoyée ?", v, M(a + " \\times " + c * c + " - " + b + " = " + v) + ".")], traps: [TR((a * c) ** 2 - b, "La puissance passe avant la multiplication : " + a + " * x**2 = " + a + " × (x²)."), TR(-a * c * c - b, "(" + c + ")² = " + c * c + " est positif."), TR(a * c * 2 - b, "x**2 est x au carré, pas 2x.")] }); },
      () => { const p = pk([12, 15, 18, 24, 35, 40]), q = R.int(2, 5), r = pk([10, 20, 25]), tot = p * q, fin = r9(tot * (1 - r / 100)), S = pk(["livre", "place de concert", "maillot", "jeu de société"]);
        return QN("Ce programme calcule le prix d'un achat de " + S + "s (en €) avec une remise. Qu'affiche-t-il ?" + PY(["prix = " + p, "quantite = " + q, "total = prix * quantite", "remise = total * " + String(r / 100), "total = total - remise", "print(total)"]), fin, M("total = " + p + " \\times " + q + " = " + tot) + " ; " + M("remise = " + tot + " \\times " + nf(r / 100) + " = " + nf(r9(tot * r / 100))) + " ; " + M("total = " + tot + " - " + nf(r9(tot * r / 100)) + " = " + nf(fin)) + ".",
          { ctx: "remise", guide: [GS("Valeur de " + M("\\texttt{total}") + " à la 3e ligne ?", tot, M(tot) + "."), GS("Valeur de " + M("\\texttt{remise}") + " ?", r9(tot * r / 100), M(nf(r9(tot * r / 100)))+ "."), GS("Valeur affichée ?", fin, M(nf(fin)) + ".")], traps: [TR(r9(tot * r / 100), "C'est la remise ; le programme affiche le total après remise."), TR(tot, "La 5e ligne retire la remise du total.")] }); },
    ],
    2: [
      () => { const t = [pk([4, 5, 6]), pk([7, 8, 9]), pk([10, 11.5, 12])], a1 = pk([10, 12, 14]), a2 = pk([16, 18, 26]), age = pk([a1 - 1, a1, a1 + 2, a2 - 1, a2, a2 + 5]), v = age < a1 ? t[0] : age < a2 ? t[1] : t[2];
        return QN("Un musée de Nantes calcule le prix d'entrée avec cette fonction. Que renvoie " + M("\\texttt{tarif(" + age + ")}") + " ?" + PY(["def tarif(age):", "    if age < " + a1 + ":", "        return " + t[0], "    elif age < " + a2 + ":", "        return " + t[1], "    else:", "        return " + String(t[2])]), v, M(age) + (age < a1 ? " < " + a1 + " : première branche." : " n'est pas < " + a1 + (age < a2 ? " mais " + age + " < " + a2 + " : deuxième branche." : " ni < " + a2 + " : branche else.")) + " La fonction renvoie " + M(nf(v)) + ".",
          { ctx: "si-sinon", guide: [GS("Le test " + M("\\texttt{" + age + " < " + a1 + "}") + " est-il vrai (1) ou faux (0) ?", age < a1 ? 1 : 0, age < a1 ? "Vrai." : "Faux" + (age === a1 ? " : " + age + " n'est pas strictement plus petit que " + a1 + "." : ".")), GS("Valeur renvoyée ?", v, M(nf(v)) + ".")],
            traps: [TR(age < a1 ? t[1] : age < a2 ? (age === a1 ? t[0] : t[2]) : t[1], "Le test « < » est strict : " + (age === a1 || age === a2 ? age + " < " + age + " est faux." : "relis chaque condition dans l'ordre."))] }); },
      () => { const n0 = pk([6, 10, 12, 14, 18, 20, 7, 9, 11, 13]), f = (n) => (n % 2 === 0 ? n / 2 : 3 * n + 1), v = f(f(n0));
        return QN("Que renvoie " + M("\\texttt{suivant(suivant(" + n0 + "))}") + " ? (" + M("\\texttt{n \\% 2}") + " est le reste de la division par 2, " + M("\\texttt{//}") + " le quotient entier.)" + PY(["def suivant(n):", "    if n % 2 == 0:", "        return n // 2", "    else:", "        return 3 * n + 1"]), v, M("\\texttt{suivant(" + n0 + ")} = " + f(n0)) + " (" + (n0 % 2 ? "impair : 3n + 1" : "pair : n // 2") + "), puis " + M("\\texttt{suivant(" + f(n0) + ")} = " + v) + " (" + (f(n0) % 2 ? "impair" : "pair") + ").",
          { ctx: "syracuse", guide: [GS(M("\\texttt{suivant(" + n0 + ")}") + " = ?", f(n0), M(n0) + (n0 % 2 ? " est impair : " + M("3 \\times " + n0 + " + 1 = " + f(n0)) : " est pair : " + M(n0 + " \\div 2 = " + f(n0))) + "."), GS("Puis " + M("\\texttt{suivant(" + f(n0) + ")}") + " = ?", v, M(v) + ".")], traps: [TR(f(n0), "La fonction est appelée deux fois : suivant(suivant(" + n0 + "))."), TR(n0 % 2 ? (3 * n0 + 1) * 3 + 1 : n0 / 4, "Relis le test pour chaque valeur : pair ou impair ?")] }); },
      () => { const a = nz(-8, 8), b = nz(-8, 8); if (a === b || Math.abs(a - b) < 2) return null; const v = Math.abs(a - b);
        return QN("Que renvoie " + M("\\texttt{ecart(" + a + ", " + b + ")}") + " ?" + PY(["def ecart(a, b):", "    if a > b:", "        return a - b", "    else:", "        return b - a"]), v, M(a + " > " + b) + (a > b ? " est vrai : on renvoie " + M(a + " - " + par(b) + " = " + v) : " est faux : on renvoie " + M(b + " - " + par(a) + " = " + v)) + ". (C'est la distance entre les deux nombres.)",
          { ctx: "ecart", guide: [GS("Le test " + M("\\texttt{" + a + " > " + b + "}") + " est-il vrai (1) ou faux (0) ?", a > b ? 1 : 0, a > b ? "Vrai." : "Faux."), GS("Valeur renvoyée ?", v, M(v) + ".")], traps: [TR(a - b === v ? b - a : a - b, "Relis le test : la fonction renvoie toujours un nombre positif."), TR(Math.abs(a + b), "On soustrait : a − b ou b − a.")] }); },
    ],
    3: [
      () => { const a = pk([0, 1, 2, 3]), n = R.int(5, 11), k = pk([1, 2, 3]), v = (() => { let s = 0; for (let i = a; i < n; i++) s += k * i; return s; })(), incl = (() => { let s = 0; for (let i = a; i <= n; i++) s += k * i; return s; })();
        return QN("Qu'affiche ce programme ? (" + M("\\texttt{range(" + a + ", " + n + ")}") + " parcourt les entiers de " + a + " à " + (n - 1) + ".)" + PY(["s = 0", "for i in range(" + a + ", " + n + "):", "    s = s + " + (k === 1 ? "i" : k + " * i"), "print(s)"]), v, "On ajoute " + (k === 1 ? "" : k + " fois ") + "les entiers de " + M(a) + " à " + M(n - 1) + " (" + M(n) + " est exclu) : " + M((k === 1 ? "" : k + " \\times (") + (n - a > 6 ? [a, a + 1, a + 2, "\\ldots", n - 1].join(" + ") : Array.from({ length: n - a }, (_, j) => a + j).join(" + ")) /* 24.11 : largeur */ + (k === 1 ? "" : ")") + " = " + v) + ".",
          { ctx: "boucle-for", guide: [GS("Dernière valeur prise par " + M("\\texttt{i}") + " ?", n - 1, M(n - 1) + " : la borne " + n + " est exclue."), GS("Valeur affichée ?", v, M(v) + ".")], traps: [TR(incl, "range(" + a + ", " + n + ") s'arrête à " + (n - 1) + " : " + n + " n'est pas compris."), TR(n - a, "Ça, c'est le nombre de tours ; s accumule les valeurs.")] }); },
      () => { const S = pk([["capital", "Un livret d'épargne de", "€ rapporte", "Au bout de combien d'années le capital dépasse-t-il le seuil ?"], ["population", "Une colonie de bactéries de", "individus grandit de", "Combien d'heures faut-il pour dépasser le seuil ?"]]), u0 = pk([100, 200, 500, 1000]), m = pk([1.5, 2, 1.25]), seuil = u0 * pk([3, 5, 8, 10]); let u = u0, n = 0; while (u < seuil) { u *= m; n++; }
        return QN("Qu'affiche ce programme ?" + PY(["u = " + u0, "n = 0", "while u < " + seuil + ":", "    u = u * " + String(m), "    n = n + 1", "print(n)"]), n, "On multiplie " + M("u") + " par " + M(nf(m)) + " tant que " + M("u < " + nf(seuil)) + " : " + (() => { let w = u0, L = [nf(w)]; for (let i = 0; i < n; i++) { w = r9(w * m); L.push(nf(Math.round(w * 100) / 100)); } return M(L.join(" \\to ")) + (m === 1.25 ? " (valeurs arrondies au centième)" : ""); })() /* 24.11 : 9 décimales trop larges sur téléphone */ + ". La boucle tourne " + M(n) + " fois.",
          { ctx: "boucle-while", guide: [GS("Valeur de " + M("u") + " après un tour ?", r9(u0 * m), M(nf(r9(u0 * m)))+ "."), GS("Nombre de tours (valeur de n à la fin) ?", n, M(n) + " : après " + n + " tours, " + M("u = " + nf(r9(u))) + " n'est plus inférieur à " + M(nf(seuil)) + ".")], traps: [TR(n - 1, "La boucle s'arrête seulement quand u ≥ " + seuil + " : compte aussi le dernier tour."), TR(n + 1, "Quand u atteint ou dépasse " + seuil + ", on sort de la boucle sans incrémenter n.")] }); },
      () => { const a = pk([2, 3, -1]), b = nz(-3, 4), u0 = R.int(1, 4), n = R.int(3, 4); let u = u0; const L = [u]; for (let k = 0; k < n; k++) { u = a * u + b; L.push(u); } if (Math.abs(u) > 400) return null;
        return QN("Qu'affiche ce programme ?" + PY(["u = " + u0, "for k in range(" + n + "):", "    u = " + (a === -1 ? "-u" : a + " * u") + (b < 0 ? " - " + -b : " + " + b), "print(u)"]), u, "La boucle tourne " + M(n) + " fois : " + M(L.join(" \\to ")) + ".",
          { ctx: "suite", guide: [GS("Valeur de " + M("u") + " après le 1er tour ?", L[1], M(L[1]) + "."), GS("Après le 2e tour ?", L[2], M(L[2]) + "."), GS("Valeur affichée (après " + n + " tours) ?", u, M(u) + ".")], traps: [TR(L[n - 1], "range(" + n + ") fait " + n + " tours (k = 0 à " + (n - 1) + ")."), TR(a * L[n] + b, "range(" + n + ") fait exactement " + n + " tours, pas " + (n + 1) + ".")] }); },
    ],
  };

  // Chantier X (24.11) : fref, lecture sur figure (solutions lues sur la courbe, image lue, encadrement sur un intervalle).
  const sqF = (o = {}) => FIG.plot([{ f: (x) => x * x, from: o.from, to: o.to }].concat(o.more || []), o.pts || [], Object.assign({ numbers: true, xr: [-4, 4], yr: [-1, 10], squash: 0.62, label: "parabole y = x²" }, o.opt || {}));
  const OPS = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" };
  FREF[1].push(
    () => { const r = pk([2, 3, 1.5, 2.5]), k = r * r;
      return QSet("Sur le graphique de la fonction carré, on a tracé la droite " + M("y = " + nf(k)) + ". Lis les solutions de " + M("x^2 = " + nf(k)) + ". (Sépare-les par « ; ».)", [-r, r], "La droite coupe la parabole en deux points d'abscisses " + M(nf(-r)) + " et " + M(nf(r)) + " (symétriques par rapport à l'axe vertical).",
        { ctx: "carre-lu", fig: sqF({ opt: { hlines: [k] } }), guide: [GS("Abscisse du point d'intersection de droite" + (Number.isInteger(r) ? "" : " (à mi-chemin entre deux graduations)") + " ?", r, M(nf(r)) + "."), GSet("Les deux solutions ?", [-r, r], M(nf(-r)) + " et " + M(nf(r)) + ".")],
          traps: [TSet([r], "La droite coupe la parabole deux fois : n'oublie pas la solution négative."), TSet([k], "On cherche les abscisses x (axe horizontal), pas la hauteur " + nt(k) + "."), TSet([-Math.floor(r), Math.floor(r)], "Lis précisément : le point est à mi-chemin entre deux graduations.")] }); },
    () => { const x0 = pk([0.5, -0.5, 2, -2]), v = 1 / x0; /* pas ±4 : ordonnée 0,25 illisible */
      return QN("Le point " + M("M") + " est sur la courbe de la fonction inverse " + M("x \\mapsto \\frac{1}{x}") + ". Lis son abscisse sur le graphique, puis donne son ordonnée (nombre décimal accepté).", v, "On lit l'abscisse de " + M("M") + " : " + M(nf(x0)) + ". Son ordonnée est son image : " + M("\\frac{1}{" + nf(x0) + "} = " + nf(v)) + " (on peut la lire aussi sur l'axe vertical).",
        { ctx: "inverse-lu", fig: FIG.plot([{ f: (x) => (Math.abs(x) > 0.05 ? 1 / x : NaN) }], [[x0, v, "M"]], { numbers: true, xr: [-5, 5], yr: [-5, 5], label: "hyperbole y = 1/x" }), guide: [GS("Abscisse de " + M("M") + " (axe horizontal) ?", x0, M(nf(x0)) + "."), GS("Ordonnée = inverse de l'abscisse ?", v, M(nf(v)) + ".")],
          traps: [TR(x0, "Ça, c'est l'abscisse ; on demande l'ordonnée (axe vertical)."), TR(-v, "Le point est " + (v < 0 ? "sous" : "au-dessus de") + " l'axe horizontal : l'inverse garde le signe."), TR(-x0, "L'inverse n'est pas l'opposé.")] }); },
  );
  FREF[2].push(
    () => { let r1, r2; do { r1 = R.int(-3, 1); r2 = R.int(-1, 3); } while (r1 >= r2 || r1 === -r2); const m = r1 + r2, p = -r1 * r2;
      return QSet("On a tracé la parabole " + M("y = x^2") + " et une droite " + M("d") + ". Résous graphiquement " + M("x^2 = " + lin(m, p)) + " (équation de " + M("d") + "). (Sépare les solutions par « ; ».)", [r1, r2], "La droite coupe la parabole aux points d'abscisses " + M(r1) + " et " + M(r2) + " : ce sont les solutions. Vérification : " + M(par(r1) + "^2 = " + r1 * r1) + " et " + M(nf(m) + " \\cdot " + par(r1) + (p ? sg(p) : "") + " = " + (m * r1 + p)) + ".",
        { ctx: "carre-droite", fig: sqF({ more: [{ f: (x) => m * x + p, cls: "f-blue" }] }), guide: [GS("Abscisse du point d'intersection de gauche ?", r1, M(r1) + "."), GSet("Les deux solutions ?", [r1, r2], M(r1) + " et " + M(r2) + ".")],
          traps: [TSet([r1 * r1, r2 * r2], "Les solutions sont des abscisses (axe horizontal), pas les hauteurs des points."), TSet([-r1, -r2], "Vérifie le signe : regarde de quel côté de l'axe vertical sont les points.")] }); },
    () => { const c = pk([2, 3]), eqn = R.rand() < 0.5, k = c, sq = c * c;
      if (eqn) return QN("On a tracé la courbe de " + M("x \\mapsto \\sqrt{x}") + " et la droite " + M("y = \\frac{x}{" + c + "}") + ". Elles se coupent en deux points. Lis l'abscisse du point qui n'est pas l'origine : c'est la solution non nulle de " + M("\\sqrt{x} = \\frac{x}{" + c + "}") + ".", sq, "Les courbes se coupent en " + M("(0 \\,;\\, 0)") + " et " + M("(" + sq + " \\,;\\, " + c + ")") + " : " + M("\\sqrt{" + sq + "} = " + c + " = \\frac{" + sq + "}{" + c + "}") + ".",
        { ctx: "racine-droite", fig: FIG.plot([{ f: (x) => Math.sqrt(x), from: 0 }, { f: (x) => x / c, cls: "f-blue" }], [], { numbers: true, xr: [-1, sq + 1], yr: [-1, c + 1], label: "racine et droite" }), guide: [GS("Hauteur (ordonnée) du point d'intersection qui n'est pas l'origine ?", c, M(c) + "."), GS("Son abscisse (axe horizontal) ? Vérifie : " + M("\\sqrt{x}") + " doit valoir " + M(c) + ".", sq, M(sq) + " : " + M("\\sqrt{" + sq + "} = " + c) + " et " + M(sq + " : " + c + " = " + c) + ".")],
          traps: [TR(c, "Ça, c'est l'ordonnée du point (hauteur) ; on demande x."), TR(c * 2, "Lis l'abscisse sur l'axe horizontal.")] });
      const op = pk(["<=", "<"]), I = op === "<=", ivs = [[0, true, sq, I]];
      return QS("On a tracé la courbe de " + M("x \\mapsto \\sqrt{x}") + " et la droite " + M("y = " + k) + ". Résous graphiquement " + M("\\sqrt{x} " + OPS[op] + " " + k) + "." + SETQ, ivs, "La courbe est sous la droite pour " + M("x") + " entre " + M(0) + " (début de la courbe) et " + M(sq) + " (point d'intersection) : " + M("S = " + IV(ivs)) + ".",
        { ctx: "racine-lue", fig: FIG.plot([{ f: (x) => Math.sqrt(x), from: 0 }], [], { numbers: true, xr: [-1, sq + 1], yr: [-1, k + 1], hlines: [k], label: "racine et droite horizontale" }), guide: [GS("Abscisse du point où la courbe coupe la droite ?", sq, M(sq) + "."), GSS("Ensemble des solutions (la courbe commence en 0) ?", ivs, M(IV(ivs)) + ".")],
          traps: [TS([[-Infinity, false, sq, I]], "√x n'existe pas pour x < 0 : la courbe commence en 0."), TS([[0, true, k, I]], "Les solutions se lisent sur l'axe horizontal : jusqu'au point d'intersection (" + sq + ")."), TS([[sq, I, Infinity, false]], "Là, la courbe est AU-DESSUS de la droite.")] }); },
  );
  FREF[3].push(
    () => { const [c, r, lbl] = pk([[4, 2, "\\frac{x}{4}"], [1, 1, "x"], [0.25, 0.5, "4x"]]) /* pas x/9 : courbes presque confondues en ±3 */, op = pk([">=", ">", "<=", "<"]), I = op.length === 2, ge = op[0] === ">";
      const ivs = ge ? [[-Infinity, false, -r, I], [0, false, r, I]] : [[-r, I, 0, false], [r, I, Infinity, false]];
      return QS("On a tracé la courbe de " + M("x \\mapsto \\frac{1}{x}") + " et la droite " + M("y = " + lbl) + ". Lis les abscisses des points d'intersection, puis résous graphiquement " + M("\\frac{1}{x} " + OPS[op] + " " + lbl) + "." + SETQ, ivs,
        "Points d'intersection en " + M("x = " + nf(-r)) + " et " + M("x = " + nf(r)) + ". L'hyperbole est " + (ge ? "au-dessus" : "en dessous") + " de la droite " + (ge ? "à gauche de " + M(nf(-r)) + " et entre " + M(0) + " (exclu) et " + M(nf(r)) : "entre " + M(nf(-r)) + " et " + M(0) + " (exclu) et à droite de " + M(nf(r))) + " : " + M("S = " + IV(ivs)) + ".",
        { ctx: "inverse-droite", fig: FIG.plot([{ f: (x) => (Math.abs(x) > 0.05 ? 1 / x : NaN) }, { f: (x) => x / c, cls: "f-blue" }], [], { numbers: true, xr: [-4, 4], yr: [-4, 4], label: "hyperbole et droite" }), guide: [GS("Abscisse du point d'intersection de droite ?", r, M(nf(r)) + "."), GSS("Où l'hyperbole est-elle " + (ge ? "au-dessus" : "en dessous") + " de la droite (0 est exclu) ?", ivs, M(IV(ivs)) + ".")],
          traps: [TS(ge ? [[-r, I, 0, false], [r, I, Infinity, false]] : [[-Infinity, false, -r, I], [0, false, r, I]], "Regarde où l'hyperbole est " + (ge ? "AU-DESSUS" : "EN DESSOUS") + " de la droite."), TS(ge ? [[-r, I, r, I]] : [[-Infinity, false, -r, I], [r, I, Infinity, false]], "0 est une valeur interdite : la courbe change de côté en x = 0.")] }); },
    () => { const kind = pk(["mix", "neg", "pos"]), mx = kind === "mix" ? true : R.rand() < 0.5; let a, b; do { a = kind === "pos" ? R.int(1, 2) : R.int(-3, -1); b = kind === "neg" ? R.int(-2, -1) : kind === "pos" ? R.int(2, 3) : R.int(1, 3); } while (a >= b || Math.abs(a) === Math.abs(b) || (kind === "pos" && a >= b));
      const sqs = [a * a, b * b], v = mx ? Math.max(...sqs) : Math.min(...sqs), wrong = mx ? Math.min(...sqs) : Math.max(...sqs); if (Math.abs(v) < 2) return null;
      return QN("On a tracé la fonction carré pour " + M("x \\in [" + a + " \\,;\\, " + b + "]") + ". Lis sur le graphique la valeur " + (mx ? "maximale" : "minimale") + " de " + M("x^2") + " sur cet intervalle.", v, (kind === "mix" ? "L'intervalle contient 0 (minimum 0) ; " : kind === "neg" ? "Sur les négatifs, le carré est décroissant ; " : "Sur les positifs, le carré est croissant ; ") + "le point " + (mx ? "le plus haut" : "le plus bas") + " de l'arc est en " + M("x = " + (sqs.indexOf(v) ? b : a)) + " : " + M(v) + ".",
        { ctx: "encadrement-carre", fig: sqF({ from: a, to: b, pts: [[a, a * a, ""], [b, b * b, ""]] }), guide: [GS("Hauteur de l'extrémité gauche de l'arc (" + M("x = " + a) + ") ?", a * a, M(a * a) + "."), GS("De l'extrémité droite (" + M("x = " + b) + ") ?", b * b, M(b * b) + "."), GS("Valeur " + (mx ? "maximale" : "minimale") + " sur l'arc ?", v, M(v) + (kind === "mix" && !mx ? "" : ".") )],
          traps: [TR(wrong, kind === "neg" ? "Sur les négatifs, x² diminue quand x augmente : le plus grand carré est en " + a + "." : "Regarde la hauteur des deux extrémités de l'arc."), TR(mx ? b : a, "On demande une valeur de x² (hauteur), pas l'abscisse."), TR(kind === "mix" ? 0 : NaN, "0 est le minimum ; on demande le maximum.")] }); },
  );

  // ===================== problèmes en plusieurs étapes (niveau 4) =====================
  const PROBS = {
    probcond: [() => P("Dans un lycée de Nantes, 60 % des élèves sont demi-pensionnaires. Parmi eux, 30 % prennent le bus ; parmi les externes, 70 % prennent le bus.", [["a) P(D ∩ B)", 0.18], ["b) P(B)", 0.46], ["c) P_B(D), arrondie au centième", 0.39]], ["Arbre : D (0,6), puis B (0,3).", "P(B) = 0,6 × 0,3 + 0,4 × 0,7."], "a) " + M("0{,}6 \\times 0{,}3 = 0{,}18") + " ; b) " + M("0{,}18 + 0{,}4 \\times 0{,}7 = 0{,}46") + " ; c) " + M("\\frac{0{,}18}{0{,}46} \\approx 0{,}39") + ".")],
    tauxevol: [() => P("Le prix d'un forfait de ski à Chamonix augmente de 20 % en 2025, puis baisse de 10 % en 2026. Il valait 60 € au départ.", [["a) Prix après la hausse (€)", 72], ["b) Prix en 2026 (€)", 64.8], ["c) Taux d'évolution global (%)", 8]], ["Coefficient 1,2, puis 0,9.", "1,2 × 0,9 = 1,08."], "a) " + M("60 \\times 1{,}2 = 72") + " ; b) " + M("72 \\times 0{,}9 = 64{,}8") + " ; c) " + M("1{,}08") + " : " + M("+8\\,\\%") + ".")],
    proba2: [() => P("On lance deux fois un dé équilibré à 6 faces.", [["a) P(deux 6)", 1 / 36], ["b) P(aucun 6)", 25 / 36], ["c) P(au moins un 6)", 11 / 36]], ["Arbre : 1/6 puis 1/6.", "« Au moins un 6 » est le contraire de « aucun 6 »."], "a) " + M("\\frac{1}{36}") + " ; b) " + M("\\frac{5}{6} \\times \\frac{5}{6} = \\frac{25}{36}") + " ; c) " + M("1 - \\frac{25}{36} = \\frac{11}{36}") + ".")],
    algopy: [() => P("On considère la fonction Python ci-dessous." + PY(["def f(n):", "    s = 0", "    for i in range(1, n + 1):", "        s = s + i", "    return s"]), [["a) f(4)", 10], ["b) f(10)", 55], ["c) Plus petit n tel que f(n) > 100", 14]], ["f(n) = 1 + 2 + … + n.", "f(13) = 91, f(14) = 105."], "a) " + M("1 + 2 + 3 + 4 = 10") + " ; b) " + M("55") + " ; c) " + M("f(13) = 91") + ", " + M("f(14) = 105") + " : " + M("n = 14") + ".")],
  };
  PROBS.vect3e = [() => P("On donne A(1 ; 2), B(4 ; 3) et C(2 ; 6).", [["a) Abscisse de D tel que ABCD soit un parallélogramme", -1], ["b) Ordonnée de D", 5], ["c) Déterminant de AB et AC", 11]], ["AD = BC.", "AB(3 ; 1), AC(1 ; 4)."], "a), b) " + M("\\overrightarrow{BC}(-2 \\,;\\, 3)") + ", donc " + M("D(1 - 2 \\,;\\, 2 + 3) = (-1 \\,;\\, 5)") + " ; c) " + M("\\overrightarrow{AB}(3 \\,;\\, 1)") + ", " + M("\\overrightarrow{AC}(1 \\,;\\, 4)") + " : " + M("3 \\times 4 - 1 \\times 1 = 11") + ", non colinéaires.")];

  // ===================== enregistrement =====================
  const NEW = [
    ["ineq1", "fa", "Inéquations du 1er degré", "2x - 3 \\ge 5 \\iff x \\ge 4", [9, 6], [10], INEQ1, "Une inéquation se résout comme une équation ; on change le sens quand on multiplie ou divise par un nombre négatif.", ["Tester une valeur, résoudre ax ⩾ b", "Coefficient négatif, deux membres, lire une droite graduée", "Modéliser par une inéquation"]],
    ["proba2", "no", "Probabilités : contraire, deux épreuves, réunion", "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", [9, 9], [10], PROBA2, "Contraire : 1 − P(A). Deux épreuves : on multiplie le long d'une branche et on additionne les branches. « A ou B » : P(A) + P(B) − P(A ∩ B).", ["Évènement contraire, somme égale à 1", "Deux épreuves : arbre, avec ou sans remise", "Réunion et intersection"]],
    ["tabsignes", "fa", "Tableau de signes, inéquations produit et quotient", "\\frac{x - 1}{x + 3} \\ge 0", [10, 7], null, TSIG, "Une ligne par facteur (signe de ax + b : celui de a à droite du zéro), puis la règle des signes. Valeur interdite : double barre, toujours exclue.", ["Signe d'une expression affine", "Inéquation produit", "Inéquation quotient"]],
    ["tauxevol", "no", "Évolutions : coefficient multiplicateur, taux successifs et réciproque", "+20\\,\\% \\text{ puis } -10\\,\\% : \\times 1{,}08", [10, 5], null, TAUX, "Évoluer de t %, c'est multiplier par 1 + t/100. Évolutions successives : on multiplie les coefficients. Taux réciproque : coefficient inverse.", ["Coefficient multiplicateur, comparer deux valeurs", "Évolutions successives, proportion de proportion", "Taux réciproque, évolutions répétées"]],
    ["vect3e", "es", "Vecteurs et coordonnées", "\\overrightarrow{AB}\\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix}", [10, 9], null, VECT, "AB a pour coordonnées (x_B − x_A ; y_B − y_A). Chasles : AB + BC = AC. Colinéaires ⇔ déterminant x_u y_v − y_u x_v nul.", ["Lire et calculer des coordonnées, Chasles", "Somme, produit par un réel, parallélogramme", "Déterminant, colinéarité, alignement"]],
    ["fref", "fa", "Fonctions de référence : carré, inverse, racine", "x^2 \\le 9 \\iff -3 \\le x \\le 3", [10, 11], null, FREF, "Carré : décroissante sur ]−∞ ; 0], croissante sur [0 ; +∞[. Inverse : décroissante sur chacun de ses deux intervalles. Racine : croissante sur [0 ; +∞[.", ["Comparer des images, x² = k", "Inéquations x² ⩽ k, √x ⩽ k", "Inverse, encadrements"]],
    ["probcond", "no", "Probabilités conditionnelles, tableau croisé", "P_A(B) = \\frac{P(A \\cap B)}{P(A)}", [10, 14], [11], PCOND, "P_A(B) : on se place dans A (ligne ou colonne du tableau, ou branche de l'arbre). Le long d'un chemin, on multiplie ; on additionne les chemins.", ["Fréquences marginales et conditionnelles", "P_A(B) par tableau ou arbre", "P_B(A), faux positifs"]],
    ["algopy", "no", "Algorithmique : lire un programme Python", "\\texttt{for i in range(5)}", [10, 15], null, ALGO, "Suis le programme ligne par ligne en notant la valeur de chaque variable ; range(a, b) s'arrête à b − 1 ; if … elif … else : la première condition vraie l'emporte.", ["Affectations, fonctions", "Instructions conditionnelles", "Boucles for et while"]],
  ];
  for (const [id, theme, label, ex, fr, again, lv, hint, comps] of NEW) {
    if (!NOTIONS.find((n) => n.id === id)) NOTIONS.push(Object.assign({ id, theme, label, ex, CH: null, FR: fr }, again ? { againFR: again } : {}));
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    HINTS_EXTRA[id] = hint;
    if (typeof COMPS !== "undefined") COMPS[id] = comps;
    if (PROBS[id] && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[id] = PROBS[id];
  }

  // ===================== place des notions existantes en seconde (22.11) =====================
  // Notions qui apparaissent en seconde (programme 2026) : FR [10, rang].
  const FR_2NDE = { ensembles: 1, formule: 3, ineq: 7, absval: 10, racinv: 11, affzero: 12, inter: 12, optim: 13, cart: 8, droites: 9, droitesinter: 9, stats: 14 };
  for (const [id, k] of Object.entries(FR_2NDE)) { const n = NOTIONS.find((x) => x.id === id); if (n) n.FR = [10, k]; }
  // Retirés du programme de seconde 2026 : systèmes (masqués en France) ; degré 3 en terminale ; produit scalaire en 1re.
  for (const id of ["sys2", "sys3", "sysprob", "sysgraph"]) { const n = NOTIONS.find((x) => x.id === id); if (n) n.FR = null; }
  { const n = NOTIONS.find((x) => x.id === "eq3"); if (n) n.FR = [12, 3]; }
  { const n = NOTIONS.find((x) => x.id === "vecteurs"); if (n) n.FR = [11, 9]; }
  // Reprises en seconde (automatismes, rappels du collège) : « de l'année » pour un élève de seconde. Classe d'origine
  // (couverture_fr.md) seulement si la notion n'a pas encore de place en France (l'agent « collège » la fixe sinon).
  const AGAIN_2NDE = { fracops: 8, fracadd: 6, fracmul: 8, puiss: 8, fracconv: 6, ordgr: 6, uvol: 7, ucomp: 8, parenth: 7, distrib: 7, idrem: 9, factor: 7, eq1: 7, eq2fact: 9,
    valnum: 7, pct: 6, fractout: 6, pctvar: 8, fimg: 9, affine: 9, modaff: 9, lectgraph: 7, multdiv: 6, premiers: 8, fracsimp: 6, decarr: 6, racenc: 8, rac: 9, relrep: 7,
    statfreq: 7, diagr: 7, quartiles: 8, proba: 6 };
  for (const [id, g] of Object.entries(AGAIN_2NDE)) {
    const n = NOTIONS.find((x) => x.id === id); if (!n) continue;
    if (!n.FR) n.FR = [g, 0];
    n.againFR = [...new Set([...(n.againFR || []), 10])];
  }

  // ===================== ordre et chapitres de seconde (référentiel « FR ») =====================
  const CHAP = {
    "2AU": ["fracops", "fracadd", "fracmul", "puiss", "fracconv", "ordgr", "uvol", "ucomp", "parenth", "distrib", "idrem", "factor", "eq1", "eq2fact", "valnum", "pct", "fractout", "pctvar", "fimg", "affine"],
    "2NC": ["multdiv", "premiers", "fracsimp", "ensembles", "relrep", "decarr", "racenc", "rac", "formule", "ineq1", "ineq", "tabsignes"],
    "2GE": ["vect3e", "cart", "droites", "droitesinter"],
    "2AN": ["lectgraph", "modaff", "affzero", "fref", "racinv", "absval", "inter", "optim"],
    "2SP": ["tauxevol", "statfreq", "diagr", "stats", "quartiles", "proba", "proba2", "probcond"],
    "2AP": ["algopy"],
  };
  ORDRE.FR = ORDRE.FR || {}; ORDRE_THEME.FR = ORDRE_THEME.FR || {}; // 23.11 : ne pas effacer 1re/Tle (ordre.js, rangs ≥ 1000)
  let rk = 0;
  for (const [ch, ids] of Object.entries(CHAP)) for (const id of ids) { ORDRE.FR[id] = rk++; ORDRE_THEME.FR[id] = ch; }
  THEME_LABEL.FR = { "2AU": "Automatismes", "2NC": "Nombres et calculs", "2GE": "Géométrie", "2AN": "Fonctions", "2SP": "Statistiques et probabilités", "2AP": "Algorithmique et programmation" };
})();

// 22.11 · Collège français (6e, 5e, 4e, 3e) : rattachements, masquage des notions suisses, progression par classe,
// et notions propres aux programmes français (programmes de calcul, ratios, droite des milieux, structure d'une
// expression, motifs évolutifs, automatismes). Sources : tools/couverture_fr.md, tools/referentiels_fr.json.
// Codage des classes (comme SYSTEMS_HIDDEN.FR) : 6e = 6, 5e = 7, 4e = 8, 3e = 9 (2nde = 10, géré ailleurs).
// Texte en vigueur en 2026-2027 : 6e = cycle 3 2025 ; 5e = cycle 4 2026 ; 4e et 3e = programme 2020 + attendus 2019.
// Classe d'une notion = première de ces classes où un attendu la mobilise, corrigée à la main quand le contenu des
// questions ne convient pas (voir FR_OVERRIDE). againFR = classes suivantes qui la reprennent (attendus 2019 et 2026).
// Mécanisme de masquage : une notion dont le champ FR est null n'entre pas dans le catalogue d'un élève français
// (Engine.catalog filtre sur placeOf(n, profile) = n.FR).

// ---------- 1. Classe française des notions existantes : [classe, reprises] ----------
const FR_COLLEGE = {
    // 6e
    aire1: [6, [7, 8]], angtri: [6, [7]], angtype: [6, [7]], dec10: [6, [7, 8]], decadd: [6, [7]], decarr: [6], deccomp: [6],
    decdiv: [6, [7]], decmul: [6, [7]], decprob: [6, [7]], decread: [6], disque: [6, [7]], fracadd: [6, [7, 8, 9]], fracconv: [6, [7, 8]],
    fracrep: [6, [7, 8]], fracsimp: [6, [7, 8, 9]], fractout: [6, [7, 8]], multdiv: [6, [7]], ordgr: [6, [8]], pct: [6, [7, 8, 9]],
    perim: [6, [7]], prop: [6, [7, 8, 9]], proptab: [6, [7]], uaire: [6, [7]], ulong: [6, [7]], utemps: [6], volpave: [6, [7]],
    // 5e
    aire2: [7], aire3: [7], angles: [7], diagr: [7, [8, 9]], distrib: [7, [8, 9]], divcrit: [7, [9]], eq1: [7, [8, 9]], eqverif: [7, [8]],
    factor: [7, [8, 9]], litelab: [7, [8, 9]], parenth: [7, [9]], pow9: [7, [8, 9]], prio: [7], proba: [7, [8, 9]], probeq: [7, [8, 9]],
    quadri: [7, [8]], reduire: [7, [8, 9]], reladd: [7, [8]], relrep: [7, [8, 9]], repere: [7, [8, 9]], statfreq: [7, [8, 9]],
    symetries: [7, [8]], tradexpr: [7, [8]], uvol: [7], valnum: [7, [8, 9]], vitesse: [7], vol: [7, [8]],
    // 4e
    agrand: [8, [9]], carres: [8], cercthales: [8, [9]], echelle: [8, [9]], eqfrac: [8], fracmul: [8], fracops: [8, [9]],
    lectgraph: [8, [9]], monomes: [8], premiers: [8, [9]], puiss: [8, [9]], pyth: [8, [9]], pythfig: [8], pythrec: [8], quartiles: [8, [9]],
    racenc: [8], rel: [8], sci: [8, [9]], solides: [8, [9]], ucomp: [8, [9]], volcone: [8, [9]],
    // 3e
    affine: [9], eq2: [9], eq2fact: [9], fimg: [9], gquot: [9], idrem: [9], modaff: [9], pctvar: [9], rac: [9], rotation: [9], scicalc: [9],
    simil: [9], tabval: [9], thales: [9], thalesrec: [9], trigo: [9], volcomp: [9],
    // notions créées ci-dessous
    motifs: [6, [7]], automat: [6, [7, 8, 9]], structexpr: [7, [8, 9]], progcalc: [7, [8, 9]] /* 25.11 soir : 5e (5e.NC.11, cycle 4 2026) ; formes de 4e : HORS_FR, fr_couv.js */, ratio: [8, [9]], milieux: [8, [9]],
};
// Corrections manuelles de la « première classe » (déjà appliquées dans le tableau ci-dessus), pour mémoire :
// symetries 6e → 5e (images par coordonnées, relatifs) ; proba 6e → 5e (deux dés, tirages) ; echelle 6e → 4e (aires × k²) ;
// ulong 5e → 6e (conversions du cycle 3) ; lectgraph 5e → 4e et tabval 5e → 3e (notation f(x) : fonctions en 3e) ;
// trigo 4e → 3e (le cosinus seul est en 4e-2019 ; les questions mélangent sin, cos, tan).

// ---------- 2. Notions suisses masquées au collège français (FR null ; liste pour mémoire et pour les tests) ----------
// Aucun attendu français, vocabulaire ou contexte suisse, ou contenu hors programme au collège.
const FR_MASK = ["change", "pente", "polyreg", "grandmanq", "airelat", "voldecomp", "airepyr", "volmanq", "fracper", "racprop",
  "probeq2", "sysprob", "sysgraph", "euclide", "denombr", "arith" /* PGDC/PPMC : vocabulaire suisse, PGCD en Tle expertes */,
  "vabs" /* |x| : 2nde */, "droitesrem" /* centre de gravité, bissectrices : hors collège */, "fracrat", "vecteurs" /* norme, produit scalaire */];

// ---------- 3. Progression annuelle par classe (ordre d'ouverture des notions de l'année) ----------
const FR_PROGRESSION = {
  6: ["automat", "decread", "deccomp", "decarr", "decadd", "angtype", "multdiv", "decmul", "dec10", "perim", "fracrep", "fracsimp", "ulong",
    "fractout", "disque", "decdiv", "motifs", "prop", "aire1", "fracconv", "fracadd", "uaire", "proptab", "utemps", "ordgr", "decprob",
    "pct", "volpave", "angtri"],
  7: ["prio", "relrep", "reladd", "structexpr", "tradexpr", "progcalc", "litelab", "valnum", "divcrit", "angles", "quadri", "repere", "symetries",
    "eqverif", "distrib", "reduire", "parenth", "factor", "aire2", "aire3", "uvol", "vol", "pow9", "eq1", "probeq", "statfreq", "diagr",
    "proba", "vitesse"],
  8: ["rel", "fracmul", "fracops", "puiss", "sci", "carres", "racenc", "pyth", "pythrec", "pythfig", "cercthales", "premiers",
    "monomes", "eqfrac", "milieux", "echelle", "agrand", "ratio", "solides", "volcone", "ucomp", "quartiles", "lectgraph"],
  9: ["idrem", "eq2", "eq2fact", "rac", "scicalc", "thales", "thalesrec", "trigo", "tabval", "fimg", "affine", "modaff", "pctvar",
    "gquot", "volcomp", "rotation", "simil"],
};
// 23.11 : table propre au collège (ORDRE.FR = 2nde, 1re, Tle) ; les mêmes notions ont un autre rang au lycée.
ORDRE.FR_COL = {};
[6, 7, 8, 9].flatMap((g) => FR_PROGRESSION[g]).forEach((id, i) => { ORDRE.FR_COL[id] = i; });

// Application (en fin de fichier, après la création des notions françaises) : seules les classes 6e–3e sont touchées ;
// une notion rattachée à la 2nde ou au-delà (FR ≥ 10) garde sa valeur (chantier lycée).
function applyFrCollege() {
  for (const n of NOTIONS) {
    const t = FR_COLLEGE[n.id];
    /* 25.11 (audit France, tools/france.md) : fr_college.js est chargé après fr_2nde.js ; les reprises de seconde et au-delà
       (againFR ≥ 10 : automatismes de 2nde) étaient effacées ici (2nde : 19 notions « de l'année » au lieu de 52). Gardées. */
    if (t) { n.FR = [t[0]]; n.againFR = [...new Set([...(t[1] || []), ...(n.againFR || []).filter((g) => g >= 10)])]; continue; }
    // Ancienne valeur collège non confirmée, ou notion de FR_MASK placée au collège : masquée. FR ≥ 10 : inchangé.
    if (n.FR && n.FR[0] <= 9) n.FR = null;
  }
}

// ======================= 4. Notions françaises (22.11) =======================
// Standard de l'app : 3 niveaux, au moins 3 formes par niveau, pas à pas (guide), erreurs typiques (traps), étiquette ctx,
// leçon [titre, idée, règle, exemples, piège], 3 compétences. Usages France appliqués ici seulement : milliers « 1 200 »
// (espace fine), × pour le produit, euros et villes françaises, « antécédent ». Notions sans CH (France seulement).
const FR_NEW = [
  { id: "progcalc", theme: "fa", label: "Programmes de calcul", ex: "x \\to x + 3 \\to 2(x + 3) \\to 2x + 1" },
  { id: "ratio", theme: "fa", label: "Ratios et partage proportionnel", ex: "120 \\text{ € selon } 2\\,:\\,3 \\to 48 \\text{ € et } 72 \\text{ €}" },
  { id: "milieux", theme: "es", label: "Droite des milieux", ex: "IJ = \\frac{1}{2}\\,BC" },
  { id: "structexpr", theme: "fa", label: "Somme ou produit ? Termes, facteurs, opposé", ex: "5(x + 4) \\text{ est un produit}" },
  { id: "motifs", theme: "fa", label: "Suites de motifs", ex: "\\text{étape } n : 3n + 1 \\text{ allumettes}" },
  { id: "automat", theme: "no", label: "Automatismes de calcul mental", ex: "25\\,\\% \\text{ de } 36 = 9" },
];
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const r6 = (v) => +(+v).toFixed(6);
  // Nombre en TeX à la française : virgule décimale, espace fine pour les milliers (1 200).
  const N = (v) => { let [i, f] = String(r6(v)).split("."); const sg = i.startsWith("-") ? "-" : ""; i = i.replace("-", ""); if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return sg + i + (f ? "{,}" + f : ""); };
  const P = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value: r6(value) }, sol, guide: o.guide, traps: keep(r6(value), o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const G = (ask, value, sol) => GS(ask, r6(value), sol);
  const TR = (v, m) => TRAP(r6(v), m);
  const Qx = (q, e, sol, o = {}) => { const x = { q, spec: Object.assign({ kind: "expr", expr: e }, o.form ? { form: o.form } : {}), sol, guide: o.guide, ctx: o.ctx };
    let target = null; try { target = Expr.parse(e); } catch (er) {}
    x.traps = (o.traps || []).filter((tr) => { try { return !target || !Expr.equivalent(Expr.parse(tr.e), target); } catch (er) { return false; } });
    if (o.fig) x.fig = o.fig; return x; };
  const GX = (ask, e, sol, form) => ({ ask, spec: Object.assign({ kind: "expr", expr: e }, form ? { form } : {}), sol });
  const TX = (e, m) => ({ e, m });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: vals }, sol });
  const Pb = (q, parts, hints, sol, fig) => ({ fig, q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value: r6(value) } })), hints, sol });
  const who = () => pk(["Léa", "Hugo", "Chloé", "Nathan", "Manon", "Louis", "Camille", "Jules", "Inès", "Gabriel"]);
  const ville = () => pk(["Lyon", "Lille", "Nantes", "Toulouse", "Bordeaux", "Strasbourg", "Rennes", "Marseille", "Montpellier", "Dijon"]);
  // Polynôme en x (coefficients [c0, c1, c2]) : écriture réduite (TeX et saisie : « 3x^2 - 5x + 2 »).
  const pol = (c, v = "x") => poly([c[2] || 0, c[1] || 0, c[0] || 0].filter((t, i, a) => i === 2 || a.slice(0, i + 1).some((u) => u !== 0)), v);

  // ===================== progcalc : programmes de calcul =====================
  // Étape : texte, effet sur un nombre (v = résultat courant, x0 = nombre de départ), effet sur le polynôme.
  const S = {
    add: (k) => ({ t: "Ajouter " + N(k) + ".", f: (v) => v + k, p: (c) => [c[0] + k, c[1], c[2]], tx: (e) => e + " + " + N(k), op: "+ " + k }),
    sub: (k) => ({ t: "Soustraire " + N(k) + ".", f: (v) => v - k, p: (c) => [c[0] - k, c[1], c[2]], tx: (e) => e + " - " + N(k), op: "− " + k }),
    mul: (k) => ({ t: "Multiplier par " + N(k) + ".", f: (v) => v * k, p: (c) => c.map((u) => u * k), tx: (e) => N(k) + "(" + e + ")", op: "× " + k }),
    sq: () => ({ t: "Élever le résultat au carré.", f: (v) => v * v, p: (c) => [c[0] * c[0], 2 * c[0] * c[1], c[1] * c[1]], tx: (e) => "(" + e + ")^2", op: "²" }),
    addX: () => ({ t: "Ajouter le nombre de départ.", f: (v, x0) => v + x0, p: (c) => [c[0], c[1] + 1, c[2]], tx: (e) => e + " + x", op: "+ départ" }),
    subX2: () => ({ t: "Soustraire le carré du nombre de départ.", f: (v, x0) => v - x0 * x0, p: (c) => [c[0], c[1], c[2] - 1], tx: (e) => e + " - x^2", op: "− départ²" }),
  };
  const prog = (steps, name) => "<b>" + (name || "Programme") + "</b><br>• Choisir un nombre.<br>" + steps.map((s) => "• " + s.t).join("<br>");
  const run = (steps, x0) => { const out = []; let v = x0; for (const s of steps) { v = s.f(v, x0); out.push(v); } return out; };
  const runP = (steps) => steps.reduce((c, s) => s.p(c), [0, 1, 0]);
  const stepGuide = (steps, x0) => { const vs = run(steps, x0); return steps.map((s, i) => G("« " + s.t.replace(/\.$/, "") + " » : résultat ?", vs[i], M((i ? N(vs[i - 1]) : N(x0)) + "\\ \\to\\ " + N(vs[i])) + ".")); };
  const PC = {
    1: [
      () => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 19), x0 = R.int(3, 12), st = [S.add(a), S.mul(b), S.sub(c)], v = run(st, x0)[2];
        return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M("(" + x0 + " + " + a + ") \\times " + b + " - " + c + " = " + (x0 + a) + " \\times " + b + " - " + c + " = " + N(v)) + ".",
          { ctx: "appliquer", guide: stepGuide(st, x0), traps: [TR(x0 + a * b - c, "On multiplie le résultat de l'étape précédente, " + (x0 + a) + ", pas seulement " + a + " : il faut des parenthèses."), TR((x0 + a) * b + c, "La dernière étape soustrait " + c + ".")] }); },
      () => { const b = R.int(2, 5), a = R.int(3, 12), c = R.int(2, 4), x0 = -R.int(2, 9), st = [S.mul(b), S.add(a), S.mul(c)], vs = run(st, x0), v = vs[2];
        if (vs[1] === 0) return null;
        return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M("(" + P(x0) + " \\times " + b + " + " + a + ") \\times " + c + " = " + P(vs[1]) + " \\times " + c + " = " + N(v)) + ".",
          { ctx: "negatif", guide: stepGuide(st, x0), traps: [TR((-x0 * b + a) * c, "Le nombre de départ est négatif : " + P(x0) + " × " + b + " = " + N(x0 * b) + "."), TR(x0 * b + a * c, "On multiplie tout le résultat " + P(vs[1]) + " par " + c + ".")] }); },
      () => { const b = R.int(2, 6), a = R.int(2, 15), x0 = R.int(4, 15), st = [S.mul(b), S.sub(a), S.addX()], vs = run(st, x0), v = vs[2];
        return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M(x0 + " \\times " + b + " - " + a + " + " + x0 + " = " + N(v)) + " : la dernière étape rajoute le nombre de départ, " + M(N(x0)) + ".",
          { ctx: "depart", guide: stepGuide(st, x0), traps: [TR(vs[1], "Il reste la dernière étape : ajouter le nombre de départ."), TR(vs[1] * 2, "On ajoute le nombre de départ (" + x0 + "), pas le résultat obtenu.")] }); },
      () => { const a = R.int(2, 7), x0 = R.int(2, 9), st = [S.add(a), S.sq()], v = run(st, x0)[1];
        return Qv(prog(st) + "<br>On choisit " + M(N(x0)) + ". Quel résultat obtient-on ?", v, M("(" + x0 + " + " + a + ")^2 = " + (x0 + a) + "^2 = " + v) + ".",
          { ctx: "carre", guide: stepGuide(st, x0), traps: [TR(x0 * x0 + a * a, "On élève au carré le résultat, " + (x0 + a) + ", pas chaque nombre séparément."), TR(2 * (x0 + a), "Élever au carré, c'est multiplier par lui-même, pas par 2.")] }); },
    ],
    2: [
      () => { const b = R.int(2, 5), a = R.int(2, 9), c = R.int(2, 4), x0 = R.int(2, 12), st = [S.mul(b), S.add(a), S.mul(c)], vs = run(st, x0), Rv = vs[2];
        return Qv(prog(st) + "<br>" + who() + " obtient " + M(N(Rv)) + ". Quel nombre a été choisi au départ ?", x0, "On remonte le programme avec les opérations inverses : " + M(N(Rv) + " \\div " + c + " = " + N(vs[1])) + ", " + M(N(vs[1]) + " - " + a + " = " + N(vs[0])) + ", " + M(N(vs[0]) + " \\div " + b + " = " + N(x0)) + ".",
          { ctx: "remonter", guide: [G("Avant « Multiplier par " + c + " », on avait ?", vs[1], M(N(Rv) + " \\div " + c + " = " + N(vs[1])) + "."), G("Avant « Ajouter " + a + " » ?", vs[0], M(N(vs[1]) + " - " + a + " = " + N(vs[0])) + "."), G("Nombre de départ ?", x0, M(N(vs[0]) + " \\div " + b + " = " + N(x0)) + ".")],
            traps: [TR(((Rv - a) / b) / c, "On défait les étapes dans l'ordre inverse : d'abord la dernière (÷ " + c + ")."), TR(run(st, Rv)[2], "On ne réapplique pas le programme : on le remonte avec les opérations inverses.")] }); },
      () => { const a = R.int(2, 9), b = R.int(2, 6), c = R.int(2, 20), st = [S.add(a), S.mul(b), S.sub(c)], cf = runP(st);
        if (cf[0] === 0) return null;
        const e = pol(cf);
        return Qx(prog(st) + "<br>On choisit le nombre " + M("x") + ". Écris le résultat en fonction de " + M("x") + ", sous forme réduite.", e, M(b + "(x + " + a + ") - " + c + " = " + b + "x + " + a * b + " - " + c + " = " + e) + ".",
          { ctx: "expression", form: "reduced", guide: [GX("Après « Ajouter " + a + " » :", "x+" + a, M("x + " + a) + "."), GX("Après « Multiplier par " + b + " » (avec des parenthèses) :", b + "*(x+" + a + ")", M(b + "(x + " + a + ")") + "."), GX("Après « Soustraire " + c + " », réduit :", e, M(e) + ".", "reduced")],
            traps: [TX("x+" + (a * b - c), "On multiplie toute la somme x + " + a + " par " + b + ", donc aussi x."), TX(b + "x+" + (a - c), "Développe : " + b + " × " + a + " = " + a * b + ".")] }); },
      () => { const b = R.int(2, 5), a = R.int(2, 12), x0 = R.int(2, 11), st = [S.mul(b), S.sub(a), S.addX()], Rv = run(st, x0)[2], cf = runP(st), e = pol(cf);
        return Qv(prog(st) + "<br>Quel nombre faut-il choisir au départ pour obtenir " + M(N(Rv)) + " ?", x0, "Avec " + M("x") + " au départ, le programme donne " + M(b + "x - " + a + " + x = " + e) + ". On résout " + M(e + " = " + N(Rv)) + " : " + M((b + 1) + "x = " + N(Rv + a)) + ", " + M("x = " + N(x0)) + ".",
          { ctx: "equation", guide: [GX("Écris le résultat en fonction de " + M("x") + " (réduit).", e, M(e) + "."), G("Résous " + M(e + " = " + N(Rv)) + ". Que vaut " + M("x") + " ?", x0, M((b + 1) + "x = " + N(Rv + a)) + " donc " + M("x = " + N(x0)) + ".")],
            traps: [TR((Rv + a) / b, "Le nombre de départ est ajouté à la fin : il y a " + (b + 1) + "x en tout, pas " + b + "x."), TR(Rv - a, "Mets le programme en équation : " + e + " = " + Rv + ".")] }); },
    ],
    3: [
      () => { const a = R.int(2, 9), sg = pk([1, -1]), st = [sg > 0 ? S.add(a) : S.sub(a), S.sq(), S.subX2()], cf = runP(st), e = pol(cf), dv = sg > 0 ? "x^2 + " + 2 * a + "x + " + a * a : "x^2 - " + 2 * a + "x + " + a * a;
        return Qx(prog(st) + "<br>Montre que le résultat est une expression du premier degré : écris-le en fonction du nombre de départ " + M("x") + ", sous forme réduite.", e, M("(x " + (sg > 0 ? "+ " : "- ") + a + ")^2 - x^2 = " + dv + " - x^2 = " + e) + ".",
          { ctx: "prouver-carre", form: "reduced", guide: [GX("Après les deux premières étapes : écris le carré.", "(x" + (sg > 0 ? "+" : "-") + a + ")^2", M("(x " + (sg > 0 ? "+ " : "- ") + a + ")^2") + "."), GX("Développe ce carré (identité remarquable).", dv.replace(/ /g, ""), M(dv) + "."), GX("Soustrais " + M("x^2") + " et réduis.", e, M(e) + ".", "reduced")],
            traps: [TX(String(a * a), "N'oublie pas le double produit : (x " + (sg > 0 ? "+" : "−") + " " + a + ")² = x² " + (sg > 0 ? "+" : "−") + " " + 2 * a + "x + " + a * a + "."), TX((sg > 0 ? "" : "-") + 2 * a + "x-" + a * a, "Le carré " + a + "² = " + a * a + " est positif.")] }); },
      () => { const k = R.int(2, 5), m = R.int(2, 9), stA = [S.mul(k), S.add(k * m), S.mul(2)], stB = [S.add(m), S.mul(2 * k)], e = pol(runP(stA));
        return Qx(prog(stA, "Programme A") + "<br>" + prog(stB, "Programme B") + "<br>Prouve que les deux programmes donnent toujours le même résultat : écris ce résultat en fonction du nombre de départ " + M("x") + ", sous forme réduite.", e,
          "A : " + M("2(" + k + "x + " + k * m + ") = " + e) + ". B : " + M(2 * k + "(x + " + m + ") = " + e) + ". Même expression : même résultat pour tout nombre de départ.",
          { ctx: "prouver-egal", form: "reduced", guide: [GX("Programme A, en fonction de " + M("x") + " (réduit) :", e, M("2(" + k + "x + " + k * m + ") = " + e) + ".", "reduced"), GX("Programme B, en fonction de " + M("x") + " (réduit) :", e, M(2 * k + "(x + " + m + ") = " + e) + " : c'est la même expression.", "reduced")],
            traps: [TX(2 * k + "x+" + m, "Développe 2k(x + m) : chaque terme est multiplié."), TX(k + "x+" + 2 * k * m, "Dans A, la dernière étape multiplie tout le résultat par 2.")] }); },
      () => { const a = R.int(2, 6), t = R.int(a + 1, 12), Rv = t * t - a * a, st = [S.add(a)];
        const txt = "<b>Programme</b><br>• Choisir un nombre.<br>• Lui ajouter " + a + ".<br>• Multiplier le résultat par le nombre de départ diminué de " + a + ".";
        return { q: txt + "<br>Quels nombres de départ donnent " + M(N(Rv)) + " ? (sépare les solutions par « ; »)", spec: { kind: "set", values: [-t, t] }, ctx: "produit",
          sol: "Avec " + M("x") + " : " + M("(x + " + a + ")(x - " + a + ") = x^2 - " + a * a) + ". On résout " + M("x^2 - " + a * a + " = " + N(Rv)) + " : " + M("x^2 = " + t * t) + ", donc " + M("x = " + t) + " ou " + M("x = -" + t) + ".",
          guide: [GX("Écris le résultat en fonction de " + M("x") + ", développé et réduit.", "x^2-" + a * a, M("(x + " + a + ")(x - " + a + ") = x^2 - " + a * a) + "."), G("Que vaut alors " + M("x^2") + " ?", t * t, M("x^2 = " + N(Rv) + " + " + a * a + " = " + t * t) + "."), GSet("Quels nombres ont pour carré " + t * t + " ?", [-t, t], M(t) + " et " + M("-" + t) + ".")],
          traps: [TR(t, "Deux nombres ont pour carré " + t * t + ", à savoir " + t + " et −" + t + "."), TR(Math.sqrt(Rv), "Calcule d'abord le résultat en fonction de x : x² − " + a * a + ".")] }; },
    ],
  };
  const PCPROB = [() => {
    const a = R.int(2, 6), b = R.int(2, 4), c = R.int(1, 9), e = b + R.int(1, 3), xs = R.int(2, 9), d = (b - e) * xs + a * b - c, stA = [S.add(a), S.mul(b), S.sub(c)], stB = [S.mul(e), d >= 0 ? S.add(d) : S.sub(-d)], x0 = 3;
    return Pb(prog(stA, "Programme A") + "<br>" + prog(stB, "Programme B"), [["a) Résultat de A avec 3", run(stA, x0)[2]], ["b) Résultat de B avec 3", run(stB, x0)[1]], ["c) Nombre de départ qui donne le même résultat avec A et B", xs]],
      ["Avec x : A donne " + b + "(x + " + a + ") − " + c + " = " + pol(runP(stA)) + ".", "B donne " + pol(runP(stB)) + " ; résous l'égalité des deux expressions."],
      "a) " + M("(3 + " + a + ") \\times " + b + " - " + c + " = " + run(stA, x0)[2]) + ". b) " + M("3 \\times " + e + (d >= 0 ? " + " + d : " - " + -d) + " = " + run(stB, x0)[1]) + ". c) " + M(pol(runP(stA)) + " = " + pol(runP(stB))) + " donne " + M("x = " + xs) + ".");
  }];

  // ===================== ratio : ratios et partage proportionnel =====================
  const RT = (a, b, c) => M(a + "\\,:\\," + b + (c ? "\\,:\\," + c : ""));
  const RAT = {
    1: [
      () => { const [a, b] = pk([[2, 3], [3, 5], [1, 4], [3, 4], [2, 5], [5, 7], [4, 5], [1, 3], [3, 7]]), u = R.int(4, 30), S0 = u * (a + b), p1 = who(), p2 = who(), two = R.rand() < 0.5, v = (two ? b : a) * u;
        if (p1 === p2) return null;
        return Qv(p1 + " et " + p2 + " se partagent " + M(N(S0)) + " € selon le ratio " + RT(a, b) + " (" + p1 + " d'abord). Combien reçoit " + (two ? p2 : p1) + " (en €) ?", v,
          "Il y a " + M(a + " + " + b + " = " + (a + b)) + " parts ; une part vaut " + M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " € ; " + (two ? p2 : p1) + " reçoit " + M((two ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.",
          { ctx: "partage", guide: [G("Combien de parts en tout ?", a + b, M(a + " + " + b + " = " + (a + b)) + "."), G("Valeur d'une part (en €) ?", u, M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " €."), G("Part de " + (two ? p2 : p1) + " (en €) ?", v, M((two ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.")],
            traps: [TR(S0 / 2, "Le partage n'est pas égal : il suit le ratio " + a + " ∶ " + b + "."), TR(u, "C'est la valeur d'une part ; " + (two ? p2 : p1) + " en reçoit " + (two ? b : a) + "."), TR((two ? a : b) * u, "C'est la part de " + (two ? p1 : p2) + ".")] }); },
      () => { const [a, b] = pk([[2, 3], [3, 4], [1, 2], [3, 5], [2, 7], [4, 5], [5, 6], [1, 3]]), k = R.int(2, 9), c = pk([["filles", "garçons", "Dans un club de basket de " + ville() + ", il y a"], ["romans", "BD", "Au CDI, on compte"], ["chats", "chiens", "Dans un refuge de " + ville() + ", il y a"], ["adultes", "enfants", "Dans un car pour " + ville() + ", il y a"]]);
        return { q: c[2] + " " + M(a * k) + " " + c[0] + " et " + M(b * k) + " " + c[1] + ". Écris le ratio " + c[0] + " : " + c[1] + " sous forme irréductible. Réponds « a ; b ».", spec: { kind: "pair", values: [a, b] }, ctx: "simplifier",
          sol: "On divise les deux nombres par " + k + " : " + RT(a * k, b * k) + " = " + RT(a, b) + ".",
          guide: [G("Par quel plus grand nombre peut-on diviser " + (a * k) + " et " + (b * k) + " ?", k, M(a * k + " = " + k + " \\times " + a) + " et " + M(b * k + " = " + k + " \\times " + b) + "."), { ask: "Ratio irréductible ? Réponds « a ; b ».", spec: { kind: "pair", values: [a, b] }, sol: RT(a, b) + "." }],
          traps: [TR(a / b, "Un ratio s'écrit avec deux nombres : réponds « " + a + " ; " + b + " ».")] }; },
      () => { const c = pk([["une vinaigrette", "d'huile", "de vinaigre", "cL", 3, 1], ["un mortier", "de sable", "de ciment", "seaux", 4, 1], ["un sirop dilué", "d'eau", "de sirop", "cL", 7, 1], ["une peinture verte", "de jaune", "de bleu", "L", 2, 3], ["un cocktail de fruits", "de jus d'orange", "de jus d'ananas", "cL", 3, 2]]), [, x, y, un, a, b] = c, k = R.int(2, 12), rev = R.rand() < 0.5;
        const given = rev ? a * k : b * k, v = rev ? b * k : a * k;
        return Qv("Pour " + c[0] + ", les quantités " + x + " et " + y + " sont dans le ratio " + RT(a, b) + ". On utilise " + M(given) + " " + un + " " + (rev ? x : y) + ". Combien de " + un + " " + (rev ? y : x) + " faut-il ?", v,
          "Une part vaut " + M(given + " \\div " + (rev ? a : b) + " = " + k) + " " + un + " ; il faut " + M((rev ? b : a) + " \\times " + k + " = " + v) + " " + un + ".",
          { ctx: "recette", guide: [G("Valeur d'une part (" + un + ") ?", k, M(given + " \\div " + (rev ? a : b) + " = " + k) + "."), G("Quantité cherchée (" + un + ") ?", v, M((rev ? b : a) + " \\times " + k + " = " + v) + ".")],
            traps: [TR(rev ? given * a / b : given * b / a, "Le ratio est " + a + " ∶ " + b + " dans l'ordre « " + x.replace(/^d(e |')/, "") + " : " + y.replace(/^d(e |')/, "") + " »."), TR(given + Math.abs(a - b), "Ce n'est pas une différence fixe : on multiplie chaque part par le même nombre.")] }); },
    ],
    2: [
      () => { const t = pk([[1, 2, 3], [2, 3, 5], [1, 3, 4], [2, 3, 4], [3, 4, 5], [1, 2, 5], [2, 5, 7]]), su = t[0] + t[1] + t[2], u = R.int(3, 25) * 2, Mt = su * u, i = R.int(0, 2), nm = ["premier", "deuxième", "troisième"][i];
        const c = pk([["Une coopérative de Bretagne partage", "kg de pommes", "entre trois épiceries"], ["Un producteur de la Drôme répartit", "kg d'abricots", "entre trois marchés"], ["Une boulangerie de " + ville() + " partage", "kg de farine", "entre trois fournées"]]);
        return Qv(c[0] + " " + M(N(Mt)) + " " + c[1] + " " + c[2] + " selon le ratio " + RT(t[0], t[1], t[2]) + ". Quelle masse reçoit le " + nm + " (en kg) ?", t[i] * u,
          M(t[0] + " + " + t[1] + " + " + t[2] + " = " + su) + " parts ; une part : " + M(N(Mt) + " \\div " + su + " = " + N(u)) + " kg ; le " + nm + " reçoit " + M(t[i] + " \\times " + N(u) + " = " + N(t[i] * u)) + " kg.",
          { ctx: "trois", guide: [G("Nombre total de parts ?", su, M(t[0] + " + " + t[1] + " + " + t[2] + " = " + su) + "."), G("Une part (kg) ?", u, M(N(Mt) + " \\div " + su + " = " + N(u)) + "."), G("Masse du " + nm + " (kg) ?", t[i] * u, M(t[i] + " \\times " + N(u) + " = " + N(t[i] * u)) + ".")],
            traps: [TR(Mt / 3, "Le partage suit le ratio, il n'est pas égal."), TR(Mt * t[i] / 10, "On divise par le nombre total de parts (" + su + "), pas par 10.")] }); },
      () => { const [a, b] = pk([[2, 3], [3, 5], [4, 7], [3, 4], [5, 8], [2, 5]]), u = R.int(3, 15), tot = R.rand() < 0.5, c = pk([["garçons", "filles", "Dans un collège de " + ville() + ", le ratio garçons : filles est"], ["élèves demi-pensionnaires", "élèves externes", "Dans une classe, le ratio demi-pensionnaires : externes est"], ["billes rouges", "billes bleues", "Dans un sac, le ratio rouges : bleues est"]]), v = tot ? (a + b) * u : b * u;
        return Qv(c[2] + " " + RT(a, b) + ". Il y a " + M(a * u) + " " + c[0] + ". " + (tot ? "Combien y en a-t-il en tout ?" : "Combien y a-t-il de " + c[1] + " ?"), v,
          M(a * u + " \\div " + a + " = " + u) + " par part ; " + (tot ? M((a + b) + " \\times " + u + " = " + v) + " en tout." : M(b + " \\times " + u + " = " + v) + " " + c[1] + "."),
          { ctx: "partconnue", guide: [G("Combien vaut une part ?", u, M(a * u + " \\div " + a + " = " + u) + "."), G(tot ? "Effectif total ?" : "Nombre de " + c[1] + " ?", v, (tot ? M((a + b) + " \\times " + u) : M(b + " \\times " + u)) + " " + M("= " + v) + ".")],
            traps: [TR(a * u + b, "Le ratio n'ajoute pas " + b + " : chaque part vaut " + u + "."), TR(tot ? b * u : (a + b) * u, tot ? "Ajoute aussi les " + c[0] + "." : "On demande seulement les " + c[1] + ".")] }); },
      () => { const g = R.int(2, 6), [a, b] = pk([[2, 3], [3, 4], [3, 5], [4, 5], [5, 6]]), x = a * g, y = b * g, u = R.int(3, 20) * 5, S0 = (a + b) * u, old = R.rand() < 0.5;
        const c = pk([["Deux sœurs de " + x + " et " + y + " ans se partagent " + M(N(S0)) + " € proportionnellement à leur âge.", "la plus âgée", "la plus jeune"], ["Deux amis ont payé " + x + " € et " + y + " € un billet de loterie qui gagne " + M(N(S0)) + " €. Ils partagent le gain proportionnellement à leur mise.", "celui qui a payé " + y + " €", "celui qui a payé " + x + " €"]]);
        const v = (old ? b : a) * u;
        return Qv(c[0] + " Combien reçoit " + (old ? c[1] : c[2]) + " (en €) ?", v, "Ratio " + RT(x, y) + " = " + RT(a, b) + " ; " + (a + b) + " parts de " + M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " € ; part : " + M((old ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.",
          { ctx: "ages", guide: [G("Ratio simplifié " + x + " ∶ " + y + " = " + a + " ∶ … ?", b, RT(x, y) + " = " + RT(a, b) + " (on divise par " + g + ")."), G("Valeur d'une part (en €) ?", u, M(N(S0) + " \\div " + (a + b) + " = " + N(u)) + " €."), G("Part demandée (en €) ?", v, M((old ? b : a) + " \\times " + N(u) + " = " + N(v)) + " €.")],
            traps: [TR(S0 / 2, "Le partage est proportionnel, pas égal."), TR((old ? a : b) * u, "C'est l'autre part.")] }); },
    ],
    3: [
      () => { const [a, b] = pk([[3, 5], [4, 7], [2, 5], [5, 8], [3, 8], [5, 9]]), u = R.int(4, 30), d = (b - a) * u, S0 = (a + b) * u;
        return Qv("Une somme est partagée selon le ratio " + RT(a, b) + ". La plus grande part dépasse la plus petite de " + M(N(d)) + " €. Quelle est la somme partagée (en €) ?", S0,
          "L'écart correspond à " + M(b + " - " + a + " = " + (b - a)) + " parts, donc une part vaut " + M(N(d) + " \\div " + (b - a) + " = " + N(u)) + " € ; la somme est " + M((a + b) + " \\times " + N(u) + " = " + N(S0)) + " €.",
          { ctx: "ecart", guide: [G("L'écart correspond à combien de parts ?", b - a, M(b + " - " + a + " = " + (b - a)) + "."), G("Valeur d'une part (en €) ?", u, M(N(d) + " \\div " + (b - a) + " = " + N(u)) + " €."), G("Somme partagée (en €) ?", S0, M((a + b) + " \\times " + N(u) + " = " + N(S0)) + " €.")],
            traps: [TR(d * (a + b), "Divise d'abord l'écart par le nombre de parts d'écart (" + (b - a) + ")."), TR(b * u, "C'est seulement la plus grande part.")] }); },
      () => { const [a, b] = pk([[2, 3], [1, 4], [3, 5], [3, 7], [1, 3], [5, 7], [2, 7]]), c = pk([["garçons", "filles", "Dans une classe"], ["élèves qui mangent à la cantine", "élèves qui rentrent chez eux", "Dans un collège de " + ville()], ["voitures électriques", "voitures thermiques", "Sur un parking de " + ville()]]), pct = 100 % (a + b) === 0 && R.rand() < 0.5, v = pct ? 100 * b / (a + b) : b / (a + b);
        return Qv(c[2] + ", le ratio " + c[0] + " : " + c[1] + " est " + RT(a, b) + ". " + (pct ? "Quel pourcentage du total représentent les " + c[1] + " ?" : "Quelle fraction du total représentent les " + c[1] + " ? (fraction)"), v,
          "Sur " + M(a + " + " + b + " = " + (a + b)) + " parts, " + b + " sont des " + c[1] + " : " + M("\\frac{" + b + "}{" + (a + b) + "}") + (pct ? " " + M("= " + N(v) + "\\,\\%") : "") + ".",
          { ctx: "fraction", guide: [G("Nombre total de parts ?", a + b, M(a + " + " + b + " = " + (a + b)) + "."), G(pct ? "Pourcentage ?" : "Fraction du total ?", v, M("\\frac{" + b + "}{" + (a + b) + "}") + (pct ? " = " + N(v) + " %" : "") + ".")],
            traps: [TR(pct ? 100 * b / a : b / a, "Le ratio compare les deux groupes ; ici on compare au total (" + (a + b) + " parts)."), TR(pct ? 100 * a / (a + b) : a / (a + b), "C'est la part des " + c[0] + ".")] }); },
      () => { const [a, b] = pk([[2, 3], [1, 2], [3, 4], [2, 5], [3, 2]]), uj = R.int(2, 8), ub = uj + pk([-2, -1, 1, 2, 3]); if (ub < 1 || ub === uj) return null;
        const J = a * uj, B = b * ub, m = Math.min(uj, ub), v = (a + b) * m;
        return Qv("Pour obtenir du vert, on mélange du jaune et du bleu dans le ratio " + RT(a, b) + ". On dispose de " + M(J) + " L de jaune et de " + M(B) + " L de bleu. Quelle quantité maximale de vert peut-on préparer (en L) ?", v,
          "Le jaune permet " + M(J + " \\div " + a + " = " + uj) + " lots, le bleu " + M(B + " \\div " + b + " = " + ub) + " lots : on peut en faire " + m + ", soit " + M((a + b) + " \\times " + m + " = " + v) + " L.",
          { ctx: "melange", guide: [G("Nombre de « parts » possibles avec le jaune (" + J + " ÷ " + a + ") ?", uj, M(uj) + "."), G("Avec le bleu (" + B + " ÷ " + b + ") ?", ub, M(ub) + "."), G("Quantité maximale de vert (L) ?", v, "On est limité à " + m + " : " + M((a + b) + " \\times " + m + " = " + v) + " L.")],
            traps: [TR(J + B, "On ne peut pas tout utiliser : il faut respecter le ratio " + a + " ∶ " + b + "."), TR((a + b) * Math.max(uj, ub), "La couleur qui manque le plus limite la quantité.")] }); },
    ],
  };
  const RATPROB = [() => { const t = pk([[2, 3, 5], [1, 2, 3], [3, 4, 5], [2, 3, 4]]), k = R.int(2, 6) * 1000, su = t[0] + t[1] + t[2], u = R.int(2, 9) * 50, B = su * u;
    return Pb("Trois associées d'une entreprise de " + ville() + " ont apporté " + M(N(t[0] * k)) + " €, " + M(N(t[1] * k)) + " € et " + M(N(t[2] * k)) + " €. Elles partagent un bénéfice de " + M(N(B)) + " € proportionnellement à leurs apports.",
      [["a) Part de la première (€)", t[0] * u], ["b) Part de la deuxième (€)", t[1] * u], ["c) Part de la troisième (€)", t[2] * u]],
      ["Simplifie le ratio des apports : " + t.join(" ∶ ") + ".", "Une part vaut " + N(B).replace("\\,", " ") + " ÷ " + su + "."],
      "Ratio " + RT(t[0], t[1], t[2]) + ", " + su + " parts de " + M(N(u)) + " € : " + M(N(t[0] * u)) + " €, " + M(N(t[1] * u)) + " € et " + M(N(t[2] * u)) + " €."); }];

  // ===================== milieux : droite des milieux =====================
  // Figure : triangle (sommets nommés), milieux marqués par des codages, longueurs données seulement.
  const TRI = [["A", "B", "C", "I", "J", "K"], ["E", "F", "G", "M", "N", "P"], ["R", "S", "T", "K", "L", "U"]];
  const triFig = (L, o = {}) => {
    const X = { A: [150 + (o.dx || 0), 18], B: [28, 182], C: [300, 172] }, mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    X.I = mid(X.A, X.B); X.J = mid(X.A, X.C); X.K = mid(X.B, X.C);
    const seg = (p, q, cls = "f-line", extra = "") => '<line x1="' + X[p][0] + '" y1="' + X[p][1] + '" x2="' + X[q][0] + '" y2="' + X[q][1] + '" class="' + cls + '"' + extra + "/>";
    const tick = (p, q, n) => { const m = mid(X[p], X[q]), dx = X[q][0] - X[p][0], dy = X[q][1] - X[p][1], l = Math.hypot(dx, dy), ux = -dy / l, uy = dx / l, tx = dx / l, ty = dy / l; let g = "";
      for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 4; g += '<line x1="' + (m[0] + tx * off - ux * 6) + '" y1="' + (m[1] + ty * off - uy * 6) + '" x2="' + (m[0] + tx * off + ux * 6) + '" y2="' + (m[1] + ty * off + uy * 6) + '" class="f-accent" stroke-width="1.6"/>'; } return g; };
    const lab = (t, x, y) => '<text x="' + x + '" y="' + y + '" class="f-txt" font-size="15" text-anchor="middle">' + t + "</text>";
    const vlab = (p, q, t, side = 1, at = 0.5) => { const m = [X[p][0] + (X[q][0] - X[p][0]) * at, X[p][1] + (X[q][1] - X[p][1]) * at], dx = X[q][0] - X[p][0], dy = X[q][1] - X[p][1], l = Math.hypot(dx, dy), o = (16 + 14 * Math.abs(dy / l)) * side; return '<text x="' + (m[0] - dy / l * o) + '" y="' + (m[1] + dx / l * o + 5) + '" class="f-accent f-txt" font-size="14" text-anchor="middle">' + t + "</text>"; };
    let g = '<polygon points="' + ["A", "B", "C"].map((p) => X[p].join(",")).join(" ") + '" class="f-shape"/>';
    (o.segs || []).forEach(([p, q, dash]) => (g += seg(p, q, "f-blue", dash ? ' stroke-dasharray="5 4" stroke-width="1.8"' : ' stroke-width="2"')));
    (o.ticks || []).forEach(([p, q, n]) => (g += tick(p, q, n)));
    (o.pts || []).forEach((p) => (g += '<circle cx="' + X[p][0] + '" cy="' + X[p][1] + '" r="3" class="f-dot"/>'));
    const off = { A: [0, -4], B: [-12, 14], C: [12, 12], I: [-14, 0], J: [14, 0], K: [0, 22] };
    ["A", "B", "C", ...(o.pts || [])].forEach((p) => (g += lab(L["ABCIJK".indexOf(p)], X[p][0] + off[p][0], X[p][1] + off[p][1])));
    (o.vals || []).forEach(([p, q, t, side, at]) => (g += vlab(p, q, t, side, at)));
    return '<svg class="fig" viewBox="0 0 330 ' + (o.pts && o.pts.includes("K") ? 214 : 204) + '" role="img" aria-label="triangle et milieux">' + g + "</svg>";
  };
  const sq = (a, b) => "[" + a + b + "]", dr = (a, b) => "(" + a + b + ")";
  const MI = {
    1: [
      () => { const L = pk(TRI), [A, B, C, I, J] = L, bc = R.int(5, 30) + pk([0, 0, 0.4, 0.6]), v = bc / 2;
        return Qv(M(I) + " et " + M(J) + " sont les milieux des côtés " + M(sq(A, B)) + " et " + M(sq(A, C)) + " du triangle " + M(A + B + C) + ", et " + M(B + C + " = " + N(bc)) + " cm. Calcule " + M(I + J) + " (en cm).", v,
          "La droite des milieux : le segment qui joint les milieux de deux côtés mesure la moitié du troisième côté. " + M(I + J + " = " + N(bc) + " \\div 2 = " + N(v)) + " cm.",
          { ctx: "moitie", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]], vals: [["B", "C", N(bc).replace("{,}", ",") + " cm", 1]] }),
            guide: [G(M(I + J) + " est-il la moitié ou le double de " + M(B + C) + " ? Coefficient (nombre par lequel on multiplie " + M(B + C) + ") :", 0.5, "La moitié : " + M(I + J + " = \\frac{1}{2}\\," + B + C) + "."), G(M(I + J) + " (en cm) ?", v, M(N(bc) + " \\div 2 = " + N(v)) + ".")],
            traps: [TR(2 * bc, "Le segment des milieux est plus court : c'est la moitié."), TR(bc, "Le segment des milieux mesure la moitié du troisième côté.")] }); },
      () => { const L = pk(TRI), [A, B, C, I, J] = L, ij = R.int(3, 19) + pk([0, 0, 0.5, 0.25]), v = 2 * ij;
        return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " est le milieu de " + M(sq(A, B)) + " et " + M(J) + " celui de " + M(sq(A, C)) + ". On mesure " + M(I + J + " = " + N(ij)) + " cm. Quelle est la longueur " + M(B + C) + " (en cm) ?", v,
          M(I + J + " = \\frac{1}{2}\\," + B + C) + ", donc " + M(B + C + " = 2 \\times " + N(ij) + " = " + N(v)) + " cm.",
          { ctx: "double", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]], vals: [["I", "J", N(ij).replace("{,}", ",") + " cm", -1]] }),
            guide: [G("Par combien multiplie-t-on " + M(I + J) + " pour obtenir " + M(B + C) + " ?", 2, M(B + C + " = 2 \\times " + I + J) + "."), G(M(B + C) + " (en cm) ?", v, M("2 \\times " + N(ij) + " = " + N(v)) + ".")],
            traps: [TR(ij / 2, I + J + " est la moitié de " + B + C + " : " + B + C + " est donc le double."), TR(ij + 2, "On multiplie par 2, on n'ajoute pas 2.")] }); },
      () => { const L = pk(TRI), [A, B, C, I, J, K] = L, a = R.int(6, 20), b = R.int(6, 20), c = R.int(Math.abs(a - b) + 2, a + b - 2), P0 = a + b + c, v = P0 / 2;
        return Qv(M(I) + ", " + M(J) + " et " + M(K) + " sont les milieux des côtés " + M(sq(A, B)) + ", " + M(sq(A, C)) + " et " + M(sq(B, C)) + " du triangle " + M(A + B + C) + ", avec " + M(A + B + " = " + a) + " cm, " + M(A + C + " = " + b) + " cm et " + M(B + C + " = " + c) + " cm. Quel est le périmètre du triangle " + M(I + J + K) + " (en cm) ?", v,
          "Chaque côté de " + M(I + J + K) + " mesure la moitié d'un côté de " + M(A + B + C) + " : le périmètre est la moitié de " + M(a + " + " + b + " + " + c + " = " + P0) + ", soit " + M(N(v)) + " cm.",
          { ctx: "perimetre", fig: triFig(L, { pts: ["I", "J", "K"], segs: [["I", "J"], ["J", "K"], ["K", "I"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2], ["B", "K", 3], ["K", "C", 3]] }),
            guide: [G("Périmètre de " + M(A + B + C) + " (cm) ?", P0, M(a + " + " + b + " + " + c + " = " + P0) + "."), G("Périmètre de " + M(I + J + K) + " (cm) ?", v, "La moitié : " + M(N(v)) + ".")],
            traps: [TR(P0, "Chaque côté du petit triangle est la moitié d'un côté du grand."), TR(P0 / 4, "Les longueurs sont divisées par 2 (ce sont les aires qui sont divisées par 4).")] }); },
    ],
    2: [
      () => { const L = pk(TRI), [A, B, C, I, J] = L, ac = R.int(6, 30) + pk([0, 0, 0.4]), v = ac / 2;
        return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " est le milieu de " + M(sq(A, B)) + ". La parallèle à " + M(dr(B, C)) + " passant par " + M(I) + " coupe " + M(sq(A, C)) + " en " + M(J) + ". On sait que " + M(A + C + " = " + N(ac)) + " cm. Calcule " + M(A + J) + " (en cm).", v,
          "Une droite qui passe par le milieu d'un côté et qui est parallèle à un deuxième côté coupe le troisième côté en son milieu : " + M(J) + " est le milieu de " + M(sq(A, C)) + ", donc " + M(A + J + " = " + N(ac) + " \\div 2 = " + N(v)) + " cm.",
          { ctx: "parallele", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J", true]], ticks: [["A", "I", 1], ["I", "B", 1]], vals: [["A", "C", N(ac).replace("{,}", ",") + " cm", -1, 0.3]] }),
            guide: [G("D'après le théorème, " + M(J) + " est le milieu de " + M(sq(A, C)) + ". Quelle fraction de " + M(A + C) + " vaut " + M(A + J) + " ? (décimal)", 0.5, "La moitié."), G(M(A + J) + " (en cm) ?", v, M(N(ac) + " \\div 2 = " + N(v)) + ".")],
            traps: [TR(ac, M(J) + " est le milieu : " + A + J + " est la moitié de " + A + C + "."), TR(2 * ac, "On prend la moitié, pas le double.")] }); },
      () => { const L = pk(TRI), [A, B, C, I, J] = L, bc = R.int(8, 30), v = bc / 2;
        return Qv("Dans le triangle " + M(A + B + C) + ", la droite passant par le milieu " + M(I) + " de " + M(sq(A, B)) + " et parallèle à " + M(dr(B, C)) + " coupe " + M(sq(A, C)) + " en " + M(J) + ". Sachant que " + M(B + C + " = " + bc) + " cm, calcule " + M(I + J) + " (en cm).", v,
          "D'abord, " + M(J) + " est le milieu de " + M(sq(A, C)) + " (parallèle passant par un milieu). Puis " + M(I + J + " = \\frac{1}{2}\\," + B + C + " = " + N(v)) + " cm.",
          { ctx: "deuxtheoremes", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J", true]], ticks: [["A", "I", 1], ["I", "B", 1]], vals: [["B", "C", bc + " cm", 1]] }),
            guide: [G("Combien de milieux de côtés a-t-on maintenant (" + M(I) + " et " + M(J) + ") ?", 2, M(J) + " est aussi un milieu, d'après le premier théorème."), G(M(I + J) + " (en cm) ?", v, M(bc + " \\div 2 = " + N(v)) + ".")],
            traps: [TR(bc, "Le segment qui joint deux milieux mesure la moitié du troisième côté."), TR(2 * bc, "La moitié, pas le double.")] }); },
      () => { const p = R.int(6, 24), q = R.int(6, 24), v = p + q, Q = pk([["A", "B", "C", "D", "I", "J", "K", "L"], ["E", "F", "G", "H", "M", "N", "P", "R"]]);
        const X = { A: [40, 40], B: [250, 22], C: [300, 170], D: [70, 190] }, mid = (a, b) => [(X[a][0] + X[b][0]) / 2, (X[a][1] + X[b][1]) / 2], Mi = [mid("A", "B"), mid("B", "C"), mid("C", "D"), mid("D", "A")];
        let g = '<polygon points="' + ["A", "B", "C", "D"].map((k) => X[k].join(",")).join(" ") + '" class="f-shape"/>' + '<line x1="40" y1="40" x2="300" y2="170" class="f-line" stroke-dasharray="5 4"/><line x1="250" y1="22" x2="70" y2="190" class="f-line" stroke-dasharray="5 4"/>';
        g += '<polygon points="' + Mi.map((m) => m.join(",")).join(" ") + '" fill="none" class="f-blue" stroke-width="2"/>';
        const off = [[-12, -8], [14, 2], [6, 18], [-16, 4]], vo = [[-12, -6], [14, -4], [14, 14], [-14, 14]];
        ["A", "B", "C", "D"].forEach((k, i) => (g += '<text x="' + (X[k][0] + vo[i][0]) + '" y="' + (X[k][1] + vo[i][1]) + '" class="f-txt" font-size="15" text-anchor="middle">' + Q[i] + "</text>"));
        Mi.forEach((m, i) => (g += '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="3" class="f-dot"/><text x="' + (m[0] + off[i][0]) + '" y="' + (m[1] + off[i][1]) + '" class="f-txt" font-size="15" text-anchor="middle">' + Q[4 + i] + "</text>"));
        const fig = '<svg class="fig" viewBox="0 0 330 214" role="img" aria-label="quadrilatère, ses diagonales et les milieux de ses côtés">' + g + "</svg>";
        const [qa, qb, qc, qd, qi, qj, qk, ql] = Q;
        return Qv(M(qi) + ", " + M(qj) + ", " + M(qk) + ", " + M(ql) + " sont les milieux des côtés " + M(sq(qa, qb)) + ", " + M(sq(qb, qc)) + ", " + M(sq(qc, qd)) + ", " + M(sq(qd, qa)) + " du quadrilatère " + M(qa + qb + qc + qd) + ". Ses diagonales mesurent " + M(qa + qc + " = " + p) + " cm et " + M(qb + qd + " = " + q) + " cm. Quel est le périmètre de " + M(qi + qj + qk + ql) + " (en cm) ?", v,
          "Dans le triangle " + M(qa + qb + qc) + ", " + M(qi + qj + " = \\frac{1}{2}\\," + qa + qc) + " ; de même " + M(qk + ql + " = \\frac{1}{2}\\," + qa + qc) + ", et " + M(qj + qk + " = " + ql + qi + " = \\frac{1}{2}\\," + qb + qd) + ". Périmètre : " + M(qa + qc + " + " + qb + qd + " = " + v) + " cm.",
          { ctx: "quadrilatere", fig, guide: [G(M(qi + qj) + " (dans le triangle " + M(qa + qb + qc) + ") en cm ?", p / 2, M("\\frac{1}{2} \\times " + p + " = " + N(p / 2)) + "."), G(M(qj + qk) + " (dans le triangle " + M(qb + qc + qd) + ") en cm ?", q / 2, M(N(q / 2)) + "."), G("Périmètre de " + M(qi + qj + qk + ql) + " (cm) ?", v, M("2 \\times " + N(p / 2) + " + 2 \\times " + N(q / 2) + " = " + v) + ".")],
            traps: [TR(v / 2, "Il y a deux segments égaux à la moitié de chaque diagonale."), TR(2 * v, "Chaque côté de " + qi + qj + qk + ql + " est la moitié d'une diagonale.")] }); },
    ],
    3: [
      () => { const L = pk(TRI), [A, B, C, I, J] = L, x = R.int(2, 9), p = R.int(2, 5), q = R.int(1, 9), d = pk([1, 2, 3, -1]), r = 2 * p + d, s = 2 * (p * x + q) - r * x;
        if (r <= 0 || s === 0) return null;
        const bcT = r + "x " + (s > 0 ? "+ " + s : "- " + -s);
        return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " et " + M(J) + " sont les milieux de " + M(sq(A, B)) + " et " + M(sq(A, C)) + ". On a " + M(I + J + " = " + p + "x + " + q) + " et " + M(B + C + " = " + bcT) + " (en cm). Trouve " + M("x") + ".", x,
          M(B + C + " = 2\\," + I + J) + " donne " + M(bcT + " = 2(" + p + "x + " + q + ") = " + 2 * p + "x + " + 2 * q) + ", donc " + M((r - 2 * p) + "x = " + (2 * q - s)) + " et " + M("x = " + x) + ".",
          { ctx: "equation", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]] }),
            guide: [{ ask: "Écris " + M("2 \\times " + I + J) + " en fonction de " + M("x") + " (développé).", spec: { kind: "expr", expr: 2 * p + "x+" + 2 * q }, sol: M(2 * p + "x + " + 2 * q) + "." }, G("Résous " + M(bcT + " = " + 2 * p + "x + " + 2 * q) + " : " + M("x") + " = ?", x, M("x = " + x) + ".")],
            traps: [TR((2 * q - s) / (r - 2 * p) === x ? (q - s) / (r - p) : -x, "Utilise " + B + C + " = 2 " + I + J + ", pas " + B + C + " = " + I + J + "."), TR((q - s) / (r - p), "La relation est " + B + C + " = 2 × " + I + J + ".")] }); },
      () => { const L = pk(TRI), [A, B, C, I, J] = L, S0 = R.int(3, 40) + pk([0, 0, 0.5]), up = R.rand() < 0.5, v = up ? 4 * S0 : S0 / 4, big = up ? S0 : 4 * S0;
        return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + " et " + M(J) + " sont les milieux de " + M(sq(A, B)) + " et " + M(sq(A, C)) + ". " + (up ? "Le triangle " + M(A + I + J) + " a une aire de " + M(N(S0)) + " cm². Quelle est l'aire du triangle " + M(A + B + C) + " (en cm²) ?" : "Le triangle " + M(A + B + C) + " a une aire de " + M(N(big)) + " cm². Quelle est l'aire du triangle " + M(A + I + J) + " (en cm²) ?"), v,
          M(A + I + J) + " est une réduction de " + M(A + B + C) + " de rapport " + M("\\frac{1}{2}") + " (côtés deux fois plus courts, " + M(dr(I, J) + " \\parallel " + dr(B, C)) + ") ; les aires sont multipliées par " + M("\\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4}") + ". " + (up ? M(N(S0) + " \\times 4 = " + N(v)) : M(N(big) + " \\div 4 = " + N(v))) + " cm².",
          { ctx: "aire", fig: triFig(L, { pts: ["I", "J"], segs: [["I", "J"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2]] }),
            guide: [G("Rapport de réduction des longueurs (de " + M(A + B + C) + " à " + M(A + I + J) + ") ?", 0.5, M("\\frac{1}{2}") + "."), G("Par quel nombre les aires sont-elles divisées ?", 4, M("2^2 = 4") + "."), G("Aire demandée (cm²) ?", v, M(N(v)) + " cm².")],
            traps: [TR(up ? 2 * S0 : big / 2, "Les longueurs sont divisées par 2 ; les aires, par 2² = 4."), TR(up ? S0 + 4 : big - 4, "On multiplie ou on divise par 4.")] }); },
      () => { const L = pk(TRI), [A, B, C, I, J, K] = L, a = R.int(6, 24), c = R.int(6, 24), b = R.int(Math.abs(a - c) + 2, a + c - 2), v = a + c;
        return Qv("Dans le triangle " + M(A + B + C) + ", " + M(I) + ", " + M(J) + ", " + M(K) + " sont les milieux de " + M(sq(A, B)) + ", " + M(sq(A, C)) + " et " + M(sq(B, C)) + ". " + M(A + B + " = " + a) + " cm, " + M(A + C + " = " + b) + " cm, " + M(B + C + " = " + c) + " cm. Quel est le périmètre du parallélogramme " + M(B + I + J + K) + " (en cm) ?", v,
          M(B + I + " = " + N(a / 2)) + ", " + M(I + J + " = \\frac{1}{2}\\," + B + C + " = " + N(c / 2)) + ", " + M(J + K + " = \\frac{1}{2}\\," + A + B + " = " + N(a / 2)) + ", " + M(K + B + " = " + N(c / 2)) + " : périmètre " + M(N(v)) + " cm.",
          { ctx: "parallelogramme", fig: triFig(L, { pts: ["I", "J", "K"], segs: [["I", "J"], ["J", "K"]], ticks: [["A", "I", 1], ["I", "B", 1], ["A", "J", 2], ["J", "C", 2], ["B", "K", 3], ["K", "C", 3]] }),
            guide: [G(M(B + I) + " et " + M(J + K) + " (en cm) ?", a / 2, M(N(a / 2)) + " : moitiés de " + M(A + B) + "."), G(M(I + J) + " et " + M(B + K) + " (en cm) ?", c / 2, M(N(c / 2)) + " : moitiés de " + M(B + C) + "."), G("Périmètre (cm) ?", v, M("2 \\times " + N(a / 2) + " + 2 \\times " + N(c / 2) + " = " + v) + ".")],
            traps: [TR((a + b + c) / 2, "C'est le périmètre du triangle des milieux ; ici le quadrilatère a deux côtés sur " + B + I + " et " + B + K + "."), TR(2 * (a + c), "Chaque côté du parallélogramme est une moitié de côté du triangle.")] }); },
    ],
  };

  // ===================== structexpr : somme ou produit, termes, facteurs, opposé =====================
  const sgn = (n) => (n < 0 ? " - " + Math.abs(n) : " + " + n);
  const mono = (c, v, first) => { const a = Math.abs(c), s0 = c < 0 ? (first ? "-" : " - ") : first ? "" : " + "; return s0 + (v ? (a === 1 ? "" : a) + v : a); };
  const sumT = (T) => T.map(([c, v], i) => mono(c, v, i === 0)).join("");
  const SE = {
    1: [
      () => { const vs = ["", "x", "x^2", "y", "x", ""], k = R.int(3, 5), T = []; for (let i = 0; i < k; i++) T.push([R.nz(-9, 9) || 2, pk(vs)]); if (T.every(([c]) => Math.abs(c) === 1)) return null;
        const e = sumT(T), sep = k - 1;
        return Qv("Combien de termes compte la somme " + M("E = " + e) + " ?", k, "Les termes sont séparés par les signes + et − : " + T.map(([c, v]) => M(mono(c, v, true))).join(", ") + ". Il y en a " + k + ".",
          { ctx: "compter", guide: [G("Combien de signes + ou − séparent deux termes ?", sep, M(sep) + " (un signe devant le premier terme ne sépare rien)."), G("Nombre de termes ?", k, M(sep + " + 1 = " + k) + ".")],
            traps: [TR(sep, "Il y a un terme de plus que de signes qui les séparent."), TR(T.filter(([, v]) => v).length, "Les nombres seuls sont aussi des termes.")] }); },
      () => { const a = R.nz(-9, 9), b = R.nz(-12, 12); if (Math.abs(a) === 1) return null;
        const e = mono(a, "x", true) + sgn(b), res = mono(-a, "x", true) + sgn(-b);
        return Qx("Écris l'opposé de " + M(e) + ", sans parenthèses.", res.replace(/ /g, ""), "L'opposé change le signe de chaque terme : " + M("-(" + e + ") = " + res) + ".",
          { ctx: "oppose", form: "reduced", guide: [GX("Écris l'opposé avec des parenthèses :", "-(" + e.replace(/ /g, "") + ")", M("-(" + e + ")") + "."), GX("Supprime les parenthèses (change chaque signe) :", res.replace(/ /g, ""), M(res) + ".", "reduced")],
            traps: [TX((mono(-a, "x", true) + sgn(b)).replace(/ /g, ""), "Le signe de chaque terme change, y compris celui de " + b + "."), TX(e.replace(/ /g, ""), "L'opposé de A est −A : tous les signes changent.")] }); },
      () => { const T = [[R.nz(-9, 9), ""], [R.nz(-9, 9), "x"], [R.nz(-6, 6), "x^2"]]; for (let i = 2; i > 0; i--) { const j = R.int(0, i); [T[i], T[j]] = [T[j], T[i]]; }
        if (T.some(([c]) => Math.abs(c) === 1)) return null;
        const e = sumT(T), cst = R.rand() < 0.5, v = T.find(([, w]) => w === (cst ? "" : "x"))[0], other = T.find(([, w]) => w === (cst ? "x" : "x^2"))[0];
        return Qv("Dans la somme " + M("E = " + e) + ", quel est " + (cst ? "le terme constant (avec son signe)" : "le coefficient de " + M("x") + " (avec son signe)") + " ?", v,
          "Les termes de " + M("E") + " sont " + T.map(([c, w]) => M(mono(c, w, true))).join(", ") + ". " + (cst ? "Le terme constant (sans lettre) est " : "Le terme en " + M("x") + " est " + M(mono(v, "x", true)) + " : son coefficient est ") + M(v) + ".",
          { ctx: cst ? "constante" : "coefficient", guide: [G("Combien de termes compte E ?", 3, "Trois termes."), G(cst ? "Terme sans lettre (avec son signe) ?" : "Coefficient du terme en x (avec son signe) ?", v, M(v) + ".")],
            traps: [TR(-v, "Le signe qui précède le terme fait partie du terme."), TR(other, cst ? "Le terme constant ne contient pas de lettre." : "On cherche le terme en x, pas en x².")] }); },
    ],
    2: [
      () => { const k = R.int(2, 9), a = R.nz(-9, 9), b = R.nz(-9, 9), first = R.rand() < 0.5; if (Math.abs(b) === 1) return null;
        const t1 = k + "(x" + sgn(a) + ")", t2 = mono(b, "x", true), E = t1 + (b < 0 ? " - " + Math.abs(b) + "x" : " + " + b + "x"), ans = first ? k + "*(x" + sgn(a).replace(/ /g, "") + ")" : b + "x";
        return Qx("L'expression " + M("A = " + E) + " est une somme de deux termes. Écris son " + (first ? "premier" : "second") + " terme" + (first ? "" : " (avec son signe)") + ".", ans, "Le dernier calcul est l'addition : les deux termes sont " + M(t1) + " et " + M(t2) + ".",
          { ctx: "terme", guide: [G("Combien de termes compte A ?", 2, "Deux : " + M(t1) + " et " + M(t2) + "."), GX("Terme demandé :", ans, M(first ? t1 : t2) + ".")],
            traps: [TX("x" + sgn(a).replace(/ /g, ""), "x " + (a < 0 ? "−" : "+") + " " + Math.abs(a) + " est à l'intérieur d'un facteur : le premier terme est " + k + "(x " + (a < 0 ? "−" : "+") + " " + Math.abs(a) + ")."), TX(first ? b + "x" : k + "*(x" + sgn(a).replace(/ /g, "") + ")", "C'est l'autre terme.")] }); },
      () => { const p0 = R.int(2, 7), q = R.nz(-9, 9), r = R.nz(-9, 9), first = R.rand() < 0.5, f1 = p0 + "x" + sgn(q), f2 = "x" + sgn(r), ans = (first ? f1 : f2).replace(/ /g, "");
        return Qx("L'expression " + M("B = (" + f1 + ")(" + f2 + ")") + " est un produit. Écris son " + (first ? "premier" : "second") + " facteur.", ans, "Le dernier calcul est la multiplication : les facteurs sont " + M(f1) + " et " + M(f2) + ".",
          { ctx: "facteur", guide: [G("Combien de facteurs compte B ?", 2, "Deux : " + M("(" + f1 + ")") + " et " + M("(" + f2 + ")") + "."), GX("Facteur demandé :", ans, M(first ? f1 : f2) + ".")],
            traps: [TX((first ? f2 : f1).replace(/ /g, ""), "C'est l'autre facteur."), TX(p0 + "x", "Un facteur est tout le contenu d'une parenthèse.")] }); },
      () => { const a = R.nz(-5, 5), b = R.nz(-9, 9), c = R.nz(-12, 12); if (Math.abs(b) === 1) return null;
        const e = mono(a, "x^2", true) + mono(b, "x") + sgn(c), res = mono(-a, "x^2", true) + mono(-b, "x") + sgn(-c);
        return Qx("Écris l'opposé de " + M(e) + ", sans parenthèses.", res.replace(/ /g, ""), M("-(" + e + ") = " + res) + " : chaque terme change de signe.",
          { ctx: "oppose3", form: "reduced", guide: [GX("Écris l'opposé avec des parenthèses :", "-(" + e.replace(/ /g, "") + ")", M("-(" + e + ")") + "."), GX("Change le signe de chaque terme :", res.replace(/ /g, ""), M(res) + ".", "reduced")],
            traps: [TX((mono(-a, "x^2", true) + mono(b, "x") + sgn(c)).replace(/ /g, ""), "Tous les termes changent de signe, pas seulement le premier."), TX((mono(-a, "x^2", true) + mono(-b, "x") + sgn(c)).replace(/ /g, ""), "N'oublie pas le terme constant.")] }); },
    ],
    3: [
      () => { const a = R.int(2, 9), b = R.int(2, 9), c = pk([
          ["la somme du produit de " + a + " par x et du carré de x", "le produit de " + a + " par x", a + "x", a + "x+x^2", a + "x^2", a + "x + x^2"],
          ["le produit de la somme de x et de " + a + " par la différence de x et de " + b, "la somme de x et de " + a, "x+" + a, "(x+" + a + ")*(x-" + b + ")", "x+" + a + "*(x-" + b + ")", "(x + " + a + ")(x - " + b + ")"],
          ["le carré de la somme de x et de " + a, "la somme de x et de " + a, "x+" + a, "(x+" + a + ")^2", "x^2+" + a * a, "(x + " + a + ")^2"],
          ["la différence entre le triple de x et le carré de la somme de x et de " + a, "le carré de la somme de x et de " + a, "(x+" + a + ")^2", "3x-(x+" + a + ")^2", "3x-x^2+" + a * a, "3x - (x + " + a + ")^2"],
          ["la somme de " + a + " et du produit de " + b + " par x", "le produit de " + b + " par x", b + "x", a + "+" + b + "x", (a + b) + "x", a + " + " + b + "x"]]);
        const ph = c[0].replace(/ x( |$)/g, " \\(x\\)$1"), sub = c[1].replace(/ x( |$)/g, " \\(x\\)$1");
        return Qx("Écris l'expression : « " + ph + " ».", c[3], M(c[5]) + ". Le début de la phrase donne le dernier calcul.",
          { ctx: "phrase", guide: [GX("Écris d'abord « " + sub + " ».", c[2], M(c[2].replace("*", "")) + "."), GX("Puis l'expression complète :", c[3], M(c[5]) + ".")], traps: [TX(c[4], "Le début de la phrase dit quel calcul est fait en dernier : respecte les parenthèses.")] }); },
      () => { const a = R.nz(-9, 9), b = R.int(2, 6), c = R.nz(-9, 9), d = R.int(2, 6), e = R.nz(-9, 9), k = R.int(2, 9), two = R.rand() < 0.5, f = "x" + sgn(-a);
        const E = two ? "(" + f + ")(" + b + "x" + sgn(c) + ") + (" + f + ")(" + d + "x" + sgn(e) + ")" : k + "(" + f + ") - (" + f + ")^2";
        return Qx("Dans " + M("E = " + E) + ", quel est le facteur commun aux deux termes ?", f.replace(/ /g, ""), "Les deux termes contiennent le facteur " + M("(" + f + ")") + " : c'est lui qu'on met en facteur pour factoriser " + M("E") + ".",
          { ctx: two ? "commun2" : "commun-carre", guide: [G("Combien de termes compte E ?", 2, "Deux termes, séparés par le signe central."), GX("Facteur présent dans les deux termes :", f.replace(/ /g, ""), M(f) + ".")],
            traps: [TX(two ? b + "x" + sgn(c).replace(/ /g, "") : String(k), "Ce facteur n'apparaît que dans un des deux termes."), TX(two ? "x" : "(" + f.replace(/ /g, "") + ")^2", two ? "Le facteur commun est toute la parenthèse." : "(x " + (a < 0 ? "+" : "−") + " …)² = (…)(…) : le facteur commun est la parenthèse, une seule fois.")] }); },
      () => { const k = R.int(2, 9), a = R.nz(-9, 9), m = R.int(2, 5), t = pk([-3, -2, 2, 3, 4]), u1 = k * (t + a), u2 = m * t * t, v = u1 - u2;
        if (t + a === 0) return null;
        return Qv("On considère " + M("E = " + k + "(x" + sgn(a) + ") - " + m + "x^2") + ". Calcule chacun des deux termes pour " + M("x = " + t) + ", puis " + M("E") + ".", v,
          "Premier terme : " + M(k + " \\times (" + t + sgn(a) + ") = " + k + " \\times " + P(t + a) + " = " + u1) + ". Second : " + M(m + " \\times " + P(t) + "^2 = " + u2) + ". " + M("E = " + u1 + " - " + P(u2) + " = " + v) + ".",
          { ctx: "valeur", guide: [G("Premier terme pour " + M("x = " + t) + " ?", u1, M(k + " \\times " + P(t + a) + " = " + u1) + "."), G("Second terme (sans son signe) ?", u2, M(m + " \\times " + P(t) + "^2 = " + m + " \\times " + t * t + " = " + u2) + "."), G("Valeur de E ?", v, M(u1 + " - " + P(u2) + " = " + v) + ".")],
            traps: [TR(k * t + a - u2, "Le facteur " + k + " multiplie toute la parenthèse."), TR(u1 - (m * t) ** 2, "Seul x est au carré : " + m + " × " + P(t) + "², pas (" + m + " × " + P(t) + ")²."), TR(u1 + u2, "Un carré est positif, mais on le soustrait.")] }); },
    ],
  };

  // ===================== motifs : suites de motifs évolutifs =====================
  const PAT = [
    { nm: "carreaux", k: "L", f: (n) => { const c = []; for (let j = 0; j <= n; j++) c.push([0, j]); for (let i = 1; i <= n; i++) c.push([i, n]); return c; }, a: 2, b: 1 },
    { nm: "carreaux", k: "croix", f: (n) => { const c = [[n, n]]; for (let k = 1; k <= n; k++) c.push([n - k, n], [n + k, n], [n, n - k], [n, n + k]); return c; }, a: 4, b: 1 },
    { nm: "carreaux", k: "T", f: (n) => { const c = []; for (let i = 0; i <= 2 * n; i++) c.push([i, 0]); for (let j = 1; j <= n; j++) c.push([n, j]); return c; }, a: 3, b: 1 },
    { nm: "carreaux", k: "cadre", f: (n) => { const c = [], s0 = n + 2; for (let i = 0; i < s0; i++) for (let j = 0; j < s0; j++) if (i === 0 || j === 0 || i === s0 - 1 || j === s0 - 1) c.push([i, j]); return c; }, a: 4, b: 4 },
    { nm: "carreaux", k: "pont", f: (n) => { const c = [[0, 0], [1, 0], [2, 0]]; for (let j = 1; j <= n; j++) c.push([0, j], [2, j]); return c; }, a: 2, b: 3 },
    { nm: "allumettes", k: "carrés", st: "sq", a: 3, b: 1 },
    { nm: "allumettes", k: "triangles", st: "tri", a: 2, b: 1 },
  ];
  const QPAT = [
    { k: "carré", f: (n) => { const c = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c.push([i, j]); return c; }, v: (n) => n * n, g: (n) => [G("À l'étape " + n + ", combien de carreaux par côté ?", n, M(n) + "."), G("Nombre de carreaux ?", n * n, M(n + " \\times " + n + " = " + n * n) + ".")] },
    { k: "rectangle", f: (n) => { const c = []; for (let i = 0; i <= n; i++) for (let j = 0; j < n; j++) c.push([i, j]); return c; }, v: (n) => n * (n + 1), g: (n) => [G("Nombre de lignes à l'étape " + n + " ?", n, M(n) + "."), G("Nombre de carreaux par ligne ?", n + 1, M(n + 1) + "."), G("Nombre de carreaux ?", n * (n + 1), M(n + " \\times " + (n + 1) + " = " + n * (n + 1)) + ".")] },
    { k: "escalier", f: (n) => { const c = []; for (let j = 0; j < n; j++) for (let i = 0; i <= j; i++) c.push([i, j]); return c; }, v: (n) => (n * (n + 1)) / 2, g: (n) => [G("Combien de carreaux sur la dernière marche (en bas) à l'étape " + n + " ?", n, M(n) + "."), G("Total " + M("1 + 2 + \\dots + " + n) + " ?", (n * (n + 1)) / 2, M("1 + 2 + \\dots + " + n + " = " + (n * (n + 1)) / 2) + ".")] },
  ];
  const patFig = (P0, steps = [1, 2, 3]) => {
    let g = "", x = 6;
    const parts = steps.map((n) => {
      if (P0.st) { const w = P0.st === "sq" ? n : (n + 1) / 2; return { n, w: w + 0.4, h: 1 }; }
      const c = P0.f(n), w = Math.max(...c.map((p) => p[0])) + 1, h = Math.max(...c.map((p) => p[1])) + 1; return { n, c, w, h };
    });
    const totW = parts.reduce((t, p) => t + p.w, 0), sz = Math.min(22, Math.floor((318 - 14 * steps.length) / totW)), H = Math.max(...parts.map((p) => p.h)) * sz;
    for (const p of parts) {
      const y0 = 8 + H - p.h * sz;
      if (P0.st === "sq") { const L = (x1, y1, x2, y2) => (g += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="f-accent" stroke-width="3" stroke-linecap="round"/>');
        for (let k = 0; k < p.n; k++) { L(x + k * sz, y0, x + (k + 1) * sz, y0); L(x + k * sz, y0 + sz, x + (k + 1) * sz, y0 + sz); L(x + k * sz, y0, x + k * sz, y0 + sz); } L(x + p.n * sz, y0, x + p.n * sz, y0 + sz); }
      else if (P0.st === "tri") { const V = []; for (let k = 0; k < p.n + 2; k++) V.push([x + (k * sz) / 2, k % 2 ? y0 : y0 + sz]);
        const L = (a, b) => (g += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" class="f-accent" stroke-width="3" stroke-linecap="round"/>');
        for (let k = 0; k + 1 < V.length; k++) L(V[k], V[k + 1]); for (let k = 0; k + 2 < V.length; k++) L(V[k], V[k + 2]); }
      else p.c.forEach(([i, j]) => (g += '<rect x="' + (x + i * sz) + '" y="' + (y0 + j * sz) + '" width="' + sz + '" height="' + sz + '" class="f-fill2"/>'));
      g += '<text x="' + (x + (p.w * sz) / 2) + '" y="' + (H + 28) + '" class="f-txt" font-size="13" text-anchor="middle">Étape ' + p.n + "</text>";
      x += p.w * sz + 14;
    }
    return '<svg class="fig" viewBox="0 0 330 ' + (H + 36) + '" role="img" aria-label="motif aux étapes ' + steps.join(", ") + '">' + g + "</svg>";
  };
  const cnt = (P0, n) => P0.a * n + P0.b;
  const intro = (P0) => "Voici les trois premières étapes d'un motif " + de(P0.nm) + ". ";
  const de = (w) => (/^[aeiouéè]/.test(w) ? "d'" : "de ") + w;
  const MO = {
    1: [
      () => { const P0 = pk(PAT), n = 4, v = cnt(P0, n);
        return Qv(intro(P0) + "Combien " + de(P0.nm) + " faut-il pour l'étape " + n + " ?", v, "À chaque étape on ajoute " + P0.a + " " + P0.nm + " : étape 3 → " + cnt(P0, 3) + ", étape 4 → " + M(cnt(P0, 3) + " + " + P0.a + " = " + v) + ".",
          { ctx: P0.k, fig: patFig(P0), guide: [G("Combien " + de(P0.nm) + " ajoute-t-on d'une étape à la suivante ?", P0.a, M(cnt(P0, 2) + " - " + cnt(P0, 1) + " = " + P0.a) + "."), G("Nombre à l'étape 3 ?", cnt(P0, 3), M(cnt(P0, 3)) + "."), G("Nombre à l'étape 4 ?", v, M(cnt(P0, 3) + " + " + P0.a + " = " + v) + ".")],
            traps: [TR(cnt(P0, 3), "C'est l'étape 3 ; on demande la suivante."), TR(P0.a * n, "Attention à ce qui ne change pas : l'étape 1 compte " + cnt(P0, 1) + ", pas " + P0.a + "."), TR(cnt(P0, 1) * n, "Le motif ne double pas : on ajoute " + P0.a + " à chaque étape.")] }); },
      () => { const P0 = pk(PAT), v = P0.a;
        return Qv(intro(P0) + "Combien " + de(P0.nm) + " ajoute-t-on d'une étape à la suivante ?", v, "Étape 1 : " + cnt(P0, 1) + ", étape 2 : " + cnt(P0, 2) + ", étape 3 : " + cnt(P0, 3) + ". On ajoute " + v + " à chaque fois.",
          { ctx: P0.k, fig: patFig(P0), guide: [G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Nombre à l'étape 2 ?", cnt(P0, 2), M(cnt(P0, 2)) + "."), G("Différence ?", v, M(cnt(P0, 2) + " - " + cnt(P0, 1) + " = " + v) + ".")],
            traps: [TR(cnt(P0, 2), "On demande ce qu'on ajoute, pas le total de l'étape 2."), TR(cnt(P0, 1), "Compare deux étapes qui se suivent.")] }); },
      () => { const P0 = pk(PAT), v = cnt(P0, 1) + cnt(P0, 2) + cnt(P0, 3);
        return Qv(intro(P0) + "Combien " + de(P0.nm) + " faut-il en tout pour construire les trois étapes dessinées ?", v, M(cnt(P0, 1) + " + " + cnt(P0, 2) + " + " + cnt(P0, 3) + " = " + v) + ".",
          { ctx: P0.k, fig: patFig(P0), guide: [G("Étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Étape 2 ?", cnt(P0, 2), M(cnt(P0, 2)) + "."), G("Étape 3 ?", cnt(P0, 3), M(cnt(P0, 3)) + "."), G("Total ?", v, M(v) + ".")],
            traps: [TR(cnt(P0, 3), "On demande le total des trois étapes."), TR(3 * cnt(P0, 1), "Les étapes n'ont pas toutes le même nombre de " + P0.nm + ".")] }); },
    ],
    2: [
      () => { const P0 = pk(PAT), n = pk([10, 12, 15, 20]), v = cnt(P0, n);
        return Qv(intro(P0) + "Combien " + de(P0.nm) + " faut-il pour l'étape " + n + " ?", v, "L'étape 1 compte " + cnt(P0, 1) + " ; on ajoute " + P0.a + " à chaque étape, " + (n - 1) + " fois : " + M(cnt(P0, 1) + " + " + (n - 1) + " \\times " + P0.a + " = " + v) + ".",
          { ctx: P0.k, fig: patFig(P0), guide: [G("Ajout à chaque étape ?", P0.a, M(P0.a) + "."), G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Étape " + n + " : étape 1 + " + (n - 1) + " ajouts ?", v, M(cnt(P0, 1) + " + " + (n - 1) + " \\times " + P0.a + " = " + v) + ".")],
            traps: [TR(cnt(P0, 1) * n, "Le motif n'est pas proportionnel : on n'a pas " + n + " fois l'étape 1."), TR(P0.a * n, "Il manque les " + P0.b + " " + P0.nm + " de départ."), TR(cnt(P0, 1) + n * P0.a, "De l'étape 1 à l'étape " + n + ", il y a " + (n - 1) + " ajouts.")] }); },
      () => { const P0 = pk(PAT), k = R.int(8, 25), Nn = cnt(P0, k);
        return Qv(intro(P0) + "Quelle étape utilise exactement " + M(Nn) + " " + P0.nm + " ?", k, M(Nn + " - " + cnt(P0, 1) + " = " + (Nn - cnt(P0, 1))) + ", et " + M((Nn - cnt(P0, 1)) + " \\div " + P0.a + " = " + (k - 1)) + " ajouts après l'étape 1 : c'est l'étape " + k + ".",
          { ctx: P0.k, fig: patFig(P0), guide: [G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Combien d'ajouts de " + P0.a + " après l'étape 1 ?", k - 1, M("(" + Nn + " - " + cnt(P0, 1) + ") \\div " + P0.a + " = " + (k - 1)) + "."), G("Numéro de l'étape ?", k, M((k - 1) + " + 1 = " + k) + ".")],
            traps: [TR(Nn / P0.a, "Retire d'abord ce qui ne change pas (" + P0.b + ")."), TR(k - 1, "Après " + (k - 1) + " ajouts depuis l'étape 1, on est à l'étape " + k + ".")] }); },
      () => { const P0 = pk(PAT), k = R.int(6, 20), X = cnt(P0, k) + R.int(1, P0.a - 1 || 1); if (P0.a === 1 || X >= cnt(P0, k + 1)) return null;
        return Qv(intro(P0) + who() + " dispose de " + M(X) + " " + P0.nm + ". Quelle est la plus grande étape du motif qu'on peut construire (une seule figure) ?", k, "L'étape " + k + " utilise " + cnt(P0, k) + " " + P0.nm + ", l'étape " + (k + 1) + " en utiliserait " + cnt(P0, k + 1) + " : trop. Réponse : étape " + k + ".",
          { ctx: P0.k, fig: patFig(P0), guide: [G("Nombre à l'étape 1 ?", cnt(P0, 1), M(cnt(P0, 1)) + "."), G("Combien d'ajouts complets de " + P0.a + " possibles avec le reste ?", k - 1, M("(" + X + " - " + cnt(P0, 1) + ") \\div " + P0.a) + " → " + (k - 1) + " ajouts complets."), G("Plus grande étape ?", k, M(k) + ".")],
            traps: [TR(k + 1, "L'étape " + (k + 1) + " demande " + cnt(P0, k + 1) + " " + P0.nm + " : il n'y en a pas assez."), TR(Math.floor(X / P0.a), "Retire d'abord ce qui ne change pas (" + P0.b + ").")] }); },
    ],
    3: [
      () => { const P0 = pk(PAT), e = P0.a + "n+" + P0.b;
        return Qx(intro(P0) + "Écris le nombre " + de(P0.nm) + " à l'étape " + M("n") + " en fonction de " + M("n") + ".", e, "On ajoute " + P0.a + " à chaque étape, et l'étape 1 compte " + cnt(P0, 1) + " = " + P0.a + " + " + P0.b + " : " + M(P0.a + "n + " + P0.b) + ".",
          { ctx: P0.k, form: "reduced", fig: patFig(P0), guide: [G("Ajout à chaque étape (coefficient de n) ?", P0.a, M(P0.a) + "."), G("Étape 1 moins l'ajout (ce qui ne change pas) ?", P0.b, M(cnt(P0, 1) + " - " + P0.a + " = " + P0.b) + "."), GX("Formule :", e, M(P0.a + "n + " + P0.b) + ".", "reduced")],
            traps: [TX(cnt(P0, 1) + "n", "Vérifie avec l'étape 2 : " + cnt(P0, 1) + " × 2 ne donne pas " + cnt(P0, 2) + "."), TX(P0.a + "n+" + cnt(P0, 1), "Vérifie avec l'étape 1 : on doit trouver " + cnt(P0, 1) + "."), TX(P0.a + "n", "Il manque les " + P0.b + " " + P0.nm + " qui ne changent pas.")] }); },
      () => { const P0 = pk(PAT), n = pk([50, 100, 200]), v = cnt(P0, n);
        return Qv(intro(P0) + "Combien " + de(P0.nm) + " faudrait-il pour l'étape " + n + " ?", v, "À l'étape " + M("n") + " : " + M(P0.a + "n + " + P0.b) + " ; pour " + M("n = " + n) + " : " + M(P0.a + " \\times " + n + " + " + P0.b + " = " + v) + ".",
          { ctx: P0.k, fig: patFig(P0), guide: [{ ask: "Formule à l'étape " + M("n") + " ?", spec: { kind: "expr", expr: P0.a + "n+" + P0.b }, sol: M(P0.a + "n + " + P0.b) + "." }, G("Étape " + n + " ?", v, M(P0.a + " \\times " + n + " + " + P0.b + " = " + v) + ".")],
            traps: [TR(cnt(P0, 1) * n, "Le motif n'est pas proportionnel."), TR(P0.a * n, "Ajoute les " + P0.b + " " + P0.nm + " qui ne changent pas.")] }); },
      () => { const Q0 = pk(QPAT), n = R.int(6, 10), v = Q0.v(n), lin = Q0.v(3) + (n - 3) * (Q0.v(3) - Q0.v(2));
        return Qv("Voici les trois premières étapes d'un motif de carreaux en " + Q0.k + ". Combien de carreaux à l'étape " + n + " ?", v, "Ce motif ne grandit pas de façon régulière : on décrit sa forme à l'étape " + n + ". " + Q0.g(n).map((x) => x.sol).join(" "),
          { ctx: "q" + Q0.k, fig: patFig(Q0, [1, 2, 3]), guide: Q0.g(n), traps: [TR(lin, "L'ajout n'est pas le même à chaque étape : décris plutôt la forme de l'étape " + n + "."), TR(Q0.v(3) * n / 3, "Le motif n'est pas proportionnel.")] }); },
    ],
  };

  // ===================== automat : automatismes de calcul mental =====================
  const SC = "Sans calculatrice : ";
  const AU = {
    1: [
      () => { const a = R.int(3, 9), b = R.int(6, 9), v = a * b;
        return Qv(SC + "calcule " + M(a + " \\times " + b) + ".", v, M(a + " \\times " + b + " = " + v) + ".", { ctx: "table", guide: [G(M(a + " \\times " + (b - 1)) + " = ?", a * (b - 1), M(a * (b - 1)) + "."), G("Ajoute " + a + " : " + M(a + " \\times " + b) + " = ?", v, M(a * (b - 1) + " + " + a + " = " + v) + ".")], traps: [TR(v - a, "C'est " + a + " × " + (b - 1) + "."), TR(v + a, "C'est " + a + " × " + (b + 1) + "."), TR(a + b, "On multiplie.")] }); },
      () => { const a = R.int(3, 9), b = R.int(3, 9), n = a * b;
        return Qv(SC + "complète " + M(a + " \\times \\ldots = " + n) + ".", b, M(a + " \\times " + b + " = " + n) + ", donc il manque " + M(b) + " (c'est " + M(n + " \\div " + a) + ").", { ctx: "trou", guide: [G("Il manque " + M(n + " \\div " + a) + " = ?", b, M(b) + ".")], traps: [TR(n - a, "On cherche un facteur : on divise " + n + " par " + a + "."), TR(n * a, "On divise, on ne multiplie pas.")] }); },
      () => { const big = pk([100, 1000]), a = big === 100 ? R.int(12, 88) : R.int(120, 880); if (a % 10 === 0) return null; const v = big - a;
        return Qv(SC + "combien faut-il ajouter à " + M(N(a)) + " pour obtenir " + M(N(big)) + " ?", v, M(N(a) + " + " + N(v) + " = " + N(big)) + ".", { ctx: "complement", guide: [G("Jusqu'à la dizaine suivante : combien ajouter à " + M(N(a)) + " ?", 10 - (a % 10), M(N(a) + " + " + (10 - (a % 10)) + " = " + N(a + 10 - (a % 10))) + "."), G("Puis jusqu'à " + M(N(big)) + " ? Total ajouté :", v, M(N(v)) + ".")], traps: [TR(v + 10, "Attention à la retenue : " + N(a) + " + " + N(v) + " = " + N(big) + "."), TR(big - a - 10 < 0 ? v + 1 : v - 10, "Vérifie par une addition.")] }); },
      () => { const a = R.int(3, 9), b = R.int(4, 12), n = a * b;
        return Qv(SC + "calcule " + M(n + " \\div " + a) + ".", b, M(a + " \\times " + b + " = " + n) + ", donc " + M(n + " \\div " + a + " = " + b) + ".", { ctx: "division", guide: [G("Dans la table de " + a + ", quel nombre multiplié par " + a + " donne " + n + " ?", b, M(a + " \\times " + b + " = " + n) + ".")], traps: [TR(n - a, "Diviser, ce n'est pas soustraire."), TR(b + 1, "Vérifie : " + a + " × " + (b + 1) + " = " + a * (b + 1) + ".")] }); },
    ],
    2: [
      () => { const [n0, d] = pk([[1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [7, 20], [3, 20], [9, 25], [1, 20]]), k = d === 8 ? 125 : 100 / d, v = n0 / d;
        const x = { q: SC + "écris " + M("\\frac{" + n0 + "}{" + d + "}") + " sous forme décimale.", spec: { kind: "value", value: r6(v), plain: true }, ctx: "fracdec",
          sol: M("\\frac{" + n0 + "}{" + d + "} = \\frac{" + n0 * k + "}{" + d * k + "} = " + N(v)) + ".",
          guide: [G("Écris la fraction avec le dénominateur " + d * k + " : numérateur ?", n0 * k, M("\\frac{" + n0 + " \\times " + k + "}{" + d + " \\times " + k + "} = \\frac{" + n0 * k + "}{" + d * k + "}") + "."), G("Écriture décimale ?", v, M(N(v)) + ".")],
          traps: keep(r6(v), [TR(d / n0, "C'est l'inverse : on divise " + n0 + " par " + d + "."), TR(+("0." + n0 + d), "Ce n'est pas « 0, numérateur dénominateur » : divise " + n0 + " par " + d + "."), TR(n0 / 10, "Le dénominateur est " + d + ", pas 10.")]) };
        return x; },
      () => { const p0 = pk([10, 20, 25, 50, 75, 5, 15, 30]), c = p0 % 25 === 0 ? R.int(2, 30) * 4 : R.int(2, 40) * 20, v = (p0 * c) / 100, base = p0 % 25 === 0 ? c / 4 : c / 10;
        return Qv(SC + "calcule " + M(p0 + "\\,\\%") + " de " + M(N(c)) + ".", v, p0 % 25 === 0 ? M("25\\,\\%") + " de " + N(c) + " = " + M(N(c) + " \\div 4 = " + N(base)) + " ; " + M(p0 + "\\,\\%") + " = " + p0 / 25 + " fois plus : " + M(N(v)) + "." : M("10\\,\\%") + " de " + N(c) + " = " + M(N(base)) + " ; " + M(p0 + "\\,\\%") + " : " + M(N(v)) + ".",
          { ctx: "pourcent", guide: [G(p0 % 25 === 0 ? "25 % de " + N(c).replace("\\,", " ") + " (le quart) ?" : "10 % de " + N(c).replace("\\,", " ") + " (le dixième) ?", base, M(N(base)) + "."), G(p0 + " % de " + N(c).replace("\\,", " ") + " ?", v, M(N(v)) + ".")],
            traps: [TR(c - p0, "Un pourcentage n'est pas une soustraction."), TR(c * p0 / 10, p0 + " % = " + p0 + " ÷ 100 : divise par 100, pas par 10.")] }); },
      () => { const f = pk([[0.5, 2, "diviser par 2"], [0.25, 4, "diviser par 4"], [0.1, 10, "diviser par 10"]]), a = f[1] === 10 ? R.int(12, 99) : R.int(6, 60) * f[1], v = a * f[0];
        return Qv(SC + "calcule " + M(a + " \\times " + N(f[0])) + ".", v, "Multiplier par " + M(N(f[0])) + ", c'est " + f[2] + " : " + M(a + " \\div " + f[1] + " = " + N(v)) + ".",
          { ctx: "fois" + f[1], guide: [G("Multiplier par " + N(f[0]).replace("{,}", ",") + ", c'est diviser par ?", f[1], M(N(f[0]) + " = \\frac{1}{" + f[1] + "}") + "."), G("Résultat ?", v, M(a + " \\div " + f[1] + " = " + N(v)) + ".")],
            traps: [TR(a * f[1], "Multiplier par un nombre plus petit que 1 rend le résultat plus petit."), TR(a + f[0], "C'est une multiplication.")] }); },
      () => { const d = pk([3, 6, 7, 9, 11]), n0 = R.int(2, d - 1); if (gcd(n0, d) !== 1) return null; const v = n0 / d; // dénominateurs non décimaux
        return Qv("Quel nombre, multiplié par " + M(d) + ", donne " + M(n0) + " ? (écris-le en fraction)", v, "C'est le quotient de " + n0 + " par " + d + " : " + M("\\frac{" + n0 + "}{" + d + "}") + ", car " + M(d + " \\times \\frac{" + n0 + "}{" + d + "} = " + n0) + ".",
          { ctx: "quotient", guide: [G("Le nombre cherché est le quotient " + M(n0 + " \\div " + d) + ", écrit en fraction :", v, M("\\frac{" + n0 + "}{" + d + "}") + ".")], traps: [TR(d / n0, "C'est l'inverse : le numérateur est " + n0 + "."), TR(n0 * d, "On cherche un facteur : on divise."), TR(n0 - d, "On cherche un facteur, pas une différence.")] }); },
    ],
    3: [
      () => { const [n0, d] = pk([[3, 20], [7, 25], [9, 50], [3, 4], [11, 20], [2, 5], [13, 50], [17, 25]]), k = 100 / d, v = n0 * k;
        return Qv(SC + "écris " + M("\\frac{" + n0 + "}{" + d + "}") + " en pourcentage.", v, M("\\frac{" + n0 + "}{" + d + "} = \\frac{" + v + "}{100} = " + v + "\\,\\%") + ".",
          { ctx: "fracpct", guide: [G("Par quel nombre multiplier " + d + " pour obtenir 100 ?", k, M(d + " \\times " + k + " = 100") + "."), G("Pourcentage ?", v, M(n0 + " \\times " + k + " = " + v) + " : " + M(v + "\\,\\%") + ".")], traps: [TR(n0 * d, "On amplifie la fraction pour obtenir le dénominateur 100."), TR(r6(n0 / d), "C'est l'écriture décimale ; en pourcentage, on multiplie par 100.")] }); },
      () => { const c = pk([[25, 4], [50, 2], [125, 8]]), m = R.int(3, 12) * c[1] + (c[0] === 125 ? 0 : 0), v = c[0] * m;
        if (m % 10 === 0) return null;
        return Qv(SC + "calcule " + M(c[0] + " \\times " + m) + " astucieusement.", v, M(c[0] + " \\times " + m + " = " + c[0] + " \\times " + c[1] + " \\times " + m / c[1] + " = " + c[0] * c[1] + " \\times " + m / c[1] + " = " + N(v)) + ".",
          { ctx: "astuce", guide: [G(M(c[0] + " \\times " + c[1]) + " = ?", c[0] * c[1], M(c[0] * c[1]) + "."), G(M(m + " \\div " + c[1]) + " = ?", m / c[1], M(m / c[1]) + "."), G("Résultat ?", v, M(c[0] * c[1] + " \\times " + m / c[1] + " = " + N(v)) + ".")],
            traps: [TR(v / 10, "Vérifie l'ordre de grandeur : " + c[0] + " × " + m + " ≈ " + c[0] * m + "."), TR(c[0] * c[1] + m / c[1], "On multiplie les deux résultats.")] }); },
      () => { const t = pk(["pres100", "pres10"]);
        if (t === "pres100") { const sg2 = pk([1, -1]), k = R.int(2, 4), b = R.int(3, 9), a = 100 + sg2 * k, v = a * b;
          return Qv(SC + "calcule " + M(a + " \\times " + b) + ".", v, M(a + " \\times " + b + " = 100 \\times " + b + (sg2 > 0 ? " + " : " - ") + k + " \\times " + b + " = " + 100 * b + (sg2 > 0 ? " + " : " - ") + k * b + " = " + v) + ".",
            { ctx: "distrib100", guide: [G(M("100 \\times " + b) + " = ?", 100 * b, M(100 * b) + "."), G(M(k + " \\times " + b) + " = ?", k * b, M(k * b) + "."), G("Résultat ?", v, M(100 * b + (sg2 > 0 ? " + " : " - ") + k * b + " = " + v) + ".")], traps: [TR(100 * b + sg2 * k, "Le " + k + " est aussi multiplié par " + b + "."), TR(100 * b - sg2 * k * b, "Vérifie le signe : " + a + " est " + (sg2 > 0 ? "plus grand" : "plus petit") + " que 100.")] }); }
        const m = pk([20, 30, 40, 50]), k = R.int(1, 2), a = m + k, b = m - k, v = a * b;
        return Qv(SC + "calcule " + M(a + " \\times " + b) + ".", v, M(a + " \\times " + b + " = (" + m + " + " + k + ")(" + m + " - " + k + ") = " + m * m + " - " + k * k + " = " + v) + ".",
          { ctx: "difcarres", guide: [G(M(m + "^2") + " = ?", m * m, M(m * m) + "."), G(M(k + "^2") + " = ?", k * k, M(k * k) + "."), G("Résultat ?", v, M(m * m + " - " + k * k + " = " + v) + ".")], traps: [TR(m * m, "Il faut retirer " + k * k + " : (" + m + " + " + k + ")(" + m + " − " + k + ") = " + m + "² − " + k + "²."), TR(m * m + k * k, "On soustrait " + k + "².")] }); },
      () => { const p0 = pk([10, 20, 25, 50, 5]), up = R.rand() < 0.5, c = p0 === 25 ? R.int(2, 30) * 4 : R.int(2, 40) * 20, d = (p0 * c) / 100, v = up ? c + d : c - d;
        return Qv(SC + "un article à " + M(N(c)) + " € " + (up ? "augmente" : "baisse") + " de " + M(p0 + "\\,\\%") + ". Quel est son nouveau prix (en €) ?", v, M(p0 + "\\,\\%") + " de " + N(c) + " = " + M(N(d)) + " € ; nouveau prix : " + M(N(c) + (up ? " + " : " - ") + N(d) + " = " + N(v)) + " €.",
          { ctx: up ? "hausse" : "baisse", guide: [G(p0 + " % de " + N(c).replace("\\,", " ") + " (€) ?", d, M(N(d)) + " €."), G("Nouveau prix (€) ?", v, M(N(c) + (up ? " + " : " - ") + N(d) + " = " + N(v)) + " €.")],
            traps: [TR(up ? c + p0 : c - p0, "On ajoute ou retire " + p0 + " % du prix, pas " + p0 + " €."), TR(d, "C'est le montant de la " + (up ? "hausse" : "baisse") + " ; on demande le nouveau prix.")] }); },
    ],
  };

  const ALL = { progcalc: PC, ratio: RAT, milieux: MI, structexpr: SE, motifs: MO, automat: AU };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
  }
  PROB_EXTRA.progcalc = PCPROB;
  PROB_EXTRA.ratio = RATPROB;
  Object.assign(HINTS_EXTRA, {
    structexpr: "Le dernier calcul effectué donne la nature de l'expression : une addition ou une soustraction → somme (de termes), une multiplication → produit (de facteurs). L'opposé change le signe de chaque terme.",
    motifs: "Compte ce qu'on ajoute d'une étape à la suivante, et ce qui ne change pas. Étape n : (ajout) × n + (ce qui reste).",
    automat: "Pense aux décompositions : × 0,5 = ÷ 2 ; 25 % = le quart ; 25 × 4 = 100 ; 102 × 7 = 700 + 14.",
    ratio: "Ratio a ∶ b : on partage en a + b parts égales. Une part = total ÷ (a + b) ; la première personne reçoit a parts, la seconde b parts.",
    milieux: "Le segment qui joint les milieux de deux côtés est parallèle au troisième côté et mesure sa moitié. Une parallèle à un côté passant par un milieu coupe le troisième côté en son milieu.",
    progcalc: "Applique les étapes dans l'ordre, chacune au résultat de la précédente. Avec x : mets des parenthèses, puis développe. Pour remonter, défais les étapes de la dernière à la première.",
  });
  Object.assign(LESSONS_EXTRA, {
    structexpr: ["Somme ou produit ?", "La nature d'une expression est donnée par le dernier calcul qu'on effectue en respectant les priorités.",
      "Si le dernier calcul est une addition ou une soustraction, l'expression est une somme ; ses morceaux sont des termes. Si c'est une multiplication, c'est un produit ; ses morceaux sont des facteurs. L'opposé d'une expression change le signe de chacun de ses termes : \\(-(a + b - c) = -a - b + c\\).",
      ["\\(3x + 2\\) est une somme de deux termes ; \\(5(x + 4)\\) est un produit de deux facteurs, \\(5\\) et \\(x + 4\\).", "L'opposé de \\(2x - 7\\) est \\(-2x + 7\\)."],
      "\\(5(x + 4) - 3\\) est une somme (le dernier calcul est la soustraction), même s'il contient un produit."],
    motifs: ["Suites de motifs", "Un motif qui grandit toujours de la même quantité se décrit par une formule simple.",
      "On repère ce qu'on ajoute d'une étape à la suivante (l'ajout) et ce qui ne bouge pas. À l'étape \\(n\\), il y a \\(\\text{ajout} \\times n + \\text{reste}\\). On vérifie la formule sur l'étape 1 et l'étape 2. Si l'ajout change à chaque étape (carrés, escaliers), on décrit plutôt la forme de l'étape.",
      ["Carrés d'allumettes en ligne : 4, 7, 10… On ajoute 3, il reste 1 : étape \\(n\\) : \\(3n + 1\\) ; étape 10 : 31.", "Pour 61 allumettes : \\(3n + 1 = 61\\), donc \\(n = 20\\)."],
      "Le motif n'est pas proportionnel : l'étape 10 n'est pas 10 fois l'étape 1."],
    automat: ["Automatismes de calcul mental", "Quelques faits connus par cœur et quelques astuces suffisent pour calculer vite et sans calculatrice.",
      "Tables de multiplication ; \\(\\frac{1}{4} = 0{,}25\\), \\(\\frac{1}{5} = 0{,}2\\), \\(\\frac{1}{8} = 0{,}125\\) ; 10 % = le dixième, 25 % = le quart, 50 % = la moitié ; multiplier par 0,5, c'est diviser par 2 ; \\(25 \\times 4 = 100\\) et \\(125 \\times 8 = 1\\,000\\). Le nombre qui, multiplié par 7, donne 3 est \\(\\frac{3}{7}\\).",
      ["\\(25 \\times 36 = 25 \\times 4 \\times 9 = 900\\).", "\\(102 \\times 7 = 700 + 14 = 714\\) ; 15 % de 60 : 10 % = 6, 5 % = 3, donc 9."],
      "Multiplier par un nombre plus petit que 1 (comme 0,5) rend le résultat plus petit."],
    ratio: ["Ratios et partage proportionnel", "Partager selon le ratio \\(2\\,:\\,3\\), c'est faire 2 + 3 = 5 parts égales ; l'un en prend 2, l'autre 3.",
      "Pour partager une quantité selon \\(a\\,:\\,b\\) : on compte \\(a + b\\) parts, on calcule une part (quantité ÷ \\((a + b)\\)), puis on multiplie par \\(a\\) et par \\(b\\). Un ratio se simplifie comme une fraction : \\(12\\,:\\,18 = 2\\,:\\,3\\). Partager proportionnellement à des âges ou à des mises, c'est partager selon leur ratio.",
      ["Partager 120 € selon \\(2\\,:\\,3\\) : 5 parts de 24 €, soit 48 € et 72 €.", "Ratio garçons : filles = \\(2\\,:\\,3\\) : les filles représentent \\(\\frac{3}{5}\\) de la classe."],
      "Le ratio \\(2\\,:\\,3\\) ne veut pas dire « 2 sur 3 » : il y a 5 parts en tout, donc la première personne a \\(\\frac{2}{5}\\) du total."],
    milieux: ["Droite des milieux", "Dans un triangle, relier les milieux de deux côtés donne un segment parallèle au troisième côté, deux fois plus court.",
      "Si \\(I\\) et \\(J\\) sont les milieux de \\([AB]\\) et \\([AC]\\) : \\((IJ) \\parallel (BC)\\) et \\(IJ = \\frac{1}{2}\\,BC\\). Réciproquement, la parallèle à \\((BC)\\) passant par le milieu \\(I\\) de \\([AB]\\) coupe \\([AC]\\) en son milieu.",
      ["\\(BC = 9\\) cm, \\(I\\) et \\(J\\) milieux de \\([AB]\\) et \\([AC]\\) : \\(IJ = 4{,}5\\) cm.", "Triangle de périmètre 30 cm : le triangle formé par les trois milieux a un périmètre de 15 cm."],
      "Le segment des milieux est parallèle au côté qu'il ne touche pas, pas à un côté qui contient l'un des milieux."],
    progcalc: ["Programmes de calcul", "Un programme de calcul est une suite d'opérations faites l'une après l'autre sur un nombre choisi.",
      "Chaque étape s'applique au résultat de l'étape précédente. En partant de \\(x\\), on obtient une expression : on met des parenthèses, puis on développe et on réduit. Pour retrouver le nombre de départ, on remonte le programme avec les opérations inverses (de la dernière étape à la première), ou on résout une équation.",
      ["Ajouter 3, multiplier par 2, soustraire 5. Avec 4 : \\(4 + 3 = 7\\), \\(7 \\times 2 = 14\\), \\(14 - 5 = 9\\).", "Avec \\(x\\) : \\(2(x + 3) - 5 = 2x + 6 - 5 = 2x + 1\\). Pour obtenir 21 : \\(2x + 1 = 21\\), donc \\(x = 10\\)."],
      "« Ajouter 3 puis multiplier par 2 » donne \\(2(x + 3)\\), pas \\(x + 3 \\times 2\\) : on multiplie tout le résultat."],
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    structexpr: ["Reconnaître termes, coefficients et opposé", "Repérer termes et facteurs d'une expression", "Lire la structure : phrase, facteur commun, calcul"],
    motifs: ["Poursuivre un motif évolutif", "Trouver une étape lointaine ou un numéro d'étape", "Écrire la formule d'un motif"],
    automat: ["Tables, divisions et compléments", "Fractions, pourcentages, nombre quotient", "Astuces de calcul et évolutions"],
    ratio: ["Partager selon un ratio", "Utiliser une part connue, partage proportionnel", "Écart, fraction du total, mélange limité"],
    milieux: ["Calculer avec le segment des milieux", "Utiliser la parallèle passant par un milieu", "Combiner : équation, aires, parallélogramme"],
    progcalc: ["Appliquer un programme de calcul à un nombre", "Remonter un programme, l'écrire avec x", "Prouver un résultat avec le calcul littéral"],
  });
  // Notions françaises au catalogue (CH : null ; classe FR posée par applyFrCollege).
  for (const f of FR_NEW) if (GEN[f.id] && !NOTIONS.some((n) => n.id === f.id)) NOTIONS.push({ ...f, CH: null, MP: null, FR: null });
})();

// ======================= Fin : application des rattachements =======================
applyFrCollege();

// 25.11 · France, notions créées pour la couverture du programme (tools/france_couverture.md, branche agent/frcouv).
// Ce fichier définit aussi les outils communs des notions françaises du 25.11 (FRX : fr_3e.js, fr_tle.js les utilisent).
// 1re spécialité (programme 2026) : expderiv (exponentielle : dérivée de e^(ax+b), produits, variations, AN.12–14),
// trigrad (cercle trigonométrique en radians, valeurs remarquables, angles associés, AN.15–16), droitenorm (équation
// cartésienne et vecteur normal, projeté orthogonal, GE.04–05). Notions sans CH ni MP : invisibles pour un élève suisse.
// Standard de l'app : 3 niveaux, ≥ 3 formes par niveau, pas à pas (guide), erreurs typiques (traps), contexte (ctx), leçon,
// 3 compétences, défi de niveau 4 quand il a du sens. Usages français : virgule, espace fine des milliers, ×, €, radians.
const FRX = (function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => R.nz(a, b);
  const rnd = (v, k = 10) => +(+v).toFixed(k);
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  // Nombre en TeX à la française (virgule, espace fine des milliers) ; NP : entre parenthèses s'il est négatif.
  const N = (v) => { v = rnd(v); const s = String(Math.abs(v)).split("."); let i = s[0]; if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,"); return (v < 0 ? "-" : "") + i + (s[1] ? "{,}" + s[1] : ""); };
  const NP = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const den = (v) => { for (let d = 1; d <= 400; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d; return 0; };
  // Fraction irréductible : TeX (F) et texte saisissable (FS) ; décimal si le dénominateur est une puissance de 10 courte.
  const F = (v) => { const d = den(v); if (d === 1 || !d) return N(v); if ([2, 4, 5, 10, 20, 25, 50, 100].includes(d) && String(rnd(v)).length < 6) return N(v); const n = Math.round(v * d); return (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const FS = (v) => { const d = den(v); if (d === 1 || !d) return String(rnd(v)).replace(".", ","); return Math.round(v * d) + "/" + d; };
  const sg = (v) => (v < 0 ? " - " + N(-v) : " + " + N(v));
  const X = " \\times ";
  const co = (a, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : N(a) + v); /* coefficient devant une lettre */
  const lin = (a, b, v = "x") => (a ? co(a, v) + (b ? sg(b) : "") : N(b)); /* ax + b */
  const linE = (a, b, v = "x") => (a === 1 ? v : a === -1 ? "-" + v : a + "*" + v) + (b < 0 ? "-" + -b : b ? "+" + b : "");
  const keepT = (spec, traps) => (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { try { return !Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr)); } catch (e) { return false; } }
    if (tr.spec && tr.spec.kind === "pair") return tr.spec.values.every(isFinite) && tr.spec.values.some((x, i) => Math.abs(x - spec.values[i]) > 1e-9);
    if (tr.spec) { try { return checkAnswer(spec, SolSet.show(tr.spec.ivs, false)).status !== "correct"; } catch (e) { return false; } }
    if (tr.s) return tr.s.every(isFinite) && !(tr.s.length === spec.values.length && tr.s.every((x) => spec.values.some((y) => Math.abs(x - y) < 1e-9)));
    return isFinite(tr.v) && Math.abs(tr.v - spec.value) > Math.max(1e-9, spec.round ? spec.round : 0);
  });
  // Constructeurs : la réponse type (canon) est toujours posée (tests : checkAnswer(spec, canon) = juste).
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; for (const k of ["fig", "canon", "shownOk", "calcul"]) if (o[k] !== undefined) x[k] = o[k]; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, Object.assign({ canon: FS(value) }, o));
  const QR = (q, value, round, sol, o) => mk(q, { kind: "value", value, round }, sol, Object.assign({ canon: String(rnd(Math.round(value / round) * round, 6)).replace(".", ",") }, o));
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)] }, sol, Object.assign({ canon: [...new Set(vals)].map(FS).join(" ; ") }, o));
  const QP = (q, vals, sol, o) => mk(q, { kind: "pair", values: vals }, sol, Object.assign({ canon: vals.map(FS).join(" ; ") }, o));
  const GR = (ask, value, sol, round) => ({ ask, spec: Object.assign({ kind: "value", value }, round ? { round } : {}), sol });
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)] }, sol });
  const GP = (ask, vals, sol) => ({ ask, spec: { kind: "pair", values: vals }, sol });
  const TR = TRAP, TX = (e, m) => ({ e, m }), TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  // Problème en plusieurs étapes (niveau 4).
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  // Enregistrement d'une notion française (CH et MP null) : générateur, indice, leçon, compétences, défis.
  const reg = (defs) => {
    for (const d of defs) {
      if (!NOTIONS.some((n) => n.id === d.id)) NOTIONS.push(Object.assign({ id: d.id, theme: d.theme, label: d.label, ex: d.ex, CH: null, MP: null, FR: d.FR }, d.againFR ? { againFR: d.againFR } : {}));
      GEN[d.id] = (lv) => pickForm(d.g[Math.min(Math.max(lv, 1), 3)]);
      if (typeof VAR !== "undefined") VAR[d.id] = {};
      HINTS_EXTRA[d.id] = d.hint;
      LESSONS_EXTRA[d.id] = d.lesson;
      if (typeof COMPS !== "undefined") COMPS[d.id] = d.comps;
      if (d.probs && typeof PROB_EXTRA !== "undefined") PROB_EXTRA[d.id] = d.probs;
    }
  };
  return { pk, nz, rnd, g2, N, NP, den, F, FS, sg, X, co, lin, linE, mk, QN, QR, QX, QS, QSet, QP, GR, GX, GSet, GP, TR, TX, TS, P, reg };
})();

(function () {
  const { pk, nz, rnd, N, NP, F, FS, sg, X, co, lin, QN, QR, QX, QSet, QP, GR, GX, GP, TR, TX, P, reg } = FRX;

  // ======================= expderiv : exponentielle et dérivation (1re.AN.12–14) =======================
  const ED = {
    1: [
      () => { const a = pk([2, 3, 4, 5, -2, -3, -4, 0.5, -0.5]), k = pk([1, 2, 3, -2, 5]);
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + (k === 1 ? "" : k === -1 ? "-" : N(k)) + "e^{" + co(a) + "}") + ". Tape « exp(…) » ou « e^(…) ».", (k * a) + "*exp(" + a + "*x)",
          M("(e^{ax})' = a\\,e^{ax}") + " : " + M("f'(x) = " + N(k) + X + NP(a) + "\\,e^{" + co(a) + "} = " + N(k * a) + "e^{" + co(a) + "}") + ".",
          { ctx: "eax", guide: [GR("Dérivée de " + M("e^{" + co(a) + "}") + " : par quel nombre multiplie-t-on " + M("e^{" + co(a) + "}") + " ?", a, M(N(a)) + "."), GX(M("f'(x)") + " ?", (k * a) + "*exp(" + a + "*x)", M(N(k * a) + "e^{" + co(a) + "}") + ".")],
            traps: [TX(k + "*exp(" + a + "*x)", "La dérivée de e^(ax) n'est pas e^(ax) : on multiplie par a."), TX((k * a) + "*exp(" + (a - 1) + "*x)", "L'exposant ne baisse pas : ce n'est pas une puissance de x."), TX((k * a) + "*x*exp(" + a + "*x)", "Pas de x devant : (e^(ax))' = a e^(ax).")] }); },
      () => { const k = nz(-5, 6), b = nz(-6, 6), c = nz(-9, 9); if (Math.abs(k) === 1 && R.rand() < 0.5) return null;
        const e = k + "*exp(x)" + (2 * b < 0 ? "-" + -2 * b : "+" + 2 * b) + "*x";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(k, "e^{x}") + sg(b) + "x^2" + sg(c)) + ".", e,
          M("(e^x)' = e^x") + ", " + M("(x^2)' = 2x") + ", la constante disparaît : " + M("f'(x) = " + co(k, "e^{x}") + sg(2 * b) + "x") + ".",
          { ctx: "somme", guide: [GX("Dérivée de " + M(co(k, "e^{x}")) + " ?", k + "*exp(x)", M(co(k, "e^{x}")) + "."), GX(M("f'(x)") + " ?", e, M(co(k, "e^{x}") + sg(2 * b) + "x") + ".")],
            traps: [TX(k + "*exp(x)+" + 2 * b + "*x+" + c, "La dérivée d'une constante est 0."), TX(k + "*x*exp(x)+" + 2 * b + "*x", "(e^x)' = e^x, pas x e^x."), TX(k + "*exp(x)+" + b + "*x", "(x²)' = 2x : le coefficient double.")] }); },
      () => { const c = nz(-4, 5), a = pk([2, 3, -2, -3, 4, 0.5]), b = nz(-6, 6), v = c * a + b;
        return QN("Soit " + M("f(x) = " + co(c, "e^{" + co(a) + "}") + sg(b) + "x") + ". Calcule " + M("f'(0)") + ".", v,
          M("f'(x) = " + N(c * a) + "e^{" + co(a) + "}" + sg(b)) + " et " + M("e^0 = 1") + " : " + M("f'(0) = " + N(c * a) + sg(b) + " = " + N(v)) + ".",
          { ctx: "valeur-0", guide: [GX(M("f'(x)") + " ?", (c * a) + "*exp(" + a + "*x)+" + b, M(N(c * a) + "e^{" + co(a) + "}" + sg(b)) + "."), GR(M("f'(0)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(c + b, "On multiplie aussi par " + N(a).replace("{,}", ",") + " (dérivée de e^(ax))."), TR(c, "C'est f(0), pas f'(0) : dérive d'abord."), TR(c * a, "Le terme " + b + "x a pour dérivée " + b + ".")] }); },
    ],
    2: [
      () => { const a = nz(-3, 4), b = nz(-6, 6), e = "(" + FRX.linE(a, a + b) + ")*exp(x)";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = (" + lin(a, b) + ")e^{x}") + ", sous la forme " + M("(\\dots)e^{x}") + ".", e,
          "Produit " + M("uv") + " avec " + M("u = " + lin(a, b)) + ", " + M("v = e^x") + " : " + M("f'(x) = " + N(a) + "e^x + (" + lin(a, b) + ")e^x = (" + lin(a, a + b) + ")e^{x}") + ".",
          { ctx: "produit", guide: [GR(M("u'(x)") + " (u = " + M(lin(a, b)) + ") ?", a, M(N(a)) + "."), GX(M("f'(x) = u'v + uv'") + " ?", e, M("(" + lin(a, a + b) + ")e^{x}") + ".")],
            traps: [TX(a + "*exp(x)", "(uv)' = u'v + uv' : il manque le terme uv'."), TX("(" + FRX.linE(a, b) + ")*exp(x)", "C'est f(x), pas f'(x) : la dérivée de " + lin(a, b).replace(/\\/g, "") + " s'ajoute."), TX(a + "*x*exp(x)", "(uv)' n'est pas u'v'.")] }); },
      () => { const c = nz(-4, 5), m = c - 1;
        return QN("Soit " + M("f(x) = (x" + sg(-c) + ")e^{x}") + " sur " + M("\\mathbb{R}") + ". En quelle abscisse " + M("f") + " atteint-elle son minimum ?", m,
          M("f'(x) = e^x + (x" + sg(-c) + ")e^x = (x" + sg(1 - c) + ")e^x") + ". Comme " + M("e^x > 0") + ", " + M("f'") + " a le signe de " + M("x" + sg(1 - c)) + " : négative puis positive, " + M("f") + " est minimale en " + M("x = " + N(m)) + ".",
          { ctx: "minimum", guide: [GX(M("f'(x)") + " ? (sous la forme (…)e^x)", "(x" + (1 - c >= 0 ? "+" : "") + (1 - c) + ")*exp(x)", M("(x" + sg(1 - c) + ")e^x") + "."), GR("Pour quel " + M("x") + " a-t-on " + M("f'(x) = 0") + " ?", m, M("x = " + N(m)) + " (" + M("e^x") + " ne s'annule jamais).")],
            traps: [TR(c, "En " + c + ", f s'annule ; le minimum est là où f' s'annule."), TR(c + 1, "f'(x) = (x − " + (c - 1) + ")eˣ : attention au signe."), TR(0, "e^x ne s'annule pas, mais f'(x) = (x − " + (c - 1) + ")eˣ s'annule.")] }); },
      () => { const a = pk([2, 3, -2, -3, 4, -4]), b = nz(-5, 5), e = a + "*x+" + (1 + b);
        return QX("Donne l'équation réduite de la tangente à la courbe de " + M("f(x) = e^{" + co(a) + "}" + sg(b)) + " au point d'abscisse " + M("0") + ". Réponds « y = … ».", e,
          M("f(0) = 1" + sg(b) + " = " + N(1 + b)) + ", " + M("f'(x) = " + N(a) + "e^{" + co(a) + "}") + ", " + M("f'(0) = " + N(a)) + " : " + M("y = " + N(a) + "x" + sg(1 + b)) + ".",
          { ctx: "tangente-0", guide: [GR(M("f(0)") + " ?", 1 + b, M("e^0" + sg(b) + " = " + N(1 + b)) + "."), GR(M("f'(0)") + " ?", a, M(N(a)) + "."), GX("Équation " + M("y = f'(0)\\,x + f(0)") + " ?", e, M("y = " + lin(a, 1 + b)) + ".")],
            traps: [TX(a + "*x+" + b, "e⁰ = 1 : f(0) = 1 + " + b + "."), TX("x+" + (1 + b), "f'(0) = " + a + " (dérivée de e^(ax) en 0)."), TX(a + "*x", "La tangente passe par (0 ; f(0)).")] }); },
    ],
    3: [
      () => { const c = pk([["La concentration d'un médicament dans le sang", "mg/L", "heures", "medicament"], ["La température d'un café posé sur une table, au-dessus de celle de la pièce,", "°C", "minutes", "cafe"], ["La masse d'un échantillon radioactif", "g", "années", "radioactif"]]);
        const C0 = pk([20, 40, 50, 80, 120]), k = pk([0.1, 0.2, 0.25, 0.5]), v = -k * C0;
        return QN(c[0] + " vaut " + M("C(t) = " + N(C0) + "\\,e^{-" + N(k) + "t}") + " (en " + c[1] + ", " + M("t") + " en " + c[2] + "). Calcule " + M("C'(0)") + ", la vitesse de variation à l'instant initial.", v,
          M("C'(t) = " + N(C0) + X + "(-" + N(k) + ")\\,e^{-" + N(k) + "t}") + ", donc " + M("C'(0) = " + N(v)) + " : la grandeur diminue d'environ " + M(N(-v)) + " " + c[1] + " par unité de temps au départ.",
          { ctx: "decroissance-" + c[3], guide: [GX(M("C'(t)") + " ?", v + "*exp(-" + k + "*t)", M(N(v) + "\\,e^{-" + N(k) + "t}") + "."), GR(M("C'(0)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(C0, "C'est C(0), pas C'(0)."), TR(-v, "La grandeur diminue : C'(0) est négative."), TR(-k, "On multiplie par " + C0 + " aussi.")] }); },
      () => { const r1 = nz(-4, 3); let r2 = nz(-4, 4); if (r2 === r1) r2 = r1 + 2; const b = -(r1 + r2) - 2, c = r1 * r2 - b;
        const poly = "x^2" + (b ? sg(b) + "x" : "") + (c ? sg(c) : "");
        return QSet("Soit " + M("f(x) = (" + poly + ")e^{x}") + ". En quelles abscisses la tangente à la courbe de " + M("f") + " est-elle horizontale ? Sépare les valeurs par « ; ».", [r1, r2],
          M("f'(x) = (2x" + sg(b) + ")e^x + (" + poly + ")e^x = (x^2" + sg(b + 2) + "x" + sg(b + c) + ")e^x") + ". Comme " + M("e^x > 0") + ", on résout " + M("x^2" + sg(b + 2) + "x" + sg(b + c) + " = 0") + " : " + M("x = " + N(Math.min(r1, r2))) + " ou " + M("x = " + N(Math.max(r1, r2))) + ".",
          { ctx: "extremums-trinome", guide: [GX(M("f'(x)") + " ? (forme (…)e^x)", "(x^2+" + (b + 2) + "*x+" + (b + c) + ")*exp(x)", M("(x^2" + sg(b + 2) + "x" + sg(b + c) + ")e^x") + "."), GSetLoc("Racines du trinôme ?", [r1, r2])],
            traps: [{ s: (() => { const d = b * b - 4 * c; return d >= 0 ? [(-b - Math.sqrt(d)) / 2, (-b + Math.sqrt(d)) / 2] : [NaN]; })(), m: "Ce sont les racines de f (ou du premier facteur) : il faut celles de f'." }, { s: [r1], m: "Il y a deux abscisses." }] }); },
      () => { const a = pk([2, 3, 4, 5, 6]), k = pk([1, 2, 3, 4]), vmax = a * k * Math.exp(-1);
        return pk([0, 1]) ? QN("Soit " + M("f(x) = " + N(a) + "x\\,e^{-x/" + k + "}") + " pour " + M("x \\geqslant 0") + (k === 1 ? "" : " (avec " + M("e^{-x/" + k + "}") + ")") + ". En quelle abscisse " + M("f") + " atteint-elle son maximum ?", k,
          M("f'(x) = " + N(a) + "e^{-x/" + k + "} - \\frac{" + N(a) + "}{" + k + "}x\\,e^{-x/" + k + "} = " + N(a) + "e^{-x/" + k + "}\\left(1 - \\frac{x}{" + k + "}\\right)") + " : positive avant " + M(k) + ", négative après. Maximum en " + M("x = " + k) + ".",
          { ctx: "maximum-x", guide: [GX(M("f'(x)") + " ?", a + "*exp(-x/" + k + ")*(1-x/" + k + ")", M(N(a) + "e^{-x/" + k + "}\\left(1 - \\frac{x}{" + k + "}\\right)") + "."), GR(M("f'(x) = 0") + " pour " + M("x") + " = ?", k, M(k) + ".")],
            traps: [TR(0, "En 0, f vaut 0 : c'est le minimum sur [0 ; +∞[."), TR(1 / k, "Résous 1 − x/" + k + " = 0."), TR(a, "Le coefficient " + a + " ne change pas l'abscisse du maximum.")] })
          : QR("Soit " + M("f(x) = " + N(a) + "x\\,e^{-x/" + k + "}") + " pour " + M("x \\geqslant 0") + ". Son maximum est atteint en " + M("x = " + k) + ". Quelle est sa valeur maximale (au centième) ?", vmax, 0.01,
          M("f(" + k + ") = " + N(a * k) + "\\,e^{-1} = \\frac{" + N(a * k) + "}{e} \\approx " + N(rnd(vmax, 2))) + ".",
          { ctx: "maximum-valeur", guide: [GR(M("f(" + k + ")") + " (au centième) ?", vmax, M("\\frac{" + N(a * k) + "}{e} \\approx " + N(rnd(vmax, 2))) + ".", 0.01)],
            traps: [TR(rnd(a * k, 2), "e^(−" + k + "/" + k + ") = e^(−1) ≈ 0,37, pas 1."), TR(rnd(a * k * Math.exp(1), 2), "L'exposant est négatif : on divise par e.")] }); },
    ],
  };
  // set dans un guide (GSet de FRX)
  function GSetLoc(ask, vals) { return FRX.GSet(ask, vals, M(vals.map(N).join(" \\,;\\, ")) + "."); }

  // ======================= trigrad : cercle trigonométrique en radians (1re.AN.15–16) =======================
  // Angles remarquables : k·π/6 et k·π/4 ; valeurs exactes en TeX et en saisie.
  const R3 = Math.sqrt(3) / 2, R2 = Math.SQRT2 / 2;
  const ex2 = (v) => { const t = [[0, "0", "0"], [0.5, "\\frac{1}{2}", "1/2"], [R2, "\\frac{\\sqrt{2}}{2}", "√2/2"], [R3, "\\frac{\\sqrt{3}}{2}", "√3/2"], [1, "1", "1"]].find((e) => Math.abs(Math.abs(v) - e[0]) < 1e-9);
    return v < -1e-12 ? ["-" + t[1], "-" + t[2]] : [t[1], t[2]]; };
  // angle k·π/d (TeX, saisie)
  const ang = (k, d) => { const g = FRX.g2(k, d) || 1; k /= g; d /= g; if (k === 0) return ["0", "0"]; const s = k < 0 ? "-" : "", a = Math.abs(k);
    return d === 1 ? [s + (a === 1 ? "" : a) + "\\pi", s + (a === 1 ? "" : a) + "π"] : [s + "\\frac{" + (a === 1 ? "" : a) + "\\pi}{" + d + "}", s + (a === 1 ? "" : a) + "π/" + d]; };
  const ANG = [[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6], [7, 6], [5, 4], [4, 3], [5, 3], [7, 4], [11, 6], [-1, 6], [-1, 4], [-1, 3], [-2, 3], [-3, 4], [-5, 6]];
  // mesure principale (dans ]−π ; π]) de k·π/d
  const princ = (k, d) => { let m = ((k % (2 * d)) + 2 * d) % (2 * d); if (m > d) m -= 2 * d; return m; };
  const TG = {
    1: [
      () => { const [k, d] = pk(ANG), fn = pk(["cos", "sin"]), t = (k * Math.PI) / d, v = rnd(fn === "cos" ? Math.cos(t) : Math.sin(t)), [vt, vs] = ex2(v), [at] = ang(k, d);
        const sv = Math.sign(rnd(fn === "cos" ? Math.cos(t) : Math.sin(t), 9));
        return mk2("Sans calculatrice, donne la valeur exacte de " + M("\\" + fn + "\\left(" + at + "\\right)") + ".", v, vs,
          "Sur le cercle trigonométrique, le point associé à " + M(at) + " a pour " + (fn === "cos" ? "abscisse" : "ordonnée") + " " + M(vt) + " (le quadrant donne le signe).",
          { ctx: "valeur-" + fn, guide: [GR(fn === "cos" ? "Le point est-il à droite (tape 1) ou à gauche (tape −1) de l'axe vertical (0 s'il est dessus) ?" : "Le point est-il en haut (tape 1) ou en bas (tape −1) de l'axe horizontal (0 s'il est dessus) ?", sv, sv > 0 ? "Signe positif." : sv < 0 ? "Signe négatif." : "Valeur nulle."), GR("Valeur exacte ?", v, M(vt) + ".")],
            traps: [TR(-v, "Le signe dépend du quadrant : regarde où se trouve le point."), TR(rnd(fn === "cos" ? Math.sin(t) : Math.cos(t)), "Cosinus = abscisse, sinus = ordonnée.")] }); },
      () => { const pairs = [[30, 1, 6], [45, 1, 4], [60, 1, 3], [120, 2, 3], [135, 3, 4], [150, 5, 6], [210, 7, 6], [240, 4, 3], [270, 3, 2], [300, 5, 3], [330, 11, 6], [72, 2, 5], [36, 1, 5], [20, 1, 9]];
        const [deg, k, d] = pk(pairs), [at, as] = ang(k, d), toRad = R.rand() < 0.5;
        return toRad ? mk2("Convertis " + M(deg + "°") + " en radians (valeur exacte, avec " + M("\\pi") + ").", (k * Math.PI) / d, as,
          M("180° = \\pi") + " rad, donc " + M(deg + "° = " + deg + X + "\\frac{\\pi}{180} = " + at) + ".",
          { ctx: "deg-rad", guide: [GR("Par quel nombre multiplie-t-on " + M("\\pi") + " ? (fraction : " + M(deg) + " sur 180)", deg / 180, M("\\frac{" + deg + "}{180} = " + F(deg / 180)) + "."), GR("Mesure en radians ?", (k * Math.PI) / d, M(at) + ".")],
            traps: [TR((deg * Math.PI) / 360, "180° = π (pas 360°)."), TR((180 * Math.PI) / deg / 1, "On multiplie par π/180, on ne divise pas.")] })
          : QN("Convertis " + M(at) + " rad en degrés.", deg, M("\\pi") + " rad " + M("= 180°") + ", donc " + M(at + " = " + (k === 1 ? "" : k + X) + "\\frac{180°}{" + d + "} = " + deg + "°") + ".",
          { ctx: "rad-deg", guide: [GR("Combien de degrés vaut " + M("\\frac{\\pi}{" + d + "}") + " ?", 180 / d, M("\\frac{180°}{" + d + "} = " + N(180 / d) + "°") + "."), GR("Et " + M(at) + " ?", deg, M(deg + "°") + ".")],
            traps: [TR(360 * k / d, "π rad = 180°, pas 360°."), TR(180 / d, "Multiplie par " + k + ".")] }); },
      () => { const [k, d] = pk(ANG.filter(([a, b]) => b !== 1)), m = princ(k, d), [at, as] = ang(m, d), t = (m * Math.PI) / d, [ct] = ex2(rnd(Math.cos(t))), [st] = ex2(rnd(Math.sin(t)));
        return mk2("Le point " + M("M") + " du cercle trigonométrique a pour coordonnées " + M("\\left(" + ct + " \\,;\\, " + st + "\\right)") + ". Quelle est la mesure de l'angle " + M("x") + " associé à " + M("M") + " dans " + M("]-\\pi \\,;\\, \\pi]") + " ?", t, as,
          M("\\cos x = " + ct) + " et " + M("\\sin x = " + st) + " : " + (Math.sin(t) >= 0 ? "le point est en haut" : "le point est en bas, l'angle est négatif") + " ; " + M("x = " + at) + ".",
          { ctx: "point", guide: [GR("Le point est-il en haut (1) ou en bas (−1) ?", Math.sin(t) > 0 ? 1 : -1, Math.sin(t) > 0 ? "En haut : sinus positif, x entre 0 et π." : "En bas : sinus négatif, x entre −π et 0."), GR("Mesure de " + M("x") + " ?", t, M(at) + ".")],
            traps: [TR(-t, "Regarde le signe du sinus : il donne le demi-cercle (haut ou bas)."), TR(Math.PI - t, "Regarde le signe du cosinus : il donne le côté (droite ou gauche).")] }); },
    ],
    2: [
      () => { const d = pk([3, 4, 6]), base = pk([1, 2, 3, 4, 5].filter((b) => FRX.g2(b, d) === 1)), tours = pk([1, 2, 3, -1, -2]), k = base + 2 * d * tours, kk = R.rand() < 0.5 ? k : -k, m = princ(kk, d), [at] = ang(kk, d), [mt, ms] = ang(m, d);
        if (Math.abs(kk) <= d) return null;
        return mk2("Donne la mesure principale de l'angle " + M(at) + " (la mesure qui est dans " + M("]-\\pi \\,;\\, \\pi]") + ").", (m * Math.PI) / d, ms,
          "On retire (ou on ajoute) des tours complets " + M("2\\pi = \\frac{" + 2 * d + "\\pi}{" + d + "}") + " : " + M(at + " = " + mt + (kk - m > 0 ? " + " : " - ") + Math.abs((kk - m) / (2 * d)) + X + "2\\pi") + ". Mesure principale : " + M(mt) + ".",
          { ctx: "mesure-principale", guide: [GR("Combien de tours complets " + M("2\\pi") + " faut-il retirer (négatif s'il faut en ajouter) ?", (kk - m) / (2 * d), M(N((kk - m) / (2 * d))) + "."), GR("Mesure principale ?", (m * Math.PI) / d, M(mt) + ".")],
            traps: [TR(((m + 2 * d) * Math.PI) / d, "Une mesure principale est dans ]−π ; π] : retire encore un tour."), TR((((kk % d) + d) % d * Math.PI) / d, "Un tour vaut 2π, pas π.")] }); },
      () => { const c = pk([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]), fn = pk(["cos", "sin"]), forms = fn === "cos" ? [["\\pi - x", -c], ["\\pi + x", -c], ["-x", c], ["x + 2\\pi", c]] : [["\\pi - x", c], ["\\pi + x", -c], ["-x", -c], ["x - 2\\pi", c]];
        const [f, v] = pk(forms);
        return QN("On sait que " + M("\\" + fn + " x = " + N(c)) + ". Que vaut " + M("\\" + fn + "(" + f + ")") + " ?", v,
          "Sur le cercle trigonométrique, le point associé à " + M(f) + " est le symétrique de celui de " + M("x") + " " + ({ "\\pi - x": "par rapport à l'axe des ordonnées", "\\pi + x": "par rapport à l'origine", "-x": "par rapport à l'axe des abscisses", "x + 2\\pi": "(même point : un tour de plus)", "x - 2\\pi": "(même point : un tour de moins)" })[f] + " : " + M("\\" + fn + "(" + f + ") = " + N(v)) + ".",
          { ctx: "associe-" + fn, guide: [GR("Même valeur (1) ou valeur opposée (−1) ?", Math.sign(v / c), v === c ? "Même valeur." : "Valeur opposée."), GR(M("\\" + fn + "(" + f + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(-v, "Dessine les deux points : quelle symétrie passe de x à " + f.replace(/\\pi/g, "π") + " ?"), TR(rnd(Math.sqrt(1 - c * c)), "On reste sur la même fonction (" + fn + ") : pas besoin de sin² + cos² = 1.")] }); },
      () => { const [c, s] = pk([[0.6, 0.8], [0.8, 0.6], [0.28, 0.96], [0.96, 0.28], [5 / 13, 12 / 13], [12 / 13, 5 / 13]]), q = pk([[1, "\\left[0 \\,;\\, \\frac{\\pi}{2}\\right]", 1, 1], [2, "\\left[\\frac{\\pi}{2} \\,;\\, \\pi\\right]", -1, 1], [3, "\\left[-\\pi \\,;\\, -\\frac{\\pi}{2}\\right]", -1, -1], [4, "\\left[-\\frac{\\pi}{2} \\,;\\, 0\\right]", 1, -1]]);
        const askSin = R.rand() < 0.5, giv = askSin ? q[2] * c : q[3] * s, v = askSin ? q[3] * s : q[2] * c;
        return QN("On sait que " + M((askSin ? "\\cos" : "\\sin") + " x = " + F(giv)) + " et que " + M("x \\in " + q[1]) + ". Calcule " + M((askSin ? "\\sin" : "\\cos") + " x") + " (valeur exacte).", v,
          M("\\cos^2 x + \\sin^2 x = 1") + ", donc " + M((askSin ? "\\sin^2" : "\\cos^2") + " x = 1 - " + F(giv * giv) + " = " + F(v * v)) + ". Sur cet intervalle, " + M((askSin ? "\\sin" : "\\cos") + " x") + " est " + (v > 0 ? "positif" : "négatif") + " : " + M(F(v)) + ".",
          { ctx: "pythagore-" + (askSin ? "sin" : "cos"), guide: [GR(M((askSin ? "\\sin^2" : "\\cos^2") + " x") + " ?", v * v, M(F(v * v)) + "."), GR("Signe sur l'intervalle : 1 ou −1 ?", Math.sign(v), v > 0 ? "Positif." : "Négatif."), GR("Valeur ?", v, M(F(v)) + ".")],
            traps: [TR(-v, "L'intervalle donne le signe : regarde le quadrant."), TR(rnd(1 - Math.abs(giv)), "sin² + cos² = 1 : ce sont les carrés qui s'ajoutent."), TR(v * v, "Il faut encore prendre la racine.")] }); },
    ],
    3: [
      () => { const [k1, d1] = pk(ANG), [k2, d2] = pk(ANG), t1 = (k1 * Math.PI) / d1, t2 = (k2 * Math.PI) / d2, v = rnd(Math.cos(t1) + Math.sin(t2), 9), [a1] = ang(k1, d1), [a2] = ang(k2, d2), [c1] = ex2(rnd(Math.cos(t1))), [s2] = ex2(rnd(Math.sin(t2)));
        if (Math.abs(v) < 1e-9 || Math.abs(Math.abs(v) - 1) < 1e-9) return null;
        const vs = exS(v); if (!vs) return null;
        return mk2("Calcule la valeur exacte de " + M("\\cos\\left(" + a1 + "\\right) + \\sin\\left(" + a2 + "\\right)") + ".", v, vs,
          M("\\cos\\left(" + a1 + "\\right) = " + c1) + " et " + M("\\sin\\left(" + a2 + "\\right) = " + s2) + " : la somme vaut " + M(exT(v)) + ".",
          { ctx: "somme", guide: [GR(M("\\cos\\left(" + a1 + "\\right)") + " ?", rnd(Math.cos(t1)), M(c1) + "."), GR(M("\\sin\\left(" + a2 + "\\right)") + " ?", rnd(Math.sin(t2)), M(s2) + "."), GR("Somme ?", v, M(exT(v)) + ".")],
            traps: [TR(rnd(-Math.cos(t1) + Math.sin(t2), 9), "Vérifie le signe du cosinus (côté gauche ou droit)."), TR(rnd(Math.cos(t1) - Math.sin(t2), 9), "Vérifie le signe du sinus (haut ou bas).")] }); },
      () => { const fn = pk(["cos", "sin"]), [vt, vs, vv] = pk([["\\frac{1}{2}", "1/2", 0.5], ["-\\frac{1}{2}", "-1/2", -0.5], ["\\frac{\\sqrt{2}}{2}", "√2/2", R2], ["-\\frac{\\sqrt{2}}{2}", "-√2/2", -R2], ["\\frac{\\sqrt{3}}{2}", "√3/2", R3], ["-\\frac{\\sqrt{3}}{2}", "-√3/2", -R3]]);
        const a = fn === "cos" ? Math.acos(vv) : Math.asin(vv), sols = fn === "cos" ? [a, -a] : [a, a >= 0 ? Math.PI - a : -Math.PI - a];
        const txt = (t) => { for (const d of [6, 4, 3, 2, 1]) { const k = Math.round((t * d) / Math.PI); if (Math.abs((k * Math.PI) / d - t) < 1e-9) return ang(k, d); } return ["?", "?"]; };
        return QSet("Par lecture du cercle trigonométrique, donne les réels " + M("x") + " de " + M("]-\\pi \\,;\\, \\pi]") + " tels que " + M("\\" + fn + " x = " + vt) + ". Sépare-les par « ; » (avec π).", sols,
          (fn === "cos" ? "On cherche les points d'abscisse " : "On cherche les points d'ordonnée ") + M(vt) + " : il y en a deux, " + (fn === "cos" ? "symétriques par rapport à l'axe des abscisses" : "symétriques par rapport à l'axe des ordonnées") + ". " + M("x = " + txt(sols[0])[0]) + " ou " + M("x = " + txt(sols[1])[0]) + ".",
          { ctx: "lecture-" + fn, canon: sols.map((t) => txt(t)[1]).join(" ; "), guide: [GR("Une solution (dans " + M("[0 \\,;\\, \\pi]") + (fn === "sin" ? " ou " + M("[-\\pi \\,;\\, 0]") : "") + ") ?", sols[0], M(txt(sols[0])[0]) + "."), GSetLoc2("Les deux solutions ?", sols, sols.map((t) => txt(t)[0]).join(" \\,;\\, "))],
            traps: [{ s: [sols[0]], m: "Il y a deux points du cercle avec cette " + (fn === "cos" ? "abscisse" : "ordonnée") + "." }, { s: fn === "cos" ? [Math.asin(vv), Math.PI - Math.asin(vv)] : [Math.acos(vv), -Math.acos(vv)], m: (fn === "cos" ? "Cosinus = abscisse" : "Sinus = ordonnée") + " : tu as lu l'autre coordonnée." }] }); },
      () => { const s = pk([0.6, 0.8, 0.28, 0.96]), c = rnd(Math.sqrt(1 - s * s)), form = pk([["\\cos(\\pi - x)", c, "cos(π − x) = −cos x"], ["\\sin(\\pi + x) + \\cos(-x)", rnd(-s - c), "sin(π + x) = −sin x et cos(−x) = cos x"], ["\\cos(x + \\pi) - \\sin(\\pi - x)", rnd(c - s), "cos(x + π) = −cos x et sin(π − x) = sin x"]]);
        return QN("On sait que " + M("\\sin x = " + N(s)) + " et que " + M("x \\in \\left[\\frac{\\pi}{2} \\,;\\, \\pi\\right]") + ". Calcule " + M(form[0]) + ".", form[1],
          "Sur cet intervalle, " + M("\\cos x < 0") + " : " + M("\\cos x = -\\sqrt{1 - " + N(s * s) + "} = " + N(-c)) + ". Puis " + form[2] + " : " + M(form[0] + " = " + N(form[1])) + ".",
          { ctx: "associe-quadrant", guide: [GR(M("\\cos x") + " ?", -c, M(N(-c)) + " (négatif : x entre π/2 et π)."), GR(M(form[0]) + " ?", form[1], M(N(form[1])) + ".")],
            traps: [TR(form[0] === "\\cos(\\pi - x)" ? -c : rnd(-s + c), "Sur [π/2 ; π], le cosinus est négatif : cos x = " + N(-c).replace("{,}", ",") + "."), TR(-form[1], "Vérifie les signes des angles associés.")] }); },
    ],
  };
  // valeurs exactes de sommes du type a + b√k (TeX et saisie), pour la forme « somme »
  function exS(v) { for (const [r, t] of [[0, ""], [R2, "√2/2"], [R3, "√3/2"]]) for (const a of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) for (const sgn of [1, -1]) if (r && Math.abs(a + sgn * r - v) < 1e-9) return (a ? FS(a) : "") + (sgn > 0 ? (a ? " + " : "") : " - ") + t; return null; }
  function exT(v) { for (const [r, t] of [[R2, "\\frac{\\sqrt{2}}{2}"], [R3, "\\frac{\\sqrt{3}}{2}"]]) for (const a of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) for (const sgn of [1, -1]) if (Math.abs(a + sgn * r - v) < 1e-9) return (a ? F(a) : "") + (sgn > 0 ? (a ? " + " : "") : " - ") + t; return N(v); }
  function GSetLoc2(ask, vals, tex) { return FRX.GSet(ask, vals, M(tex) + "."); }
  // question à valeur exacte avec réponse type écrite (√, π)
  function mk2(q, value, canon, sol, o) { return FRX.mk(q, { kind: "value", value }, sol, Object.assign({ canon }, o)); }

  // ======================= droitenorm : vecteur normal, équation cartésienne, projeté orthogonal (1re.GE.04–05) =======================
  const pt = (x, y) => M("(" + N(x) + " \\,;\\, " + N(y) + ")");
  const vc = (a, b) => M("\\begin{pmatrix} " + N(a) + " \\\\ " + N(b) + " \\end{pmatrix}");
  const vcm = (a) => M("\\begin{pmatrix} " + N(a) + " \\\\ m \\end{pmatrix}");
  const cartT = (a, b, c) => { let s = a === 1 ? "x" : a === -1 ? "-x" : N(a) + "x"; s += b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : N(Math.abs(b))) + "y" : ""; s += c ? sg(c) : ""; return s + " = 0"; };
  const DN = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-5, 5), x0 = nz(-6, 6), y0 = nz(-6, 6), c = -(a * x0 + b * y0); if (!c) return null;
        return QN("La droite " + M("d") + " passe par " + M("A") + pt(x0, y0) + " et admet " + M("\\vec{n}") + vc(a, b) + " pour vecteur normal. Son équation s'écrit " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "Un vecteur normal " + M("\\vec{n}(a \\,;\\, b)") + " donne l'équation " + M("ax + by + c = 0") + ". " + M("A") + " est sur " + M("d") + " : " + M(N(a) + X + NP(x0) + sg(b) + X + NP(y0) + " + c = 0") + ", donc " + M("c = " + N(c)) + ".",
          { ctx: "normal-c", guide: [GR("Remplace " + M("x") + " et " + M("y") + " par les coordonnées de " + M("A") + " : que vaut " + M(N(a) + X + NP(x0) + sg(b) + X + NP(y0)) + " ?", a * x0 + b * y0, M(N(a * x0 + b * y0)) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-c, "a·x_A + b·y_A + c = 0 : c est l'opposé de a·x_A + b·y_A."), TR(-(a * y0 + b * x0), "x avec l'abscisse de A, y avec l'ordonnée.")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-9, 9), k = pk([2, 3, -2, -1, -3]), m = k * b;
        return QN("Le vecteur " + M("\\vec{u}") + vcm(k * a) + " est normal à la droite " + M("d : " + cartT(a, b, c)) + ". Que vaut " + M("m") + " ?", m,
          "Un vecteur normal à " + M("d") + " est " + M("\\vec{n}") + vc(a, b) + ". " + M("\\vec{u}") + " est normal à " + M("d") + " s'il est colinéaire à " + M("\\vec{n}") + " : " + M(N(k * a) + " = " + N(k) + X + NP(a)) + ", donc " + M("m = " + N(k) + X + NP(b) + " = " + N(m)) + ".",
          { ctx: "normal-m", guide: [GP("Coordonnées d'un vecteur normal lu dans l'équation ? Réponds « a ; b ».", [a, b], vc(a, b) + "."), GR("Par quel nombre multiplie-t-on " + M("\\vec{n}") + " pour obtenir " + M("\\vec{u}") + " ?", k, M(N(k)) + "."), GR(M("m") + " ?", m, M(N(m)) + ".")],
            traps: [TR(b, "Multiplie aussi la seconde coordonnée par " + k + "."), TR(-m, "Les deux coordonnées sont multipliées par le même nombre " + k + " : attention au signe."), TR(a, "Un vecteur normal est (a ; b) : (" + a + " ; " + b + "), multiplié par " + k + ".")] }); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-9, 9), k = pk([1, 2, -1, 3]), v = k * a;
        return QN("La droite " + M("d : " + cartT(a, b, c)) + " admet un vecteur directeur " + M("\\vec{u}") + vcm(-k * b) + ". Que vaut " + M("m") + " ?", v,
          "Pour " + M("ax + by + c = 0") + ", " + M("\\vec{u}(-b \\,;\\, a)") + " est directeur (il est orthogonal à " + M("\\vec{n}(a \\,;\\, b)") + "). Ici " + M("(-b \\,;\\, a) = ") + vc(-b, a) + " ; on le multiplie par " + M(k) + " : " + M("m = " + N(v)) + ".",
          { ctx: "directeur", guide: [GP("Un vecteur directeur " + M("(-b \\,;\\, a)") + " ? Réponds « x ; y ».", [-b, a], vc(-b, a) + "."), GR(M("m") + " ?", v, M(N(v)) + ".")],
            traps: [TR(k * b, "(a ; b) est normal ; un directeur est (−b ; a)."), TR(-k * a, "Directeur : (−b ; a), sans changer le signe de a.")] }); },
    ],
    2: [
      () => { const xA = nz(-5, 5), yA = nz(-5, 5), xB = xA + nz(-5, 5), yB = yA + nz(-5, 5), xC = nz(-6, 6), yC = nz(-6, 6), a = xB - xA, b = yB - yA, c = -(a * xC + b * yC); if (!c || !a || !b) return null;
        return QN("Soit " + M("A") + pt(xA, yA) + ", " + M("B") + pt(xB, yB) + " et " + M("C") + pt(xC, yC) + ". La droite perpendiculaire à " + M("(AB)") + " passant par " + M("C") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          M("\\overrightarrow{AB}") + vc(a, b) + " est normal à la droite cherchée. Elle passe par " + M("C") + " : " + M(N(a) + X + NP(xC) + sg(b) + X + NP(yC) + " + c = 0") + ", " + M("c = " + N(c)) + ".",
          { ctx: "perpendiculaire", guide: [GP("Coordonnées de " + M("\\overrightarrow{AB}") + " ?", [a, b], vc(a, b) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(a * xA + b * yA), "La droite passe par C, pas par A."), TR(-c, "c = −(a·x_C + b·y_C)."), TR(-(-b * xC + a * yC), "AB est normal (pas directeur) à la perpendiculaire.")] }); },
      () => { const xA = nz(-6, 6), yA = nz(-6, 6), a = 2 * nz(-3, 3), b = 2 * nz(-3, 3), xB = xA + a, yB = yA + b, mx = (xA + xB) / 2, my = (yA + yB) / 2, c = -(a * mx + b * my); if (!c) return null;
        return QN("Soit " + M("A") + pt(xA, yA) + " et " + M("B") + pt(xB, yB) + ". La médiatrice de " + M("[AB]") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "La médiatrice passe par le milieu " + M("I") + pt(mx, my) + " et " + M("\\overrightarrow{AB}") + vc(a, b) + " lui est normal : " + M(N(a) + X + NP(mx) + sg(b) + X + NP(my) + " + c = 0") + ", " + M("c = " + N(c)) + ".",
          { ctx: "mediatrice", guide: [GP("Milieu " + M("I") + " de " + M("[AB]") + " ?", [mx, my], pt(mx, my) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(a * xA + b * yA), "La médiatrice passe par le milieu de [AB], pas par A."), TR(-c, "c = −(a·x_I + b·y_I).")] }); },
      () => { const xO = nz(-4, 4), yO = nz(-4, 4), [dx, dy] = pk([[3, 4], [4, 3], [-3, 4], [-4, -3], [3, -4], [6, 8], [-8, 6], [-4, 3]]), xA = xO + dx, yA = yO + dy, c = -(dx * xA + dy * yA);
        if (!c) return null;
        return QN("Le cercle de centre " + M("\\Omega") + pt(xO, yO) + " passe par " + M("A") + pt(xA, yA) + ". La tangente au cercle en " + M("A") + " a une équation de la forme " + M(cartT(dx, dy, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "La tangente en " + M("A") + " est perpendiculaire au rayon " + M("[\\Omega A]") + " : " + M("\\overrightarrow{\\Omega A}") + vc(dx, dy) + " est normal. Elle passe par " + M("A") + " : " + M("c = -(" + N(dx) + X + NP(xA) + sg(dy) + X + NP(yA) + ") = " + N(c)) + ".",
          { ctx: "tangente-cercle", guide: [GP("Coordonnées de " + M("\\overrightarrow{\\Omega A}") + " ?", [dx, dy], vc(dx, dy) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(dx * xO + dy * yO), "La tangente passe par A, pas par le centre."), TR(-c, "c = −(a·x_A + b·y_A).")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), b = nz(-3, 3), xH = nz(-5, 5), yH = nz(-5, 5), c = -(a * xH + b * yH), t = nz(-2, 2), xP = xH + t * a, yP = yH + t * b;
        return QP("Détermine les coordonnées du projeté orthogonal " + M("H") + " du point " + M("P") + pt(xP, yP) + " sur la droite " + M("d : " + cartT(a, b, c)) + ". Réponds « x ; y ».", [xH, yH],
          M("H") + " est sur la droite passant par " + M("P") + " et dirigée par " + M("\\vec{n}") + vc(a, b) + " : " + M("H(" + N(xP) + " + " + N(a) + "t \\,;\\, " + N(yP) + " + " + N(b) + "t)") + ". On remplace dans l'équation de " + M("d") + " : " + M("t = " + N(-t)) + ", d'où " + M("H") + pt(xH, yH) + ".",
          { ctx: "projete", guide: [GP("Vecteur normal à " + M("d") + " ?", [a, b], vc(a, b) + "."), GR("Valeur du paramètre " + M("t") + " pour laquelle " + M("P + t\\vec{n}") + " est sur " + M("d") + " ?", -t, M("t = " + N(-t)) + "."), GP(M("H") + " ?", [xH, yH], pt(xH, yH) + ".")],
            traps: [{ spec: { kind: "pair", values: [xP + t * a, yP + t * b] }, m: "Le signe de t : H = P + t·n avec t = " + (-t) + "." }, { spec: { kind: "pair", values: [xP, yP] }, m: "P n'est pas sur d : il faut le projeter." }] }); },
      () => { const xA = nz(-5, 5), yA = nz(-5, 5), xB = xA + nz(-6, 6), yB = yA + nz(-6, 6), xC = nz(-6, 6), yC = nz(-6, 6), a = xB - xA, b = yB - yA, c = -(a * xC + b * yC); if (!c || !a || !b) return null;
        return QN("Dans le triangle " + M("ABC") + " avec " + M("A") + pt(xA, yA) + ", " + M("B") + pt(xB, yB) + " et " + M("C") + pt(xC, yC) + ", la hauteur issue de " + M("C") + " a une équation de la forme " + M(cartT(a, b, 0).replace(" = 0", "") + " + c = 0") + ". Que vaut " + M("c") + " ?", c,
          "La hauteur issue de " + M("C") + " est perpendiculaire à " + M("(AB)") + " : " + M("\\overrightarrow{AB}") + vc(a, b) + " est normal. Elle passe par " + M("C") + " : " + M("c = " + N(c)) + ".",
          { ctx: "hauteur", guide: [GP(M("\\overrightarrow{AB}") + " ?", [a, b], vc(a, b) + "."), GR(M("c") + " ?", c, M(N(c)) + ".")],
            traps: [TR(-(a * xA + b * yA), "La hauteur issue de C passe par C."), TR(-((xC - xA) * xC + (yC - yA) * yC), "Le vecteur normal est AB (le côté opposé à C).")] }); },
      () => { const ux = nz(-3, 3), uy = nz(-3, 3), xA = nz(-5, 5), yA = nz(-5, 5), s = nz(-2, 3), xH = xA + s * ux, yH = yA + s * uy, t = nz(-2, 2), xP = xH - t * uy, yP = yH + t * ux;
        return QP("La droite " + M("d") + " passe par " + M("A") + pt(xA, yA) + " et a pour vecteur directeur " + M("\\vec{u}") + vc(ux, uy) + ". Détermine le projeté orthogonal " + M("H") + " de " + M("P") + pt(xP, yP) + " sur " + M("d") + ". Réponds « x ; y ».", [xH, yH],
          M("H = A + s\\vec{u}") + " avec " + M("\\overrightarrow{PH} \\cdot \\vec{u} = 0") + ". Or " + M("\\overrightarrow{AP} \\cdot \\vec{u} = " + N((xP - xA) * ux + (yP - yA) * uy)) + " et " + M("\\lVert \\vec{u} \\rVert^2 = " + N(ux * ux + uy * uy)) + ", donc " + M("s = " + N(s)) + " et " + M("H") + pt(xH, yH) + ".",
          { ctx: "projete-directeur", guide: [GR(M("\\overrightarrow{AP} \\cdot \\vec{u}") + " ?", (xP - xA) * ux + (yP - yA) * uy, M(N((xP - xA) * ux + (yP - yA) * uy)) + "."), GR(M("s = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert^2}") + " ?", s, M(N(s)) + "."), GP(M("H") + " ?", [xH, yH], pt(xH, yH) + ".")],
            traps: [{ spec: { kind: "pair", values: [xA + s * ux * (ux * ux + uy * uy), yA + s * uy * (ux * ux + uy * uy)] }, m: "On divise par ‖u‖² : s = AP·u / ‖u‖²." }, { spec: { kind: "pair", values: [xP, yP] }, m: "P n'est pas sur d." }] }); },
    ],
  };

  reg([
    { id: "expderiv", theme: "fa", label: "Exponentielle : dérivée, tangente, variations", ex: "(e^{ax})' = a\\,e^{ax}", FR: [11, 5], g: ED,
      hint: "(e^x)' = e^x et (e^(ax + b))' = a e^(ax + b). Produit : (uv)' = u'v + uv'. Comme e^x > 0, f'(x) = (…)e^x a le signe de la parenthèse.",
      comps: ["Dériver e^(ax), une somme avec e^x", "Produit (ax + b)e^x, tangente en 0, minimum", "Modèles e^(−kt), extremums, maximum de x e^(−x/k)"],
      lesson: ["Dériver avec l'exponentielle", "La fonction exponentielle est égale à sa dérivée : \\((e^x)' = e^x\\).",
        "Pour tout réel \\(a\\) : \\((e^{ax + b})' = a\\,e^{ax + b}\\). Avec un produit : \\((u\\,e^x)' = u'e^x + u\\,e^x = (u' + u)\\,e^x\\). Comme \\(e^x > 0\\), le signe de \\(f'(x) = (\\dots)\\,e^x\\) est celui de la parenthèse : on en déduit les variations. Pour \\(k > 0\\), \\(t \\mapsto e^{kt}\\) est croissante (croissance exponentielle) et \\(t \\mapsto e^{-kt}\\) décroissante (décroissance exponentielle).",
        ["\\((5e^{-2x})' = -10\\,e^{-2x}\\).", "\\(f(x) = (x - 3)e^x\\) : \\(f'(x) = (x - 2)e^x\\), minimum en \\(x = 2\\).", "Tangente en 0 à \\(e^{3x}\\) : \\(y = 3x + 1\\)."],
        "\\((e^{3x})'\\) n'est pas \\(e^{3x}\\), ni \\(3x\\,e^{3x - 1}\\) : on multiplie par 3, l'exposant ne change pas."],
      probs: [() => P("Un médicament injecté a une concentration C(t) = 12t e^(−0,5t) (mg/L, t en heures).", [["a) C'(t) = (12 − 6t)e^(−0,5t) s'annule pour t =", 2], ["b) Concentration maximale (au centième)", 8.83], ["c) C(4) (au centième)", 6.5]], ["(uv)' = u'v + uv' ; e^(−0,5t) > 0.", "Le maximum est en t = 2 : C(2) = 24 e^(−1)."], "a) " + M("C'(t) = 12e^{-0{,}5t} - 6t\\,e^{-0{,}5t} = (12 - 6t)e^{-0{,}5t}") + " s'annule en " + M("t = 2") + " (positive avant, négative après) ; b) " + M("C(2) = 24e^{-1} \\approx 8{,}83") + " mg/L ; c) " + M("C(4) = 48e^{-2} \\approx 6{,}50") + " mg/L.")] },
    { id: "trigrad", theme: "es", label: "Cercle trigonométrique en radians", ex: "\\cos\\left(\\frac{2\\pi}{3}\\right) = -\\frac{1}{2}", FR: [11, 5], g: TG,
      hint: "π rad = 180°. Cosinus = abscisse, sinus = ordonnée du point du cercle. Angles associés : −x (symétrie par rapport à l'axe des abscisses), π − x (axe des ordonnées), π + x (origine).",
      comps: ["Valeurs remarquables, conversions, angle d'un point", "Mesure principale, angles associés, cos² + sin² = 1", "Sommes exactes, lecture de cos x = a, quadrant donné"],
      lesson: ["Le cercle trigonométrique", "On enroule la droite des réels sur le cercle de centre \\(O\\) et de rayon 1 : à chaque réel \\(x\\) correspond un point \\(M\\) du cercle.",
        "Un tour complet mesure \\(2\\pi\\) : \\(\\pi\\) rad \\(= 180°\\). Le point \\(M\\) associé à \\(x\\) a pour coordonnées \\((\\cos x \\,;\\, \\sin x)\\), et \\(\\cos^2 x + \\sin^2 x = 1\\). \\(x\\) et \\(x + 2k\\pi\\) donnent le même point ; la mesure principale est celle de \\(]-\\pi \\,;\\, \\pi]\\). Angles associés : \\(\\cos(-x) = \\cos x\\), \\(\\sin(-x) = -\\sin x\\), \\(\\cos(\\pi - x) = -\\cos x\\), \\(\\sin(\\pi - x) = \\sin x\\), \\(\\cos(\\pi + x) = -\\cos x\\), \\(\\sin(\\pi + x) = -\\sin x\\).",
        ["\\(\\cos\\frac{\\pi}{3} = \\frac{1}{2}\\), \\(\\sin\\frac{\\pi}{4} = \\frac{\\sqrt{2}}{2}\\), \\(\\cos\\frac{5\\pi}{6} = -\\frac{\\sqrt{3}}{2}\\).", "\\(\\frac{17\\pi}{6} = \\frac{5\\pi}{6} + 2\\pi\\) : mesure principale \\(\\frac{5\\pi}{6}\\)."],
        "Le cosinus se lit sur l'axe horizontal, le sinus sur l'axe vertical ; et le quadrant donne le signe."],
      probs: [() => P("On sait que cos x = 0,6 et que x est dans [−π/2 ; 0].", [["a) sin² x", 0.64], ["b) sin x", -0.8], ["c) cos(π − x) + sin(−x)", 0.2]], ["cos² x + sin² x = 1.", "Sur [−π/2 ; 0], le sinus est négatif."], "a) " + M("1 - 0{,}36 = 0{,}64") + " ; b) " + M("-0{,}8") + " ; c) " + M("-0{,}6 + 0{,}8 = 0{,}2") + ".")] },
    { id: "droitenorm", theme: "es", label: "Vecteur normal, équation cartésienne, projeté orthogonal", ex: "\\vec{n}(a \\,;\\, b) \\perp d : ax + by + c = 0", FR: [11, 8], g: DN,
      hint: "La droite ax + by + c = 0 a pour vecteur normal (a ; b) et pour vecteur directeur (−b ; a). On trouve c avec un point de la droite. Projeté orthogonal de P : H = P + t·n, sur la droite.",
      comps: ["Vecteur normal, vecteur directeur, calculer c", "Perpendiculaire, médiatrice, tangente à un cercle", "Projeté orthogonal, hauteur d'un triangle"],
      lesson: ["Vecteur normal à une droite", "Un vecteur normal à une droite est un vecteur non nul orthogonal à ses vecteurs directeurs.",
        "La droite de vecteur normal \\(\\vec{n}(a \\,;\\, b)\\) a une équation \\(ax + by + c = 0\\) ; \\(c\\) se calcule avec un point de la droite. Réciproquement, \\(ax + by + c = 0\\) a pour vecteur normal \\((a \\,;\\, b)\\) et pour vecteur directeur \\((-b \\,;\\, a)\\). Le projeté orthogonal \\(H\\) d'un point \\(P\\) sur \\(d\\) est le point de \\(d\\) tel que \\(\\overrightarrow{PH}\\) soit normal à \\(d\\).",
        ["Normal \\((2 \\,;\\, -3)\\), passant par \\(A(1 \\,;\\, 4)\\) : \\(2x - 3y + 10 = 0\\).", "Médiatrice de \\([AB]\\) : normale \\(\\overrightarrow{AB}\\), passe par le milieu."],
        "\\((a \\,;\\, b)\\) est normal, \\((-b \\,;\\, a)\\) est directeur : ne les confonds pas."] },
  ]);
})();

// 25.11 · France, collège et 2nde : notions créées pour la couverture du programme (tools/france_couverture.md).
// 4e (attendus 2019) : cos4e (cosinus seul dans le triangle rectangle), thales4e (Thalès, triangles emboîtés).
// 3e : linfn (fonction linéaire, 3e-2019 PF.01, PF.09, PF.12), autodnb (automatismes de la partie 1 du DNB, sans
// calculatrice), vecgeo (translations et vecteurs, programme 2026 de 3e : en fin d'année, repris en 2nde).
// 2nde : tabvar (tableaux de variations : extremums, sens de variation, nombre de solutions, 2nde.AN.08–09).
// Outils communs : FRX (src/fr_1re.js). Notions sans CH ni MP : invisibles pour un élève suisse.
(function () {
  const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, lin, linE, QN, QR, QX, QS, QSet, QP, GR, GX, GP, TR, TX, TS, P, reg } = FRX;
  const deg = (r) => (r * 180) / Math.PI, rad = (d) => (d * Math.PI) / 180;
  const cm = (v) => M(N(v) + "\\ \\text{cm}"), m_ = (v) => M(N(v) + "\\ \\text{m}");
  const EUR = (v) => M(N(v) + "\\ \\text{€}");

  // ======================= linfn : fonction linéaire (3e) =======================
  const LF = {
    1: [
      () => { const a = pk([1.5, 2.5, 3, 4, -2, -3, 0.4, 0.6, 1.2]), x = pk([2, 4, 5, 6, 8, 10]), y = rnd(a * x);
        return QN("La fonction linéaire " + M("f") + " vérifie " + M("f(" + x + ") = " + N(y)) + ". Quel est son coefficient " + M("a") + " (" + M("f(x) = ax") + ") ?", a,
          M("f(x) = ax") + " et " + M("f(" + x + ") = " + N(y)) + " : " + M(x + "a = " + N(y)) + ", donc " + M("a = \\frac{" + N(y) + "}{" + x + "} = " + N(a)) + ".",
          { ctx: "coef", guide: [GX("Écris " + M("f(" + x + ")") + " avec la lettre " + M("a") + ".", x + "*a", M(x + "a") + "."), GR(M("a") + " ?", a, M(N(a)) + ".")],
            traps: [TR(rnd(y * x), "On divise l'image par " + x + ", on ne multiplie pas."), TR(rnd(x / y, 6), "a = f(x) ÷ x : l'image au numérateur."), TR(rnd(y - x), "Une fonction linéaire multiplie : a = f(x) ÷ x.")] }); },
      () => { const a = pk([1.2, 0.8, 1.5, 2.5, -1.5, 0.25, 0.75, -0.4]), x = pk([12, 20, 24, 30, 35, 40, -8, -16]), v = rnd(a * x);
        return QN("Soit la fonction linéaire " + M("f : x \\mapsto " + N(a) + "x") + ". Calcule l'image de " + M(N(x)) + ".", v,
          M("f(" + N(x) + ") = " + N(a) + X + NP(x) + " = " + N(v)) + ".",
          { ctx: "image", guide: [GR(M("f(" + N(x) + ") = " + N(a) + X + NP(x)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(x / a, 6), "L'image : on multiplie par " + N(a).replace("{,}", ",") + "."), TR(rnd(a + x), "f(x) = ax est un produit.")] }); },
      () => { const a = pk([0.8, 1.25, 1.5, 2.5, 0.6, 4, -3, 0.75]), x = pk([12, 20, 24, 30, 40, 48, 60]), y = rnd(a * x);
        return QN("Soit la fonction linéaire " + M("f(x) = " + N(a) + "x") + ". Quel est l'antécédent de " + M(N(y)) + " par " + M("f") + " ?", x,
          "On résout " + M(N(a) + "x = " + N(y)) + " : " + M("x = \\frac{" + N(y) + "}{" + N(a) + "} = " + N(x)) + ".",
          { ctx: "antecedent", guide: [GX("Quelle équation faut-il résoudre ? Écris son membre de gauche.", a + "*x", M(N(a) + "x = " + N(y)) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(a * y), "C'est l'image de " + N(y).replace("{,}", ",") + " : on cherche le nombre qui a pour image " + N(y).replace("{,}", ",") + "."), TR(rnd(a / y, 6), "x = " + N(y).replace("{,}", ",") + " ÷ " + N(a).replace("{,}", ",") + ".")] }); },
    ],
    2: [
      () => { const t = pk([5, 12, 15, 18, 20, 25, 30, 35, 40]), up = R.rand() < 0.5, k = rnd(up ? 1 + t / 100 : 1 - t / 100), x = pk([40, 60, 80, 120, 150, 250]), v = rnd(k * x);
        const c = pk([["Un prix", "€", "soldes"], ["Une facture d'électricité", "€", "facture"], ["La population d'un village", "habitants", "population"]]);
        return QN(c[0] + " " + (up ? "augmente" : "baisse") + " de " + M(t + "\\,\\%") + ". On note " + M("f(x)") + " la nouvelle valeur quand la valeur de départ est " + M("x") + " ; la fonction " + M("f") + " est linéaire. Quel est son coefficient ?", k,
          (up ? "Augmenter" : "Baisser") + " de " + M(t + "\\,\\%") + ", c'est multiplier par " + M("1 " + (up ? "+" : "-") + " \\frac{" + t + "}{100} = " + N(k)) + " : " + M("f(x) = " + N(k) + "x") + ". Par exemple " + M("f(" + x + ") = " + N(v)) + ".",
          { ctx: "pourcentage-" + c[2], guide: [GR(M(t + "\\,\\%") + " en écriture décimale ?", t / 100, M(N(t / 100)) + "."), GR("Coefficient ?", k, M(N(k)) + ".")],
            traps: [TR(rnd(t / 100), "C'est la variation seule : on garde aussi la valeur de départ (1 " + (up ? "+" : "−") + " …)."), TR(rnd(up ? 1 - t / 100 : 1 + t / 100), up ? "Une hausse : 1 + t/100." : "Une baisse : 1 − t/100."), TR(t, "Le coefficient est un nombre décimal, pas un pourcentage.")] }); },
      () => { const a = nz(-4, 4) * pk([1, 0.5, 1.5]), xA = pk([2, 4, 6, -2, -4]), yA = rnd(a * xA), x = pk([5, 7, 9, 10, -3, -5]), v = rnd(a * x); if (!a || x === xA) return null;
        return QN("La droite qui représente la fonction linéaire " + M("f") + " passe par le point " + M("A(" + N(xA) + " \\,;\\, " + N(yA) + ")") + ". Calcule " + M("f(" + N(x) + ")") + ".", v,
          "La droite passe par l'origine et par " + M("A") + " : " + M("a = \\frac{" + N(yA) + "}{" + N(xA) + "} = " + N(a)) + ", puis " + M("f(" + N(x) + ") = " + N(a) + X + NP(x) + " = " + N(v)) + ".",
          { ctx: "point", guide: [GR("Coefficient " + M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + N(x) + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(rnd((xA / yA) * x, 6), "a = ordonnée ÷ abscisse de A."), TR(rnd(yA + x - xA), "Une fonction linéaire est proportionnelle : on multiplie, on n'ajoute pas.")] }); },
      () => { const c = pk([["Le prix du fromage à la coupe est proportionnel à sa masse", "kg", "€", "fromage"], ["La distance parcourue par un TGV à vitesse constante est proportionnelle à la durée", "h", "km", "tgv"], ["La masse d'un câble est proportionnelle à sa longueur", "m", "kg", "cable"]]);
        const a = pk([12, 18, 24, 32, 2.5, 4.5]), x1 = pk([0.5, 1.5, 2.5, 0.75]), x2 = pk([1.25, 3.5, 4, 0.4]), y1 = rnd(a * x1), v = rnd(a * x2); if (x1 === x2) return null;
        return QN(c[0] + " : " + M(N(x1) + "\\ \\text{" + c[1] + "}") + " correspondent à " + M(N(y1) + "\\ \\text{" + c[2] + "}") + ". Avec la fonction linéaire " + M("f(x) = ax") + ", calcule ce qui correspond à " + M(N(x2) + "\\ \\text{" + c[1] + "}") + ".", v,
          M("a = \\frac{" + N(y1) + "}{" + N(x1) + "} = " + N(a)) + " (en " + c[2] + " par " + c[1] + ") et " + M("f(" + N(x2) + ") = " + N(a) + X + N(x2) + " = " + N(v)) + " " + c[2] + ".",
          { ctx: "contexte-" + c[3], guide: [GR("Coefficient " + M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + N(x2) + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(y1 * x2), "On passe d'abord par 1 " + c[1] + " : a = " + N(y1).replace("{,}", ",") + " ÷ " + N(x1).replace("{,}", ",") + "."), TR(rnd(y1 + x2 - x1), "C'est proportionnel : on multiplie par a.")] }); },
    ],
    3: [
      () => { const a = nz(-5, 6) * pk([1, 1.5]), p = R.int(2, 5), q = R.int(3, 7), r = R.int(6, 11), s = rnd(a * (p + q)); if (!a || p === q) return null;
        return QN("Pour une fonction linéaire " + M("f") + ", on sait que " + M("f(" + p + ") + f(" + q + ") = " + N(s)) + ". Calcule " + M("f(" + r + ")") + ".", rnd(a * r),
          M("f(" + p + ") + f(" + q + ") = " + p + "a + " + q + "a = " + (p + q) + "a = " + N(s)) + " : " + M("a = " + N(a)) + ". Donc " + M("f(" + r + ") = " + N(rnd(a * r))) + ". (Ou : " + M("f(" + p + ") + f(" + q + ") = f(" + (p + q) + ")") + ", propriété de linéarité.)",
          { ctx: "somme-images", guide: [GR(M("f(" + p + ") + f(" + q + ")") + " = combien de fois " + M("a") + " ?", p + q, M(p + q) + "."), GR(M("a") + " ?", a, M(N(a)) + "."), GR(M("f(" + r + ")") + " ?", rnd(a * r), M(N(rnd(a * r))) + ".")],
            traps: [TR(rnd((s / 2 / p) * r, 6), "f(" + p + ") et f(" + q + ") ne sont pas égales : écris-les avec a."), TR(rnd(s / (p + q)), "C'est a ; il reste à calculer f(" + r + ").")] }); },
      () => { const t1 = pk([10, 20, 25, 30, 50]), t2 = pk([10, 20, 25, 40]), up1 = R.rand() < 0.6, up2 = R.rand() < 0.4, k = rnd((1 + (up1 ? 1 : -1) * t1 / 100) * (1 + (up2 ? 1 : -1) * t2 / 100));
        if (Math.abs(k - 1) < 1e-9) return null;
        return QN("Un article " + (up1 ? "augmente" : "baisse") + " de " + M(t1 + "\\,\\%") + ", puis " + (up2 ? "augmente" : "baisse") + " de " + M(t2 + "\\,\\%") + ". Le prix final est " + M("f(x) = kx") + " où " + M("x") + " est le prix de départ. Que vaut " + M("k") + " ?", k,
          "On compose deux fonctions linéaires : " + M("k = " + N(rnd(1 + (up1 ? 1 : -1) * t1 / 100)) + X + N(rnd(1 + (up2 ? 1 : -1) * t2 / 100)) + " = " + N(k)) + " (évolution globale de " + M(N(rnd((k - 1) * 100)) + "\\,\\%") + ").",
          { ctx: "composition", guide: [GR("Premier coefficient ?", rnd(1 + (up1 ? 1 : -1) * t1 / 100), M(N(rnd(1 + (up1 ? 1 : -1) * t1 / 100))) + "."), GR("Second coefficient ?", rnd(1 + (up2 ? 1 : -1) * t2 / 100), M(N(rnd(1 + (up2 ? 1 : -1) * t2 / 100))) + "."), GR(M("k") + " ?", k, M(N(k)) + ".")],
            traps: [TR(rnd(1 + ((up1 ? 1 : -1) * t1 + (up2 ? 1 : -1) * t2) / 100), "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TR(rnd(((up1 ? 1 : -1) * t1 / 100) * ((up2 ? 1 : -1) * t2 / 100)), "On multiplie les coefficients 1 ± t/100, pas les taux.")] }); },
      () => { const a = pk([1.5, 2, 2.5, 3, 0.5]), b = pk([2, 3, 4]) * pk([1, -1]), c = pk([4, 6, 8, 10, 12, -6]), x = rnd(c / (a - b), 6); if (a === b || !Number.isInteger(x * 2)) return null;
        return QN("Soit la fonction linéaire " + M("f(x) = " + N(a) + "x") + " et la fonction affine " + M("g(x) = " + lin(b, c)) + ". Pour quelle valeur de " + M("x") + " a-t-on " + M("f(x) = g(x)") + " ?", x,
          M(N(a) + "x = " + lin(b, c)) + " : " + M(N(rnd(a - b)) + "x = " + N(c)) + ", " + M("x = " + N(x)) + ". Les deux droites se coupent au point d'abscisse " + M(N(x)) + ".",
          { ctx: "intersection", guide: [GX("Après avoir regroupé les " + M("x") + " à gauche : " + M("(\\dots)x = " + N(c)) + ". Que vaut le coefficient ?", String(rnd(a - b)), M(N(rnd(a - b))) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(c / (a + b), 6), "En passant " + N(b).replace("{,}", ",") + "x à gauche, on change son signe."), TR(rnd(-c / (a - b), 6), "Attention au signe de " + c + ".")] }); },
    ],
  };

  // ======================= cos4e : cosinus dans le triangle rectangle (4e, attendus 2019) =======================
  const CS = {
    1: [
      () => { const h = pk([5, 6, 7, 8, 9, 10, 12, 15]), a = R.int(20, 70), v = h * Math.cos(rad(a));
        return QR("Le triangle " + M("ABC") + " est rectangle en " + M("B") + ", avec " + M("AC = " + h) + " cm et " + M("\\widehat{BAC} = " + a + "°") + ". Calcule " + M("AB") + " (au dixième de cm).", v, 0.1,
          M("[AB]") + " est le côté adjacent à " + M("\\widehat{A}") + " et " + M("[AC]") + " l'hypoténuse : " + M("\\cos \\widehat{A} = \\frac{AB}{AC}") + ", donc " + M("AB = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(v, 1))) + " cm.",
          { ctx: "adjacent", guide: [GR("Valeur approchée de " + M("\\cos " + a + "°") + " (au millième) ?", Math.cos(rad(a)), M("\\approx " + N(rnd(Math.cos(rad(a)), 3))) + ".", 0.001), GR(M("AB") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(h / Math.cos(rad(a)), 1), "AB = AC × cos A : on multiplie (AC est l'hypoténuse)."), TR(rnd(h * Math.sin(rad(a)), 1), "Le cosinus utilise le côté adjacent, pas l'opposé.")] }); },
      () => { const adj = pk([4, 5, 6, 7, 8, 9, 12]), a = R.int(25, 65), v = adj / Math.cos(rad(a));
        return QR("Le triangle " + M("EFG") + " est rectangle en " + M("F") + ", avec " + M("EF = " + adj) + " cm et " + M("\\widehat{FEG} = " + a + "°") + ". Calcule l'hypoténuse " + M("EG") + " (au dixième de cm).", v, 0.1,
          M("\\cos \\widehat{E} = \\frac{EF}{EG}") + ", donc " + M("EG = \\frac{EF}{\\cos " + a + "°} = \\frac{" + adj + "}{\\cos " + a + "°} \\approx " + N(rnd(v, 1))) + " cm.",
          { ctx: "hypotenuse", guide: [GX("Écris " + M("\\cos \\widehat{E}") + " comme un quotient de longueurs : numérateur ? (tape EF ou EG)", "EF", M("\\frac{EF}{EG}") + " : adjacent sur hypoténuse."), GR(M("EG") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(adj * Math.cos(rad(a)), 1), "L'hypoténuse est le plus grand côté : on divise par cos A."), TR(rnd(adj / Math.sin(rad(a)), 1), "Cosinus, pas sinus.")] }); },
      () => { const [p, q] = pk([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17], [7, 25], [6, 10]]), v = p / q;
        return QN("Le triangle " + M("RST") + " est rectangle en " + M("S") + ", avec " + M("RS = " + p) + " cm et " + M("RT = " + q) + " cm. Donne la valeur exacte de " + M("\\cos \\widehat{SRT}") + " (fraction ou décimal).", v,
          M("[RS]") + " est adjacent à l'angle " + M("\\widehat{R}") + " et " + M("[RT]") + " est l'hypoténuse : " + M("\\cos \\widehat{R} = \\frac{RS}{RT} = \\frac{" + p + "}{" + q + "}" + (FS(v).includes("/") && FS(v) !== p + "/" + q ? " = " + F(v) : "")) + ".",
          { ctx: "rapport", guide: [GR("Longueur de l'hypoténuse ?", q, M("RT = " + q) + " (en face de l'angle droit)."), GR(M("\\cos \\widehat{SRT}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(q / p, "Cosinus = adjacent ÷ hypoténuse : il est inférieur à 1."), TR(rnd(Math.sqrt(q * q - p * p) / q), "C'est le côté adjacent RS qui compte, pas ST.")] }); },
    ],
    2: [
      () => { const [adj, h] = pk([[4, 7], [5, 8], [6, 9], [3, 8], [7, 10], [9, 12], [5, 11]]), v = deg(Math.acos(adj / h));
        return QR("Le triangle " + M("KLM") + " est rectangle en " + M("L") + ", avec " + M("KL = " + adj) + " cm et " + M("KM = " + h) + " cm. Calcule " + M("\\widehat{LKM}") + " (au degré près).", v, 1,
          M("\\cos \\widehat{K} = \\frac{KL}{KM} = \\frac{" + adj + "}{" + h + "}") + " ; à la calculatrice, " + M("\\widehat{K} = \\arccos\\left(\\frac{" + adj + "}{" + h + "}\\right) \\approx " + Math.round(v) + "°") + ".",
          { ctx: "angle", guide: [GR(M("\\cos \\widehat{K}") + " (au millième) ?", adj / h, M("\\frac{" + adj + "}{" + h + "} \\approx " + N(rnd(adj / h, 3))) + ".", 0.001), GR("Angle (touche arccos ou cos⁻¹) ?", v, M("\\approx " + Math.round(v) + "°") + ".", 1)],
            traps: [TR(Math.round(deg(Math.asin(adj / h))), "C'est l'arcsinus : avec l'adjacent et l'hypoténuse, on utilise arccos."), TR(Math.round(90 - v), "C'est l'autre angle aigu.")] }); },
      () => { const L = pk([3, 4, 4.5, 5, 6]), a = R.int(60, 80), v = L * Math.cos(rad(a));
        return QR("Une échelle de " + m_(L) + " est appuyée contre un mur vertical. Elle fait un angle de " + M(a + "°") + " avec le sol horizontal. À quelle distance du mur se trouve son pied (au centimètre près, en m) ?", v, 0.01,
          "Le mur, le sol et l'échelle forment un triangle rectangle ; l'échelle est l'hypoténuse et la distance au mur est adjacente à l'angle au sol : " + M("d = " + N(L) + X + "\\cos " + a + "° \\approx " + N(rnd(v, 2))) + " m.",
          { ctx: "echelle", guide: [GR("Longueur de l'hypoténuse (en m) ?", L, m_(L) + " : l'échelle."), GR("Distance (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
            traps: [TR(rnd(L * Math.sin(rad(a)), 2), "C'est la hauteur atteinte sur le mur : la distance au mur est adjacente à l'angle au sol."), TR(rnd(L / Math.cos(rad(a)), 2), "L'échelle est l'hypoténuse : on multiplie par cos.")] }); },
      () => { const c = pk([["Un toboggan aquatique", "toboggan"], ["Une rampe d'accès pour fauteuil roulant", "rampe"], ["Un tapis roulant de gare", "tapis"]]), d = pk([6, 8, 10, 12, 15]), a = pk([5, 8, 10, 12, 15, 20]), v = d / Math.cos(rad(a));
        return QR(c[0] + " couvre une distance horizontale de " + m_(d) + " et fait un angle de " + M(a + "°") + " avec l'horizontale. Quelle est sa longueur (au centimètre près, en m) ?", v, 0.01,
          "La longueur est l'hypoténuse, la distance horizontale le côté adjacent : " + M("L = \\frac{" + d + "}{\\cos " + a + "°} \\approx " + N(rnd(v, 2))) + " m.",
          { ctx: c[1], guide: [GR(M("\\cos " + a + "°") + " (au millième) ?", Math.cos(rad(a)), M("\\approx " + N(rnd(Math.cos(rad(a)), 3))) + ".", 0.001), GR("Longueur (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
            traps: [TR(rnd(d * Math.cos(rad(a)), 2), "La longueur est plus grande que la distance horizontale : on divise par cos."), TR(d, "La pente allonge la longueur.")] }); },
    ],
    3: [
      () => { const h = pk([10, 12, 13, 15, 17, 20]), a = R.int(30, 60), adj = h * Math.cos(rad(a)), opp = Math.sqrt(h * h - adj * adj);
        return QR("Le triangle " + M("ABC") + " est rectangle en " + M("C") + ", avec " + M("AB = " + h) + " cm et " + M("\\widehat{BAC} = " + a + "°") + ". Calcule " + M("AC") + " avec le cosinus, puis " + M("BC") + " avec le théorème de Pythagore. Donne " + M("BC") + " au dixième de cm.", opp, 0.1,
          M("AC = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(adj, 2))) + " cm ; " + M("BC = \\sqrt{AB^2 - AC^2} \\approx " + N(rnd(opp, 1))) + " cm.",
          { ctx: "deux-etapes", guide: [GR(M("AC") + " (au centième) ?", adj, M("\\approx " + N(rnd(adj, 2))) + " cm.", 0.01), GR(M("BC") + " (au dixième) ?", opp, M("\\approx " + N(rnd(opp, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(adj, 1), "C'est AC ; on demande BC (Pythagore ensuite)."), TR(rnd(Math.sqrt(h * h + adj * adj), 1), "AB est l'hypoténuse : BC² = AB² − AC².")] }); },
      () => { const b = pk([6, 8, 10, 12]), s = pk([5, 6, 7, 8, 9, 10]).valueOf(), side = Math.max(s, b / 2 + 1), v = deg(Math.acos(b / 2 / side));
        return QR("Le triangle " + M("ABC") + " est isocèle en " + M("A") + ", avec " + M("AB = AC = " + side) + " cm et " + M("BC = " + b) + " cm. Calcule l'angle " + M("\\widehat{ABC}") + " au degré près (trace la hauteur issue de " + M("A") + ").", v, 1,
          "La hauteur issue de " + M("A") + " coupe " + M("[BC]") + " en son milieu " + M("H") + " : " + M("BH = " + N(b / 2)) + ". Dans le triangle " + M("ABH") + " rectangle en " + M("H") + " : " + M("\\cos \\widehat{B} = \\frac{BH}{AB} = \\frac{" + N(b / 2) + "}{" + side + "}") + ", " + M("\\widehat{B} \\approx " + Math.round(v) + "°") + ".",
          { ctx: "isocele", guide: [GR(M("BH") + " ?", b / 2, M(N(b / 2)) + " cm (milieu de [BC])."), GR(M("\\widehat{ABC}") + " ?", v, M("\\approx " + Math.round(v) + "°") + ".", 1)],
            traps: [TR(Math.round(deg(Math.acos(Math.min(1, b / side)))), "La hauteur partage [BC] en deux : BH = " + b / 2 + "."), TR(Math.round(180 - 2 * v), "C'est l'angle au sommet A.")] }); },
      () => { const h = pk([8, 10, 12, 15]), a = R.int(25, 65), v = h * Math.cos(rad(a)), w = h * Math.sin(rad(a)), nm = pk(["Lina", "Yanis", "Inès", "Noé"]);
        return QR("Dans le triangle " + M("PQR") + " rectangle en " + M("Q") + ", " + M("PR = " + h) + " cm et " + M("\\widehat{QPR} = " + a + "°") + ". " + nm + " écrit : « " + M("\\cos \\widehat{P} = \\frac{QR}{PR}") + ", donc " + M("QR = " + h + X + "\\cos " + a + "°") + " ». Trouve l'erreur, puis calcule " + M("PQ") + " au dixième de cm.", v, 0.1,
          "Le côté adjacent à " + M("\\widehat{P}") + " est " + M("[PQ]") + ", pas " + M("[QR]") + " (opposé) : " + M("\\cos \\widehat{P} = \\frac{PQ}{PR}") + ", " + M("PQ = " + h + X + "\\cos " + a + "° \\approx " + N(rnd(v, 1))) + " cm.",
          { ctx: "erreur", guide: [GX("Quel côté est adjacent à l'angle " + M("\\widehat{P}") + " ? (tape PQ ou QR)", "PQ", M("[PQ]") + " : il touche P et n'est pas l'hypoténuse."), GR(M("PQ") + " ?", v, M("\\approx " + N(rnd(v, 1))) + " cm.", 0.1)],
            traps: [TR(rnd(w, 1), "C'est QR (le côté opposé)."), TR(rnd(h / Math.cos(rad(a)), 1), "PQ = PR × cos P.")] }); },
    ],
  };

  // ======================= thales4e : Thalès dans des triangles emboîtés (4e, attendus 2019) =======================
  const tri = () => { const k = pk([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4]]), q = k[0] / k[1], u = pk([1, 1.5, 2, 2.5, 3]); return { q, k, AB: rnd(k[1] * u * pk([2, 3, 4])), AC: rnd(k[1] * u * pk([2, 3, 5])), BC: rnd(k[1] * pk([2, 3, 4, 5])) }; };
  const cfg = "Dans le triangle " + M("ABC") + ", " + M("M \\in [AB]") + ", " + M("N \\in [AC]") + " et " + M("(MN) \\parallel (BC)") + ". ";
  const TH = {
    1: [
      () => { const t = tri(), AM = rnd(t.q * t.AB), v = rnd(t.q * t.BC);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("BC = " + N(t.BC)) + " cm. Calcule " + M("MN") + ".", v,
          "D'après le théorème de Thalès, " + M("\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}") + ". Donc " + M("MN = BC" + X + "\\frac{AM}{AB} = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "MN", guide: [GR("Rapport " + M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + "."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.BC / t.q), "Le petit triangle est une réduction : MN < BC."), TR(rnd(t.BC * (1 - t.q)), "Le rapport est AM/AB, pas MB/AB.")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB), v = rnd(t.q * t.AC);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("AC = " + N(t.AC)) + " cm. Calcule " + M("AN") + ".", v,
          M("\\frac{AN}{AC} = \\frac{AM}{AB}") + " (Thalès), donc " + M("AN = " + N(t.AC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "AN", guide: [GR(M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + "."), GR(M("AN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.AC / t.q), "AN est plus petit que AC."), TR(rnd(t.AC - v), "C'est NC = AC − AN : on demande AN.")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm et " + M("AB = " + N(t.AB)) + " cm. Par quel nombre faut-il multiplier les longueurs du triangle " + M("ABC") + " pour obtenir celles du triangle " + M("AMN") + " (fraction acceptée) ?", t.q,
          "Le triangle " + M("AMN") + " est une réduction de " + M("ABC") + " de rapport " + M("\\frac{AM}{AB} = \\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + F(t.q)) + ".",
          { ctx: "rapport", guide: [GR(M("\\frac{AM}{AB}") + " ?", t.q, M(F(t.q)) + ".")],
            traps: [TR(rnd(1 / t.q, 6), "On passe du grand au petit triangle : le rapport est inférieur à 1."), TR(rnd(1 - t.q, 6), "Le rapport est AM/AB.")] }); },
    ],
    2: [
      () => { const t = tri(), AM = rnd(t.q * t.AB), MB = rnd(t.AB - AM), v = rnd(t.q * t.BC);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("MB = " + N(MB)) + " cm et " + M("BC = " + N(t.BC)) + " cm. Calcule " + M("MN") + ".", v,
          M("AB = AM + MB = " + N(t.AB)) + " cm ; " + M("MN = BC" + X + "\\frac{AM}{AB} = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "MB", guide: [GR(M("AB") + " ?", t.AB, M(N(t.AB)) + " cm."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.BC * AM / MB), "Le rapport de Thalès est AM/AB, pas AM/MB."), TR(rnd(t.BC * MB / t.AB), "C'est MB/AB : prends AM/AB.")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB), AN = rnd(t.q * t.AC), v = rnd(t.AC - AN);
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + " cm, " + M("AB = " + N(t.AB)) + " cm et " + M("AN = " + N(AN)) + " cm. Calcule " + M("NC") + ".", v,
          M("\\frac{AN}{AC} = \\frac{AM}{AB}") + " donne " + M("AC = AN" + X + "\\frac{AB}{AM} = " + N(t.AC)) + " cm, puis " + M("NC = AC - AN = " + N(v)) + " cm.",
          { ctx: "NC", guide: [GR(M("AC") + " ?", t.AC, M(N(t.AC)) + " cm."), GR(M("NC") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(t.AC, "C'est AC ; on demande NC = AC − AN."), TR(rnd(AN * t.q), "AC = AN × AB / AM (le grand côté est au dénominateur du rapport).")] }); },
      () => { const c = pk([["Sur la charpente d'un toit, une entretoise horizontale", "entretoise", "charpente"], ["Sur une échelle double, une barre de sécurité horizontale", "barre", "echelle-double"], ["Dans un chevalet de peintre, une traverse", "traverse", "chevalet"]]);
        const base = pk([1.2, 1.5, 1.8, 2, 2.4]), L = pk([2, 2.5, 3]), d = pk([0.5, 0.8, 1, 1.2]), v = rnd((base * d) / L, 4); if (d >= L) return null;
        return QR(c[0] + " relie deux montants de " + m_(L) + " de long, à " + m_(d) + " du sommet, parallèlement au sol. Les pieds des montants sont écartés de " + m_(base) + ". Quelle est la longueur de la " + c[1] + " (au centimètre près, en m) ?", v, 0.01,
          "Triangles emboîtés au sommet, côtés parallèles : " + M("\\frac{\\ell}{" + N(base) + "} = \\frac{" + N(d) + "}{" + N(L) + "}") + ", donc " + M("\\ell = " + N(base) + X + "\\frac{" + N(d) + "}{" + N(L) + "} \\approx " + N(rnd(v, 2))) + " m.",
          { ctx: c[2], guide: [GR("Rapport de réduction " + M("\\frac{" + N(d) + "}{" + N(L) + "}") + " ?", d / L, M(F(d / L)) + "."), GR("Longueur (au cm) ?", v, M("\\approx " + N(rnd(v, 2))) + " m.", 0.01)],
            traps: [TR(rnd(base * (L - d) / L, 2), "La distance au sommet est " + N(d).replace("{,}", ",") + " m : le rapport est " + N(d).replace("{,}", ",") + "/" + N(L).replace("{,}", ",") + "."), TR(rnd(base * L / d, 2), "La traverse est plus courte que l'écart au sol.")] }); },
    ],
    3: [
      () => { const t = tri(), AM = rnd(t.q * t.AB), AN = rnd(t.q * t.AC), MN = rnd(t.q * t.BC), v = rnd(MN + (t.AC - AN) + t.BC + (t.AB - AM));
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + ", " + M("AB = " + N(t.AB)) + ", " + M("AN = " + N(AN)) + " et " + M("MN = " + N(MN)) + " (en cm). Calcule le périmètre du trapèze " + M("MNCB") + ".", v,
          "Rapport " + M("\\frac{AM}{AB} = " + F(t.q)) + " : " + M("BC = \\frac{MN}{" + F(t.q) + "} = " + N(t.BC)) + ", " + M("AC = " + N(t.AC)) + ". Périmètre " + M("= MN + NC + CB + BM = " + N(MN) + " + " + N(rnd(t.AC - AN)) + " + " + N(t.BC) + " + " + N(rnd(t.AB - AM)) + " = " + N(v)) + " cm.",
          { ctx: "perimetre", guide: [GR(M("BC") + " ?", t.BC, M(N(t.BC)) + " cm."), GR(M("NC") + " ?", rnd(t.AC - AN), M(N(rnd(t.AC - AN))) + " cm."), GR("Périmètre ?", v, M(N(v)) + " cm.")],
            traps: [TR(rnd(t.AB + t.AC + t.BC), "C'est le périmètre de ABC ; le trapèze est MNCB."), TR(rnd(MN + t.AC + t.BC + t.AB), "NC = AC − AN et BM = AB − AM.")] }); },
      () => { const k = pk([2, 3, 4]), x = pk([2, 3, 4, 5, 6]), MB = rnd(x * (k - 1)), AN = pk([3, 4, 5, 6]), NC = rnd(AN * (k - 1));
        return QN(cfg + "On sait que " + M("AM = x") + ", " + M("MB = " + N(MB)) + ", " + M("AN = " + N(AN)) + " et " + M("NC = " + N(NC)) + " (en cm). Que vaut " + M("x") + " ?", x,
          M("\\frac{AM}{AB} = \\frac{AN}{AC}") + " : " + M("\\frac{x}{x + " + N(MB) + "} = \\frac{" + N(AN) + "}{" + N(AN + NC) + "}") + ". Produit en croix : " + M(N(AN + NC) + "x = " + N(AN) + "x + " + N(AN * MB)) + ", " + M("x = " + N(x)) + ".",
          { ctx: "equation", guide: [GR("Rapport " + M("\\frac{AN}{AC}") + " ?", AN / (AN + NC), M("\\frac{" + AN + "}{" + (AN + NC) + "} = " + F(AN / (AN + NC))) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(MB * AN / (AN + NC)), "AB = x + " + MB + " : x est aussi dans AB."), TR(rnd(MB * (AN + NC) / AN), "Écris AM/AB = AN/AC avec AM = x et AB = x + " + MB + ".")] }); },
      () => { const t = tri(), AM = rnd(t.q * t.AB), MB = rnd(t.AB - AM), v = rnd(t.q * t.BC), wrong = rnd((AM / MB) * t.BC), nm = pk(["Lina", "Sam", "Inès", "Noé"]);
        if (Math.abs(wrong - v) < 1e-9) return null;
        return QN(cfg + "On sait que " + M("AM = " + N(AM)) + ", " + M("MB = " + N(MB)) + " et " + M("BC = " + N(t.BC)) + " (en cm). " + nm + " écrit : « " + M("\\frac{AM}{MB} = \\frac{MN}{BC}") + ", donc " + M("MN = " + N(wrong)) + " ». Trouve l'erreur, puis calcule " + M("MN") + ".", v,
          "Les rapports de Thalès comparent le petit triangle " + M("AMN") + " au grand " + M("ABC") + " : " + M("\\frac{AM}{AB}") + ", pas " + M("\\frac{AM}{MB}") + ". " + M("MN = " + N(t.BC) + X + "\\frac{" + N(AM) + "}{" + N(t.AB) + "} = " + N(v)) + " cm.",
          { ctx: "erreur", guide: [GR(M("AB") + " ?", t.AB, M(N(t.AB)) + " cm."), GR(M("MN") + " ?", v, M(N(v)) + " cm.")],
            traps: [TR(wrong, "C'est l'erreur de " + nm + " : le rapport est AM/AB.")] }); },
    ],
  };

  // ======================= autodnb : automatismes de la partie 1 du DNB (3e, sans calculatrice) =======================
  const SC = "Sans calculatrice : ";
  const fr = (n, d) => { const g = g2(n, d) || 1; n /= g; d /= g; return d === 1 ? N(n) : (n < 0 ? "-" : "") + "\\frac{" + Math.abs(n) + "}{" + d + "}"; };
  const AD = {
    1: [
      () => { const [a, b] = pk([[2, 3], [3, 4], [1, 6], [5, 6], [3, 8], [2, 5]]), [c, d] = pk([[5, 6], [1, 4], [2, 9], [3, 10], [1, 12]]), [e, f] = pk([[3, 5], [2, 3], [4, 3], [6, 5], [3, 2]]), v = a / b + (c / d) * (e / f);
        { const dv = FRX.den(v); if (!dv || dv > 60) return null; }
        return QN(SC + "calcule " + M(fr(a, b) + " + " + fr(c, d) + X + fr(e, f)) + ". Donne le résultat sous forme de fraction irréductible.", v,
          "La multiplication d'abord : " + M(fr(c, d) + X + fr(e, f) + " = " + F((c * e) / (d * f))) + ", puis " + M(fr(a, b) + " + " + F((c * e) / (d * f)) + " = " + F(v)) + ".",
          { ctx: "fractions", guide: [GR("Produit " + M(fr(c, d) + X + fr(e, f)) + " ?", (c * e) / (d * f), M(F((c * e) / (d * f))) + "."), GR("Résultat ?", v, M(F(v)) + ".")],
            traps: [TR((a / b + c / d) * (e / f), "La multiplication est prioritaire sur l'addition."), TR((a + c) / (b + d) * (e / f) + 0, "On n'additionne pas les dénominateurs.")] }); },
      () => { const a = pk([2, 3, 4, 5, 6, 8]), b = pk([2, 3, 4, 5, 1.5, 2.5]), p = R.int(3, 7), q = -R.int(1, 5), v = rnd(a * b * 10 ** (p + q));
        return QN(SC + "donne l'écriture décimale de " + M(N(a) + " \\times 10^{" + p + "} \\times " + N(b) + " \\times 10^{" + q + "}") + ".", v,
          M(N(a) + X + N(b) + " = " + N(rnd(a * b))) + " et " + M("10^{" + p + "} \\times 10^{" + q + "} = 10^{" + (p + q) + "}") + " : " + M(N(rnd(a * b)) + " \\times 10^{" + (p + q) + "} = " + N(v)) + ".",
          { ctx: "puissances", guide: [GR(M("10^{" + p + "} \\times 10^{" + q + "} = 10^{n}") + " : " + M("n") + " ?", p + q, M(p + q) + " (on ajoute les exposants)."), GR("Écriture décimale ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(a * b * 10 ** (p * q)), "10ᵖ × 10^q = 10^(p+q) : on ajoute les exposants."), TR(rnd((a + b) * 10 ** (p + q)), "On multiplie " + a + " par " + N(b).replace("{,}", ",") + ".")] }); },
      () => { const x = pk([40, 60, 80, 120, 150, 200, 250]), t = pk([5, 10, 15, 20, 25, 30]), up = R.rand() < 0.6, v = rnd(x * (1 + (up ? 1 : -1) * t / 100)), c = pk(["Un vélo", "Un forfait de téléphone", "Un billet de concert", "Une paire de chaussures"]);
        return QN(SC + c.toLowerCase() + " coûte " + EUR(x) + ". Son prix " + (up ? "augmente" : "baisse") + " de " + M(t + "\\,\\%") + ". Quel est son nouveau prix (en €) ?", v,
          M(t + "\\,\\%") + " de " + M(x) + " : " + M(N(rnd((x * t) / 100))) + ". Nouveau prix : " + M(x + (up ? " + " : " - ") + N(rnd((x * t) / 100)) + " = " + N(v)) + " € (ou " + M(x + X + N(rnd(1 + (up ? 1 : -1) * t / 100)) + ")") + ".",
          { ctx: "evolution", guide: [GR(M(t + "\\,\\%") + " de " + M(x) + " ?", rnd((x * t) / 100), M(N(rnd((x * t) / 100))) + "."), GR("Nouveau prix ?", v, EUR(v) + ".")],
            traps: [TR(rnd((x * t) / 100), "C'est la " + (up ? "hausse" : "baisse") + " : il reste à l'" + (up ? "ajouter" : "enlever") + "."), TR(x + (up ? t : -t), "Un pourcentage s'applique au prix : " + t + " % de " + x + ".")] }); },
      () => { const [a, b, c] = pk([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]), hyp = R.rand() < 0.6;
        return QN(SC + "le triangle " + M("ABC") + " est rectangle en " + M("A") + ", " + (hyp ? M("AB = " + a) + " cm et " + M("AC = " + b) + " cm. Calcule " + M("BC") : M("AB = " + a) + " cm et " + M("BC = " + c) + " cm. Calcule " + M("AC")) + " (en cm).", hyp ? c : b,
          "Pythagore : " + (hyp ? M("BC^2 = " + a + "^2 + " + b + "^2 = " + (a * a + b * b)) + ", " + M("BC = " + c) : M("AC^2 = " + c + "^2 - " + a + "^2 = " + (c * c - a * a)) + ", " + M("AC = " + b)) + " cm.",
          { ctx: "pythagore", guide: [GR((hyp ? M("BC^2") : M("AC^2")) + " ?", hyp ? c * c : b * b, M(hyp ? c * c : b * b) + "."), GR("Longueur ?", hyp ? c : b, M(hyp ? c : b) + " cm.")],
            traps: [TR(hyp ? a + b : c - a, "Pythagore porte sur les carrés des longueurs."), TR(hyp ? Math.round(Math.sqrt(Math.abs(b * b - a * a)) * 100) / 100 : Math.round(Math.sqrt(c * c + a * a) * 100) / 100, "L'hypoténuse est le côté opposé à l'angle droit : " + (hyp ? "BC." : "BC est connu."))] }); },
    ],
    2: [
      () => { const a = pk([2, 3, 5]), b = nz(-7, 7), e = (a * a) + "*x^2" + (b < 0 ? "-" : "+") + Math.abs(2 * a * b) + "*x+" + b * b;
        return QX(SC + "développe et réduis " + M("(" + lin(a, b) + ")^2") + ".", e, M("(" + lin(a, b) + ")^2 = " + N(a * a) + "x^2" + sg(2 * a * b) + "x + " + N(b * b)) + " (identité " + M(b > 0 ? "(u + v)^2 = u^2 + 2uv + v^2" : "(u - v)^2 = u^2 - 2uv + v^2") + ").",
          { ctx: "developper", guide: [GR("Coefficient de " + M("x^2") + " ?", a * a, M(N(a * a)) + "."), GR("Coefficient de " + M("x") + " (double produit) ?", 2 * a * b, M(N(2 * a * b)) + "."), GX("Résultat ?", e, M(N(a * a) + "x^2" + sg(2 * a * b) + "x + " + N(b * b)) + ".")],
            traps: [TX((a * a) + "*x^2+" + b * b, "N'oublie pas le double produit 2uv."), TX(a + "*x^2+" + (2 * a * b) + "*x+" + b * b, "(" + a + "x)² = " + a * a + "x²."), TX((a * a) + "*x^2+" + (a * b) + "*x+" + b * b, "Le double produit vaut 2 × " + a + "x × " + b + ".")] }); },
      () => { const m = pk([50, 100, 200, 30, 70]), d = pk([1, 2, 3]), v = 4 * m * d;
        return QN(SC + "calcule " + M((m + d) + "^2 - " + (m - d) + "^2") + ".", v,
          M("a^2 - b^2 = (a - b)(a + b)") + " : " + M("(" + (m + d) + " - " + (m - d) + ")(" + (m + d) + " + " + (m - d) + ") = " + 2 * d + X + 2 * m + " = " + N(v)) + ".",
          { ctx: "identite", guide: [GR(M((m + d) + " - " + (m - d)) + " ?", 2 * d, M(2 * d) + "."), GR(M((m + d) + " + " + (m - d)) + " ?", 2 * m, M(2 * m) + "."), GR("Résultat ?", v, M(N(v)) + ".")],
            traps: [TR((2 * d) ** 2, "a² − b² n'est pas (a − b)²."), TR(2 * d, "a² − b² = (a − b)(a + b) : il manque le facteur a + b.")] }); },
      () => { const r = R.int(2, 7), b = R.int(2, 7), g = R.int(1, 6), n = r + b + g, which = pk([["ne soit pas bleue", r + g], ["soit rouge ou verte", r + g], ["ne soit pas rouge", b + g]]), v = which[1] / n;
        return QN(SC + "un sac contient " + r + " boules rouges, " + b + " bleues et " + g + " vertes, indiscernables au toucher. On tire une boule au hasard. Quelle est la probabilité qu'elle " + which[0] + " ? (fraction irréductible)", v,
          "Il y a " + M(n) + " boules en tout, dont " + M(which[1]) + " favorables : " + M("P = \\frac{" + which[1] + "}{" + n + "}" + (FS(v) !== which[1] + "/" + n ? " = " + F(v) : "")) + ".",
          { ctx: "proba", guide: [GR("Nombre total de boules ?", n, M(n) + "."), GR("Probabilité ?", v, M(F(v)) + ".")],
            traps: [TR(1 - v, "C'est la probabilité de l'évènement contraire."), TR(which[1] / (n - which[1]), "On divise par le nombre total de boules.")] }); },
      () => { const a = pk([3, 4, 5, 6]), b = pk([2, 3, 4]), c = pk([1, 2]), x = nz(-5, 8), d = a * (x - b) - c * x; if (a === c) return null;
        return QN(SC + "résous l'équation " + M(N(a) + "(x - " + b + ") = " + (c === 1 ? "" : c) + "x" + sg(d)) + ".", x,
          M(N(a) + "x - " + a * b + " = " + (c === 1 ? "" : c) + "x" + sg(d)) + ", " + M(N(a - c) + "x = " + N(d + a * b)) + ", " + M("x = " + N(x)) + ".",
          { ctx: "equation", guide: [GX("Développe le membre de gauche.", a + "*x-" + a * b, M(N(a) + "x - " + a * b) + "."), GR(M("x") + " ?", x, M(N(x)) + ".")],
            traps: [TR((d + b) / (a - c), "Le " + a + " multiplie aussi le " + b + "."), TR((d + a * b) / (a + c), "En passant " + c + "x à gauche, on le soustrait.")] }); },
    ],
    3: [
      () => { const [a, b] = pk([[2, 3], [3, 4], [3, 2], [4, 5], [5, 3]]), [c, d] = pk([[9, 4], [16, 9], [4, 9], [25, 16], [9, 25]]), [e, f] = pk([[1, 2], [1, 3], [5, 6], [3, 4]]), v = (a * a) / (b * b) * (c / d) - e / f;
        { const dv = FRX.den(v); if (!dv || dv > 40 || Math.abs(v) < 1e-9) return null; }
        return QN(SC + "calcule " + M("\\left(" + fr(a, b) + "\\right)^2" + X + fr(c, d) + " - " + fr(e, f)) + ". Donne le résultat sous forme de fraction irréductible.", v,
          M("\\left(" + fr(a, b) + "\\right)^2 = " + fr(a * a, b * b)) + ", " + M(fr(a * a, b * b) + X + fr(c, d) + " = " + F((a * a * c) / (b * b * d))) + ", puis " + M(F((a * a * c) / (b * b * d)) + " - " + fr(e, f) + " = " + F(v)) + ".",
          { ctx: "fractions-puissances", guide: [GR(M("\\left(" + fr(a, b) + "\\right)^2") + " ?", (a * a) / (b * b), M(fr(a * a, b * b)) + "."), GR("Produit ?", (a * a * c) / (b * b * d), M(F((a * a * c) / (b * b * d))) + "."), GR("Résultat ?", v, M(F(v)) + ".")],
            traps: [TR((2 * a) / b * (c / d) - e / f, "Le carré n'est pas le double : (a/b)² = a²/b²."), TR((a * a) / (b * b) * (c / d - e / f), "Puissance, puis multiplication, puis soustraction.")] }); },
      () => { const t1 = pk([10, 20, 25, 50]), t2 = pk([10, 20, 30, 40]), d1 = pk([1, -1]), d2 = pk([1, 1, -1]), k = (1 + (d1 * t1) / 100) * (1 + (d2 * t2) / 100), v = rnd((k - 1) * 100, 6);
        if (Math.abs(v) < 1e-9 || !Number.isInteger(v * 2)) return null;
        return QN(SC + "un prix " + (d1 > 0 ? "augmente" : "baisse") + " de " + M(t1 + "\\,\\%") + " puis " + (d2 > 0 ? "augmente" : "baisse") + " de " + M(t2 + "\\,\\%") + ". Quel est le taux d'évolution global, en % ? (négatif pour une baisse)", v,
          "Coefficients : " + M(N(rnd(1 + (d1 * t1) / 100)) + X + N(rnd(1 + (d2 * t2) / 100)) + " = " + N(rnd(k))) + ", soit une évolution de " + M(N(v) + "\\,\\%") + ".",
          { ctx: "evolutions", guide: [GR("Coefficient global ?", rnd(k), M(N(rnd(k))) + "."), GR("Taux global (%) ?", v, M(N(v)) + ".")],
            traps: [TR(d1 * t1 + d2 * t2, "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TR(rnd(k), "Le coefficient " + N(rnd(k)).replace("{,}", ",") + " correspond à " + N(v).replace("{,}", ",") + " %.")] }); },
      () => { const [dist, mins] = pk([[45, 36], [30, 24], [12, 15], [60, 45], [90, 72], [25, 20], [18, 12]]), v = dist / (mins / 60), c = pk(["Un cycliste", "Un bus", "Une coureuse de trail", "Un TER"]);
        return QN(SC + c.toLowerCase() + " parcourt " + M(dist + "\\ \\text{km}") + " en " + M(mins + "\\ \\text{min}") + ". Quelle est sa vitesse moyenne en km/h ?", v,
          M(mins + "\\ \\text{min} = \\frac{" + mins + "}{60}\\ \\text{h} = " + N(mins / 60) + "\\ \\text{h}") + " ; " + M("v = \\frac{" + dist + "}{" + N(mins / 60) + "} = " + N(v)) + " km/h.",
          { ctx: "vitesse", guide: [GR("Durée en heures ?", mins / 60, M(N(mins / 60)) + " h."), GR("Vitesse (km/h) ?", v, M(N(v)) + " km/h.")],
            traps: [TR(rnd(dist / mins, 6), "La durée doit être en heures."), TR(rnd(dist / (mins / 100), 6), "1 h = 60 min, pas 100 min.")] }); },
      () => { const a = pk([1, 2, -1, 3]), b = nz(-5, 5), x = pk([-2, -3, -4, -5, 3, 4]), v = a * x * x + b * x; if (!v) return null;
        return QN(SC + "soit " + M("f(x) = " + (a === 1 ? "" : a === -1 ? "-" : a) + "x^2" + sg(b) + "x") + ". Calcule l'image de " + M(N(x)) + " par " + M("f") + ".", v,
          M("f(" + N(x) + ") = " + (a === 1 ? "" : a === -1 ? "-" : a + X) + NP(x) + "^2" + sg(b) + X + NP(x) + " = " + (a === 1 ? "" : a === -1 ? "-" : a + X) + x * x + sg(b * x) + " = " + N(v)) + ".",
          { ctx: "image", guide: [GR(M(NP(x) + "^2") + " ?", x * x, M(x * x) + " (un carré est positif)."), GR(M("f(" + N(x) + ")") + " ?", v, M(N(v)) + ".")],
            traps: [TR(-a * x * x + b * x, NP(x).replace(/[()]/g, "") + "² = " + x * x + " : le carré d'un négatif est positif."), TR(a * 2 * x + b * x, "x² n'est pas 2x.")] }); },
    ],
  };

  // ======================= vecgeo : translations et vecteurs (programme 2026 de 3e) =======================
  const PT = (x, y) => M("(" + N(x) + " \\,;\\, " + N(y) + ")");
  const VG = {
    1: [
      () => { const A = [nz(-5, 5), nz(-5, 5)], B = [nz(-6, 6), nz(-6, 6)], C = [nz(-5, 5), nz(-5, 5)], D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]]; if (B[0] === A[0] && B[1] === A[1]) return null;
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". La translation qui transforme " + M("A") + " en " + M("B") + " transforme " + M("C") + " en " + M("D") + ". Donne les coordonnées de " + M("D") + ". Réponds « x ; y ».", D,
          "Pour aller de " + M("A") + " à " + M("B") + ", on se déplace de " + M(N(B[0] - A[0])) + " en abscisse et de " + M(N(B[1] - A[1])) + " en ordonnée. On fait le même déplacement depuis " + M("C") + " : " + M("D") + PT(...D) + ". " + M("ABDC") + " est un parallélogramme.",
          { ctx: "translation", guide: [GP("Déplacement de " + M("A") + " à " + M("B") + " (abscisse ; ordonnée) ?", [B[0] - A[0], B[1] - A[1]], PT(B[0] - A[0], B[1] - A[1]) + "."), GP(M("D") + " ?", D, PT(...D) + ".")],
            traps: [{ spec: { kind: "pair", values: [C[0] - B[0] + A[0], C[1] - B[1] + A[1]] }, m: "Le déplacement va de A vers B (pas de B vers A)." }, { spec: { kind: "pair", values: [B[0] - A[0], B[1] - A[1]] }, m: "C'est le déplacement : ajoute-le aux coordonnées de C." }] }); },
      () => { const A = [nz(-5, 5), nz(-5, 5)], B = [nz(-5, 5), nz(-5, 5)], C = [nz(-5, 5), nz(-5, 5)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]; if ((A[0] - B[0]) * (C[1] - B[1]) === (A[1] - B[1]) * (C[0] - B[0])) return null;
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Donne les coordonnées du point " + M("D") + " tel que " + M("ABCD") + " soit un parallélogramme (sommets dans cet ordre). Réponds « x ; y ».", D,
          M("ABCD") + " est un parallélogramme si " + M("\\overrightarrow{AD} = \\overrightarrow{BC}") + " : le déplacement de " + M("B") + " à " + M("C") + " est " + PT(C[0] - B[0], C[1] - B[1]) + ", qu'on applique à " + M("A") + " : " + M("D") + PT(...D) + ".",
          { ctx: "parallelogramme", guide: [GP("Coordonnées de " + M("\\overrightarrow{BC}") + " (déplacement de B à C) ?", [C[0] - B[0], C[1] - B[1]], PT(C[0] - B[0], C[1] - B[1]) + "."), GP(M("D") + " ?", D, PT(...D) + ".")],
            traps: [{ spec: { kind: "pair", values: [B[0] + C[0] - A[0], B[1] + C[1] - A[1]] }, m: "L'ordre des sommets compte : ABCD, donc AD = BC." }, { spec: { kind: "pair", values: [A[0] + B[0] - C[0], A[1] + B[1] - C[1]] }, m: "ABCD : D est en face de B, AD = BC." }] }); },
      () => { const A = [nz(-5, 5), nz(-5, 5)], u = [nz(-5, 5), nz(-5, 5)], B = [A[0] + u[0], A[1] + u[1]];
        return QP("Le vecteur " + M("\\overrightarrow{AB}") + " a pour coordonnées " + PT(...u) + " et " + M("A") + PT(...A) + ". Donne les coordonnées de " + M("B") + ". Réponds « x ; y ».", B,
          M("x_B = x_A + " + NP(u[0]) + " = " + N(B[0])) + " et " + M("y_B = y_A + " + NP(u[1]) + " = " + N(B[1])) + ".",
          { ctx: "extremite", guide: [GR(M("x_B") + " ?", B[0], M(N(B[0])) + "."), GR(M("y_B") + " ?", B[1], M(N(B[1])) + "."), GP(M("B") + " ?", B, PT(...B) + ".")],
            traps: [{ spec: { kind: "pair", values: [A[0] - u[0], A[1] - u[1]] }, m: "AB va de A vers B : on ajoute ses coordonnées à celles de A." }, { spec: { kind: "pair", values: u }, m: "Ce sont les coordonnées du vecteur, pas du point B." }] }); },
    ],
    2: [
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], D = [nz(-4, 4), nz(-4, 4)], s = [B[0] - A[0] + D[0] - C[0], B[1] - A[1] + D[1] - C[1]];
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + ", " + M("C") + PT(...C) + " et " + M("D") + PT(...D) + ". Donne les coordonnées du vecteur " + M("\\overrightarrow{AB} + \\overrightarrow{CD}") + ". Réponds « x ; y ».", s,
          M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " et " + M("\\overrightarrow{CD}") + PT(D[0] - C[0], D[1] - C[1]) + " : la somme a pour coordonnées " + PT(...s) + ".",
          { ctx: "somme", guide: [GP(M("\\overrightarrow{AB}") + " ?", [B[0] - A[0], B[1] - A[1]], PT(B[0] - A[0], B[1] - A[1]) + "."), GP(M("\\overrightarrow{CD}") + " ?", [D[0] - C[0], D[1] - C[1]], PT(D[0] - C[0], D[1] - C[1]) + "."), GP("Somme ?", s, PT(...s) + ".")],
            traps: [{ spec: { kind: "pair", values: [A[0] - B[0] + C[0] - D[0], A[1] - B[1] + C[1] - D[1]] }, m: "Coordonnées de AB : arrivée moins départ (x_B − x_A)." }, { spec: { kind: "pair", values: [D[0] - A[0], D[1] - A[1]] }, m: "Chasles ne s'applique que si l'arrivée du premier est le départ du second : ici, calcule les deux vecteurs." }] }); },
      () => { const A = [nz(-5, 5), nz(-5, 5)], I = [nz(-4, 4), nz(-4, 4)], B = [2 * I[0] - A[0], 2 * I[1] - A[1]];
        return QP(M("I") + PT(...I) + " est le milieu du segment " + M("[AB]") + ", avec " + M("A") + PT(...A) + ". Donne les coordonnées de " + M("B") + ". Réponds « x ; y ».", B,
          M("I") + " milieu de " + M("[AB]") + " : " + M("\\overrightarrow{AI} = \\overrightarrow{IB}") + ". " + M("\\overrightarrow{AI}") + PT(I[0] - A[0], I[1] - A[1]) + ", qu'on applique à " + M("I") + " : " + M("B") + PT(...B) + ".",
          { ctx: "milieu", guide: [GP(M("\\overrightarrow{AI}") + " ?", [I[0] - A[0], I[1] - A[1]], PT(I[0] - A[0], I[1] - A[1]) + "."), GP(M("B") + " ?", B, PT(...B) + ".")],
            traps: [{ spec: { kind: "pair", values: [(A[0] + I[0]) / 2, (A[1] + I[1]) / 2] }, m: "I est le milieu de [AB] : B est au-delà de I, à la même distance que A." }, { spec: { kind: "pair", values: [I[0] - A[0], I[1] - A[1]] }, m: "C'est le vecteur AI : ajoute-le à I." }] }); },
      () => { const M0 = [nz(-5, 5), nz(-5, 5)], u = [nz(-4, 4), nz(-4, 4)], v = [nz(-4, 4), nz(-4, 4)], P = [M0[0] + u[0] + v[0], M0[1] + u[1] + v[1]];
        return QP("On applique au point " + M("M") + PT(...M0) + " la translation de vecteur " + M("\\vec{u}") + PT(...u) + ", puis celle de vecteur " + M("\\vec{v}") + PT(...v) + ". Où arrive le point ? Réponds « x ; y ».", P,
          "Enchaîner deux translations revient à faire la translation de vecteur " + M("\\vec{u} + \\vec{v}") + PT(u[0] + v[0], u[1] + v[1]) + " : " + PT(...P) + ".",
          { ctx: "enchainement", guide: [GP("Après la première translation ?", [M0[0] + u[0], M0[1] + u[1]], PT(M0[0] + u[0], M0[1] + u[1]) + "."), GP("Point d'arrivée ?", P, PT(...P) + ".")],
            traps: [{ spec: { kind: "pair", values: [M0[0] + u[0], M0[1] + u[1]] }, m: "Il reste la seconde translation." }, { spec: { kind: "pair", values: [u[0] + v[0], u[1] + v[1]] }, m: "C'est le vecteur u + v ; on l'applique au point M." }] }); },
    ],
    3: [
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], m = nz(-5, 6), Dy = C[1] + B[1] - A[1], D = [C[0] + B[0] - A[0], Dy], k = R.rand() < 0.5;
        if (A[0] === B[0] && A[1] === B[1]) return null;
        const Dx = D[0] - m;
        return QN("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + ", " + M("C") + PT(...C) + " et " + M("D(m" + sg(Dx) + " \\,;\\, " + N(Dy) + ")") + ". Pour quelle valeur de " + M("m") + " a-t-on " + M("\\overrightarrow{AB} = \\overrightarrow{CD}") + " ?", m,
          M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " ; " + M("\\overrightarrow{CD}(m" + sg(Dx - C[0]) + " \\,;\\, " + N(Dy - C[1]) + ")") + ". Les ordonnées sont égales ; les abscisses : " + M("m" + sg(Dx - C[0]) + " = " + N(B[0] - A[0])) + ", " + M("m = " + N(m)) + ".",
          { ctx: "parametre", guide: [GR("Abscisse de " + M("\\overrightarrow{AB}") + " ?", B[0] - A[0], M(N(B[0] - A[0])) + "."), GR(M("m") + " ?", m, M(N(m)) + ".")],
            traps: [TR(D[0], "On cherche m, pas l'abscisse de D."), TR(m + 2 * Dx, "x_D = m + " + Dx + " : isole m.")] }); },
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]], O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
        if ((A[0] - B[0]) * (C[1] - B[1]) === (A[1] - B[1]) * (C[0] - B[0])) return null;
        return QP(M("ABCD") + " est un parallélogramme avec " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Donne les coordonnées de son centre " + M("O") + " (fractions ou décimaux acceptés). Réponds « x ; y ».", O,
          "Les diagonales d'un parallélogramme se coupent en leur milieu : " + M("O") + " est le milieu de " + M("[AC]") + ", " + PT(...O) + ". (Inutile de calculer " + M("D") + PT(...D) + ".)",
          { ctx: "centre", guide: [GP("Milieu de " + M("[AC]") + " ?", O, PT(...O) + ".")],
            traps: [{ spec: { kind: "pair", values: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2] }, m: "Le centre est le milieu d'une diagonale ([AC] ou [BD]), pas d'un côté." }, { spec: { kind: "pair", values: D }, m: "C'est le quatrième sommet D, pas le centre." }] }); },
      () => { const A = [nz(-4, 4), nz(-4, 4)], B = [nz(-4, 4), nz(-4, 4)], C = [nz(-4, 4), nz(-4, 4)], E = [B[0] + C[0] - A[0], B[1] + C[1] - A[1]];
        return QP("Dans un repère, " + M("A") + PT(...A) + ", " + M("B") + PT(...B) + " et " + M("C") + PT(...C) + ". Le point " + M("E") + " vérifie " + M("\\overrightarrow{AE} = \\overrightarrow{AB} + \\overrightarrow{AC}") + ". Donne ses coordonnées. Réponds « x ; y ».", E,
          M("\\overrightarrow{AB}") + PT(B[0] - A[0], B[1] - A[1]) + " et " + M("\\overrightarrow{AC}") + PT(C[0] - A[0], C[1] - A[1]) + " : " + M("\\overrightarrow{AE}") + PT(B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]) + ", donc " + M("E") + PT(...E) + " (" + M("ABEC") + " est un parallélogramme).",
          { ctx: "regle-parallelogramme", guide: [GP(M("\\overrightarrow{AB} + \\overrightarrow{AC}") + " ?", [B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]], PT(B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]) + "."), GP(M("E") + " ?", E, PT(...E) + ".")],
            traps: [{ spec: { kind: "pair", values: [B[0] + C[0] - 2 * A[0], B[1] + C[1] - 2 * A[1]] }, m: "C'est le vecteur AE ; ajoute-le aux coordonnées de A." }, { spec: { kind: "pair", values: [B[0] + C[0], B[1] + C[1]] }, m: "On ajoute des vecteurs, pas des points." }] }); },
    ],
  };

  // ======================= tabvar : tableau de variations (2nde.AN.08–09) =======================
  // xs : abscisses (bornes et extremums), ys : valeurs ; les flèches alternent.
  const tvTex = (xs, ys) => M("\\begin{array}{c|" + "c".repeat(2 * xs.length - 1) + "} x & " + xs.map(N).join(" & & ") + " \\\\ \\hline f(x) & " + ys.map((y, i) => N(y) + (i < ys.length - 1 ? " & " + (ys[i + 1] > y ? "\\nearrow" : "\\searrow") : "")).join(" & ") + " \\end{array}");
  const mkTab = (n, up0) => { const xs = [R.int(-6, -3)]; for (let i = 1; i < n; i++) xs.push(xs[i - 1] + R.int(2, 4)); const up = up0 === undefined ? R.rand() < 0.5 : up0, ys = [];
    for (let i = 0; i < n; i++) ys.push(i === 0 ? nz(-5, 5) : ys[i - 1] + ((i % 2 === 1) === up ? 1 : -1) * R.int(2, 6)); return { xs, ys }; };
  const INTRO = "Voici le tableau de variations d'une fonction " + M("f") + " : ";
  const TV = {
    1: [
      () => { const { xs, ys } = mkTab(4), mx = Math.max(...ys), wantMax = R.rand() < 0.5, v = wantMax ? mx : Math.min(...ys);
        return QN(INTRO + tvTex(xs, ys) + " Quel est le " + (wantMax ? "maximum" : "minimum") + " de " + M("f") + " sur " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", v,
          "On compare les valeurs aux sommets des flèches et aux bornes : " + M(ys.map(N).join(" ; ")) + ". Le " + (wantMax ? "maximum" : "minimum") + " vaut " + M(N(v)) + ", atteint en " + M("x = " + N(xs[ys.indexOf(v)])) + ".",
          { ctx: wantMax ? "maximum" : "minimum", shownOk: true, guide: [GR("Le " + (wantMax ? "maximum" : "minimum") + " ?", v, M(N(v)) + ".")],
            traps: [TR(xs[ys.indexOf(v)], "C'est l'abscisse où il est atteint ; on demande la valeur de f."), TR(wantMax ? Math.max(ys[1], ys[2]) === v ? Math.max(ys[0], ys[3]) : Math.max(ys[1], ys[2]) : Math.min(ys[1], ys[2]) === v ? Math.min(ys[0], ys[3]) : Math.min(ys[1], ys[2]), "Compare aussi les valeurs aux bornes de l'intervalle.")] }); },
      () => { const dec = R.rand() < 0.5, { xs, ys } = mkTab(4, dec), i = 1, iv = [[xs[i], true, xs[i + 1], true]];
        return QS(INTRO + tvTex(xs, ys) + " Sur quel intervalle " + M("f") + " est-elle " + (dec ? "décroissante" : "croissante") + " ?", iv,
          "La flèche " + (dec ? "descend" : "monte") + " entre " + M(N(xs[i])) + " et " + M(N(xs[i + 1])) + " : " + M("f") + " est " + (dec ? "décroissante" : "croissante") + " sur " + M("[" + N(xs[i]) + " \\,;\\, " + N(xs[i + 1]) + "]") + ".",
          { ctx: dec ? "decroissante" : "croissante", guide: [{ ask: "Intervalle ?", spec: solsetSpec(iv), sol: M("[" + N(xs[i]) + " \\,;\\, " + N(xs[i + 1]) + "]") + "." }],
            traps: [TS([[Math.min(ys[i], ys[i + 1]), true, Math.max(ys[i], ys[i + 1]), true]], "L'intervalle porte sur x (première ligne), pas sur les valeurs de f."), TS([[xs[0], true, xs[1], true]], "Regarde le sens de chaque flèche.")] }); },
      () => { const { xs, ys } = mkTab(3), up = ys[1] > ys[0], a = xs[0] + 0.5, b = xs[1] - 0.5, big = up ? b : a;
        return QN(INTRO + tvTex(xs, ys) + " Sans connaître " + M("f(" + N(a) + ")") + " ni " + M("f(" + N(b) + ")") + ", lequel de ces deux nombres est le plus grand ? Réponds " + M(N(a)) + " si c'est " + M("f(" + N(a) + ")") + ", " + M(N(b)) + " si c'est " + M("f(" + N(b) + ")") + ".", big,
          M(N(a)) + " et " + M(N(b)) + " sont dans " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[1]) + "]") + ", où " + M("f") + " est " + (up ? "croissante : elle conserve l'ordre" : "décroissante : elle inverse l'ordre") + ". Donc " + M("f(" + N(big) + ")") + " est le plus grand.",
          { ctx: "comparer", shownOk: true, guide: [GR("Sur cet intervalle, " + M("f") + " est-elle croissante (1) ou décroissante (−1) ?", up ? 1 : -1, up ? "Croissante." : "Décroissante."), GR("Le plus grand est " + M("f(\\dots)") + " : tape le nombre entre parenthèses.", big, M("f(" + N(big) + ")") + ".")],
            traps: [TR(up ? a : b, up ? "f croissante conserve l'ordre : le plus grand x donne la plus grande image." : "f décroissante inverse l'ordre.")] }); },
    ],
    2: [
      () => { const { xs, ys } = mkTab(4), lo = Math.min(...ys), hi = Math.max(...ys); let k = R.int(lo + 1, hi - 1); if (ys.includes(k)) k += 0.5;
        let n = 0; for (let i = 0; i < 3; i++) if ((ys[i] - k) * (ys[i + 1] - k) < 0) n++;
        return QN(INTRO + tvTex(xs, ys) + " Combien de solutions l'équation " + M("f(x) = " + N(k)) + " a-t-elle sur " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", n,
          "Sur chaque intervalle où " + M("f") + " est monotone, la valeur " + M(N(k)) + " est atteinte au plus une fois, et elle l'est si elle est entre les valeurs aux extrémités. Ici : " + n + " intervalle" + (n > 1 ? "s" : "") + " sur 3.",
          { ctx: "nb-solutions", guide: [GR("Sur combien des trois intervalles " + M(N(k)) + " est-il compris entre les deux valeurs aux extrémités ?", n, M(n) + ".")],
            traps: [TR(n === 1 ? 2 : 1, "Regarde chaque flèche : " + N(k).replace("{,}", ",") + " est-il entre la valeur de départ et la valeur d'arrivée ?"), TR(3, "Toutes les flèches ne passent pas par " + N(k).replace("{,}", ",") + ".")] }); },
      () => { const { xs, ys } = mkTab(4), j = R.int(1, 2), sub = ys.slice(j), wantMax = R.rand() < 0.5, v = wantMax ? Math.max(...sub) : Math.min(...sub);
        if (v === (wantMax ? Math.max(...ys) : Math.min(...ys))) return null;
        return QN(INTRO + tvTex(xs, ys) + " Quel est le " + (wantMax ? "maximum" : "minimum") + " de " + M("f") + " sur l'intervalle " + M("[" + N(xs[j]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", v,
          "On ne regarde que la partie du tableau entre " + M(N(xs[j])) + " et " + M(N(xs[3])) + " : valeurs " + M(sub.map(N).join(" ; ")) + ". " + (wantMax ? "Maximum" : "Minimum") + " : " + M(N(v)) + ".",
          { ctx: "extremum-partiel", shownOk: true, guide: [GR("Valeurs de " + M("f") + " utiles (bornes et sommets) : la plus " + (wantMax ? "grande" : "petite") + " ?", v, M(N(v)) + ".")],
            traps: [TR(wantMax ? Math.max(...ys) : Math.min(...ys), "Sur [" + xs[j] + " ; " + xs[3] + "] seulement : ignore le début du tableau.")] }); },
      () => { const { xs, ys } = mkTab(4); if (ys.includes(0)) return null;
        let n = 0; for (let i = 0; i < 3; i++) if (ys[i] * ys[i + 1] < 0) n++; if (!n) return null;
        return QN(INTRO + tvTex(xs, ys) + " Combien de fois la courbe de " + M("f") + " coupe-t-elle l'axe des abscisses ?", n,
          "La courbe coupe l'axe des abscisses quand " + M("f(x) = 0") + ", c'est-à-dire sur chaque flèche qui passe d'une valeur négative à une valeur positive (ou l'inverse) : " + n + " fois.",
          { ctx: "zeros", guide: [GR("Combien de flèches changent de signe ?", n, M(n) + ".")],
            traps: [TR(n + 1, "Une flèche qui reste du même signe ne coupe pas l'axe."), TR(3, "Regarde le signe des valeurs aux deux bouts de chaque flèche.")] }); },
    ],
    3: [
      () => { const a = nz(-3, 3), b = nz(-6, 6), lo = a - R.int(1, 4), hi = a + R.int(1, 4), s = pk([1, -1]), vals = [lo, a, hi].map((x) => s * (x - a) ** 2 + b), v = s > 0 ? b : Math.max(...vals.filter((_, i) => i !== 1));
        const askMin = s > 0;
        return QN("Soit " + M("f(x) = " + (s < 0 ? "-" : "") + "(x" + sg(-a) + ")^2" + sg(b)) + " sur " + M("[" + N(lo) + " \\,;\\, " + N(hi) + "]") + ". Dresse son tableau de variations. Quel est son " + (askMin ? "minimum" : "maximum") + " sur cet intervalle ?", s > 0 ? b : b,
          "Forme canonique : " + M("f") + " est " + (s > 0 ? "décroissante puis croissante" : "croissante puis décroissante") + ", avec un " + (s > 0 ? "minimum" : "maximum") + " en " + M("x = " + N(a)) + " : " + M("f(" + N(a) + ") = " + N(b)) + ". Tableau : " + tvTex([lo, a, hi], vals) + ".",
          { ctx: "canonique", guide: [GR("En quelle abscisse la flèche change-t-elle de sens ?", a, M("x = " + N(a)) + "."), GR((askMin ? "Minimum" : "Maximum") + " ?", b, M(N(b)) + ".")],
            traps: [TR(a, "C'est l'abscisse ; on demande la valeur."), TR(-b, "f(" + a + ") = " + b + " : (x − " + a + ")² s'annule.")] }); },
      () => { const { xs, ys } = mkTab(4), iv = [[Math.min(...ys), true, Math.max(...ys), true]];
        return QS(INTRO + tvTex(xs, ys) + " Quand " + M("x") + " parcourt " + M("[" + N(xs[0]) + " \\,;\\, " + N(xs[3]) + "]") + ", dans quel intervalle " + M("f(x)") + " prend-elle ses valeurs ? Donne le plus petit intervalle possible.", iv,
          M("f") + " est continue sur l'intervalle (pas de saut) : elle prend toutes les valeurs entre son minimum " + M(N(iv[0][0])) + " et son maximum " + M(N(iv[0][2])) + ", donc " + M("f(x) \\in [" + N(iv[0][0]) + " \\,;\\, " + N(iv[0][2]) + "]") + ".",
          { ctx: "image-intervalle", guide: [GR("Minimum ?", iv[0][0], M(N(iv[0][0])) + "."), GR("Maximum ?", iv[0][2], M(N(iv[0][2])) + "."), { ask: "Intervalle des valeurs ?", spec: solsetSpec(iv), sol: M("[" + N(iv[0][0]) + " \\,;\\, " + N(iv[0][2]) + "]") + "." }],
            traps: [TS([[Math.min(ys[0], ys[3]), true, Math.max(ys[0], ys[3]), true]], "Les valeurs aux bornes ne suffisent pas : regarde aussi les sommets des flèches."), TS([[xs[0], true, xs[3], true]], "C'est l'intervalle des x ; on demande les valeurs de f.")] }); },
      () => { const { xs, ys } = mkTab(4); let k = R.rand() < 0.5 ? ys[1] + (ys[2] > ys[1] ? 1 : -1) * 0.5 : (ys[2] + ys[3]) / 2, n = 0; for (let i = 1; i < 3; i++) if ((ys[i] - k) * (ys[i + 1] - k) < 0) n++;
        return QN(INTRO + tvTex(xs, ys) + " Combien de solutions l'équation " + M("f(x) = " + N(k)) + " a-t-elle sur " + M("[" + N(xs[1]) + " \\,;\\, " + N(xs[3]) + "]") + " ?", n,
          "On ne regarde que les flèches entre " + M(N(xs[1])) + " et " + M(N(xs[3])) + " : " + M(N(k)) + " est atteint une fois sur chaque flèche qui l'encadre, soit " + n + " solution" + (n > 1 ? "s" : "") + ".",
          { ctx: "nb-solutions-partiel", guide: [GR("Nombre de flèches (entre " + M(N(xs[1])) + " et " + M(N(xs[3])) + ") qui encadrent " + M(N(k)) + " ?", n, M(n) + ".")],
            traps: [TR(n + ((ys[0] - k) * (ys[1] - k) < 0 ? 1 : 0), "Seulement sur [" + xs[1] + " ; " + xs[3] + "] : la première flèche ne compte pas."), TR(n + 1, "Compte les flèches qui encadrent " + N(k).replace("{,}", ",") + ".")] }); },
    ],
  };

  reg([
    { id: "linfn", theme: "fa", label: "Fonctions linéaires", ex: "f(x) = ax", FR: [9, 6], againFR: [10], g: LF,
      hint: "Une fonction linéaire s'écrit f(x) = ax : elle traduit une situation de proportionnalité (a = coefficient). a = f(x) ÷ x. Augmenter de t % : f(x) = (1 + t/100)x.",
      comps: ["Coefficient, image, antécédent", "Pourcentages, droite par l'origine, proportionnalité", "Linéarité, évolutions successives, linéaire et affine"],
      lesson: ["Fonctions linéaires", "Une fonction linéaire est une fonction de la forme \\(f(x) = ax\\) : elle modélise une situation de proportionnalité.",
        "Le coefficient \\(a\\) est le coefficient de proportionnalité : \\(a = \\frac{f(x)}{x}\\) pour \\(x \\neq 0\\). La représentation graphique est une droite qui passe par l'origine. Appliquer un pourcentage d'évolution de \\(t\\,\\%\\) est une fonction linéaire de coefficient \\(1 + \\frac{t}{100}\\) (hausse) ou \\(1 - \\frac{t}{100}\\) (baisse). Linéarité : \\(f(u + v) = f(u) + f(v)\\) et \\(f(ku) = kf(u)\\).",
        ["\\(f(5) = 12\\) : \\(a = \\frac{12}{5} = 2{,}4\\), donc \\(f(x) = 2{,}4x\\).", "Une baisse de \\(15\\,\\%\\) : \\(f(x) = 0{,}85x\\)."],
        "\\(f(x) = 2x + 3\\) n'est pas linéaire (affine) : sa droite ne passe pas par l'origine."] },
    { id: "cos4e", theme: "es", label: "Cosinus d'un angle aigu", ex: "\\cos \\widehat{A} = \\frac{\\text{adjacent}}{\\text{hypoténuse}}", FR: [8, 0], againFR: [9], g: CS,
      hint: "Dans un triangle rectangle, cos(angle aigu) = côté adjacent ÷ hypoténuse. Côté adjacent = hypoténuse × cos ; hypoténuse = adjacent ÷ cos ; angle : touche arccos (cos⁻¹).",
      comps: ["Calculer un côté adjacent ou l'hypoténuse, écrire un cosinus", "Calculer un angle, problèmes (échelle, rampe)", "Deux étapes avec Pythagore, triangle isocèle, repérer une erreur"],
      lesson: ["Le cosinus", "Dans un triangle rectangle, le cosinus d'un angle aigu ne dépend que de l'angle.",
        "\\(\\cos \\widehat{A} = \\frac{\\text{côté adjacent à } \\widehat{A}}{\\text{hypoténuse}}\\). L'hypoténuse est en face de l'angle droit ; le côté adjacent est l'autre côté de l'angle. Le cosinus est compris entre 0 et 1. On calcule un côté avec la calculatrice en degrés ; un angle avec la touche \\(\\arccos\\) (ou \\(\\cos^{-1}\\)).",
        ["Hypoténuse 10 cm, angle \\(60°\\) : côté adjacent \\(= 10 \\times \\cos 60° = 5\\) cm.", "Adjacent 4 cm, hypoténuse 8 cm : \\(\\cos \\widehat{A} = 0{,}5\\), \\(\\widehat{A} = 60°\\)."],
        "Le cosinus utilise le côté adjacent, pas le côté opposé ; et l'hypoténuse est toujours au dénominateur."] },
    { id: "thales4e", theme: "gm", label: "Thalès dans des triangles emboîtés", ex: "\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}", FR: [8, 7], againFR: [9], g: TH,
      hint: "M sur [AB], N sur [AC], (MN) parallèle à (BC) : AM/AB = AN/AC = MN/BC. Le petit triangle AMN est une réduction de ABC. Attention : AB = AM + MB.",
      comps: ["Écrire les rapports, calculer MN ou AN", "Avec MB ou NC, problèmes concrets", "Périmètre, équation, repérer une erreur"],
      lesson: ["Le théorème de Thalès (triangles emboîtés)", "Une parallèle à un côté d'un triangle découpe un petit triangle, réduction du grand.",
        "Si \\(M \\in [AB]\\), \\(N \\in [AC]\\) et \\((MN) \\parallel (BC)\\), alors \\(\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}\\). On écrit les trois rapports (petit triangle en haut, grand triangle en bas), puis on garde les deux qui contiennent une seule inconnue et on fait un produit en croix.",
        ["\\(AM = 3\\), \\(AB = 9\\), \\(BC = 12\\) : \\(MN = 12 \\times \\frac{3}{9} = 4\\).", "\\(AM = 4\\) et \\(MB = 6\\) : \\(AB = 10\\), rapport \\(\\frac{4}{10}\\)."],
        "Les rapports comparent le petit triangle au grand : \\(\\frac{AM}{AB}\\), jamais \\(\\frac{AM}{MB}\\)."] },
    { id: "autodnb", theme: "no", label: "Automatismes du brevet (partie 1)", ex: "\\frac{2}{3} + \\frac{5}{6} \\times \\frac{3}{5}", FR: [9, 0], g: AD,
      hint: "Sans calculatrice : priorités (puissances, puis × et ÷, puis + et −), fractions irréductibles, 10ᵖ × 10^q = 10^(p+q), t % de x = x × t/100, a² − b² = (a − b)(a + b).",
      comps: ["Fractions, puissances de 10, pourcentages, Pythagore", "Identités remarquables, probabilités, équations", "Calculs enchaînés, évolutions successives, vitesse, image"],
      lesson: ["Automatismes du brevet", "La première partie du brevet (environ 20 minutes, sans calculatrice) teste des automatismes : il faut les reconnaître et calculer vite et juste.",
        "Priorités : parenthèses, puissances, × et ÷, puis + et −. Fractions : même dénominateur pour additionner ; on multiplie numérateurs et dénominateurs entre eux ; résultat irréductible. \\(10^p \\times 10^q = 10^{p + q}\\). Évolution de \\(t\\,\\%\\) : on multiplie par \\(1 \\pm \\frac{t}{100}\\) ; deux évolutions : on multiplie les coefficients. \\((a + b)^2 = a^2 + 2ab + b^2\\), \\(a^2 - b^2 = (a - b)(a + b)\\).",
        ["\\(\\frac{2}{3} + \\frac{1}{6} \\times \\frac{3}{5} = \\frac{2}{3} + \\frac{1}{10} = \\frac{23}{30}\\).", "\\(102^2 - 98^2 = 4 \\times 200 = 800\\).", "\\(+20\\,\\%\\) puis \\(+10\\,\\%\\) : \\(1{,}2 \\times 1{,}1 = 1{,}32\\), soit \\(+32\\,\\%\\)."],
        "Deux évolutions successives ne s'additionnent pas : \\(+20\\,\\%\\) puis \\(-20\\,\\%\\) donne \\(-4\\,\\%\\)."],
      probs: [() => P("Partie 1 du brevet, sans calculatrice.", [["a) 3/4 − 1/4 × 2/3 (en décimal ou fraction)", 7 / 12], ["b) Prix de 60 € après une hausse de 15 % (€)", 69], ["c) 51² − 49²", 200]], ["Priorités : la multiplication d'abord.", "a² − b² = (a − b)(a + b)."], "a) " + M("\\frac{3}{4} - \\frac{1}{6} = \\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}") + " ; b) " + M("60 \\times 1{,}15 = 69") + " ; c) " + M("2 \\times 100 = 200") + ".")] },
    { id: "vecgeo", theme: "es", label: "Translations et vecteurs", ex: "\\overrightarrow{AB} = \\overrightarrow{DC} \\iff ABCD \\text{ parallélogramme}", FR: [9, 9], againFR: [10], g: VG,
      hint: "La translation qui transforme A en B déplace chaque point du même déplacement : le vecteur AB. AB = DC ⇔ ABCD est un parallélogramme. Coordonnées de AB : (x_B − x_A ; y_B − y_A).",
      comps: ["Image par une translation, parallélogramme", "Somme de vecteurs, milieu, enchaîner deux translations", "Vecteurs égaux avec un paramètre, centre, règle du parallélogramme"],
      lesson: ["Translations et vecteurs", "La translation qui transforme \\(A\\) en \\(B\\) fait glisser toute la figure dans la même direction, le même sens, de la même longueur : c'est le vecteur \\(\\overrightarrow{AB}\\).",
        "\\(\\overrightarrow{AB} = \\overrightarrow{DC}\\) signifie que \\(ABCD\\) est un parallélogramme (éventuellement aplati). Enchaîner les translations de vecteurs \\(\\vec{u}\\) et \\(\\vec{v}\\) revient à faire la translation de vecteur \\(\\vec{u} + \\vec{v}\\) ; relation de Chasles : \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\). Dans un repère, \\(\\overrightarrow{AB}\\) a pour coordonnées \\((x_B - x_A \\,;\\, y_B - y_A)\\).",
        ["\\(A(1 \\,;\\, 2)\\), \\(B(4 \\,;\\, 3)\\) : la translation de vecteur \\(\\overrightarrow{AB}\\) envoie \\(C(0 \\,;\\, 5)\\) en \\((3 \\,;\\, 6)\\)."],
        "Pour \\(ABCD\\), c'est \\(\\overrightarrow{AB} = \\overrightarrow{DC}\\) (et non \\(\\overrightarrow{CD}\\)) : l'ordre des lettres compte."] },
    { id: "tabvar", theme: "fa", label: "Tableaux de variations", ex: "\\nearrow \\ \\searrow", FR: [10, 12], g: TV,
      hint: "Une flèche qui monte : f croissante ; qui descend : f décroissante. Les extremums se lisent aux sommets des flèches et aux bornes. Sur une flèche, f prend une fois chaque valeur comprise entre ses deux extrémités.",
      comps: ["Lire extremums et sens de variation, comparer deux images", "Nombre de solutions de f(x) = k, extremum sur une partie, zéros", "Forme canonique, intervalle des valeurs, solutions sur une partie"],
      lesson: ["Tableau de variations", "Un tableau de variations résume le sens de variation d'une fonction : une flèche par intervalle où elle est monotone.",
        "\\(f\\) croissante sur \\(I\\) : si \\(a < b\\) dans \\(I\\), alors \\(f(a) \\leqslant f(b)\\) (l'ordre est conservé) ; décroissante : l'ordre est inversé. Le maximum (minimum) sur un intervalle se lit parmi les valeurs aux sommets des flèches et aux bornes. Sur une flèche, chaque valeur comprise entre les deux extrémités est atteinte exactement une fois (si la fonction est strictement monotone et continue).",
        ["Tableau \\(-3 \\nearrow 5 \\searrow -1\\) : maximum 5 ; l'équation \\(f(x) = 2\\) a deux solutions."],
        "La première ligne contient les \\(x\\), la seconde les valeurs de \\(f\\) : un intervalle de variation se lit sur les \\(x\\)."],
      probs: [() => P("Tableau de variations de f sur [−4 ; 5] : f(−4) = 3, f(1) = −5, f(5) = 2 (décroissante puis croissante).", [["a) Minimum de f", -5], ["b) Nombre de solutions de f(x) = 0", 2], ["c) Nombre de solutions de f(x) = 2,5", 1]], ["Une flèche descend de 3 à −5, l'autre monte de −5 à 2.", "2,5 est entre −5 et 3, mais pas entre −5 et 2."], "a) " + M("-5") + " en " + M("x = 1") + " ; b) 0 est sur les deux flèches : 2 solutions ; c) 2,5 seulement sur la première flèche : 1 solution.")] },
  ]);
})();

// 25.11 · France, terminale spécialité (programme 2019 en 2026-2027) : notions créées pour la couverture du programme
// (tools/france_couverture.md). Les limites, la continuité, la convexité, ln et exp (dérivation, études), les primitives,
// les intégrales, les équations différentielles et l'espace viennent des notions de 3e–4e du Collège (rattachées dans
// src/fr_couv.js). Ici, ce qui manquait : lnfr (logarithme népérien : propriétés, équations, seuils, AN.13–14), trigfr
// (fonctions sinus et cosinus en radians, AN.15–18), tvi (théorème des valeurs intermédiaires, AN.11–12), sommeva
// (sommes de variables aléatoires, concentration, loi des grands nombres, SP.05–07), recurrence (raisonnement par
// récurrence : conjecturer, hérédité, rang initial, AN.01–02). Outils communs : FRX (src/fr_1re.js).
(function () {
  const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, lin, linE, mk, QN, QR, QX, QS, QSet, QP, GR, GX, GP, TR, TX, TS, P, reg } = FRX;
  const QV = (q, value, canon, sol, o) => mk(q, { kind: "value", value }, sol, Object.assign({ canon }, o));

  // ======================= lnfr : logarithme népérien (Tle.AN.13–14) =======================
  const LN = {
    1: [
      () => { const [a, b, c] = pk([[6, 4, 3], [10, 3, 5], [2, 9, 6], [12, 5, 4], [15, 2, 6], [8, 9, 12], [14, 3, 7]]), k = (a * b) / c; if (!Number.isInteger(k) || k === 1) return null;
        return QN("Écris " + M("\\ln " + a + " + \\ln " + b + " - \\ln " + c) + " sous la forme " + M("\\ln k") + ". Que vaut " + M("k") + " ?", k,
          M("\\ln a + \\ln b = \\ln(ab)") + " et " + M("\\ln a - \\ln b = \\ln\\frac{a}{b}") + " : " + M("\\ln\\frac{" + a + X + b + "}{" + c + "} = \\ln " + k) + ".",
          { ctx: "proprietes", guide: [GR(M("\\ln " + a + " + \\ln " + b + " = \\ln(\\dots)") + " ?", a * b, M("\\ln " + a * b) + "."), GR(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(a + b - c, "ln transforme les produits en sommes : ln a + ln b = ln(ab), pas ln(a + b)."), TR(a * b * c, "Une différence de logarithmes donne un quotient.")] }); },
      () => { const k = pk([2, 3, 5, 7, 10, 0.5]), a = pk([1, 2, 3, -1]), b = pk([0, 1, -1, 2]), v = (Math.log(k) - b) / a;
        const ex = (a === 1 ? "x" : a === -1 ? "-x" : a + "x") + (b ? (b > 0 ? " + " : " - ") + Math.abs(b) : "");
        const can = a === 1 && !b ? "ln(" + FS(k) + ")" : "(ln(" + FS(k) + ")" + (b ? (b > 0 ? "-" : "+") + Math.abs(b) : "") + ")/" + "(" + a + ")";
        return QV("Résous " + M("e^{" + ex + "} = " + N(k)) + ". Donne la valeur exacte (tape « ln(…) »).", v, can,
          M("e^{X} = " + N(k) + " \\iff X = \\ln " + N(k)) + " (car " + M(N(k) + " > 0") + ") : " + M(ex + " = \\ln " + N(k)) + ", " + M("x = " + (a === 1 && !b ? "\\ln " + N(k) : "\\frac{\\ln " + N(k) + (b ? sg(-b) : "") + "}{" + a + "}")) + ".",
          { ctx: "exp-egal", guide: [GR("Valeur de l'exposant " + M(ex) + " (avec ln) ?", Math.log(k), M("\\ln " + N(k)) + "."), GR(M("x") + " ?", v, M("x \\approx " + N(rnd(v, 3))) + ".")],
            traps: [TR(rnd(Math.exp(k), 9), "On applique ln (la réciproque de exp), pas exp."), TR(rnd(k / a, 9), "e^X = k donne X = ln k.")] }); },
      () => { const a = pk([2, 3, -1, 0.5, 4]), m = pk([1, 2, 3]), b = nz(-4, 4), v = (Math.exp(a) - b) / m;
        const ex = (m === 1 ? "x" : m + "x") + sg(b);
        return QV("Résous " + M("\\ln(" + ex + ") = " + N(a)) + ". Donne la valeur exacte (tape « exp(…) » ou « e^… »).", v, m === 1 ? "exp(" + a + ")" + (b ? (b > 0 ? "-" : "+") + Math.abs(b) : "") : "(exp(" + a + ")" + (b > 0 ? "-" : "+") + Math.abs(b) + ")/" + m,
          M("\\ln X = " + N(a) + " \\iff X = e^{" + N(a) + "}") + " : " + M(ex + " = e^{" + N(a) + "}") + ", " + M("x = " + (m === 1 ? "e^{" + N(a) + "}" + sg(-b) : "\\frac{e^{" + N(a) + "}" + sg(-b) + "}{" + m + "}")) + " (et " + M(ex + " > 0") + " : c'est bien le cas).",
          { ctx: "ln-egal", guide: [GR(M(ex) + " = ?", Math.exp(a), M("e^{" + N(a) + "}") + "."), GR(M("x") + " ?", v, M("\\approx " + N(rnd(v, 3))) + ".")],
            traps: [TR(rnd((Math.log(a > 0 ? a : 1) - b) / m, 9), "ln X = a donne X = e^a."), TR(rnd((a - b) / m, 9), "On applique exp aux deux membres.")] }); },
    ],
    2: [
      () => { const a = nz(-4, 5), b = pk([-7, -5, -3, 3, 5, 7, 2, -2]), v = (1 - b) / a; if (!a || Math.abs(a) === 1 && !(1 - b)) return null;
        return QN("Résous " + M("\\ln(" + lin(a, b) + ") = 0") + ".", v,
          M("\\ln X = 0 \\iff X = 1") + " : " + M(lin(a, b) + " = 1") + ", " + M("x = " + F(v)) + " (on vérifie " + M(lin(a, b) + " > 0") + ").",
          { ctx: "ln-affine", guide: [GR("Pour quel nombre " + M("X") + " a-t-on " + M("\\ln X = 0") + " ?", 1, M("X = 1") + "."), GR(M("x") + " ?", v, M(F(v)) + ".")],
            traps: [TR(-b / a, "ln X = 0 donne X = 1, pas X = 0."), TR((Math.E - b) / a, "ln X = 0 donne X = e⁰ = 1.")] }); },
      () => { const t = pk([3, 4, 5, 6, 8, 10]), c = pk([[2, "double"], [3, "triple"], [1.5, "augmente de moitié"]]), q = 1 + t / 100, n = Math.ceil(Math.log(c[0]) / Math.log(q) - 1e-12), ctx = pk([["Un capital", "placé à", "capital"], ["La population d'une ville", "qui augmente de", "population"], ["Le nombre d'abonnés d'une chaîne", "qui augmente de", "abonnes"]]);
        return QN(ctx[0] + " " + ctx[1] + " " + M(t + "\\,\\%") + " par an " + (c[1] === "augmente de moitié" ? "augmente de moitié" : c[1] === "double" ? "double" : "triple") + " au bout de combien d'années au minimum ? (On résout " + M(N(q) + "^n \\geqslant " + N(c[0])) + ".)", n,
          M(N(q) + "^n \\geqslant " + N(c[0]) + " \\iff n\\ln " + N(q) + " \\geqslant \\ln " + N(c[0]) + " \\iff n \\geqslant \\frac{\\ln " + N(c[0]) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(c[0]) / Math.log(q), 2))) + " (car " + M("\\ln " + N(q) + " > 0") + ") : " + M("n = " + n) + ".",
          { ctx: "seuil-" + ctx[2], guide: [GR(M("\\frac{\\ln " + N(c[0]) + "}{\\ln " + N(q) + "}") + " (au centième) ?", Math.log(c[0]) / Math.log(q), M("\\approx " + N(rnd(Math.log(c[0]) / Math.log(q), 2))) + ".", 0.01), GR("Plus petit entier " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "n doit être supérieur ou égal au quotient : on arrondit à l'entier supérieur."), TR(Math.round(100 * (c[0] - 1) / t), "Les hausses se composent (suite géométrique) : on ne divise pas simplement.")] }); },
      () => { const base = pk([2, 3, 5]), p = pk([3, 4, 5, -2, -3]), m = pk([1, 2, -1]), val = base ** p, k = p * m;
        const tx = p > 0 ? N(val) : "\\frac{1}{" + N(base ** -p) + "}";
        return QN("Écris " + M((m === 1 ? "" : m === -1 ? "-" : m) + "\\ln " + tx) + " sous la forme " + M("k\\ln " + base) + ". Que vaut " + M("k") + " ?", k,
          M(tx + " = " + base + "^{" + p + "}") + " et " + M("\\ln(a^n) = n\\ln a") + " : " + M((m === 1 ? "" : m === -1 ? "-" : m) + "\\ln " + tx + " = " + (m === 1 ? "" : m === -1 ? "-" : m + X) + NP(p) + "\\ln " + base + " = " + N(k) + "\\ln " + base) + ".",
          { ctx: "puissance", guide: [GR(M(tx) + " est " + M(base) + " à la puissance ?", p, M(p) + "."), GR(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(-k, "ln(1/a) = −ln a : attention au signe."), TR(rnd(val / base * m), "ln(aⁿ) = n ln a : l'exposant passe devant.")] }); },
    ],
    3: [
      () => { const [a, b] = pk([[1, 2], [1, 3], [-1, 2], [2, 3], [-1, 1]]), s = a + b, p = a * b;
        return QSet("Résous " + M("(\\ln x)^2" + sg(-s) + "\\ln x" + sg(p) + " = 0") + " (on pose " + M("X = \\ln x") + "). Donne les valeurs exactes séparées par « ; ».", [Math.exp(a), Math.exp(b)],
          "Avec " + M("X = \\ln x") + " : " + M("X^2" + sg(-s) + "X" + sg(p) + " = 0") + ", " + M("X = " + a) + " ou " + M("X = " + b) + ". Donc " + M("x = e^{" + a + "}") + " ou " + M("x = e^{" + b + "}") + ".",
          { ctx: "changement-variable", canon: "exp(" + a + ") ; exp(" + b + ")", guide: [FRX.GSet("Solutions en " + M("X") + " ?", [a, b], M(a + " \\,;\\, " + b) + "."), FRX.GSet("Solutions en " + M("x") + " ?", [Math.exp(a), Math.exp(b)], M("e^{" + a + "} \\,;\\, e^{" + b + "}") + ".")],
            traps: [{ s: [a, b], m: "Ce sont les valeurs de X = ln x : il reste x = e^X." }, { s: [Math.exp(a)], m: "Il y a deux solutions." }] }); },
      () => { const r = pk([2, 3, 4, 5, 6]), k = r * r - 1;
        return QN("Résous " + M("\\ln(x - 1) + \\ln(x + 1) = \\ln " + k) + ".", r,
          "Il faut " + M("x > 1") + ". Alors " + M("\\ln((x - 1)(x + 1)) = \\ln " + k) + ", " + M("x^2 - 1 = " + k) + ", " + M("x^2 = " + r * r) + ", " + M("x = " + r) + " ou " + M("x = -" + r) + " ; seule " + M("x = " + r) + " vérifie " + M("x > 1") + ".",
          { ctx: "domaine-equation", guide: [GR("Équation sans ln : " + M("x^2 = \\dots") + " ?", r * r, M("x^2 = " + r * r) + "."), GR("Solution qui vérifie " + M("x > 1") + " ?", r, M(r) + ".")],
            traps: [TR(-r, "−" + r + " n'est pas dans le domaine (x − 1 > 0)."), TR((k + 1) / 2, "ln a + ln b = ln(ab), pas ln(a + b).")] }); },
      () => { const u0 = pk([500, 800, 1000, 2000]), q = pk([0.9, 0.8, 0.95, 0.85]), s = pk([100, 200, 50]), n = Math.ceil(Math.log(s / u0) / Math.log(q) + 1e-12), c = pk([["Une voiture perd", "de sa valeur chaque année ; elle vaut", "€", "voiture"], ["Un lac perd", "de ses poissons chaque année ; il en compte", "poissons", "lac"], ["Un médicament s'élimine :", "de la dose disparaît chaque heure ; il en reste", "mg", "medicament"]]);
        if (s >= u0) return null;
        return QN(c[0] + " " + M(N(rnd((1 - q) * 100)) + "\\,\\%") + " " + c[1] + " " + M(N(u0)) + " " + c[2] + " au départ. À partir de quel rang " + M("n") + " a-t-on " + M("u_n = " + N(u0) + X + N(q) + "^n < " + N(s)) + " ?", n,
          M(N(q) + "^n < " + F(s / u0) + " \\iff n\\ln " + N(q) + " < \\ln " + F(s / u0) + " \\iff n > \\frac{\\ln " + F(s / u0) + "}{\\ln " + N(q) + "} \\approx " + N(rnd(Math.log(s / u0) / Math.log(q), 2))) + " (on divise par " + M("\\ln " + N(q) + " < 0") + " : le sens change) : " + M("n = " + n) + ".",
          { ctx: "seuil-" + c[3], guide: [GR(M("\\frac{\\ln " + F(s / u0) + "}{\\ln " + N(q) + "}") + " (au centième) ?", Math.log(s / u0) / Math.log(q), M("\\approx " + N(rnd(Math.log(s / u0) / Math.log(q), 2))) + ".", 0.01), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Au rang " + (n - 1) + ", on n'est pas encore sous " + s + "."), TR(Math.floor(Math.log(u0 / s) / Math.log(q)), "ln " + N(q).replace("{,}", ",") + " < 0 : en divisant, le sens de l'inégalité change.")] }); },
    ],
  };

  // ======================= trigfr : fonctions sinus et cosinus (Tle.AN.15–18) =======================
  const angT = (k, d) => { const g = g2(k, d) || 1; k /= g; d /= g; if (!k) return ["0", "0"]; const s = k < 0 ? "-" : "", a = Math.abs(k); return d === 1 ? [s + (a === 1 ? "" : a) + "\\pi", s + (a === 1 ? "" : a) + "π"] : [s + "\\frac{" + (a === 1 ? "" : a) + "\\pi}{" + d + "}", s + (a === 1 ? "" : a) + "π/" + d]; };
  const TF = {
    1: [
      () => { const a = nz(-5, 5), b = nz(-5, 5), e = a + "*cos(x)" + (b > 0 ? "+" : "-") + Math.abs(b) + "*sin(x)";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(a, "\\sin x") + (b < 0 ? " + " : " - ") + co(Math.abs(b), "\\cos x")) + ". Tape « sin(x) » et « cos(x) ».", e,
          M("(\\sin x)' = \\cos x") + " et " + M("(\\cos x)' = -\\sin x") + " : " + M("f'(x) = " + co(a, "\\cos x") + (b > 0 ? " + " : " - ") + co(Math.abs(b), "\\sin x")) + ".",
          { ctx: "derivee", guide: [GX("Dérivée de " + M(co(a, "\\sin x")) + " ?", a + "*cos(x)", M(co(a, "\\cos x")) + "."), GX(M("f'(x)") + " ?", e, M(co(a, "\\cos x") + (b > 0 ? " + " : " - ") + co(Math.abs(b), "\\sin x")) + ".")],
            traps: [TX(a + "*cos(x)" + (b > 0 ? "-" : "+") + Math.abs(b) + "*sin(x)", "(cos x)' = −sin x : attention au signe."), TX(-a + "*cos(x)" + (b > 0 ? "+" : "-") + Math.abs(b) + "*sin(x)", "(sin x)' = cos x, sans signe moins.")] }); },
      () => { const [vt, vs, vv] = pk([["\\frac{1}{2}", "1/2", 0.5], ["-\\frac{1}{2}", "-1/2", -0.5], ["\\frac{\\sqrt{2}}{2}", "√2/2", Math.SQRT2 / 2], ["-\\frac{\\sqrt{3}}{2}", "-√3/2", -Math.sqrt(3) / 2], ["\\frac{\\sqrt{3}}{2}", "√3/2", Math.sqrt(3) / 2]]);
        const a = Math.asin(vv), s1 = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), s2 = ((Math.PI - a) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), txt = (t) => { const k = Math.round((t * 6) / Math.PI); if (Math.abs((k * Math.PI) / 6 - t) < 1e-9) return angT(k, 6); const k4 = Math.round((t * 4) / Math.PI); return angT(k4, 4); };
        return QSet("Résous " + M("\\sin x = " + vt) + " sur " + M("[0 \\,;\\, 2\\pi[") + ". Sépare les solutions par « ; » (avec π).", [s1, s2],
          "Deux points du cercle ont pour ordonnée " + M(vt) + ", symétriques par rapport à l'axe des ordonnées : " + M("x = " + txt(s1)[0]) + " et " + M("x = " + txt(s2)[0]) + " (" + M("\\pi - x") + ").",
          { ctx: "equation-sin", canon: [s1, s2].map((t) => txt(t)[1]).join(" ; "), guide: [GR("Une solution ?", Math.min(s1, s2), M(txt(Math.min(s1, s2))[0]) + "."), FRX.GSet("Les deux ?", [s1, s2], M(txt(s1)[0] + " \\,;\\, " + txt(s2)[0]) + ".")],
            traps: [{ s: [s1], m: "Deux points du cercle ont cette ordonnée." }, { s: [a, -a].map((t) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)), m: "Pour le sinus, l'autre solution est π − x (pas −x)." }] }); },
      () => { const a = nz(-4, 4), b = nz(-5, 5), [k, d] = pk([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3]]), t = (2 * k * Math.PI) / d, c = rnd(Math.cos(t), 9), v = rnd(a * c + b, 9);
        const ct = Math.abs(c) < 1e-9 ? "0" : Math.abs(Math.abs(c) - 0.5) < 1e-9 ? (c < 0 ? "-" : "") + "\\frac{1}{2}" : Math.abs(Math.abs(c) - 1) < 1e-9 ? (c < 0 ? "-1" : "1") : null; if (!ct) return null;
        return QN("Soit " + M("f(x) = " + co(a, "\\cos(2x)") + sg(b)) + ". Calcule " + M("f\\left(" + angT(k, d)[0] + "\\right)") + ".", v,
          M("2" + X + angT(k, d)[0] + " = " + angT(2 * k, d)[0]) + " et " + M("\\cos\\left(" + angT(2 * k, d)[0] + "\\right) = " + ct) + " : " + M("f = " + N(a) + X + "(" + ct + ")" + sg(b) + " = " + F(v)) + ".",
          { ctx: "valeur", guide: [GR(M("\\cos\\left(" + angT(2 * k, d)[0] + "\\right)") + " ?", c, M(ct) + "."), GR("Valeur de " + M("f") + " ?", v, M(F(v)) + ".")],
            traps: [TR(rnd(a * Math.cos((k * Math.PI) / d) + b, 9), "On calcule cos(2x) : double d'abord l'angle."), TR(rnd(2 * a * Math.cos((k * Math.PI) / d) + b, 9), "cos(2x) n'est pas 2 cos x.")] }); },
    ],
    2: [
      () => { const fn = pk(["sin", "cos"]), a = nz(-4, 5), b = nz(-3, 3), k = pk([1, 2, 3, -2]), arg = (a === 1 ? "x" : a === -1 ? "-x" : a + "x") + sg(b);
        const e = fn === "sin" ? (k * a) + "*cos(" + linE(a, b) + ")" : (-k * a) + "*sin(" + linE(a, b) + ")";
        return QX("Donne " + M("f'(x)") + " pour " + M("f(x) = " + co(k, "\\" + fn + "(" + arg + ")")) + ".", e,
          M("(\\" + fn + "(ax + b))' = " + (fn === "sin" ? "a\\cos(ax + b)" : "-a\\sin(ax + b)")) + " : " + M("f'(x) = " + (fn === "sin" ? N(k * a) + "\\cos(" + arg + ")" : N(-k * a) + "\\sin(" + arg + ")")) + ".",
          { ctx: "derivee-compose-" + fn, guide: [GR("Par quel nombre multiplie-t-on (dérivée de " + M(arg) + ") ?", a, M(N(a)) + "."), GX(M("f'(x)") + " ?", e, M(fn === "sin" ? N(k * a) + "\\cos(" + arg + ")" : N(-k * a) + "\\sin(" + arg + ")") + ".")],
            traps: [TX(fn === "sin" ? k + "*cos(" + linE(a, b) + ")" : -k + "*sin(" + linE(a, b) + ")", "Composée : on multiplie aussi par la dérivée de " + arg.replace(/\\/g, "") + ", soit " + a + "."), TX(fn === "sin" ? (-k * a) + "*cos(" + linE(a, b) + ")" : (k * a) + "*sin(" + linE(a, b) + ")", fn === "sin" ? "(sin u)' = u' cos u, sans moins." : "(cos u)' = −u' sin u.")] }); },
      () => { const kk = pk([2, 3, 4, 5, 6]), fn = pk(["sin", "cos"]), a = pk([1, 2, 3, -2]), v = (2 * Math.PI) / kk;
        return QV("Quelle est la plus petite période positive de " + M("f(x) = " + co(a, "\\" + fn + "(" + kk + "x)")) + " ? (valeur exacte, avec π)", v, "2π/" + kk === "2π/2" ? "π" : (kk % 2 === 0 ? (kk === 2 ? "π" : "π/" + kk / 2) : "2π/" + kk),
          M("\\" + fn) + " est " + M("2\\pi") + "-périodique ; " + M("\\" + fn + "(" + kk + "(x + T)) = \\" + fn + "(" + kk + "x + " + kk + "T)") + " : il faut " + M(kk + "T = 2\\pi") + ", " + M("T = \\frac{2\\pi}{" + kk + "}" + (kk % 2 === 0 ? " = " + (kk === 2 ? "\\pi" : "\\frac{\\pi}{" + kk / 2 + "}") : "")) + ".",
          { ctx: "periode-" + fn, guide: [GR("Résous " + M(kk + "T = 2\\pi") + " : " + M("T") + " ?", v, M("\\frac{2\\pi}{" + kk + "}") + ".")],
            traps: [TR(2 * Math.PI * kk, "La période est 2π divisé par " + kk + "."), TR(2 * Math.PI, "Le " + kk + " devant x accélère les oscillations : la période diminue.")] }); },
      () => { const fn = pk(["cos", "sin"]), [vt, vv, kc, dc, ks, ds] = pk([["\\frac{1}{2}", 0.5, 1, 3, 1, 6], ["\\frac{\\sqrt{2}}{2}", Math.SQRT2 / 2, 1, 4, 1, 4], ["\\frac{\\sqrt{3}}{2}", Math.sqrt(3) / 2, 1, 6, 1, 3], ["0", 0, 1, 2, 0, 1]]), ge = R.rand() < 0.5, k = fn === "cos" ? kc : ks, d = fn === "cos" ? dc : ds;
        if (fn === "sin" && !k) return null;
        let ivs, can;
        if (fn === "cos") { const a = (k * Math.PI) / d; ivs = ge ? [[-a, true, a, true]] : [[-Math.PI, false, -a, false], [a, false, Math.PI, true]]; can = ge ? "[" + angT(-k, d)[1] + " ; " + angT(k, d)[1] + "]" : "]-π ; " + angT(-k, d)[1] + "[ ∪ ]" + angT(k, d)[1] + " ; π]"; }
        else { const a = (k * Math.PI) / d, a2 = ((d - k) * Math.PI) / d; ivs = ge ? [[a, true, a2, true]] : [[-Math.PI, false, a, false], [a2, false, Math.PI, true]]; can = ge ? "[" + angT(k, d)[1] + " ; " + angT(d - k, d)[1] + "]" : "]-π ; " + angT(k, d)[1] + "[ ∪ ]" + angT(d - k, d)[1] + " ; π]"; }
        return mk("Résous " + M("\\" + fn + " x " + (ge ? "\\geqslant" : "<") + " " + vt) + " sur " + M("]-\\pi \\,;\\, \\pi]") + ". Donne un intervalle ou une réunion d'intervalles (avec π).", solsetSpec(ivs),
          "On lit sur le cercle trigonométrique les points dont " + (fn === "cos" ? "l'abscisse" : "l'ordonnée") + " est " + (ge ? "supérieure ou égale à " : "strictement inférieure à ") + M(vt) + " : " + M("S = " + can.replace(/π/g, "\\pi ").replace(/∪/g, "\\cup")) + ".",
          { ctx: "inequation-" + fn, canon: can, guide: [GR("Valeur positive de " + M("x") + " (dans " + M("[0 \\,;\\, \\pi]") + ") où " + M("\\" + fn + " x = " + vt) + " ?", (k * Math.PI) / d, M(angT(k, d)[0]) + "."), { ask: "Ensemble des solutions ?", spec: solsetSpec(ivs), sol: M("S = " + can.replace(/π/g, "\\pi ").replace(/∪/g, "\\cup")) + "." }],
            traps: [TS(fn === "cos" ? (ge ? [[-Math.PI, false, -(k * Math.PI) / d, true], [(k * Math.PI) / d, true, Math.PI, true]] : [[-(k * Math.PI) / d, false, (k * Math.PI) / d, false]]) : (ge ? [[-Math.PI, false, (k * Math.PI) / d, true]] : [[(k * Math.PI) / d, false, Math.PI - (k * Math.PI) / d, false]]), "Tu as pris le complémentaire : vérifie le sens de l'inégalité sur le cercle.")] }); },
    ],
    3: [
      () => { const [a, c, at, ae] = pk([[1, 2, "x", "1"], [Math.SQRT2, 2, "\\sqrt{2}x", "sqrt(2)"], [Math.sqrt(3), 2, "\\sqrt{3}x", "sqrt(3)"], [1, 1, "x", "1"], [2, 4, "2x", "2"]]); /* f(x) = a·x + c·cos x sur [0 ; π] : f'(x) = a − c·sin x */
        const s = a / c; const x1 = Math.asin(s), x2 = Math.PI - x1, txt = (t) => { for (const d of [6, 4, 3, 2]) { const k = Math.round((t * d) / Math.PI); if (Math.abs((k * Math.PI) / d - t) < 1e-9) return angT(k, d); } return ["?", "?"]; };
        const S = Math.abs(x1 - x2) < 1e-9 ? [x1] : [x1, x2];
        return mk("Soit " + M("f(x) = " + at + " + " + (c === 1 ? "" : c) + "\\cos x") + " sur " + M("[0 \\,;\\, \\pi]") + ". En quelles valeurs " + M("f'") + " s'annule-t-elle ? Sépare-les par « ; » (avec π).", { kind: "set", values: S },
          M("f'(x) = " + at.replace("x", "") + (at === "x" ? "1" : "") + " - " + (c === 1 ? "" : c) + "\\sin x") + " ; " + M("f'(x) = 0 \\iff \\sin x = " + (Math.abs(s - Math.SQRT2 / 2) < 1e-9 ? "\\frac{\\sqrt{2}}{2}" : Math.abs(s - Math.sqrt(3) / 2) < 1e-9 ? "\\frac{\\sqrt{3}}{2}" : F(s))) + " : " + S.map((t) => M("x = " + txt(t)[0])).join(" et ") + ". " + (S.length === 1 ? M("f'(x) \\geqslant 0") + " : " + M("f") + " est croissante (tangente horizontale en " + M("\\frac{\\pi}{2}") + ")." : M("f") + " est croissante, décroissante puis croissante."),
          { ctx: "etude", canon: S.map((t) => txt(t)[1]).join(" ; "), guide: [GX(M("f'(x)") + " ?", ae + "-" + c + "*sin(x)", M(at.replace("x", "") + (at === "x" ? "1" : "") + " - " + (c === 1 ? "" : c) + "\\sin x") + "."), GR(M("\\sin x") + " = ?", s, "Valeur exacte " + M("\\approx " + N(rnd(s, 3))) + "."), FRX.GSet("Valeurs de " + M("x") + " ?", S, S.map((t) => M(txt(t)[0])).join(" ; ") + ".")],
            traps: [{ s: [Math.acos(s), -Math.acos(s)].filter((t) => t >= 0), m: "(cos x)' = −sin x : on résout sin x = " + FS(s) + "." }, { s: [x1], m: "Sur [0 ; π], sin x = " + FS(s) + " a deux solutions : x et π − x." }] }); },
      () => { const [vt, vv] = pk([["\\frac{1}{2}", 0.5], ["-\\frac{1}{2}", -0.5], ["\\frac{\\sqrt{2}}{2}", Math.SQRT2 / 2], ["0", 0], ["1", 1]]), kk = pk([2, 3]), fn = pk(["cos", "sin"]);
        const n = Math.abs(vv) === 1 ? kk : 2 * kk;
        return QN("Combien de solutions l'équation " + M("\\" + fn + "(" + kk + "x) = " + vt) + " a-t-elle sur " + M("[0 \\,;\\, 2\\pi[") + " ?", n,
          "Quand " + M("x") + " parcourt " + M("[0 \\,;\\, 2\\pi[") + ", " + M(kk + "x") + " parcourt " + M("[0 \\,;\\, " + 2 * kk + "\\pi[") + ", soit " + kk + " tours du cercle. Sur un tour, " + M("\\" + fn + " X = " + vt) + " a " + (Math.abs(vv) === 1 ? "1 solution" : "2 solutions") + " : en tout " + n + ".",
          { ctx: "nb-solutions-" + fn, guide: [GR("Combien de tours de cercle parcourt " + M(kk + "x") + " ?", kk, M(kk) + "."), GR("Nombre de solutions ?", n, M(n) + ".")],
            traps: [TR(Math.abs(vv) === 1 ? 1 : 2, "Avec " + kk + "x, on fait " + kk + " tours : plus de solutions."), TR(2 * kk + (Math.abs(vv) === 1 ? 0 : 2), "Compte les solutions sur un tour, puis multiplie par " + kk + ".")] }); },
      () => { const k = pk([2, 3, 4, 5, -2, 0.5]), fn = pk(["sin", "tan"]), v = k;
        return QN("Calcule " + M("\\lim_{x \\to 0} \\frac{\\sin(" + (k === 1 ? "" : N(k)) + "x)}{x}") + " (on rappelle que " + M("\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1") + ", nombre dérivé de " + M("\\sin") + " en 0).", v,
          M("\\frac{\\sin(" + N(k) + "x)}{x} = " + N(k) + X + "\\frac{\\sin(" + N(k) + "x)}{" + N(k) + "x}") + " et " + M("\\frac{\\sin X}{X} \\to 1") + " quand " + M("X \\to 0") + " : la limite vaut " + M(N(k)) + ".",
          { ctx: "limite", guide: [GR("Par quel nombre faut-il multiplier et diviser ?", k, M(N(k)) + "."), GR("Limite ?", v, M(N(v)) + ".")],
            traps: [TR(1, "Le " + N(k).replace("{,}", ",") + " compte : sin(kx)/x ≈ kx/x = k."), TR(rnd(1 / k), "sin(kx) ≈ kx près de 0 : k au numérateur.")] }); },
    ],
  };

  // ======================= tvi : théorème des valeurs intermédiaires (Tle.AN.11–12) =======================
  const tab = (xs, ys) => M("\\begin{array}{c|" + "c".repeat(2 * xs.length - 1) + "} x & " + xs.join(" & & ") + " \\\\ \\hline f(x) & " + ys.map((y, i) => y + (i < ys.length - 1 ? " & " + (typeof ys[i + 1] === "string" ? (ys[i + 1].includes("+") ? "\\nearrow" : "\\searrow") : (typeof y === "string" ? (y.includes("+") ? "\\searrow" : "\\nearrow") : (ys[i + 1] > y ? "\\nearrow" : "\\searrow"))) : "")).join(" & ") + " \\end{array}");
  const TVI = {
    1: [
      () => { const c = pk([2, 3, 5, 7, 10, 20]), r = Math.cbrt(c), n = Math.floor(r); if (Math.abs(r - Math.round(r)) < 1e-9) return null;
        return QN("La fonction " + M("f(x) = x^3") + " est continue et strictement croissante sur " + M("\\mathbb{R}") + ". L'équation " + M("x^3 = " + c) + " a une unique solution " + M("\\alpha") + ". Quel est l'entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", n,
          M(n + "^3 = " + n ** 3 + " < " + c) + " et " + M((n + 1) + "^3 = " + (n + 1) ** 3 + " > " + c) + " : d'après le théorème des valeurs intermédiaires (fonction continue strictement croissante), " + M(n + " < \\alpha < " + (n + 1)) + ".",
          { ctx: "encadrement-cube", guide: [GR(M((n + 1) + "^3") + " ?", (n + 1) ** 3, M((n + 1) ** 3) + " (plus grand que " + c + ")."), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n + 1, "(" + (n + 1) + ")³ = " + (n + 1) ** 3 + " dépasse déjà " + c + " : α est avant " + (n + 1) + "."), TR(Math.round(c / 3), "On cherche α tel que α³ = " + c + ", pas 3α.")] }); },
      () => { const a = R.int(-2, 1), b = a + R.int(2, 4), fa = -R.int(2, 9), fb = R.int(2, 9), inc = R.rand() < 0.5, ys = inc ? [fa, fb] : [fb, fa], n = fb - fa + 1;
        return QN(M("f") + " est continue et strictement " + (inc ? "croissante" : "décroissante") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ", avec " + M("f(" + a + ") = " + ys[0]) + " et " + M("f(" + b + ") = " + ys[1]) + ". Pour combien d'entiers " + M("k") + " l'équation " + M("f(x) = k") + " a-t-elle une solution dans " + M("[" + a + " \\,;\\, " + b + "]") + " ?", n,
          "D'après le théorème des valeurs intermédiaires, " + M("f") + " (continue) prend toutes les valeurs entre " + M(fa) + " et " + M(fb) + ", et seulement celles-là (monotone). Entiers de " + M(fa) + " à " + M(fb) + " : " + M(fb + " - (" + fa + ") + 1 = " + n) + ".",
          { ctx: "entiers-atteints", guide: [GR("Plus petit entier atteint ?", fa, M(fa) + "."), GR("Plus grand ?", fb, M(fb) + "."), GR("Combien d'entiers de " + M(fa) + " à " + M(fb) + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "Les deux bornes " + fa + " et " + fb + " comptent (atteintes en " + a + " et " + b + ")."), TR(fb - fa - 1, "f(" + a + ") et f(" + b + ") sont des valeurs atteintes.")] }); },
      () => { const [fx, f, lo, hi] = pk([["x^3 - 2x - 5", (x) => x ** 3 - 2 * x - 5, 2, 3], ["x^3 + x - 3", (x) => x ** 3 + x - 3, 1, 2], ["x^3 - 3x - 1", (x) => x ** 3 - 3 * x - 1, 1, 2], ["x^3 + 2x - 7", (x) => x ** 3 + 2 * x - 7, 1, 2]]), m = (lo + hi) / 2, fm = f(m), nl = fm < 0 ? m : lo;
        return QN("On cherche la solution " + M("\\alpha") + " de " + M(fx + " = 0") + " par dichotomie. On sait que " + M("f(" + lo + ") < 0") + " et " + M("f(" + hi + ") > 0") + ". On calcule " + M("f(" + N(m) + ")") + ". Quelle est la borne gauche du nouvel intervalle qui contient " + M("\\alpha") + " ?", nl,
          M("f(" + N(m) + ") = " + N(rnd(fm, 4))) + (fm < 0 ? " < 0 : la solution est entre " + M(N(m)) + " et " + M(hi) : " > 0 : la solution est entre " + M(lo) + " et " + M(N(m))) + ". Borne gauche : " + M(N(nl)) + ".",
          { ctx: "dichotomie", shownOk: true, guide: [GR(M("f(" + N(m) + ")") + " (au millième) ?", fm, M("\\approx " + N(rnd(fm, 3))) + ".", 0.001), GR("Borne gauche ?", nl, M(N(nl)) + ".")],
            traps: [TR(fm < 0 ? lo : m, "On garde la moitié où f change de signe."), TR(hi, "C'est la borne droite.")] }); },
    ],
    2: [
      () => { const c = pk([3, 5, 6, 10, 12, 15]), f = (x) => x ** 3 + x - c; let lo = 0; while (f(lo + 1) < 0) lo++; let x = lo; while (f(rnd(x + 0.1, 6)) < 0) x = rnd(x + 0.1, 6);
        if (Math.abs(f(x)) < 1e-9) return null;
        return QN("L'équation " + M("x^3 + x = " + c) + " a une unique solution " + M("\\alpha") + " (fonction continue strictement croissante). Donne la valeur approchée de " + M("\\alpha") + " par défaut au dixième (balayage avec la calculatrice).", x,
          "On tabule " + M("f(x) = x^3 + x - " + c) + " avec un pas de 0,1 : " + M("f(" + N(x) + ") \\approx " + N(rnd(f(x), 3)) + " < 0") + " et " + M("f(" + N(rnd(x + 0.1, 6)) + ") \\approx " + N(rnd(f(x + 0.1), 3)) + " > 0") + ", donc " + M(N(x) + " < \\alpha < " + N(rnd(x + 0.1, 6))) + ". Valeur par défaut : " + M(N(x)) + ".",
          { ctx: "balayage", guide: [GR("Entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", lo, M(lo) + "."), GR("Valeur par défaut au dixième ?", x, M(N(x)) + ".")],
            traps: [TR(rnd(x + 0.1, 6), "C'est la valeur par excès : par défaut = la borne inférieure."), TR(lo, "Au dixième : il faut une décimale.")] }); },
      () => { const k = pk([3, 4, 5, 6, 8, 10]), f = (x) => Math.exp(x) + x - k; let n = -1; while (f(n + 1) < 0) n++;
        return QN("La fonction " + M("f(x) = e^x + x") + " est continue et strictement croissante sur " + M("\\mathbb{R}") + ". L'équation " + M("e^x + x = " + k) + " a une unique solution " + M("\\alpha") + ". Quel est l'entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", n,
          M("f(" + n + ") = e^{" + n + "} + " + n + " \\approx " + N(rnd(f(n) + k, 2)) + " < " + k) + " et " + M("f(" + (n + 1) + ") \\approx " + N(rnd(f(n + 1) + k, 2)) + " > " + k) + " : " + M(n + " < \\alpha < " + (n + 1)) + ".",
          { ctx: "encadrement-exp", guide: [GR(M("e^{" + (n + 1) + "} + " + (n + 1)) + " (au centième) ?", f(n + 1) + k, M("\\approx " + N(rnd(f(n + 1) + k, 2))) + ".", 0.01), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n + 1, "f(" + (n + 1) + ") dépasse déjà " + k + "."), TR(Math.round(Math.log(k)), "Le terme + x compte aussi.")] }); },
      () => { const k = R.int(-6, 6), a = -R.int(3, 8), b = R.int(3, 8);
        if (k === a || k === b) return null;
        let n = 0; const ys = ["-\\infty", b, a, "+\\infty"]; const vals = [-Infinity, Math.max(a, b), Math.min(a, b), Infinity];
        for (let i = 0; i < 3; i++) { const u = vals[i], w = vals[i + 1]; if ((k > Math.min(u, w) && k < Math.max(u, w))) n++; }
        return QN("Une fonction " + M("f") + " continue sur " + M("\\mathbb{R}") + " a pour tableau de variations " + tab(["-\\infty", -1, 2, "+\\infty"], ys) + ". Combien de solutions l'équation " + M("f(x) = " + k) + " a-t-elle ?", n,
          "Sur chaque intervalle où " + M("f") + " est strictement monotone, elle prend une seule fois chaque valeur comprise entre ses limites ou valeurs aux bornes. " + M(k) + " est atteint sur " + n + " des trois intervalles : " + n + " solution" + (n > 1 ? "s" : "") + ".",
          { ctx: "tableau-limites", guide: [GR("Sur combien des trois intervalles " + M(k) + " est-il atteint ?", n, M(n) + ".")],
            traps: [TR(n === 3 ? 1 : 3, "Regarde chaque flèche : " + k + " est-il entre ses deux extrémités ?"), TR(n === 1 ? 2 : 1, "Une flèche vers +∞ (ou −∞) atteint toutes les valeurs au-delà de son départ.")] }); },
    ],
    3: [
      () => { const [fx, l, f] = pk([["\\sqrt{2u_n + 3}", 3, (x) => Math.sqrt(2 * x + 3)], ["\\sqrt{u_n + 6}", 3, (x) => Math.sqrt(x + 6)], ["\\sqrt{3u_n + 4}", 4, (x) => Math.sqrt(3 * x + 4)]]);
        return QN("La suite " + M("(u_n)") + " est définie par " + M("u_0 = 1") + " et " + M("u_{n+1} = " + fx) + ". On admet qu'elle converge vers " + M("\\ell") + ". Comme la fonction est continue, " + M("\\ell") + " vérifie " + M("\\ell = f(\\ell)") + ". Que vaut " + M("\\ell") + " ?", l,
          "On résout " + M("\\ell = f(\\ell)") + " avec " + M("\\ell \\geqslant 0") + " : on élève au carré, on obtient une équation du second degré dont la racine positive est " + M(l) + ".",
          { ctx: "point-fixe", guide: [GR("Valeur de " + M("u_1") + " (au centième) ?", f(1), M("\\approx " + N(rnd(f(1), 2))) + ".", 0.01), GR(M("\\ell") + " ?", l, M(l) + ".")],
            traps: [TR(-1, "Une racine carrée est positive : la solution négative de l'équation est exclue."), TR(rnd(f(1), 2), "C'est u₁ : on cherche la limite.")] }); },
      () => { const k = R.int(-4, 4), n = Math.abs(k) < 2 ? 3 : Math.abs(k) === 2 ? 2 : 1;
        return QN("Combien de solutions l'équation " + M("x^3 - 3x = " + k) + " a-t-elle sur " + M("\\mathbb{R}") + " ? (Étudie les variations de " + M("f(x) = x^3 - 3x") + ".)", n,
          M("f'(x) = 3x^2 - 3") + " s'annule en " + M("-1") + " et " + M("1") + " ; " + M("f(-1) = 2") + " (maximum local), " + M("f(1) = -2") + " (minimum local), limites " + M("-\\infty") + " et " + M("+\\infty") + ". " + (n === 3 ? M(k) + " est entre −2 et 2 : une solution sur chaque intervalle, 3 en tout." : n === 2 ? M(k) + " est un extremum local : deux solutions (dont une double)." : M(k) + " est hors de [−2 ; 2] : une seule solution."),
          { ctx: "nb-cubique", guide: [GR("Maximum local " + M("f(-1)") + " ?", 2, M(2) + "."), GR("Minimum local " + M("f(1)") + " ?", -2, M(-2) + "."), GR("Nombre de solutions ?", n, M(n) + ".")],
            traps: [TR(n === 3 ? 1 : 3, "Compare " + k + " aux valeurs des extremums locaux 2 et −2."), TR(n === 1 ? 2 : 1, "Sur chaque intervalle de monotonie, au plus une solution.")] }); },
      () => { const c = pk([2, 3, 4]), f = (x) => Math.log(x) + x - c; let lo = 0.01, hi = 10; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } const r = lo;
        return QR("L'équation " + M("\\ln x + x = " + c) + " a une unique solution " + M("\\alpha") + " sur " + M("]0 \\,;\\, +\\infty[") + ". Donne une valeur approchée de " + M("\\alpha") + " à 0,01 près.", r, 0.01,
          M("f(x) = \\ln x + x - " + c) + " est continue et strictement croissante. Par balayage (ou dichotomie) : " + M("\\alpha \\approx " + N(rnd(r, 2))) + ".",
          { ctx: "ln-x", guide: [GR("Entier " + M("n") + " tel que " + M("n < \\alpha < n + 1") + " ?", Math.floor(r), M(Math.floor(r)) + "."), GR(M("\\alpha") + " à 0,01 près ?", r, M("\\approx " + N(rnd(r, 2))) + ".", 0.01)],
            traps: [TR(rnd(Math.exp(c), 2), "e^" + c + " résout ln x = " + c + " seulement ; il y a aussi + x."), TR(c, "Le ln compte : ln " + c + " + " + c + " ≠ " + c + ".")] }); },
    ],
  };

  // ======================= sommeva : sommes de variables aléatoires, concentration (Tle.SP.05–07) =======================
  const SV = {
    1: [
      () => { const e1 = pk([2, 3.5, 4, -1, 1.5]), e2 = pk([5, 2.5, -2, 6, 1]), a = pk([1, 2, 3]), b = pk([1, -1, 2]), v = rnd(a * e1 + b * e2);
        return QN("On sait que " + M("E(X) = " + N(e1)) + " et " + M("E(Y) = " + N(e2)) + ". Calcule " + M("E(" + (a === 1 ? "" : a) + "X " + (b < 0 ? "-" : "+") + " " + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "Y)") + ".", v,
          "L'espérance est linéaire : " + M("E(aX + bY) = aE(X) + bE(Y) = " + a + X + NP(e1) + sg(b) + X + NP(e2) + " = " + N(v)) + " (sans hypothèse d'indépendance).",
          { ctx: "esperance-somme", guide: [GR(M("aE(X) + bE(Y)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(e1 + e2), "Multiplie par les coefficients " + a + " et " + b + "."), TR(rnd(a * e1 - b * e2), "Attention au signe devant Y.")] }); },
      () => { const v1 = pk([2, 4, 1.5, 3, 6]), v2 = pk([1, 5, 2.5, 4]), a = pk([1, 2, 3, -1, -2]), v = rnd(a * a * v1 + v2);
        return QN(M("X") + " et " + M("Y") + " sont indépendantes, avec " + M("V(X) = " + N(v1)) + " et " + M("V(Y) = " + N(v2)) + ". Calcule " + M("V(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X + Y)") + ".", v,
          "Indépendantes : " + M("V(aX + Y) = a^2V(X) + V(Y) = " + a * a + X + N(v1) + " + " + N(v2) + " = " + N(v)) + ".",
          { ctx: "variance-somme", guide: [GR(M("V(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X) = a^2V(X)") + " ?", rnd(a * a * v1), M(N(rnd(a * a * v1)))  + "."), GR("Somme ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(a * v1 + v2), "V(aX) = a²V(X) : le coefficient est au carré."), TR(rnd(a * a * v1 - v2), "Les variances s'ajoutent toujours (variables indépendantes).")] }); },
      () => { const mu = pk([10, 50, 3.5, 12, 0.4]), s2 = pk([4, 9, 16, 25, 36]), n = pk([4, 9, 16, 25, 100]), v = rnd(s2 / n);
        return QN("On répète " + M(n) + " fois, de façon indépendante, une expérience dont le résultat " + M("X") + " vérifie " + M("E(X) = " + N(mu)) + " et " + M("V(X) = " + s2) + ". Soit " + M("M_n") + " la moyenne des " + n + " résultats. Calcule " + M("V(M_n)") + ".", v,
          M("V(M_n) = \\frac{V(X)}{n} = \\frac{" + s2 + "}{" + n + "} = " + N(v)) + " (et " + M("E(M_n) = " + N(mu)) + ").",
          { ctx: "moyenne-echantillon", guide: [GR(M("V(X_1 + \\dots + X_n) = nV(X)") + " ?", n * s2, M(N(n * s2)) + "."), GR(M("V(M_n) = \\frac{1}{n^2}V(X_1 + \\dots + X_n)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(s2, "La moyenne varie moins que X : on divise par n."), TR(rnd(s2 / Math.sqrt(n)), "V(M_n) = V(X)/n ; c'est l'écart type qui est divisé par √n.")] }); },
    ],
    2: [
      () => { const n = pk([20, 50, 100, 200]), p = pk([0.1, 0.2, 0.25, 0.4, 0.5]), what = pk(["E", "V"]), v = what === "E" ? rnd(n * p) : rnd(n * p * (1 - p)), c = pk([["On lance", "fois une pièce truquée qui tombe sur pile avec la probabilité", "piles", "piece"], ["Un serveur reçoit", "requêtes ; chacune échoue indépendamment avec la probabilité", "échecs", "serveur"], ["On interroge", "personnes ; chacune a voté avec la probabilité", "votants", "sondage"]]);
        return QN(c[0] + " " + M(n) + " " + c[1] + " " + M(N(p)) + ". On note " + M("S = X_1 + \\dots + X_n") + " le nombre " + (/^[aeéiou]/.test(c[2]) ? "d'" : "de ") + c[2] + " (" + M("X_i") + " de Bernoulli). Calcule " + M(what + "(S)") + ".", v,
          (what === "E" ? M("E(S) = nE(X_1) = np = " + n + X + N(p) + " = " + N(v)) : M("V(S) = nV(X_1) = np(1 - p) = " + n + X + N(p) + X + N(rnd(1 - p)) + " = " + N(v)) + " (les " + M("X_i") + " sont indépendantes)") + ".",
          { ctx: "bernoulli-" + c[3], guide: [GR((what === "E" ? M("E(X_1) = p") : M("V(X_1) = p(1 - p)")) + " ?", what === "E" ? p : rnd(p * (1 - p)), M(N(what === "E" ? p : rnd(p * (1 - p)))) + "."), GR(M(what + "(S)") + " ?", v, M(N(v)) + ".")],
            traps: [TR(what === "E" ? rnd(n * p * (1 - p)) : rnd(n * p), what === "E" ? "C'est la variance : E(S) = np." : "C'est l'espérance : V(S) = np(1 − p)."), TR(what === "E" ? p : rnd(p * (1 - p)), "On additionne n variables : on multiplie par n.")] }); },
      () => { const mu = pk([50, 100, 20, 200]), s2 = pk([4, 9, 16, 25, 36]), d = pk([4, 5, 6, 10]), v = rnd(s2 / (d * d)); if (v >= 1) return null;
        return QN("Une variable " + M("X") + " vérifie " + M("E(X) = " + mu) + " et " + M("V(X) = " + s2) + ". D'après l'inégalité de Bienaymé-Tchebychev, quel majorant obtient-on pour " + M("P(|X - " + mu + "| \\geqslant " + d + ")") + " ?", v,
          M("P(|X - E(X)| \\geqslant \\delta) \\leqslant \\frac{V(X)}{\\delta^2} = \\frac{" + s2 + "}{" + d * d + "} = " + N(v)) + ".",
          { ctx: "bienayme", guide: [GR(M("\\delta^2") + " ?", d * d, M(d * d) + "."), GR("Majorant ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(s2 / d), "On divise par δ², pas par δ."), TR(rnd(Math.sqrt(s2) / d), "On utilise la variance V(X), pas l'écart type.")] }); },
      () => { const k = pk([2, 3, 4, 5]), wh = pk(["E", "V"]), v = wh === "E" ? rnd(3.5 * k) : rnd((35 / 12) * k, 9);
        return QN("On lance " + M(k) + " dés équilibrés à six faces et on note " + M("S") + " la somme des faces. Pour un dé, " + M("E(X) = 3{,}5") + " et " + M("V(X) = \\frac{35}{12}") + ". Calcule " + M(wh + "(S)") + (wh === "V" ? " (fraction acceptée)" : "") + ".", v,
          (wh === "E" ? M("E(S) = " + k + X + "3{,}5 = " + N(v)) : M("V(S) = " + k + X + "\\frac{35}{12} = " + F(v)) + " (dés indépendants)") + ".",
          { ctx: "des-" + wh, guide: [GR(M(wh + "(S) = " + k + X + wh + "(X)") + " ?", v, M(wh === "E" ? N(v) : F(v)) + ".")],
            traps: [TR(wh === "E" ? 3.5 : 35 / 12, "La somme de " + k + " dés : multiplie par " + k + "."), TR(wh === "E" ? rnd(3.5 * k * k) : rnd((35 / 12) * k * k, 9), "Pour une somme de variables indépendantes, on multiplie par " + k + ", pas par " + k * k + ".")] }); },
    ],
    3: [
      () => { const s2 = pk([1, 4, 9, 0.25]), d = pk([0.1, 0.2, 0.5, 0.05]), a = pk([0.05, 0.1, 0.01]), n = Math.ceil(s2 / (a * d * d) - 1e-9); if (n > 1e6 || n < 10) return null;
        return QN("Pour la moyenne " + M("M_n") + " de " + M("n") + " résultats indépendants de même loi (variance " + M(N(s2)) + "), l'inégalité de concentration donne " + M("P(|M_n - \\mu| \\geqslant " + N(d) + ") \\leqslant \\frac{" + N(s2) + "}{n" + X + N(d) + "^2}") + ". À partir de quelle valeur de " + M("n") + " ce majorant est-il inférieur ou égal à " + M(N(a)) + " ?", n,
          M("\\frac{" + N(s2) + "}{n" + X + N(rnd(d * d)) + "} \\leqslant " + N(a) + " \\iff n \\geqslant \\frac{" + N(s2) + "}{" + N(a) + X + N(rnd(d * d)) + "} = " + N(rnd(s2 / (a * d * d), 4))) + " : " + M("n = " + N(n)) + ".",
          { ctx: "concentration-n", guide: [GR(M("\\frac{" + N(s2) + "}{" + N(a) + X + N(rnd(d * d)) + "}") + " ?", s2 / (a * d * d), M(N(rnd(s2 / (a * d * d), 4))) + "."), GR(M("n") + " ?", n, M(N(n)) + ".")],
            traps: [TR(Math.ceil(s2 / (a * d)), "δ est au carré : " + N(d).replace("{,}", ",") + "² = " + N(rnd(d * d)).replace("{,}", ",") + "."), TR(n - 1, "Au rang " + (n - 1) + ", le majorant dépasse encore " + N(a).replace("{,}", ",") + " : on arrondit au-dessus.")] }); },
      () => { const g = pk([[[10, -2], [0.2, 0.8]], [[5, -1], [0.25, 0.75]], [[20, -3], [0.1, 0.9]], [[8, -2], [0.3, 0.7]]]), e = rnd(g[0][0] * g[1][0] + g[0][1] * g[1][1]), n = pk([10, 20, 50, 100]), v = rnd(n * e);
        return QN("À un jeu, on gagne " + M(g[0][0]) + " € avec la probabilité " + M(N(g[1][0])) + " et on perd " + M(-g[0][1]) + " € sinon. On joue " + M(n) + " parties indépendantes et on note " + M("G") + " le gain total. Calcule " + M("E(G)") + " (en €).", v,
          "Pour une partie : " + M("E(X) = " + g[0][0] + X + N(g[1][0]) + " + (" + g[0][1] + ")" + X + N(g[1][1]) + " = " + N(e)) + ". Par linéarité, " + M("E(G) = " + n + X + NP(e) + " = " + N(v)) + " €.",
          { ctx: "jeu-repete", guide: [GR("Espérance d'une partie ?", e, M(N(e)) + " €."), GR(M("E(G)") + " ?", v, M(N(v)) + " €.")],
            traps: [TR(rnd(n * g[0][0] * g[1][0]), "Les pertes comptent aussi dans l'espérance."), TR(e, "C'est le gain moyen d'une partie : il y en a " + n + ".")] }); },
      () => { const mu = pk([30, 60, 100]), s2 = pk([4, 9, 16]), d = pk([4, 5, 8, 10]), v = rnd(1 - s2 / (d * d)); if (v <= 0) return null;
        return QN("Une variable " + M("X") + " vérifie " + M("E(X) = " + mu) + " et " + M("V(X) = " + s2) + ". Donne un minorant de " + M("P(" + (mu - d) + " < X < " + (mu + d) + ")") + " obtenu avec l'inégalité de Bienaymé-Tchebychev.", v,
          M("P(" + (mu - d) + " < X < " + (mu + d) + ") = P(|X - " + mu + "| < " + d + ") = 1 - P(|X - " + mu + "| \\geqslant " + d + ") \\geqslant 1 - \\frac{" + s2 + "}{" + d * d + "} = " + N(v)) + ".",
          { ctx: "minoration", guide: [GR("Majorant de " + M("P(|X - " + mu + "| \\geqslant " + d + ")") + " ?", rnd(s2 / (d * d)), M(N(rnd(s2 / (d * d)))) + "."), GR("Minorant ?", v, M(N(v)) + ".")],
            traps: [TR(rnd(s2 / (d * d)), "C'est le majorant de l'évènement contraire : 1 − " + N(rnd(s2 / (d * d))).replace("{,}", ",") + "."), TR(rnd(1 - s2 / d), "δ² = " + d * d + ".")] }); },
    ],
  };

  // ======================= recurrence : raisonnement par récurrence (Tle.AN.01–02) =======================
  const RC = {
    1: [
      () => { const b = nz(-3, 4), c = nz(-5, 6); /* u_n = n² + bn + c : u_{n+1} − u_n = 2n + 1 + b */
        const U = (n) => n * n + b * n + c, e = "n^2" + (b ? (b > 0 ? "+" : "") + b + "*n" : "") + (c > 0 ? "+" : "") + c;
        return QX("On définit " + M("u_0 = " + c) + " et " + M("u_{n+1} = u_n + 2n" + sg(1 + b)) + ". Calcule " + M("u_1, u_2, u_3") + ", puis conjecture une expression de " + M("u_n") + " de la forme " + M("n^2 + bn + c") + " (à démontrer par récurrence).", e,
          M("u_1 = " + U(1) + ", u_2 = " + U(2) + ", u_3 = " + U(3)) + ". Conjecture " + M("u_n = n^2" + (b ? sg(b) + "n" : "") + sg(c)) + ". Hérédité : " + M("u_{n+1} = n^2" + (b ? sg(b) + "n" : "") + sg(c) + " + 2n" + sg(1 + b) + " = (n + 1)^2" + (b ? sg(b) + "(n + 1)" : "") + sg(c)) + ".",
          { ctx: "conjecture-formule", guide: [GR(M("u_1") + " ?", U(1), M(U(1)) + "."), GR(M("u_2") + " ?", U(2), M(U(2)) + "."), GX(M("u_n") + " ?", e, M("n^2" + (b ? sg(b) + "n" : "") + sg(c)) + ".")],
            traps: [TX("n^2+" + c, "Teste ta formule sur u₁ et u₂."), TX("2*n+" + (1 + b + c), "u_n grandit de plus en plus vite : ce n'est pas une suite arithmétique.")] }); },
      () => { const [a, b, q] = pk([[2, 1, 2], [3, -2, 3], [2, -3, 2], [3, 4, 3], [5, 1, 5]]), k = b * (1 - q) /* u_{n+1} = q u_n + k  avec u_n = a·q^n + b */, e = a * q + "*" + q + "^n" + (b > 0 ? "+" : "-") + Math.abs(b);
        return QX("Par récurrence, on veut montrer que " + M("u_n = " + a + X + q + "^n" + sg(b)) + " pour la suite " + M("u_{n+1} = " + q + "u_n" + sg(k)) + ". Hérédité : on suppose " + M("u_n = " + a + X + q + "^n" + sg(b)) + ". Exprime " + M("u_{n+1} = " + q + "u_n" + sg(k)) + " en fonction de " + M("n") + ".", e,
          M("u_{n+1} = " + q + "(" + a + X + q + "^n" + sg(b) + ")" + sg(k) + " = " + a + X + q + "^{n+1}" + sg(q * b + k) + " = " + a + X + q + "^{n+1}" + sg(b)) + " : la propriété est héréditaire.",
          { ctx: "heredite-geometrique", guide: [GX("Développe " + M(q + "(" + a + X + q + "^n" + sg(b) + ")") + ".", (a * q) + "*" + q + "^n+" + q * b, M(a * q + X + q + "^n" + sg(q * b)) + "."), GX(M("u_{n+1}") + " ?", e, M(a + X + q + "^{n+1}" + sg(b)) + ".")],
            traps: [TX(a + "*" + q + "^n+" + b, "C'est u_n ; on calcule u_{n+1} = " + q + " u_n" + (k ? " + (" + k + ")" : "") + "."), TX(a * q + "*" + q + "^n+" + q * b, "N'oublie pas d'ajouter " + k + ".")] }); },
      () => { const [S, t, e, d] = pk([["1 + 2 + \\dots + n = \\frac{n(n+1)}{2}", "1 + 2 + \\dots + n + (n + 1)", "n+1", "somme-entiers"], ["1 + 3 + 5 + \\dots + (2n - 1) = n^2", "1 + 3 + \\dots + (2n - 1) + (2n + 1)", "2*n+1", "somme-impairs"], ["1^2 + 2^2 + \\dots + n^2 = \\frac{n(n+1)(2n+1)}{6}", "1^2 + \\dots + n^2 + (n + 1)^2", "(n+1)^2", "somme-carres"]]);
        return QX("On démontre par récurrence que " + M(S) + ". À l'étape d'hérédité, on passe de la somme jusqu'au rang " + M("n") + " à celle jusqu'au rang " + M("n + 1") + " (" + M(t) + ") : quel terme ajoute-t-on ? (expression en " + M("n") + ")", e,
          "La somme au rang " + M("n + 1") + " est celle au rang " + M("n") + " plus le terme suivant : " + M(e.replace("*", "")) + ". On utilise ensuite l'hypothèse de récurrence pour la somme au rang " + M("n") + ".",
          { ctx: "heredite-" + d, guide: [GX("Terme ajouté ?", e, M(e.replace("*", "")) + ".")],
            traps: [TX(d === "somme-impairs" ? "2*n-1" : d === "somme-carres" ? "n^2" : "n", "C'est le dernier terme de la somme au rang n ; on ajoute le suivant."), TX(d === "somme-entiers" ? "(n+1)*(n+2)/2" : "(n+1)^2", "C'est la formule au rang n + 1, pas le terme ajouté.")] }); },
    ],
    2: [
      () => { const [fx, f, M0, nm] = pk([["\\sqrt{u_n + 6}", (x) => Math.sqrt(x + 6), 3, "racine6"], ["\\sqrt{2u_n + 8}", (x) => Math.sqrt(2 * x + 8), 4, "racine8"], ["\\frac{1}{2}u_n + 3", (x) => x / 2 + 3, 6, "affine"], ["\\sqrt{3u_n + 10}", (x) => Math.sqrt(3 * x + 10), 5, "racine10"]]);
        return QN("Soit " + M("u_0 = 0") + " et " + M("u_{n+1} = " + fx) + ". On montre par récurrence que " + M("0 \\leqslant u_n \\leqslant M") + " avec " + M("M") + " tel que " + M("f(M) = M") + " (la fonction est croissante). Que vaut " + M("M") + " ?", M0,
          "Hérédité : si " + M("0 \\leqslant u_n \\leqslant " + M0) + ", la fonction étant croissante, " + M("f(0) \\leqslant u_{n+1} \\leqslant f(" + M0 + ") = " + M0) + ". On a choisi " + M("M = " + M0) + " car " + M("f(" + M0 + ") = " + M0) + ".",
          { ctx: "majorant-" + nm, guide: [GR(M("f(" + M0 + ")") + " ?", f(M0), M(f(M0)) + "."), GR(M("M") + " ?", M0, M(M0) + ".")],
            traps: [TR(rnd(f(0), 3), "C'est u₁ = f(0) : on cherche M tel que f(M) = M."), TR(rnd(f(M0 + 1), 3), "Avec ce majorant, f(M) ≠ M : l'hérédité ne marche pas.")] }); },
      () => { const a = pk([4, 5, 7, 10, 3]), d = a - 1;
        return QN("On démontre par récurrence que " + M(a + "^n - 1") + " est divisible par " + M(d) + ". Hérédité : " + M(a + "^{n+1} - 1 = " + a + "(" + a + "^n - 1) + k") + ". Que vaut " + M("k") + " ?", d,
          M(a + X + a + "^n - 1 = " + a + "(" + a + "^n - 1) + " + a + " - 1") + ", donc " + M("k = " + d) + " ; comme " + M(a + "^n - 1") + " est divisible par " + M(d) + " (hypothèse) et " + M(d) + " aussi, la somme l'est.",
          { ctx: "divisibilite", guide: [GR("Développe " + M(a + "(" + a + "^n - 1)") + " : " + M(a + "^{n+1} - k'") + " avec " + M("k'") + " = ?", a, M(a) + "."), GR(M("k") + " ?", d, M(d) + ".")],
            traps: [TR(a, a + "^{n+1} − 1 = " + a + "(" + a + "ⁿ − 1) + " + a + " − 1."), TR(-1, "Développe " + a + "(" + a + "ⁿ − 1) = " + a + "^{n+1} − " + a + ".")] }); },
      () => { const [u0, q, r] = pk([[2, 2, -1], [1, 3, 2], [3, 2, 1], [0, 3, -2], [1, 2, -3]]), seq = [u0]; for (let i = 0; i < 6; i++) seq.push(q * seq[i] + r);
        const l = r / (1 - q), A = u0 - l; /* u_n = A q^n + l */ if (!Number.isInteger(l) || !Number.isInteger(A)) return null; const e = A + "*" + q + "^n" + (l >= 0 ? "+" : "") + l;
        return QX("Soit " + M("u_0 = " + u0) + " et " + M("u_{n+1} = " + q + "u_n" + sg(r)) + ". Calcule les premiers termes et conjecture " + M("u_n") + " sous la forme " + M("A" + X + q + "^n + B") + ".", e,
          M("u_1 = " + seq[1] + ", u_2 = " + seq[2] + ", u_3 = " + seq[3]) + ". La suite " + M("u_n" + sg(-l)) + " est géométrique de raison " + M(q) + " : " + M("u_n = " + A + X + q + "^n" + sg(l)) + " (à démontrer par récurrence).",
          { ctx: "conjecture-arithmetico", guide: [GR(M("u_3") + " ?", seq[3], M(seq[3]) + "."), GR(M("B") + " (le nombre fixe : " + M("B = " + q + "B" + sg(r)) + ") ?", l, M(l) + "."), GX(M("u_n") + " ?", e, M(A + X + q + "^n" + sg(l)) + ".")],
            traps: [TX(u0 + "*" + q + "^n", "Le terme " + r + " ajouté à chaque étape change la formule."), TX(u0 + "+" + r + "*n", "On multiplie par " + q + " à chaque étape : ce n'est pas arithmétique.")] }); },
    ],
    3: [
      () => { const [S, n0, nm] = pk([["2^n \\geqslant n^2", 4, "2n-n2"], ["2^n > n^3", 10, "2n-n3"], ["3^n > n^3", 4, "3n-n3"], ["2^n > 5n", 5, "2n-5n"], ["n! > 2^n", 4, "fact"]]);
        return QN("La propriété " + M("P(n) : " + S) + " est fausse pour certains petits entiers. À partir de quel entier " + M("n_0 \\geqslant 1") + " est-elle vraie pour tous les entiers " + M("n \\geqslant n_0") + " (initialisation en " + M("n_0") + ", puis hérédité) ?", n0,
          "On teste : " + M("P(" + (n0 - 1) + ")") + " est fausse et " + M("P(" + n0 + ")") + " est vraie ; l'hérédité se démontre pour " + M("n \\geqslant " + n0) + ". Donc " + M("n_0 = " + n0) + ".",
          { ctx: "rang-initial-" + nm, guide: [GR("Plus grand entier pour lequel " + M("P(n)") + " est fausse ?", n0 - 1, M(n0 - 1) + "."), GR(M("n_0") + " ?", n0, M(n0) + ".")],
            traps: [TR(n0 - 1, "P(" + (n0 - 1) + ") est encore fausse."), TR(1, "Vraie au rang 1 ne suffit pas : elle doit rester vraie ensuite.")] }); },
      () => { const [a, b, u0] = pk([[0.5, 4, 1], [0.5, 3, 10], [0.8, 2, 0], [0.25, 6, 2], [0.6, 4, 20]]), l = b / (1 - a), up = u0 < l;
        return QN("Soit " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(a) + "u_n + " + b) + ". On montre par récurrence que la suite est " + (up ? "croissante et majorée" : "décroissante et minorée") + " par un nombre " + M("L") + " vérifiant " + M("L = " + N(a) + "L + " + b) + ". Que vaut " + M("L") + " ?", l,
          M("L = " + N(a) + "L + " + b + " \\iff " + N(rnd(1 - a)) + "L = " + b + " \\iff L = " + N(l)) + ". Hérédité : si " + (up ? M("u_n \\leqslant " + N(l)) + ", alors " + M("u_{n+1} \\leqslant " + N(a) + X + N(l) + " + " + b + " = " + N(l)) : M("u_n \\geqslant " + N(l)) + ", alors " + M("u_{n+1} \\geqslant " + N(l))) + ". La suite, monotone et bornée, converge vers " + M(N(l)) + ".",
          { ctx: "borne-" + (up ? "majorant" : "minorant"), guide: [GR(M("1 - " + N(a)) + " ?", rnd(1 - a), M(N(rnd(1 - a))) + "."), GR(M("L") + " ?", l, M(N(l)) + ".")],
            traps: [TR(rnd(b / (1 + a)), "L − " + N(a).replace("{,}", ",") + "L = (1 − " + N(a).replace("{,}", ",") + ")L."), TR(rnd(a * u0 + b), "C'est u₁.")] }); },
      () => { const [a, b, u0] = pk([[3, -4, 5], [2, 3, 1], [0.5, 2, 10], [4, -6, 3], [2, -5, 8]]), l = b / (1 - a), v0 = u0 - l; if (!Number.isInteger(l) || !v0) return null;
        return QN("Soit " + M("u_0 = " + N(u0)) + " et " + M("u_{n+1} = " + N(a) + "u_n" + sg(b)) + ". On pose " + M("v_n = u_n" + sg(-l)) + " : " + M("(v_n)") + " est géométrique de raison " + M(N(a)) + ". Que vaut " + M("v_{3}") + " ?", rnd(v0 * a ** 3),
          M("v_0 = u_0" + sg(-l) + " = " + N(v0)) + " et " + M("v_{n+1} = u_{n+1}" + sg(-l) + " = " + N(a) + "u_n" + sg(b - l) + " = " + N(a) + "v_n") + ". Donc " + M("v_3 = " + N(v0) + X + N(a) + "^3 = " + N(rnd(v0 * a ** 3))) + ".",
          { ctx: "suite-auxiliaire", guide: [GR(M("v_0") + " ?", v0, M(N(v0)) + "."), GR(M("v_3") + " ?", rnd(v0 * a ** 3), M(N(rnd(v0 * a ** 3))) + ".")],
            traps: [TR(rnd(u0 * a ** 3), "On part de v₀ = u₀ − " + l + ", pas de u₀."), TR(rnd(v0 * a ** 3 + l), "C'est u₃ ; on demande v₃.")] }); },
    ],
  };

  reg([
    { id: "lnfr", theme: "fa", label: "Logarithme népérien : propriétés, équations, seuils", ex: "\\ln(ab) = \\ln a + \\ln b", FR: [12, 3], g: LN,
      hint: "ln est la réciproque de exp : e^x = k ⇔ x = ln k (k > 0) ; ln x = a ⇔ x = e^a. ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b, ln(aⁿ) = n ln a. Diviser par ln q < 0 (0 < q < 1) change le sens d'une inégalité.",
      comps: ["Propriétés algébriques, e^x = k, ln x = a", "ln(ax + b) = 0, seuils qⁿ ≥ k, ln(aⁿ)", "Changement de variable, domaine, seuil d'une suite décroissante"],
      lesson: ["Le logarithme népérien", "La fonction \\(\\ln\\) est la réciproque de \\(\\exp\\) : pour \\(x > 0\\), \\(y = \\ln x \\iff x = e^y\\).",
        "\\(\\ln 1 = 0\\), \\(\\ln e = 1\\). Pour \\(a, b > 0\\) : \\(\\ln(ab) = \\ln a + \\ln b\\), \\(\\ln\\frac{a}{b} = \\ln a - \\ln b\\), \\(\\ln(a^n) = n\\ln a\\). \\(\\ln\\) est strictement croissante sur \\(]0 \\,;\\, +\\infty[\\) : \\(\\ln a < \\ln b \\iff a < b\\). Seuil : \\(q^n \\geqslant k \\iff n\\ln q \\geqslant \\ln k\\) ; si \\(0 < q < 1\\), \\(\\ln q < 0\\) et le sens change en divisant.",
        ["\\(e^{2x} = 5 \\iff x = \\frac{\\ln 5}{2}\\).", "\\(1{,}05^n \\geqslant 2 \\iff n \\geqslant \\frac{\\ln 2}{\\ln 1{,}05} \\approx 14{,}2\\) : \\(n = 15\\)."],
        "\\(\\ln(a + b)\\) n'est pas \\(\\ln a + \\ln b\\) ; et on vérifie toujours le domaine (\\(\\ln\\) d'un nombre positif)."],
      probs: [() => P("Un capital de 2 000 € est placé à 4 % par an (intérêts composés).", [["a) Coefficient multiplicateur annuel", 1.04], ["b) n minimal pour que le capital dépasse 3 000 €", 11], ["c) n minimal pour qu'il double", 18]], ["2000 × 1,04ⁿ ≥ 3000 ⇔ n ≥ ln 1,5 / ln 1,04.", "ln 2 / ln 1,04 ≈ 17,7."], "a) " + M("1{,}04") + " ; b) " + M("\\frac{\\ln 1{,}5}{\\ln 1{,}04} \\approx 10{,}3") + ", donc " + M("n = 11") + " ; c) " + M("\\frac{\\ln 2}{\\ln 1{,}04} \\approx 17{,}7") + ", donc " + M("n = 18") + ".")] },
    { id: "trigfr", theme: "fa", label: "Fonctions sinus et cosinus", ex: "(\\sin x)' = \\cos x", FR: [12, 4], g: TF,
      hint: "x en radians. (sin x)' = cos x ; (cos x)' = −sin x ; (sin(ax + b))' = a cos(ax + b). sin et cos sont 2π-périodiques ; cos est paire, sin impaire. Sur ]−π ; π], cos x = a donne ± la même valeur ; sin x = a donne x et π − x.",
      comps: ["Dériver sin et cos, sin x = a, valeurs remarquables", "Composées sin(ax + b), période, inéquations sur le cercle", "Étude d'une fonction, nombre de solutions, limite de sin(kx)/x"],
      lesson: ["Fonctions sinus et cosinus", "Les fonctions \\(\\sin\\) et \\(\\cos\\) se lisent sur le cercle trigonométrique (\\(x\\) en radians).",
        "Elles sont définies et dérivables sur \\(\\mathbb{R}\\), \\(2\\pi\\)-périodiques ; \\(\\cos\\) est paire, \\(\\sin\\) impaire. \\((\\sin x)' = \\cos x\\), \\((\\cos x)' = -\\sin x\\), \\((\\sin(ax + b))' = a\\cos(ax + b)\\), \\((\\cos(ax + b))' = -a\\sin(ax + b)\\). \\(x \\mapsto \\sin(kx)\\) a pour période \\(\\frac{2\\pi}{k}\\). \\(\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1\\).",
        ["\\((3\\sin(2x))' = 6\\cos(2x)\\).", "\\(\\cos x \\geqslant \\frac{1}{2}\\) sur \\(]-\\pi \\,;\\, \\pi]\\) : \\(\\left[-\\frac{\\pi}{3} \\,;\\, \\frac{\\pi}{3}\\right]\\)."],
        "\\((\\cos x)' = -\\sin x\\) : le signe moins est souvent oublié."] },
    { id: "tvi", theme: "fa", label: "Continuité, théorème des valeurs intermédiaires", ex: "f(a) < k < f(b) \\Rightarrow \\exists c, \\ f(c) = k", FR: [12, 2], g: TVI,
      hint: "f continue sur [a ; b] : f prend toutes les valeurs entre f(a) et f(b). Si en plus f est strictement monotone, chaque valeur est prise une seule fois. Encadrer α : tabuler (balayage) ou couper l'intervalle en deux (dichotomie).",
      comps: ["Encadrement par des entiers, une solution unique, dichotomie", "Balayage au dixième, tableau avec limites", "Point fixe d'une suite, nombre de solutions, approximation à 0,01"],
      lesson: ["Théorème des valeurs intermédiaires", "Une fonction continue sur un intervalle ne « saute » pas : elle prend toutes les valeurs intermédiaires.",
        "Si \\(f\\) est continue sur \\([a \\,;\\, b]\\) et si \\(k\\) est compris entre \\(f(a)\\) et \\(f(b)\\), l'équation \\(f(x) = k\\) a au moins une solution dans \\([a \\,;\\, b]\\). Si de plus \\(f\\) est strictement monotone, la solution est unique. On l'encadre par balayage (valeurs de \\(f\\) avec un pas de 0,1, 0,01…) ou par dichotomie (on garde la moitié de l'intervalle où \\(f - k\\) change de signe). Si \\(u_{n+1} = f(u_n)\\) converge vers \\(\\ell\\) et \\(f\\) est continue, alors \\(f(\\ell) = \\ell\\).",
        ["\\(x^3 = 10\\) : \\(2^3 = 8 < 10 < 27 = 3^3\\), donc \\(2 < \\alpha < 3\\).", "\\(u_{n+1} = \\sqrt{u_n + 6}\\) : \\(\\ell = \\sqrt{\\ell + 6}\\) donne \\(\\ell = 3\\)."],
        "Sans la stricte monotonie, il peut y avoir plusieurs solutions ; sans la continuité, peut-être aucune."] },
    { id: "sommeva", theme: "no", label: "Sommes de variables aléatoires, concentration", ex: "V(X + Y) = V(X) + V(Y)", FR: [12, 7], g: SV,
      hint: "E(X + Y) = E(X) + E(Y) toujours ; V(X + Y) = V(X) + V(Y) si X et Y sont indépendantes ; V(aX) = a²V(X). Moyenne de n répétitions : E = μ, V = σ²/n. Bienaymé-Tchebychev : P(|X − μ| ≥ δ) ≤ V(X)/δ².",
      comps: ["Linéarité de l'espérance, variance d'une somme, moyenne d'un échantillon", "Somme de Bernoulli, Bienaymé-Tchebychev, somme de dés", "Taille d'échantillon, gain d'un jeu répété, minorer une probabilité"],
      lesson: ["Sommes de variables aléatoires", "On étudie une grandeur obtenue en ajoutant les résultats de plusieurs expériences.",
        "Linéarité : \\(E(aX + bY) = aE(X) + bE(Y)\\). Si \\(X\\) et \\(Y\\) sont indépendantes : \\(V(X + Y) = V(X) + V(Y)\\), et \\(V(aX) = a^2V(X)\\). Pour \\(n\\) répétitions indépendantes : \\(S_n = X_1 + \\dots + X_n\\) a \\(E(S_n) = n\\mu\\), \\(V(S_n) = n\\sigma^2\\) ; la moyenne \\(M_n = \\frac{S_n}{n}\\) a \\(E(M_n) = \\mu\\), \\(V(M_n) = \\frac{\\sigma^2}{n}\\). Bienaymé-Tchebychev : \\(P(|X - \\mu| \\geqslant \\delta) \\leqslant \\frac{V(X)}{\\delta^2}\\) ; inégalité de concentration : \\(P(|M_n - \\mu| \\geqslant \\delta) \\leqslant \\frac{\\sigma^2}{n\\delta^2}\\) (loi des grands nombres : \\(M_n\\) se concentre autour de \\(\\mu\\)).",
        ["Loi binomiale \\(\\mathcal{B}(n \\,;\\, p)\\) = somme de \\(n\\) Bernoulli : \\(E = np\\), \\(V = np(1 - p)\\).", "\\(V(X) = 4\\), \\(\\delta = 5\\) : \\(P(|X - \\mu| \\geqslant 5) \\leqslant 0{,}16\\)."],
        "Les variances s'ajoutent seulement pour des variables indépendantes ; et \\(V(2X) = 4V(X)\\), pas \\(2V(X)\\)."] },
    { id: "recurrence", theme: "fa", label: "Raisonnement par récurrence", ex: "P(0) \\text{ et } P(n) \\Rightarrow P(n + 1)", FR: [12, 0], g: RC,
      hint: "Initialisation : la propriété est vraie au premier rang. Hérédité : si elle est vraie au rang n, elle l'est au rang n + 1 (on utilise l'hypothèse). Conclusion : vraie pour tout n à partir du premier rang.",
      comps: ["Conjecturer une formule, calculer l'hérédité, terme ajouté", "Majorant, divisibilité, conjecture d'une suite arithmético-géométrique", "Rang initial, suite bornée, suite auxiliaire"],
      lesson: ["Raisonnement par récurrence", "Pour démontrer qu'une propriété \\(P(n)\\) est vraie pour tout entier \\(n \\geqslant n_0\\), on monte un escalier marche par marche.",
        "Initialisation : on vérifie \\(P(n_0)\\). Hérédité : on suppose \\(P(n)\\) vraie pour un entier \\(n \\geqslant n_0\\) (hypothèse de récurrence) et on démontre \\(P(n + 1)\\). Conclusion : \\(P(n)\\) est vraie pour tout \\(n \\geqslant n_0\\). On conjecture souvent la propriété en calculant les premiers termes.",
        ["\\(u_0 = 1\\), \\(u_{n+1} = u_n + 2n + 3\\) : \\(u_n = (n + 1)^2\\).", "\\(4^{n+1} - 1 = 4(4^n - 1) + 3\\) : divisible par 3 si \\(4^n - 1\\) l'est."],
        "L'hérédité seule ne suffit pas : sans initialisation, rien n'est démontré (\\(2^n > n^3\\) n'est vraie qu'à partir de 10)."] },
  ]);
})();

// 25.11 (soir) · France : derniers manques du programme (tools/france_couverture.md, branche agent/frfin). Notions créées
// (3 niveaux, ≥ 3 formes par niveau, pas à pas, pièges, contextes, leçon, compétences, défi de niveau 4 ; leçons actives
// dans src/fr_act.js) : 6e symax (symétrie axiale), mediatrice, echelle6 (échelles : la notion suisse echelle mélange
// aires et volumes × k², × k³, de 4e), proba6 (premiers pas en probabilités : proba est de 5e, avec deux dés et des
// tirages sans remise) ; 5e empil (empilements de cubes, vues) ; 2nde compdiff (comparer par différence ou quotient,
// AU.01, NC.10) ; 1re posrelc (position relative de deux courbes, AN.09) ; Tle intmaj (majorer, encadrer une intégrale,
// AN.24), suiteint (suites d'intégrales, AN.26). Rattachement : progcalc passe de la 4e à la 5e (src/fr_college.js,
// formes de 4e écartées par HORS_FR, src/fr_couv.js). Notes sur 20 pour un profil français : FR_NOTES (lu par
// Engine.finalize) remplace les questions à notes suisses (1 à 6). Notions sans CH ni MP : invisibles pour un élève suisse.
(function () {
  const { pk, nz, rnd, g2, N, NP, F, FS, sg, X, co, mk, QN, QR, QX, QS, GR, GX, TR, TX, TS, P, reg } = FRX;
  const D = (v) => String(rnd(v, 6)).replace(".", ","); /* décimal en texte simple */
  const QD = (q, value, sol, o) => mk(q, { kind: "value", value: rnd(value, 9) }, sol, Object.assign({ canon: D(value) }, o));
  const QF = (q, value, sol, o) => mk(q, { kind: "value", value: rnd(value, 12) }, sol, Object.assign({ canon: FS(value) }, o));
  const GD = (ask, value, sol, round) => GR(ask, rnd(value, 9), sol, round);
  const TD = (v, m) => TR(rnd(v, 9), m);
  const dec1 = (a, b) => R.int(Math.round(a * 10), Math.round(b * 10)) / 10;
  const who = () => pk(["Léa", "Hugo", "Chloé", "Nathan", "Manon", "Louis", "Camille", "Jules", "Inès", "Gabriel", "Zoé", "Adam"]);
  const cm = (v) => M(N(v) + "\\text{ cm}");
  const deg = (v) => M(N(v) + "°");
  // ---------- petites figures SVG (classes du thème, lisibles à 360 px) ----------
  const sv = (w, h, g, lab) => '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + lab + '" xmlns="http://www.w3.org/2000/svg">' + g + "</svg>";
  const tx = (x, y, s, a = "middle", sz = 13, cls = "f-txt") => '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" class="' + cls + '" text-anchor="' + a + '" font-size="' + sz + '">' + String(s).replace(/\./g, ",") + "</text>";
  const ln = (x1, y1, x2, y2, cls = "f-line", ex = "") => '<line x1="' + (+x1).toFixed(1) + '" y1="' + (+y1).toFixed(1) + '" x2="' + (+x2).toFixed(1) + '" y2="' + (+y2).toFixed(1) + '" class="' + cls + '"' + ex + "/>";
  const dot = (x, y) => '<circle cx="' + (+x).toFixed(1) + '" cy="' + (+y).toFixed(1) + '" r="4" class="f-dot"/>';
  const pg = (pts, cls = "f-shape", ex = "") => '<polygon points="' + pts.map((p) => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ") + '" class="' + cls + '"' + ex + "/>";
  const AX = ' stroke-width="2.4" stroke-dasharray="7 4"';
  /* quadrillage : o = { cols, rows, s, v (axe vertical x = v), h (axe horizontal y = h), cells [[i, j]], pts [[x, y, nom]], polys [[[x, y]…]] } */
  const grille = (o) => {
    const s = o.s || 24, W = o.cols * s + 24, H = o.rows * s + 24, gx = (x) => 12 + x * s, gy = (y) => 12 + (o.rows - y) * s;
    let g = "";
    for (const [i, j] of o.cells || []) g += '<rect x="' + gx(i) + '" y="' + gy(j + 1) + '" width="' + s + '" height="' + s + '" class="f-fill2"/>';
    for (let i = 0; i <= o.cols; i++) g += ln(gx(i), gy(0), gx(i), gy(o.rows), "f-grid", ' stroke-width="0.9"');
    for (let j = 0; j <= o.rows; j++) g += ln(gx(0), gy(j), gx(o.cols), gy(j), "f-grid", ' stroke-width="0.9"');
    for (const Q of o.polys || []) g += pg(Q.map(([x, y]) => [gx(x), gy(y)]), "f-shape", ' style="fill-opacity:.6"');
    if (o.v !== undefined) g += ln(gx(o.v), gy(0) + 8, gx(o.v), gy(o.rows) - 8, "f-accent", AX) + tx(gx(o.v) + 5, gy(o.rows) + 2, "(d)", "start", 13, "f-accent f-txt");
    if (o.h !== undefined) g += ln(gx(0) - 8, gy(o.h), gx(o.cols) + 8, gy(o.h), "f-accent", AX) + tx(gx(o.cols) - 4, gy(o.h) - 6, "(d)", "end", 13, "f-accent f-txt");
    for (const [x, y, nm] of o.pts || []) g += dot(gx(x), gy(y)) + tx(gx(x) + 7, gy(y) - 7, nm, "start", 14);
    return sv(W, H, g, o.lab || "quadrillage");
  };
  /* droite graduée de a à b, axes perpendiculaires (d) en vs, points [[x, nom]] */
  const graduee = (a, b, vs, pts, lab) => {
    const W = 320, x = (v) => 16 + ((v - a) / (b - a)) * (W - 32), y0 = 70;
    let g = ln(8, y0, W - 8, y0, "f-line", ' stroke-width="1.6"');
    for (let v = a; v <= b + 1e-9; v++) g += ln(x(v), y0 - 6, x(v), y0 + 6) + tx(x(v), y0 + 22, v, "middle", 11, "f-txt f-tick");
    vs.forEach(([v, nm], i) => (g += ln(x(v), 14, x(v), 120, "f-accent", AX) + tx(x(v) + 4, 24 + 12 * i, nm, "start", 12, "f-accent f-txt")));
    for (const [v, nm] of pts) g += dot(x(v), y0) + tx(x(v), y0 - 10, nm, "middle", 14);
    return sv(W, 130, g, lab);
  };

  // ======================= symax : symétrie axiale (6e.EG.19–20) =======================
  const FIGS = [ /* [nom, axes par des milieux de côtés, axes par des sommets, total, piège, message] */
    ["un rectangle (qui n'est pas un carré)", 2, 0, "Les diagonales d'un rectangle ne sont pas des axes de symétrie : plie-le selon une diagonale, les deux moitiés ne se superposent pas.", 4, "rectangle"],
    ["un carré", 2, 2, "Le carré a les axes du rectangle ET ceux du losange (ses deux diagonales).", 2, "carre"],
    ["un losange (qui n'est pas un carré)", 0, 2, "Les axes d'un losange sont ses diagonales, pas les droites qui joignent les milieux des côtés.", 4, "losange"],
    ["un triangle équilatéral", 0, 3, "Chaque axe passe par un sommet et par le milieu du côté opposé : il y en a un par sommet.", 1, "equilateral"],
    ["un hexagone régulier", 3, 3, "Trois axes passent par deux sommets opposés, trois autres par les milieux de deux côtés opposés.", 3, "hexagone"],
    ["un octogone régulier", 4, 4, "Quatre axes passent par deux sommets opposés, quatre autres par les milieux de deux côtés opposés.", 4, "octogone"],
    ["un pentagone régulier", 0, 5, "Avec un nombre impair de côtés, chaque axe passe par un sommet et par le milieu du côté opposé : un par sommet.", 10, "pentagone"],
  ];
  const regFig = (n, lab) => { const c = [160, 92], r = 72, a0 = n === 4 ? Math.PI / 4 : -Math.PI / 2; return sv(320, 184, pg(Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(a0 + (2 * Math.PI * k) / n), c[1] + r * Math.sin(a0 + (2 * Math.PI * k) / n)])), lab); };
  const shapeFig = (nm) => nm === "rectangle" ? sv(320, 150, pg([[50, 25], [270, 25], [270, 125], [50, 125]]), "rectangle") : nm === "losange" ? sv(320, 170, pg([[160, 10], [270, 85], [160, 160], [50, 85]]), "losange")
    : regFig({ carre: 4, equilateral: 3, hexagone: 6, octogone: 8, pentagone: 5 }[nm], nm);
  const SA = {
    1: [
      () => { const [nm, m, s, msg, trap, id] = pk(FIGS), t = m + s;
        const sm = m ? M(m) + " passant par les milieux de deux côtés opposés" : "", ss = s ? M(s) + " passant par " + (id === "equilateral" || id === "pentagone" ? "un sommet et le milieu du côté opposé" : "deux sommets opposés") : "";
        return QN("Combien d'axes de symétrie a " + nm + " ?", t, "Un axe de symétrie partage la figure en deux moitiés qui se superposent par pliage. " + [sm, ss].filter(Boolean).join(" et ") + " : " + M(t) + " axes.",
          { ctx: "axes-" + id, fig: shapeFig(id), guide: [GR("Combien d'axes passent par les milieux de deux côtés (opposés) ?", m, m ? M(m) + "." : "Aucun."), GR("Combien d'axes passent par un ou deux sommets ?", s, s ? M(s) + "." : "Aucun."), GR("Nombre total d'axes ?", t, M(t) + ".")],
            traps: [TR(trap, msg), TR(t === 2 ? 1 : 2, "Plie la figure en pensée : compte tous les plis où les deux moitiés se superposent.")] }); },
      () => { const s = [dec1(2.5, 6.5), dec1(2.5, 6.5), dec1(2.5, 6.5)]; if (s[0] + s[1] <= s[2] || s[0] + s[2] <= s[1] || s[1] + s[2] <= s[0] || new Set(s).size < 3) return null; const p = rnd(s[0] + s[1] + s[2], 6);
        return QD("Le triangle " + M("A'B'C'") + " est le symétrique du triangle " + M("ABC") + " par rapport à une droite " + M("(d)") + ". On sait que " + M("AB = " + N(s[0])) + " cm, " + M("BC = " + N(s[1])) + " cm et " + M("AC = " + N(s[2])) + " cm. Quel est le périmètre du triangle " + M("A'B'C'") + " (en cm) ?", p,
          "La symétrie axiale conserve les longueurs : " + M("A'B' = " + N(s[0])) + ", " + M("B'C' = " + N(s[1])) + ", " + M("A'C' = " + N(s[2])) + ". Périmètre : " + M(N(s[0]) + " + " + N(s[1]) + " + " + N(s[2]) + " = " + N(p)) + " cm.",
          { ctx: "conserve-longueur", guide: [GD("Combien mesure " + M("A'B'") + " (en cm) ?", s[0], M(N(s[0])) + " cm : même longueur que " + M("AB") + "."), GD("Périmètre de " + M("A'B'C'") + " (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(2 * p, "On ne double pas : le triangle symétrique a les mêmes longueurs, donc le même périmètre."), TD(s[0] + s[1], "Le périmètre est la somme des trois côtés.")] }); },
      () => { const a = R.int(35, 80), b = R.int(30, 75), c = 180 - a - b; if (c < 25 || a === b || b === c || a === c) return null;
        return QN("Le triangle " + M("A'B'C'") + " est le symétrique du triangle " + M("ABC") + " par rapport à une droite " + M("(d)") + ". Dans " + M("ABC") + ", " + M("\\widehat{A} = " + a + "°") + " et " + M("\\widehat{B} = " + b + "°") + ". Quelle est la mesure de l'angle " + M("\\widehat{C'}") + " (en degrés) ?", c,
          "Somme des angles d'un triangle : " + M("\\widehat{C} = 180° - " + a + "° - " + b + "° = " + c + "°") + ". La symétrie axiale conserve les angles : " + M("\\widehat{C'} = " + c + "°") + ".",
          { ctx: "conserve-angle", guide: [GR("Mesure de " + M("\\widehat{C}") + " dans " + M("ABC") + " ?", c, M("180 - " + a + " - " + b + " = " + c) + "."), GR(M("\\widehat{C'}") + " ?", c, M(c + "°") + " : la symétrie conserve les angles.")],
            traps: [TR(a + b, "On cherche le troisième angle : 180° moins les deux autres."), TR(180 - c, "La symétrie conserve les angles : Ĉ' = Ĉ.")] }); },
      () => { const vert = R.rand() < 0.5, k = R.int(2, 5), c = R.int(6, 8), r = R.int(1, 5);
        const o = vert ? { cols: 14, rows: 6, v: c, pts: [[c - k, r, "A"]] } : { cols: 12, rows: 9, h: 5, pts: [[R.int(2, 9), 5 + (k > 3 ? -k : k), "A"]] };
        return QN("Sur le quadrillage, " + M("A'") + " est le symétrique de " + M("A") + " par rapport à la droite " + M("(d)") + ". Combien de carreaux séparent " + M("A") + " et " + M("A'") + " ?", 2 * k,
          M("A") + " est à " + M(k) + " carreaux de " + M("(d)") + " ; " + M("A'") + " est à " + M(k) + " carreaux de l'autre côté, sur la perpendiculaire à " + M("(d)") + " : " + M(k + " + " + k + " = " + 2 * k) + " carreaux.",
          { ctx: vert ? "quadrillage-vertical" : "quadrillage-horizontal", fig: grille(Object.assign(o, { lab: "point A et axe (d) sur un quadrillage" })),
            guide: [GR("À combien de carreaux de " + M("(d)") + " est le point " + M("A") + " ?", k, M(k) + " carreaux."), GR("Distance " + M("AA'") + " en carreaux ?", 2 * k, M(2 * k) + " : " + M("(d)") + " passe au milieu de " + M("[AA']") + ".")],
            traps: [TR(k, "C'est la distance de A à l'axe ; A' est aussi loin de l'autre côté.")] }); },
    ],
    2: [
      () => { const c = R.int(30, 70) / 10, a = rnd(c - dec1(0.6, 2.8), 6), b = rnd(2 * c - a, 6); if (a < 0.3) return null;
        return QD("Sur une droite graduée, le point " + M("A") + " a pour abscisse " + M(N(a)) + ". La droite " + M("(d)") + ", perpendiculaire à la droite graduée, la coupe au point d'abscisse " + M(N(c)) + ". Quelle est l'abscisse du symétrique " + M("A'") + " de " + M("A") + " par rapport à " + M("(d)") + " ?", b,
          M("A") + " est à " + M(N(c) + " - " + N(a) + " = " + N(rnd(c - a, 6))) + " de " + M("(d)") + " ; " + M("A'") + " est à la même distance de l'autre côté : " + M(N(c) + " + " + N(rnd(c - a, 6)) + " = " + N(b)) + ".",
          { ctx: "droite-graduee", fig: graduee(0, 10, [[c, "(d)"]], [[a, "A"]], "droite graduée, point A et axe (d)"), guide: [GD("Distance de " + M("A") + " à " + M("(d)") + " ?", c - a, M(N(rnd(c - a, 6)))), GD("Abscisse de " + M("A'") + " ?", b, M(N(b)) + ".")],
            traps: [TD(c - a, "C'est la distance de A à (d) ; on demande l'abscisse de A'."), TD(c + a, "A' est à la même distance de (d) que A : ajoute à " + D(c) + " la distance " + D(c - a) + ".")] }); },
      () => { const ax = dec1(2, 5), s = [dec1(1.5, 4.5), dec1(1.5, 4.5), dec1(1.5, 4.5)], p = rnd(2 * (s[0] + s[1] + s[2]), 6);
        return QD("Une figure est symétrique par rapport à la droite " + M("(d)") + ". On n'en a dessiné que la moitié : un polygone dont un côté de " + cm(ax) + " est posé sur " + M("(d)") + " et dont les trois autres côtés mesurent " + cm(s[0]) + ", " + cm(s[1]) + " et " + cm(s[2]) + ". Quel est le périmètre de la figure entière (en cm) ?", p,
          "Le côté posé sur l'axe est à l'intérieur de la figure entière : il ne compte pas. Les trois autres côtés et leurs symétriques forment le contour : " + M("2 \\times (" + N(s[0]) + " + " + N(s[1]) + " + " + N(s[2]) + ") = " + N(p)) + " cm.",
          { ctx: "moitie-perimetre", fig: sv(320, 160, pg([[160, 20], [70, 40], [50, 120], [160, 140]], "f-shape") + pg([[160, 20], [250, 40], [270, 120], [160, 140]], "f-soft", ' style="stroke-dasharray:5 4"') + ln(160, 8, 160, 152, "f-accent", AX) + tx(166, 18, "(d)", "start", 13, "f-accent f-txt"), "moitié de figure et son symétrique"),
            guide: [GD("Contour d'une moitié, sans le côté posé sur l'axe (en cm) ?", s[0] + s[1] + s[2], M(N(rnd(s[0] + s[1] + s[2], 6))) + " cm."), GD("Périmètre de la figure entière (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(2 * (s[0] + s[1] + s[2] + ax), "Le côté posé sur l'axe se retrouve à l'intérieur de la figure : il ne fait pas partie du contour."), TD(s[0] + s[1] + s[2] + ax, "C'est le périmètre de la moitié ; la figure entière a deux fois les trois côtés extérieurs.")] }); },
      () => { const b = R.int(28, 76); if (b === 60 || b === 45) return null; const a = 180 - 2 * b;
        return QN("La droite " + M("(d)") + " est un axe de symétrie du triangle " + M("ABC") + " : elle passe par " + M("A") + " et par le milieu de " + M("[BC]") + ". On sait que " + M("\\widehat{B} = " + b + "°") + ". Quelle est la mesure de " + M("\\widehat{A}") + " (en degrés) ?", a,
          "Le symétrique de " + M("B") + " est " + M("C") + " : " + M("\\widehat{C} = \\widehat{B} = " + b + "°") + " (le triangle est isocèle en " + M("A") + "). Donc " + M("\\widehat{A} = 180° - 2 \\times " + b + "° = " + a + "°") + ".",
          { ctx: "isocele-axe", fig: sv(320, 170, pg([[160, 18], [60, 150], [260, 150]]) + ln(160, 8, 160, 162, "f-accent", AX) + tx(166, 20, "(d)", "start", 13, "f-accent f-txt") + tx(160, 12, "A", "end", 14) + tx(52, 160, "B", "end", 14) + tx(268, 160, "C", "start", 14), "triangle ABC et son axe (d)"),
            guide: [GR("Mesure de " + M("\\widehat{C}") + " ?", b, M(b + "°") + " : la symétrie conserve les angles."), GR("Mesure de " + M("\\widehat{A}") + " ?", a, M("180 - " + 2 * b + " = " + a) + ".")],
            traps: [TR(180 - b, "Il y a deux angles de " + b + "° (en B et en C) à retirer de 180°."), TR(90 - b, "La somme des trois angles vaut 180°.")] }); },
    ],
    3: [
      () => { const a = dec1(0.5, 3), c1 = dec1(a + 0.8, a + 2.5), c2 = rnd(c1 + dec1(0.6, 2.2), 6), a1 = rnd(2 * c1 - a, 6), a2 = rnd(2 * c2 - a1, 6); if (a1 < c2 + 0.2 && a1 > c2 - 0.2) return null; if (a2 < 0 || a2 > 14) return null;
        return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + ". Deux droites " + M("(d_1)") + " et " + M("(d_2)") + ", perpendiculaires à la droite graduée, la coupent aux points d'abscisses " + M(N(c1)) + " et " + M(N(c2)) + ". " + M("A'") + " est le symétrique de " + M("A") + " par rapport à " + M("(d_1)") + ", puis " + M("A''") + " celui de " + M("A'") + " par rapport à " + M("(d_2)") + ". Quelle est l'abscisse de " + M("A''") + " ?", a2,
          M("A'") + " : " + M(N(c1) + " + (" + N(c1) + " - " + N(a) + ") = " + N(a1)) + ". " + M("A''") + " : " + M(N(c2) + " " + (a1 > c2 ? "-" : "+") + " " + N(Math.abs(rnd(a1 - c2, 6))) + " = " + N(a2)) + " (même distance à " + M("(d_2)") + ", de l'autre côté).",
          { ctx: "deux-axes", fig: graduee(0, 14, [[c1, "(d₁)"], [c2, "(d₂)"]], [[a, "A"]], "droite graduée, point A et deux axes"), guide: [GD("Abscisse de " + M("A'") + " ?", a1, M(N(a1)) + "."), GD("Distance de " + M("A'") + " à " + M("(d_2)") + " ?", Math.abs(a1 - c2), M(N(Math.abs(rnd(a1 - c2, 6))))), GD("Abscisse de " + M("A''") + " ?", a2, M(N(a2)) + ".")],
            traps: [TD(a1, "C'est A' ; il reste la symétrie par rapport à (d₂)."), TD(2 * c2 - a, "On applique la deuxième symétrie à A', pas à A.")] }); },
      () => { const cols = 8, rows = 5, v = 4, all = []; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) all.push([i, j]);
        const key = (c) => c[0] + "," + c[1], mir = (c) => [2 * v - 1 - c[0], c[1]], S = new Set();
        for (const c of all) if (c[0] < v && R.rand() < 0.4) { S.add(key(c)); if (R.rand() < 0.55) S.add(key(mir(c))); }
        for (const c of all) if (c[0] >= v && R.rand() < 0.12) S.add(key(c));
        const cells = [...S].map((k) => k.split(",").map(Number)), miss = cells.filter((c) => !S.has(key(mir(c)))).length;
        if (miss < 2 || miss > 7 || cells.length < 6) return null;
        return QN("On veut que la figure coloriée soit symétrique par rapport à la droite " + M("(d)") + ". Combien de carreaux faut-il colorier en plus, au minimum (on n'efface rien) ?", miss,
          "Pour chaque carreau colorié, son symétrique par rapport à " + M("(d)") + " (même rangée, même distance à l'axe de l'autre côté) doit l'être aussi. " + M(miss) + " carreaux coloriés n'ont pas encore leur symétrique.",
          { ctx: "completer-cases", fig: grille({ cols, rows, v, cells, s: 30, lab: "carreaux coloriés et axe (d)" }), guide: [GR("Carreaux coloriés à gauche de " + M("(d)") + " dont le symétrique est blanc ?", cells.filter((c) => c[0] < v && !S.has(key(mir(c)))).length, "Compte rangée par rangée."), GR("Et à droite de " + M("(d)") + " ?", cells.filter((c) => c[0] >= v && !S.has(key(mir(c)))).length, "Même chose de l'autre côté."), GR("Carreaux à colorier en tout ?", miss, M(miss) + ".")],
            traps: [TR(cells.length, "C'est le nombre de carreaux déjà coloriés ; compte seulement ceux dont le symétrique manque."), TR(cells.filter((c) => c[0] < v && !S.has(key(mir(c)))).length, "Regarde aussi les carreaux coloriés à droite de l'axe.")] }); },
      () => { const L = dec1(2.5, 7), l = dec1(1.5, 4); if (L <= l + 0.4) return null; const p = rnd(2 * (2 * L + l), 6);
        return QD("Le rectangle " + M("ABCD") + " a pour longueur " + M("AB = " + N(L)) + " cm et pour largeur " + M("BC = " + N(l)) + " cm. On trace son symétrique par rapport à la droite " + M("(BC)") + ". Le rectangle et son symétrique forment un grand rectangle. Quel est le périmètre de ce grand rectangle (en cm) ?", p,
          "La symétrie conserve les longueurs ; le symétrique est collé le long de " + M("[BC]") + ". Le grand rectangle mesure " + M("2 \\times " + N(L) + " = " + N(rnd(2 * L, 6))) + " cm sur " + M(N(l)) + " cm : périmètre " + M("2 \\times (" + N(rnd(2 * L, 6)) + " + " + N(l) + ") = " + N(p)) + " cm.",
          { ctx: "recoller-rectangle", fig: sv(320, 120, pg([[20, 20], [160, 20], [160, 100], [20, 100]]) + pg([[160, 20], [300, 20], [300, 100], [160, 100]], "f-soft", ' style="stroke-dasharray:5 4"') + tx(14, 16, "A", "end", 13) + tx(160, 14, "B", "middle", 13) + tx(160, 116, "C", "middle", 13) + tx(14, 114, "D", "end", 13), "rectangle ABCD et son symétrique par rapport à (BC)"),
            guide: [GD("Longueur du grand rectangle (en cm) ?", 2 * L, M(N(rnd(2 * L, 6))) + " cm."), GD("Périmètre (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(4 * (L + l), "Le côté [BC], commun aux deux rectangles, n'est plus sur le contour."), TD(2 * (L + l), "C'est le périmètre du petit rectangle.")] }); },
    ],
  };

  // ======================= mediatrice : médiatrice d'un segment (6e.EG.06–08, 17) =======================
  const medFig = (lab, o = {}) => sv(320, 170, ln(50, 130, 270, 130, "f-line", ' stroke-width="2"') + dot(50, 130) + dot(270, 130) + tx(44, 148, "A", "end", 14) + tx(276, 148, "B", "start", 14) + ln(160, 10, 160, 165, "f-accent", AX) + tx(166, 22, "(d)", "start", 13, "f-accent f-txt")
    + '<path d="M160,120 L170,120 L170,130" class="f-line" fill="none"/>' + ln(102, 125, 108, 135) + ln(212, 125, 218, 135) + (o.M ? dot(160, 44) + ln(50, 130, 160, 44, "f-line") + ln(270, 130, 160, 44, "f-line") + tx(168, 44, "M", "start", 14) : "") + (o.I ? tx(166, 146, "I", "start", 14) : ""), lab);
  const MD = {
    1: [
      () => { const ab = dec1(3.2, 9.8); if (Math.round(ab * 10) % 2) return null;
        return QD("La médiatrice du segment " + M("[AB]") + " coupe " + M("[AB]") + " au point " + M("I") + ". On sait que " + M("AB = " + N(ab)) + " cm. Combien mesure " + M("AI") + " (en cm) ?", ab / 2,
          "La médiatrice d'un segment est la droite perpendiculaire à ce segment qui passe par son milieu. " + M("I") + " est le milieu de " + M("[AB]") + " : " + M("AI = " + N(ab) + " \\div 2 = " + N(rnd(ab / 2, 6))) + " cm.",
          { ctx: "milieu", fig: medFig("segment AB et sa médiatrice", { I: 1 }), guide: [GD("Par quel nombre divise-t-on " + M("AB") + " pour obtenir " + M("AI") + " ?", 2, M("I") + " est le milieu : on divise par 2."), GD(M("AI") + " (en cm) ?", ab / 2, M(N(rnd(ab / 2, 6))) + " cm.")],
            traps: [TD(2 * ab, "I est le milieu de [AB] : AI est la moitié de AB."), TD(ab - 1, "AI = AB ÷ 2.")] }); },
      () => { const ma = dec1(3, 8.5), ab = dec1(2.5, 7.5); if (2 * ma <= ab) return null; const p = rnd(2 * ma + ab, 6);
        return QD("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + ". On sait que " + M("MA = " + N(ma)) + " cm et " + M("AB = " + N(ab)) + " cm. Quel est le périmètre du triangle " + M("MAB") + " (en cm) ?", p,
          "Un point de la médiatrice de " + M("[AB]") + " est à la même distance de " + M("A") + " et de " + M("B") + " : " + M("MB = MA = " + N(ma)) + " cm. Périmètre : " + M(N(ma) + " + " + N(ma) + " + " + N(ab) + " = " + N(p)) + " cm.",
          { ctx: "perimetre", fig: medFig("M sur la médiatrice de [AB]", { M: 1 }), guide: [GD(M("MB") + " (en cm) ?", ma, M(N(ma)) + " cm : " + M("M") + " est équidistant de " + M("A") + " et " + M("B") + "."), GD("Périmètre de " + M("MAB") + " (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(ma + ab, "Il manque le côté [MB], de même longueur que [MA]."), TD(2 * ma + ab / 2, "Le côté [AB] compte en entier dans le périmètre.")] }); },
      () => { const s = dec1(6, 17); const h = rnd(s / 2, 6); if (Math.round(s * 10) % 2) return null;
        return QD(who() + " place un point " + M("M") + " sur la médiatrice du segment " + M("[AB]") + " et mesure : " + M("MA + MB = " + N(s)) + " cm. Combien mesure " + M("MB") + " (en cm) ?", h,
          M("M") + " est sur la médiatrice de " + M("[AB]") + " : " + M("MA = MB") + ". Les deux longueurs sont égales et ont pour somme " + M(N(s)) + " : " + M("MB = " + N(s) + " \\div 2 = " + N(h)) + " cm.",
          { ctx: "somme", guide: [GD("Que vaut " + M("MA - MB") + " ?", 0, "0 : " + M("MA = MB") + "."), GD(M("MB") + " (en cm) ?", h, M(N(h)) + " cm.")],
            traps: [TD(s, "C'est la somme des deux longueurs ; elles sont égales."), TD(2 * s, "MA et MB sont égales : chacune vaut la moitié de la somme.")] }); },
    ],
    2: [
      () => { const a = dec1(0.5, 4), b = rnd(a + 2 * dec1(1, 3), 6), m = rnd((a + b) / 2, 6);
        return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + " et " + M("B") + " a pour abscisse " + M(N(b)) + ". La médiatrice de " + M("[AB]") + " coupe la droite graduée en un point. Quelle est son abscisse ?", m,
          "La médiatrice passe par le milieu de " + M("[AB]") + ". " + M("AB = " + N(b) + " - " + N(a) + " = " + N(rnd(b - a, 6))) + ", la moitié vaut " + M(N(rnd((b - a) / 2, 6))) + " : " + M(N(a) + " + " + N(rnd((b - a) / 2, 6)) + " = " + N(m)) + ".",
          { ctx: "droite-graduee", fig: graduee(0, 10, [], [[a, "A"], [b, "B"]], "points A et B sur une droite graduée"), guide: [GD("Longueur " + M("AB") + " ?", b - a, M(N(rnd(b - a, 6)))), GD("Moitié de " + M("AB") + " ?", (b - a) / 2, M(N(rnd((b - a) / 2, 6)))), GD("Abscisse du milieu ?", m, M(N(m)) + ".")],
            traps: [TD((b - a) / 2, "C'est la demi-longueur ; ajoute-la à l'abscisse de A."), TD(a + b, "Le milieu est à mi-chemin : (a + b) ÷ 2.")] }); },
      () => { const t = R.int(32, 74); if (t === 60 || t === 45) return null; const m = 180 - 2 * t;
        return QN("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + " (et pas sur " + M("[AB]") + "). L'angle " + M("\\widehat{MAB}") + " mesure " + deg(t) + ". Quelle est la mesure de l'angle " + M("\\widehat{AMB}") + " (en degrés) ?", m,
          M("MA = MB") + " : le triangle " + M("MAB") + " est isocèle en " + M("M") + ", donc " + M("\\widehat{MBA} = \\widehat{MAB} = " + t + "°") + ". Somme des angles : " + M("\\widehat{AMB} = 180° - 2 \\times " + t + "° = " + m + "°") + ".",
          { ctx: "isocele-angle", fig: medFig("triangle MAB isocèle", { M: 1 }), guide: [GR(M("\\widehat{MBA}") + " ?", t, M(t + "°") + " (triangle isocèle)."), GR(M("\\widehat{AMB}") + " ?", m, M("180 - " + 2 * t + " = " + m) + ".")],
            traps: [TR(180 - t, "Les angles en A et en B sont égaux : retire " + t + "° deux fois."), TR(90 - t, "La somme des angles d'un triangle vaut 180°.")] }); },
      () => { const r = dec1(2.2, 6.4), s = rnd(2 * r, 6), ask = pk(["somme", "diametre"]);
        const v = ask === "somme" ? s : s;
        return QD("Les médiatrices des côtés du triangle " + M("ABC") + " se coupent au point " + M("O") + ", et " + M("OA = " + N(r)) + " cm. " + (ask === "somme" ? "Combien vaut " + M("OB + OC") + " (en cm) ?" : "Quel est le diamètre du cercle circonscrit au triangle " + M("ABC") + " (en cm) ?"), v,
          M("O") + " est sur la médiatrice de " + M("[AB]") + " : " + M("OB = OA") + " ; sur celle de " + M("[AC]") + " : " + M("OC = OA") + ". " + (ask === "somme" ? M("OB + OC = 2 \\times " + N(r) + " = " + N(s)) + " cm." : "Le cercle de centre " + M("O") + " passe par " + M("A") + ", " + M("B") + ", " + M("C") + " : rayon " + M(N(r)) + " cm, diamètre " + M(N(s)) + " cm."),
          { ctx: "circonscrit-" + ask, guide: [GD(M("OB") + " (en cm) ?", r, M(N(r)) + " cm."), GD(ask === "somme" ? M("OB + OC") + " ?" : "Diamètre (en cm) ?", v, M(N(v)) + " cm.")],
            traps: [TD(r, ask === "somme" ? "OB et OC valent chacun " + D(r) + " cm : additionne-les." : "C'est le rayon ; le diamètre est le double."), TD(3 * r, "On ne compte pas OA.")] }); },
    ],
    3: [
      () => { const ab = dec1(3, 8), ma = dec1(ab / 2 + 1, 9.5), p = rnd(2 * ma + ab, 6);
        return QD("Le point " + M("M") + " est sur la médiatrice du segment " + M("[AB]") + ". Le triangle " + M("MAB") + " a un périmètre de " + M(N(p)) + " cm et " + M("AB = " + N(ab)) + " cm. Combien mesure " + M("MA") + " (en cm) ?", ma,
          M("MA = MB") + " : " + M("2 \\times MA + " + N(ab) + " = " + N(p)) + ", donc " + M("2 \\times MA = " + N(rnd(p - ab, 6))) + " et " + M("MA = " + N(ma)) + " cm.",
          { ctx: "perimetre-inverse", fig: medFig("M sur la médiatrice de [AB]", { M: 1 }), guide: [GD(M("MA + MB") + " (en cm) ?", p - ab, M(N(p) + " - " + N(ab) + " = " + N(rnd(p - ab, 6)))), GD(M("MA") + " (en cm) ?", ma, M(N(ma)) + " cm.")],
            traps: [TD(p - ab, "C'est MA + MB ; les deux longueurs sont égales."), TD((p - ab) / 3, "Le périmètre a deux côtés égaux (MA et MB) et le côté AB.")] }); },
      () => { const m = dec1(3, 7.5), n = dec1(2, 6); if (Math.abs(m - n) < 0.4) return null; const p = rnd(2 * (m + n), 6);
        return QD("Les points " + M("M") + " et " + M("N") + " sont sur la médiatrice du segment " + M("[AB]") + ", de part et d'autre de " + M("(AB)") + ". On sait que " + M("MA = " + N(m)) + " cm et " + M("NB = " + N(n)) + " cm. Quel est le périmètre du quadrilatère " + M("AMBN") + " (en cm) ?", p,
          M("MB = MA = " + N(m)) + " et " + M("NA = NB = " + N(n)) + " (équidistance). Périmètre : " + M(N(m) + " + " + N(m) + " + " + N(n) + " + " + N(n) + " = " + N(p)) + " cm. " + M("AMBN") + " est un cerf-volant.",
          { ctx: "cerf-volant", fig: sv(320, 200, pg([[60, 100], [160, 20], [260, 100], [160, 170]]) + ln(160, 8, 160, 190, "f-accent", AX) + tx(52, 104, "A", "end", 14) + tx(268, 104, "B", "start", 14) + tx(166, 20, "M", "start", 14) + tx(166, 184, "N", "start", 14), "quadrilatère AMBN"),
            guide: [GD(M("MB") + " (en cm) ?", m, M(N(m)) + " cm."), GD(M("NA") + " (en cm) ?", n, M(N(n)) + " cm."), GD("Périmètre (en cm) ?", p, M(N(p)) + " cm.")],
            traps: [TD(m + n, "Il y a quatre côtés : MA, MB, NB et NA."), TD(4 * m, "NA et NB ne mesurent pas MA : N est un autre point de la médiatrice.")] }); },
      () => { const a = dec1(0.5, 3.5), h = dec1(1.2, 3.4), m = rnd(a + h, 6), b = rnd(a + 2 * h, 6);
        return QD("Sur une droite graduée, " + M("A") + " a pour abscisse " + M(N(a)) + ". La médiatrice du segment " + M("[AB]") + " coupe la droite graduée au point d'abscisse " + M(N(m)) + ". Quelle est l'abscisse de " + M("B") + " ?", b,
          "La médiatrice passe par le milieu de " + M("[AB]") + " : " + M("B") + " est aussi loin du milieu que " + M("A") + ", de l'autre côté. " + M(N(m) + " - " + N(a) + " = " + N(h)) + ", donc " + M("B") + " a pour abscisse " + M(N(m) + " + " + N(h) + " = " + N(b)) + ".",
          { ctx: "graduee-inverse", fig: graduee(0, 10, [[m, "(d)"]], [[a, "A"]], "point A et médiatrice (d) sur une droite graduée"), guide: [GD("Distance de " + M("A") + " au milieu ?", h, M(N(h))), GD("Abscisse de " + M("B") + " ?", b, M(N(b)) + ".")],
            traps: [TD(m + a, "B est à la même distance du milieu que A : ajoute " + D(h) + " à " + D(m) + "."), TD(h, "C'est la demi-longueur de [AB].")] }); },
    ],
  };

  // ======================= echelle6 : échelles, plans et cartes (6e.PF.05) =======================
  const EC = {
    1: [
      () => { const e = pk([50, 200, 250, 500]), c = dec1(1.5, 9.5), r = rnd((c * e) / 100, 6); if (r !== Math.round(r * 100) / 100) return null; const o = pk([["un mur", "mur"], ["une pièce", "piece"], ["un couloir", "couloir"], ["une terrasse", "terrasse"]]);
        return QD("Sur un plan à l'échelle " + M("\\frac{1}{" + e + "}") + ", " + o[0] + " mesure " + cm(c) + ". Quelle est sa longueur réelle, en mètres ?", r,
          "Échelle " + M("\\frac{1}{" + e + "}") + " : 1 cm sur le plan représente " + M(e) + " cm en réalité. " + M(N(c) + " \\times " + e + " = " + N(rnd(c * e, 6))) + " cm, soit " + M(N(r)) + " m.",
          { ctx: "plan-" + o[1], guide: [GD("Longueur réelle en cm ?", c * e, M(N(rnd(c * e, 6))) + " cm."), GD("En mètres ?", r, M(N(r)) + " m (on divise par 100).")],
            traps: [TD(c * e, "C'est la longueur en cm ; 1 m = 100 cm."), TD((c * e) / 1000, "1 m = 100 cm : divise par 100, pas par 1 000.")] }); },
      () => { const k = pk([2, 3, 4, 5, 10]), c = dec1(2.5, 9.5), r = rnd(c * k, 6), o = pk([["deux villes", "villes", "l'une de l'autre"], ["deux villages", "villages", "l'un de l'autre"], ["deux refuges", "refuges", "l'un de l'autre"], ["deux phares", "phares", "l'un de l'autre"]]);
        return QD("Sur une carte, " + M("1") + " cm représente " + M(k) + " km. " + o[0][0].toUpperCase() + o[0].slice(1) + " sont à " + cm(c) + " " + o[2] + " sur la carte. Quelle est la distance réelle (en km) ?", r,
          "C'est une situation de proportionnalité : " + M(N(c) + " \\times " + k + " = " + N(r)) + " km.",
          { ctx: "carte-" + o[1], guide: [GD("Combien de km pour 1 cm ?", k, M(k) + " km."), GD("Distance réelle (en km) ?", r, M(N(c) + " \\times " + k + " = " + N(r)) + " km.")],
            traps: [TD(c / k, "Chaque centimètre représente " + k + " km : on multiplie."), TD(c + k, "On multiplie par " + k + ", on n'ajoute pas.")] }); },
      () => { const k = pk([20, 24, 25, 30, 40, 50]), c = R.int(12, 95), r = rnd((c * k) / 100, 6), o = pk([["d'un bateau", "bateau"], ["d'un avion", "avion"], ["d'une locomotive", "train"], ["d'un camion", "camion"]]);
        return QD("Une maquette " + o[0] + " est " + M(k) + " fois plus petite que l'objet réel. La maquette mesure " + cm(c) + " de long. Quelle est la longueur réelle, en mètres ?", r,
          "Longueur réelle : " + M(c + " \\times " + k + " = " + N(c * k)) + " cm, soit " + M(N(r)) + " m. L'échelle de la maquette est " + M("\\frac{1}{" + k + "}") + ".",
          { ctx: "maquette-" + o[1], guide: [GD("Longueur réelle en cm ?", c * k, M(N(c * k)) + " cm."), GD("En mètres ?", r, M(N(r)) + " m.")],
            traps: [TD(c * k, "C'est en cm : divise par 100 pour avoir des mètres."), TD(c / k, "L'objet réel est plus grand : on multiplie par " + k + ".")] }); },
    ],
    2: [
      () => { const e = pk([50, 100, 200, 250]), r = pk([1.2, 1.6, 2, 2.4, 3, 3.5, 4, 4.5, 5]), c = rnd((r * 100) / e, 6); if (c !== Math.round(c * 10) / 10 || c < 0.5) return null; const o = pk([["une table", "table"], ["un lit", "lit"], ["un canapé", "canape"], ["une armoire", "armoire"]]);
        return QD("On dessine le plan d'un appartement à l'échelle " + M("\\frac{1}{" + e + "}") + ". Quelle longueur (en cm) faut-il tracer sur le plan pour " + o[0] + " de " + M(N(r)) + " m ?", c,
          M(N(r) + " \\text{ m} = " + N(rnd(r * 100, 6)) + " \\text{ cm}") + " ; sur le plan, tout est divisé par " + M(e) + " : " + M(N(rnd(r * 100, 6)) + " \\div " + e + " = " + N(c)) + " cm.",
          { ctx: "reel-plan-" + o[1], guide: [GD("Longueur réelle en cm ?", r * 100, M(N(rnd(r * 100, 6))) + " cm."), GD("Sur le plan (en cm) ?", c, M(N(c)) + " cm.")],
            traps: [TD((r * 100) * e, "Sur le plan, c'est plus petit : on divise par " + e + "."), TD(r / e, "Convertis d'abord les mètres en centimètres.")] }); },
      () => { const e = pk([10000, 20000, 25000, 50000]), c = dec1(2, 12), km = rnd((c * e) / 100000, 6); if (km !== Math.round(km * 100) / 100) return null;
        return QD("Sur une carte de randonnée à l'échelle " + M("\\frac{1}{" + N(e) + "}") + ", un sentier mesure " + cm(c) + ". Quelle est sa longueur réelle, en km ?", km,
          M(N(c) + " \\times " + N(e) + " = " + N(rnd(c * e, 6))) + " cm. Or " + M("1\\text{ km} = 100\\,000\\text{ cm}") + " : " + M(N(km)) + " km.",
          { ctx: "carte-km", guide: [GD("Longueur réelle en cm ?", c * e, M(N(rnd(c * e, 6))) + " cm."), GD("En mètres ?", (c * e) / 100, M(N(rnd((c * e) / 100, 6))) + " m."), GD("En km ?", km, M(N(km)) + " km.")],
            traps: [TD((c * e) / 1000, "1 km = 100 000 cm (1 000 m de 100 cm)."), TD((c * e) / 100, "Ce sont des mètres ; 1 km = 1 000 m.")] }); },
      () => { const e = pk([50, 100, 200, 250, 500]), c = pk([2, 3, 4, 5, 6, 8]), r = rnd((c * e) / 100, 6), o = pk([["un mur", "mur"], ["une allée", "allee"], ["un bassin", "bassin"]]);
        return QN("Sur un plan, " + o[0] + " de " + M(N(r)) + " m est représenté par un segment de " + cm(c) + ". L'échelle du plan est " + M("\\frac{1}{n}") + ". Que vaut " + M("n") + " ?", e,
          M(N(r) + " \\text{ m} = " + N(rnd(r * 100, 6)) + " \\text{ cm}") + " ; " + M(N(rnd(r * 100, 6)) + " \\div " + c + " = " + e) + " : 1 cm sur le plan représente " + M(e) + " cm en réalité.",
          { ctx: "trouver-echelle-" + o[1], guide: [GD("Longueur réelle en cm ?", r * 100, M(N(rnd(r * 100, 6))) + " cm."), GR("Combien de cm réels pour 1 cm du plan ?", e, M(e) + ".")],
            traps: [TR(rnd(r / c, 9), "Mets les deux longueurs dans la même unité (cm) avant de diviser."), TR(rnd((c * 100) / r, 9), "On divise la longueur réelle par la longueur sur le plan.")] }); },
    ],
    3: [
      () => { const e = pk([50, 100, 200, 250]), Lp = dec1(2, 9), lp = dec1(1.5, 6); if (lp >= Lp) return null; const Lr = rnd((Lp * e) / 100, 6), lr = rnd((lp * e) / 100, 6); if (Lr !== Math.round(Lr * 100) / 100 || lr !== Math.round(lr * 100) / 100) return null;
        return QD("Sur un plan, une chambre mesure " + cm(Lp) + " sur " + cm(lp) + ". En réalité, sa longueur est de " + M(N(Lr)) + " m. Quelle est sa largeur réelle (en m) ?", lr,
          "Échelle : " + M(N(Lr) + " \\text{ m} = " + N(rnd(Lr * 100, 6)) + " \\text{ cm}") + " et " + M(N(rnd(Lr * 100, 6)) + " \\div " + N(Lp) + " = " + e) + " : " + M("\\frac{1}{" + e + "}") + ". Largeur : " + M(N(lp) + " \\times " + e + " = " + N(rnd(lp * e, 6))) + " cm, soit " + M(N(lr)) + " m.",
          { ctx: "deux-longueurs", guide: [GR("Échelle " + M("\\frac{1}{n}") + " : " + M("n") + " = ?", e, M(e) + "."), GD("Largeur réelle en cm ?", lp * e, M(N(rnd(lp * e, 6))) + " cm."), GD("En m ?", lr, M(N(lr)) + " m.")],
            traps: [TD(lp * e, "Ce sont des cm : divise par 100."), TD(Lr - (Lp - lp), "Les longueurs sont proportionnelles : on ne retire pas la même différence.")] }); },
      () => { const [e1, e2] = pk([[25000, 50000], [50000, 25000], [20000, 50000], [10000, 25000], [25000, 100000], [50000, 100000]]), c = pk([4, 6, 8, 10, 12, 3, 5]), v = rnd((c * e1) / e2, 6); if (v !== Math.round(v * 10) / 10) return null;
        return QD("Sur une carte au " + M("\\frac{1}{" + N(e1) + "}") + ", deux sommets sont à " + cm(c) + " l'un de l'autre. À quelle distance (en cm) sont-ils sur une carte au " + M("\\frac{1}{" + N(e2) + "}") + " ?", v,
          "Distance réelle : " + M(c + " \\times " + N(e1) + " = " + N(c * e1)) + " cm. Sur l'autre carte : " + M(N(c * e1) + " \\div " + N(e2) + " = " + N(v)) + " cm.",
          { ctx: "deux-cartes", guide: [GD("Distance réelle en cm ?", c * e1, M(N(c * e1)) + " cm."), GD("Sur la seconde carte (en cm) ?", v, M(N(v)) + " cm.")],
            traps: [TD((c * e2) / e1, "Plus n est grand, plus la carte est réduite : la distance y est " + (e2 > e1 ? "plus petite." : "plus grande.")), TD(c * e1, "C'est la distance réelle en cm.")] }); },
      () => { const e = pk([100, 200, 250, 500]), a = dec1(2, 8), b = dec1(1.5, 6); if (b >= a) return null; const p = rnd((2 * (a + b) * e) / 100, 6); if (p !== Math.round(p * 10) / 10) return null; const o = pk([["un jardin", "jardin"], ["un terrain de sport", "terrain"], ["une cour", "cour"]]);
        return QD("Sur un plan à l'échelle " + M("\\frac{1}{" + e + "}") + ", " + o[0] + " rectangulaire mesure " + cm(a) + " sur " + cm(b) + ". Quel est le périmètre réel, en mètres ?", p,
          "Dimensions réelles : " + M(N(rnd((a * e) / 100, 6))) + " m et " + M(N(rnd((b * e) / 100, 6))) + " m. Périmètre : " + M("2 \\times (" + N(rnd((a * e) / 100, 6)) + " + " + N(rnd((b * e) / 100, 6)) + ") = " + N(p)) + " m.",
          { ctx: "perimetre-" + o[1], guide: [GD("Longueur réelle (en m) ?", (a * e) / 100, M(N(rnd((a * e) / 100, 6))) + " m."), GD("Largeur réelle (en m) ?", (b * e) / 100, M(N(rnd((b * e) / 100, 6))) + " m."), GD("Périmètre (en m) ?", p, M(N(p)) + " m.")],
            traps: [TD(2 * (a + b), "C'est le périmètre sur le plan, en cm : il faut les longueurs réelles."), TD((a + b) * e / 100, "Le périmètre compte chaque côté deux fois.")] }); },
    ],
  };

  // ======================= proba6 : premiers pas en probabilités (6e.DP.05–07) =======================
  const wheel = (cols) => { const n = cols.length, c = [160, 95], r = 80; let g = "";
    cols.forEach((cl, k) => { const a0 = (2 * Math.PI * k) / n - Math.PI / 2, a1 = (2 * Math.PI * (k + 1)) / n - Math.PI / 2;
      g += '<path d="M' + c[0] + "," + c[1] + " L" + (c[0] + r * Math.cos(a0)).toFixed(1) + "," + (c[1] + r * Math.sin(a0)).toFixed(1) + " A" + r + "," + r + " 0 0 1 " + (c[0] + r * Math.cos(a1)).toFixed(1) + "," + (c[1] + r * Math.sin(a1)).toFixed(1) + ' Z" class="' + (cl ? "f-fill2" : "f-soft") + '" style="stroke:var(--ink)"/>'; });
    return sv(320, 190, g + '<path d="M160,6 L152,0 L168,0 Z" class="f-head"/>', "roue partagée en " + n + " secteurs égaux"); };
  const PR = {
    1: [
      () => { const E = pk([["un nombre pair", [2, 4, 6]], ["un nombre supérieur ou égal à 5", [5, 6]], ["un multiple de 3", [3, 6]], ["un nombre inférieur à 3", [1, 2]], ["un diviseur de 6", [1, 2, 3, 6]], ["un nombre premier", [2, 3, 5]], ["un nombre différent de 6", [1, 2, 3, 4, 5]]]), f = E[1].length;
        return QF("On lance un dé équilibré à six faces, numérotées de 1 à 6. Quelle est la probabilité d'obtenir " + E[0] + " ? (fraction acceptée)", f / 6,
          "Les 6 issues ont la même probabilité. Issues favorables : " + E[1].join(", ") + ", soit " + M(f) + ". " + M("P = \\frac{" + f + "}{6}" + (g2(f, 6) > 1 ? " = " + F(f / 6) : "")) + ".",
          { ctx: "de", guide: [GR("Combien d'issues possibles ?", 6, M(6) + "."), GR("Combien d'issues favorables ?", f, E[1].join(", ") + "."), GR("Probabilité ?", f / 6, M(F(f / 6)) + ".")],
            traps: [TR(f, "C'est le nombre d'issues favorables ; divise par le nombre d'issues possibles."), TR(f / 10, "Il y a 6 issues possibles, pas 10.")] }); },
      () => { const c = { rouges: R.int(2, 7), bleues: R.int(2, 7), vertes: R.int(1, 5) }, col = pk(["rouges", "bleues", "vertes"]), n = c.rouges + c.bleues + c.vertes, f = c[col];
        return QF("Un sac contient " + M(c.rouges) + " billes rouges, " + M(c.bleues) + " bleues et " + M(c.vertes) + " vertes, indiscernables au toucher. On tire une bille au hasard. Quelle est la probabilité qu'elle soit " + col.slice(0, -1) + " ? (fraction acceptée)", f / n,
          "Chaque bille a la même chance d'être tirée : " + M(n) + " issues, dont " + M(f) + " favorables. " + M("P = \\frac{" + f + "}{" + n + "}" + (g2(f, n) > 1 ? " = " + F(f / n) : "")) + ".",
          { ctx: "sac", fig: FIG.urn(c), guide: [GR("Nombre de billes en tout ?", n, M(n) + "."), GR("Probabilité ?", f / n, M(F(f / n)) + ".")],
            traps: [TR(f / (n - f), "On divise par le nombre total de billes, pas par le nombre des autres."), TR(1 / 3, "Il y a 3 couleurs, mais pas le même nombre de billes de chaque couleur.")] }); },
      () => { const n = pk([6, 8, 10, 12]), k = R.int(2, n - 2), cols = Array.from({ length: n }, (_, i) => i < k); for (let i = n - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
        return QF("La roue de loterie est partagée en " + M(n) + " secteurs de même taille ; on gagne si la flèche s'arrête sur un secteur colorié. Quelle est la probabilité de gagner ? (fraction acceptée)", k / n,
          "Secteurs de même taille : les " + M(n) + " issues sont équiprobables. " + M(k) + " secteurs coloriés : " + M("P = \\frac{" + k + "}{" + n + "}" + (g2(k, n) > 1 ? " = " + F(k / n) : "")) + ".",
          { ctx: "roue", fig: wheel(cols), guide: [GR("Combien de secteurs coloriés ?", k, M(k) + "."), GR("Probabilité de gagner ?", k / n, M(F(k / n)) + ".")],
            traps: [TR(k / (n - k), "On divise par le nombre total de secteurs (" + n + ")."), TR((n - k) / n, "C'est la probabilité de perdre.")] }); },
    ],
    2: [
      () => { const [w, l] = pk([["MATHEMATIQUES", "A"], ["PROBABILITE", "B"], ["ANANAS", "A"], ["PARALLELE", "L"], ["ARITHMETIQUE", "I"], ["SYMETRIQUE", "E"]]), cnt = [...w].filter((c) => c === l).length, voy = pk([0, 1]);
        const v = voy ? [...w].filter((c) => "AEIOUY".includes(c)).length : cnt;
        return QF("On écrit chaque lettre du mot " + w + " sur un carton (" + M(w.length) + " cartons), et on tire un carton au hasard. Quelle est la probabilité d'obtenir " + (voy ? "une voyelle (A, E, I, O, U, Y)" : "la lettre " + l) + " ? (fraction acceptée)", v / w.length,
          M(w.length) + " cartons, tous avec la même chance d'être tirés. " + (voy ? "Voyelles" : "Lettres " + l) + " : " + M(v) + ". " + M("P = \\frac{" + v + "}{" + w.length + "}" + (g2(v, w.length) > 1 ? " = " + F(v / w.length) : "")) + ".",
          { ctx: "lettres-" + (voy ? "voyelle" : "lettre"), guide: [GR("Nombre de cartons ?", w.length, M(w.length) + "."), GR("Cartons favorables ?", v, M(v) + "."), GR("Probabilité ?", v / w.length, M(F(v / w.length)) + ".")],
            traps: [TR(1 / w.length, "Il y a plusieurs cartons favorables : compte-les tous."), TR(voy ? 6 / 26 : 1 / 26, "On tire parmi les lettres du mot, pas dans l'alphabet.")] }); },
      () => { const n = pk([100, 200, 250, 400, 500]), k = R.int(Math.round(n / 8), Math.round(n / 4)), f = rnd(k / n, 6), o = pk([["un dé", "le 6", "de"], ["une roue de loterie", "le secteur rouge", "roue"], ["une punaise", "« pointe en l'air »", "punaise"]]);
        if (f !== Math.round(f * 1000) / 1000) return null;
        return QD("On a lancé " + o[0] + " " + M(n) + " fois et noté les résultats : " + o[1] + " est sorti " + M(k) + " fois. Quelle est la fréquence d'apparition de " + o[1] + " (en écriture décimale) ?", f,
          "Fréquence " + M("= \\frac{" + k + "}{" + n + "} = " + N(f)) + ". Quand on répète l'expérience un grand nombre de fois, la fréquence se rapproche de la probabilité" + (o[2] === "de" ? " (ici " + M("\\frac{1}{6} \\approx 0{,}17") + ")" : "") + ".",
          { ctx: "frequence-" + o[2], guide: [GR("Effectif de " + o[1] + " ?", k, M(k) + "."), GD("Fréquence " + M("\\frac{" + k + "}{" + n + "}") + " en décimal ?", f, M(N(f)) + ".")],
            traps: [TD(n / k, "Fréquence = effectif ÷ nombre total de lancers."), TD(k, "C'est l'effectif ; divise par " + n + ".")] }); },
      () => { const n = pk([20, 25, 40, 50]), p = pk([0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6]), k = rnd(n * p, 6); if (!Number.isInteger(k) || k < 2) return null; const o = pk([["boules", "rouges", "une urne"], ["jetons", "gagnants", "une boîte"], ["cartes", "rouges", "un paquet"]]);
        return QN(o[2][0].toUpperCase() + o[2].slice(1) + " contient " + M(n) + " " + o[0] + ". On en tire un(e) au hasard ; la probabilité d'obtenir un(e) des " + o[0] + " " + o[1] + " vaut " + M(N(p)) + ". Combien y a-t-il de " + o[0] + " " + o[1] + " ?", k,
          M("P = \\frac{\\text{nombre de " + o[0] + " " + o[1] + "}}{" + n + "} = " + N(p)) + ", donc il y en a " + M(N(p) + " \\times " + n + " = " + k) + ".",
          { ctx: "retrouver-effectif", guide: [GD("Calcule " + M(N(p) + " \\times " + n) + ".", k, M(k) + ".")],
            traps: [TD(n / p, "On multiplie le nombre total par la probabilité."), TD(p * 100, "La probabilité n'est pas un nombre d'objets : multiplie-la par " + n + ".")] }); },
    ],
    3: [
      () => { const r = R.int(2, 6), b = r + R.int(2, 6), t = pk([[1, 2], [1, 3], [2, 3]]); let add = null;
        for (let k = 1; k <= 30; k++) if ((r + k) * t[1] === (r + b + k) * t[0]) { add = k; break; }
        if (!add) return null;
        return QN("Une urne contient " + M(r) + " boules rouges et " + M(b) + " boules bleues. Combien de boules rouges faut-il ajouter pour que la probabilité de tirer une rouge soit égale à " + M("\\frac{" + t[0] + "}{" + t[1] + "}") + " ?", add,
          "Avec " + M(add) + " rouges de plus : " + M(r + add) + " rouges sur " + M(r + b + add) + " boules, et " + M("\\frac{" + (r + add) + "}{" + (r + b + add) + "} = \\frac{" + t[0] + "}{" + t[1] + "}") + ".",
          { ctx: "ajouter-" + t.join("-"), fig: FIG.urn({ rouges: r, bleues: b }), guide: [GR("Probabilité de tirer une rouge maintenant ?", r / (r + b), M(F(r / (r + b))) + "."), GR("Nombre de rouges à ajouter ?", add, "On essaie : " + M(r + add) + " rouges sur " + M(r + b + add) + " boules.")],
            traps: [TR(b, "Teste ta réponse : avec ce nombre de rouges en plus, calcule la nouvelle probabilité."), TR(add + 1, "Vérifie : la probabilité dépasse alors " + t[0] + "/" + t[1] + ".")] }); },
      () => { const n = pk([120, 300, 360, 600, 900]), E = pk([["un 6", 1], ["un nombre pair", 3], ["un nombre supérieur ou égal à 5", 2], ["un multiple de 3", 2]]), v = (n * E[1]) / 6;
        return QN("On lance " + M(n) + " fois un dé équilibré à six faces. Environ combien de fois peut-on s'attendre à obtenir " + E[0] + " ?", v,
          M("P = \\frac{" + E[1] + "}{6}") + ". Sur un grand nombre de lancers, la fréquence est proche de la probabilité : environ " + M("\\frac{" + E[1] + "}{6} \\times " + n + " = " + v) + " fois.",
          { ctx: "attendu", guide: [GR("Probabilité d'obtenir " + E[0] + " ?", E[1] / 6, M(F(E[1] / 6)) + "."), GR("Nombre de fois attendu ?", v, M(v) + ".")],
            traps: [TR(n / 6, E[1] > 1 ? "Il y a " + E[1] + " issues favorables sur 6." : "Calcule la probabilité, puis multiplie par " + n + "."), TR(n - v, "C'est le nombre de fois où l'on n'obtient pas " + E[0] + ".")] }); },
      () => { let a, b, c, d; do { b = R.int(5, 12); d = R.int(5, 12); a = R.int(2, b - 2); c = R.int(2, d - 2); } while (b === d || a * d === b * c || Math.abs(a / b - c / d) > 0.15 || g2(a, b) > 1 || g2(c, d) > 1);
        const best = Math.max(a / b, c / d);
        return QF("Sac A : " + M(a) + " billes gagnantes sur " + M(b) + ". Sac B : " + M(c) + " billes gagnantes sur " + M(d) + ". On tire une bille au hasard dans le sac de son choix. Quelle est la plus grande des deux probabilités de gagner ? (fraction)", best,
          M("P_A = \\frac{" + a + "}{" + b + "}") + " et " + M("P_B = \\frac{" + c + "}{" + d + "}") + ". Même dénominateur " + M(b * d) + " : " + M("\\frac{" + a * d + "}{" + b * d + "}") + " et " + M("\\frac{" + c * b + "}{" + b * d + "}") + ". Le sac " + (a / b > c / d ? "A" : "B") + " est le meilleur : " + M(F(best)) + ".",
          { ctx: "comparer-sacs", guide: [GR(M("P_A") + " ?", a / b, M(F(a / b)) + "."), GR(M("P_B") + " ?", c / d, M(F(c / d)) + "."), GR("La plus grande ?", best, M(F(best)) + ".")],
            traps: [TR(a / b > c / d ? c / d : a / b, "Compare les fractions en les mettant au même dénominateur."), TR(a > c ? c / d : a / b, "Le sac qui a le plus de billes gagnantes n'est pas forcément le meilleur : il faut comparer aux nombres totaux.")] }); },
    ],
  };

  // ======================= empil : empilements de cubes, vues (5e.EG.05–06) =======================
  /* h[i][j] : hauteur de la colonne i (gauche → droite), j (avant → arrière) ; perspective cavalière (fuyante 45°, 0,5) */
  const cubesFig = (h, lab) => {
    const nx = h.length, ny = h[0].length, s = 30, k = 0.42 * s, P = (x, y, z) => [x * s + y * k, -z * s - y * k];
    let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity; const H = Math.max(1, ...h.flat());
    for (const x of [0, nx]) for (const y of [0, ny]) for (const z of [0, H]) { const [u, v] = P(x, y, z); mnx = Math.min(mnx, u); mxx = Math.max(mxx, u); mny = Math.min(mny, v); mxy = Math.max(mxy, v); }
    const ox = (320 - (mxx - mnx)) / 2 - mnx, oy = 10 - mny, Q = (x, y, z) => { const [u, v] = P(x, y, z); return [ox + u, oy + v]; };
    let g = "";
    for (let y = ny - 1; y >= 0; y--) for (let x = 0; x < nx; x++) for (let z = 0; z < h[x][y]; z++) {
      g += pg([Q(x, y, z), Q(x + 1, y, z), Q(x + 1, y, z + 1), Q(x, y, z + 1)], "f-shape", ' stroke-width="1.3"');
      g += pg([Q(x, y, z + 1), Q(x + 1, y, z + 1), Q(x + 1, y + 1, z + 1), Q(x, y + 1, z + 1)], "f-shape2", ' stroke-width="1.3"');
      g += pg([Q(x + 1, y, z), Q(x + 1, y + 1, z), Q(x + 1, y + 1, z + 1), Q(x + 1, y, z + 1)], "f-shape", ' style="fill:var(--blue);fill-opacity:.5" stroke-width="1.3"');
    }
    return sv(320, Math.round(mxy - mny + 20), g, lab || "empilement de cubes");
  };
  /* vues : grille de carrés (cases occupées), éventuellement avec des nombres */
  const vueFig = (views) => { const s = 22; let g = "", x0 = 8; const Hm = Math.max(...views.map((v) => v.rows));
    for (const v of views) { for (const [i, j, t] of v.cells) { g += '<rect x="' + (x0 + i * s) + '" y="' + (20 + (Hm - 1 - j) * s) + '" width="' + s + '" height="' + s + '" class="f-shape2"/>'; if (t !== undefined) g += tx(x0 + i * s + s / 2, 20 + (Hm - 1 - j) * s + 16, t, "middle", 13); }
      g += tx(x0 + (v.cols * s) / 2, 14, v.nom, "middle", 12); x0 += v.cols * s + 26; }
    return sv(Math.max(200, x0), 28 + Hm * s, g, "vues de l'empilement"); };
  const heights = (nx, ny, hmax, holes) => { const h = Array.from({ length: nx }, () => Array(ny).fill(0));
    for (let x = 0; x < nx; x++) { let prev = 0; for (let y = 0; y < ny; y++) { const z = holes && y === 0 && R.rand() < 0.25 ? 0 : R.int(Math.max(1, prev), hmax); h[x][y] = z; prev = Math.max(prev, z); } }
    return h; }; /* plus haut (ou égal) vers l'arrière : rien n'est caché */
  const sumH = (h) => h.flat().reduce((a, b) => a + b, 0), faceV = (h) => h.map((c) => Math.max(...c)), sideV = (h) => h[0].map((_, y) => Math.max(...h.map((c) => c[y])));
  const top = (h) => h.flat().filter((z) => z > 0).length;
  const NOTE = " (aucun cube n'est caché : il n'y a pas de trou, chaque cube repose sur la table ou sur un autre cube)";
  const EM = {
    1: [
      () => { const h = heights(pk([2, 3]), 2, 3), n = sumH(h); if (n < 6) return null;
        return QN("Combien de cubes compte cet empilement" + NOTE + " ?", n, "On compte colonne par colonne (hauteur de chaque pile) : " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + ".",
          { ctx: "compter", fig: cubesFig(h), guide: [GR("Combien de cubes dans les piles de devant ?", h.reduce((a, c) => a + c[0], 0), "Hauteurs : " + h.map((c) => c[0]).join(", ") + "."), GR("Nombre total de cubes ?", n, M(n) + ".")],
            traps: [TR(top(h), "Ce sont les piles vues de dessus ; une pile peut avoir plusieurs cubes."), TR(n - h.reduce((a, c) => a + c[0], 0), "N'oublie pas les piles de devant.")] }); },
      () => { const nx = pk([3, 4]), ny = pk([2, 3]), c = []; let n = 0; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const z = R.int(0, 4); if (z) { c.push([i, j, z]); n += z; } } if (c.length < 4 || n < 8) return null;
        return QN("Voici la vue de dessus d'un empilement de cubes : dans chaque case, on a écrit le nombre de cubes empilés. Combien de cubes compte l'empilement ?", n, "On additionne les nombres de la vue de dessus : " + M(c.map((t) => t[2]).join(" + ") + " = " + n) + ".",
          { ctx: "dessus-nombres", fig: vueFig([{ nom: "vue de dessus", cols: nx, rows: ny, cells: c }]), guide: [GR("Combien de piles (cases occupées) ?", c.length, M(c.length) + "."), GR("Nombre de cubes ?", n, M(n) + ".")],
            traps: [TR(c.length, "C'est le nombre de piles ; chaque nombre dit combien de cubes il y a dans la pile.")] }); },
      () => { const h = heights(3, pk([2, 3]), 3, true), t = top(h); if (t < 4) return null;
        return QN("Combien de carrés voit-on sur la vue de dessus de cet empilement" + NOTE + " ?", t, "Vu de dessus, chaque pile donne un seul carré, quelle que soit sa hauteur : " + M(t) + " piles, donc " + M(t) + " carrés.",
          { ctx: "vue-dessus", fig: cubesFig(h), guide: [GR("Combien de piles dans la rangée de devant ?", h.filter((c) => c[0] > 0).length, "Compte les piles de devant."), GR("Carrés de la vue de dessus ?", t, M(t) + ".")],
            traps: [TR(sumH(h), "Vu de dessus, on ne voit que le haut de chaque pile : un carré par pile."), TR(t - h.filter((c) => c[0] > 0).length, "Compte aussi les piles de devant.")] }); },
      () => { const h = heights(3, 2, 3), f = faceV(h), v = f.reduce((a, b) => a + b, 0); if (v === sumH(h)) return null;
        return QN("Combien de carrés voit-on sur la vue de face de cet empilement" + NOTE + " ? (on regarde de devant, sans perspective)", v,
          "De face, on voit dans chaque colonne la pile la plus haute : " + M(f.join(" + ") + " = " + v) + " carrés.",
          { ctx: "vue-face", fig: cubesFig(h), guide: [GR("Hauteur de la pile la plus haute de la colonne de gauche ?", f[0], M(f[0]) + "."), GR("Carrés de la vue de face ?", v, M(v) + ".")],
            traps: [TR(sumH(h), "Les cubes de derrière sont cachés par ceux de devant (ou dépassent au-dessus) : un carré par niveau visible."), TR(h.reduce((a, c) => a + c[0], 0), "Les piles de derrière, plus hautes, dépassent au-dessus de celles de devant.")] }); },
    ],
    2: [
      () => { const h = heights(3, 2, 3), n = sumH(h), H = Math.max(...h.flat()), v = 6 * H - n; if (v < 3) return null;
        return QN("Combien de cubes faut-il ajouter, au minimum, pour compléter cet empilement en un pavé droit de " + M(3) + " cubes de long, " + M(2) + " de profondeur et " + M(H) + " de haut" + NOTE + " ?", v,
          "Le pavé contient " + M("3 \\times 2 \\times " + H + " = " + 6 * H) + " cubes ; l'empilement en a " + M(n) + " : il en manque " + M(6 * H - n) + ".",
          { ctx: "completer-pave", fig: cubesFig(h), guide: [GR("Cubes du pavé ?", 6 * H, M(6 * H) + "."), GR("Cubes de l'empilement ?", n, M(n) + "."), GR("Cubes à ajouter ?", v, M(v) + ".")],
            traps: [TR(6 * H, "C'est le nombre de cubes du pavé ; retire ceux qui sont déjà là."), TR(n, "C'est l'empilement ; on demande ce qui manque.")] }); },
      () => { const h = heights(pk([2, 3]), 3, 3), s = sideV(h), v = s.reduce((a, b) => a + b, 0); if (v === sumH(h)) return null;
        return QN("Combien de carrés voit-on sur la vue de droite de cet empilement" + NOTE + " ? (on regarde depuis la droite, sans perspective)", v,
          "Depuis la droite, chaque rangée (de l'avant vers l'arrière) montre sa pile la plus haute : " + M(s.join(" + ") + " = " + v) + " carrés.",
          { ctx: "vue-droite", fig: cubesFig(h), guide: [GR("Hauteur maximale dans la rangée de devant ?", s[0], M(s[0]) + "."), GR("Carrés de la vue de droite ?", v, M(v) + ".")],
            traps: [TR(sumH(h), "Les piles alignées se cachent : un carré par niveau visible dans chaque rangée."), TR(faceV(h).reduce((a, b) => a + b, 0), "Ça, c'est la vue de face.")] }); },
      () => { const h = heights(3, 3, 4), n = sumH(h); if (n < 12) return null;
        return QN("Combien de cubes compte cet empilement" + NOTE + " ?", n, "Colonne par colonne : " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + ".",
          { ctx: "compter-grand", fig: cubesFig(h), guide: [GR("Cubes de la rangée de devant ?", h.reduce((a, c) => a + c[0], 0), "Hauteurs " + h.map((c) => c[0]).join(", ") + "."), GR("Cubes de la rangée du milieu ?", h.reduce((a, c) => a + c[1], 0), "Hauteurs " + h.map((c) => c[1]).join(", ") + "."), GR("Nombre total ?", n, M(n) + ".")],
            traps: [TR(top(h) + Math.max(...h.flat()) - 1, "Compte les cubes de chaque pile, y compris ceux du bas, cachés derrière."), TR(sumH(h.map((c) => c.slice(1))), "N'oublie pas la rangée de devant.")] }); },
    ],
    3: [
      () => { let h, n, mx; for (let t = 0; t < 30; t++) { h = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => R.int(0, 3))); n = sumH(h); const f = faceV(h), s = sideV(h); mx = h.reduce((a, c, x) => a + c.reduce((b, z, y) => b + (z ? Math.min(f[x], s[y]) : 0), 0), 0); if (mx > n && top(h) >= 5 && f.every((z) => z) && s.every((z) => z)) break; mx = null; }
        if (!mx) return null; const f = faceV(h), s = sideV(h), cells = []; h.forEach((c, x) => c.forEach((z, y) => { if (z) cells.push([x, y]); }));
        return QN("Un empilement de cubes (sans trou) a les trois vues ci-dessous. Quel est le plus grand nombre de cubes qu'il peut contenir ?", mx,
          "Sur chaque case de la vue de dessus, la pile ne peut pas dépasser la hauteur de sa colonne (vue de face) ni celle de sa rangée (vue de droite) : on prend la plus petite des deux et on additionne : " + M(mx) + " cubes.",
          { ctx: "trois-vues", fig: vueFig([{ nom: "dessus", cols: 3, rows: 3, cells }, { nom: "face", cols: 3, rows: Math.max(...f), cells: f.flatMap((z, x) => Array.from({ length: z }, (_, k) => [x, k])) }, { nom: "droite", cols: 3, rows: Math.max(...s), cells: s.flatMap((z, y) => Array.from({ length: z }, (_, k) => [y, k])) }].map((v) => Object.assign(v, { rows: 3 }))),
            guide: [GR("Combien de piles (vue de dessus) ?", cells.length, M(cells.length) + "."), GR("Nombre maximal de cubes ?", mx, M(mx) + ".")],
            traps: [TR(cells.length, "C'est le nombre de piles ; certaines peuvent être hautes."), TR(9 * 3, "Les piles sont limitées par la vue de face ET par la vue de droite, et seulement sur les cases de la vue de dessus.")] }); },
      () => { const w = pk([1, 2, 3]), n0 = pk([3, 4]), n = R.int(6, 10), v = (w * n * (n + 1)) / 2, hh = Array.from({ length: n0 }, (_, i) => Array(w).fill(n0 - i)).reverse();
        return QN("On construit un escalier en cubes, de " + M(w) + " cube" + (w > 1 ? "s" : "") + " de large : la 1re marche a 1 cube de haut, la 2e en a 2, et ainsi de suite (la figure montre un escalier de " + M(n0) + " marches). Combien de cubes faut-il pour un escalier de " + M(n) + " marches ?", v,
          "La marche numéro " + M("k") + " compte " + M(w + " \\times k") + " cube" + (w > 1 ? "s" : "") + " : " + M((w > 1 ? w + " \\times " : "") + "(1 + 2 + \\dots + " + n + ") = " + (w > 1 ? w + " \\times " : "") + (n * (n + 1)) / 2 + (w > 1 ? " = " + v : "")) + ".",
          { ctx: "escalier", fig: cubesFig(hh.map((c) => c.slice()), "escalier de cubes"), guide: [GR("Somme " + M("1 + 2 + \\dots + " + n) + " ?", (n * (n + 1)) / 2, M((n * (n + 1)) / 2) + "."), GR("Nombre de cubes ?", v, M(v) + ".")],
            traps: [TR(w * n * n, "Toutes les marches n'ont pas " + n + " cubes de haut : la 1re en a 1, la 2e 2…"), TR(w * n, "Chaque marche a plusieurs cubes : additionne les hauteurs.")] }); },
      () => { const h = heights(3, 3, 3), n = sumH(h), v = 27 - n; if (v < 4 || n < 8) return null;
        return QN("Combien de cubes faut-il ajouter, au minimum, pour transformer cet empilement en un grand cube de " + M(3) + " cubes d'arête" + NOTE + " ?", v,
          "Le grand cube contient " + M("3 \\times 3 \\times 3 = 27") + " petits cubes. L'empilement en a " + M(h.flat().filter((z) => z).join(" + ") + " = " + n) + " : il en manque " + M(v) + ".",
          { ctx: "completer-cube", fig: cubesFig(h), guide: [GR("Petits cubes du grand cube ?", 27, M("3^3 = 27") + "."), GR("Cubes de l'empilement ?", n, M(n) + "."), GR("Cubes à ajouter ?", v, M(v) + ".")],
            traps: [TR(9 - top(h) > 1 ? 9 - top(h) : v + 9, "Il faut compléter chaque pile jusqu'à 3 cubes de haut, pas seulement les cases vides."), TR(n, "C'est l'empilement ; on demande ce qui manque pour arriver à 27.")] }); },
    ],
  };

  // ======================= compdiff : comparer par différence ou quotient (2nde.AU.01, NC.10) =======================
  const CD = {
    1: [
      () => { let a, b, c, d, k; for (let t = 0; t < 60; t++) { b = R.int(5, 12); d = R.int(b + 1, 16); a = R.int(2, b - 1); c = Math.round((a * d) / b); k = a * d - c * b; if (k && Math.abs(k) <= 3 && g2(a, b) === 1 && g2(c, d) === 1 && c > 1) break; k = 0; } if (!k) return null;
        const v = k / (b * d);
        return QF("Pour comparer " + M("A = \\frac{" + a + "}{" + b + "}") + " et " + M("B = \\frac{" + c + "}{" + d + "}") + ", on calcule " + M("A - B") + ". Donne " + M("A - B") + " sous forme de fraction.", v,
          M("A - B = \\frac{" + a * d + "}{" + b * d + "} - \\frac{" + c * b + "}{" + b * d + "} = " + F(v)) + ". " + (v > 0 ? M("A - B > 0") + ", donc " + M("A > B") : M("A - B < 0") + ", donc " + M("A < B")) + ".",
          { ctx: "diff-fractions", guide: [GR("Dénominateur commun (produit des dénominateurs) ?", b * d, M(b + " \\times " + d + " = " + b * d) + "."), GR("Numérateur de " + M("A - B") + " ?", k, M(a * d + " - " + c * b + " = " + k) + "."), GR(M("A - B") + " ?", v, M(F(v)) + ".")],
            traps: [TR((a - c) / (b - d), "On ne soustrait pas numérateurs et dénominateurs : mets au même dénominateur."), TR(-v, "C'est B − A : attention à l'ordre.")] }); },
      () => { const [p, q, u, e1, e2] = pk([[2, 4, 2, 5, 9], [2, 4, 2, 6, 10], [2, 8, 3, 3, 7], [3, 9, 2, 4, 6], [3, 9, 2, 3, 7], [5, 25, 2, 3, 5], [2, 8, 3, 4, 10], [3, 27, 3, 2, 8]]), ex = u * e1 - e2, v = p ** ex; if (!ex) return null;
        return QF("Pour comparer les nombres positifs " + M("A = " + q + "^{" + e1 + "}") + " et " + M("B = " + p + "^{" + e2 + "}") + ", on calcule " + M("\\frac{A}{B}") + ". Que vaut ce quotient ? (fraction ou entier)", v,
          M(q + " = " + p + "^{" + u + "}") + ", donc " + M("A = " + p + "^{" + u * e1 + "}") + " et " + M("\\frac{A}{B} = " + p + "^{" + u * e1 + " - " + e2 + "} = " + p + "^{" + ex + "} = " + F(v)) + ". " + (v > 1 ? "Quotient > 1 : " + M("A > B") : "Quotient < 1 : " + M("A < B")) + ".",
          { ctx: "quotient-puissances", guide: [GR(M(q) + " s'écrit " + M(p + "^k") + " : " + M("k") + " = ?", u, M(q + " = " + p + "^{" + u + "}") + "."), GR("Exposant de " + M(p) + " dans " + M("\\frac{A}{B}") + " ?", ex, M(u * e1 + " - " + e2 + " = " + ex) + "."), GR(M("\\frac{A}{B}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(p ** (e1 - e2), "Écris d'abord " + q + " comme une puissance de " + p + "."), TR(1 / v, "C'est B ÷ A.")] }); },
      () => { const a = nz(-6, 7), c = R.int(-20, 30), k = a * a - c; if (Math.abs(k) < 2 || Math.abs(a) < 2 || !c) return null;
        return QN("Pour tout réel " + M("x") + ", on compare " + M("A = (x" + sg(a) + ")^2") + " et " + M("B = x^2" + sg(2 * a) + "x" + sg(c)) + " en calculant " + M("A - B") + ". Que vaut " + M("A - B") + " ?", k,
          M("A = x^2" + sg(2 * a) + "x" + sg(a * a)) + ", donc " + M("A - B = " + a * a + " - " + NP(c) + " = " + k) + " : " + (k > 0 ? M("A > B") : M("A < B")) + " pour tout " + M("x") + ".",
          { ctx: "diff-identite", guide: [GR("Terme constant de " + M("A") + " développé ?", a * a, M(NP(a) + "^2 = " + a * a) + "."), GR(M("A - B") + " ?", k, M(k) + ".")],
            traps: [TR(a - c, "Développe (x " + (a > 0 ? "+ " : "− ") + Math.abs(a) + ")² : le terme constant est " + a * a + "."), TR(-k, "C'est B − A.")] }); },
    ],
    2: [
      () => { const r = pk([1.2, 1.25, 1.5, 0.8, 0.75, 1.15, 0.85, 1.4, 0.6]), o = pk([["Une ville A compte", "habitants, une ville B en compte", "habitants", 2000, "villes"], ["Une entreprise A a vendu", "téléphones, une entreprise B en a vendu", "téléphones", 500, "ventes"], ["Un site A a reçu", "visites, un site B en a reçu", "visites", 1000, "visites"]]), B = o[3] * R.int(12, 60), A = rnd(B * r, 6); if (!Number.isInteger(A)) return null;
        return QD(o[0] + " " + M(N(A)) + " " + o[1] + " " + M(N(B)) + ". Pour comparer, on calcule le quotient " + M("\\frac{A}{B}") + " (écriture décimale).", r,
          M("\\frac{" + N(A) + "}{" + N(B) + "} = " + N(r)) + " : " + (r > 1 ? "A a " + M(N(rnd((r - 1) * 100, 6)) + "\\,\\%") + " de plus que B" : "A a " + M(N(rnd((1 - r) * 100, 6)) + "\\,\\%") + " de moins que B") + ".",
          { ctx: "quotient-" + o[4], guide: [GD(M("\\frac{A}{B}") + " ?", r, M(N(r)) + ".")],
            traps: [TD(1 / r, "C'est B ÷ A : on demande A ÷ B."), TD(A - B, "C'est la différence ; on demande le quotient.")] }); },
      () => { const a = R.int(3, 8);
        return QN("Pour tout réel " + M("x") + ", on compare " + M("A = x^2 + " + a * a) + " et " + M("B = " + 2 * a + "x") + ". On obtient " + M("A - B = (x - k)^2") + ". Que vaut " + M("k") + " ? (" + M("A - B") + " est un carré : " + M("A \\geqslant B") + ", avec égalité pour " + M("x = k") + ".)", a,
          M("A - B = x^2 - " + 2 * a + "x + " + a * a + " = (x - " + a + ")^2 \\geqslant 0") + " : " + M("k = " + a) + ". " + M("A \\geqslant B") + " pour tout " + M("x") + ", et " + M("A = B") + " seulement pour " + M("x = " + a) + ".",
          { ctx: "diff-carre", guide: [GX("Écris " + M("A - B") + " (développé).", "x^2-" + 2 * a + "*x+" + a * a, M("x^2 - " + 2 * a + "x + " + a * a) + "."), GR(M("k") + " ?", a, M("(x - " + a + ")^2 = x^2 - " + 2 * a + "x + " + a * a) + ".")],
            traps: [TR(a * a, "Dans (x − k)², le terme constant est k² = " + a * a + " : k = " + a + "."), TR(2 * a, "Le double produit vaut 2k = " + 2 * a + " : k = " + a + ".")] }); },
      () => { const [a, b] = pk([[2, 8], [3, 12], [2, 18], [5, 20], [3, 27], [8, 18], [6, 24]]), v = 2 * Math.sqrt(a * b);
        return QN("On compare les nombres positifs " + M("A = \\sqrt{" + a + "} + \\sqrt{" + b + "}") + " et " + M("B = \\sqrt{" + (a + b) + "}") + " par leurs carrés. Que vaut " + M("A^2 - B^2") + " ?", v,
          M("A^2 = " + a + " + 2\\sqrt{" + a * b + "} + " + b + " = " + (a + b) + " + " + v) + " et " + M("B^2 = " + (a + b)) + " : " + M("A^2 - B^2 = " + v + " > 0") + ". " + M("A") + " et " + M("B") + " sont positifs, donc " + M("A > B") + ".",
          { ctx: "racines-carres", guide: [GR(M("\\sqrt{" + a + "} \\times \\sqrt{" + b + "}") + " ?", Math.sqrt(a * b), M("\\sqrt{" + a * b + "} = " + Math.sqrt(a * b)) + "."), GR(M("A^2 - B^2") + " ?", v, M("2 \\times " + Math.sqrt(a * b) + " = " + v) + ".")],
            traps: [TR(Math.sqrt(a * b), "(√a + √b)² = a + 2√a√b + b : il y a un double produit."), TR(a + b, "On n'a pas (√a + √b)² = a + b.")] }); },
    ],
    3: [
      () => { const [t1, t2] = pk([[30, 20], [20, 30], [25, 25], [50, 40], [40, 25], [10, 20], [60, 50], [15, 10]]), q = rnd((1 + t1 / 100) * (1 - t2 / 100), 6); if (q === 1) return null; const o = pk(["Un prix", "Le loyer d'un local", "Le nombre d'abonnés d'un club"]);
        return QD(o + " augmente de " + M(t1 + "\\,\\%") + ", puis baisse de " + M(t2 + "\\,\\%") + ". On compare la valeur finale " + M("V_f") + " à la valeur de départ " + M("V_0") + " par le quotient " + M("\\frac{V_f}{V_0}") + ". Que vaut-il ?", q,
          M("\\frac{V_f}{V_0} = " + N(1 + t1 / 100) + " \\times " + N(1 - t2 / 100) + " = " + N(q)) + (q > 1 ? " > 1 : la valeur a augmenté de " : " < 1 : la valeur a baissé de ") + M(N(rnd(Math.abs(q - 1) * 100, 6)) + "\\,\\%") + ".",
          { ctx: "evolutions", guide: [GD("Coefficient de la hausse ?", 1 + t1 / 100, M(N(1 + t1 / 100))), GD("Coefficient de la baisse ?", 1 - t2 / 100, M(N(1 - t2 / 100))), GD(M("\\frac{V_f}{V_0}") + " ?", q, M(N(q)) + ".")],
            traps: [TD(1 + (t1 - t2) / 100, "Les pourcentages ne s'ajoutent pas : on multiplie les coefficients."), TD(q * 100, "Le quotient est un nombre sans unité, proche de 1.")] }); },
      () => { const [p, r] = pk([[1, 2], [2, 1], [1, 3], [3, 1], [2, 2], [2, 3], [3, 2], [3, 3]]), q = p + r, k = p * r;
        return QN("Pour tout entier " + M("n \\geqslant 1") + ", on compare " + M("A = \\frac{n + " + p + "}{n}") + " et " + M("B = \\frac{n + " + q + "}{n + " + r + "}") + ". On obtient " + M("A - B = \\frac{k}{n(n + " + r + ")}") + ". Que vaut " + M("k") + " ?", k,
          "Même dénominateur " + M("n(n + " + r + ")") + " : numérateur " + M("(n + " + p + ")(n + " + r + ") - n(n + " + q + ") = n^2 + " + q + "n + " + k + " - n^2 - " + q + "n = " + k) + ". " + M("A - B > 0") + " : " + M("A > B") + " pour tout " + M("n") + ".",
          { ctx: "diff-fractions-n", guide: [GX("Développe " + M("(n + " + p + ")(n + " + r + ")") + ".", "n^2+" + q + "*n+" + k, M("n^2 + " + q + "n + " + k) + "."), GR(M("k") + " ?", k, M(k) + ".")],
            traps: [TR(p - q + r === 0 ? q : p + r, "Développe (n + " + p + ")(n + " + r + ") : le terme constant est " + p + " × " + r + "."), TR(-k, "On calcule A − B, pas B − A.")] }); },
      () => { const [a, b, q, k, ka, kb] = pk([[2, 3, "\\frac{32}{27}", 20, 5, 3], [2, 3, "\\frac{8}{9}", 10, 3, 2], [5, 2, "\\frac{125}{128}", 10, 3, 7], [3, 2, "\\frac{9}{8}", 20, 2, 3], [7, 2, "\\frac{49}{64}", 15, 2, 6]]), v = a ** ka / b ** kb;
        return QF("On compare " + M("A = " + a + "^{" + ka * k + "}") + " et " + M("B = " + b + "^{" + kb * k + "}") + " : " + M("\\frac{A}{B} = q^{" + k + "}") + ". Quelle est la fraction " + M("q") + " ? (puis compare-la à 1)", v,
          M("A = (" + a + "^{" + ka + "})^{" + k + "}") + " et " + M("B = (" + b + "^{" + kb + "})^{" + k + "}") + ", donc " + M("\\frac{A}{B} = \\left(\\frac{" + a ** ka + "}{" + b ** kb + "}\\right)^{" + k + "}") + ". " + M("q = " + q) + (v > 1 ? " > 1, donc " + M("A > B") : " < 1, donc " + M("A < B")) + ".",
          { ctx: "grandes-puissances", guide: [GR(M(a + "^{" + ka + "}") + " ?", a ** ka, M(a ** ka) + "."), GR(M(b + "^{" + kb + "}") + " ?", b ** kb, M(b ** kb) + "."), GR(M("q") + " ?", v, M(q) + ".")],
            traps: [TR(1 / v, "C'est B ÷ A."), TR(rnd(a / b, 9), "Regroupe les exposants : " + a + "^" + ka * k + " = (" + a + "^" + ka + ")^" + k + ".")] }); },
    ],
  };

  // ======================= posrelc : position relative de deux courbes (1re.AN.09) =======================
  const plot2 = (f, g, xr, yr, lab) => FIG.plot([{ f }, { f: g, cls: "f-blue" }], [], { xr, yr, numbers: true, label: lab });
  const lr = (a, b) => (a === 1 ? "x" : a === -1 ? "-x" : N(a) + "x") + (b ? sg(b) : "");
  const PC = {
    1: [
      () => { const a = R.int(-4, 4), b = R.int(-6, 6), c = a + nz(-4, 4), d = R.int(-8, 8), m = a - c, r = (d - b) / m; if (!Number.isInteger(r * 2) || !r) return null;
        const ivs = m > 0 ? [[r, false, Infinity, false]] : [[-Infinity, false, r, false]];
        return QS("Soit " + M("f(x) = x^2" + (a ? sg(a) + "x" : "") + (b ? sg(b) : "")) + " et " + M("g(x) = x^2" + (c ? sg(c) + "x" : "") + (d ? sg(d) : "")) + ". Sur quel intervalle la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
          M("f(x) - g(x) = " + lr(m, b - d)) + ". " + M("f(x) - g(x) > 0 \\iff x " + (m > 0 ? ">" : "<") + " " + F(r)) + " (on divise par " + M(N(m)) + (m < 0 ? ", négatif : le sens change" : "") + ").",
          { ctx: "affine-diff", guide: [GX(M("f(x) - g(x)") + " ?", (m === 1 ? "" : m === -1 ? "-" : m + "*") + "x" + (b - d < 0 ? "-" + (d - b) : b - d ? "+" + (b - d) : ""), M(lr(m, b - d)) + "."), GR("Valeur qui annule " + M("f(x) - g(x)") + " ?", r, M(F(r)) + "."), { ask: "Intervalle ?", spec: solsetSpec(ivs), sol: M(m > 0 ? "]" + F(r) + " \\,;\\, +\\infty[" : "]-\\infty \\,;\\, " + F(r) + "[") + "." }],
            traps: [TS(m > 0 ? [[-Infinity, false, r, false]] : [[r, false, Infinity, false]], m < 0 ? "En divisant par un nombre négatif, le sens de l'inégalité change." : "C'est là où C_f est au-dessous.")] }); },
      () => { const a = R.int(-3, 3), b = R.int(-6, 6), m = nz(-4, 4), r = nz(-5, 5), c = a - m, d = b + m * r;
        return QN("Les courbes de " + M("f(x) = 2x^2" + (a ? sg(a) + "x" : "") + (b ? sg(b) : "")) + " et " + M("g(x) = 2x^2" + (c ? sg(c) + "x" : "") + (d ? sg(d) : "")) + " se coupent en un seul point. Quelle est son abscisse ?", r,
          M("f(x) = g(x) \\iff f(x) - g(x) = 0 \\iff " + lr(m, b - d) + " = 0 \\iff x = " + r) + ".",
          { ctx: "intersection", guide: [GR("Coefficient de " + M("x") + " dans " + M("f(x) - g(x)") + " ?", m, M(a + " - " + NP(c) + " = " + m) + "."), GR("Abscisse ?", r, M("x = " + r) + ".")],
            traps: [TR(-r, "Résous " + m + "x " + (b - d < 0 ? "− " + (d - b) : "+ " + (b - d)) + " = 0 avec soin (signe)."), TR(b - d, "Il faut diviser par le coefficient de x.")] }); },
      () => { const a = pk([3, 4, 5, 6, -3, -4]);
        return QN("Soit " + M("f(x) = x^2 + " + a * a) + " et " + M("g(x) = " + 2 * a + "x") + ". On a " + M("f(x) - g(x) = (x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2 \\geqslant 0") + " : la courbe de " + M("f") + " est au-dessus de celle de " + M("g") + ". En quelle abscisse se touchent-elles ?", a,
          M("f(x) - g(x) = (x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2") + " s'annule seulement en " + M("x = " + a) + " : les courbes se touchent en ce point (la droite est tangente à la parabole) ; partout ailleurs, " + M("C_f") + " est strictement au-dessus.",
          { ctx: "contact", fig: plot2((x) => x * x + a * a, (x) => 2 * a * x, a > 0 ? [-2, a + 3] : [a - 3, 2], [-2, a * a * 2 + 4], "parabole et droite tangente"), guide: [GR("Valeur qui annule " + M("(x " + (a > 0 ? "-" : "+") + " " + Math.abs(a) + ")^2") + " ?", a, M(a) + ".")],
            traps: [TR(-a, "(x − k)² s'annule pour x = k : attention au signe."), TR(a * a, "C'est la valeur de f(x) − g(x) en 0, pas une abscisse de contact.")] }); },
    ],
    2: [
      () => { const [r1, r2] = pk([[-1, 3], [-2, 1], [1, 4], [-3, 2], [0.5, 3], [-1, 2], [2, 5]]), s = r1 + r2, p = r1 * r2;
        return QS("Sur quel intervalle la parabole " + M("y = x^2") + " est-elle strictement au-dessous de la droite " + M("y = " + lr(s, -p)) + " ?", [[r1, false, r2, false]],
          M("x^2 - (" + lr(s, -p) + ") = x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "") + " = (x" + sg(-r1) + ")(x" + sg(-r2) + ")") + " : négatif entre les racines " + M(F(r1)) + " et " + M(F(r2)) + ". La parabole est au-dessous de la droite sur " + M("]" + F(r1) + " \\,;\\, " + F(r2) + "[") + ".",
          { ctx: "parabole-droite", fig: plot2((x) => x * x, (x) => s * x - p, [Math.min(r1, 0) - 2, Math.max(r2, 0) + 2], [-3, Math.max(r1 * r1, r2 * r2) + 3], "parabole et droite"), guide: [GSet2("Racines de " + M("x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "")) + " ?", [r1, r2]), { ask: "Intervalle ?", spec: solsetSpec([[r1, false, r2, false]]), sol: M("]" + F(r1) + " \\,;\\, " + F(r2) + "[") + "." }],
            traps: [TS([[-Infinity, false, r1, false], [r2, false, Infinity, false]], "C'est là où la parabole est au-dessus : un trinôme (a > 0) est négatif entre ses racines.")] }); },
      () => { const [r1, r2] = pk([[-2, 3], [-1, 4], [1, 3], [-4, -1], [-3, 2], [2, 6]]), s = r1 + r2, p = r1 * r2, b = R.int(-3, 3), c = R.int(-4, 4);
        const ivs = [[-Infinity, false, r1, false], [r2, false, Infinity, false]];
        return QS("Soit " + M("f(x) = 2x^2" + (b - s ? sg(b - s) + "x" : "") + (c + p ? sg(c + p) : "")) + " et " + M("g(x) = x^2" + (b ? sg(b) + "x" : "") + (c ? sg(c) : "")) + ". Sur quel ensemble la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
          M("f(x) - g(x) = x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "") + " = (x" + sg(-r1) + ")(x" + sg(-r2) + ")") + ", positif à l'extérieur des racines : " + M("]-\\infty \\,;\\, " + r1 + "[ \\cup ]" + r2 + " \\,;\\, +\\infty[") + ".",
          { ctx: "deux-paraboles", guide: [GX(M("f(x) - g(x)") + " ?", "x^2" + (s ? (-s > 0 ? "+" : "") + -s + "*x" : "") + (p ? (p > 0 ? "+" : "") + p : ""), M("x^2" + (s ? sg(-s) + "x" : "") + (p ? sg(p) : "")) + "."), GSet2("Racines ?", [r1, r2]), { ask: "Ensemble ?", spec: solsetSpec(ivs), sol: M("]-\\infty \\,;\\, " + r1 + "[ \\cup ]" + r2 + " \\,;\\, +\\infty[") + "." }],
            traps: [TS([[r1, false, r2, false]], "Entre les racines, f − g est négatif : C_f y est au-dessous.")] }); },
      () => { const k = pk([2, 3, 4, 1.5, 2.5]), m = rnd(k - k * Math.log(k), 9);
        return QR("On étudie la position de la courbe de " + M("x \\mapsto e^x") + " par rapport à la droite " + M("y = " + N(k) + "x") + " avec " + M("h(x) = e^x - " + N(k) + "x") + ". Quel est le minimum de " + M("h") + " sur " + M("\\mathbb{R}") + " ? (au centième)", m, 0.01,
          M("h'(x) = e^x - " + N(k)) + ", nulle en " + M("x = \\ln " + N(k)) + " (négative avant, positive après) : minimum " + M("h(\\ln " + N(k) + ") = " + N(k) + " - " + N(k) + "\\ln " + N(k) + " \\approx " + N(rnd(m, 2))) + ". " + (m > 0 ? "Il est positif : la courbe est toujours au-dessus de la droite." : "Il est négatif : la courbe passe au-dessous de la droite autour de " + M("\\ln " + N(k)) + "."),
          { ctx: "exp-droite", guide: [GR("Abscisse du minimum (" + M("h'(x) = 0") + ", au centième) ?", Math.log(k), M("\\ln " + N(k) + " \\approx " + N(rnd(Math.log(k), 2))) + ".", 0.01), GR("Minimum (au centième) ?", m, M("\\approx " + N(rnd(m, 2))) + ".", 0.01)],
            traps: [TR(rnd(1 - k * Math.log(k), 9), "h(ln k) = e^(ln k) − k ln k = k − k ln k : e^(ln k) vaut k, pas 1."), TR(rnd(Math.log(k), 9), "C'est l'abscisse du minimum ; on demande sa valeur.")] }); },
    ],
    3: [
      () => { const a = pk([2, 3, -2, -3]);
        return QN("La tangente à la courbe de " + M("f(x) = x^3") + " au point d'abscisse " + M(a) + " a pour équation " + M("y = " + 3 * a * a + "x" + sg(-2 * a ** 3)) + ". En quelle autre abscisse la tangente recoupe-t-elle la courbe ? (On étudie " + M("d(x) = x^3 - " + 3 * a * a + "x" + sg(2 * a ** 3)) + ", dont " + M(a) + " est racine double.)", -2 * a,
          M("(x" + sg(-a) + ")^2(x" + sg(2 * a) + ") = 0 \\iff x = " + a + " \\text{ ou } x = " + -2 * a) + ". En " + M(a) + ", c'est le point de contact ; l'autre point commun est en " + M(-2 * a) + ". Le signe de " + M("x" + sg(2 * a)) + " donne la position : courbe au-dessus de la tangente pour " + M("x > " + -2 * a) + ".",
          { ctx: "tangente-recoupe", fig: plot2((x) => x ** 3, (x) => 3 * a * a * x - 2 * a ** 3, [-Math.abs(2 * a) - 1, Math.abs(2 * a) + 1], [-30, 30], "cubique et tangente"), guide: [GX("Factorise " + M("d(x)") + " sous la forme " + M("(x" + sg(-a) + ")^2(x + c)") + " : écris " + M("d(x)") + " factorisé.", "(x" + (a > 0 ? "-" : "+") + Math.abs(a) + ")^2*(x" + (2 * a > 0 ? "+" : "-") + Math.abs(2 * a) + ")", M("(x" + sg(-a) + ")^2(x" + sg(2 * a) + ")") + " (le terme constant donne " + M("a^2 c = " + 2 * a ** 3) + ")."), GR("Autre abscisse ?", -2 * a, M(-2 * a) + ".")],
            traps: [TR(a, "C'est le point de contact ; on cherche l'autre point commun."), TR(2 * a, "x " + (2 * a > 0 ? "+ " : "− ") + Math.abs(2 * a) + " = 0 donne x = " + -2 * a + ".")] }); },
      () => { const p = nz(-4, 4), q = R.int(p * p + 2, p * p + 12), mx = q - p * p;
        return QS("Pour quelles valeurs du réel " + M("m") + " la droite " + M("y = m") + " est-elle strictement au-dessous de la parabole " + M("y = x^2" + sg(-2 * p) + "x" + sg(q)) + " pour tout réel " + M("x") + " ?", [[-Infinity, false, mx, false]],
          M("x^2" + sg(-2 * p) + "x" + sg(q) + " = (x" + sg(-p) + ")^2 + " + mx) + " : la parabole a pour minimum " + M(mx) + " (en " + M("x = " + p) + "). La droite est au-dessous partout si " + M("m < " + mx) + ".",
          { ctx: "parametre-m", guide: [GR("Abscisse du sommet ?", p, M("\\frac{" + 2 * p + "}{2} = " + p) + "."), GR("Minimum de la parabole ?", mx, M(mx) + "."), { ask: "Valeurs de " + M("m") + " ?", spec: solsetSpec([[-Infinity, false, mx, false]]), sol: M("m < " + mx) + "." }],
            traps: [TS([[-Infinity, false, mx, true]], "Pour m = " + mx + ", la droite touche la parabole : « strictement au-dessous » exclut ce cas."), TS([[-Infinity, false, q, false]], "Le minimum de la parabole n'est pas " + q + " (valeur en 0) : cherche le sommet.")] }); },
      () => { const r = R.int(2, 4), c = R.int(-3, 3), d = R.int(-5, 5), ivs = [[-r, false, 0, false], [r, false, Infinity, false]];
        return QS("Soit " + M("f(x) = x^3" + (c ? sg(c) + "x^2" : "") + (d ? sg(d) : "")) + " et " + M("g(x) = " + (c ? co(c, "x^2") + " + " : "") + r * r + "x" + (d ? sg(d) : "")) + ". Sur quel ensemble la courbe de " + M("f") + " est-elle strictement au-dessus de celle de " + M("g") + " ?", ivs,
          M("f(x) - g(x) = x^3 - " + r * r + "x = x(x - " + r + ")(x + " + r + ")") + ". Tableau de signes : positif sur " + M("]-" + r + " \\,;\\, 0[ \\cup ]" + r + " \\,;\\, +\\infty[") + ".",
          { ctx: "cubique-signe", guide: [GX(M("f(x) - g(x)") + " ?", "x^3-" + r * r + "*x", M("x^3 - " + r * r + "x") + "."), GSet2("Valeurs qui l'annulent ?", [-r, 0, r]), { ask: "Ensemble ?", spec: solsetSpec(ivs), sol: M("]-" + r + " \\,;\\, 0[ \\cup ]" + r + " \\,;\\, +\\infty[") + "." }],
            traps: [TS([[r, false, Infinity, false]], "x³ − " + r * r + "x = x(x² − " + r * r + ") : trois racines, fais un tableau de signes."), TS([[-Infinity, false, -r, false], [0, false, r, false]], "C'est là où C_f est au-dessous.")] }); },
    ],
  };
  function GSet2(ask, vals) { return { ask, spec: { kind: "set", values: [...new Set(vals)] }, sol: vals.map((v) => M(F(v))).join(" ; ") + "." }; }

  // ======================= intmaj : majorer, encadrer une intégrale (Tle.AN.24) =======================
  const IM = {
    1: [
      () => { const a = R.int(-2, 3), b = a + R.int(2, 5), m = R.int(1, 4), Mx = m + R.int(2, 5), up = R.rand() < 0.5, v = (up ? Mx : m) * (b - a);
        return QN("Une fonction " + M("f") + " continue vérifie " + M(m + " \\leqslant f(x) \\leqslant " + Mx) + " pour tout " + M("x \\in [" + a + " \\,;\\, " + b + "]") + ". Quel " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " obtient-on en intégrant cet encadrement ?", v,
          "Par positivité de l'intégrale (croissance) : " + M(m + "(" + b + " - " + NP(a) + ") \\leqslant \\int_{" + a + "}^{" + b + "} f(x)\\,dx \\leqslant " + Mx + "(" + b + " - " + NP(a) + ")") + ", soit " + M((m * (b - a)) + " \\leqslant I \\leqslant " + Mx * (b - a)) + ".",
          { ctx: "encadrement-" + (up ? "max" : "min"), guide: [GR("Longueur de l'intervalle ?", b - a, M(b + " - " + NP(a) + " = " + (b - a)) + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(v) + ".")],
            traps: [TR(up ? Mx : m, "On intègre la constante sur l'intervalle : on multiplie par sa longueur " + (b - a) + "."), TR((up ? m : Mx) * (b - a), up ? "C'est le minorant." : "C'est le majorant.")] }); },
      () => { const [fx, f, a, b, fa, fb, nm] = pk([["\\sqrt{x^2 + 9}", (x) => Math.sqrt(x * x + 9), 0, 4, 3, 5, "rac9"], ["\\sqrt{x^2 + 16}", (x) => Math.sqrt(x * x + 16), 0, 3, 4, 5, "rac16"], ["\\sqrt{x^2 + 36}", (x) => Math.sqrt(x * x + 36), 0, 8, 6, 10, "rac36"], ["\\frac{12}{x + 2}", (x) => 12 / (x + 2), 1, 4, 4, 2, "inverse"], ["\\sqrt{x^2 + 25}", (x) => Math.sqrt(x * x + 25), 0, 12, 5, 13, "rac25"]]), up = R.rand() < 0.5, mn = Math.min(fa, fb), mx = Math.max(fa, fb), v = (up ? mx : mn) * (b - a);
        return QN("La fonction " + M("f(x) = " + fx) + " est " + (fa < fb ? "croissante" : "décroissante") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + ", avec " + M("f(" + a + ") = " + fa) + " et " + M("f(" + b + ") = " + fb) + ". Quel " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " en déduit-on ?", v,
          "Sur l'intervalle, " + M(mn + " \\leqslant f(x) \\leqslant " + mx) + " ; en intégrant : " + M(mn * (b - a) + " \\leqslant \\int_{" + a + "}^{" + b + "} f(x)\\,dx \\leqslant " + mx * (b - a)) + ".",
          { ctx: "monotone-" + nm, guide: [GR("Valeur " + (up ? "maximale" : "minimale") + " de " + M("f") + " sur l'intervalle ?", up ? mx : mn, M(up ? mx : mn) + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(v) + ".")],
            traps: [TR((up ? mn : mx) * (b - a), up ? "Pour majorer, on prend la plus grande valeur de f." : "Pour minorer, on prend la plus petite valeur de f."), TR(up ? mx : mn, "Multiplie par la longueur de l'intervalle (" + (b - a) + ").")] }); },
      () => { const a = R.int(0, 4), b = a + R.int(2, 6), mu = dec1(1.5, 8.5), v = rnd(mu * (b - a), 6);
        return QD("La valeur moyenne d'une fonction continue " + M("f") + " sur " + M("[" + a + " \\,;\\, " + b + "]") + " vaut " + M(N(mu)) + ". Que vaut " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx") + " ?", v,
          "Valeur moyenne " + M("\\mu = \\frac{1}{b - a}\\int_a^b f(x)\\,dx") + ", donc " + M("\\int_{" + a + "}^{" + b + "} f(x)\\,dx = " + (b - a) + " \\times " + N(mu) + " = " + N(v)) + ".",
          { ctx: "valeur-moyenne", guide: [GR("Longueur " + M("b - a") + " ?", b - a, M(b - a) + "."), GD("Intégrale ?", v, M(N(v)) + ".")],
            traps: [TD(mu / (b - a), "μ = I ÷ (b − a), donc I = μ × (b − a)."), TD(mu * b, "On multiplie par la longueur b − a, pas par b.")] }); },
    ],
    2: [
      () => { const b = pk([1, 2, 3]), v = rnd(1 - Math.exp(-b), 9);
        return QR("Sur " + M("[0 \\,;\\, " + b + "]") + ", " + M("0 \\leqslant \\sin x \\leqslant 1") + ". Majore " + M("I = \\int_0^{" + b + "} e^{-x}\\sin x\\,dx") + " par l'intégrale de " + M("e^{-x}") + " : quel majorant obtient-on ? (au centième)", v, 0.01,
          M("e^{-x} > 0") + " et " + M("\\sin x \\leqslant 1") + " : " + M("e^{-x}\\sin x \\leqslant e^{-x}") + ". Donc " + M("I \\leqslant \\int_0^{" + b + "} e^{-x}\\,dx = \\left[-e^{-x}\\right]_0^{" + b + "} = 1 - e^{-" + b + "} \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "majorer-exp-sin", guide: [GX("Une primitive de " + M("e^{-x}") + " ?", "-exp(-x)", M("-e^{-x}") + "."), GR("Majorant (au centième) ?", v, M("1 - e^{-" + b + "} \\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(b, "On intègre e^(−x), pas 1 : ∫ e^(−x) dx = 1 − e^(−" + b + ")."), TR(rnd(Math.exp(-b) - 1, 9), "[−e^(−x)] de 0 à " + b + " = −e^(−" + b + ") + 1.")] }); },
      () => { const a = R.int(0, 3), b = a + R.int(1, 4), up = R.rand() < 0.5, v = up ? (b - a) / (1 + a) : (b - a) / (1 + b);
        return QF("La fonction " + M("f(x) = \\frac{1}{1 + x}") + " est décroissante sur " + M("[" + a + " \\,;\\, " + b + "]") + ". En déduis un " + (up ? "majorant" : "minorant") + " de " + M("\\int_{" + a + "}^{" + b + "} \\frac{dx}{1 + x}") + " (fraction).", v,
          M("f(" + b + ") \\leqslant f(x) \\leqslant f(" + a + ")") + ", soit " + M(F(1 / (1 + b)) + " \\leqslant f(x) \\leqslant " + F(1 / (1 + a))) + ". En intégrant sur un intervalle de longueur " + M(b - a) + " : " + M(F((b - a) / (1 + b)) + " \\leqslant I \\leqslant " + F((b - a) / (1 + a))) + ".",
          { ctx: "decroissante-" + (up ? "max" : "min"), guide: [GR("Valeur " + (up ? "maximale" : "minimale") + " de " + M("f") + " ?", up ? 1 / (1 + a) : 1 / (1 + b), M(F(up ? 1 / (1 + a) : 1 / (1 + b))) + " (en " + (up ? a : b) + ")."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(F(v)) + ".")],
            traps: [TR(up ? (b - a) / (1 + b) : (b - a) / (1 + a), "f est décroissante : son maximum est en " + a + ", son minimum en " + b + "."), TR(up ? 1 / (1 + a) : 1 / (1 + b), "Multiplie par la longueur de l'intervalle.")] }); },
      () => { const [fx, gx, v, sens, nm, why] = pk([["e^{x^2}", "e^{x}", Math.E - 1, "majorant", "ex2", "x^2 \\leqslant x"], ["e^{x^3}", "e^{x}", Math.E - 1, "majorant", "ex3", "x^3 \\leqslant x"], ["\\frac{1}{1 + x^2}", "\\frac{1}{1 + x}", Math.log(2), "minorant", "inv", "1 + x^2 \\leqslant 1 + x"], ["\\sqrt{x}", "x", 0.5, "minorant", "rac", "x \\leqslant \\sqrt{x}"]]);
        return QR("Sur " + M("[0 \\,;\\, 1]") + ", on a " + M(why) + ". En comparant " + M(fx) + " et " + M(gx) + ", quel " + sens + " de " + M("\\int_0^{\\,1} " + fx + "\\,dx") + " obtient-on ? (au centième)", rnd(v, 9), 0.01,
          "Sur " + M("[0 \\,;\\, 1]") + " : " + M(why) + ", donc " + M(fx + (sens === "majorant" ? " \\leqslant " : " \\geqslant ") + gx) + ". Par croissance de l'intégrale : " + M("\\int_0^{\\,1} " + fx + "\\,dx" + (sens === "majorant" ? " \\leqslant " : " \\geqslant ") + "\\int_0^{\\,1} " + gx + "\\,dx \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "comparer-" + nm, guide: [GR(M("\\int_0^{\\,1} " + gx + "\\,dx") + " (au centième) ?", rnd(v, 9), M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(1, "On intègre " + gx.replace(/\\/g, "") + " sur [0 ; 1], pas la constante 1."), TR(rnd(Math.E, 9), "∫₀¹ eˣ dx = e − 1.")] }); },
    ],
    3: [
      () => { const n = pk([2, 3, 4]), up = R.rand() < 0.5; let s = 0; for (let k = up ? 0 : 1; k < (up ? n : n + 1); k++) s += 1 / (n + k);
        return QF("On encadre " + M("\\int_1^2 \\frac{dx}{x}") + " par la méthode des rectangles avec " + M(n) + " rectangles de même largeur. " + M("x \\mapsto \\frac{1}{x}") + " est décroissante : les rectangles de hauteur la valeur " + (up ? "à gauche" : "à droite") + " donnent un " + (up ? "majorant" : "minorant") + ". Lequel ? (fraction)", s,
          "Largeur " + M("\\frac{1}{" + n + "}") + ". Hauteurs : " + Array.from({ length: n }, (_, k) => M(F(1 / (1 + (k + (up ? 0 : 1)) / n)))).join(", ") + ". Somme des aires : " + M(F(s) + " \\approx " + N(rnd(s, 3))) + " (et " + M("\\ln 2 \\approx 0{,}693") + ").",
          { ctx: "rectangles-" + (up ? "gauche" : "droite"), guide: [GR("Largeur d'un rectangle ?", 1 / n, M("\\frac{1}{" + n + "}") + "."), GR("Hauteur du premier rectangle ?", 1 / (1 + (up ? 0 : 1) / n), M(F(1 / (1 + (up ? 0 : 1) / n))) + "."), GR((up ? "Majorant" : "Minorant") + " ?", s, M(F(s)) + ".")],
            traps: [TR(rnd(Math.log(2), 9), "C'est la valeur exacte ln 2 ; on demande la somme des rectangles."), TR(rnd(s * n, 9), "Chaque aire = largeur × hauteur : multiplie par 1/" + n + ".")] }); },
      () => { const n = R.int(4, 12), up = R.rand() < 0.5, v = up ? 1 / (n + 1) : 1 / (2 * (n + 1));
        return QF("Soit " + M("I_n = \\int_0^{\\,1} \\frac{x^{" + "n}}{1 + x}\\,dx") + ". Pour " + M("x \\in [0 \\,;\\, 1]") + ", " + M("\\frac{x^n}{2} \\leqslant \\frac{x^n}{1 + x} \\leqslant x^n") + ". Donne le " + (up ? "majorant" : "minorant") + " de " + M("I_{" + n + "}") + " obtenu en intégrant (fraction).", v,
          M("\\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}") + " : " + M("\\frac{1}{2(n + 1)} \\leqslant I_n \\leqslant \\frac{1}{n + 1}") + ". Pour " + M("n = " + n) + " : " + M(F(1 / (2 * (n + 1))) + " \\leqslant I_{" + n + "} \\leqslant " + F(1 / (n + 1))) + ". Donc " + M("I_n \\to 0") + ".",
          { ctx: "majorant-xn-" + (up ? "max" : "min"), guide: [GR(M("\\int_0^{\\,1} x^{" + n + "}\\,dx") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR((up ? "Majorant" : "Minorant") + " ?", v, M(F(v)) + ".")],
            traps: [TR(up ? 1 / n : 1 / (n + 1), up ? "Une primitive de xⁿ est x^(n+1)/(n + 1)." : "Le minorant vient de xⁿ/2 : on divise encore par 2."), TR(up ? 1 / (2 * (n + 1)) : 1 / (2 * n), up ? "C'est le minorant." : "∫₀¹ xⁿ dx = 1/(n + 1).")] }); },
      () => { const [s, n] = pk([[0.01, 99], [0.02, 49], [0.04, 24], [0.05, 19], [0.005, 199], [0.025, 39]]);
        return QN("On sait que " + M("0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}") + " pour tout entier " + M("n") + ". À partir de quel entier " + M("n") + " l'encadrement garantit-il " + M("I_n \\leqslant " + N(s)) + " ?", n,
          M("\\frac{1}{n + 1} \\leqslant " + N(s) + " \\iff n + 1 \\geqslant " + N(rnd(1 / s, 6)) + " \\iff n \\geqslant " + n) + ". La suite " + M("(I_n)") + " tend vers 0 (théorème des gendarmes).",
          { ctx: "seuil", guide: [GR(M("\\frac{1}{" + N(s) + "}") + " ?", rnd(1 / s, 9), M(N(rnd(1 / s, 6))) + "."), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n + 1, "1/(n + 1) ≤ " + D(s) + " ⇔ n + 1 ≥ " + (n + 1) + ", donc n ≥ " + n + "."), TR(n - 1, "Pour n = " + (n - 1) + ", 1/(n + 1) = 1/" + n + " > " + D(s) + ".")] }); },
    ],
  };

  // ======================= suiteint : suites d'intégrales (Tle.AN.26) =======================
  const SI = {
    1: [
      () => { const b = pk([2, 3]), n = pk([2, 3, 4]), v = b ** (n + 1) / (n + 1);
        return QF("Pour tout entier " + M("n \\geqslant 0") + ", on pose " + M("I_n = \\int_0^{" + b + "} x^n\\,dx") + ". Calcule " + M("I_{" + n + "}") + ".", v,
          "Une primitive de " + M("x^n") + " est " + M("\\frac{x^{n+1}}{n + 1}") + " : " + M("I_{" + n + "} = \\left[\\frac{x^{" + (n + 1) + "}}{" + (n + 1) + "}\\right]_0^{" + b + "} = \\frac{" + b ** (n + 1) + "}{" + (n + 1) + "}" + (Number.isInteger(v) ? " = " + v : "")) + ".",
          { ctx: "puissance", guide: [GR(M(b + "^{" + (n + 1) + "}") + " ?", b ** (n + 1), M(b ** (n + 1)) + "."), GR(M("I_{" + n + "}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(b ** n / n, "Une primitive de xⁿ est x^(n+1)/(n + 1)."), TR(b ** (n + 1), "N'oublie pas de diviser par n + 1.")] }); },
      () => { const n = R.int(2, 7), v = 1 / ((n + 1) * (n + 2));
        return QF("On pose " + M("I_n = \\int_0^{\\,1} x^n\\,dx") + ". Calcule " + M("I_{" + n + "} - I_{" + (n + 1) + "}") + " (fraction). Son signe donne le sens de variation de la suite.", v,
          M("I_n = \\frac{1}{n + 1}") + " : " + M("I_{" + n + "} - I_{" + (n + 1) + "} = \\frac{1}{" + (n + 1) + "} - \\frac{1}{" + (n + 2) + "} = " + F(v) + " > 0") + " : la suite est décroissante (sur " + M("[0 \\,;\\, 1]") + ", " + M("x^{n+1} \\leqslant x^n") + ").",
          { ctx: "difference", guide: [GR(M("I_{" + n + "}") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR(M("I_{" + (n + 1) + "}") + " ?", 1 / (n + 2), M("\\frac{1}{" + (n + 2) + "}") + "."), GR("Différence ?", v, M(F(v)) + ".")],
            traps: [TR(-v, "C'est I_(n+1) − I_n."), TR(1 / (n + 1), "C'est I_" + n + " seul.")] }); },
      () => { const n = pk([2, 3, 4, 5]), v = rnd((1 - Math.exp(-n)) / n, 9);
        return QR("Pour tout entier " + M("n \\geqslant 1") + ", " + M("J_n = \\int_0^{\\,1} e^{-nx}\\,dx") + ". Calcule " + M("J_{" + n + "}") + " (au centième).", v, 0.01,
          "Une primitive de " + M("e^{-nx}") + " est " + M("-\\frac{1}{n}e^{-nx}") + " : " + M("J_{" + n + "} = \\frac{1 - e^{-" + n + "}}{" + n + "} \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "exponentielle", guide: [GX("Une primitive de " + M("e^{-" + n + "x}") + " ?", "-exp(-" + n + "*x)/" + n, M("-\\frac{1}{" + n + "}e^{-" + n + "x}") + "."), GR(M("J_{" + n + "}") + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(1 - Math.exp(-n), 9), "La primitive de e^(−nx) a un facteur 1/n."), TR(rnd(Math.exp(-n), 9), "J_n = [−e^(−nx)/n] de 0 à 1 = (1 − e^(−n))/n.")] }); },
    ],
    2: [
      () => { const n = pk([2, 3]), I = [Math.E - 1]; for (let k = 0; k < 3; k++) I.push(Math.E - (k + 1) * I[k]); const v = rnd(I[n], 9);
        return QR("Soit " + M("I_n = \\int_0^{\\,1} x^n e^x\\,dx") + ". Une intégration par parties donne " + M("I_{n+1} = e - (n + 1)I_n") + ", et " + M("I_0 = e - 1") + ". Calcule " + M("I_{" + n + "}") + " (au centième).", v, 0.01,
          M("I_1 = e - (e - 1) = 1") + (n >= 2 ? ", " + M("I_2 = e - 2 \\times 1 = e - 2 \\approx 0{,}72") : "") + (n >= 3 ? ", " + M("I_3 = e - 3(e - 2) = 6 - 2e \\approx 0{,}56") : "") + ".",
          { ctx: "ipp-recurrence", guide: [GR(M("I_1") + " ?", 1, M("e - (e - 1) = 1") + "."), GR(M("I_" + n) + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(Math.E - I[n - 1], 9), "La relation est I_(n+1) = e − (n + 1) I_n : le coefficient change à chaque étape."), TR(rnd(I[n - 1], 9), "C'est I_" + (n - 1) + ".")] }); },
      () => { const n = pk([1, 2, 3]), I = [Math.log(2)]; for (let k = 0; k < 3; k++) I.push(1 / (k + 1) - I[k]); const v = rnd(I[n], 9);
        return QR("Soit " + M("I_n = \\int_0^{\\,1} \\frac{x^n}{1 + x}\\,dx") + ". On a " + M("I_n + I_{n+1} = \\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}") + " et " + M("I_0 = \\ln 2") + ". Calcule " + M("I_{" + n + "}") + " (au centième).", v, 0.01,
          M("I_1 = 1 - \\ln 2 \\approx 0{,}31") + (n >= 2 ? ", " + M("I_2 = \\frac{1}{2} - I_1 = \\ln 2 - \\frac{1}{2} \\approx 0{,}19") : "") + (n >= 3 ? ", " + M("I_3 = \\frac{1}{3} - I_2 = \\frac{5}{6} - \\ln 2 \\approx 0{,}14") : "") + ".",
          { ctx: "somme-consecutifs", guide: [GR(M("I_1") + " (au centième) ?", rnd(I[1], 9), M("1 - \\ln 2 \\approx 0{,}31") + ".", 0.01), GR(M("I_" + n) + " (au centième) ?", v, M("\\approx " + N(rnd(v, 2))) + ".", 0.01)].slice(n === 1 ? 1 : 0),
            traps: [TR(rnd(1 / (n + 1), 9), "C'est I_n + I_(n+1) ; il faut retrancher le terme précédent."), TR(rnd(1 / n + I[n - 1], 9), "I_n = 1/n − I_(n−1) : on soustrait.")] }); },
      () => { const n = R.int(2, 6), v = 1 / ((n + 1) * (n + 2));
        return QF("Pour tout entier " + M("n \\geqslant 0") + ", " + M("I_n = \\int_0^{\\,1} x^n(1 - x)\\,dx") + ". Calcule " + M("I_{" + n + "}") + " (fraction).", v,
          M("I_n = \\int_0^{\\,1} (x^n - x^{n+1})\\,dx = \\frac{1}{n + 1} - \\frac{1}{n + 2} = \\frac{1}{(n + 1)(n + 2)}") + " : " + M("I_{" + n + "} = " + F(v)) + ". La suite est décroissante et tend vers 0.",
          { ctx: "beta", guide: [GR(M("\\int_0^{\\,1} x^{" + n + "}\\,dx") + " ?", 1 / (n + 1), M("\\frac{1}{" + (n + 1) + "}") + "."), GR(M("\\int_0^{\\,1} x^{" + (n + 1) + "}\\,dx") + " ?", 1 / (n + 2), M("\\frac{1}{" + (n + 2) + "}") + "."), GR(M("I_{" + n + "}") + " ?", v, M(F(v)) + ".")],
            traps: [TR(1 / (n + 1), "Développe x^n(1 − x) = xⁿ − x^(n+1) et intègre les deux termes."), TR(1 / ((n + 1) * n), "∫₀¹ x^(n+1) dx = 1/(n + 2).")] }); },
    ],
    3: [
      () => { const [txt, v, nm, why] = pk([["x^n e^x", Math.E, "ex", "I_{n+1} = e - (n + 1)I_n"], ["x^n e^{-x}", 1 / Math.E, "emx", "I_{n+1} = (n + 1)I_n - e^{-1}"], ["\\frac{x^n}{1 + x}", 0.5, "inv", "I_n + I_{n+1} = \\frac{1}{n + 1}"]]);
        return QR("Soit " + M("I_n = \\int_0^{\\,1} " + txt + "\\,dx") + ". On sait que " + M(why) + ", que " + M("(I_n)") + " est décroissante et tend vers 0. Vers quelle limite tend " + M("n I_n") + " ? (au centième)", rnd(v, 9), 0.01,
          nm === "ex" ? M("(n + 1)I_n = e - I_{n+1} \\to e") + ", et " + M("nI_n = (n + 1)I_n - I_n \\to e \\approx 2{,}72") + "." : nm === "emx" ? M("(n + 1)I_n = I_{n+1} + e^{-1} \\to e^{-1}") + ", donc " + M("nI_n \\to e^{-1} \\approx 0{,}37") + "." : "La suite décroît : " + M("2I_{n+1} \\leqslant I_n + I_{n+1} = \\frac{1}{n + 1} \\leqslant 2I_n") + ", d'où " + M("\\frac{n}{2(n + 1)} \\leqslant nI_n \\leqslant \\frac{n}{2n}") + " (au rang suivant) : " + M("nI_n \\to \\frac{1}{2}") + ".",
          { ctx: "limite-nIn-" + nm, guide: [GR("Limite (au centième) ?", rnd(v, 9), M("\\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(1, "Utilise la relation : isole (n + 1) I_n, puis passe à la limite (I_n → 0)."), TR(rnd(2 * v, 9), "Reprends la relation : seul un terme tend vers 0.")] }); },
      () => { const n = pk([3, 4, 5]), I = [Math.PI / 2, 1]; for (let k = 2; k <= 5; k++) I.push(((k - 1) / k) * I[k - 2]); const v = rnd(I[n], 9), ex = n === 3 ? "\\frac{2}{3}" : n === 5 ? "\\frac{8}{15}" : "\\frac{3\\pi}{16}";
        return QR("Soit " + M("W_n = \\int_0^{\\frac{\\pi}{2}} \\sin^n x\\,dx") + " (intégrales de Wallis). Par parties, " + M("W_{n+2} = \\frac{n + 1}{n + 2}W_n") + ", avec " + M("W_0 = \\frac{\\pi}{2}") + " et " + M("W_1 = 1") + ". Calcule " + M("W_{" + n + "}") + " (au centième).", v, 0.01,
          (n % 2 ? M("W_3 = \\frac{2}{3}W_1 = \\frac{2}{3}") + (n === 5 ? ", " + M("W_5 = \\frac{4}{5}W_3 = \\frac{8}{15}") : "") : M("W_2 = \\frac{1}{2}W_0 = \\frac{\\pi}{4}") + ", " + M("W_4 = \\frac{3}{4}W_2 = \\frac{3\\pi}{16}")) + " : " + M("W_{" + n + "} = " + ex + " \\approx " + N(rnd(v, 2))) + ".",
          { ctx: "wallis", guide: [GR(M("W_{" + (n - 2) + "}") + " (au centième) ?", rnd(I[n - 2], 9), M("\\approx " + N(rnd(I[n - 2], 2))) + ".", 0.01), GR(M("W_{" + n + "}") + " (au centième) ?", v, M(ex + " \\approx " + N(rnd(v, 2))) + ".", 0.01)],
            traps: [TR(rnd(((n - 1) / n) * I[n - 1], 9), "La relation relie W_(n+2) à W_n (deux rangs plus bas)."), TR(rnd((n / (n + 1)) * I[n - 2], 9), "W_(n+2) = (n + 1)/(n + 2) × W_n : pour W_" + n + ", le coefficient est " + (n - 1) + "/" + n + ".")] }); },
      () => { const s = pk([0.1, 0.05, 0.04, 0.02, 0.2, 0.125]), n = Math.round(1 / s);
        return QN("Pour tout entier " + M("n \\geqslant 1") + ", " + M("J_n = \\int_0^{\\,1} e^{-nx}\\,dx = \\frac{1 - e^{-n}}{n}") + ". La suite est décroissante. Quel est le plus petit entier " + M("n") + " tel que " + M("J_n < " + N(s)) + " ?", n,
          M("J_n < \\frac{1}{n}") + " ; pour " + M("n = " + n) + " : " + M("J_{" + n + "} = " + N(s) + "(1 - e^{-" + n + "}) < " + N(s)) + ". Pour " + M("n = " + (n - 1)) + " : " + M("J_{" + (n - 1) + "} \\approx " + N(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 4)) + " > " + N(s)) + ". Donc " + M("n = " + n) + ".",
          { ctx: "seuil-exp", guide: [GR(M("J_{" + (n - 1) + "}") + " (au millième) ?", rnd((1 - Math.exp(-(n - 1))) / (n - 1), 9), M("\\approx " + N(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 3))) + " : encore trop grand.", 0.001), GR(M("n") + " ?", n, M(n) + ".")],
            traps: [TR(n - 1, "J_" + (n - 1) + " ≈ " + D(rnd((1 - Math.exp(-(n - 1))) / (n - 1), 3)) + " n'est pas encore sous " + D(s) + "."), TR(n + 1, "J_" + n + " est déjà sous " + D(s) + ".")] }); },
    ],
  };

  // ---------- défis (niveau 4) ----------
  const PROBS = {
    symax: [() => P("Le triangle ABC a pour côtés AB = 5 cm, BC = 7 cm, AC = 6 cm et pour angles Â = 78°, B̂ = 57°. On trace son symétrique A'B'C' par rapport à la droite (BC).", [["a) Longueur A'B' (cm)", 5], ["b) Mesure de Ĉ' (degrés)", 45], ["c) Périmètre du quadrilatère ABA'C (cm)", 22]], ["La symétrie conserve les longueurs et les angles ; B et C sont sur l'axe : B' = B, C' = C.", "Le quadrilatère ABA'C a pour côtés AB, BA', A'C et CA."], "a) " + M("A'B' = AB = 5") + " cm ; b) " + M("\\widehat{C} = 180 - 78 - 57 = 45°") + ", conservé ; c) " + M("5 + 5 + 6 + 6 = 22") + " cm (" + M("[BC]") + " est à l'intérieur).")],
    mediatrice: [() => P("Trois maisons A, B et C forment un triangle. On veut creuser un puits P à égale distance des trois maisons. On mesure AB = 8 m et la distance PA = 5 m.", [["a) Distance PB (m)", 5], ["b) Distance PC (m)", 5], ["c) Périmètre du triangle PAB (m)", 18]], ["P est sur la médiatrice de [AB] et sur celle de [AC] : c'est le centre du cercle circonscrit.", "Équidistant des trois : PA = PB = PC."], "a) " + M("PB = PA = 5") + " m ; b) " + M("PC = 5") + " m ; c) " + M("5 + 5 + 8 = 18") + " m.")],
    echelle6: [() => P("Sur une carte au 1/25 000, un randonneur trace son parcours : 6 cm, puis 4,4 cm, puis 9,6 cm.", [["a) Longueur du parcours sur la carte (cm)", 20], ["b) Longueur réelle (km)", 5], ["c) Durée à 4 km/h (minutes)", 75]], ["Additionne, puis multiplie par 25 000 (cm), et convertis : 1 km = 100 000 cm.", "À 4 km/h, 1 km prend 15 minutes."], "a) " + M("6 + 4{,}4 + 9{,}6 = 20") + " cm ; b) " + M("20 \\times 25\\,000 = 500\\,000") + " cm = 5 km ; c) " + M("5 \\times 15 = 75") + " minutes.")],
    proba6: [() => P("Un sac contient 4 billes rouges, 6 bleues et 10 vertes. On tire une bille au hasard.", [["a) Probabilité d'une rouge (décimal)", 0.2], ["b) Probabilité de ne pas tirer une verte (décimal)", 0.5], ["c) Billes vertes à retirer pour que P(rouge) = 0,25", 4]], ["Il y a 20 billes. P = favorables ÷ total.", "c) 4 rouges doivent faire le quart du total : 16 billes."], "a) " + M("\\frac{4}{20} = 0{,}2") + " ; b) " + M("\\frac{10}{20} = 0{,}5") + " ; c) il faut 16 billes en tout : on retire 4 vertes.")],
    empil: [() => P("On construit une pyramide de cubes à étages carrés : l'étage du haut a 1 cube, celui du dessous 2 × 2, puis 3 × 3, et ainsi de suite.", [["a) Cubes d'une pyramide de 3 étages", 14], ["b) Cubes d'une pyramide de 5 étages", 55], ["c) Carrés de la vue de dessus (5 étages)", 25]], ["Additionne les carrés 1² + 2² + 3² + …", "Vue de dessus : on ne voit que l'étage du bas (et les dessus des autres, qui sont au-dessus de lui)."], "a) " + M("1 + 4 + 9 = 14") + " ; b) " + M("1 + 4 + 9 + 16 + 25 = 55") + " ; c) la vue de dessus est l'étage du bas : " + M("5 \\times 5 = 25") + " carrés.")],
    compdiff: [() => P("On compare les offres A : 18 € pour 750 g, et B : 11 € pour 440 g.", [["a) Prix de A au kg (€)", 24], ["b) Prix de B au kg (€)", 25], ["c) Quotient prix(A) ÷ prix(B) au kg", 0.96]], ["Prix au kg = prix ÷ masse en kg.", "c) Un quotient inférieur à 1 : A est moins cher au kilo."], "a) " + M("18 \\div 0{,}75 = 24") + " € ; b) " + M("11 \\div 0{,}44 = 25") + " € ; c) " + M("\\frac{24}{25} = 0{,}96 < 1") + " : A est 4 % moins cher.")],
    posrelc: [() => P("Soit f(x) = x² − 2x + 3 et g(x) = 2x. On étudie d(x) = f(x) − g(x).", [["a) Plus petite abscisse d'un point commun", 1], ["b) Plus grande abscisse d'un point commun", 3], ["c) Valeur minimale de d(x)", -1]], ["d(x) = x² − 4x + 3 = (x − 1)(x − 3).", "Le minimum d'un trinôme est atteint au sommet, ici en x = 2."], "a) et b) " + M("d(x) = (x - 1)(x - 3)") + " s'annule en 1 et 3 ; " + M("C_f") + " est au-dessous de la droite entre 1 et 3 ; c) " + M("d(2) = 4 - 8 + 3 = -1") + ".")],
    intmaj: [() => P("Soit I = ∫₀² √(1 + x³) dx. La fonction √(1 + x³) est croissante sur [0 ; 2].", [["a) Valeur en 0", 1], ["b) Valeur en 2", 3], ["c) Amplitude de l'encadrement obtenu (majorant − minorant)", 4]], ["Croissante : f(0) ≤ f(x) ≤ f(2).", "Intègre l'encadrement sur un intervalle de longueur 2."], "a) " + M("\\sqrt{1} = 1") + " ; b) " + M("\\sqrt{9} = 3") + " ; c) " + M("2 \\leqslant I \\leqslant 6") + ", amplitude " + M("4") + ".")],
    suiteint: [() => P("Soit Iₙ = ∫₀¹ xⁿ(1 − x)² dx (n ≥ 0).", [["a) I₀ (fraction)", 1 / 3], ["b) I₁ (fraction)", 1 / 12], ["c) I₂ (fraction)", 1 / 30]], ["Développe xⁿ(1 − x)² = xⁿ − 2x^(n+1) + x^(n+2).", "Iₙ = 1/(n + 1) − 2/(n + 2) + 1/(n + 3)."], "a) " + M("1 - 1 + \\frac{1}{3} = \\frac{1}{3}") + " ; b) " + M("\\frac{1}{2} - \\frac{2}{3} + \\frac{1}{4} = \\frac{1}{12}") + " ; c) " + M("\\frac{1}{3} - \\frac{1}{2} + \\frac{1}{5} = \\frac{1}{30}") + " : la suite décroît vers 0.")],
  };

  reg([
    { id: "symax", theme: "es", label: "Symétrie axiale", ex: "A \\to A' : (d) \\text{ médiatrice de } [AA']", FR: [6], againFR: [7], g: SA, probs: PROBS.symax,
      hint: "Le symétrique de A par rapport à (d) est sur la perpendiculaire à (d) passant par A, à la même distance de (d), de l'autre côté. La symétrie conserve longueurs, angles, aires. Un axe de symétrie d'une figure la partage en deux moitiés superposables par pliage.",
      comps: ["Axes d'une figure, conservation des longueurs et des angles", "Symétrique sur une droite graduée, moitié de figure, triangle isocèle", "Deux symétries, compléter une figure, recoller"],
      lesson: ["Symétrie axiale", "Deux figures symétriques par rapport à une droite \\((d)\\) se superposent quand on plie le long de \\((d)\\).",
        "Le symétrique \\(A'\\) du point \\(A\\) par rapport à \\((d)\\) : \\((d)\\) est perpendiculaire à \\([AA']\\) et passe par son milieu (c'est la médiatrice de \\([AA']\\)). Un point de \\((d)\\) est son propre symétrique. La symétrie axiale conserve les longueurs, les angles, les périmètres et les aires. Une droite est un axe de symétrie d'une figure si la figure est sa propre symétrique.",
        ["Un rectangle a 2 axes de symétrie, un carré 4, un triangle équilatéral 3.", "\\(A\\) d'abscisse 2,4 et \\((d)\\) en 5 : \\(A'\\) a pour abscisse \\(5 + 2{,}6 = 7{,}6\\)."],
        "Les diagonales d'un rectangle (non carré) ne sont pas des axes de symétrie."] },
    { id: "mediatrice", theme: "es", label: "Médiatrice d'un segment", ex: "M \\in (d) \\iff MA = MB", FR: [6], againFR: [7], g: MD, probs: PROBS.mediatrice,
      hint: "La médiatrice de [AB] est la droite perpendiculaire à [AB] en son milieu. Un point est sur la médiatrice de [AB] si et seulement s'il est à la même distance de A et de B. Les trois médiatrices d'un triangle se coupent au centre du cercle circonscrit.",
      comps: ["Milieu, équidistance, périmètre", "Abscisse du milieu, triangle isocèle, cercle circonscrit", "Retrouver une longueur ou un point, cerf-volant"],
      lesson: ["Médiatrice d'un segment", "La médiatrice d'un segment est l'ensemble des points situés à égale distance de ses deux extrémités.",
        "La médiatrice de \\([AB]\\) est la droite perpendiculaire à \\([AB]\\) qui passe par son milieu \\(I\\). Propriété : \\(M\\) est sur la médiatrice de \\([AB]\\) si et seulement si \\(MA = MB\\) (le triangle \\(MAB\\) est alors isocèle en \\(M\\)). Les médiatrices des trois côtés d'un triangle se coupent en un point \\(O\\), centre du cercle qui passe par les trois sommets (cercle circonscrit).",
        ["\\(M\\) sur la médiatrice de \\([AB]\\), \\(MA = 4\\) cm, \\(AB = 3\\) cm : périmètre de \\(MAB\\) = \\(4 + 4 + 3 = 11\\) cm.", "\\(A\\) en 2, \\(B\\) en 8 sur une droite graduée : la médiatrice passe par 5."],
        "Pour qu'un point soit sur la médiatrice, il ne suffit pas qu'il soit « au milieu » : il doit être à égale distance de \\(A\\) et de \\(B\\)."] },
    { id: "echelle6", theme: "fa", label: "Échelles : plans, cartes, maquettes", ex: "\\frac{1}{200} : 3 \\text{ cm} \\to 6 \\text{ m}", FR: [6], againFR: [7], g: EC, probs: PROBS.echelle6,
      hint: "Échelle 1/n : 1 cm sur le plan représente n cm en réalité. Réel = plan × n ; plan = réel ÷ n. Mets les deux longueurs dans la même unité. 1 m = 100 cm, 1 km = 100 000 cm.",
      comps: ["Du plan à la réalité, carte, maquette", "De la réalité au plan, km, trouver l'échelle", "Deux longueurs, deux cartes, périmètre réel"],
      lesson: ["Échelles", "Sur un plan ou une carte, les longueurs sont proportionnelles aux longueurs réelles.",
        "Une échelle \\(\\frac{1}{n}\\) signifie que 1 cm sur le plan représente \\(n\\) cm en réalité. Longueur réelle = longueur sur le plan × \\(n\\) ; longueur sur le plan = longueur réelle ÷ \\(n\\). On exprime les deux longueurs dans la même unité (souvent le cm), puis on convertit : 1 m = 100 cm, 1 km = 100 000 cm. L'échelle se retrouve en divisant la longueur réelle par la longueur sur le plan (même unité).",
        ["Échelle \\(\\frac{1}{200}\\) : 3 cm sur le plan donnent \\(600\\) cm, soit 6 m.", "Carte au \\(\\frac{1}{25\\,000}\\) : 4 cm représentent \\(100\\,000\\) cm, soit 1 km."],
        "Convertis avant de diviser : un mur de 6 m représenté par 3 cm donne \\(600 \\div 3 = 200\\), pas \\(6 \\div 3 = 2\\)."] },
    { id: "proba6", theme: "no", label: "Probabilités : premiers pas", ex: "P = \\frac{\\text{issues favorables}}{\\text{issues possibles}}", FR: [6], againFR: [7], g: PR, probs: PROBS.proba6,
      hint: "Si toutes les issues ont la même chance (dé équilibré, tirage au hasard), P = nombre d'issues favorables ÷ nombre d'issues possibles. Une probabilité est comprise entre 0 (impossible) et 1 (certain). En répétant une expérience un grand nombre de fois, la fréquence se rapproche de la probabilité.",
      comps: ["Dé, sac, roue : issues équiprobables", "Lettres d'un mot, fréquence, retrouver un effectif", "Modifier une urne, nombre attendu, comparer deux probabilités"],
      lesson: ["Probabilités", "Une probabilité mesure la chance qu'un évènement se produise, par un nombre entre 0 et 1.",
        "Expérience aléatoire : on connaît les issues possibles, mais pas celle qui sortira. Si les issues ont toutes la même chance (on dit équiprobables) : \\(P = \\frac{\\text{nombre d'issues favorables}}{\\text{nombre d'issues possibles}}\\). Un évènement impossible a la probabilité 0, un évènement certain la probabilité 1. Quand on répète l'expérience un grand nombre de fois, la fréquence d'un résultat (effectif ÷ nombre d'essais) se rapproche de sa probabilité.",
        ["Dé équilibré : \\(P(\\text{pair}) = \\frac{3}{6} = \\frac{1}{2}\\).", "Sac de 3 rouges et 5 bleues : \\(P(\\text{rouge}) = \\frac{3}{8}\\)."],
        "On divise par le nombre total d'issues, pas par le nombre d'issues défavorables."] },
    { id: "empil", theme: "es", label: "Empilements de cubes, vues", ex: "\\text{vue de dessus, de face, de droite}", FR: [7], againFR: [8], g: EM, probs: PROBS.empil,
      hint: "Compte pile par pile (sans oublier les cubes du bas, cachés). Vue de dessus : un carré par pile. Vue de face : dans chaque colonne, la hauteur de la pile la plus haute. Vue de droite : même chose dans chaque rangée.",
      comps: ["Compter les cubes, vue de dessus, vue de face", "Compléter en pavé, vue de droite, grands empilements", "Trois vues, escaliers, compléter en cube"],
      lesson: ["Empilements de cubes", "Un empilement de cubes se décrit par sa vue en perspective ou par ses vues de dessus, de face et de côté.",
        "Pour compter les cubes, on compte pile par pile (les cubes du bas sont cachés mais présents). Vue de dessus : un carré par pile, quelle que soit sa hauteur (on peut y écrire la hauteur de chaque pile). Vue de face : dans chaque colonne, autant de carrés que la pile la plus haute. Vue de droite : de même pour chaque rangée. Pour compléter en pavé droit : nombre de cubes du pavé (longueur × largeur × hauteur) moins ceux déjà présents.",
        ["Vue de dessus avec les hauteurs 3, 1, 2, 2 : \\(3 + 1 + 2 + 2 = 8\\) cubes.", "Pavé \\(3 \\times 2 \\times 3 = 18\\) cubes ; avec 11 cubes déjà posés, il en manque 7."],
        "Sur une vue de face, les piles de derrière ne s'ajoutent pas à celles de devant : on garde la plus haute."] },
    { id: "compdiff", theme: "no", label: "Comparer par différence ou par quotient", ex: "A - B > 0 \\iff A > B", FR: [10, 1], againFR: [11], g: CD, probs: PROBS.compdiff,
      hint: "A > B ⇔ A − B > 0 : on calcule la différence et on étudie son signe. Si A et B sont strictement positifs : A > B ⇔ A/B > 1. Pour des nombres positifs, on peut aussi comparer leurs carrés.",
      comps: ["Différence de fractions, quotient de puissances, identité", "Quotient de grandeurs, différence carrée, comparer des carrés", "Évolutions successives, fractions en n, très grandes puissances"],
      lesson: ["Comparer deux nombres", "Pour comparer deux nombres, on étudie le signe de leur différence, ou on compare leur quotient à 1.",
        "\\(A > B \\iff A - B > 0\\). On réduit \\(A - B\\) au même dénominateur, on factorise ou on reconnaît un carré pour lire son signe. Si \\(A > 0\\) et \\(B > 0\\) : \\(A > B \\iff \\frac{A}{B} > 1\\) (utile pour des puissances ou des grandeurs). Pour des nombres positifs, \\(A > B \\iff A^2 > B^2\\).",
        ["\\(\\frac{7}{9} - \\frac{10}{13} = \\frac{91 - 90}{117} = \\frac{1}{117} > 0\\), donc \\(\\frac{7}{9} > \\frac{10}{13}\\).", "\\(x^2 + 9 - 6x = (x - 3)^2 \\geqslant 0\\), donc \\(x^2 + 9 \\geqslant 6x\\) pour tout \\(x\\)."],
        "Le quotient se compare à 1 seulement pour des nombres strictement positifs."] },
    { id: "posrelc", theme: "fa", label: "Position relative de deux courbes", ex: "f(x) - g(x) > 0 \\iff C_f \\text{ au-dessus}", FR: [11, 4], g: PC, probs: PROBS.posrelc,
      hint: "On étudie le signe de d(x) = f(x) − g(x) : là où d(x) > 0, C_f est au-dessus de C_g ; là où d(x) = 0, les courbes se coupent. Factorise d(x), fais un tableau de signes, ou étudie ses variations (minimum positif ⇒ toujours au-dessus).",
      comps: ["Différence affine, intersection, contact", "Parabole et droite, deux paraboles, exponentielle et droite", "Tangente qui recoupe, paramètre, tableau de signes"],
      lesson: ["Position relative de deux courbes", "Comparer deux fonctions, c'est étudier le signe de leur différence.",
        "On pose \\(d(x) = f(x) - g(x)\\). Si \\(d(x) > 0\\) sur un intervalle, la courbe \\(C_f\\) est au-dessus de \\(C_g\\) ; si \\(d(x) < 0\\), au-dessous ; les solutions de \\(d(x) = 0\\) sont les abscisses des points communs. On étudie le signe de \\(d\\) en factorisant (tableau de signes), ou par ses variations : si le minimum de \\(d\\) est positif, \\(C_f\\) est toujours au-dessus.",
        ["\\(f(x) = x^2\\), \\(g(x) = x + 2\\) : \\(d(x) = (x - 2)(x + 1)\\) ; \\(C_f\\) est au-dessous de la droite sur \\(]-1 \\,;\\, 2[\\).", "\\(e^x - (x + 1)\\) a pour minimum 0 (en 0) : la courbe de exp est au-dessus de sa tangente en 0."],
        "On compare les ordonnées \\(f(x)\\) et \\(g(x)\\) pour un même \\(x\\), pas les formules."] },
    { id: "intmaj", theme: "fa", label: "Majorer, encadrer une intégrale", ex: "m \\leqslant f \\leqslant M \\Rightarrow m(b - a) \\leqslant \\int_a^b f \\leqslant M(b - a)", FR: [12, 6], g: IM, probs: PROBS.intmaj,
      hint: "Croissance de l'intégrale (a ≤ b) : si f ≤ g sur [a ; b], alors ∫ f ≤ ∫ g. En particulier, m ≤ f ≤ M donne m(b − a) ≤ ∫ f ≤ M(b − a). Valeur moyenne : μ = (1/(b − a)) ∫ f. Méthode des rectangles : pour f monotone, les rectangles encadrent l'intégrale.",
      comps: ["Encadrement constant, fonction monotone, valeur moyenne", "Majorer par une fonction plus simple, comparer deux fonctions", "Rectangles, majorant d'une suite d'intégrales, seuil"],
      lesson: ["Majorer, encadrer une intégrale", "On encadre une intégrale qu'on ne sait pas calculer en encadrant la fonction.",
        "Pour \\(a \\leqslant b\\) : si \\(f(x) \\leqslant g(x)\\) sur \\([a \\,;\\, b]\\), alors \\(\\int_a^b f(x)\\,dx \\leqslant \\int_a^b g(x)\\,dx\\) (croissance de l'intégrale). En particulier, si \\(m \\leqslant f(x) \\leqslant M\\), alors \\(m(b - a) \\leqslant \\int_a^b f(x)\\,dx \\leqslant M(b - a)\\). La valeur moyenne de \\(f\\) sur \\([a \\,;\\, b]\\) est \\(\\mu = \\frac{1}{b - a}\\int_a^b f(x)\\,dx\\). Pour une fonction monotone, les rectangles « à gauche » et « à droite » encadrent l'intégrale.",
        ["Sur \\([0 \\,;\\, 1]\\), \\(e^{x^2} \\leqslant e^x\\), donc \\(\\int_0^{\\,1} e^{x^2}\\,dx \\leqslant e - 1\\).", "\\(0 \\leqslant \\frac{x^n}{1 + x} \\leqslant x^n\\) donne \\(0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}\\), donc \\(I_n \\to 0\\)."],
        "On multiplie la borne par la longueur de l'intervalle : \\(\\int_1^4 5\\,dx = 15\\), pas 5."] },
    { id: "suiteint", theme: "fa", label: "Suites d'intégrales", ex: "I_n = \\int_0^{\\,1} x^n e^x\\,dx", FR: [12, 6], g: SI, probs: PROBS.suiteint,
      hint: "Calcule les premiers termes. Monotonie : signe de I_(n+1) − I_n = ∫ (différence des fonctions). Relation de récurrence : intégration par parties ou somme de deux termes consécutifs. Limite : encadrement puis théorème des gendarmes.",
      comps: ["Premiers termes, différence de deux termes, exponentielle", "Récurrence par parties, somme de deux termes, développer", "Limite de nIₙ, Wallis, seuil"],
      lesson: ["Suites d'intégrales", "Une intégrale qui dépend d'un entier \\(n\\) définit une suite \\((I_n)\\).",
        "Premiers termes : on calcule \\(I_0\\), \\(I_1\\). Sens de variation : \\(I_{n+1} - I_n = \\int_a^b (f_{n+1} - f_n)\\) a le signe de la fonction intégrée (par exemple \\(x^{n+1} \\leqslant x^n\\) sur \\([0 \\,;\\, 1]\\)). Relation de récurrence : par une intégration par parties (\\(I_{n+1} = e - (n + 1)I_n\\) pour \\(\\int_0^{\\,1} x^n e^x\\,dx\\)) ou en additionnant deux termes. Limite : on encadre \\(I_n\\) (par exemple \\(0 \\leqslant I_n \\leqslant \\frac{1}{n + 1}\\)) et on conclut avec le théorème des gendarmes.",
        ["\\(I_n = \\int_0^{\\,1} x^n\\,dx = \\frac{1}{n + 1}\\) : décroissante, de limite 0.", "\\(I_n = \\int_0^{\\,1} x^n e^x\\,dx\\) : \\(I_0 = e - 1\\), \\(I_1 = 1\\), \\(I_2 = e - 2\\)."],
        "Dans la relation de récurrence, le coefficient dépend de \\(n\\) : il change à chaque étape."] },
  ]);

  // ---------- progcalc (programmes de calcul) en 5e : formes de niveau 3 au programme de 5e (distributivité simple) ----------
  // Les formes de 4e (carré, produit (x + a)(x − a), nombre négatif multiplié) sont écartées en 5e par HORS_FR (fr_couv.js) ;
  // notion propre à la France (CH null) : les formes ajoutées ici ne touchent aucun profil suisse.
  if (typeof VARX !== "undefined") {
    const progT = (steps) => "<b>Programme</b><br>• Choisir un nombre.<br>" + steps.map((t) => "• " + t).join("<br>");
    VARX.progcalc = VARX.progcalc || {};
    VARX.progcalc[3] = (VARX.progcalc[3] || []).concat([
      () => { const a = R.int(2, 9), b = R.int(2, 6), v = a * b;
        return QN(progT(["Ajouter " + a + ".", "Multiplier le résultat par " + b + ".", "Soustraire " + b + " fois le nombre de départ."]) + "<br>Prouve que le résultat est toujours le même, quel que soit le nombre choisi : quel est ce résultat ?", v,
          "Avec " + M("x") + " au départ : " + M(b + "(x + " + a + ") - " + b + "x = " + b + "x + " + v + " - " + b + "x = " + v) + ". Le résultat vaut toujours " + M(v) + ".",
          { ctx: "prouver-constant", guide: [GX("Résultat en fonction de " + M("x") + ", avant de réduire ?", b + "*(x+" + a + ")-" + b + "*x", M(b + "(x + " + a + ") - " + b + "x") + "."), GR("Résultat réduit ?", v, M(v) + ".")],
            traps: [TR(a, "Développe " + b + "(x + " + a + ") : " + b + " × " + a + " = " + v + "."), TR(v + b, "On soustrait " + b + "x : les x disparaissent.")] }); },
      () => { const k = R.int(2, 9), b = R.int(2, 7), c = k * b;
        return QN(progT(["Ajouter un nombre " + M("k") + ".", "Multiplier le résultat par " + b + "."]) + "<br>En partant de " + M("x") + ", on obtient " + M(b + "x + " + c) + ". Que vaut " + M("k") + " ?", k,
          M(b + "(x + k) = " + b + "x + " + b + "k") + " ; il faut " + M(b + "k = " + c) + ", donc " + M("k = " + k) + ".",
          { ctx: "retrouver-etape", guide: [GR("Que vaut " + M(b + "k") + " ?", c, M(c) + " (terme constant de " + M(b + "x + " + c) + ")."), GR(M("k") + " ?", k, M(c + " \\div " + b + " = " + k) + ".")],
            traps: [TR(c, "C'est " + b + "k ; divise par " + b + "."), TR(c - b, "On multiplie après avoir ajouté k : " + b + "(x + k) = " + b + "x + " + b + "k.")] }); },
    ]);
  }

  // ---------- progression du collège (FR_PROGRESSION : ORDRE.FR_COL est recalculé par fr_couv.js) ----------
  if (typeof FR_PROGRESSION !== "undefined") {
    const ins = (g, id, ref) => { const L = FR_PROGRESSION[g]; if (L.includes(id)) return; const i = L.indexOf(ref); L.splice(i < 0 ? L.length : i + 1, 0, id); };
    ins(6, "symax", "angtype"); ins(6, "mediatrice", "symax"); ins(6, "echelle6", "proptab"); ins(6, "proba6", "pct");
    ins(7, "empil", "vol");
  }

  // ======================= Notes sur 20 pour un profil français (Engine.finalize) =======================
  // Les questions de statistiques des chapitres suisses emploient des notes de 1 à 6 (« notes d'un test : 4 ; 4,5 ; 5… »).
  // Pour un profil FR, Engine.finalize appelle FR_NOTES(id, q) : une question à notes suisses est remplacée par une question
  // de même notion, même niveau, même graine (reproductible), avec des notes sur 20. Rien ne change pour un profil suisse.
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const tabN = (vals, effs) => M("\\begin{array}{c|" + "c".repeat(vals.length) + "} \\text{note} & " + vals.map(N).join(" & ") + " \\\\ \\hline \\text{effectif} & " + effs.join(" & ") + " \\end{array}");
  const NT = {
    pond: () => { const vals = pk([[8, 10, 12, 14, 16], [9, 11, 13, 15, 17], [6, 8, 10, 12, 14, 16]]), effs = vals.map(() => R.int(1, 6)), n = sum(effs), s = sum(vals.map((v, i) => v * effs[i])), m = rnd(s / n, 9); if (Math.abs(m * 100 - Math.round(m * 100)) > 1e-6) return null;
      return QD("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Calcule la moyenne de la classe (au centième).", m, "Moyenne pondérée : " + M("\\frac{" + vals.map((v, i) => v + " \\times " + effs[i]).join(" + ") + "}{" + n + "} = \\frac{" + s + "}{" + n + "} = " + N(m)) + " sur 20.",
        { ctx: "ponderee-20", guide: [GR("Somme des notes × effectifs ?", s, M(s) + "."), GR("Effectif total ?", n, M(n) + "."), GD("Moyenne ?", m, M(N(m)) + ".")], traps: [TD(sum(vals) / vals.length, "Chaque note compte autant de fois que son effectif (moyenne pondérée)."), TD(s / vals.length, "On divise par l'effectif total, pas par le nombre de notes différentes.")] }); },
    manque: () => { const n = pk([3, 4, 5]), xs = Array.from({ length: n }, () => R.int(7, 18)), t = pk([12, 13, 14, 15]), x = t * (n + 1) - sum(xs); if (x < 4 || x > 20 || xs.includes(x)) return null; const w = who();
      return QN(w + " a eu " + xs.map((v) => M(v)).join(", ") + " sur 20 à ses premiers contrôles. Quelle note lui faut-il au prochain contrôle (même coefficient) pour avoir exactement " + M(t) + " de moyenne ?", x,
        "Avec " + M(n + 1) + " notes de moyenne " + M(t) + ", la somme doit valoir " + M((n + 1) + " \\times " + t + " = " + t * (n + 1)) + " ; on a déjà " + M(sum(xs)) + " : il faut " + M(t * (n + 1) + " - " + sum(xs) + " = " + x) + ".",
        { ctx: "note-manquante-20", guide: [GR("Somme nécessaire ?", t * (n + 1), M(t * (n + 1)) + "."), GR("Somme actuelle ?", sum(xs), M(sum(xs)) + "."), GR("Note nécessaire ?", x, M(x) + ".")], traps: [TR(t, "Il faut compenser les notes précédentes."), TR(t * n - sum(xs) > 0 ? t * n - sum(xs) : x + 3, "Il y aura " + (n + 1) + " notes en tout.")] }); },
    mode: () => { const vals = pk([[8, 10, 12, 14, 16], [9, 11, 13, 15, 17], [10, 11, 12, 13, 14]]), effs = vals.map(() => R.int(1, 8)), mx = Math.max(...effs); if (effs.filter((e) => e === mx).length > 1) return null; const md = vals[effs.indexOf(mx)];
      return Object.assign(QN("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Quel est le mode de cette série ?", md, "Le mode est la valeur la plus fréquente : " + M(md) + " (effectif " + mx + ").",
        { ctx: "mode-20", guide: [GR("Plus grand effectif ?", mx, M(mx) + "."), GR("Note correspondante (le mode) ?", md, M(md) + ".")], traps: [TR(mx, "Le mode est la NOTE la plus fréquente, pas son effectif."), TR(Math.max(...vals), "Le mode n'est pas la plus grande note.")] }), { shownOk: true }); },
    cumul: () => { const vals = [8, 10, 12, 14, 16], effs = vals.map(() => R.int(2, 9)), k = R.int(2, 3), c = sum(effs.slice(0, k));
      return QN("Notes d'un contrôle (sur 20) : " + tabN(vals, effs) + ". Combien d'élèves ont une note inférieure ou égale à " + M(vals[k - 1]) + " (effectif cumulé) ?", c, M(effs.slice(0, k).join(" + ") + " = " + c) + ".",
        { ctx: "cumul-20", guide: [GR("Combien de notes du tableau sont inférieures ou égales à " + M(vals[k - 1]) + " ?", k, vals.slice(0, k).join(", ") + "."), GR("Effectif cumulé ?", c, M(c) + ".")], traps: [TR(effs[k - 1], "On additionne les effectifs de toutes les notes jusqu'à " + vals[k - 1] + "."), TR(c + effs[k], "« Inférieure ou égale à " + vals[k - 1] + " » : la note " + vals[k] + " n'est pas comprise.")] }); },
    equation: () => { const n = R.int(3, 5); let xs, t, x; for (let k = 0; k < 40; k++) { xs = Array.from({ length: n }, () => R.int(8, 17)); t = pk([12, 13, 14]); x = t * (n + 2) - sum(xs); if (x % 2 === 0 && x / 2 >= 6 && x / 2 <= 20) break; x = null; } if (!x) return null; const v = x / 2;
      return QN("Un élève a obtenu " + xs.map((u) => M(u)).join(", ") + " sur 20. Le prochain devoir compte double. Quelle note doit-il y obtenir pour avoir exactement " + M(t) + " de moyenne ?", v,
        "Le devoir compte comme deux notes : " + M("\\frac{" + sum(xs) + " + 2x}{" + (n + 2) + "} = " + t) + ", donc " + M(sum(xs) + " + 2x = " + t * (n + 2)) + " et " + M("x = " + v) + ".",
        { ctx: "coefficient-20", guide: [GR("Somme visée (" + (n + 2) + " notes) ?", t * (n + 2), M(t * (n + 2)) + "."), GR(M("2x") + " ?", x, M(x) + "."), GR(M("x") + " ?", v, M(v) + ".")], traps: [TR(x, "C'est 2x : divise par 2."), TR(t * (n + 1) - sum(xs), "Le devoir compte double : " + (n + 2) + " notes en tout.")] }); },
  };
  const NDEF = () => P("Les notes de Yanis (sur 20) : 11 ; 14 ; 9 ; 15 ; 12. Le prochain devoir compte double.", [["a) Moyenne actuelle", 12.2], ["b) Médiane actuelle", 12], ["c) Note à obtenir au devoir double pour finir avec 13 de moyenne", 15]], ["Un devoir qui compte double compte comme deux notes : 7 notes en tout.", "Somme visée : 7 × 13 = 91 ; 61 + 2x = 91."], "a) " + M("\\frac{61}{5} = 12{,}2") + " ; b) série triée 9, 11, 12, 14, 15 : médiane " + M("12") + " ; c) " + M("61 + 2x = 91") + ", " + M("x = 15") + ".");
  const NMAP = { statfreq: ["mode", "cumul"], stats: ["pond", "manque", "mode"], diagr: ["pond", "pond"], probeq: ["manque", "equation"], eq1: ["manque"], ineq: ["manque"] };
  window.FR_NOTES = function (id, q) {
    if (!q || !NMAP[id]) return null;
    const t = String(q.q || "") + " " + (q.parts || []).map((x) => x.label || "").join(" ");
    if (!/\b[Nn]otes?\b/.test(t) || /sur 20|[Oo]n note|la note en parts/.test(t)) return null;
    R.seed((q.seed || 1) * 7919 + 4243);
    let r = null;
    if (q.d === 4 || q.parts) { const p = NDEF(); r = { ...p, spec: { kind: "multi" }, hint: p.hints[0] }; }
    else for (let k = 0; k < 30 && !r; k++) r = NT[pk(NMAP[id])]();
    if (!r) return null;
    const cb = typeof colonBreak === "function" ? colonBreak : (x) => x;
    r.q = cb(r.q); r.sol = cb(r.sol); if (r.guide) r.guide = r.guide.map((g) => ({ ...g, ask: cb(g.ask), sol: cb(g.sol) }));
    return Object.assign(r, { id, d: q.d, seed: q.seed, code: q.code, hint: r.hint || q.hint });
  };
})();

// 25.11 · Couverture du programme français (tools/france_couverture.md, branche agent/frcouv). Chargé en dernier du paquet
// « fr » (après fr_college.js et les notions françaises créées le 25.11 : fr_1re.js, fr_3e.js, fr_tle.js).
//  1. rattache aux classes françaises les notions suisses récentes dont l'attendu est le même (dérivation de la 3e du
//     Collège → 1re ; limites, continuité, convexité, ln, primitives, intégrales, équations différentielles, espace,
//     dénombrement → Tle), après contrôle des formes : les formes hors programme d'une classe française sont écartées du
//     tirage par HORS_FR (src/engine.js, horsCO), sans toucher aux profils suisses ;
//  2. retire de la 1re (et de la Tle) les notions hors programme ou écrites à la suisse (loi des sinus, réciproque, a^x,
//     degrés, log₂, « composantes ») — remplacées par des notions françaises (trigrad, trigfr, lnfr…) ;
//  3. reprend en 1re les automatismes de l'épreuve anticipée (againFR 11) et relève le niveau 1 des notions reprises
//     d'une année inférieure (UPFR) : « le niveau 1 = automatismes de l'année » (règle du 24.11, étendue à la France) ;
//  4. donne l'ordre et les chapitres de 1re et de Tle (ORDRE.FR, ORDRE_THEME.FR, THEME_LABEL.FR).
// Rien ne change pour un profil suisse : seuls les champs FR / againFR et des tables lues pour un profil FR sont touchés.

/* Formes d'une notion partagée hors programme d'une classe française : [ctx (« préfixe* » permis) | RegExp | fonction,
   première classe FR où la forme est permise (99 = jamais en France)]. Lu par horsCO (src/engine.js). */
const HORS_FR = {
  derivref: [["exposant-*", 99] /* x^(3/2), racine cubique : exposants rationnels, hors programme FR */, ["trigo-*", 12] /* dérivées de sin, cos : Tle */],
  tangente: [["newton", 12]],
  asymptotes: [["oblique", 99] /* programme FR : asymptotes parallèles aux axes seulement */],
  etudefct: [["rationnelle-oblique-*", 99]],
  combi: [["groupe-jass", 99] /* jeu de cartes suisse */],
  primitives: [["puissance-rac", 99], ["puissance-xrac", 99] /* x^(3/2) */],
  intparties: [["exp-cos", 99] /* double intégration par parties avec cosinus : hors programme */],
  eqdiff: [["separable-*", 99] /* variables séparables : hors programme (y' = ay + b seulement) */],
  /* 25.11 soir : progcalc dès la 5e ; nombre de départ négatif multiplié (produit de relatifs), (x + a)², (x + a)(x − a) : 4e */
  progcalc: [["negatif", 8], ["prouver-carre", 8], ["produit", 8]],
};

/* Niveau minimal d'une notion reprise d'une année inférieure, pour un profil FR de la classe indiquée (Engine.make).
   Calibré sur la sonde tests/_niv_fr.html (25.11) et les attendus du DNB (partie 1 : automatismes de 3e) et de
   l'épreuve anticipée de 1re (QCM d'automatismes). Le code de la question suit le niveau tiré (…-2-…). */
const UPFR = {
  /* 4e : reprises de 6e–5e dont le niveau 1 est un automatisme de 6e (« 3² », « 5 − 7 », « 50 % de 260 », « 4(2x + 2) ») */
  8: { progcalc: 2, fracadd: 2, prop: 2, valnum: 2, ordgr: 2, dec10: 2, pow9: 3, tradexpr: 2, relrep: 2, reladd: 3, fracrep: 2, fracsimp: 2, fracconv: 2, fractout: 2,
    aire1: 2, litelab: 2, quadri: 2, pct: 2, reduire: 2, distrib: 2, eqverif: 2, statfreq: 2, structexpr: 2, automat: 2, vol: 2 },
  /* 3e : DNB partie 1 (automatismes) — fractions et puissances combinées, pourcentages d'évolution, a² − b² */
  9: { fracadd: 2, diagr: 2, prop: 2, valnum: 2, pow9: 3, divcrit: 2, relrep: 2, fracsimp: 2, solides: 2, agrand: 2, litelab: 2, pct: 2, puiss: 2, sci: 2,
    reduire: 2, distrib: 2, repere: 2, parenth: 2, statfreq: 2, structexpr: 2, automat: 2, milieux: 2 },
  /* 2nde : automatismes AU.01–18 ; les reprises du collège partent du niveau 2 (tools/france.md § 3) */
  10: { fracadd: 2, diagr: 2, valnum: 2, decarr: 2, ordgr: 2, multdiv: 2, premiers: 2, relrep: 3, fracsimp: 2, fracconv: 2, fractout: 2, uvol: 2, fracmul: 2,
    pct: 2, puiss: 2, rac: 3, distrib: 2, eq1: 2, affine: 2, racenc: 2, pctvar: 2, proba: 2, idrem: 2, parenth: 2, fimg: 2, statfreq: 2, quartiles: 2, proba2: 2 },
  /* 1re : QCM d'automatismes de l'épreuve anticipée (développer (2x − 3)², taux réciproque, signe d'un produit…) */
  11: { pct: 2, puiss: 2, distrib: 2, pctvar: 2, idrem: 2, factor: 2, eq2fact: 2, fimg: 2, affzero: 2, stats: 2, quartiles: 2, ineq1: 2 },
};

(function () {
  const N = (id) => NOTIONS.find((x) => x.id === id);
  const place = (id, fr, again) => { const n = N(id); if (!n) return; n.FR = fr; if (again) n.againFR = [...new Set([...(n.againFR || []), ...again])]; };

  // ---------- 1. Rattachements (attendu contrôlé ; formes écartées : HORS_FR ci-dessus) ----------
  const RATT = {
    // 1re spécialité 2026 : dérivation (AN.01–10) — src/ch3c_ana.js
    tauxvar: [11, 3], nbderive: [11, 3], derivref: [11, 3], derivregles: [11, 3], derivprodquot: [11, 3], tangente: [11, 3], variations: [11, 4], optimderiv: [11, 4],
    // 1re : probabilités conditionnelles, variables aléatoires (SP.01–09) — src/ch3c_ana.js, src/ch4c_ana.js
    probarbre: [11, 6], condbayes: [11, 6], varalea: [11, 7],
    // Tle spécialité (2019) — src/ch3c_ana.js, src/ch4c_ana.js, src/ch3c_geo.js
    derivcomp: [12, 1], derivseconde: [12, 2], limites: [12, 1], limitinf: [12, 1], asymptotes: [12, 1], continuite: [12, 2], etudefct: [12, 2],
    lnexp: [12, 3], etudelnexp: [12, 3], croissance: [12, 3], primitives: [12, 5], eqdiff: [12, 5], integrale: [12, 6], aireint: [12, 6], intparties: [12, 6],
    combi: [12, 0], binomiale: [12, 7], vect3d: [12, 4], colin: [12, 4], droite3d: [12, 4], plans: [12, 4], posrel: [12, 4], pscal3d: [12, 4], distances: [12, 4],
    // 2nde : réunion, contraire (SP) — src/ch3c_ana.js
    probaxiomes: [10, 14],
  };
  for (const [id, fr] of Object.entries(RATT)) place(id, fr);
  // Créées en 2nde (fr_2nde.js) avec une place au collège, effacée ensuite par applyFrCollege (fr_college.js chargé après) :
  // inéquations (3e, programme 2026 : 3e.NC.28, en fin d'année) et probabilités à deux épreuves (3e-2019 DP.04).
  place("ineq1", [9, 9], [10, 11]);
  place("proba2", [9, 8], [10]);

  // ---------- 2. Retraits (hors programme français, ou écrits à la suisse et remplacés) ----------
  // sinlaw : loi des sinus hors programme (Al-Kashi : pscal) ; recip : f⁻¹ hors programme ; expo, modexp : a^x et racine n-ième
  // (la 1re ne connaît que e^x ; modèles discrets : suitegeo) ; trigcercle, trigassoc, trigfn, trigeq : en degrés (la France
  // travaille en radians dès la 1re : trigrad, trigfr) ; log : log₂ (la Tle ne connaît que ln : lnexp, lnfr) ; vecteurs :
  // « composantes » (vect3e en 2nde, pscal en 1re).
  for (const id of ["sinlaw", "recip", "expo", "modexp", "trigcercle", "trigassoc", "trigfn", "trigeq", "log", "vecteurs"]) { const n = N(id); if (n) { n.FR = null; delete n.againFR; } }

  // ---------- 3. Automatismes de 1re (épreuve anticipée, partie 1 : 1re.AU.01–17) ----------
  // Notions de collège et de 2nde reprises « de l'année » en 1re ; leur niveau 1 est relevé (UPFR[11]).
  const AU1 = ["fracops", "puiss", "pct", "pctvar", "tauxevol", "eq2", "eq2fact", "ineq1", "affzero", "distrib", "factor", "idrem", "lectgraph", "fimg", "droites", "stats", "quartiles", "probcond", "tabvar", "droiteeq"];
  for (const id of AU1) { const n = N(id); if (n && n.FR && n.FR[0] < 11) n.againFR = [...new Set([...(n.againFR || []), 11])]; }

  // ---------- 4. Ordre et chapitres de 1re et de Tle (référentiel « FR ») ----------
  const CHAP = {
    "1SU": ["suitedef", "suitearith", "suitegeo", "suitesomme"],
    "1SD": ["eq2disc", "f2formes", "trinfact", "ineq2"],
    "1DE": ["tauxvar", "nbderive", "tangente", "derivref", "derivregles", "derivprodquot", "variations", "posrelc", "optimderiv"],
    "1EX": ["expfn", "expderiv"],
    "1TR": ["trigrad"],
    "1PS": ["pscal", "droitenorm", "cercle"],
    "1PR": ["probtot", "probarbre", "condbayes", "vaesp", "varalea"],
    "TSU": ["suitelim", "recurrence"],
    "TLI": ["limites", "limitinf", "asymptotes", "continuite", "tvi"],
    "TDE": ["derivcomp", "derivseconde", "etudefct"],
    "TLN": ["lnexp", "lnfr", "etudelnexp", "croissance"],
    "TTR": ["trigfr"],
    "TPR": ["primitives", "eqdiff"],
    "TIN": ["integrale", "aireint", "intmaj", "intparties", "suiteint"],
    "TDN": ["denombr", "combi", "binom", "binomiale", "sommeva"],
    "TES": ["vect3d", "colin", "droite3d", "plans", "posrel", "pscal3d", "distances"],
    "TAU": ["compo", "eq3"],
  };
  ORDRE.FR = ORDRE.FR || {}; ORDRE_THEME.FR = ORDRE_THEME.FR || {}; THEME_LABEL.FR = THEME_LABEL.FR || {}; /* pages de test sans fr_2nde.js */
  // Progression du collège (ORDRE.FR_COL, fr_college.js) et de 2nde (ORDRE.FR, fr_2nde.js) pour les notions créées le 25.11.
  if (typeof FR_PROGRESSION !== "undefined") {
    const ins = (g, id, ref) => { const L = FR_PROGRESSION[g]; if (!N(id) || L.includes(id)) return; const i = L.indexOf(ref); L.splice(i < 0 ? L.length : i + 1, 0, id); };
    ins(8, "cos4e", "pythfig"); ins(8, "thales4e", "milieux"); ins(9, "autodnb", "pctvar"); ins(9, "linfn", "affine"); ins(9, "proba2", "volcomp");
    ins(9, "ineq1", "simil"); ins(9, "vecgeo", "ineq1"); /* programme 2026 de 3e : en fin d'année */
    ORDRE.FR_COL = {}; [6, 7, 8, 9].flatMap((g) => FR_PROGRESSION[g]).forEach((id, i) => { ORDRE.FR_COL[id] = i; });
  }
  for (const [id, ref, ch] of [["tabvar", "fref", "2AN"], ["linfn", "affine", "2AU"], ["vecgeo", "vect3e", "2GE"], ["compdiff", "fracsimp", "2NC"]]) if (N(id) && ORDRE.FR[ref] !== undefined) { ORDRE.FR[id] = ORDRE.FR[ref] + (id === "vecgeo" ? -0.5 : 0.5); ORDRE_THEME.FR[id] = ch; }
  let rk = 1000;
  for (const [ch, ids] of Object.entries(CHAP)) for (const id of ids) { if (!N(id)) continue; ORDRE.FR[id] = rk++; ORDRE_THEME.FR[id] = ch; }
  Object.assign(THEME_LABEL.FR, { "1SU": "Suites numériques", "1SD": "Second degré", "1DE": "Dérivation", "1EX": "Fonction exponentielle", "1TR": "Trigonométrie",
    "1PS": "Produit scalaire, géométrie repérée", "1PR": "Probabilités conditionnelles, variables aléatoires",
    "TSU": "Suites, récurrence", "TLI": "Limites, continuité", "TDE": "Dérivation, convexité", "TLN": "Logarithme népérien", "TTR": "Fonctions sinus et cosinus",
    "TPR": "Primitives, équations différentielles", "TIN": "Calcul intégral", "TDN": "Dénombrement, loi binomiale, sommes de variables aléatoires",
    "TES": "Géométrie dans l'espace", "TAU": "Compléments" });
})();

// Leçons actives des notions françaises du 25.11 au soir (src/fr_fin.js) : symax, mediatrice, echelle6, proba6 (6e), empil
// (5e), compdiff (2nde), posrelc (1re), intmaj, suiteint (Tle). Vraies manipulations (curseurs) : on vérifie au lâcher.
// Chaque leçon a son « Retiens » limité à ce que les défis présentent (règle du 15.11). Paquet « fr » (build.py), chargé
// après active.js ; brique « slide » recopiée de act_col34b.js (fichier autonome).
(function () {
  if (typeof ACTIVE === "undefined") return;
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const Pg = (pts, cls, ex = "") => `<polygon points="${pts.map((p) => p.map((v) => (+v).toFixed(1)).join(",")).join(" ")}" class="${cls}"${ex}/>`;
  const dot = (x, y, cls = "f-dot", r = 5) => `<circle cx="${(+x).toFixed(1)}" cy="${(+y).toFixed(1)}" r="${r}" class="${cls}"/>`;
  const plain = (h) => `<div class="act-out">${h}</div>`;

  // ---------- repère 2D : o = { xr, yr, H, gx, gy, lx, ly, fns [{ f, cls, from, to }], segs, pts, polys, lab } ----------
  let UID = 0;
  const graph = (o) => {
    const W = 320, m = 8, H = o.H || 220, [x0, x1] = o.xr, [y0, y1] = o.yr, X = (v) => m + ((v - x0) / (x1 - x0)) * (W - 2 * m), Y = (v) => H - m - ((v - y0) / (y1 - y0)) * (H - 2 * m), id = "fra" + ++UID;
    let g = "", c = "";
    for (let v = Math.ceil(x0 / o.gx) * o.gx; v <= x1 + 1e-9; v += o.gx) g += L(X(v), Y(y0), X(v), Y(y1), "f-grid", 0.7);
    for (let v = Math.ceil(y0 / o.gy) * o.gy; v <= y1 + 1e-9; v += o.gy) g += L(X(x0), Y(v), X(x1), Y(v), "f-grid", 0.7);
    const ya = Math.min(Math.max(0, y0), y1), xa = Math.min(Math.max(0, x0), x1);
    g += L(X(x0), Y(ya), X(x1), Y(ya), "f-line", 1.2) + L(X(xa), Y(y0), X(xa), Y(y1), "f-line", 1.2);
    for (let v = Math.ceil(x0 / o.lx) * o.lx; v <= x1 + 1e-9; v += o.lx) if (Math.abs(v) > 1e-9) g += T(X(v), Math.min(Y(ya) + 13, H - 2), nb(+v.toFixed(4)), "middle", 10, "f-txt f-tick");
    for (let v = Math.ceil(y0 / o.ly) * o.ly; v <= y1 + 1e-9; v += o.ly) if (Math.abs(v) > 1e-9) g += T(Math.max(X(xa) - 4, 22), Y(v) + 3.5, nb(+v.toFixed(4)), "end", 10, "f-txt f-tick");
    for (const [P, cls, op] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x).toFixed(1) + "," + Y(Math.max(y0, Math.min(y1, y))).toFixed(1)).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:${op || 0.6}"/>`;
    for (const F of o.fns || []) { let d = "", pen = false; const a = Math.max(x0, F.from ?? x0), b = Math.min(x1, F.to ?? x1);
      for (let i = 0; i <= 240; i++) { const x = a + ((b - a) * i) / 240, y = F.f(x); if (!isFinite(y) || y < y0 - 2 * (y1 - y0) || y > y1 + 2 * (y1 - y0)) { pen = false; continue; } d += (pen ? "L" : "M") + X(x).toFixed(1) + "," + Y(y).toFixed(1) + " "; pen = true; }
      c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="2.4"/>`; }
    for (const [xa2, ya2, xb, yb, cls, w, dash] of o.segs || []) c += L(X(xa2), Y(ya2), X(xb), Y(yb), cls || "f-line", w || 2, dash);
    let p = ""; for (const [x, y, lab, cls] of o.pts || []) { p += dot(X(x), Y(y), cls || "f-dot", 4.5); if (lab) p += T(X(x) + 8, Y(y) - 7, lab, "start", 12); }
    return svg(W, H, `<defs><clipPath id="${id}"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${p}`, o.lab || "repère");
  };

  // ---------- brique « slide » (curseurs ; copie de act_col34b.js, sans question tapée) ----------
  const slide = (o) => (box, onWin) => {
    let step = 0, st = null, done = false;
    const start = () => {
      st = Object.assign({}, o.init(step));
      const cs = o.ctl(step);
      box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
        `<div class="act-out s2c-out" aria-live="polite"></div><div class="small muted">${(typeof o.note === "function" ? o.note(step) : o.note) || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
      box.querySelectorAll('input[type="range"]').forEach((inp) => {
        inp.oninput = () => { if (done) return; st[inp.dataset.k] = +inp.value; refresh(); };
        inp.onchange = () => { if (done) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
      });
      refresh();
    };
    const refresh = () => {
      box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
      box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
      box.querySelector(".s2c-out").innerHTML = o.out(st, step);
    };
    const check = () => {
      if (done) return;
      const mm = o.goal[step](st);
      if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
      onWin(step, mm); step++;
      if (step < o.goal.length) start(); else done = true;
    };
    start();
  };
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;

  // ---------- figures ----------
  /* quadrillage cols × rows, axe vertical x = v ou horizontal y = h, points [x, y, nom, cls] */
  const grid = (o) => { const s = 22, W = o.cols * s + 24, H = o.rows * s + 24, gx = (x) => 12 + x * s, gy = (y) => 12 + (o.rows - y) * s; let g = "";
    for (let i = 0; i <= o.cols; i++) g += L(gx(i), gy(0), gx(i), gy(o.rows), "f-grid", 0.9);
    for (let j = 0; j <= o.rows; j++) g += L(gx(0), gy(j), gx(o.cols), gy(j), "f-grid", 0.9);
    if (o.v !== undefined) g += L(gx(o.v), gy(0) + 6, gx(o.v), gy(o.rows) - 6, "f-accent", 2.4, "7 4") + T(gx(o.v) + 5, gy(o.rows) + 3, "(d)", "start", 12, "f-accent f-txt");
    if (o.h !== undefined) g += L(gx(0) - 6, gy(o.h), gx(o.cols) + 6, gy(o.h), "f-accent", 2.4, "7 4") + T(gx(o.cols) - 3, gy(o.h) - 5, "(d)", "end", 12, "f-accent f-txt");
    for (const [a, b] of o.segs || []) g += L(gx(a[0]), gy(a[1]), gx(b[0]), gy(b[1]), "f-line", 1.2, "3 3");
    for (const [x, y, nm, cls] of o.pts) g += dot(gx(x), gy(y), cls) + T(gx(x) + 7, gy(y) - 7, nm, "start", 13);
    return svg(W, H, g, o.lab || "quadrillage"); };
  /* empilement (perspective cavalière) : h[x][y], x de gauche à droite, y de l'avant vers l'arrière */
  const cubes = (h) => { const nx = h.length, ny = h[0].length, s = 28, k = 0.42 * s, P = (x, y, z) => [x * s + y * k, -z * s - y * k], Hm = 4;
    const [a] = P(0, 0, 0), [b] = P(nx, ny, 0), top = P(0, ny, Hm)[1], ox = (320 - (b - a)) / 2 - a, oy = 10 - top, Q = (x, y, z) => { const [u, v] = P(x, y, z); return [ox + u, oy + v]; };
    let g = "";
    for (let y = ny - 1; y >= 0; y--) for (let x = 0; x < nx; x++) for (let z = 0; z < h[x][y]; z++) {
      g += Pg([Q(x, y, z), Q(x + 1, y, z), Q(x + 1, y, z + 1), Q(x, y, z + 1)], "f-shape", ' stroke-width="1.3"');
      g += Pg([Q(x, y, z + 1), Q(x + 1, y, z + 1), Q(x + 1, y + 1, z + 1), Q(x, y + 1, z + 1)], "f-shape2", ' stroke-width="1.3"');
      g += Pg([Q(x + 1, y, z), Q(x + 1, y + 1, z), Q(x + 1, y + 1, z + 1), Q(x + 1, y, z + 1)], "f-shape", ' style="fill:var(--blue);fill-opacity:.5" stroke-width="1.3"'); }
    return svg(320, Math.round(oy + 6), g, "empilement de cubes"); };
  const faceView = (f) => { const s = 20; let g = ""; f.forEach((z, x) => { for (let k = 0; k < z; k++) g += `<rect x="${110 + x * s}" y="${8 + (3 - k) * s}" width="${s}" height="${s}" class="f-shape2"/>`; }); return svg(320, 100, g + T(100, 70, "vue de face", "end", 11), "vue de face à obtenir"); };

  Object.assign(ACTIVE, {
    // =========================== 6e ===========================
    symax: {
      retiens: { regle: "Le symétrique \\(A'\\) de \\(A\\) par rapport à \\((d)\\) est sur la perpendiculaire à \\((d)\\) passant par \\(A\\), à la même distance de \\((d)\\), de l'autre côté : \\((d)\\) est la médiatrice de \\([AA']\\).",
        exemple: ["Axe vertical : \\(A\\) à 3 carreaux à gauche de \\((d)\\), \\(A'\\) à 3 carreaux à droite, sur la même ligne.", "Axe horizontal : \\(A\\) à 2 carreaux au-dessus, \\(A'\\) à 2 carreaux au-dessous, sur la même colonne."],
        piege: "On ne fait pas glisser le point le long de l'axe : \\(A'\\) reste sur la perpendiculaire à \\((d)\\)." },
      predict: { q: "A est à 3 carreaux à gauche d'un axe vertical (d). Où est son symétrique A' ?", choices: ["3 carreaux à droite de (d), même ligne", "6 carreaux à droite de (d)", "3 carreaux au-dessous de A"], good: 0,
        why: "On plie le long de (d) : A vient se poser à la même distance de l'axe, de l'autre côté, sur la même ligne." },
      defis: ["Place A', le symétrique de A par rapport à l'axe vertical (d).", "Même chose avec un axe horizontal."],
      play: slide({
        ctl: () => [{ k: "x", lab: "Colonne de A'", min: 0, max: 12 }, { k: "y", lab: "Ligne de A'", min: 0, max: 8 }],
        init: (s) => (s ? { x: 4, y: 4 } : { x: 6, y: 2 }),
        fig: (st, s) => grid(s ? { cols: 12, rows: 8, h: 3, pts: [[8, 6, "A"], [st.x, st.y, "A'", "f-fill"]], segs: [[[8, 6], [st.x, st.y]]], lab: "point A, axe horizontal et point A'" } : { cols: 12, rows: 8, v: 5, pts: [[2, 5, "A"], [st.x, st.y, "A'", "f-fill"]], segs: [[[2, 5], [st.x, st.y]]], lab: "point A, axe vertical et point A'" }),
        out: (st, s) => s ? "A est à <b>3</b> carreaux au-dessus de (d). A' est à " + nb(Math.abs(st.y - 3)) + " carreau(x) " + (st.y >= 3 ? "au-dessus" : "au-dessous") + (st.x === 8 ? ", sur la même colonne." : ", pas sur la même colonne que A.")
          : "A est à <b>3</b> carreaux à gauche de (d). A' est à " + nb(Math.abs(st.x - 5)) + " carreau(x) " + (st.x >= 5 ? "à droite" : "à gauche") + (st.y === 5 ? ", sur la même ligne." : ", pas sur la même ligne que A."),
        goal: [(st) => (st.x === 8 && st.y === 5 ? "A' est à 3 carreaux à droite de (d), sur la même ligne que A : (d) coupe [AA'] en son milieu, à angle droit." : ""),
          (st) => (st.x === 8 && st.y === 0 ? "A' est à 3 carreaux au-dessous de (d), sur la même colonne que A." : "")],
        miss: (st, s) => (s ? (st.x !== 8 ? "A' doit rester sur la colonne de A (perpendiculaire à l'axe)." : "Même distance à l'axe que A, de l'autre côté.") : (st.y !== 5 ? "A' doit rester sur la ligne de A (perpendiculaire à l'axe)." : "Même distance à l'axe que A, de l'autre côté.")),
      }),
    },

    mediatrice: {
      retiens: { regle: "Un point \\(M\\) est sur la médiatrice de \\([AB]\\) exactement quand \\(MA = MB\\). La médiatrice est la perpendiculaire à \\([AB]\\) en son milieu.",
        exemple: ["\\(A\\) en 2, \\(B\\) en 8 : les points à égale distance de \\(A\\) et de \\(B\\) sont sur la droite verticale qui passe par 5.", "\\(A\\) en 1, \\(B\\) en 7 : médiatrice en 4."],
        piege: "Le point doit être à égale distance des deux extrémités, à n'importe quelle hauteur : la médiatrice est une droite, pas un seul point." },
      predict: { q: "A est en 2 et B en 8 sur une droite graduée. Les points à égale distance de A et de B sont…", choices: ["sur la perpendiculaire en 5", "seulement le point 5", "sur la droite (AB)"], good: 0,
        why: "Tous les points de la perpendiculaire à [AB] en son milieu (5) sont à égale distance de A et de B : c'est la médiatrice." },
      defis: ["Déplace M (à 4 unités au-dessus de l'axe) pour que MA = MB.", "Même chose avec A en 1, B en 7 et M à 3 unités au-dessus."],
      play: slide({
        ctl: () => [{ k: "x", lab: "Abscisse de M", min: 0, max: 10, step: 0.5 }],
        init: (s) => ({ x: s ? 6 : 2 }),
        fig: (st, s) => { const A = s ? 1 : 2, B = s ? 7 : 8, h = s ? 3 : 4; return graph({ xr: [-0.5, 10.5], yr: [-1, 5], gx: 1, gy: 1, lx: 1, ly: 1, H: 200, segs: [[A, 0, B, 0, "f-line", 3], [A, 0, st.x, h, "f-blue", 2], [B, 0, st.x, h, "f-blue", 2]], pts: [[A, 0, "A"], [B, 0, "B"], [st.x, h, "M", "f-fill"]], lab: "segment AB et point M" }); },
        out: (st, s) => { const A = s ? 1 : 2, B = s ? 7 : 8, h = s ? 3 : 4, ma = Math.hypot(st.x - A, h), mb = Math.hypot(st.x - B, h); return "MA ≈ <b>" + nb(+ma.toFixed(2)) + "</b> · MB ≈ <b>" + nb(+mb.toFixed(2)) + "</b>" + (near(ma, mb) ? " : égales" : ""); },
        goal: [(st) => (st.x === 5 ? "MA = MB = √(3² + 4²) = 5 : M est sur la perpendiculaire à [AB] en son milieu (5), la médiatrice." : ""),
          (st) => (st.x === 4 ? "M est au-dessus du milieu 4 de [AB] : MA = MB. Quelle que soit la hauteur, la médiatrice passe par le milieu." : "")],
        miss: (st) => "Rapproche M du point de l'axe qui est à mi-chemin entre A et B.",
      }),
    },

    echelle6: {
      retiens: { regle: "Échelle \\(\\frac{1}{n}\\) : 1 cm sur le plan représente \\(n\\) cm en réalité. Longueur sur le plan = longueur réelle ÷ \\(n\\), dans la même unité.",
        exemple: ["Mur de 6 m = 600 cm, dessiné par 3 cm : \\(600 \\div 3 = 200\\), échelle \\(\\frac{1}{200}\\).", "Carte au \\(\\frac{1}{25\\,000}\\) : 2 km = 200 000 cm, sur la carte \\(200\\,000 \\div 25\\,000 = 8\\) cm."],
        piege: "Convertis avant de diviser : 6 m ÷ 3 cm ne donne pas l'échelle, 600 cm ÷ 3 cm oui." },
      predict: { q: "Sur un plan au 1/100, un mur de 4 m mesure…", choices: ["4 cm", "40 cm", "400 cm"], good: 0,
        why: "4 m = 400 cm ; au 1/100, on divise par 100 : 4 cm sur le plan." },
      defis: ["Choisis l'échelle pour qu'un mur de 6 m mesure 3 cm sur le plan.", "Carte au 1/25 000 : règle la longueur sur la carte pour représenter 2 km."],
      play: slide({
        ctl: (s) => [s ? { k: "c", lab: "Longueur sur la carte (cm)", min: 1, max: 12, step: 0.5 } : { k: "n", lab: "Échelle 1/n, n", min: 50, max: 500, step: 50 }],
        init: (s) => (s ? { c: 3 } : { n: 100 }),
        fig: (st, s) => { const cmv = s ? st.c : 600 / st.n, px = Math.min(300, cmv * 25); return svg(320, 70, L(10, 30, 10 + px, 30, "f-accent", 5) + L(10, 22, 10, 38) + L(10 + px, 22, 10 + px, 38) + T(10, 58, "0", "middle", 11) + T(10 + Math.min(px, 290), 58, nb(+cmv.toFixed(2)) + " cm", "middle", 11), "segment dessiné sur le plan"); },
        out: (st, s) => s ? nb(st.c) + " cm × 25 000 = " + nb(st.c * 25000) + " cm = <b>" + nb(st.c * 0.25) + " km</b> en réalité" : "6 m = 600 cm ; au 1/" + st.n + " : 600 ÷ " + st.n + " = <b>" + nb(+(600 / st.n).toFixed(2)) + " cm</b> sur le plan",
        goal: [(st) => (st.n === 200 ? "Au 1/200 : 600 cm ÷ 200 = 3 cm. On divise la longueur réelle par la longueur du plan, en cm : 600 ÷ 3 = 200." : ""), (st) => (st.c === 8 ? "8 cm × 25 000 = 200 000 cm = 2 km (1 km = 100 000 cm)." : "")],
        miss: (st, s) => (s ? "2 km = 200 000 cm ; divise par 25 000." : "Plus n est grand, plus le dessin est petit."),
      }),
    },

    proba6: {
      retiens: { regle: "Quand toutes les issues ont la même chance : \\(P = \\frac{\\text{issues favorables}}{\\text{issues possibles}}\\). Ajouter des boules rouges change les deux nombres.",
        exemple: ["2 rouges et 6 bleues : \\(P(\\text{rouge}) = \\frac{2}{8} = \\frac{1}{4}\\).", "9 rouges et 6 bleues : \\(P(\\text{rouge}) = \\frac{9}{15} = 0{,}6\\)."],
        piege: "On divise par le nombre total de boules, pas par le nombre de boules bleues." },
      predict: { q: "Un sac contient 2 boules rouges et 6 bleues. La probabilité de tirer une rouge est…", choices: ["1/4", "1/3", "2/6"], good: 0,
        why: "8 boules en tout, dont 2 rouges : 2/8 = 1/4. (2/6 compare les rouges aux bleues, pas au total.)" },
      defis: ["Le sac contient 6 boules bleues. Mets des rouges pour que P(rouge) = 1/4.", "Maintenant pour que P(rouge) = 0,6."],
      play: slide({
        ctl: () => [{ k: "r", lab: "Boules rouges", min: 0, max: 12 }],
        init: (s) => ({ r: s ? 3 : 0 }),
        fig: (st) => FIG.urn({ rouges: st.r, bleues: 6 }),
        out: (st) => "P(rouge) = " + st.r + "/" + (st.r + 6) + " ≈ <b>" + nb(+(st.r / (st.r + 6)).toFixed(3)) + "</b>",
        goal: [(st) => (st.r === 2 ? "2 rouges sur 8 boules : 2/8 = 1/4." : ""), (st) => (st.r === 9 ? "9 rouges sur 15 boules : 9/15 = 3/5 = 0,6." : "")],
        miss: (st, s) => (s ? "0,6 = 3/5 : il faut 3 rouges pour 2 bleues." : "1/4 : une boule sur quatre est rouge."),
      }),
    },

    // =========================== 5e ===========================
    empil: {
      retiens: { regle: "Vue de face : dans chaque colonne, autant de carrés que la pile la plus haute. Nombre de cubes : on additionne les hauteurs de toutes les piles.",
        exemple: ["Piles de derrière 3, 1, 2 devant des piles de 1 : vue de face 3, 1, 2.", "Avec 3 cubes devant et 9 derrière : 12 cubes, quelle que soit la façon de répartir les 9."],
        piege: "Sur la vue de face, les piles de devant et de derrière ne s'additionnent pas : on voit la plus haute." },
      predict: { q: "Une pile de 3 cubes est derrière une pile de 1 cube. Sur la vue de face, cette colonne montre…", choices: ["3 carrés", "4 carrés", "1 carré"], good: 0,
        why: "De face, on voit la pile la plus haute (3) ; la pile de devant cache le bas de celle de derrière." },
      defis: ["Règle les piles de derrière pour obtenir la vue de face dessinée (3, 1, 2).", "Obtiens un empilement de 12 cubes en tout."],
      play: slide({
        ctl: () => [{ k: "a", lab: "Pile de gauche (derrière)", min: 1, max: 4 }, { k: "b", lab: "Pile du milieu (derrière)", min: 1, max: 4 }, { k: "c", lab: "Pile de droite (derrière)", min: 1, max: 4 }],
        init: (s) => (s ? { a: 2, b: 2, c: 2 } : { a: 1, b: 2, c: 4 }),
        fig: (st, s) => cubes([[1, st.a], [1, st.b], [1, st.c]]) + (s ? "" : faceView([3, 1, 2])),
        out: (st) => "Vue de face : " + [st.a, st.b, st.c].join(", ") + " · nombre de cubes : 3 + " + st.a + " + " + st.b + " + " + st.c + " = <b>" + (3 + st.a + st.b + st.c) + "</b>",
        goal: [(st) => (st.a === 3 && st.b === 1 && st.c === 2 ? "Les piles de derrière (3, 1, 2) dépassent celles de devant (1) : la vue de face montre 3, 1 et 2 carrés." : ""),
          (st) => (st.a + st.b + st.c === 9 ? "3 cubes devant + " + (st.a + st.b + st.c) + " derrière = 12 cubes (on compte aussi les cubes cachés en bas)." : "")],
        miss: (st, s) => (s ? "Compte aussi les 3 cubes de la rangée de devant." : "Chaque colonne de la vue de face montre la pile la plus haute."),
        note: (s) => "Fais glisser les curseurs : on vérifie quand tu lâches.",
      }),
    },

    // =========================== 2nde ===========================
    compdiff: {
      retiens: { regle: "Pour comparer \\(A\\) et \\(B\\), on étudie le signe de \\(A - B\\). Si \\(A\\) et \\(B\\) sont positifs, on peut comparer \\(\\frac{A}{B}\\) à 1.",
        exemple: ["\\(A = x^2 + 9\\), \\(B = 6x\\) : \\(A - B = (x - 3)^2 \\geqslant 0\\), égal à 0 seulement pour \\(x = 3\\).", "\\(\\frac{2^{10}}{1\\,000} = 1{,}024 > 1\\) : \\(2^{10} > 1\\,000\\), alors que \\(2^9 = 512\\)."],
        piege: "Un quotient se compare à 1 (pas à 0), et seulement pour des nombres positifs." },
      predict: { q: "Pour tout x, comparer x² + 9 et 6x : laquelle est vraie ?", choices: ["x² + 9 ≥ 6x toujours", "x² + 9 < 6x pour x grand", "Ça dépend de x"], good: 0,
        why: "x² + 9 − 6x = (x − 3)², un carré : jamais négatif. Donc x² + 9 ≥ 6x pour tout x." },
      defis: ["A = x² + 9 et B = 6x. Trouve x qui rend A − B le plus petit possible.", "Trouve le plus petit entier n tel que 2ⁿ ÷ 1 000 > 1."],
      play: slide({
        ctl: (s) => [s ? { k: "n", lab: "n", min: 1, max: 14 } : { k: "x", lab: "x", min: -2, max: 8, step: 0.5 }],
        init: (s) => (s ? { n: 4 } : { x: 0 }),
        fig: (st, s) => s ? graph({ xr: [0, 15], yr: [0, 2.2], gx: 1, gy: 0.2, lx: 2, ly: 0.4, H: 170, segs: [[0, 1, 15, 1, "f-accent", 2, "6 4"], [st.n, 0, st.n, Math.min(2.2, 2 ** st.n / 1000), "f-blue", 6]], lab: "quotient 2 puissance n sur 1000" })
          : graph({ xr: [-2.5, 8.5], yr: [-5, 90], gx: 1, gy: 10, lx: 2, ly: 20, H: 200, fns: [{ f: (x) => x * x + 9, cls: "f-blue" }, { f: (x) => 6 * x, cls: "f-accent" }], segs: [[st.x, 6 * st.x, st.x, st.x * st.x + 9, "f-line", 3]], lab: "courbes de A et B" }),
        out: (st, s) => s ? "2^" + st.n + " = " + (2 ** st.n) + " ; quotient 2^" + st.n + " ÷ 1 000 = <b>" + nb(2 ** st.n / 1000) + "</b>" + (2 ** st.n > 1000 ? " > 1" : " < 1") : "A = " + nb(st.x * st.x + 9) + " · B = " + nb(6 * st.x) + " · A − B = <b>" + nb(st.x * st.x + 9 - 6 * st.x) + "</b>",
        goal: [(st) => (st.x === 3 ? "A − B = (x − 3)² vaut 0 en x = 3 et reste positif ailleurs : A ≥ B pour tout x." : ""), (st) => (st.n === 10 ? "2¹⁰ = 1 024 : le quotient 1,024 dépasse 1 (pour n = 9, 0,512 < 1)." : "")],
        miss: (st, s) => (s ? (2 ** st.n > 1000 ? "Le quotient dépasse 1, mais cherche le plus petit n." : "Le quotient est encore inférieur à 1.") : "Le segment mesure A − B : rends-le le plus court possible."),
      }),
    },

    // =========================== 1re ===========================
    posrelc: {
      retiens: { regle: "On étudie le signe de \\(d(x) = f(x) - g(x)\\) : \\(d(x) > 0\\), \\(C_f\\) au-dessus ; \\(d(x) = 0\\), point commun ; \\(d(x) < 0\\), au-dessous.",
        exemple: ["\\(f(x) = x^2\\), \\(g(x) = x + 2\\) : \\(d(x) = (x - 2)(x + 1)\\), points communs en \\(-1\\) et 2.", "Entre \\(-1\\) et 2, \\(d(x) < 0\\) : la parabole est sous la droite ; l'écart est le plus grand en \\(x = \\frac{1}{2}\\)."],
        piege: "On compare \\(f(x)\\) et \\(g(x)\\) pour un même \\(x\\) : c'est le signe de la différence qui compte." },
      predict: { q: "f(x) = x² et g(x) = x + 2. En x = 0, la parabole est…", choices: ["sous la droite", "sur la droite", "au-dessus de la droite"], good: 0,
        why: "f(0) = 0 et g(0) = 2 : d(0) = −2 < 0, la parabole est au-dessous." },
      defis: ["Déplace x jusqu'au point commun d'abscisse positive.", "Trouve x où la parabole est le plus loin sous la droite."],
      play: slide({
        ctl: () => [{ k: "x", lab: "x", min: -3, max: 4, step: 0.5 }],
        init: (s) => ({ x: s ? -2 : 0 }),
        fig: (st) => graph({ xr: [-3.3, 4.3], yr: [-2, 10], gx: 1, gy: 1, lx: 1, ly: 2, H: 220, fns: [{ f: (x) => x * x, cls: "f-blue" }, { f: (x) => x + 2, cls: "f-accent" }], segs: [[st.x, st.x * st.x, st.x, st.x + 2, "f-line", 3]], pts: [[st.x, st.x * st.x, "", "f-dot"]], lab: "parabole et droite" }),
        out: (st) => { const d = st.x * st.x - st.x - 2; return "f(x) = " + nb(st.x * st.x) + " · g(x) = " + nb(st.x + 2) + " · d(x) = f(x) − g(x) = <b>" + nb(d) + "</b> : " + (d > 0 ? "C_f au-dessus" : d < 0 ? "C_f au-dessous" : "point commun"); },
        goal: [(st) => (st.x === 2 ? "d(2) = 4 − 4 = 0 : point commun. d(x) = (x − 2)(x + 1) s'annule aussi en −1." : ""), (st) => (st.x === 0.5 ? "d(0,5) = −2,25 : c'est le minimum de d (sommet en x = 1/2), le plus grand écart sous la droite." : "")],
        miss: (st, s) => (s ? "Cherche le x où d(x) est le plus négatif." : "Le segment doit disparaître (d(x) = 0), avec x > 0."),
      }),
    },

    // =========================== Tle ===========================
    intmaj: {
      retiens: { regle: "Pour une fonction décroissante sur \\([a \\,;\\, b]\\), les rectangles de hauteur la valeur à droite sont sous la courbe, ceux de hauteur la valeur à gauche au-dessus : ils encadrent l'intégrale. Avec \\(n\\) rectangles, l'écart vaut \\(\\frac{(b - a)(f(a) - f(b))}{n}\\).",
        exemple: ["\\(\\int_1^2 \\frac{dx}{x}\\) avec 5 rectangles : écart \\(\\frac{1 \\times 0{,}5}{5} = 0{,}1\\).", "Avec 9 rectangles : écart \\(\\frac{0{,}5}{9} \\approx 0{,}056\\)."],
        piege: "Plus on prend de rectangles, plus l'encadrement est précis : l'écart est divisé par \\(n\\)." },
      predict: { q: "On encadre ∫₁² dx/x avec des rectangles. Si on double leur nombre, l'écart entre le minorant et le majorant…", choices: ["est divisé par 2", "ne change pas", "est divisé par 4"], good: 0,
        why: "Pour une fonction monotone, l'écart vaut (b − a)(f(a) − f(b)) ÷ n : il est divisé par 2 quand n double." },
      defis: ["Choisis le plus petit nombre de rectangles pour un écart au plus égal à 0,1.", "Et pour un écart inférieur à 0,06."],
      play: slide({
        ctl: () => [{ k: "n", lab: "Nombre de rectangles", min: 1, max: 12 }],
        init: (s) => ({ n: s ? 2 : 1 }),
        fig: (st) => { const n = st.n, h = 1 / n, polys = []; for (let k = 0; k < n; k++) { const a = 1 + k * h, b = a + h; polys.push([[[a, 0], [b, 0], [b, 1 / a], [a, 1 / a]], "f-soft", 0.8], [[[a, 0], [b, 0], [b, 1 / b], [a, 1 / b]], "f-fill2", 0.9]); }
          return graph({ xr: [0.8, 2.2], yr: [-0.1, 1.15], gx: 0.1, gy: 0.1, lx: 0.2, ly: 0.2, H: 210, polys, fns: [{ f: (x) => 1 / x, from: 0.85, cls: "f-blue" }], lab: "rectangles sous et sur la courbe de 1/x" }); },
        out: (st) => { const n = st.n; let lo = 0, up = 0; for (let k = 0; k < n; k++) { up += 1 / (n + k); lo += 1 / (n + k + 1); } return "minorant ≈ " + nb(+lo.toFixed(4)) + " · majorant ≈ " + nb(+up.toFixed(4)) + " · écart = 0,5 ÷ " + n + " ≈ <b>" + nb(+(0.5 / n).toFixed(4)) + "</b>"; },
        goal: [(st) => (st.n === 5 ? "Écart 0,5 ÷ 5 = 0,1 : 0,646 ≤ ln 2 ≤ 0,746." : ""), (st) => (st.n === 9 ? "Écart 0,5 ÷ 9 ≈ 0,056 < 0,06 (avec 8 : 0,0625, trop grand)." : "")],
        miss: (st, s) => (0.5 / st.n <= (s ? 0.06 : 0.1) ? "L'écart convient, mais cherche le plus petit nombre de rectangles." : "Écart encore trop grand : ajoute des rectangles."),
      }),
    },

    suiteint: {
      retiens: { regle: "\\(I_n = \\int_0^1 x^n\\,dx = \\frac{1}{n + 1}\\). Sur \\([0 \\,;\\, 1]\\), \\(x^{n+1} \\leqslant x^n\\) : la suite décroît, et tend vers 0.",
        exemple: ["\\(I_4 = \\frac{1}{5} = 0{,}2\\).", "\\(I_n < 0{,}1 \\iff n + 1 > 10 \\iff n \\geqslant 10\\)."],
        piege: "\\(I_9 = \\frac{1}{10} = 0{,}1\\) n'est pas strictement inférieur à 0,1." },
      predict: { q: "Sur [0 ; 1], quand n augmente, l'aire sous la courbe de xⁿ…", choices: ["diminue", "augmente", "reste la même"], good: 0,
        why: "Pour 0 ≤ x ≤ 1, x^(n+1) = x · xⁿ ≤ xⁿ : la courbe descend, l'aire diminue (elle vaut 1/(n + 1))." },
      defis: ["Trouve n pour que l'aire Iₙ vaille 0,2.", "Trouve le plus petit n tel que Iₙ < 0,1."],
      play: slide({
        ctl: () => [{ k: "n", lab: "n", min: 0, max: 14 }],
        init: (s) => ({ n: s ? 3 : 1 }),
        fig: (st) => { const n = st.n, P = [[0, 0]]; for (let i = 0; i <= 60; i++) P.push([i / 60, (i / 60) ** n]); P.push([1, 0]);
          return graph({ xr: [-0.1, 1.15], yr: [-0.1, 1.15], gx: 0.1, gy: 0.1, lx: 0.2, ly: 0.2, H: 230, polys: [[P, "f-fill2", 0.8]], fns: [{ f: (x) => x ** n, from: 0, to: 1, cls: "f-blue" }], lab: "aire sous x puissance n entre 0 et 1" }); },
        out: (st) => "Iₙ = 1/(n + 1) = 1/" + (st.n + 1) + " ≈ <b>" + nb(+(1 / (st.n + 1)).toFixed(4)) + "</b>",
        goal: [(st) => (st.n === 4 ? "I₄ = 1/5 = 0,2." : ""), (st) => (st.n === 10 ? "I₁₀ = 1/11 ≈ 0,091 < 0,1 ; I₉ = 0,1 exactement, pas strictement inférieur." : "")],
        miss: (st, s) => (s ? (1 / (st.n + 1) < 0.1 ? "C'est inférieur à 0,1, mais cherche le plus petit n." : "Iₙ est encore au moins égal à 0,1.") : "Iₙ = 1/(n + 1) : pour 0,2 = 1/5, que vaut n + 1 ?"),
      }),
    },
  });
})();

