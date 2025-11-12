"use client";

import { registerUser } from "@/app/actions/register";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");
    const result = await registerUser(formData);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 relative overflow-hidden">
       {/* Background ambiance */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,51,102,0.1),_transparent_50%)]"></div>

      <div className="w-full max-w-md bg-[#111] p-10 rounded-xl border border-white/5 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
            Join the <span className="text-[#ff3366]">Club</span>
          </h1>
          <p className="text-[#999] text-sm uppercase tracking-widest">Premium Car Care Awaits</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">Full Name</label>
            <input type="text" name="name" required placeholder="JOHN DOE" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff3366] transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">Email Address</label>
            <input type="email" name="email" required placeholder="JOHN@EXAMPLE.COM" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff3366] transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] text-[#999] uppercase tracking-widest mb-2">Password</label>
            <input type="password" name="password" required placeholder="••••••••" minLength={6} className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff3366] transition-colors" />
          </div>

          <button type="submit" className="w-full py-4 bg-[#ff3366] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#ff1149] hover:shadow-[0_10px_30px_rgba(255,51,102,0.3)] transition-all">
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-[#999] text-sm">
          Already a member?{" "}
          <Link href="/login" className="text-[#ff3366] font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}