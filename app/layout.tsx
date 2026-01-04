import type React from "react";
import type { Metadata, Viewport } from "next";
import { Readex_Pro, Orbitron } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://sl4x0.github.io/cairo-quran-station"
  ),
  title: "إذاعة القرآن الكريم من القاهرة | بث مباشر",
  description:
    "استمع الآن للبث المباشر لإذاعة القرآن الكريم من القاهرة. تلاوات خاشعة على مدار الساعة، مواقيت الصلاة، وآيات يومية. تطبيق إسلامي شامل.",
  keywords:
    "إذاعة القرآن الكريم, بث مباشر, القاهرة, Quran Radio, Cairo, Islam, Prayer Times, Islamic Radio, القرآن الكريم, تلاوات, مصر",
  authors: [{ name: "Cairo Quran Station" }],
  creator: "Cairo Quran Station",
  publisher: "Cairo Quran Station",
  generator: "v0.app",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://cairo-quran-station.vercel.app",
    title: "إذاعة القرآن الكريم من القاهرة | بث مباشر",
    description:
      "استمع الآن للبث المباشر لإذاعة القرآن الكريم من القاهرة. تلاوات خاشعة على مدار الساعة، مواقيت الصلاة، وآيات يومية.",
    siteName: "إذاعة القرآن الكريم",
    images: [
      {
        url: "/islamic-geometric-pattern-with-golden-crescent-moo.jpg",
        width: 1200,
        height: 1200,
        alt: "إذاعة القرآن الكريم من القاهرة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "إذاعة القرآن الكريم من القاهرة | بث مباشر",
    description:
      "استمع الآن للبث المباشر لإذاعة القرآن الكريم من القاهرة. تلاوات خاشعة على مدار الساعة.",
    images: ["/islamic-geometric-pattern-with-golden-crescent-moo.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "إذاعة القرآن",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' fontSize='90'>☪️</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${readexPro.className} ${orbitron.variable} antialiased`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
