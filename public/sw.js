const CACHE_NAME = "cairo-quran-station-v1";
const STATIC_ASSETS = ["/", "/manifest.json", "/icon-radio.svg"];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip stream URLs (always fetch fresh)
  if (request.url.includes("radiojar.com")) {
    return;
  }

  // Helper: try upgrading http:// -> https:// for non-localhost requests
  async function fetchWithUpgrade(req) {
    // Only attempt for insecure external requests
    try {
      if (req.url.startsWith("http://") && !req.url.includes("localhost")) {
        const upgraded = req.url.replace(/^http:\/\//, "https://");
        try {
          const upgradedResponse = await fetch(new Request(upgraded, req));
          if (upgradedResponse && upgradedResponse.ok) return upgradedResponse;
        } catch (e) {
          // ignore and fall back to original
        }
      }
      return await fetch(req);
    } catch (err) {
      // Final fallback - rethrow to be handled by callers
      throw err;
    }
  }

  // Network-first strategy for API calls
  if (
    request.url.includes("/api/") ||
    request.url.includes("aladhan.com") ||
    request.url.includes("alquran.cloud")
  ) {
    event.respondWith(
      fetchWithUpgrade(request)
        .then((response) => {
          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetchWithUpgrade(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type === "error"
          ) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        });
    })
  );
});
