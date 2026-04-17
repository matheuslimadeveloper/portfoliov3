'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const phoneNumber = '351934827235';
  const message = encodeURIComponent('Olá! Gostaria de fazer um orçamento para o meu projeto.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 100
      }}
      className="group"
      aria-label="Contato via WhatsApp"
    >
      <div className="relative">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
        
        {/* Main button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl">
            Fazer orçamento
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900" />
          </div>
        </div>
      </div>
    </a>
  );
}
