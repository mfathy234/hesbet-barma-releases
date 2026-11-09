/* Service worker. tools/build-web.mjs stamps BUILD and FILES (every file as name?v=BUILD); serving game/ directly runs in dev mode (no precache, network only).
   index.html, navigations and version.json are network-first; ?v= URLs are cache-first; the cache is named after the build and old ones are deleted on activate. */
/*build:start*/
const BUILD = 'f3f8353f3d74';
const FILES = ["./","art/cart.js?v=f3f8353f3d74","art/core.js?v=f3f8353f3d74","art/hats.js?v=f3f8353f3d74","art/hedgehog.js?v=f3f8353f3d74","art/owl.js?v=f3f8353f3d74","art/sprites.js?v=f3f8353f3d74","art/ui.js?v=f3f8353f3d74","fonts/cairo-arabic-400-normal.woff2?v=f3f8353f3d74","fonts/cairo-arabic-700-normal.woff2?v=f3f8353f3d74","fonts/cairo-latin-400-normal.woff2?v=f3f8353f3d74","fonts/cairo-latin-700-normal.woff2?v=f3f8353f3d74","fonts/lalezar-arabic-400-normal.woff2?v=f3f8353f3d74","fonts/lalezar-latin-400-normal.woff2?v=f3f8353f3d74","icons/apple-touch-icon.png?v=f3f8353f3d74","icons/favicon-48.png?v=f3f8353f3d74","icons/icon-192.png?v=f3f8353f3d74","icons/icon-512.png?v=f3f8353f3d74","icons/icon-maskable-512.png?v=f3f8353f3d74","manifest.webmanifest?v=f3f8353f3d74","og.png?v=f3f8353f3d74","src/audio.js?v=f3f8353f3d74","src/blockdraw.js?v=f3f8353f3d74","src/board.js?v=f3f8353f3d74","src/daily.js?v=f3f8353f3d74","src/dailyui.js?v=f3f8353f3d74","src/data.js?v=f3f8353f3d74","src/engine.js?v=f3f8353f3d74","src/hud.js?v=f3f8353f3d74","src/input.js?v=f3f8353f3d74","src/main.js?v=f3f8353f3d74","src/math.js?v=f3f8353f3d74","src/meta.js?v=f3f8353f3d74","src/play.js?v=f3f8353f3d74","src/prefs.js?v=f3f8353f3d74","src/render.js?v=f3f8353f3d74","src/save.js?v=f3f8353f3d74","src/settingsui.js?v=f3f8353f3d74","src/shop.js?v=f3f8353f3d74","src/shopui.js?v=f3f8353f3d74","src/strings.js?v=f3f8353f3d74","src/ui.js?v=f3f8353f3d74","src/update.js?v=f3f8353f3d74","style.css?v=f3f8353f3d74"];
/*build:end*/
const CACHE = 'hesba-' + BUILD;
const DEV = BUILD === 'dev';

self.addEventListener('install', e => {
  if (DEV) { self.skipWaiting(); return; }
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const put = (req, res) => { if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => null); } };

const networkFirst = (req, key) => fetch(req, { cache: 'no-store' }).then(res => { put(key || req, res); return res; })
  .catch(() => caches.match(key || req, { ignoreSearch: !key }).then(hit => hit || Response.error()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || DEV) return;
  const file = url.pathname.split('/').pop();
  if (req.mode === 'navigate' || file === '' || file === 'index.html') {
    e.respondWith(networkFirst(new Request(req.url, { cache: 'no-store' }), new Request(new URL('./', location.href).href)));
    return;
  }
  if (file === 'version.json' || file === 'sw.js') return;
  if (url.searchParams.get('v') === BUILD) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { put(req, res); return res; })));
    return;
  }
  e.respondWith(networkFirst(req));
});
