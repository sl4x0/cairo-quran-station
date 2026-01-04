"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="backdrop-blur-3xl bg-slate-900/30 border-2 border-yellow-500/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(234,179,8,0.15)]">
          {/* Error Code */}
          <div className="text-center mb-6">
            <div className="text-8xl font-bold text-yellow-500 mb-2">٤٠٤</div>
            <div className="text-xl text-slate-300 font-semibold">عذراً، هذه الصفحة غير موجودة</div>
          </div>

          {/* Description */}
          <p className="text-center text-slate-400 mb-8">الصفحة التي تبحث عنها غير متوفرة أو تم نقلها</p>

          {/* Return Button */}
          <Link href="/">
            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/40 text-yellow-500 font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              العودة للبث المباشر
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
