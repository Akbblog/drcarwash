"use client";

import { useState } from "react";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      // 1. Call our API route
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // 2. Redirect to the Stripe URL returned by the API
      window.location.href = data.url;

    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start checkout. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full py-4 bg-[#ff3366] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#ff1149] hover:shadow-[0_10px_30px_rgba(255,51,102,0.3)] transition-all disabled:opacity-50"
    >
      {loading ? "INITIALIZING..." : "ACTIVATE PLAN ($249/mo)"}
    </button>
  );
}