# CasaPin Frontend (React + Vite + Tailwind + Leaflet)

## Desarrollo local
```bash
cd frontend
cp .env.example .env
npm install
npm run dev  # http://localhost:5173
```
Asegúrate de que `VITE_API_BASE_URL` apunta al backend (por defecto http://localhost:8080).

## Despliegue en Netlify
1. Crea un nuevo sitio y selecciona esta carpeta `frontend`.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Variables de entorno:
   - `VITE_API_BASE_URL=https://casapin-backend.fly.dev` (cambia por tu URL)
   - `VITE_BOOKING_URL=https://www.booking.com/hotel/es/vivienda-vacacional-casa-pin.es.html`
5. (SPA opcional) si usas rutas, añade un `_redirects` para redirigir a `index.html`.
