"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"
import { translations } from "@/translations"
import { useConfig } from "@/lib/use-config"

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const splineRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const { language } = useLanguage()
  const t = translations[language].hero
  const { config } = useConfig()

  useEffect(() => {
    const tl = gsap.timeline({ delay: 3.8 })

    // Headline animation
    tl.fromTo(
      headlineRef.current,
      { y: 50, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
    )

    // Name shimmer animation
    if (nameRef.current) {
      gsap.to(nameRef.current, {
        backgroundPosition: "200% center",
        duration: 3,
        repeat: -1,
        ease: "none",
        delay: 4,
      })
    }

    // Subtitle animation
    tl.fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0, filter: "blur(5px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" },
      "-=0.6",
    )

    // CTA animation
    tl.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
      "-=0.4",
    )

    // Spline animation
    tl.fromTo(
      splineRef.current,
      { x: 100, opacity: 0, filter: "blur(10px)" },
      { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" },
      "-=1.2",
    )

    // Floating animation for orbs
    gsap.to(".floating-orb", {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.5,
    })

    return () => {
      tl.kill()
    }
  }, [])

  const scrollToAbout = () => {
    const element = document.getElementById("about")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const name = t.name
  const title = t.title
  const description = t.subtitle

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-12 py-20 md:py-0"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div
            ref={splineRef}
            className="w-full h-[75vh] md:h-[75vh] flex items-start justify-center pt-12 md:pt-0 md:translate-y-0"
          >
            <iframe
              src={config?.splineUrl || "https://my.spline.design/alliseeiscrypto-bIZh9CSur6F44YFAgIDIsLrv/"}
              className="w-full h-full border-0 rounded-lg"
              style={{ objectFit: "contain", objectPosition: "center center" }}
              title="3D Background"
            />
          </div>
          <div className="relative z-10 w-full text-center md:text-left flex flex-col justify-center mt-8 md:mt-0">
            <div className="mb-4 flex justify-center md:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm animate-pulse">
                <span className="text-2xl">🌍</span>
                <span className="text-sm font-medium text-primary">
                  {language === "pt" ? "Nômade Digital" : "Digital Nomad"}
                </span>
              </div>
            </div>

            <h1
              ref={headlineRef}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              {t.greeting}{" "}
              <span
                ref={nameRef}
                className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] text-transparent bg-clip-text"
              >
                {name}
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">{title}</span>
            </h1>
            <p
              ref={subtitleRef}
              className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed"
            >
              {description}
            </p>
            <div ref={ctaRef} className="flex justify-center md:justify-start">
              <Button
                onClick={scrollToAbout}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full glow-border transition-all hover:scale-105"
              >
                {language === "pt" ? "Ver mais" : "See more"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block absolute top-20 left-10 md:left-20 w-32 h-32 bg-primary/30 rounded-full blur-3xl floating-orb" />
      <div className="hidden md:block absolute bottom-20 right-10 md:right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl floating-orb" />
      <div className="hidden md:block absolute top-1/2 right-1/4 w-24 h-24 bg-primary/20 rounded-full blur-2xl floating-orb" />
    </section>
  )
}

export default Hero
