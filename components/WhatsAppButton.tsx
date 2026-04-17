"use client"

import { WhatsappLogo } from "phosphor-react"

export default function WhatsAppButton() {
  const whatsappNumber = "351910362253"
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre seus serviços.")

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-colors duration-200"
      aria-label="Contato via WhatsApp"
    >
      <WhatsappLogo size={32} color="white" weight="fill" />
    </a>
  )
}
