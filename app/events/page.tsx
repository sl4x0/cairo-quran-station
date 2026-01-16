import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { HijriCalendar } from "@/components/hijri-calendar"
import { Footer } from "@/components/footer"
import { Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "التقويم الهجري والمناسبات | محطة القرآن الكريم - القاهرة",
  description: "التقويم الهجري الإسلامي مع جميع المناسبات الدينية - رمضان، الأعياد، الأيام المباركة، والعد التنازلي للمناسبات القادمة",
  keywords: ["التقويم الهجري", "المناسبات الإسلامية", "رمضان", "عيد الفطر", "عيد الأضحى", "Hijri calendar", "Islamic events"],
  openGraph: {
    title: "التقويم الهجري والمناسبات | محطة القرآن الكريم",
    description: "التقويم الهجري الإسلامي مع جميع المناسبات الدينية",
    type: "website",
  },
}

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-4 sm:mb-6">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-amber-700 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
              التقويم الهجري والمناسبات
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              تابع التقويم الهجري والمناسبات الإسلامية القادمة
            </p>
          </div>

          {/* Calendar */}
          <div className="max-w-2xl mx-auto">
            <HijriCalendar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
