// v5 — index.html 强制网络优先（network-only），解决 iOS 主屏幕缓存不更新
const CACHE_NAME = 'workbench-v5';

// 安装时立即接管，不预缓存 index.html（保证每次都从网络拿最新）
self.addEventListener('install', e => {
  self.skipWaiting();
});

// 激活时清空所有旧缓存
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// index.html / manifest.json 强制走网络，不缓存、不降级
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('index.html') || url.pathname.includes('manifest.json')) {
    e.respondWith(fetch(e.request));
  }
});
