# Audit 5min2maths — Matu et MP (13.11.2026)

Relecture par 5 agents (117 notions, 1'423 exemples, calculs refaits). **Aucune réponse attendue fausse.** Constats à corriger, par gravité.

## Importants

- **absval-2-1lm** (absval, enonce_ambigu) — Les solutions du niveau 2 sont des fractions non décimales (4/3 ; 10/3 ; 5/3 ; −7/3) alors que l'énoncé ne dit pas que les fractions sont acceptées : un élève qui tape 1,33 sera compté faux.  
  *Correction :* Ajouter « (fractions acceptées) » à l'énoncé dès qu'une solution n'est pas décimale exacte, ou générer des coefficients donnant des solutions décimales.
- **absval-3-2cd** (absval, generateur_repetitif) — Les 4 exemples de niveau 3 sont tous de la forme |x−a|+b=c avec c<b : réponse toujours « aucune ». L'élève peut répondre « aucune » sans calculer ; le niveau 3 ne teste jamais une résolution réelle (|x−2|+4=9, 2|x|−3=7, |x−1|=|x+3|…).  
  *Correction :* Mélanger : cas impossible, cas à deux solutions après isolement de la valeur absolue, cas b=0 (une seule solution), équation du type |ax+b|=c·x, ou |A|=|B|.
- **affzero-1-vw** (affzero, enonce_ambigu) — Zéro de 3x−5 = 5/3 (non décimal) sans indication de saisie (aussi −9/2, 3/2 acceptés en décimal mais 5/3 non).  
  *Correction :* Ajouter « (fraction acceptée) ».
- **eq1-3-2de** (eq1, enonce_ambigu) — x/2+5=x/5 a pour solution −50/3 et x/3+1=x/5 donne −15/2 ; l'énoncé ne précise ni « fraction acceptée » ni arrondi. Un élève qui tape −16,67 est compté faux sans savoir pourquoi. Par ailleurs la valeur stockée −11,999… (flottant) suppose une tolérance : à vérifier.  
  *Correction :* Ajouter « (réponse exacte, fraction acceptée) » aux énoncés de niveau 3 ; stocker la valeur sous forme de fraction exacte.
- **eq2disc-2-1mn** (eq2disc, corrige_faux_ou_flou) — Discriminant nul : le corrigé écrit « S = {2 ; 2} » (ensemble à deux éléments égaux), ce qui contredit le rappel (une seule solution) et la réponse attendue [2].  
  *Correction :* Corrigé : « Δ = 0 : une seule solution x = -b/2a = 2, S = {2} ». Idem dans le générateur pour tout cas Δ = 0.
- **eq3-4-39u** (eq3, corrige_faux_ou_flou) — Problème de la boîte : b) « valeur entière de x qui donne le plus grand volume » ; le corrigé affirme seulement « x = 3 » (« le maximum exact est en x = 3 ») sans justification, alors que cela demande une dérivée ou un tableau de valeurs ; rien ne relie le problème à la factorisation de degré 3 de la notion.  
  *Correction :* Corrigé : tableau V(1)=256, V(2)=392, V(3)=432, V(4)=400, V(5)=320 donc x = 3 ; ou reformuler en question de degré 3 résoluble (ex. quelle valeur de x donne V = 392 ? ou x(18-2x)² = 0).
- **eqparam-2-1mn** (eqparam, enonce_ambigu) — Énoncé 'mx + 2 = 9x + -1' : constante négative mal formatée ('+ -1'), peu lisible pour un élève.  
  *Correction :* Générer '9x - 1' (gérer le signe dans le gabarit).
- **euclide-3-2cd** (euclide, enonce_ambigu) — La hauteur demandée est 120/17 ≈ 7,0588 (resp. 60/13) mais l'énoncé ne dit pas sous quelle forme répondre ; l'attendu n'a pas de « round ». Un élève qui tape 7,06 risque d'être refusé, et un élève qui tape 120/17 n'est pas guidé. Dans euclide-4-39u (b), la consigne ne précise pas non plus « au centième » alors que l'attendu est arrondi à 0,01.  
  *Correction :* Ajouter « (valeur exacte sous forme de fraction, ou arrondie au centième) » et mettre round 0.01 + exactOk, comme pour euclide-2 ; idem consigne b) de euclide-4.
- **expfrac-1-st** (expfrac, niveau_inadapte) — Énoncé dégénéré « Calcule 100^{1} » : l'exposant fractionnaire s'est réduit à 1 (2/2) ; la question n'a plus rien à voir avec les exposants fractionnaires. Idem « 64^{-1} » (expfrac-2-1mn) qui est un simple exposant entier négatif avec la mention « (fraction) ».  
  *Correction :* Exclure les exposants p/n dont la fraction se réduit à un entier (p multiple de n) ; imposer n ≥ 2 et pgcd(p,n)=1.
- **expfrac-1-tu** (expfrac, corrige_faux_ou_flou) — Le corrigé utilise l'exposant non réduit alors que l'énoncé affiche la fraction réduite : « 64^{1/2} = (⁶√64)^3 = 2^3 = 8 » (idem expfrac-1-st : « 100^{1} = (√100)^2 », expfrac-2-1lm : 81^{-1/2} = 1/(⁴√81)^2, expfrac-2-1mn : 64^{-1} = 1/(³√64)^3, expfrac-1-uv…). L'élève voit une racine 6e et une puissance 3 qui ne figurent pas dans l'énoncé ; la méthode n'est pas celle du rappel (racine n-ième de l'exposant p/n affiché). Les réponses sont justes.  
  *Correction :* Générer le corrigé à partir de la fraction réduite p/n de l'énoncé : 64^{1/2} = √64 = 8 ; 81^{-1/2} = 1/√81 = 1/9 ; ne pas écrire de racine d'indice ≠ dénominateur affiché.
- **expo-2-1mn** (expo, enonce_ambigu) — Énoncé « Résous : 3^{x + 0} = 27 » : le « + 0 » est un artefact du générateur (décalage nul), maladroit et déroutant ; corrigé « x + 0 = 3 ».  
  *Correction :* Imposer un décalage non nul (b ≠ 0) ou écrire 3^x = 27 ; pour le niveau 2, éviter qu'il soit identique au niveau 1.
- **formule-1-uv** (formule, generateur_repetitif) — Niveau 1 : 3 exemples sur 4 identiques (v=d/t, isoler d) ; niveau 2 : 2 formes seulement, chacune répétée ; niveau 3 : 2 formes (Pythagore, aire du disque) en alternance.  
  *Correction :* Ajouter des formules (F=ma, U=RI, S=vt+s0, C=2πr, V=lwh, Q=mcΔT…) et varier la lettre isolée ; éviter les doublons dans un même tirage.
- **homog-3-2cd** (homog, corrige_faux_ou_flou) — Corrigé de la réciproque sans le calcul : après « y(2x+1) = 4x+4 », on saute à « on isole x : f⁻¹(x) = … » sans montrer x(2y − 4) = 4 − y, ni l'échange x ↔ y. Le rappel ne parle ni de réciproque ni de la méthode ; aucune formule (a x + b)/(c x + d) → (d x − b)/(−c x + a).  
  *Correction :* Détailler : 2xy + y = 4x + 4 ⇒ x(2y − 4) = 4 − y ⇒ x = (4 − y)/(2y − 4), puis échanger x et y ; ajouter ce cas au rappel (et préciser l'ensemble de définition).
- **ineq-4-39u** (ineq, corrige_faux_ou_flou) — Corrigé de la partie a) tronqué comme ci-dessus : « 40 + 1,5x  \frac{26}{0,5} \approx 52 » (la partie « < 14 + 2x ⇔ 26 < 0,5x ⇔ x > » a disparu). Le « ≈ 52 » est de plus trompeur : 26/0,5 = 52 exactement.  
  *Correction :* Même correctif d'échappement ; écrire : 40+1,5x < 14+2x ⇔ 26 < 0,5x ⇔ x > 52. Supprimer « ≈ ». À vérifier dans tout le catalogue : toute chaîne avec « < … > » dans un corrigé ou énoncé.
- **ineq2-2-1mn** (ineq2, corrige_faux_ou_flou) — Pour 2x²-6x-20 ≤ 0 (a > 0, inéquation ≤ 0), le corrigé dit « signe de a = 2 à l'extérieur des racines : S = [-2 ; 5] », phrase fausse/contradictoire (la solution est entre les racines). Le gabarit de phrase n'est correct que si le signe cherché est celui de a.  
  *Correction :* Adapter la phrase au cas : « a > 0 : le trinôme est négatif entre les zéros, donc S = [-2 ; 5] » ; distinguer les 4 cas (a ±, ≤0/≥0).
- **modaff-2-1kl** (modaff, corrige_faux_ou_flou) — Le corrigé de tous les exemples de niveau 2 est tronqué/illisible : « 77 + 8n  \frac{77}{5} », « 76 + 4n  19 »… Le morceau entre « < » et « > » (inégalité 77+8n < 13n et « n > ») a disparu, probablement avalé comme balise HTML. L'élève ne voit aucun raisonnement.  
  *Correction :* Échapper « < » et « > » dans les corrigés (\lt, \gt ou &lt; &gt;) ou les écrire avec \(\lt\). Corrigé attendu : 77+8n < 13n ⇔ 5n > 77 ⇔ n > 15,4, donc dès 16 entrées.
