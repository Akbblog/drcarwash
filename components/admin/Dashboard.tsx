// components/admin/Dashboard.tsx
"use client"; // <-- server component page using the client guard

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UsersTable } from "./UserTable";
import { CarsTable } from "./CarsTable";
import { Stats } from "./Stats";
import { useRouter } from "next/navigation";

/**
 * Main admin dashboard page.
 * All data is loaded via the protected `/api/admin/*` endpoints.
 */
export function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  // local state
  const [stats, setStats] = useState({
    userCount: 0,
    activeUsers: 0,
    carCount: 0,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);

  // load data when the component mounts
  useEffect(() => {
    async function loadData() {
      const [statsRes, usersRes, carsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/admin/cars"),
      ]);

      setStats(await statsRes.json());
      setUsers(await usersRes.json());
      setCars(await carsRes.json());
    }
    loadData();
  }, []);

  // loading session status
  if (!session?.user) {
    return <p className="p-8 text-white">Loading session…</p>;
  }

  return (
    <div className="p-8 space-y-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* KPI cards */}
      <Stats {...stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <UsersTable users={users} />
        </div>

        <div className="bg-[#111] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Cars</h2>
          <CarsTable cars={cars} />
        </div>
      </div>
    </div>
  );
}