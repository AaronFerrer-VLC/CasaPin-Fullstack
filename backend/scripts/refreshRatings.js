import dotenv from "dotenv";
import mongoose from "mongoose";
import Place from "../src/models/Place.js";
import { fetchPlaceDetails } from "../src/services/googlePlaces.js";

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!uri) throw new Error("Missing MONGODB_URI");
  if (!key) throw new Error("Missing GOOGLE_PLACES_API_KEY");

  await mongoose.connect(uri, {});
  const limit = parseInt(process.argv[2] || "100", 10);

  const places = await Place.find({ googlePlaceId: { $exists: true, $ne: null } })
                            .sort({ ratingUpdatedAt: 1 })
                            .limit(limit);

  let ok = 0, fail = 0;
  for (const p of places) {
    try {
      const d = await fetchPlaceDetails(p.googlePlaceId, key);
      p.rating = d.rating ?? p.rating ?? null;
      p.userRatingsTotal = d.userRatingsTotal ?? p.userRatingsTotal ?? null;
      p.ratingUpdatedAt = new Date();
      await p.save();
      ok++;
      console.log("✓", p.name, "→", p.rating, `(${p.userRatingsTotal})`);
      await new Promise(r => setTimeout(r, 150)); // pequeñísimo pacing
    } catch (e) {
      fail++;
      console.warn("✗", p.name, e.message);
    }
  }

  console.log("Done:", { updated: ok, failed: fail, total: places.length });
  await mongoose.disconnect();
}

main().catch(e => {
  console.error("Fatal:", e);
  process.exit(1);
});
