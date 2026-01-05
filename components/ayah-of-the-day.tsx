"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Copy, Check, Share2 } from "lucide-react";
import { retryWithBackoff, fetchWithTimeout } from "@/lib/api-utils";
import { AyahShare } from "./ayah-share";

interface AyahData {
  text: string;
  numberInSurah: number;
  surah: {
    name: string;
    englishName: string;
    number: number;
  };
}

interface TafsirData {
  text: string;
}

interface AyahResponse {
  data: AyahData[];
}

interface TafsirResponse {
  data: TafsirData;
}

export function AyahOfTheDay({
  timePhase = "day",
  isFriday = false,
}: {
  timePhase?: "dawn" | "day" | "sunset" | "night";
  isFriday?: boolean;
}) {
  // Helper to get theme colors
  const getThemeColors = () => {
    if (isFriday) {
      return {
        text: "text-emerald-300",
        border: "border-emerald-500/50",
        bg: "bg-emerald-500/20",
        hover: "hover:bg-emerald-500/20 hover:border-emerald-500/40",
        shadow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
        hoverGlow: "0 0 15px rgba(16,185,129,0.3)",
        ring: "focus:ring-emerald-500",
      };
    }
    // Standard Gold/White Theme for ALL phases
    return {
      text: "text-primary", // Uses css var --primary (Gold)
      border: "border-primary/30",
      bg: "bg-primary/5",
      hover: "hover:bg-primary/10 hover:border-primary/50",
      shadow: "drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]",
      glow: "shadow-[0_0_15px_rgba(212,175,55,0.1)]",
      hoverGlow: "0 0 15px rgba(212,175,55,0.25)",
      ring: "focus:ring-primary",
    };
  };

  const themeColors = getThemeColors();

  const [ayahData, setAyahData] = useState<{
    arabic: string;
    tafsir: string;
    reference: string;
    surahName: string;
    ayahNumber: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchAyah = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const randomAyah = Math.floor(Math.random() * 6236) + 1;

      // Fetch Arabic text
      const ayahResponse: AyahResponse = await retryWithBackoff(
        async () => {
          const response = await fetchWithTimeout(
            `https://api.alquran.cloud/v1/ayah/${randomAyah}/quran-uthmani`,
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

      // Fetch Arabic tafsir (Al-Tafsir Al-Muyassar - simplified interpretation)
      const tafsirResponse: TafsirResponse = await retryWithBackoff(
        async () => {
          const response = await fetchWithTimeout(
            `https://api.alquran.cloud/v1/ayah/${randomAyah}/ar.muyassar`,
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

      if (ayahResponse.data && tafsirResponse.data) {
        const ayahInfo = Array.isArray(ayahResponse.data)
          ? ayahResponse.data[0]
          : ayahResponse.data;
        setAyahData({
          arabic: ayahInfo.text,
          tafsir: tafsirResponse.data.text,
          reference: `${ayahInfo.surah.name} - ${ayahInfo.surah.englishName} (${ayahInfo.surah.number}:${ayahInfo.numberInSurah})`,
          surahName: ayahInfo.surah.name,
          ayahNumber: ayahInfo.numberInSurah,
        });
      }
    } catch (error) {
      console.error(
        "Failed to fetch Ayah after retries, using fallback:",
        error
      );
      setAyahData({
        arabic:
          "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ",
        tafsir:
          "الله المتفرد بالألوهية، المتصف بصفات الكمال المنزه عن النقائص، الحي الذي لا يموت، القائم بتدبير خلقه، لا يغلبه نعاس ولا نوم، له ملك السماوات والأرض وما فيهما، لا يشفع أحد عنده إلا بإذنه.",
        reference: "البقرة - Al-Baqarah (2:255)",
        surahName: "البقرة",
        ayahNumber: 255,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAyah();
  }, []);

  const handleCopy = async () => {
    if (!ayahData) return;
    try {
      const textToCopy = `${ayahData.arabic}\n\nالتفسير:\n${ayahData.tafsir}\n\n${ayahData.reference}`;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setError("فشل النسخ");
      setTimeout(() => setError(null), 2000);
    }
  };

  if (isLoading) {
    return (
      <section className="w-full" aria-label="آية اليوم - جاري التحميل">
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 elegant-shadow-teal">
          <div
            className="space-y-4 sm:space-y-5"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-32 bg-white/10 rounded-full animate-pulse" />
              <div className="flex gap-3">
                <div className="h-11 w-11 bg-white/10 rounded-full animate-pulse" />
                <div className="h-11 w-11 bg-white/10 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="h-32 sm:h-40 md:h-48 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-20 bg-white/5 rounded-xl animate-pulse" />
            <div className="flex justify-center">
              <div className="h-10 w-48 bg-white/10 rounded-full animate-pulse" />
            </div>
            <span className="sr-only">جاري تحميل آية اليوم...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!ayahData) return null;

  return (
    <section className="w-full" aria-label="آية اليوم">
      <article
        className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 elegant-shadow-teal border border-white/10 shadow-2xl"
        role="article"
        aria-labelledby="ayah-title"
      >
        {/* Header with title and action buttons */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
          <motion.div
            className={`glass-panel px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border-2 shadow-lg backdrop-blur-xl ${
              isFriday
                ? "border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                : timePhase === "dawn"
                ? "border-purple-500/50 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                : timePhase === "sunset"
                ? "border-orange-500/50 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                : timePhase === "night"
                ? "border-blue-500/50 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                : "border-amber-500/50 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={{
              scale: 1.05,
              boxShadow: isFriday
                ? "0 0 30px rgba(16,185,129,0.5)"
                : timePhase === "dawn"
                ? "0 0 30px rgba(168,85,247,0.5)"
                : timePhase === "sunset"
                ? "0 0 30px rgba(249,115,22,0.5)"
                : timePhase === "night"
                ? "0 0 30px rgba(59,130,246,0.5)"
                : "0 0 30px rgba(245,158,11,0.5)",
            }}
          >
            <h2
              id="ayah-title"
              className={`font-bold text-lg sm:text-xl tracking-wide ${
                isFriday
                  ? "text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  : timePhase === "dawn"
                  ? "text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                  : timePhase === "sunset"
                  ? "text-orange-300 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                  : timePhase === "night"
                  ? "text-blue-300 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                  : "text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              }`}
              lang="ar"
            >
              آية اليوم
            </h2>
          </motion.div>

          <div
            className="flex gap-2 sm:gap-3 self-end sm:self-auto"
            role="group"
            aria-label="إجراءات الآية"
          >
            <motion.button
              onClick={() => setShowShareModal(true)}
              disabled={isRefreshing}
              className={`glass-panel p-3 sm:p-3.5 rounded-full ${themeColors.hover} active:bg-${themeColors.bg} transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 ${themeColors.ring} focus:ring-offset-2 focus:ring-offset-transparent border border-white/10 shadow-lg`}
              whileHover={{ scale: 1.1, boxShadow: themeColors.hoverGlow }}
              whileTap={{ scale: 0.9 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              aria-label="مشاركة الآية"
              title="مشاركة الآية"
            >
              <Share2
                className={`w-5 h-5 sm:w-6 sm:h-6 ${themeColors.text} transition-colors ${themeColors.shadow}`}
                aria-hidden="true"
              />
            </motion.button>

            <motion.button
              onClick={handleCopy}
              disabled={isCopied || isRefreshing}
              className={`glass-panel p-3 sm:p-3.5 rounded-full ${themeColors.hover} active:bg-${themeColors.bg} transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 ${themeColors.ring} focus:ring-offset-2 focus:ring-offset-transparent border border-white/10 shadow-lg`}
              whileHover={{ scale: 1.1, boxShadow: themeColors.hoverGlow }}
              whileTap={{ scale: 0.9 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              aria-label={isCopied ? "تم النسخ" : "نسخ الآية"}
              title={isCopied ? "تم النسخ!" : "نسخ الآية"}
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${themeColors.text} ${themeColors.shadow}`}
                      aria-hidden="true"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${themeColors.text} transition-colors ${themeColors.shadow}`}
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={fetchAyah}
              disabled={isRefreshing}
              className={`glass-panel p-3 sm:p-3.5 rounded-full ${themeColors.hover} active:bg-${themeColors.bg} transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 ${themeColors.ring} focus:ring-offset-2 focus:ring-offset-transparent border border-white/10 shadow-lg`}
              whileHover={{ scale: 1.1, boxShadow: themeColors.hoverGlow }}
              whileTap={{ scale: 0.9 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              aria-label={isRefreshing ? "جاري التحديث..." : "تحديث الآية"}
              title={isRefreshing ? "جاري التحديث..." : "تحديث الآية"}
            >
              <RefreshCw
                className={`w-5 h-5 sm:w-6 sm:h-6 ${themeColors.text} transition-colors ${themeColors.shadow} ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                aria-hidden="true"
              />
            </motion.button>
          </div>
        </header>

        {/* Arabic text */}
        <motion.div
          className="mb-3 sm:mb-4 md:mb-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          key={ayahData.arabic}
        >
          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.8] sm:leading-[1.9] md:leading-[2] ${themeColors.text} ${themeColors.shadow} font-bold text-center px-1 sm:px-2`}
            dir="rtl"
            lang="ar"
            style={{
              fontFamily:
                "'Amiri', 'Traditional Arabic', 'Arabic Typesetting', serif",
              wordSpacing: "0.15em",
            }}
          >
            {ayahData.arabic}
          </p>
        </motion.div>

        {/* Arabic Tafsir (Commentary) */}
        <motion.div
          className="mb-3 sm:mb-4 md:mb-4"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          key={ayahData.tafsir}
        >
          <div className={`glass-panel rounded-xl p-4 sm:p-5 border-2 ${themeColors.border} bg-gradient-to-br from-${themeColors.bg} via-${themeColors.bg}/50 to-transparent backdrop-blur-xl ${themeColors.glow}`}>
            <h3
              className={`text-sm sm:text-base ${themeColors.text} font-bold mb-3 text-center ${themeColors.shadow}`}
              lang="ar"
            >
              التفسير الميسر
            </h3>
            <p
              dir="rtl"
              lang="ar"
              className="text-sm sm:text-base md:text-lg text-foreground/90 leading-relaxed max-w-4xl mx-auto text-right px-1 sm:px-2"
              style={{
                fontFamily: "'Readex Pro', 'Cairo', sans-serif",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
              }}
            >
              {ayahData.tafsir}
            </p>
          </div>
        </motion.div>

        {/* Reference */}
        <motion.footer
          className="flex justify-center"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className={`glass-panel px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border ${themeColors.border} shadow-md`}>
            <span
              className={`font-orbitron text-xs sm:text-sm ${themeColors.text} tracking-wide block ${themeColors.shadow}`}
              lang="ar"
            >
              {ayahData.reference}
            </span>
          </div>
        </motion.footer>

        {/* Error toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 glass-panel px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-sm"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </article>

      {/* Share Modal */}
      {ayahData && (
        <AyahShare
          ayahText={ayahData.arabic}
          surahName={ayahData.surahName}
          ayahNumber={ayahData.ayahNumber}
          tafsir={ayahData.tafsir}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </section>
  );
}
