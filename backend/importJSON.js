import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./src/models/Place.js";

dotenv.config({ path: ".env" });

const file = process.argv[2];
if (!file) {
  console.error("Uso: node importJSON.js data.json");
  process.exit(1);
}
const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const docs = Array.isArray(raw) ? raw : raw.places || [];
    if (!docs.length) throw new Error("JSON vacío o sin campo 'places'");
    await Place.insertMany(docs);
    console.log("Import OK:", docs.length);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
