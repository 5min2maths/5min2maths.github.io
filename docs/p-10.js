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
  const Qv = (q, value, sol, o = {}) => { const x = { q, spec: { kind: "value", value: r6(value) }, sol, guide: o.guide, traps: keep(r6(value), o.traps), ctx: o.ctx }; if (o.fig) x.fig = o.fig; return x; };
  const G = (ask, value, sol) => GS(ask, r6(value), sol);
  const TR = (v, m) => TRAP(r6(v), m);
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const who = () => pk(["Lina", "Noé", "Inès", "Yanis", "Mia", "Sam", "Léa", "Tom"]);
  const dec = (lo, hi, k) => r6(R.int(lo * 10 ** k, hi * 10 ** k) / 10 ** k); // décimal à k décimales
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
      () => { const c = pk([["Un vélo coûte", "et un casque", "le prix total"], ["Un billet de train coûte", "et l'hôtel", "le prix du voyage"], ["Une console coûte", "et un jeu", "le prix total"]]), a = R.int(120, 980), b = R.int(21, 99), A = roundTo(a, 10), B = roundTo(b, 10), v = A + B; if (a % 10 === 0 || b % 10 === 0) return null;
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
      () => { const l = dec(1.5, 9.5, 1), L = dec(2, 14, 1), v = r6(l * L), c = pk([["Calcule l'aire d'un rectangle de " + M(N(L)) + " m sur " + M(N(l)) + " m (en m²).", "aire", "m²"], ["Un tapis rectangulaire mesure " + M(N(L)) + " m sur " + M(N(l)) + " m. Quelle est son aire (en m²) ?", "tapis", "m²"]]);
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
      () => { const n = R.int(3, 8), each = r6(R.int(15, 160) / 4), tot = r6(each * n), c = pk([["amis partagent équitablement une dépense de", "dépense"], ["élèves se partagent le prix d'un cadeau de", "cadeau"], ["colocataires partagent une facture de", "facture"]]);
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
          { ctx: same ? "meme-signe" : "signes-contraires", fig: FIG.numberLine(a, []), guide: same ? [G("Même signe : " + M(A + " + " + B) + " = ?", A + B, M(A + B) + "."), G("Avec le signe commun ?", v, M(v) + ".")] : [G("Signes contraires : " + M(Math.max(A, B) + " - " + Math.min(A, B)) + " = ?", Math.abs(A - B), M(Math.abs(A - B)) + "."), G("Signe du plus éloigné de zéro (" + M(A > B ? a : b) + ") : résultat ?", v, M(v) + ".")],
            traps: [TR(-v, "Signe : celui du nombre le plus éloigné de zéro."), TR(same ? (a > 0 ? 1 : -1) * Math.abs(A - B) : (Math.abs(a) > Math.abs(b) ? Math.sign(a) : Math.sign(b)) * (A + B), same ? "Même signe : on additionne les distances." : "Signes contraires : on soustrait les distances.")] }); },
      () => { const s = nz(-8, 8), m = nz(-12, 12), v = s + m;
        return Qv("Sur une droite graduée, on part de " + M(s) + " et on se déplace de " + M(Math.abs(m)) + " unités vers la " + (m > 0 ? "droite" : "gauche") + ". Où arrive-t-on ?", v, M(par(s) + (m > 0 ? " + " : " - ") + Math.abs(m) + " = " + v) + ".",
          { ctx: "droite", fig: FIG.numberLine(s, []), guide: [G("Aller vers la " + (m > 0 ? "droite, c'est ajouter" : "gauche, c'est soustraire") + " : " + M(par(s) + (m > 0 ? " + " : " - ") + Math.abs(m)) + " = ?", v, M(v) + ".")], traps: [TR(s - m, m > 0 ? "Vers la droite, on monte : on ajoute." : "Vers la gauche, on descend : on soustrait."), TR(-v, "Vérifie le signe sur la droite graduée.")] }); },
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
      () => { const xs = Array.from({ length: 5 }, () => nz(-12, 12)), v = xs.reduce((s, x) => s + x, 0), pos = xs.filter((x) => x > 0).reduce((s, x) => s + x, 0), neg = xs.filter((x) => x < 0).reduce((s, x) => s + x, 0);
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
    decdiv: "Diviser par un décimal : multiplie les deux nombres par 10, 100… pour diviser par un entier. ÷ 0,1 = × 10.",
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

// Chantier 9e–10e (23.11) : sujets de préparation de qualité pour les chapitres de 10e du CO qui n'avaient que du
// drill (1. Relatifs et décimaux, 2. Aires et périmètres, 3. Écriture fractionnaire, 4. 3D, 10. Proportionnalité,
// 12. Figures planes, 13. Transformations ; 14. Diagrammes : banque commune RICH.diagr de riche_9.js).
// Même format et mêmes contrôles (chk, vals) que riche_9.js, dont il reprend les outils (RICHU). Modelé sur le MER 10e.
(function () {
  const { r6, N, Nk, A, T, u, Q, chf, pk, sh, g2, lcm, fr, fadd, fsub, fmul, fdiv, fv, ft, X, ul, who, tab, VF, hm, dur, fmt, svg, tx, ln, pg, grid } = RICHU;
  const sg = (v) => (v < 0 ? "(" + N(v) + ")" : N(v));
  const PI = Math.PI;

  // ===================== 10e · 1. Nombres relatifs et révision des décimaux =====================
  const EXR = [
    () => { const T0 = pk([6, 9, 12]), a1 = pk([1100, 1600, 2100]), [mt, S] = pk([["le Cervin", 4478], ["la Dent Blanche", 4357], ["le Grand Combin", 4314], ["la Pointe Dufour", 4634]]), t1 = r6(T0 - (0.6 * (a1 - 400)) / 100), tS = r6(T0 - (0.6 * (S - 400)) / 100), z = 400 + (T0 / 0.6) * 100;
      return X({ id: "rel", lv: 1, titre: "Il fait plus froid en altitude",
        q: "À Genève (altitude 400 m), il fait " + Q(T0, "°C") + ". En montagne, la température baisse d'environ " + Q(0.6, "°C") + " chaque fois qu'on monte de 100 m. Le téléphérique le plus proche a coûté " + pk([12, 25, 40]) + " millions de francs.",
        parts: [{ label: "Quelle température fait-il à " + N(a1) + " m d'altitude ?", pts: 2 }, { label: "Quelle température fait-il au sommet de " + mt + " (" + N(S) + " m) ? Arrondis au dixième.", pts: 2 }, { label: "À quelle altitude fait-il 0 °C ?", pts: 1 }, { label: "Quel est l'écart de température entre Genève et le sommet ?", pts: 1 }],
        sol: ul(["On monte de " + N(a1 - 400) + " m : " + M(T0 + " - " + N((a1 - 400) / 100) + " \\cdot 0{,}6 = " + N(t1)) + " °C.", M(T0 + " - " + N((S - 400) / 100) + " \\cdot 0{,}6 \\approx " + A(tS, 1)) + " °C.", "Il faut perdre " + T0 + " °C : " + M(T0 + " : 0{,}6 = " + N(T0 / 0.6)) + " fois 100 m, donc " + M("400 + " + N(z - 400) + " = " + N(z)) + " m. Le prix du téléphérique ne sert à rien.", M(T0 + " - (" + A(tS, 1) + ") = " + A(T0 - tS, 1)) + " °C."]),
        chk: [[tS < 0 && t1 !== 0, "signes"], [Math.abs(T0 - (0.6 * (z - 400)) / 100) < 1e-9, "0 °C"]], vals: [t1, tS, z, T0 - tS] }); },
    () => { let P; do P = [0, 1, 2].map(() => { const j = R.int(3, 15), f = R.int(2, 20 - j - 1); return [j, f, 20 - j - f]; }); while (!P.some((p) => 3 * p[0] - 2 * p[1] - p[2] < -1) || new Set(P.map((p) => 3 * p[0] - 2 * p[1] - p[2])).size < 3 || P.some((p) => Math.abs(3 * p[0] - 2 * p[1] - p[2]) < 2));
      const sc = P.map((p) => 3 * p[0] - 2 * p[1] - p[2]), nm = sh(["Aya", "Ben", "Chloé", "Dario", "Eva"]).slice(0, 3), win = sc.indexOf(Math.max(...sc)), j4 = pk([4, 6, 8]);
      return X({ id: "prio", lv: 2, titre: "Le quiz",
        q: "Un quiz compte 20 questions. Une réponse juste rapporte 3 points, une réponse fausse en enlève 2, une question sans réponse en enlève 1." + tab(["joueur", "justes", "fausses", "sans réponse"], P.map((p, i) => [nm[i], ...p])),
        parts: [{ label: "Pour chaque joueur, écris le calcul de son score avec des nombres relatifs, puis effectue-le.", pts: 3 }, { label: "Qui gagne ? Quel est l'écart entre le premier et le dernier ?", pts: 1 }, { label: "Combien de réponses fausses annulent " + j4 + " réponses justes ?", pts: 1 }],
        sol: ul([P.map((p, i) => nm[i] + " : " + M(p[0] + " \\cdot 3 + " + p[1] + " \\cdot (-2) + " + p[2] + " \\cdot (-1) = " + sc[i])).join(" ; ") + ".", nm[win] + " gagne ; écart " + M(Math.max(...sc) + " - " + sg(Math.min(...sc)) + " = " + (Math.max(...sc) - Math.min(...sc))) + " points.", M(j4 + " \\cdot 3 = " + 3 * j4) + " points ; " + M(3 * j4 + " : 2 = " + 1.5 * j4) + " réponses fausses."]),
        chk: [[P.every((p) => p[0] + p[1] + p[2] === 20 && p[2] >= 1), "20 questions"]], vals: [...sc, 1.5 * j4] }); },
    () => { const c = pk([5.8, 6.4, 7.2]), d = pk([235, 418, 362, 286]), p = pk([1.89, 1.95, 2.04]), est = Math.round(c) * Math.round(d / 100) * Math.round(p), L = r6((c * d) / 100), cost = Math.round(L * p * 100) / 100, ck = Math.round((cost / d) * 1000) / 10;
      return X({ id: "decmul", lv: 2, titre: "Le plein d'essence",
        q: "Une voiture consomme " + Q(c, "L") + " d'essence aux 100 km. Pour partir en vacances, la famille fait un trajet de " + Q(d, "km") + ". L'essence coûte " + chf(p) + " le litre.",
        parts: [{ label: "<b>Sans calculatrice</b> : estime le coût de l'essence pour ce trajet (arrondis chaque nombre).", pts: 1 }, { label: "Calcule la quantité d'essence utilisée.", pts: 1 }, { label: "Calcule le coût exact, au centime.", pts: 1 }, { label: "Combien coûte un kilomètre, en centimes (au dixième) ?", pts: 1 }],
        sol: ul([M(Math.round(c) + " \\cdot " + Math.round(d / 100) + " \\cdot " + Math.round(p) + " = " + est) + " : environ " + est + " CHF.", M(N(c) + " \\cdot " + N(d / 100) + " = " + N(L)) + " L.", M(N(L) + " \\cdot " + N(p) + " \\approx " + Nk(cost, 2)) + " CHF (proche de l'estimation).", M(Nk(cost, 2) + " : " + d + " \\approx " + N(ck / 100)) + " CHF, soit environ " + N(ck) + " centimes."]),
        chk: [[Math.abs(est - cost) < 0.4 * cost, "estimation"]], vals: [L, cost, ck] }); },
    () => { let a, b, U; do { a = pk([2, 3, -2, -3, 4]); b = pk([3, 5, -3, -5]); U = [a]; for (let k = 0; k < 4; k++) U.push(-2 * U[k] + b); } while (U.some((v) => Math.abs(v) < 2));
      let z; do z = R.int(-9, 9); while (Math.abs(z) < 2); const y = -2 * z + b;
      return X({ id: "rel", lv: 3, titre: "La machine à nombres",
        q: "Une machine multiplie le nombre qu'on lui donne par " + M("-2") + ", puis ajoute " + M(N(b)) + ". On lui donne " + M(N(a)) + ", puis on redonne chaque résultat à la machine.",
        parts: [{ label: "Calcule les quatre résultats suivants.", pts: 2 }, { label: "Quel nombre faut-il donner à la machine pour obtenir " + M(N(y)) + " ?", pts: 2 }, { label: "La machine peut-elle donner un nombre pair ? Explique.", pts: 1 }],
        sol: ul([U.slice(1).map((v, k) => M(sg(U[k]) + " \\cdot (-2) + " + sg(b) + " = " + N(v))).join(" ; ") + ".", "On défait les opérations dans l'ordre inverse : " + M(N(y) + " - " + sg(b) + " = " + N(y - b)) + ", puis " + M(N(y - b) + " : (-2) = " + N(z)) + ".", "Non : " + M("(-2) \\cdot x") + " est toujours pair, et on ajoute " + N(b) + ", qui est impair : le résultat est toujours impair."]),
        chk: [[(y - b) / -2 === z, "inverse"], [U.every((v) => Math.abs(v) % 2 === 1) || U.slice(1).every((v) => Math.abs(v) % 2 === 1), "impairs"]], vals: [...U.slice(1), z] }); },
  ];
  const RAISONR = [
    () => { const pool = [
      () => { const a = pk([3, 4, 5]); return [M("-" + a + "^2 = " + a * a), false, M("-" + a + "^2 = -(" + a + " \\cdot " + a + ") = -" + a * a) + " (seul " + a + " est au carré) ; c'est " + M("(-" + a + ")^2 = " + a * a) + "."]; },
      () => { const a = pk([2, 3]), b = pk([4, 5]), c = pk([2, 3]); return [M("(-" + a + ") \\cdot (-" + b + ") \\cdot (-" + c + ") = " + a * b * c), false, "Trois facteurs négatifs : le produit est négatif, " + M("-" + a * b * c) + "."]; },
      () => { const a = pk([5, 7]), b = pk([3, 4]); return [M("-" + a + " - " + b + " = -" + (a - b)), false, "On descend encore : " + M("-" + a + " - " + b + " = -" + (a + b)) + "."]; },
      () => { const a = pk([12, 18, 24]), b = pk([3, 6]); return [M("(-" + a + ") : (-" + b + ") = " + a / b), true, "Deux nombres de même signe : quotient positif."]; },
      () => { const a = pk([2, 3]), b = pk([4, 5]); return [M("(-" + a + ")^3 = -" + a ** 3), true, M("(-" + a + ") \\cdot (-" + a + ") \\cdot (-" + a + ")") + " : trois facteurs négatifs."]; },
      () => { const a = pk([4, 6, 8]), b = pk([2, 3]); return [M(a + " - " + b + " \\cdot (-3) = " + (a - b) * -3), false, "La multiplication d'abord : " + M(a + " - (" + -3 * b + ") = " + (a + 3 * b)) + "."]; },
    ];
      const L = sh(pool).slice(0, 4).map((f) => f()), w = who();
      return X({ id: "rel", lv: 2, titre: "Contrôle les calculs",
        q: w.n + " a fait ces calculs." + tab(["", "calcul"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
        parts: [{ label: "Lesquels sont faux ?", pts: 2 }, { label: "Corrige-les en expliquant la règle utilisée.", pts: 2 }],
        sol: ul([L.some((x) => !x[1]) ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + "." : "Aucun.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste. " : "faux. ") + x[2]).join(" ") ]),
        chk: [[L.length === 4, "4"]], vals: [] }); },
    () => VF({ id: "rel" }, [
      () => ["Le produit de cinq nombres négatifs est négatif.", true, "Les signes « − » se compensent deux à deux ; il en reste un."],
      () => ["Le carré d'un nombre n'est jamais négatif.", true, "Un nombre multiplié par lui-même : deux facteurs de même signe."],
      () => { const a = R.int(3, 9), b = R.int(2, 6); return ["Le résultat de " + M("a - b") + " est toujours plus petit que " + M("a") + ".", false, "Si " + M("b") + " est négatif : " + M(a + " - (-" + b + ") = " + (a + b)) + " > " + a + "."]; },
      () => ["Le quotient de deux nombres négatifs est négatif.", false, M("(-12) : (-4) = 3") + " : même signe, quotient positif."],
      () => ["L'opposé de " + M("-x") + " est toujours positif.", false, "L'opposé de " + M("-x") + " est " + M("x") + ", qui peut être négatif (si " + M("x = -3") + ")."],
    ]),
  ];
  RICH.rel10 = { ids: ["ordgr", "decadd", "decmul", "decdiv", "prio", "reladd", "rel"], label: "Relatifs et décimaux (10e)", ex: EXR, raison: RAISONR, minutes: 45 };

  // ===================== 10e · 2. Aires et périmètres (disque, décomposition, dimension manquante) =====================
  const EXA = [
    () => { let D1, D2, P1, P2, q1, q2; do { D1 = pk([26, 30, 32]); D2 = pk([36, 40, 45]); P1 = pk([14, 15, 16]); P2 = pk([22, 24, 26, 28]); q1 = (P1 / (PI * (D1 / 2) ** 2)) * 100; q2 = (P2 / (PI * (D2 / 2) ** 2)) * 100; } while (Math.abs(q1 - q2) < 0.08);
      const A1 = PI * (D1 / 2) ** 2, A2 = PI * (D2 / 2) ** 2, best = q1 < q2 ? 1 : 2;
      return X({ id: "disque", lv: 1, titre: "Quelle pizza choisir ?",
        q: "Une pizzeria propose une pizza de " + Q(D1, "cm") + " de diamètre à " + chf(P1) + " et une pizza de " + Q(D2, "cm") + " de diamètre à " + chf(P2) + ". Elles ont la même épaisseur et sont livrées en " + pk([20, 30]) + " minutes.",
        parts: [{ label: "Calcule l'aire de chaque pizza (au cm²).", pts: 2 }, { label: "Calcule le prix de 100 cm² pour chaque pizza (au centime).", pts: 2 }, { label: "Quelle pizza est la plus avantageuse ?", pts: 1 }, { label: "Quelle est la longueur du bord de la grande pizza (au cm) ?", pts: 1 }],
        sol: ul([M("\\pi \\cdot " + N(D1 / 2) + "^2 \\approx " + Math.round(A1)) + " cm² et " + M("\\pi \\cdot " + N(D2 / 2) + "^2 \\approx " + Math.round(A2)) + " cm² (rayon = diamètre : 2).", M(P1 + " : " + Math.round(A1) + " \\cdot 100 \\approx " + A(q1, 2)) + " CHF et " + M(P2 + " : " + Math.round(A2) + " \\cdot 100 \\approx " + A(q2, 2)) + " CHF.", "La " + (best === 1 ? "petite" : "grande") + " : 100 cm² y coûtent moins cher. La durée de livraison ne sert à rien.", M("\\pi \\cdot " + D2 + " \\approx " + Math.round(PI * D2)) + " cm."]),
        chk: [[Math.abs(q1 - q2) >= 0.08, "écart"]], vals: [A1, A2, q1, q2, PI * D2] }); },
    () => { const L = pk([80, 85, 90]), r = pk([30, 32, 36]), Pm = 2 * L + 2 * PI * r, Ar = 2 * r * L + PI * r * r, laps = Math.ceil(2000 / Pm);
      const fig = svg(320, 130, "<path d=\"M90 15 L230 15 A50 50 0 0 1 230 115 L90 115 A50 50 0 0 1 90 15 Z\" class=\"f-shape\"/>" + ln(90, 15, 90, 115, "f-line", "stroke-dasharray=\"4 4\"") + ln(230, 15, 230, 115, "f-line", "stroke-dasharray=\"4 4\"") + tx(160, 70, L + " m") + ln(230, 65, 280, 65, "f-accent") + tx(255, 60, r + " m", "f-accent f-txt"), "piste");
      return X({ id: "aire3", lv: 2, titre: "Le stade",
        q: "Le terrain d'un stade est formé d'un rectangle de " + Q(L, "m") + " de long et de deux demi-disques de rayon " + Q(r, "m") + ". La piste qui l'entoure a 8 couloirs.", fig,
        parts: [{ label: "Calcule la longueur du bord du terrain (un tour, au mètre).", pts: 2 }, { label: "Combien de tours complets faut-il faire pour courir au moins 2 km ?", pts: 1 }, { label: "Calcule l'aire du terrain (au m²).", pts: 2 }],
        sol: ul(["Deux longueurs droites et un cercle complet (deux demi-cercles) : " + M("2 \\cdot " + L + " + 2 \\cdot \\pi \\cdot " + r + " \\approx " + Math.round(Pm)) + " m. Le nombre de couloirs ne sert à rien.", M("2000 : " + Math.round(Pm) + " \\approx " + A(2000 / Pm, 2)) + " : " + laps + " tours.", "Rectangle " + M(L + " \\cdot " + 2 * r + " = " + 2 * r * L) + " m² et disque " + M("\\pi \\cdot " + r + "^2 \\approx " + Math.round(PI * r * r)) + " m² : environ " + Math.round(Ar) + " m²."]),
        chk: [[laps * Pm >= 2000 && (laps - 1) * Pm < 2000, "tours"]], vals: [Pm, laps, Ar] }); },
    () => { const b = pk([4, 5, 6]), h = pk([6.5, 7, 8.4]), At = r6((b * h) / 2), B = pk([12, 14, 16]), b2 = pk([7, 8, 9]), h2 = pk([5, 6, 4.5]), Atr = r6(((B + b2) * h2) / 2), [L, Ar] = pk([[12.5, 200], [15, 180], [16, 240], [12.5, 150], [16, 200]]), l = r6(Ar / L);
      return X({ id: "grandmanq", lv: 2, titre: "Retrouver la dimension qui manque",
        q: "Dans chaque situation, on connaît l'aire et on cherche une longueur.",
        parts: [{ label: "La voile triangulaire d'un dériveur a une aire de " + Q(At, "m^2") + " et une base de " + Q(b, "m") + ". Quelle est sa hauteur ?", pts: 2 }, { label: "Une plate-bande en forme de trapèze a une aire de " + Q(Atr, "m^2") + " ; ses bases mesurent " + Q(B, "m") + " et " + Q(b2, "m") + ". Quelle est sa hauteur ?", pts: 2 }, { label: "Un terrain rectangulaire de " + Q(Ar, "m^2") + " a une longueur de " + Q(L, "m") + ". Quelle est sa largeur ? Et son périmètre ?", pts: 2 }],
        sol: ul([M("A = \\frac{b \\cdot h}{2}") + ", donc " + M("h = \\frac{2A}{b} = \\frac{2 \\cdot " + N(At) + "}{" + b + "} = " + N(h)) + " m.", M("A = \\frac{(B + b) \\cdot h}{2}") + ", donc " + M("h = \\frac{2 \\cdot " + N(Atr) + "}{" + B + " + " + b2 + "} = " + N(h2)) + " m.", M("l = " + Ar + " : " + N(L) + " = " + N(l)) + " m ; " + M("P = 2 \\cdot (" + N(L) + " + " + N(l) + ") = " + N(r6(2 * (L + l)))) + " m."]),
        chk: [[Math.abs((2 * At) / b - h) < 1e-9 && Math.abs((2 * Atr) / (B + b2) - h2) < 1e-9, "inverses"], [Math.abs(l * 100 - Math.round(l * 100)) < 1e-6, "largeur au cm"]], vals: [h, h2, l, 2 * (L + l)] }); },
    () => { const r = pk([4, 5, 6]), Lc = pk([40, 50, 60]), A1 = PI * r * r, rc = Lc / (2 * PI), Ac = PI * rc * rc;
      const fig = svg(320, 170, "<path d=\"M160 85 L160 25 A60 60 0 1 0 220 85 Z\" class=\"f-fill2\"/>" + "<rect x=\"160\" y=\"25\" width=\"110\" height=\"60\" class=\"f-shape2\"/>" + tx(215, 60, "grange") + "<circle cx=\"160\" cy=\"85\" r=\"3.5\" class=\"f-dot\"/>" + ln(160, 85, 118, 127, "f-accent") + tx(128, 98, r + " m", "f-accent f-txt", "end"), "chien attaché");
      return X({ id: "disque", lv: 3, titre: "Le chien attaché",
        q: "Un chien est attaché par une laisse de " + Q(r, "m") + ".", fig,
        parts: [{ label: "Il est attaché à un piquet au milieu d'un pré. Quelle aire peut-il atteindre (au m²) ?", pts: 1 }, { label: "Il est attaché au pied d'un long mur droit. Quelle aire peut-il atteindre ?", pts: 1 }, { label: "Il est attaché à l'angle extérieur d'une grange (voir figure ; les côtés de la grange sont plus longs que la laisse). Quelle aire peut-il atteindre ?", pts: 2 }, { label: "Avec " + Q(Lc, "m") + " de grillage, on fait un enclos circulaire. Quel est son rayon (au cm) ? Son aire (au m²) ?", pts: 2 }],
        sol: ul(["Un disque : " + M("\\pi \\cdot " + r + "^2 \\approx " + A(A1, 1)) + " m², soit environ " + Math.round(A1) + " m².", "Un demi-disque : " + M("\\frac{\\pi \\cdot " + r + "^2}{2} \\approx " + Math.round(A1 / 2)) + " m².", "Trois quarts de disque (la grange occupe un quart) : " + M("\\frac{3}{4} \\cdot \\pi \\cdot " + r + "^2 \\approx " + Math.round((3 * A1) / 4)) + " m².", M("2 \\pi r = " + Lc) + ", donc " + M("r = " + Lc + " : (2\\pi) \\approx " + A(rc, 2)) + " m ; aire " + M("\\approx " + Math.round(Ac)) + " m²."]),
        chk: [[Math.abs(2 * PI * rc - Lc) < 1e-9, "rayon"]], vals: [A1, A1 / 2, (3 * A1) / 4, rc, Ac] }); },
  ];
  const RAISONA = [
    () => VF({ id: "disque" }, [
      () => { const r = pk([2, 3, 5]); return ["Si on double le rayon d'un disque, son aire double.", false, "Elle est multipliée par 4 : " + M("\\pi \\cdot " + 2 * r + "^2 = 4 \\cdot \\pi \\cdot " + r + "^2") + "."]; },
      () => ["Si on double le rayon d'un cercle, sa longueur double.", true, M("2\\pi \\cdot (2r) = 2 \\cdot (2\\pi r)") + "."],
      () => { const r = pk([3, 4, 5]); return ["Le périmètre d'un demi-disque de rayon " + r + " cm est " + M("\\pi \\cdot " + r) + " cm.", false, "Il faut ajouter le diamètre : " + M("\\pi \\cdot " + r + " + " + 2 * r + " \\approx " + A(PI * r + 2 * r, 2)) + " cm."]; },
      () => ["Un carré de côté 2 cm a une aire plus grande que le disque de rayon 1 cm qu'il contient.", true, "4 cm² contre " + M("\\pi \\approx 3{,}14") + " cm²."],
      () => ["La longueur d'un cercle est un peu plus de 3 fois son diamètre.", true, M("L = \\pi \\cdot d") + " et " + M("\\pi \\approx 3{,}14") + "."],
    ]),
    () => { const d = pk([10, 12, 14, 20]), w = who(), wr = PI * d * d, rt = PI * (d / 2) ** 2;
      return X({ id: "disque", lv: 2, titre: "Trouve l'erreur",
        q: "Une table ronde a un diamètre de " + Q(d, "dm") + ". " + w.n + " calcule son aire : " + M("\\pi \\cdot " + d + "^2 \\approx " + A(wr, 1)) + " dm².",
        parts: [{ label: "Quelle est son erreur ? Comment pouvait-" + w.il + " voir que le résultat est trop grand ?", pts: 2 }, { label: "Calcule l'aire correcte.", pts: 1 }],
        sol: ul([w.Il + " a utilisé le diamètre au lieu du rayon. Contrôle : la table tient dans un carré de " + d + " dm de côté, d'aire " + d * d + " dm² ; son aire ne peut pas dépasser " + d * d + " dm².", M("r = " + d / 2) + " dm et " + M("\\pi \\cdot " + d / 2 + "^2 \\approx " + A(rt, 1)) + " dm² (4 fois moins)."]),
        chk: [[Math.abs(wr / rt - 4) < 1e-9, "facteur 4"]], vals: [rt] }); },
  ];
  RICH.aire10 = { ids: ["aire3", "disque", "grandmanq"], label: "Aires et périmètres (10e)", ex: EXA, raison: RAISONA, minutes: 45 };

  // ===================== 10e · 3. Écriture fractionnaire =====================
  const EXF = [
    () => { const [f1, f2] = pk([[[3, 5], [2, 3]], [[3, 4], [2, 5]], [[2, 3], [3, 8]], [[5, 6], [3, 5]], [[4, 7], [3, 4]]]), base = f1[1] * f2[1], k = Math.ceil(240 / base) + R.int(0, 2), Nn = base * k;
      const ff = fmul(f1, f2), nf = (Nn * ff[0]) / ff[1], fn = fmul(f1, fsub([1, 1], f2)), nn = (Nn * fn[0]) / fn[1];
      return X({ id: "fracmul", lv: 1, titre: "Le sport au collège",
        q: "Un collège compte " + N(Nn) + " élèves. " + M(ft(f1)) + " des élèves pratiquent un sport en club, et parmi eux, " + M(ft(f2)) + " jouent au football. Les autres sportifs font de la natation.",
        parts: [{ label: "Quelle fraction des élèves du collège joue au football ?", pts: 2 }, { label: "Combien d'élèves cela représente-t-il ?", pts: 1 }, { label: "Quelle fraction des élèves du collège fait de la natation ? Combien d'élèves ?", pts: 2 }],
        sol: ul([M(ft(f2) + " \\text{ de } " + ft(f1) + " = " + ft(f2) + " \\cdot " + ft(f1) + " = " + ft(ff)) + ".", M(ft(ff) + " \\cdot " + N(Nn) + " = " + N(nf)) + " élèves.", M(ft(fsub([1, 1], f2)) + " \\cdot " + ft(f1) + " = " + ft(fn)) + ", soit " + M(ft(fn) + " \\cdot " + N(Nn) + " = " + N(nn)) + " élèves."]),
        chk: [[Number.isInteger(nf) && Number.isInteger(nn), "entiers"], [Math.abs(nf + nn - (Nn * f1[0]) / f1[1]) < 1e-9, "somme"]], vals: [fv(ff), nf, fv(fn), nn] }); },
    () => { const [F3, Ar0] = pk([[[[1, 4], [1, 3], [1, 8]], 24], [[[2, 5], [1, 4], [1, 10]], 20], [[[1, 6], [3, 8], [1, 4]], 24], [[[2, 9], [1, 3], [1, 12]], 36], [[[3, 10], [1, 4], [1, 6]], 60]]), k = Math.ceil(300 / Ar0) + R.int(0, 6), Ar = Ar0 * k, S = F3.reduce((s, f) => fadd(s, f), [0, 1]), po = fsub([1, 1], S), D = F3.reduce((m, f) => lcm(m, f[1]), 1);
      const parts = ["potager", "fleurs", "gazon"], ar = F3.map((f) => (Ar * f[0]) / f[1]), ap = (Ar * po[0]) / po[1];
      return X({ id: "fracadd", lv: 2, titre: "Le jardin partagé",
        q: "Un jardin partagé de " + Q(Ar, "m^2") + " est divisé ainsi : " + parts.map((p, i) => M(ft(F3[i])) + " pour le " + p).join(", ") + " ; le reste est une mare.",
        parts: [{ label: "Quel dénominateur commun (le plus petit) peut-on utiliser ? Justifie (PPMC).", pts: 1 }, { label: "Quelle fraction du jardin occupe la mare ?", pts: 2 }, { label: "Calcule l'aire de chaque partie.", pts: 2 }, { label: "Les fleurs et le gazon ensemble occupent-ils plus que le potager et la mare ensemble ?", pts: 1 }],
        sol: ul([M("\\text{PPMC}(" + F3.map((f) => f[1]).join(" ; ") + ") = " + D) + ".", M("1 - \\left(" + F3.map((f) => "\\frac{" + f[0] * (D / f[1]) + "}{" + D + "}").join(" + ") + "\\right) = " + ft(po)) + ".", parts.map((p, i) => p + " " + N(ar[i])).join(" m², ") + " m², mare " + N(ap) + " m² (total " + N(Ar) + " m²).", M(N(ar[1] + ar[2]) + (ar[1] + ar[2] > ar[0] + ap ? " > " : " < ") + N(ar[0] + ap)) + " : " + (ar[1] + ar[2] > ar[0] + ap ? "oui." : "non.")]),
        chk: [[ar.every(Number.isInteger) && Number.isInteger(ap) && ar.reduce((a, b) => a + b, 0) + ap === Ar, "aires"], [ar[1] + ar[2] !== ar[0] + ap, "comparaison"]], vals: [D, fv(po), ...ar, ap] }); },
    () => { const items = sh([["veste", pk([120, 150, 90])], ["baskets", pk([80, 110, 140])], ["sac", pk([60, 45, 75])], ["montre", pk([200, 160, 180])]]), pc = sh([10, 15, 20, 25, 30, 40]).slice(0, 4), so = items.map((x, i) => r6(x[1] * (1 - pc[i] / 100))), eco = r6(items.reduce((s, x, i) => s + x[1] - so[i], 0));
      const rows = items.map((x, i) => [x[0], i === 3 ? "?" : chf(x[1]), i === 2 ? "?" : pc[i] + " %", i < 2 ? "?" : chf(so[i])]);
      return X({ id: "pct", lv: 2, titre: "Les soldes",
        q: "Un magasin affiche ses soldes. Complète le tableau." + tab(["article", "prix initial", "rabais", "prix soldé"], rows),
        parts: [{ label: "Calcule le prix soldé de la " + items[0][0] + " et des " + items[1][0] + ".", pts: 2 }, { label: "Calcule le rabais (en %) sur le " + items[2][0] + ".", pts: 1 }, { label: "Retrouve le prix initial de la " + items[3][0] + ".", pts: 2 }, { label: "Combien économise-t-on en achetant les quatre articles ?", pts: 1 }],
        sol: ul([M(items[0][1] + " \\cdot " + N(1 - pc[0] / 100) + " = " + N(so[0])) + " CHF ; " + M(items[1][1] + " \\cdot " + N(1 - pc[1] / 100) + " = " + N(so[1])) + " CHF.", "Rabais : " + M(items[2][1] + " - " + N(so[2]) + " = " + N(r6(items[2][1] - so[2]))) + " CHF ; " + M(N(r6(items[2][1] - so[2])) + " : " + items[2][1] + " = " + N(pc[2] / 100) + " = " + pc[2] + "\\,\\%") + ".", "Le prix soldé vaut " + M(N(1 - pc[3] / 100)) + " du prix initial : " + M(N(so[3]) + " : " + N(1 - pc[3] / 100) + " = " + items[3][1]) + " CHF (et non " + N(so[3]) + " + " + pc[3] + " %).", "Économie : " + M(N(eco)) + " CHF."]),
        chk: [[Math.abs(so[3] / (1 - pc[3] / 100) - items[3][1]) < 1e-9, "inverse"]], vals: [...so, pc[2], items[3][1], eco] }); },
    () => { let v, g, q; do { v = pk([[3, 2], [9, 4], [5, 2], [7, 4], [4, 3]]); g = pk([[1, 5], [3, 10], [1, 4], [3, 8], [2, 5], [1, 6]]); q = fdiv(v, g); } while (q[1] === 1 || fv(q) < 3 || fv(q) > 12);
      const n = Math.floor(fv(q)), rem = fsub(v, fmul([n, 1], g)), part = fsub(q, [n, 1]), nb = Math.ceil((25 * fv(g)) / fv(v) - 1e-9), w = who();
      return X({ id: "fracops", lv: 3, titre: "Le sirop",
        q: "Pour la fête de la classe, " + w.n + " prépare des bouteilles de " + M(ft(v)) + " L de sirop dilué. Un verre contient " + M(ft(g)) + " L.",
        parts: [{ label: "Combien de verres peut-on remplir avec une bouteille ? Écris le calcul avec des fractions.", pts: 2 }, { label: "Combien de verres <b>pleins</b> ? Quelle quantité reste-t-il dans la bouteille (fraction de litre) ?", pts: 2 }, { label: "Combien de bouteilles faut-il pour servir 25 verres ?", pts: 1 }],
        sol: ul([M(ft(v) + " : " + ft(g) + " = " + ft(v) + " \\cdot \\frac{" + g[1] + "}{" + g[0] + "} = " + ft(q)) + " " + M("\\approx " + A(fv(q), 2)) + " verres.", n + " verres pleins ; il reste " + M(ft(v) + " - " + n + " \\cdot " + ft(g) + " = " + ft(rem)) + " L (soit " + M(ft(part)) + " de verre).", M("25 \\cdot " + ft(g) + " = " + ft(fmul([25, 1], g))) + " L ; " + M(ft(fmul([25, 1], g)) + " : " + ft(v) + " \\approx " + A((25 * fv(g)) / fv(v), 2)) + " : " + nb + " bouteilles."]),
        chk: [[Math.abs(fv(rem) - fv(part) * fv(g)) < 1e-9 && fv(rem) > 0, "reste"], [nb * fv(v) >= 25 * fv(g), "bouteilles"]], vals: [fv(q), n, fv(rem), nb] }); },
  ];
  const RAISONF = [
    () => { const [a, b] = pk([[2, 3], [3, 4], [5, 6], [3, 5]]), [c, d] = pk([[4, 5], [2, 7], [3, 8]]), w = who(), wr = fr(a * c, b * d), rt = fdiv([a, b], [c, d]);
      return X({ id: "fracmul", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " écrit : " + M("\\frac{" + a + "}{" + b + "} : \\frac{" + c + "}{" + d + "} = \\frac{" + a * c + "}{" + b * d + "}") + ".",
        parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "Calcule correctement et simplifie.", pts: 1 }, { label: "Contrôle : le résultat doit-il être plus grand ou plus petit que " + M("\\frac{" + a + "}{" + b + "}") + " ? Pourquoi ?", pts: 1 }],
        sol: ul([w.Il + " a multiplié au lieu de diviser. Diviser par une fraction, c'est multiplier par son inverse.", M("\\frac{" + a + "}{" + b + "} \\cdot \\frac{" + d + "}{" + c + "} = \\frac{" + a * d + "}{" + b * c + "} = " + ft(rt)) + ".", "Plus grand : on divise par un nombre plus petit que 1 (dans " + M("\\frac{" + a + "}{" + b + "}") + ", il y a plus d'une fois " + M("\\frac{" + c + "}{" + d + "}") + ")."]),
        chk: [[fv(rt) > a / b && fv(wr) !== fv(rt), "contrôle"]], vals: [fv(rt)] }); },
    () => VF({ id: "pct" }, [
      () => { const p = pk([100, 200, 80]); return ["Une hausse de 10 % suivie d'une baisse de 10 % ramène au prix de départ.", false, p + " → " + N(p * 1.1) + " → " + N(r6(p * 1.1 * 0.9)) + " : on obtient 99 % du prix de départ."]; },
      () => { const [a, b] = pk([[25, 80], [20, 50], [40, 75]]); return [a + " % de " + b + " est égal à " + b + " % de " + a + ".", true, M("\\frac{" + a + "}{100} \\cdot " + b + " = \\frac{" + b + "}{100} \\cdot " + a + " = " + N((a * b) / 100)) + "."]; },
      () => ["Diviser par " + M("\\frac{1}{2}") + " revient à multiplier par 2.", true, "L'inverse de " + M("\\frac{1}{2}") + " est 2."],
      () => [M("\\frac{3}{4}") + " de " + M("\\frac{2}{3}") + " vaut " + M("\\frac{1}{2}") + ".", true, M("\\frac{3}{4} \\cdot \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}") + "."],
      () => [M("\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}") + ".", false, M("\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}") + "."],
      () => { const n = pk([84, 90, 126]); return ["Le PGDC de deux nombres divise toujours leur PPMC.", true, "Ex. : " + M("\\text{PGDC}(12 ; " + n + ") = " + g2(12, n)) + " et " + M("\\text{PPMC} = " + lcm(12, n) + " = " + g2(12, n) + " \\cdot " + lcm(12, n) / g2(12, n)) + "."]; },
    ]),
  ];
  RICH.frac10 = { ids: ["premiers", "arith", "fracrep", "fracsimp", "fracconv", "fracper", "fractout", "fracadd", "fracmul", "fracops", "pct"], label: "Écriture fractionnaire (10e)", ex: EXF, raison: RAISONF, minutes: 45 };

  // ===================== 10e · 4. 3D : espace, grandeurs et mesures =====================
  const EXS = [
    () => { const r = pk([3.5, 4, 3.8]), h = pk([11, 12, 10.5]), V = PI * r * r * h, Al = 2 * PI * r * h, nb = Math.ceil(2000 / V - 1e-9);
      return X({ id: "vol", lv: 1, titre: "La boîte de conserve",
        q: "Une boîte de conserve est un cylindre de " + Q(r, "cm") + " de rayon et " + Q(h, "cm") + " de haut. Elle coûte " + chf(pk([2.4, 3.1, 1.95])) + ".", fig: FIG.cylinder(fmt(r) + " cm", fmt(h) + " cm"),
        parts: [{ label: "Calcule son volume en cm³ (au cm³).", pts: 1 }, { label: "Combien de centilitres contient-elle ?", pts: 1 }, { label: "Calcule l'aire de l'étiquette qui fait tout le tour (aire latérale).", pts: 2 }, { label: "Combien de boîtes faut-il pour avoir au moins 2 L de soupe ?", pts: 1 }],
        sol: ul([M("V = \\pi \\cdot " + N(r) + "^2 \\cdot " + N(h) + " \\approx " + Math.round(V)) + " cm³. Le prix ne sert à rien.", M(Math.round(V) + u("cm^3") + " = " + Math.round(V) + u("mL") + " \\approx " + A(V / 10, 1) + u("cL")) + ".", "L'étiquette déroulée est un rectangle de " + M("2\\pi \\cdot " + N(r)) + " cm sur " + N(h) + " cm : " + M("\\approx " + A(Al, 1)) + " cm².", M("2000 : " + Math.round(V) + " \\approx " + A(2000 / V, 2)) + " : " + nb + " boîtes."]),
        chk: [[nb * V >= 2000, "boîtes"]], vals: [V, V / 10, Al, nb] }); },
    () => { const b = pk([1.6, 1.8, 2]), ht = pk([1.2, 1.5]), L = pk([2.2, 2.4]), s = Math.round(Math.sqrt((b / 2) ** 2 + ht * ht) * 100) / 100, V = r6(((b * ht) / 2) * L), toile = r6(b * ht + 2 * s * L), sol = r6(b * L);
      const fig = svg(300, 160, pg([[40, 140], [140, 140], [90, 40]], "f-shape") + pg([[140, 140], [250, 110], [200, 10], [90, 40]], "f-shape2") + ln(90, 40, 90, 140, "f-accent", "stroke-dasharray=\"5 4\"") + tx(90, 156, fmt(b) + " m") + tx(84, 95, fmt(ht) + " m", "f-accent f-txt", "end") + tx(205, 138, fmt(L) + " m") + tx(160, 70, fmt(s) + " m", "f-txt", "middle", 12), "tente");
      return X({ id: "airelat", lv: 2, titre: "La tente",
        q: "Une tente a la forme d'un prisme droit couché. Sa face avant est un triangle isocèle de base " + Q(b, "m") + " et de hauteur " + Q(ht, "m") + " ; chaque pan du toit mesure " + Q(s, "m") + " de large ; la tente a " + Q(L, "m") + " de long.", fig,
        parts: [{ label: "Calcule le volume d'air dans la tente.", pts: 2 }, { label: "Calcule l'aire de toile (deux triangles et deux pans, sans le sol).", pts: 2 }, { label: "Le tapis de sol est un rectangle. Quelle est son aire ?", pts: 1 }],
        sol: ul(["Base du prisme : " + M("\\frac{" + N(b) + " \\cdot " + N(ht) + "}{2} = " + N((b * ht) / 2)) + " m² ; " + M("V = " + N((b * ht) / 2) + " \\cdot " + N(L) + " = " + N(V)) + " m³.", "Triangles : " + M("2 \\cdot " + N((b * ht) / 2) + " = " + N(b * ht)) + " m² ; pans : " + M("2 \\cdot " + N(s) + " \\cdot " + N(L) + " = " + N(r6(2 * s * L))) + " m² ; total " + Q(toile, "m^2") + ".", M(N(b) + " \\cdot " + N(L) + " = " + N(sol)) + " m²."]),
        chk: [[s > ht && s > b / 2, "pan"]], vals: [V, toile, sol] }); },
    () => { const w = pk([8, 10, 12]), L1 = pk([10, 12, 15]), h1 = pk([0.8, 1, 1.2]), L2 = pk([10, 13, 15]), h2 = pk([1.8, 2, 2.2]), q = pk([300, 400, 500]), V = r6(w * (L1 * h1 + L2 * h2)), Lt = V * 1000, min = Lt / q;
      const s = 220 / (L1 + L2), y0 = 25, fig = svg(320, 120, pg([[30, y0], [30 + (L1 + L2) * s, y0], [30 + (L1 + L2) * s, y0 + h2 * 35], [30 + L1 * s, y0 + h2 * 35], [30 + L1 * s, y0 + h1 * 35], [30, y0 + h1 * 35]]) + tx(30 + (L1 * s) / 2, y0 - 6, L1 + " m") + tx(30 + L1 * s + (L2 * s) / 2, y0 - 6, L2 + " m") + tx(26, y0 + (h1 * 35) / 2 + 4, fmt(h1) + " m", "f-txt", "end") + tx(34 + (L1 + L2) * s, y0 + (h2 * 35) / 2 + 4, fmt(h2) + " m", "f-txt", "start"), "piscine vue de côté");
      return X({ id: "voldecomp", lv: 2, titre: "La piscine à deux profondeurs",
        q: "Voici une piscine vue de côté : une partie peu profonde et une partie profonde. Elle mesure " + Q(w, "m") + " de large.", fig,
        parts: [{ label: "Calcule le volume de la piscine en m³ (décompose-la en deux pavés).", pts: 2 }, { label: "Combien de litres d'eau faut-il pour la remplir ?", pts: 1 }, { label: "Une pompe débite " + q + " L par minute. Combien de temps faut-il pour la remplir (en h et min) ?", pts: 2 }],
        sol: ul([M(L1 + " \\cdot " + w + " \\cdot " + N(h1) + " + " + L2 + " \\cdot " + w + " \\cdot " + N(h2) + " = " + N(r6(L1 * w * h1)) + " + " + N(r6(L2 * w * h2)) + " = " + N(V)) + " m³.", M(N(V) + u("m^3") + " = " + N(Lt) + u("L")) + " (1 m³ = 1000 L).", M(N(Lt) + " : " + q + " = " + N(min)) + " min, soit environ " + dur(Math.round(min)) + "."]),
        chk: [[Math.abs(V - w * L1 * h1 - w * L2 * h2) < 1e-9, "volume"]], vals: [V, Lt, min] }); },
    () => { const C = pk([3000, 5000, 8000]), d = pk([1.6, 2, 2.4]), Ab = PI * (d / 2) ** 2, h = C / 1000 / Ab, x = Math.round(h * pk([0.4, 0.6, 0.75]) * 10) / 10, Vx = Ab * x * 1000, gl = (C * 10) / 2.5;
      return X({ id: "vol", lv: 3, titre: "La citerne",
        q: "Une citerne d'eau de pluie est un cylindre de " + Q(d, "m") + " de diamètre. Elle peut contenir " + Q(C, "L") + ".",
        parts: [{ label: "Calcule l'aire de la base de la citerne (au centième de m²).", pts: 1 }, { label: "Calcule sa hauteur (au cm).", pts: 2 }, { label: "L'eau atteint " + Q(x, "m") + " de haut. Combien de litres contient-elle (au litre) ?", pts: 1 }, { label: "Combien de verres de " + Q(2.5, "dL") + " pourrait-on remplir avec la citerne pleine ?", pts: 1 }],
        sol: ul([M("\\pi \\cdot " + N(d / 2) + "^2 \\approx " + A(Ab, 2)) + " m².", M(C + u("L") + " = " + N(C / 1000) + u("m^3")) + " ; " + M("h = V : A_{\\text{base}} = " + N(C / 1000) + " : " + A(Ab, 4) + " \\approx " + A(h, 2)) + " m.", M(A(Ab, 4) + " \\cdot " + N(x) + " \\approx " + A(Ab * x, 4)) + " m³, soit environ " + N(Math.round(Vx)) + " L.", M(N(C) + u("L") + " = " + N(C * 10) + u("dL")) + " ; " + M(N(C * 10) + " : 2{,}5 = " + N(gl)) + " verres."]),
        chk: [[Math.abs(Ab * h * 1000 - C) < 1e-6, "hauteur"], [x < h, "niveau"]], vals: [Ab, h, Vx, gl] }); },
  ];
  const RAISONS = [
    () => { const pool = [
      () => { const a = pk([2, 3, 0.5]); return [N(a) + " m³ = " + N(a * 100) + " L", false, N(a) + " m³ = " + N(a * 1000) + " L (1 m³ = 1000 dm³ = 1000 L)"]; },
      () => { const a = pk([4, 7, 12]); return [a + " dm³ = " + a + " L", true, "1 L = 1 dm³"]; },
      () => { const a = pk([250, 330, 750]); return [a + " cm³ = " + N(a / 100) + " L", false, a + " cm³ = " + N(a / 1000) + " L (1 L = 1000 cm³)"]; },
      () => { const a = pk([1.5, 2.4, 3]); return [N(a) + " m³ = " + N(a * 1000) + " dm³", true, "1 m³ = 10 dm · 10 dm · 10 dm = 1000 dm³"]; },
      () => { const a = pk([3.5, 2.2]); return [N(a) + " dL = " + N(a * 100) + " cm³", true, "1 dL = 0,1 L = 100 cm³"]; },
      () => { const a = pk([2, 5]); return [a + " m³ = " + a * 100 + " dm³", false, a + " m³ = " + a * 1000 + " dm³ (trois dimensions : 10 · 10 · 10)"]; },
    ];
      const L = sh(pool).slice(0, 4).map((f) => f()), w = who();
      return X({ id: "uvol", lv: 2, titre: "Trouve les erreurs",
        q: w.n + " a fait ces conversions." + tab(["", "conversion"], L.map((x, i) => [String.fromCharCode(65 + i), x[0]])),
        parts: [{ label: "Lesquelles sont fausses ?", pts: 2 }, { label: "Corrige-les en expliquant.", pts: 2 }],
        sol: ul([L.some((x) => !x[1]) ? L.map((x, i) => (x[1] ? "" : String.fromCharCode(65 + i))).filter(Boolean).join(", ") + "." : "Aucune.", L.map((x, i) => String.fromCharCode(65 + i) + " : " + (x[1] ? "juste, " : "faux, ") + x[2]).join(" ; ") + "."]),
        chk: [[L.length === 4, "4"]], vals: [] }); },
    () => VF({ id: "solides" }, [
      () => { const n = pk([5, 6, 8]); return ["Un prisme dont la base a " + n + " côtés a " + (n + 2) + " faces.", true, n + " faces latérales + 2 bases."]; },
      () => ["Si on double le rayon d'un cylindre, son volume double.", false, "Il est multiplié par 4 (le rayon est au carré dans " + M("\\pi r^2 h") + ")."],
      () => ["Si on double la hauteur d'un cylindre, son volume double.", true, M("\\pi r^2 \\cdot (2h) = 2 \\cdot \\pi r^2 h") + "."],
      () => ["Un cylindre est un prisme.", false, "Sa base est un disque, pas un polygone (mais on calcule son volume de la même façon : aire de la base · hauteur)."],
      () => ["Deux solides de même volume ont la même aire totale.", false, "Un cube de 2 cm (24 cm²) et un pavé 1 × 1 × 8 (34 cm²) ont tous deux 8 cm³."],
    ]),
  ];
  RICH.sol10 = { ids: ["uvol", "solides", "vol", "airelat", "voldecomp"], label: "Solides et volumes (10e)", ex: EXS, raison: RAISONS, minutes: 45 };

  // ===================== 10e · 10. Proportionnalité (échelles, pourcentages, pentes) =====================
  const sc = (n) => "1\\,:\\," + N(n);
  const EXP = [
    () => { const E = pk([25000, 50000]), dm = pk([8.4, 6.2, 11.6]), real = r6((dm * E) / 100000), rk = pk([3.5, 4.5, 2.8]), mc = r6((rk * 100000) / E), [c2, k2] = pk([[4, 1], [2, 1], [3, 1.5]]), E2 = (k2 * 100000) / c2, t = Math.round((real / 4) * 60);
      return X({ id: "echelle", lv: 1, titre: "La carte de randonnée",
        q: "Sur une carte à l'échelle " + M(sc(E)) + ", on prépare une randonnée. On marche à environ " + Q(4, "km/h") + ".",
        parts: [{ label: "Que signifie cette échelle ?", pts: 1 }, { label: "Sur la carte, le chemin jusqu'au lac mesure " + Q(dm, "cm") + ". Quelle est la distance réelle en km ? Combien de temps faut-il pour la parcourir ?", pts: 2 }, { label: "Le refuge est à " + Q(rk, "km") + " à vol d'oiseau. À quelle distance est-il sur la carte ?", pts: 1 }, { label: "Sur une autre carte, " + Q(c2, "cm") + " représentent " + Q(k2, "km") + ". Quelle est son échelle ?", pts: 1 }],
        sol: ul(["1 cm sur la carte représente " + N(E) + " cm = " + N(E / 100000) + " km en réalité.", M(N(dm) + " \\cdot " + N(E) + " = " + N(dm * E)) + " cm = " + Q(real, "km") + " ; " + M(N(real) + " : 4 = " + N(real / 4)) + " h, environ " + dur(t) + ".", M(N(rk * 100000) + " : " + N(E) + " = " + N(mc)) + " cm.", M(N(k2) + u("km") + " = " + N(k2 * 100000) + u("cm")) + " ; " + M(N(k2 * 100000) + " : " + c2 + " = " + N(E2)) + " : échelle " + M(sc(E2)) + "."]),
        chk: [[Math.abs((mc * E) / 100000 - rk) < 1e-9, "inverse"]], vals: [real, mc, E2, t] }); },
    () => { const P = pk([240, 380, 520]), tva = 8.1, ttc = Math.round(P * 1.081 * 100) / 100, s = pk([15, 20, 30]), sold = r6(P * (1 - s / 100)), Qn = pk([150, 200, 250]), orig = Qn / 1.25, dbl = r6(P * 1.2 * 0.8);
      return X({ id: "pctvar", lv: 2, titre: "Prix et pourcentages",
        q: "Un vélo coûte " + chf(P) + " hors taxes. La TVA est de " + M("8{,}1\\,\\%") + ".",
        parts: [{ label: "Quel est son prix TVA comprise ? Par quel nombre multiplie-t-on ?", pts: 2 }, { label: "En solde, le prix hors taxes baisse de " + s + " %. Quel est le nouveau prix hors taxes ?", pts: 1 }, { label: "Après une hausse de 25 %, un casque coûte " + Qn + " CHF. Quel était son prix avant la hausse ?", pts: 2 }, { label: "Le prix hors taxes du vélo augmente de 20 %, puis baisse de 20 %. Revient-il à " + P + " CHF ? Calcule.", pts: 1 }],
        sol: ul([M(P + " \\cdot 1{,}081 \\approx " + Nk(ttc, 2)) + " CHF (100 % + 8,1 % = 108,1 %).", M(P + " \\cdot " + N(1 - s / 100) + " = " + N(sold)) + " CHF.", M(Qn + " : 1{,}25 = " + N(orig)) + " CHF (et non " + Qn + " − 25 %, car les 25 % portaient sur l'ancien prix).", M(P + " \\cdot 1{,}2 \\cdot 0{,}8 = " + P + " \\cdot 0{,}96 = " + N(dbl)) + " CHF : non, il a baissé de 4 %."]),
        chk: [[Math.abs(orig * 1.25 - Qn) < 1e-9, "inverse"], [dbl < P, "baisse"]], vals: [ttc, sold, orig, dbl] }); },
    () => { const p = pk([8, 10, 12, 15]), hz = pk([600, 800, 1200]), up = (p * hz) / 100, rp = 6, cm = pk([36, 45, 54]), lr = cm / rp; let A, B, pa, pb; do { A = [pk([84, 96, 105]), pk([1200, 1400, 1500])]; B = [pk([60, 72, 64]), pk([750, 800, 900])]; pa = (A[0] / A[1]) * 100; pb = (B[0] / B[1]) * 100; } while (Math.abs(pa - pb) < 0.5);
      return X({ id: "pente", lv: 2, titre: "Routes et rampes",
        q: "Une pente de " + M("p\\,\\%") + " signifie qu'on monte de " + M("p") + " m pour 100 m parcourus à l'horizontale.",
        parts: [{ label: "Un panneau indique une pente de " + p + " %. De combien de mètres monte-t-on sur " + hz + " m à l'horizontale ?", pts: 1 }, { label: "Une rampe pour fauteuil roulant ne doit pas dépasser 6 %. Quelle longueur horizontale faut-il pour monter une marche de " + cm + " cm ?", pts: 2 }, { label: "La route A monte de " + A[0] + " m sur " + N(A[1]) + " m à l'horizontale ; la route B monte de " + B[0] + " m sur " + B[1] + " m. Laquelle est la plus raide ?", pts: 2 }],
        sol: ul([M(p + "\\,\\% \\cdot " + hz + " = " + N(up)) + " m.", "6 cm pour 100 cm : " + M(cm + " : 6 \\cdot 100 = " + N((cm / 6) * 100)) + " cm = " + Q((cm / 6), "m") + ".", "A : " + M(A[0] + " : " + N(A[1]) + " = " + N(r6(A[0] / A[1]))) + " = " + N(r6(pa)) + " % ; B : " + M(B[0] + " : " + B[1] + " = " + N(r6(B[0] / B[1]))) + " = " + N(r6(pb)) + " %. La route " + (pa > pb ? "A" : "B") + " est la plus raide."]),
        chk: [[Math.abs(pa - pb) > 0.1, "comparaison"], [lr > 0, "rampe"]], vals: [up, cm / 6, pa, pb] }); },
    () => { const E = pk([50, 100]), a = pk([9, 8, 7.5]), b = pk([7, 6, 5.5]), ra = r6((a * E) / 100), rb = r6((b * E) / 100), Ar = r6(ra * rb), Ap = r6(a * b), k2 = E * E, A2 = pk([20, 24, 18]), ap2 = (A2 * 10000) / k2;
      return X({ id: "echelle", lv: 3, titre: "Le plan de l'appartement",
        q: "Sur un plan à l'échelle " + M(sc(E)) + ", une chambre est un rectangle de " + Q(a, "cm") + " sur " + Q(b, "cm") + ".",
        parts: [{ label: "Quelles sont les dimensions réelles de la chambre, en m ?", pts: 2 }, { label: "Calcule l'aire de la chambre sur le plan (en cm²) et en réalité (en m², puis en cm²).", pts: 2 }, { label: "Par combien les aires sont-elles multipliées ? Compare avec l'échelle.", pts: 1 }, { label: "Le salon mesure " + A2 + " m² en réalité. Quelle aire occupe-t-il sur le plan ?", pts: 1 }],
        sol: ul([M(N(a) + " \\cdot " + E + " = " + N(a * E)) + " cm = " + N(ra) + " m et " + M(N(b) + " \\cdot " + E + " = " + N(b * E)) + " cm = " + N(rb) + " m.", "Plan : " + M(N(a) + " \\cdot " + N(b) + " = " + N(Ap)) + " cm² ; réalité : " + M(N(ra) + " \\cdot " + N(rb) + " = " + N(Ar)) + " m² = " + N(Ar * 10000) + " cm².", M(N(Ar * 10000) + " : " + N(Ap) + " = " + N(k2) + " = " + E + "^2") + " : les longueurs sont multipliées par " + E + ", les aires par " + M(E + "^2") + ".", M(A2 + u("m^2") + " = " + N(A2 * 10000) + u("cm^2")) + " ; " + M(N(A2 * 10000) + " : " + N(k2) + " = " + N(ap2)) + " cm²."]),
        chk: [[Math.abs((Ar * 10000) / Ap - k2) < 1e-6, "rapport des aires"]], vals: [ra, rb, Ap, Ar, k2, ap2] }); },
  ];
  const RAISONP = [
    () => { const p = pk([8, 10, 12]), w = who();
      return X({ id: "pente", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " lit un panneau « " + p + " % » et dit : « sur 1 km à l'horizontale, la route monte de " + p + " m ».",
        parts: [{ label: "Quelle est son erreur ?", pts: 1 }, { label: "De combien la route monte-t-elle vraiment sur 1 km à l'horizontale ?", pts: 1 }, { label: "Quelle serait la pente d'une route qui monte de 1 m pour 1 m à l'horizontale ? Est-elle verticale ?", pts: 1 }],
        sol: ul([p + " % veut dire " + p + " m pour <b>100</b> m, pas pour 1000 m.", M(p + "\\,\\% \\cdot 1000 = " + p * 10) + " m.", "100 % ; elle n'est pas verticale : elle fait un angle de 45° avec l'horizontale."]),
        chk: [[p * 10 !== p, "x10"]], vals: [p * 10] }); },
    () => VF({ id: "pctvar" }, [
      () => { const P = pk([50, 80, 120]); return ["Une hausse de 20 % suivie d'une baisse de 20 % ramène au prix de départ.", false, P + " → " + N(P * 1.2) + " → " + N(r6(P * 0.96)) + " : on perd 4 %."]; },
      () => ["Une baisse de 50 % suivie d'une hausse de 100 % ramène au prix de départ.", true, M("0{,}5 \\cdot 2 = 1") + "."],
      () => ["Sur une carte au " + M(sc(25000)) + ", 4 cm représentent 1 km.", true, M("4 \\cdot 25\\text{'}000 = 100\\text{'}000") + " cm = 1 km."],
      () => ["Une pente de 100 % est verticale.", false, "100 % : on monte de 100 m pour 100 m à l'horizontale, soit un angle de 45°."],
      () => { const p = pk([15, 25, 40]); return ["Augmenter de " + p + " %, c'est multiplier par " + N(1 + p / 100) + ".", true, "100 % + " + p + " % = " + (100 + p) + " % = " + N(1 + p / 100) + "."]; },
    ]),
  ];
  RICH.prop10 = { ids: ["prop", "echelle", "pctvar", "pente"], label: "Proportionnalité (10e)", ex: EXP, raison: RAISONP, minutes: 45 };

  // ===================== 10e · 12. Figures planes (polygones réguliers) =====================
  const NAME = { 5: "pentagone", 6: "hexagone", 8: "octogone", 9: "ennéagone", 10: "décagone", 12: "dodécagone", 15: "pentadécagone", 18: "polygone à 18 côtés" };
  const polyFig = (n, lab) => { const cx = 150, cy = 85, r = 70, P = []; for (let k = 0; k < n; k++) { const a = -PI / 2 + (2 * PI * k) / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return svg(300, 175, pg(P, "f-shape") + ln(cx, cy, P[0][0], P[0][1], "f-accent", "stroke-dasharray=\"4 3\"") + ln(cx, cy, P[1][0], P[1][1], "f-accent", "stroke-dasharray=\"4 3\"") + "<circle cx=\"" + cx + "\" cy=\"" + cy + "\" r=\"3\" class=\"f-dot\"/>" + tx((P[0][0] + P[1][0]) / 2 + 8, (P[0][1] + P[1][1]) / 2 - 4, lab, "f-txt", "start"), NAME[n] || "polygone"); };
  const EXPO = [
    () => { const n = pk([5, 8, 10, 12]), c = pk([4, 4.5, 6, 2.5]), ac = 360 / n, ai = 180 - ac;
      return X({ id: "polyreg", lv: 1, titre: "Le " + NAME[n] + " régulier",
        q: "Un " + NAME[n] + " régulier a " + n + " côtés de " + Q(c, "cm") + ". Son centre est relié à deux sommets voisins.", fig: polyFig(n, fmt(c) + " cm"),
        parts: [{ label: "Calcule l'angle au centre.", pts: 1 }, { label: "Calcule un angle intérieur du " + NAME[n] + ". Explique.", pts: 2 }, { label: "Calcule son périmètre.", pts: 1 }, { label: "Calcule la somme de ses angles intérieurs de deux façons.", pts: 1 }],
        sol: ul([M("360° : " + n + " = " + N(ac) + "°") + ".", "Le triangle centre-côté est isocèle ; ses angles à la base valent " + M("(180° - " + N(ac) + "°) : 2 = " + N(ai / 2) + "°") + " ; l'angle intérieur en vaut deux : " + M(N(ai) + "°") + ".", M(n + " \\cdot " + N(c) + " = " + N(r6(n * c))) + " cm.", M(n + " \\cdot " + N(ai) + "° = " + N(n * ai) + "°") + ", et aussi " + M("(" + n + " - 2) \\cdot 180° = " + (n - 2) * 180 + "°") + "."]),
        chk: [[Math.abs(n * ai - (n - 2) * 180) < 1e-9, "somme"]], vals: [ac, ai, n * c, n * ai] }); },
    () => { const [ac, n1] = pk([[40, 9], [30, 12], [24, 15], [36, 10], [20, 18]]), [ai, n2] = pk([[140, 9], [150, 12], [144, 10], [156, 15], [160, 18]].filter((x) => x[1] !== n1)), [P, c, n3] = pk([[42, 3.5, 12], [63, 7, 9], [37.5, 2.5, 15], [72, 9, 8]]);
      return X({ id: "polyreg", lv: 2, titre: "Retrouve le polygone",
        q: "Dans chaque cas, on cherche le nombre de côtés d'un polygone régulier.",
        parts: [{ label: "Son angle au centre mesure " + M(ac + "°") + ".", pts: 1 }, { label: "Son angle intérieur mesure " + M(ai + "°") + ".", pts: 2 }, { label: "Son périmètre vaut " + Q(P, "cm") + " et un côté mesure " + Q(c, "cm") + ".", pts: 1 }, { label: "Un polygone régulier peut-il avoir un angle au centre de " + M("25°") + " ? Explique.", pts: 1 }],
        sol: ul([M("360 : " + ac + " = " + n1) + " côtés.", "Angle au centre : " + M("180° - " + ai + "° = " + (180 - ai) + "°") + ", puis " + M("360 : " + (180 - ai) + " = " + n2) + " côtés.", M(N(P) + " : " + N(c) + " = " + n3) + " côtés.", "Non : " + M("360 : 25 = 14{,}4") + " n'est pas un nombre entier de côtés."]),
        chk: [[360 / ac === n1 && 360 / (180 - ai) === n2 && Math.abs(P / c - n3) < 1e-9, "inverses"]], vals: [n1, n2, n3] }); },
    () => { const n = pk([6, 8, 10]), c = pk([2.4, 3, 3.6]), ap = Math.round((c / (2 * Math.tan(PI / n))) * 100) / 100, Ar = r6((n * c * ap) / 2), px = pk([85, 110, 95]);
      return X({ id: "polyreg", lv: 2, titre: "Le kiosque",
        q: "Le sol d'un kiosque à musique est un " + NAME[n] + " régulier de côté " + Q(c, "m") + ". La distance du centre au milieu d'un côté (l'apothème) mesure " + Q(ap, "m") + ".", fig: polyFig(n, fmt(c) + " m"),
        parts: [{ label: "En combien de triangles isocèles identiques peut-on découper le sol depuis le centre ? Quelle est l'aire d'un triangle ?", pts: 2 }, { label: "Calcule l'aire du sol.", pts: 1 }, { label: "Le revêtement coûte " + chf(px) + " le m². Quel est le prix (au franc) ?", pts: 1 }, { label: "On pose une guirlande tout autour. Quelle longueur faut-il ?", pts: 1 }],
        sol: ul([n + " triangles de base " + N(c) + " m et de hauteur " + N(ap) + " m : " + M("\\frac{" + N(c) + " \\cdot " + N(ap) + "}{2} = " + N(r6((c * ap) / 2))) + " m².", M(n + " \\cdot " + N(r6((c * ap) / 2)) + " = " + N(Ar)) + " m².", M(N(Ar) + " \\cdot " + px + " \\approx " + N(Math.round(Ar * px))) + " CHF.", M(n + " \\cdot " + N(c) + " = " + N(r6(n * c))) + " m."]),
        chk: [[ap > c / 2, "apothème"]], vals: [(c * ap) / 2, Ar, Ar * px, n * c] }); },
    () => { const L = sh([5, 7, 8, 9, 10, 12]).slice(0, 3).sort((a, b) => a - b), ai = (n) => 180 - 360 / n, tiles = (n) => Number.isInteger(360 / ai(n));
      return X({ id: "polyreg", lv: 3, titre: "Paver le sol",
        q: "Un carreleur veut couvrir un sol avec des carreaux en forme de polygones réguliers, sans trou ni chevauchement. Autour de chaque sommet, les angles des carreaux doivent faire exactement 360°.",
        parts: [{ label: "Calcule l'angle intérieur d'un triangle équilatéral, d'un carré et d'un hexagone régulier. Ces polygones peuvent-ils paver le sol seuls ? Explique.", pts: 2 }, { label: "Même question pour des polygones réguliers à " + L.join(", ") + " côtés.", pts: 2 }, { label: "Montre qu'on peut paver avec deux octogones réguliers et un carré autour de chaque sommet.", pts: 1 }, { label: "Deux pentagones réguliers et un troisième polygone régulier se rencontrent en un sommet. Combien de côtés a ce troisième polygone ?", pts: 1 }],
        sol: ul(["60°, 90°, 120° : " + M("6 \\cdot 60° = 4 \\cdot 90° = 3 \\cdot 120° = 360°") + " : oui pour les trois.", L.map((n) => n + " côtés : " + A(ai(n), 2) + "° ; " + M("360 : " + A(ai(n), 2) + (tiles(n) ? " = " + 360 / ai(n) : " \\approx " + A(360 / ai(n), 2))) + (tiles(n) ? " : oui" : " : non, ce n'est pas un nombre entier")).join(" ; ") + ".", M("2 \\cdot 135° + 90° = 360°") + ".", M("360° - 2 \\cdot 108° = 144°") + " ; " + M("180° - 144° = 36°") + " au centre, donc " + M("360 : 36 = 10") + " côtés : un décagone."]),
        chk: [[L.every((n) => !tiles(n)), "aucun ne pave seul"], [2 * ai(5) + ai(10) === 360, "décagone"]], vals: L.map(ai) }); },
  ];
  const RAISONPO = [
    () => VF({ id: "polyreg" }, [
      () => ["Un polygone dont tous les côtés ont la même longueur est régulier.", false, "Un losange (non carré) a quatre côtés égaux mais des angles différents."],
      () => ["Un carré est un polygone régulier.", true, "Côtés égaux et angles égaux (90°)."],
      () => ["Plus un polygone régulier a de côtés, plus ses angles intérieurs sont grands.", true, "L'angle au centre " + M("360° : n") + " diminue, donc " + M("180° - \\frac{360°}{n}") + " augmente."],
      () => ["Un polygone régulier peut avoir un angle intérieur de 100°.", false, "Il faudrait un angle au centre de 80° et " + M("360 : 80 = 4{,}5") + " côtés : impossible."],
      () => ["Tous les sommets d'un polygone régulier sont sur un même cercle.", true, "Ils sont tous à la même distance du centre."],
    ]),
    () => { const n = pk([5, 8, 9, 10, 12]), w = who();
      return X({ id: "polyreg", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " affirme : « l'angle intérieur d'un " + NAME[n] + " régulier vaut " + M("360° : " + n + " = " + N(360 / n) + "°") + " ».",
        parts: [{ label: "Quel angle " + w.n + " a-t-" + w.il + " calculé ?", pts: 1 }, { label: "Calcule l'angle intérieur. Contrôle avec la somme des angles.", pts: 2 }],
        sol: ul(["L'angle au centre.", M("180° - " + N(360 / n) + "° = " + N(180 - 360 / n) + "°") + " ; contrôle : " + M(n + " \\cdot " + N(180 - 360 / n) + "° = " + N(n * (180 - 360 / n)) + "° = (" + n + " - 2) \\cdot 180°") + "."]),
        chk: [[Math.abs(n * (180 - 360 / n) - (n - 2) * 180) < 1e-9, "somme"]], vals: [180 - 360 / n] }); },
  ];
  RICH.poly10 = { ids: ["polyreg"], label: "Figures planes (10e)", ex: EXPO, raison: RAISONPO, minutes: 45 };

  // ===================== 10e · 13. Transformations du plan (agrandissements, rotations) =====================
  const pt = (L, x, y) => M(L + "(" + N(x) + " \\,;\\, " + N(y) + ")");
  const nz = (a, b) => { let v; do v = R.int(a, b); while (Math.abs(v) < 2); return v; };
  const EXT = [
    () => { const n = pk([12, 16, 18, 20, 24]), a = 360 / n, k = R.int(3, n / 2 - 1), Tm = pk([12, 16, 20]), m = R.int(n / 2 + 1, n - 2);
      return X({ id: "rotation", lv: 1, titre: "La grande roue",
        q: "Une grande roue porte " + n + " cabines régulièrement espacées, numérotées de 1 à " + n + " dans le sens de rotation. Elle fait un tour complet en " + Tm + " minutes. Un billet coûte " + pk([8, 10, 12]) + " CHF.",
        parts: [{ label: "Quel est l'angle de la rotation qui amène chaque cabine à la place de la suivante ?", pts: 1 }, { label: "La roue tourne de " + M(N(k * a) + "°") + ". À la place de quelle cabine se trouve maintenant la cabine 1 ?", pts: 1 }, { label: "La cabine 1 est en bas. Combien de temps lui faut-il pour arriver tout en haut ? Pour faire un quart de tour ?", pts: 2 }, { label: "De quel angle la roue a-t-elle tourné quand la cabine 1 est à la place de la cabine " + m + " ?", pts: 1 }],
        sol: ul([M("360° : " + n + " = " + N(a) + "°") + ".", M(N(k * a) + " : " + N(a) + " = " + k) + " places : la cabine 1 est à la place de la cabine " + (1 + k) + ".", "Un demi-tour : " + M(Tm + " : 2 = " + Tm / 2) + " min ; un quart de tour : " + M(Tm + " : 4 = " + N(Tm / 4)) + " min. Le prix du billet ne sert à rien.", M((m - 1) + " \\cdot " + N(a) + "° = " + N((m - 1) * a) + "°") + "."]),
        chk: [[k * a < 360 && (m - 1) * a < 360, "angles"]], vals: [a, k * a, 1 + k, Tm / 2, Tm / 4, (m - 1) * a] }); },
    () => { const [Lr, k1, k2] = pk([[450, 18, 50], [450, 25, 90], [360, 24, 45], [360, 18, 90], [432, 18, 48]]), lm = Lr / k1, wm = pk([9, 10, 10.5]), wr = r6((wm * k1) / 100), l2 = Lr / k2;
      return X({ id: "agrand", lv: 2, titre: "La maquette",
        q: "Une voiture réelle mesure " + Q(Lr / 100, "m") + " de long. Un collectionneur en a une maquette à l'échelle " + M("1\\,:\\," + k1) + ".",
        parts: [{ label: "Quelle est la longueur de la maquette, en cm ?", pts: 1 }, { label: "La maquette a " + Q(wm, "cm") + " de large. Quelle est la largeur réelle de la voiture ?", pts: 1 }, { label: "Combien de fois plus de peinture faut-il pour la vraie voiture que pour la maquette ?", pts: 2 }, { label: "Une autre maquette de la même voiture mesure " + Q(l2, "cm") + ". Quelle est son échelle ?", pts: 1 }],
        sol: ul([M(Lr + " : " + k1 + " = " + N(lm)) + " cm.", M(N(wm) + " \\cdot " + k1 + " = " + N(wm * k1)) + " cm = " + Q(wr, "m") + ".", "Les longueurs sont multipliées par " + k1 + ", les aires par " + M(k1 + "^2 = " + k1 * k1) + " : " + k1 * k1 + " fois plus.", M(Lr + " : " + N(l2) + " = " + k2) + " : échelle " + M("1\\,:\\," + k2) + "."]),
        chk: [[Number.isInteger(lm * 2) && Math.abs(Lr / l2 - k2) < 1e-9, "échelles"]], vals: [lm, wr, k1 * k1, k2] }); },
    () => { let P; do P = [[nz(1, 5), nz(1, 4)], [nz(2, 5), nz(-3, 3)], [nz(-3, 3), nz(2, 5)]]; while (new Set(P.map((p) => p.join())).size < 3);
      const r90 = ([x, y]) => [-y, x], r180 = ([x, y]) => [-x, -y], I = P.map(r90), J = P.map(r180);
      return X({ id: "rotation", lv: 2, titre: "Quart de tour dans le repère",
        q: "Le triangle " + M("ABC") + " a pour sommets " + pt("A", ...P[0]) + ", " + pt("B", ...P[1]) + ", " + pt("C", ...P[2]) + ". On le fait tourner autour de l'origine " + M("O") + ".", fig: grid(-6, 6, -6, 6, [[...P[0], "A"], [...P[1], "B"], [...P[2], "C"]], [[P]]),
        parts: [{ label: "Construis l'image de " + M("A") + " par la rotation de centre " + M("O") + " de 90° dans le sens inverse des aiguilles d'une montre, et donne ses coordonnées.", pts: 1 }, { label: "Donne les coordonnées des images de " + M("B") + " et " + M("C") + ". Quelle règle observes-tu ?", pts: 2 }, { label: "Donne les coordonnées des images de " + M("A") + ", " + M("B") + ", " + M("C") + " par la rotation de 180°. À quelle autre transformation correspond-elle ?", pts: 2 }],
        sol: ul([pt("A'", ...I[0]) + ".", pt("B'", ...I[1]) + ", " + pt("C'", ...I[2]) + " : " + M("(x \\,;\\, y) \\to (-y \\,;\\, x)") + ".", pt("A''", ...J[0]) + ", " + pt("B''", ...J[1]) + ", " + pt("C''", ...J[2]) + " : c'est la symétrie de centre " + M("O") + " " + M("(x \\,;\\, y) \\to (-x \\,;\\, -y)") + "."]),
        chk: [[P.every((p, i) => r90(r90(p)).join() === J[i].join()), "deux quarts de tour"]], vals: [] }); },
    () => { const P = pk([24, 30, 36]), Ar = pk([32, 40, 45]), k = pk([1.5, 2.5, 3]), kr = pk([0.4, 0.6, 0.8]), m = pk([[6.25, 2.5], [2.25, 1.5], [9, 3], [1.44, 1.2]]);
      return X({ id: "agrand", lv: 3, titre: "Le logo",
        q: "Un logo a un périmètre de " + Q(P, "cm") + " et une aire de " + Q(Ar, "cm^2") + ".",
        parts: [{ label: "On l'agrandit avec le rapport " + N(k) + ". Calcule le nouveau périmètre et la nouvelle aire.", pts: 2 }, { label: "On le réduit avec le rapport " + N(kr) + ". Calcule le nouveau périmètre et la nouvelle aire.", pts: 2 }, { label: "Sur une affiche, l'aire du logo est multipliée par " + N(m[0]) + ". Par combien ses longueurs ont-elles été multipliées ?", pts: 1 }],
        sol: ul(["Périmètre " + M(P + " \\cdot " + N(k) + " = " + N(P * k)) + " cm ; aire " + M(Ar + " \\cdot " + N(k) + "^2 = " + Ar + " \\cdot " + N(k * k) + " = " + N(r6(Ar * k * k))) + " cm².", "Périmètre " + M(P + " \\cdot " + N(kr) + " = " + N(r6(P * kr))) + " cm ; aire " + M(Ar + " \\cdot " + N(r6(kr * kr)) + " = " + N(r6(Ar * kr * kr))) + " cm² (une réduction : rapport plus petit que 1).", "Par " + M(N(m[1])) + ", car " + M(N(m[1]) + "^2 = " + N(m[0])) + "."]),
        chk: [[Math.abs(m[1] * m[1] - m[0]) < 1e-9, "racine"]], vals: [P * k, Ar * k * k, P * kr, Ar * kr * kr, m[1]] }); },
  ];
  const RAISONT = [
    () => VF({ id: "agrand" }, [
      () => ["Une rotation de 180° est une symétrie centrale.", true, "Chaque point va de l'autre côté du centre, à la même distance."],
      () => { const k = pk([3, 4]); return ["Un agrandissement de rapport " + k + " multiplie l'aire par " + k + ".", false, "Il la multiplie par " + M(k + "^2 = " + k * k) + "."]; },
      () => ["Une rotation conserve les longueurs et les angles.", true, "La figure tourne sans se déformer."],
      () => ["Un agrandissement conserve les angles.", true, "La forme reste la même, seules les longueurs changent."],
      () => ["Une réduction a un rapport plus grand que 1.", false, "Son rapport est entre 0 et 1 (ex. 0,5)."],
      () => ["Quatre quarts de tour de suite ramènent la figure à sa place.", true, M("4 \\cdot 90° = 360°") + "."],
    ]),
    () => { const a = nz(2, 6), b = nz(2, 6), w = who();
      return X({ id: "rotation", lv: 2, titre: "Trouve l'erreur",
        q: w.n + " fait tourner " + pt("A", a, b) + " d'un quart de tour (90°) autour de " + M("O") + ", dans le sens inverse des aiguilles d'une montre, et obtient " + pt("A'", b, -a) + ".",
        parts: [{ label: "Dans quel sens " + w.n + " a-t-" + w.il + " tourné ?", pts: 1 }, { label: "Donne la bonne image.", pts: 1 }],
        sol: ul(["Dans le sens des aiguilles d'une montre : " + M("(x \\,;\\, y) \\to (y \\,;\\, -x)") + ".", pt("A'", -b, a) + " (règle " + M("(x \\,;\\, y) \\to (-y \\,;\\, x)") + ")."]),
        chk: [[!(b === -b && -a === a), "différent"]], vals: [-b, a] }); },
  ];
  RICH.transf10 = { ids: ["agrand", "rotation"], label: "Transformations du plan (10e)", ex: EXT, raison: RAISONT, minutes: 45 };
})();

// Chantier 10e · chapitres 1 à 7 (23.11) : leçons actives (devine / essaie sur la figure / retiens) pour les notions
// de 10e qui n'en avaient pas et qui ne sont pas aussi en 9e : disque, grandmanq (2. Aires et périmètres),
// airelat, voldecomp (4. 3D). Calibrées sur les MER 10e (GM14–GM28 cercles et disques, GM8 hauteur d'un trapèze,
// GM89–GM97 boîtes, cylindres, contenances). Même moteur que act_ch11c.js (outils recopiés : fichier autonome).
// Pas de vraie manipulation ici : mode réponse (o.ask), une figure qui réagit après « Vérifier ».
// Avec π : on demande le nombre devant π (valeur exacte), comme volmanq ; « 12π » tapé est aussi accepté.
// L'étape « Retiens » vient de LESSONS[id] (lessons2.js pour disque, gen3.js pour les trois autres).
(function () {
  // ---------- outils ----------
  // Nombre à la suisse : virgule décimale, ' pour les milliers, vrai signe moins.
  const nb = (v) => { const s = String(+(+v).toFixed(4)); const [i, d] = s.replace("-", "").split("."); return (v < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (d ? "," + d : ""); };
  const ok = (good, low) => (good ? '<b class="act-ok">✓ juste</b>' : low ? "trop petit" : "trop grand");
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const Q = (x) => (x === null || x === undefined ? "?" : nb(x)); // inconnue : « ? » tant que rien n'est tapé
  const QC = (x) => (x === null || x === undefined ? "f-txt f-accent" : "f-txt");
  // Mode réponse (o.ask) : l'élève calcule et tape ; la figure se met à jour après « Vérifier ».
  // o et mk gardés sur la fonction : actPrep (active.js) peut ne garder que 2 questions.
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = null, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const lab = typeof o.label === "function" ? o.label(s) : o.label || "Ta réponse";
      box.innerHTML = fig + actAnswerHtml(lab) + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      const inp = box.querySelector(".act-in");
      const go = () => {
        const raw = String(inp.value).replace(/π|pi/gi, "").replace(/['’\s]/g, "").replace(/,/g, ".").replace("−", "-");
        const v = Number(raw.replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (m, u, w) => String(u / w)));
        if (raw === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; }
        x = v; draw(); if (!check()) $hint(box, o.miss || "Pas encore : regarde la figure, puis recalcule.");
      };
      actAnswerBind(box, go);
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; x = null; draw(); return true; } return false; };
    draw();
  };
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Pavé en perspective cavalière : (x, y) = coin avant gauche en bas, w × h de face, (dx, dy) = fuite de la profondeur.
  const box3 = (x, y, w, h, dx, dy, cls = "f-fill2") => `<polygon points="${x},${y - h} ${x + w},${y - h} ${x + w + dx},${y - h + dy} ${x + dx},${y - h + dy}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
    + `<polygon points="${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
    + `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" class="${cls}" stroke="var(--ink)" stroke-width="1.2"/>`;
  // Point d'un cercle (angle en degrés, sens trigonométrique, y vers le bas en SVG).
  const P = (cx, cy, r, a) => [+(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1), +(cy - r * Math.sin((a * Math.PI) / 180)).toFixed(1)];

  // ---------- figures ----------
  // Roue qui roule : un tour complet = la longueur du cercle (π · diamètre).
  const roue = () => { const r = 26, cx = 40, cy = 56, u = Math.PI * 2 * r; let g = L(10, cy + r, 315, cy + r);
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="2"/>` + L(cx - r, cy, cx + r, cy, "f-accent", 2) + T(cx, cy - 6, "70 cm", "middle", 11);
    g += `<circle cx="${cx + u}" cy="${cy}" r="${r}" class="f-soft" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    g += `<path d="M${cx},${cy + r + 12} H${cx + u}" class="f-accent" stroke-width="2" fill="none"/>` + L(cx, cy + r + 7, cx, cy + r + 17, "f-accent", 2) + L(cx + u, cy + r + 7, cx + u, cy + r + 17, "f-accent", 2) + T(cx + u / 2, cy + r + 28, "1 tour = ?", "middle", 12, "f-txt f-accent");
    return svg(320, 118, g, "roue de 70 cm de diamètre qui fait un tour"); };
  // Défis du disque : 0 cercle de rayon 6 cm, 1 pizza de 30 cm de diamètre, 2 secteur de 120° et de rayon 9 m.
  const disc = (s) => { const cx = 160, cy = 78, R = 62; let g = "";
    if (s === 0) g = `<circle cx="${cx}" cy="${cy}" r="${R}" class="f-soft" stroke="var(--ink)" stroke-width="2.4"/>` + L(cx, cy, cx + R, cy, "f-accent", 2) + T(cx + R / 2, cy - 6, "6 cm") + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>`;
    else if (s === 1) g = `<circle cx="${cx}" cy="${cy}" r="${R}" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(cx - R, cy, cx + R, cy, "f-accent", 2) + T(cx, cy - 6, "30 cm") + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>`;
    else { const cy2 = 120, R2 = 92, [ax, ay] = P(cx, cy2, R2, 30), [bx, by] = P(cx, cy2, R2, 150), [lx, ly] = P(cx, cy2, R2 / 2, 30);
      g = `<path d="M${cx - R2},${cy2} A${R2} ${R2} 0 0 1 ${cx + R2},${cy2}" class="f-line" fill="none" stroke-dasharray="4 3" stroke-width="1"/>`
        + `<path d="M${cx},${cy2} L${ax},${ay} A${R2} ${R2} 0 0 0 ${bx},${by} Z" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>`
        + `<path d="M${P(cx, cy2, 18, 30)} A18 18 0 0 0 ${P(cx, cy2, 18, 150)}" class="f-accent" fill="none" stroke-width="1.6"/>` + T(cx, cy2 - 24, "120°", "middle", 11)
        + T(lx + 8, ly + 12, "9 m", "start") + `<circle cx="${cx}" cy="${cy2}" r="3" class="f-dot"/>` + T(cx, cy2 + 15, "arroseur", "middle", 10); }
    return svg(320, s === 2 ? 142 : 156, g, ["cercle de rayon 6 cm", "pizza de 30 cm de diamètre", "secteur de 120° et de rayon 9 m"][s]); };
  // Triangle (aire 24, base 8) du « Devine ».
  const triDev = () => svg(320, 130, `<polygon points="60,110 260,110 110,20" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(110, 20, 110, 110, "f-accent", 2, "5 4") + `<rect x="110" y="100" width="10" height="10" fill="none" class="f-line" stroke-width="1"/>`
    + T(160, 126, "8 cm") + T(116, 72, "h = ?", "start", 12, "f-txt f-accent") + T(178, 102, "aire 24 cm²", "middle", 11), "triangle d'aire 24 cm² et de base 8 cm");
  // Défis : 0 potager rectangulaire 7 m × ?, 1 voile triangulaire de base 5 m, 2 trapèze de bases 11 et 7 cm.
  const dimFig = (s, x) => { let g;
    if (s === 0) g = `<rect x="40" y="30" width="240" height="84" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + T(160, 22, "longueur = " + Q(x) + " m", "middle", 12, QC(x)) + T(32, 76, "7 m", "end") + T(160, 78, "aire 84 m²");
    else if (s === 1) g = `<polygon points="120,10 120,130 220,130" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(120, 10, 120, 130, "f-accent", 2) + T(112, 74, "h = " + Q(x) + " m", "end", 12, QC(x)) + T(170, 146, "base 5 m") + T(150, 112, "15 m²", "start", 11);
    else g = `<polygon points="40,120 280,120 230,30 70,30" class="f-fill2" stroke="var(--ink)" stroke-width="1.6"/>` + L(100, 30, 100, 120, "f-accent", 2, "5 4") + T(160, 22, "b = 7 cm") + T(160, 138, "B = 11 cm") + T(108, 80, "h = " + Q(x) + " cm", "start", 12, QC(x)) + T(200, 104, "aire 45 cm²", "middle", 11);
    return svg(320, 150, g, ["potager rectangulaire", "voile triangulaire", "trapèze"][s]); };
  // Pièce de 5 m × 4 m, haute de 3 m (murs à peindre).
  const piece = () => svg(320, 140, box3(70, 125, 150, 90, 70, -40, "f-fill2") + T(145, 138, "5 m") + T(270, 118, "4 m", "start") + T(62, 84, "3 m", "end") + T(145, 84, "4 murs à peindre", "middle", 11), "pièce de 5 m sur 4 m, haute de 3 m");
  // Défis : 0 boîte prisme (triangle équilatéral de 4 cm, longueur 20 cm) et ses 3 rectangles dépliés ;
  // 1 cylindre r = 4, h = 11 et son étiquette déroulée ; 2 le même avec le fond et le couvercle.
  const latFig = (s) => { let g = "";
    if (s === 0) { const A = [14, 104], B = [50, 104], C = [32, 73], d = [64, -40], m = (p) => [p[0] + d[0], p[1] + d[1]];
      g += `<polygon points="${m(A)} ${m(B)} ${m(C)}" class="f-line" fill="none" stroke-width="1" stroke-dasharray="3 3"/>` + L(...A, ...m(A), "f-line", 1, "3 3")
        + `<polygon points="${C} ${m(C)} ${m(B)} ${B}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/><polygon points="${A} ${B} ${C}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + L(...C, ...m(C), "f-line", 1.2)
        + T(32, 120, "4 cm", "middle", 10) + T(88, 92, "20 cm", "start", 10);
      for (let k = 0; k < 3; k++) g += `<rect x="${140 + k * 46}" y="12" width="46" height="110" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/>` + T(163 + k * 46, 136, "4 cm", "middle", 10);
      g += T(284, 70, "20 cm", "start", 10) + T(110, 128, "déplié →", "middle", 11); return svg(320, 142, g, "boîte en prisme et ses trois faces latérales dépliées"); }
    const y0 = s === 2 ? 44 : 28;
    g += `<path d="M36,${y0} V${y0 + 80} A26 7 0 0 0 88,${y0 + 80} V${y0}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/><ellipse cx="62" cy="${y0}" rx="26" ry="7" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + L(62, y0, 88, y0, "f-accent", 1.6) + T(75, y0 - 10, "4 cm", "middle", 10) + T(30, y0 + 44, "11 cm", "end", 10);
    g += `<rect x="112" y="${y0}" width="196" height="80" class="f-fill2" stroke="var(--ink)" stroke-width="1.4"/>` + T(210, y0 + 44, "étiquette déroulée", "middle", 11) + T(116, y0 + 44, "11 cm", "start", 10) + T(210, y0 + 96, "longueur = périmètre du disque", "middle", 10);
    if (s === 2) g += `<circle cx="210" cy="22" r="17" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/><circle cx="210" cy="164" r="17" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>` + T(234, 26, "fond", "start", 10) + T(234, 168, "couvercle", "start", 10);
    return svg(320, s === 2 ? 186 : 132, g, s === 2 ? "cylindre déplié avec ses deux disques" : "cylindre et son étiquette déroulée"); };
  // Aquarium 50 × 30 × 40 cm.
  const aquarium = () => svg(320, 140, box3(80, 128, 140, 100, 56, -24, "f-soft") + `<rect x="80" y="44" width="140" height="84" class="f-fill2" fill-opacity=".7"/>` + `<rect x="80" y="28" width="140" height="100" fill="none" stroke="var(--ink)" stroke-width="1.4"/>`
    + T(150, 140, "50 cm", "middle", 11) + T(256, 114, "30 cm", "start", 11) + T(72, 82, "40 cm", "end", 11), "aquarium de 50 cm sur 30 cm sur 40 cm");
  // Défis : 0 podium (3 pavés de base 5 dm × 4 dm, hauts de 3, 5 et 2 dm), 1 maison + toit, 2 piscine.
  const volFig = (s) => { let g = "";
    if (s === 0) { const k = 14, y = 128, dx = 40, dy = -20; g += box3(40, y, 5 * k, 3 * k, dx, dy) + box3(40 + 5 * k, y, 5 * k, 5 * k, dx, dy, "f-fill") + box3(40 + 10 * k, y, 5 * k, 2 * k, dx, dy);
      g += T(40 + 2.5 * k, y - 1.5 * k + 4, "3 dm", "middle", 10) + T(40 + 7.5 * k, y - 2.5 * k + 4, "5 dm", "middle", 10, "f-on") + T(40 + 12.5 * k, y - k + 4, "2 dm", "middle", 10) + T(40 + 7.5 * k, y + 14, "5 dm chacun", "middle", 10) + T(40 + 15 * k + dx / 2 + 6, y + dy / 2, "4 dm", "start", 10);
      return svg(320, 146, g, "podium de trois pavés"); }
    if (s === 1) { const x = 50, y = 130, w = 120, h = 54, t = 36, dx = 110, dy = -38;
      g += `<polygon points="${x + w / 2},${y - h - t} ${x + w / 2 + dx},${y - h - t + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
        + `<polygon points="${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y - h + dy} ${x + w},${y - h}" class="f-soft" stroke="var(--ink)" stroke-width="1.2"/>`
        + `<polygon points="${x},${y} ${x + w},${y} ${x + w},${y - h} ${x + w / 2},${y - h - t} ${x},${y - h}" class="f-fill2" stroke="var(--ink)" stroke-width="1.2"/>` + L(x, y - h, x + w, y - h, "f-line", 1, "4 3") + L(x + w / 2, y - h, x + w / 2, y - h - t, "f-accent", 1.6, "4 3");
      g += T(x + w / 2, y + 14, "6 m", "middle", 11) + T(x - 6, y - h / 2 + 4, "3 m", "end", 11) + T(x + w / 2 + 5, y - h - t / 2 + 6, "2 m", "start", 11) + T(x + w + dx / 2 + 8, y + dy / 2 + 8, "10 m", "start", 11);
      return svg(320, 150, g, "maison : pavé surmonté d'un toit en prisme"); }
    g += box3(40, 110, 200, 50, 50, -30, "f-soft") + `<rect x="40" y="76" width="200" height="34" class="f-fill2"/>` + `<rect x="40" y="60" width="200" height="50" fill="none" stroke="var(--ink)" stroke-width="1.4"/>`
      + T(140, 124, "8 m", "middle", 11) + T(270, 96, "4 m", "start", 11) + T(34, 97, "1,5 m", "end", 11) + T(140, 96, "eau", "middle", 11);
    return svg(320, 132, g, "piscine de 8 m sur 4 m remplie sur 1,5 m"); };

  Object.assign(ACTIVE, {
    disque: {
      predict: { q: "Une roue de vélo a un diamètre de 70 cm. Quand elle fait un tour complet, le vélo avance d'environ…", fig: roue(), choices: ["70 cm", "2,2 m", "1,4 m"], good: 1,
        why: "Le vélo avance de la longueur du cercle : un peu plus de 3 fois le diamètre. Ce nombre, c'est π ≈ 3,14 : π · 70 ≈ 220 cm, soit 2,2 m." },
      defis: ["Un cercle a un rayon de 6 cm. Son périmètre vaut … π cm. Tape le nombre devant π.", "L'aire d'un disque vaut π · r². Une pizza a 30 cm de diamètre : son aire vaut … π cm².", "Un arroseur tourne de 120° et arrose jusqu'à 9 m. Aire arrosée : … π m² ?"],
      play: hunt({ ask: true, label: "Nombre devant π",
        blank: (s) => disc(s),
        show: (x, s) => disc(s) + plain(["Longueur du cercle : π · diamètre = π · (2 · 6)", "Rayon : 30 ÷ 2 = 15 cm ; aire : π · 15²", "120° sur 360° : c'est " + "1/3 du disque ; disque entier : π · 9² = 81π"][s] + "<br>tu proposes <b>" + nb(x) + "π</b> → " + ok(Math.abs(x - [12, 225, 27][s]) < 1e-9, x < [12, 225, 27][s])),
        miss: "Pas encore : relis le calcul sous la figure.",
        wins: [W(12, "Périmètre : π · 12 = 2 · π · 6 = 12π cm ≈ 37,7 cm."), W(225, "r = 15 cm : π · 15² = 225π cm² ≈ 706,9 cm². Avec le diamètre (π · 30²), on aurait 4 fois trop !"), W(27, "120/360 = 1/3 : 81π ÷ 3 = 27π m² ≈ 84,8 m².")] }),
    },
    grandmanq: {
      predict: { q: "Un triangle a une aire de 24 cm² et une base de 8 cm. Sa hauteur mesure…", fig: triDev(), choices: ["3 cm", "6 cm", "16 cm"], good: 1,
        why: "Aire = base · hauteur ÷ 2, donc 8 · h ÷ 2 = 24. On défait le calcul : 8 · h = 48, puis h = 48 ÷ 8 = 6 cm. 24 ÷ 8 = 3 oublie le ÷ 2." },
      defis: ["Un potager rectangulaire de 84 m² est large de 7 m. Quelle est sa longueur (en m) ?", "Une voile triangulaire a une aire de 15 m² et une base de 5 m. Sa hauteur (en m) ?", "Aire d'un trapèze : (B + b) · h ÷ 2. Aire 45 cm², bases 11 cm et 7 cm. Hauteur (en cm) ?"],
      play: hunt({ ask: true, label: "Longueur cherchée",
        blank: (s) => dimFig(s, null),
        show: (x, s) => dimFig(s, x) + plain(["7 · " + nb(x) + " = <b>" + nb(7 * x) + " m²</b> (cible 84) → " + ok(7 * x === 84, 7 * x < 84),
          "5 · " + nb(x) + " ÷ 2 = <b>" + nb((5 * x) / 2) + " m²</b> (cible 15) → " + ok(5 * x === 30, 5 * x < 30),
          "(11 + 7) · " + nb(x) + " ÷ 2 = 9 · " + nb(x) + " = <b>" + nb(9 * x) + " cm²</b> (cible 45) → " + ok(9 * x === 45, 9 * x < 45)][s]),
        wins: [W(12, "7 · ℓ = 84, donc ℓ = 84 ÷ 7 = 12 m."), W(6, "5 · h ÷ 2 = 15 : on double d'abord (5 · h = 30), puis h = 30 ÷ 5 = 6 m."), W(5, "(11 + 7) ÷ 2 = 9 : 9 · h = 45, donc h = 5 cm.")] }),
    },
    airelat: {
      predict: { q: "On repeint les 4 murs d'une pièce de 5 m sur 4 m, haute de 3 m (ni le sol ni le plafond). Surface à peindre ?", fig: piece(), choices: ["60 m²", "54 m²", "27 m²"], good: 1,
        why: "On « déplie » les 4 murs : un long rectangle de 5 + 4 + 5 + 4 = 18 m sur 3 m, soit 54 m². 60, c'est 5 · 4 · 3 : le volume (en m³) ; 27 oublie deux murs." },
      defis: ["Une boîte de chocolats est un prisme : base en triangle équilatéral de 4 cm, longueur 20 cm. Aire latérale (en cm²) ?", "Boîte de conserve : rayon 4 cm, hauteur 11 cm. Aire de l'étiquette : … π cm² ?", "Même boîte, avec le fond et le couvercle : aire totale … π cm² ?"],
      play: hunt({ ask: true, label: (s) => (s ? "Nombre devant π" : "Aire latérale (cm²)"),
        blank: (s) => latFig(s),
        show: (x, s) => { const t = [240, 88, 120][s]; return latFig(s) + plain(["3 rectangles de 4 cm sur 20 cm : périmètre de la base · longueur = (4 + 4 + 4) · 20", "Périmètre du disque : 2 · π · 4 = 8π ; aire de l'étiquette : 8π · 11", "Étiquette 88π, plus 2 disques de π · 4² chacun"][s] + "<br>tu proposes <b>" + nb(x) + (s ? "π" : "") + "</b> → " + ok(Math.abs(x - t) < 1e-9, x < t)); },
        miss: "Pas encore : relis le calcul sous la figure.",
        wins: [W(240, "12 · 20 = 240 cm² : aire latérale = périmètre de la base · hauteur du prisme."), W(88, "2 · π · 4 · 11 = 88π cm² ≈ 276,5 cm²."), W(120, "88π + 2 · 16π = 120π cm² ≈ 377 cm². Aire totale = aire latérale + 2 bases.")] }),
    },
    voldecomp: {
      predict: { q: "Un aquarium mesure 50 cm × 30 cm × 40 cm. Plein, il contient…", fig: aquarium(), choices: ["60 L", "600 L", "6 L"], good: 0,
        why: "En dm : 5 · 3 · 4 = 60 dm³, et 1 dm³ = 1 L, donc 60 L. En cm : 60'000 cm³ ÷ 1000 = 60 L (1 L = 1000 cm³)." },
      defis: ["Un podium est fait de 3 pavés de base 5 dm × 4 dm, hauts de 3, 5 et 2 dm. Volume total (en dm³) ?", "Maison : pavé de 10 m × 6 m × 3 m, toit en prisme (triangle de base 6 m, haut de 2 m). Volume (en m³) ?", "Une piscine de 8 m × 4 m est remplie sur 1,5 m. Combien de litres d'eau ?"],
      play: hunt({ ask: true, label: (s) => ["Volume (dm³)", "Volume (m³)", "Contenance (L)"][s],
        blank: (s) => volFig(s),
        show: (x, s) => { const t = [200, 240, 48000][s]; return volFig(s) + plain(["Chaque marche : 5 · 4 · hauteur ; on additionne les 3 pavés", "Pavé 10 · 6 · 3 ; toit : aire du triangle (6 · 2 ÷ 2) · 10", "8 · 4 · 1,5 = 48 m³ ; 1 m³ = 1000 L"][s] + "<br>tu proposes <b>" + nb(x) + ["", "", " L"][s] + "</b> → " + ok(Math.abs(x - t) < 1e-9, x < t)); },
        miss: "Pas encore : relis le calcul sous la figure.",
        wins: [W(200, "20 · 3 + 20 · 5 + 20 · 2 = 60 + 100 + 40 = 200 dm³ (= 20 · 10, même base)."), W(240, "180 m³ + 60 m³ = 240 m³. Le toit n'est pas un pavé : on divise par 2."), W(48000, "48 m³ = 48'000 L.")] }),
    },
  });
})();

// Chantier 10e, chapitres 8 à 14 (23.11) : leçons actives (devine / défis / retiens) pour les notions de 10e qui n'en
// avaient pas et qui ne sont pas aussi en 9e : eqverif (9. Équations), echelle et pente (10. Proportionnalité),
// polyreg (12. Figures planes), rotation (13. Transformations). Calibrage : MER 10e (FA72–FA76 pente, FA52–FA56 échelle,
// ES11–ES14 polygones réguliers, ES77 et suivants rotations : angle positif = sens inverse des aiguilles d'une montre).
// Même moteur que act_ch11c.js (outils recopiés : le fichier reste autonome). Vraies manipulations seulement pour la
// balance (eqverif : on teste des valeurs) et la rotation (on fait tourner une figure) ; ailleurs l'élève calcule et tape,
// la figure se met à jour après « Vérifier ». Le « Retiens » vient de la leçon existante (LESSONS[id]).
(function () {
  // ---------- outils ----------
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  // Milliers avec ' (1'400), virgule décimale.
  const mil = (v) => { const s = String(+(+v).toFixed(4)).split("."); return (s[0].replace("-", "−").replace(/\B(?=(\d{3})+(?!\d))/g, "'")) + (s[1] ? "," + s[1] : ""); };
  const par = (v) => (v < 0 ? "(" + nb(v) + ")" : nb(v));
  const svg = (w, h, g, lab) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">${g}</svg>`;
  const T = (x, y, s, a = "middle", sz = 12, cls = "f-txt") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" font-size="${sz}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls = "f-line", w = 1.6, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${dash ? ' stroke-dasharray="5 4"' : ""}/>`;
  const plain = (html) => `<div class="act-out">${html}</div>`;
  const W = (target, msg) => (x) => (Math.abs(x - target) < 1e-9 ? msg : "");
  // Chercheur (recopié de act_ch11c.js) : mode réponse (o.ask) ou curseur (vraie manipulation).
  const hunt = (o) => Object.assign(hunt0(o), { o, mk: hunt0 });
  const hunt0 = (o) => (box, onWin) => {
    let x = o.ask ? null : o.start, step = 0;
    const draw = () => {
      const s = Math.min(step, o.wins.length - 1), fig = x === null ? (o.blank ? o.blank(s) : "") : o.show(x, s);
      const ctl = o.ask ? (actAnswerHtml(o.label || "Ta réponse"))
        : actStepper(o.label || "x", nb(x), "x");
      box.innerHTML = fig + ctl + (o.note ? `<div class="small muted">${o.note}</div>` : "");
      if (o.ask) {
        const inp = box.querySelector(".act-in"); if (x !== null) inp.value = nb(x).replace("−", "-"); const go = () => { const v = Number(String(inp.value).replace(/,/g, ".").replace("−", "-").replace(/\s/g, "").replace(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/, (s, u, w) => String(u / w))); if (inp.value.trim() === "" || !isFinite(v)) { $hint(box, "Tape un nombre."); return; } x = v; draw(); if (!check()) $hint(box, o.miss || (box.querySelector("svg.fig") ? "Pas encore : regarde la figure, puis recalcule." : "Pas encore : relis les calculs affichés, puis recalcule.")); };
        actAnswerBind(box, go);
      } else box.querySelectorAll('[data-st="x"]').forEach((b) => (b.onclick = () => { x = Math.max(o.min, Math.min(o.max, +(x + +b.dataset.d * (o.step || 1)).toFixed(6))); draw(); check(); }));
    };
    const check = () => { if (step >= o.wins.length) return false; const m = o.wins[step](x); if (m) { onWin(step, m); step++; if (o.ask) x = null; draw(); return true; } return false; };
    draw();
  };

  // ---------- eqverif : balance à deux plateaux ----------
  // Membre de gauche et membre de droite pour la valeur x ; le plateau le plus lourd descend.
  const EQ = [
    { g: (x) => 2 * x + 5, d: () => 17, tg: (x) => "2 · " + par(x) + " + 5", td: () => "17", lg: "2x + 5", ld: "17" },
    { g: (x) => 5 * x + 7, d: (x) => 2 * x - 2, tg: (x) => "5 · " + par(x) + " + 7", td: (x) => "2 · " + par(x) + " − 2", lg: "5x + 7", ld: "2x − 2" },
    { g: (x) => x * x + 6, d: (x) => 5 * x, tg: (x) => par(x) + "² + 6", td: (x) => "5 · " + par(x), lg: "x² + 6", ld: "5x" },
  ];
  const balance = (x, s) => {
    const e = EQ[s], a = e.g(x), b = e.d(x), th = (Math.max(-14, Math.min(14, (a - b) * 1.5)) * Math.PI) / 180;
    const cx = 160, cy = 42, r = 112, xl = cx - r * Math.cos(th), yl = cy + r * Math.sin(th), xr = cx + r * Math.cos(th), yr = cy - r * Math.sin(th);
    const pan = (px, py, val, cls) => L(px, py, px - 30, py + 34, "f-line", 1) + L(px, py, px + 30, py + 34, "f-line", 1) + `<rect x="${px - 38}" y="${py + 34}" width="76" height="20" rx="4" class="${cls}"/>` + T(px, py + 49, val, "middle", 13, "f-txt");
    let g = `<polygon points="${cx - 16},150 ${cx + 16},150 ${cx},${cy}" class="f-shape2"/>` + L(xl, yl, xr, yr, "f-line", 3) + `<circle cx="${cx}" cy="${cy}" r="4" class="f-dot"/>`;
    g += pan(xl, yl, nb(a), "f-fill2") + pan(xr, yr, nb(b), "f-fill2");
    g += T(cx - 100, 166, e.lg, "middle", 12, "f-txt") + T(cx + 100, 166, e.ld, "middle", 12, "f-txt");
    const eq = Math.abs(a - b) < 1e-9;
    return svg(320, 172, g, "balance : " + e.lg + " et " + e.ld) + plain("x = <b>" + nb(x) + "</b> : à gauche " + e.tg(x) + " = <b>" + nb(a) + "</b> ; à droite " + (s ? e.td(x) + " = " : "") + "<b>" + nb(b) + "</b>" + (eq ? ' <b class="act-ok">✓ égalité</b>' : " → " + "pas égaux (" + (a > b ? "gauche" : "droite") + " plus grand)"));
  };

  // ---------- echelle : plan, carte, pièce ----------
  const plan = (s, ans) => {
    let g = "";
    if (s === 0) { // plan d'un appartement au 1 : 200, un mur de 7 cm
      g += `<rect x="40" y="20" width="240" height="110" class="f-soft" stroke="var(--ink)" stroke-width="2"/>` + L(150, 20, 150, 130, "f-line", 2) + L(40, 80, 150, 80, "f-line", 2);
      g += L(40, 20, 280, 20, "f-accent", 4) + T(160, 14, "7 cm sur le plan", "middle", 11, "f-txt f-accent") + T(160, 150, "échelle 1 : 200" + (ans === undefined ? "" : " · en vrai : " + ans), "middle", 11);
      return svg(320, 158, g, "plan d'un appartement");
    }
    if (s === 1) { // carte au 1 : 25'000, deux villages à 3 km
      g += `<rect x="20" y="10" width="280" height="120" rx="6" class="f-soft"/>` + `<path d="M22,126 C100,104 190,132 298,108" class="f-blue" fill="none" stroke-width="2"/>`;
      g += `<circle cx="60" cy="96" r="5" class="f-dot"/>` + T(60, 114, "village", "middle", 11) + `<circle cx="260" cy="50" r="5" class="f-dot"/>` + T(260, 38, "ferme", "middle", 11);
      g += L(60, 96, 260, 50, "f-accent", 1.6, true) + T(150, 62, ans === undefined ? "? cm" : ans, "middle", 12, "f-txt f-accent");
      g += T(160, 148, "carte au 1 : 25'000 · en vrai : 3 km à vol d'oiseau", "middle", 11);
      return svg(320, 156, g, "carte avec deux villages");
    }
    // pièce de 4 cm sur 3 cm au 1 : 100
    const u = 32; g += `<rect x="${160 - 2 * u}" y="18" width="${4 * u}" height="${3 * u}" class="f-fill2"/>`;
    g += T(160, 12, "4 cm", "middle", 11) + T(160 + 2 * u + 6, 18 + 1.5 * u + 4, "3 cm", "start", 11) + T(160, 18 + 1.5 * u + 4, ans === undefined ? "aire réelle ?" : ans, "middle", 12, "f-txt f-accent");
    g += T(160, 140, "plan au 1 : 100", "middle", 11);
    return svg(320, 150, g, "plan d'une pièce");
  };

  // ---------- pente : route vue de profil ----------
  // dh = distance horizontale (m), p = pente juste (en %), q = pente proposée (en %, ou null).
  const ramp = (labs, p, q) => {
    const x0 = 20, y0 = 96, w = 240, k = 3; // hauteurs exagérées × 3 pour qu'on voie la montée
    const yt = y0 - Math.min(84, (w * p * k) / 100);
    let g = `<polygon points="${x0},${y0} ${x0 + w},${y0} ${x0 + w},${yt}" class="f-shape"/>`;
    if (q !== null && isFinite(q) && q >= 0) { const yq = y0 - Math.min(90, (w * q * k) / 100); g += L(x0, y0, x0 + w, yq, "f-accent", 2.4, true); }
    g += T(x0 + w / 2, y0 + 16, labs.h, "middle", 12) + T(x0 + w + 5, (y0 + yt) / 2 + 4, labs.v, "start", 12, /\?/.test(labs.v) ? "f-txt f-accent" : "f-txt") + T(x0 + w / 2 - 20, (y0 + yt) / 2 - 8, labs.p, "middle", 12, /\?/.test(labs.p) ? "f-txt f-accent" : "f-txt");
    return svg(320, 120, g, "profil d'une route") + `<div class="small muted">Hauteurs exagérées (× 3) pour mieux voir la montée.${q !== null ? " En pointillé : ta proposition." : ""}</div>`;
  };

  // ---------- polyreg : polygone régulier inscrit ----------
  const poly = (n, labC, labI) => {
    const cx = 160, cy = 80, r = 66, P = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    let g = `<polygon points="${P.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" class="f-shape"/>`;
    // triangle au centre OAB sur le côté du bas
    const i0 = Math.floor(n / 2), Q1 = P[i0 - 1 < 0 ? n - 1 : i0 - 1], Q2 = P[i0];
    g += L(cx, cy, Q1[0], Q1[1], "f-line", 1.2) + L(cx, cy, Q2[0], Q2[1], "f-line", 1.2) + `<circle cx="${cx}" cy="${cy}" r="3" class="f-dot"/>` + T(cx - 8, cy - 6, "O", "end", 11);
    if (labC) { const m = [(Q1[0] + Q2[0]) / 2, (Q1[1] + Q2[1]) / 2]; g += T(cx + (m[0] - cx) * 0.42, cy + (m[1] - cy) * 0.42 + 4, labC, "middle", 12, /\?/.test(labC) ? "f-txt f-accent" : "f-txt f-blue"); }
    if (labI) { // angle intérieur marqué par un arc, au sommet opposé au triangle du centre
      const j = (i0 + Math.ceil(n / 2)) % n, V = P[j], U = P[(j + n - 1) % n], Z = P[(j + 1) % n], rr = 16;
      const e1 = [V[0] + ((U[0] - V[0]) * rr) / Math.hypot(U[0] - V[0], U[1] - V[1]), V[1] + ((U[1] - V[1]) * rr) / Math.hypot(U[0] - V[0], U[1] - V[1])], e2 = [V[0] + ((Z[0] - V[0]) * rr) / Math.hypot(Z[0] - V[0], Z[1] - V[1]), V[1] + ((Z[1] - V[1]) * rr) / Math.hypot(Z[0] - V[0], Z[1] - V[1])];
      g += `<path d="M${e1[0].toFixed(1)},${e1[1].toFixed(1)} A${rr},${rr} 0 0 1 ${e2[0].toFixed(1)},${e2[1].toFixed(1)}" class="f-accent" fill="none" stroke-width="1.6"/>`;
      g += T(V[0] + (cx - V[0]) * 0.42, V[1] + (cy - V[1]) * 0.42 + 4, labI, "middle", 12, /\?/.test(labI) ? "f-txt f-accent" : "f-txt f-blue");
    }
    return svg(320, 160, g, "polygone régulier à " + n + " côtés");
  };
  const NOMS = { 3: "triangle équilatéral", 4: "carré", 5: "pentagone", 6: "hexagone", 7: "heptagone", 8: "octogone", 9: "ennéagone", 10: "décagone", 12: "dodécagone" };

  // ---------- rotation : drapeau autour de O, puis aiguille d'horloge ----------
  const ROT = (pts, a, cx, cy) => { const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180); return pts.map(([x, y]) => [cx + x * c - y * s, cy - (x * s + y * c)]); };
  const FLAG = [[34, 8], [34, 56], [70, 46], [34, 36]]; // mât et fanion (repère mathématique, O à l'origine)
  const flag = (a, cls, dash) => { const p = ROT(FLAG, a, 160, 84); return `<polygon points="${p.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")}" class="${cls}"${dash ? ' stroke-dasharray="5 4" fill="none" stroke="var(--margin)" stroke-width="1.6"' : ' stroke="var(--ink)" stroke-width="1.4"'}/>`; };
  const rot = (x, s) => {
    const sens = '<div class="small muted">α &gt; 0 : sens inverse des aiguilles d\'une montre ↺ · α &lt; 0 : sens des aiguilles ↻</div>';
    const ang = (x > 0 ? "+" : "") + nb(x) + "°";
    if (s < 2) {
      const tgt = s === 0 ? 90 : -60, P0 = ROT([FLAG[1]], 0, 160, 84)[0], Px = ROT([FLAG[1]], x, 160, 84)[0];
      let g = `<circle cx="160" cy="84" r="58" fill="none" stroke="var(--line)" stroke-dasharray="2 4"/>` + flag(0, "f-soft") + flag(tgt, "", true) + flag(x, "f-fill2");
      g += L(160, 84, P0[0], P0[1], "f-line", 0.8, true) + L(160, 84, Px[0], Px[1], "f-blue", 1.2) + `<circle cx="160" cy="84" r="3.5" class="f-dot"/>` + T(150, 100, "O", "end", 12);
      const note = s === 1 && Math.abs(x - 300) < 1e-9 ? "<br>Même position que le pointillé, mais en tournant dans l'autre sens : cherche l'angle négatif." : "";
      return svg(320, 168, g, "drapeau tourné de " + ang) + plain("Rotation de centre O, d'angle α = <b>" + ang + "</b>" + note) + sens;
    }
    // horloge : la grande aiguille part du 12 ; cible : le 4
    let g = `<circle cx="160" cy="84" r="70" class="f-soft" stroke="var(--ink)" stroke-width="1.4"/>`;
    for (let h = 1; h <= 12; h++) { const a = (90 - 30 * h) * Math.PI / 180; g += L(160 + 62 * Math.cos(a), 84 - 62 * Math.sin(a), 160 + 70 * Math.cos(a), 84 - 70 * Math.sin(a), "f-line", 1.2) + T(160 + 52 * Math.cos(a), 84 - 52 * Math.sin(a) + 4, h, "middle", 10); }
    const hand = (a, cls, dash) => { const t = ((90 + a) * Math.PI) / 180; return L(160, 84, 160 + 48 * Math.cos(t), 84 - 48 * Math.sin(t), cls, dash ? 1.6 : 3, dash); };
    g += hand(-120, "f-accent", true) + hand(x, "f-line") + `<circle cx="160" cy="84" r="4" class="f-dot"/>`;
    return svg(320, 168, g, "horloge, aiguille tournée de " + ang) + plain("La grande aiguille a tourné de α = <b>" + ang + "</b>") + sens;
  };

  Object.assign(ACTIVE, {
    eqverif: {
      predict: { q: "Le nombre 3 est-il solution de l'équation 4x − 5 = x + 4 ?", choices: ["Oui", "Non"], good: 0, why: "On remplace x par 3 dans chaque membre, séparément : à gauche 4 · 3 − 5 = 7, à droite 3 + 4 = 7. Les deux membres sont égaux : 3 est solution." },
      defis: ["Teste des valeurs de x jusqu'à équilibrer la balance 2x + 5 = 17.", "Équilibre 5x + 7 = 2x − 2 : cette fois, les deux plateaux changent.", "x² + 6 = 5x a deux solutions : trouve l'une d'elles."],
      play: hunt({ label: "x", start: 1, min: -10, max: 10,
        show: (x, s) => balance(x, s),
        wins: [W(6, "x = 6 : 2 · 6 + 5 = 17. Les deux membres sont égaux : 6 est solution."), W(-3, "x = −3 : à gauche 5 · (−3) + 7 = −8, à droite 2 · (−3) − 2 = −8. Une solution peut être négative."),
          (x) => (x === 2 || x === 3 ? "x = " + x + " : " + x + "² + 6 = " + (x * x + 6) + " et 5 · " + x + " = " + 5 * x + ". L'autre solution est " + (5 - x) + " (" + (5 - x) + "² + 6 = " + ((5 - x) ** 2 + 6) + " = 5 · " + (5 - x) + ")." : "")] }),
    },
    echelle: {
      predict: { q: "Sur une carte au 1 : 25'000, deux points sont à 4 cm l'un de l'autre. En vrai, ils sont à…", choices: ["1 km", "100 m", "10 km"], good: 0, why: "1 cm sur la carte = 25'000 cm en vrai. 4 · 25'000 = 100'000 cm = 1'000 m = 1 km. Le piège, c'est la conversion des unités." },
      defis: ["Sur ce plan au 1 : 200, le mur du haut mesure 7 cm. Sa longueur réelle, en m ?", "Le village et la ferme sont à 3 km l'un de l'autre. Distance sur la carte au 1 : 25'000, en cm ?", "Sur ce plan au 1 : 100, la pièce mesure 4 cm sur 3 cm. Son aire réelle, en m² ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => plan(s),
        show: (x, s) => [
          () => plan(0, nb(x) + " m") + plain("Tu proposes " + nb(x) + " m = " + mil(x * 100) + " cm. Sur le plan : " + mil(x * 100) + " ÷ 200 = <b>" + nb(x / 2) + " cm</b> (il faut 7 cm)."),
          () => plan(1, nb(x) + " cm") + plain("Tu proposes " + nb(x) + " cm sur la carte : en vrai " + nb(x) + " · 25'000 = " + mil(x * 25000) + " cm = <b>" + nb(x / 4) + " km</b> (il faut 3 km)."),
          () => plan(2, nb(x) + " m²") + plain("Tu proposes <b>" + nb(x) + " m²</b>." + (Math.abs(x - 0.12) < 1e-9 || Math.abs(x - 1200) < 1e-9 ? " Attention : 12 cm² × 100 ne suffit pas. Convertis d'abord chaque côté en vrai, puis calcule l'aire." : " Convertis chaque côté en vrai (en m), puis calcule l'aire.")),
        ][s](),
        wins: [W(14, "7 · 200 = 1'400 cm = 14 m."), W(12, "3 km = 300'000 cm ; 300'000 ÷ 25'000 = 12 cm."), W(12, "En vrai : 4 m sur 3 m, donc 12 m². Sur le plan, 12 cm² : les longueurs sont × 100, l'aire est × 100² = 10'000 (120'000 cm² = 12 m²).")] }),
    },
    pente: {
      predict: { q: "Un panneau indique une pente de 100 %. La route est…", choices: ["verticale", "inclinée à 45°", "impossible à construire"], good: 1, why: "100 % : on monte de 100 m pour 100 m à l'horizontale. Dénivelé = distance horizontale : c'est la diagonale d'un carré, un angle de 45°." },
      defis: ["La route monte de 18 m pour 300 m à l'horizontale. Sa pente, en % ?", "Une route a une pente de 12 %. Sur 250 m à l'horizontale, de combien de mètres monte-t-elle ?", "Une rampe d'accès a une pente de 6 % et monte de 0,9 m. Sa longueur horizontale, en m ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => ramp([{ h: "300 m", v: "18 m", p: "pente ?" }, { h: "250 m", v: "? m", p: "12 %" }, { h: "? m", v: "0,9 m", p: "6 %" }][s], [6, 12, 6][s], null),
        show: (x, s) => [
          () => ramp({ h: "300 m", v: "18 m", p: nb(x) + " %" }, 6, x) + plain("Avec " + nb(x) + " %, on monterait de " + nb(x / 100) + " · 300 = <b>" + nb(3 * x) + " m</b> (la route monte de 18 m)."),
          () => ramp({ h: "250 m", v: nb(x) + " m", p: "12 %" }, 12, (x / 250) * 100) + plain("Ta montée : " + nb(x) + " ÷ 250 = " + nb(x / 250) + " = <b>" + nb((x / 250) * 100) + " %</b> (il faut 12 %)."),
          () => x > 0 ? ramp({ h: nb(x) + " m", v: "0,9 m", p: "6 %" }, 6, 90 / x) + plain("Ta rampe : 0,9 ÷ " + nb(x) + " = " + nb(0.9 / x) + " = <b>" + nb(90 / x) + " %</b> (il faut 6 %).") : plain("Une longueur est positive."),
        ][s](),
        wins: [W(6, "18 ÷ 300 = 0,06 = 6 % : 6 m de montée pour 100 m à l'horizontale."), W(30, "12 % = 0,12 ; 0,12 · 250 = 30 m."), W(15, "0,9 ÷ 0,06 = 15 m : une pente faible demande une longue rampe.")] }),
    },
    polyreg: {
      predict: { q: "Chaque angle d'un hexagone régulier mesure…", choices: ["60°", "120°", "135°"], good: 1, why: "Du centre, l'hexagone se découpe en 6 triangles équilatéraux (angles de 60°). À chaque sommet, deux angles de 60° se rejoignent : 120°." },
      defis: ["Pentagone régulier : mesure de l'angle au centre ?", "Même pentagone : mesure de chaque angle intérieur ?", "Chaque angle intérieur d'un polygone régulier mesure 140°. Combien a-t-il de côtés ?"],
      play: hunt({ ask: true, label: "Ta réponse",
        blank: (s) => s === 0 ? poly(5, "?", "") : s === 1 ? poly(5, "72°", "?") : plain("Angle intérieur : 140°. Nombre de côtés ?"),
        show: (x, s) => [
          () => poly(5, nb(x) + "°", "") + plain("5 angles au centre font un tour : 5 · " + nb(x) + "° = <b>" + nb(5 * x) + "°</b> (un tour : 360°)."),
          () => poly(5, "72°", nb(x) + "°") + plain("Le triangle au centre est isocèle : ses angles à la base valent la moitié de l'angle intérieur. 72° + " + nb(x / 2) + "° + " + nb(x / 2) + "° = <b>" + nb(72 + x) + "°</b> (il faut 180°)."),
          () => Number.isInteger(x) && x >= 3 && x <= 24 ? poly(x, nb(360 / x) + "°", nb(180 - 360 / x) + "°") + plain((NOMS[x] ? NOMS[x] + " : " : "") + x + " côtés → angle au centre 360° ÷ " + x + " = " + nb(+(360 / x).toFixed(2)) + "°, angle intérieur <b>" + nb(+(180 - 360 / x).toFixed(2)) + "°</b> (il faut 140°).") : plain("Un polygone a un nombre entier de côtés, au moins 3."),
        ][s](),
        wins: [W(72, "360° ÷ 5 = 72°."), W(108, "180° − 72° = 108° : les deux angles à la base (54° chacun) forment l'angle intérieur."), W(9, "Angle au centre : 180° − 140° = 40°, et 360° ÷ 40° = 9 côtés (un ennéagone).")] }),
    },
    rotation: {
      predict: { q: "On fait tourner une figure autour d'un point. Son image est…", choices: ["plus petite", "identique : même forme, même taille", "retournée, comme dans un miroir"], good: 1, why: "Une rotation conserve les longueurs et les angles, et ne retourne pas la figure (contrairement à une symétrie axiale) : on la fait seulement tourner." },
      defis: ["Fais tourner le drapeau autour de O pour le poser sur le drapeau pointillé.", "Pose-le sur le nouveau pointillé en tournant dans le sens des aiguilles d'une montre.", "La grande aiguille va du 12 au 4. Fais-la tourner : quel angle ?"],
      play: hunt({ label: "Angle α (°)", start: 0, min: -330, max: 330, step: 30,
        show: (x, s) => rot(x, s),
        wins: [W(90, "α = +90° : un quart de tour dans le sens inverse des aiguilles d'une montre. Le drapeau garde sa forme et sa taille."), W(-60, "α = −60° : on tourne dans le sens des aiguilles d'une montre, l'angle est négatif."), W(-120, "D'un nombre au suivant : 360° ÷ 12 = 30°. Du 12 au 4 : 4 · 30° = 120°, dans le sens des aiguilles, donc α = −120°.")] }),
    },
  });
})();

