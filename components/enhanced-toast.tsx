"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, Wifi, WifiOff, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Enhanced Error Toast Component
 * 
 * Displays user-friendly error messages in Arabic and English with:
 * - Bilingual messages
 * - Retry functionality
 * - Helpful context and suggestions
 * - Auto-dismiss after timeout
 * - Manual dismiss option
 * 
 * @component
 */

export interface ErrorToastProps {
  show: boolean;
  type?: "connection" | "stream" | "api" | "general";
  message?: string;
  messageEn?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissTimeout?: number;
}

const ERROR_MESSAGES = {
  connection: {
    ar: "⚠️ انقطع الاتصال بالإنترنت",
    en: "Connection lost",
    suggestion: "تحقق من اتصالك بالإنترنت",
    suggestionEn: "Check your internet connection",
  },
  stream: {
    ar: "⚠️ انقطع البث المباشر",
    en: "Stream interrupted",
    suggestion: "إعادة المحاولة تلقائياً...",
    suggestionEn: "Retrying automatically...",
  },
  api: {
    ar: "⚠️ تعذر تحميل البيانات",
    en: "Failed to load data",
    suggestion: "يرجى المحاولة مرة أخرى",
    suggestionEn: "Please try again",
  },
  general: {
    ar: "⚠️ حدث خطأ غير متوقع",
    en: "An unexpected error occurred",
    suggestion: "يرجى المحاولة مرة أخرى",
    suggestionEn: "Please try again",
  },
};

export function ErrorToast({
  show,
  type = "general",
  message,
  messageEn,
  onRetry,
  onDismiss,
  autoDismiss = true,
  dismissTimeout = 5000,
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  const errorConfig = ERROR_MESSAGES[type];
  const displayMessageAr = message || errorConfig.ar;
  const displayMessageEn = messageEn || errorConfig.en;

  useEffect(() => {
    setIsVisible(show);

    if (show && autoDismiss && !onRetry) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissTimeout);

      return () => clearTimeout(timer);
    }
  }, [show, autoDismiss, dismissTimeout, onRetry, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleRetry = () => {
    onRetry?.();
    handleDismiss();
  };

  const getIcon = () => {
    switch (type) {
      case "connection":
        return <WifiOff className="w-5 h-5" />;
      case "stream":
        return <Wifi className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="glass-panel bg-red-950/90 border-2 border-red-500/30 rounded-2xl shadow-2xl shadow-red-900/20 overflow-hidden">
            {/* Progress bar for auto-dismiss */}
            {autoDismiss && !onRetry && (
              <motion.div
                className="h-1 bg-gradient-to-r from-red-500 to-orange-500"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: dismissTimeout / 1000, ease: "linear" }}
              />
            )}

            <div className="p-4 flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                {getIcon()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Arabic Message */}
                <p className="text-sm font-semibold text-white mb-1 dir-rtl">
                  {displayMessageAr}
                </p>

                {/* English Message */}
                <p className="text-xs text-red-200/80 mb-2 dir-ltr">
                  {displayMessageEn}
                </p>

                {/* Suggestion */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-red-300/70 dir-rtl">
                    {errorConfig.suggestion}
                  </p>
                  <p className="text-xs text-red-300/60 dir-ltr">
                    {errorConfig.suggestionEn}
                  </p>
                </div>

                {/* Retry Button */}
                {onRetry && (
                  <button
                    onClick={handleRetry}
                    className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-2 group"
                    aria-label="إعادة المحاولة - Retry"
                  >
                    <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="dir-rtl">إعادة المحاولة</span>
                    <span className="text-red-300/60">•</span>
                    <span className="dir-ltr">Retry</span>
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-500/20 flex items-center justify-center text-red-300 hover:text-white transition-colors"
                aria-label="إغلاق - Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Success Toast Component
 * 
 * Displays success messages with auto-dismiss
 */
export interface SuccessToastProps {
  show: boolean;
  message: string;
  messageEn?: string;
  onDismiss?: () => void;
  dismissTimeout?: number;
}

export function SuccessToast({
  show,
  message,
  messageEn,
  onDismiss,
  dismissTimeout = 3000,
}: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);

    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissTimeout);

      return () => clearTimeout(timer);
    }
  }, [show, dismissTimeout, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          role="status"
          aria-live="polite"
        >
          <div className="glass-panel bg-emerald-950/90 border-2 border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-900/20 overflow-hidden">
            <motion.div
              className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: dismissTimeout / 1000, ease: "linear" }}
            />

            <div className="p-4 flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-white dir-rtl">
                  {message}
                </p>
                {messageEn && (
                  <p className="text-xs text-emerald-200/80 mt-1 dir-ltr">
                    {messageEn}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
