/**
 * User Preferences Management with localStorage
 * Provides type-safe utilities for storing and retrieving user settings
 */

export interface UserPreferences {
  volume: number;
  theme: "system" | "light" | "dark";
  notificationsEnabled: boolean;
  notificationTimeBefore: number; // minutes before prayer time
  lastPrayerTimesCache?: {
    data: string;
    timestamp: number;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  volume: 70,
  theme: "system",
  notificationsEnabled: false,
  notificationTimeBefore: 10,
};

const STORAGE_KEY = "cairo_quran_station_preferences";
const PRAYER_CACHE_KEY = "cairo_quran_station_prayer_cache";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all user preferences
 */
export function getPreferences(): UserPreferences {
  if (!isLocalStorageAvailable()) return DEFAULT_PREFERENCES;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (error) {
    console.error("Error reading preferences:", error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save all user preferences
 */
export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving preferences:", error);
  }
}

/**
 * Get a single preference value
 */
export function getPreference<K extends keyof UserPreferences>(
  key: K
): UserPreferences[K] {
  return getPreferences()[key];
}

/**
 * Save a single preference value
 */
export function savePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  savePreferences({ [key]: value });
}

/**
 * Reset all preferences to defaults
 */
export function resetPreferences(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error resetting preferences:", error);
  }
}

/**
 * Cache prayer times data with TTL
 */
export function cachePrayerTimes(data: unknown): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const cache = {
      data: JSON.stringify(data),
      timestamp: Date.now(),
    };
    localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error caching prayer times:", error);
  }
}

/**
 * Get cached prayer times if not expired
 */
export function getCachedPrayerTimes(): unknown | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const cached = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > CACHE_TTL) {
      localStorage.removeItem(PRAYER_CACHE_KEY);
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading cached prayer times:", error);
    return null;
  }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  getCachedPrayerTimes(); // This will auto-remove if expired
}
