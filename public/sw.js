// Offline support: network first, falling back to the last good copy.
const CACHE = "int-trainer-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).pathname.startsWith("/api/")) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      // never cache login redirects
      if (res.ok && !res.redirected) (await caches.open(CACHE)).put(req, res.clone());
      return res;
    } catch {
      const hit = await caches.match(req, { ignoreSearch: true });
      return hit || caches.match("/index.html") || Response.error();
    }
  })());
});
