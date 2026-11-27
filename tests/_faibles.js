/* Agent « élèves faibles » (26.11, hors suite : préfixe _). Simulation de classe sur le vrai moteur, horloge simulée,
   déroulé de l'app (positionnement, une leçon au plus, question niveau 1 après la leçon, remédiation, question allégée
   après deux échecs de suite, « trop facile », « je ne sais pas », abandon de séance). Dérivé de tests/eleves.js.
   Chaque élève a SA graine (le hasard n'est pas partagé entre élèves, contrairement à _simulation_testeur.js).
   Variantes (#v=…, séparées par des virgules) : essais de solutions, appliqués dans la page seulement (src/ intact).
     finir    finir sur une réussite : dernière question remplacée par une question facile si la séance va mal
     echauf   échauffement : 1re question facile (notion la mieux maîtrisée, niveau 1) pour un élève sous sa classe
     ease1    question allégée dès le 1er échec (élève en grande difficulté), deux par séance au plus
     prereq   élève en grande difficulté : prérequis anciens des notions de l'année ouverts en rappel (règle de remobilisation)
     lecon    élève en grande difficulté : pas de nouvelle leçon deux séances de suite
     eloaide  perte de Mathélo divisée par 2 sur un échec, élève en grande difficulté (Mathélo seulement)
     place1   positionnement au niveau 1 (au lieu du niveau 2)
     bas      élève en grande difficulté : notions des deux années précédentes admises dans les créneaux ordinaires
     sansprim (27.11, agent primaire) automatismes de fin de primaire en 9e désactivés (PRIM.off) : mesure avant / après
     rejouer  élève en grande difficulté : après un raté (correction ou pas à pas vu), la question suivante prévue est
              remplacée par la même notion, autres nombres, un niveau en dessous (une fois par séance). Hypothèse
              d'exemple résolu : p devient p + (1 − p) × b (#b=0.3 ; b=0 : aucun effet propre)
   27.11 (règles appliquées dans src/) : la page suit Engine.replayNext et Engine.placementLevel quand ils existent ;
     norejouer  sans la règle « rejouer » de l'app ; place2  positionnement tout au niveau 2 (règle d'avant le 27.11)
   Colonnes du 27.11 : « hors année » = année antérieure sans reprise du référentiel (again) ; carnet fin = erreurs dans le
     carnet au bout des 28 jours (pas de séance « Carnet » simulée) ; effacées en séance = règle du 27.11 (grande difficulté).
   Modèle (#m=…) : learn2 = apprentissage deux fois plus rapide (≈ 0,1 logit par occasion, ordre de grandeur publié). */
