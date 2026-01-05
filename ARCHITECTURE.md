# 🏗️ Cairo Quran Station - Architecture Guide

**For**: Understanding how this project works  
**Audience**: Beginners with no programming experience  
**Purpose**: Explain the big picture and how everything fits together

---

## 📖 Table of Contents

1. [The Big Picture](#the-big-picture)
2. [Key Technologies](#key-technologies)
3. [Project Structure](#project-structure)
4. [How It Works](#how-it-works)
5. [Data Flow](#data-flow)
6. [Component Breakdown](#component-breakdown)
7. [State Management](#state-management)
8. [External APIs](#external-apis)

---

## 🎯 The Big Picture

Cairo Quran Station is a **Progressive Web App (PWA)** that streams live Quran recitation from Cairo. Think of it like a radio app, but specifically for Quranic content with beautiful Islamic design.

### What Happens When a User Visits?

```
1. User opens website (https://quran-station.com)
   ↓
2. App checks current time in Cairo
   ↓
3. Changes background theme based on prayer time
   (Fajr = dawn colors, Maghrib = sunset colors, etc.)
   ↓
4. Loads random Quranic verse with Arabic tafsir
   ↓
5. Shows Cairo prayer times with countdown
   ↓
6. Connects to live audio stream
   ↓
7. User can play/pause, adjust volume, read verses
```

---

## 🛠️ Key Technologies

### Core Framework: **Next.js 16**
- **What it is**: A React framework that makes building websites easier
- **Why we use it**: Handles routing, optimization, and deployment automatically
- **App Router**: Modern way to organize pages and layouts

### UI Library: **React 19**
- **What it is**: JavaScript library for building user interfaces
- **Why we use it**: Makes the UI interactive and responsive
- **Key concept**: Components (reusable pieces of UI)

### Styling: **Tailwind CSS v4**
- **What it is**: Utility-first CSS framework
- **Why we use it**: Quick styling with pre-made classes
- **Example**: `bg-black/30` = black background with 30% opacity

### Animations: **Framer Motion**
- **What it is**: Animation library for React
- **Why we use it**: Smooth transitions and beautiful effects
- **Example**: Fading in prayer times, rotating sacred geometry

### Type Safety: **TypeScript**
- **What it is**: JavaScript with type checking
- **Why we use it**: Catches errors before they happen
- **Example**: Ensures `volume` is always a number, not text

### Testing:
- **Vitest**: Fast unit tests for functions and components
- **Playwright**: End-to-end tests simulating real user interactions
- **React Testing Library**: Tests components like a user would use them

---

## 📁 Project Structure

```
cairo-quran-station/
│
├── app/                          # Next.js App Router (pages and layouts)
│   ├── layout.tsx               # Root layout (wraps all pages)
│   ├── page.tsx                 # Homepage (main streaming page)
│   ├── globals.css              # Global styles and animations
│   ├── robots.ts                # SEO: tells search engines what to index
│   └── sitemap.ts               # SEO: map of all pages
│
├── components/                   # Reusable UI components
│   ├── player-card.tsx          # Main audio player
│   ├── prayer-times.tsx         # Cairo prayer times display
│   ├── ayah-of-the-day.tsx      # Random Quranic verse
│   ├── alkahf-modal.tsx         # Friday Surah Al-Kahf modal
│   ├── sacred-geometry.tsx      # Animated Islamic patterns
│   ├── header.tsx               # Top navigation
│   ├── footer.tsx               # Bottom links
│   └── ...                      # Other UI components
│
├── hooks/                        # Custom React hooks (reusable logic)
│   ├── use-listeners.ts         # Fetch live listener count
│   ├── use-mounted.ts           # Detect when component is ready
│   ├── use-device-volume.ts     # Sync with mobile device volume
│   ├── use-low-power.ts         # Detect low battery mode
│   └── use-prayer-notifications.ts  # Prayer time notifications
│
├── lib/                          # Utility functions (helpers)
│   ├── arabic-numerals.ts       # Convert 123 → ١٢٣
│   ├── api-utils.ts             # Fetch data with retry logic
│   ├── preferences.ts           # Save/load user settings
│   └── utils.ts                 # General utilities
│
├── contexts/                     # React Context (global state)
│   └── prayer-context.tsx       # Share prayer times across components
│
├── public/                       # Static files (images, fonts, manifest)
│   ├── logo-primary.svg         # Main logo
│   ├── manifest.json            # PWA configuration
│   └── ...                      # Other assets
│
├── test/                         # Unit tests
│   └── ...                      # Test files
│
├── e2e/                          # End-to-end tests
│   └── ...                      # Playwright test files
│
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

---

## 🔄 How It Works

### 1. **Initial Load (Server-Side)**

When a user first visits the site:

```typescript
// app/layout.tsx
// This runs on the server first, then on the client

1. Next.js generates the HTML on the server
2. Sends pre-rendered page to user's browser (fast!)
3. React "hydrates" the page (makes it interactive)
4. Components start fetching data
```

### 2. **Prayer Time Detection**

```typescript
// lib/time-phase.ts (simplified concept)

function getCurrentPrayerPhase() {
  const now = new Date();
  const cairoTime = convertToCairoTime(now);
  
  // Check which prayer time we're in
  if (cairoTime is between Fajr and Sunrise) {
    return "fajr"; // Dawn theme (purple/pink)
  } else if (cairoTime is between Asr and Maghrib) {
    return "asr"; // Afternoon theme (golden)
  }
  // ... and so on
}
```

This determines the background gradient and overall theme.

### 3. **Audio Streaming**

```typescript
// app/page.tsx (simplified)

const audioRef = useRef<HTMLAudioElement>(null);
const STREAM_URL = "https://stream.radiojar.com/...";

function handlePlay() {
  if (audioRef.current) {
    audioRef.current.play(); // Start streaming
  }
}

function handlePause() {
  if (audioRef.current) {
    audioRef.current.pause(); // Stop streaming
  }
}
```

The audio element connects to a live stream URL and plays it like a radio.

### 4. **Fetching Prayer Times**

```typescript
// components/prayer-times.tsx (simplified)

async function fetchPrayerTimes() {
  // Call external API (Aladhan)
  const response = await fetch(
    "https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt"
  );
  
  const data = await response.json();
  
  // Extract prayer times
  const times = {
    Fajr: data.timings.Fajr,    // e.g., "05:15"
    Dhuhr: data.timings.Dhuhr,  // e.g., "12:30"
    Asr: data.timings.Asr,      // e.g., "15:45"
    Maghrib: data.timings.Maghrib,
    Isha: data.timings.Isha
  };
  
  return times;
}
```

### 5. **Fetching Ayah of the Day**

```typescript
// components/ayah-of-the-day.tsx (simplified)

async function fetchRandomAyah() {
  // Generate random surah (1-114) and ayah number
  const randomSurah = Math.floor(Math.random() * 114) + 1;
  
  // Fetch from Quran API
  const response = await fetch(
    `https://api.alquran.cloud/v1/surah/${randomSurah}`
  );
  
  const data = await response.json();
  const randomAyah = data.ayahs[randomIndex];
  
  // Also fetch tafsir (explanation)
  const tafsirResponse = await fetch(
    `https://api.alquran.cloud/v1/ayah/${randomAyah.number}/ar.muyassar`
  );
  
  return { ayah: randomAyah, tafsir: tafsirData };
}
```

---

## 📊 Data Flow

### User Interaction Flow

```
User clicks Play button
  ↓
PlayerCard component receives click
  ↓
Calls onTogglePlay() function
  ↓
Updates isPlaying state (false → true)
  ↓
React re-renders component
  ↓
Audio element starts playing
  ↓
Sacred geometry animation starts spinning
  ↓
Media Session API updates lock screen controls
```

### Prayer Time Update Flow

```
Component mounts
  ↓
useEffect hook runs
  ↓
Calls fetchPrayerTimes()
  ↓
API returns prayer times
  ↓
Saves to state (setPrayerTimes)
  ↓
Calculates next prayer and countdown
  ↓
Sets interval to update countdown every second
  ↓
Component re-renders with new countdown
```

---

## 🧩 Component Breakdown

### **PlayerCard** (Main Audio Player)
- **Purpose**: Play/pause audio, control volume
- **State**: `isPlaying`, `volume`, `isMuted`
- **Props**: Callbacks for play, pause, volume change
- **Visual**: Sacred geometry, play button, volume slider

### **PrayerTimes** (Prayer Schedule)
- **Purpose**: Show Cairo prayer times and countdown
- **State**: `prayerTimes`, `nextPrayer`, `timeRemaining`
- **Data Source**: Aladhan API
- **Updates**: Every second (countdown timer)

### **AyahOfTheDay** (Random Verse)
- **Purpose**: Display random Quranic verse with tafsir
- **State**: `ayah`, `tafsir`, `loading`, `error`
- **Data Source**: AlQuran Cloud API
- **Features**: Refresh button, copy text, share

### **AlKahfModal** (Friday Special)
- **Purpose**: Show Surah Al-Kahf on Fridays
- **Trigger**: Automatically opens on Friday
- **Content**: Full surah text in Arabic
- **Dismissible**: User can close it

### **SacredGeometry** (Animated Background)
- **Purpose**: Beautiful Islamic geometric patterns
- **Animation**: Rotates when audio is playing
- **Canvas-based**: Uses HTML5 Canvas API
- **Performance**: Optimized for smooth 60fps

---

## 🔄 State Management

### Local State (useState)
Used for component-specific data that doesn't need to be shared.

```typescript
// Example: Volume slider
const [volume, setVolume] = useState(70); // Default 70%

function handleVolumeChange(newVolume: number) {
  setVolume(newVolume); // Update state
  audioRef.current.volume = newVolume / 100; // Update audio
}
```

### Context API (React Context)
Used for data that needs to be shared across multiple components.

```typescript
// contexts/prayer-context.tsx
// Provides prayer times to any component that needs them

const PrayerContext = createContext();

export function PrayerProvider({ children }) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  
  // Fetch prayer times once, share with all components
  useEffect(() => {
    fetchPrayerTimes().then(setPrayerTimes);
  }, []);
  
  return (
    <PrayerContext.Provider value={prayerTimes}>
      {children}
    </PrayerContext.Provider>
  );
}
```

### LocalStorage (Browser Storage)
Used for persisting user preferences across sessions.

```typescript
// lib/preferences.ts
// Save user's volume preference

function saveVolume(volume: number) {
  localStorage.setItem('volume', volume.toString());
}

function loadVolume(): number {
  const saved = localStorage.getItem('volume');
  return saved ? parseInt(saved) : 70; // Default 70%
}
```

---

## 🌐 External APIs

### 1. **Aladhan API** (Prayer Times)
- **URL**: `https://api.aladhan.com/v1/timingsByCity`
- **Purpose**: Get accurate prayer times for Cairo
- **Free**: Yes, no API key required
- **Rate Limit**: Reasonable, we cache results for 24 hours

### 2. **AlQuran Cloud API** (Quranic Verses)
- **URL**: `https://api.alquran.cloud/v1/`
- **Purpose**: Fetch Quranic text and tafsir
- **Free**: Yes, no API key required
- **Features**: Multiple languages, tafsir sources

### 3. **RadioJar API** (Listener Count)
- **URL**: `https://www.radiojar.com/api/`
- **Purpose**: Get real-time listener count
- **Requires**: Station ID and API key (optional)
- **Fallback**: Estimated count if API fails

---

## 🎨 Theming System

### Prayer Time-Based Themes

The app changes colors based on Cairo's current prayer time:

```typescript
// Simplified theme logic

const themes = {
  fajr: {
    background: "from-purple-900 via-pink-800 to-orange-700",
    description: "Dawn - Purple and pink hues"
  },
  sunrise: {
    background: "from-orange-500 via-yellow-400 to-blue-400",
    description: "Sunrise - Warm golden tones"
  },
  asr: {
    background: "from-amber-600 via-orange-500 to-red-600",
    description: "Afternoon - Golden hour"
  },
  maghrib: {
    background: "from-red-700 via-purple-800 to-blue-900",
    description: "Sunset - Deep reds and purples"
  },
  isha: {
    background: "from-blue-950 via-purple-950 to-black",
    description: "Night - Deep blues and blacks"
  }
};
```

---

## 🚀 Performance Optimizations

### 1. **Static Export**
- Pre-renders all pages at build time
- Serves static HTML (super fast!)
- No server needed, can host on CDN

### 2. **Code Splitting**
- Loads only necessary JavaScript
- Lazy loads modals and heavy components
- Reduces initial bundle size

### 3. **Image Optimization**
- Next.js `<Image>` component auto-optimizes
- WebP format for smaller file sizes
- Lazy loading for off-screen images

### 4. **Caching Strategy**
- Prayer times cached for 24 hours
- API responses cached in localStorage
- Service worker caches static assets

### 5. **Reduced Motion Support**
- Detects user's motion preferences
- Disables animations if requested
- Improves accessibility and performance

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
Test individual functions and components in isolation.

```typescript
// test/arabic-numerals.test.ts
test('converts Western numerals to Arabic', () => {
  expect(toArabicNum(123)).toBe('١٢٣');
  expect(toArabicNum('456')).toBe('٤٥٦');
});
```

### Integration Tests (React Testing Library)
Test how components work together.

```typescript
// test/player-card.test.tsx
test('plays audio when play button is clicked', () => {
  render(<PlayerCard />);
  const playButton = screen.getByLabelText('تشغيل البث');
  fireEvent.click(playButton);
  expect(audioElement.play).toHaveBeenCalled();
});
```

### End-to-End Tests (Playwright)
Test the entire application like a real user.

```typescript
// e2e/player.spec.ts
test('user can play and pause audio', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="تشغيل البث"]');
  await expect(page.locator('.equalizer')).toBeVisible();
  await page.click('[aria-label="إيقاف البث"]');
  await expect(page.locator('.equalizer')).not.toBeVisible();
});
```

---

## 🔐 Security Considerations

### 1. **No Sensitive Data**
- No user accounts or passwords
- No payment processing
- No personal information collected

### 2. **API Keys**
- Environment variables for sensitive keys
- Never committed to Git
- Optional for most features

### 3. **Content Security Policy**
- Restricts where scripts can load from
- Prevents XSS attacks
- Configured in Next.js headers

### 4. **HTTPS Only**
- All external APIs use HTTPS
- Audio stream uses secure connection
- GitHub Pages enforces HTTPS

---

## 📱 Progressive Web App (PWA)

### What Makes It a PWA?

1. **Manifest File** (`public/manifest.json`)
   - Defines app name, icons, colors
   - Enables "Add to Home Screen"
   - Makes it feel like a native app

2. **Service Worker** (planned)
   - Caches assets for offline use
   - Enables background sync
   - Push notifications for prayer times

3. **Responsive Design**
   - Works on mobile, tablet, desktop
   - Touch-optimized controls
   - Adaptive layouts

---

## 🎯 Key Concepts for Beginners

### **Components**
Think of components as LEGO blocks. Each piece (component) does one thing well, and you combine them to build the full app.

### **Props**
Data you pass from a parent component to a child component. Like giving instructions to a helper.

```typescript
<PlayerCard 
  volume={70}           // Prop: current volume
  onVolumeChange={...}  // Prop: what to do when volume changes
/>
```

### **State**
Data that can change over time. When state changes, React re-renders the component.

```typescript
const [isPlaying, setIsPlaying] = useState(false);
// isPlaying = current value
// setIsPlaying = function to update it
```

### **Hooks**
Special functions that let you "hook into" React features. Always start with `use`.

```typescript
useState()  // Manage state
useEffect() // Run code after render
useRef()    // Reference DOM elements
```

### **API**
A way for your app to talk to external services and get data.

```typescript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 🛣️ Request Flow Example

Let's trace what happens when a user clicks the play button:

```
1. User clicks play button
   ↓
2. onClick event fires
   ↓
3. handleTogglePlay() function runs
   ↓
4. setIsPlaying(true) updates state
   ↓
5. React detects state change
   ↓
6. React re-renders PlayerCard component
   ↓
7. Play button changes to Pause icon
   ↓
8. audioRef.current.play() starts stream
   ↓
9. Sacred geometry animation starts
   ↓
10. Media Session API updates lock screen
   ↓
11. User hears Quran recitation 🎵
```

---

## 🎓 Learning Path

If you want to understand the codebase better, learn in this order:

1. **HTML/CSS Basics** (1-2 weeks)
   - Structure and styling
   - Flexbox and Grid layouts

2. **JavaScript Fundamentals** (2-3 weeks)
   - Variables, functions, arrays, objects
   - Async/await, promises

3. **React Basics** (2-3 weeks)
   - Components, props, state
   - Hooks (useState, useEffect)

4. **Next.js Basics** (1-2 weeks)
   - App Router, layouts
   - Server vs client components

5. **TypeScript Basics** (1-2 weeks)
   - Types, interfaces
   - Type safety benefits

6. **Advanced Topics** (ongoing)
   - Performance optimization
   - Testing strategies
   - Accessibility

---

## 📚 Helpful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev/learn
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

---

## 🤝 Contributing

Want to improve the architecture?

1. Understand the current structure (this document!)
2. Identify areas for improvement
3. Create a plan (see `implementation_plan.md`)
4. Make changes incrementally
5. Test thoroughly
6. Document your changes

---

## ❓ Common Questions

### Q: Why Next.js instead of plain React?
**A**: Next.js provides routing, optimization, and deployment out of the box. It's React with superpowers!

### Q: Why TypeScript instead of JavaScript?
**A**: TypeScript catches errors before they happen. It's like having a helpful assistant checking your work.

### Q: Why Tailwind instead of regular CSS?
**A**: Tailwind is faster for styling and keeps styles consistent. No need to name CSS classes!

### Q: Why so many small files?
**A**: Small, focused files are easier to understand and maintain. Each file does one thing well.

### Q: How does the app work offline?
**A**: (Planned) Service worker will cache assets. Prayer times and verses will be stored locally.

---

**Made with ❤️ for the Cairo Quran Station project**  
*"Good architecture is like a good building - you don't notice it until something goes wrong."*
