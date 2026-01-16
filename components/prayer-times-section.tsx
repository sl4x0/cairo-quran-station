"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Clock, Sun, Sunrise, Sunset, Moon, CloudSun, MapPin, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchPrayerTimes, type PrayerTimesData } from "@/lib/api"

interface PrayerTime {
  name: string
  time: string
  icon: React.ElementType
  arabicName: string
  key: keyof PrayerTimesData
}

const prayerConfig: Omit<PrayerTime, "time">[] = [
  { name: "Fajr", arabicName: "الفجر", icon: Sunrise, key: "Fajr" },
  { name: "Sunrise", arabicName: "الشروق", icon: Sun, key: "Sunrise" },
  { name: "Dhuhr", arabicName: "الظهر", icon: CloudSun, key: "Dhuhr" },
  { name: "Asr", arabicName: "العصر", icon: Sun, key: "Asr" },
  { name: "Maghrib", arabicName: "المغرب", icon: Sunset, key: "Maghrib" },
  { name: "Isha", arabicName: "العشاء", icon: Moon, key: "Isha" },
]

function getNextPrayer(prayers: PrayerTime[]): { prayer: PrayerTime; remaining: string } | null {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const prayer of prayers) {
    if (!prayer.time) continue
    const [hours, minutes] = prayer.time.split(":").map(Number)
    const prayerMinutes = hours * 60 + minutes
    if (prayerMinutes > currentMinutes) {
      const diff = prayerMinutes - currentMinutes
      const h = Math.floor(diff / 60)
      const m = diff % 60
      return {
        prayer,
        remaining: h > 0 ? `${h} ساعة و ${m} دقيقة` : `${m} دقيقة`,
      }
    }
  }

  // If all prayers passed, next is Fajr tomorrow
  const fajr = prayers[0]
  if (fajr?.time) {
    const [hours, minutes] = fajr.time.split(":").map(Number)
    const fajrMinutes = hours * 60 + minutes
    const diff = 24 * 60 - currentMinutes + fajrMinutes
    const h = Math.floor(diff / 60)
    const m = diff % 60
    return {
      prayer: fajr,
      remaining: `${h} ساعة و ${m} دقيقة`,
    }
  }
  return null
}

export function PrayerTimesSection() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [nextPrayer, setNextPrayer] = useState<{ prayer: PrayerTime; remaining: string } | null>(null)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [hijriDate, setHijriDate] = useState<string>("")
  const [gregorianDate, setGregorianDate] = useState<string>("")
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState("القاهرة")
  const [isLoading, setIsLoading] = useState(false)

  const loadPrayerTimes = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true)
    const data = await fetchPrayerTimes(lat, lon)
    if (data) {
      const times: PrayerTime[] = prayerConfig.map((p) => ({
        ...p,
        time: data.timings[p.key]?.substring(0, 5) || "",
      }))
      setPrayerTimes(times)
      setNextPrayer(getNextPrayer(times))

      // Set Hijri date
      if (data.date?.hijri) {
        setHijriDate(`${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year}`)
      }
    }
    setIsLoading(false)
  }, [])

  // Get user location
  const getUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          setLocation({ lat, lon })
          setLocationName("موقعك الحالي")
          loadPrayerTimes(lat, lon)
        },
        () => {
          // Default to Cairo if location denied
          loadPrayerTimes(30.0444, 31.2357)
        },
      )
    } else {
      loadPrayerTimes(30.0444, 31.2357)
    }
  }, [loadPrayerTimes])

  useEffect(() => {
    // Initial load with Cairo
    loadPrayerTimes(30.0444, 31.2357)

    // Update current time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
      setGregorianDate(
        now.toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
      if (prayerTimes.length > 0) {
        setNextPrayer(getNextPrayer(prayerTimes))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [loadPrayerTimes, prayerTimes])

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-primary/5 to-muted/50" id="prayer-times">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            مواقيت الصلاة
          </h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{locationName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={getUserLocation}
                disabled={isLoading}
                className="text-primary hover:text-primary/80"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground">{hijriDate}</p>
            <p className="text-sm text-muted-foreground">{gregorianDate}</p>
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-mono text-primary">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              <span dir="ltr">{currentTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Next Prayer Countdown */}
        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto mb-8 sm:mb-12"
          >
            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-none shadow-xl">
              <CardContent className="p-4 sm:p-6 text-center text-white">
                <p className="text-emerald-100 mb-2 text-sm sm:text-base">الصلاة القادمة</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <nextPrayer.prayer.icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300" />
                  <span className="text-2xl sm:text-3xl font-bold">{nextPrayer.prayer.arabicName}</span>
                </div>
                <p className="text-lg sm:text-xl text-emerald-100">
                  متبقي: <span className="font-bold text-amber-200">{nextPrayer.remaining}</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Prayer Times Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {prayerTimes.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={`text-center hover:shadow-lg transition-all duration-300 ${
                  nextPrayer?.prayer.name === prayer.name
                    ? "ring-2 ring-primary bg-primary/5"
                    : "bg-card hover:bg-muted/50"
                }`}
              >
                <CardContent className="p-3 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <prayer.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-primary text-sm sm:text-base mb-1">{prayer.arabicName}</h3>
                  <p className="text-lg sm:text-2xl font-mono text-primary/80" dir="ltr">
                    {prayer.time || "--:--"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
