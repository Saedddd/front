"use client";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex gap-4">
          <Link href="/" className="text-xl font-bold text-indigo-700">
            Home
          </Link>
          <Link href="/owners" className="hover:text-indigo-500 text-slate-600">
            Owners
          </Link>
          <Link href="/cars" className="hover:text-indigo-500 text-slate-600">
            Cars
          </Link>
        </div>
        <div>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-indigo-600 mr-3">
                Login
              </Link>
              <Link href="/register" className="text-indigo-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
