const CACHE = 'sconti-subito-v1';
const FILES = [
  '/sconto/',
  '/sconto/index.html',
  '/sconto/manifest.json',
  '/sconto/icon-192.png',
  '/sconto/icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        return caches.open(CACHE).then(cache => {
          cache.put(e.request, resp.clone());
          return resp;
        });
      }).catch(() => caches.match('/sconto/index.html'));
    })
  );
});
