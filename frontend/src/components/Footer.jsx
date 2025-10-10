import React from "react";

export default function Footer(){
  return (
    <footer className="border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Casa Pin · Asturias</div>
        <div className="mt-2">Hecho con ❤️ y OpenStreetMap</div>
      </div>
    </footer>
  )
}
