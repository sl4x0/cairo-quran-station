"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Bookmark,
  BookmarkCheck,
  BookText,
  Play,
  Copy,
  Check,
  Trash2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SURAHS, fetchSurahAyahs, searchQuran, type Surah, type Ayah } from "@/lib/quran-data"
import {
  getQuranBookmarks,
  addQuranBookmark,
  removeQuranBookmark,
  isQuranBookmarked,
  type QuranBookmark,
} from "@/lib/storage"

// ─── Tafsir fetcher ───────────────────────────────────────────────────────────

async function fetchAyahTafsir(surahNumber: number, ayahNumberInSurah: number): Promise<string> {
  try {
    // Global ayah number needed for the API
    const surah = SURAHS.find((s) => s.number === surahNumber)
    if (!surah) return ""

    // Calculate global ayah number: sum of all previous surahs' ayahs + ayahNumberInSurah
    let globalAyah = ayahNumberInSurah
    for (const s of SURAHS) {
      if (s.number >= surahNumber) break
      globalAyah += s.numberOfAyahs
    }

    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${globalAyah}/ar.muyassar`)
    const data = await res.json()
    return data?.data?.text || ""
  } catch {
    return ""
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Ayah[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSurahList, setShowSurahList] = useState(true)
  const [surahFilter, setSurahFilter] = useState("")
  const [activeTab, setActiveTab] = useState<"surahs" | "bookmarks">("surahs")

  // Per-ayah state
  const [expandedTafsir, setExpandedTafsir] = useState<Record<number, string>>({})
  const [loadingTafsir, setLoadingTafsir] = useState<Record<number, boolean>>({})
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([])
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null)

  // Load saved state on mount
  useEffect(() => {
    setBookmarks(getQuranBookmarks())
    const lastSurah = localStorage.getItem("quran-last-surah")
    if (lastSurah) {
      const surah = SURAHS.find((s) => s.number === parseInt(lastSurah, 10))
      if (surah) loadSurah(surah)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load surah ayahs
  const loadSurah = useCallback(async (surah: Surah) => {
    setSelectedSurah(surah)
    setIsLoading(true)
    setShowSurahList(false)
    setSearchResults([])
    setSearchQuery("")
    setExpandedTafsir({})

    const data = await fetchSurahAyahs(surah.number)
    setAyahs(data)
    setIsLoading(false)
    localStorage.setItem("quran-last-surah", surah.number.toString())
  }, [])

  // Search Quran
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setShowSurahList(false)
    setSelectedSurah(null)
    const results = await searchQuran(searchQuery)
    setSearchResults(results)
    setIsSearching(false)
  }, [searchQuery])

  // Navigation
  const goToPreviousSurah = () => {
    if (selectedSurah && selectedSurah.number > 1) {
      const prev = SURAHS.find((s) => s.number === selectedSurah.number - 1)
      if (prev) loadSurah(prev)
    }
  }

  const goToNextSurah = () => {
    if (selectedSurah && selectedSurah.number < 114) {
      const next = SURAHS.find((s) => s.number === selectedSurah.number + 1)
      if (next) loadSurah(next)
    }
  }

  // Filter surahs
  const filteredSurahs = surahFilter
    ? SURAHS.filter(
        (s) =>
          s.name.includes(surahFilter) ||
          s.englishName.toLowerCase().includes(surahFilter.toLowerCase()) ||
          s.number.toString() === surahFilter,
      )
    : SURAHS

  // Highlight search term
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-800 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  // ── Tafsir ──
  const toggleTafsir = async (ayah: Ayah) => {
    const key = ayah.numberInSurah
    if (expandedTafsir[key] !== undefined) {
      // Collapse
      setExpandedTafsir((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      return
    }
    // Fetch and expand
    setLoadingTafsir((prev) => ({ ...prev, [key]: true }))
    const tafsir = await fetchAyahTafsir(selectedSurah!.number, key)
    setLoadingTafsir((prev) => ({ ...prev, [key]: false }))
    setExpandedTafsir((prev) => ({ ...prev, [key]: tafsir || "لا يتوفر تفسير لهذه الآية" }))
  }

  // ── Bookmarks ──
  const toggleBookmark = (ayah: Ayah) => {
    if (!selectedSurah) return
    const alreadyBookmarked = isQuranBookmarked(selectedSurah.number, ayah.numberInSurah)
    if (alreadyBookmarked) {
      removeQuranBookmark(selectedSurah.number, ayah.numberInSurah)
    } else {
      addQuranBookmark({
        surahNumber: selectedSurah.number,
        surahName: selectedSurah.name,
        ayahNumber: ayah.numberInSurah,
        ayahText: ayah.text.substring(0, 100) + (ayah.text.length > 100 ? "…" : ""),
        savedAt: new Date().toISOString(),
      })
    }
    setBookmarks(getQuranBookmarks())
  }

  const deleteBookmark = (b: QuranBookmark) => {
    removeQuranBookmark(b.surahNumber, b.ayahNumber)
    setBookmarks(getQuranBookmarks())
  }

  // ── Copy ──
  const copyAyah = async (ayah: Ayah) => {
    if (!selectedSurah) return
    await navigator.clipboard.writeText(`${ayah.text} ﴿${ayah.numberInSurah}﴾ — سورة ${selectedSurah.name}`)
    setCopiedAyah(ayah.numberInSurah)
    setTimeout(() => setCopiedAyah(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* ── Sticky Header ── */}
      <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Title & Back */}
            <div className="flex items-center gap-3">
              {!showSurahList && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSurahList(true)
                    setSelectedSurah(null)
                    setSearchResults([])
                    setAyahs([])
                    setActiveTab("surahs")
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                  {selectedSurah ? `سورة ${selectedSurah.name}` : "القرآن الكريم"}
                </h1>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Input
                  type="text"
                  placeholder="بحث بالآيات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 pr-4 bg-muted/50"
                  dir="rtl"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "بحث"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* ── Surah List / Bookmarks tabs ── */}
        <AnimatePresence mode="wait">
          {showSurahList && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Tab switcher */}
              <div className="flex gap-2 mb-5">
                <Button
                  variant={activeTab === "surahs" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("surahs")}
                >
                  <BookOpen className="w-4 h-4 ml-2" />
                  السور
                </Button>
                <Button
                  variant={activeTab === "bookmarks" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("bookmarks")}
                >
                  <Bookmark className="w-4 h-4 ml-2" />
                  محفوظاتي ({bookmarks.length})
                </Button>
              </div>

              {/* ── Surah grid ── */}
              {activeTab === "surahs" && (
                <>
                  <div className="mb-5">
                    <Input
                      type="text"
                      placeholder="ابحث عن سورة بالاسم أو الرقم..."
                      value={surahFilter}
                      onChange={(e) => setSurahFilter(e.target.value)}
                      className="max-w-md mx-auto bg-muted/50"
                      dir="rtl"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredSurahs.map((surah) => (
                      <motion.div key={surah.number} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className="cursor-pointer hover:shadow-lg transition-all border-border hover:border-primary/50 overflow-hidden group"
                          onClick={() => loadSurah(surah)}
                        >
                          <div className="h-1 bg-gradient-to-r from-emerald-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {surah.number}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                              </Badge>
                            </div>
                            <h3 className="font-serif font-bold text-lg text-foreground mb-1">{surah.name}</h3>
                            <p className="text-xs text-muted-foreground">{surah.numberOfAyahs} آية</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Bookmarks list ── */}
              {activeTab === "bookmarks" && (
                <div>
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-16">
                      <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">لا توجد آيات محفوظة بعد</p>
                      <p className="text-sm text-muted-foreground mt-1">افتح سورة واضغط على أيقونة الحفظ بجانب أي آية</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-w-2xl mx-auto">
                      {bookmarks.map((b) => (
                        <Card key={`${b.surahNumber}-${b.ayahNumber}`} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <Badge variant="secondary">{b.surahName}</Badge>
                                  <Badge variant="outline">آية {b.ayahNumber}</Badge>
                                </div>
                                <p className="text-base font-serif text-foreground leading-relaxed" dir="rtl">
                                  {b.ayahText}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1.5 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-primary hover:text-primary"
                                  onClick={() => {
                                    const surah = SURAHS.find((s) => s.number === b.surahNumber)
                                    if (surah) loadSurah(surah)
                                  }}
                                >
                                  <BookOpen className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => deleteBookmark(b)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Search Results ── */}
        <AnimatePresence mode="wait">
          {searchResults.length > 0 && !selectedSurah && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary">
                  نتائج البحث عن &quot;{searchQuery}&quot; ({searchResults.length} آية)
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchResults([])
                    setSearchQuery("")
                    setShowSurahList(true)
                  }}
                >
                  <X className="w-4 h-4 ml-2" />
                  مسح
                </Button>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {searchResults.map((ayah, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="secondary">{ayah.surah.name}</Badge>
                        <Badge variant="outline">آية {ayah.numberInSurah}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary text-xs"
                          onClick={() => {
                            const surah = SURAHS.find((s) => s.number === ayah.surah.number)
                            if (surah) loadSurah(surah)
                          }}
                        >
                          <BookOpen className="w-3.5 h-3.5 ml-1" />
                          فتح السورة
                        </Button>
                      </div>
                      <p className="text-xl sm:text-2xl font-serif leading-loose text-foreground" dir="rtl">
                        {highlightText(ayah.text, searchQuery)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results */}
        {searchResults.length === 0 && !showSurahList && !selectedSurah && !isSearching && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد نتائج للبحث عن &quot;{searchQuery}&quot;</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setShowSurahList(true)
              }}
            >
              العودة للسور
            </Button>
          </div>
        )}

        {/* ── Surah Content ── */}
        <AnimatePresence mode="wait">
          {selectedSurah && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Surah Navigation */}
              <div className="flex items-center justify-between mb-6 gap-2">
                <Button
                  variant="outline"
                  onClick={goToPreviousSurah}
                  disabled={selectedSurah.number === 1}
                  className="bg-transparent"
                >
                  <ChevronRight className="w-4 h-4 ml-2" />
                  السابقة
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {selectedSurah.revelationType === "Meccan" ? "مكية" : "مدنية"} • {selectedSurah.numberOfAyahs} آية
                  </p>
                  {/* Play surah link */}
                  <a
                    href={`/#player`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 mt-1 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    استمع للسورة
                  </a>
                </div>
                <Button
                  variant="outline"
                  onClick={goToNextSurah}
                  disabled={selectedSurah.number === 114}
                  className="bg-transparent"
                >
                  التالية
                  <ChevronLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {/* Bismillah */}
              {!isLoading && selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                <div className="text-center mb-8">
                  <p className="text-3xl sm:text-4xl font-serif text-primary">﷽</p>
                </div>
              )}

              {/* ── Ayahs — per-ayah block layout ── */}
              {!isLoading && ayahs.length > 0 && (
                <div className="space-y-1">
                  {ayahs.map((ayah) => {
                    const bookmarked = selectedSurah
                      ? isQuranBookmarked(selectedSurah.number, ayah.numberInSurah)
                      : false
                    const hasTafsir = expandedTafsir[ayah.numberInSurah] !== undefined
                    const isTafsirLoading = loadingTafsir[ayah.numberInSurah]
                    const isCopied = copiedAyah === ayah.numberInSurah

                    return (
                      <div key={ayah.number}>
                        {/* Ayah row */}
                        <Card className="overflow-hidden border-border/60 hover:border-primary/30 transition-colors group">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex items-start gap-3">
                              {/* Ayah number */}
                              <span className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary mt-1">
                                {ayah.numberInSurah}
                              </span>

                              {/* Text */}
                              <p
                                className="flex-1 text-xl sm:text-2xl font-serif leading-loose text-foreground"
                                dir="rtl"
                              >
                                {ayah.text}
                              </p>

                              {/* Action buttons — visible on hover */}
                              <div className="shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Bookmark */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 ${bookmarked ? "text-amber-500" : "text-muted-foreground"}`}
                                  title={bookmarked ? "إزالة من المحفوظات" : "حفظ الآية"}
                                  onClick={() => toggleBookmark(ayah)}
                                >
                                  {bookmarked ? (
                                    <BookmarkCheck className="w-4 h-4" />
                                  ) : (
                                    <Bookmark className="w-4 h-4" />
                                  )}
                                </Button>
                                {/* Tafsir */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 ${hasTafsir ? "text-primary" : "text-muted-foreground"}`}
                                  title="عرض التفسير"
                                  onClick={() => toggleTafsir(ayah)}
                                  disabled={isTafsirLoading}
                                >
                                  {isTafsirLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <BookText className="w-4 h-4" />
                                  )}
                                </Button>
                                {/* Copy */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground"
                                  title="نسخ الآية"
                                  onClick={() => copyAyah(ayah)}
                                >
                                  {isCopied ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Tafsir panel */}
                        <AnimatePresence>
                          {hasTafsir && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="mx-4 mb-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-b-xl px-5 py-4">
                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
                                  التفسير الميسر
                                </p>
                                <p
                                  className="text-sm sm:text-base text-foreground/80 leading-relaxed"
                                  dir="rtl"
                                >
                                  {expandedTafsir[ayah.numberInSurah]}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