- **polydiv-2-1kl** (polydiv, corrige_faux_ou_flou) — Le corrigé du niveau 2 dit seulement « Schéma de Horner avec −3 : Q(x) = … » sans montrer le tableau ; le rappel mentionne Horner sans l'expliquer ni donner d'exemple. L'élève ne peut ni comprendre ni refaire la méthode (quotient de degré 2 à partir des coefficients). De plus 1kl et 1no sont des polynômes opposés (même structure).  
  *Correction :* Ajouter au rappel un exemple de schéma de Horner (coefficients, ligne des produits, lecture du quotient) et montrer les coefficients dans le corrigé : « −3 | −9 | 5 | 15 ; Horner : −3, 0, 5, reste 0 ».
- **probeq-3-2cd** (probeq, niveau_inadapte) — Le niveau 3 (périmètre/aire d'un rectangle, produit de deux consécutifs) mène à une équation du 2e degré x²−25x+154=0 ; or le chapitre est « Degrés 0 et 1 » (Matu 1re) et « Équations » (MP1), où le 2e degré n'est pas vu. Le corrigé donne les racines sans les justifier.  
  *Correction :* Pour ces classes, remplacer le niveau 3 par des problèmes à une équation du 1er degré plus longs (mélanges, mouvements, âges à deux conditions), ou réserver les problèmes quadratiques à un chapitre ultérieur ; sinon détailler la factorisation/discriminant dans le corrigé.
- **quartiles-3-2cd** (quartiles, rappel_de_cours) — Le rappel dit 'médianes de la moitié inférieure/supérieure' sans préciser le cas d'un effectif impair (la médiane est-elle exclue ?). Tous les exemples de niveau 3 ont 11 valeurs et excluent la médiane ; la calculatrice ou un tableur donnent d'autres quartiles selon la convention : l'élève peut se tromper à bon droit.  
  *Correction :* Ajouter dans le rappel et dans l'énoncé de niveau 3 : 'effectif impair : on n'inclut pas la médiane dans les deux moitiés'. Ajouter un exemple chiffré avec effectif impair dans le rappel.
- **rac-2-1kl** (rac, autre) — 'Écris √108 sous la forme a√b' : l'attendu 'value' (10,392…) accepte √108, 10,39 ou 6√3 indifféremment ; la simplification n'est pas vérifiée. Idem au niveau 3 ('Simplifie : √80+√20' accepte √80+√20 ou 13,42). De plus rac-2-1kl et rac-2-1lm sont identiques.  
  *Correction :* Vérifier la forme (a entier, b sans carré parfait) ou au moins refuser les décimaux et les radicaux non simplifiés ; dédoublonner.
- **racinv-1-tu** (racinv, enonce_ambigu) — La préimage vaut 7/3 (non décimale) sans indication de saisie ; seul racinv-1-uv précise « fraction acceptée ». Même chose pour −2/3 (racinv-1-vw).  
  *Correction :* Ajouter systématiquement « (fraction acceptée) » ou « arrondi au centième » selon la valeur attendue.
- **rel-3-2de** (rel, generateur_repetitif) — Niveau 3 : trois exemples sur quatre (2de, 2ef, 2fg) sont identiques ('-2² + (-2)² - (-2)³ = 8') et le quatrième ne diffère que par la base 3 ; le résultat vaut toujours 8 pour la base 2. L'élève mémorise la réponse.  
  *Correction :* Varier base (2, 3, 4, 5) et structure (ex. -a² - (-a)² + b·(-c)³, (-2)³·(-3)², -4² : (-2)), et interdire les doublons dans une même session.
- **sci-1-st / sci-2-1kl** (sci, autre) — L'attendu est de type 'value' : n'importe quelle forme équivalente est acceptée. L'élève qui répond 0,0049, 49·10^-4 ou 800 pour 'écris en notation scientifique' est compté juste alors que la forme a·10^n (1 ≤ a < 10) est précisément la compétence testée.  
  *Correction :* Utiliser un contrôle de forme (ex. kind 'sci' ou exiger le motif a·10^n avec 1 ≤ a < 10) ; à défaut, refuser les réponses sans '10^' ou dont la mantisse est hors [1 ; 10[.
- **scicalc-1-st** (scicalc, autre) — Même problème que 'sci' : la consigne 'donne le résultat en notation scientifique' mais l'attendu 'value' accepte 5000000 ou 50·10^5. Le piège principal du niveau 3 (40·10^9 à ramener à 4·10^10) n'est donc pas évalué.  
  *Correction :* Contrôle de forme a·10^n avec 1 ≤ a < 10 pour toutes les questions demandant la notation scientifique.
- **stats-1-uv** (stats, enonce_ambigu) — Moyenne de 7 valeurs = 96/7 = 13,714... sans consigne d'arrondi. Si l'attendu 'value' sans 'round' est comparé à la valeur exacte, un élève qui tape 13,71 (ce que le corrigé suggère) peut être refusé ; sinon il faut l'écrire.  
  *Correction :* Soit choisir des séries dont la moyenne est décimale exacte, soit ajouter 'arrondis au centième' avec round 0.01, soit préciser 'donne une fraction ou une valeur arrondie au centième' et vérifier que 96/7 et 13,71 sont tous deux acceptés.
- **sys2-1-st** (sys2, corrige_faux_ou_flou) — Les corrigés des niveaux 1 et 2 sont génériques (« Par substitution (un coefficient vaut ±1) ou par combinaison : (x ; y) = (1 ; 6) ») : aucune étape de calcul, donc aucune aide à l'élève qui a faux. Niveau 3 (cinéma) : les quatre exemples ont la même trame.  
  *Correction :* Générer un corrigé avec les étapes (ex. soustraction des équations : −5y = −30, y = 6, puis x = 7 − 6 = 1) et vérification dans les deux équations ; varier les contextes du niveau 3.
- **sys3-1-st** (sys3, corrige_faux_ou_flou) — Corrigés des niveaux 1 à 3 génériques (« système triangulaire… » ou « Méthode de Gauss… ») sans aucune étape. De plus sys3-2-1lm (x=5, −2x−2y−2z=2, −2z=4) est déjà triangulaire, donc de difficulté niveau 1, et le niveau 3 (3×3 complet à coefficients négatifs) est lourd à la main pour MP1.  
  *Correction :* Fournir les étapes d'élimination (L2+L1, etc.) ; contrôler que le niveau 2 n'est pas triangulaire ; limiter les coefficients du niveau 3 pour MP1.
- **tabval-3-2de** (tabval, generateur_repetitif) — Le niveau 3 donne trois fois exactement la même question « f(x)=x³, f(−4) » (2de, 2ef, 2fg) et le niveau 2 deux fois « 4x², f(−3) » (1kl, 1mn). Le niveau 3 « x³ » est aussi plus facile que l'autre forme du niveau 3 (3x²+2x−6). De plus, la notion s'appelle « tableau de valeurs » mais ne demande qu'une seule valeur.  
  *Correction :* Élargir le tirage (valeurs de x, coefficients, puissances 2/3, formes avec plusieurs termes) et empêcher les doublons ; proposer parfois de compléter un tableau de 3 valeurs (réponse « a ; b ; c »).
- **thales-2-1kl** (thales, enonce_ambigu) — L'énoncé du niveau 2 commence par « Même configuration de Thalès : AD = 2, DB = 6, AE = 4 » : il renvoie à une question précédente qui n'existe pas (questions tirées isolément). Ni le triangle ABC, ni D ∈ [AB], E ∈ [AC], ni (DE) // (BC) ne sont rappelés ; l'élève ne dispose que de la figure.  
  *Correction :* Réécrire l'énoncé de façon autonome : « Dans un triangle ABC, D ∈ [AB], E ∈ [AC] et (DE) // (BC). On sait que AD = 2, DB = 6 et AE = 4. Calcule AC. »
- **trigcercle-3-2cd** (trigcercle, niveau_inadapte) — Niveau 3 = coordonnées du point associé à 30°, 45° ou 60° (premier quadrant) : plus facile que le niveau 2 (cos 225°, 315°, 120°). Niveau 3 mal calibré, et 3-2cd = 3-2de identiques ; niveau 2 : 1mn = 1no identiques (cos 120°).  
  *Correction :* Niveau 3 : angles hors du premier quadrant (150°, 210°, 300°) ou valeurs de tan/sin ; dédoublonner.
- **trigeq2-3-2cd** (trigeq2, generateur_repetitif) — Niveau 3 : l'énoncé est toujours h(t) = d + a sin(60° t) (3 sur 4, réponse 6 h) ; l'amplitude et la valeur moyenne sont des distracteurs sans rôle ; un élève qui répond 6 sans calcul gagne presque à chaque fois. Plus difficile en apparence mais plus facile que trigeq2 niveau 1 (résoudre sin(kx)=c).  
  *Correction :* Varier l'angle (30°, 45°, 90°…) et poser aussi des questions utilisant a et d (hauteur maximale, première marée haute, instants où h = d).
- **trigexact-2-1kl** (trigexact, autre) — 'Valeur exacte' est demandée (6√3) mais l'attendu est un 'value' décimal : un élève qui tape 10,39 à la calculatrice est accepté, alors que la notion porte justement sur les valeurs exactes.  
  *Correction :* Exiger une forme exacte (présence de √ ou fraction) pour les questions 'valeur exacte' ; refuser un décimal non terminant.
- **trigrel-1-st** (trigrel, generateur_repetitif) — Peu de variété : niveaux 1 et 2 se limitent aux triplets 3-4-5 et 5-12-13 (sin 4/5 deux fois, cos 3/5 deux fois) ; au niveau 3 trigrel-3-2ef et 3-2fg sont identiques (sin = 1/3).  
  *Correction :* Élargir (8-15-17, 7-24-25, 20-21-29), dédoublonner, inclure tan donné → sin/cos.

## Mineurs

- **absval-1-st** (absval, figure) — La droite graduée n'affiche que quelques graduations autour du centre (−2…1 pour |x+1|=8, −5…1 pour |x+4|=2) : les solutions (−9 et 7, −6) sont hors de la zone étiquetée ; la figure n'aide pas et peut dérouter.  
  *Correction :* Étendre la graduation pour inclure centre et solutions, ou ne représenter que centre et rayon.
- **affzero-3-2cd** (affzero, niveau_inadapte) — Niveaux 2 et 3 identiques sauf le signe de la pente (« f(x)>0 » ) ; niveau 3 pas plus difficile que 2. Idem affine-3 (résoudre 4x+1=−3) qui est plus facile que le niveau 2 (calcul de pente).  
  *Correction :* Rendre le niveau 3 plus riche (f(x) ≤ 0, f(x)<g(x), signe d'un produit) ; pour affine, demander l'équation de la droite par deux points.
- **angles-2-1kl** (angles, niveau_inadapte) — Le niveau 2 est la réciproque triviale du niveau 1 (diviser par 2). Le titre « Angles : parallèles, cercle » annonce des angles entre parallèles qui ne sont ni dans le rappel ni dans les questions. angles-3 est identique à cercthales-1 (doublon entre notions). L'énoncé du niveau 2 ne précise pas que C est sur le grand arc (sinon l'angle inscrit vaut 180° − moitié).  
  *Correction :* Renommer en « Angle au centre et angle inscrit » ou ajouter alternes-internes/correspondants ; niveau 2 : deux angles inscrits interceptant le même arc, quadrilatère inscrit ; préciser « C sur le grand arc AB ».
- **angtri-3-2cd** (angtri, niveau_inadapte) — Le niveau 3 (4e angle d'un quadrilatère) n'est pas plus difficile que le niveau 1 (même soustraction). Niveau 2 : 3 questions sur 4 identiques en structure.  
  *Correction :* Niveau 3 : angle extérieur, triangle isocèle + parallèles, ou mise en équation (angles x, 2x, 3x).
- **arith-2-1kl** (arith, corrige_faux_ou_flou) — Le corrigé niveau 2 utilise PPMC = a·b / PGDC, formule absente du rappel, sans calculer le PGDC. arith-3-2cd (PPMC de 12 et 6 = 12) est trivial et ne demande pas de décomposition.  
  *Correction :* Ajouter la formule au rappel ou donner la décomposition en facteurs premiers dans le corrigé ; exclure les cas où l'un des nombres divise l'autre au niveau 3.
- **bicarre-1-st** (bicarre, niveau_inadapte) — Niveau 1 : x⁴-41x²+400 (Δ=81 après X=x²) est lourd pour un niveau de base (produit 400) ; 1-st et 1-uv identiques ; niveau 2 : 1lm et 1mn identiques ; niveau 3 : 2cd et 2ef identiques (x⁴-4x²=0), cas sans constante qui n'est pas plus dur.  
  *Correction :* Niveau 1 : X de petite taille (x⁴-5x²+4) ; dédoublonner.
- **bijection-1-st** (bijection, niveau_inadapte) — Niveau 1 : la formulation « bijection de [a;+∞[ vers [b;+∞[ avec a le plus petit possible » suppose déjà connue la méthode ; niveaux 1 et 2 sont le même exercice (sommet de la parabole) avec forme canonique puis développée. Le niveau 3 (compter les injectives) mélange √x, 1/x et |x| non traités dans le rappel (qui ne parle que de x², x³, 2x+1).  
  *Correction :* Compléter le rappel avec √x, 1/x (injective sur son domaine), |x| (non injective) ou retirer ces fonctions du niveau 3.
- **cart-3-2cd** (cart, autre) — Le niveau 3 de « Distance et milieu » est en fait une équation de droite par deux points (sujet de la notion « droites ») ; le titre et le rappel ne couvrent pas cette compétence (pente mentionnée seulement dans l'indice). Niveau 2 (milieu) très proche du niveau 1 en difficulté.  
  *Correction :* Soit déplacer la question dans « droites », soit ajouter l'équation de droite au rappel ; niveau 3 plus adapté : point symétrique, médiane, aire d'un triangle.
- **cercle-3-2cd** (cercle, enonce_ambigu) — Niveau 3 : réponse attendue = deux abscisses (kind set), mais l'énoncé ne dit pas comment les saisir (ni « sépare-les par ; » ni « aucune »), contrairement à eqirr. Un élève qui écrit « −4 et 0 » sera refusé.  
  *Correction :* Ajouter « (Plusieurs solutions : sépare-les par « ; ».) ». Même remarque pour polyfact-1-st, polyfact-2-1kl et polyfact-3 (sets de 3-4 racines sans consigne de saisie).
- **cercletan-2-1mn** (cercletan, rappel_de_cours) — Le niveau 2 (cercletan-2-1mn) et le corrigé utilisent la formule de distance point-droite |ax₀+by₀+c|/√(a²+b²) absente du rappel et de l'indice (qui parle seulement de « distance au centre »). Les 3 autres exemples du niveau 2 sont de simples écarts avec y = k (trop faciles). Niveau 3 : 2cd et 2fg identiques.  
  *Correction :* Ajouter la formule de distance au rappel ; diversifier les droites (obliques) ; dédoublonner.
- **cercthales-2-1kl** (cercthales, generateur_repetitif) — Niveau 2 : 1kl et 1mn identiques (17 et 8).  
  *Correction :* Dédoublonner.
- **compo-3-2cd** (compo, generateur_repetitif) — Niveau 3 correct mais de même nature que le niveau 1 (calculs numériques de composées) ; seule la différence (f∘g)−(g∘f) change. Le niveau 1 de compo est identique en structure au niveau 2 de recip (f∘g)(a).  
  *Correction :* Ajouter au niveau 3 une composée à exprimer (f∘g)(x) avec g non polynomiale, ou la recherche de x tel que (f∘g)(x)=c.
- **decomp-1-st** (decomp, generateur_repetitif) — Niveau 1 : uniquement h=√(ax+b) avec f=√x donnée ; niveau 2 : uniquement 1/(x²+c) ou (ax+b)^n ; niveau 3 : toujours a(x−h)²+k. Les formes « donne f » (niveau 3) sont plus faciles que le niveau 1 (on remplace x−h par x) mais l'inverse n'est pas vrai ; peu de variété.  
  *Correction :* Varier les fonctions extérieures (1/x, x^n, √x, ln, exp, |x|) et demander parfois f et g sans les imposer.
- **divcrit-2-1kl** (divcrit, enonce_ambigu) — « 8 ■ 0 » est écrit « 8\,■\,0 » : avec les espaces, on peut lire trois nombres. De plus, si la somme des autres chiffres est un multiple de 9 le chiffre manquant peut valoir 0 ou 9 (ex. 4■5) : à exclure du générateur (les 4 exemples n'ont pas ce cas).  
  *Correction :* Écrire « 8■0 » sans espaces et garantir que la somme des autres chiffres n'est pas ≡ 0 mod 9 (ou demander « le plus petit chiffre »).
- **domaine-2-1lm** (domaine, saisie_difficile) — Réponse x ≤ 5/3 : fraction non décimale, aucune indication de saisie (le niveau 1 donne un exemple de format, pas les niveaux 2-3). Niveau 3 (√ d'un trinôme du 2e degré) est exigeant pour MP1 et requiert un tableau de signes que le rappel n'enseigne pas.  
  *Correction :* Rappeler « (fractions acceptées) » ; pour MP1, limiter le niveau 3 à √(ax+b)/(cx+d) ; ajouter au rappel la méthode du signe d'un trinôme.
- **droites-1-st** (droites, generateur_repetitif) — Niveau 1 : les quatre exemples ont tous B = A + (1 ; ±3) (pente ±3, Δx = 1) : la pente se lit sans calcul. Niveau 3 : 2cd et 2de ont la même solution (2 ; −5). La question de droites-3 (système) est un exercice de systèmes plus que de droites.  
  *Correction :* Varier Δx (2, 3, −2) et la pente (fractions) ; varier les solutions des systèmes.
- **droitesinter-3-2cd** (droitesinter, niveau_inadapte) — Niveau 3 (hauteur issue de C) est plus simple que le niveau 2 (médiatrice : milieu + pente + ordonnée à l'origine) ; il n'y a plus d'étape milieu. L'indice ne parle que de la médiatrice.  
  *Correction :* Niveau 3 : intersection de deux hauteurs / orthocentre ou centre du cercle circonscrit ; compléter l'indice pour la hauteur.
- **droitesrem-1-tu** (droitesrem, generateur_repetitif) — Niveau 1 : 1-tu et 1-uv identiques (médiane de 6 cm).  
  *Correction :* Dédoublonner.
- **ensembles-2-1kl** (ensembles, corrige_faux_ou_flou) — Corrigé niveau 2 : 'Les deux bornes sont exclues : 8 entiers' sans calcul visible ; l'élève ne voit pas comment on obtient 8 (entiers de -7 à 0).  
  *Correction :* Écrire 'entiers de -7 à 0 : 0 - (-7) + 1 = 8'.
- **eq1-1-vw** (eq1, corrige_faux_ou_flou) — Corrigés avec coefficients 1 écrits explicitement (« 1x = −2 », « −1x = 27 », « 1x = −11 ») ; corrigé du niveau 1 (x+7=5) saute l'étape « −7 ». Corrigés niveau 3 trop brefs (« on multiplie par 12 : x = −12 », sans développement).  
  *Correction :* Formater « 1x » en « x » et « −1x » en « −x » ; détailler : 3x + 12 = 2x ⇔ x = −12.
- **eq2-2-1kl** (eq2, generateur_repetitif) — Niveau 2 : 1kl et 1lm identiques (x²-2x=0) ; niveau 3 : toujours ax²-b²=0, qui n'est pas un produit nul déjà factorisé et relève plutôt d'eq2fact.  
  *Correction :* Dédoublonner ; niveau 3 : produits à 3 facteurs ou équations de type x(x-3)=0 avec coefficient.
- **eq2-4-39u** (eq2, corrige_faux_ou_flou) — Le corrigé écrit directement x²+7x-198 = (x-11)(x+18) sans montrer comment trouver 11 et 18 (somme 7, produit -198) et sans dire qu'on rejette x = -18 (largeur négative). Pour un élève de MP1, factoriser 198 est lourd.  
  *Correction :* Ajouter « on cherche deux nombres de produit -198 et de somme 7 : 18 et -11 » et « x = -18 est rejeté (longueur négative) » ; ou choisir des aires plus petites.
- **eq2disc-1-st** (eq2disc, enonce_ambigu) — Niveau 1-2 : l'énoncé « Résous : … » ne précise ni le séparateur « ; » ni « aucune » (seul 2-1no le dit, ce qui donne indirectement la réponse). Idem eq2disc-2-1kl.  
  *Correction :* Ajouter systématiquement « Sépare les solutions par « ; » (« aucune » s'il n'y en a pas). » à tous les niveaux sans donner d'indice sur le nombre de solutions.
- **eq2disc-1-st** (eq2disc, generateur_repetitif) — Niveau 1 : 1-st et 1-uv identiques (x²+15x+56=0) ; niveau 3 : 2de et 2ef identiques (x²-4x-2=0).  
  *Correction :* Dédoublonner.
- **eq2disc-3-2cd** (eq2disc, corrige_faux_ou_flou) — Niveau 3 : le corrigé s'arrête à x = (-4 ± √8)/2 sans simplifier (-2 ± √2), alors que l'énoncé demande des valeurs exactes. Idem 3-2de (√24 -> 2 ± √6).  
  *Correction :* Terminer le corrigé : √8 = 2√2 donc x = -2 ± √2 ; ajouter l'ensemble S.
- **eq2disc-4-39u** (eq2disc, niveau_inadapte) — Problème à paramètre m (Δ en fonction de m, plus petite valeur entière) : abstrait pour MP1, notion classée aussi en MP1 · Équations.  
  *Correction :* Réserver aux classes Matu ou simplifier (a) seul pour MP1.
- **eq2fact-1-uv** (eq2fact, generateur_repetitif) — Niveau 1 : 1uv et 1vw identiques (x²=36) ; niveau 2 : 1lm et 1mn identiques (x²+4x=0).  
  *Correction :* Dédoublonner.
- **eq3-1-tu** (eq3, enonce_ambigu) — Énoncé et figure « x³ − 1x » : coefficient 1 écrit explicitement.  
  *Correction :* Afficher « x³ − x ».
- **eq3-2-1kl** (eq3, enonce_ambigu) — Niveaux 2 et 3 : pas de consigne de saisie (« ; »), contrairement au niveau 1 ; et le corrigé parle de « solution double » 0 sans dire si l'élève doit l'écrire une ou deux fois.  
  *Correction :* Ajouter « Sépare les solutions par « ; » (chaque solution une seule fois). ».
- **eqfrac-2-1kl** (eqfrac, generateur_repetitif) — Niveau 2 : 3 exemples sur 4 de la forme x/a + b = c (même structure) ; niveau 3 reprend presque tel quel l'exemple du rappel (x/2 + x/3 = …) ; niveau 2 à peine plus difficile que le niveau 1 de eq1.  
  *Correction :* Varier : (x+a)/b = (x−c)/d, 2 fractions avec nombre libre, parenthèses imbriquées.
- **eqirr-3-2cd** (eqirr, niveau_inadapte) — Niveau 3 pas plus difficile que le niveau 2 (même schéma √(ax+b) = x + c avec a = 2 ; une racine parasite) ; seul 3-2fg (√ + 2 = 0) change de type, et il est trivial. Le second exemple du rappel est mot pour mot la question eqirr-2-1mn (spoil). Le message « Plusieurs solutions : sépare-les par ; » apparaît même quand l'équation n'en a qu'une.  
  *Correction :* Niveau 3 : racine isolée à faire (√x + 3 = x − 3... ), deux racines carrées, ou x = √ ... ; changer l'exemple du rappel.
- **eqparam-1-st** (eqparam, rappel_de_cours) — Le rappel de 'ax = b' omet le cas a = 0 et b = 0 (infinité de solutions), alors que la notion est 'discuter selon un paramètre'. Les questions ne couvrent que 'aucune solution'.  
  *Correction :* Compléter le rappel et ajouter une question 'une infinité de solutions' au niveau 2.
- **eqrat-3-2cd** (eqrat, generateur_repetitif) — Niveau 3 : les quatre exemples ont exactement la même structure (x/(x−a) − b/(x−c) = k/((x−a)(x−c)), une racine du trinôme interdite) ; niveau 2 : produit en croix seul, aucun cas « aucune solution » alors que la consigne le mentionne. Le rappel indique « multiplier par le dénominateur commun » mais le corrigé niveau 2 emploie le produit en croix (non présenté).  
  *Correction :* Varier les structures (dénominateurs x²−a², solutions toutes admissibles, aucune solution) ; mentionner le produit en croix dans le rappel.
- **eqspec-1-tu** (eqspec, enonce_ambigu) — Énoncé mal typographié : « 6x + 3 = 6x + -2 » (signe « + - »). Aucun exemple niveau 1-2 ne conduit à « tous les nombres sont solutions », cas pourtant central du rappel.  
  *Correction :* Écrire « 6x + 3 = 6x − 2 » (normaliser « + − » en « − ») ; ajouter des exemples à infinité de solutions (réponse « R » ou « tous ») si la saisie le permet.
- **euclide-3-2de** (euclide, generateur_repetitif) — Niveau 3 : les trois exemples 2de, 2ef, 2fg sont identiques (cathètes 5 et 12) ; niveau 1 : 1-st (8 et 8) et 1-vw (2 et 2) sont des cas p = q peu représentatifs.  
  *Correction :* Tirer sans remise dans un pool de triplets plus large (6-8 ; 9-12 ; 8-15 ; 7-24 ; 20-21...) et éviter les doublons dans une même série.
- **exactes-2-1kl** (exactes, generateur_repetitif) — Niveau 2 : 1kl et 1no identiques (côté 8 cm). Figure du niveau 1 : « [ | ? ] » : l'étiquette du côté est vide alors que la diagonale seule porte « ? » (incohérent avec pyth-3 qui affiche « 6 cm »).  
  *Correction :* Dédoublonner ; afficher le côté (« 8 cm ») dans la figure.
- **expo-1-st** (expo, niveau_inadapte) — Niveau 2 (3^{x-2}=27) à peine plus difficile que niveau 1 : même méthode, un simple décalage. Les trois compétences annoncées (exponentielle simple, avec décalage, intérêts composés) sont couvertes mais aucun exemple ne demande une base différente à écrire comme puissance (ex. 4^x = 8, (1/2)^x = 8).  
  *Correction :* Ajouter au niveau 2/3 des cas où il faut changer de base commune (4^x = 32, 9^x = 27, (1/2)^x = 16).
- **expo-1-st** (expo, figure) — Une figure est présente (« [figure, textes : aucun] ») pour des équations sans représentation ni données (expo-1-*, expo-3-*, log-2-*, trigfn-*) : zone vide ou figure inutile.  
  *Correction :* Ne pas afficher de figure quand elle n'a pas de contenu (même remarque pour log, trigfn).
- **expo-1-st** (expo, generateur_repetitif) — Niveau 1 : 3 énoncés distincts sur 4 (3^x=27 apparaît deux fois), uniquement 3^x/5^x égaux à 9, 25, 27. Niveau 3 : seulement des intérêts composés alors que la notion annonce aussi l'exponentielle.  
  *Correction :* Élargir le tirage (bases 2, 3, 4, 5, 10 ; résultats variés) et dédoublonner.
- **f2-1-st** (f2, enonce_ambigu) — Niveau 1 : « Détermine les zéros » sans préciser le format de saisie (liste séparée par « ; », « aucun »).  
  *Correction :* Ajouter « Sépare les zéros par « ; » ».
- **f2expr-3-2cd** (f2expr, corrige_faux_ou_flou) — Niveau 3 : le corrigé pose le système mais donne la solution sans le résoudre ; c'est un système 3×3, lourd pour MP2 et identique à la notion f2trois (redondance). Le niveau 3 n'a pas de méthode simplifiée (soustraire les 1re et 2e équations donne b).  
  *Correction :* Montrer la résolution (éq.2 - éq.1 : 2b = …, puis a + c, puis éq.3) ; pour MP2 prendre des points avec abscisse 0 ou renvoyer vers f2trois.
- **f2trois-1-st** (f2trois, corrige_faux_ou_flou) — Le corrigé annonce « un système dont la solution est a=…, b=…, c=… » sans écrire le système ni le résoudre, alors que c'est tout l'enjeu de la notion.  
  *Correction :* Écrire c = f(0), puis a+b+c = … et a-b+c = …, additionner/soustraire pour a et b.
- **f2trois-2-1kl** (f2trois, generateur_repetitif) — Les niveaux 1 et 2 sont de même difficulté : tous les items ont A(0 ; c) et la seule différence est (-1 ; …) ou (2 ; …). Le niveau 3 est le premier sans point d'abscisse 0.  
  *Correction :* Niveau 2 : points d'abscisses 1, 2, 3 ou sans l'ordonnée à l'origine ; réserver x = 0 au niveau 1.
- **factor-1-st** (factor, enonce_ambigu) — « Factorise : 2x²-2x » : 2(x²-x) est aussi un produit ; l'attendu 2x(x-1) exige le plus grand facteur commun sans que l'énoncé le dise.  
  *Correction :* Écrire « Factorise complètement (mets en évidence le plus grand facteur commun) ».
- **factor-2-1lm** (factor, generateur_repetitif) — Niveau 2 : 1lm et 1mn identiques (x²-36) ; niveau 3 : x²-2x+1 apparaît deux fois (2cd et 2fg).  
  *Correction :* Dédoublonner les tirages.
- **factor-4-39u** (factor, corrige_faux_ou_flou) — Problème de l'enclos dans la notion « Factoriser » : b) corrigé « x = 80/4 = 20 » sans expliquer ; l'élève n'a pas vu le sommet dans ce chapitre. Rien ne fait appel à la factorisation.  
  *Correction :* Utiliser la forme factorisée : A(x) = x(80-2x) a pour zéros 0 et 40, maximum au milieu x = 20 ; ou rappeler -b/2a dans le corrigé.
- **fimg-2-1kl** (fimg, generateur_repetitif) — Niveau 2 : seulement « √(x−a), calcule f(n) » (1kl = 1lm identiques) ; ce niveau ne traite pas les préimages alors que la notion s'intitule « images et préimages » et que le niveau 3 passe directement aux préimages. Niveau 1 : figure dont l'unique texte est « ? », peu utile.  
  *Correction :* Diversifier le niveau 2 (image d'un nombre négatif, de fractions, préimage simple 3x+1=7) ; supprimer ou justifier la figure « ? ».
- **formule-3-2cd** (formule, saisie_difficile) — La réponse attendue contient une racine carrée (sqrt) et π ; l'énoncé ne dit pas comment les écrire au clavier (« sqrt(c^2-b^2) », « √ », « pi »).  
  *Correction :* Ajouter dans l'énoncé du niveau 3 : « (racine : sqrt( ) ou √ ; π : pi) ».
- **fracadd-3-2cd** (fracadd, generateur_repetitif) — Niveau 3 toujours de la forme a/a - 5/6 + x/12 (2/2, 3/3, 2/4-2/4...) : fractions non simplifiées artificielles, schéma répétitif. Pour fracadd, fracmul, fracops ('Calcule et simplifie'), l'attendu 'value' accepte aussi 8/18 pour 4/9 : la simplification n'est pas contrôlée.  
  *Correction :* Générer des fractions variées (dénominateurs 3, 4, 6, 8, 12 distincts), éviter n/n ; si possible vérifier la forme irréductible de la réponse saisie.
- **fracetage-2-1kl** (fracetage, generateur_repetitif) — Niveau 2 : seulement 2 énoncés distincts (a = 4 ou 9, toujours (1+a/x)/(1−a/x)), identique à l'exemple du rappel ; niveau 1 : 6/x ÷ 3/x² apparaît deux fois (fracetage-1-st = 1-uv) ; niveau 3 : seulement (1/x − 1/a)/(x − a).  
  *Correction :* Varier les structures (a/x + b)/(c − d/x), fractions de fractions avec deux inconnues, résultat non toujours de la forme (x+a)/(x−a).
- **fracrat-3-2cd** (fracrat, niveau_inadapte) — MP1 : le niveau 3 exige de factoriser deux trinômes du 2e degré et de saisir une fraction ; difficile pour MP1 (calcul algébrique). L'énoncé ne dit pas s'il faut donner les valeurs interdites, que le corrigé mentionne.  
  *Correction :* Pour MP1, limiter le niveau 3 à un trinôme + différence de carrés, ou demander explicitement « et donne les valeurs interdites ».
- **geocomb-1-tu** (geocomb, generateur_repetitif) — Niveau 1 : 1-tu et 1-vw identiques (25 et 15) ; niveau 2 : 1kl et 1lm identiques (7 et 24) ; niveau 3 : trois exemples sur quatre ont la base 5 × 12. Corrigé de geocomb-3-2de : « α ≈ 10° » alors que l'énoncé demande l'arrondi au dixième (10,0°) ; l'indice (« ou la trigonométrie ») ne rappelle pas arctan.  
  *Correction :* Dédoublonner ; écrire « α ≈ 10,0° » ; préciser « α = arctan(3/17) à la calculatrice » dans le corrigé.
- **homog-1-st** (homog, figure) — Figure signalée « textes : aucun » pour les trois niveaux : probablement un cadre sans contenu (ou le mot « aucun » affiché). Les niveaux 1 et 2 (asymptote verticale/horizontale) ont la même difficulté ; le zéro (cité dans le rappel) n'est jamais demandé ; le rappel n'exige pas numérateur non nul (cas dégénéré ad − bc = 0 exclu en pratique).  
  *Correction :* Supprimer la figure vide ; ajouter le zéro au niveau 2 ou une question « tracer » ; préciser dans le rappel la condition ad − bc ≠ 0.
- **homog-3-2ef** (homog, autre) — Cas où a = −d : f est une involution, donc f⁻¹ = f, et le corrigé écrit la même expression que f sans le remarquer. L'élève peut répondre en recopiant f sans calcul, et le corrigé a l'air faux.  
  *Correction :* Soit éviter a = −d, soit ajouter dans le corrigé : « ici f⁻¹ = f (f est sa propre réciproque) ».
- **homogrec-3-2cd** (homogrec, niveau_inadapte) — Le niveau 3 (calculer f^{-1}(29) en résolvant f(x)=29) est plus facile que le niveau 2 (expression complète de f^{-1}) ; l'ordre de difficulté est inversé.  
  *Correction :* Mettre cette question en niveau 1/2 et créer un niveau 3 plus exigeant (domaine/image de f^{-1}, asymptotes de f^{-1}, f=f^{-1}).
- **idrem-1-st** (idrem, generateur_repetitif) — Niveau 1 : 1-st et 1-uv identiques ((x+8)²) ; le niveau 3 est toujours (ax-b)², le niveau 2 contient (x+3)(x-3) mais jamais (ax+b)(ax-b).  
  *Correction :* Dédoublonner ; niveau 3 : mélanger (ax+b)², (ax-b)(ax+b), (a x - b y)…
- **ineq2-1-st** (ineq2, enonce_ambigu) — Aucun item ne précise comment écrire l'ensemble de solutions (intervalles, réunion ∪), contrairement à ineqfrac qui le dit.  
  *Correction :* Ajouter « Donne l'ensemble des solutions sous forme d'intervalle(s) (∪ pour une réunion, ou « aucune »). ».
- **inter-1-st** (inter, generateur_repetitif) — Niveau 1 : 1-st et 1-uv identiques (x² = x+12) ; le niveau 3 n'est pas plus difficile que le niveau 2 (même type f = parabole, g = droite à coefficients entiers, trinôme à racines entières).  
  *Correction :* Dédoublonner ; niveau 3 : racines non entières, ou deux paraboles, ou pas d'intersection.
- **interpar-2-1kl** (interpar, generateur_repetitif) — Niveau 2 pas plus difficile que le niveau 1 (les niveaux 1 et 2 sont deux paraboles à racines entières) ; les corrigés ne simplifient pas la factorisation (« (x)(x - 4) »).  
  *Correction :* Niveau 2 : racines non entières ou discriminant nul (une seule intersection) pour justifier la notion de nombre de points.
- **interpar-3-2ef** (interpar, corrige_faux_ou_flou) — Corrigé « x² - 1x + 1 » : coefficient 1 affiché. Dans le niveau 2 le corrigé affiche aussi « (x)(x - 4) », « 2(x + 4)(x) » (parenthèses autour de x seul).  
  *Correction :* Supprimer le coefficient 1 et les parenthèses inutiles : x(x - 4), 2x(x + 4).
- **lectgraph-1-st** (lectgraph, generateur_repetitif) — Niveau 1 : même type de courbe (cubique à deux zéros), 3 réponses sur 4 valent 0. Niveau 2 : 3 questions sur 4 identiques (« maximum local »), niveau 3 : réponses 3,1,3,3 sur une même cubique — réponse devinable.  
  *Correction :* Varier les types de courbes (parabole, courbe à 1, 2, 3 zéros, zéros non entiers), les questions (croissance, signe, f(x)=k avec 0, 1, 2, 3 solutions) et ne pas avoir 0 comme réponse majoritaire. Je n'ai pas pu vérifier la figure elle-même, seulement ses étiquettes.
- **lectgraph-2-1kl** (lectgraph, enonce_ambigu) — « Elle est décroissante entre deux valeurs de x. Quelle est la plus grande des deux ? » : formulation peu claire (entre quelles valeurs ? sur quel intervalle maximal ?).  
  *Correction :* Reformuler : « La fonction est décroissante sur un intervalle [a ; b]. Que vaut b ? ».
- **log-1-st** (log, generateur_repetitif) — Niveau 1 : seulement log_10 (10^n, 1/10) et log_3 ; niveau 3 : toujours log a + log b = log 100 ou 1000. Peu de variété (pas de log_2, de différence, de log(a^n)).  
  *Correction :* Varier les bases (2, 3, 5, 10) et les propriétés (différence, puissance).
- **log-2-1lm** (log, corrige_faux_ou_flou) — Corrigé « ≈ 2,1 » alors que l'énoncé demande le centième : la valeur 2,0959… s'arrondit à 2,10 ; le zéro final manque (même remarque triaire-2-1mn : « ≈ 21 » au lieu de 21,0 au dixième). L'élève peut croire qu'on arrondit ailleurs.  
  *Correction :* Afficher le nombre d'arrondi complet (2,10 ; 21,0) dans le corrigé.
- **log-3-2cd** (log, enonce_ambigu) — « log » sans base (log 4 + log 250) : la convention log = log_10 n'est pas rappelée dans le rappel qui utilise « log » pour la propriété générale puis ln.  
  *Correction :* Ajouter dans le rappel « log = log_{10} » ou écrire log_{10} 4 + log_{10} 250.
- **logbase-3-2cd** (logbase, generateur_repetitif) — Niveau 3 : logbase-3-2cd et logbase-3-2de sont identiques (log_3 7 · log_7 27) ; niveau 1 et 3 sont par ailleurs faciles (même tirage de puissances de 2 et de 3).  
  *Correction :* Dédoublonner et varier (log_a b · log_b c · log_c d, bases 2, 3, 5, 7).
- **modexp-2-1mn** (modexp, corrige_faux_ou_flou) — Corrigé « 400 · 2^{6} = 25{'}600 » : le « ' » placé en mode mathématique s'affiche comme un prime (25′600) ; les autres corrigés écrivent 4800 sans séparateur (incohérence).  
  *Correction :* Écrire 25\,600 ou 25'600 hors mode math, de façon cohérente (ou utiliser l'espace fine).
- **modexp-3-2cd** (modexp, niveau_inadapte) — Niveau 3 (multiplié par 64 en doublant tous les 5 ans) ne demande que d'écrire 64 = 2^6 : pas plus difficile que le niveau 2 (qui calcule 100·2^5) ; le rappel annonce « pour trouver un temps on utilise un logarithme » mais aucun exemple n'en demande un. Tous les niveaux 3 sont du même type avec des puissances exactes de 2.  
  *Correction :* Au niveau 3 proposer aussi des cas sans puissance exacte (multiplié par 10 → t = T·ln10/ln2, arrondi demandé) ou corriger le rappel.
- **monomes-3-2de** (monomes, generateur_repetitif) — Niveau 3 : 2de et 2ef sont identiques ((4x)²·4x) ; niveau 1 et 2 très homogènes (4 variantes seulement).  
  *Correction :* Augmenter l'espace de tirage (exposants, coefficients négatifs, (−2x)²·…) et dédoublonner.
- **morceaux-1-st** (morceaux, generateur_repetitif) — Niveau 1 : 3 énoncés sur 4 évaluent à la frontière (f(1), f(1), f(2)) avec la même structure ; niveau 3 : seule la continuité en un point, jamais de tracé. Corrigé morceaux-3-2ef : « 2²+0 » maladroit. Figure déclarée sans texte : je n'ai pas pu en juger.  
  *Correction :* Varier le point d'évaluation (avant, après, frontière) ; corrigé : 2·2+m = 2² ⇔ m = 0.
- **optim-2-1kl** (optim, generateur_repetitif) — Niveau 2 : 1kl et 1no identiques (-5t²+10t) ; niveau 3 : trois enclos simples (périmètre fixé) presque identiques, seul 2de (mur) diffère.  
  *Correction :* Dédoublonner ; varier les contextes (bénéfice, prix).
- **polydiv-3-2cd** (polydiv, corrige_faux_ou_flou) — Corrigé niveau 3 peu lisible : « −12 + (−1)k = 0 ⇔ k = −12 » : le calcul de P(−1) (= −1 − 4 − k − 7) n'est pas détaillé et « (−1)k » est maladroit.  
  *Correction :* Écrire P(−1) = −1 − 4 − k − 7 = −12 − k, donc k = −12 (idem 2de, 2ef, 2fg).
- **polyexpr-2-1lm** (polyexpr, corrige_faux_ou_flou) — Corrigés avec coefficient 1 maladroits : « −1a = −1 », « 1a = −2 » (polyexpr-2-1no). Niveau 1 : tous les exemples demandent seulement a à partir de f(0) avec la forme factorisée déjà écrite : aucune construction de l'expression.  
  *Correction :* Écrire « −a = −1 », « a = −2 » ; au niveau 1 faire écrire f(x) à partir des zéros.
- **polyexpr-3-2cd** (polyexpr, niveau_inadapte) — Le niveau 3 (volume d'une boîte pour une valeur de x) est une simple évaluation numérique, plus facile que le niveau 2 ; la formule V(x) = x(L − 2x)² n'est pas demandée, alors que le rappel/indice portent sur « zéros ⇒ facteurs ». L'indice ne correspond pas à ce niveau.  
  *Correction :* Demander V(x) sous forme factorisée, ou le x qui donne V(x) = valeur donnée, ou l'intervalle de x ; adapter l'indice.
- **polyfact-2-1lm** (polyfact, generateur_repetitif) — Niveau 2 : 1lm et 1mn identiques (x³ + 10x² + 31x + 30). Niveaux 1 et 2 : toujours trois racines entières et x³ de coefficient 1 ; le niveau 3 mélange cubique et bicarré (rupture de difficulté).  
  *Correction :* Dédoublonner ; ajouter des cas avec racine double ou aucune autre racine réelle.
- **premiers-3-2cd** (premiers, generateur_repetitif) — Le nombre 210 apparaît dans 3 exemples (2-1kl, 3-2cd, 3-2ef) ; le niveau 3 est à peine plus difficile que le niveau 2. Corrigé niveau 1 : on justifie '37 premier' mais pas que 32 à 36 ne le sont pas ; les 'compétences' répètent deux fois 'Décomposer en facteurs premiers'.  
  *Correction :* Interdire les doublons, donner au niveau 3 des nombres avec exposants élevés (360, 1'001) ; compléter le corrigé niveau 1 (liste des nombres testés).
- **probeq2-1-uv** (probeq2, generateur_repetitif) — Niveau 1 : 1uv et 1vw identiques (produit 30) ; niveau 2 : 1mn et 1no identiques (4 cm, 96 cm²). Le niveau 1 (entiers consécutifs) est plus abstrait que le niveau 2 (rectangle).  
  *Correction :* Dédoublonner ; inverser ou aplanir la progression.
- **probeq2-3-2cd** (probeq2, corrige_faux_ou_flou) — Niveau 3 : le corrigé donne l'équation 2x²+4x-96 = 0 puis « Solution positive : x = 6 » sans montrer la résolution (simplification par 2, factorisation ou Δ), contrairement au niveau 1-2.  
  *Correction :* Ajouter : « x²+2x-48 = (x-6)(x+8) = 0, x = 6 ou x = -8 (rejeté) ».
- **probrat-3-2cd** (probrat, corrige_faux_ou_flou) — Niveau 3 : le corrigé écrit « mène à v² + 5v − 1050 = 0, dont la solution positive est v = 30 » sans montrer la mise au même dénominateur ni la résolution du trinôme ; non reproductible par l'élève. Énoncé « Quelle est sa vitesse » : ne précise pas « vitesse initiale ». Répétitions : 3-2cd = 3-2ef (210 km), niveau 1 uv = vw.  
  *Correction :* Détailler : 210(v+5) − 210v = v(v+5) → v²+5v−1050 = 0, Δ = 4225 = 65², v = 30 ; écrire « sa vitesse initiale » ; dédoublonner.
- **puiss-3-2de** (puiss, generateur_repetitif) — Niveau 3 : puiss-3-2de et 3-2ef sont identiques, tous en base 2 avec le même schéma (2^a)^b / 2^c ; niveau 3 peu exigeant pour Matu 1re (pas de base ≠ 2, pas d'exposants négatifs).  
  *Correction :* Varier bases (3, 5, 10), ajouter exposants négatifs et produits (a^3·a^-5)/a^-2 ; dédoublonner.
- **pyth-3-2ef** (pyth, generateur_repetitif) — Niveau 3 : 2ef et 2fg strictement identiques (carré de côté 2 cm). De plus le niveau 3 (diagonale d'un carré) n'est pas plus difficile que le niveau 1 et reprend exactement exactes-1 (autre notion).  
  *Correction :* Dédoublonner ; rendre le niveau 3 plus riche (diagonale d'un rectangle de côté irrationnel, distance entre deux points d'une figure, périmètre ou aire à partir de la diagonale).
- **pythfig-3-2cd** (pythfig, generateur_repetitif) — Niveau 3 : trois exemples sur quatre sont identiques (pavé 3 × 4 × 12, réponse 13) ; pool de triplets trop petit.  
  *Correction :* Élargir le pool (2-3-6 → 7 ; 1-4-8 → 9 ; 2-6-9 → 11 ; 4-6-12 → 14) et dédoublonner.
- **pythrec-3-2cd** (pythrec, niveau_inadapte) — Le niveau 3 se réduit à un calcul de 6² − (3² + 4²) : on ne demande pas de conclure (rectangle ou non), ni de repérer le plus grand côté ; c'est plus facile que le niveau 2. Au niveau 1, 1-st et 1-vw ont le même triplet (9 ; 12 ; 15). L'énoncé du niveau 1 (« triangle rectangle ... hypoténuse ») n'utilise pas la réciproque.  
  *Correction :* Niveau 3 : « Le triangle de côtés a, b, c est-il rectangle ? Réponds 1 (oui) ou 0 (non) », ou demander la valeur de k pour qu'il soit rectangle (côtés 5, 12, k) ; dédoublonner le niveau 1.
- **racenc-3-2cd** (racenc, generateur_repetitif) — Niveau 3 : 3-2cd et 3-2de sont identiques (7 < √n < 8). Niveau 2 : la réponse est toujours l'entier donné dans l'énoncé (pas de variété, devinable au hasard 1 chance sur 2 avec une majorité 'l'entier').  
  *Correction :* Dédoublonner ; varier le type de comparaison (√a et √b, ou un décimal) et demander l'ordre.
- **racinv-2-1kl** (racinv, corrige_faux_ou_flou) — Le corrigé niveau 2 dit « d'où 9 et 4 » sans montrer la résolution de (x−6)²=x, soit x²−13x+36=0 ; la tâche centrale est escamotée. Niveau 1 : « x = 2/5 = 2/5 » (redondant).  
  *Correction :* Écrire : x²−13x+36=0 ⇔ (x−9)(x−4)=0 ; vérifier √9=3=9−6 ✓ et √4=2≠4−6=−2 ✗. Supprimer la répétition de la fraction.
- **ratden-3-2de** (ratden, niveau_inadapte) — Niveau 3 : dans 2 exemples sur 4 (2de, 2ef) le dénominateur conjugué vaut 1, donc p est simplement le numérateur : la question n'évalue plus le calcul de la conjuguée. L'énoncé donne en plus la forme p(√b + c), qui souffle la conjuguée.  
  *Correction :* Exclure b - c² = 1 ou exiger un dénominateur ≥ 2 ; ne pas donner la forme, ou demander la forme développée.
- **recip-3-2cd** (recip, corrige_faux_ou_flou) — Réponse attendue et corrigé laissent un dénominateur négatif : f^{-1}(x) = (x+2)/(−4). Correct mais peu naturel ; l'élève risque de se demander si −(x+2)/4 ou (−x−2)/4 sont acceptés (ils le sont par équivalence, mais le corrigé ne le dit pas).  
  *Correction :* Écrire le corrigé sous la forme −(x+2)/4 (ou −x/4 − 1/2).
- **recip-3-2cd** (recip, niveau_inadapte) — Niveau 3 = réciproque d'une fonction affine, c'est-à-dire pas plus difficile que les niveaux 1-2 ; même remarque pour homogrec-3-* (calculer f^{-1}(c) en résolvant f(x)=c est plus simple que le niveau 2 qui demande l'expression de f^{-1}).  
  *Correction :* Niveau 3 recip : réciproque d'une fonction non affine (ex. x²+k sur [0;∞[, √x+k, 1/x+k). Niveau 3 homogrec : permuter avec le niveau 2 ou demander (f^{-1}∘f) / une valeur interdite de f^{-1}.
- **reduire-2-1kl** (reduire, enonce_ambigu) — Les énoncés contiennent « + 1x » / « - 1x » (ex. 5x² + 2x + 2x² + 1x - 3, 5x²+3x-4x²-1x-8), écriture jamais utilisée par un enseignant et qui perturbe.  
  *Correction :* Omettre le coefficient 1 (écrire « + x », « - x »).
- **rel-1-st / rel-2-1lm** (rel, niveau_inadapte) — Niveau 1 : '8 + 9' et '5 + 1' sont triviaux pour Matu 1re (la notion s'intitule 'multiplier, diviser, priorités' mais le niveau 1 n'a que des additions). Les figures (droite graduée) ne correspondent pas toujours à la question : rel-2-1lm montre -3..1 alors que l'expression vaut -32.  
  *Correction :* Niveau 1 : produits/quotients de relatifs (ex. (-6)·7, (-24):(-4)). Figure : supprimer la droite graduée ou la limiter aux additions de petits entiers.
- **sci-1-st** (sci, enonce_ambigu) — L'exemple donné dans l'énoncé (2,5·10^-3) a le même exposant que la réponse de sci-1-st (4,9·10^-3), ce qui souffle l'exposant. Tous les niveau 1 sont des petits nombres (jamais de grand nombre). Corrigé sci-2-1kl : '8·10² = 8·10²' tautologique. La figure (échelle 10^-6…10^8) n'apporte rien.  
  *Correction :* Choisir un exemple d'un autre ordre de grandeur, mélanger grands et petits nombres au niveau 1, corriger le corrigé en '4·2 = 8 ; 10^6·10^-4 = 10^2', supprimer la figure ou la rendre utile.
- **scicalc-2-1kl** (scicalc, generateur_repetitif) — scicalc-2-1kl et 2-1mn sont identiques ((9,6·10^9):(3·10^3)). Les niveaux 1 sont à mantisse 2 ou 2,5 ou 4 de façon répétitive.  
  *Correction :* Dédoublonner les tirages.
- **simil-2-1kl** (simil, figure) — Les figures du niveau 2 affichent « × 1.5 » avec un point décimal (convention suisse : virgule) et une étiquette « 1 » peu explicite. Au niveau 1 (simil-1-uv), le petit triangle a deux côtés de 4 cm (4 ; 5 ; 4) : « le côté correspondant à 4 cm » est ambigu en principe (sans conséquence sur la réponse).  
  *Correction :* Écrire « × 1,5 » ; supprimer l'étiquette « 1 » ; éviter deux côtés égaux dans le petit triangle de simil-1.
- **simil-3-2cd** (simil, generateur_repetitif) — Niveau 3 : 2cd et 2de quasi identiques (aires 2 et 50 / 2 et 32, périmètre 9). Rappel : la notion s'intitule « Homothéties et similitudes » mais le cours ne parle ni d'homothétie, ni de centre.  
  *Correction :* Varier les périmètres ; renommer la notion (« Agrandissement et réduction ») ou ajouter la définition d'homothétie.
- **sinlaw-1-st** (sinlaw, enonce_ambigu) — « a = 10, α = 38° » : l'énoncé ne précise pas que a est le côté opposé à α (la convention n'est visible que par la figure et le rappel). Pour une classe MP2 la convention n'est pas toujours acquise.  
  *Correction :* Écrire « le côté a = BC est opposé à l'angle α » dans l'énoncé de niveau 1.
- **sinlaw-3-2cd** (sinlaw, rappel_de_cours) — Le niveau 3 demande un angle par le théorème du cosinus (cos γ = (a²+b²−c²)/(2ab) puis arccos) mais le rappel ne donne que c² = a²+b²−2ab cos γ et aucun exemple de calcul d'angle ni d'usage de cos⁻¹ ; pas d'exemple pour le théorème du sinus. Le corrigé s'arrête à « γ ≈ 84,26° » sans écrire l'arccos.  
  *Correction :* Ajouter au rappel : cos γ = (a²+b²−c²)/(2ab), γ = cos⁻¹(…) à la calculatrice en degrés, et un exemple de théorème du sinus ; écrire « γ = cos⁻¹(8/80) ≈ 84,26° » dans le corrigé.
- **stats-1-st / stats-3-2fg** (stats, corrige_faux_ou_flou) — Corrigé tautologique '56/5 = 56/5 ≈ 11,2' (et 11,2 est exact). La somme des valeurs n'est pas détaillée. Au niveau 3, les carrés des écarts ne sont pas montrés ; stats-3-2fg affiche '≈ 3,3' alors que la consigne est 'au centième' (3,30).  
  *Correction :* Afficher la somme (6+16+9+14+11 = 56), supprimer la répétition de la fraction, donner le tableau des écarts au carré ou la mention 'calculatrice (mode statistiques, σx)', et écrire 3,30.
- **sysgraph-2-1kl** (sysgraph, corrige_faux_ou_flou) — Le corrigé niveau 2 ne vérifie pas que les seconds membres ne sont pas proportionnels (5→19 vs 4×5=20, qui donnerait une infinité) : condition nécessaire pour « aucune solution ». Niveau 3 presque identique au niveau 2 (proportionnalité) ; niveau 1 trivial.  
  *Correction :* Ajouter : « et 19 ≠ 4·5 = 20, donc aucune solution (et non une infinité) » ; différencier les niveaux (niveau 3 : valeur de m pour exactement une solution à exclure, etc.).
- **sysprob-2-1kl** (sysprob, corrige_faux_ou_flou) — Corrigés niveau 2 : « 3x + 1y = 10 » (coefficient 1 écrit) et « On trouve x = 1,5 » sans résolution ni définition de x et y avant utilisation ; niveau 3 : « x + y = 10 et 2x + 4y = 32 » sans dire que x = poules, y = lapins. Niveau 1 : 1uv = 1tu identiques.  
  *Correction :* Définir les inconnues (x poules, y lapins ; x croissant, y café), écrire « y » au lieu de « 1y », montrer la combinaison.
- **thales-3-2cd** (thales, autre) — Niveau 3 (bâton et ombre) : situation de proportionnalité, pas vraiment de Thalès, plus facile que le niveau 2 ; une seule situation pour tout le niveau.  
  *Correction :* Ajouter d'autres contextes (deux triangles emboîtés avec plusieurs étapes, trapèze, distance inaccessible).
- **tradexpr-1-st** (tradexpr, indice) — L'indice « La dernière opération nommée… est la première dans la phrase » est contradictoire/obscur (c'est l'opération calculée en dernier qui est nommée en premier).  
  *Correction :* « L'opération nommée en premier dans la phrase est celle qu'on effectue en dernier : on calcule d'abord ce qui est à la fin de la phrase. »
- **tradexpr-1-st** (tradexpr, generateur_repetitif) — Niveau 1 : « double de la somme de a et a » (opérandes identiques, 4 et 4 ; 9 et 9) : l'ordre ne se vérifie pas ; niveau 2 et 3 : une seule phrase-type à chaque fois, seuls les nombres changent.  
  *Correction :* Éviter deux opérandes égaux ; varier les tournures (triple, moitié, carré, différence, quotient) et les structures.
- **transf-1-st** (transf, corrige_faux_ou_flou) — Corrigé niveau 1 mal formulé : « (x+3)² décale de −3 horizontalement et −4 décale de −4 verticalement » ; niveau 3 : l'ordonnée est calculée sans dire que g(3)=2f(2)+2. Intitulé de la notion (f(x−a)+b) alors que le niveau 3 inclut k·f.  
  *Correction :* Reformuler : « (x+3)² déplace la parabole de 3 vers la gauche, le −4 de 4 vers le bas ; sommet (0;0) → (−3;−4) ». Mentionner « k·f(x) » dans le titre.
- **triaire-1-st** (triaire, generateur_repetitif) — Niveau 1 : toujours l'angle 150° (aire = ¼·a·b) ; niveau 3 : 3 énoncés sur 4 à 120° avec des entiers à 2 chiffres, deux identiques (triaire-3-2de = triaire-3-2ef : 7 km, 8 km, 120°). Le niveau 1 exige de connaître sin 150° = 1/2 sans calculatrice, ce que ne donne pas le rappel (qui n'a pas de table de valeurs exactes).  
  *Correction :* Varier les angles (30°, 45°, 60°, 120°, 150°) et dédoublonner ; ajouter les valeurs remarquables au rappel.
- **trigassoc-1-uv** (trigassoc, rappel_de_cours) — Les niveaux 1-2 utilisent cos(180°+α) et cos(90°+α) qui ne figurent pas dans le rappel (qui donne 180°−α, −α, 90°−α seulement).  
  *Correction :* Compléter le rappel avec cos(180°+α) = −cos α, sin(180°+α) = −sin α, cos(90°+α) = −sin α, sin(90°+α) = cos α.
- **trigcercle-2-1kl** (trigcercle, rappel_de_cours) — Les niveaux 2-3 demandent cos/sin de 30°, 45°, 60° et d'angles dérivés, mais le rappel ne donne aucune table des valeurs remarquables (0, 30°, 45°, 60°, 90°) : seul sin 30°/cos 30° apparaît dans un exemple. Il n'explique pas non plus la conversion radians → degrés.  
  *Correction :* Ajouter le tableau des valeurs exactes de sin, cos, tan (0°, 30°, 45°, 60°, 90°) et la formule rad → degrés.
- **trigeq-1-st** (trigeq, generateur_repetitif) — Niveau 1 : seulement sin x = ±√3/2 (2 énoncés distincts sur 4) ; niveau 2 : cos x = 1/2 deux fois ; la compétence « résoudre sin x = c » est réduite à un seul cas. Le problème trigeq-4 (sin 2x) n'est pas faisable sans exemple de résolution avec 2x dans le rappel de trigeq (il est dans trigeq2) et est exigeant pour MP2.  
  *Correction :* Varier c (±1/2, ±√2/2, 0, ±1) ; pour MP2, renvoyer sin(kx) vers trigeq2 ou simplifier.
- **trigeq-2-1kl** (trigeq, enonce_ambigu) — Niveau 2 et 3 : « Résous cos x = … (en degrés) » sans préciser « sépare par ; » (présent au niveau 1) ; l'élève ne sait pas comment saisir les deux solutions. L'indice ne parle que de sin et cos alors que le niveau 3 est tan (x et x + 180°).  
  *Correction :* Ajouter « sépare les solutions par « ; » » à tous les niveaux et la règle de tan dans l'indice (« tan x = t : x et x + 180° »).
- **trigeq2-1-st** (trigeq2, niveau_inadapte) — L'ordre de difficulté est inversé : le niveau 1 (résoudre cos(3x)=0 ou sin(3x)=√3/2 sur un intervalle) est nettement plus difficile que le niveau 2 (lire a et d à partir de max et min). Le rappel donne l'exemple sin(2x)=1/2 sans préciser l'intervalle de x : x = 15° ou 75° sont les seules solutions seulement sur [0° ; 180°[, ce qui n'est pas écrit.  
  *Correction :* Permuter les niveaux ou ajouter une étape facile au niveau 1 ; préciser « pour 0° ≤ x < 180° » dans l'exemple du rappel.
- **trigexact-3-2cd** (trigexact, figure) — La figure affiche '100 m' alors que l'énoncé n'en parle pas (incohérence). Le niveau 3 n'utilise plus de valeurs exactes (tan 6° à la calculatrice) alors que la notion est 'valeurs exactes, pente et angle'. trigexact-2-1lm et 2-1no sont identiques (isocèle de côté 8).  
  *Correction :* Retirer '100 m' de la figure ou l'écrire dans l'énoncé ('pour 100 m horizontaux') ; ajouter au niveau 3 une pente avec angle exact (tan 45°, tan 30° = √3/3) ; dédoublonner.
- **trigfn-3-2cd** (trigfn, enonce_ambigu) — L'énoncé demande « la valeur maximale… et en quel plus petit x ≥ 0 » mais impose de répondre « x ; max » (ordre inversé par rapport à la question). Risque d'inversion. Le corrigé de trigfn-3-2fg écrit « Le maximum vaut 4 = 4 » (tautologie).  
  *Correction :* Reformuler : « en quel plus petit x ≥ 0 le maximum est-il atteint, et quelle est sa valeur ? Réponds « x ; max » » ; corriger le corrigé (« Le maximum vaut 4 »).
- **trigo-2-1mn** (trigo, generateur_repetitif) — Niveau 2 : deux exemples (2-1mn, 2-1no) avec cathètes égales (α = 45°), triviaux et identiques en nature ; niveau 3 (hauteur = d·tan α) est plus simple que le niveau 2 ; trigo-3-2de et 3-2fg ont le même angle 31°.  
  *Correction :* Interdire cathètes égales au niveau 2 ; ajouter au niveau 3 des cas à deux étapes (angle d'élévation depuis deux points, hauteur des yeux).
- **trigrel-1-st** (trigrel, niveau_inadapte) — Classe 'Matu 2e · Fonctions trigonométriques' : toutes les questions imposent 'α aigu', donc aucune réflexion de signe/quadrant (cos négatif, etc.) ; niveau trop bas pour Matu 2e.  
  *Correction :* Pour Matu 2e, ajouter des variantes avec α dans un autre quadrant (ex. 'α ∈ ]90° ; 180°[').
- **trinfact-3-2de** (trinfact, generateur_repetitif) — Niveau 3 : 3 items sur 4 (2de, 2ef, 2fg) ont le même zéro -1/3 avec a = 3. Le corrigé écrit en plus 3(x - (-1/3))(x + 5), notation lourde. Le rappel enseigne a(x-x1)(x-x2) alors que l'attendu est (3x+1)(x+5) : vérifier que 3(x+1/3)(x+5) est accepté (form product).  
  *Correction :* Varier a (2, 4, 5) et les zéros ; simplifier le corrigé (x + 1/3) ; accepter les deux formes dans le correcteur.
- **valint-1-st** (valint, generateur_repetitif) — Niveau 1 : quatre fractions du même type c/(x±a) ; niveau 2 : (x−c)/((x−a)(x+b)) ; aucun cas où le numérateur s'annule en même temps que le dénominateur (le piège du rappel « les zéros du numérateur ne sont pas des valeurs interdites » n'est jamais testé) ; aucun cas où la fraction n'a pas de valeur interdite (x²+4) ou avec facteur 2x.  
  *Correction :* Ajouter des cas avec le numérateur qui s'annule en une valeur non interdite (x−2)/((x−2)(x+3)) et des dénominateurs irréductibles (réponse « aucune »).
- **vecteurs-1-st** (vecteurs, autre) — La notion est liée à « MP2 · Espace » mais ne traite que des vecteurs du plan (deux composantes) ; aucun exemple avec trois composantes ou norme dans l'espace, ce qui ne couvre pas le chapitre MP2 « Espace ». Les niveaux 2-3 sont corrects mais pas très variés (niveau 3 : produit scalaire ou k perpendiculaire).  
  *Correction :* Ajouter des variantes 3D pour MP2 (A(x;y;z), norme √(x²+y²+z²), produit scalaire à 3 termes) ou retirer le rattachement à « MP2 · Espace ».

## Écartés à la vérification

- Corrigés « tronqués » autour de « < » (modaff-2, ineq-4) : artefact de l'extraction, le corrigé est complet dans l'app.
