import { Navigation } from "@/components/navigation"
import { QiblaSection } from "@/components/qibla-section"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "اتجاه القبلة | محطة القرآن الكريم",
  description: "حدد اتجاه القبلة من موقعك بدقة عالية",
}

export default function QiblaPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <QiblaSection />
      </main>
      <Footer />
    </>
  )
}
