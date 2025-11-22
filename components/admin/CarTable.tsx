// components/admin/CarTable.tsx
import { Table } from "./Table";

export function CarTable({ cars }: { cars: any[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Cars</h2>
      <Table>
        <thead>
          <tr className="text-left text-sm font-medium">
            <th className="px-4 py-2">Owner</th>
            <th className="px-4 py-2">Make</th>
            <th className="px-4 py-2">Model</th>
            <th className="px-4 py-2">Year</th>
            <th className="px-4 py-2">Active</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-700">
          {cars.map((c) => (
            <tr key={c._id}>
              <td className="px-4 py-2">{c.owner?.name ?? "Unknown"}</td>
              <td className="px-4 py-2">{c.make}</td>
              <td className="px-4 py-2">{c.model}</td>
              <td className="px-4 py-2">{c.year ?? "?"}</td>
              <td className="px-4 py-2">{c.isActive ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}