"use client";

import React from "react";

interface SacredGeometryProps {
  isPlaying?: boolean;
  isBuffering?: boolean;
}

// Minimal decorative component to render subtle geometry behind the CTA.
// Kept lightweight and accessible (aria-hidden) so unit tests and SSR are stable.
export function SacredGeometry({
  isPlaying,
  isBuffering,
}: SacredGeometryProps) {
  return (
    <svg
      width="220"
      height="120"
      viewBox="0 0 220 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      className="opacity-40"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="60" r="44" fill="url(#g1)" />
      <circle cx="110" cy="60" r="30" fill="black" opacity="0.08" />
    </svg>
  );
}
