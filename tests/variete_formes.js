/* Formes d'une question (27.11, tools/variete.py, tests/variete_niveaux.html). Une forme = l'énoncé lisible (énoncé +
   parties) aux nombres et aux signes près (un signe devant un nombre fait partie du nombre), aux lettres isolées près, une liste de nombres = un nombre (x ou t, A ou B ne font pas une autre forme) ; « [figure] »
   compte comme un mot. VARIETE.mesure(id, d, N) : formes distinctes sur N tirages reproductibles (graines 1…N),
   avec un exemple par forme (3 au plus). Nécessite VRAI (tests/vrai_collecte.js). */
const VARIETE = (() => {
  const key = (q) => (VRAI.plain(q.q) + " | " + (q.parts || []).map((p) => VRAI.plain(p.label)).join(" | "))
    .replace(/\d+(?:[,.']\d+)*/g, "#").replace(/(^|[^A-Za-zÀ-ÿ])[A-Za-z](?=$|[^A-Za-zÀ-ÿ'’])/g, "$1§")
    .replace(/[+−-]\s*(?=#)/g, "").replace(/[+−-]/g, "±").replace(/\s+/g, " ").replace(/#(?:\s*[;,]\s*±?\s*#)+/g, "#…").replace(/(?:±\s*)+/g, "± ").replace(/\(\s*±?\s*#\s*\)/g, "#").trim();
  function mesure(id, d, N) {
    const S = new Map(), C = new Set(); let ex = 0;
    for (let s = 1; s <= N; s++) { let q; try { q = Engine.build(id, d, s); } catch (e) { ex++; continue; } if (!q) continue;
      const k = key(q); if (!S.has(k)) S.set(k, VRAI.plain(q.q).slice(0, 110)); if (q.ctx) C.add(String(q.ctx).replace(/[-_]?\d+$/, "")); }
    return { n: S.size, ctx: C.size, ex: [...S.values()].slice(0, 3), err: ex };
  }
  return { key, mesure };
})();
