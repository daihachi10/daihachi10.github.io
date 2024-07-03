// service-worker.js
const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = 'https://daihachi10.github.io/beta/offline/offline.html';
const OFFLINE_CSS = 'https://daihachi10.github.io/beta/offline/offline.css';
const ASSETS = [
  '/',
  OFFLINE_URL,
    'https://daihachi10.github.io/assets/style.css',
  OFFLINE_CSS,
];

// インストールイベント
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// フェッチイベント
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});
