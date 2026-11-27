/* Recalcul indépendant, niveaux 1 à 3 des notions PROPRES au lycée français (27.11, agent recalcfr) : notions du catalogue
   FR placées en 2nde, 1re ou Tle et absentes du parcours suisse (CH: null) — src/fr_2nde.js, fr_1re.js, fr_tle.js,
   fr_lycee.js, fr_fin.js, fr_3e.js (tabvar) et la série « stats » de generators.js.
   Même principe que tests/recalc_oracles34.js (chargé avant ce fichier) : chaque oracle relit l'énoncé que l'élève voit
   (TeX de q.q, et la figure SVG quand les données y sont : nuage de points, arbre pondéré), refait le calcul par une autre
   voie (boucle, dénombrement, calcul numérique) et rend la valeur, l'ensemble, le couple, l'expression ou les intervalles
   attendus ; RECALC.check les compare à la réponse attendue (arrondi, corrigé, saisie : cmpValue) et, pour un ensemble ou
   un couple, la page tape aussi la réponse recalculée dans checkAnswer. Les oracles sont placés en tête de RECALC.G et ne
   s'appliquent qu'aux notions nommées (RECALC.IDSFRL). Page : tests/recalcul_frl.html ; couverture : tools/recalcul.md. */
(() => {
  const R = RECALC, G = R.G, Z = R._34, { fmt } = R, { judge, fn, val, defs, segs, snap, d1, zeros, zsc, extrema, lim, limInf, integ, fin } = Z;
  const IDS = new Set(), LIST = [];
  /* texte « à plat » : formules sans \( \), nombres TeX lus (1\,200 → 1200 ; 0{,}7 → 0,7), \text{€} → €, <br> → espace */
  const flat = (raw) => String(raw).replace(/<code[^>]*>[\s\S]*?<\/code>/g, " ").replace(/<br\s*\/?>/g, " ").replace(/<\/?[a-zA-Z][^>]*>/g, "").replace(/\\\(|\\\)/g, "").replace(/(\d)(?:\\,|\u202f)(?=\d{3}(?!\d))/g, "$1").replace(/\{,\}/g, ",")
    .replace(/\\text\{\s*([^{}]*)\}/g, "$1").replace(/\\ /g, " ").replace(/\\,/g, " ").replace(/\\%/g, "%").replace(/\s+/g, " ").replace(/−/g, "-");
  const nb = (s) => +String(s).replace(/\s/g, "").replace(",", ".").replace(/−/g, "-");
  const NB = String.raw`(-?\d+(?:,\d+)?)`;
  /* gabarit : # = nombre ; rend les nombres ou null */
  const rx = (src, fl = "") => new RegExp(src.replace(/#/g, NB), fl);
  function O(ids, f) {
    const set = new Set(ids.split(" ")); for (const i of set) IDS.add(i);
    LIST.push({ name: "frl " + ids, f(x) {
      if (!set.has(x.id) || !x.spec || !(x.d >= 1 && x.d <= 3)) return null; /* niveaux 1 à 3 seulement (pas les exercices riches ni les défis) */
      const raw = String(x.raw);
      const c = { x, raw, F: flat(raw), fig: String(x.fig || ""), code: (raw.match(/<code[^>]*>([\s\S]*?)<\/code>/) || [])[1] || "", get S() { return segs(raw); }, get D() { return this._D || (this._D = defs(raw)); } };
      c.m = (re) => { const m = (typeof re === "string" ? rx(re) : rx(re.source, re.flags)).exec(c.F); return m ? m.slice(1).map((g) => (g !== undefined && /^-?\d+(?:,\d+)?$/.test(g) ? nb(g) : g)) : null; };
      let r; try { r = f(c); } catch (e) { return { err: "oracle : " + e.message }; }
      if (r === null || r === undefined) return null;
      if (r.err !== undefined) return r; /* incohérence relevée par l'oracle */
      const j = judge(x, r);
      if (j && !j.err && (r.S || r.P)) { const z = typeIn(x.spec, r); if (z) return { err: z }; }
      if (j && !j.err && "v" in j && x.spec.kind === "value" && !x.spec.round && /fraction/.test(x.txt)) { const q = ratOf(j.v, 5000); if (q && q[1] > 1) (r.typed = r.typed || []).push(q[0] + "/" + q[1]); }
      if (j && !j.err && r.typed) for (const inp of r.typed) { if (!inp) return { err: "écriture exacte non reconstituée" }; let k; try { k = checkAnswer(x.spec, inp); } catch (e) { k = { status: "exception " + e.message }; } if (k.status !== "correct") return { err: "saisie : « " + inp + " » refusée (" + k.status + (k.message ? " : " + k.message : "") + ")" }; }
      return j;
    } });
  }
  /* saisie : la réponse recalculée (ensemble, couple), tapée comme un élève, doit être acceptée */
  const ratOf = (v, Q = 200) => { for (let q = 1; q <= Q; q++) { const p = Math.round(v * q); if (Math.abs(p / q - v) <= 1e-9 * Math.max(1, Math.abs(v))) return [p, q]; } return null; };
  const typ = (v) => { const r = ratOf(v); return r ? (r[1] === 1 ? String(r[0]) : r[0] + "/" + r[1]) : fmt(+v.toFixed(10)).replace(".", ","); };
  function typeIn(sp, r) {
    const inp = r.S ? (r.S.length ? r.S.map(typ).join(" ; ") : "aucune") : r.P.map(typ).join(" ; "); /* couple : « x ; y » comme le demande la consigne */
    if (r.S && r.S.some((v) => !ratOf(v))) return null; /* irrationnel : forme exacte attendue, non retapée ici */
    let c; try { c = checkAnswer(sp, inp); } catch (e) { c = { status: "exception " + e.message }; }
    return c.status === "correct" ? null : "saisie : « " + inp + " » refusée (" + c.status + (c.message ? " : " + c.message : "") + ")";
  }
  /* figure : nuage de points (n, u_n) de figSuite → valeurs lues par les graduations */
  function figDots(fig) {
    const ticks = [...fig.matchAll(/<text x="[\d.]+" y="([\d.]+)" class="f-txt f-tick" text-anchor="end"[^>]*>([^<]+)<\/text>/g)].map((m) => [+m[1] - 4, nb(m[2])]);
    if (ticks.length < 2) return null;
    const [y1, v1] = ticks[0], [y2, v2] = ticks[ticks.length - 1], V = (y) => v1 + ((y - y1) * (v2 - v1)) / (y2 - y1);
    return [...fig.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"[^>]*class="f-dot"/g)].map((m) => [+m[1], V(+m[2])]).sort((a, b) => a[0] - b[0]).map((p) => Math.round(p[1] * 10) / 10); /* coordonnées SVG au dixième de pixel : lecture au dixième */
  }
  const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  const first = (f, max = 100000) => { for (let n = 0; n <= max; n++) if (f(n)) return n; return NaN; };

  /* ========================= stats ========================= */
  const serie = (F) => { const m = /série\s*:?\s*((?:-?\d+(?:,\d+)? ; )+-?\d+(?:,\d+)?)/.exec(F.replace(/\s*;\s*/g, " ; ")); return m ? m[1].split(" ; ").map(nb) : null; };
  const tab = (raw) => { const m = /\\begin\{array\}\{[^}]*\}([\s\S]*?)\\end\{array\}/.exec(raw); if (!m) return null; const L = m[1].replace(/\\hline/g, "").split("\\\\").map((r) => r.split("&").slice(1).map((s) => nb(s.replace(/\\,/g, "").replace(/\{,\}/g, ",").trim()))); return L; };
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const median = (a) => { const s = [...a].sort((u, v) => u - v), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  O("stats", (c) => {
    const F = c.F; let m;
    if ((m = c.m(String.raw`a eu ((?:\d+, )*\d+) sur 20 à ses premiers contrôles\. .*?exactement # de moyenne`))) { const a = m[0].split(", ").map(nb); return m[1] * (a.length + 1) - a.reduce((s, v) => s + v, 0); }
    const T = tab(c.raw);
    if (T) { const [v, e] = T, N = e.reduce((s, u) => s + u, 0), xs = v.flatMap((u, i) => Array(e[i]).fill(u));
      if (/mode/.test(F)) { const mx = Math.max(...e); return e.filter((u) => u === mx).length === 1 ? v[e.indexOf(mx)] : NaN; }
      if (/moyenne/.test(F)) return mean(xs); if (/médiane/.test(F)) return median(xs); return N ? null : null; }
    const s = serie(F);
    if (s) { if (/moyenne/.test(F)) return mean(s); if (/médiane/.test(F)) return median(s);
      if (/mode/.test(F)) { const cnt = {}; s.forEach((u) => (cnt[u] = (cnt[u] || 0) + 1)); const mx = Math.max(...Object.values(cnt)), ks = Object.keys(cnt).filter((k) => cnt[k] === mx); return ks.length === 1 ? +ks[0] : NaN; }
      if (/écart-type/.test(F)) { const mu = mean(s); return Math.sqrt(mean(s.map((u) => (u - mu) ** 2))); } }
    if ((m = c.m(String.raw`moyenne de # [^.]*?et un écart-type de #\.`))) { const [mu, sg] = m;
      let k; if ((k = c.m(String.raw`(?:ajoute|bonus de) #`))) return /nouvelle moyenne/.test(F) ? mu + k[0] : /nouvel écart-type/.test(F) ? sg : null;
      if ((k = c.m(String.raw`(?:multiplie toutes les valeurs par|retire) #`))) { if (/retire/.test(F)) return /nouvelle moyenne/.test(F) ? mu - k[0] : /nouvel écart-type/.test(F) ? sg : null; return /nouvelle moyenne/.test(F) ? mu * k[0] : /nouvel écart-type/.test(F) ? Math.abs(k[0]) * sg : null; } }
    return null;
  });

  /* ========================= suites ========================= */
  /* u_n = … : segment TeX de l'énoncé (pas le texte à plat : 0{,}5 y devient 0,5) */
  const un = (c, name = "u") => { const t = c.S.find((x) => new RegExp("^" + name + "_n\\s*=").test(x)); return t ? fn(t.replace(/^\w_n\s*=\s*/, ""), ["n"]) : null; };
  const recu = (F) => { const m = /u_0 = (-?\d+(?:,\d+)?)[^.]*?u_\{n\+1\} = ([^.]*?)(?: pour tout|\. |\.$)/.exec(F); if (!m) return null; const g = fn(m[2].replace(/,(\d)/g, ".$1").replace(/u_n/g, "(U)").replace(/\\/g, "\\"), ["U", "n"]); return g ? { u0: nb(m[1]), g } : null; };
  const iter = (r, k) => { let u = r.u0; for (let n = 0; n < k; n++) u = r.g({ U: u, n }); return u; };
  O("suitedef", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/(?:compte|abrite) # \S+ cette année\. Chaque année, # % d'entre eux [^.]*? et # /))) { const [u0, t, b] = m, k = c.m(/u_\{n\+1\} = # ?u_n \+ #\. Calcule u_(\d+)/); if (!k) return null;
      if (Math.abs(k[0] - (1 - t / 100)) > 1e-9 || k[1] !== b) return NaN; let u = u0; for (let i = 0; i < k[2]; i++) u = u - (u * t) / 100 + b; return u; }
    if ((m = c.m(/Calcule u_\{?(\d+)\}?\.?\s*(?:\(fraction acceptée\))?\.?$/))) { const k = nb(m[0]); const r = recu(F); if (r) return iter(r, k); const f = un(c); return f ? f(k) : null; }
    if ((m = c.m(/u_0 = (-?\d+(?:,\d+)?)[^.]*u_\{n\+1\} = (-?\d+(?:,\d+)?)u_n ([+-]) (\d+)\. Calcule u_(\d+)/))) { let u = m[0]; for (let i = 0; i < m[4]; i++) u = m[1] * u + (m[2] === "-" ? -m[3] : m[3]); return u; }
    if ((m = c.m(/Le motif n° 1 utilise (\d+) \S+, le n° 2 en utilise (\d+), le n° 3 en utilise (\d+), .*?motif n° (\d+) \?/))) { const [a, b, d, k] = m; if (d - b !== b - a) return NaN; return a + (k - 1) * (b - a); }
    if ((m = c.m(/u_0 = (-?\d+) et u_\{n\+1\} = u_n ([+-]) (\d*)n ([+-]) (\d+) pour tout[^.]*\. Calcule u_(\d+)/))) { let u = m[0]; const A = (m[1] === "-" ? -1 : 1) * (m[2] === "" ? 1 : m[2]), B = (m[3] === "-" ? -1 : 1) * m[4]; for (let n = 0; n < m[5]; n++) u += A * n + B; return u; }
    if (/Exprime u_\{n\+1\} - u_n en fonction de n/.test(F)) { const f = un(c); return f ? { E: (n) => f(n + 1) - f(n), v0: "n" } : null; }
    if (/Que vaut n à la fin de ce programme Python/.test(F)) return py(c.code, "n");
    if ((m = c.m(/u_n = (.*?)\. À partir de quel rang n a-t-on u_\{n\+1\} > u_n/))) { const f = fn(m[0], ["n"]); return f ? first((n) => f(n + 1) > f(n)) : null; }
    if (/conjecture la limite de \(u_n\)/.test(F)) { const f = un(c); return f ? snap(f(1e9), 1e-6) : null; }
    if ((m = c.m(/u_0 = # et u_\{n\+1\} = # ?u_n ([+-]) #\. .*?conjecture la limite/))) { let u = m[0]; for (let i = 0; i < 400; i++) u = m[1] * u + (m[2] === "-" ? -m[3] : m[3]); return snap(u, 1e-8); }
    return null;
  });
  /* interpréteur minimal des programmes Python affichés (affectations, while, for range, if) */
  function py(code, want) {
    const src = String(code).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").split("\n").filter((l) => l.trim());
    const env = {}, E = (e) => { const s = e.replace(/\band\b/g, "&&").replace(/\bor\b/g, "||").replace(/\bnot\b/g, "!").replace(/\*\*/g, "**").replace(/(\w+)\s*\/\/\s*(\w+)/g, "Math.floor($1/$2)").replace(/\babs\(/g, "Math.abs(").replace(/\bround\(/g, "Math.round(");
      return Function(...Object.keys(env), "return (" + s + ");")(...Object.values(env)); };
    let steps = 0;
    const block = (i, ind) => { const out = []; for (; i < src.length; i++) { const l = src[i], d = l.match(/^ */)[0].length; if (d < ind) break; if (d === ind) out.push(i); } return out; };
    const run = (lines) => { for (const i of lines) { if (++steps > 1e6) throw new Error("boucle"); const l = src[i].trim(), ind = src[i].match(/^ */)[0].length, body = () => block(i + 1, ind + 4);
      let m;
      if ((m = /^while (.*):$/.exec(l))) { while (E(m[1])) run(body()); }
      else if ((m = /^for (\w+) in range\((.*)\):$/.exec(l))) { const a = E("[" + m[2] + "]"), [s, e, st] = a.length === 1 ? [0, a[0], 1] : [a[0], a[1], a[2] || 1]; for (let k = s; st > 0 ? k < e : k > e; k += st) { env[m[1]] = k; run(body()); } }
      else if ((m = /^if (.*):$/.exec(l))) { const b = body(); let j = i + 1; while (j < src.length && src[j].match(/^ */)[0].length > ind) j++;
        const hasElse = j < src.length && src[j].trim() === "else:" && src[j].match(/^ */)[0].length === ind; if (E(m[1])) run(b); else if (hasElse) run(block(j + 1, ind + 4)); }
      else if (l === "else:") continue;
      else if ((m = /^(\w+)\s*([+\-*/]?)=\s*(.*)$/.exec(l))) { const v = E(m[3]); env[m[1]] = m[2] ? E(m[1] + m[2] + "(" + m[3] + ")") : v; }
      else if (/^def |^return |^print\(/.test(l)) throw new Error("python non géré : " + l);
      else throw new Error("ligne non lue : " + l); } };
    const top = block(0, 0); run(top); return env[want];
  }
  O("suitearith", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/premier terme u_(\d) = # et (?:pour|de) raison (?:r = )?#\. Calcule u_\{?(\d+)\}?/))) return m[1] + (m[3] - m[0]) * m[2];
    if ((m = c.m(/vérifie u_\{?(\d+)\}? = # et u_\{?(\d+)\}? = #\. Quelle est sa raison/))) return (m[3] - m[1]) / (m[2] - m[0]);
    if ((m = c.m(/vérifie u_\{?(\d+)\}? = # et u_\{?(\d+)\}? = #\. Calcule u_0/))) { const r = (m[3] - m[1]) / (m[2] - m[0]); return m[1] - m[0] * r; }
    if ((m = c.m(/Lis u_0 et la raison, puis calcule u_\{?(\d+)\}?/))) { const t = figDots(c.fig); if (!t || t.length < 3) return null; const r = t[1] - t[0]; if (t.some((v, i) => Math.abs(v - (t[0] + i * r)) > 0.01)) return NaN; return t[0] + m[0] * r; }
    if ((m = c.m(/premier terme u_0 = # et pour raison #\. Pour quel entier n a-t-on u_n = #/))) return (m[2] - m[0]) / m[1];
    if ((m = c.m(/premier terme u_(\d) = # et pour raison #\. Exprime u_n en fonction de n/))) return { E: (n) => m[1] + (n - m[0]) * m[2], v0: "n" };
    if ((m = c.m(/#(?: €| cm)? [^.]*? et (?:grandit de|en gagne|y ajoute) # [^.]*?chaque (?:semaine|année|mois|an)\. On note u_n la valeur après n \S+ \(u_0 = #\)\. Calcule u_\{?(\d+)\}?/))) return m[0] !== m[2] ? NaN : m[0] + m[3] * m[1];
    if ((m = c.m(/(?:est de|contient|forfait de) # (\S+) ?;? [^.]*?(?:expédie|prélève|diminue de) # [^.]*?\. Au bout de combien de \S+ restera-t-il pour la première fois moins de #/))) { const [A, , b, L] = m; return first((n) => A - n * b < L); }
    if ((m = c.m(/forfait A coûte # € plus # € par heure ; le forfait B coûte # € plus # € par heure\. À partir de combien d'heures \(nombre entier\) le forfait A est-il strictement moins cher/))) return first((h) => m[0] + m[1] * h < m[2] + m[3] * h);
    if ((m = c.m(/vérifie u_3 = # et u_2 \+ u_7 = #\. Calcule u_0/))) { /* u0 + 3r = a ; 2u0 + 9r = b */ const [a, b] = m, r = (b - 2 * a) / 3; return a - 3 * r; }
    return null;
  });
  O("suitegeo", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/raison # vérifie u_\{?(\d+)\}? = #\. Calcule u_0/))) return m[2] / m[0] ** m[1];
    if ((m = c.m(/premier terme u_(\d) = # et (?:pour|de) raison (?:q = )?#\. Calcule u_\{?(\d+)\}?/))) return m[1] * m[2] ** (m[3] - m[0]);
    if ((m = c.m(/Chaque année, .*? (augmente|diminue|baisse) de # %\. On note u_n .*?quelle est sa raison/))) return 1 + ((m[0] === "augmente" ? 1 : -1) * m[1]) / 100;
    if ((m = c.m(/premier terme u_0 = # et de raison #\. Exprime u_n/))) return { E: (n) => m[0] * m[1] ** n, v0: "n", pts: [0, 1, 2, 3, 4, 5] };
    if ((m = c.m(/vérifie u_(\d+) = # et u_(\d+) = #\. Quelle est sa raison/))) { const k = m[2] - m[0], q = m[3] / m[1]; const r = Math.sign(q) * Math.abs(q) ** (1 / k); return k % 2 === 0 ? NaN : snap(r, 1e-9); }
    if ((m = c.m(/(?:est de|a une masse de|vaut|) # (?:mg|g|€)? ?;? (?:elle|sa valeur) (?:diminue|baisse) de # % par (heure|an)\. Que vaut-elle au bout de # (?:heures|ans)/))) { let v = m[0]; for (let i = 0; i < m[3]; i++) v -= (v * m[1]) / 100; return v; }
    if ((m = c.m(/place # € à intérêts composés au taux annuel de # %\. Quel est le capital au bout de # ans/))) { let v = m[0]; for (let i = 0; i < m[2]; i++) v += (v * m[1]) / 100; return v; }
    if ((m = c.m(/raison positive vérifie u_(\d) = # et u_(\d) = #\. Calcule u_0/))) { const q = (m[3] / m[1]) ** (1 / (m[2] - m[0])); return m[1] / q ** m[0]; }
    if ((m = c.m(/partent de # €\. Le placement A rapporte # € par an ; le placement B augmente de # % par an\. Au bout de combien d'années B dépasse-t-il A/))) { return first((n) => { let b = m[0]; for (let i = 0; i < n; i++) b *= 1 + m[2] / 100; return n > 0 && b > m[0] + n * m[1]; }); }
    if ((m = c.m(/(?:compte|a une surface de|contient) # [^;]*; .*?(?:baisse|diminue) de # % par an\. Au bout de combien d'années passera-t-\S+ pour la première fois sous #/))) return first((n) => { let v = m[0]; for (let i = 0; i < n; i++) v -= (v * m[1]) / 100; return v < m[2]; });
    return null;
  });
  O("suitesomme", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/premier terme u_0 = # et pour raison #\. Calcule S = u_0 \+ u_1 \+ \\dots \+ u_\{?(\d+)\}?/))) { let s = 0; for (let i = 0; i <= m[2]; i++) s += m[0] + i * m[1]; return s; }
    if ((m = c.m(/Calcule S = 1 \+ 2 \+ 3 \+ \\dots \+ (\d+)/))) { let s = 0; for (let i = 1; i <= m[0]; i++) s += i; return s; }
    if ((m = c.m(/Calcule S = 1 \+ (\d+) \+ \1\^2 \+ \\dots \+ \1\^\{?(\d+)\}?/))) { let s = 0; for (let i = 0; i <= m[1]; i++) s += m[0] ** i; return s; }
    if ((m = c.m(/Calcule S = (\d+) \+ (\d+) \+ (\d+) \+ \\dots \+ (\d+)/))) { const r = m[1] - m[0]; if (m[2] - m[1] !== r || (m[3] - m[0]) % r) return NaN; let s = 0; for (let v = m[0]; v <= m[3]; v += r) s += v; return s; }
    if ((m = c.m(/compte # (?:places|canettes) et chaque (?:rang|rangée) (?:a|en a) # (?:places )?de plus que [^.]*\. Il y a # (?:rangs|rangées)/))) { let s = 0; for (let i = 0; i < m[2]; i++) s += m[0] + i * m[1]; return s; }
    if ((m = c.m(/envoyé à # personnes le premier jour ; chaque jour, chaque nouveau destinataire le transfère à # personnes\. Combien au total en # jours/))) { let s = 0, t = m[0]; for (let i = 0; i < m[2]; i++) { s += t; t *= m[1]; } return s; }
    if ((m = c.m(/(?:plante|le premier jour,) # (?:arbres|personnes jouent)[^.]*?(?:puis, chaque année, # fois plus|puis chaque jour il y en a # fois plus)[^.]*\. Combien au total en # (?:ans|jours)/))) { const q = m[1] !== undefined ? m[1] : m[2]; let s = 0, t = m[0]; for (let i = 0; i < m[3]; i++) { s += t; t *= q; } return s; }
    if ((m = c.m(/u_n = (.*?)\. Calcule S = u_\{?(\d+)\}? \+ u_\{?(\d+)\}? \+ \\dots \+ u_\{?(\d+)\}?/))) { const f = fn(m[0], ["n"]); if (!f) return null; let s = 0; for (let i = m[1]; i <= m[3]; i++) s += f(i); return s; }
    if ((m = c.m(/augmente de # % ?# € le premier mois, puis # €, etc\. Combien a-t-elle versé en tout au bout de # mois/))) { if (Math.abs(m[2] - m[1] * (1 + m[0] / 100)) > 0.005) return NaN; let s = 0, t = m[1]; for (let i = 0; i < m[3]; i++) { s += t; t *= 1 + m[0] / 100; } return s; }
    if ((m = c.m(/1 grain de riz sur la 1re case, 2 sur la 2e, 4 sur la 3e, .*?le total dépasse-t-il #/))) return first((n) => 2 ** n - 1 > m[0]);
    if ((m = c.m(/1 \+ 2 \+ \\dots \+ n = #/))) { const n = first((k) => (k * (k + 1)) / 2 >= m[0]); return (n * (n + 1)) / 2 === m[0] ? n : NaN; }
    return null;
  });

  /* ========================= outils communs : équations, inéquations, fonctions ========================= */
  const OPS = { "<": (a, b) => a < b, ">": (a, b) => a > b, "\\leqslant": (a, b) => a <= b, "\\geqslant": (a, b) => a >= b, "\\leq": (a, b) => a <= b, "\\geq": (a, b) => a >= b, "\\le": (a, b) => a <= b, "\\ge": (a, b) => a >= b };
  const OPRE = /\s*(\\leqslant|\\geqslant|\\leq|\\geq|\\le|\\ge|<|>)\s*/;
  /* « e^{…} » seul : on compare les exposants (fonction exp strictement croissante, pas de débordement) */
  const expOf = (t) => { const m = /^e\^\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}$/.exec(t.trim()); return m ? m[1] : null; };
  function sides(tex, vs = ["x"]) {
    const [L, Rr] = tex.split(/\s*=\s*/); if (Rr === undefined) return null;
    const a = expOf(L), b = expOf(Rr); if (a !== null && b !== null) { const f = fn(a, vs), g = fn(b, vs); return f && g ? [f, g] : null; }
    const f = fn(L, vs), g = fn(Rr, vs); return f && g ? [f, g] : null;
  }
  /* toutes les solutions réelles de f = g sur [-L ; L] (racines de f − g, changement de signe ou racine double) */
  const solve = (f, g, L = 60) => { const z = R.roots((t) => [f(t), g(t)], L); return z === null ? null : z.map((v) => snap(v, 1e-7)); };
  function ineq(tex, vs = ["x"]) {
    const m = OPRE.exec(tex); if (!m) return null; const L = tex.slice(0, m.index), Rr = tex.slice(m.index + m[0].length), op = OPS[m[1]];
    const a = expOf(L), b = expOf(Rr);
    let f, g; if (a !== null && b !== null) { f = fn(a, vs); g = fn(b, vs); } else { f = fn(L, vs); g = fn(Rr, vs); }
    if (!f || !g) return null;
    const pts = solve(f, g) || []; return { I: (t) => { const u = f(t), v = g(t); return fin(u) && fin(v) && op(u, v); }, pts };
  }
  /* segment TeX qui suit un texte (dans raw) */
  const segAfter = (c, re) => { const m = new RegExp(re.source + String.raw`\s*\\\(([\s\S]*?)\\\)`, re.flags).exec(c.raw); return m ? m[m.length - 1] : null; };
  /* tableau TeX \begin{array} → lignes de cellules (texte) */
  const arr = (raw) => { const m = /\\begin\{array\}\{[^}]*\}([\s\S]*?)\\end\{array\}/.exec(raw); return m ? m[1].replace(/\\hline/g, "").split("\\\\").map((r) => r.split("&").map((s) => s.trim())).filter((r) => r.length > 1) : null; };
  const cell = (s) => { const t = String(s).replace(/\\,/g, "").replace(/\{,\}/g, ".").replace(/\\text\{[^}]*\}/g, "").trim(); return /^-?[\d.]+$/.test(t) ? +t : val(t); };

  /* ========================= expfn ========================= */
  O("expfn", (c) => {
    const F = c.F; let m, s;
    if (/sous la forme e\^k\. Que vaut k/.test(F)) { s = segAfter(c, /Écris/); return s ? snap(Math.log(val(s)), 1e-9) : null; }
    if ((s = segAfter(c, /Résous/)) !== null) {
      if (OPRE.test(s)) return ineq(s);
      const p = sides(s); if (!p) return null; const z = solve(...p); return z === null ? null : { S: z };
    }
    if ((s = segAfter(c, /Simplifie/)) !== null) { const e = s.replace(/^[A-Z]\s*=\s*/, ""), f = fn(e); return f ? { E: f } : null; }
    if ((m = /Calcule \\\(([A-Za-z])\(([^)]+)\)\\\)/.exec(c.raw)) && c.D[m[1]]) return c.D[m[1]](val(m[2]));
    return null;
  });

  /* ========================= pscal ========================= */
  const norm = (c, e) => { const m = new RegExp(String.raw`\\lVert ` + e + String.raw` \\rVert = ([^\\]*?)(?:\\\)|,)`).exec(c.raw); return m ? val(m[1]) : NaN; };
  O("pscal", (c) => {
    const F = c.F, V = Z.vecs(c.raw); let m, s;
    if (/l'angle \(\\vec\{u\}, \\vec\{v\}\) mesure/.test(F)) { s = segAfter(c, /mesure/); return norm(c, String.raw`\\vec\{u\}`) * norm(c, String.raw`\\vec\{v\}`) * Math.cos(val(s)); }
    if (/Pour quelle valeur de m les vecteurs/.test(F)) { const M = [...c.raw.matchAll(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g)].map((x) => x[1].split("\\\\").map((t) => t.trim())); if (M.length !== 2) return null;
      const g = (k) => M[0].reduce((a, t, i) => a + fn(t, ["m"])(k) * fn(M[1][i], ["m"])(k), 0); return Z.lin(g); }
    if (/Calcule \\vec\{u\} \\cdot \\vec\{v\}\.?$/.test(F) && V.length === 2 && !/lVert/.test(c.raw)) return Z.dot(V[0], V[1]);
    if (/calcule \\cos\(\\vec\{u\}, \\vec\{v\}\)/.test(F) && V.length === 2) return Z.dot(V[0], V[1]) / (Z.nrm(V[0]) * Z.nrm(V[1]));
    if ((m = c.m(/AB = # , AC = # et \\widehat\{BAC\} = /)) || (m = c.m(/AB = #, AC = # et \\widehat\{BAC\} =/))) { s = segAfter(c, /\\widehat\{BAC\} = /) || /\\widehat\{BAC\} = ([^\\]*(?:\\frac\{[^}]*\}\{[^}]*\})?[^\\]*?)\\\)/.exec(c.raw)?.[1]; const a = val(s); return Math.sqrt(m[0] ** 2 + m[1] ** 2 - 2 * m[0] * m[1] * Math.cos(a)); }
    if ((m = c.m(/AB = # et AH = #, H (étant sur la demi-droite \[AB\)|et B étant de part et d'autre de A)/))) return m[0] * m[1] * (/demi-droite/.test(m[2]) ? 1 : -1);
    if ((m = c.m(/lVert \\vec\{u\} \\rVert = #, \\lVert \\vec\{v\} \\rVert = # et \\lVert \\vec\{u\} ([+-]) \\vec\{v\} \\rVert = #\. Calcule \\vec\{u\} \\cdot \\vec\{v\}/))) return (m[2] === "+" ? 1 : -1) * (m[3] ** 2 - m[0] ** 2 - m[1] ** 2) / 2;
    if ((m = c.m(/lVert \\vec\{u\} \\rVert = #, \\lVert \\vec\{v\} \\rVert = # et \\vec\{u\} \\cdot \\vec\{v\} = #\. Calcule (.*)$/))) { const [a, b, p, q] = m; const uu = a * a, vv = b * b;
      let k; if ((k = /\\lVert \\vec\{u\} ([+-]) (\d*)\\vec\{v\} \\rVert\^2/.exec(q))) { const t = (k[1] === "-" ? -1 : 1) * (k[2] ? +k[2] : 1); return uu + 2 * t * p + t * t * vv; }
      if ((k = /\((\d*)\\vec\{u\} ([+-]) (\d*)\\vec\{v\}\) \\cdot \((\d*)\\vec\{u\} ([+-]) (\d*)\\vec\{v\}\)/.exec(q))) { const a1 = k[1] ? +k[1] : 1, b1 = (k[2] === "-" ? -1 : 1) * (k[3] ? +k[3] : 1), a2 = k[4] ? +k[4] : 1, b2 = (k[5] === "-" ? -1 : 1) * (k[6] ? +k[6] : 1); return a1 * a2 * uu + (a1 * b2 + b1 * a2) * p + b1 * b2 * vv; }
      return null; }
    if (/projeté orthogonal H de M/.test(F)) { const A = /A\((-?[\d,]+) ; (-?[\d,]+)\)/.exec(F), Mm = /M\((-?[\d,]+) ; (-?[\d,]+)\)/.exec(F); if (!A || !Mm || !V.length) return null;
      const a = [nb(A[1]), nb(A[2])], p = [nb(Mm[1]), nb(Mm[2])], u = V[0], t = Z.dot(Z.sub(p, a), u) / Z.dot(u, u); return { P: Z.add(a, Z.mul(t, u)) }; }
    return null;
  });

  /* ========================= probabilités : arbre et énoncé ========================= */
  /* arbre pondéré (figTree / treeFig) : noms (police 16) et étiquettes des branches (« ? » = cachée) dans l'ordre :
     P(A), P(Ā), P_A(B), P_A(B̄), P_Ā(B), P_Ā(B̄) */
  function treeOf(fig) {
    const names = [...fig.matchAll(/<text[^>]*class="f-txt"[^>]*font-size="1[56]"[^>]*>([^<]+)<\/text>/g)].map((m) => m[1]);
    const labs = [...fig.matchAll(/<text[^>]*class="f-accent f-txt"[^>]*>([^<]+)<\/text>/g)].map((m) => (m[1].trim() === "?" ? NaN : nb(m[1])));
    if (names.length < 6 || labs.length !== 6) return null;
    const pick = (a, b) => (fin(a) ? a : fin(b) ? 1 - b : NaN);
    return { A: names[0].replace(/\u0305/g, ""), B: names[2].replace(/\u0305/g, ""), p: pick(labs[0], labs[1]), q: pick(labs[2], labs[3]), r: pick(labs[4], labs[5]) };
  }
  /* évènement TeX : « A », « \overline{A} », « \bar{A} » → [lettre, contraire ?] */
  const ev = (t) => { t = t.trim(); const m = /^\\(?:overline|bar)\{(\w)\}$/.exec(t); return m ? [m[1], true] : /^\w$/.test(t) ? [t, false] : null; };
  /* loi jointe à partir de p = P(A), q = P_A(B), r = P_Ā(B) ; prob(expr TeX) */
  function probModel(A, B, p, q, r) {
    const cellP = (a, b) => (a ? p : 1 - p) * (a ? (b ? q : 1 - q) : (b ? r : 1 - r));
    const P = (pred) => { let s = 0; for (const a of [true, false]) for (const b of [true, false]) if (pred(a, b)) { const v = cellP(a, b); if (!fin(v)) return NaN; s += v; } return s; };
    const evp = (e) => { const [L, neg] = e; if (L === A) return (a) => a !== neg; if (L === B) return (a, b) => b !== neg; return null; };
    return (tex) => {
      let m;
      if ((m = /^P_(\{(?:[^{}]|\{[^}]*\})*\}|\w)\((.+)\)$/.exec(tex.trim()))) { m[1] = m[1].replace(/^\{([\s\S]*)\}$/, "$1"); const g = ev(m[1]), e = ev(m[2]); if (!g || !e) return NaN; const G1 = evp(g), E1 = evp(e); if (!G1 || !E1) return NaN; return P((a, b) => G1(a, b) && E1(a, b)) / P(G1); }
      if ((m = /^P\((.+?)\s*\\(cap|cup)\s*(.+)\)$/.exec(tex.trim()))) { const e1 = ev(m[1]), e2 = ev(m[3]); if (!e1 || !e2) return NaN; const f1 = evp(e1), f2 = evp(e2); if (!f1 || !f2) return NaN; return P((a, b) => (m[2] === "cap" ? f1(a, b) && f2(a, b) : f1(a, b) || f2(a, b))); }
      if ((m = /^P\((.+)\)$/.exec(tex.trim()))) { const e = ev(m[1]); if (!e) return NaN; const f = evp(e); return f ? P(f) : NaN; }
      return NaN;
    };
  }
  /* données « P(X) = v », « P_{X}(Y) = v », « P(X \cap Y) = v » de l'énoncé → p, q, r (résolution pas à pas) */
  function probSolve(A, B, given, t) {
    let { p, q, r } = t || { p: NaN, q: NaN, r: NaN };
    const direct = (tex) => { const m = /^P_(\{(?:[^{}]|\{[^}]*\})*\}|\w)\((.+)\)$/.exec(tex.trim()); if (!m) return NaN; const g = m[1].replace(/^\{([\s\S]*)\}$/, "$1").trim(), e = m[2].trim();
      const pg = given.find(([k]) => k === "P(" + g + ")"), pi = given.find(([k]) => k === "P(" + g + " \\cap " + e + ")" || k === "P(" + e + " \\cap " + g + ")"); return pg && pi ? pi[1] / pg[1] : NaN; };
    for (let it = 0; it < 4; it++) for (const [k, v] of given) {
      const prob = probModel(A, B, p, q, r)(k); if (fin(prob)) continue;
      let m;
      if ((m = /^P\((.+)\)$/.exec(k)) && !/\\cap|\\cup/.test(k)) { const e = ev(m[1]); if (!e) continue; if (e[0] === A) p = e[1] ? 1 - v : v; else if (e[0] === B && fin(p) && fin(q)) { const pb = e[1] ? 1 - v : v; r = (pb - p * q) / (1 - p); } else if (e[0] === B && fin(p) && fin(r)) { const pb = e[1] ? 1 - v : v; q = (pb - (1 - p) * r) / p; } }
      else if ((m = /^P_(\{(?:[^{}]|\{[^}]*\})*\}|\w)\((.+)\)$/.exec(k))) { m[1] = m[1].replace(/^\{([\s\S]*)\}$/, "$1"); const g = ev(m[1]), e = ev(m[2]); if (!g || !e || g[0] !== A || e[0] !== B) continue; const w = e[1] ? 1 - v : v; if (g[1]) r = w; else q = w; }
      else if ((m = /^P\((.+?)\s*\\cap\s*(.+)\)$/.exec(k))) { const g = ev(m[1]), e = ev(m[2]); if (!g || !e || g[0] !== A || e[0] !== B) continue; const pa = g[1] ? 1 - p : p; if (!fin(pa)) continue; const w = v / pa; if (g[1]) r = e[1] ? 1 - w : w; else q = e[1] ? 1 - w : w; }
    }
    const M0 = probModel(A, B, p, q, r);
    return (tex) => { const v = M0(tex); return fin(v) ? v : direct(tex); };
  }
  const givens = (raw) => [...String(raw).matchAll(/\\\((P(?:_\{(?:[^{}]|\{[^}]*\})*\}|_\w)?\([^=]*?\))\s*=\s*([\d{},.]+)\\\)/g)].map((m) => [m[1].trim(), nb(m[2].replace(/\{,\}/g, ","))]);
  const target = (raw) => { const m = /Calcule \\\((P(?:_\{(?:[^{}]|\{[^}]*\})*\}|_\w)?\(.*?\))\\\)/.exec(raw); return m ? m[1] : null; };
  /* lettres des deux évènements, dans l'ordre de l'énoncé (« Évènements : \(M\) « … » et \(T\) « … » ») */
  const evNames = (raw) => { const m = /\\\((\w)\\\) « [^»]*» et \\\((\w)\\\) « /.exec(raw); return m ? [m[1], m[2]] : null; };
  O("probtot", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/indépendants, avec P\((\w)\) = # et P\((\w)\) = #\. Calcule P\(\w \\cup \w\)/))) { const a = m[1], b = m[3]; return a + b - a * b; }
    if ((m = c.m(/respectivement # %, # % et # % .*?taux de \S+ défectueux sont # %, # % et # %/))) { if (Math.abs(m[0] + m[1] + m[2] - 100) > 1e-9) return NaN; return (m[0] * m[3] + m[1] * m[4] + m[2] * m[5]) / 1e4; }
    if ((m = c.m(/avec la probabilité #\. On considère # \S+ (?:indépendants|\(épreuves indépendantes\)).*?au moins/))) return 1 - (1 - m[0]) ** m[1];
    const N = evNames(c.raw), T = target(c.raw); if (!N || !T) return null;
    const tr = c.fig ? treeOf(c.fig) : null; if (tr && (tr.A !== N[0] || tr.B !== N[1])) return NaN;
    return probSolve(N[0], N[1], givens(c.raw), tr)(T);
  });

  /* ========================= vaesp ========================= */
  const loi = (raw) => { const A = arr(raw); if (!A || A.length < 2) return null; return { x: A[0].slice(1), p: A[1].slice(1) }; };
  O("vaesp", (c) => {
    const F = c.F; let m;
    const L = loi(c.raw);
    if (L) {
      const xs = L.x.map(cell), ps = L.p.map(cell);
      if (/Que vaut p \?/.test(F)) { const k = L.p.indexOf("p"); if (k < 0) return null; const s = ps.reduce((a, v, i) => a + (i === k ? 0 : v), 0); return 1 - s; }
      if ((m = /calcule \\\(P\(X (<|>|\\leqslant|\\geqslant) (-?[\d{},]+)\)\\\)/.exec(c.raw))) { const op = OPS[m[1]], a = nb(m[2].replace(/\{,\}/g, ",")); return ps.reduce((s, v, i) => s + (op(xs[i], a) ? v : 0), 0); }
      if ((m = c.m(/et E\(X\) = #\. Calcule a/))) { const k = L.x.indexOf("a"); if (k < 0) return null; const s = ps.reduce((a, v, i) => a + (i === k ? 0 : v * xs[i]), 0); return (m[0] - s) / ps[k]; }
      if (Math.abs(ps.reduce((a, v) => a + v, 0) - 1) > 1e-9) return NaN;
      const E = ps.reduce((a, v, i) => a + v * xs[i], 0), Vv = ps.reduce((a, v, i) => a + v * (xs[i] - E) ** 2, 0);
      if (/espérance/.test(F)) return E; if (/variance/.test(F)) return Vv; if (/écart type|écart-type/.test(F)) return Math.sqrt(Vv);
      return null;
    }
    if ((m = c.m(/on paie # € pour lancer un dé équilibré\. On gagne # € si le dé donne 6, # € s'il donne 4 ou 5, rien sinon/))) return (m[1] + 2 * m[2]) / 6 - m[0];
    if ((m = c.m(/contient # boules rouges, # bleues et # vertes?\. On tire une boule : une rouge rapporte # €, une verte # €, une bleue rien/))) { const n = m[0] + m[1] + m[2]; return (m[0] * m[3] + m[2] * m[4]) / n; }
    if ((m = c.m(/E\(X\) = # et V\(X\) = #\. La recette horaire, en euros, est R = #X ([+-]) #/))) { const a = m[2], b = (m[3] === "-" ? -1 : 1) * m[4]; return /Calcule V\(R\)/.test(F) ? a * a * m[1] : /Calcule E\(R\)/.test(F) ? a * m[0] + b : /σ\(R\)|\\sigma\(R\)/.test(F) ? Math.abs(a) * Math.sqrt(m[1]) : null; }
    return null;
  });

  /* ========================= suitelim ========================= */
  O("suitelim", (c) => {
    const F = c.F; let m, s;
    if ((s = segAfter(c, /Détermine la limite de/)) || (s = /\\lim\\limits_\{n \\to \+\\infty\} ([\s\S]*?)\\\)/.exec(c.raw)?.[1])) {
      const e = s.replace(/^u_n\s*=\s*/, ""), f = fn(e, ["n"]); if (!f) return null;
      if (/\^\{?n|\^\{n/.test(e)) return snap(f(400), 1e-9); /* termes géométriques : (2/3)^400 négligeable */
      return snap(2 * f(2e5) - f(1e5), 1e-7); /* fraction rationnelle : f(N) ≈ ℓ + a/N (extrapolation de Richardson) */
    }
    if (/Quelle est la limite de \(u_n\)/.test(F)) { const f = un(c); return f ? snap(f(2000), 1e-9) : null; }
    if ((m = c.m(/lâchée de # m rebondit à chaque fois aux \\frac\{(\d+)\}\{(\d+)\} de la hauteur précédente/))) { const k = m[1] / m[2]; let s2 = 0, h = m[0]; for (let i = 0; i < 2000; i++) { s2 += h; h *= k; } return snap(s2, 1e-9); }
    if ((m = c.m(/on injecte # mg, puis chaque jour une dose égale aux \\frac\{(\d+)\}\{(\d+)\} de la dose de la veille/))) { const k = m[1] / m[2]; let s2 = 0, h = m[0]; for (let i = 0; i < 2000; i++) { s2 += h; h *= k; } return snap(s2, 1e-9); }
    if ((m = c.m(/u_0 = # et u_\{n\+1\} = # ?u_n ([+-]) # converge/))) { let u = m[0]; for (let i = 0; i < 3000; i++) u = m[1] * u + (m[2] === "-" ? -m[3] : m[3]); return snap(u, 1e-8); }
    if ((m = /u_n = ([^.]*?)\. La suite tend vers [^.]*?\. À partir de quel rang n a-t-on u_n - \((-?\d+)\) < ([\d,]+)/.exec(F)) || (m = /u_n = ([^.]*?)\. La suite tend vers [^.]*?\. À partir de quel rang n a-t-on u_n - (-?\d+) < ([\d,]+)/.exec(F))) { const f = fn(m[1].replace(/(\d),(\d)/g, "$1{,}$2"), ["n"]); if (!f) return null; const l = nb(m[2]), e = nb(m[3]); return first((n) => Math.abs(f(n) - l) < e && f(n) - l < e); }
    if ((m = /On pose u_0 = (-?\d+) et u_\{n\+1\} = ([^.]*?)\. La suite .*?Calcule u_\{?(\d+)\}?/.exec(F))) { const g = fn(m[2].replace(/u_n/g, "(U)"), ["U"]); if (!g) return null; let u = nb(m[1]); for (let i = 0; i < +m[3]; i++) u = g(u); return u; }
    return null;
  });

  /* ========================= binom ========================= */
  const binP = (n, p, k) => C(n, k) * p ** k * (1 - p) ** (n - k);
  /* probabilité demandée « au millième » : l'arrondi ne doit pas donner 0 ou 1 (question sans objet pour l'élève) */
  const prob3 = (v, F) => (/au millième/.test(F) && (Math.round(v * 1000) === 0 || Math.round(v * 1000) === 1000) ? { err: "probabilité " + fmt(+v.toPrecision(6)) + " arrondie au millième à " + Math.round(v) + " : question sans objet" } : v);
  O("binom", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/coefficient binomial \\binom\{(\d+)\}\{(\d+)\}\)?$/))) {
      if ((m = c.m(/schéma de Bernoulli à # épreuves comportent exactement # succès/)) || (m = c.m(/mains de # cartes peut-on former avec # cartes/)) || (m = c.m(/choisir # élèves pour une délégation parmi #/))) return /mains|délégation/.test(F) ? C(m[1], m[0]) : C(m[0], m[1]);
      return null; }
    if ((m = c.m(/loi binomiale \\mathcal\{B\}\(# ; #\)/))) { const [n, p] = m;
      if (/Calcule l'espérance E\(X\)/.test(F)) return n * p;
      if (/écart type \\sigma\(X\)|écart type σ\(X\)/.test(F)) return Math.sqrt(n * p * (1 - p));
      let k; if ((k = c.m(/Calcule P\(X = (\d+)\)/))) return prob3(binP(n, p, k[0]), F);
      if ((k = c.m(/Calcule P\(X (\\geqslant|\\leqslant|<|>) (\d+)\)/))) { const op = OPS[k[0]]; let s = 0; for (let i = 0; i <= n; i++) if (op(i, k[1])) s += binP(n, p, i); return prob3(s, F); }
      return null; }
    if ((m = c.m(/avec la probabilité #, indépendamment\. Combien de \S+ faut-il au minimum pour que la probabilité d'avoir au moins [^?]*? dépasse #/))) { const [p, s] = m; return first((n) => n > 0 && 1 - (1 - p) ** n > s); }
    if ((m = c.m(/(\d) [^;]*?; chacune? (?:passe|réussit) avec la probabilité #, indépendamment\. À l'aide d'un arbre, calcule la probabilité d'obtenir exactement # \S+ \S+ sur (\d)/)) || (m = c.m(/(\d) flèches et atteint la cible avec la probabilité #, indépendamment\. À l'aide d'un arbre, calcule la probabilité d'obtenir exactement # touches? sur (\d)/))) {
      const [n, p, k, n2] = m; if (n !== n2) return NaN; let s = 0; for (let mask = 0; mask < 2 ** n; mask++) { let b = 0, pr = 1; for (let i = 0; i < n; i++) { const ok = (mask >> i) & 1; b += ok; pr *= ok ? p : 1 - p; } if (b === k) s += pr; } return s; }
    return null;
  });

  /* ========================= tabsignes ========================= */
  O("tabsignes", (c) => {
    const F = c.F; let m, s;
    if (/Quelles valeurs de x faut-il placer dans la première ligne/.test(F)) { s = c.S.find((t) => /^[A-Za-z]\(x\)\s*=/.test(t)); if (!s) return null; const f = fn(s.replace(/^[A-Za-z]\(x\)\s*=\s*/, "")); if (!f) return null;
      const den = /\\frac\{[^}]*\}\{([^}]*)\}/.exec(s); const z = zeros(f); if (den) { const g = fn(den[1]); if (g) z.push(...zeros(g)); } return { S: z.map((v) => snap(v, 1e-7)) }; }
    if (/pour quelle valeur de x le signe change-t-il/.test(F)) { s = c.S.find((t) => /^[A-Za-z]\(x\)\s*=/.test(t)); const f = s && fn(s.replace(/^[A-Za-z]\(x\)\s*=\s*/, "")); if (!f) return null; const z = zsc(f); return z.length === 1 ? snap(z[0], 1e-7) : NaN; }
    if ((s = segAfter(c, /(?:Pour quelles valeurs de \\\(x\\\) a-t-on|Résous)/)) !== null && OPRE.test(s)) return ineq(s);
    return null;
  });

  /* ========================= tauxevol ========================= */
  O("tauxevol", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/passe de # (?:€ )?à # (?:€|habitants)[^.]*\. Compare par un quotient/))) return m[1] / m[0];
    if ((m = c.m(/passe de # (?:€ )?à # (?:€|habitants)[^.]*\. Compare par une différence/))) return m[1] - m[0];
    if ((m = c.m(/passe de # (?:€ )?à # (?:€ |habitants )?[^.]*\. Quel est le taux d'évolution, en %/))) return ((m[1] - m[0]) / m[0]) * 100;
    if ((m = c.m(/On multiplie une quantité par #\. Quel est le taux d'évolution correspondant/))) return (m[0] - 1) * 100;
    if ((m = c.m(/(Augmenter|Diminuer) une quantité de # % revient à la multiplier par quel nombre/))) return 1 + ((m[0] === "Augmenter" ? 1 : -1) * m[1]) / 100;
    if ((m = c.m(/^# % des [^.]*? et # % d'entre (?:eux|elles) [^.]*\. Quel pourcentage/))) return (m[0] * m[1]) / 100;
    if ((m = c.m(/Après une (hausse|baisse) de # %, le prix [^.]*? est de # €\. Quel était le prix avant/))) return m[2] / (1 + ((m[0] === "hausse" ? 1 : -1) * m[1]) / 100);
    if ((m = c.m(/(augmente|baisse) de # %, puis (augmente|baisse) de # %\. Quel est le taux d'évolution global/))) { const k = (1 + ((m[0] === "augmente" ? 1 : -1) * m[1]) / 100) * (1 + ((m[2] === "augmente" ? 1 : -1) * m[3]) / 100); return (k - 1) * 100; }
    if ((m = c.m(/a (baissé|augmenté) de # %\. Quel taux d'évolution le ramènerait à sa valeur de départ/))) { const k = 1 + ((m[0] === "augmenté" ? 1 : -1) * m[1]) / 100; return (1 / k - 1) * 100; }
    if ((m = c.m(/(augmente|baisse) de # % par an pendant (\d+) ans\. Quel est le taux d'évolution global/))) { let v = 1; for (let i = 0; i < m[2]; i++) v *= 1 + ((m[0] === "augmente" ? 1 : -1) * m[1]) / 100; return (v - 1) * 100; }
    if ((m = c.m(/(augmente|baisse) de # % en juin, puis évolue encore en juillet\. Sur les deux mois, l'évolution globale est de # %/))) { const k1 = 1 + ((m[0] === "augmente" ? 1 : -1) * m[1]) / 100; return ((1 + m[2] / 100) / k1 - 1) * 100; }
    return null;
  });

  /* ========================= vect3e ========================= */
  const pts = (F) => { const P = {}; for (const m of F.matchAll(/\b([A-Z])\((-?[\d,]+|[a-z]) ; (-?[\d,]+|[a-z])\)/g)) P[m[1]] = [m[2], m[3]].map((t) => (/^[a-z]$/.test(t) ? t : nb(t))); return P; };
  /* vecteurs nommés « \vec{u}\begin{pmatrix}…» ou « \overrightarrow{RS}\begin{pmatrix}…» */
  const nvecs = (raw) => { const V = {}; for (const m of String(raw).matchAll(/(?:\\vec\{(\w)\}|\\overrightarrow\{(\w+)\})(?:\\\)\\\()?\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g)) V[m[1] || m[2]] = m[3].split("\\\\").map((t) => t.trim()); return V; };
  /* quadrillage : pas = plus petit écart entre lignes f-grid verticales */
  const gridStep = (fig) => { const xs = [...new Set([...fig.matchAll(/<line x1="([\d.]+)" y1="[\d.]+" x2="\1" y2="[\d.]+" class="f-grid"/g)].map((m) => +m[1]))].sort((a, b) => a - b); let s = Infinity; for (let i = 1; i < xs.length; i++) s = Math.min(s, xs[i] - xs[i - 1]); return fin(s) ? s : NaN; };
  O("vect3e", (c) => {
    const F = c.F, P = pts(F), V = nvecs(c.raw); let m;
    const num = (a) => a.map((t) => val(t));
    if ((m = /Calcule les coordonnées du vecteur \\overrightarrow\{(\w)(\w)\}/.exec(F)) && P[m[1]] && P[m[2]]) return { P: Z.sub(P[m[2]], P[m[1]]) };
    if (/Lis les coordonnées du vecteur \\vec\{u\} dessiné sur le quadrillage/.test(F)) { const l = /<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" class="f-accent"[^>]*marker-end/.exec(c.fig), u = gridStep(c.fig); if (!l || !u) return null; return { P: [snap((+l[3] - +l[1]) / u, 1e-6), snap((+l[2] - +l[4]) / u, 1e-6)] }; }
    if ((m = /Calcule les coordonnées de \\overrightarrow\{(\w)(\w)\}/.exec(F))) { const a = Object.keys(V); if (a.length !== 2) return null; const [k1, k2] = a; if (k1[0] !== m[1] || k1[1] !== k2[0] || k2[1] !== m[2]) return NaN; return { P: Z.add(num(V[k1]), num(V[k2])) }; }
    if (/point D tel que ABCD soit un parallélogramme/.test(F)) return { P: Z.sub(Z.add(P.A, P.C), P.B) };
    if ((m = /point M tel que \\overrightarrow\{AM\} = (-?[\d,]*)\s*\\overrightarrow\{AB\}/.exec(F))) { const k = m[1] === "-" ? -1 : m[1] === "" ? 1 : nb(m[1]); return { P: Z.add(P.A, Z.mul(k, Z.sub(P.B, P.A))) }; }
    if ((m = /Calcule les coordonnées de ([^.]*?)\. Réponds/.exec(F)) && V.u && V.v) { const t = m[1].replace(/\\vec\{(\w)\}/g, "($1)"), f = fn(t, ["u", "v"]); if (!f) return null; const u = num(V.u), v = num(V.v); return { P: [0, 1].map((i) => f({ u: u[i], v: v[i] })) }; }
    if (/Calcule la norme/.test(F) && V.u) return Z.nrm(num(V.u));
    if (/Pour quelle valeur de m les vecteurs .* colinéaires/.test(F) && V.u && V.v) { const g = (k) => { const a = V.u.map((t) => fn(t, ["m"])(k)), b = V.v.map((t) => fn(t, ["m"])(k)); return a[0] * b[1] - a[1] * b[0]; }; return Z.lin(g); }
    if (/Calcule le déterminant \\det\(\\vec\{u\}, \\vec\{v\}\)/.test(F) && V.u && V.v) { const a = num(V.u), b = num(V.v); return a[0] * b[1] - a[1] * b[0]; }
    if (/Pour quelle valeur de y les points A, B, C sont-ils alignés/.test(F) && P.A && P.B && P.C) { const g = (y) => { const Cc = P.C.map((t) => (t === "y" ? y : t)); return (P.B[0] - P.A[0]) * (Cc[1] - P.A[1]) - (P.B[1] - P.A[1]) * (Cc[0] - P.A[0]); }; return Z.lin(g); }
    return null;
  });

  /* ========================= fref ========================= */
  /* repère gradué (ticks f-tick) : abscisses (text-anchor middle, sur l'axe horizontal) et ordonnées (start / end) */
  function axes(fig) {
    const T = [...fig.matchAll(/<text x="([\d.]+)" y="([\d.]+)" class="f-txt f-tick" text-anchor="(\w+)"[^>]*>(-?[\d,]+)<\/text>/g)].map((m) => ({ x: +m[1], y: +m[2], a: m[3], v: nb(m[4]) }));
    const X = T.filter((t) => t.a === "middle"), Y = T.filter((t) => t.a !== "middle");
    if (X.length < 2 || Y.length < 2) return null;
    const lin = (A, k) => { const a = A[0], b = A[A.length - 1]; return (p) => a.v + ((p - a[k]) * (b.v - a.v)) / (b[k] - a[k]); };
    return { X: lin(X, "x"), Y: lin(Y.map((t) => ({ ...t, y: t.y - 4 })), "y") };
  }
  O("fref", (c) => {
    const F = c.F; let m, s;
    if ((s = segAfter(c, /Résous/)) !== null) { if (OPRE.test(s)) return ineq(s); const p = sides(s); if (!p) return null; const z = solve(...p); return z === null ? null : { S: z }; }
    if (/Le point M est sur la courbe de la fonction inverse/.test(F)) { const A = axes(c.fig), d = /<circle cx="([\d.]+)" cy="([\d.]+)"[^>]*class="f-dot"/.exec(c.fig); if (!A || !d) return null; const x = snap(A.X(+d[1]), 1e-3), y = snap(A.Y(+d[2]), 1e-3); return Math.abs(x * y - 1) < 1e-6 ? 1 / x : NaN; }
    if ((m = c.m(/lequel des deux nombres # et # a le plus grand (inverse|carré)/))) { const f = m[2] === "inverse" ? (t) => 1 / t : (t) => t * t; return f(m[0]) > f(m[1]) ? m[0] : f(m[1]) > f(m[0]) ? m[1] : NaN; }
    if ((s = segAfter(c, /Lis les solutions de/)) !== null || (s = segAfter(c, /Résous graphiquement/i)) !== null) { if (OPRE.test(s)) { const r = ineq(s); if (r && /\\sqrt/.test(s)) { const I0 = r.I; r.I = (t) => t >= 0 && I0(t); r.pts.push(0); } return r; } const p = sides(s); if (!p) return null; const z = solve(...p); return z === null ? null : { S: z }; }
    if (/c'est la solution non nulle de/.test(F)) { s = segAfter(c, /c'est la solution non nulle de/); const p = sides(s); if (!p) return null; const z = (solve(...p) || []).filter((v) => Math.abs(v) > 1e-9); return z.length === 1 ? z[0] : NaN; }
    if ((m = c.m(/On sait que # \\le x \\le #\. Dans quel intervalle se trouve (x\^2|\\frac\{1\}\{x\})/))) { const [a, b] = m, sq = m[2] === "x^2"; if (!sq && a <= 0 && b >= 0) return NaN; const V = [a, b].map((t) => (sq ? t * t : 1 / t)); if (sq && a < 0 && b > 0) V.push(0); const lo = Math.min(...V), hi = Math.max(...V); return { I: (t) => t >= lo - 1e-12 && t <= hi + 1e-12, pts: [lo, hi] }; }
    if ((m = c.m(/fonction carré pour x \\in \[# ; #\]\. Lis sur le graphique la valeur (maximale|minimale)/))) { const a = m[0] * m[0], b = m[1] * m[1], z = m[0] <= 0 && m[1] >= 0 ? 0 : Math.min(a, b); return m[2] === "maximale" ? Math.max(a, b) : z; }
    return null;
  });

  /* ========================= probcond (2nde) : tableau croisé, arbre, faux positifs ========================= */
  const strip = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/(^|\s)[−-]\s/g, "$1moins ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const STOP = new Set(["de", "du", "la", "le", "les", "et", "un", "une", "a", "en", "des", "est", "l", "d"]);
  const words = (s) => strip(s).split(/\s+/).filter((w) => w && !STOP.has(w)).map((w) => w.slice(0, 5));
  /* tableau croisé 2 × 2 avec totaux : { rows: [l1, l2], cols: [c1, c2], n: [[a, b], [c, d]], tot } */
  function cross(raw) {
    const A = arr(raw); if (!A || A.length < 4) return null;
    const lab = (s) => s.replace(/\\text\{([^}]*)\}/g, "$1").replace(/\\boldsymbol\{\?\}/g, "?").trim();
    const H = A[0].map(lab), L = A.slice(1).map((r) => r.map(lab));
    const v = (s) => (s === "?" ? NaN : nb(s.replace(/\\,/g, "")));
    return { cols: [H[1], H[2]], rows: [L[0][0], L[1][0]], n: [[v(L[0][1]), v(L[0][2])], [v(L[1][1]), v(L[1][2])]], rt: [v(L[0][3]), v(L[1][3])], ct: [v(L[2][1]), v(L[2][2])], tot: v(L[2][3]) };
  }
  /* évènement décrit en clair → ligne ou colonne du tableau (le plus de mots communs) */
  function evCell(T, desc) {
    const W = words(desc), sc = (h) => { const H = words(h), k = H.filter((w) => W.includes(w)).length; return H.length ? k + k / H.length : 0; }, C0 = [["r", 0, T.rows[0]], ["r", 1, T.rows[1]], ["c", 0, T.cols[0]], ["c", 1, T.cols[1]]].map((e) => [...e, sc(e[2])]).sort((a, b) => b[3] - a[3]);
    return C0[0][3] > 0 && C0[0][3] > C0[1][3] ? C0[0] : null;
  }
  const cnt = (T, sel) => { let s = 0; for (const i of [0, 1]) for (const j of [0, 1]) if (sel(i, j)) s += T.n[i][j]; return s; };
  const selOf = (e) => (e[0] === "r" ? (i) => i === e[1] : (i, j) => j === e[1]);
  O("probcond", (c) => {
    const F = c.F; let m;
    const T = cross(c.raw);
    if (T) {
      if (/Complète la case manquante/.test(F)) { const { n, rt, ct } = T; for (const i of [0, 1]) for (const j of [0, 1]) if (!fin(n[i][j])) { const a = rt[i] - n[i][1 - j], b = ct[j] - n[1 - i][j]; return a === b ? a : NaN; } return null; }
      /* totaux cohérents */
      if (T.n.some((r, i) => r[0] + r[1] !== T.rt[i]) || T.ct.some((v, j) => T.n[0][j] + T.n[1][j] !== v) || T.rt[0] + T.rt[1] !== T.tot) return { err: "tableau croisé incohérent (totaux)" };
      const byLab = (lab) => { const k = [["r", 0, T.rows[0]], ["r", 1, T.rows[1]], ["c", 0, T.cols[0]], ["c", 1, T.cols[1]]].find((e) => strip(e[2]) === strip(lab)); return k || null; };
      if ((m = /Parmi les « ([^»]+) », quelle est la fréquence des « ([^»]+) »/.exec(F))) { const a = byLab(m[1]), b = byLab(m[2]); if (!a || !b) return null; return cnt(T, (i, j) => selOf(a)(i, j) && selOf(b)(i, j)) / cnt(T, selOf(a)); }
      if ((m = /Quelle est la fréquence des « ([^»]+) » parmi l'ensemble/.exec(F))) { const a = byLab(m[1]); if (!a) return null; return cnt(T, selOf(a)) / T.tot; }
      const evs = [...F.matchAll(/On note (\w) l'évènement « ([^»]+) » et (\w) l'évènement « ([^»]+) »/g)][0];
      if (evs && (m = /Calcule P_\{?(\w)\}?\((\w)\)/.exec(F))) { const E = { [evs[1]]: evCell(T, evs[2]), [evs[3]]: evCell(T, evs[4]) }; const g = E[m[1]], e = E[m[2]]; if (!g || !e) return null; if (g[0] === e[0]) return NaN; return cnt(T, (i, j) => selOf(g)(i, j) && selOf(e)(i, j)) / cnt(T, selOf(g)); }
      return null;
    }
    if ((m = c.m(/# % [^.]*\. [^.]*? (?:positif chez|sonne pour|bloque) # % [^.]*? (?:et chez |et, par erreur, (?:pour )?)# % /))) { const [p, a, b] = m.map((v) => v / 100); return (p * a) / (p * a + (1 - p) * b); }
    const evs = /On note \\\((\w)\\\) l'évènement « [^»]+ » et \\\((\w)\\\) l'évènement « /.exec(c.raw), Tg = target(c.raw);
    if (evs && Tg) { const tr = c.fig ? treeOf(c.fig) : null; if (tr && (tr.A !== evs[1] || tr.B !== evs[2])) return NaN; return probSolve(evs[1], evs[2], givens(c.raw), tr)(Tg); }
    return null;
  });

  /* ========================= algopy (2nde) ========================= */
  /* interpréteur Python minimal : def / return, if / elif / else, while, for … in range, print, affectations */
  function pyRun(code, call) {
    const src = String(code).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").split("\n").filter((l) => l.trim());
    const ind = (i) => src[i].match(/^ */)[0].length;
    const blockEnd = (i) => { const d = ind(i); let j = i + 1; while (j < src.length && ind(j) > d) j++; return j; };
    const fns = {}, out = [];
    const pmod = (a, b) => ((a % b) + b) % b;
    const tr = (e) => e.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\band\b/g, "&&").replace(/\bor\b/g, "||").replace(/\bnot\b/g, "!")
      .replace(/([\w.()]+)\s*\/\/\s*([\w.()]+)/g, "Math.floor($1/$2)").replace(/([\w.()]+)\s*%\s*([\w.()]+)/g, "__m($1,$2)").replace(/\babs\(/g, "Math.abs(").replace(/\bround\(/g, "__r(");
    const E = (e, env) => { const ks = Object.keys(env).concat(Object.keys(fns)); return Function(...ks, "__m", "__r", "return (" + tr(e) + ");")(...ks.map((k) => (k in env ? env[k] : fns[k])), pmod, (v, d = 0) => Math.round(v * 10 ** d) / 10 ** d); };
    let steps = 0; const RET = {};
    function exec(i0, i1, env) { /* rend { ret } si return */
      for (let i = i0; i < i1; ) {
        if (++steps > 2e5) throw new Error("boucle");
        const l = src[i].trim(), e = blockEnd(i); let m;
        if ((m = /^def (\w+)\((.*)\):$/.exec(l))) { const ps = m[2].split(",").map((s) => s.trim()).filter(Boolean), b0 = i + 1, b1 = e; fns[m[1]] = (...a) => { const loc = {}; ps.forEach((p, k) => (loc[p] = a[k])); const r = exec(b0, b1, loc); return r ? r.v : undefined; }; i = e; continue; }
        if ((m = /^while (.*):$/.exec(l))) { while (E(m[1], env)) { const r = exec(i + 1, e, env); if (r) return r; } i = e; continue; }
        if ((m = /^for (\w+) in range\((.*)\):$/.exec(l))) { const a = E("[" + m[2] + "]", env), [s, t, st] = a.length === 1 ? [0, a[0], 1] : [a[0], a[1], a[2] || 1]; for (let k = s; st > 0 ? k < t : k > t; k += st) { env[m[1]] = k; const r = exec(i + 1, e, env); if (r) return r; } i = e; continue; }
        if ((m = /^if (.*):$/.exec(l))) { /* chaîne if / elif / else */
          let j = i, done = false;
          while (j < i1) { const lj = src[j].trim(), ej = blockEnd(j); let mm; const cond = (mm = /^(?:if|elif) (.*):$/.exec(lj)) ? E(mm[1], env) : lj === "else:" ? true : null; if (cond === null) break;
            if (!done && cond) { done = true; const r = exec(j + 1, ej, env); if (r) return r; } j = ej; if (j >= i1 || !/^(elif .*|else):$/.test(src[j].trim()) || ind(j) !== ind(i)) break; }
          i = j; continue; }
        if ((m = /^return (.*)$/.exec(l))) return { v: E(m[1], env) };
        if ((m = /^print\((.*)\)$/.exec(l))) { out.push(E(m[1], env)); i++; continue; }
        if ((m = /^(\w+)\s*([+\-*/]?)=\s*(.*)$/.exec(l)) && !/^[=<>!]/.test(m[3])) { env[m[1]] = m[2] ? E(m[1] + m[2] + "(" + m[3] + ")", env) : E(m[3], env); i++; continue; }
        throw new Error("python non lu : " + l);
      }
      return null;
    }
    const G0 = {}; exec(0, src.length, G0); void RET;
    if (call) return E(call, G0);
    return out.length ? out[out.length - 1] : undefined;
  }
  O("algopy", (c) => {
    const pre = (c.raw.match(/<pre[^>]*>([\s\S]*?)<\/pre>/) || [])[1]; if (!pre) return null;
    const m = /Que renvoie \\\(\\texttt\{([^}]*)\}\\\)/.exec(c.raw);
    const v = pyRun(pre, m ? m[1] : null); return typeof v === "number" ? v : null;
  });

  /* ========================= expderiv (1re) ========================= */
  const fx = (c) => { const s = c.S.find((t) => /^[fgC]\((x|t)\)\s*=/.test(t)); if (!s) return null; const v = /^\w\((\w)\)/.exec(s)[1], f = fn(s.replace(/^\w\(\w\)\s*=\s*/, "").replace(/\\text\{[^}]*\}/g, ""), [v]); return f ? Object.assign(f, { tex: s }) : null; };
  O("expderiv", (c) => {
    const F = c.F, f = fx(c); let m;
    if (!f) return null;
    if (/^Donne f'\(x\)/.test(F)) return { E: (t) => d1(f, t) };
    if ((m = /Calcule (?:f|C)'\((-?[\d,]+)\)/.exec(F))) return snap(d1(f, nb(m[1])), 1e-7);
    if (/En quelle abscisse f atteint-elle son (minimum|maximum)/.test(F)) { const ex = extrema(f, 30).filter((e) => e.max === /maximum/.test(F)); return ex.length === 1 ? ex[0].x : NaN; }
    if ((m = /tangente à la courbe de f\(x\) = .*? au point d'abscisse (-?\d+)/.exec(F))) { const a = nb(m[1]), k = snap(d1(f, a), 1e-7), b = f(a); return { E: (t) => k * (t - a) + b }; }
    if ((m = /Son maximum est atteint en x = (-?[\d,]+)\. Quelle est sa valeur maximale/.exec(F))) { const a = nb(m[1]); if (Math.abs(d1(f, a)) > 1e-6) return NaN; return f(a); }
    if (/En quelles abscisses la tangente à la courbe de f est-elle horizontale/.test(F)) return { S: zeros((t) => d1(f, t), 30).map((v) => snap(v, 1e-6)) };
    return null;
  });

  /* ========================= trigrad (1re) ========================= */
  /* valeur exacte k·π/q, √ : écriture à taper (π, √) */
  const piTxt = (v) => { const r = ratOf(snap(v / Math.PI, 1e-6), 24); return r ? (r[0] === 0 ? "0" : (r[0] === 1 ? "" : r[0] === -1 ? "-" : r[0]) + "π" + (r[1] > 1 ? "/" + r[1] : "")) : null; };
  const princ = (a) => { let x = a % (2 * Math.PI); if (x <= -Math.PI) x += 2 * Math.PI; if (x > Math.PI) x -= 2 * Math.PI; return x; };
  O("trigrad", (c) => {
    const F = c.F; let m, s;
    if (/coordonnées .*Quelle est la mesure de l'angle x associé à M/.test(F)) { s = /coordonnées \\\(\\left\(([\s\S]*?) \\,;\\, ([\s\S]*?)\\right\)\\\)/.exec(c.raw); if (!s) return null; const x = val(s[1]), y = val(s[2]); if (Math.abs(x * x + y * y - 1) > 1e-9) return NaN; const a = Math.atan2(y, x); return { v: a, typed: [piTxt(a)] }; }
    if ((s = segAfter(c, /Convertis/))) { if (/°/.test(s)) { const d = nb(s.replace(/°/, "")); return { v: (d * Math.PI) / 180, typed: [piTxt((d * Math.PI) / 180)] }; } return snap((val(s.replace(/\s*\\text\{[^}]*\}/, "")) * 180) / Math.PI, 1e-9); }
    if ((s = segAfter(c, /donne la valeur exacte de/))) { const v = val(s); return { v: snap(v, 1e-12), typed: [exactTxt(v)] }; }
    if ((s = segAfter(c, /Calcule la valeur exacte de/))) return { v: val(s), typed: [s.replace(/\\(cos|sin)\\left\(([^)]*?)\\right\)/g, (u, f, a) => "(" + exactTxt(val("\\" + f + "(" + a + ")")) + ")")].map((t) => texTyped(t)) };
    if ((s = segAfter(c, /Donne la mesure principale de l'angle/))) { const a = princ(val(s)); return { v: a, typed: [piTxt(a)] }; }
    { const ks = c.S.map((t) => /^\\(cos|sin) x = (.+)$/.exec(t)).find(Boolean), iv = c.S.map((t) => /^x \\in \\left\[([\s\S]*?) \\,;\\, ([\s\S]*?)\\right\]$/.exec(t)).find(Boolean);
      if (ks && /(?:Calcule|Que vaut) \\\(/.test(c.raw.slice(c.raw.indexOf(ks[0])))) { const k = val(ks[2]), fk = ks[1]; if (!fin(k) || Math.abs(k) > 1) return NaN;
        /* les deux angles de ]-π ; π] qui ont ce cosinus (ou ce sinus) ; l'intervalle donné en garde un seul */
        let X = fk === "cos" ? [Math.acos(k), -Math.acos(k)] : [Math.asin(k), princ(Math.PI - Math.asin(k))];
        if (iv) { const lo = val(iv[1]), hi = val(iv[2]); X = X.filter((t) => [t, t - 2 * Math.PI, t + 2 * Math.PI].some((u) => u >= lo - 1e-9 && u <= hi + 1e-9)); }
        const q = (m = /(?:Calcule|Que vaut) \\\(([\s\S]*?)\\\)/.exec(c.raw.slice(c.raw.indexOf(ks[0])))) ? m[1] : null; if (!q) return null;
        const f = fn(q.replace(/\\(cos|sin) x/g, "\\$1(x)"), ["x"]); if (!f) return null;
        const V = [...new Set(X.map((t) => snap(f(t), 1e-9)))]; return V.length === 1 ? V[0] : NaN; } }
    if ((m = /tels que (\\cos|\\sin) x = (.*?)\. Sépare-les/.exec(F))) { const k = val(m[2]), z = []; for (let i = 0; i < 4; i++) { const g = (t) => (m[1] === "\\cos" ? Math.cos(t) : Math.sin(t)) - k; void g; } const a = m[1] === "\\cos" ? Math.acos(k) : Math.asin(k); const S0 = m[1] === "\\cos" ? [a, -a] : [a, Math.PI - a]; for (const v of S0) { const p = princ(v); if (!z.some((u) => Math.abs(u - p) < 1e-9)) z.push(p); } return { S: z, typed: [z.map(piTxt).join(" ; ")] }; }
    return null;
  });
  /* valeur trigonométrique remarquable → écriture exacte (√2/2, -1/2…) */
  function exactTxt(v) { const r = ratOf(v, 12); if (r) return r[1] === 1 ? String(r[0]) : r[0] + "/" + r[1]; for (const n of [2, 3]) { const q = ratOf(v / Math.sqrt(n), 12); if (q) return (q[0] < 0 ? "-" : "") + (Math.abs(q[0]) === 1 ? "" : Math.abs(q[0])) + "√" + n + (q[1] > 1 ? "/" + q[1] : ""); } return null; }
  const texTyped = (t) => t.replace(/\s+/g, "");

  /* ========================= droitenorm (1re) ========================= */
  const line = (tex) => { const m = /^([\s\S]*?)=\s*0$/.exec(tex.trim()); if (!m) return null; const f = fn(m[1], ["x", "y"]); if (!f) return null; const c0 = f({ x: 0, y: 0 }); return [f({ x: 1, y: 0 }) - c0, f({ x: 0, y: 1 }) - c0, c0]; };
  O("droitenorm", (c) => {
    const F = c.F, P = pts(F.replace(/\\Omega/g, "W")), V = nvecs(c.raw); let m;
    const dl = c.S.map((t) => /^d\s*:\s*([\s\S]*=\s*0)$/.exec(t)).find(Boolean), D = dl ? line(dl[1]) : null;
    const num = (a) => a.map((t) => val(t));
    const cOf = (n, A) => -(n[0] * A[0] + n[1] * A[1]); /* ax + by + c = 0 par A */
    const form = /a une équation de la forme \\\(([\s\S]*?)\\\)/.exec(c.raw) || /Son équation s'écrit \\\(([\s\S]*?)\\\)/.exec(c.raw);
    const N0 = form ? line(form[1].replace(/\bc\b/, "0")) : null; /* coefficients a, b imposés par la forme */
    if (/admet un vecteur directeur/.test(F) && D && V.u) { const u = V.u; const g = (k) => { const w = u.map((t) => fn(t, ["m"])(k)); return D[0] * w[0] + D[1] * w[1]; }; return Z.lin(g); }
    if (/est normal à la droite/.test(F) && D && V.u) { const u = V.u; const g = (k) => { const w = u.map((t) => fn(t, ["m"])(k)); return D[0] * w[1] - D[1] * w[0]; }; return Z.lin(g); }
    if (/pour vecteur normal\. Son équation s'écrit/.test(F) && V.n && P.A && N0) { const n = num(V.n); if (Math.abs(n[0] * N0[1] - n[1] * N0[0]) > 1e-9) return NaN; return cOf(N0, P.A); }
    if (/La droite perpendiculaire à \(AB\) passant par C/.test(F) && N0) { const n = Z.sub(P.B, P.A); if (Math.abs(n[0] * N0[1] - n[1] * N0[0]) > 1e-9) return NaN; return cOf(N0, P.C); }
    if (/La tangente au cercle en A/.test(F) && N0 && P.W) { const n = Z.sub(P.A, P.W); if (Math.abs(n[0] * N0[1] - n[1] * N0[0]) > 1e-9) return NaN; return cOf(N0, P.A); }
    if (/La médiatrice de \[AB\]/.test(F) && N0) { const n = Z.sub(P.B, P.A), I = Z.mul(0.5, Z.add(P.A, P.B)); if (Math.abs(n[0] * N0[1] - n[1] * N0[0]) > 1e-9) return NaN; return cOf(N0, I); }
    if (/la hauteur issue de C/.test(F) && N0) { const n = Z.sub(P.B, P.A); if (Math.abs(n[0] * N0[1] - n[1] * N0[0]) > 1e-9) return NaN; return cOf(N0, P.C); }
    if (/projeté orthogonal H du point P.* sur la droite d :/.test(F) && D) { const n = [D[0], D[1]], t = -(D[0] * P.P[0] + D[1] * P.P[1] + D[2]) / Z.dot(n, n); return { P: Z.add(P.P, Z.mul(t, n)) }; }
    if (/projeté orthogonal H de P/.test(F) && V.u && P.A) { const u = num(V.u), t = Z.dot(Z.sub(P.P, P.A), u) / Z.dot(u, u); return { P: Z.add(P.A, Z.mul(t, u)) }; }
    return null;
  });

  /* ========================= tabvar (2nde) ========================= */
  /* tableau de variations TeX → nœuds { x, y } (±∞ admis) ; les flèches doivent être cohérentes */
  function tv(raw) {
    const A = arr(raw); if (!A || A.length < 2) return null;
    const inf = (s) => (/^-\\infty$/.test(s) ? -Infinity : /^\+?\\infty$/.test(s) ? Infinity : cell(s));
    const xs = A[0].slice(1).filter((s) => s !== "").map(inf), row = A[1].slice(1), ys = row.filter((s) => !/nearrow|searrow/.test(s) && s !== "").map(inf), ar = row.filter((s) => /nearrow|searrow/.test(s)).map((s) => (/nearrow/.test(s) ? 1 : -1));
    if (xs.length !== ys.length || ar.length !== xs.length - 1) return null;
    for (let i = 0; i < ar.length; i++) if (Math.sign(ys[i + 1] - ys[i]) !== ar[i]) return { bad: true };
    return { xs, ys, ar };
  }
  /* nombre de solutions de f(x) = k sur [a ; b] (a, b : nœuds du tableau) */
  const nsol = (T, k, a = T.xs[0], b = T.xs[T.xs.length - 1]) => { const i0 = T.xs.indexOf(a), i1 = T.xs.indexOf(b); if (i0 < 0 || i1 < 0) return NaN; let n = 0; for (let i = i0; i <= i1; i++) if (T.ys[i] === k) n++; for (let i = i0; i < i1; i++) { const lo = Math.min(T.ys[i], T.ys[i + 1]), hi = Math.max(T.ys[i], T.ys[i + 1]); if (k > lo && k < hi) n++; } return n; };
  O("tabvar tvi", (c) => {
    const F = c.F; let m;
    const T = tv(c.raw);
    if (T && T.bad) return { err: "tableau de variations incohérent (flèche contraire aux valeurs)" };
    if (T) {
      const seg = (x) => T.xs.findIndex((u, i) => i < T.xs.length - 1 && x >= u && x <= T.xs[i + 1]);
      if ((m = c.m(/Sans connaître f\(#\) ni f\(#\), lequel/))) { const [a, b] = m, i = seg(a), j = seg(b); if (i < 0 || i !== j) return NaN; return (T.ar[i] > 0) === (b > a) ? b : a; }
      if ((m = /Sur quel intervalle f est-elle (dé)?croissante/.exec(F))) { const w = m[1] ? -1 : 1, S0 = T.ar.map((a, i) => (a === w ? i : -1)).filter((i) => i >= 0); if (S0.length !== 1) return NaN; const lo = T.xs[S0[0]], hi = T.xs[S0[0] + 1]; return { I: (t) => t >= lo && t <= hi, pts: [lo, hi] }; }
      if ((m = c.m(/Quel est le (maximum|minimum) de f sur (?:l'intervalle )?\[# ; #\]/))) { const i0 = T.xs.indexOf(m[1]), i1 = T.xs.indexOf(m[2]); if (i0 < 0 || i1 < 0) return NaN; const Y = T.ys.slice(i0, i1 + 1); return m[0] === "maximum" ? Math.max(...Y) : Math.min(...Y); }
      if ((m = c.m(/Combien de solutions l'équation f\(x\) = # a-t-elle sur \[# ; #\]/))) return nsol(T, m[0], m[1], m[2]);
      if ((m = c.m(/Combien de solutions l'équation f\(x\) = # a-t-elle \?/))) return nsol(T, m[0]);
      if (/Combien de fois la courbe de f coupe-t-elle l'axe des abscisses/.test(F)) return nsol(T, 0);
      if (/dans quel intervalle f\(x\) prend-elle ses valeurs/.test(F)) { const lo = Math.min(...T.ys), hi = Math.max(...T.ys); return { I: (t) => t >= lo && t <= hi, pts: [lo, hi] }; }
      return null;
    }
    if ((m = c.m(/Soit f\(x\) = .*? sur \[# ; #\]\. Dresse son tableau de variations\. Quel est son (maximum|minimum)/))) { const f = fx(c); if (!f) return null; return snap(Z.opt(f, m[0], m[1], m[2] === "maximum" ? 1 : -1)[1], 1e-7); }
    /* tvi */
    if ((m = c.m(/strictement (dé)?croissante sur \[# ; #\], avec f\(#\) = # et f\(#\) = #\. Pour combien d'entiers k/))) { const [, a, b, a2, fa, b2, fb] = m; if (a2 !== a || b2 !== b || (m[0] ? fa < fb : fa > fb)) return NaN; return Math.floor(Math.max(fa, fb)) - Math.ceil(Math.min(fa, fb)) + 1; }
    if ((m = /L'équation \\\(([\s\S]*?)\\\) a une unique solution \\\(\\alpha\\\)/.exec(c.raw))) {
      const p = sides(m[1]); if (!p) return null; const z = solve(...p, 60).filter((v) => !/\\ln/.test(m[1]) || v > 0); if (z.length !== 1) return NaN; const a = z[0];
      if (/Quel est l'entier n tel que n < \\alpha < n \+ 1/.test(F)) return Number.isInteger(a) ? NaN : Math.floor(a);
      if (/par défaut au dixième/.test(F)) return { v: a, dir: -1 };
      if (/à 0,01 près/.test(F)) return a;
      return null; }
    if ((m = /On cherche la solution \\alpha de ([\s\S]*?) = 0 par dichotomie\. On sait que f\((#)\) < 0 et f\((#)\) > 0\. On calcule f\((#)\)\. Quelle est la borne (gauche|droite)/.exec(F.replace(/#/g, "")) && null)) return null;
    if ((m = /On cherche la solution \\alpha de (.*?) = 0 par dichotomie\. On sait que f\((-?[\d,]+)\) ([<>]) 0 et f\((-?[\d,]+)\) ([<>]) 0\. On calcule f\((-?[\d,]+)\)\. Quelle est la borne (gauche|droite)/.exec(F))) {
      const f = fn(m[1].replace(/(\d),(\d)/g, "$1{,}$2")); if (!f) return null; const a = nb(m[2]), b = nb(m[4]), mid = nb(m[6]); if (Math.sign(f(a)) !== (m[3] === "<" ? -1 : 1) || Math.sign(f(b)) !== (m[5] === "<" ? -1 : 1) || Math.abs(mid - (a + b) / 2) > 1e-9) return NaN;
      const [lo, hi] = Math.sign(f(mid)) === Math.sign(f(a)) ? [mid, b] : [a, mid]; return m[7] === "gauche" ? lo : hi; }
    if ((m = /Combien de solutions l'équation \\\(([\s\S]*?)\\\) a-t-elle sur \\\(\\mathbb\{R\}\\\)/.exec(c.raw))) { const p = sides(m[1]); if (!p) return null; return solve(...p, 60).length; }
    if ((m = c.m(/u_0 = # et u_\{n\+1\} = \\sqrt\{u_n \+ #\}\. On admet qu'elle converge/))) { let u = m[0]; for (let i = 0; i < 200; i++) u = Math.sqrt(u + m[1]); return snap(u, 1e-9); }
    return null;
  });

  /* ========================= lnfr (Tle) ========================= */
  O("lnfr", (c) => {
    const F = c.F; let m, s;
    const lnN = (t) => t.replace(/\\ln (\d+(?:\\,\d{3})*)/g, (u, k) => "\\ln(" + k.replace(/\\,/g, "") + ")");
    if ((s = segAfter(c, /Écris/)) && /sous la forme \\ln k\. Que vaut k/.test(F)) return snap(Math.exp(val(lnN(s))), 1e-9);
    if ((s = segAfter(c, /Écris/)) && (m = /sous la forme k\\ln (\d+)\. Que vaut k/.exec(F))) return snap(val(lnN(s)) / Math.log(+m[1]), 1e-9);
    if ((m = /Résous \\\(\(\\ln x\)\^2 ([\s\S]*?) = 0\\\)/.exec(c.raw))) { const f = fn("X^2 " + m[1].replace(/\\ln x/g, "X"), ["X"]); if (!f) return null; const z = zeros(f, 60).map((v) => snap(v, 1e-9)); return { S: z.map(Math.exp), typed: [z.map((v) => "e^" + (v < 0 ? "(" + v + ")" : v)).join(" ; ")] }; }
    if ((s = segAfter(c, /Résous/)) !== null) { const p = sides(s); if (!p) return null; const z = solve(...p, 60); if (z === null) return null;
      let typed; if (z.length === 1 && /valeur exacte/.test(F)) { let k; if ((k = /^\\ln\((-?\d*)x ([+-]) (\d+)\) = (-?\d+)$/.exec(s))) { const a = k[1] === "" ? 1 : k[1] === "-" ? -1 : +k[1], b = (k[2] === "-" ? -1 : 1) * +k[3]; typed = ["(e^(" + k[4] + ")" + (b < 0 ? "+" + -b : "-" + b) + ")/(" + a + ")"]; } else if ((k = /^\\ln\(x ([+-]) (\d+)\) = (-?\d+)$/.exec(s))) typed = ["e^(" + k[3] + ")" + (k[1] === "-" ? "+" : "-") + k[2]]; else if ((k = /^e\^\{x\} = (\d+)$/.exec(s))) typed = ["ln(" + k[1] + ")"]; }
      return z.length === 1 ? { v: z[0], typed } : { S: z }; }
    if ((m = c.m(/\(On résout #\^n \\geqslant #\.\)/))) { const [q, k] = m; const pct = c.m(/de # % par an/); if (pct && Math.abs(1 + pct[0] / 100 - q) > 1e-9) return NaN; const w = /triple/.test(F) ? 3 : /double/.test(F) ? 2 : /augmente de moitié/.test(F) ? 1.5 : NaN; if (w !== k) return NaN; return first((n) => q ** n >= k - 1e-12); }
    if ((m = c.m(/# % de [^;]*?(?:chaque heure|chaque année) ; (?:il en reste|il en compte|il abrite|elle vaut) # (?:mg|poissons|€)? ?au départ\. À partir de quel rang n a-t-on u_n = # \\times #\^n < #/))) { const [t, A, A2, q, L] = m; if (A !== A2 || Math.abs(1 - t / 100 - q) > 1e-9) return NaN; return first((n) => A * q ** n < L); }
    return null;
  });

  /* ========================= trigfr (Tle) ========================= */
  const ivl = (c) => { const s = c.S.map((t) => /^(\]|\[)([\s\S]*?) \\,;\\, ([\s\S]*?)(\]|\[)$/.exec(t)).find(Boolean); if (!s) return null; const a = val(s[2]), b = val(s[3]); return { a, b, I: (t) => (s[1] === "[" ? t >= a - 1e-12 : t > a + 1e-12) && (s[4] === "]" ? t <= b + 1e-12 : t < b - 1e-12) }; };
  O("trigfr", (c) => {
    const F = c.F; let m, s;
    const f = fx(c);
    if (f && (m = /Calcule \\\(f\\left\(([\s\S]*?)\\right\)\\\)/.exec(c.raw))) return snap(f(val(m[1])), 1e-9);
    if (f && /^Donne f'\(x\)/.test(F)) return { E: (t) => d1(f, t) };
    if ((s = segAfter(c, /Résous/)) !== null) { const J = ivl(c); if (!J) return null;
      if (OPRE.test(s)) { const r = ineq(s); if (!r) return null; return { I: (t) => J.I(t) && r.I(t), pts: [...r.pts, J.a, J.b] }; }
      const p = sides(s); if (!p) return null; const z = (solve(...p, 12) || []).map((v) => snap(v, 1e-9)).filter(J.I); return { S: z, typed: [z.map(piTxt).join(" ; ")] }; }
    if ((m = /plus petite période positive de f\(x\) = (-?\d*)\\(sin|cos)\((\d*)x\)/.exec(F))) { const w = m[3] === "" ? 1 : +m[3], T0 = (2 * Math.PI) / w; return { v: T0, typed: [piTxt(T0)] }; }
    if (f && (m = /En quelles valeurs f' s'annule-t-elle/.exec(F))) { const J = ivl(c); if (!J) return null; const z = zeros((t) => d1(f, t), 12).map((v) => snap(v / Math.PI, 1e-6) * Math.PI).filter(J.I); return { S: z, typed: [z.map(piTxt).join(" ; ")] }; }
    if ((m = /Combien de solutions l'équation \\\(([\s\S]*?)\\\) a-t-elle sur \\\(([\s\S]*?)\\\)/.exec(c.raw))) { const p = sides(m[1]); const J = ivl({ S: [m[2]] }); if (!p || !J) return null; return (solve(...p, 20) || []).map((v) => snap(v, 1e-9)).filter(J.I).length; }
    if ((m = /Calcule \\\(\\lim_\{x \\to 0\} ([\s\S]*?)\\\)/.exec(c.raw))) { const g = fn(m[1]); return g ? lim(g, 0) : null; }
    return null;
  });

  /* ========================= sommeva (Tle) ========================= */
  O("sommeva", (c) => {
    const F = c.F; let m;
    if ((m = c.m(/On répète # fois, [^.]*?E\(X\) = # et V\(X\) = #\. Soit M_n la moyenne des # résultats\. Calcule (V|E)\(M_n\)/))) { if (m[0] !== m[3]) return NaN; return m[4] === "V" ? m[2] / m[0] : m[1]; }
    if ((m = c.m(/(?:E|V)\(X\) = # et (?:E|V)\(Y\) = #\. Calcule (E|V)\((-?\d*)X ([+-]) (\d*)Y\)/))) { const a = m[3] === "" ? 1 : m[3] === "-" ? -1 : +m[3], b = (m[4] === "-" ? -1 : 1) * (m[5] === "" ? 1 : +m[5]);
      if (m[2] === "E") return /E\(X\) = .* et E\(Y\)/.test(F) ? a * m[0] + b * m[1] : null; if (!/indépendantes/.test(F)) return NaN; return a * a * m[0] + b * b * m[1]; }
    if ((m = c.m(/On lance # dés équilibrés à six faces .*?Calcule (V|E)\(S\)/))) { const faces = [1, 2, 3, 4, 5, 6], E1 = mean(faces), V1 = mean(faces.map((v) => (v - E1) ** 2)); return m[1] === "V" ? m[0] * V1 : m[0] * E1; }
    if ((m = c.m(/(?:On lance|On interroge|Un serveur reçoit) # (?:fois une pièce truquée qui tombe sur pile|personnes ; chacune a voté|requêtes ; chacune échoue indépendamment) avec la probabilité #\. .*?Calcule (V|E)\(S\)/))) return m[2] === "V" ? m[0] * m[1] * (1 - m[1]) : m[0] * m[1];
    if ((m = c.m(/E\(X\) = # et V\(X\) = #\. D'après l'inégalité de Bienaymé-Tchebychev, quel majorant obtient-on pour P\(\|X - #\| \\geqslant #\)/))) { if (m[2] !== m[0]) return NaN; return m[1] / m[3] ** 2; }
    if ((m = c.m(/\(variance #\), .*?P\(\|M_n - \\mu\| \\geqslant #\) \\leqslant .*?À partir de quelle valeur de n ce majorant est-il inférieur ou égal à #/))) { const [V, d, a] = m; return first((n) => n > 0 && V <= a * n * d * d * (1 + 1e-12), 1e7); }
    if ((m = c.m(/E\(X\) = # et V\(X\) = #\. Donne un minorant de P\(# < X < #\)/))) { const [E0, V, a, b] = m; if (Math.abs((a + b) / 2 - E0) > 1e-9) return NaN; return 1 - V / ((b - a) / 2) ** 2; }
    if ((m = c.m(/on gagne # € avec la probabilité # et on perd # € sinon\. On joue # parties indépendantes .*?Calcule E\(G\)/))) return m[3] * (m[0] * m[1] - m[2] * (1 - m[1]));
    return null;
  });

  /* ========================= recurrence (Tle) ========================= */
  O("recurrence", (c) => {
    const F = c.F; let m;
    const P0 = [0, 1, 2, 3, 4, 5, 6];
    if (/quel terme ajoute-t-on/.test(F)) { const s = /On démontre par récurrence que \\\(([\s\S]*?) = ([\s\S]*?)\\\)/.exec(c.raw); if (!s) return null; const S = fn(s[2], ["n"]); return S ? { E: (n) => S(n + 1) - S(n), v0: "n", pts: [1, 2, 3, 4, 5, 6] } : null; }
    if ((m = /on veut montrer que \\\(u_n = ([\s\S]*?)\\\) pour la suite \\\(u_\{n\+1\} = ([\s\S]*?)\\\)/.exec(c.raw))) { const U = fn(m[1], ["n"]), g = fn(m[2].replace(/u_n/g, "(U)"), ["U"]); if (!U || !g) return null; return { E: (n) => g(U(n)), v0: "n", pts: P0 }; }
    const R0 = /u_0 = (-?\d+)\\?\)? et \\?\(?u_\{n\+1\} = ([^.]*?)(?:\\\))?(?:\.| pour)/.exec(c.raw.replace(/\\\(|\\\)/g, ""));
    if (R0 && /conjecture/.test(F) && c.x.spec.kind === "expr") { const g = fn(R0[2].replace(/u_n/g, "(U)"), ["U", "n"]); if (!g) return null; const u = [nb(R0[1])]; for (let n = 0; n < 8; n++) u.push(g({ U: u[n], n })); return { E: (n) => u[n], v0: "n", pts: P0 }; }
    if (R0 && /Que vaut (M|L) \?/.test(F)) { const g = fn(R0[2].replace(/u_n/g, "(U)"), ["U", "n"]); if (!g) return null; let u = nb(R0[1]); for (let i = 0; i < 3000; i++) u = g({ U: u, n: i }); const L = snap(u, 1e-8); if (/minorée/.test(F) && !(nb(R0[1]) >= L)) return NaN; if (/majorée/.test(F) && !(nb(R0[1]) <= L)) return NaN; return L; }
    if (R0 && (m = /On pose v_n = u_n ([+-]) (\d+) : \(v_n\) est géométrique de raison (-?[\d,]+)\. Que vaut v_\{?(\d+)\}?/.exec(F))) { const g = fn(R0[2].replace(/u_n/g, "(U)"), ["U", "n"]); if (!g) return null; let u = nb(R0[1]); for (let i = 0; i < +m[4]; i++) u = g({ U: u, n: i }); const v = u + (m[1] === "-" ? -1 : 1) * +m[2]; const v0 = nb(R0[1]) + (m[1] === "-" ? -1 : 1) * +m[2]; return Math.abs(v - v0 * nb(m[3]) ** +m[4]) > 1e-6 ? NaN : v; }
    if ((m = /La propriété \\\(P\(n\) : ([\s\S]*?) (\\geqslant|>) ([\s\S]*?)\\\) est fausse pour certains petits entiers/.exec(c.raw))) {
      const ev2 = (t, n) => { if (/n!/.test(t)) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; } return fn(t, ["n"])(n); }; const P = (n) => (m[2] === ">" ? ev2(m[1], n) > ev2(m[3], n) : ev2(m[1], n) >= ev2(m[3], n));
      let n0 = NaN; for (let n = 1; n <= 60; n++) if (!P(n)) n0 = n + 1; return n0; }
    return null;
  });

  /* ========================= compdiff (2nde) ========================= */
  const AB = (c) => { const a = c.S.find((t) => /^A\s*=/.test(t)), b = c.S.find((t) => /^B\s*=/.test(t)); return a && b ? [a.replace(/^A\s*=\s*/, ""), b.replace(/^B\s*=\s*/, "")] : null; };
  O("compdiff", (c) => {
    const F = c.F; let m;
    const ab = AB(c);
    if (ab && /on compare A = .* et B = .* en calculant A - B\. Que vaut A - B/.test(F)) { const A = fn(ab[0]), B = fn(ab[1]); if (!A || !B) return null; const v = [0.3, 1.7, -2.2].map((t) => snap(A(t) - B(t), 1e-9)); return v.every((u) => u === v[0]) ? v[0] : NaN; }
    if (ab && /On obtient A - B = \(x - k\)\^2/.test(F)) { const A = fn(ab[0]), B = fn(ab[1]); const z = zeros((t) => A(t) - B(t)); return z.length === 1 ? snap(z[0], 1e-6) : NaN; }
    if (ab && /on calcule \\frac\{A\}\{B\}\. Que vaut ce quotient/.test(F)) return val(ab[0]) / val(ab[1]);
    if (ab && /on calcule A - B\. Donne A - B sous forme de fraction/.test(F)) return val(ab[0]) - val(ab[1]);
    if (ab && /par leurs carrés\. Que vaut A\^2 - B\^2/.test(F)) return snap(val(ab[0]) ** 2 - val(ab[1]) ** 2, 1e-9);
    if ((m = c.m(/A (?:a vendu|compte|a reçu) # [^,]*, une? \S+ B en (?:a vendu|compte|a reçu) #\. Pour comparer, on calcule le quotient/))) return m[0] / m[1];
    if (ab && (m = /\\frac\{A\}\{B\} = q\^\{?(\d+)\}?\. Quelle est la fraction q/.exec(F))) { const e = (t) => { const k = /^(\d+)\^\{?(\d+)\}?$/.exec(t.trim()); return k ? +k[2] * Math.log(+k[1]) : NaN; }; return snap(Math.exp((e(ab[0]) - e(ab[1])) / +m[1]), 1e-9); }
    if ((m = c.m(/(augmente|baisse) de # %, puis (augmente|baisse) de # %\. On compare la valeur finale/))) return (1 + ((m[0] === "augmente" ? 1 : -1) * m[1]) / 100) * (1 + ((m[2] === "augmente" ? 1 : -1) * m[3]) / 100);
    if (ab && /On obtient A - B = \\frac\{k\}\{([^}]*)\}\. Que vaut k/.test(F)) { const A = fn(ab[0], ["n"]), B = fn(ab[1], ["n"]), D = fn(/A - B = \\frac\{k\}\{([^}]*)\}/.exec(F)[1].replace(/n\(/g, "n*("), ["n"]); if (!A || !B || !D) return null; const v = [1, 2, 5].map((n) => snap((A(n) - B(n)) * D(n), 1e-9)); return v.every((u) => u === v[0]) ? v[0] : NaN; }
    return null;
  });

  /* ========================= posrelc (1re) ========================= */
  O("posrelc", (c) => {
    const F = c.F; let m;
    const D = c.D, f = D.f, g = D.g;
    if (f && g && /se coupent en un seul point\. Quelle est son abscisse/.test(F)) { const z = solve(f, g); return z && z.length === 1 ? z[0] : NaN; }
    if (f && g && /la courbe de f est(?:-elle)? strictement au-dessus de celle de g/.test(F)) { const pts0 = solve(f, g) || []; return { I: (t) => f(t) > g(t) + 1e-12, pts: pts0 }; }
    if (f && g && /En quelle abscisse se touchent-elles/.test(F)) { const z = solve(f, g); return z && z.length === 1 ? z[0] : NaN; }
    if ((m = /h\(x\) = ([\s\S]*?)\\\)\. Quel est le minimum de \\\(h\\\)/.exec(c.raw))) { const h = fn(m[1]); return h ? Z.opt(h, -20, 20, -1)[1] : null; }
    if ((m = /la parabole \\\(y = ([\s\S]*?)\\\) est-elle strictement au-dessous de la droite \\\(y = ([\s\S]*?)\\\)/.exec(c.raw))) { const p = fn(m[1]), d = fn(m[2]); if (!p || !d) return null; return { I: (t) => p(t) < d(t) - 1e-12, pts: solve(p, d) || [] }; }
    if ((m = /tangente à la courbe de \\\(f\(x\) = ([\s\S]*?)\\\) au point d'abscisse \\\((-?\d+)\\\) a pour équation \\\(y = ([\s\S]*?)\\\)\. En quelle autre abscisse/.exec(c.raw))) { const ff = fn(m[1]), a = +m[2], t = fn(m[3]); if (!ff || !t) return null; if (Math.abs(ff(a) - t(a)) > 1e-9 || Math.abs(d1(ff, a) - d1(t, a)) > 1e-6) return NaN; const z = (solve(ff, t) || []).filter((v) => Math.abs(v - a) > 1e-6); return z.length === 1 ? z[0] : NaN; }
    if ((m = /la droite \\\(y = m\\\) est-elle strictement au-dessous de la parabole \\\(y = ([\s\S]*?)\\\) pour tout réel/.exec(c.raw))) { const p = fn(m[1]); if (!p) return null; const mn = snap(Z.opt(p, -50, 50, -1)[1], 1e-7); return { I: (t) => t < mn, pts: [mn] }; }
    return null;
  });

  /* ========================= intmaj (Tle) ========================= */
  const intB = (c) => { const m = /\\int_\{?([^}\s]+)\}?\^\{?\\?,?\s*([^}\s]+?)\}? ([\s\S]*?)\\,?dx/.exec(c.raw); return m ? { a: val(m[1]), b: val(m[2].replace(/^\\,/, "")), f: m[3] } : null; };
  O("intmaj", (c) => {
    const F = c.F; let m;
    const bound = (v, kind, f, a, b) => { /* garde-fou : le minorant (majorant) doit l'être vraiment */ if (f) { const I = integ(f, a, b); if (kind === "min" ? v > I + 1e-9 : v < I - 1e-9) return { err: (kind === "min" ? "minorant " : "majorant ") + fmt(v) + " incompatible avec l'intégrale " + fmt(I) }; } return v; };
    if ((m = c.m(/vérifie # \\leqslant f\(x\) \\leqslant # pour tout x \\in \[# ; #\]\. Quel (minorant|majorant)/))) { const [lo, hi, a, b] = m; return (m[4] === "minorant" ? lo : hi) * (b - a); }
    if ((m = c.m(/est (croissante|décroissante) sur \[# ; #\], avec f\(#\) = # et f\(#\) = #\. Quel (minorant|majorant)/))) { const f = fx(c), [, a, b, a2, fa, b2, fb] = m; if (!f || a2 !== a || b2 !== b || Math.abs(f(a) - fa) > 1e-9 || Math.abs(f(b) - fb) > 1e-9) return NaN; const lo = Math.min(fa, fb), hi = Math.max(fa, fb); return bound((m[7] === "minorant" ? lo : hi) * (b - a), m[7] === "minorant" ? "min" : "max", f, a, b); }
    if ((m = c.m(/La valeur moyenne d'une fonction continue f sur \[# ; #\] vaut #\. Que vaut/))) return m[2] * (m[1] - m[0]);
    if ((m = c.m(/est décroissante sur \[# ; #\]\. En déduis un (minorant|majorant)/))) { const f = fx(c), [a, b] = m; if (!f) return null; return bound((m[2] === "majorant" ? f(a) : f(b)) * (b - a), m[2] === "majorant" ? "max" : "min", f, a, b); }
    if ((m = /En comparant \\\(([\s\S]*?)\\\) et \\\(([\s\S]*?)\\\), quel (minorant|majorant) de \\\(\\int_0\^\{\\,1\} ([\s\S]*?)\\,dx\\\)/.exec(c.raw))) { const f1 = fn(m[1]), f2 = fn(m[2]), h = fn(m[4]); if (!f1 || !f2 || !h) return null; const other = Math.abs(f1(0.37) - h(0.37)) < 1e-12 ? f2 : f1, v = integ(other, 0, 1); return bound(v, m[3] === "minorant" ? "min" : "max", h, 0, 1); }
    if ((m = /Majore \\\(I = \\int_0\^\{(\d+)\} ([\s\S]*?)\\,dx\\\) par l'intégrale de \\\(([\s\S]*?)\\\)/.exec(c.raw))) { const b = +m[1], h = fn(m[2]), g0 = fn(m[3]); if (!h || !g0) return null; return bound(integ(g0, 0, b), "max", h, 0, b); }
    if ((m = c.m(/On encadre \\int_1\^2 \\frac\{dx\}\{x\} par la méthode des rectangles avec # rectangles .*?la valeur à (gauche|droite) donnent un (majorant|minorant)/))) { const n = m[0], w = 1 / n; let s = 0; for (let i = 0; i < n; i++) s += w / (1 + (i + (m[1] === "gauche" ? 0 : 1)) * w); return bound(s, m[2] === "minorant" ? "min" : "max", (t) => 1 / t, 1, 2); }
    if ((m = c.m(/Donne le (majorant|minorant) de I_\{?(\d+)\}? obtenu en intégrant/))) { const n = m[1], h = (t) => t ** n / (1 + t); return bound(m[0] === "majorant" ? 1 / (n + 1) : 1 / (2 * (n + 1)), m[0] === "majorant" ? "max" : "min", h, 0, 1); }
    if ((m = c.m(/0 \\leqslant I_n \\leqslant \\frac\{1\}\{n \+ 1\} pour tout entier n\. À partir de quel entier n l'encadrement garantit-il I_n \\leqslant #/))) return first((n) => 1 / (n + 1) <= m[0] + 1e-12);
    return null;
  });

  /* ========================= suiteint (Tle) : intégrales calculées numériquement ========================= */
  O("suiteint", (c) => {
    const F = c.F; let m;
    const def = /([IJW])_n = \\int_\{?([^}]*?)\}?\^\{?\\?,?\s*([^}]*?(?:\\frac\{[^}]*\}\{[^}]*\})?)\}? ([\s\S]*?)\\,dx/.exec(c.raw); if (!def) return null;
    const a = val(def[2]), b = val(def[3].replace(/^\\,\s*/, "")), I = (n) => { const g = fn(def[4].replace(/\\sin\^n x/g, "(\\sin(x))^n").replace(/\^\{n\}|\^n\b/g, "^{(" + n + ")}").replace(/-nx/g, "-(" + n + ")x"), ["x"]); return g ? integ(g, a, b) : NaN; };
    if ((m = /Calcule \\\(I_\{(\d+)\} - I_\{(\d+)\}\\\)/.exec(c.raw))) return I(+m[1]) - I(+m[2]);
    if ((m = /Calcule \\\([IJW]_\{?(\d+)\}?\\\)/.exec(c.raw))) return snap(I(+m[1]), 1e-9);
    if ((m = c.m(/Quel est le plus petit entier n tel que J_n < #/))) return first((n) => n >= 1 && I(n) < m[0]);
    if (/Vers quelle limite tend n I_n/.test(F)) { const v1 = 400 * I(400), v2 = 800 * I(800); return 2 * v2 - v1; }
    return null;
  });

  for (const o of LIST.reverse()) G.unshift(o);
  R.IDSFRL = IDS;
  R._frl = { O, flat, figDots, py, LIST };
})();
