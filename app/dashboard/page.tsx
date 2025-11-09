import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Garage</h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition">
              Sign Out
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session.user?.name}!</h2>
          <p className="text-slate-600">
            You are logged in as <strong>{session.user?.email}</strong>.
          </p>
          <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg">
            🚗 Your garage is currently empty. Add a car to get started.
          </div>
        </div>
      </div>
    </main>
  );
}
