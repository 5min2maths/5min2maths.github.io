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
      n[id] = [this.ST[x.status] || "v", r2(x.m), x.box, off(x.due), x.seen, x.ok, (x.placed ? 1 : 0) | (x.lessonSeen ? 2 : 0), x.easy || 0, off(x.retry)];
    }
    const c = {};
    for (const [cid, x] of Object.entries(s.comps || {})) c[cid] = [x.r.map((v) => Math.round(v * 4)).join(""), x.n, off(x.last)];
    const b = s.bc ? { ...s.bc, last: off(s.bc.last), weeks: Object.fromEntries(Object.entries(s.bc.weeks).map(([k, v]) => [off(k), v])) } : null;
    return {
      v: 1, t, p: s.profile, n, c, cr: off(s.created),
      e: [s.elo.r, s.elo.n, (s.elo.log || []).slice(-8).map(([d, r]) => [off(d), r])],
      k: [s.streak.count, off(s.streak.last)],
      h: (s.history || []).slice(-14).map((x) => [off(x.date), x.n, r2(x.score)]),
      b, pr: s.prep || null, nw: s.now || null, g: Object.fromEntries(Object.entries(s.badges || {}).map(([k, d]) => [k, off(d)])),
    };
  },
  unpack(o) {
    if (!o || o.v !== 1 || !o.p || !o.n) throw new Error("code");
    const t = day(), on = (k) => (k === null || k === undefined ? null : addDays(t, k)), ST = Object.fromEntries(Object.entries(this.ST).map(([a, b]) => [b, a]));
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
      s.notions[id] = x;
    }
    s.comps = Object.fromEntries(Object.entries(o.c || {}).map(([cid, [r, n, l]]) => [cid, { r: [...r].map((ch) => +ch / 4), n, last: on(l) }]));
    s.elo = { r: o.e[0], n: o.e[1], log: o.e[2].map(([d, r]) => [on(d), r]) };
    s.streak = { count: o.k[0], last: on(o.k[1]) };
    s.history = o.h.map(([d, n, sc]) => ({ date: on(d), n, score: sc }));
    if (o.b) s.bc = { ...o.b, last: on(o.b.last), weeks: Object.fromEntries(Object.entries(o.b.weeks).map(([k, v]) => [on(+k), v])) };
    s.badges = Object.fromEntries(Object.entries(o.g || {}).map(([k, d]) => [k, on(d)]));
    if (o.pr) s.prep = o.pr;
    if (o.nw) s.now = o.nw;
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
  async decode(code) {
    code = String(code).trim().replace(/^.*#r=/, "").replace(/\s+/g, "");
    const bytes = this.unb64(code.slice(1));
    const raw = code[0] === "1" ? await this.pipe(bytes, DecompressionStream, "deflate-raw") : bytes;
    return this.unpack(JSON.parse(new TextDecoder().decode(raw)));
  },
  url(code) { return location.origin + location.pathname + "#r=" + code; },
};
