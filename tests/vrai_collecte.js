/* Collecte des énoncés pour l'audit de vraisemblance (26.11, règle de l'enseignant : « un énoncé déconnant, un
   paramètre mal fixé peut entraîner le décrochage et la perte d'un élève »). Utilisé par tests/vraisemblance.html
   (contrôles automatiques, dans la suite) et tests/_echantillon.html (lecture humaine, hors suite).
   VRAI.items(opts) rend une liste d'éléments { src, id, d, seed, txt (texte lisible : énoncé + parties), sol, fig,
   parts: [{ label, spec }], spec } tirés de GEN (niveaux 1 à 3), des défis (niveau 4), des exercices riches (RICH),
   des questions curieuses (CURIEUX) et des récits (HISTOIRE). */
const VRAI = (() => {
  /* TeX et HTML → texte lisible (virgule décimale, ' des milliers, fractions a/b) */
  const plain = (s) => String(s == null ? "" : s)
    .replace(/<svg[\s\S]*?<\/svg>/g, " [figure] ")
    .replace(/<br\s*\/?>/g, " ").replace(/<\/(li|p|div|tr)>/g, " ; ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
    .replace(/\{,\}/g, ",").replace(/\\text\{'\}|\{'\}/g, "'")
    .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)").replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)") /* 26.11 soir (defisch2) : racine avant fraction (\\frac{12\\sqrt{3}}{5} donnait « 12√(3)5 ») */
    .replace(/\\(?:text|mathrm|textbf|mathbf|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\cdot|\\times/g, "·").replace(/\\div/g, ":").replace(/\\pi/g, "π").replace(/\\circ|\^\{?\\circ\}?/g, "°")
    .replace(/\\le(q)?\b/g, "≤").replace(/\\ge(q)?\b/g, "≥").replace(/\\approx/g, "≈").replace(/\\%/g, "%")
    .replace(/\\[,;:! ]|~/g, " ").replace(/\\left|\\right/g, "").replace(/\\hat\{([^{}]*)\}|\\widehat\{([^{}]*)\}/g, "∠$1$2")
    .replace(/\\overline\{([^{}]*)\}|\\vec\{([^{}]*)\}|\\overrightarrow\{([^{}]*)\}/g, "$1$2$3")
    .replace(/\\[a-zA-Z]+/g, " ").replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
  const one = (src, id, d, seed, q) => {
    if (!q) return null;
    const parts = (q.parts || []).map((p) => ({ label: plain(p.label), spec: p.spec || null }));
    const guide = (q.guide || []).map((g) => ({ label: plain(g.ask), spec: g.spec || null }));
    return { src, id, d, seed, code: q.code || (src + "-" + id + "-" + d + "-" + seed), raw: String(q.q || ""), txt: plain(q.q), sol: plain(q.sol), fig: String(q.fig || "") + (q.figure || ""),
      spec: q.spec || null, parts, guide, titre: q.titre || "" };
  };
  /* opts : { n (graines), ids (liste ou null), src (liste parmi gen, defi, riche, curieux, histoire) } */
  function items(opts = {}) {
    const N = opts.n || 40, want = opts.ids ? new Set(opts.ids) : null, SRC = new Set(opts.src || ["gen", "defi", "riche", "curieux", "histoire"]), out = [], errs = [];
    if (SRC.has("gen") || SRC.has("defi")) for (const id of Object.keys(GEN)) {
      if (want && !want.has(id)) continue;
      const lv = [];
      if (SRC.has("gen")) lv.push(...(opts.levels || [1, 2, 3]));
      if (SRC.has("defi") && hasProb(id) && (!opts.levels || opts.levels.includes(4))) lv.push(4);
      for (const d of lv) for (let s = 1; s <= (d === 4 ? Math.max(N, 3 * (probList(id).length + ((typeof PROBX !== "undefined" && PROBX[id]) || []).length)) : N); s++) {
        try { const x = one(d === 4 ? "defi" : "gen", id, d, s, Engine.build(id, d, s)); if (x) out.push(x); } catch (e) { errs.push(id + "-" + d + "-" + s + " : " + e.message); }
      }
    }
    if (SRC.has("riche") && typeof RICH !== "undefined") for (const k of Object.keys(RICH)) {
      const ch = RICH[k]; if (!ch || !Array.isArray(ch.ex)) continue;
      if (want && !want.has(k) && !(ch.ids || []).some((i) => want.has(i))) continue;
      ch.ex.forEach((f, j) => { for (let s = 1; s <= Math.ceil(N / 4); s++) { try { R.seed(s * 7919 + j * 31); const x = one("riche", k + "#" + j, 0, s, moneyQ(typeof f === "function" ? f() : f)); /* comme sujet.js */ if (x) out.push(x); } catch (e) { errs.push("riche " + k + "#" + j + " : " + e.message); } } });
    }
    if (SRC.has("curieux") && typeof CURIEUX !== "undefined") for (const c of CURIEUX) {
      if (want && !want.has("cur-" + c.key) && !(c.uses || []).some((i) => want.has(i))) continue;
      for (let s = 1; s <= Math.ceil(N / 2); s++) {
        try { R.seed(s * 7919 + 17); const m = c.make(); const parts = [{ label: plain(m.calc && m.calc.label), spec: m.calc ? { kind: "value", value: m.calc.value, round: m.calc.round } : null }];
          out.push({ src: "curieux", id: "cur-" + c.key, d: 0, seed: s, code: "cur-" + c.key + "-" + s, raw: String(m.q || ""), txt: plain(m.q) + " | Pari : " + plain(m.bet && m.bet.q) + " [" + ((m.bet && m.bet.choices) || []).map(plain).join(" / ") + "]", sol: plain(m.reveal), fig: String(m.fig || ""), spec: null, parts, guide: [], titre: m.titre || "", bet: m.bet });
        } catch (e) { errs.push("curieux " + c.key + " : " + e.message); }
      }
    }
    if (SRC.has("histoire") && typeof HISTOIRE !== "undefined") HISTOIRE.forEach((h, j) => {
      if (want && !want.has("hist")) return;
      for (let s = 1; s <= Math.ceil(N / 4); s++) {
        try { const e = h.ex ? h.ex() : null; if (!e) continue; out.push({ src: "histoire", id: "hist#" + j, d: 0, seed: s, code: "hist-" + j, raw: String(e.q || ""), txt: plain(e.q), sol: plain(e.sol), fig: "", spec: { kind: "value", value: e.value }, parts: [], guide: [], titre: h.titre }); } catch (e) { errs.push("histoire " + j + " : " + e.message); }
      }
    });
    return { items: out, errs };
  }
  /* réponse(s) attendue(s) en clair */
  const ans = (sp) => !sp ? "" : sp.kind === "value" ? String(sp.value) + (sp.round ? " (±" + sp.round + ")" : "") : sp.values ? JSON.stringify(sp.values) : sp.expr ? String(sp.expr) : sp.ivs ? JSON.stringify(sp.ivs) : sp.kind || "";
  return { plain, items, ans };
})();
