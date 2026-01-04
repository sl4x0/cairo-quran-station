export type TimePhase = "dawn" | "day" | "sunset" | "night";

function timeToHours(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
}

export function getTimePhase(prayerTimes?: {
  Fajr: string;
  Sunrise?: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}): TimePhase {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  // Use real prayer times if available, otherwise fallback to approximations
  const fajr = prayerTimes ? timeToHours(prayerTimes.Fajr) : 4.5;
  const sunrise = prayerTimes?.Sunrise
    ? timeToHours(prayerTimes.Sunrise)
    : fajr + 1.5;
  const asr = prayerTimes ? timeToHours(prayerTimes.Asr) : 15.25;
  const maghrib = prayerTimes ? timeToHours(prayerTimes.Maghrib) : 17.75;

  // Dawn: From Fajr to Sunrise
  if (currentHour >= fajr && currentHour < sunrise) {
    return "dawn";
  }
  // Day: From Sunrise to Asr
  if (currentHour >= sunrise && currentHour < asr) {
    return "day";
  }
  // Sunset: From Asr to Maghrib (golden hour)
  if (currentHour >= asr && currentHour < maghrib) {
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
