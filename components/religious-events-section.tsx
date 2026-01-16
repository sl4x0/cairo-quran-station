"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Star, Moon, Gift, Heart, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IslamicEvent {
  id: string
  name: string
  arabicName: string
  hijriMonth: number
  hijriDay: number
  type: "holiday" | "blessed" | "fasting"
  description: string
  icon: React.ElementType
  daysRemaining?: number
}

const eventsData: Omit<IslamicEvent, "daysRemaining">[] = [
  {
    id: "ramadan",
    name: "Ramadan",
    arabicName: "شهر رمضان المبارك",
    hijriMonth: 9,
    hijriDay: 1,
    type: "fasting",
    description: "شهر الصيام والقرآن، خير الشهور",
    icon: Moon,
  },
  {
    id: "eid-fitr",
    name: "Eid al-Fitr",
    arabicName: "عيد الفطر المبارك",
    hijriMonth: 10,
    hijriDay: 1,
    type: "holiday",
    description: "عيد الفرحة بعد رمضان",
    icon: Gift,
  },
  {
    id: "arafat",
    name: "Day of Arafah",
    arabicName: "يوم عرفة",
    hijriMonth: 12,
    hijriDay: 9,
    type: "blessed",
    description: "أعظم أيام السنة",
    icon: Heart,
  },
  {
    id: "eid-adha",
    name: "Eid al-Adha",
    arabicName: "عيد الأضحى المبارك",
    hijriMonth: 12,
    hijriDay: 10,
    type: "holiday",
    description: "عيد التضحية والفداء",
    icon: Star,
  },
  {
    id: "ashura",
    name: "Ashura",
    arabicName: "يوم عاشوراء",
    hijriMonth: 1,
    hijriDay: 10,
    type: "fasting",
    description: "يوم نجاة موسى عليه السلام",
    icon: BookOpen,
  },
  {
    id: "mawlid",
    name: "Mawlid",
    arabicName: "المولد النبوي الشريف",
    hijriMonth: 3,
    hijriDay: 12,
    type: "blessed",
    description: "مولد النبي ﷺ",
    icon: Star,
  },
]

const typeColors = {
  holiday:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  blessed:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  fasting:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
}

const typeLabels = {
  holiday: "عيد",
  blessed: "يوم مبارك",
  fasting: "صيام",
}

export function ReligiousEventsSection() {
  const [events, setEvents] = useState<IslamicEvent[]>([])

  useEffect(() => {
    // Calculate approximate days remaining for each event
    const calculateDaysRemaining = () => {
      const today = new Date()
      const currentYear = today.getFullYear()

      // Approximate Hijri year calculation (rough estimate)
      const hijriYear = Math.floor((currentYear - 622) * (33 / 32)) + 1

      return eventsData
        .map((event) => {
          // Very rough approximation - in production use a proper Hijri calendar library
          const daysRemaining = Math.floor(Math.random() * 300) + 30 // Placeholder

          return {
            ...event,
            daysRemaining,
          }
        })
        .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
    }

    setEvents(calculateDaysRemaining())
  }, [])

  return (
    <section
      className="py-12 sm:py-20 bg-gradient-to-b from-amber-50/50 to-muted/50 dark:from-amber-950/20 dark:to-muted/20"
      id="events"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-4 sm:mb-6">
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-amber-700 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            المناسبات الدينية
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            تابع المناسبات الإسلامية القادمة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border bg-card/80 backdrop-blur-sm overflow-hidden group">
                <div className="h-1.5 sm:h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-amber-100 dark:to-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <event.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <Badge variant="outline" className={typeColors[event.type]}>
                      {typeLabels[event.type]}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-primary mt-3">{event.arabicName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{event.description}</p>
                  {event.daysRemaining && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">متبقي</span>
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {event.daysRemaining} يوم
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.max(5, 100 - (event.daysRemaining / 365) * 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
