import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { QuranPlayerSection } from "@/components/quran-player-section"
import { PrayerTimesSection } from "@/components/prayer-times-section"
import { VerseOfDaySection } from "@/components/verse-of-day-section"
import { AzkarSection } from "@/components/azkar-section"
import { DailyDuasSection } from "@/components/daily-duas-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { NotificationSystem } from "@/components/notification-system"
import Script from "next/script"

export const metadata: Metadata = {
  title: "محطة القرآن الكريم - القاهرة | بث مباشر على مدار الساعة",
  description:
    "استمع إلى القرآن الكريم ببث مباشر من القاهرة على مدار الساعة. مواقيت الصلاة، آية اليوم مع التفسير، والأذكار اليومية.",
  keywords: ["قرآن", "بث مباشر", "القاهرة", "مواقيت الصلاة", "تلاوة", "إسلام", "أذكار", "Quran Radio Cairo", "إذاعة القرآن الكريم"],
  openGraph: {
    title: "محطة القرآن الكريم - القاهرة",
    description: "بث مباشر للقرآن الكريم من القاهرة على مدار الساعة",
    type: "website",
    locale: "ar_EG",
    url: "https://quran-station.tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "محطة القرآن الكريم - القاهرة",
    description: "بث مباشر للقرآن الكريم من القاهرة على مدار الساعة",
  },
  alternates: {
    canonical: "https://quran-station.tech",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "هل التطبيق مجاني؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم، تطبيق محطة القرآن الكريم مجاني بالكامل ومتاح للجميع بدون أي رسوم أو اشتراكات.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكن الاستماع بدون إنترنت؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "البث المباشر يحتاج اتصال بالإنترنت. يمكنك تثبيت التطبيق على جهازك للوصول السريع في أي وقت.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أثبت التطبيق على جهازي؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "افتح الموقع من المتصفح ثم اضغط على 'ثبّت التطبيق' أو من قائمة المتصفح اختر 'إضافة إلى الشاشة الرئيسية'.",
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navigation />
      <main className="min-h-screen">
        <HeroSection />
        <QuranPlayerSection />
        <PrayerTimesSection />
        <VerseOfDaySection />
        <AzkarSection />
        <DailyDuasSection />
        <CTASection />
      </main>
      <Footer />
      <PWAInstallPrompt />
      <NotificationSystem />
    </>
  )
}
