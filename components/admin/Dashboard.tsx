// components/admin/Dashboard.tsx
import { useEffect, useState } from "react";
import { UserTable } from "./UserTable";
import { CarTable } from "./CarTable";

export function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [u, c] = await Promise.all([
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/cars").then((r) => r.json()),
      ]);
      setUsers(u);
      setCars(c);
    }
    load();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <UserTable users={users} />
      <CarTable cars={cars} />
    </main>
  );
}