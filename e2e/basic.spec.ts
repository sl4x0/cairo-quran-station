import { test, expect } from "@playwright/test";

test.describe("Cairo Quran Station", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/إذاعة القرآن الكريم/);

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });

  test("should have functional play/pause button", async ({ page }) => {
    await page.goto("/");

    const playButton = page.getByRole("button", {
      name: /تشغيل البث|إيقاف البث/,
    });
    await expect(playButton).toBeVisible();
    await expect(playButton).toBeEnabled();
  });

  test("should display prayer times section", async ({ page }) => {
    await page.goto("/");

    const prayerSection = page.getByRole("region", { name: /مواقيت الصلاة/ });
    await expect(prayerSection).toBeVisible();
  });

  test("should display ayah of the day", async ({ page }) => {
    await page.goto("/");

    const ayahSection = page.getByRole("region", { name: /آية اليوم/ });
    await expect(ayahSection).toBeVisible();
  });

  test("should have accessible volume controls", async ({ page }) => {
    await page.goto("/");

    const volumeRegion = page.getByRole("region", {
      name: /التحكم في مستوى الصوت/,
    });
    await expect(volumeRegion).toBeVisible();

    const slider = page.getByRole("slider", { name: /مستوى الصوت/ });
    await expect(slider).toBeVisible();
  });

  test("should have keyboard navigation support", async ({ page }) => {
    await page.goto("/");

    // Press Tab to navigate to first interactive element
    await page.keyboard.press("Tab");

    // Check if skip link is focused
    const skipLink = page.getByText(/انتقل إلى المحتوى الرئيسي/);
    await expect(skipLink).toBeFocused();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const playButton = page.getByRole("button", {
      name: /تشغيل البث|إيقاف البث/,
    });
    await expect(playButton).toBeVisible();
  });

  test("should have proper RTL layout", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", "ar");
  });
});
