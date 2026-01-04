"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toArabicNum } from "@/lib/arabic-numerals";
import { useMounted } from "@/hooks/use-mounted";
import { retryWithBackoff, fetchWithTimeout } from "@/lib/api-utils";

interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { ar: string };
  month: { ar: string };
  year: string;
}

interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: { ar: string };
  month: { number: string; ar: string };
  year: string;
}

interface PrayerData {
  timings: PrayerTimings;
  date: {
    hijri: HijriDate;
    gregorian: GregorianDate;
  };
}

const PRAYER_NAMES = [
  { en: "Fajr", ar: "الفجر", key: "Fajr" },
  { en: "Dhuhr", ar: "الظهر", key: "Dhuhr" },
  { en: "Asr", ar: "العصر", key: "Asr" },
  { en: "Maghrib", ar: "المغرب", key: "Maghrib" },
  { en: "Isha", ar: "العشاء", key: "Isha" },
] as const;

export function PrayerTimes() {
  const mounted = useMounted();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [prayerData, setPrayerData] = useState<PrayerTimings | null>(null);
  const [hijriDate, setHijriDate] = useState<string>("");
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    key: string;
    time: string;
  } | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
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
          setPrayerData(data.data.timings);
          const hijri = data.data.date.hijri;
          const gregorian = data.data.date.gregorian;
          setHijriDate(
            `${toArabicNum(hijri.day)} ${hijri.month.ar} ${toArabicNum(
              hijri.year
            )}`
          );
          setGregorianDate(
            `${toArabicNum(gregorian.day)}-${toArabicNum(
              gregorian.month.number
            )}-${toArabicNum(gregorian.year)}`
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch prayer times after retries, using fallback:",
          error
        );
        setPrayerData({
          Fajr: "04:30",
          Dhuhr: "12:00",
          Asr: "15:15",
          Maghrib: "17:45",
          Isha: "19:15",
        });
        const now = new Date();
        setHijriDate(`${toArabicNum(now.getDate())} شوال ${toArabicNum(1446)}`);
        setGregorianDate(
          `${toArabicNum(now.getDate())}-${toArabicNum(
            now.getMonth() + 1
          )}-${toArabicNum(now.getFullYear())}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (!prayerData || !mounted) return;

    const calculateNextPrayer = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTimeInSeconds =
        currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      const prayerTimes = PRAYER_NAMES.map((prayer) => {
        const time = prayerData[prayer.key as keyof PrayerTimings];
        const [hours, minutes] = time.split(":").map(Number);
        return {
          name: prayer.ar,
          key: prayer.key,
          time: time,
          timeInSeconds: hours * 3600 + minutes * 60,
        };
      });

      let next = prayerTimes.find(
        (prayer) => prayer.timeInSeconds > currentTimeInSeconds
      );

      if (!next) {
        next = prayerTimes[0];
      }

      setNextPrayer(next);

      const timeUntilNext =
        next.timeInSeconds > currentTimeInSeconds
          ? next.timeInSeconds - currentTimeInSeconds
          : 86400 - currentTimeInSeconds + next.timeInSeconds;

      const hours = Math.floor(timeUntilNext / 3600);
      const minutes = Math.floor((timeUntilNext % 3600) / 60);
      const seconds = timeUntilNext % 60;

      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      setCountdown(toArabicNum(formattedTime));
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 1000);

    return () => clearInterval(interval);
  }, [prayerData, mounted]);

  // Auto-scroll to active prayer on mobile
  useEffect(() => {
    if (!nextPrayer || !scrollContainerRef.current || !mounted) return;

    const scrollToActive = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const activeCard = container.querySelector('[data-active="true"]');
      if (activeCard) {
        activeCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    };

    // Delay scroll to allow animations to complete
    const timeout = setTimeout(scrollToActive, 2500);
    return () => clearTimeout(timeout);
  }, [nextPrayer, mounted]);

  if (!mounted) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-6 md:mt-8 px-4 md:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-12 w-64 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 w-32 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-6 md:mt-8 px-4 md:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-12 w-64 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 w-32 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!prayerData || !nextPrayer) return null;

  return (
    <motion.div
      className="w-full"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 elegant-shadow">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          role="region"
          aria-label="التاريخ الهجري والميلادي"
        >
          {/* Hijri date first (Islamic calendar priority) */}
          <div className="glass-panel px-5 py-2.5 rounded-full border border-emerald-500/30 elegant-shadow-teal">
            <span className="text-base md:text-lg text-emerald-300 font-readex font-semibold drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
              {hijriDate}
            </span>
          </div>
          {/* Gregorian date second */}
          <div className="glass-panel px-4 py-2 rounded-full border border-white/10">
            <span className="text-sm md:text-base text-muted-foreground font-readex">
              {gregorianDate}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          role="timer"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`الوقت المتبقي حتى صلاة ${nextPrayer.name}`}
        >
          <div className="glass-panel px-4 sm:px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl elegant-shadow border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-transparent w-full max-w-md md:max-w-none">
            <div className="flex flex-col gap-3 items-center">
              <div className="flex items-center gap-2 text-center flex-wrap justify-center">
                <span className="text-xs sm:text-sm md:text-base text-foreground/70 whitespace-nowrap font-medium">
                  الوقت المتبقي حتى صلاة
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  {nextPrayer.name}
                </span>
              </div>
              <div className="glass-panel px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-primary/30 bg-black/30">
                <span className="text-xl sm:text-2xl md:text-4xl font-bold text-primary tracking-widest font-orbitron tabular-nums drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]">
                  {countdown}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div
          className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6"
          dir="rtl"
          role="list"
          aria-label="مواقيت الصلاة"
        >
          {PRAYER_NAMES.map((prayer, index) => {
            const isNext = nextPrayer.key === prayer.key;
            const time = prayerData[prayer.key as keyof PrayerTimings];

            return (
              <motion.div
                key={prayer.key}
                className={`bg-black/30 backdrop-blur-xl rounded-2xl p-6 h-40 transition-all duration-300 ${
                  isNext
                    ? "border-2 border-primary elegant-shadow bg-gradient-to-br from-primary/10 to-transparent shadow-lg"
                    : "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
                initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                role="listitem"
                aria-label={`صلاة ${prayer.ar} الساعة ${time}`}
              >
                <div className="flex flex-col items-center justify-center gap-4 h-full">
                  <span
                    className={`text-2xl lg:text-3xl font-bold font-readex ${
                      isNext
                        ? "text-primary drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                        : "text-foreground"
                    }`}
                  >
                    {prayer.ar}
                  </span>
                  <div
                    className={`glass-panel px-5 py-2.5 rounded-xl ${
                      isNext
                        ? "bg-primary/20 border-2 border-primary/40"
                        : "border border-white/20"
                    }`}
                  >
                    <span
                      className={`font-orbitron text-xl lg:text-2xl font-bold tracking-wider tabular-nums ${
                        isNext
                          ? "text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          : "text-foreground/90"
                      }`}
                    >
                      {toArabicNum(time)}
                    </span>
                  </div>
                  {isNext && (
                    <motion.div
                      className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div
          className="md:hidden relative -mx-2 overscroll-x-contain"
          dir="rtl"
          role="region"
          aria-label="مواقيت الصلاة - اسحب لليسار لعرض جميع الصلوات"
        >
          {/* Scroll indicator - right side (start) - stronger gradient */}
          <div
            className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-l from-transparent via-black/30 to-black/50 pointer-events-none z-10 rounded-r-2xl"
            aria-hidden="true"
          />
          {/* Scroll indicator - left side (end) - stronger gradient */}
          <div
            className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-r from-transparent via-black/30 to-black/50 pointer-events-none z-10 rounded-l-2xl"
            aria-hidden="true"
          />

          {/* Swipe hint - animated chevron */}
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-20"
            initial={{ opacity: 0.8, x: 0 }}
            animate={{ opacity: [0.8, 0.3, 0.8], x: [0, -10, 0] }}
            transition={{ duration: 2, repeat: 3, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <svg
              className="w-6 h-6 text-primary/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.div>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 touch-pan-x"
          >
            {PRAYER_NAMES.map((prayer, index) => {
              const isNext = nextPrayer.key === prayer.key;
              const time = prayerData[prayer.key as keyof PrayerTimings];

              return (
                <motion.div
                  key={prayer.key}
                  data-active={isNext ? "true" : "false"}
                  className={`bg-black/30 backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 flex-shrink-0 snap-center w-[150px] min-h-[140px] active:scale-95 ${
                    isNext
                      ? "border-2 border-primary elegant-shadow bg-gradient-to-br from-primary/10 to-transparent shadow-lg"
                      : "border border-white/10 bg-white/5"
                  }`}
                  initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                  role="listitem"
                  aria-label={`صلاة ${prayer.ar} الساعة ${time}`}
                >
                  <div className="flex flex-col items-center gap-3.5">
                    <span
                      className={`text-xl font-bold font-readex ${
                        isNext
                          ? "text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                          : "text-foreground"
                      }`}
                    >
                      {prayer.ar}
                    </span>
                    <div
                      className={`glass-panel px-4 py-2.5 rounded-xl ${
                        isNext
                          ? "bg-primary/20 border-2 border-primary/40"
                          : "border border-white/20"
                      }`}
                    >
                      <span
                        className={`font-orbitron text-lg font-bold tracking-wider tabular-nums ${
                          isNext
                            ? "text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            : "text-foreground/90"
                        }`}
                      >
                        {toArabicNum(time)}
                      </span>
                    </div>
                    {isNext && (
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
