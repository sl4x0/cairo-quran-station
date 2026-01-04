import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getTimePhase, getPhaseConfig } from "@/lib/time-phase";

describe("getTimePhase", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns dawn phase between Fajr and Sunrise (04:30 - 06:00)", () => {
    vi.setSystemTime(new Date(2025, 0, 1, 5, 0)); // 05:00
    expect(getTimePhase()).toBe("dawn");
  });

  it("returns day phase between Sunrise and Asr (06:00 - 15:15)", () => {
    vi.setSystemTime(new Date(2025, 0, 1, 12, 0)); // 12:00
    expect(getTimePhase()).toBe("day");
  });

  it("returns sunset phase between Asr and Maghrib (15:15 - 17:45)", () => {
    vi.setSystemTime(new Date(2025, 0, 1, 16, 0)); // 16:00
    expect(getTimePhase()).toBe("sunset");
  });

  it("returns night phase after Maghrib (17:45 onwards)", () => {
    vi.setSystemTime(new Date(2025, 0, 1, 20, 0)); // 20:00
    expect(getTimePhase()).toBe("night");
  });

  it("returns night phase before Fajr (before 04:30)", () => {
    vi.setSystemTime(new Date(2025, 0, 1, 3, 0)); // 03:00
    expect(getTimePhase()).toBe("night");
  });
});

describe("getPhaseConfig", () => {
  it("returns correct config for dawn", () => {
    const config = getPhaseConfig("dawn");
    expect(config.name).toBe("فجر");
    expect(config.icon).toBe("sunrise");
    expect(config.color).toBe("#a78bfa");
  });

  it("returns correct config for day", () => {
    const config = getPhaseConfig("day");
    expect(config.name).toBe("نهار");
    expect(config.icon).toBe("sun");
    expect(config.color).toBe("#eab308");
  });

  it("returns correct config for sunset", () => {
    const config = getPhaseConfig("sunset");
    expect(config.name).toBe("مغرب");
    expect(config.icon).toBe("sunset");
    expect(config.color).toBe("#fb923c");
  });

  it("returns correct config for night", () => {
    const config = getPhaseConfig("night");
    expect(config.name).toBe("ليل");
    expect(config.icon).toBe("moon");
    expect(config.color).toBe("#94a3b8");
  });
});
