import { beforeEach, describe, expect, test } from "vitest";
import {
  resetPreferences,
  savePreference,
  getPreference,
} from "@/lib/preferences";

describe("preferences module", () => {
  beforeEach(() => {
    resetPreferences();
  });

  test("default preferences have notifications disabled", () => {
    const notifications = getPreference("notificationsEnabled");
    expect(notifications).toBe(false);
  });

  test("save and read notificationsEnabled", () => {
    savePreference("notificationsEnabled", true);
    expect(getPreference("notificationsEnabled")).toBe(true);
  });

  test("save and read notificationTimeBefore", () => {
    savePreference("notificationTimeBefore", 15);
    expect(getPreference("notificationTimeBefore")).toBe(15);
  });
});
