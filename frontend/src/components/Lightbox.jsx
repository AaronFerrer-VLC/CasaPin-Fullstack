import { useEffect } from "react";

export default function Lightbox({ open, images = [], index = 0, onClose, onIndex }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") onIndex?.((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex?.((i) => (i - 1 + images.length) % images.length);
    };
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, images.length, onClose, onIndex]);

  // Swipe móvil
  useEffect(() => {
    if (!open) return;
    let startX = 0;
    const onTouchStart = (e) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 50) onIndex?.((i) => (i - 1 + images.length) % images.length);
      if (dx < -50) onIndex?.((i) => (i + 1) % images.length);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [open, images.length, onIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute top-3 right-3 w-10 h-10 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20 text-white"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ✕
      </button>

      <button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20 text-white"
        onClick={(e) => { e.stopPropagation(); onIndex?.((i) => (i - 1 + images.length) % images.length); }}
        aria-label="Anterior"
      >
        ‹
      </button>

      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onError={(e) => {
          if (!e.currentTarget.dataset.triedjpeg && images[index].endsWith(".jpg")) {
            e.currentTarget.dataset.triedjpeg = "1";
            e.currentTarget.src = images[index].replace(/\.jpg$/i, ".jpeg");
          }
        }}
      />

      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20 text-white"
        onClick={(e) => { e.stopPropagation(); onIndex?.((i) => (i + 1) % images.length); }}
        aria-label="Siguiente"
      >
        ›
      </button>
    </div>
  );
}
