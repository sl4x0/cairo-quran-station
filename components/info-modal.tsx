"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Download,
  Radio,
  Users,
  Wifi,
  WifiOff,
  AlertCircle,
  Signal,
  Globe,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toArabicNum } from "@/lib/arabic-numerals";
import { formatListenerCount } from "@/lib/api-utils";
import { useListeners } from "@/hooks/use-listeners";
import { useMounted } from "@/hooks/use-mounted";
import type { TimePhase } from "@/lib/time-phase";
import { getPhaseConfig } from "@/lib/time-phase";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFriday?: boolean;
  timePhase: TimePhase;
  phaseConfig: ReturnType<typeof getPhaseConfig>;
}

export function InfoModal({
  isOpen,
  onClose,
  isFriday = false,
  timePhase: _timePhase,
  phaseConfig,
}: InfoModalProps) {
  const [copied, setCopied] = useState(false);
  const { count, status, lastUpdated: _lastUpdated } = useListeners();
  const mounted = useMounted();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (showInstallPrompt) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showInstallPrompt]);

  useEffect(() => {
    if (showInstallPrompt) {
      // Scroll to show the dropdown on mobile
      setTimeout(() => {
        const dropdown = document.getElementById("install-instructions");
        if (dropdown) {
          dropdown.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  }, [showInstallPrompt]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleInstallPrompt = () => {
    setShowInstallPrompt((prev) => !prev);
  };

  const isLoading = status === "loading";
  const isConnected = status === "connected";
  const isFallback = status === "fallback";

  const primaryColor = isFriday ? "text-emerald-400" : "text-primary";
  const primaryBorder = isFriday ? "border-emerald-500" : "border-primary";
  const primaryBg = isFriday ? "from-emerald-500" : "from-primary";
  const primaryGlow = isFriday
    ? "shadow-[0_0_80px_rgba(52,211,153,0.3)]"
    : "shadow-[0_0_80px_rgba(245,158,11,0.3)]";

  const statusColor = isConnected
    ? "text-emerald-400"
    : isFallback
    ? "text-amber-400"
    : "text-gray-400";

  const statusBg = isConnected
    ? "bg-emerald-500/15"
    : isFallback
    ? "bg-amber-500/15"
    : "bg-gray-500/15";

  const statusBorder = isConnected
    ? "border-emerald-500/40"
    : isFallback
    ? "border-amber-500/40"
    : "border-gray-500/40";

  const statusText = isLoading
    ? "جاري التحميل..."
    : isConnected
    ? "مباشر"
    : "تقديري";

  const StatusIcon = isLoading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Wifi className="w-5 h-5" />
    </motion.div>
  ) : isConnected ? (
    <Wifi className="w-5 h-5" />
  ) : isFallback ? (
    <AlertCircle className="w-5 h-5" />
  ) : (
    <WifiOff className="w-5 h-5" />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop with theme */}
          <motion.div
            className={`absolute inset-0 ${phaseConfig.bgClass} backdrop-blur-3xl`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-8 border-2 ${primaryBorder}/30 ${primaryGlow}`}
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between mb-6 sm:mb-8 pb-6 border-b ${primaryBorder}/20`}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${primaryBg}/20 to-emerald-500/10 border ${primaryBorder}/40`}
                  animate={{
                    boxShadow: isFriday
                      ? [
                          "0 0 20px rgba(52,211,153,0.3)",
                          "0 0 40px rgba(52,211,153,0.5)",
                          "0 0 20px rgba(52,211,153,0.3)",
                        ]
                      : [
                          "0 0 20px rgba(245,158,11,0.3)",
                          "0 0 40px rgba(245,158,11,0.5)",
                          "0 0 20px rgba(245,158,11,0.3)",
                        ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Radio className={`w-6 h-6 sm:w-7 sm:h-7 ${primaryColor}`} />
                </motion.div>
                <h2
                  id="modal-title"
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-l ${primaryBg} via-yellow-300 ${primaryBg} bg-clip-text text-transparent leading-[1.4]`}
                  style={{
                    fontFamily:
                      "var(--font-sans), Cairo, Readex Pro, sans-serif",
                    WebkitBoxDecorationBreak: "clone",
                    paddingTop: "0.1em",
                    paddingBottom: "0.1em",
                  }}
                >
                  إذاعة القرآن الكريم
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`glass-panel p-2.5 sm:p-3 rounded-full hover:bg-primary/20 transition-all border-2 ${primaryBorder}/60 hover:${primaryBorder} focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none group backdrop-blur-md`}
                aria-label="إغلاق النافذة"
              >
                <X
                  className="w-6 h-6 sm:w-7 sm:h-7 text-foreground group-hover:text-primary group-hover:rotate-90 transition-all duration-300"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Live Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Real-Time Listeners Card */}
              <motion.div
                className={`glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 ${statusBorder} ${statusBg} relative overflow-hidden`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm sm:text-base text-muted-foreground font-medium">
                      المستمعون الآن
                    </span>
                    <div className={`flex items-center gap-1.5 ${statusColor}`}>
                      {StatusIcon}
                    </div>
                  </div>

                  {mounted ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={count}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex items-center gap-3 mb-3"
                        >
                          <Users
                            className={`w-7 h-7 sm:w-8 sm:h-8 ${statusColor}`}
                            strokeWidth={2.5}
                          />
                          <span
                            className={`text-4xl sm:text-5xl md:text-6xl font-bold ${statusColor} drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] tabular-nums leading-none`}
                            style={{
                              fontFamily:
                                "var(--font-sans), Cairo, Readex Pro, sans-serif",
                            }}
                          >
                            {toArabicNum(formatListenerCount(count))}
                          </span>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold ${statusColor}`}
                          style={{
                            fontFamily:
                              "var(--font-sans), Cairo, Readex Pro, sans-serif",
                          }}
                        >
                          {statusText}
                        </span>
                        {isConnected && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                            animate={{
                              opacity: [1, 0.3, 1],
                              scale: [1, 1.3, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-32 h-12 bg-gray-600/30 rounded-lg animate-pulse" />
                      <div className="w-20 h-4 bg-gray-600/20 rounded animate-pulse" />
                    </div>
                  )}
                </div>

                {isConnected && (
                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Stream Quality Card */}
              <motion.div
                className={`glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 ${primaryBorder}/30 bg-gradient-to-br ${primaryBg}/10 to-transparent relative overflow-hidden`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm sm:text-base text-muted-foreground font-medium">
                      جودة البث
                    </span>
                    <Signal className={`w-5 h-5 ${primaryColor}`} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-4xl sm:text-5xl md:text-6xl font-bold ${primaryColor} drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] tabular-nums leading-none`}
                        style={{
                          fontFamily:
                            "var(--font-sans), Cairo, Readex Pro, sans-serif",
                        }}
                      >
                        {toArabicNum("128")}
                      </span>
                      <span
                        className={`text-lg sm:text-xl ${primaryColor}/80 font-medium`}
                        style={{
                          fontFamily:
                            "var(--font-sans), Cairo, Readex Pro, sans-serif",
                        }}
                      >
                        كيلوبت/ث
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        animate={{
                          opacity: [1, 0.3, 1],
                          scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span
                        className="text-sm font-semibold text-emerald-400"
                        style={{
                          fontFamily:
                            "var(--font-sans), Cairo, Readex Pro, sans-serif",
                        }}
                      >
                        مستقر
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  className={`absolute -bottom-10 -left-10 w-32 h-32 ${primaryBg}/10 rounded-full blur-2xl`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </motion.div>

              {/* Server Location Card */}
              <motion.div
                className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm sm:text-base text-muted-foreground font-medium">
                    موقع الخادم
                  </span>
                  <Globe className="w-5 h-5 text-secondary" />
                </div>

                <div className="space-y-2">
                  <span
                    className="text-3xl sm:text-4xl font-bold text-secondary drop-shadow-[0_0_15px_rgba(13,148,136,0.5)] leading-none"
                    style={{
                      fontFamily:
                        "var(--font-sans), Cairo, Readex Pro, sans-serif",
                    }}
                  >
                    القاهرة
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-emerald-500"
                      animate={{
                        opacity: [1, 0.3, 1],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span
                      className="text-sm font-semibold text-emerald-400"
                      style={{
                        fontFamily:
                          "var(--font-sans), Cairo, Readex Pro, sans-serif",
                      }}
                    >
                      متصل
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Frequency Card */}
              <motion.div
                className={`glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 ${primaryBorder}/30 bg-gradient-to-br ${primaryBg}/10 to-transparent`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm sm:text-base text-muted-foreground font-medium">
                    التردد
                  </span>
                  <Sparkles className={`w-5 h-5 ${primaryColor}`} />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-3xl sm:text-4xl font-bold ${primaryColor} drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] tabular-nums leading-none`}
                    style={{
                      fontFamily:
                        "var(--font-sans), Cairo, Readex Pro, sans-serif",
                    }}
                  >
                    {toArabicNum("98.2")}
                  </span>
                  <span
                    className={`text-lg sm:text-xl ${primaryColor}/80 font-semibold`}
                    style={{
                      fontFamily:
                        "var(--font-sans), Cairo, Readex Pro, sans-serif",
                    }}
                  >
                    FM
                  </span>
                </div>
              </motion.div>
            </div>

            {/* About Section */}
            <section className="mb-6 sm:mb-8">
              <h3
                className={`text-lg sm:text-xl font-semibold ${primaryColor} mb-3 sm:mb-4 flex items-center gap-2`}
                style={{
                  fontFamily: "var(--font-sans), Cairo, Readex Pro, sans-serif",
                }}
              >
                <div
                  className={`w-1 h-6 bg-gradient-to-b ${primaryBg} to-transparent rounded-full`}
                />
                عن الإذاعة
              </h3>
              <div
                className={`glass-panel rounded-2xl p-5 sm:p-6 border ${primaryBorder}/10`}
              >
                <p
                  className="text-foreground/90 leading-relaxed text-base sm:text-lg text-right"
                  dir="rtl"
                  style={{
                    fontFamily:
                      "var(--font-sans), Cairo, Readex Pro, sans-serif",
                  }}
                >
                  إذاعة القرآن الكريم من القاهرة، صوتٌ يربط القلوب بكلام الله من
                  قلب العاصمة المصرية إلى كل أنحاء العالم. نبثُّ القرآن الكريم
                  على مدار الساعة، مع تلاوات مباركة من أعظم القراء، لنملأ
                  المسامع بالنور والسكينة في عصر المستقبل.
                </p>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Install Button */}
              <div className="relative">
                <button
                  onClick={handleInstallPrompt}
                  className="w-full glass-panel rounded-2xl p-4 sm:p-5 hover:bg-secondary/10 transition-all group border-2 border-secondary/30 hover:border-secondary/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  aria-label="عرض تعليمات تثبيت التطبيق"
                  aria-expanded={showInstallPrompt}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Download
                      className="w-6 h-6 sm:w-7 sm:h-7 text-secondary group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                    <span
                      className="text-lg sm:text-xl font-bold text-foreground"
                      style={{
                        fontFamily:
                          "var(--font-sans), Cairo, Readex Pro, sans-serif",
                      }}
                    >
                      تثبيت التطبيق
                    </span>
                  </div>
                </button>

                {/* Install Instructions - Positioned above button on mobile */}
                <AnimatePresence>
                  {showInstallPrompt && (
                    <motion.div
                      id="install-instructions"
                      className="absolute bottom-full left-0 right-0 mb-2 glass-panel rounded-xl p-4 sm:p-5 border-2 border-secondary/40 bg-secondary/10 backdrop-blur-xl z-10 max-h-[60vh] overflow-y-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      role="alert"
                      aria-live="polite"
                    >
                      <div className="space-y-2.5 sm:space-y-3">
                        <div className="text-center">
                          <p
                            className="text-base sm:text-lg font-bold text-secondary mb-1"
                            style={{
                              fontFamily:
                                "var(--font-sans), Cairo, Readex Pro, sans-serif",
                            }}
                          >
                            📱 طريقة التثبيت
                          </p>
                          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mb-2 sm:mb-3" />
                        </div>

                        <div className="space-y-2">
                          <p
                            className="text-sm sm:text-base text-foreground/95 text-right leading-relaxed"
                            dir="rtl"
                            style={{
                              fontFamily:
                                "var(--font-sans), Cairo, Readex Pro, sans-serif",
                            }}
                          >
                            <span className="font-bold text-primary">
                              • آيفون:
                            </span>{" "}
                            اضغط على زر المشاركة{" "}
                            <span className="text-secondary text-lg sm:text-xl">
                              ⬆️
                            </span>{" "}
                            ثم اختر &quot;إضافة إلى الشاشة الرئيسية&quot;
                          </p>

                          <p
                            className="text-sm sm:text-base text-foreground/95 text-right leading-relaxed"
                            dir="rtl"
                            style={{
                              fontFamily:
                                "var(--font-sans), Cairo, Readex Pro, sans-serif",
                            }}
                          >
                            <span className="font-bold text-primary">
                              • أندرويد:
                            </span>{" "}
                            اضغط على القائمة{" "}
                            <span className="text-secondary text-lg sm:text-xl">
                              ⋮
                            </span>{" "}
                            ثم اختر &quot;إضافة إلى الشاشة الرئيسية&quot;
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className={`glass-panel rounded-2xl p-4 sm:p-5 hover:bg-primary/10 transition-all group border-2 ${primaryBorder}/30 hover:${primaryBorder}/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none`}
                aria-label={copied ? "تم نسخ الرابط" : "نسخ رابط الإذاعة"}
              >
                <div className="flex items-center justify-center gap-3">
                  {copied ? (
                    <Check
                      className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Copy
                      className={`w-6 h-6 sm:w-7 sm:h-7 ${primaryColor} group-hover:scale-110 transition-transform`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="text-lg sm:text-xl font-bold text-foreground"
                    style={{
                      fontFamily:
                        "var(--font-sans), Cairo, Readex Pro, sans-serif",
                    }}
                  >
                    {copied ? "تم النسخ!" : "مشاركة الإذاعة"}
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
