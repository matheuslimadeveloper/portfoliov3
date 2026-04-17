"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, CaretLeft, CaretRight, X } from "phosphor-react"
import { useLanguage } from "@/hooks/useLanguage"
import { translations } from "@/translations"
import { useConfig } from "@/lib/use-config"

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const t = translations[language].projects

  const { config } = useConfig()

  const [cacheBuster] = useState(() => Date.now())

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg"
    const separator = imageUrl.includes("?") ? "&" : "?"
    return `${imageUrl}${separator}v=${cacheBuster}`
  }

  

  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 6
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const projects = config?.projects || []
  const totalPages = Math.ceil(projects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)

  

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section id="projects" ref={sectionRef} className="min-h-screen py-20 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-16 text-center">
          {t.title} <span className="glow-text">{t.titleHighlight}</span>
        </h2>

        {/* Projects Grid */}
        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {currentProjects.map((project, index) => {
            const projectTitle =
              typeof project.title === "object" && project.title !== null && language in project.title
                ? project.title[language]
                : typeof project.title === "string"
                  ? project.title
                  : "Untitled Project"

            const projectDescription =
              typeof project.description === "object" && project.description !== null && language in project.description
                ? project.description[language]
                : typeof project.description === "string"
                  ? project.description
                  : "No description available"

            return (
              <div
                key={project.id}
                className="project-card glass rounded-2xl overflow-hidden group cursor-pointer hover:glow-border transition-all"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden aspect-[4/3] cursor-zoom-in"
                  onClick={() => setSelectedImage(project.image || "/placeholder.svg")}
                >
                  <style jsx>{`
                    .project-scroll-image {
                      height: 400%;
                      transition: transform 12s ease-in-out;
                    }
                    .group:hover .project-scroll-image {
                      transform: translateY(-75%);
                    }
                  `}</style>
                  <img
                    src={getImageUrl(project.image || "/placeholder.svg")}
                    alt={projectTitle}
                    className="w-full object-cover object-top project-scroll-image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />

                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1 animate-pulse">
                      <span>⭐</span>
                      <span>{language === "pt" ? "Em Destaque" : "Featured"}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {projectTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{projectDescription}</p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech: string, i: number) => (
                      <span key={i} className="text-xs px-3 py-1 bg-secondary rounded-full text-foreground/80">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group/btn text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => project.link && window.open(project.link, "_blank")}
                  >
                    {t.viewProject}
                    <ArrowUpRight
                      size={16}
                      className="ml-1 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                      weight="bold"
                    />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <CaretLeft size={20} weight="bold" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className="rounded-full w-10 h-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              <CaretRight size={20} weight="bold" />
            </Button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} weight="bold" />
          </Button>
          <img
            src={getImageUrl(selectedImage || "/placeholder.svg")}
            alt="Project preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  )
}

export default Projects
