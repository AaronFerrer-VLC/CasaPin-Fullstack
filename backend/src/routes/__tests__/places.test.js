import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import express from "express";
import placesRouter from "../places.js";
import Place from "../../models/Place.js";

const app = express();
app.use(express.json());
app.use("/api/places", placesRouter);

describe("GET /api/places", () => {
  let testPlace;

  beforeEach(async () => {
    // Conectar a base de datos de test
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/casapin-test");
    }
    // Esperar a que la conexión esté lista
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once("connected", resolve);
      });
    }
    // Limpiar colección
    await Place.deleteMany({});
    // Crear lugar de prueba
    testPlace = await Place.create({
      name: "Test Beach",
      type: "beach",
      description: "A test beach",
      rating: 4.5,
      coords: { lat: 43.5, lng: -5.4 },
    });
  });

  afterEach(async () => {
    await Place.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("debe retornar lista de lugares", async () => {
    const res = await request(app).get("/api/places");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("debe filtrar por tipo", async () => {
    const res = await request(app).get("/api/places?type=beach");

    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.type === "beach")).toBe(true);
  });

  it("debe retornar lugar por ID", async () => {
    const res = await request(app).get(`/api/places/${testPlace._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(testPlace._id.toString());
  });

  it("debe rechazar ID inválido", async () => {
    const res = await request(app).get("/api/places/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("debe retornar 404 para lugar inexistente", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/places/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});
