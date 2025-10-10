import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapView from "../components/MapView";
import PlaceCard from "../components/PlaceCard";

export default function App(){
  const [places, setPlaces] = useState([]);
  const api = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    axios.get(`${api}/api/places`).then(r => setPlaces(r.data)).catch(() => setPlaces([]));
  }, [api]);

  const byType = (t) => places.filter(p => p.type === t);

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4">
        <section className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Casa Pin · Asturias</h1>
              <p className="mt-4 text-gray-700">Tu refugio rural entre mar y montaña. Descubre playas, restaurantes y actividades cerca.</p>
              <div className="mt-6 flex gap-3">
                <a href="#mapa" className="px-4 py-2 rounded-xl border">Ver en el mapa</a>
                <a href="#lugares" className="px-4 py-2 rounded-xl bg-black text-white">Explorar lugares</a>
              </div>
            </div>
            <img className="rounded-2xl border shadow-sm" src="https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8f?q=80&w=1600&auto=format&fit=crop" alt="Casa rural" />
          </div>
        </section>

        <MapView />

        <section id="lugares" className="py-12 md:py-16">
          <h2 className="text-2xl font-semibold mb-6">Restaurantes</h2>
          <div className="grid md:grid-cols-3 gap-6">{byType("restaurant").map(p => <PlaceCard key={p._id} p={p} />)}</div>

          <h2 className="text-2xl font-semibold my-6 mt-12">Playas</h2>
          <div className="grid md:grid-cols-3 gap-6">{byType("beach").map(p => <PlaceCard key={p._id} p={p} />)}</div>

          <h2 className="text-2xl font-semibold my-6 mt-12">Actividades</h2>
          <div className="grid md:grid-cols-3 gap-6">{byType("activity").map(p => <PlaceCard key={p._id} p={p} />)}</div>
        </section>

        <section id="contacto" className="py-12 md:py-16">
          <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  )
}

function ContactForm(){
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState(null);
  const api = import.meta.env.VITE_API_BASE_URL || "";

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await axios.post(`${api}/api/contact`, form);
      setStatus(r.data.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 max-w-xl">
      <input required placeholder="Nombre" className="border rounded-xl px-3 py-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      <input required type="email" placeholder="Email" className="border rounded-xl px-3 py-2" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <textarea required placeholder="Mensaje" className="border rounded-xl px-3 py-2" rows={5} value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
      <button className="px-4 py-2 rounded-xl bg-black text-white">Enviar</button>
      {status === "ok" && <p className="text-green-700 text-sm">Enviado. ¡Gracias!</p>}
      {status === "error" && <p className="text-red-700 text-sm">Error al enviar. Prueba de nuevo.</p>}
      {status === "sending" && <p className="text-sm">Enviando…</p>}
    </form>
  )
}
