// components/admin/Stats.tsx
import React from "react";

export function Stats({
  userCount,
  activeUsers,
  carCount,
}: {
  userCount: number;
  activeUsers: number;
  carCount: number;
}) {
  const cards = [
    {
      title: "Total Users",
      value: userCount,
      icon: "👥",
      bg: "bg-blue-600",
    },
    {
      title: "Active Users (30 days)",
      value: activeUsers,
      icon: "🟢",
      bg: "bg-green-600",
    },
    {
      title: "Total Cars",
      value: carCount,
      icon: "🚗",
      bg: "bg-purple-600",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className={`flex flex-1 items-center p-4 rounded-xl shadow-md ${c.bg} text-white`}
        >
          <span className="text-4xl mr-4">{c.icon}</span>
          <div>
            <p className="text-sm">{c.title}</p>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}