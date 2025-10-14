// frontend/src/components/MapView.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

// ⛔️ MUY IMPORTANTE: mantener la constante fuera del componente
const LIBRARIES = ["places"];
const CONTAINER_STYLE = { width: "100%", height: "520px", borderRadius: "16px" };

export default function MapView() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    id: "gmaps-script",
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const [places, setPlaces] = useState([]);
  const [directions, setDirections] = useState(null);
  const [dest, setDest] = useState(null); // { lat, lng, name? }

  const mapRef = useRef(null);

  // Carga de tus lugares desde la API
  useEffect(() => {
    fetch(`${apiBase}/api/places`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? setPlaces(d) : setPlaces([])))
      .catch(() => setPlaces([]));
  }, [apiBase]);

  // Coordenadas Casa Pin (env)
  const casaLat = Number(import.meta.env.VITE_CASA_LAT);
  const casaLng = Number(import.meta.env.VITE_CASA_LNG);
  const CASA =
    !Number.isNaN(casaLat) && !Number.isNaN(casaLng)
      ? { lat: casaLat, lng: casaLng }
      : { lat: 43.36149215698242, lng: -4.549238681793213 }; // fallback

  const center = useMemo(() => CASA, [CASA]);

  // Fallback externo (si Directions API no está habilitada)
  const openExternalDirections = (to) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${CASA.lat},${CASA.lng}&destination=${to.lat},${to.lng}&travelmode=driving`;
    window.open(url, "_blank", "noopener");
  };

  // Calcula ruta Casa -> destino (si falla, abre Google Maps)
  const routeTo = async (to) => {
    if (!isLoaded || !to) return;
    try {
      // Si no existe el servicio (o no está habilitada Directions API), hacemos fallback
      if (!window.google?.maps?.DirectionsService) {
        openExternalDirections(to);
        return;
      }

      const svc = new window.google.maps.DirectionsService();
      const res = await svc.route({
        origin: CASA,
        destination: to,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirections(res);
      setDest(to);

      if (mapRef.current && res.routes?.[0]?.bounds) {
        mapRef.current.fitBounds(res.routes[0].bounds);
      }
    } catch (err) {
      console.warn("Directions error, abriendo Google Maps:", err);
      openExternalDirections(to);
    }
  };

  // Conectar el web-component de autocomplete al input
  useEffect(() => {
    if (!isLoaded) return;
    const el = document.querySelector("gmpx-place-autocomplete");
    if (!el) return;

    const onChange = () => {
      const p = el.value; // objeto Place del web-component
      const loc = p?.location;
      if (!loc) return;
      const to = {
        lat: loc.lat,
        lng: loc.lng,
        name: p.displayName || p.formattedAddress,
      };
      routeTo(to);
    };

    el.addEventListener("gmpx-placechange", onChange);
    return () => el.removeEventListener("gmpx-placechange", onChange);
  }, [isLoaded]); // no dependas de nada más

  if (!apiKey) {
    return (
      <div className="rounded-2xl border h-[520px] grid place-items-center">
        Falta VITE_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  return isLoaded ? (
    <div className="relative space-y-3">
      {/* Barra de búsqueda (nuevo Autocomplete) */}
      <div className="relative">
        <input
          id="map-search"
          className="w-full rounded-xl border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700"
          placeholder="Buscar sitio cercano (playa, restaurante, mirador...)"
        />
        {/* Vinculamos el input por id */}
        <gmpx-place-autocomplete for="map-search"></gmpx-place-autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={CONTAINER_STYLE}
        center={center}
        zoom={12}
        onLoad={(m) => (mapRef.current = m)}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* Casa Pin */}
        <MarkerF position={CASA} label="🏠" />

        {/* Marcadores de tu API: clic = intentar ruta (o abrir Google Maps) */}
        {places.map((p) => {
          const pos = { lat: p?.coords?.lat, lng: p?.coords?.lng };
          if (!pos.lat || !pos.lng) return null;
          return (
            <MarkerF
              key={p._id || p.name}
              position={pos}
              title={p.name}
              onClick={() => routeTo({ ...pos, name: p.name })}
            />
          );
        })}

        {/* Dibujo de la ruta, si se pudo calcular */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Botón limpiar */}
      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => {
            setDirections(null);
            setDest(null);
            if (mapRef.current) {
              mapRef.current.panTo(CASA);
              mapRef.current.setZoom(12);
            }
          }}
        >
          Limpiar ruta
        </button>
        {dest && (
          <button
            className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => openExternalDirections(dest)}
          >
            Abrir “Cómo llegar” en Google Maps
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="rounded-2xl border h-[520px] grid place-items-center">
      Cargando mapa…
    </div>
  );
}

