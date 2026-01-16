# 📻 Cairo Quran Station | محطة القرآن الكريم - القاهرة

> Live 24/7 Quran broadcast from Cairo, Egypt — with prayer times, Azkar, Qibla compass, and digital Tasbih.

[![Deploy to GitHub Pages](https://github.com/sl4x0/cairo-quran-station/actions/workflows/deploy.yml/badge.svg)](https://github.com/sl4x0/cairo-quran-station/actions/workflows/deploy.yml)

[🌐 Live Demo](https://quran-station.tech) | [العربية](#العربية)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📻 **Live Radio** | 24/7 Quran broadcast from Cairo Radio |
| 🕌 **Prayer Times** | Accurate Cairo prayer schedule |
| 📖 **Verse of the Day** | Random Ayah with Tafsir & elegant sharing |
| 🤲 **Azkar** | Morning & evening remembrances with progress tracking |
| 📿 **Tasbih** | Digital counter with per-dhikr persistence |
| 🧭 **Qibla Compass** | Direction to Mecca using device sensors |
| 📅 **Islamic Events** | Accurate Hijri calendar countdown |
| 🌙 **Dark Mode** | Auto-adapts to time of day |
| 📱 **PWA** | Install as app on any device |

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Hosting:** GitHub Pages (static export)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/sl4x0/cairo-quran-station.git
cd cairo-quran-station

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

Static files will be generated in the `out/` directory.

---

## 📱 Install as PWA

### Desktop (Chrome/Edge)
1. Visit [quran-station.tech](https://quran-station.tech)
2. Click the install icon in the address bar
3. Confirm installation

### Mobile (iOS)
1. Open in Safari
2. Tap Share → "Add to Home Screen"

### Mobile (Android)
1. Open in Chrome
2. Tap menu → "Install App"

---

## 📂 Project Structure

```
cairo-quran-station/
├── app/                  # Next.js pages and layouts
│   ├── page.tsx          # Homepage
│   ├── layout.tsx        # Root layout with metadata
│   ├── qibla/            # Qibla compass page
│   ├── tasbih/           # Tasbih counter page
│   ├── events/           # Islamic events page
│   ├── about/            # About page
│   └── privacy/          # Privacy policy
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── lib/                  # Utilities
│   ├── storage.ts        # localStorage management
│   ├── hijri.ts          # Hijri calendar calculations
│   ├── api.ts            # External API calls
│   └── theme-context.tsx # Theme provider
├── public/               # Static assets
│   ├── icons/            # PWA icons
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## العربية

### محطة القرآن الكريم - القاهرة

بث مباشر للقرآن الكريم على مدار الساعة من إذاعة القرآن الكريم بالقاهرة.

**المميزات:**
- 📻 بث مباشر للقرآن الكريم
- 🕌 مواقيت الصلاة لمدينة القاهرة
- 📖 آية اليوم مع التفسير الميسر
- 🤲 أذكار الصباح والمساء مع حفظ التقدم
- 📿 السبحة الإلكترونية
- 🧭 اتجاه القبلة
- 📅 المناسبات الإسلامية بالتقويم الهجري

---

<p align="center">
  Made with ❤️ for the Ummah
</p>
