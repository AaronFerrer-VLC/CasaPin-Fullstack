import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "../src/models/Place.js";

dotenv.config({ path: ".env" });

const sample = [
  {
    name: "Playa de Rodiles",
    type: "beach",
    description: "Una de las playas más famosas de Asturias, ideal para pasear y surfear.",
    rating: 4.7,
    address: "Villaviciosa, Asturias",
    url: "https://goo.gl/maps/4LZx2qJ4e3c",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop"],
    coords: { lat: 43.511, lng: -5.402 }
  },
  {
    name: "Restaurante El Molín de Mingo",
    type: "restaurant",
    description: "Cocina asturiana casera en un entorno rural precioso.",
    rating: 4.8,
    address: "Peruyes, Cangas de Onís",
    url: "https://goo.gl/maps/8eXvLh5WDutdQbKc6",
    images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1400&auto=format&fit=crop"],
    coords: { lat: 43.376, lng: -5.136 }
  },
  {
    name: "Lagos de Covadonga",
    type: "activity",
    description: "Ruta y miradores en Picos de Europa, vistas espectaculares.",
    rating: 4.9,
    address: "Cangas de Onís, Asturias",
    url: "https://goo.gl/maps/7V7uJgLwXxT2",
    images: ["https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=1400&auto=format&fit=crop"],
    coords: { lat: 43.271, lng: -4.999 }
  }
];

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI in .env");
    await mongoose.connect(uri);
    await Place.deleteMany({});
    await Place.insertMany(sample);
    console.log("Seed ok:", sample.length);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
