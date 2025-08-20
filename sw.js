// Service Worker for Wedding Invitation PWA
const CACHE_NAME = 'wedding-v2'; // 버전 업데이트로 캐시 초기화
const urlsToCache = [
  '/Wedding-Invitation/',
  '/Wedding-Invitation/index.html',
  '/Wedding-Invitation/modern-theme.css',
  '/Wedding-Invitation/retro-theme.css',
  '/Wedding-Invitation/responsive-override.css',
  '/Wedding-Invitation/js/config.js',
  '/Wedding-Invitation/js/minigame.js',
  '/Wedding-Invitation/js/guestbook.js',
  '/Wedding-Invitation/js/fit-text.js',
  '/Wedding-Invitation/manifest.json',
  '/Wedding-Invitation/assets/main.jpg',
  '/Wedding-Invitation/assets/main_retro.jpg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // 즉시 활성화
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // 이전 버전 캐시 삭제
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim(); // 즉시 제어권 획득
});

self.addEventListener('fetch', function(event) {
  // Vite 빌드 파일 요청은 무시
  if (event.request.url.includes('manifest-') || 
      event.request.url.includes('main-') ||
      event.request.url.includes('assets/manifest')) {
    return;
  }
  
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