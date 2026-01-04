import { useEffect, useRef, useCallback } from "react";
import { getPreference } from "@/lib/preferences";
import { toArabicNum } from "@/lib/arabic-numerals";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const PRAYER_NAMES_AR = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export function usePrayerNotifications(prayerTimes: PrayerTimes | null) {
  const notificationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const permissionRequestedRef = useRef(false);

  const requestPermission = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      permissionRequestedRef.current
    ) {
      return;
    }

    permissionRequestedRef.current = true;

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const scheduleNotification = useCallback(
    (prayerName: keyof typeof PRAYER_NAMES_AR, prayerTime: string) => {
      const notificationsEnabled = getPreference("notificationsEnabled");
      if (!notificationsEnabled || Notification.permission !== "granted") {
        return;
      }

      const minutesBefore = getPreference("notificationTimeBefore");
      const [hours, minutes] = prayerTime.split(":").map(Number);

      const now = new Date();
      const prayerDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );

      // Subtract notification time
      const notificationDate = new Date(
        prayerDate.getTime() - minutesBefore * 60 * 1000
      );

      const timeUntilNotification = notificationDate.getTime() - now.getTime();

      if (timeUntilNotification > 0) {
        const timeout = setTimeout(() => {
          try {
            const prayerNameAr = PRAYER_NAMES_AR[prayerName];
            const timeAr = `${toArabicNum(hours)}:${toArabicNum(
              minutes.toString().padStart(2, "0")
            )}`;

            new Notification("موعد الصلاة", {
              body: `حان موعد صلاة ${prayerNameAr} في ${timeAr}`,
              icon: "/icon-radio.svg",
              badge: "/icon-radio.svg",
              tag: `prayer-${prayerName}`,
              requireInteraction: false,
              silent: false,
              dir: "rtl",
              lang: "ar",
            });
          } catch (error) {
            console.error("Error showing notification:", error);
          }
        }, timeUntilNotification);

        notificationTimeoutsRef.current.push(timeout);
      }
    },
    []
  );

  useEffect(() => {
    if (!prayerTimes) return;

    // Clear existing timeouts
    notificationTimeoutsRef.current.forEach(clearTimeout);
    notificationTimeoutsRef.current = [];

    // Schedule notifications for each prayer
    Object.entries(prayerTimes).forEach(([name, time]) => {
      if (name !== "Sunrise" && time) {
        scheduleNotification(
          name as keyof typeof PRAYER_NAMES_AR,
          time as string
        );
      }
    });

    return () => {
      notificationTimeoutsRef.current.forEach(clearTimeout);
      notificationTimeoutsRef.current = [];
    };
  }, [prayerTimes, scheduleNotification]);

  return { requestPermission };
}
