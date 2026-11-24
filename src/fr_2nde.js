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
