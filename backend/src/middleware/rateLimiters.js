import rateLimit from "express-rate-limit";

// Rate limiting general
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: "Demasiadas peticiones desde esta IP, intenta más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  // En producción, usar store compartido si hay múltiples instancias
  skip: (req) => {
    // Permitir health checks sin límite
    return req.path === "/api/health";
  },
});

// Rate limiting para contacto (más restrictivo)
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 emails por 15 minutos
  message: "Demasiados intentos de contacto. Intenta más tarde.",
  skipSuccessfulRequests: true, // No contar requests exitosos
  standardHeaders: true,
  legacyHeaders: false,
});

