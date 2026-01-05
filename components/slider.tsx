"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  timePhase?: "dawn" | "day" | "sunset" | "night";
  isFriday?: boolean;
  disabled?: boolean;
  // Optional aria-describedby to apply to the generated thumb (role=slider)
  thumbAriaDescribedBy?: string;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  timePhase = "day",
  isFriday = false,
  disabled = false,
  thumbAriaDescribedBy,
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
    // Standard Gold/Primary Theme
    return {
      range: "bg-primary",
      thumb: "bg-primary",
      border: "border-primary",
      shadow:
        "shadow-[0_0_12px_rgba(212,175,55,0.6)] hover:shadow-[0_0_20px_rgba(212,175,55,0.8)]",
      ring: "focus-visible:ring-primary",
    };
  };

  const colors = getThemeColors();

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot={cn(
          "relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-3 sm:data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 bg-white/10 border border-white/10",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
        style={{
          touchAction: disabled ? "auto" : "none",
        }}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute left-0 top-0 bottom-0 data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full rounded-full z-10 transition-all ease-linear",
            colors.range
          )}
          style={{
            width: `${Math.round(
              Array.isArray(value) ? value[0] ?? _values[0] : _values[0]
            )}%`,
          }}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-full transition-all focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border-2",
            disabled
              ? "cursor-not-allowed"
              : "cursor-pointer touch-none active:scale-125 active:cursor-grabbing",
            colors.thumb,
            colors.border,
            !disabled && colors.shadow,
            colors.ring
          )}
          style={{
            touchAction: disabled ? "auto" : "none",
          }}
          // Pass aria-describedby through to the thumb (role=slider) when provided
          {...(thumbAriaDescribedBy
            ? { "aria-describedby": thumbAriaDescribedBy }
            : {})}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
