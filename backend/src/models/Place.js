import mongoose from "mongoose";

const CoordsSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["restaurant","beach","activity","poi"], required: true },
  description: { type: String, default: "" },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  address: { type: String, default: "" },
  url: { type: String, default: "" },
  images: [{ type: String }],
  coords: { type: CoordsSchema, required: true }
}, { timestamps: true });

export default mongoose.model("Place", PlaceSchema);
