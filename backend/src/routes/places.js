import express from "express";
import Place from "../models/Place.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const q = type ? { type } : {};
    const items = await Place.find(q).sort({ name: 1 }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Place.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
