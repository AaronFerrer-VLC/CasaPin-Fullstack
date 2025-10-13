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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";
const ORIGIN = process.env.CORS_ORIGIN || "*";

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: ORIGIN }));
app.use(morgan("tiny"));

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Routes
app.use("/api/places", placesRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);

// Root
app.get("/", (req, res) => res.send("CasaPin API ✔"));

async function start() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");

    await mongoose.connect(uri, {});
    console.log("MongoDB connected");

    app.listen(PORT, HOST, () => {
      console.log(`API ready on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Fatal:", err);
    process.exit(1);
  }
}

start();

