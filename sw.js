// Service Worker for Wedding Invitation PWA
const CACHE_NAME = 'wedding-v1';
const urlsToCache = [
  '/Wedding-Invitation/',
  '/Wedding-Invitation/index.html',
  '/Wedding-Invitation/modern-theme.css',
  '/Wedding-Invitation/retro-theme.css',
  '/Wedding-Invitation/js/config.js',
  '/Wedding-Invitation/js/minigame.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});