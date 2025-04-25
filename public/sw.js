const CACHE_NAME = 'hardy-station-v1';

// Add files to cache for offline access
const urlsToCache = [
  '/portal',
  '/portal/login',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other static assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch new
        return response || fetch(event.request)
          .then(response => {
            // Cache new responses for offline access
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          });
      })
  );
});
