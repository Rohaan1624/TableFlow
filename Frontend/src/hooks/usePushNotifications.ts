// src/hooks/usePushNotifications.ts
// Manages PWA push notification subscription lifecycle

const SW_PATH = "/sw.js"

// Your VAPID public key — generate with:
//   npx web-push generate-vapid-keys
// Then set VITE_VAPID_PUBLIC_KEY in your .env
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw     = atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.register(SW_PATH)
    return reg
  } catch (err) {
    console.error("SW registration failed:", err)
    return null
  }
}

export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied"
  if (Notification.permission === "granted") return "granted"
  return await Notification.requestPermission()
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null

  const reg = await navigator.serviceWorker.ready
  const permission = await requestPushPermission()
  if (permission !== "granted") return null

  try {
    const existing = await reg.pushManager.getSubscription()
    if (existing) return existing

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
    return subscription
  } catch (err) {
    console.error("Push subscription failed:", err)
    return null
  }
}

// Send a local notification directly (no server needed — for Supabase Realtime triggers)
export function sendLocalNotification(title: string, body: string, tag: string) {
  if (!("serviceWorker" in navigator)) return
  navigator.serviceWorker.ready.then((reg) => {
    reg.showNotification(title, {
      body,
      tag,
      icon:    "/icon-192.png",
      badge:   "/icon-192.png",
      data:    { url: "/kitchen" },
    })
  })
}