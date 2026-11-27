


(function () {
const R2 = {
utemps: ["Durées : on compte par 60", "Une heure n'a pas 100 minutes : le temps se compte par 60.",
"\\(1\\ \\text{h} = 60\\ \\text{min}\\) et \\(1\\ \\text{min} = 60\\ \\text{s}\\), donc \\(1\\ \\text{h} = 3600\\ \\text{s}\\). Pour passer des minutes aux heures décimales, on divise par 60. Pour passer des heures décimales aux minutes, on multiplie la partie décimale par 60. Pour une durée entre deux horaires, on complète jusqu'à l'heure pleine, puis on ajoute.",
["\\(45\\ \\text{min} = \\frac{45}{60}\\ \\text{h} = 0{,}75\\ \\text{h}\\).", "\\(2{,}4\\ \\text{h} = 2\\ \\text{h} + 0{,}4 \\cdot 60\\ \\text{min} = 2\\ \\text{h}\\ 24\\ \\text{min}\\).", "\\(7\\text{'}274\\ \\text{s}\\) : 2 h (7'200 s), reste 74 s = 1 min 14 s. Donc 2 h 01 min 14 s."],
"\\(1\\ \\text{h}\\ 30\\ \\text{min}\\) s'écrit \\(1{,}5\\ \\text{h}\\), pas \\(1{,}3\\ \\text{h}\\) ; et \\(1{,}5\\ \\text{h}\\) n'est pas 1 h 50 min."],
ucomp: ["Unités composées", "Une vitesse en km/h dit combien de kilomètres on parcourt en une heure : on convertit chaque unité séparément.",
"En une heure (3600 s), on parcourt 3600 fois la distance d'une seconde. Comme 1 km = 1000 m, \\(1\\ \\text{m/s} = 3{,}6\\ \\text{km/h}\\). Des m/s vers les km/h, on multiplie par 3,6. Des km/h vers les m/s, on divise par 3,6. Pour les masses volumiques : \\(1\\ \\text{g/cm}^3 = 1000\\ \\text{kg/m}^3\\), car un m³ contient un million de cm³.",
["\\(108\\ \\text{km/h}\\) : en 1 h, 108'000 m ; en 1 s, \\(108\\text{'}000 : 3600 = 30\\ \\text{m/s}\\).", "\\(12\\ \\text{m/s} = 12 \\cdot 3{,}6 = 43{,}2\\ \\text{km/h}\\).", "Débit \\(12\\ \\text{L/min}\\) : en une heure, \\(720\\ \\text{L} = 0{,}72\\ \\text{m}^3\\), donc \\(0{,}72\\ \\text{m}^3\\text{/h}\\)."],
"Vérifie le sens : le même mouvement s'écrit avec un plus grand nombre en km/h qu'en m/s."],
vitesse: ["Vitesse, distance, durée", "La vitesse moyenne, c'est la distance parcourue en une unité de temps.",
"\\(v = \\frac{d}{t}\\), donc \\(d = v \\cdot t\\) et \\(t = \\frac{d}{v}\\). Les unités doivent aller ensemble : des km et des heures donnent des km/h. Une durée en heures et minutes s'écrit d'abord en heures décimales. Sur un trajet en plusieurs parties, la vitesse moyenne est la distance totale divisée par la durée totale.",
["42 km en 1 h 45 min : \\(1{,}75\\ \\text{h}\\), donc \\(v = 42 : 1{,}75 = 24\\ \\text{km/h}\\).", "À 72 km/h pendant 25 min : \\(72 : 60 = 1{,}2\\) km par minute, donc \\(d = 1{,}2 \\cdot 25 = 30\\ \\text{km}\\).", "Aller 120 km à 60 km/h (2 h), retour à 40 km/h (3 h) : \\(v = 240 : 5 = 48\\ \\text{km/h}\\)."],
"On ne fait jamais la moyenne de deux vitesses : on roule plus longtemps à la vitesse la plus lente."],
gquot: ["Masse volumique et débit", "La masse volumique dit combien pèse une unité de volume d'une matière. Le débit dit quel volume coule par unité de temps.",
"Masse volumique : \\(\\rho = \\frac{m}{V}\\), donc \\(m = \\rho \\cdot V\\) et \\(V = \\frac{m}{\\rho}\\). Débit : \\(\\text{débit} = \\frac{V}{t}\\), donc \\(V = \\text{débit} \\cdot t\\) et \\(t = \\frac{V}{\\text{débit}}\\). Avant de calculer, on met les unités d'accord (g et cm³, kg et m³, L et min).",
["Or : \\(19{,}3\\ \\text{g/cm}^3\\). Un lingot de \\(50\\ \\text{cm}^3\\) pèse \\(19{,}3 \\cdot 50 = 965\\ \\text{g}\\).", "Air : \\(1{,}2\\ \\text{kg/m}^3\\). Une salle de \\(200\\ \\text{m}^3\\) contient \\(240\\ \\text{kg}\\) d'air.", "Piscine de \\(2{,}4\\ \\text{m}^3 = 2\\text{'}400\\ \\text{L}\\) à \\(15\\ \\text{L/min}\\) : \\(2\\text{'}400 : 15 = 160\\ \\text{min}\\)."],
"Un kilo de plomb et un kilo de plumes ont la même masse : c'est leur volume qui change."],
};
for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

const dec = (v, k = 2) => String(+(+v).toFixed(k)).replace(".", ",");
const two = (n) => (n < 10 ? "0" : "") + n;
const svgW = 320;

Object.assign(ACTIVE, {

utemps: {
predict: { q: "Un film dure 1,5 h. Combien de temps est-ce ?", choices: ["1 h 50 min", "1 h 30 min", "1 h 05 min"], good: 1,
why: "0,5 h, c'est une demi-heure : la moitié de 60 min, donc 30 min. Une heure n'a pas 100 minutes." },
defis: ["Règle la barre sur 0,75 h.", "Combien de minutes font 0,2 h ? Règle la barre.", "Trouve la durée qui s'écrit 0,35 h."],
play(box, onWin) {
let m = 30, step = 0;
const draw = () => {
const x0 = 26, w = 268, xm = x0 + (w * m) / 60;
let g = '<rect x="' + x0 + '" y="20" width="' + w + '" height="34" rx="6" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>';
g += '<rect x="' + x0 + '" y="20" width="' + (xm - x0).toFixed(1) + '" height="34" rx="6" class="f-fill"/>';
for (let k = 0; k <= 60; k += 5) { const x = x0 + (w * k) / 60; g += '<line x1="' + x + '" y1="' + (k % 15 ? 48 : 40) + '" x2="' + x + '" y2="54" class="f-line"/>'; if (k % 15 === 0) g += '<text x="' + x + '" y="72" class="f-txt" text-anchor="middle" font-size="11">' + k + " min</text>"; }
g += '<text x="' + (x0 + w / 2) + '" y="13" class="f-txt" text-anchor="middle" font-size="12">1 heure = 60 minutes</text>';
g += '<rect class="act-hit" x="' + x0 + '" y="14" width="' + w + '" height="46" fill="transparent" style="cursor:pointer"/>';
box.innerHTML = `<svg class="fig" viewBox="0 0 ${svgW} 80" role="img" aria-label="barre d'une heure, ${m} minutes">${g}</svg>
            ${actStepper("Minutes", m, "m")}
            <div class="act-out"><b>${m} min</b> = ${m} ÷ 60 h = <b>${dec(m / 60, 4)} h</b></div>
            <div class="small muted">Touche la barre, puis ajuste avec − et +.</div>`;
actBindStepper(box, "m", () => m, (v) => { m = v; draw(); check(); }, 0, 60);
const hit = box.querySelector(".act-hit");
hit.onclick = (e) => { const r = hit.getBoundingClientRect(); m = Math.max(0, Math.min(60, Math.round(((e.clientX - r.left) / r.width) * 60))); draw(); check(); };
};
const check = () => {
if (step === 0 && m === 45) { onWin(0, "45 min = 45 ÷ 60 = 0,75 h : trois quarts d'heure."); step = 1; }
else if (step === 1 && m === 12) { onWin(1, "0,2 h = 0,2 · 60 = 12 min (un cinquième d'heure)."); step = 2; }
else if (step === 2 && m === 21) { onWin(2, "0,35 h = 0,35 · 60 = 21 min. Pour passer des heures aux minutes, on multiplie par 60."); step = 3; }
};
draw();
},
},


ucomp: {

retiens: { regle: "En une heure (3600 s), on parcourt 3600 fois la distance d'une seconde. Comme 1 km = 1000 m, \\(1\\ \\text{m/s} = 3{,}6\\ \\text{km/h}\\). Des m/s vers les km/h, on multiplie par 3,6. Des km/h vers les m/s, on divise par 3,6.", exemple: ["\\(30\\ \\text{m/s}\\) : en 1 h, 108'000 m, soit \\(108\\ \\text{km/h}\\).", "\\(90\\ \\text{km/h} = 90 : 3{,}6 = 25\\ \\text{m/s}\\)."] },
predict: { q: "Un guépard court à 30 m/s. Va-t-il plus vite qu'une voiture à 100 km/h ?", choices: ["Oui", "Non"], good: 0,
why: "En une heure (3600 s), il parcourrait 30 · 3600 = 108'000 m = 108 km : 30 m/s = 108 km/h, plus que 100 km/h." },
defis: ["Trouve la vitesse en m/s qui fait exactement 36 km/h.", "Une voiture roule à 90 km/h : combien de m/s ?", "Quelle est la plus petite vitesse en m/s (nombre entier) qui dépasse 100 km/h ?"],
play(box, onWin) {
let v = 5, step = 0;
const draw = () => {
const kmh = +(v * 3.6).toFixed(1), x0 = 20, w = 280, cap = 150;
let g = '<text x="' + x0 + '" y="16" class="f-txt" font-size="12">en 1 seconde : ' + v + " m</text>";
g += '<rect x="' + x0 + '" y="22" width="' + ((w * v) / 50).toFixed(1) + '" height="14" rx="4" class="f-fill"/>';
g += '<text x="' + x0 + '" y="58" class="f-txt" font-size="12">en 1 heure : ' + (v * 3600).toLocaleString("fr-CH").replace(/\s/g, "'") + " m = " + String(kmh).replace(".", ",") + " km</text>";
g += '<rect x="' + x0 + '" y="64" width="' + Math.min(w, (w * kmh) / cap).toFixed(1) + '" height="14" rx="4" class="f-fill" opacity="0.55"/>';
g += '<line x1="' + (x0 + (w * 100) / cap) + '" y1="60" x2="' + (x0 + (w * 100) / cap) + '" y2="84" class="f-line" stroke-dasharray="3 3"/><text x="' + (x0 + (w * 100) / cap) + '" y="96" class="f-txt" text-anchor="middle" font-size="10">100 km/h</text>';
box.innerHTML = `<svg class="fig" viewBox="0 0 ${svgW} 100" role="img" aria-label="${v} mètres par seconde">${g}</svg>
            ${actStepper("Vitesse (m/s)", v, "v")}
            <div class="act-out"><b>${v} m/s</b> = ${v} · 3600 m par heure = <b>${String(kmh).replace(".", ",")} km/h</b></div>`;
actBindStepper(box, "v", () => v, (x) => { v = x; draw(); check(); }, 1, 45);
};
const check = () => {
if (step === 0 && v === 10) { onWin(0, "10 m/s : 36'000 m en une heure, soit 36 km/h. C'est le « × 3,6 »."); step = 1; }
else if (step === 1 && v === 25) { onWin(1, "90 km/h = 90 ÷ 3,6 = 25 m/s. Des km/h vers les m/s, on divise par 3,6."); step = 2; }
else if (step === 2 && v === 28) { onWin(2, "27 m/s = 97,2 km/h, mais 28 m/s = 100,8 km/h : c'est 28 m/s."); step = 3; }
else if (step === 2 && v > 28) $hint(box, v + " m/s = " + String(+(v * 3.6).toFixed(1)).replace(".", ",") + " km/h dépasse bien 100 km/h… mais y a-t-il plus petit ?");
};
draw();
},
},


vitesse: {
predict: { q: "Une voiture fait l'aller à 60 km/h et le retour à 40 km/h (même route). Sa vitesse moyenne est…", choices: ["50 km/h", "moins de 50 km/h", "plus de 50 km/h"], good: 1,
why: "Elle roule plus longtemps à 40 km/h qu'à 60 km/h : la moyenne penche vers 40. Avec 120 km : 2 h + 3 h, donc 240 km en 5 h = 48 km/h." },
defis: ["Parcours exactement 150 km en 2 h 30 min.", "À 80 km/h, règle la durée pour parcourir 100 km.", "Trouve deux réglages différents qui font 90 km."],
play(box, onWin) {
let k = 6, t = 60, step = 0; const found = new Set();
const v = () => 10 * k, d = () => (v() * t) / 60;
const draw = () => {
const x0 = 26, w = 266, D = d(), xc = x0 + Math.min(w, (w * D) / 200);
let g = '<rect x="' + x0 + '" y="34" width="' + w + '" height="22" rx="4" class="f-soft"/><line x1="' + x0 + '" y1="45" x2="' + (x0 + w) + '" y2="45" class="f-on" stroke-dasharray="12 8" stroke-width="2"/>';
for (let km = 0; km <= 200; km += 50) { const x = x0 + (w * km) / 200; g += '<line x1="' + x + '" y1="56" x2="' + x + '" y2="62" class="f-line"/><text x="' + x + '" y="76" class="f-txt" text-anchor="middle" font-size="10">' + km + " km</text>"; }
g += '<rect x="' + (xc - 15).toFixed(1) + '" y="18" width="30" height="14" rx="4" class="f-fill"/><circle cx="' + (xc - 8).toFixed(1) + '" cy="33" r="3.5" class="f-dot"/><circle cx="' + (xc + 8).toFixed(1) + '" cy="33" r="3.5" class="f-dot"/>';
const hm = Math.floor(t / 60) + " h " + two(t % 60) + " min";
box.innerHTML = `<svg class="fig" viewBox="0 0 ${svgW} 82" role="img" aria-label="voiture après ${dec(D)} km">${g}</svg>
            ${actStepper("Vitesse (km/h)", v(), "v")}${actStepper("Durée (min)", t, "t")}
            <div class="act-out">Durée : ${hm} = <b>${dec(t / 60)} h</b><br>Distance : d = v · t = ${v()} · ${dec(t / 60)} = <b>${dec(D)} km</b></div>`;
actBindStepper(box, "v", () => v(), (x) => { k = Math.round(x / 10); draw(); check(); }, 10, 130);
box.querySelectorAll('[data-st="v"]').forEach((b) => (b.onclick = () => { k = Math.max(1, Math.min(13, k + +b.dataset.d)); draw(); check(); }));
box.querySelectorAll('[data-st="t"]').forEach((b) => (b.onclick = () => { t = Math.max(15, Math.min(240, t + 15 * +b.dataset.d)); draw(); check(); }));
};
const check = () => {
const D = d();
if (step === 0 && t === 150 && D === 150) { onWin(0, "2 h 30 min = 2,5 h ; 150 ÷ 2,5 = 60 km/h."); step = 1; }
else if (step === 0 && D === 150) $hint(box, "150 km, c'est bien, mais en 2 h 30 min exactement.");
else if (step === 1 && v() === 80 && D === 100) { onWin(1, "t = 100 ÷ 80 = 1,25 h = 1 h 15 min = 75 min."); step = 2; }
else if (step === 2 && D === 90) { found.add(v() + "|" + t); if (found.size >= 2) { onWin(2, "Plusieurs réglages donnent 90 km : si la vitesse double, la durée est divisée par deux (ex. 60 km/h en 1 h 30, 90 km/h en 1 h)."); step = 3; } else $hint(box, "Bien : " + v() + " km/h pendant " + t + " min. Trouves-en un autre."); }
};
draw();
},
},


gquot: {

retiens: { regle: "Masse volumique : \\(\\rho = \\frac{m}{V}\\), donc \\(m = \\rho \\cdot V\\) et \\(V = \\frac{m}{\\rho}\\). Avant de calculer, on met les unités d'accord (g et cm³).", exemple: ["Or : \\(19{,}3\\ \\text{g/cm}^3\\). 6 cm³ pèsent \\(19{,}3 \\cdot 6 = 115{,}8\\ \\text{g}\\).", "Glace : \\(0{,}92\\ \\text{g/cm}^3\\). Un glaçon de 46 g : \\(V = 46 : 0{,}92 = 50\\ \\text{cm}^3\\)."] },
predict: { q: "Qu'est-ce qui pèse le plus : 1 kg de plomb ou 1 kg de plumes ?", choices: ["Le plomb", "Les plumes", "C'est pareil"], good: 2,
why: "Les deux pèsent 1 kg ! Les plumes prennent beaucoup plus de place : leur masse volumique est bien plus petite." },
defis: ["Fabrique un bloc d'or de plus de 100 g avec le moins de cm³ possible.", "Avec de l'aluminium, approche au mieux la masse d'un seul cm³ d'or (19,3 g).", "Un glaçon pèse 46 g : trouve son volume."],
play(box, onWin) {
const MAT = [["or", 19.3], ["fer", 7.9], ["aluminium", 2.7], ["glace", 0.92], ["bois", 0.6]];
let mi = 0, V = 3, step = 0;
const draw = () => {
const [nom, rho] = MAT[mi], m = +(rho * V).toFixed(2), c = 10, cols = 12, sz = 22;
let g = "";
for (let i = 0; i < Math.min(V, 60); i++) { const r = Math.floor(i / cols), q = i % cols; g += '<rect x="' + (12 + q * (sz + 3)) + '" y="' + (6 + r * (sz + 3)) + '" width="' + sz + '" height="' + sz + '" rx="3" class="f-fill" opacity="' + Math.min(1, 0.25 + rho / 20).toFixed(2) + '"/>'; }
const H = 12 + Math.ceil(Math.min(V, 60) / cols) * (sz + 3);
box.innerHTML = `<div class="seg act-mat">${MAT.map((x, i) => `<button type="button" data-i="${i}" aria-pressed="${i === mi}">${x[0]}</button>`).join("")}</div>
            <div class="small muted">1 cm³ ${nom === "or" ? "d'" : "de "}${nom} pèse ${dec(rho)} g · chaque carré = 1 cm³</div>
            <svg class="fig" viewBox="0 0 ${svgW} ${H}" role="img" aria-label="${V} centimètres cubes">${g}</svg>
            ${actStepper("Volume (cm³)", V, "V")}
            <div class="act-out">m = ρ · V = ${dec(rho)} · ${V} = <b>${dec(m)} g</b></div>`;
box.querySelectorAll(".act-mat button").forEach((b) => (b.onclick = () => { mi = +b.dataset.i; draw(); check(); }));
actBindStepper(box, "V", () => V, (x) => { V = x; draw(); check(); }, 1, 60);
};
const check = () => {
const [nom, rho] = MAT[mi], m = rho * V;
if (step === 0 && nom === "or" && V === 6) { onWin(0, "5 cm³ d'or pèsent 96,5 g, 6 cm³ pèsent 115,8 g : il faut 6 cm³."); step = 1; }
else if (step === 0 && nom === "or" && V > 6) $hint(box, "Plus de 100 g, oui… mais avec moins de cm³ ?");
else if (step === 1 && nom === "aluminium" && V === 7) { onWin(1, "7 cm³ d'aluminium pèsent 18,9 g : il faut environ 7 fois plus d'aluminium que d'or pour la même masse."); step = 2; }
else if (step === 2 && nom === "glace" && Math.abs(m - 46) < 1e-9) { onWin(2, "V = m ÷ ρ = 46 ÷ 0,92 = 50 cm³."); step = 3; }
};
draw();
},
},
});


DYN.vitesse = {
min: 0, max: 3, step: 0.25, start: 1.5,
label: (x) => "durée " + dec(x) + " h = " + Math.floor(x) + " h " + two(Math.round((x % 1) * 60)) + " min · distance " + dec(80 * x) + " km",
render(x) {
const W = 330, H = 176, gx = (t) => 40 + t * 90, gy = (d) => 150 - d * 0.5, D = 80 * x;
let g = '<line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(3.2) + '" y2="' + gy(0) + '" class="f-line"/><line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(0) + '" y2="' + gy(260) + '" class="f-line"/>';
for (let t = 1; t <= 3; t++) g += '<text x="' + gx(t) + '" y="' + (gy(0) + 14) + '" class="f-txt" text-anchor="middle" font-size="11">' + t + " h</text>";
for (let d = 80; d <= 240; d += 80) g += '<line x1="' + gx(0) + '" y1="' + gy(d) + '" x2="' + gx(3) + '" y2="' + gy(d) + '" class="f-grid"/><text x="' + (gx(0) - 4) + '" y="' + (gy(d) + 4) + '" class="f-txt" text-anchor="end" font-size="11">' + d + "</text>";
g += '<text x="' + (gx(0) + 4) + '" y="' + (gy(260) + 2) + '" class="f-txt" font-size="11">distance (km)</text>';
g += '<line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(3) + '" y2="' + gy(240) + '" class="f-line" stroke-dasharray="4 3"/>';
g += '<line x1="' + gx(x) + '" y1="' + gy(0) + '" x2="' + gx(x) + '" y2="' + gy(D) + '" class="f-accent" stroke-width="1.5"/><line x1="' + gx(0) + '" y1="' + gy(D) + '" x2="' + gx(x) + '" y2="' + gy(D) + '" class="f-accent" stroke-width="1" stroke-dasharray="2 2"/>';
g += '<circle cx="' + gx(x) + '" cy="' + gy(D) + '" r="5" class="f-dot"/>';
g += '<text x="' + Math.min(gx(x) + 8, 250) + '" y="' + (gy(D) - 8) + '" class="f-accent f-txt" font-size="13">' + dec(D) + " km</text>";
return '<svg class="fig" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="distance parcourue à 80 km/h en fonction de la durée">' + g + "</svg>";
},
};
if (typeof LESSON_FIGS !== "undefined") LESSON_FIGS.vitesse = () => '<p class="small muted">Une voiture roule à 80 km/h. Fais glisser la durée : chaque heure ajoute 80 km.</p>' + dynHtml("vitesse");
})();




(function () {
const R2 = {
litelab: ["Écrire une expression littérale", "Une lettre remplace un nombre qu'on ne connaît pas, ou n'importe quel nombre.",
"Le début de la phrase donne l'opération qu'on fait en dernier, donc la forme de l'expression. « Le triple de la somme de x et 5 » commence par « le triple de » : on fait d'abord la somme, puis on la triple, c'est \\(3(x + 5)\\). « La somme du triple de x et de 5 » commence par « la somme » : on triple d'abord x, puis on ajoute 5, c'est \\(3x + 5\\). Avec \\(n\\) entier : \\(2n\\) est pair, \\(2n + 1\\) est impair, \\(n\\) et \\(n + 1\\) sont consécutifs.",
["Le double de \\(x\\), diminué de 7 : \\(2x - 7\\).", "Le carré de la somme de \\(a\\) et \\(b\\) : \\((a + b)^2\\).", "Périmètre d'un rectangle \\(x\\) sur \\(x + 3\\) : \\(2x + 2(x + 3) = 4x + 6\\)."],
"Sans parenthèses, la multiplication passe avant l'addition : \\(3x + 5\\) n'est pas \\(3(x + 5)\\)."],
valnum: ["Calculer la valeur d'une expression", "Remplacer une lettre par un nombre, c'est substituer.",
"On remplace chaque lettre par sa valeur, entre parenthèses si elle est négative. Puis on respecte les priorités : puissances, puis multiplications et divisions, puis additions et soustractions.",
["\\(3x^2 - 2x\\) pour \\(x = -2\\) : \\(3 \\cdot (-2)^2 - 2 \\cdot (-2) = 12 + 4 = 16\\).", "\\(a^2 - 3ab\\) pour \\(a = -1\\), \\(b = 2\\) : \\(1 + 6 = 7\\)."],
"\\((-2)^2 = 4\\), mais \\(-2^2 = -4\\) : sans parenthèses, le carré ne porte que sur 2."],
reduire: ["Réduire une expression", "Réduire, c'est regrouper les termes semblables.",
"Deux termes sont semblables s'ils ont exactement la même partie littérale (mêmes lettres, mêmes exposants). On additionne leurs coefficients. On ordonne ensuite du plus grand exposant au plus petit.",
["\\(5x + 3 - 2x + 7 = 3x + 10\\).", "\\(3x^2 - 5x + 2x^2 + 7x = 5x^2 + 2x\\).", "\\(2xy + 3x - xy = xy + 3x\\)."],
"\\(x\\) et \\(x^2\\) ne sont pas semblables : \\(3x + 2x^2\\) ne se réduit pas, et \\(x^2 + x^2 = 2x^2\\) (pas \\(x^4\\))."],
monomes: ["Multiplier des monômes", "Un monôme est un produit d'un nombre (le coefficient) et de lettres.",
"Pour multiplier des monômes, on multiplie les coefficients entre eux, puis les lettres entre elles : pour une même lettre, on additionne les exposants. Une lettre sans exposant a l'exposant 1. Pour une puissance, chaque facteur est élevé à cette puissance.",
["\\(3x \\cdot 4x = 12x^2\\).", "\\(2x^3 \\cdot 5x^2 = 10x^5\\).", "\\((-3x^2)^2 = 9x^4\\)."],
"On additionne les exposants quand on multiplie : \\(x^2 \\cdot x^3 = x^5\\), pas \\(x^6\\)."],
parenth: ["Supprimer des parenthèses", "Le signe devant une parenthèse décide de ce qui arrive aux termes à l'intérieur.",
"Précédée de « + », une parenthèse disparaît sans rien changer. Précédée de « − », elle disparaît et chaque terme à l'intérieur change de signe. Avec des crochets, on commence par l'intérieur.",
["\\(x + (3 - 2x) = x + 3 - 2x = -x + 3\\).", "\\(x - (3 - 2x) = x - 3 + 2x = 3x - 3\\).", "\\(-(4x - 7 + y) = -4x + 7 - y\\)."],
"Le « − » change le signe de <b>tous</b> les termes, pas seulement du premier."],
distrib: ["Développer", "Développer, c'est transformer un produit en somme.",
"Simple distributivité : \\(k(a + b) = ka + kb\\). Double distributivité : chaque terme de la première parenthèse multiplie chaque terme de la deuxième, \\((a + b)(c + d) = ac + ad + bc + bd\\). On réduit ensuite.",
["\\(3(2x - 5) = 6x - 15\\).", "\\((x + 2)(x - 5) = x^2 - 5x + 2x - 10 = x^2 - 3x - 10\\).", "\\(2x(4x^2 + x - 3) = 8x^3 + 2x^2 - 6x\\)."],
"Dans \\((x + 2)(x - 5)\\), il y a 4 produits : n'oublie pas les produits « croisés »."],
idrem: ["Identités remarquables", "Trois produits reviennent si souvent qu'on les connaît par cœur.",
"\\((a + b)^2 = a^2 + 2ab + b^2\\). \\((a - b)^2 = a^2 - 2ab + b^2\\). \\((a + b)(a - b) = a^2 - b^2\\). Le terme du milieu, \\(2ab\\), s'appelle le double produit.",
["\\((x + 3)^2 = x^2 + 6x + 9\\).", "\\((2x - 5)^2 = 4x^2 - 20x + 25\\).", "\\((x + 4)(x - 4) = x^2 - 16\\)."],
"\\((x + 3)^2\\) n'est pas \\(x^2 + 9\\) : il manque le double produit \\(6x\\)."],
factor: ["Factoriser", "Factoriser, c'est transformer une somme en produit : le contraire de développer.",
"Mise en évidence : on cherche le facteur commun (nombre, lettre ou parenthèse) et on l'écrit devant, \\(ka + kb = k(a + b)\\). Sinon, on reconnaît une identité : \\(a^2 - b^2 = (a - b)(a + b)\\), \\(a^2 + 2ab + b^2 = (a + b)^2\\). Factoriser au maximum : on continue tant qu'un facteur se factorise encore. On vérifie toujours en développant.",
["\\(6x + 9 = 3(2x + 3)\\).", "\\(x^2 - 25 = (x - 5)(x + 5)\\).", "\\(2x^2 - 8 = 2(x^2 - 4) = 2(x - 2)(x + 2)\\)."],
"Dans \\(3x(2x + 1) - (2x + 1)\\), le deuxième terme vaut \\(-1 \\cdot (2x + 1)\\) : il reste \\(-1\\), donc \\((2x + 1)(3x - 1)\\)."],
};
for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = (n) => String(n).split("").map((d) => SUP[+d]).join("");
const nb = (v) => String(+(+v).toFixed(3)).replace(".", ",").replace("-", "−");
const term = (c, l, first) => { const s = c < 0 ? (first ? "−" : " − ") : first ? "" : " + "; const a = Math.abs(c); return s + (l ? (a === 1 ? "" : a) + l : a); };
const poly = (ts) => { const f = ts.filter(([c]) => c !== 0); return f.length ? f.map(([c, l], i) => term(c, l, i === 0)).join("") : "0"; };

Object.assign(ACTIVE, {

litelab: {

retiens: { regle: "Le début de la phrase donne l'opération qu'on fait en dernier, donc la forme de l'expression. « Le triple de la somme de x et 5 » : on fait d'abord la somme, puis on la triple, c'est \\(3(x + 5)\\). « La somme du triple de x et de 5 » : on triple d'abord x, puis on ajoute 5, c'est \\(3x + 5\\).", exemple: ["Machine A « × 3, puis + 5 » : \\(3x + 5\\) ; 5 donne 20.", "Machine B « + 5, puis × 3 » : \\(3(x + 5) = 3x + 15\\) ; 5 donne 30.", "Toujours \\(B - A = 3x + 15 - (3x + 5) = 10\\)."] },
predict: { q: "« Le triple de la somme de x et 5 » s'écrit…", choices: ["3x + 5", "3(x + 5)"], good: 1, why: "La phrase commence par « le triple de… » : c'est l'opération qu'on fait en dernier. On calcule d'abord la somme x + 5, puis on la triple. Il faut des parenthèses." },
defis: ["Voici la machine A : « × 3, puis + 5 ». Trouve le nombre qui donne 20.", "Voici la machine B : « + 5, puis × 3 ». Trouve le nombre qui donne 30.", "Compare les deux machines : essaie trois nombres. Que vaut toujours B − A ?"],
play(box, onWin) {
let n = 2, step = 0; const seen = new Set();

const draw = () => {
const A = 3 * n + 5, B = 3 * (n + 5);
const mA = `<div class="act-out"><b>Machine A</b> <span class="small muted">(× 3, puis + 5)</span><br>3 · ${nb(n)} + 5 = <b>${nb(A)}</b></div>`;
const mB = `<div class="act-out"><b>Machine B</b> <span class="small muted">(+ 5, puis × 3)</span><br>(${nb(n)} + 5) · 3 = <b>${nb(B)}</b></div>`;
const body = step === 0 ? mA + '<div class="small muted">La machine A s\'écrit 3n + 5.</div>'
: step === 1 ? mB + '<div class="small muted">Nouvelle machine : on ajoute 5 <b>d\'abord</b>. Elle s\'écrit 3(n + 5).</div>'
: mA + mB + `<div class="act-out">B − A = ${nb(B)} − ${nb(A)} = <b>${nb(B - A)}</b></div><div class="small muted">Essais : ${seen.size} sur 3</div>`;
box.innerHTML = actStepper("Nombre choisi", n, "n") + body;
actBindStepper(box, "n", () => n, (v) => { n = v; seen.add(v); draw(); check(); }, -10, 20);
};
const check = () => {
if (step === 0 && 3 * n + 5 === 20) { onWin(0, "n = 5 : 3 · 5 + 5 = 20."); step = 1; seen.clear(); draw(); }
else if (step === 1 && 3 * (n + 5) === 30) { onWin(1, "n = 5 : (5 + 5) · 3 = 30. Même nombre de départ que pour A, mais pas le même résultat : l'ordre des opérations compte."); step = 2; seen.clear(); draw(); }
else if (step === 2 && seen.size >= 3) { onWin(2, "B − A vaut toujours 10 : 3(n + 5) − (3n + 5) = 3n + 15 − 3n − 5 = 10. Le calcul littéral le prouve pour tous les nombres."); step = 3; }
};
draw();
},
},

valnum: {

retiens: { exemple: ["\\(2x^2 - 3x\\) pour \\(x = 3\\) : \\(2 \\cdot 9 - 9 = 9\\).", "Pour \\(x = -2\\) : \\(2 \\cdot (-2)^2 - 3 \\cdot (-2) = 8 + 6 = 14\\).", "Pour \\(x = 1{,}5\\) : \\(2 \\cdot 2{,}25 - 4{,}5 = 0\\)."] },
predict: { q: "Combien vaut x² pour x = −3 ?", choices: ["−9", "9", "−6"], good: 1, why: "(−3)² = (−3) · (−3) = 9 : le carré d'un nombre négatif est positif." },
defis: ["Trouve un nombre x qui donne 9 pour 2x² − 3x.", "Trouve un nombre négatif x qui donne 14.", "Trouve un nombre x non nul qui donne 0."],
play(box, onWin) {
let k = 2, step = 0; const x = () => k / 2;
const draw = () => {
const v = 2 * x() * x() - 3 * x();
box.innerHTML = actStepper("x", nb(x()), "x") + `<div class="act-out">2 · (${nb(x())})² − 3 · (${nb(x())}) = 2 · ${nb(x() * x())} ${-3 * x() < 0 ? "−" : "+"} ${nb(Math.abs(3 * x()))} = <b>${nb(v)}</b></div>`;
box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { k = Math.max(-8, Math.min(8, k + +b.dataset.d)); draw(); check(); }));
$hint(box, "Chaque clic change x de 0,5.");
};
const check = () => {
const v = 2 * x() * x() - 3 * x();
if (step === 0 && v === 9) { onWin(0, "x = " + nb(x()) + " : 2 · " + nb(x() * x()) + " − " + nb(3 * x()).replace("−", "(−") + (x() < 0 ? ")" : "") + " = 9."); step = 1; }
else if (step === 1 && v === 14 && x() < 0) { onWin(1, "x = −2 : 2 · 4 + 6 = 14. Le carré de −2 est positif, et −3 · (−2) = +6."); step = 2; }
else if (step === 2 && v === 0 && x() !== 0) { onWin(2, "x = 1,5 : 2 · 2,25 − 4,5 = 0."); step = 3; }
};
draw();
},
},

reduire: {
predict: { q: "3x + 2x² se réduit en…", choices: ["5x³", "5x²", "on ne peut pas réduire"], good: 2, why: "x et x² ne sont pas semblables (comme des carrés et des barres de tailles différentes) : on ne peut pas les additionner." },
defis: ["Compte les tuiles : écris 3x + 5 − x + 2 − 4 sous forme réduite.", "Même chose : 2x² + 3x − x² + x − 6.", "Et : −x² + 4x + 3x² − 7x + 1."],
play(box, onWin) {
const E = [[[3, "x"], [5, ""], [-1, "x"], [2, ""], [-4, ""]], [[2, "x²"], [3, "x"], [-1, "x²"], [1, "x"], [-6, ""]], [[-1, "x²"], [4, "x"], [3, "x²"], [-7, "x"], [1, ""]]];
let step = 0, c2 = 0, c1 = 0, c0 = 0;
const want = () => { const s = { "x²": 0, x: 0, "": 0 }; E[step].forEach(([c, l]) => (s[l] += c)); return s; };
const draw = () => {
if (step >= E.length) return;
let g = "", x0 = 6;
E[step].forEach(([c, l]) => { for (let i = 0; i < Math.abs(c); i++) { const w = l === "x²" ? 30 : l === "x" ? 30 : 12, h = l === "x²" ? 30 : 12, y = l === "x²" ? 8 : l === "x" ? 26 : 26; g += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" class="' + (c < 0 ? "f-soft" : "f-fill") + '" stroke="var(--ink)" stroke-width="1"' + (c < 0 ? ' stroke-dasharray="3 2"' : "") + "/>"; x0 += w + 3; } x0 += 8; });
box.innerHTML = `<div class="act-out">${poly(E[step])}</div>
            <svg class="fig" viewBox="0 0 ${Math.max(320, x0)} 46" role="img" aria-label="tuiles">${g}</svg>
            <div class="small muted">Grand carré = x², barre = x, petit carré = 1 ; en pointillé : à retirer.</div>
            ${actStepper("x²", c2, "c2")}${actStepper("x", c1, "c1")}${actStepper("nombre", c0, "c0")}
            <div class="act-out">Ta réponse : <b>${poly([[c2, "x²"], [c1, "x"], [c0, ""]])}</b></div>`;
actBindStepper(box, "c2", () => c2, (v) => { c2 = v; draw(); check(); }, -9, 9);
actBindStepper(box, "c1", () => c1, (v) => { c1 = v; draw(); check(); }, -9, 9);
actBindStepper(box, "c0", () => c0, (v) => { c0 = v; draw(); check(); }, -9, 9);
};
const check = () => {
const w = want();
if (c2 === w["x²"] && c1 === w.x && c0 === w[""]) {
onWin(step, poly(E[step]) + " = " + poly([[c2, "x²"], [c1, "x"], [c0, ""]]) + " : on a regroupé les tuiles de même forme.");
step++; c2 = c1 = c0 = 0; draw();
}
};
draw();
},
},

monomes: {

retiens: { regle: "Pour multiplier des puissances d'une même lettre, on additionne les exposants : \\(x^m \\cdot x^n = x^{m + n}\\), car on compte les facteurs \\(x\\).", exemple: ["\\(x^2 \\cdot x^3 = (x \\cdot x) \\cdot (x \\cdot x \\cdot x) = x^5\\).", "\\(x^3 \\cdot x^4 = x^7\\).", "\\(x^4 \\cdot x^4 = x^8\\)."] },
predict: { q: "x² · x³ = ?", choices: ["x⁶", "x⁵", "2x⁵"], good: 1, why: "x² · x³ = (x · x) · (x · x · x) : cinq facteurs x, donc x⁵. On additionne les exposants." },
defis: ["Obtiens x⁷ avec xᵐ · xⁿ, où m = 3.", "Obtiens x⁵ avec m = n + 1.", "Obtiens x⁸ avec m = n."],
play(box, onWin) {
let m = 2, n = 2, step = 0;
const draw = () => {
const xs = (k, cls) => Array.from({ length: k }, () => `<span class="act-prime ${cls}" style="min-width:30px;height:30px">x</span>`).join("");
box.innerHTML = actStepper("m", m, "m") + actStepper("n", n, "n") + `<div class="act-lamps">${xs(m, "")}<b style="align-self:center">·</b>${xs(n, "")}</div>
            <div class="act-out">x${sup(m)} · x${sup(n)} = x${sup(m + n)} &nbsp;(${m} + ${n} = ${m + n} facteurs x)</div>`;
actBindStepper(box, "m", () => m, (v) => { m = v; draw(); check(); }, 1, 8);
actBindStepper(box, "n", () => n, (v) => { n = v; draw(); check(); }, 1, 8);
};
const check = () => {
if (step === 0 && m === 3 && m + n === 7) { onWin(0, "x³ · x⁴ = x⁷ : 3 + 4 = 7."); step = 1; }
else if (step === 1 && m === n + 1 && m + n === 5) { onWin(1, "x³ · x² = x⁵."); step = 2; }
else if (step === 2 && m === n && m + n === 8) { onWin(2, "x⁴ · x⁴ = x⁸, c'est aussi (x⁴)²."); step = 3; }
};
draw();
},
},

parenth: {

retiens: { regle: "Précédée de « + », une parenthèse disparaît sans rien changer. Précédée de « − », elle disparaît et chaque terme à l'intérieur change de signe.", exemple: ["\\(7 - (2x - 5 + y) = 7 - 2x + 5 - y\\).", "\\(4x + (3 - x) = 4x + 3 - x = 3x + 3\\).", "\\(-(-a + 2b - 6) = a - 2b + 6\\)."] },
predict: { q: "x − (3 − 2x) = ?", choices: ["x − 3 − 2x", "x − 3 + 2x"], good: 1, why: "Le « − » devant la parenthèse change le signe de chaque terme : −(3 − 2x) = −3 + 2x." },
defis: ["Enlève la parenthèse de 7 − (2x − 5 + y) : touche les termes dont le signe change.", "Même chose avec 4x + (3 − x).", "Et avec −(−a + 2b − 6)."],
play(box, onWin) {
const E = [{ head: "7 − (", terms: [2, -5, 1], lit: ["x", "", "y"], minus: true }, { head: "4x + (", terms: [3, -1], lit: ["", "x"], minus: false }, { head: "−(", terms: [-1, 2, -6], lit: ["a", "b", ""], minus: true }];
let step = 0, flip = [];
const draw = () => {
if (step >= E.length) return;
const e = E[step]; if (flip.length !== e.terms.length) flip = e.terms.map(() => false);
const shown = e.terms.map((c, i) => (flip[i] ? -c : c)), pre = e.head.replace(/[−+]\s*\($/, "").trim();
box.innerHTML = `<div class="act-out">${e.head}${poly(e.terms.map((c, i) => [c, e.lit[i]]))})</div>
            <div class="small muted">Sans parenthèse : touche un terme pour changer son signe.</div>
            <div class="act-expr">${pre ? `<span class="act-op">${pre}</span>` : ""}${shown.map((c, i) => `<button type="button" class="act-num" data-i="${i}">${term(c, e.lit[i], i === 0 && !pre).trim()}</button>`).join("")}</div>
            <button type="button" class="btn-primary small" id="actok">C'est bon</button>`;
box.querySelectorAll(".act-num").forEach((b) => (b.onclick = () => { flip[+b.dataset.i] = !flip[+b.dataset.i]; draw(); }));
box.querySelector("#actok").onclick = check;
};
const check = () => {
const e = E[step], ok = flip.every((f) => f === e.minus);
if (ok) { onWin(step, e.minus ? "Précédée de « − », la parenthèse change le signe de <b>tous</b> les termes." : "Précédée de « + », rien ne change : on enlève simplement la parenthèse."); step++; flip = []; draw(); }
else $hint(box, e.minus ? "Un « − » devant la parenthèse change le signe de chaque terme : vérifie-les tous." : "Un « + » devant la parenthèse ne change aucun signe.");
};
draw();
},
},

distrib: {
predict: { q: "3(2x + 5) = ?", choices: ["6x + 5", "6x + 15", "5x + 8"], good: 1, why: "Le 3 multiplie les deux termes : 3 · 2x = 6x et 3 · 5 = 15. Comme l'aire d'un rectangle coupé en deux." },
defis: ["Règle le rectangle pour obtenir 6x + 15.", "Obtiens 12x + 8 avec une largeur de 4.", "Obtiens 10x + 10."],
play(box, onWin) {
let k = 2, a = 1, b = 3, step = 0;
const draw = () => {
const W1 = 40 + a * 30, W2 = 12 + b * 10, H = 20 + k * 12, x0 = 30;
let g = '<rect x="' + x0 + '" y="10" width="' + W1 + '" height="' + H + '" class="f-fill" opacity="0.5" stroke="var(--ink)"/><rect x="' + (x0 + W1) + '" y="10" width="' + W2 + '" height="' + H + '" class="f-soft" stroke="var(--ink)"/>';
g += '<text x="' + (x0 + W1 / 2) + '" y="' + (16 + H / 2) + '" class="f-txt" text-anchor="middle" font-size="13">' + k * a + 'x</text><text x="' + (x0 + W1 + W2 / 2) + '" y="' + (16 + H / 2) + '" class="f-txt" text-anchor="middle" font-size="13">' + k * b + "</text>";
g += '<text x="' + (x0 + W1 / 2) + '" y="' + (H + 26) + '" class="f-txt" text-anchor="middle" font-size="12">' + (a === 1 ? "" : a) + 'x</text><text x="' + (x0 + W1 + W2 / 2) + '" y="' + (H + 26) + '" class="f-txt" text-anchor="middle" font-size="12">' + b + '</text><text x="' + (x0 - 8) + '" y="' + (14 + H / 2) + '" class="f-txt" text-anchor="end" font-size="12">' + k + "</text>";
box.innerHTML = `<svg class="fig" viewBox="0 0 ${Math.max(320, x0 + W1 + W2 + 10)} ${H + 34}" role="img" aria-label="rectangle">${g}</svg>
            ${actStepper("largeur", k, "k")}${actStepper("coefficient de x", a, "a")}${actStepper("nombre", b, "b")}
            <div class="act-out">${k}(${a === 1 ? "" : a}x + ${b}) = <b>${k * a}x + ${k * b}</b></div>`;
actBindStepper(box, "k", () => k, (v) => { k = v; draw(); check(); }, 1, 6);
actBindStepper(box, "a", () => a, (v) => { a = v; draw(); check(); }, 1, 5);
actBindStepper(box, "b", () => b, (v) => { b = v; draw(); check(); }, 1, 9);
};
const check = () => {
if (step === 0 && k * a === 6 && k * b === 15) { onWin(0, k + "(" + (a === 1 ? "" : a) + "x + " + b + ") = 6x + 15 : chaque morceau du rectangle est un produit."); step = 1; }
else if (step === 1 && k === 4 && k * a === 12 && k * b === 8) { onWin(1, "4(3x + 2) = 12x + 8."); step = 2; }
else if (step === 2 && k * a === 10 && k * b === 10) { onWin(2, k + "(" + (a === 1 ? "" : a) + "x + " + b + ") = 10x + 10. Il y a plusieurs réponses : 5(2x + 2), 2(5x + 5)…"); step = 3; }
};
draw();
},
},

idrem: {
predict: { q: "(x + 3)² = ?", choices: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9"], good: 1, why: "(x + 3)² = (x + 3)(x + 3) : 4 morceaux, x², 3x, 3x et 9. Le terme du milieu est le double produit 6x." },
defis: ["Règle a pour obtenir x² + 10x + 25.", "Trouve a pour que le double produit soit 14x.", "Trouve a pour que le dernier terme soit 36."],
play(box, onWin) {
let a = 2, step = 0;
const draw = () => {
const X = 90, A = 14 * a, o = 20;
let g = '<rect x="' + o + '" y="' + o + '" width="' + X + '" height="' + X + '" class="f-fill" opacity="0.55" stroke="var(--ink)"/>';
g += '<rect x="' + (o + X) + '" y="' + o + '" width="' + A + '" height="' + X + '" class="f-soft" stroke="var(--ink)"/><rect x="' + o + '" y="' + (o + X) + '" width="' + X + '" height="' + A + '" class="f-soft" stroke="var(--ink)"/>';
g += '<rect x="' + (o + X) + '" y="' + (o + X) + '" width="' + A + '" height="' + A + '" class="f-fill" stroke="var(--ink)"/>';
g += '<text x="' + (o + X / 2) + '" y="' + (o + X / 2 + 5) + '" class="f-txt" text-anchor="middle" font-size="14">x²</text>';
g += '<text x="' + (o + X + A / 2) + '" y="' + (o + X / 2 + 5) + '" class="f-txt" text-anchor="middle" font-size="11">' + a + 'x</text><text x="' + (o + X / 2) + '" y="' + (o + X + A / 2 + 4) + '" class="f-txt" text-anchor="middle" font-size="11">' + a + "x</text>";
g += '<text x="' + (o + X / 2) + '" y="14" class="f-txt" text-anchor="middle" font-size="12">x</text><text x="' + (o + X + A / 2) + '" y="14" class="f-txt" text-anchor="middle" font-size="12">' + a + "</text>";
box.innerHTML = `<svg class="fig" viewBox="0 0 320 ${o + X + A + 10}" role="img" aria-label="carré de côté x + ${a}">${g}</svg>
            ${actStepper("a", a, "a")}<div class="act-out">(x + ${a})² = x² + ${a}x + ${a}x + ${a * a} = <b>x² + ${2 * a}x + ${a * a}</b></div>`;
actBindStepper(box, "a", () => a, (v) => { a = v; draw(); check(); }, 1, 9);
};
const check = () => {
if (step === 0 && a === 5) { onWin(0, "(x + 5)² = x² + 10x + 25 : deux rectangles de 5x."); step = 1; }
else if (step === 1 && a === 7) { onWin(1, "2 · 7 = 14 : le double produit est 2 · x · 7."); step = 2; }
else if (step === 2 && a === 6) { onWin(2, "6² = 36 : le dernier terme est le carré de a."); step = 3; }
};
draw();
},
},

factor: {
predict: { q: "Factoriser 10x + 15, c'est l'écrire…", choices: ["comme un produit", "comme une somme plus courte"], good: 0, why: "Factoriser = écrire un produit : 10x + 15 = 5(2x + 3). C'est l'inverse de développer." },
defis: ["Factorise 6x + 9 : choisis la largeur du rectangle.", "Factorise 10x − 15.", "Factorise 12x + 18 au maximum."],
play(box, onWin) {
const E = [[6, 9], [10, -15], [12, 18]];
let k = 2, step = 0;
const draw = () => {
if (step >= E.length) return;
const [p, q] = E[step], okDiv = p % k === 0 && q % k === 0;

const L1 = Math.abs(p) / k, L2 = Math.abs(q) / k, W = 300, sc = Math.min(22, 230 / (L1 * 2 + L2 + 0.001)), hk = Math.min(90, 14 * k), w1 = okDiv ? 2 * L1 * sc : 150, w2 = okDiv ? L2 * sc : 70, x0 = 40, y0 = 14;
const svg = `<svg class="fig" viewBox="0 0 ${W} ${hk + 48}" role="img" aria-label="rectangle de largeur ${k}">
            <rect x="${x0}" y="${y0}" width="${w1}" height="${hk}" class="f-soft" stroke="var(--ink)" stroke-width="1.5"/>
            <rect x="${x0 + w1}" y="${y0}" width="${w2}" height="${hk}" class="f-soft" stroke="var(--ink)" stroke-width="1.5"${q < 0 ? ' stroke-dasharray="4 3"' : ""}/>
            <text x="${x0 + w1 / 2}" y="${y0 + hk / 2 + 5}" class="f-txt" text-anchor="middle" font-size="14">${okDiv ? p + "x" : "?"}</text>
            <text x="${x0 + w1 + w2 / 2}" y="${y0 + hk / 2 + 5}" class="f-txt" text-anchor="middle" font-size="14">${okDiv ? (q < 0 ? "−" + Math.abs(q) : q) : "?"}</text>
            <text x="${x0 - 8}" y="${y0 + hk / 2 + 5}" class="f-accent f-txt" text-anchor="end" font-size="15" font-weight="700">${k}</text>
            <text x="${x0 + w1 / 2}" y="${y0 + hk + 22}" class="f-txt" text-anchor="middle" font-size="13">${okDiv ? (L1 === 1 ? "" : L1) + "x" : "?"}</text>
            <text x="${x0 + w1 + w2 / 2}" y="${y0 + hk + 22}" class="f-txt" text-anchor="middle" font-size="13">${okDiv ? (q < 0 ? "−" : "") + L2 : "?"}</text></svg>`;
box.innerHTML = `<div class="act-out">Aire : <b>${poly([[p, "x"], [q, ""]])}</b></div><div class="small muted">On range l'aire dans un rectangle de largeur ${k} : que mesure sa longueur ?${q < 0 ? " (partie en pointillé : aire à retirer)" : ""}</div>${svg}${actStepper("largeur (facteur)", k, "k")}
            <div class="act-out">${okDiv ? `${p}x ${q < 0 ? "−" : "+"} ${Math.abs(q)} = <b>${k}(${poly([[p / k, "x"], [q / k, ""]])})</b>` : `${k} ne divise pas ${p} et ${Math.abs(q)} : pas de rectangle entier.`}</div>
            <button type="button" class="btn-primary small" id="actok">C'est factorisé</button>`;
actBindStepper(box, "k", () => k, (v) => { k = v; draw(); }, 1, 12);
box.querySelector("#actok").onclick = check;
};
const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
const check = () => {
const [p, q] = E[step], G = g(p, q);
if (p % k || q % k || k === 1) { $hint(box, "Choisis un facteur qui divise les deux nombres (et pas 1)."); return; }
if (k !== G) { $hint(box, k + "(" + poly([[p / k, "x"], [q / k, ""]]) + ") est factorisé, mais pas au maximum : il reste un facteur commun dans la parenthèse."); return; }
onWin(step, p + "x " + (q < 0 ? "−" : "+") + " " + Math.abs(q) + " = " + G + "(" + poly([[p / G, "x"], [q / G, ""]]) + ") : " + G + " est le plus grand facteur commun."); step++; k = 2; draw();
};
draw();
},
},
});
})();




(function () {
const R2 = {
eq1: ["Équations du 1er degré", "Résoudre, c'est trouver tous les nombres qui rendent l'égalité vraie.",
"Une équation est une balance : on peut faire la même opération des deux côtés (ajouter, soustraire, multiplier ou diviser par un nombre non nul) sans changer ses solutions. On regroupe les \\(x\\) d'un côté et les nombres de l'autre, puis on divise par le coefficient de \\(x\\), avec son signe. On contrôle en remplaçant \\(x\\) dans l'équation de départ.",
["\\(6x - 7 = 2x + 5\\), \\(4x = 12\\), \\(x = 3\\). Contrôle : \\(11 = 11\\).", "\\(7 - 2x = 15\\), \\(-2x = 8\\), \\(x = -4\\).", "\\(4x + 1 = 2x + 8\\), \\(2x = 7\\), \\(x = \\frac{7}{2}\\) : la solution peut être une fraction."],
"Un terme qui « change de côté » change de signe : c'est parce qu'on l'a soustrait (ou ajouté) des deux côtés."],
eqfrac: ["Parenthèses et fractions", "On se ramène à une équation sans parenthèses ni fractions.",
"Parenthèses : on développe (ou on divise d'abord les deux membres, si c'est plus simple). Un « − » devant une parenthèse change le signe de chaque terme. Fractions : on multiplie <b>chaque terme</b> des deux membres par le plus petit dénominateur commun ; un « − » devant une fraction porte sur tout son numérateur. Deux fractions égales : produit en croix.",
["\\(\\frac{x}{2} + \\frac{x}{3} = 5\\) ; fois 6 : \\(3x + 2x = 30\\), \\(x = 6\\).", "\\(\\frac{x + 1}{2} - \\frac{x - 3}{3} = 2\\) ; fois 6 : \\(3(x + 1) - 2(x - 3) = 12\\), \\(x = 3\\).", "\\(\\frac{2x - 1}{3} = \\frac{x + 4}{2}\\) ; en croix : \\(2(2x - 1) = 3(x + 4)\\), \\(x = 14\\)."],
"Quand on multiplie par 6, le nombre seul du membre de droite est aussi multiplié par 6."],
eqspec: ["Aucune solution, tous les nombres", "Une équation du 1er degré n'a pas toujours une seule solution.",
"Si, en regroupant, les \\(x\\) disparaissent, il reste une égalité entre deux nombres. Fausse (\\(3 = 5\\)) : aucun nombre ne convient, \\(S = \\varnothing\\). Vraie (\\(0 = 0\\)) : tous les nombres conviennent, \\(S = \\mathbb{R}\\). Si les \\(x\\) ne disparaissent pas, il y a une seule solution, qui peut être \\(0\\).",
["\\(2x + 3 = 2x + 5\\) donne \\(3 = 5\\) : faux, aucune solution.", "\\(3(x + 2) = 3x + 6\\) donne \\(0 = 0\\) : vrai, tous les nombres.", "\\(5x + 2 = 3x + 2\\) donne \\(2x = 0\\), \\(x = 0\\) : une solution."],
"« \\(x = 0\\) » est une solution ; « aucune solution » est tout autre chose."],
formule: ["Transformer une formule", "Isoler une lettre, c'est résoudre une équation dont cette lettre est l'inconnue.",
"Les autres lettres se traitent comme des nombres. On défait les opérations qui entourent la lettre cherchée, de l'extérieur vers l'intérieur, en faisant la même opération des deux côtés. Si la lettre est au carré et représente une grandeur positive, on termine par une racine carrée.",
["\\(v = \\frac{d}{t}\\), \\(vt = d\\), \\(t = \\frac{d}{v}\\).", "\\(A = \\frac{(B + b)h}{2}\\), \\(B + b = \\frac{2A}{h}\\), \\(B = \\frac{2A}{h} - b\\).", "\\(A = \\pi r^2\\), \\(r^2 = \\frac{A}{\\pi}\\), \\(r = \\sqrt{\\frac{A}{\\pi}}\\)."],
"Dans \\(v = u + at\\), on soustrait \\(u\\) <b>avant</b> de diviser par \\(a\\) : \\(t = \\frac{v - u}{a}\\)."],
probeq: ["Mettre un problème en équation", "L'algèbre traduit un énoncé en une équation qu'on sait résoudre.",
"1. Lire et repérer ce qu'on cherche. 2. Choisir l'inconnue et écrire ce qu'elle représente. 3. Traduire l'énoncé en équation (un dessin ou un tableau aide). 4. Résoudre. 5. Vérifier dans l'énoncé, pas seulement dans l'équation. 6. Répondre par une phrase.",
["Trois entiers consécutifs de somme 48 : \\(n + (n + 1) + (n + 2) = 48\\), \\(n = 15\\).", "Prix après 20 % de réduction : 300 CHF, donc \\(0{,}8x = 300\\), \\(x = 375\\) CHF.", "Notes 4 ; 4,5 ; 5 : pour 5 de moyenne avec une 4e note, \\(\\frac{13{,}5 + x}{4} = 5\\), \\(x = 6{,}5\\) : impossible !"],
"Une solution de l'équation peut ne pas convenir au problème (note supérieure à 6, nombre d'objets non entier, âge négatif)."],
eq2fact: ["Résoudre en factorisant", "Beaucoup d'équations du 2e degré se résolvent sans formule.",
"Méthode directe : \\(x^2 = a\\) a deux solutions \\(\\pm\\sqrt{a}\\) si \\(a > 0\\), une (0) si \\(a = 0\\), aucune si \\(a < 0\\). Sinon : on ramène tout à gauche (\\(\\ldots = 0\\)), on factorise (mise en évidence, identité remarquable, trinôme) et on annule chaque facteur.",
["\\(4x^2 = 9\\), \\(x = \\pm\\frac{3}{2}\\).", "\\(x^2 = 5x\\), \\(x(x - 5) = 0\\) : \\(x = 0\\) ou \\(x = 5\\).", "\\(x^2 + 4x = 21\\), \\((x + 7)(x - 3) = 0\\) : \\(x = -7\\) ou \\(x = 3\\)."],
"Ne divise jamais par \\(x\\) : tu perdrais la solution \\(x = 0\\)."],
eq2: ["Le produit nul", "Un produit vaut zéro si et seulement si l'un de ses facteurs vaut zéro.",
"\\(A \\cdot B = 0 \\iff A = 0\\) ou \\(B = 0\\). On écrit l'équation sous forme « produit \\(= 0\\) », puis on résout chaque facteur \\(= 0\\). Un facteur qui ne s'annule jamais (\\(3\\), \\(x^2 + 1\\)) ne donne pas de solution.",
["\\((x - 2)(x + 5) = 0\\) : \\(x = 2\\) ou \\(x = -5\\).", "\\((3x - 1)(x + 4)x = 0\\) : trois solutions, \\(\\frac{1}{3}\\), \\(-4\\) et \\(0\\).", "\\((x - 2)(x + 3) = 6\\) : on développe d'abord, \\(x^2 + x - 12 = 0\\), puis \\((x + 4)(x - 3) = 0\\)."],
"Seul 0 a cette propriété : \\((x - 2)(x + 3) = 6\\) ne dit pas que \\(x - 2 = 6\\)."],
eq2disc: ["La formule du 2e degré", "Une méthode qui marche pour toute équation \\(ax^2 + bx + c = 0\\).",
"On calcule le discriminant \\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\) : deux solutions \\(x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}\\). Si \\(\\Delta = 0\\) : une solution \\(x = \\frac{-b}{2a}\\). Si \\(\\Delta < 0\\) : aucune solution réelle. La somme des solutions vaut \\(-\\frac{b}{a}\\), leur produit \\(\\frac{c}{a}\\).",
["\\(5x^2 - 4x - 1 = 0\\) : \\(\\Delta = 36\\), \\(x = \\frac{4 \\pm 6}{10}\\), soit \\(1\\) ou \\(-\\frac{1}{5}\\).", "\\(x^2 - 2x + 1 = 0\\) : \\(\\Delta = 0\\), \\(x = 1\\).", "\\(x^2 - 2x - 1 = 0\\) : \\(\\Delta = 8\\), \\(x = 1 \\pm \\sqrt{2}\\)."],
"On divise par \\(2a\\), et le numérateur commence par \\(-b\\) : si \\(b = -4\\), \\(-b = 4\\)."],
probeq2: ["Problèmes du 2e degré", "Certains problèmes mènent à une équation qui contient \\(x^2\\).",
"On pose l'inconnue, on écrit l'équation (aire, Pythagore, produit…), on la ramène à \\(ax^2 + bx + c = 0\\) et on la résout. Puis on garde seulement les solutions qui ont un sens : une longueur ou une durée est positive, une largeur d'allée ne dépasse pas le jardin.",
["Rectangle de largeur \\(x\\), longueur \\(x + 3\\), aire 40 : \\(x^2 + 3x - 40 = 0\\), \\(x = 5\\) (on écarte \\(-8\\)).", "Deux entiers consécutifs de produit 72 : \\(n(n + 1) = 72\\), \\(n = 8\\)."],
"L'équation a souvent deux solutions ; le problème n'en garde parfois qu'une."],
eq3: ["Équations de degré 3", "On se ramène à un produit nul.",
"On ramène tout à gauche, on met en évidence \\(x\\) (ou \\(x^2\\), ou un groupe), on factorise ce qui reste, puis on annule chaque facteur. Une équation de degré 3 a au plus trois solutions.",
["\\(x^3 - 9x = 0\\), \\(x(x - 3)(x + 3) = 0\\) : \\(-3\\), \\(0\\), \\(3\\).", "\\(x^3 - 7x^2 + 12x = 0\\), \\(x(x - 3)(x - 4) = 0\\).", "\\(x^3 + 2x^2 - 9x - 18 = (x + 2)(x^2 - 9)\\) : \\(-3\\), \\(-2\\), \\(3\\)."],
"Diviser par \\(x\\) fait perdre la solution \\(x = 0\\)."],
bicarre: ["Équations bicarrées", "Une équation en \\(x^4\\) et \\(x^2\\) est du 2e degré « déguisée ».",
"On pose \\(X = x^2\\), on résout \\(aX^2 + bX + c = 0\\), puis on revient à \\(x\\) : chaque \\(X > 0\\) donne deux solutions \\(\\pm\\sqrt{X}\\), \\(X = 0\\) donne \\(0\\), et \\(X < 0\\) n'en donne aucune.",
["\\(x^4 - 5x^2 + 4 = 0\\) : \\(X = 1\\) ou \\(X = 4\\), donc \\(x = \\pm 1\\) ou \\(x = \\pm 2\\).", "\\(x^4 + 3x^2 - 4 = 0\\) : \\(X = 1\\) ou \\(X = -4\\), donc \\(x = \\pm 1\\)."],
"Les solutions sont les valeurs de \\(x\\), pas celles de \\(X\\) : il faut revenir à \\(x\\)."],
eqirr: ["Équations irrationnelles", "L'inconnue est sous une racine carrée.",
"On isole la racine, on élève les deux membres au carré, on résout, puis on <b>vérifie</b> chaque valeur dans l'équation de départ. Élever au carré peut ajouter des solutions « parasites » : si \\(A^2 = B^2\\), on a \\(A = B\\) ou \\(A = -B\\). Une racine carrée n'est jamais négative.",
["\\(\\sqrt{x + 3} = 4\\), \\(x + 3 = 16\\), \\(x = 13\\).", "\\(\\sqrt{x + 7} = x + 1\\), au carré \\(x^2 + x - 6 = 0\\) : \\(2\\) convient, \\(-3\\) est parasite (\\(x + 1 = -2 < 0\\))."],
"\\(\\sqrt{x + 1} = -2\\) n'a aucune solution : une racine n'est jamais négative."],
};
for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);


const fr = (v) => { if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v)).replace("-", "−"); for (let d = 2; d <= 60; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return (v < 0 ? "−" : "") + Math.abs(Math.round(v * d)) + "/" + d; return String(+v.toFixed(3)).replace(".", ",").replace("-", "−"); };
const nb = (v) => String(+(+v).toFixed(3)).replace(".", ",").replace("-", "−");
const cx = (a) => { const s = fr(Math.abs(a)); return (a < 0 ? "−" : "") + (s === "1" ? "x" : s.includes("/") ? s.replace("/", "x/") : s + "x"); };
const side = (a, b) => { if (Math.abs(a) < 1e-9 && Math.abs(b) < 1e-9) return "0"; let t = Math.abs(a) > 1e-9 ? cx(a) : ""; if (Math.abs(b) > 1e-9) t += t ? (b < 0 ? " − " : " + ") + fr(Math.abs(b)) : fr(b); return t; };
const near = (u, v) => Math.abs(u - v) < 1e-9;


const balance = (E, opts = {}) => (box, onWin) => {
let step = 0, k = 1, st, hist;
const load = () => { if (step >= E.length) return; st = E[step].slice(0, 4); hist = [E[step][4] || side(st[0], st[1]) + " = " + side(st[2], st[3])]; k = 1; };
load();
const ops = [["+", "+ k"], ["-", "− k"], ["+x", "+ kx"], ["-x", "− kx"], ["*", "× k"], ["/", "÷ k"]];
const draw = () => {
if (step >= E.length) return;
const [a, b, c, d] = st, gone = near(a, 0) && near(c, 0);
box.innerHTML = `<div class="act-out">${hist.map((h, i) => (i ? "⇔ " : "") + h).join("<br>")}</div>
        ${gone ? `<div class="small muted">Plus de x : l'égalité ${fr(b)} = ${fr(d)} est ${near(b, d) ? "vraie" : "fausse"}. Que conclus-tu ?</div><div class="seg"><button type="button" data-c="none">Aucune solution</button><button type="button" data-c="all">Tous les nombres</button></div>`
: `${actStepper("k", fr(k), "k")}<div class="seg act-ops">${ops.map(([o, l]) => `<button type="button" data-o="${o}">${l.replace("kx", Math.abs(k) === 1 ? (k < 0 ? "(−x)" : "x") : (k < 0 ? "(" + fr(k) + "x)" : fr(k) + "x")).replace("k", k < 0 ? "(" + fr(k) + ")" : fr(k))}</button>`).join("")}</div><div class="small muted">La même opération s'applique aux deux membres.</div>`}`;
if (!gone) {
actBindStepper(box, "k", () => k, (v) => { k = v === 0 ? (k > 0 ? -1 : 1) : v; draw(); }, -12, 12);
box.querySelectorAll("[data-o]").forEach((el) => (el.onclick = () => {
const o = el.dataset.o;
if (o === "+") { st[1] += k; st[3] += k; } else if (o === "-") { st[1] -= k; st[3] -= k; }
else if (o === "+x") { st[0] += k; st[2] += k; } else if (o === "-x") { st[0] -= k; st[2] -= k; }
else if (o === "*") st = st.map((v) => v * k); else st = st.map((v) => v / k);
st = st.map((v) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v));
hist.push(side(st[0], st[1]) + " = " + side(st[2], st[3])); if (hist.length > 6) hist.splice(1, 1); check();
}));
} else box.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => {
const ok = (el.dataset.c === "all") === near(st[1], st[3]);
if (!ok) { $hint(box, "Relis l'égalité qui reste : est-elle vraie ou fausse ?"); return; }
onWin(step, E[step][5] || (near(st[1], st[3]) ? "0 = 0 est toujours vrai : tous les nombres sont solutions." : "L'égalité est fausse quel que soit x : aucune solution.")); step++; load(); draw();
}));
};
const check = () => {
const [a, b, c, d] = st;
const sol = (near(a, 1) && near(b, 0) && near(c, 0)) ? d : (near(c, 1) && near(d, 0) && near(a, 0)) ? b : null;
if (sol !== null) { onWin(step, E[step][5] || "Solution : x = " + fr(sol) + ".<br>Contrôle-la dans l'équation de départ."); step++; load(); }
draw();
};
draw();
};



const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = o.start, step = 0; const seen = new Set();
const draw = () => {
box.innerHTML = actStepper(o.label || "x", nb(x), "x") + o.show(x, step) + (o.note ? `<div class="small muted">${o.note}</div>` : "");
box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
};
const check = () => { if (step >= o.wins.length) return; const m = o.wins[step](x, seen); if (m) { onWin(step, m); step++; check(); } };
draw();
};


const chooser = (D) => (box, onWin) => {
let step = 0, j = 0;
const draw = () => {
if (step >= D.length) return;
const S = D[step], cur = S[j];
box.innerHTML = `<div class="act-out">${S.slice(0, j + 1).map((s) => s.f).join("<br>⇔ ")}</div><div class="small muted">${cur.ask}</div>
        <div class="seg">${cur.ch.map((c, i) => `<button type="button" data-ch="${i}">${c}</button>`).join("")}</div>`;
box.querySelectorAll("[data-ch]").forEach((el) => (el.onclick = () => {
if (+el.dataset.ch !== cur.good) { $hint(box, cur.no); return; }
j++;
if (j >= S.length - 1) { onWin(step, S[S.length - 1].f + ". " + S[S.length - 1].why); step++; j = 0; }
draw();
}));
};
draw();
};

const sq = (v) => nb(v * v);
Object.assign(ACTIVE, {
eq1: {
predict: { q: "Dans 3x + 5 = 20, on « fait passer » le 5 de l'autre côté. Que fait-on vraiment ?", choices: ["On soustrait 5 des deux côtés", "On efface le 5", "On divise par 5"], good: 0, why: "Une équation est une balance : on retire 5 des deux plateaux, 3x = 15. Le 5 ne « saute » pas : il est soustrait des deux côtés." },
defis: ["Résous 3x + 5 = 20 en choisissant k et l'opération.", "Résous 5x − 3 = 2x + 9 : commence par les x.", "Résous 7 − 2x = 15 (attention au signe de −2x)."],
play: balance([[3, 5, 0, 20], [5, -3, 2, 9], [-2, 7, 0, 15]]),
},
eqfrac: {

retiens: { regle: "Fractions : on multiplie chaque terme des deux membres par le plus petit dénominateur commun (un multiple de tous les dénominateurs). Un nombre seul est lui aussi multiplié. Il reste une équation sans fraction, qu'on résout.", exemple: ["\\(\\frac{x}{2} + \\frac{x}{3} = 5\\) ; fois 6 : \\(3x + 2x = 30\\), \\(x = 6\\).", "\\(\\frac{x}{4} - 1 = \\frac{x}{6}\\) ; fois 12 : \\(3x - 12 = 2x\\), \\(x = 12\\).", "\\(\\frac{x + 1}{2} = \\frac{x - 3}{3} + 2\\) ; fois 6 : \\(3(x + 1) = 2(x - 3) + 12\\), \\(x = 3\\)."] },
predict: { q: "Pour faire disparaître les fractions de x/2 + x/3 = 5, on multiplie les deux membres par…", choices: ["5", "6", "2 + 3"], good: 1, why: "6 est un multiple de 2 et de 3 : 6 · x/2 = 3x et 6 · x/3 = 2x. Et le 5 devient 30." },
defis: ["Résous x/2 + x/3 = 5 : multiplie d'abord par 6.", "Résous x/4 − 1 = x/6.", "Résous (x + 1)/2 = (x − 3)/3 + 2."],
play: balance([[1 / 2 + 1 / 3, 0, 0, 5, "x/2 + x/3 = 5"], [1 / 4, -1, 1 / 6, 0, "x/4 − 1 = x/6"], [1 / 2, 1 / 2, 1 / 3, 1, "(x + 1)/2 = (x − 3)/3 + 2"]]),
},
eqspec: {
predict: { q: "3x + 1 = 3x + 4 : combien de solutions ?", choices: ["Une : x = 0", "Aucune", "Une infinité"], good: 1, why: "Quel que soit x, le membre de droite vaut 3 de plus que celui de gauche : jamais égaux. Aucune solution." },
defis: ["Résous 2x + 3 = 2x + 5.", "Résous 3(x + 1) = 3x + 3.", "Résous 4x + 1 = x + 1 (attention : les x ne disparaissent pas)."],
play: balance([[2, 3, 2, 5], [3, 3, 3, 3, "3(x + 1) = 3x + 3"], [4, 1, 1, 1, "4x + 1 = x + 1", "x = 0 : c'est une vraie solution, pas « aucune solution »."]]),
},
formule: {

retiens: { regle: "Les autres lettres se traitent comme des nombres. On défait les opérations qui entourent la lettre cherchée, de l'extérieur vers l'intérieur, en faisant la même opération des deux côtés.", exemple: ["\\(P = 4c\\), \\(c = \\frac{P}{4}\\).", "\\(v = \\frac{d}{t}\\), \\(vt = d\\), \\(t = \\frac{d}{v}\\).", "\\(A = \\frac{(B + b)h}{2}\\), \\(B + b = \\frac{2A}{h}\\), \\(B = \\frac{2A}{h} - b\\)."], piege: "Dans \\(A = \\frac{(B + b)h}{2}\\), on défait d'abord \\(: 2\\) et \\(\\cdot h\\), puis on soustrait \\(b\\) en dernier." },
predict: { q: "Dans v = d/t, pour isoler t, la première opération est…", choices: ["× t des deux côtés", "÷ v des deux côtés", "− d des deux côtés"], good: 0, why: "t est au dénominateur : on le fait remonter en multipliant par t, v · t = d ; puis on divise par v." },
defis: ["Isole c dans P = 4c.", "Isole t dans v = d/t.", "Isole B dans A = (B + b) · h / 2."],
play: chooser([
[{ f: "P = 4c", ask: "Que fais-tu des deux côtés ?", ch: ["÷ 4", "− 4", "× 4"], good: 0, no: "c est multiplié par 4 : on défait une multiplication par une division." }, { f: "c = P/4", why: "On a défait « × 4 »." }],
[{ f: "v = d/t", ask: "Première opération ?", ch: ["÷ t", "× t", "− d"], good: 1, no: "t est au dénominateur : on multiplie par t pour le faire remonter." }, { f: "v · t = d", ask: "Et maintenant ?", ch: ["÷ v", "× v", "− v"], good: 0, no: "t est multiplié par v : on divise par v." }, { f: "t = d/v", why: "On défait de l'extérieur vers l'intérieur." }],
[{ f: "A = (B + b) · h / 2", ask: "Première opération ?", ch: ["− b", "× 2", "÷ h"], good: 1, no: "Commence par l'extérieur : la division par 2." }, { f: "2A = (B + b) · h", ask: "Ensuite ?", ch: ["÷ h", "− b", "÷ 2"], good: 0, no: "La parenthèse est multipliée par h : divise par h." }, { f: "2A/h = B + b", ask: "Enfin ?", ch: ["+ b", "− b", "÷ b"], good: 1, no: "On a B + b : on retire b." }, { f: "B = 2A/h − b", why: "Trois opérations défaites, dans l'ordre inverse." }],
]),
},
probeq: {

retiens: { exemple: ["Trois entiers consécutifs de somme 48 : \\(n + (n + 1) + (n + 2) = 48\\), \\(n = 15\\).", "Somme 75 : \\(3n + 3 = 75\\), \\(n = 24\\) (24, 25, 26).", "Quatre consécutifs de somme 98 : \\(4n + 6 = 98\\), \\(n = 23\\)."], piege: "Écris ce que représente l'inconnue : ici \\(n\\) est le plus petit, celui du milieu est \\(n + 1\\)." },
predict: { q: "Trois entiers consécutifs ont pour somme 36. Le plus petit est…", choices: ["12", "11", "10"], good: 1, why: "n + (n + 1) + (n + 2) = 3n + 3 = 36, donc n = 11 : 11 + 12 + 13 = 36. 12 est celui du milieu." },
defis: ["Trouve trois entiers consécutifs de somme 48.", "Trouve trois entiers consécutifs de somme 75.", "Avec 4 nombres : trouve quatre entiers consécutifs de somme 98."],
play(box, onWin) {
let n = 10, k = 3, step = 0;
const draw = () => {
const L = Array.from({ length: k }, (_, i) => n + i), S = L.reduce((a, b) => a + b, 0);
box.innerHTML = `<div class="seg">${[3, 4].map((v) => `<button type="button" data-k="${v}" aria-pressed="${v === k}">${v} nombres</button>`).join("")}</div>${actStepper("n (le plus petit)", n, "n")}
            <div class="act-out">${L.join(" + ")} = <b>${S}</b><br><span class="small muted">en écriture littérale : ${k}n + ${k === 3 ? 3 : 6} = ${k} · ${n} + ${k === 3 ? 3 : 6}</span></div>`;
actBindStepper(box, "n", () => n, (v) => { n = v; draw(); check(); }, 1, 60);
box.querySelectorAll("[data-k]").forEach((el) => (el.onclick = () => { k = +el.dataset.k; draw(); check(); }));
};
const T = [[3, 48, "3n + 3 = 48 ⇔ 3n = 45 ⇔ n = 15."], [3, 75, "3n + 3 = 75 ⇔ n = 24 : l'équation évite de tâtonner."], [4, 98, "4n + 6 = 98 ⇔ 4n = 92 ⇔ n = 23."]];
const check = () => { if (step < 3) { const [kk, S, m] = T[step]; if (k === kk && kk * n + (kk === 3 ? 3 : 6) === S) { onWin(step, m); step++; } } };
draw();
},
},
eq2fact: {

retiens: { regle: "Méthode directe : \\(x^2 = a\\) a deux solutions \\(\\pm\\sqrt{a}\\) si \\(a > 0\\). Sinon : on ramène tout à gauche (\\(\\ldots = 0\\)), on met en évidence et on annule chaque facteur.", exemple: ["\\(x^2 = 16\\), \\(x = 4\\) ou \\(x = -4\\).", "\\(x^2 = 3x\\), \\(x(x - 3) = 0\\) : \\(x = 0\\) ou \\(x = 3\\)."] },
predict: { q: "x² = 3x : combien de solutions ?", choices: ["Une : x = 3", "Deux : 0 et 3", "Aucune"], good: 1, why: "0² = 3 · 0 = 0 et 3² = 3 · 3 = 9 : deux solutions. Diviser par x aurait fait perdre x = 0." },
defis: ["Trouve un nombre x tel que x² = 3x.", "Trouves-en un autre !", "Mode x² = 16 : trouve la solution négative."],
play: hunt({ start: 1, min: -6, max: 6, show: (x, st) => st < 2
? `<div class="act-out">Équation : x² = 3x<br>Membre de gauche : x² = (${nb(x)})² = <b>${sq(x)}</b><br>Membre de droite : 3x = 3 · (${nb(x)}) = <b>${nb(3 * x)}</b><br>${x * x === 3 * x ? "<b>Égaux ✓</b>" : "Pas égaux"}</div>`
: `<div class="act-out">Nouvelle équation : x² = 16<br>x² = (${nb(x)})² = <b>${sq(x)}</b><br>${x * x === 16 ? "<b>Égal à 16 ✓</b>" : "Pas égal à 16"}</div>`, note: "Change x avec − et + ; compare les deux membres.",
wins: [(x, s) => (x * x === 3 * x ? (s.add(x), "x = " + nb(x) + " : " + sq(x) + " = " + nb(3 * x) + ".") : null), (x, s) => (x * x === 3 * x && !s.has(x) ? "Deux solutions : 0 et 3. x(x − 3) = 0." : null), (x) => (x === -4 ? "x = −4 : (−4)² = 16. x² = 16 a deux solutions, ±4." : null)] }),
},
eq2: {

retiens: { regle: "\\(A \\cdot B = 0 \\iff A = 0\\) ou \\(B = 0\\). On écrit l'équation sous forme « produit \\(= 0\\) », puis on résout chaque facteur \\(= 0\\).", exemple: ["\\((x - 2)(x + 5) = 0\\) : \\(x = 2\\) ou \\(x = -5\\).", "\\((x - 2)(x + 5) = -6\\) : on développe d'abord, \\(x^2 + 3x - 4 = 0\\), puis \\((x + 4)(x - 1) = 0\\)."] },
predict: { q: "(x − 2)(x + 5) = 0. Une solution est…", choices: ["x = −2", "x = 2", "x = 5"], good: 1, why: "Si x = 2, le premier facteur vaut 0, donc le produit vaut 0. L'autre solution est x = −5." },
defis: ["Trouve un x qui rend (x − 2)(x + 5) nul.", "Trouve l'autre.", "Trouve un x tel que (x − 2)(x + 5) = −6."],
play: hunt({ start: 0, min: -8, max: 6, show: (x) => `<div class="act-out">(${nb(x)} − 2) · (${nb(x)} + 5) = ${nb(x - 2)} · ${nb(x + 5)} = <b>${nb((x - 2) * (x + 5))}</b></div>`,
wins: [(x, s) => ((x - 2) * (x + 5) === 0 ? (s.add(x), "x = " + nb(x) + " : un facteur vaut 0, donc le produit aussi.") : null), (x, s) => ((x - 2) * (x + 5) === 0 && !s.has(x) ? "Les deux solutions : 2 et −5, une par facteur." : null), (x) => ((x - 2) * (x + 5) === -6 ? "x = " + nb(x) + " convient, mais ni x − 2 ni x + 5 ne vaut −6 : le produit nul ne marche qu'avec 0. Il faut développer : x² + 3x − 4 = 0, soit x = 1 ou x = −4." : null)] }),
},
eq2disc: {

plus: [{ d: "\\(x^2 - 4x - 12 = 0\\) : \\(\\Delta = 16 + 48 = 64\\). Avec \\(x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}\\), tape la plus grande solution.", ans: 6, ok: "x = (4 + 8) ÷ 2 = 6. Ici b = −4, donc −b = 4, et √64 = 8.", no: "−b = 4, √Δ = 8 et 2a = 2." },
{ d: "Et la plus petite solution ?", ans: -2, ok: "x = (4 − 8) ÷ 2 = −2. Vérification : 4 + 8 − 12 = 0.", no: "Prends le signe − devant √Δ." }],

retiens: { regle: "Pour \\(ax^2 + bx + c = 0\\), on calcule le discriminant \\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\) : deux solutions. Si \\(\\Delta = 0\\) : une solution. Si \\(\\Delta < 0\\) : aucune solution réelle (la parabole ne touche pas l'axe des x). Si \\(\\Delta \\ge 0\\), les solutions sont \\(x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}\\).", exemple: ["\\(x^2 - 4x + c = 0\\) : \\(\\Delta = 16 - 4c\\).", "\\(c = 4\\) : \\(\\Delta = 0\\), une solution ; \\(c > 4\\) : aucune ; \\(c < 0\\) : deux.", "\\(x^2 - 4x - 12 = 0\\) : \\(\\Delta = 16 + 48 = 64\\), \\(x = \\frac{4 \\pm 8}{2}\\), donc \\(x = 6\\) ou \\(x = -2\\)."], piege: "Dans \\(\\Delta = b^2 - 4ac\\), \\(b^2\\) est toujours positif : avec \\(b = -4\\), \\(b^2 = 16\\)." },
predict: { q: "x² − 4x + c = 0. Si c devient très grand, le nombre de solutions…", choices: ["augmente", "devient 0", "reste 2"], good: 1, why: "La parabole monte : elle ne touche plus l'axe des x. Δ = 16 − 4c devient négatif dès que c > 4." },
defis: ["Choisis c pour que l'équation ait exactement une solution.", "Choisis c pour qu'elle n'en ait aucune.", "Choisis c négatif : combien de solutions ?"],
play(box, onWin) {
let c = 1, step = 0;
const draw = () => {
const D = 16 - 4 * c, n = D > 0 ? 2 : D === 0 ? 1 : 0, W = 300, H = 150, gx = (x) => 150 + (x - 2) * 34, gy = (y) => 110 - y * 9;
let p = ""; for (let x = -2; x <= 6.01; x += 0.1) p += (p ? " L" : "M") + gx(x).toFixed(1) + "," + Math.max(-20, gy(x * x - 4 * x + c)).toFixed(1);
const sols = D > 0 ? [2 - Math.sqrt(D) / 2, 2 + Math.sqrt(D) / 2] : D === 0 ? [2] : [];
box.innerHTML = actStepper("c", c, "c") + `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="parabole"><line x1="0" y1="${gy(0)}" x2="${W}" y2="${gy(0)}" class="f-line"/><path d="${p}" class="f-line" fill="none" stroke-width="2"/>${sols.map((s) => `<circle cx="${gx(s)}" cy="${gy(0)}" r="5" class="f-dot"/>`).join("")}</svg>
            <div class="act-out">Δ = 16 − 4 · ${nb(c)} = <b>${nb(D)}</b><br>Nombre de solutions : <b>${n}</b>${sols.length ? "<br>x ≈ " + sols.map((s) => nb(+s.toFixed(2))).join(" ; x ≈ ") : ""}</div>`;
actBindStepper(box, "c", () => c, (v) => { c = v; draw(); check(); }, -8, 10);
};
const check = () => {
const D = 16 - 4 * c;
if (step === 0 && D === 0) { onWin(0, "c = 4 : Δ = 0, la parabole touche l'axe en x = 2 ; x² − 4x + 4 = (x − 2)²."); step = 1; }
else if (step === 1 && D < 0) { onWin(1, "c = " + c + " : Δ < 0, la parabole ne coupe pas l'axe : aucune solution réelle."); step = 2; }
else if (step === 2 && c < 0) { onWin(2, "Si c < 0, −4c > 0 donc Δ > 0 : toujours deux solutions."); step = 3; }
};
draw();
},
},
probeq2: {

retiens: { exemple: ["Rectangle de largeur \\(x\\), longueur \\(x + 3\\), aire 40 : \\(x^2 + 3x - 40 = 0\\), \\(x = 5\\) (on écarte \\(-8\\)).", "Aire 70 : \\(x^2 + 3x - 70 = 0\\), \\(x = 7\\) (on écarte \\(-10\\))."] },
predict: { q: "Un rectangle a une longueur égale à sa largeur + 3 et une aire de 40. Sa largeur est…", choices: ["5", "8", "10"], good: 0, why: "5 · 8 = 40. L'équation x(x + 3) = 40 a aussi la solution −8, qu'on écarte : une largeur est positive." },
defis: ["Trouve la largeur pour une aire de 40.", "Trouve la largeur pour une aire de 70.", "Et pour une aire de 28 ?"],
play: hunt({ start: 2, min: 1, max: 12, label: "largeur x", show: (x) => `<svg class="fig" viewBox="0 0 320 ${Math.round(20 + x * 9)}" role="img" aria-label="rectangle"><rect x="10" y="10" width="${(x + 3) * 18}" height="${x * 9}" class="f-shape"/></svg><div class="act-out">Largeur ${nb(x)}, longueur ${nb(x + 3)}<br>Aire : ${nb(x)} · ${nb(x + 3)} = <b>${nb(x * (x + 3))}</b></div>`,
wins: [(x) => (x * (x + 3) === 40 ? "x = 5 : x² + 3x − 40 = (x − 5)(x + 8) = 0 ; −8 est écarté." : null), (x) => (x * (x + 3) === 70 ? "x = 7 : 7 · 10 = 70." : null), (x) => (x * (x + 3) === 28 ? "x = 4 : (x − 4)(x + 7) = 0." : null)] }),
},
eq3: {

retiens: { regle: "On ramène tout à gauche, on met en évidence \\(x\\), on factorise ce qui reste, puis on annule chaque facteur. Une équation de degré 3 a au plus trois solutions.", exemple: ["\\(x^3 - 4x = 0\\), \\(x(x - 2)(x + 2) = 0\\) : \\(-2\\), \\(0\\), \\(2\\).", "\\(x^3 - 9x = 0\\), \\(x(x - 3)(x + 3) = 0\\) : \\(-3\\), \\(0\\), \\(3\\)."] },
predict: { q: "x³ − 4x = 0 : combien de solutions au plus ?", choices: ["1", "2", "3"], good: 2, why: "x(x − 2)(x + 2) = 0 : trois facteurs, trois solutions : −2, 0 et 2." },
defis: ["Trouve une solution positive de x³ − 4x = 0.", "Trouve une solution négative.", "Trouve la troisième."],
play: hunt({ start: 1, min: -4, max: 4, show: (x) => `<div class="act-out">${nb(x)}³ − 4 · ${nb(x)} = ${nb(x ** 3)} − ${nb(4 * x).replace("−", "(−") + (x < 0 ? ")" : "")} = <b>${nb(x ** 3 - 4 * x)}</b></div>`,
wins: [(x) => (x > 0 && x ** 3 === 4 * x ? "x = 2 : 8 − 8 = 0." : null), (x) => (x < 0 && x ** 3 === 4 * x ? "x = −2 : −8 + 8 = 0." : null), (x) => (x === 0 ? "x = 0 : x(x − 2)(x + 2) = 0 a trois solutions." : null)] }),
},
bicarre: {
predict: { q: "x⁴ − 5x² + 4 = 0. Si l'on pose X = x², l'équation devient…", choices: ["X² − 5X + 4 = 0", "X⁴ − 5X + 4 = 0", "X − 5X + 4 = 0"], good: 0, why: "x⁴ = (x²)² = X². C'est une équation du 2e degré en X : X = 1 ou X = 4." },
defis: ["Trouve une solution x de x⁴ − 5x² + 4 = 0.", "Trouve une solution x de valeur absolue différente.", "Trouve les quatre solutions."],
play: hunt({ start: 0, min: -3, max: 3, show: (x) => `<div class="act-out">X = x² = <b>${sq(x)}</b><br>X² − 5X + 4 = ${sq(x * x)} − ${nb(5 * x * x)} + 4 = <b>${nb(x ** 4 - 5 * x * x + 4)}</b><br>${x ** 4 - 5 * x * x + 4 === 0 ? "<b>Solution ✓</b>" : "Pas une solution"}</div>`, note: "Chaque valeur de X positive donne deux x opposés.",
wins: [(x, s) => (x ** 4 - 5 * x * x + 4 === 0 ? (s.add(x), "x = " + nb(x) + " : X = " + sq(x) + ".") : null), (x, s) => { if (x ** 4 - 5 * x * x + 4 === 0) s.add(x); return [...s].some((u) => Math.abs(u) !== Math.abs(x)) && x ** 4 - 5 * x * x + 4 === 0 ? "Deux valeurs de X : 1 et 4." : null; }, (x, s) => { if (x ** 4 - 5 * x * x + 4 === 0) s.add(x); return s.size === 4 ? "Quatre solutions : −2, −1, 1, 2 (X = 1 et X = 4 en donnent deux chacune)." : null; }] }),
},
eqirr: {
predict: { q: "√(x + 3) = x − 3. En élevant au carré, on trouve x = 6 ou x = 1. Les deux conviennent-elles ?", choices: ["Oui", "Non, seulement 6", "Non, seulement 1"], good: 1, why: "Pour 1 : √4 = 2, mais x − 3 = −2. Une racine n'est jamais négative : 1 est une solution « parasite »." },
defis: ["Trouve x tel que √(x + 7) = x + 1.", "Trouve un x tel que les carrés soient égaux mais pas les deux membres.", "Trouve x tel que √(x + 7) = 4."],
play: hunt({ start: 0, min: -7, max: 12, show: (x) => `<div class="act-out">Membre de gauche : √(x + 7) = <b>${nb(+Math.sqrt(x + 7).toFixed(3))}</b><br>Membre de droite : x + 1 = <b>${nb(x + 1)}</b><br><span class="small muted">Au carré, à gauche : x + 7 = ${nb(x + 7)}<br>Au carré, à droite : (x + 1)² = ${sq(x + 1)}</span></div>`,
wins: [(x) => (Math.sqrt(x + 7) === x + 1 ? "x = 2 : √9 = 3 = 2 + 1." : null), (x) => (x + 7 === (x + 1) ** 2 && Math.sqrt(x + 7) !== x + 1 ? "x = −3 : 4 = 4 au carré, mais √4 = 2 ≠ −2. Le carré a « oublié » le signe : on vérifie toujours." : null), (x) => (Math.sqrt(x + 7) === 4 ? "x = 9 : x + 7 = 16." : null)] }),
},
});
})();




(function () {
const R2 = {
sys2: ["Systèmes de deux équations", "Résoudre un système, c'est trouver le couple \\((x \\,;\\, y)\\) qui vérifie les deux équations à la fois.",
"Substitution : on isole une inconnue dans une équation et on la remplace dans l'autre. Combinaison : on multiplie les équations pour que l'addition (ou la soustraction) fasse disparaître une inconnue. On termine en calculant l'autre inconnue et en vérifiant dans les <b>deux</b> équations.",
["\\(\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases}\\) : en additionnant, \\(2x = 12\\), \\(x = 6\\), \\(y = 4\\).", "\\(\\begin{cases} y = 2x + 1 \\\\ 3x + y = 11 \\end{cases}\\) : \\(3x + 2x + 1 = 11\\), \\(x = 2\\), \\(y = 5\\)."],
"La réponse est un couple : x d'abord, puis y."],
sysprob: ["Problèmes à deux inconnues", "Deux informations, deux inconnues : un système.",
"1. Nommer les deux inconnues (et écrire ce qu'elles représentent). 2. Écrire une équation par information. 3. Résoudre. 4. Vérifier dans l'énoncé et répondre par une phrase.",
["35 têtes et 94 pattes : \\(p + \\ell = 35\\), \\(2p + 4\\ell = 94\\), donc 12 lapins et 23 poules.", "Avec le courant : \\(v + c = 20\\) ; contre : \\(v - c = 14\\) ; donc \\(v = 17\\), \\(c = 3\\)."],
"Vérifie que la solution a un sens : un nombre d'animaux est entier et positif."],
sysgraph: ["Systèmes et droites", "Chaque équation d'un système 2 × 2 est une droite ; la solution est leur point commun.",
"Droites sécantes (pentes différentes) : une solution. Droites parallèles distinctes (même pente, ordonnées à l'origine différentes) : aucune solution. Droites confondues (équations proportionnelles) : une infinité de solutions.",
["\\(y = 2x + 1\\) et \\(y = 2x - 3\\) : parallèles, aucune solution.", "\\(2x + 3y = 6\\) et \\(4x + 6y = 12\\) : confondues, une infinité.", "\\(y = x + 1\\) et \\(y = -x + 5\\) : sécantes en \\((2 \\,;\\, 3)\\)."],
"Compare les pentes après avoir isolé y dans chaque équation."],
sys3: ["Systèmes de trois équations", "On ramène le système à un système 2 × 2, puis à une équation.",
"On élimine une inconnue en combinant deux paires de lignes ; on résout le système 2 × 2 obtenu ; on remonte pour trouver la troisième inconnue. Un système « en escalier » (triangulaire) se résout directement de bas en haut.",
["\\(\\begin{cases} x + y + z = 6 \\\\ y + z = 5 \\\\ z = 2 \\end{cases}\\) : \\(z = 2\\), \\(y = 3\\), \\(x = 1\\).", "Astuce quand chaque ligne est la somme de deux inconnues : \\(\\begin{cases} x + y = 7 \\\\ y + z = 9 \\\\ x + z = 8 \\end{cases}\\). On additionne les trois lignes : \\(2x + 2y + 2z = 24\\), donc \\(x + y + z = 12\\). On retranche chaque ligne de 12 : \\(z = 12 - 7 = 5\\), \\(x = 12 - 9 = 3\\), \\(y = 12 - 8 = 4\\)."],
"Garde l'ordre (x ; y ; z) dans la réponse."],
affine: ["Fonctions affines", "\\(f(x) = ax + b\\) : une droite de pente \\(a\\) et d'ordonnée à l'origine \\(b\\).",
"La pente se calcule avec deux points : \\(a = \\frac{f(x_2) - f(x_1)}{x_2 - x_1}\\). L'ordonnée à l'origine est \\(b = f(0)\\), ou \\(b = f(x_1) - a x_1\\). Deux droites parallèles ont la même pente.",
["\\(f(1) = 5\\), \\(f(3) = 9\\) : \\(a = \\frac{4}{2} = 2\\), \\(b = 3\\), \\(f(x) = 2x + 3\\).", "Taxi : 6 CHF + 3 CHF/km : \\(f(x) = 3x + 6\\)."],
"La pente est (différence des images) ÷ (différence des x), dans le même ordre en haut et en bas."],
affzero: ["Zéro et signe", "Une fonction affine change de signe une seule fois, en son zéro.",
"Zéro : on résout \\(ax + b = 0\\), \\(x = -\\frac{b}{a}\\). Si \\(a > 0\\), la fonction est négative avant le zéro et positive après ; si \\(a < 0\\), c'est l'inverse. Pour \\(f(x) > g(x)\\), on étudie le signe de \\(f(x) - g(x)\\).",
["\\(f(x) = 2x - 6\\) : zéro 3, \\(f(x) > 0\\) pour \\(x > 3\\).", "\\(f(x) = -3x + 12\\) : zéro 4, \\(f(x) > 0\\) pour \\(x < 4\\)."],
"En divisant par un nombre négatif, on retourne le sens de l'inégalité."],
sysineq: ["Systèmes d'inéquations", "Toutes les conditions doivent être vraies en même temps.",
"On résout chaque inéquation, on représente les solutions sur une même droite graduée et on garde la partie commune (l'intersection). Crochet fermé pour ≤ et ≥ (borne comprise), ouvert pour < et >. Si les parties ne se chevauchent pas : aucune solution.",
["\\(x > 2\\) et \\(x \\le 5\\) : \\(S = \\,]2 \\,;\\, 5]\\).", "\\(-2x > 4\\) donne \\(x < -2\\) (sens retourné).", "\\(x < 1\\) et \\(x > 4\\) : \\(S = \\varnothing\\)."],
"On garde la partie commune, pas la réunion des deux."],
};
for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;

const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1);
box.innerHTML = (actAnswerHtml(o.label || "Ta réponse")) + o.show(x, s);
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule."); };
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg) => (x) => (x !== null && Math.abs(x - target) < 1e-9 ? msg : "");

const plot = (fs, v, opts = {}) => { const X = (x) => 160 + x * 18, Y = (y) => 110 - y * 12; let g = "";
for (let k = -8; k <= 8; k++) g += `<line x1="${X(k)}" y1="10" x2="${X(k)}" y2="210" class="f-grid"/>`;
for (let k = -8; k <= 8; k++) g += `<line x1="16" y1="${Y(k)}" x2="304" y2="${Y(k)}" class="f-grid"/>`;
g += `<line x1="16" y1="${Y(0)}" x2="304" y2="${Y(0)}" class="f-line"/><line x1="${X(0)}" y1="10" x2="${X(0)}" y2="210" class="f-line"/>`;
fs.forEach((f, i) => { g += `<line x1="${X(-8)}" y1="${Y(f(-8))}" x2="${X(8)}" y2="${Y(f(8))}" class="${i ? "f-line" : "f-accent"}" stroke-width="2.4" clip-path="inset(0)"/>`; });
if (v !== null && v !== undefined && Math.abs(v) <= 8) { g += `<line x1="${X(v)}" y1="10" x2="${X(v)}" y2="210" class="f-line" stroke-dasharray="4 4"/>`; fs.forEach((f) => { const y = f(v); if (Math.abs(y) <= 8.5) g += `<circle cx="${X(v)}" cy="${Y(y)}" r="4.5" class="f-dot"/>`; }); }
(opts.pts || []).forEach(([a, b]) => (g += `<circle cx="${X(a)}" cy="${Y(b)}" r="4" class="f-dot"/>`));
return svg(320, 220, `<clipPath id="pcs"><rect x="16" y="10" width="288" height="200"/></clipPath><g clip-path="url(#pcs)">${g}</g>`, "repère"); };

Object.assign(ACTIVE, {
sys2: {
predict: { q: "x + y = 8 et x − y = 2. Que vaut x ?", choices: ["5", "4", "3"], good: 0, why: "En additionnant les deux équations, les y disparaissent : 2x = 10, donc x = 5 (et y = 3). 4 et 4 font bien 8, mais 4 − 4 ne fait pas 2." },
defis: ["y = −x + 10 et y = x − 2 : quelle valeur de x rend les deux y égaux ?", "y = 2x + 1 et y = −x + 7 : trouve x.", "y = x + 3 et y = −2x − 3 : trouve x."],
play: hunt({ label: "x =",
show: (x, s) => { const F = [[(t) => -t + 10, (t) => t - 2], [(t) => 2 * t + 1, (t) => -t + 7], [(t) => t + 3, (t) => -2 * t - 3]][s];
return plot(F, x) + (x === null ? `<div class="small muted">Les deux droites représentent les deux équations. Calcule x par substitution ou par combinaison.</div>` : `<div class="act-out">En x = ${nb(x)} : 1re droite y = ${nb(F[0](x))}, 2e droite y = ${nb(F[1](x))} → ${Math.abs(F[0](x) - F[1](x)) < 1e-9 ? '<b class="act-ok">même point : c\'est la solution</b>' : "écart " + nb(Math.abs(F[0](x) - F[1](x)))}</div>`); },
wins: [W(6, "−x + 10 = x − 2, 2x = 12, x = 6 ; y = 4. Solution (6 ; 4)."), W(2, "2x + 1 = −x + 7, 3x = 6, x = 2 ; y = 5. Solution (2 ; 5)."), W(-2, "x + 3 = −2x − 3, 3x = −6, x = −2 ; y = 1. Solution (−2 ; 1).")] }),
},
sysprob: {

retiens: { exemple: ["10 têtes et 28 pattes : si tout était des poules, 20 pattes ; il en manque 8, soit 4 lapins.", "35 têtes et 94 pattes : \\(p + \\ell = 35\\), \\(2p + 4\\ell = 94\\), donc 12 lapins et 23 poules."] },
predict: { q: "Dans une ferme : 8 têtes et 22 pattes (poules et lapins). Combien de lapins ?", choices: ["3", "5", "4"], good: 0, why: "Si tous étaient des poules : 16 pattes. Il en manque 6, et chaque lapin ajoute 2 pattes : 3 lapins (et 5 poules)." },
defis: ["10 têtes, 28 pattes : combien de lapins ?", "20 têtes, 56 pattes : combien de lapins ?", "35 têtes, 94 pattes : combien de lapins ?"],
play: hunt({ label: "Lapins :",
show: (x, s) => { const [n, p] = [[10, 28], [20, 56], [35, 94]][s]; if (x === null) return `<div class="small muted">${n} têtes, ${p} pattes. Écris le système p + ℓ = ${n}, 2p + 4ℓ = ${p}, ou raisonne « si tous étaient des poules… ».</div>`;
const l = Math.max(0, Math.min(n, Math.round(x))), po = n - l, legs = 2 * po + 4 * l; let g = "";
for (let k = 0; k < n; k++) g += `<circle cx="${20 + (k % 18) * 16}" cy="${20 + Math.floor(k / 18) * 22}" r="6" class="${k < l ? "f-fill" : "f-fill2"}"/>`;
return svg(320, 20 + Math.ceil(n / 18) * 22, g, l + " lapins") + `<div class="act-out">${l} lapins et ${po} poules : ${4 * l} + ${2 * po} = <b>${legs} pattes</b> (il en faut ${p}) → ${legs === p ? '<b class="act-ok">✓</b>' : legs < p ? "pas assez" : "trop"}</div>`; },
wins: [W(4, "4 lapins, 6 poules : 16 + 12 = 28."), W(8, "8 lapins, 12 poules : 32 + 24 = 56."), W(12, "Si tout était des poules : 70 pattes ; il en manque 24, soit 12 lapins.")] }),
},
sysgraph: {

retiens: { exemple: ["\\(y = 2x + 1\\) et \\(y = 2x - 3\\) : parallèles, aucune solution.", "\\(x + y = 4\\) et \\(y = -x + 4\\) : confondues, une infinité.", "\\(y = x + 1\\) et \\(y = -x + 5\\) : sécantes en \\((2 \\,;\\, 3)\\)."] },
predict: { q: "Le système y = 2x + 1 et y = 2x − 3 a…", choices: ["une solution", "aucune solution", "une infinité de solutions"], good: 1, why: "Même pente 2, ordonnées à l'origine différentes : droites parallèles, jamais de point commun." },
defis: ["Quelle pente m rend y = mx + 1 parallèle à y = 3x − 2 ?", "Quelle valeur de b rend y = −x + b confondue avec la droite x + y = 4 ?", "Quelle pente m fait couper y = mx et y = 2x + 4 en x = 2 ?"],
play: hunt({ label: "Valeur :",
show: (v, s) => { const base = [(t) => 3 * t - 2, (t) => 4 - t, (t) => 2 * t + 4][s], mine = v === null ? null : [(t) => v * t + 1, (t) => -t + v, (t) => v * t][s];
const out = v === null ? `<div class="small muted">${["Deux droites parallèles ont la même pente.", "Isole y dans x + y = 4.", "Au point d'intersection, les deux droites ont le même y."][s]}</div>`
: `<div class="act-out">${["pentes : " + nb(v) + " et 3 → " + (v === 3 ? '<b class="act-ok">parallèles : aucune solution</b>' : "sécantes : une solution"), "y = −x + " + nb(v) + " et y = −x + 4 → " + (v === 4 ? '<b class="act-ok">confondues : une infinité de solutions</b>' : "parallèles distinctes : aucune"), "en x = 2 : " + nb(2 * v) + " et 8 → " + (v === 4 ? '<b class="act-ok">elles se coupent en (2 ; 8)</b>' : "pas encore")][s]}</div>`;
return plot(mine ? [base, mine] : [base], s === 2 ? 2 : null) + out; },
wins: [W(3, "Même pente 3 : parallèles (ordonnées 1 et −2 différentes), aucune solution."), W(4, "x + y = 4 s'écrit y = −x + 4 : avec b = 4, les droites sont confondues."), W(4, "2m = 2 · 2 + 4 = 8, donc m = 4.")] }),
},
sys3: {

retiens: { regle: "Un système « en escalier » (triangulaire) se résout de bas en haut : on trouve \\(z\\), puis on remonte pour \\(y\\), puis pour \\(x\\). Quand chaque ligne est la somme de deux inconnues, on additionne les trois lignes : on obtient \\(2(x + y + z)\\).", exemple: ["\\(\\begin{cases} x + y + z = 9 \\\\ y + z = 7 \\\\ z = 3 \\end{cases}\\) : \\(z = 3\\), \\(y = 4\\), \\(x = 2\\).", "\\(\\begin{cases} x + y = 7 \\\\ y + z = 9 \\\\ x + z = 8 \\end{cases}\\) : la somme des lignes donne \\(2x + 2y + 2z = 24\\), donc \\(x + y + z = 12\\)."] },
predict: { q: "x + y + z = 6, y + z = 5 et z = 2. Que vaut x ?", choices: ["1", "3", "4"], good: 0, why: "On remonte : z = 2, puis y = 5 − 2 = 3, puis x = 6 − 3 − 2 = 1." },
defis: ["Système x + y + z = 9, y + z = 7, z = 3 : que vaut y ?", "Même système : que vaut x ?", "x + y = 7, y + z = 9, x + z = 8 : additionne les trois lignes. Que vaut x + y + z ?"],
play: hunt({ label: "Ta réponse :",
show: (v, s) => `<div class="act-out" style="text-align:left">${["x + y + z = 9<br>y + z = 7<br>z = 3", "x + y + z = 9<br>y + z = 7 (donc y = 4)<br>z = 3", "x + y = 7<br>y + z = 9<br>x + z = 8"][s]}</div>` + (v === null ? "" : `<div class="act-out">${[v === 4 ? "✓ y = 7 − 3 = 4" : "Avec z = 3 : y + 3 = 7…", v === 2 ? "✓ x = 9 − 4 − 3 = 2" : "x + 4 + 3 = 9…", v === 12 ? "✓ 2(x + y + z) = 24, donc 12" : "La somme des trois lignes vaut 24 = 2(x + y + z)…"][s]}</div>`),
wins: [W(4, "z = 3, donc y = 7 − 3 = 4."), W(2, "x = 9 − 4 − 3 = 2 : solution (2 ; 4 ; 3)."), W(12, "2(x + y + z) = 24, donc x + y + z = 12 ; puis z = 12 − 7 = 5, x = 3, y = 4.")] }),
},
affine: {
predict: { q: "f(x) = 2x + 3. Que vaut f(0) ?", choices: ["2", "3", "5"], good: 1, why: "f(0) = 2 · 0 + 3 = 3 : c'est l'ordonnée à l'origine b, là où la droite coupe l'axe vertical." },
defis: ["Pente de la droite qui passe par (0 ; 1) et (2 ; 5) ?", "Ordonnée à l'origine de la droite de pente 3 passant par (1 ; 1) ?", "Pente de la droite qui passe par (−2 ; 4) et (2 ; 2) ?"],
play: hunt({ label: "Ta réponse :",
show: (v, s) => { const P = [[[0, 1], [2, 5]], [[1, 1]], [[-2, 4], [2, 2]]][s], f = v === null ? null : [(t) => v * t + 1, (t) => 3 * t + v, (t) => v * (t + 2) + 4][s];
const ok = v !== null && [v === 2, v === -2, v === -0.5][s];
return plot(f ? [f] : [], null, { pts: P }) + (v === null ? `<div class="small muted">${["Pente = (différence des y) ÷ (différence des x).", "b = y − a · x avec le point donné.", "Attention : la droite descend."][s]}</div>` : `<div class="act-out">${ok ? '<b class="act-ok">La droite passe par les points.</b>' : "La droite ne passe pas par tous les points."}</div>`); },
wins: [W(2, "a = (5 − 1) ÷ (2 − 0) = 2."), W(-2, "b = 1 − 3 · 1 = −2 : f(x) = 3x − 2."), W(-0.5, "a = (2 − 4) ÷ (2 − (−2)) = −2 ÷ 4 = −0,5 : la droite descend.")] }),
},
affzero: {

retiens: { regle: "Zéro : on résout \\(ax + b = 0\\), \\(x = -\\frac{b}{a}\\). Si \\(a > 0\\), la fonction est négative avant le zéro et positive après ; si \\(a < 0\\), c'est l'inverse." },
predict: { q: "f(x) = 3x − 12. Son zéro est…", choices: ["−12", "4", "12"], good: 1, why: "3x − 12 = 0 donne x = 4 : la droite coupe l'axe horizontal en 4. −12 est l'ordonnée à l'origine." },
defis: ["Zéro de f(x) = 2x − 6 ?", "Zéro de f(x) = −3x + 12 ?", "Zéro de f(x) = 0,5x + 2 ?"],
play: hunt({ label: "x =",
show: (v, s) => { const f = [(t) => 2 * t - 6, (t) => -3 * t + 12, (t) => 0.5 * t + 2][s];
return plot([f], v) + (v === null ? `<div class="small muted">Le zéro est l'abscisse où la droite coupe l'axe horizontal.</div>` : `<div class="act-out">f(${nb(v)}) = <b>${nb(f(v))}</b> → ${Math.abs(f(v)) < 1e-9 ? '<b class="act-ok">zéro !</b>' : f(v) > 0 ? "positif" : "négatif"}</div>`); },
wins: [W(3, "2x = 6, x = 3. Avant 3, f est négative ; après, positive (pente positive)."), W(4, "−3x = −12, x = 4. Pente négative : f est positive avant 4."), W(-4, "0,5x = −2, x = −4.")] }),
},
sysineq: {
predict: { q: "x > 2 et x ≤ 5. Le nombre 5 est-il solution ?", choices: ["Oui", "Non"], good: 0, why: "5 > 2 et 5 ≤ 5 : les deux conditions sont vraies. S = ]2 ; 5], crochet fermé en 5." },
defis: ["x > 2 et x ≤ 5 : le plus grand entier solution ?", "2x − 1 > 3 et x + 4 ≤ 9 : le plus petit entier solution ?", "−2x > 4 et x > −5 : le plus grand entier solution ?"],
play: hunt({ label: "Entier :",
show: (v, s) => { const [lo, li, hi, hc] = [[2, false, 5, true], [2, false, 5, true], [-5, false, -2, false]][s], X = (t) => 160 + t * 20;
let g = `<line x1="10" y1="40" x2="310" y2="40" class="f-line"/>`; for (let k = -7; k <= 7; k++) g += `<line x1="${X(k)}" y1="35" x2="${X(k)}" y2="45" class="f-line"/><text x="${X(k)}" y="60" class="f-txt" text-anchor="middle" font-size="10">${k}</text>`;
g += `<line x1="${X(lo)}" y1="40" x2="${X(hi)}" y2="40" class="f-accent" stroke-width="5"/><text x="${X(lo)}" y="30" class="f-txt" text-anchor="middle">${li ? "[" : "]"}</text><text x="${X(hi)}" y="30" class="f-txt" text-anchor="middle">${hc ? "]" : "["}</text>`;
const inside = v !== null && (v > lo || (li && v === lo)) && (v < hi || (hc && v === hi));
if (v !== null && Math.abs(v) <= 7) g += `<circle cx="${X(v)}" cy="40" r="6" class="${inside ? "f-dot" : "f-soft"}" stroke="var(--ink)"/>`;
return (v === null ? `<div class="small muted">${["Lis directement les deux conditions.", "Résous chaque ligne : 2x > 4 et x ≤ 5.", "−2x > 4 : on divise par −2, le sens change."][s]}</div>` : svg(320, 70, g, "droite graduée") + `<div class="act-out">${nb(v)} ${inside ? "vérifie les deux conditions" : "ne vérifie pas les deux conditions"}</div>`); },
wins: [W(5, "5 est compris (≤) : S = ]2 ; 5]."), W(3, "x > 2 et x ≤ 5 : le plus petit entier est 3 (2 est exclu)."), W(-3, "−2x > 4 donne x < −2 ; avec x > −5 : S = ]−5 ; −2[, le plus grand entier est −3.")] }),
},
});
})();





(function () {
const R2 = {
fracadd: ["Additionner des fractions", "On n'additionne que des parts de même taille : il faut un dénominateur commun.",
"On cherche le plus petit multiple commun des dénominateurs. On écrit chaque fraction avec ce dénominateur (en multipliant numérateur <b>et</b> dénominateur par le même nombre), on additionne les numérateurs, puis on simplifie. Un nombre entier s'écrit aussi comme une fraction : \\(2 = \\frac{6}{3}\\).",
["\\(\\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}\\).", "\\(\\frac{5}{6} - \\frac{3}{4} = \\frac{10}{12} - \\frac{9}{12} = \\frac{1}{12}\\).", "\\(2 - \\frac{3}{5} = \\frac{10}{5} - \\frac{3}{5} = \\frac{7}{5}\\)."],
"On n'additionne jamais les dénominateurs : \\(\\frac{1}{4} + \\frac{1}{6}\\) n'est pas \\(\\frac{2}{10}\\)."],
fracmul: ["Multiplier et diviser des fractions", "Prendre une fraction d'une fraction, c'est multiplier.",
"On multiplie les numérateurs entre eux et les dénominateurs entre eux ; on simplifie avant si possible. Diviser par une fraction, c'est multiplier par son inverse : \\(\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}\\). Les fractions d’un nombre se calculent : \\(\\frac{3}{4}\\) de 28, c'est \\(28 : 4 \\cdot 3 = 21\\).",
["\\(\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}\\).", "\\(\\frac{4}{9} \\cdot \\frac{15}{8} = \\frac{1 \\cdot 5}{3 \\cdot 2} = \\frac{5}{6}\\) (simplifié avant).", "\\(\\frac{3}{4} : \\frac{3}{8} = \\frac{3}{4} \\cdot \\frac{8}{3} = 2\\) : il y a deux fois \\(\\frac{3}{8}\\) dans \\(\\frac{3}{4}\\)."],
"Pour multiplier, pas de dénominateur commun ; pour diviser, on inverse la <b>deuxième</b> fraction."],
fracconv: ["Fraction, décimal, pourcentage", "Un même nombre a plusieurs écritures.",
"Fraction → décimal : on divise le numérateur par le dénominateur. Décimal → fraction : sur 10, 100, 1000…, puis on simplifie. Pourcentage : « pour cent », donc sur 100. Un nombre périodique s'écrit aussi en fraction : avec \\(x = 0{,}\\overline{3}\\), \\(10x - x = 3\\), donc \\(x = \\frac{3}{9} = \\frac{1}{3}\\).",
["\\(\\frac{3}{8} = 3 : 8 = 0{,}375 = 37{,}5\\,\\%\\).", "\\(0{,}35 = \\frac{35}{100} = \\frac{7}{20}\\).", "\\(0{,}\\overline{27} = \\frac{27}{99} = \\frac{3}{11}\\) (période de 2 chiffres : sur 99)."],
"Deux baisses successives de 20 % ne font pas 40 % : la deuxième porte sur le prix déjà baissé (\\(0{,}8 \\cdot 0{,}8 = 0{,}64\\), soit 36 %)."],
puiss: ["Puissances", "\\(a^n\\) est un raccourci pour \\(n\\) facteurs \\(a\\).",
"Même base : \\(a^m \\cdot a^n = a^{m+n}\\), \\(\\frac{a^m}{a^n} = a^{m-n}\\), \\((a^m)^n = a^{m \\cdot n}\\). Exposant nul ou négatif : \\(a^0 = 1\\) et \\(a^{-n} = \\frac{1}{a^n}\\) (chaque marche vers le bas divise par \\(a\\)). Sans parenthèses, la puissance ne porte que sur le nombre : \\(-3^2 = -9\\), mais \\((-3)^2 = 9\\).",
["\\(2^3 \\cdot 2^4 = 2^7 = 128\\).", "\\(\\frac{5^2}{5^5} = 5^{-3} = \\frac{1}{125}\\).", "\\(2^5 \\cdot 5^5 = 10^5\\) : même exposant, on regroupe les bases."],
"Un exposant négatif ne rend pas le nombre négatif : \\(2^{-3} = \\frac{1}{8}\\), pas \\(-8\\)."],
sci: ["Notation scientifique", "Un nombre très grand ou très petit s'écrit \\(a \\cdot 10^n\\), avec \\(1 \\le a < 10\\).",
"On place la virgule après le premier chiffre non nul : c'est \\(a\\). L'exposant \\(n\\) compte de combien de rangs on a déplacé la virgule : positif pour un nombre plus grand que 10, négatif pour un nombre plus petit que 1. Pour comparer, on regarde d'abord l'exposant.",
["\\(4\\text{'}500\\text{'}000 = 4{,}5 \\cdot 10^6\\).", "\\(0{,}00045 = 4{,}5 \\cdot 10^{-4}\\).", "\\(34 \\cdot 10^5 = 3{,}4 \\cdot 10^1 \\cdot 10^5 = 3{,}4 \\cdot 10^6\\)."],
"\\(52 \\cdot 10^{-5}\\) n'est pas en notation scientifique : 52 n'est pas entre 1 et 10."],
scicalc: ["Calculer en notation scientifique", "On traite séparément les nombres devant et les puissances de 10.",
"Produit : on multiplie les nombres devant et on additionne les exposants. Quotient : on divise les nombres et on soustrait les exposants. À la fin, on remet le nombre devant entre 1 et 10, en corrigeant l'exposant.",
["\\((3 \\cdot 10^4) \\cdot (2 \\cdot 10^5) = 6 \\cdot 10^9\\).", "\\((5 \\cdot 10^6) \\cdot (4 \\cdot 10^2) = 20 \\cdot 10^8 = 2 \\cdot 10^9\\).", "\\(\\frac{4 \\cdot 10^3}{8 \\cdot 10^{-2}} = 0{,}5 \\cdot 10^5 = 5 \\cdot 10^4\\)."],
"Si le nombre devant grandit (20 au lieu de 2), l'exposant diminue d'autant, et inversement."],
pyth: ["Théorème de Pythagore", "Dans un triangle rectangle, le carré de l'hypoténuse vaut la somme des carrés des deux autres côtés.",
"L'hypoténuse est le plus grand côté, en face de l'angle droit. Pour la trouver : on additionne les carrés des cathètes, puis on prend la racine. Pour trouver une cathète : on soustrait les carrés. La réponse exacte s'écrit souvent \\(a\\sqrt{b}\\).",
["Cathètes 6 et 8 : \\(c^2 = 36 + 64 = 100\\), \\(c = 10\\).", "Hypoténuse 13, cathète 5 : \\(b^2 = 169 - 25 = 144\\), \\(b = 12\\).", "Cathètes 2 et 4 : \\(c = \\sqrt{20} = 2\\sqrt{5}\\)."],
"On additionne les carrés, pas les côtés : \\(6 + 8 = 14\\) n'est pas l'hypoténuse."],
pythfig: ["Pythagore dans les figures", "Le triangle rectangle est souvent caché.",
"Diagonale d'un rectangle : les deux côtés et la diagonale. Hauteur d'un triangle isocèle : elle coupe la base en son milieu. Grande diagonale d'un pavé : \\(d^2 = a^2 + b^2 + c^2\\). Pyramide : la hauteur, le demi-côté et l'apothème (ou la demi-diagonale et l'arête) forment un triangle rectangle.",
["Rectangle 9 × 12 : \\(d = \\sqrt{81 + 144} = 15\\).", "Isocèle 10, 10, base 12 : \\(h = \\sqrt{100 - 36} = 8\\).", "Pavé 2 × 3 × 6 : \\(d = \\sqrt{4 + 9 + 36} = 7\\)."],
"Dans le triangle isocèle, on prend la <b>demi</b>-base."],
pythrec: ["La réciproque de Pythagore", "Pythagore sert aussi à savoir si un triangle est rectangle.",
"On calcule le carré du plus grand côté et la somme des carrés des deux autres. S'ils sont égaux, le triangle est rectangle (réciproque) ; sinon, il ne l'est pas. C'est le principe de l'équerre des maçons : 3, 4, 5 (ou 60, 80, 100 cm).",
["5, 12, 13 : \\(25 + 144 = 169 = 13^2\\), rectangle.", "5, 7, 9 : \\(25 + 49 = 74 \\neq 81\\), pas rectangle.", "1,5 ; 2 ; 2,5 : \\(2{,}25 + 4 = 6{,}25\\), rectangle."],
"Une égalité « presque » vraie ne suffit pas : 74 et 81, ce n'est pas égal."],
vol: ["Volumes des prismes et cylindres", "Volume = aire de la base × hauteur.",
"On empile des couches identiques à la base. Pavé : \\(a \\cdot b \\cdot c\\). Prisme : aire du triangle (ou du trapèze) de base × longueur. Cylindre : \\(\\pi r^2 h\\). Contenances : \\(1\\ \\text{L} = 1\\ \\text{dm}^3 = 1000\\ \\text{cm}^3\\), \\(1\\ \\text{cL} = 10\\ \\text{cm}^3\\).",
["Pavé 4 × 3 × 3 : 12 cubes par couche, 3 couches, \\(36\\ \\text{cm}^3\\).", "Prisme de base triangulaire (base 6, hauteur 4), long de 10 : \\(12 \\cdot 10 = 120\\).", "Cylindre \\(r = 3\\), \\(h = 5\\) : \\(45\\pi \\approx 141{,}4\\)."],
"\\(2\\pi r h\\) est l'aire latérale du cylindre, pas son volume."],
volcone: ["Pyramide, cône, boule", "Une pyramide vaut le tiers du prisme de même base et même hauteur.",
"Pyramide et cône : \\(V = \\frac{1}{3} \\cdot A_{\\text{base}} \\cdot h\\). Boule : \\(V = \\frac{4}{3}\\pi r^3\\). Sphère (la surface) : \\(A = 4\\pi r^2\\). Si toutes les longueurs sont multipliées par \\(k\\), le volume est multiplié par \\(k^3\\).",
["Pyramide base 6 × 6, hauteur 5 : \\(\\frac{36 \\cdot 5}{3} = 60\\).", "Cône \\(r = 3\\), \\(h = 4\\) : \\(12\\pi\\).", "Boule \\(r = 3\\) : \\(36\\pi\\)."],
"Avec un diamètre, on prend d'abord la moitié pour avoir le rayon."],
airepyr: ["Aire d'une pyramide", "Les faces latérales sont des triangles ; leur hauteur est l'apothème.",
"Pyramide régulière à base carrée de côté \\(c\\) et d'apothème \\(a\\) : aire latérale \\(4 \\cdot \\frac{c \\cdot a}{2} = 2ca\\) ; aire totale \\(c^2 + 2ca\\). L'apothème se calcule avec Pythagore : \\(a^2 = h^2 + \\left(\\frac{c}{2}\\right)^2\\).",
["\\(c = 6\\), \\(h = 4\\) : \\(a = 5\\), aire latérale \\(60\\).", "\\(c = 10\\), \\(h = 12\\) : \\(a = 13\\), aire totale \\(100 + 260 = 360\\)."],
"La hauteur des faces est l'apothème, pas la hauteur de la pyramide."],
volcomp: ["Solides composés", "On découpe en solides simples.",
"On repère les solides (cube, pyramide, cylindre, cône, demi-boule), on calcule chaque volume avec ses propres dimensions, puis on additionne (ou on soustrait un trou). On garde \\(\\pi\\) en facteur jusqu'au bout.",
["Cube de 3 cm d'arête + pyramide de hauteur 3 : \\(27 + 9 = 36\\).", "Silo : cylindre \\(r = 3\\), \\(h = 10\\) et demi-boule : \\(90\\pi + 18\\pi = 108\\pi\\).", "Cube de 10 cm d'arête percé d'un trou \\(r = 2\\) : \\(1000 - 40\\pi\\)."],
"Dans une gélule, la partie cylindrique est plus courte que la gélule : on retire deux rayons."],
volmanq: ["Retrouver une dimension", "Une formule de volume est une équation.",
"On écrit la formule, on remplace ce qu'on connaît, puis on isole la dimension cherchée. Pour un cône ou une pyramide, n'oublie pas le facteur 3 ; pour un rayon, on termine par une racine (carrée ou cubique).",
["Cylindre \\(r = 3\\), \\(V = 36\\pi\\) : \\(9h = 36\\), \\(h = 4\\).", "Cône \\(r = 3\\), \\(V = 18\\pi\\) : \\(\\frac{9h}{3} = 18\\), \\(h = 6\\).", "Boule \\(V = 36\\pi\\) : \\(r^3 = 27\\), \\(r = 3\\)."],
"Convertis d'abord : 1 L = 1000 cm³."],
};
for (const [id, v] of Object.entries(R2)) LESSONS[id] = L_(...v);


const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;





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

const pyrFig = (c, h, a) => {
const A = [40, 190], B = [210, 190], C = [270, 140], D = [100, 140], O = [155, 165], S = [155, 40], Mx = [125, 190];
const L = (p, q, cls, ex = "") => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" class="${cls}" ${ex}/>`;
const T = (x, y, t, ex = "") => `<text x="${x}" y="${y}" class="f-txt" font-size="13" ${ex}>${t}</text>`;
let g = `<path d="M${A} L${B} L${C} L${D} Z" class="f-soft"/>`;
g += L(A, D, "f-line", 'stroke-dasharray="4 3"') + L(D, C, "f-line", 'stroke-dasharray="4 3"') + L(S, D, "f-line", 'stroke-dasharray="4 3"');
g += L(A, B, "f-line") + L(B, C, "f-line") + L(S, A, "f-line") + L(S, B, "f-line") + L(S, C, "f-line");
g += L(S, O, "f-line", 'stroke-dasharray="5 3" style="stroke:var(--margin)" stroke-width="2"') + L(O, Mx, "f-line", 'style="stroke:var(--margin)" stroke-width="2"') + L(S, Mx, "f-line", 'style="stroke:var(--blue)" stroke-width="3"');
g += `<path d="M${O[0]},${O[1] - 9} L${O[0] - 5},${O[1] - 6} L${O[0] - 5},${O[1] + 3}" fill="none" class="f-line" stroke-width="1"/>`;
g += T(161, 128, "h = " + h, 'style="fill:var(--margin)"') + T(146, 186, c / 2, 'text-anchor="middle" font-size="12" style="fill:var(--margin)"') + T(133, 120, "a = " + (a == null ? "?" : a), 'text-anchor="end" style="fill:var(--blue)" font-weight="700"') + T(125, 210, "côté " + c + " cm", 'text-anchor="middle"');
return svg(300, 220, g, "pyramide à base carrée : hauteur " + h + ", demi-côté " + c / 2 + ", apothème " + (a == null ? "inconnu" : a));
};
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");

const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
return g; };

Object.assign(ACTIVE, {
fracadd: {
predict: { q: "Combien font 1/3 + 1/4 ?", choices: ["2/7", "7/12", "2/12"], good: 1, why: "Un tiers et un quart ne sont pas des parts de même taille : on les découpe en douzièmes, 4/12 + 3/12 = 7/12. Additionner les dénominateurs donnerait 2/7, moins qu'un tiers seul !" },
defis: ["Trouve le plus petit dénominateur commun de 1/4 et 1/6.", "Même chose pour 2/3 et 3/5.", "Et pour 3/8 et 5/12."],
play: hunt({ ask: true, label: "Dénominateur commun", start: 2, min: 2, max: 60,
show: (x, s) => { const [a, b, c, d] = [[1, 4, 1, 6], [2, 3, 3, 5], [3, 8, 5, 12]][s], okb = x % b === 0, okd = x % d === 0;
return svg(320, 70, bar(a, b, okb ? x : 0, 8, "f-fill") + bar(c, d, okd ? x : 0, 40, "f-fill2"), "deux barres de fraction") +
`<div class="act-out">${a}/${b} ${okb ? "= <b>" + (a * x) / b + "/" + x + "</b>" : ": " + x + " n'est pas un multiple de " + b}<br>${c}/${d} ${okd ? "= <b>" + (c * x) / d + "/" + x + "</b>" : ": " + x + " n'est pas un multiple de " + d}${okb && okd ? "<br>Somme : " + ((a * x) / b + (c * x) / d) + "/" + x + " = <b>" + fr((a * x) / b + (c * x) / d, x) + "</b>" : ""}</div>`; },
wins: [W(12, "12 : 3/12 + 2/12 = 5/12. 24 marcherait aussi, mais 12 est le plus petit."), W(15, "15 : 10/15 + 9/15 = 19/15."), W(24, "24 : 9/24 + 10/24 = 19/24. Inutile d'aller jusqu'à 8 · 12 = 96.")] }),
},
fracmul: {

plus: [{ d: "Calcule \\(\\frac{3}{4} \\div \\frac{1}{8}\\) : combien de huitièmes dans trois quarts ?", ans: 6, ok: "Diviser par 1/8, c'est multiplier par 8 (son inverse) : 3/4 · 8 = 24/4 = 6. Il y a 6 huitièmes dans 3/4.", no: "3/4 = 6/8 : compte les huitièmes." },
{ d: "\\(\\frac{2}{3} \\div \\frac{4}{9} = \\frac{a}{2}\\). Tape \\(a\\).", ans: 3, ok: "On multiplie par l'inverse 9/4 : 2/3 · 9/4 = 18/12 = 3/2.", no: "Multiplie 2/3 par l'inverse de 4/9, puis simplifie." }],

retiens: { regle: "On multiplie les numérateurs entre eux et les dénominateurs entre eux. Prendre une fraction d'une fraction, c'est multiplier : « de » veut dire « fois ». Diviser par une fraction, c'est multiplier par son inverse.", exemple: ["Les \\(\\frac{2}{3}\\) de \\(\\frac{3}{4}\\) : \\(\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}\\).", "La moitié de \\(\\frac{4}{5}\\) : \\(\\frac{1}{2} \\cdot \\frac{4}{5} = \\frac{4}{10} = \\frac{2}{5}\\).", "Les \\(\\frac{3}{4}\\) de \\(\\frac{2}{5}\\) : \\(\\frac{6}{20} = \\frac{3}{10}\\).", "\\(\\frac{3}{4} \\div \\frac{1}{8} = \\frac{3}{4} \\cdot \\frac{8}{1} = 6\\) ; \\(\\frac{2}{3} \\div \\frac{4}{9} = \\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}\\)."], piege: "Pour multiplier, pas de dénominateur commun : on multiplie en haut et en bas." },
predict: { q: "Les 3/4 de 2/5 d'une tablette de chocolat, c'est…", choices: ["5/9 de la tablette", "3/10 de la tablette", "5/20 de la tablette"], good: 1, why: "On prend 3 quarts d'une part de 2 cinquièmes : 3/4 · 2/5 = 6/20 = 3/10. « De » veut dire « fois »." },
defis: ["Colorie les 2/3 de 3/4 du carré (règle les lignes).", "Colorie la moitié de 4/5.", "Colorie les 3/4 de 2/5."],
play: hunt({ label: "Lignes coloriées", start: 0, min: 0, max: 4,
show: (x, s) => { const [a, b, c, e] = [[3, 4, 2, 3], [4, 5, 1, 2], [2, 5, 3, 4]][s], r = Math.min(x, e), cw = 240 / b, rh = 120 / e; let g = "";
for (let i = 0; i < b; i++) for (let j = 0; j < e; j++) g += `<rect x="${40 + i * cw}" y="${10 + j * rh}" width="${cw}" height="${rh}" class="${i < a && j < r ? "f-fill" : i < a ? "f-fill2" : "f-soft"}" stroke="var(--ink)" stroke-width="0.8"/>`;
return svg(320, 140, g, "carré découpé") + `<div class="act-out">${r}/${e} de ${a}/${b} = ${r * a}/${e * b}${r ? " = <b>" + fr(r * a, e * b) + "</b>" : ""} du carré<br><span class="small muted">colonnes coloriées : ${a}/${b} ; cases doublement coloriées : ${r * a} sur ${e * b}</span></div>`; },
wins: [W(2, "2/3 · 3/4 = 6/12 = 1/2 : numérateurs entre eux, dénominateurs entre eux."), W(1, "1/2 · 4/5 = 4/10 = 2/5."), W(3, "3/4 · 2/5 = 6/20 = 3/10.")] }),
},
fracconv: {
predict: { q: "3/4 s'écrit en nombre décimal…", choices: ["0,34", "0,75", "3,4"], good: 1, why: "3/4, c'est 3 ÷ 4 = 0,75, soit 75 %. La barre de fraction n'est pas une virgule." },
defis: ["Trouve le pourcentage égal à 3/4.", "Trouve le pourcentage égal à 1/5.", "Trouve le pourcentage qui s'écrit 7/20."],
play: hunt({ ask: true, label: "Pourcentage", start: 50, min: 0, max: 100, step: 5,
show: (x) => { let g = ""; for (let k = 0; k < 100; k++) g += `<rect x="${60 + (k % 10) * 20}" y="${4 + Math.floor(k / 10) * 13}" width="19" height="12" class="${k < x ? "f-fill" : "f-soft"}"/>`;
return svg(320, 136, g, x + " cases sur 100") + `<div class="act-out">${x} % = ${x}/100 = <b>${fr(x, 100)}</b> = ${nb(x / 100)}</div>`; },
wins: [W(75, "75 % = 75/100 = 3/4 = 0,75."), W(20, "20 % = 20/100 = 1/5 = 0,2."), W(35, "35 % = 35/100 = 7/20 = 0,35 (on simplifie par 5).")] }),
},
puiss: {

retiens: { regle: "Chaque fois que l'exposant baisse de 1, on divise par \\(a\\). Ainsi \\(a^0 = 1\\) et \\(a^{-n} = \\frac{1}{a^n}\\). Même base : \\(a^m \\cdot a^n = a^{m + n}\\), \\(a^m \\div a^n = a^{m - n}\\) et \\((a^m)^n = a^{m \\cdot n}\\).", exemple: ["\\(2^3 = 8\\), \\(2^2 = 4\\), \\(2^1 = 2\\), \\(2^0 = 1\\)", "\\(2^{-1} = \\frac{1}{2}\\), \\(2^{-3} = \\frac{1}{8}\\)", "\\(2^5 \\cdot 2^3 = 2^8\\), \\(7^9 \\div 7^4 = 7^5\\), \\((5^3)^4 = 5^{12}\\)"], piege: "\\(-3^2 = -9\\) : le carré ne porte que sur 3. Mais \\((-3)^2 = 9\\)." },

plus: [{ d: "\\(2^5 \\cdot 2^3 = 2^n\\). Tape \\(n\\).", ans: 8, ok: "5 facteurs 2, puis 3 autres : 8 facteurs. On garde la base et on additionne les exposants : 2⁸.", no: "Compte les facteurs 2 : 5, puis encore 3." },
{ d: "\\(7^9 \\div 7^4 = 7^n\\). Tape \\(n\\).", ans: 5, ok: "4 facteurs 7 se simplifient : il en reste 9 − 4 = 5. On soustrait les exposants : 7⁵.", no: "Diviser par 7⁴ enlève 4 facteurs 7." },
{ d: "\\((5^3)^4 = 5^n\\). Tape \\(n\\).", ans: 12, ok: "(5³)⁴ = 5³ · 5³ · 5³ · 5³ : 4 fois 3 facteurs, soit 5¹². On multiplie les exposants.", no: "C'est 5³ écrit 4 fois." },
{ d: "Calcule \\(-3^2\\).", ans: -9, ok: "Le carré ne porte que sur 3 : −3² = −(3 · 3) = −9. Avec des parenthèses, (−3)² = 9.", no: "Sans parenthèses, l'exposant ne s'applique pas au signe −." }],
predict: { q: "Que vaut 2⁻³ ?", choices: ["−8", "1/8", "−6"], good: 1, why: "Chaque fois que l'exposant baisse de 1, on divise par 2 : 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4, 2⁻³ = 1/8." },
defis: ["Descends l'escalier jusqu'à 2⁰. Que vaut-il ?", "Trouve l'exposant qui donne 1/2.", "Trouve l'exposant qui donne 1/8."],
play: hunt({ label: "Exposant", start: 4, min: -4, max: 6,
show: (x) => { let rows = ""; for (let n = 6; n >= -4; n--) { const v = n >= 0 ? String(2 ** n) : "1/" + 2 ** -n; rows += `<div style="padding-left:${(6 - n) * 10}px;${n === x ? "font-weight:700;color:var(--blue)" : "opacity:.55"}">2${sup(n)} = ${v}${n > -4 ? ' <span class="small muted">÷ 2 ↓</span>' : ""}</div>`; }
return `<div class="act-out" style="text-align:left">${rows}</div>`; },
wins: [W(0, "2⁰ = 1 : c'est 2¹ ÷ 2. Toute puissance d'exposant 0 vaut 1."), W(-1, "2⁻¹ = 1 ÷ 2 = 1/2 : un exposant négatif donne l'inverse."), W(-3, "2⁻³ = 1/2³ = 1/8 : positif, mais plus petit que 1.")] }),
},
sci: {

retiens: { regle: "On place la virgule après le premier chiffre non nul : c'est \\(a\\), entre 1 et 10. L'exposant \\(n\\) compte de combien de rangs on a déplacé la virgule : positif pour un nombre plus grand que 10, négatif pour un nombre plus petit que 1.", exemple: ["\\(4\\text{'}500\\text{'}000 = 4{,}5 \\cdot 10^6\\).", "\\(450 = 4{,}5 \\cdot 10^2\\).", "\\(0{,}00052 = 5{,}2 \\cdot 10^{-4}\\)."] },
predict: { q: "0,00052 en notation scientifique, c'est…", choices: ["5,2 · 10⁴", "5,2 · 10⁻⁴", "52 · 10⁻⁵"], good: 1, why: "La virgule recule de 4 rangs pour arriver à 5,2 : le nombre est plus petit que 1, l'exposant est négatif, −4. 52 · 10⁻⁵ est juste en valeur, mais 52 n'est pas entre 1 et 10." },
defis: ["Écris 4'500'000 sous la forme 4,5 · 10ⁿ.", "Écris 0,00045 sous la forme 4,5 · 10ⁿ.", "Écris 450 sous la forme 4,5 · 10ⁿ."],
play: hunt({ ask: true, label: "Exposant n", start: 0, min: -8, max: 9,
show: (x, s) => { const t = [4500000, 0.00045, 450][s], v = 4.5 * 10 ** x, txt = (y) => (y >= 1 ? String(Math.round(y)).replace(/\B(?=(\d{3})+(?!\d))/g, "'") : y.toFixed(12).replace(/0+$/, "")).replace(".", ",");
return `<div class="act-out">4,5 · 10${sup(x)} = <b>${txt(v)}</b><br>cible : ${txt(t)} → ${ok(Math.abs(v - t) < 1e-12 * t, v < t)}</div>`; },
note: "Compte de combien de rangs la virgule se déplace.",
wins: [W(6, "4'500'000 = 4,5 · 10⁶ : la virgule avance de 6 rangs."), W(-4, "0,00045 = 4,5 · 10⁻⁴ : plus petit que 1, exposant négatif."), W(2, "450 = 4,5 · 10² : deux rangs.")] }),
},
scicalc: {

retiens: { regle: "Produit : on multiplie les nombres devant et on additionne les exposants. À la fin, on remet le nombre devant entre 1 et 10, en corrigeant l'exposant.", exemple: ["\\((3 \\cdot 10^4) \\cdot (2 \\cdot 10^5) = 6 \\cdot 10^9\\).", "\\((5 \\cdot 10^6) \\cdot (4 \\cdot 10^2) = 20 \\cdot 10^8 = 2 \\cdot 10^9\\)."] },
predict: { q: "(2 · 10³) · (4 · 10⁵) = ?", choices: ["8 · 10⁸", "8 · 10¹⁵", "6 · 10⁸"], good: 0, why: "On multiplie les nombres (2 · 4 = 8) et on additionne les exposants (3 + 5 = 8) : 10³ · 10⁵, c'est 3 + 5 facteurs 10." },
defis: ["(3 · 10⁴) · (2 · 10⁵) = 6 · 10ⁿ : trouve n.", "(4 · 10³) ÷ (8 · 10⁻²) = 5 · 10ⁿ : trouve n.", "(5 · 10⁶) · (4 · 10²) = 2 · 10ⁿ : trouve n."],
play: hunt({ ask: true, label: "n", start: 5, min: -4, max: 14,
show: (x, s) => { const [lab, m, t] = [["(3 · 10⁴) · (2 · 10⁵)", 6, 6e9], ["(4 · 10³) ÷ (8 · 10⁻²)", 5, 5e4], ["(5 · 10⁶) · (4 · 10²)", 2, 2e9]][s], v = m * 10 ** x;
return `<div class="act-out">${lab} = ${m} · 10${sup(x)} ? → ${ok(Math.abs(v - t) < 1e-6 * t, v < t)}</div>`; },
note: "Calcule d'abord avec les nombres, puis avec les exposants ; remets le nombre devant entre 1 et 10.",
wins: [W(9, "6 · 10⁹ : 3 · 2 = 6 et 4 + 5 = 9."), W(4, "4 ÷ 8 = 0,5 et 3 − (−2) = 5 : 0,5 · 10⁵ = 5 · 10⁴."), W(9, "5 · 4 = 20 et 6 + 2 = 8 : 20 · 10⁸ = 2 · 10⁹.")] }),
},
pyth: {
predict: { q: "Un triangle rectangle a des cathètes de 6 cm et 8 cm. Son hypoténuse mesure…", choices: ["14 cm", "10 cm", "48 cm"], good: 1, why: "6² + 8² = 36 + 64 = 100, et √100 = 10. On additionne les carrés, pas les côtés." },
defis: ["Cathètes 6 et 8 : calcule l'hypoténuse.", "Cathètes 5 et 12 : calcule l'hypoténuse.", "Hypoténuse 15 et cathète 9 : calcule l'autre cathète."],
play: hunt({ ask: true, label: "Longueur", start: 7, min: 1, max: 20,
show: (x, s) => { const [a, b, unk] = [[8, 6, "c"], [12, 5, "c"], [9, x, "b"]][s], k = 11, A = [40, 185], B = [40 + a * k, 185];
const C = [40, 185 - Math.min(unk === "b" ? x : b, 16) * k], hyp = unk === "c" ? x : 15, real = Math.hypot(B[0] - C[0], B[1] - C[1]) / k, ang = Math.atan2(B[1] - C[1], B[0] - C[0]), tip = [C[0] + Math.cos(ang) * hyp * k, C[1] + Math.sin(ang) * hyp * k];
const g = `<polyline points="${B.join(",")} ${A.join(",")} ${C.join(",")}" class="f-line" fill="none" stroke-width="2"/><rect x="40" y="173" width="12" height="12" class="f-line" fill="none"/><line x1="${C[0]}" y1="${C[1]}" x2="${tip[0].toFixed(1)}" y2="${tip[1].toFixed(1)}" class="f-accent" stroke-width="3"/>`;
const lhs = unk === "c" ? a * a + b * b : 81 + x * x, rhs = hyp * hyp;
return svg(320, 195, g, "triangle rectangle") + `<div class="act-out">${unk === "c" ? a + "² + " + b + "² = " + lhs + " ; " + x + "² = " + rhs : "9² + " + x + "² = " + lhs + " ; 15² = 225"} → ${ok(lhs === rhs, unk === "c" ? rhs < lhs : lhs < rhs)}</div>`; },
note: "Le trait coloré doit fermer exactement le triangle.",
wins: [W(10, "6² + 8² = 100 = 10² : l'hypoténuse mesure 10."), W(13, "5² + 12² = 169 = 13²."), W(12, "15² − 9² = 225 − 81 = 144 = 12² : pour une cathète, on soustrait.")] }),
},
pythfig: {

retiens: { regle: "Diagonale d'un rectangle : les deux côtés et la diagonale forment un triangle rectangle. Grande diagonale d'un pavé : \\(d^2 = a^2 + b^2 + c^2\\).", exemple: ["Rectangle 9 × 12 : \\(d = \\sqrt{81 + 144} = 15\\).", "Pavé 2 × 3 × 6 : \\(d = \\sqrt{4 + 9 + 36} = 7\\)."], piege: "La diagonale est l'hypoténuse : on additionne les carrés, puis on prend la racine." },
predict: { q: "Un rectangle mesure 6 cm sur 8 cm. Sa diagonale mesure…", choices: ["14 cm", "10 cm", "48 cm"], good: 1, why: "La diagonale coupe le rectangle en deux triangles rectangles : √(36 + 64) = √100 = 10." },
defis: ["Rectangle 9 × 12 : trouve la diagonale.", "Triangle isocèle de côtés 10, 10 et de base 12 : trouve la hauteur.", "Pavé 2 × 3 × 6 : trouve la grande diagonale."],
play: hunt({ ask: true, label: "Longueur", start: 5, min: 1, max: 20,
show: (x, s) => { const L = [["Triangle (9 ; 12 ; diagonale) : 9² + 12² = 225", 225, x * x, "diagonale² = " + x * x], ["Triangle (demi-base 6 ; hauteur ; côté 10) : 6² + h² = " + (36 + x * x), 100, 36 + x * x, "côté² = 100"], ["Pavé : 2² + 3² + 6² = 49", 49, x * x, "diagonale² = " + x * x]][s];
return `<div class="act-out">${L[0]}<br>${L[3]} → ${ok(L[1] === L[2], L[2] < L[1])}</div>`; },
wins: [W(15, "√225 = 15."), W(8, "La hauteur coupe la base en deux : 10² − 6² = 64, h = 8."), W(7, "4 + 9 + 36 = 49 = 7² : d = 7.")] }),
},
pythrec: {

retiens: { regle: "On calcule le carré du plus grand côté et la somme des carrés des deux autres. S'ils sont égaux, le triangle est rectangle (réciproque) ; sinon, il ne l'est pas.", exemple: ["5, 7, 9 : \\(25 + 49 = 74 \\neq 81\\), pas rectangle.", "6, 8, 10 : \\(36 + 64 = 100 = 10^2\\), rectangle.", "20, 21, 29 : \\(400 + 441 = 841 = 29^2\\), rectangle."] },
predict: { q: "Un triangle de côtés 5, 7 et 9 est-il rectangle ?", choices: ["Oui", "Non", "On ne peut pas savoir"], good: 1, why: "5² + 7² = 25 + 49 = 74, mais 9² = 81. Pas d'égalité : il n'est pas rectangle." },
defis: ["Côtés 6, 8 et x (le plus grand) : trouve x pour que le triangle soit rectangle.", "Côtés 7, x et 25 (25 le plus grand) : trouve x.", "Côtés 20, 21 et x (le plus grand) : trouve x."],
play: hunt({ ask: true, label: "x", start: 10, min: 1, max: 40,
show: (x, s) => { const [l, r, txt] = [[100, x * x, "6² + 8² = 100 ; x² = " + x * x], [49 + x * x, 625, "7² + x² = " + (49 + x * x) + " ; 25² = 625"], [841, x * x, "20² + 21² = 841 ; x² = " + x * x]][s];
return `<div class="act-out">${txt} → ${l === r ? '<b class="act-ok">égalité : rectangle</b>' : "pas d'égalité : pas rectangle"}</div>`; },
wins: [W(10, "6, 8, 10 : rectangle (le double de 3, 4, 5)."), W(24, "7² + 24² = 625 = 25²."), W(29, "20² + 21² = 841 = 29².")] }),
},
vol: {
predict: { q: "Combien de cubes de 1 cm³ faut-il pour remplir un pavé de 4 cm × 3 cm × 2 cm ?", choices: ["9", "24", "14"], good: 1, why: "Une couche de 4 · 3 = 12 cubes, et 2 couches : 24 cm³. Volume = aire de la base × hauteur." },
defis: ["Base 4 × 3 : combien de couches pour 36 cm³ ?", "Base 5 × 2 : combien de couches pour 70 cm³ ?", "Prisme de base triangulaire d'aire 6 cm² : quelle longueur pour 48 cm³ ?"],
play: hunt({ ask: true, label: "Couches (hauteur en cm)", start: 1, min: 1, max: 12,
show: (x, s) => { const [base, lab, t] = [[12, "4 × 3", 36], [10, "5 × 2", 70], [6, "triangle de 6 cm²", 48]][s]; let g = "";
for (let k = 0; k < x; k++) g += `<rect x="${60 + k * 3}" y="${118 - k * 9}" width="160" height="9" class="${k % 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.6"/>`;
return svg(320, 132, g, x + " couches") + `<div class="act-out">base ${lab} = ${base} cm² ; ${base} · ${x} = <b>${base * x} cm³</b> (cible ${t}) → ${ok(base * x === t, base * x < t)}</div>`; },
wins: [W(3, "12 · 3 = 36 cm³."), W(7, "10 · 7 = 70 cm³."), W(8, "6 · 8 = 48 cm³ : même règle pour un prisme, aire de la base × longueur.")] }),
},
volcone: {

retiens: { regle: "Pyramide et cône : \\(V = \\frac{1}{3} \\cdot A_{\\text{base}} \\cdot h\\) : il en faut 3 pour remplir le prisme (ou le cylindre) de même base et de même hauteur. Deux fois moins haut : deux fois moins de volume. Boule de rayon \\(r\\) : \\(V = \\frac{4}{3}\\pi r^3\\).", exemple: ["Pyramide base 6 × 6, hauteur 5 : \\(\\frac{36 \\cdot 5}{3} = 60\\).", "Cône \\(r = 3\\), \\(h = 4\\) : \\(\\frac{9\\pi \\cdot 4}{3} = 12\\pi\\).", "Cônes deux fois moins hauts : 6 pour remplir le cylindre.", "Boule de rayon 3 : \\(V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\)."], piege: "N'oublie pas le facteur \\(\\frac{1}{3}\\) (et \\(\\frac{4}{3}\\) pour la boule)." },

plus: [{ d: "Une boule de rayon 3 cm a pour volume \\(V = \\frac{4}{3}\\pi r^3 = k\\pi\\ \\text{cm}^3\\). Tape \\(k\\).", ans: 36, ok: "r³ = 27, et 4/3 · 27 = 36 : V = 36π cm³, environ 113 cm³.", no: "Calcule d'abord r³ = 3 · 3 · 3, puis multiplie par 4/3." }],
predict: { q: "Combien de pyramides (même base, même hauteur) faut-il pour remplir un prisme ?", choices: ["2", "3", "4"], good: 1, why: "Une pyramide vaut exactement le tiers du prisme de même base et même hauteur : V = ⅓ · base · hauteur." },
defis: ["Combien de cônes (même base, même hauteur) pour remplir le cylindre ?", "Combien de pyramides (même base, même hauteur) pour remplir le pavé ?", "Des cônes de même base, mais deux fois moins hauts : combien pour le cylindre ?"],
play: hunt({ ask: true, label: "Nombre de solides versés", start: 1, min: 1, max: 8,
show: (x, s) => { const d = s === 2 ? 6 : 3, pyr = s === 1, H = 100, hc = s === 2 ? H / 2 : H, lvl = Math.min(x / d, 1) * H, over = x > d, y0 = 125;
let g = `<text x="70" y="14" class="f-txt" text-anchor="middle" font-size="12">1 ${pyr ? "pyramide" : "cône"}</text>`;
g += pyr ? `<polygon points="30,${y0} 110,${y0} 70,${y0 - hc}" class="f-fill"/><polygon points="30,${y0} 110,${y0} 125,${y0 - 12} 70,${y0 - hc}" class="f-shape2" fill-opacity=".35"/>` : `<ellipse cx="70" cy="${y0}" rx="40" ry="9" class="f-fill"/><polygon points="30,${y0} 110,${y0} 70,${y0 - hc}" class="f-fill"/>`;
g += `<text x="225" y="14" class="f-txt" text-anchor="middle" font-size="12">${pyr ? "pavé" : "cylindre"} (même base, hauteur ${s === 2 ? "double" : "égale"})</text>`;
g += pyr ? `<rect x="185" y="${y0 - H}" width="80" height="${H}" class="f-soft" stroke="var(--ink)"/><rect x="185" y="${(y0 - lvl).toFixed(1)}" width="80" height="${lvl.toFixed(1)}" class="f-fill" fill-opacity=".8"/>`
: `<rect x="185" y="${y0 - H}" width="80" height="${H}" class="f-soft"/><rect x="185" y="${(y0 - lvl).toFixed(1)}" width="80" height="${lvl.toFixed(1)}" class="f-fill" fill-opacity=".8"/><ellipse cx="225" cy="${y0 - H}" rx="40" ry="8" class="f-shape2"/><path d="M185 ${y0 - H} V${y0} A40 8 0 0 0 265 ${y0} V${y0 - H}" class="f-line" fill="none"/>`;
for (let k = 1; k < d; k++) g += `<line x1="180" y1="${y0 - (k * H) / d}" x2="270" y2="${y0 - (k * H) / d}" class="f-line" stroke-dasharray="3 3" stroke-width=".6"/>`;
return svg(320, 140, g, "solide versé dans le récipient") + `<div class="act-out">${x} ${pyr ? "pyramide" : "cône"}${x > 1 ? "s" : ""} versé${x > 1 ? "s" : ""} : ${fr(Math.min(x, 99), d)} du ${pyr ? "pavé" : "cylindre"} → ${x === d ? '<b class="act-ok">plein exactement</b>' : over ? "ça déborde" : "pas encore plein"}</div>`; },
blank: (s) => `<div class="small muted">${["Imagine qu'on remplit un cône d'eau et qu'on le verse dans le cylindre.", "Même expérience avec une pyramide et un pavé.", "Cette fois, les cônes sont deux fois moins hauts que le cylindre."][s]}</div>`,
wins: [W(3, "3 cônes : un cône vaut le tiers du cylindre, V = ⅓ π r² h."), W(3, "3 pyramides : V = ⅓ · base · hauteur."), W(6, "Deux fois moins haut, deux fois moins de volume : chaque cône vaut 1/6 du cylindre.")] }),
},
airepyr: {

retiens: { regle: "Pyramide régulière à base carrée de côté \\(c\\) : la hauteur \\(h\\), le demi-côté \\(\\frac{c}{2}\\) et l'apothème \\(a\\) (la hauteur d'une face) forment un triangle rectangle : \\(a^2 = h^2 + \\left(\\frac{c}{2}\\right)^2\\). Aire latérale : 4 triangles de base \\(c\\) et de hauteur \\(a\\) ; aire totale : on ajoute la base \\(c^2\\).", exemple: ["\\(c = 6\\), \\(h = 4\\) : \\(a = \\sqrt{16 + 9} = 5\\).", "\\(c = 10\\), \\(h = 12\\) : \\(a = \\sqrt{144 + 25} = 13\\).", "\\(c = 6\\), \\(a = 5\\) : aire latérale \\(4 \\cdot \\frac{6 \\cdot 5}{2} = 60\\), aire totale \\(60 + 36 = 96\\)."] },

plus: [{ d: "Pyramide du « Devine » : base carrée de 6 cm, apothème 5 cm. Aire latérale (les 4 faces triangulaires), en cm² ?", ans: 60, ok: "Une face : 6 · 5 ÷ 2 = 15 cm². Quatre faces : 4 · 15 = 60 cm². L'apothème est la hauteur de chaque face.", no: "Chaque face est un triangle de base 6 et de hauteur 5 (l'apothème)." },


{ d: "Nouvelle pyramide : base carrée de 12 cm, hauteur 8 cm. Aire totale (4 faces et base), en cm² ?", ans: 384, ok: "Apothème : √(8² + 6²) = 10 cm (pas la hauteur 8 !). Quatre faces : 4 · 12 · 10 ÷ 2 = 240 cm². Plus la base 12 · 12 = 144 cm² : 384 cm².", no: "La hauteur d'une face est l'apothème, pas la hauteur 8 de la pyramide : calcule d'abord l'apothème avec Pythagore (8 et la moitié de 12)." }],
predict: { q: "Une pyramide à base carrée de 6 cm a une hauteur de 4 cm. Son apothème a (la hauteur d'une face triangulaire, en bleu) mesure…", fig: pyrFig(6, 4), choices: ["4 cm", "5 cm", "7 cm"], good: 1, why: "Hauteur, demi-côté et apothème forment un triangle rectangle : √(4² + 3²) = √25 = 5. L'apothème est plus long que la hauteur." },

defis: ["Nouvelle pyramide : base 10 cm, hauteur 12 cm. Tape l'apothème.", "Base 16 cm, hauteur 6 cm. Tape l'apothème.", "Base 8 cm, hauteur 3 cm. Tape l'apothème."],
play: hunt({ ask: true, label: "Apothème", start: 3, min: 1, max: 20,
blank: (s) => { const [c, h] = [[10, 12], [16, 6], [8, 3]][s]; return pyrFig(c, h); },
show: (x, s) => { const [c, h] = [[10, 12], [16, 6], [8, 3]][s], t = h * h + (c / 2) ** 2;
return pyrFig(c, h, x) + `<div class="act-out">hauteur² + demi-côté² = ${h}² + ${c / 2}² = ${t} ; apothème² = ${x}² = ${x * x} → ${ok(t === x * x, x * x < t)}${t === x * x ? `<br>aire latérale : 4 · (${c} · ${x}) ÷ 2 = <b>${2 * c * x} cm²</b>` : ""}</div>`; },
note: "Sous l'apothème, il y a le demi-côté de la base.",
wins: [W(13, "√(144 + 25) = 13 ; aire latérale 2 · 10 · 13 = 260 cm²."), W(10, "√(36 + 64) = 10 ; aire latérale 2 · 16 · 10 = 320 cm²."), W(5, "√(9 + 16) = 5 ; aire latérale 2 · 8 · 5 = 80 cm².")] }),
},
volcomp: {

retiens: { regle: "On repère les solides, on calcule chaque volume avec ses propres dimensions, puis on additionne. On garde \\(\\pi\\) en facteur jusqu'au bout.", exemple: ["Cube de 3 cm d'arête + pyramide de hauteur 3 : \\(27 + 9 = 36\\).", "Pour 39 en tout : pyramide de \\(39 - 27 = 12\\), donc \\(\\frac{9h}{3} = 12\\), \\(h = 4\\).", "Cylindre \\(r = 1\\), \\(h = 4\\) (\\(4\\pi\\)) + cône : \\(\\frac{\\pi h}{3} = 2\\pi\\), \\(h = 6\\)."], piege: "Le cône ou la pyramide n'a que le tiers du volume d'un cylindre ou d'un prisme de même base et de même hauteur." },
predict: { q: "Un cube de 3 cm d'arête est surmonté d'une pyramide de même base, haute de 3 cm. Volume total du solide ?", choices: ["36 cm³", "54 cm³", "30 cm³"], good: 0, why: "Cube : 3 · 3 · 3 = 27. Pyramide : ⅓ · 9 · 3 = 9. Total : 36 cm³. On additionne les volumes des parties." },
defis: ["On change la hauteur de la pyramide (même cube de 3 cm d'arête). Quelle hauteur donne 39 cm³ en tout ?", "Même cube : quelle hauteur de pyramide donne 45 cm³ en tout ?", "Cylindre (r = 1, h = 4) et cône de même base : quelle hauteur de cône pour 6π en tout ?"],
play: hunt({ ask: true, label: "Hauteur du toit", start: 1, min: 1, max: 12,
show: (x, s) => { if (s < 2) { const v = 27 + 3 * x, t = s ? 45 : 39; return `<div class="act-out">cube 27 + pyramide ⅓ · 9 · ${x} = 27 + ${3 * x} = <b>${v} cm³</b> (cible ${t}) → ${ok(v === t, v < t)}</div>`; }
const v = 4 + x / 3; return `<div class="act-out">cylindre 4π + cône ⅓ · π · 1² · ${x} = <b>${nb(v)}π</b> (cible 6π) → ${ok(Math.abs(v - 6) < 1e-9, v < 6)}</div>`; },
wins: [W(4, "27 + ⅓ · 9 · 4 = 27 + 12 = 39."), W(6, "27 + 18 = 45 : chaque cm de pyramide ajoute 3 cm³."), W(6, "4π + 2π = 6π : le cône de hauteur 6 vaut un cylindre de hauteur 2.")] }),
},
volmanq: {

retiens: { regle: "On écrit la formule, on remplace ce qu'on connaît, puis on isole la dimension cherchée.", exemple: ["Cylindre \\(r = 3\\), \\(V = 36\\pi\\) : \\(9\\pi h = 36\\pi\\), \\(h = 4\\).", "Pavé de base 5 × 4, \\(V = 140\\) : \\(20h = 140\\), \\(h = 7\\)."], piege: "\\(\\pi \\cdot 3^2 \\cdot h = 36\\pi\\) : on divise par \\(9\\pi\\), pas par 3." },
predict: { q: "Un cylindre de rayon 2 cm a un volume de 20π cm³. Sa hauteur mesure…", choices: ["5 cm", "10 cm", "4 cm"], good: 0, why: "π · 2² · h = 20π, donc 4h = 20 et h = 5. On remplace ce qu'on connaît, puis on isole h." },
defis: ["Cylindre de rayon 3 et de volume 36π : calcule la hauteur.", "Cône de rayon 3 et de volume 18π : calcule la hauteur.", "Pavé de base 5 × 4 et de volume 140 cm³ : calcule la hauteur."],
play: hunt({ ask: true, label: "Hauteur", start: 1, min: 1, max: 12,
show: (x, s) => { const [lab, v, t] = [["π · 3² · " + x, 9 * x, 36], ["⅓ · π · 3² · " + x, 3 * x, 18], ["5 · 4 · " + x, 20 * x, 140]][s];
return `<div class="act-out">${lab} = <b>${v}${s < 2 ? "π" : ""}</b> (cible ${t}${s < 2 ? "π" : ""}) → ${ok(v === t, v < t)}</div>`; },
wins: [W(4, "9h = 36, h = 4."), W(6, "3h = 18, h = 6 : le facteur ⅓ du cône compte."), W(7, "20h = 140, h = 7.")] }),
},
});
})();





(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;





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
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");

const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
return g; };
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;

const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 30, 310, 30); for (let v = -12; v <= 12; v++) g += L(X(v), 26, X(v), 34, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 50, String(v).replace("-", "−"), "middle", 10));
if (from !== null) g += `<circle cx="${X(from)}" cy="30" r="5" class="f-dot"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},22 Q${(X(from) + X(to)) / 2},2 ${X(to)},22" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="30" r="5" class="f-accent"/>`;
return svg(320, 58, g, "droite graduée"); };

const thal = (k, labs) => { const A = [30, 120], B = [290, 140], C = [230, 20], D = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k], E = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
let g = `<polygon points="${A} ${B} ${C}" class="f-shape"/>` + L(D[0], D[1], E[0], E[1], "f-accent", 2.4) + T(A[0] - 10, A[1] + 4, "A") + T(B[0] + 8, B[1] + 4, "B") + T(C[0] + 8, C[1], "C") + T(D[0], D[1] + 16, "D") + T(E[0] - 8, E[1] - 6, "E");
const mid = (P, Q, dy) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2 + dy];
for (const [k2, P, Q, dy] of [["AD", A, D, 16], ["DB", D, B, 16], ["AE", A, E, -8], ["EC", E, C, -8], ["DE", D, E, 0], ["BC", B, C, 0]]) if (labs[k2]) { const [x, y] = mid(P, Q, dy); g += T(x + (k2 === "DE" || k2 === "BC" ? 14 : 0), y, labs[k2], "middle", 12, /\?/.test(labs[k2]) ? "f-txt f-accent" : "f-txt"); }
return svg(320, 160, g, "configuration de Thalès"); };
const plain = (html) => `<div class="act-out">${html}</div>`;

Object.assign(ACTIVE, {
rel: {
predict: { q: "Combien font (−5) − (−8) ?", choices: ["−13", "3", "−3"], good: 1, why: "Soustraire −8, c'est ajouter 8 : −5 + 8 = 3. Sur la droite, on part de −5 et on avance de 8." },
defis: ["Calcule (−5) − (−8).", "Calcule −7 + 4.", "Calcule (−3) · (−4)."],
play: hunt({ ask: true, label: "Résultat",
blank: (s) => line([-5, -7, -3][s], null),
show: (x, s) => line([-5, -7, -3][s], x) + plain(["−5 − (−8) = −5 + 8", "−7 + 4 : signes contraires, 7 − 4 = 3, signe de −7", "(−3) · (−4) : même signe → positif, 3 · 4"][s] + " → tu proposes <b>" + nb(x) + "</b>"),
wins: [W(3, "Soustraire un négatif, c'est ajouter son opposé : −5 + 8 = 3."), W(-3, "On recule de 7 puis on avance de 4 : on arrive à −3."), W(12, "Moins fois moins donne plus : (−3) · (−4) = 12.")] }),
},
fracops: {

retiens: { regle: "On détermine le signe, puis on calcule. Un nombre pair de signes − donne un résultat positif, un nombre impair un résultat négatif. Multiplier : numérateurs entre eux, dénominateurs entre eux. Diviser : multiplier par l'inverse.", exemple: ["\\(\\left(-\\frac{3}{4}\\right) \\cdot 8 = -6\\)", "\\(\\left(-\\frac{6}{5}\\right) : \\left(-\\frac{3}{10}\\right) = \\frac{6}{5} \\cdot \\frac{10}{3} = 4\\)"], piege: "Trois facteurs négatifs donnent un résultat négatif : \\(\\left(-\\frac{2}{3}\\right) \\cdot \\left(-\\frac{3}{4}\\right) \\cdot \\left(-\\frac{1}{2}\\right) = -\\frac{1}{4}\\)." },
predict: { q: "Quel est le signe de (−2/3) · (−3/4) · (−1/2) ?", choices: ["positif", "négatif"], good: 1, why: "Trois facteurs négatifs : un nombre impair de signes − donne un résultat négatif (ici −1/4)." },
defis: ["Calcule (−3/4) · 8.", "Calcule 1/2 − 3/4 · 2/3.", "Calcule (−6/5) : (−3/10)."],
play: hunt({ ask: true, label: "Résultat (entier)",
show: (x, s) => plain(["(−3/4) · 8 = −(3 · 8)/4 = −24/4", "3/4 · 2/3 d'abord (priorité) = 6/12 = 1/2, puis 1/2 − 1/2", "(−6/5) · (−10/3) (on multiplie par l'inverse) = 60/15"][s] + "<br>tu proposes <b>" + nb(x) + "</b>"),
wins: [W(-6, "−24/4 = −6 : négatif fois positif donne négatif."), W(0, "La multiplication passe avant : 1/2 − 1/2 = 0."), W(4, "Diviser, c'est multiplier par l'inverse : (−6/5) · (−10/3) = 60/15 = 4, positif.")] }),
},
rac: {
predict: { q: "Combien vaut √(9 + 16) ?", choices: ["7", "5", "25"], good: 1, why: "On calcule d'abord sous la racine : √25 = 5. Ce n'est pas √9 + √16 = 3 + 4 = 7 !" },
defis: ["Agrandis le carré jusqu'à une aire de 49.", "Puis jusqu'à une aire de 81.", "Trouve le plus grand côté entier dont l'aire reste sous 50 (√50 est entre … et …)."],
play: hunt({ label: "Côté", start: 1, min: 1, max: 10,
show: (x, s) => { const u = 13; let g = ""; for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${30 + i * u}" y="${5 + j * u}" width="${u}" height="${u}" class="${x * x > 50 && s === 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.4"/>`;
return svg(320, 140, g, "carré de côté " + x) + plain("côté " + x + " → aire " + x + "² = <b>" + x * x + "</b>" + (s === 2 ? (x * x < 50 ? " (sous 50)" : " (dépasse 50)") : "")); },
wins: [W(7, "Côté 7 : 7² = 49, donc √49 = 7."), W(9, "√81 = 9."), (x) => (x === 7 ? "7² = 49 < 50 < 64 = 8² : donc 7 < √50 < 8." : "")] }),
},
angles: {
predict: { q: "Deux droites parallèles sont coupées par une sécante ; un angle mesure 70°. L'angle alterne-interne mesure…", choices: ["70°", "110°", "20°"], good: 0, why: "Avec des parallèles, les angles alternes-internes sont égaux : 70°. Les angles du même côté (co-intérieurs) sont supplémentaires : 70° + 110° = 180°." },
defis: ["Angle alterne-interne de 70° : sa mesure ?", "Angle co-intérieur (même côté, entre les parallèles) de 70° : sa mesure ?", "Un triangle a des angles de 48° et 75° : le troisième ?"],
play: hunt({ ask: true, label: "Mesure (en degrés)",
blank: (s) => s < 2 ? svg(320, 120, L(20, 30, 300, 30) + L(20, 90, 300, 90) + L(110, 120, 210, 0, "f-accent", 2) + T(200, 26, "70°", "start"), "parallèles et sécante") : svg(320, 120, `<polygon points="40,100 280,100 150,15" class="f-shape"/>` + T(60, 95, "48°", "start") + T(262, 95, "75°", "end") + T(150, 40, "?", "middle", 13, "f-txt f-accent"), "triangle"),
show: (x, s) => plain("tu proposes <b>" + nb(x) + "°</b>" + (s === 2 ? " ; somme : 48 + 75 + " + nb(x) + " = " + nb(123 + x) + "°" : "")),
wins: [W(70, "Alternes-internes et parallèles : angles égaux."), W(110, "Co-intérieurs : 70° + 110° = 180°."), W(57, "La somme des angles d'un triangle vaut 180° : 180 − 48 − 75 = 57.")] }),
},
cercthales: {
predict: { q: "Le triangle ABC est inscrit dans un cercle de diamètre [AB]. L'angle en C mesure…", choices: ["90°", "60°", "ça dépend de C"], good: 0, why: "C'est le cercle de Thalès : où que soit C sur le cercle, l'angle ACB est droit." },
defis: ["L'angle en A mesure 35° : combien mesure l'angle en B ?", "Diamètre AB = 10, AC = 6 : calcule BC.", "Un angle au centre mesure 100° : l'angle inscrit qui intercepte le même arc ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: () => svg(320, 150, `<circle cx="160" cy="80" r="62" class="f-soft" stroke="var(--ink)"/><polygon points="98,80 222,80 130,25" class="f-shape"/>` + T(90, 84, "A", "end") + T(230, 84, "B", "start") + T(126, 18, "C"), "cercle de Thalès"),
show: (x, s) => plain(["90 + 35 + " + nb(x) + " = " + nb(125 + x) + "°", "6² + " + nb(x) + "² = " + nb(36 + x * x) + " (il faut 10² = 100)", "angle inscrit = moitié de l'angle au centre ; tu proposes " + nb(x) + "°"][s]),
wins: [W(55, "Angle droit en C : 180 − 90 − 35 = 55°."), W(8, "Pythagore dans le triangle rectangle en C : 36 + 64 = 100."), W(50, "L'angle inscrit vaut la moitié de l'angle au centre : 50°.")] }),
},
thales: {
predict: { q: "(DE) ∥ (BC), AD = 2, AB = 6, BC = 9. Combien mesure DE ?", choices: ["3", "5", "4,5"], good: 0, why: "Le grand triangle est 3 fois plus grand (6 ÷ 2 = 3) : DE = 9 ÷ 3 = 3. On compare des rapports, pas des différences." },
defis: ["AD = 2, AB = 6, BC = 9 : calcule DE.", "Même figure, AC = 12 : calcule AE.", "Un bâton de 2 m a une ombre de 3 m ; l'ombre d'un arbre mesure 15 m. Hauteur de l'arbre ?"],
play: hunt({ ask: true, label: "Longueur",
blank: (s) => s < 2 ? thal(1 / 3, s === 0 ? { AD: "2", DB: "4", BC: "9", DE: "?" } : { AD: "2", DB: "4", AE: "?", EC: "AC = 12" }) : plain("bâton 2 m ↔ ombre 3 m ; arbre ? ↔ ombre 15 m"),
show: (x, s) => (s < 2 ? thal(1 / 3, s === 0 ? { AD: "2", DB: "4", BC: "9", DE: nb(x) } : { AD: "2", DB: "4", AE: nb(x), EC: "AC = 12" }) : "") + plain(["DE/BC = " + nb(x) + "/9 ; AD/AB = 2/6", "AE/AC = " + nb(x) + "/12 ; AD/AB = 2/6", "hauteur/ombre : " + nb(x) + "/15 ; bâton : 2/3"][s]),
wins: [W(3, "2/6 = 3/9 : DE = 3."), W(4, "AE = 12 ÷ 3 = 4."), W(10, "Ombre 5 fois plus longue (15 ÷ 3) : arbre 5 fois plus haut, 10 m.")] }),
},
thalesrec: {
predict: { q: "AD = 3, AB = 9, AE = 4, AC = 12. Les droites (DE) et (BC) sont-elles parallèles ?", choices: ["Oui", "Non"], good: 0, why: "AD/AB = 3/9 = 1/3 et AE/AC = 4/12 = 1/3 : les rapports sont égaux, donc (DE) ∥ (BC) (réciproque de Thalès)." },
defis: ["AD = 4, AB = 10, AE = 6 : quelle longueur AC rend (DE) ∥ (BC) ?", "AD = 5, AB = 15, AC = 21 : quelle longueur AE ?", "AD = 6, AC = 20, AE = 8 : quelle longueur AB ?"],
play: hunt({ ask: true, label: "Longueur",
blank: (s) => thal(0.4, [{ AD: "4", AE: "6", EC: "AC = ?" }, { AD: "5", DB: "AB = 15", AE: "?" }, { AD: "6", DB: "AB = ?", AE: "8" }][s]),
show: (x, s) => plain(["AD/AB = 4/10 ; AE/AC = 6/" + nb(x), "AD/AB = 5/15 ; AE/AC = " + nb(x) + "/21", "produits en croix : AD · AC = 120 ; AE · AB = 8 · " + nb(x) + " = " + nb(8 * x)][s]),
wins: [W(15, "4/10 = 6/15 = 0,4 : parallèles."), W(7, "5/15 = 7/21 = 1/3."), W(15, "6 · 20 = 8 · 15 = 120 : produits en croix égaux.")] }),
},
repere: {
predict: { q: "Où se trouve le point (−3 ; 2) ?", choices: ["en haut à gauche", "en bas à droite", "en haut à droite"], good: 0, why: "La 1re coordonnée (abscisse) se lit horizontalement : −3, à gauche. La 2e (ordonnée) verticalement : 2, en haut." },
defis: ["A(−4 ; 2) et B(6 ; 2) : abscisse du milieu de [AB] ?", "Distance entre C(1 ; 1) et D(1 ; −6) ?", "Symétrique de P(3 ; −5) par rapport à l'axe des abscisses : son ordonnée ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => { const X = (v) => 160 + v * 20, Y = (v) => 80 - v * 10; let g = L(20, 80, 300, 80) + L(160, 5, 160, 155); const pts = [[[-4, 2, "A"], [6, 2, "B"]], [[1, 1, "C"], [1, -6, "D"]], [[3, -5, "P"]]][s]; for (const [a, b, n] of pts) g += `<circle cx="${X(a)}" cy="${Y(b)}" r="4" class="f-dot"/>` + (X(a) > 230 ? T(X(a) - 8, Y(b) - 6, (n + "(" + a + " ; " + b + ")").replace(/-/g, "−"), "end", 11) : T(X(a) + 8, Y(b) - 6, (n + "(" + a + " ; " + b + ")").replace(/-/g, "−"), "start", 11));  return svg(320, 160, g, "repère"); },
show: (x, s) => plain(["milieu : (−4 + 6) ÷ 2", "même abscisse : on compte de 1 à −6", "symétrie par rapport à l'axe horizontal : l'abscisse reste, l'ordonnée change de signe"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(1, "(−4 + 6) ÷ 2 = 1."), W(7, "1 − (−6) = 7."), W(5, "Le symétrique est (3 ; 5).")] }),
},
tabval: {
predict: { q: "f(x) = 2x − 3. Combien vaut f(−1) ?", choices: ["−5", "−1", "5"], good: 0, why: "On remplace x par −1 : 2 · (−1) − 3 = −2 − 3 = −5." },
defis: ["Complète : f(4) = ?", "Complète : f(0) = ?", "Pour quel x a-t-on f(x) = 7 ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => tab([-1, 0, 1, 4], s),
show: (x, s) => tab([-1, 0, 1, 4], s, x),
wins: [W(5, "2 · 4 − 3 = 5."), W(-3, "2 · 0 − 3 = −3 : c'est l'ordonnée à l'origine."), W(5, "2x − 3 = 7 ⇔ 2x = 10 ⇔ x = 5 (on remonte le calcul).")] }),
},
simil: {
predict: { q: "On double tous les côtés d'un carré. Son aire est multipliée par…", choices: ["2", "4", "8"], good: 1, why: "Longueurs × 2, donc aire × 2 · 2 = 4 : on voit 4 copies du petit carré dans le grand." },
defis: ["Trouve le rapport k qui multiplie l'aire par 9.", "Puis l'aire par 16.", "Pour un cube, quel rapport multiplie le volume par 8 ?"],
play: hunt({ label: "Rapport k", start: 1, min: 1, max: 5,
show: (x, s) => { const u = 22; let g = ""; for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${40 + i * u}" y="${8 + j * u}" width="${u}" height="${u}" class="${i || j ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.6"/>`;
return svg(320, 124, g, "agrandissement de rapport " + x) + plain("k = " + x + " → longueurs × " + x + ", aire × " + x + "² = <b>" + x * x + "</b>, volume × " + x + "³ = <b>" + x ** 3 + "</b>"); },
wins: [W(3, "k = 3 : aire × 9 (k²)."), W(4, "k = 4 : aire × 16."), (x) => (x === 2 ? "k = 2 : volume × 2³ = 8 (k³)." : "")] }),
},
denombr: {

retiens: { regle: "Si on choisit d'abord parmi \\(a\\) possibilités, puis parmi \\(b\\), il y a \\(a \\cdot b\\) possibilités (c'est un arbre) : on multiplie, on n'additionne pas.", exemple: ["3 t-shirts et 4 pantalons : \\(3 \\cdot 4 = 12\\) tenues.", "6 personnes : \\(\\frac{6 \\cdot 5}{2} = 15\\) poignées de main."] },
predict: { q: "2 casquettes et 5 t-shirts : combien de tenues différentes ?", choices: ["7", "10", "25"], good: 1, why: "Chaque casquette se combine avec chacun des 5 t-shirts : 2 · 5 = 10 (arbre). On multiplie, on n'additionne pas." },
defis: ["3 t-shirts, 4 pantalons : nombre de tenues ?", "5 coureurs : nombre de podiums (or, argent, bronze) ?", "6 personnes se serrent toutes la main : nombre de poignées ?"],
play: hunt({ ask: true, label: "Nombre",
show: (x, s) => plain(["arbre : 3 branches, puis 4 sur chacune", "or : 5 choix, argent : 4, bronze : 3", "chacun serre 5 mains ; chaque poignée est comptée deux fois"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(12, "3 · 4 = 12."), W(60, "5 · 4 · 3 = 60 : sans répétition."), W(15, "6 · 5 ÷ 2 = 15.")] }),
},
proba: {
predict: { q: "On lance deux dés et on additionne. Quelle somme sort le plus souvent ?", choices: ["12", "7", "elles ont toutes la même chance"], good: 1, why: "7 s'obtient de 6 façons (1+6, 2+5, …, 6+1) sur 36, 12 d'une seule (6+6) : les sommes ne sont pas équiprobables." },
defis: ["Combien d'issues pour deux dés ?", "De combien de façons obtient-on 7 ?", "Et 10 ?"],
play: hunt({ ask: true, label: "Nombre",
blank: (s) => grid(s === 1 ? 7 : s === 2 ? 10 : 0),
show: (x, s) => grid(s === 1 ? 7 : s === 2 ? 10 : 0) + plain(s ? "cases coloriées : la somme vaut " + (s === 1 ? 7 : 10) + " ; tu proposes <b>" + nb(x) + "</b>" : "tableau 6 × 6 ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(36, "6 · 6 = 36 issues."), W(6, "6 façons sur 36 : P(7) = 6/36 = 1/6."), W(3, "4+6, 5+5, 6+4 : 3 façons, P(10) = 3/36 = 1/12.")] }),
},
carres: {

retiens: { regle: "Élever au carré, c'est multiplier un nombre par lui-même. Carrés à connaître : \\(11^2 = 121\\), \\(12^2 = 144\\), \\(13^2 = 169\\), \\(14^2 = 196\\), \\(15^2 = 225\\).", exemple: ["\\(\\sqrt{144} = 12\\)", "\\(0{,}3^2 = 0{,}09\\)", "\\(14^2 = 196 < 200 < 225 = 15^2\\)"] },
predict: { q: "Combien vaut 0,3² ?", choices: ["0,9", "0,09", "0,6"], good: 1, why: "0,3 · 0,3 = 0,09 : deux chiffres après la virgule. Élever au carré, c'est multiplier par lui-même, pas par 2 ni par 3." },
defis: ["Quel nombre positif a pour carré 144 ?", "Quel nombre positif a pour carré 121 ?", "Quel est le plus grand entier dont le carré est inférieur à 200 ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(nb(x) + "² = <b>" + nb(x * x) + "</b>" + (s === 2 ? (x * x < 200 ? " (sous 200)" : " (dépasse 200)") : "")),
wins: [W(12, "12² = 144 : √144 = 12."), W(11, "11² = 121 : √121 = 11."), W(14, "14² = 196 < 200 < 225 = 15².")] }),
},
pctvar: {
predict: { q: "Un prix augmente de 10 %, puis baisse de 10 %. À la fin, il est…", choices: ["revenu au prix de départ", "plus bas qu'au départ", "plus haut qu'au départ"], good: 1, why: "100 → 110 (× 1,1) → 99 (× 0,9) : la baisse de 10 % porte sur 110, un montant plus grand. × 1,1 × 0,9 = × 0,99." },
defis: ["Un article à 80 CHF augmente de 25 %. Nouveau prix ?", "Un article à 50 CHF baisse de 20 %. Nouveau prix ?", "Un prix passe de 40 à 50 CHF. Augmentation en % ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["80 · 1,25 (coefficient d'une hausse de 25 %)", "50 · 0,8 (coefficient d'une baisse de 20 %)", "hausse 10 CHF sur 40 CHF : 10/40"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(100, "80 · 1,25 = 100 CHF."), W(40, "50 · 0,8 = 40 CHF."), W(25, "10/40 = 0,25 = 25 % : on divise par le prix de DÉPART.")] }),
},
});

function tab(xs, s, x) { const f = (t) => 2 * t - 3; const cells = s === 2 ? [[x ?? "?", 7]] : xs.map((t) => [t, (s === 0 && t === 4) || (s === 1 && t === 0) ? (x ?? "?") : f(t)]);
return `<div class="act-out"><table style="margin:auto;border-collapse:collapse"><tr><th style="padding:4px 10px;border:1px solid var(--line)">x</th>${cells.map((c) => `<td style="padding:4px 10px;border:1px solid var(--line)">${nb(c[0]) === "NaN" ? c[0] : String(c[0]).replace("-", "−")}</td>`).join("")}</tr><tr><th style="padding:4px 10px;border:1px solid var(--line)">f(x) = 2x − 3</th>${cells.map((c) => `<td style="padding:4px 10px;border:1px solid var(--line)">${String(c[1]).replace("-", "−")}</td>`).join("")}</tr></table></div>`; }

function grid(t) { const u = 22; let g = ""; for (let i = 1; i <= 6; i++) { g += T(70 + i * u, 14, i) + T(56, 28 + i * u - 6, i); for (let j = 1; j <= 6; j++) g += `<rect x="${59 + i * u}" y="${10 + j * u - 6}" width="${u}" height="${u}" class="${i + j === t ? "f-fill" : "f-soft"}" stroke="var(--ink)" stroke-width="0.4"/>` + T(70 + i * u, 26 + j * u - 6 + 1, i + j, "middle", 9); }
return svg(320, 160, g, "tableau des sommes de deux dés"); }
})();







(function () {


const nb = (v) => { const s = String(+(+v).toFixed(6)); const [i, d] = s.replace("-", "").split("."); return (+v < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (d ? "," + d : ""); };
const n2 = (v) => (+v).toFixed(2).replace(".", ",");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
const P = (pts, cls = "f-shape") => `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" class="${cls}"/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;
const prop = (x, u = "") => " ; tu proposes <b>" + nb(x) + (u ? " " + u : "") + "</b>";


const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = o.ask ? null : o.start, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
const ctl = o.ask ? actAnswerHtml(o.label || "Ta réponse") : actStepper(o.label || "x", o.fmt ? o.fmt(x) : nb(x), "x");
box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
if (o.ask) {
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = String(+x.toFixed(6)).replace(".", ",");
const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/[\s'’]/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig, table") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
actAnswerBind(box, go);
} else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
};
const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");


const digs = (v, n, u) => { const [ip, dp = ""] = String(+Math.abs(v).toFixed(6)).split(".");
return Array.from({ length: n }, (_, j) => (j <= u ? ip[ip.length - 1 - (u - j)] ?? "" : dp[j - u - 1] ?? "")); };
const tab = (heads, v, u, cap) => { const c = v === null ? heads.map(() => "") : digs(v, heads.length, u), bd = (j) => (j === u ? ";border-right:3px solid var(--ink)" : "");
return `<div class="act-out"><table style="margin:auto;border-collapse:collapse;font-size:13px"><tr>${heads.map((hd, j) => `<th style="padding:2px 4px;border:1px solid var(--line);font-weight:400;font-size:11px${bd(j)}">${hd}</th>`).join("")}</tr><tr>${c.map((d, j) => `<td style="padding:3px 4px;border:1px solid var(--line);text-align:center;min-width:18px;height:20px${bd(j)}"><b>${d}</b></td>`).join("")}</tr></table>${cap ? `<div style="text-align:center;margin-top:4px">${cap}</div>` : ""}</div>`; };
const NUM = ["D", "U", "d", "c", "m"];

const zl = (lo, hi, st, labs, pts = []) => { const X = (v) => (20 + ((v - lo) / (hi - lo)) * 280).toFixed(1); let g = L(12, 34, 308, 34);
const n = Math.round((hi - lo) / st); for (let k = 0; k <= n; k++) g += L(X(lo + k * st), 29, X(lo + k * st), 39, "f-line", 0.8);
for (const v of labs) g += L(X(v), 25, X(v), 43, "f-line", 1.6) + T(X(v), 58, nb(v), "middle", 11);
for (const [v, cls, lab] of pts) if (v >= lo - 1e-9 && v <= hi + 1e-9) g += `<circle cx="${X(v)}" cy="34" r="5" class="${cls}"/>` + (lab ? T(X(v), 17, lab, "middle", 11, cls === "f-dot" ? "f-txt f-accent" : "f-txt") : "");
return svg(320, 64, g, "droite graduée"); };

const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 34, 310, 34); for (let v = -12; v <= 12; v++) g += L(X(v), 30, X(v), 38, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 54, nb(v), "middle", 10));
g += `<circle cx="${X(from)}" cy="34" r="5" class="f-fill"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},26 Q${(X(from) + X(to)) / 2},4 ${X(to)},26" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="34" r="5" class="f-dot"/>`;
return svg(320, 62, g, "droite graduée"); };

const col = (a, op, b, r) => `<div class="act-out" style="text-align:center"><table style="margin:auto;font-family:monospace;font-size:16px;border-collapse:collapse">
    <tr><td></td><td style="text-align:right">${n2(a)}</td></tr><tr><td>${op}</td><td style="text-align:right">${n2(b)}</td></tr>
    <tr><td></td><td style="text-align:right;border-top:2px solid var(--ink)"><b>${r === null ? "?" : nb(r)}</b></td></tr></table></div>`;

const bar = (tot, p, lab, showN) => { const n = Math.round(tot / p), w = 280; let g = `<rect x="20" y="20" width="${w}" height="24" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`;
if (showN) for (let k = 0; k < n; k++) g += `<rect x="${20 + (k * w) / n}" y="20" width="${w / n}" height="24" class="${k % 2 ? "f-fill2" : "f-fill"}" stroke="var(--ink)" stroke-width="0.4"/>`;
else g += `<rect x="20" y="20" width="${(w * p) / tot}" height="24" class="f-fill"/>`;
return svg(320, 62, g + T(160, 14, lab, "middle", 11) + T(20 + (w * p) / tot / 2, 58, nb(p), "middle", 10), "barre"); };

Object.assign(ACTIVE, {

decread: {
predict: { q: "Dans 4,357, que vaut le chiffre 5 ?", choices: ["5 dixièmes", "5 centièmes", "5 unités"], good: 1, why: "Après la virgule : dixièmes, puis centièmes, puis millièmes. 5 est au 2e rang : 5 centièmes, soit 0,05." },
defis: ["Écris en nombre décimal : \\(3 + \\frac{4}{10} + \\frac{7}{1000}\\).", "Combien y a-t-il de centièmes en tout dans 5,28 ?", "Écris \\(\\frac{2391}{100}\\) en nombre décimal."],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => s === 1 ? tab(NUM, 5.28, 1, "5,28 dans le tableau") : tab(NUM, null, 1, "D dizaines · U unités · d dixièmes · c centièmes · m millièmes"),
show: (x, s) => s === 1 ? tab(NUM, 5.28, 1, "5 unités = 500 centièmes" + prop(x)) : tab(NUM, x, 1, (s ? "2'391 centièmes" : "3 unités, 4 dixièmes, 7 millièmes") + prop(x)),
wins: [W(3.407, "3,407 : pas de centièmes, on écrit un 0 à leur place."), W(528, "5,28 = 528/100 : 528 centièmes en tout (le chiffre des centièmes, lui, est 8)."), W(23.91, "2'391 centièmes = 23 unités et 91 centièmes : 23,91.")] }),
},
deccomp: {
predict: { q: "Quel est le plus grand nombre ?", choices: ["4,5", "4,12", "ils sont égaux"], good: 0, why: "4,5 = 4,50 : 50 centièmes, c'est plus que 12 centièmes. Le nombre le plus long n'est pas forcément le plus grand." },
defis: ["Écris un nombre compris entre 2,7 et 2,8.", "Écris un nombre compris entre 0,09 et 0,1.", "Range 3,07 ; 3,7 ; 3,17 ; 3,071 du plus petit au plus grand. Lequel est 2e ?"],
play: hunt({ ask: true, label: "Un nombre",
blank: (s) => [zl(2.7, 2.8, 0.01, [2.7, 2.8]), zl(0.09, 0.1, 0.001, [0.09, 0.1]), zl(3, 3.8, 0.1, [3, 3.8])][s],
show: (x, s) => [zl(2.7, 2.8, 0.01, [2.7, 2.8], [[x, "f-dot", nb(x)]]), zl(0.09, 0.1, 0.001, [0.09, 0.1], [[x, "f-dot", nb(x)]]), zl(3, 3.8, 0.1, [3, 3.8], [[x, "f-dot", nb(x)]])][s] + plain(["2,7 = 2,70 et 2,8 = 2,80 : que mettre entre 70 et 80 centièmes ?", "0,1 = 0,100 et 0,09 = 0,090 : compare en millièmes", "complète avec des zéros : 3,070 ; 3,700 ; 3,170 ; 3,071"][s] + prop(x)),
wins: [(x) => (x > 2.7 && x < 2.8 ? nb(x) + " convient : entre 2,70 et 2,80, il y a 2,71 ; 2,75 ; 2,799… une infinité de nombres." : ""),
(x) => (x > 0.09 && x < 0.1 ? nb(x) + " convient : 0,09 = 0,090 et 0,1 = 0,100, on intercale en millièmes." : ""),
W(3.071, "3,070 < 3,071 < 3,170 < 3,700 : le 2e est 3,071.")] }),
},
decarr: {
predict: { q: "Arrondi au dixième, 7,96 devient…", choices: ["7,9", "8,0", "7,10"], good: 1, why: "Après les dixièmes vient 6 (de 5 à 9) : 9 dixièmes + 1 = 10 dixièmes = 1 unité. La retenue donne 8,0." },
defis: ["Arrondis 3,476 au centième.", "Encadre 12,738 entre deux dixièmes qui se suivent : tape le plus petit.", "Arrondis 59,97 au dixième."],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [zl(3.4, 3.5, 0.01, [3.4, 3.5], [[3.476, "f-fill", "3,476"]]), zl(12, 13, 0.1, [12, 13], [[12.738, "f-fill", "12,738"]]), zl(59.5, 60.5, 0.1, [59.5, 60, 60.5], [[59.97, "f-fill", "59,97"]])][s],
show: (x, s) => [zl(3.4, 3.5, 0.01, [3.4, 3.5], [[3.476, "f-fill", ""], [x, "f-dot", nb(x)]]), zl(12, 13, 0.1, [12, 13], [[12.738, "f-fill", ""], [x, "f-dot", nb(x)]]), zl(59.5, 60.5, 0.1, [59.5, 60, 60.5], [[59.97, "f-fill", ""], [x, "f-dot", nb(x)]])][s] + plain(["chiffre après les centièmes : 6", "12,738 est entre 12,7… et 12,8…", "chiffre après les dixièmes : 7 ; 9 dixièmes + 1 ?"][s] + prop(x)),
wins: [W(3.48, "Le chiffre suivant est 6 : on augmente les centièmes, 3,476 ≈ 3,48."), W(12.7, "12,7 < 12,738 < 12,8."), W(60, "9 dixièmes + 1 = 10 dixièmes : la retenue passe aux unités, 59,97 ≈ 60,0.")] }),
},
ordgr: {
predict: { q: "Sans calculer exactement : 48,7 · 21,2 vaut environ…", choices: ["100", "1'000", "10'000"], good: 1, why: "48,7 ≈ 50 et 21,2 ≈ 20 : 50 · 20 = 1'000. (Le résultat exact est 1'032,44.)" },
defis: ["Arrondis chaque terme à la centaine, puis calcule : 687 + 214 ≈ ?", "Arrondis chaque facteur à la dizaine, puis calcule : 39,6 · 51,3 ≈ ?", "Un camarade annonce 6,12 · 29,8 = 18,2376. Arrondis 6,12 à l'unité et 29,8 à la dizaine : ordre de grandeur ?"],
play: hunt({ ask: true, label: "Ordre de grandeur",
show: (x, s) => plain(["687 ≈ 700 et 214 ≈ 200", "39,6 ≈ 40 et 51,3 ≈ 50", "6,12 ≈ 6 et 29,8 ≈ 30"][s] + prop(x)),
wins: [W(900, "700 + 200 = 900 (valeur exacte 901)."), W(2000, "40 · 50 = 2'000 (valeur exacte 2'031,48)."), W(180, "6 · 30 = 180 : 18,2376 est 10 fois trop petit, la virgule est mal placée (valeur exacte 182,376).")] }),
},
decadd: {
predict: { q: "2,5 + 1,25 = ?", choices: ["3,30", "3,75", "1,50"], good: 1, why: "On additionne des chiffres de même rang : 2,50 + 1,25 = 3,75 (5 dixièmes + 2 dixièmes, 0 + 5 centièmes)." },
defis: ["Un sandwich à 6,80 CHF et une boisson à 2,45 CHF. Total (en CHF) ?", "Une planche de 2,4 m ; on en scie 0,75 m. Longueur restante (en m) ?", "Tu paies 15,35 CHF avec un billet de 20 CHF. Monnaie rendue (en CHF) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [col(6.8, "+", 2.45, null), col(2.4, "−", 0.75, null), col(20, "−", 15.35, null)][s],
show: (x, s) => [col(6.8, "+", 2.45, x), col(2.4, "−", 0.75, x), col(20, "−", 15.35, x)][s] + plain(["virgules alignées, on commence par les centièmes", "2,4 = 2,40 : on complète avec un zéro", "20 = 20,00"][s]),
wins: [W(9.25, "6,80 + 2,45 = 9,25 CHF."), W(1.65, "2,40 − 0,75 = 1,65 m."), W(4.65, "20,00 − 15,35 = 4,65 CHF. Vérifie : 15,35 + 4,65 = 20.")] }),
},
dec10: {

retiens: { regle: "\\(\\cdot\\,10\\) : la virgule avance d'un rang vers la droite ; \\(: 10\\) : elle recule d'un rang. Avec 100, deux rangs ; avec 1000, trois rangs. On complète avec des zéros si besoin.", exemple: ["\\(3{,}47 \\cdot 100 = 347\\)", "\\(0{,}806 \\cdot 100 = 80{,}6\\)", "\\(52{,}6 : 1000 = 0{,}0526\\)"], piege: "\\(4{,}5 : 100 = 0{,}045\\) : on complète avec un zéro pour reculer de deux rangs." },
predict: { q: "3,47 · 100 = ?", choices: ["34,7", "347", "3,4700"], good: 1, why: "Multiplier par 100, c'est rendre chaque chiffre 100 fois plus grand : chaque chiffre avance de deux rangs. 3 unités → 3 centaines." },
defis: ["Transforme 0,806 en 80,6.", "Transforme 52,6 en 0,0526.", "Transforme 4,5 en 0,045."],
play: hunt({ label: "Opération", start: 0, min: -3, max: 3, fmt: (x) => (x === 0 ? "aucune" : x > 0 ? "· " + nb(10 ** x) : "÷ " + nb(10 ** -x)),
show: (x, s) => { const N = [0.806, 52.6, 4.5][s], v = +(N * 10 ** x).toFixed(6);
return tab(["1'000", "100", "10", "1", "0,1", "0,01", "0,001", "0,0001"], v, 3, nb(N) + (x === 0 ? "" : x > 0 ? " · " + nb(10 ** x) : " ÷ " + nb(10 ** -x)) + " = <b>" + nb(v) + "</b>"); },
note: "Touche − ou + : les chiffres glissent d'un rang ; la virgule reste en place.",
wins: [W(2, "· 100 : chaque chiffre avance de deux rangs, 0,806 · 100 = 80,6."), W(-3, "÷ 1'000 : chaque chiffre recule de trois rangs, 52,6 ÷ 1'000 = 0,0526."), W(-2, "÷ 100 : 4,5 ÷ 100 = 0,045. C'est aussi 4,5 · 0,01.")] }),
},
decmul: {
predict: { q: "0,5 · 0,5 = ?", choices: ["2,5", "0,25", "1"], good: 1, why: "La moitié de 0,5, c'est 0,25. Multiplier par un nombre plus petit que 1 diminue." },
defis: ["Le grand carré a une aire de 1. Calcule 0,3 · 0,4 (l'aire colorée).", "Calcule 2,3 · 1,4.", "Un tissu coûte 12,50 CHF le mètre. Prix de 2,4 m (en CHF) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [grid(3, 4), rect4(false), bar(2.4, 1, "2,4 m de tissu · 12,50 CHF le mètre")][s],
show: (x, s) => [grid(3, 4) + plain("12 petits carrés sur 100 sont colorés" + prop(x)), rect4(true) + plain("2 + 0,8 + 0,3 + 0,12" + prop(x)), plain("2 m → 25 CHF ; 0,4 m → 0,4 · 12,50" + prop(x, "CHF"))][s],
wins: [W(0.12, "12 centièmes de l'aire : 0,3 · 0,4 = 0,12 (3 · 4 = 12, deux décimales)."), W(3.22, "23 · 14 = 322, une décimale + une décimale = deux : 3,22."), W(30, "12,50 · 2,4 = 30 CHF (25 + 5).")] }),
},
decdiv: {
predict: { q: "6 ÷ 0,5 = ?", choices: ["3", "12", "0,3"], good: 1, why: "Combien de demis dans 6 ? 12. Diviser par 0,5, c'est doubler : le quotient est plus grand que 6." },
defis: ["Une ficelle de 7,2 m est coupée en 3 morceaux égaux. Longueur d'un morceau (en m) ?", "Combien de verres de 0,25 L remplit-on avec une bouteille de 4,5 L ?", "Calcule 8,64 ÷ 2,4."],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [bar(7.2, 2.4, "ficelle de 7,2 m en 3 morceaux", true).replace(/>2,4</, ">?<"), bar(4.5, 0.25, "4,5 L · un verre = 0,25 L"), plain("8,64 ÷ 2,4 : rends le diviseur entier")][s],
show: (x, s) => [plain("7,2 ÷ 3 : 72 dixièmes ÷ 3" + prop(x, "m")), bar(4.5, 0.25, "1 L = 4 verres", true) + plain("4,5 ÷ 0,25 = 450 ÷ 25" + prop(x)), plain("8,64 ÷ 2,4 = 86,4 ÷ 24 (les deux · 10)" + prop(x))][s],
wins: [W(2.4, "7,2 ÷ 3 = 2,4 m. Vérifie : 3 · 2,4 = 7,2."), W(18, "4 verres par litre : 4,5 · 4 = 18 verres."), W(3.6, "86,4 ÷ 24 = 3,6. Vérifie : 2,4 · 3,6 = 8,64.")] }),
},
decprob: {
predict: { q: "3 cahiers à 2,40 CHF, payés avec un billet de 10 CHF. Quel calcul donne la monnaie ?", choices: ["10 − 3 · 2,40", "(10 − 3) · 2,40", "10 − 2,40 + 3"], good: 0, why: "D'abord le prix des cahiers (3 · 2,40 = 7,20), puis ce qui reste sur 10 : 10 − 7,20 = 2,80 CHF." },
defis: ["Un forfait de ski coûte 46,50 CHF par jour. Prix pour 4 jours (en CHF) ?", "4 amis partagent une pizza à 27,60 CHF. Part de chacun (en CHF) ?", "On coupe 3 morceaux de 1,35 m dans un ruban de 5 m. Longueur restante (en m) ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["4 · 46,50 ; estime : 4 · 50 = 200", "27,60 ÷ 4 ; estime : 28 ÷ 4 = 7", "d'abord 3 · 1,35, puis 5 − …"][s] + prop(x)),
wins: [W(186, "4 · 46,50 = 186 CHF."), W(6.9, "27,60 ÷ 4 = 6,90 CHF."), W(0.95, "3 · 1,35 = 4,05 m, puis 5 − 4,05 = 0,95 m.")] }),
},
pow9: {

retiens: { regle: "\\(a^n\\) est le produit de \\(n\\) facteurs égaux à \\(a\\).", exemple: ["\\(0{,}3^2 = 0{,}3 \\cdot 0{,}3 = 0{,}09\\)", "\\(2^4 + 3^2 = 16 + 9 = 25\\)"] },
predict: { q: "2³ = ?", choices: ["6", "8", "9"], good: 1, why: "2³ = 2 · 2 · 2 = 8 : trois facteurs égaux à 2. Ce n'est pas 2 · 3." },
garde: [1, 2],
defis: ["Calcule 5³.", "Calcule 0,3².", "Calcule 2⁴ + 3²."],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["5 · 5 · 5", "0,3 · 0,3 : une décimale + une décimale", "2 · 2 · 2 · 2, puis 3 · 3, puis la somme"][s] + prop(x)),
wins: [W(125, "5 · 5 · 5 = 125."), W(0.09, "0,3 · 0,3 = 0,09 (3 · 3 = 9, deux décimales)."), W(25, "2⁴ = 16 et 3² = 9 : 16 + 9 = 25. Les puissances passent avant l'addition.")] }),
},


ulong: {
predict: { q: "2,4 km = … m ?", choices: ["24 m", "240 m", "2'400 m"], good: 2, why: "1 km = 1'000 m : 2,4 km = 2,4 · 1'000 = 2'400 m. Vers une unité plus petite, le nombre grandit." },
defis: ["Un sentier mesure 3,25 km. Combien de mètres ?", "Une fourmi mesure 8 mm. Combien de centimètres ?", "Un camion porte 2,3 t de sable et 850 kg de gravier. Masse totale (en kg) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => s < 2 ? tab(LEN, null, s ? 5 : 3, s ? "réponse en cm" : "réponse en m") : tab(MAS, null, 3, "réponse en kg"),
show: (x, s) => [tab(LEN, x, 3, "3,25 km = 3 km + 250 m" + prop(x, "m")), tab(LEN, x, 5, "1 cm = 10 mm" + prop(x, "cm")), tab(MAS, x, 3, "2,3 t = 2'300 kg, puis + 850" + prop(x, "kg"))][s],
wins: [W(3250, "3,25 · 1'000 = 3'250 m."), W(0.8, "8 mm = 8 ÷ 10 = 0,8 cm : vers une unité plus grande, on divise."), W(3150, "2300 + 850 = 3'150 kg : on additionne dans la même unité.")] }),
},
uaire: {

retiens: { regle: "D'une unité d'aire à la suivante : \\(\\cdot\\,100\\). \\(1\\ \\text{m}^2 = 100\\ \\text{dm}^2 = 10'000\\ \\text{cm}^2\\). \\(1\\ \\text{ha} = 10'000\\ \\text{m}^2\\)." },
predict: { q: "1 m² = … cm² ?", choices: ["100 cm²", "1'000 cm²", "10'000 cm²"], good: 2, why: "Un carré de 1 m de côté, c'est 100 cm sur 100 cm : 100 · 100 = 10'000 carrés de 1 cm²." },
defis: ["Une feuille A4 mesure environ 6,2 dm². Combien de cm² ?", "Un appartement mesure 85 m². Combien de dm² ?", "Un champ mesure 3,5 ha. Combien de m² ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: () => sq10(),
show: (x, s) => sq10() + plain(["1 dm² = 10 · 10 cm²", "1 m² = 10 · 10 dm²", "1 ha = carré de 100 m sur 100 m"][s] + prop(x)),
wins: [W(620, "6,2 · 100 = 620 cm² : d'une unité d'aire à la suivante, · 100."), W(8500, "85 · 100 = 8'500 dm²."), W(35000, "3,5 · 10'000 = 35'000 m².")] }),
},
uvol: {

retiens: { regle: "Capacités : \\(1\\ \\text{L} = 10\\ \\text{dL} = 100\\ \\text{cL} = 1000\\ \\text{mL}\\). Un cube de 1 dm de côté contient 1 L : \\(1\\ \\text{dm}^3 = 1\\ \\text{L}\\).", exemple: ["\\(75\\ \\text{cL} = 750\\ \\text{mL}\\)", "\\(4{,}5\\ \\text{L} = 450\\ \\text{cL}\\), et \\(450 : 15 = 30\\) verres"], piege: "Mets les deux mesures dans la même unité avant de diviser : \\(4{,}5\\ \\text{L} = 450\\ \\text{cL}\\)." },
predict: { q: "Un cube de 1 dm de côté, rempli d'eau, contient…", choices: ["1 L", "1 dL", "10 L"], good: 0, why: "1 dm³ = 1 L : c'est la définition du litre. Une brique de lait de 1 L est presque un cube de 1 dm de côté." },
defis: ["Une bouteille contient 75 cL. Combien de mL ?", "Un aquarium a un volume de 0,12 m³. Combien de litres ?", "Combien de verres de 15 cL remplit-on avec un bidon de 4,5 L ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["1 cL = 10 mL", "1 m³ = 1'000 dm³ = 1'000 L", "4,5 L = 450 cL, puis ÷ 15"][s] + prop(x)),
wins: [W(750, "75 · 10 = 750 mL."), W(120, "0,12 · 1'000 = 120 L."), W(30, "4,5 L = 450 cL ; 450 ÷ 15 = 30 verres.")] }),
},


angtype: {
predict: { q: "Un angle de 200°, c'est un angle…", choices: ["obtus", "rentrant", "plat"], good: 1, why: "Obtus : entre 90° et 180°. Plat : 180°. Au-delà de 180° (et avant 360°), l'angle est rentrant." },
defis: ["Les deux angles forment un angle plat. L'un mesure 65°. Combien mesure l'autre ?", "Trois angles autour d'un point : 140°, 95° et ?", "Quel angle forment les aiguilles d'une montre à 4 h ?"],
play: hunt({ ask: true, label: "Mesure (en degrés)",
blank: (s) => [plat(), autour(), montre()][s],
show: (x, s) => [plat(), autour(), montre()][s] + plain(["angle plat : 180°", "angle plein : 360°", "12 intervalles de même angle sur le cadran ; de 12 h à 4 h : 4 intervalles"][s] + prop(x, "°")),
wins: [W(115, "65° + 115° = 180° : l'angle plat."), W(125, "140° + 95° + 125° = 360° : l'angle plein."), W(120, "360° ÷ 12 = 30° par heure ; 4 · 30° = 120°, un angle obtus.")] }),
},
quadri: {

retiens: { regle: "Parallélogramme : côtés opposés parallèles et égaux, angles consécutifs de somme \\(180°\\), diagonales qui se coupent en leur milieu. Losange : 4 côtés égaux. Rectangle : 4 angles droits, diagonales égales. Carré : losange et rectangle.", exemple: ["Losange de périmètre 36 cm : côté 9 cm", "Parallélogramme : un angle de 70°, le suivant de 110°", "Rectangle, \\(AC = 13\\) cm : \\(OB = 6{,}5\\) cm"] },
predict: { q: "Un carré est-il un losange ?", choices: ["Oui", "Non"], good: 0, why: "Un losange a 4 côtés égaux : le carré aussi. Le carré est à la fois un losange et un rectangle." },
defis: ["Un losange a un périmètre de 36 cm. Longueur d'un côté (en cm) ?", "Dans un parallélogramme, un angle mesure 70°. Combien mesure l'angle voisin (consécutif) ?", "Les diagonales du rectangle ABCD se coupent en O ; AC = 13 cm. Longueur OB (en cm) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [losange(), para(), rectDiag()][s],
show: (x, s) => [losange(), para(), rectDiag()][s] + plain(["4 côtés égaux", "deux angles consécutifs : somme 180°", "diagonales du rectangle : même longueur, coupées en leur milieu"][s] + prop(x)),
wins: [W(9, "36 ÷ 4 = 9 cm : les 4 côtés du losange sont égaux."), W(110, "70° + 110° = 180° : angles consécutifs supplémentaires."), W(6.5, "BD = AC = 13 cm et O est le milieu : OB = 6,5 cm.")] }),
},


perim: {
predict: { q: "On découpe un coin rectangulaire dans un rectangle. Le périmètre…", fig: svg(320, 110, P([[60, 10], [180, 10], [180, 45], [260, 45], [260, 100], [60, 100]]) + `<rect x="180" y="10" width="80" height="35" fill="none" stroke="var(--margin)" stroke-dasharray="4 3"/>`, "rectangle dont on a découpé un coin"),
choices: ["diminue", "ne change pas", "augmente"], good: 1, why: "Les deux bords du découpage remplacent exactement les deux bords enlevés (même longueur horizontale, même longueur verticale) : le périmètre ne change pas. L'aire, elle, diminue." },
defis: ["Rectangle de 7,5 cm sur 4 cm : périmètre (en cm) ?", "Un carré a un périmètre de 34 cm. Longueur de son côté (en cm) ?", "On pose une bordure autour de ce jardin en L. Longueur de la bordure (en m) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [rect("7,5 cm", "4 cm"), rect("?", "", true), jardinL()][s],
show: (x, s) => [rect("7,5 cm", "4 cm"), rect(nb(x) + " cm", "", true), jardinL()][s] + plain(["2 longueurs + 2 largeurs", "4 côtés égaux : 4 · côté = 34", "deux côtés ne sont pas marqués : 10 − 4 = 6 et 6 − 3 = 3"][s] + prop(x)),
wins: [W(23, "2 · (7,5 + 4) = 23 cm."), W(8.5, "34 ÷ 4 = 8,5 cm."), W(32, "6 + 3 + 4 + 3 + 10 + 6 = 32 m : autant que le rectangle de 10 m sur 6 m.")] }),
},
aire1: {
predict: { q: "Un triangle et un rectangle ont la même base et la même hauteur. L'aire du triangle est…", fig: svg(320, 100, `<rect x="70" y="10" width="180" height="80" class="f-soft" stroke="var(--ink)"/>` + P([[70, 90], [250, 90], [140, 10]]), "triangle dans un rectangle"),
choices: ["la même", "la moitié", "le double"], good: 1, why: "La hauteur coupe le rectangle en deux rectangles ; le triangle prend la moitié de chacun. Aire du triangle = base · hauteur ÷ 2." },
defis: ["Rectangle de 8 cm sur 3,5 cm : aire (en cm²) ?", "Triangle de base 9 cm et de hauteur 6 cm : aire (en cm²) ?", "Triangle rectangle : côtés de l'angle droit 5 cm et 12 cm, grand côté 13 cm. Aire (en cm²) ?"],
play: hunt({ ask: true, label: "Aire",
blank: (s) => [rect("8 cm", "3,5 cm"), triH(), triR()][s],
show: (x, s) => [rect("8 cm", "3,5 cm"), triH(), triR()][s] + plain(["longueur · largeur", "base · hauteur ÷ 2", "la hauteur sur la base 12 est le côté 5 ; 13 ne sert pas"][s] + prop(x, "cm²")),
wins: [W(28, "8 · 3,5 = 28 cm²."), W(27, "9 · 6 ÷ 2 = 27 cm²."), W(30, "5 · 12 ÷ 2 = 30 cm² : les deux côtés de l'angle droit sont base et hauteur.")] }),
},
aire2: {
predict: { q: "On découpe le triangle de gauche du parallélogramme et on le recolle à droite. On obtient…", fig: svg(320, 100, P([[50, 85], [210, 85], [270, 15], [110, 15]]) + L(110, 15, 110, 85, "f-accent", 2) + `<polygon points="210,85 270,85 270,15" fill="none" stroke="var(--margin)" stroke-dasharray="4 3"/>`, "parallélogramme découpé"),
choices: ["un rectangle", "un losange", "un triangle"], good: 0, why: "Le morceau recollé complète un rectangle de même base et de même hauteur : aire du parallélogramme = base · hauteur." },
defis: ["Parallélogramme : base 8 cm, côté oblique 6 cm, hauteur 5 cm. Aire (en cm²) ?", "Losange de diagonales 10 cm et 7 cm. Aire (en cm²) ?", "Un parallélogramme a une aire de 54 cm² et une base de 9 cm. Sa hauteur (en cm) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [paraH("8 cm", "5 cm", "6 cm"), losD(), paraH("9 cm", "?", "")][s],
show: (x, s) => [paraH("8 cm", "5 cm", "6 cm"), losD(), paraH("9 cm", nb(x) + " cm", "")][s] + plain(["base · hauteur ; le côté oblique ne sert pas", "le losange est la moitié du rectangle 10 sur 7", "base · hauteur = 54"][s] + prop(x)),
wins: [W(40, "8 · 5 = 40 cm² (et non 8 · 6)."), W(35, "10 · 7 ÷ 2 = 35 cm²."), W(6, "9 · 6 = 54 : la hauteur mesure 6 cm.")] }),
},
aire3: {
predict: { q: "Façade : rectangle de 6 m sur 4 m, surmonté d'un toit triangulaire de hauteur 3 m. Aire ?", fig: maison(6, 4, 3), choices: ["24 m²", "33 m²", "42 m²"], good: 1, why: "On découpe : rectangle 6 · 4 = 24, triangle 6 · 3 ÷ 2 = 9. Total 24 + 9 = 33 m²." },
defis: ["Façade carrée de 5 m de côté, toit triangulaire de hauteur 2 m. Aire (en m²) ?", "Cadre photo : extérieur 20 cm sur 15 cm, intérieur 16 cm sur 11 cm. Aire du cadre (en cm²) ?", "Terrain : un rectangle de 8 m sur 5 m et un triangle de base 3 m et de hauteur 5 m. Aire (en m²) ?"],
play: hunt({ ask: true, label: "Aire",
blank: (s) => [maison(5, 5, 2), cadre(), terrain()][s],
show: (x, s) => [maison(5, 5, 2), cadre(), terrain()][s] + plain(["carré + triangle", "grand rectangle − petit rectangle", "rectangle + triangle"][s] + prop(x)),
wins: [W(30, "25 + 5 · 2 ÷ 2 = 25 + 5 = 30 m²."), W(124, "20 · 15 − 16 · 11 = 300 − 176 = 124 cm²."), W(47.5, "8 · 5 + 3 · 5 ÷ 2 = 40 + 7,5 = 47,5 m².")] }),
},


relrep: {
predict: { q: "Quel est le plus petit nombre ?", choices: ["−7", "−3"], good: 0, why: "Sur la droite graduée, −7 est plus à gauche que −3 : −7 < −3, même si 7 > 3." },
defis: ["Quel nombre est repéré par le point A ?", "Il fait −8 °C le matin et 5 °C l'après-midi. De combien de degrés la température a-t-elle monté ?", "Range −2,5 ; 1 ; −3 ; −0,5 du plus petit au plus grand. Lequel est 2e ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [zl(-10, 5, 1, [0, 5], [[-6, "f-fill", "A"]]), zl(-10, 10, 1, [-10, -5, 0, 5, 10], [[-8, "f-fill", "matin"], [5, "f-fill", "après-midi"]]), zl(-4, 2, 0.5, [-4, -2, 0, 2])][s],
show: (x, s) => [zl(-10, 5, 1, [0, 5], [[-6, "f-fill", "A"], [x, "f-dot", nb(x)]]), zl(-10, 10, 1, [-10, -5, 0, 5, 10], [[-8, "f-fill", ""], [5, "f-fill", ""]]), zl(-4, 2, 0.5, [-4, -2, 0, 2], [[-2.5, "f-fill", ""], [1, "f-fill", ""], [-3, "f-fill", ""], [-0.5, "f-fill", ""], [x, "f-dot", nb(x)]])][s]
+ plain(["une graduation = 1 ; compte depuis 0", "de −8 à 0, puis de 0 à 5", "le plus à gauche est le plus petit"][s] + prop(x)),
wins: [W(-6, "A est 6 graduations à gauche de 0 : −6."), W(13, "8 degrés jusqu'à 0, puis 5 : 8 + 5 = 13 °C."), W(-2.5, "−3 < −2,5 < −0,5 < 1 : le 2e est −2,5.")] }),
},
reladd: {
predict: { q: "Il fait −3 °C. La température baisse de 5 °C. Il fait…", choices: ["−8 °C", "2 °C", "−2 °C"], good: 0, why: "On part de −3 et on recule encore de 5 : −3 − 5 = −8." },
defis: ["Calcule (−6) + 9.", "Calcule (−4) + (−7).", "Calcule 4 − (−6)."],
play: hunt({ ask: true, label: "Résultat",
blank: (s) => line([-6, -4, 4][s], null),
show: (x, s) => line([-6, -4, 4][s], x) + plain(["on part de −6 et on avance de 9", "on part de −4 et on recule de 7", "soustraire −6, c'est ajouter 6"][s] + prop(x)),
wins: [W(3, "Signes contraires : 9 − 6 = 3, signe du plus éloigné de zéro (9) : +3."), W(-11, "Même signe : 4 + 7 = 11, on garde le signe − : −11."), W(10, "4 − (−6) = 4 + 6 = 10.")] }),
},
});


const LEN = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
const MAS = ["t", "", "", "kg", "", "", "g"];

function grid(a, b) { const u = 12; let g = ""; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g += `<rect x="${100 + i * u}" y="${8 + j * u}" width="${u}" height="${u}" class="${i < a && j < b ? "f-fill" : "f-soft"}" stroke="var(--line)" stroke-width="0.5"/>`;
return svg(320, 140, g + T(100 + (a * u) / 2, 6 + 10 * u + 14, "0,3", "middle", 11) + T(96, 8 + (b * u) / 2 + 4, "0,4", "end", 11) + T(230, 70, "côté 1", "start", 11), "carré d'aire 1"); }

function rect4(full) { const k = 90, x0 = 40, y0 = 10, a = 2 * k, b = 0.3 * k, c = 1 * k, d = 0.4 * k; let g = `<rect x="${x0}" y="${y0}" width="${a}" height="${c}" class="f-fill2"/><rect x="${x0 + a}" y="${y0}" width="${b}" height="${c}" class="f-soft" stroke="var(--ink)"/><rect x="${x0}" y="${y0 + c}" width="${a}" height="${d}" class="f-soft" stroke="var(--ink)"/><rect x="${x0 + a}" y="${y0 + c}" width="${b}" height="${d}" class="f-fill2"/>`;
g += T(x0 + a / 2, y0 + c + d + 14, "2", "middle", 11) + T(x0 + a + b / 2, y0 + c + d + 14, "0,3", "middle", 11) + T(x0 - 4, y0 + c / 2, "1", "end", 11) + T(x0 - 4, y0 + c + d / 2 + 4, "0,4", "end", 11);
if (full) g += T(x0 + a / 2, y0 + c / 2 + 4, "2", "middle", 12) + T(x0 + a + b / 2, y0 + c / 2 + 4, "0,3", "middle", 10) + T(x0 + a / 2, y0 + c + d / 2 + 4, "0,8", "middle", 12) + T(x0 + a + b / 2 + 22, y0 + c + d / 2 + 4, "0,12", "start", 10);
return svg(320, 160, g, "rectangle 2,3 sur 1,4 découpé"); }

function sq10() { const u = 10; let g = ""; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g += `<rect x="${110 + i * u}" y="${6 + j * u}" width="${u}" height="${u}" class="${i || j ? "f-soft" : "f-fill"}" stroke="var(--line)" stroke-width="0.5"/>`;
return svg(320, 128, g + `<rect x="110" y="6" width="100" height="100" fill="none" stroke="var(--ink)" stroke-width="2"/>` + T(160, 122, "1 dm = 10 cm", "middle", 11) + T(222, 14, "1 cm²", "start", 11, "f-txt f-accent"), "carré de 1 dm découpé en carrés de 1 cm"); }
function plat() { return svg(320, 110, L(30, 95, 290, 95) + L(160, 95, 160 + 90 * Math.cos(65 * Math.PI / 180), 95 - 90 * Math.sin(65 * Math.PI / 180), "f-accent", 2.4) + T(205, 80, "65°", "middle", 12) + T(120, 80, "?", "middle", 13, "f-txt f-accent"), "angle plat partagé"); }
function autour() { const O = [160, 65], r = 55, ray = (a) => L(O[0], O[1], O[0] + r * Math.cos(a * Math.PI / 180), O[1] - r * Math.sin(a * Math.PI / 180), "f-line", 2), lab = (a, s, c) => T(O[0] + 32 * Math.cos(a * Math.PI / 180), O[1] - 32 * Math.sin(a * Math.PI / 180) + 4, s, "middle", 11, c);
return svg(320, 130, ray(0) + ray(140) + ray(235) + lab(70, "140°") + lab(187.5, "95°") + lab(297.5, "?", "f-txt f-accent"), "trois angles autour d'un point"); }
function montre() { const O = [160, 66], r = 56; let g = `<circle cx="${O[0]}" cy="${O[1]}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.6"/>`;
for (let k = 0; k < 12; k++) { const a = (k * 30 * Math.PI) / 180; g += L(O[0] + 48 * Math.sin(a), O[1] - 48 * Math.cos(a), O[0] + r * Math.sin(a), O[1] - r * Math.cos(a), "f-line", k % 3 ? 1 : 2.2); }
return svg(320, 130, g + L(O[0], O[1], O[0], O[1] - 46, "f-line", 2.4) + L(O[0], O[1], O[0] + 34 * Math.sin(Math.PI * 2 / 3), O[1] - 34 * Math.cos(Math.PI * 2 / 3), "f-accent", 3.2) + `<circle cx="${O[0]}" cy="${O[1]}" r="3" class="f-dot"/>` + T(O[0], O[1] - 60 + 22, "12", "middle", 10) + T(O[0] + 40 * Math.sin(Math.PI * 2 / 3) - 8, O[1] - 40 * Math.cos(Math.PI * 2 / 3) + 2, "4", "middle", 10), "montre à 4 heures"); }
function losange() { return svg(320, 130, P([[160, 8], [250, 65], [160, 122], [70, 65]]) + T(214, 30, "?", "start", 13, "f-txt f-accent") + T(160, 70, "périmètre 36 cm", "middle", 11), "losange"); }
function para() { return svg(320, 120, P([[50, 105], [220, 105], [280, 20], [110, 20]]) + T(78, 98, "70°", "start", 12) + T(206, 98, "?", "end", 13, "f-txt f-accent"), "parallélogramme"); }
function rectDiag() { return svg(320, 130, `<rect x="50" y="15" width="220" height="100" class="f-shape"/>` + L(50, 15, 270, 115, "f-line", 1.4) + L(270, 15, 50, 115, "f-accent", 2) + `<circle cx="160" cy="65" r="3" class="f-dot"/>` + T(42, 12, "A", "end") + T(278, 12, "B", "start") + T(278, 126, "C", "start") + T(42, 126, "D", "end") + T(160, 86, "O") + T(220, 104, "AC = 13 cm", "middle", 10), "rectangle et ses diagonales"); }
function rect(lw, lh, sq) { const w = sq ? 100 : 200, hh = sq ? 100 : 90; return svg(320, 130, `<rect x="${160 - w / 2}" y="10" width="${w}" height="${hh}" class="f-shape"/>` + T(160, 10 + hh + 16, lw, "middle", 12, /\?/.test(lw) ? "f-txt f-accent" : "f-txt") + (lh ? T(160 + w / 2 + 6, 10 + hh / 2 + 4, lh, "start", 12) : "") + (sq ? T(160, 10 + hh / 2 + 4, "carré", "middle", 11) : ""), "rectangle"); }
function jardinL() { const k = 20, X = (u) => 60 + u * k, Y = (v) => 10 + v * k;
return svg(320, 145, P([[X(0), Y(0)], [X(6), Y(0)], [X(6), Y(3)], [X(10), Y(3)], [X(10), Y(6)], [X(0), Y(6)]]) + T(X(5), Y(6) + 16, "10 m") + T(X(0) - 6, Y(3) + 4, "6 m", "end") + T(X(8), Y(3) - 6, "4 m") + T(X(6) - 6, Y(1.5) + 4, "3 m", "end"), "jardin en L"); }
function triH() { return svg(320, 120, P([[60, 100], [240, 100], [110, 15]]) + L(110, 15, 110, 100, "f-accent", 2) + `<rect x="110" y="92" width="8" height="8" fill="none" stroke="var(--margin)"/>` + T(150, 116, "9 cm") + T(104, 62, "6 cm", "end"), "triangle, base et hauteur"); }
function triR() { return svg(320, 120, P([[80, 100], [260, 100], [80, 25]]) + `<rect x="80" y="92" width="8" height="8" fill="none" stroke="var(--ink)"/>` + T(170, 116, "12 cm") + T(74, 66, "5 cm", "end") + T(178, 56, "13 cm", "start"), "triangle rectangle"); }
function paraH(b, h, c) { return svg(320, 120, P([[50, 100], [230, 100], [280, 20], [100, 20]]) + L(100, 20, 100, 100, "f-accent", 2) + `<rect x="100" y="92" width="8" height="8" fill="none" stroke="var(--margin)"/>` + T(140, 116, b) + T(94, 64, h, "end", 12, /\?/.test(h) ? "f-txt f-accent" : "f-txt") + (c ? T(264, 64, c, "start") : ""), "parallélogramme et sa hauteur"); }
function losD() { return svg(320, 130, P([[160, 8], [260, 65], [160, 122], [60, 65]]) + L(60, 65, 260, 65, "f-accent", 1.6) + L(160, 8, 160, 122, "f-accent", 1.6) + `<rect x="60" y="8" width="200" height="114" fill="none" stroke="var(--line)" stroke-dasharray="4 3"/>` + T(205, 60, "10 cm", "middle", 11) + T(166, 100, "7 cm", "start", 11), "losange et ses diagonales"); }
function maison(a, b, hh) { const k = 22, x0 = 160 - (a * k) / 2, yb = 10 + (b + hh) * k;
return svg(320, yb + 22, P([[x0, yb], [x0 + a * k, yb], [x0 + a * k, yb - b * k], [x0, yb - b * k]], "f-fill2") + P([[x0, yb - b * k], [x0 + a * k, yb - b * k], [160, 10]]) + L(160, 10, 160, yb - b * k, "f-accent", 1.4) + T(160, yb + 16, a + " m") + T(x0 + a * k + 6, yb - (b * k) / 2, b + " m", "start") + T(166, yb - b * k - 6, hh + " m", "start", 11), "façade de maison"); }
function cadre() { return svg(320, 140, `<rect x="60" y="10" width="200" height="110" class="f-fill2"/><rect x="80" y="25" width="160" height="80" class="f-soft" stroke="var(--ink)"/>` + T(160, 134, "20 cm (extérieur)") + T(266, 68, "15 cm", "start") + T(160, 70, "16 cm sur 11 cm", "middle", 11), "cadre photo"); }
function terrain() { const k = 22; return svg(320, 140, `<rect x="60" y="10" width="${8 * k}" height="${5 * k}" class="f-shape"/>` + P([[60 + 8 * k, 10], [60 + 11 * k, 10 + 5 * k], [60 + 8 * k, 10 + 5 * k]], "f-fill2") + T(60 + 4 * k, 10 + 5 * k + 16, "8 m") + T(54, 10 + 2.5 * k + 4, "5 m", "end") + T(60 + 9.5 * k, 10 + 5 * k + 16, "3 m"), "terrain : rectangle et triangle"); }
})();








(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;

const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls === "grid" ? "f-line" : cls}" style="stroke-width:${w}${cls === "grid" ? ";stroke:var(--line)" : ""}"${dash ? ' stroke-dasharray="4 3"' : ""}/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;



const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
box.innerHTML = fig + actAnswerHtml(o.label || "Ta réponse") + (o.note ? `<div class="small muted">${o.note}</div>` : "");
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/[\s']/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
x = v; const s0 = step; draw();
if (!check()) { const m = typeof o.miss === "function" ? o.miss(x, s0) : o.miss; $hint(box, m || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis le coup de pouce, puis recalcule.")); } };
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-6 ? msg : "");
const tdS = "padding:4px 10px;border:1px solid var(--line);text-align:center";

const table = (h1, h2, r1, r2) => `<div class="act-out" style="overflow-x:auto"><table style="margin:auto;border-collapse:collapse"><tr><th style="${tdS}">${h1}</th>${r1.map((c) => `<td style="${tdS}">${c}</td>`).join("")}</tr><tr><th style="${tdS}">${h2}</th>${r2.map((c) => `<td style="${tdS}">${c}</td>`).join("")}</tr></table></div>`;
const q = (x) => (x === null || x === undefined ? '<b style="color:var(--margin)">?</b>' : `<b style="color:var(--margin)">${nb(x)}</b>`);



const prism = (n, lab) => {
const cx = 160, rx = 78, ry = 22, yb = 140, yt = 52, off = n % 2 ? 0 : Math.PI / n;
const P = [...Array(n).keys()].map((k) => { const a = Math.PI / 2 + (2 * Math.PI * k) / n + off; return [cx + rx * Math.cos(a), ry * Math.sin(a)]; });
const xs = P.map((p) => p[0]), xmin = Math.min(...xs), xmax = Math.max(...xs);
const back = (p) => p[1] < -0.5 && p[0] > xmin + 0.5 && p[0] < xmax - 0.5;
let g = `<polygon points="${P.map((p) => p[0] + "," + (yt + p[1])).join(" ")}" class="f-fill2"/>`;
for (let k = 0; k < n; k++) {
const p = P[k], r = P[(k + 1) % n], hid = (p[1] + r[1]) / 2 < -0.5;
g += L(p[0], yb + p[1], r[0], yb + r[1], "f-line", 1.6, hid);
g += L(p[0], yt + p[1], p[0], yb + p[1], "f-line", 1.6, back(p));
}
for (const p of P) g += `<circle cx="${p[0]}" cy="${yt + p[1]}" r="2.6" class="f-dot"/><circle cx="${p[0]}" cy="${yb + p[1]}" r="2.6" class="f-dot"/>`;
return svg(320, 172, g + (lab ? T(160, 18, lab, "middle", 12) : ""), "prisme droit à base de " + n + " côtés");
};

const cuboid = (a, b, c, grid, labs) => {
const u = Math.min(26, 230 / (a + b * 0.5), 120 / (c + b * 0.5)), dx = u * 0.5, dy = u * 0.5, x0 = 44, y0 = 20 + c * u + b * dy;
const pt = (i, j, k) => [x0 + i * u + j * dx, y0 - k * u - j * dy];
const poly = (ps, cls) => `<polygon points="${ps.map((p) => p.join(",")).join(" ")}" class="${cls}" stroke="var(--ink)" stroke-width="1.4"/>`;
let g = poly([pt(0, 0, 0), pt(a, 0, 0), pt(a, 0, c), pt(0, 0, c)], "f-fill2") + poly([pt(0, 0, c), pt(a, 0, c), pt(a, b, c), pt(0, b, c)], "f-soft") + poly([pt(a, 0, 0), pt(a, b, 0), pt(a, b, c), pt(a, 0, c)], "f-shape");
const seg = (p, r) => L(p[0], p[1], r[0], r[1], "f-line", 0.7);
if (grid) {
for (let i = 1; i < a; i++) g += seg(pt(i, 0, 0), pt(i, 0, c)) + seg(pt(i, 0, c), pt(i, b, c));
for (let k = 1; k < c; k++) g += seg(pt(0, 0, k), pt(a, 0, k)) + seg(pt(a, 0, k), pt(a, b, k));
for (let j = 1; j < b; j++) g += seg(pt(0, j, c), pt(a, j, c)) + seg(pt(a, j, 0), pt(a, j, c));
}
if (labs) { const [la, lb, lc] = labs, A = pt(a / 2, 0, 0), B = pt(a, b / 2, 0), C = pt(0, 0, c / 2);
g += T(A[0], A[1] + 16, la) + T(B[0] + 8, B[1] + 8, lb, "start") + T(C[0] - 6, C[1] + 4, lc, "end"); }
return svg(320, y0 + 26, g, "pavé droit " + a + " sur " + b + " sur " + c);
};

const cubeNet = (lab) => { const s = 42, x0 = 76, y0 = 6; let g = "";
for (const [i, j] of [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]]) g += `<rect x="${x0 + j * s}" y="${y0 + i * s}" width="${s}" height="${s}" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>`;
g += T(x0 + 1.5 * s, y0 + s * 3 + 16, lab) ;
return svg(320, y0 + 3 * s + 24, g, "patron d'un cube"); };

const flow = (rows, opsL, opsR, hi = -1) => { let g = ""; const Y = [26, 76, 126];
rows.forEach(([l, r], i) => { if (!l) return; g += `<rect x="52" y="${Y[i] - 16}" width="92" height="26" rx="5" class="f-soft"/><rect x="176" y="${Y[i] - 16}" width="92" height="26" rx="5" class="f-soft"/>` + T(98, Y[i] + 2, l, "middle", 13) + T(222, Y[i] + 2, r, "middle", 13, i === hi || r.includes("?") ? "f-txt f-accent" : "f-txt") + T(160, Y[i] + 2, "→", "middle", 13); });
for (let i = 0; i < 2; i++) { if (opsL[i]) g += `<path d="M50,${Y[i] + 2} Q28,${(Y[i] + Y[i + 1]) / 2} 50,${Y[i + 1] - 6}" class="f-blue" fill="none" stroke-width="1.6"/>` + T(22, (Y[i] + Y[i + 1]) / 2 + 4, opsL[i], "middle", 12, "f-txt f-blue");
if (opsR[i]) g += `<path d="M270,${Y[i] + 2} Q292,${(Y[i] + Y[i + 1]) / 2} 270,${Y[i + 1] - 6}" class="f-blue" fill="none" stroke-width="1.6"/>` + T(300, (Y[i] + Y[i + 1]) / 2 + 4, opsR[i], "middle", 12, "f-txt f-blue"); }
return svg(320, rows[2][0] ? 146 : 96, g, "passage par l'unité"); };

const change2 = (eur, chf, hi) => { const M = Math.max(eur || 0, chf || 0, 100) * 1.1, X = (v) => 46 + (v * 256) / M;
let g = L(42, 44, 308, 44) + L(42, 104, 308, 104) + T(4, 48, "EUR", "start", 11, "f-txt f-blue") + T(4, 108, "CHF", "start", 11, "f-txt f-blue");
g += L(X(0), 38, X(0), 50) + L(X(0), 98, X(0), 110) + T(X(0), 32, "0", "middle", 11) + T(X(0), 124, "0", "middle", 11);
g += L(X(100), 44, X(95), 104, "f-line", 1, true) + `<circle cx="${X(100)}" cy="44" r="3.5" class="f-line"/><circle cx="${X(95)}" cy="104" r="3.5" class="f-line"/>` + T(X(100), 32, "100", "middle", 11) + T(X(95), 124, "95", "middle", 11);
if (eur !== null && chf !== null) g += L(X(eur), 44, X(chf), 104, "f-accent", 1.6, true);
if (eur !== null) g += `<circle cx="${X(eur)}" cy="44" r="5" class="f-dot"/>` + T(X(eur), 22, nb(eur), "middle", 13, hi === "e" ? "f-txt f-accent" : "f-txt");
if (chf !== null) g += `<circle cx="${X(chf)}" cy="104" r="5" class="f-dot"/>` + T(X(chf), 140, nb(chf), "middle", 13, hi === "c" ? "f-txt f-accent" : "f-txt");
else if (eur !== null) g += T(X(eur * 0.95), 140, "?", "middle", 14, "f-txt f-accent");
if (eur === null && chf !== null) g += T(X(chf / 0.95), 22, "?", "middle", 14, "f-txt f-accent");
return svg(320, 146, g, "double droite graduée euros et francs"); };
const chg = (e, c, hi) => { const ok = (v) => v !== null && isFinite(v) && v > 0 && v < 2000; return change2(ok(e) ? e : null, ok(c) ? c : null, hi); };

const rects = (w1, h1, w2, h2, labs, u) => { const x1 = 52, x2 = x1 + w1 * u + 56;
let g = `<rect x="${x1}" y="${150 - h1 * u}" width="${w1 * u}" height="${h1 * u}" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>` + T(x1 + (w1 * u) / 2, 166, labs[0]) + T(x1 - 4, 154 - (h1 * u) / 2, labs[1], "end");
if (h2 > 0 && w2 * u < 200 && h2 * u < 146) g += `<rect x="${x2}" y="${150 - h2 * u}" width="${w2 * u}" height="${h2 * u}" class="f-shape"/>` + T(x2 - 4, 154 - (h2 * u) / 2, labs[3], "end", 12, "f-txt f-accent");
else g += L(x2, 150, x2 + Math.min(w2 * u, 312 - x2), 150, "f-accent", 3) + (labs[3] ? T(x2 + 6, 120, labs[3], "start", 14, "f-txt f-accent") : "");
g += T(x2 + Math.min(w2 * u, 312 - x2) / 2, 166, labs[2]);
return svg(320, 172, g, "rectangle et son agrandissement"); };

const tri = (k, labs) => { const pts = (s, x0) => { const a = 12 * s, b = 10 * s, c = 8 * s, xa = (a * a + c * c - b * b) / (2 * a), ya = Math.sqrt(Math.max(0, c * c - xa * xa)); return [[x0, 100], [x0 + a, 100], [x0 + xa, 100 - ya]]; };
const draw = (P, cls, lb) => `<polygon points="${P.map((p) => p.join(",")).join(" ")}" class="${cls}"/>` + T((P[0][0] + P[1][0]) / 2, 116, lb[0]) + T((P[0][0] + P[2][0]) / 2 - 6, (P[0][1] + P[2][1]) / 2, lb[1], "end", 12, /\?/.test(lb[1]) ? "f-txt f-accent" : "f-txt") + T((P[1][0] + P[2][0]) / 2 + 6, (P[1][1] + P[2][1]) / 2, lb[2], "start");
let g = draw(pts(8.5, 20), "f-fill2", ["12 cm", "8 cm", "10 cm"]);
if (k > 0 && k < 1.15) g += draw(pts(8.5 * k, 190), "f-shape", labs);
else g += L(190, 100, 190 + 9 * 8.5, 100, "f-accent", 3) + T(190 + 4.5 * 8.5, 116, "9 cm") + T(190 + 3 * 8.5, 76, "?", "middle", 14, "f-txt f-accent");
return svg(320, 124, g, "triangle et sa réduction"); };

const bars = (xs, ys, yl, xl, hi) => { const M = Math.max(...ys), H = 110, bw = Math.min(46, 220 / xs.length), x0 = 60; let g = L(x0, 130, 310, 130) + L(x0, 130, x0, 10);
for (let v = 0; v <= M; v += M > 12 ? 5 : 1) g += L(x0 - 4, 130 - (v * H) / M, x0, 130 - (v * H) / M, "f-line", 1) + T(x0 - 7, 134 - (v * H) / M, v, "end", 10);
xs.forEach((x, i) => { const xc = x0 + 20 + i * (bw + 14); g += `<rect x="${xc}" y="${130 - (ys[i] * H) / M}" width="${bw}" height="${(ys[i] * H) / M}" class="${hi === i ? "f-fill" : "f-fill2"}"/>` + T(xc + bw / 2, 146, x, "middle", 11); });
return svg(320, 176, g + T(x0, 6 + 2, yl, "start", 10, "f-txt f-blue") + T(310, 166, xl, "end", 10, "f-txt f-blue"), "diagramme en colonnes"); };

const pie = (a, lab) => { const r = 62, cx = 160, cy = 76; let g = `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.4"/>`;
if (a > 0 && a < 360) { const t = ((a - 90) * Math.PI) / 180, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t); g += `<path d="M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${a > 180 ? 1 : 0} 1 ${x.toFixed(1)},${y.toFixed(1)} Z" class="f-fill"/>`; }
return svg(320, 156, g + T(cx, 152, lab, "middle", 12), "diagramme circulaire"); };

Object.assign(ACTIVE, {

solides: {

retiens: { regle: "Prisme droit de base à \\(n\\) côtés : \\(n + 2\\) faces (dont les 2 bases), \\(2n\\) sommets, \\(3n\\) arêtes.", exemple: ["Prisme à base triangulaire : 5 faces, 6 sommets, 9 arêtes", "Base à 5 côtés : 10 sommets ; 30 arêtes : base à 10 côtés"] },
predict: { q: "Une tente a la forme d'un prisme couché, à base triangulaire. Combien de faces a ce solide ?", choices: ["3", "5", "6"], good: 1,
why: "3 faces rectangulaires (les deux pans du toit et le sol), plus les 2 bases triangulaires (l'avant et l'arrière) : 5 faces. On oublie souvent les bases." },
defis: ["Ce prisme droit a une base à 5 côtés (un pentagone). Combien a-t-il de sommets ?", "Ce prisme droit a une base à 6 côtés (un hexagone). Combien a-t-il d'arêtes ?", "Un prisme droit a 30 arêtes. Combien de côtés a sa base ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => (s < 2 ? prism(s ? 6 : 5) : plain("Un prisme droit, des arêtes de trois sortes : celles de la base du bas, celles de la base du haut, et les arêtes verticales.")),
show: (x, s) => (s < 2 ? prism(s ? 6 : 5) + plain("tu proposes <b>" + nb(x) + "</b>") : (Number.isInteger(x) && x >= 3 && x <= 12 ? prism(x, "base à " + x + " côtés : " + 3 * x + " arêtes") : "") + plain("base à " + nb(x) + " côtés → " + nb(x) + " + " + nb(x) + " + " + nb(x) + " = <b>" + nb(3 * x) + "</b> arêtes (il en faut 30)")),
miss: (x, s) => (s === 0 && x === 5 ? "5, c'est la base du haut : compte aussi les sommets du bas." : s === 1 && x === 12 ? "Tu as compté les deux bases : il manque les arêtes verticales." : s === 2 && x === 15 ? "Avec 15 côtés, la base du haut aurait déjà 15 arêtes, celle du bas 15 aussi…" : ""),
wins: [W(10, "5 sommets en haut, 5 en bas : 10 sommets (2 · 5)."), W(18, "6 arêtes en haut, 6 en bas, 6 verticales : 18 arêtes (3 · 6)."), W(10, "30 = 3 · 10 : la base a 10 côtés (10 en haut, 10 en bas, 10 verticales).")] }),
},
volpave: {

retiens: { regle: "Pavé : \\(V = a \\cdot b \\cdot c\\) (le nombre de cubes-unités). Cube : \\(V = a^3\\), aire totale \\(6a^2\\) (6 faces carrées).", exemple: ["Pavé 8 × 5 × 3 cm : \\(V = 120\\ \\text{cm}^3\\)", "Cube d'arête 5 cm : aire \\(6 \\cdot 25 = 150\\ \\text{cm}^2\\)"] },
predict: { q: "Combien de petits cubes de 1 cm d'arête faut-il pour construire un cube de 2 cm d'arête ?", choices: ["4", "6", "8"], good: 2,
why: "Deux étages de 2 · 2 = 4 cubes : 2 · 2 · 2 = 8. Le cube a 6 faces, mais il est fait de 8 petits cubes." },
defis: ["Combien de cubes-unités forment ce pavé ?", "Un pavé mesure 8 cm × 5 cm × 3 cm. Quel est son volume (en cm³) ?", "Un cube a des arêtes de 5 cm. Quelle est l'aire totale de ses 6 faces (en cm²) ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [cuboid(4, 3, 2, true), cuboid(8, 5, 3, false, ["8 cm", "5 cm", "3 cm"]), cubeNet("chaque arête : 5 cm")][s],
show: (x, s) => [cuboid(4, 3, 2, true) + plain("un étage : 4 · 3 cubes ; il y a 2 étages · tu proposes <b>" + nb(x) + "</b>"), cuboid(8, 5, 3, true, ["8 cm", "5 cm", "3 cm"]) + plain("tu proposes <b>" + nb(x) + " cm³</b>"), cubeNet("chaque arête : 5 cm") + plain("6 faces carrées · tu proposes <b>" + nb(x) + " cm²</b>")][s],
miss: (x, s) => (s === 1 && x === 16 ? "8 + 5 + 3 : on n'additionne pas, on compte des cubes : longueur · largeur · hauteur." : s === 2 && x === 125 ? "125 cm³, c'est le volume. Ici on veut l'aire : la surface des 6 faces." : s === 2 && x === 25 ? "25 cm², c'est une seule face. Combien de faces ?" : ""),
wins: [W(24, "4 · 3 = 12 cubes par étage, 2 étages : 24 cubes, donc 24 cm³ si les cubes ont 1 cm d'arête."), W(120, "8 · 5 · 3 = 120 cm³ : 40 cubes par étage, 3 étages."), W(150, "Une face : 5 · 5 = 25 cm² ; 6 faces : 150 cm². Une aire se mesure en cm², un volume en cm³.")] }),
},


fracrep: {

retiens: { regle: "Même dénominateur : la plus grande a le plus grand numérateur. Dénominateurs différents : on amplifie pour avoir le même dénominateur.", exemple: ["\\(\\frac{2}{3} = \\frac{4}{6}\\)", "\\(\\frac{3}{4} = \\frac{9}{12} < \\frac{10}{12} = \\frac{5}{6}\\)"] },
predict: { q: "Quelle fraction est la plus grande : 1/3 ou 1/4 ?", choices: ["1/3", "1/4", "elles sont égales"], good: 0,
why: "Partager en 3 donne de plus grosses parts que partager en 4 : 1/3 > 1/4, même si 4 est plus grand que 3." },
defis: ["Place \\(\\frac{7}{4}\\) sur la droite graduée.", "La droite est maintenant graduée en sixièmes. Place \\(\\frac{2}{3}\\).", "En douzièmes, place la plus grande des deux fractions \\(\\frac{3}{4}\\) et \\(\\frac{5}{6}\\)."],
play(box, onWin) {
const D = [4, 6, 12];
let step = 0, k = 1;
const draw = () => {
const d = D[Math.min(step, 2)], X = (v) => 20 + (v * 280) / 2;
let g = L(14, 50, 306, 50);
for (let i = 0; i <= 2 * d; i++) { const big = i % d === 0; g += L(X(i / d), big ? 40 : 45, X(i / d), big ? 60 : 55, "f-line", big ? 1.8 : 1); if (big) g += T(X(i / d), 78, i / d, "middle", 13); }
g += `<circle cx="${X(k / d)}" cy="50" r="7" class="f-dot"/>` + T(X(k / d), 26, k + "/" + d, "middle", 13, "f-txt f-accent");
const ent = k % d === 0 ? " = " + k / d : "", enc = k % d ? " · entre " + Math.floor(k / d) + " et " + (Math.floor(k / d) + 1) : "";
box.innerHTML = svg(320, 88, g, "droite graduée de 0 à 2 en " + d + "es") + `<label class="dyn-ctl"><input type="range" min="0" max="${2 * d}" step="1" value="${k}" aria-label="déplacer le point"><span class="small muted">Fais glisser le point sur la droite.</span></label>
            <div class="act-out">Le point est sur <b>${k}/${d}</b>${ent}${enc}</div>`;
const inp = box.querySelector("input");
inp.oninput = () => { k = +inp.value; draw(); box.querySelector("input").focus(); check(); };
};
const check = () => {
if (step === 0 && k === 7) { onWin(0, "7/4 = 4/4 + 3/4 = 1 + 3/4 : entre 1 et 2."); step = 1; k = 1; draw(); }
else if (step === 1 && k === 4) { onWin(1, "2/3 = 4/6 : on a coupé chaque tiers en 2. Même point, autre écriture."); step = 2; k = 1; draw(); }
else if (step === 2 && k === 10) { onWin(2, "5/6 = 10/12 et 3/4 = 9/12 : avec le même dénominateur, on compare les numérateurs. 5/6 > 3/4."); step = 3; }
else if (step === 2 && k === 9) $hint(box, "9/12 = 3/4. Et 5/6, c'est combien de douzièmes ?");
else if (step === 0 && k === 4) $hint(box, "4/4, c'est 1. Il faut 7 quarts.");
};
draw();
},
},
fracsimp: {

retiens: { exemple: ["\\(\\frac{3}{4} = \\frac{9}{12}\\) (amplifiée par 3)", "\\(\\frac{12}{18} = \\frac{2}{3}\\) (simplifiée par 6)"], piege: "\\(\\frac{12}{18} = \\frac{6}{9}\\) est simplifiée, mais pas encore irréductible." },
predict: { q: "Compare 2/3 et 4/6.", choices: ["2/3 est plus grand", "elles sont égales", "4/6 est plus grand"], good: 1,
fig: svg(320, 64, (() => { let g = ""; for (const [a, b, y] of [[2, 3, 6], [4, 6, 36]]) for (let i = 0; i < b; i++) g += `<rect x="${20 + (i * 280) / b}" y="${y}" width="${280 / b}" height="22" class="${i < a ? "f-fill" : "f-soft"}" style="stroke:var(--ink);stroke-width:1.2"/>`; return g; })(), "barres 2 sur 3 et 4 sur 6"),
why: "Si on coupe chaque tiers en 2, on obtient des sixièmes : 2 tiers = 4 sixièmes. Même quantité, autre écriture." },
defis: ["Découpe les parts pour écrire \\(\\frac{3}{4}\\) avec le dénominateur 12.", "Regroupe les parts pour rendre \\(\\frac{12}{18}\\) irréductible.", "Passe de \\(\\frac{6}{8}\\) à \\(\\frac{9}{12}\\)."],
play(box, onWin) {
const S = [[3, 4], [12, 18], [6, 8]];
let step = 0, a = 3, b = 4, hist = ["3/4"];
const reset = () => { [a, b] = S[Math.min(step, 2)]; hist = [a + "/" + b]; };
const draw = (msg) => {
let g = "";
for (let i = 0; i < b; i++) g += `<rect x="${20 + (i * 280) / b}" y="8" width="${280 / b}" height="34" class="${i < a ? "f-fill" : "f-soft"}" style="stroke:var(--ink);stroke-width:${b > 24 ? 0.6 : 1.2}"/>`;
box.innerHTML = svg(320, 50, g, a + " parts coloriées sur " + b) + `<div class="act-out" style="text-align:center"><b>${hist.join(" = ")}</b></div>
            <div class="small muted">Découpe chaque part en</div><div class="seg">${[2, 3, 4, 5].map((k) => `<button type="button" data-cut="${k}"${b * k > 48 ? " disabled" : ""}>${k}</button>`).join("")}</div>
            <div class="small muted">Regroupe les parts par</div><div class="seg">${[2, 3, 5].map((k) => `<button type="button" data-grp="${k}">${k}</button>`).join("")}</div>
            <button type="button" class="btn-ghost small" data-reset>Recommencer</button>`;
box.querySelectorAll("[data-cut]").forEach((el) => (el.onclick = () => { const k = +el.dataset.cut; a *= k; b *= k; hist.push(a + "/" + b); draw(); check(); }));
box.querySelectorAll("[data-grp]").forEach((el) => (el.onclick = () => { const k = +el.dataset.grp;
if (a % k || b % k) { draw(); $hint(box, "Impossible : il faut pouvoir regrouper les " + a + " parts coloriées ET les " + b + " parts en paquets de " + k + "."); return; }
a /= k; b /= k; hist.push(a + "/" + b); draw(); check(); }));
box.querySelector("[data-reset]").onclick = () => { reset(); draw(); };
if (msg) $hint(box, msg);
};
const check = () => {
if (step === 0) { if (a === 9 && b === 12) { onWin(0, "3/4 = 9/12 : on a multiplié le numérateur ET le dénominateur par 3 (amplifier)."); step = 1; reset(); draw(); } else if (12 % b) draw(b + " ne divise pas 12 : en découpant encore, tu n'arriveras jamais à 12 parts. Recommence."); }
else if (step === 1) { if (gcd(a, b) === 1) { onWin(1, "12/18 = 2/3 : on a divisé par 2 puis par 3, donc par 6 (le PGDC de 12 et 18). On ne peut plus simplifier."); step = 2; reset(); draw(); } else if (b < 18) draw(a + "/" + b + " est simplifiée, mais on peut encore regrouper."); }
else if (step === 2 && a === 9 && b === 12) { onWin(2, "6/8 = 3/4 = 9/12 : on simplifie par 2, puis on amplifie par 3. Les trois fractions sont égales."); step = 3; }
};
draw();
},
},
fracper: {

retiens: { exemple: ["\\(\\frac{8}{3} = 2{,}666\\ldots\\)", "\\(1{,}222\\ldots = 1 + \\frac{2}{9} = \\frac{11}{9}\\)"] },
garde: [0, 2],
predict: { q: "Combien vaut 1 ÷ 3 ?", choices: ["0,3", "0,33", "0,333… (des 3 sans fin)"], good: 2,
why: "En posant 1 ÷ 3, le reste 1 revient à chaque étape : le chiffre 3 se répète sans fin. 0,33 = 33/100 est un peu plus petit que 1/3." },
defis: ["Calcule 8 ÷ 3. Quel chiffre se répète sans fin après la virgule ?", "Calcule 5 ÷ 11. Quel groupe de deux chiffres se répète ? (écris-le comme un nombre)", "On sait que \\(0{,}111\\ldots = \\frac{1}{9}\\). Écris \\(1{,}222\\ldots\\) comme une fraction de dénominateur 9 : quel est son numérateur ?"],
play: hunt({ ask: true, label: "Ta réponse",
show: (x, s) => plain(["8 ÷ 3 = 2, reste 2. On ajoute un 0 : 20 ÷ 3 = ? reste ? Le même reste revient-il ?", "5 ÷ 11 = 0, reste 5. 50 ÷ 11 = 4, reste 6. Puis 60 ÷ 11 = ? reste ? … jusqu'à retrouver le reste 5.", "1,222… = 1 + 0,222… ; et 0,222… = 2 · 0,111… = 2/9. Combien de neuvièmes dans 1 ?"][s]),

miss: (x, s) => ([0, 2][s] === 2 && x === 12 ? "1,222… n'est pas 12/9 : 12/9 = 1,333…" : [0, 2][s] === 2 && x === 2 ? "2/9 = 0,222… : il manque l'unité, 1 = 9/9." : ""),
wins: [W(6, "8 ÷ 3 = 2,666… : le reste 2 revient sans cesse, le 6 se répète."), W(45, "5 ÷ 11 = 0,454545… : les restes 5 et 6 alternent, la période est 45."), W(11, "1,222… = 9/9 + 2/9 = 11/9.")] }),
},


proptab: {
predict: { q: "Un taxi coûte 6 CHF au départ, puis 2 CHF par km. Le prix est-il proportionnel au nombre de km ?", choices: ["Oui", "Non"], good: 1,
why: "1 km coûte 6 + 2 = 8 CHF ; 2 km coûtent 6 + 4 = 10 CHF, pas le double (16 CHF). Il n'y a pas un nombre fixe par lequel multiplier : ce n'est pas proportionnel." },
defis: ["Le tableau est proportionnel. Par quel nombre multiplie-t-on la 1re ligne pour obtenir la 2e ?", "Une piste mesure 0,4 km : complète le tableau.", "Sans chercher le coefficient : 6 cahiers coûtent 15 CHF et 4 cahiers 10 CHF. Combien coûtent 10 cahiers ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [table("Masse (kg)", "Prix (CHF)", [4, 6, 10], [14, 21, 35]) + plain("4 · " + q() + " = 14"), table("Tours", "Distance (km)", [1, 5, 8], ["0,4", 2, q()]), table("Cahiers", "Prix (CHF)", [6, 4, 10], [15, 10, q()])][s],
show: (x, s) => [table("Masse (kg)", "Prix (CHF)", [4, 6, 10], [14, 21, 35]) + plain("4 · " + q(x) + " = " + nb(4 * x) + " ; 6 · " + q(x) + " = " + nb(6 * x)), table("Tours", "Distance (km)", [1, 5, 8], ["0,4", 2, q(x)]) + plain("1 tour → 0,4 km"), table("Cahiers", "Prix (CHF)", [6, 4, 10], [15, 10, q(x)]) + plain("Regarde la 1re ligne : 6 + 4 = 10.")][s],
miss: (x, s) => (s === 0 && x === 10 ? "14 − 4 = 10 est une différence. On cherche un facteur : 14 ÷ 4." : s === 1 && x === 5 ? "On n'ajoute pas 3 : on multiplie par 0,4." : ""),
wins: [W(3.5, "14 ÷ 4 = 3,5 ; vérifie : 6 · 3,5 = 21 et 10 · 3,5 = 35. Le coefficient est 3,5."), W(3.2, "8 · 0,4 = 3,2 km (et 5 · 0,4 = 2 km)."), W(25, "6 + 4 = 10 cahiers, donc 15 + 10 = 25 CHF : dans un tableau proportionnel, on peut additionner des colonnes.")] }),
},
prop: {

retiens: { piege: "Deux croissants de plus ne coûtent pas 2 CHF de plus : passe par le prix d'un croissant." },
predict: { q: "4 croissants coûtent 6 CHF. Combien coûtent 6 croissants ?", choices: ["8 CHF", "9 CHF", "12 CHF"], good: 1,
why: "1 croissant coûte 6 ÷ 4 = 1,50 CHF, donc 6 croissants : 6 · 1,50 = 9 CHF. Deux croissants de plus ne coûtent pas 2 CHF de plus." },
defis: ["5 m de tissu coûtent 42 CHF. Combien coûte 1 m ?", "Combien coûtent 8 m de ce tissu ?", "Une voiture consomme 6,3 L d'essence pour 90 km. Combien pour 250 km ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [flow([["5 m", "42 CHF"], ["1 m", "? CHF"], ["", ""]], ["÷ 5", ""], ["÷ 5", ""]), flow([["5 m", "42 CHF"], ["1 m", "8,4 CHF"], ["8 m", "? CHF"]], ["÷ 5", "· 8"], ["÷ 5", "· 8"]), flow([["90 km", "6,3 L"], ["10 km", "…"], ["250 km", "? L"]], ["÷ 9", "· 25"], ["÷ 9", "· 25"])][s],
show: (x, s) => [flow([["5 m", "42 CHF"], ["1 m", nb(x) + " CHF"], ["", ""]], ["÷ 5", ""], ["÷ 5", ""], 1) + plain("vérifie : 5 · " + nb(x) + " = " + nb(5 * x) + " (il faut 42)"), flow([["5 m", "42 CHF"], ["1 m", "8,4 CHF"], ["8 m", nb(x) + " CHF"]], ["÷ 5", "· 8"], ["÷ 5", "· 8"], 2), flow([["90 km", "6,3 L"], ["10 km", "…"], ["250 km", nb(x) + " L"]], ["÷ 9", "· 25"], ["÷ 9", "· 25"], 2) + plain("pour 10 km : 6,3 ÷ 9 = ?")][s],
miss: (x, s) => (s === 1 && x === 45 ? "On n'ajoute pas 3 m → 3 CHF : 8 m, c'est 8 fois 1 m." : s === 2 && Math.abs(x - 166.3) < 1e-6 ? "On n'ajoute pas 160 : on passe par 10 km, puis on multiplie." : ""),
wins: [W(8.4, "42 ÷ 5 = 8,40 CHF le mètre : on passe par l'unité."), W(67.2, "8 · 8,40 = 67,20 CHF."), W(17.5, "6,3 ÷ 9 = 0,7 L pour 10 km, puis 0,7 · 25 = 17,5 L. On peut passer par 10 km au lieu de 1 km.")] }),
},
change: {
predict: { q: "Ce jour-là, 1 EUR vaut 0,95 CHF. Tu changes 100 EUR. Tu reçois…", choices: ["plus de 100 CHF", "moins de 100 CHF", "exactement 100 CHF"], good: 1,
why: "Chaque euro vaut 0,95 CHF, un peu moins qu'un franc : 100 EUR = 100 · 0,95 = 95 CHF." },
defis: ["Avec 1 EUR = 0,95 CHF : combien de francs reçois-tu pour 60 EUR ?", "Combien d'euros reçois-tu pour 76 CHF ?", "Un vélo coûte 420 EUR en France et 410 CHF en Suisse. Combien coûte le vélo français en francs ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [chg(60, null), chg(null, 76), chg(420, null)][s],
show: (x, s) => [chg(60, x, "c") + plain("60 EUR → " + nb(x) + " CHF"), chg(x, 76, "e") + plain(nb(x) + " EUR → 76 CHF ; vérifie : " + nb(x) + " · 0,95 = " + nb(x * 0.95)), chg(420, x, "c") + plain("420 EUR → " + nb(x) + " CHF")][s],
miss: (x, s) => (s === 0 && Math.abs(x - 60 / 0.95) < 0.01 ? "Tu as divisé : des euros vers les francs, on multiplie par 0,95." : s === 1 && Math.abs(x - 72.2) < 1e-6 ? "Tu as multiplié : des francs vers les euros, on divise par 0,95." : s === 2 && Math.abs(x - 420 / 0.95) < 0.01 ? "Des euros vers les francs : on multiplie par 0,95." : ""),
wins: [W(57, "60 · 0,95 = 57 CHF : moins de francs que d'euros, car l'euro vaut moins d'un franc."), W(80, "76 ÷ 0,95 = 80 EUR ; vérifie : 80 · 0,95 = 76."), W(399, "420 · 0,95 = 399 CHF : 11 CHF de moins qu'en Suisse (410 CHF).")] }),
},
agrand: {
predict: { q: "On agrandit un rectangle de 4 cm sur 2 cm. Sa longueur passe de 4 cm à 6 cm. Sa largeur devient…", choices: ["4 cm", "3 cm", "2,5 cm"], good: 1,
why: "La longueur est multipliée par 6 ÷ 4 = 1,5 ; la largeur aussi : 2 · 1,5 = 3 cm. Ajouter 2 cm partout (largeur 4 cm) déformerait le rectangle." },
defis: ["Une photo de 10 cm sur 15 cm est agrandie : le côté de 10 cm devient 25 cm. Quel est le facteur d'agrandissement ?", "Avec ce facteur, que devient le côté de 15 cm ?", "Un triangle de côtés 12 cm, 10 cm et 8 cm est réduit : le côté de 12 cm devient 9 cm. Que devient le côté de 8 cm ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [rects(10, 15, 25, 0, ["10 cm", "15 cm", "25 cm", ""], 3.8), rects(10, 15, 25, 0, ["10 cm", "15 cm", "25 cm", "?"], 3.8), tri(0, [])][s],
show: (x, s) => [rects(10, 15, 10 * x, 15 * x, ["10 cm", "15 cm", nb(10 * x) + " cm", ""], 3.8) + plain("10 · " + nb(x) + " = " + nb(10 * x) + " cm (il faut 25 cm)"), rects(10, 15, 25, x, ["10 cm", "15 cm", "25 cm", nb(x) + " cm"], 3.8) + plain("la photo est-elle déformée ?"), tri(x / 8, ["9 cm", nb(x) + " cm", ""]) + plain("12 cm → 9 cm : facteur 9 ÷ 12 = ?")][s],
miss: (x, s) => (s === 0 && x === 15 ? "25 − 10 = 15 est une différence : un agrandissement multiplie." : s === 1 && x === 30 ? "On n'ajoute pas 15 cm : on multiplie par le facteur." : s === 2 && x === 5 ? "On n'enlève pas 3 cm : on multiplie par le facteur 9 ÷ 12." : ""),
wins: [W(2.5, "25 ÷ 10 = 2,5 : plus grand que 1, c'est un agrandissement."), W(37.5, "15 · 2,5 = 37,5 cm : la photo garde sa forme."), W(6, "Facteur 9 ÷ 12 = 0,75 (plus petit que 1 : réduction) ; 8 · 0,75 = 6 cm.")] }),
},


symetries: {
predict: { q: "Par la symétrie d'axe Oy (l'axe vertical), le point A(4 ; 1) a pour image…", choices: ["(−4 ; 1)", "(4 ; −1)", "(−4 ; −1)"], good: 0,
why: "L'axe vertical joue le rôle d'un miroir : le point passe de l'autre côté, à la même distance (4 carreaux) et à la même hauteur (1). Seule l'abscisse change de signe." },
defis: ["Touche l'image de B(−2 ; 3) par la symétrie d'axe Ox (l'axe horizontal).", "Touche l'image de C(3 ; 2) par la symétrie de centre O.", "Touche l'image de D(−1 ; −2) par la translation « 4 à droite, 3 en haut »."],
play(box, onWin) {
const Pts = [[-2, 3, "B"], [3, 2, "C"], [-1, -2, "D"]], Img = [[-2, -3], [-3, -2], [3, 1]];
const Hint = ["Le miroir est l'axe horizontal : même abscisse, et la même distance à l'axe, de l'autre côté.", "O est le milieu du segment entre le point et son image : même distance à O, à l'opposé.", "Compte 4 carreaux vers la droite, puis 3 vers le haut."];
let step = 0, tap = null; const done = [];
const draw = () => {
const s = Math.min(step, 2), u = 25, X = (v) => 160 + v * u, Y = (v) => 150 - v * u;
let g = "";
for (let v = -5; v <= 5; v++) g += L(X(v), Y(-5), X(v), Y(5), "grid", 1) + L(X(-5), Y(v), X(5), Y(v), "grid", 1);
g += L(X(-5.6), Y(0), X(5.6), Y(0), s === 0 && step < 3 ? "f-accent" : "f-line", s === 0 && step < 3 ? 2.6 : 1.4) + L(X(0), Y(5.6), X(0), Y(-5.6), "f-line", 1.4) + T(X(5.6), Y(0) - 6, "x", "end", 11) + T(X(0) + 6, Y(5.6) + 4, "y", "start", 11) + T(X(0) - 5, Y(0) + 14, "O", "end", 11);
if (s === 1 && step < 3) g += `<circle cx="${X(0)}" cy="${Y(0)}" r="5" class="f-dot"/>`;
if (s === 2 && step < 3) { const [a, b] = Pts[2]; g += `<path d="M${X(a)},${Y(b)} L${X(a + 4)},${Y(b)} L${X(a + 4)},${Y(b + 3)}" class="f-blue" fill="none" stroke-width="1.4" stroke-dasharray="4 3"/>`; }
for (const [P, Q] of done) g += L(X(P[0]), Y(P[1]), X(Q[0]), Y(Q[1]), "f-line", 1, true) + `<circle cx="${X(P[0])}" cy="${Y(P[1])}" r="4" class="f-fill2"/><circle cx="${X(Q[0])}" cy="${Y(Q[1])}" r="4" class="f-fill2"/>` + T(X(Q[0]) + 6, Y(Q[1]) - 6, P[2] + "'", "start", 11);
if (step < 3) { const [a, b, n] = Pts[s]; g += `<circle cx="${X(a)}" cy="${Y(b)}" r="6" class="f-fill"/>` + T(X(a) + 8, Y(b) - 8, n + "(" + String(a).replace("-", "−") + " ; " + String(b).replace("-", "−") + ")", "start", 12, "f-txt f-blue"); }
if (tap) g += `<circle cx="${X(tap[0])}" cy="${Y(tap[1])}" r="6" class="f-dot"/>`;
for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) g += `<circle class="act-pt" data-x="${a}" data-y="${b}" cx="${X(a)}" cy="${Y(b)}" r="11" fill="transparent" style="cursor:pointer"/>`;
box.innerHTML = svg(320, 300, g, "quadrillage, repère de −5 à 5") + `<div class="act-out">${tap ? "Tu as touché (" + String(tap[0]).replace("-", "−") + " ; " + String(tap[1]).replace("-", "−") + ")" : "Touche un nœud du quadrillage."}</div>`;
box.querySelectorAll(".act-pt").forEach((el) => (el.onclick = () => { tap = [+el.dataset.x, +el.dataset.y]; check(); }));
};
const check = () => {
if (step > 2) return;
const [a, b] = Img[step];
if (tap[0] === a && tap[1] === b) {
const P = Pts[step]; done.push([P, Img[step]]); tap = null;
const m = ["B(−2 ; 3) → B'(−2 ; −3) : l'abscisse reste, l'ordonnée change de signe.", "C(3 ; 2) → C'(−3 ; −2) : les deux coordonnées changent de signe.", "D(−1 ; −2) → D'(3 ; 1) : on ajoute 4 à l'abscisse et 3 à l'ordonnée."][step];
step++; draw(); onWin(step - 1, m);
} else { draw(); $hint(box, Hint[step]); }
};
draw();
},
},


diagr: {
predict: { q: "Trois notes : 6 ; 6 ; 3. Quelle est la moyenne ?", choices: ["4,5", "5", "6"], good: 1,
why: "(6 + 6 + 3) ÷ 3 = 15 ÷ 3 = 5. Le 6 compte deux fois : ce n'est pas (6 + 3) ÷ 2 = 4,5." },
defis: ["Points marqués par une joueuse de basket en 4 matchs : calcule sa moyenne par match.", "Notes d'un test : 3 élèves ont 4, 5 élèves ont 5 et 2 élèves ont 6. Quelle est la moyenne de la classe ?", "Sur 24 élèves, 9 viennent à vélo. Quel angle (en degrés) mesure le secteur « vélo » du diagramme circulaire ?"],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [bars(["match 1", "match 2", "match 3", "match 4"], [12, 18, 9, 21], "points", ""), bars(["4", "5", "6"], [3, 5, 2], "élèves", "note"), pie(0, "24 élèves : secteur « vélo » ?")][s],
show: (x, s) => [bars(["match 1", "match 2", "match 3", "match 4"], [12, 18, 9, 21], "points", "") + plain("tu proposes <b>" + nb(x) + "</b> · total des points ÷ nombre de matchs"), bars(["4", "5", "6"], [3, 5, 2], "élèves", "note") + plain("tu proposes <b>" + nb(x) + "</b> · somme de toutes les notes ÷ nombre d'élèves"), pie(x, "secteur de " + nb(x) + "° · le cercle entier : 360°")][s],
miss: (x, s) => (s === 1 && x === 5 ? "(4 + 5 + 6) ÷ 3 = 5 oublie les effectifs : 3 notes de 4, 5 notes de 5, 2 notes de 6." : s === 1 && Math.abs(x - 49 / 3) < 0.01 ? "On divise par le nombre d'élèves (10), pas par le nombre de notes différentes (3)." : s === 2 && x === 9 ? "9 élèves sur 24 : quelle part des 360° ?" : ""),
wins: [W(15, "12 + 18 + 9 + 21 = 60 points ; 60 ÷ 4 = 15 points par match."), W(4.9, "3 · 4 + 5 · 5 + 2 · 6 = 49 ; 49 ÷ 10 élèves = 4,9."), W(135, "9/24 de 360° : 360 ÷ 24 = 15° par élève, 9 · 15 = 135°.")] }),
},
});
})();








(function () {


const nb = (v) => { const s = String(+(+v).toFixed(4)); const [i, d] = s.replace("-", "").split("."); return (v < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (d ? "," + d : ""); };
const ok = (good, low) => (good ? '<b class="act-ok">✓ juste</b>' : low ? "trop petit" : "trop grand");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;
const Q = (x) => (x === null || x === undefined ? "?" : nb(x));
const QC = (x) => (x === null || x === undefined ? "f-txt f-accent" : "f-txt");


const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = null, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
const lab = typeof o.label === "function" ? o.label(s) : o.label || "Ta réponse";
box.innerHTML = fig + actAnswerHtml(lab) + (o.note ? `<div class="small muted">${o.note}</div>` : "");
const inp = box.querySelector(".act-in");
const go = () => {
const raw = String(inp.value).replace(/π|pi/gi, "").replace(/['’\s]/g, "").replace(/,/g, ".").replace("−", "-");
const v = Number(raw.replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
if (raw === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
x = v; draw(); if (!check()) $hint(box, o.miss || "Pas encore : regarde la figure, puis recalcule.");
};
actAnswerBind(box, go);
};
const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");

const box3 = (x, y, w, h, dx, dy, cls = "f-fill2") => `<polygon points="${x},${y - h} ${x + w},${y - h} ${x + w + dx},${y - h + dy} ${x + dx},${y - h + dy}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
+ `<polygon points="${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
+ `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" class="${cls}" stroke="var(--ink)" stroke-width="1.2"/>`;

const P = (cx, cy, r, a) => [+(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1), +(cy - r * Math.sin((a * Math.PI) / 180)).toFixed(1)];



const roue = () => { const r = 26, cx = 40, cy = 56, u = Math.PI * 2 * r; let g = L(10, cy + r, 315, cy + r);
g += `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="2"/>` + L(cx - r, cy, cx + r, cy, "f-accent", 2) + T(cx, cy - 6, "70 cm", "middle", 11);
g += `<circle cx="${cx + u}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"/>`;
g += `<path d="M${cx},${cy + r + 12} H${cx + u}" class="f-accent" stroke-width="2" fill="none"/>` + L(cx, cy + r + 7, cx, cy + r + 17, "f-accent", 2) + L(cx + u, cy + r + 7, cx + u, cy + r + 17, "f-accent", 2) + T(cx + u / 2, cy + r + 28, "1 tour = ?", "middle", 12, "f-txt f-accent");
return svg(320, 118, g, "roue de 70 cm de diamètre qui fait un tour"); };

const disc = (s) => { const cx = 160, cy = 78, R = 62; let g = "";
if (s === 0) g = `<circle cx="${cx}" cy="${cy}" r="${R}" class="f-soft" stroke="var(--ink)" stroke-width="2.4"/>` + L(cx, cy, cx + R, cy, "f-accent", 2) + T(cx + R / 2, cy - 6, "6 cm") + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>`;
else if (s === 1) g = `<circle cx="${cx}" cy="${cy}" r="${R}" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(cx - R, cy, cx + R, cy, "f-accent", 2) + T(cx, cy - 6, "30 cm") + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>`;
else { const cy2 = 120, R2 = 92, [ax, ay] = P(cx, cy2, R2, 30), [bx, by] = P(cx, cy2, R2, 150), [lx, ly] = P(cx, cy2, R2 / 2, 30);
g = `<path d="M${cx - R2},${cy2} A${R2} ${R2} 0 0 1 ${cx + R2},${cy2}" class="f-line" fill="none" stroke-dasharray="4 3" stroke-width="1"/>`
+ `<path d="M${cx},${cy2} L${ax},${ay} A${R2} ${R2} 0 0 0 ${bx},${by} Z" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>`
+ `<path d="M${P(cx, cy2, 18, 30)} A18 18 0 0 0 ${P(cx, cy2, 18, 150)}" class="f-accent" fill="none" stroke-width="1.6"/>` + T(cx, cy2 - 24, "120°", "middle", 11)
+ T(lx + 8, ly + 12, "9 m", "start") + `<circle cx="${cx}" cy="${cy2}" r="3" class="f-dot"/>` + T(cx, cy2 + 15, "arroseur", "middle", 10); }
return svg(320, s === 2 ? 142 : 156, g, ["cercle de rayon 6 cm", "pizza de 30 cm de diamètre", "secteur de 120° et de rayon 9 m"][s]); };

const triDev = () => svg(320, 130, `<polygon points="60,110 260,110 110,20" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(110, 20, 110, 110, "f-accent", 2, "5 4") + `<rect x="110" y="100" width="10" height="10" fill="none" class="f-line" stroke-width="1"/>`
+ T(160, 126, "8 cm") + T(116, 72, "h = ?", "start", 12, "f-txt f-accent") + T(178, 102, "aire 24 cm²", "middle", 11), "triangle d'aire 24 cm² et de base 8 cm");

const dimFig = (s, x) => { let g;
if (s === 0) g = `<rect x="40" y="30" width="240" height="84" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + T(160, 22, "longueur = " + Q(x) + " m", "middle", 12, QC(x)) + T(32, 76, "7 m", "end") + T(160, 78, "aire 84 m²");
else if (s === 1) g = `<polygon points="120,10 120,130 220,130" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(120, 10, 120, 130, "f-accent", 2) + T(112, 74, "h = " + Q(x) + " m", "end", 12, QC(x)) + T(170, 146, "base 5 m") + T(150, 112, "15 m²", "start", 11);
else g = `<polygon points="40,120 280,120 230,30 70,30" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(100, 30, 100, 120, "f-accent", 2, "5 4") + T(160, 22, "b = 7 cm") + T(160, 138, "B = 11 cm") + T(108, 80, "h = " + Q(x) + " cm", "start", 12, QC(x)) + T(200, 104, "aire 45 cm²", "middle", 11);
return svg(320, 150, g, ["potager rectangulaire", "voile triangulaire", "trapèze"][s]); };

const piece = () => svg(320, 140, box3(70, 125, 150, 90, 70, -40, "f-fill2") + T(145, 138, "5 m") + T(270, 118, "4 m", "start") + T(62, 84, "3 m", "end") + T(145, 84, "4 murs à peindre", "middle", 11), "pièce de 5 m sur 4 m, haute de 3 m");


const latFig = (s) => { let g = "";
if (s === 0) { const A = [14, 104], B = [50, 104], C = [32, 73], d = [64, -40], m = (p) => [p[0] + d[0], p[1] + d[1]];
g += `<polygon points="${m(A)} ${m(B)} ${m(C)}" class="f-line" fill="none" stroke-width="1" stroke-dasharray="3 3"/>` + L(...A, ...m(A), "f-line", 1, "3 3")
+ `<polygon points="${C} ${m(C)} ${m(B)} ${B}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/><polygon points="${A} ${B} ${C}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + L(...C, ...m(C), "f-line", 1.2)
+ T(32, 120, "4 cm", "middle", 10) + T(88, 92, "20 cm", "start", 10);
for (let k = 0; k < 3; k++) g += `<rect x="${140 + k * 46}" y="12" width="46" height="110" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/>` + T(163 + k * 46, 136, "4 cm", "middle", 10);
g += T(284, 70, "20 cm", "start", 10) + T(110, 128, "déplié →", "middle", 11); return svg(320, 142, g, "boîte en prisme et ses trois faces latérales dépliées"); }
const y0 = s === 2 ? 44 : 28;
g += `<path d="M36,${y0} V${y0 + 80} A26 7 0 0 0 88,${y0 + 80} V${y0}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="62" cy="${y0}" rx="26" ry="7" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + L(62, y0, 88, y0, "f-accent", 1.6) + T(75, y0 - 10, "4 cm", "middle", 10) + T(30, y0 + 44, "11 cm", "end", 10);
g += `<rect x="112" y="${y0}" width="196" height="80" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>` + T(210, y0 + 44, "étiquette déroulée", "middle", 11) + T(116, y0 + 44, "11 cm", "start", 10) + T(210, y0 + 96, "longueur = périmètre du disque", "middle", 10);
if (s === 2) g += `<circle cx="210" cy="22" r="17" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/><circle cx="210" cy="164" r="17" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + T(234, 26, "fond", "start", 10) + T(234, 168, "couvercle", "start", 10);
return svg(320, s === 2 ? 186 : 132, g, s === 2 ? "cylindre déplié avec ses deux disques" : "cylindre et son étiquette déroulée"); };

const aquarium = () => svg(320, 140, box3(80, 128, 140, 100, 56, -24, "f-soft") + `<rect x="80" y="44" width="140" height="84" class="f-fill2" fill-opacity=".7"/>` + `<rect x="80" y="28" width="140" height="100" fill="none" stroke="var(--ink)" stroke-width="1.4"/>`
+ T(150, 140, "50 cm", "middle", 11) + T(256, 114, "30 cm", "start", 11) + T(72, 82, "40 cm", "end", 11), "aquarium de 50 cm sur 30 cm sur 40 cm");

const volFig = (s) => { let g = "";
if (s === 0) { const k = 14, y = 128, dx = 40, dy = -20; g += box3(40, y, 5 * k, 3 * k, dx, dy) + box3(40 + 5 * k, y, 5 * k, 5 * k, dx, dy, "f-fill") + box3(40 + 10 * k, y, 5 * k, 2 * k, dx, dy);
g += T(40 + 2.5 * k, y - 1.5 * k + 4, "3 dm", "middle", 10) + T(40 + 7.5 * k, y - 2.5 * k + 4, "5 dm", "middle", 10, "f-on") + T(40 + 12.5 * k, y - k + 4, "2 dm", "middle", 10) + T(40 + 7.5 * k, y + 14, "5 dm chacun", "middle", 10) + T(40 + 15 * k + dx / 2 + 6, y + dy / 2, "4 dm", "start", 10);
return svg(320, 146, g, "podium de trois pavés"); }
if (s === 1) { const x = 50, y = 130, w = 120, h = 54, t = 36, dx = 110, dy = -38;
g += `<polygon points="${x + w / 2},${y - h - t} ${x + w / 2 + dx},${y - h - t + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
+ `<polygon points="${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
+ `<polygon points="${x},${y} ${x + w},${y} ${x + w},${y - h} ${x + w / 2},${y - h - t} ${x},${y - h}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/>` + L(x, y - h, x + w, y - h, "f-line", 1, "4 3") + L(x + w / 2, y - h, x + w / 2, y - h - t, "f-accent", 1.6, "4 3");
g += T(x + w / 2, y + 14, "6 m", "middle", 11) + T(x - 6, y - h / 2 + 4, "3 m", "end", 11) + T(x + w / 2 + 5, y - h - t / 2 + 6, "2 m", "start", 11) + T(x + w + dx / 2 + 8, y + dy / 2 + 8, "10 m", "start", 11);
return svg(320, 150, g, "maison : pavé surmonté d'un toit en prisme"); }
g += box3(40, 110, 200, 50, 50, -30, "f-soft") + `<rect x="40" y="76" width="200" height="34" class="f-fill2"/>` + `<rect x="40" y="60" width="200" height="50" fill="none" stroke="var(--ink)" stroke-width="1.4"/>`
+ T(140, 124, "8 m", "middle", 11) + T(270, 96, "4 m", "start", 11) + T(34, 97, "1,5 m", "end", 11) + T(140, 96, "eau", "middle", 11);
return svg(320, 132, g, "piscine de 8 m sur 4 m remplie sur 1,5 m"); };

Object.assign(ACTIVE, {
disque: {
predict: { q: "Une roue de vélo a un diamètre de 70 cm. Quand elle fait un tour complet, le vélo avance d'environ…", fig: roue(), choices: ["70 cm", "2,2 m", "1,4 m"], good: 1,
why: "Le vélo avance de la longueur du cercle : un peu plus de 3 fois le diamètre. Ce nombre, c'est π ≈ 3,14 : π · 70 ≈ 220 cm, soit 2,2 m." },
defis: ["Un cercle a un rayon de 6 cm. Son périmètre vaut … π cm. Tape le nombre devant π.", "L'aire d'un disque vaut π · r². Une pizza a 30 cm de diamètre : son aire vaut … π cm².", "Un arroseur tourne de 120° et arrose jusqu'à 9 m. Aire arrosée : … π m² ?"],
play: hunt({ ask: true, label: "Nombre devant π",
blank: (s) => disc(s),
show: (x, s) => disc(s) + plain(["Longueur du cercle : π · diamètre = π · (2 · 6)", "Rayon : 30 ÷ 2 = 15 cm ; aire : π · 15²", "120° sur 360° : c'est " + "1/3 du disque ; disque entier : π · 9² = 81π"][s] + "<br>tu proposes <b>" + nb(x) + "π</b> → " + ok(Math.abs(x - [12, 225, 27][s]) < 1e-9, x < [12, 225, 27][s])),
miss: "Pas encore : relis le calcul sous la figure.",
wins: [W(12, "Périmètre : π · 12 = 2 · π · 6 = 12π cm ≈ 37,7 cm."), W(225, "r = 15 cm : π · 15² = 225π cm² ≈ 706,9 cm². Avec le diamètre (π · 30²), on aurait 4 fois trop !"), W(27, "120/360 = 1/3 : 81π ÷ 3 = 27π m² ≈ 84,8 m².")] }),
},
grandmanq: {
predict: { q: "Un triangle a une aire de 24 cm² et une base de 8 cm. Sa hauteur mesure…", fig: triDev(), choices: ["3 cm", "6 cm", "16 cm"], good: 1,
why: "Aire = base · hauteur ÷ 2, donc 8 · h ÷ 2 = 24. On défait le calcul : 8 · h = 48, puis h = 48 ÷ 8 = 6 cm. 24 ÷ 8 = 3 oublie le ÷ 2." },
defis: ["Un potager rectangulaire de 84 m² est large de 7 m. Quelle est sa longueur (en m) ?", "Une voile triangulaire a une aire de 15 m² et une base de 5 m. Sa hauteur (en m) ?", "Aire d'un trapèze : (B + b) · h ÷ 2. Aire 45 cm², bases 11 cm et 7 cm. Hauteur (en cm) ?"],
play: hunt({ ask: true, label: "Longueur cherchée",
blank: (s) => dimFig(s, null),
show: (x, s) => dimFig(s, x) + plain(["7 · " + nb(x) + " = <b>" + nb(7 * x) + " m²</b> (cible 84) → " + ok(7 * x === 84, 7 * x < 84),
"5 · " + nb(x) + " ÷ 2 = <b>" + nb((5 * x) / 2) + " m²</b> (cible 15) → " + ok(5 * x === 30, 5 * x < 30),
"(11 + 7) · " + nb(x) + " ÷ 2 = 9 · " + nb(x) + " = <b>" + nb(9 * x) + " cm²</b> (cible 45) → " + ok(9 * x === 45, 9 * x < 45)][s]),
wins: [W(12, "7 · ℓ = 84, donc ℓ = 84 ÷ 7 = 12 m."), W(6, "5 · h ÷ 2 = 15 : on double d'abord (5 · h = 30), puis h = 30 ÷ 5 = 6 m."), W(5, "(11 + 7) ÷ 2 = 9 : 9 · h = 45, donc h = 5 cm.")] }),
},
airelat: {
predict: { q: "On repeint les 4 murs d'une pièce de 5 m sur 4 m, haute de 3 m (ni le sol ni le plafond). Surface à peindre ?", fig: piece(), choices: ["60 m²", "54 m²", "27 m²"], good: 1,
why: "On « déplie » les 4 murs : un long rectangle de 5 + 4 + 5 + 4 = 18 m sur 3 m, soit 54 m². 60, c'est 5 · 4 · 3 : le volume (en m³) ; 27 oublie deux murs." },
defis: ["Une boîte de chocolats est un prisme : base en triangle équilatéral de 4 cm, longueur 20 cm. Aire latérale (en cm²) ?", "Boîte de conserve : rayon 4 cm, hauteur 11 cm. Aire de l'étiquette : … π cm² ?", "Même boîte, avec le fond et le couvercle : aire totale … π cm² ?"],
play: hunt({ ask: true, label: (s) => (s ? "Nombre devant π" : "Aire latérale (cm²)"),
blank: (s) => latFig(s),
show: (x, s) => { const t = [240, 88, 120][s]; return latFig(s) + plain(["3 rectangles de 4 cm sur 20 cm : périmètre de la base · longueur = (4 + 4 + 4) · 20", "Périmètre du disque : 2 · π · 4 = 8π ; aire de l'étiquette : 8π · 11", "Étiquette 88π, plus 2 disques de π · 4² chacun"][s] + "<br>tu proposes <b>" + nb(x) + (s ? "π" : "") + "</b> → " + ok(Math.abs(x - t) < 1e-9, x < t)); },
miss: "Pas encore : relis le calcul sous la figure.",
wins: [W(240, "12 · 20 = 240 cm² : aire latérale = périmètre de la base · hauteur du prisme."), W(88, "2 · π · 4 · 11 = 88π cm² ≈ 276,5 cm²."), W(120, "88π + 2 · 16π = 120π cm² ≈ 377 cm². Aire totale = aire latérale + 2 bases.")] }),
},
voldecomp: {
predict: { q: "Un aquarium mesure 50 cm × 30 cm × 40 cm. Plein, il contient…", fig: aquarium(), choices: ["60 L", "600 L", "6 L"], good: 0,
why: "En dm : 5 · 3 · 4 = 60 dm³, et 1 dm³ = 1 L, donc 60 L. En cm : 60'000 cm³ ÷ 1000 = 60 L (1 L = 1000 cm³)." },
defis: ["Un podium est fait de 3 pavés de base 5 dm × 4 dm, hauts de 3, 5 et 2 dm. Volume total (en dm³) ?", "Maison : pavé de 10 m × 6 m × 3 m, toit en prisme (triangle de base 6 m, haut de 2 m). Volume (en m³) ?", "Une piscine de 8 m × 4 m est remplie sur 1,5 m. Combien de litres d'eau ?"],
play: hunt({ ask: true, label: (s) => ["Volume (dm³)", "Volume (m³)", "Contenance (L)"][s],
blank: (s) => volFig(s),
show: (x, s) => { const t = [200, 240, 48000][s]; return volFig(s) + plain(["Chaque marche : 5 · 4 · hauteur ; on additionne les 3 pavés", "Pavé 10 · 6 · 3 ; toit : aire du triangle (6 · 2 ÷ 2) · 10", "8 · 4 · 1,5 = 48 m³ ; 1 m³ = 1000 L"][s] + "<br>tu proposes <b>" + nb(x) + ["", "", " L"][s] + "</b> → " + ok(Math.abs(x - t) < 1e-9, x < t)); },
miss: "Pas encore : relis le calcul sous la figure.",
wins: [W(200, "20 · 3 + 20 · 5 + 20 · 2 = 60 + 100 + 40 = 200 dm³ (= 20 · 10, même base)."), W(240, "180 m³ + 60 m³ = 240 m³. Le toit n'est pas un pavé : on divise par 2."), W(48000, "48 m³ = 48'000 L.")] }),
},
});
})();








(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");

const mil = (v) => { const s = String(+(+v).toFixed(4)).split("."); return (s[0].replace("-", "−").replace(/\B(?=(\d{3})+(?!\d))/g, "'")) + (s[1] ? "," + s[1] : ""); };
const par = (v) => (v < 0 ? "(" + nb(v) + ")" : nb(v));
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ' stroke-dasharray="5 4"' : ""}/>`;
const plain = (html) => `<div class="act-out">${html}</div>`;
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");

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


const plan = (s, ans) => {
let g = "";
if (s === 0) {
g += `<rect x="40" y="20" width="240" height="110" class="f-soft" stroke="var(--ink)" stroke-width="2"/>` + L(150, 20, 150, 130, "f-line", 2) + L(40, 80, 150, 80, "f-line", 2);
g += L(40, 20, 280, 20, "f-accent", 4) + T(160, 14, "7 cm sur le plan", "middle", 11, "f-txt f-accent") + T(160, 150, "échelle 1 : 200" + (ans === undefined ? "" : " · en vrai : " + ans), "middle", 11);
return svg(320, 158, g, "plan d'un appartement");
}
if (s === 1) {
g += `<rect x="20" y="10" width="280" height="120" rx="6" class="f-soft"/>` + `<path d="M22,126 C100,104 190,132 298,108" class="f-blue" fill="none" stroke-width="2"/>`;
g += `<circle cx="60" cy="96" r="5" class="f-dot"/>` + T(60, 114, "village", "middle", 11) + `<circle cx="260" cy="50" r="5" class="f-dot"/>` + T(260, 38, "ferme", "middle", 11);
g += L(60, 96, 260, 50, "f-accent", 1.6, true) + T(150, 62, ans === undefined ? "? cm" : ans, "middle", 12, "f-txt f-accent");
g += T(160, 148, "carte au 1 : 25'000 · en vrai : 3 km à vol d'oiseau", "middle", 11);
return svg(320, 156, g, "carte avec deux villages");
}

const u = 32; g += `<rect x="${160 - 2 * u}" y="18" width="${4 * u}" height="${3 * u}" class="f-fill2"/>`;
g += T(160, 12, "4 cm", "middle", 11) + T(160 + 2 * u + 6, 18 + 1.5 * u + 4, "3 cm", "start", 11) + T(160, 18 + 1.5 * u + 4, ans === undefined ? "aire réelle ?" : ans, "middle", 12, "f-txt f-accent");
g += T(160, 140, "plan au 1 : 100", "middle", 11);
return svg(320, 150, g, "plan d'une pièce");
};



const ramp = (labs, p, q) => {
const x0 = 20, y0 = 96, w = 240, k = 3;
const yt = y0 - Math.min(84, (w * p * k) / 100);
let g = `<polygon points="${x0},${y0} ${x0 + w},${y0} ${x0 + w},${yt}" class="f-shape"/>`;
if (q !== null && isFinite(q) && q >= 0) { const yq = y0 - Math.min(90, (w * q * k) / 100); g += L(x0, y0, x0 + w, yq, "f-accent", 2.4, true); }
g += T(x0 + w / 2, y0 + 16, labs.h, "middle", 12) + T(x0 + w + 5, (y0 + yt) / 2 + 4, labs.v, "start", 12, /\?/.test(labs.v) ? "f-txt f-accent" : "f-txt") + T(x0 + w / 2 - 20, (y0 + yt) / 2 - 8, labs.p, "middle", 12, /\?/.test(labs.p) ? "f-txt f-accent" : "f-txt");
return svg(320, 120, g, "profil d'une route") + `<div class="small muted">Hauteurs exagérées (× 3) pour mieux voir la montée.${q !== null ? " En pointillé : ta proposition." : ""}</div>`;
};


const poly = (n, labC, labI) => {
const cx = 160, cy = 80, r = 66, P = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
let g = `<polygon points="${P.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" class="f-shape"/>`;

const i0 = Math.floor(n / 2), Q1 = P[i0 - 1 < 0 ? n - 1 : i0 - 1], Q2 = P[i0];
g += L(cx, cy, Q1[0], Q1[1], "f-line", 1.2) + L(cx, cy, Q2[0], Q2[1], "f-line", 1.2) + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>` + T(cx - 8, cy - 6, "O", "end", 11);
if (labC) { const m = [(Q1[0] + Q2[0]) / 2, (Q1[1] + Q2[1]) / 2]; g += T(cx + (m[0] - cx) * 0.42, cy + (m[1] - cy) * 0.42 + 4, labC, "middle", 12, /\?/.test(labC) ? "f-txt f-accent" : "f-txt f-blue"); }
if (labI) {
const j = (i0 + Math.ceil(n / 2)) % n, V = P[j], U = P[(j + n - 1) % n], Z = P[(j + 1) % n], rr = 16;
const e1 = [V[0] + ((U[0] - V[0]) * rr) / Math.hypot(U[0] - V[0], U[1] - V[1]), V[1] + ((U[1] - V[1]) * rr) / Math.hypot(U[0] - V[0], U[1] - V[1])], e2 = [V[0] + ((Z[0] - V[0]) * rr) / Math.hypot(Z[0] - V[0], Z[1] - V[1]), V[1] + ((Z[1] - V[1]) * rr) / Math.hypot(Z[0] - V[0], Z[1] - V[1])];
g += `<path d="M${e1[0].toFixed(1)},${e1[1].toFixed(1)} A${rr},${rr} 0 0 1 ${e2[0].toFixed(1)},${e2[1].toFixed(1)}" class="f-accent" fill="none" stroke-width="1.6"/>`;
g += T(V[0] + (cx - V[0]) * 0.42, V[1] + (cy - V[1]) * 0.42 + 4, labI, "middle", 12, /\?/.test(labI) ? "f-txt f-accent" : "f-txt f-blue");
}
return svg(320, 160, g, "polygone régulier à " + n + " côtés");
};
const NOMS = { 3: "triangle équilatéral", 4: "carré", 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone", 10: "décagone", 12: "dodécagone" };


const ROT = (pts, a, cx, cy) => { const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180); return pts.map(([x, y]) => [cx + x * c - y * s, cy - (x * s + y * c)]); };
const FLAG = [[34, 8], [34, 56], [70, 46], [34, 36]];
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

retiens: { regle: "Échelle \\(1\\,:\\,200\\) : 1 cm sur le plan représente 200 cm en réalité. On multiplie, puis on convertit les unités (100 cm = 1 m, 100'000 cm = 1 km).", exemple: ["Échelle \\(1\\,:\\,200\\), 7 cm sur le plan : \\(7 \\cdot 200 = 1\\text{'}400\\) cm, soit 14 m.", "3 km au \\(1\\,:\\,25\\text{'}000\\) : \\(300\\text{'}000 : 25\\text{'}000 = 12\\) cm.", "Pièce de 4 cm sur 3 cm au \\(1\\,:\\,100\\) : 4 m sur 3 m, aire 12 m²."], piege: "Le piège, c'est la conversion des unités : \\(100\\text{'}000\\) cm = 1 km." },
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

retiens: { piege: "L'angle au centre et l'angle intérieur ne sont pas le même angle : 72° et 108° pour le pentagone régulier." },
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








(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
const plain = (html) => `<div class="act-out">${html}</div>`;
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
const hunt0 = (o) => (box, onWin) => {
let x = o.ask ? null : o.start, step = 0;
const draw = () => {
const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
const ctl = o.ask ? actAnswerHtml(o.label || "Ta réponse") : actStepper(o.label || "x", nb(x), "x");
box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
if (o.ask) {
const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-");
const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "")); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || "Pas encore : regarde la figure, puis recalcule."); };
actAnswerBind(box, go);
} else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
};
const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
draw();
};
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
const R = (x, y, w, h, cls, sw = 0.8) => `<rect x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" class="${cls}" stroke="var(--ink)" stroke-width="${sw}"/>`;




const square = (n, cls) => { const u = 14, x0 = 104, yb = 117; let g = `<rect x="${x0}" y="${yb - 8 * u}" width="${8 * u}" height="${8 * u}" fill="none" stroke="var(--ink-soft)" stroke-dasharray="3 3"/>`;
for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) g += `<rect x="${x0 + i * u}" y="${yb - (j + 1) * u}" width="${u}" height="${u}" class="${cls}" stroke="var(--ink)" stroke-width="0.4"/>`;
return svg(320, 122, g, "carré de côté " + n); };

const cube = (n, cls) => { const u = 11, dx = 5.5, dy = -4.4, x0 = Math.round(160 - (n * (u + dx)) / 2), y0 = Math.round(66 + (n * (u - dy)) / 2), a = n * u, top = y0 - a;
const P = (pts) => pts.map((p) => p.map((v) => +v.toFixed(1)).join(",")).join(" ");
const ln = (x1, y1, x2, y2) => `<line x1="${+x1.toFixed(1)}" y1="${+y1.toFixed(1)}" x2="${+x2.toFixed(1)}" y2="${+y2.toFixed(1)}" stroke="var(--ink)" stroke-width="0.4"/>`;
let g = `<polygon points="${P([[x0, top], [x0 + a, top], [x0 + a + n * dx, top + n * dy], [x0 + n * dx, top + n * dy]])}" class="${cls}" opacity="0.55" stroke="var(--ink)" stroke-width="0.8"/>`
+ `<polygon points="${P([[x0 + a, y0], [x0 + a, top], [x0 + a + n * dx, top + n * dy], [x0 + a + n * dx, y0 + n * dy]])}" class="${cls}" opacity="0.75" stroke="var(--ink)" stroke-width="0.8"/>`
+ R(x0, top, a, a, cls);
for (let i = 1; i < n; i++) g += ln(x0 + i * u, top, x0 + i * u, y0) + ln(x0, top + i * u, x0 + a, top + i * u)
+ ln(x0 + i * u, top, x0 + i * u + n * dx, top + n * dy) + ln(x0 + i * dx, top + i * dy, x0 + a + i * dx, top + i * dy)
+ ln(x0 + a + i * dx, y0 + i * dy, x0 + a + i * dx, top + i * dy) + ln(x0 + a, top + i * u, x0 + a + n * dx, top + i * u + n * dy);
return svg(320, 132, g, "cube d'arête " + n); };



const rect28 = (x) => { const k = 34, a = k * Math.SQRT2, b = k * Math.sqrt(8), x0 = 100, y0 = 6 + b;
return svg(320, 172, R(x0 - a, y0, a, a, "f-soft") + T(x0 - a / 2, y0 + a / 2 + 4, "aire 2", "middle", 11)
+ R(x0, y0 - b, b, b, "f-soft") + T(x0 + b / 2, y0 - b / 2 + 4, "aire 8", "middle", 11)
+ R(x0, y0, b, a, "f-fill2", 1.4) + T(x0 + b / 2, y0 + a / 2 + 4, x === null ? "aire ?" : "aire " + nb(x), "middle", 12, "f-txt f-accent")
+ T(x0 + b + 6, y0 + a / 2 + 4, "√2", "start") + T(x0 + b / 2, y0 + a + 15, "√8"), "rectangle de côtés √2 et √8"); };

const sq72 = (x) => { const S = 120, u = S / 6, x0 = 90, y0 = 6; let g = R(x0, y0, S, S, "f-soft", 1.4);
if (x !== null && Number.isInteger(x) && x >= 1 && x <= 7) {
for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${x0 + i * u}" y="${y0 + j * u}" width="${u}" height="${u}" class="f-fill2" stroke-width="1"/>`;
g += T(x0 + u / 2, y0 + u / 2 + 4, "2", "middle", 10); }
return svg(320, 166, g + T(x0 + S / 2, y0 + S + 16, "aire 72") + T(x0 + S + 22, y0 + S / 2 + 4, "côté a√2", "start", 11), "carré d'aire 72"); };

const seg3 = (x) => { const k = 26, s3 = k * Math.sqrt(3), x0 = 20, l1 = k * Math.sqrt(12), l2 = k * Math.sqrt(27);
const ln = (a, b, y1, y2, cls, w) => `<line x1="${+a.toFixed(1)}" y1="${y1}" x2="${+b.toFixed(1)}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;
let g = ln(x0, x0 + l1, 30, 30, "f-line", 4) + ln(x0 + l1, x0 + l1 + l2, 30, 30, "f-accent", 4) + T(x0 + l1 / 2, 20, "√12") + T(x0 + l1 + l2 / 2, 20, "√27");
if (x !== null && Number.isInteger(x) && x >= 1 && x <= 12) { const L = Math.min(x * s3, 290); g += ln(x0, x0 + L, 64, 64, "f-line", 4);
for (let i = 0; i <= x && i * s3 <= 290; i++) g += ln(x0 + i * s3, x0 + i * s3, 57, 71, "f-line", 1.2);
g += T(x0, 88, nb(x) + " fois √3", "start", 11); }
return svg(320, 96, g, "segments de longueurs √12 et √27"); };

Object.assign(ACTIVE, {
rac: {
predict: { q: "Combien vaut √(9 + 16) ?", choices: ["7", "5", "25"], good: 1, why: "On calcule d'abord sous la racine, √25 = 5. Ce n'est pas √9 + √16 = 3 + 4 = 7 !" },
defis: ["Agrandis le carré jusqu'à une aire de 49.", "Maintenant c'est un cube : agrandis-le jusqu'à un volume de 125.", "Retour au carré : quel est le plus grand côté entier dont l'aire reste sous 50 ?"],
play: hunt({ label: "Côté", start: 2, min: 1, max: 8,
show: (x, s) => s === 1 ? cube(x, "f-fill") + plain("arête " + x + " → volume " + x + "³ = " + x + " · " + x + " · " + x + " = <b>" + x ** 3 + "</b>")
: square(x, s === 2 && x * x > 50 ? "f-fill2" : "f-fill") + plain("côté " + x + " → aire " + x + "² = <b>" + x * x + "</b>" + (s === 2 ? (x * x < 50 ? " (sous 50)" : " (dépasse 50)") : "")),
wins: [W(7, "Côté 7 : 7² = 49, donc √49 = 7. La racine carrée donne le côté du carré."),
W(5, "Arête 5 : 5 · 5 · 5 = 125, donc ∛125 = 5. La racine cubique donne l'arête du cube."),
W(7, "7² = 49 < 50 < 64 = 8² : donc √50 est entre 7 et 8.")] }),
},
racprop: {

retiens: { regle: "\\(\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}\\) (\\(a, b\\) positifs). Pour simplifier, on sort le plus grand carré parfait : \\(\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}\\). On additionne seulement des racines semblables : \\(2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}\\). La racine cubique suit la même règle pour le produit : \\(\\sqrt[3]{a} \\cdot \\sqrt[3]{b} = \\sqrt[3]{ab}\\).", exemple: ["\\(\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4\\).", "\\(\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}\\).", "\\(\\sqrt[3]{2} \\cdot \\sqrt[3]{4} = \\sqrt[3]{8} = 2\\)."] },
predict: { q: "Laquelle de ces égalités est vraie ?", choices: ["√9 · √16 = √(9 · 16)", "√9 + √16 = √(9 + 16)", "les deux"], good: 0,
why: "√9 · √16 = 3 · 4 = 12, et √144 = 12 aussi. Mais √9 + √16 = 7, alors que √25 = 5. La racine d'un produit est le produit des racines ; pour une somme, ça ne marche pas." },
defis: ["Le rectangle a pour côtés √2 et √8. Calcule son aire √2 · √8.", "Un carré a une aire de 72. Son côté s'écrit a√2 : trouve a.", "√12 + √27 = a√3 : trouve a.", "Même règle du produit pour les racines cubiques : calcule ∛2 · ∛4."],
play: hunt({ ask: true, label: "Ta réponse",
blank: (s) => [rect28(null), sq72(null), seg3(null), plain("∛2 · ∛4 = ?")][s],
show: (x, s) => [rect28(x) + plain("tu proposes " + nb(x) + " ; " + nb(x) + "² = " + nb(x * x) + " (il faut 2 · 8 = 16)"),
sq72(x) + plain(nb(x) + " × " + nb(x) + " carrés d'aire 2 = " + nb(2 * x * x) + " (il faut 72)"),
seg3(x) + plain("√12 + √27 ≈ 8,66 ; " + nb(x) + "√3 ≈ " + nb(+(x * Math.sqrt(3)).toFixed(2))),
plain("tu proposes " + nb(x) + " ; " + nb(x) + "³ = " + nb(x ** 3) + " (il faut 2 · 4 = 8)")][s],
wins: [W(4, "√2 · √8 = √(2 · 8) = √16 = 4. Le produit de deux racines est la racine du produit."),
W(6, "72 = 36 · 2, donc √72 = √36 · √2 = 6√2. On sort le plus grand carré parfait (36 carrés d'aire 2)."),
W(5, "√12 = 2√3 et √27 = 3√3, donc la somme vaut 5√3. On n'additionne que des racines semblables."),
W(2, "∛2 · ∛4 = ∛8 = 2, car 2³ = 8. La racine cubique suit la même règle pour le produit.")] }),
},
});
})();



(function () {

const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace("-", "−") : String(n).replace("-", "−") + "/" + d; };
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
const ok = (good, low) => (good ? '<b class="act-ok">✓ égalité</b>' : low ? "trop petit" : "trop grand");
const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;





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
const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");

const bar = (a, b, n, y, cls) => { const x0 = 20, w = 280; let g = `<rect x="${x0}" y="${y}" width="${w}" height="18" class="f-soft" stroke="var(--ink)" stroke-width="1"/><rect x="${x0}" y="${y}" width="${(w * a) / b}" height="18" class="${cls}"/>`;
if (n && n <= 60) for (let k = 1; k < n; k++) g += `<line x1="${x0 + (w * k) / n}" y1="${y}" x2="${x0 + (w * k) / n}" y2="${y + 18}" class="f-line" stroke-width="0.6"/>`;
return g; };
const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"/>`;

const line = (from, to) => { const X = (v) => 160 + v * 12; let g = L(10, 30, 310, 30); for (let v = -12; v <= 12; v++) g += L(X(v), 26, X(v), 34, "f-line", v % 5 ? 0.6 : 1.2) + (v % 5 ? "" : T(X(v), 50, String(v).replace("-", "−"), "middle", 10));
if (from !== null) g += `<circle cx="${X(from)}" cy="30" r="5" class="f-dot"/>`; if (to !== null && Math.abs(to) <= 12) g += `<path d="M${X(from)},22 Q${(X(from) + X(to)) / 2},2 ${X(to)},22" class="f-accent" fill="none" stroke-width="2"/><circle cx="${X(to)}" cy="30" r="5" class="f-accent"/>`;
return svg(320, 58, g, "droite graduée"); };

const thal = (k, labs) => { const A = [30, 120], B = [290, 140], C = [230, 20], D = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k], E = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
let g = `<polygon points="${A} ${B} ${C}" class="f-shape"/>` + L(D[0], D[1], E[0], E[1], "f-accent", 2.4) + T(A[0] - 10, A[1] + 4, "A") + T(B[0] + 8, B[1] + 4, "B") + T(C[0] + 8, C[1], "C") + T(D[0], D[1] + 16, "D") + T(E[0] - 8, E[1] - 6, "E");
const mid = (P, Q, dy) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2 + dy];
for (const [k2, P, Q, dy] of [["AD", A, D, 16], ["DB", D, B, 16], ["AE", A, E, -8], ["EC", E, C, -8], ["DE", D, E, 0], ["BC", B, C, 0]]) if (labs[k2]) { const [x, y] = mid(P, Q, dy); g += T(x + (k2 === "DE" || k2 === "BC" ? 14 : 0), y, labs[k2], "middle", 12, /\?/.test(labs[k2]) ? "f-txt f-accent" : "f-txt"); }
return svg(320, 160, g, "configuration de Thalès"); };
const plain = (html) => `<div class="act-out">${html}</div>`;

Object.assign(ACTIVE, {
pct: {

retiens: { regle: "Une hausse de \\(p\\,\\%\\) multiplie par \\(1 + \\frac{p}{100}\\) ; une baisse de \\(p\\,\\%\\), par \\(1 - \\frac{p}{100}\\). Hausse en % : l'augmentation divisée par le prix de départ. Pour retrouver le prix de départ, on divise par le coefficient.", exemple: ["De 50 à 60 CHF : \\(\\frac{10}{50} = 20\\,\\%\\) de hausse.", "Après \\(+25\\,\\%\\), 100 CHF : départ \\(100 \\div 1{,}25 = 80\\) CHF.", "\\(+20\\,\\%\\) puis \\(-20\\,\\%\\) : \\(\\cdot 1{,}2 \\cdot 0{,}8 = \\cdot 0{,}96\\), soit \\(-4\\,\\%\\)."], piege: "\\(+20\\,\\%\\) puis \\(-20\\,\\%\\) ne ramène pas au prix de départ : la baisse porte sur un prix déjà augmenté." },
predict: { q: "Un prix augmente de 20 %, puis baisse de 20 %. Il est finalement…", choices: ["égal au prix de départ", "plus bas", "plus haut"], good: 1, why: "× 1,2 puis × 0,8 = × 0,96 : la baisse porte sur un prix déjà augmenté. Il baisse de 4 %." },
defis: ["Prix de départ 100 CHF : prix après +20 % puis −20 % ?", "Un prix passe de 50 à 60 CHF : hausse en % ?", "Après une hausse de 25 %, un objet coûte 100 CHF. Prix de départ ?"], garde: [1, 2],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["100 · 1,2 · 0,8", "(60 − 50) ÷ 50", "100 ÷ 1,25"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(96, "100 · 1,2 = 120, puis 120 · 0,8 = 96 CHF."), W(20, "10 ÷ 50 = 0,2 = 20 % : on divise par le prix de DÉPART."), W(80, "On divise par le coefficient 1,25 : 80 CHF (et non 100 − 25 % = 75).")] }),
},
racenc: {
predict: { q: "Entre quels entiers se trouve √50 ?", choices: ["7 et 8", "24 et 26", "5 et 6"], good: 0, why: "49 < 50 < 64, donc 7 < √50 < 8. La racine n'est pas la moitié !" },
defis: ["Plus petit entier au-dessus de √50 ?", "Combien d'entiers n vérifient 6 < √n < 7 ?", "Plus grand entier n tel que √n < 10 ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["vérifie : " + nb(x) + "² = " + nb(x * x) + " (comparer à 50)", "il faut 36 < n < 49 ; tu proposes " + nb(x), "vérifie : √" + nb(x) + " < 10 ⇔ " + nb(x) + " < 100"][s]),
wins: [W(8, "8² = 64 > 50 et 7² = 49 < 50."), W(12, "De 37 à 48 : 12 entiers."), W(99, "n < 100 : le plus grand est 99.")] }),
},
tradexpr: {
predict: { q: "« Le double de la somme de 3 et 4 » vaut…", choices: ["10", "14", "11"], good: 1, why: "Le premier mot dit la dernière opération : on double la SOMME, 2 · (3 + 4) = 14. 2 · 3 + 4 = 10 serait « la somme du double de 3 et de 4 »." },
defis: ["La somme de 5 et du triple de 4 ?", "Le triple de la somme de 5 et 4 ?", "Le carré de la différence entre 9 et 4 ?"],
play: hunt({ ask: true, label: "Résultat", show: (x, s) => plain(["5 + 3 · 4", "3 · (5 + 4)", "(9 − 4)²"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(17, "5 + 12 = 17 : la somme est la dernière opération."), W(27, "3 · 9 = 27 : le triple est la dernière opération."), W(25, "5² = 25 : on calcule la différence d'abord.")] }),
},
fimg: {
predict: { q: "f(x) = x² − 3. Combien de nombres ont pour image 6 ?", choices: ["un seul", "deux", "aucun"], good: 1, why: "x² − 3 = 6 ⇔ x² = 9 ⇔ x = 3 ou x = −3 : deux antécédents. Une image est unique, un antécédent pas forcément." },
defis: ["f(x) = x² − 3 : calcule f(−4).", "Antécédent POSITIF de 6 ?", "Antécédent NÉGATIF de 6 ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s === 0 ? "f(−4) = (−4)² − 3 ; tu proposes <b>" + nb(x) + "</b>" : "f(" + nb(x) + ") = " + nb(x * x - 3)),
wins: [W(13, "(−4)² = 16, 16 − 3 = 13."), W(3, "f(3) = 9 − 3 = 6."), W(-3, "f(−3) = 9 − 3 = 6 aussi : deux antécédents.")] }),
},
modaff: {
predict: { q: "Taxi A : 6 CHF + 2 CHF/km. Taxi B : 3 CHF/km. Pour 10 km, le moins cher est…", choices: ["A", "B", "ils coûtent pareil"], good: 0, why: "A : 6 + 20 = 26 CHF ; B : 30 CHF. Au-delà de 6 km, la part fixe de A est « remboursée »." },
defis: ["Prix de A pour 10 km ?", "Pour combien de km les deux taxis coûtent-ils le même prix ?", "Prix commun à cette distance ?"], garde: [1, 2],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s === 1 ? "A(" + nb(x) + ") = " + nb(6 + 2 * x) + " ; B(" + nb(x) + ") = " + nb(3 * x) : "tu proposes <b>" + nb(x) + "</b> CHF"),
wins: [W(26, "6 + 2 · 10 = 26 CHF."), W(6, "6 + 2x = 3x ⇔ x = 6 km."), W(18, "6 + 12 = 18 = 3 · 6 CHF.")] }),
},
f2: {
predict: { q: "La parabole f(x) = x² − 4x + 3 a son sommet en x = …", choices: ["2", "−2", "3"], good: 0, why: "x_S = −b ÷ (2a) = 4 ÷ 2 = 2 : c'est aussi le milieu des zéros 1 et 3." },
defis: ["Abscisse du sommet de x² − 6x + 5 ?", "Ordonnée du sommet ?", "Plus grand zéro ?"],
play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => t * t - 6 * t + 5 }], [], { numbers: true, xr: [-2, 8], yr: [-5, 8] }), show: (x) => FIG.plot([{ f: (t) => t * t - 6 * t + 5 }], [[x, 0, ""]], { numbers: true, xr: [-2, 8], yr: [-5, 8] }) + plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(3, "x_S = 6 ÷ 2 = 3."), W(-4, "f(3) = 9 − 18 + 5 = −4."), W(5, "(x − 1)(x − 5) = 0 : zéros 1 et 5.")] }),
},
optim: {

retiens: { exemple: ["Rectangle de périmètre 20 : aire \\(x(10 - x)\\), maximale au sommet \\(x = 5\\) : un carré de 25 m²."] },
predict: { q: "Avec 20 m de clôture, quel rectangle a la plus grande aire ?", choices: ["2 m × 8 m", "5 m × 5 m", "1 m × 9 m"], good: 1, why: "Aire x(10 − x), maximale au sommet x = 5 : un carré de 25 m²." },
defis: ["Règle la largeur pour une aire de 21 m².", "Puis pour 24 m².", "Trouve l'aire maximale (largeur 5)."],
play: hunt({ label: "Largeur (m)", start: 1, min: 1, max: 9,
show: (x) => { let g = `<rect x="40" y="10" width="${x * 24}" height="${(10 - x) * 12}" class="f-fill" stroke="var(--ink)"/>`; return svg(320, 130, g, "rectangle") + plain("largeur " + x + " m, longueur " + (10 - x) + " m → aire <b>" + x * (10 - x) + " m²</b>"); },
wins: [(x) => (x * (10 - x) === 21 ? "3 × 7 = 21 (ou 7 × 3)." : ""), (x) => (x * (10 - x) === 24 ? "4 × 6 = 24." : ""), W(5, "5 × 5 = 25 m² : le sommet de la parabole x(10 − x).")] }),
},
euclide: {

retiens: { regle: "Théorème de la hauteur : dans un triangle rectangle, la hauteur issue de l'angle droit coupe l'hypoténuse en deux segments \\(p\\) et \\(q\\), et \\(h^2 = p \\cdot q\\).", exemple: ["\\(p = 4\\) et \\(q = 9\\) : \\(h^2 = 36\\), donc \\(h = 6\\).", "\\(p = 2\\) et \\(q = 8\\) : \\(h^2 = 16\\), donc \\(h = 4\\)."], piege: "\\(h^2 = p \\cdot q\\) : la hauteur n'est pas la moyenne des deux segments (6, pas 6,5)." },
predict: { q: "Triangle rectangle : la hauteur coupe l'hypoténuse en 2 cm et 8 cm. La hauteur mesure…", choices: ["5 cm", "4 cm", "10 cm"], good: 1, why: "Théorème de la hauteur : h² = 2 · 8 = 16, h = 4 (et non la moyenne 5)." },
defis: ["h pour des segments de 4 et 9 ?", "Cathète a (projection 4, hypoténuse 13) au carré : a² = ?", "h pour des segments de 2 et 8 ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["h² = 4 · 9", "a² = p · c = 4 · 13", "h² = 2 · 8"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(6, "√36 = 6."), W(52, "a² = 52, a = 2√13."), W(4, "√16 = 4.")] }),
},
angtri: {
predict: { q: "La somme des angles d'un pentagone vaut…", choices: ["360°", "540°", "900°"], good: 1, why: "On le découpe en 3 triangles depuis un sommet : 3 · 180° = 540°. En général (n − 2) · 180°." },
defis: ["Chaque angle d'un hexagone régulier (en degrés) ?", "Nombre de côtés d'un polygone régulier dont chaque angle vaut 108° ?", "Un octogone se découpe en combien de triangles depuis un sommet ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["(6 − 2) · 180 = 720, divisé par 6", "angle extérieur 180 − 108 = 72° ; 360 ÷ 72", "n − 2 triangles"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(120, "720 ÷ 6 = 120°."), W(5, "360 ÷ 72 = 5 : le pentagone régulier."), W(6, "8 − 2 = 6 triangles : 6 · 180° = 1080°.")] }),
},
trigexact: {
predict: { q: "Une route de pente 100 % fait avec l'horizontale un angle de…", choices: ["90°", "45°", "100°"], good: 1, why: "Pente = tan(angle) ; 100 % ⇔ tan = 1 ⇔ 45° : on monte de 1 m pour 1 m d'avance." },
defis: ["Hypoténuse 12, angle 30° : côté opposé ?", "Pente d'une route inclinée à 45° (en %) ?", "Hypoténuse 20, angle 60° : côté adjacent ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["12 · sin 30° = 12 · 1/2", "tan 45° = 1", "20 · cos 60° = 20 · 1/2"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(6, "sin 30° = 1/2 : 6."), W(100, "tan 45° = 1 : 100 %."), W(10, "cos 60° = 1/2 : 10.")] }),
},
ensembles: {

retiens: { regle: "\\([a \\, ; b]\\) : bornes comprises. \\(]a \\, ; b[\\) : bornes exclues. \\([a \\, ; b[\\) : \\(a\\) compris, \\(b\\) exclu. Le crochet tourné vers l'extérieur exclut la borne." },
predict: { q: "Combien de nombres entiers l'intervalle ]2 ; 5] contient-il ?", choices: ["4", "3", "2"], good: 1, why: "Crochet tourné vers l'extérieur en 2 : 2 est exclu ; 5 est compris. Il reste 3, 4, 5." },
defis: ["Nombre d'entiers de [−3 ; 4] ?", "Nombre d'entiers de [−3 ; 4] ∩ ]0 ; 9[ ?", "Plus petit entier de ]−2 ; 7] ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["de −3 à 4, bornes comprises", "partie commune : ]0 ; 4]", "−2 est exclu"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(8, "−3, −2, −1, 0, 1, 2, 3, 4 : 8 entiers."), W(4, "]0 ; 4] : 1, 2, 3, 4."), W(-1, "−2 exclu : le plus petit est −1.")] }),
},
domaine: {
predict: { q: "Pour f(x) = √(x − 3), quel nombre est interdit ?", choices: ["3", "0", "2"], good: 2, why: "Sous la racine, il faut x − 3 ≥ 0, donc x ≥ 3 : 2 est interdit, 3 est permis (√0 = 0)." },
defis: ["f(x) = 1/(x − 7) : valeur interdite ?", "f(x) = √(x + 5) : plus petite valeur permise ?", "f(x) = 1/(x² − 16) : valeur interdite positive ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["dénominateur " + nb(x) + " − 7 = " + nb(x - 7), "sous la racine : " + nb(x) + " + 5 = " + nb(x + 5), "x² − 16 = " + nb(x * x - 16)][s]),
wins: [W(7, "x − 7 = 0 pour x = 7."), W(-5, "x + 5 ≥ 0 ⇔ x ≥ −5."), W(4, "x² = 16 : ±4 interdits.")] }),
},
racinv: {

retiens: { regle: "\\(\\sqrt{x}\\) n'existe que pour \\(x \\ge 0\\) ; \\(\\frac{1}{x}\\) n'existe que pour \\(x \\ne 0\\). Avec \\(f(x) = \\frac{12}{x}\\), quand \\(x\\) double, \\(f(x)\\) est divisé par 2. Pour résoudre \\(\\sqrt{x} = a\\) (\\(a \\ge 0\\)), on élève au carré : \\(x = a^2\\).", exemple: ["\\(f(x) = \\frac{12}{x}\\) : \\(f(3) = 4\\)", "\\(\\sqrt{x} = 9\\) : \\(x = 81\\)"], piege: "\\(\\sqrt{x} = 9\\) donne \\(x = 81\\), pas \\(x = 3\\) : on élève au carré." },
predict: { q: "Quand x double, que devient f(x) = 12/x ?", choices: ["il double", "il est divisé par 2", "il ne change pas"], good: 1, why: "12/(2x) = (12/x) ÷ 2 : la fonction inverse « fait l'inverse »." },
defis: ["f(x) = 12/x : f(3) ?", "Préimage de 4 par f ?", "√x = 9 : x ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s < 2 ? "12 ÷ " + nb(x) + " = " + nb(12 / x) : "√" + nb(x) + " ≈ " + nb(Math.sqrt(Math.max(0, x)))),
wins: [W(4, "12 ÷ 3 = 4."), W(3, "12/x = 4 ⇔ x = 3."), W(81, "On élève au carré : x = 81.")] }),
},
transf: {

retiens: { regle: "\\(g(x) = f(x - a) + b\\) : translation de \\(a\\) horizontalement et de \\(b\\) verticalement. Le point \\((p ; q)\\) devient \\((p + a ; q + b)\\) ; le sommet de \\((x - a)^2 + b\\) est \\((a ; b)\\)." },
predict: { q: "Le graphe de (x − 3)² est celui de x² déplacé de…", choices: ["3 vers la gauche", "3 vers la droite", "3 vers le haut"], good: 1, why: "(x − 3)² vaut 0 en x = 3 : le sommet passe de 0 à 3, vers la DROITE (signe inversé dans la parenthèse)." },
defis: ["g(x) = (x − 3)² + 2 : abscisse du sommet ?", "Son ordonnée ?", "g(x) = (x + 4)² − 1 : abscisse du sommet ?"],
play: hunt({ ask: true, label: "Ta réponse", blank: (s) => FIG.plot([{ f: (t) => t * t, dash: true }, { f: s < 2 ? (t) => (t - 3) ** 2 + 2 : (t) => (t + 4) ** 2 - 1 }], [], { numbers: true, xr: [-7, 7], yr: [-3, 8] }), show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(3, "(x − 3)² : 3 vers la droite."), W(2, "+ 2 : 2 vers le haut."), W(-4, "(x + 4)² = (x − (−4))² : 4 vers la gauche.")] }),
},
absval: {
predict: { q: "Combien de solutions a |x − 2| = 5 ?", choices: ["une", "deux", "aucune"], good: 1, why: "x est à distance 5 de 2 : x = 7 ou x = −3." },
defis: ["|x − 2| = 5 : plus grande solution ?", "Plus petite solution ?", "Distance entre −4 et 6 (|−4 − 6|) ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(s < 2 ? "|" + nb(x) + " − 2| = " + nb(Math.abs(x - 2)) : "tu proposes <b>" + nb(x) + "</b>"),
wins: [W(7, "2 + 5 = 7."), W(-3, "2 − 5 = −3."), W(10, "|−10| = 10.")] }),
},
ineq: {

retiens: { regle: "On résout une inéquation du 1er degré comme une équation, en isolant \\(x\\). En multipliant ou en divisant par un nombre négatif, on retourne le sens de l'inégalité.", exemple: ["\\(-2x > 6\\) : on divise par \\(-2\\), donc \\(x < -3\\).", "\\(5 - x < 2\\) : \\(-x < -3\\), donc \\(x > 3\\) ; plus petit entier : 4."], piege: "\\(-2x > 6\\) donne \\(x < -3\\), pas \\(x > -3\\) : le sens se retourne." },
predict: { q: "−3x > 12 donne…", choices: ["x > −4", "x < −4", "x > 4"], good: 1, why: "En divisant par −3 (négatif), on RETOURNE le sens : x < −4." },
defis: ["−2x > 6 : x < … ?", "3x − 4 ≤ 11 : x ≤ … ?", "Plus petit entier solution de 5 − x < 2 ?"],
play: hunt({ ask: true, label: "Borne", show: (x, s) => plain(["6 ÷ (−2)", "3x ≤ 15", "−x < −3 ⇔ x > 3"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(-3, "x < −3 (sens retourné)."), W(5, "x ≤ 5."), W(4, "x > 3 : le plus petit entier est 4.")] }),
},
trinfact: {

retiens: { regle: "Si \\(x_1\\) et \\(x_2\\) sont les zéros de \\(x^2 + bx + c\\), alors \\(x^2 + bx + c = (x - x_1)(x - x_2)\\). On cherche deux nombres de somme \\(-b\\) et de produit \\(c\\).", exemple: ["\\(x^2 - 5x + 6 = (x - 2)(x - 3)\\)", "\\(x^2 - 7x + 10 = (x - 2)(x - 5)\\) : zéros 2 et 5", "\\(x^2 + x - 12 = (x + 4)(x - 3)\\) : zéros \\(-4\\) et 3"], piege: "Les zéros ont le signe contraire du nombre dans la parenthèse : \\((x + 4)\\) s'annule en \\(-4\\)." },
predict: { q: "x² − 5x + 6 se factorise en…", choices: ["(x − 2)(x − 3)", "(x + 2)(x + 3)", "(x − 1)(x − 6)"], good: 0, why: "Deux nombres de somme 5 et de produit 6 : 2 et 3. Zéros 2 et 3, donc (x − 2)(x − 3)." },
defis: ["x² − 7x + 10 : plus petit zéro ?", "Plus grand zéro ?", "x² + x − 12 : zéro positif ?"],
play: hunt({ ask: true, label: "Zéro", show: (x, s) => plain(s < 2 ? nb(x) + "² − 7·" + nb(x) + " + 10 = " + nb(x * x - 7 * x + 10) : nb(x) + "² + " + nb(x) + " − 12 = " + nb(x * x + x - 12)),
wins: [W(2, "4 − 14 + 10 = 0."), W(5, "(x − 2)(x − 5)."), W(3, "(x − 3)(x + 4) : zéros 3 et −4.")] }),
},
f2formes: {
predict: { q: "(x − 2)² + 3 a pour sommet…", choices: ["(2 ; 3)", "(−2 ; 3)", "(3 ; 2)"], good: 0, why: "Forme canonique a(x − h)² + k : sommet (h ; k) = (2 ; 3)." },
defis: ["x² − 8x + 20 = (x − h)² + k : h ?", "k ?", "Constante de (x + 3)² − 4 développé ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["h = 8 ÷ 2", "(x − 4)² = x² − 8x + 16 ; 20 − 16", "9 − 4"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(4, "h = 4."), W(4, "k = 20 − 16 = 4."), W(5, "(x + 3)² = x² + 6x + 9 ; 9 − 4 = 5.")] }),
},
f2trois: {
predict: { q: "Une parabole passe par (0 ; 7). Que vaut c dans ax² + bx + c ?", choices: ["7", "0", "on ne peut pas savoir"], good: 0, why: "f(0) = c : le point d'abscisse 0 donne directement c." },
defis: ["Points (0 ; 1), (1 ; 4), (−1 ; 0) : c ?", "a + b = ? (f(1) − c)", "a ?"], garde: [0, 1, 2],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["f(0)", "4 − 1", "(a + b) + (a − b) = 3 + (−1)"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(1, "c = f(0) = 1."), W(3, "a + b = 3 (et a − b = −1)."), W(1, "2a = 2 : a = 1, b = 2 ; f(x) = x² + 2x + 1.")] }),
},
inter: {
predict: { q: "Combien de points communs ont y = x² et y = −1 ?", choices: ["deux", "un", "aucun"], good: 2, why: "x² = −1 n'a pas de solution : un carré n'est jamais négatif. La droite passe sous la parabole." },
defis: ["y = x² et y = x + 6 : abscisse positive d'intersection ?", "Abscisse négative ?", "Ordonnée du point d'abscisse positive ?"],
play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => t * t }, { f: (t) => t + 6 }], [], { numbers: true, xr: [-4, 4], yr: [-1, 10], squash: 0.6 }), show: (x, s) => plain(s < 2 ? nb(x) + "² = " + nb(x * x) + " ; " + nb(x) + " + 6 = " + nb(x + 6) : "tu proposes <b>" + nb(x) + "</b>"),
wins: [W(3, "x² − x − 6 = (x − 3)(x + 2)."), W(-2, "x = −2."), W(9, "3² = 9 = 3 + 6.")] }),
},
geocomb: {

retiens: { regle: "On repère les triangles rectangles cachés dans la figure, puis on applique Pythagore. Losange : les diagonales se coupent en leur milieu à angle droit. Pavé : on calcule d'abord la diagonale d'une face, puis celle du pavé.", exemple: ["Losange de diagonales 6 et 8 : côté \\(\\sqrt{3^2 + 4^2} = 5\\).", "Pavé \\(2 \\times 3 \\times 6\\) : diagonale \\(\\sqrt{4 + 9 + 36} = 7\\)."] },
predict: { q: "Un losange a des diagonales de 10 et 24 cm. Son côté mesure…", choices: ["17 cm", "13 cm", "26 cm"], good: 1, why: "Les diagonales se coupent en leur milieu à angle droit : √(5² + 12²) = 13." },
defis: ["Côté du losange de diagonales 6 et 8 ?", "Hauteur d'un triangle isocèle de côtés 10, 10 et base 12 ?", "Diagonale d'un pavé 2 × 3 × 6 ?"],
play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["√(3² + 4²)", "√(10² − 6²)", "√(4 + 9 + 36)"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(5, "Demi-diagonales 3 et 4 : 5."), W(8, "Demi-base 6 : √64 = 8."), W(7, "√49 = 7.")] }),
},
droitesrem: {

retiens: { regle: "Les médianes (sommet → milieu du côté opposé) se coupent au centre de gravité \\(G\\), situé aux \\(\\frac{2}{3}\\) de chaque médiane depuis le sommet. Dans un triangle rectangle, le centre du cercle circonscrit est le milieu de l'hypoténuse.", exemple: ["Médiane de 12 cm : \\(AG = \\frac{2}{3} \\cdot 12 = 8\\) cm.", "Hypoténuse 10 : rayon du cercle circonscrit 5."], piege: "\\(G\\) est aux deux tiers depuis le sommet, pas au milieu de la médiane." },
predict: { q: "Le centre de gravité G partage la médiane [AM] en…", choices: ["deux moitiés", "AG = 2/3 de AM", "AG = 1/3 de AM"], good: 1, why: "G est aux deux tiers de chaque médiane en partant du sommet." },
defis: ["Médiane de 12 cm : AG ?", "GM ?", "Triangle rectangle d'hypoténuse 10 : rayon du cercle circonscrit ?"],
play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["2/3 de 12", "1/3 de 12", "milieu de l'hypoténuse"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(8, "AG = 8."), W(4, "GM = 4."), W(5, "Rayon = 10 ÷ 2 = 5.")] }),
},
lectgraph: {

retiens: { regle: "Zéros : abscisses des points sur l'axe des \\(x\\). Les solutions de \\(f(x) = k\\) sont les abscisses des points d'intersection avec la droite horizontale \\(y = k\\)." },
predict: { q: "Pour lire les solutions de f(x) = 2 sur un graphique, on regarde…", choices: ["où la courbe coupe l'axe des y", "où la courbe croise la droite horizontale y = 2", "la valeur f(2)"], good: 1, why: "f(x) = 2 : on cherche les x dont l'image vaut 2, donc les points de la courbe à la hauteur 2." },
defis: ["f(x) = (x − 1)² − 4 : plus petit zéro ?", "Plus grand zéro ?", "Nombre de solutions de f(x) = −4 ?"],
play: hunt({ ask: true, label: "Ta réponse", blank: () => FIG.plot([{ f: (t) => (t - 1) ** 2 - 4 }], [], { numbers: true, xr: [-4, 6], yr: [-5, 6], hlines: [-4] }), show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(-1, "La courbe coupe l'axe en −1."), W(3, "… et en 3."), W(1, "y = −4 touche la courbe au sommet seulement.")] }),
},
morceaux: {
predict: { q: "f(x) = 2x si x < 3, et f(x) = 10 − x si x ≥ 3. Que vaut f(3) ?", choices: ["6", "7", "les deux"], good: 1, why: "x = 3 relève du 2e morceau (x ≥ 3) : f(3) = 10 − 3 = 7." },
defis: ["f(1) ?", "f(5) ?", "f(3) ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["1 < 3 : 2 · 1", "5 ≥ 3 : 10 − 5", "3 ≥ 3 : 10 − 3"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(2, "1er morceau : 2."), W(5, "2e morceau : 5."), W(7, "x = 3 est dans le 2e morceau : 7.")] }),
},
polyop: {

retiens: { regle: "Chaque terme de la première parenthèse multiplie chaque terme de la seconde. \\((a + b)^2 = a^2 + 2ab + b^2\\) : le double produit ne disparaît pas. Pour finir, on réduit.", exemple: ["\\((x + 3)^2 = x^2 + 6x + 9\\)", "\\((2x + 1)(x - 4) = 2x^2 - 8x + x - 4 = 2x^2 - 7x - 4\\)"], piege: "\\((x + 3)^2\\) n'est pas \\(x^2 + 9\\) : il manque \\(2 \\cdot x \\cdot 3 = 6x\\)." },
predict: { q: "(x + 3)² = …", choices: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9"], good: 1, why: "(a + b)² = a² + 2ab + b² : le double produit 2 · x · 3 = 6x ne disparaît pas." },
defis: ["Coefficient de x dans (x + 3)² ?", "Terme constant de (x − 3)(x + 3) ?", "Coefficient de x dans (2x + 1)(x − 4) ?"],
play: hunt({ ask: true, label: "Coefficient", show: (x, s) => plain(["2 · x · 3", "−3 · 3", "2x · (−4) + 1 · x"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(6, "x² + 6x + 9."), W(-9, "x² − 9."), W(-7, "2x² − 7x − 4.")] }),
},
factor2: {

retiens: { regle: "Étape 1 : mise en évidence d'un facteur commun. Étape 2 : identités remarquables (\\(a^2 - b^2 = (a - b)(a + b)\\), carrés parfaits \\(a^2 + 2ab + b^2 = (a + b)^2\\)). On recommence tant qu'un facteur peut encore se factoriser.", exemple: ["\\(2x^2 - 18 = 2(x^2 - 9) = 2(x - 3)(x + 3)\\)", "\\(x^2 + 10x + 25 = (x + 5)^2\\)"], piege: "\\(2(x^2 - 9)\\) n'est pas fini : \\(x^2 - 9\\) se factorise encore." },
predict: { q: "3x² − 12 factorisé au maximum, c'est…", choices: ["3(x² − 4)", "3(x − 2)(x + 2)", "(3x − 6)(x + 2)"], good: 1, why: "On met 3 en évidence, puis x² − 4 est une différence de carrés : 3(x − 2)(x + 2)." },
defis: ["Facteur mis en évidence dans 2x² − 18 ?", "Racine du carré parfait 9 ?", "x² + 10x + 25 = (x + ?)²"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(2, "2(x² − 9)."), W(3, "(x − 3)(x + 3)."), W(5, "(x + 5)² = x² + 10x + 25.")] }),
},
f2expr: {

retiens: { regle: "Si on connaît les zéros \\(x_1\\) et \\(x_2\\) : \\(f(x) = a(x - x_1)(x - x_2)\\). Un point de plus permet de calculer \\(a\\).", exemple: ["Zéros 1 et 5, \\(f(0) = 10\\) : \\(a(0 - 1)(0 - 5) = 5a = 10\\), donc \\(a = 2\\).", "Alors \\(f(3) = 2(3 - 1)(3 - 5) = -8\\)."] },
predict: { q: "Une parabole a pour zéros 1 et 5 et passe par (0 ; 10). Son coefficient a vaut…", choices: ["1", "2", "10"], good: 1, why: "f(x) = a(x − 1)(x − 5) ; f(0) = 5a = 10, donc a = 2." },
defis: ["Produit (0 − 1)(0 − 5) ?", "Valeur de a ?", "f(3) = a(3 − 1)(3 − 5) ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(5, "(−1)(−5) = 5."), W(2, "5a = 10."), W(-8, "2 · 2 · (−2) = −8 (sommet).")] }),
},
interpar: {

retiens: { regle: "On résout \\(f(x) = g(x)\\). Pour deux paraboles, si les \\(x^2\\) s'annulent, il reste une équation du 1er degré.", exemple: ["\\(x^2 + 1 = x^2 + 2x - 5 \\iff 1 = 2x - 5\\), donc \\(x = 3\\)", "\\(x^2 = -x^2 + 8 \\iff x^2 = 4\\), donc \\(x = 2\\) ou \\(x = -2\\)"] },
predict: { q: "Deux paraboles y = x² + 1 et y = x² + 2x − 5 se coupent en…", choices: ["deux points", "un point", "aucun"], good: 1, why: "Les x² s'annulent : 1 = 2x − 5, une équation du 1er degré, x = 3." },
defis: ["Abscisse du point commun ?", "Son ordonnée ?", "y = x² et y = −x² + 8 : abscisse positive ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(3, "2x = 6."), W(10, "3² + 1 = 10."), W(2, "2x² = 8, x = ±2.")] }),
},
ineq2: {

retiens: { piege: "\\(x^2 \\le 16\\) donne \\(-4 \\le x \\le 4\\), pas seulement \\(x \\le 4\\)." },
predict: { q: "(x − 1)(x − 5) < 0 est vrai…", choices: ["entre 1 et 5", "en dehors de [1 ; 5]", "jamais"], good: 0, why: "Parabole tournée vers le haut : négative entre ses zéros." },
defis: ["Nombre d'entiers avec (x − 1)(x − 5) < 0 ?", "Et avec ≤ 0 ?", "x² ≤ 16 : plus grand entier ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x, s) => plain(["entre 1 et 5 exclus", "bornes comprises", "−4 ≤ x ≤ 4"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(3, "2, 3, 4."), W(5, "1 à 5."), W(4, "x ∈ [−4 ; 4].")] }),
},
ineqfrac: {

retiens: { exemple: ["\\(\\frac{x - 2}{x + 3} \\ge 0\\) : \\(S = \\,]-\\infty ; -3[ \\cup [2 ; +\\infty[\\)"], piege: "Le zéro du dénominateur est toujours exclu, même avec \\(\\ge\\) : \\(-3\\) n'est jamais solution." },
predict: { q: "Pour résoudre \\(\\dfrac{x - 2}{x + 3} \\ge 0\\), \\(x = -3\\) est…", choices: ["solution", "interdit", "la seule solution"], good: 1, why: "−3 annule le dénominateur : valeur interdite, jamais dans la solution." },
defis: ["Valeur interdite ?", "Zéro du numérateur ?", "Combien d'entiers de [−5 ; 5] vérifient \\(\\dfrac{x - 2}{x + 3} \\ge 0\\) ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(-3, "x + 3 = 0."), W(2, "x − 2 = 0."), W(6, "x < −3 : −5, −4 ; x ≥ 2 : 2, 3, 4, 5.")] }),
},
exactes: {

retiens: { regle: "Carré de côté \\(a\\) : diagonale \\(a\\sqrt{2}\\). Triangle équilatéral de côté \\(a\\) : hauteur \\(\\frac{a\\sqrt{3}}{2}\\).", exemple: ["Carré de côté 5 : diagonale \\(\\sqrt{25 + 25} = \\sqrt{50} = 5\\sqrt{2}\\).", "Triangle équilatéral de côté 6 : hauteur \\(\\sqrt{36 - 9} = \\sqrt{27} = 3\\sqrt{3}\\)."] },
predict: { q: "La diagonale d'un carré de côté 5 mesure exactement…", choices: ["5√2", "10", "7,07"], good: 0, why: "√(25 + 25) = √50 = 5√2. 7,07 n'est qu'une valeur approchée." },
defis: ["(5√2)² = ?", "Hauteur² d'un équilatéral de côté 6 ?", "(3√3)² = ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(50, "25 · 2 = 50."), W(27, "36 − 9 = 27 : h = 3√3."), W(27, "9 · 3 = 27.")] }),
},
trigo: {

retiens: { exemple: ["Hypoténuse 10 et angle 30° : côté opposé \\(= 10 \\cdot \\sin 30° = 5\\).", "Hypoténuse 50 et \\(\\cos\\alpha = 0{,}6\\) : côté adjacent \\(= 50 \\cdot 0{,}6 = 30\\)."], piege: "Choisis le rapport selon les côtés en jeu : opposé et hypoténuse → sinus (SOH)." },
predict: { q: "Hypoténuse connue, on cherche le côté opposé à l'angle : on utilise…", choices: ["le sinus", "le cosinus", "la tangente"], good: 0, why: "SOH : sin = opposé / hypoténuse." },
defis: ["Hypoténuse 10, angle 30° : opposé ?", "Adjacent 8, angle 45° : opposé ?", "Hypoténuse 50, cos α = 0,6 : adjacent ?"],
play: hunt({ ask: true, label: "Longueur", show: (x, s) => plain(["10 · sin 30°", "8 · tan 45°", "50 · 0,6"][s] + " ; tu proposes <b>" + nb(x) + "</b>"),
wins: [W(5, "sin 30° = 0,5."), W(8, "tan 45° = 1."), W(30, "50 · 0,6 = 30.")] }),
},
trigrel: {
predict: { q: "Si sin α = 0,6 (α aigu), cos α vaut…", choices: ["0,4", "0,8", "0,6"], good: 1, why: "sin² + cos² = 1 : cos² = 1 − 0,36 = 0,64, cos = 0,8 (et non 1 − 0,6)." },
defis: ["sin α = 3/5 : cos α = 4/? (dénominateur)", "tan α = sin/cos = 3/?", "100 · (sin² + cos²) = ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(5, "cos = 4/5."), W(4, "tan = (3/5)/(4/5) = 3/4."), W(100, "sin² + cos² = 1.")] }),
},
vabs: {
predict: { q: "|2 − 9| vaut…", choices: ["−7", "7", "11"], good: 1, why: "On calcule l'intérieur, 2 − 9 = −7, puis la distance à zéro : 7. Une valeur absolue n'est jamais négative." },
defis: ["|3 − 8| ?", "Distance entre −4 et 7 ?", "|x − 2| = 6 : plus petite solution ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(5, "|−5| = 5."), W(11, "|−4 − 7| = 11."), W(-4, "2 − 6 = −4 (et 8).")] }),
},
ratden: {

retiens: { regle: "\\(\\frac{a}{\\sqrt{b}} = \\frac{a\\sqrt{b}}{b}\\) : on multiplie le numérateur et le dénominateur par \\(\\sqrt{b}\\).", exemple: ["\\(\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}\\)", "\\(\\frac{10}{\\sqrt{5}} = \\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}\\)"] },
predict: { q: "6/√3 s'écrit aussi…", choices: ["2√3", "6√3", "√2"], good: 0, why: "On multiplie haut et bas par √3 : 6√3/3 = 2√3." },
defis: ["(6/√3)² = ?", "(2 + √3)(2 − √3) = ?", "(10/√5)² = ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(12, "36/3 = 12."), W(1, "4 − 3 = 1 : le conjugué fait disparaître la racine."), W(20, "100/5 = 20.")] }),
},
fracrat: {

retiens: { regle: "Pour simplifier, on factorise le numérateur et le dénominateur, puis on supprime les facteurs communs. On note les valeurs interdites (dénominateur nul).", exemple: ["\\(\\frac{x^2 - 9}{x - 3} = \\frac{(x - 3)(x + 3)}{x - 3} = x + 3\\) (pour \\(x \\ne 3\\)).", "\\(\\frac{3 - x}{x - 3} = -1\\) (pour \\(x \\ne 3\\))."] },
predict: { q: "(x² − 9)/(x − 3), pour x ≠ 3, se simplifie en…", choices: ["x − 3", "x + 3", "x² − 3"], good: 1, why: "x² − 9 = (x − 3)(x + 3) : on simplifie le FACTEUR x − 3, jamais terme à terme." },
defis: ["Valeur de (x² − 9)/(x − 3) pour x = 5 ?", "Pour x = 10 ?", "(3 − x)/(x − 3) pour x = 7 ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(8, "x + 3 = 8."), W(13, "x + 3 = 13."), W(-1, "Toujours −1 (opposés).")] }),
},
valint: {
predict: { q: "Combien de valeurs interdites a 1/(x² − 4) ?", choices: ["une", "deux", "aucune"], good: 1, why: "x² = 4 ⇔ x = 2 ou x = −2." },
defis: ["1/(x² − 4) : valeur interdite positive ?", "Négative ?", "1/(x² + 4) : nombre de valeurs interdites ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(2, "2² − 4 = 0."), W(-2, "(−2)² − 4 = 0."), W(0, "x² + 4 ≥ 4 : jamais nul.")] }),
},
eqparam: {
predict: { q: "(m − 3)x = 5 n'a aucune solution quand…", choices: ["m = 3", "m = 5", "m = −3"], good: 0, why: "Pour m = 3 : 0 · x = 5, impossible." },
defis: ["m pour aucune solution ?", "Pour m = 8, la solution x ?", "x² + mx + 9 = 0 : m > 0 pour une seule solution ?"],
play: hunt({ ask: true, label: "Ta réponse", show: (x) => plain("tu proposes <b>" + nb(x) + "</b>"),
wins: [W(3, "0 · x = 5 : impossible."), W(1, "5x = 5."), W(6, "Δ = m² − 36 = 0.")] }),
},
});
})();

