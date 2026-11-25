/*
 * simulate-class.js — simulation d'une classe de 10 élèves sur 14 jours
 * (fourni par un testeur Claude le 26.11.2026 ; déposé tel quel, hors suite de tests : préfixe _)
 *
 * USAGE
 *   1. Ouvrir https://5min2maths.github.io/ dans un navigateur (de préférence un profil de test).
 *   2. Ouvrir la console (F12 > Console), coller TOUT ce fichier, Entrée.
 *   3. Lancer :   await simulateClass()            // 5 tirages, résumé moyen
 *                 await simulateClass({seeds:[1]}) // un seul tirage
 *
 * CE QUE ÇA FAIT
 *   Appelle directement le moteur de l'app (Engine.newState, planSession, make, record,
 *   updateElo, finishDay) avec des profils vierges et une horloge simulée.
 *   Ne passe pas par l'interface. Ne touche pas au profil enregistré (aucun save()).
 *
 * LIMITES
 *   - Les élèves sont des modèles statistiques (hypothèses ci-dessous).
 *   - Carnet d'erreurs, badges et Points de l'année ne sont pas simulés.
 *   - Les durées sont estimées : MIN_PER_ITEM / MIN_PER_LESSON / MIN_PER_ERROR.
 *
 * DÉPEND DE (noms internes à surveiller si l'app change) :
 *   Engine.newState / autoInit / todayFormat / planSession / logFormat / lessonDue / make /
 *   record / updateElo / finishDay, et la fonction globale itemRating.
 */

