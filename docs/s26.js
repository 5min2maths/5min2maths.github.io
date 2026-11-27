

const BADGE_FAM = { reg: "Régularité", mai: "Maîtrise", per: "Persévérance", cur: "Curiosité" };
const weekOf = (s) => { const d = new Date(s + "T12:00:00"); return addDays(s, -((d.getDay() + 6) % 7)); };
const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);

const Badges = {
bc(state) {
if (!state.bc) {

const days = (state.history || []).filter((x) => x.n > 0).map((x) => x.date), weeks = {};
for (const d of days) weeks[weekOf(d)] = (weeks[weekOf(d)] || 0) + 1;
state.bc = { days: days.length, last: days[days.length - 1] || null, weeks, full: Object.values(weeks).filter((n) => n >= 5).length, rentree: false,
retry: 0, d3: 0, lessons: [], fb: Object.keys(state.votes || {}).filter((k) => state.votes[k].v !== "facile").length + (state.comments || []).length,
low: {}, pente: false, down: {}, compris: false };
}
return state.bc;
},

notes(state) { return Object.values(state.comps || {}).map(compNote).filter((n) => n !== null); },

notionProgress(state, id) { const cs = compsOf(id); return [cs.filter((c) => (compNote((state.comps || {})[c.cid]) ?? 0) >= 5).length, cs.length]; },

openOf(state, th) {
return Engine.catalog(state.profile).filter((c) => c.current && c.theme === th && state.notions[c.id] && ["vu", "encours"].includes(state.notions[c.id].status)).map((c) => c.id);
},


THEME_ICONS: [[/algorithm|programmation/i, "algo"], [/complexe/i, "repere"], [/suites et séries/i, "expo"],  [/automatisme/i, "auto"], [/ensemble/i, "venn"], [/argument|raisonner/i, "implique"],
[/combinatoire/i, "arbre"], [/probab/i, "de"], [/statisti|diagramme|données/i, "barres"], [/vectoriel|vecteur/i, "vecteurs"],
[/droites param/i, "droiteparam"], [/coordonn|cartésienne/i, "repere"], [/algèbre linéaire/i, "matrice"], [/intégr/i, "integrale"],
[/limite|dérivation|analyse/i, "tangente"], [/logarithm|exponentiel|puissances et log/i, "expo"], [/sinuso|fonctions trigo/i, "sinus"],
[/trigo/i, "trigo"], [/rationnelle/i, "hyperbole"], [/composition|réciproque/i, "reciproque"], [/polynom|transformations et poly/i, "cubique"],
[/quadrat|degré 2/i, "parabole"], [/inéquation/i, "inequation"], [/syst/i, "systeme"], [/équation/i, "balance"],
[/affine|degrés 0 et 1/i, "affine"], [/fonction/i, "fonction"], [/thalès/i, "thales"], [/pythagore/i, "pythagore"],
[/transformations du plan/i, "symetrie"], [/cercle/i, "cercle"], [/angle/i, "angle"], [/3d|espace|volume|similitude/i, "cube"],
[/aire|périmètre/i, "aire"], [/unité|mesure|grandeur/i, "regle"], [/proportion/i, "proportion"], [/littéral|algébrique|algèbre/i, "litteral"],
[/fractionnaire|fraction/i, "fraction"], [/relatif/i, "relatifs"], [/arithmétique/i, "points"], [/puissances et racines|racine/i, "racine"],
[/décimal/i, "decimal"], [/géom|figure/i, "geometrie"], [/nombre|numérique|calcul|prérequis/i, "nombres"]],
themeIcon(label) {
const m = this.THEME_ICONS.find(([r]) => r.test(label || ""));
return m ? "svg:" + m[1] : "🏆";
},

list(state) {
const themes = state && state.profile ? Engine.themeOrder(Engine.catalog(state.profile).filter((c) => c.current), state.profile) : Object.keys(THEMES);
const L = [
{ id: "premier", fam: "reg", icon: "👣", name: "Premier pas", crit: "Terminer une première séance.", prog: (s, b) => [Math.min(b.days, 1), 1] },


{ id: "serie3", fam: "reg", icon: "🔥", name: "3 jours d'affilée", crit: "S'entraîner 3 jours de suite (le joker de série compte).", prog: (s) => [Math.min(3, Math.max((s.streak && s.streak.count) || 0, (s.streak && s.streak.best) || 0)), 3] },
{ id: "semaine", fam: "reg", icon: "📅", name: "Semaine pleine", crit: "S'entraîner 5 jours dans une même semaine (du lundi au dimanche).", prog: (s, b) => [Math.min(5, b.weeks[weekOf(day())] || 0, 5), 5, b.full >= 1] },
{ id: "mois", fam: "reg", icon: "🗓️", name: "Un mois fidèle", crit: "4 semaines pleines, pas forcément d'affilée.", prog: (s, b) => [Math.min(b.full, 4), 4] },
{ id: "rentree", fam: "reg", icon: "🎒", name: "Rentrée", crit: "Reprendre l'entraînement après au moins 10 jours de pause.", prog: (s, b) => [b.rentree ? 1 : 0, 1] },
{ id: "s50", fam: "reg", icon: "🏅", name: "50 séances", crit: "50 jours d'entraînement au total.", prog: (s, b) => [Math.min(b.days, 50), 50] },
{ id: "comp5", fam: "mai", icon: "⭐", name: "Première compétence", crit: "Une compétence atteint la note 5.", prog: (s) => [this.notes(s).some((n) => n >= 5) ? 1 : 0, 1] },
{ id: "notion", fam: "mai", icon: "🎯", name: "Notion maîtrisée", crit: "Toutes les compétences d'une notion à 5 ou plus.",
prog: (s) => Object.keys(s.notions).map((id) => this.notionProgress(s, id)).reduce((a, p) => (p[1] && p[0] / p[1] > a[0] / a[1] ? p : a), [0, 3]) },
{ id: "expert", fam: "mai", icon: "💎", name: "Expert", crit: "Une compétence atteint la note 6.", prog: (s) => [this.notes(s).some((n) => n >= 6) ? 1 : 0, 1] },
...themes.map((th) => ({ id: "th-" + th, fam: "mai", icon: this.themeIcon(Engine.themeLabel(th, state && state.profile)), name: Engine.themeLabel(th, state && state.profile),
crit: th.includes(".") ? "Toutes les notions ouvertes de ce chapitre maîtrisées." : "Toutes les notions ouvertes de ce thème cette année maîtrisées (au moins 2 notions).",

prog: (s) => {
const ids = this.openOf(s, th), all = Engine.catalog(s.profile).filter((c) => c.current && c.theme === th).length;
const ok = ids.filter((id) => { const p = this.notionProgress(s, id); return p[0] === p[1]; }).length;
return [ok, Math.max(Math.min(2, all), ids.length, 1)];
} })),
{ id: "retry", fam: "per", icon: "🔁", name: "Deuxième essai", crit: "Réussir 10 fois une question au deuxième essai.", prog: (s, b) => [Math.min(b.retry, 10), 10] },
{ id: "compris", fam: "per", icon: "💡", name: "Ça y est !", crit: "Après « pas compris » sur un rappel de cours, réussir 3 questions de suite de cette notion.",
prog: (s, b) => [b.compris ? 3 : Math.max(0, ...Object.values(b.down)), 3] },
{ id: "pente", fam: "per", icon: "⛰️", name: "Remonter la pente", crit: "Faire passer une compétence de 3 ou moins à 5 ou plus.", prog: (s, b) => [b.pente ? 1 : 0, 1] },
{ id: "d3", fam: "per", icon: "🧗", name: "Niveau supérieur", crit: "Réussir 5 questions de difficulté 3 du premier coup.", prog: (s, b) => [Math.min(b.d3, 5), 5] },
{ id: "lecteur", fam: "cur", icon: "📖", name: "Lecteur", crit: "Ouvrir 10 rappels de cours différents.", prog: (s, b) => [Math.min(b.lessons.length, 10), 10] },
{ id: "testeur", fam: "cur", icon: "💬", name: "Testeur", crit: "Donner un avis (👍 / 👎) ou envoyer un commentaire.", prog: (s, b) => [Math.min(b.fb, 1), 1] },
];
return L;
},

check(state) {
if (!state || !state.profile) return [];
const b = this.bc(state), got = (state.badges = state.badges || {}), fresh = [];
for (const x of this.list(state)) {
if (got[x.id]) continue;
const p = x.prog(state, b);
if (p[2] || (p[1] > 0 && p[0] >= p[1])) { got[x.id] = day(); fresh.push(x.id); }
}
if (fresh.length) state.badgesNew = (state.badgesNew || []).concat(fresh);
return fresh;
},


onDay(state, today) {
const b = this.bc(state);
if (b.last === today) return;
if (b.last && daysBetween(b.last, today) >= 10) b.rentree = true;
b.days++; b.last = today;
const w = weekOf(today);
b.weeks[w] = (b.weeks[w] || 0) + 1;
if (b.weeks[w] === 5) b.full++;
for (const k of Object.keys(b.weeks)) if (daysBetween(k, today) > 60) delete b.weeks[k];
},
onAnswer(state, id, d, tries, solved, partial) {
const b = this.bc(state), first = partial !== undefined ? partial >= 0.99 : solved && tries === 1;
if (partial === undefined && solved && tries === 2) b.retry++;
if (first && d >= 3) b.d3++;
if (b.down[id] !== undefined && !b.compris) {
b.down[id] = first ? b.down[id] + 1 : 0;
if (b.down[id] >= 3) { b.compris = true; b.down = {}; }
}
},
onComp(state, cid, before, after) {
const b = this.bc(state);
if (before !== null && before <= 3) b.low[cid] = 1;
if (after !== null && after <= 3) b.low[cid] = 1;
if (b.low[cid] && after !== null && after >= 5) b.pente = true;
},
onLesson(state, id) { const b = this.bc(state); if (!b.lessons.includes(id)) b.lessons.push(id); },
onLessonDown(state, id) { const b = this.bc(state); if (!b.compris) b.down[id] = 0; },
onFeedback(state) { this.bc(state).fb++; },




drawn(icon, col) {
if (!/^svg:/.test(icon || "")) return "";
const k = icon.slice(4), S = (d, w = 6) => `<path d="${d}" stroke="${col}" stroke-width="${w}"/>`, F = (d, o = 0.3) => `<path d="${d}" fill="${col}" stroke="none" opacity="${o}"/>`,
D = (x, y, r = 4.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="none"/>`, TX = (x, y, t, fs = 22) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="800" fill="${col}" stroke="none" font-family="system-ui, sans-serif">${t}</text>`,
AX = S("M26 72 H76 M30 76 V24", 2.5);
const P = {
parabole: S("M26 72 H74 M50 24 V78", 2.5) + S("M21 30 Q50 90 79 30") + D(50, 60),
algo: S("M38 34 L26 50 L38 66 M62 34 L74 50 L62 66") + S("M55 30 L45 70", 4),
auto: S("M54 22 L36 54 H52 L46 78 L66 44 H50 Z", 5),
venn: `<circle cx="41" cy="50" r="17" stroke="${col}" stroke-width="5"/><circle cx="59" cy="50" r="17" stroke="${col}" stroke-width="5"/>` + F("M50 36 A17 17 0 0 1 50 64 A17 17 0 0 1 50 36 Z", 0.45),
implique: S("M24 42 H66 M24 58 H66", 5) + S("M58 30 L76 50 L58 70", 5),
arbre: S("M30 50 L64 30 M30 50 L64 70 M30 50 L64 50", 4) + D(30, 50, 6) + D(66, 30) + D(66, 50) + D(66, 70),
de: `<rect x="28" y="28" width="44" height="44" rx="9" stroke="${col}" stroke-width="5"/>` + D(39, 39) + D(50, 50) + D(61, 61),
barres: S("M24 74 H76", 3) + F("M30 74 V52 H40 V74 Z", 0.9) + F("M45 74 V34 H55 V74 Z", 0.9) + F("M60 74 V44 H70 V74 Z", 0.9),
vecteurs: S("M30 70 L68 36", 5) + S("M56 34 L70 34 L68 48", 5) + S("M30 70 L72 70", 3) + S("M64 64 L72 70 L64 76", 3),
droiteparam: S("M22 70 L78 30", 3) + D(36, 60) + S("M36 60 L58 44", 6) + S("M48 42 L60 43 L56 54", 5),
repere: AX + S("M46 72 V44 H30", 2) + D(46, 44, 5.5),
matrice: S("M34 28 H28 V72 H34 M66 28 H72 V72 H66", 5) + TX(42, 39, "1", 15) + TX(58, 39, "2", 15) + TX(42, 61, "0", 15) + TX(58, 61, "3", 15),
integrale: AX + F("M38 72 V52 Q50 40 62 42 V72 Z", 0.4) + S("M30 60 Q46 40 74 38", 5),
tangente: AX + S("M32 66 Q50 30 74 34", 5) + S("M36 46 L72 30", 3) + D(52, 40),
expo: AX + S("M30 70 Q58 68 70 26", 5) + D(30, 66, 0) ,
sinus: S("M24 50 H76", 2.5) + S("M24 50 Q31 26 37 50 T50 50 T63 50 T76 50", 5),
trigo: `<circle cx="50" cy="50" r="24" stroke="${col}" stroke-width="4"/>` + S("M50 50 L67 33 M50 50 H74", 3) + S("M67 33 V50", 3) + D(67, 33),
hyperbole: S("M24 50 H76 M50 24 V76", 2.5) + S("M54 26 Q56 46 76 46", 5) + S("M46 74 Q44 54 24 54", 5),
reciproque: S("M26 74 L74 26", 2.5) + S("M28 70 Q60 68 66 26", 5) + S("M30 72 Q32 40 74 34", 3),
cubique: AX + S("M28 74 C40 20 56 80 74 28", 5),
inequation: AX + F("M30 24 H76 V30 L30 64 Z", 0.35) + S("M30 64 L76 30", 5),
systeme: S("M24 66 L76 34 M24 30 L76 70", 5) + D(50, 50, 6),
balance: S("M50 26 V72 M36 74 H64 M26 38 H74", 5) + S("M26 38 L18 56 H34 Z M74 38 L66 56 H82 Z", 3),
affine: AX + S("M28 68 L74 30", 5) + D(30, 66, 0),
fonction: AX + S("M30 62 Q42 30 54 48 T76 34", 5),
thales: S("M28 72 L50 26 L72 72 Z", 4) + S("M38 52 H62", 5),
pythagore: F("M36 40 H24 V64 H36 Z", 0.4) + F("M36 64 H60 V76 H36 Z", 0.4) + S("M36 64 V40 L60 64 Z", 5) + S("M36 57 H43 V64", 3),
symetrie: S("M50 22 V78", 3) + `<path d="M50 22 V78" stroke="${col}" stroke-width="0"/>` + F("M44 32 L28 64 H44 Z", 0.9) + `<path d="M56 32 L72 64 H56 Z" stroke="${col}" stroke-width="4"/>`,
cercle: `<circle cx="50" cy="50" r="25" stroke="${col}" stroke-width="5"/>` + S("M50 50 L70 36", 4) + D(50, 50),
angle: S("M26 70 H76 M26 70 L64 30", 5) + S("M46 70 A20 20 0 0 0 40 56", 4),
cube: S("M30 40 L50 30 L70 40 V64 L50 74 L30 64 Z M30 40 L50 50 L70 40 M50 50 V74", 4) + F("M30 40 L50 30 L70 40 L50 50 Z", 0.35),
aire: `<rect x="28" y="30" width="44" height="40" stroke="${col}" stroke-width="5"/>` + F("M28 30 H72 V70 H28 Z", 0.25) + S("M36 70 L28 62 M48 70 L28 50 M60 70 L28 38 M72 70 L32 30 M72 58 L44 30 M72 46 L56 30", 2),
regle: `<rect x="22" y="40" width="56" height="20" rx="3" stroke="${col}" stroke-width="5"/>` + S("M30 40 V50 M38 40 V47 M46 40 V50 M54 40 V47 M62 40 V50 M70 40 V47", 3),
proportion: AX + S("M30 72 L74 30", 5) + D(41, 61) + D(52, 51) + D(63, 40),
litteral: TX(50, 50, "x²", 32),
fraction: `<circle cx="50" cy="50" r="24" stroke="${col}" stroke-width="5"/>` + F("M50 50 V26 A24 24 0 1 1 26 50 Z", 0.5) + S("M50 26 V74 M26 50 H74", 3),
relatifs: S("M22 54 H78", 4) + S("M30 48 V60 M50 46 V62 M70 48 V60", 3) + TX(30, 36, "−", 20) + TX(70, 36, "+", 20),
points: [30, 43, 57, 70].map((x) => [36, 50, 64].map((y) => D(x, y, 4.5)).join("")).join(""),
racine: S("M24 52 L32 48 L42 70 L52 30 H78", 5) + TX(65, 47, "x", 18),
decimal: TX(50, 50, "3,14", 24),
geometrie: S("M28 70 L46 30 L74 62 Z", 5) + D(28, 70) + D(46, 30) + D(74, 62),
nombres: TX(50, 50, "123", 26),
};
return P[k] ? `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${P[k]}</g>` : "";
},
COLORS: { reg: ["#f08a24", "#fde7cf"], mai: ["#2457d6", "#e4ecff"], per: ["#1e8a5a", "#e1f5ea"], cur: ["#8a3fd1", "#f0e4fb"] },
icon(x, on, px = 56) {
const [c, soft] = this.COLORS[x.fam];
const pts = [...Array(6)].map((_, i) => { const a = Math.PI / 6 + (i * Math.PI) / 3; return (50 + 44 * Math.cos(a)).toFixed(1) + "," + (50 + 44 * Math.sin(a)).toFixed(1); }).join(" ");
return `<svg class="bdg-ic${on ? "" : " off"}" viewBox="0 0 100 100" width="${px}" height="${px}" aria-hidden="true"><polygon points="${pts}" fill="${on ? soft : "none"}" stroke="${on ? c : "currentColor"}" stroke-width="${on ? 7 : 4}" stroke-dasharray="${on ? "" : "6 6"}"/>${this.drawn(x.icon, on ? c : "currentColor") || `<text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-size="40">${x.icon}</text>`}</svg>`;
},
};



const Backup = {
ST: { vu: "v", encours: "e", avenir: "a", nonvu: "n" },
pack(s) {
const t = day(), off = (d) => (d ? daysBetween(t, d) : null), r2 = (x) => Math.round(x * 100) / 100;
const n = {}, defs = Object.fromEntries(Engine.catalog(s.profile).map((c) => [c.id, c.defaultStatus]));
for (const [id, x] of Object.entries(s.notions || {})) {
const def = Engine.newNotion(x.status);
if (!x.seen && !x.placed && !x.lessonSeen && !x.easy && !x.retry && x.m === def.m && x.box === def.box) { if (x.status !== defs[id]) n[id] = [this.ST[x.status]]; continue; }
n[id] = [this.ST[x.status] || "v", r2(x.m), x.box, off(x.due), x.seen, x.ok, (x.placed ? 1 : 0) | (x.lessonSeen ? 2 : 0), x.easy || 0, off(x.retry), x.fails ?? null].concat(x.last ? [off(x.last)] : []);
}
const ws = (Array.isArray(s.snaps) ? s.snaps : []).find((x) => x && x.d >= addDays(t, -6)), co = (Array.isArray(s.carnetOut) ? s.carnetOut : []).filter((d) => d >= addDays(t, -6));
const c = {};
for (const [cid, x] of Object.entries(s.comps || {})) c[cid] = [x.r.map((v) => Math.round(v * 4)).join(""), x.n, off(x.last)];
const b = s.bc ? { ...s.bc, last: off(s.bc.last), weeks: Object.fromEntries(Object.entries(s.bc.weeks).map(([k, v]) => [off(k), v])) } : null;
return {
v: 1, t, p: s.profile, n, c, cr: off(s.created),
e: [s.elo.r, s.elo.n, (s.elo.log || []).slice(-8).map(([d, r]) => [off(d), r])],
k: [s.streak.count, off(s.streak.last)].concat(s.streak.best || s.streak.jokerWk ? [s.streak.best || 0] : []).concat(s.streak.jokerWk ? [off(s.streak.jokerWk)] : []),
h: (s.history || []).slice(-14).map((x) => [off(x.date), x.n, r2(x.score)]),
b, pr: s.prep || null, nw: s.now || null, a: s.a11y && (s.a11y.fs !== 1 || s.a11y.font || s.a11y.hc) ? s.a11y : undefined, g: Object.fromEntries(Object.entries(s.badges || {}).map(([k, d]) => [k, off(d)])),


...(ws ? { w: [off(ws.d), ws.c || {}, ws.k || []] } : {}), ...(co.length ? { co: co.map(off) } : {}),



...(Array.isArray(s.carnet) && s.carnet.length ? { cn: s.carnet.map((x, i, A) => [x.id, x.d, x.code, off(x.date), x.ok || 0].concat(i >= A.length - 8 && x.m ? [x.m, x.a || ""] : [])) } : {}),
...(s.pid ? { pid: s.pid } : {}),

...(s.yp ? { yp: [s.yp.k, s.yp.c, s.yp.pts, (s.yp.past || []).map((x) => [x.k, x.c, x.p])].concat(s.yp.d || s.yp.wk ? [off(s.yp.d), s.yp.dp || 0, s.yp.ds || 0, s.yp.wk || null] : []) } : {}),




...(s.gradeNo && Object.keys(s.gradeNo).length ? { gn: s.gradeNo } : {}),
...(this.flags(s) ? { f: this.flags(s) } : {}),
...(s.weeklyDone ? { wd: s.weeklyDone } : {}),
...(s.prep && s.autotest && s.autotest.key === (s.prep.ids || []).join() ? { at: [s.autotest.avant || {}, (s.autotest.runs || []).map((x) => [x.date, x.r])] } : {}),
...(s.prep && s.mock && s.mock.items ? { mk: s.mock } : {}),
};
},
F: ["tourDone", "eloSeen", "firstDone"],
flags(s) { return this.F.reduce((a, k, i) => a | (s[k] ? 1 << i : 0), 0) | (s.homeMode === "libre" ? 8 : 0); },
setFlags(s, f) { this.F.forEach((k, i) => { if (f & (1 << i)) s[k] = true; }); if (f & 8) s.homeMode = "libre";
},


unpack(o, base) {
if (!o || o.v !== 1 || !o.p || !o.n) throw new Error("code");
const t = base || day(), on = (k) => (k === null || k === undefined ? null : addDays(t, k)), ST = Object.fromEntries(Object.entries(this.ST).map(([a, b]) => [b, a]));
const s = Engine.newState(o.p);
s.created = on(o.cr) || t;
Engine.initNotions(s, Object.fromEntries(Engine.catalog(o.p).map((c) => [c.id, c.defaultStatus])));
for (const [id, a] of Object.entries(o.n)) {
if (!s.notions[id]) continue;
const st = ST[a[0]] || "vu";
if (a.length === 1) { s.notions[id] = Engine.newNotion(st); continue; }
const x = { status: st, m: a[1], box: a[2], due: on(a[3]) || t, seen: a[4], ok: a[5] };
if (a[6] & 1) x.placed = true;
if (a[6] & 2) x.lessonSeen = true;
if (a[7]) x.easy = a[7];
if (a[8] !== null && a[8] !== undefined) x.retry = on(a[8]);
if (a[9] !== null && a[9] !== undefined) x.fails = a[9];
if (a[10] !== null && a[10] !== undefined) x.last = on(a[10]);
s.notions[id] = x;
}
s.comps = Object.fromEntries(Object.entries(o.c || {}).map(([cid, [r, n, l]]) => [cid, { r: [...r].map((ch) => +ch / 4), n, last: on(l) }]));
s.elo = { r: o.e[0], n: o.e[1], log: o.e[2].map(([d, r]) => [on(d), r]) };
s.streak = { count: o.k[0], last: on(o.k[1]) }; if (o.k[2]) s.streak.best = o.k[2]; if (o.k[3] != null) s.streak.jokerWk = on(o.k[3]);
s.history = o.h.map(([d, n, sc]) => ({ date: on(d), n, score: sc }));
if (o.b) s.bc = { ...o.b, last: on(o.b.last), weeks: Object.fromEntries(Object.entries(o.b.weeks).map(([k, v]) => [on(+k), v])) };
s.badges = Object.fromEntries(Object.entries(o.g || {}).map(([k, d]) => [k, on(d)]));
if (o.pr) s.prep = o.pr;
if (o.nw) s.now = o.nw;
if (Array.isArray(o.w) && o.w.length === 3) s.snaps = [{ d: on(o.w[0]), c: o.w[1] || {}, k: o.w[2] || [] }];
if (Array.isArray(o.co)) s.carnetOut = o.co.map(on);
if (Array.isArray(o.cn)) s.carnet = o.cn.filter((x) => Array.isArray(x) && x[0] && x[2]).map(([id, d, code, dt, ok, m, a]) => ({ id, d, code, date: on(dt) || t, ok: ok || 0, ...(m ? { m, a: a || undefined } : {}) }));
if (o.pid) s.pid = o.pid;
if (Array.isArray(o.yp)) {
s.yp = { k: o.yp[0], c: o.yp[1], pts: o.yp[2], d: null, dp: 0, ds: 0, past: (o.yp[3] || []).map(([k, c, p]) => ({ k, c, p })) };
if (o.yp.length > 4) { s.yp.d = on(o.yp[4]); s.yp.dp = +o.yp[5] || 0; s.yp.ds = +o.yp[6] || 0; if (o.yp[7]) s.yp.wk = o.yp[7]; }
}
if (o.gn && typeof o.gn === "object") s.gradeNo = { ...o.gn };
if (o.f) this.setFlags(s, +o.f);
if (typeof o.wd === "string") s.weeklyDone = o.wd;
if (s.prep && Array.isArray(s.prep.ids) && Array.isArray(o.at)) s.autotest = { key: s.prep.ids.join(), rows: null, avant: o.at[0] || {}, runs: (o.at[1] || []).map(([date, r]) => ({ date, r: r || {} })) };
if (s.prep && o.mk && Array.isArray(o.mk.items)) s.mock = o.mk;
if (o.a) s.a11y = { fs: +o.a.fs || 1, font: o.a.font ? 1 : 0, hc: o.a.hc ? 1 : 0 };
s.placed = true;
Engine.migrate(s);
return s;
},
b64(bytes) { let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); },
unb64(s) { const t = atob(s.replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(t, (c) => c.charCodeAt(0)); },
async pipe(bytes, Stream, mode) { return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new Stream(mode))).arrayBuffer()); },

