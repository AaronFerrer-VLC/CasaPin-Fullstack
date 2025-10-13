import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#casa", label: "La casa" },
    { href: "#alrededores", label: "Alrededores" },
    { href: "#precios", label: "Precios" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-semibold">Casa Pin</a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm hover:underline">
              {l.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#contacto"
            className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700"
          >
            Reservar
          </a>
        </div>

        {/* Burger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16"/>
          </svg>
        </button>
      </nav>

      {/* Mobile */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Tema</span>
              <ThemeToggle />
            </div>
            {links.map(l => (
              <a key={l.href} href={l.href} className="py-2" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a
              href="#contacto"
              className="mt-1 mb-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-center hover:bg-emerald-700"
              onClick={() => setOpen(false)}
            >
              Reservar
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

