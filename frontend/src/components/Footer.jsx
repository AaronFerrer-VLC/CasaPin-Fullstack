import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Casa Pin · Villanueva de Colombres, Asturias</div>
        <div className="mt-2">
          <a href="/robots.txt" className="underline">robots.txt</a> ·{" "}
          <a href="/sitemap.xml" className="underline">sitemap.xml</a>
        </div>
      </div>
    </footer>
  );
}
