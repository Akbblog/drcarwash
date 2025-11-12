"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // We will hook this up to a real email service later if needed.
    // For now, we just show the success state.
    setSubmitted(true);
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0a] p-6 relative overflow-hidden">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,51,102,0.05),_transparent_70%)]"></div>

      <div className="w-full max-w-md bg-[#111] p-10 rounded-xl border border-white/5 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
            Reset Password
          </h1>
          <p className="text-[#999] text-xs uppercase tracking-widest">
            Secure account recovery
          </p>
        </div>

        {submitted ? (
          <div className="text-center animation-fadeIn">
            <div className="text-6xl mb-6">📨</div>
            <h3 className="text-white font-bold mb-2 uppercase tracking-wider">Check your inbox</h3>
            <p className="text-[#999] text-sm mb-8">
              If an account exists for that email, we have sent password reset instructions.
            </p>
            <Link href="/login" className="text-[#ff3366] text-sm font-bold uppercase tracking-widest hover:underline">
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="JOHN@EXAMPLE.COM"
                className="w-full bg-black border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff3366] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-[#ff3366] hover:text-white transition-all"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-6">
              <Link href="/login" className="text-[#666] text-xs uppercase tracking-widest hover:text-white transition-colors">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}