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
  metadataBase: new URL("https://quran-station.tech"),
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
  icons: {
    icon: [
      "/icon-radio.svg",
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect x='2' y='12' width='60' height='40' rx='6' fill='%23020617'/%3E%3Crect x='8' y='18' width='28' height='28' rx='4' fill='%23F6C100'/%3E%3Cg fill='%23020617'%3E%3Crect x='40' y='20' width='14' height='20' rx='2'/%3E%3Ccircle cx='47' cy='30' r='3.5' fill='%23F6C100'/%3E%3C/g%3E%3Crect x='10' y='22' width='6' height='6' rx='1' fill='%23020617'/%3E%3Crect x='10' y='30' width='6' height='6' rx='1' fill='%23020617'/%3E%3Crect x='18' y='22' width='6' height='14' rx='1' fill='%23020617'/%3E%3Crect x='6' y='8' width='40' height='2' rx='1' fill='%23020617' transform='rotate(20 6 8)'/%3E%3C/svg%3E",
        type: "image/svg+xml",
        sizes: "64x64"
      }
    ],
    shortcut: "/icon-radio.svg",
    apple: "/icon-radio.svg",
  },
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
