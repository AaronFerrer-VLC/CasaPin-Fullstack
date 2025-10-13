import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

const LINKS = [
  { href: "#casa", label: "La casa" },
  { href: "#alrededores", label: "Alrededores" },
  { href: "#precios", label: "Precios" },
];

const LOGO_SRC = "/logo-casapin.png"; // pon aquí tu ruta final del logo

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoOk, setLogoOk] = useState(true);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2" aria-label="Ir al inicio">
          {logoOk ? (
            <img
              src={LOGO_SRC}
              alt="Casa Pin - Asturias"
              className="h-8 w-auto select-none rounded-md"
              loading="eager"
              decoding="sync"
              width={32}
              height={32}
              onError={() => setLogoOk(false)}
            />
          ) : (
            // Fallback si el logo no carga
            <span className="inline-block h-8 w-8 rounded-md bg-emerald-600" aria-hidden="true" />
          )}
          <span className="hidden sm:inline font-semibold">Casa Pin</span>
          <span className="sr-only">Casa Pin</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#contacto"
            className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            Reservar
          </a>
        </div>

        {/* Burger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="2"
              d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Tema</span>
              <ThemeToggle />
            </div>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="py-2"
                onClick={() => setOpen(false)}
              >
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


