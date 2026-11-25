// Code de sauvegarde (13.11) : toute la progression dans un code (texte, lien, QR), sans serveur ni compte.
// Format compact : seules les notions modifiées, dates en jours relatifs, puis compression (deflate) et base64url.
const Backup = {
  ST: { vu: "v", encours: "e", avenir: "a", nonvu: "n" },
  pack(s) {
    const t = day(), off = (d) => (d ? daysBetween(t, d) : null), r2 = (x) => Math.round(x * 100) / 100;
    const n = {}, defs = Object.fromEntries(Engine.catalog(s.profile).map((c) => [c.id, c.defaultStatus]));
    for (const [id, x] of Object.entries(s.notions || {})) {
      const def = Engine.newNotion(x.status);
      if (!x.seen && !x.placed && !x.lessonSeen && !x.easy && !x.retry && x.m === def.m && x.box === def.box) { if (x.status !== defs[id]) n[id] = [this.ST[x.status]]; continue; }
      n[id] = [this.ST[x.status] || "v", r2(x.m), x.box, off(x.due), x.seen, x.ok, (x.placed ? 1 : 0) | (x.lessonSeen ? 2 : 0), x.easy || 0, off(x.retry), x.fails ?? null];
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
      // 24.11 (facultatif, codes plus anciens sans) : point de départ de « Ma semaine » (premier instantané des 7 jours)
      // et dates des erreurs effacées du carnet.
      ...(ws ? { w: [off(ws.d), ws.c || {}, ws.k || []] } : {}), ...(co.length ? { co: co.map(off) } : {}),
      /* 24.11 (espace parent, src/parents.js) : carnet d'erreurs (codes exacts des questions ; erreur repérée et réponse
         pour les 8 plus récentes seulement, pour garder un code court) et identifiant d'enfant (aléatoire, sert à
         reconnaître le même enfant quand le parent reçoit un nouveau code). */
      ...(Array.isArray(s.carnet) && s.carnet.length ? { cn: s.carnet.map((x, i, A) => [x.id, x.d, x.code, off(x.date), x.ok || 0].concat(i >= A.length - 8 && x.m ? [x.m, x.a || ""] : [])) } : {}),
      ...(s.pid ? { pid: s.pid } : {}),
      /* 25.11 (grades de l'année, facultatif) : points de l'année, classe, années passées (souvenirs). */
      ...(s.yp ? { yp: [s.yp.k, s.yp.c, s.yp.pts, (s.yp.past || []).map((x) => [x.k, x.c, x.p])].concat(s.yp.d || s.yp.wk ? [off(s.yp.d), s.yp.dp || 0, s.yp.ds || 0, s.yp.wk || null] : []) } : {}),
      /* 26.11 (stockage durable, champs facultatifs : les anciens codes restent lisibles) : plafond du jour et problème de
         la semaine déjà comptés (yp, ci-dessus : sinon une reprise le même jour redonnait des points), numéros des grades
         collector, réglages et repères (visite guidée faite, Mathélo expliqué, première séance, mode « Libre »),
         problème de la semaine fait, autoévaluation (Avant / tests rapides) et sujet de préparation de l'évaluation en cours. */
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
  /* base (24.11, espace parent) : date de référence des dates relatives (o.t = jour de la photo) ; par défaut
     aujourd'hui (reprise de la progression). */
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
    if (o.a) s.a11y = { fs: +o.a.fs || 1, font: o.a.font ? 1 : 0, hc: o.a.hc ? 1 : 0 }; // réglages de lecture (24.11)
    s.placed = true;
    Engine.migrate(s);
    return s;
  },
  b64(bytes) { let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); },
  unb64(s) { const t = atob(s.replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(t, (c) => c.charCodeAt(0)); },
  async pipe(bytes, Stream, mode) { return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new Stream(mode))).arrayBuffer()); },
  // Code : « 1 » + deflate si le navigateur sait compresser, sinon « 0 » + JSON brut.
  async encode(state) {
    const raw = new TextEncoder().encode(JSON.stringify(this.pack(state)));
    if (typeof CompressionStream !== "undefined") { try { return "1" + this.b64(await this.pipe(raw, CompressionStream, "deflate-raw")); } catch (e) {} }
    return "0" + this.b64(raw);
  },
  /* Code (ou lien …#r=… / …#parent=…) → objet compact, sans le transformer en progression (24.11, espace parent). */
  async read(code) {
    code = String(code).trim().replace(/^.*#(r|parent)=/, "").replace(/\s+/g, "");
    const bytes = this.unb64(code.slice(1));
    const raw = code[0] === "1" ? await this.pipe(bytes, DecompressionStream, "deflate-raw") : bytes;
    return JSON.parse(new TextDecoder().decode(raw));
  },
  async decode(code) { return this.unpack(await this.read(code)); },
  url(code) { return location.origin + location.pathname + "#r=" + code; },
};
