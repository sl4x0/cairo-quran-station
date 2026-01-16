"use client"

import { motion } from "framer-motion"
import { Radio, Clock, BookOpen, Calendar, Smartphone, Accessibility, Moon, Compass, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Radio,
    title: "بث قرآني مباشر",
    description: "تلاوات متواصلة بجودة عالية من أشهر القراء",
  },
  {
    icon: Clock,
    title: "مواقيت الصلاة",
    description: "أوقات الصلاة بدقة عالية مع تحديد الموقع التلقائي",
  },
  {
    icon: BookOpen,
    title: "آية اليوم",
    description: "آية متجددة من القرآن الكريم مع رابط للتفسير",
  },
  {
    icon: Heart,
    title: "الأذكار اليومية",
    description: "أذكار الصباح والمساء مع عداد تفاعلي",
  },
  {
    icon: Compass,
    title: "اتجاه القبلة",
    description: "بوصلة دقيقة لتحديد اتجاه القبلة من موقعك",
  },
  {
    icon: Moon,
    title: "الوضع الداكن",
    description: "تصميم يتكيف مع أوقات اليوم تلقائياً",
  },
  {
    icon: Calendar,
    title: "المناسبات الدينية",
    description: "تتبع المناسبات الإسلامية القادمة",
  },
  {
    icon: Smartphone,
    title: "تصميم متجاوب",
    description: "يعمل بسلاسة على جميع الأجهزة",
  },
  {
    icon: Accessibility,
    title: "سهولة الوصول",
    description: "مصمم وفق معايير WCAG لضمان تجربة مريحة للجميع",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-muted/50 to-background" id="features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4">
            مميزات التطبيق
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            تجربة روحانية متكاملة تجمع بين البساطة والتقنية الحديثة
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 hover:border-primary/20">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
