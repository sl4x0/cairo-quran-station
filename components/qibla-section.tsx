"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Compass, MapPin, RefreshCw, Navigation } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Kaaba coordinates
const KAABA_LAT = 21.4225
const KAABA_LON = 39.8262

function calculateQiblaDirection(lat: number, lon: number): number {
  const latRad = (lat * Math.PI) / 180
  const lonRad = (lon * Math.PI) / 180
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180
  const kaabaLonRad = (KAABA_LON * Math.PI) / 180

  const y = Math.sin(kaabaLonRad - lonRad)
  const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLonRad - lonRad)

  let qibla = (Math.atan2(y, x) * 180) / Math.PI
  qibla = (qibla + 360) % 360

  return qibla
}

export function QiblaSection() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
  const [deviceHeading, setDeviceHeading] = useState<number>(0)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasCompass, setHasCompass] = useState(false)

  // Get user location
  const getLocation = useCallback(() => {
    setIsLoading(true)
    setError(null)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          setLocation({ lat, lon })
          const direction = calculateQiblaDirection(lat, lon)
          setQiblaDirection(direction)
          setLocationName(`${lat.toFixed(4)}, ${lon.toFixed(4)}`)
          setIsLoading(false)
        },
        (err) => {
          setError("لم نتمكن من تحديد موقعك. يرجى السماح بالوصول للموقع.")
          setIsLoading(false)
          // Default to Cairo
          const direction = calculateQiblaDirection(30.0444, 31.2357)
          setQiblaDirection(direction)
          setLocationName("القاهرة (افتراضي)")
        },
      )
    } else {
      setError("متصفحك لا يدعم تحديد الموقع")
      setIsLoading(false)
    }
  }, [])

  // Initialize compass
  useEffect(() => {
    getLocation()

    // Check for device orientation support
    if ("DeviceOrientationEvent" in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setHasCompass(true)
          // For iOS
          if ("webkitCompassHeading" in event) {
            setDeviceHeading((event as DeviceOrientationEvent & { webkitCompassHeading: number }).webkitCompassHeading)
          } else {
            // For Android
            setDeviceHeading(360 - event.alpha)
          }
        }
      }

      // Request permission for iOS 13+
      if (
        typeof (DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> })
          .requestPermission === "function"
      ) {
        ;(DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission: () => Promise<string> })
          .requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation)
            }
          })
      } else {
        window.addEventListener("deviceorientation", handleOrientation)
      }

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation)
      }
    }
  }, [getLocation])

  const compassRotation = qiblaDirection !== null ? qiblaDirection - deviceHeading : 0

  return (
    <section
      className="py-12 sm:py-20 bg-gradient-to-b from-emerald-50/50 to-muted/50 dark:from-emerald-950/20 dark:to-muted/20"
      id="qibla"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4 sm:mb-6">
            <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            اتجاه القبلة
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">حدد اتجاه القبلة من موقعك الحالي</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />
            <CardContent className="p-4 sm:p-8 space-y-6">
              {/* Location */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{locationName || "جاري تحديد الموقع..."}</span>
                <Button variant="ghost" size="sm" onClick={getLocation} disabled={isLoading} className="text-primary">
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>

              {error && <p className="text-center text-destructive text-sm">{error}</p>}

              {/* Compass */}
              <div className="relative flex justify-center py-4">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                  {/* Compass Background */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 dark:from-emerald-900/50 dark:to-amber-900/50 shadow-inner" />

                  {/* Direction Markers */}
                  <div className="absolute inset-4 rounded-full border-2 border-emerald-200 dark:border-emerald-700">
                    {["N", "E", "S", "W"].map((dir, i) => (
                      <div
                        key={dir}
                        className="absolute text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300"
                        style={{
                          top: i === 0 ? "5%" : i === 2 ? "85%" : "45%",
                          left: i === 1 ? "85%" : i === 3 ? "5%" : "47%",
                        }}
                      >
                        {dir === "N" ? "ش" : dir === "E" ? "شر" : dir === "S" ? "ج" : "غ"}
                      </div>
                    ))}
                  </div>

                  {/* Qibla Arrow */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: compassRotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Navigation className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400 transform -rotate-45" />
                    </div>
                  </motion.div>

                  {/* Center Kaaba Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-stone-900 flex items-center justify-center shadow-lg">
                      <span className="text-amber-400 text-lg sm:text-xl">🕋</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direction Info */}
              {qiblaDirection !== null && (
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">اتجاه القبلة من موقعك</p>
                  <p className="text-3xl font-bold text-primary">{qiblaDirection.toFixed(1)}°</p>
                  {!hasCompass && (
                    <p className="text-xs text-muted-foreground">وجّه الهاتف نحو الشمال ثم أدر حتى يشير السهم للأمام</p>
                  )}
                </div>
              )}

              {/* Distance to Kaaba */}
              {location && (
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">المسافة إلى الكعبة المشرفة</p>
                  <p className="text-lg font-bold text-primary">
                    {Math.round(
                      6371 *
                        Math.acos(
                          Math.sin((location.lat * Math.PI) / 180) * Math.sin((KAABA_LAT * Math.PI) / 180) +
                            Math.cos((location.lat * Math.PI) / 180) *
                              Math.cos((KAABA_LAT * Math.PI) / 180) *
                              Math.cos(((KAABA_LON - location.lon) * Math.PI) / 180),
                        ),
                    ).toLocaleString("ar-EG")}{" "}
                    كم
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
