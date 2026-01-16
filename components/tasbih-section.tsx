"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Volume2, VolumeX, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tasbihPhrases = [
  { id: "subhanallah", text: "سُبْحَانَ اللهِ", transliteration: "Subhan Allah" },
  { id: "alhamdulillah", text: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah" },
  { id: "allahuakbar", text: "اللهُ أَكْبَرُ", transliteration: "Allahu Akbar" },
  { id: "lailaha", text: "لَا إِلَهَ إِلَّا اللهُ", transliteration: "La ilaha illa Allah" },
  { id: "istighfar", text: "أَسْتَغْفِرُ اللهَ", transliteration: "Astaghfirullah" },
  { id: "hawqala", text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", transliteration: "La hawla wa la quwwata illa billah" },
]

const targetOptions = [33, 99, 100, 500, 1000]

export function TasbihSection() {
  const [count, setCount] = useState(0)
  const [target, setTarget] = useState(33)
  const [selectedPhrase, setSelectedPhrase] = useState(tasbihPhrases[0])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("tasbih-total")
    if (saved) setTotalCount(Number.parseInt(saved, 10))
  }, [])

  // Save total count
  useEffect(() => {
    localStorage.setItem("tasbih-total", totalCount.toString())
  }, [totalCount])

  const playClickSound = useCallback(() => {
    if (soundEnabled) {
      const audioContext = new (
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }, [soundEnabled])

  const handleTasbih = () => {
    playClickSound()
    setCount((prev) => prev + 1)
    setTotalCount((prev) => prev + 1)
  }

  const handleReset = () => {
    setCount(0)
  }

  const progress = (count / target) * 100
  const isComplete = count >= target

  return (
    <section
      className="py-12 sm:py-20 bg-gradient-to-b from-amber-50/50 to-emerald-50/50 dark:from-amber-950/20 dark:to-emerald-950/20"
      id="tasbih"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl">📿</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            السبحة الإلكترونية
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">سبّح وأذكر الله في أي وقت</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950">
            <CardContent className="p-4 sm:p-8 space-y-6">
              {/* Phrase Selector */}
              <Select
                value={selectedPhrase.id}
                onValueChange={(id) => {
                  const phrase = tasbihPhrases.find((p) => p.id === id)
                  if (phrase) setSelectedPhrase(phrase)
                }}
              >
                <SelectTrigger className="bg-emerald-800/50 border-emerald-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tasbihPhrases.map((phrase) => (
                    <SelectItem key={phrase.id} value={phrase.id}>
                      {phrase.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Current Phrase */}
              <div className="text-center py-4">
                <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-2">{selectedPhrase.text}</p>
                <p className="text-emerald-300 text-sm">{selectedPhrase.transliteration}</p>
              </div>

              {/* Progress Ring */}
              <div className="relative flex justify-center">
                <svg className="w-40 h-40 sm:w-48 sm:h-48 transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgb(6 95 70 / 0.3)" strokeWidth="8" />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={isComplete ? "#22c55e" : "#fbbf24"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
                <button onClick={handleTasbih} className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isComplete ? "bg-green-500" : "bg-amber-500 hover:bg-amber-400"
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl font-bold text-emerald-900">{count}</span>
                    <span className="text-xs sm:text-sm text-emerald-800">/ {target}</span>
                  </motion.div>
                </button>
              </div>

              {/* Target & Controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-300" />
                  <Select value={target.toString()} onValueChange={(v) => setTarget(Number.parseInt(v, 10))}>
                    <SelectTrigger className="w-24 bg-emerald-800/50 border-emerald-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetOptions.map((opt) => (
                        <SelectItem key={opt} value={opt.toString()}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-emerald-300 hover:text-white hover:bg-emerald-700"
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="text-emerald-300 hover:text-white hover:bg-emerald-700"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Total Count */}
              <div className="text-center pt-4 border-t border-emerald-700">
                <p className="text-emerald-300 text-sm">إجمالي التسبيحات</p>
                <p className="text-2xl font-bold text-amber-300">{totalCount.toLocaleString("ar-EG")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
