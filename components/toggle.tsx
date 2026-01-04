"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
  size?: "md" | "lg";
}

export function Toggle({
  checked,
  onChange,
  ariaLabel,
  size = "md",
}: ToggleProps) {
  const trackClass =
    size === "lg" ? "w-16 h-9 rounded-full" : "w-12 h-7 rounded-full";
  const knobClass = size === "lg" ? "h-7 w-7" : "h-5 w-5";

  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        aria-label={ariaLabel}
      />

      <span
        className={`block ${trackClass} transition-colors duration-200 shadow-sm ${
          checked ? "bg-primary/90" : "bg-gray-600/70"
        }`}
        aria-hidden="true"
      />

      <span
        className={`absolute left-1 top-1 ${knobClass} bg-white rounded-full transition-transform shadow-md ${
          checked ? "translate-x-7" : "translate-x-0"
        }`}
        aria-hidden="true"
      />
    </label>
  );
}
