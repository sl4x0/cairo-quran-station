# 🕌 Cairo Quran Station

A modern, accessible Islamic radio streaming web application built with Next.js 16, featuring live Quran recitation from Cairo, prayer times, daily Quranic verses, and a beautiful adaptive UI that changes throughout the day.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 🎙️ Core Features

- **Live Quran Streaming** - High-quality audio stream from Cairo
- **Real-Time Listener Count** - Live listener statistics with automatic updates
- **Prayer Times** - Automatic display of Cairo prayer times
- **Ayah of the Day** - Random Quranic verse with translation
- **Friday Special** - Surah Al-Kahf modal on Fridays
- **PWA Support** - Install as a mobile/desktop app

### 🎨 UI/UX Features

- **Adaptive Theme** - Background changes based on time of day (Dawn, Day, Sunset, Night)
- **Smooth Animations** - Framer Motion powered transitions
- **RTL Support** - Full right-to-left Arabic layout
- **Responsive Design** - Mobile-first, works on all devices
- **Accessibility** - WCAG 2.2 Level AA compliant

### 🔧 Technical Features

- **Static Export** - Pre-rendered for CDN deployment
- **Type Safety** - Full TypeScript coverage
- **Security Headers** - CSP, X-Frame-Options, etc.
- **SEO Optimized** - OpenGraph, Twitter Cards, Sitemap
- **Performance** - Optimized bundle size and lazy loading
- **Error Handling** - Graceful degradation with error boundaries

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
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production (static export to /out)
npm run start    # Start production server (not needed for static export)
npm run lint     # Run ESLint to check code quality
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

## 📦 Building for Production

### Static Export (Recommended)

This project is configured for static export, making it perfect for CDN deployment:

```bash
# Build the application
npm run build

# Output will be in the /out directory
# Deploy the /out folder to your hosting provider
```

### Deployment Options

#### GitHub Pages (Recommended) 🚀

**Automatic deployment with every push:**

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**

   - Go to **Settings** → **Pages**
   - Source: **GitHub Actions**
   - Workflow automatically deploys on push

3. **Your site will be live at:**
   - `https://YOUR_USERNAME.github.io/cairo-quran-station`

**Full guide**: See [GITHUB_PAGES.md](GITHUB_PAGES.md) for detailed instructions

#### Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy automatically

#### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `out`
4. Add environment variables

#### Any Static Host

Upload the contents of the `out` folder to any static hosting provider (Cloudflare Pages, AWS S3, etc.)

---

## 🔒 Security

### Security Headers

Security headers are configured in [next.config.mjs](next.config.mjs):

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features

### Best Practices

- Never commit `.env.local` files (already in `.gitignore`)
- Validate all external API responses
- Use HTTPS in production
- Keep dependencies updated (`npm audit`)

---

## 🎨 Customization

### Changing the Stream URL

Edit [app/page.tsx](app/page.tsx) line 20:

```typescript
const STREAM_URL = "https://your-stream-url-here";
```

### Modifying Theme Colors

Edit [app/globals.css](app/globals.css):

```css
--primary: 140 86% 15%; /* emerald-900 */
--secondary: 45 93% 58%; /* gold-500 */
```

### Adjusting Prayer Times Location

Edit [components/prayer-times.tsx](components/prayer-times.tsx):

```typescript
const city = "Cairo"; // Change to your city
const country = "Egypt"; // Change to your country
```

### Real-Time Listener Count

The app includes real-time listener count with automatic updates every 30 seconds.

**Features:**

- ✅ Real-time updates from RadioJar API
- ✅ Automatic retry with exponential backoff on failures
- ✅ Graceful fallback to estimated count when API unavailable
- ✅ Visual status indicators (connected, loading, fallback)
- ✅ Smooth animations and transitions
- ✅ Fully accessible with ARIA labels

The app uses intelligent time-based estimates when the API is unavailable.

---

## 🧪 Testing

Testing and QA checklist has been moved to an internal file and is not published publicly. If you need access, contact the project maintainers.

---

## 🗺️ Roadmap

- [ ] Add multi-language support (English, French)
- [x] **Implement real-time listener count** ✅
- [ ] Create mobile apps (React Native)
- [ ] Add user preferences (save volume, etc.)
- [ ] Implement offline mode with service worker
- [ ] Add share functionality
- [ ] Create browser extension
