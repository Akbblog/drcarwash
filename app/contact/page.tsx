"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const form = e.target;

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-6 md:p-12">
      <div className="max-w-[900px] mx-auto">

        {/* HEADER */}
        <div className="mb-12 pb-6 border-b border-white/10">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
            Contact <span className="text-[#ff3366]">Support</span>
          </h1>
          <p className="text-[#777] text-sm">
            We're here to help — reach out anytime.
          </p>
        </div>

        {/* CONTACT FORM */}
        <motion.div
          className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-white uppercase tracking-widest font-bold mb-6">
            Send Us a Message
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">
                Your Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#ff3366] transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#ff3366] transition-colors"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#ff3366] transition-colors"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-bold uppercase tracking-widest text-xs transition-all
                ${
                  loading
                    ? "bg-[#444] text-white/50 cursor-not-allowed"
                    : "bg-white text-black hover:bg-[#ff3366] hover:text-white"
                }
              `}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* STATUS MESSAGES */}
          {status === "success" && (
            <p className="text-green-400 text-xs mt-4">
              ✓ Your message has been sent. We’ll get back to you shortly.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs mt-4">
              ⚠ Something went wrong. Please try again later.
            </p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
