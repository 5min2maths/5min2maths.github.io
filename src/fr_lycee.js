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
