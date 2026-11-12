// ProTen Farm Visit – lets the app open with no signal.
// When you upload a new index.html, also change the number below (v1 -> v2) so phones pick it up.
const CACHE = "proten-farm-visit-v4";
const FILES = ["./", "./index.html", "./pdf-lib.min.js", "./manifest.webmanifest",
               "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
function timeout(ms) { return new Promise((_, no) => setTimeout(() => no(new Error("slow")), ms)); }

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;                       // TickOff sends are POSTs: never touched
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;             // other websites: leave alone
  const isPage = req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
  if (isPage) {
    // Newest version when there's signal (wait up to 4 s), saved copy when there isn't.
    e.respondWith(
      Promise.race([fetch(req), timeout(4000)])
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); return res; })
        .catch(() => caches.match("./index.html").then(m => m || fetch(req)))
    );
    return;
  }
  e.respondWith(caches.match(req).then(m => m || fetch(req).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
  })));
});
