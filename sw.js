// v3 — 强制网络优先，避免旧缓存阻塞
const CACHE_NAME = 'workbench-v3.1';
const ASSETS = [
  '/personal-workbench/index.html',
  '/personal-workbench/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Network-first strategy
self.addEventListener('fetch', e => {
  if (e.request.url.includes('index.html') || e.request.url.includes('manifest.json')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
