// app/admin/page.tsx
import { withAdmin } from "@/lib/withAdmin";
import { Dashboard } from "@/components/admin/Dashboard";

export default withAdmin(function AdminPage() {
  return <Dashboard />;
});