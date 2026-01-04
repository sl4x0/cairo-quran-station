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
}

const PrayerContext = createContext<PrayerContextType>({
  prayerTimes: null,
  isLoading: true,
});

export function PrayerProvider({ children }: { children: ReactNode }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      // Try to load from cache first
      const cached = getCachedPrayerTimes();
      if (cached && typeof cached === "object" && "timings" in cached) {
        setPrayerTimes(cached.timings as PrayerTimings);
        setIsLoading(false);
        return;
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
          // Cache the full response for 24 hours
          cachePrayerTimes(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch prayer times, using fallback:", error);
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
    () => ({ prayerTimes, isLoading }),
    [prayerTimes, isLoading]
  );

  return (
    <PrayerContext.Provider value={value}>{children}</PrayerContext.Provider>
  );
}

export function usePrayerContext() {
  return useContext(PrayerContext);
}
