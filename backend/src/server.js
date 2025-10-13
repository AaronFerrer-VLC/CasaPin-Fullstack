import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import placesRouter from "./routes/places.js";
import contactRouter from "./routes/contact.js";
import adminRouter from "./routes/admin.js";
// Si tienes la ruta admin creada, puedes importarla y montarla también.
// import adminRouter from "./routes/admin.js";

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

// Healthcheck: no dependas de la DB para responder
app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: dbReady, ts: new Date().toISOString() });
});

// Rutas
app.use("/api/places", placesRouter);
app.use("/api/contact", contactRouter);
// app.use("/api/admin", adminRouter);

// Root
app.get("/", (req, res) => res.send("CasaPin API ✔"));

// ⬇️ Arranca el servidor **una sola vez**, en 0.0.0.0:8080
app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});

// ⬇️ Conecta Mongo **en segundo plano** (no mates el proceso si falla)
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
    // No process.exit(); deja que la app viva y el healthcheck pase
  }
})();

// Evita que errores no controlados tumben el proceso
process.on("unhandledRejection", (e) => console.error("UNHANDLED:", e));
process.on("uncaughtException", (e) => console.error("UNCAUGHT:", e));


