const CACHE_NAME = 'dosage-calculator-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/service-worker.js',
    '/styles.css', // 必要に応じて他のCSSファイルを追加
    '/script.js',  // 必要に応じて他のJavaScriptファイルを追加
    '/images/icon-192x192.png',
    '/images/icon-512x512.png',
    // さらに他の必要なファイルを追加
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // キャッシュがヒットした場合
                }
                return fetch(event.request); // キャッシュがヒットしなかった場合
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
