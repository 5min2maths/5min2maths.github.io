/* Élèves simulés (25.11, demande de l'auteur : « un robot très bon élève, un moyen, un en difficulté ; les robots
   arrivent-ils à ce niveau de finesse ? »).
   Chaque robot a un niveau propre (échelle du Mathélo), un niveau par notion qui progresse quand il réussit ou voit la
   correction et qui s'érode entre deux séances ; quand il se trompe, il donne de préférence une erreur typique du
   générateur (piège). Il suit le moteur réel (format du jour, plan de séance, leçon la première fois, « trop facile »,
   remédiation, Mathélo) de septembre à mi-décembre, à son rythme.
   Ce qu'on mesure : l'app s'adapte-t-elle à chacun ? (réussite visée ≈ 65–75 % pour tous, niveaux qui montent pour le
   bon élève, pas de longues séries d'échecs pour l'élève en difficulté, Mathélo qui retrouve le vrai niveau).
   Limite : le robot ne comprend pas les énoncés ; il teste les réactions de l'app, pas la clarté des explications.
   Paramètres : eleves.html#classes=11e,1re  ·  #semaines=8  ·  #graine=3 */
(function () {
  const H = decodeURIComponent(location.hash);
  const opt = (k, d) => ((new RegExp(k + "=([^&]+)").exec(H) || [])[1] || d);
  let seed = +opt("graine", 7);
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  Math.random = rnd; /* reproductible : même graine, même parcours */
  const CLASSES = { "9e": { system: "CH", grade: 9, track: "college" }, "10e": { system: "CH", grade: 10, track: "college" }, "11e": { system: "CH", grade: 11, track: "college" },
    "1re": { system: "CH", grade: 12, track: "college" }, "2e": { system: "CH", grade: 13, track: "college" }, "MP1": { system: "CH", grade: 12, track: "mp" }, "MP2": { system: "CH", grade: 13, track: "mp" } };
  const which = opt("classes", "9e,11e,1re,MP2").split(",").filter((c) => CLASSES[c]);
  const WEEKS = +opt("semaines", 14);
  /* Profils : écart au niveau de référence de la classe, jours d'entraînement par semaine, chance au 2e essai,
     propension à toucher « trop facile » quand c'est vraiment facile, vitesse d'apprentissage. */
  const PROFILS = {
    fort: { gap: 300, jours: 6, p2: 0.7, easy: 0.35, learn: 14 },
    moyen: { gap: 0, jours: 4, p2: 0.45, easy: 0.1, learn: 10 },
    difficulte: { gap: -280, jours: 3, p2: 0.25, easy: 0, learn: 8 },
  };
  const ref = (p) => { const r = ELO_REF.find(([g]) => g === p.grade); return r ? r[1] : 1300; };
  const P = (skill, item) => 1 / (1 + Math.pow(10, (item - skill) / 400));
  const wrongAnswer = (q) => {
    const T = (q.traps || []).filter((t) => t.v !== undefined || t.e || t.s);
    if (T.length && rnd() < 0.75) { const t = T[Math.floor(rnd() * T.length)]; return { a: t.v !== undefined ? String(t.v).replace(".", ",") : t.e || t.s.join(" ; "), typ: true }; }
    const w = q.spec && q.spec.kind === "value" ? q.spec.value : null;
    return { a: w === null ? "0" : String(w === 0 ? 3 : rnd() < 0.5 ? -w : w + 1).replace(".", ","), typ: false };
  };

  function simulate(cl, pname) {
    const pr = PROFILS[pname], prof = CLASSES[cl];
    OFF = new _D("2026-08-31T08:00:00") - _D.now();
    state = Engine.newState({ ...prof, minutes: 5 }); Engine.autoInit(state); state.placed = true;
    const A = ref(prof) + pr.gap, skill = {}, lastSeen = {};
    const sk = (id) => (skill[id] === undefined ? (skill[id] = A + (rnd() - 0.5) * 160) : skill[id]);
    const W = [], R = { q: 0, ok1: 0, lv: [0, 0, 0, 0, 0], frustr: 0, bored: 0, sessions: 0, lessons: 0, easy: 0, remed: 0, wrong: 0, typ: 0, diag: 0, err: [], notions: new Set(), maxFailRun: 0 };
    for (let w = 0; w < WEEKS; w++) {
      const wk = { q: 0, ok1: 0, lv: 0 };
      const days = [0, 1, 2, 3, 4, 5, 6].sort(() => rnd() - 0.5).slice(0, pr.jours).sort();
      for (let dd = 0; dd < 7; dd++) {
        OFF += 864e5;
        if (!days.includes(dd)) continue;
        const today = day();
        Engine.unlock(state);
        const fmt = Engine.todayFormat(state); let plan;
        try { plan = Engine.planSession(state, fmt); } catch (e) { R.err.push("plan " + e.message); continue; }
        Engine.logFormat(state, fmt);
        R.sessions++;
        let run = 0, sessOk = 0, sessN = 0, skips = 0, lessonShown = null, eased = false; const remedDone = new Set();
        for (let i = 0; i < plan.length; i++) {
          const parts = String(plan[i]).split("|"), id = parts[0], kind = parts[2]; let lv = +parts[1] || 1;
          const ns = state.notions[id];
          if (!ns) continue;
          if (LESSONS[id] && !ns.lessonSeen && (ns.status === "encours" || ns.m < 0.4)) { ns.lessonSeen = true; R.lessons++; lessonShown = id; skill[id] = sk(id) + 40; }
          if (lessonShown === id && !eased) { eased = true; lv = 1; }
          let q; try { q = Engine.make(state, id, lv); } catch (e) { R.err.push(id + "|" + lv + " " + e.message); continue; }
          if (!q || !q.q) { R.err.push(id + "|" + lv + " vide"); continue; }
          const d = q.d || lv;
          /* oubli : −3 points par jour sans pratique, au plus −90 */
          if (lastSeen[id]) skill[id] = sk(id) - Math.min(90, 3 * daysBetween(lastSeen[id], today));
          lastSeen[id] = today;
          const item = itemRating(state.profile, id, d), p1 = P(sk(id), item);
          if (p1 > 0.93 && skips < 3 && rnd() < pr.easy && d < 4) { skips++; R.easy++; Engine.tooEasy(state, id, d, kind); continue; }
          let tries = 1, solved = rnd() < p1;
          if (!solved) {
            R.wrong++;
            const wa = wrongAnswer(q); if (wa.typ) R.typ++;
            let dg = null; try { dg = diagnose(q, wa.a); } catch (e) {}
            if (dg) R.diag++;
            tries = 2; solved = rnd() < (dg ? pr.p2 + 0.15 : pr.p2);
          }
          const partial = q.parts ? (solved ? (tries === 1 ? 1 : 0.6) : 0.2) : undefined;
          const sc = Engine.record(state, id, d, tries, solved, partial);
          Engine.updateElo(state, id, d, sc);
          Engine.finishDay(state, 1, sc);
          skill[id] = sk(id) + (solved ? pr.learn * (tries === 1 ? 1 : 0.7) : pr.learn * 0.4);
          R.q++; wk.q++; sessN++; R.lv[d]++; wk.lv += d; R.notions.add(id);
          const ok1 = solved && tries === 1;
          if (ok1) { R.ok1++; wk.ok1++; sessOk++; run = 0; } else { run++; R.maxFailRun = Math.max(R.maxFailRun, run); }
          if (sc < 0.5 && !remedDone.has(id)) { const pq = Engine.remediation(state, id); if (pq) { remedDone.add(id); R.remed++; plan.splice(i + 1, 0, pq + "|1|rem"); } }
        }
        if (sessN >= 3 && sessOk === 0) R.frustr++;
        if (sessN >= 3 && run >= 3) R.frustr += 0; /* compté via sessOk */
        if (sessN >= 4 && sessOk === sessN && plan.every((x) => +String(x).split("|")[1] <= 1)) R.bored++;
      }
      W.push(wk);
    }
    const mastered = Object.values(state.notions).filter((s) => s.seen && s.m >= 0.75).length;
    return { cl, pname, A: Math.round(A), elo: state.elo.r, q: R.q, sessions: R.sessions, ok1: R.q ? R.ok1 / R.q : 0,
      okW: W.map((w) => (w.q ? Math.round((100 * w.ok1) / w.q) : null)), lvW: W.map((w) => (w.q ? +(w.lv / w.q).toFixed(1) : null)),
      lv: R.lv.slice(1), frustr: R.frustr, bored: R.bored, lessons: R.lessons, easy: R.easy, remed: R.remed,
      typ: R.wrong ? R.typ / R.wrong : 0, diag: R.wrong ? R.diag / R.wrong : 0, notions: R.notions.size, mastered, maxFailRun: R.maxFailRun, err: R.err.slice(0, 5) };
  }

  const res = [], fails = [], ok = (c, m) => { if (!c) fails.push(m); };
  try {
    for (const cl of which) {
      const r = {}; for (const p of Object.keys(PROFILS)) r[p] = simulate(cl, p);
      res.push(...Object.values(r));
      /* Contrôles de bon sens (pas des objectifs fins : le rapport donne le détail) */
      ok(r.fort.elo > r.moyen.elo && r.moyen.elo > r.difficulte.elo, cl + " : Mathélo final ordonné (" + [r.fort.elo, r.moyen.elo, r.difficulte.elo].join(" > ") + ")");
      for (const p of Object.values(r)) {
        ok(!p.err.length, cl + " " + p.pname + " : erreurs " + p.err.join(" ; "));
        ok(p.ok1 >= 0.45 && p.ok1 <= 0.92, cl + " " + p.pname + " : réussite au 1er essai hors de la zone utile : " + Math.round(p.ok1 * 100) + " %");
        ok(Math.abs(p.elo - p.A) < 350, cl + " " + p.pname + " : Mathélo " + p.elo + " loin du vrai niveau " + p.A);
      }
      ok(r.difficulte.frustr <= Math.max(2, r.difficulte.sessions * 0.15), cl + " élève en difficulté : " + r.difficulte.frustr + " séances sans aucune réussite sur " + r.difficulte.sessions);
      const avgLv = (p) => (p.lv[1] * 2 + p.lv[2] * 3 + p.lv[3] * 4 + p.lv[0]) / Math.max(1, p.q);
      ok(avgLv(r.fort) > avgLv(r.difficulte), cl + " : le bon élève reçoit des questions plus difficiles (" + avgLv(r.fort).toFixed(2) + " vs " + avgLv(r.difficulte).toFixed(2) + ")");
    }
  } catch (e) { fails.push("EXC " + e.message + " " + (e.stack || "").split("\n")[1]); }
  window.__eleves = res;
  const line = (p) => `${p.cl} ${p.pname}: Mathélo ${p.elo} (vrai ${p.A}) · ${p.q} q / ${p.sessions} séances · 1er essai ${Math.round(p.ok1 * 100)} % · niveaux ${p.lv.join("/")} · sans réussite ${p.frustr} · trop faciles ${p.bored} · leçons ${p.lessons} · remédiations ${p.remed} · erreurs typiques ${Math.round(p.typ * 100)} % (diagnostiquées ${Math.round(p.diag * 100)} %) · notions ${p.notions}, maîtrisées ${p.mastered} · pire série ${p.maxFailRun} · semaines ${p.okW.join(" ")}`;
  document.getElementById("out").textContent = (fails.length ? "ÉCHEC " + fails.join("\n") + "\n" : "ok élèves simulés\n") + res.map(line).join("\n") + "\n__JSON__" + JSON.stringify(res);
})();
