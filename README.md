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

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```

4. **Edit `.env.local`** with your configuration:

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_STREAM_URL=https://n01.radiojar.com/8s5u5tpdtwzuv
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

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

### Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

| Variable                          | Description               | Required | Default                   |
| --------------------------------- | ------------------------- | -------- | ------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | Your website URL          | Yes      | `https://your-domain.com` |
| `NEXT_PUBLIC_STREAM_URL`          | Radio stream URL          | Yes      | RadioJar Cairo stream     |
| `NEXT_PUBLIC_RADIOJAR_STATION_ID` | RadioJar station ID       | No       | Auto-detected from URL    |
| `NEXT_PUBLIC_RADIOJAR_API_KEY`    | RadioJar API key          | No       | -                         |
| `NEXT_PUBLIC_PRAYER_TIMES_API`    | Prayer times API endpoint | No       | Aladhan API               |
| `NEXT_PUBLIC_QURAN_API`           | Quran verses API endpoint | No       | AlQuran Cloud API         |

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets here.

---

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

3. **Add Repository Secrets** (Settings → Secrets):

   ```
   RADIOJAR_STATION_ID = 8s5u5tpdtwzuv
   STREAM_URL = https://n01.radiojar.com/8s5u5tpdtwzuv
   ```

4. **Your site will be live at:**
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

Edit `.env.local`:

```env
NEXT_PUBLIC_STREAM_URL=https://your-stream-url-here
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

### Setting Up Real-Time Listener Count

The app includes real-time listener count with automatic updates every 30 seconds.

**To enable real listener data:**

1. **Get your RadioJar Station ID:**

   - Log in to your [RadioJar dashboard](https://www.radiojar.com/)
   - Find your station ID (usually in your stream URL)
   - Example: `https://n01.radiojar.com/8s5u5tpdtwzuv` → Station ID is `8s5u5tpdtwzuv`

2. **Add to `.env.local`:**

   ```env
   NEXT_PUBLIC_RADIOJAR_STATION_ID=8s5u5tpdtwzuv
   ```

3. **Optional - API Key for higher rate limits:**
   ```env
   NEXT_PUBLIC_RADIOJAR_API_KEY=your-api-key-here
   ```

**Features:**

- ✅ Real-time updates every 30 seconds
- ✅ Automatic retry with exponential backoff on failures
- ✅ Graceful fallback to estimated count when API unavailable
- ✅ Visual status indicators (connected, loading, fallback)
- ✅ Smooth animations and transitions
- ✅ Fully accessible with ARIA labels

**Without configuration:**
The app will use intelligent time-based estimates that reflect typical listening patterns throughout the day.

---

## 🧪 Testing

### Manual Testing Checklist

#### Functionality

- [ ] Audio playback works correctly
- [ ] Play/Pause button responds immediately
- [ ] Volume control responds smoothly
- [ ] Mute button toggles properly
- [ ] Audio continues in background (mobile)

#### Real-Time Features

- [ ] Listener count displays and updates every 30 seconds
- [ ] Status indicators show: "مباشر" (connected) or "تقديري" (estimated)
- [ ] Connection status icon updates correctly
- [ ] Fallback estimates appear when API unavailable

#### Content & Info

- [ ] Prayer times display correctly for Cairo
- [ ] Ayah of the Day loads with correct Arabic text
- [ ] Friday features activate only on Fridays
- [ ] Info modal opens with station details
- [ ] Al-Kahf modal appears on Fridays

#### Theme System (Critical for Publication)

- [ ] **Dawn (4-6 AM)**: Purple/indigo background appears
- [ ] **Day (6 AM-5 PM)**: Teal/green background appears
- [ ] **Sunset (5-7 PM)**: Orange/purple background appears
- [ ] **Night (7 PM-4 AM)**: Deep void black background appears
- [ ] All cards/components adapt to theme colors
- [ ] Theme transitions smoothly every hour

#### Arabic & RTL (Critical for Publication)

- [ ] All text displays in Arabic (no English except FM)
- [ ] Text flows right-to-left correctly
- [ ] Numbers display in Arabic numerals (٠١٢...)
- [ ] Arabic fonts render properly without cropping
- [ ] Title text has proper spacing (no cutoff)

#### Info Modal

- [ ] Modal opens with Info (ℹ️) button
- [ ] X close button has good contrast and hover effect
- [ ] Listener count card shows real-time data
- [ ] Stream quality shows "١٢٨ كيلوبت/ث"
- [ ] Server location shows "القاهرة"
- [ ] Frequency shows "٩٨.٢ FM"
- [ ] About section displays Arabic description
- [ ] Install instructions dropdown appears BELOW button
- [ ] Install instructions auto-dismiss after 8 seconds
- [ ] Share button copies link successfully
- [ ] "تم النسخ!" message appears when copied

#### Installation (PWA)

- [ ] PWA installation works on iOS (Safari)
- [ ] PWA installation works on Android (Chrome)
- [ ] Install button shows instructions in Arabic
- [ ] App icon appears on home screen correctly
- [ ] Installed app works offline (fallback mode)

#### Responsive Design

- [ ] Works on iPhone (375px width)
- [ ] Works on Android phones (360px width)
- [ ] Works on tablets (768px width)
- [ ] Works on desktop (1024px+ width)
- [ ] Touch targets are minimum 44x44px
- [ ] Text is readable on all screen sizes

#### Accessibility (WCAG 2.2 Level AA)

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces content correctly
- [ ] All buttons have proper aria-labels in Arabic
- [ ] Color contrast ratios meet WCAG standards
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps in modals

#### Performance

- [ ] Page loads in under 3 seconds
- [ ] Audio starts streaming within 1 second of play
- [ ] Animations run smoothly (60 FPS)
- [ ] No memory leaks after extended use
- [ ] Works well on slower 3G connections


### Automated Testing (Coming Soon)

We're working on adding:

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright
- Performance budgets with Lighthouse CI

---

## 🗺️ Roadmap

- [ ] Add multi-language support (English, French)
- [x] **Implement real-time listener count** ✅
- [ ] Create mobile apps (React Native)
- [ ] Add user preferences (save volume, etc.)
- [ ] Implement offline mode with service worker
- [ ] Add share functionality
- [ ] Create browser extension
