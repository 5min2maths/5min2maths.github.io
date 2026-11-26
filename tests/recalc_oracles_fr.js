/* Recalcul indépendant des défis (niveau 4) du profil France rendus variés le 26.11 au soir (agent defisfr).
   Chargé après tests/recalc_oracles.js (RECALC) par tests/recalcul_fr.html et tests/_defisfr.html : chaque règle relit les
   nombres du texte que l'élève voit (énoncé ¶ question), refait le calcul par une autre voie (boucle, recherche
   numérique, dénombrement, formule de cours) et rend la valeur attendue ; RECALC.check la compare à la réponse attendue,
   à l'arrondi demandé et au corrigé. Une règle par contexte (tag ctx) ; null = question non reconnue (la page de test
   échoue alors : toutes les parties de ces défis doivent être reconnues). NaN = énoncé incohérent.
   Les règles sont placées EN TÊTE de RECALC.RULES et réservées aux notions françaises (ids) : les règles génériques du
   fichier commun ne les voient pas avant elles. */
const RECALC_FR = (() => {
  const IDS = ["proba2", "tauxevol", "vect3e", "probcond", "algopy", "expderiv", "trigrad", "autodnb", "tabvar", "lnfr", "hauteurs5", "tabform5", "cercle6", "bissec6", "filtre6", "progcalc", "ratio"];
  const nn = (s) => +String(s).replace(/[\s'’ ]/g, "").replace(",", ".").replace(/[−–]/g, "-");
  const NB = "(−?-?\\d[\\d\\s\\u202f]*(?:,\\d+)?)"; /* nombre écrit à la française */
  const E = "(?= ¶)"; /* fin de l'énoncé */
  const rules = [];
  /* id, regex sur le texte « énoncé ¶ question », f(groupes, question, texte, item) → valeur ou null */
  const DF = (ids, re, f) => rules.push({ ids: new Set(ids.split(" ")), re, f: (txt, x) => { const m = re.exec(txt); if (!m || !/ ¶ /.test(txt)) return null; const lab = txt.split(" ¶ ").slice(1).join(" ¶ "); const v = f(m.slice(1), lab, txt, x); return v === null || v === undefined ? null : v; }, o: { text: true } });
  const L = (lab, re) => { const m = re.exec(lab); return m ? m.slice(1).map(nn) : null; };
  const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));

  /* ======================= proba2 (2nde) : dénombrement des issues ======================= */
  DF("proba2", /dé équilibré à (\d+) faces numérotées de 1 à (\d+)\. On note S l'évènement « obtenir (un nombre supérieur ou égal à|un multiple de) (\d+) »/, (g, lab) => {
    const n = nn(g[0]); if (nn(g[1]) !== n) return NaN; const k = nn(g[3]), S = (i) => (g[2].startsWith("un multiple") ? i % k === 0 : i >= k);
    let a = 0, b = 0; for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) { if (S(i) && S(j)) a++; if (!S(i) && !S(j)) b++; }
    return /aux deux lancers/.test(lab) ? a / (n * n) : /aucun des deux/.test(lab) ? b / (n * n) : /au moins une fois/.test(lab) ? 1 - b / (n * n) : null; });
  DF("proba2", /contient (\d+) (\S+) [^.]+? et (\d+) \2 [^.]+?\. On tire au hasard/, (g, lab) => {
    const r = nn(g[0]), v = nn(g[2]), N = r + v; let rr = 0, vv = 0, tot = 0; /* tirages ordonnés sans remise */
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { if (i === j) continue; tot++; if (i < r && j < r) rr++; if (i >= r && j >= r) vv++; }
    return /P\(deux \S+ de la même/.test(lab) ? (rr + vv) / tot : /P\(deux /.test(lab) ? rr / tot : /au moins/.test(lab) ? 1 - rr / tot : null; });
  DF("proba2", /interroge (\d+) élèves\. .*? (\d+) élèves sont dans A, (\d+) dans B, et (\d+) dans les deux/, (g, lab) => { const [N, a, b, c] = g.map(nn), onlyA = a - c, onlyB = b - c, none = N - onlyA - onlyB - c;
    if (onlyA < 0 || onlyB < 0 || none < 0) return NaN; return /A ∩ B/.test(lab) ? c / N : /A ∪ B/.test(lab) ? (onlyA + onlyB + c) / N : /ni A ni B/.test(lab) ? none / N : null; });
  DF("proba2", /propose (\d+) réponses dont une seule est juste\. .*?au hasard à (\d+) questions/, (g, lab) => { const [k, n] = g.map(nn); let all = 0, none = 0, tot = 0;
    const rec = (i, js) => { if (i === n) { tot++; if (js === n) all++; if (js === 0) none++; return; } for (let c = 0; c < k; c++) rec(i + 1, js + (c === 0 ? 1 : 0)); }; rec(0, 0);
    return /réponses justes\)/.test(lab) ? all / tot : /aucune/.test(lab) ? none / tot : /au moins une/.test(lab) ? 1 - none / tot : null; });

  /* ======================= tauxevol (2nde) : évolutions appliquées une à une ======================= */
  DF("tauxevol", new RegExp("valait " + NB + " € en 2024\\. Il augmente de (\\d+) % en 2025, puis baisse de (\\d+) % en 2026"), (g, lab) => { const [P, t1, t2] = g.map(nn), p1 = P + (P * t1) / 100, p2 = p1 - (p1 * t2) / 100;
    return /global/.test(lab) ? ((p2 - P) / P) * 100 : /2025 \(/.test(lab) ? p1 : /2026 \(/.test(lab) ? p2 : null; });
  DF("tauxevol", new RegExp("augmente de ([\\d,]+) % par an depuis 2020 ; elle comptait " + NB + " habitants"), (g, lab) => { const t = nn(g[0]), A = nn(g[1]); let v = A; const y = []; for (let i = 0; i < 3; i++) { v += (v * t) / 100; y.push(v); }
    return /global/.test(lab) ? ((y[2] - A) / A) * 100 : /2021/.test(lab) ? y[0] : /2023/.test(lab) ? y[2] : null; });
  DF("tauxevol", new RegExp("compte " + NB + " abonnés au 1er janvier\\. Le nombre d'abonnés augmente de (\\d+) % par mois"), (g, lab) => { const A = nn(g[0]), t = nn(g[1]); let v = A; const y = []; for (let i = 0; i < 3; i++) { v += (v * t) / 100; y.push(v); }
    return /global/.test(lab) ? ((y[2] - A) / A) * 100 : /février/.test(lab) ? y[0] : /avril/.test(lab) ? y[2] : null; });
  DF("tauxevol", new RegExp("baisse de (\\d+) %\\. (?:Il|Elle) coûte maintenant " + NB + " €"), (g, lab) => { const t = nn(g[0]), P = nn(g[1]), I = P / (1 - t / 100);
    return /Coefficient/.test(lab) ? P / I : /avant les soldes/.test(lab) ? I : /Taux de hausse/.test(lab) ? ((I - P) / P) * 100 : null; });
  DF("tauxevol", new RegExp("achetée " + NB + " € perd (\\d+) % de sa valeur chaque année"), (g, lab) => { const P = nn(g[0]), t = nn(g[1]); let v = P; const y = []; for (let i = 0; i < 3; i++) { v -= (v * t) / 100; y.push(v); }
    return /Perte/.test(lab) ? ((P - y[2]) / P) * 100 : /1 an/.test(lab) ? y[0] : /3 ans \(€/.test(lab) ? y[2] : null; });

  /* ======================= vect3e (2nde) ======================= */
  DF("vect3e", new RegExp("(?:on donne|sont|on place) A\\((−?\\d+) ; (−?\\d+)\\), B\\((−?\\d+) ; (−?\\d+)\\) et C\\((−?\\d+) ; (−?\\d+)\\)\\." + E), (g, lab) => { const [ax, ay, bx, by, cx, cy] = g.map(nn);
    /* D : milieu de [AC] = milieu de [BD] */ const mx = (ax + cx) / 2, my = (ay + cy) / 2, dx = 2 * mx - bx, dy = 2 * my - by;
    return /Abscisse du point D/.test(lab) ? dx : /Ordonnée de D/.test(lab) ? dy : /Déterminant/.test(lab) ? (bx - ax) * (cy - ay) - (by - ay) * (cx - ax) : null; });
  DF("vect3e", new RegExp("A\\((−?\\d+) ; (−?\\d+)\\) et B\\((−?\\d+) ; (−?\\d+)\\) ; [^.]*? C est en C\\((−?\\d+) ; (−?\\d+)\\)\\." + E), (g, lab) => { const [ax, ay, bx, by, cx, cy] = g.map(nn), e = L(lab, /point E d'abscisse (−?\d+)/);
    if (/Déterminant/.test(lab)) return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (e) { if (bx === ax) return NaN; return ay + ((by - ay) / (bx - ax)) * (e[0] - ax); }
    return /Longueur AB/.test(lab) ? Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2) : null; });
  DF("vect3e", /A\((−?\d+) ; (−?\d+)\) \(repère orthonormé, unité : [^)]*\)\. Il se déplace selon le vecteur u\((−?\d+) ; (−?\d+)\), puis selon le vecteur v\((−?\d+) ; (−?\d+)\)/, (g, lab) => { const [ax, ay, u1, u2, v1, v2] = g.map(nn), zx = ax + u1 + v1, zy = ay + u2 + v2;
    return /Abscisse/.test(lab) ? zx : /Ordonnée/.test(lab) ? zy : /Distance/.test(lab) ? Math.hypot(zx - ax, zy - ay) : null; });

  /* ======================= probcond (2nde) : effectifs d'une population de 10 000 ======================= */
  const tree = (p, q1, q2, lab) => { const n = 10000, nA = (n * p) / 100, nAB = (nA * q1) / 100, nB = nAB + ((n - nA) * q2) / 100; return /∩/.test(lab) ? nAB / n : /^b\) P\(\w\)/.test(lab) ? nB / n : /^c\) P_/.test(lab) ? nAB / nB : null; };
  DF("probcond", /(\d+) % des élèves sont demi-pensionnaires \(évènement D\)\. Parmi eux, (\d+) % [^(]+\(évènement \w\) ; parmi les autres élèves, (\d+) %/, (g, lab) => tree(...g.map(nn), lab));
  DF("probcond", /touche (\d+) % de la population[^.]*\. Un test de dépistage est positif pour (\d+) % des malades et pour (\d+) % des personnes non malades/, (g, lab) => tree(...g.map(nn), lab));
  DF("probcond", /la chaîne A en produit (\d+) %, la chaîne B le reste\. (\d+) % des [^.]*? sur A et (\d+) % de ceux/, (g, lab) => tree(...g.map(nn), lab));
  DF("probcond", /compte (\d+) licenciés : (\d+) filles et (\d+) garçons\. (\d+) filles et (\d+) garçons jouent en compétition/, (g, lab) => { const [N, F, G, fc, gc] = g.map(nn); if (F + G !== N) return NaN;
    return /P\(C\)/.test(lab) ? (fc + gc) / N : /P_F\(C\)/.test(lab) ? fc / F : /P_C\(F\)/.test(lab) ? fc / (fc + gc) : null; });

  /* ======================= algopy (2nde) : on exécute le programme lu ======================= */
  DF("algopy", /def f\(n\): s = (\d+) for i in range\((1, n \+ 1|n)\): s = s \+ (?:(\d+) \* )?i return s/, (g, lab) => { const s0 = nn(g[0]), full = g[1] !== "n", k = g[2] ? nn(g[2]) : 1;
    const f = (n) => { let s = s0; for (let i = full ? 1 : 0; i < (full ? n + 1 : n); i++) s += k * i; return s; }, a = L(lab, /^[ab]\) f\((\d+)\)$/), S = L(lab, /f\(n\) > (\d+)/);
    if (a) return f(a[0]); if (S) { for (let n = 0; n < 500; n++) if (f(n) > S[0]) return n; return NaN; } return null; });
  DF("algopy", /def annees\(seuil\): capital = (\d+) n = 0 while capital < seuil: capital = capital \* (\d\.\d+) n = n \+ 1 return n/, (g, lab) => { const C = +g[0], q = +g[1], s = L(lab, /annees\((\d+)\)/);
    if (/premier passage/.test(lab)) return C * q; if (s) { let c = C, n = 0; while (c < s[0] && n < 1000) { c = c * q; n = n + 1; } return n; } return null; });
  DF("algopy", /def prix\(age\): if age < (\d+): return (\d+) elif age < (\d+): return (\d+) else: return (\d+)/, (g, lab) => { const [a1, p0, a2, p1, p2] = g.map(nn), pr = (x) => (x < a1 ? p0 : x < a2 ? p1 : p2), one = L(lab, /^[ab]\) prix\((\d+)\)$/), fam = /âges sont ([\d, ]+) \(€\)/.exec(lab);
    if (one) return pr(one[0]); if (fam) return fam[1].split(",").map(nn).reduce((s, x) => s + pr(x), 0); return null; });

  /* ======================= expderiv (1re) : dérivées numériques, extremum par recherche ======================= */
  const kk = (s) => (s === "" ? 1 : nn(s));
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const argmax = (f, a, b) => { let lo = a, hi = b; for (let i = 0; i < 200; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (f(m1) < f(m2)) lo = m1; else hi = m2; } return (lo + hi) / 2; };
  DF("expderiv", /C\(t\) = (\d+)t e\^\(−([\d,]*)t\)/, (g, lab) => { const a = nn(g[0]), k = kk(g[1]), C = (t) => a * t * Math.exp(-k * t), tm = argmax(C, 0, 50), t1 = L(lab, /C\((\d+)\)/);
    return /s'annule/.test(lab) ? Math.round(tm * 1e4) / 1e4 : /plus élevée/.test(lab) ? C(tm) : t1 ? C(t1[0]) : null; });
  DF("expderiv", /N\(t\) = (\d+) e\^\(([\d,]+)t\)/, (g, lab) => { const N0 = nn(g[0]), k = nn(g[1]), Nf = (t) => N0 * Math.exp(k * t), d = (t) => (Nf(t + 1e-4) - Nf(t - 1e-4)) / 2e-4, t1 = L(lab, /N'?\((\d+)\)/);
    if (/N'\(0\)/.test(lab)) return r6(d(0)); return /^b\) N\(/.test(lab) && t1 ? Nf(t1[0]) : /^c\) N'\(/.test(lab) && t1 ? d(t1[0]) : null; });
  DF("expderiv", /f\(x\) = \((−?\d*)x ([+−]) (\d+)\)e\^x/, (g, lab) => { const a = g[0] === "" ? 1 : g[0] === "−" ? -1 : nn(g[0]), b = (g[1] === "−" ? -1 : 1) * nn(g[2]), f = (x) => (a * x + b) * Math.exp(x), d = (x) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;
    let lo = -20, hi = 20; if (d(lo) * d(hi) > 0) return NaN; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (d(lo) * d(m) <= 0) hi = m; else lo = m; } const x0 = r6((lo + hi) / 2);
    return /f'\(0\)/.test(lab) ? r6(d(0)) : /Abscisse x₀/.test(lab) ? x0 : /f\(x₀\)/.test(lab) ? f(x0) : null; });
  DF("expderiv", /T\(t\) = (\d+) \+ (\d+) e\^\(−([\d,]+)t\)/, (g, lab) => { const [Ta, D, k] = g.map(nn), Tf = (t) => Ta + D * Math.exp(-k * t), d = (t) => (Tf(t + 1e-5) - Tf(t - 1e-5)) / 2e-5, t1 = L(lab, /T'?\((\d+)\)/);
    if (/T'\(0\)/.test(lab)) return r6(d(0)); return /^b\) T\(/.test(lab) && t1 ? Tf(t1[0]) : /^c\) T'\(/.test(lab) && t1 ? d(t1[0]) : null; });

  /* ======================= trigrad (1re) ======================= */
  const PIv = (s) => { s = s.trim(); if (s === "0") return 0; const m = /^(−?)(\d*)π(?:\/(\d+))?$/.exec(s); if (!m) return NaN; return ((m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.PI) / (m[3] ? +m[3] : 1); };
  DF("trigrad", /On sait que (cos|sin) x = (−?[\d,]+) et que x est dans \[([^;]+) ; ([^\]]+)\]/, (g, lab) => { const v = nn(g[1]), a = PIv(g[2]), b = PIv(g[3]);
    const cands = g[0] === "cos" ? [Math.acos(v), -Math.acos(v)] : [Math.asin(v), Math.PI - Math.asin(v), -Math.PI - Math.asin(v)], x = cands.find((t) => t >= a - 1e-9 && t <= b + 1e-9); if (x === undefined) return NaN;
    const e = lab.replace(/^[abc]\) /, "").replace(/sin² x/, "sin(x)**2").replace(/cos² x/, "cos(x)**2").replace(/(sin|cos) x/g, "$1(x)").replace(/π/g, "Math.PI").replace(/−/g, "-").replace(/\b(sin|cos)\(/g, "Math.$1(");
    if (/[^-+*/().\sMathsincoPIx\d]/.test(e)) return null; try { return Math.round(new Function("x", "return " + e)(x) * 1e9) / 1e9; } catch (er) { return null; } });
  DF("trigrad", /rayon de (\d+) m et son centre est à (\d+) m du sol\. .*?θ = (\d*)π\/(\d+)\./, (g, lab) => { const R0 = nn(g[0]), H = nn(g[1]), th = ((g[2] ? +g[2] : 1) * Math.PI) / +g[3];
    /* nacelle en (R cos θ ; H + R sin θ), repère au pied de la roue */ const P = (t) => [R0 * Math.cos(t), H + R0 * Math.sin(t)];
    return /^a\) Hauteur/.test(lab) ? P(th)[1] : /horizontale/.test(lab) ? P(th)[0] : /tourné de π\/2/.test(lab) ? P(th + Math.PI / 2)[1] : null; });
  DF("trigrad", new RegExp("x = (−?)(\\d+)π\\/(\\d+)\\." + E), (g, lab) => { const d = +g[2]; let t = ((g[0] ? -1 : 1) * +g[1] * Math.PI) / d; while (t > Math.PI + 1e-9) t -= 2 * Math.PI; while (t <= -Math.PI + 1e-9) t += 2 * Math.PI;
    return /valeur de n/.test(lab) ? Math.round((t * d) / Math.PI) : /cos² x/.test(lab) ? Math.round(Math.cos(t) ** 2 * 1e9) / 1e9 : /degrés/.test(lab) ? r6((t * 180) / Math.PI) : null; });

  /* ======================= autodnb (3e) : chaque question porte ses données ======================= */
  const linv = (s) => { const e = s.replace(/−/g, "-").replace(/\s/g, "").replace(/(\d)x/g, "$1*x"); if (/[^-+*x\d]/.test(e)) return null; try { return new Function("x", "return " + e); } catch (er) { return null; } };
  DF("autodnb", /^Partie 1 du brevet/, (g, lab) => { let m;
    if ((m = /^a\) (\d+)\/(\d+) − (\d+)\/(\d+) × (\d+)\/(\d+)/.exec(lab))) { const [a, b, c, d, e, f] = m.slice(1).map(nn); return a / b - (c / d) * (e / f); }
    if ((m = /à (\d+) € augmente de (\d+) %\. Nouveau prix/.exec(lab))) { const [P, t] = m.slice(1).map(nn); return P + (P * t) / 100; }
    if ((m = /^c\) (\d+)² − (\d+)²$/.exec(lab))) { const [a, b] = m.slice(1).map(nn); return a * a - b * b; }
    if ((m = /^a\) 10\^\(?(−?\d+)\)? × 10\^\(?(−?\d+)\)? ÷ 10\^\(?(−?\d+)\)? s'écrit/.exec(lab))) { const [p, q, r] = m.slice(1).map(nn); return Math.round(Math.log10((10 ** p * 10 ** q) / 10 ** r)); }
    if ((m = /contient (\d+) [^,]+, (\d+) [^,]+ et (\d+) [^.]+\. On en tire/.exec(lab))) { const [x, y, z] = m.slice(1).map(nn); return y / (x + y + z); }
    if ((m = /^c\) (\d+) % de (\d+)$/.exec(lab))) { const [t, n] = m.slice(1).map(nn); return (t / 100) * n; }
    if ((m = /mesurent (\d+) cm et (\d+) cm\. Hypoténuse/.exec(lab))) { const [a, b] = m.slice(1).map(nn); return Math.hypot(a, b); }
    if ((m = /parcourt ([\d,]+) km en (\d+) min\. Vitesse/.exec(lab))) { const [d, t] = m.slice(1).map(nn); return d / (t / 60); }
    if ((m = /pour rayon (\d+) cm ; son aire s'écrit k × π/.exec(lab))) { const r = nn(m[1]); return (Math.PI * r * r) / Math.PI; }
    if ((m = /^a\) Solution de (.+) = (.+)$/.exec(lab))) { const A = linv(m[1]), B = linv(m[2]); if (!A || !B) return null; const h = (x) => A(x) - B(x), s = h(1) - h(0); return s ? -h(0) / s : NaN; }
    if ((m = /augmente de (\d+) %, puis baisse de (\d+) %\. Taux/.exec(lab))) { const [p, q] = m.slice(1).map(nn); let v = 100; v += (v * p) / 100; v -= (v * q) / 100; return v - 100; }
    if ((m = /^c\) Image de (−?\d+) par la fonction f\(x\) = (−?\d*)x²(?: ([+−]) (\d+))?$/.exec(lab))) { const x = nn(m[1]), a = m[2] === "" ? 1 : m[2] === "−" ? -1 : nn(m[2]), b = m[3] ? (m[3] === "−" ? -1 : 1) * nn(m[4]) : 0; return a * x * x + b; }
    return null; });

  /* ======================= tabvar (2nde) : solutions comptées par balayage du tracé affine par morceaux ======================= */
  const count = (ys, k) => { let n = 0; for (let i = 0; i + 1 < ys.length; i++) { const a = ys[i], b = ys[i + 1]; if (k === a || k === b) return NaN; for (let s = 0; s < 1000; s++) { const u = a + ((b - a) * s) / 1000, w = a + ((b - a) * (s + 1)) / 1000; if ((u - k) * (w - k) <= 0) { n++; break; } } } return n; };
  DF("tabvar", /^Tableau de variations de f sur \[[^\]]+\] : (.+?) ; f est/, (g, lab) => { const ys = [...g[0].matchAll(/f\((−?\d+)\) = (−?\d+)/g)].map((m) => nn(m[2])), k = L(lab, /f\(x\) = (−?[\d,]+)$/);
    return /^a\) Minimum/.test(lab) ? Math.min(...ys) : /^a\) Maximum/.test(lab) ? Math.max(...ys) : k ? count(ys, k[0]) : null; });
  DF("tabvar", /elle baisse de (−?\d+) °C à (−?\d+) °C ; .*? elle monte jusqu'à (−?\d+) °C ; .*? elle baisse jusqu'à (−?\d+) °C/, (g, lab) => { const ys = g.map(nn), k = L(lab, /vaut (−?\d+) °C/);
    return /Écart/.test(lab) ? Math.max(...ys) - Math.min(...ys) : /minimale/.test(lab) ? Math.min(...ys) : k ? count(ys, k[0]) : null; });
  DF("tabvar", new RegExp("départ à " + NB + " m d'altitude ; la route monte jusqu'à un col à " + NB + " m .*?vallée à " + NB + " m .*?l'arrivée à " + NB + " m"), (g, lab) => { const ys = g.map(nn), k = L(lab, new RegExp("passent à " + NB + " m"));
    return /maximale/.test(lab) ? Math.max(...ys) : k ? count(ys, k[0]) : /Dénivelé positif/.test(lab) ? ys.slice(1).reduce((s, y, i) => s + Math.max(0, y - ys[i]), 0) : null; });
  DF("tabvar", new RegExp("B\\(0\\) = " + NB + ", B\\(\\d+\\) = " + NB + " et B\\(\\d+\\) = " + NB + "\\."), (g, lab) => { const ys = g.map(nn), k = L(lab, new RegExp("vaut " + NB + " €"));
    return /maximal/.test(lab) ? Math.max(...ys) : /nul/.test(lab) ? count(ys, 0) : k ? count(ys, k[0]) : null; });

  /* ======================= lnfr (Tle) : seuils par boucle (sans logarithme) ======================= */
  const firstN = (q, ok) => { let v = 1; for (let n = 0; n < 2000; n++) { if (ok(v)) return n; v *= q; } return NaN; };
  DF("lnfr", new RegExp("capital de " + NB + " € est placé à ([\\d,]+) % par an"), (g, lab) => { const C = nn(g[0]), q = 1 + nn(g[1]) / 100, S = L(lab, new RegExp("dépasse " + NB + " €")), k = L(lab, /multiplié par (\d+)/);
    return /Coefficient/.test(lab) ? q : S ? firstN(q, (v) => C * v > S[0]) : /double/.test(lab) ? firstN(q, (v) => v >= 2) : k ? firstN(q, (v) => v >= k[0]) : null; });
  DF("lnfr", new RegExp("compte " + NB + " utilisateurs ; leur nombre augmente de (\\d+) % par mois"), (g, lab) => { const C = nn(g[0]), q = 1 + nn(g[1]) / 100, S = L(lab, new RegExp("dépasse " + NB + "$")), k = L(lab, /multiplié par (\d+)/);
    return /Coefficient/.test(lab) ? q : S ? firstN(q, (v) => C * v > S[0]) : k ? firstN(q, (v) => v >= k[0]) : null; });
  DF("lnfr", /On injecte (\d+) mg d'un médicament\. Chaque heure, la quantité présente dans le sang diminue de (\d+) %/, (g, lab) => { const D = nn(g[0]), q = 1 - nn(g[1]) / 100, s = L(lab, /moins de ([\d,]+) mg/);
    return /Coefficient/.test(lab) ? q : s ? firstN(q, (v) => D * v < s[0]) : null; });
  DF("lnfr", /absorbe (\d+) % de la lumière qui la traverse/, (g, lab) => { const q = 1 - nn(g[0]) / 100, s = L(lab, /inférieure à (\d+) %/);
    return /Coefficient/.test(lab) ? q : s ? firstN(q, (v) => v < s[0] / 100) : null; });

  /* ======================= hauteurs5 (5e) : aire par deux bases, cohérence (Pythagore) contrôlée ======================= */
  const pyth = (a, b, c) => Math.abs(a * a + b * b - c * c) < 1e-9;
  DF("hauteurs5", /rectangle en A, avec AB = (\d+) cm, AC = (\d+) cm et BC = (\d+) cm/, (g, lab) => { const [ab, ac, bc] = g.map(nn); if (!pyth(ab, ac, bc)) return NaN; const A = (ab * ac) / 2;
    return /^a\) Aire/.test(lab) ? A : /issue de A/.test(lab) ? (2 * A) / bc : /issue de B/.test(lab) ? ab : /issue de C/.test(lab) ? ac : null; });
  DF("hauteurs5", /\[AB\], mesure ([\d,]+) m, .*?\[AC\], mesure ([\d,]+) m, et \[BC\] mesure ([\d,]+) m/, (g, lab) => { const [ab, ac, bc] = g.map(nn); if (!pyth(ab, ac, bc)) return NaN; const A = (ab * ac) / 2, p = L(lab, /à (\d+) € le m²/);
    return /^a\) Aire/.test(lab) ? A : /issue de A/.test(lab) ? (2 * A) / bc : p ? A * p[0] : null; });
  DF("hauteurs5", /côté \[BC\] de (\d+) m\. La hauteur issue de A mesure (\d+) m et le côté \[AB\] mesure (\d+) m/, (g, lab) => { const [bc, h, ab] = g.map(nn); if (ab < h) return NaN; const A = (bc * h) / 2, p = L(lab, /à (\d+) € le m²/);
    return /^a\) Aire/.test(lab) ? A : /issue de C/.test(lab) ? (2 * A) / ab : p ? A * p[0] : null; });
  DF("hauteurs5", /base \[BC\] mesure ([\d,]+) m, AB = AC = ([\d,]+) m, et la hauteur issue de A mesure ([\d,]+) m/, (g, lab) => { const [bc, s, h] = g.map(nn); if (!pyth(bc / 2, h, s)) return NaN; const A = (bc * h) / 2;
    return /^a\) Aire/.test(lab) ? A : /issue de B/.test(lab) ? (2 * A) / s : /deux pignons/.test(lab) ? 2 * A : null; });

  /* ======================= tabform5 (5e) : tableau de valeurs, recherche de l'antécédent par balayage ======================= */
  DF("tabform5", /prix = ([\d,]+) [·×] (\w) \+ (\d+) \(en €\)/, (g, lab) => { const a = nn(g[0]), b = nn(g[2]), n = L(lab, /Prix pour (\d+)/), P = L(lab, /pour un prix de ([\d,]+) €/);
    if (n) return a * n[0] + b; if (P) { for (let k = 0; k <= 200; k++) if (near(a * k + b, P[0])) return k; return NaN; } return null; });
  DF("tabform5", /T = (\d+) - (\d+) [·×] t/, (g, lab) => { const [T0, r] = g.map(nn), t = L(lab, /après (\d+) h/), T = L(lab, /de (−?[\d,]+) °C \?/);
    if (t) return T0 - r * t[0]; if (T) { for (let k = 0; k <= 100; k++) if (near(T0 - r * k, T[0])) return k; return NaN; } return null; });
  DF("tabform5", /h = (\d+) - ([\d,]+) [·×] t cm/, (g, lab) => { const [h0, c] = g.map(nn), t = L(lab, /après (\d+) h/);
    if (t) return h0 - c * t[0]; if (/entièrement consumé/.test(lab)) { for (let k = 0; k <= 200; k++) if (near(h0 - c * k, 0)) return k; return NaN; } return null; });

  /* ======================= cercle6 (6e) ======================= */
  DF("cercle6", /centre A a pour rayon (\d+) cm, le cercle de centre B a pour rayon (\d+) cm, et AB = (\d+) cm/, (g, lab) => { const [r, s, d] = g.map(nn); if (!(Math.abs(r - s) < d && d < r + s)) return NaN;
    return /AM \(/.test(lab) ? r : /triangle AMB/.test(lab) ? r + s + d : /AMBN/.test(lab) ? r + s + s + r : null; });
  DF("cercle6", /corde de (\d+) m : .*?Un pommier est à (\d+) m du piquet/, (g, lab) => { const [r, d] = g.map(nn), x = L(lab, /rallonge la corde de (\d+) m/);
    return /^a\) Diamètre/.test(lab) ? 2 * r : /pommier/.test(lab) ? d - r : x ? 2 * (r + x[0]) : null; });
  DF("cercle6", /borne A est au km (\d+) et la borne B au km (\d+)\. Une fontaine est sur la piste, à (\d+) km de A et à (\d+) km de B/, (g, lab) => { const [a, b, r1, r2] = g.map(nn), F = [a - r1, a + r1].filter((k) => Math.abs(k - b) === r2);
    if (F.length !== 1) return NaN; return /Distance AB/.test(lab) ? Math.abs(b - a) : /fontaine/.test(lab) ? F[0] : /Un autre point/.test(lab) ? [a - r1, a + r1].find((k) => k !== F[0]) : null; });
  DF("cercle6", new RegExp("situés à (\\d+) km ou moins d'elle \\(un disque\\)\\. Voici les distances de cinq villages à l'antenne : (.+)\\." + E), (g, lab) => { const r = nn(g[0]), ds = [...g[1].matchAll(/([\d,]+) km/g)].map((m) => nn(m[1])); if (ds.length !== 5) return NaN;
    return /couverts/.test(lab) ? ds.filter((x) => x <= r).length : /augmenter la portée/.test(lab) ? Math.max(0, Math.max(...ds) - r) : /Diamètre/.test(lab) ? 2 * r : null; });

  /* ======================= bissec6 (6e) ======================= */
  DF("bissec6", /xOy = (\d+)° et yOt = (\d+)° sont adjacents/, (g, lab) => { const [a, b] = g.map(nn); return /uOy/.test(lab) ? a / 2 : /yOv/.test(lab) ? b / 2 : /uOv/.test(lab) ? a / 2 + b / 2 : null; });
  DF("bissec6", /\(angle plat xOz\)\. xOy = (\d+)°/, (g, lab) => { const a = nn(g[0]), b = 180 - a; return /yOz/.test(lab) ? b : /uOy/.test(lab) ? a / 2 : /uOv/.test(lab) ? a / 2 + b / 2 : null; });
  DF("bissec6", /l'angle Â mesure (\d+)° et l'angle B̂ mesure (\d+)°/, (g, lab) => { const [A, B] = g.map(nn), C = 180 - A - B; if (C <= 0) return NaN; return /Ĉ/.test(lab) ? C : /BAD/.test(lab) ? A / 2 : /ADB/.test(lab) ? 180 - B - A / 2 : null; });
  DF("bissec6", /angle au centre mesure (\d+)°\. On partage/, (g, lab) => { const a = nn(g[0]); return /premier partage/.test(lab) ? a / 2 : /petit morceau à la fin/.test(lab) ? a / 4 : /toute la/.test(lab) ? 360 / (a / 4) : null; });

  /* ======================= filtre6 (6e) : tableau relu dans le TeX (item.raw) ======================= */
  const rowsOf = (raw) => { const m = /\\hline([\s\S]*?)\\end\{array\}/.exec(raw); if (!m) return null; return m[1].split("\\\\").map((r) => r.split("&").map((c) => c.replace(/\\text\{([^}]*)\}/, "$1").replace(/\{,\}/g, ",").replace(/\\,/g, "").trim())).filter((r) => r.length === 5).map((r) => [r[0], ...r.slice(1).map(nn)]); };
  DF("filtre6", /compare des sorties/, (g, lab, txt, x) => { const R = rowsOf(x.raw), s = L(lab, /à (\d+) € au plus/); if (!R || R.length !== 6) return NaN; const K = s ? R.filter((r) => r[1] <= s[0]) : null;
    return /^a\)/.test(lab) && K ? K.length : /Meilleure note/.test(lab) && K ? Math.max(...K.map((r) => r[4])) : /Prix total/.test(lab) ? R.reduce((t, r) => t + r[1], 0) : null; });
  DF("filtre6", /compare six smartphones/, (g, lab, txt, x) => { const R = rowsOf(x.raw), c = L(lab, /moins de (\d+) € ET avec au moins (\d+) h/); if (!R || R.length !== 6) return NaN;
    return c ? R.filter((r) => r[1] < c[0] && r[2] >= c[1]).length : /notés 4 ou plus/.test(lab) ? Math.min(...R.filter((r) => r[4] >= 4).map((r) => r[1])) : /Écart de prix/.test(lab) ? Math.max(...R.map((r) => r[1])) - Math.min(...R.map((r) => r[1])) : null; });
  DF("filtre6", /compare six campings/, (g, lab, txt, x) => { const R = rowsOf(x.raw), d = L(lab, /à ([\d,]+) km de la plage au plus/), n = L(lab, /Prix de (\d+) nuits/); if (!R || R.length !== 6) return NaN; if (!d) return null; const K = R.filter((r) => r[2] <= d[0]);
    return n ? n[0] * Math.min(...K.map((r) => r[1])) : /^a\)/.test(lab) ? K.length : /^b\)/.test(lab) ? Math.min(...K.map((r) => r[1])) : null; });

  /* ======================= progcalc (5e–3e) : programmes exécutés pas à pas ======================= */
  const progs = (txt) => txt.split(/Programme(?: [AB])?(?= •)/).slice(1).map((part) => [...part.matchAll(/• ([^•]+?)\.(?=\s*•|\s*$)/g)].map((m) => m[1].trim()));
  const runS = (st, x0) => { let v = x0; for (const s of st) { let m; if (s === "Choisir un nombre") continue; if ((m = /^Ajouter (−?[\d,]+)$/.exec(s))) v += nn(m[1]); else if ((m = /^Soustraire (−?[\d,]+)$/.exec(s))) v -= nn(m[1]); else if ((m = /^Multiplier par (−?[\d,]+)$/.exec(s))) v *= nn(m[1]); else if (s === "Élever le résultat au carré") v = v * v; else if (s === "Soustraire le carré du nombre de départ") v -= x0 * x0; else if (s === "Ajouter le nombre de départ") v += x0; else return NaN; } return v; };
  const findX = (f, target) => { const S = []; for (let k = -2000; k <= 2000; k++) { const x = k / 10; if (near(f(x), target)) S.push(x); } return S.length === 1 ? S[0] : NaN; };
  DF("progcalc", /Programme A • Choisir un nombre\..*Programme B • Choisir un nombre\./, (g, lab, txt) => { const [A, B] = progs(txt.split(" ¶ ")[0]), a = L(lab, /programme A avec (−?\d+)/), b = L(lab, /programme B avec (−?\d+)/);
    return a ? runS(A, a[0]) : b ? runS(B, b[0]) : /même résultat/.test(lab) ? findX((x) => runS(A, x) - runS(B, x), 0) : null; });
  DF("progcalc", /^(?:(?!Programme A).)*Programme • Choisir un nombre\./, (g, lab, txt) => { const [A] = progs(txt.split(" ¶ ")[0]), x = L(lab, /Résultat avec (−?\d+)$/), r = L(lab, /(?:annonce|Le résultat est) (−?\d+)\. Quel/);
    return x ? runS(A, x[0]) : r ? findX((t) => runS(A, t), r[0]) : null; });

  /* ======================= ratio (5e–4e) : partage proportionnel ======================= */
  const share = (w, T, i) => (T * w[i]) / w.reduce((s, x) => s + x, 0);
  DF("ratio", new RegExp("ont apporté " + NB + " €, " + NB + " € et " + NB + " €\\. Elles partagent un bénéfice de " + NB + " €"), (g, lab) => { const [a, b, c, B] = g.map(nn), w = [a, b, c];
    return /première/.test(lab) ? share(w, B, 0) : /deuxième/.test(lab) ? share(w, B, 1) : /troisième/.test(lab) ? share(w, B, 2) : null; });
  DF("ratio", new RegExp("mélange (\\S+), (\\S+) et (\\S+) au ratio (\\d+) : (\\d+) : (\\d+) \\(en masse\\)\\. (?:Il prépare|Il lui faut) " + NB + " (?:g|kg)"), (g, lab) => { const names = g.slice(0, 3), w = g.slice(3, 6).map(nn), T = nn(g[6]), m = /Masse (?:de |d')(\S+)/.exec(lab); if (!m) return null; const i = names.indexOf(m[1]); return i < 0 ? null : share(w, T, i); });
  DF("ratio", new RegExp("^(\\S+), (\\S+) et (\\S+) ont acheté ensemble .*?en payant (\\d+) €, (\\d+) € et (\\d+) €\\. .*?bon d'achat de " + NB + " €"), (g, lab) => { const names = g.slice(0, 3), w = g.slice(3, 6).map(nn), T = nn(g[6]), m = /Part (?:de |d')(\S+) \(€\)/.exec(lab);
    if (m) { const i = names.indexOf(m[1]); return i < 0 ? null : share(w, T, i); } const sh = w.map((_, i) => share(w, T, i)); return /Écart/.test(lab) ? Math.max(...sh) - Math.min(...sh) : null; });

  for (const r of rules.slice().reverse()) RECALC.RULES.unshift(r);
  return { IDS, n: rules.length };
})();
