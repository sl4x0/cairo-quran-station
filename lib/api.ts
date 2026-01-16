export interface PrayerTimesData {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

export interface HijriDate {
  day: string
  month: { ar: string; en: string }
  year: string
  designation: { abbreviated: string; expanded: string }
}

export async function fetchPrayerTimes(
  latitude = 30.0444, // Cairo default
  longitude = 31.2357,
): Promise<{ timings: PrayerTimesData; date: { hijri: HijriDate } } | null> {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`,
    )
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching prayer times:", error)
    return null
  }
}

// Quran API - Al Quran Cloud
export interface QuranVerse {
  number: number
  text: string
  numberInSurah: number
  surah: {
    number: number
    name: string
    englishName: string
    revelationType: string
  }
}

export interface QuranTafseer {
  number: number
  text: string
  numberInSurah: number
  surah: {
    number: number
    name: string
  }
}

export interface QuranSurah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export async function fetchRandomVerse(): Promise<{ verse: QuranVerse; tafseer: string } | null> {
  try {
    const randomAyah = Math.floor(Math.random() * 6236) + 1

    // Fetch verse and tafseer in parallel
    const [verseResponse, tafseerResponse] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}`),
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/ar.muyassar`), // Tafseer Al-Muyassar
    ])

    const verseData = await verseResponse.json()
    const tafseerData = await tafseerResponse.json()

    return {
      verse: verseData.data,
      tafseer: tafseerData.data?.text || "",
    }
  } catch (error) {
    console.error("Error fetching verse:", error)
    return null
  }
}

export async function fetchSurahList(): Promise<QuranSurah[] | null> {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah")
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching surah list:", error)
    return null
  }
}

export interface QuranReciter {
  id: string
  name: string
  arabicName: string
  server: string
  rewpiaya: string // subfolder name
}

// List of reciters with their MP3Quran.net server paths
export const quranReciters: QuranReciter[] = [
  {
    id: "alafasy",
    name: "Mishary Alafasy",
    arabicName: "مشاري راشد العفاسي",
    server: "https://everyayah.com/data",
    rewpiaya: "Alafasy_128kbps",
  },
  {
    id: "abdulbasit",
    name: "Abdul Basit Murattal",
    arabicName: "عبد الباسط عبد الصمد - مرتل",
    server: "https://everyayah.com/data",
    rewpiaya: "Abdul_Basit_Murattal_192kbps",
  },
  {
    id: "abdulbasit_mujawwad",
    name: "Abdul Basit Mujawwad",
    arabicName: "عبد الباسط عبد الصمد - مجوّد",
    server: "https://everyayah.com/data",
    rewpiaya: "Abdul_Basit_Mujawwad_128kbps",
  },
  {
    id: "husary",
    name: "Mahmoud Al-Husary",
    arabicName: "محمود خليل الحصري",
    server: "https://everyayah.com/data",
    rewpiaya: "Husary_128kbps",
  },
  {
    id: "minshawi",
    name: "Mohamed Al-Minshawi",
    arabicName: "محمد صديق المنشاوي - مرتل",
    server: "https://everyayah.com/data",
    rewpiaya: "Minshawy_Murattal_128kbps",
  },
  {
    id: "minshawi_mujawwad",
    name: "Mohamed Al-Minshawi Mujawwad",
    arabicName: "محمد صديق المنشاوي - مجوّد",
    server: "https://everyayah.com/data",
    rewpiaya: "Minshawy_Mujawwad_192kbps",
  },
  {
    id: "sudais",
    name: "Abdurrahman As-Sudais",
    arabicName: "عبد الرحمن السديس",
    server: "https://everyayah.com/data",
    rewpiaya: "Abdurrahmaan_As-Sudais_192kbps",
  },
  {
    id: "shuraim",
    name: "Saud Al-Shuraim",
    arabicName: "سعود الشريم",
    server: "https://everyayah.com/data",
    rewpiaya: "Saood_ash-Shuraym_128kbps",
  },
  {
    id: "maher",
    name: "Maher Al Muaiqly",
    arabicName: "ماهر المعيقلي",
    server: "https://everyayah.com/data",
    rewpiaya: "MasharRashmo_Alafasy_128kbps",
  },
  {
    id: "ghamdi",
    name: "Saad Al-Ghamdi",
    arabicName: "سعد الغامدي",
    server: "https://everyayah.com/data",
    rewpiaya: "Ghamadi_40kbps",
  },
  {
    id: "ajamy",
    name: "Ahmed Al-Ajamy",
    arabicName: "أحمد بن علي العجمي",
    server: "https://everyayah.com/data",
    rewpiaya: "ahmed_ibn_ali_al_ajamy_128kbps",
  },
  {
    id: "hani",
    name: "Hani Ar-Rifai",
    arabicName: "هاني الرفاعي",
    server: "https://everyayah.com/data",
    rewpiaya: "Hani_Rifai_192kbps",
  },
]

// Surah info for getting total ayahs
export const surahAyahCount: Record<number, number> = {
  1: 7,
  2: 286,
  3: 200,
  4: 176,
  5: 120,
  6: 165,
  7: 206,
  8: 75,
  9: 129,
  10: 109,
  11: 123,
  12: 111,
  13: 43,
  14: 52,
  15: 99,
  16: 128,
  17: 111,
  18: 110,
  19: 98,
  20: 135,
  21: 112,
  22: 78,
  23: 118,
  24: 64,
  25: 77,
  26: 227,
  27: 93,
  28: 88,
  29: 69,
  30: 60,
  31: 34,
  32: 30,
  33: 73,
  34: 54,
  35: 45,
  36: 83,
  37: 182,
  38: 88,
  39: 75,
  40: 85,
  41: 54,
  42: 53,
  43: 89,
  44: 59,
  45: 37,
  46: 35,
  47: 38,
  48: 29,
  49: 18,
  50: 45,
  51: 60,
  52: 49,
  53: 62,
  54: 55,
  55: 78,
  56: 96,
  57: 29,
  58: 22,
  59: 24,
  60: 13,
  61: 14,
  62: 11,
  63: 11,
  64: 18,
  65: 12,
  66: 12,
  67: 30,
  68: 52,
  69: 52,
  70: 44,
  71: 28,
  72: 28,
  73: 20,
  74: 56,
  75: 40,
  76: 31,
  77: 50,
  78: 40,
  79: 46,
  80: 42,
  81: 29,
  82: 19,
  83: 36,
  84: 25,
  85: 22,
  86: 17,
  87: 19,
  88: 26,
  89: 30,
  90: 20,
  91: 15,
  92: 21,
  93: 11,
  94: 8,
  95: 8,
  96: 19,
  97: 5,
  98: 8,
  99: 8,
  100: 11,
  101: 11,
  102: 8,
  103: 3,
  104: 9,
  105: 5,
  106: 4,
  107: 7,
  108: 3,
  109: 6,
  110: 3,
  111: 5,
  112: 4,
  113: 5,
  114: 6,
}

export function getSurahAyahUrls(surahNumber: number, reciter: QuranReciter): string[] {
  const totalAyahs = surahAyahCount[surahNumber] || 7
  const urls: string[] = []

  for (let ayah = 1; ayah <= totalAyahs; ayah++) {
    const surahStr = surahNumber.toString().padStart(3, "0")
    const ayahStr = ayah.toString().padStart(3, "0")
    urls.push(`${reciter.server}/${reciter.rewpiaya}/${surahStr}${ayahStr}.mp3`)
  }

  return urls
}

// Get audio URL for a specific surah - using full surah recordings
export function getSurahAudioUrl(surahNumber: number, reciter: QuranReciter): string {
  const formattedNumber = surahNumber.toString().padStart(3, "0")

  // Primary sources - full surah recordings
  const primarySources: Record<string, string> = {
    alafasy: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${formattedNumber}.mp3`,
    abdulbasit: `https://download.quranicaudio.com/quran/abdul_basit_murattal/${formattedNumber}.mp3`,
    abdulbasit_mujawwad: `https://download.quranicaudio.com/quran/abdulbaset_mujawwad/${formattedNumber}.mp3`,
    husary: `https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree/${formattedNumber}.mp3`,
    minshawi: `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/${formattedNumber}.mp3`,
    minshawi_mujawwad: `https://download.quranicaudio.com/quran/minshawy_mujawwad/${formattedNumber}.mp3`,
    sudais: `https://download.quranicaudio.com/quran/abdurrahmaan_as-sudais/${formattedNumber}.mp3`,
    shuraim: `https://download.quranicaudio.com/quran/sa3ood_ash-shuraym/${formattedNumber}.mp3`,
    maher: `https://download.quranicaudio.com/quran/maher_al_meaqli/${formattedNumber}.mp3`,
    ghamdi: `https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/${formattedNumber}.mp3`,
    ajamy: `https://download.quranicaudio.com/quran/ahmed_ibn_3ali_al-3ajamy/${formattedNumber}.mp3`,
    hani: `https://download.quranicaudio.com/quran/hani_ar-rifai/${formattedNumber}.mp3`,
  }

  return primarySources[reciter.id] || primarySources.alafasy
}

