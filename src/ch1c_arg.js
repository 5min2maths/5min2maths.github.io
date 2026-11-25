// 1re du Collège de Genève · chapitre Sésamath Ma1 Ch3 « Argumenter » (24.11, agent niv1c ; audit de niveau dans
// tools/niveau_1c.md). Avant : le chapitre ne contenait que divcrit et tradexpr (niveau 9e–10e), signalé par l'enseignant.
// Quatre notions de 1re : tradalg (traduire en langage algébrique : pair, impair, multiple, consécutifs, chiffre des unités,
// reste), contrex (conjecture et contre-exemple), demoalg (démontrer en algèbre : démonstration directe, critères, absurde),
// implication (implication, réciproque, contraposée, équivalence, négation). Programme : programme du Collège 2021 (1re,
// « s'initier à l'argumentation logique… distinguer hypothèse et conclusion ») ; Sésamath Ma1 Ch3 th. 1–6 ; cours 1MA2 (logique).
// Réponses vérifiables : nombre, expression en n, k…, ensemble de numéros (« 1 ; 3 », « aucune ») ou intervalle ; jamais de mots.
// Standard : 3 niveaux, au moins 3 formes par niveau, pas à pas, pièges, ctx, leçon, indice, 3 compétences, problème (niveau 4).
(function () {
  if (typeof NOTIONS === "undefined" || typeof GEN === "undefined") return;
  // ---------- outils ----------
  const pk = (a) => a[Math.floor(R.rand() * a.length)];
  const ri = R.int;
  const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const g2 = (a, b) => (b ? g2(b, a % b) : Math.abs(a));
  const lcm = (a, b) => (a * b) / g2(a, b);
  const isP = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const smallestFactor = (n) => { for (let i = 2; i * i <= n; i++) if (n % i === 0) return i; return n; };
  const nums = (s) => (s.length ? s.join(" ; ") : "aucune");
  /* une ligne numérotée par énoncé : (1) …, (2) … */
  const liste = (items) => items.map((t, i) => "<br>(" + (i + 1) + ") " + t).join("");
  const IMPL = "\\Rightarrow";
  // ---------- constructeurs (comme ch3c_ana.js) ----------
  const keepT = (spec, traps) => { const seen = new Set(); return (traps || []).filter((tr) => {
    if (!tr) return false;
    if (tr.e) { if (spec.kind !== "expr") return false; try { if (Expr.equivalent(Expr.parse(tr.e), Expr.parse(spec.expr))) return false; } catch (e) { return false; } if (seen.has(tr.e)) return false; seen.add(tr.e); return true; }
    if (tr.s) { if (spec.kind !== "set" || !tr.s.every(isFinite)) return false; const k = tr.s.slice().sort((a, b) => a - b).join(";"); if (seen.has(k) || k === spec.values.join(";")) return false; seen.add(k); return true; }
    if (tr.none) { if (spec.kind !== "set" || !spec.values.length || seen.has("none")) return false; seen.add("none"); return true; }
    if (tr.spec) { const c = SolSet.show(tr.spec.ivs, false); if (spec.kind !== "solset" || seen.has(c) || checkAnswer(spec, c).status === "correct" || checkAnswer(tr.spec, c).status !== "correct") return false; seen.add(c); return true; }
    if (spec.kind !== "value" || !isFinite(tr.v) || Math.abs(tr.v - spec.value) < 1e-9 || seen.has(tr.v)) return false; seen.add(tr.v); return true; }); };
  const mk = (q, spec, sol, o) => { const x = { q, spec, sol, guide: o.guide, ctx: o.ctx, traps: keepT(spec, o.traps) }; if (o.canon) x.canon = o.canon; if (o.shownOk) x.shownOk = true; return x; };
  const QN = (q, value, sol, o) => mk(q, { kind: "value", value }, sol, o);
  const QX = (q, expr, sol, o) => mk(q, { kind: "expr", expr }, sol, Object.assign({ canon: expr }, o));
  const QSet = (q, vals, sol, o) => mk(q, { kind: "set", values: [...new Set(vals)].sort((a, b) => a - b) }, sol, Object.assign({ canon: nums([...new Set(vals)].sort((a, b) => a - b)) }, o));
  const QS = (q, ivs, sol, o) => mk(q, solsetSpec(ivs), sol, Object.assign({ canon: SolSet.show(ivs, false) }, o));
  const GX = (ask, expr, sol) => ({ ask, spec: { kind: "expr", expr }, sol });
  const GSet = (ask, vals, sol) => ({ ask, spec: { kind: "set", values: [...new Set(vals)].sort((a, b) => a - b) }, sol });
  const GSS = (ask, ivs, sol) => ({ ask, spec: solsetSpec(ivs), sol });
  const TR = TRAP;
  const TX = (e, m) => ({ e, m });
  const TSt = (s, m) => ({ s, m });
  const TNone = (m) => ({ none: true, m });
  const TS = (ivs, m) => ({ spec: solsetSpec(ivs), m });
  const P = (q, parts, hints, sol) => ({ q, parts: parts.map(([label, value]) => ({ label, spec: { kind: "value", value } })), hints, sol });
  const ASK_NUM = " Écris leurs numéros séparés par « ; » (« aucune » s'il n'y en a pas).";
  const INF = Infinity;

  // ======================= tradalg : traduire en langage algébrique (Sésamath Ma1 Ch3, th. 1–2) =======================
  const TA = {
    1: [
      /* somme de k entiers consécutifs, repérés par le plus petit, le plus grand ou celui du milieu */
      () => { const k = pk([3, 4, 5]), ref = pk(["petit", "grand", "milieu"]); if (ref === "milieu" && k === 4) return null;
        const first = ref === "petit" ? 0 : ref === "grand" ? -(k - 1) : -(k - 1) / 2, c = k * first + (k * (k - 1)) / 2, ex = (c ? k + "*n" + (c > 0 ? "+" : "") + c : k + "*n"), exNeg = k + "*n" + (c > 0 ? "-" + c : "+" + -c);
        const tex = (c ? k + "n " + (c > 0 ? "+ " + c : "- " + -c) : k + "n");
        const tl = [...Array(k).keys()].map((i) => { const d = first + i; return d === 0 ? "n" : "(n " + (d > 0 ? "+ " + d : "- " + -d) + ")"; });
        const terms = (k >= 5 ? [tl[0], tl[1], "\\ldots", tl[k - 1]] : tl).join(" + "); /* 25.11 : 5 termes trop larges sur téléphone (341 px) : somme abrégée */
        return QX("Soit " + M("n") + " un entier. On additionne " + k + " entiers consécutifs dont le " + (ref === "milieu" ? "nombre du milieu" : "plus " + ref) + " est " + M("n") + ". Écris cette somme sous forme réduite (en fonction de " + M("n") + ").", ex,
          M(terms + " = " + tex) + ".",
          { ctx: "consecutifs-" + ref, guide: [GX("Écris les " + k + " nombres et additionne-les (sans réduire).", ex, M(terms) + "."), GX("Réduis.", ex, M(tex) + ".")],
            traps: [TX(k + "*n", "Il reste un terme constant : les écarts à n s'additionnent."), TX(k + "*n+" + (k * (k + 1)) / 2, "Le premier nombre est n + 0, pas n + 1."), c ? TX(exNeg, "Vérifie les signes : le " + (ref === "grand" ? "plus grand est n, les autres sont n − 1, n − 2…" : "plus petit est n, les autres sont n + 1, n + 2…")) : null] }); },
      /* chiffre des unités d'un multiple de n = 10k + c */
      () => { const c = ri(2, 9), a = pk([3, 4, 6, 7, 8, 9]), u = (a * c) % 10; if (u <= 1) return null;
        return QN("Un entier " + M("n") + " se termine par " + M(c) + " : on peut l'écrire " + M("n = 10k + " + c) + " (avec " + M("k") + " entier naturel). Par quel chiffre se termine " + M(a + "n") + " ?", u,
          M(a + "n = " + a + "(10k + " + c + ") = " + 10 * a + "k + " + a * c + " = 10(" + a + "k + " + Math.floor((a * c) / 10) + ") + " + u) + " : " + M(a + "n") + " se termine par " + M(u) + ".",
          { ctx: "unites", guide: [GS("Développe " + M(a + "(10k + " + c + ")") + " : quel est le terme constant ?", a * c, M(10 * a + "k + " + a * c) + "."), GS(M(10 * a + "k") + " se termine par 0. Chiffre des unités de " + M(a + "n") + " ?", u, M(a * c) + " se termine par " + M(u) + ".")],
            traps: [TR(c, "Le chiffre des unités change quand on multiplie : calcule " + a + " · " + c + "."), TR(a * c, "On demande un chiffre : le chiffre des unités de " + a * c + "."), TR((a + c) % 10, "On multiplie par " + a + ", on n'additionne pas.")] }); },
      /* écrire avec 2k ou 2k + 1 */
      () => { const v = pk([
          ["le carré d'un nombre pair", "(2k)^2", "4*k^2", "2*k^2", "(2k)^2 = 4k^2", "carre-pair"],
          ["le double d'un nombre impair", "2(2k + 1)", "4*k+2", "4*k+1", "2(2k + 1) = 4k + 2", "double-impair"],
          ["la somme d'un nombre pair et du nombre impair qui le suit", "2k + (2k + 1)", "4*k+1", "2*k+1", "2k + (2k + 1) = 4k + 1", "pair-impair"],
          ["le produit de deux nombres pairs consécutifs", "2k(2k + 2)", "4*k^2+4*k", "4*k^2+2*k", "2k(2k + 2) = 4k^2 + 4k", "produit-pairs"],
          ["le carré d'un nombre impair", "(2k + 1)^2", "4*k^2+4*k+1", "4*k^2+1", "(2k + 1)^2 = 4k^2 + 4k + 1", "carre-impair"],
          ["la somme de deux nombres impairs consécutifs", "(2k + 1) + (2k + 3)", "4*k+4", "4*k+2", "(2k + 1) + (2k + 3) = 4k + 4", "impairs-consecutifs"]]);
        return QX("Un nombre pair s'écrit " + M("2k") + " et un nombre impair " + M("2k + 1") + " (" + M("k") + " entier). Écris sous forme réduite, en fonction de " + M("k") + " : " + v[0] + ".", v[2], M(v[4]) + ".",
          { ctx: v[5], guide: [GX("Écris l'expression avant de réduire.", v[2], M(v[1]) + "."), GX("Développe et réduis.", v[2], M(v[4]) + ".")],
            traps: [TX(v[3], "Développe soigneusement : chaque terme compte (identité remarquable, distributivité)."), TX("2*k", "Il faut traduire toute la phrase, pas seulement « nombre pair ».")] }); },
      /* reste de la division euclidienne */
      () => { const d = pk([5, 6, 7, 8, 9, 11]), a = d * ri(2, 6), b = ri(d + 2, 6 * d), r = b % d; if (r < 2) return null;
        return QN("Soit " + M("n") + " un entier naturel. Quel est le reste de la division euclidienne de " + M(a + "n + " + b) + " par " + M(d) + " ?", r,
          M(a + "n + " + b + " = " + d + "(" + a / d + "n + " + Math.floor(b / d) + ") + " + r) + " avec " + M("0 \\le " + r + " < " + d) + " : le reste vaut " + M(r) + ".",
          { ctx: "reste", guide: [GS(M(a + "n") + " est un multiple de " + M(d) + ". Reste de " + M(b) + " divisé par " + M(d) + " ?", r, M(b + " = " + d + " \\cdot " + Math.floor(b / d) + " + " + r) + "."), GS("Reste de " + M(a + "n + " + b) + " ?", r, M(r) + ".")],
            traps: [TR(b, "Le reste est plus petit que " + d + " : divise encore " + b + " par " + d + "."), TR(Math.floor(b / d), "C'est le quotient de " + b + " par " + d + ", pas le reste.")] }); },
    ],
    2: [
      /* trois multiples consécutifs */
      () => { const m = pk([7, 11, 13, 17, 19, 23]), k3 = pk([3, 4]), c = (m * k3 * (k3 - 1)) / 2;
        return QX("Soit " + M("k") + " un entier. Écris sous forme réduite la somme de " + k3 + " multiples de " + M(m) + " consécutifs, le premier étant " + M(m + "k") + ".", k3 * m + "*k+" + c,
          M([...Array(k3).keys()].map((i) => (i ? m + "(k + " + i + ")" : m + "k")).filter((t, i) => k3 < 4 || i !== 2).map((t, i) => (k3 >= 4 && i === 2 ? "\\ldots + " + t : t)).join(" + ") + " = " + k3 * m + "k + " + c) + ".", /* 25.11 : 4 termes à deux chiffres abrégés (329 px) */
          { ctx: "multiples-consecutifs", guide: [GS("Le multiple de " + M(m) + " qui suit " + M(m + "k") + " est " + M(m + "k + ?") + ". Que vaut « ? » ?", m, M(m + "(k + 1) = " + m + "k + " + m) + "."), GX("Somme réduite ?", k3 * m + "*k+" + c, M(k3 * m + "k + " + c) + ".")],
            traps: [TX(k3 * m + "*k+" + (k3 * (k3 - 1)) / 2, "Deux multiples de " + m + " consécutifs diffèrent de " + m + ", pas de 1."), TX(m + "*k+" + m * (k3 - 1), "Additionne les " + k3 + " multiples, pas seulement le premier et le dernier.")] }); },
      /* moyenne de nombres consécutifs pairs ou impairs */
      () => { const v = pk([
          ["deux nombres pairs consécutifs", "2n", "2n + 2", "2*n+1", "\\frac{2n + (2n + 2)}{2} = \\frac{4n + 2}{2} = 2n + 1", "4*n+2"],
          ["deux nombres impairs consécutifs", "2n + 1", "2n + 3", "2*n+2", "\\frac{(2n + 1) + (2n + 3)}{2} = \\frac{4n + 4}{2} = 2n + 2", "4*n+4"],
          ["trois nombres impairs consécutifs", "2n + 1", "2n + 5", "2*n+3", "\\frac{(2n + 1) + (2n + 3) + (2n + 5)}{3} = \\frac{6n + 9}{3} = 2n + 3", "6*n+9"],
          ["trois nombres pairs consécutifs", "2n", "2n + 4", "2*n+2", "\\frac{2n + (2n + 2) + (2n + 4)}{3} = \\frac{6n + 6}{3} = 2n + 2", "6*n+6"]]);
        return QX("Soit " + M("n") + " un entier. Exprime sous forme réduite la moyenne de " + v[0] + ", le plus petit étant " + M(v[1]) + ".", v[3], M(v[4]) + ".",
          { ctx: "moyenne-consecutifs", guide: [GX("Somme des nombres, réduite ?", v[5], M(v[4].split(" = ")[1].replace(/\\frac\{(.*)\}\{\d\}/, "$1")) + "."), GX("Divise par le nombre de termes.", v[3], M(v[4].split(" = ").pop()) + ".")],
            traps: [TX(v[5], "Il reste à diviser par le nombre de termes."), TX(v[3] + "+1", "Le milieu de " + v[1] + " et " + v[2] + " : vérifie avec n = 0.")] }); },
      /* différence de carrés de consécutifs */
      () => { const v = pk([
          ["deux entiers consécutifs", "(n + 1)^2 - n^2", "2*n+1", "1", "(n + 1)^2 - n^2 = n^2 + 2n + 1 - n^2 = 2n + 1"],
          ["deux nombres pairs consécutifs", "(2n + 2)^2 - (2n)^2", "8*n+4", "4", "(2n + 2)^2 - (2n)^2 = 4n^2 + 8n + 4 - 4n^2 = 8n + 4"],
          ["deux nombres impairs consécutifs", "(2n + 3)^2 - (2n + 1)^2", "8*n+8", "8", "(2n + 3)^2 - (2n + 1)^2 = 4n^2 + 12n + 9 - (4n^2 + 4n + 1) = 8n + 8"],
          ["deux entiers dont l'un dépasse l'autre de 3", "(n + 3)^2 - n^2", "6*n+9", "9", "(n + 3)^2 - n^2 = n^2 + 6n + 9 - n^2 = 6n + 9"]]);
        return QX("Soit " + M("n") + " un entier. Écris sous forme réduite la différence des carrés de " + v[0] + " (le grand au carré moins le petit au carré) : " + M(v[1]) + ".", v[2], M(v[4]) + ".",
          { ctx: "diff-carres", guide: [GX("Développe et réduis " + M(v[1]) + ".", v[2], M(v[4]) + ".")],
            traps: [TX(v[3], "(a + b)² ≠ a² + b² : il manque le double produit."), TX("-(" + v[2] + ")", "Le grand au carré moins le petit au carré : attention à l'ordre.")] }); },
      /* nombre qui laisse un reste */
      () => { const d = pk([4, 5, 6, 7, 9]), r = ri(2, d - 1), k0 = ri(3, 12);
        return QN("Un entier naturel laisse un reste " + M(r) + " quand on le divise par " + M(d) + " : il s'écrit " + M(d + "k + " + r) + ". Quel est le reste de la division de son double par " + M(d) + " ?", (2 * r) % d,
          M("2(" + d + "k + " + r + ") = " + 2 * d + "k + " + 2 * r + (2 * r >= d ? " = " + d + "(2k + 1) + " + (2 * r - d) : "")) + " : le reste vaut " + M((2 * r) % d) + ". (Exemple : " + M(d * k0 + r) + " et " + M(2 * (d * k0 + r) + " = " + d + " \\cdot " + Math.floor((2 * (d * k0 + r)) / d) + " + " + (2 * r) % d) + ".)",
          { ctx: "reste-double", guide: [GS("Double de " + M(d + "k + " + r) + " : terme constant ?", 2 * r, M(2 * d + "k + " + 2 * r) + "."), GS("Reste de " + M(2 * r) + " divisé par " + M(d) + " ?", (2 * r) % d, M((2 * r) % d) + ".")],
            traps: [TR(2 * r, (2 * r >= d ? "Un reste est plus petit que " + d + " : " + 2 * r + " contient encore " + d + "." : "Vérifie avec un exemple.")), TR(r, "Le double d'un nombre n'a pas forcément le même reste.")].filter((t) => t.v !== (2 * r) % d), shownOk: true }); },
    ],
    3: [
      /* trouver des impairs consécutifs de somme donnée */
      () => { const k = pk([3, 5]), n = ri(4, 30), first = 2 * n + 1, S = k * first + k * (k - 1);
        /* 25.11 (437 px sur téléphone) : 5 termes → somme abrégée. */
        return QN("La somme de " + k + " nombres impairs consécutifs vaut " + M(S) + ". Quel est le plus petit de ces nombres ? (Pose " + M("2n + 1") + " pour le plus petit.)", first,
          M([...Array(k).keys()].map((i) => "(2n + " + (2 * i + 1) + ")").filter((t, i) => k < 5 || i < 2 || i === k - 1).map((t, i) => (k >= 5 && i === 2 ? "\\ldots + " + t : t)).join(" + ") + " = " + 2 * k + "n + " + k * k + " = " + S) + " donne " + M("n = " + n) + " ; le plus petit vaut " + M(first) + ".",
          { ctx: "impairs-somme", guide: [GS("Somme réduite des " + k + " nombres : " + M(2 * k + "n + \\ldots") + ". Quel est le terme constant ?", k * k, M(2 * k + "n + " + k * k) + "."), GS("Résous " + M(2 * k + "n + " + k * k + " = " + S) + " : " + M("n") + " = ?", n, M("n = " + n) + "."), GS("Le plus petit nombre " + M("2n + 1") + " ?", first, M(first) + ".")],
            traps: [TR(n, "n n'est pas le nombre cherché : le plus petit impair est 2n + 1."), TR(S / k, "C'est le nombre du milieu (la moyenne), pas le plus petit."), TR(first + 2 * (k - 1), "C'est le plus grand.")] }); },
      /* nombres de trois chiffres multiples de 5 de somme des chiffres donnée (Sésamath ex. 3) */
      () => { const s = ri(12, 22), L = []; for (let x = 100; x <= 995; x += 5) if (String(x).split("").reduce((a, c) => a + +c, 0) === s) L.push(x); if (L.length < 3) return null;
        return QN("Combien de nombres entiers de trois chiffres sont des multiples de 5 et ont une somme des chiffres égale à " + M(s) + " ?", L.length,
          "Un multiple de 5 s'écrit " + M("100a + 10b + c") + " avec " + M("c = 0") + " ou " + M("c = 5") + ". On compte les couples (a ; b) avec " + M("a + b = " + s) + " ou " + M("a + b = " + (s - 5)) + " (a de 1 à 9, b de 0 à 9) : " + L.join(", ") + ", soit " + M(L.length) + " nombres.",
          { ctx: "trois-chiffres", guide: [GS("Chiffre des unités 0 : combien de couples " + M("(a ; b)") + " avec " + M("a + b = " + s) + " ?", L.filter((x) => x % 10 === 0).length, L.filter((x) => x % 10 === 0).join(", ") || "aucun"), GS("Chiffre des unités 5 : combien avec " + M("a + b = " + (s - 5)) + " ?", L.filter((x) => x % 10 === 5).length, L.filter((x) => x % 10 === 5).join(", ") || "aucun"), GS("Total ?", L.length, M(L.length) + ".")],
            traps: [TR(L.filter((x) => x % 10 === 0).length, "N'oublie pas les nombres qui se terminent par 5."), TR(L.filter((x) => x % 10 === 5).length, "N'oublie pas les nombres qui se terminent par 0.")] }); },
      /* quotient = reste (Sésamath ex. 3b) */
      () => { const d = pk([5, 6, 7, 8, 9, 12]), big = R.rand() < 0.5;
        return QN("On cherche les entiers naturels " + M("n > 0") + " dont le quotient et le reste dans la division euclidienne par " + M(d) + " sont égaux. " + (big ? "Quel est le plus grand d'entre eux ?" : "Combien y en a-t-il ?"), big ? d * d - 1 : d - 1,
          M("n = " + d + "q + q = " + (d + 1) + "q") + " avec un reste " + M("q < " + d) + " et " + M("q \\ge 1") + " : " + M("q") + " va de 1 à " + M(d - 1) + ". Il y a " + M(d - 1) + " nombres, le plus grand est " + M((d + 1) * (d - 1) + " = " + (d * d - 1)) + ".",
          { ctx: big ? "quotient-reste-max" : "quotient-reste-nb", guide: [GS("Si le quotient et le reste valent " + M("q") + ", alors " + M("n = " + d + "q + q = c \\cdot q") + ". Que vaut " + M("c") + " ?", d + 1, M("n = " + d + "q + q = " + (d + 1) + "q") + "."), GS("Plus grande valeur possible de " + M("q") + " (un reste est plus petit que " + M(d) + ") ?", d - 1, M(d - 1) + "."), GS(big ? "Plus grand " + M("n") + " ?" : "Combien de valeurs de " + M("q") + " (de 1 à " + (d - 1) + ") ?", big ? d * d - 1 : d - 1, M(big ? d * d - 1 : d - 1) + ".")],
            traps: big ? [TR(d * d, "Le reste est au plus " + (d - 1) + ", pas " + d + "."), TR(d * (d - 1), "n = " + d + "q + q : n'oublie pas le reste.")] : [TR(d, "Le reste est strictement plus petit que " + d + " et q ≥ 1 : de 1 à " + (d - 1) + "."), TR(d + 1, "Compte les valeurs de q, pas le facteur " + (d + 1) + ".")] }); },
      /* nombre renversé */
      () => { const v = pk([
          ["deux chiffres " + M("\\overline{ab} = 10a + b") + " : on ajoute le nombre renversé " + M("\\overline{ba}"), 11, "(10a + b) + (10b + a) = 11a + 11b = 11(a + b)", 2, "somme-renverse"],
          ["deux chiffres " + M("\\overline{ab} = 10a + b") + " (avec " + M("a > b") + ") : on lui soustrait le nombre renversé " + M("\\overline{ba}"), 9, "(10a + b) - (10b + a) = 9a - 9b = 9(a - b)", 3, "diff-renverse2"],
          ["trois chiffres " + M("\\overline{abc} = 100a + 10b + c") + " (avec " + M("a > c") + ") : on lui soustrait le nombre renversé " + M("\\overline{cba}"), 99, "(100a + 10b + c) - (100c + 10b + a) = 99a - 99c = 99(a - c)", 9, "diff-renverse3"]]);
        return QN("On prend un nombre de " + v[0] + ". Quel est le plus grand entier qui divise toujours le résultat, quels que soient les chiffres ?", v[1],
          M(v[2]) + ". Le facteur " + M("a " + (v[1] === 11 ? "+ b" : "- " + (v[1] === 99 ? "c" : "b"))) + " change d'un nombre à l'autre (il peut valoir 1) : le plus grand diviseur toujours présent est " + M(v[1]) + ".",
          { ctx: v[4], guide: [GS("Calcule le résultat et mets en évidence : quel nombre apparaît en facteur ?", v[1], M(v[2]) + "."), GS("Le plus grand diviseur commun à tous les résultats ?", v[1], M(v[1]) + ".")],
            traps: [TR(v[3], "C'est un diviseur, mais il y en a un plus grand : mets en évidence."), TR(v[1] === 11 ? 22 : v[1] * 2, "Le facteur restant peut valoir 1 (ou être impair) : ce nombre ne divise pas toujours.")] }); },
    ],
  };

  // ======================= contrex : conjecture et contre-exemple (th. 3–5) =======================
  const PRIMEF = [
    { t: (p) => "n^2 + n + " + p, f: (p) => (n) => n * n + n + p, ps: [5, 11, 17, 41], from: 0 },
    { t: () => "2n + 1", f: () => (n) => 2 * n + 1, ps: [0], from: 1 },
    { t: () => "n^2 + 1", f: () => (n) => n * n + 1, ps: [0], from: 1 },
    { t: () => "6n + 5", f: () => (n) => 6 * n + 5, ps: [0], from: 0 },
    { t: (p) => "n^2 - n + " + p, f: (p) => (n) => n * n - n + p, ps: [11, 17], from: 1 },
    { t: () => "2^n + 1", f: () => (n) => 2 ** n + 1, ps: [0], from: 1 },
  ];
  const STATS = [ /* [énoncé, vrai ?, justification ou contre-exemple] */
    ["la somme de trois entiers consécutifs est un multiple de 3", true, "n + (n + 1) + (n + 2) = 3(n + 1)"],
    ["la somme de cinq entiers consécutifs est un multiple de 5", true, "5n + 10 = 5(n + 2)"],
    ["le produit de deux entiers consécutifs est pair", true, "l'un des deux est pair"],
    ["le produit de trois entiers consécutifs est un multiple de 6", true, "un des trois est pair, un est multiple de 3"],
    ["le carré d'un nombre pair est un multiple de 4", true, "(2k)² = 4k²"],
    ["la somme de deux nombres impairs consécutifs est un multiple de 4", true, "(2k + 1) + (2k + 3) = 4(k + 1)"],
    ["la différence des carrés de deux impairs consécutifs est un multiple de 8", true, "(2k + 3)² − (2k + 1)² = 8(k + 1)"],
    ["(2n + 1)² − 1 est un multiple de 8", true, "4n(n + 1), et n(n + 1) est pair"],
    ["le produit de deux nombres impairs est impair", true, "(2k + 1)(2m + 1) = 2(2km + k + m) + 1"],
    ["la somme de quatre entiers consécutifs est un multiple de 4", false, "1 + 2 + 3 + 4 = 10"],
    ["n² + 1 est impair", false, "n = 1 : 1 + 1 = 2"],
    ["n + 5 se termine par 5", false, "n = 1 : 6"],
    ["6n + 3 est un nombre premier", false, "n = 1 : 9"],
    ["5n + 2 est un multiple de 3", false, "n = 0 : 2"],
    ["un multiple de 9 et de 12 est un multiple de 108", false, "36"],
    ["la somme d'un nombre pair et d'un nombre premier impair est un nombre premier", false, "4 + 5 = 9"],
    ["2n + 3 est un multiple de 3", false, "n = 1 : 5"],
    ["tout nombre pair s'écrit 4k (k entier)", false, "6"],
    ["n² − n est impair", false, "n = 2 : 2"],
  ];
  const PRIMEP = [ /* « si p est premier, alors f(p) est premier » */
    ["2p + 1", (p) => 2 * p + 1], ["2p - 1", (p) => 2 * p - 1], ["2p + 3", (p) => 2 * p + 3], ["6p + 1", (p) => 6 * p + 1], ["p^2 + 2", (p) => p * p + 2], ["4p + 3", (p) => 4 * p + 3], ["4p + 1", (p) => 4 * p + 1],
  ];
  const firstFail = (f, from) => { for (let n = from; n < 200; n++) if (!isP(f(n))) return n; return null; };
  const CE = {
    1: [
      /* conjecture « … est premier pour tout n » : plus petit contre-exemple */
      () => { const F = pk(PRIMEF), p = pk(F.ps), f = F.f(p), n = firstFail(f, F.from); if (n === null || n < 2) return null; const v = f(n), sf = smallestFactor(v);
        return QN("Conjecture : « pour tout entier " + M("n \\ge " + F.from) + ", le nombre " + M(F.t(p)) + " est premier ». Quel est le plus petit contre-exemple " + M("n") + " ?", n,
          "On teste " + M("n = " + F.from) + ", " + M(F.from + 1) + "… : " + (n - F.from <= 7 ? [...Array(n - F.from + 1).keys()].map((i) => M(f(F.from + i))).join(", ") : [0, 1, 2].map((i) => M(f(F.from + i))).join(", ") + ", …, " + M(f(n - 1)) + " sont premiers") + ". Pour " + M("n = " + n) + " : " + M(v + " = " + sf + " \\cdot " + v / sf) + " n'est pas premier. Un seul contre-exemple suffit : la conjecture est fausse.",
          { ctx: "premier-" + F.t(1).replace(/[^a-z0-9]/g, ""), guide: [GS("Calcule la valeur pour " + M("n = " + n) + ".", v, M(v) + "."), GS("Est-elle première ? Donne son plus petit diviseur premier.", sf, M(v + " = " + sf + " \\cdot " + v / sf) + "."), GS("Plus petit contre-exemple " + M("n") + " ?", n, M(n) + ".")],
            traps: [TR(v, "On demande la valeur de n, pas celle de l'expression."), TR(n + 1, "Teste aussi les valeurs plus petites."), n - 1 >= F.from ? TR(n - 1, "Pour n = " + (n - 1) + ", on obtient " + f(n - 1) + ", qui est premier.") : null] }); },
      /* lequel est un contre-exemple */
      () => { const v = pk(["sq", "eq", "pair4"]);
        if (v === "pair4") { const ce = 4 * ri(3, 20) + 2; let ns = sh([ce, 4 * ri(3, 20), 4 * ri(3, 20) + pk([1, 3]), 4 * ri(3, 20)]); if (new Set(ns).size < 4) return null;
          return QN("Lequel de ces nombres est un contre-exemple à la conjecture « si un entier est pair, alors il est un multiple de 4 » ? " + ns.map((x) => M(x)).join(" ; "), ce,
            "Un contre-exemple vérifie l'hypothèse (pair) mais pas la conclusion (multiple de 4) : " + M(ce + " = 2 \\cdot " + ce / 2) + " est pair mais " + M(ce + " = 4 \\cdot " + (ce - 2) / 4 + " + 2") + ".",
            { ctx: "lequel-pair4", guide: [GS("Un contre-exemple doit rendre l'hypothèse vraie et la conclusion fausse. Lequel est pair mais pas multiple de 4 ?", ce, M(ce) + ".")], traps: ns.filter((x) => x !== ce).map((x) => TR(x, x % 2 ? x + " est impair : l'hypothèse n'est pas vérifiée, ce n'est pas un contre-exemple." : x + " est un multiple de 4 : la conclusion est vraie.")) }); }
        const c = ri(2, 9), ce = v === "sq" ? -(c + ri(1, 4)) : -c, ns = sh(v === "sq" ? [ce, c + ri(1, 3), c - 1, -(c - 1)] : [ce, c, c + 1, -(c + 2)]); if (new Set(ns).size < 4) return null;
        const conj = v === "sq" ? "si " + M("x^2 > " + c * c) + ", alors " + M("x > " + c) : "si " + M("x^2 = " + c * c) + ", alors " + M("x = " + c);
        return QN("Lequel de ces nombres est un contre-exemple à la conjecture « " + conj + " » ? " + ns.map((x) => M(x)).join(" ; "), ce,
          M("(" + ce + ")^2 = " + ce * ce) + (v === "sq" ? " > " + c * c : "") + " : l'hypothèse est vraie, mais " + M(ce + (v === "sq" ? " < " + c : " \\neq " + c)) + " : la conclusion est fausse.",
          { ctx: "lequel-" + v, guide: [GS("Un contre-exemple rend l'hypothèse vraie et la conclusion fausse. Lequel ?", ce, M(ce) + ".")],
            traps: ns.filter((x) => x !== ce).map((x) => TR(x, (v === "sq" ? x * x > c * c : x * x === c * c) ? "Pour " + x + ", la conclusion est vraie : ce n'est pas un contre-exemple." : "Pour " + x + ", l'hypothèse est fausse : ce n'est pas un contre-exemple.")) }); },
      /* multiple de a et de b ⇒ multiple de ab ? */
      () => { const [a, b] = pk([[4, 6], [6, 9], [6, 8], [9, 12], [10, 15], [4, 10], [12, 18], [8, 12], [6, 15]]), L = lcm(a, b);
        return QN("Conjecture : « si un entier est un multiple de " + M(a) + " et de " + M(b) + ", alors c'est un multiple de " + M(a * b) + " ». Quel est le plus petit contre-exemple strictement positif ?", L,
          "Le plus petit multiple commun de " + M(a) + " et " + M(b) + " est " + M(L) + " (PPMC), et " + M(L) + " n'est pas un multiple de " + M(a * b) + " : la conjecture est fausse (elle n'est vraie que si " + M(a) + " et " + M(b) + " n'ont pas de diviseur commun).",
          { ctx: "multiple-produit", guide: [GS("Plus petit multiple commun de " + M(a) + " et " + M(b) + " ?", L, M(L) + "."), GS("Est-il un multiple de " + M(a * b) + " ? C'est donc le contre-exemple :", L, M(L) + ".")],
            traps: [TR(a * b, a * b + " vérifie la conclusion : ce n'est pas un contre-exemple."), TR(g2(a, b), g2(a, b) + " n'est pas un multiple de " + a + " et de " + b + ".")] }); },
    ],
    2: [
      /* compter les contre-exemples de 1 à N */
      () => { const v = pk([["n^2 + n + 1", (n) => n * n + n + 1], ["n^2 + 2", (n) => n * n + 2], ["2n^2 + 1", (n) => 2 * n * n + 1], ["n^2 + n + 3", (n) => n * n + n + 3], ["3n + 2", (n) => 3 * n + 2]]), N = ri(6, 10), bad = []; for (let n = 1; n <= N; n++) if (!isP(v[1](n))) bad.push(n); if (bad.length < 2 || bad.length === N) return null;
        return QN("Conjecture : « pour tout entier " + M("n \\ge 1") + ", " + M(v[0]) + " est premier ». Combien d'entiers " + M("n") + " de 1 à " + M(N) + " sont des contre-exemples ?", bad.length,
          "Valeurs : " + [...Array(N).keys()].map((i) => M(v[1](i + 1))).join(", ") + ". Non premiers pour " + M("n") + " = " + bad.join(", ") + " : " + M(bad.length) + " contre-exemples.",
          { ctx: "compter-ce-" + v[0].replace(/[^a-z0-9]/g, ""), guide: [GS("Plus petit contre-exemple ?", bad[0], M(v[1](bad[0]) + " = " + smallestFactor(v[1](bad[0])) + " \\cdot " + v[1](bad[0]) / smallestFactor(v[1](bad[0])))), GS("Nombre de contre-exemples de 1 à " + M(N) + " ?", bad.length, bad.join(", ") + ".")],
            traps: [TR(N - bad.length, "Tu as compté les valeurs premières : les contre-exemples sont les autres."), TR(bad.length - 1, "Vérifie chaque valeur jusqu'à " + N + "."), TR(bad.length + 1, "Vérifie que chaque nombre est bien composé.")] }); },
      /* lesquelles sont fausses */
      () => { let ch; do ch = sh(STATS).slice(0, 4); while (ch.filter((s) => !s[1]).length < 1 || ch.filter((s) => !s[1]).length > 3); const F = ch.map((s, i) => (s[1] ? 0 : i + 1)).filter((x) => x);
        return QSet("Soit " + M("n") + " un entier naturel. Parmi ces conjectures, lesquelles sont fausses ?" + liste(ch.map((s) => "« " + s[0] + " »")) + "<br>" + ASK_NUM, F,
          ch.map((s, i) => "(" + (i + 1) + ") " + (s[1] ? "vraie : " + s[2] : "<b>fausse</b>, contre-exemple : " + s[2])).join(" ; ") + ".",
          { ctx: "lesquelles-fausses", guide: [GSet("Pour chaque conjecture, cherche un contre-exemple avec de petits nombres. Lesquelles sont fausses ?", F, "Fausses : " + F.join(", ") + ".")],
            traps: [TSt(ch.map((s, i) => (s[1] ? i + 1 : 0)).filter((x) => x), "Ce sont les vraies : on demande les fausses."), F.length > 1 ? TSt([F[0]], "Il y en a d'autres : teste chaque conjecture.") : null, TNone("Une conjecture est fausse dès qu'un seul exemple la contredit : teste de petites valeurs.")] }); },
      /* si p premier, alors f(p) premier */
      () => { const v = pk(PRIMEP); let p = 2; while (p < 200 && (!isP(p) || isP(v[1](p)))) p++; const val = v[1](p), sf = smallestFactor(val);
        return QN("Conjecture : « si " + M("p") + " est un nombre premier, alors " + M(v[0]) + " est aussi un nombre premier ». Quel est le plus petit nombre premier " + M("p") + " qui la contredit ?", p,
          "On teste les nombres premiers dans l'ordre : " + [2, 3, 5, 7, 11, 13, 17, 19, 23].filter((x) => x <= p).map((x) => M("p = " + x) + " donne " + M(v[1](x))).join(", ") + ". " + M(val + " = " + sf + " \\cdot " + val / sf) + " n'est pas premier.",
          { ctx: "si-premier-" + v[0].replace(/[^a-z0-9]/g, ""), guide: [GS("Valeur de " + M(v[0]) + " pour ce " + M("p") + " ?", val, M(val) + "."), GS("Plus petit diviseur premier de " + M(val) + " ?", sf, M(val + " = " + sf + " \\cdot " + val / sf) + "."), GS("Contre-exemple " + M("p") + " ?", p, M(p) + ".")],
            traps: [TR(val, "On demande p, pas la valeur de " + v[0].replace("^2", "²") + "."), TR(p === 2 ? 3 : 2, "Commence par le plus petit nombre premier, 2, et teste-les dans l'ordre."), TR(9, "9 n'est pas premier : p doit vérifier l'hypothèse.")] }); },
    ],
    3: [
      /* existe-t-il des consécutifs de somme S ? */
      () => { const v = pk([
          { k: 3, t: "trois nombres impairs consécutifs", f: (n) => 6 * n + 9, first: (n) => 2 * n + 1, g: "(2n + 1) + (2n + 3) + (2n + 5) = 6n + 9", ok: (S) => S >= 9 && (S - 9) % 6 === 0, sol: (S) => 2 * ((S - 9) / 6) + 1, ex: "6*n+9" },
          { k: 4, t: "quatre entiers consécutifs", f: (n) => 4 * n + 6, first: (n) => n, g: "n + (n + 1) + (n + 2) + (n + 3) = 4n + 6", ok: (S) => S >= 6 && (S - 6) % 4 === 0, sol: (S) => (S - 6) / 4, ex: "4*n+6" },
          { k: 5, t: "cinq nombres pairs consécutifs", f: (n) => 10 * n + 20, first: (n) => 2 * n, g: "2n + (2n + 2) + \\ldots + (2n + 8) = 10n + 20", ok: (S) => S >= 20 && (S - 20) % 10 === 0, sol: (S) => 2 * ((S - 20) / 10), ex: "10*n+20" }]);
        const yes = R.rand() < 0.5, n = ri(5, 40), S = yes ? v.f(n) : v.f(n) + pk([1, 2, 3].filter((d) => !v.ok(v.f(n) + d))); if (!yes && v.ok(S)) return null;
        const ans = v.ok(S) ? [v.sol(S)] : [];
        return QSet("Peut-on trouver " + v.t + " (positifs) dont la somme vaut " + M(S) + " ? Si oui, donne le plus petit ; sinon, écris « aucune ».", ans,
          M(v.g) + ". " + (ans.length ? M(v.ex.replace("*", "").replace("+", " + ") + " = " + S) + " donne un entier : le plus petit vaut " + M(ans[0]) + "." : M(v.ex.replace("*", "").replace("+", " + ") + " = " + S) + " n'a pas de solution entière : c'est impossible."),
          { ctx: "existe-" + v.k, guide: [GX("Somme réduite (le plus petit étant " + (v.k === 4 ? M("n") : v.k === 3 ? M("2n + 1") : M("2n")) + ") ?", v.ex, M(v.g) + "."), GSet("Le plus petit nombre (ou « aucune ») ?", ans, ans.length ? M(ans[0]) + "." : "Impossible.")],
            traps: ans.length ? [TNone("Résous l'équation : elle a une solution entière."), TSt([ans[0] + 2 * (v.k - 1) * (v.k === 4 ? 0.5 : 1)], "C'est le plus grand.")] : [TSt([Math.round(S / v.k)], "La moyenne n'est pas forcément un des nombres : vérifie que n est entier.")] }); },
      /* somme de m consécutifs divisible par m : pour quels m ? */
      () => { const Mx = ri(9, 25), c = Math.floor((Mx - 1) / 2);
        return QN("Conjecture : « la somme de " + M("m") + " entiers consécutifs est toujours un multiple de " + M("m") + " ». Pour combien de valeurs de " + M("m") + " entre 2 et " + M(Mx) + " (comprises) est-elle vraie ?", c,
          M("n + (n + 1) + \\ldots + (n + m - 1) = mn + \\frac{m(m - 1)}{2}") + ". C'est un multiple de " + M("m") + " pour tout " + M("n") + " exactement quand " + M("\\frac{m - 1}{2}") + " est entier, donc quand " + M("m") + " est impair (pour " + M("m") + " pair, " + M("n = 1") + " est un contre-exemple). Valeurs impaires de 3 à " + M(Mx) + " : " + M(c) + ".",
          { ctx: "m-consecutifs", guide: [GS("Somme de 4 entiers consécutifs à partir de 1 : multiple de 4 ?", 10, "1 + 2 + 3 + 4 = 10 : non, m = 4 ne marche pas."), GS("La conjecture est vraie pour les m impairs. Combien de m impairs de 2 à " + Mx + " ?", c, M(c) + ".")],
            traps: [TR(Mx - 1, "Elle est fausse pour les m pairs (contre-exemple : 1 + 2 = 3 pour m = 2)."), TR(c + 1, "m = 1 n'est pas entre 2 et " + Mx + "."), TR(Mx - 1 - c, "Ce sont les m pairs, pour lesquels elle est fausse.")] }); },
      /* ensemble des contre-exemples réels */
      () => { const v = pk(["cx", "x3", "cxx"]), c = ri(2, 9);
        if (v === "x3") return QS("Conjecture : « pour tout réel " + M("x") + ", " + M("x^3 \\ge x^2") + " ». Donne l'ensemble de tous les contre-exemples (intervalles).", [[-INF, false, 0, false], [0, false, 1, false]],
          M("x^3 - x^2 = x^2(x - 1) < 0") + " quand " + M("x < 1") + " et " + M("x \\neq 0") + " : contre-exemples " + M("]-\\infty \\,;\\, 0[ \\cup ]0 \\,;\\, 1[") + ".",
          { ctx: "ce-x3", guide: [GX("Factorise " + M("x^3 - x^2") + ".", "x^2*(x-1)", M("x^2(x - 1)") + "."), GSS("Où ce produit est-il strictement négatif ?", [[-INF, false, 0, false], [0, false, 1, false]], M("x < 1, \\ x \\neq 0") + ".")],
            traps: [TS([[-INF, false, 1, false]], "En x = 0, x³ = x² : ce n'est pas un contre-exemple."), TS([[0, false, 1, false]], "Les nombres négatifs aussi : (−1)³ = −1 < 1.")] });
        if (v === "cx") return QS("Conjecture : « pour tout réel " + M("x") + ", " + M("x^2 \\ge " + c + "x") + " ». Donne l'ensemble de tous les contre-exemples (intervalle).", [[0, false, c, false]],
          M("x^2 - " + c + "x = x(x - " + c + ") < 0") + " exactement pour " + M("0 < x < " + c) + " : contre-exemples " + M("]0 \\,;\\, " + c + "[") + ".",
          { ctx: "ce-cx", guide: [GX("Factorise " + M("x^2 - " + c + "x") + ".", "x*(x-" + c + ")", M("x(x - " + c + ")") + "."), GSS("Où est-il strictement négatif ?", [[0, false, c, false]], M("]0 \\,;\\, " + c + "[") + ".")],
            traps: [TS([[0, true, c, true]], "En 0 et en " + c + ", il y a égalité : x² ≥ " + c + "x est vrai."), TS([[-INF, false, 0, false], [c, false, INF, false]], "Ce sont les x pour lesquels la conjecture est vraie (strictement).")] });
        return QS("Conjecture : « pour tout réel " + M("x") + ", " + M(c + "x \\ge x^2") + " ». Donne l'ensemble de tous les contre-exemples (intervalles).", [[-INF, false, 0, false], [c, false, INF, false]],
          M(c + "x - x^2 = x(" + c + " - x) < 0") + " pour " + M("x < 0") + " ou " + M("x > " + c) + " : contre-exemples " + M("]-\\infty \\,;\\, 0[ \\cup ]" + c + " \\,;\\, +\\infty[") + ".",
          { ctx: "ce-cxx", guide: [GX("Factorise " + M(c + "x - x^2") + ".", "x*(" + c + "-x)", M("x(" + c + " - x)") + "."), GSS("Où est-il strictement négatif ?", [[-INF, false, 0, false], [c, false, INF, false]], M("x < 0") + " ou " + M("x > " + c) + ".")],
            traps: [TS([[0, false, c, false]], "Sur ]0 ; " + c + "[, la conjecture est vraie : ce sont les autres x."), TS([[-INF, false, 0, true], [c, true, INF, false]], "En 0 et en " + c + ", il y a égalité : ce ne sont pas des contre-exemples.")] }); },
    ],
  };

  // ======================= demoalg : démontrer en algèbre (th. 5) =======================
  const DIVBANK = [
    ["la différence des carrés de deux nombres impairs consécutifs", 8, "(2n + 3)^2 - (2n + 1)^2 = 8n + 8 = 8(n + 1)", "pour n = 0 : 9 − 1 = 8"],
    ["la différence des carrés de deux nombres pairs consécutifs", 4, "(2n + 2)^2 - (2n)^2 = 8n + 4 = 4(2n + 1)", "pour n = 0 : 4 − 0 = 4"],
    ["le nombre n^3 - n (n entier)", 6, "n^3 - n = (n - 1)n(n + 1)", "produit de trois entiers consécutifs ; pour n = 2 : 6"],
    ["le produit de trois entiers consécutifs", 6, "n(n + 1)(n + 2)", "un facteur pair et un multiple de 3 ; 1 · 2 · 3 = 6"],
    ["le nombre (2n + 1)^2 - 1 (n entier)", 8, "(2n + 1)^2 - 1 = 4n(n + 1)", "n(n + 1) est pair ; pour n = 1 : 8"],
    ["le nombre n^2(n^2 - 1) (n entier)", 12, "n^2(n^2 - 1) = n \\cdot (n - 1)n(n + 1)", "multiple de 3 et de 4 ; pour n = 2 : 12"],
    ["le produit de quatre entiers consécutifs", 24, "n(n + 1)(n + 2)(n + 3)", "1 · 2 · 3 · 4 = 24"],
  ];
  const DA = {
    1: [
      /* somme de k consécutifs = k(…) */
      () => { const k = pk([3, 5, 7]), h = (k - 1) / 2;
        return QX("On veut démontrer que la somme de " + k + " entiers consécutifs est un multiple de " + M(k) + ". Le plus petit est " + M("n") + " : " + M("n + (n + 1) + \\ldots + (n + " + (k - 1) + ") = " + k + "\\,(\\ldots)") + ". Que met-on dans la parenthèse ?", "n+" + h,
          M("n + (n + 1) + \\ldots + (n + " + (k - 1) + ") = " + k + "n + " + (k * (k - 1)) / 2 + " = " + k + "(n + " + h + ")") + ". Comme " + M("n + " + h) + " est un entier, la somme est un multiple de " + M(k) + ".",
          { ctx: "somme-consecutifs", guide: [GX("Somme réduite ?", k + "*n+" + (k * (k - 1)) / 2, M(k + "n + " + (k * (k - 1)) / 2) + "."), GX("Mets " + M(k) + " en évidence : contenu de la parenthèse ?", "n+" + h, M(k + "(n + " + h + ")") + ".")],
            traps: [TX("n+" + (k * (k - 1)) / 2, "Divise aussi le terme constant par " + k + "."), TX("n+1", "Il y a " + k + " termes : le terme constant total est " + (k * (k - 1)) / 2 + ".")] }); },
      /* carrés de pairs et d'impairs */
      () => { const v = pk([
          ["Si " + M("n") + " est impair, alors " + M("n^2") + " est impair", "n = 2k + 1", "(2k + 1)^2 = 2(\\ldots) + 1", "2*k^2+2*k", "(2k + 1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1", "4*k^2+4*k", "impair-carre"],
          ["Si " + M("n") + " est pair, alors " + M("n^2") + " est un multiple de 4", "n = 2k", "(2k)^2 = 4(\\ldots)", "k^2", "(2k)^2 = 4k^2", "2*k^2", "pair-carre"],
          ["Le produit de deux impairs est impair", "2k + 1 \\text{ et } 2m + 1", "(2k + 1)(2m + 1) = 2(\\ldots) + 1", "2*k*m+k+m", "(2k + 1)(2m + 1) = 4km + 2k + 2m + 1 = 2(2km + k + m) + 1", "4*k*m+1", "produit-impairs"],
          ["Le produit de deux pairs consécutifs est un multiple de 4", "2k \\text{ et } 2k + 2", "2k(2k + 2) = 4(\\ldots)", "k^2+k", "2k(2k + 2) = 4k^2 + 4k = 4(k^2 + k)", "4*k^2+4*k", "produit-pairs"]]);
        return QX("Démonstration : « " + v[0] + " ». On écrit " + M(v[1]) + " (entiers). Complète : " + M(v[2]) + ". Que met-on dans la parenthèse ?", v[3],
          M(v[4]) + ". La parenthèse est un entier : c'est démontré.",
          { ctx: v[6], guide: [GX("Développe d'abord.", v[3].includes("m") ? "4*k*m+2*k+2*m+1" : v[5] === "2*k^2" ? "4*k^2" : v[5] + (v[6] === "impair-carre" ? "+1" : ""), M(v[4].split(" = ")[1]) + "."), GX("Mets en évidence : contenu de la parenthèse ?", v[3], M(v[4]) + ".")],
            traps: [TX(v[5], "Il faut encore mettre en évidence : la parenthèse contient l'expression divisée par le facteur."), TX(v[3] + "+1", "Le « + 1 » reste à l'extérieur de la parenthèse.")] }); },
      /* somme de multiples */
      () => { const d = pk([7, 11, 13, 17]), a = ri(2, 6), b = ri(2, 6), minus = R.rand() < 0.4;
        return QX("Démonstration : « si " + M("x") + " et " + M("y") + " sont des multiples de " + M(d) + ", alors " + M(a + "x " + (minus ? "-" : "+") + " " + b + "y") + " aussi ». On écrit " + M("x = " + d + "k") + " et " + M("y = " + d + "m") + ". Complète : " + M(a + "x " + (minus ? "-" : "+") + " " + b + "y = " + d + "\\,(\\ldots)") + ".", a + "*k" + (minus ? "-" : "+") + b + "*m",
          M(a + "x " + (minus ? "-" : "+") + " " + b + "y = " + a * d + "k " + (minus ? "-" : "+") + " " + b * d + "m = " + d + "(" + a + "k " + (minus ? "-" : "+") + " " + b + "m)") + ", et " + M(a + "k " + (minus ? "-" : "+") + " " + b + "m") + " est un entier.",
          { ctx: "multiples-somme", guide: [GX("Remplace " + M("x") + " et " + M("y") + " et développe.", a * d + "*k" + (minus ? "-" : "+") + b * d + "*m", M(a * d + "k " + (minus ? "-" : "+") + " " + b * d + "m") + "."), GX("Mets " + M(d) + " en évidence.", a + "*k" + (minus ? "-" : "+") + b + "*m", M(d + "(" + a + "k " + (minus ? "-" : "+") + " " + b + "m)") + ".")],
            traps: [TX("k" + (minus ? "-" : "+") + "m", "Les coefficients " + a + " et " + b + " restent dans la parenthèse."), TX(a * d + "*k" + (minus ? "-" : "+") + b * d + "*m", "Il faut mettre " + d + " en évidence.")] }); },
    ],
    2: [
      /* (n + a)² − (n − a)² toujours multiple de ? */
      () => { const a = ri(2, 9);
        return QN("Démontre que " + M("(n + " + a + ")^2 - (n - " + a + ")^2") + " est toujours un multiple d'un même entier, quel que soit l'entier " + M("n") + ". Quel est le plus grand entier qui divise toujours cette expression ?", 4 * a,
          M("(n + " + a + ")^2 - (n - " + a + ")^2 = n^2 + " + 2 * a + "n + " + a * a + " - (n^2 - " + 2 * a + "n + " + a * a + ") = " + 4 * a + "n") + ". C'est un multiple de " + M(4 * a) + " ; pour " + M("n = 1") + ", on obtient exactement " + M(4 * a) + ", donc aucun entier plus grand ne divise toujours.",
          { ctx: "diff-carres-a", guide: [GS("Développe et réduis : on obtient " + M("c \\cdot n") + ". Que vaut " + M("c") + " ?", 4 * a, M(4 * a + "n") + "."), GS("Valeur pour " + M("n = 1") + " ?", 4 * a, M(4 * a) + " : le plus grand diviseur commun est " + M(4 * a) + ".")],
            traps: [TR(2 * a, "Développe les deux carrés : il reste " + 4 * a + "n, pas " + 2 * a + "n."), TR(a * a, "Les termes " + a * a + " s'annulent."), TR(4, "4 divise toujours, mais " + 4 * a + " aussi.")] }); },
      /* (n − a)(n + a) + b est toujours un carré */
      () => { const a = ri(2, 12), Sq = R.rand() < 0.5;
        return QN(Sq ? "Pour quelle valeur de " + M("b") + " l'expression " + M("(n - " + a + ")(n + " + a + ") + b") + " est-elle égale à " + M("n^2") + " pour tout entier " + M("n") + " ?" : "On constate : " + M((a + 2) + " \\cdot " + (3 * a + 2)) + " + ? = " + M((2 * a + 2) + "^2") + ". En général, " + M("(n - " + a + ")(n + " + a + ") + b = n^2") + " pour tout " + M("n") + ". Que vaut " + M("b") + " ?", a * a,
          M("(n - " + a + ")(n + " + a + ") = n^2 - " + a * a) + " : il faut ajouter " + M("b = " + a * a) + ". (Le produit de l'entier situé " + a + " avant " + M("n") + " par celui situé " + a + " après, augmenté de " + M(a * a) + ", est le carré de " + M("n") + ".)",
          { ctx: Sq ? "carre-b" : "carre-exemple", guide: [GS("Développe : " + M("(n - " + a + ")(n + " + a + ") = n^2 - c") + ". Que vaut " + M("c") + " ?", a * a, M("n^2 - " + a * a) + "."), GS(M("b") + " = ?", a * a, M(a * a) + ".")],
            traps: [TR(2 * a, "(n − a)(n + a) = n² − a² : c'est a², pas 2a."), TR(-a * a, "On ajoute b pour compenser le « − " + a * a + " »."), TR(a, "Il faut le carré de " + a + ".")] }); },
      /* plus grand diviseur toujours présent */
      () => { const v = pk(DIVBANK);
        return QN("Quel est le plus grand entier qui divise toujours " + v[0].replace(/n\^3 - n|\(2n \+ 1\)\^2 - 1|n\^2\(n\^2 - 1\)/, (m) => M(m)) + " ?", v[1],
          M(v[2]) + " ; " + v[3].replace(/(\d+) − (\d+) = (\d+)/, (m) => M(m.replace("−", "-"))) + " : le plus grand diviseur toujours présent est " + M(v[1]) + ".",
          { ctx: "divbank-" + v[1] + "-" + v[0].length, guide: [GS("Calcule l'expression pour la plus petite valeur (ou les plus petits nombres) : résultat ?", v[1], v[3] + "."), GS("Démontre (" + M(v[2]) + ") : plus grand diviseur toujours présent ?", v[1], M(v[1]) + ".")],
            traps: [TR(v[1] / 2, "C'est un diviseur, mais pas le plus grand : écris l'expression sous forme factorisée."), TR(v[1] * 2, "Pour la plus petite valeur, on obtient " + v[1] + " : " + v[1] * 2 + " ne divise pas toujours.")] }); },
    ],
    3: [
      /* programme de calcul */
      () => { const v = pk(["prog", "carres"]);
        if (v === "carres") { const a = ri(2, 9);
          return QN("Programme : « Choisis un nombre " + M("x \\neq 0") + ". Calcule le carré de " + M("x + " + a) + ", soustrais le carré de " + M("x - " + a) + ", puis divise par " + M("x") + ". » Démontre que le résultat ne dépend pas de " + M("x") + ". Quel est-il ?", 4 * a,
            M("\\frac{(x + " + a + ")^2 - (x - " + a + ")^2}{x} = \\frac{" + 4 * a + "x}{x} = " + 4 * a) + ".",
            { ctx: "prog-carres", guide: [GS("Développe et réduis " + M("(x + " + a + ")^2 - (x - " + a + ")^2") + " : on obtient " + M("c \\cdot x") + ". Que vaut " + M("c") + " ?", 4 * a, M(4 * a + "x") + "."), GS("Divisé par " + M("x") + " ?", 4 * a, M(4 * a) + ".")],
              traps: [TR(2 * a, "Les deux doubles produits s'ajoutent : " + 2 * a + "x − (−" + 2 * a + "x) = " + 4 * a + "x."), TR(2 * a * a, "Les carrés " + a * a + " s'annulent.")] }); }
        const a = ri(3, 30), b = pk([2, 3, 4, 5]), c = pk([2, 5, 10, 3, 4].filter((z) => (a * b) % z === 0 && z !== b)); if (!c) return null; const res = (a * b) / c; if ([a, b, c, 0, 1].includes(res)) return null;
        return QN("Programme : « Choisis un nombre. Ajoute " + M(a) + ". Multiplie par " + M(b) + ". Soustrais " + M(b) + " fois le nombre de départ. Divise par " + M(c) + ". » Démontre que le résultat est toujours le même. Quel est-il ?", res,
          M("\\frac{" + b + "(x + " + a + ") - " + b + "x}{" + c + "} = \\frac{" + b * a + "}{" + c + "} = " + res) + " : le nombre de départ disparaît.",
          { ctx: "prog-constant", guide: [GS("Avec " + M("x") + " le nombre de départ, réduis " + M(b + "(x + " + a + ") - " + b + "x") + ". Résultat ?", a * b, M(a * b) + "."), GS("Divisé par " + M(c) + " ?", res, M(res) + ".")],
            traps: [TR(a * b, "Il reste à diviser par " + c + "."), TR(a, "Le " + b + " multiplie aussi le " + a + ".")] }); },
      /* critères de divisibilité démontrés */
      () => { const v = pk(["9", "7", "11"]);
        if (v === "9") return QX("Critère de divisibilité par 9 : on écrit un nombre de trois chiffres " + M("N = 100a + 10b + c") + ". Complète : " + M("N - (a + b + c) = 9\\,(\\ldots)") + ".", "11*a+b",
          M("N - (a + b + c) = 99a + 9b = 9(11a + b)") + " : " + M("N") + " et la somme de ses chiffres ont le même reste dans la division par 9 (et par 3).",
          { ctx: "critere-9", guide: [GX("Calcule " + M("N - (a + b + c)") + " réduit.", "99*a+9*b", M("99a + 9b") + "."), GX("Mets 9 en évidence.", "11*a+b", M("9(11a + b)") + ".")],
            traps: [TX("11*a+b+c", "Le c s'annule : 100a + 10b + c − a − b − c."), TX("99*a+9*b", "Il faut mettre 9 en évidence.")] });
        if (v === "11") return QX("Démontre : « un nombre de deux chiffres plus son renversé est un multiple de 11 ». Avec " + M("10a + b") + " et " + M("10b + a") + ", complète : " + M("(10a + b) + (10b + a) = 11\\,(\\ldots)") + ".", "a+b",
          M("11a + 11b = 11(a + b)") + ".", { ctx: "critere-11", guide: [GX("Somme réduite ?", "11*a+11*b", M("11a + 11b") + "."), GX("Mets 11 en évidence.", "a+b", M("11(a + b)") + ".")], traps: [TX("11*a+11*b", "Il faut mettre 11 en évidence."), TX("10*a+b", "Additionne les deux nombres.")] });
        return QX("Critère de divisibilité par 7 : on écrit " + M("N = 10k + m") + " (" + M("k") + " dizaines, " + M("m") + " unités) et on suppose " + M("k + 5m = 7p") + ". Alors " + M("k = 7p - 5m") + ". Complète : " + M("N = 7\\,(\\ldots)") + ".", "10*p-7*m",
          M("N = 10(7p - 5m) + m = 70p - 49m = 7(10p - 7m)") + " : " + M("N") + " est un multiple de 7.",
          { ctx: "critere-7", guide: [GX("Remplace " + M("k") + " dans " + M("10k + m") + " et réduis.", "70*p-49*m", M("70p - 49m") + "."), GX("Mets 7 en évidence.", "10*p-7*m", M("7(10p - 7m)") + ".")],
            traps: [TX("10*p-5*m", "Réduis d'abord : −50m + m = −49m."), TX("70*p-49*m", "Il faut mettre 7 en évidence.")] }); },
      /* irrationalité par l'absurde */
      () => { const d = pk([2, 3, 5, 7]);
        return QX("Par l'absurde : on suppose " + M("\\sqrt{" + d + "} = \\frac{p}{q}") + " (fraction irréductible). Alors " + M("p^2 = " + d + "q^2") + ", donc " + M("p") + " est un multiple de " + d + " : " + M("p = " + d + "k") + ". En remplaçant, " + M("q^2 = \\ldots") + ". Écris " + M("q^2") + " en fonction de " + M("k") + ".", d + "*k^2",
          M(d * d + "k^2 = " + d + "q^2") + " donne " + M("q^2 = " + d + "k^2") + " : " + M("q") + " est aussi un multiple de " + d + ". Alors " + M("p") + " et " + M("q") + " sont divisibles par " + d + " : la fraction n'est pas irréductible, contradiction. Donc " + M("\\sqrt{" + d + "}") + " est irrationnel.",
          { ctx: "absurde-" + d, guide: [GX("Remplace " + M("p = " + d + "k") + " dans " + M("p^2") + ".", d * d + "*k^2", M("(" + d + "k)^2 = " + d * d + "k^2") + "."), GX("Divise " + M(d * d + "k^2 = " + d + "q^2") + " par " + M(d) + ".", d + "*k^2", M("q^2 = " + d + "k^2") + ".")],
            traps: [TX(d * d + "*k^2", "C'est p² : divise par " + d + " pour obtenir q²."), TX(d + "*k", "(" + d + "k)² = " + d * d + "k² : n'oublie pas le carré.")] }); },
    ],
  };

  // ======================= implication : implication, réciproque, contraposée (th. 4 et 6) =======================
  /* paire d'énoncés : P, Q, leurs négations, valeur de P ⇒ Q et de Q ⇒ P, justification */
  const PAIRS = [
    () => { const a = pk([3, 4, 5, 6, 7]), k = pk([2, 3]); return { ctx: "multiples", P: M("n") + " est un multiple de " + M(a * k), Q: M("n") + " est un multiple de " + M(a), nP: M("n") + " n'est pas un multiple de " + M(a * k), nQ: M("n") + " n'est pas un multiple de " + M(a), pq: true, qp: false, why: M(a * k + "k = " + a + " \\cdot " + k + "k") + " ; mais " + M(a) + " n'est pas un multiple de " + M(a * k) }; },
    () => ({ ctx: "pair-carre", P: M("n") + " est pair", Q: M("n^2") + " est pair", nP: M("n") + " est impair", nQ: M("n^2") + " est impair", pq: true, qp: true, why: "théorème du cours : " + M("n") + " pair " + M("\\Leftrightarrow n^2") + " pair" }),
    () => { const c = ri(2, 9); return { ctx: "carre-egal", P: M("x = " + c), Q: M("x^2 = " + c * c), nP: M("x \\neq " + c), nQ: M("x^2 \\neq " + c * c), pq: true, qp: false, why: M("x = -" + c) + " vérifie " + M("x^2 = " + c * c) }; },
    () => ({ ctx: "termine-0", P: M("n") + " se termine par 0", Q: M("n") + " est un multiple de 5", nP: M("n") + " ne se termine pas par 0", nQ: M("n") + " n'est pas un multiple de 5", pq: true, qp: false, why: "15 est un multiple de 5 qui ne se termine pas par 0" }),
    () => ({ ctx: "mult4-termine4", P: M("n") + " est un multiple de 4", Q: M("n") + " se termine par 4", nP: M("n") + " n'est pas un multiple de 4", nQ: M("n") + " ne se termine pas par 4", pq: false, qp: false, why: "8 est un multiple de 4 qui ne se termine pas par 4, et 14 se termine par 4 sans être un multiple de 4" }),
    () => ({ ctx: "produit-nul", P: M("xy = 0"), Q: M("x = 0") + " ou " + M("y = 0"), nP: M("xy \\neq 0"), nQ: M("x \\neq 0") + " et " + M("y \\neq 0"), pq: true, qp: true, why: "un produit est nul si et seulement si l'un des facteurs est nul" }),
    () => { const a = ri(2, 6), b = ri(2, 6); return { ctx: "somme-xy", P: M("x = " + a) + " et " + M("y = " + b), Q: M("x + y = " + (a + b)), nP: M("x \\neq " + a) + " ou " + M("y \\neq " + b), nQ: M("x + y \\neq " + (a + b)), pq: true, qp: false, why: M("x = " + (a + b - 1)) + " et " + M("y = 1") + " donnent aussi " + M(a + b) }; },
    () => ({ ctx: "mult6", P: M("n") + " est un multiple de 6", Q: M("n") + " est pair et multiple de 3", nP: M("n") + " n'est pas un multiple de 6", nQ: M("n") + " est impair ou n'est pas un multiple de 3", pq: true, qp: true, why: "6 = 2 · 3, et 2 et 3 n'ont pas de diviseur commun" }),
    () => ({ ctx: "mult8", P: M("n") + " est un multiple de 8", Q: M("n") + " est un multiple de 2 et de 4", nP: M("n") + " n'est pas un multiple de 8", nQ: M("n") + " n'est pas un multiple de 2 ou pas un multiple de 4", pq: true, qp: false, why: "4 est un multiple de 2 et de 4, mais pas de 8" }),
    () => { const c = ri(2, 9); return { ctx: "plus-grand", P: M("x > " + c), Q: M("x^2 > " + c * c), nP: M("x \\le " + c), nQ: M("x^2 \\le " + c * c), pq: true, qp: false, why: M("x = -" + (c + 1)) + " vérifie " + M("x^2 > " + c * c) + " mais pas " + M("x > " + c) }; },
    () => ({ ctx: "carre-losange", P: M("ABCD") + " est un carré", Q: M("ABCD") + " est un losange", nP: M("ABCD") + " n'est pas un carré", nQ: M("ABCD") + " n'est pas un losange", pq: true, qp: false, why: "un losange non rectangle n'est pas un carré" }),
    () => ({ ctx: "pythagore", P: "le triangle " + M("ABC") + " est rectangle en " + M("C"), Q: M("AB^2 = AC^2 + BC^2"), nP: "le triangle " + M("ABC") + " n'est pas rectangle en " + M("C"), nQ: M("AB^2 \\neq AC^2 + BC^2"), pq: true, qp: true, why: "théorème de Pythagore et sa réciproque" }),
    () => { const c = ri(2, 9); return { ctx: "xcx", P: M("x^2 = " + c + "x"), Q: M("x = " + c), nP: M("x^2 \\neq " + c + "x"), nQ: M("x \\neq " + c), pq: false, qp: true, why: M("x = 0") + " vérifie " + M("x^2 = " + c + "x") }; },
    () => ({ ctx: "premier-impair", P: M("n") + " est premier", Q: M("n") + " est impair", nP: M("n") + " n'est pas premier", nQ: M("n") + " est pair", pq: false, qp: false, why: "2 est premier et pair ; 9 est impair et pas premier" }),
  ];
  const swap = (s) => (R.rand() < 0.5 ? s : { ...s, P: s.Q, Q: s.P, nP: s.nQ, nQ: s.nP, pq: s.qp, qp: s.pq });
  const ctxOf = (s) => (/[xy]/.test(s.P + s.Q) && !/ABC/.test(s.P + s.Q) ? "(" + M("x") + " et " + M("y") + " sont des réels)" : /ABC/.test(s.P + s.Q) ? "" : "(" + M("n") + " est un entier naturel)");
  const LIFE = [
    { c: "parapluie", H: "il pleut quand Léa sort", C: "Léa prend son parapluie", nH: "il ne pleut pas quand Léa sort", nC: "Léa n'a pas son parapluie" },
    { c: "jazz", H: "Sam aime le jazz", C: "Sam écoute souvent du jazz", nH: "Sam n'aime pas le jazz", nC: "Sam n'écoute pas souvent de jazz" },
    { c: "astronautes", H: "une personne est un astronaute américain", C: "elle porte une chemise rouge", nH: "elle n'est pas un astronaute américain", nC: "elle ne porte pas de chemise rouge" },
    { c: "batterie", H: "la batterie du téléphone est vide", C: "le téléphone est éteint", nH: "la batterie n'est pas vide", nC: "le téléphone est allumé" },
    { c: "vitrine", H: "le magasin est ouvert", C: "la vitrine est éclairée", nH: "le magasin est fermé", nC: "la vitrine n'est pas éclairée" },
  ];
  const IM = {
    1: [
      /* P ⇒ Q, Q ⇒ P : lesquelles sont vraies ? */
      () => { const s = swap(pk(PAIRS)()), ans = [s.pq ? 1 : 0, s.qp ? 2 : 0].filter((x) => x);
        return QSet("On considère les énoncés P : « " + s.P + " » et Q : « " + s.Q + " » " + ctxOf(s) + ". Lesquelles de ces implications sont vraies ?" + liste([M("P " + IMPL + " Q"), M("Q " + IMPL + " P")]) + "<br>" + ASK_NUM, ans,
          "(1) " + (s.pq ? "vraie" : "fausse") + ", (2) " + (s.qp ? "vraie" : "fausse") + " : " + s.why + "." + (ans.length === 2 ? " On écrit " + M("P \\Leftrightarrow Q") + "." : ""),
          { ctx: "sens-" + s.ctx, guide: [GSet("Pour chaque implication, cherche un contre-exemple (hypothèse vraie, conclusion fausse). Lesquelles sont vraies ?", ans, s.why + ".")],
            traps: [ans.length === 2 ? TSt([1], "La réciproque est vraie aussi : c'est une équivalence.") : TSt([1, 2], "Une des deux a un contre-exemple : " + s.why + "."), ans.length === 1 ? TSt([3 - ans[0]], "C'est l'autre sens qui est vrai.") : null, ans.length ? TNone("Teste avec un exemple : l'hypothèse vraie entraîne-t-elle la conclusion ?") : TSt([1], "Contre-exemple : " + s.why + ".")] }); },
      /* reconnaître la réciproque ou la contraposée */
      () => { let s; do s = pk(PAIRS)(); while (!s.pq); const want = pk(["réciproque", "contraposée"]), opts = sh([["rec", "si " + s.Q + ", alors " + s.P], ["contra", "si " + s.nQ + ", alors " + s.nP], ["inv", "si " + s.nP + ", alors " + s.nQ]]), k = opts.findIndex((o) => o[0] === (want === "réciproque" ? "rec" : "contra")) + 1;
        return QN("Implication : « si " + s.P + ", alors " + s.Q + " » " + ctxOf(s) + ". Laquelle de ces phrases est sa " + want + " ?" + liste(opts.map((o) => "« " + o[1] + " »")) + "<br>Écris son numéro.", k,
          "La réciproque échange hypothèse et conclusion ; la contraposée les échange et les nie : « si " + s.nQ + ", alors " + s.nP + " ». La " + want + " est la phrase (" + k + ").",
          { ctx: "reconnaitre-" + (want === "réciproque" ? "rec" : "contra"), shownOk: true, guide: [GS(want === "réciproque" ? "Réciproque : on échange hypothèse et conclusion. Numéro ?" : "Contraposée : on échange ET on nie les deux. Numéro ?", k, "(" + k + ").")],
            traps: opts.map((o, i) => (o[0] === (want === "réciproque" ? "rec" : "contra") ? null : TR(i + 1, o[0] === "inv" ? "Celle-ci nie sans échanger : ce n'est ni la réciproque ni la contraposée." : o[0] === "rec" ? "C'est la réciproque (échange sans négation)." : "C'est la contraposée (échange et négation)."))) }); },
      /* raisonnements de la vie courante */
      () => { const L = pk(LIFE), all = [["ok", "On constate que " + L.H + ". On en conclut que " + L.C + "."], ["contra", "On constate que " + L.nC + ". On en conclut que " + L.nH + "."], ["rec", "On constate que " + L.C + ". On en conclut que " + L.H + "."], ["inv", "On constate que " + L.nH + ". On en conclut que " + L.nC + "."]];
        let ch; do ch = sh(all).slice(0, 3); while (!ch.some((x) => x[0] === "ok" || x[0] === "contra") || !ch.some((x) => x[0] === "rec" || x[0] === "inv")); const ans = ch.map((x, i) => (x[0] === "ok" || x[0] === "contra" ? i + 1 : 0)).filter((x) => x);
        return QSet("On sait que l'implication « si " + L.H + ", alors " + L.C + " » est vraie. Quels raisonnements sont corrects (conclusion certaine) ?" + liste(ch.map((x) => x[1])) + "<br>" + ASK_NUM, ans,
          ch.map((x, i) => "(" + (i + 1) + ") " + (x[0] === "ok" ? "correct (l'implication elle-même)" : x[0] === "contra" ? "correct (contraposée)" : x[0] === "rec" ? "incorrect (réciproque)" : "incorrect (on nie sans échanger)")).join(" ; ") + ".",
          { ctx: "vie-" + L.c, guide: [GSet("Une implication vraie a une contraposée vraie, mais sa réciproque peut être fausse. Raisonnements corrects ?", ans, ans.join(", ") + ".")],
            traps: [TSt(ch.map((x, i) => (x[0] === "rec" || x[0] === "inv" ? i + 1 : 0)).filter((x) => x), "Ce sont les raisonnements faux : réciproque ou négation sans échange."), TSt([1, 2, 3], "La réciproque d'une implication vraie n'est pas forcément vraie.")] }); },
    ],
    2: [
      /* combien d'énoncés vrais parmi implication, réciproque, contraposée */
      () => { const s = swap(pk(PAIRS)()), n = (s.pq ? 2 : 0) + (s.qp ? 1 : 0);
        return QN("Implication : « si " + s.P + ", alors " + s.Q + " » " + ctxOf(s) + ". Parmi cette implication, sa réciproque et sa contraposée, combien sont vraies ?", n,
          "L'implication est " + (s.pq ? "vraie" : "fausse") + ", donc sa contraposée aussi ; la réciproque est " + (s.qp ? "vraie" : "fausse") + " (" + s.why + "). Total : " + M(n) + ".",
          { ctx: "compte-" + s.ctx, guide: [GS("Combien parmi l'implication et sa contraposée (elles ont toujours la même valeur) : 0 ou 2 ?", s.pq ? 2 : 0, s.pq ? "Les deux sont vraies." : "Les deux sont fausses."), GS("Total avec la réciproque ?", n, M(n) + ".")],
            traps: [TR(s.pq ? (s.qp ? 2 : 3) : s.qp ? 2 : 1, "Une implication et sa contraposée sont toujours vraies ensemble ou fausses ensemble."), TR(s.pq ? 1 : 2, "Teste aussi la réciproque séparément.")] }); },
      /* multiples de a et de b */
      () => { const L = [2, 3, 4, 6, 8, 9, 12, 15, 18, 20]; const a = pk(L), b = pk(L.filter((x) => x !== a)), ans = [a % b === 0 ? 1 : 0, b % a === 0 ? 2 : 0].filter((x) => x);
        const ce1 = a % b ? a : null, ce2 = b % a ? b : null;
        return QSet("Soit " + M("n") + " un entier. P : « " + M("n") + " est un multiple de " + M(a) + " », Q : « " + M("n") + " est un multiple de " + M(b) + " ». Lesquelles sont vraies ?" + liste([M("P " + IMPL + " Q"), M("Q " + IMPL + " P")]) + "<br>" + ASK_NUM, ans,
          "(1) " + (ce1 ? "fausse : " + M(a) + " est un multiple de " + M(a) + " mais pas de " + M(b) : "vraie : " + M(a + " = " + b + " \\cdot " + a / b) + ", donc tout multiple de " + M(a) + " est un multiple de " + M(b)) + " ; (2) " + (ce2 ? "fausse : " + M(b) + " n'est pas un multiple de " + M(a) : "vraie : " + M(b + " = " + a + " \\cdot " + b / a)) + ".",
          { ctx: "multiples-ab", guide: [GSet("P ⇒ Q est vraie si " + M(b) + " divise " + M(a) + " ; Q ⇒ P si " + M(a) + " divise " + M(b) + ". Lesquelles ?", ans, nums(ans) + ".")],
            traps: [ans.length ? TNone("Un des deux nombres divise l'autre.") : TSt([1], a + " n'est pas un multiple de " + b + " : " + a + " lui-même est un contre-exemple."), ans.length === 1 ? TSt([3 - ans[0]], "C'est l'autre sens.") : null] }); },
      /* contre-exemple à la réciproque */
      () => { const b = pk([3, 4, 5, 6, 7, 9]), k = pk([2, 3, 4]), a = b * k, ce = k === 2 ? 3 * b : 2 * b;
        return QN("L'implication « si " + M("n") + " est un multiple de " + M(a) + ", alors " + M("n") + " est un multiple de " + M(b) + " » est vraie. Sa réciproque est fausse. Quel est le plus petit contre-exemple " + M("n > " + b) + " à cette réciproque ?", ce,
          "Réciproque : « si " + M("n") + " est un multiple de " + M(b) + ", alors c'est un multiple de " + M(a) + " ». Contre-exemple : un multiple de " + M(b) + " qui n'est pas un multiple de " + M(a) + ". Après " + M(b) + " : " + M(2 * b) + (k === 2 ? " est un multiple de " + M(a) + ", donc " + M(3 * b) : "") + ".",
          { ctx: "ce-reciproque", guide: [GS("Un contre-exemple vérifie l'hypothèse de la réciproque (multiple de " + M(b) + ") sans sa conclusion. Multiples de " + M(b) + " après " + M(b) + " : le premier ?", 2 * b, M(2 * b) + "."), GS("Plus petit qui n'est pas un multiple de " + M(a) + " ?", ce, M(ce) + ".")],
            traps: [TR(a, a + " est un multiple de " + a + " : la conclusion est vraie."), TR(k === 2 ? 2 * b : 3 * b, k === 2 ? 2 * b + " = " + a + " est un multiple de " + a + "." : "Il y en a un plus petit."), TR(2 * a, "Il faut un multiple de " + b + " qui n'est PAS un multiple de " + a + ".")] }); },
    ],
    3: [
      /* inégalités sur les réels */
      () => { const c = ri(2, 9), B = pk([
          { t: "x2c", P: M("x > " + c), Q: M("x^2 > " + c * c), pq: true, qp: false, why: M("x = -" + (c + 1)) + " : " + M("x^2 > " + c * c) + " mais " + M("x < " + c) },
          { t: "x2lt", P: M("x^2 < " + c * c), Q: M("x < " + c), pq: true, qp: false, why: M("x^2 < " + c * c + " \\Leftrightarrow -" + c + " < x < " + c) + " ; mais " + M("x = -" + 2 * c) + " vérifie " + M("x < " + c) + " et pas " + M("x^2 < " + c * c) },
          { t: "x3", P: M("x^3 > " + c ** 3), Q: M("x > " + c), pq: true, qp: true, why: "la fonction cube est strictement croissante" },
          { t: "abs", P: M("|x| < " + c), Q: M("-" + c + " < x < " + c), pq: true, qp: true, why: "c'est la définition de la valeur absolue" },
          { t: "x2cx", P: M("x^2 \\ge " + c + "x"), Q: M("x \\ge " + c), pq: false, qp: true, why: M("x = -1") + " vérifie " + M("x^2 \\ge " + c + "x") + " ; et si " + M("x \\ge " + c + " > 0") + ", alors " + M("x \\cdot x \\ge " + c + "x") },
          { t: "inv", P: M("\\frac{1}{x} < \\frac{1}{" + c + "}") + " (" + M("x \\neq 0") + ")", Q: M("x > " + c), pq: false, qp: true, why: M("x = -1") + " vérifie " + M("\\frac{1}{x} < \\frac{1}{" + c + "}") + " ; et " + M("x > " + c + " > 0") + " donne " + M("\\frac{1}{x} < \\frac{1}{" + c + "}") }]), s = swap(B), ans = [s.pq ? 1 : 0, s.qp ? 2 : 0].filter((x) => x);
        return QSet("Pour " + M("x") + " réel : P : « " + s.P + " », Q : « " + s.Q + " ». Lesquelles sont vraies ?" + liste([M("P " + IMPL + " Q"), M("Q " + IMPL + " P")]) + "<br>" + ASK_NUM, ans,
          "(1) " + (s.pq ? "vraie" : "fausse") + ", (2) " + (s.qp ? "vraie" : "fausse") + " : " + s.why + ".",
          { ctx: "reels-" + s.t, guide: [GSet("Cherche un contre-exemple, en pensant aux nombres négatifs et à 0. Lesquelles sont vraies ?", ans, s.why + ".")],
            traps: [ans.length === 2 ? TSt([ans[0] === 1 ? 1 : 2], "Les deux sens sont vrais.") : TSt([1, 2], "Pense aux nombres négatifs : " + s.why + "."), ans.length === 1 ? TSt([3 - ans[0]], "C'est l'autre sens.") : null] }); },
      /* négation : compter les cas où un énoncé est faux */
      () => { const N = ri(20, 60), v = pk([
          { t: "ou", txt: "« " + M("n") + " est pair ou " + M("n") + " est un multiple de 3 »", f: (n) => !(n % 2 === 0 || n % 3 === 0), neg: M("n") + " est impair et n'est pas un multiple de 3" },
          { t: "et", txt: "« " + M("n") + " est pair et " + M("n") + " est un multiple de 5 »", f: (n) => !(n % 2 === 0 && n % 5 === 0), neg: M("n") + " est impair ou n'est pas un multiple de 5" },
          { t: "si", txt: "« si " + M("n") + " est pair, alors " + M("n") + " est un multiple de 4 »", f: (n) => n % 2 === 0 && n % 4 !== 0, neg: M("n") + " est pair et n'est pas un multiple de 4" },
          { t: "si3", txt: "« si " + M("n") + " est un multiple de 3, alors " + M("n") + " est impair »", f: (n) => n % 3 === 0 && n % 2 === 0, neg: M("n") + " est un multiple de 3 et pair (multiple de 6)" }]);
        let c = 0; for (let n = 1; n <= N; n++) if (v.f(n)) c++;
        return QN("Pour combien d'entiers " + M("n") + " de 1 à " + M(N) + " l'énoncé " + v.txt + " est-il faux ?", c,
          "L'énoncé est faux quand sa négation est vraie : " + v.neg + ". On compte ces entiers de 1 à " + M(N) + " : " + M(c) + ".",
          { ctx: "negation-" + v.t, guide: [GS("Écris la négation (" + (v.t === "ou" ? "« non (A ou B) » = « non A et non B »" : v.t === "et" ? "« non (A et B) » = « non A ou non B »" : "une implication est fausse quand l'hypothèse est vraie et la conclusion fausse") + "), puis compte. Combien ?", c, v.neg + " : " + M(c) + ".")],
            traps: [TR(N - c, "C'est le nombre de cas où l'énoncé est vrai."), v.t === "ou" ? TR(N - Math.floor(N / 2), "« non (pair ou multiple de 3) » = impair ET pas multiple de 3.") : v.t === "et" ? TR(N - Math.floor(N / 2), "« non (A et B) » = non A OU non B : il suffit qu'une condition manque.") : TR(v.t === "si" ? Math.floor(N / 2) : Math.floor(N / 3), "Une implication n'est fausse que si l'hypothèse est vraie et la conclusion fausse.")] }); },
      /* démontrer par la contraposée */
      () => { const v = pk([
          ["si " + M("n^2") + " est pair, alors " + M("n") + " est pair", "si " + M("n") + " est impair, alors " + M("n^2") + " est impair", "n = 2k + 1", "n^2 = 2(\\ldots) + 1", "2*k^2+2*k", "(2k + 1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1", "c2"],
          ["si " + M("n^2") + " est un multiple de 3, alors " + M("n") + " aussi", "si " + M("n") + " n'est pas un multiple de 3, alors " + M("n^2") + " non plus ; premier cas", "n = 3k + 1", "n^2 = 3(\\ldots) + 1", "3*k^2+2*k", "(3k + 1)^2 = 9k^2 + 6k + 1 = 3(3k^2 + 2k) + 1", "c3a"],
          ["si " + M("n^2") + " est un multiple de 3, alors " + M("n") + " aussi", "si " + M("n") + " n'est pas un multiple de 3, alors " + M("n^2") + " non plus ; second cas", "n = 3k + 2", "n^2 = 3(\\ldots) + 1", "3*k^2+4*k+1", "(3k + 2)^2 = 9k^2 + 12k + 4 = 3(3k^2 + 4k + 1) + 1", "c3b"]]);
        return QX("Pour démontrer « " + v[0] + " », on démontre sa contraposée : « " + v[1] + " ». On pose " + M(v[2]) + " (" + M("k") + " entier). Complète : " + M(v[3]) + ".", v[4],
          M(v[5]) + " : " + M("n^2") + " n'est pas un multiple de " + (v[6] === "c2" ? "2" : "3") + ". La contraposée est vraie, donc l'implication aussi.",
          { ctx: "contraposee-" + v[6], guide: [GX("Développe " + M("(" + v[2].slice(4) + ")^2") + ".", v[5].split(" = ")[1].replace(/(\d)k/g, "$1*k").replace(/ /g, ""), M(v[5].split(" = ").slice(0, 2).join(" = ")) + "."), GX("Mets en évidence pour faire apparaître le « + 1 » : parenthèse ?", v[4], M(v[5]) + ".")],
            traps: [TX(v[5].split(" = ")[1].replace(/(\d)k/g, "$1*k").replace(/ /g, "").replace(/\+1$|\+4$/, ""), "Il faut encore mettre en évidence (diviser par " + (v[6] === "c2" ? "2" : "3") + ")."), TX(v[4] + "+1", "Le « + 1 » est déjà à l'extérieur.")] }); },
    ],
  };

  // ---------- problèmes en plusieurs étapes (niveau 4, valeurs tirées au hasard) ----------
  const PROBS = {
    tradalg: [
      () => { const n = ri(6, 40), S = 6 * n + 9;
        return P("Trois nombres impairs consécutifs ont pour somme " + S + ". On note 2n + 1 le plus petit.", [["a) Coefficient de n dans la somme réduite", 6], ["b) Terme constant de la somme réduite", 9], ["c) Le plus petit des trois nombres", 2 * n + 1], ["d) Le plus grand des trois nombres", 2 * n + 5]],
          ["(2n + 1) + (2n + 3) + (2n + 5) = 6n + 9.", "6n + 9 = " + S + " donne n = " + n + "."], "a) et b) " + M("6n + 9") + " ; c) " + M("n = " + n) + ", le plus petit vaut " + M(2 * n + 1) + " ; d) " + M(2 * n + 5) + "."); },
      () => { const d = pk([6, 7, 8, 9]), r = ri(2, d - 2), q = ri(5, 15), N = d * q + r;
        return P("Un entier N laisse un reste " + r + " dans la division par " + d + " : N = " + d + "k + " + r + ". Exemple : N = " + N + ".", [["a) Quotient k pour N = " + N, q], ["b) Reste de N + 1 dans la division par " + d, r + 1], ["c) Reste de 3N dans la division par " + d, (3 * r) % d], ["d) Reste de N² dans la division par " + d, (r * r) % d]],
          ["N + 1 = " + d + "k + " + (r + 1) + ".", "3N = " + 3 * d + "k + " + 3 * r + " ; N² = " + d + "(…) + " + r * r + "."], "a) " + M(N + " = " + d + " \\cdot " + q + " + " + r) + " ; b) " + M(d + "k + " + (r + 1)) + " : reste " + M(r + 1) + " ; c) reste de " + M(3 * r) + " : " + M((3 * r) % d) + " ; d) reste de " + M(r * r) + " : " + M((r * r) % d) + "."); },
    ],
    contrex: [
      () => { const p = pk([11, 17]), n0 = firstFail((n) => n * n + n + p, 0), v = n0 * n0 + n0 + p;
        return P("Conjecture : « pour tout entier n ≥ 0, n² + n + " + p + " est un nombre premier ».", [["a) Valeur pour n = 3", 9 + 3 + p], ["b) Plus petit contre-exemple n", n0], ["c) Valeur de l'expression pour ce n", v], ["d) Plus petit diviseur premier de cette valeur", smallestFactor(v)]],
          ["Pour n = " + (p - 1) + " : n² + n = n(n + 1) = " + (p - 1) * p + ".", "n² + n + " + p + " = " + p + "(…) pour n = " + (p - 1) + "."], "a) " + M(9 + 3 + p) + " ; b) " + M(n0) + " ; c) " + M(v + " = " + p + "^2") + " ; d) " + M(p) + "."); },
      () => { const [a, b] = pk([[4, 6], [6, 9], [6, 8], [9, 12], [10, 15]]), L = lcm(a, b), N = ri(100, 200);
        return P("Conjecture : « si n est un multiple de " + a + " et de " + b + ", alors n est un multiple de " + a * b + " ».", [["a) Plus petit multiple commun de " + a + " et " + b, L], ["b) Combien de contre-exemples de 1 à " + N + " ?", Math.floor(N / L) - Math.floor(N / (a * b))], ["c) Par quel plus grand nombre un multiple de " + a + " et de " + b + " est-il toujours divisible ?", L]],
          ["Les multiples communs de " + a + " et " + b + " sont les multiples de " + L + ".", "Contre-exemples : multiples de " + L + " qui ne sont pas multiples de " + a * b + "."], "a) " + M(L) + " ; b) " + M(Math.floor(N / L) + " - " + Math.floor(N / (a * b)) + " = " + (Math.floor(N / L) - Math.floor(N / (a * b)))) + " ; c) " + M(L) + " (conjecture corrigée)."); },
    ],
    demoalg: [
      () => { const k = pk([5, 7]), h = (k - 1) / 2, n = ri(8, 40), S = k * n + (k * (k - 1)) / 2;
        return P(k + " entiers consécutifs ont pour somme " + S + ". On note n le plus petit.", [["a) Coefficient de n dans la somme", k], ["b) Terme constant de la somme", (k * (k - 1)) / 2], ["c) Le plus petit nombre", n], ["d) Le nombre du milieu", n + h]],
          ["Somme = " + k + "n + " + (k * (k - 1)) / 2 + " = " + k + "(n + " + h + ").", "Le nombre du milieu est la somme divisée par " + k + "."], "a) " + M(k) + " ; b) " + M((k * (k - 1)) / 2) + " ; c) " + M(n) + " ; d) " + M(S + " ÷ " + k + " = " + (n + h)) + "."); },
      () => { const a = ri(2, 6), n = ri(5, 30);
        return P("On étudie E = (n + " + a + ")² − (n − " + a + ")² pour n entier.", [["a) E pour n = " + n, 4 * a * n], ["b) Coefficient c tel que E = c · n", 4 * a], ["c) Plus grand entier qui divise toujours E", 4 * a]],
          ["Développe : les carrés de n et de " + a + " s'annulent.", "Pour n = 1, E = " + 4 * a + "."], "a) " + M(4 * a + " \\cdot " + n + " = " + 4 * a * n) + " ; b) " + M(4 * a) + " ; c) " + M(4 * a) + "."); },
    ],
    implication: [
      () => { const b = pk([3, 4, 6]), a = b * pk([2, 3]), N = ri(40, 90);
        return P("Soit n un entier ≥ 1 et l'implication « si n est un multiple de " + a + ", alors n est un multiple de " + b + " ».", [["a) Combien sont vraies parmi l'implication, sa réciproque et sa contraposée ?", 2], ["b) Plus petit contre-exemple n > 0 à la réciproque", b], ["c) Combien de contre-exemples à la réciproque de 1 à " + N + " ?", Math.floor(N / b) - Math.floor(N / a)]],
          ["L'implication et sa contraposée sont vraies ensemble.", "Contre-exemples à la réciproque : multiples de " + b + " qui ne sont pas multiples de " + a + "."], "a) 2 (la réciproque est fausse) ; b) " + M(b) + " ; c) " + M(Math.floor(N / b) + " - " + Math.floor(N / a) + " = " + (Math.floor(N / b) - Math.floor(N / a))) + "."); },
      () => { const N = ri(30, 70); let c1 = 0, c2 = 0; for (let n = 1; n <= N; n++) { if (n % 2 === 0 && n % 4 !== 0) c1++; if (n % 4 === 0) c2++; }
        return P("Pour n de 1 à " + N + ", on étudie l'implication « si n est pair, alors n est un multiple de 4 ».", [["a) Nombre de n pour lesquels l'hypothèse est vraie", Math.floor(N / 2)], ["b) Nombre de n pour lesquels l'implication est fausse", c1], ["c) Combien de n vérifient l'hypothèse de la réciproque (multiples de 4) ?", c2]],
          ["Elle est fausse quand n est pair et pas multiple de 4.", "Réciproque : si n est multiple de 4, alors n est pair."], "a) " + M(Math.floor(N / 2)) + " ; b) " + M(c1) + " (n = 2, 6, 10…) ; c) " + M(c2) + " (les multiples de 4)."); },
    ],
  };

  // ---------- catalogue ----------
  const NEW = [
    { id: "tradalg", theme: "no", label: "Traduire en langage algébrique", ex: "\\text{trois impairs consécutifs} : (2n + 1) + (2n + 3) + (2n + 5)", lv: TA,
      hint: "Pair : 2k ; impair : 2k + 1 ; consécutifs : n, n + 1, n + 2 ; multiple de d : dk ; se termine par c : 10k + c ; reste r dans la division par d : dk + r.",
      lesson: ["Traduire en langage algébrique", "Pour raisonner sur « tous les nombres », on les écrit avec une lettre.", "Un entier pair s'écrit \\(2k\\), un impair \\(2k + 1\\) (\\(k\\) entier). Deux entiers consécutifs : \\(n\\) et \\(n + 1\\) ; deux pairs consécutifs : \\(2k\\) et \\(2k + 2\\). Un multiple de \\(d\\) : \\(dk\\). Un entier qui se termine par \\(c\\) : \\(10k + c\\). Un entier de reste \\(r\\) dans la division par \\(d\\) : \\(dk + r\\) avec \\(0 \\le r < d\\).",
        ["Trois entiers consécutifs : \\(n + (n + 1) + (n + 2) = 3n + 3\\).", "Le carré d'un impair : \\((2k + 1)^2 = 4k^2 + 4k + 1\\)."], "Deux nombres impairs différents s'écrivent avec deux lettres : \\(2k + 1\\) et \\(2m + 1\\) (sauf s'ils sont consécutifs : \\(2k + 1\\) et \\(2k + 3\\))."],
      comps: ["Écrire un pair, un impair, des consécutifs avec une lettre", "Traduire une phrase en expression réduite (moyenne, différence de carrés)", "Résoudre un problème d'entiers en le traduisant"] },
    { id: "contrex", theme: "no", label: "Conjecture et contre-exemple", ex: "n^2 + n + 41 \\text{ premier ? } n = 40 : 41^2", lv: CE,
      hint: "Un contre-exemple rend l'hypothèse vraie et la conclusion fausse. Un seul suffit pour montrer qu'une conjecture est fausse ; des exemples, même nombreux, ne prouvent rien.",
      lesson: ["Conjecture et contre-exemple", "Une conjecture est vraie si elle l'est toujours, sans exception.", "Pour montrer qu'une conjecture est fausse, il suffit d'un contre-exemple : un cas où l'hypothèse est vraie et la conclusion fausse. Pour montrer qu'elle est vraie, des exemples ne suffisent pas : il faut une démonstration (sauf si les cas sont en nombre fini et qu'on les vérifie tous).",
        ["« \\(n^2 + n + 41\\) est premier » : vrai de 0 à 39, faux pour \\(n = 40\\) (\\(41^2\\)).", "« Un multiple de 4 et de 6 est un multiple de 24 » : faux, 12."], "Un nombre qui ne vérifie pas l'hypothèse n'est pas un contre-exemple."],
      comps: ["Trouver un contre-exemple à une conjecture", "Décider si une conjecture est vraie ou fausse", "Décrire tous les contre-exemples"] },
    { id: "demoalg", theme: "no", label: "Démontrer en algèbre", ex: "n + (n + 1) + (n + 2) = 3(n + 1)", lv: DA,
      hint: "Écris les nombres avec une lettre (2k, 2k + 1, n, n + 1…), développe, puis mets en évidence le facteur voulu : la parenthèse doit être un entier.",
      lesson: ["Démontrer en algèbre", "Une démonstration vaut pour tous les nombres à la fois.", "On part de l'hypothèse, traduite avec une lettre ; on calcule (développer, réduire) ; on met en évidence pour faire apparaître la conclusion : « \\(= 3 \\cdot (\\text{entier})\\) » pour un multiple de 3, « \\(= 2 \\cdot (\\text{entier}) + 1\\) » pour un impair. Par l'absurde : on suppose le contraire et on aboutit à une contradiction.",
        ["\\(n\\) impair : \\(n^2 = (2k + 1)^2 = 2(2k^2 + 2k) + 1\\), donc \\(n^2\\) est impair.", "\\(x = 7k\\), \\(y = 7m\\) : \\(x + y = 7(k + m)\\)."], "Il faut dire pourquoi la parenthèse est un entier (somme et produit d'entiers)."],
      comps: ["Mettre en évidence pour démontrer une divisibilité", "Trouver et démontrer un diviseur toujours présent", "Démontrer un critère, une propriété par l'absurde"] },
    { id: "implication", theme: "no", label: "Implication, réciproque, contraposée", ex: "P \\Rightarrow Q \\iff \\text{non } Q \\Rightarrow \\text{non } P", lv: IM,
      hint: "Réciproque de « P ⇒ Q » : « Q ⇒ P » (pas forcément vraie). Contraposée : « non Q ⇒ non P » (toujours de même valeur). Si P ⇒ Q et Q ⇒ P : P ⇔ Q.",
      lesson: ["Implication, réciproque, contraposée", "« Si P, alors Q » : P est l'hypothèse, Q la conclusion.", "La réciproque de \\(P \\Rightarrow Q\\) est \\(Q \\Rightarrow P\\) : elle peut être vraie ou fausse. La contraposée est « si non Q, alors non P » : elle a toujours la même valeur que l'implication. Si l'implication et sa réciproque sont vraies, on écrit \\(P \\Leftrightarrow Q\\). Négations : non (A et B) = non A ou non B ; non (A ou B) = non A et non B.",
        ["« Multiple de 9 ⇒ multiple de 3 » : vraie ; réciproque fausse (6).", "« \\(n\\) pair \\(\\Leftrightarrow n^2\\) pair »."], "« Si non P, alors non Q » n'est ni la réciproque ni la contraposée : elle peut être fausse."],
      comps: ["Écrire la réciproque et la contraposée d'une implication", "Décider si une implication, sa réciproque, une équivalence sont vraies", "Nier une proposition, démontrer par la contraposée"] },
  ];
  for (const n of NEW) {
    if (!NOTIONS.some((x) => x.id === n.id)) NOTIONS.push({ id: n.id, theme: "no", label: n.label, ex: n.ex, CH: [12], MP: null, FR: null });
    GEN[n.id] = (d) => pickForm(n.lv[Math.min(Math.max(d, 1), 3)]);
    HINTS_EXTRA[n.id] = n.hint;
    LESSONS_EXTRA[n.id] = n.lesson;
    if (typeof COMPS !== "undefined") COMPS[n.id] = n.comps;
    if (typeof PROB_EXTRA !== "undefined") PROB_EXTRA[n.id] = PROBS[n.id];
  }
})();
