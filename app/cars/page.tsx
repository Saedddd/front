/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useMemo } from "react";
import { fetchCars, createCar } from "@/lib/api";
import CarCard from "@/components/CarCard";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CarsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [ownerId, setOwnerId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 фильтр / сортировка / пагинация
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"brand" | "year">("brand");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  async function loadCars() {
    try {
      setError(null);
      const data = await fetchCars();
      setCars(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    loadCars();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim()) return setError("Введите название марки");

    try {
      setError(null);
      await createCar({
        brand,
        model,
        year: year ? Number(year) : 0,
        ownerId: ownerId ? Number(ownerId) : 0,
      });
      setBrand("");
      setModel("");
      setYear("");
      setOwnerId("");
      await loadCars();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 🔎 фильтрация и сортировка
  const filteredCars = useMemo(() => {
    let result = cars.filter(
      (c) =>
        c.brand.toLowerCase().includes(search.toLowerCase()) ||
        c.model.toLowerCase().includes(search.toLowerCase())
    );

    result = result.sort((a, b) => {
      if (sortBy === "brand") {
        return sortOrder === "asc"
          ? a.brand.localeCompare(b.brand)
          : b.brand.localeCompare(a.brand);
      } else {
        return sortOrder === "asc" ? a.year - b.year : b.year - a.year;
      }
    });

    return result;
  }, [cars, search, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 🧾 Экспорт CSV
  const exportToCSV = () => {
    if (filteredCars.length === 0) return setError("Нет данных для экспорта");

    const headers = ["ID", "Brand", "Model", "Year", "Owner ID"];
    const rows = filteredCars.map((car) => [
      car.id,
      car.brand,
      car.model,
      car.year,
      car.ownerId,
    ]);

    const csvContent =
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cars_export.csv";
    link.click();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        ⏳ Загрузка автомобилей...
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-indigo-700">🚗 Cars</h1>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 p-2 rounded-md text-black"
          />
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="brand">Sort by Brand</option>
          <option value="year">Sort by Year</option>
        </select>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          }
          className="bg-indigo-500 text-white px-4 py-2 rounded-md"
        >
          {sortOrder === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Форма */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 bg-white shadow-md p-4 rounded-xl border"
      >
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand"
          className="border p-2 rounded-md text-black"
        />
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model"
          className="border p-2 rounded-md text-black"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          placeholder="Year"
          className="border p-2 rounded-md text-black"
        />
        <input
          type="number"
          value={ownerId}
          onChange={(e) => setOwnerId(Number(e.target.value))}
          placeholder="Owner ID"
          className="border p-2 rounded-md text-black"
        />
        <button
          className="col-span-1 sm:col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition"
          type="submit"
        >
          ➕ Add Car
        </button>
      </form>

      {/* Список */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedCars.length > 0 ? (
          paginatedCars.map((c) => (
            <CarCard
              key={c.id}
              car={c}
              onUpdated={loadCars}
              onDeleted={loadCars}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">Нет добавленных машин.</p>
        )}
      </div>

      {/* пагинация */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          ⬅️ Prev
        </button>
        <span className="text-gray-700">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}