async function simulateClass(opts = {}) {
  // ---------- RÉGLAGES ----------
  const SEEDS = opts.seeds || [1, 7, 13, 29, 101];
  const DAYS = opts.days || 14;
  const START = '2026-12-07T12:00:00Z';            // un lundi
  const PROFILE = opts.profile || { system: 'CH', grade: 11, track: 'college', minutes: 5 };
  const MIN_PER_ITEM = 0.6, MIN_PER_LESSON = 1.5, MIN_PER_ERROR = 0.8;
  const LEARN_OK = 6, LEARN_HELPED = 8, LEARN_FAIL = 10, LEARN_CAP = 120; // gain d'apprentissage par notion (points Elo)

  // Chaque élève :
  //   off  = niveau réel par rapport au Mathélo de départ (points)
  //   days = fonction (jourIndex, rnd) -> nombre de séances ce jour-là
  //   pDK  = probabilité de répondre « je ne sais pas »
  //   pEasy= probabilité d'appuyer sur « trop facile » (question passée, non comptée)
  //   quit = abandon de la séance après N erreurs d'affilée (null = jamais)
  const wk = (i) => i % 7; // 0 = lundi
  const STUDENTS = opts.students || [
    { n: 'Léa',   d: 'forte, régulière',               off: +250, days: () => 1,                          pDK: .02, pEasy: .10, quit: null },
    { n: 'Noah',  d: 'fort, 5 j/7, « trop facile »',    off: +200, days: (i) => (wk(i) < 5 ? 1 : 0),       pDK: .02, pEasy: .25, quit: null },
    { n: 'Emma',  d: 'moyenne, régulière',              off: 0,    days: (i, r) => (r() < .85 ? 1 : 0),    pDK: .05, pEasy: .05, quit: null },
    { n: 'Hugo',  d: 'moyen, irrégulier (50 %)',        off: -30,  days: (i, r) => (r() < .5 ? 1 : 0),     pDK: .08, pEasy: .03, quit: 3 },
    { n: 'Inès',  d: 'moyenne, décroche après j.6',     off: +20,  days: (i) => (i < 6 ? 1 : 0),           pDK: .05, pEasy: .05, quit: null },
    { n: 'Lucas', d: 'faible, régulier',                off: -250, days: (i, r) => (r() < .9 ? 1 : 0),     pDK: .10, pEasy: 0,   quit: null },
    { n: 'Chloé', d: 'faible, 4 j/14, abandonne vite',  off: -200, days: (i) => ([1, 4, 8, 11].includes(i) ? 1 : 0), pDK: .15, pEasy: 0, quit: 2 },
    { n: 'Tom',   d: 'moyen-fort, 3 séances/j × 3 j',   off: +120, days: (i) => (i < 3 ? 3 : 0),           pDK: .03, pEasy: .10, quit: null },
    { n: 'Sarah', d: 'lente, « je ne sais pas » 30 %',  off: -150, days: (i, r) => (r() < .75 ? 1 : 0),    pDK: .30, pEasy: 0,   quit: null },
    { n: 'Yanis', d: 'désengagé, 3 jours',              off: -50,  days: (i) => ([0, 2, 3].includes(i) ? 1 : 0), pDK: .40, pEasy: .30, quit: null },
  ];

  // ---------- HORLOGE SIMULÉE ----------
  const RealDate = window.__RD || Date; window.__RD = RealDate;
  let offset = 0;
  class FakeDate extends RealDate {
    constructor(...a) { if (a.length === 0) super(RealDate.now() + offset); else super(...a); }
    static now() { return RealDate.now() + offset; }
  }
  const t0 = new RealDate(START).getTime();
  const setDay = (i) => { offset = t0 + i * 864e5 - RealDate.now(); };

  // ---------- ALÉATOIRE REPRODUCTIBLE (mulberry32) ----------
  const makeRnd = (seed) => { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  const errors = {};
  const logErr = (k, e) => { const m = k + ': ' + ((e && e.message) || e); errors[m] = (errors[m] || 0) + 1; };
  const runs = [];

  window.Date = FakeDate;
  try {
    for (const seed of SEEDS) {
      const rnd = makeRnd(seed);
      const rows = [];
      for (const P of STUDENTS) {
        setDay(0);
        const st = Engine.newState(PROFILE);
        Engine.autoInit(st);
        const elo0 = st.elo.r, theta0 = elo0 + P.off, learn = {};
        const M = { sessions: 0, items: 0, ok1: 0, ok2: 0, fail: 0, dk: 0, easy: 0, lessons: 0, abandons: 0, jokers: 0, activeDays: 0, minutes: [] };

        for (let day = 0; day < DAYS; day++) {
          setDay(day);
          const n = P.days(day, rnd);
          let active = false;
          for (let k = 0; k < n; k++) {
            let plan;
            try { const fmt = Engine.todayFormat(st); plan = Engine.planSession(st, fmt); Engine.logFormat(st, fmt); }
            catch (e) { logErr('plan', e); continue; }

            let answered = 0, score = 0, items = 0, lessons = 0, wrong = 0, errsRow = 0, lessonShown = false, aborted = false;
            for (const slot of plan) {
              const parts = String(slot).split('|'), id = parts[0], level = parts[1] ? +parts[1] : undefined, ns = st.notions[id];
              if (!lessonShown && ns && Engine.lessonDue(st, id)) { ns.lessonSeen = true; lessonShown = true; lessons++; }
              let q;
              try { q = Engine.make(st, id, level, undefined, true); } catch (e) { logErr('make:' + id, e); continue; }
              if (!q) { logErr('make-null:' + id, 'null'); continue; }
              const d = q.d || level || 1;
              const r = rnd();
              let sc = 0;
              try {
                if (r < P.pDK) { sc = Engine.record(st, id, d, 1, false); M.dk++; items++; }
                else if (r < P.pDK + P.pEasy) { M.easy++; continue; }
                else {
                  items++;
                  const q0 = itemRating(st.profile, id, d), th = theta0 + (learn[id] || 0);
                  const p = 1 / (1 + Math.pow(10, (q0 - th) / 400));      // P(réussite 1er essai), formule d'Elo
                  if (rnd() < p)                  { sc = Engine.record(st, id, d, 1, true);  M.ok1++;  learn[id] = Math.min(LEARN_CAP, (learn[id] || 0) + LEARN_OK); }
                  else if (rnd() < .3 + .3 * p)   { sc = Engine.record(st, id, d, 2, true);  M.ok2++;  learn[id] = Math.min(LEARN_CAP, (learn[id] || 0) + LEARN_HELPED); }
                  else                            { sc = Engine.record(st, id, d, 3, false); M.fail++; learn[id] = Math.min(LEARN_CAP, (learn[id] || 0) + LEARN_FAIL); }
                }
                Engine.updateElo(st, id, d, sc);
              } catch (e) { logErr('record', e); }
              answered++; score += sc >= 1 ? 1 : 0;
              if (sc < 1) { wrong++; errsRow++; } else errsRow = 0;
              if (P.quit && errsRow >= P.quit) { aborted = true; break; }
            }
            if (answered > 0) {
              const j0 = st.streak.jokerWk;
              try { Engine.finishDay(st, answered, score); } catch (e) { logErr('finishDay', e); }
              if (st.streak.jokerWk !== j0) M.jokers++;
              active = true;
            }
            M.sessions++; M.items += items; M.lessons += lessons; if (aborted) M.abandons++;
            M.minutes.push(items * MIN_PER_ITEM + lessons * MIN_PER_LESSON + wrong * MIN_PER_ERROR);
          }
          if (active) M.activeDays++;
        }
        const ns = Object.values(st.notions);
        rows.push({
          n: P.n, d: P.d, dElo: st.elo.r - elo0, activeDays: M.activeDays, sessions: M.sessions, items: M.items,
          ok1: M.ok1, ok2: M.ok2, fail: M.fail, dk: M.dk, lessons: M.lessons, abandons: M.abandons,
          minAvg: M.minutes.length ? M.minutes.reduce((a, b) => a + b, 0) / M.minutes.length : 0,
          minMax: Math.max(0, ...M.minutes), streakBest: st.streak.best,
          seen: ns.filter((x) => x.seen > 0).length, box3: ns.filter((x) => x.box >= 3).length,
        });
      }
      runs.push(rows);
    }
  } finally {
    window.Date = RealDate; // toujours rétablir l'horloge
  }

  // ---------- AGRÉGATION ----------
  const avg = (f, name) => runs.reduce((s, r) => s + r.find((x) => x.n === name)[f], 0) / runs.length;
  const table = STUDENTS.map((P) => {
    const a = (f) => avg(f, P.n);
    const tot = a('ok1') + a('ok2') + a('fail') + a('dk');
    return {
      élève: P.n, profil: P.d,
      'jours actifs': +a('activeDays').toFixed(1),
      'réussite 1er essai %': Math.round(100 * a('ok1') / Math.max(1, tot)),
      'échecs+JNSP %': Math.round(100 * (a('fail') + a('dk')) / Math.max(1, tot)),
      'Δ Mathélo': Math.round(a('dElo')),
      'min/séance (moy)': +a('minAvg').toFixed(1),
      'leçons/séance': +(a('lessons') / Math.max(1, a('sessions'))).toFixed(2),
      'notions vues': Math.round(a('seen')),
      'notions boîte≥3': +a('box3').toFixed(1),
      'série max': +a('streakBest').toFixed(1),
      abandons: +a('abandons').toFixed(1),
    };
  });
  console.table(table);
  if (Object.keys(errors).length) console.warn('Erreurs rencontrées :', errors);
  return { table, errors, dateRestored: Date === RealDate };
}
