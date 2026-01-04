"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  isFriday: boolean;
}

export function AudioVisualizer({
  audioElement,
  isPlaying,
  isFriday,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Only animate when playing
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // Responsive bar count
      const barCount = width > 600 ? 60 : width > 400 ? 48 : 36;
      const barWidth = Math.max(2, (width / barCount) * 0.65);
      const gap = (width / barCount) * 0.35;

      // Colors based on Friday mode
      const primaryColor = isFriday
        ? { r: 52, g: 211, b: 153 }
        : { r: 245, g: 158, b: 11 };

      const secondaryColor = isFriday
        ? { r: 16, g: 185, b: 129 }
        : { r: 251, g: 191, b: 36 };

      // Animated wave simulation when playing
      const time = Date.now() * 0.001;
      const frequencies: number[] = [];

      for (let i = 0; i < barCount; i++) {
        const wave1 = Math.sin(time * 2 + i * 0.3) * 0.3;
        const wave2 = Math.sin(time * 3 - i * 0.2) * 0.2;
        const wave3 = Math.sin(time * 1.5 + i * 0.15) * 0.25;
        frequencies.push(0.3 + wave1 + wave2 + wave3);
      }

      // Draw bars from bottom
      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        const normalizedHeight = Math.max(0.1, Math.min(0.95, frequencies[i]));
        const barHeight = normalizedHeight * height * 0.85;
        const y = height - barHeight;

        // Gradient
        const gradient = ctx.createLinearGradient(x, y, x, height);
        gradient.addColorStop(
          0,
          `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.95)`
        );
        gradient.addColorStop(
          0.5,
          `rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, 0.85)`
        );
        gradient.addColorStop(
          1,
          `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.7)`
        );

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.6)`;

        // Rounded bars
        const radius = Math.min(barWidth / 2, 3);
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();

        // Top highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * normalizedHeight})`;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, Math.min(3, barHeight), [
          radius,
          radius,
          0,
          0,
        ]);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isFriday]);

  return (
    <div className="absolute inset-x-0 bottom-0 w-full h-[40%] sm:h-[45%] md:h-[50%] flex items-end justify-center pointer-events-none px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}
