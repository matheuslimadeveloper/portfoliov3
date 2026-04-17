"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, MapPin } from "phosphor-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/hooks/useLanguage"
import { translations } from "@/translations"

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    gsap.fromTo(
      footer,
      { y: 60, opacity: 0, filter: "blur(10px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footer,
          start: "top 90%",
        },
      },
    )

    // Floating particles
    const particles = footer.querySelectorAll(".particle")
    particles.forEach((particle) => {
      gsap.to(particle, {
        y: -30,
        x: gsap.utils.random(-20, 20),
        duration: gsap.utils.random(3, 5),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 2),
      })
    })
  }, [])

  const navItems = [
    { label: t.nav.home, id: "home" },
    { label: t.nav.about, id: "about" },
    { label: t.nav.projects, id: "projects" },
    { label: t.nav.contact, id: "contact" },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.toLowerCase())
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer ref={footerRef} className="relative py-12 px-6 md:px-12 border-t border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="glow-text">Matheus</span> Lima
          </div>

          {/* Navigation */}
          <nav className="flex gap-6 md:gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm uppercase tracking-wider hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Copyright & Location */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2025 {t.footer.madeWith}</span>
              <Heart size={16} weight="fill" className="text-primary animate-pulse" />
              <span>Matheus Lima</span>
            </div>

            <div className="text-xs text-muted-foreground">
              <a href="tel:+351934827235" className="hover:text-primary transition-colors">
                +351 934 827 235
              </a>
            </div>

            {/* Location with Map Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group">
                  <MapPin size={14} weight="fill" className="group-hover:scale-110 transition-transform" />
                  <span>Sesimbra, Portugal</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Localização</DialogTitle>
                  <DialogDescription>Sesimbra, Portugal</DialogDescription>
                </DialogHeader>
                <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12243.847539!2d-9.0987!3d38.4437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1936c3b3c3c3c3%3A0x3c3c3c3c3c3c3c3!2sSesimbra!5e0!3m2!1spt!2spt!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa de Sesimbra, Portugal"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="particle absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-40" />
        <div className="particle absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-accent rounded-full opacity-30" />
        <div className="particle absolute top-1/3 right-1/4 w-2 h-2 bg-primary rounded-full opacity-50" />
        <div className="particle absolute bottom-1/4 right-1/3 w-1 h-1 bg-accent rounded-full opacity-40" />
        <div className="particle absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-primary rounded-full opacity-35" />
      </div>
    </footer>
  )
}

export default Footer
