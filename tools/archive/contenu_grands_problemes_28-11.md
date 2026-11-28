# /contenu — grands problèmes de 11e et de 1re Collège (28.11)

Décision de l'enseignant (28.11) : pas assez de GRANDS problèmes (≥ 4 parties, en situation, au programme :
`Engine.probKind`) pour ≈ 35 semaines sans répétition. Moyen retenu : une 4e partie qui a du sens ajoutée aux problèmes
riches de 3 parties existants (même contexte `ctx`) ; quelques nouveaux là où il n'y avait rien. Branche `agent/contenu6`.

## Mesure (même méthode que `archive/contenu_probleme_28-11.md` : formes distinctes, 40 graines, notions de l'année)

| classe | grands avant | grands après | notions à grand problème | année simulée (35 semaines) : formes distinctes |
|---|---|---|---|---|
| 11e | 15 | **33** | 9 → 23 | 15 → **33** (2 formes revues avec d'autres nombres) |
| 1re Collège | 11 | **26** | 5 → 18 | 11 → **26** (9 formes revues avec d'autres nombres) |

Année simulée : sondes non commitées `tests/_inv_gp.html`, `tests/_annee_gp.html` (toutes les notions travaillées,
Mathélo 900 / 1200 / 1500, mêmes résultats) ; 35 grands problèmes sur 35 semaines, jamais deux fois le même code.
Pour 35 formes sans aucune reprise : 2 de plus en 11e, 9 de plus en 1re Collège.

## Principe

- Code : `src/defis_sec2.js`, bloc « 28.11 (soir) » ; `co: [11]` (11e) ou `co: [12]` (1re Collège) : profil romand
  seulement, MP et France inchangés.
- La version riche à 3 parties **reste** (même `ctx` : jamais servies l'une après l'autre) : défi du jour des élèves
  faibles (règle n° 24, `shortProb`) et autres profils. Le grand problème de la semaine tire la version à 4 parties.
- Un indice par partie (« a) … », coup de pouce de `Engine.weeklyAid`) : la méthode, jamais la réponse.
- Valeurs tirées en boucle pour éviter : réponse triviale (0, 1), arrondi à un demi près, arrondi qui change si l'élève
  reprend une valeur intermédiaire arrondie. Aucune figure ajoutée (le texte suffit partout).

## Ajouts 11e (18)

| chapitre (semainier 11LS) | notion | ctx | parties (la nouvelle en gras) |
|---|---|---|---|
| 4. Proportionnalité, grandeurs quotients | gquot | aquarium | volume (L), durée de remplissage, masse pleine, **hauteur d'eau max. que le meuble supporte** |
| | gquot | pirate | rayon, volume, masse si or, **masse réelle → masse volumique, ce n'est pas de l'or** |
| | gquot | voiture (nouveau) | énergie d'un trajet (kWh/100 km), prix, autonomie, recharge 20 → 80 % sur une borne |
| | ucomp | guepard | km/h → m/s, m/s → km/h, mètres gagnés en 5 s, **temps pour rattraper l'avance** |
| 5. Calcul littéral 1 | parenth | decoupe | coefficient, constante, aire pour x donné, **x pour une aire donnée (équation)** |
| 5. Calcul littéral 2 | idrem | carre | diminution k², côté, périmètre, **même transformation avec 2k** |
| | factor | allee (nouveau ; la notion n'avait aucun problème) | factoriser (x + 2a)² − x², aire, côté pour une aire, nombre de dalles |
| | formule | energie | km/h → m/s, E, **vitesse d'une coureuse de même énergie (isoler v)**, effet d'une vitesse × k |
| 6. Équations 2 | eq2fact | fusee | durée du vol, instant à H m (factorisation), hauteur max., **vitesse d'une fusée qui vole 1–2 s de plus** |
| | probeq2 | carre | aire du nouveau carré, allongement, périmètre, **allongement qui double l'aire (√2)** |
| | probeq2 | cadre | aire du cadre, largeur (2e degré), **baguette (périmètre), cadre deux fois plus large** |
| 8. Thalès | thales | clocher | rapport, hauteur, ombre d'un arbre, **où se placer pour que les ombres finissent ensemble** |
| 12. Probabilités | proba | urne | deux rouges, gagner, au moins une verte, **même jeu avec remise** |
| | proba | des | somme s, double, gagner (sans double compte), **au moins une victoire en deux parties** |
| 3. Solides | volcone | cornet | cône, demi-boule, total, **cornets complets servis avec un bac** |
| | airepyr | toit | apothème, aire, volume, **palettes de tuiles (arrondi vers le haut)** |
| | denombr | cadenas | codes, chiffres différents, répétition, **durée pour tout essayer** |
| 11. Transformations | simil | pizza | rapport, prix, fromage, **diamètre d'une pizza au prix double (√2)** |

## Ajouts 1re Collège (15)

| chapitre (Ma1) | notion | ctx | parties (la nouvelle en gras) |
|---|---|---|---|
| 7. Degré 2 | f2 | tshirts | prix et recette max., **prix et bénéfice max. avec un coût par t-shirt** |
| | f2 | fusee | instant du sommet, hauteur max., h(2), **instant au sol (formule)** |
| | f2expr | arche | coefficient a, hauteur à 1 m d'un pied, largeur à H m, **hauteur max. d'un camion (au centième inférieur)** |
| | trinfact | usine | deux zéros (factorisation), production optimale, bénéfice max. |
| | racinv | partage | nombre d'amis (équation rationnelle), parts, **participants pour payer au plus X CHF** |
| 5. Degrés 0 et 1 | sysgraph | sport | coûts A et B, égalité, **budget : meilleure formule** |
| | modaff | patinoire | A = B, C moins chère dès…, **meilleure offre et économie pour la saison** |
| | sys3 | cinema | trois prix (système 3 × 3), **économie du tarif famille** |
| 4. Fonctions | affzero | bougies | même hauteur, hauteur commune, consumée, **seconde deux fois plus haute** |
| | morceaux | parking | 4 h, 1 h 20 (heure commencée), plafond, **économie d'un abonnement** |
| 8. Thalès à Pythagore | euclide | terrain | HB (hauteur), aire, AC (Euclide), clôture |
| 10. Trigonométrie | trigo | tour (nouveau, étalon E10.1) | deux visées : distance, hauteur, distance au sommet, angle à mi-chemin |
| | trigo | rampe | horizontale, longueur, angle, **allongement pour la norme de 6 %** |
| | trigrel | echelle | sin depuis cos (exact), pied, hauteur, **angle et règle de sécurité 65–75°** |
| | geocomb | tente | hauteur, volume, toile, **inclinaison d'un pan** |

## Tests

- Modifiés : `tests/recalc_oracles.js` (probeq2 carré, trinfact, f2expr arche lus par le libellé : versions à 4 parties
  recalculées) ; `tests/defis9.html` (une notion qui reçoit un grand problème de 11e, factor, a des défis communs à
  réponse algébrique : seules les valeurs numériques sont contrôlées).
- Verts : probleme_semaine, defis9, recalcul (4 morceaux), corrige_valeur#jeu=defis, variantes, vraisemblance,
  vraisemblance_soir, separation, questions, test_nom.py ; suite rapide.

## Reste / à décider

- Pour 35 formes sans aucune reprise : 1re Collège +9 (candidats : sysineq, ineq2, trinfact jet, euclide, optim
  romand, exactes), 11e +2 (sys2, angles, cercthales, volmanq).
- Masquer la version à 3 parties quand la version à 4 existe ? Non fait : les élèves faibles perdraient leur défi court.
- Relecture des énoncés par l'enseignant (vraisemblance : vitesses d'antilope, prix du kWh, tuiles par m²).
