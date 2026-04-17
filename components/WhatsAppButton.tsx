"use client"

import { Robot } from "phosphor-react"
import { useState } from "react"

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)
  const whatsappNumber = "351910362253"
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre seus serviços.")

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      aria-label="Contato via WhatsApp"
    >
      {/* Speech bubble */}
      <div
        className={`
          flex flex-col items-end transition-all duration-300 ease-out
          ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
        `}
      >
        <div className="relative bg-[hsl(var(--background))] border border-[hsl(var(--primary)/0.4)] rounded-2xl rounded-br-sm px-4 py-2 shadow-xl shadow-[hsl(var(--primary)/0.15)]">
          <p className="text-xs text-[hsl(var(--primary))] font-semibold whitespace-nowrap tracking-wide">Posso te ajudar?</p>
          <p className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">Fala comigo no WhatsApp</p>
        </div>
        {/* bubble tail */}
        <div className="w-2 h-2 bg-[hsl(var(--background))] border-r border-b border-[hsl(var(--primary)/0.4)] rotate-45 -mt-1 mr-4" />
      </div>

      {/* Robot button */}
      <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
        {/* outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-[hsl(var(--primary)/0.15)] animate-pulse" />
        {/* border ring */}
        <div className="absolute inset-0 rounded-full border border-[hsl(var(--primary)/0.5)] group-hover:border-[hsl(var(--primary))] transition-colors duration-300" />
        {/* inner dark circle */}
        <div className="relative w-12 h-12 rounded-full bg-[hsl(var(--background))] border border-[hsl(var(--primary)/0.3)] group-hover:bg-[hsl(var(--primary)/0.08)] transition-colors duration-300 flex items-center justify-center shadow-inner">
          <Robot
            size={26}
            weight="duotone"
            className="text-[hsl(var(--primary))] group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
    </a>
  )
}
