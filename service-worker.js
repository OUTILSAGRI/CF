const CACHE_NAME = 'cf-pwa-v1';
const urlsToCache = [
  './',
  './index.html', // Mets ici le vrai nom de ton fichier HTML !
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
  // Ajoute d'autres fichiers si tu en as (ex: .css, .js, images)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
