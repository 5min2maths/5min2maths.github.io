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
      () => { const c = pk(BCTX), n = R.int(2, 4), p = pk(c[5]), all = R.rand() < 0.5, v = rnd(all ? p ** n : (1 - p) ** n);
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
    { pop: "salariés", lieu: "une entreprise de Bordeaux", un: "un salarié", A: "C", tA: "le salarié est cadre", rA: ["Cadres", "Non-cadres"], B: "W", tB: "le salarié télétravaille", cB: ["Télétravail", "Sur site"] },
    { pop: "clients", lieu: "une librairie de Strasbourg", un: "un client", A: "E", tA: "le client est étudiant", rA: ["Étudiants", "Autres"], B: "N", tB: "le client a acheté une BD", cB: ["BD", "Pas de BD"] },
  ];
  const crois = () => { const c = pk(CROIS), k = pk([1, 2, 5]), a = R.int(6, 30) * k, b = R.int(6, 30) * k, cc = R.int(6, 30) * k, d = R.int(6, 30) * k; return { c, a, b, cc, d, N: a + b + cc + d }; };
  const tab = (T, hide) => { const { c, a, b, cc, d, N } = T, v = { a, b, cc, d }, cell = (k) => (hide === k ? "\\boldsymbol{?}" : nf(v[k]));
    return M("\\begin{array}{l|c|c|c} & \\text{" + c.cB[0] + "} & \\text{" + c.cB[1] + "} & \\text{Total} \\\\ \\hline \\text{" + c.rA[0] + "} & " + cell("a") + " & " + cell("b") + " & " + nf(a + b) + " \\\\ \\text{" + c.rA[1] + "} & " + cell("cc") + " & " + cell("d") + " & " + nf(cc + d) + " \\\\ \\hline \\text{Total} & " + nf(a + cc) + " & " + nf(b + d) + " & " + nf(N) + " \\end{array}"); };
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
          { ctx: op === ">" ? "inverse-sup" : "inverse-inf", fig: FIG.plot([{ f: (x) => (Math.abs(x) > 0.05 ? 1 / x : NaN) }], [], { xr: [-4, 4], yr: [-4, 4], hlines: k <= 3.5 ? [k] : [], numbers: false, label: "hyperbole y = 1/x" }),
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
        return QN("Qu'affiche ce programme ? (" + M("\\texttt{range(" + a + ", " + n + ")}") + " parcourt les entiers de " + a + " à " + (n - 1) + ".)" + PY(["s = 0", "for i in range(" + a + ", " + n + "):", "    s = s + " + (k === 1 ? "i" : k + " * i"), "print(s)"]), v, "On ajoute " + (k === 1 ? "" : k + " fois ") + "les entiers de " + M(a) + " à " + M(n - 1) + " (" + M(n) + " est exclu) : " + M((k === 1 ? "" : k + " \\times (") + Array.from({ length: n - a }, (_, j) => a + j).join(" + ") + (k === 1 ? "" : ")") + " = " + v) + ".",
          { ctx: "boucle-for", guide: [GS("Dernière valeur prise par " + M("\\texttt{i}") + " ?", n - 1, M(n - 1) + " : la borne " + n + " est exclue."), GS("Valeur affichée ?", v, M(v) + ".")], traps: [TR(incl, "range(" + a + ", " + n + ") s'arrête à " + (n - 1) + " : " + n + " n'est pas compris."), TR(n - a, "Ça, c'est le nombre de tours ; s accumule les valeurs.")] }); },
      () => { const S = pk([["capital", "Un livret d'épargne de", "€ rapporte", "Au bout de combien d'années le capital dépasse-t-il le seuil ?"], ["population", "Une colonie de bactéries de", "individus grandit de", "Combien d'heures faut-il pour dépasser le seuil ?"]]), u0 = pk([100, 200, 500, 1000]), m = pk([1.5, 2, 1.25]), seuil = u0 * pk([3, 5, 8, 10]); let u = u0, n = 0; while (u < seuil) { u *= m; n++; }
        return QN("Qu'affiche ce programme ?" + PY(["u = " + u0, "n = 0", "while u < " + seuil + ":", "    u = u * " + String(m), "    n = n + 1", "print(n)"]), n, "On multiplie " + M("u") + " par " + M(nf(m)) + " tant que " + M("u < " + nf(seuil)) + " : " + (() => { let w = u0, L = [nf(w)]; for (let i = 0; i < n; i++) { w = r9(w * m); L.push(nf(w)); } return M(L.join(" \\to ")); })() + ". La boucle tourne " + M(n) + " fois.",
          { ctx: "boucle-while", guide: [GS("Valeur de " + M("u") + " après un tour ?", r9(u0 * m), M(nf(r9(u0 * m)))+ "."), GS("Nombre de tours (valeur de n à la fin) ?", n, M(n) + " : après " + n + " tours, " + M("u = " + nf(r9(u))) + " n'est plus inférieur à " + M(nf(seuil)) + ".")], traps: [TR(n - 1, "La boucle s'arrête seulement quand u ≥ " + seuil + " : compte aussi le dernier tour."), TR(n + 1, "Quand u atteint ou dépasse " + seuil + ", on sort de la boucle sans incrémenter n.")] }); },
      () => { const a = pk([2, 3, -1]), b = nz(-3, 4), u0 = R.int(1, 4), n = R.int(3, 4); let u = u0; const L = [u]; for (let k = 0; k < n; k++) { u = a * u + b; L.push(u); } if (Math.abs(u) > 400) return null;
        return QN("Qu'affiche ce programme ?" + PY(["u = " + u0, "for k in range(" + n + "):", "    u = " + (a === -1 ? "-u" : a + " * u") + (b < 0 ? " - " + -b : " + " + b), "print(u)"]), u, "La boucle tourne " + M(n) + " fois : " + M(L.join(" \\to ")) + ".",
          { ctx: "suite", guide: [GS("Valeur de " + M("u") + " après le 1er tour ?", L[1], M(L[1]) + "."), GS("Après le 2e tour ?", L[2], M(L[2]) + "."), GS("Valeur affichée (après " + n + " tours) ?", u, M(u) + ".")], traps: [TR(L[n - 1], "range(" + n + ") fait " + n + " tours (k = 0 à " + (n - 1) + ")."), TR(a * L[n] + b, "range(" + n + ") fait exactement " + n + " tours, pas " + (n + 1) + ".")] }); },
    ],
  };

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
    motifs: [6, [7]], automat: [6, [7, 8, 9]], structexpr: [7, [8, 9]], progcalc: [8, [9]], ratio: [8, [9]], milieux: [8, [9]],
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
  7: ["prio", "relrep", "reladd", "structexpr", "tradexpr", "litelab", "valnum", "divcrit", "angles", "quadri", "repere", "symetries",
    "eqverif", "distrib", "reduire", "parenth", "factor", "aire2", "aire3", "uvol", "vol", "pow9", "eq1", "probeq", "statfreq", "diagr",
    "proba", "vitesse"],
  8: ["rel", "fracmul", "fracops", "puiss", "sci", "progcalc", "carres", "racenc", "pyth", "pythrec", "pythfig", "cercthales", "premiers",
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
    if (t) { n.FR = [t[0]]; n.againFR = t[1] || []; continue; }
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

