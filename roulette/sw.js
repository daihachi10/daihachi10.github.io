const CACHE_NAME = "roulette-audio-v1";
const audioUrlsToCache = [
  "./sounds/card_flip.mp3",
  "./sounds/roulette_result.mp3",
  "./sounds/roulette_tick.mp3",
  "./sounds/simple_result.mp3",
  "./sounds/simple_tick.mp3",
  "./sounds/spin.wav",
];

// 追加するフォント（絶対URL）
const fontUrlsToCache = [
  "https://daihachi10.github.io/css/fonts/Montserrat.woff2",
  "https://daihachi10.github.io/css/fonts/Montserrat-Bold.woff2",
  "https://daihachi10.github.io/css/fonts/NotoSansJP.woff2",
  "https://daihachi10.github.io/css/fonts/NotoSansJP-Bold.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const urlsToCache = audioUrlsToCache.concat(fontUrlsToCache);
      return cache.addAll(urlsToCache).then(() => {
        console.log("Audio & font files cached:", urlsToCache);
      }).catch((err) => {
        console.warn("Failed to cache some resources during install:", err);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  // 非HTTP/HTTPS リクエストは無視
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      // キャッシュにない場合はネットワークへ
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch((err) => {
        console.warn(
          "Network fetch failed (likely blocked or offline):",
          event.request.url,
          err
        );
        // フェール時は 503 を返して呼び出し側が扱えるようにする
        return new Response(null, { status: 503, statusText: "Service Unavailable" });
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
