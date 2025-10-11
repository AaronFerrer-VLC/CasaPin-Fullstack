import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

export default function MapView() {
  const [places, setPlaces] = useState([]);
  const api = import.meta.env.VITE_API_BASE_URL || "";
  const center = [43.3614, -5.8593]; // Asturias

  useEffect(() => {
    axios
      .get(`${api}/api/places`)
      .then((r) => setPlaces(r.data))
      .catch(() => setPlaces([]));
  }, [api]);

  return (
    <div id="mapa" className="rounded-2xl overflow-hidden border h-[420px]">
      <MapContainer
        center={center}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl overflow-hidden"
      >
        <ResizeHandler />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((p) => (
          <Marker
            key={p._id || `${p.coords?.lat}-${p.coords?.lng}`}
            position={[p.coords.lat, p.coords.lng]}
            icon={icon}
          >
            <Popup>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-600 mb-1">
                {p.type} · {p.rating ?? "–"}/5
              </div>
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

