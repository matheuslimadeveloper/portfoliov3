"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Code, Database, Palette, Lightning, Globe, Cpu } from "phosphor-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/hooks/useLanguage"
import { translations } from "@/translations"
import { useConfig } from "@/lib/use-config"

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const t = translations[language].about
  const { config } = useConfig()

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    const content = contentRef.current
    const skills = skillsRef.current

    if (!section || !image || !content || !skills) return

    // Image animation
    gsap.fromTo(
      image,
      { x: -100, opacity: 0, filter: "blur(10px)" },
      {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      },
    )

    // Content animation
    gsap.fromTo(
      content,
      { x: 100, opacity: 0, filter: "blur(10px)" },
      {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      },
    )

    // Skills stagger animation
    const skillItems = skills.querySelectorAll(".skill-item")
    gsap.fromTo(
      skillItems,
      { y: 40, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: skills,
          start: "top 80%",
        },
      },
    )

    // Hover animation for image
    image.addEventListener("mouseenter", () => {
      gsap.to(image, {
        scale: 1.05,
        rotate: 2,
        duration: 0.5,
        ease: "power2.out",
      })
    })

    image.addEventListener("mouseleave", () => {
      gsap.to(image, {
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    })
  }, [])

  const skills = [
    { icon: <Code size={32} weight="light" />, name: t.skills.react, description: t.skills.reactDesc },
    { icon: <Database size={32} weight="light" />, name: t.skills.typescript, description: t.skills.typescriptDesc },
    { icon: <Palette size={32} weight="light" />, name: t.skills.nodejs, description: t.skills.nodejsDesc },
    { icon: <Lightning size={32} weight="light" />, name: t.skills.microSaas, description: t.skills.microSaasDesc },
    { icon: <Globe size={32} weight="light" />, name: t.skills.tailwind, description: t.skills.tailwindDesc },
    { icon: <Cpu size={32} weight="light" />, name: t.skills.web3, description: t.skills.web3Desc },
  ]

  const fundamentals = [
    { name: language === "pt" ? "Lógica de Programação" : "Programming Logic" },
    { name: language === "pt" ? "Algoritmos" : "Algorithms" },
    { name: "HTML" },
    { name: "CSS" },
    { name: "PHP" },
    { name: "MySQL" },
    { name: "Python" },
  ]

  const languages = [
    {
      flag: "🇵🇹",
      name: t.languages.portuguese,
      level: t.languages.portugueseLevel,
      color: "text-green-500",
    },
    {
      flag: "🇬🇧",
      name: t.languages.english,
      level: t.languages.englishLevel,
      color: "text-blue-500",
    },
    {
      flag: "🇪🇸",
      name: t.languages.spanish,
      level: t.languages.spanishLevel,
      color: "text-yellow-500",
    },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen flex items-center py-32 md:py-20 px-6 md:px-12 relative"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          {/* Content - aparece primeiro no mobile */}
          <div ref={contentRef} className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.title} <span className="glow-text">{t.titleHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed whitespace-pre-line">
              {config?.about?.content
                ? typeof config.about.content === "string"
                  ? config.about.content
                  : config.about.content[language]
                : t.intro}
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed whitespace-pre-line">{t.passion}</p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-center md:text-left flex items-center gap-2 justify-center md:justify-start">
                <Globe size={24} weight="duotone" className="text-primary" />
                {t.languages.title}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {languages.map((lang, index) => (
                  <div
                    key={index}
                    className="glass px-5 py-3 rounded-xl hover:glow-border transition-all flex items-center gap-3 group cursor-default"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{lang.name}</span>
                      <span className={`text-xs ${lang.color} font-medium`}>{lang.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-center md:text-left">{t.skills.title}</h3>
              <TooltipProvider>
                <div ref={skillsRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.map((skill, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className="skill-item glass p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:glow-border transition-all cursor-pointer group">
                          <div className="text-primary group-hover:scale-110 transition-transform">{skill.icon}</div>
                          <span className="text-xs md:text-sm font-medium text-center">{skill.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p>{skill.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-center md:text-left">
                {language === "pt" ? "Fundamentos e Cursos" : "Fundamentals and Courses"}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {fundamentals.map((item, index) => (
                  <span
                    key={index}
                    className="glass px-4 py-2 rounded-full text-sm font-medium hover:glow-border transition-all"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Image - aparece depois do conteúdo no mobile */}
          <div ref={imageRef} className="relative w-full md:w-1/2 order-2 md:order-1 mb-8 md:mb-0">
            <div className="relative w-full max-w-sm mx-auto md:max-w-md aspect-square">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative glass rounded-full p-2 glow-border">
                <img
                  src={config?.profileImage || config?.about?.image || "/profile.png"}
                  alt="Matheus Lima - Web Developer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center"></div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  )
}

export default About
