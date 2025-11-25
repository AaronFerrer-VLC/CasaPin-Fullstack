import { Router } from "express";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import { contactLimiter } from "../middleware/rateLimiters.js";

const router = Router();
const CONTACT_TO = process.env.CONTACT_TO || "";

router.post(
  "/",
  contactLimiter,
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("El nombre debe tener entre 2 y 100 caracteres")
      .escape(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email inválido")
      .normalizeEmail(),
    body("message")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("El mensaje debe tener entre 10 y 2000 caracteres")
      .escape(),
    body("dates").optional().trim().escape(),
  ],
  async (req, res) => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        errors: errors.array(),
      });
    }

    try {
      const { name, email, message, dates } = req.body;

      if (!CONTACT_TO) {
        console.warn("CONTACT_TO not set. Skipping email send.");
        return res.status(202).json({ ok: true, skipped: "CONTACT_TO missing" });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      });

      // Sanitizar email para evitar inyección de headers
      const safeEmail = email.replace(/[\r\n]/g, "");
      const safeName = name.replace(/[\r\n]/g, "");

      await transporter.sendMail({
        to: CONTACT_TO,
        from: `"${safeName}" <${process.env.SMTP_USER || "no-reply@casapin.es"}>`,
        replyTo: safeEmail,
        subject: `Consulta Casa Pin: ${safeName}`,
        text: `Nombre: ${safeName}\nEmail: ${safeEmail}\nFechas: ${dates || "No especificadas"}\n\nMensaje:\n${message}`,
        html: `
          <h2>Nueva consulta desde Casa Pin</h2>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Fechas:</strong> ${dates || "No especificadas"}</p>
          <hr>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      res.json({ ok: true });
    } catch (e) {
      console.error("contact error:", e.message);
      // No exponer detalles del error al cliente
      res.status(500).json({
        ok: false,
        error: "Error al enviar el mensaje. Inténtalo más tarde.",
      });
    }
  }
);

export default router;


