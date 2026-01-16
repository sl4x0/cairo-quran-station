import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, Radio } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "سياسة الخصوصية | محطة القرآن الكريم",
  description: "سياسة الخصوصية لتطبيق محطة القرآن الكريم من القاهرة",
  openGraph: {
    title: "سياسة الخصوصية | محطة القرآن الكريم",
    description: "سياسة الخصوصية لتطبيق محطة القرآن الكريم",
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-4">سياسة الخصوصية</h1>
            <p className="text-muted-foreground">آخر تحديث: يناير 2025</p>
          </div>

          {/* Content */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border space-y-6">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">البيانات التي نجمعها</h2>
              <p className="text-muted-foreground leading-relaxed">
                لا نجمع أي بيانات شخصية. التطبيق يعمل بالكامل على جهازك ولا يرسل أي معلومات لخوادمنا. الإعدادات مثل
                موقعك لمواقيت الصلاة تُحفظ محلياً على جهازك فقط.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">الموقع الجغرافي</h2>
              <p className="text-muted-foreground leading-relaxed">
                نطلب إذن الموقع فقط لحساب مواقيت الصلاة واتجاه القبلة. هذه البيانات تُستخدم محلياً ولا تُرسل لأي جهة
                خارجية. يمكنك رفض الإذن واستخدام الموقع الافتراضي (القاهرة).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">التخزين المحلي</h2>
              <p className="text-muted-foreground leading-relaxed">
                نستخدم التخزين المحلي (localStorage) لحفظ تفضيلاتك مثل القارئ المفضل وعدد التسبيحات. يمكنك مسح هذه
                البيانات في أي وقت من إعدادات المتصفح.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">خدمات خارجية</h2>
              <p className="text-muted-foreground leading-relaxed">
                نستخدم APIs خارجية لجلب مواقيت الصلاة وتلاوات القرآن. هذه الخدمات لها سياسات خصوصية خاصة بها. نحن لا
                نشارك أي بيانات شخصية مع هذه الخدمات.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">تواصل معنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                لأي استفسارات حول الخصوصية، تواصل معنا على:{" "}
                <a href="mailto:slaxsec@gmail.com" className="text-primary hover:underline">
                  slaxsec@gmail.com
                </a>
              </p>
            </section>
          </div>

          {/* Back Link */}
          <div className="text-center pt-8">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
              <Radio className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
