// app/admin/page.tsx
import { withAdmin } from "@/lib/withAdmin";
import { Dashboard } from "@/components/admin/Dashboard";

/**
 * Render the Admin Dashboard only for users whose session.user.role === "admin".
 */
export default withAdmin(function AdminPage() {
  return <Dashboard />;
});