// Cache hors ligne : la page d'abord depuis le réseau (pour recevoir les mises à jour), sinon depuis le cache ;
// le reste (code de l'app, MathJax, polices, icônes) depuis le cache, complété au fil de l'eau.
// 23.11 (chantier F, chargement) : le code de l'app est un fichier à part (app.js?v=…, versionné à chaque construction),
// mis en cache dès l'installation ; la page attend le réseau 3 s au plus quand une copie est en cache (réseau faible).
// 27.11 (agent ordre) : le code est publié en segments dans l'ordre des sources (docs/sNN.js, build.py) ; build.py les
// ajoute tous à CORE (précache d'installation) : hors ligne complet, toute classe, et changement de classe hors ligne.
const CACHE = "5m2m-d719b401f2";
const CORE = ["./", "./index.html", "./start.js?v=d719b401f2",
  "./s00.js?v=d719b401f2", "./s01.js?v=d719b401f2", "./s02.js?v=d719b401f2", "./s03.js?v=d719b401f2", "./s04.js?v=d719b401f2", "./s05.js?v=d719b401f2", "./s06.js?v=d719b401f2", "./s07.js?v=d719b401f2", "./s08.js?v=d719b401f2", "./s09.js?v=d719b401f2", "./s10.js?v=d719b401f2", "./s11.js?v=d719b401f2", "./s12.js?v=d719b401f2", "./s13.js?v=d719b401f2", "./s14.js?v=d719b401f2", "./s15.js?v=d719b401f2", "./s16.js?v=d719b401f2", "./s17.js?v=d719b401f2", "./s18.js?v=d719b401f2", "./s19.js?v=d719b401f2", "./s20.js?v=d719b401f2", "./s21.js?v=d719b401f2", "./s22.js?v=d719b401f2", "./s23.js?v=d719b401f2", "./s24.js?v=d719b401f2", "./s25.js?v=d719b401f2", "./s26.js?v=d719b401f2", "./s27.js?v=d719b401f2", "./s28.js?v=d719b401f2", "./s29.js?v=d719b401f2", "./s30.js?v=d719b401f2", "./s31.js?v=d719b401f2", "./s32.js?v=d719b401f2", "./s33.js?v=d719b401f2", "./s34.js?v=d719b401f2", "./s35.js?v=d719b401f2", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  /* 24.11 : MathJax et polices hébergés avec l'app (docs/vendor/, plus de Cloudflare ni de Google Fonts) */
  "./vendor/mathjax/tex-svg.js", "./vendor/fonts/atkinson-400.woff2", "./vendor/fonts/atkinson-700.woff2",
  "./vendor/fonts/bricolage-var.woff2", "./vendor/fonts/jetbrainsmono-var.woff2"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.url.includes("script.google.com")) return;
  if (req.mode === "navigate") {
    const net = fetch(req).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); } return r; });
    e.waitUntil(net.catch(() => {}));
    e.respondWith(caches.match("./index.html").then((hit) => {
      if (!hit) return net;
      // Réseau lent : la copie en cache après 3 s (la page du réseau, si elle arrive, servira à l'ouverture suivante).
      return Promise.race([net, new Promise((ok) => setTimeout(() => ok(hit), 3000))]).catch(() => hit);
    }));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return r; })));
});
