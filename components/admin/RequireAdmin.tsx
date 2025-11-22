// components/admin/RequireAdmin.tsx
"use client";                     // ✅ this file is client‑only

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export function RequireAdmin({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 1️⃣ Loading state
  if (status === "loading") return <p>Loading…</p>;

  // 2️⃣ Not signed in → redirect to /login
  if (!session?.user) {
    router.replace("/login");
    return null; // nothing while redirecting
  }

  // 3️⃣ Not an admin → deny
  if ((session.user as { role?: string }).role !== "admin") {
    console.warn("User not admin:", session.user);
    return (
      <p className="text-red-500">
        You do not have permission to view this page.
      </p>
    );
  }

  // 4️⃣ Authorized → show the protected UI
  return <>{children}</>;
}