# Confidentialité : options pour la collecte des statistiques (24.11, à décider par l'enseignant)

État au 24.11 (branche `agent/privacy`) :

- **Fait** : polices et MathJax servis par le site lui-même (`docs/vendor/`, licences dans `docs/vendor/LICENCES.txt`).
  À l'ouverture, plus aucune requête vers Google Fonts ni Cloudflare (contrôle : `python3 tools/test_hors_ligne.py`).
- **Fait** : écran « Ce que l'app envoie » corrigé, page « Mentions légales et confidentialité » (`screenLegal` dans
  `src/app.js`, accessible depuis les Réglages, l'écran d'entrée, « Ce que l'app envoie » et le lien direct
  `…/#confidentialite`). **Projet à faire valider** : 13 champs `[À COMPLÉTER par l'enseignant : …]` (responsable,
  adresse, contact, cadre, base légale, loi cantonale, durée de conservation, garanties du transfert, autorité, accord
  des parents, date).
- **Inchangé (décision de l'enseignant)** : ce qui est envoyé et le service qui le reçoit (Google Sheets via Apps Script,
  `VOTE_ENDPOINT` dans `src/app.js`, script `tools/votes.gs`).

## Ce qui est envoyé aujourd'hui (rappel)

Vers `script.google.com` (Google LLC, États-Unis), en `POST` `no-cors`, depuis le site publié en https seulement (jamais
depuis claude.ai, les pages de test, ni un appareil « auteur ») :

| Envoi | Fonction | Contenu | Identifiant d'appareil |
|---|---|---|---|
| ouverture (1/jour), début et fin de séance | `ping` | date, classe, format, nb de questions, score, durée | oui |
| une ligne par question / leçon | `sigSend` | code, issue, essais, durée, aide, 1re réponse fausse (mots → « [texte] ») | oui |
| avis 👍 / 👎, trop facile, pas compris | `canSend` + `fetch` | code, vote, date | oui |
| commentaire | `fetch` (`ev: "comment"`) | texte (≤ 500 car.), classe | oui |
| grade Mathélo | `fetch` GET `?grade=…&app=…` | nom du grade | oui |
| chapitre du moment | `fetch` (`ev: "now"`) | notions, classe, mois | **non** |
| erreur JS (≤ 5/jour) | `errReport` | message, fichier, ligne, pile courte, version, écran, classe | oui |

Google reçoit en plus, comme pour toute requête, l'adresse IP et l'agent utilisateur (non transmis au script ni au
tableau). Remarques relevées en rédigeant les mentions :

- le signal `open` part aussi quand un parent ouvre le lien `…/#confidentialite` (comportement existant, non modifié) ;
- « Tout effacer » supprime l'identifiant local mais rien côté tableau : le droit d'effacement passe par une demande
  avec l'identifiant (expliqué dans les mentions) ; il faudra une procédure (filtre sur la colonne `dev` du tableau) ;
- un commentaire libre peut contenir un nom malgré la consigne : prévoir de les relire et de les anonymiser.

## Option A — garder Google Sheets, mais avec consentement (effort faible)

