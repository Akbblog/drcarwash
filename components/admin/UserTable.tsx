// components/admin/UserTable.tsx
import { Table } from "./Table";

export function UserTable({ users }: { users: any[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <Table>
        <thead>
          <tr className="text-left text-sm font-medium">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Last login</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-700">
          {users.map((u) => (
            <tr key={u._id}>
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2">
                {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}