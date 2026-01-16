"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  SkipBack,
  SkipForward,
  Repeat,
  Search,
  AlertCircle,
  Loader2,
  Music,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { fetchSurahList, type QuranSurah, quranReciters, getSurahAudioUrl, getBackupAudioUrl } from "@/lib/api"

const LIVE_STREAM_URLS = [
  "https://n13.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABm8buRZIAJuHNizx1joQL5g",
  "https://stream.radiojar.com/8s5u5tpdtwzuv",
  "https://Qurango.net/radio/tarateel",
]

export function QuranPlayerSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLive, setIsLive] = useState(true)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState([0])
  const [currentTime, setCurrentTime] = useState("00:00")
  const [duration, setDuration] = useState("00:00")
  const [selectedReciter, setSelectedReciter] = useState(quranReciters[0].id)
  const [selectedSurah, setSelectedSurah] = useState("1")
  const [isRepeat, setIsRepeat] = useState(false)
  const [surahs, setSurahs] = useState<QuranSurah[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrlIndex, setAudioUrlIndex] = useState(0)
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentReciter = quranReciters.find((r) => r.id === selectedReciter)
  const currentSurah = surahs.find((s) => s.number.toString() === selectedSurah)

  useEffect(() => {
    async function loadSurahs() {
      const data = await fetchSurahList()
      if (data) {
        setSurahs(data)
      } else {
        // Fallback basic surah list
        const fallbackSurahs: QuranSurah[] = [
          {
            number: 1,
            name: "الفاتحة",
            englishName: "Al-Fatiha",
            englishNameTranslation: "The Opening",
            numberOfAyahs: 7,
            revelationType: "Meccan",
          },
          {
            number: 2,
            name: "البقرة",
            englishName: "Al-Baqara",
            englishNameTranslation: "The Cow",
            numberOfAyahs: 286,
            revelationType: "Medinan",
          },
          {
            number: 3,
            name: "آل عمران",
            englishName: "Aal-Imran",
            englishNameTranslation: "The Family of Imran",
            numberOfAyahs: 200,
            revelationType: "Medinan",
          },
          {
            number: 36,
            name: "يس",
            englishName: "Ya-Sin",
            englishNameTranslation: "Ya Sin",
            numberOfAyahs: 83,
            revelationType: "Meccan",
          },
          {
            number: 55,
            name: "الرحمن",
            englishName: "Ar-Rahman",
            englishNameTranslation: "The Beneficent",
            numberOfAyahs: 78,
            revelationType: "Medinan",
          },
          {
            number: 56,
            name: "الواقعة",
            englishName: "Al-Waqi'a",
            englishNameTranslation: "The Event",
            numberOfAyahs: 96,
            revelationType: "Meccan",
          },
          {
            number: 67,
            name: "الملك",
            englishName: "Al-Mulk",
            englishNameTranslation: "The Sovereignty",
            numberOfAyahs: 30,
            revelationType: "Meccan",
          },
          {
            number: 112,
            name: "الإخلاص",
            englishName: "Al-Ikhlas",
            englishNameTranslation: "Sincerity",
            numberOfAyahs: 4,
            revelationType: "Meccan",
          },
          {
            number: 113,
            name: "الفلق",
            englishName: "Al-Falaq",
            englishNameTranslation: "The Dawn",
            numberOfAyahs: 5,
            revelationType: "Meccan",
          },
          {
            number: 114,
            name: "الناس",
            englishName: "An-Nas",
            englishNameTranslation: "Mankind",
            numberOfAyahs: 6,
            revelationType: "Meccan",
          },
        ]
        setSurahs(fallbackSurahs)
      }
    }
    loadSurahs()
  }, [])

  const filteredSurahs = surahs.filter(
    (s) => s.name.includes(searchQuery) || s.englishName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getAllAudioUrls = useCallback(() => {
    if (isLive) return LIVE_STREAM_URLS

    const reciter = quranReciters.find((r) => r.id === selectedReciter)
    if (!reciter) return []

    const surahNum = Number.parseInt(selectedSurah)
    const primaryUrl = getSurahAudioUrl(surahNum, reciter)
    const backupUrls = getBackupAudioUrl(surahNum, selectedReciter)

    return [primaryUrl, ...backupUrls]
  }, [isLive, selectedReciter, selectedSurah])

  const getAudioUrl = useCallback(() => {
    const urls = getAllAudioUrls()
    return urls[audioUrlIndex] || urls[0]
  }, [getAllAudioUrls, audioUrlIndex])

  useEffect(() => {
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout)
    }
  }, [loadingTimeout])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (audio.duration && !isLive && isFinite(audio.duration)) {
        const progressValue = (audio.currentTime / audio.duration) * 100
        setProgress([progressValue])
        const mins = Math.floor(audio.currentTime / 60)
        const secs = Math.floor(audio.currentTime % 60)
        setCurrentTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`)
      }
    }

    const handleLoadedMetadata = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      if (audio.duration && !isLive && isFinite(audio.duration)) {
        const mins = Math.floor(audio.duration / 60)
        const secs = Math.floor(audio.duration % 60)
        setDuration(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`)
      }
      setIsLoading(false)
      setError(null)
    }

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        const currentSurahNum = Number.parseInt(selectedSurah)
        if (currentSurahNum < 114) {
          setSelectedSurah((currentSurahNum + 1).toString())
          setAudioUrlIndex(0)
          setTimeout(() => playAudio(), 500)
        } else {
          setIsPlaying(false)
          setProgress([0])
        }
      }
    }

    const handleWaiting = () => setIsLoading(true)

    const handlePlaying = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      setIsLoading(false)
      setError(null)
    }

    const handleCanPlay = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      setIsLoading(false)
      setError(null)
    }

    const handleError = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      const urls = getAllAudioUrls()

      if (audioUrlIndex < urls.length - 1) {
        console.log(`[v0] Trying backup URL ${audioUrlIndex + 1}`)
        setAudioUrlIndex((prev) => prev + 1)
      } else {
        setError("تعذر تشغيل الصوت. يرجى المحاولة مرة أخرى.")
        setIsLoading(false)
        setIsPlaying(false)
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [isLive, isRepeat, audioUrlIndex, getAllAudioUrls, selectedSurah, loadingTimeout])

  useEffect(() => {
    if (isPlaying && audioRef.current && audioUrlIndex > 0) {
      const audio = audioRef.current
      const newUrl = getAudioUrl()
      console.log(`[v0] Switching to URL: ${newUrl}`)
      audio.src = newUrl
      audio.load()
      audio.play().catch(() => {
        const urls = getAllAudioUrls()
        if (audioUrlIndex < urls.length - 1) {
          setAudioUrlIndex((prev) => prev + 1)
        } else {
          setError("تعذر تشغيل الصوت من جميع المصادر.")
          setIsLoading(false)
          setIsPlaying(false)
        }
      })
    }
  }, [audioUrlIndex, isPlaying, getAudioUrl, getAllAudioUrls])

  const playAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    setIsLoading(true)
    setError(null)

    const url = getAudioUrl()
    console.log(`[v0] Playing URL: ${url}`)

    audio.src = url
    audio.load()

    const timeout = setTimeout(() => {
      const urls = getAllAudioUrls()
      if (audioUrlIndex < urls.length - 1) {
        console.log(`[v0] Timeout - trying next URL`)
        setAudioUrlIndex((prev) => prev + 1)
      } else {
        setError("تعذر تشغيل الصوت. تحقق من اتصالك بالإنترنت.")
        setIsLoading(false)
        setIsPlaying(false)
      }
    }, 10000) // 10 second timeout

    setLoadingTimeout(timeout)

    try {
      await audio.play()
      clearTimeout(timeout)
      setIsPlaying(true)
      setIsLoading(false)
    } catch (err) {
      clearTimeout(timeout)
      const urls = getAllAudioUrls()
      if (audioUrlIndex < urls.length - 1) {
        setAudioUrlIndex((prev) => prev + 1)
      } else {
        setError("تعذر تشغيل الصوت. تأكد من اتصالك بالإنترنت.")
        setIsLoading(false)
      }
    }
  }

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    setError(null)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      if (loadingTimeout) clearTimeout(loadingTimeout)
    } else {
      setAudioUrlIndex(0)
      await playAudio()
    }
  }

  const toggleLive = () => {
    if (loadingTimeout) clearTimeout(loadingTimeout)
    setIsLive(!isLive)
    setIsPlaying(false)
    setProgress([0])
    setError(null)
    setAudioUrlIndex(0)
    setCurrentTime("00:00")
    setDuration("00:00")
    setIsLoading(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100
    }
  }, [volume, isMuted])

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration && !isLive && isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration
      setProgress(value)
    }
  }

  const changeSurah = (direction: "prev" | "next") => {
    if (loadingTimeout) clearTimeout(loadingTimeout)
    const currentSurahNum = Number.parseInt(selectedSurah)
    let newSurahNum = direction === "next" ? currentSurahNum + 1 : currentSurahNum - 1

    if (newSurahNum < 1) newSurahNum = 114
    if (newSurahNum > 114) newSurahNum = 1

    setSelectedSurah(newSurahNum.toString())
    setAudioUrlIndex(0)
    setProgress([0])
    setCurrentTime("00:00")
    setIsLoading(false)
    setError(null)

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
      setTimeout(() => playAudio(), 300)
    }
  }

  useEffect(() => {
    if (!isLive && audioRef.current) {
      if (loadingTimeout) clearTimeout(loadingTimeout)
      audioRef.current.pause()
      setIsPlaying(false)
      setProgress([0])
      setCurrentTime("00:00")
      setDuration("00:00")
      setAudioUrlIndex(0)
      setIsLoading(false)
      setError(null)
    }
  }, [selectedSurah, selectedReciter, isLive])

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-muted/50 to-primary/5" id="player">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            مشغّل القرآن الكريم
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            استمع إلى تلاوات عطرة من أشهر القراء أو البث المباشر
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 rounded-3xl">
            {/* Player Header */}
            <div className="bg-gradient-to-l from-emerald-700/50 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                  {isLive ? (
                    <Radio className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                  ) : (
                    <Music className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg sm:text-xl">محطة القرآن الكريم</h3>
                  <p className="text-emerald-200 text-sm">{isLive ? "بث مباشر" : "استمع للقرآن الكريم"}</p>
                </div>
              </div>
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={toggleLive}
                className={`w-full sm:w-auto text-sm px-4 py-2 rounded-xl ${
                  isLive
                    ? "bg-red-500 hover:bg-red-600 text-white border-none"
                    : "border-emerald-500 text-emerald-300 hover:bg-emerald-800 bg-transparent"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ml-2 ${isLive ? "bg-white animate-pulse" : "bg-emerald-400"}`} />
                {isLive ? "بث مباشر" : "اختر سورة"}
              </Button>
            </div>

            <CardContent className="p-4 sm:p-6 space-y-5">
              <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 rounded-xl text-red-200 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setError(null)
                      setAudioUrlIndex(0)
                      playAudio()
                    }}
                    className="mr-auto text-red-200 hover:text-white hover:bg-red-500/30 rounded-lg"
                  >
                    <RefreshCw className="w-4 h-4 ml-1" />
                    إعادة المحاولة
                  </Button>
                </div>
              )}

              {/* Selectors - Only show when not live */}
              {!isLive && (
                <div className="space-y-4">
                  <div>
                    <label className="text-emerald-200 text-sm mb-2 block font-medium">اختر القارئ</label>
                    <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                      <SelectTrigger className="bg-emerald-800/50 border-emerald-700 text-white rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {quranReciters.map((reciter) => (
                          <SelectItem key={reciter.id} value={reciter.id}>
                            {reciter.arabicName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-emerald-200 text-sm mb-2 block font-medium">اختر السورة</label>
                    <div className="relative mb-2">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <Input
                        placeholder="ابحث عن سورة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 bg-emerald-800/50 border-emerald-700 text-white placeholder:text-emerald-400 rounded-xl h-12"
                      />
                    </div>
                    <Select value={selectedSurah} onValueChange={setSelectedSurah}>
                      <SelectTrigger className="bg-emerald-800/50 border-emerald-700 text-white rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {filteredSurahs.map((surah) => (
                          <SelectItem key={surah.number} value={surah.number.toString()}>
                            {surah.number}. {surah.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Now Playing Info */}
              <div className="text-center py-6 bg-emerald-800/30 rounded-2xl">
                <p className="text-emerald-300 text-sm mb-2">{isLive ? "جاري البث المباشر" : "يتلو الآن"}</p>
                <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  {isLive ? "إذاعة القرآن الكريم" : currentSurah?.name || "الفاتحة"}
                </h4>
                {!isLive && <p className="text-amber-300 text-lg">{currentReciter?.arabicName}</p>}
                {isLoading && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                    <span className="text-emerald-200 text-sm">جاري التحميل...</span>
                  </div>
                )}
              </div>

              {/* Progress Bar - Only show when not live */}
              {!isLive && (
                <div className="space-y-2">
                  <Slider
                    value={progress}
                    onValueChange={handleProgressChange}
                    max={100}
                    step={0.1}
                    className="[&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-0 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4"
                  />
                  <div className="flex justify-between text-xs text-emerald-300 font-mono">
                    <span dir="ltr">{currentTime}</span>
                    <span dir="ltr">{duration}</span>
                  </div>
                </div>
              )}

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {!isLive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-emerald-300 hover:text-white hover:bg-emerald-700 rounded-xl w-10 h-10 sm:w-12 sm:h-12 ${isRepeat ? "bg-emerald-700" : ""}`}
                    onClick={() => setIsRepeat(!isRepeat)}
                    title="تكرار السورة"
                  >
                    <Repeat className={`w-4 h-4 sm:w-5 sm:h-5 ${isRepeat ? "text-amber-400" : ""}`} />
                  </Button>
                )}

                {!isLive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-emerald-300 hover:text-white hover:bg-emerald-700 rounded-xl w-10 h-10 sm:w-12 sm:h-12"
                    onClick={() => changeSurah("next")}
                    title="السورة التالية"
                  >
                    <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                )}

                {/* Main Play Button */}
                <Button
                  size="lg"
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-emerald-900 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 mr-[-3px]" />
                  )}
                </Button>

                {!isLive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-emerald-300 hover:text-white hover:bg-emerald-700 rounded-xl w-10 h-10 sm:w-12 sm:h-12"
                    onClick={() => changeSurah("prev")}
                    title="السورة السابقة"
                  >
                    <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                )}

                {!isLive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-emerald-300 hover:text-white hover:bg-emerald-700 rounded-xl w-10 h-10 sm:w-12 sm:h-12"
                    onClick={() => {
                      if (audioRef.current && !isLive) {
                        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
                      }
                    }}
                    title="رجوع 10 ثواني"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                )}
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-3 pt-2 bg-emerald-800/30 rounded-2xl p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-emerald-300 hover:text-white hover:bg-emerald-700 rounded-xl"
                >
                  {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={(val) => {
                    setVolume(val)
                    if (val[0] > 0) setIsMuted(false)
                  }}
                  max={100}
                  step={1}
                  className="w-32 sm:w-48 [&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-0"
                />
                <span className="text-emerald-300 text-sm w-12 text-center">{isMuted ? 0 : volume[0]}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
