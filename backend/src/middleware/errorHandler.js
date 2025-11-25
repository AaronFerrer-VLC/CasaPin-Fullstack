export const errorHandler = (err, req, res, _next) => {
  // Log del error (solo en desarrollo o si es crítico)
  if (process.env.NODE_ENV === "development" || err.status >= 500) {
    console.error("Error:", {
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });
  }

  // Errores de CORS
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      ok: false,
      error: "Origen no permitido",
    });
  }

  // Errores de rate limiting (vienen de express-rate-limit)
  if (err.status === 429) {
    return res.status(429).json({
      ok: false,
      error: err.message || "Demasiadas peticiones, intenta más tarde",
    });
  }

  // Errores de validación de Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      ok: false,
      error: "Error de validación",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Errores de cast (ObjectId inválido)
  if (err.name === "CastError") {
    return res.status(400).json({
      ok: false,
      error: "ID inválido",
    });
  }

  // Error de MongoDB duplicado
  if (err.code === 11000) {
    return res.status(409).json({
      ok: false,
      error: "Recurso duplicado",
    });
  }

  // Error genérico (no exponer detalles en producción)
  res.status(err.status || 500).json({
    ok: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
  });
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    ok: false,
    error: "Ruta no encontrada",
  });
};

