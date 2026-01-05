"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface PhaseConfig {
  bgClass: string;
  name: string;
  icon: string;
  color: string;
}

interface HeaderProps {
  isFriday: boolean;
  timePhase: "dawn" | "day" | "sunset" | "night";
  phaseConfig: PhaseConfig;
  onInfoClick: () => void;
  showInfoModal: boolean;
}

export function Header({
  isFriday,
  timePhase,
  phaseConfig,
  onInfoClick,
  showInfoModal,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shadowClass = isFriday ? "elegant-shadow-emerald" : "elegant-shadow";
  const textColorClass = isFriday ? "text-emerald-400" : "text-primary";
  const gradientFrom = isFriday ? "from-emerald-400" : "from-primary";
  const gradientVia = isFriday ? "via-emerald-300" : "via-primary/70";
  const gradientTo = isFriday ? "to-emerald-400" : "to-primary";
  const hoverGradient = isFriday
    ? "from-emerald-400/0 to-emerald-600/0"
    : "from-primary/0 to-primary/0";

  const getPhaseIcon = () => {
    const iconProps = {
      className: `w-5 h-5 md:w-6 md:h-6 relative z-10 transition-all duration-500 group-hover:scale-110`,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true" as const,
    };

    switch (timePhase) {
      case "dawn":
        return (
          <svg
            {...iconProps}
            className={`${iconProps.className} text-primary opacity-90 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case "day":
        return (
          <motion.svg
            {...iconProps}
            className={`${iconProps.className} text-primary drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle cx="12" cy="12" r="5" strokeWidth={2} />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </motion.svg>
        );
      case "sunset":
        return (
          <svg
            {...iconProps}
            className={`${iconProps.className} text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 15.5c-1.5 0-2.03 1-3.5 1s-1.97-1-3.5-1-2.03 1-3.5 1-1.97-1-3.5-1m0-8v2m7-2v2M3 17h18M7 10a5 5 0 0110 0"
            />
          </svg>
        );
      case "night":
        return (
          <motion.svg
            {...iconProps}
            className={`${iconProps.className} text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]`}
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
            <motion.circle
              cx="18"
              cy="8"
              r="1.5"
              fill="currentColor"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        );
    }
  };

  return (
    <motion.header
      className={`w-full max-w-7xl mx-auto glass-header rounded-2xl md:rounded-3xl lg:rounded-[2rem] mb-8 md:mb-12 overflow-hidden transition-all duration-500 ${
        isScrolled ? "shadow-2xl scale-[0.98]" : "shadow-xl"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {/* Animated top border glow */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo}`}
        animate={{
          opacity: [0.3, 1, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-8 py-4 md:py-6 gap-3 md:gap-4 relative">
        {/* Info Button - Left Side */}
        <motion.div
          className="flex items-center gap-3 flex-shrink-0"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
        >
          <motion.button
            onClick={onInfoClick}
            className={`glass-button h-10 w-10 rounded-md flex items-center justify-center ${shadowClass} group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-all duration-300`}
            aria-label="فتح معلومات الإذاعة"
            aria-expanded={showInfoModal}
            aria-controls="info-modal"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Radial pulse on hover */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${hoverGradient}`}
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: 0.3 }}
              transition={{ duration: 0.4 }}
            />

            {/* Rotating background gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${hoverGradient}`}
              animate={{ rotate: 360 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
            />

            <motion.svg
              className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-foreground group-hover:${textColorClass} transition-colors duration-300 relative z-10`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </motion.svg>
          </motion.button>
        </motion.div>

        {/* Main Title - Center */}
        <motion.h1
          className="flex-1 text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] font-bold leading-tight px-2 md:px-4 whitespace-nowrap"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          <motion.span
            className={`${
              isFriday ? "text-emerald-400" : "text-primary"
            } font-bold drop-shadow-[0_0_30px_currentColor]`}
            style={{
              textShadow: isFriday
                ? "0 0 30px rgba(52, 211, 153, 0.6), 0 0 60px rgba(52, 211, 153, 0.3)"
                : "0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.3)",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            إذاعة القرآن الكريم
          </motion.span>
        </motion.h1>

        {/* Status Indicators - Right Side */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* YouTube Quran Playlist Button */}
          <motion.a
            href="https://youtube.com/playlist?list=PLm7IU41uzPdgXijvj4aukKwlvzeODO-T4&si=_EIfV-FOVOzDdGFY"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button h-10 px-3 md:px-4 rounded-md flex items-center gap-2 relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-all duration-300"
            initial={{ scale: 0, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: "backOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="سماع القرآن الكريم على يوتيوب"
            title="سماع القرآن الكريم"
          >
            {/* YouTube glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 rounded-full"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* YouTube icon */}
            <motion.svg
              className="w-5 h-5 md:w-6 md:h-6 text-red-500 relative z-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </motion.svg>

            {/* Text - hidden on smallest screens, shown on sm+ */}
            <motion.span
              className="hidden sm:block text-sm md:text-base font-medium text-foreground/90 relative z-10 whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              سماع القرآن
            </motion.span>
          </motion.a>

          {/* Time Phase Indicator */}
          <motion.div
            className="glass-button px-3 md:px-4 py-2 md:py-2.5 rounded-full flex items-center gap-2 md:gap-2.5 min-h-[44px] relative overflow-hidden group cursor-default"
            initial={{ scale: 0, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
            whileHover={{ scale: 1.05 }}
            title={phaseConfig.name}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative z-10">{getPhaseIcon()}</div>

            <motion.span
              className="hidden sm:block text-sm md:text-base font-medium text-foreground/90 relative z-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {phaseConfig.name}
            </motion.span>
          </motion.div>

          {/* Friday Special Indicator */}
          <AnimatePresence mode="wait">
            {isFriday && (
              <motion.div
                className="glass-button px-3 md:px-4 py-2 md:py-2.5 rounded-full flex items-center gap-2 md:gap-2.5 min-h-[44px] relative overflow-hidden group cursor-default"
                initial={{ scale: 0, opacity: 0, x: 50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: 50 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "backOut" }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 rounded-full"
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.svg
                  className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 relative z-10 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </motion.svg>

                <motion.span
                  className="text-sm md:text-base font-medium text-emerald-400 relative z-10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  جمعة
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom border glow */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} opacity-30`}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.header>
  );
}
