# Stockage de la progression (26.11)

Tout est sur l'appareil de l'élève, sans compte ni serveur. Ce document dit ce que font les navigateurs, ce que fait
l'app, et ce qui reste hors de notre portée.

## Où l'app enregistre

| Clé `localStorage` | Contenu | Dans le code de sauvegarde ? |
|---|---|---|
| `5m2m.v1` (`Store`, src/engine.js) | toute la progression (`state`) | oui (voir ci-dessous) |
| `m2m-ui` (`UI`, src/app.js) | réglages propres à l'appareil : vibration, rappels vus, installation, séances terminées (`sessN`), stockage persistant (`persistAsked`, `persisted`), carte iPhone (`iosShown`, `iosLater`) | non (propre à l'appareil) |
| `m2m-stats`, `m2m-device`, `m2m-ping` | accord pour les statistiques, identifiant anonyme d'appareil | non (un accord se redonne sur chaque appareil) |
| `m2m-parents` (src/parents.js) | espace parent (codes reçus) | non |
| `m2m-err`, `m2m-auteur`, `m2m-cle`, `m2m-france` | erreurs JS, mode auteur, aperçu France | non |

Pas d'IndexedDB. Le service worker (docs/sw.js) ne met en cache que le code de l'app, pas la progression.

## Ce que font les navigateurs

**Safari sur iPhone / iPad (et tous les navigateurs iOS, qui utilisent WebKit).**
- Prévention du pistage (ITP) : un site qu'on n'a pas ouvert pendant **7 jours d'utilisation de Safari** peut voir
  effacées ses données écrites par script (`localStorage`, IndexedDB, cache du service worker). Un élève qui ne vient
  pas pendant les vacances peut donc tout perdre.
- **App ajoutée à l'écran d'accueil** : elle a son propre stockage, séparé de Safari, et la règle des 7 jours ne
  s'applique pas (WebKit compte les jours d'utilisation de l'app elle-même). C'est la vraie protection sur iPhone.
  Attention : le stockage de l'app installée **n'est pas celui de Safari** ; un élève qui installe l'app après avoir
  commencé dans Safari repart de zéro, sauf s'il passe par son code de sauvegarde (à dire en classe).
- `navigator.storage.persist()` existe depuis Safari 17 ; WebKit l'accorde selon ses propres critères (surtout pour
  l'app installée). On ne sait pas s'il protège un site ouvert dans Safari de la règle des 7 jours : on ne compte pas
  dessus.
- Un stockage plein (rare, quelques Mo ici) peut aussi être vidé.

**Chrome sur Android.**
- Pas de règle des 7 jours. Les données peuvent être effacées si l'appareil manque de place (stockage « au mieux »),
  ou par l'élève (« Effacer les données du site », nettoyage du téléphone).
- `navigator.storage.persist()` est accordé ou refusé **sans rien demander**, selon l'engagement (app installée, site
  souvent visité, favori…). Accordé, le site n'est plus vidé quand la place manque.

**Firefox (ordinateur, Android).** `persist()` ouvre une demande d'autorisation visible : l'app ne le demande pas.

**Navigation privée** (tous navigateurs) : tout est effacé à la fermeture ; on n'y peut rien.

## Ce que fait l'app

1. **Stockage persistant** : après la **première séance terminée** sur l'appareil, une seule fois, l'app appelle
   `navigator.storage.persist()` sans rien afficher, puis `navigator.storage.persisted()` ; le résultat est gardé dans
   `UI.persisted` (1 accordé, 0 refusé, `"na"` : navigateur sans cette fonction, ou Firefox hors iOS). Date de la
   demande : `UI.persistAsked`. (src/app.js, `storagePersist`.)
2. **Carte iPhone** (src/app.js, `iosStoreCard`) : seulement sur iPhone / iPad **dans le navigateur** (ni
   `display-mode: standalone`, ni `navigator.standalone`), dès la **2e séance terminée** (`UI.sessN`, ou les jours de
   pratique pour un élève d'avant le compteur). Elle s'affiche **sous** la carte de séance (le bouton « Ma séance du
   jour » reste visible sans défiler à 360 × 640), toute la journée où elle apparaît, puis au plus **toutes les
   2 semaines** ; « Plus tard » la masque 2 semaines ; un code de sauvegarde fait depuis moins de 2 semaines la masque.
   Elle remplace le rappel de sauvegarde de l'accueil ce jour-là (une seule carte), et sur iOS la carte d'installation
   générique du bilan de séance n'est plus proposée (une seule des deux). Boutons : « Comment installer » (Partager →
   Sur l'écran d'accueil), « Mon code de sauvegarde » (écran du code), « Plus tard ».
3. **Rappel de sauvegarde** (tous appareils, inchangé) : après 7 jours de pratique sans code récent (30 jours).
4. **Code de sauvegarde** (src/backup.js) : texte, lien ou QR, sans serveur. Contenu :
   notions (statut, maîtrise, répétition espacée, leçon vue…), compétences, Mathélo (et les 8 derniers points de sa
   courbe), série (record, joker), 14 derniers jours d'historique, compteurs et badges, chapitre en classe,
   évaluation en préparation (dates, notions, jours faits), réglages de lecture, carnet d'erreurs, « Ma semaine »,
   identifiant d'enfant (espace parent), points et grades de l'année (années passées comprises).
   **Ajouté le 26.11** (champs facultatifs, les anciens codes restent lisibles) : plafond de points du jour et problème
   de la semaine déjà comptés (sinon une reprise le même jour redonnait des points), numéros des grades collector,
   mode « Libre », visite guidée faite / Mathélo expliqué / première séance faite (la visite ne repart plus après une
   reprise), problème de la semaine fait, autoévaluation de l'évaluation en cours (grille « Avant » et tests rapides ;
   les lignes sont reconstruites à la reprise), sujet de préparation (tirage et résultat).
   Test : tests/stockage.html (aller-retour complet, ancien code, longueur du code < 2000 caractères pour le QR).

## Limites connues

- Ce qui n'est **pas** dans le code (volontairement, pour un code court) : historique au-delà de 14 jours, courbe du
  Mathélo au-delà de 8 points, anti-répétition des questions et des contextes, questions curieuses et histoires déjà
  vues, avis et votes, parcours EVACOM (pas encore ouvert aux élèves), réglages propres à l'appareil (vibration,
  statistiques).
- Sur iPhone, l'app ne peut ni installer elle-même, ni savoir si Safari a déjà effacé des données : la carte reste un
  conseil. Un élève qui ignore la carte et ne fait pas de code reste exposé.
- Les dates de l'évaluation (`prep`) sont absolues ; les autres dates du code sont relatives au jour de la sauvegarde.
- `UI.persisted` n'est pas envoyé dans les statistiques (rien de nouveau ne part de l'appareil).
