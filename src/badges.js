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
  // Icône d'un badge de thème, d'après son libellé.
  themeIcon(label) {
    const T = [[/vectoriel|coordonn|droites param/i, "🧭"], [/probab|statist|données/i, "🎲"], [/complexe/i, "🌀"], [/analyse/i, "📉"], [/trigo/i, "📐"], [/géom|volume|espace/i, "📐"],
      [/quadrat|degré 2/i, "svg:parabole"], [/syst|équation|inéquation/i, "⚖️"], [/fonction|puissance|log/i, "📈"], [/algèbre|algébrique/i, "🔣"], [/nombre|numérique/i, "🔢"], [/grandeur|mesure/i, "📏"]];
    return (T.find(([r]) => r.test(label)) || [0, "🏆"])[1];
  },
  // Badges de l'élève : les badges de thème suivent le découpage de son référentiel (CO, matu ou MP).
  list(state) {
    const themes = state && state.profile ? Engine.themeOrder(Engine.catalog(state.profile).filter((c) => c.current), state.profile) : Object.keys(THEMES);
    const L = [
      { id: "premier", fam: "reg", icon: "👣", name: "Premier pas", crit: "Terminer une première séance.", prog: (s, b) => [Math.min(b.days, 1), 1] },
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
        // Au moins 2 notions, sauf pour un chapitre qui n'en compte qu'une (ex. Ensembles).
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
  // Icônes dessinées (14.11) : « svg:<nom> » au lieu d'un émoji, quand aucun émoji ne convient (parabole des fonctions quadratiques).
  drawn(icon, col) {
    if (icon === "svg:parabole")
      return `<g fill="none" stroke-linecap="round"><path d="M26 72 H74 M50 24 V78" stroke="${col}" stroke-width="2.5" opacity=".45"/><path d="M21 30 Q50 90 79 30" stroke="${col}" stroke-width="6"/><circle cx="50" cy="60" r="4.5" fill="${col}" stroke="none"/></g>`;
    return "";
  },
  COLORS: { reg: ["#f08a24", "#fde7cf"], mai: ["#2457d6", "#e4ecff"], per: ["#1e8a5a", "#e1f5ea"], cur: ["#8a3fd1", "#f0e4fb"] },
  icon(x, on, px = 56) {
    const [c, soft] = this.COLORS[x.fam];
    const pts = [...Array(6)].map((_, i) => { const a = Math.PI / 6 + (i * Math.PI) / 3; return (50 + 44 * Math.cos(a)).toFixed(1) + "," + (50 + 44 * Math.sin(a)).toFixed(1); }).join(" ");
    return `<svg class="bdg-ic${on ? "" : " off"}" viewBox="0 0 100 100" width="${px}" height="${px}" aria-hidden="true"><polygon points="${pts}" fill="${on ? soft : "none"}" stroke="${on ? c : "currentColor"}" stroke-width="${on ? 7 : 4}" stroke-dasharray="${on ? "" : "6 6"}"/>${this.drawn(x.icon, on ? c : "currentColor") || `<text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-size="40">${x.icon}</text>`}</svg>`;
  },
};
