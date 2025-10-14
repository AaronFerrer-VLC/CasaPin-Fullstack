import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();
const CONTACT_TO = process.env.CONTACT_TO || "";

router.post("/", async (req, res) => {
  try {
    const { name = "", email = "", message = "" } = req.body || {};

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

    await transporter.sendMail({
      to: CONTACT_TO,
      from: email || "no-reply@casapin.es",
      subject: `Consulta Casa Pin: ${name || "Sin nombre"}`,
      text: message || "(sin mensaje)",
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("contact error:", e.message);
    res.status(500).json({ ok: false });
  }
});

export default router;


