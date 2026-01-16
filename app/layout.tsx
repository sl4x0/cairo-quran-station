import type React from "react"
import type { Metadata, Viewport } from "next"
import { Cairo, Amiri } from "next/font/google"
import { ThemeProvider } from "@/lib/theme-context"
import { RegisterSW } from "@/lib/register-sw"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
})

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
})

export const metadata: Metadata = {
  title: "محطة القرآن الكريم - القاهرة | بث مباشر",
  description: "استمع إلى القرآن الكريم ببث مباشر من القاهرة على مدار الساعة. مواقيت الصلاة، آية اليوم، الأذكار.",
  keywords: ["قرآن", "بث مباشر", "القاهرة", "مواقيت الصلاة", "تلاوة", "إسلام", "أذكار"],
  authors: [{ name: "Cairo Quran Station" }],
  manifest: "/manifest.json",
  metadataBase: new URL("https://quran-station.tech"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "القرآن الكريم",
  },
  openGraph: {
    title: "محطة القرآن الكريم - القاهرة",
    description: "بث مباشر للقرآن الكريم من القاهرة على مدار الساعة",
    type: "website",
    locale: "ar_EG",
    siteName: "محطة القرآن الكريم",
    url: "https://quran-station.tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "محطة القرآن الكريم - القاهرة",
    description: "بث مباشر للقرآن الكريم من القاهرة على مدار الساعة",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
}

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${cairo.variable} ${amiri.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <RegisterSW />
        </ThemeProvider>
      </body>
    </html>
  )
}
