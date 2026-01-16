/**
 * Hijri Calendar Utility
 * Accurate Islamic date calculation using Umm al-Qura calendar algorithm
 */

/**
 * Convert Gregorian date to Hijri date
 * Uses the Umm al-Qura calendar approximation
 */
export function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  const jd = gregorianToJulian(date)
  return julianToHijri(jd)
}

/**
 * Convert Gregorian date to Julian Day Number
 */
function gregorianToJulian(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

/**
 * Convert Julian Day Number to Hijri date
 */
function julianToHijri(jd: number): { year: number; month: number; day: number } {
  // Hijri epoch in Julian Day
  const hijriEpoch = 1948439.5

  const l = Math.floor(jd - hijriEpoch + 0.5) + 10632
  const n = Math.floor((l - 1) / 10631)
  const l2 = l - 10631 * n + 354
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238)
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29
  const month = Math.floor((24 * l3) / 709)
  const day = l3 - Math.floor((709 * month) / 24)
  const year = 30 * n + j - 30

  return { year, month, day }
}

/**
 * Convert Hijri date to Gregorian date (approximate)
 */
export function hijriToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
  const jd = hijriToJulian(hijriYear, hijriMonth, hijriDay)
  return julianToGregorian(jd)
}

/**
 * Convert Hijri date to Julian Day Number
 */
function hijriToJulian(year: number, month: number, day: number): number {
  const hijriEpoch = 1948439.5
  return day + Math.ceil(29.5 * (month - 1)) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30) + hijriEpoch - 1
}

/**
 * Convert Julian Day Number to Gregorian date
 */
function julianToGregorian(jd: number): Date {
  const z = Math.floor(jd + 0.5)
  const a = Math.floor((z - 1867216.25) / 36524.25)
  const aa = z + 1 + a - Math.floor(a / 4)
  const b = aa + 1524
  const c = Math.floor((b - 122.1) / 365.25)
  const d = Math.floor(365.25 * c)
  const e = Math.floor((b - d) / 30.6001)

  const day = b - d - Math.floor(30.6001 * e)
  const month = e < 14 ? e - 1 : e - 13
  const year = month > 2 ? c - 4716 : c - 4715

  return new Date(year, month - 1, day)
}

/**
 * Get days until next occurrence of a Hijri date
 */
export function daysUntilHijriDate(hijriMonth: number, hijriDay: number): number {
  const today = new Date()
  const todayHijri = gregorianToHijri(today)

  // Calculate the target date in current Hijri year
  let targetYear = todayHijri.year
  let targetDate = hijriToGregorian(targetYear, hijriMonth, hijriDay)

  // If the date has passed this year, use next year
  if (targetDate < today) {
    targetYear++
    targetDate = hijriToGregorian(targetYear, hijriMonth, hijriDay)
  }

  // Calculate difference in days
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * Hijri month names in Arabic
 */
export const HIJRI_MONTHS = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
]

/**
 * Get current Hijri date formatted string
 */
export function getCurrentHijriDateString(): string {
  const hijri = gregorianToHijri(new Date())
  return `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1]} ${hijri.year}`
}
