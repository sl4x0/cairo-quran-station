"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sun, Moon, ChevronLeft, ChevronRight, Check, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAzkarState, saveAzkarState, resetAzkarState, isAzkarCompletedToday } from "@/lib/storage"

interface Dhikr {
  id: string
  text: string
  count: number
  benefit: string
}

const morningAzkar: Dhikr[] = [
  {
    id: "m1",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    count: 1,
    benefit: "من قالها حين يصبح فقد أدى شكر يومه",
  },
  {
    id: "m2",
    text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    count: 1,
    benefit: "دعاء الصباح",
  },
  {
    id: "m3",
    text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    count: 100,
    benefit: "من قالها حين يصبح مائة مرة لم يأت أحد يوم القيامة بأفضل مما جاء به",
  },
  {
    id: "m4",
    text: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    count: 10,
    benefit: "كانت له عدل عشر رقاب، وكُتبت له مائة حسنة، ومُحيت عنه مائة سيئة",
  },
  {
    id: "m5",
    text: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",
    count: 100,
    benefit: "كان رسول الله ﷺ يستغفر الله في اليوم مائة مرة",
  },
]

const eveningAzkar: Dhikr[] = [
  {
    id: "e1",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    count: 1,
    benefit: "من قالها حين يمسي فقد أدى شكر ليلته",
  },
  {
    id: "e2",
    text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
    count: 1,
    benefit: "دعاء المساء",
  },
  {
    id: "e3",
    text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    count: 3,
    benefit: "لم تضره ذوات السموم في تلك الليلة",
  },
  {
    id: "e4",
    text: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    count: 3,
    benefit: "لم يضره شيء",
  },
  {
    id: "e5",
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    count: 3,
    benefit: "ما سُئِلَ اللهُ شيئاً أحب إليه من العافية",
  },
]

function getTimeBasedAzkarType(): "morning" | "evening" {
  const hour = new Date().getHours()
  // Morning: from Fajr (around 4-5 AM) until Asr (around 3-4 PM)
  // Evening: from Asr until next Fajr
  if (hour >= 4 && hour < 16) {
    return "morning"
  }
  return "evening"
}

export function AzkarSection() {
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved state on mount
  useEffect(() => {
    const detectedType = getTimeBasedAzkarType()
    setActiveTab(detectedType)

    // Load saved counts for the detected type
    const savedState = getAzkarState(detectedType)
    if (savedState.counts && Object.keys(savedState.counts).length > 0) {
      setCompletedCounts(savedState.counts)
    }
    setIsLoaded(true)
  }, [])

  // Load state when tab changes
  useEffect(() => {
    if (!isLoaded) return
    const savedState = getAzkarState(activeTab)
    setCompletedCounts(savedState.counts || {})
    setCurrentIndex(0)
  }, [activeTab, isLoaded])

  // Save state when counts change
  useEffect(() => {
    if (!isLoaded) return
    const azkar = activeTab === "morning" ? morningAzkar : eveningAzkar
    const allCompleted = azkar.every((d) => (completedCounts[d.id] || 0) >= d.count)
    saveAzkarState(activeTab, completedCounts, allCompleted)
  }, [completedCounts, activeTab, isLoaded])

  const azkar = activeTab === "morning" ? morningAzkar : eveningAzkar
  const currentDhikr = azkar[currentIndex]
  const completedCount = completedCounts[currentDhikr.id] || 0
  const isCompleted = completedCount >= currentDhikr.count

  const handleCount = () => {
    if (!isCompleted) {
      setCompletedCounts((prev) => ({
        ...prev,
        [currentDhikr.id]: (prev[currentDhikr.id] || 0) + 1,
      }))
    }
  }

  const handleNext = () => {
    if (currentIndex < azkar.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    setCompletedCounts({})
    setCurrentIndex(0)
    resetAzkarState(activeTab)
  }

  const totalCompleted = azkar.filter((d) => (completedCounts[d.id] || 0) >= d.count).length
  const allCompleted = totalCompleted === azkar.length

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-muted/50 to-amber-50/50 dark:to-amber-950/20" id="azkar">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-4 sm:mb-6">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-amber-700 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            {activeTab === "morning" ? "أذكار الصباح" : "أذكار المساء"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {allCompleted
              ? "بارك الله فيك! أتممت أذكارك ✨"
              : activeTab === "morning"
                ? "حان وقت أذكار الصباح - حافظ على وردك اليومي"
                : "حان وقت أذكار المساء - حافظ على وردك اليومي"}
          </p>
        </motion.div>

        {/* Tab Buttons - still allow manual switching */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            variant={activeTab === "morning" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("morning")
              setCurrentIndex(0)
            }}
            className={`gap-2 ${activeTab === "morning" ? "bg-amber-500 hover:bg-amber-600" : "bg-transparent"}`}
          >
            <Sun className="w-4 h-4" />
            أذكار الصباح
            {isAzkarCompletedToday("morning") && <Check className="w-3 h-3 mr-1" />}
          </Button>
          <Button
            variant={activeTab === "evening" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("evening")
              setCurrentIndex(0)
            }}
            className={`gap-2 ${activeTab === "evening" ? "bg-indigo-500 hover:bg-indigo-600" : "bg-transparent"}`}
          >
            <Moon className="w-4 h-4" />
            أذكار المساء
            {isAzkarCompletedToday("evening") && <Check className="w-3 h-3 mr-1" />}
          </Button>
        </div>

        {/* Progress */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              التقدم: {totalCompleted} / {azkar.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4 ml-1" />
              إعادة
            </Button>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${activeTab === "morning" ? "bg-amber-500" : "bg-indigo-500"}`}
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompleted / azkar.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Dhikr Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden border-none shadow-xl">
            <div
              className={`h-2 ${activeTab === "morning" ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-indigo-400 to-purple-500"}`}
            />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  {currentIndex + 1} / {azkar.length}
                </Badge>
                <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-green-500" : ""}>
                  {isCompleted ? (
                    <>
                      <Check className="w-3 h-3 ml-1" />
                      مكتمل
                    </>
                  ) : (
                    `${completedCount} / ${currentDhikr.count}`
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDhikr.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-xl sm:text-2xl md:text-3xl font-serif leading-loose text-foreground mb-4">
                    {currentDhikr.text}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {currentDhikr.benefit}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Counter Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleCount}
                  disabled={isCompleted}
                  className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full text-2xl sm:text-3xl font-bold shadow-lg transition-all ${
                    isCompleted
                      ? "bg-green-500 hover:bg-green-500"
                      : activeTab === "morning"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                >
                  {isCompleted ? <Check className="w-10 h-10 sm:w-12 sm:h-12" /> : completedCount}
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="bg-transparent">
                  <ChevronRight className="w-5 h-5 ml-1" />
                  السابق
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentIndex === azkar.length - 1}
                  className="bg-transparent"
                >
                  التالي
                  <ChevronLeft className="w-5 h-5 mr-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
