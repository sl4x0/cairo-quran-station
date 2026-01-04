"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Moon, Sun, Monitor, Bell, BellOff } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getPreferences,
  savePreference,
  type UserPreferences,
} from "@/lib/preferences";
import { Slider } from "./slider";

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
  const [preferences, setPreferences] = useState<UserPreferences>(
    getPreferences()
  );

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

  const handleThemeChange = (theme: UserPreferences["theme"]) => {
    setPreferences((prev) => ({ ...prev, theme }));
    savePreference("theme", theme);
  };

  const handleNotificationsToggle = () => {
    const newValue = !preferences.notificationsEnabled;
    setPreferences((prev) => ({ ...prev, notificationsEnabled: newValue }));
    savePreference("notificationsEnabled", newValue);

    if (newValue && typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  };

  const handleNotificationTimeChange = (minutes: number) => {
    setPreferences((prev) => ({ ...prev, notificationTimeBefore: minutes }));
    savePreference("notificationTimeBefore", minutes);
  };

  const handleVolumeChange = (volume: number) => {
    savePreference("volume", volume);
    onVolumeChange(volume);
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
              className="glass-panel-elevated rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/20">
                <h2 className="text-2xl font-bold text-primary">الإعدادات</h2>
                <button
                  onClick={onClose}
                  className="glass-button w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
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

                {/* Theme Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      المظهر
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    تتغير الخلفية تلقائيًا حسب أوقات الصلاة
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`glass-button p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        preferences.theme === "light"
                          ? "bg-primary/20 border-2 border-primary"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Sun className="w-6 h-6" />
                      <span className="text-sm">فاتح</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`glass-button p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        preferences.theme === "dark"
                          ? "bg-primary/20 border-2 border-primary"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Moon className="w-6 h-6" />
                      <span className="text-sm">داكن</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`glass-button p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        preferences.theme === "system"
                          ? "bg-primary/20 border-2 border-primary"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Monitor className="w-6 h-6" />
                      <span className="text-sm">تلقائي</span>
                    </button>
                  </div>
                </div>

                {/* Prayer Notifications */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {preferences.notificationsEnabled ? (
                        <Bell className="w-5 h-5 text-primary" />
                      ) : (
                        <BellOff className="w-5 h-5 text-muted-foreground" />
                      )}
                      <h3 className="text-lg font-semibold text-foreground">
                        تنبيهات الصلاة
                      </h3>
                    </div>
                    <button
                      onClick={handleNotificationsToggle}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        preferences.notificationsEnabled
                          ? "bg-primary"
                          : "bg-gray-600"
                      }`}
                      role="switch"
                      aria-checked={preferences.notificationsEnabled}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          preferences.notificationsEnabled
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {preferences.notificationsEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-panel p-4 rounded-xl space-y-3"
                    >
                      <label className="text-sm text-foreground block">
                        التنبيه قبل الأذان بـ:
                      </label>
                      <select
                        value={preferences.notificationTimeBefore}
                        onChange={(e) =>
                          handleNotificationTimeChange(Number(e.target.value))
                        }
                        className="w-full glass-button p-3 rounded-xl text-foreground bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value={5} className="bg-slate-800">
                          ٥ دقائق
                        </option>
                        <option value={10} className="bg-slate-800">
                          ١٠ دقائق
                        </option>
                        <option value={15} className="bg-slate-800">
                          ١٥ دقيقة
                        </option>
                        <option value={30} className="bg-slate-800">
                          ٣٠ دقيقة
                        </option>
                      </select>
                    </motion.div>
                  )}
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
