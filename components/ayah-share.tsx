"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface AyahShareProps {
  ayahText: string;
  surahName: string;
  ayahNumber: number;
  tafsir?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AyahShare({
  ayahText,
  surahName,
  ayahNumber,
  tafsir,
  isOpen,
  onClose,
}: AyahShareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeTafsir, setIncludeTafsir] = useState(false);

  const generateImage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas dimensions - larger if including tafsir
    const width = 1200;
    const height = includeTafsir && tafsir ? 900 : 630;
    canvas.width = width;
    canvas.height = height;

    // Elegant gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#1a2332");
    gradient.addColorStop(0.5, "#0d4d4f");
    gradient.addColorStop(1, "#1a2332");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle pattern overlay
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = "#d4af37";
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Decorative borders
    const borderGradient = ctx.createLinearGradient(0, 0, width, 0);
    borderGradient.addColorStop(0, "#d4af3700");
    borderGradient.addColorStop(0.5, "#d4af37");
    borderGradient.addColorStop(1, "#d4af3700");
    ctx.fillStyle = borderGradient;
    ctx.fillRect(0, 0, width, 4);
    ctx.fillRect(0, height - 4, width, 4);

    // Arabic font setup
    ctx.font = "700 56px 'Amiri', 'Traditional Arabic', serif";
    ctx.fillStyle = "#f5f5dc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Word wrap for Ayah
    const maxWidth = width - 160;
    const lineHeight = 80;
    const words = ayahText.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine.trim());

    // Prepare tafsir if included
    let tafsirLines: string[] = [];
    if (includeTafsir && tafsir) {
      ctx.font = "400 28px 'Cairo', sans-serif";
      const tafsirWords = tafsir.split(" ");
      let currentTafsirLine = "";

      for (const word of tafsirWords) {
        const testLine = currentTafsirLine + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth - 40 && currentTafsirLine) {
          tafsirLines.push(currentTafsirLine.trim());
          currentTafsirLine = word + " ";
        } else {
          currentTafsirLine = testLine;
        }
      }
      if (currentTafsirLine) tafsirLines.push(currentTafsirLine.trim());
      if (tafsirLines.length > 4) {
        tafsirLines = tafsirLines.slice(0, 4);
        tafsirLines[3] = tafsirLines[3] + "...";
      }
    }

    // Calculate positions
    const ayahHeight = lines.length * lineHeight;
    const tafsirHeight = tafsirLines.length * 45;
    const spacing = includeTafsir && tafsir ? 40 : 0;
    const totalHeight = ayahHeight + spacing + tafsirHeight;
    let startY = (height - totalHeight - 100) / 2 + 50;

    // Draw Ayah
    ctx.font = "700 56px 'Amiri', 'Traditional Arabic', serif";
    ctx.fillStyle = "#f5f5dc";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 4;
    for (const line of lines) {
      ctx.fillText(line, width / 2, startY);
      startY += lineHeight;
    }
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Draw tafsir if included
    if (includeTafsir && tafsirLines.length > 0) {
      startY += 30;
      ctx.font = "600 24px 'Cairo', sans-serif";
      ctx.fillStyle = "#d4af37";
      ctx.fillText("التفسير الميسر", width / 2, startY);
      startY += 45;
      ctx.font = "400 28px 'Cairo', sans-serif";
      ctx.fillStyle = "#e8e8d8";
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
      for (const line of tafsirLines) {
        ctx.fillText(line, width / 2, startY);
        startY += 45;
      }
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }

    // Reference
    ctx.font = "600 32px 'Cairo', sans-serif";
    ctx.fillStyle = "#d4af37";
    ctx.fillText(`${surahName} - آية ${ayahNumber}`, width / 2, height - 50);

    // Corners
    const drawCorner = (x: number, y: number, flip: boolean) => {
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      const size = 40;
      const direction = flip ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(x, y + direction * size);
      ctx.lineTo(x, y);
      ctx.lineTo(x + direction * size, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    drawCorner(40, 40, false);
    drawCorner(width - 40, 40, true);
    drawCorner(40, height - 40, false);
    drawCorner(width - 40, height - 40, true);

    // Branding
    ctx.font = "400 20px 'Cairo', sans-serif";
    ctx.fillStyle = "#d4af3780";
    ctx.textAlign = "left";
    ctx.fillText("إذاعة القرآن الكريم - القاهرة", 60, height - 90);

    setImageUrl(canvas.toDataURL("image/png"));
    setIsGenerating(false);
  }, [ayahText, surahName, ayahNumber, tafsir, includeTafsir]);

  useEffect(() => {
    if (isOpen && ayahText) void generateImage();
  }, [isOpen, ayahText, includeTafsir, generateImage]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ayah-${surahName}-${ayahNumber}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `ayah-${surahName}-${ayahNumber}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${surahName} - آية ${ayahNumber}`,
          text: ayahText,
          files: [file],
        });
      } else {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        alert("تم نسخ الصورة إلى الحافظة!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      handleDownload();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div
              className="glass-panel-elevated rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-primary/20">
                <h2 className="text-2xl font-bold text-primary">مشاركة الآية</h2>
                <button
                  onClick={onClose}
                  className="glass-button w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {tafsir && (
                <div className="px-6 pt-6 pb-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={includeTafsir}
                      onChange={(e) => setIncludeTafsir(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-primary/30 bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all"
                    />
                    <span className="text-sm sm:text-base text-primary font-medium group-hover:text-secondary transition-colors">
                      إضافة التفسير الميسر
                    </span>
                  </label>
                </div>
              )}
              <div className="p-6">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  imageUrl && (
                    <motion.img
                      src={imageUrl}
                      alt="معاينة الآية"
                      className="w-full rounded-2xl shadow-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    />
                  )
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-4 p-6 border-t border-primary/20">
                <button
                  onClick={handleShare}
                  disabled={isGenerating || !imageUrl}
                  className="flex-1 glass-button py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">مشاركة</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isGenerating || !imageUrl}
                  className="flex-1 glass-button py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-semibold">تحميل</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
