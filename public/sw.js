// Offline support: network first, falling back to the last good copy.
// Cori's audio clips are the exception: once saved for offline use (Settings), they are
// played from their own cache, which also answers the partial (Range) requests iPhones make.
const CACHE = "int-trainer-v1";
const AUDIO = "int-audio-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

async function fromAudioCache(req) {
  const hit = await (await caches.open(AUDIO)).match(req.url);
  if (!hit) return null;
  const range = req.headers.get("range");
  if (!range) return hit;
  const buf = await hit.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const start = m[1] ? +m[1] : 0;
  const end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: { "content-type": "audio/mpeg", "content-range": `bytes ${start}-${end}/${buf.byteLength}`, "content-length": String(end - start + 1), "accept-ranges": "bytes" },
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  const path = new URL(req.url).pathname;
  if (req.method !== "GET" || path.startsWith("/api/")) return;
  if (path.startsWith("/audio/") && path.endsWith(".mp3")) {
    e.respondWith((async () => (await fromAudioCache(req)) || fetch(req))());
    return;
  }
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      // Only whole files are cached, and never login redirects.
      if (res.status === 200 && !res.redirected) (await caches.open(CACHE)).put(req, res.clone()).catch(() => {});
      return res;
    } catch {
      const hit = await caches.match(req, { ignoreSearch: true });
      return hit || caches.match("/index.html") || Response.error();
    }
  })());
});
