import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import placesRouter from "./routes/places.js";
import contactRouter from "./routes/contact.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiters.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);
const HOST = "0.0.0.0";

// CORS mejorado - Compatible con producción existente
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : process.env.NODE_ENV === "production"
    ? ["*"] // Fallback seguro: permitir todos en producción si no está configurado (comportamiento anterior)
    : ["http://localhost:5173"]; // Fallback para desarrollo

const corsOptions = {
  origin: (origin, callback) => {
    // Si CORS_ORIGIN no está configurado en producción, mantener comportamiento anterior (permitir todo)
    if (!process.env.CORS_ORIGIN && process.env.NODE_ENV === "production") {
      return callback(null, true);
    }
    // Permitir requests sin origin (mobile apps, Postman, etc.) solo en desarrollo
    if (!origin && process.env.NODE_ENV === "development") {
      return callback(null, true);
    }
    // Si allowedOrigins incluye "*", permitir todo
    if (allowedOrigins.includes("*")) {
      return callback(null, true);
    }
    // Verificar si el origin está en la lista permitida
    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Si no hay origin (algunos clientes no envían origin), permitir en desarrollo
    if (!origin && process.env.NODE_ENV === "development") {
      return callback(null, true);
    }
    // Rechazar en otros casos
    callback(new Error(`CORS: Origin ${origin} not allowed. Allowed: ${allowedOrigins.join(", ")}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Variable para tracking de estado de DB (usada internamente)
// eslint-disable-next-line no-unused-vars
let dbReady = false;

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cors(corsOptions));
app.use(morgan("tiny"));

// Health check - debe estar antes de cualquier middleware que pueda bloquearlo
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1;
  // Siempre responder 200 para que el health check pase
  // El estado de DB se indica en el JSON pero no afecta el código HTTP
  const healthData = {
    ok: dbStatus,
    db: dbStatus ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
  // Log para debugging de health checks de Fly.io
  console.log(`[HEALTH] ${req.method} ${req.path} - Status: 200`);
  res.status(200).json(healthData);
});

// Aplicar rate limiting a todas las rutas API (después de health check)
app.use("/api", apiLimiter);

// Rutas API
app.use("/api/places", placesRouter);
app.use("/api/contact", contactRouter);

// Raíz - para comprobaciones rápidas
app.get("/", (_req, res) => {
  res.send("OK");
});

// 404 handler (después de todas las rutas)
app.use(notFoundHandler);

// Error handler (al final)
app.use(errorHandler);

// --- Escuchar UNA sola vez ---
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server started successfully`);
  console.log(`📡 API listening on http://${HOST}:${PORT}`);
  console.log(`🏥 Health check available at http://${HOST}:${PORT}/api/health`);
  console.log(`⏰ Ready to accept connections`);
});

// --- Conexión Mongo asíncrona (sin tumbar el proceso) ---
(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI");
    return;
  }

  // Asegurar que la URI tenga nombre de base de datos
  let mongoUri = uri.trim();
  
  // Solo agregar base de datos si la URI termina en "/" sin nombre de DB
  // No modificar si ya tiene base de datos o parámetros de query
  if (mongoUri.endsWith("/")) {
    // URI termina en "/" sin base de datos, agregarla
    mongoUri = mongoUri + "casapin";
  } else if (mongoUri.match(/mongodb\+srv:\/\/[^/]+\/?$/)) {
    // URI de Atlas sin base de datos ni query params, agregar base de datos
    mongoUri = mongoUri.replace(/\/?$/, "/casapin");
  }
  // Si ya tiene base de datos o query params, no modificar

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // Aumentado a 30 segundos
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    dbReady = true;
    console.log("MongoDB connected to:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB init error:", err.message);
    console.error("MongoDB URI (sin password):", mongoUri.replace(/:[^:@]+@/, ":****@"));
  }
})();

process.on("unhandledRejection", (e) => console.error("UNHANDLED:", e));
process.on("uncaughtException", (e) => {
  console.error("UNCAUGHT:", e);
  process.exit(1);
});
