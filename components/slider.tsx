"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  timePhase?: "dawn" | "day" | "sunset" | "night";
  isFriday?: boolean;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  timePhase = "day",
  isFriday = false,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  const getThemeColors = () => {
    if (isFriday) {
      return {
        range: "bg-emerald-500",
        thumb: "bg-emerald-500",
        border: "border-emerald-400",
        shadow:
          "shadow-[0_0_12px_rgba(52,211,153,0.6)] hover:shadow-[0_0_20px_rgba(52,211,153,0.8)]",
        ring: "focus-visible:ring-emerald-500",
      };
    }
    switch (timePhase) {
      case "dawn":
        return {
          range: "bg-purple-500",
          thumb: "bg-purple-500",
          border: "border-purple-400",
          shadow:
            "shadow-[0_0_12px_rgba(168,85,247,0.6)] hover:shadow-[0_0_20px_rgba(168,85,247,0.8)]",
          ring: "focus-visible:ring-purple-500",
        };
      case "sunset":
        return {
          range: "bg-orange-500",
          thumb: "bg-orange-500",
          border: "border-orange-400",
          shadow:
            "shadow-[0_0_12px_rgba(249,115,22,0.6)] hover:shadow-[0_0_20px_rgba(249,115,22,0.8)]",
          ring: "focus-visible:ring-orange-500",
        };
      case "night":
        return {
          range: "bg-blue-500",
          thumb: "bg-blue-500",
          border: "border-blue-400",
          shadow:
            "shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]",
          ring: "focus-visible:ring-blue-500",
        };
      case "day":
      default:
        return {
          range: "bg-amber-500",
          thumb: "bg-amber-500",
          border: "border-amber-400",
          shadow:
            "shadow-[0_0_12px_rgba(245,158,11,0.6)] hover:shadow-[0_0_20px_rgba(245,158,11,0.8)]",
          ring: "focus-visible:ring-amber-500",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 bg-transparent"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            colors.range,
            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-4 shrink-0 rounded-full transition-all focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border-2",
            colors.thumb,
            colors.border,
            colors.shadow,
            colors.ring
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
