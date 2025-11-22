// lib/withAdmin.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function withAdmin<P>(Component: React.ComponentType<P>) {
  return function Wrapped(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <p>Loading…</p>;

    if (!session) {
      router.push("/login");
      return null;
    }

    if (session.user.role !== "admin") {
      return (
        <p className="text-red-500">You do not have permission to view this page.</p>
      );
    }

    return <Component {...props} />;
  };
}