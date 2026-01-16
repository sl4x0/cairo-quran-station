"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X, Smartphone, Monitor, Share, Apple, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null

type DeviceType = "ios" | "android" | "windows" | "mac" | "linux" | "unknown"
type BrowserType = "chrome" | "safari" | "firefox" | "edge" | "samsung" | "opera" | "unknown"

function detectDevice(): { device: DeviceType; browser: BrowserType; isMobile: boolean } {
  if (typeof window === "undefined") {
    return { device: "unknown", browser: "unknown", isMobile: false }
  }

  const ua = navigator.userAgent.toLowerCase()

  // Detect device
  let device: DeviceType = "unknown"
  if (/iphone|ipad|ipod/.test(ua)) {
    device = "ios"
  } else if (/android/.test(ua)) {
    device = "android"
  } else if (/windows/.test(ua)) {
    device = "windows"
  } else if (/macintosh|mac os x/.test(ua)) {
    device = "mac"
  } else if (/linux/.test(ua)) {
    device = "linux"
  }

  // Detect browser
  let browser: BrowserType = "unknown"
  if (/edg/.test(ua)) {
    browser = "edge"
  } else if (/chrome/.test(ua) && !/edg/.test(ua)) {
    browser = "chrome"
  } else if (/safari/.test(ua) && !/chrome/.test(ua)) {
    browser = "safari"
  } else if (/firefox/.test(ua)) {
    browser = "firefox"
  } else if (/samsungbrowser/.test(ua)) {
    browser = "samsung"
  } else if (/opr|opera/.test(ua)) {
    browser = "opera"
  }

  const isMobile = /iphone|ipad|ipod|android|mobile/.test(ua)

  return { device, browser, isMobile }
}

