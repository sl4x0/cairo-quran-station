"use client"

import { useEffect } from "react"

export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swPath = "/sw.js"

      navigator.serviceWorker
        .register(swPath, { scope: "/" })
        .then((registration) => {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("محتوى جديد متاح، قم بتحديث الصفحة")
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log("فشل تسجيل Service Worker:", error)
        })
    }
  }, [])

  return null
}
