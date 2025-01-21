this.addEventListener('install', e => {
      e.waitUntil(
          caches.open("static").then(cahce => {
              return cahce.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/192x192.png',
                '/512x512.png',
                '/sw.js',
                // Dynamically add each hashed JS file to the cache list
                '/99a5361b.js',
'/f88a5001.js',
'/58fcdf02.js'
                ])
            })
        )
    });
    
    self.addEventListener("fetch", e => {
        e.respondWith(
            cahces.match(e.request).then(response => {
                return response || fetch(e.request);
            })
        )
    });