# CasaPin — Proyecto listo para desplegar (Frontend + Backend)

**Stack elegido:**  
- Frontend: React + Vite + Tailwind + Leaflet (Netlify)  
- Backend: Node.js + Express + MongoDB (Fly.io)  

> Motivo: Tu proyecto original estaba en Django con SQLite. Para cumplir **MongoDB (Compass)** + **Netlify** + **Fly.io**, la opción más estable es Express + MongoDB (Mongoose) para el backend y React para el frontend.

---

## 1) Requisitos
- Node.js 18+
- MongoDB en tu máquina o Atlas (Compass es el cliente GUI)
- Cuentas en: Netlify y Fly.io
- CLI de Fly: `flyctl`

## 2) Arranque local (100%)
### Backend
```bash
cd backend
cp .env.example .env
# Edita MONGODB_URI si usas local: mongodb://localhost:27017/casapin
npm install
npm run seed   # carga 3 lugares de ejemplo
npm run dev    # http://localhost:8080/api/health
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Asegúrate que VITE_API_BASE_URL = http://localhost:8080
npm install
npm run dev    # http://localhost:5173
```

---

## 3) Estructura de datos en MongoDB (Compass)
Colección: **places**
```json
{
  "name": "Playa de Rodiles",
  "type": "beach",                       // "restaurant" | "beach" | "activity" | "poi"
  "description": "Texto...",
  "rating": 4.7,                         // 0..5
  "address": "Dirección...",
  "url": "https://...",
  "images": ["https://..."],
  "coords": { "lat": 43.511, "lng": -5.402 }
}
```
- Puedes **Insert Document** en Compass para añadir lugares.  
- O importar un JSON masivo: `cd backend && node importJSON.js ./tus-datos.json`

---

## 4) Despliegue — Backend en Fly.io
```bash
cd backend
flyctl auth login
flyctl launch --copy-config --name casapin-backend --now  # acepta región (mad)

# Secrets necesarios:
flyctl secrets set MONGODB_URI="TU_URI_MONGO"
flyctl secrets set CORS_ORIGIN="https://TU-SITIO-NETLIFY.netlify.app"
# (Opcional) contacto por email
flyctl secrets set CONTACT_TO="tucorreo@ejemplo.com"

# Deploy:
flyctl deploy
# Prueba:
flyctl logs
# Salud:
curl https://casapin-backend.fly.dev/api/health
```

---

## 5) Despliegue — Frontend en Netlify
1. Crear **New site** desde carpeta `frontend` (sube el repo o arrastra & suelta).
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. **Environment variables** en Netlify:
   - `VITE_API_BASE_URL = https://casapin-backend.fly.dev` (ajusta con tu URL real)
   - `VITE_BOOKING_URL = https://www.booking.com/hotel/es/vivienda-vacacional-casa-pin.es.html`
5. Deploy y prueba la web.

---

## 6) Verificaciones rápidas
- `GET /api/health` → `{ ok: true }`
- `GET /api/places` → lista de lugares
- Página Netlify carga mapa + tarjetas (si hay datos en `places`).

---

## 7) Problemas comunes (y solución)
- **CORS**: si el frontend no puede llamar al backend, revisa `CORS_ORIGIN` (secret en Fly) y la URL de `VITE_API_BASE_URL` en Netlify.
- **Mongo no conecta**: comprueba `MONGODB_URI`, IP allowlist (Atlas) o si el servicio local está arrancado.
- **Mapa sin puntos**: rellena datos en `places` (Compass) o ejecuta `npm run seed`.
- **Email contacto**: si no pones `CONTACT_TO`, la API devuelve `ok: true` pero no envía. Para SMTP, añade `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

---

## 8) Personalización
- Hero, textos, imágenes → `frontend/src/pages/App.jsx` y componentes en `src/components/*`.
- Colores y diseño → Tailwind en `frontend/src/styles.css`.
- Nuevos tipos de lugares → añade en `backend/src/models/Place.js` (enum `type`) y adapta el frontend (filtros).

¡Listo! Cualquier duda, dime exactamente dónde te atascas y te lo dejo al clic 🙂
