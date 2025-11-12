import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0a0a0a] text-center px-6">
      <h1 className="text-[#ff3366] text-9xl font-black mb-4">404</h1>
      <h2 className="text-white text-2xl uppercase tracking-widest font-bold mb-6">Page Not Found</h2>
      <p className="text-[#999] mb-8">The route you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-8 py-3 bg-[#ff3366] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#ff1149] transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}