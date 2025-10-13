import { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindowF,
  DirectionsRenderer,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";

export default function MapView() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const apiKey  = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Cargar Google Maps + Places
  const { isLoaded } = useJsApiLoader({
    id: "gmaps-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  // Datos de la API (lugares alrededor)
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    fetch(`${apiBase}/api/places`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? setPlaces(d) : setPlaces([])))
      .catch(() => setPlaces([]));
  }, [apiBase]);

  // Casa Pin (por env)
  const casaLat = Number(import.meta.env.VITE_CASA_LAT);
  const casaLng = Number(import.meta.env.VITE_CASA_LNG);
  const CASA =
    !Number.isNaN(casaLat) && !Number.isNaN(casaLng)
      ? { lat: casaLat, lng: casaLng }
      : { lat: 43.36, lng: -5.85 };

  // UI mapa
  const mapRef = useRef(null);
  const [active, setActive] = useState(null); // marker seleccionado
  const [height, setHeight] = useState(320);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setHeight(mq.matches ? 520 : 320);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Búsqueda (Google Places)
  const searchRef = useRef(null);
  const inputRef  = useRef(null);
  const onPlacesChanged = () => {
    const sb = searchRef.current;
    if (!sb) return;
    const results = sb.getPlaces();
    if (!results || !results.length) return;
    const place = results[0];
    if (!place.geometry?.location) return;
    const dest = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name,
      url: place.url,
      type: "Lugar",
    };
    setDestination(dest);
    setActive(dest);
    if (mapRef.current) {
      mapRef.current.panTo(dest);
      mapRef.current.setZoom(13);
    }
  };

  // Marcadores de la API
  const markers = useMemo(
    () =>
      places.map((p) => ({
        id: p._id || `${p.coords.lat},${p.coords.lng}`,
        position: { lat: p.coords.lat, lng: p.coords.lng },
        name: p.name,
        type: p.type,
        url: p.url,
      })),
    [places]
  );

  // Rutas (Directions)
  const [origin, setOrigin] = useState(CASA);       // por defecto: Casa Pin
  const [destination, setDestination] = useState(null);
  const [mode, setMode] = useState("DRIVING");      // DRIVING | WALKING | BICYCLING
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const computeRoute = async () => {
    if (!origin || !destination || !window.google) return;
    const svc = new window.google.maps.DirectionsService();
    const req = {
      origin,
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: mode,
    };
    const res = await svc.route(req);
    setDirections(res);
    const leg = res.routes?.[0]?.legs?.[0];
    setDistance(leg?.distance?.text || "");
    setDuration(leg?.duration?.text || "");
  };

  const clearRoute = () => {
    setDirections(null);
    setDistance("");
    setDuration("");
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocalización no disponible");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin(me);
        if (mapRef.current) {
          mapRef.current.panTo(me);
          mapRef.current.setZoom(12);
        }
      },
      () => alert("No se pudo obtener tu ubicación")
    );
  };

  const gmapsDirectionsLink = () => {
    if (!origin || !destination) return "#";
    const o = `${origin.lat},${origin.lng}`;
    const d = `${destination.lat},${destination.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=${mode.toLowerCase()}`;
  };

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 grid place-items-center h-[320px] md:h-[520px]">
        Falta VITE_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  return isLoaded ? (
    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      {/* Controles flotantes */}
      <div className="absolute z-10 top-3 left-3 right-3 md:right-auto flex flex-col gap-2 md:w-[380px]">
        {/* Buscar sitios (Google Places) */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-2 shadow">
          <StandaloneSearchBox onLoad={(ref) => (searchRef.current = ref)} onPlacesChanged={onPlacesChanged}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar sitio (playa, restaurante, museo...)"
              className="w-full bg-transparent outline-none px-3 py-2 text-sm"
            />
          </StandaloneSearchBox>
        </div>

        {/* Panel de ruta */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-2 shadow flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-sm"
              onClick={() => setOrigin(CASA)}
              title="Usar Casa Pin como origen"
            >
              Origen: Casa Pin
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-sm"
              onClick={useMyLocation}
              title="Usar tu ubicación actual"
            >
              Origen: Mi ubicación
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs opacity-70">Modo:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800 bg-transparent text-sm"
            >
              <option value="DRIVING">Coche</option>
              <option value="WALKING">A pie</option>
              <option value="BICYCLING">Bici</option>
            </select>

            <button
              className="ml-auto px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-50"
              onClick={computeRoute}
              disabled={!destination}
            >
              Trazar ruta
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/60"
              onClick={clearRoute}
              disabled={!directions}
            >
              Limpiar
            </button>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400">
            {destination ? (
              <>
                Destino: <span className="font-medium">{destination.name || `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`}</span>
              </>
            ) : (
              <>Elige un destino buscando o tocando un marcador.</>
            )}
          </div>

          {(distance || duration) && (
            <div className="text-xs">
              <span className="mr-2">Distancia: <b>{distance}</b></span>
              <span>Tiempo aprox.: <b>{duration}</b></span>
            </div>
          )}

          <a
            href={gmapsDirectionsLink()}
            target="_blank"
            rel="noreferrer"
            className={`inline-block px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/60 ${!destination ? "pointer-events-none opacity-60" : ""}`}
          >
            Abrir en Google Maps
          </a>
        </div>
      </div>

      {/* El Mapa */}
      <GoogleMap
        onLoad={(map) => (mapRef.current = map)}
        mapContainerStyle={{ width: "100%", height }}
        center={CASA}
        zoom={12}
        options={{ fullscreenControl: false, streetViewControl: false, mapTypeControl: false }}
        onClick={() => setActive(null)}
      >
        {/* Pin Casa Pin */}
        <Marker
          position={CASA}
          label="🏠"
          onClick={() => setActive({ name: "Casa Pin", position: CASA, type: "Alojamiento", lat: CASA.lat, lng: CASA.lng })}
        />

        {/* Marcadores de /api/places */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.position}
            onClick={() => {
              setActive({ ...m, lat: m.position.lat, lng: m.position.lng });
              setDestination({ lat: m.position.lat, lng: m.position.lng, name: m.name, url: m.url, type: m.type });
            }}
          />
        ))}

        {/* InfoWindow del activo */}
        {active && (
          <InfoWindowF
            position={active.position || { lat: active.lat, lng: active.lng }}
            onCloseClick={() => setActive(null)}
          >
            <div style={{ maxWidth: 240 }}>
              <div style={{ fontWeight: 600 }}>{active.name || "Destino"}</div>
              {active.type && (
                <div style={{ fontSize: 12, color: "#6b7280" }}>{active.type}</div>
              )}
              {active.url && (
                <a
                  href={active.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, textDecoration: "underline" }}
                >
                  Ver más
                </a>
              )}
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => {
                    setDestination({ lat: active.position?.lat || active.lat, lng: active.position?.lng || active.lng, name: active.name, url: active.url, type: active.type });
                    computeRoute();
                  }}
                  className="px-2 py-1 rounded-md bg-emerald-600 text-white text-xs"
                >
                  Ruta desde {origin === CASA ? "Casa Pin" : "mi ubicación"}
                </button>
              </div>
            </div>
          </InfoWindowF>
        )}

        {/* Dibujo de la ruta */}
        {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />}
      </GoogleMap>
    </div>
  ) : (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 grid place-items-center h-[320px] md:h-[520px]">
      Cargando mapa…
    </div>
  );
}






