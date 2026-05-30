// public/sw.js — TableFlow Kitchen Service Worker

self.addEventListener("install", (e) => {
  self.skipWaiting()
})

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim())
})

// Handle push notifications from server (VAPID)
self.addEventListener("push", (e) => {
  if (!e.data) return
  const { title, body, tag } = e.data.json()
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon:  "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [200, 100, 200],
      data: { url: "/kitchen" },
    })
  )
})

// On notification click, focus/open the kitchen view
self.addEventListener("notificationclick", (e) => {
  e.notification.close()
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const kitchenClient = list.find((c) => c.url.includes("/kitchen"))
      if (kitchenClient) return kitchenClient.focus()
      return clients.openWindow("/kitchen")
    })
  )
})

// Handle background sync (optional, for offline resilience)
self.addEventListener("sync", (e) => {
  // Future: sync offline status updates
})