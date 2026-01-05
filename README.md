# 🕌 Cairo Quran Station

A modern, accessible Islamic radio streaming web application built with Next.js 16, featuring live Quran recitation from Cairo, prayer times, daily Quranic verses, and a beautiful adaptive UI that changes throughout the day.

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-Latest-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-Latest-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 🎙️ Core Features

- **Live Quran Streaming** - High-quality 128kbps audio stream from Cairo
- **Prayer Times** - Real-time Cairo prayer times with countdown to next prayer
- **Ayah of the Day** - Random Quranic verse with Arabic tafsir (Al-Muyassar)
- **Friday Special** - Surah Al-Kahf modal with full text on Fridays
- **PWA Support** - Install as a mobile/desktop app with offline capability
- **Media Session API** - Lock screen controls and metadata on mobile devices

### 🎨 UI/UX Features

- **Prayer Time-Based Themes** - Background changes based on Cairo prayer times (Fajr, Sunrise, Asr, Maghrib, Isha)
- **Smooth Animations** - Optimized Framer Motion transitions with reduced motion support
- **Enhanced Arabic Typography** - Multi-font stack (Cairo for headings, Amiri for Quran, Readex Pro for UI)
- **RTL Support** - Full right-to-left Arabic layout with proper text rendering
- **Responsive Design** - Mobile-first design with touch-optimized controls
- **Keyboard Controls** - Space for play/pause, Arrow keys for volume
- **Accessibility** - WCAG 2.2 Level AA compliant with screen reader support

### 🔧 Technical Features

- **Static Export** - Pre-rendered for CDN deployment (GitHub Pages)
- **Type Safety** - Full TypeScript 5.x coverage with strict mode
- **Automated Testing** - Vitest unit tests, React Testing Library, Playwright E2E
- **Performance Optimized** - Lazy loading with Suspense, reduced animations, 0.2s transitions
- **SEO Optimized** - OpenGraph, Twitter Cards, Sitemap, Robots.txt
- **Error Handling** - Error boundaries, retry logic with exponential backoff
- **CI/CD** - Automated deployment via GitHub Actions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/cairo-quran-station.git
   cd cairo-quran-station
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev           # Start development server (http://localhost:3000)
npm run build         # Build for production (static export to /out)
npm run start         # Start production server (not needed for static export)
npm run lint          # Run ESLint to check code quality
npm run type-check    # Run TypeScript type checking
npm test              # Run Vitest unit tests
npm run test:ui       # Open Vitest UI for interactive testing
npm run test:coverage # Generate test coverage report
npm run test:e2e      # Run Playwright E2E tests
npm run optimize:images # Optimize SVGs in `public/` for static export
```

### Project Structure

```
cairo-quran-station/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main streaming page
│   ├── globals.css          # Global styles
│   ├── robots.ts            # SEO robots.txt config
│   └── sitemap.ts           # SEO sitemap config
├── components/              # React components
│   ├── alkahf-modal.tsx    # Friday Surah Al-Kahf modal
│   ├── ayah-of-the-day.tsx # Random Quranic verse
│   ├── error-boundary.tsx  # Error handling component
│   ├── footer.tsx          # Footer with links
│   ├── friday-card.tsx     # Friday special indicator
│   ├── info-modal.tsx      # Station information modal
│   ├── mini-player.tsx     # Sticky mini player
│   ├── prayer-times.tsx    # Cairo prayer times
│   ├── sacred-geometry.tsx # Canvas animations
│   ├── slider.tsx          # Volume slider (Radix UI)
│   └── toast.tsx           # Error toast notifications
├── hooks/                   # Custom React hooks
│   ├── use-listeners.ts    # Listener count hook
│   └── use-mounted.ts      # SSR hydration helper
├── lib/                     # Utility functions
│   ├── arabic-numerals.ts  # Convert to Arabic numerals
│   ├── time-phase.ts       # Time-based theme detection
│   └── utils.ts            # Class name utilities
├── public/                  # Static assets
│   └── manifest.json       # PWA manifest
├── .env.example            # Environment variables template
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS with Tailwind v4
└── package.json            # Project dependencies
```

---

## 🗺️ Roadmap

### Completed ✅

- [x] Prayer time-based adaptive themes
- [x] Arabic tafsir for Ayah of the Day
- [x] Keyboard controls (Space, Arrow keys)
- [x] Automated testing infrastructure (Vitest, Playwright)
- [x] Performance optimizations (lazy loading, Suspense)
- [x] Enhanced Arabic typography with multiple fonts
- [x] Media Session API for lock screen controls

### Planned

- [ ] HTTPS certificate resolution (currently in progress with GitHub)
- [ ] Offline mode with service worker and caching
- [ ] User preferences (save volume, favorite reciters)
- [ ] Additional tafsir sources (Ibn Kathir, Al-Jalalayn)
- [ ] Share functionality with social media integration
- [ ] Multi-language support (English, French, Urdu)
- [ ] Mobile apps (React Native)
- [ ] Browser extension for quick access
