"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type PrayerPeriod = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"

interface ThemeContextType {
  prayerPeriod: PrayerPeriod
  periodName: string
  colors: ThemeColors
}

interface ThemeColors {
  gradient: string
  gradientRGB: string
  textPrimary: string
  textSecondary: string
  isDarkPeriod: boolean
  accentColor: string
  cardBg: string
}

const periodColors: Record<PrayerPeriod, ThemeColors> = {
  fajr: {
    gradient: "from-indigo-900 via-purple-900 to-slate-900",
    gradientRGB: "30, 27, 75",
    textPrimary: "text-amber-100",
    textSecondary: "text-slate-300",
    isDarkPeriod: true,
    accentColor: "bg-amber-500",
    cardBg: "bg-slate-900/50",
  },
  sunrise: {
    gradient: "from-orange-400 via-amber-300 to-yellow-200",
    gradientRGB: "251, 191, 36",
    textPrimary: "text-emerald-900",
    textSecondary: "text-emerald-800",
    isDarkPeriod: false,
    accentColor: "bg-orange-500",
    cardBg: "bg-white/70",
  },
  dhuhr: {
    gradient: "from-sky-300 via-blue-200 to-cyan-100",
    gradientRGB: "125, 211, 252",
    textPrimary: "text-emerald-900",
    textSecondary: "text-emerald-700",
    isDarkPeriod: false,
    accentColor: "bg-emerald-600",
    cardBg: "bg-white/80",
  },
  asr: {
    gradient: "from-amber-300 via-orange-200 to-yellow-100",
    gradientRGB: "252, 211, 77",
    textPrimary: "text-emerald-900",
    textSecondary: "text-emerald-700",
    isDarkPeriod: false,
    accentColor: "bg-amber-600",
    cardBg: "bg-white/70",
  },
  maghrib: {
    gradient: "from-orange-600 via-rose-500 to-purple-700",
    gradientRGB: "234, 88, 12",
    textPrimary: "text-white",
    textSecondary: "text-orange-100",
    isDarkPeriod: true,
    accentColor: "bg-rose-500",
    cardBg: "bg-purple-900/50",
  },
  isha: {
    gradient: "from-slate-900 via-indigo-950 to-slate-950",
    gradientRGB: "15, 23, 42",
    textPrimary: "text-amber-100",
    textSecondary: "text-slate-300",
    isDarkPeriod: true,
    accentColor: "bg-amber-500",
    cardBg: "bg-slate-900/60",
  },
}

const periodNames: Record<PrayerPeriod, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
}

function getCurrentPrayerPeriod(): PrayerPeriod {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 6) return "fajr"
  if (hour >= 6 && hour < 7) return "sunrise"
  if (hour >= 7 && hour < 15) return "dhuhr"
  if (hour >= 15 && hour < 17) return "asr"
  if (hour >= 17 && hour < 19) return "maghrib"
  return "isha"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [prayerPeriod, setPrayerPeriod] = useState<PrayerPeriod>("dhuhr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPrayerPeriod(getCurrentPrayerPeriod())

    // Update every minute
    const interval = setInterval(() => {
      setPrayerPeriod(getCurrentPrayerPeriod())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const colors = periodColors[prayerPeriod]

    if (colors.isDarkPeriod) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [prayerPeriod, mounted])

  const colors = periodColors[prayerPeriod]
  const periodName = periodNames[prayerPeriod]

  return <ThemeContext.Provider value={{ prayerPeriod, periodName, colors }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
