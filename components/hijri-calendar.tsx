"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Star, Moon, Gift, Heart, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { gregorianToHijri, hijriToGregorian, daysUntilHijriDate, HIJRI_MONTHS } from "@/lib/hijri"

interface IslamicEvent {
  name: string
  hijriMonth: number
  hijriDay: number
  type: "holiday" | "blessed" | "fasting"
  icon: React.ElementType
}

const ISLAMIC_EVENTS: IslamicEvent[] = [
  { name: "رأس السنة الهجرية", hijriMonth: 1, hijriDay: 1, type: "holiday", icon: Star },
  { name: "يوم عاشوراء", hijriMonth: 1, hijriDay: 10, type: "fasting", icon: BookOpen },
  { name: "المولد النبوي", hijriMonth: 3, hijriDay: 12, type: "blessed", icon: Star },
  { name: "الإسراء والمعراج", hijriMonth: 7, hijriDay: 27, type: "blessed", icon: Moon },
  { name: "ليلة النصف من شعبان", hijriMonth: 8, hijriDay: 15, type: "blessed", icon: Moon },
  { name: "أول رمضان", hijriMonth: 9, hijriDay: 1, type: "fasting", icon: Moon },
  { name: "ليلة القدر (27)", hijriMonth: 9, hijriDay: 27, type: "blessed", icon: Star },
  { name: "عيد الفطر", hijriMonth: 10, hijriDay: 1, type: "holiday", icon: Gift },
  { name: "يوم عرفة", hijriMonth: 12, hijriDay: 9, type: "blessed", icon: Heart },
  { name: "عيد الأضحى", hijriMonth: 12, hijriDay: 10, type: "holiday", icon: Gift },
]

const typeColors = {
  holiday: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  blessed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  fasting: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
}

const typeLabels = {
  holiday: "عيد",
  blessed: "مبارك",
  fasting: "صيام",
}

export function HijriCalendar() {
  const [currentMonth, setCurrentMonth] = useState(1)
  const [currentYear, setCurrentYear] = useState(1446)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize with current Hijri date
  useEffect(() => {
    const hijri = gregorianToHijri(new Date())
    setCurrentMonth(hijri.month)
    setCurrentYear(hijri.year)
    setSelectedDay(hijri.day)
    setIsLoaded(true)
  }, [])

  // Get days in current Hijri month (approximate - alternates 30/29)
  const getDaysInMonth = (month: number): number => {
    return month % 2 === 1 ? 30 : 29
  }

  // Get events for current month
  const monthEvents = ISLAMIC_EVENTS.filter(e => e.hijriMonth === currentMonth)

  // Navigate months
  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDay(null)
  }

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDay(null)
  }

  // Go to today
  const goToToday = () => {
    const hijri = gregorianToHijri(new Date())
    setCurrentMonth(hijri.month)
    setCurrentYear(hijri.year)
    setSelectedDay(hijri.day)
  }

  // Check if a day has an event
  const getEventForDay = (day: number): IslamicEvent | undefined => {
    return ISLAMIC_EVENTS.find(e => e.hijriMonth === currentMonth && e.hijriDay === day)
  }

  // Get Gregorian equivalent
  const getGregorianDate = (day: number): string => {
    const greg = hijriToGregorian(currentYear, currentMonth, day)
    return greg.toLocaleDateString("ar-EG", { day: "numeric", month: "short" })
  }

  // Current Hijri date check
  const todayHijri = gregorianToHijri(new Date())
  const isToday = (day: number) =>
    currentMonth === todayHijri.month &&
    currentYear === todayHijri.year &&
    day === todayHijri.day

  // Upcoming events sorted by days remaining
  const upcomingEvents = ISLAMIC_EVENTS
    .map(e => ({
      ...e,
      daysRemaining: daysUntilHijriDate(e.hijriMonth, e.hijriDay)
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5)

  if (!isLoaded) return null

  return (
    <div className="space-y-8">
      {/* Calendar Header */}
      <Card className="overflow-hidden border-none shadow-xl">
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-serif text-primary">
                {HIJRI_MONTHS[currentMonth - 1]} {currentYear}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                التقويم الهجري
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Today Button */}
          <div className="flex justify-center mb-4">
            <Button variant="outline" size="sm" onClick={goToToday} className="bg-transparent">
              <Calendar className="w-4 h-4 ml-2" />
              اليوم
            </Button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map(day => (
              <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1).map(day => {
              const event = getEventForDay(day)
              const today = isToday(day)
              const selected = selectedDay === day

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-2 sm:p-3 rounded-lg transition-all text-sm sm:text-base ${
                    today
                      ? "bg-primary text-primary-foreground font-bold"
                      : selected
                        ? "bg-primary/20 text-primary"
                        : event
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "hover:bg-muted"
                  }`}
                >
                  {day}
                  {event && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Selected Day Info */}
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">
                    {selectedDay} {HIJRI_MONTHS[currentMonth - 1]} {currentYear}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    يوافق: {getGregorianDate(selectedDay)}
                  </p>
                </div>
                {getEventForDay(selectedDay) && (
                  <Badge className={typeColors[getEventForDay(selectedDay)!.type]}>
                    {getEventForDay(selectedDay)!.name}
                  </Badge>
                )}
              </div>
            </motion.div>
          )}

          {/* Month Events */}
          {monthEvents.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">مناسبات هذا الشهر:</p>
              {monthEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <event.icon className="w-4 h-4 text-primary" />
                  <span>{event.name}</span>
                  <Badge variant="outline" className="mr-auto text-xs">
                    {event.hijriDay}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          المناسبات القادمة
        </h3>
        <div className="grid gap-3">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColors[event.type]}`}>
                    <event.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.hijriDay} {HIJRI_MONTHS[event.hijriMonth - 1]}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">
                      {event.daysRemaining === 0 ? "اليوم!" : event.daysRemaining}
                    </p>
                    {event.daysRemaining > 0 && (
                      <p className="text-xs text-muted-foreground">يوم</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
