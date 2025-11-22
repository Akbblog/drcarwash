// ...existing code...
"use client"; // <-- server component page using the client guard

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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

  // UI state for user CRUD
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // load data when the component mounts
  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, usersRes, carsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users"),
          fetch("/api/admin/cars"),
        ]);

        setStats(await statsRes.json());
        setUsers(await usersRes.json());
        setCars(await carsRes.json());
      } catch (err) {
        console.error("Failed loading admin data", err);
      }
    }
    loadData();
  }, []);

  // helper to refresh users from server
  async function refreshUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to refresh users", err);
    }
  }

  // Create user
  async function createUser(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      await refreshUsers();
      setShowCreate(false);
      setForm({ name: "", email: "", role: "user" });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  // Update user
  async function updateUser(e?: React.FormEvent) {
    e?.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      await refreshUsers();
      setEditingUser(null);
      setForm({ name: "", email: "", role: "user" });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  // Delete user
  async function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setUsers((u) => u.filter((x) => x.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  }

  // prepare form for edit
  function startEdit(user: any) {
    setEditingUser(user);
    setForm({ name: user.name || "", email: user.email || "", role: user.role || "user" });
    setShowCreate(false);
  }

  // loading session status
  if (!session?.user) {
    return <p className="p-8 text-white">Loading session…</p>;
  }

  // site color: uses CSS variable --site-color with fallback
  const headerStyle = { background: "linear-gradient(90deg, var(--site-color, #0ea5a8), rgba(14,165,168,0.8))" };

  return (
    <div className="p-8 space-y-6 text-white">
      <header style={headerStyle} className="rounded-xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-sm opacity-90">Manage users, cars and view stats</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            className="px-4 py-2 bg-black/30 hover:bg-black/40 rounded-md text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* KPI cards */}
      <Stats {...stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users column */}
        <div className="bg-[#111] rounded-xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowCreate((s) => !s);
                  setEditingUser(null);
                  setForm({ name: "", email: "", role: "user" });
                }}
                className="px-3 py-1 rounded bg-white/8 hover:bg-white/12"
              >
                {showCreate ? "Close" : "New User"}
              </button>
            </div>
          </div>

          {error && <div className="text-red-400 mb-3">{error}</div>}

          {/* create / edit form */}
          {(showCreate || editingUser) && (
            <form onSubmit={editingUser ? updateUser : createUser} className="mb-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Name"
                  className="p-2 rounded bg-[#0d0d0d] border border-white/6"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Email"
                  className="p-2 rounded bg-[#0d0d0d] border border-white/6"
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="p-2 rounded bg-[#0d0d0d] border border-white/6"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded bg-white/10 hover:bg-white/16"
                >
                  {editingUser ? (loading ? "Saving..." : "Save") : loading ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setEditingUser(null);
                    setForm({ name: "", email: "", role: "user" });
                  }}
                  className="px-4 py-2 rounded bg-white/6"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* users as cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.length === 0 && <div className="text-sm opacity-80">No users found</div>}

            {users.map((u) => (
              <div key={u.id} className="bg-[#0b0b0b] p-4 rounded-lg border border-white/6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{u.name || "—"}</div>
                    <div className="text-sm opacity-80">{u.email}</div>
                    <div className="text-xs mt-2 inline-block px-2 py-1 bg-white/6 rounded">{u.role}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(u)}
                        className="px-2 py-1 text-sm rounded bg-white/8 hover:bg-white/12"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="px-2 py-1 text-sm rounded bg-red-600/80 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="text-xs opacity-70">{u.createdAt ? new Date(u.createdAt).toLocaleString() : null}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cars column (unchanged but included) */}
        <div className="bg-[#111] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Cars</h2>
          <CarsTable cars={cars} />
        </div>
      </div>
    </div>
  );
}
// ...existing code...