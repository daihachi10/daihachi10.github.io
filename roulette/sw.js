const CACHE_NAME = "roulette-pwa-v2"; // 更新を認識させるためバージョン名を変更

// 常に最新を確認したいファイル（ネットワーク優先）
const appShellFiles = [
  "./",             // ルートパス
  "./index.html",
  "./script.js"
];

// あまり変更されない静的ファイル（キャッシュ優先）
const audioUrlsToCache = [
  "./sounds/card_flip.mp3",
  "./sounds/roulette_result.mp3",
  "./sounds/roulette_tick.mp3",
  "./sounds/simple_result.mp3",
  "./sounds/simple_tick.mp3",
  "./sounds/spin.wav",
];

const fontUrlsToCache = [
  "https://daihachi10.github.io/css/fonts/Montserrat.woff2",
  "https://daihachi10.github.io/css/fonts/Montserrat-Bold.woff2",
  "https://daihachi10.github.io/css/fonts/NotoSansJP.woff2",
  "https://daihachi10.github.io/css/fonts/NotoSansJP-Bold.woff2",
];

// インストール処理
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // オフラインでも動くように、すべてのリソースを一旦キャッシュに入れる
      const allUrls = appShellFiles.concat(audioUrlsToCache, fontUrlsToCache);
      console.log("Caching all files for offline use");
      return cache.addAll(allUrls);
    })
  );
  // 新しいSWをすぐに有効化
  self.skipWaiting();
});

// リクエスト処理
self.addEventListener("fetch", (event) => {
  // 非HTTPスキームは無視
  if (!event.request.url.startsWith("http")) return;

  const url = new URL(event.request.url);

  // 1. index.html や script.js の場合 -> 【ネットワーク優先】
  // (ネットから取得してキャッシュを更新。失敗したらキャッシュを使う)
  if (
    url.pathname.endsWith("index.html") || 
    url.pathname.endsWith("script.js") || 
    url.pathname.endsWith("/")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // ネットワーク取得成功：キャッシュを更新して、レスポンスを返す
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // ネットワーク取得失敗（オフライン）：キャッシュから返す
          console.log("Offline: returning cached version for", event.request.url);
          return caches.match(event.request);
        })
    );
    return;
  }

  // 2. それ以外のファイル（画像、音声、フォントなど） -> 【キャッシュ優先】
  // (キャッシュにあればそれを返す。なければネットへ)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(err => {
        // 画像などの取得失敗時は何もしないか、必要ならプレースホルダーを返す
        console.warn("Fetch failed for static asset:", err);
      });
    })
  );
});

// 古いキャッシュの削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});