async encode(state) {
const raw = new TextEncoder().encode(JSON.stringify(this.pack(state)));
if (typeof CompressionStream !== "undefined") { try { return "1" + this.b64(await this.pipe(raw, CompressionStream, "deflate-raw")); } catch (e) {} }
return "0" + this.b64(raw);
},

async read(code) {
code = String(code).trim().replace(/^.*#(r|parent)=/, "").replace(/\s+/g, "");
const bytes = this.unb64(code.slice(1));
const raw = code[0] === "1" ? await this.pipe(bytes, DecompressionStream, "deflate-raw") : bytes;
return JSON.parse(new TextDecoder().decode(raw));
},
async decode(code) { return this.unpack(await this.read(code)); },
url(code) { return location.origin + location.pathname + "#r=" + code; },
};



const QR_L = [null, [1, 26, 19], [1, 44, 34], [1, 70, 55], [1, 100, 80], [1, 134, 108], [2, 86, 68], [2, 98, 78], [2, 121, 97], [2, 146, 116],
[2, 86, 68, 2, 87, 69], [4, 101, 81], [2, 116, 92, 2, 117, 93], [4, 133, 107], [3, 145, 115, 1, 146, 116], [5, 109, 87, 1, 110, 88],
[5, 122, 98, 1, 123, 99], [1, 135, 107, 5, 136, 108], [5, 150, 120, 1, 151, 121], [3, 141, 113, 4, 142, 114], [3, 135, 107, 5, 136, 108],
[4, 144, 116, 4, 145, 117], [2, 139, 111, 7, 140, 112], [4, 151, 121, 5, 152, 122], [6, 147, 117, 4, 148, 118], [8, 132, 106, 4, 133, 107],
[10, 142, 114, 2, 143, 115], [8, 152, 122, 4, 153, 123], [3, 147, 117, 10, 148, 118], [7, 146, 116, 7, 147, 117], [5, 145, 115, 10, 146, 116],
[13, 145, 115, 3, 146, 116], [17, 145, 115], [17, 145, 115, 1, 146, 116], [13, 145, 115, 6, 146, 116], [12, 151, 121, 7, 152, 122],
[6, 151, 121, 14, 152, 122], [17, 152, 122, 4, 153, 123], [4, 152, 122, 18, 153, 123], [20, 147, 117, 4, 148, 118], [19, 148, 118, 6, 149, 119]];

const QR = {
blocks(v) { const t = QR_L[v], out = []; for (let i = 0; i < t.length; i += 3) for (let k = 0; k < t[i]; k++) out.push([t[i + 1], t[i + 2]]); return out; },
dataLen(v) { return this.blocks(v).reduce((a, b) => a + b[1], 0); },
rawModules(v) {
let r = (16 * v + 128) * v + 64;
if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
return r;
},
mul(x, y) { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; } return z; },
ecc(data, deg) {
const div = new Array(deg).fill(0); div[deg - 1] = 1;
let root = 1;
for (let i = 0; i < deg; i++) { for (let j = 0; j < deg; j++) { div[j] = this.mul(div[j], root); if (j + 1 < deg) div[j] ^= div[j + 1]; } root = this.mul(root, 2); }
const res = new Array(deg).fill(0);
for (const b of data) { const f = b ^ res.shift(); res.push(0); for (let i = 0; i < deg; i++) res[i] ^= this.mul(div[i], f); }
return res;
},
align(v) {
if (v === 1) return [];
const n = Math.floor(v / 7) + 2, size = v * 4 + 17, step = Math.floor((v * 8 + n * 3 + 5) / (n * 4 - 4)) * 2, r = [6];
for (let p = size - 7; r.length < n; p -= step) r.splice(1, 0, p);
return r;
},

encode(bytes) {
let v = 1;
for (; v <= 40; v++) if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= this.dataLen(v) * 8) break;
if (v > 40) return null;
const cap = this.dataLen(v) * 8, bits = [];
const put = (x, n) => { for (let i = n - 1; i >= 0; i--) bits.push((x >>> i) & 1); };
put(4, 4); put(bytes.length, v < 10 ? 8 : 16); for (const b of bytes) put(b, 8);
put(0, Math.min(4, cap - bits.length)); put(0, (8 - (bits.length % 8)) % 8);
for (let p = 0xec; bits.length < cap; p ^= 0xec ^ 0x11) put(p, 8);
const data = []; for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));

const bl = this.blocks(v), deg = bl[0][0] - bl[0][1], parts = [];
let k = 0;
for (const [, d] of bl) { const dat = data.slice(k, k + d); k += d; parts.push([dat, this.ecc(dat, deg)]); }
const seq = [], maxD = Math.max(...bl.map((b) => b[1]));
for (let i = 0; i < maxD; i++) for (const [d] of parts) if (i < d.length) seq.push(d[i]);
for (let i = 0; i < deg; i++) for (const [, e] of parts) seq.push(e[i]);

const size = v * 4 + 17, m = [...Array(size)].map(() => Array(size).fill(false)), fn = [...Array(size)].map(() => Array(size).fill(false));
const set = (x, y, on) => { m[y][x] = on; fn[y][x] = true; };
for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy)); if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4); } };
finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
const al = this.align(v), na = al.length;
for (let i = 0; i < na; i++) for (let j = 0; j < na; j++) {
if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) continue;
for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
}
const format = (mask) => {
const d = (1 << 3) | mask; let r = d;
for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
const b = ((d << 10) | r) ^ 0x5412, bit = (i) => ((b >>> i) & 1) === 1;
for (let i = 0; i <= 5; i++) set(8, i, bit(i));
set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
set(8, size - 8, true);
};
format(0);
if (v >= 7) {
let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
const b = (v << 12) | r;
for (let i = 0; i < 18; i++) { const on = ((b >>> i) & 1) === 1, a = size - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, on); set(c, a, on); }
}

let i = 0;
for (let right = size - 1; right >= 1; right -= 2) {
if (right === 6) right = 5;
for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
if (!fn[y][x] && i < seq.length * 8) { m[y][x] = ((seq[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; }
}
}

const MASKS = [(x, y) => (x + y) % 2, (x, y) => y % 2, (x) => x % 3, (x, y) => (x + y) % 3, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2,
(x, y) => ((x * y) % 2) + ((x * y) % 3), (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2];
const apply = (k) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[k](x, y) === 0) m[y][x] = !m[y][x]; };
let best = null;
for (let k = 0; k < 8; k++) {
apply(k); format(k);
const p = this.penalty(m);
if (!best || p < best.p) best = { k, p };
apply(k);
}
apply(best.k); format(best.k);
return m;
},
penalty(m) {
const n = m.length; let p = 0, dark = 0;
const lines = (get) => {
for (let a = 0; a < n; a++) {
let run = 1;
for (let b = 1; b <= n; b++) {
if (b < n && get(a, b) === get(a, b - 1)) run++;
else { if (run >= 5) p += run - 2; run = 1; }
}
for (let b = 0; b + 7 <= n; b++) {
const s = [0, 1, 2, 3, 4, 5, 6].map((k) => get(a, b + k));
if (s.join() === "true,false,true,true,true,false,true") {
const before = b >= 4 && [1, 2, 3, 4].every((k) => !get(a, b - k)), after = b + 11 <= n && [7, 8, 9, 10].every((k) => !get(a, b + k));
if (before || after) p += 40;
}
}
}
};
lines((a, b) => m[a][b]); lines((a, b) => m[b][a]);
for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
if (m[y][x]) dark++;
if (x < n - 1 && y < n - 1 && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) p += 3;
}
return p + Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
},

svg(text, px = 260) {
const m = this.encode([...new TextEncoder().encode(text)]);
if (!m) return "";
const n = m.length, q = 4;
let d = "";
for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x + q} ${y + q}h1v1h-1z`;
return `<svg class="qr" viewBox="0 0 ${n + 2 * q} ${n + 2 * q}" width="${px}" height="${px}" role="img" aria-label="QR code de sauvegarde" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
},
};



const L_ = (titre, intro, regle, exemple, piege) => ({ titre, intro, regle, exemple, piege });
const LESSONS = {
prio: L_("Les priorités", "Dans un calcul, l'ordre compte.", "D'abord les parenthèses, puis les puissances, puis \\(\\cdot\\) et \\(:\\) (de gauche à droite), enfin \\(+\\) et \\(-\\).",
["\\(3 + 4 \\cdot 2 = 3 + 8 = 11\\)", "\\((3 + 4) \\cdot 2 = 7 \\cdot 2 = 14\\)", "\\(20 - 2 \\cdot 3^2 = 20 - 18 = 2\\)"], "\\(12 : 2 \\cdot 3 = 18\\) (de gauche à droite), et non \\(2\\)."),
rel: L_("Les nombres relatifs", "Un nombre négatif est à gauche de 0 sur la droite graduée.", "Pour \\(\\cdot\\) et \\(:\\) : signes égaux → résultat positif, signes différents → négatif. Soustraire, c'est additionner l'opposé.",
["\\(-3 + 7 = 4\\)", "\\(5 - (-2) = 5 + 2 = 7\\)", "\\((-4) \\cdot (-3) = 12\\)"], "\\(-3^2 = -9\\), mais \\((-3)^2 = 9\\)."),
fracadd: L_("Additionner des fractions", "On n'additionne que des parts de même taille.", "Mets les fractions au même dénominateur, additionne les numérateurs, garde le dénominateur, puis simplifie.",
["\\(\\frac{2}{3} + \\frac{1}{4} = \\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}\\)", "\\(\\frac{5}{6} - \\frac{1}{2} = \\frac{5}{6} - \\frac{3}{6} = \\frac{1}{3}\\)"], "\\(\\frac{1}{2} + \\frac{1}{3} \\ne \\frac{2}{5}\\) : on n'additionne jamais les dénominateurs."),
fracmul: L_("Multiplier, diviser des fractions", "Ici, pas besoin de dénominateur commun.", "Multiplier : numérateurs entre eux, dénominateurs entre eux. Diviser : multiplier par l'inverse.",
["\\(\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{18}{12} = \\frac{3}{2}\\)", "\\(\\frac{3}{5} : \\frac{2}{7} = \\frac{3}{5} \\cdot \\frac{7}{2} = \\frac{21}{10}\\)"], "Simplifie avant de multiplier, c'est plus facile : \\(\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{1 \\cdot 3}{1 \\cdot 2}\\)."),
pct: L_("Les pourcentages", "« Pour cent » veut dire « sur 100 ».", "\\(p\\,\\%\\) de \\(N\\) = \\(\\frac{p}{100} \\cdot N\\). Une hausse de \\(p\\,\\%\\) multiplie par \\(1 + \\frac{p}{100}\\), une baisse par \\(1 - \\frac{p}{100}\\).",
["\\(15\\,\\%\\) de \\(80\\) = \\(0{,}15 \\cdot 80 = 12\\)", "\\(+20\\,\\%\\) : \\(50 \\cdot 1{,}2 = 60\\)"], "\\(+10\\,\\%\\) puis \\(-10\\,\\%\\) ne ramène pas au prix de départ : \\(1{,}1 \\cdot 0{,}9 = 0{,}99\\)."),
puiss: L_("Les puissances", "\\(a^n\\) = \\(a\\) multiplié \\(n\\) fois par lui-même.", "\\(a^m \\cdot a^n = a^{m+n}\\) ; \\(\\frac{a^m}{a^n} = a^{m-n}\\) ; \\((a^m)^n = a^{mn}\\) ; \\(a^0 = 1\\) ; \\(a^{-n} = \\frac{1}{a^n}\\).",
["\\(2^3 \\cdot 2^4 = 2^7 = 128\\)", "\\(10^{-2} = \\frac{1}{100} = 0{,}01\\)"], "\\(2^3 \\cdot 2^4 = 2^7\\), pas \\(2^{12}\\) : on additionne les exposants."),
sci: L_("La notation scientifique", "Pour écrire des nombres très grands ou très petits.", "\\(a \\cdot 10^n\\) avec \\(1 \\le a < 10\\). Exposant positif : grand nombre ; négatif : nombre plus petit que 1.",
["\\(52\\,000 = 5{,}2 \\cdot 10^4\\)", "\\(0{,}0042 = 4{,}2 \\cdot 10^{-3}\\)"], "\\(42 \\cdot 10^3\\) n'est pas en notation scientifique : \\(4{,}2 \\cdot 10^4\\)."),
rac: L_("Les racines carrées", "\\(\\sqrt{a}\\) est le nombre positif dont le carré vaut \\(a\\).", "Le côté d'un carré d'aire \\(A\\) vaut \\(\\sqrt{A}\\) ; on encadre une racine entre deux carrés parfaits voisins. \\(\\sqrt[3]{a}\\) est le nombre dont le cube vaut \\(a\\).",
["\\(\\sqrt{49} = 7\\)", "\\(7 < \\sqrt{55} < 8\\)", "\\(\\sqrt[3]{125} = 5\\)"], "\\(\\sqrt{9 + 16} = 5\\), mais \\(\\sqrt{9} + \\sqrt{16} = 7\\)."),
valnum: L_("La valeur d'une expression", "Une expression littérale prend une valeur quand on remplace la lettre par un nombre.", "On remplace chaque \\(x\\) par la valeur entre parenthèses, puis on calcule dans l'ordre : puissances, multiplications, additions.",
["\\(3x^2 - 2x + 1\\) pour \\(x = 2\\) : \\(3 \\cdot 2^2 - 2 \\cdot 2 + 1 = 9\\)", "\\(x^2\\) pour \\(x = -3\\) : \\((-3)^2 = 9\\)"], "Sans parenthèses, \\(-3^2 = -9\\) ; avec, \\((-3)^2 = 9\\). Et \\(2x^2\\) pour \\(x = 3\\) vaut \\(18\\), pas \\(36\\)."),
reduire: L_("Réduire une expression", "Réduire, c'est regrouper les termes semblables pour écrire l'expression le plus simplement possible.", "Deux termes sont semblables s'ils ont les mêmes lettres avec les mêmes exposants. On regroupe les \\(x^2\\), les \\(x\\), les nombres. Un « − » devant une parenthèse change le signe de chaque terme.",
["\\(5x^2 - 3x + 4 + 2x - x^2 - 1 = 4x^2 - x + 3\\)", "\\(5x - (2x - 3) = 5x - 2x + 3 = 3x + 3\\)"], "\\(x + x = 2x\\), mais \\(x \\cdot x = x^2\\). Et \\(3x + 2\\) ne se réduit pas."),
distrib: L_("Développer", "Développer, c'est transformer un produit en somme.", "\\(k(a + b) = ka + kb\\) ; \\((a + b)(c + d) = ac + ad + bc + bd\\) : chaque terme multiplie chaque terme, puis on réduit.",
["\\(3(2x - 5) = 6x - 15\\)", "\\((x + 3)(x + 5) = x^2 + 8x + 15\\)", "\\((2x - 1)(x + 4) = 2x^2 + 7x - 4\\)"], "\\((x + 2)(x + 3) \\ne x^2 + 6\\) : il manque les produits \\(3x\\) et \\(2x\\)."),
idrem: L_("Les identités remarquables", "Trois formules à savoir par cœur.", "\\((a + b)^2 = a^2 + 2ab + b^2\\) ; \\((a - b)^2 = a^2 - 2ab + b^2\\) ; \\((a + b)(a - b) = a^2 - b^2\\).",
["\\((x + 4)^2 = x^2 + 8x + 16\\)", "\\((2x - 3)^2 = 4x^2 - 12x + 9\\)", "\\((x + 6)(x - 6) = x^2 - 36\\)"], "\\((x + 3)^2 \\ne x^2 + 9\\) : il manque le double produit \\(6x\\)."),
factor: L_("Factoriser", "Factoriser, c'est l'inverse de développer : transformer une somme en produit.", "D'abord la mise en évidence du plus grand facteur commun ; puis les identités lues à l'envers : \\(a^2 - b^2 = (a - b)(a + b)\\), \\(a^2 \\pm 2ab + b^2 = (a \\pm b)^2\\).",
["\\(4x^2 - 8x = 4x(x - 2)\\)", "\\(x^2 - 49 = (x - 7)(x + 7)\\)", "\\(x^2 + 6x + 9 = (x + 3)^2\\)"], "Une somme de carrés comme \\(x^2 + 9\\) ne se factorise pas. Vérifie toujours en redéveloppant."),
eq1: L_("Équations du 1er degré", "Résoudre, c'est trouver la valeur de \\(x\\) qui rend l'égalité vraie.", "On fait la même opération des deux côtés : on regroupe les \\(x\\) d'un côté, les nombres de l'autre, puis on divise.",
["\\(3x - 5 = 7 \\iff 3x = 12 \\iff x = 4\\)", "\\(2(x + 1) = x + 7 \\iff x = 5\\)"], "Vérifie en remplaçant : \\(3 \\cdot 4 - 5 = 7\\) ✓."),
eq2: L_("Équations produit nul", "Un produit est nul si l'un de ses facteurs est nul.", "Mets tout d'un côté (\\(\\ldots = 0\\)), factorise, puis résous chaque facteur \\(= 0\\).",
["\\((x - 2)(x + 5) = 0 \\iff x = 2\\) ou \\(x = -5\\)", "\\(x^2 = 3x \\iff x(x - 3) = 0 \\iff x = 0\\) ou \\(x = 3\\)"], "Ne divise jamais par \\(x\\) : tu perdrais la solution \\(x = 0\\)."),
prop: L_("La proportionnalité", "Deux grandeurs sont proportionnelles si on passe de l'une à l'autre en multipliant toujours par le même nombre.", "Passe par l'unité : calcule le prix (ou la quantité) pour 1, puis multiplie.",
["3 kg coûtent 7,50 CHF → 1 kg : 2,50 CHF → 5 kg : 12,50 CHF"], "L'âge et la taille ne sont pas proportionnels : vérifie que la situation l'est."),
vitesse: L_("Vitesse moyenne et durées", "La vitesse moyenne relie distance et durée.", "\\(v = \\frac{d}{t}\\), \\(d = v \\cdot t\\), \\(t = \\frac{d}{v}\\). \\(1\\) h \\(= 60\\) min ; \\(1\\) m/s \\(= 3{,}6\\) km/h.",
["\\(150\\) km en \\(2\\) h → \\(75\\) km/h", "\\(1\\) h \\(30\\) min \\(= 1{,}5\\) h"], "\\(1{,}5\\) h n'est pas \\(1\\) h \\(50\\) min : c'est \\(1\\) h \\(30\\) min."),
echelle: L_("Échelle, agrandissement, réduction", "Une échelle \\(1\\,:\\,200\\) signifie : 1 cm sur le plan = 200 cm en vrai.", "Rapport \\(k\\) : les longueurs sont multipliées par \\(k\\), les aires par \\(k^2\\), les volumes par \\(k^3\\).",
["\\(1 : 200\\) : \\(3\\) cm → \\(600\\) cm \\(= 6\\) m", "\\(k = 3\\) : aire \\(\\times 9\\), volume \\(\\times 27\\)"], "Doubler les côtés multiplie l'aire par 4, pas par 2."),
aires: L_("Aires de figures", "L'aire mesure la surface, en unités carrées.", "Rectangle \\(L \\cdot l\\) ; triangle \\(\\frac{b \\cdot h}{2}\\) ; trapèze \\(\\frac{(B + b) \\cdot h}{2}\\) ; disque \\(\\pi r^2\\).",
["Triangle \\(b = 6\\), \\(h = 4\\) : \\(12\\) cm²", "Disque \\(r = 3\\) : \\(9\\pi \\approx 28{,}27\\) cm²"], "La hauteur est perpendiculaire à la base : ce n'est pas forcément un côté."),
pyth: L_("Le théorème de Pythagore", "Dans un triangle rectangle, l'hypoténuse est le plus grand côté, en face de l'angle droit.", "Hypoténuse² = somme des carrés des deux autres côtés : \\(c^2 = a^2 + b^2\\).",
["Cathètes 3 et 4 : \\(c = \\sqrt{9 + 16} = 5\\)", "Hypoténuse 13, cathète 5 : \\(\\sqrt{169 - 25} = 12\\)"], "Pour un côté de l'angle droit, on soustrait : \\(a^2 = c^2 - b^2\\)."),
vol: L_("Volumes de solides", "Le volume mesure l'espace occupé, en unités cubes.", "Prisme, cylindre : base \\(\\times\\) hauteur. Pyramide, cône : \\(\\frac{\\text{base} \\times \\text{hauteur}}{3}\\). Boule : \\(\\frac{4}{3}\\pi r^3\\).",
["Cylindre \\(r = 2\\), \\(h = 5\\) : \\(20\\pi\\) cm³", "Pyramide base 9 cm², \\(h = 4\\) : \\(12\\) cm³"], "N'oublie pas le « divisé par 3 » des pyramides et des cônes."),
thales: L_("Le théorème de Thalès", "Deux triangles emboîtés avec des côtés parallèles.", "Si \\((DE) \\parallel (BC)\\), alors \\(\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}\\).",
["\\(AD = 2\\), \\(AB = 6\\), \\(BC = 9\\) : \\(DE = 9 \\cdot \\frac{2}{6} = 3\\)"], "Compare toujours le petit triangle au grand : \\(\\frac{AD}{AB}\\), pas \\(\\frac{AD}{DB}\\)."),
affine: L_("Fonctions affines", "\\(f(x) = ax + b\\) : sa représentation est une droite.", "\\(a\\) est la pente (\\(\\frac{\\Delta y}{\\Delta x}\\)), \\(b\\) l'ordonnée à l'origine (\\(f(0) = b\\)).",
["\\(f(x) = 2x - 3\\) : \\(f(4) = 5\\)", "Pente entre \\((1 ; 2)\\) et \\((3 ; 8)\\) : \\(\\frac{6}{2} = 3\\)"], "Image : on calcule \\(f(x)\\). Antécédent : on résout \\(f(x) = y\\)."),
eq3: L_("Équations de degré 3", "On se ramène à un produit nul.", "Mets \\(x\\) (ou \\(x^2\\)) en évidence, factorise ce qui reste, puis résous chaque facteur \\(= 0\\).",
["\\(x^3 - 4x = x(x - 2)(x + 2) = 0\\) : \\(x \\in \\{-2 ; 0 ; 2\\}\\)"], "Ne divise pas par \\(x\\) : tu perdrais \\(x = 0\\)."),
eq2disc: L_("Le discriminant", "Pour \\(ax^2 + bx + c = 0\\) quand on ne voit pas de factorisation.", "\\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\) : \\(x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}\\) ; si \\(\\Delta = 0\\) : une solution ; si \\(\\Delta < 0\\) : aucune.",
["\\(x^2 - 5x + 6 = 0\\) : \\(\\Delta = 1\\), \\(x = 2\\) ou \\(3\\)", "\\(x^2 + x + 1 = 0\\) : \\(\\Delta = -3\\), aucune solution"], "\\(-b\\) avec son signe, et tout le numérateur se divise par \\(2a\\)."),
sys2: L_("Systèmes de deux équations", "Deux inconnues, deux équations.", "Combinaison : additionne ou soustrais les équations pour éliminer une inconnue. Substitution : isole une inconnue et remplace.",
["\\(x + y = 7\\) et \\(x - y = 1\\) : en additionnant, \\(2x = 8\\), \\(x = 4\\), \\(y = 3\\)"], "Vérifie le couple dans les deux équations."),
fimg: L_("Images et préimages", "Une fonction associe à chaque \\(x\\) une image \\(f(x)\\).", "Image de \\(a\\) : calcule \\(f(a)\\). Préimages de \\(b\\) : résous \\(f(x) = b\\) (il peut y en avoir plusieurs).",
["\\(f(x) = x^2 - 3\\) : \\(f(2) = 1\\)", "Préimages de \\(6\\) : \\(x^2 = 9\\), \\(x = \\pm 3\\)"], "Une image est unique, les préimages pas forcément."),
f2: L_("La parabole", "\\(f(x) = ax^2 + bx + c\\) : une parabole, tournée vers le haut si \\(a > 0\\).", "Sommet : \\(x_S = -\\frac{b}{2a}\\), puis \\(y_S = f(x_S)\\). Zéros : solutions de \\(f(x) = 0\\). Ordonnée à l'origine : \\(c\\).",
["\\(f(x) = x^2 - 4x + 3\\) : sommet \\((2 ; -1)\\), zéros \\(1\\) et \\(3\\)"], "Le sommet est à mi-chemin des deux zéros."),
inter: L_("Intersection de deux graphes", "Les graphes se coupent là où les deux fonctions ont la même valeur.", "Résous \\(f(x) = g(x)\\) : mets tout d'un côté, factorise ou utilise \\(\\Delta\\). Puis calcule l'ordonnée avec \\(f\\) ou \\(g\\).",
["\\(x^2 = x + 2 \\iff (x - 2)(x + 1) = 0\\) : points \\((2 ; 4)\\) et \\((-1 ; 1)\\)"], "N'oublie pas l'ordonnée si on demande les points."),
angles: L_("Angles au centre et inscrits", "Dans un cercle, deux angles « regardent » le même arc.", "L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc. Un angle inscrit dans un demi-cercle est droit.",
["Angle inscrit 35° → angle au centre 70°"], "Les deux angles doivent intercepter le même arc."),
euclide: L_("Hauteur et Euclide", "Dans un triangle rectangle, la hauteur sur l'hypoténuse la coupe en \\(p\\) et \\(q\\).", "Hauteur : \\(h^2 = p \\cdot q\\). Euclide : cathète² = projection \\(\\cdot\\) hypoténuse.",
["\\(p = 4\\), \\(q = 9\\) : \\(h = \\sqrt{36} = 6\\)"], "La projection d'une cathète est le segment de l'hypoténuse qui lui est adjacent."),
trigo: L_("Trigonométrie du triangle rectangle", "On relie un angle aigu et les côtés.", "\\(\\sin\\alpha = \\frac{\\text{opposé}}{\\text{hypoténuse}}\\), \\(\\cos\\alpha = \\frac{\\text{adjacent}}{\\text{hypoténuse}}\\), \\(\\tan\\alpha = \\frac{\\text{opposé}}{\\text{adjacent}}\\).",
["Hypoténuse 10, angle 30° : opposé \\(= 10 \\sin 30° = 5\\)"], "Calculatrice en degrés ! Et l'hypoténuse est toujours en face de l'angle droit."),
cart: L_("Géométrie cartésienne", "Des points repérés par leurs coordonnées \\((x ; y)\\).", "Distance \\(\\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}\\) ; milieu : moyenne des coordonnées ; pente \\(\\frac{y_B - y_A}{x_B - x_A}\\).",
["\\(A(1 ; 2)\\), \\(B(4 ; 6)\\) : distance 5, milieu \\((2{,}5 ; 4)\\)"], "Garde le même ordre (B moins A) en haut et en bas de la pente."),
recip: L_("Réciproque et composition", "Deux façons d'enchaîner des fonctions.", "\\((f \\circ g)(x) = f(g(x))\\) : on calcule \\(g\\) d'abord. Réciproque : \\(f^{-1}(y)\\) est le \\(x\\) tel que \\(f(x) = y\\).",
["\\(f(x) = 2x + 1\\) : \\(f^{-1}(x) = \\frac{x - 1}{2}\\)"], "\\(f \\circ g\\) et \\(g \\circ f\\) ne sont en général pas égales."),
sinlaw: L_("Triangle quelconque", "Sans angle droit, on utilise deux théorèmes.", "Sinus : \\(\\frac{a}{\\sin\\alpha} = \\frac{b}{\\sin\\beta}\\) (un côté et son angle opposé connus). Cosinus : \\(c^2 = a^2 + b^2 - 2ab\\cos\\gamma\\).",
["\\(a = 5\\), \\(b = 8\\), \\(\\gamma = 60°\\) : \\(c = \\sqrt{25 + 64 - 40} = 7\\)"], "Chaque côté est en face de l'angle de même nom (a en face de α)."),
expo: L_("Exponentielles", "\\(b^x\\) : la croissance (ou décroissance) multiplicative.", "Pour \\(b^{\\ldots} = b^{\\ldots}\\), égale les exposants. Intérêts composés : capital \\(\\cdot (1 + t)^n\\).",
["\\(2^x = 32 = 2^5 \\iff x = 5\\)", "1000 CHF à 2 % pendant 3 ans : \\(1000 \\cdot 1{,}02^3\\)"], "\\(1{,}02^3\\), pas \\(1 + 0{,}02 \\cdot 3\\) : les intérêts produisent des intérêts."),
log: L_("Logarithmes", "Le logarithme répond à : « quel exposant ? ».", "\\(\\log_b x = y \\iff b^y = x\\). Pour \\(b^x = c\\) : \\(x = \\frac{\\ln c}{\\ln b}\\). \\(\\log(ab) = \\log a + \\log b\\).",
["\\(\\log_2 8 = 3\\)", "\\(2^x = 7 \\iff x = \\frac{\\ln 7}{\\ln 2} \\approx 2{,}81\\)"], "\\(\\log(a + b) \\ne \\log a + \\log b\\)."),
absval: L_("Valeur absolue", "\\(|x|\\) est la distance de \\(x\\) à 0 : toujours positive ou nulle.", "\\(|A| = b\\) avec \\(b \\ge 0\\) donne \\(A = b\\) ou \\(A = -b\\). Si \\(b < 0\\) : aucune solution.",
["\\(|x - 3| = 5\\) : \\(x = 8\\) ou \\(x = -2\\)"], "\\(|x| = -2\\) n'a pas de solution."),
ineq: L_("Inéquations", "Comme une équation, avec un sens à respecter.", "On isole \\(x\\) avec les mêmes opérations. En multipliant ou divisant par un nombre négatif, on retourne le signe.",
["\\(3x - 5 > 7 \\iff x > 4\\)", "\\(-2x \\le 6 \\iff x \\ge -3\\)"], "Diviser par \\(-2\\) retourne \\(\\le\\) en \\(\\ge\\)."),
trigcercle: L_("Cercle trigonométrique", "Un cercle de rayon 1 centré à l'origine.", "Le point associé à l'angle \\(\\alpha\\) a pour coordonnées \\((\\cos\\alpha ; \\sin\\alpha)\\). \\(180° = \\pi\\) rad.",
["\\(\\sin 30° = \\frac{1}{2}\\), \\(\\cos 60° = \\frac{1}{2}\\), \\(\\sin 45° = \\frac{\\sqrt{2}}{2}\\)", "\\(90° = \\frac{\\pi}{2}\\) rad"], "Dans le 2e quadrant, le cosinus est négatif."),
trigeq: L_("Équations trigonométriques", "Sur \\([0° ; 360°[\\), il y a en général deux solutions.", "\\(\\sin x = s\\) : \\(x\\) et \\(180° - x\\). \\(\\cos x = c\\) : \\(x\\) et \\(360° - x\\). \\(\\tan x = t\\) : \\(x\\) et \\(x + 180°\\).",
["\\(\\sin x = \\frac{1}{2}\\) : \\(30°\\) et \\(150°\\)"], "Ne t'arrête pas à la première solution."),
stats: L_("Statistiques", "Résumer une série de données en quelques nombres.", "Moyenne : somme / effectif. Médiane : valeur du milieu de la série triée. Écart-type : racine de la moyenne des carrés des écarts à la moyenne.",
["2 ; 4 ; 9 : moyenne 5, médiane 4"], "Trie la série avant de chercher la médiane."),
};


