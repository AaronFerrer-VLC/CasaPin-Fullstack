import React, { useMemo, useState } from "react";

export default function PlaceCard({ p = {} }) {
  const {
    name = "Lugar",
    type,
    rating,
    url,
    description,
    address,
    images,
    coords,
  } = p;

  // Imagen principal: primer elemento de images[], con fallback a otros posibles campos si existiesen
  const imgCandidates = [
    Array.isArray(images) ? images[0] : undefined,
    p.image,
    p.photo,
    p.img,
  ].filter(Boolean);

  const [imgSrc, setImgSrc] = useState(imgCandidates[0] || "");

  const hasCoords =
    coords && typeof coords.lat === "number" && typeof coords.lng === "number";

  // Link "Cómo llegar" desde Casa Pin (si hay coords y tenemos lat/lng en env)
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
      <div className="aspect-[16/9] w-full overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={() => setImgSrc("")}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 grid place-items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {type ? `Sin imagen · ${type}` : "Sin imagen"}
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-medium leading-snug">{name}</h4>
          {rating != null && (
            <span className="shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              ⭐ {rating}/5
            </span>
          )}
        </div>

        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          {type || "Lugar"}{address ? ` · ${address}` : ""}
        </div>

        {description && (
          <p
            className="mt-2 text-sm text-gray-700 dark:text-gray-300"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={description}
          >
            {description}
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

