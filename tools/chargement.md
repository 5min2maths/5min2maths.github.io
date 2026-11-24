# Chargement par niveau (chantier F2, demandé le 24.11)

## Mesures (24.11, `tools/mesure_chargement.py --rapide`)

| Cas | Écran affiché |
|---|---|
| Habitué, CPU ×4 | 0,64 s |
| Habitué, CPU ×6 + 4G lente | 0,95 s |
| Première visite, CPU ×4, réseau local | 1,2 s |
| Première visite, CPU ×6 + 4G lente | **10,9 s** (1,1 Mo compressé à télécharger) |

## Poids du code par groupe (4'069 Ko non compressés)

| Groupe | Ko | Part |
|---|---|---|
| Commun (moteur, écrans, générateurs anciens tous niveaux) | 1'658 | 40 % |
| 11e | 655 | 16 % |
| 1re Collège | 618 | 15 % |
| France | 324 | 7 % |
| MP | 253 | 6 % |
| 9e | 175 | 4 % |
| 10e | 139 | 3 % |
| 2e Collège | 138 | 3 % |
| 3e Collège | 104 | 2 % |

## Principe

1. **Paquets** construits par `build.py` : `docs/app.js` (commun) et `docs/p-<niveau>.js` (un par groupe), chacun versionné (`?v=`).
2. **Au démarrage** : le commun, puis les paquets **requis** pour le profil : le niveau de l'élève **et les niveaux inférieurs de sa filière** (révisions espacées, prérequis après deux échecs, « Me tester ») ; MP seulement en filière MP ; France seulement en système FR. Le démarrage de l'app (`app.js`) attend ces paquets.
3. **Juste après l'affichage** : les autres paquets en arrière-plan (`requestIdleCallback`), mis en cache par le service worker : l'app reste entièrement utilisable hors ligne.
4. **À la demande** : changement de classe dans les Réglages, lien vers une question d'un autre niveau (`#q-…`), écran d'auteur → chargement du paquet avec un court « Chargement… » ; hors ligne et pas encore en cache : message clair, l'ancien niveau reste utilisable.
5. **Ordre** : chaque paquet est chargé après le commun (il complète `GEN`, `VAR`, `ACTIVE`, `RICH`…). Un paquet ne doit dépendre que du commun, jamais d'un autre paquet (à vérifier : `riche_*` et `act_*`).
6. **Tests** : les pages `tests/*.html` chargent toujours tous les fichiers sources (inchangé). Une nouvelle page vérifie le chargement par paquets dans `docs/` : profil 9e → seuls les paquets requis avant l'accueil ; changement de classe → paquet chargé ; tout le catalogue disponible après l'arrière-plan.

## Gain attendu (première visite)

| Profil | Avant | Après (au démarrage) |
|---|---|---|
| 9e | 4'069 Ko | ≈ 1'830 Ko (−55 %) |
| 11e | 4'069 Ko | ≈ 2'630 Ko (−35 %) |
| 1re Collège | 4'069 Ko | ≈ 2'400 Ko (−40 %, selon les révisions CO retenues) |

Plus tard, gain supplémentaire possible en découpant le commun (générateurs anciens par niveau) et en minifiant (≈ −7 %).

## Risques

- Une notion d'un niveau inférieur appelée en révision avant la fin du chargement en arrière-plan : couverte par la règle 2 (niveaux inférieurs requis).
- Les modules `ch11_*`, `ch1c_*` remplacent des générateurs du commun : sans le paquet, l'ancien générateur servirait silencieusement. Garde-fou : le moteur ne propose une notion que si son paquet est chargé.
