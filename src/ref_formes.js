/* 27.11 (décision de l'enseignant, n° 22 de tools/archive/a_decider_26-11.md) : « Me tester » ciblé par FORME pour tous les
   référentiels, comme pour les objectifs MP (table FORMES de tools/ref_mp.py). Quand une notion sert plusieurs objectifs,
   chaque objectif ne tire que les formes de question (ctx du générateur) qui le concernent ; un objectif absent de la
   table, ou une notion absente de son entrée, garde toutes les formes. Une liste vide retire la notion du test de
   l'objectif (probeq niveau 3 : problèmes du 1er degré, pas du 2e). Lu par Referentiel.plan et par « Me tester »
   (src/referentiel.js, src/app.js : champ f des données du référentiel).
   Données séparées par référentiel (Collège REF_MATU, France REF_FR, CO REF_CO) ; ajoutées aux tables générées
   (src/ref_matu.js, ref_fr.js, ref_co.js), qui ne les contiennent pas : une régénération par tools/ref_*.py ne les efface pas.
   Traité le 27.11 : les objectifs de 1re Collège, de 4e et 3e françaises et du CO (9e–11e) qui partagent une notion à
   formes étiquetées. Le reste (autres années, notions sans ctx) : liste dans tools/archive/a_decider_26-11.md, n° 22. */
