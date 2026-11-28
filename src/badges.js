// Badges (13.11) : régularité (pas de série qui se perd), maîtrise (notes de compétences), persévérance, curiosité.
// Tout reste sur l'appareil ; un badge gagné ne se perd jamais. Compteurs dans state.bc, badges gagnés dans state.badges.
const BADGE_FAM = { reg: "Régularité", mai: "Maîtrise", per: "Persévérance", cur: "Curiosité" };
const weekOf = (s) => { const d = new Date(s + "T12:00:00"); return addDays(s, -((d.getDay() + 6) % 7)); };
const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);

const Badges = {
  bc(state) {
    if (!state.bc) {
      // Profil existant : on repart de l'historique déjà enregistré.
      const days = (state.history || []).filter((x) => x.n > 0).map((x) => x.date), weeks = {};
      for (const d of days) weeks[weekOf(d)] = (weeks[weekOf(d)] || 0) + 1;
      state.bc = { days: days.length, last: days[days.length - 1] || null, weeks, full: Object.values(weeks).filter((n) => n >= 5).length, rentree: false,
        retry: 0, d3: 0, lessons: [], fb: Object.keys(state.votes || {}).filter((k) => state.votes[k].v !== "facile").length + (state.comments || []).length,
        low: {}, pente: false, down: {}, compris: false };
    }
    return state.bc;
  },
  // Notes des compétences.
  notes(state) { return Object.values(state.comps || {}).map(compNote).filter((n) => n !== null); },
  // Notion maîtrisée : toutes ses compétences notées 5 ou plus.
  notionProgress(state, id) { const cs = compsOf(id); return [cs.filter((c) => (compNote((state.comps || {})[c.cid]) ?? 0) >= 5).length, cs.length]; },
  // Notions ouvertes de l'année (vues ou en cours) d'un thème.
  openOf(state, th) {
    return Engine.catalog(state.profile).filter((c) => c.current && c.theme === th && state.notions[c.id] && ["vu", "encours"].includes(state.notions[c.id].status)).map((c) => c.id);
  },
  // Icône d'un badge de thème, d'après son libellé. 25.11 (chantier E) : une icône dessinée par famille de chapitres
  // (CO, matu, MP, France) au lieu d'émojis génériques ; l'ordre compte (le premier motif qui convient l'emporte).
  THEME_ICONS: [[/algorithm|programmation/i, "algo"], [/complexe/i, "repere"], [/suites et séries/i, "expo"], /* 25.11 (agent col34) : chapitres MA2 de 4e */ [/automatisme/i, "auto"], [/ensemble/i, "venn"], [/argument|raisonner/i, "implique"],
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
  // Badges de l'élève : les badges de thème suivent le découpage de son référentiel (CO, matu ou MP).
  list(state) {
    const themes = state && state.profile ? Engine.themeOrder(Engine.catalog(state.profile).filter((c) => c.current), state.profile) : Object.keys(THEMES);
    /* 28.11 (agent pepite-ecrans, séparation France / romand) : le profil France n'a pas de notes 1–6 (niveaux de maîtrise
       du LSU) ; les critères des badges de maîtrise le disent sans note. Seuils de calcul inchangés. */
    const fr = !!(state && state.profile && state.profile.system === "FR");
    const L = [
      { id: "premier", fam: "reg", icon: "👣", name: "Premier pas", crit: "Terminer une première séance.", prog: (s, b) => [Math.min(b.days, 1), 1] },
      /* 26.11 (revue d'un testeur, validé par l'enseignant) : palier précoce de la régularité, entre « Premier pas » et
         « Semaine pleine ». Série du jour ou record : un jour rattrapé par le joker de série compte (la série continue). */
      { id: "serie3", fam: "reg", icon: "🔥", name: "3 jours d'affilée", crit: "S'entraîner 3 jours de suite (le joker de filon compte).", prog: (s) => [Math.min(3, Math.max((s.streak && s.streak.count) || 0, (s.streak && s.streak.best) || 0)), 3] },
      { id: "semaine", fam: "reg", icon: "📅", name: "Semaine pleine", crit: "S'entraîner 5 jours dans une même semaine (du lundi au dimanche).", prog: (s, b) => [Math.min(5, b.weeks[weekOf(day())] || 0, 5), 5, b.full >= 1] },
      { id: "mois", fam: "reg", icon: "🗓️", name: "Un mois fidèle", crit: "4 semaines pleines, pas forcément d'affilée.", prog: (s, b) => [Math.min(b.full, 4), 4] },
      { id: "rentree", fam: "reg", icon: "🎒", name: "Rentrée", crit: "Reprendre l'entraînement après au moins 10 jours de pause.", prog: (s, b) => [b.rentree ? 1 : 0, 1] },
      { id: "s50", fam: "reg", icon: "🏅", name: "50 séances", crit: "50 jours d'entraînement au total.", prog: (s, b) => [Math.min(b.days, 50), 50] },
      { id: "comp5", fam: "mai", icon: "⭐", name: "Première compétence", crit: fr ? "Une compétence bien maîtrisée." : "Une compétence atteint la note 5.", prog: (s) => [this.notes(s).some((n) => n >= 5) ? 1 : 0, 1] },
      { id: "notion", fam: "mai", icon: "🎯", name: "Notion maîtrisée", crit: fr ? "Toutes les compétences d'une notion bien maîtrisées." : "Toutes les compétences d'une notion à 5 ou plus.",
        prog: (s) => Object.keys(s.notions).map((id) => this.notionProgress(s, id)).reduce((a, p) => (p[1] && p[0] / p[1] > a[0] / a[1] ? p : a), [0, 3]) },
      { id: "expert", fam: "mai", icon: "💎", name: "Expert", crit: fr ? "Une compétence parfaitement maîtrisée." : "Une compétence atteint la note 6.", prog: (s) => [this.notes(s).some((n) => n >= 6) ? 1 : 0, 1] },
      ...themes.map((th) => ({ id: "th-" + th, fam: "mai", icon: this.themeIcon(Engine.themeLabel(th, state && state.profile)), name: Engine.themeLabel(th, state && state.profile),
        crit: th.includes(".") ? "Toutes les notions ouvertes de ce chapitre maîtrisées." : "Toutes les notions ouvertes de ce thème cette année maîtrisées (au moins 2 notions).",
        // Au moins 2 notions, sauf pour un chapitre qui n'en compte qu'une (ex. Ensembles).
        prog: (s) => {
          const ids = this.openOf(s, th), all = Engine.catalog(s.profile).filter((c) => c.current && c.theme === th).length;
          const ok = ids.filter((id) => { const p = this.notionProgress(s, id); return p[0] === p[1]; }).length;
          return [ok, Math.max(Math.min(2, all), ids.length, 1)];
        } })),
      { id: "retry", fam: "per", icon: "🔁", name: "Deuxième essai", crit: "Réussir 10 fois une question au deuxième essai.", prog: (s, b) => [Math.min(b.retry, 10), 10] },
      { id: "compris", fam: "per", icon: "💡", name: "Ça y est !", crit: "Après « pas compris » sur un rappel de cours, réussir 3 questions de suite de cette notion.",
        prog: (s, b) => [b.compris ? 3 : Math.max(0, ...Object.values(b.down)), 3] },
      { id: "pente", fam: "per", icon: "⛰️", name: "Remonter la pente", crit: fr ? "Faire remonter une compétence très fragile jusqu'à bien maîtrisée." : "Faire passer une compétence de 3 ou moins à 5 ou plus.", prog: (s, b) => [b.pente ? 1 : 0, 1] },
      { id: "d3", fam: "per", icon: "🧗", name: "Niveau supérieur", crit: "Réussir 5 questions de difficulté 3 du premier coup.", prog: (s, b) => [Math.min(b.d3, 5), 5] },
      { id: "lecteur", fam: "cur", icon: "📖", name: "Lecteur", crit: "Ouvrir 10 rappels de cours différents.", prog: (s, b) => [Math.min(b.lessons.length, 10), 10] },
      { id: "testeur", fam: "cur", icon: "💬", name: "Testeur", crit: "Donner un avis (👍 / 👎) ou envoyer un commentaire.", prog: (s, b) => [Math.min(b.fb, 1), 1] },
    ];
    return L;
  },
  // Badges nouvellement gagnés : ajoutés à state.badges et à la file d'annonce state.badgesNew.
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

  // ---- Événements ----
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

  // ---- Affichage ----
  // Icônes dessinées (14.11, toutes les familles de chapitres le 25.11) : « svg:<nom> » au lieu d'un émoji.
  // Cadre 100 × 100, hexagone de rayon 44 : le dessin tient dans le carré 24–76.
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
