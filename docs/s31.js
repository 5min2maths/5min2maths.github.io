








(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");

const mil = (v, d = 2) => { const s = (+(+v).toFixed(d)).toString().split("."), i = s[0].replace("-", ""), neg = s[0][0] === "-";
return (neg ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (s[1] ? "," + s[1] : ""); };
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
const pw = (b, x) => (Number.isInteger(x) ? b + sup(x) : b + "^" + nb(x));
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;
const tu = (x) => "tu proposes <b>" + nb(x) + "</b>";
const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));

const fac = (z) => (z < 0 ? "(x + " + -z + ")" : "(x − " + z + ")");




let UID = 0;
const graph = (o) => {

const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
const H = o.H || (o.eq ? Math.round((yr[1] - yr[0]) * ux + 2 * m) : 230), uy = (H - 2 * m) / (yr[1] - yr[0]);
const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c34" + ++UID;
const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb, fx = o.fx || nb;
let g = "", c = "";
for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);

let tk = "";
for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) tk += T(X(v), Math.min(Y(y0) + 13, H - 2), fx(+v.toFixed(6)), "middle", 10, "f-txt f-tick");
for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) tk += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10, "f-txt f-tick");

for (const [P, cls] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x) + "," + Y(Math.max(yr[0], Math.min(yr[1], y)))).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:0.7"/>`;
const span = yr[1] - yr[0];
for (const F of o.fns || []) {
const a = Math.max(xr[0], F.from ?? -Infinity), b = Math.min(xr[1], F.to ?? Infinity), N = 360; let d = "", prev = null;
for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N, y = F.f(x);
if (!isFinite(y) || y < yr[0] - span || y > yr[1] + span || (prev !== null && Math.abs(y - prev) > span)) { prev = null; continue; }
d += (prev === null ? "M" : "L") + X(x) + "," + Y(y) + " "; prev = y; }
if (d) c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="${F.w || 2.4}"${F.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
}
for (const [x, cls] of o.vl || []) c += L(X(x), Y(yr[0]), X(x), Y(yr[1]), cls || "f-accent", 1.6, "6 4");
for (const [y, cls] of o.hl || []) c += L(X(xr[0]), Y(y), X(xr[1]), Y(y), cls || "f-accent", 1.6, "6 4");
for (const [x1, y1, x2, y2, cls, w, dash] of o.segs || []) c += L(X(x1), Y(y1), X(x2), Y(y2), cls || "f-line", w || 1.6, dash);
for (const [cx, cy, r, cls] of o.circles || []) c += `<ellipse cx="${X(cx)}" cy="${Y(cy)}" rx="${(r * ux).toFixed(1)}" ry="${(r * uy).toFixed(1)}" class="${cls || "f-blue"}" fill="none" stroke-width="2.4"/>`;
for (const [x1, y1, x2, y2, cls] of o.arrows || []) {
const p = [X(x1), Y(y1)], q = [X(x2), Y(y2)], dx = q[0] - p[0], dy = q[1] - p[1], n = Math.hypot(dx, dy);
if (n < 1) continue; const ex = dx / n, ey = dy / n, k = Math.min(11, n * 0.45), b = [q[0] - ex * k, q[1] - ey * k];
c += L(p[0], p[1], b[0].toFixed(1), b[1].toFixed(1), cls || "f-blue", 2.6) + `<polygon points="${q[0]},${q[1]} ${(b[0] - ey * 5).toFixed(1)},${(b[1] + ex * 5).toFixed(1)} ${(b[0] + ey * 5).toFixed(1)},${(b[1] - ex * 5).toFixed(1)}" class="${cls === "f-accent" ? "f-headacc" : "f-head"}" style="${cls === "f-blue" || !cls ? "fill:var(--blue)" : ""}"/>`;
}
let p = "";
for (const [x, y, lab, cls, pos] of o.pts || []) {
if (x < xr[0] || x > xr[1] || y < yr[0] || y > yr[1]) continue;
p += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" class="${cls || "f-dot"}"/>`;
if (lab) { const left = pos === "l" || (pos !== "r" && X(x) > W - 90); p += T(X(x) + (left ? -8 : 8), Y(y) + (pos === "b" ? 16 : -7), lab, left ? "end" : "start", 12); }
}
return svg(W, H, `<defs><clipPath id="${id}"><rect x="${ml}" y="${m}" width="${W - m - ml}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${tk}${p}`, o.lab || "repère");
};



const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); } };
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");