if (typeof LESSONS_EXTRA !== "undefined") for (const [k, v] of Object.entries(LESSONS_EXTRA)) LESSONS[k] = L_(...v);




const LESSONS_V2 = {

proba: ["Probabilités", "Une probabilité mesure la chance qu'un événement se produise : c'est un nombre entre 0 et 1.",
"Quand toutes les issues ont la même chance, \\(P = \\frac{\\text{nombre de cas favorables}}{\\text{nombre de cas possibles}}\\). Pour deux tirages successifs, on dessine un arbre et on multiplie les probabilités le long d'une branche. Sans remise, le nombre de boules diminue d'une unité au deuxième tirage.",
["Un dé : 3 faces paires sur 6, donc \\(P(\\text{pair}) = \\frac{3}{6} = \\frac{1}{2}\\).",
"Urne de 3 rouges et 2 bleues, deux tirages sans remise : \\(P(\\text{deux rouges}) = \\frac{3}{5} \\cdot \\frac{2}{4} = \\frac{3}{10}\\)."],
"Avec deux dés, la somme 7 a 6 cas sur 36 : il faut compter les couples (1 ; 6) et (6 ; 1) séparément."],
volcone: ["Volumes : pyramide, cône, boule", "Un solide « pointu » contient le tiers du solide droit qui a la même base et la même hauteur.",
"Pyramide et cône : \\(V = \\frac{1}{3} \\cdot A_{\\text{base}} \\cdot h\\). Pour un cône, la base est un disque : \\(V = \\frac{1}{3}\\pi r^2 h\\). Boule de rayon \\(r\\) : \\(V = \\frac{4}{3}\\pi r^3\\).",
["Cône de rayon 3 et de hauteur 4 : \\(V = \\frac{1}{3} \\cdot \\pi \\cdot 9 \\cdot 4 = 12\\pi\\).",
"Boule de rayon 3 : \\(V = \\frac{4}{3} \\cdot \\pi \\cdot 27 = 36\\pi\\)."],
"La hauteur \\(h\\) d'un cône n'est pas la génératrice (le côté oblique). Si on donne la génératrice, on calcule d'abord \\(h\\) avec Pythagore."],
gquot: ["Grandeurs quotients", "Vitesse, masse volumique et débit se calculent tous par une division.",
"Vitesse : \\(v = \\frac{d}{t}\\). Masse volumique : \\(\\rho = \\frac{m}{V}\\). Débit : \\(\\frac{\\text{volume}}{\\text{durée}}\\). Chaque formule se retourne : \\(d = v \\cdot t\\), \\(m = \\rho \\cdot V\\). Pour passer des km/h aux m/s, on divise par \\(3{,}6\\).",
["\\(72\\ \\text{km/h} = 72 : 3{,}6 = 20\\ \\text{m/s}\\).",
"Aluminium (\\(\\rho = 2{,}7\\ \\text{g/cm}^3\\)), \\(10\\ \\text{cm}^3\\) : \\(m = 2{,}7 \\cdot 10 = 27\\ \\text{g}\\)."],
"Les unités doivent aller ensemble : des litres avec des L/min, des cm³ avec des g/cm³."],
thales: ["Le théorème de Thalès", "Deux triangles emboîtés, avec deux côtés parallèles, ont la même forme.",
"Si \\(D\\) est sur \\([AB]\\), \\(E\\) sur \\([AC]\\) et \\((DE) \\parallel (BC)\\), alors \\(\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}\\). Chaque rapport compare le petit triangle \\(ADE\\) au grand triangle \\(ABC\\).",
["\\(AD = 2\\), \\(AB = 6\\), \\(BC = 9\\) : \\(\\frac{DE}{9} = \\frac{2}{6}\\), donc \\(DE = 3\\)."],
"On compare \\(AD\\) à \\(AB\\) (le côté entier), pas à \\(DB\\)."],
idrem: ["Les identités remarquables", "Trois développements qui reviennent sans cesse : à savoir par cœur.",
"\\((a + b)^2 = a^2 + 2ab + b^2\\). \\((a - b)^2 = a^2 - 2ab + b^2\\). \\((a + b)(a - b) = a^2 - b^2\\). Le terme \\(2ab\\) s'appelle le double produit.",
["\\((x + 4)^2 = x^2 + 2 \\cdot x \\cdot 4 + 16 = x^2 + 8x + 16\\).",
"\\((2x - 3)^2 = 4x^2 - 12x + 9\\).",
"\\((x + 6)(x - 6) = x^2 - 36\\)."],
"\\((x + 3)^2 \\ne x^2 + 9\\) : il manque le double produit \\(6x\\)."],
factor: ["Factoriser", "Factoriser, c'est le contraire de développer : on transforme une somme en produit.",
"D'abord, on met en évidence le plus grand facteur commun. Ensuite, on cherche une identité remarquable lue à l'envers : \\(a^2 - b^2 = (a - b)(a + b)\\) et \\(a^2 + 2ab + b^2 = (a + b)^2\\). On vérifie en redéveloppant.",
["\\(4x^2 - 8x = 4x(x - 2)\\).", "\\(x^2 - 49 = (x - 7)(x + 7)\\).", "\\(x^2 + 6x + 9 = (x + 3)^2\\)."],
"Une somme de deux carrés, comme \\(x^2 + 9\\), ne se factorise pas."],
formule: ["Transformer une formule", "Isoler une lettre, c'est résoudre une équation dont cette lettre est l'inconnue.",
"On fait la même opération des deux côtés de l'égalité. On défait d'abord ce qui est le plus « à l'extérieur » de la lettre cherchée.",
["\\(v = \\frac{d}{t}\\) : on multiplie par \\(t\\), donc \\(d = v \\cdot t\\).",
"\\(A = \\frac{b \\cdot h}{2}\\) : on multiplie par 2, puis on divise par \\(b\\), donc \\(h = \\frac{2A}{b}\\)."],
"Dans \\(P = 2(x + y)\\), on divise d'abord par 2, puis on soustrait \\(y\\) : \\(x = \\frac{P}{2} - y\\)."],
eq2: ["Équations produit nul", "Un produit vaut zéro seulement si l'un de ses facteurs vaut zéro.",
"On ramène tout d'un côté pour obtenir « … = 0 ». On factorise. On écrit que chaque facteur vaut 0 et on résout chaque petite équation.",
["\\((x - 2)(x + 5) = 0\\) : \\(x - 2 = 0\\) ou \\(x + 5 = 0\\), donc \\(x = 2\\) ou \\(x = -5\\).",
"\\(x^2 = 3x\\) : \\(x^2 - 3x = 0\\), \\(x(x - 3) = 0\\), donc \\(x = 0\\) ou \\(x = 3\\)."],
"Ne divise jamais les deux membres par \\(x\\) : tu perdrais la solution \\(x = 0\\)."],
eq2disc: ["Le discriminant", "Une méthode qui marche pour toute équation \\(ax^2 + bx + c = 0\\).",
"On calcule \\(\\Delta = b^2 - 4ac\\). Si \\(\\Delta > 0\\), il y a deux solutions : \\(x = \\frac{-b - \\sqrt{\\Delta}}{2a}\\) et \\(x = \\frac{-b + \\sqrt{\\Delta}}{2a}\\). Si \\(\\Delta = 0\\), une seule solution : \\(x = \\frac{-b}{2a}\\). Si \\(\\Delta < 0\\), aucune solution.",
["\\(x^2 - 5x + 6 = 0\\) : \\(a = 1\\), \\(b = -5\\), \\(c = 6\\), \\(\\Delta = 25 - 24 = 1\\), donc \\(x = \\frac{5 - 1}{2} = 2\\) ou \\(x = \\frac{5 + 1}{2} = 3\\).",
"\\(x^2 + x + 1 = 0\\) : \\(\\Delta = 1 - 4 = -3 < 0\\), aucune solution."],
"Attention au signe de \\(b\\) : si \\(b = -5\\), alors \\(-b = 5\\) et \\(b^2 = 25\\)."],
sys2: ["Systèmes de deux équations", "Deux inconnues : il faut deux équations.",
"Méthode par combinaison : on additionne ou on soustrait les deux équations pour faire disparaître une inconnue. Méthode par substitution : on isole une inconnue dans une équation et on la remplace dans l'autre. On termine en vérifiant le couple dans les deux équations.",
["\\(x + y = 7\\) et \\(x - y = 1\\) : en additionnant, \\(2x = 8\\), donc \\(x = 4\\), puis \\(y = 7 - 4 = 3\\)."],
"On répond par un couple : \\(x\\) d'abord, puis \\(y\\)."],

angles: ["Angles : parallèles, cercle", "Avec deux parallèles et une sécante, ou dans un cercle, certains angles sont égaux ou liés.",
"Deux parallèles coupées par une sécante : les angles alternes-internes (et les angles correspondants) sont égaux ; deux angles co-intérieurs sont supplémentaires, leur somme vaut 180°. Dans un cercle, l'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc. Deux angles inscrits qui interceptent le même arc sont égaux. Un angle inscrit dans un demi-cercle est droit.",
["Parallèles et sécante : un angle de 70° a un alterne-interne de 70° et un co-intérieur de 110°.",
"Angle inscrit de 35° : l'angle au centre qui intercepte le même arc mesure 70°.",
"Si \\([AB]\\) est un diamètre et \\(C\\) un point du cercle, l'angle en \\(C\\) est droit. Avec \\(\\widehat{CAB} = 60°\\), on trouve \\(\\widehat{CBA} = 180° - 90° - 60° = 30°\\) (2e figure)."],
"Vérifie que les deux angles interceptent bien le même arc."],
simil: ["Agrandir, réduire", "Deux figures semblables ont la même forme : l'une est un agrandissement de l'autre.",
"Si les longueurs sont multipliées par \\(k\\), les aires sont multipliées par \\(k^2\\). Les volumes sont multipliés par \\(k^3\\).",
["Rapport \\(k = 3\\) : une aire de 5 cm² devient \\(5 \\cdot 9 = 45\\) cm².",
"Maquette à l'échelle \\(1\\,:\\,10\\) : le volume réel est \\(10^3 = 1000\\) fois plus grand."],
"Doubler les longueurs ne double pas l'aire : elle est multipliée par 4."],
pythrec: ["Le triangle est-il rectangle ?", "Le théorème de Pythagore fonctionne aussi dans l'autre sens.",
"On repère le plus grand côté \\(c\\). On compare \\(c^2\\) et \\(a^2 + b^2\\). S'ils sont égaux, le triangle est rectangle (réciproque de Pythagore). S'ils sont différents, il ne l'est pas (contraposée).",
["Côtés 5, 12, 13 : \\(13^2 = 169\\) et \\(5^2 + 12^2 = 25 + 144 = 169\\) : rectangle.",
"Côtés 5, 7, 9 : \\(9^2 = 81\\) et \\(5^2 + 7^2 = 74\\) : pas rectangle."],
"C'est toujours le plus grand côté qu'on met seul de son côté."],
airepyr: ["Aire d'une pyramide régulière", "Les faces latérales d'une pyramide régulière sont des triangles isocèles identiques.",
"L'apothème \\(a\\) est la hauteur d'une face latérale. Base carrée de côté \\(c\\) : aire latérale \\(= 4 \\cdot \\frac{c \\cdot a}{2} = 2ca\\). Aire totale \\(=\\) aire latérale \\(+ c^2\\). Si on connaît la hauteur \\(h\\) de la pyramide : \\(a^2 = h^2 + \\left(\\frac{c}{2}\\right)^2\\).",
["\\(c = 6\\), \\(h = 4\\) : \\(a^2 = 16 + 9 = 25\\), donc \\(a = 5\\).", "Aire latérale : \\(2 \\cdot 6 \\cdot 5 = 60\\). Aire totale : \\(60 + 36 = 96\\)."],
"L'apothème n'est ni la hauteur de la pyramide, ni l'arête oblique."],
volcomp: ["Solides composés", "Un solide compliqué est un assemblage de solides simples.",
"On découpe le solide en morceaux connus et on additionne leurs volumes. Cylindre : \\(\\pi r^2 h\\). Cône : \\(\\frac{1}{3}\\pi r^2 h\\). Demi-boule : \\(\\frac{2}{3}\\pi r^3\\). Pyramide : \\(\\frac{1}{3} A_{\\text{base}} \\cdot h\\).",
["Cylindre (\\(r = 3\\), \\(h = 5\\)) surmonté d'un cône de hauteur 4 : \\(45\\pi + 12\\pi = 57\\pi\\)."],
"Garde \\(\\pi\\) dans les calculs : on n'arrondit qu'à la fin."],
volmanq: ["Retrouver une dimension", "Une formule de volume est une équation : on peut y isoler n'importe quelle lettre.",
"On écrit la formule. On remplace les valeurs connues. On isole la dimension cherchée.",
["Cylindre : \\(V = 45\\pi\\) et \\(r = 3\\). \\(\\pi \\cdot 9 \\cdot h = 45\\pi\\), donc \\(h = 5\\).",
"Cône : \\(V = 12\\pi\\) et \\(h = 4\\). \\(\\frac{1}{3}\\pi r^2 \\cdot 4 = 12\\pi\\), donc \\(r^2 = 9\\) et \\(r = 3\\)."],
"Pour un cône ou une pyramide, n'oublie pas le \\(\\frac{1}{3}\\) : on multiplie d'abord par 3."],
ucomp: ["Unités composées", "Une unité comme km/h contient deux unités : on convertit chacune.",
"\\(1\\ \\text{m/s} = 3{,}6\\ \\text{km/h}\\). Des km/h aux m/s, on divise par \\(3{,}6\\). Des m/s aux km/h, on multiplie par \\(3{,}6\\). \\(1\\ \\text{g/cm}^3 = 1000\\ \\text{kg/m}^3\\).",
["\\(72\\ \\text{km/h} = 72 : 3{,}6 = 20\\ \\text{m/s}\\).", "\\(2{,}7\\ \\text{g/cm}^3 = 2700\\ \\text{kg/m}^3\\)."],
"Une même vitesse s'écrit avec un nombre plus petit en m/s qu'en km/h."],
parenth: ["Supprimer des parenthèses", "Tout dépend du signe écrit devant la parenthèse.",
"Devant la parenthèse, un \\(+\\) : on recopie l'intérieur tel quel. Devant la parenthèse, un \\(-\\) : on change le signe de chaque terme de l'intérieur. Ensuite, on réduit.",
["\\(5 + (2x - 3) = 5 + 2x - 3 = 2x + 2\\).", "\\(x - (3 - 2x) = x - 3 + 2x = 3x - 3\\)."],
"\\(-(3 - 2x) = -3 + 2x\\) : tous les signes changent, pas seulement le premier."],
eq2fact: ["Résoudre en factorisant", "Beaucoup d'équations du 2e degré se résolvent sans formule.",
"On ramène tout d'un côté pour obtenir « … = 0 ». On factorise : mise en évidence ou identité remarquable. On écrit que chaque facteur vaut 0.",
["\\(x^2 - 5x = 0\\) : \\(x(x - 5) = 0\\), donc \\(x = 0\\) ou \\(x = 5\\).",
"\\(x^2 = 49\\) : \\(x^2 - 49 = (x - 7)(x + 7) = 0\\), donc \\(x = 7\\) ou \\(x = -7\\)."],
"\\(x^2 = 49\\) a deux solutions : 7 et \\(-7\\)."],
probeq2: ["Problèmes du 2e degré", "Certains problèmes mènent à une équation qui contient \\(x^2\\).",
"On choisit l'inconnue. On traduit l'énoncé en équation. On la ramène à \\(ax^2 + bx + c = 0\\) et on la résout. On garde seulement les solutions qui ont un sens (pas de longueur négative).",
["Rectangle dont la longueur dépasse la largeur de 3, aire 40 : \\(x(x + 3) = 40\\), soit \\(x^2 + 3x - 40 = 0\\), \\((x - 5)(x + 8) = 0\\). La largeur vaut 5."],
"L'équation a souvent deux solutions, mais le problème n'en garde qu'une."],
cercthales: ["Cercle de Thalès, tangente", "Deux angles droits à repérer dans un cercle.",
"Si \\([AB]\\) est un diamètre et \\(C\\) un point du cercle, le triangle \\(ABC\\) est rectangle en \\(C\\). La tangente au cercle en un point \\(T\\) est perpendiculaire au rayon \\([OT]\\). Dans les deux cas, on peut ensuite utiliser Pythagore.",
["\\([AB]\\) diamètre et \\(\\widehat{A} = 35°\\) : l'angle en \\(C\\) est droit, donc \\(\\widehat{B} = 90° - 35° = 55°\\).",
"Rayon \\(OT = 5\\) et \\(OP = 13\\) : le triangle \\(OTP\\) est rectangle en \\(T\\), donc \\(PT = \\sqrt{13^2 - 5^2} = 12\\)."],
"L'angle droit est au point du cercle (\\(C\\) ou \\(T\\)), pas au centre."],
thalesrec: ["Les droites sont-elles parallèles ?", "Le théorème de Thalès fonctionne aussi dans l'autre sens.",
"On calcule \\(\\frac{AD}{AB}\\) et \\(\\frac{AE}{AC}\\). S'ils sont égaux (et les points dans le même ordre), alors \\((DE) \\parallel (BC)\\). S'ils sont différents, les droites ne sont pas parallèles.",
["\\(AD = 4\\), \\(AB = 10\\), \\(AE = 6\\), \\(AC = 15\\) : \\(\\frac{4}{10} = \\frac{6}{15} = 0{,}4\\), donc parallèles.",
"\\(AD = 4\\), \\(AB = 10\\), \\(AE = 6\\), \\(AC = 14\\) : \\(0{,}4 \\ne 0{,}43\\), donc pas parallèles."],
"Les deux rapports doivent être construits de la même façon : petit côté sur grand côté."],
sysprob: ["Deux inconnues, deux équations", "Chaque information de l'énoncé donne une équation.",
"On nomme les deux inconnues \\(x\\) et \\(y\\). On écrit une équation par information. On résout le système. On vérifie dans l'énoncé et on répond à la question posée.",
["Poules et lapins : 11 têtes et 30 pattes. \\(x + y = 11\\) et \\(2x + 4y = 30\\). En soustrayant deux fois la première : \\(2y = 8\\), donc 4 lapins et 7 poules."],
"On ne demande pas toujours les deux inconnues : relis la question."],
denombr: ["Dénombrer", "Compter toutes les possibilités sans les écrire une à une.",
"Si on choisit d'abord parmi \\(a\\) possibilités, puis parmi \\(b\\), il y a \\(a \\cdot b\\) possibilités (c'est un arbre). Si un élément ne peut pas être repris, le nombre de choix diminue de 1 à chaque étape.",
["3 entrées, 4 plats, 2 desserts : \\(3 \\cdot 4 \\cdot 2 = 24\\) menus.",
"Codes de 3 chiffres différents choisis parmi 5 : \\(5 \\cdot 4 \\cdot 3 = 60\\) codes."],
"Entre 5 personnes, il y a \\(\\frac{5 \\cdot 4}{2} = 10\\) poignées de main : chaque poignée a été comptée deux fois."],

polyop: ["Développer et réduire", "Développer, c'est transformer un produit en somme.",
"Chaque terme de la première parenthèse multiplie chaque terme de la seconde. On utilise les identités quand on les reconnaît : \\((a \\pm b)^2 = a^2 \\pm 2ab + b^2\\) et \\((a + b)(a - b) = a^2 - b^2\\). Devant une parenthèse précédée de \\(-\\), on change tous les signes. Pour finir, on réduit et on ordonne.",
["\\((2x - 1)^2 - (x + 3)(x - 3)\\) : \\((4x^2 - 4x + 1) - (x^2 - 9)\\).", "On supprime les parenthèses : \\(4x^2 - 4x + 1 - x^2 + 9 = 3x^2 - 4x + 10\\)."],
"Mets le produit entre parenthèses avant de soustraire : \\(-(x^2 - 9) = -x^2 + 9\\)."],
factor2: ["Factoriser au maximum", "On cherche à écrire une somme comme un produit de facteurs les plus simples possible.",
"Étape 1 : mise en évidence d'un facteur commun. Étape 2 : identités remarquables (\\(a^2 - b^2\\), carrés parfaits). Étape 3 : trinôme, méthode \\(m\\) et \\(n\\) : pour \\(ax^2 + bx + c\\), on cherche deux nombres \\(m\\) et \\(n\\) tels que \\(m + n = b\\) et \\(m \\cdot n = a \\cdot c\\) ; on écrit \\(ax^2 + mx + nx + c\\) et on groupe (si \\(a = 1\\) : \\(x^2 + bx + c = (x + m)(x + n)\\)). Étape 4 : groupements de termes. On recommence tant qu'un facteur peut encore se factoriser.",
["\\(3x^2 - 12 = 3(x^2 - 4) = 3(x - 2)(x + 2)\\).", "\\(2x^2 + 7x + 3\\) : \\(m + n = 7\\), \\(m \\cdot n = 2 \\cdot 3 = 6\\), donc \\(m = 1\\), \\(n = 6\\) : \\(2x^2 + x + 6x + 3 = x(2x + 1) + 3(2x + 1) = (2x + 1)(x + 3)\\).",
"\\(x^3 + 2x^2 - 9x - 18 = x^2(x + 2) - 9(x + 2) = (x + 2)(x^2 - 9) = (x + 2)(x - 3)(x + 3)\\)."],
"\\(3(x^2 - 4)\\) n'est pas fini : \\(x^2 - 4\\) se factorise encore."],
eq3: ["Équations de degré 3", "On se ramène à un produit nul.",
"On met tout d'un côté (« … = 0 »). On met \\(x\\) (ou \\(x^2\\)) en évidence. On factorise ce qui reste. On écrit que chaque facteur vaut 0.",
["\\(x^3 - 4x = 0\\) : \\(x(x^2 - 4) = x(x - 2)(x + 2) = 0\\), donc \\(x = 0\\), \\(x = 2\\) ou \\(x = -2\\)."],
"Ne divise pas par \\(x\\) : tu perdrais la solution \\(x = 0\\)."],
sys3: ["Systèmes à trois inconnues", "Trois équations pour trois inconnues.",
"On élimine \\(x\\) dans deux des équations (par combinaison). On obtient un système de deux équations en \\(y\\) et \\(z\\), qu'on résout. On remonte ensuite pour trouver \\(x\\). On vérifie le triplet dans les trois équations.",
["Système « en escalier » : \\(z = 2\\), puis \\(y + z = 5\\) donne \\(y = 3\\), puis \\(x + y + z = 6\\) donne \\(x = 1\\)."],
"Réponds dans l'ordre : \\(x\\), puis \\(y\\), puis \\(z\\)."],
domaine: ["Domaine de définition", "Le domaine est l'ensemble des nombres \\(x\\) pour lesquels on peut calculer \\(f(x)\\).",
"Deux interdits : on ne divise pas par 0, et on ne prend pas la racine carrée d'un nombre négatif. Un dénominateur doit donc être différent de 0. Une expression sous une racine doit être positive ou nulle.",
["\\(f(x) = \\frac{1}{x - 2}\\) : \\(x - 2 \\ne 0\\), donc \\(D = \\mathbb{R} \\setminus \\{2\\}\\).",
"\\(f(x) = \\sqrt{x - 2}\\) : \\(x - 2 \\ge 0\\), donc \\(D = [2 \\, ; +\\infty[\\)."],
"Pour \\(\\frac{\\sqrt{x - 1}}{x - 3}\\), il faut les deux conditions à la fois : \\(x \\ge 1\\) et \\(x \\ne 3\\)."],
fimg: ["Images et préimages", "Une fonction associe à chaque nombre \\(x\\) un seul nombre \\(f(x)\\), son image.",
"Pour l'image de \\(a\\), on remplace \\(x\\) par \\(a\\) et on calcule \\(f(a)\\). Pour les préimages de \\(b\\), on résout l'équation \\(f(x) = b\\). Un nombre peut avoir plusieurs préimages, ou aucune.",
["\\(f(x) = x^2 - 3\\) : l'image de 2 est \\(f(2) = 4 - 3 = 1\\).",
"Préimages de 6 : \\(x^2 - 3 = 6\\), \\(x^2 = 9\\), donc \\(x = 3\\) ou \\(x = -3\\)."],
"Remplace \\(x\\) par un nombre négatif entre parenthèses : \\((-3)^2 = 9\\)."],
f2: ["La parabole", "Le graphe de \\(f(x) = ax^2 + bx + c\\) est une parabole, tournée vers le haut si \\(a > 0\\), vers le bas si \\(a < 0\\).",
"Ordonnée à l'origine : \\(c\\). Zéros : les solutions de \\(f(x) = 0\\). Sommet : \\(x_S = -\\frac{b}{2a}\\), puis \\(y_S = f(x_S)\\). Le sommet est exactement au milieu des deux zéros.",
["\\(f(x) = x^2 - 4x + 3\\) : \\(x_S = \\frac{4}{2} = 2\\) et \\(f(2) = -1\\), donc sommet \\((2 \\, ; -1)\\).",
"Zéros : \\(x^2 - 4x + 3 = (x - 1)(x - 3) = 0\\), donc 1 et 3 (et 2 est bien au milieu)."],
"Le sommet se donne par ses deux coordonnées : \\(x\\) puis \\(y\\)."],
f2expr: ["Retrouver l'expression d'une parabole", "Il faut trois informations pour connaître une parabole.",
"Si on connaît les zéros \\(x_1\\) et \\(x_2\\) : \\(f(x) = a(x - x_1)(x - x_2)\\). Si on connaît le sommet \\((h \\, ; k)\\) : \\(f(x) = a(x - h)^2 + k\\). Dans les deux cas, un point de plus permet de calculer \\(a\\).",
["Zéros \\(-1\\) et \\(3\\), et \\(f(0) = -6\\) : \\(f(x) = a(x + 1)(x - 3)\\), \\(f(0) = -3a = -6\\), donc \\(a = 2\\).", "D'où \\(f(x) = 2(x + 1)(x - 3) = 2x^2 - 4x - 6\\)."],
"Connaître les zéros ne suffit pas : il faut encore trouver \\(a\\)."],
inter: ["Intersection de deux graphes", "Deux graphes se coupent là où les deux fonctions ont la même valeur.",
"On résout \\(f(x) = g(x)\\) : on met tout d'un côté, puis on factorise ou on utilise le discriminant. Les solutions sont les abscisses des points d'intersection. Pour les ordonnées, on calcule \\(f\\) (ou \\(g\\)) en ces abscisses.",
["\\(x^2 = x + 2\\) : \\(x^2 - x - 2 = (x - 2)(x + 1) = 0\\), donc \\(x = 2\\) ou \\(x = -1\\).", "Points d'intersection : \\((2 \\, ; 4)\\) et \\((-1 \\, ; 1)\\)."],
"Si on demande les points, il faut les deux coordonnées."],
ineq2: ["Inéquations du 2e degré", "On cherche où une parabole est au-dessus ou au-dessous de l'axe des \\(x\\).",
"On ramène tout d'un côté pour comparer le trinôme \\(ax^2 + bx + c\\) à 0. On cherche les zéros. Entre les zéros, le trinôme a le signe contraire de \\(a\\). À l'extérieur des zéros, il a le signe de \\(a\\).",
["\\((x - 1)(x - 4) \\le 0\\) : \\(a = 1 > 0\\), le trinôme est négatif entre les zéros, donc \\(S = [1 \\, ; 4]\\).",
"\\(x^2 - 5x + 4 > 0\\) : mêmes zéros, positif à l'extérieur, donc \\(S = ]-\\infty \\, ; 1[ \\cup ]4 \\, ; +\\infty[\\)."],
"S'il n'y a pas de zéro (\\(\\Delta < 0\\)), le signe est toujours celui de \\(a\\) : \\(S = \\mathbb{R}\\) ou \\(S = \\varnothing\\)."],
racinv: ["Racine carrée et inverse", "Deux fonctions de référence avec des « interdits ».",
"\\(\\sqrt{x}\\) n'existe que pour \\(x \\ge 0\\). \\(\\frac{1}{x}\\) n'existe que pour \\(x \\ne 0\\). Pour résoudre \\(\\sqrt{x} = \\ldots\\), on élève au carré, puis on vérifie chaque solution. Pour \\(\\frac{1}{x} = \\ldots\\), on multiplie par \\(x\\).",
["\\(\\sqrt{x} = x - 2\\) : \\(x = (x - 2)^2\\), \\(x^2 - 5x + 4 = 0\\), donc \\(x = 1\\) ou \\(x = 4\\).", "Vérification : \\(\\sqrt{4} = 2 = 4 - 2\\) ✓ mais \\(\\sqrt{1} = 1 \\ne -1\\) ✗. Seule solution : 4."],
"Élever au carré peut ajouter de fausses solutions : vérifie toujours."],
euclide: ["Hauteur et Euclide", "Dans un triangle rectangle, la hauteur issue de l'angle droit coupe l'hypoténuse en deux segments \\(p\\) et \\(q\\).",
"Théorème de la hauteur : \\(h^2 = p \\cdot q\\). Théorème d'Euclide : chaque côté de l'angle droit, au carré, vaut sa projection multipliée par l'hypoténuse : \\(a^2 = p \\cdot c\\) et \\(b^2 = q \\cdot c\\). La projection de \\(a\\) est le segment \\(p\\) qui touche \\(a\\).",
["\\(p = 4\\) et \\(q = 9\\) : \\(h^2 = 36\\), donc \\(h = 6\\).", "\\(c = 13\\) et \\(p = 4\\) : \\(a^2 = 4 \\cdot 13 = 52\\), donc \\(a = \\sqrt{52}\\)."],
"La hauteur part de l'angle droit et tombe perpendiculairement sur l'hypoténuse."],
droitesrem: ["Droites remarquables", "Quatre familles de droites dans un triangle, chacune avec son point de rencontre.",
"Les médianes (sommet → milieu du côté opposé) se coupent au centre de gravité \\(G\\), situé aux \\(\\frac{2}{3}\\) de chaque médiane depuis le sommet. Les médiatrices se coupent au centre du cercle circonscrit. Les bissectrices se coupent au centre du cercle inscrit. Les hauteurs se coupent à l'orthocentre.",
["Médiane de 9 cm : \\(CG = \\frac{2}{3} \\cdot 9 = 6\\) cm.", "Triangle rectangle : le centre du cercle circonscrit est le milieu de l'hypoténuse."],
"Médiane (va au milieu du côté) et médiatrice (perpendiculaire au milieu) sont deux droites différentes."],
trigo: ["Trigonométrie du triangle rectangle", "Dans un triangle rectangle, un angle aigu et les côtés sont liés.",
"On repère l'hypoténuse (en face de l'angle droit), le côté opposé à l'angle \\(\\alpha\\) et le côté adjacent. \\(\\sin\\alpha = \\frac{\\text{opposé}}{\\text{hypoténuse}}\\). \\(\\cos\\alpha = \\frac{\\text{adjacent}}{\\text{hypoténuse}}\\). \\(\\tan\\alpha = \\frac{\\text{opposé}}{\\text{adjacent}}\\).",
["Hypoténuse 10 et angle 30° : côté opposé \\(= 10 \\cdot \\sin 30° = 5\\).", "Opposé 3 et adjacent 4 : \\(\\tan\\alpha = 0{,}75\\), donc \\(\\alpha \\approx 36{,}9°\\)."],
"La calculatrice doit être en degrés."],
exactes: ["Valeurs exactes", "On garde \\(\\sqrt{2}\\), \\(\\sqrt{3}\\) ou \\(\\pi\\) au lieu d'arrondir.",
"Carré de côté \\(a\\) : diagonale \\(a\\sqrt{2}\\). Triangle équilatéral de côté \\(a\\) : hauteur \\(\\frac{a\\sqrt{3}}{2}\\). Son aire vaut \\(\\frac{a^2\\sqrt{3}}{4}\\).",
["Carré de côté 5 : diagonale \\(\\sqrt{25 + 25} = \\sqrt{50} = 5\\sqrt{2}\\).", "Triangle équilatéral de côté 6 : hauteur \\(\\sqrt{36 - 9} = \\sqrt{27} = 3\\sqrt{3}\\), aire \\(\\frac{6 \\cdot 3\\sqrt{3}}{2} = 9\\sqrt{3}\\)."],
"\\(5\\sqrt{2} \\approx 7{,}07\\) n'est qu'une valeur approchée."],
eqspec: ["Cas particuliers", "Une équation du premier degré n'a pas toujours une solution unique.",
"Parfois, les termes en \\(x\\) disparaissent des deux côtés. Si l'égalité qui reste est fausse (comme \\(3 = 5\\)), il n'y a aucune solution. Si elle est vraie (comme \\(6 = 6\\)), tous les nombres sont solutions.",
["\\(2x + 3 = 2x + 5\\) donne \\(3 = 5\\) : aucune solution.", "\\(2(x + 3) = 2x + 6\\) donne \\(6 = 6\\) : tous les nombres sont solutions."],
"« Aucune solution » et « \\(x = 0\\) » ne veulent pas dire la même chose."],
f2trois: ["Trois points, une parabole", "Trois points (non alignés) déterminent une seule fonction du 2e degré.",
"On écrit \\(f(x) = ax^2 + bx + c\\). Chaque point donne une équation en \\(a\\), \\(b\\), \\(c\\). Le point d'abscisse 0 donne directement \\(c\\). On résout le système pour trouver \\(a\\) et \\(b\\).",
["Points \\((0 \\, ; 1)\\), \\((1 \\, ; 2)\\), \\((-1 \\, ; 6)\\). Le premier donne \\(c = 1\\).", "Les deux autres : \\(a + b + 1 = 2\\) et \\(a - b + 1 = 6\\), donc \\(a = 3\\), \\(b = -2\\) et \\(f(x) = 3x^2 - 2x + 1\\)."],
"Vérifie en recalculant l'image des trois points."],
geocomb: ["Enchaîner les théorèmes", "Un problème de géométrie demande souvent deux étapes.",
"On repère les triangles rectangles cachés dans la figure. Pythagore donne une longueur manquante. Écrire l'aire de deux façons donne une hauteur : \\(a \\cdot b = c \\cdot h\\). La trigonométrie donne un angle.",
["Triangle rectangle de côtés 3 et 4 : hypoténuse 5 (Pythagore).", "Aire : \\(\\frac{3 \\cdot 4}{2} = \\frac{5 \\cdot h}{2}\\), donc la hauteur sur l'hypoténuse vaut \\(h = 2{,}4\\)."],
"Dans l'espace, dessine à part le triangle rectangle que tu utilises."],
trigexact: ["Valeurs exactes ; pente", "Trois angles ont des sinus et cosinus à connaître par cœur.",
"\\(\\sin 30° = \\frac{1}{2}\\) et \\(\\cos 30° = \\frac{\\sqrt{3}}{2}\\). \\(\\sin 45° = \\cos 45° = \\frac{\\sqrt{2}}{2}\\) et \\(\\tan 45° = 1\\). \\(\\sin 60° = \\frac{\\sqrt{3}}{2}\\) et \\(\\cos 60° = \\frac{1}{2}\\). La pente d'une route est la tangente de son angle avec l'horizontale.",
["Hypoténuse 10 et angle 30° : côté opposé \\(= 10 \\cdot \\frac{1}{2} = 5\\).", "Angle de 45° : \\(\\tan 45° = 1\\), soit une pente de \\(100\\,\\%\\)."],
"Une pente de \\(100\\,\\%\\) n'est pas verticale : c'est un angle de \\(45°\\)."],

polydiv: ["Division de polynômes", "Comme pour les entiers : \\(P = Q \\cdot D + R\\), avec un reste plus petit que le diviseur.",
"Le reste de la division de \\(P(x)\\) par \\((x - a)\\) vaut \\(P(a)\\). Si \\(P(a) = 0\\), la division tombe juste : \\(P\\) est divisible par \\((x - a)\\). Le schéma de Horner donne le quotient : on écrit les coefficients de \\(P\\), on abaisse le premier, puis à chaque colonne on multiplie par \\(a\\) et on ajoute le coefficient suivant. Le dernier nombre est le reste ; les autres sont les coefficients du quotient.",
["\\(P(x) = x^2 - 3x + 5\\) divisé par \\((x - 2)\\) : reste \\(P(2) = 4 - 6 + 5 = 3\\).", "Horner, \\(x^3 - 4x^2 + x + 6\\) par \\((x - 2)\\) : \\(1 \\;|\\; -4 \\;|\\; 1 \\;|\\; 6\\) donne \\(1 \\;|\\; -2 \\;|\\; -3 \\;|\\; 0\\) : quotient \\(x^2 - 2x - 3\\), reste 0."],
"Diviser par \\((x + 1)\\), c'est calculer \\(P(-1)\\), pas \\(P(1)\\)."],
polyfact: ["Racine évidente", "Pour factoriser un polynôme de degré 3, on cherche d'abord une racine « facile ».",
"Une racine entière divise toujours le terme constant. On teste \\(\\pm 1\\), \\(\\pm 2\\), \\(\\pm 3\\)… parmi les diviseurs du terme constant. Si \\(P(a) = 0\\), on divise \\(P\\) par \\((x - a)\\). On factorise ensuite le quotient, qui est du 2e degré.",
["\\(P(x) = x^3 - 7x + 6\\) : \\(P(1) = 1 - 7 + 6 = 0\\).", "On divise par \\((x - 1)\\) : \\(x^2 + x - 6 = (x - 2)(x + 3)\\). Donc \\(P(x) = (x - 1)(x - 2)(x + 3)\\)."],
"Pour une équation en \\(x^4\\) et \\(x^2\\) seulement, pose plutôt \\(X = x^2\\)."],
fracrat: ["Fractions rationnelles", "Ce sont des fractions dont le numérateur et le dénominateur sont des polynômes.",
"Pour simplifier, on factorise le numérateur et le dénominateur, puis on supprime les facteurs communs. Pour additionner, on met au même dénominateur. On note les valeurs interdites (dénominateur nul).",
["\\(\\frac{x^2 - 9}{x + 3} = \\frac{(x - 3)(x + 3)}{x + 3} = x - 3\\) (pour \\(x \\ne -3\\)).",
"\\(\\frac{1}{x - 2} + \\frac{1}{x + 2} = \\frac{(x + 2) + (x - 2)}{(x - 2)(x + 2)} = \\frac{2x}{x^2 - 4}\\)."],
"On simplifie des facteurs, jamais des termes : \\(\\frac{x + 3}{x} \\ne 3\\)."],
eqrat: ["Équations rationnelles", "L'inconnue se trouve dans un dénominateur.",
"Étape 1 : on note les valeurs interdites. Étape 2 : on multiplie par le dénominateur commun. Étape 3 : on résout l'équation obtenue. Étape 4 : on écarte les solutions interdites.",
["\\(\\frac{6}{x - 1} = 2\\) : valeur interdite 1. On multiplie : \\(6 = 2(x - 1)\\), donc \\(x = 4\\) (permis)."],
"Une solution égale à une valeur interdite doit être rejetée."],

ineq: ["Inéquations du 1er degré", "Comme une équation, avec un sens à respecter.",
"On isole \\(x\\) avec les mêmes opérations que pour une équation. En multipliant ou en divisant les deux membres par un nombre négatif, on retourne le sens de l'inégalité. La solution s'écrit « \\(x \\le 5\\) » ou avec un intervalle.",
["\\(3x - 4 \\le 11\\) : \\(3x \\le 15\\), donc \\(x \\le 5\\), soit \\(S = ]-\\infty \\, ; 5]\\).", "\\(-2x > 6\\) : on divise par \\(-2\\) et on retourne le sens, donc \\(x < -3\\)."],
"\\(-2x > 6\\) donne \\(x < -3\\), pas \\(x > -3\\) : diviser par un nombre négatif retourne le sens."],
recip: ["Réciproque et composition", "Deux façons d'enchaîner des fonctions.",
"Composée : \\((f \\circ g)(x) = f(g(x))\\), on calcule d'abord \\(g\\). Réciproque : \\(f^{-1}\\) défait ce que fait \\(f\\). Pour la trouver, on écrit \\(y = f(x)\\), on isole \\(x\\), puis on échange les lettres.",
["\\(f(x) = 2x + 1\\) : \\(y = 2x + 1\\) donne \\(x = \\frac{y - 1}{2}\\), donc \\(f^{-1}(x) = \\frac{x - 1}{2}\\).", "Vérification : \\(f(3) = 7\\) et \\(f^{-1}(7) = 3\\)."],
"\\(f \\circ g\\) et \\(g \\circ f\\) ne sont en général pas égales."],
absval: ["Valeur absolue", "\\(|x|\\) est la distance entre \\(x\\) et 0 : elle n'est jamais négative.",
"\\(|A| = b\\) avec \\(b > 0\\) donne deux cas : \\(A = b\\) ou \\(A = -b\\). Si \\(b = 0\\), une seule solution : \\(A = 0\\). Si \\(b < 0\\), aucune solution.",
["\\(|x - 3| = 5\\) : \\(x - 3 = 5\\) ou \\(x - 3 = -5\\), donc \\(x = 8\\) ou \\(x = -2\\)."],
"\\(|x| = -2\\) n'a pas de solution : une distance n'est pas négative."],
homog: ["Fonctions homographiques", "\\(f(x) = \\frac{ax + b}{cx + d}\\) a pour graphe une hyperbole.",
"Asymptote verticale : là où le dénominateur s'annule, \\(x = -\\frac{d}{c}\\). Asymptote horizontale : le rapport des coefficients de \\(x\\), \\(y = \\frac{a}{c}\\). Zéro : là où le numérateur s'annule, \\(x = -\\frac{b}{a}\\). Réciproque : on pose \\(y = f(x)\\), on isole \\(x\\), puis on échange \\(x\\) et \\(y\\).",
["\\(f(x) = \\frac{2x + 1}{x - 3}\\) : asymptote verticale \\(x = 3\\), horizontale \\(y = 2\\), zéro \\(x = -\\frac{1}{2}\\).", "Réciproque : \\(y(x - 3) = 2x + 1 \\Rightarrow x(y - 2) = 3y + 1 \\Rightarrow f^{-1}(x) = \\frac{3x + 1}{x - 2}\\)."],
"L'asymptote horizontale se lit sur les coefficients de \\(x\\), pas sur les constantes."],
trigfn: ["Fonctions trigonométriques", "\\(f(x) = A \\sin(kx) + m\\) est une courbe qui se répète : une sinusoïde.",
"L'amplitude est \\(|A|\\). La période est \\(\\frac{2\\pi}{k}\\) (ou \\(\\frac{360°}{k}\\)). Les valeurs vont de \\(m - |A|\\) à \\(m + |A|\\).",
["\\(f(x) = 3\\sin(2x)\\) : amplitude 3, période \\(\\frac{2\\pi}{2} = \\pi\\), valeurs de \\(-3\\) à 3.", "\\(g(x) = 2\\cos(x) + 1\\) : valeurs de \\(-1\\) à 3."],
"Plus \\(k\\) est grand, plus la période est courte."],
expo: ["Exponentielles", "Une grandeur multipliée chaque fois par le même nombre croît (ou décroît) exponentiellement.",
"Pour résoudre \\(b^{\\ldots} = b^{\\ldots}\\), on écrit les deux membres avec la même base et on égale les exposants. Intérêts composés au taux \\(t\\) pendant \\(n\\) ans : le capital est multiplié par \\((1 + t)^n\\).",
["\\(2^x = 32\\) : \\(32 = 2^5\\), donc \\(x = 5\\).", "1000 CHF à \\(2\\,\\%\\) pendant 3 ans : \\(1000 \\cdot 1{,}02^3 \\approx 1061{,}21\\) CHF."],
"\\(1{,}02^3\\), et non \\(1 + 0{,}02 \\cdot 3\\) : les intérêts rapportent eux aussi des intérêts."],
log: ["Logarithmes", "Le logarithme répond à la question : « quel exposant faut-il ? »",
"\\(\\log_b x = y\\) signifie \\(b^y = x\\). Pour résoudre \\(b^x = c\\), on écrit \\(x = \\frac{\\ln c}{\\ln b}\\). Propriétés : \\(\\log(ab) = \\log a + \\log b\\), \\(\\log\\frac{a}{b} = \\log a - \\log b\\), \\(\\log(a^n) = n \\log a\\). Sans base écrite, \\(\\log\\) est le logarithme en base 10 : \\(\\log 100 = 2\\).",
["\\(\\log_2 8 = 3\\), car \\(2^3 = 8\\).", "\\(2^x = 7\\) : \\(x = \\frac{\\ln 7}{\\ln 2} \\approx 2{,}81\\)."],
"\\(\\log(a + b) \\ne \\log a + \\log b\\)."],
trigcercle: ["Cercle trigonométrique", "Un cercle de rayon 1, centré à l'origine, sur lequel on place les angles.",
"Le point associé à l'angle \\(\\alpha\\) a pour coordonnées \\((\\cos\\alpha \\, ; \\sin\\alpha)\\). Les angles se mesurent depuis l'axe des \\(x\\), dans le sens inverse des aiguilles d'une montre. \\(180° = \\pi\\) rad, donc \\(1° = \\frac{\\pi}{180}\\) rad. Valeurs à connaître : \\(\\cos 30° = \\sin 60° = \\frac{\\sqrt{3}}{2}\\), \\(\\cos 45° = \\sin 45° = \\frac{\\sqrt{2}}{2}\\), \\(\\cos 60° = \\sin 30° = \\frac{1}{2}\\) ; les autres angles s'en déduisent par symétrie, avec le signe du quadrant.",
["\\(90° = \\frac{\\pi}{2}\\) rad, \\(60° = \\frac{\\pi}{3}\\) rad.", "Point associé à 150° : \\(\\left(-\\frac{\\sqrt{3}}{2} \\, ; \\frac{1}{2}\\right)\\), car il est le symétrique de celui de 30°."],
"Dans le 2e quadrant (entre 90° et 180°), le cosinus est négatif."],
trigeq: ["Équations trigonométriques", "Sur un tour complet, il y a en général deux solutions.",
"On trouve une première solution \\(x_1\\) (valeur connue ou calculatrice). \\(\\sin x = s\\) : la deuxième est \\(180° - x_1\\). \\(\\cos x = c\\) : la deuxième est \\(360° - x_1\\). \\(\\tan x = t\\) : la deuxième est \\(x_1 + 180°\\).",
["\\(\\sin x = \\frac{1}{2}\\) sur \\([0° \\, ; 360°[\\) : \\(x = 30°\\) ou \\(x = 180° - 30° = 150°\\)."],
"Ne t'arrête pas à la première solution."],
sinlaw: ["Triangle quelconque", "Sans angle droit, deux théorèmes remplacent Pythagore et la trigonométrie.",
"Chaque côté porte le nom de l'angle qui lui fait face : \\(a\\) en face de \\(\\alpha\\). Théorème du sinus : \\(\\frac{a}{\\sin\\alpha} = \\frac{b}{\\sin\\beta} = \\frac{c}{\\sin\\gamma}\\) (utile si on connaît un côté et l'angle en face). Théorème du cosinus : \\(c^2 = a^2 + b^2 - 2ab\\cos\\gamma\\) (utile avec deux côtés et l'angle entre eux, ou avec les trois côtés pour trouver un angle : \\(\\cos\\gamma = \\frac{a^2 + b^2 - c^2}{2ab}\\)).",
["\\(a = 5\\), \\(b = 8\\), \\(\\gamma = 60°\\) : \\(c^2 = 25 + 64 - 80 \\cdot \\frac{1}{2} = 49\\), donc \\(c = 7\\)."],
"Dans le théorème du cosinus, \\(\\gamma\\) est l'angle en face de \\(c\\), entre \\(a\\) et \\(b\\)."],
cart: ["Distance et milieu", "Dans un repère, on calcule avec les coordonnées.",
"Distance : \\(AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}\\). Milieu \\(M\\) de \\([AB]\\) : la moyenne des abscisses et la moyenne des ordonnées. Pente de \\((AB)\\) : \\(\\frac{y_B - y_A}{x_B - x_A}\\).",
["\\(A(1 \\, ; 2)\\) et \\(B(4 \\, ; 6)\\) : \\(AB = \\sqrt{9 + 16} = 5\\).", "Milieu de \\([AB]\\) : \\(M\\left(\\frac{1 + 4}{2} \\, ; \\frac{2 + 6}{2}\\right) = M(2{,}5 \\, ; 4)\\)."],
"Dans la pente, garde le même ordre (B moins A) en haut et en bas."],
droites: ["Équations de droites", "\\(y = mx + h\\) : \\(m\\) est la pente, \\(h\\) l'ordonnée à l'origine.",
"Pente par deux points : \\(m = \\frac{y_B - y_A}{x_B - x_A}\\). On trouve ensuite \\(h\\) en remplaçant les coordonnées d'un point. Deux droites parallèles ont la même pente. Deux droites perpendiculaires ont des pentes dont le produit vaut \\(-1\\).",
["Par \\(A(0 \\, ; 1)\\) et \\(B(2 \\, ; 5)\\) : \\(m = \\frac{4}{2} = 2\\) et \\(h = 1\\), donc \\(y = 2x + 1\\).", "Perpendiculaire à \\(y = 2x\\) : pente \\(-\\frac{1}{2}\\)."],
"Une droite verticale n'a pas de pente : son équation est \\(x = c\\)."],
cercle: ["Équations de cercles", "Un cercle est l'ensemble des points à la même distance \\(r\\) d'un centre.",
"Le cercle de centre \\((a \\, ; b)\\) et de rayon \\(r\\) a pour équation \\((x - a)^2 + (y - b)^2 = r^2\\). Si l'équation est développée, on complète les carrés pour retrouver le centre et le rayon.",
["\\((x - 1)^2 + (y + 2)^2 = 9\\) : centre \\((1 \\, ; -2)\\), rayon 3.", "\\(x^2 - 6x + y^2 = 0\\) : \\((x - 3)^2 - 9 + y^2 = 0\\), donc centre \\((3 \\, ; 0)\\) et rayon 3."],
"Le second membre est \\(r^2\\) : rayon 3 si on lit 9."],
triaire: ["Aire et distances", "Deux côtés et l'angle compris entre eux suffisent pour tout calculer.",
"Aire du triangle : \\(\\frac{1}{2} \\cdot a \\cdot b \\cdot \\sin\\gamma\\), où \\(\\gamma\\) est l'angle entre les côtés \\(a\\) et \\(b\\). Troisième côté : \\(c^2 = a^2 + b^2 - 2ab\\cos\\gamma\\).",
["\\(a = 6\\), \\(b = 8\\), \\(\\gamma = 30°\\) : aire \\(= \\frac{1}{2} \\cdot 48 \\cdot \\frac{1}{2} = 12\\).", "\\(a = 3\\), \\(b = 8\\), \\(\\gamma = 60°\\) : \\(c^2 = 9 + 64 - 24 = 49\\), donc \\(c = 7\\)."],
"L'angle utilisé doit être celui qui est compris entre les deux côtés."],
droitesinter: ["Droites particulières", "Avec les équations de droites, on décrit les figures d'un triangle.",
"Intersection de deux droites : on résout le système de leurs deux équations. Deux droites sont perpendiculaires quand le produit de leurs pentes vaut \\(-1\\). La médiatrice de \\([AB]\\) est perpendiculaire à \\((AB)\\) et passe par le milieu de \\([AB]\\). La hauteur issue de \\(C\\) est perpendiculaire à \\((AB)\\) et passe par \\(C\\).",
["\\(y = 2x + 1\\) et \\(y = -x + 4\\) : \\(2x + 1 = -x + 4\\), donc \\(x = 1\\) et \\(y = 3\\).", "\\((AB)\\) a pour pente \\(\\frac{1}{2}\\) : la médiatrice et la hauteur ont pour pente \\(-2\\)."],
"La médiatrice passe par le milieu du segment ; la hauteur passe par le sommet opposé."],
fracetage: ["Fractions à étages", "Une grande fraction dont le haut ou le bas contient d'autres fractions.",
"Méthode 1 : on multiplie le haut et le bas de la grande fraction par un dénominateur commun des petites fractions. Méthode 2 : on écrit chaque étage comme une seule fraction, puis on multiplie par l'inverse du bas.",
["\\(\\dfrac{1 + \\frac{2}{x}}{1 - \\frac{2}{x}}\\) : on multiplie haut et bas par \\(x\\), on obtient \\(\\frac{x + 2}{x - 2}\\).", "\\(\\dfrac{\\frac{6}{x}}{\\frac{2}{x^2}} = \\frac{6}{x} \\cdot \\frac{x^2}{2} = 3x\\)."],
"Tous les termes des deux étages sont multipliés, pas seulement les fractions."],

stats: ["Statistiques", "Résumer une série de données en quelques nombres.",
"Moyenne : la somme des valeurs divisée par l'effectif. Médiane : la valeur du milieu de la série triée (la moyenne des deux valeurs du milieu si l'effectif est pair). Écart-type : la racine de la moyenne des carrés des écarts à la moyenne ; il mesure la dispersion.",
["Série 2 ; 4 ; 9 : moyenne \\(\\frac{15}{3} = 5\\), médiane 4.", "Écarts à la moyenne : \\(-3\\), \\(-1\\), 4 ; carrés 9, 1, 16 ; moyenne \\(\\frac{26}{3}\\) ; écart-type \\(\\sqrt{26/3} \\approx 2{,}94\\)."],
"Trie la série avant de chercher la médiane."],

prio: ["Les priorités", "Dans un calcul, on n'effectue pas les opérations dans n'importe quel ordre.",
"D'abord les calculs entre parenthèses. Ensuite les puissances. Puis les multiplications et les divisions, de gauche à droite. Enfin les additions et les soustractions, de gauche à droite.",
["\\(3 + 4 \\cdot 2\\) : d'abord \\(4 \\cdot 2 = 8\\), puis \\(3 + 8 = 11\\).", "\\((3 + 4) \\cdot 2 = 7 \\cdot 2 = 14\\).", "\\(20 - 2 \\cdot 3^2\\) : \\(3^2 = 9\\), puis \\(2 \\cdot 9 = 18\\), puis \\(20 - 18 = 2\\)."],
"\\(12 : 2 \\cdot 3\\) se calcule de gauche à droite : \\(6 \\cdot 3 = 18\\), et non \\(12 : 6 = 2\\)."],
arith: ["PGDC et PPMC", "Deux outils pour comparer deux nombres entiers.",
"On décompose chaque nombre en produit de facteurs premiers. Le PGDC (plus grand diviseur commun) est le produit des facteurs communs, avec le plus petit exposant. Le PPMC (plus petit multiple commun) est le produit de tous les facteurs, avec le plus grand exposant.",
["\\(24 = 2^3 \\cdot 3\\) et \\(36 = 2^2 \\cdot 3^2\\).", "PGDC \\(= 2^2 \\cdot 3 = 12\\) ; PPMC \\(= 2^3 \\cdot 3^2 = 72\\)."],
"« Partager en parts égales les plus grandes possible » : c'est le PGDC. « Se retrouver de nouveau en même temps » : c'est le PPMC."],
fracadd: ["Additionner des fractions", "On ne peut additionner que des parts de même taille.",
"On met les fractions au même dénominateur. On additionne (ou on soustrait) les numérateurs. On garde le dénominateur. On simplifie si c'est possible.",
["\\(\\frac{2}{3} + \\frac{1}{4} = \\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}\\).", "\\(\\frac{5}{6} - \\frac{1}{2} = \\frac{5}{6} - \\frac{3}{6} = \\frac{2}{6} = \\frac{1}{3}\\)."],
"On n'additionne jamais les dénominateurs : \\(\\frac{1}{2} + \\frac{1}{3} \\ne \\frac{2}{5}\\)."],
diagr: ["Diagrammes et moyennes", "Un diagramme résume une série de données.",
"Moyenne : on additionne toutes les valeurs et on divise par leur nombre. Si une valeur apparaît plusieurs fois, on la multiplie par son effectif. Diagramme circulaire : l'angle d'un secteur vaut \\(\\frac{\\text{effectif}}{\\text{total}} \\cdot 360°\\).",
["Notes 4 ; 5 ; 6 : moyenne \\(\\frac{4 + 5 + 6}{3} = 5\\).", "6 élèves sur 24 viennent à pied : secteur de \\(\\frac{6}{24} \\cdot 360° = 90°\\)."],
"Pour une moyenne avec effectifs, on divise par l'effectif total, pas par le nombre de valeurs différentes."],
prop: ["La règle de trois", "Deux grandeurs sont proportionnelles si on passe de l'une à l'autre en multipliant toujours par le même nombre.",
"On calcule la valeur pour une unité (en divisant). Puis on multiplie par le nombre d'unités voulu.",
["3 kg coûtent 7,50 CHF. 1 kg coûte \\(7{,}50 : 3 = 2{,}50\\) CHF. 5 kg coûtent \\(5 \\cdot 2{,}50 = 12{,}50\\) CHF."],
"Vérifie que la situation est proportionnelle : l'âge et la taille ne le sont pas."],
valnum: ["La valeur d'une expression", "Une expression avec une lettre prend une valeur dès qu'on remplace la lettre par un nombre.",
"On remplace chaque lettre par sa valeur, entre parenthèses si elle est négative. On calcule ensuite en respectant les priorités : puissances, puis multiplications, puis additions.",
["\\(3x^2 - 2x + 1\\) pour \\(x = 2\\) : \\(3 \\cdot 2^2 - 2 \\cdot 2 + 1 = 12 - 4 + 1 = 9\\).", "\\(x^2\\) pour \\(x = -3\\) : \\((-3)^2 = 9\\)."],
"\\(2x^2\\) pour \\(x = 3\\) vaut \\(2 \\cdot 9 = 18\\), pas \\(6^2 = 36\\) : la puissance passe avant la multiplication."],
angtri: ["Somme des angles", "Dans une figure, les angles ne sont pas libres : leur somme est fixée.",
"Dans un triangle, la somme des trois angles vaut \\(180°\\). Dans un quadrilatère, la somme des quatre angles vaut \\(360°\\). Dans un triangle isocèle, les deux angles à la base sont égaux.",
["Deux angles de \\(50°\\) et \\(60°\\) : le troisième vaut \\(180° - 50° - 60° = 70°\\).", "Triangle isocèle avec un angle au sommet de \\(40°\\) : chaque angle à la base vaut \\(\\frac{180° - 40°}{2} = 70°\\)."],
"Dans un triangle isocèle, repère d'abord le sommet principal (entre les deux côtés égaux)."],

rel: ["Calculer avec les nombres relatifs", "Les règles de signe permettent de calculer avec des nombres négatifs.",
"Multiplier ou diviser deux nombres de même signe donne un résultat positif. Deux nombres de signes différents donnent un résultat négatif. Soustraire un nombre, c'est additionner son opposé. Les priorités restent les mêmes.",
["\\((-4) \\cdot (-3) = 12\\) et \\((-4) \\cdot 3 = -12\\).", "\\(5 - (-2) = 5 + 2 = 7\\).", "\\(-2 - 3 \\cdot (-4) = -2 + 12 = 10\\)."],
"\\(-3^2 = -9\\) (le carré porte seulement sur 3), mais \\((-3)^2 = 9\\)."],
vol: ["Volumes : prisme et cylindre", "Un prisme droit et un cylindre ont deux bases identiques reliées par des faces droites.",
"Volume = aire de la base \\(\\cdot\\) hauteur. Pavé : \\(V = a \\cdot b \\cdot c\\). Prisme à base triangulaire : \\(V = \\frac{b \\cdot h_{\\text{triangle}}}{2} \\cdot H\\). Cylindre : la base est un disque, donc \\(V = \\pi r^2 h\\).",
["Pavé de 2 cm × 3 cm × 4 cm : \\(V = 24\\ \\text{cm}^3\\).", "Cylindre de rayon 2 cm et de hauteur 5 cm : \\(V = \\pi \\cdot 4 \\cdot 5 = 20\\pi\\ \\text{cm}^3\\)."],
"La hauteur du prisme est la distance entre les deux bases, pas la hauteur du triangle de base."],
fracmul: ["Multiplier, diviser des fractions", "Pour multiplier ou diviser, pas besoin de dénominateur commun.",
"Multiplier : on multiplie les numérateurs entre eux et les dénominateurs entre eux. Diviser par une fraction : on multiplie par son inverse. On simplifie avant de multiplier, c'est plus facile.",
["\\(\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{2 \\cdot 9}{3 \\cdot 4} = \\frac{18}{12} = \\frac{3}{2}\\).", "\\(\\frac{3}{5} : \\frac{2}{7} = \\frac{3}{5} \\cdot \\frac{7}{2} = \\frac{21}{10}\\)."],
"Pour diviser, on retourne seulement la deuxième fraction."],
pct: ["Les pourcentages", "« Pour cent » veut dire « sur 100 ».",
"\\(p\\,\\%\\) d'une quantité \\(N\\) se calcule par \\(\\frac{p}{100} \\cdot N\\). Une hausse de \\(p\\,\\%\\) multiplie par \\(1 + \\frac{p}{100}\\). Une baisse de \\(p\\,\\%\\) multiplie par \\(1 - \\frac{p}{100}\\).",
["\\(15\\,\\%\\) de 80 : \\(0{,}15 \\cdot 80 = 12\\).", "Prix de 50 CHF augmenté de \\(20\\,\\%\\) : \\(50 \\cdot 1{,}2 = 60\\) CHF."],
"\\(+10\\,\\%\\) puis \\(-10\\,\\%\\) ne ramène pas au prix de départ : \\(1{,}1 \\cdot 0{,}9 = 0{,}99\\)."],
puiss: ["Les puissances", "\\(a^n\\) est le produit de \\(n\\) facteurs égaux à \\(a\\).",
"Même base, multiplication : on additionne les exposants, \\(a^m \\cdot a^n = a^{m+n}\\). Même base, division : on soustrait, \\(\\frac{a^m}{a^n} = a^{m-n}\\). Puissance d'une puissance : on multiplie, \\((a^m)^n = a^{mn}\\). \\(a^0 = 1\\) et \\(a^{-n} = \\frac{1}{a^n}\\).",
["\\(2^3 \\cdot 2^4 = 2^7 = 128\\).", "\\(10^{-2} = \\frac{1}{10^2} = 0{,}01\\)."],
"\\(2^3 \\cdot 2^4 = 2^7\\), et non \\(2^{12}\\) : on additionne les exposants."],
sci: ["La notation scientifique", "Pour écrire simplement les nombres très grands ou très petits.",
"Un nombre en notation scientifique s'écrit \\(a \\cdot 10^n\\), avec \\(a\\) entre 1 (compris) et 10 (exclu). Un exposant positif donne un grand nombre. Un exposant négatif donne un nombre plus petit que 1.",
["\\(52'000 = 5{,}2 \\cdot 10^4\\) : la virgule a reculé de 4 rangs.", "\\(0{,}0042 = 4{,}2 \\cdot 10^{-3}\\) : la virgule a avancé de 3 rangs."],
"\\(42 \\cdot 10^3\\) n'est pas en notation scientifique : on écrit \\(4{,}2 \\cdot 10^4\\)."],
rac: ["Les racines carrées", "\\(\\sqrt{a}\\) est le nombre positif dont le carré vaut \\(a\\) : \\(\\sqrt{49} = 7\\) car \\(7^2 = 49\\).",
"La racine carrée « défait » le carré : le côté d'un carré d'aire \\(A\\) vaut \\(\\sqrt{A}\\). Si le nombre n'est pas un carré parfait, on encadre sa racine entre deux entiers grâce aux carrés voisins. De même, la racine cubique \\(\\sqrt[3]{a}\\) est le nombre dont le cube vaut \\(a\\) : c'est l'arête d'un cube de volume \\(a\\).",
["\\(\\sqrt{144} = 12\\) car \\(12^2 = 144\\).", "\\(7^2 = 49 < 55 < 64 = 8^2\\), donc \\(7 < \\sqrt{55} < 8\\).", "\\(\\sqrt[3]{125} = 5\\) car \\(5^3 = 125\\)."],
"\\(\\sqrt{9 + 16} = \\sqrt{25} = 5\\), mais \\(\\sqrt{9} + \\sqrt{16} = 7\\) : on calcule d'abord sous la racine."],
racprop: ["Racines : propriétés", "Les racines se multiplient et se divisent, mais ne s'additionnent pas n'importe comment.",
"\\(\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}\\) et \\(\\sqrt{a \\div b} = \\sqrt{a} \\div \\sqrt{b}\\) (\\(a, b\\) positifs). Pour simplifier, on sort le plus grand carré parfait : \\(\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}\\). On additionne seulement des racines semblables : \\(2\\sqrt{3} + 5\\sqrt{3} = 7\\sqrt{3}\\). \\(\\left(\\sqrt{a}\\right)^2 = a\\). La racine cubique existe aussi pour un négatif (\\(\\sqrt[3]{-8} = -2\\)) et suit les mêmes règles pour le produit : on sort les cubes parfaits.",
["\\(\\sqrt{12} \\cdot \\sqrt{3} = \\sqrt{36} = 6\\).", "\\(\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}\\).", "\\(\\sqrt[3]{1080} = \\sqrt[3]{216 \\cdot 5} = 6\\sqrt[3]{5}\\)."],
"\\(\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}\\) : \\(\\sqrt{9 + 16} = 5\\), mais \\(\\sqrt{9} + \\sqrt{16} = 7\\)."],
disque: ["Cercle et disque", "Le nombre \\(\\pi \\approx 3{,}14\\) relie le rayon au périmètre et à l'aire.",
"Périmètre du cercle : \\(2\\pi r\\). Aire du disque : \\(\\pi r^2\\). Pour un arc ou un secteur d'angle \\(\\alpha\\), on prend la fraction \\(\\frac{\\alpha}{360°}\\) du cercle entier.",
["Rayon 3 : périmètre \\(6\\pi\\), aire \\(9\\pi\\).", "Secteur de \\(90°\\) et de rayon 4 : aire \\(\\frac{90}{360} \\cdot 16\\pi = 4\\pi\\)."],
"Si on donne le diamètre, on le divise par 2 pour avoir le rayon."],
vitesse: ["Vitesse, distance, durée", "La vitesse moyenne relie la distance parcourue et la durée du trajet.",
"\\(v = \\frac{d}{t}\\). On en tire \\(d = v \\cdot t\\) et \\(t = \\frac{d}{v}\\). Les durées se convertissent par 60 : \\(1\\ \\text{h} = 60\\ \\text{min}\\).",
["150 km en 2 h : \\(v = \\frac{150}{2} = 75\\) km/h.", "60 km à 120 km/h : \\(t = \\frac{60}{120} = 0{,}5\\) h, soit 30 min."],
"\\(1{,}5\\) h, ce n'est pas 1 h 50 min, mais 1 h 30 min."],
pyth: ["Le théorème de Pythagore", "Dans un triangle rectangle, l'hypoténuse est le plus grand côté, en face de l'angle droit.",
"Le carré de l'hypoténuse vaut la somme des carrés des deux autres côtés : \\(c^2 = a^2 + b^2\\). Pour trouver l'hypoténuse, on additionne les carrés. Pour trouver un autre côté, on soustrait : \\(a^2 = c^2 - b^2\\).",
["Côtés de l'angle droit 3 et 4 : \\(c^2 = 9 + 16 = 25\\), donc \\(c = 5\\).", "Hypoténuse 13 et un côté 5 : \\(a^2 = 169 - 25 = 144\\), donc \\(a = 12\\)."],
"Repère d'abord l'hypoténuse : c'est elle qui est seule de son côté du signe \\(=\\)."],
reduire: ["Réduire une expression", "Réduire, c'est regrouper les termes semblables pour écrire l'expression le plus simplement possible.",
"Deux termes sont semblables s'ils ont les mêmes lettres avec les mêmes exposants. On regroupe les \\(x^2\\) ensemble, les \\(x\\) ensemble, et les nombres ensemble. Un signe \\(-\\) devant une parenthèse change le signe de chaque terme.",
["\\(5x^2 - 3x + 4 + 2x - x^2 - 1 = 4x^2 - x + 3\\).", "\\(5x - (2x - 3) = 5x - 2x + 3 = 3x + 3\\)."],
"\\(x + x = 2x\\) mais \\(x \\cdot x = x^2\\). Et \\(3x + 2\\) ne se réduit pas."],
distrib: ["Développer", "Développer, c'est transformer un produit en somme.",
"Simple distributivité : \\(k(a + b) = ka + kb\\). Double distributivité : chaque terme de la première parenthèse multiplie chaque terme de la seconde, \\((a + b)(c + d) = ac + ad + bc + bd\\). On réduit à la fin.",
["\\(3(2x - 5) = 6x - 15\\).", "\\((x + 3)(x + 5) = x^2 + 5x + 3x + 15 = x^2 + 8x + 15\\)."],
"\\((x + 2)(x + 3) \\ne x^2 + 6\\) : il manque les produits \\(3x\\) et \\(2x\\)."],
eq1: ["Équations du 1er degré", "Résoudre une équation, c'est trouver la valeur de \\(x\\) qui rend l'égalité vraie.",
"On peut faire la même opération des deux côtés sans changer les solutions. On regroupe les termes en \\(x\\) d'un côté et les nombres de l'autre. On divise par le nombre devant \\(x\\). On vérifie en remplaçant.",
["\\(3x - 5 = 7\\) : on ajoute 5, \\(3x = 12\\), on divise par 3, \\(x = 4\\).", "\\(2(x + 1) = x + 7\\) : \\(2x + 2 = x + 7\\), donc \\(x = 5\\)."],
"Vérifie toujours : \\(3 \\cdot 4 - 5 = 7\\) ✓."],
probeq: ["Mettre un problème en équation", "L'algèbre permet de traduire un énoncé et de le résoudre.",
"On choisit l'inconnue et on écrit ce qu'elle représente. On traduit l'énoncé par une équation. On la résout. On vérifie dans l'énoncé et on répond par une phrase.",
["Trois entiers consécutifs ont pour somme 48. Le premier est \\(n\\) : \\(n + (n + 1) + (n + 2) = 48\\), \\(3n + 3 = 48\\), \\(n = 15\\). Les nombres sont 15, 16 et 17."],
"Une solution de l'équation peut ne pas convenir à l'énoncé (âge négatif, nombre non entier)."],
echelle: ["Échelle, agrandissement, réduction", "Une échelle compare les longueurs d'un plan aux longueurs réelles.",
"Échelle \\(1\\,:\\,200\\) : 1 cm sur le plan représente 200 cm en réalité. Quand les longueurs sont multipliées par \\(k\\), les aires sont multipliées par \\(k^2\\) et les volumes par \\(k^3\\).",
["Échelle \\(1\\,:\\,200\\), 3 cm sur le plan : \\(3 \\cdot 200 = 600\\) cm, soit 6 m.", "Rapport \\(k = 3\\) : une aire est multipliée par 9, un volume par 27."],
"Doubler les côtés multiplie l'aire par 4, pas par 2."],
affine: ["Fonctions affines", "\\(f(x) = ax + b\\) : son graphe est une droite.",
"\\(a\\) est la pente : quand \\(x\\) augmente de 1, \\(f(x)\\) augmente de \\(a\\). Entre deux points, \\(a = \\frac{\\Delta y}{\\Delta x}\\). \\(b\\) est l'ordonnée à l'origine : \\(f(0) = b\\).",
["\\(f(x) = 2x - 3\\) : \\(f(4) = 8 - 3 = 5\\).", "Pente entre \\((1 \\, ; 2)\\) et \\((3 \\, ; 8)\\) : \\(\\frac{8 - 2}{3 - 1} = 3\\)."],
"Image : on calcule \\(f(x)\\). Préimage : on résout \\(f(x) = y\\)."],
polyreg: ["Polygones réguliers", "Un polygone régulier a tous ses côtés égaux et tous ses angles égaux.",
"Pour un polygone régulier à \\(n\\) côtés, l'angle au centre vaut \\(\\frac{360°}{n}\\). Chaque angle intérieur vaut \\(180° - \\frac{360°}{n}\\).",
["Hexagone (\\(n = 6\\)) : angle au centre \\(60°\\), angle intérieur \\(120°\\).", "Octogone (\\(n = 8\\)) : angle au centre \\(45°\\), angle intérieur \\(135°\\)."],
"La somme de tous les angles intérieurs vaut \\((n - 2) \\cdot 180°\\)."],
};


