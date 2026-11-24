// Cache hors ligne : la page d'abord depuis le réseau (pour recevoir les mises à jour), sinon depuis le cache ;
// le reste (code de l'app, MathJax, polices, icônes) depuis le cache, complété au fil de l'eau.
// 23.11 (chantier F, chargement) : le code de l'app est un fichier à part (app.js?v=…, versionné à chaque construction),
// mis en cache dès l'installation ; la page attend le réseau 3 s au plus quand une copie est en cache (réseau faible).
const CACHE = "5m2m-a23bb9018c";
const CORE = ["./", "./index.html", "./app.js?v=a23bb9018c", "./start.js?v=a23bb9018c", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
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
