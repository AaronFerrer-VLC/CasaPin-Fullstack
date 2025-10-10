import React from "react";

export default function Navbar(){
  const booking = import.meta.env.VITE_BOOKING_URL;
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-semibold text-lg">Casa Pin</a>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#mapa" className="hover:underline">Mapa</a>
          <a href="#lugares" className="hover:underline">Lugares</a>
          <a href="#contacto" className="hover:underline">Contacto</a>
        </nav>
        <a href={booking} target="_blank" className="px-4 py-2 rounded-xl bg-black text-white text-sm">Reservar</a>
      </div>
    </header>
  )
}
