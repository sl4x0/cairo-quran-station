"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface ToastProps {
  show: boolean
  message: string
}

export function Toast({ show, message }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] glass-panel rounded-2xl px-6 py-4 shadow-2xl border-2 border-red-500/30"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 40px rgba(239, 68, 68, 0.4)",
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={2} />
            <p className="text-sm font-medium text-red-400">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
