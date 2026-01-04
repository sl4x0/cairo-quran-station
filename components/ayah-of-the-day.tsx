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

export function AyahOfTheDay() {
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
            className="glass-panel px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-secondary/30 shadow-lg"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h2
              id="ayah-title"
              className="text-secondary font-bold text-base sm:text-lg tracking-wide"
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
              className="glass-panel p-2.5 sm:p-3 rounded-full hover:bg-white/15 active:bg-white/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              aria-label="مشاركة الآية"
              title="مشاركة الآية"
            >
              <Share2
                className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors"
                aria-hidden="true"
              />
            </motion.button>

            <motion.button
              onClick={handleCopy}
              disabled={isCopied || isRefreshing}
              className="glass-panel p-2.5 sm:p-3 rounded-full hover:bg-white/15 active:bg-white/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                      className="w-5 h-5 text-secondary"
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
                      className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors"
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={fetchAyah}
              disabled={isRefreshing}
              className="glass-panel p-2.5 sm:p-3 rounded-full hover:bg-white/15 active:bg-white/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              aria-label={isRefreshing ? "جاري التحديث..." : "تحديث الآية"}
              title={isRefreshing ? "جاري التحديث..." : "تحديث الآية"}
            >
              <RefreshCw
                className={`w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors ${
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
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.8] sm:leading-[1.9] md:leading-[2] text-primary font-bold text-center px-1 sm:px-2"
            dir="rtl"
            lang="ar"
            style={{
              fontFamily:
                "'Amiri', 'Traditional Arabic', 'Arabic Typesetting', serif",
              wordSpacing: "0.15em",
              textShadow: "0 2px 20px rgba(245, 158, 11, 0.3)",
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
          <div className="glass-panel rounded-xl p-3 sm:p-4 border border-secondary/10 bg-gradient-to-br from-secondary/5 to-transparent">
            <h3
              className="text-xs sm:text-sm text-secondary font-semibold mb-2 text-center"
              lang="ar"
            >
              التفسير الميسر
            </h3>
            <p
              dir="rtl"
              lang="ar"
              className="text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed max-w-4xl mx-auto text-right px-1 sm:px-2"
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
          <div className="glass-panel px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-secondary/20 shadow-md">
            <span
              className="font-orbitron text-xs sm:text-sm text-secondary tracking-wide block"
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
