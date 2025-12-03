// lib/api.ts
export const API_URL = "http://localhost:8080";

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// === AUTH ===
export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.text();
}

// === OWNERS ===
export async function fetchOwners() {
  const res = await fetch(`${API_URL}/owners`, {
    headers: authHeader() as HeadersInit,
  });
  if (!res.ok) throw new Error("Failed to fetch owners");
  return res.json();
}

export async function createOwner(owner: { name: string; email: string }) {
  const res = await fetch(`${API_URL}/owners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    } as HeadersInit,
    body: JSON.stringify(owner),
  });
  if (!res.ok) throw new Error("Failed to create owner");
  return res.json();
}


export async function deleteOwner(id: number) {
  const res = await fetch(`${API_URL}/owners/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete owner");
}

// === CARS ===
export async function fetchCars() {
  const res = await fetch(`${API_URL}/cars`, {
    headers: authHeader() as HeadersInit,
  });
  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json();
}

export async function createCar(car: {
  brand: string;
  model: string;
  year: number;
  ownerId: number;
}) {
  const res = await fetch(`${API_URL}/cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    } as HeadersInit,
    body: JSON.stringify(car),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create car: ${errorText}`);
  }

  return res.json();
}

export async function updateCar(
  id: number,
  car: {
    brand: string;
    model: string;
    year: number;
    ownerId: number;
  }
) {
  const res = await fetch(`${API_URL}/cars/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    } as HeadersInit,
    body: JSON.stringify(car),
  });
  if (!res.ok) throw new Error("Failed to update car");
  return res.json();
}

export async function deleteCar(id: number) {
  const res = await fetch(`${API_URL}/cars/${id}`, {
    method: "DELETE",
    headers: authHeader() as HeadersInit,
  });
  if (!res.ok) throw new Error("Failed to delete car");
  return true;
}

