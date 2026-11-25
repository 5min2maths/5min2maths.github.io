/* Élèves simulés (25.11, demande de l'auteur : « un robot très bon élève, un moyen, un en difficulté ; les robots
   arrivent-ils à ce niveau de finesse ? »). Remis en état le 26.11 (adaptivité, tools/adaptivite_26-11.md) : déroulé
   actuel des séances (une leçon au plus, en tête ; pas de leçon en automatismes ; automatismes = vrais automatismes),
   profils du testeur (faible régulier, lent qui dit « je ne sais pas », moyen régulier, irrégulier), chapitre « en
   classe » fixé ou non, abandons, durée estimée, points de l'année.
   Chaque robot a un niveau propre (échelle du Mathélo), un niveau par notion qui progresse quand il réussit ou voit la
   correction et qui s'érode entre deux séances ; quand il se trompe, il donne de préférence une erreur typique du
   générateur (piège). Il suit le moteur réel jour après jour (horloge simulée), de septembre à décembre.
   Limite : le robot ne comprend pas les énoncés ; il teste les réactions de l'app, pas la clarté des explications.
   Utilisé par tests/eleves.html (rapport long, hors suite), tests/adaptivite.html (garde-fou rapide, dans la suite)
   et tests/_adapt_mesure.html (tableaux du rapport). Paramètres d'eleves.html : #classes=11e,1re · #semaines=8 · #graine=3 */