export function getBackupAudioUrl(surahNumber: number, reciterId: string): string[] {
  const formattedNumber = surahNumber.toString().padStart(3, "0")

  const backupMappings: Record<string, string[]> = {
    alafasy: [
      `https://server8.mp3quran.net/afs/${formattedNumber}.mp3`,
      `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`,
    ],
    abdulbasit: [
      `https://server7.mp3quran.net/basit/Almusshaf-Al-Murattal/${formattedNumber}.mp3`,
      `https://cdn.islamic.network/quran/audio-surah/128/ar.abdulbasitmurattal/${surahNumber}.mp3`,
    ],
    husary: [
      `https://server13.mp3quran.net/husr/${formattedNumber}.mp3`,
      `https://cdn.islamic.network/quran/audio-surah/128/ar.husary/${surahNumber}.mp3`,
    ],
    minshawi: [
      `https://server10.mp3quran.net/minsh/${formattedNumber}.mp3`,
      `https://cdn.islamic.network/quran/audio-surah/128/ar.minshawi/${surahNumber}.mp3`,
    ],
    sudais: [
      `https://server11.mp3quran.net/sds/${formattedNumber}.mp3`,
      `https://cdn.islamic.network/quran/audio-surah/128/ar.abdurrahmaansudais/${surahNumber}.mp3`,
    ],
    maher: [`https://server12.mp3quran.net/maher/${formattedNumber}.mp3`],
    ghamdi: [`https://server7.mp3quran.net/s_gmd/${formattedNumber}.mp3`],
    shuraim: [`https://server7.mp3quran.net/shur/${formattedNumber}.mp3`],
    ajamy: [`https://server10.mp3quran.net/ajm/${formattedNumber}.mp3`],
    hani: [`https://server8.mp3quran.net/rifai/${formattedNumber}.mp3`],
  }

  return backupMappings[reciterId] || backupMappings.alafasy
}

