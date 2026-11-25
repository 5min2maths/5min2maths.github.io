// 26.11 · Leçons actives du chapitre « 3. Argumenter » de 1re Collège (notions de src/ch1c_arg.js : tradalg, contrex,
// demoalg, implication), les seules notions de 1re qui n'en avaient pas (tableau de suivi). Format court (règle de
// l'enseignant : resserrer) : Devine → Retiens → « À toi : 2 questions » (réponse tapée, coup de pouce après une erreur).
// Outils : TRX (src/trx.js) ; paquet « 12 » (préfixe ch1c dans build.py).
(function () {
  if (typeof TRX === "undefined") return;
  const { actReg, W, toi } = TRX;
  actReg({
    tradalg: {
      retiens: { regle: "Avec un entier \\(n\\) : un nombre pair s'écrit \\(2n\\), un impair \\(2n + 1\\), trois entiers consécutifs \\(n\\), \\(n + 1\\), \\(n + 2\\), un multiple de 5 \\(5n\\).",
        exemple: ["Somme de trois entiers consécutifs : \\(n + (n + 1) + (n + 2) = 3n + 3\\).", "Deux impairs consécutifs : \\(2n + 1\\) et \\(2n + 3\\)."],
        piege: "Deux impairs consécutifs ne s'écrivent pas \\(2n + 1\\) et \\(2n + 2\\) : d'un impair au suivant, on ajoute 2." },
      predict: { q: "Comment écrire « un nombre impair » avec un entier \\(n\\) ?", choices: ["\\(2n + 1\\)", "\\(n + 1\\)", "\\(2n\\)"], good: 0,
        why: "\\(2n\\) est toujours pair ; en ajoutant 1, on obtient un impair. \\(n + 1\\) peut être pair (si \\(n\\) est impair)." },
      defis: ["Trois entiers consécutifs \\(n\\), \\(n + 1\\), \\(n + 2\\) : avec \\(n = 7\\), que vaut leur somme ?", "Deux impairs consécutifs \\(2n + 1\\) et \\(2n + 3\\) : avec \\(n = 4\\), que vaut leur somme ?"],
      play: toi(["7 + 8 + 9", "2 · 4 + 1 = 9 et 2 · 4 + 3 = 11"], [W(24, "7 + 8 + 9 = 24, et la formule donne bien 3 · 7 + 3 = 24."), W(20, "9 + 11 = 20 : (2n + 1) + (2n + 3) = 4n + 4, ici 4 · 4 + 4 = 20.")]) },
    contrex: {
      retiens: { regle: "Un seul contre-exemple suffit à prouver qu'une affirmation « pour tout… » est fausse ; des exemples, même nombreux, ne prouvent pas qu'elle est vraie.",
        exemple: ["« \\(n^2 + n + 41\\) est toujours premier » : faux pour \\(n = 40\\), car \\(40^2 + 40 + 41 = 1681 = 41^2\\).", "« Tout nombre premier est impair » : faux, 2 est premier et pair."],
        piege: "Vérifier sur quelques cas ne démontre rien : il faut une démonstration, ou un contre-exemple pour réfuter." },
      predict: { q: "« Pour tout entier \\(n \\ge 0\\), \\(n^2 + n + 41\\) est premier. » C'est vrai de \\(n = 0\\) à \\(n = 10\\). Est-ce démontré ?",
        choices: ["non : il faut une démonstration, et un contre-exemple existe peut-être", "oui : onze cas suffisent", "oui, si on vérifie jusqu'à 20"], good: 0,
        why: "C'est vrai jusqu'à \\(n = 39\\), puis faux pour \\(n = 40\\). Des exemples ne prouvent jamais un « pour tout »." },
      defis: ["Pour \\(n = 40\\), \\(n^2 + n + 41 = 1681\\). Ce nombre est le carré de quel entier ?", "« Tout nombre premier est impair. » Tape le contre-exemple."],
      play: toi(["1681 = 1600 + 81 : essaie 41 · 41", "cherche un nombre premier qui est pair"], [W(41, "1681 = 41 · 41 : ce n'est pas un nombre premier. L'affirmation est fausse."), W(2, "2 est premier (diviseurs 1 et 2) et pair : un seul contre-exemple suffit.")]) },
    demoalg: {
      retiens: { regle: "Pour démontrer « pour tout entier » : écrire les nombres avec une lettre, calculer, puis reconnaître la forme voulue (\\(3 \\cdot\\) un entier, \\(2k + 1\\)…).",
        exemple: ["\\(n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)\\) : la somme de trois entiers consécutifs est un multiple de 3.", "\\((2k + 1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\\) : le carré d'un impair est impair."],
        piege: "Un exemple illustre, il ne démontre pas ; la forme \\(3(n + 1)\\), elle, vaut pour tous les \\(n\\)." },
      predict: { q: "La somme de trois entiers consécutifs est toujours…", choices: ["un multiple de 3", "un nombre pair", "un multiple de 6"], good: 0,
        why: "\\(n + (n + 1) + (n + 2) = 3(n + 1)\\). Elle n'est pas toujours paire : \\(1 + 2 + 3 = 6\\), mais \\(2 + 3 + 4 = 9\\)." },
      defis: ["\\(n + (n + 1) + (n + 2) = 3(n + 1)\\). Avec \\(n = 12\\) : calcule la somme, divise-la par 3 et tape le quotient.", "\\((2k + 1)^2 = 4k^2 + 4k + 1\\). Pour \\(k = 3\\), que vaut \\((2k + 1)^2\\) ?"],
      play: toi(["12 + 13 + 14 = 39, puis 39 ÷ 3", "2 · 3 + 1 = 7, puis 7²"], [W(13, "39 ÷ 3 = 13 = n + 1 : c'est exactement ce que dit 3(n + 1)."), W(49, "7² = 49, et 4 · 9 + 4 · 3 + 1 = 49 : impair, comme prévu.")]) },
    implication: {
      retiens: { regle: "« Si P, alors Q ». Réciproque : « si Q, alors P » (elle peut être fausse). Contraposée : « si non Q, alors non P » (elle dit la même chose que l'implication).",
        exemple: ["« Si \\(n\\) est multiple de 4, alors \\(n\\) est pair » : vrai. Réciproque « si \\(n\\) est pair, alors multiple de 4 » : fausse (6).", "Contraposée : « si \\(n\\) est impair, alors \\(n\\) n'est pas multiple de 4 » : vraie."],
        piege: "Une implication vraie n'a pas forcément une réciproque vraie : il faut la vérifier à part." },
      predict: { q: "« Si \\(n\\) est multiple de 4, alors \\(n\\) est pair. » Sa réciproque est…",
        choices: ["« si \\(n\\) est pair, alors \\(n\\) est multiple de 4 », qui est fausse", "« si \\(n\\) est impair, alors \\(n\\) n'est pas multiple de 4 »", "toujours vraie, comme l'implication"], good: 0,
        why: "La réciproque échange les deux parties ; 6 est pair sans être multiple de 4. La 2e proposition est la contraposée." },
      defis: ["Réciproque fausse : donne un entier entre 5 et 9 qui est pair sans être multiple de 4.", "« Si un triangle est rectangle en C, alors \\(c^2 = a^2 + b^2\\). » Avec \\(a = 5\\), \\(b = 12\\), \\(c = 14\\) : tape \\(c^2 - (a^2 + b^2)\\)."],
      play: toi(["6 ou 8 : lequel n'est pas multiple de 4 ?", "14² = 196 et 5² + 12² = 169"], [W(6, "6 est pair, mais 6 ÷ 4 n'est pas entier : la réciproque est fausse."), W(27, "196 − 169 = 27 ≠ 0 : c² ≠ a² + b², donc (contraposée) le triangle n'est pas rectangle en C.")]) },
  });
})();