const LESSON_FIGS_V2 = {

prio: () => FIG.prioSteps([["20 − 2 · ", "3²", "", "puissance"], ["20 − ", "2 · 9", "", "multiplication"], ["", "20 − 18", "", "soustraction"]], "2"),
angtri: () => FIG.triAngles(["α", "β", "γ"]),
diagr: () => FIG.sector("", 90, "90°"),
rel: () => FIG.numberLine(-2, [5]),
vol: () => FIG.cylinder("r", "h"),
fracadd: () => FIG.fractionBars([[2, 3], [1, 4]]),
fracmul: () => FIG.fractionBars([[2, 3], [3, 4]]),
pct: () => FIG.percentBar(15, 80),
disque: () => FIG.sector("r", 90, "α"),
pyth: () => GF.rightTri(3, 4, { la: "a", lb: "b", lc: "c" }),
echelle: () => FIG.scaling(2, "rect"),
affine: () => FIG.plot([{ f: (x) => 2 * x - 3 }], [[0, -3, "b"], [4, 5, ""]], { numbers: true, xr: [-2, 5], yr: [-4, 6], squash: 0.6 }),
polyreg: () => FIG.regPoly(6, "60°"),
perim: () => GF.rect(7, 4, { lw: "L", lh: "l" }),
aire1: () => FIG.triangleFig("b", "h"),
aire2: () => GF.para(8, 5, { lb: "b", lh: "h" }),
aire3: () => GF.house(8, 4, 3, { a: "", b: "", h: "" }),
volpave: () => FIG.box("a", "b", "c"),
solides: () => FIG.box("", "", ""),
angtype: () => GF.straight(65, "65°", "115°"),
quadri: () => GF.rect(8, 5, { diag: " " }),
uaire: () => {
const g = GEO().add([0, 0], [10, 10]).poly([[0, 0], [10, 0], [10, 10], [0, 10]], "f-shape");
for (let i = 1; i < 10; i++) g.seg([i, 0], [i, 10], { cls: "f-line" }).seg([0, i], [10, i], { cls: "f-line" });
g.poly([[0, 0], [1, 0], [1, 1], [0, 1]], "f-fill").side([0, 0], [10, 0], "1 m").side([10, 0], [10, 10], "10 dm");
return g.svg("1 m² = 100 dm²");
},
uvol: () => FIG.box("1 dm", "1 dm", "1 dm"),
relrep: () => FIG.numberLine(-4, [7]),
reladd: () => FIG.numberLine(-3, [5]),
fracrep: () => FIG.fractionBars([[2, 3], [5, 6]]),
fractout: () => FIG.fractionOf(3, 4, 20),
agrand: () => FIG.scaling(2.5, "rect"),
grandmanq: () => FIG.triangleFig("b", "h = ?"),
airelat: () => FIG.cylinder("r", "h"),
voldecomp: () => GF.house(8, 4, 3, { a: "", b: "", h: "" }),
pythfig: () => GF.isoH(10, 13, { lb: "base", ls: "côté", lh: "h" }),
rotation: () => GF.clock(3),
repere: () => FIG.plot([], [[-3, 2, "A(−3 ; 2)"]], { numbers: true, xr: [-5, 5], yr: [-4, 4], squash: 0.7 }),
pente: () => GF.slope(10, { a: "", h: "distance horizontale", v: "dénivelé" }),

sysgraph: () => FIG.plot([{ f: (x) => 2 * x + 1 }, { f: (x) => 2 * x - 3, cls: "f-line" }], [], { numbers: true, xr: [-3, 4], yr: [-4, 6], squash: 0.6 }),
optim: () => FIG.plot([{ f: (t) => (-5 * t * t + 20 * t) / 5 }], [[2, 4, "maximum"]], { numbers: false, ticks: false, xr: [-0.5, 4.5], yr: [-0.6, 5], squash: 0.6 }),
lectgraph: () => FIG.plot([{ f: (x) => (x - 0) ** 3 - 3 * x }], [], { numbers: true, xr: [-3, 3], yr: [-4, 4], hlines: [1], squash: 0.6 }),
affzero: () => FIG.plot([{ f: (x) => 2 * x - 6 }], [[3, 0, "zéro"]], { numbers: true, xr: [-1, 6], yr: [-6, 5], squash: 0.6 }),
f2formes: () => FIG.plot([{ f: (x) => (x - 3) ** 2 - 4 }], [[3, -4, "S(3 ; −4)"], [1, 0, ""], [5, 0, ""]], { numbers: true, xr: [-1, 7], yr: [-5, 6], squash: 0.6 }),
f2trois: () => FIG.plot([{ f: (x) => 3 * x * x - 2 * x + 1 }], [[0, 1, ""], [1, 2, ""], [-1, 6, ""]], { numbers: true, xr: [-2, 2], yr: [-1, 8], squash: 0.6 }),
interpar: () => FIG.plot([{ f: (x) => x * x - 1 }, { f: (x) => -x * x + 2 * x + 3, cls: "f-line" }], [[-1, 0, ""], [2, 3, ""]], { numbers: true, xr: [-3, 4], yr: [-2, 6], squash: 0.6 }),
modaff: () => FIG.plot([{ f: (n) => n }, { f: (n) => 4 + 0.6 * n, cls: "f-line" }], [[10, 10, "10 entrées"]], { numbers: false, ticks: false, xr: [0, 15], yr: [0, 15], squash: 0.6 }),
bicarre: () => FIG.plot([{ f: (x) => x ** 4 - 5 * x * x + 4 }], [[-2, 0, ""], [-1, 0, ""], [1, 0, ""], [2, 0, ""]], { numbers: true, xr: [-3, 3], yr: [-3, 6], squash: 0.6 }),
trinfact: () => FIG.plot([{ f: (x) => x * x - 5 * x + 6 }], [[2, 0, "2"], [3, 0, "3"]], { numbers: false, xr: [-1, 6], yr: [-1, 6], squash: 0.6 }),
valint: () => FIG.plot([{ f: (x) => (Math.abs(x - 4) > 0.03 ? 5 / (x - 4) : NaN) }], [], { numbers: true, xr: [-2, 10], yr: [-6, 6], vlines: [4], squash: 0.6 }),
modexp: () => FIG.plot([{ f: (t) => 2 ** (t / 3) }], [[3, 2, ""], [6, 4, ""], [9, 8, ""]], { numbers: true, xr: [-1, 10], yr: [-1, 9], squash: 0.6 }),
bijection: () => FIG.plot([{ f: (x) => (x - 3) ** 2 + 1, from: 3 }, { f: (x) => (x - 3) ** 2 + 1, to: 3, dash: true, cls: "f-line" }], [[3, 1, "(3 ; 1)"]], { numbers: true, xr: [-1, 7], yr: [-1, 8], squash: 0.6 }),
homogrec: () => FIG.plot([{ f: (x) => (Math.abs(x - 3) > 0.02 ? (2 * x + 1) / (x - 3) : NaN) }, { f: (x) => (Math.abs(x - 2) > 0.02 ? (3 * x + 1) / (x - 2) : NaN), cls: "f-line" }, { f: (x) => x, dash: true, cls: "f-line" }], [], { numbers: true, step: 2, xr: [-6, 10], yr: [-6, 10], squash: 0.6 }),
trigassoc: () => GF.assoc(40, 140, "α", "180° − α"),
trigeq2: () => FIG.plot([{ f: (x) => Math.sin((2 * x * 10 * Math.PI) / 180) }], [[1.5, 0.5, "15°"], [7.5, 0.5, "75°"]], { numbers: false, ticks: false, xr: [-1, 19], yr: [-1.4, 1.4], hlines: [0.5], squash: 2.5 }),
logbase: () => FIG.plot([{ f: (x) => (x > 0 ? Math.log(x) / Math.log(2) : NaN) }, { f: (x) => (x > 0 ? Math.log(x) / Math.log(4) : NaN), cls: "f-line" }], [[8, 3, ""], [8, 1.5, ""]], { numbers: true, xr: [-1, 9], yr: [-3, 4], squash: 0.6 }),
polyexpr: () => FIG.plot([{ f: (x) => 2 * (x + 1) * (x - 1) * (x - 2) }], [[-1, 0, ""], [1, 0, ""], [2, 0, ""], [0, 4, "4"]], { numbers: true, xr: [-2, 3], yr: [-4, 6], squash: 0.6 }),
statfreq: () => FIG.sector("", 90, "90°"),
quartiles: () => {
const g = GEO().add([0, -1], [10, 1]).seg([0, 0], [2.5, 0]).seg([7, 0], [10, 0]).poly([[2.5, -0.6], [7, -0.6], [7, 0.6], [2.5, 0.6]], "f-shape").seg([4.5, -0.6], [4.5, 0.6], { cls: "f-accent", w: 2 }).seg([0, -0.4], [0, 0.4]).seg([10, -0.4], [10, 0.4]);
[[0, "min"], [2.5, "Q₁"], [4.5, "médiane"], [7, "Q₃"], [10, "max"]].forEach(([x, t]) => g.text([x, -0.6], t, 0, 18));
return g.svg("boîte à moustaches");
},
ensembles: () => FIG.numberLine(-3, [8]),
vabs: () => FIG.numberLine(-7, [7]),
volcone: () => FIG.cone("r", "h"),
thales: () => GF.thales(0.45, {}),
thalesrec: () => GF.thales(0.45, {}),

angles: () => {
const P = (deg) => [3 * Math.cos((deg * Math.PI) / 180), 3 * Math.sin((deg * Math.PI) / 180)];
const f1 = GEO().circle([0, 0], 3, "f-soft").pt("O", 0, 0).dot("O").pt("A", ...P(210)).pt("B", ...P(330)).pt("C", ...P(95))
.seg("O", "A").seg("O", "B").seg("C", "A").seg("C", "B").angle("O", "A", "B", "2α", { r: 18 }).angle("C", "A", "B", "α", { r: 26 }).svg("angle au centre et angle inscrit");
const f2 = GEO().circle([0, 0], 3, "f-soft").pt("O", 0, 0).dot("O").pt("A", -3, 0).pt("B", 3, 0).pt("C", ...P(120))
.seg("A", "B").seg("A", "C").seg("C", "B").right("C", "A", "B").angle("A", "B", "C", "60°", { r: 22 }).angle("B", "C", "A", "?", { r: 26 }).svg("[AB] diamètre : angle droit en C");
return '<div class="figstack">' + f1 + f2 + '</div>';
},
pythrec: () => GF.rightTri(3, 4, { la: "a", lb: "b", lc: "c" }),
airepyr: () => FIG.pyramid("c", "h"),
volcomp: () => GF.profile("cone", 6, 5, 3, { r: "r", h1: "h", h2: "h'" }),
volmanq: () => FIG.cylinder("r", "h"),
probeq2: () => GF.rect(8, 5, { lw: "x + 3", lh: "x" }),
cercthales: () => GF.diam(70, {}),
idrem: () => {
const a = 3, b = 1.6, g = GEO().add([0, 0], [a + b, a + b]);
g.poly([[0, 0], [a, 0], [a, a], [0, a]], "f-shape").poly([[a, 0], [a + b, 0], [a + b, a], [a, a]], "f-fill2").poly([[0, a], [a, a], [a, a + b], [0, a + b]], "f-fill2").poly([[a, a], [a + b, a], [a + b, a + b], [a, a + b]], "f-shape2");
g.text([a / 2, a / 2], "a²", 0, 4).text([a + b / 2, a / 2], "ab", 0, 4).text([a / 2, a + b / 2], "ab", 0, 4).text([a + b / 2, a + b / 2], "b²", 0, 4);
g.side([0, 0], [a, 0], "a").side([a, 0], [a + b, 0], "b");
return g.svg("(a + b)² = a² + 2ab + b²");
},
euclide: () => GF.altitude(4, 9, { lp: "p", lq: "q", lh: "h", la: "a", lb: "b", lc: "c" }),
trigo: () => GF.rightTri(3, 4, { la: "opposé", lb: "adjacent", lc: "hypoténuse", angA: "α" }),
trigexact: () => GF.rightTri(1, Math.sqrt(3), { la: "1", lb: "√3", lc: "2", angA: "30°" }),
exactes: () => GF.isoH(6, 6, { lb: "a", ls: "a", lh: "h" }),
geocomb: () => GF.altitude(1.8, 3.2, { lp: "", lq: "", lh: "h", la: "3", lb: "4", lc: "5" }),
f2: () => FIG.plot([{ f: (x) => x * x - 4 * x + 3 }], [[2, -1, "S"], [1, 0, ""], [3, 0, ""]], { numbers: true, xr: [-1, 5], yr: [-2, 5] , squash: 0.5}),
inter: () => FIG.plot([{ f: (x) => x * x }, { f: (x) => x + 2, cls: "f-line" }], [[2, 4, "(2 ; 4)"], [-1, 1, "(−1 ; 1)"]], { numbers: true, xr: [-3, 4], yr: [-1, 6] , squash: 0.6}),
ineq2: () => FIG.plot([{ f: (x) => (x - 1) * (x - 4) }], [[1, 0, "1"], [4, 0, "4"]], { numbers: false, xr: [-1, 6], yr: [-3, 5] , squash: 0.55}),
racinv: () => FIG.plot([{ f: (x) => (x >= 0 ? Math.sqrt(x) : NaN) }, { f: (x) => (x !== 0 ? 1 / x : NaN), cls: "f-line" }], [], { numbers: true, xr: [-4, 5], yr: [-4, 4] , squash: 0.7}),
homog: () => FIG.plot([{ f: (x) => (Math.abs(x - 3) > 0.02 ? (2 * x + 1) / (x - 3) : NaN) }], [], { numbers: true, step: 2, xr: [-6, 10], yr: [-6, 10], vlines: [3], hlines: [2] , squash: 0.6}),
trigfn: () => FIG.plot([{ f: (x) => 3 * Math.sin(2 * x) }], [], { numbers: true, xr: [-1, 7], yr: [-4, 4] , squash: 0.6}),
expo: () => FIG.plot([{ f: (x) => 2 ** x }], [[3, 8, "(3 ; 8)"]], { numbers: true, step: 2, xr: [-3, 4], yr: [-1, 11], squash: 0.6 }),
trigcercle: () => GF.assoc(30, 150, "30°", "150°"),
sinlaw: () => GF.sas(5, 8, 60, { la: "a", lb: "b", lc: "c", lg: "γ" }),
triaire: () => GF.sas(6, 8, 30, { la: "a", lb: "b", lg: "γ" }),
cart: () => FIG.plot([], [[1, 2, "A"], [4, 6, "B"], [2.5, 4, "M"]], { numbers: true, xr: [-1, 6], yr: [-1, 7] , squash: 0.55}),
droites: () => FIG.plot([{ f: (x) => 2 * x + 1 }], [[0, 1, "A"], [2, 5, "B"]], { numbers: true, xr: [-2, 4], yr: [-2, 7] , squash: 0.4}),
cercle: () => FIG.plot([], [[1, -2, "(1 ; −2)"]], { numbers: true, xr: [-3, 5], yr: [-6, 2], circles: [[1, -2, 3]], segs: [[1, -2, 4, -2, "f-accent"]], label: "cercle de centre (1 ; −2) et de rayon 3" }),
droitesrem: () => FIG.triLines("medianes", {}),
sys2: () => FIG.plot([{ f: (x) => 7 - x }, { f: (x) => x - 1, cls: "f-line" }], [[4, 3, "(4 ; 3)"]], { numbers: true, step: 2, xr: [-2, 8], yr: [-2, 8] , squash: 0.6}),
};