const slide = (o) => (box, onWin) => {
let step = 0, st = null, asking = false;
const start = () => {
st = Object.assign({}, o.init(step)); asking = false;
const cs = o.ctl(step);
box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
`<div class="act-out s2c-out" aria-live="polite"></div><div class="s2c-ask"></div><div class="small muted">${o.note || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
box.querySelectorAll('input[type="range"]').forEach((inp) => {
inp.oninput = () => { if (asking) { inp.value = st[inp.dataset.k]; return; } st[inp.dataset.k] = +inp.value; refresh(); };
inp.onchange = () => { if (asking) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
});
refresh();
};
const refresh = () => {
box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
box.querySelector(".s2c-out").innerHTML = o.out(st, step);
};
const win = (mm) => { onWin(step, mm); step++; if (step < o.goal.length) start(); else { asking = true; box.querySelector(".s2c-ask").innerHTML = ""; } };
const check = () => {
if (asking || step >= o.goal.length) return;
const mm = o.goal[step](st);
if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
const A = o.ask && o.ask[step];
if (!A) { win(mm); return; }
asking = true; const el = box.querySelector(".act-hint"); if (el) el.textContent = "";
const ab = box.querySelector(".s2c-ask");
ab.innerHTML = `<div class="act-out" style="margin-top:6px"><b>✓ ${mm}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
if (typeof typeset === "function" && /\\\(/.test(A.q)) typeset(ab);
const inp = ab.querySelector("input"), go = () => { const v = parseNum(inp.value);
if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
if (Math.abs(v - A.ans) <= (A.tol || 1e-9)) win(A.ok); else $hint(box, A.no || "Pas encore : reprends le raisonnement de la figure."); };
actAnswerBind(ab, go);
};
start();
};




const fr = (v) => { for (let d = 1; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return d === 1 ? nb(n) : (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; } return nb(v); };


const tanFig = (D, m) => {
const fa = D.f(D.a), ok = m !== null && Math.abs(m - D.m) <= (D.tol || 1e-9);
const o = { xr: D.xr, yr: D.yr, gx: D.gx, gy: D.gy, lx: D.lx, ly: D.ly, fns: [{ f: D.f }], pts: [[D.a, fa, D.lab || "", "f-dot", D.pos]], lab: "courbe et droite passant par un de ses points" };
if (m !== null) o.fns.push({ f: (x) => m * (x - D.a) + fa, cls: ok ? "f-accent" : "f-line", w: 1.8 });
const t = m === null ? '<span class="small">' + D.txt + "</span>" : "Droite de pente <b>" + nb(m) + "</b> : " + (ok ? '<b class="act-ok">elle frôle la courbe, c\'est la tangente</b>' : "ce n'est pas la tangente (pente " + (m > D.m ? "trop forte" : "trop faible") + ")");
return graph(o) + plain(t);
};

const shade = (f, g, a, b) => { const P = []; for (let i = 0; i <= 60; i++) { const x = a + ((b - a) * i) / 60; P.push([x, f(x)]); } for (let i = 60; i >= 0; i--) { const x = a + ((b - a) * i) / 60; P.push([x, g(x)]); } return P; };
const z0 = () => 0;





const fq = (x) => 0.5 * x * x - 1;
const DREF = [
{ f: (x) => x ** 3, a: 2, m: 12, xr: [-1, 3.2], yr: [-4, 28], gy: 2, ly: 8, lab: "(2 ; 8)", txt: "f(x) = x³ et son point d'abscisse 2" },
{ f: (x) => 1 / x, a: 2, m: -0.25, xr: [0, 5], yr: [-0.5, 4], lab: "(2 ; 0,5)", txt: "f(x) = 1/x et son point d'abscisse 2" },
{ f: (x) => Math.sqrt(x), a: 4, m: 0.25, xr: [0, 9], yr: [-0.5, 3.5], lab: "(4 ; 2)", txt: "f(x) = √x et son point d'abscisse 4" },
{ f: Math.sin, a: Math.PI / 3, m: 0.5, xr: [-0.5, 3.5], yr: [-1.5, 1.5], gx: 0.5, gy: 0.5, lx: 1, ly: 1, lab: "(π/3 ; √3/2)", txt: "f(x) = sin x et son point d'abscisse π/3 ≈ 1,05" },
];
const DREG = [
{ f: (x) => 2 * x ** 3 - 5 * x * x + 4 * x - 7, a: 2, m: 8, xr: [-0.5, 3], yr: [-12, 6], gx: 0.5, lx: 1, gy: 2, ly: 4, lab: "(2 ; −3)", txt: "f(x) = 2x³ − 5x² + 4x − 7 et son point d'abscisse 2" },
{ f: (x) => (x + 1) * (x - 3), a: 4, m: 6, xr: [-2, 5.5], yr: [-5, 12], lab: "(4 ; 5)", txt: "f(x) = (x + 1)(x − 3) et son point d'abscisse 4" },
];
const fh = (x) => x * x - 6 * x + 1;
const regFig = (s, x) => {
if (s < 2) return tanFig(DREG[s], x);
const o = { xr: [-1, 7], yr: [-9, 8], fns: [{ f: fh }], pts: [], lab: "parabole et tangente au point choisi" };
if (x === null) return graph(o) + plain('<span class="small">f(x) = x² − 6x + 1 : tape une abscisse, on trace la tangente en ce point</span>');
const m = 2 * x - 6; o.fns.push({ f: (t) => m * (t - x) + fh(x), cls: m === 0 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([x, fh(x), "", "f-dot"]);
return graph(o) + plain("Tangente en x = " + nb(x) + " : pente f'(" + nb(x) + ") = <b>" + nb(m) + "</b>" + (m === 0 ? ' : <b class="act-ok">horizontale</b>' : ""));
};
const DPQ = [
{ f: (x) => x * x * (3 * x + 1), a: 1, m: 11, xr: [-1.5, 2], yr: [-2, 12], gx: 0.5, lx: 1, gy: 1, ly: 2, lab: "(1 ; 4)", txt: "f(x) = x²(3x + 1) et son point d'abscisse 1" },
{ f: (x) => (2 * x + 1) / (x - 1), a: 3, m: -0.75, xr: [0, 7], yr: [-2, 10], lab: "(3 ; 3,5)", txt: "f(x) = (2x + 1) ÷ (x − 1) et son point d'abscisse 3" },
{ f: (x) => 1 / (x * x + 1), a: 1, m: -0.5, xr: [-3, 3], yr: [-0.25, 1.25], gx: 0.5, lx: 1, gy: 0.25, ly: 0.5, lab: "(1 ; 0,5)", txt: "f(x) = 1 ÷ (x² + 1) et son point d'abscisse 1" },
];

const DCH = [
["x = 4", "u = 2x − 5 = 3", "f = u³ = 27"],
["x = 2", "u = 2x + 5 = 9", "f = √u = 3"],
["x = π/4", "u = 2x = π/2", "f = cos u = 0"],
["x = 1", "u = x² + 1 = 2", "f = u³ = 8"],
];
const chain = (s) => {
const B = DCH[s], xs = [4, 108, 216], w = [84, 100, 100];
let g = T(xs[1] + 50, 14, "intérieur", "middle", 11) + T(xs[2] + 50, 14, "extérieur", "middle", 11);
B.forEach((t, i) => { g += `<rect x="${xs[i]}" y="22" width="${w[i]}" height="34" rx="8" class="${i ? "f-fill2" : "f-soft"}"/>` + T(xs[i] + w[i] / 2, 44, t, "middle", 12); });
g += L(xs[0] + w[0] + 2, 39, xs[1] - 4, 39, "f-line", 1.6) + L(xs[1] + w[1] + 2, 39, xs[2] - 4, 39, "f-line", 1.6);
return svg(320, 62, g, "chaîne de calcul : x, puis l'intérieur u, puis l'extérieur f");
};

const enclos = (x) => {
const k = 7, Lg = 40 - 2 * x, x0 = 160 - (Lg * k) / 2;
let g = `<rect x="0" y="4" width="320" height="14" class="f-fill2"/>` + T(160, 15, "rivière", "middle", 10);
g += `<rect x="${x0}" y="18" width="${Lg * k}" height="${x * k}" class="f-soft"/>` + `<path d="M${x0},18 V${18 + x * k} H${x0 + Lg * k} V18" class="f-line" fill="none" stroke-width="2.4"/>`;
g += T(160, 18 + x * k + 14, nb(Lg) + " m", "middle", 11) + T(x0 - 4, 18 + (x * k) / 2 + 4, nb(x) + " m", "end", 11);
return svg(320, 18 + 19 * k + 20, g, "enclos rectangulaire le long d'une rivière");
};

Object.assign(ACTIVE, {
tauxvar: {
predict: { q: "À 8 h, il fait 4 °C ; à 14 h, il fait 19 °C. En moyenne, la température a monté de…", choices: ["2,5 °C par heure", "15 °C par heure", "3,2 °C par heure"], good: 0,
why: "Elle a monté de 19 − 4 = 15 °C en 14 − 8 = 6 heures : 15 ÷ 6 = 2,5 °C par heure. C'est un taux de variation moyen." },
defis: ["f(x) = x². Le point A est fixé en x = 1. Déplace B pour que le taux de variation moyen de f entre 1 et b vaille 5.", "Même fonction : règle b pour que le taux de variation moyen vaille −1."],
play: slide({
ctl: () => [{ k: "b", lab: "Abscisse b du point B", min: -3, max: 5, step: 0.5 }],
init: (s) => ({ b: s ? 3 : 2.5 }),
fig: (st) => { const b = st.b, o = { xr: [-3.5, 5.5], yr: [-2, 26], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [[1, 1, "A", "f-dot", "b"], [b, b * b, "B", "f-dot", b < 1 ? "l" : "r"]], lab: "parabole et sécante AB" };
if (b !== 1) { o.fns.push({ f: (x) => (b + 1) * (x - 1) + 1, cls: "f-accent", w: 1.8 }); o.segs = [[1, 1, b, 1, "f-line", 1.2, "4 3"], [b, 1, b, b * b, "f-line", 1.2, "4 3"]]; }
return graph(o); },
out: (st) => (st.b === 1 ? "B est sur A : pas de sécante, on ne peut pas diviser par b − 1 = 0." : "Taux = (f(" + nb(st.b) + ") − f(1)) ÷ (" + nb(st.b) + " − 1) = " + nb(st.b * st.b - 1) + " ÷ " + nb(st.b - 1) + " = <b>" + nb(st.b + 1) + "</b><br><span class=\"small\">c'est la pente de la sécante AB (en rouge)</span>"),
goal: [(st) => (st.b === 4 ? "Entre 1 et 4 : (16 − 1) ÷ (4 − 1) = 15 ÷ 3 = 5. La sécante AB monte de 5 par unité." : ""),
(st) => (st.b === -2 ? "Entre 1 et −2 : (4 − 1) ÷ (−2 − 1) = 3 ÷ (−3) = −1. Taux négatif : la sécante descend. On garde le même ordre en haut et en bas." : "")],
miss: (st, s) => (st.b === 1 ? "" : st.b + 1 < [5, -1][s] ? "Pente trop faible : déplace B vers la droite." : "Pente trop forte : déplace B vers la gauche."),
ask: [null, { q: "Une voiture a parcouru s(t) = 2t² mètres après t secondes. Quelle est sa vitesse moyenne (en m/s) entre t = 1 s et t = 4 s ?", ans: 10, ok: "(s(4) − s(1)) ÷ (4 − 1) = (32 − 2) ÷ 3 = 10 m/s : une vitesse moyenne est un taux de variation moyen.", no: "Calcule s(4) et s(1), puis divise la différence par la durée 4 − 1." }] }),
},
nbderive: {
predict: { q: "f(x) = x². Entre 3 et 3,1, le taux de variation moyen vaut 6,1 ; entre 3 et 3,01, il vaut 6,01. De quel nombre s'approche-t-il ?", choices: ["6", "9", "0"], good: 0,
why: "Entre 3 et 3 + h, il vaut 6 + h : quand h devient minuscule, il s'approche de 6. C'est le nombre dérivé f'(3). (9 = f(3) est une hauteur, pas une pente.)" },
defis: ["f(x) = x², A d'abscisse 3. Rapproche B de A : rends l'écart h le plus petit possible (sans 0).", "f(x) = 0,5x² − 1. Fais pivoter la droite autour de A(2 ; 1) jusqu'à ce qu'elle ne touche plus la courbe qu'en A."],
play: slide({
ctl: (s) => [s ? { k: "m", lab: "Pente de la droite", min: -2, max: 6, step: 0.5 } : { k: "h", lab: "Écart h entre A et B", min: -2, max: 2, step: 0.25 }],
init: (s) => (s ? { m: 0 } : { h: 2 }),
fig: (st, s) => {
if (!s) { const h = st.h, o = { xr: [-0.5, 5.5], yr: [-1, 27], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [[3, 9, "A", "f-dot", "l"], [3 + h, (3 + h) ** 2, h ? "B" : "", "f-dot", "r"]], lab: "parabole, sécante AB" };
if (h) o.fns.push({ f: (x) => (6 + h) * (x - 3) + 9, cls: "f-accent", w: 1.8 });
return graph(o); }
const m = st.m, o = { xr: [-3, 6], yr: [-3, 10], fns: [{ f: fq }, { f: (x) => m * (x - 2) + 1, cls: m === 2 ? "f-accent" : "f-line", w: 1.8 }], pts: [[2, 1, "A", "f-dot", "r"]], lab: "parabole et droite pivotant autour de A" };
if (m !== 2) o.pts.push([2 * m - 2, fq(2 * m - 2), "", "f-fill2"]);
return graph(o); },
out: (st, s) => (!s ? (st.h === 0 ? "h = 0 : B est sur A, le quotient n'a plus de sens (0 ÷ 0). On s'approche sans y aller." : "(f(3 + h) − f(3)) ÷ h = (6h + h²) ÷ h = 6 + h = <b>" + nb(6 + st.h) + "</b>")
: st.m === 2 ? 'Pente 2 : <b class="act-ok">la droite ne touche la courbe qu\'en A</b>' : "Pente " + nb(st.m) + " : la droite recoupe la courbe en x = " + nb(2 * st.m - 2)),
goal: [(st) => (Math.abs(st.h) === 0.25 ? "Avec h = " + nb(st.h) + ", le taux vaut " + nb(6 + st.h) + " : plus h est petit, plus on s'approche de 6. Cette limite est le nombre dérivé f'(3)." : ""),
(st) => (st.m === 2 ? "La tangente en A a une pente de 2 : f'(2) = 2. Le nombre dérivé est la pente de la tangente." : "")],
miss: (st, s) => (s ? "La droite coupe encore la courbe en un 2e point (point clair) : continue à pivoter." : "Rapproche B de A : rends h le plus petit possible, sans 0."),
ask: [{ q: "Que vaut alors f'(3) pour f(x) = x² ?", ans: 6, ok: "6 + h tend vers 6 quand h tend vers 0 : f'(3) = 6, la pente de la tangente en 3.", no: "Le taux vaut 6 + h : que devient-il quand h devient très petit ?" },
{ q: "Une pierre tombe : elle a parcouru s(t) = 5t² mètres après t secondes. Sa vitesse instantanée (en m/s) à t = 2 s ?", ans: 20, ok: "(s(2 + h) − s(2)) ÷ h = (20h + 5h²) ÷ h = 20 + 5h, qui tend vers 20, donc s'(2) = 20 m/s.", no: "Calcule (s(2 + h) − s(2)) ÷ h, simplifie par h, puis fais tendre h vers 0." }] }),
},
derivref: {

plus: [{ d: "\\(f(x) = \\cos x\\) (x en radians). Tape \\(f'\\left(\\frac{\\pi}{2}\\right)\\).", ans: -1, ok: "(cos x)' = −sin x, donc f'(π/2) = −sin(π/2) = −1 : la courbe du cosinus descend en π/2.", no: "La dérivée de cos x est −sin x : attention au signe −." }],

retiens: { regle: "\\((x^n)' = n x^{n - 1}\\), aussi pour un exposant négatif ou fractionnaire. Ainsi \\(\\left(\\frac{1}{x}\\right)' = (x^{-1})' = -\\frac{1}{x^2}\\) et \\((\\sqrt{x})' = \\left(x^{\\frac{1}{2}}\\right)' = \\frac{1}{2\\sqrt{x}}\\). En radians : \\((\\sin x)' = \\cos x\\) et \\((\\cos x)' = -\\sin x\\). \\(f'(a)\\) est la pente de la tangente au point d'abscisse \\(a\\).", exemple: ["\\((x^3)' = 3x^2\\), donc la pente en 2 vaut \\(3 \\cdot 4 = 12\\).", "\\(\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}\\), donc \\(f'(2) = -\\frac{1}{4}\\).", "\\((\\sin x)' = \\cos x\\), donc \\(f'\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}\\).", "\\((\\cos x)' = -\\sin x\\), donc \\(f'\\left(\\frac{\\pi}{2}\\right) = -1\\)."], piege: "Racines et inverses : écris d'abord une puissance de \\(x\\) (\\(\\sqrt{x} = x^{\\frac{1}{2}}\\), \\(\\frac{1}{x} = x^{-1}\\)), puis applique la règle." },
predict: { q: "La dérivée de x² est 2x. Quelle est celle de x³ ?", choices: ["3x²", "2x³", "3x³"], good: 0,
why: "On descend l'exposant devant et on le diminue de 1 : (x³)' = 3x². Règle générale : (xⁿ)' = n·xⁿ⁻¹. Une constante a pour dérivée 0." },
defis: ["f(x) = x³. Tape la pente de la tangente au point d'abscisse 2, c'est-à-dire f'(2).", "f(x) = 1/x = x⁻¹. Tape f'(2).", "f(x) = √x = x^(1/2). Tape f'(4).", "f(x) = sin x (x en radians). Tape f'(π/3)."],
play: hunt({ ask: true, label: "Pente de la tangente", blank: (s) => tanFig(DREF[s], null), show: (x, s) => tanFig(DREF[s], x),
miss: (x, s) => ["(xⁿ)' = n·xⁿ⁻¹ : ici n = 3, puis remplace x par 2.", "Applique (xⁿ)' = n·xⁿ⁻¹ avec n = −1 : f'(x) = −x⁻² = −1/x².", "x^(1/2) se dérive en (1/2)·x^(−1/2) = 1/(2√x).", "La dérivée de sin x est cos x : calcule cos(π/3)."][s],
wins: [W(12, "f'(x) = 3x², donc f'(2) = 3 · 4 = 12."), W(-0.25, "(x⁻¹)' = −x⁻² = −1/x², donc f'(2) = −1/4 : la courbe descend."), W(0.25, "(√x)' = 1/(2√x), donc f'(4) = 1/(2 · 2) = 1/4."), W(0.5, "(sin x)' = cos x, donc f'(π/3) = cos(π/3) = 1/2. De même, (cos x)' = −sin x.")] }),
},
derivregles: {

retiens: { regle: "\\((u + v)' = u' + v'\\) et \\((k u)' = k u'\\). Pour un polynôme, chaque terme \\(a x^n\\) devient \\(n a x^{n - 1}\\) et la constante disparaît. Un produit peut d'abord être développé. La tangente est horizontale là où \\(f'(x) = 0\\)." },
predict: { q: "Quelle est la dérivée de x³ + x² ?", choices: ["3x² + 2x", "6x", "3x² · 2x"], good: 0,
why: "On dérive terme par terme : (x³)' + (x²)' = 3x² + 2x. La dérivée d'une somme est la somme des dérivées." },
defis: ["f(x) = 2x³ − 5x² + 4x − 7. Tape la pente de la tangente en x = 2, c'est-à-dire f'(2).", "f(x) = (x + 1)(x − 3). Développe, puis tape f'(4).", "f(x) = x² − 6x + 1. En quelle abscisse la tangente est-elle horizontale ?"],
play: hunt({ ask: true, label: "Ta réponse", blank: (s) => regFig(s, null), show: (x, s) => regFig(s, x),
miss: (x, s) => ["Chaque terme a·xⁿ devient n·a·xⁿ⁻¹, la constante disparaît : f'(x) = 6x² − 10x + 4.", "Développe d'abord : x² − 2x − 3.", "Tangente horizontale : f'(x) = 0, avec f'(x) = 2x − 6."][s],
wins: [W(8, "f'(x) = 6x² − 10x + 4 (le −7 disparaît), donc f'(2) = 24 − 20 + 4 = 8."), W(6, "(x + 1)(x − 3) = x² − 2x − 3, donc f'(x) = 2x − 2 et f'(4) = 6. (Le produit des dérivées, 1 · 1 = 1, serait faux.)"), W(3, "f'(x) = 2x − 6 = 0 pour x = 3 : la tangente est horizontale au sommet (3 ; −8).")] }),
},
derivprodquot: {

retiens: { regle: "\\((uv)' = u'v + uv'\\). \\(\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}\\) (là où \\(v \\neq 0\\)) ; cas particulier \\(\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}\\)." },
predict: { q: "Vrai ou faux : la dérivée de x · x est (x)' · (x)' = 1 · 1 = 1.", choices: ["Vrai", "Faux"], good: 1,
why: "Faux : x · x = x², dont la dérivée est 2x. La dérivée d'un produit n'est pas le produit des dérivées : (uv)' = u'v + uv' = 1 · x + x · 1 = 2x." },
defis: ["f(x) = x²(3x + 1). Avec (uv)' = u'v + uv', tape f'(1).", "f(x) = (2x + 1) ÷ (x − 1). Avec (u/v)' = (u'v − uv') ÷ v², tape f'(3).", "f(x) = 1 ÷ (x² + 1). Avec (1/v)' = −v' ÷ v², tape f'(1)."],
play: hunt({ ask: true, label: "Pente de la tangente", blank: (s) => tanFig(DPQ[s], null), show: (x, s) => tanFig(DPQ[s], x),
miss: (x, s) => ["u = x², u' = 2x ; v = 3x + 1, v' = 3 : calcule u'v + uv' en x = 1.", "u'v − uv' = 2(x − 1) − (2x + 1) · 1 : le second produit se soustrait en entier.", "v = x² + 1 : v(1) = 2 et v'(1) = 2."][s],
wins: [W(11, "f'(x) = 2x(3x + 1) + x² · 3 = 9x² + 2x, donc f'(1) = 11."), W(-0.75, "f'(x) = (2(x − 1) − (2x + 1)) ÷ (x − 1)² = −3 ÷ (x − 1)², donc f'(3) = −3/4."), W(-0.5, "f'(x) = −2x ÷ (x² + 1)², donc f'(1) = −2/4 = −1/2.")] }),
},
derivcomp: {

retiens: { regle: "\\((f(u(x)))' = f'(u(x)) \\cdot u'(x)\\) : on dérive l'extérieur en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur. Cas fréquents : \\((u^n)' = n u^{n - 1} u'\\), \\((\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}}\\), \\((\\cos u)' = -u' \\sin u\\).", exemple: ["\\(\\left((x^2 + 1)^3\\right)' = 3(x^2 + 1)^2 \\cdot 2x = 6x(x^2 + 1)^2\\)", "\\((\\cos(2x))' = -2\\sin(2x)\\)", "\\(\\left(\\sqrt{2x + 5}\\right)' = \\frac{2}{2\\sqrt{2x + 5}} = \\frac{1}{\\sqrt{2x + 5}}\\)"] },
predict: { q: "Pour dériver (3x + 1)⁵, on écrit 5(3x + 1)⁴, puis…", choices: ["on multiplie par 3", "c'est fini", "on ajoute 3"], good: 0,
why: "On dérive l'extérieur (la puissance 5) en gardant l'intérieur, puis on multiplie par la dérivée de l'intérieur, 3 : 15(3x + 1)⁴." },
defis: ["f(x) = (2x − 5)³. Tape f'(4).", "f(x) = √(2x + 5). Tape f'(2).", "f(x) = cos(2x). Tape f'(π/4).", "f(x) = (x² + 1)³. Tape f'(1)."],
play: hunt({ ask: true, label: "Ta réponse", blank: (s) => chain(s), show: (x, s) => chain(s) + plain(tu(x)),
miss: (x, s) => ["(u³)' = 3u² · u' : n'oublie pas le facteur u' = 2.", "(√u)' = u' ÷ (2√u), avec u = 9 et u' = 2.", "(cos u)' = −u' · sin u, avec u = π/2 et u' = 2.", "3u² · u', avec u = 2 et u' = 2x = 2."][s],
wins: [W(54, "Extérieur dérivé : 3u² = 3 · 3² = 27 ; intérieur : u' = 2. f'(4) = 27 · 2 = 54."), W(1 / 3, "(√u)' = u' ÷ (2√u) = 2 ÷ (2 · 3) = 1/3."), W(-2, "(cos u)' = −u' · sin u = −2 · sin(π/2) = −2."), W(24, "f'(x) = 3(x² + 1)² · 2x, donc f'(1) = 3 · 4 · 2 = 24.")] }),
},
tangente: {
predict: { q: "f(3) = 9 et f'(3) = 6. La tangente au point d'abscisse 3 a pour pente…", choices: ["6", "9", "3"], good: 0,
why: "La pente de la tangente est le nombre dérivé f'(3) = 6 ; elle passe par le point (3 ; 9)." },
defis: ["Règle m et p pour que la droite y = mx + p soit la tangente à f(x) = x² au point d'abscisse 3.", "Même parabole : déplace le point de contact a pour que la tangente passe par P(0 ; −4)."],
play: slide({
ctl: (s) => (s ? [{ k: "a", lab: "Abscisse a du point de contact", min: -3, max: 3, step: 0.5 }] : [{ k: "m", lab: "Pente m", min: 0, max: 8 }, { k: "p", lab: "Ordonnée à l'origine p", min: -12, max: 0 }]),
init: (s) => (s ? { a: 1 } : { m: 2, p: 0 }),
fig: (st, s) => {
const o = { xr: [-3.5, 5], yr: [-12, 20], gy: 2, ly: 4, fns: [{ f: (x) => x * x }], pts: [], lab: "parabole y = x² et une droite" };
if (!s) { o.fns.push({ f: (x) => st.m * x + st.p, cls: st.m === 6 && st.p === -9 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([3, 9, "(3 ; 9)", "f-dot", "l"]); }
else { const a = st.a; o.fns.push({ f: (x) => 2 * a * x - a * a, cls: a * a === 4 ? "f-accent" : "f-line", w: 1.8 }); o.pts.push([a, a * a, "", "f-dot"], [0, -4, "P", "f-fill2", "r"]); }
return graph(o); },
out: (st, s) => { if (s) { const a = st.a; return "Tangente en a = " + nb(a) + " : pente 2a = " + nb(2 * a) + ", y = " + nb(2 * a) + "x − " + nb(a * a) + "<br><span class=\"small\">ordonnée à l'origine : −a² = " + nb(-a * a) + "</span>"; }
return "y = " + (st.m ? nb(st.m) + "x" : "") + (st.p < 0 ? " − " + nb(-st.p) : st.m ? "" : "0") + " ; en x = 3 : " + nb(3 * st.m + st.p) + (3 * st.m + st.p === 9 ? " (passe par le point)" : " (on veut 9)"); },
goal: [(st) => (st.m === 6 && st.p === -9 ? "y = 6x − 9 : pente f'(3) = 6, et 6 · 3 − 9 = 9. C'est y = f'(3)(x − 3) + f(3) développé." : ""),
(st) => (st.a * st.a === 4 ? "Avec a = " + nb(st.a) + ", la tangente y = " + nb(2 * st.a) + "x − 4 passe par (0 ; −4). Il y a deux tangentes par P : en a = 2 et en a = −2." : "")],
miss: (st, s) => (s ? "L'ordonnée à l'origine de la tangente est −a² : on veut −4." : st.m === 6 ? "Bonne pente f'(3) = 6. Règle p pour que la droite passe par (3 ; 9) : 6 · 3 + p = 9." : 3 * st.m + st.p === 9 ? "La droite passe par (3 ; 9), mais sa pente n'est pas f'(3) : f'(x) = 2x." : ""),
ask: [{ q: "La tangente à f(x) = √x en 100 a pour pente f'(100) = 1/20. Donne une valeur approchée de √104 avec cette tangente.", ans: 10.2, tol: 1e-6, ok: "√104 ≈ f(100) + f'(100) · 4 = 10 + 4/20 = 10,2 (la calculatrice donne 10,198…) : c'est l'approximation affine.", no: "f(100) = 10 : avance de 4 le long de la tangente, de pente 1/20." }, null] }),
},
variations: {

retiens: { regle: "Sur un intervalle, si \\(f' > 0\\), \\(f\\) est croissante ; si \\(f' < 0\\), décroissante. Méthode : calculer \\(f'(x)\\), trouver ses zéros, regarder le signe de \\(f'\\) de part et d'autre. Si \\(f'\\) passe de + à − en \\(a\\), \\(f(a)\\) est un maximum local ; de − à +, un minimum local." },
predict: { q: "Sur un intervalle, f'(x) > 0. Alors f est…", choices: ["croissante", "positive", "décroissante"], good: 0,
why: "Le signe de la dérivée donne le sens de variation : f' > 0, la courbe monte. (Une fonction peut être négative et croissante.)" },
defis: ["f(x) = x³ − 3x. Déplace le point jusqu'au maximum local : tangente horizontale, et f' passe de + à −.", "f(x) = x³. Place le point là où f'(x) = 0. Est-ce un extremum ?"],
play: slide({
ctl: () => [{ k: "x", lab: "Abscisse du point", min: -2.5, max: 2.5, step: 0.25 }],
init: (s) => (s ? { x: 1.5 } : { x: 2 }),
fig: (st, s) => { const f = s ? (t) => t ** 3 : (t) => t ** 3 - 3 * t, d = s ? 3 * st.x * st.x : 3 * st.x * st.x - 3, x = st.x;
return graph({ xr: [-2.6, 2.6], yr: s ? [-16, 16] : [-9, 9], gx: 0.5, lx: 1, gy: s ? 4 : 2, ly: s ? 8 : 4, fns: [{ f }], segs: [[x - 0.6, f(x) - 0.6 * d, x + 0.6, f(x) + 0.6 * d, d > 0 ? "f-blue" : d < 0 ? "f-accent" : "f-line", 3]], pts: [[x, f(x), "", "f-dot"]], lab: "courbe et tangente au point choisi" }); },
out: (st, s) => { const d = s ? 3 * st.x * st.x : 3 * st.x * st.x - 3; return "f'(" + nb(st.x) + ") = <b>" + nb(d) + "</b>" + (d > 0 ? " > 0 : f monte" : d < 0 ? " < 0 : f descend" : " : tangente horizontale"); },
goal: [(st) => (st.x === -1 ? "En −1, f' passe de + à − : f(−1) = −1 + 3 = 2 est un maximum local. f'(x) = 3(x − 1)(x + 1)." : ""),
(st) => (st.x === 0 ? "f'(0) = 0, mais f'(x) = 3x² est positive des deux côtés : pas de changement de signe, donc pas d'extremum en 0." : "")],
miss: (st, s) => (!s && st.x === 1 ? "Tangente horizontale, mais f' passe de − à + : c'est un minimum. Cherche le maximum." : ""),
ask: [{ q: "Pour f(x) = x³ − 3x, quelle est la valeur du minimum local ?", ans: -2, ok: "f' passe de − à + en x = 1 : minimum local f(1) = 1 − 3 = −2. L'extremum est la valeur f(1), pas l'abscisse 1.", no: "Le minimum local est en x = 1 : calcule f(1)." },
{ q: "g(x) = x³ − 3x² − 9x + 2. Quelle est la valeur du minimum local de g ?", ans: -25, ok: "g'(x) = 3x² − 6x − 9 = 3(x + 1)(x − 3) passe de − à + en 3, d'où le minimum g(3) = 27 − 27 − 27 + 2 = −25.", no: "g'(x) = 3(x + 1)(x − 3) : le minimum est en x = 3, calcule g(3)." }] }),
},
optimderiv: {
predict: { q: "Avec 60 m de clôture le long d'une rivière (trois côtés à clôturer), quel enclos a la plus grande aire ?", choices: ["15 m × 30 m", "20 m × 20 m", "10 m × 40 m"], good: 0,
why: "Les trois utilisent 60 m (2 · 15 + 30, 2 · 20 + 20, 2 · 10 + 40). Aires : 450 m², 400 m², 400 m². A(x) = x(60 − 2x) est maximale pour x = 15." },
defis: ["Enclos le long d'une rivière : 40 m de clôture pour les trois autres côtés. Règle la largeur x pour que l'aire soit maximale.", "Boîte sans couvercle : dans une feuille de 30 cm × 30 cm, on découpe un carré de côté x à chaque coin. Règle x pour que le volume soit maximal."],
play: slide({
ctl: (s) => [s ? { k: "x", lab: "Côté x des carrés découpés (cm)", min: 0.5, max: 14.5, step: 0.5 } : { k: "x", lab: "Largeur x (m)", min: 1, max: 19 }],
init: (s) => ({ x: s ? 2 : 4 }),
fig: (st, s) => { const x = st.x;
if (!s) return enclos(x);
return graph({ xr: [0, 15], yr: [0, 2200], pad: 26, gy: 200, ly: 1000, lx: 5, fns: [{ f: (t) => t * (30 - 2 * t) ** 2 }], segs: [[x, 0, x, x * (30 - 2 * x) ** 2, "f-line", 1.2, "4 3"]], pts: [[x, x * (30 - 2 * x) ** 2, "", "f-dot"]], fy: (v) => mil(v, 0), lab: "volume de la boîte selon x" }); },
out: (st, s) => (s ? "V(x) = x(30 − 2x)² = " + nb(st.x) + " · " + nb(30 - 2 * st.x) + "² = <b>" + mil(st.x * (30 - 2 * st.x) ** 2, 1) + " cm³</b>" : "A(x) = x(40 − 2x) = " + st.x + " · " + (40 - 2 * st.x) + " = <b>" + st.x * (40 - 2 * st.x) + " m²</b>"),
goal: [(st) => (st.x === 10 ? "x = 10 m : A'(x) = 40 − 4x = 0 pour x = 10. Aire maximale 10 · 20 = 200 m²." : ""),
(st) => (st.x === 5 ? "x = 5 cm : V'(x) = (30 − 2x)(30 − 6x) = 0 pour x = 5 (x = 15 ne donne pas de boîte). Volume maximal 5 · 20² = 2'000 cm³." : "")],
miss: (st, s) => (s ? (st.x < 5 ? "Le volume augmente encore : avance." : "Le volume diminue : recule.") : st.x < 10 ? "L'aire augmente encore : élargis." : "L'aire diminue : rétrécis."),
ask: [{ q: "Même enclos, mais avec 60 m de clôture : quelle largeur x (en m) donne l'aire maximale ?", ans: 15, ok: "A(x) = x(60 − 2x), A'(x) = 60 − 4x = 0 pour x = 15 m (aire 15 · 30 = 450 m²).", no: "Écris A(x) = x(60 − 2x), dérive, puis résous A'(x) = 0." },
{ q: "Même boîte dans une feuille de 24 cm × 24 cm : quel x (en cm) donne le volume maximal ?", ans: 4, ok: "V'(x) = (24 − 2x)(24 − 6x) s'annule en 4 et en 12 ; seul x = 4 donne une boîte. Volume 4 · 16² = 1'024 cm³.", no: "V(x) = x(24 − 2x)², et V'(x) = (24 − 2x)(24 − 6x)." }] }),
},
});




const E = Math.E;

const LNT = [
null,
{ f: (x) => x * Math.log(x), a: E * E, m: 3, xr: [0, 10], yr: [-2, 24], gy: 2, ly: 4, lab: "(e² ; 2e²)", txt: "f(x) = x · ln x et son point d'abscisse e² ≈ 7,39" },
{ f: (x) => Math.exp(x * x), a: 1, m: 2 * E, tol: 0.006, xr: [-1.6, 1.8], yr: [-1, 12], gx: 0.5, lx: 1, lab: "(1 ; e)", txt: "f(x) = e^(x²) et son point d'abscisse 1" },
];
const lnFig = (s, x) => {
if (s === 0) { const g = (t) => Math.exp(2 * t - 1), o = { xr: [-1, 2.5], yr: [-1, 12], gx: 0.5, lx: 1, fns: [{ f: g }], hl: [[5, "f-accent"]], pts: [], lab: "courbe y = e^(2x − 1) et droite y = 5" };
if (x !== null) o.pts.push([x, g(x), "", "f-dot"]);
return graph(o) + plain(x === null ? '<span class="small">en bleu y = e^(2x − 1), en rouge la hauteur 5</span>' : "e^(2 · " + nb(x) + " − 1) ≈ <b>" + nb(+g(x).toFixed(3)) + "</b> (on veut 5)"); }
if (s < 3) return tanFig(LNT[s], x);
const o = { xr: [0, 60], yr: [-1, 5], gx: 10, lx: 20, fns: [{ f: Math.log }], pts: [[E ** 4, Math.log(E ** 4), "", "f-fill2"]], lab: "courbe y = ln x" };
if (x !== null) o.pts.push([E ** 4, x, "", "f-dot"]);
return graph(o) + plain(x === null ? '<span class="small">courbe y = ln x ; le point clair est en x = e⁴ ≈ 54,6</span>' : "Tu proposes ln(e⁴) = <b>" + nb(x) + "</b> : " + (x === 4 ? '<b class="act-ok">le point est sur la courbe</b>' : "le point n'est pas sur la courbe"));
};

Object.assign(ACTIVE, {
primitives: {

plus: [{ d: "\\(f(x) = \\sin x\\) a pour primitives \\(F(x) = -\\cos x + C\\). Que vaut \\(C\\) si \\(F(0) = 3\\) ?", ans: 4, ok: "(−cos x)' = sin x. F(0) = −cos 0 + C = −1 + C = 3, donc C = 4.", no: "cos 0 = 1 : F(0) = −1 + C." },
{ d: "\\(f(x) = \\frac{1}{x^2}\\) a pour primitives \\(F(x) = -\\frac{1}{x} + C\\). Que vaut \\(C\\) si \\(F(1) = 2\\) ?", ans: 3, ok: "(−1/x)' = 1/x². F(1) = −1 + C = 2, donc C = 3.", no: "F(1) = −1/1 + C." }],

retiens: { regle: "\\(F\\) est une primitive de \\(f\\) si \\(F'(x) = f(x)\\). On primitive terme à terme : \\(x^n \\to \\frac{x^{n + 1}}{n + 1}\\), \\(\\cos x \\to \\sin x\\), \\(\\sin x \\to -\\cos x\\), \\(\\frac{1}{x^2} \\to -\\frac{1}{x}\\). Toutes les primitives diffèrent d'une constante \\(C\\) ; une condition (\\(F(a) = b\\)) la fixe." },
predict: { q: "Quelle fonction a pour dérivée 2x ?", choices: ["x²", "2", "2x²"], good: 0,
why: "(x²)' = 2x : x² est une primitive de 2x. Mais x² + 3 aussi ! Toutes les primitives diffèrent d'une constante." },
defis: ["f(x) = 6x² − 4x + 1 a pour primitives F(x) = 2x³ − 2x² + x + C. Règle C pour que F(1) = 5.", "f(x) = cos x a pour primitives F(x) = sin x + C. Règle C pour que F(π/2) = −1."],
play: slide({
ctl: (s) => [s ? { k: "C", lab: "Constante C", min: -4, max: 4, step: 0.5 } : { k: "C", lab: "Constante C", min: -6, max: 6 }],
init: (s) => ({ C: s ? 1 : 0 }),
fig: (st, s) => { const F = s ? (x) => Math.sin(x) : (x) => 2 * x ** 3 - 2 * x * x + x, P = s ? [Math.PI / 2, -1] : [1, 5], o = s ? { xr: [-1, 6.5], yr: [-5, 5] } : { xr: [-1.5, 2.2], yr: [-8, 10], gx: 0.5, lx: 1, gy: 2, ly: 4 };
o.fns = [-2, 2].map((d) => ({ f: (x) => F(x) + st.C + d, cls: "f-line", w: 1, dash: true })).concat([{ f: (x) => F(x) + st.C }]);
o.pts = [[P[0], P[1], s ? "(π/2 ; −1)" : "(1 ; 5)", "f-fill2", "r"]]; o.lab = "primitives de f, décalées verticalement";
return graph(o) + plain('<span class="small">en bleu F avec ta constante C ; en pointillés : d\'autres primitives (C ± 2)</span>'); },
out: (st, s) => (s ? "F(π/2) = sin(π/2) + C = 1 + " + par(st.C) + " = <b>" + nb(1 + st.C) + "</b> (on veut −1)" : "F(1) = 2 − 2 + 1 + C = 1 + " + par(st.C) + " = <b>" + nb(1 + st.C) + "</b> (on veut 5)"),
goal: [(st) => (st.C === 4 ? "F(x) = 2x³ − 2x² + x + 4 : F(1) = 1 + 4 = 5. Toutes les primitives ne diffèrent que de C ; la condition F(1) = 5 la fixe." : ""),
(st) => (st.C === -2 ? "F(x) = sin x − 2 : F(π/2) = 1 − 2 = −1. Une primitive de cos x est sin x ; une primitive de sin x est −cos x." : "")],
miss: (st, s) => (1 + st.C < (s ? -1 : 5) ? "La courbe passe sous le point : augmente C." : "La courbe passe au-dessus du point : diminue C."),
ask: [{ q: "f(x) = 3x² − 4x. Sa primitive F vérifie F(0) = 5. Calcule F(3).", ans: 14, ok: "F(x) = x³ − 2x² + 5, donc F(3) = 27 − 18 + 5 = 14. Vérification : F'(x) = 3x² − 4x.", no: "Une primitive de 3x² est x³, de −4x c'est −2x² ; puis F(0) = C = 5." },
{ q: "Une primitive de (2x + 1)³ s'écrit (2x + 1)⁴ ÷ k. Que vaut k ?", ans: 8, ok: "La dérivée de (2x + 1)⁴ est 4 · 2 · (2x + 1)³ = 8(2x + 1)³ : il faut diviser par k = 8 (par 4 et par 2).", no: "Dérive (2x + 1)⁴ : 4(2x + 1)³ · 2. Par quoi faut-il diviser pour retrouver (2x + 1)³ ?" }] }),
},
integrale: {

retiens: { regle: "Théorème fondamental : \\(\\int_a^b f(x)\\,dx = F(b) - F(a)\\) où \\(F\\) est une primitive de \\(f\\). Si \\(f \\geq 0\\), c'est l'aire sous la courbe. Relation de Chasles : \\(\\int_a^b f + \\int_b^c f = \\int_a^c f\\) ; échanger les bornes change le signe ; \\(\\int_a^b k f = k\\int_a^b f\\).", exemple: ["\\(\\int_1^3 2x\\,dx = 3^2 - 1^2 = 8\\).", "\\(\\int_0^2 f = 3\\) et \\(\\int_2^5 f = 4\\) : \\(\\int_0^5 f = 7\\), \\(\\int_5^0 f = -7\\), \\(\\int_0^5 3f = 21\\)."] },

plus: [{ d: "\\(\\int_0^2 f(x)\\,dx = 3\\) et \\(\\int_2^5 f(x)\\,dx = 4\\). Que vaut \\(\\int_0^5 f(x)\\,dx\\) ?", ans: 7, ok: "Relation de Chasles : on met bout à bout [0 ; 2] et [2 ; 5] : 3 + 4 = 7.", no: "L'intervalle [0 ; 5] est fait de [0 ; 2] et de [2 ; 5]." },
{ d: "Même \\(f\\) : que vaut \\(\\int_5^0 f(x)\\,dx\\) ?", ans: -7, ok: "Échanger les bornes change le signe : F(0) − F(5) = −(F(5) − F(0)) = −7.", no: "Les bornes sont dans l'autre ordre : F(0) − F(5)." },
{ d: "Même \\(f\\) : que vaut \\(\\int_0^5 3f(x)\\,dx\\) ?", ans: 21, ok: "Le facteur 3 sort de l'intégrale : 3 · 7 = 21 (linéarité).", no: "Une constante sort de l'intégrale." }],
predict: { q: "Une primitive de 2x est x². Quelle est l'aire sous la droite y = 2x entre x = 1 et x = 3 ?", choices: ["8", "4", "9"], good: 0,
why: "x² vaut 9 en 3 et 1 en 1 : 9 − 1 = 8 (borne du haut moins borne du bas). C'est le théorème fondamental : ∫ f = F(b) − F(a)." },


defis: ["Règle la borne b pour que \\(\\int_1^b 2x\\,dx = 8\\)."],
play: slide({
ctl: () => [{ k: "b", lab: "Borne b", min: 0.5, max: 5.5, step: 0.5 }],
init: () => ({ b: 2 }),
fig: (st, s) => { const b = st.b;
if (!s) return graph({ xr: [-0.5, 6], yr: [-1, 12], gy: 1, ly: 2, fns: [{ f: (x) => 2 * x }], polys: b > 1 ? [[shade((x) => 2 * x, z0, 1, b), "f-fill2"]] : [], vl: [[1, "f-line"]], lab: "aire sous y = 2x entre 1 et b" });
const f = (x) => x - 2, P = [[shade(f, z0, 0, Math.min(b, 2)), "f-soft"]];
if (b > 2) P.push([shade(f, z0, 2, b), "f-fill2"]);
return graph({ xr: [-0.5, 6], yr: [-3, 4], fns: [{ f }], polys: P, lab: "y = x − 2 : partie sous l'axe (grise) et au-dessus (bleue)" }); },
out: (st, s) => (s ? "∫₀ᵇ (x − 2) dx = [x²/2 − 2x] = " + nb(st.b * st.b / 2) + " − " + nb(2 * st.b) + " = <b>" + nb(st.b * st.b / 2 - 2 * st.b) + "</b><br><span class=\"small\">la partie sous l'axe compte négativement</span>"
: st.b < 1 ? "b < 1 : ∫₁ᵇ = −∫ᵇ₁, on obtient " + nb(st.b * st.b - 1) : "∫₁ᵇ 2x dx = [x²]₁ᵇ = " + nb(st.b * st.b) + " − 1 = <b>" + nb(st.b * st.b - 1) + "</b>"),
goal: [(st) => (st.b === 3 ? "∫₁³ 2x dx = 3² − 1² = 8 : c'est l'aire du trapèze coloré, calculée avec la primitive x²." : "")],
miss: (st, s) => ((s ? st.b * st.b / 2 - 2 * st.b < 0 : st.b * st.b - 1 < 8) ? "Pas assez : augmente b." : "Trop : diminue b."),
ask: [{ q: "Calcule \\(\\int_1^4 3x^2\\,dx\\).", ans: 63, ok: "Une primitive de 3x² est x³ : 4³ − 1³ = 64 − 1 = 63.", no: "Primitive de 3x² : x³. Puis F(4) − F(1)." }] }),
},
aireint: {
predict: { q: "L'intégrale de x³ entre −1 et 1 vaut 0. L'aire entre la courbe y = x³ et l'axe des x, de −1 à 1, vaut-elle aussi 0 ?", choices: ["Non", "Oui"], good: 0,
why: "Non : dans l'intégrale, la partie sous l'axe compte négativement et compense l'autre. Pour une aire, on prend chaque morceau en valeur absolue : 1/4 + 1/4 = 1/2." },
defis: ["Règle la pente m de la droite y = mx pour que l'aire entre la droite et la parabole y = x² vaille 4/3.", "f(x) = x² − 2x. Règle b pour que \\(\\int_0^b f(x)\\,dx = 0\\)."],
play: slide({
ctl: (s) => [s ? { k: "b", lab: "Borne b", min: 0.5, max: 4, step: 0.5 } : { k: "m", lab: "Pente m", min: 0.5, max: 4, step: 0.5 }],
init: (s) => (s ? { b: 2 } : { m: 1 }),
fig: (st, s) => {
if (!s) { const m = st.m; return graph({ xr: [-0.5, 4.5], yr: [-1, 17], gy: 1, ly: 4, fns: [{ f: (x) => x * x }, { f: (x) => m * x, cls: "f-accent", w: 2 }], polys: [[shade((x) => m * x, (x) => x * x, 0, m), "f-fill2"]], lab: "aire entre une droite et la parabole" }); }
const f = (x) => x * x - 2 * x, b = st.b, P = [[shade(f, z0, 0, Math.min(b, 2)), "f-soft"]];
if (b > 2) P.push([shade(f, z0, 2, b), "f-fill2"]);
return graph({ xr: [-0.5, 4.5], yr: [-2, 6], fns: [{ f }], polys: P, lab: "y = x² − 2x : partie sous l'axe (grise) et au-dessus (bleue)" }); },
out: (st, s) => (s ? "∫₀ᵇ (x² − 2x) dx = b³/3 − b² = <b>" + fr(st.b ** 3 / 3 - st.b * st.b) + "</b>" : "Intersections x = 0 et x = " + nb(st.m) + " ; aire = ∫₀ᵐ (mx − x²) dx = m³ ÷ 6 = <b>" + fr(st.m ** 3 / 6) + "</b>"),
goal: [(st) => (st.m === 2 ? "m = 2 : intersections 0 et 2, aire ∫₀² (2x − x²) dx = 4 − 8/3 = 4/3. On intègre « haut moins bas » entre les intersections." : ""),
(st) => (st.b === 3 ? "∫₀³ (x² − 2x) dx = 9 − 9 = 0 : la partie sous l'axe (−4/3) compense celle du dessus (+4/3). L'intégrale est nulle, mais pas l'aire !" : "")],
miss: (st, s) => (s ? (st.b ** 3 / 3 - st.b * st.b < 0 ? "Encore négatif : augmente b." : "Trop : diminue b.") : st.m ** 3 / 6 < 4 / 3 ? "Aire trop petite : augmente m." : "Aire trop grande : diminue m."),
ask: [{ q: "Aire du domaine compris entre y = 4 − x² et y = x + 2 ?", ans: 4.5, ok: "4 − x² = x + 2 donne x = −2 ou x = 1 ; ∫₋₂¹ (−x² − x + 2) dx = 7/6 + 10/3 = 9/2.", no: "Résous 4 − x² = x + 2, puis intègre (4 − x²) − (x + 2) entre les deux solutions." },
{ q: "Quelle est alors l'aire totale entre la courbe y = x² − 2x et l'axe des x, sur [0 ; 3] ?", ans: 8 / 3, ok: "On coupe au zéro x = 2 : |−4/3| + 4/3 = 8/3.", no: "Coupe en x = 2 (zéro de f) et additionne les valeurs absolues des deux intégrales." }] }),
},
volrev: {
predict: { q: "On fait tourner la courbe de f autour de l'axe des x. Une tranche très fine du solide est…", choices: ["un disque de rayon f(x)", "un rectangle de hauteur f(x)", "un cercle de diamètre x"], good: 0,
why: "Chaque tranche d'épaisseur dx est un disque d'aire π · f(x)² : en les empilant, V = π ∫ f(x)² dx." },
defis: ["Le segment y = (r ÷ 3) · x, pour x de 0 à 3, tourne autour de l'axe des x : c'est un cône de hauteur 3. Règle r pour que son volume soit 4π.", "Le demi-cercle y = √(r² − x²) tourne autour de l'axe des x : c'est une boule. Règle r pour que son volume soit 36π."],
play: slide({
ctl: (s) => [{ k: "r", lab: "Rayon r", min: s ? 1 : 0.5, max: s ? 5 : 4, step: 0.5 }],
init: (s) => ({ r: s ? 2 : 1 }),
fig: (st, s) => { const r = st.r;
if (!s) { const f = (x) => (r / 3) * x; return graph({ xr: [-0.5, 4], yr: [-4.5, 4.5], H: 250 , fns: [{ f, from: 0, to: 3 }, { f: (x) => -f(x), from: 0, to: 3, cls: "f-line", w: 1.4, dash: true }], polys: [[shade(f, (x) => -f(x), 0, 3), "f-fill2"]], segs: [[3, -r, 3, r, "f-line", 1.4, "4 3"]], lab: "profil du cône" }); }
const f = (x) => Math.sqrt(Math.max(0, r * r - x * x));
return graph({ xr: [-5.5, 5.5], yr: [-5.5, 5.5], eq: true , fns: [{ f, from: -r, to: r }, { f: (x) => -f(x), from: -r, to: r, cls: "f-line", w: 1.4, dash: true }], polys: [[shade(f, (x) => -f(x), -r, r), "f-fill2"]], lab: "profil de la boule" }); },
out: (st, s) => (s ? "V = π ∫₋ᵣʳ (r² − x²) dx = (4/3)π r³ = <b>" + nb(+((4 / 3) * st.r ** 3).toFixed(2)) + " π</b>" : "V = π ∫₀³ (r x ÷ 3)² dx = π · r² ÷ 9 · 9 = <b>" + nb(st.r * st.r) + " π</b>"),
goal: [(st) => (st.r === 2 ? "r = 2 : V = π ∫₀³ (2x/3)² dx = π · (4/9) · 9 = 4π, comme la formule du cône (1/3)π r² h = (1/3)π · 4 · 3." : ""),
(st) => (st.r === 3 ? "r = 3 : (4/3)π · 27 = 36π. La formule de la boule vient de π ∫ (r² − x²) dx." : "")],
miss: (st, s) => ((s ? (4 / 3) * st.r ** 3 < 36 : st.r * st.r < 4) ? "Volume trop petit : augmente r." : "Volume trop grand : diminue r."),
ask: [{ q: "Le graphe de f(x) = √x tourne autour de l'axe des x, de x = 0 à x = 4. Volume divisé par π ?", ans: 8, ok: "V = π ∫₀⁴ (√x)² dx = π ∫₀⁴ x dx = π · 8 : on intègre f(x)², ici x.", no: "On intègre f(x)² = x, pas √x : calcule ∫₀⁴ x dx." },
{ q: "Un tube : le domaine entre R(x) = 2 et r(x) = 1, de x = 0 à x = 5, tourne autour de l'axe des x. Volume divisé par π ?", ans: 15, ok: "Solide creux : π ∫₀⁵ (2² − 1²) dx = π · 3 · 5 = 15π.", no: "Solide creux : π ∫ (R² − r²) dx, ici (4 − 1) sur une longueur 5." }] }),
},
lnexp: {

retiens: { regle: "\\(e^x\\) et \\(\\ln\\) sont réciproques : \\(e^x = a \\iff x = \\ln a\\) (\\(a > 0\\)). \\(\\ln(ab) = \\ln a + \\ln b\\), \\(\\ln\\frac{a}{b} = \\ln a - \\ln b\\), \\(\\ln(a^n) = n\\ln a\\) et \\(\\ln 1 = 0\\). Dérivées : \\((e^x)' = e^x\\), \\((e^{u})' = u'e^{u}\\), \\((\\ln x)' = \\frac{1}{x}\\). Une primitive de \\(\\frac{1}{x}\\) est \\(\\ln x\\).", exemple: ["\\(e^{2x - 1} = 5 \\iff 2x - 1 = \\ln 5 \\iff x = \\frac{\\ln 5 + 1}{2}\\)", "\\((x\\ln x)' = \\ln x + 1\\)", "\\(\\int_1^{e^4} \\frac{dx}{x} = \\ln(e^4) - \\ln 1 = 4\\)", "\\(\\ln a = 2\\) et \\(\\ln b = 5\\) : \\(\\ln(ab) = 7\\) et \\(\\ln\\frac{b}{a} = 3\\)"] },

plus: [{ d: "On sait que \\(\\ln a = 2\\) et \\(\\ln b = 5\\). Que vaut \\(\\ln(ab)\\) ?", ans: 7, ok: "ln(ab) = ln a + ln b = 2 + 5 = 7 : le logarithme transforme un produit en somme.", no: "Le logarithme d'un produit est la somme des logarithmes." },
{ d: "Mêmes \\(a\\) et \\(b\\) : que vaut \\(\\ln\\left(\\frac{b}{a}\\right)\\) ?", ans: 3, ok: "ln(b/a) = ln b − ln a = 5 − 2 = 3 : un quotient devient une différence.", no: "Le logarithme d'un quotient est la différence des logarithmes." }],
predict: { q: "La dérivée de eˣ est…", choices: ["eˣ", "x · eˣ⁻¹", "e"], good: 0,
why: "eˣ est sa propre dérivée : en chaque point, la pente de la courbe égale sa hauteur. Ce n'est pas une puissance de x." },
defis: ["Résous e^(2x − 1) = 5 (au centième).", "f(x) = x · ln x. Tape la pente de la tangente en x = e².", "f(x) = e^(x²). Tape f'(1) (au centième).", "Calcule l'intégrale de 1/x entre 1 et e⁴."],
play: hunt({ ask: true, label: "Ta réponse", blank: (s) => lnFig(s, null), show: (x, s) => lnFig(s, x),
miss: (x, s) => ["ln et exp sont réciproques : e^(2x − 1) = 5 ⟺ 2x − 1 = ln 5.", "Produit : (x · ln x)' = 1 · ln x + x · (1/x). Et ln(e²) = 2.", "(e^u)' = u' · e^u avec u = x².", "Une primitive de 1/x est ln x : ln(e⁴) − ln 1. Rappel : ln(aⁿ) = n · ln a."][s],
wins: [W((Math.log(5) + 1) / 2, "2x − 1 = ln 5, donc x = (ln 5 + 1) ÷ 2 ≈ 1,30.", 0.006), W(3, "(x · ln x)' = ln x + 1 ; en x = e² : 2 + 1 = 3."), W(2 * E, "f'(x) = 2x · e^(x²), donc f'(1) = 2e ≈ 5,44.", 0.006), W(4, "∫₁^(e⁴) dx/x = ln(e⁴) − ln 1 = 4 − 0 = 4.")] }),
},
croissance: {

retiens: { regle: "Modèle \\(N(t) = N_0 e^{kt}\\) : croissance si \\(k > 0\\), décroissance si \\(k < 0\\). Pour trouver \\(t\\) : isoler \\(e^{kt}\\), puis appliquer \\(\\ln\\). Demi-vie \\(T\\) : \\(k = \\frac{\\ln 2}{T}\\) ; après 3 demi-vies, il reste \\(\\frac{1}{8}\\)." },
predict: { q: "Une quantité double toutes les 3 heures. Après 9 heures, elle a été multipliée par…", choices: ["8", "3", "6"], good: 0,
why: "9 heures = 3 doublements : × 2 × 2 × 2 = × 8. Une croissance exponentielle multiplie, elle n'additionne pas." },
defis: ["Des bactéries suivent N(t) = 400 · e^(0,25t) (t en heures). Règle t pour que la population ait doublé.", "Un isotope a une demi-vie de 5 ans : Q(t) = 800 · e^(−kt) grammes, avec k = ln 2 ÷ 5. Règle t pour qu'il n'en reste que 100 g."],
play: slide({
ctl: (s) => [s ? { k: "t", lab: "Temps t (années)", min: 0, max: 25 } : { k: "t", lab: "Temps t (heures)", min: 0, max: 6, step: 0.1 }],
init: (s) => ({ t: s ? 4 : 1 }),
fig: (st, s) => { const t = st.t, f = s ? (x) => 800 * Math.exp((-Math.LN2 / 5) * x) : (x) => 400 * Math.exp(0.25 * x);
return graph(s ? { xr: [0, 26], yr: [0, 900], pad: 22, gx: 1, lx: 5, gy: 100, ly: 200, fns: [{ f }], hl: [[100, "f-accent"]], pts: [[t, f(t), "", "f-dot"]], lab: "décroissance exponentielle" }
: { xr: [0, 6.2], yr: [0, 1900], pad: 26, gx: 0.5, lx: 1, gy: 200, ly: 400, fns: [{ f }], hl: [[800, "f-accent"]], pts: [[t, f(t), "", "f-dot"]], lab: "croissance exponentielle", fy: (v) => mil(v, 0) }); },
out: (st, s) => (s ? "Q(" + nb(st.t) + ") = 800 · e^(−k · " + nb(st.t) + ") ≈ <b>" + mil(800 * Math.exp((-Math.LN2 / 5) * st.t), 1) + " g</b> (on veut 100)" : "N(" + nb(st.t) + ") = 400 · e^(0,25 · " + nb(st.t) + ") ≈ <b>" + mil(400 * Math.exp(0.25 * st.t), 0) + "</b> (on veut 800)"),
goal: [(st) => (Math.abs(st.t - 2.8) < 1e-9 ? "e^(0,25t) = 2 ⟺ t = ln 2 ÷ 0,25 ≈ 2,77 h. Le temps de doublement ne dépend pas de N₀." : ""),
(st) => (st.t === 15 ? "15 ans = 3 demi-vies : 800 → 400 → 200 → 100 g, il reste 1/8. Calcul : e^(−kt) = 1/8 ⟺ t = ln 8 ÷ k = 15." : "")],
miss: (st, s) => (s ? (800 * Math.exp((-Math.LN2 / 5) * st.t) > 100 ? "Il en reste trop : avance le temps." : "Il en reste moins de 100 g : recule.") : 400 * Math.exp(0.25 * st.t) < 800 ? "Pas encore doublé : avance t." : "Plus que le double : recule t."),
ask: [{ q: "N(t) = 500 · e^(0,2t). Au bout de combien de temps atteint-on 2'000 ? (au dixième)", ans: Math.log(4) / 0.2, tol: 0.06, ok: "e^(0,2t) = 4, donc t = ln 4 ÷ 0,2 ≈ 6,9.", no: "Isole l'exponentielle : e^(0,2t) = 2'000 ÷ 500 = 4, puis applique ln." },
{ q: "Une population augmente de 5 % par an. Son taux continu k = ln(1,05) vaut environ… (au millième)", ans: Math.log(1.05), tol: 0.0006, ok: "k = ln(1,05) ≈ 0,049, un peu moins que 0,05 : N₀ · e^(kt) = N₀ · 1,05ᵗ.", no: "Une croissance de p % par an correspond à k = ln(1 + p/100)." }] }),
},
});





const mat = (x, y, Mx, hl = {}) => {
const w = 66, h = 46;
let g = `<path d="M${x + 6},${y} h-6 v${h} h6 M${x + w - 6},${y} h6 v${h} h-6" class="f-line" fill="none" stroke-width="1.6"/>`;
if (hl.r !== undefined) g += `<rect x="${x + 3}" y="${y + 3 + hl.r * 21}" width="${w - 6}" height="19" rx="5" class="f-fill2"/>`;
if (hl.c !== undefined) g += `<rect x="${x + 4 + hl.c * 29}" y="${y + 2}" width="${29}" height="${h - 4}" rx="5" class="f-fill2"/>`;
Mx.forEach((row, i) => row.forEach((v, j) => { g += T(x + 18 + j * 30, y + 18 + i * 21, v, "middle", 13); }));
return g;
};
const matFig = (s, x) => {
const q = x === null ? "?" : nb(x);
let g = "";
if (s === 0) g = T(4, 40, "A ·", "start", 13) + mat(28, 14, [["3", "2"], ["4", "5"]], { r: 0 }) + T(108, 40, "B ·", "start", 13) + mat(132, 14, [["1", "4"], ["2", "−1"]], { c: 1 }) + T(208, 40, "=", "middle", 14) + mat(222, 14, [["…", q], ["…", "…"]]);
if (s === 1) g = T(4, 40, "det", "start", 13) + mat(36, 14, [["3", "2"], ["4", "5"]]) + L(46, 22, 92, 52, "f-blue", 1.6) + L(92, 22, 46, 52, "f-accent", 1.6) + T(116, 40, "= " + q, "start", 14);
if (s === 2) g = T(4, 40, "A⁻¹ = (1/7) ·", "start", 13) + mat(100, 14, [["5", "−2"], ["−4", "3"]]) + T(180, 40, "→ en haut à droite : " + q, "start", 12);
if (s === 3) g = T(4, 22, "D", "start", 13) + mat(18, 6, [["3", "2"], ["4", "5"]]) + T(104, 22, "Dx", "start", 13) + mat(126, 6, [["12", "2"], ["23", "5"]], { c: 0 }) + T(4, 76, "x = Dx ÷ D = " + q, "start", 13);
return svg(320, s === 3 ? 86 : 70, g, "calcul matriciel");
};

const tlFig = (s, x) => {
const o = { xr: [-7, 7], yr: [-7, 7], eq: true , polys: [], pts: [], arrows: [], lab: "transformation linéaire du plan" };
let t = "";
if (s === 0) { o.arrows.push([0, 0, 4, 2, "f-line"]); o.pts.push([4, 2, "P", "f-dot", "r"]); if (x !== null) { o.pts.push([x, 4, "P' ?", "f-fill2", "r"]); o.arrows.push([0, 0, x, 4, "f-blue"]); } t = x === null ? "rotation de 90° autour de O" : x === -2 ? '<b class="act-ok">OP\' est bien OP tourné d\'un quart de tour</b>' : "OP' n'est pas OP tourné d'un quart de tour"; }
if (s === 1) { o.polys.push([[[0, 0], [1, 0], [1, 1], [0, 1]], "f-soft"], [[[0, 0], [2, 1], [3, 4], [1, 3]], "f-fill2"]); o.xr = [-1, 5]; o.yr = [-1, 5]; t = "carré unité (gris) et son image (bleu) : (1 ; 0) ↦ (2 ; 1), (0 ; 1) ↦ (1 ; 3)" + (x === null ? "" : " ; aire proposée " + nb(x)); }
if (s === 2) { o.pts.push([1, 2, "P", "f-dot", "r"], [1, -2, "f(P)", "f-dot", "r"]); if (x !== null) o.pts.push([3, x, "g(f(P)) ?", "f-fill2", "r"]); t = "f : symétrie d'axe Ox ; g : homothétie de rapport 3"; }
if (s === 3) { o.xr = [-1, 13]; o.yr = [-5, 9]; o.H = 250; o.polys.push([[[0, 0], [2, 0], [0, 4]], "f-soft"], [[[0, 0], [2, 4], [12, -4]], "f-fill2"]); t = "triangle d'aire 4 (gris) et son image (bleu)" + (x === null ? "" : " ; aire proposée " + nb(x)); }
return graph(o) + plain('<span class="small">' + t + "</span>");
};

Object.assign(ACTIVE, {
matrices: {

retiens: { regle: "Produit \\(AB\\) : chaque coefficient est « ligne de \\(A\\) × colonne de \\(B\\) » ; en général \\(AB \\neq BA\\). Déterminant \\(\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc\\). Si \\(\\det A \\neq 0\\), \\(A\\) est inversible et \\(A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}\\). Système \\(A\\binom{x}{y} = \\binom{e}{f}\\) : \\(x = \\frac{D_x}{D}\\), \\(y = \\frac{D_y}{D}\\) (Cramer), où \\(D = \\det A\\) et \\(D_x\\) remplace la colonne des x par le second membre. \\(\\det(AB) = \\det A \\cdot \\det B\\) et, pour une matrice 2 × 2, \\(\\det(kA) = k^2 \\det A\\).", exemple: ["\\(\\det\\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix} = 15 - 8 = 7\\), inverse \\(\\frac{1}{7}\\begin{pmatrix} 5 & -2 \\\\ -4 & 3 \\end{pmatrix}\\)", "\\(\\det A = 3\\), \\(\\det B = -4\\) : \\(\\det(AB) = -12\\) ; \\(\\det A = 5\\) : \\(\\det(3A) = 9 \\cdot 5 = 45\\)"], piege: "\\(\\det(3A) \\neq 3\\det A\\) : chacune des deux lignes est multipliée par 3, donc le déterminant par \\(3^2 = 9\\)." },

plus: [{ d: "\\(A\\) et \\(B\\) sont des matrices 2 × 2 avec \\(\\det A = 3\\) et \\(\\det B = -4\\). Que vaut \\(\\det(AB)\\) ?", ans: -12, ok: "Le déterminant d'un produit est le produit des déterminants : det(AB) = 3 · (−4) = −12.", no: "det(AB) = det A · det B." },
{ d: "\\(A\\) est une matrice 2 × 2 avec \\(\\det A = 5\\). Que vaut \\(\\det(3A)\\) ?", ans: 45, ok: "3A multiplie les deux lignes par 3 : det(3A) = 3 · 3 · det A = 9 · 5 = 45, et non 15.", no: "Dans 3A, chaque coefficient est multiplié par 3 : calcule 3a · 3d − 3b · 3c." }],
predict: { q: "Pour multiplier deux matrices, on…", choices: ["combine une ligne de la première avec une colonne de la seconde", "multiplie les coefficients placés au même endroit"], good: 0,
why: "Chaque coefficient du produit AB vient d'une ligne de A et d'une colonne de B : on multiplie terme à terme et on additionne. Ce n'est pas coefficient par coefficient." },
defis: ["\\(A = \\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix}\\) et \\(B = \\begin{pmatrix} 1 & 4 \\\\ 2 & -1 \\end{pmatrix}\\). Calcule le coefficient de AB en ligne 1, colonne 2.", "Calcule le déterminant de \\(A = \\begin{pmatrix} 3 & 2 \\\\ 4 & 5 \\end{pmatrix}\\).", "Que vaut le coefficient en haut à droite de l'inverse \\(A^{-1}\\) ?", "Résous \\(3x + 2y = 12\\) et \\(4x + 5y = 23\\) avec Cramer : que vaut x ?"],
play: hunt({ ask: true, label: "Ta réponse", blank: (s) => matFig(s, null), show: (x, s) => matFig(s, x),
miss: (x, s) => ["Ligne 1 de A : (3 ; 2). Colonne 2 de B : (4 ; −1). Multiplie terme à terme et additionne.", "det = ad − bc : diagonale bleue moins diagonale rouge.", "A⁻¹ = (1 / det A) · (d −b ; −c a), et det A = 7.", "D = det A = 7 ; Dx remplace la colonne des x par (12 ; 23)."][s],
wins: [W(10, "3 · 4 + 2 · (−1) = 10. (BA donnerait 1 · 2 + 4 · 5 = 22 à cette place : AB ≠ BA.)"), W(7, "det A = 3 · 5 − 2 · 4 = 15 − 8 = 7 ≠ 0 : A est inversible."), W(-2 / 7, "A⁻¹ = (1/7) · (5 −2 ; −4 3) : en haut à droite, −2/7. On échange a et d, on change le signe de b et c, on divise par det A."), W(2, "Dx = 12 · 5 − 2 · 23 = 14, donc x = 14 ÷ 7 = 2 ; de même y = (3 · 23 − 12 · 4) ÷ 7 = 3.")] }),
},
translin: {

retiens: { regle: "L'image de \\(P(x ; y)\\) par l'application de matrice \\(A\\) est \\(A\\binom{x}{y}\\). Les colonnes de \\(A\\) sont les images de \\((1 ; 0)\\) et \\((0 ; 1)\\). Rotation de 90° autour de O \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\), symétrie d'axe Ox \\(\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\), homothétie de centre O et de rapport k \\(\\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}\\). Les aires sont multipliées par \\(|\\det A|\\). Appliquer \\(f\\) (matrice A) puis \\(g\\) (matrice B) : matrice \\(BA\\)." },
predict: { q: "La matrice (2 0 ; 0 2) agit sur tous les points du plan. Elle…", choices: ["agrandit tout du double depuis O", "fait tourner de 90°", "ne change rien"], good: 0,
why: "(x ; y) ↦ (2x ; 2y) : c'est l'homothétie de centre O et de rapport 2. Les aires sont multipliées par det = 4." },
defis: ["Rotation de 90° autour de O, de matrice \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\). Abscisse de l'image de P(4 ; 2) ?", "Matrice \\(A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}\\). Aire de l'image du carré unité ?", "f = symétrie d'axe Ox, g = homothétie de centre O et de rapport 3. Ordonnée de l'image de P(1 ; 2) par g ∘ f (d'abord f) ?", "Matrice \\(\\begin{pmatrix} 1 & 3 \\\\ 2 & -1 \\end{pmatrix}\\). Un triangle d'aire 4 a pour image un triangle d'aire… ?"],
play: hunt({ ask: true, label: "Ta réponse", blank: (s) => tlFig(s, null), show: (x, s) => tlFig(s, x),
miss: (x, s) => ["Matrice × coordonnées : (0 · 4 − 1 · 2 ; 1 · 4 + 0 · 2).", "Les aires sont multipliées par |det A|.", "f(P) = (1 ; −2), puis g multiplie les coordonnées par 3.", "Facteur des aires : |det| = |1 · (−1) − 3 · 2|."][s],
wins: [W(-2, "(x ; y) ↦ (−y ; x), donc (4 ; 2) ↦ (−2 ; 4). Les colonnes de la matrice sont les images de (1 ; 0) et (0 ; 1)."), W(5, "Le carré unité (aire 1) devient un parallélogramme d'aire |det A| = |2 · 3 − 1 · 1| = 5."), W(-6, "f : (1 ; 2) ↦ (1 ; −2), puis g : ↦ (3 ; −6). Matrice de g ∘ f : B · A = (3 0 ; 0 −3), dans cet ordre."), W(28, "det = 1 · (−1) − 3 · 2 = −7 : les aires sont multipliées par |−7| = 7, donc 4 · 7 = 28.")] }),
},

appllin: {
retiens: { regle: "Le noyau de \\(f\\) est formé des vecteurs \\(\\vec v\\) tels que \\(A\\vec v = \\vec 0\\) ; il n'est pas réduit à \\(\\vec 0\\) exactement quand \\(\\det A = 0\\). Si \\(\\det A = 0\\), l'image est la droite engendrée par une colonne non nulle de \\(A\\). Dans une base \\((\\vec u ; \\vec v)\\), les composantes \\((\\alpha ; \\beta)\\) de \\(\\vec w\\) vérifient \\(\\vec w = \\alpha\\vec u + \\beta\\vec v\\).",
exemple: ["\\(A = \\begin{pmatrix} 2 & -4 \\\\ 3 & -6 \\end{pmatrix}\\) : \\(2 - 4m = 0\\), noyau engendré par \\((1 ; 0{,}5)\\) ; image : la droite \\(y = 1{,}5x\\)."] },
predict: { q: "La matrice \\(\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}\\) envoie tous les points du plan…", choices: ["sur une même droite", "sur tout le plan", "sur l'origine seulement"], good: 0,
why: "Les deux colonnes (1 ; 2) et (2 ; 4) sont colinéaires (det = 0) : toutes les images sont sur la droite y = 2x. Le plan est « écrasé », et toute une droite de vecteurs est envoyée sur 0 : c'est le noyau." },
defis: ["\\(A = \\begin{pmatrix} 6 & -2 \\\\ 9 & -3 \\end{pmatrix}\\). Le noyau est engendré par \\((1 \\,;\\, m)\\). Que vaut \\(m\\) ?", "Pour cette même matrice, l'image est la droite \\(y = px\\). Que vaut \\(p\\) ?", "Base \\(\\vec u = (1 \\,;\\, 2)\\), \\(\\vec v = (1 \\,;\\, -1)\\). \\(\\vec w = (5 \\,;\\, 4) = \\alpha\\vec u + \\beta\\vec v\\). Que vaut \\(\\alpha\\) ?"],
garde: [0, 2],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["Première ligne : 6 · 1 + (−2) · m = 0. ", "L'image est engendrée par la première colonne (6 ; 9) : pente 9 ÷ 6. ", "Système α + β = 5 et 2α − β = 4 : additionne les deux équations. "][s] + tu(x)),
wins: [W(3, "6 − 2m = 0, donc m = 3 : le vecteur (1 ; 3) est envoyé sur (0 ; 0)."), W(1.5, "Les colonnes (6 ; 9) et (−2 ; −3) sont colinéaires : l'image est la droite y = 1,5x."), W(3, "3α = 9, donc α = 3, puis β = 2 : (5 ; 4) = 3 · (1 ; 2) + 2 · (1 ; −1).")] }),
},
});





const tree = (p) => {
const t = (x, y, s, a = "start") => T(x, y, s, a, 11);
let g = L(14, 80, 112, 36) + L(14, 80, 112, 124) + L(140, 36, 232, 16) + L(140, 36, 232, 56) + L(140, 124, 232, 104) + L(140, 124, 232, 144);
g += t(118, 40, "M") + t(118, 128, "non M") + t(238, 20, "+") + t(238, 60, "−") + t(238, 108, "+") + t(238, 148, "−");
g += t(40, 50, nb(p)) + t(40, 118, nb(+(1 - p).toFixed(4))) + t(170, 20, "0,99") + t(170, 58, "0,01") + t(170, 108, "0,05") + t(170, 146, "0,95");
g += t(256, 20, "→ " + nb(+(0.99 * p).toFixed(5)), "start") + t(256, 108, "→ " + nb(+(0.05 * (1 - p)).toFixed(5)), "start");
return svg(320, 156, g, "arbre : malade ou non, puis test positif ou négatif");
};

const bars = (B, xr, yr, extra = {}) => graph(Object.assign({ xr, yr, gy: 0.1, ly: 0.2, segs: B.map(([x, p, cls]) => [x, 0, x, p, cls || "f-blue", 12]), lab: "diagramme en barres d'une loi de probabilité" }, extra));
const C5 = [1, 5, 10, 10, 5, 1], b5 = (k) => C5[k] * 0.3 ** k * 0.7 ** (5 - k);

const PHI = { "-3": 0.15, "-2": 2.5, "-1": 16, 0: 50, 1: 84, 2: 97.5, 3: 99.85 };

const dens = (z) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

Object.assign(ACTIVE, {
condbayes: {
predict: { q: "Un test repère 99 % des malades, mais il est aussi positif chez 5 % des personnes saines. La maladie touche 1 personne sur 100. Ton test est positif : la probabilité d'être malade est environ…", choices: ["17 %", "99 %", "50 %"], good: 0,
why: "Sur 10'000 personnes : 100 malades, dont 99 positifs ; 9'900 saines, dont 495 positives. 99 ÷ (99 + 495) ≈ 17 %. Il ne faut pas confondre P_M(+) = 99 % et P_+(M)." },
defis: ["Même test. Règle la proportion p de malades (en %) : quelle est la plus petite valeur pour laquelle un test positif signifie « malade » plus d'une fois sur deux ?", "P(A) = 0,4 et P(A ∩ B) = 0,12. Règle P(B) pour que A et B soient indépendants."],
play: slide({
ctl: (s) => [s ? { k: "b", lab: "P(B)", min: 0.1, max: 0.9, step: 0.05 } : { k: "p", lab: "Proportion de malades (%)", min: 1, max: 20 }],
init: (s) => (s ? { b: 0.5 } : { p: 1 }),
fig: (st, s) => { if (!s) return tree(st.p / 100);
const W = 300, H = 140, a = 0.4 * W, hb = st.b * H;
let g = `<rect x="10" y="4" width="${W}" height="${H}" class="f-soft"/><rect x="10" y="${4 + H - hb}" width="${W}" height="${hb}" class="f-fill2" style="opacity:0.6"/><rect x="10" y="4" width="${a}" height="${H}" fill="none" stroke="var(--accent)" stroke-width="2.4"/>`;
g += T(10 + a / 2, 18, "A (0,4)", "middle", 11) + T(10 + W - 6, 4 + H - hb + 14, "B", "end", 11);
return svg(320, 150, g, "univers : A à gauche, B en bas"); },
out: (st, s) => { if (s) return "P(A) · P(B) = 0,4 · " + nb(st.b) + " = <b>" + nb(+(0.4 * st.b).toFixed(4)) + "</b> ; P(A ∩ B) = 0,12";
const p = st.p / 100, a = 0.99 * p, b = 0.05 * (1 - p); return "P(+) = " + nb(+a.toFixed(5)) + " + " + nb(+b.toFixed(5)) + " = " + nb(+(a + b).toFixed(5)) + "<br>P(M sachant +) = " + nb(+a.toFixed(5)) + " ÷ " + nb(+(a + b).toFixed(5)) + " ≈ <b>" + nb(+((100 * a) / (a + b)).toFixed(1)) + " %</b>"; },
goal: [(st) => (st.p === 5 ? "p = 5 % : P(M sachant +) = 0,0495 ÷ (0,0495 + 0,0475) ≈ 51 %. Avec 4 %, on n'a que 45 % : quand la maladie est rare, beaucoup de tests positifs sont de faux positifs." : ""),
(st) => (Math.abs(st.b - 0.3) < 1e-9 ? "P(B) = 0,3 : P(A) · P(B) = 0,4 · 0,3 = 0,12 = P(A ∩ B), donc A et B sont indépendants. Et P_A(B) = 0,12 ÷ 0,4 = 0,3 = P(B) : savoir A ne change rien." : "")],
miss: (st, s) => { if (s) return 0.4 * st.b < 0.12 ? "P(A) · P(B) est trop petit : augmente P(B)." : "P(A) · P(B) est trop grand : diminue P(B).";
const p = st.p / 100, q = (0.99 * p) / (0.99 * p + 0.05 * (1 - p)); return q < 0.5 ? "Moins de 50 % : augmente la proportion de malades." : "Plus de 50 %, mais ce n'est pas la plus petite proportion : recule."; },
ask: [{ q: "Avec 1 % de malades, quelle est la probabilité (en %, à l'unité) d'être malade quand le test est positif ?", ans: 100 * 0.0099 / 0.0594, tol: 0.5, ok: "Bayes : P(M) · P_M(+) ÷ P(+) = 0,0099 ÷ (0,0099 + 0,0495) ≈ 0,167, soit 17 %.", no: "P(M ∩ +) = 0,01 · 0,99 ; P(+) = 0,01 · 0,99 + 0,99 · 0,05 ; divise le premier par le second." },
{ q: "Autre cas : P(A) = 0,4 et P(A ∩ B) = 0,1. Que vaut P_A(B) ?", ans: 0.25, ok: "P_A(B) = P(A ∩ B) ÷ P(A) = 0,1 ÷ 0,4 = 0,25.", no: "Définition : P_A(B) = P(A ∩ B) ÷ P(A)." }] }),
},
varalea: {

retiens: { regle: "Loi de \\(X\\) : valeurs \\(x_i\\) et probabilités \\(p_i\\) (somme 1). Espérance (moyenne à long terme) \\(E(X) = \\sum x_i p_i\\) ; un jeu est équitable si l'espérance du gain est nulle. Variance \\(V(X) = E(X^2) - E(X)^2\\), écart-type \\(\\sigma(X) = \\sqrt{V(X)}\\). Changement d'échelle : \\(E(aX + b) = aE(X) + b\\) et \\(V(aX + b) = a^2V(X)\\).", exemple: ["Deux piles → 6 CHF, un pile → 2 CHF : \\(E = 6 \\cdot 0{,}25 + 2 \\cdot 0{,}5 = 2{,}5\\) ; prix d'entrée équitable 2,50 CHF.", "\\(E(X) = 4\\) : \\(E(3X + 2) = 14\\) ; \\(V(X) = 5\\) : \\(V(3X + 2) = 9 \\cdot 5 = 45\\).", "\\(V(X) = 6{,}25\\) : \\(\\sigma(X) = 2{,}5\\)."], piege: "Le « + b » décale les valeurs sans les disperser : il change l'espérance, pas la variance." },

plus: [{ d: "\\(E(X) = 4\\). Que vaut \\(E(3X + 2)\\) ?", ans: 14, ok: "E(aX + b) = a · E(X) + b = 3 · 4 + 2 = 14 : chaque valeur est multipliée par 3 puis augmentée de 2, la moyenne aussi.", no: "Multiplie l'espérance par 3, puis ajoute 2." },
{ d: "\\(V(X) = 5\\). Que vaut \\(V(3X + 2)\\) ?", ans: 45, ok: "V(aX + b) = a² · V(X) = 9 · 5 = 45 : le facteur compte au carré, le + 2 ne disperse pas.", no: "La variance est un carré d'écarts : le facteur 3 compte au carré, et le + 2 ne change rien." },
{ d: "\\(V(X) = 6{,}25\\). Que vaut l'écart-type \\(\\sigma(X)\\) ?", ans: 2.5, ok: "σ(X) = √V(X) = √6,25 = 2,5 : l'écart-type est dans l'unité des valeurs.", no: "L'écart-type est la racine carrée de la variance." }],
predict: { q: "On lance un dé : sur un 6, tu gagnes 12 CHF, sinon rien. En moyenne, une partie rapporte…", choices: ["2 CHF", "6 CHF", "12 CHF"], good: 0,
why: "12 · 1/6 + 0 · 5/6 = 2 CHF : l'espérance pondère chaque gain par sa probabilité." },
defis: ["On paie un prix d'entrée, puis on lance deux pièces : deux piles → on reçoit 6 CHF, un seul pile → 2 CHF, aucun → rien. Règle le prix pour que le jeu soit équitable (espérance du gain net nulle).", "X prend les valeurs 1, 2 et 3 avec les probabilités 0,2 ; 0,45 et p. Règle p pour que ce soit une loi de probabilité."],
play: slide({
ctl: (s) => [s ? { k: "p", lab: "p = P(X = 3)", min: 0.05, max: 0.6, step: 0.05 } : { k: "c", lab: "Prix d'entrée (CHF)", min: 0, max: 5, step: 0.5 }],
init: (s) => (s ? { p: 0.15 } : { c: 1 }),
fig: (st, s) => { if (s) return bars([[1, 0.2], [2, 0.45], [3, st.p, "f-accent"]], [0, 4], [0, 0.7]);
const c = st.c, e = 2.5 - c; return bars([[6 - c, 0.25], [2 - c, 0.5], [-c, 0.25]], [-6, 7], [0, 0.6], { vl: [[e, "f-accent"]] }) + plain('<span class="small">barres : gain net G ; trait rouge : E(G)</span>'); },
out: (st, s) => { if (s) { const S = 0.65 + st.p; return "Somme des probabilités : 0,2 + 0,45 + " + nb(st.p) + " = <b>" + nb(+S.toFixed(4)) + "</b>"; }
return "G = " + nb(6 - st.c) + ", " + nb(2 - st.c) + " ou " + nb(-st.c) + " avec les probabilités 1/4, 1/2, 1/4<br>E(G) = 2,5 − " + nb(st.c) + " = <b>" + nb(2.5 - st.c) + " CHF</b>"; },
goal: [(st) => (st.c === 2.5 ? "Prix 2,5 CHF : E(G) = 3,5 · 1/4 + (−0,5) · 1/2 + (−2,5) · 1/4 = 0. Jeu équitable : en moyenne, on ne gagne ni ne perd." : ""),
(st) => (Math.abs(st.p - 0.35) < 1e-9 ? "0,2 + 0,45 + 0,35 = 1. Alors E(X) = 1 · 0,2 + 2 · 0,45 + 3 · 0,35 = 2,15." : "")],
miss: (st, s) => (s ? (0.65 + st.p < 1 ? "La somme n'atteint pas 1 : augmente p." : "La somme dépasse 1 : diminue p.") : 2.5 - st.c > 0 ? "E(G) > 0 : le joueur gagne en moyenne, augmente le prix." : "E(G) < 0 : le joueur perd en moyenne, baisse le prix."),
ask: [{ q: "Une loterie : gains 10, 0 et −2 CHF avec les probabilités 0,1 ; 0,5 et 0,4. Espérance du gain (CHF) ?", ans: 0.2, ok: "E = 10 · 0,1 + 0 · 0,5 + (−2) · 0,4 = 1 − 0,8 = 0,2 CHF.", no: "Multiplie chaque gain par sa probabilité, puis additionne." },
{ q: "Avec cette loi, calcule V(X) = E(X²) − E(X)² (au centième).", ans: 0.5275, tol: 0.006, ok: "E(X²) = 0,2 + 1,8 + 3,15 = 5,15 ; V = 5,15 − 2,15² = 0,5275 ≈ 0,53 ; écart-type σ ≈ 0,73.", no: "E(X²) = 1² · 0,2 + 2² · 0,45 + 3² · 0,35 ; puis retire E(X)² = 2,15²." }] }),
},
binomiale: {

retiens: { regle: "Schéma de Bernoulli : \\(n\\) épreuves identiques et indépendantes, chacune un succès avec la probabilité \\(p\\). \\(X\\) = nombre de succès suit \\(B(n \\,;\\, p)\\) : \\(P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}\\), où \\(\\binom{n}{k}\\) compte les chemins de l'arbre avec \\(k\\) succès. \\(E(X) = np\\)." },
predict: { q: "On lance 3 fois une pièce. Combien de chemins de l'arbre donnent exactement 2 piles ?", choices: ["3", "2", "6"], good: 0,
why: "PPF, PFP et FPP : 3 chemins, c'est le coefficient binomial (3 ; 2). Chacun a la probabilité 0,5³, donc P(X = 2) = 3 · 0,125 = 3/8." },
defis: ["X suit la loi binomiale B(5 ; 0,3) : 5 épreuves, succès avec la probabilité 0,3. Sélectionne la valeur de k la plus probable.", "On lance un dé n fois. Règle n pour que P(au moins un 6) dépasse 50 %, avec n le plus petit possible."],
play: slide({
ctl: (s) => [s ? { k: "n", lab: "Nombre de lancers n", min: 1, max: 10 } : { k: "k", lab: "Nombre de succès k", min: 0, max: 5 }],
init: (s) => (s ? { n: 1 } : { k: 4 }),
fig: (st, s) => (s ? bars(Array.from({ length: 10 }, (_, i) => [i + 1, 1 - (5 / 6) ** (i + 1), i + 1 === st.n ? "f-accent" : "f-blue"]), [0, 11], [0, 1], { hl: [[0.5, "f-line"]], gy: 0.1, ly: 0.5 })
: bars(C5.map((_, k) => [k, b5(k), k === st.k ? "f-accent" : "f-blue"]), [-0.8, 5.8], [0, 0.45])),
out: (st, s) => (s ? "P(au moins un 6) = 1 − (5/6)^" + st.n + " ≈ <b>" + nb(+(1 - (5 / 6) ** st.n).toFixed(3)) + "</b>"
: "P(X = " + st.k + ") = " + C5[st.k] + " · 0,3^" + st.k + " · 0,7^" + (5 - st.k) + " ≈ <b>" + nb(+b5(st.k).toFixed(3)) + "</b>"),
goal: [(st) => (st.k === 1 ? "k = 1 : P(X = 1) = 5 · 0,3 · 0,7⁴ ≈ 0,360, la plus haute barre (k = 2 donne 0,309)." : ""),
(st) => (st.n === 4 ? "n = 4 : 1 − (5/6)⁴ ≈ 0,518. Avec 3 lancers : 1 − (5/6)³ ≈ 0,421. « Au moins un » = 1 − « aucun »." : "")],
miss: (st, s) => (s ? (1 - (5 / 6) ** st.n < 0.5 ? "Pas encore 50 % : augmente n." : "Plus de 50 %, mais il y a plus petit.") : "Ce n'est pas la plus haute barre."),
ask: [{ q: "Toujours B(5 ; 0,3) : calcule P(X = 2) (au millième).", ans: b5(2), tol: 0.0006, ok: "10 chemins avec 2 succès : 10 · 0,3² · 0,7³ = 10 · 0,09 · 0,343 ≈ 0,309.", no: "N'oublie pas le coefficient : 10 chemins avec 2 succès, chacun de probabilité 0,3² · 0,7³." },
{ q: "12 passagers, chacun présent avec la probabilité 0,8, indépendamment. Espérance du nombre de présents ?", ans: 9.6, ok: "E(X) = n · p = 12 · 0,8 = 9,6 ; variance n · p · (1 − p) = 1,92.", no: "Pour une loi binomiale, E(X) = n · p." }] }),
},
normale: {

retiens: { regle: "Si \\(X\\) suit une loi normale de moyenne \\(\\mu\\) et d'écart-type \\(\\sigma\\) : \\(P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) \\approx 68\\,\\%\\), \\(P(\\mu - 2\\sigma \\le X \\le \\mu + 2\\sigma) \\approx 95\\,\\%\\), \\(P(\\mu - 3\\sigma \\le X \\le \\mu + 3\\sigma) \\approx 99{,}7\\,\\%\\). Par symétrie, chaque moitié d'intervalle vaut la moitié (34 %, 47,5 %, 49,85 %) et chaque « queue » la moitié du reste (16 %, 2,5 %, 0,15 %)." },
predict: { q: "Tailles d'adultes : moyenne 170 cm, écart-type 8 cm, loi normale. Quelle proportion mesure entre 162 et 178 cm ?", choices: ["environ 68 %", "environ 50 %", "environ 95 %"], good: 0,
why: "162 et 178 sont à un écart-type de la moyenne : environ 68 % des personnes (règle 68-95-99,7)." },
defis: ["Même modèle (μ = 170 cm, σ = 8 cm). Règle l'intervalle [a ; b] centré sur la moyenne qui contient environ 95 % des personnes.", "Règle maintenant un intervalle [a ; b] qui contient environ 81,5 % des personnes."],
play: slide({
ctl: () => [{ k: "a", lab: "Borne a (cm)", min: 146, max: 194, step: 8 }, { k: "b", lab: "Borne b (cm)", min: 146, max: 194, step: 8 }],
init: (s) => (s ? { a: 146, b: 194 } : { a: 162, b: 178 }),
fig: (st) => { const za = (st.a - 170) / 8, zb = (st.b - 170) / 8;
return graph({ xr: [-3.75, 3.75], yr: [-0.03, 0.43], gx: 1, lx: 1, gy: 0.1, ly: 1, fy: () => "", fx: (v) => nb(170 + 8 * v), fns: [{ f: dens }], polys: za < zb ? [[shade(dens, z0, za, zb), "f-fill2"]] : [], vl: [[0, "f-line"]], lab: "courbe en cloche, μ = 170, σ = 8" }) + plain('<span class="small">graduations : μ − 3σ = 146, …, μ + 3σ = 194</span>'); },
out: (st) => (st.a >= st.b ? "Choisis a plus petit que b." : "P(" + st.a + " ≤ X ≤ " + st.b + ") ≈ <b>" + nb(PHI[(st.b - 170) / 8] - PHI[(st.a - 170) / 8]) + " %</b><br><span class=\"small\">a = μ " + ((st.a - 170) / 8 < 0 ? "− " + -(st.a - 170) / 8 : "+ " + (st.a - 170) / 8) + "σ ; b = μ " + ((st.b - 170) / 8 < 0 ? "− " + -(st.b - 170) / 8 : "+ " + (st.b - 170) / 8) + "σ</span>"),
goal: [(st) => (st.a === 154 && st.b === 186 ? "[154 ; 186] = [μ − 2σ ; μ + 2σ] : environ 95 % des personnes." : ""),
(st) => (st.a < st.b && PHI[(st.b - 170) / 8] - PHI[(st.a - 170) / 8] === 81.5 ? "[" + st.a + " ; " + st.b + "] : on coupe à la moyenne, " + (st.a === 162 ? "34 % + 47,5 %" : "47,5 % + 34 %") + " = 81,5 %." : "")],
miss: (st, s) => (st.a >= st.b ? "" : s ? "On peut couper à la moyenne : 34 % d'un côté (1σ), 47,5 % de l'autre (2σ)." : (st.a + st.b) / 2 !== 170 ? "L'intervalle doit être centré sur 170." : "Centré, mais pas la bonne largeur : 95 % correspond à 2 écarts-types."),
ask: [{ q: "Quel pourcentage de personnes mesure moins de 154 cm ?", ans: 2.5, ok: "Hors de [154 ; 186], il reste 5 %, partagé également : 2,5 % de chaque côté.", no: "Ce qui reste hors de l'intervalle à 95 % se partage en deux queues égales." },
{ q: "Sur 400 personnes, combien mesurent plus de 186 cm (environ) ?", ans: 10, ok: "P(X > 186) = 2,5 %, et 400 · 0,025 = 10 personnes.", no: "186 = μ + 2σ : au-dessus, il reste 2,5 %." }] }),
},
});




const toi = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(cp[s] + "<br>" + tu(x)), wins });
Object.assign(ACTIVE, {
limites: {
retiens: { regle: "Si le dénominateur ne s'annule pas en \\(a\\), on remplace \\(x\\) par \\(a\\). Forme \\(\\frac{0}{0}\\) : on factorise le numérateur par \\((x - a)\\), on simplifie, puis on remplace \\(x\\) par \\(a\\).", exemple: ["\\(\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6\\)", "\\(\\lim_{x \\to 2} \\frac{x^2 + x - 6}{x - 2} = \\lim_{x \\to 2} (x + 3) = 5\\)"], piege: "\\(\\frac{0}{0}\\) n'est pas un résultat : c'est le signal qu'il faut simplifier." },
predict: { q: "Que vaut \\(\\frac{x^2 - 9}{x - 3}\\) pour \\(x = 3{,}001\\) ?", choices: ["environ 6", "environ 0", "on ne peut pas le calculer"], good: 0,
why: "Pour x ≠ 3, (x² − 9) ÷ (x − 3) = x + 3 : en 3,001, elle vaut 6,001. En x = 3, on obtient 0 ÷ 0, mais la limite vaut 6." },
defis: ["Calcule \\(\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}\\).", "Calcule \\(\\lim_{x \\to 2} \\frac{x^2 + x - 6}{x - 2}\\)."],
play: toi(["x² − 9 = (x − 3)(x + 3) : simplifie par (x − 3), puis remplace x par 3", "x² + x − 6 = (x − 2)(x + 3) : simplifie, puis remplace x par 2"],
[W(6, "(x − 3)(x + 3) ÷ (x − 3) = x + 3, qui vaut 6 en x = 3."), W(5, "x² + x − 6 = (x − 2)(x + 3) : il reste x + 3, qui vaut 5 en x = 2.")]),
},
limitinf: {
retiens: { regle: "À l'infini, une fraction rationnelle se comporte comme le quotient de ses termes de plus haut degré. Mêmes degrés en haut et en bas : la limite est le quotient des coefficients dominants.", exemple: ["\\(\\lim_{x \\to +\\infty} \\frac{6x^2 + x - 1}{2x^2 + 5} = \\frac{6}{2} = 3\\)", "\\(\\lim_{x \\to -\\infty} \\frac{3x - 4}{4x + 7} = \\frac{3}{4}\\)"] },
predict: { q: "Que devient \\(\\frac{6x^2 + 1}{2x^2 - 5}\\) quand \\(x\\) devient très grand (1'000, 1'000'000…) ?", choices: ["elle s'approche de 3", "elle devient énorme", "elle s'approche de 0"], good: 0,
why: "Pour x très grand, le + 1 et le − 5 ne comptent presque plus : 6x² ÷ 2x² = 3." },
defis: ["Calcule \\(\\lim_{x \\to +\\infty} \\frac{6x^2 + x - 1}{2x^2 + 5}\\).", "Calcule \\(\\lim_{x \\to -\\infty} \\frac{3x - 4}{4x + 7}\\) (fraction acceptée)."],
play: toi(["Garde seulement les termes de plus haut degré : 6x² en haut, 2x² en bas", "Termes dominants : 3x en haut, 4x en bas"],
[W(3, "6x² ÷ 2x² = 3 : les autres termes deviennent négligeables."), W(0.75, "3x ÷ 4x = 3/4, aussi en −∞ : les x se simplifient.")]),
},
asymptotes: {
retiens: { regle: "Asymptote verticale \\(x = a\\) : le dénominateur s'annule en \\(a\\) (et pas le numérateur). Asymptote horizontale \\(y = b\\) : \\(b\\) est la limite de \\(f(x)\\) à l'infini.", exemple: ["\\(f(x) = \\frac{2x + 1}{x - 3}\\) : asymptotes \\(x = 3\\) et \\(y = 2\\)."] },
predict: { q: "\\(f(x) = \\frac{2x + 1}{x - 3}\\). Que fait la courbe près de \\(x = 3\\) ?", choices: ["elle part vers l'infini", "elle passe par 0", "elle vaut 7"], good: 0,
why: "En x = 3, le dénominateur vaut 0 et le numérateur 7 : f(x) = 7 ÷ (très petit) devient énorme. La droite x = 3 est une asymptote verticale." },
defis: ["\\(f(x) = \\frac{2x + 1}{x - 3}\\). Son asymptote verticale a pour équation \\(x = a\\). Que vaut \\(a\\) ?", "Même fonction : son asymptote horizontale a pour équation \\(y = b\\). Que vaut \\(b\\) ?"],
play: toi(["Cherche où le dénominateur x − 3 s'annule", "Limite à l'infini : 2x ÷ x"],
[W(3, "x − 3 = 0 pour x = 3, où le numérateur vaut 7 : asymptote verticale x = 3."), W(2, "À l'infini, (2x + 1) ÷ (x − 3) ≈ 2x ÷ x = 2 : asymptote horizontale y = 2.")]),
},
continuite: {
retiens: { regle: "\\(f\\) est continue en \\(a\\) si \\(\\lim_{x \\to a} f(x) = f(a)\\). Pour une fonction par morceaux, les deux formules doivent donner la même valeur au point de raccord.", exemple: ["\\(x + 1\\) si \\(x < 2\\), \\(x^2 + k\\) si \\(x \\ge 2\\) : \\(3 = 4 + k\\), donc \\(k = -1\\).", "\\(g(x) = \\frac{x^2 - 16}{x - 4} = x + 4\\) pour \\(x \\neq 4\\) : on pose \\(g(4) = 8\\)."] },
predict: { q: "\\(f(x) = x + 1\\) si \\(x < 2\\), et \\(f(x) = x^2 + k\\) si \\(x \\ge 2\\). Pour que la courbe ne fasse pas de saut en 2…", choices: ["les deux formules doivent donner la même valeur en 2", "il faut k = 0", "c'est impossible"], good: 0,
why: "À gauche, la courbe arrive à la hauteur 2 + 1 = 3 ; à droite, elle part de 4 + k. Sans saut : 4 + k = 3." },
defis: ["\\(f(x) = x + 1\\) si \\(x < 2\\), et \\(f(x) = x^2 + k\\) si \\(x \\ge 2\\). Pour quelle valeur de \\(k\\) est-elle continue ?", "\\(g(x) = \\frac{x^2 - 16}{x - 4}\\) pour \\(x \\neq 4\\). Quelle valeur faut-il donner à \\(g(4)\\) pour que \\(g\\) soit continue ?"],
play: toi(["Valeur à gauche en 2 : 2 + 1 = 3 ; valeur à droite : 4 + k", "x² − 16 = (x − 4)(x + 4) : simplifie, puis prends la limite en 4"],
[W(-1, "4 + k = 3, donc k = −1 : les deux morceaux se rejoignent au point (2 ; 3)."), W(8, "g(x) = x + 4 pour x ≠ 4, de limite 8 : on pose g(4) = 8.")]),
},
etudefct: {
retiens: { regle: "Les extremums se cherchent là où \\(f'\\) s'annule en changeant de signe : de + à −, maximum local ; de − à +, minimum local. La valeur de l'extremum est \\(f(a)\\), pas \\(a\\).", exemple: ["\\(f(x) = x^3 - 12x\\) : \\(f'(x) = 3(x - 2)(x + 2)\\), maximum local \\(f(-2) = 16\\).", "\\(g(x) = x + \\frac{9}{x}\\) (\\(x > 0\\)) : \\(g'(x) = 1 - \\frac{9}{x^2}\\), minimum \\(g(3) = 6\\)."] },
predict: { q: "\\(f(x) = x^3 - 12x\\). Où chercher ses extremums ?", choices: ["là où f'(x) = 0", "là où f(x) = 0", "en x = 0"], good: 0,
why: "Un extremum est un sommet ou un creux : la tangente y est horizontale, donc f'(x) = 0 (et f' change de signe)." },
defis: ["\\(f(x) = x^3 - 12x\\). Quelle est la valeur de son maximum local ?", "\\(g(x) = x + \\frac{9}{x}\\) pour \\(x > 0\\). Quelle est la valeur de son minimum ?"],
play: toi(["f'(x) = 3x² − 12 = 3(x − 2)(x + 2) : f' passe de + à − en −2. Calcule f(−2)", "g'(x) = 1 − 9 ÷ x² s'annule en x = 3. Calcule g(3)"],
[W(16, "f(−2) = −8 + 24 = 16 : maximum local au point (−2 ; 16)."), W(6, "g(3) = 3 + 3 = 6 : minimum au point (3 ; 6).")]),
},
derivseconde: {
retiens: { regle: "Point d'inflexion : la courbe change de concavité, \\(f''\\) s'annule en changeant de signe. \\(f'' > 0\\) : courbe tournée vers le haut (convexe) ; \\(f'' < 0\\) : vers le bas (concave).", exemple: ["\\(f(x) = x^3 - 6x^2 + 5x\\) : \\(f''(x) = 6x - 12\\), inflexion en \\(x = 2\\).", "\\(f(x) = x^4 - 6x^2\\) : \\(f''(x) = 12x^2 - 12\\), inflexions en \\(x = \\pm 1\\)."] },
predict: { q: "La courbe de \\(f(x) = x^3\\) est tournée vers le bas pour \\(x < 0\\) et vers le haut pour \\(x > 0\\). Que vaut \\(f''(0)\\) ?", choices: ["0", "3", "6"], good: 0,
why: "f'(x) = 3x², f''(x) = 6x : f''(0) = 0, et f'' passe de − à + en 0. C'est un point d'inflexion." },
defis: ["\\(f(x) = x^3 - 6x^2 + 5x\\). En quelle abscisse a-t-elle un point d'inflexion ?", "\\(f(x) = x^4 - 6x^2\\). Quelle est la plus grande abscisse d'un point d'inflexion ?"],
play: toi(["f'(x) = 3x² − 12x + 5, puis f''(x) = 6x − 12 : résous f''(x) = 0", "f''(x) = 12x² − 12 : résous f''(x) = 0"],
[W(2, "f''(x) = 6x − 12 s'annule en 2 et change de signe : inflexion en x = 2."), W(1, "12x² − 12 = 0 pour x = −1 ou x = 1 (f'' change de signe en chacun) : la plus grande est 1.")]),
},
combi: {
retiens: { regle: "L'ordre compte (podium) : \\(n(n - 1)(n - 2) \\ldots\\). L'ordre ne compte pas (groupe) : on divise par le nombre d'ordres d'un même groupe, \\(k!\\) : \\(\\binom{n}{k}\\).", exemple: ["Podium avec 6 finalistes : \\(6 \\cdot 5 \\cdot 4 = 120\\).", "3 délégués parmi 7 : \\(\\binom{7}{3} = \\frac{7 \\cdot 6 \\cdot 5}{3!} = 35\\)."] },
predict: { q: "Trois coureurs A, B et C. Combien d'ordres d'arrivée sont possibles ?", choices: ["6", "3", "9"], good: 0,
why: "ABC, ACB, BAC, BCA, CAB, CBA : 3 choix pour la 1re place, 2 pour la 2e, 1 pour la 3e, soit 3 · 2 · 1 = 6." },
defis: ["6 athlètes disputent une finale. Combien de podiums (or, argent, bronze) sont possibles ?", "Combien de groupes de 3 délégués (sans rôle particulier) peut-on former dans un groupe de 7 élèves ?"],
play: toi(["6 choix pour l'or, puis 5 pour l'argent, puis 4 pour le bronze", "Si l'ordre comptait : 7 · 6 · 5. Chaque groupe est compté 3! = 6 fois"],
[W(120, "6 · 5 · 4 = 120 : ici l'ordre compte."), W(35, "7 · 6 · 5 = 210 ordres, divisés par 3! = 6 : 35 groupes.")]),
},
probaxiomes: {
retiens: { regle: "Issues équiprobables : \\(P(A) = \\frac{\\text{cas favorables}}{\\text{cas possibles}}\\). Réunion : \\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\).", exemple: ["Deux dés, somme 7 : 6 couples sur 36, \\(P = \\frac{1}{6}\\).", "\\(P(A \\cup B) = 0{,}5 + 0{,}4 - 0{,}2 = 0{,}7\\)"] },
predict: { q: "On lance deux dés et on additionne. Quelle somme est la plus probable ?", choices: ["7", "12", "elles sont toutes aussi probables"], good: 0,
why: "7 s'obtient de 6 façons (1 + 6, 2 + 5, …, 6 + 1) ; 12 d'une seule (6 + 6). Les 36 couples sont équiprobables, pas les sommes." },
defis: ["On lance deux dés. Probabilité d'obtenir une somme de 7 ? (fraction acceptée)", "\\(P(A) = 0{,}5\\), \\(P(B) = 0{,}4\\) et \\(P(A \\cap B) = 0{,}2\\). Que vaut \\(P(A \\cup B)\\) ?"],
play: toi(["Compte les couples (dé 1 ; dé 2) de somme 7 parmi les 36", "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)"],
[W(1 / 6, "6 couples sur 36 : (1 ; 6), (2 ; 5), (3 ; 4), (4 ; 3), (5 ; 2), (6 ; 1). P = 6/36 = 1/6."), W(0.7, "0,5 + 0,4 − 0,2 = 0,7 : l'intersection est retirée une fois.")]),
},
probarbre: {
retiens: { regle: "Le long d'un chemin de l'arbre, on multiplie les probabilités. Avec remise, l'urne est la même au 2e tirage ; sans remise, il y a un objet de moins.", exemple: ["3 rouges, 2 bleues, avec remise : \\(P(RR) = \\frac{3}{5} \\cdot \\frac{3}{5} = 0{,}36\\).", "Sans remise : \\(P(RR) = \\frac{3}{5} \\cdot \\frac{2}{4} = 0{,}3\\)."] },
predict: { q: "Une urne contient 2 boules rouges et 3 bleues. On tire deux boules avec remise. La probabilité de tirer deux rouges vaut…", choices: ["2/5 · 2/5 = 0,16", "2/5 + 2/5", "2/5"], good: 0,
why: "Sur l'arbre, le chemin rouge puis rouge a la probabilité 2/5 · 2/5 : le long d'un chemin, on multiplie." },
defis: ["Urne : 3 boules rouges et 2 bleues. Deux tirages avec remise : probabilité de tirer deux rouges ?", "Même urne, deux tirages sans remise : probabilité de tirer deux rouges ?"],
play: toi(["Avec remise, chaque tirage donne rouge avec la probabilité 3/5", "Sans remise : 3/5 au 1er tirage, puis il reste 2 rouges sur 4"],
[W(0.36, "3/5 · 3/5 = 9/25 = 0,36."), W(0.3, "3/5 · 2/4 = 6/20 = 0,3 : moins qu'avec remise.")]),
},
});
})();









