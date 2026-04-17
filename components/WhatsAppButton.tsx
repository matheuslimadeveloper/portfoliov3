"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const whatsappNumber = "351910362253"
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre seus serviços.")

  const handleClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contato via WhatsApp"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

        {/* Main button */}
        <div className="relative flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110">
          <div className="w-14 h-14 flex items-center justify-center shrink-0">
            <MessageCircle className="w-7 h-7 mx-auto" />
          </div>

          {/* Expandable text */}
          <div className={`overflow-hidden transition-all duration-300 ${isHovered ? "w-32 pr-4" : "w-0"}`}>
            <span className="text-sm font-semibold whitespace-nowrap">Fale Conosco</span>
          </div>
        </div>

        {/* Ripple animation */}
        <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-20" />
      </div>
    </button>
  )
}
