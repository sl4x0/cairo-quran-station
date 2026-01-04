"use client";
import { PlayerCard } from "@/components/player-card";
import type React from "react";

import { motion } from "framer-motion";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Footer } from "@/components/footer";
import { Toast } from "@/components/toast";
import { InfoModal } from "@/components/info-modal";
import { PreferencesModal } from "@/components/preferences-modal";
import { FridayCard } from "@/components/friday-card";
import { AlKahfModal } from "@/components/alkahf-modal";
import { Header } from "@/components/header";
import { toArabicNum } from "@/lib/arabic-numerals";
import { getTimePhase, getPhaseConfig } from "@/lib/time-phase";
import { usePrayerContext } from "@/contexts/prayer-context";
import { usePrayerNotifications } from "@/hooks/use-prayer-notifications";
import { getPreference, savePreference } from "@/lib/preferences";

// Lazy load non-critical components
const AyahOfTheDay = lazy(() =>
  import("@/components/ayah-of-the-day").then((mod) => ({
    default: mod.AyahOfTheDay,
  }))
);
const PrayerTimes = lazy(() =>
  import("@/components/prayer-times").then((mod) => ({
    default: mod.PrayerTimes,
  }))
);

const STREAM_URL = "https://n01.radiojar.com/8s5u5tpdtwzuv";

