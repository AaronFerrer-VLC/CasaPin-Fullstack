import { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, InfoWindowF, LoadScript } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "520px", borderRadius: "16px" };

export default function MapView() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const apiKey  = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [places, setPlaces] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch(`${apiBase}/api/places`)
      .then(r => r.json())
      .then(d => (Array.isArray(d) ? setPlaces(d) : setPlaces([])))
      .catch(() => setPlaces([]));
  }, [apiBase]);

  const casaLat = Number(import.meta.env.VITE_CASA_LAT);
  const casaLng = Number(import.meta.env.VITE_CASA_LNG);
  const CASA = (!Number.isNaN(casaLat) && !Number.isNaN(casaLng))
    ? { lat: casaLat, lng: casaLng }
    : null;

  const center = useMemo(() => {
    if (CASA) return CASA;
    if (places.length) return { lat: places[0].coords.lat, lng: places[0].coords.lng };
    return { lat: 43.36, lng: -5.85 };
  }, [CASA, places]);

  const markers = useMemo(
    () => places.map(p => ({
      id: p._id,
      position: { lat: p.coords.lat, lng: p.coords.lng },
      name: p.name,
      type: p.type,
      url: p.url,
    })),
    [places]
  );

  if (!apiKey) {
    return (
      <div className="rounded-2xl border h-[520px] grid place-items-center">
        Falta VITE_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} /* libraries={['places']} si las necesitas */>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={CASA ? 12 : 9}
        options={{ fullscreenControl: false, streetViewControl: false, mapTypeControl: false }}
        onClick={() => setActive(null)}
      >
        {CASA && (
          <Marker
            position={CASA}
            label="🏠"
            onClick={() => setActive({ name: "Casa Pin", position: CASA, type: "Alojamiento" })}
          />
        )}

        {markers.map(m => (
          <Marker key={m.id} position={m.position} onClick={() => setActive(m)} />
        ))}

        {active && (
          <InfoWindowF position={active.position} onCloseClick={() => setActive(null)}>
            <div style={{ maxWidth: 220 }}>
              <div style={{ fontWeight: 600 }}>{active.name}</div>
              {active.type && <div style={{ fontSize: 12, color: "#6b7280" }}>{active.type}</div>}
              {active.url && (
                <a href={active.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, textDecoration: "underline" }}>
                  Ver más
                </a>
              )}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </LoadScript>
  );
}




