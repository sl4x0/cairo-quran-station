"use client";

import { motion } from "framer-motion";
import { Book } from "lucide-react";

interface FridayCardProps {
  onReadAlKahf: () => void;
}

export function FridayCard({ onReadAlKahf }: FridayCardProps) {
  return (
    <motion.div
      className="relative z-10 w-full max-w-5xl mx-auto px-6 mb-12"
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <div className="glass-panel-emerald rounded-3xl p-8 md:p-12 elegant-shadow-emerald animate-shimmer-emerald border-2 border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Right: Arabic Greeting */}
          <div className="flex-1 text-right">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              جمعة مباركة
            </motion.h2>
          </div>

          {/* Center: Reminder Text */}
          <div className="flex-1 text-center px-4">
            <p className="text-foreground/90 text-lg leading-relaxed">
              لا تنسَ قراءة سورة الكهف اليوم
            </p>
          </div>

          {/* Left: Action Button */}
          <div className="flex-1 flex justify-start">
            <motion.button
              onClick={onReadAlKahf}
              className="glass-panel px-6 py-4 rounded-2xl bg-emerald-950/50 border-2 border-emerald-500/50 hover:border-emerald-400 transition-all group elegant-shadow-emerald"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3">
                <Book className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                <p className="text-emerald-300 font-semibold text-lg">
                  قراءة سورة الكهف
                </p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
