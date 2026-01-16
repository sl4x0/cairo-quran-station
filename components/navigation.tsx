"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Radio, Clock, BookOpen, Heart, Calendar, Compass, MoreHorizontal, Info, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import Link from "next/link"

const mainNavLinks = [
  { href: "/#player", label: "البث المباشر", icon: Radio },
  { href: "/#prayer-times", label: "الصلاة", icon: Clock },
  { href: "/#verse", label: "آية اليوم", icon: BookOpen },
  { href: "/#azkar", label: "الأذكار", icon: Heart },
]

const moreNavLinks = [
  { href: "/qibla/", label: "القبلة", icon: Compass },
  { href: "/tasbih/", label: "السبحة", icon: MoreHorizontal },
  { href: "/events/", label: "المناسبات", icon: Calendar },
  { href: "/about/", label: "من نحن", icon: Info },
  { href: "/privacy/", label: "الخصوصية", icon: Shield },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [showMore, setShowMore] = useState(false)
  const { periodName } = useTheme()

  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          // Determine if scrolled past threshold
          setIsScrolled(currentScrollY > 50)

          // Show header when:
          // 1. At the top of page
          // 2. Scrolling up
          // 3. Mobile menu is open
          if (currentScrollY <= 50) {
            setIsVisible(true)
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up
            setIsVisible(true)
          } else if (currentScrollY > lastScrollY.current + 10) {
            // Scrolling down (with small threshold to avoid jitter)
            setIsVisible(false)
            setShowMore(false) // Close dropdown when hiding
          }

          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Keep header visible when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                isScrolled ? "bg-primary/10" : "bg-white/20"
              }`}
            >
              <Radio
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-500 ${isScrolled ? "text-primary" : "text-white"}`}
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-serif font-bold text-base sm:text-lg hidden xs:block transition-colors duration-500 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                محطة القرآن
              </span>
              <span
                className={`text-xs hidden sm:block transition-colors duration-500 ${
                  isScrolled ? "text-muted-foreground" : "text-white/70"
                }`}
              >
                وقت {periodName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                <span>المزيد</span>
              </button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 bg-background border border-border rounded-xl shadow-lg p-2 min-w-44"
                  >
                    {moreNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setShowMore(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* CTA Button - Hidden on mobile */}
            <div className="hidden md:block">
              <Button
                className={`transition-all duration-500 ${
                  isScrolled
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                }`}
                asChild
              >
                <a href="/#player">
                  <Radio className="w-4 h-4 ml-2" />
                  استمع الآن
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden transition-colors duration-500 ${isScrolled ? "text-foreground" : "text-white"}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-t border-border shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Main Links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-border my-2" />

              {/* More Links */}
              <p className="px-4 text-xs text-muted-foreground font-medium">المزيد</p>
              {moreNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-border">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <a href="/#player" onClick={() => setIsOpen(false)}>
                    <Radio className="w-4 h-4 ml-2" />
                    استمع الآن
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
