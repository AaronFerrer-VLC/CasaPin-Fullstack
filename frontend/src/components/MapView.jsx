import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono por defecto
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icono distinto para Casa Pin
const homeIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [1, -40],
});

function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize({ animate: false });
    const t = setTimeout(fix, 150);
    window.addEventListener("resize", fix);
    const ro = new ResizeObserver(fix);
    ro.observe(map.getContainer());
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", fix);
      ro.disconnect();
    };
  }, [map]);
  return null;
}

// Encadra el mapa a todos los marcadores disponibles
function FitToMarkers({ places }) {
  const map = useMap();
  useEffect(() => {
    if (!places.length) return;
    const pts = places
      .filter(
        (p) =>
          p?.coords &&
          typeof p.coords.lat === "number" &&
          typeof p.coords.lng === "number"
      )
      .map((p) => [p.coords.lat, p.coords.lng]);
    if (pts.length) {
      const bounds = L.latLngBounds(pts);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [places, map]);
  return null;
}

export default function MapView() {
  const [places, setPlaces] = useState([]);
  const api = import.meta.env.VITE_API_BASE_URL || "";
  const fallbackCenter = [43.3614, -5.8593]; // Asturias

  useEffect(() => {
    fetch(`${api}/api/places`)
      .then((r) => r.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : []))
      .catch(() => setPlaces([]));
  }, [api]);

  return (
    <div id="mapa" className="rounded-2xl overflow-hidden border h-[420px]">
      <MapContainer
        center={fallbackCenter}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl overflow-hidden"
      >
        <ResizeHandler />
        <FitToMarkers places={places} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((p, idx) => (
          <Marker
            key={p._id || `${p.name}-${idx}`}
            position={[p.coords.lat, p.coords.lng]}
            icon={p.name === "Casa Pin" ? homeIcon : icon}
          >
            <Popup>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-600 mb-1">
                {p.type} · {p.rating ?? "–"}/5
              </div>
              {p.address && <div className="text-xs">{p.address}</div>}
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline"
                >
                  Ver más
                </a>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
