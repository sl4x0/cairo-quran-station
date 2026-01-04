"use client";

import React from "react";
import { Play, Pause, Volume2, VolumeX, Settings } from "lucide-react";
import { Slider } from "./slider";

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
}: PlayerCardProps) {
  return (
    <section role="region" aria-label="مشغل البث المباشر" className="w-full">
      <div className="relative flex flex-col h-full min-h-[420px] sm:min-h-[420px] justify-between bg-black/30 backdrop-blur-3xl border-2 border-white/10 rounded-3xl overflow-hidden">
        <div className="relative w-full flex items-center justify-center overflow-hidden rounded-t-3xl bg-gradient-to-br from-black/20 via-transparent to-black/20 py-6">
          <div className="relative z-20">
            <div className="relative player-cta-container">
              <button
                onClick={onTogglePlay}
                aria-label={isPlaying ? "إيقاف البث" : "تشغيل البث"}
                aria-pressed={isPlaying}
                className={`absolute inset-0 player-cta glass-panel rounded-full cursor-pointer group overflow-hidden border-4 border-white/10 focus-visible:ring-4 focus-visible:ring-amber-500 focus-visible:ring-offset-4 focus-visible:ring-offset-black/50 transition-all duration-200`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Decorative stage (radial gradient) */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 200 200"
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                  >
                    <defs>
                      <radialGradient id="stageGrad" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                        <stop offset="60%" stopColor="rgba(0,0,0,0.18)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.36)" />
                      </radialGradient>
                    </defs>
                    <circle cx="100" cy="80" r="80" fill="url(#stageGrad)" />
                  </svg>

                  {isPlaying ? (
                    <>
                      <Pause className="text-white" />
                      {!prefersReducedMotion && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                          <div className="equalizer" aria-hidden="true">
                            <div className="bar" />
                            <div className="bar" />
                            <div className="bar" />
                            <div className="bar" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Play className="text-white ml-1" />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                        <span className="glass-panel px-3 py-1 rounded-full text-xs text-muted-foreground">
                          مباشر
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-4 py-5 sm:px-6 sm:py-6 flex items-center gap-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="flex-1">
            <div className="glass-panel p-3 sm:p-4 rounded-2xl w-full border-2 border-primary/20 flex items-center gap-3">
              <button
                onClick={onOpenPreferences}
                aria-label="الإعدادات"
                className="glass-button w-12 h-12 p-3 rounded-full flex items-center justify-center"
              >
                <Settings className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <Slider
                  value={[volume]}
                  onValueChange={(val) => onVolumeChange?.(val[0])}
                  min={0}
                  max={100}
                  className="w-full"
                />
              </div>

              <div className="text-sm text-muted-foreground min-w-[48px] text-right tabular-nums">
                {volume}%
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </section>
  );
}
