"use client"

import { useState, useEffect } from "react"
import Preloader from "@/components/Preloader"
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Pricing from "@/components/Pricing"
import Contact from "@/components/Contact"
import FAQ from "@/components/FAQ"
import Team from "@/components/Team"
import Footer from "@/components/Footer"
import LanguageNotification from "@/components/LanguageNotification"
import AnalyticsTracker from "@/components/AnalyticsTracker"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function Page() {
  const [loading, setLoading] = useState(true)

  const handlePreloaderComplete = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [loading])

  return (
    <>
      <AnalyticsTracker />

      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={loading ? "hidden" : ""}>
        <Navigation />
        <main>
          <Hero />
          <About />
          <Projects />
          <Pricing />
          <Contact />
          <div className="hidden">
            <Team />
          </div>
          <FAQ />
        </main>
        <Footer />
        <LanguageNotification />
        <WhatsAppButton />
      </div>
    </>
  )
}
