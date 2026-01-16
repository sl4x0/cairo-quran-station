import { Navigation } from "@/components/navigation"
import { ReligiousEventsSection } from "@/components/religious-events-section"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "المناسبات الدينية | محطة القرآن الكريم",
  description: "تابع المناسبات الإسلامية القادمة - رمضان، الأعياد، والأيام المباركة",
}

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <ReligiousEventsSection />
      </main>
      <Footer />
    </>
  )
}