Au premier lancement (écran d'entrée), un choix clair : « Aider à améliorer l'app (statistiques anonymes) : oui / non »,
modifiable dans les Réglages. Sans accord : **aucun envoi** (l'app fonctionne entièrement).

- **Avantages** : rien à héberger ; conforme à l'esprit LPD/RGPD si la base légale retenue est le consentement ;
  facile à expliquer aux parents ; le reste (Apps Script, suivi, onglet Commentaires) ne change pas.
- **Inconvénients** : données toujours chez Google (transfert hors Suisse/UE à documenter) ; moins de données (une part
  des élèves refusera) ; pour des moins de 16 ans (RGPD) ou selon l'école, le consentement des parents peut être exigé.
- **Coût** : 0 CHF. **Effort** : ½ journée.
- **Code à changer** :
  - `src/app.js` : un réglage `UI.stats` (stocké dans `m2m-ui`), valeur par défaut `null` = pas encore choisi → pas
    d'envoi ; un seul garde-fou commun, par exemple `const statsOk = () => UI.stats === true;`, ajouté à `canSend`,
    `ping`, `errCanSend`, `sigSend`, l'envoi du commentaire (ligne `ev: "comment"`), du chapitre du moment
    (`ev: "now"`) et des grades (`fetch(VOTE_ENDPOINT + "?grade=…")`) — aujourd'hui ces conditions sont répétées à
    plusieurs endroits : les regrouper d'abord dans une fonction.
  - écran d'entrée (`screenWelcome`) : deux boutons ou une case ; Réglages : un interrupteur « Envoyer les statistiques ».
  - `screenPrivacy` et `screenLegal` : indiquer l'état et la base légale « consentement » ; « retirer son accord » =
    interrupteur.
  - `tools/suivi.py` / `tools/signaux.py` : aucune modification (moins de lignes, même format).
  - Tests : une page qui vérifie qu'aucun `fetch` vers `VOTE_ENDPOINT` ne part tant que `UI.stats !== true`.

## Option B — service maîtrisé, sans Google (effort moyen à élevé)

### B1. Petit serveur auto-hébergé en Suisse ou dans l'UE

Un point de collecte minimal (par exemple un script Python/Flask ou PHP qui ajoute une ligne à une base SQLite ou à un
CSV) chez un hébergeur suisse (Infomaniak, Exoscale…) ou européen.

- **Avantages** : données en Suisse ; aucun tiers ; contrôle total de la durée de conservation ; pas de journaux d'IP
  si on les désactive ; argument fort auprès des parents et de l'école.
- **Inconvénients** : un serveur à maintenir (mises à jour, sécurité, sauvegardes) ; il faut réécrire l'onglet
  « Commentaires » et le suivi qui lisent aujourd'hui la feuille Google ; dépend de l'enseignant pour durer.
- **Coût** : 5 à 10 CHF/mois (hébergement web avec PHP + MySQL, ou petit VPS). **Effort** : 2 à 3 jours + maintenance.
- **Code à changer** : `VOTE_ENDPOINT` (nouvelle adresse) ; le corps des requêtes peut rester le même (JSON) ; passer
  de `mode: "no-cors"` à un `fetch` CORS normal (en-tête `Access-Control-Allow-Origin` côté serveur) ; la lecture des
  statistiques (`screenStats`, `get = (q) => fetch(VOTE_ENDPOINT + "?" + q)`) et le GET des grades doivent trouver
  les mêmes réponses JSON ; `tools/votes.gs` → réécrit côté serveur ; `tools/suivi.py`, `tools/signaux.py`,
  `tools/erreurs.py` : lire la nouvelle base (export CSV) au lieu de la feuille ; `sw.js` : remplacer le filtre
  `script.google.com` par le nouveau domaine.

### B2. Supabase (région UE, par exemple Francfort)

Base PostgreSQL hébergée, avec une API REST ; insertion directe depuis l'app avec une clé publique et des règles
d'accès (insertion seule, aucune lecture publique).

- **Avantages** : pas de serveur à maintenir ; données dans l'UE ; tableau de bord et export CSV ; gratuit à cette échelle.
- **Inconvénients** : société américaine (Supabase Inc.) même si les données sont dans l'UE (contrat de sous-traitance
  à accepter) ; projet gratuit mis en pause après 7 jours sans activité ; règles d'accès à bien écrire (sinon la base est
  lisible par tous) ; le GET des grades (numéro de « collector ») demande une fonction côté base.
- **Coût** : 0 € (offre gratuite) ou 25 $/mois (offre payante). **Effort** : 1 à 2 jours.
- **Code à changer** : comme B1, plus l'en-tête `apikey` dans chaque `fetch` ; une table par type d'événement ou une
  table unique `evenements(ev, dev, date, niveau, data jsonb)`.

### B3. Plausible (ou équivalent : Umami, GoatCounter) seulement pour les visites

Mesure d'audience sans cookie ni identifiant, hébergée dans l'UE (Plausible : Allemagne / Estonie).

- **Avantages** : remplace proprement le signal `open` (combien de visiteurs par jour, par niveau via des événements
  personnalisés) ; pas de données personnelles stockées ; souvent admis sans consentement.
- **Inconvénients** : ne remplace **pas** les signaux par question, les commentaires, les erreurs ni les grades (pas
  d'identifiant) : à combiner avec A, B1 ou B2 pour le reste, ou à accepter de perdre ces signaux.
- **Coût** : Plausible 9 €/mois (ou auto-hébergé : gratuit + serveur) ; GoatCounter gratuit pour un usage non
  commercial. **Effort** : 1 heure (un script à ajouter… à héberger lui aussi dans `docs/vendor/` pour rester cohérent).
- **Code à changer** : supprimer `ping("open")` et le signal de fin de séance ou les rediriger vers
  `plausible("seance", { props: { niveau } })` ; mettre à jour les mentions.

## Option C — réduire ce qui est envoyé (complément de toutes les options)

Sans changer de service : ne plus envoyer l'identifiant d'appareil avec les avis et les grades, tronquer la date au
mois pour les signaux par question, supprimer la pile d'appels des erreurs… Chaque réduction affaiblit une analyse
(`tools/signaux.py` suit un élève d'une question à l'autre grâce à `dev`). Effort : quelques heures. À discuter
donnée par donnée.

## Recommandation (pour discussion)

1. **Court terme** (avant d'ouvrir l'app à la classe de 11e) : option **A** (consentement, rien n'est envoyé par
   défaut) + compléter les champs des mentions avec l'établissement ; c'est le plus rapide et le plus simple à expliquer.
2. **Moyen terme** (si l'app dépasse le cercle des testeurs) : **B1** ou **B2** pour sortir de Google, avec une durée
   de conservation courte et une purge automatique.
