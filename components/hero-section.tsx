"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Play, Download, ChevronDown, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

const MAIN_DOMAIN = "https://quran-station.tech"

export function HeroSection() {
  const { colors } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = colors.isDarkPeriod

  const handleInstall = () => {
    const installEvent = new CustomEvent("show-install-prompt")
    window.dispatchEvent(installEvent)
  }

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : MAIN_DOMAIN
    const shareText = "استمع إلى القرآن الكريم ببث مباشر على مدار الساعة من القاهرة"

    if (navigator.share) {
      try {
        await navigator.share({
          title: "محطة القرآن الكريم - القاهرة",
          text: shareText,
          url: shareUrl,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center bg-gradient-to-b ${colors.gradient} transition-all duration-1000 pt-16`}
    >
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23${isDark ? "ffffff" : "000000"}' fillOpacity='0.4'%3E%3Cpath d='M40 0l40 40-40 40L0 40 40 0zm0 10L10 40l30 30 30-30-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Decorative Element */}
          <motion.div
            initial={mounted ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${isDark ? "bg-white/10" : "bg-emerald-600/10"} flex items-center justify-center backdrop-blur-sm`}
            >
              <span className="text-3xl sm:text-4xl">☪</span>
            </div>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            <motion.h1
              className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold ${colors.textPrimary} text-balance px-4`}
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              محطة القرآن الكريم
            </motion.h1>

            <motion.p
              className={`text-lg sm:text-xl md:text-2xl ${colors.textSecondary} font-light`}
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              بث مباشر من القاهرة على مدار الساعة
            </motion.p>

            <motion.p
              className={`text-base sm:text-lg ${colors.textSecondary} opacity-80 max-w-xl mx-auto px-4`}
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              استمع إلى تلاوات عطرة تملأ قلبك سكينة وطمأنينة
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a href="#player">
                <Play className="ml-2 h-5 w-5" />
                استمع الآن
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleInstall}
              className={`w-full sm:w-auto border-2 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all ${
                isDark
                  ? "border-white/30 text-white hover:bg-white/10 bg-transparent"
                  : "border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              }`}
            >
              <Download className="ml-2 h-5 w-5" />
              ثبّت التطبيق
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={handleShare}
              className={`w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all ${
                isDark ? "text-white hover:bg-white/10" : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {shared ? (
                <>
                  <Check className="ml-2 h-5 w-5 text-green-500" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Share2 className="ml-2 h-5 w-5" />
                  شارك
                </>
              )}
            </Button>
          </motion.div>

          {/* Live Indicator */}
          <motion.div
            initial={mounted ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? "bg-white/10" : "bg-emerald-100"}`}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className={`text-sm font-medium ${isDark ? "text-white" : "text-emerald-700"}`}>
                البث المباشر متاح الآن
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2">
        <motion.a
          href="#player"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className={`flex flex-col items-center gap-2 ${isDark ? "text-white/60" : "text-emerald-600/60"}`}
        >
          <span className="text-xs sm:text-sm">اكتشف المزيد</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.a>
      </div>
    </section>
  )
}
