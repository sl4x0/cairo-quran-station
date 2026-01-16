import type { Metadata } from "next"
import { QuranReader } from "@/components/quran-reader"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "القرآن الكريم | محطة القرآن الكريم - القاهرة",
  description: "اقرأ القرآن الكريم كاملاً مع البحث والتصفح السهل. جميع السور والآيات بخط عثماني جميل.",
  keywords: ["القرآن الكريم", "قراءة القرآن", "سور القرآن", "Quran", "Quran reading", "Arabic Quran"],
  openGraph: {
    title: "القرآن الكريم | محطة القرآن الكريم",
    description: "اقرأ القرآن الكريم كاملاً مع البحث والتصفح السهل",
    type: "website",
  },
}

export default function QuranPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 md:pt-20">
        <QuranReader />
      </main>
      <Footer />
    </>
  )
}