(function () {
  const SEC = { lesson: 75, drill: 25, app: 50, rev: 50, rem: 50, defi: 70, p4: 150, err: 30, easy: 5, place: 55 };
  const CLASSES = { "9e": { system: "CH", grade: 9, track: "college" }, "10e": { system: "CH", grade: 10, track: "college" },
    "11e": { system: "CH", grade: 11, track: "college" }, "1re": { system: "CH", grade: 12, track: "college" } };
  /* gap : écart au Mathélo de DÉPART de la classe (Engine.newState) ; jour : probabilité de faire sa séance ; p2 : chance au
     2e essai ; dk : « je ne sais pas » ; easy : « trop facile » quand p > 0,93 ; learn : points gagnés par question réussie ;
     quit : abandon de la séance après 3 échecs de suite (probabilité). */
  const PROFILS = {
    fort: { gap: 250, jour: 6 / 7, p2: 0.7, dk: 0.02, easy: 0.3, learn: 12, quit: 0 },
    moyen: { gap: 0, jour: 0.85, p2: 0.45, dk: 0.05, easy: 0.05, learn: 10, quit: 0 },
    faible: { gap: -250, jour: 0.9, p2: 0.3, dk: 0.1, easy: 0, learn: 8, quit: 0.5 },
    tresfaible: { gap: -400, jour: 0.8, p2: 0.2, dk: 0.3, easy: 0, learn: 7, quit: 0.6 },
    irregulier: { gap: -60, jour: 0.45, p2: 0.4, dk: 0.08, easy: 0.03, learn: 10, quit: 0.5 },
  };
  const P = (skill, item) => 1 / (1 + Math.pow(10, (item - skill) / 400));
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };

  /* question facile pour l'élève : notion de l'année déjà travaillée, la plus maîtrisée, niveau 1 (hors programme du jour) */
  function easyPick(st, plan, drill) {
    const inPlan = new Set(plan.map((e) => String(e).split("|")[0]));
    const feel = (x) => itemRating(st.profile, x, 1) - 200 * (st.notions[x].m || 0);
    const c = Engine.eligible(st).filter((x) => !inPlan.has(x) && GEN[x] && Engine.isRecent(st, x) && st.notions[x].seen > 0 && !Engine.lessonFirst(st, x) && (!drill || Engine.drillable(st, x)))
      .sort((a, b) => feel(a) - feel(b))[0];
    return c ? c + "|1|" + (drill ? "drill" : "app") : null;
  }

  function simulate(cl, pname, o = {}) {
    const pr = { ...PROFILS[pname] }, prof = CLASSES[cl], DAYS = o.jours || 28, V = new Set(o.v || []), learnX = o.learn2 ? 2 : 1;
    seed = (o.graine || 7) * 7919 + pname.length * 31 + cl.length; for (let k = 0; k < 5; k++) rnd();
    Math.random = rnd;
    if (typeof PRIM !== "undefined") PRIM.off = V.has("sansprim");
    OFF = new _D(o.debut || "2026-11-09T16:30:00") - _D.now();
    /* variantes du moteur (copies restaurées en fin de simulation) */
    const E0 = { oldNeed: Engine.oldNeed, updateElo: Engine.updateElo, isRecent: Engine.isRecent }, B = o.b === undefined ? 0.3 : o.b;
    if (V.has("bas")) Engine.isRecent = function (s, id) { if (E0.isRecent.call(this, s, id)) return true; if (!this.struggling(s)) return false; const pl = placeOf(NOTIONS.find((n) => n.id === id), s.profile); return !!pl && pl[0] >= s.profile.grade - 2; };
    if (V.has("prereq")) Engine.oldNeed = function (s) { const need = E0.oldNeed.call(this, s); if (this.struggling(s)) { const el = this.eligible(s); for (const id of el) if (this.isRecent(s, id) && s.notions[id].seen > 0) for (const p of PREREQ[id] || []) if (el.includes(p) && !this.isRecent(s, p)) need.add(p); } return need; };
    if (V.has("eloaide")) Engine.updateElo = function (s, id, d, score, w = 1) { return E0.updateElo.call(this, s, id, d, score, score < 0.5 && this.struggling(s) ? w * 0.5 : w); };
    try {
      state = Engine.newState({ ...prof, minutes: 5 }); Engine.autoInit(state);
      const elo0 = state.elo.r, A = elo0 + pr.gap, skill = {}, lastSeen = {};
      const sk = (id) => (skill[id] === undefined ? (skill[id] = A + (rnd() - 0.5) * 160) : skill[id]);
      const R = { q: 0, ok1: 0, lvSum: 0, pSum: 0, sessions: 0, lessons: 0, frustr: 0, decour: 0, endFail: 0, startFail: 0, abandons: 0, old: 0, secs: [], dElo: [],
        eloNeg: 0, low: 0, prev: 0, fixed: 0, redo: 0, prim: 0, primOk: 0, primSess: 0, lastWk: [0, 0], err: [], placeQ: 0, placeSec: 0, placeElo: 0, eased: 0, remed: 0, maxDecourRun: 0 };
      /* positionnement (jour 0) : 5 questions de niveau 2, arrêt après 3 ratés */
      { const plan = Engine.placementPlan(state); let miss = 0, okN = 0; const e0 = state.elo.r, pd0 = V.has("place1") ? 1 : Math.min(2, difficultyCap(state.profile));
        for (const [pi, id] of plan.entries()) { if (miss >= 3) break; const pd = Engine.placementLevel && !V.has("place2") && !V.has("place1") ? Engine.placementLevel(state, pi) : pd0; let q; try { q = Engine.make(state, id, pd); } catch (e) { R.err.push("place " + id); continue; }
          const p = P(sk(id), itemRating(state.profile, id, q.d || 2)), dk = rnd() < pr.dk, ok = !dk && rnd() < p;
          Engine.placementResult(state, id, ok ? true : dk ? null : false, q.d || pd); if (!ok) miss++; else okN++; if (R.placeQ === 0) R.place1st = ok ? 1 : 0; R.placeQ++; R.placeSec += SEC.place + (ok ? 0 : 20); }
        state.placeMiss = miss; state.placed = true; state.placedOn = day(); Engine.snapPlaced(state); R.placeElo = state.elo.r - e0; R.placeOk = okN; }
      let lessonPrev = false, decourRun = 0; const carnet = new Set();
      for (let dd = 0; dd < DAYS; dd++) {
        if (dd > 0) { OFF += 864e5; if (rnd() >= pr.jour) continue; }
        const today = day(); Engine.unlock(state);
        const fmt = Engine.todayFormat(state); let plan;
        try { plan = Engine.planSession(state, fmt); } catch (e) { R.err.push("plan " + e.message); continue; }
        Engine.logFormat(state, fmt);
        const strug = Engine.struggling(state), below = strug || Engine.belowClass(state);
        /* variante « lecon » : élève en grande difficulté, une leçon la veille → pas de nouvelle leçon aujourd'hui */
        if (V.has("lecon") && strug && lessonPrev) plan.noLesson = true;
        /* variante « echauf » : 1re question facile (si elle ne porte pas la leçon) */
        if (V.has("echauf") && below && plan.length >= 3) { const id0 = String(plan[0]).split("|")[0]; if (!Engine.lessonDue(state, id0)) { const e = easyPick(state, plan, fmt === "auto"); if (e) plan[0] = e; } }
        R.sessions++;
        const S = { plan, i: 0, lessonAt: fmt === "auto" || plan.noLesson ? null : (plan.length && Engine.lessonDue(state, String(plan[0]).split("|")[0]) ? 0 : null), lessonDone: false, remed: new Set(), skips: 0, failRun: 0, easeN: 0 };
        let boostAt = -1, redoUsed = false;
        let sessOk = 0, sessN = 0, secs = 0, lessonShown = null, eased = false, drillSwap = 0, lastOk = null, firstOk = null, finished = false;
        const eS = state.elo.r;
        while (S.i < S.plan.length) {
          /* variante « finir » : avant la dernière question, si la séance va mal (moins de la moitié juste, ou dernier raté) */
          if (V.has("finir") && !finished && S.i === S.plan.length - 1 && sessN >= 2 && (sessOk / sessN < 0.5 || lastOk === false)) { finished = true; const e = easyPick(state, S.plan.slice(0, S.i), fmt === "auto"); if (e) S.plan[S.i] = e; }
          const parts = String(S.plan[S.i]).split("|"), id = parts[0], kind = parts[2]; const lv = +parts[1] || undefined, ns = state.notions[id];
          if (!ns) { S.i++; continue; }
          const due = fmt !== "auto" && !plan.noLesson && Engine.lessonDue(state, id);
          if (due && !S.lessonDone && (S.lessonAt == null || S.lessonAt === S.i)) { ns.lessonSeen = true; S.lessonDone = true; S.lessonAt = S.i; R.lessons++; lessonShown = id; skill[id] = sk(id) + 40 * learnX; secs += SEC.lesson; }
          else if (due && S.lessonDone && Engine.lessonFirst(state, id) && !ns.seen) { const sw = Engine.swapLesson(state, S.plan, S.i); if (sw) { S.plan[S.i] = sw; continue; } }
          const easyNow = lessonShown === id && !eased; if (easyNow) eased = true;
          let q; try { q = Engine.make(state, id, easyNow ? 1 : lv, undefined, true); } catch (e) { R.err.push(id + "|" + lv + " " + e.message); S.i++; continue; }
          if (!q || !q.q) { R.err.push(id + "|" + lv + " vide"); S.i++; continue; }
          if (kind === "drill" && !Engine.isDrill(q)) {
            const q2 = Engine.makeDrill(state, id);
            if (q2) q = q2;
            else if (++drillSwap <= 8) { const ex = new Set([...S.plan.map((e) => String(e).split("|")[0]), id]), sw = Engine.planSlots(state, ["drill"], { exclude: ex })[0]; if (sw) { S.plan[S.i] = sw; continue; } }
          }
          const d = q.d || lv || 1;
          if (lastSeen[id] && lastSeen[id] !== today) skill[id] = sk(id) - Math.min(90, 3 * daysBetween(lastSeen[id], today));
          lastSeen[id] = today;
          const item = itemRating(state.profile, id, d); let p1 = P(sk(id), item);
          if (boostAt === S.i) p1 = p1 + (1 - p1) * B;
          if (p1 > 0.93 && S.skips < 3 && rnd() < pr.easy && d < 4) {
            S.skips++; secs += SEC.easy; const r = Engine.tooEasy(state, id, d, kind);
            if (r.next) S.plan[S.i] = r.next; else S.i++; continue;
          }
          const dk = rnd() < pr.dk * (1 - p1 * 0.7);
          let tries = 1, solved = !dk && rnd() < p1;
          if (!solved && !dk) { tries = 2; solved = rnd() < pr.p2; }
          const partial = q.parts ? (solved ? (tries === 1 ? 1 : 0.6) : 0.2) : undefined;
          const sc = Engine.record(state, id, d, tries, solved, partial);
          const ok1 = solved && tries === 1;
          S.failRun = ok1 ? 0 : S.failRun + 1;
          /* 27.11 : règle de l'app (Engine.replayNext, src/app.js onDone) si elle existe ; sinon la variante « rejouer » */
          const rp = Engine.replayNext && !V.has("norejouer") && !redoUsed && fmt !== "auto" && !q.parts && !ok1 ? Engine.replayNext(state, S.plan, S.i, id, d, kind) : null;
          if (rp) { redoUsed = true; boostAt = S.i + 1; S.plan[S.i + 1] = rp; R.redo++; }
          /* carnet (27.11) : une entrée par notion et niveau ratés ; règle de l'app : élève en grande difficulté, réussite du
             premier coup en séance = erreurs de la notion (niveau ≤ d) effacées (carnetSessionOk) ; pas de séance « carnet » simulée */
          if (!solved && !q.parts && d <= 3) carnet.add(id + "|" + d);
          else if (ok1 && !q.parts && typeof carnetSessionOk === "function" && Engine.struggling(state)) for (const k of [...carnet]) { const [ci, cd] = k.split("|"); if (ci === id && +cd <= d) { carnet.delete(k); R.fixed++; } }
          if (!rp && sc < 0.5) { const pq = !S.remed.has(id) && S.i + 1 < S.plan.length && Engine.remediation(state, id); if (pq) { S.remed.add(id); S.plan[S.i + 1] = pq + "|1|rem"; R.remed++; } }
          const easeMax = V.has("ease1") && strug ? 2 : 1, easeAt = V.has("ease1") && strug ? 1 : 2;
          if (!rp && S.easeN < easeMax && S.failRun >= easeAt && S.i + 1 < S.plan.length) { const e2 = Engine.easeNext(state, S.plan, S.i, id, d); if (e2) { S.plan[S.i + 1] = e2; S.easeN++; R.eased++; } }
          if (!Engine.replayNext && V.has("rejouer") && !ok1 && !redoUsed && strug && S.i + 1 < S.plan.length && kind !== "drill" && d < 4) { redoUsed = true; boostAt = S.i + 1; S.plan[S.i + 1] = id + "|" + Math.max(1, d - 1) + "|" + (kind === "rem" ? "app" : kind); R.redo++; }
          Engine.updateElo(state, id, d, sc, dk ? 0.4 : 1);
          Engine.finishDay(state, 1, sc);
          skill[id] = sk(id) + learnX * (solved ? pr.learn * (tries === 1 ? 1 : 0.7) : pr.learn * 0.4);
          R.q++; sessN++; R.lvSum += d; R.pSum += p1;
          if (!Engine.isRecent(state, id)) R.old++;
          if (typeof PRIM !== "undefined" && PRIM.isPrim(id)) { R.prim++; if (ok1) R.primOk++; }
          { const nn = NOTIONS.find((n) => n.id === id), pl = placeOf(nn, state.profile); if (pl && pl[0] < state.profile.grade) { R.low++; if (!(nn.again || []).includes(state.profile.grade)) R.prev++; } }
          if (dd >= DAYS - 7) { R.lastWk[0]++; if (ok1) R.lastWk[1]++; }
          secs += d === 4 ? SEC.p4 : SEC[kind] || SEC.app; if (!ok1) secs += SEC.err;
          if (ok1) { R.ok1++; sessOk++; }
          if (firstOk === null) firstOk = ok1; lastOk = ok1;
          S.i++;
          if (pr.quit && S.failRun >= 3 && S.i < S.plan.length && rnd() < pr.quit) { R.abandons++; break; }
        }
        lessonPrev = S.lessonDone;
        const de = state.elo.r - eS; R.dElo.push(de); if (de < 0) R.eloNeg++;
        if (sessN >= 2 && sessOk === 0) R.frustr++;
        if (typeof PRIM !== "undefined" && S.plan.some((e) => PRIM.isPrim(e))) R.primSess++;
        /* séance décourageante : moins d'un tiers juste du premier coup, ou plus de 6 minutes */
        const bad = (sessN >= 2 && sessOk / sessN < 1 / 3) || secs > 360; if (bad) { R.decour++; decourRun++; R.maxDecourRun = Math.max(R.maxDecourRun, decourRun); } else decourRun = 0;
        if (lastOk === false) R.endFail++; if (firstOk === false) R.startFail++;
        R.secs.push(secs);
      }
      return { cl, pname, A: Math.round(A), elo0, elo: state.elo.r, q: R.q, sessions: R.sessions, ok1: R.q ? R.ok1 / R.q : 0, ok1last: R.lastWk[0] ? R.lastWk[1] / R.lastWk[0] : null,
        pAvg: R.q ? R.pSum / R.q : 0, lvAvg: R.q ? R.lvSum / R.q : 0, frustr: R.frustr, decour: R.decour, maxDecourRun: R.maxDecourRun, endFail: R.endFail, startFail: R.startFail,
        abandons: R.abandons, low: R.low, prev: R.prev, fixed: R.fixed, carnetFin: carnet.size, redo: R.redo, lessons: R.lessons, old: R.old, eased: R.eased, remed: R.remed, eloNeg: R.eloNeg, placeElo: R.placeElo, place1st: R.place1st || 0, placeOk: R.placeOk, placeQ: R.placeQ, placeSec: R.placeSec,
        secAvg: R.secs.length ? R.secs.reduce((a, b) => a + b, 0) / R.secs.length : 0, secMax: Math.max(0, ...R.secs), prim: R.prim, primOk: R.primOk, primSess: R.primSess, streak: state.streak.best || 0, err: R.err.slice(0, 3) };
    } finally { Engine.oldNeed = E0.oldNeed; Engine.updateElo = E0.updateElo; Engine.isRecent = E0.isRecent; }
  }
  /* moyenne sur les graines */
  function avg(cl, pname, o, seeds) {
    const rs = seeds.map((g) => simulate(cl, pname, { ...o, graine: g })), m = (f) => rs.reduce((s, r) => s + (r[f] || 0), 0) / rs.length;
    const S = m("sessions") || 1;
    return { cl, pname, ok1: m("ok1"), ok1last: m("ok1last"), pAvg: m("pAvg"), lvAvg: m("lvAvg"), dElo: m("elo") - m("elo0"), placeElo: m("placeElo"), place1st: m("place1st"), placeOk: m("placeOk"), placeQ: m("placeQ"), gapVrai: m("A") - m("elo"),
      secAvg: m("secAvg"), secMax: Math.max(...rs.map((r) => r.secMax)), sessions: m("sessions"), q: m("q"), abandons: m("abandons") / S, frustr: m("frustr") / S, decour: m("decour") / S,
      endFail: m("endFail") / S, startFail: m("startFail") / S, lessons: m("lessons") / S, old: m("old") / Math.max(1, m("q")), eased: m("eased") / S, eloNeg: m("eloNeg") / S, low: m("low") / Math.max(1, m("q")), prev: m("prev") / Math.max(1, m("q")), fixed: m("fixed"), carnetFin: m("carnetFin"), redo: m("redo") / S, streak: m("streak"),
      maxDecourRun: m("maxDecourRun"), prim: m("prim") / Math.max(1, m("q")), primOk: m("primOk") / Math.max(1e-9, m("prim")), primSess: m("primSess") / S, err: rs.flatMap((r) => r.err).slice(0, 3) };
  }
  const pc = (x) => (x === null || isNaN(x) ? "–" : Math.round(x * 100) + "%");
  const line = (a) => [a.cl, a.pname, pc(a.ok1), pc(a.ok1last), pc(a.pAvg), a.lvAvg.toFixed(2), Math.round(a.dElo), Math.round(a.placeElo), Math.round(a.gapVrai), Math.round(a.secAvg), a.secMax,
    pc(a.abandons), pc(a.frustr), pc(a.decour), a.maxDecourRun.toFixed(1), pc(a.endFail), pc(a.startFail), a.lessons.toFixed(2), pc(a.old), pc(a.low), pc(a.prev), a.redo.toFixed(2), a.carnetFin.toFixed(1), a.fixed.toFixed(1), pc(a.eloNeg), pc(a.place1st), a.placeOk.toFixed(1) + "/" + a.placeQ.toFixed(1), a.streak.toFixed(1), a.sessions.toFixed(1), pc(a.prim), a.prim ? pc(a.primOk) : "–", pc(a.primSess)].join(" | ") + (a.err.length ? " ERR " + a.err.join(";") : "");
  const HEAD = "classe | profil | 1er essai | dern. sem. | p prévu | niveau moy. | Δ Mathélo | Δ positionnement | vrai−Mathélo fin | s/séance | s max | abandons | sans réussite | décourageantes | pire suite décour. | fin sur échec | début sur échec | leçons/séance | anciennes | année inf. | hors année (sans reprise) | rejouées/séance | carnet fin | effacées en séance | séances Mathélo<0 | posit. 1re juste | posit. justes | série max | séances | part prim. | prim. 1er essai | séances avec prim.";
  window.SimFaibles = { simulate, avg, line, HEAD, PROFILS, CLASSES };
})();
