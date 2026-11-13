// Moteur adaptatif : profil, état de chaque notion, positionnement, choix des questions, mise à jour.
// Tout reste sur l'appareil (localStorage) ; aucune donnée ne part ailleurs.

const HINTS = {
  prio: "D'abord les parenthèses, puis les puissances, puis × et :, enfin + et −.",
  rel: "Moins par moins donne plus. Et attention : −3² = −9, alors que (−3)² = 9.",
  fracadd: "Mets les fractions au même dénominateur avant d'additionner les numérateurs.",
  fracmul: "Multiplie les numérateurs entre eux et les dénominateurs entre eux. Diviser, c'est multiplier par l'inverse.",
  pct: "p % de N, c'est p/100 × N. Une hausse de p % multiplie par (1 + p/100).",
  puiss: "aᵐ · aⁿ = aᵐ⁺ⁿ et (aᵐ)ⁿ = aᵐⁿ. Une puissance négative est un inverse.",
  sci: "Notation scientifique : a · 10ⁿ avec 1 ≤ a < 10. Compte de combien de rangs la virgule se déplace.",
  rac: "Cherche le plus grand carré qui divise le nombre : √72 = √(36 · 2) = 6√2.",
  valnum: "Remplace la lettre par le nombre entre parenthèses, puis respecte les priorités.",
  reduire: "Regroupe les termes de même nature : les x², les x, les nombres.",
  distrib: "Chaque terme de la première parenthèse multiplie chaque terme de la seconde.",
  idrem: "(a + b)² = a² + 2ab + b² : n'oublie pas le double produit 2ab.",
  factor: "Cherche d'abord un facteur commun, puis une identité remarquable.",
  eq1: "Fais la même opération des deux côtés pour isoler x.",
  eq2: "Un produit est nul si l'un de ses facteurs est nul : résous chaque facteur = 0.",
  prop: "Calcule d'abord pour 1 (passage à l'unité), puis multiplie.",
  vitesse: "v = d / t. Attention aux unités : 1 h = 60 min, et 1 m/s = 3,6 km/h.",
  echelle: "Longueurs × k, aires × k², volumes × k³.",
  aires: "Triangle : b·h/2 ; trapèze : (B + b)·h/2 ; disque : π·r².",
  pyth: "Hypoténuse² = somme des carrés des deux autres côtés.",
  vol: "Prisme : base × hauteur ; pyramide et cône : base × hauteur / 3.",
  thales: "Écris les trois rapports égaux AD/AB = AE/AC = DE/BC, puis utilise les deux utiles.",
  affine: "f(x) = ax + b : a est la pente, b l'ordonnée à l'origine.",
  eq3: "Mets x en évidence, puis factorise ce qui reste.",
  eq2disc: "Δ = b² − 4ac ; si Δ > 0, x = (−b ± √Δ) / 2a ; si Δ < 0, aucune solution.",
  sys2: "Additionne ou soustrais les équations pour éliminer une inconnue, ou isole-la et remplace.",
  fimg: "Image : remplace x par le nombre. Préimage : résous f(x) = valeur.",
  f2: "Sommet : x = −b / 2a, puis calcule f en ce point. Zéros : f(x) = 0.",
  inter: "Les graphes se coupent là où f(x) = g(x) : mets tout d'un côté et résous.",
  angles: "L'angle au centre vaut le double de l'angle inscrit qui intercepte le même arc.",
  euclide: "Hauteur : h² = p · q. Euclide : cathète² = projection · hypoténuse.",
  trigo: "SOH CAH TOA : sin = opposé/hypoténuse, cos = adjacent/hypoténuse, tan = opposé/adjacent.",
  cart: "Distance : √((xB − xA)² + (yB − yA)²). Milieu : moyenne des coordonnées. Pente : Δy / Δx.",
  recip: "(f ∘ g)(x) = f(g(x)) : calcule d'abord g. Réciproque : résous y = f(x) pour x.",
  sinlaw: "Sinus : a / sin α = b / sin β. Cosinus : c² = a² + b² − 2ab·cos γ.",
  expo: "Écris les deux membres comme puissances de la même base, puis égale les exposants.",
  log: "log_b(x) = y signifie b^y = x. Pour résoudre b^x = c : x = ln c / ln b.",
  absval: "|A| = b (b ≥ 0) donne A = b ou A = −b. Une valeur absolue n'est jamais négative.",
  ineq: "Comme une équation, mais on retourne le signe en multipliant ou divisant par un négatif.",
  trigcercle: "180° = π rad. Sur le cercle trigonométrique, le point a pour coordonnées (cos α ; sin α).",
  trigeq: "Sur [0° ; 360°[ : sin x = s donne x et 180° − x ; cos x = c donne x et 360° − x.",
  stats: "Moyenne : somme / effectif. Médiane : valeur du milieu de la série triée. Écart-type : √(moyenne des carrés des écarts).",
};
if (typeof HINTS_EXTRA !== "undefined") Object.assign(HINTS, HINTS_EXTRA);

