"use client"

/**
 * User Preferences Storage Utility
 * Centralized localStorage management with type-safe getters/setters
 */

const STORAGE_KEYS = {
  // Azkar
  AZKAR_MORNING_COUNTS: "azkar-morning-counts",
  AZKAR_EVENING_COUNTS: "azkar-evening-counts",
  AZKAR_MORNING_COMPLETED_DATE: "azkar-morning-completed-date",
  AZKAR_EVENING_COMPLETED_DATE: "azkar-evening-completed-date",

  // Tasbih
  TASBIH_COUNTS: "tasbih-counts",
  TASBIH_TOTAL: "tasbih-total",
  TASBIH_TARGET: "tasbih-target",
  TASBIH_SOUND: "tasbih-sound",
  TASBIH_SELECTED: "tasbih-selected",

  // Player
  PLAYER_VOLUME: "player-volume",
  PLAYER_STATION: "player-station",

  // Theme
  THEME: "theme",

  // Notifications
  NOTIFICATION_PERMISSION: "notification-permission",
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]
}

/**
 * Get value from localStorage with JSON parsing
 */
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Set value in localStorage with JSON stringification
 */
export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: StorageKey): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage unavailable
  }
}

// ==================== AZKAR ====================

export interface AzkarState {
  counts: Record<string, number>
  completedDate: string | null
}

export function getAzkarState(type: "morning" | "evening"): AzkarState {
  const countsKey = type === "morning"
    ? STORAGE_KEYS.AZKAR_MORNING_COUNTS
    : STORAGE_KEYS.AZKAR_EVENING_COUNTS
  const dateKey = type === "morning"
    ? STORAGE_KEYS.AZKAR_MORNING_COMPLETED_DATE
    : STORAGE_KEYS.AZKAR_EVENING_COMPLETED_DATE

  return {
    counts: getStorageItem<Record<string, number>>(countsKey, {}),
    completedDate: getStorageItem<string | null>(dateKey, null),
  }
}

export function saveAzkarState(type: "morning" | "evening", counts: Record<string, number>, isComplete: boolean): void {
  const countsKey = type === "morning"
    ? STORAGE_KEYS.AZKAR_MORNING_COUNTS
    : STORAGE_KEYS.AZKAR_EVENING_COUNTS
  const dateKey = type === "morning"
    ? STORAGE_KEYS.AZKAR_MORNING_COMPLETED_DATE
    : STORAGE_KEYS.AZKAR_EVENING_COMPLETED_DATE

  setStorageItem(countsKey, counts)
  if (isComplete) {
    setStorageItem(dateKey, getTodayDateString())
  }
}

export function isAzkarCompletedToday(type: "morning" | "evening"): boolean {
  const state = getAzkarState(type)
  return state.completedDate === getTodayDateString()
}

export function resetAzkarState(type: "morning" | "evening"): void {
  const countsKey = type === "morning"
    ? STORAGE_KEYS.AZKAR_MORNING_COUNTS
    : STORAGE_KEYS.AZKAR_EVENING_COUNTS
  const dateKey = type === "morning"
    ? STORAGE_KEYS.AZKAR_MORNING_COMPLETED_DATE
    : STORAGE_KEYS.AZKAR_EVENING_COMPLETED_DATE

  removeStorageItem(countsKey)
  removeStorageItem(dateKey)
}

// ==================== TASBIH ====================

export interface TasbihState {
  counts: Record<string, number>
  total: number
  target: number
  soundEnabled: boolean
  selectedId: string
}

export function getTasbihState(): TasbihState {
  return {
    counts: getStorageItem<Record<string, number>>(STORAGE_KEYS.TASBIH_COUNTS, {}),
    total: getStorageItem<number>(STORAGE_KEYS.TASBIH_TOTAL, 0),
    target: getStorageItem<number>(STORAGE_KEYS.TASBIH_TARGET, 33),
    soundEnabled: getStorageItem<boolean>(STORAGE_KEYS.TASBIH_SOUND, true),
    selectedId: getStorageItem<string>(STORAGE_KEYS.TASBIH_SELECTED, "subhanallah"),
  }
}

export function saveTasbihCount(dhikrId: string, count: number): void {
  const counts = getStorageItem<Record<string, number>>(STORAGE_KEYS.TASBIH_COUNTS, {})
  counts[dhikrId] = count
  setStorageItem(STORAGE_KEYS.TASBIH_COUNTS, counts)
}

export function saveTasbihTotal(total: number): void {
  setStorageItem(STORAGE_KEYS.TASBIH_TOTAL, total)
}

export function saveTasbihPreferences(target: number, soundEnabled: boolean, selectedId: string): void {
  setStorageItem(STORAGE_KEYS.TASBIH_TARGET, target)
  setStorageItem(STORAGE_KEYS.TASBIH_SOUND, soundEnabled)
  setStorageItem(STORAGE_KEYS.TASBIH_SELECTED, selectedId)
}

// ==================== PLAYER ====================

export function getPlayerVolume(): number {
  return getStorageItem<number>(STORAGE_KEYS.PLAYER_VOLUME, 80)
}

export function savePlayerVolume(volume: number): void {
  setStorageItem(STORAGE_KEYS.PLAYER_VOLUME, volume)
}

export function getPlayerStation(): string {
  return getStorageItem<string>(STORAGE_KEYS.PLAYER_STATION, "cairo")
}

export function savePlayerStation(stationId: string): void {
  setStorageItem(STORAGE_KEYS.PLAYER_STATION, stationId)
}