export default function Home() {
  const { prayerTimes } = usePrayerContext();
  const { requestPermission } = usePrayerNotifications(prayerTimes);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(() => getPreference("volume"));
  const [previousVolume, setPreviousVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [isFriday, setIsFriday] = useState(false);
  const [showAlKahfModal, setShowAlKahfModal] = useState(false);
  const [timePhase, setTimePhase] = useState<
    "dawn" | "day" | "sunset" | "night"
  >("night");
  const [phaseConfig, setPhaseConfig] = useState(getPhaseConfig("night"));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // schedule to avoid setState in effect synchronous warning
      const timeoutId = window.setTimeout(() => {
        setPrefersReducedMotion(
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
      }, 0);

      // no-op resize handler when we aren't tracking windowWidth
      const handleResize = () => {};
      window.addEventListener("resize", handleResize);

      // Detect data-saver / low power conditions and add 'low-power' class to <html>
      const applyLowPower = (isLow: boolean) => {
        if (isLow) document.documentElement.classList.add("low-power");
        else document.documentElement.classList.remove("low-power");
      };

      // Connection.saveData detection
      const conn = (
        navigator as {
          connection?: {
            saveData: boolean;
            addEventListener: (event: string, handler: () => void) => void;
          };
        }
      ).connection;
      if (conn && typeof conn.saveData === "boolean") {
        applyLowPower(conn.saveData === true);
        try {
          conn.addEventListener("change", () =>
            applyLowPower(conn.saveData === true)
          );
        } catch {}
      } else if (
        (navigator as { getBattery?: () => Promise<unknown> }).getBattery
      ) {
        // Fallback: use battery level as a heuristic for low-power
        const mounted = true;
        (navigator as { getBattery: () => Promise<unknown> })
          .getBattery()
          .then((battery: unknown) => {
            const bat = battery as {
              level: number;
              addEventListener: (event: string, handler: () => void) => void;
            };
            if (!mounted) return;
            applyLowPower(bat.level < 0.25);
            try {
              bat.addEventListener("levelchange", () =>
                applyLowPower(bat.level < 0.25)
              );
            } catch {}
          });
        // return cleanup in outer effect's cleanup below
        // (we'll still clear the timeout and event listener as before)
        setTimeout(() => {}, 0);
      }

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    const updatePhase = () => {
      if (!prayerTimes) return;
      const phase = getTimePhase(prayerTimes);
      setTimePhase(phase);
      setPhaseConfig(getPhaseConfig(phase));
    };

    updatePhase();
    const interval = setInterval(updatePhase, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  useEffect(() => {
    // schedule to avoid setState in effect synchronous warning
    const timeoutId = window.setTimeout(() => {
      const today = new Date().getDay();
      setIsFriday(today === 5);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const shadowClass = isFriday ? "elegant-shadow-emerald" : "elegant-shadow";
  const bgGradientClass = isFriday ? "from-emerald-500/10" : "from-primary/10";

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        setIsBuffering(true);
        await audio.play();
        // Request notification permission on first play
        requestPermission();
      }
    } catch (error) {
      console.error("Playback error:", error);
      setShowErrorToast(true);
      setIsPlaying(false);
      setIsBuffering(false);
    }
  }, [isPlaying, requestPermission]);

  const handleVolumeChange = useCallback(
    (newValue: number[]) => {
      const newVolume = newValue[0];
      setVolume(newVolume);
      savePreference("volume", newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      } else if (newVolume === 0) {
        setIsMuted(true);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      const restoreVolume = previousVolume || 70;
      setVolume(restoreVolume);
      if (audioRef.current) {
        audioRef.current.volume = restoreVolume / 100;
      }
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  }, [isMuted, volume, previousVolume]);

  // Keyboard controls - Space for play/pause, Arrow Up/Down for volume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target === document.body ||
        (e.target as HTMLElement).tagName === "BUTTON"
      ) {
        if (e.code === "Space") {
          e.preventDefault();
          togglePlay();
        } else if (e.code === "ArrowUp") {
          e.preventDefault();
          const newVolume = Math.min(volume + 5, 100);
          handleVolumeChange([newVolume]);
        } else if (e.code === "ArrowDown") {
          e.preventDefault();
          const newVolume = Math.max(volume - 5, 0);
          handleVolumeChange([newVolume]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, volume, handleVolumeChange, togglePlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    const handleError = () => {
      console.error("Stream error occurred");
      setShowErrorToast(true);
      setIsPlaying(false);
      setIsBuffering(false);

      setTimeout(() => {
        if (audio) {
          audio.load();
          audio.play().catch((err) => {
            console.error("Auto-retry failed:", err);
          });
        }
        setShowErrorToast(false);
      }, 3000);
    };

    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    const currentTogglePlay = togglePlay;

    if (!("mediaSession" in navigator)) return;

    // Get current Hijri year for album metadata
    const hijriYear = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      year: "numeric",
    }).format(new Date());

    // Set rich metadata for lock screen display
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "إذاعة القرآن الكريم",
      artist: "بث مباشر - القاهرة",
      album: `${hijriYear} هـ - Live Radio`,
      artwork: [
        { src: "/opengraph-image", sizes: "96x96", type: "image/png" },
        { src: "/opengraph-image", sizes: "128x128", type: "image/png" },
        { src: "/opengraph-image", sizes: "192x192", type: "image/png" },
        { src: "/opengraph-image", sizes: "256x256", type: "image/png" },
        { src: "/opengraph-image", sizes: "384x384", type: "image/png" },
        { src: "/opengraph-image", sizes: "512x512", type: "image/png" },
      ],
    });

    // Set action handlers for hardware controls
    navigator.mediaSession.setActionHandler("play", () => {
      if (!isPlaying) currentTogglePlay();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (isPlaying) currentTogglePlay();
    });

    navigator.mediaSession.setActionHandler("stop", () => {
      if (isPlaying) currentTogglePlay();
    });

    // Disable seek controls for live radio (prevents lag/issues)
    navigator.mediaSession.setActionHandler("seekbackward", null);
    navigator.mediaSession.setActionHandler("seekforward", null);
    navigator.mediaSession.setActionHandler("seekto", null);
  }, [isPlaying, togglePlay]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-x-hidden"
      dir="rtl"
    >
      <audio ref={audioRef} src={STREAM_URL} preload="none" />

      <Toast
        show={showErrorToast}
        message="⚠️ انقطع الاتصال. إعادة المحاولة..."
      />

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        isFriday={isFriday}
        timePhase={timePhase}
        phaseConfig={phaseConfig}
      />

      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onVolumeChange={(vol) => handleVolumeChange([vol])}
        currentVolume={volume}
      />

      <AlKahfModal
        isOpen={showAlKahfModal}
        onClose={() => setShowAlKahfModal(false)}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-all duration-200 ${phaseConfig.bgClass}`}
        />
        <motion.div
          className={`absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial ${bgGradientClass} via-transparent to-transparent rounded-full blur-3xl opacity-20`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 20,
            repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-secondary/10 via-transparent to-transparent rounded-full blur-3xl opacity-15"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 25,
            repeat: prefersReducedMotion ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 glass-button px-6 py-3 rounded-full text-foreground font-bold focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        انتقل إلى المحتوى الرئيسي
      </a>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-8 relative z-10">
        <Header
          isFriday={isFriday}
          timePhase={timePhase}
          phaseConfig={phaseConfig}
          onInfoClick={() => setShowInfoModal(true)}
          showInfoModal={showInfoModal}
        />

        <div className="space-y-8">
          {/* Top Section: Player and Prayer Times side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Player Column */}
            <div className="col-span-1 lg:col-span-5">
              <motion.section
                ref={playerSectionRef}
                className="h-fit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  duration: prefersReducedMotion ? 0 : 0.8,
                }}
                role="region"
                aria-label="مشغل البث المباشر"
              >
                <div className="w-full">
                  <motion.div
                    className={`relative flex flex-col h-full min-h-[420px] sm:min-h-[420px] justify-between bg-black/30 backdrop-blur-3xl border-2 border-white/10 rounded-3xl md:rounded-[3rem] overflow-hidden ${shadowClass} shadow-2xl`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  >
                    <PlayerCard
                      isPlaying={isPlaying}
                      isBuffering={isBuffering}
                      isMuted={isMuted}
                      volume={volume}
                      onTogglePlay={togglePlay}
                      onToggleMute={toggleMute}
                      onOpenPreferences={() => setShowPreferencesModal(true)}
                    />

                    {/* Location and Frequency Badges - Enhanced (kept for layout parity) */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap px-4 pb-4 mt-6">
                      <motion.div
                        className="glass-panel px-4 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-full border-2 border-secondary/40 elegant-shadow-teal min-h-[44px] bg-gradient-to-br from-secondary/10 to-transparent"
                        whileHover={{
                          scale: prefersReducedMotion ? 1 : 1.05,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-readex text-lg md:text-xl font-bold text-secondary tracking-wide drop-shadow-[0_0_12px_rgba(13,148,136,0.6)]">
                          القاهرة
                        </span>
                      </motion.div>
                      <motion.div
                        className="glass-panel px-4 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-full border-2 border-primary/40 elegant-shadow min-h-[44px] bg-gradient-to-br from-primary/10 to-transparent"
                        whileHover={{
                          scale: prefersReducedMotion ? 1 : 1.05,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-orbitron text-base md:text-lg font-bold text-primary tracking-wider drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] tabular-nums">
                          {toArabicNum("98.2")} :التردد
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.section>
            </div>

            {/* Prayer Times Column */}
            <div className="col-span-1 lg:col-span-7">
              <div className="flex flex-col gap-8">
                {isFriday && (
                  <FridayCard onReadAlKahf={() => setShowAlKahfModal(true)} />
                )}

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: prefersReducedMotion ? 0 : 0.8,
                  }}
                  role="region"
                  aria-label="مواقيت الصلاة"
                >
                  <Suspense
                    fallback={
                      <div className="glass-panel rounded-3xl p-6 border-2 border-primary/20 animate-pulse">
                        <div className="h-8 bg-primary/10 rounded mb-4 w-1/3" />
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="h-12 bg-primary/5 rounded"
                            />
                          ))}
                        </div>
                      </div>
                    }
                  >
                    <PrayerTimes />
                  </Suspense>
                </motion.section>
              </div>
            </div>
          </div>

          {/* Ayah Section: Full width, centered below */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: prefersReducedMotion ? 0 : 0.8,
            }}
            role="region"
            aria-label="آية اليوم"
            className="w-full max-w-5xl mx-auto"
          >
            <Suspense
              fallback={
                <div className="glass-panel rounded-3xl p-8 border-2 border-primary/20 animate-pulse">
                  <div className="h-6 bg-primary/10 rounded mb-6 w-1/4 mx-auto" />
                  <div className="space-y-4">
                    <div className="h-20 bg-primary/5 rounded" />
                    <div className="h-6 bg-primary/5 rounded w-3/4 mx-auto" />
                  </div>
                </div>
              }
            >
              <AyahOfTheDay />
            </Suspense>
          </motion.section>
        </div>

        {/* Footer */}
        <div className="mt-12 w-full">
          <Footer />
        </div>
      </div>
    </main>
  );
}
