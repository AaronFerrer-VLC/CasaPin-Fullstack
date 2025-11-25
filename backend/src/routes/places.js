import express from "express";
import mongoose from "mongoose";
import Place from "../models/Place.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // Verificar conexión a MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ok: false,
        error: "Base de datos no disponible",
        dbStatus: mongoose.connection.readyState,
      });
    }

    const { type } = req.query;
    // Validar que type sea uno de los valores permitidos
    const validTypes = ["beach", "restaurant", "activity", "poi"];
    const q = type && validTypes.includes(type) ? { type } : {};
    const items = await Place.find(q).sort({ name: 1 }).lean();
    res.json(items);
  } catch (e) {
    console.error("Error en GET /api/places:", e.message);
    next(e);
  }
});

router.get("/:id", validateObjectId, async (req, res, next) => {
  try {
    const item = await Place.findById(req.params.id).lean();
    if (!item) {
      return res.status(404).json({ ok: false, error: "No encontrado" });
    }
    res.json(item);
  } catch (e) {
    next(e);
  }
});

export default router;
