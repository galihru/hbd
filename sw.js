const cacheName = 'offline-cache-v1';
    const filesToCache = [
      '/',
      '/index.html',
      '/manifest.json',
      '/sw.js',
      // Dynamically add each hashed JS file to the cache list
      '/99a5361b.js',
'/f88a5001.js',
'/58fcdf02.js'
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(cacheName).then((cache) => {
          return cache.addAll(filesToCache);
        })
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(
            keyList.map((key) => {
              if (key !== cacheName) {
                return caches.delete(key);
              }
            })
          );
        })
      );
    });