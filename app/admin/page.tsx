// app/admin/page.tsx
// ← this remains a **server component** (no "use client")

import { Dashboard } from "@/components/admin/Dashboard";
// Do NOT use dynamic import here.
import { RequireAdmin } from "@/components/admin/RequireAdmin";

export default function AdminPage() {
  return (
    <RequireAdmin>
      <Dashboard />
    </RequireAdmin>
  );
}