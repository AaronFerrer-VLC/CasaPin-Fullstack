import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

import placesRouter from "./routes/places.js";
import contactRouter from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);
const HOST = "0.0.0.0";
const ORIGIN = process.env.CORS_ORIGIN || "*";

let dbReady = false;

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: ORIGIN }));
app.use(morgan("tiny"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, db: dbReady, ts: new Date().toISOString() });
});

// Rutas API
app.use("/api/places", placesRouter);
app.use("/api/contact", contactRouter);

// Raíz
app.get("/", (_req, res) => res.send("CasaPin API ✔"));

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

process.on("unhandledRejection", e => console.error("UNHANDLED:", e));
process.on("uncaughtException", e => console.error("UNCAUGHT:", e));




