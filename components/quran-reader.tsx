"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, BookOpen, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SURAHS, fetchSurahAyahs, searchQuran, type Surah, type Ayah } from "@/lib/quran-data"

export function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Ayah[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSurahList, setShowSurahList] = useState(true)
  const [surahFilter, setSurahFilter] = useState("")

  // Load surah ayahs
  const loadSurah = useCallback(async (surah: Surah) => {
    setSelectedSurah(surah)
    setIsLoading(true)
    setShowSurahList(false)
    setSearchResults([])
    setSearchQuery("")

    const data = await fetchSurahAyahs(surah.number)
    setAyahs(data)
    setIsLoading(false)

    // Save last read
    localStorage.setItem("quran-last-surah", surah.number.toString())
  }, [])

  // Search Quran - returns ayahs containing the search term
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowSurahList(false)
    setSelectedSurah(null)

    const results = await searchQuran(searchQuery)
    setSearchResults(results)
    setIsSearching(false)
  }, [searchQuery])

  // Load last read surah on mount
  useEffect(() => {
    const lastSurah = localStorage.getItem("quran-last-surah")
    if (lastSurah) {
      const surah = SURAHS.find(s => s.number === parseInt(lastSurah, 10))
      if (surah) {
        loadSurah(surah)
      }
    }
  }, [loadSurah])

  // Navigate between surahs
  const goToPreviousSurah = () => {
    if (selectedSurah && selectedSurah.number > 1) {
      const prevSurah = SURAHS.find(s => s.number === selectedSurah.number - 1)
      if (prevSurah) loadSurah(prevSurah)
    }
  }

  const goToNextSurah = () => {
    if (selectedSurah && selectedSurah.number < 114) {
      const nextSurah = SURAHS.find(s => s.number === selectedSurah.number + 1)
      if (nextSurah) loadSurah(nextSurah)
    }
  }

  // Filter surahs
  const filteredSurahs = surahFilter
    ? SURAHS.filter(s =>
        s.name.includes(surahFilter) ||
        s.englishName.toLowerCase().includes(surahFilter.toLowerCase()) ||
        s.number.toString() === surahFilter
      )
    : SURAHS

  // Highlight search term in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-amber-200 dark:bg-amber-800 px-0.5 rounded">{part}</mark>
        : part
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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
        {/* Surah List */}
        <AnimatePresence mode="wait">
          {showSurahList && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filter */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="ابحث عن سورة بالاسم أو الرقم..."
                  value={surahFilter}
                  onChange={(e) => setSurahFilter(e.target.value)}
                  className="max-w-md mx-auto bg-muted/50"
                  dir="rtl"
                />
              </div>

              {/* Surah Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredSurahs.map((surah) => (
                  <motion.div
                    key={surah.number}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results - Shows ayahs matching keyword */}
        <AnimatePresence mode="wait">
          {searchResults.length > 0 && !selectedSurah && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary">
                  نتائج البحث عن "{searchQuery}" ({searchResults.length} آية)
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
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{ayah.surah.name}</Badge>
                        <Badge variant="outline">آية {ayah.numberInSurah}</Badge>
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

        {/* No results message */}
        {searchResults.length === 0 && !showSurahList && !selectedSurah && !isSearching && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد نتائج للبحث عن "{searchQuery}"</p>
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

        {/* Surah Content */}
        <AnimatePresence mode="wait">
          {selectedSurah && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Surah Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  onClick={goToPreviousSurah}
                  disabled={selectedSurah.number === 1}
                  className="bg-transparent"
                >
                  <ChevronRight className="w-4 h-4 ml-2" />
                  السورة السابقة
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {selectedSurah.revelationType === "Meccan" ? "مكية" : "مدنية"} • {selectedSurah.numberOfAyahs} آية
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={goToNextSurah}
                  disabled={selectedSurah.number === 114}
                  className="bg-transparent"
                >
                  السورة التالية
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

              {/* Ayahs - Using native scrollable div */}
              {!isLoading && ayahs.length > 0 && (
                <Card className="overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
                  <CardContent className="p-6 sm:p-8 md:p-12">
                    <div
                      className="max-h-[60vh] overflow-y-auto pr-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      <div className="text-right leading-[3] sm:leading-[3.5]" dir="rtl">
                        {ayahs.map((ayah) => (
                          <span key={ayah.number} className="inline">
                            <span className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground hover:text-primary transition-colors">
                              {ayah.text}
                            </span>
                            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 mx-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold align-middle">
                              {ayah.numberInSurah}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
