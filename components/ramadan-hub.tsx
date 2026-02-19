"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Moon,
  Star,
  Clock,
  BookOpen,
  Check,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Plus,
  Minus,
  Calculator,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchPrayerTimes } from "@/lib/api"
import {
  getRamadanQuranTracker,
  toggleRamadanJuz,
  getRamadanTarawih,
  saveRamadanTarawih,
} from "@/lib/storage"

// ─── Ramadan Daily Duas (30 duas, one per day) ───────────────────────────────

const ramadanDuas = [
  {
    day: 1,
    text: "اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ صِيَامَ الصَّائِمِينَ، وَقِيَامِي فِيهِ قِيَامَ الْقَائِمِينَ، وَنَبِّهْنِي مِنْ نَوْمَةِ الْغَافِلِينَ",
    translation: "اللهم اجعل صيامي صيام الصائمين حقاً، وقيامي قيام المتهجدين، وأيقظني من غفلتي",
  },
  {
    day: 2,
    text: "اللَّهُمَّ قَرِّبْنِي فِيهِ إِلَى مَرْضَاتِكَ، وَجَنِّبْنِي فِيهِ مِنْ سَخَطِكَ وَنَقِمَاتِكَ",
    translation: "اللهم قربني مما يرضيك وبعدني عما يغضبك في هذا الشهر",
  },
  {
    day: 3,
    text: "اللَّهُمَّ ارْزُقْنِي فِيهِ الذِّهْنَ وَالتَّنْبِيهَ، وَبَاعِدْنِي فِيهِ مِنَ السَّفَاهَةِ وَالتَّمْوِيهِ",
    translation: "اللهم أعطني الفهم والذكاء وبعدني عن الجهل والتضليل",
  },
  {
    day: 4,
    text: "اللَّهُمَّ قَوِّنِي فِيهِ عَلَى إِقَامَةِ أَمْرِكَ، وَأَذِقْنِي فِيهِ حَلَاوَةَ ذِكْرِكَ",
    translation: "اللهم قوِّني على طاعتك وأذِقني حلاوة ذكرك",
  },
  {
    day: 5,
    text: "اللَّهُمَّ اجْعَلْنِي فِيهِ مِنَ الْمُسْتَغْفِرِينَ، وَاجْعَلْنِي فِيهِ مِنْ عِبَادِكَ الصَّالِحِينَ",
    translation: "اللهم اجعلني من المكثرين من الاستغفار ومن عبادك الصالحين",
  },
  {
    day: 6,
    text: "اللَّهُمَّ لَا تَخْذُلْنِي فِيهِ لِتَعَرُّضِ مَعْصِيَتِكَ، وَلَا تَضْرِبْنِي بِسِيَاطِ نَقِمَتِكَ",
    translation: "اللهم لا تتركني لمعصيتك ولا تعاقبني بذنوبي",
  },
  {
    day: 7,
    text: "اللَّهُمَّ أَعِنِّي فِيهِ عَلَى صِيَامِهِ وَقِيَامِهِ، وَجَنِّبْنِي فِيهِ مِنَ هَفَوَاتِهِ وَآثَامِهِ",
    translation: "اللهم أعني على الصيام والقيام وبعدني عن الذنوب والآثام",
  },
  {
    day: 8,
    text: "اللَّهُمَّ ارْزُقْنِي فِيهِ رَحْمَةَ الْأَيْتَامِ، وَإِطْعَامَ الطَّعَامِ، وَإِفْشَاءَ السَّلَامِ",
    translation: "اللهم ارزقني رحمة اليتامى وإطعام المحتاجين وإفشاء السلام",
  },
  {
    day: 9,
    text: "اللَّهُمَّ اجْعَلْ لِي فِيهِ نَصِيبَاً مِنْ رَحْمَتِكَ الْوَاسِعَةِ، وَاهْدِنِي فِيهِ لِبَرَاهِينِكَ السَّاطِعَةِ",
    translation: "اللهم أعطني نصيباً من رحمتك الواسعة واهدني إلى الحق والصواب",
  },
  {
    day: 10,
    text: "اللَّهُمَّ اجْعَلْنِي فِيهِ مِنَ الْمُتَوَكِّلِينَ عَلَيْكَ، وَاجْعَلْنِي فِيهِ مِنَ الْفَائِزِينَ لَدَيْكَ",
    translation: "اللهم اجعلني ممن يتوكل عليك حقاً ويفوز برحمتك",
  },
  {
    day: 11,
    text: "اللَّهُمَّ حَبِّبْ إِلَيَّ فِيهِ الْإِحْسَانَ، وَكَرِّهْ إِلَيَّ فِيهِ الْفُسُوقَ وَالْعِصْيَانَ",
    translation: "اللهم حببني بالإحسان وكرهني للعصيان والفسوق",
  },
  {
    day: 12,
    text: "اللَّهُمَّ زَيِّنِّي فِيهِ بِالسِّتْرِ وَالْعَفَافِ، وَاسْتُرْنِي فِيهِ بِلِبَاسِ الْقُنُوعِ وَالْكَفَافِ",
    translation: "اللهم زيّنني بالعفة والتقوى وارزقني القناعة والكفاف",
  },
  {
    day: 13,
    text: "اللَّهُمَّ طَهِّرْنِي فِيهِ مِنَ الدَّنَسِ وَالْأَقْذَارِ، وَصَبِّرْنِي فِيهِ عَلَى كَائِنَاتِ الْأَقْدَارِ",
    translation: "اللهم طهرني من الذنوب وصبرني على كل ما قضيت",
  },
  {
    day: 14,
    text: "اللَّهُمَّ لَا تُؤَاخِذْنِي فِيهِ بِالْعَثَرَاتِ، وَأَقِلْنِي فِيهِ مِنَ الْخَطَايَا وَالْهَفَوَاتِ",
    translation: "اللهم لا تحاسبني على زلاتي وتجاوز عن خطاياي",
  },
  {
    day: 15,
    text: "اللَّهُمَّ ارْزُقْنِي فِيهِ طَاعَةَ الْخَاشِعِينَ، وَاشْرَحْ فِيهِ صَدْرِي بِإِنَابَةِ الْمُخْبِتِينَ",
    translation: "اللهم ارزقني خشوع الخاشعين وطُمأنينة المنيبين إليك",
  },
  {
    day: 16,
    text: "اللَّهُمَّ وَفِّقْنِي فِيهِ لِمُوَافَقَةِ الْأَبْرَارِ، وَجَنِّبْنِي فِيهِ مُرَافَقَةَ الْأَشْرَارِ",
    translation: "اللهم وفقني لمصاحبة الصالحين وبعّدني عن أهل الفساد",
  },
  {
    day: 17,
    text: "اللَّهُمَّ اهْدِنِي فِيهِ لِصَالِحِ الْأَعْمَالِ، وَاقْضِ لِي فِيهِ الْحَوَائِجَ وَالْآمَالَ",
    translation: "اللهم اهدني للعمل الصالح واقضِ حاجتي وبلّغني آمالي",
  },
  {
    day: 18,
    text: "اللَّهُمَّ نَبِّهْنِي فِيهِ لِبَرَكَاتِ أَسْحَارِهِ، وَنَوِّرْ فِيهِ قَلْبِي بِضِيَاءِ أَنْوَارِهِ",
    translation: "اللهم أيقظني لبركات السحر ونور قلبي بنور رمضان",
  },
  {
    day: 19,
    text: "اللَّهُمَّ وَفِّرْ فِيهِ حَظِّي مِنْ بَرَكَاتِهِ، وَسَهِّلْ سَبِيلِي إِلَى خَيْرَاتِهِ",
    translation: "اللهم أوفر حظي من بركات هذا الشهر ويسر لي طريق الخير",
  },
  {
    day: 20,
    text: "اللَّهُمَّ افْتَحْ لِي فِيهِ أَبْوَابَ الْجِنَانِ، وَأَغْلِقْ عَنِّي فِيهِ أَبْوَابَ النِّيرَانِ",
    translation: "اللهم افتح لي أبواب الجنة وأغلق عني أبواب النار",
  },
  {
    day: 21,
    text: "اللَّهُمَّ اجْعَلْ لِي فِيهِ إِلَى مَرْضَاتِكَ دَلِيلًا، وَلَا تَجْعَلْ لِلشَّيْطَانِ فِيهِ عَلَيَّ سَبِيلًا",
    translation: "اللهم دلني على مرضاتك ولا تجعل للشيطان عليّ سبيلاً",
  },
  {
    day: 22,
    text: "اللَّهُمَّ افْتَحْ لِي فِيهِ أَبْوَابَ فَضْلِكَ، وَأَنْزِلْ عَلَيَّ فِيهِ بَرَكَاتِكَ",
    translation: "اللهم افتح لي أبواب فضلك وأنزل عليّ بركاتك في هذا الشهر",
  },
  {
    day: 23,
    text: "اللَّهُمَّ اغْسِلْنِي فِيهِ مِنَ الذُّنُوبِ، وَطَهِّرْنِي فِيهِ مِنَ الْعُيُوبِ",
    translation: "اللهم اغسلني من الذنوب وطهرني من العيوب",
  },
  {
    day: 24,
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ فِيهِ مَا يُرْضِيكَ، وَأَعُوذُ بِكَ مِمَّا يُؤْذِيكَ",
    translation: "اللهم أعطني ما يرضيك وأعوذ بك مما يسخطك",
  },
  {
    day: 25,
    text: "اللَّهُمَّ اجْعَلْنِي فِيهِ مُحِبَّاً لِأَوْلِيَائِكَ، وَمُعَادِيَاً لِأَعْدَائِكَ",
    translation: "اللهم اجعلني ممن يحب أولياءك ويبغض أعداءك",
  },
  {
    day: 26,
    text: "اللَّهُمَّ اجْعَلْ سَعْيِي فِيهِ مَشْكُورَاً، وَذَنْبِي فِيهِ مَغْفُورَاً",
    translation: "اللهم تقبل سعيي واغفر ذنبي في هذا الشهر الكريم",
  },
  {
    day: 27,
    text: "اللَّهُمَّ ارْزُقْنِي فِيهِ فَضْلَ لَيْلَةِ الْقَدْرِ، وَصَيِّرْ أُمُورِي مِنَ الْعُسْرِ إِلَى الْيُسْرِ",
    translation: "اللهم ارزقني بركة ليلة القدر ويسّر أموري بعد كل عسر",
  },
  {
    day: 28,
    text: "اللَّهُمَّ وَفِّرْ حَظِّي فِيهِ مِنَ النَّوَافِلِ، وَأَكْرِمْنِي فِيهِ بِإِحْضَارِ الْمَسَائِلِ",
    translation: "اللهم أكثر نصيبي من النوافل وأكرمني بالإجابة على مسائلي",
  },
  {
    day: 29,
    text: "اللَّهُمَّ غَشِّنِي فِيهِ بِالرَّحْمَةِ، وَارْزُقْنِي فِيهِ التَّوْفِيقَ وَالْعِصْمَةَ",
    translation: "اللهم غمرني برحمتك وارزقني التوفيق والعصمة من الذنوب",
  },
  {
    day: 30,
    text: "اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ بِالشُّكْرِ وَالْقَبُولِ، عَلَى مَا تَرْضَاهُ وَيَرْضَاهُ الرَّسُولُ",
    translation: "اللهم تقبل صيامي بالشكر والقبول على ما يرضيك ويرضي نبيك ﷺ",
  },
]