Object.assign(LESSONS_V2, {
ineq1: ["Inéquations du premier degré", "Une inéquation compare deux expressions avec <, >, ≤ ou ≥ : ses solutions forment en général un intervalle.",
"On la résout comme une équation : on ajoute ou on soustrait le même nombre des deux côtés. On peut multiplier ou diviser par un nombre positif sans rien changer. Si on multiplie ou divise par un nombre négatif, on change le sens de l'inégalité.",
["\\(3x - 4 \\ge 5 \\iff 3x \\ge 9 \\iff x \\ge 3\\) : \\(S = [3 \\,;\\, +\\infty[\\).",
"\\(-2x + 1 > 7 \\iff -2x > 6 \\iff x < -3\\) (division par \\(-2\\) : le sens change) : \\(S = ]-\\infty \\,;\\, -3[\\)."],
"Le crochet est tourné vers l'intérieur si la borne est comprise (≤, ≥), vers l'extérieur si elle est exclue (<, >). Du côté de l'infini, il est toujours ouvert."],
proba2: ["Probabilités : contraire, deux épreuves, réunion", "Trois outils pour calculer une probabilité sans tout énumérer.",
"Évènement contraire : \\(P(\\bar{A}) = 1 - P(A)\\). Deux épreuves successives : on dessine un arbre ; le long d'une branche on multiplie, et on additionne les branches qui conviennent. « A ou B » : \\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\).",
["Probabilité de pluie \\(0{,}3\\) : probabilité qu'il ne pleuve pas \\(1 - 0{,}3 = 0{,}7\\).",
"Urne de 3 rouges et 2 blanches, deux tirages sans remise : \\(P(\\text{deux rouges}) = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{3}{10}\\).",
"Jeu de 32 cartes : \\(P(\\text{cœur ou roi}) = \\frac{8}{32} + \\frac{4}{32} - \\frac{1}{32} = \\frac{11}{32}\\)."],
"Le roi de cœur est à la fois un cœur et un roi : sans le « − P(A ∩ B) », on le compterait deux fois."],
tabsignes: ["Tableau de signes", "Pour savoir quand un produit ou un quotient est positif, on étudie le signe de chaque facteur.",
"\\(ax + b\\) s'annule en \\(x = -\\frac{b}{a}\\) ; à droite de ce zéro, il a le signe de \\(a\\), à gauche le signe contraire. Dans le tableau : une ligne pour les valeurs de \\(x\\) (zéros rangés dans l'ordre), une ligne par facteur, puis la règle des signes. Une valeur qui annule un dénominateur est interdite : double barre, toujours exclue.",
["\\((x - 1)(x + 3) < 0\\) : zéros \\(-3\\) et \\(1\\) ; le produit est négatif entre eux, \\(S = ]-3 \\,;\\, 1[\\).",
"\\(\\frac{x - 2}{x + 1} \\ge 0\\) : \\(S = ]-\\infty \\,;\\, -1[ \\cup [2 \\,;\\, +\\infty[\\) (\\(-1\\) est interdite)."],
"Ne divise pas les deux membres par une expression en \\(x\\) : son signe change selon \\(x\\). On ramène tout à « … ≥ 0 » et on fait le tableau."],
tauxevol: ["Évolutions en pourcentage", "Une évolution en pourcentage revient toujours à une multiplication.",
"Augmenter de \\(t\\,\\%\\), c'est multiplier par \\(1 + \\frac{t}{100}\\) ; diminuer de \\(t\\,\\%\\), c'est multiplier par \\(1 - \\frac{t}{100}\\) : c'est le coefficient multiplicateur. Taux d'évolution : \\(\\frac{V_A - V_D}{V_D}\\). Évolutions successives : on multiplie les coefficients. Taux réciproque : on prend l'inverse du coefficient.",
["\\(+20\\,\\%\\) puis \\(-10\\,\\%\\) : \\(1{,}2 \\times 0{,}9 = 1{,}08\\), soit \\(+8\\,\\%\\) (et non \\(+10\\,\\%\\)).",
"Après une hausse de \\(25\\,\\%\\) (coefficient \\(1{,}25\\)), le coefficient réciproque est \\(\\frac{1}{1{,}25} = 0{,}8\\) : il faut baisser de \\(20\\,\\%\\) pour revenir au départ."],
"Les pourcentages successifs ne s'additionnent pas, car le second porte sur une valeur déjà modifiée."],
vect3e: ["Vecteurs et coordonnées", "Un vecteur est un déplacement : une direction, un sens et une longueur.",
"Dans un repère, \\(\\overrightarrow{AB}\\) a pour coordonnées \\(\\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix}\\). On additionne deux vecteurs coordonnée par coordonnée ; relation de Chasles : \\(\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}\\). \\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires si et seulement si \\(\\det(\\vec{u}, \\vec{v}) = x_u y_v - y_u x_v = 0\\).",
["\\(A(1 \\,;\\, 2)\\), \\(B(4 \\,;\\, -1)\\) : \\(\\overrightarrow{AB}\\begin{pmatrix} 3 \\\\ -3 \\end{pmatrix}\\).",
"\\(ABCD\\) est un parallélogramme si et seulement si \\(\\overrightarrow{AD} = \\overrightarrow{BC}\\).",
"\\(\\det\\left(\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}, \\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}\\right) = 2 \\times 6 - 3 \\times 4 = 0\\) : colinéaires."],
"\\(\\overrightarrow{AB}\\), c'est « arrivée moins départ » : \\(B - A\\), pas \\(A - B\\)."],
fref: ["Fonctions de référence", "Carré, inverse, racine carrée : connaître leur courbe permet de comparer et de résoudre sans calculer.",
"Carré : décroissante sur \\(]-\\infty \\,;\\, 0]\\), croissante sur \\([0 \\,;\\, +\\infty[\\) ; \\(x^2 = k\\) a deux solutions \\(\\pm\\sqrt{k}\\) si \\(k > 0\\). Inverse : décroissante sur \\(]-\\infty \\,;\\, 0[\\) et sur \\(]0 \\,;\\, +\\infty[\\). Racine carrée : définie et croissante sur \\([0 \\,;\\, +\\infty[\\). Une fonction croissante conserve l'ordre ; une fonction décroissante l'inverse.",
["\\(x^2 \\le 9 \\iff -3 \\le x \\le 3\\), et \\(x^2 > 9 \\iff x < -3\\) ou \\(x > 3\\).",
"\\(2 \\le x \\le 5 \\Rightarrow \\frac{1}{5} \\le \\frac{1}{x} \\le \\frac{1}{2}\\) (l'ordre s'inverse).",
"\\(-3 < -2\\), mais \\((-3)^2 > (-2)^2\\) : sur les négatifs, le carré inverse l'ordre."],
"Si \\(-2 \\le x \\le 3\\), alors \\(0 \\le x^2 \\le 9\\) (et non \\(4 \\le x^2 \\le 9\\)) : l'intervalle contient 0."],
probcond: ["Probabilités conditionnelles", "« Sachant A » : on ne regarde plus que les cas où A est réalisé.",
"\\(P_A(B) = \\frac{P(A \\cap B)}{P(A)}\\). Dans un tableau croisé, on se place dans la ligne (ou la colonne) de A et on divise par son total. Dans un arbre pondéré, les branches du second niveau portent des probabilités conditionnelles ; le long d'un chemin on multiplie, \\(P(A \\cap B) = P(A) \\times P_A(B)\\), et on additionne les chemins qui mènent au même évènement.",
["Tableau : 40 filles dont 12 externes. \\(P_F(E) = \\frac{12}{40} = 0{,}3\\).",
"Arbre : \\(P(A) = 0{,}6\\), \\(P_A(B) = 0{,}5\\), \\(P_{\\bar{A}}(B) = 0{,}25\\) : \\(P(B) = 0{,}6 \\times 0{,}5 + 0{,}4 \\times 0{,}25 = 0{,}4\\)."],
"\\(P_A(B)\\) et \\(P_B(A)\\) sont différentes : un test positif chez 95 % des malades ne veut pas dire 95 % de malades parmi les tests positifs (faux positifs)."],
algopy: ["Lire un programme Python", "Pour savoir ce qu'affiche un programme, on l'exécute à la main, ligne par ligne.",
"On note la valeur de chaque variable après chaque ligne. Une affectation \\(\\texttt{a = b - a}\\) calcule d'abord à droite avec les anciennes valeurs. \\(\\texttt{if} \\dots \\texttt{elif} \\dots \\texttt{else}\\) : seule la première condition vraie est exécutée. \\(\\texttt{range(a, b)}\\) va de \\(a\\) à \\(b - 1\\) ; \\(\\texttt{while}\\) répète tant que la condition est vraie.",
["\\(\\texttt{s = 0}\\), puis \\(\\texttt{for i in range(1, 4): s = s + i}\\) : \\(s\\) vaut \\(1 + 2 + 3 = 6\\).",
"\\(\\texttt{x**2}\\) est \\(x^2\\) ; \\(\\texttt{n \\% 2}\\) est le reste de la division par 2 ; \\(\\texttt{n // 2}\\) est le quotient entier."],
"\\(\\texttt{range(5)}\\) fait 5 tours (0, 1, 2, 3, 4) : la borne 5 n'est jamais atteinte."],
});
LESSON_FIGS_V2.vect3e = () => (typeof FR2NDE_FIG !== "undefined" ? FR2NDE_FIG.vecGrid([[1, 1, 3, 2, "u"], [4, 3, 2, -2, "v"], [1, 1, 5, 0, "u + v"]], [], [0, 7], [0, 4]) : "");
LESSON_FIGS_V2.probcond = () => (typeof FR2NDE_FIG !== "undefined" ? FR2NDE_FIG.treeFig(["A", "B"], [0.6, 0.5, 0.25]) : "");
LESSON_FIGS_V2.tabsignes = () => (typeof FR2NDE_FIG !== "undefined" ? FR2NDE_FIG.signTable([["x − 1", 1], ["x + 3", -3]], "produit", [["−", "−", "+"], ["−", "+", "+"], ["+", "−", "+"]]) : "");
for (const [id, v] of Object.entries(LESSONS_V2)) LESSONS[id] = L_(...v);



