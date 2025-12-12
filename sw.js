const CACHE_NAME = "cinefilos-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Instala o Service Worker e cacheia os arquivos principais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Arquivos em cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercepta as requisições para funcionar offline (cache first)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se tiver no cache, retorna do cache (offline)
      if (response) {
        return response;
      }
      // Se não, busca na internet
      return fetch(event.request);
    })
  );
});

// Atualiza o cache quando há uma nova versão
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
