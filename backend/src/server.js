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
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin) || (!origin && process.env.NODE_ENV === "development")) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
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

// Aplicar rate limiting a todas las rutas API
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1;
  res.status(dbStatus ? 200 : 503).json({
    ok: dbStatus,
    db: dbStatus ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Rutas API
app.use("/api/places", placesRouter);
app.use("/api/contact", contactRouter);

// Raíz
app.get("/", (_req, res) => res.send("CasaPin API ✔"));

// 404 handler (después de todas las rutas)
app.use(notFoundHandler);

// Error handler (al final)
app.use(errorHandler);

// --- Escuchar UNA sola vez ---
app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});

// --- Conexión Mongo asíncrona (sin tumbar el proceso) ---
(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI");
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    dbReady = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB init error:", err.message);
  }
})();

process.on("unhandledRejection", (e) => console.error("UNHANDLED:", e));
process.on("uncaughtException", (e) => {
  console.error("UNCAUGHT:", e);
  process.exit(1);
});




