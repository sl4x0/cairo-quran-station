const CACHE_NAME = "quran-station-v4"
const urlsToCache = ["/", "/index.html", "/manifest.json", "/qibla/", "/tasbih/", "/events/"]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log("Cache addAll error:", err)
        return Promise.resolve()
      })
    }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - Network first, then cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  if (!event.request.url.startsWith("http")) return
  if (event.request.url.includes("radiojar") || event.request.url.includes("stream")) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }
          return new Response("Offline", { status: 503 })
        })
      }),
  )
})
