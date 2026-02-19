import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RamadanHub } from "@/components/ramadan-hub"

export const metadata: Metadata = {
  title: "رمضان مبارك — أدوات رمضان | محطة القرآن الكريم",
  description:
    "أدوات رمضان الكاملة: عداد الإفطار والسحور، تحدي قراءة القرآن في 30 يوم، عداد التراويح، حاسبة زكاة الفطر، وأدعية رمضان اليومية.",
  keywords: [
    "رمضان",
    "إفطار",
    "سحور",
    "تراويح",
    "زكاة الفطر",
    "أدعية رمضان",
    "ختم القرآن",
    "رمضان كريم",
    "Ramadan",
  ],
  openGraph: {
    title: "رمضان مبارك — أدوات رمضان | محطة القرآن",
    description: "عداد الإفطار والسحور، ختم القرآن في 30 يوم، التراويح، وأدعية رمضان",
    type: "website",
    locale: "ar_EG",
  },
}

export default function RamadanPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16 md:pt-20">
        <RamadanHub />
      </main>
      <Footer />
    </>
  )
}