LESSON_FIGS_V2.prio = () => {
const rows = [["20 − 2 · ", "3²", ""], ["20 − ", "2 · 9", ""], ["", "20 − 18", ""], ["", "2", ""]], ops = ["1. la puissance : 3² = 9", "2. la multiplication : 2 · 9 = 18", "3. la soustraction : 20 − 18 = 2"];
let g = "", y = 24;
rows.forEach((r, i) => {
const last = i === rows.length - 1;
g += '<text x="150" y="' + y + '" class="f-txt" text-anchor="middle" font-size="17">' + (i ? "= " : "") + r[0] + '<tspan style="fill:' + (last ? "var(--ok)" : "var(--margin)") + '" font-weight="700">' + r[1] + "</tspan>" + r[2] + "</text>";
if (!last) { g += '<path d="M150,' + (y + 7) + " L150," + (y + 25) + '" class="f-line" stroke-width="1.4"/><path d="M146,' + (y + 20) + " L150," + (y + 26) + " L154," + (y + 20) + '" class="f-line" fill="none" stroke-width="1.4"/>';
g += '<text x="160" y="' + (y + 21) + '" class="f-txt" font-size="11.5">' + ops[i] + "</text>"; }
y += 46;
});
return '<svg class="fig" viewBox="0 0 330 ' + (y - 18) + '" role="img" aria-label="calcul de 20 − 2 · 3² étape par étape">' + g + "</svg>";
};
LESSON_FIGS_V2.multdiv = () => {
const d = [1, 2, 3, 4, 6, 12], X = (i) => 30 + i * 52, pairs = [[0, 5], [1, 4], [2, 3]];
let g = "";
d.forEach((v, i) => (g += '<text x="' + X(i) + '" y="26" class="f-txt" text-anchor="middle" font-size="18" font-weight="700">' + v + "</text>"));
pairs.forEach(([a, b], k) => {
const yb = 40 + (2 - k) * 22, xa = X(a), xb = X(b);
g += '<path d="M' + xa + ",34 L" + xa + "," + yb + " L" + xb + "," + yb + " L" + xb + ',34" fill="none" class="f-accent" stroke="currentColor" stroke-width="1.6"/>';
g += '<text x="' + (xa + xb) / 2 + '" y="' + (yb + 14) + '" class="f-accent f-txt" text-anchor="middle" font-size="12">' + d[a] + " · " + d[b] + " = 12</text>";
});
return '<svg class="fig" viewBox="0 0 320 124" role="img" aria-label="diviseurs de 12 reliés par paires">' + g + "</svg>";
};
if (typeof LESSON_FIGS !== "undefined") Object.assign(LESSON_FIGS, LESSON_FIGS_V2);



