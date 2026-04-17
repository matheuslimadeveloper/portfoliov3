"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Check, CaretLeft, CaretRight } from "phosphor-react"
import { useLanguage } from "@/hooks/useLanguage"
import { translations } from "@/translations"

gsap.registerPlugin(ScrollTrigger)

const Pricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { language } = useLanguage()
  const t = translations[language]?.pricing

  const handleWhatsApp = (message: string) => {
    const phoneNumber = "351912345678"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  useEffect(() => {
    const createBloopSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.15)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.15)
    }

    audioRef.current = { play: createBloopSound } as any
  }, [])

  const handleSlideChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < 3 && newIndex !== activeIndex) {
      setActiveIndex(newIndex)
      if (audioRef.current) {
        try {
          ;(audioRef.current as any).play()
        } catch (e) {
          console.log("[v0] Audio play error:", e)
        }
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleSlideChange(activeIndex + 1)
    }
    if (touchStart - touchEnd < -75) {
      handleSlideChange(activeIndex - 1)
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const cards = cardsRef.current

    if (!section || !title || !cards) return

    gsap.fromTo(
      title,
      { y: 50, opacity: 0, filter: "blur(10px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      },
    )

    const pricingCards = cards.querySelectorAll(".pricing-card")
    gsap.fromTo(
      pricingCards,
      { y: 80, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cards,
          start: "top 75%",
        },
      },
    )
  }, [])

  if (!t) {
    return null
  }

  const plans = [
    {
      id: "landing",
      title: t.landingPage.title,
      price: t.landingPage.price,
      period: t.landingPage.period,
      description: t.landingPage.description,
      features: t.landingPage.features,
      isPopular: false,
      whatsappMessage:
        language === "pt"
          ? `Olá! Tenho interesse no plano Landing Page (${t.landingPage.price}). Gostaria de mais informações.`
          : `Hello! I am interested in the Landing Page plan (${t.landingPage.price}). I would like more information.`,
    },
    {
      id: "multipage",
      title: t.multiPage.title,
      price: t.multiPage.price,
      period: t.multiPage.period,
      description: t.multiPage.description,
      features: t.multiPage.features,
      isPopular: true,
      whatsappMessage:
        language === "pt"
          ? `Olá! Tenho interesse no plano Site Completo (${t.multiPage.price}). Gostaria de mais informações.`
          : `Hello! I am interested in the Full Website plan (${t.multiPage.price}). I would like more information.`,
    },
    {
      id: "custom",
      title: t.custom.title,
      price: t.custom.price,
      period: t.custom.period,
      description: t.custom.description,
      features: t.custom.features,
      isPopular: false,
      whatsappMessage:
        language === "pt"
          ? `Olá! Tenho interesse no plano ${t.custom.title} (${t.custom.price}). Gostaria de mais informações.`
          : `Hello! I am interested in the ${t.custom.title} plan (${t.custom.price}). I would like more information.`,
    },
  ]

  return (
    <section id="pricing" ref={sectionRef} className="min-h-screen py-20 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4 text-center">
          {t.title} <span className="glow-text">{t.titleHighlight}</span>
        </h2>
        <p className="text-center text-muted-foreground md:mb-16 mb-8 max-w-2xl mx-auto">{t.subtitle}</p>

        <div ref={cardsRef} className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card glass rounded-2xl p-8 hover:glow-border transition-all relative ${
                plan.isPopular ? "border-2 border-primary" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap z-10">
                  {t.popular}
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={20} weight="bold" className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleWhatsApp(plan.whatsappMessage)}
                className={`w-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all duration-300 ${
                  plan.id === "custom" ? "animate-pulse" : ""
                }`}
              >
                {t.cta}
              </Button>

              <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="particle absolute w-1 h-1 bg-primary/40 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      bottom: `-10px`,
                      animationName: "float-particle",
                      animationDuration: `${3 + Math.random() * 2}s`,
                      animationTimingFunction: "ease-in-out",
                      animationIterationCount: "infinite",
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden relative pt-4">
          <div
            className="relative flex items-center justify-center mb-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => handleSlideChange(activeIndex - 1)}
              disabled={activeIndex === 0}
              className={`absolute left-2 z-20 w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-all ${
                activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-primary hover:scale-110"
              }`}
              aria-label="Previous plan"
            >
              <CaretLeft size={24} weight="bold" className="text-primary-foreground" />
            </button>

            <div className="flex items-center justify-center w-full px-14 overflow-visible min-h-[580px]">
              {plans.map((plan, index) => {
                const offset = index - activeIndex
                const isActive = index === activeIndex

                return (
                  <div
                    key={plan.id}
                    onClick={() => !isActive && handleSlideChange(index)}
                    className="absolute transition-all duration-500 ease-out"
                    style={{
                      transform: `translateX(${offset * 85}%) scale(${isActive ? 1 : 0.75})`,
                      opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.4,
                      zIndex: isActive ? 10 : 5 - Math.abs(offset),
                      filter: isActive ? "blur(0px)" : "blur(3px)",
                      pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
                    }}
                  >
                    <div
                      className={`pricing-card w-[75vw] glass rounded-2xl p-6 pt-8 relative ${
                        plan.isPopular ? "border-2 border-primary" : ""
                      } ${isActive ? "shadow-2xl shadow-primary/30" : ""}`}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap z-10 shadow-lg">
                          {t.popular}
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-primary">{plan.price}</span>
                        {plan.period && <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check size={16} weight="bold" className="text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-xs">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleWhatsApp(plan.whatsappMessage)
                        }}
                        className={`w-full bg-primary hover:bg-primary/90 transition-all duration-300 text-sm py-2 ${
                          plan.id === "custom" ? "animate-pulse" : ""
                        }`}
                        disabled={!isActive}
                      >
                        {t.cta}
                      </Button>

                      {isActive && (
                        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl pointer-events-none">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="particle absolute w-1 h-1 bg-primary/50 rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                bottom: `-10px`,
                                animationName: "float-particle",
                                animationDuration: `${2 + Math.random() * 2}s`,
                                animationTimingFunction: "ease-in-out",
                                animationIterationCount: "infinite",
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => handleSlideChange(activeIndex + 1)}
              disabled={activeIndex === plans.length - 1}
              className={`absolute right-2 z-20 w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-all ${
                activeIndex === plans.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100 hover:bg-primary hover:scale-110"
              }`}
              aria-label="Next plan"
            >
              <CaretRight size={24} weight="bold" className="text-primary-foreground" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {plans.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-8 bg-primary shadow-lg shadow-primary/50" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to plan ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-100px) translateX(${Math.random() * 40 - 20}px) scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-200px) translateX(${Math.random() * 60 - 30}px) scale(0.5);
            opacity: 0;
          }
        }
        
        .particle {
          box-shadow: 0 0 10px currentColor;
        }
      `}</style>
    </section>
  )
}

export default Pricing
