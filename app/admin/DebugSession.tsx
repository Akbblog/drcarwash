// components/admin/DebugSession.tsx
"use client";
import { useSession } from "next-auth/react";

export function DebugSession() {
  const { data: session, status } = useSession();
  return (
    <pre>
      <code>
        {JSON.stringify({ session, status }, null, 2)}
      </code>
    </pre>
  );
}