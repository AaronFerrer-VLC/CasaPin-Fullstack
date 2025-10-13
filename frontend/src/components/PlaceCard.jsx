import React, { useMemo, useState } from "react";

export default function PlaceCard({ p = {} }) {
  const {
    name = "Lugar",
    type,
    rating,
    url,
    desc,
    description,
    about,
    image,
    photo,
    img,
    coords,
  } = p;

  const [showImg, setShowImg] = useState(Boolean(image || photo || img));
  const imgSrc = image || photo || img || ""; // si no hay, mostramos fallback visual

  const text = desc || description || about || "";
  const hasCoords = Boolean(coords?.lat && coords?.lng);

  // Link "Cómo llegar" desde Casa Pin (si hay coords)
  const casaLat = Number(import.meta.env.VITE_CASA_LAT);
  const casaLng = Number(import.meta.env.VITE_CASA_LNG);
  const howToGoHref = useMemo(() => {
    if (!hasCoords || Number.isNaN(casaLat) || Number.isNaN(casaLng)) return null;
    const o = `${casaLat},${casaLng}`;
    const d = `${coords.lat},${coords.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      o
    )}&destination=${encodeURIComponent(d)}&travelmode=driving`;
  }, [hasCoords, casaLat, casaLng, coords]);

  return (
    <article className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition">
      {/* Imagen / Fallback */}
      {showImg ? (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={() => setShowImg(false)}
          />
        </div>
      ) : (
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 grid place-items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {type ? `Sin imagen · ${type}` : "Sin imagen"}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-medium leading-snug">{name}</h4>
          {typeof rating !== "undefined" && rating !== null && (
            <span className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              ⭐ {rating}/5
            </span>
          )}
        </div>

        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          {type || "Lugar"}{hasCoords ? " · con mapa" : ""}
        </div>

        {text && (
          <p
            className="mt-2 text-sm text-gray-700 dark:text-gray-300"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {text}
          </p>
        )}

        {/* Acciones */}
        <div className="mt-3 flex items-center gap-3">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline underline-offset-2 hover:no-underline"
            >
              Ver ficha
            </a>
          )}

          {howToGoHref && (
            <a
              href={howToGoHref}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline underline-offset-2"
              title="Cómo llegar desde Casa Pin"
            >
              Cómo llegar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

