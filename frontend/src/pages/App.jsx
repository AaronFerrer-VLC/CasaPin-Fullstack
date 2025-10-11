import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapView from "../components/MapView";
import PlaceCard from "../components/PlaceCard";

export default function App() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // La propia MapView pide places; aquí solo mostramos cards si el backend expone /api/places
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/places")
      .then(r => r.json()).then(d => Array.isArray(d) ? setPlaces(d) : setPlaces([]))
      .catch(() => setPlaces([]));
  }, []);

  const beaches = places.filter(p => p.type === "beach").slice(0,4);
  const food = places.filter(p => p.type === "restaurant").slice(0,4);
  const plans = places.filter(p => ["activity","poi"].includes(p.type)).slice(0,4);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">Casa Pin · Villanueva de Colombres</h1>
          <p className="mt-4 text-lg text-gray-700">
            Una casa rural familiar entre el Cantábrico y los Picos de Europa.
            Jardín, tranquilidad y una ubicación perfecta para explorar Asturias y Cantabria.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#contacto" className="px-5 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Reservar</a>
            <a href="#alrededores" className="px-5 py-2.5 rounded-full border hover:bg-gray-50">Explorar alrededores</a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <li>🏖️ Playas a 10–20 min</li>
            <li>🌄 Picos a &lt; 1 h</li>
            <li>🌿 Jardín y barbacoa</li>
            <li>📶 Wi‑Fi y teletrabajo</li>
          </ul>
        </div>
        <img src="https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1600&auto=format&fit=crop" alt="Casa rural en Asturias" className="w-full h-72 md:h-96 object-cover rounded-2xl border" />
      </section>

      <section id="casa" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">La casa</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">
          3 dormitorios, 2 baños, salón acogedor y cocina equipada para que te sientas como en casa.
          Ropa de cama y toallas incluidas. Cuna/trona bajo petición. Aparcamiento en la finca.
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <img className="rounded-xl border h-48 w-full object-cover" src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop" alt="Salón" />
          <img className="rounded-xl border h-48 w-full object-cover" src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop" alt="Dormitorio" />
          <img className="rounded-xl border h-48 w-full object-cover" src="https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop" alt="Cocina" />
        </div>
      </section>

      <section id="alrededores" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">Alrededores</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">
          Playas salvajes, cuevas con arte rupestre y pueblos marineros. Aquí tienes una selección cercana para empezar.
        </p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Playas</h3>
            <div className="grid gap-3">{beaches.map(p => <PlaceCard key={p._id} p={p} />)}</div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Dónde comer</h3>
            <div className="grid gap-3">{food.map(p => <PlaceCard key={p._id} p={p} />)}</div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Planes en familia</h3>
            <div className="grid gap-3">{plans.map(p => <PlaceCard key={p._id} p={p} />)}</div>
          </div>
        </div>

        <div className="mt-8">
          <MapView />
        </div>
      </section>

      <section id="precios" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">Precios y reserva</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">
          Tarifas orientativas por temporada. Pide presupuesto final según fechas y número de personas.
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border p-4"><div className="font-medium">Temporada baja</div><div className="text-gray-700">Entre semana y fuera de puentes</div></div>
          <div className="rounded-xl border p-4"><div className="font-medium">Temporada media</div><div className="text-gray-700">Primavera y otoño</div></div>
          <div className="rounded-xl border p-4"><div className="font-medium">Temporada alta</div><div className="text-gray-700">Verano y festivos</div></div>
        </div>
      </section>

      <section id="contacto" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">Contacto</h2>
        <p className="mt-3 text-gray-700 max-w-3xl">
          ¿Dudas o disponibilidad? Escríbenos y te respondemos rápido.
        </p>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <form className="rounded-xl border p-4 space-y-3" onSubmit={(e)=>e.preventDefault()}>
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Tu nombre" required />
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" type="email" required />
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Fechas (aprox.)" />
            <textarea className="w-full border rounded-lg px-3 py-2" rows="4" placeholder="Mensaje"></textarea>
            <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Enviar</button>
          </form>
          <div className="rounded-xl border p-4">
            <div className="mb-2">📍 Villanueva de Colombres (Ribadedeva, Asturias)</div>
            <div className="mb-2">📞 +34 600 000 000</div>
            <div className="mb-2">📧 hola@casapin.es</div>
            <a href="https://wa.me/34600000000?text=Hola%20Casa%20Pin,%20me%20interesa%20reservar%20del%20%7Bfecha-in%7D%20al%20%7Bfecha-out%7D%20para%20%7Bn%7D%20personas." target="_blank" rel="noreferrer" className="inline-block mt-2 px-4 py-2 rounded-lg border hover:bg-gray-50">WhatsApp directo</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
