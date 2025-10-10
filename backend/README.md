# CasaPin Backend (Express + MongoDB)

## Requisitos
- Node.js 18+
- MongoDB (Compass/Atlas)
- Opcional: Fly.io CLI (`flyctl`)

## Desarrollo local
```bash
cd backend
cp .env.example .env
# Edita MONGODB_URI si usas Compass (mongodb://localhost:27017/casapin)
npm install
npm run seed   # datos de ejemplo
npm run dev    # http://localhost:8080/api/health
```

## Despliegue en Fly.io
```bash
cd backend
flyctl launch --copy-config --now --name casapin-backend
# Configura secrets (al menos MONGODB_URI y CORS_ORIGIN):
flyctl secrets set MONGODB_URI="TU_URI" CORS_ORIGIN="https://TU-SITIO-NETLIFY.netlify.app" CONTACT_TO="tu@correo.com"
flyctl deploy
```