const Store = {
  key: "5m2m.v1",
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || null; } catch (e) { return null; } },
  save(s) { try { localStorage.setItem(this.key, JSON.stringify(s)); } catch (e) {} },
  clear() { try { localStorage.removeItem(this.key); } catch (e) {} },
};

const day = (d = new Date()) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return day(d); };
const INTERVALS = [0, 1, 3, 7, 14, 30];
const TARGET = { drill: -300, app: -100, defi: 80, defi4: 80, rev: -150 }; // écart visé au Mathélo (≈ 85 %, 65 %, 40 % de réussite)
const KIND_LABEL = { drill: "🔁 Automatisme", app: "🧩 Application", defi: "🏔 Défi", rev: "🔄 Révision" };
// Programme du jour : le format change d'un jour à l'autre ; l'équilibre se fait sur 7 jours.
const FORMATS = {
  defi: { label: "🏔 Défi du jour", slots: ["defi4"], text: "Un seul problème, à ton niveau. Prends ton temps." },
  auto: { label: "🔁 Série d'automatismes", slots: ["drill", "drill", "drill", "drill", "drill", "drill", "drill", "drill"], text: "8 calculs rapides, enchaînés." },
  app: { label: "🧩 Applications", slots: ["app", "app", "app"], text: "Trois questions de fond sur tes notions actuelles." },
  mixte: { label: "⚖️ Mixte", slots: ["drill", "app", "defi"], text: "Un automatisme, une application, un défi." },
  revision: { label: "🔄 Révision", slots: ["rev", "rev", "rev", "rev"], text: "Les notions à revoir aujourd'hui, pour ne pas les oublier." },
};
const WEEK = { defi: 2, auto: 2, app: 1, mixte: 1, revision: 1 };

// ---------- Mathélo : score de type Elo ----------
// Année HarmoS équivalente : CH 9e–11e = 9–11 ; FR 6e = 8 … 3e = 11.
const harmos = (system, grade) => (system === "FR" ? grade + 2 : grade);
// Score d'une question : niveau scolaire de la notion + difficulté.
function itemRating(profile, id, d) {
  const n = NOTIONS.find((x) => x.id === id);
  // Niveau propre à la notion : l'année où elle apparaît au CO / Collège. Reprise plus tard en MP : demi-écart en plus.
  const pl = placeOf(n, profile) || n.CH || n.MP || n.FR, base = profile.system === "CH" && n.CH ? n.CH[0] : pl[0];
  const g = base + Math.max(0, pl[0] - base) / 2;
  return 700 + (harmos(profile.system, g) - 8) * 150 + 40 + (d - 1) * 130;
}
// Échelle de référence (sans données partagées) : Mathélo typique en fin d'année par niveau HarmoS.
const ELO_REF = [[8, 850], [9, 1000], [10, 1150], [11, 1300], [12, 1450], [13, 1600]];
function eloLabel(profile, r) {
  const sys = SYSTEMS[profile.system];
  const name = (h) => { const g = sys.grades.find(([gg]) => harmos(profile.system, gg) === h); return g ? g[1] : h === 12 ? (profile.system === "FR" ? "2nde" : "1re du Collège") : h === 13 ? (profile.system === "FR" ? "1re" : "2e du Collège") : h + "e"; };
  let lvl = ELO_REF[0];
  for (const ref of ELO_REF) if (r >= ref[1] - 75) lvl = ref;
  const h = lvl[0], gap = r - lvl[1];
  const adj = gap >= 60 ? "solide" : gap <= -40 ? "en route vers la fin" : "typique de fin";
  return r < ELO_REF[0][1] - 75 ? "En route vers la fin de " + name(8) : "Niveau " + adj + (adj === "solide" ? " de " : " de ") + name(h);
}

