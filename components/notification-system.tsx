"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sun, Moon, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: "prayer" | "azkar-morning" | "azkar-evening" | "event"
  title: string
  message: string
  icon: React.ElementType
  color: string
  sound?: string
}

// Simple notification sounds using Web Audio API
function playNotificationSound(type: string) {
  try {
    const audioContext = new (
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Different tones for different notification types
    if (type === "prayer") {
      oscillator.frequency.value = 440 // A4
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)
    } else if (type === "azkar-morning" || type === "azkar-evening") {
      oscillator.frequency.value = 523 // C5
      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } else if (type === "event") {
      oscillator.frequency.value = 659 // E5
      oscillator.type = "triangle"
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.8)
    }
  } catch {
    // Audio not supported
  }
}

export function NotificationSystem({ isLiveMode = true }: { isLiveMode?: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dismissedToday, setDismissedToday] = useState<Set<string>>(new Set())
  const checkedRef = useRef({ morning: false, evening: false, prayer: false })

  const showNotification = useCallback(
    (notification: Notification) => {
      if (dismissedToday.has(notification.id)) return

      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev
        return [...prev, notification]
      })
      playNotificationSound(notification.type)
    },
    [dismissedToday],
  )

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setDismissedToday((prev) => new Set([...prev, id]))
  }, [])

  // Check for azkar time
  useEffect(() => {
    const checkAzkarTime = () => {
      const hour = new Date().getHours()
      const today = new Date().toDateString()

      // Morning azkar: 5 AM - 8 AM
      if (hour >= 5 && hour < 8 && !checkedRef.current.morning) {
        checkedRef.current.morning = true
        const id = `azkar-morning-${today}`
        if (!dismissedToday.has(id)) {
          showNotification({
            id,
            type: "azkar-morning",
            title: "أذكار الصباح",
            message: "حان وقت أذكار الصباح، حافظ على وردك اليومي",
            icon: Sun,
            color: "bg-amber-500",
          })
        }
      }

      // Evening azkar: 4 PM - 7 PM
      if (hour >= 16 && hour < 19 && !checkedRef.current.evening) {
        checkedRef.current.evening = true
        const id = `azkar-evening-${today}`
        if (!dismissedToday.has(id)) {
          showNotification({
            id,
            type: "azkar-evening",
            title: "أذكار المساء",
            message: "حان وقت أذكار المساء، حافظ على وردك اليومي",
            icon: Moon,
            color: "bg-indigo-500",
          })
        }
      }

      // Reset checks at midnight
      if (hour === 0) {
        checkedRef.current = { morning: false, evening: false, prayer: false }
      }
    }

    checkAzkarTime()
    const interval = setInterval(checkAzkarTime, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [showNotification, dismissedToday])

  // Check for prayer time (only if NOT in live mode)
  useEffect(() => {
    if (isLiveMode) return // Skip if live mode since radio has athan

    const checkPrayerTime = async () => {
      try {
        const now = new Date()
        const hour = now.getHours()
        const minute = now.getMinutes()
        const currentMinutes = hour * 60 + minute

        // Approximate prayer times for Cairo (simplified)
        const prayerTimes = [
          { name: "الفجر", minutes: 5 * 60 + 15 },
          { name: "الظهر", minutes: 12 * 60 + 15 },
          { name: "العصر", minutes: 15 * 60 + 30 },
          { name: "المغرب", minutes: 18 * 60 },
          { name: "العشاء", minutes: 19 * 60 + 30 },
        ]

        for (const prayer of prayerTimes) {
          const diff = prayer.minutes - currentMinutes
          // Notify 10 minutes before prayer
          if (diff >= 5 && diff <= 10) {
            const today = new Date().toDateString()
            const id = `prayer-${prayer.name}-${today}`
            if (!dismissedToday.has(id) && !checkedRef.current.prayer) {
              checkedRef.current.prayer = true
              showNotification({
                id,
                type: "prayer",
                title: `صلاة ${prayer.name}`,
                message: `متبقي ${diff} دقائق على صلاة ${prayer.name}`,
                icon: Clock,
                color: "bg-emerald-600",
              })
              setTimeout(
                () => {
                  checkedRef.current.prayer = false
                },
                15 * 60 * 1000,
              )
            }
            break
          }
        }
      } catch {
        // Error checking prayer times
      }
    }

    checkPrayerTime()
    const interval = setInterval(checkPrayerTime, 60000)
    return () => clearInterval(interval)
  }, [isLiveMode, showNotification, dismissedToday])

  // Check for religious events
  useEffect(() => {
    const checkEvents = () => {
      const now = new Date()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const today = now.toDateString()

      // Friday reminder
      if (now.getDay() === 5 && now.getHours() >= 10 && now.getHours() < 12) {
        const id = `friday-${today}`
        if (!dismissedToday.has(id)) {
          showNotification({
            id,
            type: "event",
            title: "يوم الجمعة المبارك",
            message: "لا تنسَ قراءة سورة الكهف والإكثار من الصلاة على النبي ﷺ",
            icon: Calendar,
            color: "bg-emerald-600",
          })
        }
      }

      // Ramadan (approximate - March/April)
      if ((month === 3 && day >= 10) || (month === 4 && day <= 10)) {
        const id = `ramadan-${today}`
        if (!dismissedToday.has(id) && now.getHours() === 15) {
          showNotification({
            id,
            type: "event",
            title: "رمضان كريم",
            message: "شهر رمضان المبارك - اغتنم كل لحظة بالعبادة",
            icon: Calendar,
            color: "bg-purple-600",
          })
        }
      }
    }

    checkEvents()
    const interval = setInterval(checkEvents, 3600000) // Check every hour
    return () => clearInterval(interval)
  }, [showNotification, dismissedToday])

  return (
    <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 space-y-3">
      <AnimatePresence mode="sync">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className={`h-1 ${notification.color}`} />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${notification.color} flex items-center justify-center flex-shrink-0`}
                >
                  <notification.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-foreground">{notification.title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mr-1"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
              </div>

              {/* Action buttons based on type */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                {notification.type.startsWith("azkar") && (
                  <Button
                    size="sm"
                    className={`flex-1 ${notification.color} hover:opacity-90 text-white`}
                    onClick={() => {
                      window.location.hash = "#azkar"
                      dismissNotification(notification.id)
                    }}
                  >
                    ابدأ الأذكار
                  </Button>
                )}
                {notification.type === "prayer" && (
                  <Button
                    size="sm"
                    className={`flex-1 ${notification.color} hover:opacity-90 text-white`}
                    onClick={() => {
                      window.location.hash = "#prayer-times"
                      dismissNotification(notification.id)
                    }}
                  >
                    عرض المواقيت
                  </Button>
                )}
                {notification.type === "event" && (
                  <Button
                    size="sm"
                    className={`flex-1 ${notification.color} hover:opacity-90 text-white`}
                    onClick={() => {
                      window.location.hash = "#player"
                      dismissNotification(notification.id)
                    }}
                  >
                    استمع للقرآن
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="bg-transparent"
                >
                  لاحقاً
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
