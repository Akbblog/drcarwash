// components/admin/UsersTable.tsx
import React from "react";
import { format } from "date-fns";

export function UsersTable({ users }: { users: any[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-700 text-sm">
      <thead>
        <tr className="text-left text-gray-300">
          <th className="px-2 py-2">Name</th>
          <th className="px-2 py-2">Email</th>
          <th className="px-2 py-2">Role</th>
          <th className="px-2 py-2">Last Login</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {users.map((u) => (
          <tr key={u._id} className="text-gray-300 hover:bg-gray-800">
            <td className="px-2 py-1">{u.name || u.email}</td>
            <td className="px-2 py-1">{u.email}</td>
            <td className="px-2 py-1">{u.role || "user"}</td>
            <td className="px-2 py-1">
              {u.lastLogin
                ? format(new Date(u.lastLogin), "PPP")
                : "Never"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}