(function () {
  const H = decodeURIComponent(location.hash);
  const opt = (k, d) => ((new RegExp(k + "=([^&]+)").exec(H) || [])[1] || d);
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  Math.random = rnd; /* reproductible : même graine, même parcours */
  const CLASSES = { "9e": { system: "CH", grade: 9, track: "college" }, "10e": { system: "CH", grade: 10, track: "college" }, "11e": { system: "CH", grade: 11, track: "college" },
    "1re": { system: "CH", grade: 12, track: "college" }, "2e": { system: "CH", grade: 13, track: "college" }, "MP1": { system: "CH", grade: 12, track: "mp" }, "MP2": { system: "CH", grade: 13, track: "mp" } };
  /* Profils : écart au niveau de référence de la classe (fin d'année, ELO_REF), probabilité de faire sa séance un jour
     donné, chance au 2e essai, « je ne sais pas » (dk), « trop facile » quand c'est vraiment facile (easy), vitesse
     d'apprentissage (learn), abandon après 3 échecs de suite (quit = probabilité). */
  const PROFILS = {
    fort: { gap: 300, jour: 6 / 7, p2: 0.7, dk: 0.02, easy: 0.35, learn: 14, quit: 0 },
    moyen: { gap: 0, jour: 4 / 7, p2: 0.45, dk: 0.05, easy: 0.1, learn: 10, quit: 0 },
    difficulte: { gap: -280, jour: 3 / 7, p2: 0.25, dk: 0.1, easy: 0, learn: 8, quit: 0.5 },
    faible_regulier: { gap: -250, jour: 0.9, p2: 0.3, dk: 0.1, easy: 0, learn: 8, quit: 0.5 },
    lent_jnsp: { gap: -150, jour: 0.75, p2: 0.35, dk: 0.3, easy: 0, learn: 8, quit: 0.3 },
    moyen_regulier: { gap: 0, jour: 0.85, p2: 0.45, dk: 0.05, easy: 0.05, learn: 10, quit: 0 },
    irregulier: { gap: -30, jour: 0.5, p2: 0.4, dk: 0.08, easy: 0.03, learn: 10, quit: 0.5 },
  };
  /* Durée estimée (secondes) : leçon 75, automatisme 25, application / révision / base 50, défi 70, problème (niveau 4)
     150, +30 par erreur (2e essai, correction), « trop facile » 5. */
  const SEC = { lesson: 75, drill: 25, app: 50, rev: 50, rem: 50, defi: 70, p4: 150, err: 30, easy: 5 };
  const ref = (p) => { const r = ELO_REF.find(([g]) => g === p.grade); return r ? r[1] : 1300; };
  const P = (skill, item) => 1 / (1 + Math.pow(10, (item - skill) / 400));
  const wrongAnswer = (q) => {
    const T = (q.traps || []).filter((t) => t.v !== undefined || t.e || t.s);
    if (T.length && rnd() < 0.75) { const t = T[Math.floor(rnd() * T.length)]; return { a: t.v !== undefined ? String(t.v).replace(".", ",") : t.e || t.s.join(" ; "), typ: true }; }
    const w = q.spec && q.spec.kind === "value" ? q.spec.value : null;
    return { a: w === null ? "0" : String(w === 0 ? 3 : rnd() < 0.5 ? -w : w + 1).replace(".", ","), typ: false };
  };

  /* cl : classe ; pname : profil ; o : { semaines, classe (chapitre « en classe » fixé), graine, debut } */
  function simulate(cl, pname, o = {}) {
    const pr = PROFILS[pname], prof = CLASSES[cl], WEEKS = o.semaines || 14, withNow = !!o.classe;
    seed = o.graine || 7;
    OFF = new _D(o.debut || "2026-08-31T08:00:00") - _D.now();
    state = Engine.newState({ ...prof, minutes: 5 }); Engine.autoInit(state); state.placed = true;
    const elo0 = state.elo.r, A = ref(prof) + pr.gap, skill = {}, lastSeen = {};
    const sk = (id) => (skill[id] === undefined ? (skill[id] = A + (rnd() - 0.5) * 160) : skill[id]);
    const R = { q: 0, ok1: 0, lv: [0, 0, 0, 0, 0], frustr: 0, sessions: 0, lessons: 0, easy: 0, remed: 0, eased: 0, old: 0, dk: 0, abandons: 0,
      err: [], perNotion: {}, maxFailRun: 0, secs: [], nowHits: 0, nowSlotsWeeks: 0, okW: [], firstHalf: [0, 0], lastHalf: [0, 0] };
    let nowIds = [];
    for (let w = 0; w < WEEKS; w++) {
      const wk = { q: 0, ok1: 0 };
      if (withNow) { Engine.unlock(state); nowIds = Engine.nowSuggest(state, 3); Engine.setNow(state, nowIds); R.nowSlotsWeeks += nowIds.length; }
      for (let dd = 0; dd < 7; dd++) {
        OFF += 864e5;
        if (rnd() >= pr.jour) continue;
        const today = day();
        Engine.unlock(state);
        const fmt = Engine.todayFormat(state); let plan;
        try { plan = Engine.planSession(state, fmt); } catch (e) { R.err.push("plan " + e.message); continue; }
        Engine.logFormat(state, fmt);
        if (o.trace) o.trace.push(today + " " + fmt + " [" + nowIds.join(",") + "] " + plan.join(","));
        R.sessions++;
        /* déroulé de l'app (nextQuestion / onDone) */
        const S = { fmt, plan, i: 0, lessonAt: fmt === "auto" ? null : (plan.length && Engine.lessonDue(state, String(plan[0]).split("|")[0]) ? 0 : null), lessonDone: false, remed: new Set(), skips: 0, failRun: 0 };
        let sessOk = 0, sessN = 0, secs = 0, lessonShown = null, eased = false, drillSwap = 0, answered = 0;
        while (S.i < S.plan.length) {
          const parts = String(S.plan[S.i]).split("|"), id = parts[0], kind = parts[2]; let lv = +parts[1] || undefined;
          const ns = state.notions[id];
          if (!ns) { S.i++; continue; }
          const due = fmt !== "auto" && Engine.lessonDue(state, id);
          if (due && !S.lessonDone && (S.lessonAt == null || S.lessonAt === S.i)) { ns.lessonSeen = true; S.lessonDone = true; S.lessonAt = S.i; R.lessons++; lessonShown = id; skill[id] = sk(id) + 40; secs += SEC.lesson; }
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
          /* oubli : −3 points par jour sans pratique, au plus −90 */
          if (lastSeen[id] && lastSeen[id] !== today) skill[id] = sk(id) - Math.min(90, 3 * daysBetween(lastSeen[id], today));
          lastSeen[id] = today;
          const item = itemRating(state.profile, id, d), p1 = P(sk(id), item);
          if (p1 > 0.93 && S.skips < 3 && rnd() < pr.easy && d < 4) {
            S.skips++; R.easy++; secs += SEC.easy;
            const r = Engine.tooEasy(state, id, d, kind);
            if (r.next) S.plan[S.i] = r.next; else S.i++;
            continue;
          }
          const dk = rnd() < pr.dk * (1 - p1 * 0.7);
          let tries = 1, solved = !dk && rnd() < p1;
          if (!solved && !dk) {
            const wa = wrongAnswer(q); let dg = null; try { dg = diagnose(q, wa.a); } catch (e) {}
            tries = 2; solved = rnd() < (dg ? pr.p2 + 0.15 : pr.p2);
          }
          if (dk) R.dk++;
          const partial = q.parts ? (solved ? (tries === 1 ? 1 : 0.6) : 0.2) : undefined;
          const sc = Engine.record(state, id, d, tries, solved, partial);
          /* app.js onDone : base à consolider après deux échecs sur la notion, puis question plus facile après deux échecs de suite */
          const ok1 = solved && tries === 1;
          S.failRun = ok1 ? 0 : S.failRun + 1;
          if (sc < 0.5) { const pq = !S.remed.has(id) && S.i + 1 < S.plan.length && Engine.remediation(state, id); if (pq) { S.remed.add(id); S.plan[S.i + 1] = pq + "|1|rem"; R.remed++; } }
          if (Engine.easeNext && S.failRun >= 2 && S.i + 1 < S.plan.length) { const e2 = Engine.easeNext(state, S.plan, S.i, id, d); if (e2) { S.plan[S.i + 1] = e2; R.eased++; } }
          Engine.updateElo(state, id, d, sc, dk ? 0.4 : 1);
          Engine.finishDay(state, 1, sc);
          if (typeof ypAdd === "function") ypAdd(state, ypPoints(d, { solved, tries, partial }, false));
          skill[id] = sk(id) + (solved ? pr.learn * (tries === 1 ? 1 : 0.7) : pr.learn * 0.4);
          R.q++; wk.q++; sessN++; answered++; R.lv[d]++; R.perNotion[id] = (R.perNotion[id] || 0) + 1;
          if (!Engine.isRecent(state, id)) R.old++;
          if (nowIds.includes(id)) R.nowHits++;
          secs += d === 4 ? SEC.p4 : SEC[kind] || SEC.app; if (!ok1) secs += SEC.err;
          const half = w < WEEKS / 2 ? R.firstHalf : R.lastHalf; half[0]++; if (ok1) half[1]++;
          if (ok1) { R.ok1++; wk.ok1++; sessOk++; } else R.maxFailRun = Math.max(R.maxFailRun, S.failRun);
          S.i++;
          /* abandon : après 3 échecs de suite, avec une probabilité propre au profil */
          if (pr.quit && S.failRun >= 3 && S.i < S.plan.length && rnd() < pr.quit) { R.abandons++; break; }
        }
        if (typeof ypAdd === "function" && answered >= Math.min(3, S.plan.length)) ypAdd(state, YP.session, "s");
        if (sessN >= 2 && sessOk === 0) R.frustr++;
        R.secs.push(secs);
      }
      R.okW.push(wk.q ? Math.round((100 * wk.ok1) / wk.q) : null);
    }
    const N = Object.values(state.notions), pn = Object.values(R.perNotion);
    return { cl, pname: pname + (withNow ? "+classe" : ""), A: Math.round(A), elo0, elo: state.elo.r, q: R.q, sessions: R.sessions, ok1: R.q ? R.ok1 / R.q : 0,
      ok1a: R.firstHalf[0] ? R.firstHalf[1] / R.firstHalf[0] : 0, ok1b: R.lastHalf[0] ? R.lastHalf[1] / R.lastHalf[0] : 0,
      lv: R.lv.slice(1), hi: R.q ? (R.lv[3] + R.lv[4]) / R.q : 0, frustr: R.frustr, abandons: R.abandons, lessons: R.lessons, easy: R.easy, remed: R.remed, eased: R.eased, old: R.old, dk: R.dk,
      secAvg: R.secs.length ? Math.round(R.secs.reduce((a, b) => a + b, 0) / R.secs.length) : 0, secMax: Math.max(0, ...R.secs),
      notions: pn.length, qPerNotion: pn.length ? R.q / pn.length : 0, box3: N.filter((s) => s.box >= 3).length,
      nowPerWeek: withNow && R.nowSlotsWeeks ? R.nowHits / R.nowSlotsWeeks : null,
      pts: state.yp ? state.yp.pts : 0, maxFailRun: R.maxFailRun, okW: R.okW, err: R.err.slice(0, 5) };
  }
  const pc = (x) => Math.round(x * 100) + " %";
  const line = (p) => `${p.cl} ${p.pname}: 1er essai ${pc(p.ok1)} (${pc(p.ok1a)} → ${pc(p.ok1b)}) · sans réussite ${p.frustr}/${p.sessions} · abandons ${p.abandons} · durée ${p.secAvg} s (max ${p.secMax}) · q/notion ${p.qPerNotion.toFixed(1)} · boîte≥3 ${p.box3} · Mathélo ${p.elo0}→${p.elo} (vrai ${p.A}) · points ${p.pts} · niv. 3–4 ${pc(p.hi)} · anciennes ${p.old} · allégées ${p.eased} · bases ${p.remed}${p.nowPerWeek !== null ? " · en classe " + p.nowPerWeek.toFixed(1) + "/sem." : ""} · pire série ${p.maxFailRun}`;
  window.SimEleves = { simulate, PROFILS, CLASSES, line };
  if (window.SIM_NO_AUTO) return;

  /* Rapport long (tests/eleves.html, hors suite) */
  const which = opt("classes", "9e,11e,1re,MP2").split(",").filter((c) => CLASSES[c]);
  const WEEKS = +opt("semaines", 14), G = +opt("graine", 7);
  const res = [], fails = [], ok = (c, m) => { if (!c) fails.push(m); };
  try {
    for (const cl of which) {
      const r = {}; for (const p of ["fort", "moyen", "difficulte"]) r[p] = simulate(cl, p, { semaines: WEEKS, graine: G });
      res.push(...Object.values(r));
      ok(r.fort.elo > r.moyen.elo && r.moyen.elo > r.difficulte.elo, cl + " : Mathélo final ordonné (" + [r.fort.elo, r.moyen.elo, r.difficulte.elo].join(" > ") + ")");
      for (const p of Object.values(r)) {
        ok(!p.err.length, cl + " " + p.pname + " : erreurs " + p.err.join(" ; "));
        ok(p.ok1 >= 0.45 && p.ok1 <= 0.92, cl + " " + p.pname + " : réussite au 1er essai hors de la zone utile : " + pc(p.ok1));
      }
      ok(r.difficulte.frustr <= Math.max(2, r.difficulte.sessions * 0.15), cl + " élève en difficulté : " + r.difficulte.frustr + " séances sans aucune réussite sur " + r.difficulte.sessions);
      ok(r.fort.hi > r.difficulte.hi, cl + " : le bon élève reçoit des questions plus difficiles");
    }
  } catch (e) { fails.push("EXC " + e.message + " " + (e.stack || "").split("\n")[1]); }
  window.__eleves = res;
  document.getElementById("out").textContent = (fails.length ? "ÉCHEC " + fails.join("\n") + "\n" : "ok élèves simulés\n") + res.map(line).join("\n") + "\n__JSON__" + JSON.stringify(res);
})();
