export type TimePhase = "dawn" | "day" | "sunset" | "night"

export function getTimePhase(): TimePhase {
  const hour = new Date().getHours()

  if (hour >= 4 && hour < 6) return "dawn"
  if (hour >= 6 && hour < 17) return "day"
  if (hour >= 17 && hour < 19) return "sunset"
  return "night"
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
  }

  return configs[phase]
}