// Islamic Events API using Hijri calendar calculations
export interface IslamicEvent {
  name: string
  arabicName: string
  hijriMonth: number
  hijriDay: number
  type: "holiday" | "blessed" | "fasting"
  description: string
}

export const islamicEvents: IslamicEvent[] = [
  {
    name: "Ramadan",
    arabicName: "شهر رمضان المبارك",
    hijriMonth: 9,
    hijriDay: 1,
    type: "fasting",
    description: "شهر الصيام والقرآن",
  },
  {
    name: "Eid al-Fitr",
    arabicName: "عيد الفطر المبارك",
    hijriMonth: 10,
    hijriDay: 1,
    type: "holiday",
    description: "عيد الفطر السعيد",
  },
  {
    name: "Day of Arafah",
    arabicName: "يوم عرفة",
    hijriMonth: 12,
    hijriDay: 9,
    type: "blessed",
    description: "أعظم أيام السنة",
  },
  {
    name: "Eid al-Adha",
    arabicName: "عيد الأضحى المبارك",
    hijriMonth: 12,
    hijriDay: 10,
    type: "holiday",
    description: "عيد الأضحى",
  },
  {
    name: "Ashura",
    arabicName: "يوم عاشوراء",
    hijriMonth: 1,
    hijriDay: 10,
    type: "fasting",
    description: "يوم نجاة موسى",
  },
  {
    name: "Mawlid",
    arabicName: "المولد النبوي الشريف",
    hijriMonth: 3,
    hijriDay: 12,
    type: "blessed",
    description: "مولد النبي ﷺ",
  },
]
