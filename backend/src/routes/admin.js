import express from "express";
import Place from "../models/Place.js";
import { fetchPlaceDetails } from "../services/googlePlaces.js";

const router = express.Router();

// Protección simple por token de cabecera Authorization: Bearer <ADMIN_TOKEN>
function requireAdmin(req, res, next) {
  const auth = req.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

/**
 * POST /api/admin/refresh-ratings
 * Refresca rating/userRatingsTotal de los places que tengan googlePlaceId.
 * Query opcional: ?limit=50
 */
router.post("/refresh-ratings", requireAdmin, async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return res.status(500).json({ ok: false, error: "Missing GOOGLE_PLACES_API_KEY" });

  const limit = Math.min(parseInt(req.query.limit || "100", 10), 200);
  const places = await Place.find({ googlePlaceId: { $exists: true, $ne: null } })
                            .sort({ ratingUpdatedAt: 1 })
                            .limit(limit);

  let ok = 0, fail = 0;
  const results = [];

  for (const p of places) {
    try {
      const d = await fetchPlaceDetails(p.googlePlaceId, apiKey);
      p.rating = d.rating ?? p.rating ?? null;
      p.userRatingsTotal = d.userRatingsTotal ?? p.userRatingsTotal ?? null;
      p.ratingUpdatedAt = new Date();
      // Si no tienes url o prefieres la de Google, puedes setear:
      // if (!p.url && d.googleUrl) p.url = d.googleUrl;
      await p.save();
      ok++;
      results.push({ id: p._id, name: p.name, rating: p.rating, userRatingsTotal: p.userRatingsTotal });
    } catch (e) {
      fail++;
      results.push({ id: p._id, name: p.name, error: e.message });
    }
  }

  res.json({ ok: true, updated: ok, failed: fail, total: places.length, results });
});

export default router;
