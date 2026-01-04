"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { useListeners } from "@/hooks/use-listeners";
import { toArabicNum } from "@/lib/arabic-numerals";
import { formatListenerCount } from "@/lib/api-utils";
import { useMounted } from "@/hooks/use-mounted";

interface ListenerCountProps {
  isFriday?: boolean;
}

export function ListenerCount({ isFriday = false }: ListenerCountProps) {
  const mounted = useMounted();
  const { count, status, lastUpdated: _lastUpdated } = useListeners();

  if (!mounted) {
    return <ListenerCountSkeleton />;
  }

  const isLoading = status === "loading";
  const isConnected = status === "connected";
  const isFallback = status === "fallback";
  const isError = status === "error";

  const statusColor = isFriday
    ? isConnected
      ? "text-emerald-400"
      : isFallback
      ? "text-amber-400"
      : isError
      ? "text-red-400"
      : "text-gray-400"
    : isConnected
    ? "text-primary"
    : isFallback
    ? "text-amber-400"
    : isError
    ? "text-red-400"
    : "text-gray-400";

  const borderColor = isFriday
    ? isConnected
      ? "border-emerald-500/40"
      : "border-amber-500/40"
    : isConnected
    ? "border-primary/40"
    : "border-amber-500/40";

  const bgGradient = isFriday
    ? isConnected
      ? "from-emerald-500/10"
      : "from-amber-500/10"
    : isConnected
    ? "from-primary/10"
    : "from-amber-500/10";

  const StatusIcon = isLoading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={statusColor}
    >
      <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
    </motion.div>
  ) : isConnected ? (
    <Wifi className={`w-4 h-4 sm:w-5 sm:h-5 ${statusColor}`} />
  ) : isFallback ? (
    <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${statusColor}`} />
  ) : (
    <WifiOff className={`w-4 h-4 sm:w-5 sm:h-5 ${statusColor}`} />
  );

  const formattedCount = formatListenerCount(count);
  const arabicCount = toArabicNum(formattedCount);

  const statusLabel = isLoading
    ? "جاري التحميل..."
    : isConnected
    ? "متصل"
    : isFallback
    ? "تقديري"
    : "غير متصل";

  return (
    <motion.div
      className={`glass-panel px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${bgGradient} to-transparent shadow-lg min-h-[48px] flex items-center justify-center`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">{StatusIcon}</div>

        {/* Count Display */}
        <div className="flex flex-col items-start leading-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="flex items-baseline gap-1.5"
            >
              <Users
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${statusColor}`}
                strokeWidth={2.5}
              />
              <span
                className={`font-orbitron text-lg sm:text-xl md:text-2xl font-bold ${statusColor} drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] tabular-nums`}
              >
                {arabicCount}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Status Label */}
          <motion.span
            className="text-[10px] sm:text-xs text-white/60 font-readex mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {statusLabel}
          </motion.span>
        </div>

        {/* Live Indicator */}
        {isConnected && (
          <motion.div
            className="flex-shrink-0 flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className={`w-2 h-2 rounded-full ${
                isFriday ? "bg-emerald-500" : "bg-primary"
              } shadow-[0_0_8px_rgba(245,158,11,0.8)]`}
              animate={{
                opacity: [1, 0.3, 1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ListenerCountSkeleton() {
  return (
    <div className="glass-panel px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border-2 border-gray-500/20 bg-gradient-to-br from-gray-500/5 to-transparent min-h-[48px] flex items-center justify-center">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-600/30 rounded animate-pulse" />
        <div className="flex flex-col gap-1">
          <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gray-600/30 rounded animate-pulse" />
          <div className="w-12 h-3 bg-gray-600/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