function getInstallInstructions(
  device: DeviceType,
  browser: BrowserType,
  isMobile: boolean,
): {
  title: string
  steps: string[]
  icon: "apple" | "chrome" | "default"
} {
  // iOS Safari
  if (device === "ios") {
    return {
      title: "التثبيت على آيفون/آيباد",
      steps: [
        "اضغط على أيقونة المشاركة ⬆️ في الأسفل",
        'مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية"',
        'اضغط "إضافة" في الأعلى',
        "سيظهر التطبيق على شاشتك الرئيسية",
      ],
      icon: "apple",
    }
  }

  // Android Chrome
  if (device === "android" && browser === "chrome") {
    return {
      title: "التثبيت على أندرويد",
      steps: [
        "اضغط على النقاط الثلاث ⋮ في الأعلى",
        'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"',
        'اضغط "تثبيت" للتأكيد',
        "سيظهر التطبيق مع تطبيقاتك",
      ],
      icon: "chrome",
    }
  }

  // Android Samsung Browser
  if (device === "android" && browser === "samsung") {
    return {
      title: "التثبيت على سامسونج",
      steps: [
        "اضغط على الخطوط الثلاثة ☰ في الأسفل",
        'اختر "إضافة الصفحة إلى" ثم "الشاشة الرئيسية"',
        'اضغط "إضافة" للتأكيد',
      ],
      icon: "chrome",
    }
  }

  // Windows Chrome
  if (device === "windows" && browser === "chrome") {
    return {
      title: "التثبيت على ويندوز (Chrome)",
      steps: [
        "اضغط على أيقونة التثبيت ⊕ في شريط العنوان",
        'أو اضغط النقاط الثلاث ⋮ ثم "تثبيت محطة القرآن الكريم"',
        'اضغط "تثبيت" في النافذة المنبثقة',
        "سيظهر التطبيق في قائمة البداية وسطح المكتب",
      ],
      icon: "chrome",
    }
  }

  // Windows Edge
  if (device === "windows" && browser === "edge") {
    return {
      title: "التثبيت على ويندوز (Edge)",
      steps: [
        "اضغط على النقاط الثلاث ⋯ في الأعلى",
        'اختر "تطبيقات" ثم "تثبيت هذا الموقع كتطبيق"',
        'اضغط "تثبيت" للتأكيد',
        "سيظهر التطبيق في قائمة البداية",
      ],
      icon: "default",
    }
  }

  // Mac Chrome
  if (device === "mac" && browser === "chrome") {
    return {
      title: "التثبيت على ماك (Chrome)",
      steps: [
        "اضغط على أيقونة التثبيت ⊕ في شريط العنوان",
        'أو اضغط النقاط الثلاث ⋮ ثم "تثبيت محطة القرآن الكريم"',
        'اضغط "تثبيت" في النافذة المنبثقة',
        "سيظهر التطبيق في مجلد التطبيقات",
      ],
      icon: "chrome",
    }
  }

  // Mac Safari
  if (device === "mac" && browser === "safari") {
    return {
      title: "التثبيت على ماك (Safari)",
      steps: ["اضغط ملف (File) في القائمة العلوية", 'اختر "إضافة إلى Dock"', "سيظهر التطبيق في Dock الخاص بك"],
      icon: "apple",
    }
  }

  // Default/Firefox
  return {
    title: isMobile ? "التثبيت على جهازك" : "التثبيت على الكمبيوتر",
    steps: [
      "افتح الموقع في متصفح Chrome أو Edge للحصول على أفضل تجربة",
      "اضغط على قائمة المتصفح",
      'ابحث عن خيار "تثبيت" أو "إضافة للشاشة الرئيسية"',
      "اتبع التعليمات لإكمال التثبيت",
    ],
    icon: "default",
  }
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<{ device: DeviceType; browser: BrowserType; isMobile: boolean }>({
    device: "unknown",
    browser: "unknown",
    isMobile: false,
  })
  const [instructions, setInstructions] = useState<ReturnType<typeof getInstallInstructions> | null>(null)

  useEffect(() => {
    // Check if already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    setIsStandalone(standalone)

    // Detect device
    const info = detectDevice()
    setDeviceInfo(info)
    setInstructions(getInstallInstructions(info.device, info.browser, info.isMobile))

    // If we already have a global prompt, use it
    if (globalDeferredPrompt) {
      setDeferredPrompt(globalDeferredPrompt)
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      globalDeferredPrompt = promptEvent
      setDeferredPrompt(promptEvent)

      // Show prompt after 3 seconds if not dismissed before
      const dismissed = localStorage.getItem("pwa-prompt-dismissed")
      const lastDismissed = localStorage.getItem("pwa-prompt-dismissed-time")
      const daysPassed = lastDismissed ? (Date.now() - Number.parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999

      if (!dismissed || daysPassed > 7) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    // Listen for custom show event from hero section
    const handleShowPrompt = () => {
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("show-install-prompt", handleShowPrompt)

    // Show prompt for iOS/other after delay
    if (!standalone) {
      const dismissed = localStorage.getItem("pwa-prompt-dismissed")
      const lastDismissed = localStorage.getItem("pwa-prompt-dismissed-time")
      const daysPassed = lastDismissed ? (Date.now() - Number.parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999

      if (!dismissed || daysPassed > 7) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("show-install-prompt", handleShowPrompt)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    const promptToUse = deferredPrompt || globalDeferredPrompt

    if (promptToUse) {
      try {
        await promptToUse.prompt()
        const { outcome } = await promptToUse.userChoice
        if (outcome === "accepted") {
          setShowPrompt(false)
          localStorage.removeItem("pwa-prompt-dismissed")
          globalDeferredPrompt = null
          setDeferredPrompt(null)
        }
      } catch (error) {
        console.error("Install prompt error:", error)
      }
    }
    // If no native prompt available, just show the instructions (they're already visible)
  }, [deferredPrompt])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
    localStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString())
  }

  if (isStandalone || !showPrompt) return null

  const canInstall = deferredPrompt || globalDeferredPrompt
  const isIOS = deviceInfo.device === "ios"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-emerald-600 to-emerald-700 p-4 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {instructions?.icon === "apple" ? (
                <Apple className="w-6 h-6 text-white" />
              ) : instructions?.icon === "chrome" ? (
                <Chrome className="w-6 h-6 text-white" />
              ) : (
                <Download className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg mb-1">ثبّت التطبيق</h3>
              <p className="text-sm text-emerald-100 leading-relaxed">{instructions?.title}</p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Device Icons */}
            <div className="flex items-center justify-center gap-6 py-2">
              <div
                className={`flex flex-col items-center gap-1 ${deviceInfo.isMobile && deviceInfo.device !== "ios" ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-xs">أندرويد</span>
              </div>
              <div
                className={`flex flex-col items-center gap-1 ${deviceInfo.device === "ios" ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                <Apple className="w-6 h-6" />
                <span className="text-xs">آيفون</span>
              </div>
              <div
                className={`flex flex-col items-center gap-1 ${!deviceInfo.isMobile ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                <Monitor className="w-6 h-6" />
                <span className="text-xs">كمبيوتر</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-foreground font-semibold">
                <Share className="w-4 h-4" />
                <span>خطوات التثبيت:</span>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {instructions?.steps.map((step, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {canInstall && !isIOS && (
                <Button onClick={handleInstall} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <Download className="w-4 h-4 ml-2" />
                  تثبيت الآن
                </Button>
              )}
              <Button variant="outline" onClick={handleDismiss} className={canInstall && !isIOS ? "" : "flex-1"}>
                {isIOS || !canInstall ? "فهمت" : "لاحقاً"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
