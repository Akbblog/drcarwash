// components/admin/Table.tsx
export function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">{children}</table>
    </div>
  );
}