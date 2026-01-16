"use client"

import { motion } from "framer-motion"
import { Globe, Search, TestTube, Shield, GitBranch, Type, Layout, Keyboard, Smartphone } from "lucide-react"

const technicalFeatures = [
  { icon: Globe, label: "Static Export جاهز للـ CDN" },
  { icon: Search, label: "SEO محسّن مع OG و Sitemap" },
  { icon: TestTube, label: "اختبارات Vitest و Playwright" },
  { icon: Shield, label: "Type Safety كامل مع TypeScript" },
  { icon: GitBranch, label: "CI/CD عبر GitHub Actions" },
]

const uiFeatures = [
  { icon: Type, label: "خطوط عربية أصيلة (Cairo / Amiri)" },
  { icon: Layout, label: "تصميم RTL كامل" },
  { icon: Keyboard, label: "تحكم بلوحة المفاتيح" },
  { icon: Smartphone, label: "Mobile-First Design" },
]

export function TechnicalSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-emerald-900 to-emerald-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-4">تميّز تقني وتصميم متقن</h2>
          <p className="text-lg text-emerald-200 max-w-2xl mx-auto">
            بُني بأحدث التقنيات لضمان أداء استثنائي وتجربة سلسة
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-amber-200 mb-6">التقنيات المستخدمة</h3>
            <ul className="space-y-4">
              {technicalFeatures.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 text-emerald-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/50 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <span>{item.label}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-amber-200 mb-6">تجربة المستخدم</h3>
            <ul className="space-y-4">
              {uiFeatures.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 text-emerald-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/50 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <span>{item.label}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
