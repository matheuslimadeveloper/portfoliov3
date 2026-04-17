"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { List, X } from "phosphor-react"
import { useLanguage } from "@/hooks/useLanguage"
import { translations } from "@/translations"

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { language, toggleLanguage } = useLanguage()

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 3.5, ease: "power2.out" },
    )
  }, [])

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      gsap.fromTo(menuRef.current, { x: "100%" }, { x: "0%", duration: 0.5, ease: "power2.out" })
    } else if (menuRef.current) {
      gsap.to(menuRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power2.in",
      })
    }
  }, [isMenuOpen])

  const t = translations[language].nav
  const navItems = [
    { label: t.home, id: "home" },
    { label: t.about, id: "about" },
    { label: t.projects, id: "projects" },
    { label: t.contact, id: "contact" },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.toLowerCase())
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="glow-text">Matheus</span> Lima
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm uppercase tracking-wider hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-semibold px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-all flex items-center gap-2"
            >
              <span>{language === "pt" ? "🇵🇹" : "🇺🇸"}</span>
              <span>{language === "pt" ? "PT" : "EN"}</span>
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3">
            {/* Language Toggle Mobile */}
            <button
              onClick={toggleLanguage}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-all flex items-center gap-1.5"
            >
              <span>{language === "pt" ? "🇵🇹" : "🇺🇸"}</span>
              <span>{language === "pt" ? "PT" : "EN"}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <List size={28} weight="light" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div ref={menuRef} className="fixed top-0 right-0 bottom-0 w-full md:hidden z-50 glass translate-x-full">
        <div className="p-6">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
          >
            <X size={28} weight="light" />
          </button>

          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-3xl font-light tracking-wider hover:text-primary transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
