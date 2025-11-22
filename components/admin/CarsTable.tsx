// components/admin/CarsTable.tsx
import React from "react";

export function CarsTable({ cars }: { cars: any[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-700 text-sm">
      <thead>
        <tr className="text-left text-gray-300">
          <th className="px-2 py-2">Owner</th>
          <th className="px-2 py-2">Make</th>
          <th className="px-2 py-2">Model</th>
          <th className="px-2 py-2">Year</th>
          <th className="px-2 py-2">VIN</th>
          <th className="px-2 py-2">Active</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {cars.map((c) => (
          <tr key={c._id} className="text-gray-300 hover:bg-gray-800">
            <td className="px-2 py-1">
              {c.owner ? c.owner.name : "Unknown"}
            </td>
            <td className="px-2 py-1">{c.make}</td>
            <td className="px-2 py-1">{c.model}</td>
            <td className="px-2 py-1">{c.year}</td>
            <td className="px-2 py-1">{c.vin}</td>
            <td className="px-2 py-1">{c.isActive ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}