(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;
const parseNum = (s) => Number(String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));

const tri = (p) => "(" + p.map(nb).join(" ; ") + ")";


const rq = (n) => { const r = Math.sqrt(n); return Math.abs(r - Math.round(r)) < 1e-9 ? " = " + nb(Math.round(r)) : " ≈ " + nb(+r.toFixed(2)); };
const rt = (n) => { const r = Math.sqrt(n); return Math.abs(r - Math.round(r)) < 1e-9 ? nb(Math.round(r)) : "√" + nb(n) + " ≈ " + nb(+r.toFixed(2)); };

const sg = (v) => (v < 0 ? " − " + nb(-v) : " + " + nb(v));
const par = (v) => (v < 0 ? "(" + nb(v) + ")" : nb(v));
const add = (a, b) => a.map((v, i) => v + b[i]), mul = (k, a) => a.map((v) => k * v), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];


let UID = 0;
const graph = (o) => {
const W = 320, m = 6, ml = m + (o.pad || 0), xr = o.xr, yr = o.yr, ux = (W - m - ml) / (xr[1] - xr[0]);
const H = o.H || 230, uy = (H - 2 * m) / (yr[1] - yr[0]);
const X = (v) => +(ml + (v - xr[0]) * ux).toFixed(1), Y = (v) => +(H - m - (v - yr[0]) * uy).toFixed(1), id = "c34b" + ++UID;
const gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || gx * 2, ly = o.ly || gy * 2, fy = o.fy || nb, fx = o.fx || nb;
let g = "", c = "";
for (let v = Math.ceil(xr[0] / gx) * gx; v <= xr[1] + 1e-9; v += gx) g += L(X(v), Y(yr[0]), X(v), Y(yr[1]), "f-grid", 0.7);
for (let v = Math.ceil(yr[0] / gy) * gy; v <= yr[1] + 1e-9; v += gy) g += L(X(xr[0]), Y(v), X(xr[1]), Y(v), "f-grid", 0.7);
const y0 = Math.min(Math.max(0, yr[0]), yr[1]), x0 = Math.min(Math.max(0, xr[0]), xr[1]);
g += L(X(xr[0]), Y(y0), X(xr[1]), Y(y0), "f-line", 1.2) + L(X(x0), Y(yr[0]), X(x0), Y(yr[1]), "f-line", 1.2);
let tk = "";
for (let v = Math.ceil(xr[0] / lx) * lx; v <= xr[1] + 1e-9; v += lx) if (Math.abs(v) > 1e-9 && v < xr[1] - 1e-9) tk += T(X(v), Math.min(Y(y0) + 13, H - 2), fx(+v.toFixed(6)), "middle", 10, "f-txt f-tick");
for (let v = Math.ceil(yr[0] / ly) * ly; v <= yr[1] + 1e-9; v += ly) if (Math.abs(v) > 1e-9 && v < yr[1] - 1e-9) tk += T(Math.max(X(x0) - 4, o.pad ? ml - 3 : 24), Y(v) + 3.5, fy(+v.toFixed(6)), "end", 10, "f-txt f-tick");
for (const [P, cls, op] of o.polys || []) c += `<polygon points="${P.map(([x, y]) => X(x) + "," + Y(Math.max(yr[0], Math.min(yr[1], y)))).join(" ")}" class="${cls || "f-fill2"}" style="stroke:none;opacity:${op || 0.7}"/>`;
const span = yr[1] - yr[0];
for (const F of o.fns || []) {
const a = Math.max(xr[0], F.from ?? -Infinity), b = Math.min(xr[1], F.to ?? Infinity), N = 300; let d = "", prev = null;
for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N, y = F.f(x);
if (!isFinite(y) || y < yr[0] - span || y > yr[1] + span || (prev !== null && Math.abs(y - prev) > span)) { prev = null; continue; }
d += (prev === null ? "M" : "L") + X(x) + "," + Y(y) + " "; prev = y; }
if (d) c += `<path d="${d}" class="${F.cls || "f-blue"}" fill="none" stroke-width="${F.w || 2.4}"${F.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
}
for (const [x, cls] of o.vl || []) c += L(X(x), Y(yr[0]), X(x), Y(yr[1]), cls || "f-accent", 1.6, "6 4");
for (const [y, cls] of o.hl || []) c += L(X(xr[0]), Y(y), X(xr[1]), Y(y), cls || "f-accent", 1.6, "6 4");
for (const [x1, y1, x2, y2, cls, w, dash] of o.segs || []) c += L(X(x1), Y(y1), X(x2), Y(y2), cls || "f-line", w || 1.6, dash);
let p = "";
for (const [x, y, lab, cls, pos] of o.pts || []) {
if (x < xr[0] || x > xr[1] || y < yr[0] || y > yr[1]) continue;
p += `<circle cx="${X(x)}" cy="${Y(y)}" r="5" class="${cls || "f-dot"}"/>`;
if (lab) { const left = pos === "l" || (pos !== "r" && X(x) > W - 90); p += T(X(x) + (left ? -8 : 8), Y(y) + (pos === "b" ? 16 : -7), lab, left ? "end" : "start", 12); }
}
for (const [x, y, t, a] of o.txt || []) p += T(X(x), Y(y), t, a || "middle", 11);
return svg(W, H, `<defs><clipPath id="${id}"><rect x="${ml}" y="${m}" width="${W - m - ml}" height="${H - 2 * m}"/></clipPath></defs>${g}<g clip-path="url(#${id})">${c}</g>${tk}${p}`, o.lab || "repère");
};


const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
const go = () => { const v = parseNum(inp.value); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
x = v; draw(); if (!check()) { const mm = typeof o.miss === "function" ? o.miss(x, s) : o.miss; $hint(box, mm || "Pas encore : regarde la figure, puis recalcule."); } };
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const mm = o.wins[step](x); if (mm) { onWin(step, mm); step++; x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg, tol = 1e-9) => (x) => (Math.abs(x - target) <= tol ? msg : "");




const slide = (o) => (box, onWin) => {
let step = 0, st = null, asking = false;
const start = () => {
st = Object.assign({}, o.init(step)); asking = false;
const cs = o.ctl(step);
box.innerHTML = `<div class="s2c-fig"></div>` + cs.map((c) => `<label class="dyn-ctl"><span class="small">${c.lab} : <b class="s2c-v" data-k="${c.k}"></b></span><input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${st[c.k]}" aria-label="${c.lab}"></label>`).join("") +
`<div class="act-out s2c-out" aria-live="polite"></div><div class="s2c-ask"></div><div class="small muted">${o.note || "Fais glisser " + (cs.length > 1 ? "les curseurs" : "le curseur") + " : on vérifie quand tu lâches."}</div>`;
box.querySelectorAll('input[type="range"]').forEach((inp) => {
inp.oninput = () => { if (asking) { inp.value = st[inp.dataset.k]; return; } st[inp.dataset.k] = +inp.value; refresh(); };
inp.onchange = () => { if (asking) return; st[inp.dataset.k] = +inp.value; refresh(); check(); };
});
refresh();
};
const refresh = () => {
box.querySelector(".s2c-fig").innerHTML = o.fig(st, step);
box.querySelectorAll(".s2c-v").forEach((b) => (b.textContent = o.fmt ? o.fmt(b.dataset.k, st[b.dataset.k], step) : nb(st[b.dataset.k])));
box.querySelector(".s2c-out").innerHTML = o.out(st, step);
};
const win = (mm) => { onWin(step, mm); step++; if (step < o.goal.length) start(); else { asking = true; box.querySelector(".s2c-ask").innerHTML = ""; } };
const check = () => {
if (asking || step >= o.goal.length) return;
const mm = o.goal[step](st);
if (!mm) { const t = o.miss && o.miss(st, step); if (t) $hint(box, t); else { const el = box.querySelector(".act-hint"); if (el) el.textContent = ""; } return; }
const A = o.ask && o.ask[step];
if (!A) { win(mm); return; }
asking = true; const el = box.querySelector(".act-hint"); if (el) el.textContent = "";
const ab = box.querySelector(".s2c-ask");
ab.innerHTML = `<div class="act-out" style="margin-top:6px"><b>✓ ${mm}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
if (typeof typeset === "function" && /\\\(/.test(A.q)) typeset(ab);
const inp = ab.querySelector("input"), go = () => { const v = parseNum(inp.value);
if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre (fraction acceptée, par exemple 3/2)."); return; }
if (Math.abs(v - A.ans) <= (A.tol || 1e-9)) win(A.ok); else $hint(box, A.no || "Pas encore : reprends le raisonnement de la figure."); };
actAnswerBind(ab, go);
};
start();
};





const CA = Math.cos(Math.PI / 6), SA = Math.sin(Math.PI / 6), CB = Math.cos(Math.PI / 9), SB = Math.sin(Math.PI / 9);
const raw = (q) => [q[1] * CA - q[0] * SA, -(q[2] * CB - (q[0] * CA + q[1] * SA) * SB)];
const scene = (box, opt = {}) => {
const W = 320, m = 16; let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
for (const x of box[0]) for (const y of box[1]) for (const z of box[2]) { const [u, v] = raw([x, y, z]); a = Math.min(a, u); b = Math.max(b, u); c = Math.min(c, v); d = Math.max(d, v); }
const s = Math.min(opt.s || 60, (W - 2 * m) / (b - a), ((opt.H || 290) - 2 * m) / (d - c)), H = Math.round((d - c) * s + 2 * m), ox = (W - (b - a) * s) / 2 - a * s, oy = m - c * s;
const p = (q) => { const [u, v] = raw(q); return [+(ox + u * s).toFixed(1), +(oy + v * s).toFixed(1)]; };
let back = "", g = "", top = "";
const S = {
p, s,
line(A, B, cls = "f-line", w = 1.6, dash) { const u = p(A), v = p(B); g += L(u[0], u[1], v[0], v[1], cls, w, dash); return S; },
path(Ps, cls = "f-line", w = 1.6, dash, close) { g += `<path d="${Ps.map((q, i) => (i ? "L" : "M") + p(q).join(",")).join(" ")}${close ? " Z" : ""}" class="${cls}" fill="none" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`; return S; },
poly(Ps, cls = "f-soft", op = 0.5) { back += `<polygon points="${Ps.map((q) => p(q).join(",")).join(" ")}" class="${cls}" style="stroke:none;opacity:${op}"/>`; return S; },
arrow(A, B, cls = "f-blue", w = 2.6) {
const u = p(A), v = p(B), dx = v[0] - u[0], dy = v[1] - u[1], n = Math.hypot(dx, dy); if (n < 1) return S;
const ex = dx / n, ey = dy / n, k = Math.min(11, n * 0.45), e = [v[0] - ex * k, v[1] - ey * k];
g += L(u[0], u[1], e[0].toFixed(1), e[1].toFixed(1), cls, w) + `<polygon points="${v[0]},${v[1]} ${(e[0] - ey * 5).toFixed(1)},${(e[1] + ex * 5).toFixed(1)} ${(e[0] + ey * 5).toFixed(1)},${(e[1] - ex * 5).toFixed(1)}" class="${cls === "f-accent" ? "f-headacc" : "f-head"}" style="${cls === "f-blue" ? "fill:var(--blue)" : ""}"/>`;
return S; },
dot(A, lab, cls = "f-dot", pos = "r", r = 4.5) {
const u = p(A); top += `<circle cx="${u[0]}" cy="${u[1]}" r="${r}" class="${cls}"/>`;
if (lab) top += T(u[0] + (pos === "l" ? -8 : 8), u[1] + (pos === "b" ? 16 : -7), lab, pos === "l" ? "end" : "start", 12);
return S; },
text(A, t, a = "middle", sz = 11) { const u = p(A); top += T(u[0], u[1], t, a, sz); return S; },
raw(svgPart) { g += svgPart; return S; },

guides(A) { const [x, y, z] = A; if (z) S.line([x, y, 0], A, "f-line", 1, "3 3"); if (x || y) S.line([x, 0, 0], [x, y, 0], "f-line", 1, "3 3").line([0, y, 0], [x, y, 0], "f-line", 1, "3 3"); return S; },
svg(lab) { return svg(W, H, back + g + top, lab); },
};
if (opt.axes !== false) {
const N = ["x", "y", "z"];
for (let i = 0; i < 3; i++) {
const lo = Math.min(0, box[i][0]), hi = Math.max(0, box[i][1]), A = [0, 0, 0], B = [0, 0, 0]; A[i] = lo; B[i] = hi;
S.line(A, B, "f-line", 1.1); const E = [0, 0, 0]; E[i] = hi; const u = p(E); top += T(u[0] + (i === 0 ? -6 : i === 1 ? 8 : 0), u[1] + (i === 2 ? -4 : i === 0 ? 12 : 4), N[i], "middle", 12);
if (opt.ticks !== false) for (let k = Math.ceil(lo); k <= hi - 0.5; k++) { if (!k) continue; const Q = [0, 0, 0]; Q[i] = k; const q = p(Q);
back += `<circle cx="${q[0]}" cy="${q[1]}" r="1.6" class="f-dot" style="opacity:0.55"/>`;
if (opt.ticks === "all" || k === 1) top += T(q[0] + (i === 2 ? -6 : 0), q[1] + (i === 2 ? 3 : 12), nb(k), i === 2 ? "end" : "middle", 9, "f-txt f-tick"); }
}
}
return S;
};

const clip = (A, u, box, t0 = -50, t1 = 50) => {
for (let i = 0; i < 3; i++) {
if (Math.abs(u[i]) < 1e-12) { if (A[i] < box[i][0] || A[i] > box[i][1]) return null; continue; }
const a = (box[i][0] - A[i]) / u[i], b = (box[i][1] - A[i]) / u[i]; t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
}
return t0 < t1 ? [add(A, mul(t0, u)), add(A, mul(t1, u))] : null;
};
const inBox = (P, box) => P.every((v, i) => v >= box[i][0] - 1e-9 && v <= box[i][1] + 1e-9);




const BV = [[0, 4], [-1, 5], [-2, 3]], A1 = [1, 2, 0];
const BC = [[0, 5], [-1, 3], [-1, 4]], CA1 = [1, 0, 2], CB1 = [3, 1, 1];
const BW = [[-2, 2], [-4, 4], [-3, 4]], U1 = [1, 0, 1], V1 = [0, 2, 1], W1 = [2, -2, 1];
const BD = [[-1, 6], [-3, 1], [-1, 5]], DA = [1, 0, 4], DU = [2, -1, -2], DB = [-1, -3, 2], DV = [2, 1, 0];
const BP = [[0, 8], [0, 4], [0, 4]], BP2 = [[0, 4.5], [0, 4.5], [0, 4.5]];
const BR = [[-1, 5], [-1, 5], [-1, 5]];
const BS1 = [[0, 2.2], [0, 2.2], [-3, 3]], BS2 = [[0, 1.5], [0, 1.5], [-3, 3]];
const BDP = [[-2, 4], [-3, 3], [-2, 3]], H0 = [1, 0, 0], E1 = [1, 0, -1], E2 = [1, -2, 0], PD = [3, 1, 2];
const BDL = [[-1, 5], [-1, 4], [0, 2]], LA = [1, 0, 0], LU = [1, 1, 0], LP = [5, 0, 1];
const BSP = [[-5.5, 5.5], [-5.5, 5.5], [-6, 6]];

const traces = (S, a, b, c, d, cls = "f-fill2") => { const P = [[d / a, 0, 0], [0, d / b, 0], [0, 0, d / c]]; S.poly(P, cls, 0.45).path(P, "f-line", 1.4, null, true); return P; };

const arc = (S, u, v, r) => { const nu = Math.hypot(...u), nv = Math.hypot(...v), a = mul(1 / nu, u), b = mul(1 / nv, v), al = Math.acos(Math.max(-1, Math.min(1, dot(a, b)))); if (al < 1e-6) return;
const P = []; for (let i = 0; i <= 24; i++) { const t = (al * i) / 24, w = add(mul(Math.sin(al - t) / Math.sin(al), a), mul(Math.sin(t) / Math.sin(al), b)); P.push(mul(r, w)); }
if (Math.abs(al - Math.PI) < 1e-6) return; S.path(P, "f-accent", 1.6); };
const ang = (u, v) => (Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (Math.hypot(...u) * Math.hypot(...v))))) * 180) / Math.PI;

Object.assign(ACTIVE, {
vect3d: {
retiens: { regle: "Dans un repère de l'espace, \\(\\overrightarrow{AB} = B - A\\) : on soustrait les coordonnées de \\(A\\) à celles de \\(B\\), une par une. La norme de \\(\\vec{u} = (a \\,;\\, b \\,;\\, c)\\) vaut \\(\\|\\vec{u}\\| = \\sqrt{a^2 + b^2 + c^2}\\) (Pythagore deux fois) : c'est la distance \\(AB\\). Le milieu de \\([AB]\\) est la moyenne des coordonnées de \\(A\\) et de \\(B\\).",
exemple: ["\\(A(1 \\,;\\, 2 \\,;\\, 0)\\), \\(B(3 \\,;\\, -1 \\,;\\, 2)\\) : \\(\\overrightarrow{AB} = (2 \\,;\\, -3 \\,;\\, 2)\\).", "\\(\\|(1 \\,;\\, 2 \\,;\\, 2)\\| = \\sqrt{1 + 4 + 4} = 3\\).", "Milieu de \\(A(1 \\,;\\, 2 \\,;\\, -1)\\) et \\(B(3 \\,;\\, 0 \\,;\\, 4)\\) : \\(\\left(2 \\,;\\, 1 \\,;\\, \\frac{3}{2}\\right)\\)."],
piege: "\\(\\overrightarrow{AB} = B - A\\), pas \\(A - B\\) (ce serait \\(\\overrightarrow{BA}\\)) : arrivée moins départ." },
predict: { q: "A(1 ; 2 ; −1) et B(3 ; 0 ; 4). Les composantes du vecteur AB sont…", choices: ["(2 ; −2 ; 5)", "(4 ; 2 ; 3)", "(−2 ; 2 ; −5)"], good: 0,
why: "On soustrait les coordonnées de A à celles de B : (3 − 1 ; 0 − 2 ; 4 − (−1)) = (2 ; −2 ; 5). (4 ; 2 ; 3) est la somme, (−2 ; 2 ; −5) le vecteur BA." },
defis: ["A(1 ; 2 ; 0) est fixé. Déplace B pour que \\(\\overrightarrow{AB} = (2 \\,;\\, -3 \\,;\\, 2)\\).", "Déplace B pour que la distance AB vaille exactement 3, avec les trois composantes de \\(\\overrightarrow{AB}\\) non nulles."],
play: slide({
ctl: () => [{ k: "x", lab: "x de B", min: 0, max: 4 }, { k: "y", lab: "y de B", min: -1, max: 5 }, { k: "z", lab: "z de B", min: -2, max: 3 }],
init: (s) => (s ? { x: 3, y: -1, z: 2 } : { x: 4, y: 4, z: 3 }),
fig: (st) => { const B = [st.x, st.y, st.z], u = [B[0] - 1, B[1] - 2, B[2]], S = scene(BV);
S.guides(B).path([A1, add(A1, [u[0], 0, 0]), add(A1, [u[0], u[1], 0]), B], "f-blue", 1.6, "5 4");
if (u.some((v) => v)) S.arrow(A1, B, "f-accent");
return S.dot(A1, "A", "f-dot", "l").dot(B, "B(" + B.map(nb).join(" ; ") + ")", "f-fill2", "r").svg("vecteur AB dans l'espace"); },
out: (st) => { const u = [st.x - 1, st.y - 2, st.z], n2 = dot(u, u);
return "Vecteur AB = B − A = (" + nb(st.x) + " − 1 ; " + nb(st.y) + " − 2 ; " + nb(st.z) + " − 0) = <b>" + tri(u) + "</b><br>AB = √(" + u.map((v) => par(v) + "²").join(" + ") + ") = √" + nb(n2) + "<b>" + rq(n2) + "</b>" + '<br><span class="small">en bleu : on avance selon x, puis selon y, puis selon z (Pythagore deux fois)</span>'; },
goal: [(st) => (st.x === 3 && st.y === -1 && st.z === 2 ? "B = A + (2 ; −3 ; 2) = (3 ; −1 ; 2) : on ajoute les composantes à A, ou B − A = (2 ; −3 ; 2)." : ""),
(st) => { const u = [st.x - 1, st.y - 2, st.z]; return dot(u, u) === 9 && u.every((v) => v) ? "AB = " + tri(u) + " : √(" + u.map((v) => v * v).join(" + ") + ") = √9 = 3. Pythagore deux fois : d'abord dans le plan horizontal, puis avec la hauteur." : ""; }],
miss: (st, s) => { const u = [st.x - 1, st.y - 2, st.z];
if (s === 0) { const k = [0, 1, 2].find((i) => u[i] !== [2, -3, 2][i]); return "Composante en " + "xyz"[k] + " : " + nb(u[k]) + " au lieu de " + nb([2, -3, 2][k]) + "."; }
return dot(u, u) === 9 ? "AB = 3, mais une composante est nulle. Cherche trois carrés non nuls dont la somme fait 9." : "AB² = " + nb(dot(u, u)) + " : il faut AB² = 9."; },
ask: [null, { q: "A(1 ; 2 ; −1) et B(3 ; 0 ; 4). Tape la cote (troisième coordonnée) du milieu de [AB].", ans: 1.5, ok: "(−1 + 4) ÷ 2 = 3/2 : le milieu est (2 ; 1 ; 3/2), la moyenne des coordonnées.", no: "Milieu : moyenne des deux cotes, (−1 + 4) ÷ 2." }] }),
},

colin: {
retiens: { regle: "\\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires s'il existe \\(k\\) tel que \\(\\vec{v} = k\\,\\vec{u}\\) : les trois rapports de composantes sont égaux. \\(A\\), \\(B\\), \\(C\\) sont alignés si \\(\\overrightarrow{AC} = t\\,\\overrightarrow{AB}\\). Trois vecteurs sont coplanaires si l'un est combinaison des deux autres : \\(\\vec{w} = \\alpha\\vec{u} + \\beta\\vec{v}\\) ; deux composantes donnent \\(\\alpha\\) et \\(\\beta\\), la troisième vérifie.",
exemple: ["\\((2 \\,;\\, -1 \\,;\\, 3)\\) et \\((6 \\,;\\, -3 \\,;\\, 8)\\) ne sont pas colinéaires : \\(\\frac{8}{3} \\neq 3\\).", "\\(A(1 \\,;\\, 0 \\,;\\, 2)\\), \\(B(3 \\,;\\, 1 \\,;\\, 1)\\), \\(C(5 \\,;\\, 2 \\,;\\, 0)\\) : \\(\\overrightarrow{AC} = 2\\,\\overrightarrow{AB}\\), alignés.", "\\((2 \\,;\\, -2 \\,;\\, 1) = 2(1 \\,;\\, 0 \\,;\\, 1) - (0 \\,;\\, 2 \\,;\\, 1)\\) : coplanaires."],
piege: "Deux équations suffisent à trouver \\(\\alpha\\) et \\(\\beta\\) (ou \\(k\\)) ; il faut toujours vérifier la troisième." },
predict: { q: "Les vecteurs (2 ; −1 ; 3) et (6 ; −3 ; 8) sont-ils colinéaires ?", choices: ["Oui", "Non"], good: 1,
why: "6 = 3 · 2 et −3 = 3 · (−1), mais 8 ≠ 3 · 3 = 9. Les trois rapports doivent être égaux : ils ne le sont pas." },
defis: ["A(1 ; 0 ; 2) et B(3 ; 1 ; 1) sont fixés. Le point C a pour abscisse 5 : règle ses deux autres coordonnées pour que A, B et C soient alignés.", "\\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 2 \\,;\\, 1)\\). Règle \\(\\alpha\\) et \\(\\beta\\) pour que \\(\\alpha\\vec{u} + \\beta\\vec{v}\\) arrive sur \\(\\vec{w} = (2 \\,;\\, -2 \\,;\\, 1)\\)."],
play: slide({
ctl: (s) => (s ? [{ k: "a", lab: "α", min: -2, max: 2 }, { k: "b", lab: "β", min: -2, max: 2 }] : [{ k: "y", lab: "y de C", min: -1, max: 3 }, { k: "z", lab: "z de C", min: -1, max: 4 }]),
init: (s) => (s ? { a: 1, b: 1 } : { y: 0, z: 3 }),
fig: (st, s) => {
if (!s) { const C = [5, st.y, st.z], S = scene(BC), seg = clip(CA1, [2, 1, -1], BC, -1, 2.5);
if (seg) S.line(seg[0], seg[1], "f-line", 1.2, "6 4");
return S.guides(C).arrow(CA1, CB1, "f-blue").arrow(CA1, C, "f-accent", 2).dot(CA1, "A", "f-dot", "l").dot(CB1, "B", "f-dot", "r").dot(C, "C", "f-fill2", "r").svg("points A, B et C dans l'espace"); }
const S = scene(BW), R = add(mul(st.a, U1), mul(st.b, V1)), k = 2.2;
S.poly([add(mul(-k, U1), mul(-k, V1)), add(mul(k, U1), mul(-k, V1)), add(mul(k, U1), mul(k, V1)), add(mul(-k, U1), mul(k, V1))], "f-soft", 0.45);
S.arrow([0, 0, 0], U1, "f-blue").arrow([0, 0, 0], V1, "f-blue").path([[0, 0, 0], mul(st.a, U1), R], "f-line", 1.4, "5 4");
if (R.some((v) => v)) S.arrow([0, 0, 0], R, "f-accent", 2.2);
return S.dot(W1, "w", "f-fill2", "r").text(add(U1, [0, 0, 0.3]), "u").text(add(V1, [0, 0.2, 0.3]), "v").svg("vecteurs u, v, et la combinaison αu + βv dans le plan qu'ils engendrent"); },
out: (st, s) => {
if (s) { const R = add(mul(st.a, U1), mul(st.b, V1)); return "αu + βv = " + nb(st.a) + " · (1 ; 0 ; 1) " + sg(st.b).trim() + " · (0 ; 2 ; 1) = <b>" + tri(R) + "</b><br>" + '<span class="small">le plan clair contient toutes les combinaisons de u et de v</span>'; }
const AC = [4, st.y, st.z - 2], r = [4 / 2, AC[1] / 1, AC[2] / -1];
return "Vecteur AB = (2 ; 1 ; −1), vecteur AC = " + tri(AC) + "<br>Rapports : 4 ÷ 2 = <b>2</b> ; " + nb(AC[1]) + " ÷ 1 = <b>" + nb(r[1]) + "</b> ; " + nb(AC[2]) + " ÷ (−1) = <b>" + nb(r[2]) + "</b>"; },
goal: [(st) => (st.y === 2 && st.z === 0 ? "C(5 ; 2 ; 0) : vecteur AC = (4 ; 2 ; −2) = 2 · (2 ; 1 ; −1). Les trois rapports valent 2 : AC = 2·AB, les points sont alignés." : ""),
(st) => (st.a === 2 && st.b === -1 ? "2 · (1 ; 0 ; 1) − (0 ; 2 ; 1) = (2 ; −2 ; 1), donc w est une combinaison de u et v, les trois vecteurs sont coplanaires." : "")],
miss: (st, s) => (s ? "Composante x : α · 1 = 2 donne α ; composante y : 2β = −2 donne β. Puis vérifie z." : "Les trois rapports doivent être égaux : le premier vaut 2."),
ask: [null, { q: "Avec les mêmes \\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 2 \\,;\\, 1)\\), le vecteur \\((3 \\,;\\, 4 \\,;\\, z)\\) est coplanaire avec eux. Tape z.", ans: 5, ok: "x : α = 3 ; y : 2β = 4, β = 2 ; donc z = α + β = 5.", no: "Trouve α avec la composante x, β avec la composante y, puis calcule la composante z de αu + βv." }] }),
},

droite3d: {
retiens: { regle: "La droite passant par \\(A\\) et de vecteur directeur \\(\\vec{u}\\) a pour équations paramétriques \\(x = x_A + t\\,u_x\\), \\(y = y_A + t\\,u_y\\), \\(z = z_A + t\\,u_z\\) : chaque valeur de \\(t\\) donne un point. Un point est sur la droite si les trois équations donnent le même \\(t\\). La droite perce le plan \\(xOy\\) là où \\(z = 0\\). Deux droites sont sécantes s'il existe \\(t\\) et \\(s\\) qui donnent le même point.",
exemple: ["\\(x = 1 + 2t\\), \\(y = -t\\), \\(z = 4 - 2t\\) : \\(z = 0\\) pour \\(t = 2\\), point \\((5 \\,;\\, -2 \\,;\\, 0)\\).", "\\(P(7 \\,;\\, -3 \\,;\\, -2)\\) : \\(t = 3\\) dans les trois équations, \\(P\\) est sur la droite.", "Les deux droites se coupent en \\((3 \\,;\\, -1 \\,;\\, 2)\\), pour \\(t = 1\\) et \\(s = 2\\)."],
piege: "Les coefficients de \\(t\\) forment le vecteur directeur ; les termes constants, le point de départ. Une seule équation vérifiée ne suffit pas." },
predict: { q: "Droite : x = 1 + 2t, y = −t, z = 2 + 3t. Pour t = 1, on obtient le point…", choices: ["(3 ; −1 ; 5)", "(2 ; −1 ; 3)", "(1 ; 0 ; 2)"], good: 0,
why: "On remplace t par 1 : x = 1 + 2 = 3, y = −1, z = 2 + 3 = 5. (1 ; 0 ; 2) est le point de départ (t = 0), (2 ; −1 ; 3) le vecteur directeur." },
defis: ["Droite d₁ : x = 1 + 2t, y = −t, z = 4 − 2t. Fais glisser t pour amener le point M dans le plan xOy (z = 0).", "Droite d₂ : x = −1 + 2s, y = −3 + s, z = 2. Règle t et s pour que M (sur d₁) et N (sur d₂) soient au même endroit."],
play: slide({
ctl: (s) => (s ? [{ k: "t", lab: "t (point M sur d₁)", min: -0.5, max: 2.5, step: 0.5 }, { k: "s", lab: "s (point N sur d₂)", min: 0, max: 3, step: 0.5 }] : [{ k: "t", lab: "t", min: -0.5, max: 2.5, step: 0.5 }]),
init: (s) => (s ? { t: 0, s: 0 } : { t: 0 }),
fig: (st, s) => { const S = scene(BD), M = add(DA, mul(st.t, DU)), s1 = clip(DA, DU, BD);
if (!s) S.poly([[-1, -3, 0], [6, -3, 0], [6, 1, 0], [-1, 1, 0]], "f-soft", 0.4);
if (s1) S.line(s1[0], s1[1], "f-blue", 2);
if (s) { const s2 = clip(DB, DV, BD), N = add(DB, mul(st.s, DV)); if (s2) S.line(s2[0], s2[1], "f-line", 2); S.dot(N, "N", "f-fill2", "b"); S.text(add(DB, [0, -0.4, 0.4]), "d₂"); }
else S.guides(M);
return S.dot(DA, "A", "f-dot", "l").dot(M, "M", "f-dot", "r").text(add(DA, mul(-0.8, DU)), "d₁").svg("droite d₁" + (s ? " et droite d₂" : " et plan xOy")); },
out: (st, s) => { const M = add(DA, mul(st.t, DU));
if (!s) return "M = (1 + 2t ; −t ; 4 − 2t) = <b>" + tri(M) + "</b>" + (M[2] === 0 ? " : dans le plan xOy" : " : cote " + nb(M[2]));
const N = add(DB, mul(st.s, DV)), d = Math.hypot(M[0] - N[0], M[1] - N[1], M[2] - N[2]);
return "M = " + tri(M) + " sur d₁<br>N = " + tri(N) + " sur d₂<br>Distance MN ≈ <b>" + nb(+d.toFixed(2)) + "</b>"; },
goal: [(st) => (st.t === 2 ? "z = 4 − 2t = 0 pour t = 2 : M(5 ; −2 ; 0). La droite perce le plan xOy en ce point." : ""),
(st) => (st.t === 1 && st.s === 2 ? "t = 1 et s = 2 donnent le même point (3 ; −1 ; 2) : les droites d₁ et d₂ sont sécantes." : "")],
miss: (st, s) => (s ? (st.t === 1 ? "M est déjà sur d₂ (z = 2) : déplace N jusqu'à lui." : "Sur d₂, z vaut toujours 2 : cherche d'abord t pour que M ait aussi z = 2.") : "On veut z = 4 − 2t = 0."),
ask: [{ q: "La droite x = 3 − t, y = 2t, z = 6 + 3t perce le plan xOy en un point. Tape son abscisse x.", ans: 5, ok: "z = 6 + 3t = 0 pour t = −2, d'où x = 3 − (−2) = 5 : le point (5 ; −4 ; 0).", no: "Cherche d'abord t avec z = 0, puis calcule x." },
{ q: "Le point P(7 ; −3 ; −2) est-il sur d₁ ? Tape la valeur de t que donne l'équation en x, puis vérifie les deux autres.", ans: 3, ok: "1 + 2t = 7 donne t = 3 ; y = −3 ✓ ; z = 4 − 6 = −2 ✓. Les trois équations donnent le même t : P est sur d₁.", no: "x = 1 + 2t = 7 : résous en t." }] }),
},

plans: {
retiens: { regle: "Un plan a une équation cartésienne \\(ax + by + cz = d\\) (ou \\(ax + by + cz + d = 0\\)) ; le vecteur \\(\\vec{n} = (a \\,;\\, b \\,;\\, c)\\) est orthogonal au plan (vecteur normal). Les plans parallèles ont les mêmes \\(a\\), \\(b\\), \\(c\\) : seul \\(d\\) change. Un point est dans le plan si ses coordonnées vérifient l'équation. Traces sur les axes : on annule deux coordonnées.",
exemple: ["\\(x + 2y + 2z = d\\) passe par \\(P(2 \\,;\\, 1 \\,;\\, 1)\\) si \\(d = 2 + 2 + 2 = 6\\).", "Plan par \\((4 \\,;\\, 0 \\,;\\, 0)\\), \\((0 \\,;\\, 2 \\,;\\, 0)\\), \\((0 \\,;\\, 0 \\,;\\, 4)\\) : \\(x + 2y + z = 4\\).", "\\(2x - y + 3z - 6 = 0\\) coupe l'axe \\(Oz\\) en \\((0 \\,;\\, 0 \\,;\\, 2)\\)."],
piege: "Pour un plan parallèle, on garde \\(a\\), \\(b\\), \\(c\\) et on recalcule \\(d\\) avec le nouveau point." },
predict: { q: "Le plan 2x − y + 3z − 6 = 0 coupe l'axe Oz en…", choices: ["(0 ; 0 ; 2)", "(0 ; 0 ; 6)", "(0 ; 0 ; 3)"], good: 0,
why: "Sur l'axe Oz, x = 0 et y = 0 : il reste 3z − 6 = 0, donc z = 2." },
defis: ["Le plan π : x + 2y + 2z = d glisse parallèlement à lui-même quand d change. Règle d pour qu'il passe par P(2 ; 1 ; 1).", "Règle a, b et c pour que le plan ax + by + cz = 4 passe par les trois points (4 ; 0 ; 0), (0 ; 2 ; 0) et (0 ; 0 ; 4)."],
play: slide({
ctl: (s) => (s ? [{ k: "a", lab: "a", min: 1, max: 4 }, { k: "b", lab: "b", min: 1, max: 4 }, { k: "c", lab: "c", min: 1, max: 4 }] : [{ k: "d", lab: "d", min: 1, max: 8 }]),
init: (s) => (s ? { a: 2, b: 1, c: 2 } : { d: 2 }),
fig: (st, s) => {
if (!s) { const S = scene(BP), P = [2, 1, 1], Q = traces(S, 1, 2, 2, st.d), G = mul(1 / 3, add(add(Q[0], Q[1]), Q[2]));
S.arrow(G, add(G, mul(0.6, [1, 2, 2])), "f-accent", 2).text(add(G, [0.6, 1.5, 1.5]), "n");
return S.guides(P).dot(P, "P", st.d === 6 ? "f-dot" : "f-fill2", "r").svg("plan x + 2y + 2z = d et point P"); }
const S = scene(BP2); traces(S, st.a, st.b, st.c, 4);
return S.dot([4, 0, 0], "", "f-fill2", "l", 5).dot([0, 2, 0], "", "f-fill2", "b", 5).dot([0, 0, 4], "", "f-fill2", "l", 5).svg("plan ax + by + cz = 4 et trois points visés"); },
out: (st, s) => {
if (!s) { const v = 6 - st.d; return "Traces : (" + nb(st.d) + " ; 0 ; 0), (0 ; " + nb(st.d / 2) + " ; 0), (0 ; 0 ; " + nb(st.d / 2) + ")<br>Vecteur normal n = (1 ; 2 ; 2), le même pour toute valeur de d<br>P est <b>" + (v === 0 ? "dans le plan" : v > 0 ? "au-delà du plan (du côté où pointe n)" : "en deçà du plan") + "</b>"; }
return "Traces sur les axes : (" + nb(+(4 / st.a).toFixed(2)) + " ; 0 ; 0), (0 ; " + nb(+(4 / st.b).toFixed(2)) + " ; 0), (0 ; 0 ; " + nb(+(4 / st.c).toFixed(2)) + ")<br>" + '<span class="small">sur l\'axe Ox, y = z = 0 : ax = 4, donc x = 4 ÷ a</span>'; },
goal: [(st) => (st.d === 6 ? "En P : 2 + 2 · 1 + 2 · 1 = 6, donc d = 6. Le plan glisse sans tourner : n = (1 ; 2 ; 2) ne change pas." : ""),
(st) => (st.a === 1 && st.b === 2 && st.c === 1 ? "x + 2y + z = 4 : (4 ; 0 ; 0) donne 4 = 4, (0 ; 2 ; 0) donne 4, (0 ; 0 ; 4) donne 4. Vecteur normal (1 ; 2 ; 1)." : "")],
miss: (st, s) => (s ? "Chaque trace se règle seule : sur Ox, a · 4 = 4 ; sur Oy, b · 2 = 4 ; sur Oz, c · 4 = 4." : "Remplace x, y, z par les coordonnées de P dans x + 2y + 2z."),
ask: [{ q: "Plan parallèle à 2x − y + 3z − 6 = 0 passant par A(1 ; 1 ; 1) : il s'écrit 2x − y + 3z + d = 0. Tape d.", ans: -4, ok: "2 − 1 + 3 + d = 0, donc d = −4 : 2x − y + 3z − 4 = 0. Mêmes a, b, c ; seul d change.", no: "Remplace x, y, z par 1 dans 2x − y + 3z + d = 0." },
{ q: "Le plan 3x + 2y + 6z = 12 coupe l'axe Oy en (0 ; y ; 0). Tape y.", ans: 6, ok: "x = z = 0 : 2y = 12, y = 6.", no: "Sur l'axe Oy, x = 0 et z = 0." }] }),
},

posrel: {
retiens: { regle: "Droite \\(A + t\\vec{u}\\) et plan de vecteur normal \\(\\vec{n}\\) : on remplace \\(x\\), \\(y\\), \\(z\\) de la droite dans l'équation du plan et on résout en \\(t\\). Si \\(\\vec{n} \\cdot \\vec{u} \\neq 0\\), la droite perce le plan en un seul point. Si \\(\\vec{n} \\cdot \\vec{u} = 0\\), elle est parallèle au plan : contenue dedans si \\(A\\) est dans le plan, sinon aucun point commun. Deux plans non parallèles se coupent selon une droite.",
exemple: ["\\(A(1 \\,;\\, 0 \\,;\\, 0) + t(1 \\,;\\, -2 \\,;\\, 1)\\) et \\(x + y + z = 4\\) : \\(\\vec{n} \\cdot \\vec{u} = 0\\), aucun point commun.", "\\(x = 1 + t\\), \\(y = 2t\\), \\(z = 3 - t\\) et \\(x + y + z - 7 = 0\\) : \\(4 + 2t = 7\\), \\(t = \\frac{3}{2}\\)."],
piege: "Droite parallèle au plan : \\(\\vec{u}\\) est orthogonal à \\(\\vec{n}\\) (\\(\\vec{n} \\cdot \\vec{u} = 0\\)), pas colinéaire à \\(\\vec{n}\\)." },
predict: { q: "Deux plans distincts de l'espace, non parallèles, se coupent…", choices: ["selon une droite", "en un seul point", "jamais"], good: 0,
why: "Deux plans qui se coupent ont toute une droite en commun (pense au sol et à un mur). Il faut trois plans pour se couper, en général, en un seul point." },
defis: ["Plan π : x + y + z = 4. La droite d part de A(1 ; 0 ; 0) avec la direction \\(\\vec{u} = (1 \\,;\\, m \\,;\\, 1)\\). Règle m pour que d ne perce pas π.", "Règle m pour que d perce π au point d'abscisse x = 2."],
play: slide({
ctl: () => [{ k: "m", lab: "m", min: -4, max: 3 }],
init: (s) => ({ m: s ? -2 : 0 }),
fig: (st) => { const S = scene(BR), u = [1, st.m, 1], A = [1, 0, 0]; traces(S, 1, 1, 1, 4);
const seg = clip(A, u, BR, -1, 6); if (seg) S.line(seg[0], seg[1], "f-blue", 2.2);
S.arrow(A, add(A, u), "f-accent", 2).dot(A, "A", "f-dot", "l");
if (st.m !== -2) { const t = 3 / (2 + st.m), I = add(A, mul(t, u)); if (inBox(I, BR)) S.dot(I, "I", "f-fill2", "r", 5.5); }
return S.svg("plan x + y + z = 4 et droite d"); },
out: (st) => { const nu = 2 + st.m;
return "n = (1 ; 1 ; 1), u = (1 ; " + nb(st.m) + " ; 1) : n · u = 1 + " + par(st.m) + " + 1 = <b>" + nb(nu) + "</b><br>" + (nu === 0 ? "On remplace : (1 + t) + " + nb(st.m) + "t + t = 4 donne 1 = 4, impossible : <b>aucun point commun</b>." : "On remplace : (1 + t) + " + par(st.m) + "t + t = 4 donne " + nb(nu) + "t = 3, t = " + nb(+(3 / nu).toFixed(3)) + " : point I" + tri(add([1, 0, 0], mul(3 / nu, [1, st.m, 1])).map((v) => +v.toFixed(2)))); },
goal: [(st) => (st.m === -2 ? "m = −2, donc n · u = 0 ; u est orthogonal à n, donc d est parallèle à π. Et A n'est pas dans π (1 + 0 + 0 ≠ 4) : aucun point commun." : ""),
(st) => (st.m === 1 ? "m = 1 : 3t = 3, t = 1, donc I(2 ; 1 ; 1) ; on vérifie 2 + 1 + 1 = 4." : "")],
miss: (st, s) => (s ? "x = 1 + t = 2 demande t = 1 : il faut alors (2 + m) · 1 = 3." : "La droite perce le plan tant que n · u ≠ 0."),
ask: [{ q: "Même plan x + y + z = 4 et droite x = 2 + t, y = −1 + 2t, z = 3 − 3t. Tape \\(\\vec{n} \\cdot \\vec{u}\\).", ans: 0, ok: "n · u = 1 + 2 − 3 = 0 : parallèle. Et A(2 ; −1 ; 3) vérifie 2 − 1 + 3 = 4 : cette droite est contenue dans π.", no: "u = (1 ; 2 ; −3) et n = (1 ; 1 ; 1) : additionne les produits des composantes." },
{ q: "La droite x = 1 + t, y = 2t, z = 3 − t perce le plan x + y + z − 7 = 0. Pour quelle valeur de t ?", ans: 1.5, ok: "(1 + t) + 2t + (3 − t) − 7 = 0 donne 2t − 3 = 0, t = 3/2 : le point (5/2 ; 3 ; 3/2).", no: "Remplace x, y, z par leurs expressions en t dans l'équation du plan." }] }),
},

pscal3d: {
retiens: { regle: "\\(\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = \\|\\vec{u}\\| \\, \\|\\vec{v}\\| \\cos\\alpha\\). Donc \\(\\cos\\alpha = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\, \\|\\vec{v}\\|}\\), et \\(\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0\\).",
exemple: ["\\((1 \\,;\\, 2 \\,;\\, 2) \\cdot (2 \\,;\\, 1 \\,;\\, -2) = 2 + 2 - 4 = 0\\) : orthogonaux.", "\\((1 \\,;\\, 0 \\,;\\, 1)\\) et \\((0 \\,;\\, 1 \\,;\\, 1)\\) : \\(\\cos\\alpha = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}\\), \\(\\alpha = 60°\\).", "\\((2 \\,;\\, 1 \\,;\\, -2)\\) et \\((1 \\,;\\, 1 \\,;\\, 0)\\) : \\(\\cos\\alpha = \\frac{3}{3\\sqrt{2}}\\), \\(\\alpha = 45°\\)."],
piege: "Le produit scalaire est un nombre, pas un vecteur. Négatif : l'angle est obtus." },
predict: { q: "Que vaut le produit scalaire (1 ; 2 ; 2) · (2 ; 0 ; −1) ?", choices: ["0", "(2 ; 0 ; −2)", "3"], good: 0,
why: "On multiplie composante par composante et on additionne : 1 · 2 + 2 · 0 + 2 · (−1) = 0. Un produit scalaire nul : les vecteurs sont orthogonaux." },
defis: ["\\(\\vec{u} = (1 \\,;\\, 2 \\,;\\, 2)\\) et \\(\\vec{v} = (2 \\,;\\, 1 \\,;\\, z)\\). Règle z pour que \\(\\vec{u}\\) et \\(\\vec{v}\\) soient orthogonaux.", "\\(\\vec{u} = (1 \\,;\\, 0 \\,;\\, 1)\\) et \\(\\vec{v} = (0 \\,;\\, 1 \\,;\\, k)\\). Règle k pour que l'angle entre \\(\\vec{u}\\) et \\(\\vec{v}\\) vaille 60°."],
play: slide({
ctl: (s) => [s ? { k: "k", lab: "k", min: -3, max: 3 } : { k: "z", lab: "z", min: -3, max: 3 }],
init: (s) => (s ? { k: 3 } : { z: 2 }),
fig: (st, s) => { const u = s ? [1, 0, 1] : [1, 2, 2], v = s ? [0, 1, st.k] : [2, 1, st.z], S = scene(s ? BS2 : BS1, { s: 34, ticks: false });
arc(S, u, v, s ? 0.55 : 0.9);
return S.arrow([0, 0, 0], u, "f-blue").arrow([0, 0, 0], v, "f-accent").text(add(u, [0, 0.15, 0.25]), "u").text(add(v, [0, 0.2, 0.25]), "v").svg("vecteurs u et v issus de O et leur angle"); },
out: (st, s) => { const u = s ? [1, 0, 1] : [1, 2, 2], v = s ? [0, 1, st.k] : [2, 1, st.z], p = dot(u, v), a = ang(u, v);
return "u · v = " + u.map((x, i) => nb(x) + " · " + par(v[i])).join(" + ") + " = <b>" + nb(p) + "</b><br>‖u‖ = " + rt(dot(u, u)) + ", ‖v‖ = " + rt(dot(v, v)) + "<br>cos α = " + nb(+(p / Math.sqrt(dot(u, u) * dot(v, v))).toFixed(3)) + ", α ≈ <b>" + nb(+a.toFixed(1)) + "°</b>" + (p < 0 ? " (obtus : produit scalaire négatif)" : p === 0 ? " (droit)" : ""); },
goal: [(st) => (st.z === -2 ? "2 + 2 + 2z = 0 pour z = −2, donc u · v = 0 et l'angle est droit." : ""),
(st) => (st.k === 1 ? "k = 1, donc u · v = 1, ‖u‖ = ‖v‖ = √2, cos α = 1 ÷ 2, donc α = 60°." : "")],
miss: (st, s) => (s ? (st.k === -1 ? "120° : cos α = −1/2, le produit scalaire est négatif. Cherche cos α = +1/2." : "On veut cos α = 1/2.") : "Orthogonaux : u · v = 0."),
ask: [{ q: "\\(\\vec{a} = (3 \\,;\\, -1 \\,;\\, 2)\\) et \\(\\vec{b} = (1 \\,;\\, k \\,;\\, -2)\\) sont orthogonaux. Tape k.", ans: -1, ok: "3 − k − 4 = 0, donc k = −1.", no: "Écris a · b = 0 et résous en k." },
{ q: "Angle (en degrés) entre \\((2 \\,;\\, 1 \\,;\\, -2)\\) et \\((1 \\,;\\, 1 \\,;\\, 0)\\) ?", ans: 45, tol: 0.5, ok: "Produit scalaire 3, normes 3 et √2 : cos α = 3 ÷ (3√2) = 1/√2, α = 45°.", no: "cos α = (u · v) ÷ (‖u‖ ‖v‖), puis la touche arccos." }] }),
},

distances: {
retiens: { regle: "La plus courte distance d'un point à un plan ou à une droite se mesure perpendiculairement. Distance de \\(P\\) au plan \\(ax + by + cz + d = 0\\) : \\(\\frac{|ax_P + by_P + cz_P + d|}{\\sqrt{a^2 + b^2 + c^2}}\\). Distance de \\(P\\) à la droite \\(A + t\\vec{u}\\) : le pied \\(H\\) correspond à \\(t = \\frac{\\overrightarrow{AP} \\cdot \\vec{u}}{\\|\\vec{u}\\|^2}\\), puis on calcule \\(PH\\).",
exemple: ["\\(P(3 \\,;\\, 1 \\,;\\, 2)\\) et \\(2x + y + 2z - 2 = 0\\) : \\(\\frac{|6 + 1 + 4 - 2|}{3} = 3\\).", "\\(Q(1 \\,;\\, 1 \\,;\\, 1)\\), même plan : \\(\\frac{|2 + 1 + 2 - 2|}{3} = 1\\).", "\\(A(1 \\,;\\, 0 \\,;\\, 0) + t(1 \\,;\\, 1 \\,;\\, 0)\\), \\(P(5 \\,;\\, 0 \\,;\\, 1)\\) : \\(t = \\frac{4}{2} = 2\\), \\(H(3 \\,;\\, 2 \\,;\\, 0)\\), \\(PH = 3\\)."],
piege: "N'oublie ni la valeur absolue ni la racine de \\(a^2 + b^2 + c^2\\)." },
predict: { q: "Distance de P(1 ; 1 ; 1) au plan 2x + y + 2z − 2 = 0 : on calcule |2 + 1 + 2 − 2| = 3, puis on divise par…", choices: ["3 = √(2² + 1² + 2²)", "9 = 2² + 1² + 2²", "5 = 2 + 1 + 2"], good: 0,
why: "On divise par la norme du vecteur normal (2 ; 1 ; 2), √(4 + 1 + 4) = 3 : la distance vaut 3 ÷ 3 = 1." },
defis: ["Le point H se promène dans le plan π : 2x + y + 2z − 2 = 0. Règle-le pour que la distance PH, avec P(3 ; 1 ; 2), soit la plus courte possible.", "H se promène maintenant sur la droite d : (1 ; 0 ; 0) + t·(1 ; 1 ; 0). Règle t pour que la distance PH, avec P(5 ; 0 ; 1), soit la plus courte possible."],
play: slide({
ctl: (s) => (s ? [{ k: "t", lab: "t", min: -1, max: 4, step: 0.5 }] : [{ k: "s", lab: "H : direction 1", min: -1.5, max: 1.5, step: 0.5 }, { k: "t", lab: "H : direction 2", min: -1.5, max: 1.5, step: 0.5 }]),
init: (s) => (s ? { t: 0 } : { s: 1, t: -1 }),
fig: (st, s) => {
if (!s) { const S = scene(BDP, { ticks: false }), H = add(H0, add(mul(st.s, E1), mul(st.t, E2))), k = 1.6, ok = st.s === 0 && st.t === 0;
S.poly([[-k, -k], [k, -k], [k, k], [-k, k]].map(([a, b]) => add(H0, add(mul(a, E1), mul(b, E2)))), "f-fill2", 0.4);
return S.line(PD, H, ok ? "f-accent" : "f-line", 2.2).dot(PD, "P", "f-dot", "r").dot(H, "H", "f-fill2", "b").svg("plan π, point P et point H du plan"); }
const S = scene(BDL, { ticks: false }), H = add(LA, mul(st.t, LU)), seg = clip(LA, LU, BDL);
if (seg) S.line(seg[0], seg[1], "f-blue", 2);
return S.line(LP, H, st.t === 2 ? "f-accent" : "f-line", 2.2).dot(LA, "A", "f-dot", "l").dot(LP, "P", "f-dot", "r").dot(H, "H", "f-fill2", "b").svg("droite d, point P et point H de la droite"); },
out: (st, s) => {
const H = s ? add(LA, mul(st.t, LU)) : add(H0, add(mul(st.s, E1), mul(st.t, E2))), P = s ? LP : PD, v = P.map((x, i) => x - H[i]);
return "H" + tri(H) + " ; vecteur HP = " + tri(v) + "<br>PH = √" + nb(dot(v, v)) + "<b>" + rq(dot(v, v)) + "</b>"; },
goal: [(st) => (st.s === 0 && st.t === 0 ? "PH = 3, le plus court. Alors HP = (2 ; 1 ; 2) : c'est le vecteur normal du plan, PH est perpendiculaire à π. Formule : |6 + 1 + 4 − 2| ÷ √(4 + 1 + 4) = 9 ÷ 3 = 3." : ""),
(st) => (st.t === 2 ? "t = 2 : H(3 ; 2 ; 0), HP = (2 ; −2 ; 1) et HP · u = 2 − 2 + 0 = 0, perpendiculaire à d. PH = 3. Calcul direct : t = (AP · u) ÷ ‖u‖² = 4 ÷ 2 = 2." : "")],
miss: (st, s) => (s ? "Le plus court : HP perpendiculaire à la direction (1 ; 1 ; 0) de d." : "Cherche la position où PH est le plus petit possible."),
ask: [{ q: "Avec la formule : distance de Q(1 ; 1 ; 1) au même plan 2x + y + 2z − 2 = 0 ?", ans: 1, ok: "|2 + 1 + 2 − 2| ÷ √(4 + 1 + 4) = 3 ÷ 3 = 1.", no: "|ax + by + cz + d| ÷ √(a² + b² + c²), avec les coordonnées de Q." },
{ q: "Droite (0 ; 0 ; 0) + t·(1 ; 2 ; 2) et point P(5 ; 5 ; 6) : tape la valeur de t du pied H.", ans: 3, ok: "AP · u = 5 + 10 + 12 = 27 et ‖u‖² = 9, donc t = 3, H(3 ; 6 ; 6), PH = √5.", no: "t = (AP · u) ÷ ‖u‖²." }] }),
},

sphere: {
retiens: { regle: "La sphère de centre \\(C(a \\,;\\, b \\,;\\, c)\\) et de rayon \\(r\\) a pour équation \\((x - a)^2 + (y - b)^2 + (z - c)^2 = r^2\\). Un plan à distance \\(\\delta < r\\) du centre la coupe selon un cercle de rayon \\(\\sqrt{r^2 - \\delta^2}\\) ; si \\(\\delta = r\\), il est tangent (un seul point commun). Le plan tangent en \\(T\\) a pour vecteur normal \\(\\overrightarrow{CT}\\).",
exemple: ["\\((x - 1)^2 + y^2 + (z + 2)^2 = 9\\) : centre \\((1 \\,;\\, 0 \\,;\\, -2)\\), rayon 3.", "Rayon 5, plan à distance 3 du centre : cercle de rayon \\(\\sqrt{25 - 9} = 4\\).", "\\(C(1 \\,;\\, 2 \\,;\\, 0)\\), \\(T(3 \\,;\\, 3 \\,;\\, 2)\\) : plan tangent \\(2x + y + 2z - 13 = 0\\)."],
piege: "Dans \\((z + 2)^2\\), la coordonnée du centre est \\(-2\\)." },
predict: { q: "La sphère (x − 1)² + y² + (z + 2)² = 9 a pour centre…", choices: ["(1 ; 0 ; −2)", "(−1 ; 0 ; 2)", "(1 ; 0 ; 2)"], good: 0,
why: "(z + 2)² = (z − (−2))² : la cote du centre est −2. Centre (1 ; 0 ; −2), rayon √9 = 3." },
defis: ["Sphère de centre O(0 ; 0 ; 0) et de rayon 5. Règle la hauteur h du plan z = h pour que la section soit un cercle de rayon 4.", "Règle h pour que le plan z = h soit tangent à la sphère."],
play: slide({
ctl: () => [{ k: "h", lab: "Hauteur h du plan", min: -6, max: 6 }],
init: () => ({ h: 0 }),
fig: (st) => { const S = scene(BSP, { ticks: false }), r = 5, h = st.h, k = 5.5, c = S.p([0, 0, 0]);
S.raw(`<circle cx="${c[0]}" cy="${c[1]}" r="${(r * S.s).toFixed(1)}" class="f-blue" fill="none" stroke-width="2"/>`);
const ring = (z, rho) => { const P = []; for (let i = 0; i <= 48; i++) { const a = (i * Math.PI) / 24; P.push([rho * Math.cos(a), rho * Math.sin(a), z]); } return P; };
S.path(ring(0, r), "f-line", 1, "4 4");
S.poly([[-k, -k, h], [k, -k, h], [k, k, h], [-k, k, h]], "f-fill2", 0.35);
if (Math.abs(h) < r) S.path(ring(h, Math.sqrt(r * r - h * h)), "f-accent", 2.4);
if (Math.abs(h) === r) S.dot([0, 0, h], "", "f-dot", "r", 5);
return S.dot([0, 0, 0], "O", "f-dot", "l", 3).line([0, 0, 0], [0, 0, h], "f-line", 1.2, "3 3").svg("sphère de rayon 5 et plan horizontal z = h"); },
out: (st) => { const h = Math.abs(st.h);
return "Distance du centre au plan : δ = |h| = " + nb(h) + "<br>" + (h < 5 ? "Section : cercle de rayon √(5² − " + nb(h) + "²) = √" + nb(25 - h * h) + "<b>" + rq(25 - h * h) + "</b>" : h === 5 ? "<b>Un seul point commun</b> : le plan est tangent." : "δ > 5 : <b>aucun point commun</b>."); },
goal: [(st) => (Math.abs(st.h) === 3 ? "δ = 3 : √(25 − 9) = √16 = 4. Pythagore : rayon de la sphère² = δ² + rayon du cercle²." : ""),
(st) => (Math.abs(st.h) === 5 ? "δ = r = 5 : le plan touche la sphère en un seul point (0 ; 0 ; " + nb(st.h) + "). Il est perpendiculaire au rayon qui y aboutit." : "")],
miss: (st, s) => (s ? "Tangent : la distance au centre égale le rayon." : "On veut √(25 − h²) = 4."),
ask: [{ q: "Sphère de rayon 13, plan à distance 5 du centre : rayon du cercle de section ?", ans: 12, ok: "√(13² − 5²) = √(169 − 25) = √144 = 12.", no: "√(r² − δ²)." },
{ q: "Sphère de centre C(1 ; 2 ; 0) passant par T(3 ; 3 ; 2). Le plan tangent en T a pour vecteur normal \\(\\overrightarrow{CT} = (2 \\,;\\, 1 \\,;\\, 2)\\) : il s'écrit 2x + y + 2z + d = 0. Tape d.", ans: -13, ok: "T est dans le plan : 6 + 3 + 4 + d = 0, donc d = −13.", no: "Remplace x, y, z par les coordonnées de T." }] }),
},
});





const shade = (f, a, b) => { const up = [[a, 0]], dn = [[a, 0]]; for (let i = 0; i <= 80; i++) { const x = a + ((b - a) * i) / 80, y = f(x); up.push([x, Math.max(0, y)]); dn.push([x, Math.min(0, y)]); } up.push([b, 0]); dn.push([b, 0]); return [[up, "f-fill2"], [dn, "f-soft"]]; };

const areaFig = (D, v) => {
const o = { xr: D.xr, yr: D.yr, gx: D.gx, lx: D.lx, gy: D.gy, ly: D.ly, H: D.H || 200, fx: D.fx, fns: [{ f: D.f, from: D.dom }], polys: shade(D.f, D.a, D.b), vl: [[D.a, "f-line"], [D.b, "f-line"]], lab: D.lab };
let t = '<span class="small">' + D.txt + "</span>";
if (v !== null) { const hgt = v / (D.b - D.a), ok = Math.abs(v - D.v) <= (D.tol || 1e-9); o.segs = [[D.a, hgt, D.b, hgt, ok ? "f-accent" : "f-line", 2.2, "6 4"], [D.a, 0, D.a, hgt, ok ? "f-accent" : "f-line", 1.4, "3 3"], [D.b, 0, D.b, hgt, ok ? "f-accent" : "f-line", 1.4, "3 3"]];
t = "Rectangle de même aire que ta réponse (" + nb(v) + ") : " + (ok ? '<b class="act-ok">il compense exactement la surface colorée</b>' : v > D.v ? "trop haut" : "trop bas"); }
return graph(o) + plain(t);
};
const IP = [
{ f: (x) => x * Math.exp(x), a: 0, b: 1, v: 1, xr: [-0.2, 1.3], yr: [-0.4, 3], gx: 0.25, lx: 0.5, gy: 0.5, ly: 1, txt: "f(x) = x·eˣ entre 0 et 1 : la surface colorée vaut l'intégrale", lab: "aire sous x·eˣ entre 0 et 1" },
{ f: (x) => x * Math.cos(x), a: 0, b: Math.PI, v: -2, xr: [-0.3, 3.5], yr: [-3.4, 1], gx: 0.5, lx: 1, gy: 0.5, ly: 1, txt: "f(x) = x·cos x entre 0 et π : la partie sous l'axe compte négativement", lab: "aire signée sous x·cos x entre 0 et π" },
{ f: (x) => Math.log(x), a: 1, b: Math.E, v: 1, dom: 0.05, xr: [0, 3.2], yr: [-0.6, 1.4], gx: 0.5, lx: 1, gy: 0.25, ly: 0.5, txt: "f(x) = ln x entre 1 et e", lab: "aire sous ln x entre 1 et e" },
];

const IS = [
{ x: { f: (x) => 2 * x * (x * x + 1) ** 2, a: 0, b: 1, v: 7 / 3, xr: [-0.2, 1.3], yr: [-1, 17], gx: 0.25, lx: 0.5, gy: 2, ly: 4, H: 150, txt: "en x : 2x(x² + 1)² de 0 à 1", lab: "aire sous 2x(x² + 1)² entre 0 et 1" },
u: { f: (u) => u * u, a: 1, b: 2, v: 7 / 3, xr: [-0.2, 2.6], yr: [-0.5, 5], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 130, txt: "en u : u² de 1 à 2 (même aire)", lab: "aire sous u² entre 1 et 2" } },
{ x: { f: (x) => Math.sin(x) ** 2 * Math.cos(x), a: 0, b: Math.PI / 2, v: 1 / 3, xr: [-0.2, 1.8], yr: [-0.1, 0.5], gx: 0.25, lx: 0.5, gy: 0.1, ly: 0.2, H: 150, txt: "en x : sin²x · cos x de 0 à π/2", lab: "aire sous sin²x cos x entre 0 et π/2" },
u: { f: (u) => u * u, a: 0, b: 1, v: 1 / 3, xr: [-0.2, 1.4], yr: [-0.1, 1.2], gx: 0.25, lx: 0.5, gy: 0.25, ly: 0.5, H: 130, txt: "en u : u² de 0 à 1 (même aire)", lab: "aire sous u² entre 0 et 1" } },
{ x: { f: (x) => x * (x * x + 1) ** 3, a: 0, b: 1, v: 15 / 8, xr: [-0.2, 1.3], yr: [-1, 9], gx: 0.25, lx: 0.5, gy: 1, ly: 2, H: 150, txt: "en x : x(x² + 1)³ de 0 à 1", lab: "aire sous x(x² + 1)³ entre 0 et 1" },
u: { f: (u) => (u ** 3) / 2, a: 1, b: 2, v: 15 / 8, xr: [-0.2, 2.6], yr: [-0.5, 4.5], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 130, txt: "en u : u³ ÷ 2 de 1 à 2 (même aire)", lab: "aire sous u³ sur 2 entre 1 et 2" } },
];
const isFig = (s, v) => areaFig(IS[s].x, v) + areaFig(IS[s].u, v === null ? null : v);

const bars = (B, w, cls = "f-fill2") => B.map(([c, n]) => [[[c - w / 2, 0], [c + w / 2, 0], [c + w / 2, n], [c - w / 2, n]], cls, 0.75]);

Object.assign(ACTIVE, {
intparties: {
retiens: { regle: "\\(\\int_a^b u(x)v'(x)\\,dx = \\left[u(x)v(x)\\right]_a^b - \\int_a^b u'(x)v(x)\\,dx\\). On choisit pour \\(u\\) le facteur qui devient plus simple en dérivant (\\(x\\), \\(\\ln x\\)) et pour \\(v'\\) celui dont on connaît une primitive (\\(e^x\\), \\(\\cos x\\), \\(1\\)).",
exemple: ["\\(\\int_0^1 x e^x\\,dx = \\left[xe^x\\right]_0^1 - \\int_0^1 e^x\\,dx = e - (e - 1) = 1\\)", "\\(\\int_0^{\\pi} x\\cos x\\,dx = \\left[x\\sin x\\right]_0^{\\pi} - \\int_0^{\\pi} \\sin x\\,dx = 0 - 2 = -2\\)", "\\(\\int_1^e \\ln x\\,dx = \\left[x\\ln x\\right]_1^e - \\int_1^e 1\\,dx = e - (e - 1) = 1\\) (\\(u = \\ln x\\), \\(v' = 1\\))"],
piege: "C'est « \\([uv]\\) MOINS \\(\\int u'v\\) » ; on ne primitive jamais les deux facteurs séparément." },
predict: { q: "Pour ∫ x·eˣ dx, on pose u = x et v' = eˣ (donc u' = 1 et v = eˣ). Pourquoi pas l'inverse ?", choices: ["Avec u = x, il reste ∫ 1·eˣ dx, facile", "C'est pareil", "On ne sait pas primitiver x"], good: 0,
why: "Avec u = x, la dérivée u' = 1 fait disparaître le x : il reste ∫ eˣ dx. À l'inverse (u = eˣ, v' = x), il resterait ∫ eˣ · x²/2 dx, plus compliqué." },
defis: ["Calcule \\(\\int_0^1 x e^x\\,dx\\) par parties.", "Calcule \\(\\int_0^{\\pi} x\\cos x\\,dx\\).", "Calcule \\(\\int_1^e \\ln x\\,dx\\) (pose \\(u = \\ln x\\), \\(v' = 1\\))."],
play: hunt({ ask: true, label: "Valeur de l'intégrale", blank: (s) => areaFig(IP[s], null), show: (x, s) => areaFig(IP[s], x),
miss: (x, s) => ["u = x, v' = eˣ : [x·eˣ] de 0 à 1 vaut e ; retranche ∫ eˣ dx de 0 à 1 = e − 1.", "u = x, v' = cos x : [x·sin x] de 0 à π vaut 0 ; retranche ∫ sin x dx de 0 à π = 2.", "u = ln x, v = x : [x·ln x] de 1 à e vaut e ; retranche ∫ 1 dx de 1 à e = e − 1."][s],
wins: [W(1, "[x·eˣ] de 0 à 1 = e − 0 = e ; ∫ eˣ dx = e − 1 ; résultat e − (e − 1) = 1."), W(-2, "[x·sin x] de 0 à π = 0 ; ∫ sin x dx = [−cos x] = 2 ; résultat 0 − 2 = −2 : la partie sous l'axe l'emporte."), W(1, "[x·ln x] de 1 à e = e ; ∫ 1 dx = e − 1 ; résultat 1. Une primitive de ln x : x·ln x − x.")] }),
},

intsubst: {
retiens: { regle: "Si l'intégrande contient \\(g(x)\\) et (à un facteur près) \\(g'(x)\\), on pose \\(u = g(x)\\), \\(du = g'(x)\\,dx\\) : \\(\\int_a^b f(g(x))g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du\\). Les bornes changent avec la variable.",
exemple: ["\\(\\int_0^1 2x(x^2 + 1)^2\\,dx = \\int_1^2 u^2\\,du = \\frac{7}{3}\\)", "\\(\\int_0^{\\frac{\\pi}{2}} \\sin^2 x\\cos x\\,dx = \\int_0^1 u^2\\,du = \\frac{1}{3}\\)", "\\(\\int_0^1 x(x^2 + 1)^3\\,dx = \\frac{1}{2}\\int_1^2 u^3\\,du = \\frac{15}{8}\\) (\\(x\\,dx = \\frac{du}{2}\\))"],
piege: "On change les bornes, et on n'oublie pas le facteur de \\(dx\\) (\\(x\\,dx = \\frac{du}{2}\\))." },
predict: { q: "Dans ∫ de 0 à 2 de 2x(x² + 1)² dx, on pose u = x² + 1. Quand x va de 0 à 2, u va de…", choices: ["1 à 5", "0 à 2", "0 à 4"], good: 0,
why: "On calcule u aux bornes : u(0) = 0² + 1 = 1 et u(2) = 2² + 1 = 5. Les bornes changent avec la variable." },
defis: ["Calcule \\(\\int_0^1 2x(x^2 + 1)^2\\,dx\\) avec \\(u = x^2 + 1\\) (fraction acceptée).", "Calcule \\(\\int_0^{\\frac{\\pi}{2}} \\sin^2 x\\cos x\\,dx\\) avec \\(u = \\sin x\\).", "Calcule \\(\\int_0^1 x(x^2 + 1)^3\\,dx\\) avec \\(u = x^2 + 1\\)."],
play: hunt({ ask: true, label: "Valeur de l'intégrale", blank: (s) => isFig(s, null), show: (x, s) => isFig(s, x),
miss: (x, s) => ["du = 2x dx ; u va de 1 à 2 : ∫ u² du = [u³/3] de 1 à 2.", "du = cos x dx ; u = sin x va de 0 à 1 : ∫ u² du.", "du = 2x dx, donc x dx = du/2 ; u va de 1 à 2 : ½ ∫ u³ du."][s],
wins: [W(7 / 3, "du = 2x dx, u de 1 à 2 : ∫ u² du = (8 − 1) ÷ 3 = 7/3. Les deux surfaces ont la même aire."), W(1 / 3, "du = cos x dx, u = sin x de 0 à 1 : ∫ u² du = 1/3."), W(15 / 8, "x dx = du/2 : ½ ∫ u³ du de 1 à 2 = ½ · (16 − 1) ÷ 4 = 15/8. Sans le ½, on trouverait le double.")] }),
},

etudelnexp: {
retiens: { regle: "\\((e^u)' = u'e^u\\) et \\((uv)' = u'v + uv'\\). Comme \\(e^x > 0\\), dans \\(f'(x) = (x - 1)e^x\\) le signe de \\(f'\\) est celui de \\(x - 1\\) : on en tire les variations et les extremums. Croissances comparées : \\(\\frac{x^n}{e^x} \\to 0\\) quand \\(x \\to +\\infty\\) (l'exponentielle l'emporte sur toute puissance).",
exemple: ["\\(f(x) = (x - 2)e^x\\) : \\(f'(x) = (x - 1)e^x\\), minimum \\(f(1) = -e\\).", "\\(g(x) = x^2e^{-x}\\) : \\(g'(x) = x(2 - x)e^{-x}\\), maximum \\(g(2) = \\frac{4}{e^2}\\), et \\(g(x) \\to 0\\) en \\(+\\infty\\)."],
piege: "\\(e^x\\) ne s'annule jamais : il ne donne aucun zéro de \\(f'\\) et ne change pas son signe." },
predict: { q: "Quand x devient très grand, x³ ÷ eˣ…", choices: ["tend vers 0", "tend vers +∞", "tend vers 1"], good: 0,
why: "L'exponentielle croît plus vite que toute puissance : pour x = 20, x³ = 8'000 mais e²⁰ ≈ 485 millions. Le quotient tend vers 0." },
defis: ["f(x) = (x − 2)·eˣ. Déplace le point jusqu'au minimum (tangente horizontale).", "g(x) = x²·e⁻ˣ. Déplace le point jusqu'au maximum local."],
play: slide({
ctl: (s) => [s ? { k: "x", lab: "x", min: -0.5, max: 8, step: 0.5 } : { k: "x", lab: "x", min: -3, max: 2.5, step: 0.5 }],
init: (s) => ({ x: s ? 4 : 2.5 }),
fig: (st, s) => { const f = s ? (t) => t * t * Math.exp(-t) : (t) => (t - 2) * Math.exp(t), d = s ? (t) => t * (2 - t) * Math.exp(-t) : (t) => (t - 1) * Math.exp(t), x = st.x, m = d(x), w = s ? 0.9 : 0.5;
return graph({ xr: s ? [-0.7, 8.3] : [-3.3, 2.8], yr: s ? [-0.15, 0.75] : [-3.2, 6.6], gx: s ? 1 : 0.5, lx: s ? 2 : 1, gy: s ? 0.1 : 1, ly: s ? 0.2 : 2, H: 210, fns: [{ f }], segs: [[x - w, f(x) - w * m, x + w, f(x) + w * m, Math.abs(m) < 1e-12 ? "f-accent" : "f-line", 2.6]], pts: [[x, f(x), "", "f-dot"]], lab: "courbe et tangente au point choisi" }); },
out: (st, s) => { const x = st.x, m = s ? x * (2 - x) * Math.exp(-x) : (x - 1) * Math.exp(x), sgn = Math.abs(m) < 1e-12 ? 0 : Math.sign(m);
return (s ? "g'(x) = 2x·e⁻ˣ − x²·e⁻ˣ = x(2 − x)·e⁻ˣ" : "f'(x) = 1·eˣ + (x − 2)·eˣ = (x − 1)·eˣ") + "<br>En x = " + nb(x) + " : " + (s ? "x(2 − x) = " + nb(x * (2 - x)) : "x − 1 = " + nb(x - 1)) + " et " + (s ? "e⁻ˣ" : "eˣ") + " > 0, donc la dérivée est <b>" + (sgn > 0 ? "positive : la courbe monte" : sgn < 0 ? "négative : la courbe descend" : "nulle : tangente horizontale") + "</b>"; },
goal: [(st) => (st.x === 1 ? "f'(x) = (x − 1)·eˣ passe de − à + en 1 (eˣ > 0 ne change pas le signe) : minimum f(1) = −e ≈ −2,72." : ""),
(st) => (st.x === 2 ? "g' = x(2 − x)·e⁻ˣ passe de + à − en 2 : maximum local g(2) = 4e⁻² ≈ 0,54. Plus loin, g descend vers 0." : "")],
miss: (st, s) => (s && st.x === 0 ? "Tangente horizontale, mais g' passe de − à + : c'est un minimum (g(0) = 0). Cherche le maximum." : s ? "Le signe de g' est celui de x(2 − x)." : "Le signe de f' est celui de x − 1."),
ask: [{ q: "h(x) = (x + 3)·eˣ. Tape l'abscisse de son minimum.", ans: -4, ok: "h'(x) = eˣ + (x + 3)·eˣ = (x + 4)·eˣ, nulle en x = −4, où elle passe de − à +.", no: "Dérive le produit, mets eˣ en évidence, puis cherche le zéro de l'autre facteur." },
{ q: "Vers quel nombre tend g(x) = x²·e⁻ˣ = x² ÷ eˣ quand x → +∞ ?", ans: 0, ok: "L'exponentielle l'emporte sur toute puissance : x² ÷ eˣ → 0. La courbe se rapproche de l'axe des x.", no: "Compare la croissance de x² et de eˣ (essaie x = 20)." }] }),
},

eqdiff: {
retiens: { regle: "\\(y' = ky\\) a pour solutions \\(y = Ce^{kx}\\), et la condition initiale donne \\(C = y(0)\\). \\(y' = ay + b\\) : la solution constante (équilibre) est \\(y = -\\frac{b}{a}\\) (on pose \\(y' = 0\\)), et \\(y = Ce^{ax} - \\frac{b}{a}\\) ; si \\(a < 0\\), \\(y\\) tend vers l'équilibre.",
exemple: ["\\(y' = ky\\), \\(y(0) = 3\\), \\(y(2) = 3e\\) : \\(e^{2k} = e\\), \\(k = \\frac{1}{2}\\).", "\\(T' = -0{,}5T + 10\\) : équilibre \\(T = 20\\) °C.", "\\(y' = -2y + 6\\), \\(y(0) = 1\\) : \\(y = 3 - 2e^{-2x}\\)."],
piege: "Dans \\(y' = ay + b\\), \\(C = y(0) + \\frac{b}{a}\\), pas \\(y(0)\\) : on fixe \\(C\\) avec la condition initiale, sur la solution complète." },
predict: { q: "Laquelle de ces fonctions vérifie y' = 2y ?", choices: ["y = e²ˣ", "y = x²", "y = 2eˣ"], good: 0,
why: "(e²ˣ)' = 2e²ˣ = 2y. Pour y = x², y' = 2x ≠ 2x² ; pour y = 2eˣ, y' = 2eˣ = y, pas 2y." },
defis: ["y' = ky avec y(0) = 3. Règle k pour que la solution y = 3e^{kx} passe par le point P(2 ; 3e) ≈ (2 ; 8,15).", "Refroidissement d'un café : T' = −0,5·T + b, avec T(0) = 90 °C. Règle b pour que la température se stabilise à 20 °C."],
play: slide({
ctl: (s) => [s ? { k: "b", lab: "b", min: 0, max: 20 } : { k: "k", lab: "k", min: -1, max: 1.5, step: 0.1 }],
init: (s) => (s ? { b: 4 } : { k: 1 }),
fig: (st, s) => {
if (!s) { const k = st.k; return graph({ xr: [-0.5, 3.2], yr: [-0.5, 13], gx: 0.5, lx: 1, gy: 1, ly: 2, H: 210, fns: [{ f: (x) => 3 * Math.exp(k * x) }], pts: [[0, 3, "(0 ; 3)", "f-dot", "r"], [2, 3 * Math.E, "P", Math.abs(k - 0.5) < 1e-9 ? "f-dot" : "f-fill2", "r"]], lab: "solution de y' = ky passant par (0 ; 3)" }); }
const e = 2 * st.b; return graph({ xr: [-0.3, 10], yr: [-4, 100], gx: 1, lx: 2, gy: 10, ly: 20, H: 210, pad: 14, fns: [{ f: (x) => e + (90 - e) * Math.exp(-0.5 * x) }], hl: [[e, "f-accent"]], pts: [[0, 90, "T(0) = 90", "f-dot", "r"]], lab: "température du café au cours du temps" }); },
out: (st, s) => {
if (!s) return "y = 3·e^(" + nb(st.k) + "x) : y(2) = 3·e^(" + nb(2 * st.k) + ") ≈ <b>" + nb(+(3 * Math.exp(2 * st.k)).toFixed(2)) + "</b> (on veut 3e ≈ 8,15)";
return "Équilibre : T' = 0 ⇔ −0,5·T + " + nb(st.b) + " = 0 ⇔ T = <b>" + nb(2 * st.b) + " °C</b> (pointillé)<br>" + '<span class="small">T = ' + nb(2 * st.b) + " + " + nb(90 - 2 * st.b) + "·e^(−0,5t) : l'écart à l'équilibre diminue de moitié… puis encore</span>"; },
goal: [(st) => (Math.abs(st.k - 0.5) < 1e-9 ? "k = 1/2, donc y(2) = 3·e^(2 · 0,5) = 3e. On a résolu 3e^(2k) = 3e, donc 2k = 1." : ""),
(st) => (st.b === 10 ? "b = 10 : l'équilibre −b/a = 10 ÷ 0,5 = 20 °C. Comme a = −0,5 < 0, la température tend vers 20 °C." : "")],
miss: (st, s) => (s ? "La température se stabilise là où T' = 0." : "Courbe trop " + (st.k > 0.5 ? "raide" : "plate") + " : on veut y(2) = 3e."),
ask: [{ q: "y' = ky, y(0) = 5 et y(1) = 15. Tape k (au centième).", ans: Math.log(3), tol: 0.006, ok: "5e^k = 15, e^k = 3, k = ln 3 ≈ 1,10.", no: "y = 5e^(kx) ; écris y(1) = 15 et isole e^k." },
{ q: "\\(y' = -2y + 6\\), \\(y(0) = 1\\). La solution s'écrit \\(y = 3 + Ce^{-2x}\\). Tape C.", ans: -2, ok: "y(0) = 3 + C = 1, donc C = −2 (et non 1), d'où y = 3 − 2e^(−2x).", no: "Remplace x par 0 : y(0) = 3 + C." }] }),
},

statdesc: {
retiens: { regle: "Série en classes : on remplace chaque classe par son centre, puis moyenne pondérée \\(\\bar x = \\frac{1}{N}\\sum n_i x_i\\). Écart-type (formule de König) : \\(\\sigma = \\sqrt{\\overline{x^2} - \\bar x^2}\\), où \\(\\overline{x^2}\\) est la moyenne des carrés. Si \\(y = ax + b\\) : \\(\\bar y = a\\bar x + b\\) et \\(\\sigma_y = |a|\\,\\sigma_x\\).",
exemple: ["Classes \\([10 \\,;\\, 20[\\), \\([20 \\,;\\, 30[\\), \\([30 \\,;\\, 40[\\) d'effectifs 4, 6, 4 : \\(\\bar x = \\frac{15 \\cdot 4 + 25 \\cdot 6 + 35 \\cdot 4}{14} = 25\\).", "\\(\\bar x = 30\\), \\(\\overline{x^2} = 925\\) : \\(\\sigma = \\sqrt{925 - 900} = 5\\).", "\\(\\bar x = 20\\), \\(\\sigma = 5\\), \\(y = 3x + 40\\) : \\(\\bar y = 100\\), \\(\\sigma_y = 15\\)."],
piege: "Ajouter \\(b\\) à toutes les valeurs déplace la moyenne mais ne change pas l'écart-type." },
predict: { q: "Classes [10 ; 20[ (effectif 4) et [20 ; 30[ (effectif 6). Pour calculer la moyenne, on remplace chaque classe par…", choices: ["son centre (15 et 25)", "sa borne inférieure (10 et 20)", "son effectif"], good: 0,
why: "Le centre représente au mieux les valeurs de la classe : x̄ = (15 · 4 + 25 · 6) ÷ 10 = 21." },
defis: ["Classes [10 ; 20[, [20 ; 30[, [30 ; 40[ d'effectifs 4, 6 et n. Règle n pour que la moyenne vaille 25.", "Une série a x̄ = 20 et σ = 5. On transforme chaque valeur par y = ax + b. Règle a et b pour obtenir ȳ = 100 et σ_y = 15."],
play: slide({
ctl: (s) => (s ? [{ k: "a", lab: "a", min: 0.5, max: 4, step: 0.5 }, { k: "b", lab: "b", min: -20, max: 60, step: 10 }] : [{ k: "n", lab: "Effectif n de [30 ; 40[", min: 0, max: 12 }]),
init: (s) => (s ? { a: 1, b: 0 } : { n: 1 }),
fig: (st, s) => {
if (!s) { const n = st.n, N = 10 + n, m = (60 + 150 + 35 * n) / N; return graph({ xr: [5, 45], yr: [-0.5, 13], gx: 5, lx: 10, gy: 1, ly: 2, H: 190, polys: bars([[15, 4], [25, 6], [35, n]], 10), vl: [[m, "f-accent"]], txt: [[m, 12.2, "x̄"]], lab: "histogramme des trois classes et moyenne" }); }
const y1 = 15 * st.a + st.b, y2 = 25 * st.a + st.b, m = 20 * st.a + st.b, sd = 5 * st.a;
return graph({ xr: [-20, 180], yr: [-0.5, 7], gx: 10, lx: 40, gy: 1, ly: 2, H: 170, polys: bars([[15, 5], [25, 5]], 3, "f-soft").concat(bars([[y1, 5], [y2, 5]], 3 * st.a)), vl: [[m, "f-accent"]], segs: [[m - sd, 6, m + sd, 6, "f-accent", 2]], txt: [[m, 6.4, "ȳ ± σ"]], lab: "série de départ (clair) et série transformée" }); },
out: (st, s) => {
if (s) return "ȳ = a·x̄ + b = " + nb(st.a) + " · 20 " + sg(st.b).trim() + " = <b>" + nb(20 * st.a + st.b) + "</b><br>σ_y = |a|·σ = " + nb(st.a) + " · 5 = <b>" + nb(5 * st.a) + "</b>";
const n = st.n, N = 10 + n, m = (60 + 150 + 35 * n) / N, q = (225 * 4 + 625 * 6 + 1225 * n) / N, sd = Math.sqrt(q - m * m);
return "x̄ = (15 · 4 + 25 · 6 + 35 · " + n + ") ÷ " + N + " = <b>" + nb(+m.toFixed(2)) + "</b><br>moyenne des carrés = (15² · 4 + 25² · 6 + 35² · " + n + ") ÷ " + N + " ≈ " + nb(+q.toFixed(2)) + "<br>σ = √(moyenne des carrés − x̄²) ≈ <b>" + nb(+sd.toFixed(2)) + "</b>"; },
goal: [(st) => (st.n === 4 ? "n = 4 : (60 + 150 + 140) ÷ 14 = 350 ÷ 14 = 25. Avec 4 valeurs de chaque côté, la série est symétrique autour de 25." : ""),
(st) => (st.a === 3 && st.b === 40 ? "a = 3 étire la série (σ × 3 = 15), b = 40 la décale sans changer la dispersion : 3 · 20 + 40 = 100." : "")],
miss: (st, s) => (s ? (st.a === 3 ? "Bon écart-type : b décale toutes les valeurs sans changer la dispersion. Règle b pour la moyenne." : "σ_y = |a| · 5 : seul a change la dispersion.") : "On veut (210 + 35n) ÷ (10 + n) = 25."),
ask: [{ q: "Une série a pour moyenne x̄ = 30 et pour moyenne des carrés 925. Tape son écart-type σ.", ans: 5, ok: "σ = √(925 − 30²) = √25 = 5.", no: "σ = √(moyenne des carrés − x̄²)." },
{ q: "Températures : x̄ = 20 °C, σ = 5 °C. En degrés Fahrenheit (y = 1,8x + 32), tape σ_y.", ans: 9, ok: "σ_y = 1,8 · 5 = 9 °F ; le + 32 ne change pas l'écart-type.", no: "σ_y = |a| · σ : le terme b n'intervient pas." }] }),
},
});





const tu = (x) => "tu proposes <b>" + nb(x) + "</b>";
const toi = (cp, wins) => hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(cp[s] + "<br>" + tu(x)), wins });
Object.assign(ACTIVE, {
derivth: {
retiens: { regle: "Rolle : si \\(f(a) = f(b)\\), il existe \\(c\\) entre \\(a\\) et \\(b\\) avec \\(f'(c) = 0\\). Lagrange : il existe \\(c\\) avec \\(f'(c) = \\frac{f(b) - f(a)}{b - a}\\), la tangente parallèle à la corde. On trouve \\(c\\) en résolvant cette équation.", exemple: ["\\(f(x) = x^2 - 6x + 1\\) sur \\([1 \\,;\\, 5]\\) : \\(f'(c) = 2c - 6 = 0\\), \\(c = 3\\).", "\\(f(x) = \\sqrt{x}\\) sur \\([1 \\,;\\, 9]\\) : corde de pente \\(\\frac{1}{4}\\), \\(\\frac{1}{2\\sqrt{c}} = \\frac{1}{4}\\), \\(c = 4\\)."], piege: "\\(c\\) n'est pas toujours le milieu de l'intervalle (ici 5, mais \\(c = 4\\))." },
predict: { q: "La courbe de \\(f(x) = |x|\\) a une pointe en 0. Est-elle dérivable en 0 ?", choices: ["non : les pentes à gauche (−1) et à droite (1) diffèrent", "oui, car elle est continue", "oui, et f'(0) = 0"], good: 0,
why: "f est continue en 0, mais ses deux demi-tangentes ont les pentes −1 et 1 : pas de tangente unique, pas de dérivée. Continue n'implique pas dérivable." },
defis: ["\\(f(x) = x^2 - 6x + 1\\) sur \\([1 \\,;\\, 5]\\) : \\(f(1) = f(5)\\). Trouve \\(c\\) avec \\(f'(c) = 0\\) (Rolle).", "\\(f(x) = \\sqrt{x}\\) sur \\([1 \\,;\\, 9]\\) : trouve \\(c\\) où la tangente est parallèle à la corde (Lagrange)."],
play: toi(["f'(x) = 2x − 6 : résous f'(c) = 0", "Pente de la corde : (3 − 1) ÷ (9 − 1) = 1/4 ; résous 1 ÷ (2√c) = 1/4"],
[W(3, "2c − 6 = 0, donc c = 3 : le sommet de la parabole, entre 1 et 5."), W(4, "1 ÷ (2√c) = 1/4 donne √c = 2, donc c = 4, qui n'est pas le milieu (5) de l'intervalle.")]),
},
pvect: {
retiens: { regle: "\\(\\vec u \\times \\vec v = (u_2v_3 - u_3v_2 \\,;\\, u_3v_1 - u_1v_3 \\,;\\, u_1v_2 - u_2v_1)\\) est perpendiculaire à \\(\\vec u\\) et \\(\\vec v\\). Sa norme est l'aire du parallélogramme ; l'aire du triangle en est la moitié.", exemple: ["\\((1 \\,;\\, 2 \\,;\\, 0) \\times (0 \\,;\\, 1 \\,;\\, 3) = (6 \\,;\\, -3 \\,;\\, 1)\\)", "\\(A(1 \\,;\\, 0 \\,;\\, 0)\\), \\(B(0 \\,;\\, 2 \\,;\\, 0)\\), \\(C(0 \\,;\\, 0 \\,;\\, 3)\\) : \\(\\overrightarrow{AB} \\times \\overrightarrow{AC} = (6 \\,;\\, 3 \\,;\\, 2)\\), norme 7, aire \\(\\frac{7}{2}\\)."], piege: "Triangle : la moitié de \\(\\|\\overrightarrow{AB} \\times \\overrightarrow{AC}\\|\\) ; parallélogramme : la norme entière." },
predict: { q: "Le produit vectoriel de deux vecteurs de l'espace est…", choices: ["un vecteur perpendiculaire aux deux", "un nombre", "un vecteur parallèle au premier"], good: 0,
why: "Contrairement au produit scalaire (un nombre), u × v est un vecteur, perpendiculaire à u et à v ; sa longueur mesure l'aire du parallélogramme construit sur u et v." },
defis: ["\\(\\vec u = (1 \\,;\\, 2 \\,;\\, 0)\\), \\(\\vec v = (0 \\,;\\, 1 \\,;\\, 3)\\). Tape la première composante \\(u_2v_3 - u_3v_2\\) de \\(\\vec u \\times \\vec v\\).", "\\(A(1 \\,;\\, 0 \\,;\\, 0)\\), \\(B(0 \\,;\\, 2 \\,;\\, 0)\\), \\(C(0 \\,;\\, 0 \\,;\\, 3)\\) : \\(\\overrightarrow{AB} \\times \\overrightarrow{AC} = (6 \\,;\\, 3 \\,;\\, 2)\\). Tape l'aire du triangle ABC."],
play: toi(["u₂v₃ − u₃v₂ = 2 · 3 − 0 · 1", "Norme : √(36 + 9 + 4) = 7, puis la moitié pour un triangle"],
[W(6, "2 · 3 − 0 · 1 = 6 ; les autres composantes : 0 · 0 − 1 · 3 = −3 et 1 · 1 − 2 · 0 = 1."), W(3.5, "‖(6 ; 3 ; 2)‖ = √49 = 7 : aire du parallélogramme 7, du triangle 3,5.")]),
},
syslin: {
retiens: { regle: "Pour \\(\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}\\) : \\(D = ad - bc\\) ; si \\(D \\neq 0\\), \\(x = \\frac{D_x}{D}\\) avec \\(D_x = ed - bf\\) (la colonne des \\(x\\) remplacée par le second membre).", exemple: ["\\(\\begin{cases} 2x + y = 7 \\\\ x - 3y = 7 \\end{cases}\\) : \\(D = -6 - 1 = -7\\).", "\\(D_x = 7 \\cdot (-3) - 1 \\cdot 7 = -28\\), \\(x = \\frac{-28}{-7} = 4\\) (et \\(y = -1\\))."], piege: "\\(x = \\frac{D_x}{D}\\), pas \\(\\frac{D}{D_x}\\)." },
predict: { q: "Si le déterminant D du système vaut 0…", choices: ["il n'y a pas une solution unique (aucune ou une infinité)", "la solution est x = 0, y = 0", "on ne peut rien dire"], good: 0,
why: "D = 0 : les deux droites sont parallèles (aucune solution) ou confondues (infinité). La règle de Cramer divise par D : impossible." },
defis: ["Système \\(\\begin{cases} 2x + y = 7 \\\\ x - 3y = 7 \\end{cases}\\). Tape son déterminant \\(D\\).", "Même système : \\(D_x = -28\\). Tape \\(x\\)."],
play: toi(["D = ad − bc = 2 · (−3) − 1 · 1", "x = Dx ÷ D"],
[W(-7, "D = −6 − 1 = −7 ≠ 0 : une seule solution."), W(4, "x = −28 ÷ (−7) = 4 ; vérifie : 2 · 4 + y = 7 donne y = −1.")]),
},
bases: {
retiens: { regle: "\\((\\vec u \\,;\\, \\vec v)\\) est une base du plan si \\(\\det(\\vec u \\,;\\, \\vec v) \\neq 0\\). Les composantes de \\(\\vec w\\) sont les nombres \\((\\alpha \\,;\\, \\beta)\\) tels que \\(\\vec w = \\alpha\\vec u + \\beta\\vec v\\). Si le déterminant est nul, les vecteurs sont liés (colinéaires).", exemple: ["\\(\\vec u = \\binom{1}{2}\\), \\(\\vec v = \\binom{3}{1}\\), \\(\\vec w = \\binom{5}{5} = 2\\vec u + \\vec v\\) : composantes \\((2 \\,;\\, 1)\\).", "\\(\\binom{2}{3}\\) et \\(\\binom{m}{6}\\) : \\(12 - 3m = 0\\), liés pour \\(m = 4\\)."], piege: "Les composantes dépendent de la base : \\(\\binom{5}{5}\\) a pour composantes \\((2 \\,;\\, 1)\\) dans \\((\\vec u \\,;\\, \\vec v)\\)." },
predict: { q: "\\(\\vec u = \\binom{1}{2}\\) et \\(\\vec v = \\binom{2}{4}\\) forment-ils une base du plan ?", choices: ["non : v = 2u, ils sont colinéaires", "oui, deux vecteurs suffisent toujours", "oui, car ils ne sont pas nuls"], good: 0,
why: "v = 2u : avec u et v, on n'atteint que la droite de direction u. det(u ; v) = 4 − 4 = 0 : famille liée, pas une base." },
defis: ["\\(\\vec u = \\binom{1}{2}\\), \\(\\vec v = \\binom{3}{1}\\), \\(\\vec w = \\binom{5}{5}\\). Tape \\(\\alpha\\) tel que \\(\\vec w = \\alpha\\vec u + \\beta\\vec v\\).", "Pour quelle valeur de \\(m\\) les vecteurs \\(\\binom{2}{3}\\) et \\(\\binom{m}{6}\\) sont-ils liés ?"],
play: toi(["α + 3β = 5 et 2α + β = 5 : résous le système", "det = 2 · 6 − 3 · m = 0"],
[W(2, "α = 2, β = 1 : 2u + v = (2 + 3 ; 4 + 1) = (5 ; 5)."), W(4, "12 − 3m = 0, donc m = 4 ; et alors (4 ; 6) = 2 · (2 ; 3).")]),
},
bayes: {
retiens: { regle: "Bayes : \\(P_B(A) = \\frac{P(A) \\cdot P_A(B)}{P(B)}\\). Avec des effectifs : parmi les positifs, la part des vrais positifs = vrais positifs ÷ (vrais + faux positifs).", exemple: ["10'000 personnes, 1 % malades, test positif chez 90 % des malades et 5 % des sains : 90 vrais positifs, 495 faux positifs.", "\\(P_+(M) = \\frac{90}{585} \\approx 15{,}4\\,\\%\\)."], piege: "\\(P_+(M) \\neq P_M(+)\\) : un test « fiable à 90 % » peut donner surtout des fausses alertes quand la maladie est rare." },
predict: { q: "Une maladie touche 1 % des gens ; un test détecte 90 % des malades, mais se trompe chez 5 % des gens sains. Ton test est positif. Probabilité d'être malade ?", choices: ["environ 15 %", "90 %", "95 %"], good: 0,
why: "Sur 10'000 personnes : 100 malades dont 90 positifs, mais 9'900 sains dont 495 positifs. Parmi 585 positifs, seuls 90 sont malades : environ 15 %." },
defis: ["10'000 personnes, 1 % malades ; le test est positif chez 90 % des malades. Combien de vrais positifs ?", "Il y a aussi 495 faux positifs. Parmi les positifs, quel pourcentage est malade (au dixième) ?"],
play: toi(["Malades : 1 % de 10'000 = 100 ; positifs parmi eux : 90 %", "90 ÷ (90 + 495), en pour cent"],
[W(90, "100 malades, dont 90 % positifs : 90 vrais positifs."), W(15.4, "90 ÷ 585 ≈ 0,154 : environ 15,4 % des positifs sont malades.", 0.051)]),
},
cplxalg: {
retiens: { regle: "On calcule avec \\(i\\) comme avec une lettre, puis \\(i^2 = -1\\). Pour diviser, on multiplie en haut et en bas par le conjugué du dénominateur : \\((a + bi)(a - bi) = a^2 + b^2\\).", exemple: ["\\((2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 5 + i\\)", "\\(\\frac{5 + 5i}{1 + 2i} = \\frac{(5 + 5i)(1 - 2i)}{5} = \\frac{15 - 5i}{5} = 3 - i\\)"], piege: "\\(-3i^2 = +3\\) : le produit des parties imaginaires change de signe." },
predict: { q: "Que vaut \\(i^2\\), si \\(i\\) est le nombre « imaginaire » ?", choices: ["−1", "1", "i"], good: 0,
why: "C'est la définition de i : un nombre dont le carré vaut −1. Il n'est pas réel, mais on calcule avec lui comme avec une lettre." },
defis: ["Calcule \\((2 + 3i)(1 - i)\\) et tape sa partie réelle.", "Calcule \\(\\frac{5 + 5i}{1 + 2i}\\) et tape sa partie imaginaire."],
play: toi(["Développe : 2 − 2i + 3i − 3i², avec i² = −1", "Multiplie en haut et en bas par 1 − 2i : dénominateur 1 + 4 = 5"],
[W(5, "2 − 2i + 3i + 3 = 5 + i : partie réelle 5."), W(-1, "(5 + 5i)(1 − 2i) = 5 − 10i + 5i + 10 = 15 − 5i ; divisé par 5 : 3 − i, partie imaginaire −1.")]),
},
cplxtrig: {
retiens: { regle: "Module \\(|a + bi| = \\sqrt{a^2 + b^2}\\). Sous forme \\(re^{i\\theta}\\), Moivre : \\((re^{i\\theta})^n = r^ne^{in\\theta}\\) : le module est élevé à la puissance, l'argument multiplié.", exemple: ["\\(|3 + 4i| = \\sqrt{9 + 16} = 5\\)", "\\(1 + i = \\sqrt{2}e^{i\\frac{\\pi}{4}}\\) : \\((1 + i)^8 = 16e^{2i\\pi} = 16\\)"], piege: "\\((1 + i)^8 \\neq 1^8 + i^8\\) : passe par le module et l'argument." },
predict: { q: "Multiplier un nombre complexe par \\(i\\), c'est…", choices: ["tourner son point d'un quart de tour (90°)", "doubler sa distance à l'origine", "changer son signe"], good: 0,
why: "i = e^(iπ/2) : module 1, argument π/2. Multiplier par i ajoute π/2 à l'argument sans changer le module : un quart de tour." },
defis: ["Tape le module de \\(3 + 4i\\).", "Calcule \\((1 + i)^8\\) (c'est un nombre réel)."],
play: toi(["√(3² + 4²)", "1 + i = √2·e^(iπ/4) : (√2)⁸ = 16 et l'argument devient 8 · π/4 = 2π"],
[W(5, "√(9 + 16) = √25 = 5."), W(16, "(√2)⁸ = 16 et e^(2iπ) = 1 : (1 + i)⁸ = 16.")]),
},
cplxeq: {
retiens: { regle: "Si \\(\\Delta < 0\\), \\(\\Delta = (i\\sqrt{-\\Delta})^2\\) et \\(z = \\frac{-b \\pm i\\sqrt{-\\Delta}}{2a}\\) : deux solutions conjuguées.", exemple: ["\\(z^2 - 4z + 13 = 0\\) : \\(\\Delta = 16 - 52 = -36 = (6i)^2\\).", "\\(z = \\frac{4 \\pm 6i}{2} = 2 \\pm 3i\\)"], piege: "Divise aussi la partie imaginaire par \\(2a\\) : \\(\\frac{6i}{2} = 3i\\)." },
predict: { q: "L'équation \\(z^2 + 1 = 0\\) a-t-elle des solutions dans les complexes ?", choices: ["oui : i et −i", "non, un carré n'est jamais négatif", "oui : 1 et −1"], good: 0,
why: "i² = −1 et (−i)² = −1 : i et −i sont solutions. Dans les complexes, toute équation du second degré a des solutions." },
defis: ["\\(z^2 - 4z + 13 = 0\\) : tape le discriminant \\(\\Delta\\).", "Tape la partie imaginaire de la solution de partie imaginaire positive."],
play: toi(["Δ = b² − 4ac = 16 − 4 · 13", "z = (4 ± 6i) ÷ 2"],
[W(-36, "Δ = 16 − 52 = −36 < 0 : deux solutions complexes conjuguées."), W(3, "z = 2 ± 3i : partie imaginaire 3 (et −3 pour l'autre).")]),
},
suitegeom: {
retiens: { regle: "Suite arithmétique : \\(u_n = u_1 + (n - 1)r\\) et \\(S_n = \\frac{n(u_1 + u_n)}{2}\\). Géométrique : \\(u_n = u_1q^{n - 1}\\) et \\(S_n = u_1\\frac{q^n - 1}{q - 1}\\).", exemple: ["\\(1 + 3 + 5 + \\ldots + 29\\) : \\(29 = 1 + (n - 1) \\cdot 2\\), \\(n = 15\\) termes.", "\\(S = \\frac{15 \\cdot (1 + 29)}{2} = 225\\)"], piege: "De \\(u_1\\) à \\(u_n\\), on ajoute la raison \\(n - 1\\) fois." },
predict: { q: "Combien vaut \\(1 + 2 + 3 + \\ldots + 100\\) ?", choices: ["5'050", "10'000", "5'000"], good: 0,
why: "Gauss : on groupe 1 + 100, 2 + 99, … : 50 paires de somme 101, donc 5'050 = 100 · 101 ÷ 2." },
defis: ["Combien de termes dans \\(1 + 3 + 5 + \\ldots + 29\\) ?", "Calcule cette somme."],
play: toi(["u_n = 1 + (n − 1) · 2 = 29", "S = n(premier + dernier) ÷ 2"],
[W(15, "1 + 2(n − 1) = 29 donne n = 15."), W(225, "15 · (1 + 29) ÷ 2 = 225 (c'est aussi 15²).")]),
},
serie: {
retiens: { regle: "Si \\(|q| < 1\\), \\(u_0 + u_0q + u_0q^2 + \\ldots = \\frac{u_0}{1 - q}\\). Un nombre périodique est une telle série.", exemple: ["\\(1 + \\frac{1}{2} + \\frac{1}{4} + \\ldots = \\frac{1}{1 - \\frac{1}{2}} = 2\\)", "\\(0{,}\\overline{36} = \\frac{36}{100} \\cdot \\frac{1}{1 - \\frac{1}{100}} = \\frac{36}{99} = \\frac{4}{11}\\)"], piege: "La formule ne vaut que pour \\(|q| < 1\\) ; sinon la somme n'a pas de limite." },
predict: { q: "On additionne \\(1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\ldots\\) sans fin. Le résultat…", choices: ["s'approche de 2", "devient infiniment grand", "s'approche de 1"], good: 0,
why: "Chaque terme comble la moitié de ce qui manque pour atteindre 2 : 1, 1,5, 1,75, 1,875… La somme tend vers 2." },
defis: ["Calcule \\(1 + \\frac{1}{2} + \\frac{1}{4} + \\ldots\\) (somme infinie).", "Écris \\(0{,}363636\\ldots\\) sous forme de fraction irréductible."],
play: toi(["u₀ = 1, q = 1/2 : u₀ ÷ (1 − q)", "0,36 + 0,0036 + … : u₀ = 36/100, q = 1/100"],
[W(2, "1 ÷ (1 − 1/2) = 2."), W(4 / 11, "(36/100) ÷ (99/100) = 36/99 = 4/11.", 0.0005)]),
},
});
})();

