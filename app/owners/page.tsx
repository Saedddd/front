/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useMemo } from "react";
import { fetchOwners, createOwner } from "@/lib/api";
import OwnerCard from "@/components/OwnerCard";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OwnersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [owners, setOwners] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔎 фильтр / сортировка / пагинация
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 3; // ⬅️ только 3 владельца на страницу

  async function loadOwners() {
    try {
      setError(null);
      const data = await fetchOwners();
      setOwners(data);
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
    loadOwners();
  }, [user]);

  // ➕ Добавление владельца
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setError(null);
      await createOwner({ name, email });
      setName("");
      setEmail("");
      await loadOwners();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 🔍 Фильтрация и сортировка
  const filteredOwners = useMemo(() => {
    let result = owners.filter(
      o => o.name.toLowerCase().includes(search.toLowerCase()) || o.email?.toLowerCase().includes(search.toLowerCase()),
    );

    result = result.sort((a, b) => {
      const field = sortBy;
      return sortOrder === "asc"
        ? (a[field] || "").localeCompare(b[field] || "")
        : (b[field] || "").localeCompare(a[field] || "");
    });

    return result;
  }, [owners, search, sortBy, sortOrder]);

  // 📄 Пагинация
  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const paginatedOwners = filteredOwners.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // 🧾 Экспорт CSV
  const exportToCSV = () => {
    if (filteredOwners.length === 0) {
      setError("Нет данных для экспорта");
      return;
    }

    const headers = ["ID", "Name", "Email"];
    const rows = filteredOwners.map(o => [o.id, o.name, o.email || ""]);
    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "owners_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40 text-gray-500">⏳ Загрузка владельцев...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🔹 Верхняя панель */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-indigo-700">👤 Owners</h1>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="🔍 Поиск..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 p-2 rounded-md text-white"
          />

          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {/* 🔹 Сортировка */}
      <div className="flex gap-3 mb-4">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="border border-gray-300 rounded-md p-2 text-white"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md"
        >
          {sortOrder === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* 🔹 Форма создания владельца */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-6 bg-white shadow-md p-4 rounded-xl border"
      >
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter owner name..."
          className="border border-gray-300 p-2 rounded-md flex-1 text-black focus:ring-2 focus:ring-indigo-500"
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter owner email..."
          className="border border-gray-300 p-2 rounded-md flex-1 text-black focus:ring-2 focus:ring-indigo-500"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition" type="submit">
          ➕ Add
        </button>
      </form>

      {/* 🔹 Список владельцев */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedOwners.length > 0 ? (
          paginatedOwners.map(o => <OwnerCard key={o.id} owner={o} onUpdated={loadOwners} onDeleted={loadOwners} />)
        ) : (
          <p className="text-gray-500 text-center">Нет владельцев.</p>
        )}
      </div>

      {/* 🔹 Пагинация */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          ⬅️ Prev
        </button>

        <span className="text-gray-700">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}
