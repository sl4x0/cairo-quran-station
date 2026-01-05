"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { retryWithBackoff, fetchWithTimeout } from "@/lib/api-utils";
import { cachePrayerTimes, getCachedPrayerTimes } from "@/lib/preferences";

interface PrayerTimings {
  Fajr: string;
  Sunrise?: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerContextType {
  prayerTimes: PrayerTimings | null;
  isLoading: boolean;
  isUsingFallback: boolean;
  error?: string | null;
}

const PrayerContext = createContext<PrayerContextType>({
  prayerTimes: null,
  isLoading: true,
  isUsingFallback: false,
  error: null,
});

export function PrayerProvider({ children }: { children: ReactNode }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      // Try to load from cache first
      const cached = getCachedPrayerTimes();
      if (
        cached &&
        typeof cached === "object" &&
        "timings" in cached &&
        cached.timings &&
        typeof cached.timings === "object"
      ) {
        const timings = cached.timings as PrayerTimings;
        // Validate that we have the required prayer times
        if (timings.Fajr && timings.Dhuhr && timings.Asr && timings.Maghrib && timings.Isha) {
          setPrayerTimes(timings);
          setIsLoading(false);
          return;
        }
      }

      try {
        const data = await retryWithBackoff(
          async () => {
            const response = await fetchWithTimeout(
              "https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5",
              {},
              10000
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          },
          3,
          1000
        );

        if (data.data && data.data.timings) {
          setPrayerTimes(data.data.timings);
          setIsUsingFallback(false);
          setError(null);
          // Cache the full response for 24 hours
          cachePrayerTimes(data.data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Failed to fetch prayer times, using fallback:", err);
        setError(message);
        setIsUsingFallback(true);
        setPrayerTimes({
          Fajr: "04:30",
          Sunrise: "06:00",
          Dhuhr: "12:00",
          Asr: "15:15",
          Maghrib: "17:45",
          Isha: "19:15",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrayerTimes();
    // Refresh prayer times every 24 hours
    const interval = setInterval(fetchPrayerTimes, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({ prayerTimes, isLoading, isUsingFallback, error }),
    [prayerTimes, isLoading, isUsingFallback, error]
  );

  return (
    <PrayerContext.Provider value={value}>{children}</PrayerContext.Provider>
  );
}

export function usePrayerContext() {
  return useContext(PrayerContext);
}
