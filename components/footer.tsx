"use client"

import { Heart, Radio, Mail, Github, Download, Info, Shield } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const quickLinks = [
  { href: "/#player", label: "البث المباشر" },
  { href: "/#prayer-times", label: "مواقيت الصلاة" },
  { href: "/#verse", label: "آية اليوم" },
  { href: "/#azkar", label: "الأذكار" },
]

const moreLinks = [
  { href: "/qibla/", label: "اتجاه القبلة" },
  { href: "/tasbih/", label: "السبحة الإلكترونية" },
  { href: "/events/", label: "المناسبات الدينية" },
]

const aboutLinks = [
  { href: "/about/", label: "من نحن", icon: Info },
  { href: "/privacy/", label: "سياسة الخصوصية", icon: Shield },
]

const socialLinks = [
  { href: "mailto:slaxsec@gmail.com", icon: Mail, label: "slaxsec@gmail.com" },
  { href: "https://github.com/sl4x0/cairo-quran-station", icon: Github, label: "GitHub" },
]

export function Footer() {
  const handleInstall = () => {
    const installEvent = new CustomEvent("show-install-prompt")
    window.dispatchEvent(installEvent)
  }

  return (
    <footer className="bg-gradient-to-b from-emerald-900 to-emerald-950 text-emerald-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800 flex items-center justify-center">
                <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-200">محطة القرآن الكريم</h3>
                <p className="text-emerald-400 text-xs sm:text-sm">القاهرة - بث مباشر</p>
              </div>
            </div>
            <p className="text-emerald-300 leading-relaxed text-sm sm:text-base mb-4">
              نسعى لنشر كلام الله في كل مكان، مع تجربة استماع راقية للجميع.
            </p>
            <Button
              onClick={handleInstall}
              variant="outline"
              className="w-full sm:w-auto border-amber-400/50 text-amber-200 hover:bg-amber-400/10 bg-transparent"
            >
              <Download className="w-4 h-4 ml-2" />
              ثبّت التطبيق
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-amber-200 mb-4">الصفحة الرئيسية</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-emerald-300 hover:text-amber-200 transition-colors text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-amber-200 mb-4">المزيد</h4>
            <ul className="space-y-2 sm:space-y-3">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-emerald-300 hover:text-amber-200 transition-colors text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Connect */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-amber-200 mb-4">عن التطبيق</h4>
            <ul className="space-y-2 sm:space-y-3 mb-6">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-emerald-300 hover:text-amber-200 transition-colors text-sm sm:text-base"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-base sm:text-lg font-bold text-amber-200 mb-3">تواصل معنا</h4>
            <ul className="space-y-2 sm:space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-emerald-300 hover:text-amber-200 transition-colors text-sm sm:text-base"
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="truncate">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-800">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
              صُنع بـ
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400 fill-rose-400" />
              </motion.span>
              لنشر كلام الله
            </p>
            <p className="text-emerald-500 text-xs sm:text-sm text-center">
              © {new Date().getFullYear()} محطة القرآن الكريم - القاهرة
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
