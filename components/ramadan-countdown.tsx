"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Clock, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchPrayerTimes } from "@/lib/api"
import Link from "next/link"

function parseTimeToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

function formatCountdown(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return {
    h: h.toString().padStart(2, "0"),
    m: m.toString().padStart(2, "0"),
    s: s.toString().padStart(2, "0"),
  }
}

export function RamadanCountdown() {
  const [isRamadan, setIsRamadan] = useState(false)
  const [hijriDay, setHijriDay] = useState(0)
  const [isLaylat, setIsLaylat] = useState(false)
  const [fajrTime, setFajrTime] = useState("")
  const [maghribTime, setMaghribTime] = useState("")
  const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" })
  const [mode, setMode] = useState<"iftar" | "suhoor">("iftar")
  const [targetTime, setTargetTime] = useState("")

  // Use Aladhan API's Hijri date — accurate per official moon sighting (not local algorithm)
  useEffect(() => {
    fetchPrayerTimes(30.0444, 31.2357).then((data) => {
      if (!data) return

      // API returns correct Hijri date per Umm al-Qura / official sighting
      const hijriMonth = data.date.hijri.month.number
      const day = parseInt(data.date.hijri.day, 10)

      if (hijriMonth !== 9) return // not Ramadan — hide component

      setIsRamadan(true)
      setHijriDay(day)
      setIsLaylat([21, 23, 25, 27, 29].includes(day))
      setFajrTime(data.timings.Fajr.substring(0, 5))
      setMaghribTime(data.timings.Maghrib.substring(0, 5))
    })
  }, [])

  // Live countdown ticker
  useEffect(() => {
    if (!fajrTime || !maghribTime) return

    const tick = () => {
      const now = new Date()
      const fajr = parseTimeToDate(fajrTime)
      const maghrib = parseTimeToDate(maghribTime)

      let target: Date
      let currentMode: "iftar" | "suhoor"

      if (now >= fajr && now < maghrib) {
        // Fasting window → count down to Iftar (Maghrib)
        target = maghrib
        currentMode = "iftar"
        setTargetTime(maghribTime)
      } else {
        // Eating window → count down to Suhoor deadline (Fajr)
        currentMode = "suhoor"
        setTargetTime(fajrTime)
        if (now < fajr) {
          target = fajr
        } else {
          // After Maghrib — next Fajr is tomorrow
          const tomorrowFajr = new Date(fajr)
          tomorrowFajr.setDate(tomorrowFajr.getDate() + 1)
          target = tomorrowFajr
        }
      }

      setMode(currentMode)
      const diffSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
      setCountdown(formatCountdown(diffSeconds))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [fajrTime, maghribTime])

  if (!isRamadan) return null

  return (
    <section className="pt-4 pb-2 sm:pt-6 sm:pb-2">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            className={`max-w-2xl mx-auto overflow-hidden border-none shadow-2xl ${
              isLaylat
                ? "bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950"
                : "bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950"
            }`}
          >
            <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
            <CardContent className="p-5 sm:p-8 text-white text-center space-y-4">

              {/* Title */}
              <div className="flex items-center justify-center gap-3">
                <Moon className="w-6 h-6 text-amber-300" />
                <span className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                  رمضان مبارك — اليوم {hijriDay}
                </span>
                <Moon className="w-6 h-6 text-amber-300" />
              </div>

              {/* Laylat al-Qadr banner */}
              {isLaylat && (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-lg px-4 py-2"
                >
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span className="text-amber-200 text-sm font-medium">
                    ليلة مباركة — قد تكون ليلة القدر
                  </span>
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                </motion.div>
              )}

              {/* Mode label */}
              <p className="text-base sm:text-lg text-white/80">
                {mode === "iftar" ? "يتبقى على الإفطار" : "يتبقى على انتهاء وقت السحور"}
              </p>

              {/* Countdown clock */}
              <div className="flex items-end justify-center gap-2 sm:gap-3" dir="ltr">
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-7xl font-mono font-bold text-amber-300 tabular-nums">
                    {countdown.h}
                  </span>
                  <span className="text-xs text-white/50 mt-1">ساعة</span>
                </div>
                <span className="text-4xl sm:text-6xl font-bold text-amber-400/60 pb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-7xl font-mono font-bold text-amber-300 tabular-nums">
                    {countdown.m}
                  </span>
                  <span className="text-xs text-white/50 mt-1">دقيقة</span>
                </div>
                <span className="text-4xl sm:text-6xl font-bold text-amber-400/60 pb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-7xl font-mono font-bold text-amber-300 tabular-nums">
                    {countdown.s}
                  </span>
                  <span className="text-xs text-white/50 mt-1">ثانية</span>
                </div>
              </div>

              {/* Target time */}
              {targetTime && (
                <p className="text-sm text-white/50 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  {mode === "iftar"
                    ? `الإفطار — المغرب: ${targetTime}`
                    : `السحور ينتهي عند الفجر: ${targetTime}`}
                </p>
              )}

              {/* Link to Ramadan hub */}
              <div>
                <Link
                  href="/ramadan/"
                  className="inline-flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 hover:text-amber-100 rounded-lg px-5 py-2 text-sm transition-colors"
                >
                  <Moon className="w-4 h-4" />
                  أدوات رمضان الكاملة
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
