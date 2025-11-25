import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import contactRouter from "../contact.js";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    })),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/contact", contactRouter);

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env.CONTACT_TO = "test@example.com";
  });

  it("debe rechazar request sin email", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Test",
      message: "Test message with enough characters",
    });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("debe rechazar email inválido", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Test",
      email: "invalid-email",
      message: "Test message with enough characters",
    });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("debe rechazar mensaje muy corto", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Test",
      email: "test@example.com",
      message: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("debe aceptar request válido", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Test User",
      email: "test@example.com",
      message: "This is a valid message with enough characters",
    });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

