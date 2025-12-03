import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import CarCard from "@/components/CarCard";
import OwnerCard from "@/components/OwnerCard";

// Mock the API calls
jest.mock("@/lib/api", () => ({
  updateCar: jest.fn().mockResolvedValue({}),
  deleteCar: jest.fn().mockResolvedValue({}),
  deleteOwner: jest.fn().mockResolvedValue({}),
}));

// Mock window.confirm
global.confirm = jest.fn(() => true);

describe("CarCard", () => {
  const mockCar = { id: 1, brand: "Toyota", model: "Camry", year: 2020, ownerId: 5 };
  const mockOnUpdated = jest.fn();
  const mockOnDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders car info when not editing", () => {
    render(<CarCard car={mockCar} onUpdated={mockOnUpdated} onDeleted={mockOnDeleted} />);

    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText(/Model:/)).toHaveTextContent("Camry");
    expect(screen.getByText(/Year:/)).toHaveTextContent("2020");
    expect(screen.getByText(/Owner ID:/)).toHaveTextContent("5");
  });

  test("renders delete button", () => {
    render(<CarCard car={mockCar} onUpdated={mockOnUpdated} onDeleted={mockOnDeleted} />);

    // The IconButton should be present
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("displays car properties correctly", () => {
    const customCar = { id: 2, brand: "BMW", model: "X5", year: 2023, ownerId: 10 };
    render(<CarCard car={customCar} onUpdated={mockOnUpdated} onDeleted={mockOnDeleted} />);

    expect(screen.getByText("BMW")).toBeInTheDocument();
    expect(screen.getByText(/Model:/)).toHaveTextContent("X5");
    expect(screen.getByText(/Year:/)).toHaveTextContent("2023");
  });
});

describe("OwnerCard", () => {
  const mockOwner = { id: 1, name: "John Doe", email: "john@mail.com" };
  const mockOnUpdated = jest.fn();
  const mockOnDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays owner info when not editing", () => {
    render(<OwnerCard owner={mockOwner} onUpdated={mockOnUpdated} onDeleted={mockOnDeleted} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@mail.com")).toBeInTheDocument();
    expect(screen.getByText(/ID:/)).toHaveTextContent("1");
  });

  test("renders delete button", () => {
    render(<OwnerCard owner={mockOwner} onUpdated={mockOnUpdated} onDeleted={mockOnDeleted} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("displays owner properties correctly", () => {
    const customOwner = { id: 5, name: "Jane Smith", email: "jane@example.com" };
    render(<OwnerCard owner={customOwner} onUpdated={mockOnUpdated} onDeleted={mockOnDeleted} />);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText(/ID:/)).toHaveTextContent("5");
  });

  test("handles owner without email", () => {
    const ownerWithoutEmail = { id: 3, name: "Bob Johnson" };
    render(<OwnerCard owner={ownerWithoutEmail} onUpdated={mockOnUpdated} onDeleted={mockOnDeleted} />);

    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.queryByText("@")).not.toBeInTheDocument();
  });
});
