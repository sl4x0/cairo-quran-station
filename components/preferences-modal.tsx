"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Bell, BellOff } from "lucide-react";
import { useState, useEffect } from "react";
import { getPreferences, savePreference } from "@/lib/preferences";
import { Slider } from "./slider";
import { Toggle } from "./toggle";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVolumeChange: (volume: number) => void;
  currentVolume: number;
}

export function PreferencesModal({
  isOpen,
  onClose,
  onVolumeChange,
  currentVolume,
}: PreferencesModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleVolumeChange = (volume: number) => {
    savePreference("volume", volume);
    onVolumeChange(volume);
  };

  // Notification controls (kept simple and accessible)
  const initialPrefs = getPreferences();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    initialPrefs.notificationsEnabled ?? false
  );
  const [notificationTimeBefore, setNotificationTimeBefore] = useState<number>(
    initialPrefs.notificationTimeBefore ?? 10
  );

  const handleNotificationsToggle = (next?: boolean) => {
    const newValue = typeof next === "boolean" ? next : !notificationsEnabled;
    setNotificationsEnabled(newValue);
    savePreference("notificationsEnabled", newValue);

    if (newValue && typeof window !== "undefined" && "Notification" in window) {
      // request permission but don't block
      Notification.requestPermission().catch(() => {});
    }
  };

  const handleNotificationTimeChange = (minutes: number) => {
    setNotificationTimeBefore(minutes);
    savePreference("notificationTimeBefore", minutes);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div
              className="glass-panel-elevated rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide pr-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/20">
                <h2 className="text-2xl font-bold text-primary">الإعدادات</h2>
                <button
                  onClick={onClose}
                  className="glass-button w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Volume Default */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      مستوى الصوت الافتراضي
                    </h3>
                  </div>
                  <div className="glass-panel p-4 rounded-xl">
                    <Slider
                      value={[currentVolume]}
                      onValueChange={(val) => handleVolumeChange(val[0])}
                      min={0}
                      max={100}
                      step={1}
                    />
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {currentVolume}%
                    </p>
                  </div>
                </div>

                {/* Prayer Notifications */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {notificationsEnabled ? (
                        <Bell className="w-5 h-5 text-primary" />
                      ) : (
                        <BellOff className="w-5 h-5 text-muted-foreground" />
                      )}
                      <h3 className="text-lg font-semibold text-foreground">
                        تنبيهات الصلاة
                      </h3>
                    </div>
                    {/* Reusable Toggle component */}
                    <Toggle
                      checked={notificationsEnabled}
                      onChange={handleNotificationsToggle}
                      ariaLabel={
                        notificationsEnabled
                          ? "إيقاف تنبيهات الصلاة"
                          : "تفعيل تنبيهات الصلاة"
                      }
                      size="lg"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: notificationsEnabled ? 1 : 0,
                      height: notificationsEnabled ? "auto" : 0,
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-panel p-4 rounded-xl space-y-3"
                    aria-hidden={!notificationsEnabled}
                  >
                    <label className="text-sm text-foreground block">
                      التنبيه قبل الأذان بـ:
                    </label>
                    <div className="relative">
                      <select
                        value={notificationTimeBefore}
                        onChange={(e) =>
                          handleNotificationTimeChange(Number(e.target.value))
                        }
                        className="w-full appearance-none glass-button p-4 rounded-xl text-foreground bg-transparent focus:ring-2 focus:ring-primary focus:outline-none pr-10"
                        aria-label="التنبيه قبل الأذان"
                      >
                        <option value={5} className="bg-[#1a2332]">
                          ٥ دقائق
                        </option>
                        <option value={10} className="bg-[#1a2332]">
                          ١٠ دقائق
                        </option>
                        <option value={15} className="bg-[#1a2332]">
                          ١٥ دقيقة
                        </option>
                        <option value={30} className="bg-[#1a2332]">
                          ٣٠ دقيقة
                        </option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M6 8l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      قد يتطلب النظام إذن عرض الإشعارات؛ تأكد من السماح به في
                      إعدادات المتصفح.
                    </p>
                  </motion.div>
                </div>

                {/* Info Note */}
                <div className="glass-panel p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    💡 يتم حفظ جميع الإعدادات تلقائيًا في متصفحك
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
