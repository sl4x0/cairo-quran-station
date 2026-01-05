"use client";

import React from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Settings } from "lucide-react";
import { Slider } from "./slider";


/**
 * PlayerCard Component
 * 
 * The main audio player interface for the Cairo Quran Station live stream.
 * This is the centerpiece of the application, handling all audio playback controls
 * and providing a beautiful, animated visual experience.
 * 
 * **Features**:
 * - Play/pause toggle with visual feedback
 * - Volume control slider (0-100%)
 * - Mute/unmute functionality
 * - Sacred geometry animation that responds to playback state
 * - Keyboard shortcuts support (Space for play/pause, arrows for volume)
 * - Mobile device volume synchronization
 * - Accessibility features (ARIA labels, screen reader support)
 * - Reduced motion support for users with motion sensitivity
 * 
 * **Visual Layers** (from back to front):
 * 1. Watermark layer - Subtle logo background
 * 2. Sacred geometry - Animated Islamic geometric patterns
 * 3. Play button - Main interaction point with pulse animation
 * 4. Control deck - Volume slider and settings
 * 
 * @component
 */

interface PlayerCardProps {
  isPlaying: boolean;
  isBuffering?: boolean;
  isMuted?: boolean;
  volume: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onOpenPreferences?: () => void;
  onVolumeChange?: (v: number) => void;
  prefersReducedMotion?: boolean;
  isFriday?: boolean;
  isMobileDevice?: boolean;
  isVolumeControlled?: boolean;
}

export function PlayerCard({
  isPlaying,
  isBuffering: _isBuffering = false,
  isMuted = false,
  volume,
  onTogglePlay,
  onToggleMute,
  onOpenPreferences,
  onVolumeChange,
  prefersReducedMotion = false,
  isFriday: _isFriday = false,
  isMobileDevice = false,
  isVolumeControlled = false,
}: PlayerCardProps) {
  return (
    <section role="region" aria-label="مشغل البث المباشر" className="w-full">
      <div className="relative flex flex-col h-full min-h-[500px] justify-between bg-black/30 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
        {/* --- ZONE A: VISUAL STAGE --- */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-t-3xl bg-gradient-to-br from-black/20 via-transparent to-black/20 py-8">
          {/* 1. Watermark Layer (Background) - FIXED to fill entire card */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <div
              data-testid="player-watermark"
              className="relative w-full h-full opacity-[0.18] drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] mix-blend-screen player-watermark"
            >
              <Image
                src="/logo-primary.svg"
                alt=""
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
                aria-hidden="true"
                priority
              />
            </div>
          </div>

          {/* 2. Sacred Geometry Layer (Middle) - REMOVED per user request */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-60 mix-blend-screen" />

          {/* 3. Play Button Layer (Top) */}
          <div className="relative z-20">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <button
                onClick={onTogglePlay}
                aria-label={isPlaying ? "إيقاف البث" : "تشغيل البث"}
                aria-pressed={isPlaying}
                className={`relative z-20 w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-500 group
                    isPlaying
                      ? "bg-gradient-to-br from-primary/40 via-primary/30 to-primary/40 border-2 border-primary/60 shadow-[0_0_60px_rgba(212,175,55,0.5),0_0_30px_rgba(212,175,55,0.3)]"
                      : "bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 hover:border-primary/50 hover:shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:from-primary/20 hover:to-primary/10"
                  }
                  backdrop-blur-xl
                `}
              >
                {/* Pulse ring animation when playing */}
                {isPlaying && (
                  <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                )}

                {/* Play/Pause Icon */}
                <div className="relative z-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                  {isPlaying ? (
                    <Pause className="w-16 h-16 sm:w-20 sm:h-20 fill-current" />
                  ) : (
                    <Play className="w-16 h-16 sm:w-20 sm:h-20 fill-current translate-x-1" />
                  )}
                </div>

                {/* Equalizer - only show when playing */}
                {isPlaying && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <div className="equalizer" aria-hidden="true">
                      <div className="bar" />
                      <div className="bar" />
                      <div className="bar" />
                      <div className="bar" />
                    </div>
                  </div>
                )}
              </button>
            </div>

            {/* Play Badge */}
            {!isPlaying && (
              <div className="mt-4 flex justify-center">
                <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-black/40 border border-white/10 text-primary/80 backdrop-blur-md">
                  مباشر
                </span>
              </div>
            )}
          </div>
        </div>

        {/* --- ZONE B: CONTROL DECK --- */}
        <div className="w-full px-6 py-6 sm:px-8 sm:py-8 flex flex-col gap-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent border-t border-white/5">
          {/* Top Row: Settings & Volume */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPreferences}
              aria-label="الإعدادات"
              className="w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>

            <div className="flex-1 relative group">
              <Slider
                value={[volume]}
                onValueChange={(val) =>
                  !isVolumeControlled && onVolumeChange?.(val[0])
                }
                min={0}
                max={100}
                className="w-full cursor-pointer"
                disabled={isVolumeControlled}
                dir="ltr" // ✅ FIX: Force LTR physics
                thumbAriaDescribedBy={
                  isVolumeControlled ? "device-volume-hint" : undefined
                }
              />

              {/* Mobile Volume Hint */}
              {isVolumeControlled && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span
                    id="device-volume-hint"
                    className="text-[10px] text-primary/80 bg-black/60 px-2 py-1 rounded-full border border-primary/30"
                  >
                    التحكم عبر أزرار الهاتف
                  </span>
                </div>
              )}
            </div>

            <div className="w-10 text-left text-sm font-mono text-primary/80">
              {volume}%
            </div>

            {/* Mute control (hidden on mobile) */}
            {!isMobileDevice && (
              <button
                onClick={onToggleMute}
                aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                className="glass-button p-3 rounded-full flex items-center justify-center min-w-[48px] min-h-[48px]"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
