const CACHE_NAME = 'chronicles-engine-v1.1';

// These are the exact files your phone needs to run the app without internet
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// 1. INSTALLATION: When the app first loads, download all the core files into the phone's hidden cache.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. INTERCEPTION: Every time the app tries to load a file, check for internet first.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // If we have internet, return the fresh page.
        return response;
      })
      .catch(function() {
        // IF OFFLINE (Network fails): Catch the error and serve the cached file instead!
        return caches.match(event.request);
      })
  );
});