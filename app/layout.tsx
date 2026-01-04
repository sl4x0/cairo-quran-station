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
      "/favicon.svg",
      {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABAgEAf6z1xgAAAABJRU5ErkJggg==",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABAgEAf6z1xgAAAABJRU5ErkJggg==",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABAgEAf6z1xgAAAABJRU5ErkJggg==",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABAgEAf6z1xgAAAABJRU5ErkJggg==",
        type: "image/png",
        sizes: "512x512",
      },
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='8' fill='%23020617' /><g transform='translate(16,10) scale(1.2)'><path d='M28.5 2C20 2 13 9 13 17s7 15 15.5 15c1.6 0 3.1-.2 4.5-.7-6.2 3.6-14.4 1.5-18-4.9C9.9 23.4 11.4 12 22 7.9 27.3 5.3 32.9 4 38 5c-3.6-1.8-7.7-2.5-11.5-3z' fill='%23F6C100'/></g></svg>",
        type: "image/svg+xml"
      }
    ],
    shortcut: "/favicon.svg",
    apple: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABAgEAf6z1xgAAAABJRU5ErkJggg==",
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