// ─── Juz names ────────────────────────────────────────────────────────────────

const juzNames = [
  "الفاتحة — البقرة ١٤١",
  "البقرة ١٤٢ — البقرة ٢٥٢",
  "البقرة ٢٥٣ — آل عمران ٩٢",
  "آل عمران ٩٣ — النساء ٢٣",
  "النساء ٢٤ — النساء ١٤٧",
  "النساء ١٤٨ — المائدة ٨١",
  "المائدة ٨٢ — الأنعام ١١٠",
  "الأنعام ١١١ — الأعراف ٨٧",
  "الأعراف ٨٨ — الأنفال ٤٠",
  "الأنفال ٤١ — التوبة ٩٢",
  "التوبة ٩٣ — هود ٥",
  "هود ٦ — يوسف ٥٢",
  "يوسف ٥٣ — إبراهيم ٥٢",
  "الحجر — النحل ١٢٨",
  "الإسراء — الكهف ٧٤",
  "الكهف ٧٥ — طه ١٣٥",
  "الأنبياء — الحج ٧٨",
  "المؤمنون — الفرقان ٢٠",
  "الفرقان ٢١ — النمل ٥٥",
  "النمل ٥٦ — العنكبوت ٤٥",
  "العنكبوت ٤٦ — الأحزاب ٣٠",
  "الأحزاب ٣١ — يس ٢٧",
  "يس ٢٨ — الزمر ٣١",
  "الزمر ٣٢ — فصلت ٤٦",
  "فصلت ٤٧ — الجاثية ٣٧",
  "الأحقاف — الذاريات ٣٠",
  "الذاريات ٣١ — الحديد ٢٩",
  "المجادلة — التحريم ١٢",
  "الملك — المرسلات ٥٠",
  "النبأ — الناس",
]