const Engine = {
  newState(profile) {
    const h = harmos(profile.system, profile.grade);
    const start = 700 + (h - 8) * 150 + 100;
    return { v: 1, profile, notions: {}, streak: { count: 0, last: null }, history: [], created: day(), elo: { r: Math.round(start), n: 0, log: [] } };
  },

  // Notions du programme jusqu'à l'année de l'élève. Années précédentes : vues. Année en cours : « à venir » ;
  // elles s'ouvrent dans l'ordre du référentiel (unlock), sans rien demander à l'élève.
  catalog(profile) {
    return NOTIONS.filter((n) => { const pl = placeOf(n, profile); return pl && pl[0] <= profile.grade; }).map((n) => {
      const [g] = placeOf(n, profile);
      const again = profile.track !== "mp" && (n.again || []).includes(profile.grade);
      return { ...n, theme: this.themeKey(profile, n.id), defaultStatus: g < profile.grade ? "vu" : "avenir", current: g === profile.grade || again, again };
    });
  },
  refOf(profile) { return profile.track === "mp" ? "MP" : profile.grade >= 12 ? "MATU" : "CO"; },
  // Thème d'une notion selon le référentiel de l'élève (13.11) : matu = thèmes (Algèbre, Fonctions…), MP = chapitres ;
  // CO, ou notion absente du référentiel : les 4 thèmes du CO.
  themeKey(profile, id) {
    const ref = this.refOf(profile), k = ref !== "CO" && typeof ORDRE_THEME !== "undefined" && (ORDRE_THEME[ref] || {})[id];
    return k ? ref + "." + k : NOTIONS.find((n) => n.id === id).theme;
  },
  themeLabel(key) { const [ref, k] = key.split("."); return k ? THEME_LABEL[ref][k] : THEMES[key]; },
  // Thèmes présents dans une liste du catalogue, dans l'ordre du référentiel puis ceux du CO.
  themeOrder(list) {
    const keys = [...new Set(list.map((c) => c.theme))], pos = (k) => { const [ref, t] = k.split("."); return t ? Object.keys(THEME_LABEL[ref]).indexOf(t) : 100 + Object.keys(THEMES).indexOf(k); };
    return keys.sort((a, b) => pos(a) - pos(b));
  },
  // Rang dans l'ordre du référentiel (CO, matu ou MP selon l'élève).
  rank(profile, id) {
    const ref = this.refOf(profile);
    const r = (ORDRE[ref] || {})[id] ?? ORDRE.CO[id];
    return r ?? 1000 + NOTIONS.findIndex((n) => n.id === id);
  },
  newNotion(status) {
    return { status, m: status === "vu" ? 0.55 : status === "encours" ? 0.4 : 0, box: status === "vu" ? 1 : 0, due: day(), seen: 0, ok: 0 };
  },
  autoInit(state) {
    this.initNotions(state, Object.fromEntries(this.catalog(state.profile).map((c) => [c.id, c.defaultStatus])));
    this.unlock(state);
  },
  // Ouvre les notions de l'année dans l'ordre du référentiel : toujours au moins 3 notions ouvertes et pas encore
  // maîtrisées, et au moins la part de l'année écoulée (novembre ≈ 20 %, juin ≈ 90 %). Une notion « pas encore vue
  // en classe » revient au bout de 3 semaines.
  unlock(state, date = new Date()) {
    const today = day(date), p = state.profile;
    const cur = Object.keys(state.notions).filter((id) => { const pl = placeOf(NOTIONS.find((n) => n.id === id), p); return pl && pl[0] === p.grade; })
      .sort((a, b) => this.rank(p, a) - this.rank(p, b));
    for (const id of cur) { const s = state.notions[id]; if (s.status === "nonvu" && (!s.retry || s.retry <= today)) s.status = "avenir"; }
    const open = () => cur.filter((id) => ["encours", "vu"].includes(state.notions[id].status));
    const active = () => open().filter((id) => { const s = state.notions[id]; return !(s.ok >= 2 && s.m >= 0.6); }).length;
    const minOpen = Math.ceil((cur.length * schoolMonth(date)) / 10);
    let changed = false;
    while (active() < 3 || open().length < minOpen) {
      const next = cur.find((id) => state.notions[id].status === "avenir");
      if (!next) break;
      Object.assign(state.notions[next], { status: "encours", m: Math.max(0.4, state.notions[next].m), due: today });
      changed = true;
    }
    return changed;
  },
  // « Pas encore vu en classe » : la notion sort des séances pendant 3 semaines, sans pénalité.
  notYet(state, id) {
    const s = state.notions[id];
    if (!s) return;
    s.status = "nonvu"; s.retry = addDays(day(), 21); s.due = s.retry;
    this.unlock(state);
  },
  // Compétence : les 8 dernières réponses (1, 0,5 ou 0).
  recordComp(state, id, d, score) {
    state.comps = state.comps || {};
    const cid = compOf(id, d), rec = (state.comps[cid] = state.comps[cid] || { r: [], n: 0 }), before = compNote(rec);
    rec.r.push(score); rec.r = rec.r.slice(-8); rec.n++; rec.last = day();
    if (typeof Badges !== "undefined") Badges.onComp(state, cid, before, compNote(rec));
  },

  // Catalogue modifié depuis la création du profil : ajoute les notions manquantes (anciennes = vues, année en cours = à cocher).
  migrate(state) {
    let changed = false;
    for (const c of this.catalog(state.profile)) if (!state.notions[c.id]) { state.notions[c.id] = this.newNotion(c.defaultStatus); changed = true; }
    // Ancien questionnaire : « pas encore » coché par l'élève → à venir (la notion s'ouvrira dans l'ordre).
    for (const s of Object.values(state.notions)) if (s.status === "nonvu" && !s.retry) { s.status = "avenir"; changed = true; }
    for (const id of Object.keys(state.notions)) { const n = NOTIONS.find((x) => x.id === id); if (!n || !placeOf(n, state.profile)) { delete state.notions[id]; changed = true; } }
    if (this.unlock(state)) changed = true;
    return changed;
  },

  initNotions(state, statuses) {
    state.notions = {};
    for (const [id, status] of Object.entries(statuses)) {
      state.notions[id] = this.newNotion(status);
    }
  },

  eligible(state) {
    return Object.entries(state.notions).filter(([, s]) => s.status === "vu" || s.status === "encours").map(([id]) => id);
  },

  // Difficulté : visée ≈ 70 % de réussite (question ≈ 150 points sous le Mathélo), corrigée par la maîtrise de la notion.
  difficulty(state, id) {
    const cap = difficultyCap(state.profile), m = state.notions[id].m;
    let best = 1, bestGap = Infinity;
    for (let d = 1; d <= cap; d++) {
      const gap = Math.abs(itemRating(state.profile, id, d) - (state.elo.r - 150));
      if (gap < bestGap) { bestGap = gap; best = d; }
    }
    if (m < 0.3) best = Math.max(1, best - 1);
    if (m > 0.8) best = Math.min(cap, best + 1);
    // Niveau 4 (problème) : notion solide, Mathélo suffisant, environ une fois sur trois.
    if (hasProb(id) && m >= 0.7 && state.elo.r >= itemRating(state.profile, id, 4) - 250 && Math.random() < 0.35) return 4;
    return best;
  },

  // Mise à jour du Mathélo. score : 1, 0,5 ou 0. K plus grand au début (positionnement rapide).
  updateElo(state, id, d, score, weight = 1) {
    const e = state.elo, q = itemRating(state.profile, id, d);
    const expected = 1 / (1 + Math.pow(10, (q - e.r) / 400));
    const K = (e.n < 20 ? 48 : e.n < 60 ? 32 : 20) * weight; // calibrage progressif : provisoire tant que n < 20
    const delta = Math.round(K * (score - expected));
    e.r = Math.max(400, e.r + delta);
    e.n++;
    const today = day(), last = e.log[e.log.length - 1];
    if (last && last[0] === today) last[1] = e.r; else e.log.push([today, e.r]);
    e.log = e.log.slice(-90);
    return delta;
  },

  make(state, id, d, seed) {
    const level = d || this.difficulty(state, id);
    return this.build(id, level, seed);
  },
  // Question reproductible : même notion, niveau et graine → même question.
  build(id, level, seed) {
    seed = seed || Math.floor(Math.random() * 46655) + 1;
    R.seed(seed * 7919 + level * 104729 + [...id].reduce((a, c) => a + c.charCodeAt(0), 0));
    const code = id + "-" + level + "-" + seed.toString(36);
    if (level === 4 && hasProb(id)) { const p = probFor(id)(); return { ...p, id, d: 4, seed, code, spec: { kind: "multi" }, hint: p.hints[0] }; }
    const q = GEN[id](level);
    return { ...q, id, d: level, seed, code, hint: q.hint || HINTS[id] };
  },
  // Lecture d'un code « eq2disc-2-k3f » → question exacte (ou null).
  fromCode(code) {
    const m = /^([a-z0-9]+)-([1-4])-([a-z0-9]+)$/.exec(String(code).trim().toLowerCase());
    if (!m || !GEN[m[1]] || (m[2] === "4" && !hasProb(m[1]))) return null;
    return this.build(m[1], +m[2], parseInt(m[3], 36));
  },

  // Positionnement : premier repère rapide (5 notions vues ou en cours) ; le niveau se précise ensuite au fil des séances, en variant les thèmes, notions récentes d'abord.
  placementPlan(state) {
    const all = this.eligible(state), recent = all.filter((id) => this.isRecent(state, id));
    const ids = recent.length >= 3 ? recent : all;
    const byTheme = {};
    for (const id of ids) {
      const n = NOTIONS.find((x) => x.id === id);
      (byTheme[n.theme] = byTheme[n.theme] || []).push(n);
    }
    const pl = (n) => placeOf(n, state.profile);
    Object.values(byTheme).forEach((arr) => arr.sort((a, b) => pl(b)[0] - pl(a)[0] || pl(b)[1] - pl(a)[1]));
    const plan = [];
    while (plan.length < 5 && Object.values(byTheme).some((a) => a.length)) {
      for (const arr of Object.values(byTheme)) if (arr.length && plan.length < 5) plan.push(arr.shift().id);
    }
    return plan;
  },

  // Résultat d'une question de positionnement : true, false ou null (« je ne sais pas »).
  placementResult(state, id, ok, d = 2) {
    this.updateElo(state, id, d, ok === true ? 1 : 0);
    this.recordComp(state, id, d, ok === true ? 1 : 0);
    const s = state.notions[id];
    if (ok === true) Object.assign(s, { m: 0.75, box: 2, due: addDays(day(), 3) });
    else if (ok === false) Object.assign(s, { m: 0.3, box: 0, due: day() });
    else Object.assign(s, { m: 0.2, box: 0, due: day() });
    s.placed = true;
  },

  // Séance du jour : notions dues et fragiles d'abord, puis « en cours », puis rappels espacés.
  // Notion « actuelle » : année en cours ou précédente. Les plus anciennes ne reviennent qu'en remédiation.
  isRecent(state, id) {
    const pl = placeOf(NOTIONS.find((n) => n.id === id), state.profile);
    const n = NOTIONS.find((x) => x.id === id);
    return pl && (pl[0] >= state.profile.grade - 1 || (state.profile.track !== "mp" && (n.again || []).includes(state.profile.grade)));
  },
  // Toutes les notions vues sont candidates ; les anciennes sont filtrées par niveau dans oldLevels.
  pool(state, kind) {
    return this.eligible(state);
  },
  // Notion ancienne : jamais triviale. Niveau 3 ou problème, assez proche de la cible ;
  // ou niveau ≥ 2 si l'élève l'a ratée (fragile), car alors elle n'est pas triviale pour lui.
  oldLevels(state, id, levels, target) {
    const s = state.notions[id], weak = s.m < 0.45;
    return levels.filter((d) => weak ? d >= 2 : d >= 3 && itemRating(state.profile, id, d) >= target - 150);
  },

  // Format du jour : le plus en retard sur l'équilibre des 7 derniers jours, jamais celui de la veille.
  chooseFormat(state, exclude = [], today = day()) {
    const since = addDays(today, -7), log = (state.formats || []).filter((f) => f.date >= since && f.date < today);
    const recentRev = log.some((x) => x.f === "revision" && x.date >= addDays(today, -3));
    const yesterday = (state.formats || []).filter((f) => f.date < today).slice(-1)[0];
    const due = this.eligible(state).filter((id) => state.notions[id].due <= today).length;
    let best = null;
    for (const f of Object.keys(FORMATS)) {
      if (exclude.includes(f)) continue;
      let sc = WEEK[f] - log.filter((x) => x.f === f).length;
      if (yesterday && yesterday.f === f) sc -= 3;
      if (f === "revision") sc += due >= 4 && !recentRev ? 1 : due >= 4 ? 0 : -1;
      if (f === "defi" && !this.eligible(state).some((id) => hasProb(id) && this.isRecent(state, id))) sc -= 0.5;
      sc += Math.random() * 0.4;
      if (!best || sc > best.sc) best = { f, sc };
    }
    return best ? best.f : "mixte";
  },

  planSession(state, format) {
    const f = format || this.todayFormat(state);
    return this.planSlots(state, FORMATS[f].slots);
  },
  // Format retenu pour aujourd'hui (stable dans la journée, sauf « Autre format »).
  todayFormat(state) {
    const today = day();
    if (!state.today || state.today.date !== today) state.today = { date: today, f: this.chooseFormat(state) };
    return state.today.f;
  },
  otherFormat(state) {
    const cur = this.todayFormat(state);
    state.today = { date: day(), f: this.chooseFormat(state, [cur]) };
    return state.today.f;
  },
  // Trace du format fait (pour l'équilibre sur 7 jours).
  logFormat(state, f) {
    const today = day();
    state.formats = (state.formats || []).filter((x) => x.date >= addDays(today, -30));
    if (!state.formats.some((x) => x.date === today && x.f === f)) state.formats.push({ date: today, f });
  },

  // Remplit des créneaux : pour chacun, la notion ET le niveau les plus proches de la cible fixée par le Mathélo.
  planSlots(state, slots) {
    const today = day(), elo = state.elo.r, cap = difficultyCap(state.profile), used = new Set(), plan = [];
    const maxOld = slots.includes("rev") ? 2 : 1;
    let old = 0;
    // Créneau « Rappel » : une notion ancienne, jamais triviale. Une séance sur trois environ ;
    // en révision, chaque fois qu'une notion ancienne est fragile. Sans candidate valable : créneau normal.
    const weakOld = this.eligible(state).some((id) => !this.isRecent(state, id) && state.notions[id].m < 0.45);
    const wantRappel = slots.length > 1 && ((slots.includes("rev") && weakOld) || Math.random() < 0.35);
    const rappelAt = wantRappel ? slots.length - 1 - Math.floor(Math.random() * Math.min(2, slots.length)) : -1;
    // « En ce moment en classe » : environ 2 créneaux sur 3 portent sur le chapitre choisi par l'élève.
    const nowIds = this.nowActive(state) ? state.now.ids.filter((id) => state.notions[id] && ["vu", "encours"].includes(state.notions[id].status)) : [];
    const nowK = nowIds.length ? (slots.length === 1 ? 1 : Math.round((slots.length * 2) / 3)) : 0;
    const usedPair = new Set();
    const choose = (kind, base, rappel, only) => {
      let best = null, pool = only || this.pool(state, base);
      if (kind === "rev" && !only) { const due = pool.filter((id) => state.notions[id].due <= today || state.notions[id].m < 0.5); if (due.length) pool = due; }
      for (const id of pool) {
        const s = state.notions[id], recent = this.isRecent(state, id), target = elo + TARGET[kind] + (s.easy || 0) * 120;
        if (rappel ? recent : !recent) continue; // les anciennes notions ne passent que par le créneau Rappel
        let levels = [1, 2, 3].filter((d) => d <= cap && (base !== "defi" || d >= 2) && (kind !== "drill" || d <= 2 || !recent));
        if ((kind === "defi4" || kind === "defi") && hasProb(id)) levels.push(4);
        if (!recent) levels = this.oldLevels(state, id, levels, target);
        for (const d of levels) {
          let sc = Math.abs(itemRating(state.profile, id, d) - target) / 100;
          if (rappel) sc = (s.m < 0.45 ? -1 : 0) + Math.max(0, itemRating(state.profile, id, d) - target) / 200;
          if (s.due <= today && base !== "defi") sc -= 0.6;
          if (kind === "app" || kind === "rev") sc -= (1 - s.m) * 0.8;
          if (s.status === "encours") sc -= 0.4;
          if (this.prepActive(state) && state.prep.ids.includes(id)) sc -= 1.2;
          if (used.has(id)) sc += only ? 0.5 : 2;
          if (usedPair.has(id + "|" + d)) sc += 1;
          if (d === 4) sc -= kind === "defi4" ? 3 : 0.3;
          sc += Math.random() * 0.5;
          if (!best || sc < best.sc) best = { id, d, sc };
        }
      }
      return best;
    };
    const nowPart = [];
    for (const [si, kind] of slots.entries()) {
      const base = kind === "defi4" ? "defi" : kind;
      if (si < nowK && si !== rappelAt) {
        const b = choose(kind, base, false, nowIds);
        if (b) { used.add(b.id); usedPair.add(b.id + "|" + b.d); nowPart.push(b.id + "|" + b.d + "|" + base); continue; }
      }
      let best = si === rappelAt && old < maxOld ? choose(kind, base, true) : null;
      if (best) old++; else best = choose(kind, base, false);
      if (!best) best = choose(kind, base, true); // aucune notion de l'année disponible
      if (!best) continue;
      used.add(best.id);
      plan.push(best.id + "|" + best.d + "|" + base);
    }
    // Le chapitre du moment d'abord, du plus simple au plus difficile.
    return [...nowPart.sort((x, y) => +x.split("|")[1] - +y.split("|")[1]), ...plan];
  },

  // « Trop facile » : l'élève passe la question. Demi-victoire au Mathélo (sans répondre, on ne compte pas plein),
  // la notion monte, et son niveau visé est relevé (décalage par notion, qui retombe si l'élève échoue ensuite).
  tooEasy(state, id, d, kind) {
    const s = state.notions[id];
    s.easy = Math.min(3, (s.easy || 0) + 1);
    s.m = Math.min(1, s.m + (1 - s.m) * 0.25);
    s.box = Math.min(5, s.box + 1);
    s.due = addDays(day(), INTERVALS[s.box]);
    if (s.status === "encours" && s.m > 0.7) s.status = "vu";
    const delta = this.updateElo(state, id, d, 1, 0.5);
    this.recordComp(state, id, d, 1);
    // Remplaçante : même notion, un cran au-dessus (si possible), sinon la question suivante du programme.
    const cap = difficultyCap(state.profile), top = hasProb(id) && kind !== "drill" ? 4 : Math.min(3, cap);
    return { delta, next: d < top && d < 4 ? id + "|" + (d + 1) + "|" + (kind === "drill" ? "app" : kind || "app") : null };
  },

  // Score Moodle : 1 au premier essai, 0,5 au deuxième, 0 ensuite.
  record(state, id, d, tries, solved, partial) {
    const s = state.notions[id];
    if (typeof Badges !== "undefined") Badges.onAnswer(state, id, d, tries, solved, partial);
    if (partial !== undefined) { // problème : score partiel 0..1
      this.recordComp(state, id, d, partial);
      s.seen++;
      s.m = Math.min(1, Math.max(0, s.m + (partial - 0.5) * 0.2));
      if (partial >= 0.99) { s.box = Math.min(5, s.box + 1); s.ok++; } else if (partial < 0.5) s.box = 0;
      s.due = addDays(day(), partial >= 0.99 ? INTERVALS[s.box] : 1);
      return partial;
    }
    const today = day();
    s.seen++;
    if (solved && tries === 1) {
      s.m = Math.min(1, s.m + (1 - s.m) * (0.18 + 0.06 * d));
      s.box = Math.min(5, s.box + 1);
      s.ok++;
    } else if (solved) {
      s.m = Math.min(1, s.m + (1 - s.m) * 0.06);
    } else {
      s.m = s.m * 0.6;
      s.box = 0;
      if (s.easy) s.easy--;
    }
    s.due = addDays(today, solved && tries === 1 ? INTERVALS[s.box] : 1);
    if (s.status === "encours" && s.m > 0.7) s.status = "vu";
    const sc = solved ? (tries === 1 ? 1 : 0.5) : 0;
    this.recordComp(state, id, d, sc);
    this.unlock(state);
    return sc;
  },

  finishDay(state, answered, score) {
    const today = day();
    if (answered > 0) {
      if (typeof Badges !== "undefined") Badges.onDay(state, today);
      if (state.streak.last !== today) state.streak.count = state.streak.last === addDays(today, -1) ? state.streak.count + 1 : 1;
      state.streak.last = today;
      const h = state.history.find((x) => x.date === today);
      if (h) { h.n += answered; h.score += score; } else state.history.push({ date: today, n: answered, score });
      state.history = state.history.slice(-120);
    }
  },

  // « Je prépare mon test » : notions choisies, actif jusqu'au jour du test inclus.
  // « En ce moment en classe » (13.11) : 1 à 3 notions choisies par l'élève ; question de relance après 3 semaines.
  nowActive(state) { return !!(state.now && state.now.ids && state.now.ids.length); },
  nowStale(state, today = day()) { return this.nowActive(state) && addDays(state.now.since, 21) <= today; },
  setNow(state, ids) {
    state.now = ids.length ? { ids, since: day() } : null;
    for (const id of ids) { const n = state.notions[id]; if (n && n.status !== "vu" && n.status !== "encours") { Object.assign(n, { status: "encours", m: Math.max(0.4, n.m), due: day() }); delete n.retry; } }
  },
  // Notions probables du moment : ouvertes et pas encore maîtrisées, puis les suivantes dans l'ordre du référentiel.
  nowSuggest(state, n = 6) {
    const p = state.profile, cur = this.catalog(p).filter((c) => c.current && state.notions[c.id]).sort((a, b) => this.rank(p, a.id) - this.rank(p, b.id));
    const open = cur.filter((c) => ["vu", "encours"].includes(state.notions[c.id].status) && !(state.notions[c.id].m >= 0.75 && state.notions[c.id].ok >= 3));
    const next = cur.filter((c) => ["avenir", "nonvu"].includes(state.notions[c.id].status));
    return [...open.slice(-4), ...next.slice(0, n)].slice(0, n).map((c) => c.id);
  },
  prepActive(state) { return !!(state.prep && state.prep.ids.length && state.prep.date >= day()); },
  planPrep(state) {
    const ids = state.prep.ids.filter((id) => state.notions[id]);
    const n = 7;
    const order = [...ids].sort((a, b) => state.notions[a].m - state.notions[b].m);
    const plan = [];
    for (let i = 0; plan.length < n - 1; i++) plan.push(order[i % order.length]);
    const withProb = order.filter((id) => hasProb(id));
    plan.push(withProb.length ? "PROB:" + withProb[0] : order[0]);
    return plan;
  },

  // Problème de la semaine : une notion « à problème » parmi celles vues, fixée par la semaine.
  weeklyProblem(state) {
    const ids = this.eligible(state).filter((id) => hasProb(id));
    if (!ids.length) return null;
    const d = new Date(), week = Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 6048e5);
    return ids[week % ids.length];
  },

  isProvisional(state) { return state.elo.n < 20; },

  themeLevels(state) {
    const out = {};
    for (const [id, s] of Object.entries(state.notions)) {
      if (s.status !== "vu" && s.status !== "encours") continue;
      const th = NOTIONS.find((n) => n.id === id).theme;
      (out[th] = out[th] || []).push(s.m);
    }
    return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length]));
  },
};
