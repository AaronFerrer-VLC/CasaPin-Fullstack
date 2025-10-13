import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }) {
  const [dark, setDark] = useState(
    () =>
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      aria-label="Cambiar tema"
      title={dark ? "Tema claro" : "Tema oscuro"}
    >
      {dark ? (
        // Sol
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeWidth="2" d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5 5L3.5 3.5M20.5 20.5L19 19M5 19l-1.5 1.5M20.5 3.5L19 5M12 8a4 4 0 100 8 4 4 0 000-8z"/>
        </svg>
      ) : (
        // Luna
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
        </svg>
      )}
    </button>
  );
}