const REF_FORMES = {
  /* ---------- Collège de Genève, 1re (REF_MATU) ---------- */
  MATU: {
    "1.AL.01b": { polyop: ["moins-parenthese", "difference-carres", "carre-moins-produit", "erreur"] },
    "1.AL.01c": { polyop: ["double-distrib", "moins-parenthese"] },
    "1.AL.02a": { polyop: ["difference-carres", "carre-moins-produit", "erreur"], idrem: ["diff2", "deuxlettres", "erreur", "coef", "diffcarres", "racines", "mental"] },
    "1.AL.02b": { idrem: ["completer"] },
    "1.AL.02c": { polyop: ["identite-carre", "identite-diff", "difference-carres", "carre-moins-produit", "erreur", "cube", "identite-x2"] },
    "1.AL.03b": { factor: ["diffcarres", "diffcarres2", "carre", "maximal", "cube"], factor2: ["diff-carres", "carre-parfait", "diff-carres-bloc", "evidence-puis-diff", "x4"] },
    "1.AL.03c": { factor: ["trinome", "trinome-complete", "erreur"] },
    "1.AL.03d": { factor2: ["groupement"] },
    "1.AL.06a": { eq3: ["evidence", "x2-evidence", "produit", "ramener", "x2-ramener", "carre-parfait", "trinome", "facteur-positif", "erreur", "facteur-num", "racines"] },
    "1.AL.06b": { eq3: ["groupements", "carre-parfait", "racines"] },
    "1.AL.07a": { sys2: ["subst", "piscine", "cinema", "abonnement", "droite"] },
    "1.AL.07b": { sys2: ["addition", "combin", "fraction", "ordonner", "erreur", "fracsys", "piscine", "cinema", "abonnement", "droite"] },
    "1.FO.01a": { domaine: ["frac", "frac-lin", "frac-produit", "frac-carre", "frac-tri"] },
    "1.FO.01b": { domaine: ["racine", "racine-neg", "racine-tri-ext", "racine-tri-int", "inv-racine"] },
    "1.FO.01c": { domaine: ["inv-racine", "racine-frac"] },
    "1.FO.03a": { fimg: ["image-poly", "lire-image", "erreur", "image-racine"] },
    "1.FO.03b": { fimg: ["preimage-tri", "preimage-aff", "preimage-carre"] },
    "1.FO.03c": { fimg: ["ordonnee-origine", "zeros-calcul", "axes-triangle"] },
    "1.FO.04a": { fimg: ["lire-image", "lire-preimages"] },
    "1.FO.04b": { lectgraph: ["zero", "nb-zeros", "signe-graph"] },
    "1.FO.04c": { lectgraph: ["max-intervalle", "valeur-min", "min-intervalle", "valeur-max", "decroissance", "max-local", "variations"] },
    "1.FO.04d": { lectgraph: ["lire-antecedent", "nb-solutions", "f-sup-g", "f-egal-g", "signe-graph", "symetrie"] },
    "1.FO.05a": { affine: ["graphe", "pente-fraction", "expression-lue"] },
    "1.FO.05b": { affine: ["temperature", "forfaits", "expression-fraction", "parallele"] },
    "1.FO.05c": { affine: ["expression-lue", "graphe", "pente-fraction", "expression-fraction"] },
    "1.FO.06a": { affine: ["expression-lue", "expression-fraction", "graphe", "pente-fraction"] },
    "1.FO.06b": { affine: ["expression", "parallele", "temperature"] },
    "1.FO.07a": { f2: ["zeros-lus", "zeros", "ordonnee"] },
    "1.FO.07b": { f2: ["sommet-dev", "axe-sym", "min", "max", "canonique-lue", "sommet-frac", "zeros-sommet", "a-sommet-point"] },
    "1.FO.08a": { f2expr: ["zeros-a", "zeros-ordonnee"] },
    "1.FO.08b": { f2expr: ["sommet-point", "graph-sommet"] },
    "1.FO.09a": { inter: ["deux-droites-graphe", "deux-droites"] },
    "1.FO.09b": { inter: ["point", "x2-droite", "general", "point-droite", "delta", "tangente-h", "distance", "coef-a"] },
    "1.FO.09c": { interpar: ["symetriques", "opposees", "coef2", "meme-a", "canon-symetrie", "delta-paraboles", "point-paraboles"] },
    "1.FO.11c": { interpar: ["hyperbole", "hyperbole-droite", "delta-paraboles"] },
    "1.FO.11a": { racinv: ["sqrt-const", "sqrt-lin"] },
    "1.FO.11b": { racinv: ["inv-aff"] },
    "1.FO.12b": { optim: ["vertical", "cout", "recette", "benefice", "jet", "rect", "nombres", "verger", "prix"] },
    "1.FO.12d": { modaff: ["taxi", "abonnement", "location", "benefice", "bougie", "reservoir"] },
    "1.GE.01a": { angles: ["deux-etapes", "equation", "plat", "chaine-proprietes"] },
    "1.GE.01c": { angles: ["centre", "inscrit", "meme-arc", "isocele"] },
    "1.GE.03a": { simil: ["perimetre", "kdepuisaire", "hom-longueur", "hom-centre", "hom-neg"] },
    "1.GE.03c": { simil: ["maquette", "hom-aire", "aire-perimetre", "erreur", "aire"] },
    "1.GE.04b": { droitesrem: ["circonscrit", "inscrit", "equilateral-R", "orthocentre", "AIB", "bissectrices", "hauteur"] },
    "1.GE.04c": { droitesrem: ["GM", "CG", "mediane", "mediatrice-pythagore", "isocele-G", "circonscrit"] },
    "1.GE.05a": { trigo: ["tan-opp", "cos-adj", "sin-opp", "asin", "atan", "hyp", "erreur"] },
    "1.GE.05c": { trigo: ["asin", "atan"] },
    "1.GE.05e": { trigexact: ["sin30", "cos45", "sin60", "tan30", "aire-equi", "pythagore-trig"] },
    "1.GE.06b": { trigexact: ["pente-45", "pente-30", "pente-60", "angle-pente", "denivele"] },
  },
  /* ---------- France, 4e et 3e (REF_FR) ---------- */
  FR: {
    "4e.NC.01": { puiss: ["dix", "erreur", "decomp"] },
    "4e.NC.06": { puiss: ["prod", "pp", "quot", "signe", "astuce", "erreur", "decomp"] },
    "4e.NC.07": { puiss: ["dix", "erreur"] },
    "4e.NC.02": { sci: ["versdec", "petit", "cheveu", "grand", "virus", "bacterie", "dist", "coeur", "renorm", "comparer", "renorm-petit", "somme"] },
    "4e.NC.03": { sci: ["mg", "km6", "um", "nm"] },
    "4e.NC.04": { carres: ["carre", "chaises", "encadrer", "racine", "aire", "potager"] },
    "4e.NC.05": { carres: ["racine", "decimal", "carre-3chiffres", "somme-carres", "racine-somme", "aire", "potager"] },
    "4e.NC.09": { racenc: ["encadre-bas", "encadre-haut", "proche", "compte-n", "plus-grand-n", "entre-racines", "comparer", "ranger", "comparer-coef"] },
    "4e.NC.15": { racenc: ["dixieme", "proche"] },
    "4e.NC.10": { ordgr: ["essence", "partage"] },
    "4e.NC.17": { ordgr: ["verifier", "produit", "fois-decimal", "quotient", "essence", "partage"] },
    "4e.NC.12": { fracops: ["diff-negative", "produit", "quotient", "parenthese", "div-entier", "priorite", "carre", "fraction-etagee"] },
    "4e.NC.14": { fracops: ["reservoir"] },
    "4e.DP.04": { proba: ["tombola", "au-moins-pieces3", "au-moins-de3", "au-moins-de2"] },
    "3e.NC.02": { autodnb: ["fractions", "fractions-puissances", "puissances", "proba", "evolution", "evolutions"] },
    "3e.NC.10": { autodnb: ["identite"], factor: ["diffcarres", "diffcarres2", "maximal", "cube"] },
    "3e.PF.01": { linfn: ["image", "antecedent", "coef", "contexte-tgv", "contexte-cable", "contexte-fromage", "point", "somme-images"] },
    "3e.PF.12": { linfn: ["image", "antecedent", "coef", "contexte-tgv", "contexte-cable", "contexte-fromage", "point", "somme-images"] },
    "3e.PF.02": { linfn: ["pourcentage-soldes", "pourcentage-facture", "pourcentage-population", "composition"] },
    "3e.PF.09": { linfn: ["point", "intersection", "coef"], affine: ["image-lue", "b-lu", "expression-lue", "graphe", "pente-fraction", "expression-fraction", "f-sup-g-droites"] },
    "3e.PF.10": { affine: ["b-lu", "graphe", "pente-fraction", "expression-lue", "expression-fraction", "parallele"] },
    "3e.PF.05": { fimg: ["lire-image", "lire-preimages", "ordonnee-origine"] },
    "3e.PF.06": { fimg: ["image-poly", "lire-image", "erreur", "image-racine", "compose", "ordonnee-origine", "parametre"] },
    "3e.PF.07": { fimg: ["lire-preimages"] },
    "3e.PF.08": { fimg: ["preimage-aff", "preimage-carre"] },
    "3e.GM.04": { gquot: ["sable", "neige", "sapin", "pierre", "plomb-bijou", "verre-bijou", "classe", "chambre", "musique", "cuve", "aquarium", "piscine", "arrosoir", "fontaine", "bouteille", "douche", "cuisine", "jardin"] },
    "3e.GM.05": { ucomp: ["erreur"] },
    "3e.EG.01": { simil: ["aire", "perimetre", "hom-aire", "maquette", "aire-perimetre", "homothetie", "hom-longueur", "hom-OA", "erreur", "kdepuisaire"] },
    "3e.EG.02": { simil: ["carte", "cote", "rapport", "perimetre", "maquette"] },
    "3e.EG.05": { simil: ["cote", "hom-k", "hom-kneg", "homothetie"] },
    "3e.EG.07": { simil: ["hom-k", "hom-image", "hom-OA", "hom-longueur", "hom-centre", "hom-neg", "hom-kneg", "hom-aire", "homothetie", "hom-trouve-centre"] },
  },
  /* ---------- Cycle d'orientation, 9e–11e (REF_CO) ---------- */
  CO: {
    /* 26.11 (revue p6, n° 12) : triangles et quadrilatères sans les polygones réguliers ; 27.11 (n° 26) : ceux-ci vont à 31-FG2 */
    "31-FG1": { angtri: ["quadrilatere", "isocele", "triangle", "sommet", "parallelogramme", "exterieur", "proportion", "trois-egaux", "trapeze", "ecarts"] },
    "31-FG2": { angtri: ["polygone", "nb-cotes"] },
    "31-SO2": { volcone: ["sphere-boule", "revol-diametre", "revolution", "section-forme", "generatrice", "section-rayon", "rayon-depuis-g", "coupe-axiale", "section-distance"] },
    "34-CG9": { volcone: ["boule", "cone", "pyr", "demiboule", "erreur", "cornet", "pyrrect", "pyrcube", "boule3", "sphere", "conegen", "cyl", "cube"] },
    "31-TR3": { simil: ["hom-k", "hom-kneg", "hom-trouve-centre", "hom-OA"] },
    "31-TR8": { simil: ["hom-image", "hom-centre", "hom-neg", "hom-longueur", "homothetie", "hom-aire"] },
    "34-CG13": { simil: ["carte", "cote", "rapport", "erreur", "perimetre", "kdepuisaire", "aire", "maquette", "aire-perimetre"] },
    "32-NB8": { rac: ["encadrer"] },
    "32-CA9": { rac: ["carre-parfait", "carrelage", "jardin", "racine-fraction", "terrain", "racine-decimal", "erreur", "perimetre-tapis", "perimetre-champ", "perimetre-salle"] },
    "33-FO1": { fctlec: ["reco-tableau", "reco-situation", "reco-graphe", "coef-graphe"] },
    "33-FO2": { fctlec: ["lire-max", "duree-hausse", "lire-image", "difference", "taux-moyen", "coef-graphe"] },
    "33-FO4": { affine: ["antecedent", "parallele", "f-sup-g-droites", "temperature", "forfaits"] },
    "33-FO5": { affine: ["expression", "expression-lue", "graphe", "pente-fraction", "expression-fraction"] },
    "33-EQ3": { probeq: [] },
    "34-CG6": { vol: ["pave"] },
    "34-CG7": { vol: ["aquarium", "trapeze", "bac", "prisme"] },
    "34-CG8": { vol: ["tuyau", "airecyl", "cylindre", "canette", "verre", "conserve"] },
  },
};
(function () {
  const D = { MATU: typeof REF_MATU !== "undefined" ? REF_MATU : null, FR: typeof REF_FR !== "undefined" ? REF_FR : null, CO: typeof REF_CO !== "undefined" ? REF_CO : null };
  for (const k in REF_FORMES) {
    const R = D[k];
    if (!R) continue;
    R.f = R.f || {};
    for (const code in REF_FORMES[k]) R.f[code] = Object.assign({}, R.f[code] || {}, REF_FORMES[k][code]);
  }
  /* 27.11 (n° 26) : polygones réguliers (angtri, niveau 3 : « polygone », « nb-cotes ») rattachés à 31-FG2 « polygones
     réguliers » (aussi dans tools/ref_co.py). */
  if (D.CO && D.CO.q && D.CO.q["31-FG2"] && !D.CO.q["31-FG2"].includes("angtri@3")) D.CO.q["31-FG2"].push("angtri@3");
})();
