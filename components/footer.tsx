"use client"

import { motion } from "framer-motion"
import { toArabicNum } from "@/lib/arabic-numerals"

export function Footer({
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
        text: "text-emerald-200",
        textMuted: "text-emerald-300/80",
        border: "border-emerald-500/20",
        bg: "from-emerald-500/10 via-emerald-500/5",
        link: "text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-500/10",
        shadow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        glow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]",
      };
    }
    // Standard Gold/White for all other phases
    return {
      text: "text-primary/90",
      textMuted: "text-primary/60",
      border: "border-primary/20",
      bg: "from-primary/10 via-primary/5",
      link: "text-primary/70 hover:text-primary hover:bg-primary/10",
      shadow: "shadow-[0_0_20px_rgba(212,175,55,0.1)]",
      glow: "drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]",
    };
  };

  const themeColors = getThemeColors();

  return (
    <motion.footer
      className="relative z-10 mt-20 mb-8"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 3.4, duration: 0.8 }}
      role="contentinfo"
      aria-label="معلومات الموقع"
    >
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className={`glass-panel rounded-3xl p-8 border-2 ${themeColors.border} bg-gradient-to-br ${themeColors.bg} to-transparent backdrop-blur-xl ${themeColors.shadow}`}>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <span className={`text-base md:text-lg ${themeColors.text} font-semibold ${themeColors.glow}`}>إذاعة القرآن الكريم - القاهرة</span>
              <span className={`text-base ${themeColors.textMuted}`} aria-hidden="true">
                •
              </span>
              <span className={`text-sm md:text-base ${themeColors.textMuted}`}>
                © {toArabicNum(new Date().getFullYear().toString())}
              </span>
            </div>

            <a
              href="mailto:slaxsec@gmail.com"
              className={`text-xs md:text-sm ${themeColors.link} transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded-lg px-4 py-2`}
              aria-label="التواصل للإعلان عبر البريد الإلكتروني"
            >
              للتواصل: slaxsec@gmail.com
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
