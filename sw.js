const CACHE_NAME = "be-ngoan-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./index.css",
  "./app.js",
  "./manifest.json",
  "./icon.svg",
  "./icon.png",
  "./icon-192.png",
  "./icon-512.png"
];

// Sự kiện install: Lưu các tài nguyên vào cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell");
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Sự kiện activate: Dọn dẹp cache cũ
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Sự kiện fetch: Lấy từ cache trước (chạy offline), cập nhật ngầm nếu có mạng
self.addEventListener("fetch", (e) => {
  // Chỉ xử lý các yêu cầu GET trong cùng domain
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, cacheCopy);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.log("[Service Worker] Fetch failed, network is down. Serving cached asset.");
      });

      return cachedResponse || fetchPromise;
    })
  );
});
