# Optimisation, 2e passe (14.11) : contextes moins répétitifs + étiquettes ctx (anti-répétition dans Engine.make). Archive.
p = 'src/gen3.js'; s = open(p).read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:70], s.count(a)); s = s.replace(a, b)
# Niveau 2 : étiquettes et habillages variés
rep(r'''if (v === 0) { const k = R.int(1, 6), h0 = R.int(0, 2), askT = R.rand() < 0.4, H = 5 * k * k + h0;
          return Object.assign(QV("La hauteur (en m) d'une balle lancée vers le haut est "''',
    r'''if (v === 0) { const k = R.int(1, 6), [obj, h0] = R.pick([["d'une balle lancée vers le haut", R.int(1, 2)], ["d'un ballon de volley frappé vers le haut", 2], ["d'une fusée de feu d'artifice", 0], ["d'un plongeur qui saute d'un plongeoir de 3 m", 3], ["d'une balle de tennis lobée", 1]]), askT = R.rand() < 0.4, H = 5 * k * k + h0;
          return Object.assign(QV("La hauteur (en m) " + obj + " est "''')
rep(r'''[GS("Le sommet est atteint pour " + M("t = -\\frac{b}{2a} = \\frac{" + 10 * k + "}{10}") + " = ?"''', r'''ctx: "vertical", guide: [GS("Le sommet est atteint pour " + M("t = -\\frac{b}{2a} = \\frac{" + 10 * k + "}{10}") + " = ?"''')
rep(r'''{ guide: [GS("Distance du point le plus haut''', r'''{ ctx: "jet", guide: [GS("Distance du point le plus haut''')
rep(r'''return Object.assign(QV("Un artisan vend des bols. Son bénéfice''', r'''const [qui, quoi] = R.pick([["Un artisan", "des bols"], ["Une élève", "des bracelets sur un marché"], ["Un club de sport", "des t-shirts à son logo"], ["Une petite marque", "des coques de téléphone"]]);
          return Object.assign(QV(qui + " vend " + quoi + ". Le bénéfice''')
rep(r'''{ guide: [GS("Le maximum est au sommet''', r'''{ ctx: "benefice", guide: [GS("Le maximum est au sommet''')
rep(r'''return Object.assign(QV("Pour un concert, la recette''', r'''const ev = R.pick(["un concert", "un match de hockey", "une soirée de gaming en salle", "un spectacle d'humour"]);
          return Object.assign(QV("Pour " + ev + ", la recette''')
