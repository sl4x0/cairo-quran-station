import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Radio, Heart, Target, Users } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "من نحن | محطة القرآن الكريم - القاهرة",
  description: "تعرف على محطة القرآن الكريم من القاهرة - رسالتنا وهدفنا في نشر كلام الله",
  openGraph: {
    title: "من نحن | محطة القرآن الكريم",
    description: "تعرف على محطة القرآن الكريم من القاهرة",
  },
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Radio className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-4">من نحن</h1>
            <p className="text-lg text-muted-foreground">محطة القرآن الكريم - القاهرة</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Mission */}
            <section className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">رسالتنا</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    نسعى لنشر كلام الله في كل مكان وزمان، وتقديم تجربة استماع راقية وسهلة للقرآن الكريم تناسب جميع
                    المسلمين حول العالم، مع الحفاظ على جودة الصوت وسهولة الوصول.
                  </p>
                </div>
              </div>
            </section>

            {/* Goal */}
            <section className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">هدفنا</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    توفير منصة مجانية وموثوقة للاستماع إلى القرآن الكريم ببث مباشر على مدار الساعة، مع خدمات إضافية
                    كمواقيت الصلاة والأذكار اليومية لمساعدة المسلمين في حياتهم الروحية.
                  </p>
                </div>
              </div>
            </section>

            {/* For Everyone */}
            <section className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">للجميع</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    تطبيقنا متاح مجاناً للجميع، يعمل على جميع الأجهزة (موبايل، تابلت، كمبيوتر)، ويمكن تثبيته كتطبيق
                    للوصول السريع بدون الحاجة لمتجر التطبيقات.
                  </p>
                </div>
              </div>
            </section>

            {/* Back Link */}
            <div className="text-center pt-6">
              <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                <Radio className="w-4 h-4" />
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
