"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronLeft, ChevronRight, Check, RotateCcw, Copy, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Dua {
  id: string
  text: string
  translation: string
  source: string
  occasion: string
}

const dailyDuas: Dua[] = [
  {
    id: "d1",
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    translation: "اللهم أعطني علماً نافعاً ورزقاً حلالاً وعملاً صالحاً مقبولاً",
    source: "رواه ابن ماجه",
    occasion: "دعاء الصباح",
  },
  {
    id: "d2",
    text: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي",
    translation: "اللهم دلني على الطريق الصحيح ووفقني للصواب",
    source: "رواه مسلم",
    occasion: "دعاء التوفيق",
  },
  {
    id: "d3",
    text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "ربنا أعطنا خير الدنيا وخير الآخرة واحفظنا من عذاب النار",
    source: "سورة البقرة: 201",
    occasion: "دعاء جامع",
  },
  {
    id: "d4",
    text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ",
    translation: "اللهم إني ألجأ إليك من الغم والحزن ومن الضعف والكسل",
    source: "رواه البخاري",
    occasion: "دعاء للهم والحزن",
  },
  {
    id: "d5",
    text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    translation: "ربي وسع صدري وسهل أموري",
    source: "سورة طه: 25-26",
    occasion: "دعاء التيسير",
  },
  {
    id: "d6",
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    translation: "اللهم أعطني الهداية والتقوى والعفة والغنى",
    source: "رواه مسلم",
    occasion: "دعاء الصلاح",
  },
  {
    id: "d7",
    text: "رَبِّ زِدْنِي عِلْمًا",
    translation: "يا ربي زدني علماً ومعرفة",
    source: "سورة طه: 114",
    occasion: "دعاء العلم",
  },
]

const STORAGE_KEY = "daily-duas-state"

interface DuaState {
  completedIds: string[]
  lastResetDate: string
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

function getState(): DuaState {
  if (typeof window === "undefined") return { completedIds: [], lastResetDate: "" }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const state = JSON.parse(saved) as DuaState
      // Reset if new day
      if (state.lastResetDate !== getTodayDate()) {
        return { completedIds: [], lastResetDate: getTodayDate() }
      }
      return state
    }
  } catch {
    // ignore
  }
  return { completedIds: [], lastResetDate: getTodayDate() }
}

function saveState(state: DuaState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function DailyDuasSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load state on mount
  useEffect(() => {
    const state = getState()
    setCompletedIds(state.completedIds)
    setIsLoaded(true)
  }, [])

  // Save state when completed changes
  useEffect(() => {
    if (!isLoaded) return
    saveState({ completedIds, lastResetDate: getTodayDate() })
  }, [completedIds, isLoaded])

  const currentDua = dailyDuas[currentIndex]
  const isCompleted = completedIds.includes(currentDua.id)
  const totalCompleted = completedIds.length
  const allCompleted = totalCompleted === dailyDuas.length

  const handleComplete = () => {
    if (!isCompleted) {
      setCompletedIds([...completedIds, currentDua.id])
    }
  }

  const handleReset = () => {
    setCompletedIds([])
    setCurrentIndex(0)
  }

  const handleNext = () => {
    if (currentIndex < dailyDuas.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const copyDua = async () => {
    await navigator.clipboard.writeText(`${currentDua.text}\n\n${currentDua.translation}\n\n— ${currentDua.source}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareDua = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentDua.occasion,
          text: `${currentDua.text}\n\n${currentDua.translation}\n\n— ${currentDua.source}`,
        })
      } catch {
        // User cancelled
      }
    } else {
      copyDua()
    }
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-purple-50/50 to-muted/50 dark:from-purple-950/20 dark:to-muted/20" id="duas">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 mb-4 sm:mb-6">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-purple-700 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            أدعية يومية
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {allCompleted ? "بارك الله فيك! أتممت أدعيتك اليوم ✨" : "أدعية مختارة من القرآن والسنة"}
          </p>
        </motion.div>

        {/* Progress */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>التقدم: {totalCompleted} / {dailyDuas.length}</span>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4 ml-1" />
              إعادة
            </Button>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompleted / dailyDuas.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Dua Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {currentDua.occasion}
                </Badge>
                <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-green-500" : ""}>
                  {isCompleted ? (
                    <>
                      <Check className="w-3 h-3 ml-1" />
                      تم
                    </>
                  ) : (
                    `${currentIndex + 1} / ${dailyDuas.length}`
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDua.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-4"
                >
                  <p className="text-xl sm:text-2xl md:text-3xl font-serif leading-loose text-foreground">
                    {currentDua.text}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {currentDua.translation}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {currentDua.source}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={isCompleted}
                  className={`${isCompleted ? "bg-green-500 hover:bg-green-500" : "bg-purple-500 hover:bg-purple-600"}`}
                >
                  {isCompleted ? <Check className="w-5 h-5 ml-2" /> : null}
                  {isCompleted ? "تم الدعاء" : "آمين - تم الدعاء"}
                </Button>
                <Button variant="outline" size="icon" onClick={copyDua} className="bg-transparent">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={shareDua} className="bg-transparent">
                  <Share2 className="w-4 h-4" />
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
                  disabled={currentIndex === dailyDuas.length - 1}
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
