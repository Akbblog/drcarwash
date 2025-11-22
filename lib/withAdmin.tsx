// lib/withAdmin.tsx
"use client"; // 👈 needed because of hooks

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function withAdmin<P extends {}>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function Wrapped(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <p>Loading…</p>;

    if (!session?.user) {
      router.replace("/login");
      return null;
    }

    const user = session.user as { role?: string };
    if (user.role !== "admin") {
      return <p className="text-red-500">You do not have permission.</p>;
    }

    return <Component {...props} />;
  };
}