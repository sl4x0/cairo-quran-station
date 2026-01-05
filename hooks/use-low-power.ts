"use client";

import { useEffect } from "react";

// Call applyLowPower(true|false) when a low-power condition is detected or changes.
export function useLowPowerDetector(applyLowPower: (isLow: boolean) => void) {
  useEffect(() => {
    let isMounted = true;
    let connChangeHandler: (() => void) | null = null;
    let batteryCleanup: (() => void) | null = null;

    try {
      const nav = navigator as any;

      if (nav?.connection && typeof nav.connection.saveData === "boolean") {
        const conn = nav.connection;
        applyLowPower(conn.saveData === true);
        connChangeHandler = () => applyLowPower(conn.saveData === true);
        try {
          conn.addEventListener?.("change", connChangeHandler);
        } catch (e) {
          // ignore if the platform doesn't allow addEventListener
        }
        return () => {
          try {
            conn.removeEventListener?.(
              "change",
              connChangeHandler as EventListener
            );
          } catch {}
        };
      }

      if (typeof nav?.getBattery === "function") {
        nav
          .getBattery()
          .then((bat: any) => {
            if (!isMounted) return;
            applyLowPower(bat.level < 0.25);
            const handle = () => applyLowPower(bat.level < 0.25);
            try {
              bat.addEventListener?.("levelchange", handle);
              batteryCleanup = () => {
                try {
                  bat.removeEventListener?.("levelchange", handle);
                } catch {}
              };
            } catch {}
          })
          .catch(() => {});
      }
    } catch (err) {
      // Defensive: don't crash if feature detection throws
      // We intentionally swallow errors here; the app can continue.
    }

    return () => {
      isMounted = false;
      try {
        const nav = navigator as any;
        if (connChangeHandler && nav?.connection) {
          try {
            nav.connection.removeEventListener?.(
              "change",
              connChangeHandler as EventListener
            );
          } catch {}
        }
      } catch {}
      if (batteryCleanup) batteryCleanup();
    };
  }, [applyLowPower]);
}