// ─── Countdown helpers (shared with ramadan-countdown.tsx) ────────────────────

function parseTimeToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

function formatCountdown(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return {
    h: h.toString().padStart(2, "0"),
    m: m.toString().padStart(2, "0"),
    s: s.toString().padStart(2, "0"),
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RamadanHub() {
  const [hijriDay, setHijriDay] = useState(0)
  const [hijriYear, setHijriYear] = useState(0)
  const [isRamadan, setIsRamadan] = useState(false)
  const [isLaylat, setIsLaylat] = useState(false)

  // Countdown state
  const [fajrTime, setFajrTime] = useState("")
  const [maghribTime, setMaghribTime] = useState("")
  const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" })
  const [countdownMode, setCountdownMode] = useState<"iftar" | "suhoor">("iftar")
  const [targetTime, setTargetTime] = useState("")

  // Quran tracker
  const [completedJuz, setCompletedJuz] = useState<number[]>([])

  // Tarawih
  const [tarawih, setTarawih] = useState(0)

  // Dua state
  const [duaIndex, setDuaIndex] = useState(0)
  const [duaCopied, setDuaCopied] = useState(false)

  // Zakat
  const [zakatPeople, setZakatPeople] = useState(1)
  const zakatPerPerson = 30 // EGP, a common estimate

  // ── Init ──
  useEffect(() => {
    setCompletedJuz(getRamadanQuranTracker())
    setTarawih(getRamadanTarawih())

    // Use Aladhan API's Hijri date — accurate per official moon sighting
    fetchPrayerTimes(30.0444, 31.2357).then((data) => {
      if (!data) return

      const hijriMonth = data.date.hijri.month.number
      const day = parseInt(data.date.hijri.day, 10)
      const year = parseInt(data.date.hijri.year, 10)

      setHijriDay(day)
      setHijriYear(year)
      setFajrTime(data.timings.Fajr.substring(0, 5))
      setMaghribTime(data.timings.Maghrib.substring(0, 5))

      if (hijriMonth === 9) {
        setIsRamadan(true)
        setIsLaylat([21, 23, 25, 27, 29].includes(day))
        // Default dua to today's day (index = day - 1, capped at 29)
        setDuaIndex(Math.min(day - 1, 29))
      }
    })
  }, [])

  // ── Countdown ticker ──
  useEffect(() => {
    if (!fajrTime || !maghribTime) return

    const tick = () => {
      const now = new Date()
      const fajr = parseTimeToDate(fajrTime)
      const maghrib = parseTimeToDate(maghribTime)
      let target: Date
      let mode: "iftar" | "suhoor"

      if (now >= fajr && now < maghrib) {
        target = maghrib
        mode = "iftar"
        setTargetTime(maghribTime)
      } else {
        mode = "suhoor"
        setTargetTime(fajrTime)
        if (now < fajr) {
          target = fajr
        } else {
          const tomorrowFajr = new Date(fajr)
          tomorrowFajr.setDate(tomorrowFajr.getDate() + 1)
          target = tomorrowFajr
        }
      }

      setCountdownMode(mode)
      const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
      setCountdown(formatCountdown(diff))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [fajrTime, maghribTime])

  // ── Handlers ──
  const handleToggleJuz = useCallback((juz: number) => {
    const updated = toggleRamadanJuz(juz)
    setCompletedJuz(updated)
  }, [])

  const handleTarawihChange = useCallback(
    (delta: number) => {
      const next = Math.max(0, tarawih + delta)
      setTarawih(next)
      saveRamadanTarawih(next)
    },
    [tarawih],
  )

  const handleResetTarawih = () => {
    setTarawih(0)
    saveRamadanTarawih(0)
  }

  const copyDua = async () => {
    const dua = ramadanDuas[duaIndex]
    await navigator.clipboard.writeText(`${dua.text}\n\n${dua.translation}`)
    setDuaCopied(true)
    setTimeout(() => setDuaCopied(false), 2000)
  }

  const shareDua = async () => {
    const dua = ramadanDuas[duaIndex]
    if (navigator.share) {
      try {
        await navigator.share({ title: `دعاء اليوم ${dua.day} من رمضان`, text: `${dua.text}\n\n${dua.translation}` })
      } catch {
        // cancelled
      }
    } else {
      copyDua()
    }
  }

  const currentDua = ramadanDuas[duaIndex]
  const quranProgress = Math.round((completedJuz.length / 30) * 100)
  const tarawihProgress = Math.min(100, (tarawih / 20) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-teal-950 to-background">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-12 sm:py-16 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Moon className="w-8 h-8 text-amber-300" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-200">رمضان مبارك</h1>
              <Moon className="w-8 h-8 text-amber-300" />
            </div>
            {isRamadan && (
              <p className="text-amber-300/80 text-lg">
                اليوم {hijriDay} من رمضان {hijriYear} هـ
              </p>
            )}
            {!isRamadan && (
              <p className="text-amber-300/60 text-base">أدوات رمضان — جاهزة لاستقبال الشهر الكريم</p>
            )}
            {isLaylat && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="mt-4 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-5 py-2"
              >
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-amber-200 text-sm font-medium">ليلة مباركة — قد تكون ليلة القدر</span>
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 space-y-8">

        {/* ── Iftar / Suhoor Countdown ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-800 to-teal-900">
            <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
            <CardContent className="p-6 sm:p-8 text-white text-center space-y-4">
              <p className="text-base sm:text-lg text-white/80">
                {countdownMode === "iftar" ? "يتبقى على الإفطار" : "يتبقى على انتهاء وقت السحور"}
              </p>
              <div className="flex items-end justify-center gap-2 sm:gap-4" dir="ltr">
                {[
                  { val: countdown.h, label: "ساعة" },
                  { val: countdown.m, label: "دقيقة" },
                  { val: countdown.s, label: "ثانية" },
                ].map((item, i) => (
                  <div key={i} className="flex items-end gap-2">
                    {i > 0 && <span className="text-4xl sm:text-5xl font-bold text-amber-400/60 pb-5">:</span>}
                    <div className="flex flex-col items-center">
                      <span className="text-5xl sm:text-6xl font-mono font-bold text-amber-300 tabular-nums">
                        {item.val}
                      </span>
                      <span className="text-xs text-white/50 mt-1">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              {targetTime && (
                <p className="text-sm text-white/50 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  {countdownMode === "iftar"
                    ? `الإفطار — المغرب: ${targetTime}`
                    : `السحور ينتهي عند الفجر: ${targetTime}`}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Dua of the Day ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-primary flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  دعاء اليوم
                </h2>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  اليوم {currentDua.day} من رمضان
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={duaIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center space-y-4"
                >
                  <p className="text-xl sm:text-2xl font-serif leading-loose text-foreground" dir="rtl">
                    {currentDua.text}
                  </p>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3" dir="rtl">
                    {currentDua.translation}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDuaIndex(Math.max(0, duaIndex - 1))}
                  disabled={duaIndex === 0}
                >
                  <ChevronRight className="w-4 h-4 ml-1" />
                  السابق
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={copyDua} className="bg-transparent">
                    {duaCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={shareDua} className="bg-transparent">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDuaIndex(Math.min(29, duaIndex + 1))}
                  disabled={duaIndex === 29}
                >
                  التالي
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── 30-Day Quran Reading Tracker ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  تحدي ختم القرآن في 30 يوم
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {completedJuz.length} / 30 جزء
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("هل تريد إعادة تعيين التقدم؟")) {
                        localStorage.removeItem("ramadan-quran-tracker")
                        setCompletedJuz([])
                      }
                    }}
                    className="text-muted-foreground"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${quranProgress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                {completedJuz.length === 30 && (
                  <p className="text-center text-emerald-600 dark:text-emerald-400 font-medium text-sm mt-2">
                    مبارك! أتممت ختم القرآن الكريم ✨
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                  const done = completedJuz.includes(juz)
                  return (
                    <motion.button
                      key={juz}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleToggleJuz(juz)}
                      title={juzNames[juz - 1]}
                      className={`relative flex flex-col items-center justify-center rounded-xl p-2 h-14 transition-all border-2 ${
                        done
                          ? "bg-emerald-500 border-emerald-400 text-white shadow-md"
                          : "bg-muted/50 border-border hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <span className="text-xs font-bold">{juz}</span>
                      {done && <Check className="w-3.5 h-3.5 mt-0.5" />}
                    </motion.button>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                اضغط على رقم الجزء لتحديده كمنتهٍ — اضغط مرة أخرى للإلغاء
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Tarawih Counter ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-indigo-900 to-purple-900">
            <div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400" />
            <CardContent className="p-6 sm:p-8 text-white text-center space-y-5">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-indigo-200 flex items-center justify-center gap-2">
                <Moon className="w-5 h-5 text-indigo-300" />
                عداد ركعات التراويح
              </h2>

              {/* Progress arc */}
              <div className="relative flex justify-center">
                <svg className="w-40 h-40 sm:w-48 sm:h-48 -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgb(99 102 241 / 0.2)" strokeWidth="8" />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={tarawih >= 23 ? "#22c55e" : "#818cf8"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 45 * (1 - Math.min(tarawihProgress, 100) / 100),
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-indigo-200">{tarawih}</span>
                  <span className="text-sm text-indigo-300">ركعة</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <p className="text-sm text-indigo-300">
                  {tarawih >= 20 && tarawih < 23
                    ? "أتممت التراويح — تبقى الوتر"
                    : tarawih >= 23
                      ? "أتممت التراويح والوتر"
                      : `${20 - tarawih} ركعة للإتمام`}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleTarawihChange(-1)}
                  disabled={tarawih === 0}
                  className="w-12 h-12 rounded-full bg-indigo-800/50 hover:bg-indigo-700 text-white"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleTarawihChange(1)}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 rounded-xl"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  ركعة
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetTarawih}
                  className="w-12 h-12 rounded-full bg-indigo-800/50 hover:bg-indigo-700 text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick presets */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[4, 8, 12, 20, 23].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setTarawih(n)
                      saveRamadanTarawih(n)
                    }}
                    className="text-xs bg-indigo-800/50 hover:bg-indigo-700 text-indigo-200 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    {n} ركعة
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Zakat al-Fitr Calculator ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-400" />
            <CardContent className="p-6 sm:p-8 space-y-5">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-primary flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                حاسبة زكاة الفطر
              </h2>
              <p className="text-sm text-muted-foreground">
                زكاة الفطر واجبة على كل مسلم يملك ما يزيد عن قوته وقوت عياله ليلة وأول يوم العيد.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">عدد أفراد الأسرة</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZakatPeople(Math.max(1, zakatPeople - 1))}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-xl font-bold w-8 text-center">{zakatPeople}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZakatPeople(zakatPeople + 1)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>القيمة التقديرية للفرد</span>
                  <span>{zakatPerPerson} جنيه مصري</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-primary">إجمالي زكاة الفطر</span>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {zakatPeople * zakatPerPerson} جنيه
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                ملاحظة: القيمة المذكورة تقديرية بناءً على سعر الحبوب في مصر. يُنصح بمراجعة دار الإفتاء المصرية للقيمة
                الرسمية لهذا العام.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Laylat al-Qadr Guide ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-950 to-indigo-950">
            <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-400" />
            <CardContent className="p-6 sm:p-8 text-white space-y-4">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-purple-200 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-300" />
                ليالي العشر الأخيرة — ليلة القدر
              </h2>
              <p className="text-sm text-purple-300/80">
                اجتهد في العبادة في الليالي الوترية من العشر الأخيرة من رمضان — إحياء لليلة القدر.
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day) => {
                  const isOdd = day % 2 !== 0
                  const isToday = isRamadan && day === hijriDay
                  return (
                    <div
                      key={day}
                      className={`flex flex-col items-center justify-center rounded-xl p-2 h-14 border-2 transition-all ${
                        isToday
                          ? "bg-amber-500/30 border-amber-400 text-amber-200"
                          : isOdd
                            ? "bg-purple-800/40 border-purple-600/50 text-purple-200"
                            : "bg-purple-900/20 border-purple-800/30 text-purple-400/60"
                      }`}
                    >
                      <span className="text-xs font-bold">{day}</span>
                      {isOdd && <Star className="w-3 h-3 text-amber-400 fill-amber-400 mt-0.5" />}
                      {isToday && <span className="text-[9px] text-amber-300">اليوم</span>}
                    </div>
                  )
                })}
              </div>
              <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-4">
                <p className="text-amber-200 text-sm font-serif text-center leading-relaxed" dir="rtl">
                  «اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي»
                </p>
                <p className="text-amber-300/60 text-xs text-center mt-1">دعاء ليلة القدر — رواه الترمذي</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
