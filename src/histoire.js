// Histoire des maths (22.11, idée de l'auteur) : un événement, une anecdote ou un portrait par semaine, dans l'onglet
// « Exploration », sous les questions curieuses. Faits sobres et vérifiables ; une légende est présentée comme telle.
// t : type (Événement, Anecdote, Portrait) ; lien : notion de l'app à laquelle le récit se rattache (affichée en bas).
const HISTOIRE = [
  { t: "Événement", titre: "Le signe « = » a été inventé en 1557", txt: "Le Gallois Robert Recorde en avait assez d'écrire « est égal à » dans ses calculs. Dans son livre <i>The Whetstone of Witte</i> (1557), il propose deux traits parallèles de même longueur, « parce que deux choses ne peuvent être plus égales ». Son signe était beaucoup plus long que le nôtre.", lien: "Équations" },
  { t: "Portrait", titre: "Al-Khwârizmî, le mathématicien qui a donné son nom à l'algorithme", txt: "Savant de Bagdad au IX<sup>e</sup> siècle, il écrit un traité sur la résolution des équations. Le mot « algèbre » vient du titre de ce livre (<i>al-jabr</i>), et le mot « algorithme » vient de son nom, déformé en latin.", lien: "Équations" },
  { t: "Anecdote", titre: "Les fractions des scribes égyptiens", txt: "Il y a plus de 3500 ans, les scribes égyptiens écrivaient presque toutes leurs fractions comme des sommes de fractions de numérateur 1. Par exemple, au lieu de 3/4, ils notaient 1/2 + 1/4. Le papyrus Rhind contient des tables entières de ces décompositions.", lien: "Fractions" },
  { t: "Événement", titre: "Le zéro devient un nombre", txt: "En 628, le mathématicien indien Brahmagupta donne des règles de calcul avec zéro et avec les nombres négatifs (qu'il appelle des « dettes ») : une dette moins zéro est une dette, zéro moins zéro est zéro… Le zéro n'est plus seulement un emplacement vide, c'est un nombre.", lien: "Nombres relatifs" },
  { t: "Portrait", titre: "Fibonacci et les chiffres « arabes »", txt: "En 1202, Léonard de Pise, dit Fibonacci, publie le <i>Liber Abaci</i>. Il y montre aux marchands européens comment calculer avec les chiffres indo-arabes (0 à 9) au lieu des chiffres romains. Il a appris ces méthodes en Afrique du Nord, où travaillait son père.", lien: "Calcul" },
  { t: "Anecdote", titre: "Archimède encadre π", txt: "Vers 250 av. J.-C., Archimède dessine des polygones à 96 côtés à l'intérieur et à l'extérieur d'un cercle. Il en déduit que π est compris entre 3 + 10/71 et 3 + 1/7, soit environ entre 3,1408 et 3,1429. Sans calculatrice !", lien: "Cercle et disque" },
  { t: "Événement", titre: "Ératosthène mesure la Terre", txt: "Vers 240 av. J.-C., Ératosthène remarque qu'à midi, le jour du solstice d'été, le Soleil éclaire le fond des puits à Syène, mais pas à Alexandrie, où les ombres font un angle d'environ 7°. Avec la distance entre les deux villes et la proportionnalité, il estime le tour de la Terre avec une précision étonnante pour l'époque.", lien: "Proportionnalité et angles" },
  { t: "Anecdote", titre: "Thalès et la hauteur de la pyramide", txt: "Selon un récit rapporté par des auteurs grecs, Thalès aurait mesuré la hauteur d'une pyramide d'Égypte grâce à son ombre : au moment où l'ombre d'un bâton est égale à sa hauteur, l'ombre de la pyramide est aussi égale à sa hauteur. C'est sans doute une légende, mais l'idée est exactement celle des triangles semblables.", lien: "Théorème de Thalès" },
  { t: "Anecdote", titre: "Le petit Gauss et la somme de 1 à 100", txt: "Selon une anecdote célèbre, l'instituteur du jeune Carl Friedrich Gauss aurait demandé à sa classe d'additionner les nombres de 1 à 100. Gauss aurait répondu presque aussitôt 5050 : 1 + 100, 2 + 99, 3 + 98… font 50 paires de 101.", lien: "Calcul littéral" },
  { t: "Événement", titre: "Une tablette babylonienne et les triplets de Pythagore", txt: "La tablette d'argile Plimpton 322, écrite en Mésopotamie vers 1800 av. J.-C., contient des listes de nombres liés aux triangles rectangles, plus de mille ans avant Pythagore. Les mathématiciens discutent encore de la façon exacte dont elle était utilisée.", lien: "Théorème de Pythagore" },
  { t: "Portrait", titre: "Sophie Germain, alias « Monsieur Le Blanc »", txt: "Au début du XIX<sup>e</sup> siècle, les femmes ne pouvaient pas étudier à l'École polytechnique. Sophie Germain se procure les cours et envoie ses travaux sous le nom d'un ancien élève, « M. Le Blanc ». Elle correspond même ainsi avec Gauss, qui découvre plus tard qui elle est et la félicite.", lien: "Nombres premiers" },
  { t: "Portrait", titre: "Maryam Mirzakhani, médaille Fields 2014", txt: "Née à Téhéran, Maryam Mirzakhani est en 2014 la première femme à recevoir la médaille Fields, la plus haute récompense pour les jeunes mathématiciens. Elle travaillait sur la géométrie des surfaces courbes, et disait aimer dessiner sur de grandes feuilles pour réfléchir.", lien: "Géométrie" },
  { t: "Événement", titre: "Descartes met la géométrie en équations", txt: "En 1637, René Descartes publie <i>La Géométrie</i>. Il y décrit les points par des nombres et les courbes par des équations. C'est aussi lui qui popularise l'habitude de noter les inconnues x, y, z et les nombres connus a, b, c.", lien: "Fonctions" },
  { t: "Portrait", titre: "Leonhard Euler, le Bâlois prolifique", txt: "Né à Bâle en 1707, Leonhard Euler est l'un des mathématiciens les plus productifs de l'histoire. Devenu presque aveugle, il continue à publier en dictant ses calculs. On lui doit beaucoup de notations encore utilisées, comme f(x) pour une fonction.", lien: "Fonctions" },
];
const Histoire = {
  // Récit de la semaine (même pour tout le monde la même semaine), puis « un autre » au hasard.
  week() { const w = Math.floor(Date.now() / (7 * 864e5)); return w % HISTOIRE.length; },
  card(k) {
    const H = HISTOIRE[k];
    return `<div class="card stack hist-card" id="hist"><div class="eyebrow">📜 Histoire des maths · ${H.t}</div><h3>${H.titre}</h3>
      <p>${H.txt}</p><div class="spread"><span class="small muted">Lien avec : ${H.lien}</span><button type="button" class="btn-sec small" id="histnext" data-k="${k}">Une autre histoire</button></div></div>`;
  },
  bind(root) {
    const b = root.querySelector("#histnext"); if (!b) return;
    b.onclick = () => { let k; do { k = Math.floor(Math.random() * HISTOIRE.length); } while (k === +b.dataset.k); const c = root.querySelector("#hist"); c.outerHTML = Histoire.card(k); Histoire.bind(root); };
  },
};
