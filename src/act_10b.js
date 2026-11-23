// Chantier 10e, chapitres 8 à 14 (23.11) : leçons actives (devine / défis / retiens) pour les notions de 10e qui n'en
// avaient pas et qui ne sont pas aussi en 9e : eqverif (9. Équations), echelle et pente (10. Proportionnalité),
// polyreg (12. Figures planes), rotation (13. Transformations). Calibrage : MER 10e (FA72–FA76 pente, FA52–FA56 échelle,
// ES11–ES14 polygones réguliers, ES77 et suivants rotations : angle positif = sens inverse des aiguilles d'une montre).
// Même moteur que act_ch11c.js (outils recopiés : le fichier reste autonome). Vraies manipulations seulement pour la
// balance (eqverif : on teste des valeurs) et la rotation (on fait tourner une figure) ; ailleurs l'élève calcule et tape,
// la figure se met à jour après « Vérifier ». Le « Retiens » vient de la leçon existante (LESSONS[id]).
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  // Milliers avec ' (1'400), virgule décimale.
  const mil = (v) => { const s = String(+(+v).toFixed(4)).split("."); return (s[0].replace("-", "−").replace(/\B(?=(\d{3})+(?!\d))/g, "'")) + (s[1] ? "," + s[1] : ""); };
  const par = (v) => (v < 0 ? "(" + nb(v) + ")" : nb(v));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ' stroke-dasharray="5 4"' : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Chercheur (recopié de act_ch11c.js) : mode réponse (o.ask) ou curseur (vraie manipulation).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };

  // ---------- eqverif : balance à deux plateaux ----------
  // Membre de gauche et membre de droite pour la valeur x ; le plateau le plus lourd descend.
  const EQ = [
    { g: (x) => 2 * x + 5, d: () => 17, tg: (x) => "2 · " + par(x) + " + 5", td: () => "17", lg: "2x + 5", ld: "17" },
    { g: (x) => 5 * x + 7, d: (x) => 2 * x - 2, tg: (x) => "5 · " + par(x) + " + 7", td: (x) => "2 · " + par(x) + " − 2", lg: "5x + 7", ld: "2x − 2" },
    { g: (x) => x * x + 6, d: (x) => 5 * x, tg: (x) => par(x) + "² + 6", td: (x) => "5 · " + par(x), lg: "x² + 6", ld: "5x" },
  ];
  const balance = (x, s) => {
    const e = EQ[s], a = e.g(x), b = e.d(x), th = (Math.max(-14, Math.min(14, (a - b) * 1.5)) * Math.PI) / 180;
    const cx = 160, cy = 42, r = 112, xl = cx - r * Math.cos(th), yl = cy + r * Math.sin(th), xr = cx + r * Math.cos(th), yr = cy - r * Math.sin(th);
    const pan = (px, py, val, cls) => L(px, py, px - 30, py + 34, "f-line", 1) + L(px, py, px + 30, py + 34, "f-line", 1) + `<rect x="${px - 38}" y="${py + 34}" width="76" height="20" rx="4" class="${cls}"/>` + T(px, py + 49, val, "middle", 13, "f-txt");
    let g = `<polygon points="${cx - 16},150 ${cx + 16},150 ${cx},${cy}" class="f-shape2"/>` + L(xl, yl, xr, yr, "f-line", 3) + `<circle cx="${cx}" cy="${cy}" r="4" class="f-dot"/>`;
    g += pan(xl, yl, nb(a), "f-fill2") + pan(xr, yr, nb(b), "f-fill2");
    g += T(cx - 100, 166, e.lg, "middle", 12, "f-txt") + T(cx + 100, 166, e.ld, "middle", 12, "f-txt");
    const eq = Math.abs(a - b) < 1e-9;
    return svg(320, 172, g, "balance : " + e.lg + " et " + e.ld) + plain("x = <b>" + nb(x) + "</b> : à gauche " + e.tg(x) + " = <b>" + nb(a) + "</b> ; à droite " + (s ? e.td(x) + " = " : "") + "<b>" + nb(b) + "</b>" + (eq ? ' <b class="act-ok">✓ égalité</b>' : " → " + "pas égaux (" + (a > b ? "gauche" : "droite") + " plus grand)"));
  };

  // ---------- echelle : plan, carte, pièce ----------
  const plan = (s, ans) => {
    let g = "";
    if (s === 0) { // plan d'un appartement au 1 : 200, un mur de 7 cm
      g += `<rect x="40" y="20" width="240" height="110" class="f-soft" stroke="var(--ink)" stroke-width="2"/>` + L(150, 20, 150, 130, "f-line", 2) + L(40, 80, 150, 80, "f-line", 2);
      g += L(40, 20, 280, 20, "f-accent", 4) + T(160, 14, "7 cm sur le plan", "middle", 11, "f-txt f-accent") + T(160, 150, "échelle 1 : 200" + (ans === undefined ? "" : " · en vrai : " + ans), "middle", 11);
      return svg(320, 158, g, "plan d'un appartement");
    }
    if (s === 1) { // carte au 1 : 25'000, deux villages à 3 km
      g += `<rect x="20" y="10" width="280" height="120" rx="6" class="f-soft"/>` + `<path d="M22,126 C100,104 190,132 298,108" class="f-blue" fill="none" stroke-width="2"/>`;
      g += `<circle cx="60" cy="96" r="5" class="f-dot"/>` + T(60, 114, "village", "middle", 11) + `<circle cx="260" cy="50" r="5" class="f-dot"/>` + T(260, 38, "ferme", "middle", 11);
      g += L(60, 96, 260, 50, "f-accent", 1.6, true) + T(150, 62, ans === undefined ? "? cm" : ans, "middle", 12, "f-txt f-accent");
      g += T(160, 148, "carte au 1 : 25'000 · en vrai : 3 km à vol d'oiseau", "middle", 11);
      return svg(320, 156, g, "carte avec deux villages");
    }
    // pièce de 4 cm sur 3 cm au 1 : 100
    const u = 32; g += `<rect x="${160 - 2 * u}" y="18" width="${4 * u}" height="${3 * u}" class="f-fill2"/>`;
    g += T(160, 12, "4 cm", "middle", 11) + T(160 + 2 * u + 6, 18 + 1.5 * u + 4, "3 cm", "start", 11) + T(160, 18 + 1.5 * u + 4, ans === undefined ? "aire réelle ?" : ans, "middle", 12, "f-txt f-accent");
    g += T(160, 140, "plan au 1 : 100", "middle", 11);
    return svg(320, 150, g, "plan d'une pièce");
  };

  // ---------- pente : route vue de profil ----------
  // dh = distance horizontale (m), p = pente juste (en %), q = pente proposée (en %, ou null).
  const ramp = (labs, p, q) => {
    const x0 = 20, y0 = 96, w = 240, k = 3; // hauteurs exagérées × 3 pour qu'on voie la montée
    const yt = y0 - Math.min(84, (w * p * k) / 100);
    let g = `<polygon points="${x0},${y0} ${x0 + w},${y0} ${x0 + w},${yt}" class="f-shape"/>`;
    if (q !== null && isFinite(q) && q >= 0) { const yq = y0 - Math.min(90, (w * q * k) / 100); g += L(x0, y0, x0 + w, yq, "f-accent", 2.4, true); }
    g += T(x0 + w / 2, y0 + 16, labs.h, "middle", 12) + T(x0 + w + 5, (y0 + yt) / 2 + 4, labs.v, "start", 12, /\?/.test(labs.v) ? "f-txt f-accent" : "f-txt") + T(x0 + w / 2 - 20, (y0 + yt) / 2 - 8, labs.p, "middle", 12, /\?/.test(labs.p) ? "f-txt f-accent" : "f-txt");
    return svg(320, 120, g, "profil d'une route") + `<div class="small muted">Hauteurs exagérées (× 3) pour mieux voir la montée.${q !== null ? " En pointillé : ta proposition." : ""}</div>`;
  };

  // ---------- polyreg : polygone régulier inscrit ----------
  const poly = (n, labC, labI) => {
    const cx = 160, cy = 80, r = 66, P = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    let g = `<polygon points="${P.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" class="f-shape"/>`;
    // triangle au centre OAB sur le côté du bas
    const i0 = Math.floor(n / 2), Q1 = P[i0 - 1 < 0 ? n - 1 : i0 - 1], Q2 = P[i0];
    g += L(cx, cy, Q1[0], Q1[1], "f-line", 1.2) + L(cx, cy, Q2[0], Q2[1], "f-line", 1.2) + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>` + T(cx - 8, cy - 6, "O", "end", 11);
    if (labC) { const m = [(Q1[0] + Q2[0]) / 2, (Q1[1] + Q2[1]) / 2]; g += T(cx + (m[0] - cx) * 0.42, cy + (m[1] - cy) * 0.42 + 4, labC, "middle", 12, /\?/.test(labC) ? "f-txt f-accent" : "f-txt f-blue"); }
    if (labI) { // angle intérieur marqué par un arc, au sommet opposé au triangle du centre
      const j = (i0 + Math.ceil(n / 2)) % n, V = P[j], U = P[(j + n - 1) % n], Z = P[(j + 1) % n], rr = 16;
      const e1 = [V[0] + ((U[0] - V[0]) * rr) / Math.hypot(U[0] - V[0], U[1] - V[1]), V[1] + ((U[1] - V[1]) * rr) / Math.hypot(U[0] - V[0], U[1] - V[1])], e2 = [V[0] + ((Z[0] - V[0]) * rr) / Math.hypot(Z[0] - V[0], Z[1] - V[1]), V[1] + ((Z[1] - V[1]) * rr) / Math.hypot(Z[0] - V[0], Z[1] - V[1])];
      g += `<path d="M${e1[0].toFixed(1)},${e1[1].toFixed(1)} A${rr},${rr} 0 0 1 ${e2[0].toFixed(1)},${e2[1].toFixed(1)}" class="f-accent" fill="none" stroke-width="1.6"/>`;
      g += T(V[0] + (cx - V[0]) * 0.42, V[1] + (cy - V[1]) * 0.42 + 4, labI, "middle", 12, /\?/.test(labI) ? "f-txt f-accent" : "f-txt f-blue");
    }
    return svg(320, 160, g, "polygone régulier à " + n + " côtés");
  };
  const NOMS = { 3: "triangle équilatéral", 4: "carré", 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone", 10: "décagone", 12: "dodécagone" };

  // ---------- rotation : drapeau autour de O, puis aiguille d'horloge ----------
  const ROT = (pts, a, cx, cy) => { const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180); return pts.map(([x, y]) => [cx + x * c - y * s, cy - (x * s + y * c)]); };
  const FLAG = [[34, 8], [34, 56], [70, 46], [34, 36]]; // mât et fanion (repère mathématique, O à l'origine)
  const flag = (a, cls, dash) => { const p = ROT(FLAG, a, 160, 84); return `<polygon points="${p.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}" class="${cls}"${dash ? ' stroke-dasharray="5 4" fill="none" stroke="var(--margin)" stroke-width="1.6"' : ' stroke="var(--ink)" stroke-width="1.4"'}/>`; };
  const rot = (x, s) => {
    const sens = '<div class="small muted">α &gt; 0 : sens inverse des aiguilles d\'une montre ↺ · α &lt; 0 : sens des aiguilles ↻</div>';
    const ang = (x > 0 ? "+" : "") + nb(x) + "°";
    if (s < 2) {
      const tgt = s === 0 ? 90 : -60, P0 = ROT([FLAG[1]], 0, 160, 84)[0], Px = ROT([FLAG[1]], x, 160, 84)[0];
      let g = `<circle cx="160" cy="84" r="58" fill="none" stroke="var(--line)" stroke-dasharray="2 4"/>` + flag(0, "f-soft") + flag(tgt, "", true) + flag(x, "f-fill2");
      g += L(160, 84, P0[0], P0[1], "f-line", 0.8, true) + L(160, 84, Px[0], Px[1], "f-blue", 1.2) + `<circle cx="160" cy="84" r="3.5" class="f-dot"/>` + T(150, 100, "O", "end", 12);
      const note = s === 1 && Math.abs(x - 300) < 1e-9 ? "<br>Même position que le pointillé, mais en tournant dans l'autre sens : cherche l'angle négatif." : "";
      return svg(320, 168, g, "drapeau tourné de " + ang) + plain("Rotation de centre O, d'angle α = <b>" + ang + "</b>" + note) + sens;
    }
    // horloge : la grande aiguille part du 12 ; cible : le 4
    let g = `<circle cx="160" cy="84" r="70" class="f-soft" stroke="var(--ink)" stroke-width="1.4"/>`;
    for (let h = 1; h <= 12; h++) { const a = (90 - 30 * h) * Math.PI / 180; g += L(160 + 62 * Math.cos(a), 84 - 62 * Math.sin(a), 160 + 70 * Math.cos(a), 84 - 70 * Math.sin(a), "f-line", 1.2) + T(160 + 52 * Math.cos(a), 84 - 52 * Math.sin(a) + 4, h, "middle", 10); }
    const hand = (a, cls, dash) => { const t = ((90 + a) * Math.PI) / 180; return L(160, 84, 160 + 48 * Math.cos(t), 84 - 48 * Math.sin(t), cls, dash ? 1.6 : 3, dash); };
    g += hand(-120, "f-accent", true) + hand(x, "f-line") + `<circle cx="160" cy="84" r="4" class="f-dot"/>`;
    return svg(320, 168, g, "horloge, aiguille tournée de " + ang) + plain("La grande aiguille a tourné de α = <b>" + ang + "</b>") + sens;
  };

  Object.assign(ACTIVE, {
    eqverif: {
      predict: { q: "Le nombre 3 est-il solution de l'équation 4x − 5 = x + 4 ?", choices: ["Oui", "Non"], good: 0, why: "On remplace x par 3 dans chaque membre, séparément : à gauche 4 · 3 − 5 = 7, à droite 3 + 4 = 7. Les deux membres sont égaux : 3 est solution." },
      defis: ["Teste des valeurs de x jusqu'à équilibrer la balance 2x + 5 = 17.", "Équilibre 5x + 7 = 2x − 2 : cette fois, les deux plateaux changent.", "x² + 6 = 5x a deux solutions : trouve l'une d'elles."],
      play: hunt({ label: "x", start: 1, min: -10, max: 10,
        show: (x, s) => balance(x, s),
        wins: [W(6, "x = 6 : 2 · 6 + 5 = 17. Les deux membres sont égaux : 6 est solution."), W(-3, "x = −3 : à gauche 5 · (−3) + 7 = −8, à droite 2 · (−3) − 2 = −8. Une solution peut être négative."),
          (x) => (x === 2 || x === 3 ? "x = " + x + " : " + x + "² + 6 = " + (x * x + 6) + " et 5 · " + x + " = " + 5 * x + ". L'autre solution est " + (5 - x) + " (" + (5 - x) + "² + 6 = " + ((5 - x) ** 2 + 6) + " = 5 · " + (5 - x) + ")." : "")] }),
    },
    echelle: {
      predict: { q: "Sur une carte au 1 : 25'000, deux points sont à 4 cm l'un de l'autre. En vrai, ils sont à…", choices: ["1 km", "100 m", "10 km"], good: 0, why: "1 cm sur la carte = 25'000 cm en vrai. 4 · 25'000 = 100'000 cm = 1'000 m = 1 km. Le piège, c'est la conversion des unités." },
      defis: ["Sur ce plan au 1 : 200, le mur du haut mesure 7 cm. Sa longueur réelle, en m ?", "Le village et la ferme sont à 3 km l'un de l'autre. Distance sur la carte au 1 : 25'000, en cm ?", "Sur ce plan au 1 : 100, la pièce mesure 4 cm sur 3 cm. Son aire réelle, en m² ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => plan(s),
        show: (x, s) => [
          () => plan(0, nb(x) + " m") + plain("Tu proposes " + nb(x) + " m = " + mil(x * 100) + " cm. Sur le plan : " + mil(x * 100) + " ÷ 200 = <b>" + nb(x / 2) + " cm</b> (il faut 7 cm)."),
          () => plan(1, nb(x) + " cm") + plain("Tu proposes " + nb(x) + " cm sur la carte : en vrai " + nb(x) + " · 25'000 = " + mil(x * 25000) + " cm = <b>" + nb(x / 4) + " km</b> (il faut 3 km)."),
          () => plan(2, nb(x) + " m²") + plain("Tu proposes <b>" + nb(x) + " m²</b>." + (Math.abs(x - 0.12) < 1e-9 || Math.abs(x - 1200) < 1e-9 ? " Attention : 12 cm² × 100 ne suffit pas. Convertis d'abord chaque côté en vrai, puis calcule l'aire." : " Convertis chaque côté en vrai (en m), puis calcule l'aire.")),
        ][s](),
        wins: [W(14, "7 · 200 = 1'400 cm = 14 m."), W(12, "3 km = 300'000 cm ; 300'000 ÷ 25'000 = 12 cm."), W(12, "En vrai : 4 m sur 3 m, donc 12 m². Sur le plan, 12 cm² : les longueurs sont × 100, l'aire est × 100² = 10'000 (120'000 cm² = 12 m²).")] }),
    },
    pente: {
      predict: { q: "Un panneau indique une pente de 100 %. La route est…", choices: ["verticale", "inclinée à 45°", "impossible à construire"], good: 1, why: "100 % : on monte de 100 m pour 100 m à l'horizontale. Dénivelé = distance horizontale : c'est la diagonale d'un carré, un angle de 45°." },
      defis: ["La route monte de 18 m pour 300 m à l'horizontale. Sa pente, en % ?", "Une route a une pente de 12 %. Sur 250 m à l'horizontale, de combien de mètres monte-t-elle ?", "Une rampe d'accès a une pente de 6 % et monte de 0,9 m. Sa longueur horizontale, en m ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => ramp([{ h: "300 m", v: "18 m", p: "pente ?" }, { h: "250 m", v: "? m", p: "12 %" }, { h: "? m", v: "0,9 m", p: "6 %" }][s], [6, 12, 6][s], null),
        show: (x, s) => [
          () => ramp({ h: "300 m", v: "18 m", p: nb(x) + " %" }, 6, x) + plain("Avec " + nb(x) + " %, on monterait de " + nb(x / 100) + " · 300 = <b>" + nb(3 * x) + " m</b> (la route monte de 18 m)."),
          () => ramp({ h: "250 m", v: nb(x) + " m", p: "12 %" }, 12, (x / 250) * 100) + plain("Ta montée : " + nb(x) + " ÷ 250 = " + nb(x / 250) + " = <b>" + nb((x / 250) * 100) + " %</b> (il faut 12 %)."),
          () => x > 0 ? ramp({ h: nb(x) + " m", v: "0,9 m", p: "6 %" }, 6, 90 / x) + plain("Ta rampe : 0,9 ÷ " + nb(x) + " = " + nb(0.9 / x) + " = <b>" + nb(90 / x) + " %</b> (il faut 6 %).") : plain("Une longueur est positive."),
        ][s](),
        wins: [W(6, "18 ÷ 300 = 0,06 = 6 % : 6 m de montée pour 100 m à l'horizontale."), W(30, "12 % = 0,12 ; 0,12 · 250 = 30 m."), W(15, "0,9 ÷ 0,06 = 15 m : une pente faible demande une longue rampe.")] }),
    },
    polyreg: {
      predict: { q: "Chaque angle d'un hexagone régulier mesure…", choices: ["60°", "120°", "135°"], good: 1, why: "Du centre, l'hexagone se découpe en 6 triangles équilatéraux (angles de 60°). À chaque sommet, deux angles de 60° se rejoignent : 120°." },
      defis: ["Pentagone régulier : mesure de l'angle au centre ?", "Même pentagone : mesure de chaque angle intérieur ?", "Chaque angle intérieur d'un polygone régulier mesure 140°. Combien a-t-il de côtés ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => s === 0 ? poly(5, "?", "") : s === 1 ? poly(5, "72°", "?") : plain("Angle intérieur : 140°. Nombre de côtés ?"),
        show: (x, s) => [
          () => poly(5, nb(x) + "°", "") + plain("5 angles au centre font un tour : 5 · " + nb(x) + "° = <b>" + nb(5 * x) + "°</b> (un tour : 360°)."),
          () => poly(5, "72°", nb(x) + "°") + plain("Le triangle au centre est isocèle : ses angles à la base valent la moitié de l'angle intérieur. 72° + " + nb(x / 2) + "° + " + nb(x / 2) + "° = <b>" + nb(72 + x) + "°</b> (il faut 180°)."),
          () => Number.isInteger(x) && x >= 3 && x <= 24 ? poly(x, nb(360 / x) + "°", nb(180 - 360 / x) + "°") + plain((NOMS[x] ? NOMS[x] + " : " : "") + x + " côtés → angle au centre 360° ÷ " + x + " = " + nb(+(360 / x).toFixed(2)) + "°, angle intérieur <b>" + nb(+(180 - 360 / x).toFixed(2)) + "°</b> (il faut 140°).") : plain("Un polygone a un nombre entier de côtés, au moins 3."),
        ][s](),
        wins: [W(72, "360° ÷ 5 = 72°."), W(108, "180° − 72° = 108° : les deux angles à la base (54° chacun) forment l'angle intérieur."), W(9, "Angle au centre : 180° − 140° = 40°, et 360° ÷ 40° = 9 côtés (un ennéagone).")] }),
    },
    rotation: {
      predict: { q: "On fait tourner une figure autour d'un point. Son image est…", choices: ["plus petite", "identique : même forme, même taille", "retournée, comme dans un miroir"], good: 1, why: "Une rotation conserve les longueurs et les angles, et ne retourne pas la figure (contrairement à une symétrie axiale) : on la fait seulement tourner." },
      defis: ["Fais tourner le drapeau autour de O pour le poser sur le drapeau pointillé.", "Pose-le sur le nouveau pointillé en tournant dans le sens des aiguilles d'une montre.", "La grande aiguille va du 12 au 4. Fais-la tourner : quel angle ?"],
      play: hunt({ label: "Angle α (°)", start: 0, min: -330, max: 330, step: 30,
        show: (x, s) => rot(x, s),
        wins: [W(90, "α = +90° : un quart de tour dans le sens inverse des aiguilles d'une montre. Le drapeau garde sa forme et sa taille."), W(-60, "α = −60° : on tourne dans le sens des aiguilles d'une montre, l'angle est négatif."), W(-120, "D'un nombre au suivant : 360° ÷ 12 = 30°. Du 12 au 4 : 4 · 30° = 120°, dans le sens des aiguilles, donc α = −120°.")] }),
    },
  });
})();
