import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapView from "../components/MapView";
import PlaceCard from "../components/PlaceCard";
import Lightbox from "../components/Lightbox";

export default function App() {
  const [places, setPlaces] = useState([]);

  // Carga de lugares desde tu API
  useEffect(() => {
    const api = import.meta.env.VITE_API_BASE_URL || "";
    fetch(`${api}/api/places`)
      .then((r) => r.json())
      .then((d) => setPlaces(Array.isArray(d) ? d : []))
      .catch(() => setPlaces([]));
  }, []);

  // Listas para las 3 columnas (sin fallback)
  const beaches = places.filter((p) => p.type === "beach").slice(0, 4);
  const food    = places.filter((p) => p.type === "restaurant").slice(0, 4);
  const plans   = places.filter((p) => ["activity", "poi"].includes(p.type)).slice(0, 4);

  // Galería simple: /public/casa/1.jpg ... 10.jpg
  const fotos  = Array.from({ length: 10 }, (_, i) => i + 1);
  const images = fotos.map((n) => `/casa/${n}.jpg`);

  const [lbOpen, setLbOpen]   = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // ¿Hay algo que mostrar en “Alrededores”?
  const hasAround = beaches.length || food.length || plans.length;

// URL base de la API
const api = import.meta.env.VITE_API_BASE_URL || "";

// Estado del formulario
const [form, setForm] = useState({
  name: "",
  email: "",
  dates: "",
  message: "",
});

// Estado de envío y resultado
const [sending, setSending] = useState(false);
const [status, setStatus] = useState(null); // { ok: boolean, msg: string }
const [errors, setErrors] = useState({}); // Errores de validación

// Validación de email
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validar formulario
const validateForm = () => {
  const newErrors = {};

  if (!form.name.trim() || form.name.trim().length < 2) {
    newErrors.name = "El nombre debe tener al menos 2 caracteres";
  }

  if (!validateEmail(form.email)) {
    newErrors.email = "Email inválido";
  }

  if (!form.message.trim() || form.message.trim().length < 10) {
    newErrors.message = "El mensaje debe tener al menos 10 caracteres";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// Helpers
const onChange = (e) => {
  const { name, value } = e.target;
  setForm((f) => ({ ...f, [name]: value }));
  // Limpiar error del campo cuando el usuario empieza a escribir
  if (errors[name]) {
    setErrors((e) => ({ ...e, [name]: "" }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar antes de enviar
  if (!validateForm()) {
    setStatus({
      ok: false,
      msg: "Por favor, corrige los errores en el formulario.",
    });
    return;
  }

  setSending(true);
  setStatus(null);
  setErrors({});

  try {
    const res = await fetch(`${api}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      // Intentar leer mensaje del servidor
      let msg = "No se pudo enviar. Inténtalo de nuevo.";
      if (data?.error) {
        msg = data.error;
      } else if (data?.errors && Array.isArray(data.errors)) {
        msg = data.errors.map((e) => e.msg || e.message).join(", ");
      }
      throw new Error(msg);
    }

    setStatus({ ok: true, msg: "¡Mensaje enviado! Te responderemos muy pronto." });
    setForm({ name: "", email: "", dates: "", message: "" });
    setErrors({});
  } catch (err) {
    setStatus({
      ok: false,
      msg:
        err.message ||
        "No se pudo enviar. Escríbenos a hola@casapin.es si el problema persiste.",
    });
  } finally {
    setSending(false);
  }
};


  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            Casa Pin
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Una casa rural familiar entre el Cantábrico y los Picos de Europa.
            Naturaleza, tranquilidad y una ubicación perfecta para explorar
            Asturias y Cantabria.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#contacto"
              className="px-5 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Reservar
            </a>
            {hasAround ? (
              <a
                href="#alrededores"
                className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Explorar alrededores
              </a>
            ) : null}
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
            <li>🏖️ Playas a 10–20 min</li>
            <li>🌄 Picos a &lt; 1 h</li>
            <li>🌿 Naturaleza salvaje</li>
            <li>📶 Wi-Fi y teletrabajo</li>
          </ul>
        </div>

        {/* Imagen principal */}
        <img
          src="/casa/1.jpg"
          alt="Casa Pin - exterior"
          className="w-full h-72 md:h-96 object-cover rounded-2xl border border-gray-200 dark:border-gray-800"
        />
      </section>

      {/* LA CASA */}
      <section id="casa" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">La casa</h2>
        <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-3xl">
          3 dormitorios, 1 baño, salón acogedor y cocina equipada para que te
          sientas como en casa. Ropa de cama y toallas incluidas. Cuna/trona
          bajo petición. Aparcamiento cercano.
        </p>

        {/* Galería: intenta .jpg y, si falla, .jpeg; si tampoco, oculta esa tarjeta */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((n, idx) => (
            <img
              key={n}
              src={`/casa/${n}.jpg`}
              alt={`Casa Pin ${n}`}
              className="rounded-xl border border-gray-200 dark:border-gray-800 w-full object-cover aspect-[4/3] cursor-zoom-in"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onClick={() => { setLbIndex(idx); setLbOpen(true); }}
              onError={(e) => {
                if (!e.currentTarget.dataset.triedjpeg) {
                  e.currentTarget.dataset.triedjpeg = "1";
                  e.currentTarget.src = `/casa/${n}.jpeg`;
                } else {
                  e.currentTarget.style.display = "none";
                }
              }}
            />
          ))}
        </div>

        <Lightbox
          open={lbOpen}
          images={images}
          index={lbIndex}
          onClose={() => setLbOpen(false)}
          onIndex={(updater) =>
            setLbIndex(typeof updater === "function" ? updater(lbIndex) : updater)
          }
        />
      </section>

      {/* ALREDEDORES (solo si hay datos de la API) */}
      {hasAround && (
        <section id="alrededores" className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Alrededores</h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-3xl">
            Playas salvajes, cuevas con arte rupestre y pueblos marineros.
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {beaches.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Playas</h3>
                <div className="grid gap-3">
                  {beaches.map((p) => (
                    <PlaceCard key={p._id || p.name} p={p} />
                  ))}
                </div>
              </div>
            )}

            {food.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Dónde comer</h3>
                <div className="grid gap-3">
                  {food.map((p) => (
                    <PlaceCard key={p._id || p.name} p={p} />
                  ))}
                </div>
              </div>
            )}

            {plans.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Planes en familia</h3>
                <div className="grid gap-3">
                  {plans.map((p) => (
                    <PlaceCard key={p._id || p.name} p={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mapa solo si hay lugares */}
          {places.length > 0 && (
            <div className="mt-8">
              <MapView />
            </div>
          )}
        </section>
      )}

      {/* PRECIOS */}
      <section id="precios" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">Precios y reserva</h2>
        <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-3xl">
          Tarifas orientativas por temporada. Pide presupuesto final según
          fechas y número de personas.
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="font-medium">Temporada baja</div>
            <div className="text-gray-700 dark:text-gray-300">
              Entre semana y fuera de puentes
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="font-medium">Temporada media</div>
            <div className="text-gray-700 dark:text-gray-300">Primavera y otoño</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="font-medium">Temporada alta</div>
            <div className="text-gray-700 dark:text-gray-300">Verano y festivos</div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">Contacto</h2>
        <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-3xl">
          ¿Dudas o disponibilidad? Escríbenos y te respondemos rápido.
        </p>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <form
  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3"
  onSubmit={handleSubmit}
>
  {/* Mensajes de estado */}
  {status && (
    <div
      className={`text-sm rounded-lg px-3 py-2 ${
        status.ok
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
          : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200"
      }`}
      role="status"
      aria-live="polite"
    >
      {status.msg}
    </div>
  )}

  <div>
    <input
      name="name"
      value={form.name}
      onChange={onChange}
      className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
        errors.name
          ? "border-red-500 dark:border-red-500"
          : "border-gray-300 dark:border-gray-700"
      }`}
      placeholder="Tu nombre"
      required
    />
    {errors.name && (
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
    )}
  </div>

  <div>
    <input
      name="email"
      value={form.email}
      onChange={onChange}
      className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
        errors.email
          ? "border-red-500 dark:border-red-500"
          : "border-gray-300 dark:border-gray-700"
      }`}
      placeholder="Email"
      type="email"
      required
    />
    {errors.email && (
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
    )}
  </div>

  <div>
    <input
      name="dates"
      value={form.dates}
      onChange={onChange}
      className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2"
      placeholder="Fechas (aprox.)"
    />
  </div>

  <div>
    <textarea
      name="message"
      value={form.message}
      onChange={onChange}
      className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
        errors.message
          ? "border-red-500 dark:border-red-500"
          : "border-gray-300 dark:border-gray-700"
      }`}
      rows="4"
      placeholder="Mensaje"
      required
    />
    {errors.message && (
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.message}</p>
    )}
  </div>

  <button type="submit" disabled={sending}
    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
    {sending ? "Enviando…" : "Enviar"}
  </button>
</form>


          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="mb-2 text-gray-800 dark:text-gray-200">
              📍 Villanueva de Colombres (Ribadedeva, Asturias)
            </div>
            <div className="mb-2 text-gray-800 dark:text-gray-200">📞 +34 600 000 000</div>
            <div className="mb-2 text-gray-800 dark:text-gray-200">📧 hola@casapin.es</div>
            <a
              href="https://wa.me/34600000000?text=Hola%20Casa%20Pin,%20me%20interesa%20reservar%20del%20%7Bfecha-in%7D%20al%20%7Bfecha-out%7D%20para%20%7Bn%7D%20personas."
              target="_blank" rel="noreferrer"
              className="inline-block mt-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
              WhatsApp directo
            </a>
          </div>
        </div>
      </section>

      {/* CTA flotante solo en móvil */}
      <a
        href="#contacto"
        className="fixed md:hidden bottom-4 inset-x-4 z-40 shadow-lg px-5 py-3 rounded-xl bg-emerald-600 text-white text-center font-medium"
      >
        Reservar ahora
      </a>

      <Footer />
    </div>
  );
}



