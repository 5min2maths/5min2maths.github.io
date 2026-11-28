// Chantier secondaire I (décision du 20.11 : 10e puis 9e) · lot 1 : ordgr, decadd, decmul, decdiv, reladd (notions de 9e,
// revues en 10e). Même standard que ch11_no.js : au moins 3 formes par niveau, pas à pas sur toutes les questions,
// erreurs typiques (virgule mal placée, signes, arrondi), étiquette ctx ; défis en plusieurs étapes.
(function () {
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const nz = (a, b) => { let v; do v = R.int(a, b); while (v === 0); return v; };
  const r6 = (v) => +(+v).toFixed(6);
  // nombre en TeX : virgule décimale, ' pour les milliers
  const N = (v) => { let [i, f] = String(r6(v)).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + (f ? "{,}" + f : ""); };
  const C = (v) => { if (Number.isInteger(r6(v))) return N(v); let [i, f] = r6(v).toFixed(2).split("."); if (i.replace("-", "").length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\text{'}"); return i + "{,}" + f; }; // montants en CHF : 2 décimales
  const par = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const keep = (value, traps) => { const seen = new Set(); return (traps || []).filter((t) => t && isFinite(t.v) && Math.abs(t.v - value) > 1e-9 && !seen.has(r6(t.v)) && seen.add(r6(t.v))); };
  const p15 = (v) => +(+v).toPrecision(15); /* 26.11 (recalcul) : valeur exacte dans la réponse attendue (r6 donnait 0,666667 pour 2/3 : la fraction tapée était refusée) ; r6 reste pour l'affichage */
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value: p15(value) }, sol, guide: o.guide, traps: keep(p15(value), o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const G = (ask, value, sol) => GS(ask, p15(value), sol);
  const TR = (v, m) => TRAP(r6(v), m);
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam", "Léa", "Tom"]);
  /* décimal à k décimales exactement. 26.11 (revue élèves, decmul-1-5it : « 5 · 3 » dans « Multiplier des décimaux ») :
     le dernier chiffre n'est jamais 0, un « décimal » n'est plus un entier. */
  const dec = (lo, hi, k) => { let n; do n = R.int(Math.round(lo * 10 ** k), Math.round(hi * 10 ** k)); while (k > 0 && n % 10 === 0); return r6(n / 10 ** k); };
  const nd = (v) => { const s = String(r6(v)); return s.includes(".") ? s.split(".")[1].length : 0; };
  const roundTo = (v, s) => Math.round(v / s) * s;
  const UNIT = { 1000: "au millier", 100: "à la centaine", 10: "à la dizaine", 1: "à l'unité", 0.1: "au dixième", 0.01: "au centième" };

  // ===================== ordgr : ordre de grandeur, arrondis =====================
  const OG = {
    1: [
      () => { const s = pk([10, 100, 1000]), v = R.int(s * 3, s * 98) + R.int(1, s - 1) * (s > 1 ? 1 : 0); if (v % s === 0) return null; const r = roundTo(v, s), lo = Math.floor(v / s) * s;
        return Qv("Arrondis " + M(N(v)) + " " + UNIT[s] + ".", r, M(N(lo)) + " et " + M(N(lo + s)) + " encadrent " + M(N(v)) + " ; le plus proche est " + M(N(r)) + ".",
          { ctx: "arrondir", guide: [G(UNIT[s][0].toUpperCase() + UNIT[s].slice(1) + ", " + M(N(v)) + " est entre " + M(N(lo)) + " et quel nombre ?", lo + s, M(N(lo + s)) + "."), G("Lequel des deux est le plus proche de " + M(N(v)) + " ?", r, "On regarde le chiffre juste après : " + (r === lo ? "moins de 5, on arrondit vers le bas." : "5 ou plus, on arrondit vers le haut.") + " " + M(N(r)) + ".")],
            traps: [TR(r === lo ? lo + s : lo, "Regarde le chiffre juste à droite de la position demandée : 5 ou plus → vers le haut."), TR(Math.floor(v / s), "On garde la valeur du nombre : " + N(r) + ", pas seulement les premiers chiffres.")] }); },
      () => { const s = pk([100, 1000]), a = R.int(s * 2, s * 40) + R.int(1, s - 1), b = R.int(s * 2, s * 40) + R.int(1, s - 1), add = R.rand() < 0.5; if (!add && a < b) return null; if (a % s === 0 || b % s === 0) return null;
        const A = roundTo(a, s), B = roundTo(b, s), v = add ? A + B : A - B;
        return Qv("Estime " + M(N(a) + (add ? " + " : " - ") + N(b)) + " en arrondissant chaque nombre " + UNIT[s] + ".", v, M(N(a) + " \\approx " + N(A)) + ", " + M(N(b) + " \\approx " + N(B)) + " : " + M(N(A) + (add ? " + " : " - ") + N(B) + " = " + N(v)) + ".",
          { ctx: add ? "somme" : "difference", guide: [G(M(N(a)) + " arrondi " + UNIT[s] + " ?", A, M(N(A)) + "."), G(M(N(b)) + " arrondi " + UNIT[s] + " ?", B, M(N(B)) + "."), G("Estimation ?", v, M(N(v)) + ".")],
            traps: [TR(add ? a + b : a - b, "C'est le calcul exact ; on demande une estimation avec les nombres arrondis."), TR(add ? Math.floor(a / s) * s + Math.floor(b / s) * s : Math.floor(a / s) * s - Math.floor(b / s) * s, "Arrondir n'est pas tronquer : regarde le chiffre suivant.")] }); },
      () => { const c = pk([["Un vélo coûte", "et un casque", "le prix total"], ["Un séjour à l'hôtel coûte", "et le billet de train", "le prix du voyage"] /* 26.11 : et non un billet de train à 856 CHF et l'hôtel à 49 CHF */, ["Une console coûte", "et un jeu", "le prix total"]]), a = R.int(120, 980), b = R.int(21, 99), A = roundTo(a, 10), B = roundTo(b, 10), v = A + B; if (a % 10 === 0 || b % 10 === 0) return null;
        return Qv(c[0] + " " + M(a) + " CHF " + c[1] + " " + M(b) + " CHF. Estime " + c[2] + " en arrondissant chaque prix à la dizaine.", v, M(a + " \\approx " + A) + ", " + M(b + " \\approx " + B) + " : environ " + M(v) + " CHF.",
          { ctx: "achats", guide: [G(M(a) + " arrondi à la dizaine ?", A, M(A) + "."), G(M(b) + " arrondi à la dizaine ?", B, M(B) + "."), G("Estimation ?", v, M(v) + " CHF.")],
            traps: [TR(a + b, "On demande une estimation avec les prix arrondis."), TR(Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10, "Arrondir n'est pas tronquer : " + b + " s'arrondit à " + B + ".")] }); },
    ],
    2: [
      () => { const a = R.int(11, 99), b = R.int(11, 99); if (a % 10 === 0 || b % 10 === 0) return null; const A = roundTo(a, 10), B = roundTo(b, 10), v = A * B;
        return Qv("Estime " + M(a + " \\cdot " + b) + " en arrondissant chaque nombre à la dizaine.", v, M(A + " \\cdot " + B + " = " + N(v)) + " (le résultat exact, " + M(N(a * b)) + ", en est proche).",
          { ctx: "produit", guide: [G(M(a) + " arrondi ?", A, M(A) + "."), G(M(b) + " arrondi ?", B, M(B) + "."), G(M(A + " \\cdot " + B) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(a * b, "On demande l'estimation, pas le calcul exact."), TR(A + B, "On multiplie, on n'additionne pas.")] }); },
      () => { const p = dec(1.6, 2.4, 2), L = R.int(31, 68); if (L % 10 === 0) return null; const P2 = roundTo(p, 1) || 2, L2 = roundTo(L, 10), v = P2 * L2;
        return Qv("L'essence coûte " + M(N(p)) + " CHF le litre. Estime le prix de " + M(L) + " litres en arrondissant le prix à l'unité et le volume à la dizaine.", v, M(N(p) + " \\approx " + P2) + ", " + M(L + " \\approx " + L2) + " : environ " + M(P2 + " \\cdot " + L2 + " = " + v) + " CHF.",
          { ctx: "essence", guide: [G("Prix arrondi à l'unité ?", P2, M(P2) + " CHF."), G("Volume arrondi à la dizaine ?", L2, M(L2) + " L."), G("Estimation ?", v, M(v) + " CHF.")],
            traps: [TR(r6(p * L), "C'est le prix exact ; on demande une estimation."), TR(P2 * L, "Arrondis aussi le volume.")] }); },
      () => { const a = R.int(21, 89), b = R.int(21, 89); if (a % 10 === 0 || b % 10 === 0) return null; const A = roundTo(a, 10), B = roundTo(b, 10), est = A * B, ok = R.rand() < 0.5, claimed = ok ? a * b : a * b * 10;
        return Qv(who() + " calcule " + M(a + " \\cdot " + b) + " et trouve " + M(N(claimed)) + ". Pour vérifier, donne l'ordre de grandeur " + M(A + " \\cdot " + B) + ".", est, M(A + " \\cdot " + B + " = " + N(est)) + " : " + (ok ? "le résultat " + M(N(claimed)) + " est plausible." : "le résultat " + M(N(claimed)) + " est environ dix fois trop grand : il y a une erreur."),
          { ctx: "verifier", guide: [G("Arrondis " + M(a) + " et " + M(b) + " à la dizaine, puis multiplie. Résultat ?", est, M(N(est)) + ".")],
            traps: [TR(claimed, "On demande l'ordre de grandeur " + A + " · " + B + ", pas le résultat annoncé."), TR(A + B, "On multiplie.")] }); },
    ],
    3: [
      () => { const a = R.int(2100, 9800), b = R.int(11, 49), A = roundTo(a, 1000), B = roundTo(b, 10); if (a % 1000 < 50 || b % 10 === 0 || A % B !== 0) return null; const v = A / B;
        return Qv("Estime " + M(N(a) + " \\div " + b) + " en arrondissant le premier nombre au millier et le second à la dizaine.", v, M(N(A) + " \\div " + B + " = " + N(v)) + ".",
          { ctx: "quotient", guide: [G("Premier nombre arrondi ?", A, M(N(A)) + "."), G("Second arrondi ?", B, M(B) + "."), G(M(N(A) + " \\div " + B) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(r6(a / b), "On demande l'estimation avec les nombres arrondis."), TR(A * B, "On divise.")] }); },
      () => { const n = pk([4, 5, 8]), tot = R.int(1900, 4100), T = roundTo(tot, 100); if (tot % 100 === 0 || T % n !== 0) return null; const v = T / n;
        return Qv("Une association récolte " + M(N(tot)) + " CHF, à partager entre " + M(n) + " projets. Estime la part de chacun en arrondissant la somme à la centaine.", v, M(N(T) + " \\div " + n + " = " + N(v)) + " CHF environ.",
          { ctx: "partage", guide: [G("Somme arrondie à la centaine ?", T, M(N(T)) + "."), G("Part de chacun ?", v, M(N(T) + " \\div " + n + " = " + N(v)) + ".")],
            traps: [TR(r6(tot / n), "C'est la part exacte ; on demande une estimation."), TR(T * n, "On partage : on divise.")] }); },
      () => { const a = pk([0.48, 0.52, 0.49, 0.26, 0.24, 0.98, 1.02, 0.11, 0.09]), b = R.int(180, 980), A = roundTo(a, a < 0.2 ? 0.1 : a < 0.4 ? 0.25 : a < 0.75 ? 0.5 : 1), B = roundTo(b, 100); if (b % 100 === 0) return null; const v = r6(A * B);
        return Qv("Ordre de grandeur de " + M(N(a) + " \\cdot " + b) + " : arrondis " + M(N(a)) + " à " + M(N(A)) + " et " + M(b) + " à la centaine. Résultat ?", v, M(N(A) + " \\cdot " + N(B) + " = " + N(v)) + (A === 0.5 ? " (multiplier par 0,5, c'est prendre la moitié)" : A === 0.25 ? " (le quart)" : A === 0.1 ? " (le dixième)" : "") + ".",
          { ctx: "fois-decimal", guide: [G(M(b) + " arrondi à la centaine ?", B, M(N(B)) + "."), G(M(N(A) + " \\cdot " + N(B)) + " = ?", v, M(N(v)) + ".")],
            traps: [TR(r6(a * b), "On demande l'ordre de grandeur."), TR(r6(B / A), "On multiplie par " + N(A) + " (le résultat est plus petit que " + N(B) + ").")] }); },
    ],
  };

  // ===================== decadd : additionner et soustraire des décimaux =====================
  const DA = {
    1: [
      () => { const a = dec(1, 30, pk([1, 2])), b = dec(1, 30, pk([1, 2, 3])), v = r6(a + b); if (nd(a) === nd(b)) return null; const ia = Math.floor(a), ib = Math.floor(b), fa = r6(a - ia), fb = r6(b - ib);
        return Qv("Calcule : " + M(N(a) + " + " + N(b)), v, "On aligne les virgules (on complète par des zéros) : " + M(N(a) + " + " + N(b) + " = " + N(v)) + ".",
          { ctx: "calcul", guide: [G("Parties entières : " + M(ia + " + " + ib) + " = ?", ia + ib, M(ia + ib) + "."), G("Parties décimales : " + M(N(fa) + " + " + N(fb)) + " = ?", r6(fa + fb), M(N(r6(fa + fb))) + (fa + fb >= 1 ? " (ça fait plus d'une unité, on la reporte)" : "") + "."), G("Total ?", v, M(N(v)) + ".")],
            traps: [TR(nd(a) > nd(b) ? r6(a + b / 10 ** (nd(a) - nd(b))) : r6(b + a / 10 ** (nd(b) - nd(a))), "Il faut aligner les virgules, pas les derniers chiffres."), TR(r6(ia + ib + fa + fb - 1), "N'oublie pas la retenue.")] }); },
      () => { const a = dec(2, 40, 2), b = dec(1, 20, 1), v = r6(a + b);
        return Qv("Complète : " + M(N(a) + " + \\,?\\, = " + N(v)), b, "On cherche la différence : " + M(N(v) + " - " + N(a) + " = " + N(b)) + ".",
          { ctx: "complete", guide: [G("Le nombre manquant est " + M(N(v) + " - " + N(a)) + " = ?", b, M(N(b)) + ".")], traps: [TR(r6(v + a), "On cherche ce qu'il faut ajouter : on soustrait."), TR(r6(b / 10), "Aligne les virgules.")] }); },
      () => { const it = pk([["un sandwich", 4, 9], ["un livre de poche", 8, 19], ["une place de cinéma", 12, 19], ["un ticket de bus", 2, 4], ["une glace", 3, 7]]), p = r6(R.int(it[1] * 20 + 1, it[2] * 20 - 1) / 20), billet = p < 10 ? 10 : p < 20 ? 20 : 50, v = r6(billet - p), c = it[0]; if (Number.isInteger(p)) return null; // prix suisses : multiples de 5 centimes
        return Qv("Tu achètes " + c + " à " + M(C(p)) + " CHF et tu paies avec un billet de " + M(billet) + " CHF. Combien te rend-on (en CHF) ?", v, M(billet + " - " + C(p) + " = " + C(v)) + " CHF.",
          { ctx: "monnaie", guide: [G("Pour arriver à l'unité supérieure " + M(Math.ceil(p)) + " CHF, il manque ?", r6(Math.ceil(p) - p), M(C(r6(Math.ceil(p) - p))) + " CHF."), G("Puis de " + M(Math.ceil(p)) + " à " + M(billet) + " CHF ?", billet - Math.ceil(p), M(billet - Math.ceil(p)) + " CHF."), G("Monnaie rendue ?", v, M(C(v)) + " CHF.")],
            traps: [TR(r6(v + 1), "Vérifie : prix + monnaie doit faire " + billet + " CHF (attention à l'unité empruntée)."), TR(r6(billet - Math.floor(p)), "N'oublie pas les centimes.")] }); },
    ],
    2: [
      () => { const a = dec(5, 40, 1), b = dec(1, 4.9, 2), v = r6(a - b); if (v <= 0) return null;
        return Qv("Calcule : " + M(N(a) + " - " + N(b)), v, "On écrit " + M(N(a)) + " avec deux décimales : " + M(a.toFixed(2).replace(".", "{,}") + " - " + N(b) + " = " + N(v)) + ".",
          { ctx: "calcul", guide: [G("Avec deux décimales, " + M(N(a)) + " s'écrit " + M(N(a) + "0") + ". En centièmes, " + M(N(a)) + " = ? centièmes", Math.round(a * 100), M(Math.round(a * 100)) + " centièmes."), G("Et " + M(N(b)) + " = ? centièmes", Math.round(b * 100), M(Math.round(b * 100)) + "."), G("Différence ?", v, M(Math.round(a * 100) + " - " + Math.round(b * 100) + " = " + Math.round(v * 100)) + " centièmes, soit " + M(N(v)) + ".")],
            traps: [TR(r6(a - b / 10), "Aligne les virgules : " + N(b) + " a deux décimales."), TR(r6(v + 1), "Vérifie en additionnant : résultat + " + N(b) + " doit redonner " + N(a) + " (retenue).")] }); },
      () => { const L = dec(3, 12, 1), c = dec(0.5, 2.9, 2), v = r6(L - c), ctx = pk([["On coupe " + M(N(c)) + " m d'un ruban de " + M(N(L)) + " m. Quelle longueur reste-t-il (en m) ?", "ruban"], ["Une bouteille contient " + M(N(L)) + " L ; on en verse " + M(N(c)) + " L. Combien reste-t-il (en L) ?", "bouteille"], ["Un colis pèse " + M(N(L)) + " kg ; on en retire un objet de " + M(N(c)) + " kg. Nouvelle masse (en kg) ?", "colis"]]);
        return Qv(ctx[0], v, M(N(L) + " - " + N(c) + " = " + N(v)) + ".",
          { ctx: ctx[1], guide: [G("Opération : " + M(N(L) + " - " + N(c)) + " (aligne les virgules). Résultat ?", v, M(N(v)) + ".")], traps: [TR(r6(L + c), "Il en reste moins : on soustrait."), TR(r6(L - c / 10), "Aligne les virgules.")] }); },
      () => { const c = pk([["course", "court le 100 m en", "s", 11, 17, 2], ["saut", "saute en longueur", "m", 2.5, 5.5, 2], ["lancer", "lance le poids à", "m", 5, 12, 1]]), a = dec(c[3], c[4], c[5]), b = r6(a + dec(0.1, 1.5, c[5])), w1 = who(); let w2; do w2 = who(); while (w2 === w1);
        return Qv(w1 + " " + c[1] + " " + M(N(b)) + " " + c[2] + " et " + w2 + " " + M(N(a)) + " " + c[2] + ". Quel est l'écart (en " + c[2] + ") ?", r6(b - a), M(N(b) + " - " + N(a) + " = " + N(r6(b - a))) + " " + c[2] + ".",
          { ctx: "ecart-" + c[0], guide: [G("On soustrait le plus petit du plus grand : " + M(N(b) + " - " + N(a)) + " = ?", r6(b - a), M(N(r6(b - a))) + " " + c[2] + ".")], traps: [TR(r6(a - b), "Un écart est positif : le plus grand moins le plus petit."), TR(r6(a + b), "L'écart est une différence.")] }); },
    ],
    3: [
      () => { const a = dec(20, 60, 1), b = dec(2, 9, 2), c = dec(1, 9, 1), paren = R.rand() < 0.5, v = r6(a - b - c);
        return Qv("Calcule : " + M(N(a) + (paren ? " - (" + N(b) + " + " + N(c) + ")" : " - " + N(b) + " - " + N(c))), v, (paren ? "On calcule la parenthèse : " + M(N(b) + " + " + N(c) + " = " + N(r6(b + c))) + ", puis " : "Soustraire " + N(b) + " puis " + N(c) + ", c'est soustraire leur somme " + M(N(r6(b + c))) + " : ") + M(N(a) + " - " + N(r6(b + c)) + " = " + N(v)) + ".",
          { ctx: paren ? "parenthese" : "enchainement", guide: [G(paren ? "La parenthèse " + M(N(b) + " + " + N(c)) + " = ?" : "On soustrait d'abord " + M(N(b)) + " : " + M(N(a) + " - " + N(b)) + " = ?", paren ? r6(b + c) : r6(a - b), M(N(paren ? r6(b + c) : r6(a - b))) + "."), G("Résultat ?", v, M(N(v)) + ".")],
            traps: [TR(r6(a - b + c), paren ? "Le signe − devant la parenthèse s'applique aux deux nombres." : "On soustrait les deux nombres."), TR(r6(a - b - c / 10), "Aligne les virgules.")] }); },
      () => { const t0 = dec(-4, 6, 1), u = dec(2, 9, 1), d = dec(3, 12, 1), v = r6(t0 + u - d);
        return Qv("Le matin, il fait " + M(N(t0) + "\\,°\\text{C}") + ". La température monte de " + M(N(u)) + " °C, puis baisse de " + M(N(d)) + " °C. Quelle température fait-il (en °C) ?", v, M(par(t0) + " + " + N(u) + " - " + N(d) + " = " + N(v)) + " °C.",
          { ctx: "temperature", guide: [G("Après la hausse ?", r6(t0 + u), M(N(r6(t0 + u))) + " °C."), G("Après la baisse ?", v, M(N(v)) + " °C.")], traps: [TR(r6(t0 + u + d), "La température baisse ensuite : on soustrait " + N(d) + "."), TR(r6(t0 - u + d), "Elle monte d'abord, puis baisse.")] }); },
      () => { const B = pk([20, 30, 50]), xs = [dec(2, 9, 2), dec(2, 9, 2), dec(1, 6, 2)].map((x) => r6(Math.round(x * 20) / 20)), s = r6(xs.reduce((a, b) => a + b, 0)), v = r6(B - s); if (v <= 0) return null;
        return Qv("Avec " + M(B) + " CHF, " + who() + " achète un cahier à " + M(C(xs[0])) + " CHF, un classeur à " + M(C(xs[1])) + " CHF et un stylo à " + M(C(xs[2])) + " CHF. Combien lui reste-t-il (en CHF) ?", v, "Dépense : " + M(C(xs[0]) + " + " + C(xs[1]) + " + " + C(xs[2]) + " = " + C(s)) + " CHF ; reste " + M(B + " - " + C(s) + " = " + C(v)) + " CHF.",
          { ctx: "budget", guide: [G("Dépense totale (CHF) ?", s, M(C(s)) + " CHF."), G("Reste (CHF) ?", v, M(B + " - " + C(s) + " = " + C(v)) + " CHF.")], traps: [TR(s, "C'est la dépense ; on demande ce qui reste."), TR(r6(B - xs[0] - xs[1] + xs[2]), "On soustrait les trois prix.")] }); },
    ],
  };

  // ===================== decmul : multiplier des décimaux =====================
  const DM = {
    1: [
      () => { const a = dec(1, 9, pk([1, 2])), k = R.int(3, 9), v = r6(a * k), n = Math.round(a * 10 ** nd(a));
        return Qv("Calcule sans calculatrice : " + M(N(a) + " \\cdot " + k), v, "Sans la virgule : " + M(n + " \\cdot " + k + " = " + n * k) + " ; " + M(N(a)) + " a " + nd(a) + " décimale" + (nd(a) > 1 ? "s" : "") + ", donc " + M(N(v)) + ".",
          { ctx: "calcul", guide: [G("Sans la virgule : " + M(n + " \\cdot " + k) + " = ?", n * k, M(n * k) + "."), G("On remet " + nd(a) + " décimale" + (nd(a) > 1 ? "s" : "") + " : résultat ?", v, M(N(v)) + ".")],
            traps: [TR(n * k, "Il faut replacer la virgule : " + N(a) + " a " + nd(a) + " décimale(s)."), TR(r6(v / 10), "Le résultat a autant de décimales que " + N(a) + " (pas plus).")] }); },
      () => { const p = r6(R.int(5, 95) / 20), n = R.int(3, 12), c = pk([["Un stylo coûte", "stylos"], ["Un ticket de bus coûte", "tickets"], ["Un croissant coûte", "croissants"]]), v = r6(p * n);
        return Qv(c[0] + " " + M(C(p)) + " CHF. Combien coûtent " + M(n) + " " + c[1] + " (en CHF) ?", v, M(n + " \\cdot " + C(p) + " = " + C(v)) + " CHF.",
          { ctx: "achat", guide: [G("Prix de " + M(n) + " " + c[1] + " : " + M(n + " \\cdot " + C(p)) + " = ?", v, M(C(v)) + " CHF.")], traps: [TR(r6(p + n), "On multiplie le prix par le nombre d'objets."), TR(r6(Math.round(p * 100) * n), "Replace la virgule (les centimes).")] }); },
      () => { const a = dec(0.5, 99, pk([1, 2])), f = pk([10, 100, 1000, 0.1, 0.01]), v = r6(a * f);
        return Qv("Calcule : " + M(N(a) + " \\cdot " + N(f)), v, f >= 1 ? "Multiplier par " + N(f) + " : la virgule se déplace de " + Math.log10(f) + " rang" + (f > 10 ? "s" : "") + " vers la droite, " + M(N(v)) + "." : "Multiplier par " + N(f) + ", c'est diviser par " + N(1 / f) + " : la virgule se déplace vers la gauche, " + M(N(v)) + ".",
          { ctx: "puissance10", guide: [G("La virgule se déplace de combien de rangs ?", Math.abs(Math.round(Math.log10(f))), Math.abs(Math.round(Math.log10(f))) + " rang(s), vers la " + (f >= 1 ? "droite (le nombre grandit)." : "gauche (le nombre devient plus petit).")), G("Résultat ?", v, M(N(v)) + ".")],
            traps: [TR(r6(a / f), f >= 1 ? "Multiplier par " + N(f) + " agrandit le nombre." : "Multiplier par " + N(f) + " rend le nombre plus petit."), TR(r6(a * f * 10), "Compte les rangs : autant que de zéros dans " + N(f) + ".")] }); },
    ],
    2: [
      () => { const a = dec(0.2, 9.9, 1), b = dec(0.2, 9.9, 1), v = r6(a * b), na = Math.round(a * 10), nb = Math.round(b * 10); if (na % 10 === 0 || nb % 10 === 0) return null;
        return Qv("Calcule sans calculatrice : " + M(N(a) + " \\cdot " + N(b)), v, M(na + " \\cdot " + nb + " = " + na * nb) + " ; 1 + 1 = 2 décimales : " + M(N(v)) + ".",
          { ctx: "calcul", guide: [G("Sans les virgules : " + M(na + " \\cdot " + nb) + " = ?", na * nb, M(na * nb) + "."), G("Nombre total de décimales des deux facteurs ?", 2, "1 + 1 = 2."), G("Résultat ?", v, M(N(v)) + ".")],
            traps: [TR(r6(na * nb / 10), "Une décimale par facteur : il en faut 2 au résultat."), TR(r6(Math.floor(a) * Math.floor(b) + (a % 1) * (b % 1)), "On ne multiplie pas séparément les parties entières et décimales.")] }); },
      () => { const l = dec(1.5, 9.5, 1), L = dec(2, 14, 1), v = r6(l * L), c = pk([["Calcule l'aire d'un rectangle de " + M(N(L)) + " m sur " + M(N(l)) + " m (en m²).", "aire", "m²"], ["Le sol d'une salle rectangulaire mesure " + M(N(L)) + " m sur " + M(N(l)) + " m. Quelle est son aire (en m²) ?", "tapis", "m²"]]);
        return Qv(c[0], v, M(N(L) + " \\cdot " + N(l) + " = " + N(v)) + " " + c[2] + ".",
          { ctx: c[1], guide: [G("Aire = longueur · largeur. Sans les virgules : " + M(Math.round(L * 10) + " \\cdot " + Math.round(l * 10)) + " = ?", Math.round(L * 10) * Math.round(l * 10), M(Math.round(L * 10) * Math.round(l * 10)) + "."), G("Avec 2 décimales : aire ?", v, M(N(v)) + " " + c[2] + ".")],
            traps: [TR(r6(2 * (l + L)), "Ça, c'est le périmètre."), TR(r6(v * 10), "Deux décimales au total.")] }); },
      () => { const p = r6(R.int(25, 199) / 10), m = dec(0.5, 4.5, 1), v = r6(p * m), c = pk([["Un tissu coûte " + M(C(p)) + " CHF le mètre. Combien coûtent " + M(N(m)) + " m de ce tissu (en CHF) ?", "tissu"], ["Le fromage coûte " + M(C(p)) + " CHF le kilo. Combien coûtent " + M(N(m)) + " kg (en CHF) ?", "fromage"]]);
        return Qv(c[0], v, M(N(m) + " \\cdot " + C(p) + " = " + C(v)) + " CHF.",
          { ctx: c[1], guide: [G(M(N(m) + " \\cdot " + N(p)) + " = ? (place bien la virgule)", v, M(N(v)) + " CHF.")], traps: [TR(r6(p / m), "On multiplie le prix unitaire par la quantité."), TR(r6(v * 10), "Compte les décimales des deux facteurs.")] }); },
    ],
    3: [
      () => { const c = dec(0.2, 3.5, 1), v = r6(c * c), n = Math.round(c * 10);
        return Qv("Calcule l'aire d'un carré de côté " + M(N(c)) + " m (en m²).", v, M(N(c) + "^2 = " + N(c) + " \\cdot " + N(c) + " = " + N(v)) + " m².",
          { ctx: "carre", guide: [G(M(n + " \\cdot " + n) + " = ?", n * n, M(n * n) + "."), G("Avec 2 décimales : aire ?", v, M(N(v)) + " m².")], traps: [TR(r6(2 * c), "Le carré, c'est " + N(c) + " · " + N(c) + ", pas 2 · " + N(c) + "."), TR(r6(4 * c), "Ça, c'est le périmètre.")] }); },
      () => { const pk2 = r6(R.int(80, 380) / 10), g = R.int(1, 9) * 100, v = r6(pk2 * g / 1000), c = pk(["Le jambon", "Le fromage d'alpage", "Le chocolat en vrac"]);
        return Qv(c + " coûte " + M(C(pk2)) + " CHF le kilo. Combien paie-t-on pour " + M(g) + " g (en CHF) ?", v, M(g + "\\text{ g} = " + N(g / 1000) + "\\text{ kg}") + " ; " + M(N(g / 1000) + " \\cdot " + C(pk2) + " = " + C(v)) + " CHF.",
          { ctx: "grammes", guide: [G(M(g) + " g en kg ?", g / 1000, M(N(g / 1000)) + " kg."), G("Prix ?", v, M(N(g / 1000) + " \\cdot " + C(pk2) + " = " + C(v)) + " CHF.")],
            traps: [TR(r6(pk2 * g), "Convertis d'abord les grammes en kilos."), TR(r6(pk2 * g / 100), "1 kg = 1000 g.")] }); },
      () => { const a = dec(0.11, 0.99, 2), b = dec(0.2, 0.9, 1), v = r6(a * b), na = Math.round(a * 100), nb = Math.round(b * 10); if (na % 10 === 0) return null;
        return Qv("Calcule sans calculatrice : " + M(N(a) + " \\cdot " + N(b)), v, M(na + " \\cdot " + nb + " = " + na * nb) + " ; 2 + 1 = 3 décimales : " + M(N(v)) + ". (Multiplier par un nombre plus petit que 1 donne un résultat plus petit.)",
          { ctx: "petit", guide: [G("Sans les virgules : " + M(na + " \\cdot " + nb) + " = ?", na * nb, M(na * nb) + "."), G("Nombre de décimales au résultat ?", 3, "2 + 1 = 3."), G("Résultat ?", v, M(N(v)) + ".")],
            traps: [TR(r6(na * nb / 100), "Il faut 3 décimales : 2 + 1."), TR(r6(a + b), "On multiplie.")] }); },
    ],
  };

  // ===================== decdiv : diviser des décimaux =====================
  const DD = {
    1: [
      () => { const k = R.int(2, 9), q = dec(0.3, 9.9, 1), a = r6(q * k), n = Math.round(a * 10);
        return Qv("Calcule sans calculatrice : " + M(N(a) + " \\div " + k), q, M(n + " \\div " + k + " = " + n / k) + " dixièmes, soit " + M(N(q)) + ".",
          { ctx: "calcul", guide: [G("En dixièmes, " + M(N(a)) + " = " + M(n) + " dixièmes. " + M(n + " \\div " + k) + " = ?", n / k, M(n / k) + " dixièmes."), G("Résultat ?", q, M(N(q)) + ".")],
            traps: [TR(n / k, "Ce sont des dixièmes : replace la virgule."), TR(r6(a * k), "On divise.")] }); },
      () => { const n = R.int(3, 8), each = r6(R.int(15, 160) / 4), tot = r6(each * n); if (Number.isInteger(each)) return null; /* 26.11 : 63 ÷ 7 = 9 n'est pas une division de décimaux */ const c = pk([["amis partagent équitablement une dépense de", "dépense"], ["élèves se partagent le prix d'un cadeau de", "cadeau"], ["colocataires partagent une facture de", "facture"]]);
        return Qv(M(n) + " " + c[0] + " " + M(C(tot)) + " CHF. Combien chacun paie-t-il (en CHF) ?", each, M(C(tot) + " \\div " + n + " = " + C(each)) + " CHF.",
          { ctx: c[1], guide: [G("Opération : " + M(C(tot) + " \\div " + n) + ". Résultat ?", each, M(C(each)) + " CHF (vérifie : " + n + " · " + C(each).replace("{,}", ",") + " = " + C(tot).replace("{,}", ",") + ").")], traps: [TR(r6(tot * n), "On partage : on divise."), TR(r6(tot - n), "On divise par le nombre de personnes.")] }); },
      () => { const a = dec(0.5, 99, pk([1, 2])), f = pk([10, 100, 1000]), v = r6(a / f);
        return Qv("Calcule : " + M(N(a) + " \\div " + N(f)), v, "Diviser par " + N(f) + " : la virgule se déplace de " + Math.log10(f) + " rang(s) vers la gauche, " + M(N(v)) + ".",
          { ctx: "puissance10", guide: [G("De combien de rangs la virgule se déplace-t-elle vers la gauche ?", Math.log10(f), Math.log10(f) + " rang(s), autant que de zéros dans " + N(f) + "."), G("Résultat ?", v, M(N(v)) + ".")], traps: [TR(r6(a * f), "Diviser rend le nombre plus petit."), TR(r6(v / 10), "Compte les zéros de " + N(f) + ".")] }); },
    ],
    2: [
      () => { const b = pk([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.7]), q = R.int(3, 19), a = r6(b * q);
        return Qv("Calcule sans calculatrice : " + M(N(a) + " \\div " + N(b)), q, "On multiplie les deux nombres par 10 (le quotient ne change pas) : " + M(N(r6(a * 10)) + " \\div " + Math.round(b * 10) + " = " + q) + ".",
          { ctx: "calcul", guide: [G("On multiplie les deux nombres par 10. " + M(N(a)) + " devient ?", r6(a * 10), M(N(r6(a * 10))) + "."), G(M(N(r6(a * 10)) + " \\div " + Math.round(b * 10)) + " = ?", q, M(q) + ".")], traps: [TR(r6(q / 10), "Diviser par " + N(b) + " (plus petit que 1) donne un résultat PLUS GRAND que " + N(a) + "."), TR(r6(a * b), "On divise.")] }); },
      () => { const m = pk([0.25, 0.4, 0.5, 0.75, 0.2]), n = R.int(4, 16), L = r6(m * n), c = pk([["Une barre de " + M(N(L)) + " m est coupée en morceaux de " + M(N(m)) + " m. Combien de morceaux obtient-on ?", "barre"], ["Combien de verres de " + M(N(m)) + " L peut-on remplir avec " + M(N(L)) + " L de jus ?", "verres"], ["Combien de sachets de " + M(N(m)) + " kg peut-on remplir avec " + M(N(L)) + " kg de riz ?", "sachets"]]);
        return Qv(c[0], n, M(N(L) + " \\div " + N(m) + " = " + n) + ".",
          { ctx: c[1], guide: [G("On cherche combien de fois " + M(N(m)) + " entre dans " + M(N(L)) + ". Multiplie les deux par 100 : " + M(Math.round(L * 100) + " \\div " + Math.round(m * 100)) + " = ?", n, M(n) + ".")], traps: [TR(r6(L * m), "On divise la quantité totale par la taille d'une portion."), TR(r6(n / 10), "Le résultat est plus grand que " + N(L) + " quand on divise par un nombre plus petit que 1.")] }); },
      () => { const a = dec(1, 9, 1), q = R.int(3, 9), b = r6(a * q); if ((String(a) + "." + String(b)).split(".").includes(String(q))) return null; // réponse pas lisible dans l'énoncé
        return Qv("Complète : " + M(N(a) + " \\cdot \\,?\\, = " + N(b)), q, "Le nombre manquant est " + M(N(b) + " \\div " + N(a) + " = " + q) + ".",
          { ctx: "complete", guide: [G("Le nombre manquant est " + M(N(b) + " \\div " + N(a)) + ". Multiplie les deux par 10 : " + M(Math.round(b * 10) + " \\div " + Math.round(a * 10)) + " = ?", q, M(q) + ".")], traps: [TR(r6(b - a), "Ici c'est une multiplication : on divise pour trouver le facteur."), TR(r6(b * a), "On divise.")] }); },
    ],
    3: [
      () => { const b = pk([0.04, 0.05, 0.03, 0.06, 0.08, 0.02]), q = R.int(3, 19), a = r6(b * q);
        return Qv("Calcule sans calculatrice : " + M(N(a) + " \\div " + N(b)), q, "On multiplie les deux par 100 : " + M(Math.round(a * 100) + " \\div " + Math.round(b * 100) + " = " + q) + ".",
          { ctx: "calcul", guide: [G("Par combien faut-il multiplier " + M(N(b)) + " pour obtenir un entier ?", 100, "Par 100 (deux décimales)."), G(M(Math.round(a * 100) + " \\div " + Math.round(b * 100)) + " = ?", q, M(q) + ".")], traps: [TR(r6(q / 100), "Diviser par un petit nombre donne un grand résultat."), TR(r6(q / 10), "Multiplie les deux nombres par 100, pas par 10.")] }); },
      () => { const m = pk([1.5, 2.5, 0.5, 1.2, 0.8]), pk2 = r6(R.int(40, 240) / 10), tot = r6(m * pk2); if (Math.round(tot * 100) % 5 !== 0) return null; const c = pk(["kg de fromage", "kg de cerises", "kg de viande hachée"]);
        return Qv(M(N(m)) + " " + c + " coûtent " + M(C(tot)) + " CHF. Quel est le prix d'un kilo (en CHF) ?", pk2, M(C(tot) + " \\div " + N(m) + " = " + C(pk2)) + " CHF.",
          { ctx: "prixkilo", guide: [G("Prix d'un kilo = " + M(C(tot) + " \\div " + N(m)) + ". Multiplie les deux par 10 : " + M(N(r6(tot * 10)) + " \\div " + N(m * 10)) + " = ?", pk2, M(C(pk2)) + " CHF.")], traps: [TR(r6(tot * m), "On divise le prix par la masse."), TR(r6(m / tot), "Prix ÷ masse, pas masse ÷ prix.")] }); },
      () => { const a = dec(1, 50, pk([1, 2])), d = pk([0.1, 0.01, 0.5, 0.25]), v = r6(a / d);
        return Qv("Calcule : " + M(N(a) + " \\div " + N(d)), v, "Diviser par " + N(d) + ", c'est multiplier par " + N(1 / d) + " : " + M(N(a) + " \\cdot " + N(1 / d) + " = " + N(v)) + ".",
          { ctx: "inverse", guide: [G("Diviser par " + M(N(d)) + " revient à multiplier par quel nombre ?", 1 / d, M(N(1 / d)) + " (car " + N(d) + " · " + N(1 / d) + " = 1)."), G("Résultat ?", v, M(N(v)) + ".")], traps: [TR(r6(a * d), "Diviser par un nombre plus petit que 1 agrandit le nombre."), TR(r6(a / d / 10), "Diviser par " + N(d) + " = multiplier par " + N(1 / d) + ".")] }); },
    ],
  };

  // ===================== reladd : additionner et soustraire des relatifs =====================
  const RA = {
    1: [
      () => { const a = nz(-15, 15), b = nz(-15, 15); if (a > 0 && b > 0) return null; const v = a + b, A = Math.abs(a), B = Math.abs(b), same = a * b > 0, fmt = pk([0, 1, 2]), sa = fmt === 1 ? par(a) : String(a), sb = fmt ? par(b) : par(b);
        return Qv("Calcule : " + M(sa + " + " + sb), v, M(sa + " + " + sb + " = " + v) + (same ? " : même signe, on additionne les distances à zéro." : " : signes contraires, on soustrait les distances et on garde le signe du plus éloigné de zéro."),
          { ctx: same ? "meme-signe" : "signes-contraires", guide: same ? [G("Même signe : " + M(A + " + " + B) + " = ?", A + B, M(A + B) + "."), G("Avec le signe commun ?", v, M(v) + ".")] : [G("Signes contraires : " + M(Math.max(A, B) + " - " + Math.min(A, B)) + " = ?", Math.abs(A - B), M(Math.abs(A - B)) + "."), G("Signe du plus éloigné de zéro (" + M(A > B ? a : b) + ") : résultat ?", v, M(v) + ".")],
            traps: [TR(-v, "Signe : celui du nombre le plus éloigné de zéro."), TR(same ? (a > 0 ? 1 : -1) * Math.abs(A - B) : (Math.abs(a) > Math.abs(b) ? Math.sign(a) : Math.sign(b)) * (A + B), same ? "Même signe : on additionne les distances." : "Signes contraires : on soustrait les distances.")] }); },
      () => { const s = nz(-8, 8), m = nz(-12, 12), v = s + m;
        return Qv("Sur une droite graduée, on part de " + M(s) + " et on se déplace de " + M(Math.abs(m)) + (Math.abs(m) > 1 ? " unités" : " unité") + " vers la " + (m > 0 ? "droite" : "gauche") + ". Où arrive-t-on ?", v, M(par(s) + (m > 0 ? " + " : " - ") + Math.abs(m) + " = " + v) + ".",
          { ctx: "droite", fig: FIG.numberLine(s, [], { span: [v] }), guide: [G("Aller vers la " + (m > 0 ? "droite, c'est ajouter" : "gauche, c'est soustraire") + " : " + M(par(s) + (m > 0 ? " + " : " - ") + Math.abs(m)) + " = ?", v, M(v) + ".")], traps: [TR(s - m, m > 0 ? "Vers la droite, on monte : on ajoute." : "Vers la gauche, on descend : on soustrait."), TR(-v, "Vérifie le signe sur la droite graduée.")] }); },
      () => { const a = -R.int(2, 15), b = R.int(2, 15), c = pk([["Un compte affiche un solde de " + M(a * 10) + " CHF. On dépose " + M(b * 10) + " CHF. Nouveau solde (en CHF) ?", "compte", 10], ["Un ascenseur part du niveau " + M(a) + " et monte de " + M(b) + " étages. À quel niveau arrive-t-il ?", "ascenseur", 1]]), k = c[2], v = (a + b) * k;
        return Qv(c[0], v, M(par(a * k) + " + " + b * k + " = " + v) + ".",
          { ctx: c[1], guide: [G("Calcul " + M(par(a * k) + " + " + b * k) + " = ?", v, M(v) + ".")], traps: [TR((Math.abs(a) + b) * k, "On part d'un nombre négatif : " + par(a * k) + " + " + b * k + "."), TR(-v, "Vérifie le signe.")] }); },
    ],
    2: [
      () => { const a = nz(-15, 15), b = nz(-15, 15), v = a - b;
        return Qv("Calcule : " + M(par(a) + " - " + par(b)), v, "Soustraire, c'est ajouter l'opposé : " + M(par(a) + " + " + par(-b) + " = " + v) + ".",
          { ctx: b < 0 ? "moins-negatif" : "moins-positif", guide: [G("On ajoute l'opposé de " + M(b) + " : quel nombre ajoute-t-on ?", -b, M(-b) + "."), G(M(par(a) + " + " + par(-b)) + " = ?", v, M(v) + ".")], traps: [TR(a + b, "Soustraire " + par(b) + ", c'est ajouter " + par(-b) + "."), TR(-v, "Vérifie le signe.")] }); },
      () => { const a = R.int(-12, 8), b = R.int(2, 15), c = pk([["Il fait " + M(a) + " °C. La température baisse encore de " + M(b) + " °C. Quelle température fait-il ?", "temperature"], ["Un plongeur est à " + M(-Math.abs(a) - 2) + " m (sous la surface). Il descend encore de " + M(b) + " m. À quelle altitude est-il (en m) ?", "plongeur"]]), s = c[1] === "plongeur" ? -Math.abs(a) - 2 : a, v = s - b;
        return Qv(c[0], v, M(par(s) + " - " + b + " = " + v) + ".", { ctx: c[1], guide: [G("Baisser, c'est soustraire : " + M(par(s) + " - " + b) + " = ?", v, M(v) + ".")], traps: [TR(s + b, "La valeur baisse : on soustrait."), TR(-(Math.abs(s) - b), "Partant d'un négatif, on s'éloigne encore de zéro.")] }); },
      () => { const a = -R.int(3, 20), b = R.int(2, 18), v = b - a, c = pk([["Quel est l'écart de température entre " + M(a) + " °C la nuit et " + M(b) + " °C le jour ?", "ecart-temperature"], ["La ville A est à " + M(a) + " m (sous le niveau de la mer), la ville B à " + M(b * 10) + " m. Quel est l'écart d'altitude (en m) ?", "ecart-altitude"]]), k = c[1] === "ecart-altitude" ? 10 : 1, bb = b * k, vv = bb - a;
        return Qv(c[0], vv, M(bb + " - " + par(a) + " = " + bb + " + " + -a + " = " + vv) + ".",
          { ctx: c[1], guide: [G("Écart = plus grand − plus petit : " + M(bb + " - " + par(a)) + " = ?", vv, M(bb + " + " + -a + " = " + vv) + ".")], traps: [TR(bb + a, "Soustraire un négatif, c'est ajouter : " + bb + " − (" + a + ") = " + bb + " + " + -a + "."), TR(-vv, "Un écart est positif.")] }); },
    ],
    3: [
      () => { let xs; do xs = Array.from({ length: 5 }, () => nz(-12, 12)); while (xs.filter((x) => x < 0).length < 2 || xs.filter((x) => x > 0).length < 2); /* 28.11 (audit 10e) : « 7 + 11 + 9 + 4 + 8 » sortait (que des positifs) */
        const v = xs.reduce((s, x) => s + x, 0), pos = xs.filter((x) => x > 0).reduce((s, x) => s + x, 0), neg = xs.filter((x) => x < 0).reduce((s, x) => s + x, 0);
        const e = xs.map((x, i) => (i === 0 ? String(x) : x < 0 ? " - " + -x : " + " + x)).join("");
        return Qv("Calcule : " + M(e), v, "On regroupe les positifs (" + M(pos) + ") et les négatifs (" + M(neg) + ") : " + M(pos + " + " + par(neg) + " = " + v) + ".",
          { ctx: "regrouper", guide: [G("Somme des termes positifs ?", pos, M(pos) + "."), G("Somme des termes négatifs ?", neg, M(neg) + "."), G("Total ?", v, M(v) + ".")], traps: [TR(pos - neg, "Les termes négatifs se soustraient : total = " + pos + " + (" + neg + ")."), TR(-v, "Vérifie le signe.")] }); },
      () => { const a = R.int(5, 15), b = R.int(3, 12), c = R.int(2, 9), d = R.int(2, 15), v = d - c; if (v === 0 || [a, b, c, d].includes(Math.abs(v)) || new Set([a, b, c, d]).size < 4) return null;
        const e = "-" + a + " + " + b + " - " + c + " + " + a + " - " + b + " + " + d;
        return Qv("Calcule astucieusement : " + M(e), v, "Les opposés s'annulent : " + M("-" + a + " + " + a + " = 0") + " et " + M(b + " - " + b + " = 0") + ". Il reste " + M("-" + c + " + " + d + " = " + v) + ".",
          { ctx: "opposes", guide: [G(M("-" + a + " + " + a) + " = ?", 0, "0 : ce sont des opposés."), G(M(b + " - " + b) + " = ?", 0, "0."), G("Il reste " + M("-" + c + " + " + d) + " = ?", v, M(v) + ".")], traps: [TR(c + d, "−" + c + " + " + d + " : on soustrait " + c + "."), TR(-2 * a + 2 * b + v, "−" + a + " et +" + a + " s'annulent.")] }); },
      () => { const s0 = R.int(-300, 200), mv = [R.int(50, 250), -R.int(60, 300), R.int(20, 150), -R.int(10, 120)], v = s0 + mv.reduce((s, x) => s + x, 0);
        return Qv("Un compte a un solde de " + M(s0) + " CHF. On dépose " + M(mv[0]) + " CHF, on retire " + M(-mv[1]) + " CHF, on dépose " + M(mv[2]) + " CHF, puis on retire " + M(-mv[3]) + " CHF. Nouveau solde (en CHF) ?", v, M(par(s0) + " + " + mv[0] + " - " + -mv[1] + " + " + mv[2] + " - " + -mv[3] + " = " + v) + " CHF.",
          { ctx: "solde", guide: [G("Total des dépôts ?", mv[0] + mv[2], M(mv[0] + mv[2]) + " CHF."), G("Total des retraits ?", -(mv[1] + mv[3]), M(-(mv[1] + mv[3])) + " CHF."), G("Nouveau solde ?", v, M(par(s0) + " + " + (mv[0] + mv[2]) + " - " + -(mv[1] + mv[3]) + " = " + v) + " CHF.")],
            traps: [TR(s0 + mv[0] - mv[1] + mv[2] - mv[3], "Les retraits se soustraient, les dépôts s'ajoutent."), TR(-s0 + mv.reduce((s, x) => s + x, 0), "On part du solde " + s0 + " (avec son signe).")] }); },
    ],
  };

  const PROBS = {
    ordgr: [() => P("Une classe de 23 élèves part en course d'école. Le car coûte 1'180 CHF et l'entrée au musée 18 CHF par élève.", [["a) Estimation du prix des entrées (20 élèves à 20 CHF)", 400], ["b) Estimation du coût total (car arrondi à la centaine)", 1600], ["c) Coût exact (CHF)", 1594]], ["Arrondis 23 à 20 et 18 à 20.", "1'180 ≈ 1'200."], "a) " + M("20 \\cdot 20 = 400") + " ; b) " + M("1\\text{'}200 + 400 = 1\\text{'}600") + " ; c) " + M("1\\text{'}180 + 23 \\cdot 18 = 1\\text{'}594") + " : l'estimation était bonne.")],
    decadd: [() => P("Mia a 50 CHF. Elle achète un livre à 18,90 CHF et un stylo à 4,35 CHF.", [["a) Dépense totale (CHF)", 23.25], ["b) Argent restant (CHF)", 26.75], ["c) Il lui manque combien pour un jeu à 32,50 CHF ?", 5.75]], ["18,90 + 4,35.", "50 − 23,25."], "a) " + M("23{,}25") + " ; b) " + M("50 - 23{,}25 = 26{,}75") + " ; c) " + M("32{,}50 - 26{,}75 = 5{,}75") + " CHF.")],
    decmul: [() => P("On carrelle une pièce rectangulaire de 4,5 m sur 3,2 m. Le carrelage coûte 38,50 CHF le m².", [["a) Aire de la pièce (m²)", 14.4], ["b) Prix du carrelage (CHF)", 554.4], ["c) Prix avec 10 % de chutes (on achète 1,1 fois l'aire) (CHF)", 609.84]], ["4,5 · 3,2.", "14,4 · 38,50."], "a) " + M("14{,}4") + " m² ; b) " + M("14{,}4 \\cdot 38{,}50 = 554{,}40") + " CHF ; c) " + M("554{,}40 \\cdot 1{,}1 = 609{,}84") + " CHF.")],
    decdiv: [() => P("Une famille de 4 personnes paie 67,60 CHF pour un repas. La boisson coûte 2,80 CHF par personne.", [["a) Part de chacun (CHF)", 16.9], ["b) Part de chacun sans les boissons (CHF)", 14.1], ["c) Combien de boissons à 2,80 CHF avec 14 CHF ?", 5]], ["67,60 ÷ 4.", "14 ÷ 2,8 = 140 ÷ 28."], "a) " + M("16{,}90") + " ; b) " + M("16{,}90 - 2{,}80 = 14{,}10") + " ; c) " + M("14 \\div 2{,}8 = 5") + ".")],
    reladd: [() => P("Un randonneur part d'un lac à l'altitude 372 m. Il monte de 1'140 m, redescend de 385 m, puis remonte de 210 m.", [["a) Altitude après la première montée (m)", 1512], ["b) Altitude finale (m)", 1337], ["c) Dénivelé total à la montée (m)", 1350]], ["372 + 1'140.", "Montées : 1'140 + 210."], "a) " + M("1\\text{'}512") + " ; b) " + M("1\\text{'}512 - 385 + 210 = 1\\text{'}337") + " ; c) " + M("1\\text{'}140 + 210 = 1\\text{'}350") + " m.")],
  };

  // « Trouve l'erreur » (24.11, chantier I, suite) : décimales d'un produit, soustraction d'un négatif.
  const camarade = () => pk(["Sam", "Lina", "Noé", "Inès", "Yanis", "Léa"]);
  DM[2].push(() => { const u = R.int(0, 3), a = R.int(1, 9), b = R.int(2, 9), x = r6(u + a / 10), y = r6(b / 10), n = (10 * u + a) * b, v = r6(n / 100), faux = r6(n / 10), w = camarade();
    if (n % 10 === 0) return null;
    return Qv(w + " écrit : « " + M(N(x) + " \\cdot " + N(y) + " = " + N(faux)) + " ». Trouve l'erreur, puis donne le bon produit.", v,
      "Erreur : " + w + " n'a gardé qu'une décimale, comme pour une addition. Pour un produit, on compte les décimales des <b>deux</b> facteurs : 1 + 1 = 2. " + M((10 * u + a) + " \\cdot " + b + " = " + n) + ", donc " + M(N(x) + " \\cdot " + N(y) + " = " + N(v)) + ". Contrôle : multiplier par " + M(N(y)) + " (moins que 1) rend le nombre plus petit.",
      { ctx: "erreur", guide: [G("Sans les virgules : " + M((10 * u + a) + " \\cdot " + b) + " = ?", n, M(n) + "."), G("Nombre total de décimales des deux facteurs ?", 2, "1 + 1 = 2."), G("Le bon produit ?", v, M(N(v)) + ".")],
        traps: [TR(faux, "C'est le résultat de " + w + " : " + M(N(x) + " \\cdot " + N(y)) + " a deux décimales, une par facteur.")] }); });
  RA[2].push(() => { const a = nz(-12, 12), b = R.int(2, 12), c = R.int(2, 12), v = a + b - c, faux = a - b - c, w = camarade();
    if (Math.abs(v) < 2 || [a, b, c, faux, a - b, a + b].some((t) => Math.abs(t) === Math.abs(v))) return null;
    return Qv(w + " écrit : « " + M(N(a) + " - (-" + b + ") + (-" + c + ") = " + N(a) + " - " + b + " - " + c + " = " + N(faux)) + " ». Trouve l'erreur, puis calcule correctement.", v,
      "Erreur : soustraire " + M("(-" + b + ")") + ", c'est ajouter son opposé " + M(b) + ". " + M(N(a) + " - (-" + b + ") + (-" + c + ") = " + N(a) + " + " + b + " - " + c + " = " + N(v)) + ".",
      { ctx: "erreur", guide: [G("Soustraire " + M("(-" + b + ")") + ", c'est ajouter " + M(b) + " : " + M(N(a) + " + " + b) + " = ?", a + b, M(N(a + b)) + "."), G("Puis ajouter " + M("(-" + c + ")") + " : " + M(par(a + b) + " - " + c) + " = ?", v, M(N(v)) + ".")],
        traps: [TR(faux, "C'est le résultat de " + w + " : moins par moins, " + M("-(-" + b + ") = +" + b) + ".")] }); });

  const ALL = { ordgr: OG, decadd: DA, decmul: DM, decdiv: DD, reladd: RA };
  for (const [id, lv] of Object.entries(ALL)) {
    GEN[id] = (d) => pickForm(lv[Math.min(Math.max(d, 1), 3)]);
    if (typeof VAR !== "undefined") VAR[id] = {};
    if (typeof PROB !== "undefined") delete PROB[id];
    PROB_EXTRA[id] = PROBS[id];
  }
  Object.assign(HINTS_EXTRA, {
    ordgr: "Arrondis chaque nombre comme demandé (chiffre suivant ≥ 5 → vers le haut), puis calcule avec les nombres arrondis. Sert à vérifier un résultat.",
    decadd: "Aligne les virgules (complète par des zéros), puis calcule comme avec des entiers. Vérifie une soustraction par une addition.",
    decmul: "Multiplie sans les virgules, puis place autant de décimales que dans les deux facteurs réunis. × 10, 100… : la virgule va à droite.",
    /* 26.11 (revue des élèves testeurs, n° 2 : « diviser par un décimal » affiché pour 18,8 ÷ 2) : indice valable pour toutes les formes */
    decdiv: "Divise comme avec des entiers ; la virgule du quotient se place dès que tu abaisses le chiffre des dixièmes. Si le diviseur est décimal, multiplie d'abord les deux nombres par 10, 100… pour qu'il devienne entier.",
    reladd: "Même signe : on additionne les distances. Signes contraires : on soustrait, signe du plus éloigné de zéro. Soustraire, c'est ajouter l'opposé.",
  });
  if (typeof COMPS !== "undefined") Object.assign(COMPS, {
    ordgr: ["Arrondir, estimer une somme ou une différence", "Estimer un produit, vérifier un résultat", "Estimer un quotient, multiplier par un décimal"],
    decadd: ["Additionner, compléter, rendre la monnaie", "Soustraire, longueurs, écarts", "Enchaînements, températures, budget"],
    decmul: ["Décimal × entier, achats, × 10 ou × 0,1", "Décimal × décimal, aires, prix au mètre", "Carrés, prix au kilo en grammes, petits facteurs"],
    decdiv: ["Décimal ÷ entier, partage, ÷ 10", "Diviser par un décimal, portions, compléter", "Diviser par 0,04, prix au kilo, ÷ 0,1"],
    reladd: ["Additionner, droite graduée, solde", "Soustraire, températures, écarts", "Regrouper, opposés, relevé de compte"],
  });
})();
