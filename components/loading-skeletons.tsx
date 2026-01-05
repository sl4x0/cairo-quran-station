"use client";

import { motion } from "framer-motion";

/**
 * Loading Skeleton Components
 * 
 * Provides beautiful skeleton loaders for different content types
 * to improve perceived performance and user experience.
 */

/**
 * Prayer Times Skeleton Loader
 */
export function PrayerTimesSkeleton() {
  return (
    <div
      className="glass-panel rounded-3xl p-6 md:p-8 border-2 border-primary/20"
      role="status"
      aria-label="جاري تحميل مواقيت الصلاة - Loading prayer times"
    >
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-lg w-1/3 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded mt-2 w-1/2 animate-pulse" />
      </div>

      {/* Prayer Times List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse"
          >
            {/* Prayer Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20" />
              <div>
                <div className="h-5 bg-primary/20 rounded w-20 mb-2" />
                <div className="h-3 bg-primary/10 rounded w-16" />
              </div>
            </div>

            {/* Time */}
            <div className="h-6 bg-primary/20 rounded w-16" />
          </motion.div>
        ))}
      </div>

      {/* Countdown Skeleton */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber/10 to-emerald-500/10">
        <div className="h-4 bg-primary/10 rounded w-2/3 mx-auto animate-pulse" />
      </div>

      <span className="sr-only">جاري تحميل مواقيت الصلاة...</span>
    </div>
  );
}

/**
 * Ayah of the Day Skeleton Loader
 */
export function AyahSkeleton() {
  return (
    <div
      className="glass-panel rounded-3xl p-6 md:p-8 border-2 border-primary/20"
      role="status"
      aria-label="جاري تحميل آية اليوم - Loading verse of the day"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded w-1/3 animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
      </div>

      {/* Ayah Text Skeleton */}
      <div className="space-y-3 mb-6">
        <div className="h-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded w-full animate-pulse" />
        <div className="h-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded w-5/6 animate-pulse" />
        <div className="h-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded w-4/5 animate-pulse" />
      </div>

      {/* Surah Info Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 bg-primary/10 rounded w-24 animate-pulse" />
        <div className="h-4 bg-primary/10 rounded w-16 animate-pulse" />
      </div>

      {/* Tafsir Skeleton */}
      <div className="p-4 rounded-xl bg-black/20 space-y-2">
        <div className="h-4 bg-primary/5 rounded w-full animate-pulse" />
        <div className="h-4 bg-primary/5 rounded w-11/12 animate-pulse" />
        <div className="h-4 bg-primary/5 rounded w-10/12 animate-pulse" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2 mt-4">
        <div className="h-9 bg-primary/10 rounded-lg w-20 animate-pulse" />
        <div className="h-9 bg-primary/10 rounded-lg w-20 animate-pulse" />
      </div>

      <span className="sr-only">جاري تحميل آية اليوم...</span>
    </div>
  );
}

/**
 * Generic Content Skeleton
 */
export function ContentSkeleton({
  lines = 3,
  showHeader = true,
}: {
  lines?: number;
  showHeader?: boolean;
}) {
  return (
    <div className="glass-panel rounded-3xl p-6 border-2 border-primary/20">
      {showHeader && (
        <div className="h-6 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded w-1/3 mb-4 animate-pulse" />
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded animate-pulse"
            style={{ width: `${100 - i * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Spinner Component for inline loading states
 */
export function Spinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-primary/30 border-t-primary rounded-full animate-spin ${className}`}
      role="status"
      aria-label="جاري التحميل - Loading"
    >
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
}

/**
 * Buffering Indicator for Audio Player
 */
export function BufferingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full z-30"
      role="status"
      aria-label="جاري التحميل - Buffering"
    >
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" className="border-white/30 border-t-white" />
        <span className="text-xs text-white/80 font-medium">جاري التحميل...</span>
      </div>
    </motion.div>
  );
}
