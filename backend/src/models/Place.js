import mongoose from "mongoose";

// Validación personalizada para coordenadas
const validateLatitude = (lat) => {
  return typeof lat === "number" && lat >= -90 && lat <= 90;
};

const validateLongitude = (lng) => {
  return typeof lng === "number" && lng >= -180 && lng <= 180;
};

const PlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    type: {
      type: String,
      enum: ["beach", "restaurant", "activity", "poi"],
      required: true,
    },
    description: { type: String, default: "", maxlength: 2000 },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      validate: {
        validator: Number.isFinite,
        message: "Rating debe ser un número válido",
      },
    },
    address: { type: String, default: "", maxlength: 500 },
    url: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          if (!v) return true; // URL opcional
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "URL inválida",
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((url) => {
            if (!url) return false;
            try {
              new URL(url);
              return true;
            } catch {
              return false;
            }
          });
        },
        message: "Todas las imágenes deben ser URLs válidas",
      },
    },
    coords: {
      lat: {
        type: Number,
        required: true,
        validate: {
          validator: validateLatitude,
          message: "Latitud debe estar entre -90 y 90",
        },
      },
      lng: {
        type: Number,
        required: true,
        validate: {
          validator: validateLongitude,
          message: "Longitud debe estar entre -180 y 180",
        },
      },
    },
    googlePlaceId: { type: String, index: true, sparse: true },
    userRatingsTotal: { type: Number, min: 0, default: null },
    ratingUpdatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Índice geográfico para búsquedas por proximidad
PlaceSchema.index({ coords: "2dsphere" });

// Índice compuesto para búsquedas comunes
PlaceSchema.index({ type: 1, rating: -1 });

export default mongoose.model("Place", PlaceSchema);
