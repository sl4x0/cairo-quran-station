"use client"

import { motion } from "framer-motion"
import { Play, Download, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const MAIN_DOMAIN = "https://quran-station.tech"

export function CTASection() {
  const [shared, setShared] = useState(false)

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

  const handleInstall = () => {
    const installEvent = new CustomEvent("show-install-prompt")
    window.dispatchEvent(installEvent)
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary text-balance px-4">
            ابدأ يومك بتلاوة تملأ قلبك سكينة
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground px-4">
            انضم إلى آلاف المستمعين حول العالم واستمتع ببث مباشر للقرآن الكريم من قلب القاهرة
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a href="#player">
                <Play className="ml-2 h-5 w-5" />
                شغّل البث الآن
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleInstall}
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/5 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all bg-transparent"
            >
              <Download className="ml-2 h-5 w-5" />
              ثبّت التطبيق
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full"
            >
              {shared ? (
                <>
                  <Check className="ml-2 h-5 w-5 text-green-600" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Share2 className="ml-2 h-5 w-5" />
                  شارك التطبيق
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
