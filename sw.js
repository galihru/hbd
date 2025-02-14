// Service Worker for offline functionality
  const CACHE_NAME = 'site-static-v1';
  const ASSETS = [
      '/',
      '/index.html',
      '/manifest.webmanifest',
      '/192x192.png',
      '/512x512.png',
      '/sw.js',
      // Dynamically add each hashed JS file to the cache list
      '/533210da.js',
'/e85802e3.js',
'/58fcdf02.js'
  ];

  // Install event
  self.addEventListener('install', evt => {
    evt.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Caching shell assets');
          return cache.addAll(ASSETS);
        })
        .catch(err => {
          console.error('Error caching assets:', err);
        })
    );
  });
  
  // Activate event
  self.addEventListener('activate', evt => {
    evt.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
        );
      })
    );
  });
  
  // Fetch event
  self.addEventListener('fetch', evt => {
    evt.respondWith(
      caches.match(evt.request)
        .then(cacheRes => {
          return cacheRes || fetch(evt.request)
            .then(fetchRes => {
              return caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(evt.request.url, fetchRes.clone());
                  return fetchRes;
                });
            });
        })
        .catch(() => {
          // Handle fetch errors or offline state
          if (evt.request.url.indexOf('.html') > -1) {
            return caches.match('/index.html');
          }
        })
    );
  });