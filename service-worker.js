self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('static-v1').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './styles.css',
                './calculate.js',
                './SFM2.js',
                './SFM3.js',
                './SFM4.js',
                './SFM6.js',
                './SFM7.js',
                './SFM8.js',
                './SFM9.js',
                './SFM10.js',
                './assets/icons/icon-192x192.png',
                './assets/icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