rep(r'''{ guide: [GS("Sommet : " + M("p = -\\frac{b}{2a}''', r'''{ ctx: "recette", guide: [GS("Sommet : " + M("p = -\\frac{b}{2a}''')
rep(r'''{ guide: [GS(M("a = " + a) + " est positif''', r'''{ ctx: "cout", guide: [GS(M("a = " + a) + " est positif''')
# Niveau 3 : nouvelle répartition (rectangle 1 fois sur 6)
i = s.index('      // Niveau 3 : on écrit soi-même la fonction (5 situations).')
j = s.index('    ] },', i)
s = s[:i] + r'''      // Niveau 3 : on écrit soi-même la fonction. Contextes variés (règle du 14.11) : le rectangle (enclos…) seulement 1 fois sur 6.
      () => { const v = R.pick(["rect", "prix", "prix", "verger", "verger", "nombres"]);
        if (v === "rect") { const w = R.int(0, 3);
          if (w === 0) { const L = 4 * R.int(3, 15);
            return Object.assign(QV("Avec " + M(L) + " m de clôture, on délimite un enclos rectangulaire. Quelle est l'aire maximale possible (en m²) ?", (L / 4) ** 2, "Côtés " + M("x") + " et " + M(L / 2 + " - x") + " : aire " + M("x(" + L / 2 + " - x)") + ", maximale pour " + M("x = " + L / 4) + " (carré) : " + M((L / 4) ** 2) + " m²."), { ctx: "rect", guide: [
              GS("Si un côté mesure " + M("x") + ", l'autre mesure " + M("\\frac{" + L + "}{2} - x") + ". Pour " + M("x = 1") + ", quelle est l'aire ?", L / 2 - 1, M("1 \\cdot " + (L / 2 - 1) + " = " + (L / 2 - 1)) + " m² : " + M("A(x) = x(" + L / 2 + " - x) = " + poly([-1, L / 2, 0])) + "."), GS("Sommet : " + M("x = \\frac{" + L / 2 + "}{2}") + " = ?", L / 4, M("x = " + L / 4) + " m : c'est un carré."), GS("Aire maximale ?", (L / 4) ** 2, M(L / 4 + " \\cdot " + L / 4 + " = " + (L / 4) ** 2) + " m².")] }); }
          if (w === 1) { const L = 4 * R.int(3, 15);
            return Object.assign(QV("Avec " + M(L) + " m de barrière, on installe une terrasse rectangulaire contre la façade d'un café (pas de barrière le long de la façade). Quelle est l'aire maximale de la terrasse (en m²) ?", L * L / 8, "Largeur " + M("x") + ", longueur " + M(L + " - 2x") + " : aire " + M("x(" + L + " - 2x)") + ", maximale pour " + M("x = " + L / 4) + " : " + M(L / 4 + " \\cdot " + L / 2 + " = " + L * L / 8) + " m²."), { ctx: "rect", guide: [
              GS("Deux largeurs " + M("x") + " et une longueur " + M(L + " - 2x") + ". Pour " + M("x = 1") + ", quelle est l'aire ?", L - 2, M("1 \\cdot " + (L - 2) + " = " + (L - 2)) + " m² : " + M("A(x) = x(" + L + " - 2x) = " + poly([-2, L, 0])) + "."), GS("Sommet : " + M("x = -\\frac{" + L + "}{-4}") + " = ?", L / 4, M("x = " + L / 4) + " m (longueur " + M(L / 2) + " m)."), GS("Aire maximale ?", L * L / 8, M(L / 4 + " \\cdot " + L / 2 + " = " + L * L / 8) + " m².")] }); }
          if (w === 2) { const W = 4 * R.int(4, 10);
            return Object.assign(QV("On plie une bande de tôle de " + M(W) + " cm de large pour faire une gouttière : on relève deux bords de " + M("x") + " cm à angle droit. Quelle est l'aire maximale de la section de la gouttière (en cm²) ?", W * W / 8, "Section " + M("x(" + W + " - 2x)") + ", maximale pour " + M("x = " + W / 4) + " : " + M(W / 4 + " \\cdot " + W / 2 + " = " + W * W / 8) + " cm²."), { ctx: "rect", guide: [
              GS("Le fond mesure " + M(W + " - 2x") + " cm. Pour " + M("x = 2") + ", quelle est l'aire de la section ?", 2 * (W - 4), M("2 \\cdot " + (W - 4) + " = " + 2 * (W - 4)) + " cm² : " + M("A(x) = x(" + W + " - 2x)") + "."), GS("Sommet : " + M("x = \\frac{" + W + "}{4}") + " = ?", W / 4, M("x = " + W / 4) + " cm."), GS("Aire maximale ?", W * W / 8, M(W / 4 + " \\cdot " + W / 2 + " = " + W * W / 8) + " cm².")] }); }
          const q = R.int(2, 6), L = 12 * q;
          return Object.assign(QV("Avec " + M(L) + " m de clôture, un éleveur délimite un champ rectangulaire coupé en deux enclos par une clôture parallèle à la largeur (3 largeurs et 2 longueurs en tout). Quelle est l'aire totale maximale (en m²) ?", L * L / 24, "Largeur " + M("x") + ", longueur " + M("\\frac{" + L + " - 3x}{2}") + " : aire maximale pour " + M("x = " + L / 6) + " : " + M(L / 6 + " \\cdot " + L / 4 + " = " + L * L / 24) + " m²."), { ctx: "rect", guide: [
            GS("Trois largeurs " + M("x") + " : il reste " + M(L + " - 3x") + " m pour deux longueurs. Pour " + M("x = 2") + ", quelle est la longueur ?", (L - 6) / 2, M("\\frac{" + L + " - 6}{2} = " + (L - 6) / 2) + " m : " + M("A(x) = x \\cdot \\frac{" + L + " - 3x}{2} = -\\frac{3}{2}x^2 + " + L / 2 + "x") + "."),
            GS("Sommet : " + M("x = -\\frac{b}{2a} = \\frac{" + L / 2 + "}{3}") + " = ?", L / 6, M("x = " + L / 6) + " m."), GS("Longueur " + M("\\frac{" + L + " - " + L / 2 + "}{2} = " + L / 4) + " m. Aire maximale ?", L * L / 24, M(L / 6 + " \\cdot " + L / 4 + " = " + L * L / 24) + " m².")] }); }
        if (v === "prix") { const kk = R.pick([10, 20, 25]), xs = R.int(1, 4), P0 = R.int(12, 20), N0 = P0 * kk - 2 * kk * xs; if (N0 < 40) return GEN.optim(3);
          const [lieu, unite, gens] = R.pick([["Au cinéma, avec des billets à", "billet", "spectateurs"], ["Un food truck vend ses burgers", "burger", "clients par soir"], ["Une salle d'escalade fait payer l'entrée", "entrée", "grimpeurs par semaine"], ["Un festival vend ses pass journée", "pass", "festivaliers"], ["Un escape game fait payer", "partie", "joueurs par semaine"]]);
          return Object.assign(QV(lieu + " " + M(P0) + " CHF : il y a " + M(N0) + " " + gens + ". Chaque baisse de 1 CHF en attire " + M(kk) + " de plus. Quel prix rend la recette maximale (en CHF) ?", P0 - xs, "Baisse " + M("x") + " : recette " + M("R(x) = (" + P0 + " - x)(" + N0 + " + " + kk + "x)") + ", maximale pour " + M("x = " + xs) + " : prix " + M(P0 - xs) + " CHF."), { ctx: "prix", guide: [
            GS("Avec une baisse de " + M("x") + " CHF, la recette est " + M("R(x) = (" + P0 + " - x)(" + N0 + " + " + kk + "x)") + ". Pour " + M("x = 1") + ", combien vaut-elle (en CHF) ?", (P0 - 1) * (N0 + kk), M((P0 - 1) + " \\cdot " + (N0 + kk) + " = " + (P0 - 1) * (N0 + kk)) + " CHF."),
            GS("Développée : " + M("R(x) = " + poly([-kk, P0 * kk - N0, P0 * N0])) + ". Baisse optimale : " + M("x = -\\frac{b}{2a}") + " = ?", xs, M("x = \\frac{" + (P0 * kk - N0) + "}{" + 2 * kk + "} = " + xs) + " CHF."), GS("Prix par " + unite + " ?", P0 - xs, M(P0 + " - " + xs + " = " + (P0 - xs)) + " CHF.")] }); }
        if (v === "verger") { const k = R.pick([2, 4, 5]), xs = R.int(2, 8), N0 = R.int(20, 40), Y = k * N0 + 2 * k * xs;
          const [cadre, unite, prod, chaque] = R.pick([["Dans un verger, " + N0 + " pommiers donnent chacun " + Y + " kg de pommes.", "pommier", "kg", "chaque pommier donne " + k + " kg de moins"], ["Un apiculteur a " + N0 + " ruches ; chacune produit " + Y + " kg de miel.", "ruche", "kg", "chaque ruche produit " + k + " kg de moins (les fleurs sont partagées)"], ["Dans une serre, " + N0 + " plants de tomates donnent chacun " + Y + " tomates.", "plant", "tomates", "chaque plant donne " + k + " tomates de moins"]]);
          const tot = (N0 + xs) * (Y - k * xs);
          return Object.assign(QV(cadre + " Pour chaque " + unite + " ajouté, " + chaque + ". Combien en faut-il en tout pour que la production totale soit maximale ?", N0 + xs, "Avec " + M("x") + " de plus : " + M("P(x) = (" + N0 + " + x)(" + Y + " - " + k + "x)") + ", maximale pour " + M("x = " + xs) + " : " + M(N0 + xs) + " en tout (" + M(tot) + " " + prod + ")."), { ctx: "verger", guide: [
            GS("Avec " + M("x") + " " + unite + "s de plus, la production totale est " + M("P(x) = (" + N0 + " + x)(" + Y + " - " + k + "x)") + ". Pour " + M("x = 1") + ", combien vaut-elle ?", (N0 + 1) * (Y - k), M((N0 + 1) + " \\cdot " + (Y - k) + " = " + (N0 + 1) * (Y - k)) + " " + prod + "."),
            GS("Développée : " + M("P(x) = " + poly([-k, Y - k * N0, N0 * Y])) + ". Le maximum est pour " + M("x = -\\frac{b}{2a}") + " = ?", xs, M("x = \\frac{" + (Y - k * N0) + "}{" + 2 * k + "} = " + xs) + "."), GS("Nombre total ?", N0 + xs, M(N0 + " + " + xs + " = " + (N0 + xs)) + ".")] }); }
        if (R.rand() < 0.5) { const S = 2 * R.int(6, 25);
          return Object.assign(QV("La somme de deux nombres vaut " + M(S) + ". Quel est le plus grand produit possible de ces deux nombres ?", S * S / 4, "Nombres " + M("x") + " et " + M(S + " - x") + " : produit " + M("x(" + S + " - x)") + ", maximal pour " + M("x = " + S / 2) + " : " + M(S * S / 4) + "."), { ctx: "nombres", guide: [
            GS("Si le premier nombre est " + M("x") + ", le second est " + M(S + " - x") + ". Le produit " + M("P(x) = x(" + S + " - x)") + " est maximal au sommet : " + M("x") + " = ?", S / 2, M("x = \\frac{" + S + "}{2} = " + S / 2) + " : les deux nombres sont égaux."), GS("Produit maximal ?", S * S / 4, M(S / 2 + " \\cdot " + S / 2 + " = " + S * S / 4) + ".")] }); }
        const dd = 2 * R.int(3, 12);
        return Object.assign(QV("Deux nombres ont une différence de " + M(dd) + ". Quel est le plus petit produit possible de ces deux nombres ?", -(dd * dd) / 4, "Nombres " + M("x") + " et " + M("x + " + dd) + " : produit " + M("x^2 + " + dd + "x") + ", minimal pour " + M("x = " + -dd / 2) + " : " + M(par(-dd / 2) + " \\cdot " + dd / 2 + " = " + -(dd * dd) / 4) + "."), { ctx: "nombres", guide: [
          GS("Nombres " + M("x") + " et " + M("x + " + dd) + " : produit " + M("P(x) = x^2 + " + dd + "x") + ". Minimum en " + M("x = -\\frac{b}{2a}") + " = ?", -dd / 2, M("x = -\\frac{" + dd + "}{2} = " + -dd / 2) + " : les nombres sont " + M(-dd / 2) + " et " + M(dd / 2) + "."), GS("Produit minimal ?", -(dd * dd) / 4, M(par(-dd / 2) + " \\cdot " + dd / 2 + " = " + -(dd * dd) / 4) + ".")] }); },
''' + s[j:]
open(p, 'w').write(s)
# Anti-répétition des contextes dans Engine.make
p = 'src/engine.js'; s = open(p).read()
rep(r'''    for (let k = 0; k < 8; k++) { q = this.build(id, level); if (!rec.includes(key(q))) break; }
    rec.push(key(q)); state.recentQ[id] = rec.slice(-15);''',
    r'''    // Contextes variés (règle du 14.11) : un contexte (q.ctx) vu dans les 3 dernières questions de la notion est évité.
    const ctxs = ((state.recentCtx = state.recentCtx || {})[id] = (state.recentCtx[id] || []));
    for (let k = 0; k < 12; k++) { q = this.build(id, level); if (!rec.includes(key(q)) && !(q.ctx && ctxs.includes(q.ctx))) break; }
    rec.push(key(q)); state.recentQ[id] = rec.slice(-15);
    if (q.ctx) state.recentCtx[id] = [...ctxs, q.ctx].slice(-3);''')
open(p, 'w').write(s)
print("optim 2e passe appliquée")
