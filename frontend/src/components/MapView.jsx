// frontend/src/components/MapView.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";

const CONTAINER_STYLE = { width: "100%", height: "520px", borderRadius: "16px" };
// 👇 clave para evitar la alerta: NO recrear este array en cada render
const LIBRARIES = ["places"];

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
  const [dest, setDest] = useState(null); // {lat, lng, name?}

  const acRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetch(`${apiBase}/api/places`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? setPlaces(d) : setPlaces([])))
      .catch(() => setPlaces([]));
  }, [apiBase]);

  // Coordenadas Casa Pin (desde .env)
  const casaLat = Number(import.meta.env.VITE_CASA_LAT);
  const casaLng = Number(import.meta.env.VITE_CASA_LNG);
  const CASA =
    !Number.isNaN(casaLat) && !Number.isNaN(casaLng)
      ? { lat: casaLat, lng: casaLng }
      : { lat: 43.36149215698242, lng: -4.549238681793213 }; // fallback

  const center = useMemo(() => CASA, [CASA]);

  // Calcula ruta (Casa -> destino)
  const routeTo = async (to) => {
    if (!isLoaded || !to) return;
    try {
      // Usa el servicio de direcciones del JS API
      const svc = new window.google.maps.DirectionsService();
      const res = await svc.route({
        origin: CASA,
        destination: to,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirections(res);
      setDest(to);
      // centra el mapa en la ruta
      if (mapRef.current && res.routes?.[0]?.bounds) {
        mapRef.current.fitBounds(res.routes[0].bounds);
      }
    } catch (err) {
      console.error("Directions error:", err);
      alert(
        "No se ha podido calcular la ruta (revisa que la API de Directions esté habilitada y la key permita este dominio)."
      );
    }
  };

  // Cuando el usuario elige un sitio en el Autocomplete
  const onPlaceChanged = () => {
    const ac = acRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    const loc = place?.geometry?.location;
    if (!loc) return;
    const to = { lat: loc.lat(), lng: loc.lng(), name: place.name };
    routeTo(to);
  };

  if (!apiKey) {
    return (
      <div className="rounded-2xl border h-[520px] grid place-items-center">
        Falta VITE_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  return isLoaded ? (
    <div className="relative">
      {/* Barra de búsqueda */}
      <div className="absolute z-10 left-3 top-3 right-3 md:left-4 md:right-auto">
        <div className="flex gap-2 bg-white dark:bg-gray-900 border rounded-xl p-2 shadow">
          <Autocomplete
            onLoad={(ac) => (acRef.current = ac)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Buscar sitio cercano..."
              className="flex-1 px-3 py-2 rounded-lg border outline-none bg-white dark:bg-gray-900"
            />
          </Autocomplete>
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
        </div>
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
        onClick={() => {
          // cerrar info / limpiar selección si quieres
        }}
      >
        {/* Marca de la casa */}
        <MarkerF position={CASA} label="🏠" />

        {/* Marcadores de tu API (clic = trazar ruta) */}
        {places.map((p) => {
          const pos = { lat: p?.coords?.lat, lng: p?.coords?.lng };
          if (!pos.lat || !pos.lng) return null;
          return (
            <MarkerF
              key={p._id || p.name}
              position={pos}
              onClick={() => routeTo({ ...pos, name: p.name })}
              title={p.name}
            />
          );
        })}

        {/* Dibujo de la ruta */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  ) : (
    <div className="rounded-2xl border h-[520px] grid place-items-center">
      Cargando mapa…
    </div>
  );
}