const DYN = {

optim: {
min: 0.5, max: 9.5, step: 0.5, start: 2,
label: (x) => "largeur " + decTxt(x) + " cm · longueur " + decTxt(10 - x) + " cm · périmètre 20 cm",
render(x) {
const L = 10 - x, A = x * L, s = 11, ox = 12, oy = 14;
const W = 330, H = 172, gx = (t) => 168 + t * 13.5, gy = (a) => 152 - a * 4.8;
let g = '<rect x="' + ox + '" y="' + oy + '" width="' + (x * s).toFixed(1) + '" height="' + (L * s).toFixed(1) + '" class="f-shape"/>';
g += '<text x="' + (ox + (x * s) / 2).toFixed(1) + '" y="' + (oy + L * s + 14).toFixed(1) + '" class="f-txt" text-anchor="middle" font-size="12">' + decTxt(x) + "</text>";
g += '<text x="' + (ox + x * s + 5).toFixed(1) + '" y="' + (oy + (L * s) / 2 + 4).toFixed(1) + '" class="f-txt" font-size="12">' + decTxt(L) + "</text>";

let d = "";
for (let t = 0; t <= 10.001; t += 0.25) d += (d ? " L" : "M") + gx(t).toFixed(1) + "," + gy(t * (10 - t)).toFixed(1);
g += '<line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(10.6) + '" y2="' + gy(0) + '" class="f-line"/><line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(0) + '" y2="' + gy(27) + '" class="f-line"/>';
g += '<text x="' + gx(10.6) + '" y="' + (gy(0) + 14) + '" class="f-txt" text-anchor="end" font-size="11">largeur</text><text x="' + (gx(0) + 4) + '" y="' + gy(26.5) + '" class="f-txt" font-size="11">aire</text>';
g += '<path d="' + d + '" class="f-line" fill="none" stroke-dasharray="4 3"/>';
g += '<line x1="' + gx(5) + '" y1="' + gy(0) + '" x2="' + gx(5) + '" y2="' + gy(25) + '" class="f-grid"/><text x="' + gx(5) + '" y="' + (gy(0) + 14) + '" class="f-txt" text-anchor="middle" font-size="11">5</text>';
g += '<line x1="' + gx(x) + '" y1="' + gy(0) + '" x2="' + gx(x) + '" y2="' + gy(A) + '" class="f-accent" stroke-width="1.5"/>';
g += '<circle cx="' + gx(x) + '" cy="' + gy(A) + '" r="5" class="f-dot"/>';
const anc = x > 6 ? "end" : x >= 4 ? "middle" : "start", dx = x > 6 ? -8 : x >= 4 ? 0 : 8;
g += '<text x="' + (gx(x) + dx) + '" y="' + (gy(A) - 9) + '" class="f-accent f-txt" text-anchor="' + anc + '" font-size="13">aire ' + decTxt(A) + (x === 5 ? " (max)" : "") + "</text>";
return '<svg class="fig" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="rectangle de périmètre 20 et son aire">' + g + "</svg>";
},
},
};
function dynHtml(id) {
const D = DYN[id];
return `<div class="dyn" data-dyn="${id}"><div class="dyn-fig">${D.render(D.start)}</div>
  <label class="dyn-ctl"><input type="range" min="${D.min}" max="${D.max}" step="${D.step}" value="${D.start}" aria-label="faire varier la figure"><span class="small muted">${D.label(D.start)} · fais glisser</span></label></div>`;
}
function bindDyn(root) {
root.querySelectorAll(".dyn[data-dyn]").forEach((box) => {
const D = DYN[box.dataset.dyn], inp = box.querySelector("input"), fig = box.querySelector(".dyn-fig"), lab = box.querySelector(".dyn-ctl span");
if (!D || !inp || inp.dataset.bound) return;
inp.dataset.bound = 1;
inp.oninput = () => { const x = +inp.value; fig.innerHTML = D.render(x); lab.textContent = D.label(x) + (x === 5 && box.dataset.dyn === "optim" ? " · c'est le carré !" : ""); };
});
}
if (typeof LESSON_FIGS !== "undefined") LESSON_FIGS.optim = () => dynHtml("optim");








const MANIP = (() => {
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const snap = (v, s, lo = -Infinity, hi = Infinity) => clamp(+(Math.round(v / s) * s).toFixed(6), lo, hi);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");

const toSvg = (svg, e) => { const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(m.inverse()); return { x: q.x, y: q.y }; };



const bindDrag = (el, svg, h) => {
let down = null, moved = false, pid = null;
el.style.touchAction = "none";
el.addEventListener("touchstart", (e) => { if (!h.ok || h.ok()) e.preventDefault(); }, { passive: false });
el.addEventListener("pointerdown", (e) => {
if (e.button > 0 || (h.ok && !h.ok())) return;
down = { x: e.clientX, y: e.clientY, touch: e.pointerType === "touch" }; moved = false; pid = e.pointerId;
try { el.setPointerCapture(pid); } catch (_) {}
if (h.start) h.start(toSvg(svg, e)); e.preventDefault();
});
el.addEventListener("pointermove", (e) => {
if (!down || e.pointerId !== pid) return;
if (!moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > (down.touch ? 6 : 4)) moved = true;
if (moved && h.move) h.move(toSvg(svg, e));
});
el.addEventListener("pointerup", (e) => { if (!down || e.pointerId !== pid) return; down = null; const p = toSvg(svg, e); if (moved) { if (h.end) h.end(p); } else if (h.tap) h.tap(p); });
el.addEventListener("pointercancel", () => { if (!down) return; down = null; if (h.cancel) h.cancel(); });
};


const C = {

grid: (sx, sy, x0, x1, y0, y1) => (p) => ({ x: snap(p.x, sx, x0, x1), y: snap(p.y, sy, y0, y1) }),

segment: (A, B, n) => (p) => { const dx = B.x - A.x, dy = B.y - A.y, L = dx * dx + dy * dy || 1; let t = clamp(((p.x - A.x) * dx + (p.y - A.y) * dy) / L, 0, 1); if (n) t = Math.round(t * n) / n; return { x: A.x + t * dx, y: A.y + t * dy, t }; },

circle: (O, r, pas, a0 = -Infinity, a1 = Infinity) => (p) => { let a = (Math.atan2(O.y - p.y, p.x - O.x) * 180) / Math.PI; if (pas) a = Math.round(a / pas) * pas; a = clamp(a, a0, a1); const t = (a * Math.PI) / 180; return { x: O.x + r * Math.cos(t), y: O.y - r * Math.sin(t), a }; },

values: (vals) => (v) => vals.reduce((b, x) => (Math.abs(x - v) < Math.abs(b - v) ? x : b), vals[0]),
};

const zoneAt = (zones, p, m = 8) => zones.findIndex((z) => z && p.x >= z.x - m && p.x <= z.x + z.w + m && p.y >= z.y - m && p.y <= z.y + z.h + m);

const parse = (s) => { const t = String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, ""); const m = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/); return t === "" ? NaN : m ? +m[1] / +m[2] : Number(t); };


const sim = (box, k, sx, sy) => {
const svg = box.querySelector("svg.manip2"), g = svg.querySelector('.mh[data-k="' + k + '"]'); if (!g) throw new Error("poignée " + k + " absente");
const m = svg.getScreenCTM(), P = (x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; };
const t = g.transform.baseVal.consolidate(), hx = t ? t.matrix.e : 0, hy = t ? t.matrix.f : 0, [x0, y0] = P(hx, hy), [x1, y1] = P(sx, sy);
const ev = (type, x, y) => g.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, pointerType: "mouse" }));
ev("pointerdown", x0, y0); for (let i = 1; i <= 4; i++) ev("pointermove", x0 + ((x1 - x0) * i) / 4, y0 + ((y1 - y0) * i) / 4); ev("pointerup", x1, y1);
};
const simTap = (box, k) => { const g = box.querySelector('svg.manip2 .mh[data-k="' + k + '"]'); const r = g.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
const ev = (type) => g.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, pointerType: "mouse" })); ev("pointerdown"); ev("pointerup"); };
const simKey = (box, k, key) => box.querySelector('svg.manip2 .mh[data-k="' + k + '"]').dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

return { clamp, snap, esc, nb, toSvg, bindDrag, C, zoneAt, parse, sim, simTap, simKey };
})();











