import { Navigation } from "@/components/navigation"
import { TasbihSection } from "@/components/tasbih-section"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "السبحة الإلكترونية | محطة القرآن الكريم",
  description: "سبحة إلكترونية للتسبيح والذكر مع عداد",
}

export default function TasbihPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <TasbihSection />
      </main>
      <Footer />
    </>
  )
}
