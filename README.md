# محطة القرآن الكريم - القاهرة

بث مباشر للقرآن الكريم من القاهرة على مدار الساعة

🔗 **الموقع الرسمي:** [https://quran-station.tech](https://quran-station.tech)

## المميزات

- البث المباشر لإذاعة القرآن الكريم من القاهرة
- مشغل القرآن الكريم مع قراء متعددين
- مواقيت الصلاة حسب موقعك
- آية اليوم مع التفسير الميسر
- الأذكار اليومية
- السبحة الإلكترونية
- اتجاه القبلة
- المناسبات الدينية
- ثيم ديناميكي يتغير حسب وقت اليوم
- دعم PWA للتثبيت على جميع الأجهزة (موبايل، تابلت، كمبيوتر)

## التقنيات

- Next.js 15
- React 19
- Tailwind CSS 4
- Framer Motion
- TypeScript

## التثبيت المحلي

```bash
npm install
npm run dev
```

## البناء للإنتاج

```bash
npm run build
```

## النشر

### النشر على دومين خاص (مثل quran-station.tech)

المشروع مُعد للنشر على دومين خاص بدون basePath.

### النشر على GitHub Pages

إذا أردت النشر على GitHub Pages بدلاً من دومين خاص، عدّل `next.config.mjs`:

```js
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/cairo-quran-station",
  assetPrefix: "/cairo-quran-station/",
  // ... rest of config
}
```

### خطوات الرفع:

1. **ارفع الكود على GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/sl4x0/cairo-quran-station.git
   git push -u origin main
   ```

2. **اربط الدومين:**
   - اذهب إلى Settings > Pages
   - اختر Source: **GitHub Actions**
   - أضف الدومين المخصص: `quran-station.tech`

## APIs المستخدمة

- **مواقيت الصلاة:** [Aladhan API](https://aladhan.com/prayer-times-api)
- **القرآن الكريم:** [Al Quran Cloud API](https://alquran.cloud/api)
- **البث المباشر:** إذاعة القرآن الكريم من القاهرة

## التواصل

- **البريد:** slaxsec@gmail.com
- **GitHub:** [sl4x0/cairo-quran-station](https://github.com/sl4x0/cairo-quran-station)

## الترخيص

MIT License
