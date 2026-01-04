"use client"

import { motion } from "framer-motion"
import { toArabicNum } from "@/lib/arabic-numerals"

export function Footer() {
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
        <div className="glass-panel rounded-3xl p-8 glow-white border-t border-white/10">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-base text-muted-foreground">إذاعة القرآن الكريم - القاهرة</span>
              <span className="text-base text-muted-foreground" aria-hidden="true">
                •
              </span>
              <span className="text-sm text-muted-foreground">
                © {toArabicNum(new Date().getFullYear().toString())}
              </span>
            </div>

            <a
              href="mailto:slaxsec@gmail.com"
              className="text-xs text-white/30 hover:text-white/80 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded px-2 py-1"
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
