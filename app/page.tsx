"use client";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import type React from "react";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { AyahOfTheDay } from "@/components/ayah-of-the-day";
import { Footer } from "@/components/footer";
import { Slider } from "@/components/slider";
import { Toast } from "@/components/toast";
import { InfoModal } from "@/components/info-modal";
import { FridayCard } from "@/components/friday-card";
import { AlKahfModal } from "@/components/alkahf-modal";
import { PrayerTimes } from "@/components/prayer-times";
import { Header } from "@/components/header";
import { toArabicNum } from "@/lib/arabic-numerals";
import { getTimePhase, getPhaseConfig } from "@/lib/time-phase";

const STREAM_URL =
  process.env.NEXT_PUBLIC_STREAM_URL ||
  "https://n01.radiojar.com/8s5u5tpdtwzuv";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(70);
  const [previousVolume, setPreviousVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isFriday, setIsFriday] = useState(false);
  const [showAlKahfModal, setShowAlKahfModal] = useState(false);
  const [timePhase, setTimePhase] = useState<
    "dawn" | "day" | "sunset" | "night"
  >("night");
  const [phaseConfig, setPhaseConfig] = useState(getPhaseConfig("night"));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
      setWindowWidth(window.innerWidth);

      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const updatePhase = () => {
      const phase = getTimePhase();
      setTimePhase(phase);
      setPhaseConfig(getPhaseConfig(phase));
    };

    updatePhase();
    const interval = setInterval(updatePhase, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date().getDay();
    setIsFriday(today === 5);
  }, []);

  const accentColor = isFriday ? "emerald" : "primary";
  const glowClass = isFriday ? "glow-emerald" : "glow-gold";
  const borderColorClass = isFriday ? "border-emerald-500" : "border-primary";
  const textColorClass = isFriday ? "text-emerald-400" : "text-primary";
  const bgGradientClass = isFriday ? "from-emerald-500/10" : "from-primary/10";
  const bgClass = isFriday ? "bg-emerald-50" : "bg-primary-50";
  const iconColorClass = isFriday ? "text-emerald-400" : "text-primary";

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        setIsBuffering(true);
        await audio.play();
      }
    } catch (error) {
      console.error("Playback error:", error);
      setShowErrorToast(true);
      setIsPlaying(false);
      setIsBuffering(false);
    }
  };

  const handleVolumeChange = useCallback(
    (newValue: number[]) => {
      const newVolume = newValue[0];
      setVolume(newVolume);
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

  // Keyboard controls - Space for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

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
  }, [isPlaying]);

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
      <AlKahfModal
        isOpen={showAlKahfModal}
        onClose={() => setShowAlKahfModal(false)}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-all duration-[3000ms] ${phaseConfig.bgClass}`}
        />
        <motion.div
          className={`absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial ${bgGradientClass} via-transparent to-transparent rounded-full blur-3xl opacity-20`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
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
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
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
                    className={`relative flex flex-col h-full min-h-[420px] sm:min-h-[450px] md:min-h-[480px] lg:min-h-[450px] justify-between bg-black/30 backdrop-blur-3xl border-2 border-white/10 rounded-3xl md:rounded-[3rem] overflow-hidden ${glowClass} shadow-[0_8px_32px_rgba(0,0,0,0.3)]`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  >
                    {/* Zone A: Visual Stage with Centered Sacred Geometry */}
                    <div className="relative w-full flex items-center justify-center overflow-hidden rounded-t-3xl bg-gradient-to-br from-black/20 via-transparent to-black/20 py-4 sm:py-5 md:py-6">
                      {/* Play Button - Centered */}
                      <div className="relative z-20">
                        <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px]">
                          <motion.button
                            onClick={togglePlay}
                            className={`absolute inset-0 glass-panel rounded-full cursor-pointer group overflow-hidden border-4 ${borderColorClass}/60 focus-visible:ring-4 focus-visible:ring-amber-500 focus-visible:ring-offset-4 focus-visible:ring-offset-black/50 focus-visible:outline-none hover:border-${borderColorClass}/80 transition-all duration-300`}
                            whileHover={{
                              scale: prefersReducedMotion ? 1 : 1.05,
                            }}
                            whileTap={{
                              scale: prefersReducedMotion ? 1 : 0.95,
                            }}
                            animate={{
                              boxShadow: prefersReducedMotion
                                ? undefined
                                : isPlaying
                                ? isFriday
                                  ? [
                                      "0 0 80px rgba(52, 211, 153, 0.5), inset 0 0 60px rgba(52, 211, 153, 0.2)",
                                      "0 0 140px rgba(52, 211, 153, 0.7), inset 0 0 90px rgba(52, 211, 153, 0.3)",
                                      "0 0 80px rgba(52, 211, 153, 0.5), inset 0 0 60px rgba(52, 211, 153, 0.2)",
                                    ]
                                  : [
                                      "0 0 80px rgba(245, 158, 11, 0.5), inset 0 0 60px rgba(245, 158, 11, 0.2)",
                                      "0 0 140px rgba(245, 158, 11, 0.7), inset 0 0 90px rgba(245, 158, 11, 0.3)",
                                      "0 0 80px rgba(245, 158, 11, 0.5), inset 0 0 60px rgba(245, 158, 11, 0.2)",
                                    ]
                                : "0 0 40px rgba(13, 148, 136, 0.4)",
                            }}
                            transition={{
                              duration: prefersReducedMotion ? 0 : 2.5,
                              repeat:
                                isPlaying && !prefersReducedMotion
                                  ? Number.POSITIVE_INFINITY
                                  : 0,
                            }}
                            aria-label={
                              isBuffering
                                ? "جاري التحميل"
                                : isPlaying
                                ? "إيقاف البث"
                                : "تشغيل البث"
                            }
                            aria-pressed={isPlaying}
                          >
                            <div className="relative w-full h-full flex items-center justify-center min-w-[60px] min-h-[60px]">
                              {isBuffering ? (
                                <motion.div
                                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 border-[4px] md:border-[5px] ${borderColorClass} border-t-transparent rounded-full`}
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }}
                                  aria-label="جاري التحميل"
                                />
                              ) : isPlaying ? (
                                <Pause
                                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]"
                                  strokeWidth={2.5}
                                  fill="currentColor"
                                />
                              ) : (
                                <Play
                                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] ml-1.5"
                                  strokeWidth={2.5}
                                  fill="currentColor"
                                />
                              )}
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Zone B: Enhanced Control Deck */}
                    <div className="w-full px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-4 flex flex-col gap-3 sm:gap-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm">
                      {/* Volume Control - Accessible Radix Slider */}
                      <div
                        className="glass-panel p-3 sm:p-4 md:p-4 rounded-2xl md:rounded-3xl w-full border-2 border-primary/20 glow-button bg-gradient-to-br from-primary/5 to-transparent"
                        role="region"
                        aria-label="التحكم في مستوى الصوت"
                      >
                        <div
                          className="flex items-center gap-3 sm:gap-4 md:gap-5"
                          dir="ltr"
                        >
                          {/* Mute/Unmute Button - LARGE and VISIBLE */}
                          <motion.button
                            onClick={toggleMute}
                            className={`flex-shrink-0 p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl ${
                              isFriday
                                ? "bg-emerald-500/50 hover:bg-emerald-500/70 border-emerald-400/80"
                                : "bg-amber-500/50 hover:bg-amber-500/70 border-amber-400/80"
                            } border-2 transition-all duration-200 focus-visible:ring-4 focus-visible:ring-amber-500 focus-visible:outline-none min-w-[48px] min-h-[48px] sm:min-w-[52px] sm:min-h-[52px] md:min-w-[56px] md:min-h-[56px] flex items-center justify-center group shadow-2xl`}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            aria-label={
                              isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"
                            }
                            aria-pressed={isMuted}
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX
                                className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${
                                  isFriday
                                    ? "text-emerald-100"
                                    : "text-amber-100"
                                } drop-shadow-[0_0_20px_rgba(245,158,11,1)] group-hover:scale-110 transition-transform`}
                                strokeWidth={3}
                              />
                            ) : (
                              <Volume2
                                className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${
                                  isFriday
                                    ? "text-emerald-100"
                                    : "text-amber-100"
                                } drop-shadow-[0_0_20px_rgba(245,158,11,1)] group-hover:scale-110 transition-transform`}
                                strokeWidth={3}
                              />
                            )}
                          </motion.button>

                          {/* Accessible Radix Slider */}
                          <div className="flex-1 px-2 py-2 sm:py-0 -my-2 sm:my-0">
                            <Slider
                              value={[volume]}
                              onValueChange={handleVolumeChange}
                              min={0}
                              max={100}
                              step={1}
                              timePhase={timePhase}
                              isFriday={isFriday}
                              aria-label="مستوى الصوت"
                            />
                          </div>

                          {/* Volume Percentage Display */}
                          <motion.div
                            className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 ${
                              isFriday
                                ? "border-emerald-500/50 bg-emerald-500/15"
                                : "border-primary/50 bg-primary/15"
                            } min-w-[64px] sm:min-w-[70px] flex items-center justify-center`}
                            animate={{
                              scale:
                                volume !== previousVolume && !isMuted
                                  ? [1, 1.1, 1]
                                  : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <span
                              className={`font-orbitron text-base sm:text-lg md:text-xl font-bold ${
                                isFriday ? "text-emerald-300" : "text-primary"
                              } drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] tabular-nums`}
                              aria-live="polite"
                              aria-atomic="true"
                            >
                              {toArabicNum(volume.toString())}٪
                            </span>
                          </motion.div>
                        </div>
                      </div>

                      {/* Location and Frequency Badges - Enhanced */}
                      <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3 flex-wrap">
                        <motion.div
                          className="glass-panel px-4 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-full border-2 border-secondary/40 glow-teal min-h-[44px] bg-gradient-to-br from-secondary/10 to-transparent"
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
                          className="glass-panel px-4 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-full border-2 border-primary/40 glow-button min-h-[44px] bg-gradient-to-br from-primary/10 to-transparent"
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
                  <PrayerTimes />
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
            <AyahOfTheDay />
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
