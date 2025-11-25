import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaceCard from "../PlaceCard";

describe("PlaceCard", () => {
  const mockPlace = {
    _id: "123",
    name: "Test Beach",
    type: "beach",
    description: "A beautiful test beach",
    rating: 4.5,
    address: "Test Address",
    url: "https://example.com",
    images: ["https://example.com/image.jpg"],
    coords: { lat: 43.5, lng: -5.4 },
  };

  it("debe renderizar el nombre del lugar", () => {
    render(<PlaceCard p={mockPlace} />);
    expect(screen.getByText("Test Beach")).toBeInTheDocument();
  });

  it("debe renderizar el rating si está disponible", () => {
    render(<PlaceCard p={mockPlace} />);
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
  });

  it("debe renderizar el tipo y dirección", () => {
    render(<PlaceCard p={mockPlace} />);
    expect(screen.getByText(/beach/)).toBeInTheDocument();
  });

  it("debe manejar lugares sin imagen", () => {
    const placeWithoutImage = { ...mockPlace, images: [] };
    render(<PlaceCard p={placeWithoutImage} />);
    expect(screen.getByText(/Sin imagen/)).toBeInTheDocument();
  });
});

