export type TimePhase = "dawn" | "day" | "sunset" | "night";

// Prayer times for Cairo (approximate, used for theme calculation)
// Fajr ~04:30, Sunrise ~06:00, Asr ~15:15, Maghrib ~17:45, Isha ~19:15
const CAIRO_PRAYER_TIMES = {
  fajr: 4.5, // 04:30
  sunrise: 6.0, // 06:00 (15-20 min after Fajr)
  asr: 15.25, // 15:15
  maghrib: 17.75, // 17:45
  isha: 19.25, // 19:15
};

export function getTimePhase(): TimePhase {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  // Dawn: From Fajr to Sunrise
  if (hour >= CAIRO_PRAYER_TIMES.fajr && hour < CAIRO_PRAYER_TIMES.sunrise) {
    return "dawn";
  }
  // Day: From Sunrise to Asr
  if (hour >= CAIRO_PRAYER_TIMES.sunrise && hour < CAIRO_PRAYER_TIMES.asr) {
    return "day";
  }
  // Sunset: From Asr to Maghrib (golden hour)
  if (hour >= CAIRO_PRAYER_TIMES.asr && hour < CAIRO_PRAYER_TIMES.maghrib) {
    return "sunset";
  }
  // Night: From Maghrib to Fajr (next day)
  return "night";
}

export function getPhaseConfig(phase: TimePhase) {
  const configs = {
    dawn: {
      bgClass: "bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0f172a]",
      name: "فجر",
      icon: "sunrise",
      color: "#a78bfa",
    },
    day: {
      bgClass: "bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#020617]",
      name: "نهار",
      icon: "sun",
      color: "#eab308",
    },
    sunset: {
      bgClass: "bg-gradient-to-br from-[#7c2d12] via-[#581c87] to-[#020617]",
      name: "مغرب",
      icon: "sunset",
      color: "#fb923c",
    },
    night: {
      bgClass: "bg-[#020617]",
      name: "ليل",
      icon: "moon",
      color: "#94a3b8",
    },
  };

  return configs[phase];
}
