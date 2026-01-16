"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { BookOpen, RefreshCw, Share2, Copy, Check, BookMarked, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchRandomVerse, type QuranVerse } from "@/lib/api"

export function VerseOfDaySection() {
  const [verse, setVerse] = useState<QuranVerse | null>(null)
  const [tafseer, setTafseer] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTafseer, setShowTafseer] = useState(true)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const loadVerse = async () => {
    setIsLoading(true)
    const data = await fetchRandomVerse()
    if (data) {
      setVerse(data.verse)
      setTafseer(data.tafseer)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadVerse()
  }, [])

  const copyVerse = async () => {
    if (!verse) return
    const text = `${verse.text}\n\n[${verse.surah.name}: ${verse.numberInSurah}]${showTafseer && tafseer ? `\n\nالتفسير الميسر:\n${tafseer}` : ""}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateVerseImage = async (): Promise<string | null> => {
    if (!verse) return null

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // Set canvas size for social media (1200x630 for optimal sharing)
    const width = 1200
    const height = showTafseer && tafseer ? 900 : 630
    canvas.width = width
    canvas.height = height

    // Get current hour for theme colors
    const hour = new Date().getHours()
    let gradientStart: string
    let gradientEnd: string
    let accentColor: string

    if (hour >= 4 && hour < 6) {
      // Fajr
      gradientStart = "#1e3a5f"
      gradientEnd = "#0f1f33"
      accentColor = "#7dd3fc"
    } else if (hour >= 6 && hour < 12) {
      // Morning
      gradientStart = "#065f46"
      gradientEnd = "#022c22"
      accentColor = "#fbbf24"
    } else if (hour >= 12 && hour < 15) {
      // Dhuhr
      gradientStart = "#0f766e"
      gradientEnd = "#134e4a"
      accentColor = "#fcd34d"
    } else if (hour >= 15 && hour < 18) {
      // Asr
      gradientStart = "#7c2d12"
      gradientEnd = "#431407"
      accentColor = "#fbbf24"
    } else if (hour >= 18 && hour < 20) {
      // Maghrib
      gradientStart = "#7c3aed"
      gradientEnd = "#4c1d95"
      accentColor = "#fcd34d"
    } else {
      // Isha
      gradientStart = "#1e1b4b"
      gradientEnd = "#0f0a1e"
      accentColor = "#a5b4fc"
    }

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, gradientStart)
    gradient.addColorStop(1, gradientEnd)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add decorative pattern
    ctx.strokeStyle = accentColor
    ctx.globalAlpha = 0.1
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Add decorative top border
    ctx.fillStyle = accentColor
    ctx.fillRect(0, 0, width, 8)

    // Add decorative bottom border
    ctx.fillRect(0, height - 8, width, 8)

    // Draw Bismillah decoration at top
    ctx.fillStyle = accentColor
    ctx.globalAlpha = 0.3
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("﷽", width / 2, 50)
    ctx.globalAlpha = 1

    // Draw verse text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 42px 'Amiri', 'Traditional Arabic', serif"
    ctx.textAlign = "center"
    ctx.direction = "rtl"

    // Word wrap the verse text
    const maxWidth = width - 120
    const lineHeight = 70
    const words = verse.text.split(" ")
    let line = ""
    let y = showTafseer && tafseer ? 150 : 200
    const lines: string[] = []

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line.trim())
        line = words[i] + " "
      } else {
        line = testLine
      }
    }
    lines.push(line.trim())

    // Draw verse lines
    for (const textLine of lines) {
      ctx.fillText(textLine, width / 2, y)
      y += lineHeight
    }

    // Draw divider
    y += 20
    ctx.fillStyle = accentColor
    ctx.fillRect(width / 2 - 100, y, 200, 3)
    y += 30

    // Draw surah reference
    ctx.fillStyle = accentColor
    ctx.font = "bold 28px 'Amiri', 'Traditional Arabic', serif"
    ctx.fillText(`سورة ${verse.surah.name} - الآية ${verse.numberInSurah}`, width / 2, y)

    // Draw tafseer if shown
    if (showTafseer && tafseer) {
      y += 50

      // Tafseer background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.roundRect(60, y - 10, width - 120, 250, 16)
      ctx.fill()

      // Tafseer title
      ctx.fillStyle = accentColor
      ctx.font = "bold 24px 'Amiri', 'Traditional Arabic', serif"
      y += 30
      ctx.fillText("التفسير الميسر", width / 2, y)

      // Tafseer text
      ctx.fillStyle = "#e0e0e0"
      ctx.font = "22px 'Amiri', 'Traditional Arabic', serif"
      y += 40

      const tafseerWords = tafseer.split(" ")
      let tafseerLine = ""
      const tafseerMaxWidth = width - 160

      for (let i = 0; i < tafseerWords.length; i++) {
        const testLine = tafseerLine + tafseerWords[i] + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > tafseerMaxWidth && i > 0) {
          ctx.fillText(tafseerLine.trim(), width / 2, y)
          tafseerLine = tafseerWords[i] + " "
          y += 35
          if (y > height - 120) break // Stop if running out of space
        } else {
          tafseerLine = testLine
        }
      }
      if (y <= height - 120) {
        ctx.fillText(tafseerLine.trim(), width / 2, y)
      }
    }

    // Draw website watermark
    ctx.fillStyle = accentColor
    ctx.globalAlpha = 0.7
    ctx.font = "18px Arial"
    ctx.fillText("quran-station.tech", width / 2, height - 30)
    ctx.globalAlpha = 1

    return canvas.toDataURL("image/png")
  }

  const downloadVerseImage = async () => {
    setIsGeneratingImage(true)
    try {
      const imageData = await generateVerseImage()
      if (imageData) {
        const link = document.createElement("a")
        link.download = `ayah-${verse?.surah.name}-${verse?.numberInSurah}.png`
        link.href = imageData
        link.click()
      }
    } catch (error) {
      console.error("Error generating image:", error)
    }
    setIsGeneratingImage(false)
  }

  const shareVerseImage = async () => {
    if (!verse) return
    setIsGeneratingImage(true)

    try {
      const imageData = await generateVerseImage()

      if (imageData && navigator.share) {
        // Convert data URL to blob
        const response = await fetch(imageData)
        const blob = await response.blob()
        const file = new File([blob], `ayah-${verse.surah.name}-${verse.numberInSurah}.png`, { type: "image/png" })

        try {
          await navigator.share({
            title: `آية من سورة ${verse.surah.name}`,
            text: `${verse.text}\n\n[${verse.surah.name}: ${verse.numberInSurah}]`,
            files: [file],
          })
        } catch {
          // If sharing files fails, try sharing without file
          try {
            await navigator.share({
              title: `آية من سورة ${verse.surah.name}`,
              text: `${verse.text}\n\n[${verse.surah.name}: ${verse.numberInSurah}]\n\nhttps://quran-station.tech`,
            })
          } catch {
            // Fallback to download
            downloadVerseImage()
          }
        }
      } else {
        // Fallback: download the image
        await downloadVerseImage()
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Final fallback: copy text
      await copyVerse()
    }

    setIsGeneratingImage(false)
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-primary/5 to-amber-50/50 dark:to-amber-950/20" id="verse">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4 sm:mb-6">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">آية اليوم</h2>
          <p className="text-base sm:text-lg text-muted-foreground">تأمل وتدبر في كلام الله</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="h-2 sm:h-3 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600" />

            <CardContent className="p-6 sm:p-8 md:p-12 bg-gradient-to-br from-card to-primary/5">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : verse ? (
                <>
                  {/* Arabic Text */}
                  <motion.div
                    key={verse.number}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6 sm:mb-8"
                  >
                    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-loose text-foreground mb-6">
                      {verse.text}
                    </p>
                    <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                  </motion.div>

                  {/* Surah Reference */}
                  <div className="text-center mb-6 sm:mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      <BookOpen className="w-4 h-4" />
                      {verse.surah.name} - الآية {verse.numberInSurah}
                    </span>
                  </div>

                  {tafseer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-6 sm:mb-8"
                    >
                      <div
                        className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 sm:p-6 border border-amber-200 dark:border-amber-800 cursor-pointer transition-all hover:shadow-md"
                        onClick={() => setShowTafseer(!showTafseer)}
                      >
                        <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
                          <BookMarked className="w-5 h-5" />
                          <h4 className="font-bold text-base sm:text-lg">التفسير الميسر</h4>
                          <span className="text-xs mr-auto bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded-full">
                            {showTafseer ? "إخفاء" : "عرض"}
                          </span>
                        </div>
                        {showTafseer && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-base sm:text-lg leading-relaxed text-amber-900 dark:text-amber-200"
                          >
                            {tafseer}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadVerse}
                      disabled={isLoading}
                      className="bg-transparent"
                    >
                      <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? "animate-spin" : ""}`} />
                      آية أخرى
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyVerse} className="bg-transparent">
                      {copied ? <Check className="w-4 h-4 ml-2 text-green-600" /> : <Copy className="w-4 h-4 ml-2" />}
                      {copied ? "تم النسخ" : "نسخ"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadVerseImage}
                      disabled={isGeneratingImage}
                      className="bg-transparent"
                    >
                      {isGeneratingImage ? (
                        <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 ml-2" />
                      )}
                      تحميل صورة
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={shareVerseImage}
                      disabled={isGeneratingImage}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isGeneratingImage ? (
                        <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4 ml-2" />
                      )}
                      مشاركة
                    </Button>
                  </div>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    {showTafseer ? "الصورة ستتضمن الآية مع التفسير" : "الصورة ستتضمن الآية فقط"}
                  </p>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-12">لم نتمكن من تحميل الآية</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  )
}
