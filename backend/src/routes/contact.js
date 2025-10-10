import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const to = process.env.CONTACT_TO;
    if (!to) return res.json({ ok: true, sent: false });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: (process.env.SMTP_USER && process.env.SMTP_PASS) ? {
        user: process.env.SMTP_USER, pass: process.env.SMTP_PASS
      } : undefined
    });

    await transporter.sendMail({
      from: email,
      to,
      subject: `CasaPin contacto: ${name}`,
      text: message
    });

    res.json({ ok: true, sent: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