function manipLesson(o) {
const M = MANIP, dim = (v, s) => (typeof v === "function" ? v(s) : v);
return (box, onWin) => {
let step = 0, st = o.init(0, null), asking = false, drag = null, hs = [], gs = [], focusK = -1;
box.innerHTML = `<svg class="fig manip2" style="touch-action:pan-y;user-select:none;-webkit-user-select:none" role="group" aria-label="${M.esc(o.aria || "figure à manipuler")}"><g class="m-dyn"></g><g class="m-hdl"></g></svg>
      <div class="manip-hint small" aria-live="polite"></div><div class="act-out manip-out" aria-live="polite"></div><div class="manip-btns"></div><div class="manip-ask"></div><div class="small muted manip-note"></div>`;
const svg = box.querySelector("svg"), dyn = svg.querySelector(".m-dyn"), hdl = svg.querySelector(".m-hdl"), out = box.querySelector(".manip-out"),
hintEl = box.querySelector(".manip-hint"), btns = box.querySelector(".manip-btns"), askBox = box.querySelector(".manip-ask"), noteEl = box.querySelector(".manip-note");
const setHint = (t) => { hintEl.textContent = t || ""; };
const inner = (h) => (h.svg != null ? h.svg : `<circle r="${h.r || 9}" fill="${h.color || "var(--blue)"}" stroke="var(--paper)" stroke-width="2.5"/>${h.text ? `<text y="-15" text-anchor="middle" class="f-txt" font-size="13" font-weight="700">${M.esc(h.text)}</text>` : ""}`);
const hit = (h) => (h.hit ? `<rect class="mh-hit" x="${h.hit.x}" y="${h.hit.y}" width="${h.hit.w}" height="${h.hit.h}" rx="6" fill="transparent"/>` : `<circle class="mh-hit" r="${h.R || 24}" fill="transparent"/>`);
const build = () => {
hs = o.handles(st, step);
hdl.innerHTML = hs.map((h, k) => `<g class="mh${h.sel ? " mh-sel" : ""}" data-k="${k}" tabindex="0" role="${h.role || "button"}" aria-label="${M.esc(h.label || "objet à déplacer")}" transform="translate(${h.x} ${h.y})"${h.off ? ' style="display:none"' : ""}>${hit(h)}<g class="mh-c">${inner(h)}</g></g>`).join("");
gs = [...hdl.querySelectorAll(".mh")];
gs.forEach((g, k) => {
g.__c = inner(hs[k]);
M.bindDrag(g, svg, {
ok: () => !asking,
start: (p) => { const h = hs[k]; drag = { k, dx: p.x - h.x, dy: p.y - h.y, last: { x: h.x, y: h.y } }; g.classList.add("mh-on"); if (o.grab) o.grab(st, k, step); refresh(); },
move: (p) => { if (!drag) return; const q = { x: p.x - drag.dx, y: p.y - drag.dy }; drag.last = q; if (o.move) o.move(st, k, q, step); refresh(); },
end: (p) => { if (!drag) return; const q = { x: p.x - drag.dx, y: p.y - drag.dy }; drag = null; g.classList.remove("mh-on"); if (o.drop) o.drop(st, k, q, step); after(k); },
tap: () => { drag = null; g.classList.remove("mh-on"); if (o.tap) o.tap(st, k, step); after(k); },
cancel: () => { if (!drag) return; const q = drag.last; drag = null; g.classList.remove("mh-on"); if (o.drop) o.drop(st, k, q, step); after(k); },
});
g.addEventListener("keydown", (e) => {
if (asking) return;
const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
if (d && o.nudge) { o.nudge(st, k, d[0], d[1], step); e.preventDefault(); after(k); }
else if ((e.key === "Enter" || e.key === " ") && o.tap) { o.tap(st, k, step); e.preventDefault(); after(k); }
});
g.addEventListener("focus", () => (focusK = k));
});
};

const after = (k) => { focusK = k; refresh(true); check(); };
const refresh = (rebuild) => {
dyn.innerHTML = o.draw(st, step);
out.innerHTML = o.out ? o.out(st, step) : "";
const n = o.handles(st, step);
if (rebuild && !drag && (n.length !== hs.length || n.some((h, k) => !!h.sel !== !!hs[k].sel))) { const f = document.activeElement && document.activeElement.closest && document.activeElement.closest(".mh"); build(); if (f && gs[focusK]) gs[focusK].focus(); }
else {
n.forEach((h, k) => { const g = gs[k]; if (!g) return; g.setAttribute("transform", `translate(${h.x} ${h.y})`); const c = inner(h); if (c !== g.__c) { g.querySelector(".mh-c").innerHTML = c; g.__c = c; } g.style.display = h.off ? "none" : ""; if (h.label) g.setAttribute("aria-label", h.label); });
hs = n;
}
if (o.buttons) { const b = o.buttons(st, step); if (b !== btns.__b) { btns.innerHTML = b; btns.__b = b; btns.querySelectorAll("[data-b]").forEach((el) => (el.onclick = () => { if (asking) return; o.button(st, el.dataset.b, step); refresh(true); check(); })); } }
const nt = typeof o.note === "function" ? o.note(st, step) : o.note; if (nt !== noteEl.__t) { noteEl.innerHTML = nt || ""; noteEl.__t = nt; }
};
const setup = () => { svg.setAttribute("viewBox", `0 0 ${dim(o.W, step)} ${dim(o.H, step)}`); build(); refresh(); setHint(""); };
const win = (m) => { onWin(step, m); step++; asking = false; askBox.innerHTML = ""; if (step < o.goal.length) { st = o.init(step, st); setup(); } else svg.classList.add("manip-fin"); };
const check = () => {
if (asking || step >= o.goal.length) return;
const m = o.goal[step](st);
if (!m) { setHint(o.hint ? o.hint(st, step) : ""); return; }
setHint("");
const A = o.ask && o.ask[step];
if (!A) { win(m); return; }
asking = true;
askBox.innerHTML = `<div class="act-out manip-ok"><b>✓ ${m}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
const inp = askBox.querySelector("input"), go = () => { const v = M.parse(inp.value);
if (!isFinite(v)) { setHint("Tape un nombre."); return; }
if (Math.abs(v - A.ans) < 1e-9) win(A.ok); else setHint(A.no || "Pas encore : reprends le raisonnement de la figure."); };
actAnswerBind(askBox, go);
setTimeout(() => askBox.scrollIntoView && askBox.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
};

svg.addEventListener("click", (e) => { if (asking || !o.click || (e.target.closest && e.target.closest(".mh"))) return; o.click(st, M.toSvg(svg, e), step); refresh(true); check(); });
setup();

box.__manip = { get st() { return st; }, get step() { return step; }, get asking() { return asking; }, handles: () => hs, set(fn) { fn(st, step); refresh(true); check(); } };
};
}





function actAnswerHtml(label) {
const fine = window.matchMedia("(pointer: fine)").matches;
return `<div class="answer gans act-ans">${label ? `<div class="small muted">${label}</div>` : ""}<input class="ans gin act-in" inputmode="${fine ? "text" : "none"}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse…" aria-label="Ta réponse">
    <div class="preview gprev"></div>${keypadHtml({ kind: "value", value: 1, final: true }).replace(' id="kp"', "")}<div class="actions"><button type="button" class="btn-primary" data-go>Vérifier</button></div></div>`;
}
function actAnswerBind(box, go) {
const el = box.querySelector(".act-ans"); if (!el) return;
const inp = el.querySelector("input"), prev = el.querySelector(".gprev"), sp = { kind: "value", value: 1, final: true }, show = () => previewOf(inp, prev, sp);
let mode = inp.getAttribute("inputmode");
inp.oninput = show; inp.onkeydown = (e) => { if (e.key === "Enter") go(); };
el.querySelectorAll(".keypad button").forEach((b) => (b.onclick = () => { const k = b.dataset.k; if (k === "⌨") { mode = mode === "none" ? "text" : "none"; inp.setAttribute("inputmode", mode); inp.blur(); inp.focus(); return; } typeKey(inp, k); show(); }));
el.querySelector("[data-go]").onclick = go;
}
function predOrder(n) { const o = [...Array(n).keys()]; if (n < 3) return o; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; }







const ACTIVE = {
fractout: {

retiens: { regle: "Pour calculer les \\(\\frac{a}{b}\\) de \\(n\\), on divise \\(n\\) par \\(b\\) (une part), puis on multiplie par \\(a\\). En une ligne, cela donne \\(n \\div b \\cdot a\\).", exemple: ["Les \\(\\frac{3}{4}\\) de \\(20\\) valent \\(20 \\div 4 \\cdot 3 = 15\\).", "Les \\(\\frac{2}{3}\\) de 24 valent \\(24 \\div 3 \\cdot 2 = 16\\).", "Les \\(\\frac{3}{4}\\) de 24 valent 18."], piege: "Divise d'abord par le dénominateur (une part), puis multiplie par le numérateur." },
predict: { q: "Les trois quarts de 20, ça fait combien ?", choices: ["5", "15", "23"], good: 1,
why: "On partage 20 en 4 parts égales de 5, et on en prend 3 : 15." },
defis: ["Colorie les 2/3 de 24.", "Trouve une fraction de 24 qui vaut 18."],
play(box, onWin) {
const n = 24, Bs = [2, 3, 4, 6, 8];
let b = 4, sel = new Set(), step = 0;
const draw = () => {
const W = 320, x0 = 10, w = 300, cw = w / b, part = n / b, a = sel.size;
let g = '<path d="M' + x0 + ",34 q0,-8 8,-8 L" + (x0 + w / 2 - 8) + ",26 q8,0 8,-8 q0,8 8,8 L" + (x0 + w - 8) + ",26 q8,0 8,8" + '" class="f-line" fill="none" stroke-width="1.6"/>';
g += '<text x="' + (x0 + w / 2) + '" y="12" class="f-txt" text-anchor="middle" font-size="14">24</text>';
for (let k = 0; k < b; k++) {
const on = sel.has(k);
g += '<g class="act-part" data-k="' + k + '" style="cursor:pointer"><rect x="' + (x0 + k * cw) + '" y="40" width="' + cw + '" height="44" class="' + (on ? "f-fill" : "f-soft") + '" stroke="var(--ink)" stroke-width="1.5"/>';
g += '<text x="' + (x0 + k * cw + cw / 2) + '" y="67" class="' + (on ? "f-on" : "f-txt") + '" text-anchor="middle" font-size="14">' + part + "</text></g>";
}
box.innerHTML = `<div class="small muted">Découpe 24 en</div>
          <div class="seg act-b">${Bs.map((v) => `<button type="button" data-b="${v}" aria-pressed="${v === b}">${v} parts</button>`).join("")}</div>
          <svg class="fig" viewBox="0 0 ${W} 92" role="img" aria-label="barre de 24 découpée en ${b} parts">${g}</svg>
          <div class="act-out"><b>${a}/${b}</b> de 24 = <b>${a} · ${part} = ${a * part}</b> <span class="small muted">· touche les parts pour les prendre</span></div>`;
box.querySelectorAll(".act-b button").forEach((el) => (el.onclick = () => { b = +el.dataset.b; sel = new Set(); draw(); }));
box.querySelectorAll(".act-part").forEach((el) => (el.onclick = () => { const k = +el.dataset.k; sel.has(k) ? sel.delete(k) : sel.add(k); draw(); check(); }));
};
const check = () => {
const a = sel.size, val = (a * n) / b;
if (step === 0 && a * 3 === 2 * b) { onWin(0, b === 3 ? "Bravo : 3 parts de 8, tu en prends 2, ça fait 16." : "Bravo : " + a + "/" + b + " = 2/3, ça fait bien 16."); step = 1; }
else if (step === 1 && val === 18) { onWin(1, a + "/" + b + " de 24 = 18. " + (b === 4 ? "Avec 8 parts, 6/8 marche aussi !" : "Avec 4 parts, 3/4 marche aussi !")); step = 2; }
};
draw();
},
},

prio: {



retiens: { regle: "D'abord les calculs entre parenthèses. Puis les multiplications et les divisions. Enfin les additions et les soustractions.", exemple: ["\\(2 + 3 \\cdot 4 - 1\\) : d'abord \\(3 \\cdot 4 = 12\\), puis \\(2 + 12 - 1 = 13\\).", "\\((2 + 3) \\cdot 4 - 1 = 20 - 1 = 19\\).", "\\(2 + 3 \\cdot (4 - 1) = 2 + 9 = 11\\)."], piege: "Sans parenthèses, la multiplication passe avant l'addition : \\(2 + 3 \\cdot 4 = 14\\), pas \\(20\\)." },
predict: { q: "Combien fait 2 + 3 · 4 ?", choices: ["20", "14"], good: 1,
why: "La multiplication passe avant l'addition : 3 · 4 = 12, puis 2 + 12 = 14." },
defis: ["Sans parenthèses, 2 + 3 · 4 − 1 vaut 13. Place des parenthèses pour obtenir 19.", "Et maintenant pour obtenir 11."],
play(box, onWin) {
const nums = [2, 3, 4, 1], ops = ["+", "·", "−"];
let open = null, close = null, pend = null, step = 0;
const expr = (js) => nums.map((v, i) => (open === i ? "(" : "") + v + (close === i ? ")" : "") + (i < ops.length ? (js ? { "+": "+", "·": "*", "−": "-" }[ops[i]] : " " + ops[i] + " ") : "")).join("");
const value = () => Function("return " + expr(true))();
const draw = () => {
const toks = nums.map((v, i) => `${open === i ? '<span class="act-par">(</span>' : ""}<button type="button" class="act-num${pend === i ? " on" : ""}" data-i="${i}">${v}</button>${close === i ? '<span class="act-par">)</span>' : ""}${i < ops.length ? `<span class="act-op">${ops[i]}</span>` : ""}`).join("");
const v = value();
box.innerHTML = `<div class="act-expr">${toks}<span class="act-op">=</span><b class="act-val">${v}</b></div>
          <div class="small muted">${pend !== null ? "Touche le nombre où la parenthèse se ferme." : "Touche le nombre où la parenthèse s'ouvre, puis celui où elle se ferme."}</div>
          ${open !== null ? '<button type="button" class="btn-ghost small act-reset">Enlever les parenthèses</button>' : ""}`;
box.querySelectorAll(".act-num").forEach((el) => (el.onclick = () => {
const i = +el.dataset.i;
if (pend === null) { pend = i; open = close = null; }
else if (i === pend) pend = null;
else { open = Math.min(pend, i); close = Math.max(pend, i); pend = null; if (open === 0 && close === nums.length - 1) open = close = null; }
draw(); check();
}));
const r = box.querySelector(".act-reset"); if (r) r.onclick = () => { open = close = pend = null; draw(); };
};
const check = () => {
if (open === null) return;
const v = value();
if (step === 0 && v === 19) { onWin(0, expr(false) + " : la parenthèse se calcule d'abord, 5 · 4 = 20, puis 20 − 1 = 19."); step = 1; }
else if (step === 1 && v === 11) { onWin(1, expr(false) + " : 4 − 1 = 3, puis 3 · 3 = 9, puis 2 + 9 = 11."); step = 2; }
};
draw();
},
},
};



const actStepper = (label, v, id) => `<div class="act-stepper"><span class="small muted">${label}</span><button type="button" data-st="${id}" data-d="-1" aria-label="moins">−</button><b>${v}</b><button type="button" data-st="${id}" data-d="1" aria-label="plus">+</button></div>`;
const actBindStepper = (box, id, get, set, min, max) => box.querySelectorAll('[data-st="' + id + '"]').forEach((b) => (b.onclick = () => set(Math.max(min, Math.min(max, get() + +b.dataset.d)))));

Object.assign(ACTIVE, {
multdiv: {

retiens: { exemple: ["Diviseurs de 12 : 1, 2, 3, 4, 6, 12", "Diviseurs de 18 : 1, 2, 3, 6, 9, 18"] },
predict: { q: "7 est-il un diviseur de 84 ?", choices: ["Oui", "Non"], good: 0, why: "84 = 7 · 12 : la division de 84 par 7 tombe juste, donc 7 divise 84." },
defis: ["Range 12 jetons en rectangle de toutes les façons possibles.", "Même jeu avec 18 jetons : trouve tous ses diviseurs."],
play(box, onWin) {
let n = 12, r = 3, found = new Set(), step = 0;
const draw = () => {
const c = Math.ceil(n / r), full = n % r === 0, sz = Math.min(26, 300 / c, 200 / r), W = 320, H = r * sz + 8;
let g = "";
for (let k = 0; k < n; k++) { const i = Math.floor(k / c), j = k % c; g += '<circle cx="' + (10 + j * sz + sz / 2).toFixed(1) + '" cy="' + (4 + i * sz + sz / 2).toFixed(1) + '" r="' + (sz * 0.38).toFixed(1) + '" class="' + (full ? "f-fill" : i === r - 1 && n % c ? "f-dot" : "f-fill2") + '"/>'; }
const divs = [...found].sort((a, b) => a - b);
box.innerHTML = actStepper("Rangées", r, "r") + `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${n} jetons en ${r} rangées">${g}</svg>
          <div class="act-out">${full ? `<b>${r} rangées de ${n / r}</b> : ${n} = ${r} · ${n / r} ✓` : `${r} rangées : il reste un trou, ${r} ne divise pas ${n}.`}</div>
          <div class="small">Diviseurs de ${n} trouvés : ${divs.length ? divs.map((d) => `<b>${d}</b>`).join(", ") : "aucun pour l'instant"}</div>`;
actBindStepper(box, "r", () => r, (v) => { r = v; if (n % r === 0) found.add(r).add(n / r); draw(); check(); }, 1, n);
};
const check = () => {
const all = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
if (all.every((d) => found.has(d))) {
if (step === 0) { onWin(0, "Les diviseurs de 12 : 1, 2, 3, 4, 6, 12. Ils vont par paires : 1 · 12, 2 · 6, 3 · 4."); step = 1; n = 18; r = 2; found = new Set([2, 9]); draw(); }
else if (step === 1) { onWin(1, "Diviseurs de 18 : 1, 2, 3, 6, 9, 18 (paires 1 · 18, 2 · 9, 3 · 6)."); step = 2; }
}
};
found.add(3).add(4); draw();
},
},

divcrit: {



retiens: { regle: "Par 2 : chiffre des unités pair. Par 5 : 0 ou 5. Par 3 : somme des chiffres divisible par 3. Par 9 : somme divisible par 9.", exemple: ["\\(471\\) : \\(4 + 7 + 1 = 12\\), divisible par 3, pas par 9", "\\(477\\) : \\(4 + 7 + 7 = 18\\), divisible par 9", "Par 2, 3 et 5 : finit par 0, somme des chiffres divisible par 3 (30, 120…)"] },
predict: { q: "471 est-il divisible par 3 ?", choices: ["Oui", "Non"], good: 0, why: "4 + 7 + 1 = 12, et 12 est divisible par 3 : 471 = 3 · 157." },
defis: ["Change un seul chiffre de 472 pour qu'il devienne divisible par 9.", "Fabrique un nombre divisible à la fois par 2, 3 et 5."],
play(box, onWin) {
const start = [4, 7, 2];
let d = start.slice(), step = 0;
const draw = () => {
const n = +d.join(""), s = d.reduce((a, b) => a + b, 0);
const tests = [[2, "dernier chiffre pair"], [3, "somme divisible par 3"], [5, "finit par 0 ou 5"], [9, "somme divisible par 9"], [10, "finit par 0"]];
box.innerHTML = `<div class="act-expr">${d.map((v, i) => `<button type="button" class="act-num" data-i="${i}">${v}</button>`).join("")}</div>
          <div class="small muted" style="text-align:center">Touche un chiffre pour l'augmenter de 1.</div>
          <div class="act-out" style="text-align:center">Somme des chiffres : ${d.join(" + ")} = <b>${s}</b></div>
          <div class="act-lamps">${tests.map(([k, why]) => `<span class="act-lamp${n % k === 0 ? " on" : ""}" title="${why}">÷${k}</span>`).join("")}</div>`;
box.querySelectorAll(".act-num").forEach((b) => (b.onclick = () => { const i = +b.dataset.i; d[i] = (d[i] + 1) % 10; if (i === 0 && d[0] === 0) d[0] = 1; draw(); check(); }));
};
const check = () => {
const n = +d.join(""), diff = d.filter((v, i) => v !== start[i]).length;
if (step === 0) {
if (n % 9 === 0 && diff <= 1) { onWin(0, n + " : somme " + d.reduce((a, b) => a + b, 0) + ", divisible par 9. Remarque : il est aussi divisible par 3 !"); step = 1; }
else if (diff > 1) $hint(box, "Un seul chiffre doit changer : remets les autres comme dans 472.");
} else if (step === 1 && n % 30 === 0) { onWin(1, n + " : il finit par 0 (donc ÷2 et ÷5) et la somme de ses chiffres est divisible par 3."); step = 2; }
};
draw();
},
},

premiers: {
predict: { q: "91 est-il un nombre premier ?", choices: ["Oui", "Non"], good: 1, why: "91 = 7 · 13 : il a d'autres diviseurs que 1 et lui-même." },
defis: ["Casse 84 en nombres premiers.", "À toi : casse 90."],
play(box, onWin) {
const isP = (x) => x > 1 && Array.from({ length: Math.floor(Math.sqrt(x)) - 1 }, (_, i) => i + 2).every((k) => x % k);
let n = 84, leaves = [84], hist = [], pick = null, msg = "", step = 0;
const pow = (ls) => { const c = {}; ls.forEach((x) => (c[x] = (c[x] || 0) + 1)); return Object.keys(c).map(Number).sort((a, b) => a - b).map((p) => p + (c[p] > 1 ? "<sup>" + c[p] + "</sup>" : "")).join(" · "); };
const draw = () => {
const done = leaves.every(isP);
box.innerHTML = `<div class="act-ladder">${hist.map((h, i) => `<div>${i ? "=" : n + " ="} ${h}</div>`).join("")}</div>
          <div class="act-expr">${hist.length ? "=" : n + " ="} ${leaves.map((x, i) => isP(x) ? `<span class="act-prime">${x}</span>` : `<button type="button" class="act-num${pick === i ? " on" : ""}" data-i="${i}">${x}</button>`).join('<span class="act-op">·</span>')}</div>
          ${pick !== null ? `<div class="seg" style="justify-content:center">${[2, 3, 5, 7].map((p) => `<button type="button" data-p="${p}">÷ ${p}</button>`).join("")}</div>` : `<div class="small muted" style="text-align:center">${done ? "Que des nombres premiers : " + n + " = " + pow(leaves) : "Touche un nombre bleu pour le casser."}</div>`}
          <div class="small" style="text-align:center">${msg}</div>`;
box.querySelectorAll(".act-num").forEach((b) => (b.onclick = () => { pick = +b.dataset.i; msg = ""; draw(); }));
box.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => {
const p = +b.dataset.p, x = leaves[pick];
if (x % p) { msg = x + " n'est pas divisible par " + p + " : essaie un autre nombre premier."; pick = null; draw(); return; }
if (leaves.length > 1) hist.push(leaves.join(" · "));
leaves.splice(pick, 1, p, x / p); leaves.sort((a, b) => (isP(b) - isP(a)) || a - b); pick = null; msg = ""; draw(); check();
}));
};
const check = () => {
if (!leaves.every(isP)) return;
if (step === 0) { onWin(0, "84 = 2 · 2 · 3 · 7 = 2² · 3 · 7. Quel que soit l'ordre, on arrive toujours au même résultat."); step = 1; setTimeout(() => { n = 90; leaves = [90]; hist = []; draw(); }, 1600); }
else if (step === 1) { onWin(1, "90 = 2 · 3² · 5."); step = 2; }
};
draw();
},
},

arith: {
predict: { q: "Un bus passe toutes les 6 min, un autre toutes les 8 min. Ils partent ensemble. Ils se retrouvent après…", choices: ["14 min", "24 min", "48 min"], good: 1,
why: "Il faut un multiple commun de 6 et de 8, le plus petit : 24 (le PPMC)." },
defis: ["Fais atterrir les deux grenouilles sur la même case (pas 0).", "Pave un rectangle 12 × 18 avec les plus grands carrés possibles."],
play(box, onWin) {
let a = 0, b = 0, s = 2, step = 0;
const drawFrogs = () => {
const W = 330, X = (v) => 12 + v * 6.1;
let g = '<line x1="' + X(0) + '" y1="60" x2="' + X(50) + '" y2="60" class="f-line"/>';
for (let v = 0; v <= 50; v += 2) g += '<line x1="' + X(v) + '" y1="' + (v % 10 ? 56 : 52) + '" x2="' + X(v) + '" y2="64" class="f-line"/>' + (v % 10 === 0 ? '<text x="' + X(v) + '" y="80" class="f-txt" text-anchor="middle" font-size="11">' + v + "</text>" : "");
for (let v = 6; v <= a; v += 6) g += '<path d="M' + X(v - 6) + ",52 Q" + X(v - 3) + ",28 " + X(v) + ',52" class="f-line" fill="none" stroke-dasharray="3 3"/>';
for (let v = 8; v <= b; v += 8) g += '<path d="M' + X(v - 8) + ",68 Q" + X(v - 4) + ",96 " + X(v) + ',68" class="f-accent" fill="none" stroke-dasharray="3 3"/>';
g += '<circle cx="' + X(a) + '" cy="46" r="7" class="f-fill"/><circle cx="' + X(b) + '" cy="74" r="7" class="f-dot"/>';
box.innerHTML = `<svg class="fig" viewBox="0 0 ${W} 100" role="img" aria-label="deux grenouilles sur une droite graduée">${g}</svg>
          <div class="seg" style="justify-content:center"><button type="button" id="ja">🔵 saute de 6</button><button type="button" id="jb">🔴 saute de 8</button><button type="button" class="btn-ghost" id="j0">Recommencer</button></div>
          <div class="act-out" style="text-align:center">🔵 sur <b>${a}</b> · 🔴 sur <b>${b}</b></div>`;
box.querySelector("#ja").onclick = () => { if (a + 6 <= 50) a += 6; drawFrogs(); check(); };
box.querySelector("#jb").onclick = () => { if (b + 8 <= 50) b += 8; drawFrogs(); check(); };
box.querySelector("#j0").onclick = () => { a = b = 0; drawFrogs(); };
};
const drawTiles = () => {
const L = 18, H = 12, k = 15, W = 330, nx = Math.ceil(L / s), ny = Math.ceil(H / s), ok = L % s === 0 && H % s === 0;
let g = '<rect x="10" y="6" width="' + L * k + '" height="' + H * k + '" class="f-soft"/>';
for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
const x = 10 + j * s * k, y = 6 + i * s * k, out = (j + 1) * s > L || (i + 1) * s > H;
g += '<rect x="' + x + '" y="' + y + '" width="' + s * k + '" height="' + s * k + '" class="' + (out ? "act-over" : "f-fill2") + '"/>';
}
g += '<rect x="10" y="6" width="' + L * k + '" height="' + H * k + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
box.innerHTML = actStepper("Côté du carré", s, "s") + `<svg class="fig" viewBox="0 0 ${W} ${H * k + 12}" role="img" aria-label="rectangle 18 sur 12 pavé de carrés de côté ${s}">${g}</svg>
          <div class="act-out">${ok ? `Carrés de ${s} : ça tombe juste (${L} = ${L / s} · ${s} et ${H} = ${H / s} · ${s}).${s < 6 ? " Mais il y a plus grand !" : ""}` : `Carrés de ${s} : ça dépasse, ${s} ne divise pas ${L % s ? L : H}.`}</div>`;
actBindStepper(box, "s", () => s, (v) => { s = v; drawTiles(); check(); }, 1, 12);
};
const check = () => {
if (step === 0 && a && a === b) { onWin(0, "Les deux sur " + a + " : c'est un multiple de 6 et de 8. Le premier, 24, est le PPMC." + (a > 24 ? " (Tu as trouvé " + a + ", mais 24 vient avant.)" : "")); step = 1; setTimeout(drawTiles, 1600); }
else if (step === 1 && s === 6) { onWin(1, "6 divise 12 et 18, et aucun carré plus grand ne tombe juste : 6 est le PGDC de 12 et 18."); step = 2; }
};
drawFrogs();
},
},
});

Object.assign(ACTIVE, {
cercletan: {

retiens: { regle: "La tangente en un point \\(T\\) du cercle de centre \\(C\\) est perpendiculaire au rayon \\([CT]\\) : sa pente est l'inverse de celle du rayon, avec le signe opposé. Rayon vertical : tangente horizontale.", exemple: ["Cercle de centre \\(O\\), \\(T(3 \\, ; 4)\\) : le rayon \\([OT]\\) a pour pente \\(\\frac{4}{3}\\), donc la tangente a pour pente \\(-\\frac{3}{4}\\).", "Tangente horizontale : \\(T\\) tout en haut ou tout en bas du cercle, où le rayon est vertical."], piege: "La pente de la tangente est \\(-\\frac{3}{4}\\), pas \\(\\frac{3}{4}\\) : le produit des deux pentes vaut \\(-1\\)." },
predict: { q: "Cercle de centre O(0 ; 0), point T(3 ; 4). De O à T, on avance de 3 et on monte de 4. La tangente en T (la droite qui touche le cercle en T sans le traverser)…", choices: ["monte", "descend", "est horizontale"], good: 1,
fig: (() => { const X = (u) => 130 + u * 18, Y = (v) => 120 - v * 18;
return `<svg class="fig" viewBox="0 0 260 230" role="img" aria-label="cercle de centre O, rayon OT vers T(3 ; 4)"><line x1="${X(-6.5)}" y1="${Y(0)}" x2="${X(6.5)}" y2="${Y(0)}" class="f-line" stroke-width="1"/><line x1="${X(0)}" y1="${Y(-6)}" x2="${X(0)}" y2="${Y(6)}" class="f-line" stroke-width="1"/>
      <circle cx="${X(0)}" cy="${Y(0)}" r="90" class="f-blue" stroke-width="2"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(3)}" y2="${Y(4)}" class="f-line" stroke-width="2.5"/>
      <path d="M${X(0)},${Y(0)} L${X(3)},${Y(0)} L${X(3)},${Y(4)}" class="f-line" fill="none" stroke-dasharray="4 3"/><text x="${X(1.5)}" y="${Y(0) + 15}" class="f-txt" text-anchor="middle" font-size="12">+3</text><text x="${X(3) + 5}" y="${Y(2)}" class="f-txt" font-size="12">+4</text>
      <circle cx="${X(0)}" cy="${Y(0)}" r="3.5" class="f-dot"/><text x="${X(0) - 7}" y="${Y(0) + 16}" class="f-txt" text-anchor="end" font-size="13">O</text>
      <circle cx="${X(3)}" cy="${Y(4)}" r="6" class="f-dot"/><text x="${X(3) + 9}" y="${Y(4) - 6}" class="f-txt" font-size="13">T(3 ; 4)</text></svg>`; })(),
why: "Elle est perpendiculaire au rayon : un quart de tour change « avancer de 3, monter de 4 » en « avancer de 4, descendre de 3 ». Sa pente est −3/4." },
defis: ["Déplace T pour que la tangente soit horizontale.", "Déplace T pour que la tangente ait une pente de 3/4."],
play(box, onWin) {

const P = [[5, 0], [4, 3], [3, 4], [0, 5], [-3, 4], [-4, 3], [-5, 0], [-4, -3], [-3, -4], [0, -5], [3, -4], [4, -3]];
let i = 2, step = 0;
const fr = (a, b) => { if (b === 0) return null; const g = (u, v) => (v ? g(v, u % v) : Math.abs(u)); const k = g(a, b) * Math.sign(b); const n = a / k, d = b / k; return d === 1 ? String(n) : (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; };
const draw = () => {
const [x, y] = P[i], W = 330, H = 300, X = (u) => 165 + u * 14, Y = (v) => 150 - v * 14;
let g = '<line x1="' + X(-10.5) + '" y1="' + Y(0) + '" x2="' + X(10.5) + '" y2="' + Y(0) + '" class="f-line" stroke-width="1"/><line x1="' + X(0) + '" y1="' + Y(-10.5) + '" x2="' + X(0) + '" y2="' + Y(10.5) + '" class="f-line" stroke-width="1"/>';
g += '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="70" class="f-blue" stroke-width="2"/>';

g += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(x) + '" y2="' + Y(y) + '" class="f-line" stroke-width="2.5"/>';
if (x && y) g += '<path d="M' + X(0) + "," + Y(0) + " L" + X(x) + "," + Y(0) + " L" + X(x) + "," + Y(y) + '" class="f-line" fill="none" stroke-dasharray="4 3"/>' +
'<text x="' + X(x / 2) + '" y="' + (Y(0) + (y > 0 ? 15 : -6)) + '" class="f-txt" text-anchor="middle" font-size="12">' + (x > 0 ? "+" : "−") + Math.abs(x) + "</text>" +
'<text x="' + (X(x) + (x > 0 ? 5 : -5)) + '" y="' + Y(y / 2) + '" class="f-txt" text-anchor="' + (x > 0 ? "start" : "end") + '" font-size="12">' + (y > 0 ? "+" : "−") + Math.abs(y) + "</text>";

const tx = y, ty = -x, L = 1.9;
g += '<line x1="' + X(x - tx * L) + '" y1="' + Y(y - ty * L) + '" x2="' + X(x + tx * L) + '" y2="' + Y(y + ty * L) + '" class="f-accent" stroke-width="2.5"/>';
if (tx && ty) { const s = tx > 0 ? 1 : -1, ax = s * tx, ay = s * ty;
g += '<path d="M' + X(x) + "," + Y(y) + " L" + X(x + ax) + "," + Y(y) + " L" + X(x + ax) + "," + Y(y + ay) + '" class="f-accent" fill="none" stroke-dasharray="4 3"/>' +
'<text x="' + X(x + ax / 2) + '" y="' + (Y(y) + (ay > 0 ? 15 : -6)) + '" class="f-accent f-txt" text-anchor="middle" font-size="12">+' + ax + "</text>" +
'<text x="' + (X(x + ax) + 5) + '" y="' + Y(y + ay / 2) + '" class="f-accent f-txt" font-size="12">' + (ay > 0 ? "+" : "−") + Math.abs(ay) + "</text>"; }
g += '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="3.5" class="f-dot"/><text x="' + (X(0) + (x < 0 ? 7 : -7)) + '" y="' + (Y(0) + (y > 0 ? 16 : -7)) + '" class="f-txt" text-anchor="' + (x < 0 ? "start" : "end") + '" font-size="13">O</text>';
g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="6" class="f-dot"/><text x="' + (X(x) + (x >= 0 ? 10 : -10)) + '" y="' + (Y(y) + (y >= 0 ? -22 : 32))  + '" class="f-txt" text-anchor="' + (x >= 0 ? "start" : "end") + '" font-size="13">T(' + x + " ; " + y + ")</text>";
const mr = fr(y, x), mt = fr(-x, y);
box.innerHTML = `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="cercle, rayon OT et tangente en T(${x} ; ${y})">${g}</svg>
          <label class="dyn-ctl"><input type="range" min="0" max="${P.length - 1}" step="1" value="${i}" aria-label="déplacer T sur le cercle"><span class="small muted">Fais glisser pour déplacer T sur le cercle.</span></label>
          <div class="act-out">Rayon [OT] : pente ${mr === null ? "aucune (vertical)" : `Δy/Δx = ${y < 0 ? "−" + -y : y}/${x < 0 ? "(−" + -x + ")" : x}${mr === y + "/" + x || mr === String(y / x) && Math.abs(x) === 1 ? "" : " = <b>" + mr + "</b>"}`}<br><span style="color:var(--margin)">Tangente : pente ${mt === null ? "aucune (verticale)" : `<b>${mt}</b>`}</span>${mr !== null && mt !== null && x && y ? `<br><span class="small">Produit des pentes : ${mr} · (${mt}) = <b>−1</b></span>` : ""}</div>`;
const inp = box.querySelector("input");
inp.oninput = () => { i = +inp.value; draw(); box.querySelector("input").focus(); check(); };
};
const check = () => {
const [x, y] = P[i];
if (step === 0 && x === 0) { onWin(0, "En T(0 ; " + y + "), le rayon est vertical, donc la tangente est horizontale (pente 0)."); step = 1; }
else if (step === 1 && y !== 0 && -x * 4 === 3 * y) { onWin(1, "En T(" + x + " ; " + y + "), le rayon a pour pente " + fr(y, x) + " ; on inverse et on change le signe : 3/4."); step = 2; }
};
draw();
},
},
});





function actPrep(A) { return actPlus(A, actPrep0(A)); }





const actParse = (s) => { const t = String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, ""); const m = t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/); return t === "" ? NaN : m ? +m[1] / +m[2] : Number(t); };
function actPlus(A, X) {
const Q = A.plus;
if (!Array.isArray(Q) || !Q.length || !X.play) return X;
const n0 = X.defis.length, N = n0 + Q.length;
const play = (box, onWin) => {


box.innerHTML = '<div class="stack act-plus"></div><div class="stack act-sub"></div>';
const pb = box.firstChild, sub = box.lastChild;
const ask = (j) => {
pb.innerHTML = actAnswerHtml("Ta réponse");
const inp = pb.querySelector("input");
actAnswerBind(pb, () => {
const v = actParse(inp.value);
if (!isFinite(v)) { $hint(pb, "Tape un nombre."); return; }
if (Math.abs(v - Q[j].ans) > 1e-9 * Math.max(1, Math.abs(Q[j].ans))) { $hint(pb, Q[j].no || "Pas encore : reprends la règle des défis."); return; }
pb.innerHTML = ""; onWin(n0 + j, Q[j].ok);
if (j + 1 < Q.length) ask(j + 1);
});
setTimeout(() => pb.scrollIntoView && pb.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
};
X.play(sub, (k, msg) => {
onWin(k, msg);

if (k === n0 - 1) { box.classList.add("act-plus-on"); sub.querySelectorAll(".act-ans").forEach((e) => e.remove()); ask(0); }
});
};
const guide = X.mode === "guide";
return Object.assign({}, X, { defis: X.defis.concat(Q.map((q) => q.d)), play,
titre: guide ? "À toi : " + N + " questions" : X.titre,
lab: (k) => (guide ? "Question " + (k + 1) + " sur " + N : "Défi " + (k + 1)) });
}

function actPrep0(A) {
const P = A.play, o = P && P.o;
if (!o || !o.ask) return { mode: "manip", titre: "Manipule", defis: A.defis, play: P, lab: (k) => "Défi " + (k + 1), fin: "Défis réussis !" };
let fig = !!o.blank;
if (!fig) try { fig = /<svg/.test(o.show(1, 0)); } catch (e) {}
if (fig || A.mode === "figure") return { mode: "figure", titre: "Essaie sur la figure", defis: A.defis, play: P, lab: (k) => "Défi " + (k + 1), fin: "Défis réussis !" };
const n = A.defis.length;


const sel = A.garde ? A.garde : n <= 2 ? [...Array(n).keys()] : /^(Et|Même|Puis|Ensuite|Ce |Cette|Sur ce|Dans ce|Avec ce|Avec cette|Le même|La même)/.test(A.defis[n - 1]) ? [0, 1] : [0, n - 1];
const play = P.mk(Object.assign({}, o, { wins: sel.map((i) => o.wins[i]), show: (x, s) => '<div class="small act-cp"><b>💡 Coup de pouce</b></div>' + o.show(x, sel[s]), blank: undefined }));
return { mode: "guide", titre: "À toi : " + sel.length + " question" + (sel.length > 1 ? "s" : ""), defis: sel.map((i) => A.defis[i]), play, lab: (k) => "Question " + (k + 1) + " sur " + sel.length, fin: "Bravo, c'est compris !" };
}


function $hint(box, t) { let el = box.querySelector(".act-hint"); if (!el) { el = document.createElement("div"); el.className = "small act-hint"; box.appendChild(el); } el.textContent = t; }






function actRetiens(A, L) {
if (!A || !A.retiens) return L;
const r = typeof A.retiens === "function" ? A.retiens(L) : A.retiens, cb = typeof colonBreak === "function" ? colonBreak : (x) => x, o = Object.assign({}, L);
if (typeof r.regle === "string") o.regle = cb(r.regle);
if (Array.isArray(r.exemple)) o.exemple = r.exemple.map(cb);
if (typeof r.piege === "string") o.piege = cb(r.piege);
return o;
}



function activeLesson(id, L0, cont, review, opts = {}) {
const A0 = ACTIVE[id], P = A0.predict, X = actPrep(A0), A = Object.assign({}, A0, { defis: X.defis, play: X.play }), L = actRetiens(A0, L0);
const tail = lessonBody(id), fb = tail.slice(tail.indexOf('<div class="lfb"'));
const short = !!opts.short && !review, optLab = X.mode === "guide" ? "S'entraîner : " + X.defis.length + " question" + (X.defis.length > 1 ? "s" : "") + " (facultatif)" : "Essayer sur la figure (facultatif)";
h(`${brand}<div class="eyebrow">${review ? "Leçon · à toi de jouer" : opts.eyebrow || "Nouvelle notion · à toi de jouer"}</div>
  <div class="card pop lesson-card stack"><h2>${L.titre}</h2>
    <div class="act-step"><div class="act-h"><span class="act-n">1</span> Devine</div><p>${P.q}</p>${P.fig ? `<div class="figwrap">${P.fig}</div>` : ""}
      <div class="seg" id="pc">${predOrder(P.choices.length).map((i) => `<button type="button" data-i="${i}">${P.choices[i]}</button>`).join("")}</div><div id="pfb" aria-live="polite"></div></div>
    <div class="act-step" id="s2" hidden><div class="act-h"><span class="act-n">${short ? "+" : 2}</span> ${X.titre}</div>
      <ul class="act-done" id="adone"></ul><div id="gfb" aria-live="polite"></div><p class="act-goal" id="goal"></p><div id="play" class="stack"></div>
      <button type="button" class="btn-ghost small" id="skip">${X.mode === "guide" ? "Passer" : "Passer les défis"}</button></div>
    ${short ? `<button type="button" class="btn-ghost small act-opt" id="tryopt" hidden>🖐 ${optLab}</button>` : ""}
    <div class="act-step" id="s3" hidden><div class="act-h"><span class="act-n">${short ? 2 : 3}</span> Retiens</div>
      ${retiensHtml(L) }${fb}</div>
  </div>
  <button class="btn-primary btn-big" id="go" hidden>${review ? "Retour à mes compétences" : "J'ai compris, à moi !"}</button>`);
const $ = (s) => document.getElementById(s);
const reveal = (el) => { el.hidden = false; el.classList.add("pop"); setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60); };
const finish = () => { $("skip").hidden = true; if ($("s3").hidden) { reveal($("s3")); typeset($("s3")); } $("go").hidden = false; };



const goalSep = () => (typeof isFR === "function" && isFR() ? " — " : " · ");
const setGoal = (t) => { const g = $("goal"); if (t.includes("\\(")) { g.innerHTML = t; typeset(g); } else g.textContent = t; };
let started = false;
app.querySelectorAll("#pc button").forEach((b) => (b.onclick = () => {
const i = +b.dataset.i, ok = i === P.good, S = typeof sig !== "undefined" && sig && sig.ev === "lecon" ? sig : null;
if (S && !started) sigAide(S, ok ? "D" : "d");
app.querySelectorAll("#pc button").forEach((x) => { x.disabled = true; if (+x.dataset.i === P.good) x.setAttribute("aria-pressed", "true"); });
if (!ok) b.classList.add("act-wrong");
$("pfb").innerHTML = `<div class="fb ${ok ? "ok" : "hint"}">${ok ? "Exact !" : "Pas tout à fait."} ${P.why}</div>`; typeset($("pfb"));
if (started) return; started = true;
if (short) { finish(); const t = $("tryopt"); t.hidden = false; t.onclick = () => { t.remove(); play(); }; return; }
play();
}));
function play() {
setGoal(X.lab(0) + goalSep() + A.defis[0]);
reveal($("s2"));
A.play($("play"), (k, msg) => {
const more = k + 1 < A.defis.length;
$("gfb").innerHTML = `<div class="fb ok">✓ ${colonBreak(msg)}${more ? `<div class="act-suite">➜ ${X.lab(k + 1)} : nouvelle consigne juste en dessous ↓</div>` : ""}</div>`;
if (typeof sig !== "undefined" && sig && sig.ev === "lecon") sigAide(sig, "f");




const g = $("goal"); $("adone").insertAdjacentHTML("beforeend", `<li>✓ ${g.innerHTML}</li>`);
if (more) { setGoal(X.lab(k + 1) + goalSep() + A.defis[k + 1]); g.classList.remove("act-new"); void g.offsetWidth; g.classList.add("act-new"); setTimeout(() => $("gfb").scrollIntoView({ behavior: "smooth", block: "nearest" }), 60); }
else { $("goal").textContent = X.fin; burst(); finish(); }
});
}
$("skip").onclick = () => { if (typeof sig !== "undefined" && sig && sig.ev === "lecon") sigAide(sig, "P"); finish(); };
$("go").onclick = cont;
}

if (typeof window !== "undefined" && window.ACT_LATER) Object.assign(ACTIVE, window.ACT_LATER);

