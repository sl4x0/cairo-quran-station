"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchListenerCount } from "@/lib/api-utils";

interface ListenerData {
  count: number;
  status: "loading" | "connected" | "error" | "fallback";
  lastUpdated: Date | null;
}

const POLL_INTERVAL = 30000; // 30 seconds
const RETRY_DELAY = 5000; // 5 seconds
const MAX_RETRIES = 3;

/**
 * Real-time listener count hook with RadioJar API integration
 *
 * Features:
 * - Real RadioJar API integration for live listener data
 * - Automatic polling every 30 seconds
 * - Exponential backoff retry on failures
 * - Graceful fallback to estimated count when API unavailable
 * - Production-ready error handling
 *
 * Setup:
 * 1. Add NEXT_PUBLIC_RADIOJAR_STATION_ID to .env.local
 * 2. Optional: Add NEXT_PUBLIC_RADIOJAR_API_KEY for authenticated requests
 *
 * The hook returns:
 * - count: Current listener count (real or estimated)
 * - status: Connection status
 * - lastUpdated: Timestamp of last successful update
 */
export function useListeners(): ListenerData {
  const [listenerData, setListenerData] = useState<ListenerData>({
    count: 0,
    status: "loading",
    lastUpdated: null,
  });

  const retryCountRef = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const getEstimatedCount = useCallback((): number => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const cairoHour = (utcHour + 2) % 24;

    // Fajr/Night hours (12 AM - 5 AM): Higher engagement
    if (cairoHour >= 0 && cairoHour < 5)
      return 5800 + Math.floor(Math.random() * 200);
    // Early morning (5 AM - 8 AM): Medium engagement
    if (cairoHour >= 5 && cairoHour < 8)
      return 4200 + Math.floor(Math.random() * 150);
    // Morning (8 AM - 12 PM): Lower engagement
    if (cairoHour >= 8 && cairoHour < 12)
      return 3100 + Math.floor(Math.random() * 100);
    // Afternoon (12 PM - 3 PM): Medium engagement
    if (cairoHour >= 12 && cairoHour < 15)
      return 3800 + Math.floor(Math.random() * 120);
    // Asr to Maghrib (3 PM - 6 PM): Higher engagement
    if (cairoHour >= 15 && cairoHour < 18)
      return 5200 + Math.floor(Math.random() * 180);
    // Evening (6 PM - 9 PM): Peak engagement
    if (cairoHour >= 18 && cairoHour < 21)
      return 6500 + Math.floor(Math.random() * 250);
    // Late evening (9 PM - 12 AM): High engagement
    return 5900 + Math.floor(Math.random() * 200);
  }, []);

  const updateListenerCount = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      const count = await fetchListenerCount();

      if (count !== null && isMountedRef.current) {
        setListenerData({
          count,
          status: "connected",
          lastUpdated: new Date(),
        });
        retryCountRef.current = 0;
      } else if (isMountedRef.current) {
        throw new Error("No listener data received");
      }
    } catch (error) {
      console.warn("Failed to fetch listener count:", error);

      if (!isMountedRef.current) return;

      retryCountRef.current += 1;

      if (retryCountRef.current >= MAX_RETRIES) {
        // Use estimated count after max retries
        setListenerData((prev) => ({
          count: prev.count > 0 ? prev.count : getEstimatedCount(),
          status: "fallback",
          lastUpdated: prev.lastUpdated,
        }));
      } else {
        // Retry with exponential backoff
        setTimeout(() => {
          updateListenerCount();
        }, RETRY_DELAY * retryCountRef.current);
      }
    }
  }, [getEstimatedCount]);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch
    updateListenerCount();

    // Set up polling interval
    pollIntervalRef.current = setInterval(() => {
      updateListenerCount();
    }, POLL_INTERVAL);

    return () => {
      isMountedRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [updateListenerCount]);

  return listenerData;
}
