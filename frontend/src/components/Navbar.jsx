import React from "react";

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-semibold text-lg">Casa Pin · Asturias</a>
        <div className="flex items-center gap-4 text-sm">
          <a href="#casa" className="hover:underline">La casa</a>
          <a href="#alrededores" className="hover:underline">Alrededores</a>
          <a href="#precios" className="hover:underline">Precios</a>
          <a href="#contacto" className="px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Reservar</a>
        </div>
      </nav>
    </header>
  );
}
